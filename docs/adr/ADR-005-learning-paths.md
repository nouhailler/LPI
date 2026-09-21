# ADR-005 : Parcours Thématiques Métiers vs Révision Linéaire

## Statut
**Accepté**

## Contexte
Le référentiel officiel du Linux Professional Institute découpe les certifications en Topics et Sous-objectifs numérotés (ex: Topic 101, 102... jusqu'à 110 pour le LPIC-1). Si cette taxonomie est idéale pour vérifier qu'un candidat a couvert 100% de la liste d'objectifs avant son examen, elle présente une limite pédagogique majeure : les compétences sont atomisées et déconnectées du travail réel d'un administrateur système.
Par exemple, la gestion du réseau implique de manipuler des fichiers dans `/etc`, d'utiliser des commandes de diagnostic, de configurer un pare-feu et de gérer des permissions — des notions réparties sur quatre topics différents.

## Décision
1. **Conserver le Mode Référence LPI** : Permettre à l'apprenant de réviser de façon académique chaque topic officiel du cursus (LPIC-1, LPIC-2, LPIC-3).
2. **Introduire des Parcours Thématiques Transverses (`ThematicPath`)** :
   - Regrouper les concepts par profil et rôle métier :
     - *Devenir Administrateur Linux* (`admin`) : gestion autonome de serveurs en production.
     - *Automatisation & Scripting Shell* (`bash`) : scripts d'exploitation, boucles, regex, crontab.
     - *Réseau Linux & Services* (`networking`) : résolution DNS, routage, SSH, sécurité réseau.
   - Structurer chaque étape autour d'une mise en situation opérationnelle :
     - Le concept et sa justification en production (`whyItMatters`).
     - Les pièges classiques en entreprise (`prodTraps`).
     - Une checklist d'auto-évaluation concrète.
     - Un projet fil rouge intégrateur (*Capstone Project*).

## Conséquences
### Positives :
- Donne du sens et de la motivation aux candidats en reliant la théorie d'examen à des gestes d'administration réels.
- Répond aux besoins des apprenants qui ne visent pas forcément la certification dans l'immédiat mais cherchent une montée en compétences pratique.

### Limitations :
- Nécessite de maintenir la synchronisation entre les étapes des parcours thématiques et les mises à jour des versions d'examen LPI (ex: passage de la version 5.0 à une révision ultérieure).
