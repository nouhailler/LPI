import { ShellInterpreter } from '../services/virtualFs/ShellInterpreter';

export type MissionSeverity = 'CRITIQUE (P1)' | 'MAJEUR (P2)' | 'ÉLEVÉ (P3)';

export interface MissionDiagnosticStep {
  id: string;
  name: string;
  nameFr: string;
  category: 'status' | 'logs' | 'network' | 'config' | 'action' | 'verify';
  categoryLabelFr: string;
  iconName: string;
  points: number;
  matchedCommandPatterns: RegExp[];
  descriptionFr: string;
}

export interface LinuxMission {
  id: string;
  incidentNumber: string; // e.g. "INCIDENT #042"
  title: string;
  titleFr: string;
  server: string; // e.g. "web-prod-01"
  service: string; // e.g. "nginx"
  severity: MissionSeverity;
  timeLimitMinutes: number;
  symptom: string;
  symptomFr: string;
  availableInfo: {
    terminalFr: string;
    logsFr: string;
    networkFr: string;
    servicesFr: string;
    filesystemFr: string;
  };
  objectiveFr: string;
  briefingDialogueFr: string;
  diagnosticSteps: MissionDiagnosticStep[];
  penalties: {
    blindRestart: number; // e.g. -10 for restarting before inspecting
    repeatedFails: number;
  };
  setupMission: (interpreter: ShellInterpreter) => void;
  checkResolution: (interpreter: ShellInterpreter) => {
    isResolved: boolean;
    rootCauseIdentified: boolean;
    feedbackFr: string;
    scoreMultiplier: number;
  };
  rootCauseSummaryFr: string;
  remediationSummaryFr: string;
}

