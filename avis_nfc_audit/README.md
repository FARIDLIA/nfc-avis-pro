# Avis NFC & QR Pro — Cloudflare 0 € / D1

Version 3.0 native **Cloudflare Workers + Static Assets + D1**. Aucun `db.json` n'est utilisé en production.

## Architecture
- React/Vite PWA servie en HTTPS par Cloudflare Workers Static Assets.
- API dans `worker/index.ts`.
- Données persistantes dans Cloudflare D1 : comptes, sessions, commerces, supports, scans et transactions.
- QR/NFC utilisent `/s/<support>?t=qr|nfc`, puis redirection vers l'URL Google réelle.
- Paiement désactivé (`0 €`) ; aucun service de paiement requis.

## Déploiement initial
1. Installer Node.js 20+ puis exécuter `npm install`.
2. Créer/ouvrir un compte Cloudflare et lancer `npx wrangler login`.
3. Créer la base : `npx wrangler d1 create avis-nfc-qr-pro`.
4. Copier le `database_id` retourné dans `wrangler.jsonc` à la place de `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
5. Initialiser la base : `npm run db:remote`.
6. Définir le secret admin : `npx wrangler secret put ADMIN_ACCESS_CODE`, puis saisir `171278`.
7. Déployer : `npm run deploy`.
8. Wrangler fournit une URL HTTPS `*.workers.dev`. Ouvrir cette URL sur Android/Chrome puis choisir **Installer l'application**.

## Développement local
Copier `.dev.vars.example` en `.dev.vars`, puis :
`npm run db:local`
`npm run dev`

## Google
Aucune API Google payante n'est nécessaire : en mode gratuit, le revendeur colle l'URL Google réelle. `GOOGLE_PLACES_API_KEY` reste facultative.

## Données
D1 remplace totalement le stockage JSON local. Un redéploiement de l'application ne supprime pas la base D1.
