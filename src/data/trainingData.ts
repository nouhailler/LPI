import {
  FillInTheBlankChallenge,
  TroubleshootingChallenge,
  SequencingChallenge,
  MatchingGame,
  GuidedLabScenario,
} from '../types';
import { lpic1Exam101Challenges } from './lpic1Exam101Challenges';
import { lpic1Exam102Challenges } from './lpic1Exam102Challenges';
import { lpic2Exam201Challenges } from './lpic2Exam201Challenges';
import { lpic2Exam202Challenges } from './lpic2Exam202Challenges';
import { lpic3Exam303SecurityChallenges } from './lpic3Exam303SecurityChallenges';
import { lpic3EnterpriseCloudChallenges } from './lpic3EnterpriseCloudChallenges';
import {
  lpic1TroubleshootingChallenges,
  lpic1Exam101Troubleshooting,
  lpic1Exam102Troubleshooting
} from './lpic1TroubleshootingChallenges';
import {
  lpic2TroubleshootingChallenges,
  lpic2Exam201Troubleshooting,
  lpic2Exam202Troubleshooting,
  lpic2Troubleshoot201_1,
  lpic2Troubleshoot201_2,
  lpic2Troubleshoot202_1,
  lpic2Troubleshoot202_2,
} from './lpic2TroubleshootingChallenges';
import {
  lpic3TroubleshootingChallenges,
  lpic3Troubleshoot300,
  lpic3Troubleshoot303,
  lpic3Troubleshoot305,
  lpic3Troubleshoot306
} from './lpic3TroubleshootingChallenges';
import {
  lpic1SequencingChallenges,
  lpic1Sequencing101,
  lpic1Sequencing102
} from './lpic1SequencingChallenges';

// =========================================================================
// 1. MODULE « SAISIE EXACTE » (100 Défis LPIC-3, 100 Défis LPIC-2, 100 Défis LPIC-1)
// =========================================================================

export const lpic1Challenges: FillInTheBlankChallenge[] = [
  ...lpic1Exam101Challenges,
  ...lpic1Exam102Challenges,
];

export const lpic2Challenges: FillInTheBlankChallenge[] = [
  ...lpic2Exam201Challenges,
  ...lpic2Exam202Challenges,
];

export const lpic3Challenges: FillInTheBlankChallenge[] = [
  ...lpic3Exam303SecurityChallenges,
  ...lpic3EnterpriseCloudChallenges,
];

export const fillInTheBlankChallenges: FillInTheBlankChallenge[] = [
  ...lpic3Challenges,
  ...lpic2Challenges,
  ...lpic1Challenges,
];

// =========================================================================
// 2. MODULE « DÉFIS DE DÉPANNAGE » (100 LPIC-3 + 100 LPIC-2 + 100 LPIC-1)
// =========================================================================

/**
 * Défis de Dépannage pour les certifications LPIC :
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-3 (Examens 300, 303, 305, 306)
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-2 (Examens 201 et 202)
 * - 100 Défis de Dépannage EXCLUSIFS pour la certification LPIC-1 (Examens 101 et 102)
 */
export const troubleshootingChallenges: TroubleshootingChallenge[] = [
  ...lpic3TroubleshootingChallenges,
  ...lpic2TroubleshootingChallenges,
  ...lpic1TroubleshootingChallenges
];

export {
  lpic1TroubleshootingChallenges,
  lpic1Exam101Troubleshooting,
  lpic1Exam102Troubleshooting,
  lpic2TroubleshootingChallenges,
  lpic2Exam201Troubleshooting,
  lpic2Exam202Troubleshooting,
  lpic2Troubleshoot201_1,
  lpic2Troubleshoot201_2,
  lpic2Troubleshoot202_1,
  lpic2Troubleshoot202_2,
  lpic3TroubleshootingChallenges,
  lpic3Troubleshoot300,
  lpic3Troubleshoot303,
  lpic3Troubleshoot305,
  lpic3Troubleshoot306
};

// =========================================================================
// 3. MODULE « EXERCICES D'ORDONNANCEMENT » (Timeline & Boot Order)
// =========================================================================

export const sequencingChallenges: SequencingChallenge[] = [
  ...lpic1SequencingChallenges,
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

export {
  lpic1SequencingChallenges,
  lpic1Sequencing101,
  lpic1Sequencing102
};

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
