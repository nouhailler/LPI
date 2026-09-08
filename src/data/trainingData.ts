import {
  FillInTheBlankChallenge,
  TroubleshootingChallenge,
  SequencingChallenge,
  MatchingGame,
  GuidedLabScenario,
} from '../types';

// =========================================================================
// 1. MODULE « SAISIE EXACTE » (Fill-in-the-Blank)
// =========================================================================

export const fillInTheBlankChallenges: FillInTheBlankChallenge[] = [
  {
    id: 'fib-1',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'Hardware & Architecture',
    prompt: 'Quel fichier virtuel du noyau contient la liste détaillée et les caractéristiques des processeurs détectés sur le système ?',
    promptFr: 'Quel fichier virtuel du noyau contient la liste détaillée et les caractéristiques des processeurs détectés sur le système ?',
    scenario: 'Vous devez auditer les drapeaux CPU (flags SSE, VMX/SVM) sur un serveur sans installer d\'outils tiers.',
    scenarioFr: 'Vous devez auditer les drapeaux CPU (flags SSE, VMX/SVM) sur un serveur sans installer d\'outils tiers.',
    contextCode: '$ cat _______ | grep -m 1 "model name"',
    expectedAnswers: ['/proc/cpuinfo', 'proc/cpuinfo'],
    caseSensitive: false,
    placeholder: '/proc/...',
    hint: 'Il se trouve dans le pseudo-système de fichiers /proc.',
    hintFr: 'Il se trouve dans le pseudo-système de fichiers /proc.',
    explanation: 'Le fichier /proc/cpuinfo expose les informations fournies par le noyau sur l\'architecture processeur (modèle, fréquence, cœurs, flags).',
    explanationFr: 'Le fichier /proc/cpuinfo expose les informations fournies par le noyau sur l\'architecture processeur (modèle, fréquence, cœurs, flags).'
  },
  {
    id: 'fib-2',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Cron & Automation',
    prompt: 'Quelle commande avec option permet d\'éditer la table crontab de l\'utilisateur courant en utilisant l\'éditeur par défaut défini par la variable $EDITOR ?',
    promptFr: 'Quelle commande avec option permet d\'éditer la table crontab de l\'utilisateur courant en utilisant l\'éditeur par défaut défini par la variable $EDITOR ?',
    scenario: 'Vous souhaitez planifier une sauvegarde automatique chaque nuit à 02h00 pour votre utilisateur.',
    scenarioFr: 'Vous souhaitez planifier une sauvegarde automatique chaque nuit à 02h00 pour votre utilisateur.',
    contextCode: '$ _______',
    expectedAnswers: ['crontab -e', 'crontab  -e', '/usr/bin/crontab -e'],
    caseSensitive: false,
    placeholder: 'commande et option...',
    hint: 'Option -e pour Edit.',
    hintFr: 'Option -e pour Edit (attention, ne pas confondre avec -r pour remove).',
    explanation: 'La commande "crontab -e" ouvre la table de l\'utilisateur dans l\'éditeur configuré. L\'option -l liste les tâches et -r les supprime.',
    explanationFr: 'La commande "crontab -e" ouvre la table de l\'utilisateur dans l\'éditeur configuré. L\'option -l liste les tâches et -r les supprime.'
  },
  {
    id: 'fib-3',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'User Accounts',
    prompt: 'Quel fichier système sécurisé sous Linux stocke les empreintes de mots de passe chiffrés ainsi que les politiques d\'expiration des comptes utilisateurs ?',
    promptFr: 'Quel fichier système sécurisé sous Linux stocke les empreintes de mots de passe chiffrés ainsi que les politiques d\'expiration des comptes utilisateurs ?',
    scenario: 'Ce fichier n\'est lisible que par l\'administrateur root (droits 640 ou 600) afin de protéger les hashes contre les attaques hors-ligne.',
    scenarioFr: 'Ce fichier n\'est lisible que par l\'administrateur root (droits 640 ou 600) afin de protéger les hashes contre les attaques hors-ligne.',
    contextCode: '-rw-r----- 1 root shadow 1420 Sep 08 09:00 _______',
    expectedAnswers: ['/etc/shadow', 'etc/shadow'],
    caseSensitive: false,
    placeholder: '/etc/...',
    hint: 'Ce fichier est traditionnellement associé au groupe shadow.',
    hintFr: 'Ce fichier est traditionnellement associé au groupe shadow.',
    explanation: 'Le fichier /etc/shadow contient les mots de passe hachés (ex: SHA-512 $6$), le sel (salt), le jour du dernier changement et la durée de validité.',
    explanationFr: 'Le fichier /etc/shadow contient les mots de passe hachés (ex: SHA-512 $6$), le sel (salt), le jour du dernier changement et la durée de validité.'
  },
  {
    id: 'fib-4',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.1',
    category: 'Filesystems',
    prompt: 'Quelle commande permet de créer un système de fichiers de type ext4 sur la partition /dev/sdb1 ?',
    promptFr: 'Quelle commande permet de créer un système de fichiers de type ext4 sur la partition /dev/sdb1 ?',
    scenario: 'Vous venez de partitionner un nouveau disque SSD et devez formater la première partition en ext4.',
    scenarioFr: 'Vous venez de partitionner un nouveau disque SSD et devez formater la première partition en ext4.',
    contextCode: '# _______ /dev/sdb1',
    expectedAnswers: [
      'mkfs.ext4 /dev/sdb1',
      'mkfs -t ext4 /dev/sdb1',
      '/sbin/mkfs.ext4 /dev/sdb1',
      'mke2fs -t ext4 /dev/sdb1'
    ],
    caseSensitive: false,
    placeholder: 'mkfs...',
    hint: 'Soit la commande dédiée mkfs.ext4, soit mkfs avec le drapeau -t.',
    hintFr: 'Soit la commande dédiée mkfs.ext4, soit mkfs avec le drapeau -t.',
    explanation: 'mkfs.ext4 /dev/sdb1 (ou mkfs -t ext4 /dev/sdb1) initialise les superblocs, tables d\'inodes et journal ext4.',
    explanationFr: 'mkfs.ext4 /dev/sdb1 (ou mkfs -t ext4 /dev/sdb1) initialise les superblocs, tables d\'inodes et journal ext4.'
  },
  {
    id: 'fib-5',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.5',
    category: 'Process Management',
    prompt: 'Quelle commande permet d\'envoyer le signal SIGKILL (signal numéro 9) au processus ayant le PID 4521 ?',
    promptFr: 'Quelle commande permet d\'envoyer le signal SIGKILL (signal numéro 9) au processus ayant le PID 4521 ?',
    scenario: 'Un processus zombie ou bloqué refuse de s\'arrêter après un signal SIGTERM.',
    scenarioFr: 'Un processus zombie ou bloqué refuse de s\'arrêter après un signal SIGTERM.',
    contextCode: '$ _______ 4521',
    expectedAnswers: [
      'kill -9 4521',
      'kill -s 9 4521',
      'kill -SIGKILL 4521',
      'kill -s SIGKILL 4521',
      'kill -KILL 4521'
    ],
    caseSensitive: false,
    placeholder: 'kill...',
    hint: 'Utilisez kill avec le drapeau -9 ou -KILL.',
    hintFr: 'Utilisez kill avec le drapeau -9 ou -KILL.',
    explanation: 'La commande kill -9 <PID> (ou kill -SIGKILL <PID>) envoie le signal 9 qui ne peut être ni intercepté ni ignoré par le processus.',
    explanationFr: 'La commande kill -9 <PID> (ou kill -SIGKILL <PID>) envoie le signal 9 qui ne peut être ni intercepté ni ignoré par le processus.'
  },
  {
    id: 'fib-6',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Systemd & Boot',
    prompt: 'Sous systemd, quelle commande permet de basculer immédiatement le système vers la cible multi-utilisateurs sans interface graphique (équivalent de l\'ancien runlevel 3) ?',
    promptFr: 'Sous systemd, quelle commande permet de basculer immédiatement le système vers la cible multi-utilisateurs sans interface graphique (équivalent de l\'ancien runlevel 3) ?',
    scenario: 'Vous devez isoler le serveur pour une maintenance réseau sans fermer les sessions CLI.',
    scenarioFr: 'Vous devez isoler le serveur pour une maintenance réseau sans fermer les sessions CLI.',
    contextCode: '# _______ multi-user.target',
    expectedAnswers: [
      'systemctl isolate multi-user.target',
      'systemctl isolate multi-user'
    ],
    caseSensitive: false,
    placeholder: 'systemctl isolate...',
    hint: 'La sous-commande systemctl isolate permet de changer de cible active en arrêtant les services non inclus.',
    hintFr: 'La sous-commande systemctl isolate permet de changer de cible active.',
    explanation: 'systemctl isolate multi-user.target arrête les services graphiques et active tous les services de la cible multi-utilisateurs.',
    explanationFr: 'systemctl isolate multi-user.target arrête les services graphiques et active tous les services de la cible multi-utilisateurs.'
  },
  {
    id: 'fib-7',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Permissions & Sudo',
    prompt: 'Quelle commande d\'administration DOIT impérativement être utilisée pour modifier le fichier /etc/sudoers afin de vérifier la syntaxe avant d\'enregistrer ?',
    promptFr: 'Quelle commande d\'administration DOIT impérativement être utilisée pour modifier le fichier /etc/sudoers afin de vérifier la syntaxe avant d\'enregistrer ?',
    scenario: 'Une erreur de syntaxe dans sudoers bloquerait tous les accès d\'élévation de privilèges pour tous les administrateurs.',
    scenarioFr: 'Une erreur de syntaxe dans sudoers bloquerait tous les accès d\'élévation de privilèges pour tous les administrateurs.',
    contextCode: '# _______',
    expectedAnswers: ['visudo', '/usr/sbin/visudo', 'sudo visudo'],
    caseSensitive: false,
    placeholder: 'commande...',
    hint: 'La commande verrouille le fichier et parse la syntaxe avant écriture.',
    hintFr: 'Son nom est une contraction de "vi" et "sudo".',
    explanation: 'visudo verrouille /etc/sudoers, ouvre l\'éditeur par défaut, et analyse la syntaxe avant de sauvegarder pour éviter toute corruption fatale.',
    explanationFr: 'visudo verrouille /etc/sudoers, ouvre l\'éditeur par défaut, et analyse la syntaxe avant de sauvegarder pour éviter toute corruption fatale.'
  },
  {
    id: 'fib-8',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.3',
    category: 'Text Processing',
    prompt: 'Quelle commande simple permet d\'afficher uniquement les lignes uniques d\'un flux de texte préalablement trié ?',
    promptFr: 'Quelle commande simple permet d\'afficher uniquement les lignes uniques d\'un flux de texte préalablement trié ?',
    scenario: 'Vous avez extrait une liste d\'adresses IP avec sort et vous souhaitez supprimer tous les doublons consécutifs.',
    scenarioFr: 'Vous avez extrait une liste d\'adresses IP avec sort et vous souhaitez supprimer tous les doublons consécutifs.',
    contextCode: '$ cat access.log | cut -d" " -f1 | sort | _______',
    expectedAnswers: ['uniq', '/usr/bin/uniq'],
    caseSensitive: false,
    placeholder: 'commande...',
    hint: 'Elle s\'utilise presque toujours en pipeline après sort.',
    hintFr: 'Son nom est le raccourci de unique.',
    explanation: 'La commande uniq élimine ou rapporte les lignes répétées adjacentes. C\'est pourquoi l\'entrée doit être triée avec sort au préalable.',
    explanationFr: 'La commande uniq élimine ou rapporte les lignes répétées adjacentes. C\'est pourquoi l\'entrée doit être triée avec sort au préalable.'
  },
  {
    id: 'fib-9',
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: '201.1',
    category: 'Kernel & Modules',
    prompt: 'Quelle commande intelligente permet de charger un module noyau (ex: e1000e) en résolvant et chargeant automatiquement toutes ses dépendances préalables ?',
    promptFr: 'Quelle commande intelligente permet de charger un module noyau (ex: e1000e) en résolvant et chargeant automatiquement toutes ses dépendances préalables ?',
    scenario: 'Contrairement à insmod, cet outil consulte modules.dep pour charger l\'ensemble de l\'arbre.',
    scenarioFr: 'Contrairement à insmod, cet outil consulte modules.dep pour charger l\'arbre de dépendances.',
    contextCode: '# _______ e1000e',
    expectedAnswers: ['modprobe e1000e', 'modprobe', '/sbin/modprobe e1000e'],
    caseSensitive: false,
    placeholder: 'modprobe...',
    hint: 'Il commence par "mod" et résout les dépendances.',
    hintFr: 'Il commence par "mod" et consulte modules.dep.',
    explanation: 'modprobe consulte modules.dep (créé par depmod) et charge automatiquement tous les modules parents nécessaires.',
    explanationFr: 'modprobe consulte modules.dep (créé par depmod) et charge automatiquement tous les modules parents nécessaires.'
  },
  {
    id: 'fib-10',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.3',
    category: 'Mounts & Fstab',
    prompt: 'Quelle option de la commande mount permet de remonter un système de fichiers déjà monté en modifiant ses paramètres (par exemple pour passer de lecture seule ro à lecture-écriture rw) ?',
    promptFr: 'Quelle option de la commande mount permet de remonter un système de fichiers déjà monté en modifiant ses paramètres (par exemple pour passer de lecture seule ro à lecture-écriture rw) ?',
    scenario: 'En mode de secours (single-user), la racine / est souvent montée en ro. Vous devez la passer en rw.',
    scenarioFr: 'En mode de secours (single-user), la racine / est souvent montée en ro. Vous devez la passer en rw.',
    contextCode: '# mount -o _______ /',
    expectedAnswers: ['remount,rw', 'remount', 'remount,ro', '-o remount,rw'],
    caseSensitive: false,
    placeholder: 'remount...',
    hint: 'Le mot-clé commence par "remount".',
    hintFr: 'Le mot-clé commence par "remount".',
    explanation: 'La commande "mount -o remount,rw /" indique au noyau de réappliquer les drapeaux de montage sans démonter la racine active.',
    explanationFr: 'La commande "mount -o remount,rw /" indique au noyau de réappliquer les drapeaux de montage sans démonter la racine active.'
  }
];

