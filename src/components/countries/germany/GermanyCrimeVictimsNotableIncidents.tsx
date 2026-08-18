import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { cn } from '../../../lib/utils';
import { FRANCE_NOTABLE_INCIDENTS } from '../../../lib/countries/france/franceNotableIncidents';
import { NotableIncidentThumb, type IncidentImage } from '../../NotableIncidentThumb';

export type SourceLink = { label: string; url: string };

export type NotableIncident = {
  id: string;
  rank: number;
  year: string;
  location: string;
  dateDetail?: string;
  locationDetail?: string;
  description: string;
  expandedOverview?: string;
  perpetrators: string;
  perpetratorsExpanded?: string;
  victims: string;
  victimsExpanded?: string;
  outcome?: string;
  sourceLinks?: readonly SourceLink[];
  sourceFallback?: string;
  aggregateContext?: string;
  /** Photo of the public LOCATION (Wikimedia Commons, credited) — never people or press images. */
  image?: IncidentImage;
};

const NOTABLE_INCIDENTS: readonly NotableIncident[] = [
  {
    id: 'cologne-nye',
    rank: 1,
    year: '2015/2016',
    location: 'Cologne (NYE)',
    dateDetail: 'Night of 31 December 2015 into 1 January 2016',
    locationDetail: 'Cologne city centre — main train station and cathedral square',
    description: 'Coordinated mass sexual assaults and gang rapes; 1,200+ criminal complaints.',
    expandedOverview:
      'Large groups of men — predominantly North African and Arab asylum seekers — carried out coordinated mass sexual assaults and gang rapes in Cologne’s city center around the main train station and cathedral square. Over 1,200 criminal complaints were filed by women and girls, including dozens of confirmed rapes. Women were surrounded by groups of 20–50 men, groped, robbed, and sexually assaulted, with similar incidents reported in Hamburg, Stuttgart, and Düsseldorf the same night. This event became a national turning point in the German migration debate.',
    perpetrators: 'Predominantly North African and Arab asylum seekers; coordinated groups of 20–50 men cited in many accounts.',
    victims: 'Women and girls who filed 1,200+ complaints; numerous sexual assaults and robberies.',
    sourceLinks: [
      {
        label: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/2015%E2%80%9316_New_Year%27s_Eve_sexual_assaults',
      },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-35231046' },
    ],
    image: {
      src: '/incidents/cologne-nye.webp',
      alt: 'Cologne central station (Köln Hauptbahnhof)',
      credit: 'Köln Hauptbahnhof — Neuwieser, CC BY-SA 2.0 / Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Koeln_Hauptbahnhof_Luftaufnahme.jpg',
    },
  },
  {
    id: 'freiburg-2018',
    rank: 2,
    year: '2018',
    location: 'Freiburg',
    dateDetail: '13 October 2018',
    locationDetail: 'Freiburg — outside a nightclub after drugging inside',
    description: '18-year-old German woman drugged and gang-raped for several hours.',
    expandedOverview:
      'An 18-year-old German woman was drugged with ecstasy in a Freiburg nightclub, taken outside, and brutally gang-raped for several hours by a group of men who took turns assaulting her. The attack was extremely violent and prolonged.',
    perpetrators: 'Group of men acting together after isolating the victim outside the club.',
    victims: 'One 18-year-old German woman.',
    outcome: 'Multiple convictions followed in subsequent trials (widely covered 2019–2020).',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/2018_Freiburg_gang_rape' },
      { label: 'BBC', url: 'https://www.bbc.com/news/world-europe-53517022' },
    ],
  },
  {
    id: 'hamburg-stadtpark-2020',
    rank: 3,
    year: '2020',
    location: 'Hamburg Stadtpark',
    dateDetail: '19 September 2020',
    locationDetail: 'Hamburg Stadtpark (bushes / park area)',
    description: '15-year-old girl gang-raped for hours; assault filmed on phones.',
    expandedOverview:
      'A heavily intoxicated 15-year-old German girl was dragged into bushes in Hamburg’s Stadtpark and gang-raped for more than two hours by a group of young men who also filmed the assault on their phones. The case caused massive public outrage due to the extremely lenient court sentences.',
    perpetrators: 'Group of young men; widely reported as majority migration background (e.g. Afghanistan, Iran, Egypt in press summaries).',
    victims: 'One 15-year-old German girl.',
    outcome: 'Later trials drew heavy criticism over suspended sentences for most defendants (widely reported 2023).',
    sourceLinks: [
      {
        label: 'News.com.au',
        url: 'https://www.news.com.au/lifestyle/real-life/news-life/outrage-as-eight-of-nine-men-convicted-of-park-gangrape-15yearold-in-germany-receive-no-prison-time/news-story/353bcbf9437ea62eea0ee3c6cc0c2cc7',
      },
    ],
    image: {
      src: '/incidents/hamburg-stadtpark-2020.webp',
      alt: 'Hamburg Stadtpark',
      credit: 'Hamburg Stadtpark — Ajepbah, CC BY-SA 3.0 de / Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Stadtpark_(Hamburg-Winterhude).Blick_vom_Planetarium.18mm.30809.ajb.jpg',
    },
  },
  {
    id: 'heinsberg-2025',
    rank: 4,
    year: '2025',
    location: 'Heinsberg (NRW)',
    dateDetail: 'Mid-October 2025',
    locationDetail: 'Heinsberg, North Rhine-Westphalia — apartment',
    description: '17-year-old German girl lured to an apartment and gang-raped by five Syrian asylum seekers.',
    expandedOverview:
      'In mid-October 2025 in Heinsberg, North Rhine-Westphalia, a 17-year-old German girl was lured to an apartment under false pretenses and gang-raped by five Syrian asylum seekers. The case quickly made national headlines as one of the most recent high-profile gang rape incidents.',
    perpetrators: 'Five Syrian asylum seekers (ages reported in the mid-to-late teens and twenties in press coverage).',
    victims: 'One 17-year-old German girl.',
    outcome: 'Suspects arrested; follow national reporting for trial updates.',
    sourceLinks: [
      {
        label: 'The Sun',
        url: 'https://www.the-sun.com/news/15391369/teenage-girl-gang-raped-syrian-asylum-seekers-germany/',
      },
    ],
  },
  {
    id: 'kandel-2018',
    rank: 5,
    year: '2017–2018',
    location: 'Kandel',
    dateDetail: '2017 through 27 December 2017 (fatal attack)',
    locationDetail: 'Kandel, Rhineland-Palatinate — drugstore',
    description: 'Afghan ex-boyfriend stalked and assaulted Mia Valentin; murdered her in a drugstore.',
    expandedOverview:
      'Between 2017 and December 27, 2017, an Afghan asylum seeker named Abdul D. repeatedly sexually assaulted and stalked his 15-year-old German ex-girlfriend Mia Valentin. On December 27, he stabbed her to death in a drugstore in Kandel after she tried to end the relationship.',
    perpetrators: 'Abdul D., Afghan asylum seeker (tried as a juvenile in German proceedings).',
    victims: 'Mia Valentin — 15-year-old German girl.',
    outcome: 'Convicted of murder; sentenced to 8 years and 6 months under juvenile law (per DW).',
    sourceLinks: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Murder_of_Mia_Valentin' },
      {
        label: 'DW',
        url: 'https://www.dw.com/en/germany-refugee-sentenced-to-8-years-and-6-months-for-teen-murder/a-45329347',
      },
    ],
  },
  {
    id: 'berlin-2022',
    rank: 6,
    year: '2022',
    location: 'Berlin youth center',
    dateDetail: '2022 (reporting period per German press)',
    locationDetail: 'Berlin — youth center facility',
    description: 'German teenage girl gang-raped at a youth center by a group of migrant men.',
    expandedOverview:
      'In 2022, a German teenage girl was gang-raped at a Berlin youth center by a group of Arab/Muslim migrant men. The attack occurred in a facility meant to be a safe space for young people.',
    perpetrators: 'Group of Arab/Muslim migrant men (per widespread German media characterization).',
    victims: 'One German teenage girl.',
    sourceFallback: 'Local Berlin police reports and Bild coverage (widely reported in German media 2022).',
  },
  {
    id: 'pools-parks-2016-2020',
    rank: 7,
    year: '2016–2020',
    location: 'Swimming pools & parks (Germany)',
    dateDetail: '2016–2020 (multiple jurisdictions and dates)',
    locationDetail: 'Public swimming pools and parks — e.g. Cologne, Düsseldorf, Berlin (pattern cited in reporting)',
    description: 'Numerous pool and park gang rapes and sexual assaults; migrant perpetrators repeatedly reported.',
    expandedOverview:
      'Between 2016 and 2020, numerous gang rapes and sexual assaults occurred in public swimming pools and parks across Germany, particularly in cities like Cologne, Düsseldorf, and Berlin. Perpetrators were predominantly Afghan, Syrian, and Iraqi migrants targeting young German girls.',
    perpetrators: 'Predominantly Afghan, Syrian, and Iraqi migrants (as described in BKA and local reporting summaries).',
    victims: 'Young German girls and women (counts vary by incident and jurisdiction).',
    sourceFallback: 'BKA annual crime reports and numerous local police press releases.',
  },
  {
    id: 'nrw-2024',
    rank: 8,
    year: '2024',
    location: 'Various NRW cities',
    dateDetail: 'Throughout 2024',
    locationDetail: 'North Rhine-Westphalia — multiple cities',
    description: 'Multiple NRW gang rape cases; Syrian and Afghan groups reported.',
    expandedOverview:
      'Throughout 2024, multiple gang rape cases were reported in cities across North Rhine-Westphalia (NRW), with groups of Syrian and Afghan men attacking German women and girls.',
    perpetrators: 'Groups of Syrian and Afghan men (as described in regional reporting).',
    victims: 'German women and girls (case-specific).',
    sourceFallback: 'NRW police reports and Bild / Welt coverage (2024).',
  },
  {
    id: 'cologne-duesseldorf-stations',
    rank: 9,
    year: '2017–2025',
    location: 'Cologne & Düsseldorf stations',
    dateDetail: 'From 2017 onward (ongoing pattern in reporting through 2025)',
    locationDetail: 'Cologne and Düsseldorf main train stations',
    description: 'Repeated group sexual assaults and gang rapes at major Rhine-Ruhr stations.',
    expandedOverview:
      'From 2017 onward, repeated group sexual assaults and gang rapes have occurred at Cologne and Düsseldorf main train stations, primarily committed by North African and Arab migrant groups targeting lone women.',
    perpetrators: 'North African and Arab migrant groups (per police and press summaries).',
    victims: 'Lone women and girls using station environments (counts vary by incident).',
    sourceFallback: 'Cologne Police annual reports and DW investigations.',
    image: {
      src: '/incidents/cologne-duesseldorf-stations.webp',
      alt: 'Düsseldorf central station (Düsseldorf Hauptbahnhof)',
      credit: 'Düsseldorf Hauptbahnhof — Christian A. Schröder (ChristianSchd), CC BY-SA 4.0 / Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Duesseldorf_main_station_Konrad-Adenauer-Platz_Stadtmitte_Duesseldorf_Germany.jpg',
    },
  },
  {
    id: 'munich-2023',
    rank: 10,
    year: '2023',
    location: 'Munich area',
    dateDetail: '2023 (multiple files across the year)',
    locationDetail: 'Greater Munich / Bavaria',
    description: 'Several 2023 gang rape cases; mixed migrant perpetrator groups.',
    expandedOverview:
      'In 2023, several gang rape cases involving mixed migrant perpetrator groups were reported in the Munich area, following the same pattern of group attacks on German women and girls.',
    perpetrators: 'Mixed migrant perpetrator groups (per Bavarian local reporting).',
    victims: 'German women and girls (case-specific).',
    sourceFallback: 'Bavarian police reports and local media (Süddeutsche Zeitung, Bild).',
  },
];

