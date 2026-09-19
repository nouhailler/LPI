import { IncidentScenario } from '../../types';

export const lpic3IncidentScenarios: IncidentScenario[] = [
  // =========================================================================
  // INCIDENT 13 : SÉCURITÉ SELINUX - BLOCAGE SILENCIEUX (HTTP 403 FORBIDDEN)
  // =========================================================================
  {
    id: 'incident-13-selinux-web-denial',
    title: 'Security Alert: HTTP 403 Forbidden on Nginx Despite chmod 755 (SELinux AVC Denial)',
    titleFr: 'Alerte Sécurité : HTTP 403 Forbidden sur Nginx malgré chmod 755 (Blocage SELinux AVC)',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.1',
    category: 'security',
    context:
      'A new web application directory was deployed to /srv/www/customer_portal. Standard Linux file permissions are verified as 755 owned by nginx:nginx. Yet visitors receive HTTP 403 Forbidden on all static pages and Nginx logs "13: Permission denied".',
    contextFr:
      'Une nouvelle application web a été déployée dans /srv/www/customer_portal. Les permissions Unix classiques sont vérifiées (755 avec propriétaire nginx:nginx). Pourtant, les requêtes HTTP renvoient 403 Forbidden et le log Nginx indique "13: Permission denied".',
    symptoms: [
      'Browsers receive HTTP 403 Forbidden when requesting /index.html',
      'Nginx error.log: open() "/srv/www/customer_portal/index.html" failed (13: Permission denied)',
      'ls -ld /srv/www/customer_portal shows: drwxr-xr-x 2 nginx nginx',
      'The file can be read normally by root using cat, but the web server daemon cannot access it'
    ],
    symptomsFr: [
      'Les navigateurs reçoivent une erreur HTTP 403 Forbidden sur /index.html',
      'Nginx error.log : open() "/srv/www/customer_portal/index.html" failed (13: Permission denied)',
      'ls -ld /srv/www/customer_portal indique : drwxr-xr-x 2 nginx nginx',
      'Le fichier peut être lu directement en root avec "cat", mais le démon Nginx se fait refuser l\'accès'
    ],
    diagnosticCommands: [
      {
        command: 'sestatus',
        aliases: ['getenforce'],
        category: 'security',
        isKeyEvidence: true,
        output: `SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      33`,
        analysis:
          'SELinux is enabled and in "enforcing" mode! When SELinux is enforcing, standard discretionary access control (DAC - chmod/chown) is not enough; Mandatory Access Control (MAC) labels must also allow access.',
        analysisFr:
          'SELinux est actif et en mode "enforcing" ! En mode enforcing, les permissions Unix classiques (DAC - chmod/chown) ne suffisent pas ; le contrôle d\'accès obligatoire (MAC) et les contextes doivent autoriser le démon.'
      },
      {
        command: 'ls -laZ /srv/www/customer_portal',
        aliases: ['ls -lZ /srv/www/customer_portal', 'ls -Z'],
        category: 'security',
        isKeyEvidence: true,
        output: `total 16
drwxr-xr-x. 2 nginx nginx unconfined_u:object_r:default_t:s0 4096 Sep 18 13:00 .
drwxr-xr-x. 3 root  root  system_u:object_r:var_t:s0         4096 Sep 18 12:58 ..
-rw-r--r--. 1 nginx nginx unconfined_u:object_r:default_t:s0 2410 Sep 18 13:00 index.html
-rw-r--r--. 1 nginx nginx unconfined_u:object_r:default_t:s0 1842 Sep 18 13:00 style.css`,
        analysis:
          'CRITICAL EVIDENCE! The SELinux type label is "default_t" (unconfined_u:object_r:default_t:s0). Nginx runs in the "httpd_t" domain. The SELinux targeted policy strictly forbids httpd_t from reading default_t or var_t labels! Web content must be labeled "httpd_sys_content_t".',
        analysisFr:
          'PREUVE CRITIQUE ! Le label SELinux est "default_t". Nginx s\'exécute dans le domaine de sécurité "httpd_t". La politique targeted interdit strictement à httpd_t de lire des fichiers typés default_t ! Le contenu web doit impérativement porter le type "httpd_sys_content_t".'
      },
      {
        command: 'ausearch -m avc -ts recent',
        aliases: ['grep "AVC" /var/log/audit/audit.log | tail', 'audit2why < /var/log/audit/audit.log'],
        category: 'logs',
        isKeyEvidence: true,
        output: `----
time->Fri Sep 18 13:04:18 2026
type=AVC msg=audit(1726664658.821:492): avc:  denied  { read } for  pid=1142 comm="nginx" name="index.html" dev="sda1" ino=394812 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:default_t:s0 tclass=file permissive=0`,
        analysis:
          'The Linux audit log confirms an AVC denial: Nginx (httpd_t) requested "read" on "index.html" labeled with target context "default_t". Because permissive=0 (enforcing), the kernel blocked the read.',
        analysisFr:
          'Le journal d\'audit confirme le refus AVC : Nginx (httpd_t) a demandé un accès en lecture sur "index.html" étiqueté "default_t". Permissive=0 étant actif, le noyau a immédiatement bloqué l\'appel système.'
      },
      {
        command: 'semanage fcontext -l | grep httpd_sys_content_t | head -n 5',
        aliases: ['matchpathcon /srv/www/customer_portal'],
        category: 'security',
        output: `/var/www(/.*)?                                     all files          system_u:object_r:httpd_sys_content_t:s0 
/srv/gallery(/.*)?                                 all files          system_u:object_r:httpd_sys_content_t:s0 
/usr/share/nginx/html(/.*)?                        all files          system_u:object_r:httpd_sys_content_t:s0`,
        analysis:
          'Default paths like /var/www/ are pre-configured in the policy, but custom paths like /srv/www/customer_portal require adding a persistent file context rule via "semanage fcontext".',
        analysisFr:
          'Les chemins standards comme /var/www/ sont pré-enregistrés dans la politique SELinux, mais les chemins personnalisés comme /srv/www/ nécessitent l\'ajout d\'une règle permanente via "semanage fcontext".'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Inspecter les attributs de sécurité étendus',
        titleFr: 'Inspecter les attributs de sécurité étendus',
        hint: 'Quand chmod 755 est correct mais que Nginx renvoie "Permission denied", pensez au contrôle d\'accès obligatoire. Lancez "sestatus" et "ls -laZ /srv/www/customer_portal".',
        hintFr: 'Quand chmod 755 est correct mais que Nginx renvoie "Permission denied", pensez au contrôle d\'accès obligatoire. Lancez "sestatus" et "ls -laZ /srv/www/customer_portal".',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Interpréter l\'étiquette de type (default_t vs httpd_sys_content_t)',
        titleFr: 'Interpréter l\'étiquette de type (default_t vs httpd_sys_content_t)',
        hint: 'Le type default_t est attribué aux fichiers créés dans des dossiers sans règle définie. Pour que Nginx puisse lire le contenu, le type SELinux doit être httpd_sys_content_t.',
        hintFr: 'Le type default_t est attribué aux fichiers créés dans des dossiers sans règle définie. Pour que Nginx puisse lire le contenu, le type SELinux doit être httpd_sys_content_t.',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Appliquer la politique de manière pérenne',
        titleFr: 'Appliquer la politique de manière pérenne',
        hint: 'Ne pas désactiver SELinux ! Enregistrez la règle permanente : "semanage fcontext -a -t httpd_sys_content_t \'/srv/www/customer_portal(/.*)?\'" puis appliquez-la avec "restorecon -Rv /srv/www/customer_portal".',
        hintFr: 'Ne pas désactiver SELinux ! Enregistrez la règle permanente : "semanage fcontext -a -t httpd_sys_content_t \'/srv/www/customer_portal(/.*)?\'" puis appliquez-la avec "restorecon -Rv /srv/www/customer_portal".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause du refus d\'accès HTTP 403',
        titleFr: '1. Cause du refus d\'accès HTTP 403',
        question: 'Pourquoi Nginx ne peut-il pas servir index.html malgré le chmod 755 ?',
        questionFr: 'Pourquoi Nginx ne peut-il pas servir index.html malgré le chmod 755 ?',
        options: [
          {
            id: 'opt-131a',
            text: 'SELinux est en mode Enforcing et les fichiers portent le contexte default_t au lieu de httpd_sys_content_t, déclenchant un refus AVC par le noyau.',
            textFr: 'SELinux est en mode Enforcing et les fichiers portent le contexte default_t au lieu de httpd_sys_content_t, déclenchant un refus AVC par le noyau.',
            isCorrect: true,
            feedback: 'Exactement ! Le domaine httpd_t n\'a pas le droit d\'accéder aux fichiers default_t.'
          },
          {
            id: 'opt-131b',
            text: 'Le fichier index.html est chiffré avec GPG.',
            textFr: 'Le fichier index.html est chiffré avec GPG.',
            isCorrect: false,
            feedback: 'Faux : cat peut lire le fichier sans problème en console locale.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Remédiation conforme aux règles de sécurité',
        titleFr: '2. Remédiation conforme aux règles de sécurité',
        question: 'Quelle est la méthode recommandée pour corriger les labels sans compromettre la sécurité du serveur ?',
        questionFr: 'Quelle est la méthode recommandée pour corriger les labels sans compromettre la sécurité du serveur ?',
        options: [
          {
            id: 'opt-132a',
            text: 'semanage fcontext -a -t httpd_sys_content_t "/srv/www/customer_portal(/.*)?" && restorecon -Rv /srv/www/customer_portal',
            textFr: 'semanage fcontext -a -t httpd_sys_content_t "/srv/www/customer_portal(/.*)?" && restorecon -Rv /srv/www/customer_portal',
            isCorrect: true,
            feedback: 'Parfait ! semanage enregistre la règle dans la base de politique et restorecon applique les contextes.'
          },
          {
            id: 'opt-132b',
            text: 'setenforce 0',
            textFr: 'setenforce 0',
            isCorrect: false,
            feedback: 'Mauvaise pratique rejetée en LPIC-3 ! Désactiver globalement SELinux affaiblit tout le système.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Persistance après redémarrage',
        titleFr: '3. Persistance après redémarrage',
        question: 'Pourquoi l\'utilisation simple de "chcon" est-elle insuffisante pour une installation permanente ?',
        questionFr: 'Pourquoi l\'utilisation simple de "chcon" est-elle insuffisante pour une installation permanente ?',
        options: [
          {
            id: 'opt-133a',
            text: 'chcon ne modifie que les attributs en mémoire/inode temporaires ; lors du prochain autorelabel ou restorecon, les fichiers régresseraient vers default_t.',
            textFr: 'chcon ne modifie que les attributs en mémoire/inode temporaires ; lors du prochain autorelabel ou restorecon, les fichiers régresseraient vers default_t.',
            isCorrect: true,
            feedback: 'Règle essentielle LPIC-3 : seul semanage fcontext persiste la définition dans la politique locale.'
          },
          {
            id: 'opt-133b',
            text: 'chcon nécessite d\'arrêter le service Nginx pendant 2 heures.',
            textFr: 'chcon nécessite d\'arrêter le service Nginx pendant 2 heures.',
            isCorrect: false,
            feedback: 'Non, chcon s\'exécute instantanément mais manque de persistance.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Le déploiement d\'un nouveau site web dans un chemin non standard (/srv/www) sous un système Red Hat / Enterprise Linux avec SELinux actif a provoqué un rejet HTTP 403. Les fichiers ont hérité du type default_t inaccessible par le domaine httpd_t.',
      timeline: [
        'T0: Copie des fichiers du site dans /srv/www/customer_portal via rsync.',
        'T+10s: Test de navigation et constat immédiat d\'erreur HTTP 403.',
        'T+2m: Vérification des permissions Unix 755 (trompeuse).',
        'T+4m: Analyse ausearch confirmant le déni AVC SELinux.',
        'T+6m: Enregistrement semanage et ré-étiquetage restorecon.'
      ],
      sysadminKeyTakeaways: [
        'Sur les distributions avec SELinux (RHEL, Rocky, Alma, Fedora), toujours vérifier les contextes étendus avec "ls -Z".',
        'Ne jamais céder à la tentation de passer en "setenforce 0" en production pour contourner un problème de contexte.',
        'Intégrer les commandes semanage fcontext dans les playbooks Ansible de déploiement d\'applications web.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 14 : SÉCURITÉ SSL/TLS - CHAÎNE INTERMÉDIAIRE & EXPIRATION
  // =========================================================================
  {
    id: 'incident-14-tls-chain-expired',
    title: 'TLS Outage: SEC_ERROR_UNKNOWN_ISSUER & Broken Certificate Chain in Nginx',
    titleFr: 'Panne TLS : SEC_ERROR_UNKNOWN_ISSUER & Chaîne de Certification Incomplète',
    severity: 'CRITICAL',
    timeLimitMinutes: 15,
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.1',
    category: 'security',
    context:
      'Mobile apps and automated API consumers are failing to connect to https://api.enterprise.com with "curl: (60) SSL certificate problem: unable to get local issuer certificate". Desktop browsers with cached intermediates work intermittently, but all mobile clients are locked out.',
    contextFr:
      'Les applications mobiles et les clients d\'API automatisés échouent à se connecter à https://api.enterprise.com avec l\'erreur "curl: (60) SSL certificate problem: unable to get local issuer certificate". Les navigateurs de bureau avec certificats intermédiaires en cache fonctionnent par intermittence, mais tous les clients stricts sont bloqués.',
    symptoms: [
      'curl https://api.enterprise.com fails with SSL certificate problem (60)',
      'Android / iOS mobile clients reject API requests with untrusted authority warnings',
      'Desktop Chrome intermittently shows a secure padlock due to AIA certificate caching',
      'The automated weekly certbot renew task failed with an authentication error'
    ],
    symptomsFr: [
      'curl https://api.enterprise.com échoue avec l\'erreur de certificat SSL (60)',
      'Les clients mobiles Android / iOS rejettent les requêtes API pour autorité non approuvée',
      'Chrome sur desktop affiche parfois le cadenas grâce au cache local AIA, masquant la panne',
      'Le renouvellement automatisé certbot n\'a pas pu valider le challenge HTTP-01'
    ],
    diagnosticCommands: [
      {
        command: 'openssl s_client -connect 127.0.0.1:443 -servername api.enterprise.com',
        aliases: ['openssl s_client -connect localhost:443', 'openssl s_client -showcerts'],
        category: 'security',
        isKeyEvidence: true,
        output: `CONNECTED(00000003)
depth=0 CN = api.enterprise.com
verify error:num=21:unable to verify the first certificate
verify return:1
---
Certificate chain
 0 s:CN = api.enterprise.com
   i:C = US, O = Let's Encrypt, CN = R3
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server certificate
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgISA8q...
-----END CERTIFICATE-----
subject=CN = api.enterprise.com
issuer=C = US, O = Let's Encrypt, CN = R3
---
SSL handshake has read 2140 bytes and written 394 bytes
Verification error: unable to verify the first certificate`,
        analysis:
          'SMOKING GUN! Look closely at the "Certificate chain" section: only Depth 0 is returned! The intermediate certificate "R3" from Let\'s Encrypt is completely missing from the TLS handshake. Verification fails with error 21: unable to verify the first certificate!',
        analysisFr:
          'PREUVE IRRÉFUTABLE ! Regardez la chaîne : seul le niveau Depth 0 est renvoyé par le serveur ! Le certificat intermédiaire "R3" de Let\'s Encrypt est absent du handshake TLS. La vérification échoue avec : "unable to verify the first certificate" !'
      },
      {
        command: 'grep -E "ssl_certificate" /etc/nginx/sites-available/api.conf',
        aliases: ['cat /etc/nginx/sites-available/api.conf', 'nginx -T | grep ssl_certificate'],
        category: 'security',
        isKeyEvidence: true,
        output: `    ssl_certificate /etc/letsencrypt/live/api.enterprise.com/cert.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.enterprise.com/privkey.pem;`,
        analysis:
          'FATAL CONFIGURATION DEFECT! Nginx is configured with "cert.pem" (which contains solely the leaf certificate). In Nginx, the ssl_certificate directive MUST point to "fullchain.pem", which bundles the server certificate AND intermediate authority certificates.',
        analysisFr:
          'DÉFAUT MAJEUR DE CONFIGURATION ! Nginx est configuré avec "cert.pem" (qui ne contient que le certificat feuille). Dans Nginx, la directive ssl_certificate DOIT pointer vers "fullchain.pem", qui regroupe le certificat serveur et les autorités intermédiaires.'
      },
      {
        command: 'openssl x509 -in /etc/letsencrypt/live/api.enterprise.com/cert.pem -noout -dates',
        aliases: ['openssl x509 -dates', 'certbot certificates'],
        category: 'security',
        output: `notBefore=Jun 20 10:14:02 2026 GMT
notAfter=Sep 18 10:14:02 2026 GMT`,
        analysis:
          'DOUBLE WHAMMY! notAfter was today at 10:14:02 GMT. The leaf certificate has literally expired 3 hours ago because certbot could not renew automatically.',
        analysisFr:
          'DOUBLE PEINE ! notAfter a expiré aujourd\'hui à 10:14 GMT. Le certificat a littéralement expiré il y a 3 heures car certbot n\'a pas pu se renouveler automatiquement.'
      },
      {
        command: 'cat /etc/letsencrypt/live/api.enterprise.com/fullchain.pem | grep -c "BEGIN CERTIFICATE"',
        aliases: ['grep "BEGIN CERTIFICATE" /etc/letsencrypt/live/api.enterprise.com/fullchain.pem'],
        category: 'security',
        output: `2`,
        analysis:
          'fullchain.pem exists and contains both certificates (Server + Intermediate R3). Pointing Nginx to fullchain.pem and triggering certbot renewal will completely fix the service.',
        analysisFr:
          'fullchain.pem existe bien et contient les 2 certificats (Serveur + Intermédiaire R3). Configurer Nginx sur fullchain.pem et lancer le renouvellement certbot résoudra l\'intégralité de l\'incident.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Tester la chaîne TLS en ligne de commande',
        titleFr: 'Tester la chaîne TLS en ligne de commande',
        hint: 'Exécutez "openssl s_client -connect 127.0.0.1:443 -servername api.enterprise.com". Regardez la section Certificate chain pour voir combien de certificats sont transmis.',
        hintFr: 'Exécutez "openssl s_client -connect 127.0.0.1:443 -servername api.enterprise.com". Regardez la section Certificate chain pour voir combien de certificats sont transmis.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Différence entre cert.pem et fullchain.pem',
        titleFr: 'Différence entre cert.pem et fullchain.pem',
        hint: 'Apache utilise parfois SSLCertificateChainFile, mais Nginx exige que "ssl_certificate" pointe vers le fichier combiné "fullchain.pem".',
        hintFr: 'Apache utilise parfois SSLCertificateChainFile, mais Nginx exige que "ssl_certificate" pointe vers le fichier combiné "fullchain.pem".',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Renouvellement et rechargement Nginx',
        titleFr: 'Renouvellement et rechargement Nginx',
        hint: 'Corrigez api.conf pour utiliser fullchain.pem, exécutez "certbot renew --nginx" puis rechargez Nginx avec "nginx -t && systemctl reload nginx".',
        hintFr: 'Corrigez api.conf pour utiliser fullchain.pem, exécutez "certbot renew --nginx" puis rechargez Nginx avec "nginx -t && systemctl reload nginx".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Analyse des erreurs TLS',
        titleFr: '1. Analyse des erreurs TLS',
        question: 'Pourquoi les clients API et téléphones mobiles rejettent-ils la connexion HTTPS ?',
        questionFr: 'Pourquoi les clients API et téléphones mobiles rejettent-ils la connexion HTTPS ?',
        options: [
          {
            id: 'opt-141a',
            text: 'Nginx n\'envoie que cert.pem (sans le certificat intermédiaire de l\'autorité R3) et le certificat a dépassé sa date de validité notAfter.',
            textFr: 'Nginx n\'envoie que cert.pem (sans le certificat intermédiaire de l\'autorité R3) et le certificat a dépassé sa date de validité notAfter.',
            isCorrect: true,
            feedback: 'Exact ! Sans la chaîne complète vers l\'autorité racine, les clients stricts rejettent la connexion.'
          },
          {
            id: 'opt-141b',
            text: 'Le protocole TLS 1.3 a été banni par l\'IETF.',
            textFr: 'Le protocole TLS 1.3 a été banni par l\'IETF.',
            isCorrect: false,
            feedback: 'Faux : TLS 1.3 est la norme moderne la plus sécurisée.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Directive Nginx requise',
        titleFr: '2. Directive Nginx requise',
        question: 'Vers quel fichier la directive ssl_certificate de Nginx doit-elle impérativement pointer ?',
        questionFr: 'Vers quel fichier la directive ssl_certificate de Nginx doit-elle impérativement pointer ?',
        options: [
          {
            id: 'opt-142a',
            text: 'fullchain.pem (contenant le certificat serveur suivi des certificats des AC intermédiaires).',
            textFr: 'fullchain.pem (contenant le certificat serveur suivi des certificats des AC intermédiaires).',
            isCorrect: true,
            feedback: 'Parfait ! Nginx transmet ainsi l\'arbre de confiance complet au client lors du handshake.'
          },
          {
            id: 'opt-142b',
            text: 'privkey.pem',
            textFr: 'privkey.pem',
            isCorrect: false,
            feedback: 'Attention ! privkey.pem est la clé privée secrète, elle doit être renseignée dans ssl_certificate_key.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Automatisation et surveillance',
        titleFr: '3. Automatisation et surveillance',
        question: 'Comment garantir le renouvellement sans coupure des certificats Let\'s Encrypt ?',
        questionFr: 'Comment garantir le renouvellement sans coupure des certificats Let\'s Encrypt ?',
        options: [
          {
            id: 'opt-143a',
            text: 'Configurer un timer systemd certbot.timer avec un hook de rechargement automatique (post-hook "systemctl reload nginx") et une sonde de monitoring à J-15.',
            textFr: 'Configurer un timer systemd certbot.timer avec un hook de rechargement automatique (post-hook "systemctl reload nginx") et une sonde de monitoring à J-15.',
            isCorrect: true,
            feedback: 'Excellente réponse LPIC-3 ! Le deploy-hook recharge Nginx dès que le certificat est renouvelé.'
          },
          {
            id: 'opt-143b',
            text: 'Générer un certificat auto-signé valide 50 ans.',
            textFr: 'Générer un certificat auto-signé valide 50 ans.',
            isCorrect: false,
            feedback: 'Inacceptable en production : les navigateurs et clients afficheront une alerte de sécurité rouge.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Une mauvaise configuration de Nginx (pointant sur cert.pem au lieu de fullchain.pem) cumulée à l\'échec silencieux du timer de renouvellement a provoqué l\'expiration du certificat de l\'API. Les clients stricts (iOS, Android, curl) ont interrompu leurs transactions.',
      timeline: [
        'T-3h: Expiration du certificat leaf (notAfter atteint).',
        'T0: Échecs massifs sur les applications mobiles et tickets d\'incident critiques.',
        'T+5m: Détection via openssl s_client révélant l\'absence d\'émetteur intermédiaire.',
        'T+8m: Mise à jour de la configuration Nginx vers fullchain.pem.',
        'T+12m: Renouvellement forcé via certbot et rechargement Nginx.'
      ],
      sysadminKeyTakeaways: [
        'Toujours utiliser "fullchain.pem" pour la directive ssl_certificate dans Nginx.',
        'Tester régulièrement ses endpoints avec "openssl s_client -connect" ou testssl.sh pour vérifier la chaîne.',
        'Surveiller l\'expiration des certificats SSL par une sonde Blackbox Prometheus au moins 20 jours avant échéance.'
      ]
    }
  },

  // =========================================================================
  // INCIDENT 15 : SÉCURITÉ RÉSEAU - BANNISSEMENT INOPINÉ PAR FAIL2BAN
  // =========================================================================
  {
    id: 'incident-15-fail2ban-iptables-lockout',
    title: 'Security Lockout: System Administrators Banned from SSH by Fail2ban (Missing ignoreip)',
    titleFr: 'Verrouillage Sécurité : Équipe d\'Astreinte Bannie de SSH par Fail2ban (ignoreip manquant)',
    severity: 'HIGH',
    timeLimitMinutes: 15,
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.2',
    category: 'security',
    context:
      'During a distributed brute-force attack on port 22, legitimate administrators connecting from the corporate VPN (198.51.100.50) were suddenly locked out. SSH connections from their subnet hang and time out without showing any password prompt.',
    contextFr:
      'Pendant une vague d\'attaques par force brute sur le port 22, les administrateurs légitimes connectés depuis la passerelle VPN d\'entreprise (198.51.100.50) ont été soudainement expulsés. Leurs connexions SSH expirent (Connection timed out) sans même afficher d\'invite.',
    symptoms: [
      'SSH connections from office/VPN IP 198.51.100.50 hang: "ssh: connect to host prod port 22: Connection timed out"',
      'Console access (iLO / IPMI / Hypervisor VNC) still works normally',
      'The server is under heavy automated attack from botnets testing default passwords',
      'Fail2ban service is active and processing authentication logs'
    ],
    symptomsFr: [
      'Les connexions SSH depuis l\'IP du VPN (198.51.100.50) bloquent : "Connection timed out"',
      'L\'accès par console physique (iLO, IPMI ou console VM) fonctionne parfaitement',
      'Le serveur subit un scan agressif de botnet tentant des connexions root',
      'Le service Fail2ban est actif et analyse en continu /var/log/auth.log'
    ],
    diagnosticCommands: [
      {
        command: 'fail2ban-client status sshd',
        aliases: ['fail2ban-client status', 'fail2ban-client status ssh'],
        category: 'security',
        isKeyEvidence: true,
        output: `Status for the jail: sshd
|- Filter
|  |- Currently failed: 12
|  |- Total failed:     842
|  \`- File list:        /var/log/auth.log
\`- Actions
   |- Currently banned: 43
   |- Total banned:     156
   \`- Banned IP list:   203.0.113.14 192.0.2.88 198.51.100.50 45.33.32.156 ...`,
        analysis:
          'SMOKING GUN! In the Banned IP list, find "198.51.100.50". The corporate VPN IP has been banned by the sshd jail! Because several admins were reconnecting or an automation script failed authentication, Fail2ban triggered.',
        analysisFr:
          'PREUVE ÉCLATANTE ! Dans la liste des IP bannies, observez "198.51.100.50". L\'IP publique de la passerelle VPN de l\'entreprise a été bannie par la prison sshd !'
      },
      {
        command: 'iptables -L f2b-sshd -n -v',
        aliases: ['iptables -L -n -v | grep 198.51.100.50', 'nft list ruleset'],
        category: 'security',
        isKeyEvidence: true,
        output: `Chain f2b-sshd (1 references)
 pkts bytes target     prot opt in     out     source               destination         
  128  7680 REJECT     all  --  *      *       198.51.100.50        0.0.0.0/0            reject-with icmp-port-unreachable
 1420 85200 REJECT     all  --  *      *       203.0.113.14         0.0.0.0/0            reject-with icmp-port-unreachable
14800  980K RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0`,
        analysis:
          'The Linux kernel firewall iptables shows an explicit REJECT rule dropping all packets from 198.51.100.50 with icmp-port-unreachable, explaining why SSH connections hang immediately.',
        analysisFr:
          'Le pare-feu iptables confirme la règle REJECT bloquant tous les paquets provenant de 198.51.100.50, expliquant pourquoi les connexions SSH de l\'équipe expirent.'
      },
      {
        command: 'grep -E "^ignoreip" /etc/fail2ban/jail.local',
        aliases: ['cat /etc/fail2ban/jail.local | grep ignoreip', 'grep ignoreip /etc/fail2ban/jail.conf'],
        category: 'security',
        output: `ignoreip = 127.0.0.1/8 ::1`,
        analysis:
          'Configuration omission: "ignoreip" only whitelists localhost! It completely lacks the enterprise VPN network CIDR 198.51.100.0/24.',
        analysisFr:
          'Omission de configuration : "ignoreip" ne liste que localhost ! Il manque le sous-réseau du VPN d\'administration 198.51.100.0/24.'
      }
    ],
    progressiveHints: [
      {
        level: 1,
        title: 'Vérifier la prison Fail2ban',
        titleFr: 'Vérifier la prison Fail2ban',
        hint: 'Interrogez le statut de la prison SSH avec "fail2ban-client status sshd" pour inspecter la liste des adresses IP actuellement bannies.',
        hintFr: 'Interrogez le statut de la prison SSH avec "fail2ban-client status sshd" pour inspecter la liste des adresses IP actuellement bannies.',
        penaltyPoints: 5
      },
      {
        level: 2,
        title: 'Débannir l\'adresse IP d\'urgence',
        titleFr: 'Débannir l\'adresse IP d\'urgence',
        hint: 'Pour rétablir l\'accès immédiatement sans redémarrer le service : "fail2ban-client set sshd unbanip 198.51.100.50".',
        hintFr: 'Pour rétablir l\'accès immédiatement sans redémarrer le service : "fail2ban-client set sshd unbanip 198.51.100.50".',
        penaltyPoints: 10
      },
      {
        level: 3,
        title: 'Ajout de l\'IP dans la liste blanche permanente',
        titleFr: 'Ajout de l\'IP dans la liste blanche permanente',
        hint: 'Ajoutez "ignoreip = 127.0.0.1/8 ::1 198.51.100.0/24" dans /etc/fail2ban/jail.local puis exécutez "fail2ban-client reload".',
        hintFr: 'Ajoutez "ignoreip = 127.0.0.1/8 ::1 198.51.100.0/24" dans /etc/fail2ban/jail.local puis exécutez "fail2ban-client reload".',
        penaltyPoints: 15
      }
    ],
    rcaQuestions: [
      {
        id: 'q1',
        type: 'root_cause',
        title: '1. Cause du bannissement de l\'équipe',
        titleFr: '1. Cause du bannissement de l\'équipe',
        question: 'Pourquoi l\'adresse IP de la passerelle VPN a-t-elle été bloquée ?',
        questionFr: 'Pourquoi l\'adresse IP de la passerelle VPN a-t-elle été bloquée ?',
        options: [
          {
            id: 'opt-151a',
            text: 'L\'adresse IP du VPN n\'était pas inscrite dans la directive ignoreip ; plusieurs échecs d\'authentification successifs ont déclenché l\'insertion d\'une règle REJECT dans iptables.',
            textFr: 'L\'adresse IP du VPN n\'était pas inscrite dans la directive ignoreip ; plusieurs échecs d\'authentification successifs ont déclenché l\'insertion d\'une règle REJECT dans iptables.',
            isCorrect: true,
            feedback: 'Exact ! Fail2ban applique aveuglément sa politique si l\'IP n\'est pas en liste blanche.'
          },
          {
            id: 'opt-151b',
            text: 'Le port SSH a été changé de 22 à 2222 par un pirate.',
            textFr: 'Le port SSH a été changé de 22 à 2222 par un pirate.',
            isCorrect: false,
            feedback: 'Faux : la règle iptables prouve le bannissement actif.'
          }
        ]
      },
      {
        id: 'q2',
        type: 'immediate_action',
        title: '2. Commande de déblocage immédiat',
        titleFr: '2. Commande de déblocage immédiat',
        question: 'Quelle commande permet de réautoriser immédiatement l\'IP sans interrompre la protection des autres jails ?',
        questionFr: 'Quelle commande permet de réautoriser immédiatement l\'IP sans interrompre la protection des autres jails ?',
        options: [
          {
            id: 'opt-152a',
            text: 'fail2ban-client set sshd unbanip 198.51.100.50',
            textFr: 'fail2ban-client set sshd unbanip 198.51.100.50',
            isCorrect: true,
            feedback: 'Parfait ! L\'IP est retirée à la volée d\'iptables et de la base Fail2ban.'
          },
          {
            id: 'opt-152b',
            text: 'iptables -F',
            textFr: 'iptables -F',
            isCorrect: false,
            feedback: 'Extrêmement dangereux : vide toutes les règles du pare-feu et expose le serveur sans protection.'
          }
        ]
      },
      {
        id: 'q3',
        type: 'long_term_fix',
        title: '3. Configuration durable de la liste blanche',
        titleFr: '3. Configuration durable de la liste blanche',
        question: 'Comment inscrire durablement le sous-réseau VPN dans Fail2ban ?',
        questionFr: 'Comment inscrire durablement le sous-réseau VPN dans Fail2ban ?',
        options: [
          {
            id: 'opt-153a',
            text: 'Définir "ignoreip = 127.0.0.1/8 ::1 198.51.100.0/24" dans la section [DEFAULT] de /etc/fail2ban/jail.local et recharger avec "fail2ban-client reload".',
            textFr: 'Définir "ignoreip = 127.0.0.1/8 ::1 198.51.100.0/24" dans la section [DEFAULT] de /etc/fail2ban/jail.local et recharger avec "fail2ban-client reload".',
            isCorrect: true,
            feedback: 'Excellent ! Toutes les prisons hériteront de cette exclusion permanente.'
          },
          {
            id: 'opt-153b',
            text: 'Désactiver le service fail2ban.',
            textFr: 'Désactiver le service fail2ban.',
            isCorrect: false,
            feedback: 'Non, désactiver la détection d\'intrusion laisse le serveur vulnérable aux attaques par force brute.'
          }
        ]
      }
    ],
    postMortemReport: {
      summary:
        'Suite à une vague de scans externes couplée à quelques tentatives erronées de connexion depuis le VPN d\'entreprise, l\'IP publique du siège a été automatiquement bannie par la jail sshd de Fail2ban en raison d\'un paramètre ignoreip restrictif.',
      timeline: [
        'T0: Début d\'une campagne de scan SSH sur le port 22.',
        'T+3m: 5 échecs de saisie de mot de passe depuis le VPN d\'entreprise.',
        'T+3m05s: Fail2ban insère la règle de rejet iptables pour 198.51.100.50.',
        'T+4m: Coupure de tous les accès administrateurs distants.',
        'T+8m: Connexion via console de secours et exécution de fail2ban-client unbanip.',
        'T+12m: Ajout du subnet VPN dans ignoreip et reload.'
      ],
      sysadminKeyTakeaways: [
        'Toujours inscrire les plages IP fixes d\'administration (VPN, bastions, monitoring) dans la directive ignoreip de jail.local.',
        'Activer l\'authentification par clés SSH uniquement (PasswordAuthentication no) pour neutraliser les attaques par dictionnaire.',
        'Maintenir un accès console hors bande (IPMI / iLO / console cloud) testé et fonctionnel.'
      ]
    }
  }
];
