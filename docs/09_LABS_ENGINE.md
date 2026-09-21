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
- **Navigation & Arborescence** : `pwd`, `cd`, `ls` (avec `-l`, `-a`, `-h`, `-i`), `mkdir`, `rmdir`, `touch`, `cp`, `mv`, `rm`.
- **Visualisation & Recherche** : `cat`, `head`, `tail`, `grep` (avec `-i`, `-v`, `-n`, `-c`), `find` (par nom ou type), `wc`.
- **Droits & Propriétaires** : `chmod` (notation octale `755` et symbolique `u+x`), `chown`, `chgrp`, `umask`.
- **Archivage & Compression** : `tar` (création `-cvf`, extraction `-xvf`, listage `-tvf`).
- **Gestion des Processus** : `ps` (avec `aux`, `-ef`), `kill`, `killall`, `top`, `uptime`, `free`, `df`.
- **Informations Système** : `uname`, `whoami`, `id`, `groups`, `date`, `hostname`.

---

## 4. Validation Microscopique des Scénarios de Lab

Contrairement aux plateformes d'apprentissage qui comparent bêtement la chaîne de commande saisie par l'utilisateur à une expression régulière rigide, le moteur de lab évalue **l'état du système de fichiers après exécution**.

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
