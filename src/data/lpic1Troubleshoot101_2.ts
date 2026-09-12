import { TroubleshootingChallenge } from '../types';

export const lpic1Troubleshoot101_2: TroubleshootingChallenge[] = [
  // ==========================================
  // TOPIC 103: GNU AND UNIX COMMANDS (103.1 - 103.8) [13 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-103-01',
    title: 'Boucle infinie avec redirection de sortie vers le fichier d\'entrée',
    titleFr: 'Tronquage immédiat d\'un fichier lors d\'une redirection directe sur lui-même',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.4',
    category: 'GNU & Unix Commands',
    scenario: 'Pour trier un fichier volumineux de logs, un opérateur exécute "sort data.log > data.log". À la fin de la commande, le fichier data.log est totalement vide (0 octet).',
    scenarioFr: 'Pour trier un fichier volumineux de logs, un opérateur exécute "sort data.log > data.log". À la fin de la commande, le fichier data.log est totalement vide (0 octet).',
    codeSnippet: `user@srv:~$ ls -l data.log
-rw-r--r-- 1 user user 4502010 Oct 12 11:00 data.log
user@srv:~$ sort data.log > data.log
user@srv:~$ ls -l data.log
-rw-r--r-- 1 user user 0 Oct 12 11:01 data.log`,
    language: 'bash',
    bugDescription: 'Le shell ouvre et tronque à zéro octet le fichier cible de la redirection ">" avant même que sort ne commence à le lire.',
    bugDescriptionFr: 'Le shell ouvre et tronque à zéro octet le fichier cible de la redirection ">" avant même que sort ne commence à le lire.',
    options: [
      {
        id: 'opt-1',
        label: 'Le shell tronque la cible de redirection ">" avant d\'exécuter le programme ; il faut utiliser l\'option "-o data.log" de sort ou un fichier temporaire',
        labelFr: 'Le shell tronque la cible de redirection ">" avant d\'exécuter le programme ; il faut utiliser l\'option "-o data.log" de sort ou un fichier temporaire',
        isCorrect: true,
        explanation: 'Dans l\'ordre d\'évaluation POSIX, les redirections sont configurées avant le fork/exec du binaire. L\'option "-o" de sort lit tout en mémoire avant d\'écrire.',
        explanationFr: 'Dans l\'ordre d\'évaluation POSIX, les redirections sont configurées avant le fork/exec du binaire. L\'option "-o" de sort lit tout en mémoire avant d\'écrire.'
      },
      {
        id: 'opt-2',
        label: 'sort ne sait pas trier les fichiers de plus de 1 Mo',
        labelFr: 'sort ne sait pas trier les fichiers de plus de 1 Mo',
        isCorrect: false,
        explanation: 'sort gère des fichiers de plusieurs gigaoctets avec pagination temporaire sur disque.',
        explanationFr: 'sort gère des fichiers de plusieurs gigaoctets avec pagination temporaire sur disque.'
      },
      {
        id: 'opt-3',
        label: 'Il fallait utiliser la double redirection ">>"',
        labelFr: 'Il fallait utiliser la double redirection ">>"',
        isCorrect: false,
        explanation: '">> data.log" produirait une boucle infinie de lecture-écriture qui saturerait le disque.',
        explanationFr: '">> data.log" produirait une boucle infinie de lecture-écriture qui saturerait le disque.'
      },
      {
        id: 'opt-4',
        label: 'Le système de fichiers a corrompu l\'inode',
        labelFr: 'Le système de fichiers a corrompu l\'inode',
        isCorrect: false,
        explanation: 'C\'est le comportement standard prévisible de l\'ouverture en mode O_TRUNC par le shell.',
        explanationFr: 'C\'est le comportement standard prévisible de l\'ouverture en mode O_TRUNC par le shell.'
      }
    ],
    correctedSnippet: `sort -o data.log data.log
# ou :
sort data.log > data.log.tmp && mv data.log.tmp data.log`,
    fixExplanation: 'Utiliser "sort -o" ou un fichier temporaire intermédiaire protège le fichier source contre le tronquage prématuré.',
    fixExplanationFr: 'Utiliser "sort -o" ou un fichier temporaire intermédiaire protège le fichier source contre le tronquage prématuré.'
  },
  {
    id: 'tb-lpic1-103-02',
    title: 'Redirection des erreurs standard (stderr) vers un fichier',
    titleFr: 'Stderr non capturé dans le fichier de log et polluant le terminal',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.4',
    category: 'GNU & Unix Commands',
    scenario: 'Un script de sauvegarde nocturne lance "backup.sh > backup.log". Au petit matin, les messages d\'erreur sont apparus sur le terminal et ne figurent pas dans backup.log.',
    scenarioFr: 'Un script de sauvegarde nocturne lance "backup.sh > backup.log". Au petit matin, les messages d\'erreur sont apparus sur le terminal et ne figurent pas dans backup.log.',
    codeSnippet: `user@srv:~$ backup.sh > backup.log
tar: /home/secret: Permission denied
tar: Error is not recoverable: exiting now
user@srv:~$ cat backup.log
# backup.log ne contient aucun message d'erreur !`,
    language: 'bash',
    bugDescription: 'La redirection ">" ne redirige que stdout (descripteur 1). Les erreurs sont envoyées sur stderr (descripteur 2).',
    bugDescriptionFr: 'La redirection ">" ne redirige que stdout (descripteur 1). Les erreurs sont envoyées sur stderr (descripteur 2).',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut rediriger le descripteur 2 vers le descripteur 1 avec "2>&1" (ou utiliser "&>" sous Bash)',
        labelFr: 'Il faut rediriger le descripteur 2 vers le descripteur 1 avec "2>&1" (ou utiliser "&>" sous Bash)',
        isCorrect: true,
        explanation: '">" équivaut à "1>". Pour regrouper les erreurs et la sortie normale dans le même fichier, on ajoute "2>&1" à la fin.',
        explanationFr: '">" équivaut à "1>". Pour regrouper les erreurs et la sortie normale dans le même fichier, on ajoute "2>&1" à la fin.'
      },
      {
        id: 'opt-2',
        label: 'Il faut lancer le script avec "bash -e"',
        labelFr: 'Il faut lancer le script avec "bash -e"',
        isCorrect: false,
        explanation: 'bash -e quitte le script dès la première erreur sans rediriger les flux.',
        explanationFr: 'bash -e quitte le script dès la première erreur sans rediriger les flux.'
      },
      {
        id: 'opt-3',
        label: 'tar n\'écrit pas sur stderr',
        labelFr: 'tar n\'écrit pas sur stderr',
        isCorrect: false,
        explanation: 'Tous les messages d\'erreur de tar sont dirigés vers le descripteur 2 (stderr).',
        explanationFr: 'Tous les messages d\'erreur de tar sont dirigés vers le descripteur 2 (stderr).'
      },
      {
        id: 'opt-4',
        label: 'Il faut changer les droits de backup.log avec chmod 777',
        labelFr: 'Il faut changer les droits de backup.log avec chmod 777',
        isCorrect: false,
        explanation: 'Le fichier log est déjà accessible en écriture pour stdout.',
        explanationFr: 'Le fichier log est déjà accessible en écriture pour stdout.'
      }
    ],
    correctedSnippet: `backup.sh > backup.log 2>&1
# ou sous Bash :
backup.sh &> backup.log`,
    fixExplanation: 'La syntaxe "> fichier 2>&1" capture stdout et stderr dans le même fichier journal.',
    fixExplanationFr: 'La syntaxe "> fichier 2>&1" capture stdout et stderr dans le même fichier journal.'
  },
  {
    id: 'tb-lpic1-103-03',
    title: 'Processus en arrière-plan stoppé à la fermeture du terminal SSH',
    titleFr: 'Processus interrompu lors de la déconnexion par le signal SIGHUP',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.5',
    category: 'GNU & Unix Commands',
    scenario: 'Un administrateur lance une longue compression avec "tar -czf archive.tar.gz /data &". Dès qu\'il ferme sa session SSH, la compression s\'arrête immédiatement.',
    scenarioFr: 'Un administrateur lance une longue compression avec "tar -czf archive.tar.gz /data &". Dès qu\'il ferme sa session SSH, la compression s\'arrête immédiatement.',
    codeSnippet: `user@srv:~$ tar -czf archive.tar.gz /data &
[1] 4821
user@srv:~$ exit
logout
Connection to 192.168.1.10 closed.
# Plus tard en se reconnectant :
user@srv:~$ ps -ef | grep tar
# Le processus a disparu !`,
    language: 'bash',
    bugDescription: 'La fermeture du shell envoie le signal SIGHUP (signal 1) à tous les processus fils du terminal.',
    bugDescriptionFr: 'La fermeture du shell envoie le signal SIGHUP (signal 1) à tous les processus fils du terminal.',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut immuniser le processus contre le signal SIGHUP avec "nohup", "disown" ou utiliser un multiplexeur de terminal comme "tmux" ou "screen"',
        labelFr: 'Il faut immuniser le processus contre le signal SIGHUP avec "nohup", "disown" ou utiliser un multiplexeur de terminal comme "tmux" ou "screen"',
        isCorrect: true,
        explanation: 'À la fermeture de la session pty, le noyau transmet SIGHUP (Hangup) aux jobs. "nohup" intercepte et ignore ce signal.',
        explanationFr: 'À la fermeture de la session pty, le noyau transmet SIGHUP (Hangup) aux jobs. "nohup" intercepte et ignore ce signal.'
      },
      {
        id: 'opt-2',
        label: 'Il fallait mettre deux esperluettes "&&" à la fin',
        labelFr: 'Il fallait mettre deux esperluettes "&&" à la fin',
        isCorrect: false,
        explanation: '&& est un opérateur logique conditionnel, pas un modificateur d\'arrière-plan.',
        explanationFr: '&& est un opérateur logique conditionnel, pas un modificateur d\'arrière-plan.'
      },
      {
        id: 'opt-3',
        label: 'Le processus manquait de mémoire vive',
        labelFr: 'Le processus manquait de mémoire vive',
        isCorrect: false,
        explanation: 'L\'interruption coïncide exactement avec la déconnexion SSH (SIGHUP).',
        explanationFr: 'L\'interruption coïncide exactement avec la déconnexion SSH (SIGHUP).'
      },
      {
        id: 'opt-4',
        label: 'tar refuse d\'écrire sans tty actif',
        labelFr: 'tar refuse d\'écrire sans tty actif',
        isCorrect: false,
        explanation: 'tar fonctionne parfaitement sans terminal.',
        explanationFr: 'tar fonctionne parfaitement sans terminal.'
      }
    ],
    correctedSnippet: `nohup tar -czf archive.tar.gz /data > tar.log 2>&1 &
# ou avec disown :
tar -czf archive.tar.gz /data &
disown -h %1`,
    fixExplanation: '"nohup" protège la commande contre la terminaison au départ du terminal hôte.',
    fixExplanationFr: '"nohup" protège la commande contre la terminaison au départ du terminal hôte.'
  },
  {
    id: 'tb-lpic1-103-04',
    title: 'Suppression accidentelle évitée grâce aux métacaractères globbing et xargs',
    titleFr: 'Argument list too long lors d\'une commande rm avec rm *',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.3',
    category: 'GNU & Unix Commands',
    scenario: 'Dans un répertoire contenant 300 000 fichiers de sessions web, l\'administrateur tape "rm *". Le shell renvoie "bash: /usr/bin/rm: Argument list too long".',
    scenarioFr: 'Dans un répertoire contenant 300 000 fichiers de sessions web, l\'administrateur tape "rm *". Le shell renvoie "bash: /usr/bin/rm: Argument list too long".',
    codeSnippet: `root@srv:/var/sessions# rm *
bash: /usr/bin/rm: Argument list too long`,
    language: 'bash',
    bugDescription: 'L\'expansion de "*" dépasse la limite de taille des arguments noyau (ARG_MAX). Il faut passer par "find ... -delete" ou "xargs".',
    bugDescriptionFr: 'L\'expansion de "*" dépasse la limite de taille des arguments noyau (ARG_MAX). Il faut passer par "find ... -delete" ou "xargs".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "find . -type f -delete" ou "find . -type f -print0 | xargs -0 rm" pour découper le traitement en lots adaptés à ARG_MAX',
        labelFr: 'Utiliser "find . -type f -delete" ou "find . -type f -print0 | xargs -0 rm" pour découper le traitement en lots adaptés à ARG_MAX',
        isCorrect: true,
        explanation: 'Le noyau impose une limite stricte (ARG_MAX) sur la ligne de commande développée. "find -delete" traite les entrées une par une sans passer par l\'expansion du shell.',
        explanationFr: 'Le noyau impose une limite stricte (ARG_MAX) sur la ligne de commande développée. "find -delete" traite les entrées une par une sans passer par l\'expansion du shell.'
      },
      {
        id: 'opt-2',
        label: 'Augmenter la RAM de la machine pour autoriser le shell',
        labelFr: 'Augmenter la RAM de la machine pour autoriser le shell',
        isCorrect: false,
        explanation: 'ARG_MAX est une constante noyau indépendante de la mémoire physique disponible.',
        explanationFr: 'ARG_MAX est une constante noyau indépendante de la mémoire physique disponible.'
      },
      {
        id: 'opt-3',
        label: 'Taper "rm -f *"',
        labelFr: 'Taper "rm -f *"',
        isCorrect: false,
        explanation: 'L\'expansion de "*" intervient avant que rm ne soit appelé, donc "-f" n\'évite pas l\'erreur.',
        explanationFr: 'L\'expansion de "*" intervient avant que rm ne soit appelé, donc "-f" n\'évite pas l\'erreur.'
      },
      {
        id: 'opt-4',
        label: 'Changer de shell et utiliser sh à la place de bash',
        labelFr: 'Changer de shell et utiliser sh à la place de bash',
        isCorrect: false,
        explanation: 'La limite est imposée par l\'appel système execve() du noyau, pas par le shell.',
        explanationFr: 'La limite est imposée par l\'appel système execve() du noyau, pas par le shell.'
      }
    ],
    correctedSnippet: `find /var/sessions -type f -delete
# ou :
find /var/sessions -type f -print0 | xargs -0 rm -f`,
    fixExplanation: '"find -delete" supprime directement chaque fichier sans expansion de chaîne dans le shell.',
    fixExplanationFr: '"find -delete" supprime directement chaque fichier sans expansion de chaîne dans le shell.'
  },
  {
    id: 'tb-lpic1-103-05',
    title: 'Priorité d\'un processus et commande renice pour un utilisateur non root',
    titleFr: 'Échec de renice : Permission denied lors de l\'augmentation de priorité',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.6',
    category: 'GNU & Unix Commands',
    scenario: 'L\'utilisateur standard "alice" tente d\'accélérer son calcul mathématique (PID 3421, nice actuel 0) avec "renice -n -5 -p 3421". La commande échoue avec "renice: failed to set priority for 3421: Permission denied".',
    scenarioFr: 'L\'utilisateur standard "alice" tente d\'accélérer son calcul mathématique (PID 3421, nice actuel 0) avec "renice -n -5 -p 3421". La commande échoue avec "renice: failed to set priority for 3421: Permission denied".',
    codeSnippet: `alice@srv:~$ renice -n -5 -p 3421
renice: failed to set priority for 3421 (process ID): Permission denied`,
    language: 'bash',
    bugDescription: 'Seul le superutilisateur root peut attribuer des valeurs de nice négatives (priorité plus élevée). Les utilisateurs ordinaires ne peuvent qu\'augmenter la valeur nice (rendre le processus plus courtois).',
    bugDescriptionFr: 'Seul le superutilisateur root peut attribuer des valeurs de nice négatives (priorité plus élevée). Les utilisateurs ordinaires ne peuvent qu\'augmenter la valeur nice (rendre le processus plus courtois).',
    options: [
      {
        id: 'opt-1',
        label: 'Un utilisateur non-root ne peut pas abaisser la valeur de nice (priorité plus haute / valeurs négatives) ; seuls les privilèges root (sudo) le permettent',
        labelFr: 'Un utilisateur non-root ne peut pas abaisser la valeur de nice (priorité plus haute / valeurs négatives) ; seuls les privilèges root (sudo) le permettent',
        isCorrect: true,
        explanation: 'Sur Linux, les valeurs de nice vont de -20 (priorité max) à 19 (priorité min). Un utilisateur normal ne peut que rendre ses processus plus "gentils" (nice > 0).',
        explanationFr: 'Sur Linux, les valeurs de nice vont de -20 (priorité max) à 19 (priorité min). Un utilisateur normal ne peut que rendre ses processus plus "gentils" (nice > 0).'
      },
      {
        id: 'opt-2',
        label: 'L\'option "-p" doit être placée avant "-n"',
        labelFr: 'L\'option "-p" doit être placée avant "-n"',
        isCorrect: false,
        explanation: 'L\'ordre des options n\'est pas la cause de l\'erreur "Permission denied".',
        explanationFr: 'L\'ordre des options n\'est pas la cause de l\'erreur "Permission denied".'
      },
      {
        id: 'opt-3',
        label: 'renice ne fonctionne que sur les processus arrêtés avec SIGSTOP',
        labelFr: 'renice ne fonctionne que sur les processus arrêtés avec SIGSTOP',
        isCorrect: false,
        explanation: 'renice ajuste dynamiquement la priorité des processus en cours d\'exécution.',
        explanationFr: 'renice ajuste dynamiquement la priorité des processus en cours d\'exécution.'
      },
      {
        id: 'opt-4',
        label: 'La valeur -5 n\'est pas comprise dans la plage de nice',
        labelFr: 'La valeur -5 n\'est pas comprise dans la plage de nice',
        isCorrect: false,
        explanation: '-5 est une valeur parfaitement valide (plage de -20 à 19).',
        explanationFr: '-5 est une valeur parfaitement valide (plage de -20 à 19).'
      }
    ],
    correctedSnippet: `sudo renice -n -5 -p 3421
# ou si l'utilisateur veut céder de la priorité sans sudo :
renice -n 10 -p 3421`,
    fixExplanation: 'L\'utilisation de sudo est indispensable pour accorder une priorité négative (favorable) à un processus.',
    fixExplanationFr: 'L\'utilisation de sudo est indispensable pour accorder une priorité négative (favorable) à un processus.'
  },
  {
    id: 'tb-lpic1-103-06',
    title: 'Extraction de colonnes avec cut et séparateur de champ délimiteur',
    titleFr: 'cut -d renvoie la ligne entière en l\'absence du séparateur spécifié',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.2',
    category: 'GNU & Unix Commands',
    scenario: 'L\'opérateur veut extraire les utilisateurs et shells dans /etc/passwd en utilisant cut avec tabulation par défaut : "cut -f 1,7 /etc/passwd". La commande recrache le fichier entier sans rien couper.',
    scenarioFr: 'L\'opérateur veut extraire les utilisateurs et shells dans /etc/passwd en utilisant cut avec tabulation par défaut : "cut -f 1,7 /etc/passwd". La commande recrache le fichier entier sans rien couper.',
    codeSnippet: `user@srv:~$ cut -f 1,7 /etc/passwd | head -n 3
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin`,
    language: 'bash',
    bugDescription: 'Par défaut, le délimiteur de cut est le caractère tabulation ("\\t"). Dans /etc/passwd, le séparateur est deux-points (":"), il faut donc "-d:".',
    bugDescriptionFr: 'Par défaut, le délimiteur de cut est le caractère tabulation ("\\t"). Dans /etc/passwd, le séparateur est deux-points (":"), il faut donc "-d:".',
    options: [
      {
        id: 'opt-1',
        label: 'Spécifier le délimiteur deux-points avec l\'option "-d :"',
        labelFr: 'Spécifier le délimiteur deux-points avec l\'option "-d :"',
        isCorrect: true,
        explanation: 'En l\'absence de tabulation, cut affiche la ligne entière sauf si "-s" est utilisé. "-d:" définit le bon délimiteur.',
        explanationFr: 'En l\'absence de tabulation, cut affiche la ligne entière sauf si "-s" est utilisé. "-d:" définit le bon délimiteur.'
      },
      {
        id: 'opt-2',
        label: 'cut est incapable de traiter les fichiers système protégés',
        labelFr: 'cut est incapable de traiter les fichiers système protégés',
        isCorrect: false,
        explanation: '/etc/passwd est lisible par tous les utilisateurs du système.',
        explanationFr: '/etc/passwd est lisible par tous les utilisateurs du système.'
      },
      {
        id: 'opt-3',
        label: 'Il faut utiliser l\'option -c à la place de -f',
        labelFr: 'Il faut utiliser l\'option -c à la place de -f',
        isCorrect: false,
        explanation: '-c extrait des positions de caractères fixes, inadapté ici car les noms ont des longueurs variables.',
        explanationFr: '-c extrait des positions de caractères fixes, inadapté ici car les noms ont des longueurs variables.'
      },
      {
        id: 'opt-4',
        label: 'cut ne peut extraire qu\'un seul champ à la fois',
        labelFr: 'cut ne peut extraire qu\'un seul champ à la fois',
        isCorrect: false,
        explanation: 'La syntaxe "-f 1,7" ou "-f 1-3" est conforme et supportée.',
        explanationFr: 'La syntaxe "-f 1,7" ou "-f 1-3" est conforme et supportée.'
      }
    ],
    correctedSnippet: `cut -d: -f 1,7 /etc/passwd | head -n 3
root:/bin/bash
daemon:/usr/sbin/nologin
bin:/usr/sbin/nologin`,
    fixExplanation: 'Définir explicitement "-d:" permet à cut d\'isoler les champs séparés par des deux-points.',
    fixExplanationFr: 'Définir explicitement "-d:" permet à cut d\'isoler les champs séparés par des deux-points.'
  },
  {
    id: 'tb-lpic1-103-07',
    title: 'Substitution globale de texte dans sed avec le drapeau /g',
    titleFr: 'sed remplace uniquement la première occurrence de chaque ligne sans le flag "g"',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.2',
    category: 'GNU & Unix Commands',
    scenario: 'Pour anonymiser un fichier texte, un analyste remplace "192.168.1" par "10.0.0" avec "sed \'s/192.168.1/10.0.0/\'". Quand une ligne contient deux adresses IP, seule la première est remplacée.',
    scenarioFr: 'Pour anonymiser un fichier texte, un analyste remplace "192.168.1" par "10.0.0" avec "sed \'s/192.168.1/10.0.0/\'". Quand une ligne contient deux adresses IP, seule la première est remplacée.',
    codeSnippet: `user@srv:~$ echo "Src: 192.168.1.5 Dst: 192.168.1.9" | sed 's/192.168.1/10.0.0/'
Src: 10.0.0.5 Dst: 192.168.1.9`,
    language: 'bash',
    bugDescription: 'Sans le modificateur "g" (global) à la fin de l\'instruction de substitution "s/.../.../g", sed ne modifie que la première correspondance par ligne.',
    bugDescriptionFr: 'Sans le modificateur "g" (global) à la fin de l\'instruction de substitution "s/.../.../g", sed ne modifie que la première correspondance par ligne.',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter le drapeau "g" à la fin de la commande sed : "s/192.168.1/10.0.0/g"',
        labelFr: 'Ajouter le drapeau "g" à la fin de la commande sed : "s/192.168.1/10.0.0/g"',
        isCorrect: true,
        explanation: 'Par défaut, sed applique la substitution une seule fois par ligne. Le flag "g" étend la substitution à toutes les occurrences de la ligne.',
        explanationFr: 'Par défaut, sed applique la substitution une seule fois par ligne. Le flag "g" étend la substitution à toutes les occurrences de la ligne.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser l\'option sed -i',
        labelFr: 'Utiliser l\'option sed -i',
        isCorrect: false,
        explanation: '-i modifie le fichier sur place mais ne change rien au nombre d\'occurrences par ligne.',
        explanationFr: '-i modifie le fichier sur place mais ne change rien au nombre d\'occurrences par ligne.'
      },
      {
        id: 'opt-3',
        label: 'sed ne peut pas traiter deux adresses IP',
        labelFr: 'sed ne peut pas traiter deux adresses IP',
        isCorrect: false,
        explanation: 'sed traite sans restriction n\'importe quelle chaîne de caractères.',
        explanationFr: 'sed traite sans restriction n\'importe quelle chaîne de caractères.'
      },
      {
        id: 'opt-4',
        label: 'Il faut lancer sed deux fois de suite',
        labelFr: 'Il faut lancer sed deux fois de suite',
        isCorrect: false,
        explanation: 'Le flag standard "g" effectue le remplacement complet en une seule passe.',
        explanationFr: 'Le flag standard "g" effectue le remplacement complet en une seule passe.'
      }
    ],
    correctedSnippet: `echo "Src: 192.168.1.5 Dst: 192.168.1.9" | sed 's/192.168.1/10.0.0/g'
Src: 10.0.0.5 Dst: 10.0.0.9`,
    fixExplanation: 'Le suffixe "g" active le remplacement global sur l\'intégralité de chaque ligne.',
    fixExplanationFr: 'Le suffixe "g" active le remplacement global sur l\'intégralité de chaque ligne.'
  },
  {
    id: 'tb-lpic1-103-08',
    title: 'Extraction d\'une archive tar compressée en xz avec l\'option appropriée',
    titleFr: 'Décompression d\'une archive .tar.xz avec tar',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.3',
    category: 'GNU & Unix Commands',
    scenario: 'L\'administrateur essaie d\'extraire une archive "system.tar.xz" avec "tar -xvzf system.tar.xz". La commande échoue avec "gzip: stdin: not in gzip format".',
    scenarioFr: 'L\'administrateur essaie d\'extraire une archive "system.tar.xz" avec "tar -xvzf system.tar.xz". La commande échoue avec "gzip: stdin: not in gzip format".',
    codeSnippet: `user@srv:~$ tar -xvzf system.tar.xz
gzip: stdin: not in gzip format
tar: Child returned status 1
tar: Error is not recoverable: exiting now`,
    language: 'bash',
    bugDescription: 'L\'option "-z" filtre l\'archive avec gzip. Pour une archive compressée avec xz, l\'option correspondante dans tar est "-J" (ou laisser tar détecter automatiquement sans option de compresseur).',
    bugDescriptionFr: 'L\'option "-z" filtre l\'archive avec gzip. Pour une archive compressée avec xz, l\'option correspondante dans tar est "-J" (ou laisser tar détecter automatiquement sans option de compresseur).',
    options: [
      {
        id: 'opt-1',
        label: 'Remplacer "-z" par "-J" pour le format xz (tar -xvJf system.tar.xz) ou simplement "tar -xvf system.tar.xz"',
        labelFr: 'Remplacer "-z" par "-J" pour le format xz (tar -xvJf system.tar.xz) ou simplement "tar -xvf system.tar.xz"',
        isCorrect: true,
        explanation: 'En LPIC-1 : -z = gzip, -j = bzip2, -J = xz. L\'option -z échoue sur un flux xz.',
        explanationFr: 'En LPIC-1 : -z = gzip, -j = bzip2, -J = xz. L\'option -z échoue sur un flux xz.'
      },
      {
        id: 'opt-2',
        label: 'Renommer le fichier en .tar.gz pour forcer la lecture gzip',
        labelFr: 'Renommer le fichier en .tar.gz pour forcer la lecture gzip',
        isCorrect: false,
        explanation: 'Renommer l\'extension ne change pas l\'en-tête binaire xz (magic bytes).',
        explanationFr: 'Renommer l\'extension ne change pas l\'en-tête binaire xz (magic bytes).'
      },
      {
        id: 'opt-3',
        label: 'Utiliser unzip system.tar.xz',
        labelFr: 'Utiliser unzip system.tar.xz',
        isCorrect: false,
        explanation: 'unzip ne gère que les archives .zip (format PKZIP).',
        explanationFr: 'unzip ne gère que les archives .zip (format PKZIP).'
      },
      {
        id: 'opt-4',
        label: 'tar ne sait pas gérer les fichiers xz',
        labelFr: 'tar ne sait pas gérer les fichiers xz',
        isCorrect: false,
        explanation: 'GNU tar intègre le support de xz via le drapeau -J.',
        explanationFr: 'GNU tar intègre le support de xz via le drapeau -J.'
      }
    ],
    correctedSnippet: `tar -xvJf system.tar.xz
# ou directement :
tar -xvf system.tar.xz`,
    fixExplanation: 'L\'option "-J" appelle le décompresseur xz approprié.',
    fixExplanationFr: 'L\'option "-J" appelle le décompresseur xz approprié.'
  },
  {
    id: 'tb-lpic1-103-09',
    title: 'Recherche récursive insensible à la casse avec grep',
    titleFr: 'Options grep pour recherche insensible à la casse et récursive (-ri)',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.7',
    category: 'GNU & Unix Commands',
    scenario: 'L\'administrateur recherche la chaîne "database_password" dans tous les fichiers de /etc/ sans tenir compte des majuscules/minuscules, mais sa commande "grep database_password /etc" affiche "grep: /etc: Is a directory".',
    scenarioFr: 'L\'administrateur recherche la chaîne "database_password" dans tous les fichiers de /etc/ sans tenir compte des majuscules/minuscules, mais sa commande "grep database_password /etc" affiche "grep: /etc: Is a directory".',
    codeSnippet: `root@srv:~# grep database_password /etc
grep: /etc: Is a directory`,
    language: 'bash',
    bugDescription: 'grep requiert "-r" (ou -R) pour parcourir récursivement les sous-répertoires et "-i" pour ignorer la casse.',
    bugDescriptionFr: 'grep requiert "-r" (ou -R) pour parcourir récursivement les sous-répertoires et "-i" pour ignorer la casse.',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "grep -ri database_password /etc" (-r récursif, -i insensible à la casse)',
        labelFr: 'Utiliser "grep -ri database_password /etc" (-r récursif, -i insensible à la casse)',
        isCorrect: true,
        explanation: 'Sans "-r", grep refuse d\'ouvrir un répertoire. "-i" ignore la différence entre majuscules et minuscules.',
        explanationFr: 'Sans "-r", grep refuse d\'ouvrir un répertoire. "-i" ignore la différence entre majuscules et minuscules.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser "grep -d /etc database_password"',
        labelFr: 'Utiliser "grep -d /etc database_password"',
        isCorrect: false,
        explanation: '-d définit l\'action pour les répertoires (read, skip, recurse), la syntaxe standard est -r.',
        explanationFr: '-d définit l\'action pour les répertoires (read, skip, recurse), la syntaxe standard est -r.'
      },
      {
        id: 'opt-3',
        label: 'grep est incapable de lire des répertoires',
        labelFr: 'grep est incapable de lire des répertoires',
        isCorrect: false,
        explanation: 'Avec "-r", grep parcourt toute l\'arborescence de répertoires.',
        explanationFr: 'Avec "-r", grep parcourt toute l\'arborescence de répertoires.'
      },
      {
        id: 'opt-4',
        label: 'Il faut obligatoirement taper fgrep',
        labelFr: 'Il faut obligatoirement taper fgrep',
        isCorrect: false,
        explanation: 'fgrep traite les chaînes fixes mais ne résout pas à lui seul la récursion dans les répertoires.',
        explanationFr: 'fgrep traite les chaînes fixes mais ne résout pas à lui seul la récursion dans les répertoires.'
      }
    ],
    correctedSnippet: `grep -ri "database_password" /etc/`,
    fixExplanation: '"grep -ri" combine la descente récursive dans les dossiers et l\'insensibilité à la casse.',
    fixExplanationFr: '"grep -ri" combine la descente récursive dans les dossiers et l\'insensibilité à la casse.'
  },
  {
    id: 'tb-lpic1-103-10',
    title: 'Commande tee et conservation de contenu avec -a (append)',
    titleFr: 'tee écrase le fichier au lieu d\'ajouter à la suite',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.4',
    category: 'GNU & Unix Commands',
    scenario: 'Un script écrit dans un log en temps réel via "echo message | tee log.txt". Le fichier log.txt ne contient que la toute dernière ligne car chaque exécution efface le contenu précédent.',
    scenarioFr: 'Un script écrit dans un log en temps réel via "echo message | tee log.txt". Le fichier log.txt ne contient que la toute dernière ligne car chaque exécution efface le contenu précédent.',
    codeSnippet: `user@srv:~$ echo "Test 1" | tee log.txt
Test 1
user@srv:~$ echo "Test 2" | tee log.txt
Test 2
user@srv:~$ cat log.txt
Test 2`,
    language: 'bash',
    bugDescription: 'Par défaut, tee écrase le fichier cible. Pour ajouter à la fin (append), il faut l\'option "-a".',
    bugDescriptionFr: 'Par défaut, tee écrase le fichier cible. Pour ajouter à la fin (append), il faut l\'option "-a".',
    options: [
      {
        id: 'opt-1',
        label: 'Ajouter l\'option "-a" (tee -a log.txt) pour écrire en mode concaténation (append)',
        labelFr: 'Ajouter l\'option "-a" (tee -a log.txt) pour écrire en mode concaténation (append)',
        isCorrect: true,
        explanation: '"tee -a" correspond au mode d\'ouverture O_APPEND (similaire à la redirection ">>").',
        explanationFr: '"tee -a" correspond au mode d\'ouverture O_APPEND (similaire à la redirection ">>").'
      },
      {
        id: 'opt-2',
        label: 'Utiliser tee >> log.txt',
        labelFr: 'Utiliser tee >> log.txt',
        isCorrect: false,
        explanation: 'Rediriger la sortie de tee avec ">>" supprimerait l\'affichage sur le terminal qui est la fonction même de tee.',
        explanationFr: 'Rediriger la sortie de tee avec ">>" supprimerait l\'affichage sur le terminal qui est la fonction même de tee.'
      },
      {
        id: 'opt-3',
        label: 'tee ne peut pas ouvrir des fichiers existants',
        labelFr: 'tee ne peut pas ouvrir des fichiers existants',
        isCorrect: false,
        explanation: 'tee ouvre les fichiers existants et les écrase par défaut sans le flag -a.',
        explanationFr: 'tee ouvre les fichiers existants et les écrase par défaut sans le flag -a.'
      },
      {
        id: 'opt-4',
        label: 'Utiliser l\'option -c',
        labelFr: 'Utiliser l\'option -c',
        isCorrect: false,
        explanation: 'L\'option -c n\'existe pas dans tee pour le mode append.',
        explanationFr: 'L\'option -c n\'existe pas dans tee pour le mode append.'
      }
    ],
    correctedSnippet: `echo "Test 1" | tee -a log.txt
echo "Test 2" | tee -a log.txt`,
    fixExplanation: '"tee -a" préserve les données antérieures et ajoute les nouvelles lignes à la suite.',
    fixExplanationFr: '"tee -a" préserve les données antérieures et ajoute les nouvelles lignes à la suite.'
  },
  {
    id: 'tb-lpic1-103-11',
    title: 'Sortie du mode édition dans l\'éditeur Vi / Vim',
    titleFr: 'Blocage dans l\'éditeur Vi : sauvegarde et sortie avec :wq ou :q!',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.8',
    category: 'GNU & Unix Commands',
    scenario: 'Un débutant lance "vi /etc/hosts", tape des modifications mais ne parvient pas à sauvegarder ni à quitter, tapant "quit", "exit" ou Ctrl+C sans effet.',
    scenarioFr: 'Un débutant lance "vi /etc/hosts", tape des modifications mais ne parvient pas à sauvegarder ni à quitter, tapant "quit", "exit" ou Ctrl+C sans effet.',
    codeSnippet: `Type :quit<Enter> to exit Vim
E37: No write since last change (add ! to override)`,
    language: 'bash',
    bugDescription: 'Vi est un éditeur modal. Il faut presser Échap pour revenir en mode commande puis taper ":wq" (écrire et quitter) ou ":q!" (quitter sans enregistrer).',
    bugDescriptionFr: 'Vi est un éditeur modal. Il faut presser Échap pour revenir en mode commande puis taper ":wq" (écrire et quitter) ou ":q!" (quitter sans enregistrer).',
    options: [
      {
        id: 'opt-1',
        label: 'Appuyer sur la touche "Échap" pour basculer en mode Normal, puis taper ":wq" pour enregistrer et quitter (ou "ZZ")',
        labelFr: 'Appuyer sur la touche "Échap" pour basculer en mode Normal, puis taper ":wq" pour enregistrer et quitter (ou "ZZ")',
        isCorrect: true,
        explanation: 'En mode Normal, la séquence ":wq" écrit les modifications sur le disque et quitte Vi. ":q!" quitte sans sauver.',
        explanationFr: 'En mode Normal, la séquence ":wq" écrit les modifications sur le disque et quitte Vi. ":q!" quitte sans sauver.'
      },
      {
        id: 'opt-2',
        label: 'Fermer brutalement la fenêtre du terminal pour forcer la sauvegarde',
        labelFr: 'Fermer brutalement la fenêtre du terminal pour forcer la sauvegarde',
        isCorrect: false,
        explanation: 'Fermer le terminal abandonne les modifications et laisse un fichier .swp orphelin.',
        explanationFr: 'Fermer le terminal abandonne les modifications et laisse un fichier .swp orphelin.'
      },
      {
        id: 'opt-3',
        label: 'Taper Ctrl+Z et le fichier est sauvegardé automatiquement',
        labelFr: 'Taper Ctrl+Z et le fichier est sauvegardé automatiquement',
        isCorrect: false,
        explanation: 'Ctrl+Z met le processus en pause en arrière-plan sans rien enregistrer.',
        explanationFr: 'Ctrl+Z met le processus en pause en arrière-plan sans rien enregistrer.'
      },
      {
        id: 'opt-4',
        label: 'Vi n\'enregistre que si on appuie sur la touche F2',
        labelFr: 'Vi n\'enregistre que si on appuie sur la touche F2',
        isCorrect: false,
        explanation: 'Vi utilise les commandes du mode ex commençant par deux-points.',
        explanationFr: 'Vi utilise les commandes du mode ex commençant par deux-points.'
      }
    ],
    correctedSnippet: `<Echap>
:wq`,
    fixExplanation: 'La touche Échap suivie de ":wq" (write & quit) assure l\'enregistrement des modifications.',
    fixExplanationFr: 'La touche Échap suivie de ":wq" (write & quit) assure l\'enregistrement des modifications.'
  },
  {
    id: 'tb-lpic1-103-12',
    title: 'Signal de terminaison propre SIGTERM (15) vs SIGKILL (9)',
    titleFr: 'Arrêt forcé d\'un processus bloqué avec kill -9 après échec de kill -15',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.5',
    category: 'GNU & Unix Commands',
    scenario: 'Un processus fou (PID 7891) ne répond plus. La commande "kill 7891" ne produit aucun effet et le processus continue de consommer 100% de CPU.',
    scenarioFr: 'Un processus fou (PID 7891) ne répond plus. La commande "kill 7891" ne produit aucun effet et le processus continue de consommer 100% de CPU.',
    codeSnippet: `user@srv:~$ kill 7891
user@srv:~$ ps -p 7891
    PID TTY          TIME CMD
   7891 pts/1    00:15:30 badprocess`,
    language: 'bash',
    bugDescription: '"kill" sans option envoie SIGTERM (15), qui peut être intercepté ou ignoré par un programme figé. Pour forcer l\'arrêt immédiat par le noyau, il faut SIGKILL (9).',
    bugDescriptionFr: '"kill" sans option envoie SIGTERM (15), qui peut être intercepté ou ignoré par un programme figé. Pour forcer l\'arrêt immédiat par le noyau, il faut SIGKILL (9).',
    options: [
      {
        id: 'opt-1',
        label: 'Envoyer le signal SIGKILL avec "kill -9 7891" (ou kill -KILL 7891) que le processus ne peut ni intercepter ni ignorer',
        labelFr: 'Envoyer le signal SIGKILL avec "kill -9 7891" (ou kill -KILL 7891) que le processus ne peut ni intercepter ni ignorer',
        isCorrect: true,
        explanation: 'SIGKILL (numéro 9) est exécuté directement par le noyau Linux et termine le processus de force sans lui donner la main.',
        explanationFr: 'SIGKILL (numéro 9) est exécuté directement par le noyau Linux et termine le processus de force sans lui donner la main.'
      },
      {
        id: 'opt-2',
        label: 'Taper kill -0 7891',
        labelFr: 'Taper kill -0 7891',
        isCorrect: false,
        explanation: 'Le signal 0 ne tue pas le processus, il teste simplement son existence.',
        explanationFr: 'Le signal 0 ne tue pas le processus, il teste simplement son existence.'
      },
      {
        id: 'opt-3',
        label: 'Redémarrer le serveur complet immédiatement',
        labelFr: 'Redémarrer le serveur complet immédiatement',
        isCorrect: false,
        explanation: 'Redémarrer un serveur pour un simple processus bloqué est inutile.',
        explanationFr: 'Redémarrer un serveur pour un simple processus bloqué est inutile.'
      },
      {
        id: 'opt-4',
        label: 'Envoyer SIGSTOP pour le supprimer de la mémoire',
        labelFr: 'Envoyer SIGSTOP pour le supprimer de la mémoire',
        isCorrect: false,
        explanation: 'SIGSTOP met le processus en pause mais le conserve en RAM.',
        explanationFr: 'SIGSTOP met le processus en pause mais le conserve en RAM.'
      }
    ],
    correctedSnippet: `kill -9 7891`,
    fixExplanation: '"kill -9" ordonne la suppression immédiate du processus par le scheduler du noyau.',
    fixExplanationFr: '"kill -9" ordonne la suppression immédiate du processus par le scheduler du noyau.'
  },
  {
    id: 'tb-lpic1-103-13',
    title: 'Filtrage des lignes dupliquées avec uniq après un tri préalable',
    titleFr: 'uniq ne supprime pas les doublons non consécutifs sans commande sort préalable',
    certification: 'lpic-1',
    topicNumber: 103,
    objectiveId: '103.2',
    category: 'GNU & Unix Commands',
    scenario: 'L\'administrateur veut dédoublonner une liste d\'adresses IP avec "uniq ips.txt". Le résultat contient encore plein de doublons.',
    scenarioFr: 'L\'administrateur veut dédoublonner une liste d\'adresses IP avec "uniq ips.txt". Le résultat contient encore plein de doublons.',
    codeSnippet: `user@srv:~$ cat ips.txt
10.0.0.1
10.0.0.2
10.0.0.1
user@srv:~$ uniq ips.txt
10.0.0.1
10.0.0.2
10.0.0.1`,
    language: 'bash',
    bugDescription: 'La commande "uniq" ne compare que les lignes adjacentes (consécutives). Elle doit obligatoirement être précédée d\'un tri "sort" ou utiliser "sort -u".',
    bugDescriptionFr: 'La commande "uniq" ne compare que les lignes adjacentes (consécutives). Elle doit obligatoirement être précédée d\'un tri "sort" ou utiliser "sort -u".',
    options: [
      {
        id: 'opt-1',
        label: 'Il faut trier le flux au préalable avec "sort ips.txt | uniq" (ou directement "sort -u ips.txt")',
        labelFr: 'Il faut trier le flux au préalable avec "sort ips.txt | uniq" (ou directement "sort -u ips.txt")',
        isCorrect: true,
        explanation: '"uniq" ne détecte les doublons que s\'ils se suivent immédiatement dans le flux. "sort" regroupe les doublons.',
        explanationFr: '"uniq" ne détecte les doublons que s\'ils se suivent immédiatement dans le flux. "sort" regroupe les doublons.'
      },
      {
        id: 'opt-2',
        label: 'Ajouter l\'option "-d" à uniq',
        labelFr: 'Ajouter l\'option "-d" à uniq',
        isCorrect: false,
        explanation: '"uniq -d" n\'affiche que les doublons consécutifs.',
        explanationFr: '"uniq -d" n\'affiche que les doublons consécutifs.'
      },
      {
        id: 'opt-3',
        label: 'uniq ne fonctionne que sur les chaînes alphabétiques et pas sur les adresses IP',
        labelFr: 'uniq ne fonctionne que sur les chaînes alphabétiques et pas sur les adresses IP',
        isCorrect: false,
        explanation: 'uniq traite les lignes sous forme textuelle brute.',
        explanationFr: 'uniq traite les lignes sous forme textuelle brute.'
      },
      {
        id: 'opt-4',
        label: 'Utiliser cut -u',
        labelFr: 'Utiliser cut -u',
        isCorrect: false,
        explanation: 'L\'option -u n\'existe pas dans cut.',
        explanationFr: 'L\'option -u n\'existe pas dans cut.'
      }
    ],
    correctedSnippet: `sort ips.txt | uniq
# ou :
sort -u ips.txt`,
    fixExplanation: 'L\'enchaînement "sort | uniq" garantit l\'élimination de toutes les lignes en double.',
    fixExplanationFr: 'L\'enchaînement "sort | uniq" garantit l\'élimination de toutes les lignes en double.'
  },

  // ==========================================
  // TOPIC 104: DEVICES, LINUX FILESYSTEMS, FHS (104.1 - 104.7) [12 Scenarios]
  // ==========================================
  {
    id: 'tb-lpic1-104-01',
    title: 'Disque saturé avec 100% d\'utilisation des Inodes malgré de l\'espace disque libre',
    titleFr: 'Erreur "No space left on device" causée par la saturation des Inodes (df -i)',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.2',
    category: 'Devices & Filesystems',
    scenario: 'Une application web renvoie l\'erreur "No space left on device". Pourtant, la commande "df -h" indique qu\'il reste 50 Go d\'espace libre.',
    scenarioFr: 'Une application web renvoie l\'erreur "No space left on device". Pourtant, la commande "df -h" indique qu\'il reste 50 Go d\'espace libre.',
    codeSnippet: `root@srv:~# touch /var/log/app.log
touch: cannot touch '/var/log/app.log': No space left on device
root@srv:~# df -h /var
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda3        80G   25G   51G  33% /var`,
    language: 'bash',
    bugDescription: 'La table des inodes est pleine à 100% (vérifiable avec "df -i") à cause d\'une profusion de millions de micro-fichiers.',
    bugDescriptionFr: 'La table des inodes est pleine à 100% (vérifiable avec "df -i") à cause d\'une profusion de millions de micro-fichiers.',
    options: [
      {
        id: 'opt-1',
        label: 'Vérifier la table des inodes avec "df -i" : le nombre maximal d\'inodes alloués à la création du système de fichiers est atteint',
        labelFr: 'Vérifier la table des inodes avec "df -i" : le nombre maximal d\'inodes alloués à la création du système de fichiers est atteint',
        isCorrect: true,
        explanation: 'Sous Linux (ext4), chaque fichier consomme un inode. Si des millions de sessions vides ont été générées, les inodes s\'épuisent même si des gigaoctets restent libres.',
        explanationFr: 'Sous Linux (ext4), chaque fichier consomme un inode. Si des millions de sessions vides ont été générées, les inodes s\'épuisent même si des gigaoctets restent libres.'
      },
      {
        id: 'opt-2',
        label: 'Augmenter la taille du disque de 100 Go avec lvextend sans supprimer de fichiers',
        labelFr: 'Augmenter la taille du disque de 100 Go avec lvextend sans supprimer de fichiers',
        isCorrect: false,
        explanation: 'Augmenter l\'espace bloc ne résout pas immédiatement la saturation par accumulation de micro-fichiers inutiles.',
        explanationFr: 'Augmenter l\'espace bloc ne résout pas immédiatement la saturation par accumulation de micro-fichiers inutiles.'
      },
      {
        id: 'opt-3',
        label: 'Le système de fichiers est corrompu par un virus',
        labelFr: 'Le système de fichiers est corrompu par un virus',
        isCorrect: false,
        explanation: 'C\'est une caractéristique classique des systèmes Unix mesurée par df -i.',
        explanationFr: 'C\'est une caractéristique classique des systèmes Unix mesurée par df -i.'
      },
      {
        id: 'opt-4',
        label: 'touch est verrouillé par SELinux',
        labelFr: 'touch est verrouillé par SELinux',
        isCorrect: false,
        explanation: 'L\'erreur explicite retournée par le noyau est ENOSPC (No space left on device).',
        explanationFr: 'L\'erreur explicite retournée par le noyau est ENOSPC (No space left on device).'
      }
    ],
    correctedSnippet: `root@srv:~# df -i /var
Filesystem      Inodes   IUsed   IFree IUse% Mounted on
/dev/sda3      5242880 5242880       0  100% /var

# Nettoyer les fichiers de session orphelins :
find /var/spool/clientmqueue -type f -delete`,
    fixExplanation: '"df -i" met en évidence la pénurie d\'inodes causée par une multitude de petits fichiers.',
    fixExplanationFr: '"df -i" met en évidence la pénurie d\'inodes causée par une multitude de petits fichiers.'
  },
  {
    id: 'tb-lpic1-104-02',
    title: 'Démontage impossible d\'un système de fichiers : "target is busy"',
    titleFr: 'umount échoue avec "target is busy" en raison de fichiers ouverts',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.3',
    category: 'Devices & Filesystems',
    scenario: 'L\'administrateur essaie de démonter /mnt/backup avec "umount /mnt/backup", mais le système renvoie "umount: /mnt/backup: target is busy".',
    scenarioFr: 'L\'administrateur essaie de démonter /mnt/backup avec "umount /mnt/backup", mais le système renvoie "umount: /mnt/backup: target is busy".',
    codeSnippet: `root@srv:~# umount /mnt/backup
umount: /mnt/backup: target is busy.`,
    language: 'bash',
    bugDescription: 'Un processus a son répertoire de travail courant (CWD) dans le montage ou y maintient un fichier ouvert. Il faut utiliser "fuser -m" ou "lsof +D".',
    bugDescriptionFr: 'Un processus a son répertoire de travail courant (CWD) dans le montage ou y maintient un fichier ouvert. Il faut utiliser "fuser -m" ou "lsof +D".',
    options: [
      {
        id: 'opt-1',
        label: 'Identifier et clore les processus maintenant le point de montage occupé avec "fuser -vm /mnt/backup" ou "lsof +D /mnt/backup"',
        labelFr: 'Identifier et clore les processus maintenant le point de montage occupé avec "fuser -vm /mnt/backup" ou "lsof +D /mnt/backup"',
        isCorrect: true,
        explanation: 'Le noyau interdit le démontage tant qu\'un shell s\'y trouve ou qu\'un descripteur de fichier y est ouvert. "fuser -k" peut tuer ces processus.',
        explanationFr: 'Le noyau interdit le démontage tant qu\'un shell s\'y trouve ou qu\'un descripteur de fichier y est ouvert. "fuser -k" peut tuer ces processus.'
      },
      {
        id: 'opt-2',
        label: 'Supprimer le répertoire /mnt/backup avec rm -rf',
        labelFr: 'Supprimer le répertoire /mnt/backup avec rm -rf',
        isCorrect: false,
        explanation: 'rm -rf effacerait les données du disque monté.',
        explanationFr: 'rm -rf effacerait les données du disque monté.'
      },
      {
        id: 'opt-3',
        label: 'Exécuter fsck sur le disque en cours d\'utilisation',
        labelFr: 'Exécuter fsck sur le disque en cours d\'utilisation',
        isCorrect: false,
        explanation: 'Lancer fsck sur un montage actif corrompt gravement le système de fichiers.',
        explanationFr: 'Lancer fsck sur un montage actif corrompt gravement le système de fichiers.'
      },
      {
        id: 'opt-4',
        label: 'Débrancher le câble du disque à chaud sans démonter',
        labelFr: 'Débrancher le câble du disque à chaud sans démonter',
        isCorrect: false,
        explanation: 'Risque majeur de perte de données et d\'écritures en cache non synchronisées.',
        explanationFr: 'Risque majeur de perte de données et d\'écritures en cache non synchronisées.'
      }
    ],
    correctedSnippet: `root@srv:~# fuser -vm /mnt/backup
                     USER        PID ACCESS COMMAND
/mnt/backup:         backup     4120 ..c..  tar
root@srv:~# fuser -km /mnt/backup
root@srv:~# umount /mnt/backup`,
    fixExplanation: '"fuser -vm" révèle quel processus retient le point de montage et permet de le libérer.',
    fixExplanationFr: '"fuser -vm" révèle quel processus retient le point de montage et permet de le libérer.'
  },
  {
    id: 'tb-lpic1-104-03',
    title: 'Suppression impossible d\'un fichier dans /tmp protégé par le Sticky Bit',
    titleFr: 'Sticky Bit (t) empêchant un utilisateur de supprimer le fichier d\'un autre',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.5',
    category: 'Devices & Filesystems',
    scenario: 'Dans /tmp (droits rwxrwxrwt), l\'utilisateur "bob" essaie d\'effacer le fichier "/tmp/cache.txt" créé par "alice". La commande échoue avec "Operation not permitted" malgré les droits d\'écriture sur /tmp.',
    scenarioFr: 'Dans /tmp (droits rwxrwxrwt), l\'utilisateur "bob" essaie d\'effacer le fichier "/tmp/cache.txt" créé par "alice". La commande échoue avec "Operation not permitted" malgré les droits d\'écriture sur /tmp.',
    codeSnippet: `bob@srv:~$ ls -ld /tmp
drwxrwxrwt 15 root root 4096 Oct 12 12:00 /tmp
bob@srv:~$ ls -l /tmp/cache.txt
-rw-rw-rw- 1 alice dev 1024 Oct 12 12:05 /tmp/cache.txt
bob@srv:~$ rm /tmp/cache.txt
rm: cannot remove '/tmp/cache.txt': Operation not permitted`,
    language: 'bash',
    bugDescription: 'Le Sticky Bit (noté "t" à la fin des permissions de répertoire) restreint la suppression des fichiers au seul propriétaire du fichier ou au root.',
    bugDescriptionFr: 'Le Sticky Bit (noté "t" à la fin des permissions de répertoire) restreint la suppression des fichiers au seul propriétaire du fichier ou au root.',
    options: [
      {
        id: 'opt-1',
        label: 'Le Sticky Bit (drapeau "t") sur /tmp interdit la suppression d\'un fichier par quiconque d\'autre que son propriétaire (alice) ou root',
        labelFr: 'Le Sticky Bit (drapeau "t") sur /tmp interdit la suppression d\'un fichier par quiconque d\'autre que son propriétaire (alice) ou root',
        isCorrect: true,
        explanation: 'C\'est la fonction historique du Sticky Bit (chmod +t / 1777) sur les répertoires partagés : protéger contre la suppression malveillante des fichiers d\'autrui.',
        explanationFr: 'C\'est la fonction historique du Sticky Bit (chmod +t / 1777) sur les répertoires partagés : protéger contre la suppression malveillante des fichiers d\'autrui.'
      },
      {
        id: 'opt-2',
        label: 'Le fichier cache.txt est en lecture seule pour bob',
        labelFr: 'Le fichier cache.txt est en lecture seule pour bob',
        isCorrect: false,
        explanation: 'Le fichier affiche "rw-rw-rw-", les droits de suppression dépendent du répertoire parent.',
        explanationFr: 'Le fichier affiche "rw-rw-rw-", les droits de suppression dépendent du répertoire parent.'
      },
      {
        id: 'opt-3',
        label: 'bob a oublié l\'option -f dans rm',
        labelFr: 'bob a oublié l\'option -f dans rm',
        isCorrect: false,
        explanation: 'rm -f renverrait la même erreur "Operation not permitted".',
        explanationFr: 'rm -f renverrait la même erreur "Operation not permitted".'
      },
      {
        id: 'opt-4',
        label: '/tmp est un système de fichiers en lecture seule (ro)',
        labelFr: '/tmp est un système de fichiers en lecture seule (ro)',
        isCorrect: false,
        explanation: 'Si /tmp était en ro, le message serait "Read-only file system".',
        explanationFr: 'Si /tmp était en ro, le message serait "Read-only file system".'
      }
    ],
    correctedSnippet: `# Seule alice (ou root) peut supprimer le fichier :
alice@srv:~$ rm /tmp/cache.txt`,
    fixExplanation: 'Le Sticky Bit garantit qu\'aucun tiers ne peut supprimer un fichier dont il n\'est pas propriétaire.',
    fixExplanationFr: 'Le Sticky Bit garantit qu\'aucun tiers ne peut supprimer un fichier dont il n\'est pas propriétaire.'
  },
  {
    id: 'tb-lpic1-104-04',
    title: 'Droits par défaut des nouveaux fichiers altérés par umask',
    titleFr: 'Nouveaux fichiers créés sans droit de lecture à cause d\'un umask 077',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.5',
    category: 'Devices & Filesystems',
    scenario: 'Quand l\'utilisateur crée un fichier avec "touch rapport.txt", ses collègues du même groupe ne peuvent pas le lire. Les droits créés sont "rw-------" (600).',
    scenarioFr: 'Quand l\'utilisateur crée un fichier avec "touch rapport.txt", ses collègues du même groupe ne peuvent pas le lire. Les droits créés sont "rw-------" (600).',
    codeSnippet: `user@srv:~$ umask
0077
user@srv:~$ touch rapport.txt
user@srv:~$ ls -l rapport.txt
-rw------- 1 user dev 0 Oct 12 14:00 rapport.txt`,
    language: 'bash',
    bugDescription: 'L\'umask courant est configuré à 0077, ce qui retire tous les droits au groupe et aux autres (666 - 077 = 600).',
    bugDescriptionFr: 'L\'umask courant est configuré à 0077, ce qui retire tous les droits au groupe et aux autres (666 - 077 = 600).',
    options: [
      {
        id: 'opt-1',
        label: 'Régler l\'umask à "0022" ou "0002" dans le fichier de profil shell (~/.bashrc) pour autoriser la lecture au groupe',
        labelFr: 'Régler l\'umask à "0022" ou "0002" dans le fichier de profil shell (~/.bashrc) pour autoriser la lecture au groupe',
        isCorrect: true,
        explanation: 'Pour les fichiers, les droits de base sont 666. Avec un umask de 0022, les droits deviennent 644 (rw-r--r--). Avec 0002, ils deviennent 664.',
        explanationFr: 'Pour les fichiers, les droits de base sont 666. Avec un umask de 0022, les droits deviennent 644 (rw-r--r--). Avec 0002, ils deviennent 664.'
      },
      {
        id: 'opt-2',
        label: 'Exécuter "chmod 777 touch"',
        labelFr: 'Exécuter "chmod 777 touch"',
        isCorrect: false,
        explanation: 'Touch est un binaire standard dont les permissions ne modifient pas la logique de création des fichiers.',
        explanationFr: 'Touch est un binaire standard dont les permissions ne modifient pas la logique de création des fichiers.'
      },
      {
        id: 'opt-3',
        label: 'Passer l\'umask à 777',
        labelFr: 'Passer l\'umask à 777',
        isCorrect: false,
        explanation: 'Un umask de 777 retirerait absolument tous les droits (droits finaux 000).',
        explanationFr: 'Un umask de 777 retirerait absolument tous les droits (droits finaux 000).'
      },
      {
        id: 'opt-4',
        label: 'Recompiler le noyau Linux avec CONFIG_UMASK_DEFAULT',
        labelFr: 'Recompiler le noyau Linux avec CONFIG_UMASK_DEFAULT',
        isCorrect: false,
        explanation: 'L\'umask est un attribut dynamique de session shell modifiable par la simple commande "umask".',
        explanationFr: 'L\'umask est un attribut dynamique de session shell modifiable par la simple commande "umask".'
      }
    ],
    correctedSnippet: `user@srv:~$ umask 0022
user@srv:~$ touch nouveau.txt
user@srv:~$ ls -l nouveau.txt
-rw-r--r-- 1 user dev 0 Oct 12 14:02 nouveau.txt`,
    fixExplanation: 'Définir "umask 0022" applique le masque standard garantissant les droits de lecture au groupe et au reste du monde.',
    fixExplanationFr: 'Définir "umask 0022" applique le masque standard garantissant les droits de lecture au groupe et au reste du monde.'
  },
  {
    id: 'tb-lpic1-104-05',
    title: 'Création d\'un système de fichiers XFS et outil de réparation xfs_repair',
    titleFr: 'Tentative erronée d\'exécuter fsck.ext4 sur une partition au format XFS',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.2',
    category: 'Devices & Filesystems',
    scenario: 'L\'administrateur essaie de réparer une partition XFS endommagée avec "e2fsck /dev/sdb1". L\'outil affiche "Bad magic number in super-block".',
    scenarioFr: 'L\'administrateur essaie de réparer une partition XFS endommagée avec "e2fsck /dev/sdb1". L\'outil affiche "Bad magic number in super-block".',
    codeSnippet: `root@srv:~# e2fsck /dev/sdb1
e2fsck 1.47.0
ext2fs_open2: Bad magic number in super-block
e2fsck: Superblock invalid, trying backup blocks...`,
    language: 'bash',
    bugDescription: 'e2fsck est exclusivement dédié aux systèmes ext2/ext3/ext4. Pour XFS, l\'utilitaire dédié officiel est "xfs_repair".',
    bugDescriptionFr: 'e2fsck est exclusivement dédié aux systèmes ext2/ext3/ext4. Pour XFS, l\'utilitaire dédié officiel est "xfs_repair".',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "xfs_repair /dev/sdb1" sur la partition préalablement démontée',
        labelFr: 'Utiliser "xfs_repair /dev/sdb1" sur la partition préalablement démontée',
        isCorrect: true,
        explanation: 'XFS possède ses propres structures de métadonnées (Allocation Groups) totalement incompatibles avec les outils de la famille ext (e2fsck).',
        explanationFr: 'XFS possède ses propres structures de métadonnées (Allocation Groups) totalement incompatibles avec les outils de la famille ext (e2fsck).'
      },
      {
        id: 'opt-2',
        label: 'Forcer la réparation avec "e2fsck -f -y /dev/sdb1"',
        labelFr: 'Forcer la réparation avec "e2fsck -f -y /dev/sdb1"',
        isCorrect: false,
        explanation: 'Forcer e2fsck sur un superblock XFS détruirait définitivement les données.',
        explanationFr: 'Forcer e2fsck sur un superblock XFS détruirait définitivement les données.'
      },
      {
        id: 'opt-3',
        label: 'La partition est définitivement perdue',
        labelFr: 'La partition est définitivement perdue',
        isCorrect: false,
        explanation: 'Le super-bloc n\'est pas brisé, c\'est juste l\'outil de diagnostic qui n\'est pas le bon.',
        explanationFr: 'Le super-bloc n\'est pas brisé, c\'est juste l\'outil de diagnostic qui n\'est pas le bon.'
      },
      {
        id: 'opt-4',
        label: 'xfs_repair doit être exécuté pendant que la partition est montée',
        labelFr: 'xfs_repair doit être exécuté pendant que la partition est montée',
        isCorrect: false,
        explanation: 'xfs_repair refuse catégoriquement d\'intervenir sur un système monté.',
        explanationFr: 'xfs_repair refuse catégoriquement d\'intervenir sur un système monté.'
      }
    ],
    correctedSnippet: `umount /dev/sdb1
xfs_repair /dev/sdb1`,
    fixExplanation: '"xfs_repair" est l\'outil natif indispensable pour vérifier et corriger un système de fichiers XFS.',
    fixExplanationFr: '"xfs_repair" est l\'outil natif indispensable pour vérifier et corriger un système de fichiers XFS.'
  },
  {
    id: 'tb-lpic1-104-06',
    title: 'Héritage automatique de groupe dans un répertoire collaboratif avec SGID',
    titleFr: 'Nouveaux fichiers créés avec le mauvais groupe dans un répertoire d\'équipe',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.5',
    category: 'Devices & Filesystems',
    scenario: 'Dans un répertoire partagé "/srv/projets" appartenant au groupe "devs", chaque fois qu\'un utilisateur crée un fichier, celui-ci prend son groupe primaire personnel au lieu de "devs".',
    scenarioFr: 'Dans un répertoire partagé "/srv/projets" appartenant au groupe "devs", chaque fois qu\'un utilisateur crée un fichier, celui-ci prend son groupe primaire personnel au lieu de "devs".',
    codeSnippet: `user@srv:/srv/projets$ touch nouveau.txt
user@srv:/srv/projets$ ls -l nouveau.txt
-rw-r--r-- 1 user user 0 Oct 12 15:00 nouveau.txt
# Le groupe est 'user' au lieu de 'devs' !`,
    language: 'bash',
    bugDescription: 'Sans le bit SGID (Set Group ID) sur le répertoire parent, les fichiers héritent du GID principal du créateur. Le SGID force l\'héritage du groupe du dossier.',
    bugDescriptionFr: 'Sans le bit SGID (Set Group ID) sur le répertoire parent, les fichiers héritent du GID principal du créateur. Le SGID force l\'héritage du groupe du dossier.',
    options: [
      {
        id: 'opt-1',
        label: 'Activer le bit SGID sur le répertoire avec "chmod g+s /srv/projets" (ou "chmod 2775 /srv/projets")',
        labelFr: 'Activer le bit SGID sur le répertoire avec "chmod g+s /srv/projets" (ou "chmod 2775 /srv/projets")',
        isCorrect: true,
        explanation: 'Sur un dossier, le bit SGID contraint tout nouveau fichier ou sous-dossier à hériter automatiquement du groupe du dossier parent.',
        explanationFr: 'Sur un dossier, le bit SGID contraint tout nouveau fichier ou sous-dossier à hériter automatiquement du groupe du dossier parent.'
      },
      {
        id: 'opt-2',
        label: 'Activer le bit SUID avec "chmod u+s /srv/projets"',
        labelFr: 'Activer le bit SUID avec "chmod u+s /srv/projets"',
        isCorrect: false,
        explanation: 'SUID sur un répertoire est ignoré sous Linux pour des raisons de sécurité.',
        explanationFr: 'SUID sur un répertoire est ignoré sous Linux pour des raisons de sécurité.'
      },
      {
        id: 'opt-3',
        label: 'Activer le sticky bit avec "chmod +t /srv/projets"',
        labelFr: 'Activer le sticky bit avec "chmod +t /srv/projets"',
        isCorrect: false,
        explanation: 'Le sticky bit empêche la suppression par des tiers mais ne change rien à l\'attribution du groupe.',
        explanationFr: 'Le sticky bit empêche la suppression par des tiers mais ne change rien à l\'attribution du groupe.'
      },
      {
        id: 'opt-4',
        label: 'Il faut forcer chaque utilisateur à changer son groupe primaire dans /etc/passwd',
        labelFr: 'Il faut forcer chaque utilisateur à changer son groupe primaire dans /etc/passwd',
        isCorrect: false,
        explanation: 'Le SGID résout le problème de manière élégante et ciblée sans altérer les comptes utilisateurs.',
        explanationFr: 'Le SGID résout le problème de manière élégante et ciblée sans altérer les comptes utilisateurs.'
      }
    ],
    correctedSnippet: `chmod g+s /srv/projets
ls -ld /srv/projets
drwxrwsr-x 2 root devs 4096 Oct 12 15:05 /srv/projets`,
    fixExplanation: 'Le droit SGID (noté "s" dans la colonne de groupe) transmet automatiquement le groupe propriétaire à toute nouvelle création.',
    fixExplanationFr: 'Le droit SGID (noté "s" dans la colonne de groupe) transmet automatiquement le groupe propriétaire à toute nouvelle création.'
  },
  {
    id: 'tb-lpic1-104-07',
    title: 'Différence entre lien symbolique orphelin (broken link) et cible supprimée',
    titleFr: 'Lien symbolique brisé après déplacement ou suppression du fichier source',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.6',
    category: 'Devices & Filesystems',
    scenario: 'L\'utilisateur essaie de lire un fichier pointé par un lien symbolique : "cat /usr/local/bin/run". Le shell renvoie "No such file or directory" alors que "ls -l /usr/local/bin/run" affiche bien le lien.',
    scenarioFr: 'L\'utilisateur essaie de lire un fichier pointé par un lien symbolique : "cat /usr/local/bin/run". Le shell renvoie "No such file or directory" alors que "ls -l /usr/local/bin/run" affiche bien le lien.',
    codeSnippet: `user@srv:~$ ls -l /usr/local/bin/run
lrwxrwxrwx 1 root root 22 Oct 12 15:10 /usr/local/bin/run -> /opt/app/bin/start.sh
user@srv:~$ cat /usr/local/bin/run
cat: /usr/local/bin/run: No such file or directory`,
    language: 'bash',
    bugDescription: 'Le lien symbolique pointe vers "/opt/app/bin/start.sh" qui a été renommé ou supprimé. Le lien est devenu orphelin (broken/dangling link).',
    bugDescriptionFr: 'Le lien symbolique pointe vers "/opt/app/bin/start.sh" qui a été renommé ou supprimé. Le lien est devenu orphelin (broken/dangling link).',
    options: [
      {
        id: 'opt-1',
        label: 'Le lien symbolique pointe vers une cible inexistante (lien orphelin) ; il faut recréer la cible ou réajuster le lien avec "ln -sfn"',
        labelFr: 'Le lien symbolique pointe vers une cible inexistante (lien orphelin) ; il faut recréer la cible ou réajuster le lien avec "ln -sfn"',
        isCorrect: true,
        explanation: 'Un symlink n\'est qu\'une chaîne de texte contenant un chemin. Si la cible disparaît, l\'appel système open() retourne ENOENT.',
        explanationFr: 'Un symlink n\'est qu\'une chaîne de texte contenant un chemin. Si la cible disparaît, l\'appel système open() retourne ENOENT.'
      },
      {
        id: 'opt-2',
        label: 'cat ne sait pas déréférencer les liens symboliques',
        labelFr: 'cat ne sait pas déréférencer les liens symboliques',
        isCorrect: false,
        explanation: 'Le noyau déréférence automatiquement les liens symboliques lors de l\'ouverture du fichier.',
        explanationFr: 'Le noyau déréférence automatiquement les liens symboliques lors de l\'ouverture du fichier.'
      },
      {
        id: 'opt-3',
        label: 'Il faut donner les droits 777 au lien symbolique',
        labelFr: 'Il faut donner les droits 777 au lien symbolique',
        isCorrect: false,
        explanation: 'Un symlink a toujours les permissions virtuelles lrwxrwxrwx.',
        explanationFr: 'Un symlink a toujours les permissions virtuelles lrwxrwxrwx.'
      },
      {
        id: 'opt-4',
        label: 'Le disque est corrompu',
        labelFr: 'Le disque est corrompu',
        isCorrect: false,
        explanation: 'C\'est une situation courante lorsqu\'un composant a été déplacé.',
        explanationFr: 'C\'est une situation courante lorsqu\'un composant a été déplacé.'
      }
    ],
    correctedSnippet: `# Vérifier l'existence réelle de la cible :
ls -l /opt/app/bin/start.sh
# Mettre à jour le lien vers le bon emplacement :
ln -sfn /opt/newapp/start.sh /usr/local/bin/run`,
    fixExplanation: 'Corriger le chemin de la cible dans le symlink rétablit l\'accès au programme.',
    fixExplanationFr: 'Corriger le chemin de la cible dans le symlink rétablit l\'accès au programme.'
  },
  {
    id: 'tb-lpic1-104-08',
    title: 'Base de données locate non actualisée après création de fichiers récents',
    titleFr: 'locate ne trouve pas un fichier créé récemment sans updatedb',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.7',
    category: 'Devices & Filesystems',
    scenario: 'Un technicien crée le fichier "/etc/myapp.conf". Immédiatement après, il tape "locate myapp.conf" qui ne renvoie aucun résultat.',
    scenarioFr: 'Un technicien crée le fichier "/etc/myapp.conf". Immédiatement après, il tape "locate myapp.conf" qui ne renvoie aucun résultat.',
    codeSnippet: `root@srv:~# touch /etc/myapp.conf
root@srv:~# locate myapp.conf
# Rien n'est retourné !`,
    language: 'bash',
    bugDescription: '"locate" interroge la base de données statique mlocate/plocate (/var/lib/mlocate/mlocate.db). Pour intégrer les nouveaux fichiers, il faut exécuter "updatedb".',
    bugDescriptionFr: '"locate" interroge la base de données statique mlocate/plocate (/var/lib/mlocate/mlocate.db). Pour intégrer les nouveaux fichiers, il faut exécuter "updatedb".',
    options: [
      {
        id: 'opt-1',
        label: 'Exécuter "updatedb" en root pour réindexer le système de fichiers dans la base de données mlocate',
        labelFr: 'Exécuter "updatedb" en root pour réindexer le système de fichiers dans la base de données mlocate',
        isCorrect: true,
        explanation: 'Contrairement à "find" qui parcourt le disque en temps réel, "locate" s\'appuie sur un index mis à jour périodiquement (souvent la nuit par cron/timer).',
        explanationFr: 'Contrairement à "find" qui parcourt le disque en temps réel, "locate" s\'appuie sur un index mis à jour périodiquement (souvent la nuit par cron/timer).'
      },
      {
        id: 'opt-2',
        label: 'locate est limité aux fichiers du dossier /home',
        labelFr: 'locate est limité aux fichiers du dossier /home',
        isCorrect: false,
        explanation: 'locate indexe l\'ensemble du système de fichiers selon /etc/updatedb.conf.',
        explanationFr: 'locate indexe l\'ensemble du système de fichiers selon /etc/updatedb.conf.'
      },
      {
        id: 'opt-3',
        label: 'touch ne prévient pas le démon locate',
        labelFr: 'touch ne prévient pas le démon locate',
        isCorrect: false,
        explanation: 'Il n\'y a pas de démon en écoute continue, mais un scan batch déclenché par updatedb.',
        explanationFr: 'Il n\'y a pas de démon en écoute continue, mais un scan batch déclenché par updatedb.'
      },
      {
        id: 'opt-4',
        label: 'Il faut redémarrer le serveur',
        labelFr: 'Il faut redémarrer le serveur',
        isCorrect: false,
        explanation: 'updatedb s\'exécute en ligne de commande en quelques secondes.',
        explanationFr: 'updatedb s\'exécute en ligne de commande en quelques secondes.'
      }
    ],
    correctedSnippet: `root@srv:~# updatedb
root@srv:~# locate myapp.conf
/etc/myapp.conf`,
    fixExplanation: '"updatedb" régénère l\'index local permettant à locate d\'afficher instantanément le fichier.',
    fixExplanationFr: '"updatedb" régénère l\'index local permettant à locate d\'afficher instantanément le fichier.'
  },
  {
    id: 'tb-lpic1-104-09',
    title: 'Option de montage noexec empêchant l\'exécution des scripts et binaires',
    titleFr: 'Permission denied lors de l\'exécution d\'un binaire situé sur une partition montée avec noexec',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.3',
    category: 'Devices & Filesystems',
    scenario: 'Un script exécutable "/var/tmp/test.sh" (droits rwxr-xr-x) renvoie "Permission denied" même lorsqu\'il est lancé par l\'utilisateur root.',
    scenarioFr: 'Un script exécutable "/var/tmp/test.sh" (droits rwxr-xr-x) renvoie "Permission denied" même lorsqu\'il est lancé par l\'utilisateur root.',
    codeSnippet: `root@srv:~# ls -l /var/tmp/test.sh
-rwxr-xr-x 1 root root 45 Oct 12 15:30 /var/tmp/test.sh
root@srv:~# /var/tmp/test.sh
bash: /var/tmp/test.sh: Permission denied`,
    language: 'bash',
    bugDescription: 'La partition /var/tmp est montée avec l\'option "noexec" dans /etc/fstab, ce qui désactive l\'exécution binaire au niveau du noyau.',
    bugDescriptionFr: 'La partition /var/tmp est montée avec l\'option "noexec" dans /etc/fstab, ce qui désactive l\'exécution binaire au niveau du noyau.',
    options: [
      {
        id: 'opt-1',
        label: 'La partition est montée avec l\'option "noexec" ; il faut la remonter avec l\'option "exec" ("mount -o remount,exec /var/tmp")',
        labelFr: 'La partition est montée avec l\'option "noexec" ; il faut la remonter avec l\'option "exec" ("mount -o remount,exec /var/tmp")',
        isCorrect: true,
        explanation: 'L\'option "noexec" interdit au noyau d\'exécuter tout fichier ou binaire situé sur cette partition, quelle que soit la valeur du bit d\'exécution ou le statut root.',
        explanationFr: 'L\'option "noexec" interdit au noyau d\'exécuter tout fichier ou binaire situé sur cette partition, quelle que soit la valeur du bit d\'exécution ou le statut root.'
      },
      {
        id: 'opt-2',
        label: 'Le binaire bash n\'est pas installé',
        labelFr: 'Le binaire bash n\'est pas installé',
        isCorrect: false,
        explanation: 'L\'erreur émane de bash lui-même.',
        explanationFr: 'L\'erreur émane de bash lui-même.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier doit avoir l\'extension .bin pour être exécuté',
        labelFr: 'Le fichier doit avoir l\'extension .bin pour être exécuté',
        isCorrect: false,
        explanation: 'Sous Linux, les extensions n\'ont aucune influence sur les permissions d\'exécution.',
        explanationFr: 'Sous Linux, les extensions n\'ont aucune influence sur les permissions d\'exécution.'
      },
      {
        id: 'opt-4',
        label: 'SELinux a corrompu les descripteurs de fichiers',
        labelFr: 'SELinux a corrompu les descripteurs de fichiers',
        isCorrect: false,
        explanation: 'L\'option noexec dans /etc/fstab ou mount est la cause directe de ce refus.',
        explanationFr: 'L\'option noexec dans /etc/fstab ou mount est la cause directe de ce refus.'
      }
    ],
    correctedSnippet: `mount -o remount,exec /var/tmp
/var/tmp/test.sh`,
    fixExplanation: 'Remonter la partition avec l\'option "exec" autorise le noyau à lancer les programmes qui y résident.',
    fixExplanationFr: 'Remonter la partition avec l\'option "exec" autorise le noyau à lancer les programmes qui y résident.'
  },
  {
    id: 'tb-lpic1-104-10',
    title: 'Formatage et création d\'étiquette système de fichiers avec tune2fs et e2label',
    titleFr: 'Modification du label d\'un système de fichiers ext4 avec e2label',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.2',
    category: 'Devices & Filesystems',
    scenario: 'L\'administrateur souhaite référencer une partition dans /etc/fstab via son LABEL ("LABEL=DATA"). Il doit attribuer cette étiquette à /dev/sdb1.',
    scenarioFr: 'L\'administrateur souhaite référencer une partition dans /etc/fstab via son LABEL ("LABEL=DATA"). Il doit attribuer cette étiquette à /dev/sdb1.',
    codeSnippet: `root@srv:~# setlabel /dev/sdb1 DATA
bash: setlabel: command not found`,
    language: 'bash',
    bugDescription: 'La commande appropriée pour étiqueter une partition ext2/ext3/ext4 est "e2label /dev/sdb1 DATA" (ou "tune2fs -L DATA /dev/sdb1").',
    bugDescriptionFr: 'La commande appropriée pour étiqueter une partition ext2/ext3/ext4 est "e2label /dev/sdb1 DATA" (ou "tune2fs -L DATA /dev/sdb1").',
    options: [
      {
        id: 'opt-1',
        label: 'Utiliser "e2label /dev/sdb1 DATA" ou "tune2fs -L DATA /dev/sdb1"',
        labelFr: 'Utiliser "e2label /dev/sdb1 DATA" ou "tune2fs -L DATA /dev/sdb1"',
        isCorrect: true,
        explanation: 'Les deux commandes officielles du programme e2fsprogs pour modifier l\'étiquette de volume sont e2label et tune2fs -L.',
        explanationFr: 'Les deux commandes officielles du programme e2fsprogs pour modifier l\'étiquette de volume sont e2label et tune2fs -L.'
      },
      {
        id: 'opt-2',
        label: 'Utiliser fdisk -l DATA',
        labelFr: 'Utiliser fdisk -l DATA',
        isCorrect: false,
        explanation: 'fdisk gère les tables de partitions du disque, pas les métadonnées internes du filesystem.',
        explanationFr: 'fdisk gère les tables de partitions du disque, pas les métadonnées internes du filesystem.'
      },
      {
        id: 'opt-3',
        label: 'Il faut obligatoirement reformater le disque avec mkfs.ext4 -L DATA',
        labelFr: 'Il faut obligatoirement reformater le disque avec mkfs.ext4 -L DATA',
        isCorrect: false,
        explanation: 'e2label permet de renommer l\'étiquette à chaud ou à froid sans perdre aucune donnée.',
        explanationFr: 'e2label permet de renommer l\'étiquette à chaud ou à froid sans perdre aucune donnée.'
      },
      {
        id: 'opt-4',
        label: 'Éditer directement /dev/sdb1 avec nano',
        labelFr: 'Éditer directement /dev/sdb1 avec nano',
        isCorrect: false,
        explanation: 'Éditer un périphérique bloc brut avec un traitement de texte détruit la géométrie du disque.',
        explanationFr: 'Éditer un périphérique bloc brut avec un traitement de texte détruit la géométrie du disque.'
      }
    ],
    correctedSnippet: `e2label /dev/sdb1 DATA
# ou :
tune2fs -L DATA /dev/sdb1`,
    fixExplanation: '"e2label" ou "tune2fs -L" modifie proprement le champ s_volume_name du super-bloc.',
    fixExplanationFr: '"e2label" ou "tune2fs -L" modifie proprement le champ s_volume_name du super-bloc.'
  },
  {
    id: 'tb-lpic1-104-11',
    title: 'Suppression d\'un fichier ouvert dont l\'espace n\'est pas libéré (df vs du)',
    titleFr: 'Espace disque non libéré après suppression d\'un gros fichier encore ouvert par un processus',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.2',
    category: 'Devices & Filesystems',
    scenario: 'L\'administrateur supprime un fichier log de 40 Go avec "rm /var/log/access.log". Pourtant, "df -h" montre que les 40 Go sont toujours occupés.',
    scenarioFr: 'L\'administrateur supprime un fichier log de 40 Go avec "rm /var/log/access.log". Pourtant, "df -h" montre que les 40 Go sont toujours occupés.',
    codeSnippet: `root@srv:~# rm /var/log/access.log
root@srv:~# df -h /var
/dev/sda2        50G   45G  2.5G  95% /var
# L'espace n'a pas diminué !`,
    language: 'bash',
    bugDescription: 'Sous Linux, tant qu\'un processus maintient le descripteur de fichier ouvert, les blocs restent alloués. Pour libérer l\'espace, il faut redémarrer le processus ou vider le fichier.',
    bugDescriptionFr: 'Sous Linux, tant qu\'un processus maintient le descripteur de fichier ouvert, les blocs restent alloués. Pour libérer l\'espace, il faut redémarrer le processus ou vider le fichier.',
    options: [
      {
        id: 'opt-1',
        label: 'Un processus détient encore le fichier ouvert ; identifier le processus avec "lsof +L1" ou "lsof | grep deleted" et redémarrer son service',
        labelFr: 'Un processus détient encore le fichier ouvert ; identifier le processus avec "lsof +L1" ou "lsof | grep deleted" et redémarrer son service',
        isCorrect: true,
        explanation: 'En Unix, la suppression d\'un fichier détache son nom de l\'inode (unlink). La libération effective des blocs physiques n\'a lieu que lorsque le compteur de descripteurs ouverts tombe à zéro.',
        explanationFr: 'En Unix, la suppression d\'un fichier détache son nom de l\'inode (unlink). La libération effective des blocs physiques n\'a lieu que lorsque le compteur de descripteurs ouverts tombe à zéro.'
      },
      {
        id: 'opt-2',
        label: 'Exécuter "rm -f /var/log/access.log" une seconde fois',
        labelFr: 'Exécuter "rm -f /var/log/access.log" une seconde fois',
        isCorrect: false,
        explanation: 'Le nom de fichier n\'existe déjà plus dans le répertoire d\'entrée.',
        explanationFr: 'Le nom de fichier n\'existe déjà plus dans le répertoire d\'entrée.'
      },
      {
        id: 'opt-3',
        label: 'Vider la corbeille de Linux avec trash-empty',
        labelFr: 'Vider la corbeille de Linux avec trash-empty',
        isCorrect: false,
        explanation: 'La commande rm classique ne déplace rien dans une corbeille.',
        explanationFr: 'La commande rm classique ne déplace rien dans une corbeille.'
      },
      {
        id: 'opt-4',
        label: 'Le système de fichiers ext4 met 24 heures à libérer les blocs',
        labelFr: 'Le système de fichiers ext4 met 24 heures à libérer les blocs',
        isCorrect: false,
        explanation: 'La libération est instantanée dès que le processus ferme le descripteur.',
        explanationFr: 'La libération est instantanée dès que le processus ferme le descripteur.'
      }
    ],
    correctedSnippet: `root@srv:~# lsof +L1
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NLINK   NODE NAME
nginx    1234  www    4w   REG    8,2 42949672     0 524100 /var/log/access.log (deleted)
root@srv:~# systemctl reload nginx`,
    fixExplanation: 'Recharger ou redémarrer le service permet de clore le handle ouvert et de libérer instantanément les blocs disque.',
    fixExplanationFr: 'Recharger ou redémarrer le service permet de clore le handle ouvert et de libérer instantanément les blocs disque.'
  },
  {
    id: 'tb-lpic1-104-12',
    title: 'Standard de hiérarchie des fichiers (FHS) : emplacement des fichiers temporaires conservés au redémarrage',
    titleFr: 'Fichiers supprimés au redémarrage dans /tmp au lieu d\'utiliser /var/tmp',
    certification: 'lpic-1',
    topicNumber: 104,
    objectiveId: '104.7',
    category: 'Devices & Filesystems',
    scenario: 'Une tâche applicative place des fichiers d\'état dans "/tmp". Après le redémarrage nocturne du serveur, ces fichiers ont disparu, perturbant le service.',
    scenarioFr: 'Une tâche applicative place des fichiers d\'état dans "/tmp". Après le redémarrage nocturne du serveur, ces fichiers ont disparu, perturbant le service.',
    codeSnippet: `# Selon la norme FHS (Filesystem Hierarchy Standard) :
/tmp      -> fichiers temporaires effacés au reboot ou montés en tmpfs (RAM)
/var/tmp  -> fichiers temporaires conservés entre les redémarrages`,
    language: 'config',
    bugDescription: 'Selon la norme FHS, "/tmp" est volatile (souvent en tmpfs) et purgé au démarrage, alors que "/var/tmp" est conçu pour préserver les fichiers temporaires persistants.',
    bugDescriptionFr: 'Selon la norme FHS, "/tmp" est volatile (souvent en tmpfs) et purgé au démarrage, alors que "/var/tmp" est conçu pour préserver les fichiers temporaires persistants.',
    options: [
      {
        id: 'opt-1',
        label: 'Déplacer les fichiers vers "/var/tmp" qui garantit la préservation des fichiers temporaires à travers les redémarrages système',
        labelFr: 'Déplacer les fichiers vers "/var/tmp" qui garantit la préservation des fichiers temporaires à travers les redémarrages système',
        isCorrect: true,
        explanation: 'Le standard FHS stipule formellement que /var/tmp préserve les données temporaires entre les boots, alors que /tmp peut être vidé à tout moment ou monté sur tmpfs.',
        explanationFr: 'Le standard FHS stipule formellement que /var/tmp préserve les données temporaires entre les boots, alors que /tmp peut être vidé à tout moment ou monté sur tmpfs.'
      },
      {
        id: 'opt-2',
        label: 'Mettre les fichiers dans /dev/shm',
        labelFr: 'Mettre les fichiers dans /dev/shm',
        isCorrect: false,
        explanation: '/dev/shm est une mémoire partagée en RAM pure, également volatile.',
        explanationFr: '/dev/shm est une mémoire partagée en RAM pure, également volatile.'
      },
      {
        id: 'opt-3',
        label: 'Créer un fichier .keep dans /tmp',
        labelFr: 'Créer un fichier .keep dans /tmp',
        isCorrect: false,
        explanation: 'Les règles de purge tmpfs ou systemd-tmpfiles effacent sans exception.',
        explanationFr: 'Les règles de purge tmpfs ou systemd-tmpfiles effacent sans exception.'
      },
      {
        id: 'opt-4',
        label: 'Le FHS interdit de stocker des fichiers dans /var/tmp',
        labelFr: 'Le FHS interdit de stocker des fichiers dans /var/tmp',
        isCorrect: false,
        explanation: '/var/tmp est explicitement défini par le FHS pour les données temporaires persistantes.',
        explanationFr: '/var/tmp est explicitement défini par le FHS pour les données temporaires persistantes.'
      }
    ],
    correctedSnippet: `# Utiliser /var/tmp pour les fichiers devant survivre au redémarrage :
DIR="/var/tmp/myapp_state"
mkdir -p "$DIR"`,
    fixExplanation: 'Utiliser /var/tmp respecte le standard FHS et protège les données contre l\'effacement au boot.',
    fixExplanationFr: 'Utiliser /var/tmp respecte le standard FHS et protège les données contre l\'effacement au boot.'
  }
];
