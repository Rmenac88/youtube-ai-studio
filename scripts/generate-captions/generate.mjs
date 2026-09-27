// Transcribes a real voice recording into timed captions, entirely
// locally via whisper.cpp — no API, no account, no audio ever leaves
// your machine.
//
// MUST run on your own computer, not in a cloud sandbox: whisper.cpp's
// models are hosted on huggingface.co, which this project's cloud
// sandbox cannot reach (network allowlist — see the audit). Your normal
// internet connection has no such restriction.
//
// Requires ffmpeg installed locally (macOS: `brew install ffmpeg`).
//
// Usage:
//   npm install
//   npm run generate -- <path-to-audio-or-video> --project demo [--model base] [--language fr]
//
// Writes: data/projects/<project>/captions.json — an array of
// { text, startMs, endMs }, exactly the shape video/remotion/src/types.ts
// expects for VideoProject.captions.

import { installWhisperCpp, downloadWhisperModel, transcribe } from "@remotion/install-whisper-cpp";
import { toCaptions } from "@remotion/install-whisper-cpp";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import url from "node:url";

const execFileAsync = promisify(execFile);

// Pinned so a render is reproducible. Verified against the project's
// real releases via web search on 2026-09-27 — check
// https://github.com/ggml-org/whisper.cpp/releases before bumping, don't
// guess a newer one.
const WHISPER_CPP_VERSION = "1.9.4";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const whisperInstallDir = path.join(__dirname, ".whisper-cpp"); // gitignored

function parseArgs(argv) {
  const [inputPath, ...rest] = argv;
  const opts = { project: undefined, model: "base", language: "fr" };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--project") opts.project = rest[++i];
    else if (arg === "--model") opts.model = rest[++i];
    else if (arg === "--language") opts.language = rest[++i];
  }
  return { inputPath, ...opts };
}

async function toWav16kMono(inputPath, workDir) {
  const outPath = path.join(workDir, "audio-16k-mono.wav");
  await execFileAsync("ffmpeg", [
    "-y",
    "-i", inputPath,
    "-vn",
    "-acodec", "pcm_s16le",
    "-ar", "16000",
    "-ac", "1",
    outPath,
  ]);
  return outPath;
}

async function main() {
  const { inputPath, project, model, language } = parseArgs(process.argv.slice(2));

  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error("Usage: npm run generate -- <audio-ou-video> --project <slug> [--model base] [--language fr]");
    process.exit(1);
  }
  if (!project) {
    console.error("--project est obligatoire (ex. --project demo, dossier data/projects/demo/).");
    process.exit(1);
  }

  console.log("1/4 — Installation de whisper.cpp (une seule fois, réutilisé ensuite)...");
  await installWhisperCpp({ version: WHISPER_CPP_VERSION, to: whisperInstallDir, printOutput: true });

  console.log(`2/4 — Téléchargement du modèle "${model}" (une seule fois)...`);
  await downloadWhisperModel({ model, folder: whisperInstallDir, printOutput: true });

  console.log("3/4 — Conversion audio en WAV 16kHz mono (format attendu par whisper.cpp)...");
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "captions-"));
  const wavPath = await toWav16kMono(path.resolve(inputPath), workDir);

  console.log("4/4 — Transcription (peut prendre quelques minutes selon la durée)...");
  const { transcription } = await transcribe({
    inputPath: wavPath,
    model,
    tokenLevelTimestamps: true,
    whisperPath: whisperInstallDir,
    whisperCppVersion: WHISPER_CPP_VERSION,
    language,
    printOutput: true,
    onProgress: (p) => process.stdout.write(`\r  ${Math.round(p * 100)}%`),
  });

  const { captions } = toCaptions({ whisperCppOutput: { transcription } });

  const outDir = path.join(repoRoot, "data", "projects", project);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "captions.json");
  const simplified = captions.map((c) => ({
    text: c.text,
    startMs: c.startMs,
    endMs: c.endMs,
  }));
  fs.writeFileSync(outPath, JSON.stringify(simplified, null, 2));

  console.log(`\n\n=== Terminé ===`);
  console.log(`${simplified.length} sous-titres écrits dans ${outPath}`);
  console.log(
    "Colle ce tableau dans le champ \"captions\" de " +
      `data/projects/${project}/scenes.json pour les activer.`
  );

  fs.rmSync(workDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error("Échec :", err.message ?? err);
  process.exit(1);
});
