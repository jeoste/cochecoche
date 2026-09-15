# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Public indie : alternative open-source à TickTick / Todoist. Chaque personne crée un compte Clerk et travaille dans son propre espace Neon. Pas d’équipes ni de partage entre comptes.

## Product Purpose

CocheCoche est une liste de tâches personnelle. On coche, on date, on range par projet (et client optionnel). Un agent (Cursor, Granola, etc.) peut aussi écrire des tâches via une clé API propre au compte.

Succès : ouvrir l’app, voir ce qui est dû, cocher, et laisser un agent alimenter la liste sans mélanger les espaces.

## Positioning

Un workspace isolé par compte Clerk, plus une clé agent (`cch_…`) qui n’écrit que dans cet espace. Les listes concurrentes n’offrent pas cette ingestion agent-first par utilisateur.

## Operating Context

Usage quotidien sur le web. Saisie manuelle (ajout rapide) et ingestion depuis des réunions (Granola) ou un agent. Terminologie : tâches, projets, clients, clés agent, Aujourd’hui / En retard / Cette semaine. UI en français.

## Capabilities and Constraints

Confirmé : cocher / décocher ; dates d’échéance ; projets avec couleur et client optionnel ; archive de projet ; notes ; source Granola ; clés API (créer, révoquer, affichage unique) ; `POST /api/v1/ingest` et CRUD tâches/projets. Auth Clerk. Pas de partage, pas d’orgs.

Non demandé comme nouvelles fonctions : priorités Todoist, labels, récurrence, karma, équipes. La refonte visuelle mappe l’existant (boîtes de dates, inbox, projets) dans une grammaire type Todoist, sans inventer ces capacités.

## Brand Commitments

- Nom : CocheCoche.
- UI en français.
- Marque graphique : carré rouge `#DC4C3E`, coche blanche (alignée sur l’UI).
- Référence visuelle binding : Todoist (écrans iOS Mobbin fournis). Exécuter cette convention à fidélité pleine. TickTick reste le voisin nommé dans le positionnement produit, pas la barre craft.
- Open source.

## Evidence on Hand

App réelle (landing, bureau, réglages, auth Clerk). Pas de témoignages, clients, tarifs ni captures marketing à fabriquer. Données de démo dans l’UI doivent rester clairement des tâches de l’utilisateur connecté.

## Product Principles

1. Un compte, un espace — jamais de fuite entre utilisateurs.
2. Cocher reste l’action première ; le reste sert cette boucle.
3. L’agent écrit comme un humain : mêmes projets, mêmes dates, même liste.
4. Vocabulaire français, concret (projet, client, clé), sans jargon d’équipe.
5. Ne pas prétendre des fonctions que le produit n’a pas.

## Accessibility & Inclusion

Aucune exigence produit-spécifique enregistrée au-delà des pratiques web raisonnables (contraste, focus, labels).
