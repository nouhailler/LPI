import { MatchingGame } from "../types";

export const matchingGamesLpic3: MatchingGame[] = [
  {
    "id": "match-lpic3-01",
    "title": "OpenLDAP Standard ObjectClasses & Attribute Types",
    "titleFr": "Classes d'objets & Attributs standards OpenLDAP",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.1",
    "category": "OpenLDAP Directory Services",
    "description": "Match LDAP objectClasses and structural attributes to their directory schema definition.",
    "descriptionFr": "Associez les classes d'objets et attributs LDAP à leur définition de schéma.",
    "pairs": [
      {
        "id": "p1",
        "left": "objectClass: posixAccount",
        "right": "Auxiliary class adding UNIX attributes (uidNumber, gidNumber, homeDirectory, loginShell)",
        "rightFr": "Classe auxiliaire ajoutant les attributs UNIX (uidNumber, gidNumber, homeDirectory, loginShell)",
        "note": "RFC 2307 standard for Linux identity in LDAP",
        "noteFr": "Standard RFC 2307 pour comptes Linux sous LDAP"
      },
      {
        "id": "p2",
        "left": "objectClass: inetOrgPerson",
        "right": "Structural class defining user personal details (mail, telephoneNumber, givenName, sn)",
        "rightFr": "Classe structurelle pour personnes (adresse email, téléphone, prénom, nom)",
        "note": "Inherits from organizationalPerson and person",
        "noteFr": "Hérite de organizationalPerson et person"
      },
      {
        "id": "p3",
        "left": "objectClass: posixGroup",
        "right": "Structural class defining UNIX POSIX group with gidNumber and memberUid attributes",
        "rightFr": "Classe structurelle de groupe POSIX avec attributs gidNumber et memberUid",
        "note": "Defines UNIX secondary group membership in LDAP",
        "noteFr": "Définit l'appartenance aux groupes POSIX"
      },
      {
        "id": "p4",
        "left": "attribute: userPassword",
        "right": "Holds user cryptographic password hash prefixed by scheme (e.g., {SSHA}, {ARGON2})",
        "rightFr": "Stocke le hash de mot de passe préfixé par le schéma (ex: {SSHA}, {ARGON2})",
        "note": "Protected by restrictive OLC access controls",
        "noteFr": "Protégé par des ACL restrictives OLC"
      },
      {
        "id": "p5",
        "left": "attribute: memberOf",
        "right": "Operational attribute automatically populated on user entry by the memberof overlay",
        "rightFr": "Attribut opérationnel automatiquement alimenté sur l'utilisateur par l'overlay memberof",
        "note": "Provides reverse group lookup capability",
        "noteFr": "Offre la recherche inverse de groupes"
      },
      {
        "id": "p6",
        "left": "objectClass: organizationalUnit (ou)",
        "right": "Container entry representing an administrative division or branch (e.g., ou=users)",
        "rightFr": "Entrée conteneur représentant une branche organisationnelle (ex: ou=users)",
        "note": "Structural hierarchy building block",
        "noteFr": "Brique de hiérarchie structurelle de l'annuaire"
      }
    ]
  },
  {
    "id": "match-lpic3-02",
    "title": "OpenLDAP On-Line Configuration (cn=config) Directives",
    "titleFr": "Directives de configuration dynamique OpenLDAP OLC (cn=config)",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.2",
    "category": "OpenLDAP Directory Services",
    "description": "Match dynamic OLC attributes to their runtime directory server configuration roles.",
    "descriptionFr": "Associez les attributs OLC dynamiques à leurs rôles de configuration du serveur d'annuaire.",
    "pairs": [
      {
        "id": "p1",
        "left": "olcDatabase: mdb",
        "right": "Declares an instance of the high-performance LMDB memory-mapped database backend",
        "rightFr": "Déclare une base de données avec le moteur LMDB mappé en mémoire",
        "note": "Modern default storage backend for OpenLDAP",
        "noteFr": "Moteur de stockage par défaut moderne"
      },
      {
        "id": "p2",
        "left": "olcSuffix: dc=example,dc=com",
        "right": "Defines the root base distinguished name (DN) of the naming context served by DB",
        "rightFr": "Définit le DN de base racine du contexte de nommage servi par la base",
        "note": "Top of the directory information tree (DIT)",
        "noteFr": "Sommet de l'arbre DIT de l'annuaire"
      },
      {
        "id": "p3",
        "left": "olcRootDN & olcRootPW",
        "right": "Administrative superuser DN and hashed password bypassing all directory ACLs",
        "rightFr": "DN et mot de passe administrateur outrepassant toutes les ACL d'accès",
        "note": "Directory administrator root identity",
        "noteFr": "Compte maître d'administration de l'annuaire"
      },
      {
        "id": "p4",
        "left": "olcAccess: {0}to attrs=userPassword by self write by anonymous auth by * none",
        "right": "Fine-grained ACL securing user passwords allowing self-updates and anonymous auth",
        "rightFr": "ACL sécurisant les mots de passe : mise à jour personnelle et authentification anonyme",
        "note": "Critical security rule preventing password leaks",
        "noteFr": "Empêche la fuite des mots de passe"
      },
      {
        "id": "p5",
        "left": "olcTLSCACertificateFile & olcTLSCertificateFile",
        "right": "Configures TLS certificate authority and server certificate for LDAPS / StartTLS",
        "rightFr": "Définit l'autorité de certification et le certificat serveur pour StartTLS",
        "note": "Enables encrypted LDAP transit over port 636/389",
        "noteFr": "Active le chiffrement TLS des requêtes"
      }
    ]
  },
  {
    "id": "match-lpic3-03",
    "title": "SSSD Client Directives (sssd.conf) for Enterprise Identity",
    "titleFr": "Directives client SSSD (sssd.conf) pour l'identité d'entreprise",
    "certification": "lpic-3",
    "topicNumber": 303,
    "objectiveId": "303.1",
    "category": "Enterprise Identity & SSSD",
    "description": "Match SSSD configuration directives to their identity caching and authentication behavior.",
    "descriptionFr": "Associez les directives de sssd.conf à leur comportement de cache et d'authentification.",
    "pairs": [
      {
        "id": "p1",
        "left": "id_provider = ldap / ad / ipa",
        "right": "Specifies the backend provider used to look up user accounts and group memberships",
        "rightFr": "Définit le fournisseur backend pour résoudre les comptes et groupes",
        "note": "NSS identity resolution provider",
        "noteFr": "Résolution des identités pour NSS"
      },
      {
        "id": "p2",
        "left": "auth_provider = krb5",
        "right": "Delegates user password authentication verification directly to Kerberos KDC",
        "rightFr": "Délègue la vérification du mot de passe directement au KDC Kerberos",
        "note": "Issues Kerberos TGT upon successful login",
        "noteFr": "Délivre un ticket TGT à la connexion"
      },
      {
        "id": "p3",
        "left": "cache_credentials = true",
        "right": "Caches salted password hashes locally to allow user logins during network disconnects",
        "rightFr": "Met en cache les hashs de mots de passe pour autoriser les connexions hors-ligne",
        "note": "Essential for laptop roaming workers",
        "noteFr": "Indispensable pour les ordinateurs portables"
      },
      {
        "id": "p4",
        "left": "enumerate = false",
        "right": "Disables mass pre-fetching of all directory users to prevent crushing LDAP servers",
        "rightFr": "Désactive le préchargement massif des utilisateurs pour protéger le serveur LDAP",
        "note": "Recommended best practice for large domains",
        "noteFr": "Recommandation majeure en grand domaine"
      },
      {
        "id": "p5",
        "left": "ldap_id_mapping = true",
        "right": "Algorithmically derives POSIX UID/GID from Active Directory Windows security SIDs",
        "rightFr": "Calcule mathématiquement les UID/GID POSIX à partir des SID Windows AD",
        "note": "Eliminates need to maintain RFC2307 attributes in AD",
        "noteFr": "Évite de renseigner manuellement les UID sous AD"
      }
    ]
  },
  {
    "id": "match-lpic3-04",
    "title": "Samba Identity Mapping Backends (idmap config)",
    "titleFr": "Backends d'association d'identités Samba (idmap config)",
    "certification": "lpic-3",
    "topicNumber": 304,
    "objectiveId": "304.1",
    "category": "Samba Integration",
    "description": "Match Samba idmap backends to their Windows SID-to-POSIX UID/GID translation strategies.",
    "descriptionFr": "Associez les backends idmap de Samba à leur méthode de traduction SID vers UID/GID.",
    "pairs": [
      {
        "id": "p1",
        "left": "idmap config * : backend = tdb",
        "right": "Default local database backend allocating sequential UIDs for foreign/local domains",
        "rightFr": "Base locale TDB allouant des UID séquentiels pour le domaine par défaut",
        "note": "Mandatory fallback range in Samba",
        "noteFr": "Plage de secours obligatoire sous Samba"
      },
      {
        "id": "p2",
        "left": "idmap config DOMAIN : backend = rid",
        "right": "Algorithmic backend computing UID = RID + offset; consistent across all domain member servers",
        "rightFr": "Backend algorithmique calculant UID = RID + offset ; identique sur tous les serveurs",
        "note": "Zero configuration on DC required",
        "noteFr": "Ne nécessite aucune modification sur le contrôleur"
      },
      {
        "id": "p3",
        "left": "idmap config DOMAIN : backend = ad",
        "right": "Queries explicit RFC 2307 posixAccount attributes (uidNumber) from Active Directory schema",
        "rightFr": "Lit directement les attributs RFC 2307 (uidNumber) dans l'annuaire Active Directory",
        "note": "Requires schema extension on Windows Server",
        "noteFr": "Exige que les attributs UNIX soient renseignés sous Windows"
      },
      {
        "id": "p4",
        "left": "idmap config DOMAIN : backend = autorid",
        "right": "Automatically discovers domain SIDs and assigns dedicated non-overlapping RID ranges",
        "rightFr": "Découvre automatiquement les domaines de confiance et leur alloue des plages",
        "note": "Ideal for complex multi-domain forests",
        "noteFr": "Idéal pour forêts multi-domaines complexes"
      },
      {
        "id": "p5",
        "left": "net idmap dump /path/to/idmap.tdb",
        "right": "Dumps the active binary SID-to-UID mapping database into human-readable text",
        "rightFr": "Exporte la base binaire de correspondances SID/UID en format texte lisible",
        "note": "Used for backup and troubleshooting mappings",
        "noteFr": "Utilisé pour la sauvegarde et le diagnostic des ID"
      }
    ]
  },
  {
    "id": "match-lpic3-05",
    "title": "Kerberos MIT Key Distribution Center (KDC) Components & Commands",
    "titleFr": "Composants & Commandes du KDC Kerberos MIT",
    "certification": "lpic-3",
    "topicNumber": 305,
    "objectiveId": "305.1",
    "category": "Kerberos & Single Sign-On",
    "description": "Match Kerberos commands, files, and ticket types to their cryptographic SSO function.",
    "descriptionFr": "Associez les commandes et fichiers Kerberos à leur rôle dans l'authentification SSO.",
    "pairs": [
      {
        "id": "p1",
        "left": "Ticket Granting Ticket (TGT)",
        "right": "Master session credential obtained from AS enabling non-interactive service tickets",
        "rightFr": "Ticket maître obtenu auprès de l'AS permettant d'acquérir des tickets de service",
        "note": "Obtained by user via kinit",
        "noteFr": "Obtenu par l'utilisateur avec kinit"
      },
      {
        "id": "p2",
        "left": "kinit username@REALM",
        "right": "Authenticates user against KDC and stores granted TGT in client credential cache",
        "rightFr": "Authentifie l'utilisateur auprès du KDC et stocke le TGT dans le cache de session",
        "note": "Prompts for Kerberos principal password",
        "noteFr": "Demande le mot de passe du principal Kerberos"
      },
      {
        "id": "p3",
        "left": "klist -e",
        "right": "Displays active Kerberos tickets in cache with encryption types and expiration times",
        "rightFr": "Affiche les tickets du cache avec leurs algorithmes de chiffrement et validité",
        "note": "Shows TGT and service tickets held",
        "noteFr": "Affiche TGT et tickets de service actifs"
      },
      {
        "id": "p4",
        "left": "kadmin.local -q 'ktadd -k /etc/krb5.keytab HTTP/web.example.com'",
        "right": "Exports service principal secret keys into a binary keytab file for headless service auth",
        "rightFr": "Exporte les clés d'un principal de service dans un keytab pour les démons autonomes",
        "note": "Used for Apache, Samba, or NFS headless SSO",
        "noteFr": "Indispensable pour Apache SPNEGO, Samba et NFS"
      },
      {
        "id": "p5",
        "left": "kdestroy",
        "right": "Purges and destroys the user's active Kerberos credential cache upon logout",
        "rightFr": "Supprime et détruit le cache de tickets Kerberos de l'utilisateur à la déconnexion",
        "note": "Revokes local SSO capabilities",
        "noteFr": "Révoque immédiatement l'accès SSO local"
      }
    ]
  },
  {
    "id": "match-lpic3-06",
    "title": "X.509 Cryptography Primitives, Extensions & Formats",
    "titleFr": "Primitives, Extensions & Formats cryptographiques X.509",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.1",
    "category": "Cryptography & PKI",
    "description": "Match PKI concepts, certificate extensions, and file formats to their cryptographic role.",
    "descriptionFr": "Associez les concepts PKI, extensions de certificats et formats à leur fonction.",
    "pairs": [
      {
        "id": "p1",
        "left": "CSR (Certificate Signing Request)",
        "right": "Unsigned file holding public key and subject DN, submitted to CA for signature",
        "rightFr": "Fichier non signé contenant clé publique et DN, soumis à la CA pour signature",
        "note": "Generated with openssl req -new",
        "noteFr": "Généré avec openssl req -new"
      },
      {
        "id": "p2",
        "left": "Subject Alternative Name (SAN)",
        "right": "X.509 v3 extension listing multiple DNS hostnames and IP addresses valid for cert",
        "rightFr": "Extension X.509 v3 listant les multiples domaines et IP valides pour le certificat",
        "note": "Mandatory in modern browsers (CommonName is deprecated)",
        "noteFr": "Obligatoire (le champ CN seul est déprécié)"
      },
      {
        "id": "p3",
        "left": "CRL (Certificate Revocation List)",
        "right": "Time-stamped signed list of revoked serial numbers published by CA",
        "rightFr": "Liste horodatée et signée des numéros de série révoqués publiée par la CA",
        "note": "Checked by clients to detect compromised certs",
        "noteFr": "Permet de vérifier la validité d'un certificat"
      },
      {
        "id": "p4",
        "left": "OCSP Stapling",
        "right": "Web server queries CA OCSP responder and appends signed validation to TLS handshake",
        "rightFr": "Le serveur Web fournit la preuve signée de validité du certificat dans le handshake TLS",
        "note": "Drastically improves latency and client privacy",
        "noteFr": "Améliore la vitesse et la confidentialité client"
      },
      {
        "id": "p5",
        "left": "PKCS#12 (.p12 / .pfx)",
        "right": "Password-protected container bundle holding certificate and matching private key",
        "rightFr": "Conteneur chiffré par mot de passe regroupant certificat et clé privée associée",
        "note": "Commonly imported into browser trust stores",
        "noteFr": "Format d'échange standard avec clé privée"
      }
    ]
  },
  {
    "id": "match-lpic3-07",
    "title": "Disk Encryption Primitives (LUKS2, dm-crypt & Clevis/Tang)",
    "titleFr": "Chiffrement de disque (LUKS2, dm-crypt & Clevis/Tang)",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.3",
    "category": "Data & Disk Security",
    "description": "Match disk encryption tools and Network-Bound Disk Encryption (NBDE) components.",
    "descriptionFr": "Associez les commandes de chiffrement de disque et composants NBDE à leur rôle.",
    "pairs": [
      {
        "id": "p1",
        "left": "cryptsetup luksFormat --type luks2 /dev/nvme0n1p3",
        "right": "Formats disk partition with LUKS2 header, creates master key, and assigns keyslot 0",
        "rightFr": "Formate la partition avec l'en-tête LUKS2, clé maître et keyslot 0",
        "note": "Destructive initial encryption step",
        "noteFr": "Étape destructive de chiffrement initial"
      },
      {
        "id": "p2",
        "left": "cryptsetup luksOpen /dev/nvme0n1p3 secure_root",
        "right": "Unlocks encrypted block device and maps cleartext block device to /dev/mapper/secure_root",
        "rightFr": "Déverrouille le volume chiffré et crée le périphérique /dev/mapper/secure_root",
        "note": "Backed by kernel dm-crypt driver",
        "noteFr": "Géré par le module noyau dm-crypt"
      },
      {
        "id": "p3",
        "left": "cryptsetup luksHeaderBackup --header-backup-file file.img",
        "right": "Backs up LUKS keyslot metadata; prevents total data loss if disk sector 0 is corrupted",
        "rightFr": "Sauvegarde les métadonnées LUKS ; évite la perte totale si le secteur 0 est endommagé",
        "note": "Crucial disaster recovery procedure",
        "noteFr": "Procédure indispensable de secours"
      },
      {
        "id": "p4",
        "left": "Tang Server",
        "right": "Network daemon advertising cryptographic keys for Network-Bound Disk Encryption (NBDE)",
        "rightFr": "Démon réseau fournissant les clés cryptographiques pour le déverrouillage réseau (NBDE)",
        "note": "Replaces vulnerable plain keys in initramfs",
        "noteFr": "Évite de stocker des clés en clair dans l'initramfs"
      },
      {
        "id": "p5",
        "left": "clevis luks bind -d /dev/sdb1 tang '{\"url\":\"http://tang.lan\"}'",
        "right": "Binds a LUKS keyslot to an automated Tang network server unlocking policy",
        "rightFr": "Associe un keyslot LUKS au serveur réseau Tang pour un déverrouillage automatique",
        "note": "Automates headless server boot unlocking",
        "noteFr": "Automatise le démarrage sans saisie manuelle"
      }
    ]
  },
  {
    "id": "match-lpic3-08",
    "title": "SELinux Security Contexts & Enforcement Tools",
    "titleFr": "Contextes de sécurité SELinux & Outils d'application",
    "certification": "lpic-3",
    "topicNumber": 322,
    "objectiveId": "322.1",
    "category": "Mandatory Access Control (MAC)",
    "description": "Match SELinux context fields and policy modification commands to their security function.",
    "descriptionFr": "Associez les champs de contexte SELinux et commandes de politique à leur fonction.",
    "pairs": [
      {
        "id": "p1",
        "left": "SELinux Type (e.g., httpd_sys_content_t)",
        "right": "Primary attribute defining access permissions in Type Enforcement (TE) model",
        "rightFr": "Attribut fondamental déterminant les accès autorisés (Type Enforcement)",
        "note": "Third field of label user:role:type:level",
        "noteFr": "3e champ du label de sécurité"
      },
      {
        "id": "p2",
        "left": "restorecon -Rv /var/www/html",
        "right": "Resets file security contexts back to the default rules declared in system policy",
        "rightFr": "Rétablit les contextes de sécurité des fichiers selon les règles de la politique",
        "note": "Fixes permission denied after moving files",
        "noteFr": "Corrige les rejets après déplacement de fichiers"
      },
      {
        "id": "p3",
        "left": "setsebool -P httpd_can_network_connect on",
        "right": "Permanently (-P) toggles an operational SELinux boolean switch in kernel memory",
        "rightFr": "Active de façon permanente (-P) un commutateur booléen SELinux dans le noyau",
        "note": "Permits Apache to initiate outbound TCP connections",
        "noteFr": "Autorise Apache à initier des connexions réseau"
      },
      {
        "id": "p4",
        "left": "semanage fcontext -a -t httpd_sys_content_t '/custom(/.*)?'",
        "right": "Registers a persistent file context regex pattern in SELinux policy database",
        "rightFr": "Enregistre un motif persistant de contexte dans la base de politique SELinux",
        "note": "Must be followed by restorecon to apply",
        "noteFr": "Doit être suivi de restorecon pour s'appliquer"
      },
      {
        "id": "p5",
        "left": "audit2allow -M mypolicy -i /var/log/audit/audit.log",
        "right": "Compiles AVC denial log entries into an installable Type Enforcement policy module (.pp)",
        "rightFr": "Compile les rejets AVC d'audit.log en un module de politique installable (.pp)",
        "note": "Loaded via semodule -i mypolicy.pp",
        "noteFr": "Chargé ensuite via semodule -i"
      }
    ]
  },
  {
    "id": "match-lpic3-09",
    "title": "Auditd Daemon Architecture & Rule Directives",
    "titleFr": "Architecture du démon Auditd & Directives de règles",
    "certification": "lpic-3",
    "topicNumber": 323,
    "objectiveId": "323.1",
    "category": "System Auditing & Logging",
    "description": "Match auditd command flags and audit.rules syntax to their kernel event capture roles.",
    "descriptionFr": "Associez les drapeaux d'auditd et syntaxe d'audit.rules à leurs rôles d'interception.",
    "pairs": [
      {
        "id": "p1",
        "left": "-w /etc/shadow -p wa -k identity_changes",
        "right": "File watch rule logging any write (w) or attribute (a) modification with key tag",
        "rightFr": "Surveille un fichier et consigne toute écriture (w) ou changement d'attribut (a)",
        "note": "Tag allows fast searching via ausearch -k",
        "noteFr": "Le tag -k permet une recherche rapide via ausearch"
      },
      {
        "id": "p2",
        "left": "-a always,exit -F arch=b64 -S execve -k process_exec",
        "right": "Syscall rule auditing every 64-bit program execution invocation at system call exit",
        "rightFr": "Règle d'appel système traçant chaque exécution de programme binaire 64 bits",
        "note": "Captures binary execution and arguments",
        "noteFr": "Capture les commandes et leurs arguments"
      },
      {
        "id": "p3",
        "left": "-e 2 (Immutable Flag)",
        "right": "Locks audit configuration permanently; rules cannot be changed until reboot",
        "rightFr": "Verrouille la politique d'audit : aucune règle ne peut être modifiée sans reboot",
        "note": "Mandatory flag for PCI-DSS and STIG compliance",
        "noteFr": "Exigence stricte de conformité bancaire / défense"
      },
      {
        "id": "p4",
        "left": "ausearch -m AVC -ts recent",
        "right": "Searches audit logs specifically for Mandatory Access Control (SELinux) denial events",
        "rightFr": "Recherche spécifiquement les rejets de contrôle d'accès SELinux (AVC)",
        "note": "Isolates security authorization denials",
        "noteFr": "Isole les violations de sécurité"
      },
      {
        "id": "p5",
        "left": "aureport --summary",
        "right": "Generates aggregate executive security statistics (logins, failed events, anomalies)",
        "rightFr": "Génère un rapport de synthèse agrégé (connexions, échecs, anomalies)",
        "note": "High-level administrative security report",
        "noteFr": "Rapport managérial de sécurité"
      }
    ]
  },
  {
    "id": "match-lpic3-10",
    "title": "StrongSwan IPsec VPN Directives (swanctl.conf)",
    "titleFr": "Directives VPN IPsec StrongSwan (swanctl.conf)",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.1",
    "category": "Network Security & VPN",
    "description": "Match swanctl.conf configuration sections and parameters to their IKEv2 / IPsec role.",
    "descriptionFr": "Associez les sections et paramètres de swanctl.conf à leur fonction IKEv2 / IPsec.",
    "pairs": [
      {
        "id": "p1",
        "left": "connections.<name>.proposals",
        "right": "Specifies cryptographic suites (encryption, integrity, DH groups) for IKE Phase 1",
        "rightFr": "Spécifie les suites cryptographiques (chiffrement, hachage, groupes DH) d'IKEv2",
        "note": "e.g., aes256gcm16-prfsha384-ecp384",
        "noteFr": "ex: aes256gcm16-prfsha384-ecp384"
      },
      {
        "id": "p2",
        "left": "children.<name>.esp_proposals",
        "right": "Specifies symmetric encryption and authentication suites for IPsec Phase 2 ESP tunnel",
        "rightFr": "Définit les algorithmes de chiffrement et d'intégrité pour le tunnel ESP (Phase 2)",
        "note": "Secures encapsulated payload data",
        "noteFr": "Sécurise les paquets de données encapsulés"
      },
      {
        "id": "p3",
        "left": "local.auth = pubkey",
        "right": "Enforces public key authentication using X.509 RSA/ECDSA certificates for local identity",
        "rightFr": "Impose l'authentification par certificat numérique X.509 pour l'extrémité locale",
        "note": "Eliminates insecure pre-shared keys (PSK)",
        "noteFr": "Supprime les clés pré-partagées vulnérables"
      },
      {
        "id": "p4",
        "left": "children.<name>.local_ts & remote_ts",
        "right": "Defines traffic selectors specifying subnets routed across encrypted VPN tunnel",
        "rightFr": "Définit les sélecteurs de trafic spécifiant les sous-réseaux routés dans le tunnel",
        "note": "e.g., 10.0.1.0/24 === 10.0.2.0/24",
        "noteFr": "ex: 10.0.1.0/24 vers 10.0.2.0/24"
      },
      {
        "id": "p5",
        "left": "swanctl --load-all & swanctl --initiate",
        "right": "Loads configuration into charon daemon and manually triggers IKE tunnel establishment",
        "rightFr": "Charge la configuration dans le démon charon et déclenche la connexion du tunnel",
        "note": "Modern management tool replacing ipsec.conf",
        "noteFr": "Remplace l'ancienne syntaxe ipsec stroke"
      }
    ]
  },
  {
    "id": "match-lpic3-11",
    "title": "Virtualization Hypervisor Types & Architectural Paradigms",
    "titleFr": "Types d'hyperviseurs & Paradigmes de virtualisation",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.1",
    "category": "Virtualization Fundamentals",
    "description": "Match virtualization technologies and paradigms to their operational execution model.",
    "descriptionFr": "Associez les technologies et paradigmes de virtualisation à leur modèle d'exécution.",
    "pairs": [
      {
        "id": "p1",
        "left": "Type-1 Hypervisor (Bare-Metal)",
        "right": "Runs directly on physical host hardware (e.g. KVM kernel module, Xen Dom0)",
        "rightFr": "S'exécute directement sur le matériel physique nu (ex: module KVM, Xen Dom0)",
        "note": "Minimal overhead, enterprise performance",
        "noteFr": "Performances maximales d'entreprise"
      },
      {
        "id": "p2",
        "left": "Type-2 Hypervisor (Hosted)",
        "right": "Runs as a user-space application on top of an existing host OS (e.g. VirtualBox)",
        "rightFr": "S'exécute comme une application utilisateur au-dessus d'un OS hôte (VirtualBox)",
        "note": "Subject to host OS scheduling latency",
        "noteFr": "Tributaire de l'ordonnanceur de l'OS hôte"
      },
      {
        "id": "p3",
        "left": "OS-Level Containerization (LXC / Podman)",
        "right": "Shares host Linux kernel using cgroups and namespaces without virtualizing hardware",
        "rightFr": "Partage le noyau Linux hôte via cgroups et namespaces sans émulation matérielle",
        "note": "Near-zero overhead and instant startup",
        "noteFr": "Démarrage instantané et empreinte minimale"
      },
      {
        "id": "p4",
        "left": "QEMU (Emulation)",
        "right": "Software processor emulator capable of translating target CPU instructions (e.g. ARM on x86)",
        "rightFr": "Émulateur processeur logiciel capable de traduire des instructions (ex: ARM sur x86)",
        "note": "Can accelerate via KVM hardware VT-x/AMD-V",
        "noteFr": "Accéléré matériellement par KVM"
      },
      {
        "id": "p5",
        "left": "Virtio Drivers",
        "right": "Paravirtualized device drivers providing near-native I/O throughput for disk and network",
        "rightFr": "Pilotes paravirtualisés offrant des débits E/S quasi-natifs pour disque et réseau",
        "note": "virtio-blk and virtio-net in guest OS",
        "noteFr": "virtio-blk et virtio-net dans la VM invitée"
      }
    ]
  },
  {
    "id": "match-lpic3-12",
    "title": "Virsh Domain Lifecycle Management Commands",
    "titleFr": "Commandes virsh de gestion du cycle de vie des VM",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.2",
    "category": "Virtualization Management",
    "description": "Match virsh commands to their precise virtual machine lifecycle effect.",
    "descriptionFr": "Associez les commandes virsh à leurs actions sur les machines virtuelles.",
    "pairs": [
      {
        "id": "p1",
        "left": "virsh define domain.xml",
        "right": "Registers persistent VM configuration in libvirt from XML definition without starting it",
        "rightFr": "Enregistre la configuration persistante de la VM dans libvirt sans la démarrer",
        "note": "Installs VM configuration into libvirt",
        "noteFr": "Déclare la VM de manière pérenne"
      },
      {
        "id": "p2",
        "left": "virsh shutdown vm_name",
        "right": "Sends clean ACPI power shutdown signal to guest OS, allowing orderly shutdown",
        "rightFr": "Envoie un signal ACPI propre au système invité pour un arrêt ordonné",
        "note": "Orderly shutdown of services and data",
        "noteFr": "Arrêt propre des services"
      },
      {
        "id": "p3",
        "left": "virsh destroy vm_name",
        "right": "Forcefully and abruptly pulls power from VM (equivalent to pulling physical power cord)",
        "rightFr": "Coupe instantanément l'alimentation électrique de la VM (équivalent arrêt brutal)",
        "note": "Immediate hard stop; does not delete disk",
        "noteFr": "Arrêt immédiat sans supprimer les disques"
      },
      {
        "id": "p4",
        "left": "virsh undefine vm_name --remove-all-storage",
        "right": "Deletes VM registration from libvirt and wipes all associated disk image files",
        "rightFr": "Supprime la déclaration de la VM dans libvirt et détruit ses disques virtuels",
        "note": "Permanent deletion of virtual machine",
        "noteFr": "Suppression définitive de la machine"
      },
      {
        "id": "p5",
        "left": "virsh snapshot-create-as vm_name snap1",
        "right": "Creates a live point-in-time snapshot of virtual machine disk and memory state",
        "rightFr": "Crée un instantané (snapshot) figé de l'état disque et mémoire de la VM",
        "note": "Enables instant rollback via snapshot-revert",
        "noteFr": "Permet un retour arrière avec snapshot-revert"
      }
    ]
  },
  {
    "id": "match-lpic3-13",
    "title": "Containerfile / Dockerfile Directives (Podman & OCI)",
    "titleFr": "Directives Containerfile / Dockerfile (Podman & OCI)",
    "certification": "lpic-3",
    "topicNumber": 352,
    "objectiveId": "352.1",
    "category": "Containerization & Podman",
    "description": "Match image build instructions to their layer generation and runtime execution role.",
    "descriptionFr": "Associez les instructions de construction d'image à leur rôle d'exécution.",
    "pairs": [
      {
        "id": "p1",
        "left": "FROM alpine:3.19",
        "right": "Specifies base parent container image initializing build stage",
        "rightFr": "Définit l'image de base parente initialisant l'étape de construction",
        "note": "Mandatory first instruction",
        "noteFr": "Première instruction obligatoire"
      },
      {
        "id": "p2",
        "left": "RUN apt-get update && apt-get install -y nginx",
        "right": "Executes shell commands during build phase and commits new read-only image layer",
        "rightFr": "Exécute des commandes lors de la construction et crée une couche d'image en lecture seule",
        "note": "Build-time filesystem modification",
        "noteFr": "Modifie le système de fichiers au build"
      },
      {
        "id": "p3",
        "left": "COPY --chown=app:app app.py /app/",
        "right": "Copies local files from build context into container image filesystem with ownership",
        "rightFr": "Copie des fichiers locaux de l'hôte dans l'image avec propriétaire spécifique",
        "note": "Safer than ADD (no tar extraction/URL download)",
        "noteFr": "Plus sécurisé que ADD car sans extraction tar"
      },
      {
        "id": "p4",
        "left": "ENTRYPOINT [\"python3\", \"app.py\"]",
        "right": "Configures executable container binary that cannot be overridden by simple CLI arguments",
        "rightFr": "Définit le binaire exécutable par défaut non écrasé par les arguments simples",
        "note": "Command line args are appended to ENTRYPOINT",
        "noteFr": "Les arguments CLI s'ajoutent à l'ENTRYPOINT"
      },
      {
        "id": "p5",
        "left": "CMD [\"--port\", \"8080\"]",
        "right": "Provides default optional arguments passed to ENTRYPOINT; easily overridden via CLI",
        "rightFr": "Fournit les arguments par défaut passés à l'ENTRYPOINT (facilement surchargeables)",
        "note": "Overridden when user passes arguments to podman run",
        "noteFr": "Surchargé si l'utilisateur spécifie des arguments"
      },
      {
        "id": "p6",
        "left": "USER 1001",
        "right": "Drops root privileges and enforces unprivileged non-root user execution in container",
        "rightFr": "Abandonne les privilèges root et impose l'exécution sous un utilisateur non privilégié",
        "note": "Crucial container security hardening",
        "noteFr": "Règle majeure de durcissement de conteneur"
      }
    ]
  },
  {
    "id": "match-lpic3-14",
    "title": "Cloud-Init Configuration Modules (user-data YAML)",
    "titleFr": "Modules de configuration Cloud-Init (user-data YAML)",
    "certification": "lpic-3",
    "topicNumber": 353,
    "objectiveId": "353.2",
    "category": "Cloud Instance Provisioning",
    "description": "Match cloud-init directives to their automated guest initialization actions.",
    "descriptionFr": "Associez les directives cloud-init à leurs actions d'initialisation de l'instance.",
    "pairs": [
      {
        "id": "p1",
        "left": "users: - name: ansible sudo: ALL=(ALL) NOPASSWD:ALL",
        "right": "Creates administrative user account with passwordless sudo privilege escalation",
        "rightFr": "Crée un compte administrateur avec droits d'élévation sudo sans mot de passe",
        "note": "Prepares instance for automated management",
        "noteFr": "Prépare l'instance pour l'automatisation"
      },
      {
        "id": "p2",
        "left": "ssh_authorized_keys: - ssh-ed25519 AAA...",
        "right": "Injects public cryptographic keys into created user's ~/.ssh/authorized_keys file",
        "rightFr": "Injecte les clés publiques SSH dans ~/.ssh/authorized_keys pour la connexion",
        "note": "Enables instant passwordless SSH access",
        "noteFr": "Permet la première connexion SSH sans mot de passe"
      },
      {
        "id": "p3",
        "left": "write_files: - path: /etc/app.conf content: ...",
        "right": "Writes arbitrary configuration files and templates to guest disk before services start",
        "rightFr": "Dépose des fichiers de configuration personnalisés sur le disque avant le démarrage",
        "note": "Can set permissions, owner, and encoding",
        "noteFr": "Définit droits, propriétaire et contenu"
      },
      {
        "id": "p4",
        "left": "runcmd: - [systemctl, enable, --now, nginx]",
        "right": "Executes shell commands in sequence at the very end of cloud-init first-boot run",
        "rightFr": "Exécute une liste de commandes shell à la fin du premier amorçage de l'instance",
        "note": "Runs once during initial instance boot",
        "noteFr": "Exécuté une seule fois lors du premier boot"
      },
      {
        "id": "p5",
        "left": "package_upgrade: true & packages: [git, htop]",
        "right": "Applies OS security updates and installs designated distro packages during bootstrap",
        "rightFr": "Met à jour les paquets système et installe les logiciels demandés au démarrage",
        "note": "Uses native apt/dnf cloud-init modules",
        "noteFr": "Utilise les gestionnaires de paquets natifs"
      }
    ]
  },
  {
    "id": "match-lpic3-15",
    "title": "Kubernetes Fundamental API Objects & Workloads",
    "titleFr": "Objets API & Contrôleurs fondamentaux Kubernetes",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.1",
    "category": "Kubernetes Orchestration",
    "description": "Match Kubernetes resource kinds to their container clustering role.",
    "descriptionFr": "Associez les types de ressources Kubernetes à leur rôle dans le cluster.",
    "pairs": [
      {
        "id": "p1",
        "left": "Pod",
        "right": "Smallest deployable execution unit containing one or more co-located containers",
        "rightFr": "Plus petite unité d'exécution contenant un ou plusieurs conteneurs colocalisés",
        "note": "Shares localhost network and storage volumes",
        "noteFr": "Partage le réseau localhost et les volumes"
      },
      {
        "id": "p2",
        "left": "Deployment",
        "right": "Declarative controller managing rolling updates, rollbacks, and replica counts of Pods",
        "rightFr": "Contrôleur gérant les déploiements continus (rolling updates) et réplicas de Pods",
        "note": "Manages underlying ReplicaSets",
        "noteFr": "Supervise les ReplicaSets sous-jacents"
      },
      {
        "id": "p3",
        "left": "Service (ClusterIP / NodePort)",
        "right": "Stable internal IP address and DNS name providing load balancing across Pod replicas",
        "rightFr": "IP interne stable et nom DNS fournissant un équilibrage de charge vers les Pods",
        "note": "Abstracts away ephemeral Pod IP addresses",
        "noteFr": "Isole les adresses IP éphémères des pods"
      },
      {
        "id": "p4",
        "left": "Ingress",
        "right": "Layer-7 HTTP/HTTPS reverse proxy routing external traffic into cluster Services",
        "rightFr": "Passerelle applicative HTTP/HTTPS routant le trafic externe vers les Services",
        "note": "Handles TLS termination and path routing",
        "noteFr": "Gère le routage par URL et terminaison TLS"
      },
      {
        "id": "p5",
        "left": "PersistentVolumeClaim (PVC)",
        "right": "User storage request dynamically binding to a PersistentVolume (PV) via StorageClass",
        "rightFr": "Demande d'espace de stockage persistant liée dynamiquement à un PV",
        "note": "Decouples pod lifecycle from disk storage",
        "noteFr": "Découple le stockage du cycle de vie du pod"
      }
    ]
  },
  {
    "id": "match-lpic3-16",
    "title": "Pacemaker & Corosync Cluster Subsystems",
    "titleFr": "Sous-systèmes de cluster Pacemaker & Corosync",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.1",
    "category": "High Availability Clusters",
    "description": "Match cluster daemons and components to their high availability responsibilities.",
    "descriptionFr": "Associez les démons et composants de cluster à leurs rôles de haute disponibilité.",
    "pairs": [
      {
        "id": "p1",
        "left": "Corosync",
        "right": "Cluster messaging engine providing reliable node membership and quorum voting",
        "rightFr": "Moteur de communication réseau assurant l'appartenance des nœuds et le quorum",
        "note": "Totem single-ring/knet protocol",
        "noteFr": "Protocole d'échange réseau Totem/knet"
      },
      {
        "id": "p2",
        "left": "Pacemaker (crmd & pengine)",
        "right": "Cluster resource manager computing optimal state and orchestrating service failover",
        "rightFr": "Gestionnaire de ressources calculant l'état optimal et orchestrant les bascules",
        "note": "Policy Engine (pengine) and CRM daemon",
        "noteFr": "Moteur de politique et démon CRM"
      },
      {
        "id": "p3",
        "left": "stonithd (Fencing Daemon)",
        "right": "Isolates unresponsive or split-brain nodes by forcibly powering them off via hardware",
        "rightFr": "Isole les nœuds défaillants ou en split-brain en coupant leur alimentation",
        "note": "Shoot The Other Node In The Head",
        "noteFr": "Évite la corruption de données partagées"
      },
      {
        "id": "p4",
        "left": "OCF Resource Agent (ocf:heartbeat:IPaddr2)",
        "right": "Standard shell/python script implementing start, stop, monitor, and meta-data actions",
        "rightFr": "Script standardisé implémentant les actions start, stop, monitor et métadonnées",
        "note": "Open Cluster Framework standard",
        "noteFr": "Standard ouvert d'agents de ressources"
      },
      {
        "id": "p5",
        "left": "CIB (Cluster Information Base)",
        "right": "XML-based replicated cluster configuration and active status database in memory",
        "rightFr": "Base de données XML répliquée en mémoire stockant la configuration du cluster",
        "note": "Synchronized across all cluster nodes",
        "noteFr": "Synchronisée sur l'ensemble des nœuds"
      }
    ]
  },
  {
    "id": "match-lpic3-17",
    "title": "Pacemaker Resource Constraints (location, colocation, order)",
    "titleFr": "Contraintes de ressources Pacemaker (location, colocation, order)",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.3",
    "category": "High Availability Clusters",
    "description": "Match Pacemaker constraint types and score weights to their placement effects.",
    "descriptionFr": "Associez les types de contraintes et scores Pacemaker à leurs effets de placement.",
    "pairs": [
      {
        "id": "p1",
        "left": "pcs constraint order start VIP then WebApp",
        "right": "Enforces strict sequential startup order: VIP must start before WebApp starts",
        "rightFr": "Impose un ordre strict de démarrage : la VIP doit démarrer avant l'application Web",
        "note": "Reverse order applied during cluster shutdown",
        "noteFr": "Ordre inverse appliqué à l'extinction"
      },
      {
        "id": "p2",
        "left": "pcs constraint colocation add WebApp with VIP INFINITY",
        "right": "Forces WebApp and VIP to run together on the exact same cluster node",
        "rightFr": "Oblige impérativement WebApp et VIP à tourner sur le même nœud physique",
        "note": "Positive infinity score binds resources",
        "noteFr": "Score INFINITY lie inséparablement les ressources"
      },
      {
        "id": "p3",
        "left": "pcs constraint colocation add ServiceA with ServiceB -INFINITY",
        "right": "Anti-colocation rule strictly forbidding ServiceA and ServiceB from running on same node",
        "rightFr": "Règle d'anti-colocation interdisant formellement d'exécuter les deux services sur le même nœud",
        "note": "Distributes load across separate hardware",
        "noteFr": "Répartit les charges sur des machines distinctes"
      },
      {
        "id": "p4",
        "left": "pcs constraint location WebApp prefers node1=100",
        "right": "Biases resource placement toward node1 while still allowing failover to node2",
        "rightFr": "Favorise le placement de la ressource sur node1 tout en tolérant la bascule sur node2",
        "note": "Weighted preference score",
        "noteFr": "Préférence pondérée non bloquante"
      },
      {
        "id": "p5",
        "left": "score = -INFINITY on location",
        "right": "Hard negative constraint permanently preventing resource from ever starting on this node",
        "rightFr": "Interdiction formelle et absolue pour la ressource de démarrer sur ce nœud",
        "note": "Blacklists a node for specific resource",
        "noteFr": "Place le nœud sur liste noire pour la ressource"
      }
    ]
  },
  {
    "id": "match-lpic3-18",
    "title": "DRBD 9 Replication States & Synchronization Flags",
    "titleFr": "États de réplication & Drapeaux de synchronisation DRBD 9",
    "certification": "lpic-3",
    "topicNumber": 362,
    "objectiveId": "362.1",
    "category": "High Availability Storage",
    "description": "Match DRBD connection and disk state indicators to their cluster replication status.",
    "descriptionFr": "Associez les indicateurs de connexion et d'état disque DRBD à leur signification.",
    "pairs": [
      {
        "id": "p1",
        "left": "Role: Primary / Secondary",
        "right": "Primary permits read-write mounting; Secondary is read-only block mirror target",
        "rightFr": "Primary autorise le montage en écriture ; Secondary est la cible miroir",
        "note": "Single-primary vs dual-primary setups",
        "noteFr": "Mode mono-primaire ou double-primaire"
      },
      {
        "id": "p2",
        "left": "Disk State: UpToDate / UpToDate",
        "right": "Both storage nodes have fully synchronized identical block data",
        "rightFr": "Les deux nœuds possèdent des blocs de données rigoureusement identiques",
        "note": "Ideal healthy operational state",
        "noteFr": "État nominal sain du miroir"
      },
      {
        "id": "p3",
        "left": "Connection: SyncSource / SyncTarget",
        "right": "One node is currently transferring modified disk blocks over network to resync peer",
        "rightFr": "Un nœud transmet les blocs modifiés à travers le réseau pour resynchroniser le pair",
        "note": "Active resynchronization in progress",
        "noteFr": "Resynchronisation active en cours"
      },
      {
        "id": "p4",
        "left": "Connection: StandAlone",
        "right": "DRBD has severed network communication due to split-brain or manual disconnect",
        "rightFr": "DRBD a coupé les échanges réseau suite à un split-brain ou déconnexion manuelle",
        "note": "Requires split-brain resolution to reconnect",
        "noteFr": "Nécessite une résolution manuelle de split-brain"
      },
      {
        "id": "p5",
        "left": "Protocol C (Synchronous)",
        "right": "Write is confirmed only after local disk commit AND remote disk commit complete",
        "rightFr": "L'écriture est validée seulement après validation sur le disque local ET distant",
        "note": "Zero data loss guarantee at slight latency cost",
        "noteFr": "Garantit zéro perte de données"
      }
    ]
  },
  {
    "id": "match-lpic3-19",
    "title": "Ceph Distributed Storage Cluster Daemons & Architecture",
    "titleFr": "Démons & Architecture de cluster distribué Ceph",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.1",
    "category": "Distributed Storage Systems",
    "description": "Match Ceph daemons and algorithmic mapping concepts to their storage duties.",
    "descriptionFr": "Associez les démons Ceph et composants d'adressage à leurs fonctions de stockage.",
    "pairs": [
      {
        "id": "p1",
        "left": "ceph-mon (Monitor)",
        "right": "Maintains cluster consensus map and state history using Paxos algorithm (min 3 for quorum)",
        "rightFr": "Maintient la carte du cluster et l'état global via l'algorithme Paxos (min 3 pour quorum)",
        "note": "Brain and coordinator of Ceph cluster",
        "noteFr": "Cerveau et arbitre du cluster Ceph"
      },
      {
        "id": "p2",
        "left": "ceph-osd (Object Storage Daemon)",
        "right": "Stores actual object data on physical NVMe/HDD drives, handles local replication and scrub",
        "rightFr": "Stocke les données objets sur disques physiques, gère la réplication et le scrub",
        "note": "Typically one ceph-osd process per disk",
        "noteFr": "Généralement un démon par disque physique"
      },
      {
        "id": "p3",
        "left": "ceph-mgr (Manager)",
        "right": "Collects runtime metrics, hosts dashboard GUI, and exposes Prometheus telemetry",
        "rightFr": "Collecte les métriques d'exécution, héberge le dashboard et exporte vers Prometheus",
        "note": "Provides monitoring and management APIs",
        "noteFr": "Fournit l'API de surveillance"
      },
      {
        "id": "p4",
        "left": "CRUSH Map Algorithm",
        "right": "Deterministic pseudo-random algorithm calculating exact OSD placement without lookup table",
        "rightFr": "Algorithme pseudo-aléatoire déterministe calculant l'emplacement des données sans table",
        "note": "Controlled Replication Under Scalable Hashing",
        "noteFr": "Élimine les goulots d'étranglement de métadonnées"
      },
      {
        "id": "p5",
        "left": "RADOS Block Device (RBD)",
        "right": "Provides thin-provisioned, resizable virtual block devices striped across Ceph pool",
        "rightFr": "Fournit des périphériques blocs virtuels fins et redimensionnables pour VM/KVM",
        "note": "Standard storage backend for OpenStack and KVM",
        "noteFr": "Stockage bloc haute performance pour VM"
      }
    ]
  },
  {
    "id": "match-lpic3-20",
    "title": "HAProxy Load Balancer Directives & Balancing Algorithms",
    "titleFr": "Directives de configuration HAProxy & Algorithmes de répartition",
    "certification": "lpic-3",
    "topicNumber": 364,
    "objectiveId": "364.1",
    "category": "Load Balancing & High Availability",
    "description": "Match HAProxy configuration sections and scheduling algorithms to their routing behavior.",
    "descriptionFr": "Associez les sections de configuration HAProxy et algorithmes à leur comportement de routage.",
    "pairs": [
      {
        "id": "p1",
        "left": "frontend http-in",
        "right": "Defines client-facing listening sockets, port bindings, and SSL/TLS termination",
        "rightFr": "Définit les sockets d'écoute exposés aux clients, ports et terminaison SSL/TLS",
        "note": "Entry point for incoming client connections",
        "noteFr": "Point d'entrée du trafic client entrant"
      },
      {
        "id": "p2",
        "left": "backend app-servers",
        "right": "Defines upstream server pool, health checking intervals, and load balancing algorithm",
        "rightFr": "Définit le pool de serveurs amont, la sonde de santé (health check) et l'algorithme",
        "note": "Target application pool",
        "noteFr": "Groupe de serveurs applicatifs cibles"
      },
      {
        "id": "p3",
        "left": "balance roundrobin",
        "right": "Distributes incoming requests sequentially in turns with dynamic server weights",
        "rightFr": "Répartit les requêtes équitablement à tour de rôle en respectant les poids (weights)",
        "note": "Default standard load balancing algorithm",
        "noteFr": "Algorithme équitable standard"
      },
      {
        "id": "p4",
        "left": "balance leastconn",
        "right": "Routes new connections to upstream server with lowest number of active concurrent connections",
        "rightFr": "Achemine la nouvelle connexion vers le serveur ayant le moins de connexions actives",
        "note": "Ideal for long-lived sessions (DB, WebSockets)",
        "noteFr": "Idéal pour sessions longues ou bases de données"
      },
      {
        "id": "p5",
        "left": "balance source",
        "right": "Hashes client IP address to always route the same client to the same backend server",
        "rightFr": "Hache l'IP client pour router systématiquement le même client vers le même serveur",
        "note": "Provides session stickiness without cookies",
        "noteFr": "Assure la persistance sans cookies"
      },
      {
        "id": "p6",
        "left": "server web1 10.0.0.11:80 check inter 2000 fall 3 rise 2",
        "right": "Declares backend node with active health check polling every 2s, failing after 3 missed checks",
        "rightFr": "Déclare un nœud avec sonde de santé toutes les 2s, tombant en panne après 3 échecs",
        "note": "Automates instant failed node eviction",
        "noteFr": "Éviction automatique des nœuds hors service"
      }
    ]
  }
];
