import { TroubleshootingChallenge } from '../types';

export const lpic1Troubleshoot102_2: TroubleshootingChallenge[] = [
  // ==========================================
  // TOPIC 108: ESSENTIAL SYSTEM SERVICES (108.1 - 108.4) [8 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-108-01',
    title: 'Désynchronisation de l\'horloge matérielle RTC avec hwclock',
    titleFr: 'Dérive d\'horloge RTC et synchronisation avec "hwclock --systohc"',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.1',
    category: 'Essential System Services',
    scenario: 'L\'administrateur constate qu\'à chaque redémarrage, le serveur perd l\'heure exacte et revient 3 heures en arrière malgré une heure système synchronisée en NTP pendant le fonctionnement.',
    scenarioFr: 'L\'administrateur constate qu\'à chaque redémarrage, le serveur perd l\'heure exacte et revient 3 heures en arrière malgré une heure système synchronisée en NTP pendant le fonctionnement.',
    codeSnippet: `root@srv:~# date
Wed Feb 19 14:30:00 UTC 2025
root@srv:~# hwclock --show
2025-02-19 11:30:00.123456+00:00
# L'horloge matérielle (RTC) a 3 heures de retard sur l'horloge système !`,
    language: 'bash',
    bugDescription: 'L\'horloge matérielle du BIOS/UEFI (RTC) n\'a pas été synchronisée avec l\'horloge système du noyau (System Time).',
    bugDescriptionFr: 'L\'horloge matérielle du BIOS/UEFI (RTC) n\'a pas été synchronisée avec l\'horloge système du noyau (System Time).',
    options: [
      {
        id: 'opt-1',
        label: 'Écrire l\'heure système dans l\'horloge matérielle avec "hwclock --systohc" (ou "hwclock -w")',
        labelFr: 'Écrire l\'heure système dans l\'horloge matérielle avec "hwclock --systohc" (ou "hwclock -w")',
        isCorrect: true,
        explanation: '"hwclock --systohc" (System to Hardware Clock) copie la date et l\'heure précises du noyau vers la puce RTC de la carte mère.',
        explanationFr: '"hwclock --systohc" (System to Hardware Clock) copie la date et l\'heure précises du noyau vers la puce RTC de la carte mère.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser "hwclock --hctosys" pour forcer l\'heure matérielle sur le noyau',
        labelFr: 'Utiliser "hwclock --hctosys" pour forcer l\'heure matérielle sur le noyau',
        isCorrect: false,
        explanation: 'Cela écraserait la bonne heure du noyau avec la mauvaise heure matérielle.',
        explanationFr: 'Cela écraserait la bonne heure du noyau avec la mauvaise heure matérielle.'
      },
      {
        id: 'opt-3',
        label: 'Remplacer la pile CMOS obligatoirement',
        labelFr: 'Remplacer la pile CMOS obligatoirement',
        isCorrect: false,
        explanation: 'Il s\'agit d\'un défaut de synchronisation logicielle avant tout.',
        explanationFr: 'Il s\'agit d\'un défaut de synchronisation logicielle avant tout.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /etc/adjtime',
        labelFr: 'Supprimer /etc/adjtime',
        isCorrect: false,
        explanation: '/etc/adjtime stocke les facteurs de dérive de hwclock.',
        explanationFr: '/etc/adjtime stocke les facteurs de dérive de hwclock.'
      }
    ],
    correctedSnippet: `hwclock --systohc`,
    fixExplanation: '"hwclock --systohc" sauvegarde l\'heure du système dans l\'horloge matérielle.',
    fixExplanationFr: '"hwclock --systohc" sauvegarde l\'heure du système dans l\'horloge matérielle.'
  },
  {
    id: 'tb-lpic1-108-02',
    title: 'Journald : saturation de l\'espace disque dans /var/log/journal',
    titleFr: 'Nettoyage des journaux volumineux de systemd-journald avec journalctl --vacuum',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.2',
    category: 'Essential System Services',
    scenario: 'La partition racine est saturée à 100%. L\'analyse avec "ncdu /var/log" montre que "/var/log/journal" occupe 15 Go d\'anciens journaux binaires.',
    scenarioFr: 'La partition racine est saturée à 100%. L\'analyse avec "ncdu /var/log" montre que "/var/log/journal" occupe 15 Go d\'anciens journaux binaires.',
    codeSnippet: `root@srv:~# du -sh /var/log/journal
15G     /var/log/journal
root@srv:~# df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   20G     0 100% /`,
    language: 'bash',
    bugDescription: 'systemd-journald a accumulé les logs binaires sans politique de purge stricte configurée dans /etc/systemd/journald.conf.',
    bugDescriptionFr: 'systemd-journald a accumulé les logs binaires sans politique de purge stricte configurée dans /etc/systemd/journald.conf.',
    options: [
      {
        id: 'opt-1',
        label: 'Purger proprement les journaux avec "journalctl --vacuum-size=500M" (ou --vacuum-time=7d)',
        labelFr: 'Purger proprement les journaux avec "journalctl --vacuum-size=500M" (ou --vacuum-time=7d)',
        isCorrect: true,
        explanation: 'La commande "journalctl --vacuum-size" ou "--vacuum-time" permet de réduire l\'empreinte disque des journaux systemd sans corrompre les fichiers actifs.',
        explanationFr: 'La commande "journalctl --vacuum-size" ou "--vacuum-time" permet de réduire l\'empreinte disque des journaux systemd sans corrompre les fichiers actifs.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer violemment le dossier avec "rm -rf /var/log/journal/*"',
        labelFr: 'Supprimer violemment le dossier avec "rm -rf /var/log/journal/*"',
        isCorrect: false,
        explanation: 'Supprimer à chaud les fichiers ouverts par journald peut causer des blocages et des descripteurs fantômes.',
        explanationFr: 'Supprimer à chaud les fichiers ouverts par journald peut causer des blocages et des descripteurs fantômes.'
      },
      {
        id: 'opt-3',
        label: 'Désinstaller systemd',
        labelFr: 'Désinstaller systemd',
        isCorrect: false,
        explanation: 'Désinstaller l\'init casserait le démarrage de la machine.',
        explanationFr: 'Désinstaller l\'init casserait le démarrage de la machine.'
      },
      {
        id: 'opt-4',
        label: 'Créer un fichier journald.txt vide',
        labelFr: 'Créer un fichier journald.txt vide',
        isCorrect: false,
        explanation: 'Journald utilise un format binaire structuré, pas un simple fichier texte.',
        explanationFr: 'Journald utilise un format binaire structuré, pas un simple fichier texte.'
      }
    ],
    correctedSnippet: `journalctl --vacuum-size=500M`,
    fixExplanation: '"journalctl --vacuum-size=500M" supprime les anciens fichiers d\'archives jusqu\'à atteindre la taille cible.',
    fixExplanationFr: '"journalctl --vacuum-size=500M" supprime les anciens fichiers d\'archives jusqu\'à atteindre la taille cible.'
  },
  {
    id: 'tb-lpic1-108-03',
    title: 'Rotation des logs rsyslog et échec de logrotate',
    titleFr: 'Fichiers de logs non compressés ni tronqués : configuration de logrotate.conf',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.2',
    category: 'Essential System Services',
    scenario: 'Le fichier "/var/log/syslog" fait 8 Go. Malgré la présence de logrotate, il n\'est jamais archivé en syslog.1.gz car la directive "missingok" ou la périodicité est incorrecte.',
    scenarioFr: 'Le fichier "/var/log/syslog" fait 8 Go. Malgré la présence de logrotate, il n\'est jamais archivé en syslog.1.gz car la directive "missingok" ou la périodicité est incorrecte.',
    codeSnippet: `root@srv:~# logrotate -d /etc/logrotate.conf
# L'option de test -d (debug) affiche les actions simulées sans les exécuter`,
    language: 'bash',
    bugDescription: 'Pour tester et forcer manuellement une rotation immédiate des logs, il faut utiliser l\'option "-f" (force) de logrotate.',
    bugDescriptionFr: 'Pour tester et forcer manuellement une rotation immédiate des logs, il faut utiliser l\'option "-f" (force) de logrotate.',
    options: [
      {
        id: 'opt-1',
        label: 'Forcer l\'exécution immédiate de la rotation avec "logrotate -f /etc/logrotate.conf"',
        labelFr: 'Forcer l\'exécution immédiate de la rotation avec "logrotate -f /etc/logrotate.conf"',
        isCorrect: true,
        explanation: '"-f" force la rotation de tous les fichiers de journaux définis, même si les conditions de date ou de taille ne sont pas encore atteintes.',
        explanationFr: '"-f" force la rotation de tous les fichiers de journaux définis, même si les conditions de date ou de taille ne sont pas encore atteintes.'
      },
      {
        id: 'opt-2',
        label: 'Arrêter rsyslog définitivement',
        labelFr: 'Arrêter rsyslog définitivement',
        isCorrect: false,
        explanation: 'Cela priverait le système de toute trace d\'audit et de sécurité.',
        explanationFr: 'Cela priverait le système de toute trace d\'audit et de sécurité.'
      },
      {
        id: 'opt-3',
        label: 'Renommer logrotate en logrotate.old',
        labelFr: 'Renommer logrotate en logrotate.old',
        isCorrect: false,
        explanation: 'Cela empêcherait toute future rotation automatique.',
        explanationFr: 'Cela empêcherait toute future rotation automatique.'
      },
      {
        id: 'opt-4',
        label: 'Modifier le noyau Linux',
        labelFr: 'Modifier le noyau Linux',
        isCorrect: false,
        explanation: 'Logrotate est un outil d\'espace utilisateur indépendant du noyau.',
        explanationFr: 'Logrotate est un outil d\'espace utilisateur indépendant du noyau.'
      }
    ],
    correctedSnippet: `logrotate -f /etc/logrotate.d/rsyslog`,
    fixExplanation: '"logrotate -f" déclenche la rotation immédiate et régénère un nouveau fichier journal propre.',
    fixExplanationFr: '"logrotate -f" déclenche la rotation immédiate et régénère un nouveau fichier journal propre.'
  },
  {
    id: 'tb-lpic1-108-04',
    title: 'Redirection des e-mails système avec newaliases et /etc/aliases',
    titleFr: 'Mails administrateur non reçus : omission de la commande "newaliases"',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.3',
    category: 'Essential System Services',
    scenario: 'L\'administrateur ajoute la ligne "root: admin@entreprise.com" dans "/etc/aliases" pour recevoir les alertes Cron. Pourtant, les messages continuent d\'arriver dans la boîte locale /var/mail/root.',
    scenarioFr: 'L\'administrateur ajoute la ligne "root: admin@entreprise.com" dans "/etc/aliases" pour recevoir les alertes Cron. Pourtant, les messages continuent d\'arriver dans la boîte locale /var/mail/root.',
    codeSnippet: `root@srv:~# echo "root: admin@entreprise.com" >> /etc/aliases
# Les mails sont toujours livrés en local car la base binaire n'est pas mise à jour !`,
    language: 'bash',
    bugDescription: 'Le serveur MTA (Postfix/Sendmail) ne lit pas le fichier texte /etc/aliases directement lors de la livraison, mais la base indexée /etc/aliases.db.',
    bugDescriptionFr: 'Le serveur MTA (Postfix/Sendmail) ne lit pas le fichier texte /etc/aliases directement lors de la livraison, mais la base indexée /etc/aliases.db.',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter la commande "newaliases" (ou postalias /etc/aliases) pour compiler la base binaire /etc/aliases.db',
        labelFr: 'Exécuter la commande "newaliases" (ou postalias /etc/aliases) pour compiler la base binaire /etc/aliases.db',
        isCorrect: true,
        explanation: 'La commande "newaliases" lit /etc/aliases et génère la base hash Berkeley DB /etc/aliases.db interrogée à chaque envoi par le MTA.',
        explanationFr: 'La commande "newaliases" lit /etc/aliases et génère la base hash Berkeley DB /etc/aliases.db interrogée à chaque envoi par le MTA.'
      },
      {
        id: 'opt-2',
        label: 'Redémarrer le serveur complet',
        labelFr: 'Redémarrer le serveur complet',
        isCorrect: false,
        explanation: 'Un redémarrage ne compile pas automatiquement /etc/aliases.',
        explanationFr: 'Un redémarrage ne compile pas automatiquement /etc/aliases.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer /etc/aliases',
        labelFr: 'Supprimer /etc/aliases',
        isCorrect: false,
        explanation: 'Supprimer le fichier annulerait tous les alias existants.',
        explanationFr: 'Supprimer le fichier annulerait tous les alias existants.'
      },
      {
        id: 'opt-4',
        label: 'Créer un compte POP3 pour root',
        labelFr: 'Créer un compte POP3 pour root',
        isCorrect: false,
        explanation: 'La redirection se gère au niveau transport (MTA), pas au niveau d\'un serveur de relève POP3.',
        explanationFr: 'La redirection se gère au niveau transport (MTA), pas au niveau d\'un serveur de relève POP3.'
      }
    ],
    correctedSnippet: `newaliases`,
    fixExplanation: '"newaliases" met à jour la table d\'alias binaire exploitée par le MTA.',
    fixExplanationFr: '"newaliases" met à jour la table d\'alias binaire exploitée par le MTA.'
  },
  {
    id: 'tb-lpic1-108-05',
    title: 'Visualisation et purge de la file d\'attente des messages MTA avec mailq',
    titleFr: 'File d\'attente de messagerie bloquée (mail queue) diagnostiquée avec mailq et postqueue',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.3',
    category: 'Essential System Services',
    scenario: 'Les courriels ne partent plus. L\'administrateur doit inspecter le nombre de messages en attente et comprendre pourquoi ils stagnent.',
    scenarioFr: 'Les courriels ne partent plus. L\'administrateur doit inspecter le nombre de messages en attente et comprendre pourquoi ils stagnent.',
    codeSnippet: `root@srv:~# mailq
-Queue ID-  --Size-- ----Arrival Time---- -Sender/Recipient-------
A1B2C3D4E        542 Wed Feb 19 10:00:00  nagios@localhost
(connect to mail.corp.com[192.168.1.50]:25: Connection refused)
                                         alert@corp.com`,
    language: 'bash',
    bugDescription: 'La commande standard "mailq" permet d\'afficher la file d\'attente et les raisons d\'échec de transmission SMTP.',
    bugDescriptionFr: 'La commande standard "mailq" permet d\'afficher la file d\'attente et les raisons d\'échec de transmission SMTP.',
    options: [
      {
        id: 'opt-1',
        label: 'Consulter les erreurs avec "mailq" puis forcer la distribution après résolution réseau avec "postfix flush" (ou "postqueue -f")',
        labelFr: 'Consulter les erreurs avec "mailq" puis forcer la distribution après résolution réseau avec "postfix flush" (ou "postqueue -f")',
        isCorrect: true,
        explanation: '"mailq" (synonyme de "sendmail -bp" ou "postqueue -p") liste les e-mails bloqués dans la queue avec leur motif d\'échec.',
        explanationFr: '"mailq" (synonyme de "sendmail -bp" ou "postqueue -p") liste les e-mails bloqués dans la queue avec leur motif d\'échec.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer /var/spool/mqueue sans regarder',
        labelFr: 'Supprimer /var/spool/mqueue sans regarder',
        isCorrect: false,
        explanation: 'Détruire brutalement les fichiers du spool peut corrompre la base du serveur de courrier.',
        explanationFr: 'Détruire brutalement les fichiers du spool peut corrompre la base du serveur de courrier.'
      },
      {
        id: 'opt-3',
        label: 'Désactiver le pare-feu externe',
        labelFr: 'Désactiver le pare-feu externe',
        isCorrect: false,
        explanation: 'Il faut diagnostiquer le serveur relais avant de modifier les pare-feux.',
        explanationFr: 'Il faut diagnostiquer le serveur relais avant de modifier les pare-feux.'
      },
      {
        id: 'opt-4',
        label: 'mailq ne fonctionne que sous Solaris',
        labelFr: 'mailq ne fonctionne que sous Solaris',
        isCorrect: false,
        explanation: 'mailq est un standard UNIX/Linux universel.',
        explanationFr: 'mailq est un standard UNIX/Linux universel.'
      }
    ],
    correctedSnippet: `postqueue -f`,
    fixExplanation: '"postqueue -f" tente immédiatement de relivrer tous les messages en attente dans la queue.',
    fixExplanationFr: '"postqueue -f" tente immédiatement de relivrer tous les messages en attente dans la queue.'
  },
  {
    id: 'tb-lpic1-108-06',
    title: 'Gestion des imprimantes CUPS avec lp, lpq et cupsaccept',
    titleFr: 'Imprimante refusant les tâches d\'impression : "Destination is not accepting jobs"',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.4',
    category: 'Essential System Services',
    scenario: 'Un utilisateur tape "lpr -P laserjet document.pdf". La commande échoue avec "lpr: Destination is not accepting jobs".',
    scenarioFr: 'Un utilisateur tape "lpr -P laserjet document.pdf". La commande échoue avec "lpr: Destination is not accepting jobs".',
    codeSnippet: `user@srv:~$ lpq -P laserjet
laserjet is not accepting jobs.
no entries`,
    language: 'bash',
    bugDescription: 'La file d\'attente de l\'imprimante a été désactivée avec "cupsreject" (ou "reject").',
    bugDescriptionFr: 'La file d\'attente de l\'imprimante a été désactivée avec "cupsreject" (ou "reject").',
    options: [
      {
        id: 'opt-1',
        label: 'Réactiver la file d\'impression avec la commande "cupsaccept laserjet" (ou "accept laserjet") puis "cupsenable laserjet"',
        labelFr: 'Réactiver la file d\'impression avec la commande "cupsaccept laserjet" (ou "accept laserjet") puis "cupsenable laserjet"',
        isCorrect: true,
        explanation: 'Dans CUPS, "cupsaccept" autorise les nouvelles soumissions dans la file, tandis que "cupsenable" autorise l\'envoi effectif vers le périphérique matériel.',
        explanationFr: 'Dans CUPS, "cupsaccept" autorise les nouvelles soumissions dans la file, tandis que "cupsenable" autorise l\'envoi effectif vers le périphérique matériel.'
      },
      {
        id: 'opt-2',
        label: 'Débrancher le câble USB de l\'imprimante',
        labelFr: 'Débrancher le câble USB de l\'imprimante',
        isCorrect: false,
        explanation: 'C\'est un statut logiciel CUPS, pas une panne matérielle.',
        explanationFr: 'C\'est un statut logiciel CUPS, pas une panne matérielle.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer CUPS',
        labelFr: 'Supprimer CUPS',
        isCorrect: false,
        explanation: 'CUPS est le sous-système d\'impression standard de Linux.',
        explanationFr: 'CUPS est le sous-système d\'impression standard de Linux.'
      },
      {
        id: 'opt-4',
        label: 'Modifier /etc/hosts',
        labelFr: 'Modifier /etc/hosts',
        isCorrect: false,
        explanation: 'La file d\'attente locale CUPS n\'est pas gérée dans /etc/hosts.',
        explanationFr: 'La file d\'attente locale CUPS n\'est pas gérée dans /etc/hosts.'
      }
    ],
    correctedSnippet: `cupsaccept laserjet
cupsenable laserjet`,
    fixExplanation: '"cupsaccept" et "cupsenable" remettent la file d\'impression en service actif.',
    fixExplanationFr: '"cupsaccept" et "cupsenable" remettent la file d\'impression en service actif.'
  },
  {
    id: 'tb-lpic1-108-07',
    title: 'Configuration du client NTP avec chrony (chronyc sources)',
    titleFr: 'Désynchronisation temporelle avec Chrony : diagnostic via "chronyc sources -v"',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.1',
    category: 'Essential System Services',
    scenario: 'Le serveur accumule un décalage de plusieurs secondes. L\'administrateur utilise "chronyc sources" mais tous les serveurs distants affichent "^?" (injoignable).',
    scenarioFr: 'Le serveur accumule un décalage de plusieurs secondes. L\'administrateur utilise "chronyc sources" mais tous les serveurs distants affichent "^?" (injoignable).',
    codeSnippet: `root@srv:~# chronyc sources
210 Number of sources = 2
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^? ntp1.infra.corp               0   8     0      -     +0ns[   +0ns] +/-    0ns
^? ntp2.infra.corp               0   8     0      -     +0ns[   +0ns] +/-    0ns`,
    language: 'bash',
    bugDescription: 'L\'état "^?" et "Reach 0" indiquent que le paquet UDP sur le port NTP (port 123) est bloqué par le pare-feu ou que le nom ne se résout pas.',
    bugDescriptionFr: 'L\'état "^?" et "Reach 0" indiquent que le paquet UDP sur le port NTP (port 123) est bloqué par le pare-feu ou que le nom ne se résout pas.',
    options: [
      {
        id: 'opt-1',
        label: 'Le symbole "^?" et la valeur "Reach 0" signifient qu\'aucun paquet UDP sur le port 123 n\'est reçu des serveurs NTP ; il faut vérifier le pare-feu et la connectivité UDP/123',
        labelFr: 'Le symbole "^?" et la valeur "Reach 0" signifient qu\'aucun paquet UDP sur le port 123 n\'est reçu des serveurs NTP ; il faut vérifier le pare-feu et la connectivité UDP/123',
        isCorrect: true,
        explanation: 'Chrony utilise le protocole NTP (port UDP 123). Un reach à 0 signifie qu\'aucune réponse n\'a été obtenue lors des 8 dernières tentatives de scrutation.',
        explanationFr: 'Chrony utilise le protocole NTP (port UDP 123). Un reach à 0 signifie qu\'aucune réponse n\'a été obtenue lors des 8 dernières tentatives de scrutation.'
      },
      {
        id: 'opt-2',
        label: 'Chrony n\'utilise que le protocole TCP port 80',
        labelFr: 'Chrony n\'utilise que le protocole TCP port 80',
        isCorrect: false,
        explanation: 'NTP fonctionne exclusivement en UDP sur le port 123.',
        explanationFr: 'NTP fonctionne exclusivement en UDP sur le port 123.'
      },
      {
        id: 'opt-3',
        label: 'Remplacer chrony par un sablier',
        labelFr: 'Remplacer chrony par un sablier',
        isCorrect: false,
        explanation: 'Réponse fantaisiste.',
        explanationFr: 'Réponse fantaisiste.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /etc/chrony/chrony.conf',
        labelFr: 'Supprimer /etc/chrony/chrony.conf',
        isCorrect: false,
        explanation: 'Ce fichier contient la liste des serveurs de temps de référence.',
        explanationFr: 'Ce fichier contient la liste des serveurs de temps de référence.'
      }
    ],
    correctedSnippet: `# Autoriser le trafic NTP sortant et vérifier avec :
chronyc tracking
chronyc sources -v`,
    fixExplanation: 'Autoriser UDP/123 rétablit la réception des paquets d\'horodatage par Chrony.',
    fixExplanationFr: 'Autoriser UDP/123 rétablit la réception des paquets d\'horodatage par Chrony.'
  },
  {
    id: 'tb-lpic1-108-08',
    title: 'Filtres de journalisation rsyslog et priorités (facility.priority)',
    titleFr: 'Messages de debug non enregistrés dans /var/log/messages : règle de priorité rsyslog',
    certification: 'lpic-1',
    topicNumber: 108,
    objectiveId: '108.2',
    category: 'Essential System Services',
    scenario: 'Un développeur teste un service avec "logger -p local0.debug "Mon message de test"". Le message n\'apparaît nulle part dans /var/log.',
    scenarioFr: 'Un développeur teste un service avec "logger -p local0.debug "Mon message de test"". Le message n\'apparaît nulle part dans /var/log.',
    codeSnippet: `root@srv:~# cat /etc/rsyslog.d/50-default.conf
local0.notice    /var/log/app.log
root@srv:~# logger -p local0.debug "Mon message de test"
# Le fichier /var/log/app.log reste vide !`,
    language: 'bash',
    bugDescription: 'La directive "local0.notice" n\'enregistre que les messages de sévérité notice, warning, err, crit, alert, emerg. Le niveau "debug" (sévérité 7, inférieure à notice 5) est filtré et ignoré.',
    bugDescriptionFr: 'La directive "local0.notice" n\'enregistre que les messages de sévérité notice, warning, err, crit, alert, emerg. Le niveau "debug" (sévérité 7, inférieure à notice 5) est filtré et ignoré.',
    options: [
      {
        id: 'opt-1',
        label: 'Remplacer "local0.notice" par "local0.debug" (ou "local0.*") pour capturer tous les niveaux de priorité jusqu\'au debug',
        labelFr: 'Remplacer "local0.notice" par "local0.debug" (ou "local0.*") pour capturer tous les niveaux de priorité jusqu\'au debug',
        isCorrect: true,
        explanation: 'En syslog, indiquer une priorité inclut automatiquement cette priorité et toutes celles de niveau supérieur (plus critiques). Pour inclure debug, il faut spécifier ".debug" ou ".*".',
        explanationFr: 'En syslog, indiquer une priorité inclut automatiquement cette priorité et toutes celles de niveau supérieur (plus critiques). Pour inclure debug, il faut spécifier ".debug" ou ".*".'
      },
      {
        id: 'opt-2',
        label: 'Supprimer le binaire logger',
        labelFr: 'Supprimer le binaire logger',
        isCorrect: false,
        explanation: 'logger est l\'utilitaire standard permettant aux scripts d\'écrire dans syslog.',
        explanationFr: 'logger est l\'utilitaire standard permettant aux scripts d\'écrire dans syslog.'
      },
      {
        id: 'opt-3',
        label: 'logger ne fonctionne qu\'en tant que root',
        labelFr: 'logger ne fonctionne qu\'en tant que root',
        isCorrect: false,
        explanation: 'logger peut être invoqué par n\'importe quel utilisateur via le socket /dev/log.',
        explanationFr: 'logger peut être invoqué par n\'importe quel utilisateur via le socket /dev/log.'
      },
      {
        id: 'opt-4',
        label: 'Redémarrer le noyau Linux',
        labelFr: 'Redémarrer le noyau Linux',
        isCorrect: false,
        explanation: 'Il suffit de recharger rsyslog avec "systemctl restart rsyslog".',
        explanationFr: 'Il suffit de recharger rsyslog avec "systemctl restart rsyslog".'
      }
    ],
    correctedSnippet: `# Dans /etc/rsyslog.d/50-default.conf :
local0.debug    /var/log/app.log
# Recharger rsyslog :
systemctl restart rsyslog`,
    fixExplanation: 'Définir "local0.debug" autorise la consignation des messages détaillés de débogage.',
    fixExplanationFr: 'Définir "local0.debug" autorise la consignation des messages détaillés de débogage.'
  },

  // ==========================================
  // TOPIC 109: NETWORKING FUNDAMENTALS (109.1 - 109.4) [9 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-109-01',
    title: 'Passerelle par défaut manquante (Default Gateway) empêchant l\'accès Internet',
    titleFr: 'Accès Internet impossible : table de routage dépourvue de route par défaut "default via"',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.3',
    category: 'Networking Fundamentals',
    scenario: 'Le serveur peut pinger ses voisins sur le réseau local 192.168.1.0/24, mais toute tentative vers 8.8.8.8 renvoie immédiatement "connect: Network is unreachable".',
    scenarioFr: 'Le serveur peut pinger ses voisins sur le réseau local 192.168.1.0/24, mais toute tentative vers 8.8.8.8 renvoie immédiatement "connect: Network is unreachable".',
    codeSnippet: `root@srv:~# ping -c 1 8.8.8.8
connect: Network is unreachable
root@srv:~# ip route
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50`,
    language: 'bash',
    bugDescription: 'La table de routage ne contient aucune passerelle par défaut ("default via <IP>"). Le noyau ne sait pas vers quel routeur expédier les paquets hors du sous-réseau.',
    bugDescriptionFr: 'La table de routage ne contient aucune passerelle par défaut ("default via <IP>"). Le noyau ne sait pas vers quel routeur expédier les paquets hors du sous-réseau.',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter la route par défaut avec "ip route add default via 192.168.1.1 dev eth0"',
        labelFr: 'Ajouter la route par défaut avec "ip route add default via 192.168.1.1 dev eth0"',
        isCorrect: true,
        explanation: '"Network is unreachable" est le message d\'erreur caractéristique du noyau lorsqu\'aucune route (spécifique ou par défaut) ne correspond à l\'IP de destination.',
        explanationFr: '"Network is unreachable" est le message d\'erreur caractéristique du noyau lorsqu\'aucune route (spécifique ou par défaut) ne correspond à l\'IP de destination.'
      },
      {
        id: 'opt-2',
        label: 'Remplacer l\'adresse IP publique par 127.0.0.1',
        labelFr: 'Remplacer l\'adresse IP publique par 127.0.0.1',
        isCorrect: false,
        explanation: '127.0.0.1 est l\'interface de bouclage locale (loopback).',
        explanationFr: '127.0.0.1 est l\'interface de bouclage locale (loopback).'
      },
      {
        id: 'opt-3',
        label: 'Changer la carte réseau',
        labelFr: 'Changer la carte réseau',
        isCorrect: false,
        explanation: 'La carte fonctionne déjà parfaitement en local.',
        explanationFr: 'La carte fonctionne déjà parfaitement en local.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer eth0 avec ip link delete eth0',
        labelFr: 'Supprimer eth0 avec ip link delete eth0',
        isCorrect: false,
        explanation: 'Cela couperait toute connectivité réseau.',
        explanationFr: 'Cela couperait toute connectivité réseau.'
      }
    ],
    correctedSnippet: `ip route add default via 192.168.1.1 dev eth0`,
    fixExplanation: '"ip route add default via ..." installe la passerelle de sortie vers les réseaux externes.',
    fixExplanationFr: '"ip route add default via ..." installe la passerelle de sortie vers les réseaux externes.'
  },
  {
    id: 'tb-lpic1-109-02',
    title: 'Résolution DNS défaillante dans /etc/resolv.conf',
    titleFr: 'Erreur "Temporary failure in name resolution" causée par un nameserver erroné dans /etc/resolv.conf',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.4',
    category: 'Networking Fundamentals',
    scenario: '"ping 8.8.8.8" fonctionne, mais "ping google.com" échoue avec "ping: google.com: Temporary failure in name resolution".',
    scenarioFr: '"ping 8.8.8.8" fonctionne, mais "ping google.com" échoue avec "ping: google.com: Temporary failure in name resolution".',
    codeSnippet: `root@srv:~# ping -c 1 8.8.8.8
1 packets transmitted, 1 received, 0% packet loss
root@srv:~# ping google.com
ping: google.com: Temporary failure in name resolution
root@srv:~# cat /etc/resolv.conf
nameserver 192.168.1.250
# L'IP 192.168.1.250 ne répond pas aux requêtes DNS !`,
    language: 'bash',
    bugDescription: 'La connectivité IP est fonctionnelle mais le serveur DNS configuré dans /etc/resolv.conf est injoignable ou inopérant.',
    bugDescriptionFr: 'La connectivité IP est fonctionnelle mais le serveur DNS configuré dans /etc/resolv.conf est injoignable ou inopérant.',
    options: [
      {
        id: 'opt-1',
        label: 'Définir un serveur DNS valide dans /etc/resolv.conf (ex: "nameserver 1.1.1.1" ou "nameserver 8.8.8.8") ou reconfigurer systemd-resolved',
        labelFr: 'Définir un serveur DNS valide dans /etc/resolv.conf (ex: "nameserver 1.1.1.1" ou "nameserver 8.8.8.8") ou reconfigurer systemd-resolved',
        isCorrect: true,
        explanation: '/etc/resolv.conf indique aux bibliothèques de résolution (getaddrinfo/glibc) vers quelles adresses IP adresser les requêtes DNS sur le port UDP 53.',
        explanationFr: '/etc/resolv.conf indique aux bibliothèques de résolution (getaddrinfo/glibc) vers quelles adresses IP adresser les requêtes DNS sur le port UDP 53.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer /etc/hosts',
        labelFr: 'Supprimer /etc/hosts',
        isCorrect: false,
        explanation: 'Supprimer /etc/hosts casserait la résolution de localhost.',
        explanationFr: 'Supprimer /etc/hosts casserait la résolution de localhost.'
      },
      {
        id: 'opt-3',
        label: 'ping ne peut pas résoudre les noms de domaine',
        labelFr: 'ping ne peut pas résoudre les noms de domaine',
        isCorrect: false,
        explanation: 'ping résout les noms d\'hôtes via la glibc de manière tout à fait standard.',
        explanationFr: 'ping résout les noms d\'hôtes via la glibc de manière tout à fait standard.'
      },
      {
        id: 'opt-4',
        label: 'Changer le port DNS vers le port 8080',
        labelFr: 'Changer le port DNS vers le port 8080',
        isCorrect: false,
        explanation: 'Le DNS standard s\'exécute toujours sur le port 53.',
        explanationFr: 'Le DNS standard s\'exécute toujours sur le port 53.'
      }
    ],
    correctedSnippet: `echo "nameserver 1.1.1.1" > /etc/resolv.conf`,
    fixExplanation: 'Fournir un serveur DNS fonctionnel rétablit la conversion nom vers IP.',
    fixExplanationFr: 'Fournir un serveur DNS fonctionnel rétablit la conversion nom vers IP.'
  },
  {
    id: 'tb-lpic1-109-03',
    title: 'Priorité de résolution de noms définie dans /etc/nsswitch.conf',
    titleFr: 'Entrée /etc/hosts ignorée en raison de l\'ordre des sources dans /etc/nsswitch.conf',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.4',
    category: 'Networking Fundamentals',
    scenario: 'L\'administrateur ajoute "10.0.0.50 srv-app" dans /etc/hosts. Pourtant, "ping srv-app" continue de résoudre une ancienne IP publique fournie par le serveur DNS.',
    scenarioFr: 'L\'administrateur ajoute "10.0.0.50 srv-app" dans /etc/hosts. Pourtant, "ping srv-app" continue de résoudre une ancienne IP publique fournie par le serveur DNS.',
    codeSnippet: `root@srv:~# grep hosts /etc/nsswitch.conf
hosts:          dns files
# Le DNS est interrogé AVANT le fichier local /etc/hosts !`,
    language: 'bash',
    bugDescription: 'La directive "hosts:" dans /etc/nsswitch.conf liste "dns" avant "files". Le résolveur interroge le DNS public avant le fichier /etc/hosts.',
    bugDescriptionFr: 'La directive "hosts:" dans /etc/nsswitch.conf liste "dns" avant "files". Le résolveur interroge le DNS public avant le fichier /etc/hosts.',
    options: [
      {
        id: 'opt-1',
        label: 'Inverser l\'ordre dans /etc/nsswitch.conf pour mettre "files dns" afin de consulter /etc/hosts prioritairement',
        labelFr: 'Inverser l\'ordre dans /etc/nsswitch.conf pour mettre "files dns" afin de consulter /etc/hosts prioritairement',
        isCorrect: true,
        explanation: '/etc/nsswitch.conf contrôle l\'ordre de recherche du Name Service Switch. La norme Unix préconise "files" (fichiers locaux) avant "dns".',
        explanationFr: '/etc/nsswitch.conf contrôle l\'ordre de recherche du Name Service Switch. La norme Unix préconise "files" (fichiers locaux) avant "dns".'
      },
      {
        id: 'opt-2',
        label: 'Vider le cache ARP avec ip neigh flush',
        labelFr: 'Vider le cache ARP avec ip neigh flush',
        isCorrect: false,
        explanation: 'ARP associe des adresses IP à des MAC, pas des noms d\'hôtes.',
        explanationFr: 'ARP associe des adresses IP à des MAC, pas des noms d\'hôtes.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer /etc/nsswitch.conf',
        labelFr: 'Supprimer /etc/nsswitch.conf',
        isCorrect: false,
        explanation: 'Supprimer nsswitch.conf briserait la résolution des utilisateurs, groupes et réseaux.',
        explanationFr: 'Supprimer nsswitch.conf briserait la résolution des utilisateurs, groupes et réseaux.'
      },
      {
        id: 'opt-4',
        label: 'Redémarrer le serveur DNS d\'Internet',
        labelFr: 'Redémarrer le serveur DNS d\'Internet',
        isCorrect: false,
        explanation: 'Impossible et sans lien avec la priorité de la machine cliente.',
        explanationFr: 'Impossible et sans lien avec la priorité de la machine cliente.'
      }
    ],
    correctedSnippet: `# Dans /etc/nsswitch.conf :
hosts:          files dns`,
    fixExplanation: '"files dns" assure que les surcharges locales dans /etc/hosts prennent le pas sur le DNS.',
    fixExplanationFr: '"files dns" assure que les surcharges locales dans /etc/hosts prennent le pas sur le DNS.'
  },
  {
    id: 'tb-lpic1-109-04',
    title: 'Diagnostic des ports d\'écoute avec la commande ss et netstat',
    titleFr: 'Service Web inaccessible de l\'extérieur : socket lié uniquement à 127.0.0.1 au lieu de 0.0.0.0',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.3',
    category: 'Networking Fundamentals',
    scenario: 'Un serveur Nginx fonctionne en local avec "curl http://localhost", mais les clients du réseau ne peuvent pas y accéder. "ss -tulpn" révèle l\'adresse de liaison du port 80.',
    scenarioFr: 'Un serveur Nginx fonctionne en local avec "curl http://localhost", mais les clients du réseau ne peuvent pas y accéder. "ss -tulpn" révèle l\'adresse de liaison du port 80.',
    codeSnippet: `root@srv:~# ss -tulpn | grep :80
tcp   LISTEN 0      511        127.0.0.1:80        0.0.0.0:*    users:(("nginx",pid=1420,fd=6))`,
    language: 'bash',
    bugDescription: 'Le service est lié ("bound") exclusivement à l\'adresse de bouclage locale 127.0.0.1 au lieu de 0.0.0.0 (toutes les interfaces).',
    bugDescriptionFr: 'Le service est lié ("bound") exclusivement à l\'adresse de bouclage locale 127.0.0.1 au lieu de 0.0.0.0 (toutes les interfaces).',
    options: [
      {
        id: 'opt-1',
        label: 'Modifier la configuration du serveur (ex: nginx.conf) pour écouter sur "0.0.0.0:80" (ou simplement "listen 80;") au lieu de "127.0.0.1:80"',
        labelFr: 'Modifier la configuration du serveur (ex: nginx.conf) pour écouter sur "0.0.0.0:80" (ou simplement "listen 80;") au lieu de "127.0.0.1:80"',
        isCorrect: true,
        explanation: 'Une socket liée sur 127.0.0.1 rejette tout paquet ne provenant pas de l\'interface loopback locale. 0.0.0.0 écoute sur toutes les cartes réseau physiques.',
        explanationFr: 'Une socket liée sur 127.0.0.1 rejette tout paquet ne provenant pas de l\'interface loopback locale. 0.0.0.0 écoute sur toutes les cartes réseau physiques.'
      },
      {
        id: 'opt-2',
        label: 'Désactiver le protocole TCP',
        labelFr: 'Désactiver le protocole TCP',
        isCorrect: false,
        explanation: 'Le Web (HTTP) requiert le protocole TCP.',
        explanationFr: 'Le Web (HTTP) requiert le protocole TCP.'
      },
      {
        id: 'opt-3',
        label: 'Changer l\'adresse MAC de la carte',
        labelFr: 'Changer l\'adresse MAC de la carte',
        isCorrect: false,
        explanation: 'L\'adresse MAC n\'a aucun impact sur l\'adresse IP de bind de la socket applicative.',
        explanationFr: 'L\'adresse MAC n\'a aucun impact sur l\'adresse IP de bind de la socket applicative.'
      },
      {
        id: 'opt-4',
        label: 'ss est une commande obsolète remplacée par ifconfig',
        labelFr: 'ss est une commande obsolète remplacée par ifconfig',
        isCorrect: false,
        explanation: 'C\'est l\'inverse : ss remplace netstat, et ip remplace ifconfig.',
        explanationFr: 'C\'est l\'inverse : ss remplace netstat, et ip remplace ifconfig.'
      }
    ],
    correctedSnippet: `# Dans nginx.conf :
server {
    listen 80;
    # ...
}`,
    fixExplanation: 'Écouter sur 0.0.0.0:80 permet aux clients extérieurs d\'atteindre le service Web.',
    fixExplanationFr: 'Écouter sur 0.0.0.0:80 permet aux clients extérieurs d\'atteindre le service Web.'
  },
  {
    id: 'tb-lpic1-109-05',
    title: 'Activation d\'une interface réseau avec ip link set dev up',
    titleFr: 'Interface réseau inactive en statut "state DOWN"',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.3',
    category: 'Networking Fundamentals',
    scenario: 'L\'interface eth1 dispose d\'une adresse IP configurée mais refuse de transmettre les paquets. La commande "ip addr show eth1" affiche "state DOWN".',
    scenarioFr: 'L\'interface eth1 dispose d\'une adresse IP configurée mais refuse de transmettre les paquets. La commande "ip addr show eth1" affiche "state DOWN".',
    codeSnippet: `root@srv:~# ip addr show eth1
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    inet 192.168.2.10/24 brd 192.168.2.255 scope global eth1`,
    language: 'bash',
    bugDescription: 'L\'interface réseau est administrativement éteinte (drapeau UP absent).',
    bugDescriptionFr: 'L\'interface réseau est administrativement éteinte (drapeau UP absent).',
    options: [
      {
        id: 'opt-1',
        label: 'Activer administrativement l\'interface avec "ip link set eth1 up"',
        labelFr: 'Activer administrativement l\'interface avec "ip link set eth1 up"',
        isCorrect: true,
        explanation: '"ip link set <interface> up" passe l\'interface réseau en état actif (analogue à "ifconfig eth1 up" déprécié).',
        explanationFr: '"ip link set <interface> up" passe l\'interface réseau en état actif (analogue à "ifconfig eth1 up" déprécié).'
      },
      {
        id: 'opt-2',
        label: 'Supprimer l\'adresse IP avec ip addr del',
        labelFr: 'Supprimer l\'adresse IP avec ip addr del',
        isCorrect: false,
        explanation: 'Supprimer l\'IP ne monterait pas l\'interface.',
        explanationFr: 'Supprimer l\'IP ne monterait pas l\'interface.'
      },
      {
        id: 'opt-3',
        label: 'Redémarrer le serveur',
        labelFr: 'Redémarrer le serveur',
        isCorrect: false,
        explanation: 'L\'interface peut être remontée immédiatement et dynamiquement sans reboot.',
        explanationFr: 'L\'interface peut être remontée immédiatement et dynamiquement sans reboot.'
      },
      {
        id: 'opt-4',
        label: 'Remplacer le câble Ethernet',
        labelFr: 'Remplacer le câble Ethernet',
        isCorrect: false,
        explanation: 'L\'état administratif DOWN est logiciel.',
        explanationFr: 'L\'état administratif DOWN est logiciel.'
      }
    ],
    correctedSnippet: `ip link set eth1 up`,
    fixExplanation: '"ip link set eth1 up" réactive la carte réseau au niveau de la couche liaison de données.',
    fixExplanationFr: '"ip link set eth1 up" réactive la carte réseau au niveau de la couche liaison de données.'
  },
  {
    id: 'tb-lpic1-109-06',
    title: 'Masque de sous-réseau CIDR erroné isolant la machine',
    titleFr: 'Masque de sous-réseau /32 au lieu de /24 empêchant toute communication avec les voisins',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.1',
    category: 'Networking Fundamentals',
    scenario: 'L\'administrateur configure l\'IP : "ip addr add 192.168.1.10 dev eth0". Il omet le préfixe CIDR et Linux applique automatiquement un masque d\'hôte /32.',
    scenarioFr: 'L\'administrateur configure l\'IP : "ip addr add 192.168.1.10 dev eth0". Il omet le préfixe CIDR et Linux applique automatiquement un masque d\'hôte /32.',
    codeSnippet: `root@srv:~# ip addr show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.10/32 scope global eth0
# Masque /32 : aucun réseau local n'est calculé !`,
    language: 'bash',
    bugDescription: 'Un masque /32 (255.255.255.255) définit une adresse d\'hôte unique sans réseau de diffusion. La machine ne peut pinger aucun hôte du même switch.',
    bugDescriptionFr: 'Un masque /32 (255.255.255.255) définit une adresse d\'hôte unique sans réseau de diffusion. La machine ne peut pinger aucun hôte du même switch.',
    options: [
      {
        id: 'opt-1',
        label: 'Spécifier le masque de sous-réseau complet en notation CIDR (ex: "192.168.1.10/24")',
        labelFr: 'Spécifier le masque de sous-réseau complet en notation CIDR (ex: "192.168.1.10/24")',
        isCorrect: true,
        explanation: 'Sans notation CIDR, la commande "ip addr add" déduit un masque /32. Pour un réseau classique de classe C, il faut indiquer explicitement /24.',
        explanationFr: 'Sans notation CIDR, la commande "ip addr add" déduit un masque /32. Pour un réseau classique de classe C, il faut indiquer explicitement /24.'
      },
      {
        id: 'opt-2',
        label: 'Passer en IPv6 exclusivement',
        labelFr: 'Passer en IPv6 exclusivement',
        isCorrect: false,
        explanation: 'IPv4 reste le protocole standard à configurer correctement.',
        explanationFr: 'IPv4 reste le protocole standard à configurer correctement.'
      },
      {
        id: 'opt-3',
        label: 'Utiliser /0 comme masque universel',
        labelFr: 'Utiliser /0 comme masque universel',
        isCorrect: false,
        explanation: '/0 représente la route par défaut universelle, pas un masque d\'interface valide.',
        explanationFr: '/0 représente la route par défaut universelle, pas un masque d\'interface valide.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer eth0',
        labelFr: 'Supprimer eth0',
        isCorrect: false,
        explanation: 'Supprimer l\'interface couperait toute communication.',
        explanationFr: 'Supprimer l\'interface couperait toute communication.'
      }
    ],
    correctedSnippet: `ip addr del 192.168.1.10/32 dev eth0
ip addr add 192.168.1.10/24 dev eth0`,
    fixExplanation: 'Remplacer /32 par /24 rétablit la route de lien locale et la table ARP.',
    fixExplanationFr: 'Remplacer /32 par /24 rétablit la route de lien locale et la table ARP.'
  },
  {
    id: 'tb-lpic1-109-07',
    title: 'Configuration réseau persistante avec Netplan sous Ubuntu',
    titleFr: 'Erreur d\'indentation YAML bloquant "netplan apply"',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.2',
    category: 'Networking Fundamentals',
    scenario: 'Après avoir modifié "/etc/netplan/50-cloud-init.yaml", l\'administrateur lance "netplan apply" qui échoue avec "Invalid YAML: tab character found".',
    scenarioFr: 'Après avoir modifié "/etc/netplan/50-cloud-init.yaml", l\'administrateur lance "netplan apply" qui échoue avec "Invalid YAML: tab character found".',
    codeSnippet: `root@srv:~# netplan apply
/etc/netplan/01-netcfg.yaml: line 7 column 1: Invalid YAML: tab character found...`,
    language: 'bash',
    bugDescription: 'La spécification YAML de Netplan interdit formellement l\'utilisation de tabulations (\'\\t\') pour l\'indentation.',
    bugDescriptionFr: 'La spécification YAML de Netplan interdit formellement l\'utilisation de tabulations (\'\\t\') pour l\'indentation.',
    options: [
      {
        id: 'opt-1',
        label: 'Remplacer toutes les tabulations par des espaces réguliers (généralement 2 ou 4 espaces par niveau d\'indentation)',
        labelFr: 'Remplacer toutes les tabulations par des espaces réguliers (généralement 2 ou 4 espaces par niveau d\'indentation)',
        isCorrect: true,
        explanation: 'Le format YAML rejette strictement les caractères de tabulation pour structurer les blocs.',
        explanationFr: 'Le format YAML rejette strictement les caractères de tabulation pour structurer les blocs.'
      },
      {
        id: 'opt-2',
        label: 'Renommer le fichier en .json',
        labelFr: 'Renommer le fichier en .json',
        isCorrect: false,
        explanation: 'Netplan ne lit que les fichiers .yaml dans /etc/netplan.',
        explanationFr: 'Netplan ne lit que les fichiers .yaml dans /etc/netplan.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer Netplan',
        labelFr: 'Supprimer Netplan',
        isCorrect: false,
        explanation: 'Netplan est le générateur de configuration réseau par défaut d\'Ubuntu.',
        explanationFr: 'Netplan est le générateur de configuration réseau par défaut d\'Ubuntu.'
      },
      {
        id: 'opt-4',
        label: 'Ajouter des guillemets autour de tout le fichier',
        labelFr: 'Ajouter des guillemets autour de tout le fichier',
        isCorrect: false,
        explanation: 'Cela transformerait le document en une chaîne unique invalide.',
        explanationFr: 'Cela transformerait le document en une chaîne unique invalide.'
      }
    ],
    correctedSnippet: `# Remplacer les tabulations par 2 espaces puis valider :
netplan generate
netplan apply`,
    fixExplanation: 'Une indentation propre avec des espaces valide la syntaxe YAML de Netplan.',
    fixExplanationFr: 'Une indentation propre avec des espaces valide la syntaxe YAML de Netplan.'
  },
  {
    id: 'tb-lpic1-109-08',
    title: 'Test de connectivité avec traceroute / tracepath',
    titleFr: 'Identification du saut défaillant dans le routage réseau avec traceroute',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.3',
    category: 'Networking Fundamentals',
    scenario: 'Les requêtes vers un serveur distant tombent en timeout. L\'administrateur utilise traceroute pour localiser le routeur qui bloque le flux.',
    scenarioFr: 'L\'administrateur utilise traceroute pour localiser le routeur qui bloque le flux.',
    codeSnippet: `root@srv:~# traceroute -n 198.51.100.25
1  192.168.1.1  0.812 ms
2  10.200.0.1   2.145 ms
3  * * *
4  * * *`,
    language: 'bash',
    bugDescription: 'La commande traceroute incrémente le TTL (Time To Live) pour identifier chaque routeur traversé. Les étoiles "* * *" indiquent un routeur qui filtre ou supprime les paquets ICMP/UDP.',
    bugDescriptionFr: 'La commande traceroute incrémente le TTL (Time To Live) pour identifier chaque routeur traversé. Les étoiles "* * *" indiquent un routeur qui filtre ou supprime les paquets ICMP/UDP.',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser l\'option "-I" (ICMP Echo) ou "-T" (TCP SYN) avec traceroute si les paquets UDP par défaut sont filtrés par les pare-feux intermédiaires',
        labelFr: 'Utiliser l\'option "-I" (ICMP Echo) ou "-T" (TCP SYN) avec traceroute si les paquets UDP par défaut sont filtrés par les pare-feux intermédiaires',
        isCorrect: true,
        explanation: 'Sous Linux, traceroute utilise des sondes UDP par défaut, souvent bloquées par les routeurs d\'entreprise. "traceroute -I" bascule en ICMP standard et "traceroute -T -p 80" utilise TCP.',
        explanationFr: 'Sous Linux, traceroute utilise des sondes UDP par défaut, souvent bloquées par les routeurs d\'entreprise. "traceroute -I" bascule en ICMP standard et "traceroute -T -p 80" utilise TCP.'
      },
      {
        id: 'opt-2',
        label: 'Augmenter la vitesse de la carte réseau',
        labelFr: 'Augmenter la vitesse de la carte réseau',
        isCorrect: false,
        explanation: 'La vitesse de la carte locale ne résout pas un filtrage externe.',
        explanationFr: 'La vitesse de la carte locale ne résout pas un filtrage externe.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer le paquet traceroute',
        labelFr: 'Supprimer le paquet traceroute',
        isCorrect: false,
        explanation: 'traceroute est l\'outil de diagnostic fondamental.',
        explanationFr: 'traceroute est l\'outil de diagnostic fondamental.'
      },
      {
        id: 'opt-4',
        label: 'Le TTL ne peut pas être modifié sous Linux',
        labelFr: 'Le TTL ne peut pas être modifié sous Linux',
        isCorrect: false,
        explanation: 'C\'est précisément le principe même du fonctionnement de traceroute.',
        explanationFr: 'C\'est précisément le principe même du fonctionnement de traceroute.'
      }
    ],
    correctedSnippet: `traceroute -I 198.51.100.25`,
    fixExplanation: '"traceroute -I" contourne souvent le blocage UDP en utilisant le protocole ICMP.',
    fixExplanationFr: '"traceroute -I" contourne souvent le blocage UDP en utilisant le protocole ICMP.'
  },
  {
    id: 'tb-lpic1-109-09',
    title: 'Configuration de NetworkManager en ligne de commande avec nmcli',
    titleFr: 'Profil de connexion inactif dans NetworkManager : "nmcli connection up"',
    certification: 'lpic-1',
    topicNumber: 109,
    objectiveId: '109.2',
    category: 'Networking Fundamentals',
    scenario: 'Sur un serveur Red Hat / Rocky Linux, la connexion "System eth0" existe mais reste inactive après redémarrage. "nmcli con show" montre qu\'elle n\'est pas verte/associée.',
    scenarioFr: 'Sur un serveur Red Hat / Rocky Linux, la connexion "System eth0" existe mais reste inactive après redémarrage. "nmcli con show" montre qu\'elle n\'est pas verte/associée.',
    codeSnippet: `root@srv:~# nmcli connection show
NAME         UUID                                  TYPE      DEVICE 
System eth0  a1b2c3d4-5678-90ef-1234-567890abcdef  ethernet  --     
# DEVICE est vide : la connexion n'est pas montée sur la carte !`,
    language: 'bash',
    bugDescription: 'La connexion NetworkManager n\'a pas été activée ou son paramètre d\'autoconnexion ("connection.autoconnect") est désactivé.',
    bugDescriptionFr: 'La connexion NetworkManager n\'a pas été activée ou son paramètre d\'autoconnexion ("connection.autoconnect") est désactivé.',
    options: [
      {
        id: 'opt-1',
        label: 'Activer la connexion avec "nmcli con up \'System eth0\'" et rendre l\'activation automatique au boot avec "nmcli con mod \'System eth0\' connection.autoconnect yes"',
        labelFr: 'Activer la connexion avec "nmcli con up \'System eth0\'" et rendre l\'activation automatique au boot avec "nmcli con mod \'System eth0\' connection.autoconnect yes"',
        isCorrect: true,
        explanation: '"nmcli con up" active immédiatement le profil. "connection.autoconnect yes" garantit que NetworkManager l\'activera à chaque démarrage du système.',
        explanationFr: '"nmcli con up" active immédiatement le profil. "connection.autoconnect yes" garantit que NetworkManager l\'activera à chaque démarrage du système.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer NetworkManager',
        labelFr: 'Supprimer NetworkManager',
        isCorrect: false,
        explanation: 'NetworkManager est le gestionnaire officiel recommandé sur RHEL/CentOS.',
        explanationFr: 'NetworkManager est le gestionnaire officiel recommandé sur RHEL/CentOS.'
      },
      {
        id: 'opt-3',
        label: 'Passer la carte en mode promiscuous',
        labelFr: 'Passer la carte en mode promiscuous',
        isCorrect: false,
        explanation: 'Le mode promiscuous est réservé à la capture de paquets (Wireshark/tcpdump).',
        explanationFr: 'Le mode promiscuous est réservé à la capture de paquets (Wireshark/tcpdump).'
      },
      {
        id: 'opt-4',
        label: 'nmcli ne peut pas modifier les connexions',
        labelFr: 'nmcli ne peut pas modifier les connexions',
        isCorrect: false,
        explanation: '"nmcli con mod" est l\'outil conçu exactement pour cela.',
        explanationFr: '"nmcli con mod" est l\'outil conçu exactement pour cela.'
      }
    ],
    correctedSnippet: `nmcli con mod "System eth0" connection.autoconnect yes
nmcli con up "System eth0"`,
    fixExplanation: '"nmcli con up" démarre la connexion et "autoconnect yes" la pérennise au boot.',
    fixExplanationFr: '"nmcli con up" démarre la connexion et "autoconnect yes" la pérennise au boot.'
  },

  // ==========================================
  // TOPIC 110: SECURITY (110.1 - 110.3) [8 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-110-01',
    title: 'Permissions trop ouvertes sur ~/.ssh/authorized_keys refusant la connexion par clé',
    titleFr: 'Authentification SSH par clé refusée : permissions trop permissives sur ~/.ssh ou authorized_keys',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.3',
    category: 'Security',
    scenario: 'L\'utilisateur a copié sa clé publique dans ~/.ssh/authorized_keys. Pourtant, le serveur SSH redemande systématiquement un mot de passe. Dans les logs sshd : "Authentication refused: bad ownership or modes for file".',
    scenarioFr: 'L\'utilisateur a copié sa clé publique dans ~/.ssh/authorized_keys. Pourtant, le serveur SSH redemande systématiquement un mot de passe. Dans les logs sshd : "Authentication refused: bad ownership or modes for file".',
    codeSnippet: `user@srv:~$ ls -la ~/.ssh
drwxrwxrwx 2 user user 4096 Feb 19 12:00 .
-rw-rw-rw- 1 user user  570 Feb 19 12:00 authorized_keys
# Les permissions sont en 777 et 666 !`,
    language: 'bash',
    bugDescription: 'La directive par défaut "StrictModes yes" d\'OpenSSH refuse formellement d\'utiliser les clés si ~/.ssh ou authorized_keys sont accessibles en écriture par d\'autres utilisateurs.',
    bugDescriptionFr: 'La directive par défaut "StrictModes yes" d\'OpenSSH refuse formellement d\'utiliser les clés si ~/.ssh ou authorized_keys sont accessibles en écriture par d\'autres utilisateurs.',
    options: [
      {
        id: 'opt-1',
        label: 'Rétablir les permissions sécurisées strictes : "chmod 700 ~/.ssh" et "chmod 600 ~/.ssh/authorized_keys"',
        labelFr: 'Rétablir les permissions sécurisées strictes : "chmod 700 ~/.ssh" et "chmod 600 ~/.ssh/authorized_keys"',
        isCorrect: true,
        explanation: 'OpenSSH applique une vérification stricte de sécurité (StrictModes) : le répertoire .ssh doit être en 700 et le fichier authorized_keys en 600 (seul le propriétaire peut écrire).',
        explanationFr: 'OpenSSH applique une vérification stricte de sécurité (StrictModes) : le répertoire .ssh doit être en 700 et le fichier authorized_keys en 600 (seul le propriétaire peut écrire).'
      },
      {
        id: 'opt-2',
        label: 'Donner les droits 777 sur tout le dossier /home',
        labelFr: 'Donner les droits 777 sur tout le dossier /home',
        isCorrect: false,
        explanation: 'Cela aggraverait le problème : SSH refuserait également la connexion car le home directory serait accessible en écriture par le groupe ou les autres.',
        explanationFr: 'Cela aggraverait le problème : SSH refuserait également la connexion car le home directory serait accessible en écriture par le groupe ou les autres.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer la clé privée du client',
        labelFr: 'Supprimer la clé privée du client',
        isCorrect: false,
        explanation: 'Sans clé privée, aucune authentification asymétrique n\'est possible.',
        explanationFr: 'Sans clé privée, aucune authentification asymétrique n\'est possible.'
      },
      {
        id: 'opt-4',
        label: 'Changer le port SSH vers 21',
        labelFr: 'Changer le port SSH vers 21',
        isCorrect: false,
        explanation: 'Le port 21 est réservé à FTP.',
        explanationFr: 'Le port 21 est réservé à FTP.'
      }
    ],
    correctedSnippet: `chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys`,
    fixExplanation: 'Restreindre les droits à 700 et 600 satisfait les exigences de sécurité strictes d\'OpenSSH.',
    fixExplanationFr: 'Restreindre les droits à 700 et 600 satisfait les exigences de sécurité strictes d\'OpenSSH.'
  },
  {
    id: 'tb-lpic1-110-02',
    title: 'Édition sécurisée de /etc/sudoers avec la commande visudo',
    titleFr: 'Erreur de syntaxe dans /etc/sudoers bloquant l\'accès administrateur : utilisation de visudo',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.1',
    category: 'Security',
    scenario: 'Un administrateur édite directement "/etc/sudoers" avec nano et commet une coquille. Dès qu\'un utilisateur tape "sudo", le système renvoie "syntax error in /etc/sudoers near line 25" et bloque tout accès.',
    scenarioFr: 'Un administrateur édite directement "/etc/sudoers" avec nano et commet une coquille. Dès qu\'un utilisateur tape "sudo", le système renvoie "syntax error in /etc/sudoers near line 25" et bloque tout accès.',
    codeSnippet: `root@srv:~# nano /etc/sudoers
# L'utilisateur écrit : "bob ALL=(ALL) AL" au lieu de "ALL"
bob@srv:~$ sudo ls
>>> /etc/sudoers: syntax error near line 25 <<<
sudo: parse error in /etc/sudoers near line 25
sudo: no valid sudoers sources found, quitting`,
    language: 'bash',
    bugDescription: 'Modifier /etc/sudoers sans vérificateur de syntaxe risque de verrouiller définitivement les privilèges root. Il faut impérativement utiliser "visudo".',
    bugDescriptionFr: 'Modifier /etc/sudoers sans vérificateur de syntaxe risque de verrouiller définitivement les privilèges root. Il faut impérativement utiliser "visudo".',
    options: [
      {
        id: 'opt-1',
        label: 'Toujours utiliser la commande "visudo" (ou "visudo -f /etc/sudoers.d/fichier") qui verrouille le fichier et effectue un contrôle syntaxique strict avant sauvegarde',
        labelFr: 'Toujours utiliser la commande "visudo" (ou "visudo -f /etc/sudoers.d/fichier") qui verrouille le fichier et effectue un contrôle syntaxique strict avant sauvegarde',
        isCorrect: true,
        explanation: 'visudo empêche les modifications simultanées et vérifie la grammaire du fichier sudoers. En cas d\'erreur, il refuse d\'enregistrer et propose de rééditer.',
        explanationFr: 'visudo empêche les modifications simultanées et vérifie la grammaire du fichier sudoers. En cas d\'erreur, il refuse d\'enregistrer et propose de rééditer.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer /etc/sudoers',
        labelFr: 'Supprimer /etc/sudoers',
        isCorrect: false,
        explanation: 'Supprimer /etc/sudoers désactiverait toute élévation de privilèges via sudo sur le système.',
        explanationFr: 'Supprimer /etc/sudoers désactiverait toute élévation de privilèges via sudo sur le système.'
      },
      {
        id: 'opt-3',
        label: 'Mettre sudo en mode permissif',
        labelFr: 'Mettre sudo en mode permissif',
        isCorrect: false,
        explanation: 'Sudo n\'a pas de mode permissif, une erreur syntaxique est fatale.',
        explanationFr: 'Sudo n\'a pas de mode permissif, une erreur syntaxique est fatale.'
      },
      {
        id: 'opt-4',
        label: 'Utiliser echo pour écraser /etc/sudoers',
        labelFr: 'Utiliser echo pour écraser /etc/sudoers',
        isCorrect: false,
        explanation: 'Écraser brutalement sans validation reproduirait le même risque.',
        explanationFr: 'Écraser brutalement sans validation reproduirait le même risque.'
      }
    ],
    correctedSnippet: `visudo`,
    fixExplanation: '"visudo" valide la syntaxe avant d\'écrire les modifications sur disque.',
    fixExplanationFr: '"visudo" valide la syntaxe avant d\'écrire les modifications sur disque.'
  },
  {
    id: 'tb-lpic1-110-03',
    title: 'Détection des binaires avec bits SUID et SGID suspects avec find',
    titleFr: 'Audit de sécurité : recherche des fichiers exécutables avec bit SUID (perm 4000) non standard',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.1',
    category: 'Security',
    scenario: 'Après une suspicion d\'intrusion, l\'administrateur doit localiser tous les binaires possédant le bit SUID (exécution avec les droits de root) sur le système de fichiers.',
    scenarioFr: 'Après une suspicion d\'intrusion, l\'administrateur doit localiser tous les binaires possédant le bit SUID (exécution avec les droits de root) sur le système de fichiers.',
    codeSnippet: `root@srv:~# ls -l /tmp/.backdoor
-rwsr-xr-x 1 root root 15420 Feb 19 03:00 /tmp/.backdoor
# Un binaire avec le bit 's' dans /tmp permet d'obtenir un shell root immédiat !`,
    language: 'bash',
    bugDescription: 'Les fichiers SUID posent un risque critique s\'ils sont situés dans des répertoires inattendus (/tmp, /home). Il faut utiliser "find / -perm -4000".',
    bugDescriptionFr: 'Les fichiers SUID posent un risque critique s\'ils sont situés dans des répertoires inattendus (/tmp, /home). Il faut utiliser "find / -perm -4000".',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter "find / -perm -4000 -type f 2>/dev/null" pour lister tous les binaires SUID (ou "-perm /6000" pour SUID et SGID)',
        labelFr: 'Exécuter "find / -perm -4000 -type f 2>/dev/null" pour lister tous les binaires SUID (ou "-perm /6000" pour SUID et SGID)',
        isCorrect: true,
        explanation: 'La valeur octale 4000 correspond au bit SUID (Set User ID). Le préfixe "-" ou "/" teste la présence du bit parmi les permissions.',
        explanationFr: 'La valeur octale 4000 correspond au bit SUID (Set User ID). Le préfixe "-" ou "/" teste la présence du bit parmi les permissions.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser grep -r "SUID" /bin',
        labelFr: 'Utiliser grep -r "SUID" /bin',
        isCorrect: false,
        explanation: 'SUID est un bit d\'inode de métadonnées, pas une chaîne de texte dans le fichier.',
        explanationFr: 'SUID est un bit d\'inode de métadonnées, pas une chaîne de texte dans le fichier.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer le bit SUID de /usr/bin/passwd et /usr/bin/sudo',
        labelFr: 'Supprimer le bit SUID de /usr/bin/passwd et /usr/bin/sudo',
        isCorrect: false,
        explanation: 'Ces binaires légitimes ont impérativement besoin de SUID pour fonctionner.',
        explanationFr: 'Ces binaires légitimes ont impérativement besoin de SUID pour fonctionner.'
      },
      {
        id: 'opt-4',
        label: 'Les fichiers SUID sont interdits par le noyau Linux',
        labelFr: 'Les fichiers SUID sont interdits par le noyau Linux',
        isCorrect: false,
        explanation: 'Le bit SUID est un mécanisme standard fondamental d\'Unix depuis 1973.',
        explanationFr: 'Le bit SUID est un mécanisme standard fondamental d\'Unix depuis 1973.'
      }
    ],
    correctedSnippet: `find / -type f -perm -4000 -exec ls -ld {} + 2>/dev/null`,
    fixExplanation: 'Cette commande audite l\'ensemble de l\'arborescence à la recherche des privilèges SUID.',
    fixExplanationFr: 'Cette commande audite l\'ensemble de l\'arborescence à la recherche des privilèges SUID.'
  },
  {
    id: 'tb-lpic1-110-04',
    title: 'Interdiction de connexion aux utilisateurs non-root avec /etc/nologin',
    titleFr: 'Connexion SSH refusée à tous les utilisateurs non-root : présence du verrou /etc/nologin',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.2',
    category: 'Security',
    scenario: 'Aucun utilisateur normal ne parvient à se connecter en SSH : la session se ferme instantanément en affichant "System maintenance in progress". Seul le compte root peut se connecter.',
    scenarioFr: 'Aucun utilisateur normal ne parvient à se connecter en SSH : la session se ferme instantanément en affichant "System maintenance in progress". Seul le compte root peut se connecter.',
    codeSnippet: `user@srv:~$ ssh alice@192.168.1.50
System maintenance in progress
Connection to 192.168.1.50 closed.`,
    language: 'bash',
    bugDescription: 'Le fichier "/etc/nologin" existe. Quand ce fichier est présent, le module pam_nologin bloque toutes les connexions d\'utilisateurs non-root et affiche son contenu.',
    bugDescriptionFr: 'Le fichier "/etc/nologin" existe. Quand ce fichier est présent, le module pam_nologin bloque toutes les connexions d\'utilisateurs non-root et affiche son contenu.',
    options: [
      {
        id: 'opt-1',
        label: 'Supprimer le fichier verrou "/etc/nologin" (avec "rm -f /etc/nologin")',
        labelFr: 'Supprimer le fichier verrou "/etc/nologin" (avec "rm -f /etc/nologin")',
        isCorrect: true,
        explanation: '/etc/nologin est le mécanisme standard Unix pour interdire les connexions pendant une phase de maintenance tout en laissant l\'accès à root.',
        explanationFr: '/etc/nologin est le mécanisme standard Unix pour interdire les connexions pendant une phase de maintenance tout en laissant l\'accès à root.'
      },
      {
        id: 'opt-2',
        label: 'Modifier le shell de tous les utilisateurs dans /etc/passwd',
        labelFr: 'Modifier le shell de tous les utilisateurs dans /etc/passwd',
        isCorrect: false,
        explanation: 'Leur shell est déjà valide, c\'est le fichier /etc/nologin qui intercepte PAM.',
        explanationFr: 'Leir shell est déjà valide, c\'est le fichier /etc/nologin qui intercepte PAM.'
      },
      {
        id: 'opt-3',
        label: 'Redémarrer le démon SSH',
        labelFr: 'Redémarrer le démon SSH',
        isCorrect: false,
        explanation: 'Tant que /etc/nologin existe, SSH continuera de bloquer les sessions non-root.',
        explanationFr: 'Tant que /etc/nologin existe, SSH continuera de bloquer les sessions non-root.'
      },
      {
        id: 'opt-4',
        label: 'Créer un mot de passe vide pour alice',
        labelFr: 'Créer un mot de passe vide pour alice',
        isCorrect: false,
        explanation: 'Un mot de passe vide aggraverait la vulnérabilité sans lever le verrou.',
        explanationFr: 'Un mot de passe vide aggraverait la vulnérabilité sans lever le verrou.'
      }
    ],
    correctedSnippet: `rm -f /etc/nologin`,
    fixExplanation: 'La suppression de /etc/nologin rétablit immédiatement l\'accès aux comptes standard.',
    fixExplanationFr: 'La suppression de /etc/nologin rétablit immédiatement l\'accès aux comptes standard.'
  },
  {
    id: 'tb-lpic1-110-05',
    title: 'Limites de ressources système (ulimit) et /etc/security/limits.conf',
    titleFr: 'Erreur "Too many open files" ou "Resource temporarily unavailable" (fork bomb) : réglages ulimit',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.2',
    category: 'Security',
    scenario: 'Une application base de données plante avec "Error: Too many open files". L\'administrateur tape "ulimit -n" et constate une limite maximale de 1024 fichiers ouverts.',
    scenarioFr: 'Une application base de données plante avec "Error: Too many open files". L\'administrateur tape "ulimit -n" et constate une limite maximale de 1024 fichiers ouverts.',
    codeSnippet: `user@srv:~$ ulimit -n
1024
user@srv:~$ ulimit -n 65535
bash: ulimit: cannot modify limit: Operation not permitted`,
    language: 'bash',
    bugDescription: 'Un utilisateur non-root ne peut pas dépasser la limite matérielle (hard limit) définie pour son compte dans /etc/security/limits.conf.',
    bugDescriptionFr: 'Un utilisateur non-root ne peut pas dépasser la limite matérielle (hard limit) définie pour son compte dans /etc/security/limits.conf.',
    options: [
      {
        id: 'opt-1',
        label: 'Augmenter les limites "soft" et "hard" de "nofile" dans "/etc/security/limits.conf" (ex: "user hard nofile 65535")',
        labelFr: 'Augmenter les limites "soft" et "hard" de "nofile" dans "/etc/security/limits.conf" (ex: "user hard nofile 65535")',
        isCorrect: true,
        explanation: 'PAM applique les règles de pam_limits.so basées sur /etc/security/limits.conf. Pour augmenter les descripteurs de fichiers, on ajuste nofile.',
        explanationFr: 'PAM applique les règles de pam_limits.so basées sur /etc/security/limits.conf. Pour augmenter les descripteurs de fichiers, on ajuste nofile.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer pam_limits.so',
        labelFr: 'Supprimer pam_limits.so',
        isCorrect: false,
        explanation: 'Supprimer le module PAM risquerait d\'endommager toute la pile d\'authentification.',
        explanationFr: 'Supprimer le module PAM risquerait d\'endommager toute la pile d\'authentification.'
      },
      {
        id: 'opt-3',
        label: 'ulimit ne peut être modifié que lors de la compilation du noyau',
        labelFr: 'ulimit ne peut être modifié que lors de la compilation du noyau',
        isCorrect: false,
        explanation: 'Les limites ulimit sont configurables dynamiquement en espace utilisateur.',
        explanationFr: 'Les limites ulimit sont configurables dynamiquement en espace utilisateur.'
      },
      {
        id: 'opt-4',
        label: 'Donner les droits 777 sur /proc/sys',
        labelFr: 'Donner les droits 777 sur /proc/sys',
        isCorrect: false,
        explanation: '/proc/sys est un système de fichiers virtuel du noyau hautement sensible.',
        explanationFr: '/proc/sys est un système de fichiers virtuel du noyau hautement sensible.'
      }
    ],
    correctedSnippet: `# Dans /etc/security/limits.conf :
*       soft    nofile  65535
*       hard    nofile  65535`,
    fixExplanation: 'Configurer "nofile" dans /etc/security/limits.conf pérennise la hausse des descripteurs autorisés.',
    fixExplanationFr: 'Configurer "nofile" dans /etc/security/limits.conf pérennise la hausse des descripteurs autorisés.'
  },
  {
    id: 'tb-lpic1-110-06',
    title: 'Désactivation de l\'accès root direct par mot de passe via SSH',
    titleFr: 'Sécurisation de sshd_config : "PermitRootLogin no" ou "prohibit-password"',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.3',
    category: 'Security',
    scenario: 'Le serveur subit des attaques par force brute sur le compte root en SSH. L\'administrateur doit interdire la connexion directe de root par mot de passe.',
    scenarioFr: 'Le serveur subit des attaques par force brute sur le compte root en SSH. L\'administrateur doit interdire la connexion directe de root par mot de passe.',
    codeSnippet: `root@srv:~# grep PermitRootLogin /etc/ssh/sshd_config
PermitRootLogin yes
# N'importe qui sur Internet peut tenter de deviner le mot de passe root !`,
    language: 'bash',
    bugDescription: 'La directive "PermitRootLogin yes" permet aux attaquants de cibler directement l\'identifiant universel "root" via SSH.',
    bugDescriptionFr: 'La directive "PermitRootLogin yes" permet aux attaquants de cibler directement l\'identifiant universel "root" via SSH.',
    options: [
      {
        id: 'opt-1',
        label: 'Définir "PermitRootLogin no" (ou "prohibit-password" pour n\'autoriser que les clés publiques) dans /etc/ssh/sshd_config puis recharger sshd',
        labelFr: 'Définir "PermitRootLogin no" (ou "prohibit-password" pour n\'autoriser que les clés publiques) dans /etc/ssh/sshd_config puis recharger sshd',
        isCorrect: true,
        explanation: '"PermitRootLogin no" oblige tout administrateur à se connecter d\'abord avec un compte individuel nominatif avant d\'élever ses privilèges avec sudo ou su.',
        explanationFr: '"PermitRootLogin no" oblige tout administrateur à se connecter d\'abord avec un compte individuel nominatif avant d\'élever ses privilèges avec sudo ou su.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer le mot de passe root dans /etc/shadow',
        labelFr: 'Supprimer le mot de passe root dans /etc/shadow',
        isCorrect: false,
        explanation: 'Supprimer le mot de passe empêcherait les connexions locales en console d\'urgence.',
        explanationFr: 'Supprimer le mot de passe empêcherait les connexions locales en console d\'urgence.'
      },
      {
        id: 'opt-3',
        label: 'Désinstaller OpenSSH',
        labelFr: 'Désinstaller OpenSSH',
        isCorrect: false,
        explanation: 'Cela priverait la machine de tout accès d\'administration à distance.',
        explanationFr: 'Cela priverait la machine de tout accès d\'administration à distance.'
      },
      {
        id: 'opt-4',
        label: 'Changer le nom du compte root en superroot',
        labelFr: 'Changer le nom du compte root en superroot',
        isCorrect: false,
        explanation: 'De nombreux scripts et démons attendent formellement le nom "root" ou l\'UID 0.',
        explanationFr: 'De nombreux scripts et démons attendent formellement le nom "root" ou l\'UID 0.'
      }
    ],
    correctedSnippet: `# Dans /etc/ssh/sshd_config :
PermitRootLogin no
# Recharger le démon :
systemctl reload sshd`,
    fixExplanation: '"PermitRootLogin no" neutralise les attaques en force brute sur le compte root en SSH.',
    fixExplanationFr: '"PermitRootLogin no" neutralise les attaques en force brute sur le compte root en SSH.'
  },
  {
    id: 'tb-lpic1-110-07',
    title: 'Gestion des clés d\'authentification SSH avec ssh-agent et ssh-add',
    titleFr: 'Saisie répétitive de la passphrase de clé SSH : utilisation de ssh-agent et ssh-add',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.3',
    category: 'Security',
    scenario: 'Un administrateur doit se connecter à 20 serveurs différents. À chaque connexion, SSH lui redemande la passphrase de sa clé privée ~/.ssh/id_ed25519.',
    scenarioFr: 'Un administrateur doit se connecter à 20 serveurs différents. À chaque connexion, SSH lui redemande la passphrase de sa clé privée ~/.ssh/id_ed25519.',
    codeSnippet: `user@srv:~$ ssh srv01
Enter passphrase for key '/home/user/.ssh/id_ed25519': 
user@srv:~$ ssh srv02
Enter passphrase for key '/home/user/.ssh/id_ed25519': `,
    language: 'bash',
    bugDescription: 'L\'agent SSH (ssh-agent) n\'est pas initialisé ou la clé privée n\'y a pas été chargée avec "ssh-add".',
    bugDescriptionFr: 'L\'agent SSH (ssh-agent) n\'est pas initialisé ou la clé privée n\'y a pas été chargée avec "ssh-add".',
    options: [
      {
        id: 'opt-1',
        label: 'Démarrer l\'agent avec \'eval $(ssh-agent)\' et ajouter la clé avec \'ssh-add ~/.ssh/id_ed25519\' pour ne taper la passphrase qu\'une seule fois',
        labelFr: 'Démarrer l\'agent avec \'eval $(ssh-agent)\' et ajouter la clé avec \'ssh-add ~/.ssh/id_ed25519\' pour ne taper la passphrase qu\'une seule fois',
        isCorrect: true,
        explanation: 'ssh-agent conserve la clé déchiffrée en mémoire sécurisée pendant toute la durée de la session. ssh-add permet de l\'enregistrer.',
        explanationFr: 'ssh-agent conserve la clé déchiffrée en mémoire sécurisée pendant toute la durée de la session. ssh-add permet de l\'enregistrer.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer la passphrase de la clé privée pour la laisser en clair sur le disque',
        labelFr: 'Supprimer la passphrase de la clé privée pour la laisser en clair sur le disque',
        isCorrect: false,
        explanation: 'Laisser une clé privée sans mot de passe est une violation grave des bonnes pratiques de sécurité.',
        explanationFr: 'Laisser une clé privée sans mot de passe est une violation grave des bonnes pratiques de sécurité.'
      },
      {
        id: 'opt-3',
        label: 'Désactiver le chiffrement SSH',
        labelFr: 'Désactiver le chiffrement SSH',
        isCorrect: false,
        explanation: 'SSH chiffre obligatoirement toutes les communications.',
        explanationFr: 'SSH chiffre obligatoirement toutes les communications.'
      },
      {
        id: 'opt-4',
        label: 'ssh-add est réservé à macOS',
        labelFr: 'ssh-add est réservé à macOS',
        isCorrect: false,
        explanation: 'ssh-add fait partie intégrante de la suite standard OpenSSH présente sur Linux.',
        explanationFr: 'ssh-add fait partie intégrante de la suite standard OpenSSH présente sur Linux.'
      }
    ],
    correctedSnippet: `eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519`,
    fixExplanation: '"ssh-agent" et "ssh-add" mettent en cache la clé déchiffrée pour toute la session.',
    fixExplanationFr: '"ssh-agent" et "ssh-add" mettent en cache la clé déchiffrée pour toute la session.'
  },
  {
    id: 'tb-lpic1-110-08',
    title: 'Chiffrement et signature asymétrique de documents avec GPG (GnuPG)',
    titleFr: 'Signature GPG invalide : clé publique de l\'émetteur non importée dans le trousseau',
    certification: 'lpic-1',
    topicNumber: 110,
    objectiveId: '110.3',
    category: 'Security',
    scenario: 'L\'administrateur vérifie un paquet ou fichier signé : "gpg --verify archive.tar.gz.asc archive.tar.gz". GPG renvoie : "Can\'t check signature: No public key".',
    scenarioFr: 'L\'administrateur vérifie un paquet ou fichier signé : "gpg --verify archive.tar.gz.asc archive.tar.gz". GPG renvoie : "Can\'t check signature: No public key".',
    codeSnippet: `user@srv:~$ gpg --verify package.tar.gz.asc package.tar.gz
gpg: Signature made Wed Feb 19 09:00:00 2025 UTC
gpg:                using RSA key 0123456789ABCDEF
gpg: Can't check signature: No public key`,
    language: 'bash',
    bugDescription: 'La clé publique de l\'auteur n\'a pas encore été importée dans le trousseau GPG local (~/.gnupg).',
    bugDescriptionFr: 'La clé publique de l\'auteur n\'a pas encore été importée dans le trousseau GPG local (~/.gnupg).',
    options: [
      {
        id: 'opt-1',
        label: 'Importer la clé publique correspondante avec "gpg --import cle_publique.asc" ou depuis un serveur de clés avec "gpg --recv-keys 0123456789ABCDEF"',
        labelFr: 'Importer la clé publique correspondante avec "gpg --import cle_publique.asc" ou depuis un serveur de clés avec "gpg --recv-keys 0123456789ABCDEF"',
        isCorrect: true,
        explanation: 'Pour vérifier une signature cryptographique avec GPG, il est impératif de posséder la clé publique correspondante de l\'émetteur dans son trousseau de clés.',
        explanationFr: 'Pour vérifier une signature cryptographique avec GPG, il est impératif de posséder la clé publique correspondante de l\'émetteur dans son trousseau de clés.'
      },
      {
        id: 'opt-2',
        label: 'Désinstaller GnuPG',
        labelFr: 'Désinstaller GnuPG',
        isCorrect: false,
        explanation: 'GnuPG est requis pour la vérification.',
        explanationFr: 'GnuPG est requis pour la vérification.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer le fichier .asc',
        labelFr: 'Supprimer le fichier .asc',
        isCorrect: false,
        explanation: 'Le fichier .asc contient la signature cryptographique détachée.',
        explanationFr: 'Le fichier .asc contient la signature cryptographique détachée.'
      },
      {
        id: 'opt-4',
        label: 'GPG ne supporte pas l\'algorithme RSA',
        labelFr: 'GPG ne supporte pas l\'algorithme RSA',
        isCorrect: false,
        explanation: 'RSA est l\'un des algorithmes principaux supportés par OpenPGP.',
        explanationFr: 'RSA est l\'un des algorithmes principaux supportés par OpenPGP.'
      }
    ],
    correctedSnippet: `gpg --recv-keys 0123456789ABCDEF
gpg --verify package.tar.gz.asc package.tar.gz`,
    fixExplanation: 'L\'import de la clé publique permet à GPG de valider l\'intégrité et l\'authenticité de la signature.',
    fixExplanationFr: 'L\'import de la clé publique permet à GPG de valider l\'intégrité et l\'authenticité de la signature.'
  }
];