// =========================================================================
// 2. MODULE « DÉFIS DE DÉPANNAGE » (Troubleshooting & Find the Bug)
// =========================================================================

export const troubleshootingChallenges: TroubleshootingChallenge[] = [
  {
    id: 'tb-1',
    title: 'Anomalie de syntaxe dans /etc/fstab',
    titleFr: 'Anomalie de syntaxe dans /etc/fstab',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.3',
    category: 'Filesystems & Storage',
    scenario: 'Après l\'ajout d\'un deuxième disque dur pour héberger les sauvegardes, le serveur refuse de terminer son démarrage normal et bascule en "emergency mode". Vous examinez le fichier /etc/fstab ci-dessous.',
    scenarioFr: 'Après l\'ajout d\'un deuxième disque dur pour héberger les sauvegardes, le serveur refuse de terminer son démarrage normal et bascule en "emergency mode". Vous examinez le fichier /etc/fstab ci-dessous.',
    codeSnippet: `# /etc/fstab: static file system information.
UUID=4a92e105-01 / ext4 defaults 0 1
UUID=9b11f32a-02 /boot ext4 defaults 0 2
UUID=3c88a719-03 swap swap sw 0 0
/dev/sdb1 /backup ext4 defaults`,
    language: 'fstab',
    bugDescription: 'La ligne /dev/sdb1 ne contient que 4 colonnes au lieu des 6 colonnes obligatoires requises par fstab (manquent dump et fsck pass).',
    bugDescriptionFr: 'La ligne /dev/sdb1 ne contient que 4 colonnes au lieu des 6 colonnes obligatoires requises par fstab (manquent les valeurs dump et fsck pass).',
    options: [
      {
        id: 'opt-1',
        label: 'La ligne /dev/sdb1 ne comporte que 4 champs au lieu des 6 colonnes obligatoires (champs <dump> et <pass> manquants)',
        labelFr: 'La ligne /dev/sdb1 ne comporte que 4 champs au lieu des 6 colonnes obligatoires (champs <dump> et <pass> manquants)',
        isCorrect: true,
        explanation: 'Dans /etc/fstab, chaque ligne non commentée doit obligatoirement compter 6 champs : <spec> <file> <vfstype> <mntops> <freq> <passno>.',
        explanationFr: 'Dans /etc/fstab, chaque ligne non commentée doit obligatoirement compter 6 champs : <spec> <file> <vfstype> <mntops> <freq> <passno>.'
      },
      {
        id: 'opt-2',
        label: 'Il est interdit d\'utiliser un chemin de périphérique comme /dev/sdb1 dans fstab, seul l\'UUID est autorisé',
        labelFr: 'Il est interdit d\'utiliser un chemin de périphérique comme /dev/sdb1 dans fstab, seul l\'UUID est autorisé',
        isCorrect: false,
        explanation: 'Bien que l\'UUID soit fortement recommandé pour la stabilité, la syntaxe avec /dev/sdX1 reste parfaitement valide syntaxiquement.',
        explanationFr: 'Bien que l\'UUID soit fortement recommandé pour la stabilité, la syntaxe avec /dev/sdX1 reste parfaitement valide syntaxiquement.'
      },
      {
        id: 'opt-3',
        label: 'Le point de montage /backup doit obligatoirement se terminer par un slash (/backup/)',
        labelFr: 'Le point de montage /backup doit obligatoirement se terminer par un slash (/backup/)',
        isCorrect: false,
        explanation: 'Les points de montage dans fstab ne doivent pas comporter de slash final.',
        explanationFr: 'Les points de montage dans fstab ne doivent pas comporter de slash final.'
      },
      {
        id: 'opt-4',
        label: 'Le type ext4 n\'accepte pas l\'option de montage "defaults"',
        labelFr: 'Le type ext4 n\'accepte pas l\'option de montage "defaults"',
        isCorrect: false,
        explanation: '"defaults" est l\'option standard universelle pour ext4 (rw, suid, dev, exec, auto, nouser, async).',
        explanationFr: '"defaults" est l\'option standard universelle pour ext4 (rw, suid, dev, exec, auto, nouser, async).'
      }
    ],
    correctedSnippet: `/dev/sdb1 /backup ext4 defaults 0 2`,
    fixExplanation: 'Pour corriger, ajoutez les deux entiers finaux : "0 2" (0 pour désactiver le dump, et 2 pour que fsck vérifie cette partition après la partition racine qui a la priorité 1).',
    fixExplanationFr: 'Pour corriger, ajoutez les deux entiers finaux : "0 2" (0 pour désactiver le dump, et 2 pour que fsck vérifie cette partition après la partition racine qui a la priorité 1).'
  },
  {
    id: 'tb-2',
    title: 'Erreur dans une tâche planifiée /etc/crontab',
    titleFr: 'Erreur dans une tâche planifiée /etc/crontab',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.2',
    category: 'Cron & Automation',
    scenario: 'Un administrateur a configuré une tâche système dans /etc/crontab pour exécuter un script de nettoyage, mais le script ne s\'exécute jamais.',
    scenarioFr: 'Un administrateur a configuré une tâche système dans /etc/crontab pour exécuter un script de nettoyage, mais le script ne s\'exécute jamais.',
    codeSnippet: `# /etc/crontab
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow command
30 02 * * 1 /usr/local/bin/cleanup.sh`,
    language: 'cron',
    bugDescription: 'Le champ utilisateur (user-name) a été omis dans /etc/crontab.',
    bugDescriptionFr: 'Le champ utilisateur (user-name) a été omis dans /etc/crontab.',
    options: [
      {
        id: 'opt-1',
        label: 'Le champ "utilisateur" (ex: root) est manquant entre le champ jour de la semaine et la commande',
        labelFr: 'Le champ "utilisateur" (ex: root) est manquant entre le champ jour de la semaine et la commande',
        isCorrect: true,
        explanation: 'Dans le /etc/crontab système (contrairement aux crontabs utilisateurs modifiées via crontab -e), le 6ème champ DOIT être le nom de l\'utilisateur exécutant la commande.',
        explanationFr: 'Dans le /etc/crontab système (contrairement aux crontabs utilisateurs modifiées via crontab -e), le 6ème champ DOIT être le nom de l\'utilisateur exécutant la commande.'
      },
      {
        id: 'opt-2',
        label: 'Le format de l\'heure "02" est invalide, seul "2" sans zéro initial est accepté',
        labelFr: 'Le format de l\'heure "02" est invalide, seul "2" sans zéro initial est accepté',
        isCorrect: false,
        explanation: 'Cron accepte aussi bien "2" que "02".',
        explanationFr: 'Cron accepte aussi bien "2" que "02".'
      },
      {
        id: 'opt-3',
        label: 'Les scripts shell doivent obligatoirement être précédés de l\'interpréteur bash',
        labelFr: 'Les scripts shell doivent obligatoirement être précédés de l\'interpréteur bash',
        isCorrect: false,
        explanation: 'Si le script possède les droits d\'exécution (chmod +x) et un shebang valide, il s\'exécute directement.',
        explanationFr: 'Si le script possède les droits d\'exécution (chmod +x) et un shebang valide, il s\'exécute directement.'
      }
    ],
    correctedSnippet: `30 02 * * 1 root /usr/local/bin/cleanup.sh`,
    fixExplanation: 'Dans /etc/crontab, la syntaxe est "m h dom mon dow user command". Cron a pris "/usr/local/bin/cleanup.sh" pour le nom d\'utilisateur et a échoué.',
    fixExplanationFr: 'Dans /etc/crontab, la syntaxe est "m h dom mon dow user command". Cron a pris "/usr/local/bin/cleanup.sh" pour le nom d\'utilisateur et a échoué.'
  },
  {
    id: 'tb-3',
    title: 'Échec de démarrage d\'un service Systemd custom',
    titleFr: 'Échec de démarrage d\'un service Systemd custom',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Systemd Unit Files',
    scenario: 'Un développeur a créé l\'unité /etc/systemd/system/app.service. Cependant, "systemctl start app.service" retourne immédiatement une erreur de syntaxe.',
    scenarioFr: 'Un développeur a créé l\'unité /etc/systemd/system/app.service. Cependant, "systemctl start app.service" retourne immédiatement une erreur de syntaxe.',
    codeSnippet: `[Unit]
Description=My Background Web App
After=network.target

[Service]
Type=simple
ExecStart=node index.js
Restart=always

[Install]
WantedBy=multi-user.target`,
    language: 'systemd',
    bugDescription: 'La directive ExecStart requiert un chemin absolu vers l\'exécutable.',
    bugDescriptionFr: 'La directive ExecStart requiert un chemin absolu vers l\'exécutable.',
    options: [
      {
        id: 'opt-1',
        label: 'La directive ExecStart requiert obligatoirement un chemin absolu pour le binaire (ex: /usr/bin/node /opt/app/index.js)',
        labelFr: 'La directive ExecStart requiert obligatoirement un chemin absolu pour le binaire (ex: /usr/bin/node /opt/app/index.js)',
        isCorrect: true,
        explanation: 'Systemd n\'utilise pas la variable PATH de l\'utilisateur pour résoudre ExecStart : tout exécutable doit obligatoirement être spécifié par son chemin absolu.',
        explanationFr: 'Systemd n\'utilise pas la variable PATH de l\'utilisateur pour résoudre ExecStart : tout exécutable doit obligatoirement être spécifié par son chemin absolu.'
      },
      {
        id: 'opt-2',
        label: 'La section [Install] doit être placée tout en haut du fichier avant [Unit]',
        labelFr: 'La section [Install] doit être placée tout en haut du fichier avant [Unit]',
        isCorrect: false,
        explanation: 'L\'ordre des sections n\'a pas d\'impact sous Systemd.',
        explanationFr: 'L\'ordre des sections n\'a pas d\'impact sous Systemd.'
      },
      {
        id: 'opt-3',
        label: 'Type=simple n\'est pas un type valide pour un service systemd',
        labelFr: 'Type=simple n\'est pas un type valide pour un service systemd',
        isCorrect: false,
        explanation: 'Type=simple est la valeur par défaut standard sous systemd.',
        explanationFr: 'Type=simple est la valeur par défaut standard sous systemd.'
      }
    ],
    correctedSnippet: `ExecStart=/usr/bin/node /opt/app/index.js
WorkingDirectory=/opt/app`,
    fixExplanation: 'Systemd exige des chemins absolus dans ExecStart, et il est recommandé de spécifier WorkingDirectory pour que index.js trouve ses dépendances.',
    fixExplanationFr: 'Systemd exige des chemins absolus dans ExecStart, et il est recommandé de spécifier WorkingDirectory pour que index.js trouve ses dépendances.'
  },
  {
    id: 'tb-4',
    title: 'Piège de syntaxe dans /etc/sudoers',
    titleFr: 'Piège de syntaxe dans /etc/sudoers',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'Security & Privileges',
    scenario: 'L\'administrateur souhaite autoriser tous les membres du groupe "sysadmin" à exécuter n\'importe quelle commande en root sans mot de passe.',
    scenarioFr: 'L\'administrateur souhaite autoriser tous les membres du groupe "sysadmin" à exécuter n\'importe quelle commande en root sans mot de passe.',
    codeSnippet: `# /etc/sudoers
Defaults env_reset
root ALL=(ALL:ALL) ALL

sysadmin ALL=(ALL:ALL) NOPASSWD: ALL`,
    language: 'config',
    bugDescription: 'Un groupe dans sudoers doit impérativement être précédé du caractère pourcentage (%)',
    bugDescriptionFr: 'Un groupe dans sudoers doit impérativement être précédé du caractère pourcentage (%)',
    options: [
      {
        id: 'opt-1',
        label: 'Il manque le préfixe "%" devant "sysadmin" pour indiquer qu\'il s\'agit d\'un groupe et non d\'un utilisateur individuel',
        labelFr: 'Il manque le préfixe "%" devant "sysadmin" pour indiquer qu\'il s\'agit d\'un groupe et non d\'un utilisateur individuel',
        isCorrect: true,
        explanation: 'Sans le préfixe "%", sudo cherche un utilisateur nommé sysadmin. Pour cibler les membres du groupe unix, la syntaxe est "%sysadmin".',
        explanationFr: 'Sans le préfixe "%", sudo cherche un utilisateur nommé sysadmin. Pour cibler les membres du groupe unix, la syntaxe est "%sysadmin".'
      },
      {
        id: 'opt-2',
        label: 'Le mot-clé NOPASSWD doit être placé en tout début de ligne',
        labelFr: 'Le mot-clé NOPASSWD doit être placé en tout début de ligne',
        isCorrect: false,
        explanation: 'NOPASSWD est un modificateur de commande et se place bien avant la liste des commandes.',
        explanationFr: 'NOPASSWD est un modificateur de commande et se place bien avant la liste des commandes.'
      },
      {
        id: 'opt-3',
        label: 'ALL=(ALL:ALL) doit être remplacé par (root)',
        labelFr: 'ALL=(ALL:ALL) doit être remplacé par (root)',
        isCorrect: false,
        explanation: '(ALL:ALL) est la syntaxe standard complète (User:Group).',
        explanationFr: '(ALL:ALL) est la syntaxe standard complète (User:Group).'
      }
    ],
    correctedSnippet: `%sysadmin ALL=(ALL:ALL) NOPASSWD: ALL`,
    fixExplanation: 'En préfixant par "%", sudoers applique la directive à tout utilisateur dont le groupe primaire ou secondaire est sysadmin.',
    fixExplanationFr: 'En préfixant par "%", sudoers applique la directive à tout utilisateur dont le groupe primaire ou secondaire est sysadmin.'
  }
];

