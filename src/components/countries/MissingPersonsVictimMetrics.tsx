import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

type MissingPersonsMetric = {
  id: string;
  title: string;
  value: string;
  status: string;
  note: string;
};

type MissingPersonsCountryData = {
  country: string;
  metrics: readonly MissingPersonsMetric[];
  sources: readonly { label: string; url: string }[];
};

const MISSING_PERSONS_BY_COUNTRY: Readonly<Record<'ITA' | 'DEU' | 'FRA' | 'ESP', MissingPersonsCountryData>> = {
  ITA: {
    country: 'Italy',
    sources: [
      {
        label: 'Government Commissioner for Missing Persons — annual reports',
        url: 'https://commissari.gov.it/persone-scomparse/attivita/relazioni-periodiche/tutte-le-relazioni-periodiche/',
      },
    ],
    metrics: [
      {
        id: 'total-missing',
        title: 'Total missing per year',
        value: '25,000',
        status: 'Official · 2024–2025',
        note: 'Rounded headline from the official annual range of 24,700–25,400 reports.',
      },
      {
        id: 'total-recovered',
        title: 'Total recovered',
        value: '59%',
        status: 'Official · 2024',
        note: 'Approximately 14,600 people were recovered in 2024.',
      },
      {
        id: 'females-missing',
        title: 'Females missing per year',
        value: '5,850',
        status: 'Official · 2024',
        note: 'Rounded annual number of female missing-person reports.',
      },
      {
        id: 'females-recovered',
        title: 'Females recovered',
        value: '≈67%',
        status: 'Estimate · 65–70%',
        note: 'Estimated recovery rate; female recovery is higher than the male rate.',
      },
      {
        id: 'kids-missing',
        title: 'Kids missing per year',
        value: '16,000',
        status: 'Official range',
        note: 'Rounded headline from 14,300–18,000 annual reports involving minors.',
      },
      {
        id: 'kids-recovered',
        title: 'Kids recovered',
        value: '53%',
        status: 'Official-derived range · 52–55%',
        note: 'Overall recovery rate; the rate for Italian minors is much higher.',
      },
    ],
  },
  DEU: {
    country: 'Germany',
    sources: [
      {
        label: 'Bundeskriminalamt — missing-person cases',
        url: 'https://www.bka.de/DE/UnsereAufgaben/Ermittlungsunterstuetzung/BearbeitungVermisstenfaelle/bearbeitungVermisstenfaelle_node.html',
      },
    ],
    metrics: [
      {
        id: 'total-missing',
        title: 'Total missing per year',
        value: '90,000',
        status: 'Estimate · 80,000–100,000',
        note: 'Annualized from roughly 200–300 newly recorded cases per day.',
      },
      {
        id: 'total-recovered',
        title: 'Total recovered',
        value: '97%',
        status: 'Official range · 96–98%',
        note: 'Most missing-person cases are resolved quickly.',
      },
      {
        id: 'females-missing',
        title: 'Females missing per year',
        value: '27,000',
        status: 'Estimate · 25,000–30,000',
        note: 'Estimated at approximately 30% of the annual total.',
      },
      {
        id: 'females-recovered',
        title: 'Females recovered',
        value: '97%',
        status: 'Same range as overall',
        note: 'Rounded to the midpoint of the 96–98% overall recovery range.',
      },
      {
        id: 'kids-missing',
        title: 'Kids missing per year',
        value: '100,000',
        status: 'Official range · 95,000–110,000',
        note: 'Combined annual reports for children and youth; repeat runaways increase the count.',
      },
      {
        id: 'kids-recovered',
        title: 'Kids recovered',
        value: '97%',
        status: 'Official',
        note: 'The vast majority of reported child and youth cases are resolved.',
      },
    ],
  },
  FRA: {
    country: 'France',
    sources: [
      {
        label: '116 000 Enfants Disparus — 2024 report',
        url: 'https://www.116000enfantsdisparus.fr/wp-content/uploads/2024/12/116000_Rapport_Les-Disparitions-de-mineurs-en-France-en-2024_VDEF.pdf',
      },
      {
        label: 'Ministry of the Interior — worrying disappearances',
        url: 'https://www.interieur.gouv.fr/archive/disparitions-inquietantes',
      },
    ],
    metrics: [
      {
        id: 'total-missing',
        title: 'Total missing per year',
        value: '57,000',
        status: 'Official + estimate · 55,000–60,000',
        note: 'Rounded combined estimate covering worrying and voluntary disappearances.',
      },
      {
        id: 'total-recovered',
        title: 'Total recovered',
        value: '88%',
        status: 'Estimate · 85–90%',
        note: 'Most short-term missing-person cases are resolved.',
      },
      {
        id: 'females-missing',
        title: 'Females missing per year',
        value: '24,000',
        status: 'Estimate · 22,000–26,000',
        note: 'Estimated at approximately 40–45% of the annual total.',
      },
      {
        id: 'females-recovered',
        title: 'Females recovered',
        value: '88%',
        status: 'Estimate · 85–90%',
        note: 'Rounded to the midpoint of the estimated national range.',
      },
      {
        id: 'kids-missing',
        title: 'Kids missing per year',
        value: '38,477',
        status: 'Official · 2024',
        note: 'About 95% of reported minor disappearances were runaways.',
      },
      {
        id: 'kids-recovered',
        title: 'Kids recovered',
        value: '93%',
        status: 'Estimate · 90–95%',
        note: 'The vast majority of ordinary runaway cases end in a return.',
      },
    ],
  },
  ESP: {
    country: 'Spain',
    sources: [],
    metrics: [
      {
        id: 'total-missing',
        title: 'Total missing per year',
        value: '16,147',
        status: '2024',
        note: 'Annual missing-person reports.',
      },
      {
        id: 'total-recovered',
        title: 'Total recovered',
        value: '15,420',
        status: '2024 · 95.5%',
        note: '95.5% of reported cases were resolved.',
      },
      {
        id: 'females-missing',
        title: 'Females missing per year',
        value: '6,150',
        status: '2024',
        note: 'Female share of the annual missing-person reports.',
      },
      {
        id: 'females-recovered',
        title: 'Females recovered',
        value: '5,900',
        status: '2024 · ≈96%',
        note: 'Recovery rate slightly above the national average.',
      },
      {
        id: 'kids-missing',
        title: 'Kids missing per year',
        value: '8,000',
        status: '2024',
        note: 'Annual reports involving minors.',
      },
      {
        id: 'kids-recovered',
        title: 'Kids recovered',
        value: '7,600',
        status: '2024 · ≈95%',
        note: 'The vast majority of reported minor cases are resolved.',
      },
    ],
  },
};

