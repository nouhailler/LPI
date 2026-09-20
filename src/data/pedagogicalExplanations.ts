export type PedagogicalMode = 'simple' | 'beginner' | 'example' | 'quiz' | 'trap';

export interface PedagogicalQuiz {
  question: string;
  questionFr?: string;
  options: string[];
  optionsFr?: string[];
  correctIndex: number;
  explanation: string;
  explanationFr?: string;
}

export interface PedagogicalTopic {
  id: string;
  title: string;
  titleFr: string;
  category: string;
  categoryFr: string;
  tags: string[];
  summary: string;
  summaryFr: string;
  simple: {
    en: string;
    fr: string;
    keyPointsEn: string[];
    keyPointsFr: string[];
  };
  beginner: {
    en: string;
    fr: string;
    analogyTitleEn: string;
    analogyTitleFr: string;
    analogyStoryEn: string;
    analogyStoryFr: string;
  };
  example: {
    en: string;
    fr: string;
    terminalSnippet: string;
    commandExplanationEn: string;
    commandExplanationFr: string;
    interactiveSteps?: Array<{
      step: number;
      actionEn: string;
      actionFr: string;
      command: string;
      result: string;
    }>;
  };
  quiz: PedagogicalQuiz;
  trap: {
    en: string;
    fr: string;
    trapTitleEn: string;
    trapTitleFr: string;
    dangerLevel: 'high' | 'medium' | 'critical';
    distractorExamEn: string;
    distractorExamFr: string;
    howToAvoidEn: string;
    howToAvoidFr: string;
  };
}

