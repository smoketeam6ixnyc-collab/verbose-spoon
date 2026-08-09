import { buildSectors } from "../src/gunniverse.js";

const sectors = buildSectors(6);
const livePermits = sectors.filter((sector) => sector.pulse >= 50).map((sector) => ({
  sector: sector.name,
  permit: `GUN-${sector.id.toUpperCase()}`,
  pulse: sector.pulse,
}));

console.log(`live permit count: ${livePermits.length}`);
for (const permit of livePermits) {
  console.log(`${permit.permit} ${permit.sector} pulse=${permit.pulse}`);
}
