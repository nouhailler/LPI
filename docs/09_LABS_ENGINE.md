# 09 — Moteur de Labs & Terminal Virtuel (Labs Engine)

> Ce document détaille l'architecture et le fonctionnement du moteur de simulation de terminal Linux et d'inspection microscopique du système de fichiers virtuel de **LPI Certification Prep**, situé dans `src/services/virtualFs/`.

---

## 1. Vue d'Ensemble & Découplage

Pour permettre un entraînement pratique sans exiger de machine virtuelle lourde ni de serveur backend distant, le moteur de labs est découpé en deux briques logiques indépendantes :

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                    UI (TerminalView.tsx)                    │
  │     (Prompt interactif, coloration syntaxique ANSI, Tab)    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │               SHELL INTERPRETER (Bash 5.2)                  │
  │    (Lexer, variables, pipes |, redirections >, chaînes &&)  │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 VIRTUALFS (In-Memory POSIX)                 │
  │  (Inodes VfsNode, arborescence FHS, permissions, processus) │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │            VALIDATEUR DE SCÉNARIO D'ATELIER                 │
  │         (Inspection de l'état résultant du système)         │
  └─────────────────────────────────────────────────────────────┘
```

---

## 2. Le Système de Fichiers Virtuel (`VirtualFs`)

`VirtualFs.ts` maintient un graphe d'objets en mémoire modélisant fidèlement le standard **FHS (Filesystem Hierarchy Standard)** :

### Modèle de Données d'un Nœud (`VfsNode`) :
```typescript
export interface VfsNode {
  name: string;
  type: 'file' | 'directory' | 'symlink';
  mode: number;         // Notation octale Unix (ex: 0o755, 0o644, 0o750)
  owner: string;        // Utilisateur propriétaire (ex: 'student', 'root')
  group: string;        // Groupe propriétaire (ex: 'student', 'root', 'developers')
  size: number;         // Taille en octets
  mtime: Date;          // Date de dernière modification
  content?: string;     // Contenu textuel pour les fichiers réguliers
  children?: Record<string, VfsNode>; // Table des entrées pour les répertoires
  target?: string;      // Chemin cible pour les liens symboliques
}
```

### Conformité FHS Initiale :
Au démarrage, l'arborescence injectée dans `initialFs.ts` contient :
- `/home/student/` : espace personnel de travail avec scripts d'exemples et archives.
- `/etc/` : fichiers de configuration essentiels (`passwd`, `group`, `fstab`, `resolv.conf`, `hosts`, `sudoers`).
- `/var/log/` : journaux systèmes (`syslog`, `auth.log`, `nginx/access.log`).
- `/tmp/` : répertoire temporaire doté du sticky bit (`0o1777`).
- `/root/` : répertoire restreint avec mode `0o700`.

---

## 3. L'Interpréteur de Commandes (`ShellInterpreter`)

`ShellInterpreter.ts` implémente un analyseur lexical et un dispatch d'utilitaires Linux :

### Fonctionnalités Shell Supportées :
- **Variables d'environnement** : `$USER`, `$HOME`, `$PWD`, `$PATH`, variables personnalisées `EXPORT VAR=val`.
- **Redirections de flux** : écrasement standard `>` et concaténation `>>`.
- **Tuyaux (Pipes `|`)** : enchaînement de commandes (ex: `cat /var/log/syslog | grep error | wc -l`).
- **Opérateurs de contrôle** : exécution conditionnelle `&&` et séquençage `;`.
- **Navigation & Historique** : historique des commandes (touches Flèche Haut / Bas) et autocomplétion par touche **Tab**.

### Catalogue des Utilitaires Linux Implémentés :
- **Navigation & Arborescence** : `pwd`, `cd`, `ls` (avec `-l`, `-a`, `-h`, `-i`), `mkdir`, `rmdir`, `touch`, `cp`, `mv`, `rm`, `ln` (liens symboliques `-s` et durs).
- **Visualisation & Recherche** : `cat`, `head`, `tail`, `grep` (avec `-i`, `-v`, `-n`, `-c`, regex), `find` (par nom, type `f`/`d`, permissions octales `-perm`), `echo`, `which`.
- **Filtrage Avancé & Traitement de Flux** :
  - `sed` : éditeur de flux pour substitutions regex (`sed "s/foo/bar/g"`), suppressions (`sed "/motif/d"`) et sélection de lignes (`-n "1,5p"`).
  - `awk` : traitement textuel colonne par colonne (`$1, $2...`), conditions logiques (`$4 == "active"`), délimiteurs configurables via `-F` (`awk -F: '{print $1, $7}' /etc/passwd`).
  - `cut` : découpage par délimiteur (`-d:`, `-d,`) et sélection de champs (`-f1`, `-f1,3`) ou de caractères (`-c1-10`).
  - `sort` : tri alphabétique et numérique (`-n`), inverse (`-r`), déduplication (`-u`), tri par clé (`-k2`).
  - `uniq` : détection et comptage de lignes consécutives répétées (`-c`), lignes uniques (`-u`), doublons (`-d`).
  - `wc` : comptage de lignes (`-l`), de mots (`-w`), d'octets (`-c`) et de caractères (`-m`).
  - `tee` : duplication de flux vers la sortie standard et des fichiers simultanés (`-a` pour mode ajout).
- **Gestionnaire de Services & Journaux Systemd (`ServicesManager`)** :
  - `systemctl` : pilotage du cycle de vie des unités de services (`status`, `start`, `stop`, `restart`, `enable`, `disable`, `is-active`, `list-units`). Modélisation fidèle des unités critiques (`nginx.service`, `ssh.service`, `cron.service`, `rsyslog.service`) avec PID virtuel, temps de démarrage et logs récents.
  - `journalctl` : consultation du journal système structuré avec filtrage par unité (`-u nginx`), nombre de lignes (`-n 15`), ordre chronologique inversé (`-r`), niveau de priorité (`-p err`, `-p warning`) et saut en fin de journal (`-xe`, `-e`).
- **Simulation Réseau & Routage (`NetworkSimulator`)** :
  - `ip addr` : affichage des interfaces boucle locale (`lo`) et Ethernet (`eth0`), adresses IPv4/IPv6 CIDR (`192.168.1.50/24`), adresses MAC réelles et états (`UP`, `LOWER_UP`).
  - `ip route` : consultation de la passerelle par défaut (`default via 192.168.1.1 dev eth0`) et des routes directes de sous-réseau.
  - `ping` : émission de requêtes ICMP ECHO_REQUEST avec limitation de paquets (`-c 3`), calcul de latence RTT réaliste (min/avg/max/mdev), gestion des cibles joignables (passerelle locale, DNS public `8.8.8.8`) et des hôtes injoignables avec timeout.
- **Stockage, Partitions & Points de Montage (`StorageSimulator`)** :
  - `mount` : rattachement de systèmes de fichiers sur un point de montage (`mount /dev/sdc1 /mnt`), options (`-o rw,ro,noatime`), types (`-t ext4,vfat`), et exécution automatique de `/etc/fstab` avec `mount -a`.
  - `umount` : libération et démontage propre de points de montage ou périphériques blocs (`umount /mnt/backup`).
  - `/etc/fstab` : fichier statique de description des systèmes de fichiers permanents (`<device> <mountpoint> <type> <options> <dump> <pass>`), supportant les montages automatiques `mount -a` et la persistance.
  - `fdisk` : inspection détaillée des tables de partitions MBR/GPT (`sudo fdisk -l /dev/sda`, `sudo fdisk -l /dev/sdc`) avec modélisation des cylindres, secteurs, tailles et identifiants de disques (GUID).
  - `lsblk` : visualisation arborescente des périphériques de blocs avec métadonnées (`lsblk -f`) incluant `NAME`, `FSTYPE`, `LABEL`, `UUID`, `FSAVAIL`, `FSUSE%` et `MOUNTPOINT`.
- **Droits & Propriétaires** : `chmod` (notation octale `750`, `644`, `700` et symbolique `u+x`, `g-w`), `chown` (utilisateur et groupe `student:developers`), `chgrp`, `umask`.
- **Archivage & Compression** : `tar` (création `-czvf`, extraction `-xvf`, listage `-tvf`).
- **Gestion des Processus & Ressources** : `ps` (`aux`, `-ef`), `kill` (SIGTERM, SIGKILL `-9`), `uptime`, `free` (`-m`), `df` (`-h`), `uname` (`-a`, `-r`).
- **Environnement & Identité** : `export`, `env`, `which`, `whoami`, `id`, `date`, `sudo`.
- **Aide Intégrée & Documentation** :
  - `help` : catalogue complet de toutes les commandes disponibles classées par catégorie.
  - `help <commande>` ou `<commande> --help` : affichage synthétique et contextuel des arguments, options et exemples de la commande ciblée.
  - `man <commande>` : pages de manuel UNIX complètes (NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES) pour tous les utilitaires du catalogue.

---

## 4. Validation Microscopique des Scénarios de Lab

Contrairement aux plateformes d'apprentissage qui comparent bêtement la chaîne de commande saisie par l'utilisateur à une expression régulière rigide, le moteur de lab évalue **l'état du système de fichiers après exécution**.

### Scénarios Déployés dans le Moteur (`simulatedLabScenarios`) :

1. **`lab-chmod-backup`** : Permissions d'exécution pour `backup.sh` (octal `750`, `rwxr-x---`).
2. **`lab-grep-auth`** : Analyse forensique et extraction d'échecs d'authentification (`grep "Failed password" /var/log/auth.log > /tmp/failed_attempts.txt`).
3. **`lab-tar-archive`** : Création d'archive tarball compressée gzip (`tar -czvf /tmp/projects_backup.tar.gz /home/student/projects`).
4. **`lab-chown-ownership`** : Changement d'appartenance utilisateur et groupe sur l'application web (`sudo chown -R student:developers /home/student/projects/webapp`).
5. **`lab-symlink-creation`** : Création de liens symboliques relatifs et absolus (`ln -s /etc/nginx/nginx.conf /home/student/scripts/nginx_symlink.conf`).
6. **`lab-kill-process`** : Interruption d'un processus zombie ou rebelle consommant des ressources (`kill -9 <PID>`).
7. **`lab-find-and-clean`** : Recherche multicritères de fichiers volumineux et nettoyage temporaire (`find /tmp -type f -name "*.tmp"`).
8. **`lab-security-shadow`** : Verrouillage strict du fichier sensible des empreintes de mots de passe (`sudo chmod 600 /etc/shadow`).
9. **`lab-text-filter-pipeline`** : Pipeline d'extraction et de tri alphabétique des comptes (`cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt`).
10. **`lab-systemd-service`** : Supervision de service et diagnostic par les journaux (`systemctl status nginx`, `journalctl -u nginx`).
11. **`lab-network-ping-diag`** : Diagnostic d'interfaces et test ICMP de passerelle (`ip addr show eth0`, `ip route`, `ping -c 3 192.168.1.1`).
12. **`lab-storage-mount-disk`** : Inspection et montage immédiat d'un système de fichiers (`lsblk -f`, `sudo mount /dev/sdc1 /mnt`).
13. **`lab-fstab-mount-umount`** : Persistance `/etc/fstab`, démontage et partitionnement (`sudo fdisk -l`, déclaration dans `/etc/fstab`, `sudo mount -a`, `sudo umount /mnt/backup`).
14. **`lab-text-filter-sed-awk`** : Filtrage et transformation de flux avancés (`sed "s/staging/preprod/g"`, `awk '$4 == "active"'`, `wc -l`).

---

### Exemple de Scénario (`SimulatedLabScenario`) :
*« Restreindre l'accès au script `/home/student/backup.sh` pour que seul le propriétaire puisse le modifier, et le groupe `developers` puisse l'exécuter. »*

```typescript
validate: (fs: VirtualFs) => {
  const node = fs.resolveNode('/home/student/backup.sh');
  const unmet: string[] = [];

  if (!node) {
    return { isComplete: false, score: 0, unmetCriteriaFr: ['Le fichier backup.sh n\'existe pas.'] };
  }

  // Vérification de la propriété
  if (node.owner !== 'student') unmet.push('Le propriétaire doit être student.');
  if (node.group !== 'developers') unmet.push('Le groupe doit être developers.');

  // Vérification des bits de permission (0o750)
  const modeOctal = (node.mode & 0o777).toString(8);
  if (modeOctal !== '750') {
    unmet.push(`Les permissions actuelles sont ${modeOctal}, 750 (rwxr-x---) attendu.`);
  }

  const isComplete = unmet.length === 0;
  return {
    isComplete,
    score: isComplete ? 100 : Math.max(0, 100 - unmet.length * 35),
    feedbackFr: isComplete ? 'Bravo ! Le script est parfaitement sécurisé.' : 'Configuration incomplète.',
    unmetCriteriaFr: unmet
  };
}
```

### Avantages Majeurs :
- L'élève peut saisir `chmod 750 backup.sh`, ou `chmod u=rwx,g=rx,o= backup.sh`, ou passer par plusieurs commandes successives : le résultat validé est **rigoureusement le même**.
- Tolérance aux chemins relatifs et absolus.

---

## 5. Matrice d'Évolution Technologique des Labs

| Niveau | Nom | Technologie | Dépendances Réseau | Périmètre d'Exécution |
| :---: | :---: | :---: | :---: | :---: |
| **V1 (Actuel)** | **Virtual Linux** | Pur TypeScript in-memory | **0% (100% Offline PWA)** | Arborescence FHS, permissions, processus, sed, pipes, scripts. |
| **V2 (Planifié)** | **Wasm Linux** | WebAssembly / v86 / WebContainers | 1er chargement puis cache local | Véritable noyau Linux émulé dans le navigateur. |
| **V3 (Desktop)** | **Docker / Podman** | Conteneurs natifs Linux | Daemon local | Labs de niveau LPIC-2 & LPIC-3 complets (systemd, kernel, samba). |
