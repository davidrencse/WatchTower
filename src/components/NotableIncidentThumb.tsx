/**
 * Shared thumbnail for "Notable incidents" cards (Germany, France, Italy).
 *
 * Editorial rule: these images are of the PUBLIC LOCATION each documented event
 * happened at (a station, a park, a landmark), sourced from Wikimedia Commons
 * under open licences and credited. They are never photos of victims or
 * perpetrators, and never copyrighted press images. Cases with no single public
 * location — private-home crimes and aggregate "pattern" entries — get a neutral
 * placeholder rather than a stand-in photo.
 */

export type IncidentImage = {
  /** App-root-relative path, e.g. `/incidents/cologne-nye.jpg`. */
  src: string;
  /** Describes the place, not the event. */
  alt: string;
  /** Attribution line: place — author, licence / Wikimedia Commons. */
  credit: string;
  /** Commons file page for the full licence + author record. */
  creditUrl?: string;
};

function PlaceholderGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-neutral-700" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function NotableIncidentThumb({ image }: { image?: IncidentImage }) {
  if (!image) {
    return (
      <div
        className="mb-4 flex aspect-[16/9] w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-white/[0.08] bg-neutral-950/40"
        aria-hidden
      >
        <PlaceholderGlyph />
        <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-neutral-600">
          No open-licensed location photo
        </span>
      </div>
    );
  }
  return (
    <figure className="mb-4">
      <div className="overflow-hidden rounded-md border border-line bg-black/30">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      <figcaption className="mt-1.5 font-sans text-[9px] leading-snug text-neutral-600">
        {image.creditUrl ? (
          <a
            href={image.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-400"
          >
            {image.credit} ↗
          </a>
        ) : (
          image.credit
        )}
      </figcaption>
    </figure>
  );
}
