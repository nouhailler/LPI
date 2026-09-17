# -*- coding: utf-8 -*-
"""
LPIC-3: 20 Guided Mini-Labs
- 5 for Exam 300 (Mixed Environment & Enterprise Identity)
- 5 for Exam 303 (Security & Hardening)
- 5 for Exam 305 (Virtualization & Containerization)
- 5 for Exam 306 (High Availability & Cluster Storage)
"""

labs_lpic3 = [
  # --- EXAM 300: Mixed Environment & Identity ---
  {
    "id": "lab-lpic3-01",
    "title": "OpenLDAP Directory Search & LDIF Object Ingestion",
    "titleFr": "Recherche dans l'annuaire OpenLDAP & Injection d'objets LDIF",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.1",
    "category": "OpenLDAP Identity",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "goal": "Search the directory with ldapsearch, parse LDIF entries, and insert a new organizationalUnit with ldapadd.",
    "goalFr": "Interroger l'annuaire avec ldapsearch, analyser les entrées LDIF et insérer une organizationalUnit avec ldapadd.",
    "context": "An enterprise identity infrastructure runs OpenLDAP. You must verify tree contents and provision a new department branch.",
    "contextFr": "Une infrastructure d'identité tourne sous OpenLDAP. Vous devez auditer la branche DIT et ajouter une nouvelle unité.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Search directory tree using simple authentication",
        "titleFr": "Rechercher dans l'annuaire avec authentification simple",
        "instruction": "Execute ldapsearch with -x (simple auth) and base search (-b \"dc=example,dc=com\") for objectClass=posixAccount.",
        "instructionFr": "Exécutez ldapsearch avec -x et -b \"dc=example,dc=com\" en filtrant sur (objectClass=posixAccount).",
        "hint": "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
        "hintFr": "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
        "expectedCommands": [
          "ldapsearch -x -b \"dc=example,dc=com\" \"(objectClass=posixAccount)\"",
          "ldapsearch -x -b 'dc=example,dc=com' '(objectClass=posixAccount)'",
          "ldapsearch -x -b dc=example,dc=com objectClass=posixAccount"
        ],
        "simulatedOutput": "# extended LDIF\n#\n# LDAPv3\n# base <dc=example,dc=com> with scope subtree\n# filter: (objectClass=posixAccount)\n# entries: 2\n\ndn: uid=john,ou=People,dc=example,dc=com\nobjectClass: inetOrgPerson\nobjectClass: posixAccount\nuid: john\ncn: John Doe\nsn: Doe\nuidNumber: 1001\ngidNumber: 1001\nhomeDirectory: /home/john\nloginShell: /bin/bash\n\n# numResponses: 3\n# numEntries: 2",
        "explanation": "ldapsearch queries LDAP directories over port 389, returning results structured in LDIF (RFC 2849).",
        "explanationFr": "ldapsearch interroge l'annuaire sur le port 389 et renvoie les entrées au standard LDIF."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Insert new OU branch using ldapadd with LDIF input",
        "titleFr": "Insérer une nouvelle branche OU avec ldapadd via un fichier LDIF",
        "instruction": "Run ldapadd with -x, bind DN -D \"cn=admin,dc=example,dc=com\", -W (prompt password), and file -f /tmp/ou_dev.ldif.",
        "instructionFr": "Lancez ldapadd avec -x, -D \"cn=admin,dc=example,dc=com\" et -f /tmp/ou_dev.ldif.",
        "hint": "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
        "hintFr": "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
        "expectedCommands": [
          "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -W -f /tmp/ou_dev.ldif",
          "ldapadd -x -D 'cn=admin,dc=example,dc=com' -W -f /tmp/ou_dev.ldif",
          "ldapadd -x -D \"cn=admin,dc=example,dc=com\" -w secret -f /tmp/ou_dev.ldif",
          "ldapadd -x -D 'cn=admin,dc=example,dc=com' -w secret -f /tmp/ou_dev.ldif"
        ],
        "simulatedOutput": "Enter LDAP Password: \nadding new entry \"ou=Engineering,dc=example,dc=com\"\n[OK] Entry committed successfully.",
        "explanation": "ldapadd sends LDAP_REQ_ADD protocol messages to the slapd server to insert directory objects.",
        "explanationFr": "ldapadd envoie la requête LDAP_REQ_ADD pour créer le nouvel objet dans la hiérarchie DIT."
      }
    ]
  },
  {
    "id": "lab-lpic3-02",
    "title": "OpenLDAP Dynamic Online Configuration with cn=config",
    "titleFr": "Configuration dynamique OpenLDAP en ligne avec cn=config",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.2",
    "category": "OpenLDAP Configuration",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Inspect configuration database using slapcat -n 0, and apply dynamic configuration changes via ldapmodify with SASL EXTERNAL.",
    "goalFr": "Examiner la base de configuration avec slapcat -n 0 et appliquer une modification en ligne via ldapmodify et SASL EXTERNAL.",
    "context": "Slapd configuration must be modified online through the cn=config database without restarting the slapd daemon.",
    "contextFr": "La configuration d'OpenLDAP doit être ajustée à chaud dans l'arbre cn=config sans interrompre le démon.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Dump configuration database (database 0) with slapcat",
        "titleFr": "Extraire la base de configuration (base 0) avec slapcat",
        "instruction": "Execute slapcat with -n 0 to export the dynamic cn=config tree.",
        "instructionFr": "Exécutez slapcat avec -n 0 pour extraire l'arborescence cn=config.",
        "hint": "slapcat -n 0",
        "hintFr": "slapcat -n 0",
        "expectedCommands": ["slapcat -n 0", "sudo slapcat -n 0", "slapcat -b cn=config"],
        "simulatedOutput": "dn: cn=config\nobjectClass: olcGlobal\ncn: config\nolcArgsFile: /var/run/slapd/slapd.args\nolcPidFile: /var/run/slapd/slapd.pid\n\ndn: cn=module{0},cn=config\nobjectClass: olcModuleList\ncn: module{0}\nolcModulePath: /usr/lib/ldap\nolcModuleLoad: {0}back_mdb\n\ndn: olcDatabase={0}config,cn=config\nobjectClass: olcDatabaseConfig\nolcDatabase: {0}config",
        "explanation": "slapcat -n 0 reads the local MDB/BDB files directly from disk to output configuration LDIF without requiring a running slapd.",
        "explanationFr": "slapcat -n 0 accède directement aux fichiers physiques de la base pour exporter la configuration cn=config."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Apply dynamic modification via IPC Unix domain socket with ldapmodify",
        "titleFr": "Appliquer la modification dynamique via le socket IPC avec ldapmodify",
        "instruction": "Use ldapmodify with SASL EXTERNAL (-Y EXTERNAL), URI ldapi:/// (-H ldapi:///), and file /tmp/tune.ldif.",
        "instructionFr": "Utilisez ldapmodify avec -Y EXTERNAL, -H ldapi:/// et -f /tmp/tune.ldif.",
        "hint": "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
        "hintFr": "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
        "expectedCommands": [
          "ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
          "sudo ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tune.ldif",
          "ldapmodify -Y EXTERNAL -H 'ldapi:///' -f /tmp/tune.ldif"
        ],
        "simulatedOutput": "SASL/EXTERNAL authentication started\nSASL username: gidNumber=0+uidNumber=0,cn=peercred,cn=external,cn=auth\nSASL SSF: 0\nmodifying entry \"cn=config\"\n[OK] Configuration parameter applied dynamically.",
        "explanation": "SASL EXTERNAL authentication over Unix domain sockets (ldapi:///) grants root instant administrative access to cn=config.",
        "explanationFr": "L'authentification SASL EXTERNAL sur le socket Unix (ldapi:///) permet à root de modifier cn=config sans mot de passe."
      }
    ]
  },
  {
    "id": "lab-lpic3-03",
    "title": "SSSD Integration & Identity Provider Verification",
    "titleFr": "Intégration du client SSSD & Validation des fournisseurs d'identité",
    "certification": "lpic-3",
    "topicNumber": 303,
    "objectiveId": "303.1",
    "category": "SSSD & PAM Integration",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify sssd.conf syntax with sssctl config-check, query user resolution with getent passwd, and inspect cached identities.",
    "goalFr": "Vérifier sssd.conf avec sssctl config-check, tester la résolution avec getent passwd et inspecter le cache SSSD.",
    "context": "SSSD binds this Linux host to central Active Directory and LDAP. You must validate configuration permissions and user lookup.",
    "contextFr": "SSSD relie la machine à l'annuaire d'entreprise. Vous devez auditer la configuration et tester la résolution NSS.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate SSSD configuration permissions and syntax",
        "titleFr": "Valider les permissions et la syntaxe de sssd.conf",
        "instruction": "Execute sssctl config-check to inspect /etc/sssd/sssd.conf.",
        "instructionFr": "Lancez sssctl config-check pour auditer la configuration de SSSD.",
        "hint": "sssctl config-check",
        "hintFr": "sssctl config-check",
        "expectedCommands": [
          "sssctl config-check",
          "sudo sssctl config-check"
        ],
        "simulatedOutput": "Issues identified by validators: 0\nFile /etc/sssd/sssd.conf is valid and permissions (0600) are correct.",
        "explanation": "SSSD refuses to start if /etc/sssd/sssd.conf has permissions other than 0600 (read/write root only).",
        "explanationFr": "SSSD refuse catégoriquement de démarrer si les permissions de sssd.conf diffèrent du mode strict 0600."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Verify NSS user resolution from directory with getent",
        "titleFr": "Vérifier la résolution utilisateur NSS avec getent",
        "instruction": "Use getent passwd to look up enterprise account 'john'.",
        "instructionFr": "Utilisez getent passwd pour interroger le compte d'entreprise 'john'.",
        "hint": "getent passwd john",
        "hintFr": "getent passwd john",
        "expectedCommands": ["getent passwd john", "getent passwd john@example.com"],
        "simulatedOutput": "john:*:10001:10001:John Doe:/home/john:/bin/bash",
        "explanation": "getent queries NSS (Name Service Switch) which delegates the query to libnss_sss.so provided by SSSD.",
        "explanationFr": "getent interroge la couche NSS qui fait appel au module libnss_sss.so de SSSD pour contacter l'annuaire."
      }
    ]
  },
  {
    "id": "lab-lpic3-04",
    "title": "Samba Active Directory Domain Join & Winbind Inspection",
    "titleFr": "Jonction de domaine Active Directory avec Samba & Winbind",
    "certification": "lpic-3",
    "topicNumber": 304,
    "objectiveId": "304.1",
    "category": "Active Directory Interoperability",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify domain membership with net ads testjoin, list domain users with wbinfo -u, and inspect trusted domain relationships.",
    "goalFr": "Tester l'adhésion au domaine avec net ads testjoin et lister les utilisateurs distants avec wbinfo -u.",
    "context": "The server has joined an Active Directory domain. You must verify that the Kerberos trust and Winbind daemon are operational.",
    "contextFr": "Le serveur a été rattaché au domaine AD. Vous devez tester la confiance Kerberos et l'état de Winbind.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Verify domain membership trust with net ads testjoin",
        "titleFr": "Vérifier l'adhésion au domaine avec net ads testjoin",
        "instruction": "Execute net ads testjoin to validate the computer account trust password.",
        "instructionFr": "Exécutez net ads testjoin pour valider la relation de confiance avec le contrôleur de domaine.",
        "hint": "net ads testjoin",
        "hintFr": "net ads testjoin",
        "expectedCommands": [
          "net ads testjoin",
          "sudo net ads testjoin"
        ],
        "simulatedOutput": "Join to domain 'EXAMPLE' is OK",
        "explanation": "net ads testjoin verifies the machine account credentials in Active Directory and machine password validity.",
        "explanationFr": "net ads testjoin valide le secret du compte machine de l'hôte enregistré dans l'annuaire Active Directory."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List domain users cached and enumerated by winbind",
        "titleFr": "Lister les utilisateurs du domaine via winbind",
        "instruction": "Execute wbinfo -u to query domain users.",
        "instructionFr": "Exécutez wbinfo -u pour lister les utilisateurs du domaine.",
        "hint": "wbinfo -u",
        "hintFr": "wbinfo -u",
        "expectedCommands": ["wbinfo -u", "sudo wbinfo -u"],
        "simulatedOutput": "EXAMPLE\\administrator\nEXAMPLE\\guest\nEXAMPLE\\krbtgt\nEXAMPLE\\alice\nEXAMPLE\\bob",
        "explanation": "wbinfo communicates with the winbindd daemon over its local IPC pipe to enumerate domain principals.",
        "explanationFr": "wbinfo interroge le démon winbindd pour énumérer les comptes et groupes du domaine Windows."
      }
    ]
  },
  {
    "id": "lab-lpic3-05",
    "title": "Kerberos KDC Ticket Granting & Keytab Management",
    "titleFr": "Tickets Kerberos KDC & Gestion des fichiers Keytab",
    "certification": "lpic-3",
    "topicNumber": 305,
    "objectiveId": "305.1",
    "category": "Enterprise Authentication",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Obtain a Kerberos TGT with kinit, list active encryption types and expiration with klist -e, and destroy tickets with kdestroy.",
    "goalFr": "Obtenir un TGT Kerberos avec kinit, lister les tickets et chiffrements avec klist -e et détruire le ticket avec kdestroy.",
    "context": "Kerberos single sign-on (SSO) authentication must be tested using ticket granting tickets.",
    "contextFr": "L'authentification unique (SSO) Kerberos doit être validée en générant et inspectant les tickets TGT.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Acquire Ticket Granting Ticket (TGT) with kinit",
        "titleFr": "Obtenir un ticket TGT avec kinit",
        "instruction": "Execute kinit for principal admin@EXAMPLE.COM.",
        "instructionFr": "Exécutez kinit pour le principal admin@EXAMPLE.COM.",
        "hint": "kinit admin@EXAMPLE.COM",
        "hintFr": "kinit admin@EXAMPLE.COM",
        "expectedCommands": [
          "kinit admin@EXAMPLE.COM",
          "kinit admin"
        ],
        "simulatedOutput": "Password for admin@EXAMPLE.COM: \n[OK] TGT acquired from KDC kdc.example.com.",
        "explanation": "kinit contacts the Kerberos AS (Authentication Service) and retrieves a TGT cached in /tmp/krb5cc_<uid>.",
        "explanationFr": "kinit contacte le KDC Kerberos et stocke le ticket TGT dans le cache de session /tmp/krb5cc_<uid>."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect active ticket details and cipher suites with klist -e",
        "titleFr": "Inspecter les tickets actifs et algorithmes de chiffrement avec klist -e",
        "instruction": "Run klist with the encryption flag (-e) to display ticket details.",
        "instructionFr": "Lancez klist avec l'option -e pour afficher les tickets et chiffrements.",
        "hint": "klist -e",
        "hintFr": "klist -e",
        "expectedCommands": ["klist -e", "klist"],
        "simulatedOutput": "Ticket cache: FILE:/tmp/krb5cc_1000\nDefault principal: admin@EXAMPLE.COM\n\nValid starting       Expires              Service principal\n09/16/2026 14:40:00  09/17/2026 00:40:00  krbtgt/EXAMPLE.COM@EXAMPLE.COM\n\tEtype (skey, tkt): aes256-cts-hmac-sha1-96, aes256-cts-hmac-sha1-96",
        "explanation": "klist -e verifies that modern secure ciphers (such as AES-256) are negotiated instead of obsolete RC4/DES.",
        "explanationFr": "klist -e certifie que le chiffrement AES-256 est bien négocié à la place d'anciens chiffrements dépréciés."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Destroy active Kerberos ticket cache",
        "titleFr": "Détruire le cache de tickets Kerberos",
        "instruction": "Run kdestroy to purge credentials from cache.",
        "instructionFr": "Exécutez kdestroy pour effacer les tickets en cache.",
        "hint": "kdestroy",
        "hintFr": "kdestroy",
        "expectedCommands": ["kdestroy"],
        "simulatedOutput": "[OK] Kerberos credential cache destroyed.",
        "explanation": "kdestroy securely unlinks and overwrites the active credentials cache file.",
        "explanationFr": "kdestroy purge et détruit de façon sécurisée le fichier de cache de tickets de session."
      }
    ]
  },

  # --- EXAM 303: Enterprise Security & Hardening ---
  {
    "id": "lab-lpic3-06",
    "title": "X.509 Certificate Management & Private Key Generation",
    "titleFr": "Gestion des certificats X.509 & Génération de clés privées",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.1",
    "category": "Cryptography & PKI",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Generate an RSA 2048 private key and Certificate Signing Request (CSR) with openssl, and inspect certificate fields.",
    "goalFr": "Générer une clé privée RSA 2048 et une demande de signature CSR avec openssl, puis inspecter les champs.",
    "context": "A secure web portal requires a valid TLS certificate request containing SAN (Subject Alternative Names).",
    "contextFr": "Un portail web sécurisé exige une demande de signature CSR avec clé privée RSA dédiée.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Generate RSA private key and Certificate Signing Request (CSR)",
        "titleFr": "Générer la clé privée RSA et la demande CSR avec openssl",
        "instruction": "Run openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr.",
        "instructionFr": "Exécutez openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr.",
        "hint": "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
        "hintFr": "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
        "expectedCommands": [
          "openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr",
          "sudo openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/srv.key -out /etc/ssl/certs/srv.csr"
        ],
        "simulatedOutput": "Generating a 2048 bit RSA private key\nwriting new private key to '/etc/ssl/private/srv.key'\n-----\n[OK] CSR written to /etc/ssl/certs/srv.csr.",
        "explanation": "openssl req generates an unencrypted RSA private key (-nodes) and prepares a PKCS#10 CSR.",
        "explanationFr": "openssl req génère la clé RSA privée et produit la demande CSR (PKCS#10) à soumettre à l'autorité de certification."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect CSR contents and attributes with openssl req -text",
        "titleFr": "Inspecter les attributs de la CSR avec openssl req -text",
        "instruction": "Use openssl req -in /etc/ssl/certs/srv.csr -noout -text to view parsed fields.",
        "instructionFr": "Utilisez openssl req -in /etc/ssl/certs/srv.csr -noout -text pour examiner la CSR.",
        "hint": "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
        "hintFr": "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
        "expectedCommands": [
          "openssl req -in /etc/ssl/certs/srv.csr -noout -text",
          "openssl req -text -noout -in /etc/ssl/certs/srv.csr"
        ],
        "simulatedOutput": "Certificate Request:\n    Data:\n        Version: 1 (0x0)\n        Subject: CN = srv.example.com\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n                RSA Public-Key: (2048 bit)",
        "explanation": "openssl req -text decodes ASN.1 structures to verify Common Name, Organization, and Public Key parameters.",
        "explanationFr": "openssl req -text décode la structure ASN.1 pour contrôler le Common Name et la robustesse de la clé."
      }
    ]
  },
  {
    "id": "lab-lpic3-07",
    "title": "Block Device Encryption with LUKS2 & Cryptsetup",
    "titleFr": "Chiffrement de disque bloc avec LUKS2 & Cryptsetup",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.3",
    "category": "Data at Rest Encryption",
    "difficulty": "Advanced",
    "estimatedMinutes": 10,
    "goal": "Format a partition with LUKS2 using cryptsetup, open the encrypted mapping, and inspect cryptographic status.",
    "goalFr": "Formater une partition avec LUKS2 via cryptsetup, ouvrir le mapping chiffré et inspecter son statut.",
    "context": "A confidential database partition /dev/sdb1 must be fully encrypted at rest against disk theft.",
    "contextFr": "Une partition de base de données sensible (/dev/sdb1) doit être chiffrée avec LUKS2 pour prévenir tout vol physique.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Format partition with LUKS2 encryption",
        "titleFr": "Formater la partition avec le chiffrement LUKS2",
        "instruction": "Execute cryptsetup luksFormat --type luks2 /dev/sdb1.",
        "instructionFr": "Exécutez cryptsetup luksFormat --type luks2 /dev/sdb1.",
        "hint": "cryptsetup luksFormat --type luks2 /dev/sdb1",
        "hintFr": "cryptsetup luksFormat --type luks2 /dev/sdb1",
        "expectedCommands": [
          "cryptsetup luksFormat --type luks2 /dev/sdb1",
          "sudo cryptsetup luksFormat --type luks2 /dev/sdb1",
          "cryptsetup luksFormat /dev/sdb1",
          "sudo cryptsetup luksFormat /dev/sdb1"
        ],
        "simulatedOutput": "WARNING!\n========\nThis will overwrite data on /dev/sdb1 irrevocably.\nAre you sure? (Type 'yes' in capital letters): YES\nEnter passphrase for /dev/sdb1: \nVerify passphrase: \n[OK] LUKS2 header and keyslot 0 created successfully.",
        "explanation": "cryptsetup luksFormat initializes the on-disk LUKS2 header, sets PBKDF2/Argon2id keyslots, and formats metadata.",
        "explanationFr": "cryptsetup luksFormat installe l'en-tête LUKS2 et dérive la clé maîtresse à l'aide d'Argon2id."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Open encrypted LUKS container creating device mapper node",
        "titleFr": "Ouvrir le conteneur LUKS et créer le nœud device-mapper",
        "instruction": "Execute cryptsetup open /dev/sdb1 cryptdata.",
        "instructionFr": "Exécutez cryptsetup open /dev/sdb1 cryptdata.",
        "hint": "cryptsetup open /dev/sdb1 cryptdata",
        "hintFr": "cryptsetup open /dev/sdb1 cryptdata",
        "expectedCommands": [
          "cryptsetup open /dev/sdb1 cryptdata",
          "sudo cryptsetup open /dev/sdb1 cryptdata",
          "cryptsetup luksOpen /dev/sdb1 cryptdata",
          "sudo cryptsetup luksOpen /dev/sdb1 cryptdata"
        ],
        "simulatedOutput": "Enter passphrase for /dev/sdb1: \n[OK] Device mapper mapping created: /dev/mapper/cryptdata.",
        "explanation": "cryptsetup open unlocks the master volume key and creates an active dm-crypt virtual device.",
        "explanationFr": "cryptsetup open déchiffre la clé maîtresse et monte le périphérique virtuel déchiffré /dev/mapper/cryptdata."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect status and cipher parameters of active mapping",
        "titleFr": "Inspecter le statut et les algorithmes de chiffrement du mapping",
        "instruction": "Run cryptsetup status cryptdata.",
        "instructionFr": "Lancez cryptsetup status cryptdata.",
        "hint": "cryptsetup status cryptdata",
        "hintFr": "cryptsetup status cryptdata",
        "expectedCommands": [
          "cryptsetup status cryptdata",
          "sudo cryptsetup status cryptdata"
        ],
        "simulatedOutput": "/dev/mapper/cryptdata is active and is in use.\n  type:    LUKS2\n  cipher:  aes-xts-plain64\n  keysize: 512 bits\n  key location: keyring\n  device:  /dev/sdb1\n  sector size:  4096 bytes\n  mode:    read/write",
        "explanation": "cryptsetup status displays active cipher mode (AES-XTS), key length (512-bit), and underlying physical block device.",
        "explanationFr": "cryptsetup status confirme l'état opérationnel, l'algorithme (aes-xts) et la longueur de clé (512 bits)."
      }
    ]
  },
  {
    "id": "lab-lpic3-08",
    "title": "SELinux Policy Enforcement, Contexts & Booleans",
    "titleFr": "Application des politiques SELinux, Contextes & Booléens",
    "certification": "lpic-3",
    "topicNumber": 322,
    "objectiveId": "322.1",
    "category": "Mandatory Access Control (MAC)",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Check enforcement mode with getenforce, restore default filesystem security labels with restorecon, and toggle a boolean with setsebool.",
    "goalFr": "Contrôler le mode avec getenforce, restaurer les contextes de fichiers avec restorecon et basculer un booléen avec setsebool.",
    "context": "SELinux blocks web server network connections to backend database sockets. You must adjust contexts and policy booleans.",
    "contextFr": "SELinux bloque l'accès du serveur web aux connexions sortantes. Vous devez corriger les contextes et activer le booléen.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Query current SELinux operational mode",
        "titleFr": "Afficher le mode de fonctionnement courant de SELinux",
        "instruction": "Execute getenforce to check whether SELinux is Enforcing, Permissive, or Disabled.",
        "instructionFr": "Exécutez getenforce pour connaître le mode actif.",
        "hint": "getenforce",
        "hintFr": "getenforce",
        "expectedCommands": ["getenforce", "sudo getenforce", "sestatus"],
        "simulatedOutput": "Enforcing",
        "explanation": "getenforce reads /sys/fs/selinux/enforce. 'Enforcing' actively denies actions violating loaded TE (Type Enforcement) policies.",
        "explanationFr": "getenforce vérifie si les politiques sont strictement appliquées (Enforcing) ou seulement tracées (Permissive)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Restore default SELinux file contexts recursively on /var/www/html",
        "titleFr": "Restaurer les contextes de sécurité par défaut sur /var/www/html",
        "instruction": "Run restorecon with -Rv on /var/www/html.",
        "instructionFr": "Lancez restorecon avec -Rv sur /var/www/html pour rétablir les étiquettes légitimes.",
        "hint": "restorecon -Rv /var/www/html",
        "hintFr": "restorecon -Rv /var/www/html",
        "expectedCommands": [
          "restorecon -Rv /var/www/html",
          "sudo restorecon -Rv /var/www/html",
          "restorecon -v -R /var/www/html"
        ],
        "simulatedOutput": "Relabeled /var/www/html/index.php from unconfined_u:object_r:user_home_t:s0 to system_u:object_r:httpd_sys_content_t:s0",
        "explanation": "restorecon queries the file context specifications database (/etc/selinux/targeted/contexts/files/) and resets extended xattr labels.",
        "explanationFr": "restorecon réinitialise les étiquettes de sécurité de l'inode conformément aux règles de la politique ciblée."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Enable persistent boolean allowing web server network connections",
        "titleFr": "Activer le booléen permanent autorisant les connexions réseau du serveur web",
        "instruction": "Use setsebool with -P to permanently enable httpd_can_network_connect.",
        "instructionFr": "Utilisez setsebool avec -P pour activer durablement httpd_can_network_connect.",
        "hint": "setsebool -P httpd_can_network_connect on",
        "hintFr": "setsebool -P httpd_can_network_connect on",
        "expectedCommands": [
          "setsebool -P httpd_can_network_connect on",
          "setsebool -P httpd_can_network_connect 1",
          "sudo setsebool -P httpd_can_network_connect on",
          "sudo setsebool -P httpd_can_network_connect 1"
        ],
        "simulatedOutput": "[OK] Boolean httpd_can_network_connect set to true in runtime and persistent policy store.",
        "explanation": "The -P flag writes the boolean state into the binary policy store on disk, ensuring survival across reboots.",
        "explanationFr": "L'option -P inscrit l'état du booléen dans la politique compilée sur disque pour persister au redémarrage."
      }
    ]
  },
  {
    "id": "lab-lpic3-09",
    "title": "Kernel Auditing Framework: Auditd Rules & Ausearch Analysis",
    "titleFr": "Cadre d'audit du noyau Linux : Règles Auditd & Analyse avec Ausearch",
    "certification": "lpic-3",
    "topicNumber": 323,
    "objectiveId": "323.1",
    "category": "System Auditing & Forensics",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Add a kernel file watch on /etc/shadow using auditctl, list loaded audit rules, and search audit logs with ausearch.",
    "goalFr": "Ajouter une surveillance noyau sur /etc/shadow avec auditctl, lister les règles et analyser les logs avec ausearch.",
    "context": "Compliance standards mandate real-time logging whenever password files are accessed or modified.",
    "contextFr": "Les normes de conformité exigent une traçabilité inviolable de tout accès ou modification de /etc/shadow.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Add kernel audit watch rule on /etc/shadow with key 'shadow_mod'",
        "titleFr": "Ajouter une règle de surveillance sur /etc/shadow avec la clé 'shadow_mod'",
        "instruction": "Execute auditctl to add a watch (-w /etc/shadow) on write and attribute changes (-p wa) with key (-k shadow_mod).",
        "instructionFr": "Exécutez auditctl pour surveiller -w /etc/shadow en écriture/attributs (-p wa) avec la clé -k shadow_mod.",
        "hint": "auditctl -w /etc/shadow -p wa -k shadow_mod",
        "hintFr": "auditctl -w /etc/shadow -p wa -k shadow_mod",
        "expectedCommands": [
          "auditctl -w /etc/shadow -p wa -k shadow_mod",
          "sudo auditctl -w /etc/shadow -p wa -k shadow_mod"
        ],
        "simulatedOutput": "[OK] Watch rule on /etc/shadow loaded into kernel audit subsystem.",
        "explanation": "auditctl injects filtering hooks directly into kernel system call dispatcher tables.",
        "explanationFr": "auditctl injecte la règle de capture directement dans les appels système du noyau Linux."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List all active kernel audit rules with auditctl -l",
        "titleFr": "Lister l'ensemble des règles d'audit actives avec auditctl -l",
        "instruction": "Run auditctl -l to verify installed rules.",
        "instructionFr": "Lancez auditctl -l pour contrôler les règles actuellement actives.",
        "hint": "auditctl -l",
        "hintFr": "auditctl -l",
        "expectedCommands": ["auditctl -l", "sudo auditctl -l"],
        "simulatedOutput": "-w /etc/shadow -p wa -k shadow_mod",
        "explanation": "auditctl -l queries the audit netlink socket to display kernel audit filters currently in memory.",
        "explanationFr": "auditctl -l interroge le sous-système netlink pour afficher les règles d'audit en mémoire."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Search audit logs for events tagged with key 'shadow_mod'",
        "titleFr": "Rechercher les événements d'audit enregistrés sous la clé 'shadow_mod'",
        "instruction": "Execute ausearch with -k shadow_mod to inspect recorded audit events.",
        "instructionFr": "Exécutez ausearch avec -k shadow_mod pour consulter les événements enregistrés.",
        "hint": "ausearch -k shadow_mod",
        "hintFr": "ausearch -k shadow_mod",
        "expectedCommands": [
          "ausearch -k shadow_mod",
          "sudo ausearch -k shadow_mod",
          "ausearch -k shadow_mod --raw"
        ],
        "simulatedOutput": "----\ntime->Wed Sep 16 14:48:12 2026\ntype=SYSCALL msg=audit(1789570092.102:402): arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c a1=7ffd9421 a2=2 a3=0 items=1 ppid=1201 pid=2910 auid=1000 uid=0 gid=0 euid=0 exe=\"/usr/sbin/passwd\" key=\"shadow_mod\"",
        "explanation": "ausearch parses /var/log/audit/audit.log, correlating multi-line SYSCALL, CWD, and PATH records by event ID.",
        "explanationFr": "ausearch décode les enregistrements de /var/log/audit/audit.log en reliant l'UID réel et le binaire exécuté."
      }
    ]
  },
  {
    "id": "lab-lpic3-10",
    "title": "StrongSwan IKEv2 IPsec VPN Tunnel Management",
    "titleFr": "Gestion d'un tunnel VPN IPsec IKEv2 avec StrongSwan",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.1",
    "category": "VPN & Encrypted Channels",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Load strongSwan configuration with swanctl --load-all, initiate child SA tunnel, and verify established Security Associations with swanctl --list-sas.",
    "goalFr": "Charger la configuration strongSwan avec swanctl --load-all, initier le tunnel et vérifier les associations de sécurité (SA).",
    "context": "A site-to-site IPsec tunnel links our headquarters to a cloud datacenter. You must control the tunnel using modern swanctl.",
    "contextFr": "Un tunnel IPsec relie deux sites. Vous devez piloter et vérifier l'association de sécurité IKEv2 avec swanctl.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Load all swanctl connections and credentials into charon daemon",
        "titleFr": "Charger les connexions et identifiants swanctl dans charon",
        "instruction": "Execute swanctl with --load-all.",
        "instructionFr": "Exécutez swanctl avec --load-all pour recharger la configuration.",
        "hint": "swanctl --load-all",
        "hintFr": "swanctl --load-all",
        "expectedCommands": ["swanctl --load-all", "sudo swanctl --load-all", "swanctl -q"],
        "simulatedOutput": "loaded pool 'ipv4' (0 pools loaded)\nloaded connection 'net-to-net'\nsuccessfully loaded 1 connections, 0 pools, 1 authorities, 1 secrets",
        "explanation": "swanctl --load-all reads /etc/swanctl/swanctl.conf and communicates with the charon daemon via vici interface.",
        "explanationFr": "swanctl communique avec charon via le protocole VICI pour charger connexions et clés pré-partagées."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Initiate child IPsec Security Association for connection 'net-to-net'",
        "titleFr": "Initier l'association de sécurité IPsec enfant pour 'net-to-net'",
        "instruction": "Run swanctl --initiate --child net-to-net.",
        "instructionFr": "Lancez swanctl --initiate --child net-to-net.",
        "hint": "swanctl --initiate --child net-to-net",
        "hintFr": "swanctl --initiate --child net-to-net",
        "expectedCommands": [
          "swanctl --initiate --child net-to-net",
          "sudo swanctl --initiate --child net-to-net",
          "swanctl -i -c net-to-net"
        ],
        "simulatedOutput": "[IKE] initiating IKE_SA net-to-net[1] to 198.51.100.1\n[IKE] established IKE_SA net-to-net[1] between 203.0.113.2...198.51.100.1\n[IKE] IKE_SA net-to-net[1] state change: CONNECTING => ESTABLISHED\n[CHILD_SA] child 'net-to-net' established",
        "explanation": "swanctl --initiate performs IKEv2 Diffie-Hellman key exchange and installs kernel XFRM IPsec states.",
        "explanationFr": "swanctl effectue l'échange de clés IKEv2 et insère les règles de chiffrement XFRM dans le noyau."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "List established Security Associations (SAs) with swanctl --list-sas",
        "titleFr": "Lister les associations de sécurité (SA) actives avec swanctl --list-sas",
        "instruction": "Execute swanctl --list-sas to verify active encryption and lifetime.",
        "instructionFr": "Exécutez swanctl --list-sas pour vérifier le tunnel et les compteurs d'octets.",
        "hint": "swanctl --list-sas",
        "hintFr": "swanctl --list-sas",
        "expectedCommands": ["swanctl --list-sas", "sudo swanctl --list-sas", "swanctl -l"],
        "simulatedOutput": "net-to-net: #1, ESTABLISHED, IKEv2, 7a82b9e102_i* 99fa021cb8_r\n  local  '203.0.113.2' @ 203.0.113.2[500]\n  remote '198.51.100.1' @ 198.51.100.1[500]\n  AES_CBC_256/HMAC_SHA2_256_128/PRF_HMAC_SHA2_256/MODP_2048\n  net-to-net: #1, reqid 1, INSTALLED, TUNNEL, ESP:AES_GCM_16_256\n    installed 12s ago, rekeying in 3588s\n    in  c1092ab8,    840 bytes,    10 pkts\n    out c2098ba1,    840 bytes,    10 pkts",
        "explanation": "swanctl --list-sas outputs negotiated crypto algorithms, ESP encapsulation mode, and transmission statistics.",
        "explanationFr": "swanctl --list-sas expose les algorithmes négociés (AES-GCM), le mode tunnel et le volume de paquets chiffrés."
      }
    ]
  },

  # --- EXAM 305: Virtualization & Containerization ---
  {
    "id": "lab-lpic3-11",
    "title": "KVM Hypervisor Hardware Virtualization & Module Verification",
    "titleFr": "Hyperviseur KVM : Virtualisation matérielle & Modules noyau",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.1",
    "category": "KVM Virtualization",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Verify Intel VT-x/AMD-V hardware virtualization CPU extensions with kvm-ok or lscpu, and inspect loaded KVM kernel modules.",
    "goalFr": "Vérifier le support VT-x/AMD-V du processeur avec kvm-ok ou lscpu et inspecter les modules noyau KVM.",
    "context": "Before deploying enterprise virtual machines, you must certify that the hardware supports accelerated KVM virtualization.",
    "contextFr": "Avant d'installer des machines virtuelles, vous devez valider la compatibilité des extensions processeur.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check hardware virtualization capability using kvm-ok (or lscpu)",
        "titleFr": "Tester le support matériel de la virtualisation avec kvm-ok (ou lscpu)",
        "instruction": "Run kvm-ok to test if hardware virtualization is supported and enabled in BIOS/UEFI.",
        "instructionFr": "Lancez kvm-ok pour vérifier si la virtualisation matérielle est disponible et activée.",
        "hint": "kvm-ok",
        "hintFr": "kvm-ok",
        "expectedCommands": [
          "kvm-ok",
          "sudo kvm-ok",
          "lscpu | grep -i Virtualization",
          "egrep -c '(vmx|svm)' /proc/cpuinfo"
        ],
        "simulatedOutput": "INFO: /dev/kvm exists\nKVM acceleration can be used",
        "explanation": "kvm-ok probes the MSR registers for VMX (Intel) or SVM (AMD) instruction set extensions.",
        "explanationFr": "kvm-ok interroge les drapeaux processeur pour confirmer la présence de VMX (Intel) ou SVM (AMD)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Confirm loaded KVM kernel accelerator drivers with lsmod",
        "titleFr": "Confirmer les modules accélérateurs KVM chargés avec lsmod",
        "instruction": "Execute lsmod filtering for 'kvm'.",
        "instructionFr": "Exécutez lsmod en filtrant sur 'kvm'.",
        "hint": "lsmod | grep kvm",
        "hintFr": "lsmod | grep kvm",
        "expectedCommands": ["lsmod | grep kvm", "sudo lsmod | grep kvm"],
        "simulatedOutput": "kvm_intel             385024  0\nkvm                  1105920  1 kvm_intel\nirqbypass              16384  1 kvm",
        "explanation": "kvm and kvm_intel/kvm_amd provide the kernel execution engine that transforms the Linux kernel into a Type-1 hypervisor.",
        "explanationFr": "kvm_intel/kvm_amd exposent le pilote /dev/kvm permettant l'exécution native des VM sur le CPU."
      }
    ]
  },
  {
    "id": "lab-lpic3-12",
    "title": "Libvirt VM Management & Live Snapshots with Virsh",
    "titleFr": "Gestion des VM Libvirt & Snapshots avec Virsh",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.2",
    "category": "KVM Virtualization",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "List virtual machines with virsh list --all, start a guest VM, create a point-in-time snapshot, and inspect domain info.",
    "goalFr": "Lister les VM avec virsh list --all, démarrer une VM, créer un snapshot et inspecter ses ressources.",
    "context": "A production database guest 'db-prod' must be backed up via a consistent storage snapshot before applying patches.",
    "contextFr": "Une machine virtuelle 'db-prod' doit faire l'objet d'un snapshot avant une mise à jour système.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "List all registered libvirt domains (running and stopped)",
        "titleFr": "Lister tous les domaines libvirt enregistrés avec virsh list --all",
        "instruction": "Execute virsh list --all to view domain states.",
        "instructionFr": "Exécutez virsh list --all pour afficher l'ensemble des machines virtuelles.",
        "hint": "virsh list --all",
        "hintFr": "virsh list --all",
        "expectedCommands": ["virsh list --all", "sudo virsh list --all"],
        "simulatedOutput": " Id   Name      State\n-------------------------\n 1    web-app   running\n -    db-prod   shut off",
        "explanation": "virsh communicates with libvirtd daemon via RPC to control QEMU/KVM virtual machine instances.",
        "explanationFr": "virsh communique avec le démon libvirtd pour superviser et piloter le cycle de vie des invités QEMU/KVM."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Start guest domain db-prod with virsh",
        "titleFr": "Démarrer le domaine invité db-prod avec virsh",
        "instruction": "Run virsh start db-prod.",
        "instructionFr": "Lancez virsh start db-prod pour démarrer la machine.",
        "hint": "virsh start db-prod",
        "hintFr": "virsh start db-prod",
        "expectedCommands": ["virsh start db-prod", "sudo virsh start db-prod"],
        "simulatedOutput": "Domain 'db-prod' started",
        "explanation": "virsh start launches the QEMU process with CPU, disk, memory, and network parameters configured in domain XML.",
        "explanationFr": "virsh start instancie le processus QEMU en attachant les ressources allouées dans la définition XML."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Create a live snapshot for db-prod with snapshot-create-as",
        "titleFr": "Créer un snapshot pour db-prod avec snapshot-create-as",
        "instruction": "Execute virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'.",
        "instructionFr": "Exécutez virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'.",
        "hint": "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
        "hintFr": "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
        "expectedCommands": [
          "virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
          "virsh snapshot-create-as db-prod snap_prepatch 'Pre-patch backup snapshot'",
          "sudo virsh snapshot-create-as db-prod snap_prepatch \"Pre-patch backup snapshot\"",
          "virsh snapshot-create-as db-prod snap_prepatch"
        ],
        "simulatedOutput": "Domain snapshot snap_prepatch created",
        "explanation": "virsh snapshot-create-as captures disk delta state (qcow2 internal or external overlays) for point-in-time recovery.",
        "explanationFr": "snapshot-create-as fige l'état de la machine dans l'image qcow2 pour permettre un retour arrière instantané."
      }
    ]
  },
  {
    "id": "lab-lpic3-13",
    "title": "Rootless Container Lifecycle Management with Podman",
    "titleFr": "Cycle de vie des conteneurs Rootless avec Podman",
    "certification": "lpic-3",
    "topicNumber": 352,
    "objectiveId": "352.1",
    "category": "Container Management",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Run a rootless nginx container on port 8080 with podman run, check container status with podman ps, and inspect container logs.",
    "goalFr": "Lancer un conteneur rootless nginx sur le port 8080, vérifier avec podman ps et afficher les logs.",
    "context": "Modern enterprise environments ban root-owned container daemons. You must manage rootless containers via Podman.",
    "contextFr": "Les conteneurs doivent s'exécuter sans privilèges root. Vous devez piloter un conteneur avec Podman.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Run a detached rootless Nginx container publishing port 8080",
        "titleFr": "Démarrer un conteneur Nginx rootless détaché publiant le port 8080",
        "instruction": "Run podman run -d --name web -p 8080:80 nginx:alpine.",
        "instructionFr": "Lancez podman run -d --name web -p 8080:80 nginx:alpine.",
        "hint": "podman run -d --name web -p 8080:80 nginx:alpine",
        "hintFr": "podman run -d --name web -p 8080:80 nginx:alpine",
        "expectedCommands": [
          "podman run -d --name web -p 8080:80 nginx:alpine",
          "podman run -d --name web -p 8080:80 docker.io/library/nginx:alpine"
        ],
        "simulatedOutput": "Trying to pull docker.io/library/nginx:alpine...\nGetting image source signatures\nCopying blob 43c622d120f4 done\nCopying config 9fa1c20e10 done\nWriting manifest to image destination\n84a102bc4910298a0912f90123b09210a48b9102c918a2048f0291ba019283f1",
        "explanation": "Podman uses user namespaces (subuid/subgid) and slirp4netns/pasta to run fully unprivileged rootless containers without a daemon.",
        "explanationFr": "Podman s'exécute sans démon centralisé via les namespaces utilisateurs du noyau (subuid/subgid)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "List running containers with podman ps",
        "titleFr": "Lister les conteneurs actifs avec podman ps",
        "instruction": "Execute podman ps to verify port mappings and uptime.",
        "instructionFr": "Exécutez podman ps pour contrôler les ports publiés et l'état du conteneur.",
        "hint": "podman ps",
        "hintFr": "podman ps",
        "expectedCommands": ["podman ps", "podman container ls"],
        "simulatedOutput": "CONTAINER ID  IMAGE                           COMMAND               CREATED        STATUS        PORTS                 NAMES\n84a102bc4910  docker.io/library/nginx:alpine  nginx -g 'daemon o... 10 seconds ago Up 10 seconds 0.0.0.0:8080->80/tcp  web",
        "explanation": "podman ps queries the local sqlite/storage graph to report active container cgroups and network forwardings.",
        "explanationFr": "podman ps affiche l'identifiant, l'image source, les ports mappés et le statut du conteneur."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect container stdout logs with podman logs",
        "titleFr": "Afficher les logs standard du conteneur avec podman logs",
        "instruction": "Run podman logs web to check server initialization.",
        "instructionFr": "Lancez podman logs web pour visualiser les logs d'initialisation du serveur web.",
        "hint": "podman logs web",
        "hintFr": "podman logs web",
        "expectedCommands": ["podman logs web"],
        "simulatedOutput": "/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration\n/docker-entrypoint.sh: Configuration complete; ready for start up\n2026/09/16 14:55:00 [notice] 1#1: using the \"epoll\" event method\n2026/09/16 14:55:00 [notice] 1#1: nginx/1.25.5\n2026/09/16 14:55:00 [notice] 1#1: start worker processes",
        "explanation": "podman logs retrieves console output redirected through the crun/runc log driver.",
        "explanationFr": "podman logs extrait les flux stdout/stderr enregistrés par le moteur d'exécution crun/runc."
      }
    ]
  },
  {
    "id": "lab-lpic3-14",
    "title": "Cloud-Init Instance Bootstrapping & Metadata Validation",
    "titleFr": "Initialisation d'instances Cloud-Init & Audit des métadonnées",
    "certification": "lpic-3",
    "topicNumber": 353,
    "objectiveId": "353.2",
    "category": "Cloud Orchestration",
    "difficulty": "Intermediate",
    "estimatedMinutes": 8,
    "goal": "Verify cloud-init execution status with cloud-init status, query instance metadata with cloud-init query, and inspect output logs.",
    "goalFr": "Contrôler le statut avec cloud-init status, interroger les métadonnées avec cloud-init query et inspecter les logs d'exécution.",
    "context": "A newly provisioned cloud instance executes user-data scripts. You must verify that bootstrapping finalized successfully.",
    "contextFr": "Une instance cloud exécute un script user-data. Vous devez vous assurer que le provisioning s'est achevé sans erreur.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Check cloud-init completion status",
        "titleFr": "Vérifier le statut d'achèvement de cloud-init",
        "instruction": "Execute cloud-init status to check if all bootstrap modules completed.",
        "instructionFr": "Exécutez cloud-init status pour vérifier la fin de l'initialisation.",
        "hint": "cloud-init status",
        "hintFr": "cloud-init status",
        "expectedCommands": [
          "cloud-init status",
          "cloud-init status --wait",
          "sudo cloud-init status"
        ],
        "simulatedOutput": "status: done",
        "explanation": "cloud-init status confirms that generator, network, config, and final stage execution phases succeeded.",
        "explanationFr": "cloud-init status confirme le succès des différentes étapes (local, network, config, final)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query cloud instance ID using cloud-init query",
        "titleFr": "Interroger l'identifiant d'instance avec cloud-init query",
        "instruction": "Run cloud-init query instance_id.",
        "instructionFr": "Lancez cloud-init query instance_id pour extraire l'ID fourni par le fournisseur cloud.",
        "hint": "cloud-init query instance_id",
        "hintFr": "cloud-init query instance_id",
        "expectedCommands": [
          "cloud-init query instance_id",
          "cloud-init query ds.meta_data.instance_id"
        ],
        "simulatedOutput": "i-09f18a204b12",
        "explanation": "cloud-init query reads normalized metadata from the active datasource cache (/run/cloud-init/instance-data.json).",
        "explanationFr": "cloud-init query extrait les attributs normalisés depuis le cache de la datasource."
      }
    ]
  },
  {
    "id": "lab-lpic3-15",
    "title": "Kubernetes Workload Rolling Updates & Inspection with Kubectl",
    "titleFr": "Mises à jour progressives (Rolling Update) Kubernetes avec Kubectl",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.1",
    "category": "Kubernetes Clusters",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "List cluster nodes with kubectl get nodes, inspect pods, trigger a zero-downtime rolling restart, and track rollout status.",
    "goalFr": "Lister les nœuds du cluster avec kubectl get nodes, redémarrer un déploiement et suivre l'avancement du rollout.",
    "context": "A containerized microservice deployment 'webapp' must be redeployed with zero downtime across the cluster.",
    "contextFr": "Le déploiement 'webapp' doit être redémarré en rolling update sans interruption de service.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect cluster node status with kubectl",
        "titleFr": "Inspecter l'état des nœuds du cluster avec kubectl",
        "instruction": "Execute kubectl get nodes to verify node readiness.",
        "instructionFr": "Exécutez kubectl get nodes pour vérifier l'état des nœuds.",
        "hint": "kubectl get nodes",
        "hintFr": "kubectl get nodes",
        "expectedCommands": ["kubectl get nodes", "kubectl get no"],
        "simulatedOutput": "NAME       STATUS   ROLES           AGE   VERSION\nk8s-cp-1   Ready    control-plane   45d   v1.30.2\nk8s-wk-1   Ready    <none>          45d   v1.30.2\nk8s-wk-2   Ready    <none>          45d   v1.30.2",
        "explanation": "kubectl get nodes contacts the kube-apiserver and confirms all node kubelets report Healthy/Ready state.",
        "explanationFr": "kubectl get nodes interroge le serveur d'API pour s'assurer que les agents kubelet sont opérationnels."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Trigger a rolling restart of deployment/webapp",
        "titleFr": "Déclencher un redémarrage progressif du déploiement webapp",
        "instruction": "Run kubectl rollout restart deployment/webapp.",
        "instructionFr": "Lancez kubectl rollout restart deployment/webapp.",
        "hint": "kubectl rollout restart deployment/webapp",
        "hintFr": "kubectl rollout restart deployment/webapp",
        "expectedCommands": [
          "kubectl rollout restart deployment/webapp",
          "kubectl rollout restart deploy/webapp",
          "kubectl rollout restart deployment webapp"
        ],
        "simulatedOutput": "deployment.apps/webapp restarted",
        "explanation": "kubectl rollout restart injects a timestamp annotation in pod template metadata, triggering a rolling update.",
        "explanationFr": "kubectl rollout restart force la recréation ordonnée des pods via le contrôleur de déploiement."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Monitor rollout progression until all pods are replaced",
        "titleFr": "Suivre la progression du déploiement avec rollout status",
        "instruction": "Execute kubectl rollout status deployment/webapp.",
        "instructionFr": "Exécutez kubectl rollout status deployment/webapp pour attendre la stabilisation.",
        "hint": "kubectl rollout status deployment/webapp",
        "hintFr": "kubectl rollout status deployment/webapp",
        "expectedCommands": [
          "kubectl rollout status deployment/webapp",
          "kubectl rollout status deploy/webapp"
        ],
        "simulatedOutput": "Waiting for deployment \"webapp\" rollout to finish: 1 out of 3 new replicas have been updated...\nWaiting for deployment \"webapp\" rollout to finish: 2 out of 3 new replicas have been updated...\nWaiting for deployment \"webapp\" rollout to finish: 1 old replicas are pending termination...\ndeployment \"webapp\" successfully rolled out",
        "explanation": "rollout status watches replica sets ensuring readiness probes pass before terminating old pods.",
        "explanationFr": "rollout status surveille le remplacement des réplicas et valide les sondes de disponibilité (readiness probes)."
      }
    ]
  },

  # --- EXAM 306: High Availability & Cluster Storage ---
  {
    "id": "lab-lpic3-16",
    "title": "Pacemaker & Corosync High Availability Cluster Health Inspection",
    "titleFr": "Contrôle de santé d'un cluster Pacemaker & Corosync haute disponibilité",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.1",
    "category": "HA Clustering",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Inspect cluster quorum with corosync-cfgtool -s, check resource status with crm_mon -1, and verify pcs status.",
    "goalFr": "Vérifier le quorum Corosync avec corosync-cfgtool -s et inspecter l'état des ressources avec crm_mon -1.",
    "context": "A 2-node HA cluster manages database failover. You must audit cluster quorum, messaging rings, and active resources.",
    "contextFr": "Un cluster 2 nœuds gère le basculement d'une base de données. Vous devez auditer le quorum et les ressources.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Verify Corosync communication ring health with corosync-cfgtool",
        "titleFr": "Vérifier l'anneau de communication Corosync avec corosync-cfgtool",
        "instruction": "Execute corosync-cfgtool -s to verify messaging link status.",
        "instructionFr": "Exécutez corosync-cfgtool -s pour valider l'anneau de communication réseau.",
        "hint": "corosync-cfgtool -s",
        "hintFr": "corosync-cfgtool -s",
        "expectedCommands": [
          "corosync-cfgtool -s",
          "sudo corosync-cfgtool -s"
        ],
        "simulatedOutput": "Printing ring status.\nLocal node ID 1\nRING ID 0\n\tid\t= 192.168.10.1\n\tstatus\t= ring 0 active with no faults",
        "explanation": "corosync-cfgtool queries the Kronosnet/Totem communication engine to verify heartbeat ring continuity.",
        "explanationFr": "corosync-cfgtool valide l'intégrité de l'anneau de heartbeat du protocole Totem entre les nœuds."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query one-shot cluster status with crm_mon -1",
        "titleFr": "Afficher l'état du cluster Pacemaker avec crm_mon -1",
        "instruction": "Run crm_mon -1 to output node membership and resource allocation snapshot.",
        "instructionFr": "Lancez crm_mon -1 pour afficher un cliché instantané des nœuds et des ressources.",
        "hint": "crm_mon -1",
        "hintFr": "crm_mon -1",
        "expectedCommands": [
          "crm_mon -1",
          "sudo crm_mon -1",
          "pcs status",
          "sudo pcs status"
        ],
        "simulatedOutput": "Cluster Summary:\n  * Stack: corosync\n  * Current DC: node1 (version 2.1.6-1) - partition with quorum\n  * Last updated: Wed Sep 16 15:02:11 2026\n  * 2 nodes configured\n  * 2 resource instances configured\n\nNode List:\n  * Online: [ node1 node2 ]\n\nFull List of Resources:\n  * VirtualIP\t(ocf::heartbeat:IPaddr2):\tStarted node1\n  * DatabaseService\t(systemd:mariadb):\tStarted node1",
        "explanation": "crm_mon -1 communicates with Pacemaker cib/crmd daemons, reporting the Designated Coordinator (DC) and active resource nodes.",
        "explanationFr": "crm_mon -1 affiche l'état global : nœud coordinateur (DC), quorum et nœuds hébergeant les ressources."
      }
    ]
  },
  {
    "id": "lab-lpic3-17",
    "title": "Pacemaker Virtual IP Resource & Colocation Constraints",
    "titleFr": "Ressource IP Virtuelle Pacemaker & Contraintes de colocalisation",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.3",
    "category": "HA Clustering",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Create a VirtualIP resource using pcs, enforce colocation constraint with database service, and verify active constraints.",
    "goalFr": "Créer une ressource IP Virtuelle avec pcs, forcer la colocalisation avec la base de données et vérifier les contraintes.",
    "context": "The virtual service IP 192.168.1.200 must strictly reside on the exact same cluster node as the database daemon.",
    "contextFr": "L'adresse IP virtuelle 192.168.1.200 doit obligatoirement résider sur le même nœud que le service de base de données.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Create VirtualIP resource with OCF IPaddr2 resource agent",
        "titleFr": "Créer la ressource VirtualIP avec l'agent OCF IPaddr2",
        "instruction": "Execute pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s.",
        "instructionFr": "Exécutez pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s.",
        "hint": "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
        "hintFr": "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
        "expectedCommands": [
          "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
          "sudo pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24 op monitor interval=10s",
          "pcs resource create VirtualIP ocf:heartbeat:IPaddr2 ip=192.168.1.200 cidr_netmask=24"
        ],
        "simulatedOutput": "[OK] Resource 'VirtualIP' created and registered in cluster CIB.",
        "explanation": "OCF (Open Cluster Framework) agents provide robust start, stop, and recurrent health monitoring operations.",
        "explanationFr": "Les agents OCF standardisent les opérations de démarrage, d'arrêt et de surveillance périodique."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Add strict colocation constraint between DatabaseService and VirtualIP",
        "titleFr": "Ajouter une contrainte de colocalisation stricte entre DatabaseService et VirtualIP",
        "instruction": "Execute pcs constraint colocation add DatabaseService with VirtualIP INFINITY.",
        "instructionFr": "Exécutez pcs constraint colocation add DatabaseService with VirtualIP INFINITY.",
        "hint": "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
        "hintFr": "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
        "expectedCommands": [
          "pcs constraint colocation add DatabaseService with VirtualIP INFINITY",
          "sudo pcs constraint colocation add DatabaseService with VirtualIP INFINITY"
        ],
        "simulatedOutput": "[OK] Colocation constraint added with score INFINITY.",
        "explanation": "Score INFINITY mandates that DatabaseService can only run on the node currently hosting VirtualIP.",
        "explanationFr": "Le score INFINITY impose au gestionnaire de placer la ressource sur le même nœud physique."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Display all configured cluster constraints with pcs constraint show",
        "titleFr": "Afficher les contraintes du cluster avec pcs constraint show",
        "instruction": "Run pcs constraint show to verify active ordering and colocation rules.",
        "instructionFr": "Lancez pcs constraint show pour vérifier les règles actives.",
        "hint": "pcs constraint show",
        "hintFr": "pcs constraint show",
        "expectedCommands": ["pcs constraint show", "sudo pcs constraint show", "pcs constraint"],
        "simulatedOutput": "Location Constraints:\nOrdering Constraints:\nColocation Constraints:\n  DatabaseService with VirtualIP (score:INFINITY)",
        "explanation": "pcs constraint show parses the CIB XML to list location, ordering, and colocation rules governing scheduler placement.",
        "explanationFr": "pcs constraint show liste les règles gouvernant le placement et l'ordre de démarrage des services."
      }
    ]
  },
  {
    "id": "lab-lpic3-18",
    "title": "DRBD 9 Replicated Block Storage Synchronization & Promotion",
    "titleFr": "Synchronisation & Promotion du stockage répliqué DRBD 9",
    "certification": "lpic-3",
    "topicNumber": 362,
    "objectiveId": "362.1",
    "category": "Replicated Storage",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Check DRBD resource replication state with drbdadm status, promote resource r0 to Primary, and inspect /proc/drbd.",
    "goalFr": "Consulter l'état de réplication DRBD avec drbdadm status, promouvoir r0 en Primaire et inspecter /proc/drbd.",
    "context": "A shared storage block device is synchronized over 10GbE network using DRBD 9. You must verify synchronous replication (Protocol C).",
    "contextFr": "Un périphérique bloc est répliqué sur le réseau avec DRBD 9. Vous devez vérifier la synchronisation et promouvoir le nœud.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Inspect replication status for DRBD resource r0",
        "titleFr": "Consulter l'état de réplication de la ressource DRBD r0",
        "instruction": "Execute drbdadm status r0.",
        "instructionFr": "Exécutez drbdadm status r0.",
        "hint": "drbdadm status r0",
        "hintFr": "drbdadm status r0",
        "expectedCommands": [
          "drbdadm status r0",
          "sudo drbdadm status r0",
          "drbdadm status"
        ],
        "simulatedOutput": "r0 role:Secondary\n  disk:UpToDate\n  node2 role:Secondary\n    peer-disk:UpToDate",
        "explanation": "drbdadm status shows local and peer roles (Primary/Secondary) and block synchronization flags (UpToDate).",
        "explanationFr": "drbdadm status expose les rôles de chaque nœud et certifie la cohérence des blocs (UpToDate)."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Promote local node to Primary role for resource r0",
        "titleFr": "Promouvoir le nœud local au rôle Primaire pour r0",
        "instruction": "Run drbdadm primary r0.",
        "instructionFr": "Lancez drbdadm primary r0 pour autoriser le montage en lecture-écriture.",
        "hint": "drbdadm primary r0",
        "hintFr": "drbdadm primary r0",
        "expectedCommands": [
          "drbdadm primary r0",
          "sudo drbdadm primary r0"
        ],
        "simulatedOutput": "[OK] Resource 'r0' promoted to Primary role on local node.",
        "explanation": "In single-primary mode, only the Primary node can open the /dev/drbdX block device for read/write mounting.",
        "explanationFr": "Le passage en rôle Primaire autorise l'accès en lecture/écriture au disque bloc /dev/drbd0."
      }
    ]
  },
  {
    "id": "lab-lpic3-19",
    "title": "Ceph Distributed Storage Cluster Health & OSD Pool Management",
    "titleFr": "Cluster de stockage distribué Ceph & Gestion des pools OSD",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.1",
    "category": "Distributed Storage",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Query Ceph cluster health with ceph health detail, list OSD status with ceph osd status, and inspect pool capacity with ceph df.",
    "goalFr": "Consulter l'état de santé Ceph avec ceph health detail, vérifier les OSD avec ceph osd status et afficher la capacité avec ceph df.",
    "context": "An enterprise Ceph cluster provides RADOS block devices (RBD). You must inspect cluster placement groups and daemon availability.",
    "contextFr": "Un cluster Ceph héberge les volumes de virtualisation. Vous devez vérifier l'état des OSD et des groupes de placement (PG).",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Query detailed cluster health with ceph health detail",
        "titleFr": "Consulter l'état de santé détaillé du cluster Ceph",
        "instruction": "Execute ceph health detail.",
        "instructionFr": "Exécutez ceph health detail pour vérifier les alertes du cluster.",
        "hint": "ceph health detail",
        "hintFr": "ceph health detail",
        "expectedCommands": [
          "ceph health detail",
          "sudo ceph health detail",
          "ceph status",
          "ceph -s"
        ],
        "simulatedOutput": "HEALTH_OK",
        "explanation": "ceph health detail contacts Ceph Monitors (MONs) to verify placement groups (PGs), OSD heartbeats, and crush rules.",
        "explanationFr": "ceph health detail contacte les MONs pour certifier que tous les PGs sont 'active+clean'."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Inspect OSD daemon operational states with ceph osd status",
        "titleFr": "Vérifier le statut des démons OSD avec ceph osd status",
        "instruction": "Run ceph osd status to view OSDs, weights, and latency.",
        "instructionFr": "Lancez ceph osd status pour auditer les disques de stockage OSD.",
        "hint": "ceph osd status",
        "hintFr": "ceph osd status",
        "expectedCommands": ["ceph osd status", "sudo ceph osd status", "ceph osd tree"],
        "simulatedOutput": "+----+---------------+-------+-------+--------+---------+--------+---------+-----------+\n| id |     host      |  used | avail | wr ops | wr data | rd ops | rd data |   state   |\n+----+---------------+-------+-------+--------+---------+--------+---------+-----------+\n| 0  | ceph-node01   | 45.2G |  954G |    12  |   412k  |    42  |  1.2M   | exists,up |\n| 1  | ceph-node02   | 45.1G |  954G |    12  |   412k  |    38  |  1.1M   | exists,up |\n| 2  | ceph-node03   | 45.3G |  954G |    12  |   412k  |    40  |  1.1M   | exists,up |\n+----+---------------+-------+-------+--------+---------+--------+---------+-----------+",
        "explanation": "ceph osd status displays which storage daemons are 'up' (running) and 'in' (participating in CRUSH map placement).",
        "explanationFr": "ceph osd status confirme que tous les disques sont 'up' et intégrés dans la carte de distribution CRUSH."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Inspect storage pool utilization with ceph df",
        "titleFr": "Inspecter l'occupation des pools de stockage avec ceph df",
        "instruction": "Execute ceph df to display raw and pool-level capacity.",
        "instructionFr": "Exécutez ceph df pour afficher l'espace disque disponible et alloué.",
        "hint": "ceph df",
        "hintFr": "ceph df",
        "expectedCommands": ["ceph df", "sudo ceph df"],
        "simulatedOutput": "RAW STORAGE:\n    CLASS     SIZE        AVAIL       USED        RAW USED     %RAW USED\n    hdd       2.8 TiB     2.7 TiB     135 GiB      135 GiB          4.70\n    TOTAL     2.8 TiB     2.7 TiB     135 GiB      135 GiB          4.70\n\nPOOLS:\n    POOL       ID     STORED      OBJECTS     USED        %USED     MAX AVAIL\n    rbd_data    1     45 GiB       11520      135 GiB      1.57       880 GiB",
        "explanation": "ceph df calculates total raw bytes vs usable pool space factoring in 3x replication factor overhead.",
        "explanationFr": "ceph df décompte l'espace brut et utile en intégrant le facteur de réplication triple (3x)."
      }
    ]
  },
  {
    "id": "lab-lpic3-20",
    "title": "HAProxy High Availability Load Balancer & Socket Runtime Control",
    "titleFr": "Répartiteur de charge HAProxy & Contrôle dynamique par socket UNIX",
    "certification": "lpic-3",
    "topicNumber": 364,
    "objectiveId": "364.1",
    "category": "Load Balancing",
    "difficulty": "Advanced",
    "estimatedMinutes": 8,
    "goal": "Test HAProxy configuration syntax with haproxy -c, interact with stats socket using socat, and disable an upstream server for maintenance.",
    "goalFr": "Tester la configuration HAProxy avec haproxy -c, interroger le socket d'administration avec socat et drainer un serveur pour maintenance.",
    "context": "Backend server srv2 must be taken down for OS upgrades. You must use the HAProxy runtime socket to drain traffic without restarting HAProxy.",
    "contextFr": "Le serveur srv2 doit subir une maintenance. Vous devez drainer son trafic via le socket d'administration sans coupure.",
    "steps": [
      {
        "id": "step-1",
        "stepNumber": 1,
        "title": "Validate HAProxy configuration file syntax",
        "titleFr": "Valider la syntaxe du fichier de configuration HAProxy",
        "instruction": "Run haproxy -c -f /etc/haproxy/haproxy.cfg to test syntax.",
        "instructionFr": "Lancez haproxy -c -f /etc/haproxy/haproxy.cfg pour valider le fichier.",
        "hint": "haproxy -c -f /etc/haproxy/haproxy.cfg",
        "hintFr": "haproxy -c -f /etc/haproxy/haproxy.cfg",
        "expectedCommands": [
          "haproxy -c -f /etc/haproxy/haproxy.cfg",
          "sudo haproxy -c -f /etc/haproxy/haproxy.cfg"
        ],
        "simulatedOutput": "Configuration file is valid",
        "explanation": "haproxy -c parses frontends, backends, health checks, and ACL rules to ensure zero syntax errors before reload.",
        "explanationFr": "haproxy -c teste la cohérence des frontends, backends et directives ACL."
      },
      {
        "id": "step-2",
        "stepNumber": 2,
        "title": "Query backend server health statistics over UNIX stats socket with socat",
        "titleFr": "Consulter les statistiques des backends via le socket UNIX avec socat",
        "instruction": "Pipe 'show stat' into socat targeting the UNIX socket /var/run/haproxy.sock.",
        "instructionFr": "Envoyez 'show stat' dans le socket UNIX /var/run/haproxy.sock à l'aide de socat.",
        "hint": "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
        "hintFr": "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
        "expectedCommands": [
          "echo \"show stat\" | socat stdio /var/run/haproxy.sock",
          "echo 'show stat' | socat stdio /var/run/haproxy.sock",
          "echo \"show stat\" | sudo socat stdio /var/run/haproxy.sock",
          "echo 'show stat' | sudo socat stdio /var/run/haproxy.sock"
        ],
        "simulatedOutput": "# pxname,svname,qcur,qmax,scur,smax,slim,stot,bin,bout,dreq,dresp,ereq,econ,eresp,wretr,wredis,status\nweb-backend,srv1,0,0,12,84,1000,4820,1029481,8192041,0,0,0,0,0,0,0,UP\nweb-backend,srv2,0,0,14,80,1000,4791,1018290,8120914,0,0,0,0,0,0,0,UP",
        "explanation": "The HAProxy stats socket enables non-blocking runtime queries without needing HTTP dashboard overhead.",
        "explanationFr": "Le socket d'administration HAProxy permet de piloter le répartiteur en direct sans redémarrage."
      },
      {
        "id": "step-3",
        "stepNumber": 3,
        "title": "Drain and disable backend server srv2 for maintenance",
        "titleFr": "Mettre en maintenance le serveur srv2 via le socket d'administration",
        "instruction": "Send 'disable server web-backend/srv2' to the socket using socat.",
        "instructionFr": "Envoyez 'disable server web-backend/srv2' dans le socket avec socat.",
        "hint": "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
        "hintFr": "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
        "expectedCommands": [
          "echo \"disable server web-backend/srv2\" | socat stdio /var/run/haproxy.sock",
          "echo 'disable server web-backend/srv2' | socat stdio /var/run/haproxy.sock",
          "echo \"disable server web-backend/srv2\" | sudo socat stdio /var/run/haproxy.sock",
          "echo 'disable server web-backend/srv2' | sudo socat stdio /var/run/haproxy.sock"
        ],
        "simulatedOutput": "[OK] Server web-backend/srv2 state changed to MAINT (draining active sessions; no new traffic routed).",
        "explanation": "Disabling a server via the runtime socket marks it in MAINT mode immediately, allowing active sessions to finish cleanly.",
        "explanationFr": "Le basculement en mode MAINT draine les sessions en cours sans interrompre brutalement les clients connectés."
      }
    ]
  }
]
