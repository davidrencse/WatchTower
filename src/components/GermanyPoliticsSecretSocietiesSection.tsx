import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { memo } from 'react';
import { GOV_POLITICS_CARD_GRID } from './GermanyGovernmentPoliticsBlocks';

const UC_TITLE = 'uppercase tracking-[0.05em]';
const UC_SECTION = 'uppercase tracking-[0.06em]';

export const GERMANY_POLITICS_SECRET_SOCIETIES_GROUP_COUNT = 7;

const ACTIVE_FREEMASONRY: readonly { title: string; body: string }[] = [
  {
    title: 'United Grand Lodges of Germany (Vereinigte Großlogen von Deutschland - VGLvD)',
    body:
      'The largest regular body, with about 20,000 members across 500+ lodges. Founded in 1949 post-WWII, it oversees conservative, male-only Freemasonry. Active in major cities like Berlin, Hamburg, and Frankfurt. No overt Illuminati or Jewish-specific affiliations, but it promotes universal brotherhood.',
  },
  {
    title: 'Grand Lodge of the Old Free and Accepted Masons of Germany (Große Landesloge der Freimaurer von Deutschland - GLdF)',
    body:
      'A more traditional, Christian-oriented group with around 6,000 members. Active since 1770 (revived post-war), with lodges in Munich, Leipzig, and elsewhere. Emphasizes symbolic rituals; historically wary of Jewish members but now open to all.',
  },
  {
    title:
      'Independent Grand Lodge of the Order of Odd Fellows (Unabhängige Große Loge der Ordensgemeinschaft „Odd Fellows“)',
    body:
      'A fraternal order with Masonic influences, active in Germany since the 19th century. About 10,000 members, mixed-gender, focused on mutual aid. Lodges in Cologne, Stuttgart, and Berlin; not strictly Freemasonry but related.',
  },
  {
    title: 'Grand Orient of Germany (Großorient von Deutschland)',
    body:
      'Part of the international liberal tradition, inclusive of women and atheists. Active with a few hundred members in Berlin and other cities; emphasizes social justice and humanism.',
  },
  {
    title: 'Le Droit Humain (International Order of Co-Freemasonry)',
    body:
      'German branches active since the early 20th century, mixed-gender, with lodges in Hamburg and Munich. Promotes equality; around 500 members in Germany.',
  },
];

const ILLUMINATI_GROUPS: readonly { title: string; body: string }[] = [
  {
    title: 'Ordo Templi Orientis (OTO)',
    body:
      'Active in Germany since the 1900s (revived post-WWII), with lodges in Berlin, Munich, and Leipzig. Led by figures like Aleister Crowley historically; focuses on Thelema (occult philosophy) and has Masonic-style degrees. About 1,000 members. Not Illuminati but often lumped in by theorists due to secrecy and symbolism. Recently active in legal battles over assets.',
  },
  {
    title: 'Fraternitas Saturni',
    body:
      'A German occult order founded in 1926, blending Masonry, astrology, and sex magic. Suppressed under Nazis, revived in the 1970s; small, secretive lodges in Berlin and southern Germany. Claims influence from Illuminati ideas but no direct link. Activity is low-key, with publications in esoteric journals.',
  },
];

function FreemasonryCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="flex flex-col border-line bg-card/50">
      <CardHeader className="space-y-0 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold leading-snug text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="font-sans text-[11px] leading-relaxed text-neutral-300">{body}</p>
      </CardContent>
    </Card>
  );
}

function IlluminatiCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="flex flex-col border-white/[0.12] bg-black/85 shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
      <CardHeader className="space-y-0 p-3 pb-2">
        <CardTitle className={`text-sm font-semibold leading-snug text-neutral-100 ${UC_TITLE}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="font-sans text-[11px] leading-relaxed text-neutral-400">{body}</p>
      </CardContent>
    </Card>
  );
}

export const GermanyPoliticsSecretSocietiesSection = memo(function GermanyPoliticsSecretSocietiesSection() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h3 className={`font-sans text-xs font-semibold text-neutral-200 ${UC_SECTION}`}>Section 1: Active Freemasonry</h3>
        <div className={GOV_POLITICS_CARD_GRID}>
          {ACTIVE_FREEMASONRY.map((item) => (
            <FreemasonryCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className={`font-sans text-xs font-semibold text-neutral-200 ${UC_SECTION}`}>2. Illuminati Groups</h3>
        <div className={GOV_POLITICS_CARD_GRID}>
          {ILLUMINATI_GROUPS.map((item) => (
            <IlluminatiCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </div>
    </div>
  );
});
