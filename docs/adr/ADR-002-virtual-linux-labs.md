# ADR-002 : Virtual Linux Labs via Filesystem Virtuel In-Memory

## Statut
**Accepté**

## Contexte
Les examens de certification LPI (LPIC-1, LPIC-2, LPIC-3) testent des compétences d'administration système réelles : manipulation d'arborescences, configuration de permissions (`chmod`, `chown`, `umask`), archivage (`tar`), extraction de logs (`grep`, `find`) et gestion de processus (`ps`, `kill`).
La plupart des outils concurrents se contentent de QCM passifs ou de champs textuels simples comparant la chaîne de commande à une réponse type.
Nous souhaitions permettre à l'utilisateur de pratiquer de vraies commandes Linux dans un environnement réactif sans exiger un serveur backend avec conteneurs Docker (trop lourd, coûteux et incompatible avec le mode 100% offline).

## Décision
Concevoir un moteur de simulation Linux autonome en pur JavaScript/TypeScript (`/src/services/virtualFs`) comprenant :
1. **Un système de fichiers virtuel (`VirtualFs`)** :
   - Structure arborescente d'inodes (`VfsNode`) en mémoire respectant le standard FHS (`/home/student`, `/etc`, `/var/log`, `/tmp`, `/root`).
   - Gestion des métadonnées Unix : modes octaux (`0o750`, `0o644`), droits textuels (`-rwxr-x---`), propriétaires et groupes (`student:developers`, `root:shadow`), timestamps et tailles.
2. **Un interpréteur de shell (`ShellInterpreter`)** :
   - Émulation de Bash 5.2 (builtins, redirections `>` et `>>`, pipes `|`, enchaînements `&&` et `;`).
   - Implémentation des utilitaires fondamentaux : `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `chmod`, `chown`, `tar`, `ps`, `kill`, `df`, `free`, `uptime`, `whoami`, etc.
3. **Une validation basée sur l'état microscopique du système** :
   - Les scénarios de lab évaluent non pas une saisie textuelle figée, mais **l'état résultant de l'arborescence** (ex: *« Le fichier backup.sh possède-t-il les bits 0o750 et l'utilisateur student en propriétaire ? »*).

## Conséquences
### Positives :
- **100 % PWA & Offline** : fonctionne instantanément sur n'importe quel navigateur, y compris sur mobile ou en vol, sans aucun backend.
- **Sécurité totale** : aucun risque pour la machine hôte ; le filesystem virtuel est encapsulé dans la mémoire de l'application.
- **Flexibilité pédagogique** : un utilisateur peut utiliser `chmod 750 file` ou `chmod u=rwx,g=rx,o= file` ou `chmod +x file`, la validation inspecte l'inode finale.
- **Feedback visuel temps réel** : l'explorateur visuel permet de voir l'arborescence et les droits changer instantanément à chaque commande.

### Limitations :
- Ce n'est pas un vrai noyau Linux (pas de modules noyau, pas de mémoire partagée IPC complexe).
- Impossible de simuler les vrais daemons `systemd` ou des sockets réseau réelles.

### Perspectives Futures (Roadmap) :
- **Niveau V2** : Prise en charge de WebAssembly (émulation v86 ou WebContainers) pour exécuter un micro-kernel Linux dans le navigateur si les ressources le permettent.
- **Niveau V3** : Pour une future version Desktop (Tauri/Electron), intégration d'un démon Docker/Podman local pour des labs avancés de niveau LPIC-2/3.