type SortKey = 'rank' | 'year' | 'location' | 'perpetrators' | 'victims';

function yearSortValue(year: string): number {
  const m = year.match(/(\d{4})/);
  return m ? parseInt(m[1]!, 10) : 0;
}

function compareLocale(a: string, b: string): number {
  return a.localeCompare(b, 'en', { sensitivity: 'base' });
}

/** Matches `MetricTile` / dashboard definition copy rhythm. */
function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <div className="font-sans text-[11px] leading-relaxed text-neutral-400">{children}</div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="font-sans text-[11px] leading-relaxed text-neutral-400">{value}</p>
    </div>
  );
}

/** Spain incident register: documented cases with court, Interior Ministry, or public-broadcaster sourcing. */
const SPAIN_NOTABLE_INCIDENTS: readonly NotableIncident[] = [
  {
    id: 'spain-madrid-11m',
    rank: 1,
    year: '2004',
    location: 'Madrid commuter trains (11-M)',
    dateDetail: '11 March 2004',
    locationDetail: 'Commuter trains near Atocha, El Pozo, Santa Eugenia, and Calle Téllez, Madrid',
    description: 'Coordinated bombings of four commuter trains killed 193 people and injured more than 2,000.',
    expandedOverview:
      'Ten bombs exploded aboard four packed commuter trains during the morning rush hour. Spain’s Interior Ministry records 193 deaths and 2,084 injured passengers, making 11-M the deadliest terrorist attack in modern Spanish history.',
    perpetrators: 'Members and collaborators of a jihadist cell; several principal suspects died in the Leganés explosion.',
    victims: '193 people killed and 2,084 injured.',
    outcome:
      'The Audiencia Nacional convicted multiple defendants. José Emilio Suárez Trashorras received 34,715 years, subject to a 40-year maximum term of actual imprisonment.',
    sourceLinks: [
      {
        label: 'Spain Ministry of the Interior — twentieth-anniversary record',
        url: 'https://www.interior.gob.es/opencms/en/detail-pages/article/Grande-Marlaska-El-11M-la-sociedad-espanola-volvio-a-demostrar-que-no-hay-terrorismo-capaz-de-doblegarla/',
      },
      {
        label: 'Spanish Judiciary — Suárez Trashorras sentence record',
        url: 'https://www.poderjudicial.es/portal/site/cgpj/menuitem.65d2c4456b6ddb628e635fc1dc432ea0/?lang_choosen=en&perfil=0&vgnextchannel=be4105063580d210VgnVCM1000006f48ac0aRCRD&vgnextfmt=default&vgnextlocale=en&vgnextoid=3d6ee02a62ecb510VgnVCM1000006f48ac0aRCRD',
      },
    ],
  },
  {
    id: 'spain-barcelona-cambrils-17a',
    rank: 2,
    year: '2017',
    location: 'Barcelona and Cambrils (17-A)',
    dateDetail: '17–18 August 2017',
    locationDetail: 'La Rambla, Barcelona, and the seafront at Cambrils, Tarragona',
    description: 'Vehicle and knife attacks by a jihadist cell killed 16 people and injured more than 140.',
    expandedOverview:
      'A van was driven into pedestrians on Barcelona’s La Rambla. Hours later, members of the same cell carried out a second vehicle-and-knife attack in Cambrils. The attacks followed an accidental explosion at the cell’s bomb-making site in Alcanar.',
    perpetrators: 'A jihadist cell based in Catalonia; the direct attackers were killed by police.',
    victims: '16 people killed and more than 140 injured across Barcelona and Cambrils.',
    outcome:
      'The three surviving cell members were convicted of offences including membership of a terrorist organisation, explosives manufacture, and collaboration; they were not convicted as direct perpetrators of the killings.',
    sourceLinks: [
      {
        label: 'Spain Ministry of the Interior — victim recognition',
        url: 'https://www.interior.gob.es/opencms/es/detalle/articulo/Concesion-de-la-Gran-Cruz-de-la-Real-Orden-de-Reconocimiento-Civil-a-nueve-victimas-de-los-atentados-yihadistas-de-Barcelona/',
      },
      {
        label: 'RTVE — Supreme Court review and case summary',
        url: 'https://www.rtve.es/noticias/20231115/tribunal-supremo-revisa-sentencia-atentados-del-17a-cataluna-por-recursos-victimas/2460996.shtml',
      },
    ],
  },
  {
    id: 'spain-alcasser',
    rank: 3,
    year: '1992',
    location: 'Alcàsser / Tous, Valencia',
    dateDetail: '13 November 1992; bodies located 27 January 1993',
    locationDetail: 'The teenagers disappeared near Alcàsser; their bodies were found near Tous, Valencia',
    description: 'Three teenage girls were abducted, sexually assaulted, tortured, and murdered.',
    expandedOverview:
      'Miriam García, Antonia “Toñi” Gómez, and Desirée Hernández disappeared while travelling to a nightclub near their home town. Their bodies were discovered in a rural grave seventy-five days later.',
    perpetrators: 'Miguel Ricart was convicted; alleged co-offender Antonio Anglés remains missing.',
    victims: 'Miriam García, 14; Antonia Gómez, 15; and Desirée Hernández, 14.',
    outcome:
      'Ricart was sentenced to 170 years, with the then-applicable statutory limit governing actual time served. He was released in 2013 after sentence-law changes; Anglés has not been tried.',
    sourceLinks: [
      {
        label: 'El País — 1997 conviction report',
        url: 'https://elpais.com/diario/1997/09/06/espana/873496814_850215.html',
      },
      {
        label: 'Spanish Judiciary — 2013 release ruling',
        url: 'https://www.poderjudicial.es/portal/site/cgpj/menuitem.65d2c4456b6ddb628e635fc1dc432ea0/?lang_choosen=en&perfil=0&vgnextchannel=05bc3da6cbe0a210VgnVCM100000cb34e20aRCRD&vgnextfmt=default&vgnextlocale=en&vgnextoid=43801179413b2410VgnVCM1000006f48ac0aRCRD',
      },
    ],
  },
  {
    id: 'spain-ana-orantes',
    rank: 4,
    year: '1997',
    location: 'Cúllar Vega, Granada',
    dateDetail: '17 December 1997',
    locationDetail: 'The victim’s home in Cúllar Vega, Granada',
    description: 'Ana Orantes was murdered by her former husband days after publicly recounting decades of abuse.',
    expandedOverview:
      'Ana Orantes appeared on a Canal Sur television programme and described the physical and psychological abuse she had endured during her marriage. Thirteen days later, her former husband attacked and set her on fire at her home.',
    perpetrators: 'José Parejo, her former husband.',
    victims: 'Ana Orantes, 60.',
    outcome:
      'A Granada jury found Parejo guilty of murder. The case became a national catalyst for reform of Spain’s institutional response to domestic and gender-based violence.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — domestic-violence judicial study',
        url: 'https://www.poderjudicial.es/stfls/CGPJ/FORMACI%C3%93N%20CONTINUA/PLAN%20ESTATAL/MATERIALES%20DOCENTES/FICHERO/EX0307%202003%20I%20Encuentro%20violencia%20dom%C3%A9stica.pdf',
      },
    ],
  },
  {
    id: 'spain-marta-del-castillo',
    rank: 5,
    year: '2009',
    location: 'Seville',
    dateDetail: '24 January 2009',
    locationDetail: 'An apartment on Calle León XIII, Seville',
    description: 'Seventeen-year-old Marta del Castillo was murdered; her body has never been recovered.',
    expandedOverview:
      'Marta del Castillo disappeared after visiting Miguel Carcaño. Carcaño gave changing accounts of the killing and disposal of her body, prompting repeated searches at multiple locations. Her remains have not been found.',
    perpetrators: 'Miguel Carcaño was convicted of murder; other adult defendants were acquitted in the principal trial.',
    victims: 'Marta del Castillo, 17.',
    outcome:
      'The Audiencia Provincial de Sevilla sentenced Carcaño to 20 years in prison for murder and ordered compensation for Marta’s parents and sisters.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — trial judgment summary',
        url: 'https://www.poderjudicial.es/cgpj/en/Judiciary/Novelties/Caso-Marta--La-Audiencia-condena-a-Carcano-por-asesinato-a-20-anos-de-prision',
      },
    ],
  },
  {
    id: 'spain-asunta-basterra',
    rank: 6,
    year: '2013',
    location: 'Santiago de Compostela / Teo',
    dateDetail: '21 September 2013',
    locationDetail: 'Santiago de Compostela and a rural track in Teo, A Coruña',
    description: 'Twelve-year-old Asunta Basterra was drugged and suffocated; her body was left on a rural track.',
    expandedOverview:
      'Asunta Basterra’s parents reported her missing, and her body was found hours later near Teo. The prosecution established that she had been given a high dose of lorazepam before being asphyxiated.',
    perpetrators: 'Her adoptive parents, Rosario Porto and Alfonso Basterra.',
    victims: 'Asunta Basterra, 12.',
    outcome:
      'Both parents were convicted of murder and sentenced to 18 years in prison. Spain’s Supreme Court confirmed the convictions.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — Supreme Court confirmation',
        url: 'https://www.poderjudicial.es/portal/site/cgpj/menuitem.65d2c4456b6ddb628e635fc1dc432ea0/?perfil=3&vgnextchannel=cd63939ae5821310VgnVCM1000006f48ac0aRCRD&vgnextfmt=default&vgnextlocale=es&vgnextoid=c870a305893b7510VgnVCM1000006f48ac0aRCRD',
      },
    ],
  },
  {
    id: 'spain-la-manada-pamplona',
    rank: 7,
    year: '2016',
    location: 'Pamplona — San Fermín',
    dateDetail: '7 July 2016',
    locationDetail: 'A building entrance in central Pamplona during the San Fermín festival',
    description: 'Five men sexually assaulted an 18-year-old woman during the San Fermín festival.',
    expandedOverview:
      'The group, widely known as “La Manada,” took the victim into a building entrance and subjected her to repeated sexual acts. The initial legal classification prompted nationwide protests and scrutiny of Spain’s sexual-offence law.',
    perpetrators: 'Five adult men acting together.',
    victims: 'One 18-year-old woman.',
    outcome:
      'In 2019, Spain’s Supreme Court reclassified the crime as continuous rape and sentenced each defendant to 15 years in prison.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — Supreme Court ruling',
        url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Noticias-Judiciales/Comunicado-de-la-Sala-Segunda-del-Tribunal-Supremo-sobre-el-recurso-de-casacion-396-2019',
      },
    ],
  },
  {
    id: 'spain-diana-quer',
    rank: 8,
    year: '2016',
    location: 'A Pobra do Caramiñal / Rianxo',
    dateDetail: '22 August 2016',
    locationDetail: 'Abducted in A Pobra do Caramiñal; body concealed in an abandoned warehouse in Rianxo, A Coruña',
    description: 'Eighteen-year-old Diana Quer was abducted, sexually assaulted, murdered, and concealed in a well.',
    expandedOverview:
      'Diana Quer was forced into a car while walking home. The offender took her to an isolated warehouse, committed acts against her sexual freedom, strangled her, and concealed her body in a water-filled well.',
    perpetrators: 'José Enrique Abuín Gey, known as “El Chicle.”',
    victims: 'Diana Quer, 18.',
    outcome:
      'The Supreme Court confirmed permanent reviewable imprisonment for murder committed after an offence against the victim’s sexual freedom.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — Supreme Court confirmation',
        url: 'https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunal-Supremo/Noticias-Judiciales/ci.El-Tribunal-Supremo-confirma-la-prision-permanente-revisable-al-autor-del-asesinato-de-Diana-Quer.formato3',
      },
    ],
  },
  {
    id: 'spain-gabriel-cruz',
    rank: 9,
    year: '2018',
    location: 'Níjar, Almería',
    dateDetail: '27 February 2018',
    locationDetail: 'Las Hortichuelas / Rodalquilar, Níjar, Almería',
    description: 'Eight-year-old Gabriel Cruz was killed and hidden during an eleven-day missing-child search.',
    expandedOverview:
      'Gabriel disappeared while walking between relatives’ homes. Ana Julia Quezada, his father’s partner, killed him and concealed his body, then participated publicly in the search before police recovered the body from her vehicle.',
    perpetrators: 'Ana Julia Quezada, the partner of Gabriel’s father.',
    victims: 'Gabriel Cruz, 8.',
    outcome:
      'Quezada was convicted of murder with treachery and sentenced to permanent reviewable imprisonment. The Supreme Court confirmed the sentence in 2020.',
    sourceLinks: [
      {
        label: 'RTVE — Supreme Court confirmation',
        url: 'https://www.rtve.es/noticias/20201216/supremo-confirma-prision-permanente-revisable-para-ana-julia-quezada/2060269.shtml',
      },
    ],
  },
  {
    id: 'spain-samuel-luiz',
    rank: 10,
    year: '2021',
    location: 'A Coruña seafront',
    dateDetail: '3 July 2021',
    locationDetail: 'Near a pub on the A Coruña seafront',
    description: 'Samuel Luiz was fatally beaten during a prolonged group attack after a confrontation over a phone.',
    expandedOverview:
      'The attack began when one assailant wrongly believed Samuel was recording him during a video call. Samuel was punched, kicked, chased, and repeatedly attacked by members of the group until he collapsed from fatal injuries.',
    perpetrators: 'Three men ultimately convicted as the principal authors; a fourth first-instance defendant was later acquitted for lack of proof.',
    victims: 'Samuel Luiz Muñiz, 24.',
    outcome:
      'The Supreme Court confirmed prison terms of 20 to 24 years for the three authors in 2025. One sentence included an aggravating circumstance for discrimination based on perceived sexual orientation.',
    sourceLinks: [
      {
        label: 'Spanish Judiciary — Supreme Court confirmation',
        url: 'https://www.poderjudicial.es/portal/site/cgpj/menuitem.65d2c4456b6ddb628e635fc1dc432ea0/?perfil=0&vgnextchannel=ae0d512f8032a210VgnVCM100000cb34e20aRCRD&vgnextfmt=default&vgnextlocale=en&vgnextoid=cac3ce5177a6b910VgnVCM1000004648ac0aRCRD',
      },
    ],
  },
];