// =========================================================================
// 3. MODULE « EXERCICES D'ORDONNANCEMENT » (Timeline & Boot Order)
// =========================================================================

export const sequencingChallenges: SequencingChallenge[] = [
  {
    id: 'seq-1',
    title: 'Séquence complète de démarrage Linux (UEFI & Systemd)',
    titleFr: 'Séquence complète de démarrage Linux (UEFI & Systemd)',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.2',
    category: 'System Architecture',
    description: 'Placez les étapes du démarrage d\'un système moderne UEFI dans l\'ordre chronologique exact, de l\'alimentation électrique jusqu\'au prompt de connexion.',
    descriptionFr: 'Placez les étapes du démarrage d\'un système moderne UEFI dans l\'ordre chronologique exact, de l\'alimentation électrique jusqu\'au prompt de connexion.',
    steps: [
      {
        id: 's1',
        label: '1. Firmware UEFI / POST',
        labelFr: '1. Firmware UEFI / POST',
        detail: 'Initialisation du matériel et lecture de la partition système EFI (ESP /boot/efi)',
        detailFr: 'Initialisation du matériel et lecture de la partition système EFI (ESP /boot/efi)'
      },
      {
        id: 's2',
        label: '2. Chargeur GRUB2',
        labelFr: '2. Chargeur GRUB2',
        detail: 'Affichage du menu de démarrage, chargement en RAM du vmlinuz et de l\'initramfs',
        detailFr: 'Affichage du menu de démarrage, chargement en RAM du vmlinuz et de l\'initramfs'
      },
      {
        id: 's3',
        label: '3. Décompression & Exécution du Noyau (Kernel)',
        labelFr: '3. Décompression & Exécution du Noyau (Kernel)',
        detail: 'Détection du hardware, décompression en mémoire et montage de l\'initramfs temporaire',
        detailFr: 'Détection du hardware, décompression en mémoire et montage de l\'initramfs temporaire'
      },
      {
        id: 's4',
        label: '4. Exécution de l\'Initramfs (initrd)',
        labelFr: '4. Exécution de l\'Initramfs (initrd)',
        detail: 'Chargement des modules disques/RAID/LVM et pivotement vers la véritable racine (pivot_root)',
        detailFr: 'Chargement des modules disques/RAID/LVM et pivotement vers la véritable racine (pivot_root)'
      },
      {
        id: 's5',
        label: '5. Lancement de Systemd (PID 1)',
        labelFr: '5. Lancement de Systemd (PID 1)',
        detail: 'Exécution du premier processus utilisateur /sbin/init (lien vers systemd)',
        detailFr: 'Exécution du premier processus utilisateur /sbin/init (lien vers systemd)'
      },
      {
        id: 's6',
        label: '6. Atteinte de default.target',
        labelFr: '6. Atteinte de default.target',
        detail: 'Démarrage en parallèle des services jusqu\'à multi-user.target ou graphical.target',
        detailFr: 'Démarrage en parallèle des services jusqu\'à multi-user.target ou graphical.target'
      }
    ],
    explanation: 'Le firmware UEFI charge le bootloader GRUB2 depuis la partition ESP. GRUB2 charge le noyau et l\'initramfs. L\'initramfs monte la vraie racine sur disque, puis lance le PID 1 (systemd) qui active default.target.',
    explanationFr: 'Le firmware UEFI charge le bootloader GRUB2 depuis la partition ESP. GRUB2 charge le noyau et l\'initramfs. L\'initramfs monte la vraie racine sur disque, puis lance le PID 1 (systemd) qui active default.target.'
  },
  {
    id: 'seq-2',
    title: 'Ordre de chargement des fichiers de profil Bash (Login Shell)',
    titleFr: 'Ordre de chargement des fichiers de profil Bash (Login Shell)',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.1',
    category: 'Shells & Environment',
    description: 'Lorsqu\'un utilisateur ouvre une session de connexion interactive (Login Shell via SSH ou console tty), dans quel ordre exact Bash recherche-t-il et exécute-t-il les fichiers de configuration ?',
    descriptionFr: 'Lorsqu\'un utilisateur ouvre une session de connexion interactive (Login Shell via SSH ou console tty), dans quel ordre exact Bash recherche-t-il et exécute-t-il les fichiers de configuration ?',
    steps: [
      {
        id: 's1',
        label: '1. /etc/profile',
        labelFr: '1. /etc/profile',
        detail: 'Script global lu en premier pour tous les utilisateurs',
        detailFr: 'Script global lu en premier pour tous les utilisateurs'
      },
      {
        id: 's2',
        label: '2. /etc/profile.d/*.sh',
        labelFr: '2. /etc/profile.d/*.sh',
        detail: 'Scripts modulaires appelés depuis /etc/profile',
        detailFr: 'Scripts modulaires appelés depuis /etc/profile'
      },
      {
        id: 's3',
        label: '3. Premier trouvé parmi ~/.bash_profile, ~/.bash_login ou ~/.profile',
        labelFr: '3. Premier trouvé parmi ~/.bash_profile, ~/.bash_login ou ~/.profile',
        detail: 'Bash s\'arrête au premier des 3 fichiers existant dans le home directory',
        detailFr: 'Bash s\'arrête au premier des 3 fichiers existant dans le home directory'
      },
      {
        id: 's4',
        label: '4. ~/.bashrc',
        labelFr: '4. ~/.bashrc',
        detail: 'Sourcé généralement par ~/.bash_profile pour les alias et fonctions interactifs',
        detailFr: 'Sourcé généralement par ~/.bash_profile pour les alias et fonctions interactifs'
      },
      {
        id: 's5',
        label: '5. ~/.bash_logout',
        labelFr: '5. ~/.bash_logout',
        detail: 'Exécuté uniquement lors de la fermeture de la session (déconnexion)',
        detailFr: 'Exécuté uniquement lors de la fermeture de la session (déconnexion)'
      }
    ],
    explanation: 'Bash lit d\'abord /etc/profile (qui source /etc/profile.d/), puis cherche dans le répertoire personnel le PREMIER existant parmi ~/.bash_profile, ~/.bash_login et ~/.profile. ~/.bash_logout n\'est exécuté qu\'au logout.',
    explanationFr: 'Bash lit d\'abord /etc/profile (qui source /etc/profile.d/), puis cherche dans le répertoire personnel le PREMIER existant parmi ~/.bash_profile, ~/.bash_login et ~/.profile. ~/.bash_logout n\'est exécuté qu\'au logout.'
  },
  {
    id: 'seq-3',
    title: 'Création et montage d\'un volume logique LVM de A à Z',
    titleFr: 'Création et montage d\'un volume logique LVM de A à Z',
    certification: 'lpic-2',
    topicNumber: 204,
    objectiveId: '204.1',
    category: 'LVM Storage Management',
    description: 'Ordonnez les commandes administratives nécessaires pour initialiser un nouveau disque /dev/sdb, l\'intégrer à LVM, formater et monter le volume.',
    descriptionFr: 'Ordonnez les commandes administratives nécessaires pour initialiser un nouveau disque /dev/sdb, l\'intégrer à LVM, formater et monter le volume.',
    steps: [
      {
        id: 's1',
        label: '1. pvcreate /dev/sdb',
        labelFr: '1. pvcreate /dev/sdb',
        detail: 'Initialise le Physical Volume (PV) en écrivant les métadonnées LVM',
        detailFr: 'Initialise le Physical Volume (PV) en écrivant les métadonnées LVM'
      },
      {
        id: 's2',
        label: '2. vgcreate data_vg /dev/sdb',
        labelFr: '2. vgcreate data_vg /dev/sdb',
        detail: 'Crée le Volume Group (VG) regroupant le ou les disques physiques',
        detailFr: 'Crée le Volume Group (VG) regroupant le ou les disques physiques'
      },
      {
        id: 's3',
        label: '3. lvcreate -n web_lv -L 50G data_vg',
        labelFr: '3. lvcreate -n web_lv -L 50G data_vg',
        detail: 'Découpe un Logical Volume (LV) de 50 Go au sein du groupe',
        detailFr: 'Découpe un Logical Volume (LV) de 50 Go au sein du groupe'
      },
      {
        id: 's4',
        label: '4. mkfs.xfs /dev/data_vg/web_lv',
        labelFr: '4. mkfs.xfs /dev/data_vg/web_lv',
        detail: 'Formate le volume logique avec un système de fichiers (ex: XFS)',
        detailFr: 'Formate le volume logique avec un système de fichiers (ex: XFS)'
      },
      {
        id: 's5',
        label: '5. mount /dev/data_vg/web_lv /var/www',
        labelFr: '5. mount /dev/data_vg/web_lv /var/www',
        detail: 'Monte le système de fichiers dans l\'arborescence Linux',
        detailFr: 'Monte le système de fichiers dans l\'arborescence Linux'
      }
    ],
    explanation: 'La hiérarchie LVM suit rigoureusement l\'ordre : Disque physique -> PV (pvcreate) -> VG (vgcreate) -> LV (lvcreate) -> Formatage (mkfs) -> Montage (mount).',
    explanationFr: 'La hiérarchie LVM suit rigoureusement l\'ordre : Disque physique -> PV (pvcreate) -> VG (vgcreate) -> LV (lvcreate) -> Formatage (mkfs) -> Montage (mount).'
  }
];

