import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const albums = [
  {
    url: "https://photos.app.goo.gl/6UujjHUUt7y11KTcA",
    prefix: "gala-foyer",
  },
  {
    url: "https://photos.app.goo.gl/jgWDnjcaY8MURrQH8",
    prefix: "foyer-food",
  },
  {
    url: "https://photos.app.goo.gl/7x7BeLn3NoWhYUPj8",
    prefix: "gala-room",
  },
  {
    url: "https://photos.app.goo.gl/8WNW8VrL6cdgq4f78",
    prefix: "bar-food",
  },
  {
    url: "https://photos.app.goo.gl/U7joAmSpG6UBc5QB9",
    prefix: "seated-dinner",
  },
];

const outDir = path.resolve("public/images/venue");
const sizeSuffix = "=w1600-h1200-k-no";

function extractPhotoUrls(html) {
  const matches = html.matchAll(/https:\/\/lh3\.googleusercontent\.com\/pw\/[^"'\\)\s]+/g);
  const urls = new Set();

  for (const match of matches) {
    let url = match[0];
    if (url.includes("=w") || url.includes("-h")) {
      url = url.replace(/=[^)\s]+$/u, sizeSuffix);
    } else {
      url = `${url}${sizeSuffix}`;
    }
    if (!url.includes("=w48-h") && !url.includes("=w108-h") && !url.includes("=w600-h315")) {
      urls.add(url.split(")")[0]);
    }
  }

  return [...urls];
}

async function downloadAlbum({ url, prefix }) {
  const response = await fetch(url, { redirect: "follow" });
  const html = await response.text();
  const photoUrls = extractPhotoUrls(html).slice(0, 3);
  const saved = [];

  for (let index = 0; index < photoUrls.length; index += 1) {
    const photoUrl = photoUrls[index];
    const filename = `${prefix}-${String(index + 1).padStart(2, "0")}.jpg`;
    const filePath = path.join(outDir, filename);

    try {
      const imageResponse = await fetch(photoUrl);
      if (!imageResponse.ok) continue;
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      if (buffer.length < 5000) continue;
      await writeFile(filePath, buffer);
      saved.push(filename);
    } catch {
      // skip failed downloads
    }
  }

  return saved;
}

await mkdir(outDir, { recursive: true });

const allSaved = [];
for (const album of albums) {
  const saved = await downloadAlbum(album);
  allSaved.push(...saved);
  console.log(`${album.prefix}: ${saved.length} photo(s)`);
}

console.log(`\nSaved ${allSaved.length} photos to public/images/venue/`);
