# youtube-ai-studio

Infrastructure de production vidéo YouTube assistée par IA, orchestrée par Claude.

## Statut

**V0 — Foundation.** Structure de dépôt posée + projet Remotion minimal data-driven qui rend une vidéo de démonstration. Rien n'est encore automatisé (voir la roadmap).

## Principe

Une vidéo est décrite par des données (`data/projects/<slug>/scenes.json`), et Remotion transforme ces données en vidéo. Le code des scènes (`video/remotion/src/`) ne change jamais pour une vidéo particulière — seul le JSON change.

Pipeline cible : `IDÉE → RECHERCHE → SCRIPT → FACT-CHECK → STORYBOARD → ASSETS → VOIX → REMOTION → FFMPEG → SOUS-TITRES → THUMBNAIL → SEO → QC → PUBLICATION → ANALYTICS`.

## Structure

```
video/remotion/     Projet Remotion (compositions, scènes, rendu)
video/render/        Sorties .mp4 (non versionnées, régénérables)
ai/                  Prompts, recherche, fact-check par projet
data/projects/       La vérité data-driven : un dossier par vidéo
assets/              Images, audio, musique, fonts (binaires lourds non versionnés)
scripts/             Scripts CLI du pipeline
docs/                Documentation
tests/               Tests
.github/workflows/   CI/CD
```

## Démarrer

```bash
cd video/remotion
npm install
npm run preview   # ouvre Remotion Studio (aperçu interactif)
npm run render    # rend video/render/demo.mp4
```

## Sécurité

Aucun secret n'est commité. Copier `.env.example` en `.env` (ignoré par git) pour le développement local ; utiliser les GitHub Secrets pour la CI/CD. Voir `docs/` pour la checklist de sécurité complète.