// =========================================================================
// 4. MODULE « ATELIERS D'APPARIEMENT » (Matching Games)
// =========================================================================

export const matchingGames: MatchingGame[] = [
  {
    id: 'match-1',
    title: 'Signaux POSIX & Numéros de signaux standards',
    titleFr: 'Signaux POSIX & Numéros de signaux standards',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.5',
    category: 'Process Management',
    description: 'Associez chaque nom de signal officiel Linux à son numéro standard correspondant.',
    descriptionFr: 'Associez chaque nom de signal officiel Linux à son numéro standard correspondant.',
    pairs: [
      { id: 'p1', left: 'SIGHUP', right: 'Signal 1', note: 'Hangup : rechargement de configuration d\'un démon sans arrêt' },
      { id: 'p2', left: 'SIGINT', right: 'Signal 2', note: 'Interrupt : émis par le raccourci clavier Ctrl+C' },
      { id: 'p3', left: 'SIGQUIT', right: 'Signal 3', note: 'Quit : émis par Ctrl+\\ avec génération d\'un core dump' },
      { id: 'p4', left: 'SIGKILL', right: 'Signal 9', note: 'Kill immédiat : ne peut être ni intercepté ni ignoré' },
      { id: 'p5', left: 'SIGTERM', right: 'Signal 15', note: 'Termination standard : signal par défaut de la commande kill' },
      { id: 'p6', left: 'SIGCONT', right: 'Signal 18', note: 'Continue : reprend un processus suspendu' },
      { id: 'p7', left: 'SIGSTOP', right: 'Signal 19', note: 'Stop : suspend l\'exécution (non interceptable)' },
      { id: 'p8', left: 'SIGTSTP', right: 'Signal 20', note: 'Terminal Stop : émis par Ctrl+Z depuis le terminal' }
    ]
  },
  {
    id: 'match-2',
    title: 'Standard FHS : Rôle officiel des répertoires Linux',
    titleFr: 'Standard FHS : Rôle officiel des répertoires Linux',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.7',
    category: 'Filesystem Hierarchy Standard',
    description: 'Reliez chaque répertoire racine selon la norme FHS à sa fonction officielle.',
    descriptionFr: 'Reliez chaque répertoire racine selon la norme FHS à sa fonction officielle.',
    pairs: [
      { id: 'p1', left: '/etc', right: 'Fichiers de configuration spécifiques à la machine locale', note: 'Fichiers statiques et éditables par l\'administrateur' },
      { id: 'p2', left: '/var', right: 'Données variables (logs, spool, caches, bases de données)', note: 'Fichiers dont la taille évolue continuellement' },
      { id: 'p3', left: '/opt', right: 'Logiciels applicatifs tiers autonomes (add-on)', note: 'Packages propriétaires ou autoportants' },
      { id: 'p4', left: '/srv', right: 'Données servies par les services réseau (FTP, Web, Rsync)', note: 'Données spécifiques aux sites servis' },
      { id: 'p5', left: '/usr/local', right: 'Programmes installés localement par l\'administrateur', note: 'Évite d\'écraser les paquets gérés par le gestionnaire de paquets' },
      { id: 'p6', left: '/proc', right: 'Système de fichiers virtuel des processus et du noyau', note: 'Généré dynamiquement en mémoire par le kernel' },
      { id: 'p7', left: '/sys', right: 'Arborescence sysfs des périphériques et pilotes du noyau', note: 'Vue unifiée du modèle de pilotes du noyau Linux' }
    ]
  },
  {
    id: 'match-3',
    title: 'Codes de sortie standards (Exit Codes Bash & POSIX)',
    titleFr: 'Codes de sortie standards (Exit Codes Bash & POSIX)',
    certification: 'lpic-1',
    topicNumber: 105,
    objectiveId: '105.2',
    category: 'Shell Scripting',
    description: 'Associez chaque valeur de code retour $? à sa signification conventionnelle sous Linux.',
    descriptionFr: 'Associez chaque valeur de code retour $? à sa signification conventionnelle sous Linux.',
    pairs: [
      { id: 'p1', left: '0', right: 'Succès complet (Success / No error)', note: 'Exécution terminée sans aucune anomalie' },
      { id: 'p2', left: '1', right: 'Erreur générale ou non spécifiée', note: 'Échec standard d\'une commande' },
      { id: 'p3', left: '2', right: 'Mauvais usage d\'un mot-clé ou d\'une option shell', note: 'Erreur de syntaxe dans les arguments' },
      { id: 'p4', left: '126', right: 'La commande trouvée n\'est pas exécutable (Permission denied)', note: 'Fichier sans bit +x' },
      { id: 'p5', left: '127', right: 'Commande non trouvée (Command not found)', note: 'Introuvable dans le PATH' },
      { id: 'p6', left: '130', right: 'Processus interrompu par Ctrl+C (SIGINT = 128 + 2)', note: 'Convention 128 + numéro de signal' }
    ]
  },
  {
    id: 'match-4',
    title: 'Ports réseau standards LPI & Protocoles',
    titleFr: 'Ports réseau standards LPI & Protocoles',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.1',
    category: 'Networking Fundamentals',
    description: 'Associez chaque numéro de port TCP/UDP standard à son service réseau.',
    descriptionFr: 'Associez chaque numéro de port TCP/UDP standard à son service réseau.',
    pairs: [
      { id: 'p1', left: 'Port 22 TCP', right: 'SSH (Secure Shell) & SFTP', note: 'Connexion distante chiffrée' },
      { id: 'p2', left: 'Port 25 TCP', right: 'SMTP (Transfert de courriers)', note: 'Mail Transfer Agent (Postfix/Sendmail)' },
      { id: 'p3', left: 'Port 53 UDP/TCP', right: 'DNS (Domain Name System)', note: 'Résolution de noms d\'hôtes' },
      { id: 'p4', left: 'Port 123 UDP', right: 'NTP (Network Time Protocol)', note: 'Synchronisation temporelle de l\'horloge' },
      { id: 'p5', left: 'Port 389 TCP', right: 'LDAP (Annuaire réseau)', note: 'Authentification centralisée' },
      { id: 'p6', left: 'Port 443 TCP', right: 'HTTPS (Web sécurisé TLS/SSL)', note: 'Trafic HTTP chiffré' }
    ]
  }
];

