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
  "images/speakers/michael-roskies.jpg",
  "images/speakers/jamil-ahmad.jpg",
  "images/sponsors/yasa-laser.svg",
  "images/sponsors/cynosure.svg",
  "images/sponsors/sciton.svg",
  "images/sponsors/co2-lift.png",
  "images/sponsors/alastin.svg",
  "images/sponsors/allergan.svg",
  "images/sponsors/skinbetter-science.png",
  "images/sponsors/skinceuticals.png",
  "images/sponsors/tap-by-yasa.png",
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

async function assertOrder(relativePath, needles) {
  const fullPath = path.join(distDir, relativePath);
  const contents = await readFile(fullPath, "utf8");
  let cursor = -1;
  for (const needle of needles) {
    const index = contents.indexOf(needle, cursor + 1);
    if (index === -1) {
      failures.push(`Expected "${needle}" in order in ${relativePath}`);
      return;
    }
    cursor = index;
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
await assertContains("sitemap.xml", `${siteUrl}/venue`);
await assertNotContains("sitemap.xml", `${siteUrl}/hotel-information`);
await assertNotContains("sitemap.xml", `${siteUrl}/contact`);
await assertContains("index.html", "Innovate");
await assertContains("index.html", "More details coming soon");
await assertContains("index.html", "hero-poster.webp");
await assertContains("index.html", "Exploring the Breakthroughs, Technologies, and Techniques");
await assertContains("index.html", "thought-provoking debate");
await assertContains("index.html", "Founded by leaders");
await assertContains("index.html", "Focused on innovation");
await assertContains("index.html", "shared passion for scientific discovery");
await assertContains("index.html", "nadine-with-dr-yazdani.jpg");
await assertContains("index.html", "Stay in touch");
await assertContains("index.html", "The conference will:");
await assertContains("index.html", "Register now");
await assertContains("index.html", "Early bird C$99 through January 1, 2027. C$125 after.");
await assertContains(
  "index.html",
  "https://www.eventbrite.ca/e/innovate-whats-next-in-medical-aesthetics-tickets-2003619736568",
);
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
await assertNotContains("index.html", "Meet the faculty");
await assertNotContains("index.html", "View sponsors");
await assertNotContains("index.html", "Presented by YASA Laser, Innovate is a conference");
await assertContains("index.html", 'href="/speakers"');
await assertContains("index.html", 'href="/sponsors"');
await assertContains("index.html", ">Venue</a>");
await assertNotContains("index.html", 'href="/schedule"');
await assertNotContains("index.html", 'href="/register"');
await assertNotContains("index.html", 'href="/contact"');
await assertContains("index.html", 'href="/venue#getting-there"');
await assertContains("index.html", "Getting there");
await assertContains("index.html", "paid underground parking");
await assertNotContains("index.html", 'href="/hotel-information"');
await assertNotContains("index.html", "Explore the venue");
await assertNotContains("index.html", "Contact the team");
await assertNotContains("index.html", ">Registration<");
await assertNotContains("sitemap.xml", `${siteUrl}/schedule`);
await assertNotContains("register/index.html", "Registration opens soon");
await assertContains("register/index.html", "Register now");
await assertContains("register/index.html", "Early bird");
await assertContains("register/index.html", "C$125 after January 1, 2027");
await assertContains(
  "register/index.html",
  "https://www.eventbrite.ca/e/innovate-whats-next-in-medical-aesthetics-tickets-2003619736568",
);
await assertContains("venue/index.html", "Inside The Quay Gala room");
await assertContains("speakers/index.html", "Dr. Arjang Yazdani, MD, FRCSC");
await assertContains("speakers/index.html", "Nadine Sabino, RN, BScN");
await assertContains("speakers/index.html", "Kimsy Kay");
await assertContains("speakers/index.html", "Ario Khoshbin");
await assertContains("speakers/index.html", "Dr. Michael Roskies");
await assertContains("speakers/index.html", "Dr. Jamil Ahmad");
await assertContains("speakers/index.html", "physicians, nurses, and industry leaders");
await assertContains("speakers/index.html", "Plastic Surgeon | Co-Founder, INNOVATE Conference");
await assertContains(
  "speakers/index.html",
  "Advanced Laser Specialist | Educator | Co-Founder, INNOVATE Conference",
);
await assertContains("speakers/index.html", "Royal College-certified plastic surgeon");
await assertContains("speakers/index.html", "one of the leading aesthetic nurses");
await assertContains(
  "speakers/index.html",
  "Stay tuned as we reveal more exciting speakers and industry-leading experts joining the INNOVATE 2027 lineup!",
);
await assertContains("speakers/index.html", "Empower Aesthetic Medicine Collaborative");
await assertContains("speakers/index.html", "Prollenium Medical Technologies");
await assertContains("speakers/index.html", "Yorkville Plastic Surgery Center");
await assertContains("speakers/index.html", "True Plastic Surgery");
await assertContains("speakers/index.html", "President of The Aesthetic Society");
await assertContains("speakers/index.html", "double fellowship trained, double board certified");
await assertNotContains("speakers/index.html", "From Bench to Bedside");
await assertNotContains("speakers/index.html", "Energy, Injectables, and the Next Wave");
await assertNotContains("speakers/index.html", "yazdaniaesthetics.com");
await assertContains(
  "speakers/index.html",
  "Beyond the Treatment: Clinical Preparedness in Modern Aesthetic Medicine",
);
await assertContains(
  "speakers/index.html",
  "Regenerative Aesthetics and the End of Symptomology",
);
await assertOrder("speakers/index.html", [
  "Dr. Arjang Yazdani, MD, FRCSC",
  "Nadine Sabino, RN, BScN",
  "Ario Khoshbin",
  "Kimsy Kay",
  "Dr. Michael Roskies",
  "Dr. Jamil Ahmad",
]);
await assertContains("sponsors/index.html", "Hosted by");
await assertNotContains("sponsors/index.html", "Presented by");
await assertNotContains("sponsors/index.html", "Confirmed partner");
await assertContains("sponsors/index.html", "Platinum Sponsors");
await assertContains("sponsors/index.html", "Gold Sponsors");
await assertContains("sponsors/index.html", "YASA LASER");
await assertContains("sponsors/index.html", "Sciton");
await assertContains("sponsors/index.html", "CO2 Lift");
await assertContains("sponsors/index.html", "Hydrinity");
await assertContains("sponsors/index.html", "T.A.P by YASA Laser");
await assertNotContains("sponsors/index.html", "Alastin");
await assertContains("sponsors/index.html", "Skinbetter Science");
await assertContains("sponsors/index.html", "SkinCeuticals");
await assertContains("sponsors/index.html", "skinbetter-science.png");
await assertContains("sponsors/index.html", "skinceuticals.png");
await assertContains("sponsors/index.html", "https://scitonlasers.ca/");
await assertContains("sponsors/index.html", "https://www.cynosurecanada.com/");
await assertContains("sponsors/index.html", "https://www.skinbetter.ca/");
await assertContains("sponsors/index.html", "https://www.skinceuticals.ca/");
await assertContains("sponsors/index.html", "https://hydrinitycanada.com/");
await assertContains("sponsors/index.html", "https://co2lift.com/");
await assertContains("sponsors/index.html", "https://tapbyyasa.com/");
await assertContains("sponsors/index.html", "tap-by-yasa.png");
await assertNotContains("sponsors/index.html", "Cynosure Lutronic");
await assertNotContains("sponsors/index.html", "Allergan");
await assertNotContains("sponsors/index.html", "slot available");
await assertContains(
  "sponsors/index.html",
  "Stay tuned as we reveal more exciting sponsors and exhibitors joining the INNOVATE 2027 lineup!",
);
await assertOrder("sponsors/index.html", [
  "Platinum Sponsors",
  "Cynosure",
  "Sciton",
  "Skinbetter Science",
  "SkinCeuticals",
  "Gold Sponsors",
  "CO2 Lift",
  "Hydrinity",
  "T.A.P by YASA Laser",
]);
await assertContains("sponsors/index.html", "events@yasalaser.com");
await assertContains("contact/index.html", "events@yasalaser.com");
await assertContains("hotel-information/index.html", "Hotel information");
await assertContains("hotel-information/index.html", "Suggested hotels");
await assertNotContains("hotel-information/index.html", "Room blocks");
await assertContains("schedule/index.html", "Cocktail hour");
await assertContains("venue/index.html", "7:30 AM");
await assertContains("venue/index.html", "Impark Lot #526");
await assertContains("venue/index.html", "$10 per hour");
await assertContains("venue/index.html", "$25 (6am–6pm)");
await assertContains("venue/index.html", "$15 (6pm–6am)");
await assertContains("venue/index.html", "Cooper Street");
await assertContains("venue/index.html", "John M. Tinsley Street");
await assertContains("venue/index.html", "to the right of the LCBO doors");
await assertContains("venue/index.html", "About 10 minutes");
await assertContains("venue/index.html", "travelmode=walking");
await assertContains("venue/index.html", "not included with registration");
await assertNotContains("venue/index.html", "will be shared with registered attendees");
await assertNotContains("venue/index.html", "QQE@reefparking.com");
await assertContains("hotel-information/index.html", 'href="/venue#getting-there"');
await assertContains("hotel-information/index.html", "Underground parking is paid on site");

if (failures.length > 0) {
  console.error("Smoke test failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Smoke test passed.");
