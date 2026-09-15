import { access, readFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const siteUrl = "https://innovateconference.ca";
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
  "images/venue/the-quay-01.jpg",
  "images/venue/the-quay-02.jpg",
  "images/home/nadine-with-dr-yazdani.jpg",
  "images/speakers/arjang-yazdani.jpg",
  "images/speakers/nadine-sabino.jpg",
  "images/speakers/kimsy-kay.jpg",
  "images/speakers/ario-khoshbin.jpg",
  "images/sponsors/yasa-laser.svg",
  "images/sponsors/cynosure.svg",
  "images/sponsors/sciton.svg",
  "images/sponsors/co2-lift.png",
  "images/sponsors/alastin.svg",
  "images/sponsors/allergan.svg",
  "images/sponsors/skinbetter-science.png",
  "images/sponsors/skinceuticals.png",
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

async function assertNotContains(relativePath, needle) {
  const fullPath = path.join(distDir, relativePath);
  const contents = await readFile(fullPath, "utf8");
  if (contents.includes(needle)) {
    failures.push(`Did not expect "${needle}" in ${relativePath}`);
  }
}

for (const page of requiredPages) {
  await assertExists(page);
}

for (const file of requiredPublicFiles) {
  await assertExists(file);
}

await assertContains("robots.txt", `Sitemap: ${siteUrl}/sitemap.xml`);
await assertContains("sitemap.xml", `${siteUrl}/`);
await assertContains("sitemap.xml", `${siteUrl}/speakers`);
await assertContains("sitemap.xml", `${siteUrl}/sponsors`);
await assertNotContains("sitemap.xml", `${siteUrl}/register`);
await assertNotContains("sitemap.xml", `${siteUrl}/venue`);
await assertNotContains("sitemap.xml", `${siteUrl}/hotel-information`);
await assertNotContains("sitemap.xml", `${siteUrl}/contact`);
await assertContains("index.html", "Innovate");
await assertContains("index.html", "More details coming soon");
await assertContains("index.html", "hero-poster.webp");
await assertContains("index.html", "Founded by leaders");
await assertContains("index.html", "nadine-with-dr-yazdani.jpg");
await assertContains("index.html", "Stay in touch");
await assertContains("index.html", "Presented by YASA Laser, Innovate is a conference");
await assertContains("index.html", "The conference will:");
await assertContains("index.html", "Showcase the latest advancements and innovations");
await assertContains("index.html", "100 Queens Quay East");
await assertContains("index.html", "YASA Laser");
await assertContains("index.html", "YASA Laser. All rights reserved.");
await assertContains("index.html", "data-newsletter-form");
await assertContains("index.html", 'name="firstName"');
await assertNotContains("index.html", "Yasa Laser");
await assertNotContains("index.html", "YASA LASER");
await assertNotContains("index.html", "YASA Laser Clinic");
await assertNotContains("index.html", "Gala room");
await assertNotContains("index.html", "Resources");
await assertNotContains("index.html", "case-based learning");
await assertNotContains("index.html", "Six confirmed industry partners");
await assertContains("index.html", "Meet the faculty");
await assertContains("index.html", 'href="/speakers"');
await assertContains("index.html", "View sponsors");
await assertContains("index.html", 'href="/sponsors"');
await assertNotContains("index.html", 'href="/schedule"');
await assertNotContains("index.html", 'href="/register"');
await assertNotContains("index.html", 'href="/contact"');
await assertNotContains("index.html", 'href="/venue"');
await assertNotContains("index.html", 'href="/hotel-information"');
await assertNotContains("index.html", "Explore the venue");
await assertNotContains("index.html", "Contact the team");
await assertNotContains("index.html", ">Registration<");
await assertNotContains("sitemap.xml", `${siteUrl}/schedule`);
await assertContains("register/index.html", "Registration opens soon");
await assertContains("venue/index.html", "Inside The Quay Gala room");
await assertContains("speakers/index.html", "Dr. Arjang Yazdani");
await assertContains("speakers/index.html", "Nadine Sabino");
await assertContains("speakers/index.html", "Kimsy Kay");
await assertContains("speakers/index.html", "Ario Khoshbin");
await assertContains("speakers/index.html", "Empower Aesthetic Medicine Collaborative");
await assertContains("speakers/index.html", "Prollenium Medical Technologies");
await assertContains(
  "speakers/index.html",
  "From Bench to Bedside: Advancing Facial Aesthetic Innovation Through Evidence and Expertise",
);
await assertContains(
  "speakers/index.html",
  "Energy, Injectables, and the Next Wave: Translating Aesthetic Innovation into Practice",
);
await assertContains(
  "speakers/index.html",
  "Beyond the Treatment: Clinical Preparedness in Modern Aesthetic Medicine",
);
await assertContains(
  "speakers/index.html",
  "Regenerative Aesthetics and the End of Symptomology",
);
await assertContains("sponsors/index.html", "Presented by");
await assertContains("sponsors/index.html", "Confirmed partners");
await assertContains("sponsors/index.html", "YASA LASER");
await assertContains("sponsors/index.html", "Sciton");
await assertContains("sponsors/index.html", "CO2 Lift");
await assertContains("sponsors/index.html", "Alastin Skincare");
await assertContains("sponsors/index.html", "Skinbetter Science");
await assertContains("sponsors/index.html", "SkinCeuticals");
await assertContains("sponsors/index.html", "skinbetter-science.png");
await assertContains("sponsors/index.html", "skinceuticals.png");
await assertContains("sponsors/index.html", "Cynosure Lutronic");
await assertContains("sponsors/index.html", "Allergan Aesthetics");
await assertContains("sponsors/index.html", "events@yasalaser.com");
await assertContains("contact/index.html", "events@yasalaser.com");
await assertContains("hotel-information/index.html", "Hotel information");
await assertContains("hotel-information/index.html", "Suggested hotels");
await assertNotContains("hotel-information/index.html", "Room blocks");
await assertContains("schedule/index.html", "Cocktail hour");
await assertContains("venue/index.html", "7:30 AM");

if (failures.length > 0) {
  console.error("Smoke test failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Smoke test passed.");
