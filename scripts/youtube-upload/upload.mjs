// Uploads one video to YouTube via the Data API v3.
//
// Credentials come ONLY from environment variables — this script never
// reads or writes a credentials file. Locally: create a `.env` here
// (gitignored) or export the vars in your shell. In CI: GitHub Actions
// injects the repo secrets as env vars (see .github/workflows/... when
// that's wired up in V2 — this script works standalone either way).
//
// Required env vars:
//   YOUTUBE_CLIENT_ID
//   YOUTUBE_CLIENT_SECRET
//   YOUTUBE_REFRESH_TOKEN
//
// Usage:
//   node upload.mjs <path-to-video.mp4> --title "..." [--description "..."]
//     [--tags "tag1,tag2"] [--privacy private|unlisted|public] [--category 22]
//
// Safety default: --privacy defaults to "private". You must pass
// --privacy public explicitly to actually publish — nothing goes live by
// accident from this script.

import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const [filePath, ...rest] = argv;
  const opts = {
    privacy: "private",
    title: undefined,
    description: "",
    tags: [],
    category: "22", // "People & Blogs" — YouTube's default-ish category.
    // À VÉRIFIER : confirme que c'est la bonne catégorie pour ta chaîne
    // (liste complète : videoCategories.list sur l'API, elle varie par pays).
  };
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "--title") opts.title = rest[++i];
    else if (arg === "--description") opts.description = rest[++i];
    else if (arg === "--tags") opts.tags = rest[++i].split(",").map((t) => t.trim());
    else if (arg === "--privacy") opts.privacy = rest[++i];
    else if (arg === "--category") opts.category = rest[++i];
  }
  return { filePath, ...opts };
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Variable d'environnement manquante : ${name}`);
    console.error(
      "Définis-la (export/.env) — voir les 3 secrets créés sur GitHub, " +
        "à reporter dans ton environnement local pour un test manuel."
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  const { filePath, title, description, tags, privacy, category } = parseArgs(
    process.argv.slice(2)
  );

  if (!filePath || !fs.existsSync(filePath)) {
    console.error("Fichier vidéo introuvable. Usage :");
    console.error(
      '  node upload.mjs <chemin.mp4> --title "..." [--description "..."] ' +
        "[--tags a,b] [--privacy private|unlisted|public]"
    );
    process.exit(1);
  }
  if (!title) {
    console.error("--title est obligatoire.");
    process.exit(1);
  }
  if (!["private", "unlisted", "public"].includes(privacy)) {
    console.error("--privacy doit être private, unlisted ou public.");
    process.exit(1);
  }

  const clientId = requireEnv("YOUTUBE_CLIENT_ID");
  const clientSecret = requireEnv("YOUTUBE_CLIENT_SECRET");
  const refreshToken = requireEnv("YOUTUBE_REFRESH_TOKEN");

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  console.log(`Upload de ${path.basename(filePath)} (privacy=${privacy})...`);

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: { title, description, tags, categoryId: category },
      status: { privacyStatus: privacy },
    },
    media: { body: fs.createReadStream(filePath) },
  });

  console.log("\n=== Upload réussi ===");
  console.log("Video ID :", res.data.id);
  console.log("URL      :", `https://youtu.be/${res.data.id}`);
  console.log(`Statut   : ${privacy} — visible uniquement par toi si "private".`);
}

main().catch((err) => {
  console.error("Échec de l'upload :", err.message ?? err);
  process.exit(1);
});
