export type SpainParliamentGroup = {
  id: string;
  name: string;
  seats: number;
  color: string;
};

export type SpainParliamentChamber = {
  id: 'congress' | 'senate';
  title: string;
  spanishTitle: string;
  role: string;
  totalSeats: number;
  majorityThreshold: number;
  president: string;
  presidentParty: string;
  compositionDate: string;
  compositionNote: string;
  groups: readonly SpainParliamentGroup[];
  sourceLabel: string;
  sourceUrl: string;
};

export const SPAIN_PARLIAMENT_UPDATED_AT = '12 Aug 2026';

export const SPAIN_CONGRESS: SpainParliamentChamber = {
  id: 'congress',
  title: 'Congress of Deputies',
  spanishTitle: 'Congreso de los Diputados',
  role: 'Lower chamber · confidence, budgets and primary legislative authority',
  totalSeats: 350,
  majorityThreshold: 176,
  president: 'Francina Armengol',
  presidentParty: 'PSOE',
  compositionDate: '28 Jul 2026',
  compositionNote: 'Current parliamentary-group membership; it can differ from the election-night result after changes of affiliation.',
  groups: [
    { id: 'PP', name: 'Popular Parliamentary Group', seats: 137, color: '#2f72d6' },
    { id: 'PSOE', name: 'Socialist Parliamentary Group', seats: 121, color: '#e45757' },
    { id: 'VOX', name: 'VOX Parliamentary Group', seats: 32, color: '#64a83b' },
    { id: 'SUMAR', name: 'Plurinational SUMAR Parliamentary Group', seats: 26, color: '#d85a9b' },
    { id: 'ERC', name: 'Republican Parliamentary Group', seats: 7, color: '#e0ad35' },
    { id: 'JUNTS', name: 'Junts per Catalunya Parliamentary Group', seats: 7, color: '#27aeb2' },
    { id: 'EH Bildu', name: 'Euskal Herria Bildu Parliamentary Group', seats: 6, color: '#8bad3f' },
    { id: 'PNV', name: 'Basque Parliamentary Group (EAJ-PNV)', seats: 5, color: '#3d9462' },
    { id: 'Mixed', name: 'Mixed Parliamentary Group', seats: 9, color: '#8b8b91' },
  ],
  sourceLabel: 'Congress · current parliamentary groups',
  sourceUrl: 'https://www.congreso.es/es/cem/regecodip',
};

export const SPAIN_SENATE: SpainParliamentChamber = {
  id: 'senate',
  title: 'Senate',
  spanishTitle: 'Senado',
  role: 'Upper chamber · territorial representation and legislative review',
  totalSeats: 265,
  majorityThreshold: 133,
  president: 'Pedro Rollán',
  presidentParty: 'PP',
  compositionDate: '12 Aug 2026',
  compositionNote: '207 directly elected senators plus 58 designated by autonomous-community legislatures.',
  groups: [
    { id: 'PP', name: 'Popular Parliamentary Group in the Senate', seats: 141, color: '#2f72d6' },
    { id: 'PSOE', name: 'Socialist Parliamentary Group', seats: 89, color: '#e45757' },
    { id: 'ERC–Bildu', name: 'Lefts for Independence (ERC–EH Bildu)', seats: 9, color: '#d5a83c' },
    { id: 'Plural', name: 'Plural Parliamentary Group', seats: 7, color: '#27aeb2' },
    { id: 'PNV', name: 'Basque Parliamentary Group (EAJ-PNV)', seats: 6, color: '#3d9462' },
    { id: 'Confederal', name: 'Confederal Left Parliamentary Group', seats: 6, color: '#d85a9b' },
    { id: 'Mixed', name: 'Mixed Parliamentary Group', seats: 7, color: '#8b8b91' },
  ],
  sourceLabel: 'Senate · current group distribution',
  sourceUrl:
    'https://www.senado.es/web/composicionorganizacion/senadores/composicionsenado/consultagrupoparlamentario/index.html',
};

export const SPAIN_PARLIAMENT_SOURCES = {
  constitution: {
    label: 'Spanish Constitution · Articles 66–69',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229',
  },
  congressPresident: {
    label: 'Congress · Presidency',
    url: 'https://www.congreso.es/es/web/guest/cem/Prte',
  },
  senatePresident: {
    label: 'Senate · Presidency',
    url: 'https://www.senado.es/web/composicionorganizacion/organossenado/presidente/eleccionfunciones/index.html?lang=es_ES',
  },
} as const;