function MissingPersonsMetricCard({ metric }: { metric: MissingPersonsMetric }) {
  return (
    <Card className="flex min-w-0 flex-col overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 pb-0">
        <CardTitle className="text-sm font-semibold leading-snug text-white">{metric.title}</CardTitle>
        <CardDescription className="font-sans text-[11px] leading-snug text-neutral-400">
          {metric.status}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-3">
        <p className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-white">{metric.value}</p>
        <Separator className="my-3" />
        <p className="font-sans text-[11px] leading-relaxed text-neutral-400">{metric.note}</p>
      </CardContent>
    </Card>
  );
}

export const MissingPersonsVictimMetrics = memo(function MissingPersonsVictimMetrics({ iso3 }: { iso3: string }) {
  const data = MISSING_PERSONS_BY_COUNTRY[iso3.toUpperCase() as keyof typeof MISSING_PERSONS_BY_COUNTRY];
  if (!data) return null;

  const headingId = `${iso3.toLowerCase()}-missing-persons-heading`;

  return (
    <section className="space-y-3" aria-labelledby={headingId}>
      <div className="space-y-1 px-1">
        <h3 id={headingId} className="font-sans text-base font-semibold text-white">
          Missing persons and recoveries
        </h3>
        <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-neutral-400">
          Rounded annual headline figures for {data.country}. Approximate figures remain explicitly marked as estimates.
        </p>
        <p
          className={cn(
            'flex flex-wrap gap-x-3 gap-y-1 font-sans text-[11px] leading-relaxed text-neutral-500',
            data.sources.length === 0 && 'hidden',
          )}
        >
          <span>Sources:</span>
          {data.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--uk-accent)] underline-offset-2 hover:text-neutral-200 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uk-accent)]"
            >
              {source.label} ↗
            </a>
          ))}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.metrics.map((metric) => (
          <MissingPersonsMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
});
