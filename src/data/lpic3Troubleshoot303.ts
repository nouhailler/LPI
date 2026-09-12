import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-3 : Examen 303 (Sécurité des Systèmes et des Réseaux d'Entreprise)
 * Topics couverts :
 * - Topic 325 : Cryptographie (OpenSSL X.509, CA, CRL, OCSP, LUKS, dm-crypt)
 * - Topic 326 : Sécurité de l'hôte (Durcissement sysctl, auditd, AIDE, pam_faillock)
 * - Topic 327 : Contrôle d'accès (SELinux AVC denials, restorecon, audit2allow, AppArmor, POSIX ACLs)
 * - Topic 328 : Sécurité réseau (nftables, iptables, Snort, Suricata, OpenVPN, WireGuard)
 */
export const lpic3Troubleshoot303: TroubleshootingChallenge[] = [
  {
    id: 'tb-lpic3-303-01',
    title: 'Refus SELinux AVC pour un port personnalisé Nginx',
    titleFr: 'Refus SELinux AVC pour un port personnalisé Nginx',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.2',
    category: 'SELinux Port Context & Networking',
    scenario: 'L\'administrateur configure Nginx pour écouter sur le port TCP 8443 au lieu du port standard 443. Lors du lancement, Nginx échoue avec "nginx: [emerg] bind() to 0.0.0.0:8443 failed (13: Permission denied)". getenforce retourne "Enforcing".',
    scenarioFr: 'L\'administrateur configure Nginx pour écouter sur le port TCP 8443 au lieu du port standard 443. Lors du lancement, Nginx échoue avec "nginx: [emerg] bind() to 0.0.0.0:8443 failed (13: Permission denied)". getenforce retourne "Enforcing".',
    codeSnippet: `# semanage port -l | grep http_port_t
http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443 (absent)

# audit2why < /var/log/audit/audit.log
type=AVC msg=audit(1694200000.123:456): avc:  denied  { name_bind } for  pid=1234 comm="nginx" src=8443 scontext=system_u:system_r:httpd_t:s0 tcontext=system_u:object_r:unreserved_port_t:s0 tclass=tcp_socket permissive=0
    Was caused by:
    Port 8443 is not defined in SELinux policy for httpd_t.`,
    language: 'config',
    bugDescription: 'Le port TCP 8443 n\'est pas associé au type SELinux http_port_t dans la politique active de ports réseau.',
    bugDescriptionFr: 'Le port TCP 8443 n\'est pas associé au type SELinux http_port_t dans la politique active de ports réseau.',
    options: [
      {
        id: 'opt-1',
        label: 'SELinux bloque la liaison (name_bind) car le port 8443 n\'est pas étiqueté avec le type http_port_t dans la politique',
        labelFr: 'SELinux bloque la liaison (name_bind) car le port 8443 n\'est pas étiqueté avec le type http_port_t dans la politique',
        isCorrect: true,
        explanation: 'Dans SELinux, les démons confinés (comme httpd_t) ne peuvent binder que sur les ports autorisés par leur politique réseau. Il faut utiliser "semanage port -a -t http_port_t -p tcp 8443".',
        explanationFr: 'Dans SELinux, les démons confinés (comme httpd_t) ne peuvent binder que sur les ports autorisés par leur politique réseau. Il faut utiliser "semanage port -a -t http_port_t -p tcp 8443".'
      },
      {
        id: 'opt-2',
        label: 'Le port 8443 est réservé exclusivement au protocole HTTP3 UDP et ne supporte pas TCP',
        labelFr: 'Le port 8443 est réservé exclusivement au protocole HTTP3 UDP et ne supporte pas TCP',
        isCorrect: false,
        explanation: '8443 est un port alternatif standard couramment utilisé en TCP pour HTTPS.',
        explanationFr: '8443 est un port alternatif standard couramment utilisé en TCP pour HTTPS.'
      },
      {
        id: 'opt-3',
        label: 'Nginx ne peut être exécuté qu\'avec setenforce 0',
        labelFr: 'Nginx ne peut être exécuté qu\'avec setenforce 0',
        isCorrect: false,
        explanation: 'Désactiver SELinux en production est une très mauvaise pratique contraire aux objectifs LPIC-3.',
        explanationFr: 'Désactiver SELinux en production est une très mauvaise pratique contraire aux objectifs LPIC-3.'
      },
      {
        id: 'opt-4',
        label: 'Le contexte du binaire /usr/sbin/nginx doit être changé en unconfined_t',
        labelFr: 'Le contexte du binaire /usr/sbin/nginx doit être changé en unconfined_t',
        isCorrect: false,
        explanation: 'Supprimer le confinement d\'un démon web est une faille de sécurité majeure.',
        explanationFr: 'Supprimer le confinement d\'un démon web est une faille de sécurité majeure.'
      }
    ],
    correctedSnippet: `semanage port -a -t http_port_t -p tcp 8443
systemctl restart nginx`,
    fixExplanation: 'Associer le port TCP 8443 au type SELinux http_port_t avec la commande semanage port.',
    fixExplanationFr: 'Associer le port TCP 8443 au type SELinux http_port_t avec la commande semanage port.'
  },
  {
    id: 'tb-lpic3-303-02',
    title: 'Incompatibilité de chaîne de certificats dans OpenSSL / Nginx',
    titleFr: 'Incompatibilité de chaîne de certificats dans OpenSSL / Nginx',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.1',
    category: 'PKI & X.509 Certificate Chaining',
    scenario: 'Les navigateurs web et les outils comme curl affichent l\'erreur "curl: (60) SSL certificate problem: unable to get local issuer certificate" lors de la connexion HTTPS vers le serveur web sécurisé.',
    scenarioFr: 'Les navigateurs web et les outils comme curl affichent l\'erreur "curl: (60) SSL certificate problem: unable to get local issuer certificate" lors de la connexion HTTPS vers le serveur web sécurisé.',
    codeSnippet: `# /etc/nginx/conf.d/ssl.conf
server {
    listen 443 ssl;
    server_name portal.example.com;

    # Seul le certificat feuille (leaf) est fourni :
    ssl_certificate /etc/ssl/certs/portal.crt;
    ssl_certificate_key /etc/ssl/private/portal.key;
}`,
    language: 'config',
    bugDescription: 'La directive ssl_certificate ne contient que le certificat serveur feuille au lieu du bundle complet (Full Chain) incluant les certificats des autorités intermédiaires.',
    bugDescriptionFr: 'La directive ssl_certificate ne contient que le certificat serveur feuille au lieu du bundle complet (Full Chain) incluant les certificats des autorités intermédiaires.',
    options: [
      {
        id: 'opt-1',
        label: 'Le fichier de certificat ne contient pas la chaîne complète (certificats intermédiaires de la CA manquants) ; il faut utiliser fullchain.pem',
        labelFr: 'Le fichier de certificat ne contient pas la chaîne complète (certificats intermédiaires de la CA manquants) ; il faut utiliser fullchain.pem',
        isCorrect: true,
        explanation: 'Si le serveur ne renvoie pas la chaîne intermédiaire, les clients qui n\'ont pas l\'autorité intermédiaire en cache local ne peuvent pas remonter jusqu\'à la racine de confiance.',
        explanationFr: 'Si le serveur ne renvoie pas la chaîne intermédiaire, les clients qui n\'ont pas l\'autorité intermédiaire en cache local ne peuvent pas remonter jusqu\'à la racine de confiance.'
      },
      {
        id: 'opt-2',
        label: 'La clé privée doit être concaténée à l\'intérieur du fichier portal.crt',
        labelFr: 'La clé privée doit être concaténée à l\'intérieur du fichier portal.crt',
        isCorrect: false,
        explanation: 'La clé privée et le certificat public doivent rester séparés dans des fichiers distincts.',
        explanationFr: 'La clé privée et le certificat public doivent rester séparés dans des fichiers distincts.'
      },
      {
        id: 'opt-3',
        label: 'Nginx n\'accepte pas les extensions .crt, uniquement les extensions .cer',
        labelFr: 'Nginx n\'accepte pas les extensions .crt, uniquement les extensions .cer',
        isCorrect: false,
        explanation: 'L\'extension de fichier est arbitraire tant que le contenu est encodé en PEM standard.',
        explanationFr: 'L\'extension de fichier est arbitraire tant que le contenu est encodé en PEM standard.'
      },
      {
        id: 'opt-4',
        label: 'La directive ssl_certificate_key doit être placée avant ssl_certificate',
        labelFr: 'La directive ssl_certificate_key doit être placée avant ssl_certificate',
        isCorrect: false,
        explanation: 'L\'ordre des directives Nginx dans le bloc server n\'a pas d\'impact.',
        explanationFr: 'L\'ordre des directives Nginx dans le bloc server n\'a pas d\'impact.'
      }
    ],
    correctedSnippet: `# Concaténer le certificat serveur et le certificat intermédiaire :
cat portal.crt intermediate.ca.crt > /etc/ssl/certs/portal-fullchain.pem

# Dans /etc/nginx/conf.d/ssl.conf :
ssl_certificate /etc/ssl/certs/portal-fullchain.pem;
ssl_certificate_key /etc/ssl/private/portal.key;`,
    fixExplanation: 'Fournir la chaîne complète (certificat serveur suivi des autorités intermédiaires) dans le fichier pointé par ssl_certificate.',
    fixExplanationFr: 'Fournir la chaîne complète (certificat serveur suivi des autorités intermédiaires) dans le fichier pointé par ssl_certificate.'
  },
  {
    id: 'tb-lpic3-303-03',
    title: 'Règle nftables inversée provoquant un rejet de tout trafic entrant',
    titleFr: 'Règle nftables inversée provoquant un rejet de tout trafic entrant',
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.3',
    category: 'nftables Firewall Architecture',
    scenario: 'Après avoir rechargé le jeu de règles nftables, l\'administrateur perd immédiatement son accès SSH et plus aucun service n\'est joignable sur le serveur distant.',
    scenarioFr: 'Après avoir rechargé le jeu de règles nftables, l\'administrateur perd immédiatement son accès SSH et plus aucun service n\'est joignable sur le serveur distant.',
    codeSnippet: `table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        # Accepter le trafic établi et relié
        ct state established,related accept

        # Interface de boucle locale
        iif lo accept

        # Port SSH
        tcp dport 22 drop
    }
}`,
    language: 'config',
    bugDescription: 'La règle pour le port SSH utilise l\'action "drop" au lieu de "accept", ce qui bloque tout paquet TCP vers le port 22.',
    bugDescriptionFr: 'La règle pour le port SSH utilise l\'action "drop" au lieu de "accept", ce qui bloque tout paquet TCP vers le port 22.',
    options: [
      {
        id: 'opt-1',
        label: 'La règle pour le port SSH se termine par l\'action "drop" au lieu de "accept", rejetant délibérément les connexions d\'administration',
        labelFr: 'La règle pour le port SSH se termine par l\'action "drop" au lieu de "accept", rejetant délibérément les connexions d\'administration',
        isCorrect: true,
        explanation: 'Avec une politique par défaut en drop, les ports de service autorisés doivent se terminer par le verdict "accept". "tcp dport 22 drop" rejette explicitement SSH.',
        explanationFr: 'Avec une politique par défaut en drop, les ports de service autorisés doivent se terminer par le verdict "accept". "tcp dport 22 drop" rejette explicitement SSH.'
      },
      {
        id: 'opt-2',
        label: 'La table "inet" n\'existe pas sous nftables, il faut créer deux tables "ip" et "ip6"',
        labelFr: 'La table "inet" n\'existe pas sous nftables, il faut créer deux tables "ip" et "ip6"',
        isCorrect: false,
        explanation: 'La famille inet est l\'atout majeur de nftables permettant de filtrer à la fois IPv4 et IPv6 dans une seule table unifiée.',
        explanationFr: 'La famille inet est l\'atout majeur de nftables permettant de filtrer à la fois IPv4 et IPv6 dans une seule table unifiée.'
      },
      {
        id: 'opt-3',
        label: 'Le mot-clé "iif lo" est déprécié et doit être remplacé par "interface lo"',
        labelFr: 'Le mot-clé "iif lo" est déprécié et doit être remplacé par "interface lo"',
        isCorrect: false,
        explanation: 'iif (incoming interface) est la syntaxe officielle nftables.',
        explanationFr: 'iif (incoming interface) est la syntaxe officielle nftables.'
      },
      {
        id: 'opt-4',
        label: 'priority 0 est réservée au routage NAT et interdite en filtrage input',
        labelFr: 'priority 0 est réservée au routage NAT et interdite en filtrage input',
        isCorrect: false,
        explanation: 'priority 0 (NF_IP_PRI_FILTER) est la priorité standard universelle du hook de filtrage.',
        explanationFr: 'priority 0 (NF_IP_PRI_FILTER) est la priorité standard universelle du hook de filtrage.'
      }
    ],
    correctedSnippet: `table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        ct state established,related accept
        iif lo accept
        tcp dport 22 accept
    }
}`,
    fixExplanation: 'Corriger le verdict en "accept" pour la directive autorisant le port 22.',
    fixExplanationFr: 'Corriger le verdict en "accept" pour la directive autorisant le port 22.'
  },
  {
    id: 'tb-lpic3-303-04',
    title: 'Verrouillage total de compte par pam_faillock sans déverrouillage root',
    titleFr: 'Verrouillage total de compte par pam_faillock sans déverrouillage root',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.3',
    category: 'PAM Security & Account Lockout',
    scenario: 'Suite à des tentatives de brute-force sur SSH, le compte administrateur "root" s\'est retrouvé définitivement verrouillé et plus aucune connexion physique sur la console n\'est acceptée.',
    scenarioFr: 'Suite à des tentatives de brute-force sur SSH, le compte administrateur "root" s\'est retrouvé définitivement verrouillé et plus aucune connexion physique sur la console n\'est acceptée.',
    codeSnippet: `# /etc/security/faillock.conf
deny = 3
fail_interval = 900
unlock_time = 0
even_deny_root`,
    language: 'config',
    bugDescription: 'La combinaison de "even_deny_root" avec "unlock_time = 0" (verrouillage infini jusqu\'à intervention manuelle) bloque le compte root sans aucun délai de récupération automatique.',
    bugDescriptionFr: 'La combinaison de "even_deny_root" avec "unlock_time = 0" (verrouillage infini jusqu\'à intervention manuelle) bloque le compte root sans aucun délai de récupération automatique.',
    options: [
      {
        id: 'opt-1',
        label: 'even_deny_root combiné à unlock_time = 0 verrouille le compte root pour une durée infinie, rendant le système inaccessible sans redémarrage d\'urgence',
        labelFr: 'even_deny_root combiné à unlock_time = 0 verrouille le compte root pour une durée infinie, rendant le système inaccessible sans redémarrage d\'urgence',
        isCorrect: true,
        explanation: 'Sous pam_faillock, unlock_time = 0 signifie que seul un administrateur peut déverrouiller le compte (via faillock --reset). Si root lui-même est verrouillé par even_deny_root, plus personne ne peut exécuter faillock.',
        explanationFr: 'Sous pam_faillock, unlock_time = 0 signifie que seul un administrateur peut déverrouiller le compte (via faillock --reset). Si root lui-même est verrouillé par even_deny_root, plus personne ne peut exécuter faillock.'
      },
      {
        id: 'opt-2',
        label: 'faillock.conf ne supporte pas le paramètre deny inférieur à 5',
        labelFr: 'faillock.conf ne supporte pas le paramètre deny inférieur à 5',
        isCorrect: false,
        explanation: 'deny accepte n\'importe quel seuil numérique positif.',
        explanationFr: 'deny accepte n\'importe quel seuil numérique positif.'
      },
      {
        id: 'opt-3',
        label: 'pam_faillock a été remplacé par pam_tally2 dans toutes les versions modernes',
        labelFr: 'pam_faillock a été remplacé par pam_tally2 dans toutes les versions modernes',
        isCorrect: false,
        explanation: 'C\'est l\'inverse : pam_tally2 a été supprimé de Linux-PAM car obsolète et remplacé par pam_faillock.',
        explanationFr: 'C\'est l\'inverse : pam_tally2 a été supprimé de Linux-PAM car obsolète et remplacé par pam_faillock.'
      },
      {
        id: 'opt-4',
        label: 'fail_interval doit être spécifié en millisecondes et non en secondes',
        labelFr: 'fail_interval doit être spécifié en millisecondes et non en secondes',
        isCorrect: false,
        explanation: 'fail_interval s\'exprime en secondes (ici 900 s = 15 minutes).',
        explanationFr: 'fail_interval s\'exprime en secondes (ici 900 s = 15 minutes).'
      }
    ],
    correctedSnippet: `# Configuration sécurisée avec déverrouillage temporisé :
deny = 5
fail_interval = 900
unlock_time = 600
root_unlock_time = 300`,
    fixExplanation: 'Toujours configurer root_unlock_time (ou un unlock_time > 0) pour garantir que root se déverrouille automatiquement après un délai défini.',
    fixExplanationFr: 'Toujours configurer root_unlock_time (ou un unlock_time > 0) pour garantir que root se déverrouille automatiquement après un délai défini.'
  },
  {
    id: 'tb-lpic3-303-05',
    title: 'Erreur de profil AppArmor bloquant la lecture des logs Apache',
    titleFr: 'Erreur de profil AppArmor bloquant la lecture des logs Apache',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.3',
    category: 'AppArmor Profiles & Mode Enforcing',
    scenario: 'Apache refuse d\'écrire ses logs dans /var/log/apache2/vhosts/ et s\'arrête avec l\'erreur "Permission denied". L\'audit noyau montre : "apparmor=\"DENIED\" operation=\"open\" profile=\"usr.sbin.apache2\" name=\"/var/log/apache2/vhosts/access.log\" requested_mask=\"w\"".',
    scenarioFr: 'Apache refuse d\'écrire ses logs dans /var/log/apache2/vhosts/ et s\'arrête avec l\'erreur "Permission denied". L\'audit noyau montre : "apparmor=\"DENIED\" operation=\"open\" profile=\"usr.sbin.apache2\" name=\"/var/log/apache2/vhosts/access.log\" requested_mask=\"w\"".',
    codeSnippet: `# /etc/apparmor.d/usr.sbin.apache2
/usr/sbin/apache2 {
    #include <tunables/global>

    /var/log/apache2/*.log w,
    # Le sous-dossier vhosts/ n'est pas couvert
}`,
    language: 'config',
    bugDescription: 'Le profil AppArmor n\'autorise l\'écriture que sur /var/log/apache2/*.log (niveau simple), ce qui exclut les sous-dossiers comme vhosts/ qui nécessitent le joker récursif **.',
    bugDescriptionFr: 'Le profil AppArmor n\'autorise l\'écriture que sur /var/log/apache2/*.log (niveau simple), ce qui exclut les sous-dossiers comme vhosts/ qui nécessitent le joker récursif **.',
    options: [
      {
        id: 'opt-1',
        label: 'Dans AppArmor, le caractère "*" ne correspond qu\'à un seul répertoire ; pour autoriser les sous-répertoires récursifs comme vhosts/, il faut utiliser le globbing "**" (ex: /var/log/apache2/**.log)',
        labelFr: 'Dans AppArmor, le caractère "*" ne correspond qu\'à un seul répertoire ; pour autoriser les sous-répertoires récursifs comme vhosts/, il faut utiliser le globbing "**" (ex: /var/log/apache2/**.log)',
        isCorrect: true,
        explanation: 'La syntaxe AppArmor distingue "*" (fichiers dans le dossier sans slash) et "**" (correspondance récursive à travers tous les sous-dossiers).',
        explanationFr: 'La syntaxe AppArmor distingue "*" (fichiers dans le dossier sans slash) et "**" (correspondance récursive à travers tous les sous-dossiers).'
      },
      {
        id: 'opt-2',
        label: 'Le droit d\'écriture pour les logs sous AppArmor doit être "write" au lieu de "w"',
        labelFr: 'Le droit d\'écriture pour les logs sous AppArmor doit être "write" au lieu de "w"',
        isCorrect: false,
        explanation: 'AppArmor utilise des lettres courtes (r, w, rw, a, m, k, px...).',
        explanationFr: 'AppArmor utilise des lettres courtes (r, w, rw, a, m, k, px...).'
      },
      {
        id: 'opt-3',
        label: 'Le profil doit être placé en mode unconfined avec aa-complain',
        labelFr: 'Le profil doit être placé en mode unconfined avec aa-complain',
        isCorrect: false,
        explanation: 'aa-complain passe le profil en mode permissif d\'apprentissage, mais la politique en production doit être corrigée proprement.',
        explanationFr: 'aa-complain passe le profil en mode permissif d\'apprentissage, mais la politique en production doit être corrigée proprement.'
      },
      {
        id: 'opt-4',
        label: 'Apache2 n\'est pas supporté par AppArmor, uniquement par SELinux',
        labelFr: 'Apache2 n\'est pas supporté par AppArmor, uniquement par SELinux',
        isCorrect: false,
        explanation: 'AppArmor fournit un profil standard très répandu pour Apache sous Debian/Ubuntu/SUSE.',
        explanationFr: 'AppArmor fournit un profil standard très répandu pour Apache sous Debian/Ubuntu/SUSE.'
      }
    ],
    correctedSnippet: `/var/log/apache2/**.log w,
# ou avec droit d'ajout (append) :
/var/log/apache2/** rw,
# Recharger le profil :
apparmor_parser -r /etc/apparmor.d/usr.sbin.apache2`,
    fixExplanation: 'Utiliser le joker récursif "**" dans le chemin du profil AppArmor puis recharger avec apparmor_parser -r.',
    fixExplanationFr: 'Utiliser le joker récursif "**" dans le chemin du profil AppArmor puis recharger avec apparmor_parser -r.'
  },
  {
    id: 'tb-lpic3-303-06',
    title: 'Échec d\'ouverture d\'un conteneur chiffré LUKS2 (mauvais slot ou format)',
    titleFr: 'Échec d\'ouverture d\'un conteneur chiffré LUKS2 (mauvais slot ou format)',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.2',
    category: 'LUKS & dm-crypt Storage Encryption',
    scenario: 'L\'administrateur essaie d\'ouvrir un volume chiffré sur /dev/sdb1, mais la commande cryptsetup renvoie : "Device /dev/sdb1 is not a valid LUKS device".',
    scenarioFr: 'L\'administrateur essaie d\'ouvrir un volume chiffré sur /dev/sdb1, mais la commande cryptsetup renvoie : "Device /dev/sdb1 is not a valid LUKS device".',
    codeSnippet: `# cryptsetup isLuks /dev/sdb1; echo $?
1
# hexdump -C -n 16 /dev/sdb1
00000000  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|`,
    language: 'bash',
    bugDescription: 'L\'en-tête LUKS (magic header "LUKS\\xba\\xbe" en offset 0) a été écrasé ou le périphérique n\'a jamais été initialisé avec "cryptsetup luksFormat".',
    bugDescriptionFr: 'L\'en-tête LUKS (magic header "LUKS\\xba\\xbe" en offset 0) a été écrasé ou le périphérique n\'a jamais été initialisé avec "cryptsetup luksFormat".',
    options: [
      {
        id: 'opt-1',
        label: 'Le magic header LUKS en début de partition est manquant ou écrasé ; cryptsetup isLuks retourne 1 (faux)',
        labelFr: 'Le magic header LUKS en début de partition est manquant ou écrasé ; cryptsetup isLuks retourne 1 (faux)',
        isCorrect: true,
        explanation: 'Tout conteneur LUKS valide commence par la signature binaire LUKS dans ses premiers octets. Si un backup d\'en-tête existe, il faut le restaurer avec "cryptsetup luksHeaderRestore".',
        explanationFr: 'Tout conteneur LUKS valide commence par la signature binaire LUKS dans ses premiers octets. Si un backup d\'en-tête existe, il faut le restaurer avec "cryptsetup luksHeaderRestore".'
      },
      {
        id: 'opt-2',
        label: 'cryptsetup nécessite impérativement les droits sudoers avec l\'option --no-passphrase',
        labelFr: 'cryptsetup nécessite impérativement les droits sudoers avec l\'option --no-passphrase',
        isCorrect: false,
        explanation: 'isLuks vérifie simplement la signature du header et ne demande pas de phrase secrète.',
        explanationFr: 'isLuks vérifie simplement la signature du header et ne demande pas de phrase secrète.'
      },
      {
        id: 'opt-3',
        label: 'LUKS2 n\'est pas lisible avec la commande cryptsetup',
        labelFr: 'LUKS2 n\'est pas lisible avec la commande cryptsetup',
        isCorrect: false,
        explanation: 'cryptsetup est l\'outil natif pour LUKS1 et LUKS2.',
        explanationFr: 'cryptsetup est l\'outil natif pour LUKS1 et LUKS2.'
      },
      {
        id: 'opt-4',
        label: 'Il faut formater le volume en ext4 avant de faire luksFormat',
        labelFr: 'Il faut formater le volume en ext4 avant de faire luksFormat',
        isCorrect: false,
        explanation: 'luksFormat s\'applique sur la couche bloc brute, puis le système de fichiers est créé au-dessus de /dev/mapper/nom_luks.',
        explanationFr: 'luksFormat s\'applique sur la couche bloc brute, puis le système de fichiers est créé au-dessus de /dev/mapper/nom_luks.'
      }
    ],
    correctedSnippet: `# Si une sauvegarde d'en-tête a été préalablement créée :
cryptsetup luksHeaderRestore /dev/sdb1 --header-backup-file /root/sdb1_header.bak
# Ou réinitialiser le volume si vide :
cryptsetup luksFormat --type luks2 /dev/sdb1`,
    fixExplanation: 'Restaurer le header LUKS avec luksHeaderRestore ou formater le périphérique avec luksFormat.',
    fixExplanationFr: 'Restaurer le header LUKS avec luksHeaderRestore ou formater le périphérique avec luksFormat.'
  },
  {
    id: 'tb-lpic3-303-07',
    title: 'Politique d\'audit auditd saturée bloquant le système (panic)',
    titleFr: 'Politique d\'audit auditd saturée bloquant le système (panic)',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.2',
    category: 'Linux Audit Framework (auditd)',
    scenario: 'Un serveur de haute sécurité gèle subitement. Plus aucune commande n\'aboutit et le noyau affiche en console série : "audit: backlog limit exceeded" suivi d\'un kernel panic.',
    scenarioFr: 'Un serveur de haute sécurité gèle subitement. Plus aucune commande n\'aboutit et le noyau affiche en console série : "audit: backlog limit exceeded" suivi d\'un kernel panic.',
    codeSnippet: `# /etc/audit/rules.d/audit.rules
-D
-b 320
-f 2`,
    language: 'config',
    bugDescription: 'L\'option "-f 2" configure l\'action d\'échec de l\'audit en mode "kernel panic", et la file d\'attente (-b 320) est ridiculement sous-dimensionnée pour un serveur de production.',
    bugDescriptionFr: 'L\'option "-f 2" configure l\'action d\'échec de l\'audit en mode "kernel panic", et la file d\'attente (-b 320) est ridiculement sous-dimensionnée pour un serveur de production.',
    options: [
      {
        id: 'opt-1',
        label: 'Le paramètre "-f 2" force un kernel panic en cas de saturation de la file d\'attente audit, et -b 320 est trop faible',
        labelFr: 'Le paramètre "-f 2" force un kernel panic en cas de saturation de la file d\'attente audit, et -b 320 est trop faible',
        isCorrect: true,
        explanation: 'Dans les règles auditd, -f définit le failure mode : 0=silent, 1=printk, 2=panic. Avec un buffer -b de seulement 320 messages, une rafale d\'événements système sature la file et déclenche instantanément un crash noyau volontaire.',
        explanationFr: 'Dans les règles auditd, -f définit le failure mode : 0=silent, 1=printk, 2=panic. Avec un buffer -b de seulement 320 messages, une rafale d\'événements système sature la file et déclenche instantanément un crash noyau volontaire.'
      },
      {
        id: 'opt-2',
        label: 'La directive -D supprime tous les fichiers de journaux sur le disque dur',
        labelFr: 'La directive -D supprime tous les fichiers de journaux sur le disque dur',
        isCorrect: false,
        explanation: '-D efface simplement les anciennes règles d\'audit en mémoire du noyau avant de charger les nouvelles.',
        explanationFr: '-D efface simplement les anciennes règles d\'audit en mémoire du noyau avant de charger les nouvelles.'
      },
      {
        id: 'opt-3',
        label: 'auditd ne supporte pas d\'être exécuté sous les noyaux 64-bit',
        labelFr: 'auditd ne supporte pas d\'être exécuté sous les noyaux 64-bit',
        isCorrect: false,
        explanation: 'auditd est universellement utilisé sur les architectures 64-bit.',
        explanationFr: 'auditd est universellement utilisé sur les architectures 64-bit.'
      },
      {
        id: 'opt-4',
        label: '-b doit être configuré à 0 pour désactiver la mémoire tampon',
        labelFr: '-b doit être configuré à 0 pour désactiver la mémoire tampon',
        isCorrect: false,
        explanation: 'Mettre -b 0 provoquerait un rejet immédiat de tous les messages d\'audit.',
        explanationFr: 'Mettre -b 0 provoquerait un rejet immédiat de tous les messages d\'audit.'
      }
    ],
    correctedSnippet: `# /etc/audit/rules.d/audit.rules
-D
-b 8192
-f 1`,
    fixExplanation: 'Augmenter la taille du buffer backlog (-b 8192 ou plus) et passer le flag d\'échec à 1 (printk dans dmesg) pour éviter le kernel panic brutal.',
    fixExplanationFr: 'Augmenter la taille du buffer backlog (-b 8192 ou plus) et passer le flag d\'échec à 1 (printk dans dmesg) pour éviter le kernel panic brutal.'
  },
  {
    id: 'tb-lpic3-303-08',
    title: 'Certificat racine X.509 expiré ou CRL non joignable dans OpenVPN',
    titleFr: 'Certificat racine X.509 expiré ou CRL non joignable dans OpenVPN',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.1',
    category: 'X.509 CRL & VPN Authentication',
    scenario: 'Les clients OpenVPN ne parviennent plus à se connecter au serveur distant. Le journal du serveur OpenVPN consigne : "VERIFY ERROR: depth=0, error=CRL has expired: C=FR, O=Enterprise, CN=client01".',
    scenarioFr: 'Les clients OpenVPN ne parviennent plus à se connecter au serveur distant. Le journal du serveur OpenVPN consigne : "VERIFY ERROR: depth=0, error=CRL has expired: C=FR, O=Enterprise, CN=client01".',
    codeSnippet: `# Dans /etc/openvpn/server.conf :
crl-verify /etc/openvpn/crl.pem

# openssl crl -in /etc/openvpn/crl.pem -noout -nextupdate
nextUpdate=Sep 01 00:00:00 2026 GMT (date courante: 09 Sep 2026)`,
    language: 'config',
    bugDescription: 'La liste de révocation de certificats (CRL) a dépassé sa date de validité (nextUpdate), ce qui conduit OpenSSL et OpenVPN à rejeter toutes les connexions par mesure de sécurité.',
    bugDescriptionFr: 'La liste de révocation de certificats (CRL) a dépassé sa date de validité (nextUpdate), ce qui conduit OpenSSL et OpenVPN à rejeter toutes les connexions par mesure de sécurité.',
    options: [
      {
        id: 'opt-1',
        label: 'La date limite de validité de la liste de révocation (nextUpdate de crl.pem) est expirée ; la CA doit régénérer une CRL à jour',
        labelFr: 'La date limite de validité de la liste de révocation (nextUpdate de crl.pem) est expirée ; la CA doit régénérer une CRL à jour',
        isCorrect: true,
        explanation: 'Par sécurité cryptographique, si une CRL n\'est pas rafraîchie avant son échéance nextUpdate, le système considère que l\'état de révocation est inconnu et bloque tous les certificats.',
        explanationFr: 'Par sécurité cryptographique, si une CRL n\'est pas rafraîchie avant son échéance nextUpdate, le système considère que l\'état de révocation est inconnu et bloque tous les certificats.'
      },
      {
        id: 'opt-2',
        label: 'crl-verify doit être configuré dans le client et jamais sur le serveur',
        labelFr: 'crl-verify doit être configuré dans le client et jamais sur le serveur',
        isCorrect: false,
        explanation: 'Le serveur vérifie la CRL pour s\'assurer qu\'aucun client révoqué ne pénètre le réseau.',
        explanationFr: 'Le serveur vérifie la CRL pour s\'assurer qu\'aucun client révoqué ne pénètre le réseau.'
      },
      {
        id: 'opt-3',
        label: 'Les fichiers CRL doivent impérativement être au format binaire DER et non PEM',
        labelFr: 'Les fichiers CRL doivent impérativement être au format binaire DER et non PEM',
        isCorrect: false,
        explanation: 'OpenVPN attend par défaut le format texte PEM standard.',
        explanationFr: 'OpenVPN attend par défaut le format texte PEM standard.'
      },
      {
        id: 'opt-4',
        label: 'L\'erreur depth=0 indique que le certificat de la CA racine est corrompu',
        labelFr: 'L\'erreur depth=0 indique que le certificat de la CA racine est corrompu',
        isCorrect: false,
        explanation: 'depth=0 correspond au certificat final du client présenté.',
        explanationFr: 'depth=0 correspond au certificat final du client présenté.'
      }
    ],
    correctedSnippet: `# Sur l'autorité de certification (CA) :
openssl ca -gencrl -out /etc/openvpn/crl.pem -crldays 30
# Copier la nouvelle CRL sur le serveur OpenVPN`,
    fixExplanation: 'Régénérer la CRL sur l\'autorité de certification avec openssl ca -gencrl et la déployer sur le serveur.',
    fixExplanationFr: 'Régénérer la CRL sur l\'autorité de certification avec openssl ca -gencrl et la déployer sur le serveur.'
  },
  {
    id: 'tb-lpic3-303-09',
    title: 'Conflit de ports ou interface manquante WireGuard VPN',
    titleFr: 'Conflit de ports ou interface manquante WireGuard VPN',
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.4',
    category: 'WireGuard VPN Architecture',
    scenario: 'L\'administrateur lance "wg-quick up wg0" pour activer le tunnel WireGuard. La commande échoue avec "RTNETLINK answers: Operation not supported" ou ne transmet aucun paquet (handshake inactif).',
    scenarioFr: 'L\'administrateur lance "wg-quick up wg0" pour activer le tunnel WireGuard. La commande échoue avec "RTNETLINK answers: Operation not supported" ou ne transmet aucun paquet (handshake inactif).',
    codeSnippet: `# /etc/wireguard/wg0.conf
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = aGVsbG93b3JsZGZha2VrZXk=

[Peer]
PublicKey = YW5vdGhlcmZha2VwdWJsaWNrZXk=
Endpoint = 203.0.113.10:51820
AllowedIPs = 10.10.0.2/32`,
    language: 'config',
    bugDescription: 'Le module noyau wireguard n\'est pas chargé ("modprobe wireguard"), provoquant l\'erreur "Operation not supported" lors de la tentative de création de l\'interface réseau.',
    bugDescriptionFr: 'Le module noyau wireguard n\'est pas chargé ("modprobe wireguard"), provoquant l\'erreur "Operation not supported" lors de la tentative de création de l\'interface réseau.',
    options: [
      {
        id: 'opt-1',
        label: 'Le module noyau WireGuard n\'est pas chargé dans le noyau Linux ("modprobe wireguard")',
        labelFr: 'Le module noyau WireGuard n\'est pas chargé dans le noyau Linux ("modprobe wireguard")',
        isCorrect: true,
        explanation: 'WireGuard fonctionne nativement dans l\'espace noyau (kernel space). Si le module "wireguard" n\'est pas chargé ou compilé pour le noyau courant, ip link renvoie "Operation not supported".',
        explanationFr: 'WireGuard fonctionne nativement dans l\'espace noyau (kernel space). Si le module "wireguard" n\'est pas chargé ou compilé pour le noyau courant, ip link renvoie "Operation not supported".'
      },
      {
        id: 'opt-2',
        label: 'WireGuard n\'utilise que le protocole TCP et ListenPort 51820 est bloqué par défaut',
        labelFr: 'WireGuard n\'utilise que le protocole TCP et ListenPort 51820 est bloqué par défaut',
        isCorrect: false,
        explanation: 'WireGuard opère exclusivement sur UDP.',
        explanationFr: 'WireGuard opère exclusivement sur UDP.'
      },
      {
        id: 'opt-3',
        label: 'Le masque CIDR de Address doit obligatoirement être /32 pour une interface serveur',
        labelFr: 'Le masque CIDR de Address doit obligatoirement être /32 pour une interface serveur',
        isCorrect: false,
        explanation: 'Un sous-réseau /24 est la pratique standard pour allouer des adresses aux pairs.',
        explanationFr: 'Un sous-réseau /24 est la pratique standard pour allouer des adresses aux pairs.'
      },
      {
        id: 'opt-4',
        label: 'AllowedIPs ne peut contenir qu\'une seule adresse globale 0.0.0.0/0',
        labelFr: 'AllowedIPs ne peut contenir qu\'une seule adresse globale 0.0.0.0/0',
        isCorrect: false,
        explanation: 'AllowedIPs sert de filtre de routage cryptographique et accepte des IP individuelles ou des plages.',
        explanationFr: 'AllowedIPs sert de filtre de routage cryptographique et accepte des IP individuelles ou des plages.'
      }
    ],
    correctedSnippet: `modprobe wireguard
wg-quick up wg0
wg show wg0`,
    fixExplanation: 'Charger le module noyau wireguard avec modprobe wireguard ou installer les en-têtes noyau requis.',
    fixExplanationFr: 'Charger le module noyau wireguard avec modprobe wireguard ou installer les en-têtes noyau requis.'
  },
  {
    id: 'tb-lpic3-303-10',
    title: 'Mauvaise commande d\'extraction de clé publique RSA depuis une clé privée',
    titleFr: 'Mauvaise commande d\'extraction de clé publique RSA depuis une clé privée',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.1',
    category: 'OpenSSL Cryptography Operations',
    scenario: 'L\'ingénieur sécurité souhaite exporter la composante publique d\'une clé privée RSA existante pour la transmettre à un partenaire. Sa commande renvoie "unknown option -pubkey".',
    scenarioFr: 'L\'ingénieur sécurité souhaite exporter la composante publique d\'une clé privée RSA existante pour la transmettre à un partenaire. Sa commande renvoie "unknown option -pubkey".',
    codeSnippet: `$ openssl genrsa -in private.key -pubkey -out public.key
unknown option -in
genrsa [options] numbits`,
    language: 'bash',
    bugDescription: 'La sous-commande "genrsa" sert à générer une nouvelle clé. Pour extraire la clé publique d\'une clé privée existante, il faut utiliser la sous-commande "openssl rsa -in private.key -pubout".',
    bugDescriptionFr: 'La sous-commande "genrsa" sert à générer une nouvelle clé. Pour extraire la clé publique d\'une clé privée existante, il faut utiliser la sous-commande "openssl rsa -in private.key -pubout".',
    options: [
      {
        id: 'opt-1',
        label: 'La sous-commande "genrsa" sert à fabriquer une nouvelle clé ; pour extraire la clé publique, la commande adéquate est "openssl rsa -in private.key -pubout -out public.key"',
        labelFr: 'La sous-commande "genrsa" sert à fabriquer une nouvelle clé ; pour extraire la clé publique, la commande adéquate est "openssl rsa -in private.key -pubout -out public.key"',
        isCorrect: true,
        explanation: 'openssl rsa gère les clés RSA existantes (-in, -pubout, -check, etc.), tandis que genrsa est le générateur de nouveaux couples.',
        explanationFr: 'openssl rsa gère les clés RSA existantes (-in, -pubout, -check, etc.), tandis que genrsa est le générateur de nouveaux couples.'
      },
      {
        id: 'opt-2',
        label: 'Il est mathématiquement impossible de dériver la clé publique à partir d\'une clé privée RSA',
        labelFr: 'Il est mathématiquement impossible de dériver la clé publique à partir d\'une clé privée RSA',
        isCorrect: false,
        explanation: 'La structure ASN.1 d\'une clé privée RSA contient explicitement le module (n) et l\'exposant public (e).',
        explanationFr: 'La structure ASN.1 d\'une clé privée RSA contient explicitement le module (n) et l\'exposant public (e).'
      },
      {
        id: 'opt-3',
        label: 'OpenSSL a déprécié RSA au profit exclusif de Ed25519',
        labelFr: 'OpenSSL a déprécié RSA au profit exclusif de Ed25519',
        isCorrect: false,
        explanation: 'RSA reste un standard majeur entièrement supporté dans OpenSSL.',
        explanationFr: 'RSA reste un standard majeur entièrement supporté dans OpenSSL.'
      },
      {
        id: 'opt-4',
        label: 'L\'option -out est réservée à la commande openssl x509',
        labelFr: 'L\'option -out est réservée à la commande openssl x509',
        isCorrect: false,
        explanation: '-out est l\'argument universel OpenSSL pour désigner le fichier de sortie.',
        explanationFr: '-out est l\'argument universel OpenSSL pour désigner le fichier de sortie.'
      }
    ],
    correctedSnippet: `openssl rsa -in private.key -pubout -out public.key`,
    fixExplanation: 'Utiliser la sous-commande "openssl rsa" avec le paramètre "-pubout".',
    fixExplanationFr: 'Utiliser la sous-commande "openssl rsa" avec le paramètre "-pubout".'
  },
  {
    id: 'tb-lpic3-303-11',
    title: 'Audit de base de données AIDE invalide après mise à jour',
    titleFr: 'Audit de base de données AIDE invalide après mise à jour',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.2',
    category: 'Host Intrusion Detection (AIDE)',
    scenario: 'Après avoir appliqué des correctifs de sécurité sur les binaires du système, la vérification nocturne d\'intégrité AIDE lève des centaines de faux positifs d\'intrusion.',
    scenarioFr: 'Après avoir appliqué des correctifs de sécurité sur les binaires du système, la vérification nocturne d\'intégrité AIDE lève des centaines de faux positifs d\'intrusion.',
    codeSnippet: `# aide --check
AIDE found differences between database and filesystem!!
Changed files: 247
...
# ls -l /var/lib/aide/
-rw------- 1 root root 4120930 Sep 01 02:00 aide.db.gz
-rw------- 1 root root 4125410 Sep 09 11:00 aide.db.new.gz`,
    language: 'bash',
    bugDescription: 'La base de données mise à jour générée par aide --update est enregistrée sous aide.db.new.gz et n\'a pas été renommée en aide.db.gz pour devenir la nouvelle référence d\'intégrité.',
    bugDescriptionFr: 'La base de données mise à jour générée par aide --update est enregistrée sous aide.db.new.gz et n\'a pas été renommée en aide.db.gz pour devenir la nouvelle référence d\'intégrité.',
    options: [
      {
        id: 'opt-1',
        label: 'AIDE génère aide.db.new.gz lors de la mise à jour ; il faut déplacer ce fichier vers aide.db.gz pour qu\'il serve de nouvelle base de référence',
        labelFr: 'AIDE génère aide.db.new.gz lors de la mise à jour ; il faut déplacer ce fichier vers aide.db.gz pour qu\'il serve de nouvelle base de référence',
        isCorrect: true,
        explanation: 'Pour éviter d\'écraser la base active par mégarde, aide --update produit toujours aide.db.new.gz. L\'administrateur doit explicitement remplacer aide.db.gz par cette nouvelle version validée.',
        explanationFr: 'Pour éviter d\'écraser la base active par mégarde, aide --update produit toujours aide.db.new.gz. L\'administrateur doit explicitement remplacer aide.db.gz par cette nouvelle version validée.'
      },
      {
        id: 'opt-2',
        label: 'AIDE doit être désinstallé puis réinstallé à chaque mise à jour système',
        labelFr: 'AIDE doit être désinstallé puis réinstallé à chaque mise à jour système',
        isCorrect: false,
        explanation: 'AIDE est conçu pour mettre à jour sa base de hashs sans réinstallation.',
        explanationFr: 'AIDE est conçu pour mettre à jour sa base de hashs sans réinstallation.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier aide.db.gz doit être décompressé en texte clair pour être lu',
        labelFr: 'Le fichier aide.db.gz doit être décompressé en texte clair pour être lu',
        isCorrect: false,
        explanation: 'AIDE gère nativement la compression gzip des bases de données.',
        explanationFr: 'AIDE gère nativement la compression gzip des bases de données.'
      },
      {
        id: 'opt-4',
        label: 'L\'outil aide --check doit être exécuté avec l\'option --ignore-all',
        labelFr: 'L\'outil aide --check doit être exécuté avec l\'option --ignore-all',
        isCorrect: false,
        explanation: 'Ignorer les changements détruirait l\'utilité du système de détection d\'intrusion.',
        explanationFr: 'Ignorer les changements détruirait l\'utilité du système de détection d\'intrusion.'
      }
    ],
    correctedSnippet: `cp -f /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
aide --check`,
    fixExplanation: 'Remplacer aide.db.gz par aide.db.new.gz une fois les modifications légitimes vérifiées.',
    fixExplanationFr: 'Remplacer aide.db.gz par aide.db.new.gz une fois les modifications légitimes vérifiées.'
  },
  {
    id: 'tb-lpic3-303-12',
    title: 'Contexte SELinux non persistant après redémarrage (chcon vs semanage)',
    titleFr: 'Contexte SELinux non persistant après redémarrage (chcon vs semanage)',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.2',
    category: 'SELinux Persistence & Labeling',
    scenario: 'L\'administrateur a étiqueté un répertoire web non standard /data/www avec chcon. Tout fonctionne jusqu\'à ce qu\'une commande "restorecon -Rv /data" ou un relabeling système réinitialise les types en default_t, provoquant des pannes de site.',
    scenarioFr: 'L\'administrateur a étiqueté un répertoire web non standard /data/www avec chcon. Tout fonctionne jusqu\'à ce qu\'une commande "restorecon -Rv /data" ou un relabeling système réinitialise les types en default_t, provoquant des pannes de site.',
    codeSnippet: `# Ce que l'administrateur a fait précédemment :
chcon -R -t httpd_sys_content_t /data/www

# Après un restorecon ou mise à jour système :
ls -Z /data/www/index.html
unconfined_u:object_r:default_t:s0 /data/www/index.html`,
    language: 'bash',
    bugDescription: 'La commande "chcon" ne modifie les labels qu\'en mémoire volatile du système de fichiers sans enregistrer la règle dans la base de politique SELinux (file_contexts).',
    bugDescriptionFr: 'La commande "chcon" ne modifie les labels qu\'en mémoire volatile du système de fichiers sans enregistrer la règle dans la base de politique SELinux (file_contexts).',
    options: [
      {
        id: 'opt-1',
        label: '"chcon" n\'est pas persistant ; pour rendre le label permanent lors des restorecon et relabeling, il faut utiliser "semanage fcontext -a -t httpd_sys_content_t \'/data/www(/.*)?\'"',
        labelFr: '"chcon" n\'est pas persistant ; pour rendre le label permanent lors des restorecon et relabeling, il faut utiliser "semanage fcontext -a -t httpd_sys_content_t \'/data/www(/.*)?\'"',
        isCorrect: true,
        explanation: 'chcon écrit directement dans les xattr des inodes mais la politique SELinux ne le sait pas. semanage fcontext enregistre la règle dans /etc/selinux/.../file_contexts.local, garantissant la pérennité.',
        explanationFr: 'chcon écrit directement dans les xattr des inodes mais la politique SELinux ne le sait pas. semanage fcontext enregistre la règle dans /etc/selinux/.../file_contexts.local, garantissant la pérennité.'
      },
      {
        id: 'opt-2',
        label: 'restorecon doit toujours être invoqué avec l\'option --no-relabel',
        labelFr: 'restorecon doit toujours être invoqué avec l\'option --no-relabel',
        isCorrect: false,
        explanation: 'restorecon est justement l\'outil officiel conçu pour réaligner le système de fichiers sur la politique.',
        explanationFr: 'restorecon est justement l\'outil officiel conçu pour réaligner le système de fichiers sur la politique.'
      },
      {
        id: 'opt-3',
        label: 'httpd_sys_content_t est réservé exclusivement au dossier /var/www',
        labelFr: 'httpd_sys_content_t est réservé exclusivement au dossier /var/www',
        isCorrect: false,
        explanation: 'N\'importe quel répertoire peut recevoir le type httpd_sys_content_t via semanage.',
        explanationFr: 'N\'importe quel répertoire peut recevoir le type httpd_sys_content_t via semanage.'
      },
      {
        id: 'opt-4',
        label: 'Le rôle object_r doit être changé en system_r',
        labelFr: 'Le rôle object_r doit être changé en system_r',
        isCorrect: false,
        explanation: 'object_r est le rôle standard pour tous les fichiers passifs sur disque.',
        explanationFr: 'object_r est le rôle standard pour tous les fichiers passifs sur disque.'
      }
    ],
    correctedSnippet: `semanage fcontext -a -t httpd_sys_content_t "/data/www(/.*)?"
restorecon -Rv /data/www`,
    fixExplanation: 'Utiliser semanage fcontext suivi de restorecon pour fixer durablement les étiquettes SELinux.',
    fixExplanationFr: 'Utiliser semanage fcontext suivi de restorecon pour fixer durablement les étiquettes SELinux.'
  },
  {
    id: 'tb-lpic3-303-13',
    title: 'Directive sysctl de routage IPv4 désactivée pour passerelle VPN',
    titleFr: 'Directive sysctl de routage IPv4 désactivée pour passerelle VPN',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.1',
    category: 'Kernel Hardening & Network Parameters (sysctl)',
    scenario: 'Un serveur VPN OpenVPN/WireGuard établit bien les tunnels avec les postes nomades, mais aucun client ne parvient à joindre les serveurs du réseau local d\'entreprise situé derrière la passerelle.',
    scenarioFr: 'Un serveur VPN OpenVPN/WireGuard établit bien les tunnels avec les postes nomades, mais aucun client ne parvient à joindre les serveurs du réseau local d\'entreprise situé derrière la passerelle.',
    codeSnippet: `# sysctl net.ipv4.ip_forward
net.ipv4.ip_forward = 0

# iptables -t nat -L -v
Chain POSTROUTING (policy ACCEPT 120 packets, 8400 bytes)
 pkts bytes target     prot opt in     out     source               destination
    0     0 MASQUERADE all  --  any    eth0    10.8.0.0/24          anywhere`,
    language: 'config',
    bugDescription: 'Le routage de paquets entre interfaces réseau (ip_forward) est désactivé par défaut dans le noyau Linux (valeur 0), empêchant le serveur d\'agir en passerelle.',
    bugDescriptionFr: 'Le routage de paquets entre interfaces réseau (ip_forward) est désactivé par défaut dans le noyau Linux (valeur 0), empêchant le serveur d\'agir en passerelle.',
    options: [
      {
        id: 'opt-1',
        label: 'La directive noyau net.ipv4.ip_forward est à 0 ; le noyau refuse de faire suivre les paquets entre l\'interface VPN et l\'interface LAN eth0',
        labelFr: 'La directive noyau net.ipv4.ip_forward est à 0 ; le noyau refuse de faire suivre les paquets entre l\'interface VPN et l\'interface LAN eth0',
        isCorrect: true,
        explanation: 'Pour qu\'un hôte Linux transfère des paquets d\'une interface à une autre, ip_forward doit impérativement être activé (égal à 1) dans sysctl.',
        explanationFr: 'Pour qu\'un hôte Linux transfère des paquets d\'une interface à une autre, ip_forward doit impérativement être activé (égal à 1) dans sysctl.'
      },
      {
        id: 'opt-2',
        label: 'MASQUERADE ne fonctionne que si l\'adresse IP est publique et routable',
        labelFr: 'MASQUERADE ne fonctionne que si l\'adresse IP est publique et routable',
        isCorrect: false,
        explanation: 'MASQUERADE remplace l\'adresse source par l\'adresse de l\'interface sortante, quelle qu\'elle soit.',
        explanationFr: 'MASQUERADE remplace l\'adresse source par l\'adresse de l\'interface sortante, quelle qu\'elle soit.'
      },
      {
        id: 'opt-3',
        label: 'WireGuard et OpenVPN requièrent obligatoirement net.ipv4.conf.all.rp_filter = 0',
        labelFr: 'WireGuard et OpenVPN requièrent obligatoirement net.ipv4.conf.all.rp_filter = 0',
        isCorrect: false,
        explanation: 'Bien que rp_filter puisse nécessiter un assouplissement (mode loose=2), ip_forward est le prérequis fondamental bloquant.',
        explanationFr: 'Bien que rp_filter puisse nécessiter un assouplissement (mode loose=2), ip_forward est le prérequis fondamental bloquant.'
      },
      {
        id: 'opt-4',
        label: 'La chaîne POSTROUTING doit avoir une politique par défaut en DROP',
        labelFr: 'La chaîne POSTROUTING doit avoir une politique par défaut en DROP',
        isCorrect: false,
        explanation: 'POSTROUTING en table nat a traditionnellement une politique ACCEPT.',
        explanationFr: 'POSTROUTING en table nat a traditionnellement une politique ACCEPT.'
      }
    ],
    correctedSnippet: `# Activer immédiatement :
sysctl -w net.ipv4.ip_forward=1

# Persister dans /etc/sysctl.d/99-ipforward.conf :
net.ipv4.ip_forward = 1`,
    fixExplanation: 'Activer le forwarding IPv4 via net.ipv4.ip_forward = 1 dans /etc/sysctl.d/.',
    fixExplanationFr: 'Activer le forwarding IPv4 via net.ipv4.ip_forward = 1 dans /etc/sysctl.d/.'
  },
  {
    id: 'tb-lpic3-303-14',
    title: 'Échec de déchiffrement LUKS au boot via clé USB ou fichier clé',
    titleFr: 'Échec de déchiffrement LUKS au boot via clé USB ou fichier clé',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.2',
    category: 'crypttab Configuration & Automated Unlock',
    scenario: 'Au démarrage du serveur, le déverrouillage automatique du volume de données chiffré échoue et bascule en invite de saisie manuelle de mot de passe emergency.',
    scenarioFr: 'Au démarrage du serveur, le déverrouillage automatique du volume de données chiffré échoue et bascule en invite de saisie manuelle de mot de passe emergency.',
    codeSnippet: `# /etc/crypttab
data_crypt /dev/sdb1 /root/keys/data.key luks,discard,keyscript=/bin/cat`,
    language: 'config',
    bugDescription: 'La clé de déchiffrement /root/keys/data.key est située sur la partition racine avant que celle-ci ne soit totalement montée en lecture-écriture par l\'initramfs, ou le chemin est inaccessible.',
    bugDescriptionFr: 'La clé de déchiffrement /root/keys/data.key est située sur la partition racine avant que celle-ci ne soit totalement montée en lecture-écriture par l\'initramfs, ou le chemin est inaccessible.',
    options: [
      {
        id: 'opt-1',
        label: 'Dans /etc/crypttab, l\'option "keyscript=/bin/cat" est inutile et source d\'erreur pour un simple fichier clé ; de plus, le fichier clé doit être accessible dans l\'initramfs ou sur un média dédié',
        labelFr: 'Dans /etc/crypttab, l\'option "keyscript=/bin/cat" est inutile et source d\'erreur pour un simple fichier clé ; de plus, le fichier clé doit être accessible dans l\'initramfs ou sur un média dédié',
        isCorrect: true,
        explanation: 'Pour un fichier clé standard sur disque, il suffit de renseigner son chemin dans le 3ème champ sans keyscript. Si le volume est requis au boot précoce, la clé doit être intégrée dans l\'initramfs.',
        explanationFr: 'Pour un fichier clé standard sur disque, il suffit de renseigner son chemin dans le 3ème champ sans keyscript. Si le volume est requis au boot précoce, la clé doit être intégrée dans l\'initramfs.'
      },
      {
        id: 'opt-2',
        label: 'L\'option luks est interdite dans crypttab sous Debian et Ubuntu',
        labelFr: 'L\'option luks est interdite dans crypttab sous Debian et Ubuntu',
        isCorrect: false,
        explanation: 'luks est l\'option standard indiquant le format du conteneur.',
        explanationFr: 'luks est l\'option standard indiquant le format du conteneur.'
      },
      {
        id: 'opt-3',
        label: 'Le premier champ doit être /dev/mapper/data_crypt et non data_crypt',
        labelFr: 'Le premier champ doit être /dev/mapper/data_crypt et non data_crypt',
        isCorrect: false,
        explanation: 'Le premier champ est le nom cible de mapping (target name), sans le préfixe /dev/mapper/.',
        explanationFr: 'Le premier champ est le nom cible de mapping (target name), sans le préfixe /dev/mapper/.'
      },
      {
        id: 'opt-4',
        label: 'discard doit obligatoirement être remplacé par trim',
        labelFr: 'discard doit obligatoirement être remplacé par trim',
        isCorrect: false,
        explanation: 'L\'option crypttab pour transmettre les commandes TRIM est bien "discard".',
        explanationFr: 'L\'option crypttab pour transmettre les commandes TRIM est bien "discard".'
      }
    ],
    correctedSnippet: `# /etc/crypttab simplifié et correct
data_crypt UUID=3c4d5e6f-7890-abcd-ef01-234567890abc /etc/keys/data.key luks,discard`,
    fixExplanation: 'Utiliser l\'UUID du volume et spécifier directement le chemin du keyfile sans directive keyscript inutile.',
    fixExplanationFr: 'Utiliser l\'UUID du volume et spécifier directement le chemin du keyfile sans directive keyscript inutile.'
  },
  {
    id: 'tb-lpic3-303-15',
    title: 'Suricata IDS : règle d\'alerte ignorée car la directive action est pass',
    titleFr: 'Suricata IDS : règle d\'alerte ignorée car la directive action est pass',
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.2',
    category: 'Intrusion Detection Systems (Suricata/Snort)',
    scenario: 'L\'analyste SOC a écrit une règle Suricata pour détecter les scans Nmap SYN, mais aucune alerte n\'apparaît dans /var/log/suricata/fast.log lors des tests d\'intrusion.',
    scenarioFr: 'L\'analyste SOC a écrit une règle Suricata pour détecter les scans Nmap SYN, mais aucune alerte n\'apparaît dans /var/log/suricata/fast.log lors des tests d\'intrusion.',
    codeSnippet: `# /etc/suricata/rules/local.rules
pass tcp any any -> $HOME_NET 22 (msg:"SCAN Nmap SYN detected"; flags:S; sid:1000001; rev:1;)`,
    language: 'config',
    bugDescription: 'Le mot-clé d\'action de début de règle est "pass" au lieu de "alert", ce qui ordonne à Suricata d\'ignorer silencieusement le paquet sans consigner d\'alerte.',
    bugDescriptionFr: 'Le mot-clé d\'action de début de règle est "pass" au lieu de "alert", ce qui ordonne à Suricata d\'ignorer silencieusement le paquet sans consigner d\'alerte.',
    options: [
      {
        id: 'opt-1',
        label: 'L\'action de la règle est "pass" (laisser passer sans loguer) ; il faut utiliser l\'action "alert" pour déclencher une notification dans les journaux IDS',
        labelFr: 'L\'action de la règle est "pass" (laisser passer sans loguer) ; il faut utiliser l\'action "alert" pour déclencher une notification dans les journaux IDS',
        isCorrect: true,
        explanation: 'Dans Snort et Suricata, l\'action "pass" court-circuite l\'inspection du paquet et supprime toute alerte. Pour consigner l\'événement, l\'action doit être "alert" (ou "drop" en mode IPS inline).',
        explanationFr: 'Dans Snort et Suricata, l\'action "pass" court-circuite l\'inspection du paquet et supprime toute alerte. Pour consigner l\'événement, l\'action doit être "alert" (ou "drop" en mode IPS inline).'
      },
      {
        id: 'opt-2',
        label: 'Le sid 1000001 est illégal, les SID locaux doivent commencer à 1',
        labelFr: 'Le sid 1000001 est illégal, les SID locaux doivent commencer à 1',
        isCorrect: false,
        explanation: 'La plage 1 000 000 à 1 999 999 est justement réservée aux règles locales personnalisées.',
        explanationFr: 'La plage 1 000 000 à 1 999 999 est justement réservée aux règles locales personnalisées.'
      },
      {
        id: 'opt-3',
        label: 'flags:S n\'est pas supporté par Suricata, il faut écrire flags:SYN',
        labelFr: 'flags:S n\'est pas supporté par Suricata, il faut écrire flags:SYN',
        isCorrect: false,
        explanation: 'flags:S est la notation standard pour le drapeau TCP SYN.',
        explanationFr: 'flags:S est la notation standard pour le drapeau TCP SYN.'
      },
      {
        id: 'opt-4',
        label: '$HOME_NET doit être écrit en minuscules $home_net',
        labelFr: '$HOME_NET doit être écrit en minuscules $home_net',
        isCorrect: false,
        explanation: 'Les variables de configuration de Suricata sont définies en majuscules ($HOME_NET, $EXTERNAL_NET).',
        explanationFr: 'Les variables de configuration de Suricata sont définies en majuscules ($HOME_NET, $EXTERNAL_NET).'
      }
    ],
    correctedSnippet: `alert tcp any any -> $HOME_NET 22 (msg:"SCAN Nmap SYN detected"; flags:S; sid:1000001; rev:1;)`,
    fixExplanation: 'Remplacer l\'action "pass" par "alert" en tête de règle.',
    fixExplanationFr: 'Remplacer l\'action "pass" par "alert" en tête de règle.'
  },
  {
    id: 'tb-lpic3-303-16',
    title: 'Auditd : surveillance de fichier non prise en compte (syntaxe w vs a)',
    titleFr: 'Auditd : surveillance de fichier non prise en compte (syntaxe w vs a)',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.2',
    category: 'auditd Rules & File Watchers',
    scenario: 'L\'auditeur veut être alerté de toute tentative de modification ou d\'accès au fichier /etc/shadow. Cependant ausearch ne trouve aucun événement après un "cat /etc/shadow".',
    scenarioFr: 'L\'auditeur veut être alerté de toute tentative de modification ou d\'accès au fichier /etc/shadow. Cependant ausearch ne trouve aucun événement après un "cat /etc/shadow".',
    codeSnippet: `# /etc/audit/rules.d/shadow.rules
-w /etc/shadow -p wa -k shadow_changes`,
    language: 'config',
    bugDescription: 'Les permissions surveillées (-p wa) ne tracent que l\'écriture (w) et l\'attribut (a), mais n\'incluent pas la lecture (-p r), le simple cat n\'est donc pas consigné.',
    bugDescriptionFr: 'Les permissions surveillées (-p wa) ne tracent que l\'écriture (w) et l\'attribut (a), mais n\'incluent pas la lecture (-p r), le simple cat n\'est donc pas consigné.',
    options: [
      {
        id: 'opt-1',
        label: 'L\'indicateur de permission -p wa ne trace que l\'écriture (w) et l\'attribut (a) ; pour tracer la lecture par cat, il faut ajouter "r" (-p rwa)',
        labelFr: 'L\'indicateur de permission -p wa ne trace que l\'écriture (w) et l\'attribut (a) ; pour tracer la lecture par cat, il faut ajouter "r" (-p rwa)',
        isCorrect: true,
        explanation: 'Sous auditd, les filtres de permission -p acceptent r (read), w (write), x (execute) et a (attribute change). Pour surveiller les lectures d\'un fichier sensible, "r" est indispensable.',
        explanationFr: 'Sous auditd, les filtres de permission -p acceptent r (read), w (write), x (execute) et a (attribute change). Pour surveiller les lectures d\'un fichier sensible, "r" est indispensable.'
      },
      {
        id: 'opt-2',
        label: 'Le paramètre -k ne doit pas comporter de tiret bas',
        labelFr: 'Le paramètre -k ne doit pas comporter de tiret bas',
        isCorrect: false,
        explanation: 'Le mot-clé (key) est une chaîne arbitraire libre.',
        explanationFr: 'Le mot-clé (key) est une chaîne arbitraire libre.'
      },
      {
        id: 'opt-3',
        label: 'Le chemin /etc/shadow doit être entouré de crochets',
        labelFr: 'Le chemin /etc/shadow doit être entouré de crochets',
        isCorrect: false,
        explanation: 'La syntaxe exacte est -w /chemin/fichier.',
        explanationFr: 'La syntaxe exacte est -w /chemin/fichier.'
      },
      {
        id: 'opt-4',
        label: 'auditd ne sait pas surveiller les fichiers texte',
        labelFr: 'auditd ne sait pas surveiller les fichiers texte',
        isCorrect: false,
        explanation: 'auditd surveille n\'importe quel inode ou fichier sur un système de fichiers supporté.',
        explanationFr: 'auditd surveille n\'importe quel inode ou fichier sur un système de fichiers supporté.'
      }
    ],
    correctedSnippet: `-w /etc/shadow -p rwa -k shadow_access
# Recharger les règles :
augenrules --load`,
    fixExplanation: 'Ajouter l\'autorisation "r" dans le masque des permissions avec -p rwa.',
    fixExplanationFr: 'Ajouter l\'autorisation "r" dans le masque des permissions avec -p rwa.'
  },
  {
    id: 'tb-lpic3-303-17',
    title: 'Défaut de vérification OCSP dans Apache mod_ssl',
    titleFr: 'Défaut de vérification OCSP dans Apache mod_ssl',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.1',
    category: 'OCSP & Certificate Revocation',
    scenario: 'Après avoir activé OCSP Stapling sur Apache, les requêtes échouent avec "AH01926: SSLStapling: cannot connect to OCSP responder" ou les clients reçoivent un warning de négociation TLS lente.',
    scenarioFr: 'Après avoir activé OCSP Stapling sur Apache, les requêtes échouent avec "AH01926: SSLStapling: cannot connect to OCSP responder" ou les clients reçoivent un warning de négociation TLS lente.',
    codeSnippet: `# /etc/apache2/mods-enabled/ssl.conf
SSLUseStapling On
SSLStaplingCache "shmcb:/var/run/ocsp(128000)"
# Mais le serveur ne peut pas résoudre l'URL du répondeur OCSP :
# curl http://ocsp.digicert.com -> échec DNS`,
    language: 'config',
    bugDescription: 'Le serveur web lui-même doit pouvoir résoudre les noms DNS et accéder au port HTTP 80 externe pour contacter le répondeur OCSP de l\'autorité émettrice.',
    bugDescriptionFr: 'Le serveur web lui-même doit pouvoir résoudre les noms DNS et accéder au port HTTP 80 externe pour contacter le répondeur OCSP de l\'autorité émettrice.',
    options: [
      {
        id: 'opt-1',
        label: 'Pour l\'OCSP Stapling, le serveur web doit impérativement avoir une sortie réseau HTTP et un résolveur DNS fonctionnel pour contacter l\'URI OCSP spécifiée dans le certificat',
        labelFr: 'Pour l\'OCSP Stapling, le serveur web doit impérativement avoir une sortie réseau HTTP et un résolveur DNS fonctionnel pour contacter l\'URI OCSP spécifiée dans le certificat',
        isCorrect: true,
        explanation: 'Contrairement à une vérification par le client, l\'OCSP Stapling délègue la requête au serveur web, qui met en cache la réponse signée de l\'OCSP responder de la CA. Le serveur doit donc pouvoir communiquer vers l\'extérieur.',
        explanationFr: 'Contrairement à une vérification par le client, l\'OCSP Stapling délègue la requête au serveur web, qui met en cache la réponse signée de l\'OCSP responder de la CA. Le serveur doit donc pouvoir communiquer vers l\'extérieur.'
      },
      {
        id: 'opt-2',
        label: 'L\'OCSP Stapling n\'est supporté que sur le port TCP 443 en interne',
        labelFr: 'L\'OCSP Stapling n\'est supporté que sur le port TCP 443 en interne',
        isCorrect: false,
        explanation: 'Les requêtes vers les répondeurs OCSP se font conventionnellement en HTTP (port 80).',
        explanationFr: 'Les requêtes vers les répondeurs OCSP se font conventionnellement en HTTP (port 80).'
      },
      {
        id: 'opt-3',
        label: 'SSLUseStapling doit obligatoirement être configuré à "Off"',
        labelFr: 'SSLUseStapling doit obligatoirement être configuré à "Off"',
        isCorrect: false,
        explanation: 'Désactiver l\'OCSP Stapling dégrade la sécurité et la confidentialité des clients.',
        explanationFr: 'Désactiver l\'OCSP Stapling dégrade la sécurité et la confidentialité des clients.'
      },
      {
        id: 'opt-4',
        label: 'shmcb est déprécié et interdit sous Apache 2.4',
        labelFr: 'shmcb est déprécié et interdit sous Apache 2.4',
        isCorrect: false,
        explanation: 'shmcb (shared memory cyclic buffer) est le cache mémoire standard et recommandé.',
        explanationFr: 'shmcb (shared memory cyclic buffer) est le cache mémoire standard et recommandé.'
      }
    ],
    correctedSnippet: `# Vérifier la résolution DNS et l'accès sortant port 80 :
curl -Iv http://ocsp.digicert.com
# Configurer un résolveur DNS fiable dans /etc/resolv.conf`,
    fixExplanation: 'Permettre au serveur web de joindre le répondeur OCSP de l\'autorité de certification en HTTP sortant.',
    fixExplanationFr: 'Permettre au serveur web de joindre le répondeur OCSP de l\'autorité de certification en HTTP sortant.'
  },
  {
    id: 'tb-lpic3-303-18',
    title: 'Attribut chattr immuable (+i) empêchant les mises à jour de paquets',
    titleFr: 'Attribut chattr immuable (+i) empêchant les mises à jour de paquets',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.1',
    category: 'Discretionary Access Control & File Attributes',
    scenario: 'L\'exécution de "apt-get upgrade" ou "dnf update" échoue avec l\'erreur "cannot write to /etc/resolv.conf: Operation not permitted", alors que la commande est lancée par root.',
    scenarioFr: 'L\'exécution de "apt-get upgrade" ou "dnf update" échoue avec l\'erreur "cannot write to /etc/resolv.conf: Operation not permitted", alors que la commande est lancée par root.',
    codeSnippet: `# lsattr /etc/resolv.conf
----i---------e---- /etc/resolv.conf

# rm -f /etc/resolv.conf
rm: cannot remove '/etc/resolv.conf': Operation not permitted`,
    language: 'bash',
    bugDescription: 'Le fichier possède l\'attribut étendu ext4/xfs "i" (immutable), qui interdit toute modification, écrasement ou suppression, y compris par le superutilisateur root.',
    bugDescriptionFr: 'Le fichier possède l\'attribut étendu ext4/xfs "i" (immutable), qui interdit toute modification, écrasement ou suppression, y compris par le superutilisateur root.',
    options: [
      {
        id: 'opt-1',
        label: 'Le fichier possède l\'attribut immuable (+i) positionné par chattr, ce qui interdit formellement toute modification y compris à root',
        labelFr: 'Le fichier possède l\'attribut immuable (+i) positionné par chattr, ce qui interdit formellement toute modification y compris à root',
        isCorrect: true,
        explanation: 'L\'attribut "i" (immutable) géré par chattr/lsattr bloque toute altération, écriture ou suppression, même pour UID 0. Il faut exécuter "chattr -i /etc/resolv.conf" pour lever le verrou.',
        explanationFr: 'L\'attribut "i" (immutable) géré par chattr/lsattr bloque toute altération, écriture ou suppression, même pour UID 0. Il faut exécuter "chattr -i /etc/resolv.conf" pour lever le verrou.'
      },
      {
        id: 'opt-2',
        label: 'L\'attribut "e" indique une erreur de secteur corrompu sur le SSD',
        labelFr: 'L\'attribut "e" indique une erreur de secteur corrompu sur le SSD',
        isCorrect: false,
        explanation: 'L\'attribut "e" (extent format) indique simplement que le fichier utilise des extents sur ext4.',
        explanationFr: 'L\'attribut "e" (extent format) indique simplement que le fichier utilise des extents sur ext4.'
      },
      {
        id: 'opt-3',
        label: 'Le binaire rm est infecté par un rootkit',
        labelFr: 'Le binaire rm est infecté par un rootkit',
        isCorrect: false,
        explanation: 'C\'est le comportement standard du noyau Linux face à un fichier immuable.',
        explanationFr: 'C\'est le comportement standard du noyau Linux face à un fichier immuable.'
      },
      {
        id: 'opt-4',
        label: 'resolv.conf doit obligatoirement être un lien symbolique vers /etc/hosts',
        labelFr: 'resolv.conf doit obligatoirement être un lien symbolique vers /etc/hosts',
        isCorrect: false,
        explanation: 'resolv.conf et hosts sont deux fichiers de configuration distincts.',
        explanationFr: 'resolv.conf et hosts sont deux fichiers de configuration distincts.'
      }
    ],
    correctedSnippet: `chattr -i /etc/resolv.conf
# Appliquer la modification
apt-get upgrade`,
    fixExplanation: 'Retirer l\'attribut immuable avec "chattr -i".',
    fixExplanationFr: 'Retirer l\'attribut immuable avec "chattr -i".'
  },
  {
    id: 'tb-lpic3-303-19',
    title: 'Erreur de syntaxe dans /etc/sudoers (visudo validation failure)',
    titleFr: 'Erreur de syntaxe dans /etc/sudoers (visudo validation failure)',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.3',
    category: 'Privilege Management & sudoers',
    scenario: 'L\'administrateur veut déléguer le redémarrage du service httpd à l\'équipe web. La commande visudo signale une erreur de parsing et refuse d\'enregistrer le fichier.',
    scenarioFr: 'L\'administrateur veut déléguer le redémarrage du service httpd à l\'équipe web. La commande visudo signale une erreur de parsing et refuse d\'enregistrer le fichier.',
    codeSnippet: `# /etc/sudoers.d/webdev
User_Alias WEBADMINS = alice, bob
Cmnd_Alias RESTART_WEB = /usr/bin/systemctl restart httpd, /usr/bin/systemctl reload httpd

WEBADMINS ALL = (root) RESTART_WEB NOPASSWD`,
    language: 'config',
    bugDescription: 'L\'étiquette NOPASSWD est un modificateur de commande et doit impérativement être placée AVANT la liste des commandes avec un deux-points (NOPASSWD: RESTART_WEB).',
    bugDescriptionFr: 'L\'étiquette NOPASSWD est un modificateur de commande et doit impérativement être placée AVANT la liste des commandes avec un deux-points (NOPASSWD: RESTART_WEB).',
    options: [
      {
        id: 'opt-1',
        label: 'Le mot-clé NOPASSWD doit impérativement précéder la commande et être suivi de deux-points (ex: (root) NOPASSWD: RESTART_WEB)',
        labelFr: 'Le mot-clé NOPASSWD doit impérativement précéder la commande et être suivi de deux-points (ex: (root) NOPASSWD: RESTART_WEB)',
        isCorrect: true,
        explanation: 'Dans la grammaire EBNF de sudoers, NOPASSWD: est une balise de spécification de commande et se place immédiatement avant la liste de commandes.',
        explanationFr: 'Dans la grammaire EBNF de sudoers, NOPASSWD: est une balise de spécification de commande et se place immédiatement avant la liste de commandes.'
      },
      {
        id: 'opt-2',
        label: 'User_Alias est limité à un seul utilisateur et n\'accepte pas de liste séparée par des virgules',
        labelFr: 'User_Alias est limité à un seul utilisateur et n\'accepte pas de liste séparée par des virgules',
        isCorrect: false,
        explanation: 'User_Alias est explicitement fait pour regrouper plusieurs utilisateurs.',
        explanationFr: 'User_Alias est explicitement fait pour regrouper plusieurs utilisateurs.'
      },
      {
        id: 'opt-3',
        label: 'systemctl ne peut pas être invoqué via sudo pour des raisons de sécurité noyau',
        labelFr: 'systemctl ne peut pas être invoqué via sudo pour des raisons de sécurité noyau',
        isCorrect: false,
        explanation: 'systemctl est fréquemment délégué via sudo.',
        explanationFr: 'systemctl est fréquemment délégué via sudo.'
      },
      {
        id: 'opt-4',
        label: 'Le dossier /etc/sudoers.d/ n\'est lu que si les fichiers se terminent par .conf',
        labelFr: 'Le dossier /etc/sudoers.d/ n\'est lu que si les fichiers se terminent par .conf',
        isCorrect: false,
        explanation: 'C\'est l\'inverse : sudoers.d ignore les fichiers contenant un point (".") dans leur nom.',
        explanationFr: 'C\'est l\'inverse : sudoers.d ignore les fichiers contenant un point (".") dans leur nom.'
      }
    ],
    correctedSnippet: `User_Alias WEBADMINS = alice, bob
Cmnd_Alias RESTART_WEB = /usr/bin/systemctl restart httpd, /usr/bin/systemctl reload httpd

WEBADMINS ALL = (root) NOPASSWD: RESTART_WEB`,
    fixExplanation: 'Positionner la balise "NOPASSWD:" avant le nom de l\'alias de commande.',
    fixExplanationFr: 'Positionner la balise "NOPASSWD:" avant le nom de l\'alias de commande.'
  },
  {
    id: 'tb-lpic3-303-20',
    title: 'Fail2ban : filtre regex ne matchant pas les logs formatés en ISO8601',
    titleFr: 'Fail2ban : filtre regex ne matchant pas les logs formatés en ISO8601',
    certification: 'lpic-3',
    topicNumber: 326,
    objectiveId: '326.2',
    category: 'Intrusion Prevention (Fail2ban)',
    scenario: 'Fail2ban ne bloque aucune adresse IP malgré des centaines d\'attaques SSH visibles dans /var/log/auth.log. "fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf" indique 0 correspondances.',
    scenarioFr: 'Fail2ban ne bloque aucune adresse IP malgré des centaines d\'attaques SSH visibles dans /var/log/auth.log. "fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf" indique 0 correspondances.',
    codeSnippet: `# Exemple de log système journald/rsyslog :
2026-09-09T14:32:01.123456+02:00 srv01 sshd[4012]: Failed password for invalid user admin from 198.51.100.42 port 52312 ssh2

# fail2ban-client status sshd
|- Currently failed: 0
|- Total failed:     0
|- Currently banned: 0`,
    language: 'config',
    bugDescription: 'La configuration datepattern de fail2ban ou le backend utilisé (polling file vs systemd journal) ne prend pas en compte le format d\'horodatage ISO8601 à haute précision.',
    bugDescriptionFr: 'La configuration datepattern de fail2ban ou le backend utilisé (polling file vs systemd journal) ne prend pas en compte le format d\'horodatage ISO8601 à haute précision.',
    options: [
      {
        id: 'opt-1',
        label: 'Le backend de fail2ban doit être configuré sur "backend = systemd" pour lire directement les entrées du journald sans dépendre d\'un parsing texte d\'horodatage',
        labelFr: 'Le backend de fail2ban doit être configuré sur "backend = systemd" pour lire directement les entrées du journald sans dépendre d\'un parsing texte d\'horodatage',
        isCorrect: true,
        explanation: 'Sur les systèmes modernes utilisant systemd-journald, configurer "backend = systemd" dans jail.local permet à fail2ban d\'interroger directement le journal binaire sans problème de formatage de date.',
        explanationFr: 'Sur les systèmes modernes utilisant systemd-journald, configurer "backend = systemd" dans jail.local permet à fail2ban d\'interroger directement le journal binaire sans problème de formatage de date.'
      },
      {
        id: 'opt-2',
        label: 'Fail2ban est incompatible avec SSH version 2',
        labelFr: 'Fail2ban est incompatible avec SSH version 2',
        isCorrect: false,
        explanation: 'SSHv2 est le cas d\'usage numéro un de fail2ban.',
        explanationFr: 'SSHv2 est le cas d\'usage numéro un de fail2ban.'
      },
      {
        id: 'opt-3',
        label: 'Le port SSH doit être obligatoirement changé en 2222',
        labelFr: 'Le port SSH doit être obligatoirement changé en 2222',
        isCorrect: false,
        explanation: 'Le port n\'a aucun impact sur l\'analyse des expressions régulières.',
        explanationFr: 'Le port n\'a aucun impact sur l\'analyse des expressions régulières.'
      },
      {
        id: 'opt-4',
        label: 'fail2ban ne sait bloquer que les adresses IPv6',
        labelFr: 'fail2ban ne sait bloquer que les adresses IPv6',
        isCorrect: false,
        explanation: 'fail2ban bloque indifféremment IPv4 et IPv6.',
        explanationFr: 'fail2ban bloque indifféremment IPv4 et IPv6.'
      }
    ],
    correctedSnippet: `# /etc/fail2ban/jail.local
[DEFAULT]
backend = systemd

[sshd]
enabled = true`,
    fixExplanation: 'Configurer le backend sur "systemd" dans jail.local.',
    fixExplanationFr: 'Configurer le backend sur "systemd" dans jail.local.'
  },
  {
    id: 'tb-lpic3-303-21',
    title: 'Directive OpenSSL -CAcreateserial oubliée provoquant des conflits',
    titleFr: 'Directive OpenSSL -CAcreateserial oubliée provoquant des conflits',
    certification: 'lpic-3',
    topicNumber: 325,
    objectiveId: '325.1',
    category: 'OpenSSL CA Management',
    scenario: 'Lors de la signature d\'un nouveau certificat par l\'autorité interne avec "openssl x509 -req", la commande échoue avec "cannot find serial file ca.srl".',
    scenarioFr: 'Lors de la signature d\'un nouveau certificat par l\'autorité interne avec "openssl x509 -req", la commande échoue avec "cannot find serial file ca.srl".',
    codeSnippet: `$ openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -out client.crt -days 365
ca.srl: No such file or directory`,
    language: 'bash',
    bugDescription: 'Lors de la toute première émission avec -CA, le fichier de suivi des numéros de série (.srl) n\'existe pas encore. L\'option "-CAcreateserial" est requise pour l\'initialiser.',
    bugDescriptionFr: 'Lors de la toute première émission avec -CA, le fichier de suivi des numéros de série (.srl) n\'existe pas encore. L\'option "-CAcreateserial" est requise pour l\'initialiser.',
    options: [
      {
        id: 'opt-1',
        label: 'Lors de la première signature de certificat, l\'option "-CAcreateserial" est requise pour créer le fichier ca.srl contenant le compteur de numéros de série',
        labelFr: 'Lors de la première signature de certificat, l\'option "-CAcreateserial" est requise pour créer le fichier ca.srl contenant le compteur de numéros de série',
        isCorrect: true,
        explanation: 'Pour garantir que chaque certificat émis par la CA possède un numéro de série unique (exigence RFC 5280), OpenSSL enregistre le dernier numéro dans un fichier .srl. L\'option -CAcreateserial crée ce fichier lors du premier certificat.',
        explanationFr: 'Pour garantir que chaque certificat émis par la CA possède un numéro de série unique (exigence RFC 5280), OpenSSL enregistre le dernier numéro dans un fichier .srl. L\'option -CAcreateserial crée ce fichier lors du premier certificat.'
      },
      {
        id: 'opt-2',
        label: 'ca.key doit obligatoirement avoir l\'extension .pem',
        labelFr: 'ca.key doit obligatoirement avoir l\'extension .pem',
        isCorrect: false,
        explanation: 'Les extensions de fichiers sont libres sous Linux.',
        explanationFr: 'Les extensions de fichiers sont libres sous Linux.'
      },
      {
        id: 'opt-3',
        label: 'openssl x509 a été supprimé dans OpenSSL 3.0',
        labelFr: 'openssl x509 a été supprimé dans OpenSSL 3.0',
        isCorrect: false,
        explanation: 'openssl x509 est l\'une des commandes fondamentales toujours présente.',
        explanationFr: 'openssl x509 est l\'une des commandes fondamentales toujours présente.'
      },
      {
        id: 'opt-4',
        label: '-days 365 est désormais interdit, le maximum légal est de 90 jours',
        labelFr: '-days 365 est désormais interdit, le maximum légal est de 90 jours',
        isCorrect: false,
        explanation: 'La durée -days reste paramétrable librement par l\'administrateur.',
        explanationFr: 'La durée -days reste paramétrable librement par l\'administrateur.'
      }
    ],
    correctedSnippet: `openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365`,
    fixExplanation: 'Ajouter l\'option -CAcreateserial lors de la première signature.',
    fixExplanationFr: 'Ajouter l\'option -CAcreateserial lors de la première signature.'
  },
  {
    id: 'tb-lpic3-303-22',
    title: 'Protection SYN Flood incomplète : syncookies désactivés',
    titleFr: 'Protection SYN Flood incomplète : syncookies désactivés',
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.1',
    category: 'Kernel Hardening & TCP/IP Stack',
    scenario: 'Un serveur web public subit une attaque par déni de service SYN Flood. La file d\'attente TCP se sature et le serveur ne répond plus aux connexions légitimes. dmesg affiche "TCP: request_sock_TCP: Possible SYN flooding on port 80. Dropping request."',
    scenarioFr: 'Un serveur web public subit une attaque par déni de service SYN Flood. La file d\'attente TCP se sature et le serveur ne répond plus aux connexions légitimes. dmesg affiche "TCP: request_sock_TCP: Possible SYN flooding on port 80. Dropping request."',
    codeSnippet: `# sysctl net.ipv4.tcp_syncookies
net.ipv4.tcp_syncookies = 0

# sysctl net.ipv4.tcp_max_syn_backlog
net.ipv4.tcp_max_syn_backlog = 128`,
    language: 'config',
    bugDescription: 'La protection cryptographique contre les attaques par inondation SYN (tcp_syncookies) est désactivée et la taille de la backlog SYN est trop restreinte.',
    bugDescriptionFr: 'La protection cryptographique contre les attaques par inondation SYN (tcp_syncookies) est désactivée et la taille de la backlog SYN est trop restreinte.',
    options: [
      {
        id: 'opt-1',
        label: 'La directive net.ipv4.tcp_syncookies est désactivée (0) ; l\'activer (1) permet au noyau de répondre avec un cookie cryptographique sans allouer d\'entrée mémoire tant que le ACK n\'est pas reçu',
        labelFr: 'La directive net.ipv4.tcp_syncookies est désactivée (0) ; l\'activer (1) permet au noyau de répondre avec un cookie cryptographique sans allouer d\'entrée mémoire tant que le ACK n\'est pas reçu',
        isCorrect: true,
        explanation: 'Les SYN cookies évitent l\'épuisement de la mémoire de la file SYN en encodant les paramètres de session dans le numéro de séquence initial (ISN) renvoyé dans le paquet SYN-ACK.',
        explanationFr: 'Les SYN cookies évitent l\'épuisement de la mémoire de la file SYN en encodant les paramètres de session dans le numéro de séquence initial (ISN) renvoyé dans le paquet SYN-ACK.'
      },
      {
        id: 'opt-2',
        label: 'tcp_syncookies ne fonctionne qu\'en association avec le protocole SCTP',
        labelFr: 'tcp_syncookies ne fonctionne qu\'en association avec le protocole SCTP',
        isCorrect: false,
        explanation: 'C\'est un mécanisme standard de la pile TCP.',
        explanationFr: 'C\'est un mécanisme standard de la pile TCP.'
      },
      {
        id: 'opt-3',
        label: 'Le port 80 doit être désactivé pour bloquer les paquets SYN',
        labelFr: 'Le port 80 doit être désactivé pour bloquer les paquets SYN',
        isCorrect: false,
        explanation: 'Le serveur web doit continuer de servir ses clients légitimes.',
        explanationFr: 'Le serveur web doit continuer de servir ses clients légitimes.'
      },
      {
        id: 'opt-4',
        label: 'tcp_max_syn_backlog doit être mis à 0',
        labelFr: 'tcp_max_syn_backlog doit être mis à 0',
        isCorrect: false,
        explanation: 'Mettre la backlog à 0 rejetterait immédiatement toute nouvelle connexion.',
        explanationFr: 'Mettre la backlog à 0 rejetterait immédiatement toute nouvelle connexion.'
      }
    ],
    correctedSnippet: `# /etc/sysctl.d/90-syn-protection.conf
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 4096`,
    fixExplanation: 'Activer tcp_syncookies = 1 et augmenter tcp_max_syn_backlog dans sysctl.',
    fixExplanationFr: 'Activer tcp_syncookies = 1 et augmenter tcp_max_syn_backlog dans sysctl.'
  },
  {
    id: 'tb-lpic3-303-23',
    title: 'Règle iptables FORWARD sans suivi d\'état de connexion (conntrack)',
    titleFr: 'Règle iptables FORWARD sans suivi d\'état de connexion (conntrack)',
    certification: 'lpic-3',
    topicNumber: 328,
    objectiveId: '328.3',
    category: 'iptables Stateful Inspection',
    scenario: 'Un pare-feu Linux autorise les requêtes HTTP sortantes du réseau interne vers Internet, mais les postes clients n\'affichent jamais les pages web (timeout).',
    scenarioFr: 'Un pare-feu Linux autorise les requêtes HTTP sortantes du réseau interne vers Internet, mais les postes clients n\'affichent jamais les pages web (timeout).',
    codeSnippet: `# iptables -L FORWARD -n -v
Chain FORWARD (policy DROP 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
   45  2700 ACCEPT     tcp  --  eth1   eth0    192.168.1.0/24       0.0.0.0/0            tcp dpt:80`,
    language: 'bash',
    bugDescription: 'La chaîne FORWARD possède une politique par défaut DROP mais ne possède aucune règle pour autoriser les paquets retour (RELATED,ESTABLISHED) depuis Internet vers le réseau local.',
    bugDescriptionFr: 'La chaîne FORWARD possède une politique par défaut DROP mais ne possède aucune règle pour autoriser les paquets retour (RELATED,ESTABLISHED) depuis Internet vers le réseau local.',
    options: [
      {
        id: 'opt-1',
        label: 'Il manque la règle autorisant le trafic retour établi et relié (state RELATED,ESTABLISHED) en sens inverse depuis eth0 vers eth1',
        labelFr: 'Il manque la règle autorisant le trafic retour établi et relié (state RELATED,ESTABLISHED) en sens inverse depuis eth0 vers eth1',
        isCorrect: true,
        explanation: 'iptables est un pare-feu à états (stateful). Si le paquet aller (SYN) sort vers le web, le paquet retour du serveur web (SYN-ACK) est intercepté et rejeté par la policy DROP de FORWARD sans conntrack.',
        explanationFr: 'iptables est un pare-feu à états (stateful). Si le paquet aller (SYN) sort vers le web, le paquet retour du serveur web (SYN-ACK) est intercepté et rejeté par la policy DROP de FORWARD sans conntrack.'
      },
      {
        id: 'opt-2',
        label: 'Le port HTTP 80 est obsolète et iptables exige le port 443',
        labelFr: 'Le port HTTP 80 est obsolète et iptables exige le port 443',
        isCorrect: false,
        explanation: 'iptables filtre sur les ports numériques sans restriction de protocole.',
        explanationFr: 'iptables filtre sur les ports numériques sans restriction de protocole.'
      },
      {
        id: 'opt-3',
        label: 'eth1 ne peut pas être une interface d\'entrée si policy DROP est active',
        labelFr: 'eth1 ne peut pas être une interface d\'entrée si policy DROP est active',
        isCorrect: false,
        explanation: 'La politique par défaut s\'applique en l\'absence de règle concordante.',
        explanationFr: 'La politique par défaut s\'applique en l\'absence de règle concordante.'
      },
      {
        id: 'opt-4',
        label: 'La table mangle doit être activée pour le trafic HTTP',
        labelFr: 'La table mangle doit être activée pour le trafic HTTP',
        isCorrect: false,
        explanation: 'Le filtrage de paquets s\'opère dans la table filter.',
        explanationFr: 'Le filtrage de paquets s\'opère dans la table filter.'
      }
    ],
    correctedSnippet: `iptables -I FORWARD 1 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT`,
    fixExplanation: 'Insérer la règle conntrack RELATED,ESTABLISHED en première position dans la chaîne FORWARD.',
    fixExplanationFr: 'Insérer la règle conntrack RELATED,ESTABLISHED en première position dans la chaîne FORWARD.'
  },
  {
    id: 'tb-lpic3-303-24',
    title: 'ACL POSIX par défaut non héritée par les sous-dossiers',
    titleFr: 'ACL POSIX par défaut non héritée par les sous-dossiers',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.1',
    category: 'POSIX Access Control Lists (setfacl)',
    scenario: 'L\'administrateur donne les droits d\'accès au groupe "audit" sur un dossier partagé avec setfacl. Cependant, dès qu\'un utilisateur crée un nouveau sous-dossier ou fichier, le groupe "audit" perd tout accès sur ce nouvel élément.',
    scenarioFr: 'L\'administrateur donne les droits d\'accès au groupe "audit" sur un dossier partagé avec setfacl. Cependant, dès qu\'un utilisateur crée un nouveau sous-dossier ou fichier, le groupe "audit" perd tout accès sur ce nouvel élément.',
    codeSnippet: `# Ce que l'administrateur a exécuté :
setfacl -m g:audit:rwx /srv/share

# getfacl /srv/share
# file: srv/share
# owner: root
# group: root
user::rwx
group::r-x
group:audit:rwx
mask::rwx
other::---
(aucune entrée "default:" présente)`,
    language: 'bash',
    bugDescription: 'L\'administrateur a positionné une ACL d\'accès simple sans définir d\'ACL par défaut ("default:" ou option -d), qui est l\'unique mécanisme d\'héritage pour les nouveaux fichiers et dossiers.',
    bugDescriptionFr: 'L\'administrateur a positionné une ACL d\'accès simple sans définir d\'ACL par défaut ("default:" ou option -d), qui est l\'unique mécanisme d\'héritage pour les nouveaux fichiers et dossiers.',
    options: [
      {
        id: 'opt-1',
        label: 'Pour que les nouveaux fichiers et répertoires créés héritent automatiquement des permissions, il faut définir une ACL par défaut avec l\'option "-d" (ex: setfacl -d -m g:audit:rwx /srv/share)',
        labelFr: 'Pour que les nouveaux fichiers et répertoires créés héritent automatiquement des permissions, il faut définir une ACL par défaut avec l\'option "-d" (ex: setfacl -d -m g:audit:rwx /srv/share)',
        isCorrect: true,
        explanation: 'Dans les ACLs POSIX, l\'ACL d\'accès s\'applique au répertoire lui-même, tandis que l\'ACL par défaut (default ACL, préfixe -d) est automatiquement transmise aux nouveaux enfants créés.',
        explanationFr: 'Dans les ACLs POSIX, l\'ACL d\'accès s\'applique au répertoire lui-même, tandis que l\'ACL par défaut (default ACL, préfixe -d) est automatiquement transmise aux nouveaux enfants créés.'
      },
      {
        id: 'opt-2',
        label: 'Les ACL POSIX ne sont pas supportées sur les systèmes de fichiers ext4',
        labelFr: 'Les ACL POSIX ne sont pas supportées sur les systèmes de fichiers ext4',
        isCorrect: false,
        explanation: 'ext4 supporte les ACL POSIX nativement depuis de nombreuses années.',
        explanationFr: 'ext4 supporte les ACL POSIX nativement depuis de nombreuses années.'
      },
      {
        id: 'opt-3',
        label: 'Le groupe "audit" doit obligatoirement être le groupe propriétaire Unix',
        labelFr: 'Le groupe "audit" doit obligatoirement être le groupe propriétaire Unix',
        isCorrect: false,
        explanation: 'Les ACLs servent justement à accorder des droits à des groupes additionnels sans changer le groupe propriétaire.',
        explanationFr: 'Les ACLs servent justement à accorder des droits à des groupes additionnels sans changer le groupe propriétaire.'
      },
      {
        id: 'opt-4',
        label: 'Le masque d\'ACL mask::rwx empêche toute création de fichier',
        labelFr: 'Le masque d\'ACL mask::rwx empêche toute création de fichier',
        isCorrect: false,
        explanation: 'Le masque rwx au contraire autorise tous les droits accordés.',
        explanationFr: 'Le masque rwx au contraire autorise tous les droits accordés.'
      }
    ],
    correctedSnippet: `setfacl -m g:audit:rwx /srv/share
setfacl -d -m g:audit:rwx /srv/share`,
    fixExplanation: 'Appliquer également l\'ACL par défaut avec l\'option -d pour assurer l\'héritage.',
    fixExplanationFr: 'Appliquer également l\'ACL par défaut avec l\'option -d pour assurer l\'héritage.'
  },
  {
    id: 'tb-lpic3-303-25',
    title: 'Booléen SELinux bloquant l\'accès Apache aux dossiers personnels (userdir)',
    titleFr: 'Booléen SELinux bloquant l\'accès Apache aux dossiers personnels (userdir)',
    certification: 'lpic-3',
    topicNumber: 327,
    objectiveId: '327.2',
    category: 'SELinux Booleans & Policy Management',
    scenario: 'Sur un serveur web d\'université, le module Apache mod_userdir est activé pour exposer http://serveur/~etudiant/public_html/. Les requêtes HTTP aboutissent à une erreur 403 Forbidden et SELinux consigne des refus AVC.',
    scenarioFr: 'Sur un serveur web d\'université, le module Apache mod_userdir est activé pour exposer http://serveur/~etudiant/public_html/. Les requêtes HTTP aboutissent à une erreur 403 Forbidden et SELinux consigne des refus AVC.',
    codeSnippet: `# getsebool httpd_enable_homedirs
httpd_enable_homedirs --> off

# audit2why < /var/log/audit/audit.log
type=AVC ... comm="httpd" name="public_html" ...
    Was caused by:
    The boolean httpd_enable_homedirs was set to off.`,
    language: 'bash',
    bugDescription: 'Le booléen SELinux régissant l\'accès d\'Apache aux répertoires personnels des utilisateurs (httpd_enable_homedirs) est positionné à "off".',
    bugDescriptionFr: 'Le booléen SELinux régissant l\'accès d\'Apache aux répertoires personnels des utilisateurs (httpd_enable_homedirs) est positionné à "off".',
    options: [
      {
        id: 'opt-1',
        label: 'Le booléen SELinux "httpd_enable_homedirs" est à "off" ; il faut le basculer à "on" de manière persistante avec setsebool -P httpd_enable_homedirs on',
        labelFr: 'Le booléen SELinux "httpd_enable_homedirs" est à "off" ; il faut le basculer à "on" de manière persistante avec setsebool -P httpd_enable_homedirs on',
        isCorrect: true,
        explanation: 'Pour éviter que le serveur web ne lise des données personnelles privées dans /home, SELinux désactive cet accès par défaut. L\'option -P rend le paramètre persistant aux redémarrages.',
        explanationFr: 'Pour éviter que le serveur web ne lise des données personnelles privées dans /home, SELinux désactive cet accès par défaut. L\'option -P rend le paramètre persistant aux redémarrages.'
      },
      {
        id: 'opt-2',
        label: 'Les répertoires /home doivent tous être renommés en /var/www/homes/',
        labelFr: 'Les répertoires /home doivent tous être renommés en /var/www/homes/',
        isCorrect: false,
        explanation: 'SELinux sait parfaitement gérer les home directories grâce à ses booléens dédiés.',
        explanationFr: 'SELinux sait parfaitement gérer les home directories grâce à ses booléens dédiés.'
      },
      {
        id: 'opt-3',
        label: 'mod_userdir est interdit par le standard LPIC-3 pour des motifs de conformité',
        labelFr: 'mod_userdir est interdit par le standard LPIC-3 pour des motifs de conformité',
        isCorrect: false,
        explanation: 'C\'est une fonctionnalité classique étudiée dans les objectifs de sécurité web.',
        explanationFr: 'C\'est une fonctionnalité classique étudiée dans les objectifs de sécurité web.'
      },
      {
        id: 'opt-4',
        label: 'setsebool ne supporte pas l\'option -P sous Red Hat Enterprise Linux',
        labelFr: 'setsebool -P est la commande officielle pour persister les booléens SELinux',
        isCorrect: false,
        explanation: 'L\'option -P (persistent) est la commande officielle.',
        explanationFr: 'L\'option -P (persistent) est la commande officielle.'
      }
    ],
    correctedSnippet: `setsebool -P httpd_enable_homedirs on
systemctl restart httpd`,
    fixExplanation: 'Activer le booléen httpd_enable_homedirs avec l\'option -P pour pérenniser le réglage.',
    fixExplanationFr: 'Activer le booléen httpd_enable_homedirs avec l\'option -P pour pérenniser le réglage.'
  }
];
