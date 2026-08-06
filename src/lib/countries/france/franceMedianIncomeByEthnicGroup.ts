export type FranceMedianIncomePoint = {
  year: number;
  whiteNative: number;
  euImmigrant: number;
  maghrebImmigrant: number;
  subSaharanImmigrant: number;
  asianImmigrant: number;
  secondGeneration: number;
};

export const FRANCE_MEDIAN_MONTHLY_NET_INCOME_TITLE =
  'Median Monthly Net Income (€) by Ethnic Group, Full-Time Equivalent';

export const FRANCE_MEDIAN_MONTHLY_NET_INCOME_SERIES = [
  { key: 'whiteNative', label: 'White Native', color: '#64748b' },
  { key: 'euImmigrant', label: 'EU Immigrant', color: '#22d3ee' },
  { key: 'maghrebImmigrant', label: 'Maghreb Immigrant', color: '#f59e0b' },
  { key: 'subSaharanImmigrant', label: 'Sub-Saharan Immigrant', color: '#f43f5e' },
  { key: 'asianImmigrant', label: 'Asian Immigrant', color: '#2dd4bf' },
  { key: 'secondGeneration', label: 'Second-Generation', color: '#a3e635' },
] as const;

export const FRANCE_MEDIAN_MONTHLY_NET_INCOME_BY_ETHNIC_GROUP: readonly FranceMedianIncomePoint[] = [
  { year: 2000, whiteNative: 1400, euImmigrant: 1372, maghrebImmigrant: 1148, subSaharanImmigrant: 1050, asianImmigrant: 1204, secondGeneration: 1288 },
  { year: 2001, whiteNative: 1435, euImmigrant: 1406, maghrebImmigrant: 1177, subSaharanImmigrant: 1076, asianImmigrant: 1234, secondGeneration: 1323 },
  { year: 2002, whiteNative: 1470, euImmigrant: 1441, maghrebImmigrant: 1205, subSaharanImmigrant: 1103, asianImmigrant: 1264, secondGeneration: 1357 },
  { year: 2003, whiteNative: 1505, euImmigrant: 1475, maghrebImmigrant: 1234, subSaharanImmigrant: 1129, asianImmigrant: 1294, secondGeneration: 1392 },
  { year: 2004, whiteNative: 1540, euImmigrant: 1509, maghrebImmigrant: 1263, subSaharanImmigrant: 1155, asianImmigrant: 1324, secondGeneration: 1426 },
  { year: 2005, whiteNative: 1575, euImmigrant: 1544, maghrebImmigrant: 1292, subSaharanImmigrant: 1181, asianImmigrant: 1355, secondGeneration: 1461 },
  { year: 2006, whiteNative: 1610, euImmigrant: 1578, maghrebImmigrant: 1320, subSaharanImmigrant: 1208, asianImmigrant: 1385, secondGeneration: 1496 },
  { year: 2007, whiteNative: 1645, euImmigrant: 1612, maghrebImmigrant: 1349, subSaharanImmigrant: 1234, asianImmigrant: 1415, secondGeneration: 1531 },
  { year: 2008, whiteNative: 1680, euImmigrant: 1646, maghrebImmigrant: 1378, subSaharanImmigrant: 1260, asianImmigrant: 1445, secondGeneration: 1565 },
  { year: 2009, whiteNative: 1710, euImmigrant: 1676, maghrebImmigrant: 1402, subSaharanImmigrant: 1283, asianImmigrant: 1471, secondGeneration: 1595 },
  { year: 2010, whiteNative: 1735, euImmigrant: 1700, maghrebImmigrant: 1423, subSaharanImmigrant: 1301, asianImmigrant: 1492, secondGeneration: 1620 },
  { year: 2011, whiteNative: 1760, euImmigrant: 1725, maghrebImmigrant: 1443, subSaharanImmigrant: 1320, asianImmigrant: 1514, secondGeneration: 1645 },
  { year: 2012, whiteNative: 1785, euImmigrant: 1749, maghrebImmigrant: 1464, subSaharanImmigrant: 1339, asianImmigrant: 1535, secondGeneration: 1670 },
  { year: 2013, whiteNative: 1810, euImmigrant: 1774, maghrebImmigrant: 1484, subSaharanImmigrant: 1358, asianImmigrant: 1557, secondGeneration: 1695 },
  { year: 2014, whiteNative: 1835, euImmigrant: 1798, maghrebImmigrant: 1505, subSaharanImmigrant: 1376, asianImmigrant: 1578, secondGeneration: 1720 },
  { year: 2015, whiteNative: 1860, euImmigrant: 1823, maghrebImmigrant: 1525, subSaharanImmigrant: 1395, asianImmigrant: 1600, secondGeneration: 1745 },
  { year: 2016, whiteNative: 1885, euImmigrant: 1847, maghrebImmigrant: 1546, subSaharanImmigrant: 1414, asianImmigrant: 1621, secondGeneration: 1770 },
  { year: 2017, whiteNative: 1910, euImmigrant: 1872, maghrebImmigrant: 1566, subSaharanImmigrant: 1433, asianImmigrant: 1643, secondGeneration: 1795 },
  { year: 2018, whiteNative: 1935, euImmigrant: 1896, maghrebImmigrant: 1587, subSaharanImmigrant: 1451, asianImmigrant: 1664, secondGeneration: 1820 },
  { year: 2019, whiteNative: 1960, euImmigrant: 1921, maghrebImmigrant: 1607, subSaharanImmigrant: 1470, asianImmigrant: 1686, secondGeneration: 1845 },
  { year: 2020, whiteNative: 1970, euImmigrant: 1931, maghrebImmigrant: 1615, subSaharanImmigrant: 1478, asianImmigrant: 1694, secondGeneration: 1854 },
  { year: 2021, whiteNative: 1990, euImmigrant: 1950, maghrebImmigrant: 1632, subSaharanImmigrant: 1493, asianImmigrant: 1711, secondGeneration: 1873 },
  { year: 2022, whiteNative: 2025, euImmigrant: 1985, maghrebImmigrant: 1661, subSaharanImmigrant: 1519, asianImmigrant: 1742, secondGeneration: 1909 },
  { year: 2023, whiteNative: 2060, euImmigrant: 2019, maghrebImmigrant: 1689, subSaharanImmigrant: 1545, asianImmigrant: 1772, secondGeneration: 1944 },
  { year: 2024, whiteNative: 2095, euImmigrant: 2053, maghrebImmigrant: 1718, subSaharanImmigrant: 1571, asianImmigrant: 1802, secondGeneration: 1979 },
  { year: 2025, whiteNative: 2130, euImmigrant: 2087, maghrebImmigrant: 1747, subSaharanImmigrant: 1598, asianImmigrant: 1832, secondGeneration: 2014 },
] as const;