export const LINUX_MISSIONS: LinuxMission[] = [
  // ============================================================
  // INCIDENT #042 : web-prod-01 (Nginx down due to port 80 conflict)
  // ============================================================
  {
    id: 'mission-042',
    incidentNumber: 'INCIDENT #042',
    title: 'Nginx Outage & Port Conflict on Production Web Server',
    titleFr: 'Panne Nginx & Conflit de Port sur Serveur Web de Production',
    server: 'web-prod-01',
    service: 'nginx',
    severity: 'CRITIQUE (P1)',
    timeLimitMinutes: 15,
    symptom: 'A production server is no longer responding. Public website returns "Connection Refused" to all clients.',
    symptomFr: 'Un serveur de production ne répond plus. Le site web principal renvoie « Connection Refused » à tous les clients.',
    availableInfo: {
      terminalFr: 'Accès shell root (root@web-prod-01:~#)',
      logsFr: 'Journaux systemd (journalctl -u nginx) & /var/log/nginx/error.log',
      networkFr: 'Sockets en écoute (ss -lntp, netstat), interfaces (ip addr, ip route)',
      servicesFr: 'Gestionnaire systemd (systemctl status nginx, ps aux)',
      filesystemFr: 'Arborescence /etc/nginx/nginx.conf et /var/www/html'
    },
    objectiveFr: 'Identifier la cause du crash de Nginx, libérer la ressource conflictuelle ou réparer la configuration, redémarrer le service et valider avec curl.',
    briefingDialogueFr: 'Alerte P1 de l\'astreinte ! Le monitoring Datadog indique que web-prod-01 ne répond plus sur le port 80. Nginx semble avoir échoué lors de la rotation de ce matin. Vous avez les clés root. Trouvez pourquoi il refuse de démarrer et rétablissez le trafic immédiatement !',
    diagnosticSteps: [
      {
        id: 'step_status',
        name: 'Check Nginx Service Status',
        nameFr: 'Vérifier l\'état du service Nginx',
        category: 'status',
        categoryLabelFr: 'État Service',
        iconName: 'Activity',
        points: 15,
        matchedCommandPatterns: [/^systemctl\s+status(\s+nginx)?/, /^service\s+nginx\s+status/],
        descriptionFr: 'Constat de l\'état failed/inactive de l\'unité nginx.service.'
      },
      {
        id: 'step_logs',
        name: 'Inspect Systemd Journal & Nginx Error Logs',
        nameFr: 'Inspecter les journaux (journalctl ou error.log)',
        category: 'logs',
        categoryLabelFr: 'Journaux & Logs',
        iconName: 'FileText',
        points: 20,
        matchedCommandPatterns: [/^journalctl(\s+.*-u\s+nginx)?/, /^cat\s+.*error\.log/, /^tail\s+.*error\.log/],
        descriptionFr: 'Lecture des messages d\'erreur systemd montrant l\'échec de bind sur le port 80.'
      },
      {
        id: 'step_sockets',
        name: 'Audit Listening Ports & Sockets (ss / netstat / lsof)',
        nameFr: 'Auditer les sockets d\'écoute (ss -lntp / netstat)',
        category: 'network',
        categoryLabelFr: 'Réseau & Sockets',
        iconName: 'Network',
        points: 25,
        matchedCommandPatterns: [/^ss(\s+-[a-zA-Z]+)?/, /^netstat(\s+-[a-zA-Z]+)?/, /^lsof(\s+-[a-zA-Z0-9:]+)?/],
        descriptionFr: 'Détection du processus rogue (apache2 sur le port 80) qui bloque Nginx.'
      },
      {
        id: 'step_config',
        name: 'Test Nginx Syntax (nginx -t)',
        nameFr: 'Tester la syntaxe Nginx (nginx -t)',
        category: 'config',
        categoryLabelFr: 'Syntaxe Config',
        iconName: 'CheckCircle2',
        points: 15,
        matchedCommandPatterns: [/^nginx\s+-t/, /^cat\s+\/etc\/nginx/],
        descriptionFr: 'Vérification de la validité de la configuration /etc/nginx/nginx.conf.'
      },
      {
        id: 'step_remediate',
        name: 'Stop Rogue Service / Free Port 80',
        nameFr: 'Arrêter le service en conflit (apache2)',
        category: 'action',
        categoryLabelFr: 'Remédiation',
        iconName: 'Wrench',
        points: 25,
        matchedCommandPatterns: [/^systemctl\s+stop\s+apache2/, /^killall\s+apache2/, /^kill\s+(-9\s+)?1120/],
        descriptionFr: 'Libération du port 80 pour permettre à Nginx de s\'y attacher.'
      },
      {
        id: 'step_start',
        name: 'Start / Restart Nginx Service',
        nameFr: 'Démarrer / Redémarrer Nginx',
        category: 'action',
        categoryLabelFr: 'Redémarrage',
        iconName: 'Play',
        points: 15,
        matchedCommandPatterns: [/^systemctl\s+(start|restart)\s+nginx/, /^service\s+nginx\s+(start|restart)/],
        descriptionFr: 'Lancement de Nginx une fois le port libéré.'
      },
      {
        id: 'step_verify',
        name: 'Verify Local HTTP Response (curl http://localhost)',
        nameFr: 'Valider le retour HTTP (curl http://localhost)',
        category: 'verify',
        categoryLabelFr: 'Validation',
        iconName: 'Check',
        points: 20,
        matchedCommandPatterns: [/^curl(\s+-[a-zA-Z]+)*\s+http:\/\/(localhost|127\.0\.0\.1)/, /^curl\s+(localhost|127\.0\.0\.1)/],
        descriptionFr: 'Test probe confirmant que le serveur web renvoie bien 200 OK.'
      }
    ],
    penalties: {
      blindRestart: -10,
      repeatedFails: -5
    },
    setupMission: (interpreter: ShellInterpreter) => {
      // 1. Change user & prompt to root on web-prod-01
      interpreter.user = 'root';
      interpreter.cwd = '/root';
      interpreter.env.USER = 'root';
      interpreter.env.HOME = '/root';
      interpreter.env.HOSTNAME = 'web-prod-01';

      // 2. Put Apache2 in active state (conflicting on port 80)
      const apacheSvc = interpreter.servicesManager.getService('apache2');
      if (apacheSvc) {
        apacheSvc.activeState = 'active';
        apacheSvc.subState = 'running';
        apacheSvc.mainPid = 1120;
        apacheSvc.logs = [
          'Started The Apache HTTP Server.',
          'Server configured -- resuming normal operations',
          'AH00094: Command line: \'/usr/sbin/apache2 -D FOREGROUND\''
        ];
      }

      // 3. Put Nginx in failed state
      const nginxSvc = interpreter.servicesManager.getService('nginx');
      if (nginxSvc) {
        nginxSvc.activeState = 'failed';
        nginxSvc.subState = 'failed';
        nginxSvc.mainPid = undefined;
        nginxSvc.logs = [
          'Starting A high performance web server...',
          'nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)',
          'nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)',
          'nginx: [emerg] still could not bind()',
          'nginx.service: Main process exited, code=exited, status=1/FAILURE',
          'Failed to start A high performance web server.'
        ];
      }

      // 4. Add systemd journal entry
      interpreter.servicesManager.addJournalEntry(
        'systemd',
        1,
        'Starting A high performance web server and a reverse proxy server...',
        'info'
      );
      interpreter.servicesManager.addJournalEntry(
        'nginx',
        1040,
        'nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)',
        'err'
      );
      interpreter.servicesManager.addJournalEntry(
        'systemd',
        1,
        'nginx.service: Main process exited, code=exited, status=1/FAILURE',
        'err'
      );
      interpreter.servicesManager.addJournalEntry(
        'systemd',
        1,
        'Failed to start A high performance web server and a reverse proxy server.',
        'err'
      );

      // 5. Ensure web content exists
      interpreter.fs.mkdir('/var/www/html', true, '/', 'root', 'root');
      interpreter.fs.writeFile(
        '/var/www/html/index.html',
        '<!DOCTYPE html>\n<html>\n<head><title>Production Web Portal</title></head>\n<body>\n<h1>Production Web Portal: Online</h1>\n<p>Server: web-prod-01 | Status: ALL SYSTEMS OPERATIONAL</p>\n</body>\n</html>\n'
      );

      // 6. Ensure standard nginx config is ready
      interpreter.fs.mkdir('/etc/nginx/sites-available', true, '/', 'root', 'root');
      interpreter.fs.writeFile(
        '/etc/nginx/nginx.conf',
        'user www-data;\nworker_processes 4;\npid /run/nginx.pid;\n\nevents {\n    worker_connections 768;\n}\n\nhttp {\n    sendfile on;\n    tcp_nopush on;\n    types_hash_max_size 2048;\n    include /etc/nginx/mime.types;\n    default_type application/octet-stream;\n\n    server {\n        listen 80 default_server;\n        listen [::]:80 default_server;\n        root /var/www/html;\n        index index.html;\n        server_name _;\n    }\n}\n'
      );
    },
    checkResolution: (interpreter: ShellInterpreter) => {
      const nginxSvc = interpreter.servicesManager.getService('nginx');
      const apacheSvc = interpreter.servicesManager.getService('apache2');

      const isApacheStopped = !apacheSvc || apacheSvc.activeState !== 'active';
      const isNginxActive = nginxSvc?.activeState === 'active';

      if (isNginxActive && isApacheStopped) {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'Bravo ! Apache2 a été arrêté avec succès et Nginx a pu se lier au port 80. Le site web renvoie 200 OK.',
          scoreMultiplier: 1.0
        };
      } else if (!isApacheStopped) {
        return {
          isResolved: false,
          rootCauseIdentified: true,
          feedbackFr: 'Apache2 écoute toujours sur le port 80 (conflit de liaison). Arrêtez-le avant de lancer Nginx.',
          scoreMultiplier: 0.5
        };
      } else {
        return {
          isResolved: false,
          rootCauseIdentified: false,
          feedbackFr: 'Nginx n\'est pas encore démarré (statut inactive/failed). Utilisez `systemctl start nginx`.',
          scoreMultiplier: 0.3
        };
      }
    },
    rootCauseSummaryFr: 'Un processus Apache2 sauvage avait été activé en tâche de fond sur le port 80, empêchant le socket Nginx de se lier (erreur bind 98: Address already in use).',
    remediationSummaryFr: 'Arrêt du service conflictuel `systemctl stop apache2`, vérification des sockets avec `ss -lntp`, puis relance propre de `systemctl start nginx` et probe HTTP `curl http://localhost`.'
  },

  // ============================================================
  // INCIDENT #017 : db-prod-02 (Disk Full on / causing MariaDB crash)
  // ============================================================
  {
    id: 'mission-017',
    incidentNumber: 'INCIDENT #017',
    title: 'Database Outage — Disk Space Saturated at 100%',
    titleFr: 'Crash Base de Données — Espace Disque Saturé à 100%',
    server: 'db-prod-02',
    service: 'mariadb',
    severity: 'CRITIQUE (P1)',
    timeLimitMinutes: 15,
    symptom: 'Database writes fail with "No space left on device". MariaDB daemon crashed and refuses to restart.',
    symptomFr: 'Les transactions SQL échouent ("No space left on device"). Le démon MariaDB a crashé et refuse de redémarrer.',
    availableInfo: {
      terminalFr: 'Accès shell root (root@db-prod-02:~#)',
      logsFr: 'Journaux systemd & /var/log/mariadb/error.log',
      networkFr: 'Sockets TCP (port 3306), interfaces',
      servicesFr: 'systemctl status mariadb, df -h, du -sh',
      filesystemFr: 'Partition racine (/dev/sda1) et dossier /var/log'
    },
    objectiveFr: 'Analyser l\'utilisation des disques avec df et du, identifier le gros fichier parasite dans /var/log, le supprimer ou le purger, puis redémarrer MariaDB.',
    briefingDialogueFr: 'Alerte base de données ! L\'ERP de production ne peut plus enregistrer de commandes. MariaDB s\'est arrêtée net. Les messages système parlent d\'un disque plein à ras bord. Inspectez l\'espace de stockage, faites de la place et relancez le démon SQL !',
    diagnosticSteps: [
      {
        id: 'step_status',
        name: 'Check MariaDB Service Status',
        nameFr: 'Vérifier l\'état de MariaDB',
        category: 'status',
        categoryLabelFr: 'État Service',
        iconName: 'Activity',
        points: 15,
        matchedCommandPatterns: [/^systemctl\s+status(\s+mariadb)?/, /^service\s+mariadb\s+status/],
        descriptionFr: 'Constat de l\'arrêt du service MariaDB.'
      },
      {
        id: 'step_disk',
        name: 'Check Filesystem Free Space (df -h)',
        nameFr: 'Vérifier l\'espace disque libre (df -h)',
        category: 'config',
        categoryLabelFr: 'Stockage & df',
        iconName: 'HardDrive',
        points: 25,
        matchedCommandPatterns: [/^df(\s+-[a-zA-Z]+)?/],
        descriptionFr: 'Découverte de la partition racine /dev/sda1 saturée à 100% (Avail: 0).'
      },
      {
        id: 'step_du',
        name: 'Locate Large Directories (du -sh /var/log/*)',
        nameFr: 'Localiser les gros fichiers (du / ls -lh)',
        category: 'config',
        categoryLabelFr: 'Analyse Taille',
        iconName: 'Search',
        points: 25,
        matchedCommandPatterns: [/^du(\s+-[a-zA-Z]+)*(\s+\/var\/log.*)?/, /^ls\s+.*\/var\/log/],
        descriptionFr: 'Repérage d\'une fausse archive résiduelle /var/log/backup_huge_dump.log de 34 Go.'
      },
      {
        id: 'step_purge',
        name: 'Delete or Truncate Rogue File (rm /var/log/backup_huge_dump.log)',
        nameFr: 'Purger le fichier parasite (rm)',
        category: 'action',
        categoryLabelFr: 'Purge Espace',
        iconName: 'Trash2',
        points: 25,
        matchedCommandPatterns: [/^rm\s+(-f\s+)?\/var\/log\/backup_huge_dump\.log/, />\s*\/var\/log\/backup_huge_dump\.log/],
        descriptionFr: 'Suppression du fichier géant pour libérer 34 Go d\'espace disque.'
      },
      {
        id: 'step_start_db',
        name: 'Restart MariaDB Service',
        nameFr: 'Redémarrer le service MariaDB',
        category: 'action',
        categoryLabelFr: 'Relance SQL',
        iconName: 'Play',
        points: 20,
        matchedCommandPatterns: [/^systemctl\s+(start|restart)\s+mariadb/],
        descriptionFr: 'Relance propre de MariaDB une fois l\'espace disque restauré.'
      },
      {
        id: 'step_verify_db',
        name: 'Verify MariaDB Active & Listening on 3306',
        nameFr: 'Vérifier l\'écoute sur le port 3306 (ss / systemctl)',
        category: 'verify',
        categoryLabelFr: 'Validation',
        iconName: 'Check',
        points: 15,
        matchedCommandPatterns: [/^systemctl\s+status\s+mariadb/, /^ss(\s+-[a-zA-Z]+)?/, /^mysql/],
        descriptionFr: 'Confirmation que MariaDB tourne et accepte les connexions.'
      }
    ],
    penalties: {
      blindRestart: -10,
      repeatedFails: -5
    },
    setupMission: (interpreter: ShellInterpreter) => {
      interpreter.user = 'root';
      interpreter.cwd = '/root';
      interpreter.env.USER = 'root';
      interpreter.env.HOME = '/root';
      interpreter.env.HOSTNAME = 'db-prod-02';

      // 1. Put MariaDB in failed state
      const mariadbSvc = interpreter.servicesManager.getService('mariadb');
      if (mariadbSvc) {
        mariadbSvc.activeState = 'failed';
        mariadbSvc.subState = 'failed';
        mariadbSvc.logs = [
          'Starting MariaDB 10.11 database server...',
          'mariadbd: [ERROR] Disk is full writing \'/var/lib/mysql/ibdata1\' (Errcode: 28 "No space left on device")',
          'mariadbd: [ERROR] Aborting',
          'mariadb.service: Main process exited, code=exited, status=1/FAILURE',
          'Failed to start MariaDB 10.11 database server.'
        ];
      }

      // 2. Create the huge rogue file in VirtualFS
      interpreter.fs.mkdir('/var/log', true, '/', 'root', 'root');
      interpreter.fs.writeFile(
        '/var/log/backup_huge_dump.log',
        '[ERROR LOG OVERFLOW DUMP]\nTotal dump simulated size: 34 Gigabytes.\nSaturating /dev/sda1 to 100% capacity.'
      );

      interpreter.servicesManager.addJournalEntry(
        'mariadbd',
        900,
        'Disk is full writing /var/lib/mysql/ibdata1 (Errcode: 28 "No space left on device")',
        'err'
      );
      interpreter.servicesManager.addJournalEntry(
        'systemd',
        1,
        'mariadb.service: Main process exited, code=exited, status=1/FAILURE',
        'err'
      );
    },
    checkResolution: (interpreter: ShellInterpreter) => {
      const mariadbSvc = interpreter.servicesManager.getService('mariadb');
      const rogueFile = interpreter.fs.getNode('/var/log/backup_huge_dump.log');

      const isPurged = !rogueFile;
      const isRunning = mariadbSvc?.activeState === 'active';

      if (isPurged && isRunning) {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'Félicitations ! Le disque a été libéré de son fichier parasite de 34 Go et MariaDB est à nouveau pleinement opérationnelle.',
          scoreMultiplier: 1.0
        };
      } else if (!isPurged) {
        return {
          isResolved: false,
          rootCauseIdentified: false,
          feedbackFr: 'Le fichier parasite /var/log/backup_huge_dump.log est toujours présent sur le disque.',
          scoreMultiplier: 0.3
        };
      } else {
        return {
          isResolved: false,
          rootCauseIdentified: true,
          feedbackFr: 'L\'espace est libéré mais le service MariaDB n\'a pas encore été relancé (`systemctl start mariadb`).',
          scoreMultiplier: 0.6
        };
      }
    },
    rootCauseSummaryFr: 'Un script de sauvegarde nocturne défaillant a généré un fichier /var/log/backup_huge_dump.log saturant 100% de la partition racine (Errcode 28: No space left on device).',
    remediationSummaryFr: 'Diagnostic du stockage avec `df -h` et `du -sh /var/log/*`, suppression du fichier via `rm /var/log/backup_huge_dump.log`, puis redémarrage de `systemctl start mariadb`.'
  },

  // ============================================================
  // INCIDENT #089 : gateway-prod-03 (Missing default route)
  // ============================================================
  {
    id: 'mission-089',
    incidentNumber: 'INCIDENT #089',
    title: 'Isolated Host — Missing Default Network Gateway',
    titleFr: 'Serveur Isolé — Perte de la Passerelle Par Défaut',
    server: 'gateway-prod-03',
    service: 'networking',
    severity: 'ÉLEVÉ (P3)',
    timeLimitMinutes: 15,
    symptom: 'Host cannot access the Internet or external APIs ("Network is unreachable"). Local subnet 192.168.1.0/24 works.',
    symptomFr: 'Le serveur est incapable de contacter les API externes ("Network is unreachable"). Le réseau local 192.168.1.0/24 répond.',
    availableInfo: {
      terminalFr: 'Accès shell root (root@gateway-prod-03:~#)',
      logsFr: 'Journaux réseau (dmesg | grep eth0)',
      networkFr: 'Commandes ip addr, ip route, ping',
      servicesFr: 'systemctl status networking',
      filesystemFr: '/etc/network/interfaces et /etc/resolv.conf'
    },
    objectiveFr: 'Inspecter la table de routage avec `ip route`, constater l\'absence de route par défaut (default gateway), ajouter la route vers 192.168.1.1 et tester avec ping 8.8.8.8.',
    briefingDialogueFr: 'Alerte connectivité ! Notre passerelle API gateway-prod-03 ne peut plus contacter les serveurs de paiement Stripe. Le ping vers les passerelles externes renvoie "Network is unreachable". Vérifiez la pile IP et rétablissez la route sortante !',
    diagnosticSteps: [
      {
        id: 'step_ip_addr',
        name: 'Check IP Interface Status (ip addr)',
        nameFr: 'Vérifier l\'adresse IP de l\'interface (ip addr)',
        category: 'network',
        categoryLabelFr: 'Adresses IP',
        iconName: 'Network',
        points: 15,
        matchedCommandPatterns: [/^ip\s+(a|addr|address)/, /^ifconfig/],
        descriptionFr: 'Vérification que l\'interface eth0 a bien l\'IP 192.168.1.50/24.'
      },
      {
        id: 'step_ip_route',
        name: 'Inspect Routing Table (ip route)',
        nameFr: 'Inspecter la table de routage (ip route)',
        category: 'network',
        categoryLabelFr: 'Table Routage',
        iconName: 'Network',
        points: 25,
        matchedCommandPatterns: [/^ip\s+(r|route)/, /^route(\s+-n)?/],
        descriptionFr: 'Découverte critique : aucune route par défaut "default via ..." n\'est présente !'
      },
      {
        id: 'step_ping_fail',
        name: 'Test External Connectivity (ping 8.8.8.8)',
        nameFr: 'Tester le ping externe (ping 8.8.8.8)',
        category: 'network',
        categoryLabelFr: 'Test Ping',
        iconName: 'Zap',
        points: 15,
        matchedCommandPatterns: [/^ping\s+(-c\s+\d+\s+)?8\.8\.8\.8/, /^ping\s+(-c\s+\d+\s+)?1\.1\.1\.1/],
        descriptionFr: 'Constat du message "connect: Network is unreachable".'
      },
      {
        id: 'step_add_route',
        name: 'Add Default Route (ip route add default via 192.168.1.1)',
        nameFr: 'Ajouter la route par défaut (ip route add)',
        category: 'action',
        categoryLabelFr: 'Correction Route',
        iconName: 'Wrench',
        points: 30,
        matchedCommandPatterns: [/^ip\s+route\s+add\s+default\s+via\s+192\.168\.1\.1/],
        descriptionFr: 'Création de la route par défaut vers la passerelle locale 192.168.1.1.'
      },
      {
        id: 'step_ping_success',
        name: 'Verify External Ping Response',
        nameFr: 'Valider le ping sortant (ping -c 2 8.8.8.8)',
        category: 'verify',
        categoryLabelFr: 'Validation',
        iconName: 'Check',
        points: 20,
        matchedCommandPatterns: [/^ping\s+(-c\s+\d+\s+)?8\.8\.8\.8/],
        descriptionFr: 'Confirmation que les paquets ICMP circulent et reviennent avec succès.'
      }
    ],
    penalties: {
      blindRestart: -10,
      repeatedFails: -5
    },
    setupMission: (interpreter: ShellInterpreter) => {
      interpreter.user = 'root';
      interpreter.cwd = '/root';
      interpreter.env.USER = 'root';
      interpreter.env.HOME = '/root';
      interpreter.env.HOSTNAME = 'gateway-prod-03';

      // Remove default route in network simulator
      interpreter.networkSimulator.routes = [
        '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50 metric 100'
      ];
    },
    checkResolution: (interpreter: ShellInterpreter) => {
      const hasDefaultRoute = interpreter.networkSimulator.routes.some((r) =>
        r.includes('default') && r.includes('192.168.1.1')
      );

      if (hasDefaultRoute) {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'Excellent travail ! La route par défaut a été restaurée, le serveur a retrouvé sa connexion Internet complète.',
          scoreMultiplier: 1.0
        };
      } else {
        return {
          isResolved: false,
          rootCauseIdentified: false,
          feedbackFr: 'La route par défaut n\'a pas encore été configurée (`ip route add default via 192.168.1.1`).',
          scoreMultiplier: 0.2
        };
      }
    },
    rootCauseSummaryFr: 'La route par défaut (default gateway) avait sauté suite à un flush de routes, empêchant tout paquet destiné à l\'extérieur du subnet 192.168.1.0/24 de sortir.',
    remediationSummaryFr: 'Inspection de la table de routage via `ip route`, ajout de la passerelle `ip route add default via 192.168.1.1 dev eth0`, puis vérification par `ping 8.8.8.8`.'
  },

  // ============================================================
  // INCIDENT #104 : app-prod-04 (HTTP 403 Forbidden - Broken Permissions)
  // ============================================================
  {
    id: 'mission-104',
    incidentNumber: 'INCIDENT #104',
    title: 'HTTP 403 Forbidden — Incorrect Web Directory Permissions',
    titleFr: 'Erreur HTTP 403 Forbidden — Permissions Incorrectes sur /var/www',
    server: 'app-prod-04',
    service: 'nginx',
    severity: 'MAJEUR (P2)',
    timeLimitMinutes: 15,
    symptom: 'Web server is running, but all web requests return HTTP 403 Forbidden.',
    symptomFr: 'Le serveur Nginx tourne, mais toutes les requêtes renvoient une erreur HTTP 403 Forbidden.',
    availableInfo: {
      terminalFr: 'Accès shell root (root@app-prod-04:~#)',
      logsFr: 'Fichier de log /var/log/nginx/error.log (13: Permission denied)',
      networkFr: 'curl -I http://localhost',
      servicesFr: 'systemctl status nginx',
      filesystemFr: 'ls -ld /var/www/html et chmod'
    },
    objectiveFr: 'Constater l\'erreur 403 Forbidden avec curl, inspecter /var/log/nginx/error.log, corriger les droits avec chmod 755 /var/www/html et 644 sur index.html, puis valider avec curl.',
    briefingDialogueFr: 'Déploiement catastrophique ce matin ! Le nouveau script CI/CD a écrasé les droits Unix du dossier web. Les clients tombent sur une page 403 Forbidden. Nginx tourne mais n\'a plus le droit de lire les fichiers. Remettez les permissions FHS aux normes !',
    diagnosticSteps: [
      {
        id: 'step_curl_403',
        name: 'Probe HTTP Status (curl -I http://localhost)',
        nameFr: 'Tester la réponse HTTP (curl -I localhost)',
        category: 'verify',
        categoryLabelFr: 'Probe HTTP',
        iconName: 'Activity',
        points: 20,
        matchedCommandPatterns: [/^curl(\s+.*)?\s+http:\/\/(localhost|127\.0\.0\.1)/, /^curl\s+-I\s+localhost/],
        descriptionFr: 'Constat de l\'erreur 403 Forbidden renvoyée par Nginx.'
      },
      {
        id: 'step_check_error_log',
        name: 'Read Nginx Error Log (cat /var/log/nginx/error.log)',
        nameFr: 'Lire les logs d\'erreur Nginx',
        category: 'logs',
        categoryLabelFr: 'Logs Nginx',
        iconName: 'FileText',
        points: 25,
        matchedCommandPatterns: [/^cat\s+.*error\.log/, /^tail\s+.*error\.log/, /^grep\s+.*error\.log/],
        descriptionFr: 'Identification du message "open() failed (13: Permission denied)".'
      },
      {
        id: 'step_check_permissions',
        name: 'Inspect File Mode & Owner (ls -la /var/www/html)',
        nameFr: 'Inspecter les permissions (ls -la /var/www)',
        category: 'config',
        categoryLabelFr: 'Droits FHS',
        iconName: 'Lock',
        points: 20,
        matchedCommandPatterns: [/^ls\s+-[a-zA-Z]*l[a-zA-Z]*\s+\/var\/www/],
        descriptionFr: 'Détection du mode d--------- (000) bloquant la lecture pour www-data.'
      },
      {
        id: 'step_fix_permissions',
        name: 'Apply Correct Permissions (chmod 755 / chmod 644)',
        nameFr: 'Appliquer les permissions correctes (chmod 755 / 644)',
        category: 'action',
        categoryLabelFr: 'Remédiation',
        iconName: 'Wrench',
        points: 30,
        matchedCommandPatterns: [/^chmod(\s+-[a-zA-Z]+)*\s+(755|644|\+r)\s+\/var\/www/],
        descriptionFr: 'Rétablissement des droits de traversée et de lecture.'
      },
      {
        id: 'step_verify_200',
        name: 'Verify 200 OK Response (curl http://localhost)',
        nameFr: 'Valider le retour 200 OK (curl http://localhost)',
        category: 'verify',
        categoryLabelFr: 'Validation',
        iconName: 'Check',
        points: 20,
        matchedCommandPatterns: [/^curl(\s+.*)?\s+http:\/\/(localhost|127\.0\.0\.1)/],
        descriptionFr: 'Confirmation que le contenu HTML est désormais servi correctement.'
      }
    ],
    penalties: {
      blindRestart: -10,
      repeatedFails: -5
    },
    setupMission: (interpreter: ShellInterpreter) => {
      interpreter.user = 'root';
      interpreter.cwd = '/root';
      interpreter.env.USER = 'root';
      interpreter.env.HOME = '/root';
      interpreter.env.HOSTNAME = 'app-prod-04';

      // Nginx is active
      const nginxSvc = interpreter.servicesManager.getService('nginx');
      if (nginxSvc) {
        nginxSvc.activeState = 'active';
        nginxSvc.subState = 'running';
        nginxSvc.mainPid = 1040;
      }

      // But /var/www/html has mode 0o000
      interpreter.fs.mkdir('/var/www/html', true, '/', 'root', 'root');
      const htmlDirInit = interpreter.fs.getNode('/var/www/html');
      if (htmlDirInit) {
        htmlDirInit.mode = 0o000;
      }
      interpreter.fs.writeFile(
        '/var/www/html/index.html',
        '<!DOCTYPE html>\n<html><body><h1>Customer App Portal: Restored!</h1></body></html>\n',
        false,
        '/',
        'root',
        'root'
      );
      const htmlFile = interpreter.fs.getNode('/var/www/html/index.html');
      if (htmlFile) {
        htmlFile.mode = 0o000;
      }

      interpreter.fs.mkdir('/var/log/nginx', true, '/', 'root', 'root');
      interpreter.fs.writeFile(
        '/var/log/nginx/error.log',
        '2026/09/20 10:14:02 [error] 1041#1041: *1 open() "/var/www/html/index.html" failed (13: Permission denied), client: 192.168.1.100, server: _, request: "GET / HTTP/1.1", host: "app.company.internal"\n'
      );
    },
    checkResolution: (interpreter: ShellInterpreter) => {
      const htmlDir = interpreter.fs.getNode('/var/www/html');
      const htmlFile = interpreter.fs.getNode('/var/www/html/index.html');

      const isDirReadable = htmlDir && htmlDir.mode !== 0;
      const isFileReadable = htmlFile && htmlFile.mode !== 0;

      if (isDirReadable && isFileReadable) {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'Bravo ! Les permissions Unix ont été restaurées. Les clients accèdent à nouveau à l\'application sans erreur 403.',
          scoreMultiplier: 1.0
        };
      } else {
        return {
          isResolved: false,
          rootCauseIdentified: false,
          feedbackFr: 'Le dossier /var/www/html ou index.html n\'a pas encore les permissions de lecture suffisantes (`chmod 755 /var/www/html`).',
          scoreMultiplier: 0.3
        };
      }
    },
    rootCauseSummaryFr: 'Un script de déploiement automatique avait réinitialisé le mode de /var/www/html en 000, privant le worker Nginx (user www-data) de l\'accès en lecture (erreur 13: Permission denied).',
    remediationSummaryFr: 'Diagnostic du log d\'erreur /var/log/nginx/error.log, inspection des droits avec `ls -ld /var/www/html`, et correction via `chmod 755 /var/www/html && chmod 644 /var/www/html/index.html`.'
  },

  // ============================================================
  // INCIDENT #054 : web01 -> db01 (Ping OK but curl db01:5432 Connection Refused)
  // ============================================================
  {
    id: 'mission-054',
    incidentNumber: 'INCIDENT #054',
    title: 'Database Outage — Ping Responds but TCP 5432 Connection Refused',
    titleFr: 'Panne d\'Accès Base — Ping OK mais Port TCP 5432 Refusé',
    server: 'web01',
    service: 'postgresql (db01)',
    severity: 'CRITIQUE (P1)',
    timeLimitMinutes: 15,
    symptom: 'Web backend cannot communicate with database. Ping db01 works normally, but curl db01:5432 fails with "Connection refused".',
    symptomFr: 'L\'application web ne peut plus joindre la base de données. Le ping db01 fonctionne normalement, mais curl db01:5432 échoue avec « Connection refused ».',
    availableInfo: {
      terminalFr: 'Accès shell root sur web01 (root@web01:~#)',
      logsFr: 'Fichier de log applicatif /var/log/app/backend.log',
      networkFr: 'Commandes ip addr, ip route, ping, nc -zv db01 5432, curl db01:5432',
      servicesFr: 'Contrôle à distance : ssh db01 "systemctl status postgresql"',
      filesystemFr: '/etc/hosts et /var/log'
    },
    objectiveFr: 'Dérouler la démarche de diagnostic en 5 étapes : valider l\'IP locale, la route, la résolution DNS/ICMP, constater le refus de port TCP 5432, inspecter puis démarrer le service PostgreSQL sur db01 via SSH, et valider la connexion.',
    briefingDialogueFr: 'Alerte P1 de l\'équipe applicative ! Le portail e-commerce affiche "Database unavailable". Un développeur junior affirme que la base tourne car "le ping db01 répond avec 0% de perte". Vous êtes sur web01. Déroulez la méthode en 5 étapes (IP -> Route -> DNS -> Port -> Service) et résolvez l\'incident !',
    diagnosticSteps: [
      {
        id: 'step_ip',
        name: 'Check Local IP & Interface (ip addr)',
        nameFr: 'Vérifier l\'interface et l\'IP locale (ip addr)',
        category: 'network',
        categoryLabelFr: 'Interface IP',
        iconName: 'Network',
        points: 15,
        matchedCommandPatterns: [/^ip\s+(a|addr|address)/, /^ifconfig/],
        descriptionFr: 'Constat que eth0 est active avec l\'adresse 192.168.1.10/24 (IP OK).'
      },
      {
        id: 'step_route',
        name: 'Inspect Routing Table (ip route)',
        nameFr: 'Vérifier la table de routage (ip route)',
        category: 'network',
        categoryLabelFr: 'Table Routage',
        iconName: 'Network',
        points: 15,
        matchedCommandPatterns: [/^ip\s+(r|route)/, /^route(\s+-n)?/],
        descriptionFr: 'Validation de la route locale directe vers le sous-réseau 192.168.1.0/24 (Route OK).'
      },
      {
        id: 'step_ping_dns',
        name: 'Test DNS Resolution & ICMP Reachability (ping db01)',
        nameFr: 'Tester la résolution DNS et l\'ICMP (ping db01)',
        category: 'network',
        categoryLabelFr: 'Résolution & ICMP',
        iconName: 'Zap',
        points: 20,
        matchedCommandPatterns: [/^ping\s+(-c\s+\d+\s+)?db01/, /^host\s+db01/, /^nslookup\s+db01/, /^getent\s+hosts\s+db01/],
        descriptionFr: 'Confirmation que le nom db01 résout en 192.168.1.20 et que la couche 3 répond (DNS OK).'
      },
      {
        id: 'step_port_refused',
        name: 'Detect Closed TCP Port (curl db01:5432 / nc -zv db01 5432)',
        nameFr: 'Détecter le port TCP fermé (curl db01:5432 / nc)',
        category: 'network',
        categoryLabelFr: 'Test Socket TCP',
        iconName: 'Activity',
        points: 25,
        matchedCommandPatterns: [/^curl(\s+.*)?\s+(http:\/\/)?db01:5432/, /^nc(\s+.*)?\s+db01\s+5432/, /^psql\s+.*db01/, /^telnet\s+db01\s+5432/],
        descriptionFr: 'Découverte du rejet TCP explicite : Connection refused sur le port 5432 (Port fermé).'
      },
      {
        id: 'step_remote_status',
        name: 'Inspect Remote Service Status via SSH (systemctl status postgresql)',
        nameFr: 'Inspecter l\'état distant (ssh db01 "systemctl status postgresql")',
        category: 'status',
        categoryLabelFr: 'Statut Démon',
        iconName: 'Activity',
        points: 25,
        matchedCommandPatterns: [/^ssh\s+.*db01\s+.*systemctl\s+status\s+postgresql/],
        descriptionFr: 'Identification de la cause racine : le service PostgreSQL est arrêté (inactive dead).'
      },
      {
        id: 'step_remote_start',
        name: 'Start PostgreSQL on db01 via SSH (systemctl start postgresql)',
        nameFr: 'Démarrer PostgreSQL sur db01 via SSH',
        category: 'action',
        categoryLabelFr: 'Remédiation',
        iconName: 'Wrench',
        points: 30,
        matchedCommandPatterns: [/^ssh\s+.*db01\s+.*systemctl\s+(start|restart)\s+postgresql/],
        descriptionFr: 'Démarrage du démon PostgreSQL ouvrant le socket d\'écoute 5432 sur db01.'
      },
      {
        id: 'step_verify_probe',
        name: 'Validate TCP Connection (curl db01:5432 / nc -zv db01 5432)',
        nameFr: 'Valider la connexion TCP restaurée',
        category: 'verify',
        categoryLabelFr: 'Validation',
        iconName: 'Check',
        points: 20,
        matchedCommandPatterns: [/^curl(\s+.*)?\s+(http:\/\/)?db01:5432/, /^nc(\s+.*)?\s+db01\s+5432/],
        descriptionFr: 'Confirmation que le port 5432 accepte à nouveau les connexions.'
      }
    ],
    penalties: {
      blindRestart: -10,
      repeatedFails: -5
    },
    setupMission: (interpreter: ShellInterpreter) => {
      interpreter.user = 'root';
      interpreter.cwd = '/root';
      interpreter.env.USER = 'root';
      interpreter.env.HOME = '/root';
      interpreter.env.HOSTNAME = 'web01';

      // Reset network topology: db01 port 5432 closed
      interpreter.networkSimulator.resetToDefaultState();

      // Write error log
      interpreter.fs.mkdir('/var/log/app', true, '/', 'root', 'root');
      interpreter.fs.writeFile(
        '/var/log/app/backend.log',
        '2026-09-20 10:20:01 [CRITICAL] DatabaseConnectionError: could not connect to server: Connection refused\n\tIs the server running on host "db01" (192.168.1.20) and accepting TCP/IP connections on port 5432?\n'
      );
    },
    checkResolution: (interpreter: ShellInterpreter) => {
      const isPortOpen = interpreter.networkSimulator.nodes.db01.ports.find((p) => p.port === 5432)?.state === 'open';
      const diag = interpreter.networkSimulator.diagnosticProgress;

      if (isPortOpen && (diag.probeVerified || diag.serviceStarted)) {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'Bravo ! Vous avez appliqué la démarche en 5 étapes avec rigueur : IP OK -> Route OK -> DNS OK -> Port fermé -> Service démarré. PostgreSQL répond sur 5432 !',
          scoreMultiplier: 1.0
        };
      } else if (!isPortOpen) {
        return {
          isResolved: false,
          rootCauseIdentified: diag.serviceInspected,
          feedbackFr: 'Le service PostgreSQL sur db01 est toujours arrêté. Utilisez : `ssh db01 "systemctl start postgresql"`.',
          scoreMultiplier: 0.4
        };
      } else {
        return {
          isResolved: true,
          rootCauseIdentified: true,
          feedbackFr: 'PostgreSQL est démarré. Validez la connexion avec `curl db01:5432` ou `nc -zv db01 5432`.',
          scoreMultiplier: 0.9
        };
      }
    },
    rootCauseSummaryFr: 'Le démon PostgreSQL sur le serveur distant db01 était arrêté (inactive dead). Bien que le ping (ICMP couche 3) réponde, aucun processus n\'écoutait sur le port TCP 5432 (couche 4), générant l\'erreur TCP Connection Refused.',
    remediationSummaryFr: 'Démarche 5 étapes : vérification IP (`ip addr`), vérification de la table de routage (`ip route`), validation de la résolution et ICMP (`ping db01`), détection du port fermé (`curl db01:5432`), constat du service arrêté via SSH (`ssh db01 "systemctl status postgresql"`), relance du démon (`ssh db01 "systemctl start postgresql"`), et validation finale probe TCP.'
  }
];

export const RESOLVED_MISSIONS_STORAGE_KEY = 'lpi_resolved_missions_v1';
export const MISSION_COMPLETION_EVENT = 'lpi_mission_completed';

export function getResolvedMissionIds(): string[] {
  try {
    const raw = localStorage.getItem(RESOLVED_MISSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordMissionCompleted(missionId: string, methodologyScore: number): void {
  try {
    const current = getResolvedMissionIds();
    if (!current.includes(missionId)) {
      const updated = [...current, missionId];
      localStorage.setItem(RESOLVED_MISSIONS_STORAGE_KEY, JSON.stringify(updated));
    }
    // Also save high score
    const scoreKey = `lpi_mission_score_${missionId}`;
    const previousScore = parseInt(localStorage.getItem(scoreKey) || '0', 10);
    if (methodologyScore > previousScore) {
      localStorage.setItem(scoreKey, methodologyScore.toString());
    }

    window.dispatchEvent(
      new CustomEvent(MISSION_COMPLETION_EVENT, { detail: { missionId, methodologyScore } })
    );
    window.dispatchEvent(new Event('storage'));
  } catch {}
}
