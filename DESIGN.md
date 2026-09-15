---
name: CocheCoche
description: Liste de tâches open-source, grammaire Todoist, marque or.
colors:
  primary: "#DC4C3E"
  primary-foreground: "#FFFFFF"
  due-today: "#058527"
  paper: "#FFFFFF"
  sidebar: "#FAFAFA"
  ink: "#202020"
  muted: "#5C5C5C"
  line: "#EEEEEE"
  hover: "#F5F5F5"
  mark: "#DC4C3E"
  mark-check: "#FFFFFF"
  pine: "#299438"
  copper: "#FF9933"
  brass: "#FAD000"
  moss: "#14AAF5"
  slate: "#4073FF"
  wine: "#AF38EB"
typography:
  display:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  sidebar: "280px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "#c44134"
    textColor: "{colors.primary-foreground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  task-check:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    size: "18px"
  nav-item-active:
    backgroundColor: "#ECECEC"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "32px"
---

# Design System: CocheCoche

## Overview

**Creative North Star: "La liste d'aujourd'hui"**

CocheCoche s'habille comme une liste Todoist : papier blanc, rail gris pâle, rouge unique pour l'action et le logo. La densité est celle d'un outil quotidien, pas d'une landing marketing. Pas de tickets perforés, pas de forêt sombre, pas d'eyebrow.

**Key Characteristics:**
- Un seul accent saturé (rouge #DC4C3E)
- Cases à cocher circulaires 18px
- Listes plates à filets 1px, jamais de cartes-tâches
- Public Sans pour tout
- Sidebar 280px, Aujourd'hui comme vue par défaut

## Colors

Palette restreinte : neutres + un rouge d'action + un vert de date.

### Primary
- **Todoist Red** (#DC4C3E): CTA, coche remplie, dates en retard, « Ajouter une tâche ».

### Secondary
- **Today Green** (#058527): dates « Auj. » et « Dem. » dans les lignes.

### Neutral
- **Paper** (#FFFFFF): champ principal.
- **Sidebar Mist** (#FAFAFA): rail de navigation.
- **Ink** (#202020): texte.
- **Quiet** (#5C5C5C): secondaire.
- **Hairline** (#EEEEEE): filets.
- **Mark** (#DC4C3E + coche #FFFFFF): même rouge que l’UI.

### Named Rules
**The One Red Rule.** Le rouge ne décore pas. Il coche, il ajoute, il signale le retard.

## Typography

**Display Font:** Public Sans  
**Body Font:** Public Sans  

**Character:** grotesque produit, un peu condensée, aucun display serif.

### Hierarchy
- **Display** (700, 2rem / 3rem desktop): landing h1.
- **Headline** (700, 1.5rem): titres de vue (Aujourd'hui).
- **Title** (700, 14px): en-têtes de section (En retard).
- **Body** (400, 14px): titres de tâches.
- **Label** (500, 13px): nav sidebar.

### Named Rules
**The One Face Rule.** Pas de Syne, pas de mono costume. Le mono reste pour les préfixes de clé API.

## Layout

Desktop : sidebar 280px + main. Mobile : colonne unique, tab bar 4 postes (Boîte, Aujourd'hui, À venir, Parcourir). Landing : deux colonnes dès `lg`, copie à gauche, preview produit à droite. Rythme serré dans la liste (py 10px), généreux autour des titres de vue.

## Elevation & Depth

Plat par défaut. Une ombre large et douce uniquement sur le cadre preview de la landing (`0 12px 40px rgba(32,32,32,0.08)`). Ailleurs : filet 1px ou fond tonal (sidebar, hover `#F5F5F5`).

## Shapes

Rayon 8px pour boutons, champs, composer. Pastilles projet et coches : cercle plein. Pas de tickets découpés.

## Components

### Buttons
- **Shape:** 8px
- **Primary:** rouge, texte blanc, hover assombri
- **Ghost:** transparent, hover `#F5F5F5`
- **Add task:** texte rouge + cercle 18px, pas un bouton plein

### Task check
- Cercle 18px, bord `#B8B8B8`, hover rouge léger, checked rouge plein, pop 180ms

### Task row
- Filet bas, hover gris 4%, date colorée, pastille projet, actions au hover

### Sidebar nav
- Ligne 32px, icône 16px, compteur à droite, actif `#ECECEC`

### Inputs
- Bord `#DDDDDD`, focus anneau rouge / 30%

## Do's and Don'ts

**Do:**
- Garder Aujourd'hui comme ouverture connectée
- Colorer les dates (rouge / vert) plutôt que des badges
- Garder le logo au rouge primaire, coche blanche

**Don't:**
- Recréer les tickets perforés
- Forcer le dark pine
- Ajouter un eyebrow au-dessus d'un titre
- Inventer priorités, labels ou karma
