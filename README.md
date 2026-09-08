# NFC Avis Pro

Application web progressive (PWA) open source pour programmer des cartes NTAG213, NTAG215 et NTAG216 avec une URL d’avis Google.

## Utilisation

1. Ouvrir l’application en HTTPS dans Chrome sur un téléphone Android équipé du NFC.
2. Activer le NFC dans les réglages du téléphone.
3. Saisir le nom du commerce et son lien « Demander des avis » Google Business Profile.
4. Appuyer sur **Programmer la carte**, puis maintenir la puce contre le dos du téléphone.
5. Utiliser l’onglet **Contrôler** pour relire la carte avant livraison.

Les données commerciales restent dans le stockage local du téléphone. La fonction Exporter permet de produire une sauvegarde JSON.

## Déploiement GitHub Pages

Le contenu du dossier `dist/` est entièrement statique. Le workflow `.github/workflows/deploy-pages.yml` publie automatiquement chaque mise à jour de la branche `main`. Après création du dépôt, activer **Settings → Pages → Source: GitHub Actions**.

Le projet peut également être publié sur Cloudflare Pages, Netlify ou tout hébergeur HTTPS. Web NFC nécessite Chrome Android, une page HTTPS et une puce compatible NDEF.

## Licence

MIT — voir `LICENSE`.
