import { SimulatedLabScenario, LabScenarioValidation } from './types';
import { VirtualFs } from './VirtualFs';
import { ShellInterpreter } from './ShellInterpreter';

export const simulatedLabScenarios: SimulatedLabScenario[] = [
  {
    id: 'lab-chmod-backup',
    title: 'Permissions d\'exécution pour backup.sh (chmod 750)',
    titleFr: 'Permissions d\'exécution pour backup.sh (chmod 750)',
    certification: 'lpic-1',
    category: 'permissions',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    estimatedMinutes: 5,
    goal: 'Accorder au script de sauvegarde les permissions rwxr-x--- (750) pour autoriser l\'exécution par l\'utilisateur student et le groupe, tout en interdisant tout accès aux autres.',
    goalFr: 'Accorder au script de sauvegarde les permissions rwxr-x--- (750) pour autoriser l\'exécution par l\'utilisateur student et le groupe, tout en interdisant tout accès aux autres.',
    initialDirectory: '/home/student/scripts',
    instructions: [
      'Examinez les permissions actuelles de backup.sh avec ls -l',
      'Appliquez la commande chmod 750 backup.sh (ou chmod u=rwx,g=rx,o= backup.sh)',
      'Vérifiez le résultat avec ls -l backup.sh pour confirmer les permissions -rwxr-x---',
    ],
    instructionsFr: [
      'Examinez les permissions actuelles de backup.sh avec ls -l',
      'Appliquez la commande chmod 750 backup.sh (ou chmod u=rwx,g=rx,o= backup.sh)',
      'Vérifiez le résultat avec ls -l backup.sh pour confirmer les permissions -rwxr-x---',
    ],
    hints: [
      'En octal, 7 = rwx (4+2+1), 5 = r-x (4+0+1), 0 = --- (aucun droit).',
      'Tapez : chmod 750 backup.sh dans le dossier /home/student/scripts.',
    ],
    hintsFr: [
      'En octal, 7 = rwx (4+2+1), 5 = r-x (4+0+1), 0 = --- (aucun droit).',
      'Tapez : chmod 750 backup.sh dans le dossier /home/student/scripts.',
    ],
    solutionCommands: ['cd /home/student/scripts', 'ls -l backup.sh', 'chmod 750 backup.sh', 'ls -l backup.sh'],
    solutionExplanation: 'La commande chmod 750 configure le propriétaire (student) en lecture/écriture/exécution (rwx=7), le groupe en lecture/exécution (r-x=5) et retire tout droit au reste du système (---=0).',
    solutionExplanationFr: 'La commande chmod 750 configure le propriétaire (student) en lecture/écriture/exécution (rwx=7), le groupe en lecture/exécution (r-x=5) et retire tout droit au reste du système (---=0).',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/home/student/scripts/backup.sh');
      if (!node) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le fichier /home/student/scripts/backup.sh est introuvable.',
          feedbackFr: 'Le fichier /home/student/scripts/backup.sh est introuvable.',
          unmetCriteria: ['Fichier manquant'],
          unmetCriteriaFr: ['Fichier manquant'],
        };
      }
      const permMask = node.mode & 0o777;
      if (permMask === 0o750) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Parfait ! backup.sh possède désormais exactement le mode 750 (-rwxr-x---).',
          feedbackFr: 'Parfait ! backup.sh possède désormais exactement le mode 750 (-rwxr-x---).',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      const actualStr = VirtualFs.formatMode(node);
      return {
        isComplete: false,
        score: 30,
        feedback: `Permissions actuelles : ${actualStr} (${permMask.toString(8)}). Le mode attendu est -rwxr-x--- (750).`,
        feedbackFr: `Permissions actuelles : ${actualStr} (${permMask.toString(8)}). Le mode attendu est -rwxr-x--- (750).`,
        unmetCriteria: [`Mode requis : 750 (actuel : ${permMask.toString(8)})`],
        unmetCriteriaFr: [`Mode requis : 750 (actuel : ${permMask.toString(8)})`],
      };
    },
  },
  {
    id: 'lab-grep-auth',
    title: 'Extraction et redirection des connexions réussies (grep & pipe)',
    titleFr: 'Extraction et redirection des connexions réussies (grep & pipe)',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    estimatedMinutes: 6,
    goal: 'Extraire toutes les lignes contenant "Accepted" dans /var/log/auth.log et les rediriger dans un nouveau fichier /tmp/accepted_logins.txt.',
    goalFr: 'Extraire toutes les lignes contenant "Accepted" dans /var/log/auth.log et les rediriger dans un nouveau fichier /tmp/accepted_logins.txt.',
    initialDirectory: '/home/student',
    instructions: [
      'Inspectez le fichier /var/log/auth.log avec cat ou grep',
      'Exécutez la commande d\'extraction avec redirection : grep "Accepted" /var/log/auth.log > /tmp/accepted_logins.txt',
      'Vérifiez le contenu de /tmp/accepted_logins.txt avec cat',
    ],
    instructionsFr: [
      'Inspectez le fichier /var/log/auth.log avec cat ou grep',
      'Exécutez la commande d\'extraction avec redirection : grep "Accepted" /var/log/auth.log > /tmp/accepted_logins.txt',
      'Vérifiez le contenu de /tmp/accepted_logins.txt avec cat',
    ],
    hints: [
      'Utilisez le chevron simple > pour créer ou écraser le fichier de destination.',
      'Commande exacte : grep "Accepted" /var/log/auth.log > /tmp/accepted_logins.txt',
    ],
    hintsFr: [
      'Utilisez le chevron simple > pour créer ou écraser le fichier de destination.',
      'Commande exacte : grep "Accepted" /var/log/auth.log > /tmp/accepted_logins.txt',
    ],
    solutionCommands: [
      'grep "Accepted" /var/log/auth.log > /tmp/accepted_logins.txt',
      'cat /tmp/accepted_logins.txt',
    ],
    solutionExplanation: 'La commande grep filtre les lignes correspondant au motif et la redirection > écrit le flux de sortie standard dans le fichier cible /tmp/accepted_logins.txt.',
    solutionExplanationFr: 'La commande grep filtre les lignes correspondant au motif et la redirection > écrit le flux de sortie standard dans le fichier cible /tmp/accepted_logins.txt.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/tmp/accepted_logins.txt');
      if (!node) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le fichier /tmp/accepted_logins.txt n\'a pas encore été créé.',
          feedbackFr: 'Le fichier /tmp/accepted_logins.txt n\'a pas encore été créé.',
          unmetCriteria: ['Fichier /tmp/accepted_logins.txt manquant'],
          unmetCriteriaFr: ['Fichier /tmp/accepted_logins.txt manquant'],
        };
      }
      const content = node.content || '';
      if (content.includes('Accepted publickey for student') && content.includes('Accepted publickey for bob')) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Bravo ! Les 2 sessions SSH validées ont bien été extraites dans /tmp/accepted_logins.txt.',
          feedbackFr: 'Bravo ! Les 2 sessions SSH validées ont bien été extraites dans /tmp/accepted_logins.txt.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 50,
        feedback: 'Le fichier existe mais ne contient pas les entrées attendues.',
        feedbackFr: 'Le fichier existe mais ne contient pas les entrées attendues.',
        unmetCriteria: ['Contenu non conforme'],
        unmetCriteriaFr: ['Contenu non conforme'],
      };
    },
  },
  {
    id: 'lab-tar-archive',
    title: 'Archivage compressé tar.gz de projet web',
    titleFr: 'Archivage compressé tar.gz de projet web',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 7,
    goal: 'Créer une archive tar compressée avec gzip nommée web_backup.tar.gz dans /var/backups contenant le dossier /home/student/projects/web.',
    goalFr: 'Créer une archive tar compressée avec gzip nommée web_backup.tar.gz dans /var/backups contenant le dossier /home/student/projects/web.',
    initialDirectory: '/home/student',
    instructions: [
      'Vérifiez la présence du dossier /home/student/projects/web',
      'Créez l\'archive compressée : tar -czf /var/backups/web_backup.tar.gz /home/student/projects/web',
      'Vérifiez l\'archive avec tar -tf /var/backups/web_backup.tar.gz',
    ],
    instructionsFr: [
      'Vérifiez la présence du dossier /home/student/projects/web',
      'Créez l\'archive compressée : tar -czf /var/backups/web_backup.tar.gz /home/student/projects/web',
      'Vérifiez l\'archive avec tar -tf /var/backups/web_backup.tar.gz',
    ],
    hints: [
      'Les options tar : -c pour créer, -z pour compresser avec gzip, -f pour spécifier le fichier cible.',
      'Commande : tar -czf /var/backups/web_backup.tar.gz /home/student/projects/web',
    ],
    hintsFr: [
      'Les options tar : -c pour créer, -z pour compresser avec gzip, -f pour spécifier le fichier cible.',
      'Commande : tar -czf /var/backups/web_backup.tar.gz /home/student/projects/web',
    ],
    solutionCommands: [
      'tar -czf /var/backups/web_backup.tar.gz /home/student/projects/web',
      'ls -la /var/backups',
    ],
    solutionExplanation: 'tar -czf associe la création (-c), le filtre gzip (-z) et le nom du fichier archive (-f).',
    solutionExplanationFr: 'tar -czf associe la création (-c), le filtre gzip (-z) et le nom du fichier archive (-f).',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/var/backups/web_backup.tar.gz');
      if (!node) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'L\'archive /var/backups/web_backup.tar.gz n\'existe pas.',
          feedbackFr: 'L\'archive /var/backups/web_backup.tar.gz n\'existe pas.',
          unmetCriteria: ['Archive manquante'],
          unmetCriteriaFr: ['Archive manquante'],
        };
      }
      return {
        isComplete: true,
        score: 100,
        feedback: 'Succès ! L\'archive de sauvegarde a été créée correctement dans /var/backups/web_backup.tar.gz.',
        feedbackFr: 'Succès ! L\'archive de sauvegarde a été créée correctement dans /var/backups/web_backup.tar.gz.',
        unmetCriteria: [],
        unmetCriteriaFr: [],
      };
    },
  },
  {
    id: 'lab-chown-ownership',
    title: 'Transfert de propriété de groupe avec chown',
    titleFr: 'Transfert de propriété de groupe avec chown',
    certification: 'lpic-1',
    category: 'permissions',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 6,
    goal: 'Changer le groupe propriétaire de l\'arborescence /home/student/projects pour le groupe developers de manière récursive.',
    goalFr: 'Changer le groupe propriétaire de l\'arborescence /home/student/projects pour le groupe developers de manière récursive.',
    initialDirectory: '/home/student',
    initialSetup: (fs: VirtualFs) => {
      fs.chown('/home/student/projects', 'student:student', true);
    },
    instructions: [
      'Examinez le groupe actuel avec ls -l /home/student',
      'Appliquez la récursion avec chown : chown -R :developers /home/student/projects (ou chown -R student:developers /home/student/projects)',
      'Vérifiez que tous les sous-fichiers appartiennent au groupe developers',
    ],
    instructionsFr: [
      'Examinez le groupe actuel avec ls -l /home/student',
      'Appliquez la récursion avec chown : chown -R :developers /home/student/projects (ou chown -R student:developers /home/student/projects)',
      'Vérifiez que tous les sous-fichiers appartiennent au groupe developers',
    ],
    hints: [
      'L\'option -R permet d\'appliquer la modification à tous les sous-dossiers et fichiers.',
      'Tapez : chown -R student:developers /home/student/projects',
    ],
    hintsFr: [
      'L\'option -R permet d\'appliquer la modification à tous les sous-dossiers et fichiers.',
      'Tapez : chown -R student:developers /home/student/projects',
    ],
    solutionCommands: [
      'chown -R student:developers /home/student/projects',
      'ls -ld /home/student/projects',
    ],
    solutionExplanation: 'La syntaxe chown -R utilisateur:groupe cible applique l\'appartenance sur l\'ensemble de l\'arborescence.',
    solutionExplanationFr: 'La syntaxe chown -R utilisateur:groupe cible applique l\'appartenance sur l\'ensemble de l\'arborescence.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const proj = fs.getNode('/home/student/projects');
      const csv = fs.getNode('/home/student/projects/data.csv');
      if (!proj || !csv) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le dossier des projets est introuvable.',
          feedbackFr: 'Le dossier des projets est introuvable.',
          unmetCriteria: ['Dossier introuvable'],
          unmetCriteriaFr: ['Dossier introuvable'],
        };
      }
      if (proj.group === 'developers' && csv.group === 'developers') {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Excellent ! Le groupe developers a bien été assigné récursivement à tous les fichiers du projet.',
          feedbackFr: 'Excellent ! Le groupe developers a bien été assigné récursivement à tous les fichiers du projet.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 40,
        feedback: `Le groupe actuel est ${proj.group}. Le groupe developers est attendu.`,
        feedbackFr: `Le groupe actuel est ${proj.group}. Le groupe developers est attendu.`,
        unmetCriteria: ['Groupe developers non appliqué récursivement'],
        unmetCriteriaFr: ['Groupe developers non appliqué récursivement'],
      };
    },
  },
  {
    id: 'lab-symlink-creation',
    title: 'Création d\'un lien symbolique (ln -s)',
    titleFr: 'Création d\'un lien symbolique (ln -s)',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    estimatedMinutes: 5,
    goal: 'Créer un lien symbolique dans le répertoire personnel /home/student/run_backup.sh pointant vers le script réel /home/student/scripts/backup.sh.',
    goalFr: 'Créer un lien symbolique dans le répertoire personnel /home/student/run_backup.sh pointant vers le script réel /home/student/scripts/backup.sh.',
    initialDirectory: '/home/student',
    instructions: [
      'Positionnez-vous dans /home/student',
      'Créez le lien symbolique avec ln -s : ln -s /home/student/scripts/backup.sh /home/student/run_backup.sh',
      'Vérifiez la cible du lien avec ls -l run_backup.sh',
    ],
    instructionsFr: [
      'Positionnez-vous dans /home/student',
      'Créez le lien symbolique avec ln -s : ln -s /home/student/scripts/backup.sh /home/student/run_backup.sh',
      'Vérifiez la cible du lien avec ls -l run_backup.sh',
    ],
    hints: [
      'Syntaxe : ln -s <cible> <nom_du_lien>',
      'Tapez : ln -s /home/student/scripts/backup.sh /home/student/run_backup.sh',
    ],
    hintsFr: [
      'Syntaxe : ln -s <cible> <nom_du_lien>',
      'Tapez : ln -s /home/student/scripts/backup.sh /home/student/run_backup.sh',
    ],
    solutionCommands: [
      'ln -s /home/student/scripts/backup.sh /home/student/run_backup.sh',
      'ls -l run_backup.sh',
    ],
    solutionExplanation: 'La commande ln -s crée un inode de type symlink contenant le chemin textuel de la cible.',
    solutionExplanationFr: 'La commande ln -s crée un inode de type symlink contenant le chemin textuel de la cible.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/home/student/run_backup.sh');
      if (!node) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le lien /home/student/run_backup.sh n\'existe pas.',
          feedbackFr: 'Le lien /home/student/run_backup.sh n\'existe pas.',
          unmetCriteria: ['Lien symbolique manquant'],
          unmetCriteriaFr: ['Lien symbolique manquant'],
        };
      }
      if (node.type === 'symlink' && node.target?.includes('backup.sh')) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Parfait ! Le lien symbolique run_backup.sh pointe correctement vers le script de sauvegarde.',
          feedbackFr: 'Parfait ! Le lien symbolique run_backup.sh pointe correctement vers le script de sauvegarde.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 30,
        feedback: 'Le fichier créé n\'est pas un lien symbolique valide.',
        feedbackFr: 'Le fichier créé n\'est pas un lien symbolique valide.',
        unmetCriteria: ['Cible non conforme'],
        unmetCriteriaFr: ['Cible non conforme'],
      };
    },
  },
  {
    id: 'lab-kill-process',
    title: 'Gestion et arrêt de processus avec kill',
    titleFr: 'Gestion et arrêt de processus avec kill',
    certification: 'lpic-1',
    category: 'processes',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 5,
    goal: 'Identifier le processus rogue (PID 1040 nginx worker bloqué) avec ps aux et l\'arrêter à l\'aide de la commande kill.',
    goalFr: 'Identifier le processus rogue (PID 1040 nginx worker bloqué) avec ps aux et l\'arrêter à l\'aide de la commande kill.',
    initialDirectory: '/home/student',
    initialSetup: (fs: VirtualFs, interpreter: ShellInterpreter) => {
      if (!interpreter.processes.find((p) => p.pid === 1040)) {
        interpreter.processes.push({
          pid: 1040,
          user: 'www-data',
          cpu: 99.8,
          mem: 4.2,
          vsz: 240000,
          rss: 42000,
          tty: '?',
          stat: 'R',
          start: '10:05',
          time: '12:45',
          command: 'nginx: worker process (stuck loop)',
        });
      }
    },
    instructions: [
      'Affichez la table des processus avec ps aux',
      'Repérez le PID du processus consommant anormalement le CPU (PID 1040)',
      'Envoyez le signal d\'arrêt : kill 1040 (ou kill -9 1040)',
      'Vérifiez la disparition du processus avec ps aux',
    ],
    instructionsFr: [
      'Affichez la table des processus avec ps aux',
      'Repérez le PID du processus consommant anormalement le CPU (PID 1040)',
      'Envoyez le signal d\'arrêt : kill 1040 (ou kill -9 1040)',
      'Vérifiez la disparition du processus avec ps aux',
    ],
    hints: [
      'Tapez ps aux pour observer les PID en cours d\'exécution.',
      'Pour stopper le processus 1040, exécutez kill 1040 ou kill -9 1040.',
    ],
    hintsFr: [
      'Tapez ps aux pour observer les PID en cours d\'exécution.',
      'Pour stopper le processus 1040, exécutez kill 1040 ou kill -9 1040.',
    ],
    solutionCommands: ['ps aux', 'kill -9 1040', 'ps aux'],
    solutionExplanation: 'La commande kill envoie par défaut le signal SIGTERM (15). Le paramètre -9 transmet SIGKILL pour une terminaison immédiate.',
    solutionExplanationFr: 'La commande kill envoie par défaut le signal SIGTERM (15). Le paramètre -9 transmet SIGKILL pour une terminaison immédiate.',
    validate: (fs: VirtualFs, interpreter: ShellInterpreter): LabScenarioValidation => {
      const exists = interpreter.processes.some((p) => p.pid === 1040);
      if (!exists) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Succès ! Le processus 1040 a été terminé.',
          feedbackFr: 'Succès ! Le processus 1040 a été terminé.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 0,
        feedback: 'Le processus PID 1040 est toujours actif dans la table des processus.',
        feedbackFr: 'Le processus PID 1040 est toujours actif dans la table des processus.',
        unmetCriteria: ['PID 1040 non arrêté'],
        unmetCriteriaFr: ['PID 1040 non arrêté'],
      };
    },
  },
  {
    id: 'lab-find-and-clean',
    title: 'Nettoyage des fichiers temporaires (.tmp) avec find et rm',
    titleFr: 'Nettoyage des fichiers temporaires (.tmp) avec find et rm',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 6,
    goal: 'Supprimer le fichier temporaire résiduel /tmp/session_dump.tmp pour libérer de l\'espace disque.',
    goalFr: 'Supprimer le fichier temporaire résiduel /tmp/session_dump.tmp pour libérer de l\'espace disque.',
    initialDirectory: '/home/student',
    instructions: [
      'Inspectez le contenu du dossier /tmp avec ls -la /tmp',
      'Supprimez le fichier session_dump.tmp avec rm /tmp/session_dump.tmp',
      'Vérifiez la suppression avec ls /tmp',
    ],
    instructionsFr: [
      'Inspectez le contenu du dossier /tmp avec ls -la /tmp',
      'Supprimez le fichier session_dump.tmp avec rm /tmp/session_dump.tmp',
      'Vérifiez la suppression avec ls /tmp',
    ],
    hints: [
      'Utilisez rm /tmp/session_dump.tmp',
    ],
    hintsFr: [
      'Utilisez rm /tmp/session_dump.tmp',
    ],
    solutionCommands: ['ls -l /tmp', 'rm /tmp/session_dump.tmp', 'ls /tmp'],
    solutionExplanation: 'Le dossier /tmp contient les fichiers volatils. La commande rm supprime l\'entrée de répertoire et libère les blocs.',
    solutionExplanationFr: 'Le dossier /tmp contient les fichiers volatils. La commande rm supprime l\'entrée de répertoire et libère les blocs.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/tmp/session_dump.tmp');
      if (!node) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Le fichier temporaire a bien été supprimé.',
          feedbackFr: 'Le fichier temporaire a bien été supprimé.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 0,
        feedback: 'Le fichier /tmp/session_dump.tmp est toujours présent.',
        feedbackFr: 'Le fichier /tmp/session_dump.tmp est toujours présent.',
        unmetCriteria: ['Fichier non supprimé'],
        unmetCriteriaFr: ['Fichier non supprimé'],
      };
    },
  },
  {
    id: 'lab-security-shadow',
    title: 'Audit et sécurisation des droits de /etc/shadow (chmod 600)',
    titleFr: 'Audit et sécurisation des droits de /etc/shadow (chmod 600)',
    certification: 'lpic-1',
    category: 'security',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedMinutes: 6,
    goal: 'Restreindre l\'accès au fichier de mots de passe hachés /etc/shadow au seul compte root avec les permissions 600 (-rw-------) en utilisant sudo.',
    goalFr: 'Restreindre l\'accès au fichier de mots de passe hachés /etc/shadow au seul compte root avec les permissions 600 (-rw-------) en utilisant sudo.',
    initialDirectory: '/home/student',
    instructions: [
      'Inspectez les permissions actuelles : ls -l /etc/shadow',
      'Appliquez la restriction en tant que root : sudo chmod 600 /etc/shadow',
      'Vérifiez que le mode est désormais -rw-------',
    ],
    instructionsFr: [
      'Inspectez les permissions actuelles : ls -l /etc/shadow',
      'Appliquez la restriction en tant que root : sudo chmod 600 /etc/shadow',
      'Vérifiez que le mode est désormais -rw-------',
    ],
    hints: [
      'Pour modifier un fichier sous /etc, préfixez la commande par sudo.',
      'Tapez : sudo chmod 600 /etc/shadow',
    ],
    hintsFr: [
      'Pour modifier un fichier sous /etc, préfixez la commande par sudo.',
      'Tapez : sudo chmod 600 /etc/shadow',
    ],
    solutionCommands: ['ls -l /etc/shadow', 'sudo chmod 600 /etc/shadow', 'ls -l /etc/shadow'],
    solutionExplanation: '/etc/shadow contient les empreintes cryptographiques des mots de passe. Il ne doit être lisible et modifiable que par root (mode 600 ou 640 avec groupe shadow).',
    solutionExplanationFr: '/etc/shadow contient les empreintes cryptographiques des mots de passe. Il ne doit être lisible et modifiable que par root (mode 600 ou 640 avec groupe shadow).',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/etc/shadow');
      if (!node) {
        return {
          isComplete: false,
          score: 0,
          feedback: '/etc/shadow est introuvable.',
          feedbackFr: '/etc/shadow est introuvable.',
          unmetCriteria: ['Fichier manquant'],
          unmetCriteriaFr: ['Fichier manquant'],
        };
      }
      const permMask = node.mode & 0o777;
      if (permMask === 0o600) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Sécurité validée ! /etc/shadow est désormais protégé en mode 600 (-rw-------).',
          feedbackFr: 'Sécurité validée ! /etc/shadow est désormais protégé en mode 600 (-rw-------).',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 30,
        feedback: `Permissions actuelles : ${VirtualFs.formatMode(node)}. Le mode attendu est -rw------- (600).`,
        feedbackFr: `Permissions actuelles : ${VirtualFs.formatMode(node)}. Le mode attendu est -rw------- (600).`,
        unmetCriteria: ['Mode 600 requis'],
        unmetCriteriaFr: ['Mode 600 requis'],
      };
    },
  },
  {
    id: 'lab-text-filter-pipeline',
    title: 'Pipeline de filtrage de texte (cut, sort, wc)',
    titleFr: 'Pipeline de filtrage de texte (cut, sort, wc)',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 6,
    goal: 'Extraire le premier champ (nom d\'utilisateur) de /etc/passwd avec cut, trier la liste par ordre alphabétique avec sort, et enregistrer le résultat dans /tmp/sorted_users.txt.',
    goalFr: 'Extraire le premier champ (nom d\'utilisateur) de /etc/passwd avec cut, trier la liste par ordre alphabétique avec sort, et enregistrer le résultat dans /tmp/sorted_users.txt.',
    initialDirectory: '/home/student',
    instructions: [
      'Visualisez le format de /etc/passwd avec cat /etc/passwd ou head -n 5 /etc/passwd',
      'Testez l\'extraction du 1er champ séparé par ":" : cut -d: -f1 /etc/passwd',
      'Enchaînez avec le tri et la redirection : cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt',
      'Vérifiez le contenu de /tmp/sorted_users.txt et comptez les lignes avec wc -l /tmp/sorted_users.txt',
    ],
    instructionsFr: [
      'Visualisez le format de /etc/passwd avec cat /etc/passwd ou head -n 5 /etc/passwd',
      'Testez l\'extraction du 1er champ séparé par ":" : cut -d: -f1 /etc/passwd',
      'Enchaînez avec le tri et la redirection : cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt',
      'Vérifiez le contenu de /tmp/sorted_users.txt et comptez les lignes avec wc -l /tmp/sorted_users.txt',
    ],
    hints: [
      'Le délimiteur est le double-point -d: et le champ recherché est -f1.',
      'Utilisez le tube | pour acheminer la sortie de cut vers sort, puis > vers /tmp/sorted_users.txt.',
      'Commande complète : cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt',
    ],
    hintsFr: [
      'Le délimiteur est le double-point -d: et le champ recherché est -f1.',
      'Utilisez le tube | pour acheminer la sortie de cut vers sort, puis > vers /tmp/sorted_users.txt.',
      'Commande complète : cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt',
    ],
    solutionCommands: [
      'cut -d: -f1 /etc/passwd | sort > /tmp/sorted_users.txt',
      'cat /tmp/sorted_users.txt',
      'wc -l /tmp/sorted_users.txt',
    ],
    solutionExplanation: 'La commande cut extrait le premier champ à l\'aide du délimiteur ":", sort classe alphabétiquement les comptes système et la redirection > enregistre le résultat dans le fichier cible.',
    solutionExplanationFr: 'La commande cut extrait le premier champ à l\'aide du délimiteur ":", sort classe alphabétiquement les comptes système et la redirection > enregistre le résultat dans le fichier cible.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/tmp/sorted_users.txt');
      if (!node || !node.content) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le fichier /tmp/sorted_users.txt n\'a pas encore été créé.',
          feedbackFr: 'Le fichier /tmp/sorted_users.txt n\'a pas encore été créé.',
          unmetCriteria: ['Fichier /tmp/sorted_users.txt manquant'],
          unmetCriteriaFr: ['Fichier /tmp/sorted_users.txt manquant'],
        };
      }
      const lines = node.content.trim().split('\n').map((l) => l.trim());
      const hasRoot = lines.includes('root');
      const hasStudent = lines.includes('student');
      const isSorted = [...lines].sort().join('\n') === lines.join('\n');

      if (hasRoot && hasStudent && isSorted && lines.length >= 5) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Excellent ! Les utilisateurs ont été correctement extraits et triés par ordre alphabétique.',
          feedbackFr: 'Excellent ! Les utilisateurs ont été correctement extraits et triés par ordre alphabétique.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 40,
        feedback: 'Le contenu de /tmp/sorted_users.txt ne correspond pas aux utilisateurs triés attendus.',
        feedbackFr: 'Le contenu de /tmp/sorted_users.txt ne correspond pas aux utilisateurs triés attendus.',
        unmetCriteria: ['Liste d\'utilisateurs incorrecte ou non triée'],
        unmetCriteriaFr: ['Liste d\'utilisateurs incorrecte ou non triée'],
      };
    },
  },
  {
    id: 'lab-systemd-service',
    title: 'Supervision et statut de service (systemctl & journalctl)',
    titleFr: 'Supervision et statut de service (systemctl & journalctl)',
    certification: 'lpic-1',
    category: 'processes',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 5,
    goal: 'Interroger l\'état du service web nginx avec systemctl, consulter ses journaux d\'événements avec journalctl, et rediriger le rapport d\'état dans /tmp/nginx_status.txt.',
    goalFr: 'Interroger l\'état du service web nginx avec systemctl, consulter ses journaux d\'événements avec journalctl, et rediriger le rapport d\'état dans /tmp/nginx_status.txt.',
    initialDirectory: '/home/student',
    instructions: [
      'Affichez l\'état actuel du service : systemctl status nginx',
      'Inspectez les journaux récents de ce service : journalctl -u nginx',
      'Redirigez le statut dans le fichier demandé : systemctl status nginx > /tmp/nginx_status.txt',
      'Vérifiez la présence du fichier avec cat /tmp/nginx_status.txt',
    ],
    instructionsFr: [
      'Affichez l\'état actuel du service : systemctl status nginx',
      'Inspectez les journaux récents de ce service : journalctl -u nginx',
      'Redirigez le statut dans le fichier demandé : systemctl status nginx > /tmp/nginx_status.txt',
      'Vérifiez la présence du fichier avec cat /tmp/nginx_status.txt',
    ],
    hints: [
      'La commande systemctl status nginx affiche l\'état chargé, actif et les derniers logs.',
      'Utilisez > pour enregistrer la sortie : systemctl status nginx > /tmp/nginx_status.txt',
    ],
    hintsFr: [
      'La commande systemctl status nginx affiche l\'état chargé, actif et les derniers logs.',
      'Utilisez > pour enregistrer la sortie : systemctl status nginx > /tmp/nginx_status.txt',
    ],
    solutionCommands: [
      'systemctl status nginx',
      'journalctl -u nginx',
      'systemctl status nginx > /tmp/nginx_status.txt',
    ],
    solutionExplanation: 'systemctl permet de contrôler et superviser les démons système gérés par systemd, tandis que journalctl interroge les journaux binaires du journald.',
    solutionExplanationFr: 'systemctl permet de contrôler et superviser les démons système gérés par systemd, tandis que journalctl interroge les journaux binaires du journald.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/tmp/nginx_status.txt');
      if (!node || !node.content) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le fichier /tmp/nginx_status.txt n\'existe pas encore.',
          feedbackFr: 'Le fichier /tmp/nginx_status.txt n\'existe pas encore.',
          unmetCriteria: ['Fichier /tmp/nginx_status.txt manquant'],
          unmetCriteriaFr: ['Fichier /tmp/nginx_status.txt manquant'],
        };
      }
      if (node.content.includes('nginx.service') && (node.content.includes('Active: active') || node.content.includes('Loaded: loaded'))) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Bravo ! Le rapport d\'état systemctl pour nginx a été capturé avec succès.',
          feedbackFr: 'Bravo ! Le rapport d\'état systemctl pour nginx a été capturé avec succès.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 30,
        feedback: 'Le fichier /tmp/nginx_status.txt ne contient pas les données attendues de systemctl status nginx.',
        feedbackFr: 'Le fichier /tmp/nginx_status.txt ne contient pas les données attendues de systemctl status nginx.',
        unmetCriteria: ['Contenu de statut systemd non reconnu'],
        unmetCriteriaFr: ['Contenu de statut systemd non reconnu'],
      };
    },
  },
  {
    id: 'lab-network-ping-diag',
    title: 'Diagnostic réseau et connectivité (ip & ping)',
    titleFr: 'Diagnostic réseau et connectivité (ip & ping)',
    certification: 'lpic-1',
    category: 'network',
    difficulty: 'Beginner',
    difficultyFr: 'Débutant',
    estimatedMinutes: 5,
    goal: 'Inspecter les interfaces réseau avec ip addr, puis vérifier la connectivité vers la passerelle locale (192.168.1.1) avec ping -c 3 en sauvegardant le résultat dans /tmp/ping_gateway.txt.',
    goalFr: 'Inspecter les adresses réseau avec ip addr, puis vérifier la connectivité vers la passerelle locale (192.168.1.1) avec ping -c 3 en sauvegardant le résultat dans /tmp/ping_gateway.txt.',
    initialDirectory: '/home/student',
    instructions: [
      'Affichez l\'adresse IP de l\'interface eth0 : ip addr show eth0',
      'Vérifiez la table de routage par défaut : ip route show',
      'Testez la connectivité vers la passerelle : ping -c 3 192.168.1.1 > /tmp/ping_gateway.txt',
      'Affichez le fichier de rapport avec cat /tmp/ping_gateway.txt',
    ],
    instructionsFr: [
      'Affichez l\'adresse IP de l\'interface eth0 : ip addr show eth0',
      'Vérifiez la table de routage par défaut : ip route show',
      'Testez la connectivité vers la passerelle : ping -c 3 192.168.1.1 > /tmp/ping_gateway.txt',
      'Affichez le fichier de rapport avec cat /tmp/ping_gateway.txt',
    ],
    hints: [
      'L\'option -c 3 limite le nombre de paquets ICMP transmis à 3.',
      'Tapez : ping -c 3 192.168.1.1 > /tmp/ping_gateway.txt',
    ],
    hintsFr: [
      'L\'option -c 3 limite le nombre de paquets ICMP transmis à 3.',
      'Tapez : ping -c 3 192.168.1.1 > /tmp/ping_gateway.txt',
    ],
    solutionCommands: [
      'ip addr show eth0',
      'ip route show',
      'ping -c 3 192.168.1.1 > /tmp/ping_gateway.txt',
      'cat /tmp/ping_gateway.txt',
    ],
    solutionExplanation: 'La suite iproute2 (ip addr, ip route) est le standard moderne sous Linux pour gérer le réseau, remplaçant ifconfig et route.',
    solutionExplanationFr: 'La suite iproute2 (ip addr, ip route) est le standard moderne sous Linux pour gérer le réseau, remplaçant ifconfig et route.',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const node = fs.getNode('/tmp/ping_gateway.txt');
      if (!node || !node.content) {
        return {
          isComplete: false,
          score: 0,
          feedback: 'Le fichier /tmp/ping_gateway.txt est manquant.',
          feedbackFr: 'Le fichier /tmp/ping_gateway.txt est manquant.',
          unmetCriteria: ['Fichier /tmp/ping_gateway.txt manquant'],
          unmetCriteriaFr: ['Fichier /tmp/ping_gateway.txt manquant'],
        };
      }
      if (node.content.includes('PING 192.168.1.1') || node.content.includes('bytes from 192.168.1.1')) {
        return {
          isComplete: true,
          score: 100,
          feedback: 'Connectivité réseau vérifiée avec succès ! Le rapport ping est complet.',
          feedbackFr: 'Connectivité réseau vérifiée avec succès ! Le rapport ping est complet.',
          unmetCriteria: [],
          unmetCriteriaFr: [],
        };
      }
      return {
        isComplete: false,
        score: 30,
        feedback: 'Le fichier de rapport ne contient pas la sortie attendue de la commande ping.',
        feedbackFr: 'Le fichier de rapport ne contient pas la sortie attendue de la commande ping.',
        unmetCriteria: ['Sortie ping non conforme'],
        unmetCriteriaFr: ['Sortie ping non conforme'],
      };
    },
  },
  {
    id: 'lab-storage-mount-disk',
    title: 'Inspection et montage de système de fichiers (lsblk & mount)',
    titleFr: 'Inspection et montage de système de fichiers (lsblk & mount)',
    certification: 'lpic-1',
    category: 'storage',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 6,
    goal: 'Inspecter les périphériques de stockage bloc avec lsblk -f, puis monter la partition /dev/sdc1 sur le répertoire /mnt en utilisant les privilèges root (sudo mount).',
    goalFr: 'Inspecter les périphériques de stockage bloc avec lsblk -f, puis monter la partition /dev/sdc1 sur le répertoire /mnt en utilisant les privilèges root (sudo mount).',
    initialDirectory: '/home/student',
    instructions: [
      'Identifiez les disques et partitions disponibles : lsblk -f',
      'Observez que /dev/sdc1 est de type ext4 et n\'a pas de point de montage',
      'Montez la partition sur /mnt avec les privilèges root : sudo mount /dev/sdc1 /mnt',
      'Vérifiez la liste des montages actifs en exécutant la commande mount ou lsblk',
    ],
    instructionsFr: [
      'Identifiez les disques et partitions disponibles : lsblk -f',
      'Observez que /dev/sdc1 est de type ext4 et n\'a pas de point de montage',
      'Montez la partition sur /mnt avec les privilèges root : sudo mount /dev/sdc1 /mnt',
      'Vérifiez la liste des montages actifs en exécutant la commande mount ou lsblk',
    ],
    hints: [
      'Le montage d\'un périphérique requiert les privilèges super-utilisateur : préfixez par sudo.',
      'Tapez : sudo mount /dev/sdc1 /mnt',
    ],
    hintsFr: [
      'Le montage d\'un périphérique requiert les privilèges super-utilisateur : préfixez par sudo.',
      'Tapez : sudo mount /dev/sdc1 /mnt',
    ],
    solutionCommands: [
      'lsblk -f',
      'sudo mount /dev/sdc1 /mnt',
      'mount',
    ],
    solutionExplanation: 'La commande mount rattache le système de fichiers situé sur un périphérique bloc (ex. /dev/sdc1) à une arborescence de répertoires existante (/mnt).',
    solutionExplanationFr: 'La commande mount rattache le système de fichiers situé sur un périphérique bloc (ex. /dev/sdc1) à une arborescence de répertoires existante (/mnt).',
    validate: (fs: VirtualFs, interpreter?: ShellInterpreter): LabScenarioValidation => {
      if (interpreter && interpreter.storageSimulator) {
        const isMounted = interpreter.storageSimulator.isMountActive('/mnt') || interpreter.storageSimulator.isMountActive('/dev/sdc1');
        if (isMounted) {
          return {
            isComplete: true,
            score: 100,
            feedback: 'Montage validé ! Le volume /dev/sdc1 est correctement rattaché à /mnt.',
            feedbackFr: 'Montage validé ! Le volume /dev/sdc1 est correctement rattaché à /mnt.',
            unmetCriteria: [],
            unmetCriteriaFr: [],
          };
        }
      }
      return {
        isComplete: false,
        score: 0,
        feedback: 'Le point de montage /mnt n\'est pas encore actif. Exécutez : sudo mount /dev/sdc1 /mnt',
        feedbackFr: 'Le point de montage /mnt n\'est pas encore actif. Exécutez : sudo mount /dev/sdc1 /mnt',
        unmetCriteria: ['/dev/sdc1 non monté sur /mnt'],
        unmetCriteriaFr: ['/dev/sdc1 non monté sur /mnt'],
      };
    },
  },
  {
    id: 'lab-fstab-mount-umount',
    title: 'Persistance /etc/fstab, Tables de Partitions et Démontage (fdisk, umount, mount -a)',
    titleFr: 'Persistance /etc/fstab, Tables de Partitions et Démontage (fdisk, umount, mount -a)',
    certification: 'lpic-1',
    category: 'storage',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedMinutes: 7,
    goal: 'Inspecter les partitions avec fdisk -l, créer le point de montage /mnt/backup, déclarer /dev/sdc1 de manière permanente dans /etc/fstab, appliquer le montage avec mount -a, puis tester la commande umount.',
    goalFr: 'Inspecter les partitions avec fdisk -l, créer le point de montage /mnt/backup, déclarer /dev/sdc1 de manière permanente dans /etc/fstab, appliquer le montage avec mount -a, puis tester la commande umount.',
    initialDirectory: '/home/student',
    instructions: [
      'Listez les partitions avec : sudo fdisk -l /dev/sdc (ou lsblk -f)',
      'Créez le répertoire de destination : sudo mkdir -p /mnt/backup',
      'Ajoutez l\'entrée dans /etc/fstab : /dev/sdc1 /mnt/backup ext4 defaults 0 2 (utilisez echo ... | sudo tee -a /etc/fstab)',
      'Montez automatiquement tous les systèmes de fichiers déclarés : sudo mount -a',
      'Vérifiez la table des montages actifs : mount | grep sdc1 ou lsblk -f',
      'Démontez le système de fichiers pour valider le cycle : sudo umount /mnt/backup',
    ],
    instructionsFr: [
      'Listez les partitions avec : sudo fdisk -l /dev/sdc (ou lsblk -f)',
      'Créez le répertoire de destination : sudo mkdir -p /mnt/backup',
      'Ajoutez l\'entrée dans /etc/fstab : /dev/sdc1 /mnt/backup ext4 defaults 0 2 (utilisez echo ... | sudo tee -a /etc/fstab)',
      'Montez automatiquement tous les systèmes de fichiers déclarés : sudo mount -a',
      'Vérifiez la table des montages actifs : mount | grep sdc1 ou lsblk -f',
      'Démontez le système de fichiers pour valider le cycle : sudo umount /mnt/backup',
    ],
    hints: [
      'Pour fdisk en mode non-interactif : sudo fdisk -l /dev/sdc.',
      'Pour ajouter à /etc/fstab : echo "/dev/sdc1 /mnt/backup ext4 defaults 0 2" | sudo tee -a /etc/fstab',
      'sudo mount -a lit /etc/fstab et monte les entrées non encore montées.',
    ],
    hintsFr: [
      'Pour fdisk en mode non-interactif : sudo fdisk -l /dev/sdc.',
      'Pour ajouter à /etc/fstab : echo "/dev/sdc1 /mnt/backup ext4 defaults 0 2" | sudo tee -a /etc/fstab',
      'sudo mount -a lit /etc/fstab et monte les entrées non encore montées.',
    ],
    solutionCommands: [
      'sudo fdisk -l /dev/sdc',
      'sudo mkdir -p /mnt/backup',
      'echo "/dev/sdc1 /mnt/backup ext4 defaults 0 2" | sudo tee -a /etc/fstab',
      'sudo mount -a',
      'mount | grep sdc1',
      'sudo umount /mnt/backup',
    ],
    solutionExplanation: 'Le fichier /etc/fstab enregistre la configuration des systèmes de fichiers permanents. La commande mount -a permet d\'éprouver la syntaxe de fstab immédiatement, et umount libère le point de montage.',
    solutionExplanationFr: 'Le fichier /etc/fstab enregistre la configuration des systèmes de fichiers permanents. La commande mount -a permet d\'éprouver la syntaxe de fstab immédiatement, et umount libère le point de montage.',
    validate: (fs: VirtualFs, interpreter?: ShellInterpreter): LabScenarioValidation => {
      const fstabNode = fs.getNode('/etc/fstab');
      const backupDir = fs.getNode('/mnt/backup');
      const unmet: string[] = [];

      if (!backupDir || backupDir.type !== 'directory') {
        unmet.push('Le répertoire /mnt/backup doit être créé (sudo mkdir -p /mnt/backup).');
      }

      if (!fstabNode || !fstabNode.content || !fstabNode.content.includes('/dev/sdc1') || !fstabNode.content.includes('/mnt/backup')) {
        unmet.push('L\'entrée /dev/sdc1 /mnt/backup ext4 defaults 0 2 doit figurer dans /etc/fstab.');
      }

      const historyStr = interpreter ? interpreter.history.join(' ') : '';
      const testedMountOrUmount =
        historyStr.includes('mount -a') ||
        historyStr.includes('umount') ||
        (interpreter?.storageSimulator?.isMountActive('/mnt/backup') ?? false);

      if (!testedMountOrUmount) {
        unmet.push('Exécutez sudo mount -a (et sudo umount /mnt/backup) pour tester le montage.');
      }

      const isComplete = unmet.length === 0;
      return {
        isComplete,
        score: isComplete ? 100 : Math.max(0, 100 - unmet.length * 35),
        feedback: isComplete
          ? 'Configuration et cycle de montage /etc/fstab validés avec succès !'
          : 'La persistance fstab ou le test de montage est incomplet.',
        feedbackFr: isComplete
          ? 'Configuration et cycle de montage /etc/fstab validés avec succès !'
          : 'La persistance fstab ou le test de montage est incomplet.',
        unmetCriteria: unmet,
        unmetCriteriaFr: unmet,
      };
    },
  },
  {
    id: 'lab-text-filter-sed-awk',
    title: 'Filtrage et Transformation de Flux Avancés (sed, awk & wc)',
    titleFr: 'Filtrage et Transformation de Flux Avancés (sed, awk & wc)',
    certification: 'lpic-1',
    category: 'files',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedMinutes: 6,
    goal: 'Transformer les données de serveurs avec sed pour standardiser les environnements "staging" en "preprod" dans /tmp/servers_mod.txt, puis utiliser awk pour filtrer les serveurs actifs vers /tmp/active_servers.txt et compter les lignes avec wc -l.',
    goalFr: 'Transformer les données de serveurs avec sed pour standardiser les environnements "staging" en "preprod" dans /tmp/servers_mod.txt, puis utiliser awk pour filtrer les serveurs actifs vers /tmp/active_servers.txt et compter les lignes avec wc -l.',
    initialDirectory: '/home/student',
    instructions: [
      'Affichez le fichier source : cat servers.txt',
      'Remplacez le mot "staging" par "preprod" avec sed et enregistrez la sortie : sed "s/staging/preprod/g" servers.txt > /tmp/servers_mod.txt',
      'Filtrez avec awk pour extraire les serveurs dont le statut ($4) est "active" : awk \'$4 == "active" {print $1, $2}\' servers.txt > /tmp/active_servers.txt',
      'Comptez le nombre de serveurs actifs avec wc -l /tmp/active_servers.txt',
    ],
    instructionsFr: [
      'Affichez le fichier source : cat servers.txt',
      'Remplacez le mot "staging" par "preprod" avec sed et enregistrez la sortie : sed "s/staging/preprod/g" servers.txt > /tmp/servers_mod.txt',
      'Filtrez avec awk pour extraire les serveurs dont le statut ($4) est "active" : awk \'$4 == "active" {print $1, $2}\' servers.txt > /tmp/active_servers.txt',
      'Comptez le nombre de serveurs actifs avec wc -l /tmp/active_servers.txt',
    ],
    hints: [
      'sed utilise la syntaxe sed "s/chercher/remplacer/g" fichier > cible',
      'awk teste les colonnes par $1, $2, $3, $4. Exemple : awk \'$4 == "active" {print $1, $2}\'',
    ],
    hintsFr: [
      'sed utilise la syntaxe sed "s/chercher/remplacer/g" fichier > cible',
      'awk teste les colonnes par $1, $2, $3, $4. Exemple : awk \'$4 == "active" {print $1, $2}\'',
    ],
    solutionCommands: [
      'cat servers.txt',
      'sed "s/staging/preprod/g" servers.txt > /tmp/servers_mod.txt',
      'awk \'$4 == "active" {print $1, $2}\' servers.txt > /tmp/active_servers.txt',
      'wc -l /tmp/active_servers.txt',
    ],
    solutionExplanation: 'sed permet des substitutions rapides de motifs par expressions régulières, tandis qu\'awk traite chaque ligne comme un enregistrement découpé en colonnes ($1, $2, etc.).',
    solutionExplanationFr: 'sed permet des substitutions rapides de motifs par expressions régulières, tandis qu\'awk traite chaque ligne comme un enregistrement découpé en colonnes ($1, $2, etc.).',
    validate: (fs: VirtualFs): LabScenarioValidation => {
      const modNode = fs.getNode('/tmp/servers_mod.txt');
      const activeNode = fs.getNode('/tmp/active_servers.txt');
      const unmet: string[] = [];

      if (!modNode || !modNode.content) {
        unmet.push('Le fichier /tmp/servers_mod.txt est manquant (utilisez sed "s/staging/preprod/g" servers.txt > /tmp/servers_mod.txt).');
      } else if (!modNode.content.includes('preprod') || modNode.content.includes('staging')) {
        unmet.push('Le fichier /tmp/servers_mod.txt doit contenir "preprod" au lieu de "staging".');
      }

      if (!activeNode || !activeNode.content) {
        unmet.push('Le fichier /tmp/active_servers.txt est manquant (utilisez awk).');
      } else if (!activeNode.content.includes('web1') || !activeNode.content.includes('192.168.1.10')) {
        unmet.push('/tmp/active_servers.txt doit contenir les serveurs actifs extraits par awk.');
      }

      const isComplete = unmet.length === 0;
      return {
        isComplete,
        score: isComplete ? 100 : Math.max(0, 100 - unmet.length * 50),
        feedback: isComplete
          ? 'Magnifique ! Traitement de flux maîtrisé avec sed, awk et redirection.'
          : 'Filtrage incomplet.',
        feedbackFr: isComplete
          ? 'Magnifique ! Traitement de flux maîtrisé avec sed, awk et redirection.'
          : 'Filtrage incomplet.',
        unmetCriteria: unmet,
        unmetCriteriaFr: unmet,
      };
    },
  },
];
