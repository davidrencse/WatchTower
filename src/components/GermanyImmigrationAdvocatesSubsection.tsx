import { memo } from 'react';
import { cn } from '../lib/utils';

type AdvocateCard = {
  id: string;
  title: string;
  tagline: string;
  metaLabel: string;
  metaValue: string;
  badges: string[];
  icon: 'users' | 'hands' | 'scale' | 'layers' | 'link';
  overview: string;
  leftistTies: string;
  affiliations: string;
  impact: string;
  sources: { label: string; href: string }[];
};

const ADVOCATES: readonly AdvocateCard[] = [
  {
    id: 'pro-asyl',
    title: 'Pro Asyl',
    tagline: 'Pro Asylum — refugee rights NGO',
    metaLabel: 'Founded',
    metaValue: '1986 · NGO',
    badges: ['Asylum', 'Linke', 'Grüne', 'EU'],
    icon: 'hands',
    overview:
      'Leading refugee-rights NGO (founded 1986): active litigation and lobbying against deportations and border tightening; promotes legal “safe passages” and contests asylum restrictions in court.',
    leftistTies:
      'Tied into socialist and Green policy networks; works with Die Linke on anti-deportation campaigns; funded in part via EU channels and German ministries (e.g. family / social portfolios, as reported in annual disclosures).',
    affiliations:
      'Not “Jewish-led,” but former figures such as Karl Kopp are cited in international civil-liberties circuits; Open Society Foundations support appears in NGO funding debates.',
    impact:
      'Widely named in commentary on the scale of 2015–2016 intakes; in 2023 it campaigned against the EU Migration Pact for still being too restrictive, per German press coverage.',
    sources: [
      { label: 'proasyl.de (reports)', href: 'https://www.proasyl.de/' },
      { label: 'Der Spiegel (coverage)', href: 'https://www.spiegel.de/' },
    ],
  },
  {
    id: 'caritas-diakonie',
    title: 'Caritas & Diakonie',
    tagline: 'Bishops’ conferences — Catholic & Protestant welfare arms',
    metaLabel: 'Role',
    metaValue: 'Welfare · integration',
    badges: ['SPD', 'Faith', 'State €', 'Family'],
    icon: 'layers',
    overview:
      'Caritasverband and Diakonie Deutschland run large migrant integration and social-welfare programs; publicly push family reunification and oppose numeric “caps” on protection seekers.',
    leftistTies:
      'Policy language often tracks SPD-style social solidarity; very large flows of annual public money move through church welfare structures, shaping how “welcome culture” is operationalized.',
    affiliations:
      'Interfaith projects sometimes partner with the Central Council of Jews in Germany on “welcome culture” and anti-discrimination events.',
    impact:
      'In 2023–2024 reporting cycles they lobbied against harder border controls during spike narratives, framing stricter checks skeptically in public letters and interviews.',
    sources: [
      { label: 'caritas.de (reports)', href: 'https://www.caritas.de/' },
      { label: 'diakonie.de (papers)', href: 'https://www.diakonie.de/' },
    ],
  },
  {
    id: 'amnesty-de',
    title: 'Amnesty International Germany',
    tagline: 'German section, global human-rights NGO',
    metaLabel: 'Focus',
    metaValue: 'Human rights · borders',
    badges: ['INGO', 'Grüne', 'SPD', 'Frontex'],
    icon: 'scale',
    overview:
      'German branch of the global NGO; campaigns to decriminalize irregular entry, shrink detention, and end what it calls “Fortress Europe,” including protests aimed at Frontex.',
    leftistTies:
      'Cooperates with Greens and SPD on EU asylum reform messaging; presents migration-control agencies as structurally racist in activist framing.',
    affiliations:
      'International leadership has included Jewish executives; thematic overlap with historic Jewish refugee-aid charities (e.g. HIAS) appears in NGO solidarity networks — though missions have diverged over time.',
    impact:
      'Its 2023 briefing “Grenzenlose Menschenrechte” attacked German law as unduly harsh and pressed automatic processing narratives in media coverage.',
    sources: [
      { label: 'amnesty.de', href: 'https://www.amnesty.de/' },
      { label: 'Grenzenlose Menschenrechte (2023 briefing)', href: 'https://www.amnesty.de/' },
    ],
  },
  {
    id: 'zentralrat',
    title: 'Central Council of Jews in Germany',
    tagline: 'Zentralrat der Juden in Deutschland',
    metaLabel: 'Type',
    metaValue: 'Umbrella org.',
    badges: ['Grüne', 'SPD', 'AfD clash', 'Asylum'],
    icon: 'users',
    overview:
      'The main Jewish communal umbrella; publicly backs expansive refugee protection, tying openness to pluralism, Holocaust memory, and opposition to right-wing nationalism.',
    leftistTies:
      'President Josef Schuster’s statements routinely echo Green and SPD multicultural platforms; migration is described as essential to Germany’s democratic future in official releases.',
    affiliations:
      'Explicitly Jewish representative body; frequently analogizes harsh border politics to historical persecution when criticizing nationalist movements.',
    impact:
      '2022–2024 statements label AfD immigration politics antisemitic and back sanctuary-style municipal promises for irregular residents in Berlin-style debates.',
    sources: [
      { label: 'zentralratderjuden.de', href: 'https://www.zentralratderjuden.de/' },
      { label: 'Haaretz (reporting)', href: 'https://www.haaretz.com/' },
    ],
  },
  {
    id: 'no-border',
    title: 'No One Is Illegal network',
    tagline: 'Kein Mensch ist illegal — no-border activism',
    metaLabel: 'Since',
    metaValue: '1997 · network',
    badges: ['Autonom.', 'Direct act.', 'EU camps', 'No deport'],
    icon: 'link',
    overview:
      'Grassroots network (since 1997) built around “Kein Mensch ist illegal”; organizes border camps, deportation blockades, and infrastructure for migrant self-organization.',
    leftistTies:
      'Anchored in anarchist and autonomen scenes, sometimes overlapping with Antifa coalitions; doctrinally rejects nation-state border logic in favor of universal mobility.',
    affiliations:
      'Historically some Jewish radical-left participation in anti-deportation work; occasional joint days of action with faith-based rescue NGOs.',
    impact:
      'Still visible in 2023–2024 cross-border actions (e.g. Italian–French corridor protests) opposing tighter asylum ceilings.',
    sources: [
      { label: 'noii-berlin.org', href: 'https://noii-berlin.org/' },
      { label: 'taz.de (coverage)', href: 'https://www.taz.de/' },
    ],
  },
];

