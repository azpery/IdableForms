# IdableForm

Questionnaires appliqués à l'étude des comportements et de la psychosociologie : une question par écran pour les participants, un éditeur et un export CSV pour les administrateurs.

Angular 22 (composants standalone, signals, zoneless) et Tailwind CSS 4. L'API est dans le dépôt [IdableFormsServer](../IdableFormsServer).

## Démarrage

Prérequis : Node.js 24 (`nvm use`) et l'API lancée sur `http://localhost:8100` (voir le README du serveur).

```sh
npm install
npm start       # http://localhost:4200
```

## Pages

| Route                | Rôle                                         |
| -------------------- | -------------------------------------------- |
| `/`                  | Liste des questionnaires                     |
| `/form/:id`          | Répondre à un questionnaire                  |
| `/thankyou`          | Remerciements après l'envoi                  |
| `/admin/login`       | Connexion à l'administration (mot de passe `ADMIN_PASSWORD` du serveur) |
| `/admin/forms`       | Administration : liste, export CSV, suppression |
| `/admin/forms/:id/results` | Résultats d'un formulaire : participations par jour et graphique par question |
| `/createNewForm`     | Créer un formulaire                          |
| `/form/edit/:id`     | Modifier un formulaire                       |

Les pages d'administration (`/admin/forms…`, `/createNewForm`, `/form/edit/:id`) demandent le mot de passe.

## Build

```sh
npm run build   # dist/idables-forms, utilise src/environments/environment.prod.ts
```

## Déploiement (alwaysdata)

Le site sert `~/IdableFormsFront/dist/idables-forms/browser`, un clone de ce dépôt compilé sur le serveur (la règle de réécriture `public/.htaccess` est incluse dans le build) :

```sh
ssh rdelaporte@ssh-rdelaporte.alwaysdata.net \
  'cd ~/IdableFormsFront && git pull --ff-only && export PATH=/usr/alwaysdata/nodejs/24.21.0/bin:$PATH && npm ci && npx ng build'
```
