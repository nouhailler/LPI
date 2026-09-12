import { TroubleshootingChallenge } from '../types';

export const lpic1Troubleshoot101_1: TroubleshootingChallenge[] = [
  // ==========================================
  // TOPIC 101: SYSTEM ARCHITECTURE (101.1 - 101.3) [12 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-101-01',
    title: 'Démarrage secours init=/bin/bash bloqué en lecture seule',
    titleFr: 'Démarrage secours init=/bin/bash : mot de passe impossible à changer en lecture seule',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'Après avoir perdu le mot de passe root, un administrateur démarre avec "init=/bin/bash" sous GRUB. Lorsqu\'il exécute "passwd root", le système renvoie : "Authentication token manipulation error".',
    scenarioFr: 'Après avoir perdu le mot de passe root, un administrateur démarre avec "init=/bin/bash" sous GRUB. Lorsqu\'il exécute "passwd root", le système renvoie : "Authentication token manipulation error".',
    codeSnippet: `GRUB kernel parameters:
linux /vmlinuz-6.1.0-21-amd64 root=UUID=7a3b4c-01 ro quiet init=/bin/bash

# En console root bash :
bash-5.2# passwd root
Enter new UNIX password:
Retype new UNIX password:
passwd: Authentication token manipulation error`,
    language: 'bash',
    bugDescription: 'La racine est montée en lecture seule (ro) par défaut en mode init=/bin/bash, empêchant toute écriture dans /etc/shadow.',
    bugDescriptionFr: 'La racine est montée en lecture seule (ro) par défaut en mode init=/bin/bash, empêchant toute écriture dans /etc/shadow.',
    options: [
      {
        id: 'opt-1',
        label: 'La racine / est montée en lecture seule (ro) ; il faut la remonter en lecture-écriture avec "mount -o remount,rw /"',
        labelFr: 'La racine / est montée en lecture seule (ro) ; il faut la remonter en lecture-écriture avec "mount -o remount,rw /"',
        isCorrect: true,
        explanation: 'En mode secours init=/bin/bash, le noyau monte / en lecture seule (ro). La commande "passwd" échoue car /etc/shadow ne peut être modifié.',
        explanationFr: 'En mode secours init=/bin/bash, le noyau monte / en lecture seule (ro). La commande "passwd" échoue car /etc/shadow ne peut être modifié.'
      },
      {
        id: 'opt-2',
        label: 'Le mot de passe root ne peut être changé que via la commande "chpasswd" en mode mono-utilisateur',
        labelFr: 'Le mot de passe root ne peut être changé que via la commande "chpasswd" en mode mono-utilisateur',
        isCorrect: false,
        explanation: 'passwd fonctionne parfaitement une fois le système de fichiers remonté en écriture.',
        explanationFr: 'passwd fonctionne parfaitement une fois le système de fichiers remonté en écriture.'
      },
      {
        id: 'opt-3',
        label: 'Il faut lancer le démon systemd avant de pouvoir changer un mot de passe',
        labelFr: 'Il faut lancer le démon systemd avant de pouvoir changer un mot de passe',
        isCorrect: false,
        explanation: 'passwd modifie directement les fichiers locaux (/etc/shadow) et ne requiert pas systemd.',
        explanationFr: 'passwd modifie directement les fichiers locaux (/etc/shadow) et ne requiert pas systemd.'
      },
      {
        id: 'opt-4',
        label: 'Le binaire /usr/bin/passwd est corrompu et doit être réinstallé depuis l\'ISO',
        labelFr: 'Le binaire /usr/bin/passwd est corrompu et doit être réinstallé depuis l\'ISO',
        isCorrect: false,
        explanation: 'Le code d\'erreur est typique d\'un système de fichiers monté en lecture seule.',
        explanationFr: 'Le code d\'erreur est typique d\'un système de fichiers monté en lecture seule.'
      }
    ],
    correctedSnippet: `bash-5.2# mount -o remount,rw /
bash-5.2# passwd root
New password: ***
passwd: password updated successfully`,
    fixExplanation: 'Remonter la racine avec "mount -o remount,rw /" rend /etc/shadow accessible en écriture et permet la mise à jour du mot de passe.',
    fixExplanationFr: 'Remonter la racine avec "mount -o remount,rw /" rend /etc/shadow accessible en écriture et permet la mise à jour du mot de passe.'
  },
  {
    id: 'tb-lpic1-101-02',
    title: 'Module Wi-Fi neutralisé par /etc/modprobe.d',
    titleFr: 'Module noyau Wi-Fi neutralisé silencieusement par "install /bin/true"',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'Une carte réseau sans fil Intel utilisant "iwlwifi" ne fonctionne plus. La commande "modprobe iwlwifi" s\'exécute sans erreur mais "lsmod | grep iwlwifi" reste totalement vide.',
    scenarioFr: 'Une carte réseau sans fil Intel utilisant "iwlwifi" ne fonctionne plus. La commande "modprobe iwlwifi" s\'exécute sans erreur mais "lsmod | grep iwlwifi" reste totalement vide.',
    codeSnippet: `# /etc/modprobe.d/custom.conf
install iwlwifi /bin/true`,
    language: 'config',
    bugDescription: 'La directive "install iwlwifi /bin/true" intercepte modprobe et exécute /bin/true (succès sans insérer le module).',
    bugDescriptionFr: 'La directive "install iwlwifi /bin/true" intercepte modprobe et exécute /bin/true (succès sans insérer le module).',
    options: [
      {
        id: 'opt-1',
        label: 'La directive "install iwlwifi /bin/true" court-circuite le chargement du pilote en simulant un faux succès',
        labelFr: 'La directive "install iwlwifi /bin/true" court-circuite le chargement du pilote en simulant un faux succès',
        isCorrect: true,
        explanation: 'La commande "install <mod> <cmd>" remplace l\'insertion normale du fichier .ko par la commande spécifiée. Avec /bin/true, le module n\'est jamais chargé.',
        explanationFr: 'La commande "install <mod> <cmd>" remplace l\'insertion normale du fichier .ko par la commande spécifiée. Avec /bin/true, le module n\'est jamais chargé.'
      },
      {
        id: 'opt-2',
        label: 'Le fichier doit avoir l\'extension .module au lieu de .conf',
        labelFr: 'Le fichier doit avoir l\'extension .module au lieu de .conf',
        isCorrect: false,
        explanation: 'Tous les fichiers de modprobe.d doivent obligatoirement se terminer par .conf.',
        explanationFr: 'Tous les fichiers de modprobe.d doivent obligatoirement se terminer par .conf.'
      },
      {
        id: 'opt-3',
        label: 'Le mot-clé install est déprécié et remplacé par insmod',
        labelFr: 'Le mot-clé install est déprécié et remplacé par insmod',
        isCorrect: false,
        explanation: 'install est une directive officielle et valide de modprobe.conf.',
        explanationFr: 'install est une directive officielle et valide de modprobe.conf.'
      },
      {
        id: 'opt-4',
        label: 'Il faut désactiver Secure Boot pour autoriser iwlwifi',
        labelFr: 'Il faut désactiver Secure Boot pour autoriser iwlwifi',
        isCorrect: false,
        explanation: 'L\'absence du module dans lsmod est due à la directive modprobe.d.',
        explanationFr: 'L\'absence du module dans lsmod est due à la directive modprobe.d.'
      }
    ],
    correctedSnippet: `# Supprimer ou commenter la directive :
# install iwlwifi /bin/true
# Puis charger le module :
modprobe iwlwifi`,
    fixExplanation: 'Commenter cette directive permet à modprobe d\'insérer le vrai fichier binaire du pilote.',
    fixExplanationFr: 'Commenter cette directive permet à modprobe d\'insérer le vrai fichier binaire du pilote.'
  },
  {
    id: 'tb-lpic1-101-03',
    title: 'Déchargement de module impossible avec rmmod car utilisé par un sous-module',
    titleFr: 'Erreur rmmod : Module is in use by another module',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'L\'administrateur veut décharger le pilote audio "snd_pcm" mais rmmod échoue avec "ERROR: Module snd_pcm is in use by: snd_hda_intel".',
    scenarioFr: 'L\'administrateur veut décharger le pilote audio "snd_pcm" mais rmmod échoue avec "ERROR: Module snd_pcm is in use by: snd_hda_intel".',
    codeSnippet: `# rmmod snd_pcm
ERROR: Module snd_pcm is in use by: snd_hda_intel`,
    language: 'bash',
    bugDescription: 'snd_hda_intel dépend de snd_pcm ; rmmod ne résout pas automatiquement les dépendances.',
    bugDescriptionFr: 'snd_hda_intel dépend de snd_pcm ; rmmod ne résout pas automatiquement les dépendances.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut utiliser "modprobe -r snd_hda_intel" pour décharger récursivement le module parent et ses dépendances',
        labelFr: 'Il faut utiliser "modprobe -r snd_hda_intel" pour décharger récursivement le module parent et ses dépendances',
        isCorrect: true,
        explanation: 'Contrairement à rmmod qui ne décharge qu\'un module isolé, modprobe -r prend en charge la chaîne de dépendances.',
        explanationFr: 'Contrairement à rmmod qui ne décharge qu\'un module isolé, modprobe -r prend en charge la chaîne de dépendances.'
      },
      {
        id: 'opt-2',
        label: 'Il faut forcer avec rmmod -f snd_pcm',
        labelFr: 'Il faut forcer avec rmmod -f snd_pcm',
        isCorrect: false,
        explanation: 'rmmod -f nécessite un noyau compilé avec CONFIG_MODULE_FORCE_UNLOAD et risque de provoquer un kernel panic.',
        explanationFr: 'rmmod -f nécessite un noyau compilé avec CONFIG_MODULE_FORCE_UNLOAD et risque de provoquer un kernel panic.'
      },
      {
        id: 'opt-3',
        label: 'Le module fait partie intégrante du noyau (built-in) et ne peut pas être déchargé',
        labelFr: 'Le module fait partie intégrante du noyau (built-in) et ne peut pas être déchargé',
        isCorrect: false,
        explanation: 'S\'il était built-in, il ne figurerait pas dans /proc/modules.',
        explanationFr: 'S\'il était built-in, il ne figurerait pas dans /proc/modules.'
      },
      {
        id: 'opt-4',
        label: 'Il faut tuer udevd pour libérer les modules',
        labelFr: 'Il faut tuer udevd pour libérer les modules',
        isCorrect: false,
        explanation: 'udevd n\'a pas de descripteur ouvert sur le module audio.',
        explanationFr: 'udevd n\'a pas de descripteur ouvert sur le module audio.'
      }
    ],
    correctedSnippet: `modprobe -r snd_hda_intel snd_pcm`,
    fixExplanation: 'Utiliser modprobe -r avec le module utilisateur décharge proprement l\'ensemble de la pile audio.',
    fixExplanationFr: 'Utiliser modprobe -r avec le module utilisateur décharge proprement l\'ensemble de la pile audio.'
  },
  {
    id: 'tb-lpic1-101-04',
    title: 'Options du noyau écrasées après mise à jour dans grub.cfg',
    titleFr: 'Options du noyau écrasées après mise à jour car configurées dans /boot/grub/grub.cfg',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.2',
    category: 'System Architecture',
    scenario: 'Un technicien ajoute l\'option "nomodeset" directement dans /boot/grub/grub.cfg. Après mise à jour du noyau, l\'option a disparu.',
    scenarioFr: 'Un technicien ajoute l\'option "nomodeset" directement dans /boot/grub/grub.cfg. Après mise à jour du noyau, l\'option a disparu.',
    codeSnippet: `### /boot/grub/grub.cfg ###
# DO NOT EDIT THIS FILE
# It is automatically generated by grub-mkconfig using templates
# from /etc/grub.d and settings from /etc/default/grub`,
    language: 'config',
    bugDescription: '/boot/grub/grub.cfg est écrasé à chaque mise à jour de noyau par grub-mkconfig ; les paramètres doivent être définis dans /etc/default/grub.',
    bugDescriptionFr: '/boot/grub/grub.cfg est écrasé à chaque mise à jour de noyau par grub-mkconfig ; les paramètres doivent être définis dans /etc/default/grub.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut modifier GRUB_CMDLINE_LINUX dans /etc/default/grub puis exécuter "update-grub"',
        labelFr: 'Il faut modifier GRUB_CMDLINE_LINUX dans /etc/default/grub puis exécuter "update-grub"',
        isCorrect: true,
        explanation: 'La configuration pérenne des options du chargeur GRUB2 s\'effectue dans /etc/default/grub, puis est compilée avec update-grub (ou grub-mkconfig).',
        explanationFr: 'La configuration pérenne des options du chargeur GRUB2 s\'effectue dans /etc/default/grub, puis est compilée avec update-grub (ou grub-mkconfig).'
      },
      {
        id: 'opt-2',
        label: 'Il faut marquer grub.cfg en lecture seule avec chmod 444',
        labelFr: 'Il faut marquer grub.cfg en lecture seule avec chmod 444',
        isCorrect: false,
        explanation: 'grub-mkconfig exécuté en root écrasera quand même le fichier ou générera une erreur fatale d\'installation.',
        explanationFr: 'grub-mkconfig exécuté en root écrasera quand même le fichier ou générera une erreur fatale d\'installation.'
      },
      {
        id: 'opt-3',
        label: 'Il faut créer un fichier /etc/grub.conf',
        labelFr: 'Il faut créer un fichier /etc/grub.conf',
        isCorrect: false,
        explanation: '/etc/grub.conf appartenait à GRUB Legacy (version 0.97), obsolète.',
        explanationFr: '/etc/grub.conf appartenait à GRUB Legacy (version 0.97), obsolète.'
      },
      {
        id: 'opt-4',
        label: 'Les options de boot doivent être enregistrées dans /proc/cmdline',
        labelFr: 'Les options de boot doivent être enregistrées dans /proc/cmdline',
        isCorrect: false,
        explanation: '/proc/cmdline est généré en mémoire RAM au démarrage.',
        explanationFr: '/proc/cmdline est généré en mémoire RAM au démarrage.'
      }
    ],
    correctedSnippet: `# Dans /etc/default/grub :
GRUB_CMDLINE_LINUX="nomodeset"

# Puis régénérer :
update-grub`,
    fixExplanation: 'Éditer /etc/default/grub assure la persistance des options à travers toutes les mises à jour de paquets du noyau.',
    fixExplanationFr: 'Éditer /etc/default/grub assure la persistance des options à travers toutes les mises à jour de paquets du noyau.'
  },
  {
    id: 'tb-lpic1-101-05',
    title: 'Lien symbolique default.target pointant vers emergency.target',
    titleFr: 'Cible Systemd par défaut pointant sur emergency.target',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.3',
    category: 'System Architecture',
    scenario: 'Un serveur redémarre systématiquement en mode secours emergency.target au lieu d\'arriver au prompt de connexion standard.',
    scenarioFr: 'Un serveur redémarre systématiquement en mode secours emergency.target au lieu d\'arriver au prompt de connexion standard.',
    codeSnippet: `root@srv:~# ls -l /etc/systemd/system/default.target
lrwxrwxrwx 1 root root 41 Jan 12 10:00 /etc/systemd/system/default.target -> /lib/systemd/system/emergency.target`,
    language: 'systemd',
    bugDescription: 'default.target pointe sur emergency.target au lieu de multi-user.target.',
    bugDescriptionFr: 'default.target pointe sur emergency.target au lieu de multi-user.target.',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter "systemctl set-default multi-user.target" pour rétablir le démarrage serveur standard',
        labelFr: 'Exécuter "systemctl set-default multi-user.target" pour rétablir le démarrage serveur standard',
        isCorrect: true,
        explanation: '"systemctl set-default" recrée proprement le lien symbolique vers la cible par défaut voulue.',
        explanationFr: '"systemctl set-default" recrée proprement le lien symbolique vers la cible par défaut voulue.'
      },
      {
        id: 'opt-2',
        label: 'Modifier /etc/inittab et passer le runlevel à 3',
        labelFr: 'Modifier /etc/inittab et passer le runlevel à 3',
        isCorrect: false,
        explanation: 'Systemd n\'utilise plus /etc/inittab.',
        explanationFr: 'Systemd n\'utilise plus /etc/inittab.'
      },
      {
        id: 'opt-3',
        label: 'Supprimer /lib/systemd/system/emergency.target',
        labelFr: 'Supprimer /lib/systemd/system/emergency.target',
        isCorrect: false,
        explanation: 'Supprimer des unités du système endommage les outils de dépannage.',
        explanationFr: 'Supprimer des unités du système endommage les outils de dépannage.'
      },
      {
        id: 'opt-4',
        label: 'Exécuter reboot -f pour forcer le bon runlevel',
        labelFr: 'Exécuter reboot -f pour forcer le bon runlevel',
        isCorrect: false,
        explanation: 'Le redémarrage relira default.target et reviendra en emergency mode.',
        explanationFr: 'Le redémarrage relira default.target et reviendra en emergency mode.'
      }
    ],
    correctedSnippet: `systemctl set-default multi-user.target`,
    fixExplanation: 'La commande "systemctl set-default multi-user.target" configure le démarrage standard.',
    fixExplanationFr: 'La commande "systemctl set-default multi-user.target" configure le démarrage standard.'
  },
  {
    id: 'tb-lpic1-101-06',
    title: 'Arrêt planifié par erreur avec shutdown et annulation avec -c',
    titleFr: 'Arrêt différé dans 15 minutes avec shutdown au lieu de 15 secondes',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.3',
    category: 'System Architecture',
    scenario: 'Un administrateur croyait éteindre la machine dans 15 secondes en tapant "shutdown 15". Le broadcast avertit que l\'arrêt aura lieu dans 15 minutes.',
    scenarioFr: 'Un administrateur croyait éteindre la machine dans 15 secondes en tapant "shutdown 15". Le broadcast avertit que l\'arrêt aura lieu dans 15 minutes.',
    codeSnippet: `Broadcast message from root@srv (pts/0):
The system is going down for power-off in 15 minutes!`,
    language: 'bash',
    bugDescription: 'L\'argument de temps de shutdown est en minutes. Pour annuler, il faut utiliser "shutdown -c".',
    bugDescriptionFr: 'L\'argument de temps de shutdown est en minutes. Pour annuler, il faut utiliser "shutdown -c".',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter immédiatement "shutdown -c" pour annuler le compte à rebours d\'extinction',
        labelFr: 'Exécuter immédiatement "shutdown -c" pour annuler le compte à rebours d\'extinction',
        isCorrect: true,
        explanation: 'L\'option "-c" (cancel) annule une procédure shutdown en cours.',
        explanationFr: 'L\'option "-c" (cancel) annule une procédure shutdown en cours.'
      },
      {
        id: 'opt-2',
        label: 'Tuer le processus PID 1 avec kill -9 1',
        labelFr: 'Tuer le processus PID 1 avec kill -9 1',
        isCorrect: false,
        explanation: 'Le noyau interdit de tuer le PID 1.',
        explanationFr: 'Le noyau interdit de tuer le PID 1.'
      },
      {
        id: 'opt-3',
        label: 'Taper shutdown -r now',
        labelFr: 'Taper shutdown -r now',
        isCorrect: false,
        explanation: 'Cela redémarrerait le serveur immédiatement au lieu d\'annuler.',
        explanationFr: 'Cela redémarrerait le serveur immédiatement au lieu d\'annuler.'
      },
      {
        id: 'opt-4',
        label: 'Supprimer /var/run/shutdown.pid',
        labelFr: 'Supprimer /var/run/shutdown.pid',
        isCorrect: false,
        explanation: 'La commande documentée est "shutdown -c".',
        explanationFr: 'La commande documentée est "shutdown -c".'
      }
    ],
    correctedSnippet: `shutdown -c`,
    fixExplanation: '"shutdown -c" annule l\'arrêt et prévient les utilisateurs connectés.',
    fixExplanationFr: '"shutdown -c" annule l\'arrêt et prévient les utilisateurs connectés.'
  },
  {
    id: 'tb-lpic1-101-07',
    title: 'Diagnostic matériel PCI : inspection des IRQ et pilotes avec lspci',
    titleFr: 'Options lspci pour afficher le pilote noyau (Kernel driver in use)',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'Un contrôleur RAID SAS est branché sur le bus PCI. L\'administrateur tape "lspci" et voit la ligne matérielle, mais veut connaître le pilote noyau actuellement en service (Kernel driver in use).',
    scenarioFr: 'Un contrôleur RAID SAS est branché sur le bus PCI. L\'administrateur tape "lspci" et voit la ligne matérielle, mais veut connaître le pilote noyau actuellement en service (Kernel driver in use).',
    codeSnippet: `root@srv:~# lspci
03:00.0 Serial Attached SCSI controller: Broadcom / LSI SAS2008 PCI-Express Fusion-MPT SAS-2 [Falcon] (rev 03)`,
    language: 'bash',
    bugDescription: 'lspci sans argument n\'affiche pas le pilote associé. Il faut l\'option "-k" (ou -v / -vv).',
    bugDescriptionFr: 'lspci sans argument n\'affiche pas le pilote associé. Il faut l\'option "-k" (ou -v / -vv).',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter l\'option "-k" (lspci -k ou lspci -v) pour afficher les pilotes noyau et modules associés',
        labelFr: 'Ajouter l\'option "-k" (lspci -k ou lspci -v) pour afficher les pilotes noyau et modules associés',
        isCorrect: true,
        explanation: 'L\'option "-k" affiche les lignes "Kernel driver in use:" et "Kernel modules:".',
        explanationFr: 'L\'option "-k" affiche les lignes "Kernel driver in use:" et "Kernel modules:".'
      },
      {
        id: 'opt-2',
        label: 'Utiliser "dmesg --pci-driver" obligatoirement',
        labelFr: 'Utiliser "dmesg --pci-driver" obligatoirement',
        isCorrect: false,
        explanation: 'Cette option n\'existe pas dans dmesg.',
        explanationFr: 'Cette option n\'existe pas dans dmesg.'
      },
      {
        id: 'opt-3',
        label: 'Consulter /proc/ioports',
        labelFr: 'Consulter /proc/ioports',
        isCorrect: false,
        explanation: '/proc/ioports liste les plages d\'adresses d\'E/S, pas les noms de modules pilotes.',
        explanationFr: '/proc/ioports liste les plages d\'adresses d\'E/S, pas les noms de modules pilotes.'
      },
      {
        id: 'opt-4',
        label: 'Recompiler lspci avec l\'option --enable-drivers',
        labelFr: 'Recompiler lspci avec l\'option --enable-drivers',
        isCorrect: false,
        explanation: 'L\'option "-k" est présente nativement dans pciutils.',
        explanationFr: 'L\'option "-k" est présente nativement dans pciutils.'
      }
    ],
    correctedSnippet: `root@srv:~# lspci -s 03:00.0 -k
03:00.0 Serial Attached SCSI controller: Broadcom / LSI SAS2008
    Subsystem: Fujitsu Technology Solutions Device
    Kernel driver in use: mpt3sas
    Kernel modules: mpt3sas`,
    fixExplanation: '"lspci -k" affiche directement le pilote actif ("Kernel driver in use").',
    fixExplanationFr: '"lspci -k" affiche directement le pilote actif ("Kernel driver in use").'
  },
  {
    id: 'tb-lpic1-101-08',
    title: 'Consultation du journal de démarrage système avec journalctl',
    titleFr: 'Erreur de filtrage journalctl pour n\'afficher que le boot courant',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'Après un crash mystérieux, l\'administrateur lance "journalctl" mais se retrouve submergé par 8 mois de logs archivés. Il veut inspecter uniquement les logs du démarrage actuel.',
    scenarioFr: 'Après un crash mystérieux, l\'administrateur lance "journalctl" mais se retrouve submergé par 8 mois de logs archivés. Il veut inspecter uniquement les logs du démarrage actuel.',
    codeSnippet: `root@srv:~# journalctl --today
journalctl: unrecognized option '--today'`,
    language: 'bash',
    bugDescription: 'L\'option standard sous systemd pour limiter les logs au démarrage actuel est "-b" (ou "-b 0").',
    bugDescriptionFr: 'L\'option standard sous systemd pour limiter les logs au démarrage actuel est "-b" (ou "-b 0").',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser l\'option "-b" (ou "-b 0") pour filtrer les messages depuis le dernier boot',
        labelFr: 'Utiliser l\'option "-b" (ou "-b 0") pour filtrer les messages depuis le dernier boot',
        isCorrect: true,
        explanation: '"journalctl -b" isole les journaux du boot en cours. "-b -1" affiche le boot précédent.',
        explanationFr: '"journalctl -b" isole les journaux du boot en cours. "-b -1" affiche le boot précédent.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer /var/log/journal pour réinitialiser les logs',
        labelFr: 'Supprimer /var/log/journal pour réinitialiser les logs',
        isCorrect: false,
        explanation: 'Supprimer l\'historique détruit les traces nécessaires à l\'audit.',
        explanationFr: 'Supprimer l\'historique détruit les traces nécessaires à l\'audit.'
      },
      {
        id: 'opt-3',
        label: 'journalctl ne sait pas filtrer par boot, il faut utiliser cat /var/log/syslog',
        labelFr: 'journalctl ne sait pas filtrer par boot, il faut utiliser cat /var/log/syslog',
        isCorrect: false,
        explanation: 'journalctl est spécialement conçu pour indexer les sessions de démarrage (boot ID).',
        explanationFr: 'journalctl est spécialement conçu pour indexer les sessions de démarrage (boot ID).'
      },
      {
        id: 'opt-4',
        label: 'Utiliser l\'option --current-date-only',
        labelFr: 'Utiliser l\'option --current-date-only',
        isCorrect: false,
        explanation: 'Cette option n\'existe pas ; pour filtrer par date on utilise "--since today".',
        explanationFr: 'Cette option n\'existe pas ; pour filtrer par date on utilise "--since today".'
      }
    ],
    correctedSnippet: `journalctl -b`,
    fixExplanation: '"journalctl -b" isole directement la session de démarrage courante.',
    fixExplanationFr: '"journalctl -b" isole directement la session de démarrage courante.'
  },
  {
    id: 'tb-lpic1-101-09',
    title: 'Service masqué (masked) sous Systemd impossible à démarrer',
    titleFr: 'Service Systemd impossible à démarrer : Unit is masked',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.3',
    category: 'System Architecture',
    scenario: 'Un administrateur essaie de lancer le service cups : "systemctl start cups". La commande échoue avec "Failed to start cups.service: Unit cups.service is masked".',
    scenarioFr: 'Un administrateur essaie de lancer le service cups : "systemctl start cups". La commande échoue avec "Failed to start cups.service: Unit cups.service is masked".',
    codeSnippet: `root@srv:~# systemctl start cups.service
Failed to start cups.service: Unit cups.service is masked.`,
    language: 'bash',
    bugDescription: 'Un service masqué pointe vers /dev/null pour interdire son démarrage. Pour le débloquer, il faut exécuter "systemctl unmask cups".',
    bugDescriptionFr: 'Un service masqué pointe vers /dev/null pour interdire son démarrage. Pour le débloquer, il faut exécuter "systemctl unmask cups".',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter "systemctl unmask cups" pour supprimer le lien vers /dev/null avant de démarrer le service',
        labelFr: 'Exécuter "systemctl unmask cups" pour supprimer le lien vers /dev/null avant de démarrer le service',
        isCorrect: true,
        explanation: 'Masquer un service crée un symlink vers /dev/null dans /etc/systemd/system/. "systemctl unmask" le supprime.',
        explanationFr: 'Masquer un service crée un symlink vers /dev/null dans /etc/systemd/system/. "systemctl unmask" le supprime.'
      },
      {
        id: 'opt-2',
        label: 'Taper "systemctl enable --force cups"',
        labelFr: 'Taper "systemctl enable --force cups"',
        isCorrect: false,
        explanation: 'enable ne peut pas outrepasser un masque sans démasquage préalable.',
        explanationFr: 'enable ne peut pas outrepasser un masque sans démasquage préalable.'
      },
      {
        id: 'opt-3',
        label: 'Réinstaller le paquet cups avec apt-get install --reinstall',
        labelFr: 'Réinstaller le paquet cups avec apt-get install --reinstall',
        isCorrect: false,
        explanation: 'Le lien dans /etc/systemd/system/ (espace administrateur) subsistera.',
        explanationFr: 'Le lien dans /etc/systemd/system/ (espace administrateur) subsistera.'
      },
      {
        id: 'opt-4',
        label: 'cups ne peut fonctionner qu\'avec l\'ancienne commande /etc/init.d/cups start',
        labelFr: 'cups ne peut fonctionner qu\'avec l\'ancienne commande /etc/init.d/cups start',
        isCorrect: false,
        explanation: 'Systemd intercepte également les appels aux scripts d\'initialisation.',
        explanationFr: 'Systemd intercepte également les appels aux scripts d\'initialisation.'
      }
    ],
    correctedSnippet: `root@srv:~# systemctl unmask cups
Removed /etc/systemd/system/cups.service.
root@srv:~# systemctl start cups`,
    fixExplanation: '"systemctl unmask" rétablit l\'unité pour permettre son démarrage.',
    fixExplanationFr: '"systemctl unmask" rétablit l\'unité pour permettre son démarrage.'
  },
  {
    id: 'tb-lpic1-101-10',
    title: 'Détection du type d\'amorçage EFI vs BIOS Legacy',
    titleFr: 'Vérification du mode d\'amorçage UEFI via /sys/firmware/efi',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.2',
    category: 'System Architecture',
    scenario: 'Un technicien installe un bootloader et doit vérifier si la machine actuelle tourne en UEFI ou en BIOS Legacy.',
    scenarioFr: 'Un technicien installe un bootloader et doit vérifier si la machine actuelle tourne en UEFI ou en BIOS Legacy.',
    codeSnippet: `root@srv:~# test -d /sys/firmware/efi && echo "UEFI" || echo "BIOS Legacy"`,
    language: 'bash',
    bugDescription: 'Ce test est le test canonique de l\'examen LPIC-1 pour différencier UEFI et BIOS Legacy.',
    bugDescriptionFr: 'Ce test est le test canonique de l\'examen LPIC-1 pour différencier UEFI et BIOS Legacy.',
    options: [
      {
        id: 'opt-1',
        label: 'La présence du répertoire /sys/firmware/efi confirme que le système est amorcé en mode UEFI natif',
        labelFr: 'La présence du répertoire /sys/firmware/efi confirme que le système est amorcé en mode UEFI natif',
        isCorrect: true,
        explanation: 'Le noyau Linux peuple /sys/firmware/efi uniquement s\'il a été amorcé par un firmware UEFI.',
        explanationFr: 'Le noyau Linux peuple /sys/firmware/efi uniquement s\'il a été amorcé par un firmware UEFI.'
      },
      {
        id: 'opt-2',
        label: 'Le dossier /sys/firmware/efi est créé sur tous les systèmes sans distinction',
        labelFr: 'Le dossier /sys/firmware/efi est créé sur tous les systèmes sans distinction',
        isCorrect: false,
        explanation: 'En mode BIOS standard, ce dossier n\'existe pas dans sysfs.',
        explanationFr: 'En mode BIOS standard, ce dossier n\'existe pas dans sysfs.'
      },
      {
        id: 'opt-3',
        label: 'Seul parted peut détecter l\'UEFI',
        labelFr: 'Seul parted peut détecter l\'UEFI',
        isCorrect: false,
        explanation: 'parted voit la table de partition (GPT/MBR), pas le mode d\'amorçage du processeur.',
        explanationFr: 'parted voit la table de partition (GPT/MBR), pas le mode d\'amorçage du processeur.'
      },
      {
        id: 'opt-4',
        label: 'Il faut obligatoirement exécuter efibootmgr qui plante en BIOS Legacy',
        labelFr: 'Il faut obligatoirement exécuter efibootmgr qui plante en BIOS Legacy',
        isCorrect: false,
        explanation: 'Tester /sys/firmware/efi est la méthode shell non destructive standard.',
        explanationFr: 'Tester /sys/firmware/efi est la méthode shell non destructive standard.'
      }
    ],
    correctedSnippet: `[ -d /sys/firmware/efi ] && echo "Mode UEFI" || echo "Mode BIOS Legacy"`,
    fixExplanation: 'Vérifier /sys/firmware/efi est la méthode infaillible recommandée par le LPI.',
    fixExplanationFr: 'Vérifier /sys/firmware/efi est la méthode infaillible recommandée par le LPI.'
  },
  {
    id: 'tb-lpic1-101-11',
    title: 'Informations processeur dans /proc/cpuinfo',
    titleFr: 'Vérification de la virtualisation matérielle (vmx/svm) dans /proc/cpuinfo',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.1',
    category: 'System Architecture',
    scenario: 'Pour activer KVM, l\'administrateur recherche si les extensions de virtualisation matérielle du CPU sont présentes dans /proc/cpuinfo.',
    scenarioFr: 'Pour activer KVM, l\'administrateur recherche si les extensions de virtualisation matérielle du CPU sont présentes dans /proc/cpuinfo.',
    codeSnippet: `root@srv:~# grep -E "kvm|virt" /proc/cpuinfo
# Aucun résultat retourné !`,
    language: 'bash',
    bugDescription: 'Les flags d\'extensions CPU sont "vmx" (Intel VT-x) ou "svm" (AMD-V), pas le mot "kvm".',
    bugDescriptionFr: 'Les flags d\'extensions CPU sont "vmx" (Intel VT-x) ou "svm" (AMD-V), pas le mot "kvm".',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut chercher les drapeaux "vmx" (processeurs Intel) ou "svm" (processeurs AMD) dans la ligne "flags"',
        labelFr: 'Il faut chercher les drapeaux "vmx" (processeurs Intel) ou "svm" (processeurs AMD) dans la ligne "flags"',
        isCorrect: true,
        explanation: 'Intel nomme son extension de virtualisation VMX, et AMD la nomme SVM dans /proc/cpuinfo.',
        explanationFr: 'Intel nomme son extension de virtualisation VMX, et AMD la nomme SVM dans /proc/cpuinfo.'
      },
      {
        id: 'opt-2',
        label: 'La virtualisation CPU est listée dans /proc/meminfo',
        labelFr: 'La virtualisation CPU est listée dans /proc/meminfo',
        isCorrect: false,
        explanation: '/proc/meminfo concerne la mémoire vive.',
        explanationFr: '/proc/meminfo concerne la mémoire vive.'
      },
      {
        id: 'opt-3',
        label: 'Il faut installer qemu pour que /proc/cpuinfo affiche les flags',
        labelFr: 'Il faut installer qemu pour que /proc/cpuinfo affiche les flags',
        isCorrect: false,
        explanation: '/proc/cpuinfo reflète les capacités matérielles réelles détectées par le noyau.',
        explanationFr: '/proc/cpuinfo reflète les capacités matérielles réelles détectées par le noyau.'
      },
      {
        id: 'opt-4',
        label: 'Le fichier /proc/cpuinfo ne contient que la fréquence en MHz',
        labelFr: 'Le fichier /proc/cpuinfo ne contient que la fréquence en MHz',
        isCorrect: false,
        explanation: 'Il contient tous les registres de fonctionnalités (flags / features).',
        explanationFr: 'Il contient tous les registres de fonctionnalités (flags / features).'
      }
    ],
    correctedSnippet: `egrep -c '(vmx|svm)' /proc/cpuinfo`,
    fixExplanation: 'Rechercher "vmx" ou "svm" confirme l\'activation de la virtualisation assistée par matériel.',
    fixExplanationFr: 'Rechercher "vmx" ou "svm" confirme l\'activation de la virtualisation assistée par matériel.'
  },
  {
    id: 'tb-lpic1-101-12',
    title: 'Niveaux d\'exécution SysVinit vs Targets Systemd',
    titleFr: 'Équivalence Runlevel 3 et Runlevel 5 sous Systemd',
    certification: 'lpic-1',
    topicNumber: 101,
    objectiveId: '101.3',
    category: 'System Architecture',
    scenario: 'Un script de déploiement exécute "systemctl isolate runlevel3" et l\'administrateur souhaite vérifier la cible systemd correspondante.',
    scenarioFr: 'Un script de déploiement exécute "systemctl isolate runlevel3" et l\'administrateur souhaite vérifier la cible systemd correspondante.',
    codeSnippet: `root@srv:~# systemctl get-default
graphical.target`,
    language: 'systemd',
    bugDescription: 'Sous Systemd, le runlevel 3 correspond à multi-user.target et le runlevel 5 à graphical.target.',
    bugDescriptionFr: 'Sous Systemd, le runlevel 3 correspond à multi-user.target et le runlevel 5 à graphical.target.',
    options: [
      {
        id: 'opt-1',
        label: 'Le Runlevel 3 équivaut à "multi-user.target" (mode console multi-utilisateurs sans interface graphique X11/Wayland)',
        labelFr: 'Le Runlevel 3 équivaut à "multi-user.target" (mode console multi-utilisateurs sans interface graphique X11/Wayland)',
        isCorrect: true,
        explanation: 'Sous Systemd, runlevel3.target est un alias pointant vers multi-user.target, et runlevel5.target pointe vers graphical.target.',
        explanationFr: 'Sous Systemd, runlevel3.target est un alias pointant vers multi-user.target, et runlevel5.target pointe vers graphical.target.'
      },
      {
        id: 'opt-2',
        label: 'Le Runlevel 3 équivaut à rescue.target',
        labelFr: 'Le Runlevel 3 équivaut à rescue.target',
        isCorrect: false,
        explanation: 'rescue.target correspond au runlevel 1 (mono-utilisateur).',
        explanationFr: 'rescue.target correspond au runlevel 1 (mono-utilisateur).'
      },
      {
        id: 'opt-3',
        label: 'Le Runlevel 3 équivaut à reboot.target',
        labelFr: 'Le Runlevel 3 équivaut à reboot.target',
        isCorrect: false,
        explanation: 'reboot.target correspond au runlevel 6.',
        explanationFr: 'reboot.target correspond au runlevel 6.'
      },
      {
        id: 'opt-4',
        label: 'Le Runlevel 3 équivaut à poweroff.target',
        labelFr: 'Le Runlevel 3 équivaut à poweroff.target',
        isCorrect: false,
        explanation: 'poweroff.target correspond au runlevel 0.',
        explanationFr: 'poweroff.target correspond au runlevel 0.'
      }
    ],
    correctedSnippet: `systemctl isolate multi-user.target`,
    fixExplanation: 'Isoler multi-user.target bascule immédiatement le système en mode serveur sans affichage graphique.',
    fixExplanationFr: 'Isoler multi-user.target bascule immédiatement le système en mode serveur sans affichage graphique.'
  },

  // ==========================================
  // TOPIC 102: LINUX INSTALLATION & PACKAGE MANAGEMENT (102.1 - 102.6) [13 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-102-01',
    title: 'Partition Swap non activée après redémarrage',
    titleFr: 'Partition Swap absente de /etc/fstab',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.1',
    category: 'Installation & Package Management',
    scenario: 'L\'administrateur formate /dev/sdb2 avec mkswap et l\'active avec swapon /dev/sdb2. Après redémarrage, "free -m" indique 0 Mo de swap.',
    scenarioFr: 'L\'administrateur formate /dev/sdb2 avec mkswap et l\'active avec swapon /dev/sdb2. Après redémarrage, "free -m" indique 0 Mo de swap.',
    codeSnippet: `root@srv:~# free -m
               total        used        free      shared  buff/cache   available
Mem:            7910        1210        6200          15         500        6450
Swap:              0           0           0`,
    language: 'bash',
    bugDescription: 'La partition swap n\'a pas été enregistrée dans /etc/fstab pour être montée au démarrage.',
    bugDescriptionFr: 'La partition swap n\'a pas été enregistrée dans /etc/fstab pour être montée au démarrage.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut ajouter la ligne de swap dans /etc/fstab (ex: "/dev/sdb2 none swap sw 0 0")',
        labelFr: 'Il faut ajouter la ligne de swap dans /etc/fstab (ex: "/dev/sdb2 none swap sw 0 0")',
        isCorrect: true,
        explanation: '"swapon" n\'est qu\'une activation volatile en mémoire. Pour persister au boot, la swap doit figurer dans /etc/fstab.',
        explanationFr: '"swapon" n\'est qu\'une activation volatile en mémoire. Pour persister au boot, la swap doit figurer dans /etc/fstab.'
      },
      {
        id: 'opt-2',
        label: 'Il faut formater la swap en ext4',
        labelFr: 'Il faut formater la swap en ext4',
        isCorrect: false,
        explanation: 'La swap utilise sa propre structure créée par mkswap.',
        explanationFr: 'La swap utilise sa propre structure créée par mkswap.'
      },
      {
        id: 'opt-3',
        label: 'Le noyau désactive la swap si la RAM dépasse 4 Go',
        labelFr: 'Le noyau désactive la swap si la RAM dépasse 4 Go',
        isCorrect: false,
        explanation: 'Le noyau utilise la swap indépendamment de la taille de la RAM.',
        explanationFr: 'Le noyau utilise la swap indépendamment de la taille de la RAM.'
      },
      {
        id: 'opt-4',
        label: 'Il faut exécuter swapoff -a pour valider',
        labelFr: 'Il faut exécuter swapoff -a pour valider',
        isCorrect: false,
        explanation: 'swapoff désactive les espaces swap actifs.',
        explanationFr: 'swapoff désactive les espaces swap actifs.'
      }
    ],
    correctedSnippet: `# Dans /etc/fstab :
UUID=5a4b3c2d-01 none swap sw 0 0

# Puis tester immédiatement sans reboot :
swapon -a`,
    fixExplanation: 'Ajouter la ligne dans /etc/fstab et valider avec "swapon -a" active la swap au démarrage.',
    fixExplanationFr: 'Ajouter la ligne dans /etc/fstab et valider avec "swapon -a" active la swap au démarrage.'
  },
  {
    id: 'tb-lpic1-102-02',
    title: 'Installation d\'un chargeur GRUB2 sur le mauvais périphérique',
    titleFr: 'grub-install exécuté sur la partition (/dev/sda1) au lieu du disque (/dev/sda)',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.2',
    category: 'Installation & Package Management',
    scenario: 'Sur un système BIOS/MBR, le technicien tape "grub-install /dev/sda1". Au redémarrage, le BIOS affiche "Missing operating system".',
    scenarioFr: 'Sur un système BIOS/MBR, le technicien tape "grub-install /dev/sda1". Au redémarrage, le BIOS affiche "Missing operating system".',
    codeSnippet: `root@srv:~# grub-install /dev/sda1
Installing for i386-pc platform.
grub-install: warning: File system \`ext4' doesn't support embedding.
grub-install: warning: Embedding is not possible.  GRUB can only be installed in this setup by using blocklists.
Installation finished. No error reported.`,
    language: 'bash',
    bugDescription: 'En mode MBR, grub-install doit cibler le disque entier (/dev/sda) et non une partition (/dev/sda1).',
    bugDescriptionFr: 'En mode MBR, grub-install doit cibler le disque entier (/dev/sda) et non une partition (/dev/sda1).',
    options: [
      {
        id: 'opt-1',
        label: 'En mode BIOS/MBR, grub-install doit cibler le disque physique (/dev/sda) pour écrire le stage 1 dans le MBR et le stage 1.5 dans le post-MBR gap',
        labelFr: 'En mode BIOS/MBR, grub-install doit cibler le disque physique (/dev/sda) pour écrire le stage 1 dans le MBR et le stage 1.5 dans le post-MBR gap',
        isCorrect: true,
        explanation: 'Installer GRUB sur une partition (/dev/sda1) ne remplit pas le Master Boot Record (secteur 0 du disque) que le BIOS interroge au démarrage.',
        explanationFr: 'Installer GRUB sur une partition (/dev/sda1) ne remplit pas le Master Boot Record (secteur 0 du disque) que le BIOS interroge au démarrage.'
      },
      {
        id: 'opt-2',
        label: 'grub-install est interdit sur les disques sda, il faut utiliser sdb',
        labelFr: 'grub-install est interdit sur les disques sda, il faut utiliser sdb',
        isCorrect: false,
        explanation: '/dev/sda est le premier disque standard.',
        explanationFr: '/dev/sda est le premier disque standard.'
      },
      {
        id: 'opt-3',
        label: 'Il fallait formater /dev/sda1 en VFAT',
        labelFr: 'Il fallait formater /dev/sda1 en VFAT',
        isCorrect: false,
        explanation: 'VFAT n\'est requis que pour la partition ESP en UEFI, pas en BIOS/MBR classique.',
        explanationFr: 'VFAT n\'est requis que pour la partition ESP en UEFI, pas en BIOS/MBR classique.'
      },
      {
        id: 'opt-4',
        label: 'Il faut exécuter update-grub avant grub-install',
        labelFr: 'Il faut exécuter update-grub avant grub-install',
        isCorrect: false,
        explanation: 'grub-install installe les fichiers binaires de boot ; update-grub ne fait que générer grub.cfg.',
        explanationFr: 'grub-install installe les fichiers binaires de boot ; update-grub ne fait que générer grub.cfg.'
      }
    ],
    correctedSnippet: `grub-install /dev/sda`,
    fixExplanation: 'Cibler "/dev/sda" installe correctement le code de démarrage initial dans les 446 premiers octets du MBR.',
    fixExplanationFr: 'Cibler "/dev/sda" installe correctement le code de démarrage initial dans les 446 premiers octets du MBR.'
  },
  {
    id: 'tb-lpic1-102-03',
    title: 'Suppression complète d\'un paquet Debian incluant ses fichiers de configuration',
    titleFr: 'Fichiers de configuration conservés après "apt remove" (état "rc")',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Installation & Package Management',
    scenario: 'L\'administrateur supprime le paquet nginx avec "dpkg -r nginx" (ou apt remove nginx). Plus tard, il constate que /etc/nginx/nginx.conf est toujours présent et "dpkg -l nginx" affiche l\'état "rc".',
    scenarioFr: 'L\'administrateur supprime le paquet nginx avec "dpkg -r nginx" (ou apt remove nginx). Plus tard, il constate que /etc/nginx/nginx.conf est toujours présent et "dpkg -l nginx" affiche l\'état "rc".',
    codeSnippet: `root@srv:~# dpkg -l nginx
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name           Version         Architecture Description
+++-==============-===============-============-=================================
rc  nginx          1.22.1-9        amd64        small, powerful web server`,
    language: 'bash',
    bugDescription: '"remove" (-r) supprime les binaires mais préserve les fichiers de configuration (état rc). Pour tout effacer, il faut "purge" (-P).',
    bugDescriptionFr: '"remove" (-r) supprime les binaires mais préserve les fichiers de configuration (état rc). Pour tout effacer, il faut "purge" (-P).',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut utiliser l\'option "--purge" (apt purge nginx ou "dpkg -P nginx") pour effacer aussi les fichiers de configuration',
        labelFr: 'Il faut utiliser l\'option "--purge" (apt purge nginx ou "dpkg -P nginx") pour effacer aussi les fichiers de configuration',
        isCorrect: true,
        explanation: 'Sous Debian/Ubuntu, "remove" préserve /etc/. "purge" (ou statut rc purgé) supprime les configurations associées.',
        explanationFr: 'Sous Debian/Ubuntu, "remove" préserve /etc/. "purge" (ou statut rc purgé) supprime les configurations associées.'
      },
      {
        id: 'opt-2',
        label: 'L\'état "rc" signifie que le paquet est corrompu et en cours de réinstallation',
        labelFr: 'L\'état "rc" signifie que le paquet est corrompu et en cours de réinstallation',
        isCorrect: false,
        explanation: '"rc" signifie Removed (supprimé) et Config-files (fichiers de conf résiduels).',
        explanationFr: '"rc" signifie Removed (supprimé) et Config-files (fichiers de conf résiduels).'
      },
      {
        id: 'opt-3',
        label: 'Il faut supprimer manuellement /etc/nginx avec rm -rf uniquement',
        labelFr: 'Il faut supprimer manuellement /etc/nginx avec rm -rf uniquement',
        isCorrect: false,
        explanation: 'dpkg conserverait la trace du paquet à l\'état "rc" dans sa base de données.',
        explanationFr: 'dpkg conserverait la trace du paquet à l\'état "rc" dans sa base de données.'
      },
      {
        id: 'opt-4',
        label: 'dpkg ne permet pas d\'effacer les fichiers de configuration',
        labelFr: 'dpkg ne permet pas d\'effacer les fichiers de configuration',
        isCorrect: false,
        explanation: 'dpkg -P (purge) est expressément prévu pour cela.',
        explanationFr: 'dpkg -P (purge) est expressément prévu pour cela.'
      }
    ],
    correctedSnippet: `dpkg -P nginx
# ou avec apt :
apt purge nginx`,
    fixExplanation: '"dpkg -P" (purge) nettoie tous les fichiers de configuration et retire complètement le paquet de la liste.',
    fixExplanationFr: '"dpkg -P" (purge) nettoie tous les fichiers de configuration et retire complètement le paquet de la liste.'
  },
  {
    id: 'tb-lpic1-102-04',
    title: 'Vérification de l\'intégrité d\'un paquet RPM altéré',
    titleFr: 'Détection des fichiers modifiés d\'un paquet avec rpm -V',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.5',
    category: 'Installation & Package Management',
    scenario: 'Un administrateur suspecte qu\'un binaire du paquet coreutils a été modifié ou corrompu par un intrus. Il souhaite vérifier l\'intégrité de tous les fichiers du paquet par rapport à la base RPM.',
    scenarioFr: 'Un administrateur suspecte qu\'un binaire du paquet coreutils a été modifié ou corrompu par un intrus. Il souhaite vérifier l\'intégrité de tous les fichiers du paquet par rapport à la base RPM.',
    codeSnippet: `[root@srv ~]# rpm -qa coreutils
coreutils-8.32-34.el9.x86_64
# Comment comparer les checksums MD5/SHA256, tailles et permissions des fichiers installés ?`,
    language: 'bash',
    bugDescription: 'La commande requise pour vérifier l\'intégrité des fichiers d\'un paquet installé sous RPM est "rpm -V" (verify).',
    bugDescriptionFr: 'La commande requise pour vérifier l\'intégrité des fichiers d\'un paquet installé sous RPM est "rpm -V" (verify).',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "rpm -V coreutils" (ou rpm -Va pour tous les paquets) pour comparer les sommes de contrôle, tailles et permissions',
        labelFr: 'Utiliser "rpm -V coreutils" (ou rpm -Va pour tous les paquets) pour comparer les sommes de contrôle, tailles et permissions',
        isCorrect: true,
        explanation: '"rpm -V" (verify) inspecte chaque fichier par rapport aux métadonnées d\'origine (S=taille, 5=checksum MD5, M=mode/droits, 5=digest).',
        explanationFr: '"rpm -V" (verify) inspecte chaque fichier par rapport aux métadonnées d\'origine (S=taille, 5=checksum MD5, M=mode/droits, 5=digest).'
      },
      {
        id: 'opt-2',
        label: 'Utiliser rpm -check coreutils',
        labelFr: 'Utiliser rpm -check coreutils',
        isCorrect: false,
        explanation: 'Cette option n\'existe pas dans rpm.',
        explanationFr: 'Cette option n\'existe pas dans rpm.'
      },
      {
        id: 'opt-3',
        label: 'Utiliser dnf clean all',
        labelFr: 'Utiliser dnf clean all',
        isCorrect: false,
        explanation: 'dnf clean all vide le cache local des dépôts distants.',
        explanationFr: 'dnf clean all vide le cache local des dépôts distants.'
      },
      {
        id: 'opt-4',
        label: 'RPM ne conserve pas les sommes de contrôle des fichiers installés',
        labelFr: 'RPM ne conserve pas les sommes de contrôle des fichiers installés',
        isCorrect: false,
        explanation: 'La base /var/lib/rpm contient l\'empreinte cryptographique de chaque fichier déposé.',
        explanationFr: 'La base /var/lib/rpm contient l\'empreinte cryptographique de chaque fichier déposé.'
      }
    ],
    correctedSnippet: `[root@srv ~]# rpm -V coreutils
S.5....T.  c /etc/pam.d/su
..5......    /usr/bin/ls`,
    fixExplanation: '"rpm -V <paquet>" affiche les anomalies détectées ("5" indique que le hash MD5 a changé).',
    fixExplanationFr: '"rpm -V <paquet>" affiche les anomalies détectées ("5" indique que le hash MD5 a changé).'
  },
  {
    id: 'tb-lpic1-102-05',
    title: 'Mise à niveau majeure de distribution sous Debian avec dist-upgrade',
    titleFr: 'apt-get upgrade ne met pas à jour les paquets nécessitant de nouvelles dépendances',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Installation & Package Management',
    scenario: 'L\'administrateur lance "apt-get upgrade". Le gestionnaire affiche : "The following packages have been kept back: linux-image-amd64". Le noyau n\'est pas mis à jour.',
    scenarioFr: 'L\'administrateur lance "apt-get upgrade". Le gestionnaire affiche : "The following packages have been kept back: linux-image-amd64". Le noyau n\'est pas mis à jour.',
    codeSnippet: `root@srv:~# apt-get upgrade
Reading package lists... Done
The following packages have been kept back:
  linux-image-amd64
0 upgraded, 0 newly installed, 0 to remove and 1 not upgraded.`,
    language: 'bash',
    bugDescription: '"apt-get upgrade" refuse d\'installer de nouvelles dépendances ou de supprimer d\'anciens paquets. Il faut utiliser "apt-get dist-upgrade" (ou apt full-upgrade).',
    bugDescriptionFr: '"apt-get upgrade" refuse d\'installer de nouvelles dépendances ou de supprimer d\'anciens paquets. Il faut utiliser "apt-get dist-upgrade" (ou apt full-upgrade).',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "apt-get dist-upgrade" (ou "apt full-upgrade") qui gère intelligemment l\'ajout de nouveaux paquets de dépendances noyau',
        labelFr: 'Utiliser "apt-get dist-upgrade" (ou "apt full-upgrade") qui gère intelligemment l\'ajout de nouveaux paquets de dépendances noyau',
        isCorrect: true,
        explanation: '"upgrade" standard ne peut jamais installer de nouveaux paquets supplémentaires requis par la nouvelle version du noyau (ABI différente). dist-upgrade résout ces changements.',
        explanationFr: '"upgrade" standard ne peut jamais installer de nouveaux paquets supplémentaires requis par la nouvelle version du noyau (ABI différente). dist-upgrade résout ces changements.'
      },
      {
        id: 'opt-2',
        label: 'Il faut forcer avec apt-get upgrade --force-all',
        labelFr: 'Il faut forcer avec apt-get upgrade --force-all',
        isCorrect: false,
        explanation: 'Cette option n\'existe pas dans apt-get.',
        explanationFr: 'Cette option n\'existe pas dans apt-get.'
      },
      {
        id: 'opt-3',
        label: 'Le paquet est bloqué par dpkg --hold',
        labelFr: 'Le paquet est bloqué par dpkg --hold',
        isCorrect: false,
        explanation: 'Le message indique "kept back" en raison de nouvelles dépendances non résolubles par un simple upgrade.',
        explanationFr: 'Le message indique "kept back" en raison de nouvelles dépendances non résolubles par un simple upgrade.'
      },
      {
        id: 'opt-4',
        label: 'Il faut compiler le noyau à la main depuis kernel.org',
        labelFr: 'Il faut compiler le noyau à la main depuis kernel.org',
        isCorrect: false,
        explanation: 'dist-upgrade résout l\'installation automatiquement via le gestionnaire de paquets.',
        explanationFr: 'dist-upgrade résout l\'installation automatiquement via le gestionnaire de paquets.'
      }
    ],
    correctedSnippet: `apt-get dist-upgrade
# ou :
apt full-upgrade`,
    fixExplanation: '"dist-upgrade" installe les nouveaux paquets requis par les dépendances de la version mise à niveau.',
    fixExplanationFr: '"dist-upgrade" installe les nouveaux paquets requis par les dépendances de la version mise à niveau.'
  },
  {
    id: 'tb-lpic1-102-06',
    title: 'Téléchargement seul d\'un paquet RPM avec dnf download',
    titleFr: 'Téléchargement d\'un paquet RPM sans l\'installer sur la machine',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.5',
    category: 'Installation & Package Management',
    scenario: 'Pour un serveur en zone isolée sans internet, l\'administrateur veut télécharger le paquet "nginx" et ses dépendances sous forme de fichiers .rpm sur son poste connecté.',
    scenarioFr: 'Pour un serveur en zone isolée sans internet, l\'administrateur veut télécharger le paquet "nginx" et ses dépendances sous forme de fichiers .rpm sur son poste connecté.',
    codeSnippet: `[root@srv ~]# dnf get nginx
No such command: get. Please use /usr/bin/dnf --help`,
    language: 'bash',
    bugDescription: 'La commande pour télécharger un fichier .rpm sans installation est "dnf download" (fournie par dnf-plugins-core).',
    bugDescriptionFr: 'La commande pour télécharger un fichier .rpm sans installation est "dnf download" (fournie par dnf-plugins-core).',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "dnf download nginx" (ou yumdownloader nginx)',
        labelFr: 'Utiliser "dnf download nginx" (ou yumdownloader nginx)',
        isCorrect: true,
        explanation: '"dnf download <paquet>" télécharge le fichier RPM dans le répertoire courant sans procéder à l\'installation.',
        explanationFr: '"dnf download <paquet>" télécharge le fichier RPM dans le répertoire courant sans procéder à l\'installation.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser rpm -d nginx',
        labelFr: 'Utiliser rpm -d nginx',
        isCorrect: false,
        explanation: 'rpm ne gère pas les dépôts distants HTTP/HTTPS.',
        explanationFr: 'rpm ne gère pas les dépôts distants HTTP/HTTPS.'
      },
      {
        id: 'opt-3',
        label: 'Utiliser dnf fetch nginx',
        labelFr: 'Utiliser dnf fetch nginx',
        isCorrect: false,
        explanation: 'La sous-commande "fetch" n\'existe pas dans DNF.',
        explanationFr: 'La sous-commande "fetch" n\'existe pas dans DNF.'
      },
      {
        id: 'opt-4',
        label: 'Il est impossible d\'obtenir un fichier .rpm sans compiler depuis les sources',
        labelFr: 'Il est impossible d\'obtenir un fichier .rpm sans compiler depuis les sources',
        isCorrect: false,
        explanation: 'Les dépôts binaires fournissent directement les fichiers .rpm précompilés.',
        explanationFr: 'Les dépôts binaires fournissent directement les fichiers .rpm précompilés.'
      }
    ],
    correctedSnippet: `dnf download nginx --alldeps`,
    fixExplanation: '"dnf download" récupère le fichier .rpm directement depuis le miroir configuré.',
    fixExplanationFr: '"dnf download" récupère le fichier .rpm directement depuis le miroir configuré.'
  },
  {
    id: 'tb-lpic1-102-07',
    title: 'Détection d\'une machine virtuelle hôte via systemd-detect-virt',
    titleFr: 'Identification de l\'hyperviseur d\'exécution sous Linux',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.6',
    category: 'Installation & Package Management',
    scenario: 'Un script doit adapter sa configuration mémoire et réseau selon qu\'il tourne sur bare-metal physique ou dans une machine virtuelle (KVM, VMware, Xen).',
    scenarioFr: 'Un script doit adapter sa configuration mémoire et réseau selon qu\'il tourne sur bare-metal physique ou dans une machine virtuelle (KVM, VMware, Xen).',
    codeSnippet: `root@srv:~# is-virtual-machine
bash: is-virtual-machine: command not found`,
    language: 'bash',
    bugDescription: 'La commande standard officielle LPIC-1 pour détecter la virtualisation ou le conteneur est "systemd-detect-virt".',
    bugDescriptionFr: 'La commande standard officielle LPIC-1 pour détecter la virtualisation ou le conteneur est "systemd-detect-virt".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "systemd-detect-virt" qui retourne le type d\'environnement (kvm, vmware, oracle, lxc, chroot ou none)',
        labelFr: 'Utiliser "systemd-detect-virt" qui retourne le type d\'environnement (kvm, vmware, oracle, lxc, chroot ou none)',
        isCorrect: true,
        explanation: '"systemd-detect-virt" analyse l\'instruction CPUID, DMI et les hypercalls pour identifier la technologie de virtualisation.',
        explanationFr: '"systemd-detect-virt" analyse l\'instruction CPUID, DMI et les hypercalls pour identifier la technologie de virtualisation.'
      },
      {
        id: 'opt-2',
        label: 'Vérifier la présence du fichier /etc/virtual-machine',
        labelFr: 'Vérifier la présence du fichier /etc/virtual-machine',
        isCorrect: false,
        explanation: 'Ce fichier n\'existe pas sous Linux.',
        explanationFr: 'Ce fichier n\'existe pas sous Linux.'
      },
      {
        id: 'opt-3',
        label: 'Exécuter vmware-toolbox obligatoirement',
        labelFr: 'Exécuter vmware-toolbox obligatoirement',
        isCorrect: false,
        explanation: 'Cela ne fonctionnerait que sous VMware avec les guest tools installés.',
        explanationFr: 'Cela ne fonctionnerait que sous VMware avec les guest tools installés.'
      },
      {
        id: 'opt-4',
        label: 'Linux ne peut pas détecter s\'il tourne dans une machine virtuelle',
        labelFr: 'Linux ne peut pas détecter s\'il tourne dans une machine virtuelle',
        isCorrect: false,
        explanation: 'Les hyperviseurs modernes s\'annoncent explicitement dans les registres CPUID.',
        explanationFr: 'Les hyperviseurs modernes s\'annoncent explicitement dans les registres CPUID.'
      }
    ],
    correctedSnippet: `systemd-detect-virt`,
    fixExplanation: '"systemd-detect-virt" renvoie "none" sur machine physique ou le nom de l\'hyperviseur/conteneur.',
    fixExplanationFr: '"systemd-detect-virt" renvoie "none" sur machine physique ou le nom de l\'hyperviseur/conteneur.'
  },
  {
    id: 'tb-lpic1-102-08',
    title: 'Cache des bibliothèques partagées non actualisé après ajout d\'une .so',
    titleFr: 'ldconfig omis après le dépôt d\'une bibliothèque dans /usr/local/lib',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.3',
    category: 'Installation & Package Management',
    scenario: 'Une bibliothèque "libtools.so.1" a été copiée dans /usr/local/lib. Lors du lancement de l\'application, le système continue d\'indiquer qu\'elle est manquante.',
    scenarioFr: 'Une bibliothèque "libtools.so.1" a été copiée dans /usr/local/lib. Lors du lancement de l\'application, le système continue d\'indiquer qu\'elle est manquante.',
    codeSnippet: `root@srv:~# cp libtools.so.1 /usr/local/lib/
root@srv:~# /usr/local/bin/monapp
monapp: error while loading shared libraries: libtools.so.1: cannot open shared object file`,
    language: 'bash',
    bugDescription: 'L\'éditeur de liens dynamique utilise /etc/ld.so.cache. Après tout ajout de bibliothèque, la commande "ldconfig" doit être exécutée.',
    bugDescriptionFr: 'L\'éditeur de liens dynamique utilise /etc/ld.so.cache. Après tout ajout de bibliothèque, la commande "ldconfig" doit être exécutée.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut exécuter "ldconfig" en root pour régénérer le cache binaire /etc/ld.so.cache',
        labelFr: 'Il faut exécuter "ldconfig" en root pour régénérer le cache binaire /etc/ld.so.cache',
        isCorrect: true,
        explanation: 'ld.so ne rescannera pas les répertoires physiques à chaque lancement pour des raisons de performance. "ldconfig" reconstruit le cache d\'indexation.',
        explanationFr: 'ld.so ne rescannera pas les répertoires physiques à chaque lancement pour des raisons de performance. "ldconfig" reconstruit le cache d\'indexation.'
      },
      {
        id: 'opt-2',
        label: 'Il faut redémarrer la machine pour charger les bibliothèques',
        labelFr: 'Il faut redémarrer la machine pour charger les bibliothèques',
        isCorrect: false,
        explanation: 'ldconfig prend effet immédiatement sans redémarrage.',
        explanationFr: 'ldconfig prend effet immédiatement sans redémarrage.'
      },
      {
        id: 'opt-3',
        label: 'Les bibliothèques doivent obligatoirement être dans /lib et jamais dans /usr/local/lib',
        labelFr: 'Les bibliothèques doivent obligatoirement être dans /lib et jamais dans /usr/local/lib',
        isCorrect: false,
        explanation: '/usr/local/lib est parfaitement standard selon le standard FHS.',
        explanationFr: '/usr/local/lib est parfaitement standard selon le standard FHS.'
      },
      {
        id: 'opt-4',
        label: 'Il faut renommer le fichier en .dll',
        labelFr: 'Il faut renommer le fichier en .dll',
        isCorrect: false,
        explanation: '.dll est le format Windows PE, sous Linux les bibliothèques partagées sont des .so (Shared Objects).',
        explanationFr: '.dll est le format Windows PE, sous Linux les bibliothèques partagées sont des .so (Shared Objects).'
      }
    ],
    correctedSnippet: `root@srv:~# ldconfig
root@srv:~# ldconfig -p | grep libtools
    libtools.so.1 (libc6,x86-64) => /usr/local/lib/libtools.so.1`,
    fixExplanation: 'L\'exécution de "ldconfig" met à jour /etc/ld.so.cache et rend la bibliothèque immédiatement accessible.',
    fixExplanationFr: 'L\'exécution de "ldconfig" met à jour /etc/ld.so.cache et rend la bibliothèque immédiatement accessible.'
  },
  {
    id: 'tb-lpic1-102-09',
    title: 'Installation d\'un paquet RPM avec dépendances manquantes',
    titleFr: 'rpm -ivh échoue avec "Failed dependencies"',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.5',
    category: 'Installation & Package Management',
    scenario: 'L\'administrateur essaie d\'installer "rpm -ivh graphviz.rpm". La commande échoue avec "error: Failed dependencies: libgd.so.3()(64bit) is needed by graphviz".',
    scenarioFr: 'L\'administrateur essaie d\'installer "rpm -ivh graphviz.rpm". La commande échoue avec "error: Failed dependencies: libgd.so.3()(64bit) is needed by graphviz".',
    codeSnippet: `[root@srv ~]# rpm -ivh graphviz-2.44.0.rpm
error: Failed dependencies:
    libgd.so.3()(64bit) is needed by graphviz-2.44.0-1.el9.x86_64`,
    language: 'bash',
    bugDescription: 'La commande "rpm" de bas niveau ne télécharge ni ne résout les dépendances. Il faut installer via le gestionnaire de haut niveau "dnf localinstall" (ou dnf install ./paquet.rpm).',
    bugDescriptionFr: 'La commande "rpm" de bas niveau ne télécharge ni ne résout les dépendances. Il faut installer via le gestionnaire de haut niveau "dnf localinstall" (ou dnf install ./paquet.rpm).',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "dnf install ./graphviz-2.44.0.rpm" pour résoudre et télécharger automatiquement les dépendances depuis les dépôts',
        labelFr: 'Utiliser "dnf install ./graphviz-2.44.0.rpm" pour résoudre et télécharger automatiquement les dépendances depuis les dépôts',
        isCorrect: true,
        explanation: 'rpm signale les dépendances mais ne sait pas les récupérer. DNF analyse le fichier local et va chercher les paquets manquants (comme gd) sur les dépôts configurés.',
        explanationFr: 'rpm signale les dépendances mais ne sait pas les récupérer. DNF analyse le fichier local et va chercher les paquets manquants (comme gd) sur les dépôts configurés.'
      },
      {
        id: 'opt-2',
        label: 'Forcer l\'installation avec rpm -ivh --nodeps',
        labelFr: 'Forcer l\'installation avec rpm -ivh --nodeps',
        isCorrect: false,
        explanation: '--nodeps ignorerait le contrôle mais le programme crasherait dès son exécution faute de bibliothèque.',
        explanationFr: '--nodeps ignorerait le contrôle mais le programme crasherait dès son exécution faute de bibliothèque.'
      },
      {
        id: 'opt-3',
        label: 'Créer un fichier vide /usr/lib64/libgd.so.3 avec touch',
        labelFr: 'Créer un fichier vide /usr/lib64/libgd.so.3 avec touch',
        isCorrect: false,
        explanation: 'Un fichier vide provoquerait une erreur "file too short" de ld.so.',
        explanationFr: 'Un fichier vide provoquerait une erreur "file too short" de ld.so.'
      },
      {
        id: 'opt-4',
        label: 'Graphviz est incompatible avec Linux',
        labelFr: 'Graphviz est incompatible avec Linux',
        isCorrect: false,
        explanation: 'Graphviz est un logiciel open-source standard sous Linux.',
        explanationFr: 'Graphviz est un logiciel open-source standard sous Linux.'
      }
    ],
    correctedSnippet: `dnf install ./graphviz-2.44.0.rpm`,
    fixExplanation: 'Utiliser "dnf install <fichier.rpm>" permet de résoudre et d\'installer automatiquement les dépendances manquantes.',
    fixExplanationFr: 'Utiliser "dnf install <fichier.rpm>" permet de résoudre et d\'installer automatiquement les dépendances manquantes.'
  },
  {
    id: 'tb-lpic1-102-10',
    title: 'Suppression d\'un fichier de dépôt APT erroné causant l\'échec d\'apt update',
    titleFr: 'Dépôt APT 404 Not Found bloquant toutes les mises à jour',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Installation & Package Management',
    scenario: 'Un dépôt PPA tiers obsolète dans /etc/apt/sources.list.d/ renvoie une erreur 404. "apt-get update" s\'interrompt avec "E: Some index files failed to download".',
    scenarioFr: 'Un dépôt PPA tiers obsolète dans /etc/apt/sources.list.d/ renvoie une erreur 404. "apt-get update" s\'interrompt avec "E: Some index files failed to download".',
    codeSnippet: `root@srv:~# apt-get update
Err:4 http://ppa.launchpad.net/obsolete/ppa/ubuntu noble Release
  404  Not Found [IP: 185.125.190.80 80]
E: The repository 'http://ppa.launchpad.net/obsolete/ppa/ubuntu noble Release' does not have a Release file.`,
    language: 'bash',
    bugDescription: 'Le fichier .list correspondant dans /etc/apt/sources.list.d/ référence une URL morte qui bloque l\'actualisation du gestionnaire de paquets.',
    bugDescriptionFr: 'Le fichier .list correspondant dans /etc/apt/sources.list.d/ référence une URL morte qui bloque l\'actualisation du gestionnaire de paquets.',
    options: [
      {
        id: 'opt-1',
        label: 'Supprimer ou désactiver le fichier de configuration du dépôt défaillant dans /etc/apt/sources.list.d/',
        labelFr: 'Supprimer ou désactiver le fichier de configuration du dépôt défaillant dans /etc/apt/sources.list.d/',
        isCorrect: true,
        explanation: 'Tant qu\'un fichier .list présent dans /etc/apt/sources.list.d/ renvoie une erreur critique, APT refuse d\'ignorer l\'incohérence par sécurité.',
        explanationFr: 'Tant qu\'un fichier .list présent dans /etc/apt/sources.list.d/ renvoie une erreur critique, APT refuse d\'ignorer l\'incohérence par sécurité.'
      },
      {
        id: 'opt-2',
        label: 'Changer les DNS du serveur dans /etc/resolv.conf',
        labelFr: 'Changer les DNS du serveur dans /etc/resolv.conf',
        isCorrect: false,
        explanation: 'La résolution DNS a réussi (l\'IP est affichée), c\'est le serveur web qui répond 404 (ressource inexistante).',
        explanationFr: 'La résolution DNS a réussi (l\'IP est affichée), c\'est le serveur web qui répond 404 (ressource inexistante).'
      },
      {
        id: 'opt-3',
        label: 'Supprimer /var/lib/dpkg/status',
        labelFr: 'Supprimer /var/lib/dpkg/status',
        isCorrect: false,
        explanation: 'Ne jamais supprimer /var/lib/dpkg/status sous peine de perdre l\'inventaire du système.',
        explanationFr: 'Ne jamais supprimer /var/lib/dpkg/status sous peine de perdre l\'inventaire du système.'
      },
      {
        id: 'opt-4',
        label: 'Désactiver le pare-feu avec iptables -F',
        labelFr: 'Désactiver le pare-feu avec iptables -F',
        isCorrect: false,
        explanation: 'Le pare-feu ne bloque pas la connexion car le serveur HTTP distant répond avec le code HTTP 404.',
        explanationFr: 'Le pare-feu ne bloque pas la connexion car le serveur HTTP distant répond avec le code HTTP 404.'
      }
    ],
    correctedSnippet: `rm /etc/apt/sources.list.d/obsolete.list
apt-get update`,
    fixExplanation: 'Supprimer le fichier de dépôt orphelin permet à "apt-get update" de terminer avec succès.',
    fixExplanationFr: 'Supprimer le fichier de dépôt orphelin permet à "apt-get update" de terminer avec succès.'
  },
  {
    id: 'tb-lpic1-102-11',
    title: 'Fichiers orphelins de paquets sous DNF et commande autoremove',
    titleFr: 'Nettoyage des dépendances résiduelles inutilisées avec dnf autoremove',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.5',
    category: 'Installation & Package Management',
    scenario: 'Après la suppression d\'une application volumineuse, des dizaines de bibliothèques installées comme dépendances occupent inutilement de l\'espace disque.',
    scenarioFr: 'Après la suppression d\'une application volumineuse, des dizaines de bibliothèques installées comme dépendances occupent inutilement de l\'espace disque.',
    codeSnippet: `[root@srv ~]# dnf clean dependencies
No such command: dependencies. Please use /usr/bin/dnf --help`,
    language: 'bash',
    bugDescription: 'La commande standard pour supprimer les paquets installés automatiquement comme dépendances et devenus orphelins est "dnf autoremove" (ou yum autoremove).',
    bugDescriptionFr: 'La commande standard pour supprimer les paquets installés automatiquement comme dépendances et devenus orphelins est "dnf autoremove" (ou yum autoremove).',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter "dnf autoremove" pour désinstaller automatiquement les dépendances orphelines',
        labelFr: 'Exécuter "dnf autoremove" pour désinstaller automatiquement les dépendances orphelines',
        isCorrect: true,
        explanation: '"autoremove" analyse l\'arbre des paquets et supprime ceux qui avaient été installés uniquement pour satisfaire une dépendance désormais absente.',
        explanationFr: '"autoremove" analyse l\'arbre des paquets et supprime ceux qui avaient été installés uniquement pour satisfaire une dépendance désormais absente.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer le dossier /usr/lib64 manuellement',
        labelFr: 'Supprimer le dossier /usr/lib64 manuellement',
        isCorrect: false,
        explanation: 'Cela détruirait toutes les bibliothèques système critiques de la distribution.',
        explanationFr: 'Cela détruirait toutes les bibliothèques système critiques de la distribution.'
      },
      {
        id: 'opt-3',
        label: 'Utiliser dnf purge-all',
        labelFr: 'Utiliser dnf purge-all',
        isCorrect: false,
        explanation: 'Cette commande n\'existe pas dans DNF.',
        explanationFr: 'Cette commande n\'existe pas dans DNF.'
      },
      {
        id: 'opt-4',
        label: 'Il faut réinstaller le système d\'exploitation pour purger les dépendances',
        labelFr: 'Il faut réinstaller le système d\'exploitation pour purger les dépendances',
        isCorrect: false,
        explanation: 'dnf autoremove est spécialement conçu pour cette tâche.',
        explanationFr: 'dnf autoremove est spécialement conçu pour cette tâche.'
      }
    ],
    correctedSnippet: `dnf autoremove`,
    fixExplanation: '"dnf autoremove" libère l\'espace disque en supprimant les paquets orphelins en toute sécurité.',
    fixExplanationFr: '"dnf autoremove" libère l\'espace disque en supprimant les paquets orphelins en toute sécurité.'
  },
  {
    id: 'tb-lpic1-102-12',
    title: 'Simulation d\'installation de paquet avec apt-get -s',
    titleFr: 'Simuler une installation de paquet sans rien modifier sur le disque',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Installation & Package Management',
    scenario: 'Un technicien veut tester si l\'installation d\'un paquet complexe risque de désinstaller des composants de production, sans rien écrire sur le disque.',
    scenarioFr: 'Un technicien veut tester si l\'installation d\'un paquet complexe risque de désinstaller des composants de production, sans rien écrire sur le disque.',
    codeSnippet: `root@srv:~# apt-get --dry-run-only install monpaquet
E: Command line option --dry-run-only is not understood in combination with the other options`,
    language: 'bash',
    bugDescription: 'L\'option officielle de simulation dans apt-get est "-s" (ou "--simulate" ou "--dry-run").',
    bugDescriptionFr: 'L\'option officielle de simulation dans apt-get est "-s" (ou "--simulate" ou "--dry-run").',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "apt-get -s install monpaquet" (ou "--simulate") pour réaliser une simulation complète sans modifier le système',
        labelFr: 'Utiliser "apt-get -s install monpaquet" (ou "--simulate") pour réaliser une simulation complète sans modifier le système',
        isCorrect: true,
        explanation: 'L\'option "-s" simule l\'exécution en affichant les paquets qui seraient installés, mis à jour ou supprimés sans toucher au disque ni nécessiter les droits root.',
        explanationFr: 'L\'option "-s" simule l\'exécution en affichant les paquets qui seraient installés, mis à jour ou supprimés sans toucher au disque ni nécessiter les droits root.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser apt-get install monpaquet --fake',
        labelFr: 'Utiliser apt-get install monpaquet --fake',
        isCorrect: false,
        explanation: '--fake n\'est pas une option valide.',
        explanationFr: '--fake n\'est pas une option valide.'
      },
      {
        id: 'opt-3',
        label: 'Il faut monter / en lecture seule avant d\'installer',
        labelFr: 'Il faut monter / en lecture seule avant d\'installer',
        isCorrect: false,
        explanation: 'apt-get échouerait avec une erreur d\'écriture de verrou.',
        explanationFr: 'apt-get échouerait avec une erreur d\'écriture de verrou.'
      },
      {
        id: 'opt-4',
        label: 'apt ne supporte pas de mode simulation',
        labelFr: 'apt ne supporte pas de mode simulation',
        isCorrect: false,
        explanation: 'Le mode simulation "-s" est l\'un des drapeaux les plus testés à l\'examen LPIC-1.',
        explanationFr: 'Le mode simulation "-s" est l\'un des drapeaux les plus testés à l\'examen LPIC-1.'
      }
    ],
    correctedSnippet: `apt-get -s install monpaquet`,
    fixExplanation: '"apt-get -s" simule précisément les opérations prévues sans aucun risque pour le système.',
    fixExplanationFr: '"apt-get -s" simule précisément les opérations prévues sans aucun risque pour le système.'
  },
  {
    id: 'tb-lpic1-102-13',
    title: 'Recherche de paquet contenant une commande sous Debian avec apt-file',
    titleFr: 'Trouver le paquet Debian fournissant une commande absente avec apt-file',
    certification: 'lpic-1',
    topicNumber: 102,
    objectiveId: '102.4',
    category: 'Installation & Package Management',
    scenario: 'L\'administrateur cherche quel paquet installer pour disposer de la commande "/usr/bin/dig". La commande "dpkg -S /usr/bin/dig" ne renvoie rien car le paquet n\'est pas encore installé.',
    scenarioFr: 'L\'administrateur cherche quel paquet installer pour disposer de la commande "/usr/bin/dig". La commande "dpkg -S /usr/bin/dig" ne renvoie rien car le paquet n\'est pas encore installé.',
    codeSnippet: `root@srv:~# dpkg -S /usr/bin/dig
dpkg-query: no path found matching pattern /usr/bin/dig`,
    language: 'bash',
    bugDescription: '"dpkg -S" ne cherche que parmi les paquets déjà installés localement. Pour chercher dans l\'ensemble des paquets des dépôts distants, l\'outil requis sous Debian est "apt-file search".',
    bugDescriptionFr: '"dpkg -S" ne cherche que parmi les paquets déjà installés localement. Pour chercher dans l\'ensemble des paquets des dépôts distants, l\'outil requis sous Debian est "apt-file search".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "apt-file search /usr/bin/dig" (ou apt-file search bin/dig) pour chercher dans l\'index global des paquets disponibles',
        labelFr: 'Utiliser "apt-file search /usr/bin/dig" (ou apt-file search bin/dig) pour chercher dans l\'index global des paquets disponibles',
        isCorrect: true,
        explanation: '"apt-file" maintient un index de l\'intégralité des fichiers de tous les paquets disponibles dans les dépôts (équivalent de yum/dnf provides).',
        explanationFr: '"apt-file" maintient un index de l\'intégralité des fichiers de tous les paquets disponibles dans les dépôts (équivalent de yum/dnf provides).'
      },
      {
        id: 'opt-2',
        label: 'Utiliser apt-get search /usr/bin/dig',
        labelFr: 'Utiliser apt-get search /usr/bin/dig',
        isCorrect: false,
        explanation: 'apt-cache search ne cherche que dans les noms de paquets et descriptions, pas dans les chemins de fichiers internes.',
        explanationFr: 'apt-cache search ne cherche que dans les noms de paquets et descriptions, pas dans les chemins de fichiers internes.'
      },
      {
        id: 'opt-3',
        label: 'Utiliser find / -name dig',
        labelFr: 'Utiliser find / -name dig',
        isCorrect: false,
        explanation: 'find ne cherche que sur le système de fichiers local ; si le paquet n\'est pas installé, il ne trouvera rien.',
        explanationFr: 'find ne cherche que sur le système de fichiers local ; si le paquet n\'est pas installé, il ne trouvera rien.'
      },
      {
        id: 'opt-4',
        label: 'Il faut obligatoirement installer tous les paquets du dépôt pour savoir',
        labelFr: 'Il faut obligatoirement installer tous les paquets du dépôt pour savoir',
        isCorrect: false,
        explanation: 'apt-file indexe les métadonnées Contents des dépôts sans rien installer.',
        explanationFr: 'apt-file indexe les métadonnées Contents des dépôts sans rien installer.'
      }
    ],
    correctedSnippet: `root@srv:~# apt-file update
root@srv:~# apt-file search /usr/bin/dig
bind9-dnsutils: /usr/bin/dig`,
    fixExplanation: '"apt-file search" identifie immédiatement que la commande dig provient du paquet bind9-dnsutils.',
    fixExplanationFr: '"apt-file search" identifie immédiatement que la commande dig provient du paquet bind9-dnsutils.'
  }
];
