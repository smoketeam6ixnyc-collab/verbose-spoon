import { buildSectors, createDispatch } from "./gunniverse.js";

const canvas = document.querySelector("#star-map");
const context = canvas.getContext("2d");
const range = document.querySelector("#sector-count");
const output = document.querySelector("#sector-output");
const reroll = document.querySelector("#reroll");
const dispatchList = document.querySelector("#dispatch-list");

let offset = 0;

function drawMap(sectors) {
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#07111f";
  context.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  sectors.forEach((sector, index) => {
    const angle = ((index + offset) / sectors.length) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * sector.orbit;
    const y = centerY + Math.sin(angle) * sector.orbit * 0.56;

    context.beginPath();
    context.strokeStyle = "rgba(118, 214, 255, 0.18)";
    context.ellipse(centerX, centerY, sector.orbit, sector.orbit * 0.56, 0, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.fillStyle = `hsl(${190 + sector.pulse}, 86%, 62%)`;
    context.shadowColor = "#7df9ff";
    context.shadowBlur = 18;
    context.arc(x, y, 8 + sector.pulse / 14, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    context.fillStyle = "#d8f7ff";
    context.font = "14px system-ui, sans-serif";
    context.fillText(sector.name, x + 16, y + 4);
  });
}

function render() {
  const sectors = buildSectors(Number(range.value));
  output.value = range.value;
  dispatchList.replaceChildren(
    ...sectors.map((sector) => {
      const item = document.createElement("li");
      item.textContent = createDispatch(sector);
      return item;
    }),
  );
  drawMap(sectors);
}

range.addEventListener("input", render);
reroll.addEventListener("click", () => {
  offset = (offset + 1) % Number(range.value);
  render();
});

render();
