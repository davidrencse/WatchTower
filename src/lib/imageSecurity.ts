const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;
const MAX_DIMENSION = 12_000;
const OUTPUT_DIMENSION = 4_096;

type BrowserRasterType = 'jpeg' | 'png' | 'webp' | 'gif' | 'avif';

export interface BrowserImageSecurityReport {
  detectedType: BrowserRasterType;
  width: number;
  height: number;
  originalSha256: string;
  sanitizedSha256: string;
  steganography: 'clear' | 'review';
  findings: string[];
}

export class BrowserImageSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrowserImageSecurityError';
  }
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.subarray(start, end));
}

function detectType(bytes: Uint8Array): BrowserRasterType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 12) === 'WEBP') return 'webp';
  if (['GIF87a', 'GIF89a'].includes(ascii(bytes, 0, 6))) return 'gif';
  if (ascii(bytes, 4, 8) === 'ftyp' && /(avif|avis|heic|heix|mif1)/.test(ascii(bytes, 8, 40))) return 'avif';
  return null;
}

function mimeFor(type: BrowserRasterType): string {
  return type === 'jpeg' ? 'image/jpeg' : type === 'avif' ? 'image/avif' : `image/${type}`;
}

function logicalEnd(bytes: Uint8Array, type: BrowserRasterType): number | null {
  if (type === 'jpeg') {
    for (let index = bytes.length - 2; index >= 0; index -= 1) {
      if (bytes[index] === 0xff && bytes[index + 1] === 0xd9) return index + 2;
    }
  }
  if (type === 'gif') {
    const end = bytes.lastIndexOf(0x3b);
    return end < 0 ? null : end + 1;
  }
  if (type === 'webp' && bytes.length >= 8) {
    return Math.min(bytes.length, new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(4, true) + 8);
  }
  if (type === 'png') {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const length = view.getUint32(offset);
      const end = offset + length + 12;
      if (end > bytes.length) return null;
      if (ascii(bytes, offset + 4, offset + 8) === 'IEND') return end;
      offset = end;
    }
  }
  return null;
}

function includesSequence(bytes: Uint8Array, signature: readonly number[]): boolean {
  outer: for (let index = 0; index <= bytes.length - signature.length; index += 1) {
    for (let offset = 0; offset < signature.length; offset += 1) {
      if (bytes[index + offset] !== signature[offset]) continue outer;
    }
    return true;
  }
  return false;
}

function hasPayloadMarker(bytes: Uint8Array): boolean {
  const text = new TextDecoder('latin1').decode(bytes).toLowerCase();
  return includesSequence(bytes, [0x4d, 0x5a]) ||
    includesSequence(bytes, [0x7f, 0x45, 0x4c, 0x46]) ||
    includesSequence(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    text.includes('<script') || text.includes('<?php') || text.includes('#!/bin/');
}

async function digestHex(input: ArrayBuffer | Blob): Promise<string> {
  const data = input instanceof Blob ? await input.arrayBuffer() : input;
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function lsbSteganalysis(data: Uint8ClampedArray, lossless: boolean): 'clear' | 'review' {
  if (!lossless || data.length < 40_000) return 'clear';
  const pairs = Array.from({ length: 128 }, () => [0, 0]);
  for (let index = 0; index < data.length; index += 4) {
    pairs[data[index] >> 1][data[index] & 1] += 1;
    pairs[data[index + 1] >> 1][data[index + 1] & 1] += 1;
    pairs[data[index + 2] >> 1][data[index + 2] & 1] += 1;
  }
  let chi = 0;
  let degrees = 0;
  for (const [zero, one] of pairs) {
    const total = zero + one;
    if (total < 20) continue;
    chi += ((zero - one) ** 2) / total;
    degrees += 1;
  }
  return degrees > 64 && chi / degrees < 0.12 ? 'review' : 'clear';
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new BrowserImageSecurityError('Could not create a safe image copy.'))),
      'image/jpeg',
      0.92,
    );
  });
}

/**
 * Decode an untrusted local image and replace its byte stream with a fresh JPEG.
 * Only this surrogate may be retained for preview or sent to the OSINT service.
 */
export async function prepareImageForDeepScan(
  file: File,
  inputBuffer?: ArrayBuffer,
): Promise<{ file: File; report: BrowserImageSecurityReport }> {
  if (!file.size || file.size > MAX_IMAGE_BYTES) {
    throw new BrowserImageSecurityError(`Choose an image smaller than ${MAX_IMAGE_BYTES / 1e6} MB.`);
  }
  const buffer = inputBuffer ?? await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const detectedType = detectType(bytes);
  if (!detectedType) {
    throw new BrowserImageSecurityError('Rejected: the file is not a supported raster image. SVG and disguised files are not accepted.');
  }

  const findings: string[] = [];
  const expectedMime = mimeFor(detectedType);
  if (file.type && file.type !== expectedMime) findings.push(`Declared ${file.type}; signature says ${expectedMime}.`);
  const originalSha256 = await digestHex(buffer);
  const end = logicalEnd(bytes, detectedType);
  if (end !== null && end < bytes.length) {
    const trailing = bytes.subarray(end);
    if (hasPayloadMarker(trailing)) {
      throw new BrowserImageSecurityError('Rejected: executable or archive data is appended to the image.');
    }
    findings.push(`${trailing.length} trailing byte${trailing.length === 1 ? '' : 's'} discarded.`);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([buffer], { type: expectedMime }), {
      imageOrientation: 'from-image',
    });
  } catch {
    throw new BrowserImageSecurityError('Rejected: the browser could not safely decode this image.');
  }
  const width = bitmap.width;
  const height = bitmap.height;
  if (!width || !height || width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_PIXELS) {
    bitmap.close();
    throw new BrowserImageSecurityError('Rejected: image dimensions exceed the safe decoding limit.');
  }

  const scale = Math.min(1, OUTPUT_DIMENSION / width, OUTPUT_DIMENSION / height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new BrowserImageSecurityError('Could not create an isolated image decoder.');
  }
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const sampleWidth = Math.min(512, canvas.width);
  const sampleHeight = Math.min(512, canvas.height);
  const sample = document.createElement('canvas');
  sample.width = sampleWidth;
  sample.height = sampleHeight;
  const sampleContext = sample.getContext('2d', { willReadFrequently: true });
  let steganography: BrowserImageSecurityReport['steganography'] = 'review';
  if (sampleContext) {
    sampleContext.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
    steganography = lsbSteganalysis(
      sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data,
      detectedType === 'png' || detectedType === 'gif',
    );
  }
  if (steganography === 'review') findings.push('Simple LSB statistics warrant review; the source bitstream was still discarded.');

  const safeBlob = await canvasBlob(canvas);
  const sanitizedSha256 = await digestHex(safeBlob);
  const safeBase = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 100) || 'upload';
  const safeFile = new File([safeBlob], `${safeBase}.safe.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  findings.push('Rasterized to a new metadata-free JPEG before upload.');

  return {
    file: safeFile,
    report: { detectedType, width, height, originalSha256, sanitizedSha256, steganography, findings },
  };
}
