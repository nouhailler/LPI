import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-2 : Examen 202 (Partie 2: Topics 210, 211, 212)
 * Topics couverts :
 * - Topic 210 : Network Client Management (DHCP authoritative, hardware ethernet, PAM faillock, control flags, OpenLDAP TLS/SSSD)
 * - Topic 211 : E-Mail Services (Postfix open relay, newaliases, Dovecot mail_location, TLS plain auth, spamassassin, queue)
 * - Topic 212 : System Security (OpenSSH permissions & hardening, Fail2ban systemd, iptables stateful, nftables inet, OpenVPN tun/CRL, TCP wrappers, knockd)
 */
export const lpic2Troubleshoot202_2: TroubleshootingChallenge[] = [
  {
    id: "tb-lpic2-202-76",
    title: "Serveur DHCP ISC inactif sur le réseau : Directive 'authoritative' omise",
    titleFr: "Serveur DHCP ISC inactif sur le réseau : Directive 'authoritative' omise",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.1",
    category: "Network Client Management - DHCP Server",
    scenario: "Un nouveau serveur DHCP (isc-dhcp-server) a été déployé. Les clients ayant changé de sous-réseau envoient des DHCPREQUEST mais le serveur ne répond jamais par un DHCPNAK pour corriger l'IP.",
    scenarioFr: "Un nouveau serveur DHCP (isc-dhcp-server) a été déployé. Les clients ayant changé de sous-réseau envoient des DHCPREQUEST mais le serveur ne répond jamais par un DHCPNAK pour corriger l'IP.",
    codeSnippet: `# dhcpd.conf
# authoritative;
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.100 192.168.20.200;
    option routers 192.168.20.1;
}

# Journal d'activité dhcpd :
dhcpd: DHCPREQUEST for 192.168.1.50 from 52:54:00:11:22:33 via eth0: ignored (not authoritative)`,
    language: "config",
    bugDescription: "La directive 'authoritative' est commentée dans /etc/dhcp/dhcpd.conf. Le serveur refuse d'envoyer des DHCPNAK pour refuser les anciennes adresses obsolètes des clients itinérants.",
    bugDescriptionFr: "La directive 'authoritative' est commentée dans /etc/dhcp/dhcpd.conf. Le serveur refuse d'envoyer des DHCPNAK pour refuser les anciennes adresses obsolètes des clients itinérants.",
    options: [
      {
        id: "opt-1",
        label: "Décommenter ou ajouter la directive globale 'authoritative;' dans /etc/dhcp/dhcpd.conf pour que le serveur impose ses baux et envoie des DHCPNAK",
        labelFr: "Décommenter ou ajouter la directive globale 'authoritative;' dans /etc/dhcp/dhcpd.conf pour que le serveur impose ses baux et envoie des DHCPNAK",
        isCorrect: true,
        explanation: "La directive authoritative ordonne au serveur DHCP de rejeter activement les baux incohérents via DHCPNAK afin que les clients réémettent un DHCPDISCOVER immédiat.",
        explanationFr: "Activer la directive authoritative dans dhcpd.conf."
      },
      {
        id: "opt-2",
        label: "Passer le netmask en 255.0.0.0",
        labelFr: "Passer le netmask en 255.0.0.0",
        isCorrect: false,
        explanation: "Le masque doit correspondre au plan d'adressage IP réel du réseau.",
        explanationFr: "Le masque doit correspondre au plan d'adressage réel."
      },
      {
        id: "opt-3",
        label: "Remplacer le protocole UDP par TCP pour DHCP",
        labelFr: "Remplacer le protocole UDP par TCP pour DHCP",
        isCorrect: false,
        explanation: "DHCP fonctionne exclusivement sur les ports UDP 67 (serveur) et 68 (client).",
        explanationFr: "DHCP fonctionne sur UDP 67/68."
      },
      {
        id: "opt-4",
        label: "Supprimer le fichier dhcpd.leases",
        labelFr: "Supprimer le fichier dhcpd.leases",
        isCorrect: false,
        explanation: "Le fichier de baux est indispensable au suivi de distribution d'adresses.",
        explanationFr: "Le fichier de baux est indispensable."
      }
    ],
    correctedSnippet: `# Dans /etc/dhcp/dhcpd.conf :
authoritative;

subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.100 192.168.20.200;
    option routers 192.168.20.1;
    option domain-name-servers 192.168.20.1;
}`,
    fixExplanation: "Ajouter 'authoritative;' en tête du fichier dhcpd.conf.",
    fixExplanationFr: "Ajouter 'authoritative;' en tête du fichier dhcpd.conf."
  },
  {
    id: "tb-lpic2-202-77",
    title: "Attribution d'IP fixe DHCP ignorée (Syntaxe hardware ethernet erronée)",
    titleFr: "Attribution d'IP fixe DHCP ignorée (Syntaxe hardware ethernet erronée)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.1",
    category: "Network Client Management - DHCP Reservations",
    scenario: "Une imprimante réseau censée recevoir l'IP statique 192.168.1.50 par réservation DHCP reçoit une IP dynamique aléatoire de la plage range.",
    scenarioFr: "Une imprimante réseau censée recevoir l'IP statique 192.168.1.50 par réservation DHCP reçoit une IP dynamique aléatoire de la plage range.",
    codeSnippet: `# dhcpd.conf
host printer {
    hardware 00:11:22:33:44:55;
    fixed-address 192.168.1.50;
}

# /var/log/syslog
dhcpd: /etc/dhcp/dhcpd.conf line 15: expecting a parameter or declaration.
dhcpd:     hardware 00:11:22:33:44:55;
dhcpd:              ^`,
    language: "config",
    bugDescription: "La syntaxe DHCP ISC exige de spécifier le type de média réseau 'ethernet' après le mot-clé 'hardware' : 'hardware ethernet 00:11:22:33:44:55;'.",
    bugDescriptionFr: "La syntaxe DHCP ISC exige de spécifier le type de média réseau 'ethernet' après le mot-clé 'hardware' : 'hardware ethernet 00:11:22:33:44:55;'.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter le mot-clé 'ethernet' : 'hardware ethernet 00:11:22:33:44:55;' dans la déclaration d'hôte",
        labelFr: "Ajouter le mot-clé 'ethernet' : 'hardware ethernet 00:11:22:33:44:55;' dans la déclaration d'hôte",
        isCorrect: true,
        explanation: "La directive hardware de dhcpd attend le type de couche physique (ethernet ou token-ring) suivi de l'adresse MAC.",
        explanationFr: "Corriger la syntaxe en utilisant 'hardware ethernet <mac>;'."
      },
      {
        id: "opt-2",
        label: "Remplacer l'adresse MAC par l'adresse IP",
        labelFr: "Remplacer l'adresse MAC par l'adresse IP",
        isCorrect: false,
        explanation: "La réservation est justement basée sur la correspondance de l'adresse MAC matérielle.",
        explanationFr: "La réservation repose sur l'adresse MAC."
      },
      {
        id: "opt-3",
        label: "Remplacer fixed-address par static-ip",
        labelFr: "Remplacer fixed-address par static-ip",
        isCorrect: false,
        explanation: "La directive officielle ISC DHCP est 'fixed-address'.",
        explanationFr: "La directive officielle est fixed-address."
      },
      {
        id: "opt-4",
        label: "Supprimer les deux-points dans l'adresse MAC",
        labelFr: "Supprimer les deux-points dans l'adresse MAC",
        isCorrect: false,
        explanation: "Les séparateurs deux-points font partie intégrante de la notation MAC standard.",
        explanationFr: "Les deux-points sont obligatoires."
      }
    ],
    correctedSnippet: `host printer {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.1.50;
}`,
    fixExplanation: "Spécifier 'hardware ethernet' suivi de l'adresse MAC.",
    fixExplanationFr: "Spécifier 'hardware ethernet' suivi de l'adresse MAC."
  },
  {
    id: "tb-lpic2-202-78",
    title: "Verrouillage de compte intempestif avec pam_faillock / pam_tally2",
    titleFr: "Verrouillage de compte intempestif avec pam_faillock / pam_tally2",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.2",
    category: "Network Client Management - PAM Authentication",
    scenario: "Un administrateur est bloqué en SSH avec 'Authentication failure' même en saisissant le mot de passe correct, suite à 3 erreurs de frappe préalables.",
    scenarioFr: "Un administrateur est bloqué en SSH avec 'Authentication failure' même en saisissant le mot de passe correct, suite à 3 erreurs de frappe préalables.",
    codeSnippet: `# faillock --user admin
admin:
When                Type  Source                                           Valid
2026-09-10 13:10:01 R     192.168.1.50                                         V
2026-09-10 13:10:05 R     192.168.1.50                                         V
2026-09-10 13:10:09 R     192.168.1.50                                         V`,
    language: "bash",
    bugDescription: "Le module PAM pam_faillock a atteint le seuil maximal de tentatives échouées (deny=3) et a verrouillé le compte pour la durée unlock_time.",
    bugDescriptionFr: "Le module PAM pam_faillock a atteint le seuil maximal de tentatives échouées (deny=3) et a verrouillé le compte pour la durée unlock_time.",
    options: [
      {
        id: "opt-1",
        label: "Réinitialiser le compteur d'échecs d'authentification du compte avec 'faillock --user admin --reset' (ou 'pam_tally2 --user admin --reset')",
        labelFr: "Réinitialiser le compteur d'échecs d'authentification du compte avec 'faillock --user admin --reset' (ou 'pam_tally2 --user admin --reset')",
        isCorrect: true,
        explanation: "faillock ou pam_tally2 maintiennent un fichier de comptage d'échecs. L'argument --reset purge les échecs pour déverrouiller immédiatement le compte.",
        explanationFr: "Réinitialiser le verrouillage avec la commande faillock --user <user> --reset."
      },
      {
        id: "opt-2",
        label: "Changer le mot de passe dans /etc/shadow",
        labelFr: "Changer le mot de passe dans /etc/shadow",
        isCorrect: false,
        explanation: "Tant que le compteur faillock est plein, PAM rejette toute tentative avant même de vérifier /etc/shadow.",
        explanationFr: "Le compteur faillock bloque avant la vérification du hash."
      },
      {
        id: "opt-3",
        label: "Supprimer le binaire sshd",
        labelFr: "Supprimer le binaire sshd",
        isCorrect: false,
        explanation: "Cela interdirait tout accès distant.",
        explanationFr: "Cela interdirait tout accès distant."
      },
      {
        id: "opt-4",
        label: "Supprimer l'utilisateur et recréer son profil",
        labelFr: "Supprimer l'utilisateur et recréer son profil",
        isCorrect: false,
        explanation: "Démesuré et risqué pour les données de l'utilisateur.",
        explanationFr: "Démesuré et risqué."
      }
    ],
    correctedSnippet: `# Débloquer l'utilisateur immédiatement :
faillock --user admin --reset
# (Sur distributions plus anciennes utilisant pam_tally2) :
# pam_tally2 -u admin -r`,
    fixExplanation: "Exécuter 'faillock --user <user> --reset' pour effacer les tentatives erronées.",
    fixExplanationFr: "Exécuter 'faillock --user <user> --reset' pour effacer les tentatives erronées."
  },
  {
    id: "tb-lpic2-202-79",
    title: "Interdiction de connexion avec PAM : Ordre incorrect des drapeaux de contrôle (Control Flags)",
    titleFr: "Interdiction de connexion avec PAM : Ordre incorrect des drapeaux de contrôle (Control Flags)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.2",
    category: "Network Client Management - PAM Architecture",
    scenario: "Après modification de /etc/pam.d/common-auth, plus aucun utilisateur ne peut ouvrir de session sur la machine, même avec des identifiants valides.",
    scenarioFr: "Après modification de /etc/pam.d/common-auth, plus aucun utilisateur ne peut ouvrir de session sur la machine, même avec des identifiants valides.",
    codeSnippet: `# /etc/pam.d/common-auth
auth    requisite       pam_deny.so
auth    sufficient      pam_unix.so nullok_secure`,
    language: "config",
    bugDescription: "La directive 'auth requisite pam_deny.so' est placée en première ligne de la pile d'authentification. 'requisite' échoue immédiatement et interrompt le traitement de la pile, rendant toute connexion impossible.",
    bugDescriptionFr: "La directive 'auth requisite pam_deny.so' est placée en première ligne de la pile d'authentification. 'requisite' échoue immédiatement et interrompt le traitement de la pile, rendant toute connexion impossible.",
    options: [
      {
        id: "opt-1",
        label: "Supprimer ou déplacer 'pam_deny.so' à la fin de la pile d'authentification pour que 'pam_unix.so' puisse s'exécuter en premier",
        labelFr: "Supprimer ou déplacer 'pam_deny.so' à la fin de la pile d'authentification pour que 'pam_unix.so' puisse s'exécuter en premier",
        isCorrect: true,
        explanation: "pam_deny.so renvoie toujours un échec (PAM_AUTH_ERR). Avec le flag requisite, la pile s'arrête instantanément sans jamais exécuter les modules suivants.",
        explanationFr: "Supprimer ou placer pam_deny.so en fin de chaîne de contrôle."
      },
      {
        id: "opt-2",
        label: "Remplacer requisite par required sur pam_deny.so",
        labelFr: "Remplacer requisite par required sur pam_deny.so",
        isCorrect: false,
        explanation: "required échouerait quand même à la fin de la pile.",
        explanationFr: "required échoue quand même à la fin de la pile."
      },
      {
        id: "opt-3",
        label: "Supprimer le répertoire /etc/pam.d/",
        labelFr: "Supprimer le répertoire /etc/pam.d/",
        isCorrect: false,
        explanation: "Cela empêcherait définitivement toute authentification sur le système.",
        explanationFr: "Cela bloquerait tout le système."
      },
      {
        id: "opt-4",
        label: "Passer le système en mode single-user sans PAM",
        labelFr: "Passer le système en mode single-user sans PAM",
        isCorrect: false,
        explanation: "Inapproprié pour une exploitation normale.",
        explanationFr: "Inapproprié en production."
      }
    ],
    correctedSnippet: `# Dans /etc/pam.d/common-auth :
auth    [success=1 default=ignore]      pam_unix.so nullok_secure
auth    requisite                       pam_deny.so
auth    required                        pam_permit.so`,
    fixExplanation: "Évaluer pam_unix.so avant pam_deny.so dans la séquence des modules PAM.",
    fixExplanationFr: "Évaluer pam_unix.so avant pam_deny.so dans la séquence des modules PAM."
  },
  {
    id: "tb-lpic2-202-80",
    title: "Requête ldapsearch rejetée : Certificat TLS non approuvé (TLS: hostname does not match)",
    titleFr: "Requête ldapsearch rejetée : Certificat TLS non approuvé (TLS: hostname does not match)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.3",
    category: "Network Client Management - OpenLDAP Client",
    scenario: "Une commande ldapsearch utilisant StartTLS ou ldaps:// échoue avec une erreur de négociation SSL/TLS.",
    scenarioFr: "Une commande ldapsearch utilisant StartTLS ou ldaps:// échoue avec une erreur de négociation SSL/TLS.",
    codeSnippet: `# ldapsearch -H ldaps://ldap.example.com -b "dc=example,dc=com" -x
ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
additional info: TLS: hostname does not match CN or SAN in peer certificate

# openssl s_client -connect ldap.example.com:636 -showcerts | grep "CN ="
depth=0 CN = directory.internal.net`,
    language: "bash",
    bugDescription: "Le nom d'hôte utilisé dans la commande (-H ldaps://ldap.example.com) ne correspond pas au Common Name (CN) ou Subject Alternative Name (SAN) présent dans le certificat X.509 du serveur LDAP.",
    bugDescriptionFr: "Le nom d'hôte utilisé dans la commande (-H ldaps://ldap.example.com) ne correspond pas au Common Name (CN) ou Subject Alternative Name (SAN) présent dans le certificat X.509 du serveur LDAP.",
    options: [
      {
        id: "opt-1",
        label: "Interroger le serveur avec le nom d'hôte correspondant exactement au certificat (ldaps://directory.internal.net) ou régénérer le certificat avec le bon SAN",
        labelFr: "Interroger le serveur avec le nom d'hôte correspondant exactement au certificat (ldaps://directory.internal.net) ou régénérer le certificat avec le bon SAN",
        isCorrect: true,
        explanation: "Les bibliothèques OpenLDAP vérifient rigoureusement la concordance entre l'URL demandée et l'identité certifiée (CN/SAN).",
        explanationFr: "Utiliser le FQDN correspondant au certificat ou régénérer le certificat avec le bon SAN."
      },
      {
        id: "opt-2",
        label: "Supprimer le port 636 et forcer le port 389 en clair",
        labelFr: "Supprimer le port 636 et forcer le port 389 en clair",
        isCorrect: false,
        explanation: "Transmettre des identifiants LDAP en clair sur le réseau est une régression de sécurité inacceptable.",
        explanationFr: "Transmettre des identifiants en clair est une régression critique."
      },
      {
        id: "opt-3",
        label: "Changer le port LDAP en 80",
        labelFr: "Changer le port LDAP en 80",
        isCorrect: false,
        explanation: "80 est le port HTTP standard.",
        explanationFr: "80 est le port HTTP."
      },
      {
        id: "opt-4",
        label: "Désactiver le protocole TCP",
        labelFr: "Désactiver le protocole TCP",
        isCorrect: false,
        explanation: "LDAP repose obligatoirement sur TCP.",
        explanationFr: "LDAP requiert TCP."
      }
    ],
    correctedSnippet: `# Interroger avec le nom d'hôte certifié :
ldapsearch -H ldaps://directory.internal.net -b "dc=example,dc=com" -x
# Ou ajouter dans /etc/ldap/ldap.conf si temporairement nécessaire en test :
# TLS_REQCERT allow`,
    fixExplanation: "Utiliser le nom d'hôte certifié dans l'URL ou adapter le certificat serveur.",
    fixExplanationFr: "Utiliser le nom d'hôte certifié dans l'URL ou adapter le certificat serveur."
  },
  {
    id: "tb-lpic2-202-81",
    title: "Résolution des utilisateurs LDAP absente : nsswitch.conf non configuré (getent passwd)",
    titleFr: "Résolution des utilisateurs LDAP absente : nsswitch.conf non configuré (getent passwd)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.3",
    category: "Network Client Management - Name Service Switch (NSS)",
    scenario: "Le démon SSSD est connecté à l'annuaire LDAP et valide les accès, mais la commande 'getent passwd' ne liste aucun utilisateur du domaine distant.",
    scenarioFr: "Le démon SSSD est connecté à l'annuaire LDAP et valide les accès, mais la commande 'getent passwd' ne liste aucun utilisateur du domaine distant.",
    codeSnippet: `# getent passwd | grep jdupont
# Aucun résultat

# sssctl user-checks jdupont
(L'utilisateur jdupont existe bien dans SSSD)

# cat /etc/nsswitch.conf | grep passwd
passwd:         files systemd`,
    language: "config",
    bugDescription: "Le fichier /etc/nsswitch.conf ne contient pas le module 'sss' sur la ligne 'passwd'. La bibliothèque C du système n'interroge donc que les fichiers locaux (/etc/passwd).",
    bugDescriptionFr: "Le fichier /etc/nsswitch.conf ne contient pas le module 'sss' sur la ligne 'passwd'. La bibliothèque C du système n'interroge donc que les fichiers locaux (/etc/passwd).",
    options: [
      {
        id: "opt-1",
        label: "Ajouter la source 'sss' dans /etc/nsswitch.conf sur les lignes 'passwd:', 'group:' et 'shadow:' (ex: passwd: files systemd sss)",
        labelFr: "Ajouter la source 'sss' dans /etc/nsswitch.conf sur les lignes 'passwd:', 'group:' et 'shadow:' (ex: passwd: files systemd sss)",
        isCorrect: true,
        explanation: "nsswitch.conf orchestre l'ordre de résolution des identités système. Sans la directive 'sss', libc ignore totalement le démon SSSD.",
        explanationFr: "Ajouter la source 'sss' aux directives d'identité dans /etc/nsswitch.conf."
      },
      {
        id: "opt-2",
        label: "Copier manuellement les utilisateurs LDAP dans /etc/passwd",
        labelFr: "Copier manuellement les utilisateurs LDAP dans /etc/passwd",
        isCorrect: false,
        explanation: "Cela annulerait l'intérêt d'un annuaire d'authentification centralisé.",
        explanationFr: "Annulerait le principe d'annuaire centralisé."
      },
      {
        id: "opt-3",
        label: "Désinstaller SSSD et installer NIS (Network Information Service)",
        labelFr: "Désinstaller SSSD et installer NIS (Network Information Service)",
        isCorrect: false,
        explanation: "NIS est obsolète et non sécurisé.",
        explanationFr: "NIS est obsolète et non sécurisé."
      },
      {
        id: "opt-4",
        label: "Changer les droits de /etc/nsswitch.conf en 0777",
        labelFr: "Changer les droits de /etc/nsswitch.conf en 0777",
        isCorrect: false,
        explanation: "Les droits standard 0644 root:root sont corrects.",
        explanationFr: "Les droits 0644 sont corrects."
      }
    ],
    correctedSnippet: `# /etc/nsswitch.conf
passwd:         files systemd sss
group:          files systemd sss
shadow:         files sss
gshadow:        files systemd`,
    fixExplanation: "Insérer 'sss' dans les directives passwd, group et shadow de /etc/nsswitch.conf.",
    fixExplanationFr: "Insérer 'sss' dans les directives passwd, group et shadow de /etc/nsswitch.conf."
  },
  {
    id: "tb-lpic2-202-82",
    title: "Serveur Postfix en Relais Ouvert (Open Relay) rejeté par les listes RBL",
    titleFr: "Serveur Postfix en Relais Ouvert (Open Relay) rejeté par les listes RBL",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.1",
    category: "E-Mail Services - Postfix SMTP Restrictions",
    scenario: "Le serveur SMTP envoie du spam à l'insu de l'administrateur et son IP a été inscrite sur Spamhaus/Barracuda. Un test de relais ouvert depuis l'extérieur confirme la faille.",
    scenarioFr: "Le serveur SMTP envoie du spam à l'insu de l'administrateur et son IP a été inscrite sur Spamhaus/Barracuda. Un test de relais ouvert depuis l'extérieur confirme la faille.",
    codeSnippet: `# postconf smtpd_recipient_restrictions
smtpd_recipient_restrictions = permit_mynetworks, permit

# telnet mail.example.com 25
HELO spammer.com
MAIL FROM: <spammer@evil.com>
RCPT TO: <victim@external.com>
250 2.1.5 Ok`,
    language: "bash",
    bugDescription: "La directive 'smtpd_recipient_restrictions' se termine par 'permit' au lieu de 'reject_unauth_destination'. Tout utilisateur distant sur Internet peut relayer des courriels vers n'importe quelle boîte externe.",
    bugDescriptionFr: "La directive 'smtpd_recipient_restrictions' se termine par 'permit' au lieu de 'reject_unauth_destination'. Tout utilisateur distant sur Internet peut relayer des courriels vers n'importe quelle boîte externe.",
    options: [
      {
        id: "opt-1",
        label: "Configurer 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination' pour interdire le relais non authentifié",
        labelFr: "Configurer 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination' pour interdire le relais non authentifié",
        isCorrect: true,
        explanation: "'reject_unauth_destination' est la règle fondamentale sous Postfix empêchant le serveur de relayer du courrier non destiné à ses domaines locaux sans authentification préalable.",
        explanationFr: "Ajouter 'reject_unauth_destination' dans smtpd_recipient_restrictions."
      },
      {
        id: "opt-2",
        label: "Supprimer le port 25 et utiliser uniquement le port 110",
        labelFr: "Supprimer le port 25 et utiliser uniquement le port 110",
        isCorrect: false,
        explanation: "Le port 110 est dédié au protocole POP3 de relève, pas au transit SMTP de serveur à serveur.",
        explanationFr: "110 est POP3, pas SMTP."
      },
      {
        id: "opt-3",
        label: "Désactiver le service DNS",
        labelFr: "Désactiver le service DNS",
        isCorrect: false,
        explanation: "Les serveurs mail ont impérativement besoin du DNS pour résoudre les enregistrements MX.",
        explanationFr: "Le DNS est indispensable aux enregistrements MX."
      },
      {
        id: "opt-4",
        label: "Changer myhostname en localhost",
        labelFr: "Changer myhostname en localhost",
        isCorrect: false,
        explanation: "myhostname doit refléter le FQDN public du serveur.",
        explanationFr: "myhostname doit être le FQDN."
      }
    ],
    correctedSnippet: `# Dans /etc/postfix/main.cf :
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination

# Recharger Postfix :
postfix reload`,
    fixExplanation: "Ajouter 'reject_unauth_destination' pour clore le relais ouvert SMTP.",
    fixExplanationFr: "Ajouter 'reject_unauth_destination' pour clore le relais ouvert SMTP."
  },
  {
    id: "tb-lpic2-202-83",
    title: "Mise à jour des alias Postfix non prise en compte (newaliases omis)",
    titleFr: "Mise à jour des alias Postfix non prise en compte (newaliases omis)",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.1",
    category: "E-Mail Services - Postfix Aliases",
    scenario: "L'administrateur a ajouté un alias 'support: contact@example.com' dans /etc/aliases. Les emails envoyés à support@example.com continuent d'être rejetés avec 'User unknown in local recipient table'.",
    scenarioFr: "L'administrateur a ajouté un alias 'support: contact@example.com' dans /etc/aliases. Les emails envoyés à support@example.com continuent d'être rejetés avec 'User unknown in local recipient table'.",
    codeSnippet: `# grep support /etc/aliases
support: contact@example.com

# ls -l /etc/aliases*
-rw-r--r-- 1 root root 1540 Sep 10 13:30 /etc/aliases
-rw-r--r-- 1 root root 12288 Sep 01 10:00 /etc/aliases.db`,
    language: "bash",
    bugDescription: "Le fichier source /etc/aliases est plus récent que la base binaire /etc/aliases.db. Postfix lit exclusivement la base indexée Berkeley DB et ignore les modifications tant que 'newaliases' n'est pas exécuté.",
    bugDescriptionFr: "Le fichier source /etc/aliases est plus récent que la base binaire /etc/aliases.db. Postfix lit exclusivement la base indexée Berkeley DB et ignore les modifications tant que 'newaliases' n'est pas exécuté.",
    options: [
      {
        id: "opt-1",
        label: "Exécuter la commande 'newaliases' (ou 'postalias /etc/aliases') pour compiler le fichier texte en base de données indexée /etc/aliases.db",
        labelFr: "Exécuter la commande 'newaliases' (ou 'postalias /etc/aliases') pour compiler le fichier texte en base de données indexée /etc/aliases.db",
        isCorrect: true,
        explanation: "Postfix n'utilise pas directement le fichier texte /etc/aliases pour des raisons de performance ; il consulte la table binaire générée par newaliases.",
        explanationFr: "Exécuter 'newaliases' pour recompiler la base /etc/aliases.db."
      },
      {
        id: "opt-2",
        label: "Redémarrer le serveur physique",
        labelFr: "Redémarrer le serveur physique",
        isCorrect: false,
        explanation: "Le redémarrage ne recompile pas automatiquement les tables d'alias.",
        explanationFr: "Le redémarrage ne recompile pas les tables d'alias."
      },
      {
        id: "opt-3",
        label: "Supprimer le fichier /etc/aliases.db",
        labelFr: "Supprimer le fichier /etc/aliases.db",
        isCorrect: false,
        explanation: "Sans aliases.db, Postfix ne peut plus distribuer aucun courriel local.",
        explanationFr: "aliases.db est indispensable."
      },
      {
        id: "opt-4",
        label: "Remplacer Postfix par Sendmail",
        labelFr: "Remplacer Postfix par Sendmail",
        isCorrect: false,
        explanation: "Sendmail utilise exactement le même mécanisme de commande newaliases.",
        explanationFr: "Sendmail utilise également newaliases."
      }
    ],
    correctedSnippet: `# Compiler les alias :
newaliases
# Vérifier la nouvelle date de la base :
ls -l /etc/aliases.db`,
    fixExplanation: "Exécuter 'newaliases' pour compiler les modifications dans /etc/aliases.db.",
    fixExplanationFr: "Exécuter 'newaliases' pour compiler les modifications dans /etc/aliases.db."
  },
  {
    id: "tb-lpic2-202-84",
    title: "Incohérence de format de boîte aux lettres Dovecot vs Postfix (Maildir vs Mbox)",
    titleFr: "Incohérence de format de boîte aux lettres Dovecot vs Postfix (Maildir vs Mbox)",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.2",
    category: "E-Mail Services - Dovecot Mailbox Format",
    scenario: "Les courriels entrants sont bien délivrés sur le serveur, mais les clients IMAP Dovecot voient une boîte de réception totalement vide.",
    scenarioFr: "Les courriels entrants sont bien délivrés sur le serveur, mais les clients IMAP Dovecot voient une boîte de réception totalement vide.",
    codeSnippet: `# postconf home_mailbox
home_mailbox = Maildir/

# grep "mail_location" /etc/dovecot/conf.d/10-mail.conf
mail_location = mbox:~/mail:INBOX=/var/mail/%u`,
    language: "config",
    bugDescription: "Postfix est configuré pour déposer les courriels au format 'Maildir/' dans le répertoire de l'utilisateur, tandis que Dovecot est configuré pour chercher dans un fichier 'mbox' sous /var/mail/%u.",
    bugDescriptionFr: "Postfix est configuré pour déposer les courriels au format 'Maildir/' dans le répertoire de l'utilisateur, tandis que Dovecot est configuré pour chercher dans un fichier 'mbox' sous /var/mail/%u.",
    options: [
      {
        id: "opt-1",
        label: "Aligner la directive dans /etc/dovecot/conf.d/10-mail.conf sur 'mail_location = maildir:~/Maildir' et redémarrer Dovecot",
        labelFr: "Aligner la directive dans /etc/dovecot/conf.d/10-mail.conf sur 'mail_location = maildir:~/Maildir' et redémarrer Dovecot",
        isCorrect: true,
        explanation: "Le MDA/MTA (Postfix) et le serveur IMAP/POP (Dovecot) doivent obligatoirement partager le même format de stockage de messages et le même emplacement de dossier.",
        explanationFr: "Définir mail_location = maildir:~/Maildir dans Dovecot."
      },
      {
        id: "opt-2",
        label: "Supprimer le répertoire ~/Maildir de tous les utilisateurs",
        labelFr: "Supprimer le répertoire ~/Maildir de tous les utilisateurs",
        isCorrect: false,
        explanation: "Cela détruirait tous les courriels reçus.",
        explanationFr: "Cela détruirait les courriels."
      },
      {
        id: "opt-3",
        label: "Passer le port IMAP 143 en port POP3 110",
        labelFr: "Passer le port IMAP 143 en port POP3 110",
        isCorrect: false,
        explanation: "Le protocole de relève ne résout pas la discordance de stockage sur le disque.",
        explanationFr: "Le port ne change pas le format de stockage."
      },
      {
        id: "opt-4",
        label: "Désactiver Dovecot",
        labelFr: "Désactiver Dovecot",
        isCorrect: false,
        explanation: "Les utilisateurs n'auraient plus aucun moyen de consulter leurs boîtes mails.",
        explanationFr: "Les utilisateurs ne pourraient plus lire leurs mails."
      }
    ],
    correctedSnippet: `# Dans /etc/dovecot/conf.d/10-mail.conf :
mail_location = maildir:~/Maildir

# Redémarrer le service Dovecot :
systemctl restart dovecot`,
    fixExplanation: "Harmoniser mail_location dans Dovecot pour correspondre au format Maildir de Postfix.",
    fixExplanationFr: "Harmoniser mail_location dans Dovecot pour correspondre au format Maildir de Postfix."
  },
  {
    id: "tb-lpic2-202-85",
    title: "Authentification en clair refusée par Dovecot sur connexion non chiffrée",
    titleFr: "Authentification en clair refusée par Dovecot sur connexion non chiffrée",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.2",
    category: "E-Mail Services - Dovecot SSL Requirements",
    scenario: "Les clients de messagerie échouent lors de l'authentification IMAP sur le port 143 avec le message 'Plaintext authentication disallowed on non-secure (SSL/TLS) connections'.",
    scenarioFr: "Les clients de messagerie échouent lors de l'authentification IMAP sur le port 143 avec le message 'Plaintext authentication disallowed on non-secure (SSL/TLS) connections'.",
    codeSnippet: `# tail -n 2 /var/log/mail.log
dovecot: imap-login: Disconnected (auth failed, 1 attempts in 2 secs): user=<alice>, method=PLAIN, rip=192.168.1.50, lip=192.168.1.10, TLS: no

# grep "disable_plaintext_auth" /etc/dovecot/conf.d/10-auth.conf
# disable_plaintext_auth = yes (valeur par défaut)`,
    language: "bash",
    bugDescription: "Dovecot interdit par défaut toute transmission de mot de passe en clair sans chiffrement TLS actif ('disable_plaintext_auth = yes'). Le client doit utiliser StartTLS sur le port 143 ou IMAPS sur le port 993.",
    bugDescriptionFr: "Dovecot interdit par défaut toute transmission de mot de passe en clair sans chiffrement TLS actif ('disable_plaintext_auth = yes'). Le client doit utiliser StartTLS sur le port 143 ou IMAPS sur le port 993.",
    options: [
      {
        id: "opt-1",
        label: "Configurer les clients pour utiliser le chiffrement SSL/TLS (StartTLS sur port 143 ou IMAPS sur port 993) avec des certificats valides sur Dovecot",
        labelFr: "Configurer les clients pour utiliser le chiffrement SSL/TLS (StartTLS sur port 143 ou IMAPS sur port 993) avec des certificats valides sur Dovecot",
        isCorrect: true,
        explanation: "La sécurité moderne exige le chiffrement TLS avant l'envoi des identifiants pour éviter l'interception de mots de passe sur le réseau.",
        explanationFr: "Activer le chiffrement TLS (IMAPS 993 ou StartTLS 143) sur les clients et Dovecot."
      },
      {
        id: "opt-2",
        label: "Supprimer le mot de passe de l'utilisateur alice",
        labelFr: "Supprimer le mot de passe de l'utilisateur alice",
        isCorrect: false,
        explanation: "Une boîte mail ne doit jamais être ouverte sans mot de passe.",
        explanationFr: "Une boîte mail exige une authentification."
      },
      {
        id: "opt-3",
        label: "Changer le port de Dovecot en 25",
        labelFr: "Changer le port de Dovecot en 25",
        isCorrect: false,
        explanation: "25 est le port SMTP.",
        explanationFr: "25 est le port SMTP."
      },
      {
        id: "opt-4",
        label: "Désactiver le pare-feu du serveur",
        labelFr: "Désactiver le pare-feu du serveur",
        isCorrect: false,
        explanation: "La connexion arrive bien sur le serveur, c'est une règle de politique de sécurité de Dovecot.",
        explanationFr: "La connexion réseau arrive bien à Dovecot."
      }
    ],
    correctedSnippet: `# Dans /etc/dovecot/conf.d/10-ssl.conf :
ssl = required
ssl_cert = </etc/ssl/certs/mail_fullchain.pem
ssl_key = </etc/ssl/private/mail_privkey.pem

# Redémarrer Dovecot :
systemctl restart dovecot`,
    fixExplanation: "Activer le support SSL/TLS dans Dovecot et imposer StartTLS/IMAPS aux clients.",
    fixExplanationFr: "Activer le support SSL/TLS dans Dovecot et imposer StartTLS/IMAPS aux clients."
  },
  {
    id: "tb-lpic2-202-86",
    title: "Connexion SSH par clé publique rejetée (Permissions de ~/.ssh ou authorized_keys trop ouvertes)",
    titleFr: "Connexion SSH par clé publique rejetée (Permissions de ~/.ssh ou authorized_keys trop ouvertes)",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.1",
    category: "System Security - OpenSSH StrictModes",
    scenario: "Un administrateur tente de se connecter par clé SSH publique, mais OpenSSH demande systématiquement le mot de passe Unix.",
    scenarioFr: "Un administrateur tente de se connecter par clé SSH publique, mais OpenSSH demande systématiquement le mot de passe Unix.",
    codeSnippet: `# tail -n 2 /var/log/auth.log
sshd[6120]: Authentication refused: bad ownership or modes for file /home/alice/.ssh/authorized_keys
sshd[6120]: Connection closed by authenticating user alice 192.168.1.50 port 52140 [preauth]

# ls -ld /home/alice/.ssh /home/alice/.ssh/authorized_keys
drwxrwxrwx 2 alice alice 4096 Sep 10 13:40 /home/alice/.ssh
-rw-rw-rw- 1 alice alice  570 Sep 10 13:40 /home/alice/.ssh/authorized_keys`,
    language: "bash",
    bugDescription: "La directive 'StrictModes yes' d'OpenSSH vérifie la sécurité des droits de fichiers. Les permissions 0777 et 0666 autorisent l'écriture par d'autres utilisateurs, ce qui amène SSH à rejeter le fichier par sécurité.",
    bugDescriptionFr: "La directive 'StrictModes yes' d'OpenSSH vérifie la sécurité des droits de fichiers. Les permissions 0777 et 0666 autorisent l'écriture par d'autres utilisateurs, ce qui amène SSH à rejeter le fichier par sécurité.",
    options: [
      {
        id: "opt-1",
        label: "Rétablir les permissions strictes : 'chmod 700 /home/alice/.ssh' et 'chmod 600 /home/alice/.ssh/authorized_keys'",
        labelFr: "Rétablir les permissions strictes : 'chmod 700 /home/alice/.ssh' et 'chmod 600 /home/alice/.ssh/authorized_keys'",
        isCorrect: true,
        explanation: "OpenSSH StrictModes exige impérativement que le répertoire ~/.ssh ne soit pas accessible en écriture par le groupe ou les autres (0700 ou 0755) et authorized_keys en 0600.",
        explanationFr: "Restreindre les droits avec chmod 700 sur .ssh et chmod 600 sur authorized_keys."
      },
      {
        id: "opt-2",
        label: "Désactiver StrictModes dans sshd_config",
        labelFr: "Désactiver StrictModes dans sshd_config",
        isCorrect: false,
        explanation: "Bien que techniquement possible, désactiver StrictModes ouvre une brèche de sécurité majeure en autorisant des permissions permissives.",
        explanationFr: "Désactiver StrictModes fragilise la sécurité du serveur."
      },
      {
        id: "opt-3",
        label: "Changer le propriétaire de authorized_keys en root",
        labelFr: "Changer le propriétaire de authorized_keys en root",
        isCorrect: false,
        explanation: "Le fichier doit impérativement appartenir à l'utilisateur cible alice.",
        explanationFr: "Le fichier doit appartenir à l'utilisateur."
      },
      {
        id: "opt-4",
        label: "Générer une clé DSA de 1024 bits",
        labelFr: "Générer une clé DSA de 1024 bits",
        isCorrect: false,
        explanation: "DSA est déprécié et considéré comme non sécurisé sous OpenSSH moderne.",
        explanationFr: "DSA est déprécié."
      }
    ],
    correctedSnippet: `# Corriger les permissions du dossier et du fichier :
chmod 700 /home/alice/.ssh
chmod 600 /home/alice/.ssh/authorized_keys
chown -R alice:alice /home/alice/.ssh`,
    fixExplanation: "Fixer les permissions à 700 sur ~/.ssh et 600 sur authorized_keys.",
    fixExplanationFr: "Fixer les permissions à 700 sur ~/.ssh et 600 sur authorized_keys."
  },
  {
    id: "tb-lpic2-202-87",
    title: "Bannissement Fail2ban inopérant : Format de journal systemd non surveillé",
    titleFr: "Bannissement Fail2ban inopérant : Format de journal systemd non surveillé",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.1",
    category: "System Security - Fail2ban Intrusion Prevention",
    scenario: "Sur une distribution Linux moderne sans rsyslog, Fail2ban ne bannit aucune adresse IP attaquant le service SSH en force brute.",
    scenarioFr: "Sur une distribution Linux moderne sans rsyslog, Fail2ban ne bannit aucune adresse IP attaquant le service SSH en force brute.",
    codeSnippet: `# fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  \`- File list:        /var/log/auth.log
\`- Actions
   \`- Currently banned: 0

# ls -l /var/log/auth.log
ls: cannot access '/var/log/auth.log': No such file or directory`,
    language: "bash",
    bugDescription: "Sur les systèmes utilisant exclusivement systemd-journald sans daemon syslog traditionnel, le fichier /var/log/auth.log n'existe pas. Fail2ban surveille un fichier vide ou inexistant.",
    bugDescriptionFr: "Sur les systèmes utilisant exclusivement systemd-journald sans daemon syslog traditionnel, le fichier /var/log/auth.log n'existe pas. Fail2ban surveille un fichier vide ou inexistant.",
    options: [
      {
        id: "opt-1",
        label: "Configurer le backend de surveillance sur 'backend = systemd' dans /etc/fail2ban/jail.local",
        labelFr: "Configurer le backend de surveillance sur 'backend = systemd' dans /etc/fail2ban/jail.local",
        isCorrect: true,
        explanation: "Lorsque backend = systemd est activé, Fail2ban interroge directement l'API de journald au lieu d'attendre l'écriture dans des fichiers plats.",
        explanationFr: "Définir 'backend = systemd' dans jail.local pour surveiller le journal systemd."
      },
      {
        id: "opt-2",
        label: "Désactiver le pare-feu du serveur",
        labelFr: "Désactiver le pare-feu du serveur",
        isCorrect: false,
        explanation: "Fail2ban s'appuie justement sur le pare-feu pour bannir.",
        explanationFr: "Fail2ban a besoin du pare-feu."
      },
      {
        id: "opt-3",
        label: "Diminuer maxretry à 0",
        labelFr: "Diminuer maxretry à 0",
        isCorrect: false,
        explanation: "0 n'est pas une valeur de seuil valide.",
        explanationFr: "0 n'est pas une valeur valide."
      },
      {
        id: "opt-4",
        label: "Changer le port SSH en 2222",
        labelFr: "Changer le port SSH en 2222",
        isCorrect: false,
        explanation: "Changer le port ne résout pas l'absence du fichier journal surveillé.",
        explanationFr: "Changer le port ne résout pas la surveillance des logs."
      }
    ],
    correctedSnippet: `# Dans /etc/fail2ban/jail.local :
[DEFAULT]
backend = systemd

[sshd]
enabled = true
port = ssh`,
    fixExplanation: "Définir 'backend = systemd' dans la configuration Fail2ban.",
    fixExplanationFr: "Définir 'backend = systemd' dans la configuration Fail2ban."
  },
  {
    id: "tb-lpic2-202-88",
    title: "Connexions établies coupées par iptables : Règle conntrack ESTABLISHED manquante",
    titleFr: "Connexions établies coupées par iptables : Règle conntrack ESTABLISHED manquante",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.2",
    category: "System Security - Netfilter / iptables Stateful Firewall",
    scenario: "Après avoir appliqué une politique restrictive 'iptables -P INPUT DROP', le serveur ne peut plus effectuer de requêtes sortantes (ex: 'apt update' ou 'curl' ne reçoivent aucune réponse).",
    scenarioFr: "Après avoir appliqué une politique restrictive 'iptables -P INPUT DROP', le serveur ne peut plus effectuer de requêtes sortantes (ex: 'apt update' ou 'curl' ne reçoivent aucune réponse).",
    codeSnippet: `# iptables -S
-P INPUT DROP
-P FORWARD DROP
-P OUTPUT ACCEPT
-A INPUT -p tcp -m tcp --dport 22 -j ACCEPT

# curl https://example.com
(Bloqué indéfiniment en attente de réponse)`,
    language: "bash",
    bugDescription: "La chaîne OUTPUT autorise l'émission de la requête, mais la chaîne INPUT jette tous les paquets retour car il manque la règle conntrack autorisant les états ESTABLISHED et RELATED.",
    bugDescriptionFr: "La chaîne OUTPUT autorise l'émission de la requête, mais la chaîne INPUT jette tous les paquets retour car il manque la règle conntrack autorisant les états ESTABLISHED et RELATED.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter la règle d'état en tête de chaîne INPUT : 'iptables -I INPUT 1 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT'",
        labelFr: "Ajouter la règle d'état en tête de chaîne INPUT : 'iptables -I INPUT 1 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT'",
        isCorrect: true,
        explanation: "Un pare-feu à états (stateful) doit impérativement accepter les paquets de réponse associés aux connexions légitimement initiées par le serveur.",
        explanationFr: "Ajouter la règle conntrack ESTABLISHED,RELATED en chaîne INPUT."
      },
      {
        id: "opt-2",
        label: "Passer la politique OUTPUT en DROP",
        labelFr: "Passer la politique OUTPUT en DROP",
        isCorrect: false,
        explanation: "Cela bloquerait également les paquets sortants.",
        explanationFr: "Bloquerait aussi les paquets sortants."
      },
      {
        id: "opt-3",
        label: "Supprimer le module conntrack du noyau",
        labelFr: "Supprimer le module conntrack du noyau",
        isCorrect: false,
        explanation: "Le suivi de connexion est indispensable au filtrage d'état.",
        explanationFr: "Le suivi de connexion est indispensable."
      },
      {
        id: "opt-4",
        label: "Remplacer TCP par UDP pour toutes les connexions",
        labelFr: "Remplacer TCP par UDP pour toutes les connexions",
        isCorrect: false,
        explanation: "Le protocole de niveau 4 dépend de l'application cliente.",
        explanationFr: "Dépend de l'application."
      }
    ],
    correctedSnippet: `# Autoriser le loopback :
iptables -A INPUT -i lo -j ACCEPT
# Autoriser les réponses du trafic déjà établi :
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
# Autoriser SSH :
iptables -A INPUT -p tcp --dport 22 -j ACCEPT`,
    fixExplanation: "Insérer la règle 'conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT' dans la chaîne INPUT.",
    fixExplanationFr: "Insérer la règle 'conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT' dans la chaîne INPUT."
  },
  {
    id: "tb-lpic2-202-89",
    title: "Tunnel OpenVPN non fonctionnel : Interface tun manquante dans le conteneur/VM",
    titleFr: "Tunnel OpenVPN non fonctionnel : Interface tun manquante dans le conteneur/VM",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.3",
    category: "System Security - OpenVPN Tunneling",
    scenario: "Le serveur OpenVPN échoue au démarrage avec l'erreur 'Cannot open TUN/TAP dev /dev/net/tun'.",
    scenarioFr: "Le serveur OpenVPN échoue au démarrage avec l'erreur 'Cannot open TUN/TAP dev /dev/net/tun'.",
    codeSnippet: `# systemctl status openvpn@server
openvpn[8210]: ERROR: Cannot open TUN/TAP dev /dev/net/tun: No such file or directory (errno=2)
openvpn[8210]: Exiting due to fatal error

# ls -l /dev/net/tun
ls: cannot access '/dev/net/tun': No such file or directory`,
    language: "bash",
    bugDescription: "Le pilote de périphérique virtuel TUN/TAP (/dev/net/tun) n'est pas chargé ou le nœud spécial de périphérique n'existe pas dans le système de fichiers /dev.",
    bugDescriptionFr: "Le pilote de périphérique virtuel TUN/TAP (/dev/net/tun) n'est pas chargé ou le nœud spécial de périphérique n'existe pas dans le système de fichiers /dev.",
    options: [
      {
        id: "opt-1",
        label: "Charger le module 'tun' avec modprobe et créer le périphérique 'mknod /dev/net/tun c 10 200' si absent (ou autoriser le device tun dans le conteneur)",
        labelFr: "Charger le module 'tun' avec modprobe et créer le périphérique 'mknod /dev/net/tun c 10 200' si absent (ou autoriser le device tun dans le conteneur)",
        isCorrect: true,
        explanation: "OpenVPN en mode routé dépend du périphérique caractère /dev/net/tun (majeur 10, mineur 200) pour encapsuler les paquets IP.",
        explanationFr: "Charger le module tun et créer le nœud spécial /dev/net/tun."
      },
      {
        id: "opt-2",
        label: "Remplacer 'dev tun' par 'dev eth0' dans server.conf",
        labelFr: "Remplacer 'dev tun' par 'dev eth0' dans server.conf",
        isCorrect: false,
        explanation: "OpenVPN ne peut pas s'approprier directement l'interface physique ethernet comme interface virtuelle.",
        explanationFr: "OpenVPN ne peut pas s'approprier l'interface physique."
      },
      {
        id: "opt-3",
        label: "Supprimer les clés de chiffrement Diffie-Hellman",
        labelFr: "Supprimer les clés de chiffrement Diffie-Hellman",
        isCorrect: false,
        explanation: "Les paramètres DH sont indispensables à l'échange de clés.",
        explanationFr: "Les paramètres DH sont indispensables."
      },
      {
        id: "opt-4",
        label: "Passer le protocole en TCP port 80",
        labelFr: "Passer le protocole en TCP port 80",
        isCorrect: false,
        explanation: "Le problème est l'absence de l'interface tunnel locale, pas le port d'écoute.",
        explanationFr: "Le problème est le device tun local."
      }
    ],
    correctedSnippet: `# Charger le module noyau :
modprobe tun
# Créer le device node si manquant :
mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun
# Démarrer OpenVPN :
systemctl start openvpn@server`,
    fixExplanation: "Charger le module noyau tun et s'assurer de la présence du device node /dev/net/tun.",
    fixExplanationFr: "Charger le module noyau tun et s'assurer de la présence du device node /dev/net/tun."
  },
  {
    id: "tb-lpic2-202-90",
    title: "Certificat client OpenVPN révoqué non vérifié : Directive 'crl-verify' omise",
    titleFr: "Certificat client OpenVPN révoqué non vérifié : Directive 'crl-verify' omise",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.3",
    category: "System Security - OpenVPN Certificate Revocation (CRL)",
    scenario: "Un collaborateur a quitté l'entreprise et son certificat X.509 a été révoqué avec Easy-RSA. Pourtant, il parvient toujours à se connecter au VPN.",
    scenarioFr: "Un collaborateur a quitté l'entreprise et son certificat X.509 a été révoqué avec Easy-RSA. Pourtant, il parvient toujours à se connecter au VPN.",
    codeSnippet: `# ./easyrsa revoke bad_employee
Revoking Certificate for bad_employee.
...
# ./easyrsa gen-crl
An updated CRL was created at: .../crl.pem

# grep crl /etc/openvpn/server.conf
# Aucune directive crl-verify définie`,
    language: "bash",
    bugDescription: "La liste de révocation (CRL) a bien été générée mais la directive 'crl-verify /etc/openvpn/crl.pem' n'est pas déclarée dans server.conf. OpenVPN ne vérifie donc pas si les certificats valides cryptographiquement ont été révoqués.",
    bugDescriptionFr: "La liste de révocation (CRL) a bien été générée mais la directive 'crl-verify /etc/openvpn/crl.pem' n'est pas déclarée dans server.conf. OpenVPN ne vérifie donc pas si les certificats valides cryptographiquement ont été révoqués.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter la directive 'crl-verify /etc/openvpn/crl.pem' dans la configuration du serveur OpenVPN et s'assurer que le fichier est lisible",
        labelFr: "Ajouter la directive 'crl-verify /etc/openvpn/crl.pem' dans la configuration du serveur OpenVPN et s'assurer que le fichier est lisible",
        isCorrect: true,
        explanation: "Sans crl-verify, OpenVPN valide n'importe quel certificat émis par la CA tant que sa date d'expiration n'est pas atteinte.",
        explanationFr: "Déclarer la directive 'crl-verify' dans server.conf."
      },
      {
        id: "opt-2",
        label: "Régénérer entièrement l'autorité de certification CA et tous les certificats clients",
        labelFr: "Régénérer entièrement l'autorité de certification CA et tous les certificats clients",
        isCorrect: false,
        explanation: "La révocation CRL existe précisément pour éviter de devoir recréer l'ensemble de la PKI.",
        explanationFr: "La CRL évite de devoir tout régénérer."
      },
      {
        id: "opt-3",
        label: "Supprimer le fichier client.ovpn sur le serveur",
        labelFr: "Supprimer le fichier client.ovpn sur le serveur",
        isCorrect: false,
        explanation: "Le client distant détient déjà sa copie de fichier sur son poste.",
        explanationFr: "Le client détient déjà sa clé privée."
      },
      {
        id: "opt-4",
        label: "Changer le port du serveur OpenVPN",
        labelFr: "Changer le port du serveur OpenVPN",
        isCorrect: false,
        explanation: "Changer le port bloque tous les utilisateurs légitimes sans résoudre la validation cryptographique.",
        explanationFr: "Changer le port bloque tout le monde."
      }
    ],
    correctedSnippet: `# Dans /etc/openvpn/server.conf :
crl-verify /etc/openvpn/crl.pem

# Redémarrer OpenVPN :
systemctl restart openvpn@server`,
    fixExplanation: "Activer la vérification de la liste de révocation avec 'crl-verify crl.pem'.",
    fixExplanationFr: "Activer la vérification de la liste de révocation avec 'crl-verify crl.pem'."
  },
  {
    id: "tb-lpic2-202-91",
    title: "Épuisement de la plage de baux DHCP (dhcpd: no free leases)",
    titleFr: "Épuisement de la plage de baux DHCP (dhcpd: no free leases)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.1",
    category: "Network Client Management - DHCP Pool Exhaustion",
    scenario: "Les nouveaux postes de l'entreprise ne reçoivent plus d'adresse IP et tombent en auto-configuration APIPA 169.254.x.x.",
    scenarioFr: "Les nouveaux postes de l'entreprise ne reçoivent plus d'adresse IP et tombent en auto-configuration APIPA 169.254.x.x.",
    codeSnippet: `# tail -n 2 /var/log/syslog
dhcpd: DHCPDISCOVER from 52:54:00:88:99:aa via eth0: network 192.168.1.0/24: no free leases
dhcpd: DHCPDISCOVER from 52:54:00:88:99:aa via eth0: network 192.168.1.0/24: no free leases

# grep -E "range|lease-time" /etc/dhcp/dhcpd.conf
    range 192.168.1.100 192.168.1.120;
    max-lease-time 604800;`,
    language: "bash",
    bugDescription: "La plage range ne contient que 20 adresses IP et le temps de bail (max-lease-time) est réglé sur 7 jours (604800 secondes). Toutes les adresses sont accaparées par d'anciens équipements.",
    bugDescriptionFr: "La plage range ne contient que 20 adresses IP et le temps de bail (max-lease-time) est réglé sur 7 jours (604800 secondes). Toutes les adresses sont accaparées par d'anciens équipements.",
    options: [
      {
        id: "opt-1",
        label: "Élargir la plage d'adresses (range 192.168.1.50 192.168.1.240) et réduire le temps de bail (default/max-lease-time à quelques heures)",
        labelFr: "Élargir la plage d'adresses (range 192.168.1.50 192.168.1.240) et réduire le temps de bail (default/max-lease-time à quelques heures)",
        isCorrect: true,
        explanation: "Pour éviter la saturation de baux en présence de nombreux terminaux nomades, il faut élargir le pool et réduire la durée de rétention des baux inactifs.",
        explanationFr: "Élargir la directive range et abaisser la durée de bail dans dhcpd.conf."
      },
      {
        id: "opt-2",
        label: "Redémarrer le commutateur réseau",
        labelFr: "Redémarrer le commutateur réseau",
        isCorrect: false,
        explanation: "Le commutateur n'intervient pas dans la gestion logique des baux du serveur DHCP.",
        explanationFr: "Le commutateur ne gère pas les baux DHCP."
      },
      {
        id: "opt-3",
        label: "Supprimer le fichier dhcpd.conf",
        labelFr: "Supprimer le fichier dhcpd.conf",
        isCorrect: false,
        explanation: "Le serveur refuserait totalement de démarrer sans configuration.",
        explanationFr: "Le serveur refuserait de démarrer."
      },
      {
        id: "opt-4",
        label: "Passer les adresses en IPv6 uniquement sans rétrocompatibilité",
        labelFr: "Passer les adresses en IPv6 uniquement sans rétrocompatibilité",
        isCorrect: false,
        explanation: "Cela romprait la connectivité avec tous les services IPv4.",
        explanationFr: "Rompt la connectivité IPv4."
      }
    ],
    correctedSnippet: `# Dans /etc/dhcp/dhcpd.conf :
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.50 192.168.1.240;
    default-lease-time 7200;
    max-lease-time 14400;
    ...
}`,
    fixExplanation: "Agrandir le pool range et diminuer lease-time dans dhcpd.conf.",
    fixExplanationFr: "Agrandir le pool range et diminuer lease-time dans dhcpd.conf."
  },
  {
    id: "tb-lpic2-202-92",
    title: "Limite d'ouverture de fichiers non appliquée via PAM (pam_limits.so absent)",
    titleFr: "Limite d'ouverture de fichiers non appliquée via PAM (pam_limits.so absent)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.2",
    category: "Network Client Management - PAM Resource Limits",
    scenario: "L'administrateur a configuré 'nofile 65535' dans /etc/security/limits.conf pour l'utilisateur database. Pourtant, lors de sa connexion SSH, 'ulimit -n' affiche toujours 1024.",
    scenarioFr: "L'administrateur a configuré 'nofile 65535' dans /etc/security/limits.conf pour l'utilisateur database. Pourtant, lors de sa connexion SSH, 'ulimit -n' affiche toujours 1024.",
    codeSnippet: `# cat /etc/security/limits.d/db.conf
database  soft  nofile  65535
database  hard  nofile  65535

# grep pam_limits /etc/pam.d/sshd
# session required pam_limits.so (commenté)`,
    language: "config",
    bugDescription: "Le module 'pam_limits.so' est commenté ou omis dans la pile PAM (/etc/pam.d/sshd ou /etc/pam.d/common-session). Sans lui, le fichier limits.conf est complètement ignoré à l'ouverture de session.",
    bugDescriptionFr: "Le module 'pam_limits.so' est commenté ou omis dans la pile PAM (/etc/pam.d/sshd ou /etc/pam.d/common-session). Sans lui, le fichier limits.conf est complètement ignoré à l'ouverture de session.",
    options: [
      {
        id: "opt-1",
        label: "Décommenter ou ajouter la directive 'session required pam_limits.so' dans /etc/pam.d/sshd ou /etc/pam.d/common-session",
        labelFr: "Décommenter ou ajouter la directive 'session required pam_limits.so' dans /etc/pam.d/sshd ou /etc/pam.d/common-session",
        isCorrect: true,
        explanation: "C'est le module pam_limits.so qui lit les fichiers /etc/security/limits.conf et applique les limites de ressources (ulimit) lors de la phase de session PAM.",
        explanationFr: "Activer pam_limits.so dans la configuration PAM de session."
      },
      {
        id: "opt-2",
        label: "Changer le mot de passe de l'utilisateur database",
        labelFr: "Changer le mot de passe de l'utilisateur database",
        isCorrect: false,
        explanation: "Le mot de passe relève de la phase auth, pas de l'allocation de ressources de session.",
        explanationFr: "Le mot de passe ne gère pas les limites ulimit."
      },
      {
        id: "opt-3",
        label: "Supprimer le fichier /etc/security/limits.conf",
        labelFr: "Supprimer le fichier /etc/security/limits.conf",
        isCorrect: false,
        explanation: "Cela supprimerait toutes les définitions de limites.",
        explanationFr: "Supprimerait toutes les limites."
      },
      {
        id: "opt-4",
        label: "Modifier le fuseau horaire du serveur",
        labelFr: "Modifier le fuseau horaire du serveur",
        isCorrect: false,
        explanation: "Le fuseau horaire n'a aucun lien avec les descripteurs de fichiers.",
        explanationFr: "Le fuseau horaire n'a aucun lien."
      }
    ],
    correctedSnippet: `# Dans /etc/pam.d/sshd ou /etc/pam.d/common-session :
session required pam_limits.so`,
    fixExplanation: "Ajouter 'session required pam_limits.so' dans /etc/pam.d/sshd.",
    fixExplanationFr: "Ajouter 'session required pam_limits.so' dans /etc/pam.d/sshd."
  },
  {
    id: "tb-lpic2-202-93",
    title: "Email en boucle de rejet Postfix : 'mail loops back to myself'",
    titleFr: "Email en boucle de rejet Postfix : 'mail loops back to myself'",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.1",
    category: "E-Mail Services - Postfix Domain Configuration",
    scenario: "Lors de l'envoi d'un courriel vers un compte local 'bob@example.com', le mail est rejeté avec l'erreur '554 5.3.5 mail for example.com loops back to myself'.",
    scenarioFr: "Lors de l'envoi d'un courriel vers un compte local 'bob@example.com', le mail est rejeté avec l'erreur '554 5.3.5 mail for example.com loops back to myself'.",
    codeSnippet: `# tail -n 2 /var/log/mail.log
postfix/smtp[7120]: 4Sdf981Z: to=<bob@example.com>, relay=mail.example.com[192.168.1.10]:25, status=bounced (mail for example.com loops back to myself)

# postconf mydestination
mydestination = $myhostname, localhost.$mydomain, localhost`,
    language: "bash",
    bugDescription: "Le domaine 'example.com' n'est pas répertorié dans le paramètre 'mydestination' (ou virtual_mailbox_domains). Postfix effectue alors une recherche DNS MX, se résout lui-même, et refuse de se boucler la livraison.",
    bugDescriptionFr: "Le domaine 'example.com' n'est pas répertorié dans le paramètre 'mydestination' (ou virtual_mailbox_domains). Postfix effectue alors une recherche DNS MX, se résout lui-même, et refuse de se boucler la livraison.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter le domaine concerné dans le paramètre 'mydestination' de /etc/postfix/main.cf (ex: mydestination = $myhostname, localhost.$mydomain, localhost, example.com)",
        labelFr: "Ajouter le domaine concerné dans le paramètre 'mydestination' de /etc/postfix/main.cf (ex: mydestination = $myhostname, localhost.$mydomain, localhost, example.com)",
        isCorrect: true,
        explanation: "mydestination liste les domaines pour lesquels Postfix accepte la livraison locale finale sans tenter de relayer vers l'extérieur.",
        explanationFr: "Ajouter le domaine dans mydestination dans main.cf."
      },
      {
        id: "opt-2",
        label: "Désactiver le service Postfix",
        labelFr: "Désactiver le service Postfix",
        isCorrect: false,
        explanation: "Le serveur ne délivrerait plus aucun courrier.",
        explanationFr: "Le serveur ne délivrerait plus de courrier."
      },
      {
        id: "opt-3",
        label: "Supprimer le champ MX dans le DNS",
        labelFr: "Supprimer le champ MX dans le DNS",
        isCorrect: false,
        explanation: "Les correspondants externes ne pourraient plus acheminer les emails vers le domaine.",
        explanationFr: "Les correspondants externes ne pourraient plus écrire."
      },
      {
        id: "opt-4",
        label: "Changer le port SMTP de 25 à 465",
        labelFr: "Changer le port SMTP de 25 à 465",
        isCorrect: false,
        explanation: "Le routage interne est indépendant du port de soumission.",
        explanationFr: "Le routage est indépendant du port."
      }
    ],
    correctedSnippet: `# Dans /etc/postfix/main.cf :
mydestination = $myhostname, localhost.$mydomain, localhost, example.com

# Recharger Postfix :
postfix reload`,
    fixExplanation: "Ajouter le domaine dans la liste 'mydestination' de /etc/postfix/main.cf.",
    fixExplanationFr: "Ajouter le domaine dans la liste 'mydestination' de /etc/postfix/main.cf."
  },
  {
    id: "tb-lpic2-202-94",
    title: "Erreur de syntaxe nftables : Conflit de famille de tables (inet vs ip/ip6)",
    titleFr: "Erreur de syntaxe nftables : Conflit de famille de tables (inet vs ip/ip6)",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.2",
    category: "System Security - Nftables Firewall",
    scenario: "L'administrateur migre son pare-feu vers nftables. Le chargement des règles avec 'nft -f /etc/nftables.conf' échoue avec une erreur de syntaxe.",
    scenarioFr: "L'administrateur migre son pare-feu vers nftables. Le chargement des règles avec 'nft -f /etc/nftables.conf' échoue avec une erreur de syntaxe.",
    codeSnippet: `# nft -f /etc/nftables.conf
/etc/nftables.conf:4:1-17: Error: Could not process rule: No such file or directory
add rule ip filter input ip6 saddr ::1 accept
^^^^^^^^^^^^^^^^^`,
    language: "nftables",
    bugDescription: "Une règle IPv6 ('ip6 saddr ::1') est insérée dans une table de famille 'ip' (IPv4 pure). Pour gérer conjointement IPv4 et IPv6 dans la même table, il faut déclarer une table de famille 'inet'.",
    bugDescriptionFr: "Une règle IPv6 ('ip6 saddr ::1') est insérée dans une table de famille 'ip' (IPv4 pure). Pour gérer conjointement IPv4 et IPv6 dans la même table, il faut déclarer une table de famille 'inet'.",
    options: [
      {
        id: "opt-1",
        label: "Remplacer la déclaration de table 'table ip filter' par 'table inet filter' pour supporter simultanément IPv4 et IPv6",
        labelFr: "Remplacer la déclaration de table 'table ip filter' par 'table inet filter' pour supporter simultanément IPv4 et IPv6",
        isCorrect: true,
        explanation: "Dans nftables, la famille 'inet' est unifiée et autorise à la fois les sélecteurs IPv4 et IPv6 dans les chaînes.",
        explanationFr: "Utiliser la famille 'inet' pour filtrer à la fois IPv4 et IPv6."
      },
      {
        id: "opt-2",
        label: "Désactiver IPv6 globalement dans le BIOS",
        labelFr: "Désactiver IPv6 globalement dans le BIOS",
        isCorrect: false,
        explanation: "Le BIOS ne gère pas le filtrage nftables du noyau Linux.",
        explanationFr: "Le BIOS ne configure pas nftables."
      },
      {
        id: "opt-3",
        label: "Remplacer nftables par ipchains",
        labelFr: "Remplacer nftables par ipchains",
        isCorrect: false,
        explanation: "ipchains est le pare-feu préhistorique du noyau Linux 2.2.",
        explanationFr: "ipchains est un ancêtre obsolète."
      },
      {
        id: "opt-4",
        label: "Remplacer accept par drop",
        labelFr: "Remplacer accept par drop",
        isCorrect: false,
        explanation: "Le verdict d'action ne résout pas la discordance de famille d'adresses.",
        explanationFr: "Le verdict ne change pas la famille."
      }
    ],
    correctedSnippet: `# /etc/nftables.conf
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        iif lo accept
        ct state established,related accept
        ip6 saddr ::1 accept
        tcp dport 22 accept
    }
}`,
    fixExplanation: "Employer la famille 'inet' dans la définition de la table nftables.",
    fixExplanationFr: "Employer la famille 'inet' dans la définition de la table nftables."
  },
  {
    id: "tb-lpic2-202-95",
    title: "Courriels légitimes bloqués par SpamAssassin : Faux positif lié aux règles locales",
    titleFr: "Courriels légitimes bloqués par SpamAssassin : Faux positif lié aux règles locales",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.2",
    category: "E-Mail Services - SpamAssassin Filtering",
    scenario: "Les factures légitimes d'un fournisseur stratégique (fournisseur@partenaire.com) sont systématiquement étiquetées ***SPAM*** et envoyées en quarantaine.",
    scenarioFr: "Les factures légitimes d'un fournisseur stratégique (fournisseur@partenaire.com) sont systématiquement étiquetées ***SPAM*** et envoyées en quarantaine.",
    codeSnippet: `# Extrait de l'en-tête du mail reçu :
X-Spam-Flag: YES
X-Spam-Score: 6.8
X-Spam-Status: Yes, score=6.8 required=5.0 tests=HTML_MESSAGE,URIBL_BLOCKED,LOCAL_INVOICE_RULE

# cat /etc/spamassassin/local.cf
required_score 5.0`,
    language: "config",
    bugDescription: "L'expéditeur partenaire est filtré par des règles automatiques car il ne figure pas dans la liste blanche (whitelist) de SpamAssassin.",
    bugDescriptionFr: "L'expéditeur partenaire est filtré par des règles automatiques car il ne figure pas dans la liste blanche (whitelist) de SpamAssassin.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter la directive 'whitelist_from *@partenaire.com' dans /etc/spamassassin/local.cf et recharger le démon spamassassin",
        labelFr: "Ajouter la directive 'whitelist_from *@partenaire.com' dans /etc/spamassassin/local.cf et recharger le démon spamassassin",
        isCorrect: true,
        explanation: "La directive whitelist_from soustrait 100 points au score de spam, garantissant que les expéditeurs légitimes ne soient jamais classés en spam.",
        explanationFr: "Ajouter l'expéditeur en liste blanche avec 'whitelist_from' dans local.cf."
      },
      {
        id: "opt-2",
        label: "Augmenter required_score à 1000",
        labelFr: "Augmenter required_score à 1000",
        isCorrect: false,
        explanation: "Cela désactiverait pratiquement toute détection de spam pour tous les utilisateurs.",
        explanationFr: "Désactiverait la détection de spam."
      },
      {
        id: "opt-3",
        label: "Supprimer SpamAssassin du serveur",
        labelFr: "Supprimer SpamAssassin du serveur",
        isCorrect: false,
        explanation: "Le serveur serait submergé par le pourriel mondial.",
        explanationFr: "Le serveur serait submergé de pourriels."
      },
      {
        id: "opt-4",
        label: "Bloquer l'adresse IP du partenaire avec iptables",
        labelFr: "Bloquer l'adresse IP du partenaire avec iptables",
        isCorrect: false,
        explanation: "Absurde, cela empêcherait définitivement la réception des factures.",
        explanationFr: "Empêcherait la réception des factures."
      }
    ],
    correctedSnippet: `# Dans /etc/spamassassin/local.cf :
whitelist_from *@partenaire.com
whitelist_from fournisseur@partenaire.com

# Recharger SpamAssassin :
systemctl restart spamassassin`,
    fixExplanation: "Ajouter l'expéditeur dans 'whitelist_from' dans /etc/spamassassin/local.cf.",
    fixExplanationFr: "Ajouter l'expéditeur dans 'whitelist_from' dans /etc/spamassassin/local.cf."
  },
  {
    id: "tb-lpic2-202-96",
    title: "Attaque par force brute non freinée sur OpenSSH (MaxAuthTries trop élevé)",
    titleFr: "Attaque par force brute non freinée sur OpenSSH (MaxAuthTries trop élevé)",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.1",
    category: "System Security - OpenSSH Hardening",
    scenario: "Un audit de sécurité Lynis alerte l'administrateur : le démon OpenSSH tolère un nombre excessif de tentatives de mot de passe au cours d'une même session TCP.",
    scenarioFr: "Un audit de sécurité Lynis alerte l'administrateur : le démon OpenSSH tolère un nombre excessif de tentatives de mot de passe au cours d'une même session TCP.",
    codeSnippet: `# sshd -T | grep -E "maxauthtries|permitrootlogin"
maxauthtries 20
permitrootlogin yes`,
    language: "bash",
    bugDescription: "MaxAuthTries est fixé à 20 et PermitRootLogin est activé sur 'yes'. Les attaquants peuvent tester 20 mots de passe par connexion TCP et cibler le compte super-administrateur root.",
    bugDescriptionFr: "MaxAuthTries est fixé à 20 et PermitRootLogin est activé sur 'yes'. Les attaquants peuvent tester 20 mots de passe par connexion TCP et cibler le compte super-administrateur root.",
    options: [
      {
        id: "opt-1",
        label: "Durcir sshd_config en définissant 'MaxAuthTries 3' et 'PermitRootLogin no' (ou 'prohibit-password')",
        labelFr: "Durcir sshd_config en définissant 'MaxAuthTries 3' et 'PermitRootLogin no' (ou 'prohibit-password')",
        isCorrect: true,
        explanation: "La réduction de MaxAuthTries et le blocage de la connexion directe root font partie des recommandations de base de l'examen LPIC-2 Security.",
        explanationFr: "Restreindre MaxAuthTries à 3 et interdire PermitRootLogin."
      },
      {
        id: "opt-2",
        label: "Passer MaxAuthTries à 100",
        labelFr: "Passer MaxAuthTries à 100",
        isCorrect: false,
        explanation: "Cela faciliterait encore plus les attaques par force brute.",
        explanationFr: "Faciliterait les attaques."
      },
      {
        id: "opt-3",
        label: "Remplacer OpenSSH par Telnet",
        labelFr: "Remplacer OpenSSH par Telnet",
        isCorrect: false,
        explanation: "Telnet n'offre aucun chiffrement.",
        explanationFr: "Telnet ne chiffre rien."
      },
      {
        id: "opt-4",
        label: "Supprimer les clés d'hôte /etc/ssh/ssh_host_*",
        labelFr: "Supprimer les clés d'hôte /etc/ssh/ssh_host_*",
        isCorrect: false,
        explanation: "sshd refuserait de démarrer sans clés d'hôte.",
        explanationFr: "sshd refuserait de démarrer."
      }
    ],
    correctedSnippet: `# Dans /etc/ssh/sshd_config :
PermitRootLogin no
MaxAuthTries 3
PasswordAuthentication no
PubkeyAuthentication yes

# Recharger sshd :
systemctl reload sshd`,
    fixExplanation: "Abaisser MaxAuthTries à 3 et désactiver le login root direct dans sshd_config.",
    fixExplanationFr: "Abaisser MaxAuthTries à 3 et désactiver le login root direct dans sshd_config."
  },
  {
    id: "tb-lpic2-202-97",
    title: "Index OpenLDAP manquants provoquant une saturation CPU lors des recherches (slapd)",
    titleFr: "Index OpenLDAP manquants provoquant une saturation CPU lors des recherches (slapd)",
    certification: 'lpic-2',
    topicNumber: 210,
    objectiveId: "210.3",
    category: "Network Client Management - OpenLDAP Indexing",
    scenario: "Sur un annuaire OpenLDAP de 50 000 entrées, les authentifications web ralentissent fortement et slapd consomme 100% de CPU à chaque recherche.",
    scenarioFr: "Sur un annuaire OpenLDAP de 50 000 entrées, les authentifications web ralentissent fortement et slapd consomme 100% de CPU à chaque recherche.",
    codeSnippet: `# slapcat -n 0 | grep -A 5 "olcDatabase={1}mdb"
dn: olcDatabase={1}mdb,cn=config
objectClass: olcDatabaseConfig
objectClass: olcMdbConfig
olcDatabase: {1}mdb
olcDbDirectory: /var/lib/ldap
# Aucun attribut olcDbIndex défini`,
    language: "config",
    bugDescription: "Aucun index n'a été créé sur les attributs fréquemment interrogés (uid, mail, memberOf, objectClass). Le moteur MDB est contraint de parcourir séquentiellement l'intégralité de la base à chaque requête.",
    bugDescriptionFr: "Aucun index n'a été créé sur les attributs fréquemment interrogés (uid, mail, memberOf, objectClass). Le moteur MDB est contraint de parcourir séquentiellement l'intégralité de la base à chaque requête.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter les index appropriés via LDIF (olcDbIndex: uid,mail eq,pres,sub et olcDbIndex: objectClass eq) pour accélérer les recherches",
        labelFr: "Ajouter les index appropriés via LDIF (olcDbIndex: uid,mail eq,pres,sub et olcDbIndex: objectClass eq) pour accélérer les recherches",
        isCorrect: true,
        explanation: "Les index (eq pour égalité, sub pour sous-chaîne, pres pour présence) permettent un accès direct en O(1) au lieu d'un parcours linéaire coûteux.",
        explanationFr: "Ajouter les directives olcDbIndex sur les attributs de recherche clés."
      },
      {
        id: "opt-2",
        label: "Supprimer la base de données LDAP",
        labelFr: "Supprimer la base de données LDAP",
        isCorrect: false,
        explanation: "Perte irréversible des utilisateurs.",
        explanationFr: "Perte irréversible."
      },
      {
        id: "opt-3",
        label: "Désactiver le protocole TCP",
        labelFr: "Désactiver le protocole TCP",
        isCorrect: false,
        explanation: "LDAP utilise TCP.",
        explanationFr: "LDAP utilise TCP."
      },
      {
        id: "opt-4",
        label: "Remplacer OpenLDAP par un fichier texte /etc/passwd",
        labelFr: "Remplacer OpenLDAP par un fichier texte /etc/passwd",
        isCorrect: false,
        explanation: "Inadapté à un grand annuaire d'entreprise.",
        explanationFr: "Inadapté à un grand annuaire."
      }
    ],
    correctedSnippet: `# Créer le fichier index.ldif :
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: objectClass eq
-
add: olcDbIndex
olcDbIndex: uid eq,pres,sub
-
add: olcDbIndex
olcDbIndex: mail eq,sub

# Appliquer la modification :
ldapmodify -Y EXTERNAL -H ldapi:/// -f index.ldif`,
    fixExplanation: "Définir 'olcDbIndex' pour uid, mail et objectClass dans cn=config.",
    fixExplanationFr: "Définir 'olcDbIndex' pour uid, mail et objectClass dans cn=config."
  },
  {
    id: "tb-lpic2-202-98",
    title: "File d'attente Postfix saturée : Messages bloqués dans 'deferred'",
    titleFr: "File d'attente Postfix saturée : Messages bloqués dans 'deferred'",
    certification: 'lpic-2',
    topicNumber: 211,
    objectiveId: "211.1",
    category: "E-Mail Services - Postfix Queue Management",
    scenario: "Des milliers de messages sont en attente dans la file Postfix. La commande 'mailq' affiche des dizaines d'écrans de messages avec le statut 'Connection timed out'.",
    scenarioFr: "Des milliers de messages sont en attente dans la file Postfix. La commande 'mailq' affiche des dizaines d'écrans de messages avec le statut 'Connection timed out'.",
    codeSnippet: `# mailq | head -n 10
-Queue ID-  --Size-- ----Arrival Time---- -Sender/Recipient-------
4SdF1234      2514 Wed Sep 10 13:50:01  bounce@example.com
(connect to mail.victim.com[198.51.100.25]:25: Connection timed out)
                                         user1@victim.com
-- 15420 Kbytes in 3500 Requests.

# postconf -d | grep relayhost
relayhost = `,
    language: "bash",
    bugDescription: "Le fournisseur d'accès ou l'hébergeur cloud (ex: AWS, GCP, Azure, OVH) bloque le port 25 TCP en sortie. Postfix ne peut pas joindre les serveurs MX cibles directement et doit passer par un relais SMTP (relayhost / smarthost).",
    bugDescriptionFr: "Le fournisseur d'accès ou l'hébergeur cloud (ex: AWS, GCP, Azure, OVH) bloque le port 25 TCP en sortie. Postfix ne peut pas joindre les serveurs MX cibles directement et doit passer par un relais SMTP (relayhost / smarthost).",
    options: [
      {
        id: "opt-1",
        label: "Configurer un hôte de relais authentifié via la directive 'relayhost = [smtp.provider.com]:587' dans /etc/postfix/main.cf pour contourner le blocage du port 25 sortant",
        labelFr: "Configurer un hôte de relais authentifié via la directive 'relayhost = [smtp.provider.com]:587' dans /etc/postfix/main.cf pour contourner le blocage du port 25 sortant",
        isCorrect: true,
        explanation: "Les hébergeurs filtrent le port 25 sortant pour lutter contre le spam. Il faut relayer par le port de soumission 587 avec authentification.",
        explanationFr: "Définir relayhost sur le port 587 avec authentification SASL."
      },
      {
        id: "opt-2",
        label: "Vider toute la file d'attente avec 'postsuper -d ALL' sans chercher à comprendre",
        labelFr: "Vider toute la file d'attente avec 'postsuper -d ALL' sans chercher à comprendre",
        isCorrect: false,
        explanation: "Cela supprimerait définitivement des messages légitimes en attente.",
        explanationFr: "Détruirait des courriels légitimes."
      },
      {
        id: "opt-3",
        label: "Changer le format de stockage en Maildir",
        labelFr: "Changer le format de stockage en Maildir",
        isCorrect: false,
        explanation: "Le format de boîte locale ne résout pas l'impossibilité d'émettre sur le réseau.",
        explanationFr: "Ne résout pas l'émission réseau."
      },
      {
        id: "opt-4",
        label: "Supprimer la commande postqueue",
        labelFr: "Supprimer la commande postqueue",
        isCorrect: false,
        explanation: "Absurde.",
        explanationFr: "Absurde."
      }
    ],
    correctedSnippet: `# Dans /etc/postfix/main.cf :
relayhost = [smtp.sendgrid.net]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt

# Forcer le rejeu de la file :
postqueue -f`,
    fixExplanation: "Configurer un smarthost dans 'relayhost' puis relancer la file avec 'postqueue -f'.",
    fixExplanationFr: "Configurer un smarthost dans 'relayhost' puis relancer la file avec 'postqueue -f'."
  },
  {
    id: "tb-lpic2-202-99",
    title: "Blocage des connexions par TCP Wrappers (/etc/hosts.deny)",
    titleFr: "Blocage des connexions par TCP Wrappers (/etc/hosts.deny)",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.1",
    category: "System Security - TCP Wrappers",
    scenario: "Sur un serveur Linux compilé avec support libwrap, les connexions au service vsftpd ou sshd sont immédiatement fermées avec le message 'Connection closed by foreign host' sans même demander d'identifiant.",
    scenarioFr: "Sur un serveur Linux compilé avec support libwrap, les connexions au service vsftpd ou sshd sont immédiatement fermées avec le message 'Connection closed by foreign host' sans même demander d'identifiant.",
    codeSnippet: `# cat /etc/hosts.deny
ALL: ALL

# cat /etc/hosts.allow
# (Fichier vide ou commenté)

# tail -n 2 /var/log/auth.log
sshd[9120]: refused connect from 192.168.1.50 (192.168.1.50)`,
    language: "config",
    bugDescription: "TCP Wrappers évalue /etc/hosts.allow puis /etc/hosts.deny. Avec 'ALL: ALL' dans hosts.deny et aucune exception autorisée dans hosts.allow, toute connexion entrante liée à libwrap est rejetée.",
    bugDescriptionFr: "TCP Wrappers évalue /etc/hosts.allow puis /etc/hosts.deny. Avec 'ALL: ALL' dans hosts.deny et aucune exception autorisée dans hosts.allow, toute connexion entrante liée à libwrap est rejetée.",
    options: [
      {
        id: "opt-1",
        label: "Ajouter les sous-réseaux ou démons autorisés dans /etc/hosts.allow (ex: 'sshd: 192.168.1.0/24') pour créer une exception à la règle 'ALL: ALL'",
        labelFr: "Ajouter les sous-réseaux ou démons autorisés dans /etc/hosts.allow (ex: 'sshd: 192.168.1.0/24') pour créer une exception à la règle 'ALL: ALL'",
        isCorrect: true,
        explanation: "La logique de TCP Wrappers applique : 1) si trouvé dans hosts.allow -> accepter, 2) sinon si trouvé dans hosts.deny -> rejeter, 3) sinon accepter.",
        explanationFr: "Déclarer l'exception dans /etc/hosts.allow."
      },
      {
        id: "opt-2",
        label: "Supprimer le fichier /etc/resolv.conf",
        labelFr: "Supprimer le fichier /etc/resolv.conf",
        isCorrect: false,
        explanation: "Le DNS n'est pas responsable de la règle TCP Wrappers.",
        explanationFr: "Le DNS n'est pas responsable de TCP Wrappers."
      },
      {
        id: "opt-3",
        label: "Remplacer IPv4 par AppleTalk",
        labelFr: "Remplacer IPv4 par AppleTalk",
        isCorrect: false,
        explanation: "Protocole archaïque hors d'usage.",
        explanationFr: "Protocole archaïque hors d'usage."
      },
      {
        id: "opt-4",
        label: "Désactiver le noyau Linux",
        labelFr: "Désactiver le noyau Linux",
        isCorrect: false,
        explanation: "Absurde.",
        explanationFr: "Absurde."
      }
    ],
    correctedSnippet: `# Dans /etc/hosts.allow :
sshd: 192.168.1.0/255.255.255.0, 10.0.0.0/255.0.0.0
vsftpd: 192.168.1.0/255.255.255.0`,
    fixExplanation: "Définir les règles d'autorisation dans /etc/hosts.allow avant le rejet global de /etc/hosts.deny.",
    fixExplanationFr: "Définir les règles d'autorisation dans /etc/hosts.allow avant le rejet global de /etc/hosts.deny."
  },
  {
    id: "tb-lpic2-202-100",
    title: "Port Knocking non réactif : Ordre ou délai de frappe incorrect dans knockd",
    titleFr: "Port Knocking non réactif : Ordre ou délai de frappe incorrect dans knockd",
    certification: 'lpic-2',
    topicNumber: 212,
    objectiveId: "212.2",
    category: "System Security - Port Knocking with knockd",
    scenario: "L'administrateur utilise knockd pour masquer le port SSH. Malgré l'envoi de la séquence de frappes, le port SSH reste désespérément fermé.",
    scenarioFr: "L'administrateur utilise knockd pour masquer le port SSH. Malgré l'envoi de la séquence de frappes, le port SSH reste désespérément fermé.",
    codeSnippet: `# /etc/knockd.conf
[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 2
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# Commande exécutée depuis le client :
# for p in 7000 8000 9000; do nc -z -w2 192.168.1.10 $p; sleep 2; done`,
    language: "config",
    bugDescription: "La commande cliente introduit un délai de 'sleep 2' entre chaque frappe, ce qui dépasse le délai maximal autorisé de 'seq_timeout = 2' secondes pour l'intégralité de la séquence knockd.",
    bugDescriptionFr: "La commande cliente introduit un délai de 'sleep 2' entre chaque frappe, ce qui dépasse le délai maximal autorisé de 'seq_timeout = 2' secondes pour l'intégralité de la séquence knockd.",
    options: [
      {
        id: "opt-1",
        label: "Envoyer les frappes sans délai (ou augmenter 'seq_timeout = 10' dans knockd.conf) afin que la séquence complète de ports arrive dans la fenêtre impartie",
        labelFr: "Envoyer les frappes sans délai (ou augmenter 'seq_timeout = 10' dans knockd.conf) afin que la séquence complète de ports arrive dans la fenêtre impartie",
        isCorrect: true,
        explanation: "seq_timeout définit le temps maximal total pour recevoir tous les paquets de la séquence. Si le timeout expire avant la dernière frappe, la séquence est réinitialisée.",
        explanationFr: "Ajuster seq_timeout ou exécuter les paquets de frappe de façon groupée."
      },
      {
        id: "opt-2",
        label: "Changer le mot de passe root du serveur",
        labelFr: "Changer le mot de passe root du serveur",
        isCorrect: false,
        explanation: "Le port knocking intervient au niveau réseau avant toute couche d'authentification.",
        explanationFr: "Intervient avant l'authentification."
      },
      {
        id: "opt-3",
        label: "Supprimer iptables",
        labelFr: "Supprimer iptables",
        isCorrect: false,
        explanation: "knockd exécute des règles iptables dynamiques pour ouvrir le port.",
        explanationFr: "knockd exécute des commandes iptables."
      },
      {
        id: "opt-4",
        label: "Remplacer TCP par ICMP",
        labelFr: "Remplacer TCP par ICMP",
        isCorrect: false,
        explanation: "knockd est configuré pour écouter des flags SYN TCP.",
        explanationFr: "knockd surveille les SYN TCP."
      }
    ],
    correctedSnippet: `# Dans /etc/knockd.conf :
[options]
    UseSyslog

[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 10
    command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

# Relancer knockd :
systemctl restart knockd`,
    fixExplanation: "Augmenter seq_timeout dans knockd.conf pour tolérer la latence du client.",
    fixExplanationFr: "Augmenter seq_timeout dans knockd.conf pour tolérer la latence du client."
  }
];
