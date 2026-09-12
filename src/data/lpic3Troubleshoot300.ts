import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-3 : Examen 300 (Environnements Mixtes & Intégration Entreprise)
 * Topics couverts :
 * - Topic 301 : Samba Basics (smb.conf, TDB databases, smbclient, testparm)
 * - Topic 302 : Samba and Domain Integration (Winbind, Domain Member, Active Directory DC, idmap)
 * - Topic 303 : OpenLDAP Basics (slapd, cn=config, syncrepl, ldif, indexes)
 * - Topic 304 : PAM, NSS, Kerberos & FreeIPA (pam.d, nsswitch.conf, krb5.conf, sssd.conf)
 */
export const lpic3Troubleshoot300: TroubleshootingChallenge[] = [
  {
    id: 'tb-lpic3-300-01',
    title: 'Erreur critique de permissions sur /etc/sssd/sssd.conf',
    titleFr: 'Erreur critique de permissions sur /etc/sssd/sssd.conf',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.4',
    category: 'SSSD & FreeIPA Integration',
    scenario: 'Après avoir configuré le client SSSD pour joindre un domaine d\'entreprise FreeIPA / Active Directory, le service sssd refuse obstinément de démarrer. Le journal système affiche "Cannot read config file: File has bad permissions".',
    scenarioFr: 'Après avoir configuré le client SSSD pour joindre un domaine d\'entreprise FreeIPA / Active Directory, le service sssd refuse obstinément de démarrer. Le journal système affiche "Cannot read config file: File has bad permissions".',
    codeSnippet: `# ls -l /etc/sssd/sssd.conf
-rw-r--r-- 1 root root 1420 Sep 04 09:20 /etc/sssd/sssd.conf

# systemctl start sssd
Job for sssd.service failed. See "systemctl status sssd.service" and "journalctl -xeu sssd.service".`,
    language: 'config',
    bugDescription: 'SSSD refuse impérativement de démarrer si les permissions de son fichier de configuration /etc/sssd/sssd.conf sont supérieures à 0600 (seul root doit pouvoir lire et écrire).',
    bugDescriptionFr: 'SSSD refuse impérativement de démarrer si les permissions de son fichier de configuration /etc/sssd/sssd.conf sont supérieures à 0600 (seul root doit pouvoir lire et écrire).',
    options: [
      {
        id: 'opt-1',
        label: 'Le fichier /etc/sssd/sssd.conf doit avoir strictement les permissions 0600 (rw-------), SSSD rejette tout accès en lecture par le groupe ou les autres',
        labelFr: 'Le fichier /etc/sssd/sssd.conf doit avoir strictement les permissions 0600 (rw-------), SSSD rejette tout accès en lecture par le groupe ou les autres',
        isCorrect: true,
        explanation: 'Pour des raisons de sécurité évidentes (le fichier contient souvent des mots de passe de bind LDAP ou des secrets Kerberos), le démon sssd impose que /etc/sssd/sssd.conf appartienne à root:root avec les droits stricts 0600.',
        explanationFr: 'Pour des raisons de sécurité évidentes (le fichier contient souvent des mots de passe de bind LDAP ou des secrets Kerberos), le démon sssd impose que /etc/sssd/sssd.conf appartienne à root:root avec les droits stricts 0600.'
      },
      {
        id: 'opt-2',
        label: 'Le propriétaire du fichier doit être le compte de service "sssd" et non "root"',
        labelFr: 'Le propriétaire du fichier doit être le compte de service "sssd" et non "root"',
        isCorrect: false,
        explanation: 'Le fichier doit bien appartenir à root:root.',
        explanationFr: 'Le fichier doit bien appartenir à root:root.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier de configuration de SSSD doit se situer dans /var/lib/sss/db/ et non dans /etc/sssd/',
        labelFr: 'Le fichier de configuration de SSSD doit se situer dans /var/lib/sss/db/ et non dans /etc/sssd/',
        isCorrect: false,
        explanation: '/etc/sssd/sssd.conf est le chemin standard officiel.',
        explanationFr: '/etc/sssd/sssd.conf est le chemin standard officiel.'
      },
      {
        id: 'opt-4',
        label: 'SELinux bloque la lecture car le label doit être public_content_t',
        labelFr: 'SELinux bloque la lecture car le label doit être public_content_t',
        isCorrect: false,
        explanation: 'L\'erreur de permissions est vérifiée directement par le binaire sssd avant tout autre traitement.',
        explanationFr: 'L\'erreur de permissions est vérifiée directement par le binaire sssd avant tout autre traitement.'
      }
    ],
    correctedSnippet: `chmod 0600 /etc/sssd/sssd.conf
chown root:root /etc/sssd/sssd.conf
systemctl start sssd`,
    fixExplanation: 'Appliquer un chmod 600 sur /etc/sssd/sssd.conf pour satisfaire les exigences strictes de sécurité du démon SSSD.',
    fixExplanationFr: 'Appliquer un chmod 600 sur /etc/sssd/sssd.conf pour satisfaire les exigences strictes de sécurité du démon SSSD.'
  },
  {
    id: 'tb-lpic3-300-02',
    title: 'Chevauchement critique de plages idmap dans smb.conf',
    titleFr: 'Chevauchement critique de plages idmap dans smb.conf',
    certification: 'lpic-3',
    topicNumber: 302,
    objectiveId: '302.3',
    category: 'Samba Winbind & ID Mapping',
    scenario: 'Sur un serveur de fichiers Samba membre d\'un domaine Active Directory, la commande testparm signale une erreur fatale sur la configuration du backend idmap et Winbind refuse de résoudre les identifiants POSIX des utilisateurs de domaine.',
    scenarioFr: 'Sur un serveur de fichiers Samba membre d\'un domaine Active Directory, la commande testparm signale une erreur fatale sur la configuration du backend idmap et Winbind refuse de résoudre les identifiants POSIX des utilisateurs de domaine.',
    codeSnippet: `[global]
   workgroup = CORP
   security = ADS
   realm = CORP.EXAMPLE.COM

   # Configuration idmap par défaut (fallback)
   idmap config * : backend = tdb
   idmap config * : range = 10000-50000

   # Configuration idmap pour le domaine CORP
   idmap config CORP : backend = rid
   idmap config CORP : range = 20000-80000`,
    language: 'config',
    bugDescription: 'La plage d\'ID du domaine CORP (20000-80000) chevauche la plage par défaut "*" (10000-50000), ce qui provoque une collision d\'identifiants UID/GID interdite par Samba.',
    bugDescriptionFr: 'La plage d\'ID du domaine CORP (20000-80000) chevauche la plage par défaut "*" (10000-50000), ce qui provoque une collision d\'identifiants UID/GID interdite par Samba.',
    options: [
      {
        id: 'opt-1',
        label: 'Les plages UID/GID de "idmap config *" et "idmap config CORP" se chevauchent entre 20000 et 50000, ce qui viole l\'intégrité des ID Samba',
        labelFr: 'Les plages UID/GID de "idmap config *" et "idmap config CORP" se chevauchent entre 20000 et 50000, ce qui viole l\'intégrité des ID Samba',
        isCorrect: true,
        explanation: 'Dans smb.conf, chaque plage idmap configurée doit impérativement être mutuellement disjointe. Le chevauchement 20000-50000 rend la résolution ambiguë et est rejeté par testparm.',
        explanationFr: 'Dans smb.conf, chaque plage idmap configurée doit impérativement être mutuellement disjointe. Le chevauchement 20000-50000 rend la résolution ambiguë et est rejeté par testparm.'
      },
      {
        id: 'opt-2',
        label: 'Le backend "rid" nécessite security = USER et non security = ADS',
        labelFr: 'Le backend "rid" nécessite security = USER et non security = ADS',
        isCorrect: false,
        explanation: 'Le backend rid est couramment utilisé avec security = ADS dans les environnements Active Directory.',
        explanationFr: 'Le backend rid est couramment utilisé avec security = ADS dans les environnements Active Directory.'
      },
      {
        id: 'opt-3',
        label: 'Le domaine CORP doit être écrit en minuscules dans la directive idmap',
        labelFr: 'Le domaine CORP doit être écrit en minuscules dans la directive idmap',
        isCorrect: false,
        explanation: 'Le nom de domaine NetBIOS (workgroup) est insensible à la casse et s\'écrit habituellement en majuscules.',
        explanationFr: 'Le nom de domaine NetBIOS (workgroup) est insensible à la casse et s\'écrit habituellement en majuscules.'
      },
      {
        id: 'opt-4',
        label: 'Il est obligatoire d\'utiliser le backend "ad" au lieu de "rid" quand realm est renseigné',
        labelFr: 'Il est obligatoire d\'utiliser le backend "ad" au lieu de "rid" quand realm est renseigné',
        isCorrect: false,
        explanation: 'Le backend rid est parfaitement supporté et très populaire car il ne nécessite pas d\'attributs RFC2307 dans AD.',
        explanationFr: 'Le backend rid est parfaitement supporté et très populaire car il ne nécessite pas d\'attributs RFC2307 dans AD.'
      }
    ],
    correctedSnippet: `   # Plages strictes et disjointes
   idmap config * : backend = tdb
   idmap config * : range = 10000-19999

   idmap config CORP : backend = rid
   idmap config CORP : range = 20000-99999`,
    fixExplanation: 'S\'assurer que les plages allouées à chaque domaine et à la zone de fallback "*" soient strictement disjointes sans aucun chevauchement.',
    fixExplanationFr: 'S\'assurer que les plages allouées à chaque domaine et à la zone de fallback "*" soient strictement disjointes sans aucun chevauchement.'
  },
  {
    id: 'tb-lpic3-300-03',
    title: 'Indexation OpenLDAP manquante provoquant une surcharge CPU',
    titleFr: 'Indexation OpenLDAP manquante provoquant une surcharge CPU',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.4',
    category: 'OpenLDAP Performance & Tuning',
    scenario: 'Dans un annuaire OpenLDAP de 100 000 utilisateurs, les recherches par "mail" ou "uid" saturent le processeur du serveur et prennent plusieurs secondes. slapd affiche dans ses logs d\'audit "equality index not found".',
    scenarioFr: 'Dans un annuaire OpenLDAP de 100 000 utilisateurs, les recherches par "mail" ou "uid" saturent le processeur du serveur et prennent plusieurs secondes. slapd affiche dans ses logs d\'audit "equality index not found".',
    codeSnippet: `dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcDbIndex
olcDbIndex: objectClass eq
olcDbIndex: entryUUID eq
olcDbIndex: entryCSN eq`,
    language: 'ldap',
    bugDescription: 'Les attributs fréquemment requêtés (uid, mail) ne sont pas indexés dans la base MDB (olcDbIndex), obligeant slapd à scanner séquentiellement toute la base (table scan).',
    bugDescriptionFr: 'Les attributs fréquemment requêtés (uid, mail) ne sont pas indexés dans la base MDB (olcDbIndex), obligeant slapd à scanner séquentiellement toute la base (table scan).',
    options: [
      {
        id: 'opt-1',
        label: 'Il manque les directives d\'indexation (ex: olcDbIndex: uid,mail eq,sub) pour éviter les scans complets de la base',
        labelFr: 'Il manque les directives d\'indexation (ex: olcDbIndex: uid,mail eq,sub) pour éviter les scans complets de la base',
        isCorrect: true,
        explanation: 'Sans index d\'égalité (eq) et de sous-chaîne (sub) sur uid et mail, slapd parcourt l\'intégralité des 100 000 entrées pour chaque filtre (uid=...) ou (mail=...), saturant la mémoire et les CPU.',
        explanationFr: 'Sans index d\'égalité (eq) et de sous-chaîne (sub) sur uid et mail, slapd parcourt l\'intégralité des 100 000 entrées pour chaque filtre (uid=...) ou (mail=...), saturant la mémoire et les CPU.'
      },
      {
        id: 'opt-2',
        label: 'Le moteur de stockage olcDatabase={1}mdb doit impérativement être remplacé par hdb ou bdb',
        labelFr: 'Le moteur de stockage olcDatabase={1}mdb doit impérativement être remplacé par hdb ou bdb',
        isCorrect: false,
        explanation: 'MDB (LMDB) est le moteur moderne hautement recommandé par OpenLDAP; bdb et hdb sont dépréciés.',
        explanationFr: 'MDB (LMDB) est le moteur moderne hautement recommandé par OpenLDAP; bdb et hdb sont dépréciés.'
      },
      {
        id: 'opt-3',
        label: 'L\'index entryUUID ne doit jamais être présent dans une base MDB',
        labelFr: 'L\'index entryUUID ne doit jamais être présent dans une base MDB',
        isCorrect: false,
        explanation: 'entryUUID et entryCSN sont essentiels notamment pour la réplication syncrepl.',
        explanationFr: 'entryUUID et entryCSN sont essentiels notamment pour la réplication syncrepl.'
      },
      {
        id: 'opt-4',
        label: 'La directive changetype doit être "add" et non "modify"',
        labelFr: 'La directive changetype doit être "add" et non "modify"',
        isCorrect: false,
        explanation: 'L\'objet de base de données existe déjà sous cn=config, changetype: modify est donc correct.',
        explanationFr: 'L\'objet de base de données existe déjà sous cn=config, changetype: modify est donc correct.'
      }
    ],
    correctedSnippet: `dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: uid,cn,mail eq,sub
olcDbIndex: member,memberUid eq`,
    fixExplanation: 'Ajouter les index appropriés (eq pour égalité, sub pour recherche partielle) avec ldapmodify sur cn=config, puis réindexer avec slapindex si nécessaire.',
    fixExplanationFr: 'Ajouter les index appropriés (eq pour égalité, sub pour recherche partielle) avec ldapmodify sur cn=config, puis réindexer avec slapindex si nécessaire.'
  },
  {
    id: 'tb-lpic3-300-04',
    title: 'Échec de synchronisation syncrepl OpenLDAP (credentials)',
    titleFr: 'Échec de synchronisation syncrepl OpenLDAP (credentials)',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.2',
    category: 'OpenLDAP Replication (syncrepl)',
    scenario: 'Sur un serveur réplique OpenLDAP consommateur (consumer), les modifications apportées sur le provider ne sont jamais synchronisées. L\'inspection des journaux de slapd révèle : "do_syncrepl: rid=001 rc=-1 retrying, invalid credentials (49)".',
    scenarioFr: 'Sur un serveur réplique OpenLDAP consommateur (consumer), les modifications apportées sur le provider ne sont jamais synchronisées. L\'inspection des journaux de slapd révèle : "do_syncrepl: rid=001 rc=-1 retrying, invalid credentials (49)".',
    codeSnippet: `olcSyncrepl: {0}rid=001
  provider=ldaps://ldap-master.corp.com:636
  type=refreshAndPersist
  interval=00:00:05:00
  searchbase="dc=corp,dc=com"
  scope=sub
  schemachecking=off
  bindmethod=simple
  binddn="cn=replicator,dc=corp,dc=com"
  credentials="SecretPassWord123"`,
    language: 'ldap',
    bugDescription: 'Le code de retour LDAP 49 (invalid credentials) indique que le binddn ou le mot de passe spécifié dans la directive syncrepl est incorrect ou rejeté par le serveur maître.',
    bugDescriptionFr: 'Le code de retour LDAP 49 (invalid credentials) indique que le binddn ou le mot de passe spécifié dans la directive syncrepl est incorrect ou rejeté par le serveur maître.',
    options: [
      {
        id: 'opt-1',
        label: 'L\'erreur LDAP 49 signifie "Invalid Credentials" : le compte replicator a un mot de passe incorrect ou n\'a pas les droits de lecture sur le provider',
        labelFr: 'L\'erreur LDAP 49 signifie "Invalid Credentials" : le compte replicator a un mot de passe incorrect ou n\'a pas les droits de lecture sur le provider',
        isCorrect: true,
        explanation: 'Le code d\'erreur LDAP 49 correspond universellement à un échec d\'authentification (mauvais mot de passe ou binddn inexistant).',
        explanationFr: 'Le code d\'erreur LDAP 49 correspond universellement à un échec d\'authentification (mauvais mot de passe ou binddn inexistant).'
      },
      {
        id: 'opt-2',
        label: 'syncrepl interdit formellement le protocole LDAPS (port 636), il exige obligatoirement StartTLS sur le port 389',
        labelFr: 'syncrepl interdit formellement le protocole LDAPS (port 636), il exige obligatoirement StartTLS sur le port 389',
        isCorrect: false,
        explanation: 'LDAPS (ldaps://...:636) est supporté de manière transparente par OpenLDAP pour syncrepl.',
        explanationFr: 'LDAPS (ldaps://...:636) est supporté de manière transparente par OpenLDAP pour syncrepl.'
      },
      {
        id: 'opt-3',
        label: 'La directive interval ne peut pas être combinée avec type=refreshAndPersist',
        labelFr: 'La directive interval ne peut pas être combinée avec type=refreshAndPersist',
        isCorrect: false,
        explanation: 'L\'intervalle est utilisé comme temps de repli en cas de déconnexion réseau lors du refreshAndPersist.',
        explanationFr: 'L\'intervalle est utilisé comme temps de repli en cas de déconnexion réseau lors du refreshAndPersist.'
      },
      {
        id: 'opt-4',
        label: 'Le paramètre rid doit obligatoirement comporter 4 chiffres (ex: 0001)',
        labelFr: 'Le paramètre rid doit obligatoirement comporter 4 chiffres (ex: 0001)',
        isCorrect: false,
        explanation: 'Le Replica ID (rid) est un entier de 1 à 3 chiffres (000 à 999).',
        explanationFr: 'Le Replica ID (rid) est un entier de 1 à 3 chiffres (000 à 999).'
      }
    ],
    correctedSnippet: `# Vérifier le mot de passe en ligne de commande :
ldapwhoami -x -D "cn=replicator,dc=corp,dc=com" -W -H ldaps://ldap-master.corp.com
# Mettre à jour le mot de passe valide dans la configuration syncrepl :
olcSyncrepl: {0}rid=001 ... credentials="CorrectValidPassword"`,
    fixExplanation: 'Valider les identifiants avec ldapwhoami ou ldapsearch et corriger le mot de passe ou le compte de réplication dans la directive syncrepl.',
    fixExplanationFr: 'Valider les identifiants avec ldapwhoami ou ldapsearch et corriger le mot de passe ou le compte de réplication dans la directive syncrepl.'
  },
  {
    id: 'tb-lpic3-300-05',
    title: 'Blocage de connexion SSH avec module PAM mal ordonné',
    titleFr: 'Blocage de connexion SSH avec module PAM mal ordonné',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.1',
    category: 'PAM Architecture & Control Flags',
    scenario: 'L\'administrateur souhaite imposer une vérification d\'authentification à deux facteurs ou restriction IP via pam_access.so. Depuis la modification de /etc/pam.d/sshd, plus aucun utilisateur même avec un mot de passe valide ne peut se connecter.',
    scenarioFr: 'L\'administrateur souhaite imposer une vérification d\'authentification à deux facteurs ou restriction IP via pam_access.so. Depuis la modification de /etc/pam.d/sshd, plus aucun utilisateur même avec un mot de passe valide ne peut se connecter.',
    codeSnippet: `# /etc/pam.d/sshd
auth [default=1 success=done] pam_unix.so nullok
auth requisite pam_deny.so
auth required pam_permit.so`,
    language: 'config',
    bugDescription: 'L\'évaluation de la règle [default=1 success=done] saute la directive suivante en cas d\'échec (default=1) pour atterrir directement sur pam_permit, ou inversement bloque les succès sur pam_deny.',
    bugDescriptionFr: 'L\'évaluation de la règle [default=1 success=done] saute la directive suivante en cas d\'échec (default=1) pour atterrir directement sur pam_permit, ou inversement bloque les succès sur pam_deny.',
    options: [
      {
        id: 'opt-1',
        label: 'La syntaxe complexe de contrôle [default=1 success=done] crée un court-circuit illogique et pam_deny.so bloque le flux',
        labelFr: 'La syntaxe complexe de contrôle [default=1 success=done] crée un court-circuit illogique et pam_deny.so bloque le flux',
        isCorrect: true,
        explanation: 'Si pam_unix échoue ou réussit de manière inattendue, le saut d\'instructions PAM atterrit sur pam_deny.so sans passer par la chaîne d\'authentification standard.',
        explanationFr: 'Si pam_unix échoue ou réussit de manière inattendue, le saut d\'instructions PAM atterrit sur pam_deny.so sans passer par la chaîne d\'authentification standard.'
      },
      {
        id: 'opt-2',
        label: 'Le mot-clé "auth" ne doit jamais être utilisé dans /etc/pam.d/sshd, seul "account" est accepté',
        labelFr: 'Le mot-clé "auth" ne doit jamais être utilisé dans /etc/pam.d/sshd, seul "account" est accepté',
        isCorrect: false,
        explanation: 'auth est le type de gestionnaire PAM indispensable pour valider l\'identité d\'un utilisateur (mot de passe, clé, biométrie).',
        explanationFr: 'auth est le type de gestionnaire PAM indispensable pour valider l\'identité d\'un utilisateur (mot de passe, clé, biométrie).'
      },
      {
        id: 'opt-3',
        label: 'pam_unix.so ne prend jamais le paramètre nullok',
        labelFr: 'pam_unix.so ne prend jamais le paramètre nullok',
        isCorrect: false,
        explanation: 'nullok est une option classique de pam_unix autorisant les comptes sans mot de passe.',
        explanationFr: 'nullok est une option classique de pam_unix autorisant les comptes sans mot de passe.'
      },
      {
        id: 'opt-4',
        label: 'pam_permit.so doit obligatoirement avoir le flag "requisite" et non "required"',
        labelFr: 'pam_permit.so doit obligatoirement avoir le flag "requisite" et non "required"',
        isCorrect: false,
        explanation: 'pam_permit réussit toujours quelle que soit son étiquette de contrôle.',
        explanationFr: 'pam_permit réussit toujours quelle que soit son étiquette de contrôle.'
      }
    ],
    correctedSnippet: `# /etc/pam.d/sshd standard et sécurisé
auth required pam_env.so
auth required pam_unix.so nullok
auth required pam_deny.so  # n'est atteint que si pam_unix échoue dans une chaîne stricte`,
    fixExplanation: 'Utiliser les directives standards PAM (required, requisite, sufficient) sans sauts numériques hasardeux qui isolent ou bloquent l\'authentification.',
    fixExplanationFr: 'Utiliser les directives standards PAM (required, requisite, sufficient) sans sauts numériques hasardeux qui isolent ou bloquent l\'authentification.'
  },
  {
    id: 'tb-lpic3-300-06',
    title: 'Erreur de casse sur le domaine Kerberos dans krb5.conf',
    titleFr: 'Erreur de casse sur le domaine Kerberos dans krb5.conf',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.3',
    category: 'Kerberos Authentication & Keytabs',
    scenario: 'Lors de l\'exécution de la commande "kinit admin@corp.example.com", l\'utilisateur reçoit immédiatement le message d\'erreur : "kinit: Cannot find KDC for realm \'corp.example.com\' while getting initial credentials".',
    scenarioFr: 'Lors de l\'exécution de la commande "kinit admin@corp.example.com", l\'utilisateur reçoit immédiatement le message d\'erreur : "kinit: Cannot find KDC for realm \'corp.example.com\' while getting initial credentials".',
    codeSnippet: `[libdefaults]
    default_realm = corp.example.com
    dns_lookup_realm = false
    dns_lookup_kdc = true

[realms]
    CORP.EXAMPLE.COM = {
        kdc = kdc.corp.example.com
        admin_server = kdc.corp.example.com
    }`,
    language: 'config',
    bugDescription: 'Les royaumes Kerberos (realms) sont strictement sensibles à la casse et doivent conventionnellement TOUJOURS être configurés en MAJUSCULES.',
    bugDescriptionFr: 'Les royaumes Kerberos (realms) sont strictement sensibles à la casse et doivent conventionnellement TOUJOURS être configurés en MAJUSCULES.',
    options: [
      {
        id: 'opt-1',
        label: 'Le nom du royaume Kerberos est sensible à la casse : default_realm doit être en majuscules (CORP.EXAMPLE.COM) pour correspondre à la section [realms]',
        labelFr: 'Le nom du royaume Kerberos est sensible à la casse : default_realm doit être en majuscules (CORP.EXAMPLE.COM) pour correspondre à la section [realms]',
        isCorrect: true,
        explanation: 'En protocole Kerberos v5, le nom de domaine de royaume (REALM) est impérativement écrit en majuscules. Ici krb5.conf cherchait la définition de "corp.example.com" en minuscules qui n\'existait pas.',
        explanationFr: 'En protocole Kerberos v5, le nom de domaine de royaume (REALM) est impérativement écrit en majuscules. Ici krb5.conf cherchait la définition de "corp.example.com" en minuscules qui n\'existait pas.'
      },
      {
        id: 'opt-2',
        label: 'dns_lookup_kdc doit obligatoirement être défini à false pour fonctionner avec un serveur KDC dédié',
        labelFr: 'dns_lookup_kdc doit obligatoirement être défini à false pour fonctionner avec un serveur KDC dédié',
        isCorrect: false,
        explanation: 'dns_lookup_kdc permet de résoudre les serveurs KDC via les enregistrements SRV DNS.',
        explanationFr: 'dns_lookup_kdc permet de résoudre les serveurs KDC via les enregistrements SRV DNS.'
      },
      {
        id: 'opt-3',
        label: 'La section [realms] doit obligatoirement se nommer [kdc_realms]',
        labelFr: 'La section [realms] doit obligatoirement se nommer [kdc_realms]',
        isCorrect: false,
        explanation: '[realms] est la section officielle définie dans le standard krb5.conf.',
        explanationFr: '[realms] est la section officielle définie dans le standard krb5.conf.'
      },
      {
        id: 'opt-4',
        label: 'kinit requiert impérativement l\'option -k pour spécifier le mot de passe interactif',
        labelFr: 'kinit requiert impérativement l\'option -k pour spécifier le mot de passe interactif',
        isCorrect: false,
        explanation: 'L\'option -k est utilisée pour s\'authentifier via un fichier keytab, non pour une saisie interactive.',
        explanationFr: 'L\'option -k est utilisée pour s\'authentifier via un fichier keytab, non pour une saisie interactive.'
      }
    ],
    correctedSnippet: `[libdefaults]
    default_realm = CORP.EXAMPLE.COM
    dns_lookup_realm = false
    dns_lookup_kdc = true

[realms]
    CORP.EXAMPLE.COM = {
        kdc = kdc.corp.example.com
        admin_server = kdc.corp.example.com
    }`,
    fixExplanation: 'Harmoniser le nom du royaume Kerberos en MAJUSCULES dans tout le fichier /etc/krb5.conf et lors de l\'appel de kinit.',
    fixExplanationFr: 'Harmoniser le nom du royaume Kerberos en MAJUSCULES dans tout le fichier /etc/krb5.conf et lors de l\'appel de kinit.'
  },
  {
    id: 'tb-lpic3-300-07',
    title: 'Mode de sécurité Samba obsolète "security = SHARE"',
    titleFr: 'Mode de sécurité Samba obsolète "security = SHARE"',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.2',
    category: 'Samba Server Roles & Security',
    scenario: 'Après la migration d\'un ancien serveur Samba vers Samba 4.18, le service refuse de se lancer et la commande testparm génère une erreur critique lors du parsing de la ligne "security".',
    scenarioFr: 'Après la migration d\'un ancien serveur Samba vers Samba 4.18, le service refuse de se lancer et la commande testparm génère une erreur critique lors du parsing de la ligne "security".',
    codeSnippet: `[global]
   workgroup = WORKGROUP
   server string = Vintage Samba Server
   security = SHARE
   passdb backend = tdbsam

[public]
   path = /srv/samba/public
   guest ok = yes
   read only = no`,
    language: 'config',
    bugDescription: 'Le paramètre "security = SHARE" (tout comme "security = SERVER") a été totalement supprimé des versions modernes de Samba 4.x.',
    bugDescriptionFr: 'Le paramètre "security = SHARE" (tout comme "security = SERVER") a été totalement supprimé des versions modernes de Samba 4.x.',
    options: [
      {
        id: 'opt-1',
        label: 'Le paramètre "security = SHARE" est obsolète et supprimé dans Samba 4 ; il faut utiliser "security = USER"',
        labelFr: 'Le paramètre "security = SHARE" est obsolète et supprimé dans Samba 4 ; il faut utiliser "security = USER"',
        isCorrect: true,
        explanation: 'Samba 4 n\'accepte que "security = USER" (pour serveurs autonomes ou membres) et "security = ADS". Le mode share était déprécié depuis Samba 3 et est totalement retiré.',
        explanationFr: 'Samba 4 n\'accepte que "security = USER" (pour serveurs autonomes ou membres) et "security = ADS". Le mode share était déprécié depuis Samba 3 et est totalement retiré.'
      },
      {
        id: 'opt-2',
        label: 'Le partage [public] doit obligatoirement avoir l\'option "public = yes" au lieu de "guest ok = yes"',
        labelFr: 'Le partage [public] doit obligatoirement avoir l\'option "public = yes" au lieu de "guest ok = yes"',
        isCorrect: false,
        explanation: '"public = yes" et "guest ok = yes" sont de stricts synonymes dans Samba.',
        explanationFr: '"public = yes" et "guest ok = yes" sont de stricts synonymes dans Samba.'
      },
      {
        id: 'opt-3',
        label: 'tdbsam n\'est plus supporté par Samba 4',
        labelFr: 'tdbsam n\'est plus supporté par Samba 4',
        isCorrect: false,
        explanation: 'tdbsam est le backend local par défaut standard de Samba en mode autonome.',
        explanationFr: 'tdbsam est le backend local par défaut standard de Samba en mode autonome.'
      },
      {
        id: 'opt-4',
        label: 'read only = no doit obligatoirement s\'écrire writeable = yes',
        labelFr: 'read only = no doit obligatoirement s\'écrire writeable = yes',
        isCorrect: false,
        explanation: 'read only = no et writeable = yes sont des synonymes valides.',
        explanationFr: 'read only = no et writeable = yes sont des synonymes valides.'
      }
    ],
    correctedSnippet: `[global]
   workgroup = WORKGROUP
   server string = Modern Samba Server
   security = USER
   map to guest = Bad User
   passdb backend = tdbsam`,
    fixExplanation: 'Remplacer "security = SHARE" par "security = USER" et ajouter "map to guest = Bad User" si un accès invité transparent est désiré.',
    fixExplanationFr: 'Remplacer "security = SHARE" par "security = USER" et ajouter "map to guest = Bad User" si un accès invité transparent est désiré.'
  },
  {
    id: 'tb-lpic3-300-08',
    title: 'Corruptions ou verrous fantômes dans la base TDB de Samba',
    titleFr: 'Corruptions ou verrous fantômes dans la base TDB de Samba',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.3',
    category: 'Samba TDB Maintenance & Diagnostics',
    scenario: 'Des clients Windows signalent qu\'un fichier Word partagé reste "verrouillé par un autre utilisateur" alors que plus personne n\'est connecté. L\'administrateur utilise tdbtool pour analyser locking.tdb.',
    scenarioFr: 'Des clients Windows signalent qu\'un fichier Word partagé reste "verrouillé par un autre utilisateur" alors que plus personne n\'est connecté. L\'administrateur utilise tdbtool pour analyser locking.tdb.',
    codeSnippet: `# tdbbackup -v /var/lib/samba/lock.tdb
/var/lib/samba/lock.tdb: No such file or directory
# smbstatus -L
(aucun verrou listé mais le fichier reste bloqué côté Windows)`,
    language: 'config',
    bugDescription: 'La base de données gérant les verrous sous Samba se nomme locking.tdb (et non lock.tdb), et l\'outil tdbbackup / tdbdump permet de vérifier son intégrité.',
    bugDescriptionFr: 'La base de données gérant les verrous sous Samba se nomme locking.tdb (et non lock.tdb), et l\'outil tdbbackup / tdbdump permet de vérifier son intégrité.',
    options: [
      {
        id: 'opt-1',
        label: 'Le nom exact de la base de verrous Samba est "locking.tdb" (généralement dans /var/lib/samba/ ou /var/lock/samba/)',
        labelFr: 'Le nom exact de la base de verrous Samba est "locking.tdb" (généralement dans /var/lib/samba/ ou /var/lock/samba/)',
        isCorrect: true,
        explanation: 'Samba stocke ses verrous d\'enregistrements et oplocks dans locking.tdb. tdbbackup et tdbdump permettent d\'analyser et restaurer cette base.',
        explanationFr: 'Samba stocke ses verrous d\'enregistrements et oplocks dans locking.tdb. tdbbackup et tdbdump permettent d\'analyser et restaurer cette base.'
      },
      {
        id: 'opt-2',
        label: 'Samba n\'utilise plus les bases TDB mais des bases SQLite3 depuis Samba 4',
        labelFr: 'Samba n\'utilise plus les bases TDB mais des bases SQLite3 depuis Samba 4',
        isCorrect: false,
        explanation: 'Samba utilise toujours son propre moteur TDB (Trivial Database) et LDB pour Active Directory.',
        explanationFr: 'Samba utilise toujours son propre moteur TDB (Trivial Database) et LDB pour Active Directory.'
      },
      {
        id: 'opt-3',
        label: 'Les verrous Windows ne peuvent être levés qu\'en redémarrant le serveur physique Linux',
        labelFr: 'Les verrous Windows ne peuvent être levés qu\'en redémarrant le serveur physique Linux',
        isCorrect: false,
        explanation: 'Redémarrer le démon smbd ou purger locking.tdb après arrêt de Samba permet de réinitialiser les verrous.',
        explanationFr: 'Redémarrer le démon smbd ou purger locking.tdb après arrêt de Samba permet de réinitialiser les verrous.'
      },
      {
        id: 'opt-4',
        label: 'La commande smbstatus ne sait pas lire les verrous de fichiers',
        labelFr: 'La commande smbstatus ne sait pas lire les verrous de fichiers',
        isCorrect: false,
        explanation: 'smbstatus -L liste spécifiquement tous les verrous de fichiers actifs (locks/oplocks).',
        explanationFr: 'smbstatus -L liste spécifiquement tous les verrous de fichiers actifs (locks/oplocks).'
      }
    ],
    correctedSnippet: `tdbbackup -v /var/lib/samba/locking.tdb
# Si la base est corrompue, arrêter Samba et la régénérer :
systemctl stop smbd nmbd
rm -f /var/lib/samba/locking.tdb
systemctl start smbd nmbd`,
    fixExplanation: 'Cibler locking.tdb pour auditer ou purger les enregistrements de verrous incohérents.',
    fixExplanationFr: 'Cibler locking.tdb pour auditer ou purger les enregistrements de verrous incohérents.'
  },
  {
    id: 'tb-lpic3-300-09',
    title: 'Échec d\'authentification NTLMv1 désactivée par défaut dans Samba',
    titleFr: 'Échec d\'authentification NTLMv1 désactivée par défaut dans Samba',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.1',
    category: 'Samba Protocols & Security Dialects',
    scenario: 'D\'anciens équipements industriels ou scanners réseau refusent subitement de déposer des fichiers sur un partage Samba nouvellement installé avec l\'erreur "NT_STATUS_ACCESS_DENIED".',
    scenarioFr: 'D\'anciens équipements industriels ou scanners réseau refusent subitement de déposer des fichiers sur un partage Samba nouvellement installé avec l\'erreur "NT_STATUS_ACCESS_DENIED".',
    codeSnippet: `[global]
   workgroup = WORKGROUP
   security = USER
   # Les logs indiquent: "Client requested unsupported NTLMv1 authentication"`,
    language: 'config',
    bugDescription: 'Par défaut, les versions récentes de Samba désactivent le protocole NTLMv1 (ntlm auth = ntlmv2-only) pour des raisons de sécurité cryptographique.',
    bugDescriptionFr: 'Par défaut, les versions récentes de Samba désactivent le protocole NTLMv1 (ntlm auth = ntlmv2-only) pour des raisons de sécurité cryptographique.',
    options: [
      {
        id: 'opt-1',
        label: 'Samba désactive par défaut NTLMv1 ; pour autoriser de vieux clients d\'équipements embarqués, il faut configurer "ntlm auth = yes"',
        labelFr: 'Samba désactive par défaut NTLMv1 ; pour autoriser de vieux clients d\'équipements embarqués, il faut configurer "ntlm auth = yes"',
        isCorrect: true,
        explanation: 'Pour contrer les attaques de type passe-the-hash et faiblesses DES/MD4 de NTLMv1, Samba requiert désormais NTLMv2 par défaut. Les scanners anciens nécessitent "ntlm auth = yes" (ou ntlm auth = ntlmv1-permitted).',
        explanationFr: 'Pour contrer les attaques de type passe-the-hash et faiblesses DES/MD4 de NTLMv1, Samba requiert désormais NTLMv2 par défaut. Les scanners anciens nécessitent "ntlm auth = yes" (ou ntlm auth = ntlmv1-permitted).'
      },
      {
        id: 'opt-2',
        label: 'Il faut passer le paramètre server min protocol = SMB3',
        labelFr: 'Il faut passer le paramètre server min protocol = SMB3',
        isCorrect: false,
        explanation: 'Forcer SMB3 bloquerait encore plus les anciens périphériques qui n\'utilisent souvent que SMB1 ou SMB2.',
        explanationFr: 'Forcer SMB3 bloquerait encore plus les anciens périphériques qui n\'utilisent souvent que SMB1 ou SMB2.'
      },
      {
        id: 'opt-3',
        label: 'Le mot de passe de l\'utilisateur doit être réinitialisé avec chpasswd en clair',
        labelFr: 'Le mot de passe de l\'utilisateur doit être réinitialisé avec chpasswd en clair',
        isCorrect: false,
        explanation: 'Samba gère ses propres hashs NTLM dans passdb.tdb via smbpasswd.',
        explanationFr: 'Samba gère ses propres hashs NTLM dans passdb.tdb via smbpasswd.'
      },
      {
        id: 'opt-4',
        label: 'Le service nmbd doit être désactivé pour que NTLM fonctionne',
        labelFr: 'Le service nmbd doit être désactivé pour que NTLM fonctionne',
        isCorrect: false,
        explanation: 'nmbd gère NetBIOS et n\'a pas de lien avec l\'algorithme de hash NTLM.',
        explanationFr: 'nmbd gère NetBIOS et n\'a pas de lien avec l\'algorithme de hash NTLM.'
      }
    ],
    correctedSnippet: `[global]
   workgroup = WORKGROUP
   security = USER
   ntlm auth = ntlmv1-permitted
   server min protocol = NT1`,
    fixExplanation: 'Activer ntlm auth = ntlmv1-permitted dans smb.conf si le remplacement matériel du scanner n\'est pas possible dans l\'immédiat.',
    fixExplanationFr: 'Activer ntlm auth = ntlmv1-permitted dans smb.conf si le remplacement matériel du scanner n\'est pas possible dans l\'immédiat.'
  },
  {
    id: 'tb-lpic3-300-10',
    title: 'Erreur de syntaxe ACL dans OpenLDAP olcAccess',
    titleFr: 'Erreur de syntaxe ACL dans OpenLDAP olcAccess',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.3',
    category: 'OpenLDAP Access Control Lists (ACLs)',
    scenario: 'L\'administrateur souhaite autoriser chaque utilisateur à modifier son propre mot de passe (userPassword) tout en interdisant aux utilisateurs anonymes de le lire. La modification de cn=config échoue.',
    scenarioFr: 'L\'administrateur souhaite autoriser chaque utilisateur à modifier son propre mot de passe (userPassword) tout en interdisant aux utilisateurs anonymes de le lire. La modification de cn=config échoue.',
    codeSnippet: `dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to attrs=userPassword
  by self write
  by anonymous auth
  by * none
olcAccess: {1}to *
  by * read`,
    language: 'ldap',
    bugDescription: 'La directive multi-lignes olcAccess sous LDIF doit comporter un espace d\'indentation au début de chaque ligne de continuation.',
    bugDescriptionFr: 'La directive multi-lignes olcAccess sous LDIF doit comporter un espace d\'indentation au début de chaque ligne de continuation.',
    options: [
      {
        id: 'opt-1',
        label: 'En syntaxe LDIF, toute ligne continuant la valeur d\'un attribut multi-lignes doit obligatoirement commencer par un espace (folding)',
        labelFr: 'En syntaxe LDIF, toute ligne continuant la valeur d\'un attribut multi-lignes doit obligatoirement commencer par un espace (folding)',
        isCorrect: true,
        explanation: 'Le format standard RFC 2849 pour LDIF impose que les lignes de continuation commencent par un espace unique. Sans cet espace, le parseur interprète "by self write" comme un nouvel attribut LDIF inconnu.',
        explanationFr: 'Le format standard RFC 2849 pour LDIF impose que les lignes de continuation commencent par un espace unique. Sans cet espace, le parseur interprète "by self write" comme un nouvel attribut LDIF inconnu.'
      },
      {
        id: 'opt-2',
        label: 'Le droit "auth" n\'existe pas dans OpenLDAP, il faut utiliser "bind"',
        labelFr: 'Le droit "auth" n\'existe pas dans OpenLDAP, il faut utiliser "bind"',
        isCorrect: false,
        explanation: '"auth" est le droit précis permettant de vérifier un mot de passe sans pouvoir le lire.',
        explanationFr: '"auth" est le droit précis permettant de vérifier un mot de passe sans pouvoir le lire.'
      },
      {
        id: 'opt-3',
        label: 'L\'attribut userPassword ne peut pas être ciblé par olcAccess',
        labelFr: 'L\'attribut userPassword ne peut pas être ciblé par olcAccess',
        isCorrect: false,
        explanation: 'userPassword est l\'attribut le plus fréquemment ciblé dans les ACL OpenLDAP.',
        explanationFr: 'userPassword est l\'attribut le plus fréquemment ciblé dans les ACL OpenLDAP.'
      },
      {
        id: 'opt-4',
        label: 'Le préfixe numérique {0} est interdit lors d\'un remplacement d\'ACL',
        labelFr: 'Le préfixe numérique {0} est interdit lors d\'un remplacement d\'ACL',
        isCorrect: false,
        explanation: 'L\'index {0} est la notation standard d\'OpenLDAP pour ordonner les règles ACL.',
        explanationFr: 'L\'index {0} est la notation standard d\'OpenLDAP pour ordonner les règles ACL.'
      }
    ],
    correctedSnippet: `dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to attrs=userPassword by self write by anonymous auth by * none
olcAccess: {1}to * by * read`,
    fixExplanation: 'Conserver la règle sur une seule ligne ou ajouter un espace initial d\'indentation strict sur chaque ligne de continuation LDIF.',
    fixExplanationFr: 'Conserver la règle sur une seule ligne ou ajouter un espace initial d\'indentation strict sur chaque ligne de continuation LDIF.'
  },
  {
    id: 'tb-lpic3-300-11',
    title: 'Omission de "winbind" dans /etc/nsswitch.conf',
    titleFr: 'Omission de "winbind" dans /etc/nsswitch.conf',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.2',
    category: 'NSS & Name Service Switch',
    scenario: 'La commande "wbinfo -u" liste avec succès tous les utilisateurs Active Directory. Pourtant, la commande système "getent passwd monutilisateur" ne retourne rien.',
    scenarioFr: 'La commande "wbinfo -u" liste avec succès tous les utilisateurs Active Directory. Pourtant, la commande système "getent passwd monutilisateur" ne retourne rien.',
    codeSnippet: `# /etc/nsswitch.conf
passwd:         files systemd
group:          files systemd
shadow:         files
gshadow:        files

hosts:          files dns
networks:       files`,
    language: 'config',
    bugDescription: 'La bibliothèque NSS (Name Service Switch) n\'interroge pas le module winbind car le mot-clé "winbind" est absent des bases passwd et group dans nsswitch.conf.',
    bugDescriptionFr: 'La bibliothèque NSS (Name Service Switch) n\'interroge pas le module winbind car le mot-clé "winbind" est absent des bases passwd et group dans nsswitch.conf.',
    options: [
      {
        id: 'opt-1',
        label: 'Le service NSS ne sait pas interroger Winbind car "winbind" n\'est pas ajouté sur les lignes "passwd:" et "group:" dans /etc/nsswitch.conf',
        labelFr: 'Le service NSS ne sait pas interroger Winbind car "winbind" n\'est pas ajouté sur les lignes "passwd:" et "group:" dans /etc/nsswitch.conf',
        isCorrect: true,
        explanation: 'wbinfo communique directement avec le socket /run/samba/winbindd. En revanche, les commandes système standard (getent, id, ls -l) passent par la libc et NSS (/etc/nsswitch.conf), qui nécessite le module libnss_winbind.so.',
        explanationFr: 'wbinfo communique directement avec le socket /run/samba/winbindd. En revanche, les commandes système standard (getent, id, ls -l) passent par la libc et NSS (/etc/nsswitch.conf), qui nécessite le module libnss_winbind.so.'
      },
      {
        id: 'opt-2',
        label: 'Le démon winbindd doit être redémarré avec l\'option --no-caching',
        labelFr: 'Le démon winbindd doit être redémarré avec l\'option --no-caching',
        isCorrect: false,
        explanation: 'Le cache n\'est pas en cause : la libc ne sollicite tout simplement jamais Winbind.',
        explanationFr: 'Le cache n\'est pas en cause : la libc ne sollicite tout simplement jamais Winbind.'
      },
      {
        id: 'opt-3',
        label: 'La base shadow doit obligatoirement comporter "winbind"',
        labelFr: 'La base shadow doit obligatoirement comporter "winbind"',
        isCorrect: false,
        explanation: 'Winbind n\'expose pas les hashs de mot de passe dans shadow; l\'authentification passe par PAM.',
        explanationFr: 'Winbind n\'expose pas les hashs de mot de passe dans shadow; l\'authentification passe par PAM.'
      },
      {
        id: 'opt-4',
        label: 'Il faut remplacer systemd par sssd dans /etc/nsswitch.conf',
        labelFr: 'Il faut remplacer systemd par sssd dans /etc/nsswitch.conf',
        isCorrect: false,
        explanation: 'Si le serveur utilise Winbind plutôt que SSSD, c\'est winbind qu\'il faut ajouter.',
        explanationFr: 'Si le serveur utilise Winbind plutôt que SSSD, c\'est winbind qu\'il faut ajouter.'
      }
    ],
    correctedSnippet: `# /etc/nsswitch.conf corrigé
passwd:         files systemd winbind
group:          files systemd winbind
shadow:         files`,
    fixExplanation: 'Ajouter winbind sur les lignes passwd et group dans /etc/nsswitch.conf pour que la libc résolve les utilisateurs du domaine.',
    fixExplanationFr: 'Ajouter winbind sur les lignes passwd et group dans /etc/nsswitch.conf pour que la libc résolve les utilisateurs du domaine.'
  },
  {
    id: 'tb-lpic3-300-12',
    title: 'Conflit de ports entre Samba AD DC et BIND9 / Kerberos',
    titleFr: 'Conflit de ports entre Samba AD DC et BIND9 / Kerberos',
    certification: 'lpic-3',
    topicNumber: 302,
    objectiveId: '302.2',
    category: 'Samba Active Directory Domain Controller',
    scenario: 'Lors du provisionnement d\'un contrôleur de domaine Active Directory avec "samba-tool domain provision", le démarrage échoue avec l\'erreur "address already in use: 0.0.0.0:53" ou port 88.',
    scenarioFr: 'Lors du provisionnement d\'un contrôleur de domaine Active Directory avec "samba-tool domain provision", le démarrage échoue avec l\'erreur "address already in use: 0.0.0.0:53" ou port 88.',
    codeSnippet: `# systemctl start samba
Failed to start samba.service: Unit samba.service is masked.
# /usr/sbin/samba -i -M single
bind failed on port 53: Address already in use
bind failed on port 88: Address already in use`,
    language: 'config',
    bugDescription: 'Des services préexistants (ex: named/bind9 ou krb5-kdc/dnsmasq) écoutent déjà sur les ports DNS (53) et Kerberos (88), empêchant le démon Samba AD unifié de démarrer.',
    bugDescriptionFr: 'Des services préexistants (ex: named/bind9 ou krb5-kdc/dnsmasq) écoutent déjà sur les ports DNS (53) et Kerberos (88), empêchant le démon Samba AD unifié de démarrer.',
    options: [
      {
        id: 'opt-1',
        label: 'Un serveur DNS autonome (bind/dnsmasq/systemd-resolved) et/ou KDC externe utilise déjà les ports 53 et 88 qui doivent être réservés à Samba AD DC',
        labelFr: 'Un serveur DNS autonome (bind/dnsmasq/systemd-resolved) et/ou KDC externe utilise déjà les ports 53 et 88 qui doivent être réservés à Samba AD DC',
        isCorrect: true,
        explanation: 'En mode AD DC, le binaire "samba" intègre nativement son propre serveur Kerberos (port 88) et son serveur DNS interne (port 53). Tout service concurrent sur ces ports doit être arrêté ou reconfiguré.',
        explanationFr: 'En mode AD DC, le binaire "samba" intègre nativement son propre serveur Kerberos (port 88) et son serveur DNS interne (port 53). Tout service concurrent sur ces ports doit être arrêté ou reconfiguré.'
      },
      {
        id: 'opt-2',
        label: 'Samba AD DC ne fonctionne que sur les ports 445 et 139',
        labelFr: 'Samba AD DC ne fonctionne que sur les ports 445 et 139',
        isCorrect: false,
        explanation: 'Un Active Directory DC doit écouter sur DNS (53), Kerberos (88), LDAP (389), SMB (445), RPC (135), etc.',
        explanationFr: 'Un Active Directory DC doit écouter sur DNS (53), Kerberos (88), LDAP (389), SMB (445), RPC (135), etc.'
      },
      {
        id: 'opt-3',
        label: 'L\'option -M single est obligatoire pour les déploiements de production',
        labelFr: 'L\'option -M single est obligatoire pour les déploiements de production',
        isCorrect: false,
        explanation: '-M single est une option de débogage pour exécuter Samba en un seul processus.',
        explanationFr: '-M single est une option de débogage pour exécuter Samba en un seul processus.'
      },
      {
        id: 'opt-4',
        label: 'Le port 88 doit être redirigé vers le port 8080 avec iptables',
        labelFr: 'Le port 88 doit être redirigé vers le port 8080 avec iptables',
        isCorrect: false,
        explanation: 'Kerberos standard exige strictement le port 88 TCP/UDP.',
        explanationFr: 'Kerberos standard exige strictement le port 88 TCP/UDP.'
      }
    ],
    correctedSnippet: `# Identifier et couper les démons concurrents :
ss -tulpn | grep -E ':53|:88'
systemctl stop systemd-resolved bind9 krb5-kdc
systemctl disable systemd-resolved bind9 krb5-kdc
systemctl unmask samba-ad-dc
systemctl start samba-ad-dc`,
    fixExplanation: 'Libérer les ports 53 et 88 occupés par systemd-resolved ou d\'anciens serveurs DNS/KDC avant de lancer samba-ad-dc.',
    fixExplanationFr: 'Libérer les ports 53 et 88 occupés par systemd-resolved ou d\'anciens serveurs DNS/KDC avant de lancer samba-ad-dc.'
  },
  {
    id: 'tb-lpic3-300-13',
    title: 'Format d\'export LDIF corrompu par un mot de passe en clair',
    titleFr: 'Format d\'export LDIF corrompu par un mot de passe en clair',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.1',
    category: 'OpenLDAP Data Management',
    scenario: 'L\'importation d\'un lot d\'utilisateurs via "ldapadd -x -D cn=admin,dc=corp,dc=com -W -f users.ldif" échoue avec l\'erreur "ldapadd: invalid format (line 7) entry: dc=corp,dc=com".',
    scenarioFr: 'L\'importation d\'un lot d\'utilisateurs via "ldapadd -x -D cn=admin,dc=corp,dc=com -W -f users.ldif" échoue avec l\'erreur "ldapadd: invalid format (line 7) entry: dc=corp,dc=com".',
    codeSnippet: `dn: uid=jdupont,ou=People,dc=corp,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
cn: Jean Dupont
sn: Dupont
uid: jdupont
userPassword:: MonMotDePasseEnClair
uidNumber: 2001
gidNumber: 2000
homeDirectory: /home/jdupont`,
    language: 'ldap',
    bugDescription: 'Le double deux-points "userPassword::" est réservé aux valeurs encodées en Base64. Pour une valeur textuelle ou pré-hachée standard, un seul deux-points "userPassword:" doit être utilisé.',
    bugDescriptionFr: 'Le double deux-points "userPassword::" est réservé aux valeurs encodées en Base64. Pour une valeur textuelle ou pré-hachée standard, un seul deux-points "userPassword:" doit être utilisé.',
    options: [
      {
        id: 'opt-1',
        label: 'La syntaxe "::" indique une valeur encodée en Base64 ; comme la chaîne n\'est pas en Base64, le parseur LDIF rejette l\'entrée',
        labelFr: 'La syntaxe "::" indique une valeur encodée en Base64 ; comme la chaîne n\'est pas en Base64, le parseur LDIF rejette l\'entrée',
        isCorrect: true,
        explanation: 'Dans les fichiers LDIF, un double deux-points (attr:: valeur) signale que la valeur est encodée en Base64. Pour du texte clair ou des hashs préfixés comme {SSHA}, un seul deux-points (attr: {SSHA}...) est requis.',
        explanationFr: 'Dans les fichiers LDIF, un double deux-points (attr:: valeur) signale que la valeur est encodée en Base64. Pour du texte clair ou des hashs préfixés comme {SSHA}, un seul deux-points (attr: {SSHA}...) est requis.'
      },
      {
        id: 'opt-2',
        label: 'L\'attribut sn est obligatoire seulement pour objectClass: person et non inetOrgPerson',
        labelFr: 'L\'attribut sn est obligatoire seulement pour objectClass: person et non inetOrgPerson',
        isCorrect: false,
        explanation: 'inetOrgPerson hérite de organizationalPerson qui hérite de person, sn est donc toujours obligatoire.',
        explanationFr: 'inetOrgPerson hérite de organizationalPerson qui hérite de person, sn est donc toujours obligatoire.'
      },
      {
        id: 'opt-3',
        label: 'uidNumber doit impérativement être supérieur à 10000 dans OpenLDAP',
        labelFr: 'uidNumber doit impérativement être supérieur à 10000 dans OpenLDAP',
        isCorrect: false,
        explanation: 'OpenLDAP accepte n\'importe quel entier positif valide pour uidNumber.',
        explanationFr: 'OpenLDAP accepte n\'importe quel entier positif valide pour uidNumber.'
      },
      {
        id: 'opt-4',
        label: 'L\'attribut homeDirectory doit se terminer par un slash',
        labelFr: 'L\'attribut homeDirectory doit se terminer par un slash',
        isCorrect: false,
        explanation: 'homeDirectory ne doit pas comporter de slash terminal.',
        explanationFr: 'homeDirectory ne doit pas comporter de slash terminal.'
      }
    ],
    correctedSnippet: `dn: uid=jdupont,ou=People,dc=corp,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
cn: Jean Dupont
sn: Dupont
uid: jdupont
userPassword: {SSHA}hashedSecretValue...
uidNumber: 2001
gidNumber: 2000
homeDirectory: /home/jdupont`,
    fixExplanation: 'Remplacer "::" par ":" et hacher le mot de passe avec slappasswd avant insertion.',
    fixExplanationFr: 'Remplacer "::" par ":" et hacher le mot de passe avec slappasswd avant insertion.'
  },
  {
    id: 'tb-lpic3-300-14',
    title: 'Dégradation des performances Samba par winbind enum users',
    titleFr: 'Dégradation des performances Samba par winbind enum users',
    certification: 'lpic-3',
    topicNumber: 302,
    objectiveId: '302.3',
    category: 'Samba Winbind Tuning',
    scenario: 'Dans un domaine d\'entreprise de 50 000 utilisateurs, le serveur Samba subit des freezes périodiques lors de chaque listing de fichiers ou commande getent passwd.',
    scenarioFr: 'Dans un domaine d\'entreprise de 50 000 utilisateurs, le serveur Samba subit des freezes périodiques lors de chaque listing de fichiers ou commande getent passwd.',
    codeSnippet: `[global]
   workgroup = ENTERPRISE
   security = ADS
   realm = ENTERPRISE.LOCAL
   winbind enum users = yes
   winbind enum groups = yes
   winbind use default domain = yes`,
    language: 'config',
    bugDescription: 'Les options "winbind enum users = yes" et "winbind enum groups = yes" obligent Winbind à télécharger la totalité des 50 000 comptes du domaine à chaque requête NSS, provoquant un écroulement des performances.',
    bugDescriptionFr: 'Les options "winbind enum users = yes" et "winbind enum groups = yes" obligent Winbind à télécharger la totalité des 50 000 comptes du domaine à chaque requête NSS, provoquant un écroulement des performances.',
    options: [
      {
        id: 'opt-1',
        label: '"winbind enum users = yes" et "winbind enum groups = yes" doivent être désactivés (définis à no) en environnement de production',
        labelFr: '"winbind enum users = yes" et "winbind enum groups = yes" doivent être désactivés (définis à no) en environnement de production',
        isCorrect: true,
        explanation: 'L\'énumération complète (enum users/groups) est explicitement déconseillée par la documentation Samba pour les grands domaines, car elle force le téléchargement de milliers d\'objets à chaque appel de getent ou getpwent().',
        explanationFr: 'L\'énumération complète (enum users/groups) est explicitement déconseillée par la documentation Samba pour les grands domaines, car elle force le téléchargement de milliers d\'objets à chaque appel de getent ou getpwent().'
      },
      {
        id: 'opt-2',
        label: 'winbind use default domain doit impérativement être mis à no pour que Samba fonctionne',
        labelFr: 'winbind use default domain doit impérativement être mis à no pour que Samba fonctionne',
        isCorrect: false,
        explanation: 'Cette option permet simplement de ne pas devoir préfixer le nom d\'utilisateur par le DOMAINE\\.',
        explanationFr: 'Cette option permet simplement de ne pas devoir préfixer le nom d\'utilisateur par le DOMAINE\\.'
      },
      {
        id: 'opt-3',
        label: 'security = ADS n\'est pas supporté si le domaine se termine par .LOCAL',
        labelFr: 'security = ADS n\'est pas supporté si le domaine se termine par .LOCAL',
        isCorrect: false,
        explanation: 'Bien que .local pose des soucis avec mDNS/Avahi, Samba ADS gère parfaitement ces domaines.',
        explanationFr: 'Bien que .local pose des soucis avec mDNS/Avahi, Samba ADS gère parfaitement ces domaines.'
      },
      {
        id: 'opt-4',
        label: 'La taille maximale d\'un domaine pour Winbind est de 1 000 utilisateurs',
        labelFr: 'La taille maximale d\'un domaine pour Winbind est de 1 000 utilisateurs',
        isCorrect: false,
        explanation: 'Winbind peut gérer des domaines de centaines de milliers de comptes sans énumération.',
        explanationFr: 'Winbind peut gérer des domaines de centaines de milliers de comptes sans énumération.'
      }
    ],
    correctedSnippet: `[global]
   workgroup = ENTERPRISE
   security = ADS
   realm = ENTERPRISE.LOCAL
   winbind enum users = no
   winbind enum groups = no
   winbind use default domain = yes`,
    fixExplanation: 'Désactiver systématiquement l\'énumération winbind dans les environnements Active Directory pour éliminer la saturation réseau et mémoire.',
    fixExplanationFr: 'Désactiver systématiquement l\'énumération winbind dans les environnements Active Directory pour éliminer la saturation réseau et mémoire.'
  },
  {
    id: 'tb-lpic3-300-15',
    title: 'Absence d\'écriture autorisée dans le partage [homes] Samba',
    titleFr: 'Absence d\'écriture autorisée dans le partage [homes] Samba',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.2',
    category: 'Samba Share Definitions',
    scenario: 'Les utilisateurs accèdent bien à leur répertoire personnel \\\\serveur\\monlogin, mais toute tentative de créer ou modifier un fichier est rejetée avec l\'erreur "Accès refusé" malgré des droits Unix parfaits 0700.',
    scenarioFr: 'Les utilisateurs accèdent bien à leur répertoire personnel \\\\serveur\\monlogin, mais toute tentative de créer ou modifier un fichier est rejetée avec l\'erreur "Accès refusé" malgré des droits Unix parfaits 0700.',
    codeSnippet: `[homes]
   comment = Home Directories
   browseable = no
   valid users = %S
   create mask = 0700
   directory mask = 0700`,
    language: 'config',
    bugDescription: 'Par défaut sous Samba, tout partage sans directive explicite est configuré en lecture seule (read only = yes). Il manque la directive "read only = no" (ou "writable = yes").',
    bugDescriptionFr: 'Par défaut sous Samba, tout partage sans directive explicite est configuré en lecture seule (read only = yes). Il manque la directive "read only = no" (ou "writable = yes").',
    options: [
      {
        id: 'opt-1',
        label: 'Dans Samba la valeur par défaut est "read only = yes" ; il faut expliciter "read only = no" (ou "writable = yes") pour autoriser l\'écriture',
        labelFr: 'Dans Samba la valeur par défaut est "read only = yes" ; il faut expliciter "read only = no" (ou "writable = yes") pour autoriser l\'écriture',
        isCorrect: true,
        explanation: 'Si ni "read only" ni "writeable" n\'est spécifié, Samba verrouille automatiquement le partage en lecture seule.',
        explanationFr: 'Si ni "read only" ni "writeable" n\'est spécifié, Samba verrouille automatiquement le partage en lecture seule.'
      },
      {
        id: 'opt-2',
        label: 'La macro %S est invalide dans la section [homes]',
        labelFr: 'La macro %S est invalide dans la section [homes]',
        isCorrect: false,
        explanation: '%S représente le nom du service courant (ici le nom de l\'utilisateur), ce qui est la syntaxe recommandée.',
        explanationFr: '%S représente le nom du service courant (ici le nom de l\'utilisateur), ce qui est la syntaxe recommandée.'
      },
      {
        id: 'opt-3',
        label: 'browseable = no empêche toute écriture dans le partage',
        labelFr: 'browseable = no empêche toute écriture dans le partage',
        isCorrect: false,
        explanation: 'browseable = no masque simplement le partage de la liste des partages réseau, mais n\'impacte pas les droits d\'écriture.',
        explanationFr: 'browseable = no masque simplement le partage de la liste des partages réseau, mais n\'impacte pas les droits d\'écriture.'
      },
      {
        id: 'opt-4',
        label: 'Le masque 0700 est refusé par Samba, seuls les masques à 3 chiffres sont acceptés',
        labelFr: 'Le masque 0700 est refusé par Samba, seuls les masques à 3 chiffres sont acceptés',
        isCorrect: false,
        explanation: 'La notation octale à 4 chiffres (ex: 0700) est la syntaxe officielle.',
        explanationFr: 'La notation octale à 4 chiffres (ex: 0700) est la syntaxe officielle.'
      }
    ],
    correctedSnippet: `[homes]
   comment = Home Directories
   browseable = no
   read only = no
   valid users = %S
   create mask = 0700
   directory mask = 0700`,
    fixExplanation: 'Ajouter la directive "read only = no" dans la section [homes].',
    fixExplanationFr: 'Ajouter la directive "read only = no" dans la section [homes].'
  },
  {
    id: 'tb-lpic3-300-16',
    title: 'Échec de synchronisation d\'horloge Kerberos (clock skew)',
    titleFr: 'Échec de synchronisation d\'horloge Kerberos (clock skew)',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.3',
    category: 'Kerberos Protocol & Time Synchronization',
    scenario: 'Un serveur membre Linux refuse de valider les tickets Kerberos des utilisateurs. La commande kinit renvoie : "kinit: Clock skew too great while getting initial credentials".',
    scenarioFr: 'Un serveur membre Linux refuse de valider les tickets Kerberos des utilisateurs. La commande kinit renvoie : "kinit: Clock skew too great while getting initial credentials".',
    codeSnippet: `# date -u (sur le client)
Wed Sep 09 14:30:00 UTC 2026

# date -u (sur le KDC)
Wed Sep 09 14:42:00 UTC 2026`,
    language: 'bash',
    bugDescription: 'Kerberos tolère par défaut un décalage d\'horloge maximal (clock skew) de 300 secondes (5 minutes) pour empêcher les attaques par rejeu. Le décalage de 12 minutes ici invalide les tickets.',
    bugDescriptionFr: 'Kerberos tolère par défaut un décalage d\'horloge maximal (clock skew) de 300 secondes (5 minutes) pour empêcher les attaques par rejeu. Le décalage de 12 minutes ici invalide les tickets.',
    options: [
      {
        id: 'opt-1',
        label: 'Le décalage horaire entre le client et le KDC dépasse la limite maximale autorisée de 5 minutes (300 secondes)',
        labelFr: 'Le décalage horaire entre le client et le KDC dépasse la limite maximale autorisée de 5 minutes (300 secondes)',
        isCorrect: true,
        explanation: 'Pour se protéger contre le rejeu de tickets, Kerberos rejette toute requête dont l\'horodatage diffère de plus de 5 minutes (valeur par défaut de clockskew dans krb5.conf). La synchronisation NTP/chrony est impérative.',
        explanationFr: 'Pour se protéger contre le rejeu de tickets, Kerberos rejette toute requête dont l\'horodatage diffère de plus de 5 minutes (valeur par défaut de clockskew dans krb5.conf). La synchronisation NTP/chrony est impérative.'
      },
      {
        id: 'opt-2',
        label: 'Kerberos exige que les serveurs soient configurés sur le fuseau horaire de New York (EST)',
        labelFr: 'Kerberos exige que les serveurs soient configurés sur le fuseau horaire de New York (EST)',
        isCorrect: false,
        explanation: 'Kerberos utilise l\'heure UTC absolue, le fuseau local n\'importe pas tant que l\'UTC est identique.',
        explanationFr: 'Kerberos utilise l\'heure UTC absolue, le fuseau local n\'importe pas tant que l\'UTC est identique.'
      },
      {
        id: 'opt-3',
        label: 'L\'erreur Clock skew signifie que le CPU du KDC est en surchauffe',
        labelFr: 'L\'erreur Clock skew signifie que le CPU du KDC est en surchauffe',
        isCorrect: false,
        explanation: '"Clock skew" désigne strictement la dérive d\'horloge système.',
        explanationFr: '"Clock skew" désigne strictement la dérive d\'horloge système.'
      },
      {
        id: 'opt-4',
        label: 'Il suffit de vider le cache /tmp/krb5cc_0 pour réinitialiser l\'horloge',
        labelFr: 'Il suffit de vider le cache /tmp/krb5cc_0 pour réinitialiser l\'horloge',
        isCorrect: false,
        explanation: 'Supprimer le ccache ne corrige pas l\'heure système.',
        explanationFr: 'Supprimer le ccache ne corrige pas l\'heure système.'
      }
    ],
    correctedSnippet: `chronyc -a makestep
# ou forcer la synchronisation NTP avec le contrôleur de domaine :
chronyd -q 'server kdc.corp.example.com iburst'`,
    fixExplanation: 'Synchroniser immédiatement l\'horloge via chrony ou ntpd avec le serveur KDC / Active Directory.',
    fixExplanationFr: 'Synchroniser immédiatement l\'horloge via chrony ou ntpd avec le serveur KDC / Active Directory.'
  },
  {
    id: 'tb-lpic3-300-17',
    title: 'Format d\'enregistrement DNS SRV manquant pour Active Directory',
    titleFr: 'Format d\'enregistrement DNS SRV manquant pour Active Directory',
    certification: 'lpic-3',
    topicNumber: 302,
    objectiveId: '302.1',
    category: 'Active Directory Domain Joining',
    scenario: 'La tentative de joindre le domaine avec "net ads join -U Administrator" échoue avec : "Failed to join domain: failed to lookup DC info for domain \'CORP.EXAMPLE.COM\' over rpc: Cannot find KDC for realm".',
    scenarioFr: 'La tentative de joindre le domaine avec "net ads join -U Administrator" échoue avec : "Failed to join domain: failed to lookup DC info for domain \'CORP.EXAMPLE.COM\' over rpc: Cannot find KDC for realm".',
    codeSnippet: `# host -t SRV _kerberos._tcp.corp.example.com
Host _kerberos._tcp.corp.example.com not found: 3(NXDOMAIN)
# host -t SRV _ldap._tcp.dc._msdcs.corp.example.com
Host _ldap._tcp.dc._msdcs.corp.example.com not found: 3(NXDOMAIN)`,
    language: 'bash',
    bugDescription: 'Le client Linux utilise un résolveur DNS public ou mal configuré qui ne possède pas les enregistrements de service SRV Active Directory (_kerberos._tcp et _ldap._tcp).',
    bugDescriptionFr: 'Le client Linux utilise un résolveur DNS public ou mal configuré qui ne possède pas les enregistrements de service SRV Active Directory (_kerberos._tcp et _ldap._tcp).',
    options: [
      {
        id: 'opt-1',
        label: 'Le serveur DNS configuré dans /etc/resolv.conf n\'est pas le contrôleur de domaine AD et ne peut pas résoudre les enregistrements SRV indispensables',
        labelFr: 'Le serveur DNS configuré dans /etc/resolv.conf n\'est pas le contrôleur de domaine AD et ne peut pas résoudre les enregistrements SRV indispensables',
        isCorrect: true,
        explanation: 'Active Directory repose intégralement sur les enregistrements DNS SRV (_ldap._tcp, _kerberos._tcp). Un client Samba doit obligatoirement utiliser un serveur DNS capable de résoudre la zone AD.',
        explanationFr: 'Active Directory repose intégralement sur les enregistrements DNS SRV (_ldap._tcp, _kerberos._tcp). Un client Samba doit obligatoirement utiliser un serveur DNS capable de résoudre la zone AD.'
      },
      {
        id: 'opt-2',
        label: 'net ads join ne supporte que la résolution NetBIOS WINS et ignore le DNS',
        labelFr: 'net ads join ne supporte que la résolution NetBIOS WINS et ignore le DNS',
        isCorrect: false,
        explanation: 'Le mode ADS dépend prioritairement du DNS et de Kerberos.',
        explanationFr: 'Le mode ADS dépend prioritairement du DNS et de Kerberos.'
      },
      {
        id: 'opt-3',
        label: 'L\'enregistrement SRV doit s\'appeler _samba._tcp et non _kerberos._tcp',
        labelFr: 'L\'enregistrement SRV doit s\'appeler _samba._tcp et non _kerberos._tcp',
        isCorrect: false,
        explanation: '_kerberos._tcp et _ldap._tcp sont les noms standardisés pour la découverte des DC.',
        explanationFr: '_kerberos._tcp et _ldap._tcp sont les noms standardisés pour la découverte des DC.'
      },
      {
        id: 'opt-4',
        label: 'Le compte Administrator doit être écrit en minuscules dans net ads join',
        labelFr: 'Le compte Administrator doit être écrit en minuscules dans net ads join',
        isCorrect: false,
        explanation: 'Les noms de comptes Windows ne sont pas sensibles à la casse.',
        explanationFr: 'Les noms de comptes Windows ne sont pas sensibles à la casse.'
      }
    ],
    correctedSnippet: `# Dans /etc/resolv.conf :
nameserver 192.168.1.10  # IP du contrôleur de domaine AD
search corp.example.com`,
    fixExplanation: 'Pointer le résolveur DNS du client vers le serveur DNS du domaine Active Directory.',
    fixExplanationFr: 'Pointer le résolveur DNS du client vers le serveur DNS du domaine Active Directory.'
  },
  {
    id: 'tb-lpic3-300-18',
    title: 'Type de clé principal incorrect dans un fichier keytab',
    titleFr: 'Type de clé principal incorrect dans un fichier keytab',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.3',
    category: 'Kerberos Keytabs & Principals',
    scenario: 'Un serveur HTTP tente de valider l\'authentification Negotiate/SPNEGO via son fichier /etc/krb5.keytab, mais le service logue : "Keytab contains no suitable keys for HTTP/web.corp.com@CORP.COM".',
    scenarioFr: 'Un serveur HTTP tente de valider l\'authentification Negotiate/SPNEGO via son fichier /etc/krb5.keytab, mais le service logue : "Keytab contains no suitable keys for HTTP/web.corp.com@CORP.COM".',
    codeSnippet: `# klist -k /etc/krb5.keytab
Keytab name: FILE:/etc/krb5.keytab
KVNO Principal
---- --------------------------------------------------
   1 host/web.corp.com@CORP.COM
   1 host/web.corp.com@CORP.COM`,
    language: 'bash',
    bugDescription: 'Le keytab ne contient que le principal host/web... alors que le serveur web requiert le principal de service HTTP/web.corp.com@CORP.COM.',
    bugDescriptionFr: 'Le keytab ne contient que le principal host/web... alors que le serveur web requiert le principal de service HTTP/web.corp.com@CORP.COM.',
    options: [
      {
        id: 'opt-1',
        label: 'Le fichier keytab ne contient pas le principal de service "HTTP/web.corp.com@CORP.COM" requis pour les services web Kerberos',
        labelFr: 'Le fichier keytab ne contient pas le principal de service "HTTP/web.corp.com@CORP.COM" requis pour les services web Kerberos',
        isCorrect: true,
        explanation: 'Chaque service réseau requiert son propre Service Principal Name (SPN). Pour Apache/Nginx avec GSSAPI, le principal doit commencer par HTTP/.',
        explanationFr: 'Chaque service réseau requiert son propre Service Principal Name (SPN). Pour Apache/Nginx avec GSSAPI, le principal doit commencer par HTTP/.'
      },
      {
        id: 'opt-2',
        label: 'Le KVNO (Key Version Number) doit obligatoirement être supérieur à 10',
        labelFr: 'Le KVNO (Key Version Number) doit obligatoirement être supérieur à 10',
        isCorrect: false,
        explanation: 'Le KVNO commence classiquement à 1 et est incrémenté à chaque régénération de clé.',
        explanationFr: 'Le KVNO commence classiquement à 1 et est incrémenté à chaque régénération de clé.'
      },
      {
        id: 'opt-3',
        label: 'klist ne peut pas lire les fichiers keytab protégés par SELinux',
        labelFr: 'klist ne peut pas lire les fichiers keytab protégés par SELinux',
        isCorrect: false,
        explanation: 'klist a bien pu lire le keytab comme le montre la sortie affichée.',
        explanationFr: 'klist a bien pu lire le keytab comme le montre la sortie affichée.'
      },
      {
        id: 'opt-4',
        label: 'Les clés HTTP ne peuvent pas être stockées dans un keytab au format FILE:',
        labelFr: 'Les clés HTTP ne peuvent pas être stockées dans un keytab au format FILE:',
        isCorrect: false,
        explanation: 'FILE: est le format de fichier standard universel pour les keytabs.',
        explanationFr: 'FILE: est le format de fichier standard universel pour les keytabs.'
      }
    ],
    correctedSnippet: `# Générer et ajouter la clé HTTP au keytab via kadmin :
kadmin -p admin/admin -q "ktadd -k /etc/krb5.keytab HTTP/web.corp.com@CORP.COM"`,
    fixExplanation: 'Extraire le principal HTTP/fqdn@REALM dans le fichier keytab du serveur web avec ktadd.',
    fixExplanationFr: 'Extraire le principal HTTP/fqdn@REALM dans le fichier keytab du serveur web avec ktadd.'
  },
  {
    id: 'tb-lpic3-300-19',
    title: 'Mauvais paramètre slapd pour activer TLS/SSL',
    titleFr: 'Mauvais paramètre slapd pour activer TLS/SSL',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.3',
    category: 'OpenLDAP TLS & Security',
    scenario: 'Après avoir configuré les certificats SSL dans cn=config, la commande "openssl s_client -connect localhost:636" refuse la connexion avec "Connection refused", bien que slapd soit actif sur le port 389.',
    scenarioFr: 'Après avoir configuré les certificats SSL dans cn=config, la commande "openssl s_client -connect localhost:636" refuse la connexion avec "Connection refused", bien que slapd soit actif sur le port 389.',
    codeSnippet: `# /etc/default/slapd (Debian) ou /etc/sysconfig/slapd (RHEL)
SLAPD_URLS="ldap:/// ldapi:///"`,
    language: 'config',
    bugDescription: 'La variable de démarrage SLAPD_URLS ne contient pas le schéma "ldaps:///", le démon slapd n\'écoute donc pas sur le port sécurisé 636.',
    bugDescriptionFr: 'La variable de démarrage SLAPD_URLS ne contient pas le schéma "ldaps:///", le démon slapd n\'écoute donc pas sur le port sécurisé 636.',
    options: [
      {
        id: 'opt-1',
        label: 'Le schéma "ldaps:///" est absent de SLAPD_URLS, slapd n\'ouvre donc pas le socket d\'écoute SSL sur le port 636',
        labelFr: 'Le schéma "ldaps:///" est absent de SLAPD_URLS, slapd n\'ouvre donc pas le socket d\'écoute SSL sur le port 636',
        isCorrect: true,
        explanation: 'Pour écouter sur le port LDAPS (636), slapd doit impérativement être lancé avec l\'URL "ldaps:///" dans ses arguments de démarrage.',
        explanationFr: 'Pour écouter sur le port LDAPS (636), slapd doit impérativement être lancé avec l\'URL "ldaps:///" dans ses arguments de démarrage.'
      },
      {
        id: 'opt-2',
        label: 'ldapi:/// doit obligatoirement être supprimé car il désactive les sockets réseau',
        labelFr: 'ldapi:/// doit obligatoirement être supprimé car il désactive les sockets réseau',
        isCorrect: false,
        explanation: 'ldapi:/// correspond à la communication par socket UNIX local (IPC), indispensable pour administrer cn=config en SASL EXTERNAL.',
        explanationFr: 'ldapi:/// correspond à la communication par socket UNIX local (IPC), indispensable pour administrer cn=config en SASL EXTERNAL.'
      },
      {
        id: 'opt-3',
        label: 'Le port 636 ne peut être ouvert qu\'en recompilant slapd avec le support gnutls',
        labelFr: 'Le port 636 ne peut être ouvert qu\'en recompilant slapd avec le support gnutls',
        isCorrect: false,
        explanation: 'Tous les paquets standards intègrent le support TLS/OpenSSL.',
        explanationFr: 'Tous les paquets standards intègrent le support TLS/OpenSSL.'
      },
      {
        id: 'opt-4',
        label: 'Le protocole TLS sous OpenLDAP ne fonctionne qu\'en StartTLS sur le port 389',
        labelFr: 'Le protocole TLS sous OpenLDAP ne fonctionne qu\'en StartTLS sur le port 389',
        isCorrect: false,
        explanation: 'OpenLDAP supporte à la fois StartTLS sur le port 389 et LDAPS direct sur le port 636.',
        explanationFr: 'OpenLDAP supporte à la fois StartTLS sur le port 389 et LDAPS direct sur le port 636.'
      }
    ],
    correctedSnippet: `SLAPD_URLS="ldap:/// ldaps:/// ldapi:///"`,
    fixExplanation: 'Ajouter ldaps:/// dans SLAPD_URLS puis redémarrer slapd pour activer l\'écoute sur le port 636.',
    fixExplanationFr: 'Ajouter ldaps:/// dans SLAPD_URLS puis redémarrer slapd pour activer l\'écoute sur le port 636.'
  },
  {
    id: 'tb-lpic3-300-20',
    title: 'Échec de résolution de groupe Active Directory dans smb.conf (espace)',
    titleFr: 'Échec de résolution de groupe Active Directory dans smb.conf (espace)',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.2',
    category: 'Samba Share Access Control',
    scenario: 'Un administrateur veut restreindre l\'accès à un partage comptable au groupe AD "Domain Admins". Aucun membre du groupe ne parvient à se connecter.',
    scenarioFr: 'Un administrateur veut restreindre l\'accès à un partage comptable au groupe AD "Domain Admins". Aucun membre du groupe ne parvient à se connecter.',
    codeSnippet: `[compta]
   path = /srv/samba/compta
   read only = no
   valid users = @Domain Admins`,
    language: 'config',
    bugDescription: 'Dans smb.conf, les noms de groupes contenant des espaces doivent impérativement être entourés de guillemets ("@Domain Admins"), sinon Samba tronque le nom au premier mot.',
    bugDescriptionFr: 'Dans smb.conf, les noms de groupes contenant des espaces doivent impérativement être entourés de guillemets ("@Domain Admins"), sinon Samba tronque le nom au premier mot.',
    options: [
      {
        id: 'opt-1',
        label: 'Les noms d\'utilisateurs ou de groupes contenant des espaces doivent impérativement être entourés de guillemets doubles (ex: @"Domain Admins")',
        labelFr: 'Les noms d\'utilisateurs ou de groupes contenant des espaces doivent impérativement être entourés de guillemets doubles (ex: @"Domain Admins")',
        isCorrect: true,
        explanation: 'Sans guillemets, l\'espace est interprété comme un séparateur de liste : Samba cherche un groupe nommé "@Domain" puis un utilisateur nommé "Admins".',
        explanationFr: 'Sans guillemets, l\'espace est interprété comme un séparateur de liste : Samba cherche un groupe nommé "@Domain" puis un utilisateur nommé "Admins".'
      },
      {
        id: 'opt-2',
        label: 'Le préfixe "@" est réservé aux groupes locaux ; les groupes AD doivent utiliser le préfixe "+"',
        labelFr: 'Le préfixe "@" est réservé aux groupes locaux ; les groupes AD doivent utiliser le préfixe "+"',
        isCorrect: false,
        explanation: 'Dans Samba, @ et + désignent tous deux les groupes.',
        explanationFr: 'Dans Samba, @ et + désignent tous deux les groupes.'
      },
      {
        id: 'opt-3',
        label: 'Il est formellement interdit de donner des droits à Domain Admins sous Linux',
        labelFr: 'Il est formellement interdit de donner des droits à Domain Admins sous Linux',
        isCorrect: false,
        explanation: 'N\'importe quel groupe du domaine peut être autorisé dans valid users.',
        explanationFr: 'N\'importe quel groupe du domaine peut être autorisé dans valid users.'
      },
      {
        id: 'opt-4',
        label: 'valid users ne s\'applique pas aux répertoires dont le chemin est sous /srv/',
        labelFr: 'valid users ne s\'applique pas aux répertoires dont le chemin est sous /srv/',
        isCorrect: false,
        explanation: 'L\'emplacement du dossier sur le système de fichiers n\'a aucun impact sur la directive valid users.',
        explanationFr: 'L\'emplacement du dossier sur le système de fichiers n\'a aucun impact sur la directive valid users.'
      }
    ],
    correctedSnippet: `[compta]
   path = /srv/samba/compta
   read only = no
   valid users = @"Domain Admins"`,
    fixExplanation: 'Encadrer le nom de groupe avec des guillemets doubles pour préserver les espaces dans le nom du groupe Windows.',
    fixExplanationFr: 'Encadrer le nom de groupe avec des guillemets doubles pour préserver les espaces dans le nom du groupe Windows.'
  },
  {
    id: 'tb-lpic3-300-21',
    title: 'Mauvaise déclaration de backend dans OpenLDAP cn=config',
    titleFr: 'Mauvaise déclaration de backend dans OpenLDAP cn=config',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.1',
    category: 'OpenLDAP Configuration Engine',
    scenario: 'Lors de la tentative d\'ajout d\'un module de superposition (overlay) memberof, ldapadd renvoie l\'erreur : "ldap_add: No such object (32)".',
    scenarioFr: 'Lors de la tentative d\'ajout d\'un module de superposition (overlay) memberof, ldapadd renvoie l\'erreur : "ldap_add: No such object (32)".',
    codeSnippet: `dn: olcOverlay=memberof,olcDatabase={2}mdb,cn=config
objectClass: olcConfig
objectClass: olcMemberOf
olcOverlay: memberof`,
    language: 'ldap',
    bugDescription: 'L\'objet parent olcDatabase={2}mdb n\'existe pas dans l\'arborescence cn=config (la base de données MDB principale porte généralement l\'index {1}).',
    bugDescriptionFr: 'L\'objet parent olcDatabase={2}mdb n\'existe pas dans l\'arborescence cn=config (la base de données MDB principale porte généralement l\'index {1}).',
    options: [
      {
        id: 'opt-1',
        label: 'L\'erreur 32 (No such object) indique que le DN parent (olcDatabase={2}mdb,cn=config) n\'existe pas dans la configuration courante',
        labelFr: 'L\'erreur 32 (No such object) indique que le DN parent (olcDatabase={2}mdb,cn=config) n\'existe pas dans la configuration courante',
        isCorrect: true,
        explanation: 'Il faut d\'abord vérifier les index exacts des bases existantes avec ldapsearch -Y EXTERNAL -H ldapi:/// -b "cn=config" "(olcDatabase=*)". La base de données principale est généralement olcDatabase={1}mdb.',
        explanationFr: 'Il faut d\'abord vérifier les index exacts des bases existantes avec ldapsearch -Y EXTERNAL -H ldapi:/// -b "cn=config" "(olcDatabase=*)". La base de données principale est généralement olcDatabase={1}mdb.'
      },
      {
        id: 'opt-2',
        label: 'Le module memberof ne peut être appliqué que sur cn=schema',
        labelFr: 'Le module memberof ne peut être appliqué que sur cn=schema',
        isCorrect: false,
        explanation: 'memberof est un overlay de base de données qui s\'applique sur l\'objet olcDatabase.',
        explanationFr: 'memberof est un overlay de base de données qui s\'applique sur l\'objet olcDatabase.'
      },
      {
        id: 'opt-3',
        label: 'L\'overlay memberof a été renommé groupofnames dans OpenLDAP',
        labelFr: 'L\'overlay memberof a été renommé groupofnames dans OpenLDAP',
        isCorrect: false,
        explanation: 'memberof est le nom officiel du module d\'overlay gérant la réciprocité de groupe.',
        explanationFr: 'memberof est le nom officiel du module d\'overlay gérant la réciprocité de groupe.'
      },
      {
        id: 'opt-4',
        label: 'ldapadd ne peut pas être utilisé sur cn=config, seul slapadd est toléré',
        labelFr: 'ldapadd ne peut pas être utilisé sur cn=config, seul slapadd est toléré',
        isCorrect: false,
        explanation: 'ldapadd en ligne avec ldapi:/// est la méthode dynamique recommandée pour modifier cn=config.',
        explanationFr: 'ldapadd en ligne avec ldapi:/// est la méthode dynamique recommandée pour modifier cn=config.'
      }
    ],
    correctedSnippet: `# Vérifier l'index exact :
# ldapsearch -Y EXTERNAL -H ldapi:/// -b "cn=config" "olcDatabase" dn
dn: olcOverlay=memberof,olcDatabase={1}mdb,cn=config
objectClass: olcConfig
objectClass: olcMemberOf
olcOverlay: memberof`,
    fixExplanation: 'Utiliser le DN exact de la base de données existante (souvent olcDatabase={1}mdb).',
    fixExplanationFr: 'Utiliser le DN exact de la base de données existante (souvent olcDatabase={1}mdb).'
  },
  {
    id: 'tb-lpic3-300-22',
    title: 'Défaut de configuration SASL EXTERNAL pour slapd',
    titleFr: 'Défaut de configuration SASL EXTERNAL pour slapd',
    certification: 'lpic-3',
    topicNumber: 303,
    objectiveId: '303.3',
    category: 'OpenLDAP SASL Authentication',
    scenario: 'L\'administrateur exécute "ldapwhoami -Y EXTERNAL -H ldapi:///" en tant que root, mais reçoit l\'erreur : "ldap_sasl_interactive_bind_s: Unknown authentication method (-6)".',
    scenarioFr: 'L\'administrateur exécute "ldapwhoami -Y EXTERNAL -H ldapi:///" en tant que root, mais reçoit l\'erreur : "ldap_sasl_interactive_bind_s: Unknown authentication method (-6)".',
    codeSnippet: `# ldapwhoami -Y EXTERNAL -H ldapi:///
SASL/EXTERNAL authentication started
ldap_sasl_interactive_bind_s: Unknown authentication method (-6)`,
    language: 'bash',
    bugDescription: 'Les paquets de bibliothèques SASL (cyrus-sasl ou libsasl2-modules) nécessaires au support des mécanismes d\'authentification SASL externe ne sont pas installés sur la machine.',
    bugDescriptionFr: 'Les paquets de bibliothèques SASL (cyrus-sasl ou libsasl2-modules) nécessaires au support des mécanismes d\'authentification SASL externe ne sont pas installés sur la machine.',
    options: [
      {
        id: 'opt-1',
        label: 'Le module SASL correspondant (libsasl2-modules ou cyrus-sasl) n\'est pas installé sur le système d\'exploitation',
        labelFr: 'Le module SASL correspondant (libsasl2-modules ou cyrus-sasl) n\'est pas installé sur le système d\'exploitation',
        isCorrect: true,
        explanation: 'Le mécanisme EXTERNAL via socket IPC Unix requiert les bibliothèques d\'extension Cyrus SASL pour que le client ldaputils puisse négocier le mécanisme.',
        explanationFr: 'Le mécanisme EXTERNAL via socket IPC Unix requiert les bibliothèques d\'extension Cyrus SASL pour que le client ldaputils puisse négocier le mécanisme.'
      },
      {
        id: 'opt-2',
        label: 'EXTERNAL n\'est compatible qu\'avec des connexions TCP sur le port 389',
        labelFr: 'EXTERNAL n\'est compatible qu\'avec des connexions TCP sur le port 389',
        isCorrect: false,
        explanation: 'EXTERNAL s\'utilise principalement sur les sockets UNIX locaux (ldapi:///) ou avec des certificats TLS clients.',
        explanationFr: 'EXTERNAL s\'utilise principalement sur les sockets UNIX locaux (ldapi:///) ou avec des certificats TLS clients.'
      },
      {
        id: 'opt-3',
        label: 'Il faut passer le paramètre -x pour forcer EXTERNAL',
        labelFr: 'Il faut passer le paramètre -x pour forcer EXTERNAL',
        isCorrect: false,
        explanation: '-x force l\'authentification simple (simple bind) et désactive SASL.',
        explanationFr: '-x force l\'authentification simple (simple bind) et désactive SASL.'
      },
      {
        id: 'opt-4',
        label: 'root doit d\'abord créer un compte dans la base dc=corp,dc=com',
        labelFr: 'root doit d\'abord créer un compte dans la base dc=corp,dc=com',
        isCorrect: false,
        explanation: 'SASL EXTERNAL mappe directement l\'UID 0 du noyau Linux sans nécessiter d\'entrée LDAP utilisateur.',
        explanationFr: 'SASL EXTERNAL mappe directement l\'UID 0 du noyau Linux sans nécessiter d\'entrée LDAP utilisateur.'
      }
    ],
    correctedSnippet: `apt-get install libsasl2-modules  # sur Debian/Ubuntu
# ou :
dnf install cyrus-sasl-plain cyrus-sasl  # sur RHEL/CentOS`,
    fixExplanation: 'Installer les plugins Cyrus SASL pour rendre les mécanismes EXTERNAL, GSSAPI et PLAIN opérationnels.',
    fixExplanationFr: 'Installer les plugins Cyrus SASL pour rendre les mécanismes EXTERNAL, GSSAPI et PLAIN opérationnels.'
  },
  {
    id: 'tb-lpic3-300-23',
    title: 'Directive PAM pam_wheel bloquant les utilisateurs autorisés',
    titleFr: 'Directive PAM pam_wheel bloquant les utilisateurs autorisés',
    certification: 'lpic-3',
    topicNumber: 304,
    objectiveId: '304.1',
    category: 'PAM Group Restrictions',
    scenario: 'L\'administrateur a activé pam_wheel.so pour restreindre la commande "su" aux seuls membres du groupe d\'administration. Pourtant un utilisateur membre de "wheel" reçoit toujours "su: Permission denied".',
    scenarioFr: 'L\'administrateur a activé pam_wheel.so pour restreindre la commande "su" aux seuls membres du groupe d\'administration. Pourtant un utilisateur membre de "wheel" reçoit toujours "su: Permission denied".',
    codeSnippet: `# /etc/pam.d/su
auth required pam_wheel.so use_uid group=adm`,
    language: 'config',
    bugDescription: 'La directive spécifie "group=adm" au lieu du groupe par défaut "wheel" auquel appartient l\'utilisateur.',
    bugDescriptionFr: 'La directive spécifie "group=adm" au lieu du groupe par défaut "wheel" auquel appartient l\'utilisateur.',
    options: [
      {
        id: 'opt-1',
        label: 'La directive force "group=adm" ; l\'utilisateur doit soit être ajouté au groupe adm, soit la directive doit spécifier group=wheel',
        labelFr: 'La directive force "group=adm" ; l\'utilisateur doit soit être ajouté au groupe adm, soit la directive doit spécifier group=wheel',
        isCorrect: true,
        explanation: 'L\'argument group=adm surcharge le groupe cible par défaut (qui est wheel). Comme l\'utilisateur n\'est pas dans adm, pam_wheel rejette l\'élévation de privilèges.',
        explanationFr: 'L\'argument group=adm surcharge le groupe cible par défaut (qui est wheel). Comme l\'utilisateur n\'est pas dans adm, pam_wheel rejette l\'élévation de privilèges.'
      },
      {
        id: 'opt-2',
        label: 'pam_wheel.so ne fonctionne qu\'avec su - et refuse su sans tiret',
        labelFr: 'pam_wheel.so ne fonctionne qu\'avec su - et refuse su sans tiret',
        isCorrect: false,
        explanation: 'Le module PAM s\'applique à toutes les invocations de su.',
        explanationFr: 'Le module PAM s\'applique à toutes les invocations de su.'
      },
      {
        id: 'opt-3',
        label: 'use_uid doit obligatoirement être remplacé par use_gid',
        labelFr: 'use_uid doit obligatoirement être remplacé par use_gid',
        isCorrect: false,
        explanation: 'use_uid est l\'option recommandée pour vérifier l\'UID réel de l\'utilisateur appelant.',
        explanationFr: 'use_uid est l\'option recommandée pour vérifier l\'UID réel de l\'utilisateur appelant.'
      },
      {
        id: 'opt-4',
        label: 'Le fichier /etc/pam.d/su n\'est plus utilisé par les distributions récentes',
        labelFr: 'Le fichier /etc/pam.d/su n\'est plus utilisé par les distributions récentes',
        isCorrect: false,
        explanation: '/etc/pam.d/su est le fichier de configuration PAM standard pour l\'utilitaire su.',
        explanationFr: '/etc/pam.d/su est le fichier de configuration PAM standard pour l\'utilitaire su.'
      }
    ],
    correctedSnippet: `# /etc/pam.d/su
auth required pam_wheel.so use_uid group=wheel`,
    fixExplanation: 'Corriger le paramètre group pour cibler le groupe Unix adéquat (wheel).',
    fixExplanationFr: 'Corriger le paramètre group pour cibler le groupe Unix adéquat (wheel).'
  },
  {
    id: 'tb-lpic3-300-24',
    title: 'Problème de casse NetBIOS et nom d\'hôte dans smb.conf',
    titleFr: 'Problème de casse NetBIOS et nom d\'hôte dans smb.conf',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.1',
    category: 'Samba NetBIOS & Naming Services',
    scenario: 'Le serveur Samba refuse d\'apparaître dans l\'Explorateur Windows ou la commande "nmblookup -A 192.168.1.50" renvoie un nom tronqué.',
    scenarioFr: 'Le serveur Samba refuse d\'apparaître dans l\'Explorateur Windows ou la commande "nmblookup -A 192.168.1.50" renvoie un nom tronqué.',
    codeSnippet: `[global]
   workgroup = MONENTREPRISE
   netbios name = SERVEUR_FICHIERS_PRINCIPAL_PROD`,
    language: 'config',
    bugDescription: 'Les noms NetBIOS sont strictement limités à 15 caractères alphanumériques (le 16ème caractère étant réservé pour le type de ressource). Le nom configuré compte 30 caractères.',
    bugDescriptionFr: 'Les noms NetBIOS sont strictement limités à 15 caractères alphanumériques (le 16ème caractère étant réservé pour le type de ressource). Le nom configuré compte 30 caractères.',
    options: [
      {
        id: 'opt-1',
        label: 'Un nom NetBIOS est strictement limité à 15 caractères maximum dans le protocole SMB/CIFS',
        labelFr: 'Un nom NetBIOS est strictement limité à 15 caractères maximum dans le protocole SMB/CIFS',
        isCorrect: true,
        explanation: 'Dans la spécification NetBIOS sur TCP/IP (RFC 1001/1002), un nom fait 16 octets : exactement 15 caractères pour le nom et 1 octet final (suffixe hexadécimal 00, 20, 1B...) pour identifier le type de service.',
        explanationFr: 'Dans la spécification NetBIOS sur TCP/IP (RFC 1001/1002), un nom fait 16 octets : exactement 15 caractères pour le nom et 1 octet final (suffixe hexadécimal 00, 20, 1B...) pour identifier le type de service.'
      },
      {
        id: 'opt-2',
        label: 'Le caractère tiret bas "_" est formellement interdit dans toute la configuration smb.conf',
        labelFr: 'Le caractère tiret bas "_" est formellement interdit dans toute la configuration smb.conf',
        isCorrect: false,
        explanation: 'Le tiret bas est accepté dans les noms NetBIOS bien que déconseillé en DNS.',
        explanationFr: 'Le tiret bas est accepté dans les noms NetBIOS bien que déconseillé en DNS.'
      },
      {
        id: 'opt-3',
        label: 'netbios name doit obligatoirement être identique au paramètre workgroup',
        labelFr: 'netbios name doit obligatoirement être identique au paramètre workgroup',
        isCorrect: false,
        explanation: 'Le nom de machine (netbios name) et le groupe de travail (workgroup) sont deux concepts distincts.',
        explanationFr: 'Le nom de machine (netbios name) et le groupe de travail (workgroup) sont deux concepts distincts.'
      },
      {
        id: 'opt-4',
        label: 'Samba 4 n\'utilise plus netbios name et exige uniquement fqdn = ...',
        labelFr: 'Samba 4 n\'utilise plus netbios name et exige uniquement fqdn = ...',
        isCorrect: false,
        explanation: 'netbios name est toujours supporté et largement utilisé.',
        explanationFr: 'netbios name est toujours supporté et largement utilisé.'
      }
    ],
    correctedSnippet: `[global]
   workgroup = MONENTREPRISE
   netbios name = SRV-FICHIERS-01`,
    fixExplanation: 'Réduire le paramètre netbios name à 15 caractères maximum.',
    fixExplanationFr: 'Réduire le paramètre netbios name à 15 caractères maximum.'
  },
  {
    id: 'tb-lpic3-300-25',
    title: 'ACL Samba POSIX non synchronisée avec les vfs objects',
    titleFr: 'ACL Samba POSIX non synchronisée avec les vfs objects',
    certification: 'lpic-3',
    topicNumber: 301,
    objectiveId: '301.2',
    category: 'Samba VFS & Windows ACLs',
    scenario: 'L\'administrateur configure un partage Samba pour gérer les listes de contrôle d\'accès (ACL) avancées directement depuis l\'onglet "Sécurité" de Windows, mais les modifications de droits ne s\'enregistrent pas et échouent avec "Erreur lors de l\'application de la sécurité".',
    scenarioFr: 'L\'administrateur configure un partage Samba pour gérer les listes de contrôle d\'accès (ACL) avancées directement depuis l\'onglet "Sécurité" de Windows, mais les modifications de droits ne s\'enregistrent pas et échouent avec "Erreur lors de l\'application de la sécurité".',
    codeSnippet: `[partage_pro]
   path = /srv/samba/partage
   read only = no
   # Le module vfs acl_xattr est requis pour stocker les NT ACLs
   vfs objects = shadow_copy2`,
    language: 'config',
    bugDescription: 'Pour supporter pleinement l\'édition des ACL de sécurité Windows NT depuis l\'Explorateur Windows, le module VFS "acl_xattr" doit obligatoirement être présent dans "vfs objects".',
    bugDescriptionFr: 'Pour supporter pleinement l\'édition des ACL de sécurité Windows NT depuis l\'Explorateur Windows, le module VFS "acl_xattr" doit obligatoirement être présent dans "vfs objects".',
    options: [
      {
        id: 'opt-1',
        label: 'Il manque le module VFS "acl_xattr" dans la directive "vfs objects" pour stocker les descripteurs de sécurité Windows NT dans les attributs étendus',
        labelFr: 'Il manque le module VFS "acl_xattr" dans la directive "vfs objects" pour stocker les descripteurs de sécurité Windows NT dans les attributs étendus',
        isCorrect: true,
        explanation: 'Samba mappe les ACLs Windows riches vers les attributs étendus Linux (user.DOSATTRIB et security.NTACL) via le module vfs_acl_xattr. Sans ce module, Windows ne peut pas enregistrer les permissions fines.',
        explanationFr: 'Samba mappe les ACLs Windows riches vers les attributs étendus Linux (user.DOSATTRIB et security.NTACL) via le module vfs_acl_xattr. Sans ce module, Windows ne peut pas enregistrer les permissions fines.'
      },
      {
        id: 'opt-2',
        label: 'Le partage doit impérativement s\'appeler [IPC$]',
        labelFr: 'Le partage doit impérativement s\'appeler [IPC$]',
        isCorrect: false,
        explanation: 'IPC$ est un partage système interne réservé aux communications RPC.',
        explanationFr: 'IPC$ est un partage système interne réservé aux communications RPC.'
      },
      {
        id: 'opt-3',
        label: 'shadow_copy2 ne peut pas être combiné avec un chemin sous /srv/',
        labelFr: 'shadow_copy2 ne peut pas être combiné avec un chemin sous /srv/',
        isCorrect: false,
        explanation: 'shadow_copy2 s\'applique à n\'importe quel chemin supportant les instantanés (LVM, ZFS, Btrfs).',
        explanationFr: 'shadow_copy2 s\'applique à n\'importe quel chemin supportant les instantanés (LVM, ZFS, Btrfs).'
      },
      {
        id: 'opt-4',
        label: 'Windows 10 refuse d\'éditer des ACL sur les serveurs Linux par restriction Microsoft',
        labelFr: 'Windows 10 refuse d\'éditer des ACL sur les serveurs Linux par restriction Microsoft',
        isCorrect: false,
        explanation: 'Samba émule fidèlement les descripteurs de sécurité NTFS pour les clients Windows.',
        explanationFr: 'Samba émule fidèlement les descripteurs de sécurité NTFS pour les clients Windows.'
      }
    ],
    correctedSnippet: `[partage_pro]
   path = /srv/samba/partage
   read only = no
   vfs objects = acl_xattr shadow_copy2
   map acl inherit = yes`,
    fixExplanation: 'Ajouter acl_xattr dans la liste des modules vfs objects du partage.',
    fixExplanationFr: 'Ajouter acl_xattr dans la liste des modules vfs objects du partage.'
  }
];
