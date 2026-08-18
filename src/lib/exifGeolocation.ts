/**
 * JPEG EXIF reader for the Recon photo locator — GPS fix, capture time and camera body.
 *
 * Written by hand rather than pulled from npm for one reason: the initial bundle budget is
 * 200 KB gzip (`scripts/check-bundle-size.mjs`) and every EXIF package on npm is larger than
 * this file for the sake of tags Recon never reads. It parses only what a geolocation needs:
 * the APP1 segment, the TIFF header, IFD0, the Exif sub-IFD and the GPS sub-IFD.
 *
 * Scope is deliberate. EXIF GPS is a **real** fix written by the capturing device, so a hit
 * here is a measurement, not an inference. There is no image-content geolocation in this
 * module and none is implied: when a photo carries no fix, `readExifLocation` says so and the
 * caller falls back to matching text against known places. Stripped photos — anything that has
 * been through most social platforms — will land in that branch, which is the correct answer
 * rather than a failure.
 */

export interface ExifLocation {
  latitude: number;
  longitude: number;
  /** Metres above sea level, when the tag is present. */
  altitude?: number;
  /** Compass bearing the camera was facing, when present — used to orient the fly-in. */
  bearing?: number;
  /** EXIF DateTimeOriginal, as written (`YYYY:MM:DD HH:MM:SS`). */
  capturedAt?: string;
  /** Make + model, when present. */
  camera?: string;
}

const TAG_GPS_IFD = 0x8825;
const TAG_EXIF_IFD = 0x8769;
const TAG_MAKE = 0x010f;
const TAG_MODEL = 0x0110;
const TAG_DATETIME_ORIGINAL = 0x9003;

const GPS_LATITUDE_REF = 0x0001;
const GPS_LATITUDE = 0x0002;
const GPS_LONGITUDE_REF = 0x0003;
const GPS_LONGITUDE = 0x0004;
const GPS_ALTITUDE_REF = 0x0005;
const GPS_ALTITUDE = 0x0006;
const GPS_IMG_DIRECTION = 0x0011;

/** Bytes per TIFF component type, indexed by the type code. 0 marks a type we don't read. */
const TYPE_SIZES = [0, 1, 1, 2, 4, 8, 0, 1, 0, 4, 8];

interface Entry {
  type: number;
  count: number;
  /** Absolute offset into the TIFF block where the value bytes start. */
  offset: number;
}

type Ifd = Map<number, Entry>;

/** Locate the TIFF block inside a JPEG by walking the segment markers to APP1. */
function findTiffStart(view: DataView): number | null {
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) return null;
    const marker = view.getUint8(offset + 1);
    // Standalone markers carry no length payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    // Start of scan — pixel data follows, so any EXIF would already have been seen.
    if (marker === 0xda) return null;

    const length = view.getUint16(offset + 2);
    if (length < 2) return null;

    if (marker === 0xe1 && offset + 10 <= view.byteLength) {
      // "Exif\0\0" then the TIFF header.
      const isExif =
        view.getUint32(offset + 4) === 0x45786966 && view.getUint16(offset + 8) === 0x0000;
      if (isExif) return offset + 10;
    }
    offset += 2 + length;
  }
  return null;
}

function readIfd(view: DataView, tiff: number, ifdOffset: number, little: boolean): Ifd {
  const entries: Ifd = new Map();
  const base = tiff + ifdOffset;
  if (base + 2 > view.byteLength) return entries;

  const count = view.getUint16(base, little);
  for (let i = 0; i < count; i++) {
    const entry = base + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;

    const tag = view.getUint16(entry, little);
    const type = view.getUint16(entry + 2, little);
    const componentCount = view.getUint32(entry + 4, little);
    const size = (TYPE_SIZES[type] ?? 0) * componentCount;
    if (size === 0) continue;

    // Values of four bytes or fewer are stored inline in the offset field itself.
    const offset = size <= 4 ? entry + 8 : tiff + view.getUint32(entry + 8, little);
    if (offset + size > view.byteLength) continue;

    entries.set(tag, { type, count: componentCount, offset });
  }
  return entries;
}