// =========================================================================
// 5. MODULE « SCÉNARIOS PRATIQUES GUIDÉS » (Mini-Labs Pas à Pas)
// =========================================================================

export const guidedLabScenarios: GuidedLabScenario[] = [
  {
    id: 'lab-1',
    title: 'Création d\'un espace collaboratif avec SGID et groupe dédié',
    titleFr: 'Création d\'un espace collaboratif avec SGID et groupe dédié',
    certification: 'lpic-1',
    topicNumber: 107,
    objectiveId: '107.1',
    category: 'User & Permissions Administration',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    goal: 'Créer un groupe "developers", créer un utilisateur "alice" affecté à ce groupe, créer un dossier partagé /opt/project avec le bit SGID pour que tous les nouveaux fichiers héritent automatiquement du groupe developers.',
    goalFr: 'Créer un groupe "developers", créer un utilisateur "alice" affecté à ce groupe, créer un dossier partagé /opt/project avec le bit SGID pour que tous les nouveaux fichiers héritent automatiquement du groupe developers.',
    context: 'L\'équipe de développement a besoin d\'un dossier commun où chaque fichier créé par un membre est immédiatement modifiable par les autres membres du groupe.',
    contextFr: 'L\'équipe de développement a besoin d\'un dossier commun où chaque fichier créé par un membre est immédiatement modifiable par les autres membres du groupe.',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Créer le groupe système "developers"',
        titleFr: 'Créer le groupe système "developers"',
        instruction: 'Exécutez la commande pour créer le nouveau groupe nommé "developers".',
        instructionFr: 'Exécutez la commande pour créer le nouveau groupe nommé "developers".',
        hint: 'groupadd developers',
        hintFr: 'groupadd developers',
        expectedCommands: ['groupadd developers', 'sudo groupadd developers'],
        simulatedOutput: '[OK] Groupe "developers" créé avec succès (GID 1005).',
        explanation: 'groupadd developers ajoute une entrée dans /etc/group et /etc/gshadow.',
        explanationFr: 'groupadd developers ajoute une entrée dans /etc/group et /etc/gshadow.'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Créer l\'utilisateur "alice" avec son groupe secondaire',
        titleFr: 'Créer l\'utilisateur "alice" avec son groupe secondaire',
        instruction: 'Créez le compte "alice" avec son répertoire personnel (-m) et affectez-lui "developers" en groupe secondaire (-G).',
        instructionFr: 'Créez le compte "alice" avec son répertoire personnel (-m) et affectez-lui "developers" en groupe secondaire (-G).',
        hint: 'useradd -m -G developers alice',
        hintFr: 'useradd -m -G developers alice',
        expectedCommands: [
          'useradd -m -G developers alice',
          'useradd -m -g developers alice',
          'sudo useradd -m -G developers alice'
        ],
        simulatedOutput: '[OK] Utilisateur alice créé (UID 1002, GID 1002, groupes: developers). Répertoire /home/alice initialisé.',
        explanation: 'L\'option -m crée le home dir à partir de /etc/skel, et -G ajoute le groupe secondaire.',
        explanationFr: 'L\'option -m crée le home dir à partir de /etc/skel, et -G ajoute le groupe secondaire.'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Créer le dossier et attribuer la propriété de groupe',
        titleFr: 'Créer le dossier et attribuer la propriété de groupe',
        instruction: 'Créez le répertoire /opt/project et attribuez son groupe propriétaire à "developers" avec chgrp.',
        instructionFr: 'Créez le répertoire /opt/project et attribuez son groupe propriétaire à "developers" avec chgrp.',
        hint: 'chgrp developers /opt/project (ou chown :developers /opt/project)',
        hintFr: 'chgrp developers /opt/project (ou chown :developers /opt/project)',
        expectedCommands: [
          'chgrp developers /opt/project',
          'chown :developers /opt/project',
          'sudo chgrp developers /opt/project',
          'sudo chown :developers /opt/project'
        ],
        simulatedOutput: '[OK] Propriété mise à jour : drwxr-xr-x 2 root developers 4096 Sep 08 09:15 /opt/project',
        explanation: 'chgrp developers /opt/project affecte le groupe developers au dossier.',
        explanationFr: 'chgrp developers /opt/project affecte le groupe developers au dossier.'
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Activer le bit SGID et les droits d\'écriture groupe',
        titleFr: 'Activer le bit SGID et les droits d\'écriture groupe',
        instruction: 'Configurez les permissions avec chmod pour ajouter le bit SGID (2) et les droits rwx pour le propriétaire et le groupe (chmod 2775 /opt/project ou chmod g+s,g+w /opt/project).',
        instructionFr: 'Configurez les permissions avec chmod pour ajouter le bit SGID (2) et les droits rwx pour le propriétaire et le groupe (chmod 2775 /opt/project ou chmod g+s,g+w /opt/project).',
        hint: 'chmod 2775 /opt/project ou chmod g+s /opt/project',
        hintFr: 'chmod 2775 /opt/project ou chmod g+s /opt/project',
        expectedCommands: [
          'chmod 2775 /opt/project',
          'chmod 2770 /opt/project',
          'chmod g+s /opt/project',
          'sudo chmod 2775 /opt/project',
          'sudo chmod g+s /opt/project'
        ],
        simulatedOutput: '[OK] Permissions appliquées : drwxrwsr-x 2 root developers 4096 /opt/project (SGID activé).',
        explanation: 'Le bit SGID (2 en octal ou g+s) sur un répertoire garantit que tout fichier ou sous-dossier créé héritera automatiquement du groupe propriétaire (developers) au lieu du groupe primaire de l\'auteur.',
        explanationFr: 'Le bit SGID (2 en octal ou g+s) sur un répertoire garantit que tout fichier ou sous-dossier créé héritera automatiquement du groupe propriétaire (developers) au lieu du groupe primaire de l\'auteur.'
      }
    ]
  },
  {
    id: 'lab-2',
    title: 'Diagnostic et réparation d\'un système en mode secours (Rescue)',
    titleFr: 'Diagnostic et réparation d\'un système en mode secours (Rescue)',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.3',
    category: 'System Recovery & Mounts',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    goal: 'Remonter la racine / en lecture-écriture depuis le shell d\'urgence, vérifier l\'intégrité des disques et régénérer la table des cibles systemd.',
    goalFr: 'Remonter la racine / en lecture-écriture depuis le shell d\'urgence, vérifier l\'intégrité des disques et régénérer la table des cibles systemd.',
    context: 'Le serveur a démarré en mode emergency/rescue avec une partition racine montée en lecture seule (ro) à cause d\'une incohérence détectée.',
    contextFr: 'Le serveur a démarré en mode emergency/rescue avec une partition racine montée en lecture seule (ro) à cause d\'une incohérence détectée.',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Remonter la racine en lecture-écriture (rw)',
        titleFr: 'Remonter la racine en lecture-écriture (rw)',
        instruction: 'Exécutez la commande mount avec l\'option nécessaire pour basculer le système de fichiers racine / en écriture.',
        instructionFr: 'Exécutez la commande mount avec l\'option nécessaire pour basculer le système de fichiers racine / en écriture.',
        hint: 'mount -o remount,rw /',
        hintFr: 'mount -o remount,rw /',
        expectedCommands: [
          'mount -o remount,rw /',
          'mount -o remount,rw /dev/sda1 /',
          'sudo mount -o remount,rw /'
        ],
        simulatedOutput: '[OK] Système de fichiers / remonté avec options (rw,relatime).',
        explanation: 'L\'option "-o remount,rw" permet de réactiver l\'écriture sur un filesystem actif sans devoir le démonter.',
        explanationFr: 'L\'option "-o remount,rw" permet de réactiver l\'écriture sur un filesystem actif sans devoir le démonter.'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Afficher les UUID de tous les périphériques blocs',
        titleFr: 'Afficher les UUID de tous les périphériques blocs',
        instruction: 'Exécutez la commande standard pour lister les UUID de toutes les partitions disques présentes.',
        instructionFr: 'Exécutez la commande standard pour lister les UUID de toutes les partitions disques présentes.',
        hint: 'blkid',
        hintFr: 'blkid',
        expectedCommands: ['blkid', '/sbin/blkid', 'lsblk -f', 'sudo blkid'],
        simulatedOutput: `/dev/sda1: UUID="7c92b8d0-e11a-4299" TYPE="ext4"
/dev/sda2: UUID="f10a88c2-33dd-49a1" TYPE="swap"
/dev/sdb1: UUID="39a2ef44-bb12-4011" TYPE="ext4"`,
        explanation: 'blkid interroge la bibliothèque libblkid pour afficher les attributs (UUID, TYPE, LABEL) des disques blocs.',
        explanationFr: 'blkid interroge la bibliothèque libblkid pour afficher les attributs (UUID, TYPE, LABEL) des disques blocs.'
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Recharger la configuration systemd du gestionnaire',
        titleFr: 'Recharger la configuration systemd du gestionnaire',
        instruction: 'Après avoir corrigé /etc/fstab, demandez à systemd de recharger l\'ensemble de ses générateurs d\'unités sans redémarrer.',
        instructionFr: 'Après avoir corrigé /etc/fstab, demandez à systemd de recharger l\'ensemble de ses générateurs d\'unités sans redémarrer.',
        hint: 'systemctl daemon-reload',
        hintFr: 'systemctl daemon-reload',
        expectedCommands: ['systemctl daemon-reload', 'sudo systemctl daemon-reload'],
        simulatedOutput: '[OK] Générateurs réexécutés et configuration systemd rechargée avec succès.',
        explanation: 'systemctl daemon-reload relit /etc/fstab et recrée les unités .mount associées.',
        explanationFr: 'systemctl daemon-reload relit /etc/fstab et recrée les unités .mount associées.'
      }
    ]
  }
];
