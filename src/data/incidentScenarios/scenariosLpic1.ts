import { IncidentScenario } from '../../types';

export const lpic1IncidentScenarios: IncidentScenario[] = [
  // =========================================================================
  // INCIDENT 1 : SERVEUR INACCESSIBLE (BOOT / SYSTEMD / FSTAB / SSH)
  // =========================================================================
  {
    id: 'incident-01-boot-hang',
    title: 'Serveur inaccessible après redémarrage',
    titleFr: 'Serveur inaccessible : Blocage systemd au démarrage & SSH hors-ligne',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.1',
    category: 'System Boot & Storage Dependencies',
    context:
      'Un serveur de base de données de production a été redémarré suite à une maintenance matérielle planifiée. Depuis, la machine ne répond plus sur le réseau. Vous devez intervenir d\'urgence via la console KVM de secours.',
    contextFr:
      'Un serveur de base de données de production a été redémarré suite à une maintenance planifiée. Depuis, la machine ne répond plus sur le réseau. Vous devez intervenir d\'urgence via la console KVM / IPMI de secours.',
    symptoms: [
      'L\'écran GRUB apparaît normalement',
      'Le noyau Linux démarre et charge les pilotes',
      'systemd entre en mode secours (emergency mode) et bloque avant multi-user.target',
      'Le démon SSH (sshd) est inaccessible depuis le réseau local'
    ],
    symptomsFr: [
      'L\'écran GRUB apparaît normalement',
      'Le noyau Linux démarre et charge les pilotes',
      'systemd entre en mode secours (emergency mode) et bloque avant multi-user.target',
      'Le démon SSH (sshd) est inaccessible depuis le réseau local'
    ],
    diagnosticCommands: [
      {
        command: 'journalctl -xb',
        aliases: ['journalctl', 'journalctl -xe', 'journalctl -b'],
        category: 'logs',
        isKeyEvidence: true,
        output: `systemd[1]: Starting File System Check on /dev/disk/by-uuid/9f8a2c10-41ab-4e32-9011-8899aabbccdd...
systemd[1]: Mounting /mnt/backup...
systemd[1]: Timed out waiting for device /dev/disk/by-uuid/9f8a2c10-41ab-4e32-9011-8899aabbccdd.
systemd[1]: Dependency failed for /mnt/backup.
systemd[1]: Dependency failed for Local File Systems.
systemd[1]: Triggering OnFailure= dependencies.
systemd[1]: You are in emergency mode. After logging in, type "journalctl -xb" to view
systemd[1]: system logs, "systemctl reboot" to reboot, "systemctl default" or ^D to
systemd[1]: try again to boot into default mode.
Give root password for maintenance
(or press Control-D to continue):`,
        analysis:
          'Crucial evidence: systemd timed out waiting for the storage device corresponding to UUID 9f8a2c10-... mounted on /mnt/backup. Because this mount is treated as a mandatory dependency, systemd refused to transition to local-fs.target, blocking multi-user.target and dropping into emergency mode.',
        analysisFr:
          'Élément clé : systemd a dépassé le délai d\'attente pour le disque /mnt/backup (UUID 9f8a2c10-...). Comme ce montage n\'a pas l\'option nofail, il est considéré comme une dépendance bloquante. systemd a avorté local-fs.target et a basculé en emergency mode.'
      },
      {
        command: 'systemctl status ssh',
        aliases: ['systemctl status sshd'],
        category: 'systemd',
        output: `○ ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: inactive (dead)
       Docs: man:sshd(8)
             man:sshd_config(5)

Notice: Unit ssh.service is enabled, but dependencies (multi-user.target, network.target) were never reached.`,
        analysis:
          'The SSH daemon is enabled, but remains inactive because the target milestone multi-user.target was never reached due to the earlier boot failure.',
        analysisFr:
          'Le service SSH est bien activé (enabled), mais il est inactif (dead) car les cibles prérequises (multi-user.target et network.target) n\'ont jamais été atteintes.'
      },
      {
        command: 'ip addr',
        aliases: ['ip a'],
        category: 'network',
        output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff`,
        analysis:
          'The physical interface eth0 is present in the kernel, but is currently in DOWN state with no IP assigned because network management services were not started in emergency mode.',
        analysisFr:
          'L\'interface réseau physique eth0 est bien reconnue par le noyau, mais son état est DOWN sans adresse IP car les services réseau sont ignorés en mode secours.'
      },
      {
        command: 'ip route',
        aliases: ['ip r'],
        category: 'network',
        output: `(no output - routing table is empty)`,
        analysis:
          'No default gateway or static routes exist because networking stack has not been initialized.',
        analysisFr:
          'La table de routage est totalement vide. Aucune passerelle par défaut n\'est configurée.'
      },
      {
        command: 'ss -lntp',
        aliases: ['ss -tulnp', 'netstat -tlpn'],
        category: 'network',
        output: `State    Recv-Q   Send-Q     Local Address:Port     Peer Address:Port   Process
(no listening sockets active on port 22)`,
        analysis:
          'Zero network services are listening. Port 22 is completely closed.',
        analysisFr:
          'Aucun socket n\'écoute sur le réseau. Le port 22 n\'est pas ouvert.'
      },
      {
        command: 'df -h',
        category: 'storage',
        output: `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        40G   14G   24G  37% /
udev            3.9G     0  3.9G   0% /dev
tmpfs           794M  1.1M  793M   1% /run`,
        analysis:
          'The root filesystem /dev/sda1 is mounted and has 24GB of free space. Notice that /mnt/backup is absent from the mounted list.',
        analysisFr:
          'Le système de fichiers racine /dev/sda1 dispose de 24 Go d\'espace libre. On constate que /mnt/backup n\'apparaît pas dans la liste des volumes montés.'
      },
      {
        command: 'mount',
        category: 'storage',
        isKeyEvidence: true,
        output: `/dev/sda1 on / type ext4 (ro,relatime,errors=remount-ro)
devtmpfs on /dev type devtmpfs (rw,nosuid,size=4026856k,nr_inodes=1006714,mode=755)
tmpfs on /run type tmpfs (rw,nosuid,nodev,size=812800k,nr_inodes=812800,mode=755)`,
        analysis:
          'Crucial observation: /dev/sda1 on / is mounted Read-Only (ro). When in emergency mode, the root filesystem is mounted ro for safety. Any attempt to edit files like /etc/fstab will fail with "Read-only file system" unless remounted with "mount -o remount,rw /".',
        analysisFr:
          'Observation capitale : la partition racine est montée en LECTURE SEULE (ro). Toute tentative d\'éditer /etc/fstab échouera avec l\'erreur "Read-only file system" sans un remount préalable (mount -o remount,rw /).'
      },
      {
        command: 'cat /etc/fstab',
        aliases: ['less /etc/fstab'],
        category: 'storage',
        isKeyEvidence: true,
        output: `# /etc/fstab: static file system information.
# <file system>                             <mount point>   <type>  <options>       <dump>  <pass>
UUID=c4b182e0-2231-487e-9cf4-d784fa6e3199  /               ext4    errors=remount-ro 0       1
UUID=9f8a2c10-41ab-4e32-9011-8899aabbccdd  /mnt/backup     ext4    defaults        0       2
UUID=3829-11AE                             /boot/efi       vfat    umask=0077      0       1`,
        analysis:
          'Smoking gun found! Line 3 contains: UUID=9f8a2c10-... /mnt/backup ext4 defaults 0 2. Because options are just "defaults", systemd treats this as a critical boot dependency. The storage unit or USB disk has been detached or changed UUID, triggering the boot lockup.',
        analysisFr:
          'Cause identifiée : La ligne /mnt/backup possède uniquement les options "defaults". Pour systemd, c\'est un montage bloquant (pass=2 et pas de nofail). Le disque externe ou la baie de backup étant débranchée ou ayant changé d\'UUID, le boot est interrompu.'
      },
      {
        command: 'systemctl --failed',
        category: 'systemd',
        output: `  UNIT           LOAD   ACTIVE SUB    DESCRIPTION
● mnt-backup.mount loaded failed failed /mnt/backup

LOAD   = Reflects whether the unit definition was properly loaded.
ACTIVE = The high-level unit activation state.
SUB    = The low-level unit activation state.
1 loaded units listed.`,
        analysis:
          'systemctl --failed immediately flags mnt-backup.mount as the sole failed unit causing system halt.',
        analysisFr:
          'systemctl --failed isole immédiatement mnt-backup.mount comme l\'unique unité en échec responsable du blocage.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Piste 1 : Consulter les unités en échec et les journaux',
        titleFr: 'Piste 1 : Consulter les unités en échec et les journaux',
        hint: 'Exécutez "systemctl --failed" ou "journalctl -xb". Regardez quelle ressource système ou quel point de montage a dépassé son délai d\'attente.',
        hintFr: 'Exécutez "systemctl --failed" ou "journalctl -xb". Regardez quelle ressource système ou quel point de montage a dépassé son délai d\'attente.',
        penaltyPoints: 2
      },
      {
        level: 2,
        title: 'Piste 2 : Analyser le fichier /etc/fstab et l\'état de la racine',
        titleFr: 'Piste 2 : Analyser le fichier /etc/fstab et l\'état de la racine',
        hint: 'Inspectez "/etc/fstab" et observez comment la racine est montée via "mount". Pourquoi systemd considère-t-il le volume de sauvegarde comme bloquant ?',
        hintFr: 'Inspectez "/etc/fstab" et observez comment la racine est montée via "mount". Pourquoi systemd considère-t-il le volume de sauvegarde comme bloquant ?',
        penaltyPoints: 4
      },
      {
        level: 3,
        title: 'Piste 3 : Cause racine & procédure de réparation en mode secours',
        titleFr: 'Piste 3 : Cause racine & procédure de réparation en mode secours',
        hint: 'L\'entrée /mnt/backup n\'a pas l\'option "nofail". Comme le disque est absent, systemd bloque. De plus, la racine étant en lecture seule ("ro"), il faut d\'abord lancer "mount -o remount,rw /" avant de pouvoir modifier /etc/fstab ou le commenter.',
        hintFr: 'L\'entrée /mnt/backup n\'a pas l\'option "nofail". Comme le disque est absent, systemd bloque. De plus, la racine étant en lecture seule ("ro"), il faut d\'abord lancer "mount -o remount,rw /" avant de pouvoir modifier /etc/fstab ou le commenter.',
        penaltyPoints: 6
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Diagnostic de la Cause Racine (RCA)',
        titleFr: '1. Diagnostic de la Cause Racine (RCA)',
        question: 'Quelle est la cause fondamentale du blocage du démarrage et de l\'inaccessibilité SSH ?',
        questionFr: 'Quelle est la cause fondamentale du blocage du démarrage et de l\'inaccessibilité SSH ?',
        options: [
          {
            id: 'opt-1a',
            text: 'Le disque dur principal /dev/sda1 est plein à 100% et empêche l\'écriture des sockets SSH.',
            textFr: 'Le disque dur principal /dev/sda1 est plein à 100% et empêche l\'écriture des sockets SSH.',
            isCorrect: false,
            feedback: 'Faux : df -h montre que /dev/sda1 a encore 24 Go d\'espace libre (37% d\'utilisation).'
          },
          {
            id: 'opt-1b',
            text: 'Une entrée dans /etc/fstab (/mnt/backup) pointe vers un disque manquant sans option "nofail", bloquant local-fs.target et empêchant d\'atteindre multi-user.target.',
            textFr: 'Une entrée dans /etc/fstab (/mnt/backup) pointe vers un disque manquant sans option "nofail", bloquant local-fs.target et empêchant d\'atteindre multi-user.target.',
            isCorrect: true,
            feedback: 'Exact ! systemd traite par défaut les entrées fstab comme critiques. Sans "nofail", un disque absent bloque la chaîne de démarrage.'
          },
          {
            id: 'opt-1c',
            text: 'Le service sshd a été désactivé (systemctl disable ssh) lors de la mise à jour.',
            textFr: 'Le service sshd a été désactivé (systemctl disable ssh) lors de la mise à jour.',
            isCorrect: false,
            feedback: 'Faux : "systemctl status ssh" montre que l\'unité est bien "enabled", mais que sa cible parente multi-user.target n\'a jamais été atteinte.'
          },
          {
            id: 'opt-1d',
            text: 'Le pilote de la carte réseau eth0 a été supprimé par le nouveau noyau.',
            textFr: 'Le pilote de la carte réseau eth0 a été supprimé par le nouveau noyau.',
            isCorrect: false,
            feedback: 'Faux : l\'interface eth0 est bien présente dans "ip addr", mais inactive car les services réseau sont ignorés en mode secours.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Action Corrective Immédiate (Mitigation)',
        titleFr: '2. Action Corrective Immédiate (Mitigation)',
        question: 'Depuis la console d\'urgence, quelle est la première commande obligatoire pour pouvoir éditer la configuration système ?',
        questionFr: 'Depuis la console d\'urgence, quelle est la première commande obligatoire pour pouvoir éditer la configuration système ?',
        options: [
          {
            id: 'opt-2a',
            text: 'mount -o remount,rw /',
            textFr: 'mount -o remount,rw /',
            isCorrect: true,
            feedback: 'Exactement ! En mode secours, le système de fichiers racine est monté en lecture seule (ro). Il faut obligatoirement le remonter en rw.'
          },
          {
            id: 'opt-2b',
            text: 'systemctl restart sshd',
            textFr: 'systemctl restart sshd',
            isCorrect: false,
            feedback: 'Inopérant : le réseau n\'est pas configuré et les dépendances du service ne sont pas satisfaites.'
          },
          {
            id: 'opt-2c',
            text: 'mkfs.ext4 /dev/sda1',
            textFr: 'mkfs.ext4 /dev/sda1',
            isCorrect: false,
            feedback: 'Dangereux ! Cela formaterait et détruirait immédiatement l\'ensemble du système d\'exploitation.'
          },
          {
            id: 'opt-2d',
            text: 'dhclient eth0',
            textFr: 'dhclient eth0',
            isCorrect: false,
            feedback: 'Même si eth0 obtenait une IP, le système resterait bloqué en mode secours sans services applicatifs.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'prevention',
        title: '3. Solution Pérenne & Post-Mortem',
        titleFr: '3. Solution Pérenne & Post-Mortem',
        question: 'Comment configurer l\'entrée /mnt/backup dans /etc/fstab pour qu\'un disque de sauvegarde absent ne bloque plus jamais le démarrage du serveur ?',
        questionFr: 'Comment configurer l\'entrée /mnt/backup dans /etc/fstab pour qu\'un disque de sauvegarde absent ne bloque plus jamais le démarrage du serveur ?',
        options: [
          {
            id: 'opt-3a',
            text: 'Ajouter les options "defaults,nofail,x-systemd.device-timeout=5" dans le champ options de la ligne /mnt/backup.',
            textFr: 'Ajouter les options "defaults,nofail,x-systemd.device-timeout=5" dans le champ options de la ligne /mnt/backup.',
            isCorrect: true,
            feedback: 'Parfait ! L\'option nofail indique à systemd de continuer le boot si le périphérique est absent, et x-systemd.device-timeout évite d\'attendre 90s inutilement.'
          },
          {
            id: 'opt-3b',
            text: 'Passer la valeur du champ <dump> de 0 à 1 dans /etc/fstab.',
            textFr: 'Passer la valeur du champ <dump> de 0 à 1 dans /etc/fstab.',
            isCorrect: false,
            feedback: 'Le champ dump concerne l\'ancien utilitaire dump de sauvegarde et n\'a aucun impact sur systemd.'
          },
          {
            id: 'opt-3c',
            text: 'Définir le point de montage dans /etc/exports.',
            textFr: 'Définir le point de montage dans /etc/exports.',
            isCorrect: false,
            feedback: '/etc/exports sert à partager des dossiers via NFS, pas à monter des disques locaux.'
          },
          {
            id: 'opt-3d',
            text: 'Créer un lien symbolique de /mnt/backup vers /tmp.',
            textFr: 'Créer un lien symbolique de /mnt/backup vers /tmp.',
            isCorrect: false,
            feedback: 'Inapproprié : cela écraserait les sauvegardes au redémarrage et ne résout pas la configuration fstab.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'L\'incident a été provoqué par le débranchement d\'une unité de sauvegarde externe couplée à une directive fstab sans option de tolérance aux pannes (nofail). systemd a considéré l\'échec de montage comme critique et a basculé en emergency mode, suspendant le démarrage des services réseau et SSH.',
      timeline: [
        'T0: Redémarrage du serveur planifié suite à une mise à jour matérielle.',
        'T+15s: GRUB charge le noyau Linux 6.1 et les pilotes.',
        'T+20s: systemd commence le montage des systèmes de fichiers locaux (local-fs.target).',
        'T+1m50s: Délai d\'attente de 90s expiré pour l\'UUID du disque /mnt/backup.',
        'T+1m51s: Échec de dépendance : systemd bascule en emergency mode et monte la racine en lecture seule (ro).',
        'T+2m00s: Alerte monitoring : hôte injoignable sur le port 22.',
        'T+10m00s: Intervention ingénieur : remount en rw, modification de fstab avec nofail, et reboot réussi vers multi-user.target.'
      ],
      sysadminKeyTakeaways: [
        'Toujours spécifier "nofail" et un timeout réduit ("x-systemd.device-timeout=5s") pour tout volume non indispensable au système d\'exploitation (backup, USB, disques secondaires).',
        'En mode secours systemd, la racine est par sécurité toujours en "ro". La commande réflexe est "mount -o remount,rw /".',
        '"systemctl --failed" et "journalctl -xb" sont les deux outils d\'investigation prioritaires en cas de bascule en mode emergency.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 2 : ÉPUISEMENT DES INODES (DF -H OK MAIS DISQUE PLEIN)
  // =========================================================================
  {
    id: 'incident-02-inode-exhaustion',
    title: 'Disque saturé : Erreur "No space left on device" avec 50% d\'espace libre',
    titleFr: 'Crash applicatif : "No space left on device" alors que df -h affiche 50 Go libres !',
    severity: 'HIGH',
    timeLimitMinutes: 15,
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.1',
    category: 'Filesystems & Inodes',
    context:
      'Le serveur web Nginx et la base de données MariaDB crashent en boucle. Les logs rapportent "Error: write failed: No space left on device". Pourtant, l\'équipe de surveillance indique que le disque dur est à moitié vide.',
    contextFr:
      'Le serveur web Nginx et la base MariaDB crashent en continu. Les applications signalent "Error: write failed: No space left on device". Pourtant, le monitoring indique que le disque dispose de 50 Go d\'espace libre.',
    symptoms: [
      'HTTP 500 sur toutes les requêtes dynamiques Nginx / PHP-FPM',
      'MariaDB refuse d\'écrire les tables temporaires et se coupe',
      'La commande "touch /tmp/test" échoue avec : "No space left on device"',
      'La commande standard "df -h" indique pourtant 52 Go d\'espace disponible sur /'
    ],
    symptomsFr: [
      'HTTP 500 sur toutes les requêtes dynamiques Nginx / PHP-FPM',
      'MariaDB refuse d\'écrire les tables temporaires et se coupe',
      'La commande "touch /tmp/test" échoue avec : "No space left on device"',
      'La commande standard "df -h" indique pourtant 52 Go d\'espace disponible sur /'
    ],
    diagnosticCommands: [
      {
        command: 'df -h',
        category: 'storage',
        output: `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       100G   44G   52G  46% /
udev            7.8G     0  7.8G   0% /dev
tmpfs           1.6G  1.2M  1.6G   1% /run`,
        analysis:
          'Standard block space shows 52GB available (only 46% used). This contradicts the "No space left on device" error, pointing directly to metadata/inode exhaustion or quota limits.',
        analysisFr:
          'L\'espace bloc standard montre 52 Go disponibles (46% utilisé). La saturation ne vient pas des octets, ce qui oriente immédiatement vers les inodes ou les quotas.'
      },
      {
        command: 'df -i',
        category: 'storage',
        isKeyEvidence: true,
        output: `Filesystem       Inodes   IUsed   IFree IUse% Mounted on
/dev/sda2       6553600 6553600       0  100% /
udev            2042100     512 2041588    1% /dev
tmpfs           2047800    1140 2046660    1% /run`,
        analysis:
          'CRITICAL EVIDENCE: df -i reveals that 100% of the 6,553,600 filesystem inodes on /dev/sda2 are completely consumed (IFree = 0). When a filesystem has 0 free inodes, Linux cannot create even a 0-byte file and returns ENOSPC ("No space left on device").',
        analysisFr:
          'PREUVE CRUCIALE : df -i révèle que 100% des 6 553 600 inodes de la partition / sont consommés (IFree = 0). Sans inode disponible, Linux ne peut plus créer aucun fichier (même de 0 octet) et renvoie ENOSPC ("No space left on device").'
      },
      {
        command: 'systemctl status mariadb',
        category: 'systemd',
        output: `● mariadb.service - MariaDB 10.6 database server
     Loaded: loaded (/lib/systemd/system/mariadb.service; enabled)
     Active: failed (Result: exit-code) since Mon 2026-09-18 10:14:22 UTC; 8min ago
    Process: 4120 ExecStart=/usr/sbin/mariadbd (code=exited, status=1/FAILURE)
   Main PID: 4120 (code=exited, status=1/FAILURE)

Sep 18 10:14:22 srv-db01 mariadbd[4120]: [ERROR] mysqld: Can't create/write to file '/tmp/ib7Z8a' (Errcode: 28 "No space left on device")`,
        analysis:
          'MariaDB failed because creating temporary tables in /tmp failed with POSIX error 28 (ENOSPC).',
        analysisFr:
          'MariaDB a planté car la création de tables temporaires dans /tmp renvoie l\'erreur POSIX 28 (ENOSPC).'
      },
      {
        command: 'journalctl -u nginx --no-pager -n 10',
        aliases: ['journalctl -u nginx'],
        category: 'logs',
        output: `2026/09/18 10:15:01 [crit] 3840#3840: *1290 open() "/var/lib/nginx/fastcgi/2/14/0000000142" failed (28: No space left on device)
2026/09/18 10:15:02 [error] 3840#3840: *1291 FastCGI sent in stderr: "PHP message: PHP Fatal error: Uncaught Exception: Session write failed in /var/www/html/index.php"`,
        analysis:
          'Nginx FastCGI buffer directory cannot create temporary fastcgi response spool files.',
        analysisFr:
          'Le cache Nginx et PHP-FPM ne peuvent plus créer de fichiers de session ou de buffer temporaire.'
      },
      {
        command: 'find /var/spool -type f | wc -l',
        aliases: ['find /var -type f | wc -l'],
        category: 'storage',
        isKeyEvidence: true,
        output: `5894120`,
        analysis:
          'Massive anomaly: Nearly 5.9 million files reside inside /var/spool! A runaway process or mail loop has generated millions of tiny files.',
        analysisFr:
          'Anomalie majeure : Près de 5,9 millions de fichiers se trouvent dans /var/spool ! Une boucle d\'envoi de mails ou un cron a généré des millions de micro-fichiers.'
      },
      {
        command: 'ls -1 /var/spool/postfix/maildrop | head -n 15',
        aliases: ['ls /var/spool/postfix/maildrop', 'ls /var/spool/mail'],
        category: 'storage',
        output: `3A192B401
3A192B402
3A192B403
3A192B404
3A192B405
3A192B406
3A192B407
... (over 5 million unsent cron error notification files in maildrop queue)`,
        analysis:
          'Smoking gun: A failing cronjob running every minute generated millions of unsent mail files in Postfix maildrop queue because local MTA delivery was disabled.',
        analysisFr:
          'Cause isolée : Un cron défaillant s\'exécutant chaque minute a accumulé des millions de notifications d\'échec dans la file /var/spool/postfix/maildrop.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Piste 1 : Différencier l\'espace en octets et la table des métadonnées',
        titleFr: 'Piste 1 : Différencier l\'espace en octets et la table des métadonnées',
        hint: 'Un système de fichiers ext4 alloue un nombre fixe d\'inodes à sa création. Utilisez "df -i" pour vérifier le taux d\'utilisation des descripteurs de fichiers.',
        hintFr: 'Un système de fichiers ext4 alloue un nombre fixe d\'inodes à sa création. Utilisez "df -i" pour vérifier le taux d\'utilisation des descripteurs de fichiers.',
        penaltyPoints: 2
      },
      {
        level: 2,
        title: 'Piste 2 : Localiser le répertoire contenant des millions de fichiers',
        titleFr: 'Piste 2 : Localiser le répertoire contenant des millions de fichiers',
        hint: 'Cherchez dans /var/spool ou /var/tmp quel sous-dossier monopolise des millions d\'inodes avec la commande "find /var/spool -type f | wc -l".',
        hintFr: 'Cherchez dans /var/spool ou /var/tmp quel sous-dossier monopolise des millions d\'inodes avec la commande "find /var/spool -type f | wc -l".',
        penaltyPoints: 4
      },
      {
        level: 3,
        title: 'Piste 3 : Procédure de purge et mise en garde sur "rm *"',
        titleFr: 'Piste 3 : Procédure de purge et mise en garde sur "rm *"',
        hint: 'Faire "rm *" dans un dossier contenant 5 millions de fichiers échouera avec "Argument list too long". Utilisez "find /var/spool/postfix/maildrop -type f -delete" pour purger les fichiers par lots.',
        hintFr: 'Faire "rm *" dans un dossier contenant 5 millions de fichiers échouera avec "Argument list too long". Utilisez "find /var/spool/postfix/maildrop -type f -delete" pour purger les fichiers par lots.',
        penaltyPoints: 6
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause Racine de l\'erreur "No space left on device"',
        titleFr: '1. Cause Racine de l\'erreur "No space left on device"',
        question: 'Pourquoi le système renvoie-t-il ENOSPC alors que df -h affiche 52 Go disponibles ?',
        questionFr: 'Pourquoi le système renvoie-t-il ENOSPC alors que df -h affiche 52 Go disponibles ?',
        options: [
          {
            id: 'opt-2a',
            text: 'La table des inodes est épuisée à 100% (df -i = 0 IFree) suite à l\'accumulation de 5,8 millions de micro-fichiers dans /var/spool.',
            textFr: 'La table des inodes est épuisée à 100% (df -i = 0 IFree) suite à l\'accumulation de 5,8 millions de micro-fichiers dans /var/spool.',
            isCorrect: true,
            feedback: 'Bravo ! Chaque fichier nécessite au minimum un inode. Quand les inodes sont à 100%, la création de tout nouveau fichier est bloquée.'
          },
          {
            id: 'opt-2b',
            text: 'La mémoire RAM est totalement épuisée et le swap est plein.',
            textFr: 'La mémoire RAM est totalement épuisée et le swap est plein.',
            isCorrect: false,
            feedback: 'Faux : cela provoquerait des erreurs Out Of Memory (OOM Killer), pas l\'erreur de stockage ENOSPC.'
          },
          {
            id: 'opt-2c',
            text: 'Le système de fichiers est passé en mode lecture seule (ro) à cause d\'une erreur de câble SATA.',
            textFr: 'Le système de fichiers est passé en mode lecture seule (ro) à cause d\'une erreur de câble SATA.',
            isCorrect: false,
            feedback: 'Faux : mount montre que la partition est bien en rw.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Commande efficace de purge d\'urgence',
        titleFr: '2. Commande efficace de purge d\'urgence',
        question: 'Quelle commande permet de purger rapidement les millions de fichiers sans planter avec "Argument list too long" ?',
        questionFr: 'Quelle commande permet de purger rapidement les millions de fichiers sans planter avec "Argument list too long" ?',
        options: [
          {
            id: 'opt-22a',
            text: 'find /var/spool/postfix/maildrop -type f -delete',
            textFr: 'find /var/spool/postfix/maildrop -type f -delete',
            isCorrect: true,
            feedback: 'Exact ! find -delete opère directement au niveau noyau sans charger l\'ensemble des arguments en mémoire dans le shell.'
          },
          {
            id: 'opt-22b',
            text: 'rm -rf /var/spool/postfix/maildrop/*',
            textFr: 'rm -rf /var/spool/postfix/maildrop/*',
            isCorrect: false,
            feedback: 'Échouera avec "Argument list too long" car le shell bash ne peut pas développer des millions de fichiers dans les paramètres de la commande.'
          },
          {
            id: 'opt-22c',
            text: 'reboot',
            textFr: 'reboot',
            isCorrect: false,
            feedback: 'Un redémarrage ne supprime pas les fichiers du disque.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'prevention',
        title: '3. Mesure Préventive Post-Mortem',
        titleFr: '3. Mesure Préventive Post-Mortem',
        question: 'Comment empêcher les tâches cron de saturer le spool mail à l\'avenir ?',
        questionFr: 'Comment empêcher les tâches cron de saturer le spool mail à l\'avenir ?',
        options: [
          {
            id: 'opt-23a',
            text: 'Définir MAILTO="" au début du fichier crontab ou rediriger la sortie des scripts vers /dev/null ou un logger dédié.',
            textFr: 'Définir MAILTO="" au début du fichier crontab ou rediriger la sortie des scripts vers /dev/null ou un logger dédié.',
            isCorrect: true,
            feedback: 'Parfait ! Si aucun serveur mail local n\'est configuré, MAILTO="" évite la création de milliers de courriels d\'erreur par jour.'
          },
          {
            id: 'opt-23b',
            text: 'Augmenter la taille du swap dans /etc/fstab.',
            textFr: 'Augmenter la taille du swap dans /etc/fstab.',
            isCorrect: false,
            feedback: 'Le swap n\'a rien à voir avec les inodes d\'un système de fichiers.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Un script cron défaillant exécuté toutes les minutes produisait des messages d\'erreur que le démon cron tentait d\'envoyer par mail local. En l\'absence de serveur MTA actif, 5,8 millions de messages se sont empilés dans /var/spool/postfix/maildrop, saturant 100% des inodes du système de fichiers ext4.',
      timeline: [
        'T-7 jours : Déploiement d\'une tâche cron de synchronisation avec un paramètre invalide.',
        'T-48h : Le spool de messagerie dépasse 3 millions de fichiers.',
        'T-0h : Atteinte du plafond de 6 553 600 inodes. Blocage immédiat de toutes les écritures.',
        'T+5m : Crash de MariaDB et mise en échec de Nginx FastCGI.',
        'T+12m : Diagnostic via "df -i", identification du dossier incriminé, purge par "find -delete" et libération instantanée de 5,8 millions d\'inodes.'
      ],
      sysadminKeyTakeaways: [
        'Toujours surveiller "df -i" (inodes) au même titre que "df -h" (octets) dans les sondes de monitoring (Zabbix, Prometheus node_exporter).',
        'Ne jamais lancer "rm *" sur un dossier contenant plus de 50 000 fichiers sous peine d\'erreur E2BIG ("Argument list too long"). Préférer "find ... -delete".',
        'Paramétrer explicitement MAILTO="" ou rediriger les cronjobs vers des fichiers de logs logrotate.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 3 : CONFLIT DE PORT 80/443 (PROCESSUS FANTÔME NGINX/APACHE)
  // =========================================================================
  {
    id: 'incident-03-port-collision',
    title: 'Serveur Web hors-ligne : Échec "Address already in use" sur le port 80',
    titleFr: 'Service Apache2 refuse de démarrer : "Address already in use: make_sock" sur le port 80',
    severity: 'MEDIUM',
    timeLimitMinutes: 10,
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.1',
    category: 'System Services & Networking Sockets',
    context:
      'L\'équipe Web a tenté de relancer Apache2 après avoir renouvelé le certificat SSL. Le service refuse catégoriquement de démarrer et renvoie une erreur critique. Le site d\'entreprise est en panne.',
    contextFr:
      'L\'équipe Web a tenté de relancer Apache2 après avoir renouvelé le certificat SSL. Le service refuse catégoriquement de démarrer et renvoie une erreur critique. Le site d\'entreprise est en panne.',
    symptoms: [
      'La commande "systemctl start apache2" se termine avec exit-code 1',
      'Le site web renvoie "Connection refused" ou une page d\'erreur',
      'journalctl indique : (98)Address already in use: AH00072: make_sock: could not bind to address [::]:80'
    ],
    symptomsFr: [
      'La commande "systemctl start apache2" se termine avec exit-code 1',
      'Le site web renvoie "Connection refused" ou une page d\'erreur',
      'journalctl indique : (98)Address already in use: AH00072: make_sock: could not bind to address [::]:80'
    ],
    diagnosticCommands: [
      {
        command: 'systemctl status apache2',
        category: 'systemd',
        output: `● apache2.service - The Apache HTTP Server
     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
     Active: failed (Result: exit-code) since Mon 2026-09-18 11:32:01 UTC; 2min ago
    Process: 6280 ExecStart=/usr/sbin/apachectl start (code=exited, status=1/FAILURE)

Sep 18 11:32:01 srv-web01 apachectl[6280]: (98)Address already in use: AH00072: make_sock: could not bind to address [::]:80
Sep 18 11:32:01 srv-web01 apachectl[6280]: (98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80
Sep 18 11:32:01 srv-web01 apachectl[6280]: no listening sockets available, shutting down`,
        analysis:
          'Apache cannot start because another process is already bound to TCP port 80 (errno 98: EADDRINUSE).',
        analysisFr:
          'Apache ne peut pas démarrer car un autre processus est déjà lié au port TCP 80 (errno 98: EADDRINUSE).'
      },
      {
        command: 'ss -lntp',
        aliases: ['ss -tlpn', 'ss -tulnp', 'netstat -tlpn'],
        category: 'network',
        isKeyEvidence: true,
        output: `State    Recv-Q   Send-Q     Local Address:Port     Peer Address:Port   Process
LISTEN   0        128              0.0.0.0:22              0.0.0.0:*       users:(("sshd",pid=850,fd=3))
LISTEN   0        511              0.0.0.0:80              0.0.0.0:*       users:(("nginx",pid=4912,fd=6))
LISTEN   0        128                 [::]:22                 [::]:*       users:(("sshd",pid=850,fd=4))
LISTEN   0        511                 [::]:80                 [::]:*       users:(("nginx",pid=4912,fd=7))`,
        analysis:
          'CRITICAL EVIDENCE: ss -lntp shows that process "nginx" with PID 4912 is actively listening on port 80! An orphan Nginx instance or test server is monopolizing the web socket.',
        analysisFr:
          'PREUVE CRUCIALE : ss -lntp montre que le processus "nginx" avec le PID 4912 écoute déjà activement sur le port 80 ! Une instance orpheline Nginx monopolise le port web.'
      },
      {
        command: 'lsof -i :80',
        category: 'network',
        output: `COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx   4912     root    6u  IPv4  38192      0t0  TCP *:http (LISTEN)
nginx   4913 www-data    6u  IPv4  38192      0t0  TCP *:http (LISTEN)`,
        analysis:
          'lsof confirms Nginx master process (PID 4912) and worker process (PID 4913) are holding the TCP port 80 descriptor.',
        analysisFr:
          'lsof confirme que le processus maître Nginx (PID 4912) et son worker (PID 4913) détiennent le descripteur du port 80.'
      },
      {
        command: 'ps -ef | grep nginx',
        category: 'process',
        output: `root      4912     1  0 10:45 ?        00:00:00 nginx: master process /usr/sbin/nginx -g daemon on;
www-data  4913  4912  0 10:45 ?        00:00:00 nginx: worker process
admin     6390  5810  0 11:34 pts/0    00:00:00 grep --color=auto nginx`,
        analysis:
          'Nginx was launched manually or left running before Apache was configured.',
        analysisFr:
          'Nginx a été lancé en arrière-plan ou n\'a pas été désactivé lors de la migration vers Apache.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Piste 1 : Identifier le processus occupant le port 80',
        titleFr: 'Piste 1 : Identifier le processus occupant le port 80',
        hint: 'Exécutez "ss -lntp" ou "lsof -i :80" pour afficher le nom du processus et le PID qui occupe déjà le port HTTP.',
        hintFr: 'Exécutez "ss -lntp" ou "lsof -i :80" pour afficher le nom du processus et le PID qui occupe déjà le port HTTP.',
        penaltyPoints: 2
      },
      {
        level: 2,
        title: 'Piste 2 : Arrêter le service concurrent',
        titleFr: 'Piste 2 : Arrêter le service concurrent',
        hint: 'Le processus concurrent identifié est "nginx". Utilisez systemctl pour arrêter et désactiver nginx, ou terminez le processus avec kill/pkill.',
        hintFr: 'Le processus concurrent identifié est "nginx". Utilisez systemctl pour arrêter et désactiver nginx, ou terminez le processus avec kill/pkill.',
        penaltyPoints: 3
      },
      {
        level: 3,
        title: 'Piste 3 : Relance et validation du socket Apache',
        titleFr: 'Piste 3 : Relance et validation du socket Apache',
        hint: 'Lancez "systemctl stop nginx && systemctl disable nginx", puis "systemctl start apache2". Vérifiez enfin avec "ss -lntp" qu\'apache2 écoute bien.',
        hintFr: 'Lancez "systemctl stop nginx && systemctl disable nginx", puis "systemctl start apache2". Vérifiez enfin avec "ss -lntp" qu\'apache2 écoute bien.',
        penaltyPoints: 5
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause de l\'erreur (98)Address already in use',
        titleFr: '1. Cause de l\'erreur (98)Address already in use',
        question: 'Pourquoi Apache2 ne peut-il pas ouvrir le port 80 ?',
        questionFr: 'Pourquoi Apache2 ne peut-il pas ouvrir le port 80 ?',
        options: [
          {
            id: 'opt-31a',
            text: 'Un serveur Nginx orphelin (PID 4912) écoute déjà sur le port 80 TCP.',
            textFr: 'Un serveur Nginx orphelin (PID 4912) écoute déjà sur le port 80 TCP.',
            isCorrect: true,
            feedback: 'Exact ! Deux processus ne peuvent pas binder la même combinaison IP:Port sans option spéciale SO_REUSEPORT.'
          },
          {
            id: 'opt-31b',
            text: 'Le pare-feu iptables bloque les connexions entrantes sur le port 80.',
            textFr: 'Le pare-feu iptables bloque les connexions entrantes sur le port 80.',
            isCorrect: false,
            feedback: 'Faux : iptables filtrerait les paquets réseau, mais n\'empêcherait pas le serveur d\'ouvrir le socket localement.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Résolution immédiate',
        titleFr: '2. Résolution immédiate',
        question: 'Quelle séquence de commandes libère le port et remet le service Apache en production ?',
        questionFr: 'Quelle séquence de commandes libère le port et remet le service Apache en production ?',
        options: [
          {
            id: 'opt-32a',
            text: 'systemctl stop nginx && systemctl disable nginx && systemctl start apache2',
            textFr: 'systemctl stop nginx && systemctl disable nginx && systemctl start apache2',
            isCorrect: true,
            feedback: 'Parfait ! Cela libère le port 80 et active le démarrage pérenne d\'Apache2.'
          },
          {
            id: 'opt-32b',
            text: 'reboot',
            textFr: 'reboot',
            isCorrect: false,
            feedback: 'Si Nginx est activé au boot, le problème réapparaîtra au redémarrage.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Un test préalable avec Nginx avait été réalisé par un sous-traitant. Nginx était resté actif en écoute sur le port 80, bloquant l\'ouverture du socket par Apache.',
      timeline: [
        'T0: Renouvellement du certificat Apache et commande "systemctl restart apache2".',
        'T+1s: Échec d\'Apache car le port 80 est occupé par Nginx.',
        'T+3m: Diagnostic via "ss -lntp" montrant le PID Nginx.',
        'T+5m: Arrêt de Nginx et démarrage réussi d\'Apache.'
      ],
      sysadminKeyTakeaways: [
        'Pour tout incident de type EADDRINUSE (Address already in use), la commande réflexe est "ss -lntp" ou "lsof -i :PORT".',
        'Toujours désactiver (systemctl disable) les serveurs web concurrents installés sur la même machine pour éviter les collisions au boot.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 4 : VERROUILLAGE SSH (PERMISSIONS CLÉS & STRICTMODES)
  // =========================================================================
  {
    id: 'incident-04-ssh-permissions',
    title: 'Rejet des connexions SSH par clé ("Permission denied (publickey)")',
    titleFr: 'Verrouillage SSH : Rejet systématique des clés privées ("Permission denied (publickey)")',
    severity: 'HIGH',
    timeLimitMinutes: 12,
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.2',
    category: 'Security & OpenSSH Hardening',
    context:
      'Suite à un script d\'intégration automatisé qui a corrigé les droits utilisateurs, plus aucun administrateur ne parvient à se connecter en SSH au serveur de calcul. Le client SSH affiche "Permission denied (publickey)". La console iLO locale reste accessible.',
    contextFr:
      'Suite à l\'exécution d\'un script de déploiement, tous les accès SSH par clé sont rejetés avec l\'erreur "Permission denied (publickey)". Vous êtes connecté via la console physique de secours.',
    symptoms: [
      'Connexion "ssh admin@serveur" échoue avec : "admin@serveur: Permission denied (publickey)"',
      'Le mode bavard "ssh -vvv" montre que la clé id_ed25519 est bien proposée au serveur mais refusée',
      'Le service sshd est bien actif et écoute sur le port 22'
    ],
    symptomsFr: [
      'Connexion "ssh admin@serveur" échoue avec : "admin@serveur: Permission denied (publickey)"',
      'Le mode bavard "ssh -vvv" montre que la clé id_ed25519 est bien proposée au serveur mais refusée',
      'Le service sshd est bien actif et écoute sur le port 22'
    ],
    diagnosticCommands: [
      {
        command: 'journalctl -u ssh -e',
        aliases: ['tail -n 25 /var/log/auth.log', 'cat /var/log/auth.log'],
        category: 'logs',
        isKeyEvidence: true,
        output: `Sep 18 12:01:14 srv-sec01 sshd[7120]: Connection from 192.168.1.50 port 54210 on 192.168.1.10 port 22 rdomain ""
Sep 18 12:01:14 srv-sec01 sshd[7120]: Authentication refused: bad ownership or modes for directory /home/admin/.ssh
Sep 18 12:01:14 srv-sec01 sshd[7120]: Failed publickey for admin from 192.168.1.50 port 54210 ssh2: ED25519 SHA256:4AbC...
Sep 18 12:01:14 srv-sec01 sshd[7120]: Connection closed by authenticating user admin 192.168.1.50 port 54210 [preauth]`,
        analysis:
          'SMOKING GUN: sshd log explicitly reports: "Authentication refused: bad ownership or modes for directory /home/admin/.ssh". The daemon is strictly enforcing safe permissions (StrictModes) and refuses to read keys from a loose folder.',
        analysisFr:
          'CAUSE IDENTIFIÉE : Le journal de sshd indique textuellement : "Authentication refused: bad ownership or modes for directory /home/admin/.ssh". La directive StrictModes d\'OpenSSH refuse d\'utiliser les clés publiques si le dossier est modifiable par d\'autres utilisateurs.'
      },
      {
        command: 'ls -ld /home/admin /home/admin/.ssh /home/admin/.ssh/authorized_keys',
        category: 'security',
        isKeyEvidence: true,
        output: `drwxr-xr-x 4 admin admin 4096 Sep 18 11:58 /home/admin
drwxrwxrwx 2 admin admin 4096 Sep 18 11:58 /home/admin/.ssh
-rwxrwxrwx 1 admin admin  572 Sep 18 11:58 /home/admin/.ssh/authorized_keys`,
        analysis:
          'CRITICAL VULNERABILITY: /home/admin/.ssh and authorized_keys have mode 777 (rwxrwxrwx). Anyone could write or replace keys. sshd intentionally locks this out.',
        analysisFr:
          'VULNÉRABILITÉ ET BLOCAGE : Le dossier .ssh et le fichier authorized_keys ont les permissions 777 (rwxrwxrwx). N\'importe quel utilisateur local pourrait altérer les clés, ce qui déclenche la sécurité stricte d\'OpenSSH.'
      },
      {
        command: 'grep StrictModes /etc/ssh/sshd_config',
        category: 'security',
        output: `#StrictModes yes (enabled by default in OpenSSH)`,
        analysis:
          'StrictModes is active by default. It requires ~/.ssh to be mode 700 and authorized_keys to be mode 600 (or 644) owned by the user.',
        analysisFr:
          'StrictModes est activé par défaut. Il exige impérativement que ~/.ssh soit en 700 et authorized_keys en 600 ou 644 avec pour propriétaire le compte utilisateur.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Piste 1 : Examiner les journaux d\'authentification',
        titleFr: 'Piste 1 : Examiner les journaux d\'authentification',
        hint: 'Consultez "journalctl -u ssh" ou "/var/log/auth.log". Pourquoi sshd refuse-t-il la clé publique ?',
        hintFr: 'Consultez "journalctl -u ssh" ou "/var/log/auth.log". Pourquoi sshd refuse-t-il la clé publique ?',
        penaltyPoints: 2
      },
      {
        level: 2,
        title: 'Piste 2 : Vérifier les permissions POSIX octales',
        titleFr: 'Piste 2 : Vérifier les permissions POSIX octales',
        hint: 'Exécutez "ls -ld /home/admin/.ssh /home/admin/.ssh/authorized_keys". Les permissions 777 sont strictement proscrites par OpenSSH.',
        hintFr: 'Exécutez "ls -ld /home/admin/.ssh /home/admin/.ssh/authorized_keys". Les permissions 777 sont strictement proscrites par OpenSSH.',
        penaltyPoints: 3
      },
      {
        level: 3,
        title: 'Piste 3 : Appliquer les permissions standards',
        titleFr: 'Piste 3 : Appliquer les permissions standards',
        hint: 'Lancez "chmod 700 /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys && chown -R admin:admin /home/admin/.ssh".',
        hintFr: 'Lancez "chmod 700 /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys && chown -R admin:admin /home/admin/.ssh".',
        penaltyPoints: 4
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause du rejet SSH',
        titleFr: '1. Cause du rejet SSH',
        question: 'Pourquoi sshd refuse-t-il l\'authentification par clé publique ?',
        questionFr: 'Pourquoi sshd refuse-t-il l\'authentification par clé publique ?',
        options: [
          {
            id: 'opt-41a',
            text: 'Les permissions sur ~/.ssh sont trop permissives (777), violant la sécurité StrictModes d\'OpenSSH.',
            textFr: 'Les permissions sur ~/.ssh sont trop permissives (777), violant la sécurité StrictModes d\'OpenSSH.',
            isCorrect: true,
            feedback: 'Exactement ! OpenSSH refuse de lire authorized_keys si le dossier ou le fichier est accessible en écriture par le groupe ou les autres.'
          },
          {
            id: 'opt-41b',
            text: 'La clé privée de l\'utilisateur a expiré sur le serveur.',
            textFr: 'La clé privée de l\'utilisateur a expiré sur le serveur.',
            isCorrect: false,
            feedback: 'Une clé SSH standard n\'a pas de date d\'expiration intégrée sans certificat OpenSSH.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Remédiation des permissions',
        titleFr: '2. Remédiation des permissions',
        question: 'Quelles commandes rétablissent immédiatement les permissions conformes aux standards OpenSSH ?',
        questionFr: 'Quelles commandes rétablissent immédiatement les permissions conformes aux standards OpenSSH ?',
        options: [
          {
            id: 'opt-42a',
            text: 'chmod 700 /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys',
            textFr: 'chmod 700 /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys',
            isCorrect: true,
            feedback: 'Parfait : dossier .ssh en 700 (rwx------) et authorized_keys en 600 (rw-------).'
          },
          {
            id: 'opt-42b',
            text: 'chmod 777 /home/admin/.ssh',
            textFr: 'chmod 777 /home/admin/.ssh',
            isCorrect: false,
            feedback: 'C\'est précisément la cause du problème !'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Un script de maintenance avait exécuté récursivement "chmod -R 777 /home" pour résoudre un problème de droits de partage. OpenSSH a immédiatement verrouillé les accès conformément à la directive de sécurité StrictModes.',
      timeline: [
        'T0: Exécution du script de déploiement altérant les permissions.',
        'T+2m: Déconnexion de la session SSH de l\'administrateur.',
        'T+3m: Impossible de se reconnecter ("Permission denied (publickey)").',
        'T+6m: Analyse des logs auth.log révélant "bad ownership or modes".',
        'T+8m: Rétablissement des permissions 700/600 et restauration immédiate des accès.'
      ],
      sysadminKeyTakeaways: [
        'Ne jamais appliquer de chmod 777 à l\'aveugle.',
        'Le dossier ~/.ssh doit toujours être en 700 (drwx------) et authorized_keys en 600 (-rw-------).',
        'Le répertoire parent du compte (/home/user) ne doit pas non plus être inscriptible par autrui (mode 755 max).'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 5 : PERTE DE CONNECTIVITÉ RÉSEAU & PASSERELLE ABSENTE
  // =========================================================================
  {
    id: 'incident-05-default-gateway',
    title: 'Serveur injoignable après maintenance réseau (Routage & Passerelle)',
    titleFr: 'Perte de connectivité WAN : Serveur injoignable hors du sous-réseau local',
    severity: 'HIGH',
    timeLimitMinutes: 12,
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.2',
    category: 'Network Routing & Interfaces',
    context:
      'Un serveur de passerelle applicative ne parvient plus à communiquer avec l\'extérieur ni avec les autres VLANs d\'entreprise. Les machines situées sur le même switch local peuvent le joindre, mais aucun paquet ne sort.',
    contextFr:
      'Le serveur est joignable uniquement depuis sa propre passerelle locale, mais tout le trafic externe et les accès inter-VLAN sont coupés. Vous êtes connecté sur la console locale.',
    symptoms: [
      'Ping vers 8.8.8.8 ou la passerelle distante renvoie : "Network is unreachable"',
      'Les requêtes DNS externes échouent',
      'Le ping vers une IP du même sous-réseau (ex: 192.168.10.20) fonctionne parfaitement'
    ],
    symptomsFr: [
      'Ping vers 8.8.8.8 ou la passerelle distante renvoie : "Network is unreachable"',
      'Les requêtes DNS externes échouent',
      'Le ping vers une IP du même sous-réseau (ex: 192.168.10.20) fonctionne parfaitement'
    ],
    diagnosticCommands: [
      {
        command: 'ip addr',
        category: 'network',
        output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    inet 127.0.0.1/8 scope host lo
2: ens18: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 192.168.10.15/24 brd 192.168.10.255 scope global ens18`,
        analysis:
          'Interface ens18 is UP and has IP 192.168.10.15 with netmask /24. Local layer 2 connectivity is operational.',
        analysisFr:
          'L\'interface ens18 est UP avec l\'adresse 192.168.10.15/24. Le niveau local (couche 2) fonctionne.'
      },
      {
        command: 'ip route',
        category: 'network',
        isKeyEvidence: true,
        output: `192.168.10.0/24 dev ens18 proto kernel scope link src 192.168.10.15`,
        analysis:
          'CRITICAL EVIDENCE: Notice that "default via <gateway>" is completely MISSING! The kernel only knows how to route to the direct local /24 subnet. Any packet addressed to the outside world is dropped with ENETUNREACH ("Network is unreachable").',
        analysisFr:
          'PREUVE CRUCIALE : La ligne "default via <gateway>" est totalement ABSENTE ! La table de routage ne connaît que le sous-réseau local direct. Tout paquet destiné à l\'extérieur est rejeté avec "Network is unreachable".'
      },
      {
        command: 'cat /etc/netplan/00-installer-config.yaml',
        aliases: ['cat /etc/network/interfaces'],
        category: 'network',
        isKeyEvidence: true,
        output: `network:
  version: 2
  ethernets:
    ens18:
      addresses:
        - 192.168.10.15/24
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
      # Error: routes/gateway4 directive was accidentally removed during last edit!`,
        analysis:
          'In Netplan configuration, the gateway4 or default routes directive was deleted during a network renumbering edit.',
        analysisFr:
          'Dans le fichier Netplan, la directive de route par défaut (routes: - to: default via 192.168.10.1) a été accidentellement supprimée lors de la dernière modification.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Piste 1 : Vérifier la table de routage du noyau',
        titleFr: 'Piste 1 : Vérifier la table de routage du noyau',
        hint: 'Exécutez "ip route". Y a-t-il une passerelle par défaut (default via ...) ?',
        hintFr: 'Exécutez "ip route". Y a-t-il une passerelle par défaut (default via ...) ?',
        penaltyPoints: 2
      },
      {
        level: 2,
        title: 'Piste 2 : Ajouter temporairement la route par défaut',
        titleFr: 'Piste 2 : Ajouter temporairement la route par défaut',
        hint: 'Pour restaurer le flux immédiatement, utilisez "ip route add default via 192.168.10.1 dev ens18".',
        hintFr: 'Pour restaurer le flux immédiatement, utilisez "ip route add default via 192.168.10.1 dev ens18".',
        penaltyPoints: 3
      },
      {
        level: 3,
        title: 'Piste 3 : Pérenniser la configuration dans Netplan',
        titleFr: 'Piste 3 : Pérenniser la configuration dans Netplan',
        hint: 'Ajoutez dans /etc/netplan/00-installer-config.yaml la section "routes: - to: default via: 192.168.10.1" et appliquez avec "netplan apply".',
        hintFr: 'Ajoutez dans /etc/netplan/00-installer-config.yaml la section "routes: - to: default via: 192.168.10.1" et appliquez avec "netplan apply".',
        penaltyPoints: 4
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause de l\'erreur "Network is unreachable"',
        titleFr: '1. Cause de l\'erreur "Network is unreachable"',
        question: 'Pourquoi le serveur ne peut-il joindre aucune adresse IP en dehors de son réseau local ?',
        questionFr: 'Pourquoi le serveur ne peut-il joindre aucune adresse IP en dehors de son réseau local ?',
        options: [
          {
            id: 'opt-51a',
            text: 'La passerelle par défaut (default gateway) est absente de la table de routage.',
            textFr: 'La passerelle par défaut (default gateway) est absente de la table de routage.',
            isCorrect: true,
            feedback: 'Exact ! Sans passerelle par défaut (0.0.0.0/0), le noyau Linux ne sait pas à quel routeur transmettre les paquets externes.'
          },
          {
            id: 'opt-51b',
            text: 'Le câble réseau est déconnecté.',
            textFr: 'Le câble réseau est déconnecté.',
            isCorrect: false,
            feedback: 'Faux : ens18 est dans l\'état UP et le ping local fonctionne.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Commande d\'ajout de route d\'urgence',
        titleFr: '2. Commande d\'ajout de route d\'urgence',
        question: 'Quelle commande CLI permet d\'injecter immédiatement la passerelle 192.168.10.1 ?',
        questionFr: 'Quelle commande CLI permet d\'injecter immédiatement la passerelle 192.168.10.1 ?',
        options: [
          {
            id: 'opt-52a',
            text: 'ip route add default via 192.168.10.1 dev ens18',
            textFr: 'ip route add default via 192.168.10.1 dev ens18',
            isCorrect: true,
            feedback: 'Parfait ! Cela rétablit instantanément la connectivité IP globale.'
          },
          {
            id: 'opt-52b',
            text: 'systemctl restart networking',
            textFr: 'systemctl restart networking',
            isCorrect: false,
            feedback: 'Si la configuration sur disque est erronée, redémarrer le service ne résoudra rien.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Une édition manuelle du fichier Netplan avait supprimé la ligne de passerelle par défaut. La table de routage ne contenait plus que le sous-réseau local /24.',
      timeline: [
        'T0: Modification du fichier netplan et commande "netplan apply".',
        'T+10s: Perte immédiate de toutes les connexions WAN et monitoring.',
        'T+4m: Connexion console et inspection via "ip route".',
        'T+6m: Ajout d\'urgence de la route et correction du YAML Netplan.'
      ],
      sysadminKeyTakeaways: [
        'Toujours vérifier "ip route" après toute modification réseau.',
        'Avec Netplan, tester systématiquement avec "netplan try" (qui annule automatiquement les changements après 120s en cas de perte de liaison) au lieu de "netplan apply" direct.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 06 : PANNE DE DÉMARRAGE - KERNEL PANIC & INITRAMFS MANQUANT
  // =========================================================================
  {
    id: 'incident-06-grub-kernel-panic',
    title: 'Boot Crash: Kernel Panic - VFS: Unable to mount root fs on unknown-block(0,0)',
    titleFr: 'Panne de Démarrage : Kernel Panic - VFS: Unable to mount root fs (Initramfs Tronqué)',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.2',
    category: 'kernel',
    context:
      'Following a scheduled automated kernel update, the server rebooted and stopped dead during startup. The virtual machine console displays a black screen frozen on "Kernel panic - not syncing: VFS: Unable to mount root fs". The OS fails to reach systemd.',
    contextFr:
      'Suite à une mise à jour automatique nocturne du noyau, le serveur a redémarré et s\'est figé immédiatement. La console affiche un écran noir bloqué sur "Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)". Le système ne charge même pas systemd.',
    symptoms: [
      'Console displays: Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)',
      'CPU is halted; keyboard caps lock LED is blinking',
      'The boot process halts within 2 seconds of leaving the GRUB menu',
      'SSH is totally unavailable; ping to host drops 100% of packets'
    ],
    symptomsFr: [
      'La console affiche : Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)',
      'Le processeur est arrêté ; la LED Caps Lock du clavier clignote',
      'Le démarrage se fige moins de 2 secondes après le passage du menu GRUB',
      'SSH est inaccessible ; le ping vers la machine ne répond pas (100% de paquets perdus)'
    ],
    diagnosticCommands: [
      {
        command: 'ls -la /boot',
        aliases: ['ls /boot', 'ls -l /boot'],
        category: 'storage',
        isKeyEvidence: true,
        output: `total 68420
drwxr-xr-x  3 root root     4096 Sep 18 03:15 .
drwxr-xr-x 19 root root     4096 Jan 10 10:22 ..
-rw-r--r--  1 root root   262144 Sep 18 03:14 config-6.1.0-21-amd64
-rw-r--r--  1 root root   261890 Aug 12 14:02 config-6.1.0-18-amd64
drwxr-xr-x  5 root root     4096 Sep 18 03:15 grub
-rw-r--r--  1 root root        0 Sep 18 03:15 initrd.img-6.1.0-21-amd64
-rw-r--r--  1 root root 32891450 Aug 12 14:05 initrd.img-6.1.0-18-amd64
-rw-r--r--  1 root root  7892104 Sep 18 03:14 vmlinuz-6.1.0-21-amd64
-rw-r--r--  1 root root  7841024 Aug 12 14:02 vmlinuz-6.1.0-18-amd64`,
        analysis:
          'SMOKING GUN! Look at initrd.img-6.1.0-21-amd64: its size is EXACTLY 0 bytes! Meanwhile, the previous kernel 6.1.0-18 has a healthy 32MB initrd file. Without a valid initramfs containing storage drivers and filesystem modules, the newly installed kernel 6.1.0-21 cannot mount the root partition, causing an immediate kernel panic!',
        analysisFr:
          'PREUVE MAJEURE ! Regardez initrd.img-6.1.0-21-amd64 : sa taille est de 0 octet ! En revanche, l\'ancien noyau 6.1.0-18 a bien son initrd de 32 Mo. Sans initramfs valide contenant les pilotes de stockage et le module ext4, le nouveau noyau 6.1.0-21 ne peut pas monter la racine, provoquant le Kernel Panic !'
      },
      {
        command: 'df -h /boot',
        aliases: ['df -h', 'df -m /boot'],
        category: 'storage',
        isKeyEvidence: true,
        output: `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       240M  239M     0 100% /boot`,
        analysis:
          'ROOT CAUSE REVEALED! The /boot partition (/dev/sda1) has Use% at 100%! When update-initramfs ran during the package update, it ran out of disk space halfway through building the new initramfs, leaving an empty 0-byte file.',
        analysisFr:
          'CAUSE RACINE DÉVOILÉE ! La partition /boot (/dev/sda1) est saturée à 100% (0 octet disponible) ! Lors de la mise à jour, la commande update-initramfs s\'est arrêtée net par manque d\'espace, laissant un fichier vide de 0 octet.'
      },
      {
        command: 'cat /boot/grub/grub.cfg | grep -E "menuentry |linux |initrd " | head -n 8',
        aliases: ['grep menuentry /boot/grub/grub.cfg'],
        category: 'kernel',
        output: `menuentry 'Debian GNU/Linux' --class debian --class gnu-linux {
	linux	/vmlinuz-6.1.0-21-amd64 root=UUID=7e8b21... ro quiet
	initrd	/initrd.img-6.1.0-21-amd64
}
submenu 'Advanced options for Debian GNU/Linux' {
	menuentry 'Debian GNU/Linux, with Linux 6.1.0-18-amd64' {
		linux	/vmlinuz-6.1.0-18-amd64 root=UUID=7e8b21... ro quiet
		initrd	/initrd.img-6.1.0-18-amd64
	}`,
        analysis:
          'GRUB configuration shows the fallback path: in the GRUB menu, selecting "Advanced options" allows booting directly on the working 6.1.0-18 kernel with its complete initrd.',
        analysisFr:
          'La configuration GRUB révèle la solution de secours immédiate : dans le menu GRUB, choisir "Advanced options" permet de démarrer sur le noyau sain 6.1.0-18 avec son initrd complet de 32 Mo.'
      },
      {
        command: 'dpkg -l "linux-image*" | grep -E "^i[iF]"',
        aliases: ['dpkg -l | grep linux-image'],
        category: 'process',
        output: `ii  linux-image-6.1.0-18-amd64 6.1.85-1 amd64 Linux 6.1 for 64-bit PCs (signed)
iF  linux-image-6.1.0-21-amd64 6.1.90-1 amd64 Linux 6.1 for 64-bit PCs (signed)`,
        analysis:
          'Package status "iF" stands for "half-configured" (failed post-installation script). The package failed because initramfs creation errored out.',
        analysisFr:
          'Le statut "iF" signifie "half-configured" (échec du script post-installation). Le paquet est resté non configuré à cause de l\'échec de création de l\'initramfs.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Observer les fichiers présents dans /boot',
        titleFr: 'Observer les fichiers présents dans /boot',
        hint: 'Examinez la taille des fichiers avec "ls -la /boot". Comparez la taille du nouvel initrd avec l\'ancien.',
        hintFr: 'Examinez la taille des fichiers avec "ls -la /boot". Comparez la taille du nouvel initrd avec l\'ancien.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Vérifier la capacité de la partition /boot',
        titleFr: 'Vérifier la capacité de la partition /boot',
        hint: 'Exécutez "df -h /boot". Une partition /boot séparée saturée à 100% fait échouer silencieusement ou brutalement la génération d\'initramfs.',
        hintFr: 'Exécutez "df -h /boot". Une partition /boot séparée saturée à 100% fait échouer silencieusement ou brutalement la génération d\'initramfs.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Démarrer sur l\'ancien noyau et régénérer',
        titleFr: 'Démarrer sur l\'ancien noyau et régénérer',
        hint: 'Au démarrage GRUB, allez dans "Advanced options" et choisissez le noyau 6.1.0-18. Une fois dans le système, purgez les vieux noyaux inutilisés (apt autoremove --purge), puis régénérez avec "update-initramfs -u -k 6.1.0-21-amd64" et "update-grub".',
        hintFr: 'Au démarrage GRUB, allez dans "Advanced options" et choisissez le noyau 6.1.0-18. Une fois dans le système, purgez les vieux noyaux inutilisés (apt autoremove --purge), puis régénérez avec "update-initramfs -u -k 6.1.0-21-amd64" et "update-grub".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause fondamentale du Kernel Panic',
        titleFr: '1. Cause fondamentale du Kernel Panic',
        question: 'Quelle anomalie a provoqué l\'erreur "VFS: Unable to mount root fs on unknown-block(0,0)" ?',
        questionFr: 'Quelle anomalie a provoqué l\'erreur "VFS: Unable to mount root fs on unknown-block(0,0)" ?',
        options: [
          {
            id: 'opt-61a',
            text: 'La partition /boot était pleine à 100%, ce qui a tronqué le fichier initrd.img du nouveau noyau à 0 octet ; le noyau démarre sans pilote de disque et ne peut pas monter la racine.',
            textFr: 'La partition /boot était pleine à 100%, ce qui a tronqué le fichier initrd.img du nouveau noyau à 0 octet ; le noyau démarre sans pilote de disque et ne peut pas monter la racine.',
            isCorrect: true,
            feedback: 'Exact ! Sans initramfs contenant les modules de stockage, le noyau panique immédiatement.'
          },
          {
            id: 'opt-61b',
            text: 'La table de partitionnement GPT a été effacée par une attaque ransomware.',
            textFr: 'La table de partitionnement GPT a été effacée par une attaque ransomware.',
            isCorrect: false,
            feedback: 'Faux : le menu GRUB charge et les disques sont parfaitement lisibles.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Action d\'urgence pour démarrer le système',
        titleFr: '2. Action d\'urgence pour démarrer le système',
        question: 'Comment reprendre la main sur la machine sans Live CD ?',
        questionFr: 'Comment reprendre la main sur la machine sans Live CD ?',
        options: [
          {
            id: 'opt-62a',
            text: 'Sélectionner l\'ancien noyau fonctionnel (Linux 6.1.0-18) dans le sous-menu "Advanced options" de GRUB.',
            textFr: 'Sélectionner l\'ancien noyau fonctionnel (Linux 6.1.0-18) dans le sous-menu "Advanced options" de GRUB.',
            isCorrect: true,
            feedback: 'Parfait ! L\'ancien noyau possède son initrd complet de 32 Mo et démarre sans encombre.'
          },
          {
            id: 'opt-62b',
            text: 'Éditer la ligne GRUB et ajouter "nomodeset".',
            textFr: 'Éditer la ligne GRUB et ajouter "nomodeset".',
            isCorrect: false,
            feedback: 'Inutile : "nomodeset" ne résout que les problèmes d\'affichage vidéo, pas un initrd manquant.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Résolution durable et pérenne',
        titleFr: '3. Résolution durable et pérenne',
        question: 'Une fois le système démarré, quelle séquence de commandes rétablit la propreté du système ?',
        questionFr: 'Une fois le système démarré, quelle séquence de commandes rétablit la propreté du système ?',
        options: [
          {
            id: 'opt-63a',
            text: 'Libérer de l\'espace dans /boot (apt autoremove --purge), puis régénérer avec "update-initramfs -u -k 6.1.0-21-amd64" et "update-grub".',
            textFr: 'Libérer de l\'espace dans /boot (apt autoremove --purge), puis régénérer avec "update-initramfs -u -k 6.1.0-21-amd64" et "update-grub".',
            isCorrect: true,
            feedback: 'Exactement la procédure officielle LPIC-1 pour assainir /boot et finaliser les noyaux.'
          },
          {
            id: 'opt-63b',
            text: 'Supprimer le dossier /boot/grub.',
            textFr: 'Supprimer le dossier /boot/grub.',
            isCorrect: false,
            feedback: 'Désastreux : cela détruirait le chargeur de démarrage GRUB.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'L\'accumulation d\'anciens noyaux non purgés a saturé la partition /boot dédiée de 240 Mo. Lors de l\'installation du nouveau noyau, la génération d\'initrd a échoué par manque d\'espace, laissant un fichier vide de 0 octet qui a déclenché un Kernel Panic au boot.',
      timeline: [
        'T0: Exécution de unattended-upgrades installant linux-image-6.1.0-21-amd64.',
        'T+45s: Saturation à 100% de /boot pendant update-initramfs ; initrd tronqué.',
        'T+4h: Redémarrage programmé du serveur.',
        'T+4h02s: Kernel panic immédiat au chargement du noyau 6.1.0-21.',
        'T+4h15m: Sélection de l\'ancien noyau 6.1.0-18 dans GRUB, purge et régénération de l\'initrd.'
      ],
      sysadminKeyTakeaways: [
        'Configurer la suppression automatique des anciens noyaux non utilisés via "Unattended-Upgrade::Remove-Unused-Kernel-Packages \"true\";".',
        'Dimensionner la partition /boot à au moins 1 Go ou 2 Go sur les installations modernes pour accueillir plusieurs noyaux et leurs initramfs volumineux.',
        'Toujours vérifier "ls -lh /boot" et tester "dpkg --audit" après toute mise à jour de noyau avant de redémarrer.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 07 : PANNE RÉSEAU - RÉSOLUTION DNS APPLICATIVE EN PANNE
  // =========================================================================
  {
    id: 'incident-07-dns-resolution-failure',
    title: 'Network Outage: "curl: (6) Could not resolve host" while "ping 8.8.8.8" works',
    titleFr: 'Panne Réseau : Échec Résolution DNS applicative alors que le ping IP répond',
    severity: 'HIGH',
    timeLimitMinutes: 15,
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.2',
    category: 'network',
    context:
      'Application microservices on node app-prod-02 are failing to communicate with payment processors and external databases. Healthchecks fail with "curl: (6) Could not resolve host: api.stripe.com". Pinging raw IP addresses succeeds with 0% packet loss.',
    contextFr:
      'Les microservices sur le serveur app-prod-02 ne peuvent plus joindre les APIs externes ni les bases de données par leur nom de domaine. Les healthchecks échouent avec "curl: (6) Could not resolve host". Pourtant, le ping direct vers des adresses IP (ex: 8.8.8.8) répond parfaitement.',
    symptoms: [
      'curl https://api.stripe.com returns: curl: (6) Could not resolve host: api.stripe.com',
      'ping 8.8.8.8 succeeds in 4.2 ms with 0% packet loss',
      'SSH connections to raw IP addresses work normally',
      'All local service discovery and domain queries fail immediately'
    ],
    symptomsFr: [
      'curl https://api.stripe.com renvoie : curl: (6) Could not resolve host: api.stripe.com',
      'ping 8.8.8.8 répond en 4,2 ms avec 0% de perte de paquets',
      'Les connexions SSH vers des adresses IP brutes fonctionnent sans problème',
      'Toutes les requêtes de résolution de noms échouent instantanément'
    ],
    diagnosticCommands: [
      {
        command: 'cat /etc/resolv.conf',
        aliases: ['cat /etc/resolv.conf', 'head /etc/resolv.conf'],
        category: 'network',
        isKeyEvidence: true,
        output: `# This file is managed by man:systemd-resolved(8).
nameserver 127.0.0.53
options edns0 trust-ad
search production.internal`,
        analysis:
          'The glibc resolver delegates all DNS lookups to local loopback stub resolver 127.0.0.53 (managed by systemd-resolved). If 127.0.0.53 isn\'t listening, all local software loses domain resolution.',
        analysisFr:
          'Le résolveur glibc délègue toutes les résolutions DNS au stub local 127.0.0.53 (géré par systemd-resolved). Si rien n\'écoute sur 127.0.0.53, aucune application ne peut résoudre de noms d\'hôtes.'
      },
      {
        command: 'systemctl status systemd-resolved',
        aliases: ['journalctl -u systemd-resolved', 'systemctl is-active systemd-resolved'],
        category: 'systemd',
        isKeyEvidence: true,
        output: `● systemd-resolved.service - Network Name Resolution
     Loaded: loaded (/lib/systemd/system/systemd-resolved.service; enabled; preset: enabled)
     Active: failed (Result: signal) since Fri 2026-09-18 13:02:19 UTC; 12min ago
   Duration: 4d 2h 18min
       Docs: man:systemd-resolved.service(8)
    Process: 914 ExecStart=/lib/systemd/systemd-resolved (code=killed, signal=SEGV)
   Main PID: 914 (code=killed, signal=SEGV)
     Status: "Shutting down..."

Sep 18 13:02:19 app-prod-02 systemd[1]: systemd-resolved.service: Main process exited, code=killed, status=11/SEGV
Sep 18 13:02:19 app-prod-02 systemd[1]: systemd-resolved.service: Failed with result 'signal'.`,
        analysis:
          'SMOKING GUN! The local DNS resolver daemon systemd-resolved CRASHED with a segmentation fault (SIGSEGV). Because the unit did not have Restart=always enabled, it remained in "failed" state, leaving 127.0.0.53 dead.',
        analysisFr:
          'PREUVE DÉCISIVE ! Le démon local de résolution systemd-resolved a CRASHÉ suite à un signal 11 (SEGV). Comme le service n\'a pas redémarré automatiquement, l\'adresse 127.0.0.53 est restée muette, bloquant tout le serveur.'
      },
      {
        command: 'dig @1.1.1.1 api.stripe.com +short',
        aliases: ['dig @8.8.8.8 google.com', 'nslookup google.com 1.1.1.1'],
        category: 'network',
        isKeyEvidence: true,
        output: `api.stripe.com.edgekey.net.
e13292.dscx.akamaiedge.net.
104.18.28.14
104.18.29.14`,
        analysis:
          'When querying an upstream public DNS server (1.1.1.1) directly via UDP port 53, resolution completes in 6ms! This conclusively proves that outbound UDP/TCP port 53 and internet routing are 100% functional.',
        analysisFr:
          'En interrogeant directement un serveur DNS externe (1.1.1.1) sur le port 53, la résolution aboutit en 6 ms ! Cela prouve irréfutablement que le réseau WAN et le port 53 sortant fonctionnent parfaitement.'
      },
      {
        command: 'ss -lntup | grep 127.0.0.53',
        aliases: ['ss -lntup | grep 53', 'netstat -ulnp | grep 53'],
        category: 'network',
        output: ``,
        analysis:
          'Empty output! Nothing is listening on port 53 of 127.0.0.53. The local stub resolver is completely offline.',
        analysisFr:
          'Sortie vide ! Aucun processus n\'écoute sur le port 53 de 127.0.0.53. Le résolveur local est bel et bien éteint.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Tester un serveur DNS externe avec dig',
        titleFr: 'Tester un serveur DNS externe avec dig',
        hint: 'Exécutez "dig @1.1.1.1 api.stripe.com". Si la réponse arrive, le réseau externe fonctionne et le problème est uniquement local.',
        hintFr: 'Exécutez "dig @1.1.1.1 api.stripe.com". Si la réponse arrive, le réseau externe fonctionne et le problème est uniquement local.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Vérifier l\'état du démon systemd-resolved',
        titleFr: 'Vérifier l\'état du démon systemd-resolved',
        hint: 'Regardez "systemctl status systemd-resolved". Le service est dans l\'état failed.',
        hintFr: 'Regardez "systemctl status systemd-resolved". Le service est dans l\'état failed.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Redémarrer le service de résolution',
        titleFr: 'Redémarrer le service de résolution',
        hint: 'Relancez le démon avec "systemctl restart systemd-resolved". La socket 127.0.0.53 sera immédiatement réactivée.',
        hintFr: 'Relancez le démon avec "systemctl restart systemd-resolved". La socket 127.0.0.53 sera immédiatement réactivée.',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Diagnostic du dysfonctionnement',
        titleFr: '1. Diagnostic du dysfonctionnement',
        question: 'Pourquoi curl échoue-t-il avec "Could not resolve host" alors que ping 8.8.8.8 fonctionne ?',
        questionFr: 'Pourquoi curl échoue-t-il avec "Could not resolve host" alors que ping 8.8.8.8 fonctionne ?',
        options: [
          {
            id: 'opt-71a',
            text: 'Le service local systemd-resolved qui écoute sur 127.0.0.53:53 a crashé, laissant les requêtes DNS des applications sans réponse alors que la connectivité IP globale est intacte.',
            textFr: 'Le service local systemd-resolved qui écoute sur 127.0.0.53:53 a crashé, laissant les requêtes DNS des applications sans réponse alors que la connectivité IP globale est intacte.',
            isCorrect: true,
            feedback: 'Exact ! systemd-resolved était en état failed, rendant 127.0.0.53 inopérant.'
          },
          {
            id: 'opt-71b',
            text: 'Le fichier /etc/hosts a été corrompu par un virus.',
            textFr: 'Le fichier /etc/hosts a été corrompu par un virus.',
            isCorrect: false,
            feedback: 'Faux : /etc/hosts ne contient que localhost, c\'est le résolveur DNS qui est en cause.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Remise en service immédiate',
        titleFr: '2. Remise en service immédiate',
        question: 'Quelle commande rétablit instantanément la résolution de noms ?',
        questionFr: 'Quelle commande rétablit instantanément la résolution de noms ?',
        options: [
          {
            id: 'opt-72a',
            text: 'systemctl restart systemd-resolved',
            textFr: 'systemctl restart systemd-resolved',
            isCorrect: true,
            feedback: 'Parfait ! Le service se relance, ouvre la socket 127.0.0.53 et rétablit le DNS.'
          },
          {
            id: 'opt-72b',
            text: 'ip link set dev eth0 down && ip link set dev eth0 up',
            textFr: 'ip link set dev eth0 down && ip link set dev eth0 up',
            isCorrect: false,
            feedback: 'Inutile et dangereux : l\'interface réseau fonctionne déjà très bien.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Résilience et redémarrage automatique',
        titleFr: '3. Résilience et redémarrage automatique',
        question: 'Comment s\'assurer que systemd relance automatiquement resolved en cas de crash futur ?',
        questionFr: 'Comment s\'assurer que systemd relance automatiquement resolved en cas de crash futur ?',
        options: [
          {
            id: 'opt-73a',
            text: 'Créer un override systemd (systemctl edit systemd-resolved) avec [Service] Restart=always et RestartSec=2s.',
            textFr: 'Créer un override systemd (systemctl edit systemd-resolved) avec [Service] Restart=always et RestartSec=2s.',
            isCorrect: true,
            feedback: 'Excellente réponse LPIC-1 ! Un drop-in systemd garantit la haute disponibilité du service.'
          },
          {
            id: 'opt-73b',
            text: 'Désinstaller libc6.',
            textFr: 'Désinstaller libc6.',
            isCorrect: false,
            feedback: 'Absurde : désinstaller la bibliothèque C détruirait tout le système Linux.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Le démon local systemd-resolved s\'est arrêté inopinément suite à un crash mémoire. En l\'absence de directive de redémarrage automatique, le résolveur stub local 127.0.0.53 est resté inactif pendant 12 minutes, bloquant toute résolution de noms d\'hôtes pour les applications.',
      timeline: [
        'T0: Crash SEGV de systemd-resolved rapporté dans journalctl.',
        'T+10s: Échec des transactions de paiement et levée d\'alerte applicative.',
        'T+3m: Test dig vers 1.1.1.1 confirmant que la couche IP et le transit UDP fonctionnent.',
        'T+5m: Diagnostic systemctl status et redémarrage du service.'
      ],
      sysadminKeyTakeaways: [
        'Toujours configurer "Restart=on-failure" ou "Restart=always" sur les services critiques d\'infrastructure locale.',
        'Savoir diagnostiquer séparément la connectivité IP (ping 8.8.8.8) et la résolution de noms (dig / getent hosts).',
        'Vérifier le lien symbolique /etc/resolv.conf vers /run/systemd/resolve/stub-resolv.conf.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 08 : RESSOURCES MÉMOIRE - POSTGRESQL TUÉ PAR L'OOM KILLER
  // =========================================================================
  {
    id: 'incident-08-oom-killer-database',
    title: 'Database Outage: PostgreSQL Terminated Randomly under Heavy Load (Linux OOM Killer)',
    titleFr: 'Crash Base de Données : PostgreSQL Tué Brutalement par l\'OOM Killer du Noyau',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-1',
    topicNumber: 106,
    objectiveId: '106.1',
    category: 'process',
    context:
      'The primary production PostgreSQL database crashed without warning during end-of-month reporting. The service is dead, yet PostgreSQL log files contain no panic or error message. Client applications receive "Connection refused" on port 5432.',
    contextFr:
      'La base de données PostgreSQL de production s\'est arrêtée net sans avertissement pendant la génération des rapports de fin de mois. Le service est éteint, pourtant les logs PostgreSQL ne contiennent aucun message d\'erreur. Les clients reçoivent "Connection refused" sur le port 5432.',
    symptoms: [
      'PostgreSQL service is inactive/failed; port 5432 is closed',
      'No crash or panic message in /var/log/postgresql/postgresql-15-main.log',
      'systemctl status postgresql reports: "code=killed, signal=KILL"',
      'A massive analytical reporting query was running right before the outage'
    ],
    symptomsFr: [
      'Le service PostgreSQL est inactif/éteint ; le port 5432 est fermé',
      'Aucun message de crash ou d\'erreur dans /var/log/postgresql/postgresql-15-main.log',
      'systemctl status postgresql indique : "code=killed, signal=KILL"',
      'Une lourde requête analytique tournait quelques secondes avant l\'arrêt'
    ],
    diagnosticCommands: [
      {
        command: 'systemctl status postgresql',
        aliases: ['systemctl status postgresql@15-main', 'systemctl is-active postgresql'],
        category: 'systemd',
        isKeyEvidence: true,
        output: `● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; preset: enabled)
     Active: failed (Result: signal) since Fri 2026-09-18 12:58:44 UTC; 8min ago
   Main PID: 1842 (code=killed, signal=KILL)
        CPU: 45.281s

Sep 18 12:58:44 db-node1 systemd[1]: postgresql.service: Main process exited, code=killed, status=9/KILL
Sep 18 12:58:44 db-node1 systemd[1]: postgresql.service: Failed with result 'signal'.`,
        analysis:
          'Crucial observation: The process exited with "status=9/KILL" (SIGKILL). A process cannot catch or ignore SIGKILL, and it produces no internal application stack trace. Only an external entity (like the kernel OOM Killer) sent SIGKILL.',
        analysisFr:
          'Observation cruciale : Le processus est mort avec le signal 9 (SIGKILL). Un processus ne peut ni intercepter ni logger un SIGKILL. Seule une entité externe (comme l\'OOM Killer du noyau) envoie un SIGKILL d\'autorité.'
      },
      {
        command: 'dmesg -T | grep -i -E "oom|out of memory|killed process" | tail -n 8',
        aliases: ['journalctl -k | grep -i oom', 'dmesg | grep oom'],
        category: 'logs',
        isKeyEvidence: true,
        output: `[Fri Sep 18 12:58:43 2026] Out of memory: Killed process 1842 (postgres) total-vm:8412896kB, anon-rss:7841020kB, file-rss:0kB, shmem-rss:204800kB, UID:108 pgtables:16824kB oom_score_adj:0
[Fri Sep 18 12:58:43 2026] oom_reaper: reaped process 1842 (postgres), now anon-rss:0kB, file-rss:0kB, shmem-rss:204800kB`,
        analysis:
          'SMOKING GUN! The Linux kernel Out Of Memory (OOM) killer explicitly murdered PostgreSQL (PID 1842) because it was consuming 7.8 GB of anonymous memory, exhausting system RAM.',
        analysisFr:
          'PREUVE IRRÉFUTABLE ! L\'OOM Killer du noyau Linux a impitoyablement exécuté PostgreSQL (PID 1842) car il consommait 7,8 Go de RAM, saturant toute la mémoire physique du serveur.'
      },
      {
        command: 'free -m',
        aliases: ['free -h', 'swapon --show'],
        category: 'storage',
        isKeyEvidence: true,
        output: `               total        used        free      shared  buff/cache   available
Mem:            7942         620        6840         120         482        7140
Swap:              0           0           0`,
        analysis:
          'CRITICAL INFRASTRUCTURE FLAW: Look at the Swap line: "total 0, used 0, free 0". The server has ZERO swap space configured! When RAM runs out, the kernel has zero buffer to swap out anonymous or inactive pages, instantly forcing the OOM killer into action.',
        analysisFr:
          'DÉFAUT D\'ARCHITECTURE MAJEUR : Regardez la ligne Swap : "total 0". Le serveur n\'a STRICTEMENT AUCUN ESPACE DE SWAP ! Dès que la RAM sature, le noyau n\'a aucune marge de manœuvre et déclenche immédiatement l\'OOM Killer.'
      },
      {
        command: 'cat /proc/sys/vm/overcommit_memory',
        aliases: ['sysctl vm.overcommit_memory'],
        category: 'kernel',
        output: `0`,
        analysis:
          'Default heuristic overcommit (0) allows processes to allocate more virtual memory than physically exists, leading to sudden starvation.',
        analysisFr:
          'Le mode d\'overcommit par défaut (0) autorise les processus à allouer plus de mémoire que ce qui existe physiquement, préparant le terrain pour l\'OOM Killer.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Chercher la cause de la mort brutale par SIGKILL',
        titleFr: 'Chercher la cause de la mort brutale par SIGKILL',
        hint: 'Quand un service s\'arrête avec "status=9/KILL", inspectez le tampon des messages noyau avec "dmesg -T | grep -i oom".',
        hintFr: 'Quand un service s\'arrête avec "status=9/KILL", inspectez le tampon des messages noyau avec "dmesg -T | grep -i oom".',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Vérifier la configuration du Swap',
        titleFr: 'Vérifier la configuration du Swap',
        hint: 'Exécutez "free -m". Observez la quantité totale de Swap configurée sur le serveur.',
        hintFr: 'Exécutez "free -m". Observez la quantité totale de Swap configurée sur le serveur.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Création d\'un swapfile d\'urgence et redémarrage',
        titleFr: 'Création d\'un swapfile d\'urgence et redémarrage',
        hint: 'Créez un fichier d\'échange d\'urgence : "fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile". Puis relancez la base avec "systemctl start postgresql".',
        hintFr: 'Créez un fichier d\'échange d\'urgence : "fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile". Puis relancez la base avec "systemctl start postgresql".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause de l\'arrêt inopiné de la base',
        titleFr: '1. Cause de l\'arrêt inopiné de la base',
        question: 'Pourquoi le service PostgreSQL a-t-il été arrêté sans préavis ?',
        questionFr: 'Pourquoi le service PostgreSQL a-t-il été arrêté sans préavis ?',
        options: [
          {
            id: 'opt-81a',
            text: 'Une requête lourde a consommé toute la mémoire vive sur un serveur dépourvu de Swap (0 Mo) ; le noyau Linux a déclenché l\'OOM Killer et a sacrifié PostgreSQL (SIGKILL).',
            textFr: 'Une requête lourde a consommé toute la mémoire vive sur un serveur dépourvu de Swap (0 Mo) ; le noyau Linux a déclenché l\'OOM Killer et a sacrifié PostgreSQL (SIGKILL).',
            isCorrect: true,
            feedback: 'Exact ! Sans swap de sécurité, le noyau n\'a pas d\'autre choix que de tuer le processus le plus gourmand.'
          },
          {
            id: 'opt-81b',
            text: 'Le mot de passe de l\'administrateur postgres a expiré.',
            textFr: 'Le mot de passe de l\'administrateur postgres a expiré.',
            isCorrect: false,
            feedback: 'Faux : cela n\'arrêterait pas le démon avec un signal 9 du noyau.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Remise en service avec sécurité mémoire',
        titleFr: '2. Remise en service avec sécurité mémoire',
        question: 'Quelle suite d\'actions rétablit le service tout en évitant un nouveau crash immédiat ?',
        questionFr: 'Quelle suite d\'actions rétablit le service tout en évitant un nouveau crash immédiat ?',
        options: [
          {
            id: 'opt-82a',
            text: 'Créer un swapfile de 4 Go (fallocate, mkswap, swapon), puis relancer la base via "systemctl start postgresql".',
            textFr: 'Créer un swapfile de 4 Go (fallocate, mkswap, swapon), puis relancer la base via "systemctl start postgresql".',
            isCorrect: true,
            feedback: 'Parfait ! Le swap fournit la marge mémoire nécessaire pour amortir les pics d\'allocation.'
          },
          {
            id: 'opt-82b',
            text: 'Désactiver le pare-feu.',
            textFr: 'Désactiver le pare-feu.',
            isCorrect: false,
            feedback: 'Aucun rapport avec l\'épuisement de la mémoire RAM.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Protection pérenne du processus contre l\'OOM Killer',
        titleFr: '3. Protection pérenne du processus contre l\'OOM Killer',
        question: 'Comment protéger le processus maître de la base de données pour que le noyau ne le choisisse plus en priorité ?',
        questionFr: 'Comment protéger le processus maître de la base de données pour que le noyau ne le choisisse plus en priorité ?',
        options: [
          {
            id: 'opt-83a',
            text: 'Définir "OOMScoreAdjust=-1000" dans le service systemd de PostgreSQL et dimensionner "work_mem" et "shared_buffers" dans postgresql.conf.',
            textFr: 'Définir "OOMScoreAdjust=-1000" dans le service systemd de PostgreSQL et dimensionner "work_mem" et "shared_buffers" dans postgresql.conf.',
            isCorrect: true,
            feedback: 'Excellente réponse LPIC-1/LPIC-2 ! OOMScoreAdjust=-1000 immunise le processus contre le sacrifice par le noyau.'
          },
          {
            id: 'opt-83b',
            text: 'Supprimer les tables de la base de données.',
            textFr: 'Supprimer les tables de la base de données.',
            isCorrect: false,
            feedback: 'Inacceptable en production.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'L\'absence totale d\'espace de Swap sur une instance de base de données de production a provoqué l\'intervention brutale de l\'OOM Killer lors de l\'exécution conjointe d\'un rapport de fin de mois et des sauvegardes. Le processus PostgreSQL a été tué par SIGKILL.',
      timeline: [
        'T0: Lancement de requêtes analytiques avec tris en mémoire consommant 7,8 Go de RAM.',
        'T+15s: Saturation de la mémoire physique disponible.',
        'T+16s: Déclenchement de l\'OOM Killer du noyau et envoi de SIGKILL au PID 1842.',
        'T+2m: Alertes applicatives "Connection refused".',
        'T+6m: Diagnostic via dmesg, création d\'un swapfile d\'urgence et redémarrage de PostgreSQL.'
      ],
      sysadminKeyTakeaways: [
        'Ne JAMAIS déployer un serveur de production sans swap (même 2 ou 4 Go suffisent à amortir les chocs et permettre au monitoring d\'alerter).',
        'Immuniser les services critiques contre l\'OOM Killer avec "OOMScoreAdjust=-900" dans l\'unité systemd.',
        'Ajuster les paramètres mémoire applicatifs (work_mem, maintenance_work_mem) pour que le cumul des connexions ne puisse pas dépasser la RAM physique.'
      ]
    }
  }
];

