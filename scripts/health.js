import { access, readFile } from "node:fs/promises";

const requiredFiles = ["index.html", "src/gunniverse.js", "src/main.js", "src/styles.css", "data/events.json"];

for (const file of requiredFiles) {
  await access(file);
}

const events = JSON.parse(await readFile("data/events.json", "utf8"));
if (!Array.isArray(events)) {
  throw new TypeError("data/events.json must contain an array");
}

console.log("health: ok");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`persisted event count: ${events.length}`);
