---
version: 1
slug: "src-components-desk-tsx"
primary_target: "src/components/desk.tsx"
related_targets: ["src/components/landing.tsx","src/app/settings/page.tsx"]
---

# Surface: CocheCoche (app entière)

Mode visiteur : Operate (bureau, réglages, auth). La landing est Persuade dans le même monde.

Audience : indie public, un compte = un espace. Job : voir ce qui est dû, cocher, ranger par projet/client, laisser un agent écrire.

Contraintes : nom CocheCoche, français, logo or actuel, pas de priorités/labels/récurrence/équipes. Fonctions existantes conservées.

## Direction contract

THESIS: Le premier écran est Aujourd’hui — liste plate, coches rondes, une ligne rouge « Ajouter une tâche ». Pas de tickets perforés, pas de sidebar forêt, pas d’eyebrow.

OWN-WORLD: Champ papier blanc, rail gris très pâle à gauche, rouge Todoist (#DC4C3E) comme seule saturation d’interface, marque or isolée en identité, Public Sans unique, filets 1px, pastilles projet, cases à cocher circulaires.

STORY: J’ouvre, je vois le dû d’aujourd’hui (et le retard), je coche, j’ajoute, je change de vue (Boîte / À venir / projet).

FIRST VIEWPORT: Sidebar 280px — marque + nom, Boîte, Aujourd’hui (actif), À venir, « Mes projets » + pastilles et compteurs. Main — titre 24px « Aujourd’hui », sous-titre la date du jour, bouton rouge « + Ajouter une tâche », puis section En retard le cas échéant, puis les lignes (cercle 18px | titre | date verte « Auj. » | projet). Hover gris 4%. Pas de cartes.

FORM: Canon Todoist, brief-pinned. Seed 860cc029. Signature : la coche se remplit de rouge, pop 180ms, la ligne se barre.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
