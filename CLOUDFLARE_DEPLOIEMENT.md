# Mise en ligne rapide

La seule configuration manuelle obligatoire est la création de la base D1 dans **votre** compte Cloudflare : elle produit un identifiant unique que personne ne peut préremplir à l'avance.

Commandes :

```bash
npm install
npx wrangler login
npx wrangler d1 create avis-nfc-qr-pro
# copier database_id dans wrangler.jsonc
npm run db:remote
npx wrangler secret put ADMIN_ACCESS_CODE
# saisir 171278
npm run deploy
```

Après le déploiement, l'URL `https://...workers.dev` est déjà HTTPS et installable comme PWA.