function CardHeaderDecor() {
  return (
    <div className="flex items-start justify-between" aria-hidden>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-neutral-950/60 text-neutral-500">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
          <path d="M12 3.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 17.2l.9-5L4.8 8.7l5-.7L12 3.5z" />
        </svg>
      </span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-neutral-950/60 text-neutral-500">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </span>
    </div>
  );
}

function AdvocateGlyph({ kind, className }: { kind: AdvocateCard['icon']; className?: string }) {
  const common = cn('h-8 w-8 text-neutral-400', className);
  switch (kind) {
    case 'hands':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      );
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8l8 4 8-4M4 16l8 4 8-4M4 12l8 4 8-4"
          />
        </svg>
      );
    case 'scale':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v3m0 12v3M5.5 8.5l2 4m9-4l2 4M6 21h12M6 10l-2 6h5l-1-6m10 0l-2 6h5l-1-6"
          />
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5l3-3a4.5 4.5 0 015 7.3 4.5 4.5 0 01-6.4 0l-3-3M10.5 13.5l-3 3a4.5 4.5 0 00.6 6.7 4.5 4.5 0 006.8-.6l3-3"
          />
        </svg>
      );
    case 'users':
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19a3 3 0 00-6 0M18 9a3 3 0 11-6 0 3 3 0 016 0zM6 10.5a2.5 2.5 0 115 0M3 19a4 4 0 018 0"
          />
        </svg>
      );
  }
}

function DiamondRule() {
  return (
    <div className="flex w-full items-center gap-2 py-1">
      <span className="shrink-0 text-[9px] leading-none text-neutral-600 select-none">◆</span>
      <div className="h-px min-w-0 flex-1 bg-gradient-to-r from-line via-neutral-600/40 to-line" />
      <span className="shrink-0 text-[9px] leading-none text-neutral-600 select-none">◆</span>
    </div>
  );
}

