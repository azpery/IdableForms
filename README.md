# IdableForms

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
| `/admin/forms`       | Administration : liste, export CSV, suppression |
| `/createNewForm`     | Créer un formulaire                          |
| `/form/edit/:id`     | Modifier un formulaire                       |

## Build

```sh
npm run build   # dist/idables-forms, utilise src/environments/environment.prod.ts
```
