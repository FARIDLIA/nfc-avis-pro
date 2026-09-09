# Finalisation 2.0

## Corrigé
- Authentification multi-utilisateur par session HTTP-only propre à chaque navigateur.
- Connexion revendeur par e-mail + mot de passe.
- Hash des mots de passe avec `scrypt` et sel aléatoire.
- Connexion SuperAdmin par code serveur, avec limitation des tentatives.
- Suppression du changement de profil global et du `currentUserId` partagé.
- Contrôles de propriété côté serveur pour commerces et supports.
- Suppression des faux établissements et données Google de démonstration dans la base initiale.
- Suppression du faux paiement CB et des coordonnées bancaires fictives.
- Mode gratuit activé par défaut (`FREE_MODE=true`) : aucune activation bloquée par des crédits.
- PWA avec manifeste et service worker.
- QR/NFC indépendants du studio graphique.
- En-têtes HTTP de sécurité de base.

## SuperAdmin
Code initial demandé : `171278`, lu côté serveur via `ADMIN_ACCESS_CODE`.
En production, configurez cette variable d'environnement sur l'hébergeur.

## Google
Sans clé Google Places, aucune donnée n'est inventée. Une vraie URL Google doit être fournie. La clé officielle reste facultative.

## Paiement
`PAYMENT_PROVIDER=none`. La facturation est désactivée actuellement. La couche crédits est conservée pour une future monétisation.

## Vérifications
- Validation syntaxique de tous les fichiers `.ts` et `.tsx` : OK.
- `npm install` n'a pas pu être terminé dans l'environnement d'audit à cause de l'accès réseau aux dépendances ; le build complet doit donc être exécuté après installation des dépendances sur la machine cible.

## Installation téléphone
La PWA doit être servie en HTTPS. Après déploiement, ouvrir l'adresse dans Chrome Android puis `Installer l'application`, ou Safari iPhone puis `Partager > Sur l'écran d'accueil`.
