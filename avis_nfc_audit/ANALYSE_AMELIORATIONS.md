# Audit Avis NFC & QR Pro — version 1.1

## Corrections intégrées
- QR Code et programmation NFC restent totalement indépendants du studio visuel.
- Ajout d'un vrai service worker PWA pour le cache de l'interface et l'installation.
- Le code SuperAdmin est validé côté serveur et n'est plus comparé en clair dans l'interface navigateur.
- Le secret admin est configurable par `ADMIN_ACCESS_CODE` dans l'environnement.
- Suppression des faux Place ID, fausses notes et faux volumes d'avis en mode sans Google Places API.
- En mode 0 €, l'application exige désormais une URL Google réelle avant activation afin de ne jamais programmer un NFC/QR vers une fiche fictive.
- Intégration facultative de Google Places API officielle si `GOOGLE_PLACES_API_KEY` est renseignée.
- Renforcement des contrôles d'accès sur commerces, supports et programmation NFC.
- L'infrastructure de crédits/paiements reste découplée : fonctionnement gratuit possible aujourd'hui, branchement d'un prestataire de paiement ultérieurement sans modifier les supports NFC/QR.

## Point bloquant avant une vraie mise en production publique
L'authentification actuelle reste une architecture de démonstration : le serveur conserve `currentUserId` dans le fichier JSON commun. Cela signifie qu'une instance publique avec plusieurs utilisateurs simultanés n'a pas encore de sessions individuelles fiables, ni de mot de passe revendeur/commerçant. Il faut remplacer ce mécanisme par de vraies sessions par navigateur et un stockage de mots de passe hachés ou une authentification par lien magique/OAuth.

Le fichier `data/db.json` convient au prototype/local mais pas à une plateforme multi-utilisateurs concurrente. Pour la production, migrer les utilisateurs/commerces/supports/transactions vers Cloudflare D1, PostgreSQL ou SQLite avec accès transactionnel.

## Vérification de compilation
L'archive ne contient pas `node_modules`. Une tentative de récupération des dépendances par `npm install` a expiré dans l'environnement d'audit ; le build complet n'a donc pas pu être certifié ici. Après extraction sur une machine avec accès npm :

```bash
npm install
npm run lint
npm run build
npm start
```
