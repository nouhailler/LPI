# ADR-003 : Contrats de Persistance Locale & Isolation des Clés

## Statut
**Accepté**

## Contexte
L'application fonctionne en mode 100% hors-ligne et conserve la totalité des données d'apprentissage (répétition espacée SRS, rapport d'évaluation des faiblesses, historique d'examens chronométrés, paramètres d'interface et préférences de mise à jour) dans le stockage local du navigateur (`localStorage`).
Sans discipline stricte, l'utilisation de `localStorage` peut générer des collisions de noms avec d'autres applications du même domaine d'origine, des corruptions silencieuses lors des montées de version, et des crashs en mode navigation privée ou lors de dépassements de quota.

## Décision
1. **Namespace Unifié** :
   Toutes les clés de persistance sont impérativement préfixées par `lpi_` et suffixées par leur version de schéma majeure (ex: `lpi_srs_records_v1`, `lpi_weakness_engine_data_v2`).
2. **Encapsulation Défensive Systématique** :
   Aucun composant ou service ne doit appeler directement `localStorage` sans bloc `try / catch` et valeur de repli déterministe en mémoire.
3. **Migration Automatique au Démarrage** :
   Les anciens formats non versionnés (ex: `lpic1_mastered_cards`) sont détectés à l'initialisation, convertis dans le nouveau schéma `lpi_srs_records_v1`, puis nettoyés.
4. **Export/Import JSON Universel** :
   Permettre à l'apprenant de sauvegarder et d'importer son profil complet sous forme de fichier JSON unique (`LPIProfileBackupV1`), facilitant le transfert d'un ordinateur vers un smartphone sans serveur intermédiaire.

## Conséquences
### Positives :
- Résilience absolue en cas de quota plein ou de navigation privée restreinte.
- Traçabilité et compatibilité ascendante des structures de données.
- Indépendance totale vis-à-vis d'un compte cloud ou d'une base de données distante.

### Limitations :
- La taille globale est bornée au quota du navigateur (environ 5 Mo à 10 Mo selon les moteurs). Le volume actuel de l'application reste inférieur à 500 Ko après des mois d'usage intensif.