/** Read a RATIONAL / SRATIONAL component as a number, guarding a zero denominator. */
function rationalAt(view: DataView, offset: number, little: boolean, signed: boolean): number {
  const numerator = signed ? view.getInt32(offset, little) : view.getUint32(offset, little);
  const denominator = signed
    ? view.getInt32(offset + 4, little)
    : view.getUint32(offset + 4, little);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

function readRationals(view: DataView, entry: Entry, little: boolean): number[] {
  const signed = entry.type === 10;
  const out: number[] = [];
  for (let i = 0; i < entry.count; i++) {
    out.push(rationalAt(view, entry.offset + i * 8, little, signed));
  }
  return out;
}

function readAscii(view: DataView, entry: Entry): string {
  let out = '';
  for (let i = 0; i < entry.count; i++) {
    const code = view.getUint8(entry.offset + i);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out.trim();
}

/** Degrees / minutes / seconds triple → signed decimal degrees. */
function dmsToDecimal(dms: number[], ref: string): number | null {
  if (dms.length < 3) return null;
  const [degrees, minutes, seconds] = dms;
  if (
    !Number.isFinite(degrees) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    degrees < 0 ||
    minutes < 0 ||
    minutes >= 60 ||
    seconds < 0 ||
    seconds >= 60
  ) {
    return null;
  }
  const magnitude = degrees + minutes / 60 + seconds / 3600;
  if (!Number.isFinite(magnitude)) return null;
  const negative = ref === 'S' || ref === 'W';
  return negative ? -magnitude : magnitude;
}

/**
 * Extract a GPS fix from a JPEG's EXIF block. Returns `null` when the file is not a JPEG,
 * carries no EXIF, or carries EXIF without a GPS sub-IFD — all of which are ordinary and
 * mean "this photo does not know where it was taken", not "parsing failed".
 */
function parseExifLocation(buffer: ArrayBuffer): ExifLocation | null {
  const view = new DataView(buffer);
  const tiff = findTiffStart(view);
  if (tiff === null || tiff + 8 > view.byteLength) return null;

  const byteOrder = view.getUint16(tiff);
  if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return null;
  const little = byteOrder === 0x4949;
  if (view.getUint16(tiff + 2, little) !== 0x002a) return null;

  const ifd0 = readIfd(view, tiff, view.getUint32(tiff + 4, little), little);

  const gpsPointer = ifd0.get(TAG_GPS_IFD);
  if (!gpsPointer) return null;
  const gps = readIfd(view, tiff, view.getUint32(gpsPointer.offset, little), little);

  const latEntry = gps.get(GPS_LATITUDE);
  const lonEntry = gps.get(GPS_LONGITUDE);
  const latRefEntry = gps.get(GPS_LATITUDE_REF);
  const lonRefEntry = gps.get(GPS_LONGITUDE_REF);
  if (!latEntry || !lonEntry || !latRefEntry || !lonRefEntry) return null;

  const latitude = dmsToDecimal(readRationals(view, latEntry, little), readAscii(view, latRefEntry));
  const longitude = dmsToDecimal(
    readRationals(view, lonEntry, little),
    readAscii(view, lonRefEntry),
  );
  if (latitude === null || longitude === null) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  // A 0,0 fix is Null Island — in practice a cleared or uninitialised tag, not the Atlantic.
  if (latitude === 0 && longitude === 0) return null;

  const location: ExifLocation = { latitude, longitude };

  const altitudeEntry = gps.get(GPS_ALTITUDE);
  if (altitudeEntry) {
    const [altitude] = readRationals(view, altitudeEntry, little);
    if (Number.isFinite(altitude)) {
      // Ref 1 means below sea level.
      const altitudeRef = gps.get(GPS_ALTITUDE_REF);
      const belowSeaLevel = altitudeRef ? view.getUint8(altitudeRef.offset) === 1 : false;
      location.altitude = belowSeaLevel ? -altitude : altitude;
    }
  }

  const directionEntry = gps.get(GPS_IMG_DIRECTION);
  if (directionEntry) {
    const [bearing] = readRationals(view, directionEntry, little);
    if (Number.isFinite(bearing)) location.bearing = ((bearing % 360) + 360) % 360;
  }

  const exifPointer = ifd0.get(TAG_EXIF_IFD);
  if (exifPointer) {
    const exif = readIfd(view, tiff, view.getUint32(exifPointer.offset, little), little);
    const captured = exif.get(TAG_DATETIME_ORIGINAL);
    if (captured) location.capturedAt = readAscii(view, captured);
  }

  const make = ifd0.get(TAG_MAKE);
  const model = ifd0.get(TAG_MODEL);
  const camera = [make && readAscii(view, make), model && readAscii(view, model)]
    .filter(Boolean)
    .join(' ');
  if (camera) location.camera = camera;

  return location;
}

/** Malformed metadata is equivalent to absent metadata; it must never break the upload flow. */
export function readExifLocation(buffer: ArrayBuffer): ExifLocation | null {
  try {
    return parseExifLocation(buffer);
  } catch (error) {
    if (error instanceof RangeError) return null;
    throw error;
  }
}

/**
 * Pull a coordinate pair out of free text — a filename, a caption, a pasted string. Handles
 * decimal pairs (`51.1256, 1.3226`), the `@lat,lng` form map apps copy, and DMS with hemisphere
 * letters (`51°07'32"N 1°19'21"E`). Order is assumed latitude-first, which is what every one of
 * those formats writes.
 */
export function parseCoordinateText(text: string): { latitude: number; longitude: number } | null {
  const dms =
    /(\d{1,3})[°:\s]\s*(\d{1,2})['′:\s]\s*([\d.]+)?["″\s]*\s*([NSns])[,\s]+(\d{1,3})[°:\s]\s*(\d{1,2})['′:\s]\s*([\d.]+)?["″\s]*\s*([EWew])/.exec(
      text,
    );
  if (dms) {
    const latitude = dmsToDecimal(
      [Number(dms[1]), Number(dms[2]), Number(dms[3] ?? 0)],
      dms[4].toUpperCase(),
    );
    const longitude = dmsToDecimal(
      [Number(dms[5]), Number(dms[6]), Number(dms[7] ?? 0)],
      dms[8].toUpperCase(),
    );
    if (
      latitude !== null &&
      longitude !== null &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180 &&
      !(latitude === 0 && longitude === 0)
    ) {
      return { latitude, longitude };
    }
  }

  const decimal = /(-?\d{1,3}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)/.exec(text);
  if (decimal) {
    const latitude = Number(decimal[1]);
    const longitude = Number(decimal[2]);
    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180 &&
      !(latitude === 0 && longitude === 0)
    ) {
      return { latitude, longitude };
    }
  }

  return null;
}
