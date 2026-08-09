import test from "node:test";
import assert from "node:assert/strict";
import { buildSectors, createDispatch, createSectorName } from "../src/gunniverse.js";

test("creates deterministic sector names", () => {
  assert.equal(createSectorName(0), "Amber Gate");
  assert.equal(createSectorName(1), "Binary Spire");
});

test("builds the requested number of sectors", () => {
  const sectors = buildSectors(4);
  assert.equal(sectors.length, 4);
  assert.deepEqual(Object.keys(sectors[0]), ["id", "name", "pulse", "orbit"]);
});

test("formats sector dispatches", () => {
  assert.equal(
    createDispatch({ name: "Neon Relay", pulse: 72, orbit: 154 }),
    "Neon Relay reports a 72% pulse through orbit 154.",
  );
});