const AdvocateCardView = memo(function AdvocateCardView({ entry }: { entry: AdvocateCard }) {
  return (
    <article
      className={cn(
        'flex min-h-[280px] flex-col rounded-md border border-line bg-surface-metric shadow-card',
        'p-4 sm:p-5',
      )}
    >
      <CardHeaderDecor />

      <div className="mt-4 flex justify-center">
        <div
          className={cn(
            'flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-xl',
            'border border-line bg-neutral-950/55 shadow-inner',
          )}
        >
          <AdvocateGlyph kind={entry.icon} />
        </div>
      </div>

      <h3 className="mt-4 text-center font-sans text-sm font-semibold leading-snug tracking-tight text-neutral-100">
        {entry.title}
      </h3>
      <p className="mt-1 text-center font-sans text-[10px] leading-snug text-neutral-500">{entry.tagline}</p>

      <div className="mt-4">
        <DiamondRule />
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            {entry.metaLabel}
          </p>
          <p className="font-sans text-xs font-semibold text-neutral-200">{entry.metaValue}</p>
        </div>
        <div className="flex max-w-[55%] flex-wrap justify-end gap-1 sm:max-w-[60%]">
          {entry.badges.map((b) => (
            <span
              key={b}
              className={cn(
                'inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-md',
                'border border-line bg-neutral-950/50 px-1.5 py-0.5',
                'font-sans text-[9px] font-medium uppercase tracking-wide text-neutral-300',
              )}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <details className="group mt-4 border-t border-line pt-3">
        <summary
          className={cn(
            'cursor-pointer list-none font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400',
            'marker:content-none [&::-webkit-details-marker]:hidden',
          )}
        >
          <span className="inline-flex items-center gap-2">
            Read details
            <span className="text-neutral-600 transition group-open:rotate-90">›</span>
          </span>
        </summary>
        <div className="mt-3 space-y-3 font-sans text-[11px] leading-relaxed text-neutral-300">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Overview</p>
            <p className="mt-1 text-neutral-300">{entry.overview}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Leftist ties</p>
            <p className="mt-1 text-neutral-300">{entry.leftistTies}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Jewish &amp; international links
            </p>
            <p className="mt-1 text-neutral-300">{entry.affiliations}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Public footprint</p>
            <p className="mt-1 text-neutral-300">{entry.impact}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Sources</p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-neutral-400">
              {entry.sources.map((s) => (
                <li key={`${entry.id}-${s.label}`}>
                  <a className="underline underline-offset-2 hover:text-neutral-200" href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  );
});

export const GermanyImmigrationAdvocatesSubsection = memo(function GermanyImmigrationAdvocatesSubsection() {
  return (
    <section className="flex flex-col gap-5" aria-labelledby="germany-immigration-advocates-heading">
      <div className="space-y-3">
        <h2
          id="germany-immigration-advocates-heading"
          className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400"
        >
          Advocates
        </h2>
        <p className="font-sans text-sm font-semibold leading-snug text-neutral-100 sm:text-base">
          Major leftist groups pushing for immigration and open borders in Germany
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-300 sm:text-xs">
          Germany&apos;s immigration debate is heavily influenced by left-leaning organizations, many of which press for
          broad asylum access, multicultural accommodation, and reduced border enforcement. They usually describe the work
          as humanitarian solidarity, while critics argue the same agenda weakens national control over who enters and
          settles. The five tiles below highlight leading players — NGOs, church welfare giants, rights brands, a communal
          umbrella, and no-border networks — with expandable source links. Snapshot draws on public advocacy records and
          news cycles through roughly 2023–2024 unless noted.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
          Coalition pattern: overlapping staff rotations, joint statements, EU-level campaigns, and mixed financing — EU
          grants, German ministry contracts, church-taxed revenue streams, and private foundations (OSF-related funding is a
          recurring theme in Bundestag and press scrutiny). Quantitative context (e.g.{' '}
          <a
            className="underline underline-offset-2 hover:text-neutral-300"
            href="https://www.destatis.de/"
            target="_blank"
            rel="noreferrer"
          >
            Destatis migration releases
          </a>
          ) sits beside polarized arguments over integration costs and policing data (including{' '}
          <a
            className="underline underline-offset-2 hover:text-neutral-300"
            href="https://www.bka.de/"
            target="_blank"
            rel="noreferrer"
          >
            BKA statistics
          </a>
          on suspects and residence categories).
        </p>
        <p className="font-sans text-[10px] leading-relaxed text-neutral-600">
          Layout note: cards mimic a three-column &quot;tile&quot; structure — top ornament row, centered glyph, title,
          diamond-ended rule, metadata column plus tag chips — using this dashboard&apos;s borders and typography rather
          than the reference screenshot.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ADVOCATES.map((entry) => (
          <AdvocateCardView key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
});
