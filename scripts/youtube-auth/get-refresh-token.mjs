// One-time local authorization for the YouTube Data API v3.
//
// Run this ONCE, on your own machine (not in a cloud sandbox): it opens
// your real browser to Google's consent screen, then starts a temporary
// localhost server to catch the redirect. That's not possible from a
// remote container, and this container's network is blocked from
// reaching googleapis.com anyway (verified in the audit).
//
// Usage:
//   npm install
//   npm run get-token -- /path/to/client_secret_XXXX.json
//
// If you don't pass a path, it looks for ./client_secret.json in this
// folder — rename your downloaded file there, or pass the path directly.

import { authenticate } from "@google-cloud/local-auth";
import path from "node:path";
import fs from "node:fs";

// Upload-only scope — deliberately not requesting broader "youtube" access
// (principle of least privilege, per the audit's security checklist).
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

const keyfilePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(process.cwd(), "client_secret.json");

if (!fs.existsSync(keyfilePath)) {
  console.error(`Fichier introuvable : ${keyfilePath}`);
  console.error(
    "Passe le chemin du JSON téléchargé depuis Google Cloud Console : " +
      "npm run get-token -- /chemin/vers/client_secret_XXXX.json"
  );
  process.exit(1);
}

const client = await authenticate({
  scopes: SCOPES,
  keyfilePath,
});

if (!client.credentials.refresh_token) {
  console.error(
    "Aucun refresh_token reçu — Google n'en renvoie pas toujours si un " +
      "consentement existait déjà pour cette app. Va sur " +
      "https://myaccount.google.com/permissions, retire l'accès à " +
      "l'app, puis relance ce script."
  );
  process.exit(1);
}

console.log("\n=== Autorisation réussie ===");
console.log("Client ID     :", client._clientId ?? "(voir ton client_secret.json)");
console.log("Refresh token :", client.credentials.refresh_token);
console.log(
  "\nStocke ce refresh_token comme secret GitHub YOUTUBE_REFRESH_TOKEN " +
    "(et YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET depuis le même JSON) — " +
    "jamais dans un fichier commité, jamais collé dans un chat."
);
