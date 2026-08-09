import { readFile, writeFile } from "node:fs/promises";
import { buildSectors, createDispatch } from "../src/gunniverse.js";

const eventFile = "data/events.json";
const existingEvents = JSON.parse(await readFile(eventFile, "utf8"));
if (!Array.isArray(existingEvents)) {
  throw new TypeError("data/events.json must contain an array");
}

const sectors = buildSectors(6);
const knownIds = new Set(existingEvents.map((event) => event.id));
const newEvents = sectors
  .map((sector) => ({
    id: `dispatch-${sector.id}`,
    sector: sector.name,
    message: createDispatch(sector),
  }))
  .filter((event) => !knownIds.has(event.id));

const events = [...existingEvents, ...newEvents];
await writeFile(eventFile, `${JSON.stringify(events, null, 2)}\n`);

console.log(`persisted event count: ${events.length}`);
console.log(`new events written: ${newEvents.length}`);