export const PEDAGOGICAL_TOPICS: PedagogicalTopic[] = [
  {
    id: 'umask',
    title: 'umask (User File-Creation Mask)',
    titleFr: 'umask (Masque de création de fichiers)',
    category: 'Permissions & Security',
    categoryFr: 'Permissions & Sécurité',
    tags: ['umask', 'chmod', 'permissions', 'octal', 'security', 'lpic1-104'],
    summary: 'Controls the default permissions assigned to newly created files and directories.',
    summaryFr: 'Contrôle les permissions par défaut attribuées aux nouveaux fichiers et répertoires créés sous Linux.',
    simple: {
      en: 'The umask (user mask) specifies which permission bits are automatically stripped (masked out) when a new file or directory is created.\n\n• Default maximum for files: 666 (rw-rw-rw-). The Linux kernel NEVER grants execute (+x) permission to newly created regular files for security.\n• Default maximum for directories: 777 (rwxrwxrwx). Directories must have execute (+x) permission so users can enter (traverse) them with cd.\n• Typical umask: 022 (gives 644 for files and 755 for directories) or 002 (in user private group setups).\n• Command `umask` with no arguments prints the current mask; `umask -S` prints it in symbolic form.',
      fr: 'Le umask (user mask) est un masque octal qui spécifie les bits de permissions qui sont AUTOMATIQUEMENT RETIRÉS (masqués) lors de la création d\'un nouveau fichier ou répertoire.\n\n• Base maximale pour un fichier : 666 (rw-rw-rw-). Par mesure de sécurité, le noyau Linux n\'accorde JAMAIS le droit d\'exécution (+x) par défaut à un fichier régulier.\n• Base maximale pour un répertoire : 777 (rwxrwxrwx). L\'exécution (+x) est obligatoire pour pouvoir entrer (traverser) un dossier avec cd.\n• Umask classique : 022 (produit des fichiers en 644 et des répertoires en 755).\n• La commande `umask` seule affiche le masque courant ; `umask -S` l\'affiche en format symbolique lisible.',
      keyPointsEn: [
        'Subtracts or masks permissions at file birth (it never grants rights).',
        'Files start from 666; directories start from 777.',
        'umask 022 => Files: 644 (rw-r--r--), Dirs: 755 (rwxr-xr-x).',
        'umask 077 => Files: 600 (rw-------), Dirs: 700 (rwx------).',
        'umask -S displays permissions retained (e.g. u=rwx,g=rx,o=rx).',
      ],
      keyPointsFr: [
        'Soustrait/masque les permissions à la naissance du fichier (ne donne jamais de droits).',
        'Base fichiers ordinaires = 666 ; Base répertoires = 777.',
        'umask 022 => Fichiers : 644 (rw-r--r--), Dossiers : 755 (rwxr-xr-x).',
        'umask 077 => Fichiers : 600 (rw-------), Dossiers : 700 (rwx------).',
        'umask -S affiche les droits conservés sous forme symbolique (ex: u=rwx,g=rx,o=rx).',
      ],
    },
    beginner: {
      en: 'Think of permissions like a block of clay, and umask like a cookie cutter or stencil.\n\nWhen a new file is born, Linux prepares a complete slab of permissions (666 for files, 777 for folders). But before placing it on the disk, Linux applies your umask stencil: any number in the umask acts like a hole punch that REMOVES those permissions.\n\n• 0 means "remove nothing" (keep all rights for that category).\n• 2 means "remove write permission" (no one can edit).\n• 7 means "remove all permissions" (read, write, execute all gone!).\n\nSo with umask 022: Owner loses 0 (keeps rw), Group loses 2 (keeps r), Others lose 2 (keep r). Result: rw-r--r-- (644)!',
      fr: 'Imagine que les permissions sont une feuille de papier blanche et que le umask est un POCHOIR.\n\nQuand un nouveau fichier naît, Linux prépare toutes les autorisations possibles (666 pour les fichiers, 777 pour les dossiers). Mais avant de poser le fichier sur le disque, Linux pose le pochoir umask par-dessus : chaque chiffre du umask masque et RETIRE des droits.\n\n• Un 0 signifie "ne rien retirer" (laisser tous les droits autorisés).\n• Un 2 signifie "retirer le droit d\'écriture" (personne ne peut modifier).\n• Un 7 (4+2+1) signifie "retirer TOUT" (ni lecture, ni écriture, ni exécution) !\n\nAvec un umask de 022 :\n- Le propriétaire a 0 retiré => il garde lecture + écriture (rw- = 6).\n- Le groupe a 2 retiré => écriture enlevée, il ne garde que la lecture (r-- = 4).\n- Les autres ont 2 retiré => écriture enlevée, ils ne gardent que la lecture (r-- = 4).\nRésultat automatique : 644 (rw-r--r--) !',
      analogyTitleEn: 'The Security Cookie-Cutter (Negative Permissions)',
      analogyTitleFr: 'Le pochoir de peinture ou le réducteur de droits à la naissance',
      analogyStoryEn: 'Unlike chmod which sets what permissions an existing file HAS, umask decides what permissions a newborn file CANNOT have. It acts as an automatic filter for every single command like touch, mkdir, cp, or tar.',
      analogyStoryFr: 'Contrairement à chmod qui donne des droits à un fichier qui existe déjà, le umask décide de ce qu\'un fichier N\'AURA PAS à sa naissance. C\'est un filtre automatique permanent pour les commandes touch, mkdir, redirection >>, etc.',
    },
    example: {
      en: 'Real-world terminal demonstration comparing files and directories with different masks.',
      fr: 'Démonstration réelle sur terminal bash comparant la création de fichiers et dossiers avec différents masques.',
      terminalSnippet: `# 1. Afficher le umask actuel
$ umask
0022

# 2. Créer un fichier ordinaire et inspecter les droits
$ touch notes.txt && ls -l notes.txt
-rw-r--r-- 1 tux tux 0 Sep 19 12:00 notes.txt
# Calcul : Base 666 - 022 = 644 (rw- pour vous, r-- pour le reste)

# 3. Créer un dossier et inspecter les droits
$ mkdir archives && ls -ld archives
drwxr-xr-x 2 tux tux 4096 Sep 19 12:00 archives
# Calcul : Base 777 - 022 = 755 (le bit d'exécution x est préservé pour traverser le dossier)

# 4. Définir un umask ultra-confidentiel pour des données sensibles
$ umask 077
$ touch confidential.key && ls -l confidential.key
-rw------- 1 tux tux 0 Sep 19 12:01 confidential.key
# Calcul : Base 666 - 077 = 600 (Seul vous avez accès en lecture/écriture !)

# 5. Afficher la notation symbolique (très fréquent à l'examen)
$ umask -S
u=rwx,g=,o=`,
      commandExplanationEn: 'The example demonstrates how umask 022 produces 644 for files and 755 for directories, whereas umask 077 guarantees privacy by producing 600 for files and 700 for directories.',
      commandExplanationFr: 'L\'exemple montre comment umask 022 produit du 644 pour les fichiers et 755 pour les dossiers, tandis que umask 077 garantit la confidentialité absolue en produisant du 600 pour les fichiers et 700 pour les répertoires.',
      interactiveSteps: [
        { step: 1, actionEn: 'Check current mask', actionFr: 'Vérifier le masque actuel', command: 'umask', result: '0022' },
        { step: 2, actionEn: 'Create file', actionFr: 'Créer un fichier', command: 'touch report.txt', result: 'Created report.txt with -rw-r--r-- (644)' },
        { step: 3, actionEn: 'Create folder', actionFr: 'Créer un dossier', command: 'mkdir projects', result: 'Created projects/ with drwxr-xr-x (755)' },
        { step: 4, actionEn: 'Apply restrictive mask', actionFr: 'Appliquer un masque restrictif', command: 'umask 0027', result: 'New files will be -rw-r----- (640)' },
      ],
    },
    quiz: {
      question: 'With a umask set to 027, what will be the octal permissions of a regular file created with `touch document.txt`?',
      questionFr: 'Avec un umask configuré à 027, quelles seront les permissions octales d\'un fichier ordinaire créé par la commande `touch document.txt` ?',
      options: [
        '750 (-rwxr-x---)',
        '640 (-rw-r-----)',
        '650 (-rw-r-x---)',
        '644 (-rw-r--r--)',
      ],
      optionsFr: [
        '750 (-rwxr-x---)',
        '640 (-rw-r-----)',
        '650 (-rw-r-x---)',
        '644 (-rw-r--r--)',
      ],
      correctIndex: 1,
      explanation: 'For regular files, the base maximum is 666 (never 777!). Applying umask 027 means: Owner keeps 6 (rw-), Group loses write (6 - 2 = 4, r--), Others lose all (6 - 6 or 6 & ~7 = 0, ---). Result: 640 (-rw-r-----).',
      explanationFr: 'Pour un fichier ordinaire, la base de création maximale est TOUJOURS 666 (jamais 777 !). Avec un umask de 027 : le propriétaire conserve 6 (rw-), le groupe perd l\'écriture (6 - 2 = 4, r--), et les autres perdent tout (6 & ~7 = 0, ---). Le résultat exact est donc 640 (-rw-r-----).',
    },
    trap: {
      en: 'The #1 LPIC Exam Trap on umask is assuming regular files start from 777.\n\nExam questions will deliberately offer "755" or "750" as traps when asking about creating a file with `touch` or `echo`. In reality, Linux NEVER gives execute (+x) permission to regular files upon creation. Even with `umask 000`, a regular file created with `touch` will be 666, NEVER 777!\n\nSecond trap: Arithmetic subtraction vs Bitwise AND NOT. If you have an odd umask like 035, arithmetic 666 - 035 = 631 is WRONG! Bitwise logic (666 & ~035) yields 642. Linux masks bits, it doesn\'t subtract integers.',
      fr: 'Le piège n°1 aux examens LPIC : Croire qu\'un fichier régulier part d\'une base de 777.\n\nLes questions de certification proposent quasi-systématiquement des réponses comme "750" ou "755" pour vous faire tomber dans le piège lors de la création d\'un fichier avec `touch`. En réalité, Linux ne donne JAMAIS le droit d\'exécution (+x) par défaut à un fichier ordinaire ! Même avec un `umask 000`, un fichier créé par `touch` sera en 666 et JAMAIS en 777.\n\nSecond piège : La soustraction simple vs le ET binaire inversé. Avec un umask contenant des chiffres impairs (comme 027 ou 035), une soustraction arithmétique donne un résultat faux (666 - 027 = 639 ? Non, 9 n\'existe pas en octal !). En binaire : 6 (110) masqué par 7 (111) donne 0. D\'où 640 !',
      trapTitleEn: 'The 777 File Illusion & Binary Masking Traps',
      trapTitleFr: 'Le mythe du 777 sur les fichiers & le piège du calcul binaire',
      dangerLevel: 'critical',
      distractorExamEn: 'Choosing 750 instead of 640 when asked about `touch file` under umask 027.',
      distractorExamFr: 'Choisir 750 au lieu de 640 lors de la création d\'un fichier avec umask 027.',
      howToAvoidEn: 'Always write down 666 for files and 777 for folders FIRST, before applying the umask digit by digit.',
      howToAvoidFr: 'Écrivez TOUJOURS d\'abord 666 pour les fichiers et 777 pour les répertoires avant de masquer chiffre par chiffre.',
    },
  },
  {
    id: 'chmod-octal',
    title: 'chmod & Octal Permissions',
    titleFr: 'chmod & Permissions Octales (rwx)',
    category: 'Permissions & Security',
    categoryFr: 'Permissions & Sécurité',
    tags: ['chmod', 'permissions', 'octal', 'rwx', 'lpic1-104'],
    summary: 'Change file mode bits using numeric octal notation (4=r, 2=w, 1=x).',
    summaryFr: 'Modifier les bits de permission d\'un fichier à l\'aide de la notation octale numérique (4=r, 2=w, 1=x).',
    simple: {
      en: 'chmod modifies read (r=4), write (w=2), and execute (x=1) permissions for three categories: User (owner), Group, and Others.\n\n• 4 = Read (r)\n• 2 = Write (w)\n• 1 = Execute (x)\n• Combine values by adding: 7 = rwx (4+2+1), 6 = rw- (4+2), 5 = r-x (4+1), 4 = r-- (4).\n• Example: `chmod 755 script.sh` gives rwxr-xr-x.',
      fr: 'chmod modifie les droits de lecture (r=4), écriture (w=2) et exécution (x=1) pour trois entités : Propriétaire (u), Groupe (g) et Autres (o).\n\n• 4 = Lecture (r)\n• 2 = Écriture (w)\n• 1 = Exécution (x)\n• On additionne les valeurs : 7 = rwx (4+2+1), 6 = rw- (4+2), 5 = r-x (4+1), 4 = r-- (4).\n• Exemple : `chmod 755 script.sh` accorde rwxr-xr-x.',
      keyPointsEn: [
        'r=4, w=2, x=1.',
        'Positions: 1st digit = Owner, 2nd digit = Group, 3rd digit = Others.',
        'chmod -R applies recursively to files and subdirectories.',
        'Symbolic syntax: chmod u+x,g-w,o=r file.',
      ],
      keyPointsFr: [
        'r=4, w=2, x=1.',
        'Ordre des chiffres : 1er = Propriétaire, 2e = Groupe, 3e = Autres.',
        'L\'option -R applique les permissions récursivement à tout le dossier.',
        'Syntaxe symbolique : chmod u+x,g-w,o=r fichier.',
      ],
    },
    beginner: {
      en: 'Think of permissions as three separate locks on a door: one lock for the owner, one for family members (group), and one for visitors (others).\n\nEach lock has 3 switches: [Read] (worth 4 points), [Write] (worth 2 points), and [Execute] (worth 1 point).\n\nIf you want the owner to have all 3 keys: 4 + 2 + 1 = 7.\nIf you want the group to only read and run: 4 + 1 = 5.\nIf you want visitors to only read and run: 4 + 1 = 5.\nYour code is 755!',
      fr: 'Imagine une boîte sécurisée avec trois cadenas différents : un pour le propriétaire, un pour l\'équipe (groupe), et un pour les visiteurs extérieurs.\n\nChaque cadenas a 3 boutons :\n• Bouton "Lire" = 4 points\n• Bouton "Modifier" = 2 points\n• Bouton "Lancer/Exécuter" = 1 point\n\nTu veux donner au propriétaire le droit de tout faire ? 4 + 2 + 1 = 7.\nTu veux que l\'équipe puisse seulement lire et lancer le programme ? 4 + 1 = 5.\nTu veux que les visiteurs extérieurs puissent seulement lire ? 4.\nLe code magique à entrer est : chmod 754 mon_programme !',
      analogyTitleEn: 'The Three-Lock Safe Box with Point Values',
      analogyTitleFr: 'Le coffre-fort à 3 serrures et addition de points',
      analogyStoryEn: 'Because 4, 2, and 1 are powers of 2 (binary 100, 010, 001), any combination of them produces a completely unique number from 0 to 7.',
      analogyStoryFr: 'Parce que 4, 2 et 1 sont des puissances de 2 (binaire 100, 010, 001), chaque somme donne un chiffre unique entre 0 et 7 sans aucune ambiguïté.',
    },
    example: {
      en: 'Setting execution rights on a script and locking down private keys.',
      fr: 'Rendre un script bash exécutable et sécuriser une clé privée SSH.',
      terminalSnippet: `# Rendre un script exécutable pour tout le monde
$ chmod 755 deploy.sh
$ ls -l deploy.sh
-rwxr-xr-x 1 tux tux 1024 Sep 19 12:00 deploy.sh

# Verrouiller une clé SSH privée (lecture/écriture seul pour l'utilisateur)
$ chmod 600 ~/.ssh/id_ed25519
$ ls -l ~/.ssh/id_ed25519
-rw------- 1 tux tux 419 Sep 19 12:01 /home/tux/.ssh/id_ed25519

# Changer récursivement les permissions d'un site web
$ chmod -R 755 /var/www/html/`,
      commandExplanationEn: 'Demonstrates 755 for executables and 600 for strictly confidential files like SSH private keys.',
      commandExplanationFr: 'Montre l\'utilisation de 755 pour les scripts exécutables et 600 pour les clés privées SSH confidentielles.',
    },
    quiz: {
      question: 'Which chmod command assigns read and write to the owner, read-only to group, and no permissions to others?',
      questionFr: 'Quelle commande chmod attribue lecture et écriture au propriétaire, lecture seule au groupe, et aucun droit aux autres ?',
      options: ['chmod 640 fichier', 'chmod 740 fichier', 'chmod 644 fichier', 'chmod 620 fichier'],
      optionsFr: ['chmod 640 fichier', 'chmod 740 fichier', 'chmod 644 fichier', 'chmod 620 fichier'],
      correctIndex: 0,
      explanation: 'Owner: rw- = 4+2 = 6. Group: r-- = 4. Others: --- = 0. Total: 640.',
      explanationFr: 'Propriétaire : rw- = 4+2 = 6. Groupe : r-- = 4. Autres : --- = 0. Total : 640.',
    },
    trap: {
      en: 'Difference between "w" on a directory vs "w" on a file. Having write permission on a file allows editing its contents. Having write permission on the DIRECTORY allows DELETING the file, even if the file itself has permissions 000 and is owned by someone else!',
      fr: 'La différence cruciale entre le droit "w" (écriture) sur un fichier et sur un répertoire !\nAvoir le droit d\'écriture sur un fichier permet de modifier son contenu. Mais avoir le droit d\'écriture sur le RÉPERTOIRE parent permet de SUPPRIMER le fichier, même si le fichier appartient à root et a des permissions 000 ! C\'est pour cela que le Sticky Bit existe sur /tmp.',
      trapTitleEn: 'Directory Write vs File Write & Deletion Trap',
      trapTitleFr: 'Écriture sur fichier vs écriture sur répertoire (droit de suppression)',
      dangerLevel: 'high',
      distractorExamEn: 'Thinking you need write permission on a file to delete it (you need write on its directory!).',
      distractorExamFr: 'Penser qu\'il faut le droit d\'écriture sur un fichier pour le supprimer (il faut en fait l\'écriture sur le dossier parent !).',
      howToAvoidEn: 'Remember: file creation and deletion are modifications of the directory table, not the file itself.',
      howToAvoidFr: 'Rappelez-vous : créer ou effacer un fichier modifie l\'index du répertoire parent, pas l\'inode du fichier.',
    },
  },
  {
    id: 'hard-vs-soft-links',
    title: 'Hard Links vs Symbolic Links (ln vs ln -s)',
    titleFr: 'Liens Physiques vs Liens Symboliques (ln vs ln -s)',
    category: 'Filesystem Architecture',
    categoryFr: 'Système de Fichiers & Inodes',
    tags: ['ln', 'symlink', 'hardlink', 'inode', 'filesystem', 'lpic1-104'],
    summary: 'Understand the difference between hard links (same inode) and soft/symlinks (pointer files).',
    summaryFr: 'Comprendre la différence fondamentale entre les liens physiques (même inode) et les liens symboliques (fichiers pointeurs).',
    simple: {
      en: 'A hard link is an additional directory entry pointing directly to an existing inode number on the SAME filesystem. A symbolic (soft) link is a distinct file containing the path string to another target.\n\n• Hard link (`ln file link`): Shares the exact same inode. If the original filename is deleted, the data remains accessible via the hard link. CANNOT cross filesystems and CANNOT link directories.\n• Soft link (`ln -s target link`): Has its own inode and type "l". Can cross filesystems and point to directories. If target is deleted, it becomes a "broken link" (dangling pointer).',
      fr: 'Un lien physique (hard link) est un nom supplémentaire qui pointe directement vers le même numéro d\'inode sur le MÊME système de fichiers. Un lien symbolique (soft link) est un fichier distinct contenant le chemin vers une cible.\n\n• Lien physique (`ln cible lien`) : Partage exactement le même inode. Si le fichier original est supprimé, les données restent accessibles via le lien physique ! NE PEUT PAS traverser les systèmes de fichiers et NE PEUT PAS pointer vers un dossier.\n• Lien symbolique (`ln -s cible lien`) : Possède son propre inode. Peut traverser les disques/partitions et pointer vers des dossiers. Si la cible est supprimée, le lien devient "cassé" (orphelin).',
      keyPointsEn: [
        'Hard link shares same inode; soft link has its own inode.',
        'Hard link cannot cross filesystems; soft link can cross any mount point.',
        'Hard link cannot point to directories (except for . and .. created by kernel).',
        'Deleting target breaks symlink, but hard link keeps data until link count = 0.',
      ],
      keyPointsFr: [
        'Le lien physique partage le même inode ; le lien symbolique a son propre inode.',
        'Le lien physique ne peut JAMAIS traverser deux partitions/disques différents.',
        'Le lien physique ne peut PAS pointer vers un répertoire.',
        'Supprimer la cible casse le lien symbolique, mais ne détruit pas les données du lien physique.',
      ],
    },
    beginner: {
      en: 'Imagine a house (the file data on disk) with an address (the inode number):\n\n• A HARD LINK is like putting a second doorbell and house number on the back door of the SAME house. Both doors lead to the exact same rooms. If you paint the wall through one door, it is painted for both. If you board up the front door, you can still live in the house through the back door!\n\n• A SYMBOLIC LINK (ln -s) is like a post-it note on your office desk saying: "Go to 42 Wallaby Way". If someone demolishes the house at 42 Wallaby Way, the post-it still exists, but if you follow it, there is nothing left (broken link)!',
      fr: 'Imagine une maison (les données sur le disque dur) identifiée par son numéro cadastral (l\'inode) :\n\n• Un LIEN PHYSIQUE (hard link), c\'est comme créer une deuxième porte d\'entrée pour la MÊME maison. Les deux portes donnent dans le même salon. Si tu peins le mur en bleu en entrant par la porte A, il est bleu quand tu entres par la porte B. Si tu mures la porte A, la maison existe toujours et reste accessible par la porte B !\n\n• Un LIEN SYMBOLIQUE (ln -s), c\'est comme un panneau indicateur ou un raccourci Windows qui dit : "La maison se trouve au bout de cette rue". Si la maison est détruite, le panneau reste là, mais il pointe dans le vide (lien cassé) !',
      analogyTitleEn: 'Two Doors to One House vs A Signpost on the Road',
      analogyTitleFr: 'Deux portes pour la même maison vs un panneau indicateur',
      analogyStoryEn: 'Linux deletes file data only when the link count reaches ZERO and no process has it open.',
      analogyStoryFr: 'Linux ne détruit réellement les données sur le disque dur que lorsque le compteur de liens physiques tombe à ZÉRO.',
    },
    example: {
      en: 'Creating both link types and inspecting inodes with ls -i.',
      fr: 'Créer les deux types de liens et vérifier les numéros d\'inodes avec ls -i.',
      terminalSnippet: `# Créer un fichier de test
$ echo "Linux rocks" > original.txt

# 1. Créer un lien physique (même inode)
$ ln original.txt hardlink.txt

# 2. Créer un lien symbolique (inode distinct, type 'l')
$ ln -s original.txt symlink.txt

# Inspecter les inodes avec l'option -i
$ ls -li original.txt hardlink.txt symlink.txt
1234567 -rw-r--r-- 2 tux tux 12 Sep 19 12:00 hardlink.txt
1234567 -rw-r--r-- 2 tux tux 12 Sep 19 12:00 original.txt
9876543 lrwxrwxrwx 1 tux tux 12 Sep 19 12:00 symlink.txt -> original.txt

# Supprimer l'original
$ rm original.txt
$ cat hardlink.txt
Linux rocks        # FONCTIONNE TOUJOURS !

$ cat symlink.txt
cat: symlink.txt: No such file or directory  # LIEN CASSÉ !`,
      commandExplanationEn: 'Notice that original.txt and hardlink.txt share inode 1234567, while symlink.txt has inode 9876543 and breaks when original is removed.',
      commandExplanationFr: 'Remarquez que original.txt et hardlink.txt partagent le même numéro d\'inode 1234567, alors que symlink.txt a son propre inode et devient inutilisable dès que l\'original est supprimé.',
    },
    quiz: {
      question: 'Which of the following is TRUE regarding hard links in Linux?',
      questionFr: 'Laquelle des affirmations suivantes est VRAIE concernant les liens physiques (hard links) sous Linux ?',
      options: [
        'They can link directories without restrictions',
        'They share the exact same inode number as the target file',
        'They can point to files on separate disk partitions (different filesystems)',
        'Deleting the original file immediately corrupts the hard link',
      ],
      optionsFr: [
        'Ils peuvent pointer vers des répertoires sans restriction',
        'Ils partagent exactement le même numéro d\'inode que le fichier cible',
        'Ils peuvent pointer vers un fichier situé sur une autre partition de disque',
        'Supprimer le fichier original corrompt immédiatement le lien physique',
      ],
      correctIndex: 1,
      explanation: 'Hard links share the same inode number. They cannot span filesystems or link directories.',
      explanationFr: 'Les liens physiques partagent le même numéro d\'inode. Ils ne peuvent ni traverser des systèmes de fichiers différents, ni pointer vers des répertoires.',
    },
    trap: {
      en: 'Exam Trap 1: Can you create a hard link across filesystems? NO! Because inode numbers are only unique per filesystem. Partition /dev/sda1 and /dev/sdb1 both have an inode 42, but they represent totally different files!\nExam Trap 2: Can a regular user create hard links to directories? NO! To prevent directory loops/cycles.',
      fr: 'Piège LPIC 1 : Peut-on créer un lien physique entre deux partitions (/ et /home séparés) ? NON ! Car les numéros d\'inodes ne sont uniques qu\'au sein d\'une même partition.\nPiège LPIC 2 : Peut-on faire un lien physique sur un répertoire ? NON ! Cela créerait des boucles infinies dans l\'arborescence.',
      trapTitleEn: 'Cross-Filesystem & Directory Linking Limitations',
      trapTitleFr: 'Le piège des systèmes de fichiers séparés et des répertoires',
      dangerLevel: 'critical',
      distractorExamEn: 'Believing hard links can link across / and /var if they are mounted on separate partitions.',
      distractorExamFr: 'Penser qu\'un lien physique peut relier / et /var s\'ils sont sur deux partitions séparées.',
      howToAvoidEn: 'If it crosses partitions or links a directory, the ONLY answer is `ln -s` (symbolic link).',
      howToAvoidFr: 'Si la question mentionne un répertoire ou deux disques/partitions, la SEULE réponse possible est `ln -s` !',
    },
  },
  {
    id: 'suid-sgid-sticky',
    title: 'Special Permissions (SUID, SGID, Sticky Bit)',
    titleFr: 'Permissions Spéciales (SUID, SGID, Sticky Bit)',
    category: 'Permissions & Security',
    categoryFr: 'Permissions & Sécurité',
    tags: ['suid', 'sgid', 'sticky', 'chmod', '4000', '2000', '1000', 'lpic1-104'],
    summary: 'Execute binaries as owner (SUID), inherit group ownership (SGID), and restrict deletion (Sticky Bit).',
    summaryFr: 'Exécuter un binaire avec les droits du propriétaire (SUID), hériter du groupe (SGID) et restreindre la suppression (Sticky Bit).',
    simple: {
      en: 'Special permission bits represented by a 4th octal prefix digit:\n\n• SUID (4000, `chmod u+s`): Program runs with the permissions of the file OWNER (e.g. /usr/bin/passwd owned by root so normal users can update /etc/shadow).\n• SGID (2000, `chmod g+s`): On binaries, runs with file GROUP permissions. On directories, newly created files automatically inherit the directory\'s group.\n• Sticky Bit (1000, `chmod +t`): On shared directories (like /tmp), only the file owner or root can rename or delete files.',
      fr: 'Bits de permissions spéciales représentés par un 4e chiffre en préfixe octal :\n\n• SUID (4000, `chmod u+s`, affiché \'s\' sur l\'utilisateur) : Le programme s\'exécute avec les privilèges du PROPRIÉTAIRE du fichier (ex: `/usr/bin/passwd` appartient à root pour permettre à un utilisateur ordinaire d\'écrire temporairement dans `/etc/shadow`).\n• SGID (2000, `chmod g+s`, affiché \'s\' sur le groupe) : Sur un binaire, s\'exécute avec les droits du groupe. Sur un répertoire, tous les nouveaux fichiers créés héritent AUTOMATIQUEMENT du groupe propriétaire du dossier.\n• Sticky Bit (1000, `chmod +t`, affiché \'t\' sur les autres) : Sur un répertoire partagé (ex: `/tmp`), seul le propriétaire d\'un fichier ou root peut le supprimer ou le renommer.',
      keyPointsEn: [
        'SUID = 4000 (u+s), SGID = 2000 (g+s), Sticky = 1000 (+t).',
        'Lowercase \'s\' or \'t\' means execute (+x) was already present; uppercase \'S\' or \'T\' means execute was absent!',
        'SUID on /usr/bin/passwd allows standard users to change their own password.',
        'SGID on shared directories is the standard for team collaboration folders.',
      ],
      keyPointsFr: [
        'SUID = 4000 (u+s), SGID = 2000 (g+s), Sticky = 1000 (+t).',
        'Une lettre minuscule \'s\' ou \'t\' signifie que le droit d\'exécution (+x) était présent ; une majuscule \'S\' ou \'T\' signifie que +x était ABSENT (souvent une anomalie) !',
        'Le SUID sur /usr/bin/passwd permet à un utilisateur de modifier son mot de passe rooté.',
        'Le SGID sur un dossier collaboratif force l\'héritage du groupe pour tous les collaborateurs.',
      ],
    },
    beginner: {
      en: 'Think of SUID like a temporary VIP badge given to an ordinary visitor:\n\nYou are a normal employee, but you need to submit a form into the boss\'s locked safe. The command `passwd` is like a locked pneumatic capsule: while you are running it, the system hands you the boss\'s VIP security badge (root) for 2 seconds so the capsule can open the safe. Once the command finishes, the badge disappears!\n\nThe Sticky Bit on `/tmp` is like a public refrigerator in a shared office: anyone can put their lunch inside, anyone can read what is inside, but NO ONE is allowed to throw away or eat someone else\'s lunch except the person who put it there!',
      fr: 'Pense au SUID comme à un badge d\'accès VIP temporaire prêté à un visiteur :\n\nTu es un utilisateur ordinaire sans droits root. Tu veux changer ton mot de passe. Mais le fichier des mots de passe `/etc/shadow` est verrouillé et réservé à root. La commande `/usr/bin/passwd` a le bit SUID : dès que tu la lances, Linux te prête la casquette de root pendant les 2 secondes nécessaires à l\'écriture du mot de passe. Dès que la commande s\'arrête, tu redeviens un utilisateur normal !\n\nLe Sticky Bit sur `/tmp`, c\'est comme le réfrigérateur commun de l\'entreprise : tout le monde a le droit d\'y déposer son repas (écriture), tout le monde peut regarder dedans (lecture), mais PERSONNE n\'a le droit de jeter ou voler le repas d\'un collègue, sauf la personne qui l\'a déposé !',
      analogyTitleEn: 'The VIP Root Badge & The Office Shared Refrigerator',
      analogyTitleFr: 'Le badge VIP temporaire & Le frigo commun de l\'entreprise',
      analogyStoryEn: 'Without the Sticky bit on /tmp, any mischievous user could run `rm -rf /tmp/*` and delete everyone else\'s active sockets and temporary files.',
      analogyStoryFr: 'Sans le Sticky bit sur /tmp, n\'importe quel stagiaire ou utilisateur malveillant pourrait exécuter `rm -rf /tmp/*` et effacer les fichiers de tout le monde.',
    },
    example: {
      en: 'Configuring a team shared folder with SGID and securing /tmp with the Sticky Bit.',
      fr: 'Configurer un dossier partagé d\'équipe avec SGID et sécuriser /tmp avec le Sticky Bit.',
      terminalSnippet: `# 1. Configurer un dossier de travail partagé avec SGID (2775)
$ sudo mkdir /opt/projets
$ sudo chown root:developpeurs /opt/projets
$ sudo chmod 2775 /opt/projets
$ ls -ld /opt/projets
drwxrwsr-x 2 root developpeurs 4096 Sep 19 12:00 /opt/projets
# Désormais, tout fichier créé dans /opt/projets appartiendra automatiquement au groupe "developpeurs" !

# 2. Vérifier le Sticky bit sur /tmp
$ ls -ld /tmp
drwxrwxrwt 15 root root 4096 Sep 19 12:00 /tmp
# Remarquez le 't' à la fin !

# 3. Poser le SUID sur un exécutable personnalisé
$ sudo chmod 4755 /usr/local/bin/backup-tool
$ ls -l /usr/local/bin/backup-tool
-rwsr-xr-x 1 root root 8920 Sep 19 12:00 /usr/local/bin/backup-tool`,
      commandExplanationEn: 'Shows 2775 for SGID collaborative directories and 1777 (drwxrwxrwt) for sticky public folders.',
      commandExplanationFr: 'Montre 2775 pour les dossiers collaboratifs avec SGID et 1777 (drwxrwxrwt) pour les répertoires publics avec Sticky bit.',
    },
    quiz: {
      question: 'In the output `-rwsr-xr-x`, what does the letter \'s\' indicate?',
      questionFr: 'Dans le résultat `-rwsr-xr-x`, qu\'indique la lettre \'s\' minuscule dans les permissions du propriétaire ?',
      options: [
        'SUID is active and the file is executable by the owner',
        'SGID is active without execution rights',
        'Sticky bit is set on the file',
        'The file is encrypted with SSL',
      ],
      optionsFr: [
        'Le SUID est actif et le fichier possède le droit d\'exécution pour le propriétaire',
        'Le SGID est actif sans droit d\'exécution',
        'Le Sticky bit est activé sur le fichier',
        'Le fichier est chiffré avec SSL',
      ],
      correctIndex: 0,
      explanation: 'A lowercase \'s\' in the user position means SUID (4000) is enabled AND the execute permission (+x) is set. An uppercase \'S\' would mean SUID is enabled but execute is NOT set.',
      explanationFr: 'Un \'s\' minuscule à la place du \'x\' du propriétaire signifie que le SUID (4000) est activé ET que le fichier est bien exécutable (+x). Un \'S\' majuscule signifierait que le SUID est activé mais que le droit d\'exécution est manquant.',
    },
    trap: {
      en: 'The uppercase vs lowercase letter trap: \'s\' vs \'S\', and \'t\' vs \'T\'.\nLowercase means execute (x) IS set. Uppercase means execute is MISSING.\nSecond trap: SUID on shell scripts is ignored by modern Linux kernels for security reasons!',
      fr: 'Le grand piège LPIC des lettres minuscules vs majuscules : \'s\' vs \'S\', et \'t\' vs \'T\'.\nLa lettre minuscule signifie que le droit d\'exécution (x) EST présent.\nLa lettre majuscule signifie que l\'exécution est ABSENTE (anomalie fréquente).\nSecond piège : Le SUID sur un script shell bash (#!) est ignoré par le noyau Linux moderne pour des raisons de sécurité !',
      trapTitleEn: 'The Uppercase/Lowercase Letter Trap (s vs S, t vs T)',
      trapTitleFr: 'Le piège des minuscules vs majuscules (s/S et t/T)',
      dangerLevel: 'high',
      distractorExamEn: 'Interpreting -rwSr--r-- as fully working SUID when execute is actually missing.',
      distractorExamFr: 'Croire que -rwSr--r-- permet d\'exécuter le fichier en SUID (l\'exécution est manquante car S est majuscule).',
      howToAvoidEn: 'Remember: Small letter = special bit + execute (GOOD). Capital letter = special bit without execute (WARNING).',
      howToAvoidFr: 'Moyen mnémotechnique : Minuscule = Droit d\'exécution présent. Majuscule = Exécution manquante.',
    },
  },
  {
    id: 'systemd-systemctl',
    title: 'systemd & systemctl Management',
    titleFr: 'systemd & Gestion des Services via systemctl',
    category: 'System Architecture & Init',
    categoryFr: 'Architecture Système & Init',
    tags: ['systemd', 'systemctl', 'service', 'target', 'daemon-reload', 'lpic1-101'],
    summary: 'Manage units, background daemons, boot targets, and journal logging with systemd.',
    summaryFr: 'Gérer les unités, les démons en arrière-plan, les cibles de démarrage et les logs avec systemd.',
    simple: {
      en: 'systemd is PID 1, the init system that bootstraps user space. `systemctl` is the main CLI utility.\n\n• Unit types: .service (daemons), .target (runlevels/groups), .socket, .timer (cron alternative), .mount.\n• `systemctl start/stop/restart/reload <name>`: Controls runtime state.\n• `systemctl enable/disable [--now] <name>`: Controls auto-start at boot.\n• `systemctl status <name>`: Shows active state, PID, memory, and recent log excerpt.\n• Targets replace SysV runlevels: multi-user.target (runlevel 3), graphical.target (runlevel 5), rescue.target (runlevel 1).',
      fr: 'systemd est le processus PID 1, le système d\'initialisation qui démarre l\'espace utilisateur. `systemctl` est sa commande de pilotage.\n\n• Types d\'unités : .service (démons), .target (cibles/niveaux d\'exécution), .socket, .timer (planification), .mount.\n• `systemctl start/stop/restart/reload <nom>` : Contrôle l\'état d\'exécution immédiat.\n• `systemctl enable/disable [--now] <nom>` : Active ou désactive le démarrage automatique au boot.\n• `systemctl daemon-reload` : Recharge la configuration des fichiers units modifiés sur disque.\n• Cibles de démarrage : multi-user.target (équivalent runlevel 3 console) et graphical.target (runlevel 5 bureau graphique).',
      keyPointsEn: [
        'start/stop changes running state now; enable/disable creates/removes symlinks for boot.',
        'daemon-reload is mandatory after editing a unit file in /etc/systemd/system/.',
        'Unit files precedence: /etc/systemd/system/ overrides /lib/systemd/system/.',
        'systemctl isolate changes the active target immediately.',
      ],
      keyPointsFr: [
        'start/stop agit sur le processus actif ; enable/disable crée/supprime les liens symboliques de boot.',
        'daemon-reload est obligatoire après avoir modifié un fichier .service sur disque.',
        'Priorité des unités : /etc/systemd/system/ l\'emporte sur /lib/systemd/system/.',
        'systemctl isolate bascule immédiatement vers une autre cible (target).',
      ],
    },
    beginner: {
      en: 'Think of systemd like the general manager of an airport:\n\n• `systemctl start`: Ordering a bus to start running right now.\n• `systemctl enable`: Putting the bus on the official daily morning schedule so it runs automatically tomorrow.\n• `systemctl enable --now`: Doing BOTH at the same time (start now + schedule for tomorrow).\n• `.target`: Like the condition of the airport: "Foggy/Instrument Only" (multi-user.target, text only) vs "Sunny/Full Tourist Operations" (graphical.target, full graphics and GUI).',
      fr: 'Pense à systemd comme au chef d\'orchestre ou au directeur des opérations d\'un aéroport :\n\n• `systemctl start sshd` : Tu appelles un chauffeur de navette pour qu\'il prenne son service TOUT DE SUITE.\n• `systemctl enable sshd` : Tu inscris la navette au planning officiel pour qu\'elle démarre automatiquement TOUS LES MATINS au lever du soleil (au boot du PC).\n• `systemctl start` sans `enable` : Le service tourne maintenant, mais au prochain redémarrage, il sera éteint !\n• `systemctl enable` sans `start` : Le service démarrera au prochain boot, mais pour l\'instant il ne tourne pas !\n• Les "targets" (cibles) : C\'est le mode de l\'aéroport : mode maintenance secours (rescue), mode console texte sans écran (multi-user), ou mode grand public avec écran tactile (graphical).',
      analogyTitleEn: 'The Airport Dispatcher: Immediate Action vs Tomorrow\'s Schedule',
      analogyTitleFr: 'Le chef d\'orchestre : action immédiate vs planning du matin',
      analogyStoryEn: 'Candidates often forget that `systemctl enable` does NOT start the service by default unless `--now` is appended.',
      analogyStoryFr: 'Beaucoup de débutants oublient que `systemctl enable` ne lance PAS le service dans la minute : il le prépare juste pour le prochain redémarrage.',
    },
    example: {
      en: 'Managing the nginx web server and inspecting boot targets.',
      fr: 'Administrer le serveur web Nginx et inspecter la cible de démarrage.',
      terminalSnippet: `# Démarrer ET activer Nginx au boot en une seule commande
$ sudo systemctl enable --now nginx

# Vérifier l'état détaillé avec les derniers logs
$ systemctl status nginx

# Recharger la configuration sans couper les connexions des clients
$ sudo systemctl reload nginx

# Voir la cible par défaut du système (graphique ou console texte)
$ systemctl get-default
graphical.target

# Changer la cible par défaut pour démarrer en mode console sans interface graphique
$ sudo systemctl set-default multi-user.target`,
      commandExplanationEn: 'Demonstrates enable --now, reload for zero-downtime config updates, and set-default for boot targets.',
      commandExplanationFr: 'Montre enable --now, reload pour appliquer les changements sans coupure, et set-default pour configurer le mode de démarrage.',
    },
    quiz: {
      question: 'Which command must be executed after modifying a service file in /etc/systemd/system/ before restarting the service?',
      questionFr: 'Quelle commande doit être exécutée après avoir modifié un fichier de service dans /etc/systemd/system/ avant de redémarrer le service ?',
      options: [
        'systemctl daemon-reload',
        'systemctl update-units',
        'systemctl refresh',
        'systemd-rehash',
      ],
      optionsFr: [
        'systemctl daemon-reload',
        'systemctl update-units',
        'systemctl refresh',
        'systemd-rehash',
      ],
      correctIndex: 0,
      explanation: '`systemctl daemon-reload` tells systemd to re-scan all unit files and reload configuration into memory.',
      explanationFr: '`systemctl daemon-reload` force systemd à relire tous les fichiers d\'unités sur le disque et à régénérer son arbre de dépendances en mémoire.',
    },
    trap: {
      en: 'The enable vs start distinction in exam questions. If a question asks: "How do you ensure Apache starts on every boot?", writing `systemctl start apache2` is WRONG! The correct answer is `systemctl enable apache2`.\nAlso remember: Unit file location priority! /etc/systemd/system/ overrides /run/systemd/system/ which overrides /lib/systemd/system/.',
      fr: 'La confusion classique entre `start` et `enable` dans les questions de certification ! Si la question demande : "Comment s\'assurer que le service Apache démarre à chaque mise sous tension ?", répondre `systemctl start` est une faute éliminatoire ! La réponse est `systemctl enable`.\nSecond piège : L\'ordre de priorité des dossiers d\'unités : `/etc/systemd/system/` (personnalisé par l\'admin) l\'emporte TOUJOURS sur `/lib/systemd/system/` (fourni par les paquets).',
      trapTitleEn: 'Enable vs Start & Unit File Precedence Traps',
      trapTitleFr: 'Le piège Start vs Enable & la priorité des répertoires d\'unités',
      dangerLevel: 'high',
      distractorExamEn: 'Answering `systemctl start` when the question asked for persistence across reboots.',
      distractorExamFr: 'Répondre `systemctl start` quand la question demandait la persistance au redémarrage.',
      howToAvoidEn: 'Persistent at boot = ENABLE. Running right now = START.',
      howToAvoidFr: 'Persistant au boot = ENABLE. Exécuté immédiatement = START.',
    },
  },
  {
    id: 'find-command',
    title: 'find (Search & Process Files)',
    titleFr: 'find (Recherche & Traitement de Fichiers)',
    category: 'File & Text Processing',
    categoryFr: 'Gestion de Fichiers & Texte',
    tags: ['find', 'exec', 'mtime', 'perm', 'type', 'lpic1-103'],
    summary: 'Search directory hierarchies based on name, size, modification date, or permissions, and execute actions.',
    summaryFr: 'Rechercher dans l\'arborescence selon le nom, la taille, la date ou les droits, et exécuter des actions automatiques.',
    simple: {
      en: '`find [path] [criteria] [action]` crawls directories recursively.\n\n• Criteria: `-name "*.log"` (case sensitive), `-iname` (case insensitive), `-type f` (files), `-type d` (directories), `-mtime -7` (modified within 7 days), `-size +100M`, `-perm 644`.\n• Actions: `-print` (default), `-delete`, `-exec command {} \\;` (runs command for each file), `-exec command {} +` (batches files into a single command invocation like xargs).',
      fr: '`find [chemin] [critères] [action]` parcourt récursivement l\'arborescence.\n\n• Critères : `-name "*.log"` (sensible à la casse), `-iname` (insensible), `-type f` (fichiers), `-type d` (dossiers), `-mtime -7` (modifié il y a moins de 7 jours), `-size +100M`, `-perm 644`.\n• Actions : `-print` (par défaut), `-delete`, `-exec commande {} \\;` (exécute pour chaque fichier), `-exec commande {} +` (regroupe les arguments par lots comme xargs).',
      keyPointsEn: [
        'Quote wildcards: `find . -name "*.txt"` so bash doesn\'t expand them prematurely.',
        '-exec syntax requires `{}` placeholder and ends with `\\;` or `+`.',
        '-mtime +7 means older than 7 days; -mtime -7 means less than 7 days ago.',
        '-perm -4000 finds files where at least SUID is set.',
      ],
      keyPointsFr: [
        'Toujours entourer les jokers de guillemets : `find . -name "*.txt"` pour éviter que bash ne les remplace avant.',
        'La syntaxe -exec requiert `{}` (le nom du fichier) et se termine par `\\;` ou `+`.',
        '-mtime +7 = plus vieux que 7 jours ; -mtime -7 = il y a moins de 7 jours.',
        '-perm -4000 recherche les fichiers ayant au moins le SUID activé.',
      ],
    },
    beginner: {
      en: 'Think of find like an elite detective searching through a giant file warehouse:\n\nYou tell the detective:\n1. Where to search: `/var/log`\n2. What to look for: files (`-type f`) that end in `.log` (`-name "*.log"`) and are heavier than 10 Megabytes (`-size +10M`).\n3. What to do when found: either show me their names, or run a shredder on each one (`-exec gzip {} \\;`).\n\nThe `{}` represents the paper folder the detective holds up, and `\\;` signals "end of instruction" so the detective knows where the command stops!',
      fr: 'Pense à find comme à un enquêteur envoyé dans un immense entrepôt d\'archives :\n\nTu lui donnes 3 consignes claires :\n1. Où chercher : dans `/var/log`\n2. Ce qu\'il cherche : des dossiers suspendus (`-type f`) qui ont l\'étiquette `.log` (`-name "*.log"`) et qui pèsent plus de 50 Mo (`-size +50M`).\n3. L\'action à mener : Dès qu\'il en trouve un, il le compresse avec gzip (`-exec gzip {} \\;`).\n\nLe symbole `{}` représente le fichier que l\'enquêteur a dans les mains à chaque trouvaille. Le `\\;` à la fin est le point final qui indique à Linux où s\'arrête la commande à exécuter !',
      analogyTitleEn: 'The Detective in the Giant File Warehouse',
      analogyTitleFr: 'L\'enquêteur dans l\'entrepôt d\'archives',
      analogyStoryEn: 'Without quotes around "*.log", if a file named test.log exists in your current folder, bash will replace the search pattern before find even runs!',
      analogyStoryFr: 'Si tu oublies les guillemets autour de "*.log", le shell bash remplacera l\'étoile avant même que find n\'ait commencé à chercher !',
    },
    example: {
      en: 'Finding SUID binaries, cleaning old archives, and searching files by size.',
      fr: 'Trouver les fichiers SUID suspects, nettoyer les archives de plus de 30 jours et chercher par taille.',
      terminalSnippet: `# 1. Trouver tous les fichiers avec le bit SUID sur le système (audit de sécurité)
$ find / -perm -4000 -type f 2>/dev/null

# 2. Trouver et supprimer tous les fichiers temporaires plus vieux de 7 jours
$ find /tmp -type f -mtime +7 -delete

# 3. Trouver les gros fichiers (> 500M) dans /home et afficher leur taille lisible
$ find /home -type f -size +500M -exec ls -lh {} \\;

# 4. Rechercher sans distinction de casse
$ find /etc -iname "*network*"`,
      commandExplanationEn: 'Highlights security auditing (-perm -4000), time-based pruning (-mtime +7), and passing results to ls with -exec.',
      commandExplanationFr: 'Met en avant l\'audit de sécurité avec -perm -4000, le nettoyage automatique avec -mtime +7, et l\'exécution avec -exec.',
    },
    quiz: {
      question: 'How do you properly terminate an -exec action in a find command when executing once per file?',
      questionFr: 'Comment termine-t-on correctement l\'action -exec de la commande find pour une exécution par fichier ?',
      options: ['\\;', ';', '&&', 'END'],
      optionsFr: ['\\;', ';', '&&', 'END'],
      correctIndex: 0,
      explanation: 'The semicolon must be escaped with a backslash `\\;` so that the shell does not interpret it as a command separator.',
      explanationFr: 'Le point-virgule doit être échappé avec un antislash `\\;` (ou mis entre guillemets \';\') afin que le shell bash ne l\'interprète pas comme un séparateur de commande.',
    },
    trap: {
      en: 'The wildcard expansion trap without quotes: running `find . -name *.txt` instead of `find . -name "*.txt"`.\nSecond trap: -mtime +30 means strictly more than 30 days ago (31+ days). -mtime -30 means less than 30 days ago (0 to 29 days).',
      fr: 'Le piège des jokers non protégés : taper `find . -name *.txt` au lieu de `find . -name "*.txt"`.\nSecond piège : `-mtime +30` signifie STRICTEMENT plus de 30 jours (31 jours et plus). `-mtime -30` signifie moins de 30 jours (0 à 29 jours). `-mtime 30` signifie exactement le 30e jour.',
      trapTitleEn: 'Unquoted Shell Wildcard & mtime +/- Traps',
      trapTitleFr: 'Le piège des guillemets oubliés et des signes +/- sur mtime',
      dangerLevel: 'high',
      distractorExamEn: 'Forgetting quotes on -name and having the shell expand it into current folder matches.',
      distractorExamFr: 'Oublier les guillemets autour du motif dans -name, causant une erreur de syntaxe quand plusieurs fichiers correspondent.',
      howToAvoidEn: 'Always quote name patterns: `find / -name "*.conf"`.',
      howToAvoidFr: 'Mettez TOUJOURS des guillemets doubles ou simples autour du motif : `find / -name "*.conf"`.',
    },
  },
  {
    id: 'tar-compression',
    title: 'tar & Compression Utilities (gzip, bzip2, xz)',
    titleFr: 'tar & Utilitaires d\'Archivage et Compression',
    category: 'Archive & Compression',
    categoryFr: 'Archivage & Compression',
    tags: ['tar', 'gzip', 'bzip2', 'xz', 'archive', 'lpic1-103'],
    summary: 'Archive and compress multiple files into a single tape archive with gzip (-z), bzip2 (-j), or xz (-J).',
    summaryFr: 'Archiver et compresser des fichiers dans une archive tar avec gzip (-z), bzip2 (-j) ou xz (-J).',
    simple: {
      en: 'tar (tape archive) bundles files into a single container without compression. Combined with compression flags, it compresses on the fly.\n\n• Operations: `-c` (create), `-x` (extract), `-t` (list table of contents), `-v` (verbose), `-f <file>` (archive filename - MUST be last flag before filename!).\n• Compression flags:\n  - `-z` => gzip (.tar.gz or .tgz)\n  - `-j` => bzip2 (.tar.bz2)\n  - `-J` => xz (.tar.xz, highest compression ratio)\n• Extract into another folder: `tar -xf archive.tar -C /destination/dir`.',
      fr: 'tar regroupe plusieurs fichiers dans un conteneur unique. Associé à des drapeaux de compression, il compresse à la volée.\n\n• Opérations principales : `-c` (créer), `-x` (extraire), `-t` (lister le contenu sans extraire), `-v` (verbeux), `-f <fichier>` (nom de l\'archive - DOIT TOUJOURS être le dernier drapeau avant le nom !).\n• Drapeaux de compression :\n  - `-z` => gzip (.tar.gz ou .tgz)\n  - `-j` => bzip2 (.tar.bz2)\n  - `-J` => xz (.tar.xz, meilleur taux de compression)\n• Extraire dans un dossier cible : `tar -xf archive.tar -C /dossier/cible`.',
      keyPointsEn: [
        '-c creates, -x extracts, -t lists.',
        '-f specifies archive filename and MUST immediately precede the archive argument.',
        '-z = gzip, -j = bzip2, -J = xz.',
        '-C changes destination directory when extracting.',
      ],
      keyPointsFr: [
        '-c crée, -x extrait, -t liste.',
        '-f indique le nom de l\'archive et DOIT précéder directement le nom du fichier.',
        '-z = gzip, -j = bzip2, -J (majuscule) = xz.',
        '-C (majuscule) permet de spécifier le dossier de destination.',
      ],
    },
    beginner: {
      en: 'Think of tar like a moving box, and gzip/bzip2/xz like a vacuum seal pump:\n\n1. First, `tar -cf` puts all your clothes, books, and toys into one single cardboard box (the .tar file). The box weighs the exact same as all the items combined.\n2. Then, you plug in a vacuum pump to suck the air out:\n   - `-z` (gzip) is the fast pump.\n   - `-j` (bzip2) is the stronger pump.\n   - `-J` (xz) is the industrial hydraulic compressor that makes the box as tiny as possible!\n\nWhen you arrive at the new house, `tar -xf` opens the box and unpacks everything back onto your shelves.',
      fr: 'Pense à tar comme à un carton de déménagement, et à gzip/xz comme à un sac sous vide :\n\n1. D\'abord, `tar -c` prend tous tes dossiers, fichiers et photos éparpillés pour les empiler dans un seul gros carton (le fichier .tar). Le carton pèse exactement le même poids que le total des fichiers.\n2. Ensuite, tu branches un compresseur sous vide pour aspirer l\'air et réduire la taille :\n   - Le drapeau `-z` (gzip) est la pompe standard, très rapide.\n   - Le drapeau `-j` (bzip2) compresse plus fort mais prend plus de temps.\n   - Le drapeau `-J` (xz majuscule) compresse au maximum absolu !\n\nÀ l\'arrivée, `tar -x` ouvre le carton et dépose tous les fichiers au bon endroit.',
      analogyTitleEn: 'The Cardboard Moving Box and the Vacuum Pump',
      analogyTitleFr: 'Le carton de déménagement et l\'aspirateur sous vide',
      analogyStoryEn: 'Remember: the letter -f stands for "file". Whatever follows -f must be the archive name, not a flag or file list.',
      analogyStoryFr: 'Rappelle-toi : la lettre -f signifie "fichier d\'archive". Ce qui suit immédiatement -f doit être le nom de l\'archive !',
    },
    example: {
      en: 'Creating, listing, and extracting archives with different compression algorithms.',
      fr: 'Créer, examiner le contenu et extraire des archives avec différents formats.',
      terminalSnippet: `# 1. Créer une archive tar compressée en gzip (.tar.gz)
$ tar -czvf sauvegarde.tar.gz /etc/nginx/

# 2. Créer une archive avec xz (taux de compression maximal)
$ tar -cJvf logs.tar.xz /var/log/

# 3. Regarder ce qu'il y a dans l'archive SANS l'extraire sur le disque
$ tar -tvf sauvegarde.tar.gz

# 4. Extraire l'archive dans un dossier spécifique /tmp/restauration
$ mkdir -p /tmp/restauration
$ tar -xzvf sauvegarde.tar.gz -C /tmp/restauration`,
      commandExplanationEn: 'Shows -czvf to create gzip, -cJvf for xz, -tvf to list contents, and -C to unpack into an alternate directory.',
      commandExplanationFr: 'Montre -czvf pour gzip, -cJvf pour xz, -tvf pour prévisualiser le contenu, et -C pour extraire dans un autre dossier.',
    },
    quiz: {
      question: 'Which flag instructs tar to compress an archive using the xz algorithm?',
      questionFr: 'Quel drapeau indique à tar de compresser une archive à l\'aide de l\'algorithme xz ?',
      options: ['-J', '-j', '-z', '-Z'],
      optionsFr: ['-J', '-j', '-z', '-Z'],
      correctIndex: 0,
      explanation: '`-J` (uppercase) uses xz. `-j` (lowercase) uses bzip2. `-z` uses gzip.',
      explanationFr: '`-J` (majuscule) utilise xz. `-j` (minuscule) utilise bzip2. `-z` utilise gzip.',
    },
    trap: {
      en: 'The placement of the -f flag: `tar -czvf myarchive.tar.gz folder` works, but `tar -cfzv myarchive.tar.gz folder` FAILS! Because whatever follows `f` is treated as the archive name (in the second case, it tries to create an archive named "zv"!).\nSecond trap: Confusing -j (bzip2) and -J (xz).',
      fr: 'L\'ordre des options avec le drapeau `-f` ! La commande `tar -czvf archive.tar.gz dossier` fonctionne, mais `tar -cfzv archive.tar.gz dossier` ÉCHOUE lamentablement ! Car ce qui suit directement `-f` est pris comme nom de l\'archive (dans le second cas, tar tente de créer un fichier nommé "zv" !).\nSecond piège : Confondre `-j` (bzip2) et `-J` (xz).',
      trapTitleEn: 'The -f Flag Position Trap & j vs J Confusion',
      trapTitleFr: 'Le piège de la position de l\'option -f et la confusion j / J',
      dangerLevel: 'high',
      distractorExamEn: 'Placing other flags after -f, causing tar to treat flags as the target filename.',
      distractorExamFr: 'Placer d\'autres lettres après le -f, faisant croire à tar que l\'archive s\'appelle \'z\' ou \'v\'.',
      howToAvoidEn: 'Always keep -f as the very last option: `tar -options-f archive.tar`.',
      howToAvoidFr: 'Gardez TOUJOURS le \'f\' en dernière position des options : `tar -czvf archive.tar.gz`.',
    },
  },
  {
    id: 'kill-signals',
    title: 'Process Management & Kill Signals (SIGTERM, SIGKILL, SIGHUP)',
    titleFr: 'Gestion des Processus & Signaux Kill (SIGTERM, SIGKILL, SIGHUP)',
    category: 'Process Management',
    categoryFr: 'Gestion des Processus',
    tags: ['kill', 'killall', 'pkill', 'sigterm', 'sigkill', 'sighup', 'signals', 'lpic1-103'],
    summary: 'Send control signals to processes to terminate cleanly (15), force kill (9), or reload configuration (1).',
    summaryFr: 'Envoyer des signaux aux processus pour les terminer proprement (15), les tuer de force (9) ou recharger leur config (1).',
    simple: {
      en: 'The `kill` command does not always "kill"; it sends an asynchronous software signal to one or more PIDs.\n\n• SIGHUP (1): Hangup. Often reloads configuration files without terminating the daemon.\n• SIGINT (2): Interrupt (Ctrl+C from the terminal).\n• SIGKILL (9): Force kill by the Linux kernel. CANNOT BE CAUGHT, BLOCKED, OR IGNORED. Process terminates immediately without cleaning up resources.\n• SIGTERM (15): Default signal. Polite termination request. Allows process to close files, flush buffers, and finish cleanly.\n• `kill -l` lists all 64 available signals.',
      fr: 'La commande `kill` n\'assassine pas forcément un processus : elle envoie un SIGNAL logiciel asynchrone à un ou plusieurs PID.\n\n• SIGHUP (1) : Hangup. Utilisé traditionnellement pour recharger les fichiers de configuration sans arrêter le service.\n• SIGINT (2) : Interruption (déclenché par Ctrl+C au clavier).\n• SIGKILL (9) : Arrêt forcé immédiat exécuté directement par le NOYAU Linux. NE PEUT ÊTRE NI INTERCEPTÉ, NI IGNORÉ, NI BLOQUÉ ! Le processus est détruit instantanément sans fermer ses fichiers.\n• SIGTERM (15) : Signal par défaut. Demande polie de terminaison. Laisse le temps au programme de sauvegarder ses données et fermer ses connexions.\n• `kill -l` liste tous les signaux disponibles.',
      keyPointsEn: [
        'Default signal is SIGTERM (15), NOT SIGKILL (9).',
        'SIGKILL (9) cannot be caught or handled by any program.',
        'SIGHUP (1) tells many daemons to reload configuration files.',
        'pkill matches by process name; killall matches exact command name.',
      ],
      keyPointsFr: [
        'Le signal par défaut de kill est SIGTERM (15), et NON SIGKILL (9).',
        'SIGKILL (9) ne peut jamais être intercepté ni bloqué par un programme.',
        'SIGHUP (1) demande à beaucoup de services de recharger leur fichier de configuration.',
        'killall et pkill ciblent par nom de processus sans avoir à chercher le PID.',
      ],
    },
    beginner: {
      en: 'Think of signals like asking someone to leave a library:\n\n• SIGTERM (15 - The polite request): You tap the patron on the shoulder and say: "The library is closing in 5 minutes". The person finishes reading their sentence, bookmarks the page, packs their bag, and walks out quietly.\n\n• SIGKILL (9 - The SWAT team): A SWAT team breaks through the window, handcuffs the person, and pulls them out through the ceiling in 1 second. The book stays open on the table, coffee spills on the floor (corrupted temporary files or open database locks)!\n\nThat is why you always try SIGTERM (15) first, and only use SIGKILL (9) as a last resort when the process is completely frozen.',
      fr: 'Imagine que tu demandes à quelqu\'un de quitter une bibliothèque municipale :\n\n• SIGTERM (15 - La demande polie) : Le bibliothécaire s\'approche et dit : "La bibliothèque ferme dans 5 minutes". La personne finit son paragraphe, range ses affaires, remet la chaise en place et sort calmement par la porte.\n\n• SIGKILL (9 - L\'équipe du GIGN) : Le GIGN débarque par le toit, neutralise la personne et l\'embarque en 2 secondes chrono. Le livre reste ouvert sur la table, la tasse de café se renverse par terre (fichiers temporaires corrompus, verrous de base de données non libérés) !\n\nC\'est pour cela qu\'on essaie TOUJOURS d\'abord SIGTERM (15), et qu\'on ne garde SIGKILL (9) qu\'en tout dernier recours quand le programme est complètement gelé.',
      analogyTitleEn: 'The Polite Librarian vs The SWAT Team',
      analogyTitleFr: 'Le bibliothécaire poli vs l\'intervention du GIGN',
      analogyStoryEn: 'Candidates frequently guess 9 as the default kill signal. The default is 15!',
      analogyStoryFr: 'La plupart des candidats pensent à tort que kill envoie 9 par défaut. Le signal par défaut est le 15 !',
    },
    example: {
      en: 'Terminating hung processes and reloading service configurations.',
      fr: 'Terminer des processus récalcitrants et recharger la configuration.',
      terminalSnippet: `# 1. Arrêter poliment un processus par son PID (envoie SIGTERM 15 par défaut)
$ kill 1234

# 2. Si le processus ne répond plus du tout, forcer l'arrêt immédiat avec SIGKILL
$ kill -9 1234
# ou sous forme textuelle :
$ kill -SIGKILL 1234

# 3. Demander à Apache de recharger sa configuration sans couper les requêtes en cours
$ kill -1 $(pgrep apache2)
# ou :
$ kill -SIGHUP $(cat /var/run/apache2.pid)

# 4. Tuer tous les processus firefox d'un utilisateur
$ killall -u tux firefox`,
      commandExplanationEn: 'Shows default SIGTERM, force SIGKILL (-9), and SIGHUP (-1) for config reloads.',
      commandExplanationFr: 'Montre SIGTERM par défaut, le signal forcé SIGKILL (-9) et SIGHUP (-1) pour recharger.',
    },
    quiz: {
      question: 'Which kill signal CANNOT be intercepted, caught, or ignored by any process?',
      questionFr: 'Quel signal kill NE PEUT PAS être intercepté, capturé ou ignoré par un processus ?',
      options: ['SIGKILL (9)', 'SIGTERM (15)', 'SIGHUP (1)', 'SIGINT (2)'],
      optionsFr: ['SIGKILL (9)', 'SIGTERM (15)', 'SIGHUP (1)', 'SIGINT (2)'],
      correctIndex: 0,
      explanation: 'SIGKILL (signal 9) is handled directly by the Linux kernel scheduler and cannot be intercepted or ignored by user-space software.',
      explanationFr: 'SIGKILL (signal 9) et SIGSTOP (signal 19) sont gérés directement par le noyau Linux et ne peuvent jamais être interceptés, masqués ou ignorés par un processus.',
    },
    trap: {
      en: 'Exam Trap 1: What is the default signal sent by `kill 1234`? Answer: SIGTERM (15), NOT SIGKILL (9)!\nExam Trap 2: Can a zombie process be killed with `kill -9`? NO! A zombie process is already dead and waiting for its parent to read its exit code with `wait()`. You must kill the parent process or restart.',
      fr: 'Piège LPIC 1 : Quel est le signal envoyé par défaut par `kill <pid>` ? C\'est SIGTERM (15), et JAMAIS SIGKILL (9) !\nPiège LPIC 2 : Peut-on tuer un processus "Zombie" (état \'Z\' dans ps) avec `kill -9` ? NON ! Un zombie est DÉJÀ MORT, il attend juste que son parent lise son code de retour. Pour le faire disparaître, il faut tuer le processus parent ou relancer init.',
      trapTitleEn: 'Default Signal Trap & The Unkillable Zombie Process',
      trapTitleFr: 'Le piège du signal par défaut & Le cas des processus Zombies',
      dangerLevel: 'high',
      distractorExamEn: 'Choosing signal 9 as the default kill signal.',
      distractorExamFr: 'Choisir le signal 9 comme étant le signal par défaut envoyé par kill.',
      howToAvoidEn: 'Repeat: kill = 15 by default. kill -9 = only when explicitly requested.',
      howToAvoidFr: 'Retenez bien : kill = 15 par défaut. kill -9 = uniquement quand le chiffre 9 est explicitement écrit !',
    },
  },
];