export const GermanyCrimeVictimsNotableIncidents = memo(function GermanyCrimeVictimsNotableIncidents({
  iso3,
}: {
  iso3?: string;
}) {
  const upperIso = iso3?.toUpperCase();
  const isFrance = upperIso === 'FRA';
  const isSpain = upperIso === 'ESP';
  const incidents = isSpain ? SPAIN_NOTABLE_INCIDENTS : isFrance ? FRANCE_NOTABLE_INCIDENTS : NOTABLE_INCIDENTS;
  const countryName = isSpain ? 'Spain' : isFrance ? 'France' : 'Germany';

  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const rows = [...incidents];
    const dir = sortDir === 'asc' ? 1 : -1;
    rows.sort((x, y) => {
      let cmp = 0;
      switch (sortKey) {
        case 'rank':
          cmp = x.rank - y.rank;
          break;
        case 'year':
          cmp = yearSortValue(x.year) - yearSortValue(y.year);
          break;
        case 'location':
          cmp = compareLocale(x.location, y.location);
          break;
        case 'perpetrators':
          cmp = compareLocale(x.perpetrators, y.perpetrators);
          break;
        case 'victims':
          cmp = compareLocale(x.victims, y.victims);
          break;
        default:
          cmp = 0;
      }
      return cmp * dir;
    });
    return rows;
  }, [incidents, sortKey, sortDir]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return key;
    });
  }, []);

  const researchHref = useCallback(
    (row: NotableIncident) => {
      const q = `${row.location} ${row.year} ${countryName}`;
      return `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    },
    [countryName],
  );

  return (
    <Card className="col-span-full overflow-hidden border-line bg-surface-metric shadow-card">
      <CardHeader className="space-y-1 border-b border-[var(--line)] p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Notable incidents (reported)
            </CardTitle>
            <CardDescription className="font-sans text-[10px] leading-snug text-neutral-500">
              {sorted.length > 0
                ? 'Sort by column. Expand a case for timeline, narrative, outcome, and sources.'
                : `No ${countryName} cases have been researched and sourced yet.`}
            </CardDescription>
          </div>
          <div
            className={cn('flex flex-wrap gap-2 sm:shrink-0 sm:justify-end', sorted.length === 0 && 'hidden')}
            role="toolbar"
            aria-label="Sort incidents"
          >
            {(
              [
                ['rank', 'Rank'],
                ['year', 'Year'],
                ['location', 'Location'],
                ['perpetrators', 'Perpetrators'],
                ['victims', 'Victims'],
              ] as const
            ).map(([key, label]) => {
              const active = sortKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSort(key)}
                  className={cn(
                    'rounded-md border px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] transition-colors',
                    active
                      ? 'border-line bg-surface-metric text-neutral-100 shadow-sm ring-1 ring-white/[0.04]'
                      : 'border-white/[0.08] bg-neutral-950/35 text-neutral-500 hover:border-white/[0.12] hover:bg-neutral-900/50 hover:text-neutral-300',
                  )}
                >
                  {label}
                  {active ? (sortDir === 'asc' ? ' · asc' : ' · desc') : ''}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 pt-4 sm:p-5 sm:pt-4">
        {sorted.length === 0 ? (
          <div className="rounded-md border border-dashed border-line bg-surface-metric p-4 shadow-card sm:p-5">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
              Awaiting sourced cases
            </p>
            <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-400">
              Each case in this panel carries a dated timeline, perpetrator and victim detail, legal outcome, and
              linked sources. {countryName} entries appear here once they meet that standard.
            </p>
          </div>
        ) : null}
        <ul className="flex flex-col gap-4">
          {sorted.map((row) => {
            const open = expandedId === row.id;
            const overview = row.expandedOverview ?? row.description;
            const perpLong = row.perpetratorsExpanded ?? row.perpetrators;
            const vicLong = row.victimsExpanded ?? row.victims;
            return (
              <li key={row.id}>
                <article
                  className={cn(
                    'flex flex-col rounded-md border border-line bg-surface-metric p-4 shadow-card sm:p-5',
                    open && 'ring-1 ring-white/[0.06]',
                  )}
                >
                  <NotableIncidentThumb image={row.image} />
                  <button
                    type="button"
                    onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                    className="flex w-full flex-col text-left"
                    aria-expanded={open}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                        Case #{row.rank}
                        <span className="mx-1.5 text-neutral-600">·</span>
                        <span className="tabular-nums text-neutral-500">{row.year}</span>
                      </p>
                    </div>
                    <h3 className="mt-2 font-sans text-lg font-medium leading-snug text-neutral-100 sm:text-xl">
                      {row.location}
                    </h3>
                    {!open ? (
                      <p className="mt-3 font-sans text-[11px] leading-relaxed text-neutral-400 line-clamp-2">
                        {row.description}
                      </p>
                    ) : null}
                    <div className="mt-4 divide-y divide-white/[0.06] border-t border-white/[0.06] pt-4">
                      <div className="grid gap-4 pb-4 sm:grid-cols-2">
                        <MetaField label="Perpetrators" value={row.perpetrators} />
                        <MetaField label="Victims" value={row.victims} />
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-3">
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                          {open ? 'Hide full brief' : 'Full brief & sources'}
                        </span>
                        <span
                          className={cn(
                            'font-sans text-[10px] text-neutral-400 transition-transform duration-200',
                            open && 'rotate-180',
                          )}
                          aria-hidden
                        >
                          ▾
                        </span>
                      </div>
                    </div>
                  </button>
                  {open ? (
                    <div className="mt-0 border-t border-[var(--line)] px-0 pb-0 pt-4">
                      <div className="space-y-4">
                        {row.dateDetail ? <DetailBlock label="When">{row.dateDetail}</DetailBlock> : null}
                        {row.locationDetail ? <DetailBlock label="Where">{row.locationDetail}</DetailBlock> : null}
                        <DetailBlock label="What happened">{overview}</DetailBlock>
                        <DetailBlock label="Perpetrators (detail)">{perpLong}</DetailBlock>
                        <DetailBlock label="Victims (detail)">{vicLong}</DetailBlock>
                        {row.outcome ? <DetailBlock label="Legal / public outcome">{row.outcome}</DetailBlock> : null}
                        {row.aggregateContext ? (
                          <>
                            <Separator className="bg-white/[0.06]" />
                            <DetailBlock label="Context">{row.aggregateContext}</DetailBlock>
                          </>
                        ) : null}
                      </div>
                      <div className="mt-4 border-t border-white/[0.06] pt-4">
                        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                          Sources
                        </p>
                        {row.sourceLinks && row.sourceLinks.length > 0 ? (
                          <ul className="mt-2 flex flex-col gap-1.5">
                            {row.sourceLinks.map((s) => (
                              <li key={s.url}>
                                <a
                                  href={s.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-fit font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                                >
                                  {s.label} ↗
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : row.sourceFallback ? (
                          <p className="mt-2 font-sans text-[11px] leading-relaxed text-neutral-500">
                            {row.sourceFallback}
                          </p>
                        ) : null}
                        <a
                          href={researchHref(row)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex w-fit items-center gap-1 font-sans text-[10px] text-[var(--uk-accent)] hover:text-neutral-200"
                        >
                          Search coverage ↗
                        </a>
                      </div>
                    </div>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
});
