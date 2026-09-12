import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-2 : Examen 201 (Partie 1: Topics 200, 201, 202, 203)
 * Topics couverts :
 * - Topic 200 : Capacity Planning (sar, vmstat, iostat, collectd, limits)
 * - Topic 201 : The Linux Kernel (modules, DKMS, compilation, sysctl, udev)
 * - Topic 202 : System Startup (SysVinit, systemd units, GRUB recovery)
 * - Topic 203 : Filesystem and Devices (mounts, inodes, xfs_repair, btrfs, quotas, smartctl)
 */
export const lpic2Troubleshoot201_1: TroubleshootingChallenge[] = [
  {
    id: "tb-lpic2-201-01",
    title: "Échec de collecte métrique sysstat/sar sous /var/log/sa",
    titleFr: "Échec de collecte métrique sysstat/sar sous /var/log/sa",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.1",
    category: "Capacity Planning - Sysstat & SAR",
    scenario: "L'administrateur LPIC-2 constate que la commande 'sar -q' ne retourne aucune donnée historique. Les fichiers saDD dans /var/log/sa ne sont plus générés.",
    scenarioFr: "L'administrateur LPIC-2 constate que la commande 'sar -q' ne retourne aucune donnée historique. Les fichiers saDD dans /var/log/sa ne sont plus générés.",
    codeSnippet: `# cat /etc/default/sysstat
ENABLED="false"

# systemctl status sysstat
Active: inactive (dead)`,
    language: "config",
    bugDescription: "Sur Debian/Ubuntu, sysstat est désactivé par défaut via ENABLED=\"false\" dans /etc/default/sysstat, empêchant la collecte par sadc.",
    bugDescriptionFr: "Sur Debian/Ubuntu, sysstat est désactivé par défaut via ENABLED=\"false\" dans /etc/default/sysstat, empêchant la collecte par sadc.",
    options: [
      {
        id: "opt-1",
        label: "Passer ENABLED à \"true\" dans /etc/default/sysstat et redémarrer le service sysstat",
        labelFr: "Passer ENABLED à \"true\" dans /etc/default/sysstat et redémarrer le service sysstat",
        isCorrect: true,
        explanation: "Le fichier /etc/default/sysstat contrôle l'activation globale de la collecte sadc/sa1.",
        explanationFr: "Le fichier /etc/default/sysstat contrôle l'activation globale de la collecte sadc/sa1."
      },
      {
        id: "opt-2",
        label: "Changer les droits de /var/log/sa en 0777",
        labelFr: "Changer les droits de /var/log/sa en 0777",
        isCorrect: false,
        explanation: "Les droits par défaut 0755 root:root sont corrects.",
        explanationFr: "Les droits par défaut 0755 root:root sont corrects."
      },
      {
        id: "opt-3",
        label: "Remplacer sar par vmstat dans le crontab",
        labelFr: "Remplacer sar par vmstat dans le crontab",
        isCorrect: false,
        explanation: "vmstat ne remplace pas l'archivage historique de sysstat.",
        explanationFr: "vmstat ne remplace pas l'archivage historique de sysstat."
      },
      {
        id: "opt-4",
        label: "Compiler à nouveau le noyau avec l'option CONFIG_SYSSTAT=y",
        labelFr: "Compiler à nouveau le noyau avec l'option CONFIG_SYSSTAT=y",
        isCorrect: false,
        explanation: "sysstat est un outil en espace utilisateur s'appuyant sur /proc et /sys.",
        explanationFr: "sysstat est un outil en espace utilisateur s'appuyant sur /proc et /sys."
      }
    ],
    correctedSnippet: `# /etc/default/sysstat
ENABLED="true"

# systemctl restart sysstat`,
    fixExplanation: "Activer la collecte dans /etc/default/sysstat puis redémarrer le service.",
    fixExplanationFr: "Activer la collecte dans /etc/default/sysstat puis redémarrer le service."
  },
  {
    id: "tb-lpic2-201-02",
    title: "Saturation d'I/O et Thrashing Swap détectés via vmstat",
    titleFr: "Saturation d'I/O et Thrashing Swap détectés via vmstat",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.1",
    category: "Capacity Planning - Performance Troubleshooting",
    scenario: "Sur un serveur de production, les temps de réponse explosent. L'administrateur LPIC-2 analyse vmstat.",
    scenarioFr: "Sur un serveur de production, les temps de réponse explosent. L'administrateur LPIC-2 analyse vmstat.",
    codeSnippet: `# vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 2  9 5242880  71200   9400  32100 9400 8900  9500  9100 4800 6200  4 16  0 80  0`,
    language: "bash",
    bugDescription: "Les colonnes si (swap-in) et so (swap-out) sont très élevées et le CPU passe 80% de son temps en attente d'E/S (wa), indiquant un écroulement par pagination swap (thrashing).",
    bugDescriptionFr: "Les colonnes si (swap-in) et so (swap-out) sont très élevées et le CPU passe 80% de son temps en attente d'E/S (wa), indiquant un écroulement par pagination swap (thrashing).",
    options: [
      {
        id: "opt-1",
        label: "Thrashing mémoire critique : la RAM physique saturée provoque un va-et-vient swap massif (si/so élevés) bloquant le CPU en wa (80%)",
        labelFr: "Thrashing mémoire critique : la RAM physique saturée provoque un va-et-vient swap massif (si/so élevés) bloquant le CPU en wa (80%)",
        isCorrect: true,
        explanation: "Des valeurs si/so soutenues associées à un wa élevé caractérisent un manque critique de RAM physique.",
        explanationFr: "Des valeurs si/so soutenues associées à un wa élevé caractérisent un manque critique de RAM physique."
      },
      {
        id: "opt-2",
        label: "Le processeur est saturé par un calcul intensif en espace utilisateur (us)",
        labelFr: "Le processeur est saturé par un calcul intensif en espace utilisateur (us)",
        isCorrect: false,
        explanation: "us est à seulement 4%, le problème se situe sur le stockage et la mémoire.",
        explanationFr: "us est à seulement 4%, le problème se situe sur le stockage et la mémoire."
      },
      {
        id: "opt-3",
        label: "Le disque est inactif car bi et bo sont proches de zéro",
        labelFr: "Le disque est inactif car bi et bo sont proches de zéro",
        isCorrect: false,
        explanation: "bi et bo dépassent 9000 blocs/seconde.",
        explanationFr: "bi et bo dépassent 9000 blocs/seconde."
      },
      {
        id: "opt-4",
        label: "Le nombre de processus en attente (r) dépasse la limite noyau",
        labelFr: "Le nombre de processus en attente (r) dépasse la limite noyau",
        isCorrect: false,
        explanation: "r=2 est une valeur très basse.",
        explanationFr: "r=2 est une valeur très basse."
      }
    ],
    correctedSnippet: `# Identifier le processus saturant la RAM :
ps aux --sort=-%mem | head -n 10
# Réduire la pression swap immédiate :
sysctl -w vm.swappiness=10`,
    fixExplanation: "Libérer de la RAM ou dimensionner la mémoire physique et diminuer vm.swappiness.",
    fixExplanationFr: "Libérer de la RAM ou dimensionner la mémoire physique et diminuer vm.swappiness."
  },
  {
    id: "tb-lpic2-201-03",
    title: "Saturation I/O stockage identifiée avec iostat",
    titleFr: "Saturation I/O stockage identifiée avec iostat",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.1",
    category: "Capacity Planning - Storage Analysis",
    scenario: "L'administrateur LPIC-2 constate que les applications se figent. Il lance iostat -xz 1 pour évaluer l'état du disque sda.",
    scenarioFr: "L'administrateur LPIC-2 constate que les applications se figent. Il lance iostat -xz 1 pour évaluer l'état du disque sda.",
    codeSnippet: `# iostat -xz 1 1
Device            r/s     w/s     rkB/s     wkB/s   aqu-sz  await  %util
sda            150.00  380.00   6400.00  24500.00    28.4  58.50 100.00`,
    language: "bash",
    bugDescription: "Le disque sda est saturé à 100% (%util=100.00) avec une file d'attente moyenne aqu-sz de 28 requêtes et un await de 58 ms.",
    bugDescriptionFr: "Le disque sda est saturé à 100% (%util=100.00) avec une file d'attente moyenne aqu-sz de 28 requêtes et un await de 58 ms.",
    options: [
      {
        id: "opt-1",
        label: "Le disque sda est saturé à 100% de son temps de service, provoquant une file d'attente aqu-sz élevée et de fortes latences",
        labelFr: "Le disque sda est saturé à 100% de son temps de service, provoquant une file d'attente aqu-sz élevée et de fortes latences",
        isCorrect: true,
        explanation: "%util à 100% signifie que le périphérique ne peut traiter plus de requêtes sans accumulation.",
        explanationFr: "%util à 100% signifie que le périphérique ne peut traiter plus de requêtes sans accumulation."
      },
      {
        id: "opt-2",
        label: "La commande iostat a échoué car le disque sda a été éjecté du bus SCSI",
        labelFr: "La commande iostat a échoué car le disque sda a été éjecté du bus SCSI",
        isCorrect: false,
        explanation: "Les statistiques remontent des lectures et écritures bien réelles.",
        explanationFr: "Les statistiques remontent des lectures et écritures bien réelles."
      },
      {
        id: "opt-3",
        label: "Le volume de lecture (rkB/s) est anormalement nul",
        labelFr: "Le volume de lecture (rkB/s) est anormalement nul",
        isCorrect: false,
        explanation: "rkB/s est à 6400 ko/s.",
        explanationFr: "rkB/s est à 6400 ko/s."
      },
      {
        id: "opt-4",
        label: "aqu-sz indique le taux d'erreurs CRC par seconde",
        labelFr: "aqu-sz indique le taux d'erreurs CRC par seconde",
        isCorrect: false,
        explanation: "aqu-sz est l'Average Queue Size.",
        explanationFr: "aqu-sz est l'Average Queue Size."
      }
    ],
    correctedSnippet: `# Localiser les processus auteurs des écritures :
iotop -oPa
# Configurer un ordonnanceur adapté (ex: mq-deadline ou bfq) et envisager un stockage plus rapide :
echo mq-deadline > /sys/block/sda/queue/scheduler`,
    fixExplanation: "Isoler les écritures massives et ajuster l'ordonnanceur d'E/S ou le matériel.",
    fixExplanationFr: "Isoler les écritures massives et ajuster l'ordonnanceur d'E/S ou le matériel."
  },
  {
    id: "tb-lpic2-201-04",
    title: "Erreur d'initialisation du plugin RRDtool de collectd",
    titleFr: "Erreur d'initialisation du plugin RRDtool de collectd",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.2",
    category: "Capacity Planning - Collectd Metrics",
    scenario: "Le service collectd signale une erreur au démarrage et ne crée aucun fichier de métriques dans /var/lib/collectd/rrd.",
    scenarioFr: "Le service collectd signale une erreur au démarrage et ne crée aucun fichier de métriques dans /var/lib/collectd/rrd.",
    codeSnippet: `# collectd -t
Initialization of plugin \`rrdtool' failed.
Error: DataDir \`/var/lib/collectd/rrd' does not exist.

# ls -d /var/lib/collectd/rrd
ls: cannot access '/var/lib/collectd/rrd': No such file or directory`,
    language: "bash",
    bugDescription: "Le répertoire cible DataDir configuré dans /etc/collectd/collectd.conf n'existe pas.",
    bugDescriptionFr: "Le répertoire cible DataDir configuré dans /etc/collectd/collectd.conf n'existe pas.",
    options: [
      {
        id: "opt-1",
        label: "Créer le dossier /var/lib/collectd/rrd avec les permissions appropriées pour l'utilisateur collectd",
        labelFr: "Créer le dossier /var/lib/collectd/rrd avec les permissions appropriées pour l'utilisateur collectd",
        isCorrect: true,
        explanation: "collectd ne crée pas automatiquement son répertoire DataDir racine.",
        explanationFr: "collectd ne crée pas automatiquement son répertoire DataDir racine."
      },
      {
        id: "opt-2",
        label: "Supprimer le module rrdtool du fichier collectd.conf",
        labelFr: "Supprimer le module rrdtool du fichier collectd.conf",
        isCorrect: false,
        explanation: "Le module est indispensable pour produire les graphes RRD.",
        explanationFr: "Le module est indispensable pour produire les graphes RRD."
      },
      {
        id: "opt-3",
        label: "Installer une base PostgreSQL car RRDtool est déprécié",
        labelFr: "Installer une base PostgreSQL car RRDtool est déprécié",
        isCorrect: false,
        explanation: "RRDtool est un composant standard au programme LPIC-2.",
        explanationFr: "RRDtool est un composant standard au programme LPIC-2."
      },
      {
        id: "opt-4",
        label: "Exécuter collectd exclusivement avec le compte root",
        labelFr: "Exécuter collectd exclusivement avec le compte root",
        isCorrect: false,
        explanation: "Il est recommandé d'exécuter collectd sous son utilisateur dédié.",
        explanationFr: "Il est recommandé d'exécuter collectd sous son utilisateur dédié."
      }
    ],
    correctedSnippet: `# mkdir -p /var/lib/collectd/rrd
# chown -R collectd:collectd /var/lib/collectd
# systemctl restart collectd`,
    fixExplanation: "Créer le répertoire manquant et corriger la propriété pour collectd.",
    fixExplanationFr: "Créer le répertoire manquant et corriger la propriété pour collectd."
  },
  {
    id: "tb-lpic2-201-05",
    title: "Épuisement de la table des processus (kernel.pid_max)",
    titleFr: "Épuisement de la table des processus (kernel.pid_max)",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.1",
    category: "Capacity Planning - Kernel Limits",
    scenario: "Sur un serveur de build, bash refuse d'exécuter toute nouvelle commande : '-bash: fork: Cannot allocate memory', alors qu'il reste 25 Go de RAM libre.",
    scenarioFr: "Sur un serveur de build, bash refuse d'exécuter toute nouvelle commande : '-bash: fork: Cannot allocate memory', alors qu'il reste 25 Go de RAM libre.",
    codeSnippet: `# free -m
Mem: 32000 total, 6000 used, 25000 free

# cat /proc/sys/kernel/pid_max
32768

# ps -eLf | wc -l
32765`,
    language: "bash",
    bugDescription: "Le nombre de threads/processus a atteint la limite kernel.pid_max (32768). Le noyau refuse tout nouvel appel fork().",
    bugDescriptionFr: "Le nombre de threads/processus a atteint la limite kernel.pid_max (32768). Le noyau refuse tout nouvel appel fork().",
    options: [
      {
        id: "opt-1",
        label: "La table des PIDs noyau est saturée (32765 threads pour un pid_max de 32768), bloquant les appels système fork()",
        labelFr: "La table des PIDs noyau est saturée (32765 threads pour un pid_max de 32768), bloquant les appels système fork()",
        isCorrect: true,
        explanation: "fork() échoue avec ENOMEM (Cannot allocate memory) quand pid_max est atteint.",
        explanationFr: "fork() échoue avec ENOMEM (Cannot allocate memory) quand pid_max est atteint."
      },
      {
        id: "opt-2",
        label: "La mémoire swap est désactivée et empêche l'allocation",
        labelFr: "La mémoire swap est désactivée et empêche l'allocation",
        isCorrect: false,
        explanation: "25 Go de RAM libre permettent largement d'allouer de la mémoire.",
        explanationFr: "25 Go de RAM libre permettent largement d'allouer de la mémoire."
      },
      {
        id: "opt-3",
        label: "Le disque racine est plein",
        labelFr: "Le disque racine est plein",
        isCorrect: false,
        explanation: "Le message d'erreur concerne l'appel fork.",
        explanationFr: "Le message d'erreur concerne l'appel fork."
      },
      {
        id: "opt-4",
        label: "Le binaire bash est corrompu",
        labelFr: "Le binaire bash est corrompu",
        isCorrect: false,
        explanation: "C'est une limite du noyau Linux.",
        explanationFr: "C'est une limite du noyau Linux."
      }
    ],
    correctedSnippet: `# Augmenter temporairement :
sysctl -w kernel.pid_max=4194304
# Rendre permanent :
echo "kernel.pid_max = 4194304" >> /etc/sysctl.d/99-pidmax.conf`,
    fixExplanation: "Augmenter kernel.pid_max pour autoriser jusqu'à 4 millions de PIDs.",
    fixExplanationFr: "Augmenter kernel.pid_max pour autoriser jusqu'à 4 millions de PIDs."
  },
  {
    id: "tb-lpic2-201-06",
    title: "Erreur d'interrogation SNMP dans la configuration MRTG",
    titleFr: "Erreur d'interrogation SNMP dans la configuration MRTG",
    certification: 'lpic-2',
    topicNumber: 200,
    objectiveId: "200.2",
    category: "Capacity Planning - MRTG Trending",
    scenario: "L'administrateur LPIC-2 configure MRTG pour superviser la bande passante d'un routeur. mrtg génère une erreur SNMP 'no response received'.",
    scenarioFr: "L'administrateur LPIC-2 configure MRTG pour superviser la bande passante d'un routeur. mrtg génère une erreur SNMP 'no response received'.",
    codeSnippet: `# /etc/mrtg.cfg
Target[router_eth0]: 2:public@192.168.1.1:161::::2

# snmpwalk -v 2c -c secretCommunity 192.168.1.1
SNMPv2-MIB::sysDescr.0 = STRING: Core Router Linux`,
    language: "config",
    bugDescription: "La communauté SNMP configurée dans mrtg.cfg est 'public', alors que l'équipement écoute sur 'secretCommunity'.",
    bugDescriptionFr: "La communauté SNMP configurée dans mrtg.cfg est 'public', alors que l'équipement écoute sur 'secretCommunity'.",
    options: [
      {
        id: "opt-1",
        label: "La communauté SNMP dans mrtg.cfg doit être changée en 'secretCommunity' pour correspondre à l'agent",
        labelFr: "La communauté SNMP dans mrtg.cfg doit être changée en 'secretCommunity' pour correspondre à l'agent",
        isCorrect: true,
        explanation: "La cible MRTG a pour syntaxe Target[nom]: interface:communaute@hote:port.",
        explanationFr: "La cible MRTG a pour syntaxe Target[nom]: interface:communaute@hote:port."
      },
      {
        id: "opt-2",
        label: "Le port SNMP doit obligatoirement être changé en 162",
        labelFr: "Le port SNMP doit obligatoirement être changé en 162",
        isCorrect: false,
        explanation: "Le port 162 est dédié aux SNMP Traps, le port d'interrogation standard est 161.",
        explanationFr: "Le port 162 est dédié aux SNMP Traps, le port d'interrogation standard est 161."
      },
      {
        id: "opt-3",
        label: "MRTG ne supporte que SNMP version 1",
        labelFr: "MRTG ne supporte que SNMP version 1",
        isCorrect: false,
        explanation: "MRTG supporte parfaitement SNMPv2c et SNMPv3.",
        explanationFr: "MRTG supporte parfaitement SNMPv2c et SNMPv3."
      },
      {
        id: "opt-4",
        label: "Le nom de cible router_eth0 contient un underscore interdit",
        labelFr: "Le nom de cible router_eth0 contient un underscore interdit",
        isCorrect: false,
        explanation: "Les underscores sont autorisés dans les étiquettes MRTG.",
        explanationFr: "Les underscores sont autorisés dans les étiquettes MRTG."
      }
    ],
    correctedSnippet: `# /etc/mrtg.cfg
Target[router_eth0]: 2:secretCommunity@192.168.1.1:161::::2`,
    fixExplanation: "Renseigner la bonne communauté SNMP 'secretCommunity'.",
    fixExplanationFr: "Renseigner la bonne communauté SNMP 'secretCommunity'."
  },
  {
    id: "tb-lpic2-201-07",
    title: "Module noyau refusant de se charger (modprobe - Module not found)",
    titleFr: "Module noyau refusant de se charger (modprobe - Module not found)",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.1",
    category: "Kernel Components - Module Management",
    scenario: "Après avoir copié manuellement un pilote compilé mydriver.ko dans /lib/modules/$(uname -r)/kernel/drivers/net/, modprobe mydriver retourne 'Module mydriver not found in directory'.",
    scenarioFr: "Après avoir copié manuellement un pilote compilé mydriver.ko dans /lib/modules/$(uname -r)/kernel/drivers/net/, modprobe mydriver retourne 'Module mydriver not found in directory'.",
    codeSnippet: `# cp mydriver.ko /lib/modules/$(uname -r)/kernel/drivers/net/
# modprobe mydriver
modprobe: FATAL: Module mydriver not found in directory /lib/modules/6.1.0-21-amd64`,
    language: "bash",
    bugDescription: "La commande depmod n'a pas été exécutée après l'ajout du fichier .ko, donc modules.dep et les index binaires ne référencent pas le module.",
    bugDescriptionFr: "La commande depmod n'a pas été exécutée après l'ajout du fichier .ko, donc modules.dep et les index binaires ne référencent pas le module.",
    options: [
      {
        id: "opt-1",
        label: "Exécuter 'depmod -a' pour régénérer le fichier d'index modules.dep et la table des dépendances",
        labelFr: "Exécuter 'depmod -a' pour régénérer le fichier d'index modules.dep et la table des dépendances",
        isCorrect: true,
        explanation: "modprobe consulte les fichiers d'index générés par depmod. Sans depmod -a, les nouveaux modules sont invisibles.",
        explanationFr: "modprobe consulte les fichiers d'index générés par depmod. Sans depmod -a, les nouveaux modules sont invisibles."
      },
      {
        id: "opt-2",
        label: "Renommer mydriver.ko en mydriver.o",
        labelFr: "Renommer mydriver.ko en mydriver.o",
        isCorrect: false,
        explanation: "L'extension officielle des modules Linux 2.6+ est .ko (Kernel Object).",
        explanationFr: "L'extension officielle des modules Linux 2.6+ est .ko (Kernel Object)."
      },
      {
        id: "opt-3",
        label: "Changer le propriétaire du fichier en nobody",
        labelFr: "Changer le propriétaire du fichier en nobody",
        isCorrect: false,
        explanation: "Les modules doivent appartenir à root:root.",
        explanationFr: "Les modules doivent appartenir à root:root."
      },
      {
        id: "opt-4",
        label: "Ajouter le chemin complet du module dans /etc/ld.so.conf",
        labelFr: "Ajouter le chemin complet du module dans /etc/ld.so.conf",
        isCorrect: false,
        explanation: "ld.so.conf est réservé aux bibliothèques partagées en espace utilisateur, pas aux modules noyau.",
        explanationFr: "ld.so.conf est réservé aux bibliothèques partagées en espace utilisateur, pas aux modules noyau."
      }
    ],
    correctedSnippet: `# depmod -a
# modprobe mydriver
# lsmod | grep mydriver`,
    fixExplanation: "Exécuter depmod -a pour reconstruire la liste des dépendances de modules.",
    fixExplanationFr: "Exécuter depmod -a pour reconstruire la liste des dépendances de modules."
  },
  {
    id: "tb-lpic2-201-08",
    title: "Échec de compilation DKMS après mise à jour du noyau",
    titleFr: "Échec de compilation DKMS après mise à jour du noyau",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.1",
    category: "Kernel Components - DKMS",
    scenario: "Lors d'une mise à jour vers un nouveau noyau Linux, la construction d'un module tiers échoue avec l'erreur 'Kernel headers not found'.",
    scenarioFr: "Lors d'une mise à jour vers un nouveau noyau Linux, la construction d'un module tiers échoue avec l'erreur 'Kernel headers not found'.",
    codeSnippet: `# dkms status
wireguard/1.0.20210606: broken!
Error! Your kernel headers for kernel 6.1.0-21-amd64 cannot be found at
/lib/modules/6.1.0-21-amd64/build or /lib/modules/6.1.0-21-amd64/source.`,
    language: "bash",
    bugDescription: "Le paquet des en-têtes du noyau (linux-headers-$(uname -r)) n'est pas installé, empêchant la compilation de modules tiers hors-arborescence.",
    bugDescriptionFr: "Le paquet des en-têtes du noyau (linux-headers-$(uname -r)) n'est pas installé, empêchant la compilation de modules tiers hors-arborescence.",
    options: [
      {
        id: "opt-1",
        label: "Installer le paquet d'en-têtes noyau correspondant : linux-headers-$(uname -r)",
        labelFr: "Installer le paquet d'en-têtes noyau correspondant : linux-headers-$(uname -r)",
        isCorrect: true,
        explanation: "DKMS a impérativement besoin des fichiers d'en-tête (headers) et des Makefiles du noyau cible dans /lib/modules/<version>/build.",
        explanationFr: "DKMS a impérativement besoin des fichiers d'en-tête (headers) et des Makefiles du noyau cible dans /lib/modules/<version>/build."
      },
      {
        id: "opt-2",
        label: "Désactiver Secure Boot dans le BIOS/UEFI",
        labelFr: "Désactiver Secure Boot dans le BIOS/UEFI",
        isCorrect: false,
        explanation: "Secure Boot bloque le chargement, pas la compilation initiale des headers.",
        explanationFr: "Secure Boot bloque le chargement, pas la compilation initiale des headers."
      },
      {
        id: "opt-3",
        label: "Supprimer complètement le répertoire /lib/modules/",
        labelFr: "Supprimer complètement le répertoire /lib/modules/",
        isCorrect: false,
        explanation: "Cela détruirait tous les pilotes du système.",
        explanationFr: "Cela détruirait tous les pilotes du système."
      },
      {
        id: "opt-4",
        label: "Créer un lien symbolique vers /usr/include/stdio.h",
        labelFr: "Créer un lien symbolique vers /usr/include/stdio.h",
        isCorrect: false,
        explanation: "stdio.h est un header utilisateur libc, non utilisable dans l'espace noyau.",
        explanationFr: "stdio.h est un header utilisateur libc, non utilisable dans l'espace noyau."
      }
    ],
    correctedSnippet: `# apt-get install linux-headers-$(uname -r)
# dkms autoinstall`,
    fixExplanation: "Installer le paquet linux-headers correspondant à la version courante du noyau.",
    fixExplanationFr: "Installer le paquet linux-headers correspondant à la version courante du noyau."
  },
  {
    id: "tb-lpic2-201-09",
    title: "Kernel Panic au boot : support Initramfs non activé lors de la compilation",
    titleFr: "Kernel Panic au boot : support Initramfs non activé lors de la compilation",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.2",
    category: "Compiling a Kernel - Configuration Options",
    scenario: "L'administrateur LPIC-2 compile un noyau personnalisé. Au redémarrage, le système s'arrête avec le message : 'Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)'.",
    scenarioFr: "L'administrateur LPIC-2 compile un noyau personnalisé. Au redémarrage, le système s'arrête avec le message : 'Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)'.",
    codeSnippet: `# zcat /proc/config.gz | grep BLK_DEV_INITRD
# CONFIG_BLK_DEV_INITRD is not set

# ls -lh /boot/initrd.img-custom
-rw-r--r-- 1 root root 28M Sep 04 10:00 /boot/initrd.img-custom`,
    language: "config",
    bugDescription: "L'option CONFIG_BLK_DEV_INITRD a été désactivée dans le .config. Le noyau compilé est incapable de charger et d'exécuter l'initramfs généré.",
    bugDescriptionFr: "L'option CONFIG_BLK_DEV_INITRD a été désactivée dans le .config. Le noyau compilé est incapable de charger et d'exécuter l'initramfs généré.",
    options: [
      {
        id: "opt-1",
        label: "Activer l'option CONFIG_BLK_DEV_INITRD=y dans la configuration du noyau (.config) et recompiler",
        labelFr: "Activer l'option CONFIG_BLK_DEV_INITRD=y dans la configuration du noyau (.config) et recompiler",
        isCorrect: true,
        explanation: "Sans CONFIG_BLK_DEV_INITRD, le noyau ignore le ramdisk passé par le bootloader et ne peut pas charger les modules de stockage de la racine.",
        explanationFr: "Sans CONFIG_BLK_DEV_INITRD, le noyau ignore le ramdisk passé par le bootloader et ne peut pas charger les modules de stockage de la racine."
      },
      {
        id: "opt-2",
        label: "Supprimer le fichier initrd.img-custom du répertoire /boot",
        labelFr: "Supprimer le fichier initrd.img-custom du répertoire /boot",
        isCorrect: false,
        explanation: "Si les pilotes de disque sont compilés en modules, l'initrd est absolument requis.",
        explanationFr: "Si les pilotes de disque sont compilés en modules, l'initrd est absolument requis."
      },
      {
        id: "opt-3",
        label: "Remplacer GRUB par LILO",
        labelFr: "Remplacer GRUB par LILO",
        isCorrect: false,
        explanation: "Le chargeur de démarrage n'est pas en cause.",
        explanationFr: "Le chargeur de démarrage n'est pas en cause."
      },
      {
        id: "opt-4",
        label: "Formater la partition racine en FAT32",
        labelFr: "Formater la partition racine en FAT32",
        isCorrect: false,
        explanation: "FAT32 ne supporte pas les permissions POSIX et n'est pas un FS racine Linux valide.",
        explanationFr: "FAT32 ne supporte pas les permissions POSIX et n'est pas un FS racine Linux valide."
      }
    ],
    correctedSnippet: `# make menuconfig
# Cocher : General setup -> Initial RAM filesystem and RAM disk (initramfs/initrd) support
CONFIG_BLK_DEV_INITRD=y
# make -j$(nproc) && make modules_install && make install`,
    fixExplanation: "Activer CONFIG_BLK_DEV_INITRD=y dans le .config et recompiler le noyau.",
    fixExplanationFr: "Activer CONFIG_BLK_DEV_INITRD=y dans le .config et recompiler le noyau."
  },
  {
    id: "tb-lpic2-201-10",
    title: "Règle Udev non appliquée pour un lien symbolique de port série",
    titleFr: "Règle Udev non appliquée pour un lien symbolique de port série",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.3",
    category: "Kernel Runtime Management - Udev Rules",
    scenario: "Une règle udev est écrite pour créer un lien symbolique /dev/modem vers un convertisseur USB-série, mais le lien n'est jamais créé au branchement.",
    scenarioFr: "Une règle udev est écrite pour créer un lien symbolique /dev/modem vers un convertisseur USB-série, mais le lien n'est jamais créé au branchement.",
    codeSnippet: `# cat /etc/udev/rules.d/99-modem.rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK="modem"

# udevadm test /sys/class/tty/ttyUSB0
Invalid operator for SYMLINK key at /etc/udev/rules.d/99-modem.rules:1`,
    language: "config",
    bugDescription: "L'opérateur utilisé pour la clé d'assignation SYMLINK est '=' au lieu de '+=' selon les règles d'affectation udev valides, provoquant une erreur de syntaxe.",
    bugDescriptionFr: "L'opérateur utilisé pour la clé d'assignation SYMLINK est '=' au lieu de '+=' selon les règles d'affectation udev valides, provoquant une erreur de syntaxe.",
    options: [
      {
        id: "opt-1",
        label: "Corriger l'opérateur d'assignation de SYMLINK en utilisant '+=' puis recharger avec udevadm control --reload",
        labelFr: "Corriger l'opérateur d'assignation de SYMLINK en utilisant '+=' puis recharger avec udevadm control --reload",
        isCorrect: true,
        explanation: "Dans udev, la liste des symlinks s'incrémente avec SYMLINK+=\"nom\".",
        explanationFr: "Dans udev, la liste des symlinks s'incrémente avec SYMLINK+=\"nom\"."
      },
      {
        id: "opt-2",
        label: "Remplacer SUBSYSTEM==\"tty\" par SUBSYSTEM==\"disk\"",
        labelFr: "Remplacer SUBSYSTEM==\"tty\" par SUBSYSTEM==\"disk\"",
        isCorrect: false,
        explanation: "Un adaptateur série relève bien du sous-système tty.",
        explanationFr: "Un adaptateur série relève bien du sous-système tty."
      },
      {
        id: "opt-3",
        label: "Renommer le fichier en 99-modem.conf",
        labelFr: "Renommer le fichier en 99-modem.conf",
        isCorrect: false,
        explanation: "Les fichiers de règles udev doivent impérativement se terminer par .rules.",
        explanationFr: "Les fichiers de règles udev doivent impérativement se terminer par .rules."
      },
      {
        id: "opt-4",
        label: "Désactiver le service udevd",
        labelFr: "Désactiver le service udevd",
        isCorrect: false,
        explanation: "Udev est obligatoire pour la gestion dynamique des périphériques.",
        explanationFr: "Udev est obligatoire pour la gestion dynamique des périphériques."
      }
    ],
    correctedSnippet: `# /etc/udev/rules.d/99-modem.rules
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK+="modem"

# udevadm control --reload && udevadm trigger`,
    fixExplanation: "Utiliser SYMLINK+=\"modem\" et recharger les règles udev.",
    fixExplanationFr: "Utiliser SYMLINK+=\"modem\" et recharger les règles udev."
  },
  {
    id: "tb-lpic2-201-11",
    title: "Paramètre sysctl non appliqué au démarrage du système",
    titleFr: "Paramètre sysctl non appliqué au démarrage du système",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.3",
    category: "Kernel Runtime Management - Sysctl",
    scenario: "L'administrateur LPIC-2 a configuré le routage IP dans /etc/sysctl.conf. Pourtant, après chaque redémarrage, cat /proc/sys/net/ipv4/ip_forward vaut toujours 0.",
    scenarioFr: "L'administrateur LPIC-2 a configuré le routage IP dans /etc/sysctl.conf. Pourtant, après chaque redémarrage, cat /proc/sys/net/ipv4/ip_forward vaut toujours 0.",
    codeSnippet: `# tail -n 2 /etc/sysctl.conf
net.ipv4.ip_forward = 1

# cat /etc/sysctl.d/99-security.conf
net.ipv4.ip_forward = 0`,
    language: "config",
    bugDescription: "Un fichier situé dans /etc/sysctl.d/99-security.conf écrase le paramètre défini dans /etc/sysctl.conf en raison de l'ordre de précédence alphabétique des répertoires sysctl.d.",
    bugDescriptionFr: "Un fichier situé dans /etc/sysctl.d/99-security.conf écrase le paramètre défini dans /etc/sysctl.conf en raison de l'ordre de précédence alphabétique des répertoires sysctl.d.",
    options: [
      {
        id: "opt-1",
        label: "Le fichier 99-security.conf sous /etc/sysctl.d/ est évalué après /etc/sysctl.conf et surcharge ip_forward à 0",
        labelFr: "Le fichier 99-security.conf sous /etc/sysctl.d/ est évalué après /etc/sysctl.conf et surcharge ip_forward à 0",
        isCorrect: true,
        explanation: "Les fichiers sous /etc/sysctl.d/ sont appliqués par ordre alphabétique, et écrasent les configurations antérieures.",
        explanationFr: "Les fichiers sous /etc/sysctl.d/ sont appliqués par ordre alphabétique, et écrasent les configurations antérieures."
      },
      {
        id: "opt-2",
        label: "ip_forward ne peut pas être modifié sans recompiler le noyau",
        labelFr: "ip_forward ne peut pas être modifié sans recompiler le noyau",
        isCorrect: false,
        explanation: "C'est un paramètre dynamique standard du sous-système réseau Linux.",
        explanationFr: "C'est un paramètre dynamique standard du sous-système réseau Linux."
      },
      {
        id: "opt-3",
        label: "La syntaxe correcte exige des deux-points au lieu du signe égal",
        labelFr: "La syntaxe correcte exige des deux-points au lieu du signe égal",
        isCorrect: false,
        explanation: "Le format sysctl utilise la clé = valeur.",
        explanationFr: "Le format sysctl utilise la clé = valeur."
      },
      {
        id: "opt-4",
        label: "Le service systemd-sysctl doit être masqué avec systemctl mask",
        labelFr: "Le service systemd-sysctl doit être masqué avec systemctl mask",
        isCorrect: false,
        explanation: "C'est justement ce service qui applique les fichiers sysctl au boot.",
        explanationFr: "C'est justement ce service qui applique les fichiers sysctl au boot."
      }
    ],
    correctedSnippet: `# Modifier la ligne dans /etc/sysctl.d/99-security.conf :
net.ipv4.ip_forward = 1
# Appliquer immédiatement :
sysctl --system`,
    fixExplanation: "Harmoniser la valeur dans /etc/sysctl.d/ et recharger avec sysctl --system.",
    fixExplanationFr: "Harmoniser la valeur dans /etc/sysctl.d/ et recharger avec sysctl --system."
  },
  {
    id: "tb-lpic2-201-12",
    title: "Module blacklisté non respecté (Chargé par les dépendances)",
    titleFr: "Module blacklisté non respecté (Chargé par les dépendances)",
    certification: 'lpic-2',
    topicNumber: 201,
    objectiveId: "201.1",
    category: "Kernel Components - Module Blacklisting",
    scenario: "Pour des raisons de sécurité, l'administrateur LPIC-2 a ajouté 'blacklist firewire_core' dans modprobe.d. Pourtant, le module continue d'être chargé automatiquement.",
    scenarioFr: "Pour des raisons de sécurité, l'administrateur LPIC-2 a ajouté 'blacklist firewire_core' dans modprobe.d. Pourtant, le module continue d'être chargé automatiquement.",
    codeSnippet: `# cat /etc/modprobe.d/blacklist-firewire.conf
blacklist firewire_core

# lsmod | grep firewire_core
firewire_core         110592  1 firewire_ohci`,
    language: "config",
    bugDescription: "La directive 'blacklist' empêche le chargement direct automatique, mais pas le chargement indirect comme dépendance d'un autre module (ici firewire_ohci). Pour neutraliser totalement un module, il faut employer 'install firewire_core /bin/true'.",
    bugDescriptionFr: "La directive 'blacklist' empêche le chargement direct automatique, mais pas le chargement indirect comme dépendance d'un autre module (ici firewire_ohci). Pour neutraliser totalement un module, il faut employer 'install firewire_core /bin/true'.",
    options: [
      {
        id: "opt-1",
        label: "La directive blacklist n'empêche pas le chargement en dépendance ; il faut utiliser 'install firewire_core /bin/true' pour neutraliser totalement le chargement",
        labelFr: "La directive blacklist n'empêche pas le chargement en dépendance ; il faut utiliser 'install firewire_core /bin/true' pour neutraliser totalement le chargement",
        isCorrect: true,
        explanation: "En utilisant 'install module /bin/true', modprobe exécute /bin/true au lieu de insmod, désactivant définitivement le module même s'il est requis par un autre.",
        explanationFr: "En utilisant 'install module /bin/true', modprobe exécute /bin/true au lieu de insmod, désactivant définitivement le module même s'il est requis par un autre."
      },
      {
        id: "opt-2",
        label: "Le fichier doit s'appeler obligatoirement /etc/modules.blacklist",
        labelFr: "Le fichier doit s'appeler obligatoirement /etc/modules.blacklist",
        isCorrect: false,
        explanation: "Les fichiers de configuration se trouvent sous /etc/modprobe.d/*.conf.",
        explanationFr: "Les fichiers de configuration se trouvent sous /etc/modprobe.d/*.conf."
      },
      {
        id: "opt-3",
        label: "Il faut modifier le MBR du disque dur",
        labelFr: "Il faut modifier le MBR du disque dur",
        isCorrect: false,
        explanation: "Le MBR ne gère pas les modules du noyau Linux.",
        explanationFr: "Le MBR ne gère pas les modules du noyau Linux."
      },
      {
        id: "opt-4",
        label: "Le mot-clé dans modprobe.d doit être 'disable' et non 'blacklist'",
        labelFr: "Le mot-clé dans modprobe.d doit être 'disable' et non 'blacklist'",
        isCorrect: false,
        explanation: "'disable' n'est pas un mot-clé reconnu par modprobe.",
        explanationFr: "'disable' n'est pas un mot-clé reconnu par modprobe."
      }
    ],
    correctedSnippet: `# /etc/modprobe.d/blacklist-firewire.conf
blacklist firewire_core
install firewire_core /bin/true`,
    fixExplanation: "Associer la directive 'install module /bin/true' pour empêcher le chargement indirect par dépendance.",
    fixExplanationFr: "Associer la directive 'install module /bin/true' pour empêcher le chargement indirect par dépendance."
  },
  {
    id: "tb-lpic2-201-13",
    title: "Script d'init SysV non exécuté au démarrage en Runlevel 3",
    titleFr: "Script d'init SysV non exécuté au démarrage en Runlevel 3",
    certification: 'lpic-2',
    topicNumber: 202,
    objectiveId: "202.1",
    category: "System Startup - SysVinit",
    scenario: "Sur un système SysVinit hérité, un script d'initialisation placé dans /etc/rc3.d/ n'est jamais appelé lors du passage au niveau d'exécution 3.",
    scenarioFr: "Sur un système SysVinit hérité, un script d'initialisation placé dans /etc/rc3.d/ n'est jamais appelé lors du passage au niveau d'exécution 3.",
    codeSnippet: `# ls -l /etc/rc3.d/
lrwxrwxrwx 1 root root 20 Sep 04 11:00 s99backup -> /etc/init.d/backup
lrwxrwxrwx 1 root root 18 Sep 04 11:00 S20ssh -> /etc/init.d/ssh`,
    language: "bash",
    bugDescription: "Le lien symbolique commence par une lettre minuscule 's' (s99backup) au lieu d'une majuscule 'S' (S99backup). SysVinit ignore les fichiers ne commençant pas par 'S' ou 'K'.",
    bugDescriptionFr: "Le lien symbolique commence par une lettre minuscule 's' (s99backup) au lieu d'une majuscule 'S' (S99backup). SysVinit ignore les fichiers ne commençant pas par 'S' ou 'K'.",
    options: [
      {
        id: "opt-1",
        label: "Le nom du lien symbolique doit débuter par un 'S' majuscule (S99backup) pour être reconnu comme script de démarrage",
        labelFr: "Le nom du lien symbolique doit débuter par un 'S' majuscule (S99backup) pour être reconnu comme script de démarrage",
        isCorrect: true,
        explanation: "SysVinit exécute les scripts commençant par 'S' (Start) avec le paramètre start, et ceux commençant par 'K' (Kill) avec stop.",
        explanationFr: "SysVinit exécute les scripts commençant par 'S' (Start) avec le paramètre start, et ceux commençant par 'K' (Kill) avec stop."
      },
      {
        id: "opt-2",
        label: "Les liens dans /etc/rc3.d/ doivent être des liens physiques et non des liens symboliques",
        labelFr: "Les liens dans /etc/rc3.d/ doivent être des liens physiques et non des liens symboliques",
        isCorrect: false,
        explanation: "SysVinit repose sur des liens symboliques.",
        explanationFr: "SysVinit repose sur des liens symboliques."
      },
      {
        id: "opt-3",
        label: "Le numéro de priorité doit obligatoirement être compris entre 01 et 50",
        labelFr: "Le numéro de priorité doit obligatoirement être compris entre 01 et 50",
        isCorrect: false,
        explanation: "Les numéros vont de 00 à 99.",
        explanationFr: "Les numéros vont de 00 à 99."
      },
      {
        id: "opt-4",
        label: "Le runlevel 3 est réservé exclusivement aux interfaces graphiques X11",
        labelFr: "Le runlevel 3 est réservé exclusivement aux interfaces graphiques X11",
        isCorrect: false,
        explanation: "Le runlevel 3 est le mode multi-utilisateur texte avec réseau standard.",
        explanationFr: "Le runlevel 3 est le mode multi-utilisateur texte avec réseau standard."
      }
    ],
    correctedSnippet: `# cd /etc/rc3.d/
# mv s99backup S99backup`,
    fixExplanation: "Renommer le lien symbolique avec une lettre majuscule 'S'.",
    fixExplanationFr: "Renommer le lien symbolique avec une lettre majuscule 'S'."
  },
  {
    id: "tb-lpic2-201-14",
    title: "Échec de 'systemctl enable' : section [Install] manquante",
    titleFr: "Échec de 'systemctl enable' : section [Install] manquante",
    certification: 'lpic-2',
    topicNumber: 202,
    objectiveId: "202.2",
    category: "System Startup - Systemd Unit Files",
    scenario: "L'administrateur LPIC-2 a rédigé une unité systemd personnalisée sous /etc/systemd/system/app.service. 'systemctl start' fonctionne mais 'systemctl enable app.service' échoue.",
    scenarioFr: "L'administrateur LPIC-2 a rédigé une unité systemd personnalisée sous /etc/systemd/system/app.service. 'systemctl start' fonctionne mais 'systemctl enable app.service' échoue.",
    codeSnippet: `# cat /etc/systemd/system/app.service
[Unit]
Description=Custom Daemon
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/app

# systemctl enable app.service
The unit files have no installation config (hooked to [Install] section).
Nothing to do.`,
    language: "systemd",
    bugDescription: "L'unité ne possède pas de section [Install] définissant WantedBy=multi-user.target, empêchant systemd de créer le lien symbolique d'activation au boot.",
    bugDescriptionFr: "L'unité ne possède pas de section [Install] définissant WantedBy=multi-user.target, empêchant systemd de créer le lien symbolique d'activation au boot.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter la section [Install] avec la directive 'WantedBy=multi-user.target' pour permettre l'activation au démarrage",
        labelFr: "Ajouter la section [Install] avec la directive 'WantedBy=multi-user.target' pour permettre l'activation au démarrage",
        isCorrect: true,
        explanation: "La commande 'systemctl enable' inspecte la section [Install] pour créer le symlink dans .wants/ de la cible visée.",
        explanationFr: "La commande 'systemctl enable' inspecte la section [Install] pour créer le symlink dans .wants/ de la cible visée."
      },
      {
        id: "opt-2",
        label: "Changer Type=simple en Type=forking",
        labelFr: "Changer Type=simple en Type=forking",
        isCorrect: false,
        explanation: "Le Type ne résout pas l'absence de section [Install].",
        explanationFr: "Le Type ne résout pas l'absence de section [Install]."
      },
      {
        id: "opt-3",
        label: "Déplacer le fichier dans /usr/lib/systemd/system/",
        labelFr: "Déplacer le fichier dans /usr/lib/systemd/system/",
        isCorrect: false,
        explanation: "/etc/systemd/system/ est le bon emplacement pour les services personnalisés.",
        explanationFr: "/etc/systemd/system/ est le bon emplacement pour les services personnalisés."
      },
      {
        id: "opt-4",
        label: "Exécuter 'systemctl daemon-reexec' avant enable",
        labelFr: "Exécuter 'systemctl daemon-reexec' avant enable",
        isCorrect: false,
        explanation: "L'erreur provient du contenu de l'unité, pas de l'état du démon.",
        explanationFr: "L'erreur provient du contenu de l'unité, pas de l'état du démon."
      }
    ],
    correctedSnippet: `# /etc/systemd/system/app.service
[Unit]
Description=Custom Daemon
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/app

[Install]
WantedBy=multi-user.target`,
    fixExplanation: "Ajouter la section [Install] avec WantedBy=multi-user.target.",
    fixExplanationFr: "Ajouter la section [Install] avec WantedBy=multi-user.target."
  },
  {
    id: "tb-lpic2-201-15",
    title: "Unité systemd en boucle de crash bloquée par StartLimitBurst",
    titleFr: "Unité systemd en boucle de crash bloquée par StartLimitBurst",
    certification: 'lpic-2',
    topicNumber: 202,
    objectiveId: "202.2",
    category: "System Startup - Systemd Service Failure",
    scenario: "Un service plante en boucle. systemd finit par refuser toute tentative avec l'erreur 'start request repeated too quickly'.",
    scenarioFr: "Un service plante en boucle. systemd finit par refuser toute tentative avec l'erreur 'start request repeated too quickly'.",
    codeSnippet: `# systemctl status myapi.service
Active: failed (Result: exit-code)
myapi.service: Start request repeated too quickly.
myapi.service: Failed with result 'exit-code'.
Failed to start myapi.service - API Server.`,
    language: "systemd",
    bugDescription: "Systemd applique une protection anti-tempête (rate limiting) : si un service redémarre plus de 5 fois en 10 secondes, il est placé en état failed.",
    bugDescriptionFr: "Systemd applique une protection anti-tempête (rate limiting) : si un service redémarre plus de 5 fois en 10 secondes, il est placé en état failed.",
    options: [
      {
        id: "opt-1",
        label: "Réinitialiser le compteur d'échecs avec 'systemctl reset-failed myapi.service' après avoir corrigé la cause du crash et configuré RestartSec",
        labelFr: "Réinitialiser le compteur d'échecs avec 'systemctl reset-failed myapi.service' après avoir corrigé la cause du crash et configuré RestartSec",
        isCorrect: true,
        explanation: "systemctl reset-failed réinitialise les compteurs d'échec pour permettre à nouveau le démarrage.",
        explanationFr: "Réinitialiser les compteurs d'échec pour permettre à nouveau le démarrage."
      },
      {
        id: "opt-2",
        label: "Supprimer le binaire /usr/bin/systemctl",
        labelFr: "Supprimer le binaire /usr/bin/systemctl",
        isCorrect: false,
        explanation: "Cela casserait la gestion des services.",
        explanationFr: "Cela casserait la gestion des services."
      },
      {
        id: "opt-3",
        label: "Passer le système en runlevel 1",
        labelFr: "Passer le système en runlevel 1",
        isCorrect: false,
        explanation: "Le passage en single-user ne corrige pas la configuration de l'unité.",
        explanationFr: "Le passage en single-user ne corrige pas la configuration de l'unité."
      },
      {
        id: "opt-4",
        label: "Désactiver cgroups v2 dans le chargeur GRUB",
        labelFr: "Désactiver cgroups v2 dans le chargeur GRUB",
        isCorrect: false,
        explanation: "Le rate-limit est une règle interne de systemd.",
        explanationFr: "Le rate-limit est une règle interne de systemd."
      }
    ],
    correctedSnippet: `# Analyser la cause du plantage dans les journaux :
journalctl -u myapi.service -e
# Réinitialiser l'état du service :
systemctl reset-failed myapi.service
# Relancer :
systemctl start myapi.service`,
    fixExplanation: "Utiliser 'systemctl reset-failed' pour effacer l'état d'échec après analyse des logs.",
    fixExplanationFr: "Utiliser 'systemctl reset-failed' pour effacer l'état d'échec après analyse des logs."
  },
  {
    id: "tb-lpic2-201-16",
    title: "Erreur GRUB rescue : 'unknown filesystem' après redimensionnement de partition",
    titleFr: "Erreur GRUB rescue : 'unknown filesystem' après redimensionnement de partition",
    certification: 'lpic-2',
    topicNumber: 202,
    objectiveId: "202.3",
    category: "System Startup - GRUB Recovery",
    scenario: "Après avoir déplacé une partition, le serveur redémarre directement sur l'invite 'grub rescue>'.",
    scenarioFr: "Après avoir déplacé une partition, le serveur redémarre directement sur l'invite 'grub rescue>'.",
    codeSnippet: `error: no such partition.
Entering rescue mode...
grub rescue> set
prefix=(hd0,msdos1)/boot/grub
root=hd0,msdos1
grub rescue> ls
(hd0) (hd0,msdos2) (hd0,msdos3)`,
    language: "bash",
    bugDescription: "La partition racine/boot a changé de numéro (msdos1 n'existe plus). GRUB ne peut pas trouver ses modules dans prefix.",
    bugDescriptionFr: "La partition racine/boot a changé de numéro (msdos1 n'existe plus). GRUB ne peut pas trouver ses modules dans prefix.",
    options: [
      {
        id: "opt-1",
        label: "Redéfinir 'root' et 'prefix' vers la partition valide (ex: hd0,msdos2), charger le module normal avec 'insmod normal' puis lancer 'normal'",
        labelFr: "Redéfinir 'root' et 'prefix' vers la partition valide (ex: hd0,msdos2), charger le module normal avec 'insmod normal' puis lancer 'normal'",
        isCorrect: true,
        explanation: "La séquence de secours GRUB consiste à pointer root et prefix sur la bonne partition, charger insmod normal et démarrer.",
        explanationFr: "La séquence de secours GRUB consiste à pointer root et prefix sur la bonne partition, charger insmod normal et démarrer."
      },
      {
        id: "opt-2",
        label: "Taper 'reboot' immédiatement pour restaurer l'ancien MBR",
        labelFr: "Taper 'reboot' immédiatement pour restaurer l'ancien MBR",
        isCorrect: false,
        explanation: "Reboot répéterait simplement la même erreur.",
        explanationFr: "Reboot répéterait simplement la même erreur."
      },
      {
        id: "opt-3",
        label: "Exécuter 'format hd0' depuis grub rescue",
        labelFr: "Exécuter 'format hd0' depuis grub rescue",
        isCorrect: false,
        explanation: "La commande format n'existe pas dans grub rescue et détruirait les données.",
        explanationFr: "La commande format n'existe pas dans grub rescue et détruirait les données."
      },
      {
        id: "opt-4",
        label: "Saisir 'exit' pour lancer Windows",
        labelFr: "Saisir 'exit' pour lancer Windows",
        isCorrect: false,
        explanation: "grub rescue ne possède pas de commande exit vers un autre OS sans modules chargés.",
        explanationFr: "grub rescue ne possède pas de commande exit vers un autre OS sans modules chargés."
      }
    ],
    correctedSnippet: `grub rescue> ls (hd0,msdos2)/boot/grub
grub rescue> set root=(hd0,msdos2)
grub rescue> set prefix=(hd0,msdos2)/boot/grub
grub rescue> insmod normal
grub rescue> normal`,
    fixExplanation: "Ajuster root et prefix vers la partition valide puis exécuter insmod normal.",
    fixExplanationFr: "Ajuster root et prefix vers la partition valide puis exécuter insmod normal."
  },
  {
    id: "tb-lpic2-201-17",
    title: "Passage en mode de dépannage via l'argument GRUB systemd.unit",
    titleFr: "Passage en mode de dépannage via l'argument GRUB systemd.unit",
    certification: 'lpic-2',
    topicNumber: 202,
    objectiveId: "202.3",
    category: "System Startup - Recovery Mode",
    scenario: "Le serveur bloque au démarrage suite à un service défaillant. L'administrateur LPIC-2 doit démarrer directement en cible de secours (rescue.target).",
    scenarioFr: "Le serveur bloque au démarrage suite à un service défaillant. L'administrateur LPIC-2 doit démarrer directement en cible de secours (rescue.target).",
    codeSnippet: `# Extrait de la ligne linux dans GRUB :
linux /vmlinuz-6.1.0-21-amd64 root=/dev/mapper/vg0-root ro quiet systemd.target=rescue`,
    language: "bash",
    bugDescription: "La syntaxe correcte du paramètre de ligne de commande du noyau pour systemd est 'systemd.unit=rescue.target' (et non systemd.target=rescue).",
    bugDescriptionFr: "La syntaxe correcte du paramètre de ligne de commande du noyau pour systemd est 'systemd.unit=rescue.target' (et non systemd.target=rescue).",
    options: [
      {
        id: "opt-1",
        label: "Remplacer 'systemd.target=rescue' par 'systemd.unit=rescue.target' (ou 'single' / '1')",
        labelFr: "Remplacer 'systemd.target=rescue' par 'systemd.unit=rescue.target' (ou 'single' / '1')",
        isCorrect: true,
        explanation: "Le paramètre officiel systemd est systemd.unit=<cible>.target.",
        explanationFr: "Le paramètre officiel systemd est systemd.unit=<cible>.target."
      },
      {
        id: "opt-2",
        label: "Remplacer ro par rw-all-drives",
        labelFr: "Remplacer ro par rw-all-drives",
        isCorrect: false,
        explanation: "Ce paramètre n'existe pas dans le noyau Linux.",
        explanationFr: "Ce paramètre n'existe pas dans le noyau Linux."
      },
      {
        id: "opt-3",
        label: "Supprimer le paramètre root=/dev/mapper/vg0-root",
        labelFr: "Supprimer le paramètre root=/dev/mapper/vg0-root",
        isCorrect: false,
        explanation: "Sans périphérique root, le noyau panique immédiatement.",
        explanationFr: "Sans périphérique root, le noyau panique immédiatement."
      },
      {
        id: "opt-4",
        label: "Ajouter init=/sbin/halt",
        labelFr: "Ajouter init=/sbin/halt",
        isCorrect: false,
        explanation: "halt éteindrait le serveur immédiatement au boot.",
        explanationFr: "halt éteindrait le serveur immédiatement au boot."
      }
    ],
    correctedSnippet: `linux /vmlinuz-6.1.0-21-amd64 root=/dev/mapper/vg0-root ro systemd.unit=rescue.target`,
    fixExplanation: "Utiliser le paramètre systemd.unit=rescue.target dans la ligne de commande du noyau.",
    fixExplanationFr: "Utiliser le paramètre systemd.unit=rescue.target dans la ligne de commande du noyau."
  },
  {
    id: "tb-lpic2-201-18",
    title: "Échec de montage dans /etc/fstab bloquant le démarrage en emergency mode",
    titleFr: "Échec de montage dans /etc/fstab bloquant le démarrage en emergency mode",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.1",
    category: "Filesystem and Devices - Mount Options",
    scenario: "Un disque de données externe configuré dans /etc/fstab n'est pas branché. Systemd refuse de terminer le boot et bascule en emergency mode.",
    scenarioFr: "Un disque de données externe configuré dans /etc/fstab n'est pas branché. Systemd refuse de terminer le boot et bascule en emergency mode.",
    codeSnippet: `# /etc/fstab
UUID=e2f3a1b4-5c6d-4e8f-9a0b-1c2d3e4f5a6b /mnt/backup ext4 defaults 0 2`,
    language: "fstab",
    bugDescription: "Les montages non critiques doivent comporter l'option 'nofail' pour que systemd n'interrompe pas le démarrage si le périphérique est absent.",
    bugDescriptionFr: "Les montages non critiques doivent comporter l'option 'nofail' pour que systemd n'interrompe pas le démarrage si le périphérique est absent.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter l'option 'nofail' (ex: defaults,nofail) pour que l'absence du volume n'interrompe pas la séquence de démarrage",
        labelFr: "Ajouter l'option 'nofail' (ex: defaults,nofail) pour que l'absence du volume n'interrompe pas la séquence de démarrage",
        isCorrect: true,
        explanation: "nofail indique au générateur systemd-fstab-generator de ne pas créer de dépendance bloquante sur local-fs.target.",
        explanationFr: "nofail indique au générateur systemd-fstab-generator de ne pas créer de dépendance bloquante sur local-fs.target."
      },
      {
        id: "opt-2",
        label: "Passer le dernier chiffre (passno) de 2 à 1",
        labelFr: "Passer le dernier chiffre (passno) de 2 à 1",
        isCorrect: false,
        explanation: "1 est réservé à la racine (/), cela aggraverait le problème.",
        explanationFr: "1 est réservé à la racine (/), cela aggraverait le problème."
      },
      {
        id: "opt-3",
        label: "Remplacer ext4 par vfat",
        labelFr: "Remplacer ext4 par vfat",
        isCorrect: false,
        explanation: "Le type de système de fichiers n'empêche pas l'erreur de périphérique absent.",
        explanationFr: "Le type de système de fichiers n'empêche pas l'erreur de périphérique absent."
      },
      {
        id: "opt-4",
        label: "Supprimer complètement le fichier /etc/fstab",
        labelFr: "Supprimer complètement le fichier /etc/fstab",
        isCorrect: false,
        explanation: "Sans fstab, le système ne pourra plus monter ses partitions normales.",
        explanationFr: "Sans fstab, le système ne pourra plus monter ses partitions normales."
      }
    ],
    correctedSnippet: `# /etc/fstab
UUID=e2f3a1b4-5c6d-4e8f-9a0b-1c2d3e4f5a6b /mnt/backup ext4 defaults,nofail 0 2`,
    fixExplanation: "Ajouter l'option 'nofail' dans les options de montage sous /etc/fstab.",
    fixExplanationFr: "Ajouter l'option 'nofail' dans les options de montage sous /etc/fstab."
  },
  {
    id: "tb-lpic2-201-19",
    title: "Épuisement des inodes sur partition Ext4 (df -h OK mais ENOSPC)",
    titleFr: "Épuisement des inodes sur partition Ext4 (df -h OK mais ENOSPC)",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.2",
    category: "Filesystem Maintenance - Inode Exhaustion",
    scenario: "Une application web génère l'erreur 'No space left on device'. L'administrateur LPIC-2 vérifie avec 'df -h' et constate 45 Go libres sur la partition.",
    scenarioFr: "Une application web génère l'erreur 'No space left on device'. L'administrateur LPIC-2 vérifie avec 'df -h' et constate 45 Go libres sur la partition.",
    codeSnippet: `# df -h /var/spool
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda3        50G  4.5G   45G  10% /var/spool

# df -i /var/spool
Filesystem       Inodes   IUsed   IFree IUse% Mounted on
/dev/sda3       3276800 3276800       0  100% /var/spool`,
    language: "bash",
    bugDescription: "La table des inodes est pleine à 100% (IFree=0). Même s'il reste des blocs d'espace disque, le système de fichiers ne peut plus créer aucun nouveau fichier.",
    bugDescriptionFr: "La table des inodes est pleine à 100% (IFree=0). Même s'il reste des blocs d'espace disque, le système de fichiers ne peut plus créer aucun nouveau fichier.",
    options: [
      {
        id: "opt-1",
        label: "Saturation totale des inodes (IUse% = 100%) due à des millions de micro-fichiers ; il faut supprimer les fichiers inutiles (ex: spool de mails ou sessions)",
        labelFr: "Saturation totale des inodes (IUse% = 100%) due à des millions de micro-fichiers ; il faut supprimer les fichiers inutiles (ex: spool de mails ou sessions)",
        isCorrect: true,
        explanation: "Chaque fichier consomme un inode. Lorsque IFree atteint 0, toute création échoue avec ENOSPC.",
        explanationFr: "Chaque fichier consomme un inode. Lorsque IFree atteint 0, toute création échoue avec ENOSPC."
      },
      {
        id: "opt-2",
        label: "Le disque dur a un problème de secteurs défectueux matériels",
        labelFr: "Le disque dur a un problème de secteurs défectueux matériels",
        isCorrect: false,
        explanation: "df -i démontre clairement que le souci est logique (épuisement d'inodes).",
        explanationFr: "df -i démontre clairement que le souci est logique (épuisement d'inodes)."
      },
      {
        id: "opt-3",
        label: "Augmenter le nombre d'inodes à chaud avec tune2fs -i",
        labelFr: "Augmenter le nombre d'inodes à chaud avec tune2fs -i",
        isCorrect: false,
        explanation: "Le nombre d'inodes d'un FS ext4 est figé lors du formatage mkfs.ext4.",
        explanationFr: "Le nombre d'inodes d'un FS ext4 est figé lors du formatage mkfs.ext4."
      },
      {
        id: "opt-4",
        label: "Monter le volume avec l'option noatime pour libérer les inodes",
        labelFr: "Monter le volume avec l'option noatime pour libérer les inodes",
        isCorrect: false,
        explanation: "noatime réduit les écritures d'horodatage mais ne libère aucun inode.",
        explanationFr: "noatime réduit les écritures d'horodatage mais ne libère aucun inode."
      }
    ],
    correctedSnippet: `# Trouver les répertoires contenant trop de fichiers :
find /var/spool -xdev -type d -exec sh -c 'echo "$(ls -1 "$1" | wc -l) $1"' _ {} \\; | sort -n | tail -n 10
# Nettoyer les fichiers orphelins :
find /var/spool/clientmqueue -type f -delete`,
    fixExplanation: "Identifier et purger les millions de petits fichiers saturant les inodes.",
    fixExplanationFr: "Identifier et purger les millions de petits fichiers saturant les inodes."
  },
  {
    id: "tb-lpic2-201-20",
    title: "Refus d'exécution de xfs_repair sur système de fichiers monté",
    titleFr: "Refus d'exécution de xfs_repair sur système de fichiers monté",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.2",
    category: "Filesystem Maintenance - XFS Repair",
    scenario: "Après une coupure de courant, l'administrateur tente de réparer une partition XFS endommagée avec xfs_repair.",
    scenarioFr: "Après une coupure de courant, l'administrateur tente de réparer une partition XFS endommagée avec xfs_repair.",
    codeSnippet: `# xfs_repair /dev/sdb1
xfs_repair: /dev/sdb1 contains a mounted filesystem
FATAL ERROR: Could not repair filesystem.`,
    language: "bash",
    bugDescription: "xfs_repair refuse catégoriquement d'opérer sur un système de fichiers monté car cela entraînerait une corruption irrémédiable des structures.",
    bugDescriptionFr: "xfs_repair refuse catégoriquement d'opérer sur un système de fichiers monté car cela entraînerait une corruption irrémédiable des structures.",
    options: [
      {
        id: "opt-1",
        label: "Démonter préalablement le système de fichiers avec 'umount /dev/sdb1' avant d'exécuter xfs_repair",
        labelFr: "Démonter préalablement le système de fichiers avec 'umount /dev/sdb1' avant d'exécuter xfs_repair",
        isCorrect: true,
        explanation: "xfs_repair ne doit jamais être exécuté sur un FS monté. Si c'est la racine, démarrer sur un LiveCD ou en mode secours.",
        explanationFr: "Démonter obligatoirement le périphérique XFS avant réparation."
      },
      {
        id: "opt-2",
        label: "Ajouter l'option -f pour forcer la réparation en ligne sans démonter",
        labelFr: "Ajouter l'option -f pour forcer la réparation en ligne sans démonter",
        isCorrect: false,
        explanation: "-f permet de réparer un fichier image, pas de contourner la protection de montage.",
        explanationFr: "-f permet de réparer un fichier image, pas de contourner la protection de montage."
      },
      {
        id: "opt-3",
        label: "Utiliser e2fsck -y sur la partition XFS",
        labelFr: "Utiliser e2fsck -y sur la partition XFS",
        isCorrect: false,
        explanation: "e2fsck est dédié aux systèmes ext2/ext3/ext4, pas XFS.",
        explanationFr: "e2fsck est dédié aux systèmes ext2/ext3/ext4, pas XFS."
      },
      {
        id: "opt-4",
        label: "Changer le type de partition dans fdisk de 83 à 82",
        labelFr: "Changer le type de partition dans fdisk de 83 à 82",
        isCorrect: false,
        explanation: "82 est le type Linux Swap.",
        explanationFr: "82 est le type Linux Swap."
      }
    ],
    correctedSnippet: `# umount /dev/sdb1
# xfs_repair /dev/sdb1
# mount /dev/sdb1 /data`,
    fixExplanation: "Démonter le système de fichiers avant d'exécuter xfs_repair.",
    fixExplanationFr: "Démonter le système de fichiers avant d'exécuter xfs_repair."
  },
  {
    id: "tb-lpic2-201-21",
    title: "Erreur d'allocation de métadonnées Btrfs (No space left on device)",
    titleFr: "Erreur d'allocation de métadonnées Btrfs (No space left on device)",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.3",
    category: "Filesystem Configuration - Btrfs Maintenance",
    scenario: "Sur un volume Btrfs de 200 Go, une écriture échoue avec 'No space left on device'. Pourtant btrfs filesystem show indique 60 Go libres.",
    scenarioFr: "Sur un volume Btrfs de 200 Go, une écriture échoue avec 'No space left on device'. Pourtant btrfs filesystem show indique 60 Go libres.",
    codeSnippet: `# btrfs filesystem df /data
Data, single: total=135.00GiB, used=130.00GiB
Metadata, DUP: total=2.00GiB, used=2.00GiB
System, DUP: total=64.00MiB, used=16.00KiB
GlobalReserve, single: total=512.00MiB, used=0.00B`,
    language: "bash",
    bugDescription: "L'espace alloué aux blocs de métadonnées (Metadata) est plein à 100% (2.00GiB / 2.00GiB), empêchant toute écriture. Il faut lancer un équilibrage (btrfs balance).",
    bugDescriptionFr: "L'espace alloué aux blocs de métadonnées (Metadata) est plein à 100% (2.00GiB / 2.00GiB), empêchant toute écriture. Il faut lancer un équilibrage (btrfs balance).",
    options: [
      {
        id: "opt-1",
        label: "Les chunks de métadonnées sont saturés (Metadata used = total) ; il faut exécuter 'btrfs balance start -dusage=50 /data' pour réallouer les blocs libres",
        labelFr: "Les chunks de métadonnées sont saturés (Metadata used = total) ; il faut exécuter 'btrfs balance start -dusage=50 /data' pour réallouer les blocs libres",
        isCorrect: true,
        explanation: "Btrfs alloue l'espace brut en chunks de données ou métadonnées. L'opération balance redistribue l'espace non utilisé.",
        explanationFr: "Btrfs alloue l'espace brut en chunks de données ou métadonnées. L'opération balance redistribue l'espace non utilisé."
      },
      {
        id: "opt-2",
        label: "Convertir immédiatement le système de fichiers en NTFS",
        labelFr: "Convertir immédiatement le système de fichiers en NTFS",
        isCorrect: false,
        explanation: "Inapproprié sous Linux.",
        explanationFr: "Inapproprié sous Linux."
      },
      {
        id: "opt-3",
        label: "Désactiver le Copy-On-Write globalement avec chattr +C",
        labelFr: "Désactiver le Copy-On-Write globalement avec chattr +C",
        isCorrect: false,
        explanation: "Cela n'alloue pas de nouveaux chunks de métadonnées.",
        explanationFr: "Cela n'alloue pas de nouveaux chunks de métadonnées."
      },
      {
        id: "opt-4",
        label: "Supprimer les métadonnées avec btrfs check --repair",
        labelFr: "Supprimer les métadonnées avec btrfs check --repair",
        isCorrect: false,
        explanation: "La suppression des métadonnées détruirait le système de fichiers.",
        explanationFr: "La suppression des métadonnées détruirait le système de fichiers."
      }
    ],
    correctedSnippet: `# Rééquilibrer les chunks de données sous-utilisés :
btrfs balance start -dusage=50 /data
# Vérifier la nouvelle allocation de métadonnées :
btrfs filesystem df /data`,
    fixExplanation: "Exécuter 'btrfs balance' pour libérer des chunks et permettre l'extension des métadonnées.",
    fixExplanationFr: "Exécuter 'btrfs balance' pour libérer des chunks et permettre l'extension des métadonnées."
  },
  {
    id: "tb-lpic2-201-22",
    title: "Quotas de disque non appliqués : commande quotaon oubliée",
    titleFr: "Quotas de disque non appliqués : commande quotaon oubliée",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.3",
    category: "Filesystem Configuration - Disk Quotas",
    scenario: "L'administrateur a configuré les options usrquota dans fstab et défini des limites avec edquota, mais les utilisateurs peuvent toujours écrire sans limite.",
    scenarioFr: "L'administrateur a configuré les options usrquota dans fstab et défini des limites avec edquota, mais les utilisateurs peuvent toujours écrire sans limite.",
    codeSnippet: `# cat /etc/fstab | grep home
UUID=1234-abcd /home ext4 defaults,usrquota 0 2

# repquota /home
repquota: Cannot stat() mounted device /dev/sda4: No such file or directory
(ou Quotas are not active on this filesystem)`,
    language: "bash",
    bugDescription: "Après configuration de fstab et génération des bases aquota.user via quotacheck, les quotas doivent être explicitement mis en service avec 'quotaon'.",
    bugDescriptionFr: "Après configuration de fstab et génération des bases aquota.user via quotacheck, les quotas doivent être explicitement mis en service avec 'quotaon'.",
    options: [
      {
        id: "opt-1",
        label: "Activer la vérification des quotas sur le système de fichiers avec 'quotacheck -avugm' puis 'quotaon -avug'",
        labelFr: "Activer la vérification des quotas sur le système de fichiers avec 'quotacheck -avugm' puis 'quotaon -avug'",
        isCorrect: true,
        explanation: "Les options de montage signalent le support au noyau, mais quotaon active concrètement le blocage des dépassements.",
        explanationFr: "Activer la mise en application des quotas avec quotaon -avug."
      },
      {
        id: "opt-2",
        label: "Redémarrer le serveur 3 fois pour que fstab soit pris en compte",
        labelFr: "Redémarrer le serveur 3 fois pour que fstab soit pris en compte",
        isCorrect: false,
        explanation: "Totalement inefficace.",
        explanationFr: "Totalement inefficace."
      },
      {
        id: "opt-3",
        label: "Remplacer usrquota par forcequota dans fstab",
        labelFr: "Remplacer usrquota par forcequota dans fstab",
        isCorrect: false,
        explanation: "L'option forcequota n'existe pas.",
        explanationFr: "L'option forcequota n'existe pas."
      },
      {
        id: "opt-4",
        label: "Attribuer un UID 0 à tous les utilisateurs concernés",
        labelFr: "Attribuer un UID 0 à tous les utilisateurs concernés",
        isCorrect: false,
        explanation: "L'UID 0 est root et contourne tous les quotas.",
        explanationFr: "L'UID 0 est root et contourne tous les quotas."
      }
    ],
    correctedSnippet: `# quotacheck -cum /home
# quotaon -v /home
# repquota /home`,
    fixExplanation: "Exécuter quotacheck puis quotaon sur le point de montage.",
    fixExplanationFr: "Exécuter quotacheck puis quotaon sur le point de montage."
  },
  {
    id: "tb-lpic2-201-23",
    title: "Avertissement critique S.M.A.R.T. : Reallocated Sector Count",
    titleFr: "Avertissement critique S.M.A.R.T. : Reallocated Sector Count",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.3",
    category: "Filesystem Maintenance - S.M.A.R.T. Monitoring",
    scenario: "smartctl -H affiche 'PASSED', mais le disque ralentit anormalement. L'administrateur LPIC-2 vérifie les attributs détaillés avec smartctl -A /dev/sda.",
    scenarioFr: "smartctl -H affiche 'PASSED', mais le disque ralentit anormalement. L'administrateur LPIC-2 vérifie les attributs détaillés avec smartctl -A /dev/sda.",
    codeSnippet: `# smartctl -A /dev/sda
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      RAW_VALUE
  5 Reallocated_Sector_Ct   0x0033   080   080   036    Pre-fail  1420
197 Current_Pending_Sector  0x0012   095   095   000    Old_age   85`,
    language: "bash",
    bugDescription: "Le disque a déjà réalloué 1420 secteurs défectueux et 85 autres sont en attente de réallocation (RAW_VALUE), annonçant une défaillance matérielle imminente.",
    bugDescriptionFr: "Le disque a déjà réalloué 1420 secteurs défectueux et 85 autres sont en attente de réallocation (RAW_VALUE), annonçant une défaillance matérielle imminente.",
    options: [
      {
        id: "opt-1",
        label: "Dégradation matérielle critique du disque : la présence de secteurs réalloués et en attente indique une panne mécanique imminente ; le disque doit être remplacé",
        labelFr: "Dégradation matérielle critique du disque : la présence de secteurs réalloués et en attente indique une panne mécanique imminente ; le disque doit être remplacé",
        isCorrect: true,
        explanation: "Des valeurs brutes élevées sur les attributs 5 et 197 démontrent que les têtes de lecture et la surface magnétique se détériorent.",
        explanationFr: "Remplacer sans délai le disque défectueux."
      },
      {
        id: "opt-2",
        label: "Tout va bien car le champ VALUE (080) est supérieur au seuil THRESH (036)",
        labelFr: "Tout va bien car le champ VALUE (080) est supérieur au seuil THRESH (036)",
        isCorrect: false,
        explanation: "Le statut global SMART n'alerte que lorsque le seuil est franchi, mais 1420 secteurs réalloués prouvent un dommage physique réel.",
        explanationFr: "1420 secteurs réalloués prouvent un dommage physique réel."
      },
      {
        id: "opt-3",
        label: "Exécuter 'tune2fs -j' pour réparer les secteurs défectueux",
        labelFr: "Exécuter 'tune2fs -j' pour réparer les secteurs défectueux",
        isCorrect: false,
        explanation: "tune2fs modifie le système de fichiers, pas les défauts physiques du média.",
        explanationFr: "tune2fs modifie le système de fichiers, pas les défauts physiques du média."
      },
      {
        id: "opt-4",
        label: "La température du disque est trop basse",
        labelFr: "La température du disque est trop basse",
        isCorrect: false,
        explanation: "Les attributs 5 et 197 concernent les secteurs défectueux, pas la température.",
        explanationFr: "Les attributs 5 et 197 concernent les secteurs défectueux, pas la température."
      }
    ],
    correctedSnippet: `# Lancer un test autonome complet :
smartctl -t long /dev/sda
# Préparer la sauvegarde et le remplacement immédiat du disque :
ddrescue /dev/sda /dev/sdb /root/rescue.log`,
    fixExplanation: "Sauvegarder immédiatement les données et remplacer le disque physique défaillant.",
    fixExplanationFr: "Sauvegarder immédiatement les données et remplacer le disque physique défaillant."
  },
  {
    id: "tb-lpic2-201-24",
    title: "UUID incorrect dans fstab après clonage de partition",
    titleFr: "UUID incorrect dans fstab après clonage de partition",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.1",
    category: "Filesystem and Devices - UUID Identification",
    scenario: "Après restauration d'une image disque sur un nouveau SSD, le système ne trouve pas sa partition /data et bloque au boot.",
    scenarioFr: "Après restauration d'une image disque sur un nouveau SSD, le système ne trouve pas sa partition /data et bloque au boot.",
    codeSnippet: `# blkid /dev/nvme0n1p3
/dev/nvme0n1p3: UUID="9a8b7c6d-5e4f-3a2b-1c0d-e4f5a6b7c8d9" TYPE="ext4"

# cat /etc/fstab | grep data
UUID=11112222-3333-4444-5555-666677778888 /data ext4 defaults 0 2`,
    language: "fstab",
    bugDescription: "L'UUID configuré dans /etc/fstab ne correspond pas à l'UUID réel retourné par blkid suite au reformatage de la nouvelle partition.",
    bugDescriptionFr: "L'UUID configuré dans /etc/fstab ne correspond pas à l'UUID réel retourné par blkid suite au reformatage de la nouvelle partition.",
    options: [
      {
        id: "opt-1",
        label: "Mettre à jour l'UUID dans /etc/fstab avec la valeur réelle retournée par blkid (ou réassigner l'ancien UUID avec tune2fs -U)",
        labelFr: "Mettre à jour l'UUID dans /etc/fstab avec la valeur réelle retournée par blkid (ou réassigner l'ancien UUID avec tune2fs -U)",
        isCorrect: true,
        explanation: "Si l'UUID dans fstab ne correspond pas au système de fichiers, le montage échoue.",
        explanationFr: "Corriger l'UUID dans fstab ou via tune2fs -U."
      },
      {
        id: "opt-2",
        label: "Supprimer le pilote NVMe du noyau",
        labelFr: "Supprimer le pilote NVMe du noyau",
        isCorrect: false,
        explanation: "Le SSD deviendrait totalement inaccessible.",
        explanationFr: "Le SSD deviendrait totalement inaccessible."
      },
      {
        id: "opt-3",
        label: "Changer le point de montage de /data vers /tmp",
        labelFr: "Changer le point de montage de /data vers /tmp",
        isCorrect: false,
        explanation: "Cela ne corrige pas la non-correspondance de l'identifiant.",
        explanationFr: "Cela ne corrige pas la non-correspondance de l'identifiant."
      },
      {
        id: "opt-4",
        label: "Créer un lien symbolique de /dev/nvme0n1p3 vers /dev/sda",
        labelFr: "Créer un lien symbolique de /dev/nvme0n1p3 vers /dev/sda",
        isCorrect: false,
        explanation: "Inapproprié pour un montage par UUID.",
        explanationFr: "Inapproprié pour un montage par UUID."
      }
    ],
    correctedSnippet: `# Mettre à jour /etc/fstab avec le bon UUID :
UUID=9a8b7c6d-5e4f-3a2b-1c0d-e4f5a6b7c8d9 /data ext4 defaults 0 2
# Ou restaurer l'ancien UUID sur la partition :
tune2fs -U 11112222-3333-4444-5555-666677778888 /dev/nvme0n1p3`,
    fixExplanation: "Synchroniser l'UUID de /etc/fstab avec celui du système de fichiers.",
    fixExplanationFr: "Synchroniser l'UUID de /etc/fstab avec celui du système de fichiers."
  },
  {
    id: "tb-lpic2-201-25",
    title: "Corruption de Superblock Ext4 et restauration via Superblock de secours",
    titleFr: "Corruption de Superblock Ext4 et restauration via Superblock de secours",
    certification: 'lpic-2',
    topicNumber: 203,
    objectiveId: "203.2",
    category: "Filesystem Maintenance - Ext4 Superblock Recovery",
    scenario: "Une partition ext4 refuse de monter avec l'erreur 'wrong fs type, bad option, bad superblock on /dev/sdb1'.",
    scenarioFr: "Une partition ext4 refuse de monter avec l'erreur 'wrong fs type, bad option, bad superblock on /dev/sdb1'.",
    codeSnippet: `# mount /dev/sdb1 /mnt
mount: /mnt: wrong fs type, bad option, bad superblock on /dev/sdb1, missing codepage or helper program, or other error.

# mke2fs -n /dev/sdb1 | grep "Superblock backups" -A 1
Superblock backups stored on blocks:
	32768, 98304, 163840, 229376, 294912, 819200, 884736`,
    language: "bash",
    bugDescription: "Le superblock primaire à l'offset 0 est endommagé. Il faut exécuter e2fsck en spécifiant un superblock de secours (backup superblock) avec l'option -b.",
    bugDescriptionFr: "Le superblock primaire à l'offset 0 est endommagé. Il faut exécuter e2fsck en spécifiant un superblock de secours (backup superblock) avec l'option -b.",
    options: [
      {
        id: "opt-1",
        label: "Exécuter 'e2fsck -b 32768 /dev/sdb1' pour réparer le système de fichiers à l'aide d'une copie de sauvegarde du superblock",
        labelFr: "Exécuter 'e2fsck -b 32768 /dev/sdb1' pour réparer le système de fichiers à l'aide d'une copie de sauvegarde du superblock",
        isCorrect: true,
        explanation: "L'option -b de e2fsck permet d'utiliser un bloc de sauvegarde alternatif de superblock pour restaurer la structure primaire.",
        explanationFr: "Restaurer le superblock primaire depuis une sauvegarde avec e2fsck -b."
      },
      {
        id: "opt-2",
        label: "Exécuter 'mkfs.ext4 /dev/sdb1' pour réinitialiser le disque",
        labelFr: "Exécuter 'mkfs.ext4 /dev/sdb1' pour réinitialiser le disque",
        isCorrect: false,
        explanation: "mkfs reformaterait et écraserait les données.",
        explanationFr: "mkfs reformaterait et écraserait les données."
      },
      {
        id: "opt-3",
        label: "Monter la partition avec 'mount -t ntfs /dev/sdb1 /mnt'",
        labelFr: "Monter la partition avec 'mount -t ntfs /dev/sdb1 /mnt'",
        isCorrect: false,
        explanation: "C'est une partition ext4.",
        explanationFr: "C'est une partition ext4."
      },
      {
        id: "opt-4",
        label: "Supprimer le fichier /dev/sdb1",
        labelFr: "Supprimer le fichier /dev/sdb1",
        isCorrect: false,
        explanation: "Supprimer le node de périphérique détruirait l'accès matériel.",
        explanationFr: "Supprimer le node de périphérique détruirait l'accès matériel."
      }
    ],
    correctedSnippet: `# Vérifier et réparer via le superblock alternatif 32768 :
e2fsck -b 32768 -y /dev/sdb1
# Remonter la partition :
mount /dev/sdb1 /mnt`,
    fixExplanation: "Utiliser un superblock alternatif avec 'e2fsck -b <num_bloc>' pour réparer la partition.",
    fixExplanationFr: "Utiliser un superblock alternatif avec 'e2fsck -b <num_bloc>' pour réparer la partition."
  }
];
