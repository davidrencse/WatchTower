import { createServer } from 'vite';

const administrativeAnchors = new Set([
  'Bratislava, Slovakia',
  'Brussels, Belgium',
  'Bucharest, Romania',
  'Budapest, Hungary',
  'Chișinău, Moldova',
  'Geneva, Switzerland',
  'London, United Kingdom',
  'Moscow, Russia',
  'Paris, France',
  'Sofia, Bulgaria',
  'Vienna, Austria',
  'Vilnius, Lithuania',
  'Warsaw, Poland',
]);

const europeanPlaceTerms = [
  'Austria', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Czech Republic', 'Finland',
  'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Lithuania',
  'Moldova', 'Montenegro', 'North Macedonia', 'Poland', 'Romania', 'Russia', 'Serbia',
  'Slovakia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom', 'UK',
];

const expected = new Map([
  ['wme-2025-03-03-a-car-ramming-kills-two', [8.4673098, 49.4892913]], // Mannheim
  ['wme-2025-02-01-russian-missile-strike-on-residential', [34.5507948, 49.5897423]], // Poltava
  ['wme-2023-10-01-a-nightclub-fire-kills-at', [-1.1305431, 37.9923795]], // Murcia
  ['wme-2023-12-08-a-hospital-fire-kills-three', [12.798884, 41.960922]], // Tivoli
  ['wme-2023-05-05-wagner-leader-prigozhin-says-his', [38.0020994, 48.5894123]], // Bakhmut
  ['wme-2025-03-05-a-bridge-collapse-on-the', [4.1872, 50.4748]], // La Louvière
]);

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

try {
  const { WORLD_MICROEVENTS } = await server.ssrLoadModule('/src/data/worldMicroEvents.ts');
  const failures = [];

  for (const [id, coordinate] of expected) {
    const event = WORLD_MICROEVENTS.find((candidate) => candidate.id === id);
    if (!event) {
      failures.push(`${id}: missing record`);
      continue;
    }
    if (event.coordinate[0] !== coordinate[0] || event.coordinate[1] !== coordinate[1]) {
      failures.push(`${id}: expected ${coordinate.join(', ')}, received ${event.coordinate.join(', ')}`);
    }
    if (event.precision === 'national') failures.push(`${id}: still marked as a national fallback`);
  }

  for (const event of WORLD_MICROEVENTS) {
    if (
      event.precision === 'national' &&
      event.place.includes(',') &&
      europeanPlaceTerms.some((term) => event.place.includes(term)) &&
      !administrativeAnchors.has(event.place)
    ) {
      failures.push(`${event.id}: named European place still uses a national fallback (${event.place})`);
    }
  }

  if (failures.length) {
    console.error(`World-event geography check failed:\n- ${failures.join('\n- ')}`);
    process.exitCode = 1;
  } else {
    console.log(`World-event geography check passed (${expected.size} regression pins verified).`);
  }
} finally {
  await server.close();
}
