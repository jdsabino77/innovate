import { access, readFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const siteUrl = "https://innovate.jdsabino.workers.dev";
const requiredPages = [
  "index.html",
  "schedule/index.html",
  "speakers/index.html",
  "sponsors/index.html",
  "venue/index.html",
  "register/index.html",
  "hotel-information/index.html",
  "contact/index.html",
];
const requiredPublicFiles = [
  "robots.txt",
  "sitemap.xml",
  "favicon.svg",
  "images/branding/Innovate_Logo_BlackOnWhite.svg",
  "images/branding/Innovate_Logo_WhiteOnBlack.svg",
  "images/venue/gala-foyer-01.jpg",
  "images/venue/seated-dinner-01.jpg",
  "images/speakers/arjang-yazdani.jpg",
  "images/speakers/nadine-sabino.jpg",
  "images/sponsors/yasa-laser.svg",
  "images/sponsors/cynosure.svg",
  "images/sponsors/sciton.svg",
  "images/sponsors/co2-lift.png",
  "images/sponsors/alastin.svg",
  "images/sponsors/allergan.svg",
  "images/sponsors/loreal-brands.svg",
  "images/home/about-innovate.png",
  "video/hero.mp4",
  "video/hero-poster.webp",
];

const failures = [];

async function assertExists(relativePath) {
  const fullPath = path.join(distDir, relativePath);
  try {
    await access(fullPath);
  } catch {
    failures.push(`Missing file: ${relativePath}`);
  }
}

async function assertContains(relativePath, needle) {
  const fullPath = path.join(distDir, relativePath);
  const contents = await readFile(fullPath, "utf8");
  if (!contents.includes(needle)) {
    failures.push(`Expected "${needle}" in ${relativePath}`);
  }
}

for (const page of requiredPages) {
  await assertExists(page);
}

for (const file of requiredPublicFiles) {
  await assertExists(file);
}

await assertContains("robots.txt", `Sitemap: ${siteUrl}/sitemap.xml`);
await assertContains("sitemap.xml", `${siteUrl}/schedule`);
await assertContains("index.html", "Innovate");
await assertContains("index.html", "miss the experience");
await assertContains("index.html", "hero-poster.webp");
await assertContains("index.html", "Founded by leaders");
await assertContains("index.html", "about-innovate.png");
await assertContains("index.html", "Six confirmed industry partners");
await assertContains("venue/index.html", "Inside The Quay Gala room");
await assertContains("speakers/index.html", "Dr. Arjang Yazdani");
await assertContains("speakers/index.html", "Nadine Sabino");
await assertContains("sponsors/index.html", "Presented by");
await assertContains("sponsors/index.html", "Confirmed partners");
await assertContains("sponsors/index.html", "Yasa Laser");
await assertContains("sponsors/index.html", "Sciton");
await assertContains("sponsors/index.html", "CO2 Lift");
await assertContains("sponsors/index.html", "Alastin Skincare");
await assertContains("sponsors/index.html", "Skinbetter Science");
await assertContains("sponsors/index.html", "Cynosure Lutronic");
await assertContains("sponsors/index.html", "Allergan Aesthetics");
await assertContains("sponsors/index.html", "events@yasalaser.com");
await assertContains("contact/index.html", "events@yasalaser.com");
await assertContains("hotel-information/index.html", "Hotel information");
await assertContains("hotel-information/index.html", "Room blocks");
await assertContains("index.html", "Resources");

if (failures.length > 0) {
  console.error("Smoke test failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Smoke test passed.");
