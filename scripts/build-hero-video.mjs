import { execSync } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcesPath = path.join(root, "src/data/hero-video-sources.json");
const attributionPath = path.join(root, "public/video/attribution.json");

const sources = JSON.parse(await readFile(sourcesPath, "utf8"));
const settings = sources.settings;
const scenes = sources.scenes
  .filter((scene) => scene.enabled !== false)
  .sort((a, b) => a.order - b.order);

const outputVideo = path.join(root, settings.outputVideo);
const outputPoster = path.join(root, settings.outputPoster);
const outputDir = path.dirname(outputVideo);
const fadeDuration = settings.fadeDuration;
const fps = settings.fps;
const width = settings.width;
const height = settings.height;

function run(command) {
  execSync(command, { stdio: "inherit", cwd: root });
}

function zoomFilter(motion, duration) {
  const frames = Math.round(duration * fps);
  const base = `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},format=yuv420p`;

  if (motion === "pan-right") {
    return `${base},zoompan=z='1.08':x='(iw-iw/zoom)*on/${frames}':y='(ih-ih/zoom)/2':d=${frames}:s=${width}x${height}:fps=${fps}`;
  }

  if (motion === "pan-left") {
    return `${base},zoompan=z='1.08':x='(iw-iw/zoom)*(1-on/${frames})':y='(ih-ih/zoom)/2':d=${frames}:s=${width}x${height}:fps=${fps}`;
  }

  return `${base},zoompan=z='min(zoom+0.0009,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${width}x${height}:fps=${fps}`;
}

async function assertFfmpeg() {
  try {
    execSync("ffmpeg -version", { stdio: "ignore" });
  } catch {
    throw new Error("ffmpeg is required. Install ffmpeg and rerun npm run build:hero-video.");
  }
}

async function assertSources() {
  if (scenes.length === 0) {
    throw new Error("No enabled scenes found in src/data/hero-video-sources.json");
  }

  for (const scene of scenes) {
    const fullPath = path.join(root, scene.file);
    try {
      await access(fullPath);
    } catch {
      throw new Error(`Missing source image for "${scene.label}": ${scene.file}`);
    }
  }
}

async function writeAttribution() {
  const toronto = scenes
    .filter((scene) => scene.category === "toronto")
    .map((scene) => ({
      id: scene.id,
      file: path.basename(scene.file),
      label: scene.label,
      assetUrl: scene.assetUrl,
      photographer: scene.photographer,
      source: scene.source,
      url: scene.sourceUrl ?? scene.sourcePageUrl,
    }));

  const quay = scenes
    .filter((scene) => scene.category === "quay")
    .map((scene) => ({
      id: scene.id,
      file: path.basename(scene.file),
      label: scene.label,
      assetUrl: scene.assetUrl,
      source: scene.source,
      url: scene.sourceUrl ?? scene.sourcePageUrl,
    }));

  const badge = scenes
    .filter((scene) => scene.category === "badge")
    .map((scene) => ({
      id: scene.id,
      file: path.basename(scene.file),
      label: scene.label,
      assetUrl: scene.assetUrl,
      source: scene.source,
    }));

  await writeFile(
    attributionPath,
    `${JSON.stringify(
      {
        manifest: "src/data/hero-video-sources.json",
        toronto,
        quay,
        badge,
        quaySourceAlbums: sources.quaySourceAlbums,
      },
      null,
      2,
    )}\n`,
  );
}

async function buildSegment(scene, index, tempDir) {
  const input = path.join(root, scene.file);
  const output = path.join(tempDir, `segment-${String(index).padStart(2, "0")}.mp4`);
  const filter = zoomFilter(scene.motion, scene.duration);

  run(
    `ffmpeg -y -loop 1 -i "${input}" -vf "${filter}" -t ${scene.duration} -an -c:v libx264 -pix_fmt yuv420p -preset slow -crf 28 "${output}"`,
  );

  return output;
}

async function mergeWithCrossfade(segments, tempDir) {
  let current = segments[0];
  let currentDuration = scenes[0].duration;

  for (let index = 1; index < segments.length; index += 1) {
    const next = segments[index];
    const nextDuration = scenes[index].duration;
    const merged = path.join(tempDir, `merged-${String(index).padStart(2, "0")}.mp4`);
    const offset = Math.max(0, currentDuration - fadeDuration);

    run(
      `ffmpeg -y -i "${current}" -i "${next}" -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${fadeDuration}:offset=${offset},format=yuv420p[v]" -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -preset slow -crf 28 "${merged}"`,
    );

    current = merged;
    currentDuration = offset + nextDuration;
  }

  return { output: current, duration: currentDuration };
}

async function writePoster(videoPath) {
  run(`ffmpeg -y -i "${videoPath}" -vframes 1 -q:v 80 "${outputPoster}"`);
}

async function formatBytes(filePath) {
  const { size } = await stat(filePath);
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

await assertFfmpeg();
await assertSources();
await mkdir(outputDir, { recursive: true });

console.log(`Using ${scenes.length} scenes from src/data/hero-video-sources.json`);
for (const scene of scenes) {
  console.log(`- [${scene.order}] ${scene.label} (${scene.file})`);
}

const tempDir = await mkdtemp(path.join(os.tmpdir(), "innovate-hero-video-"));

try {
  console.log("\nBuilding hero video segments...");
  const segments = [];
  for (let index = 0; index < scenes.length; index += 1) {
    segments.push(await buildSegment(scenes[index], index, tempDir));
  }

  console.log("Merging segments with crossfades...");
  const { output: mergedVideo, duration } = await mergeWithCrossfade(segments, tempDir);

  run(
    `ffmpeg -y -i "${mergedVideo}" -an -c:v libx264 -pix_fmt yuv420p -preset slow -crf 28 -movflags +faststart "${outputVideo}"`,
  );

  await writePoster(outputVideo);
  await writeAttribution();

  const videoSize = await formatBytes(outputVideo);
  const posterSize = await formatBytes(outputPoster);

  console.log(`\nHero video ready:`);
  console.log(`- ${path.relative(root, outputVideo)} (${videoSize}, ~${duration.toFixed(1)}s)`);
  console.log(`- ${path.relative(root, outputPoster)} (${posterSize})`);
  console.log(`- ${path.relative(root, attributionPath)} (updated from manifest)`);

  if (Number.parseFloat(videoSize) > 4 && videoSize.includes("MB")) {
    console.warn("\nWarning: hero.mp4 is larger than the 4 MB target. Consider shorter durations or higher CRF.");
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
