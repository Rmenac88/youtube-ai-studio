# Checklist sécurité

- [ ] Aucune clé API, token OAuth ou secret dans le code committé — uniquement dans `.env` (local, ignoré par git) ou GitHub Secrets (CI/CD)
- [ ] `.gitignore` couvre `.env`, `node_modules/`, les sorties de rendu et les assets binaires lourds
- [ ] OAuth YouTube avec le scope le plus restreint possible (voir `.env.example`)
- [ ] Rotation régulière des clés API (calendrier à définir)
- [ ] Permissions MCP/Connecteurs : accepter le scope le plus restreint proposé par défaut
- [ ] Accès filesystem limité au répertoire de travail du sandbox / aux dossiers explicitement autorisés sur la machine locale
- [ ] Accès GitHub en lecture par défaut ; écriture seulement sur demande explicite
- [ ] Aucun secret dans les logs, même en debug
- [ ] Aucune donnée personnelle d'audience individuelle stockée (analytics agrégés uniquement)
- [ ] Principe du moindre privilège appliqué à chaque nouvelle intégration

Voir l'audit initial pour le détail par catégorie (API keys, secrets GitHub, permissions MCP, etc.).