/**
 * Intelligent Offline Pedagogical Generator
 * Generates rich, structured 5-mode pedagogical breakdowns dynamically
 * for ANY concept, command, or question context when not in the curated set!
 */
export function generateOfflineExplanation(
  topicQuery: string,
  mode: PedagogicalMode,
  context?: string,
  isFrench = true
): {
  title: string;
  category: string;
  content: string;
  keyPoints?: string[];
  analogyTitle?: string;
  analogyStory?: string;
  terminalSnippet?: string;
  quiz?: PedagogicalQuiz;
  trapTitle?: string;
  dangerLevel?: 'high' | 'medium' | 'critical';
  howToAvoid?: string;
} {
  const clean = (topicQuery || 'Linux Concept').trim();
  const lower = clean.toLowerCase();

  // Check if it matches a known topic first
  const existing = PEDAGOGICAL_TOPICS.find(
    (t) =>
      t.id.toLowerCase() === lower ||
      t.title.toLowerCase().includes(lower) ||
      t.titleFr.toLowerCase().includes(lower) ||
      t.tags.some((tag) => lower.includes(tag))
  );

  if (existing) {
    if (mode === 'simple') {
      return {
        title: isFrench ? existing.titleFr : existing.title,
        category: isFrench ? existing.categoryFr : existing.category,
        content: isFrench ? existing.simple.fr : existing.simple.en,
        keyPoints: isFrench ? existing.simple.keyPointsFr : existing.simple.keyPointsEn,
      };
    }
    if (mode === 'beginner') {
      return {
        title: isFrench ? existing.titleFr : existing.title,
        category: isFrench ? existing.categoryFr : existing.category,
        content: isFrench ? existing.beginner.fr : existing.beginner.en,
        analogyTitle: isFrench ? existing.beginner.analogyTitleFr : existing.beginner.analogyTitleEn,
        analogyStory: isFrench ? existing.beginner.analogyStoryFr : existing.beginner.analogyStoryEn,
      };
    }
    if (mode === 'example') {
      return {
        title: isFrench ? existing.titleFr : existing.title,
        category: isFrench ? existing.categoryFr : existing.category,
        content: isFrench ? existing.example.fr : existing.example.en,
        terminalSnippet: existing.example.terminalSnippet,
      };
    }
    if (mode === 'quiz') {
      return {
        title: isFrench ? existing.titleFr : existing.title,
        category: isFrench ? existing.categoryFr : existing.category,
        content: isFrench ? 'Testez votre maîtrise sur ce concept clé de l\'examen :' : 'Test your knowledge on this key exam objective:',
        quiz: existing.quiz,
      };
    }
    if (mode === 'trap') {
      return {
        title: isFrench ? existing.titleFr : existing.title,
        category: isFrench ? existing.categoryFr : existing.category,
        content: isFrench ? existing.trap.fr : existing.trap.en,
        trapTitle: isFrench ? existing.trap.trapTitleFr : existing.trap.trapTitleEn,
        dangerLevel: existing.trap.dangerLevel,
        howToAvoid: isFrench ? existing.trap.howToAvoidFr : existing.trap.howToAvoidEn,
      };
    }
  }

  // Dynamic fallback synthesis for custom questions or unlisted topics
  if (mode === 'simple') {
    const definitionSnippet = context ? (isFrench ? `\n\n📌 **Définition officielle du glossaire** :\n> ${context}\n` : `\n\n📌 **Official Glossary Definition**:\n> ${context}\n`) : '';

    return {
      title: clean,
      category: isFrench ? 'Administration Système Linux' : 'Linux System Administration',
      content: isFrench
        ? `Synthèse directe de « ${clean} » :${definitionSnippet}\n• Rôle principal : Outil ou directive standard de l'environnement Unix/Linux intervenant dans l'administration système et la gestion des ressources.\n• Contexte d'utilisation : Indispensable pour automatiser les tâches, configurer l'environnement ou diagnostiquer les composants matériels et logiciels.\n• Syntaxe fondamentale : Généralement invoqué avec des options pour modifier son comportement et des arguments désignant les cibles ou fichiers concernés.\n• Bonnes pratiques : Toujours consulter la page de manuel officielle avec \`man ${clean.split(' ')[0]}\` ou \`--help\` pour vérifier les options disponibles.`
        : `Direct synthesis for "${clean}":${definitionSnippet}\n• Core purpose: Standard Unix/Linux tool or directive used in system administration and resource management.\n• Context: Essential for automation, environment configuration, and diagnosing hardware/software components.\n• Syntax: Typically called with command-line flags and target arguments.\n• Best practice: Always consult \`man ${clean.split(' ')[0]}\` or \`--help\` to verify specific options.`,
      keyPoints: isFrench
        ? [
            context ? `Définition : ${context.slice(0, 100)}...` : `Fonction principale liée à l'administration de ${clean}.`,
            'Comportement prévisible documenté dans les standards POSIX / FHS.',
            'Vérifier les droits nécessaires (utilisateur vs root via sudo).',
          ]
        : [
            context ? `Definition: ${context.slice(0, 100)}...` : `Primary function linked to managing ${clean}.`,
            'Standardized behavior across POSIX and FHS compliance.',
            'Check required privilege level (standard user vs root via sudo).',
          ],
    };
  }

  if (mode === 'beginner') {
    const roleHint = context ? (isFrench ? ` (sa mission : ${context})` : ` (its mission: ${context})`) : '';
    return {
      title: clean,
      category: isFrench ? 'Vulgarisation & Découverte' : 'Beginner Friendly Analogy',
      content: isFrench
        ? `Imagine ${clean} comme un outil ultra-spécialisé dans une boîte à outils d'artisan${roleHint} :\n\nChaque commande Linux ne fait QU'UNE SEULE CHOSE, mais elle la fait à la perfection (c'est la philosophie fondamentale d'Unix).\n\nPlutôt que d'avoir une usine à gaz compliquée, Linux te donne un jeu d'outils précis : ${clean} est celui qui s'occupe de cette tâche spécifique. Tu peux même le combiner avec d'autres outils grâce au tube magique qu'est le pipe (\`|\`) !`
        : `Think of ${clean} like a specialized tool in a craftsperson's toolbox${roleHint}:\n\nIn Unix, every command does ONE thing and does it well. Rather than a bloated all-in-one suite, Linux gives you precise tools. ${clean} handles this specific task cleanly, and can be chained with other tools using the pipe (\`|\`).`,
      analogyTitle: isFrench ? 'La philosophie Unix de l\'outil unique et efficace' : 'The Unix philosophy of single-purpose tools',
      analogyStory: isFrench
        ? `Pas besoin de tout mémoriser par cœur : comprends simplement quelle entrée l'outil reçoit, et quelle sortie il produit.`
        : `You don't need to memorize every flag: simply understand what input it expects and what output it produces.`,
    };
  }

  if (mode === 'example') {
    const cmdName = clean.split(' ')[0].toLowerCase();
    return {
      title: clean,
      category: isFrench ? 'Exemple Pratique' : 'Hands-on Example',
      content: isFrench
        ? `Voici un exemple typique d'utilisation de ${clean} dans un terminal Linux :`
        : `Here is a typical terminal usage example for ${clean}:`,
      terminalSnippet: `# 1. Afficher l'aide rapide et les options principales
$ ${cmdName} --help 2>&1 | head -n 15

# 2. Vérifier la version ou l'état
$ which ${cmdName}
/usr/bin/${cmdName}

# 3. Exemple classique d'exécution
$ ${cmdName} -v
`,
    };
  }

  if (mode === 'quiz') {
    return {
      title: clean,
      category: isFrench ? 'Auto-Évaluation' : 'Self-Assessment',
      content: isFrench ? 'Vérifiez votre compréhension avec cette question ciblée :' : 'Check your understanding with this targeted question:',
      quiz: {
        question: isFrench
          ? `Quelle est la principale recommandation lors de l'utilisation de ${clean} en production ?`
          : `What is the primary best practice when utilizing ${clean} in production?`,
        questionFr: `Quelle est la principale recommandation lors de l'utilisation de ${clean} en production ?`,
        options: isFrench
          ? [
              'Vérifier les options avec le manuel officiel ou tester d\'abord en mode simulation (-n ou dry-run)',
              'Exécuter toujours en tant que root sans argument',
              'Désactiver SELinux avant de lancer la commande',
              'Supprimer les fichiers de configuration par défaut',
            ]
          : [
              'Check options via man pages or run with dry-run/preview mode first',
              'Always run as root with no arguments',
              'Disable SELinux before running the command',
              'Delete default configuration files',
            ],
        optionsFr: [
          'Vérifier les options avec le manuel officiel ou tester d\'abord en mode simulation (-n ou dry-run)',
          'Exécuter toujours en tant que root sans argument',
          'Désactiver SELinux avant de lancer la commande',
          'Supprimer les fichiers de configuration par défaut',
        ],
        correctIndex: 0,
        explanation: isFrench
          ? 'Tester avec des options de prévisualisation ou consulter `man` garantit qu\'aucun effet de bord destructeur ne survient.'
          : 'Verifying options via man pages and using dry-run preview prevents destructive side effects.',
        explanationFr: 'Tester avec des options de prévisualisation ou consulter `man` garantit qu\'aucun effet de bord destructeur ne survient.',
      },
    };
  }

  // mode === 'trap'
  return {
    title: clean,
    category: isFrench ? 'Pièges de Certification' : 'Exam Traps & Gotchas',
    content: isFrench
      ? `Le piège classique aux examens LPIC concernant ${clean} :\n\n1. Confusion fréquente entre les options majuscules et minuscules (Linux est strictement sensible à la casse).\n2. Erreur sur l'utilisateur ou le niveau de privilège requis (certaines commandes nécessitent sudo ou l'accès au socket systemd/udev).\n3. Ordre des arguments : mettre les options APRÈS la liste des fichiers peut être ignoré selon l'implémentation POSIX vs GNU.`
      : `Common LPIC exam trap for ${clean}:\n\n1. Case-sensitivity confusion between uppercase and lowercase flags.\n2. Privilege level mismatch (operations requiring root vs normal user permissions).\n3. Argument ordering differences between POSIX and GNU coreutils.`,
    trapTitle: isFrench ? 'Attention à la casse des drapeaux et à l\'ordre des arguments' : 'Flag Case-Sensitivity & Argument Ordering',
    dangerLevel: 'medium',
    howToAvoid: isFrench
      ? 'Relisez toujours attentivement chaque caractère des options dans les QCM de l\'examen.'
      : 'Carefully scrutinize every flag character in multiple-choice questions.',
  };
}

export function getCuratedTopic(id: string): PedagogicalTopic | undefined {
  return PEDAGOGICAL_TOPICS.find((t) => t.id === id);
}
