# ADR-006 : Stratégie d'Application Desktop & Conteneurs Natifs (Horizon V3)

## Statut
**Accepté (Roadmap Horizon V3)**

## Contexte
Le moteur de terminal virtuel in-memory (`VirtualFs`) couvre avec succès 100% des besoins des examens Linux Essentials et LPIC-1 (arborescence FHS, permissions Unix, utilitaires GNU, archivage `tar`, traitement de texte, redirections).
En revanche, les certifications avancées **LPIC-2** (Ingénieur Linux) et **LPIC-3** (Entreprise) exigent des manipulations plus profondes du système :
- Compilation et chargement de modules noyau (`modprobe`, `/proc/sys`).
- Vrai démon `systemd` avec gestion des cgroups et targets d'init.
- Partage de fichiers Samba/NFS et domaines Active Directory réels.
- Haute disponibilité, clustering corosync/pacemaker et virtualisation KVM.
Ces fonctionnalités ne peuvent pas être émulées de façon crédible dans un simple interpréteur JavaScript in-memory dans le navigateur.

## Décision
1. **Poursuivre la V1 & V2 en Web / PWA** : Le cœur de l'application reste un navigateur ou une PWA installée pour garantir une accessibilité universelle et immédiate.
2. **Concevoir l'Horizon V3 comme un Wrapper Desktop Léger (Tauri / Rust)** :
   - Packager l'application web existante dans un binaire natif multiplateforme (Linux, macOS, Windows).
   - Utiliser l'API système de Tauri pour se connecter au démon de conteneurisation local de l'utilisateur (**Docker** ou **Podman**).
3. **Exécution des Labs LPIC-2/3 dans des Micro-Conteneurs Jetables** :
   - L'application Desktop démarre automatiquement des conteneurs Linux éphémères en tâche de fond pour chaque lab complexe.
   - Les commandes du terminal sont transmises directement au conteneur via un pseudo-terminal (PTY) local.
   - La validation est effectuée en exécutant des scripts de vérification à l'intérieur du conteneur.

## Conséquences
### Positives :
- **Authenticité 100% Linux** : vrai noyau, vrai systemd, vrai réseau pour les certifications professionnelles d'ingénierie.
- **Sécurité et Isolation** : les manipulations destructives (ex: formater un disque, recompiler le noyau) se déroulent dans un conteneur jetable sans aucun danger pour la machine hôte.
- **Réutilisation de la base de code** : l'interface React, le moteur SRS et le Weakness Engine restent strictement identiques entre la version Web et la version Desktop.

### Limitations :
- Nécessite l'installation locale préalable de Docker ou Podman par l'utilisateur pour les labs de niveau LPIC-2/3.
