// Syncs each scene's `duration` in scenes.json to the real length of its
// recorded voice-over file, so scenes aren't hand-timed guesses once you
// have actual audio. Runs anywhere (just needs ffprobe, already used by
// this project) — no network, no whisper, no account.
//
// Convention: for a scene with id "scene_003_outro", drop the matching
// narration recording at assets/audio/scene_003_outro.wav (or .mp3) —
// this script finds it by scene id, not by filename guessing.
//
// Usage:
//   node scripts/sync-scene-durations.mjs --project demo

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const opts = { project: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--project") opts.project = argv[++i];
  }
  return opts;
}

async function getAudioDurationSeconds(filePath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    filePath,
  ]);
  return parseFloat(stdout.trim());
}

function findAudioForScene(sceneId) {
  const dir = path.join(repoRoot, "assets", "audio");
  for (const ext of [".wav", ".mp3", ".m4a"]) {
    const candidate = path.join(dir, `${sceneId}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

async function main() {
  const { project } = parseArgs(process.argv.slice(2));
  if (!project) {
    console.error("Usage: node scripts/sync-scene-durations.mjs --project <slug>");
    process.exit(1);
  }

  const scenesPath = path.join(repoRoot, "data", "projects", project, "scenes.json");
  if (!fs.existsSync(scenesPath)) {
    console.error(`Introuvable : ${scenesPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(scenesPath, "utf8"));
  let updated = 0;
  let skipped = 0;

  for (const scene of data.scenes) {
    const audioPath = findAudioForScene(scene.id);
    if (!audioPath) {
      skipped += 1;
      continue;
    }
    const durationSeconds = await getAudioDurationSeconds(audioPath);
    const rounded = Math.round(durationSeconds * 100) / 100;
    console.log(`${scene.id}: ${scene.duration}s -> ${rounded}s (${path.basename(audioPath)})`);
    scene.duration = rounded;
    updated += 1;
  }

  fs.writeFileSync(scenesPath, JSON.stringify(data, null, 2) + "\n");
  console.log(`\n${updated} scène(s) mise(s) à jour, ${skipped} sans audio trouvé (durée inchangée).`);
}

main().catch((err) => {
  console.error("Échec :", err.message ?? err);
  process.exit(1);
});
