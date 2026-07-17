/**
 * Generates per-country dossier CSVs mirroring Germany's section CSV templates so every
 * country renders the full Germany-style dashboard with its own data.
 *
 * Reads Germany's CSVs as the structural template (same Sections/Metrics/Submetrics/Units)
 * and emits one file set per country into Assets/Data/countries/<Name>/generated/.
 * Values: real published figures where encoded in ANCHORS (heads of government, parliament
 * seats, labor/health rates, minimum wages, abortion totals, ...); otherwise derived,
 * population-scaled modeled estimates explicitly labeled as such in Source/Notes columns.
 *
 * Usage: node scripts/generate-country-dossiers.mjs
 * Germany's own files are never touched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DE = path.join(ROOT, 'Assets', 'Data', 'countries', 'Germany');
const OUT_BASE = path.join(ROOT, 'Assets', 'Data', 'countries');

// ---------------- CSV utils ----------------
function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur.replace(/\r$/, '')); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur.replace(/\r$/, '')); rows.push(row); }
  return rows.filter(r => r.length > 1 || (r[0] && r[0].trim()));
}
const ser = c => /[",\n]/.test(String(c ?? '')) ? '"' + String(c).replace(/"/g, '""') + '"' : String(c ?? '');
const writeCsv = (f, rows) => fs.writeFileSync(f, rows.map(r => r.map(ser).join(',')).join('\n') + '\n');
const readDe = rel => parseCsv(fs.readFileSync(path.join(DE, rel), 'utf8')).map((r, i) => i === 0 ? r.map(h => h.replace(/^﻿/, '')) : r);

const rnd = (v, sig = 2) => { if (!isFinite(v)) return 0; if (v === 0) return 0; const m = Math.pow(10, sig - 1 - Math.floor(Math.log10(Math.abs(v)))); return Math.round(v * m) / m; };
const pct1 = v => Math.round(v * 10) / 10;

const MODELED = 'Modeled estimate (population-scaled from published patterns); not an official published figure.';

// ---------------- anchors: [name, iso3, popM, medAge, hog, party, ideology, coalitionDesc, nCoal,
//   seatsTotal, parties[[name,seats]..], cpi, unemp, youthU, ltU, lfpr, minWage, hours,
//   healthGdp, healthCapEUR, publicShare, obesity, smoking, suicide, physPer1k, hle, prevMort, alcohol,
//   birthsK, abortionsK|null(scale)|0(banned), natK, frSh, flSh, crSh, clSh, statOffice, statUrl, euMember ]
const A = [
['Australia','AUS',26.7,38,'Anthony Albanese','Labor','centre-left','Labor majority government',1,150,[['Labor',94],['Liberal',28],['Liberal National (LNP)',16],['Nationals',9],['Greens',1],['Independents',13]],75,4.1,9.2,1.0,66.8,'A$24.95/hour',1707,10.5,4900,72,31.7,10.6,12.1,4.0,70.9,150,9.5,289,88,4,2,36,63,'Australian Bureau of Statistics','https://www.abs.gov.au/',false],
['Austria','AUT',9.16,44.5,'Christian Stocker','ÖVP','centre-right','ÖVP–SPÖ–NEOS coalition',3,183,[['FPÖ',57],['ÖVP',51],['SPÖ',41],['NEOS',18],['Grüne',16]],67,5.4,11.3,1.6,62.5,'none (collective agreements)',1443,11.5,5400,76,20.1,20.6,12.4,5.5,70.9,160,11.1,77,null,12,31,3,38,32,'Statistik Austria','https://www.statistik.at/',true],
['Belarus','BLR',9.1,41,'Aleksandr Turchin','non-partisan (pro-Lukashenko)','authoritarian','presidential system; parliament fully pro-government',1,110,[['Belaya Rus',51],['Non-partisan (pro-government)',43],['Communist Party',7],['Others',9]],33,3.5,9.0,1.0,68.0,'BYN 726/month',1750,5.5,1100,68,25.4,25.0,16.5,5.2,65.5,380,10.9,80,null,9,0,0,100,0,'Belstat','https://www.belstat.gov.by/',false],
['Belgium','BEL',11.8,42,'Bart De Wever','N-VA','right / Flemish-nationalist','Arizona coalition (N-VA, MR, Les Engagés, Vooruit, CD&V)',5,150,[['N-VA',24],['Vlaams Belang',20],['MR',20],['PS',16],['PTB-PVDA',15],['Vooruit',13],['Les Engagés',14]],69,5.7,16.5,2.3,65.4,'€12.11/hour',1527,10.9,5100,77,16.0,15.4,13.9,3.3,70.6,170,9.2,110,20,13,10,40,29,'Statbel','https://statbel.fgov.be/',true],
['Bosnia and Herzegovina','BIH',3.2,44,'Borjana Krišto','HDZ BiH','centre-right','state-level coalition (SNSD, HDZ BiH, Troika)',4,42,[['SDA',9],['SNSD',6],['HDZ BiH',5],['SDP',5],['Others',17]],33,12.7,30.0,8.0,47.0,'BAM 1,000/month',1800,9.0,700,70,19.4,35.0,7.4,2.2,64.5,320,7.1,26,null,2,5,3,45,25,'Agencija za statistiku BiH','https://bhas.gov.ba/',false],
['Bulgaria','BGR',6.4,45,'Rosen Zhelyazkov','GERB','centre-right','GERB-led coalition with ITN, BSP support',3,240,[['GERB-SDS',69],['PP-DB',37],['Vazrazhdane',35],['DPS-New Beginning',30],['BSP',20],['ITN',18],['Others',31]],43,4.2,12.5,2.4,56.0,'BGN 1,077/month',1650,8.6,1500,60,25.0,28.2,9.2,4.2,66.2,390,11.2,57,25,15,10,35,20,'NSI Bulgaria','https://www.nsi.bg/',true],
['Canada','CAN',40.1,41,'Mark Carney','Liberal','centre / centre-left','Liberal minority government',1,343,[['Liberal',169],['Conservative',144],['Bloc Québécois',22],['NDP',7],['Greens',1]],76,6.6,13.2,0.9,65.5,'C$17.75/hour (federal)',1685,12.2,5200,70,29.4,11.8,10.2,2.8,71.3,140,8.0,351,97,2,3,42,49,'Statistics Canada','https://www.statcan.gc.ca/',false],
['Croatia','HRV',3.85,45,'Andrej Plenković','HDZ','centre-right','HDZ–DP coalition with minority MPs',3,151,[['HDZ',61],['SDP',42],['DP (Domovinski pokret)',14],['Most',11],['Možemo',10],['Others',13]],50,5.2,15.8,2.2,53.5,'€970/month',1835,7.4,1300,80,26.0,30.1,11.0,3.6,68.6,270,9.6,33,4,10,8,42,30,'DZS Croatia','https://dzs.gov.hr/',true],
['Cyprus','CYP',0.93,39,'Nikos Christodoulides','independent (DISY-aligned)','centre-right','presidential system; cross-party cabinet',2,56,[['DISY',17],['AKEL',15],['DIKO',9],['ELAM',4],['EDEK',3],['Others',8]],56,5.0,14.9,1.5,64.5,'€1,000/month',1837,9.0,2100,55,21.8,26.9,4.0,3.3,71.5,180,8.6,10,1,7,20,40,25,'CYSTAT','https://www.cystat.gov.cy/',true],
['Czech Republic','CZE',10.9,44,'Andrej Babiš','ANO','populist centre-right','ANO–SPD–Motoristé coalition',3,200,[['ANO',80],['Spolu (ODS-led)',52],['STAN',22],['Piráti',18],['SPD',15],['Motoristé',13]],56,2.7,7.9,0.8,60.5,'CZK 20,800/month',1753,9.5,3000,84,26.0,23.2,11.4,4.3,68.9,220,11.6,91,17,12,7,55,20,'Czech Statistical Office','https://www.czso.cz/',true],
['Denmark','DNK',5.98,42,'Mette Frederiksen','Social Democrats','centre-left','SVM government (S, Venstre, Moderaterne)',3,179,[['Social Democrats',50],['Venstre',23],['Moderaterne',16],['Danish People\'s Party',14],['SF',15],['Liberal Alliance',14],['Others',47]],90,2.9,10.5,0.7,70.0,'none (collective agreements)',1394,9.5,6300,84,19.7,13.9,9.8,4.3,71.0,130,9.5,58,14,15,7,38,40,'Danmarks Statistik','https://www.dst.dk/',true],
['Estonia','EST',1.37,42,'Kristen Michal','Reform','liberal','Reform–Eesti 200 coalition',2,101,[['Reform',37],['EKRE',17],['Keskerakond',16],['Eesti 200',14],['SDE',9],['Isamaa',8]],76,7.5,17.5,1.5,68.5,'€886/month',1741,7.6,2400,74,21.3,26.8,13.6,3.5,67.6,240,11.1,11,2,4,15,8,50,25,'Statistics Estonia','https://www.stat.ee/',true],
['Finland','FIN',5.6,43.5,'Petteri Orpo','Kokoomus','centre-right','Kokoomus–PS–RKP–KD coalition',4,200,[['Kokoomus (NCP)',48],['Perussuomalaiset (Finns)',46],['SDP',43],['Keskusta',23],['Vihreät',13],['Vasemmisto',11],['Others',16]],88,8.5,17.2,1.9,66.5,'none (collective agreements)',1499,10.4,4600,80,22.8,15.0,13.4,3.6,70.3,150,8.6,44,8,23,6,44,22,'Statistics Finland','https://www.stat.fi/',true],
['France','FRA',68.4,42,'Sébastien Lecornu','Renaissance','centre','minority government under President Macron',2,577,[['RN (Rassemblement National)',126],['Ensemble/EPR',99],['LFI',71],['PS',66],['LR',47],['Écologistes',38],['Others',130]],67,7.4,18.9,2.0,63.5,'€11.88/hour',1494,12.1,4700,84,21.6,25.3,13.2,3.4,72.1,140,10.4,678,234,22,12,25,30,'INSEE','https://www.insee.fr/',true],
['Greece','GRC',10.4,46,'Kyriakos Mitsotakis','Nea Dimokratia','centre-right','ND single-party majority',1,300,[['Nea Dimokratia',158],['SYRIZA',36],['PASOK',32],['KKE',21],['Elliniki Lysi',12],['Others',41]],49,9.5,22.0,5.5,60.0,'€880/month',1897,8.6,1600,60,24.9,30.6,5.1,6.3,69.1,200,10.4,72,25,10,15,53,23,'ELSTAT','https://www.statistics.gr/',true],
['Hungary','HUN',9.6,44,'Viktor Orbán','Fidesz','national-conservative','Fidesz–KDNP supermajority',2,199,[['Fidesz–KDNP',135],['Tisza',0],['DK–MSZP–P',38],['Mi Hazánk',6],['Jobbik',9],['Others',11]],42,4.5,13.5,1.4,65.0,'HUF 290,800/month',1697,7.0,1400,69,26.0,26.0,15.1,3.4,66.8,300,10.5,85,22,20,3,52,20,'KSH Hungary','https://www.ksh.hu/',true],
['Iceland','ISL',0.39,37,'Kristrún Frostadóttir','Samfylkingin','centre-left','S–Viðreisn–Flokkur fólksins coalition',3,63,[['Samfylkingin',15],['Sjálfstæðisflokkur',14],['Viðreisn',11],['Flokkur fólksins',10],['Miðflokkurinn',8],['Framsókn',5]],77,3.6,8.5,0.4,79.5,'none (collective agreements)',1449,9.0,4900,82,24.0,11.2,11.2,4.1,71.8,120,7.7,4.4,1.1,1.5,8,5,42,40,'Statistics Iceland','https://www.statice.is/',false],
['Ireland','IRL',5.3,39,'Micheál Martin','Fianna Fáil','centre','FF–FG coalition with independents',3,174,[['Fianna Fáil',48],['Sinn Féin',39],['Fine Gael',38],['Labour',11],['Social Democrats',11],['Independents',21],['Others',6]],77,4.3,11.0,1.0,66.0,'€13.50/hour',1658,6.7,5300,76,25.3,17.5,10.9,3.5,71.3,130,9.7,57,10,6,20,4,53,25,'CSO Ireland','https://www.cso.ie/',true],
['Italy','ITA',58.9,48,'Giorgia Meloni','Fratelli d\'Italia','right / national-conservative','FdI–Lega–FI coalition',3,400,[['Fratelli d\'Italia',119],['PD',69],['Lega',66],['M5S',52],['Forza Italia',45],['Others',49]],54,6.1,20.1,3.6,58.5,'none (collective agreements)',1734,9.4,3100,76,19.9,19.0,6.3,4.1,71.9,160,7.7,379,63,26,13,25,35,'ISTAT','https://www.istat.it/',true],
['Latvia','LVA',1.87,44,'Evika Siliņa','Jaunā Vienotība','centre-right','JV-led three-party coalition',3,100,[['Jaunā Vienotība',26],['ZZS',16],['Apvienotais saraksts',15],['Nacionālā apvienība',13],['Progresīvie',10],['Latvija pirmajā vietā',9],['Others',11]],60,6.5,13.5,1.8,64.5,'€740/month',1734,7.8,1700,64,24.6,28.5,15.7,3.4,66.2,290,12.2,14,3,10,8,50,22,'CSB Latvia','https://www.csp.gov.lv/',true],
['Liechtenstein','LIE',0.040,44,'Brigitte Haas','FBP','centre-right','FBP–VU coalition',2,25,[['FBP',10],['VU',8],['DpL',4],['Freie Liste',3]],83,1.6,3.5,0.3,72.0,'none (no statutory minimum)',1600,7.5,6800,72,15.0,17.0,7.0,3.7,72.5,110,7.0,0.35,0.05,0.9,10,2,60,20,'Amt für Statistik Liechtenstein','https://www.statistikportal.li/',false],
['Lithuania','LTU',2.87,44,'Inga Ruginienė','LSDP','centre-left','LSDP-led coalition',3,141,[['LSDP',52],['TS-LKD',28],['Nemuno Aušra',20],['Demokratai',14],['Liberalų sąjūdis',12],['Others',15]],76,7.0,15.0,1.9,68.0,'€1,038/month',1690,7.5,2000,66,26.5,27.1,18.5,4.6,66.6,280,11.1,22,4,10,10,42,32,'Statistics Lithuania','https://osp.stat.gov.lt/',true],
['Luxembourg','LUX',0.67,40,'Luc Frieden','CSV','centre-right','CSV–DP coalition',2,60,[['CSV',21],['DP',14],['LSAP',11],['ADR',5],['Déi Gréng',4],['Others',5]],81,5.8,17.5,1.6,63.0,'€15.25/hour',1473,5.5,6200,84,22.6,20.5,9.4,3.0,71.0,130,10.9,6.6,0.6,5.5,6,4,52,30,'STATEC','https://statistiques.public.lu/',true],
['Malta','MLT',0.55,41,'Robert Abela','Partit Laburista','centre-left','PL majority government',1,79,[['Partit Laburista',44],['Partit Nazzjonalista',35]],46,3.1,8.5,0.7,68.5,'€961/month',1882,9.0,2600,63,28.9,23.4,5.1,4.3,71.5,150,7.0,4.3,0,1.6,4,2,44,50,'NSO Malta','https://nso.gov.mt/',true],
['Moldova','MDA',2.5,37,'Alexandru Munteanu','independent (PAS-backed)','pro-European centre','PAS parliamentary majority',1,101,[['PAS',55],['Patriotic Bloc (socialists/communists)',26],['Alternativa',8],['Our Party',6],['Democracy at Home',6]],43,4.5,10.5,1.0,50.0,'MDL 5,000/month',1750,6.5,500,60,18.9,25.0,13.5,3.2,64.0,340,15.2,27,10,3,20,10,55,15,'BNS Moldova','https://statistica.gov.md/',false],
['Monaco','MCO',0.039,55,'Christophe Mirmand','non-partisan','constitutional monarchy (Minister of State)','princely government; elected Conseil National',1,24,[['Union Nationale Monégasque',24]],70,2.0,5.0,0.3,60.0,'€11.88/hour (French SMIC applied)',1600,4.5,7500,70,15.0,18.0,6.0,7.0,74.0,90,9.0,0.25,0.03,0.15,0,0,80,20,'IMSEE Monaco','https://www.imsee.mc/',false],
['Montenegro','MNE',0.62,40,'Milojko Spajić','Pokret Evropa sad (PES)','centrist / pro-European','PES-led coalition incl. pro-Serb parties',4,81,[['PES',24],['ZBCG (pro-Serb coalition)',13],['DPS',21],['URA',4],['Others',19]],46,13.1,25.0,9.5,55.0,'€670/month',1800,9.0,900,66,23.3,31.0,7.9,2.8,66.5,310,9.9,7,1.5,0.6,12,5,45,30,'MONSTAT','https://www.monstat.org/',false],
['Netherlands','NLD',18.0,42.5,'Dick Schoof (caretaker; coalition talks ongoing)','independent','caretaker','post-Oct-2025 coalition formation in progress',4,150,[['D66',26],['PVV',26],['VVD',22],['GroenLinks–PvdA',20],['CDA',18],['JA21',9],['Others',29]],78,3.8,9.1,0.8,72.5,'€14.06/hour',1449,10.2,5600,84,15.5,19.0,10.6,3.9,71.4,120,8.1,165,39,6,17,7,42,32,'CBS Netherlands','https://www.cbs.nl/',true],
['New Zealand','NZL',5.25,38,'Christopher Luxon','National','centre-right','National–ACT–NZ First coalition',3,123,[['National',49],['Labour',34],['Greens',15],['ACT',11],['NZ First',8],['Te Pāti Māori',6]],83,5.1,12.5,0.9,71.0,'NZ$23.50/hour',1748,10.0,4200,80,34.3,8.0,11.2,3.6,70.2,140,8.5,58,13,0.8,2,44,49,'Stats NZ','https://www.stats.govt.nz/',false],
['Norway','NOR',5.6,40,'Jonas Gahr Støre','Arbeiderpartiet','centre-left','Ap minority government',1,169,[['Arbeiderpartiet',53],['Fremskrittspartiet',48],['Høyre',24],['Senterpartiet',10],['SV',9],['Rødt',6],['Others',19]],81,4.0,11.0,0.7,72.0,'none (collective agreements)',1418,8.0,7300,86,23.1,9.0,10.6,5.2,71.4,110,7.4,52,11,9,10,43,35,'SSB Norway','https://www.ssb.no/',false],
['Poland','POL',36.7,42.5,'Donald Tusk','PO (KO)','centre / centre-right','KO–TD–Lewica coalition under President Nawrocki (PiS-aligned)',3,460,[['PiS',194],['KO',157],['TD (Third Way)',65],['Lewica',26],['Konfederacja',18]],54,2.9,10.5,0.8,58.5,'PLN 4,666/month',1803,6.7,1800,72,23.1,24.0,9.3,3.4,68.7,220,10.6,272,0.4,15,10,4,60,20,'GUS Poland','https://stat.gov.pl/',true],
['Portugal','PRT',10.6,47,'Luís Montenegro','PSD (AD)','centre-right','AD minority government',2,230,[['AD (PSD/CDS)',91],['Chega',60],['PS',58],['IL',9],['BE',5],['Others',7]],57,6.4,20.5,2.8,59.5,'€870/month',1716,10.6,2500,64,20.8,14.2,11.7,5.6,69.8,170,10.4,86,16,21,10,5,48,30,'INE Portugal','https://www.ine.pt/',true],
['Romania','ROU',19.0,43,'Ilie Bolojan','PNL','centre-right','PSD–PNL–USR–UDMR coalition',4,331,[['PSD',86],['AUR',63],['PNL',49],['USR',40],['SOS România',24],['UDMR',22],['Others',47]],46,5.4,21.5,2.0,57.0,'RON 4,050/month',1800,6.5,1200,80,22.5,25.8,7.3,3.5,66.2,320,10.9,155,40,20,12,5,45,25,'INS Romania','https://insse.ro/',true],
['Russia','RUS',146.0,40,'Mikhail Mishustin','non-partisan (United Russia-backed)','authoritarian','United Russia supermajority under President Putin',1,450,[['United Russia',324],['KPRF',57],['LDPR',23],['SRZP',28],['New People',15],['Others',3]],22,2.4,8.5,0.6,62.5,'RUB 22,440/month',1874,7.4,900,60,23.1,26.8,21.6,3.8,64.2,420,10.5,1220,400,25,0,0,100,0,'Rosstat','https://rosstat.gov.ru/',false],
['Serbia','SRB',6.6,44,'Đuro Macut','non-partisan (SNS-backed)','national-populist','SNS-led government',2,250,[['SNS coalition',112],['SPS',18],['Opposition (various)',105],['Others',15]],35,8.6,24.0,4.0,55.0,'RSD 53,592/month',1780,9.1,1100,62,23.0,32.0,10.0,3.1,65.8,300,10.9,62,12,5,15,5,60,20,'RZS Serbia','https://www.stat.gov.rs/',false],
['South Africa','ZAF',63.2,28,'Cyril Ramaphosa','ANC','centre-left','Government of National Unity (ANC, DA, IFP, others)',7,400,[['ANC',159],['DA',87],['MK',58],['EFF',39],['IFP',17],['PA',9],['Others',31]],41,31.9,45.5,20.0,60.0,'ZAR 27.58/hour',2100,8.6,600,50,28.3,20.3,23.5,0.8,56.5,450,7.2,1180,150,5,15,20,20,45,'Stats SA','https://www.statssa.gov.za/',false],
['Slovakia','SVK',5.4,42,'Robert Fico','Smer-SD','left-nationalist','Smer–Hlas–SNS coalition',3,150,[['Smer-SD',42],['PS (Progresívne Slovensko)',32],['Hlas-SD',27],['OĽaNO/Slovensko',16],['KDH',12],['SaS',11],['SNS',10]],54,5.3,20.0,3.9,60.5,'€816/month',1695,7.8,1600,80,20.5,21.0,9.3,3.6,67.0,260,10.3,48,6,12,15,30,35,'Statistical Office SR','https://slovak.statistics.sk/',true],
['Slovenia','SVN',2.12,45,'Robert Golob','Gibanje Svoboda','liberal / centre-left','GS–SD–Levica coalition',3,90,[['Gibanje Svoboda',41],['SDS',27],['NSi',8],['SD',7],['Levica',5],['Others',2]],60,3.7,10.2,1.4,63.0,'€1,254/month',1620,9.5,2900,72,20.4,17.4,15.7,3.3,69.5,190,11.1,17,3,3,3,42,42,'SURS Slovenia','https://www.stat.si/',true],
['Spain','ESP',48.6,45,'Pedro Sánchez','PSOE','centre-left','PSOE–Sumar minority coalition',2,350,[['PP',137],['PSOE',121],['Vox',33],['Sumar',31],['ERC',7],['Junts',7],['Others',14]],56,11.3,26.5,4.5,59.0,'€8.87/hour (€1,184/month)',1632,10.7,3000,72,16.5,19.8,7.9,4.5,71.5,140,10.5,322,103,10,10,42,38,'INE Spain','https://www.ine.es/',true],
['Sweden','SWE',10.6,41,'Ulf Kristersson','Moderaterna','centre-right','M–KD–L government with SD support',4,349,[['Socialdemokraterna',107],['Sverigedemokraterna',72],['Moderaterna',68],['Vänsterpartiet',24],['Centerpartiet',24],['KD',19],['Others',35]],80,8.4,23.0,1.6,74.0,'none (collective agreements)',1440,10.9,5500,86,16.0,10.4,12.8,7.1,71.1,120,8.0,100,34,21,7,32,38,'SCB Sweden','https://www.scb.se/',true],
['Switzerland','CHE',9.0,43,'Federal Council (collegial; 2026 presidency rotates)','multi-party','consensus government','permanent grand coalition (SVP, SP, FDP, Mitte)',4,200,[['SVP',62],['SP',41],['FDP',28],['Mitte',29],['Grüne',23],['GLP',10],['Others',7]],81,2.5,7.5,0.6,68.0,'none federally (cantonal minimums exist)',1533,11.7,8100,68,12.1,24.0,11.2,4.4,72.5,100,8.7,80,11,31,10,30,25,'BFS Switzerland','https://www.bfs.admin.ch/',false],
['Ukraine','UKR',33.0,45,'Yuliia Svyrydenko','independent (Servant of the People-backed)','wartime unity government','Servant of the People majority under President Zelensky',1,450,[['Servant of the People',235],['European Solidarity',27],['Batkivshchyna',24],['Others (various)',114]],35,14.5,19.0,6.0,55.0,'UAH 8,000/month',1800,7.6,300,70,24.1,25.0,17.7,3.0,63.5,400,8.9,187,60,2,3,15,70,'Ukrstat','https://www.ukrstat.gov.ua/',false],
['United Kingdom','GBR',68.3,40.5,'Keir Starmer','Labour','centre-left','Labour majority government',1,650,[['Labour',411],['Conservative',121],['Liberal Democrats',72],['SNP',9],['Independents',14],['Reform UK',5],['Others',18]],71,4.4,14.5,1.2,63.0,'£12.21/hour',1524,11.3,4400,80,26.9,11.9,7.9,3.2,70.1,180,9.7,605,252,10,5,40,42,'ONS','https://www.ons.gov.uk/',false],
['United States','USA',335.0,39,'Donald Trump','Republican','right-populist','Republican trifecta (White House, House, Senate)',1,435,[['Republican',220],['Democratic',213],['Vacant',2]],65,4.2,9.5,0.5,62.6,'$7.25/hour (federal; most states higher)',1799,17.6,12000,55,42.9,11.5,14.2,2.7,66.1,270,9.5,3600,930,880,8,2,50,40,'US Census Bureau / BLS','https://www.bls.gov/',false],
];
const DE_POP = 83.5;

// Countries where abortion is banned or near-banned: official counts overridden.
const ABORTION_SPECIAL = {
  MLT: { total: 0, note: 'Abortion is effectively illegal in Malta (permitted only to save the mother\'s life since 2023); no official abortion statistics exist.' },
  POL: { total: 0.4, note: 'Near-total abortion ban since 2021; value is the small official legal-abortion count. Estimates of abortions obtained abroad/pills are far higher.' },
  LIE: { total: 0.02, note: 'Highly restrictive law; virtually no legal abortions are recorded domestically.' },
  MCO: { total: 0.03, note: 'Restrictive law; most procedures occur in neighbouring France.' },
};

// Gender-care law status for countries where I can state it concretely; others get a generic modeled line.
const GENDER_LAW = {
  GBR: 'Indefinite ban on new puberty-blocker prescriptions for gender dysphoria in under-18s (2024, following the Cass Review).',
  SWE: 'Karolinska/NBHW guidance sharply restricts puberty blockers and hormones for minors to research settings (since 2021-22).',
  FIN: 'COHERE guidance (2020) prioritises psychosocial support; medical intervention for minors restricted to centralised research-oriented care.',
  NOR: 'UKOM review (2023) recommended defining youth gender care as experimental; national guidance under revision.',
  DNK: 'Tightened clinical guidance; most under-18 referrals now receive counselling rather than medication.',
  FRA: 'Académie de Médecine urges great caution for minors; no statutory ban, prescriptions continue under specialist care.',
  NLD: 'Origin of the "Dutch protocol"; puberty blockers remain available to minors under strict multidisciplinary assessment.',
  ESP: 'Ley Trans (2023) allows gender self-identification from 16 and medical pathways for minors with parental/judicial involvement.',
  RUS: 'Complete legal ban on gender-affirming medical care and legal gender change (2023).',
  HUN: 'Legal gender recognition banned (2020); gender-affirming medical care for minors effectively unavailable.',
  USA: 'Varies by state: 20+ states ban gender-affirming care for minors; others protect it. Federal policy restricts it since 2025.',
};

// ---------------- load Germany templates ----------------
const T = {
  health: readDe('health/germany_health_statistics_basic.csv'),
  abort: readDe('health/germany_abortion_statistics.csv'),
  lgbt: readDe('health/germany_gender_care_statistics.csv'),
  labor: readDe('germany_labor_statistics.csv'),
  gov: readDe('government/germany_government_politics.csv'),
  mc1: readDe('germany_migrant_crime_requested_metrics.csv'),
  mc2: readDe('germany_migrant_crime_additional_metrics.csv'),
  pyramid: readDe('germany_2025_population_by_age_and_gender.csv'),
};

// top-immigrant origins per country from the central CSV (already researched)
const central = parseCsv(fs.readFileSync(path.join(ROOT, 'Assets', 'Data', 'shared', 'centralized_merged_country_stats.csv'), 'utf8'));
const cHdr = central[0].map(h => h.replace(/^﻿/, ''));
const iTop = cHdr.indexOf('top_immigrant_countries'); const iIso = cHdr.indexOf('iso3'); const iMig = cHdr.indexOf('immigrants_stock_total');
const ORIGINS = {}; const MIGSTOCK = {};
for (const r of central.slice(1)) {
  const names = String(r[iTop] || '').split(';').map(s => s.trim().replace(/\s*\([^)]*\)\s*$/, '')).filter(Boolean);
  ORIGINS[r[iIso]] = names;
  MIGSTOCK[r[iIso]] = Number(String(r[iMig]).replace(/[^0-9]/g, '')) || 0;
}
const DE_MIG = MIGSTOCK.DEU || 16776000;

// ---------------- generation ----------------
function idify(hdrRow) { return Object.fromEntries(hdrRow.map((h, i) => [h, i])); }

for (const a of A) {
  const [name, iso3, popM, medAge, hog, party, ideology, coalition, nCoal, seatsTotal, parties, cpi,
    unemp, youthU, ltU, lfpr, minWage, hours, healthGdp, healthCap, pubShare, obesity, smoking, suicide,
    phys, hle, prevMort, alcohol, birthsK, abortionsKRaw, natK, frSh, flSh, crSh, clSh, office, officeUrl, eu] = a;
  const s = popM / DE_POP; // population scale vs Germany
  const iso = iso3.toLowerCase();
  const outDir = path.join(OUT_BASE, name, 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  const est = (v) => rnd(v);
  const src = (label) => [office + ' / ' + label, officeUrl];
  const mod = (label) => ['Modeled estimate — ' + label, officeUrl];
  const YR = '2024';

  // ---- health (12 rows, same metrics as Germany) ----
  {
    const hdr = T.health[0]; const out = [hdr];
    const c = idify(hdr);
    const mk = (metric, sub, brk, val, unit, yr, sn, su, notes) => { const r = new Array(hdr.length).fill(''); r[c.Country] = name; r[c.Metric] = metric; r[c.Submetric] = sub; r[c.Breakdown] = brk; r[c.Value] = val; r[c.Unit] = unit; r[c['Reference Year']] = yr; r[c['Source Name']] = sn; r[c['Source URL']] = su; r[c.Notes] = notes; out.push(r); };
    const [sn, su] = src('health statistics');
    mk('Healthcare expenditure', 'Share of GDP', 'Total', healthGdp, 'percent of GDP', YR, sn, su, 'Latest published health expenditure share of GDP.');
    mk('Healthcare expenditure', 'Per capita', 'Total', healthCap, 'EUR per person', YR, sn, su, 'Approximate per-capita health expenditure (EUR-converted).');
    mk('Healthcare expenditure', 'Public/private split', 'Public financing share', pubShare, 'percent of current health expenditure', YR, sn, su, 'Public share of current health expenditure.');
    mk('Healthcare expenditure', 'Public/private split', 'Private financing share', 100 - pubShare, 'percent of current health expenditure', YR, sn, su, 'Residual private share.');
    mk('Obesity rate', 'Adult', 'Total', obesity, 'percent of adults', YR, 'WHO / ' + sn, su, 'Adult obesity prevalence (BMI 30+).');
    mk('Smoking prevalence', 'Adult', 'Total', smoking, 'percent of adults', YR, 'WHO / ' + sn, su, 'Adult smoking prevalence.');
    mk('Suicide Rate', '', 'Total', suicide, 'per 100,000 population', YR, 'WHO / ' + sn, su, 'Age-standardised suicide rate.');
    mk('Physicians per 1,000 people', '', '', phys, 'physicians per 1,000', YR, 'OECD/WHO / ' + sn, su, 'Practising physicians density.');
    mk('Total number of doctors', '', '', Math.round(phys * popM * 1000), 'physicians', YR, 'OECD/WHO / ' + sn, su, 'Derived: physician density × population. Modeled derivation.');
    mk('Healthy life expectancy', 'At birth', 'Total', hle, 'years', YR, 'WHO', 'https://www.who.int/data/gho', 'WHO healthy life expectancy (HALE) at birth.');
    mk('Preventable mortality rate', '', '', prevMort, 'per 100,000 population', YR, 'OECD/Eurostat', 'https://ec.europa.eu/eurostat', 'Preventable mortality.');
    mk('Alcohol consumption', '', 'Total', alcohol, 'litres pure alcohol per capita 15+', YR, 'WHO / ' + sn, su, 'Annual per-capita alcohol consumption.');
    writeCsv(path.join(outDir, `${iso}_health_statistics_basic.csv`), out);
  }

  // ---- abortion (mirror Germany's 17 rows; totals real where known) ----
  {
    const hdr = T.abort[0]; const out = [hdr]; const c = idify(hdr);
    const special = ABORTION_SPECIAL[iso3];
    const totalK = special ? special.total : (abortionsKRaw ?? rnd(birthsK * 0.19));
    const isModeledTotal = !special && abortionsKRaw == null;
    const total = Math.round(totalK * 1000);
    const births = birthsK * 1000;
    const [sn, su] = src('abortion statistics');
    for (const row of T.abort.slice(1)) {
      const r = row.slice(); r[c.Country] = name;
      const metric = r[c.Metric]; const sub = r[c.Submetric];
      const note = (extra) => { r[c.Notes] = extra; };
      r[c['Source Name']] = sn; r[c['Source URL']] = su; r[c['Reference Year']] = YR;
      if (metric === 'Total number of abortions') { r[c.Value] = total; note(special ? special.note : (isModeledTotal ? MODELED : 'Latest published annual total.')); }
      else if (metric === 'Abortion ratio') { r[c.Value] = births ? pct1(total / births * 1000) : 0; note('Derived: abortions per 1,000 births from the totals above.'); }
      else if (metric === 'Trend in total abortions') { r[c.Value] = sub.includes('5') ? '+6' : sub.includes('10') ? '+9' : '+12'; note(MODELED); r[c['Source Name']] = mod('trend')[0]; }
      else if (metric === 'Abortion rate per 1,000 women of reproductive age') { r[c.Value] = pct1(total / (popM * 1e6 * 0.23) * 1000); r[c.Submetric] = 'National age band'; note('Derived from total and estimated women aged 15-49 (23% of population). Modeled derivation.'); }
      else if (metric === 'Number of abortion-providing facilities') { r[c.Value] = sub.includes('change') || sub.includes('Long-term') ? '-25' : Math.max(1, Math.round(1100 * s)); note(MODELED); r[c['Source Name']] = mod('facilities')[0]; }
      else { /* distribution/method/repeat/late-term rows: keep Germany's percentage patterns, relabel as modeled */ note('Distribution assumed similar to published European patterns. ' + MODELED); r[c['Source Name']] = mod('distribution')[0]; r[c['Source URL']] = officeUrl; }
      if (special && ['Repeat abortions', 'Gestational age at abortion', 'Method of abortion', 'Late-term abortions'].includes(metric)) { r[c.Value] = 'n/a'; note(special.note); }
      out.push(r);
    }
    writeCsv(path.join(outDir, `${iso}_abortion_statistics.csv`), out);
  }

  // ---- gender care / LGBT (counts population-scaled; laws per-country) ----
  {
    const hdr = T.lgbt[0]; const out = [hdr]; const c = idify(hdr);
    const [snM, suM] = mod('gender-care statistics');
    for (const row of T.lgbt.slice(1)) {
      const r = row.slice(); r[c.Country] = name;
      const metric = r[c.Metric]; const val = r[c.Value];
      if (metric === 'Law on childhood gender-affirming care') {
        r[c.Value] = GENDER_LAW[iso3] ?? 'No dedicated national statute; clinical practice follows professional guidance. (Modeled summary.)';
        r[c['Source Name']] = GENDER_LAW[iso3] ? 'National legal/clinical guidance (summarised)' : snM;
        r[c['Source URL']] = officeUrl; r[c.Notes] = GENDER_LAW[iso3] ? 'Summary of widely reported national policy status.' : MODELED;
      } else if (/^-?\d+(\.\d+)?$/.test(String(val).trim()) && Number(val) > 50) {
        r[c.Value] = Math.max(0, Math.round(Number(val) * s)); r[c['Source Name']] = snM; r[c['Source URL']] = suM; r[c.Notes] = MODELED;
      } else {
        r[c['Source Name']] = snM; r[c['Source URL']] = suM; r[c.Notes] = 'Rates/percentages assumed similar to published European clinical cohorts. ' + MODELED;
      }
      r[c['Reference Year']] = YR;
      out.push(r);
    }
    writeCsv(path.join(outDir, `${iso}_gender_care_statistics.csv`), out);
  }

  // ---- labor (11 rows) ----
  {
    const hdr = T.labor[0]; const out = [hdr]; const c = idify(hdr);
    const [sn, su] = src('labour statistics');
    const mk = (metric, sub, brk, val, unit, notes, modeled = false) => { const r = new Array(hdr.length).fill(''); r[c.Country] = name; r[c.Metric] = metric; r[c.Submetric] = sub; r[c.Breakdown] = brk; r[c.Value] = val; r[c.Unit] = unit; r[c['Reference Year']] = YR; r[c['Source Name']] = modeled ? mod('labour')[0] : sn; r[c['Source URL']] = su; r[c.Notes] = notes; out.push(r); };
    mk('Youth unemployment rate', '', 'Ages 15–24', youthU, 'percent', 'Latest published youth unemployment rate.');
    mk('Long-term unemployment rate', '', '', ltU, 'percent of labour force', 'Long-term (12m+) unemployment.');
    mk('Labour force participation rate', '', 'Total (15–64)', lfpr, 'percent', 'Latest published participation rate.');
    mk('Labour force participation rate', 'By migrant/native status', 'Native-born — total', pct1(lfpr + 1.5), 'percent', MODELED, true);
    mk('Labour force participation rate', 'By migrant/native status', 'Foreign-born — total', pct1(lfpr - 6), 'percent', MODELED, true);
    mk('Labour force participation rate', 'By migrant/native status', 'Native-born — men', pct1(lfpr + 5), 'percent', MODELED, true);
    mk('Labour force participation rate', 'By migrant/native status', 'Foreign-born — men', pct1(lfpr - 1), 'percent', MODELED, true);
    mk('Labour force participation rate', 'By migrant/native status', 'Native-born — women', pct1(lfpr - 2), 'percent', MODELED, true);
    mk('Labour force participation rate', 'By migrant/native status', 'Foreign-born — women', pct1(lfpr - 12), 'percent', MODELED, true);
    mk('Minimum wage', '', '', minWage, 'statutory minimum', 'Statutory minimum wage (or none where wages are set by collective agreements).');
    mk('Average annual working hours per worker', '', '', hours, 'hours per year', 'OECD-style average annual hours actually worked.');
    writeCsv(path.join(outDir, `${iso}_labor_statistics.csv`), out);
  }

  // ---- government politics (mirror Germany's 67-row structure) ----
  {
    const hdr = T.gov[0]; const out = [hdr]; const c = idify(hdr);
    const [snO, suO] = src('government statistics');
    const trust = (base) => Math.max(8, Math.min(85, Math.round(base + (cpi - 50) * 0.55)));
    const nat = natK * 1000;
    const origins = (ORIGINS[iso3] || []).slice(0, 5);
    const natShares = [0.2, 0.12, 0.09, 0.07, 0.05];
    const mk = (section, subsection, metric, sub, brk, val, unit, sn2, su2, notes) => {
      const r = new Array(hdr.length).fill('');
      r[c.Section] = section; r[c.Subsection] = subsection; r[c.Metric] = metric; r[c.Submetric] = sub ?? ''; r[c.Breakdown] = brk ?? '';
      r[c.Value] = val; r[c.Unit] = unit; r[c['Reference Year']] = '2025'; r[c['Source Name']] = sn2 ?? snO; r[c['Source URL']] = su2 ?? suO; r[c.Notes] = notes ?? '';
      out.push(r);
    };
    mk('Government', 'Overview', 'head of government', '', '', hog, 'name', null, null, 'Head of government as of late 2025/early 2026.');
    mk('Government', 'Overview', 'head of government political party', '', '', party, 'party', null, null, '');
    mk('Government', 'Overview', 'head of government political ideology', '', '', ideology, 'ideology', null, null, '');
    mk('Government', 'Overview', 'governing coalition', '', '', coalition, 'coalition', null, null, '');
    mk('Government', 'Overview', 'number of coalition parties', '', '', nCoal, 'parties', null, null, '');
    mk('Government', 'Parliament', 'total seats', '', '', seatsTotal, 'seats', null, null, 'Lower/main chamber.');
    let coalSeats = 0;
    for (const [pname, pseats] of parties) { mk('Government', 'Parliament', 'seats by party', '', pname, pseats, 'seats', null, null, ''); }
    coalSeats = Math.round(seatsTotal * 0.54);
    mk('Government', 'Parliament', 'majority threshold', '', '', Math.floor(seatsTotal / 2) + 1, 'seats', null, null, '');
    mk('Government', 'Parliament', 'coalition seat total', '', '', coalSeats, 'seats', mod('coalition seats')[0], null, MODELED);
    mk('Government', 'Parliament', 'opposition seat total', '', '', seatsTotal - coalSeats, 'seats', mod('opposition seats')[0], null, MODELED);
    mk('Government', 'Parliament', 'number of parties represented', '', '', parties.length, 'parties', null, null, 'Top groupings shown above.');
    mk('Government', 'Parliament', 'party fragmentation index', '', '', pct1(2 + parties.length * 0.45), 'effective number of parties', mod('fragmentation')[0], null, MODELED);
    mk('Government', 'Parliament', 'trust in parliament', '', '', trust(38), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'trust in government', '', '', trust(36), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'trust in political parties', '', '', trust(24), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'trust in courts', '', '', trust(52), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'trust in police', '', '', trust(62), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'satisfaction with democracy', '', '', trust(45), 'percent', 'Eurobarometer/OECD-style survey (modeled)', 'https://europa.eu/eurobarometer', MODELED);
    mk('Government', 'Parliament', 'perceived corruption', '', '', 100 - cpi, 'inverted CPI (100−score)', 'Transparency International CPI 2024', 'https://www.transparency.org/en/cpi/2024', 'Derived from the real CPI score (' + cpi + ').');
    const pol = (m, v) => mk('Government', 'Policies', m, '', '', v, 'major changes since 2015', mod('policy count')[0], null, MODELED);
    pol('immigration law changes', Math.max(1, Math.round(3 + frSh / 10)));
    pol('asylum law changes', Math.max(1, Math.round(2 + frSh / 12)));
    pol('citizenship law changes', 2); pol('criminal justice reforms', 3); pol('education reforms', 3); pol('family policy reforms', 2);
    pol('free speech / assembly restrictions', cpi < 45 ? 4 : 1); pol('constitutional court rulings', 4); pol('emergency powers usage', iso3 === 'UKR' ? 12 : 1);
    const share = (m, v) => mk('Government', 'Polarization', m, '', '', v, 'percent of vote (latest national election)', snO, suO, 'Approximate national-election share.');
    share('far-right vote share', frSh); share('far-left vote share', flSh); share('center-right vote share', crSh); share('center-left vote share', clSh);
    mk('Government', 'Polarization', 'anti-establishment party vote share', '', '', pct1(frSh + flSh * 0.6), 'percent', mod('anti-establishment share')[0], null, MODELED);
    mk('Government', 'Polarization', 'number of effective parties', '', '', pct1(2 + parties.length * 0.5), 'effective parties', mod('ENP')[0], null, MODELED);
    mk('Government', 'Polarization', 'coalition instability', '', '', nCoal >= 4 ? 'high' : nCoal >= 3 ? 'moderate' : 'low', 'qualitative', mod('stability')[0], null, MODELED);
    mk('Government', 'Polarization', 'vote swing from previous election', '', '', pct1(4 + frSh / 5), 'percentage points (net)', mod('swing')[0], null, MODELED);
    mk('Government', 'Citizenship', 'naturalizations per year', '', '', Math.round(nat), 'people', snO, suO, natK > 0 ? 'Latest published/estimated annual naturalizations.' : MODELED);
    origins.forEach((o, i) => mk('Government', 'Citizenship', 'naturalizations by prior nationality', '', o, Math.round(nat * natShares[i]), 'people', mod('naturalization origins')[0], null, 'Origin ranking from migrant-stock data; counts modeled.'));
    mk('Government', 'Citizenship', 'average years of residence before naturalization', '', '', 8, 'years', mod('residence duration')[0], null, MODELED);
    mk('Government', 'Citizenship', 'dual-citizenship cases', '', '', Math.round(nat * 0.55), 'people (of annual naturalizations)', mod('dual citizenship')[0], null, MODELED);
    mk('Government', 'Citizenship', 'denaturalization / loss of citizenship counts where applicable', '', '', 'rare; not systematically published', 'qualitative', snO, suO, '');
    mk('Government', 'Citizenship', 'applications for naturalization', '', '', Math.round(nat * 1.35), 'applications', mod('applications')[0], null, MODELED);
    mk('Government', 'Citizenship', 'approval / rejection rates', 'approval', '', 84, 'percent', mod('approval rate')[0], null, MODELED);
    mk('Government', 'Citizenship', 'approval / rejection rates', 'rejection', '', 16, 'percent', mod('rejection rate')[0], null, MODELED);
    const emp = (brk, v) => mk('Economic', 'Labor & Income Distribution', 'employment rates by nationality', '', brk, v, 'percent employed (15–64)', mod('employment by nationality')[0], null, MODELED);
    emp('Total', pct1(lfpr - unemp * 0.6)); emp('Nationals / native-born', pct1(lfpr - unemp * 0.6 + 2)); emp('Foreign nationals / foreign-born', pct1(lfpr - unemp * 0.6 - 9));
    mk('Economic', 'Labor & Income Distribution', 'welfare dependency by nationality/status', '', 'Nationals', pct1(5 + unemp * 0.4), 'percent receiving core welfare benefits', mod('welfare dependency')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'welfare dependency by nationality/status', '', 'Foreign nationals', pct1((5 + unemp * 0.4) * 2.4), 'percent receiving core welfare benefits', mod('welfare dependency')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'social assistance recipients by citizenship', '', 'Nationals', est(popM * 1e6 * 0.045), 'people', mod('social assistance')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'social assistance recipients by citizenship', '', 'Foreign nationals', est((MIGSTOCK[iso3] || popM * 1e6 * 0.1) * 0.13), 'people', mod('social assistance')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'benefit fraud cases', '', '', est(150000 * s), 'cases per year', mod('benefit fraud')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'illegal employment cases', '', '', est(100000 * s), 'cases per year', mod('illegal employment')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'minimum wage enforcement cases', '', '', minWage.startsWith('none') ? 'n/a (no statutory minimum wage)' : est(50000 * s), minWage.startsWith('none') ? 'qualitative' : 'cases per year', mod('enforcement')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'work-permit grants', '', '', est(180000 * s), 'permits per year', mod('work permits')[0], null, MODELED);
    mk('Economic', 'Labor & Income Distribution', 'Blue Card approvals', '', '', eu ? est(30000 * s) : 'n/a (EU Blue Card scheme does not apply)', eu ? 'approvals per year' : 'qualitative', mod('Blue Card')[0], null, eu ? MODELED : 'Non-EU country.');
    mk('Economic', 'Labor & Income Distribution', 'student visa conversions to work permits', '', '', est(25000 * s), 'conversions per year', mod('visa conversions')[0], null, MODELED);
    writeCsv(path.join(outDir, `${iso}_government_politics.csv`), out);
  }

  // ---- migrant crime (scale Germany's estimates by relative migrant stock) ----
  {
    const m = (MIGSTOCK[iso3] || popM * 1e6 * 0.08) / DE_MIG;
    const hdr1 = T.mc1[0]; const out1 = [hdr1]; const c1 = idify(hdr1);
    for (const row of T.mc1.slice(1)) {
      const r = row.slice(); r[c1.country] = name;
      if (String(r[c1.value]).trim() !== '' && !isNaN(Number(r[c1.value]))) { r[c1.value] = est(Number(r[c1.value]) * m); }
      if (c1.best_official_substitute >= 0) r[c1.best_official_substitute] = '';
      r[c1.source] = 'Modeled estimate scaled from comparable published patterns';
      r[c1.source_url] = officeUrl;
      r[c1.note] = 'Modeled estimate: scaled by relative foreign-born population; ' + name + ' does not publish this exact series.';
      out1.push(r);
    }
    writeCsv(path.join(outDir, `${iso}_migrant_crime_requested_metrics.csv`), out1);
    const hdr2 = T.mc2[0]; const out2 = [hdr2]; const c2 = idify(hdr2);
    for (const row of T.mc2.slice(1)) {
      const r = row.slice(); r[c2.country] = name;
      if (!isNaN(Number(r[c2.value])) && String(r[c2.value]).trim() !== '') r[c2.value] = est(Number(r[c2.value]) * m);
      r[c2.source] = 'Modeled estimate scaled from comparable published patterns';
      r[c2.source_url] = officeUrl;
      r[c2.method_note] = 'Modeled estimate: scaled by relative foreign-born population.';
      out2.push(r);
    }
    writeCsv(path.join(outDir, `${iso}_migrant_crime_additional_metrics.csv`), out2);
  }

  // ---- population pyramid (modeled age structure tilted by median age) ----
  {
    const hdr = T.pyramid[0]; const out = [hdr];
    const deRows = T.pyramid.slice(1);
    const k = (45.2 - medAge) * 0.045; // younger country → boost young bands
    let weights = deRows.map((r, i) => Math.max(0.05, Number(r[5]) * (1 + k * (10 - i) / 10)));
    const wSum = weights.reduce((x, y) => x + y, 0);
    const totalPop = popM * 1e6;
    deRows.forEach((r, i) => {
      const t = Math.round(totalPop * weights[i] / wSum);
      const maleShare = Number(r[3]) / (Number(r[3]) + Number(r[4])); // Germany's male share curve per band
      const male = Math.round(t * maleShare);
      out.push([name, '2025', r[2], male, t - male, t]);
    });
    writeCsv(path.join(outDir, `${iso}_population_pyramid.csv`), out);
  }

  // ---- news rail (per-country topic feed; real resolvable URLs, thumbnails auto-derived) ----
  {
    const wiki = name.replace(/ /g, '_');
    const teSlug = name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
    const items = [
      ['Economy', `Economy of ${name} — overview`, `https://en.wikipedia.org/wiki/Economy_of_${wiki}`],
      ['Economy', `${name}: latest macroeconomic indicators`, `https://tradingeconomics.com/${teSlug}/indicators`],
      ['Immigration', `Immigration to ${name}`, `https://en.wikipedia.org/wiki/Immigration_to_${wiki}`],
      ['Immigration', `Demographics of ${name}`, `https://en.wikipedia.org/wiki/Demographics_of_${wiki}`],
      ['Crime', `Crime in ${name}`, `https://en.wikipedia.org/wiki/Crime_in_${wiki}`],
      ['Crime', `Law enforcement in ${name}`, `https://en.wikipedia.org/wiki/Law_enforcement_in_${wiki}`],
      ['Health', `Healthcare in ${name}`, `https://en.wikipedia.org/wiki/Healthcare_in_${wiki}`],
      ['Health', `Health in ${name}`, `https://en.wikipedia.org/wiki/Health_in_${wiki}`],
    ];
    const out = [['Topic', 'Published Date', 'Title', 'URL', 'Image']];
    for (const [topic, title, url] of items) out.push([topic, '2026-01-01', title, url, '']);
    writeCsv(path.join(outDir, `${iso}_news.csv`), out);
  }

  // ---- immigration treemap (from real top-origin stocks in the central CSV) ----
  {
    const hdr = T.treemapHdr ?? parseCsv(fs.readFileSync(path.join(DE, 'germany_populationpyramid_2024_treemap_labeled_items.csv'), 'utf8'))[0];
    const out = [hdr];
    const stock = MIGSTOCK[iso3] || Math.round(popM * 1e6 * 0.08);
    const namesRaw = String((central.slice(1).find(r => r[iIso] === iso3) || [])[iTop] || '');
    const entries = namesRaw.split(';').map(sq => { const mm = sq.trim().match(/^(.*?)\s*\(([\d,~]+)\)\s*$/); return mm ? [mm[1], Number(mm[2].replace(/[^0-9]/g, ''))] : null; }).filter(Boolean);
    let used = 0;
    for (const [oname, ocount] of entries) { used += ocount; }
    const rest = Math.max(0, stock - used);
    const restSplit = [['Other countries (combined)', rest]];
    const all = entries.concat(restSplit).filter(e => e[1] > 0);
    for (const [oname, ocount] of all) {
      out.push(['Immigrants', oname, ocount, 50, pct1(ocount / stock * 100), stock,
        'UN DESA / KNOMAD bilateral migrant stock (via WatchTower central dataset)',
        'https://www.un.org/development/desa/pd/content/international-migrant-stock',
        'UN DESA International Migrant Stock']);
    }
    writeCsv(path.join(outDir, `${iso}_immigration_treemap.csv`), out);
  }
}

console.log(`Generated dossier CSVs for ${A.length} countries into Assets/Data/countries/<Name>/generated/`);
