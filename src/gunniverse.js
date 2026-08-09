const adjectives = ["Amber", "Binary", "Crimson", "Echo", "Neon", "Velvet", "Zenith"];
const nouns = ["Gate", "Harbor", "Pulse", "Spire", "Relay", "Forge", "Drift"];

export function createSectorName(index) {
  const adjective = adjectives[index % adjectives.length];
  const noun = nouns[(index * 3) % nouns.length];
  return `${adjective} ${noun}`;
}

export function buildSectors(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `sector-${index + 1}`,
    name: createSectorName(index),
    pulse: 40 + ((index * 17) % 60),
    orbit: 70 + index * 28,
  }));
}

export function createDispatch(sector) {
  return `${sector.name} reports a ${sector.pulse}% pulse through orbit ${sector.orbit}.`;
}
