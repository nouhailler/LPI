# -*- coding: utf-8 -*-
import json

challenges_300 = [
  {
    "id": "seq-300-1",
    "title": "Provisioning a Samba 4 Active Directory Domain Controller (AD DC)",
    "titleFr": "Déploiement initial d'un contrôleur de domaine Samba 4 Active Directory (AD DC)",
    "certification": "lpic-3",
    "topicNumber": 306,
    "objectiveId": "306.1",
    "category": "Samba AD DC",
    "description": "Ordonnez les étapes fondamentales pour initialiser un contrôleur de domaine Active Directory Samba 4 sous Linux.",
    "descriptionFr": "Ordonnez les étapes fondamentales pour initialiser un contrôleur de domaine Active Directory Samba 4 sous Linux.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Suppression ou sauvegarde de l'ancien fichier smb.conf",
        "labelFr": "1. Suppression ou sauvegarde de l'ancien fichier smb.conf",
        "detail": "L'outil de provisioning exige l'absence de tout smb.conf préexistant : rm -f /etc/samba/smb.conf",
        "detailFr": "L'outil de provisioning exige l'absence de tout smb.conf préexistant : rm -f /etc/samba/smb.conf"
      },
      {
        "id": "s2",
        "label": "2. Exécution du provisionnement interactif de domaine (samba-tool)",
        "labelFr": "2. Exécution du provisionnement interactif de domaine (samba-tool)",
        "detail": "Lancer : samba-tool domain provision --use-rfc2307 --interactive pour configurer le realm et le backend DNS",
        "detailFr": "Lancer : samba-tool domain provision --use-rfc2307 --interactive pour configurer le realm et le backend DNS"
      },
      {
        "id": "s3",
        "label": "3. Configuration du fichier Kerberos système (/etc/krb5.conf)",
        "labelFr": "3. Configuration du fichier Kerberos système (/etc/krb5.conf)",
        "detail": "Lier la configuration générée : ln -sf /var/lib/samba/private/krb5.conf /etc/krb5.conf",
        "detailFr": "Lier la configuration générée : ln -sf /var/lib/samba/private/krb5.conf /etc/krb5.conf"
      },
      {
        "id": "s4",
        "label": "4. Démarrage du démon unifié Samba AD DC",
        "labelFr": "4. Démarrage du démon unifié Samba AD DC",
        "detail": "Masquer les services smbd/nmbd et démarrer : systemctl start samba-ad-dc.service",
        "detailFr": "Masquer les services smbd/nmbd et démarrer : systemctl start samba-ad-dc.service"
      },
      {
        "id": "s5",
        "label": "5. Validation des enregistrements DNS SRV et de l'authentification Kerberos",
        "labelFr": "5. Validation des enregistrements DNS SRV et de l'authentification Kerberos",
        "detail": "Tester la résolution SRV avec host -t SRV _ldap._tcp.corp.lan et valider kinit Administrator",
        "detailFr": "Tester la résolution SRV avec host -t SRV _ldap._tcp.corp.lan et valider kinit Administrator"
      }
    ],
    "explanation": "Le provisioning Samba AD DC exige : 1) suppression du smb.conf initial, 2) samba-tool domain provision, 3) lien symbolique vers krb5.conf généré, 4) démarrage exclusif du service samba-ad-dc, 5) vérification des entrées SRV et ticket kinit.",
    "explanationFr": "Le provisioning Samba AD DC exige : 1) suppression du smb.conf initial, 2) samba-tool domain provision, 3) lien symbolique vers krb5.conf généré, 4) démarrage exclusif du service samba-ad-dc, 5) vérification des entrées SRV et ticket kinit."
  },
  {
    "id": "seq-300-2",
    "title": "Configuring OpenLDAP Multi-Master Replication (MirrorMode)",
    "titleFr": "Mise en place de la réplication multi-maître OpenLDAP (MirrorMode)",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.2",
    "category": "OpenLDAP Directory",
    "description": "Ordonnez les étapes pour configurer une réplication bidirectionnelle active-active (MirrorMode) entre deux serveurs OpenLDAP avec l'overlay syncrepl.",
    "descriptionFr": "Ordonnez les étapes pour configurer une réplication bidirectionnelle active-active (MirrorMode) entre deux serveurs OpenLDAP avec l'overlay syncrepl.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Chargement du module overlay de synchronisation (syncprov.la)",
        "labelFr": "1. Chargement du module overlay de synchronisation (syncprov.la)",
        "detail": "Insérer olcModuleLoad: syncprov.la dans l'arborescence dynamique cn=config",
        "detailFr": "Insérer olcModuleLoad: syncprov.la dans l'arborescence dynamique cn=config"
      },
      {
        "id": "s2",
        "label": "2. Attribution d'un ServerID unique à chaque nœud du cluster",
        "labelFr": "2. Attribution d'un ServerID unique à chaque nœud du cluster",
        "detail": "Définir olcServerID: 1 ldap://node1 et olcServerID: 2 ldap://node2 dans cn=config",
        "detailFr": "Définir olcServerID: 1 ldap://node1 et olcServerID: 2 ldap://node2 dans cn=config"
      },
      {
        "id": "s3",
        "label": "3. Déclaration de l'overlay syncprov sur la base de données principale",
        "labelFr": "3. Déclaration de l'overlay syncprov sur la base de données principale",
        "detail": "Créer olcOverlay=syncprov,olcDatabase={1}mdb,cn=config avec olcSpCheckpoint et olcSpSessionlog",
        "detailFr": "Créer olcOverlay=syncprov,olcDatabase={1}mdb,cn=config avec olcSpCheckpoint et olcSpSessionlog"
      },
      {
        "id": "s4",
        "label": "4. Définition des strophes olcSyncrepl et activation de la directive olcMirrorMode",
        "labelFr": "4. Définition des strophes olcSyncrepl et activation de la directive olcMirrorMode",
        "detail": "Paramétrer les directives syncrepl croisées (rid, provider, credentials) et olcMirrorMode: TRUE",
        "detailFr": "Paramétrer les directives syncrepl croisées (rid, provider, credentials) et olcMirrorMode: TRUE"
      },
      {
        "id": "s5",
        "label": "5. Contrôle de la synchronisation bidirectionnelle du contexte CSN",
        "labelFr": "5. Contrôle de la synchronisation bidirectionnelle du contexte CSN",
        "detail": "Interroger l'attribut contextCSN via ldapsearch -s base sur les deux nœuds pour vérifier la convergence",
        "detailFr": "Interroger l'attribut contextCSN via ldapsearch -s base sur les deux nœuds pour vérifier la convergence"
      }
    ],
    "explanation": "La réplication OpenLDAP MirrorMode requiert : 1) chargement de syncprov, 2) identifiants de nœuds distincts olcServerID, 3) activation de l'overlay syncprov, 4) configuration de syncrepl et olcMirrorMode: TRUE, 5) vérification du contextCSN.",
    "explanationFr": "La réplication OpenLDAP MirrorMode requiert : 1) chargement de syncprov, 2) identifiants de nœuds distincts olcServerID, 3) activation de l'overlay syncprov, 4) configuration de syncrepl et olcMirrorMode: TRUE, 5) vérification du contextCSN."
  },
  {
    "id": "seq-300-3",
    "title": "Integrating a Linux Client into Active Directory using Realmd and SSSD",
    "titleFr": "Intégration d'un client Linux dans Active Directory avec Realmd et SSSD",
    "certification": "lpic-3",
    "topicNumber": 303,
    "objectiveId": "303.2",
    "category": "Domain Membership",
    "description": "Ordonnez la démarche moderne pour intégrer un poste Linux à un annuaire AD d'entreprise et autoriser automatiquement la création de répertoires personnels.",
    "descriptionFr": "Ordonnez la démarche moderne pour intégrer un poste Linux à un annuaire AD d'entreprise et autoriser automatiquement la création de répertoires personnels.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Découverte et validation des services du domaine Active Directory (realm discover)",
        "labelFr": "1. Découverte et validation des services du domaine Active Directory (realm discover)",
        "detail": "Exécuter realm discover corp.lan pour vérifier la disponibilité des KDC et DC Kerberos/LDAP",
        "detailFr": "Exécuter realm discover corp.lan pour vérifier la disponibilité des KDC et DC Kerberos/LDAP"
      },
      {
        "id": "s2",
        "label": "2. Jonction officielle du serveur au domaine (realm join)",
        "labelFr": "2. Jonction officielle du serveur au domaine (realm join)",
        "detail": "Effectuer la jonction avec un compte autorisé : realm join --user=Administrator corp.lan",
        "detailFr": "Effectuer la jonction avec un compte autorisé : realm join --user=Administrator corp.lan"
      },
      {
        "id": "s3",
        "label": "3. Activation de la création automatique des répertoires /home (pam_mkhomedir)",
        "labelFr": "3. Activation de la création automatique des répertoires /home (pam_mkhomedir)",
        "detail": "Activer le module PAM via pam-auth-update --enable mkhomedir ou authselect",
        "detailFr": "Activer le module PAM via pam-auth-update --enable mkhomedir ou authselect"
      },
      {
        "id": "s4",
        "label": "4. Restriction des accès utilisateurs par groupe de sécurité (realm permit)",
        "labelFr": "4. Restriction des accès utilisateurs par groupe de sécurité (realm permit)",
        "detail": "Limiter les connexions SSH aux membres autorisés : realm permit -g 'Linux Admins@corp.lan'",
        "detailFr": "Limiter les connexions SSH aux membres autorisés : realm permit -g 'Linux Admins@corp.lan'"
      },
      {
        "id": "s5",
        "label": "5. Vérification de l'énumération des identités AD via SSSD (id / getent)",
        "labelFr": "5. Vérification de l'énumération des identités AD via SSSD (id / getent)",
        "detail": "Valider la résolution des comptes AD avec id administrator@corp.lan et getent passwd",
        "detailFr": "Valider la résolution des comptes AD avec id administrator@corp.lan et getent passwd"
      }
    ],
    "explanation": "L'intégration Active Directory via realmd suit : 1) découverte du domaine (realm discover), 2) jonction machine (realm join), 3) activation pam_mkhomedir, 4) restriction de sécurité (realm permit), 5) contrôle SSSD (id et getent).",
    "explanationFr": "L'intégration Active Directory via realmd suit : 1) découverte du domaine (realm discover), 2) jonction machine (realm join), 3) activation pam_mkhomedir, 4) restriction de sécurité (realm permit), 5) contrôle SSSD (id et getent)."
  },
  {
    "id": "seq-300-4",
    "title": "Establishing a Two-Way Forest Trust between Samba 4 and Windows Server AD",
    "titleFr": "Établissement d'une relation d'approbation bidirectionnelle entre Samba 4 et Windows AD",
    "certification": "lpic-3",
    "topicNumber": 306,
    "objectiveId": "306.3",
    "category": "Samba AD DC",
    "description": "Placez les étapes dans l'ordre chronologique pour créer une relation de confiance de forêt entre Samba 4 et un contrôleur de domaine Windows Server.",
    "descriptionFr": "Placez les étapes dans l'ordre chronologique pour créer une relation de confiance de forêt entre Samba 4 et un contrôleur de domaine Windows Server.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration des redirections conditionnelles DNS (Conditional Forwarders)",
        "labelFr": "1. Configuration des redirections conditionnelles DNS (Conditional Forwarders)",
        "detail": "Permettre la résolution réciproque des zones DNS des deux forêts sans interférence",
        "detailFr": "Permettre la résolution réciproque des zones DNS des deux forêts sans interférence"
      },
      {
        "id": "s2",
        "label": "2. Vérification de la joignabilité Kerberos et résolution des enregistrements SRV",
        "labelFr": "2. Vérification de la joignabilité Kerberos et résolution des enregistrements SRV",
        "detail": "Vérifier avec host -t SRV _kerberos._tcp.<foret_ad> la réponse de chaque serveur",
        "detailFr": "Vérifier avec host -t SRV _kerberos._tcp.<foret_ad> la réponse de chaque serveur"
      },
      {
        "id": "s3",
        "label": "3. Création de la relation d'approbation sur le contrôleur Samba 4 (samba-tool domain trust)",
        "labelFr": "3. Création de la relation d'approbation sur le contrôleur Samba 4 (samba-tool domain trust)",
        "detail": "Exécuter samba-tool domain trust create <domaine_cible> --type=forest --direction=both",
        "detailFr": "Exécuter samba-tool domain trust create <domaine_cible> --type=forest --direction=both"
      },
      {
        "id": "s4",
        "label": "4. Validation et confirmation de l'approbation côté console Windows Server",
        "labelFr": "4. Validation et confirmation de l'approbation côté console Windows Server",
        "detail": "Ouvrir 'Domaines et approbations Active Directory' et valider le mot de passe de confiance partagé",
        "detailFr": "Ouvrir 'Domaines et approbations Active Directory' et valider le mot de passe de confiance partagé"
      },
      {
        "id": "s5",
        "label": "5. Test d'obtention de tickets Kerberos trans-forêt (Cross-Realm TGT)",
        "labelFr": "5. Test d'obtention de tickets Kerberos trans-forêt (Cross-Realm TGT)",
        "detail": "Exécuter kinit user@DOMAINE_WINDOWS.LAN depuis le serveur Samba pour certifier l'échange TGT",
        "detailFr": "Exécuter kinit user@DOMAINE_WINDOWS.LAN depuis le serveur Samba pour certifier l'échange TGT"
      }
    ],
    "explanation": "La mise en place d'une approbation de forêt exige : 1) redirection DNS conditionnelle mutuelle, 2) validation des enregistrements SRV Kerberos, 3) samba-tool domain trust create, 4) validation dans la console Windows, 5) test du TGT trans-forêt avec kinit.",
    "explanationFr": "La mise en place d'une approbation de forêt exige : 1) redirection DNS conditionnelle mutuelle, 2) validation des enregistrements SRV Kerberos, 3) samba-tool domain trust create, 4) validation dans la console Windows, 5) test du TGT trans-forêt avec kinit."
  },
  {
    "id": "seq-300-5",
    "title": "Securing OpenLDAP Communications with TLS/SSL Certificates",
    "titleFr": "Sécurisation cryptographique des échanges OpenLDAP avec TLS/SSL",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.3",
    "category": "OpenLDAP Directory",
    "description": "Ordonnez la démarche pour chiffrer les sessions de l'annuaire OpenLDAP (StartTLS et LDAPS) via la base dynamique cn=config.",
    "descriptionFr": "Ordonnez la démarche pour chiffrer les sessions de l'annuaire OpenLDAP (StartTLS et LDAPS) via la base dynamique cn=config.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déploiement des certificats X.509 et de la clé privée sur le serveur LDAP",
        "labelFr": "1. Déploiement des certificats X.509 et de la clé privée sur le serveur LDAP",
        "detail": "Copier ca.crt, ldap.crt et ldap.key dans /etc/ldap/certs/",
        "detailFr": "Copier ca.crt, ldap.crt et ldap.key dans /etc/ldap/certs/"
      },
      {
        "id": "s2",
        "label": "2. Verrouillage strict des permissions système sur la clé privée",
        "labelFr": "2. Verrouillage strict des permissions système sur la clé privée",
        "detail": "Assigner chown openldap:openldap /etc/ldap/certs/ldap.key et chmod 600",
        "detailFr": "Assigner chown openldap:openldap /etc/ldap/certs/ldap.key et chmod 600"
      },
      {
        "id": "s3",
        "label": "3. Application du fichier LDIF modifiant les attributs TLS dans cn=config",
        "labelFr": "3. Application du fichier LDIF modifiant les attributs TLS dans cn=config",
        "detail": "Modifier olcTLSCACertificateFile, olcTLSCertificateFile et olcTLSCertificateKeyFile via ldapmodify -Y EXTERNAL",
        "detailFr": "Modifier olcTLSCACertificateFile, olcTLSCertificateFile et olcTLSCertificateKeyFile via ldapmodify -Y EXTERNAL"
      },
      {
        "id": "s4",
        "label": "4. Ajustement des URI d'écoute du démon slapd (ldaps:// & ldap://)",
        "labelFr": "4. Ajustement des URI d'écoute du démon slapd (ldaps:// & ldap://)",
        "detail": "Modifier SLAPD_SERVICES=\"ldap:/// ldaps:/// ldapi:///\" dans /etc/default/slapd et redémarrer",
        "detailFr": "Modifier SLAPD_SERVICES=\"ldap:/// ldaps:/// ldapi:///\" dans /etc/default/slapd et redémarrer"
      },
      {
        "id": "s5",
        "label": "5. Validation du chiffrement StartTLS avec ldapsearch -ZZ",
        "labelFr": "5. Validation du chiffrement StartTLS avec ldapsearch -ZZ",
        "detail": "Tester une requête imposant le chiffrement : ldapsearch -x -ZZ -b 'dc=corp,dc=lan'",
        "detailFr": "Tester une requête imposant le chiffrement : ldapsearch -x -ZZ -b 'dc=corp,dc=lan'"
      }
    ],
    "explanation": "La sécurisation TLS d'OpenLDAP comprend : 1) placement des certificats, 2) droits stricts sur la clé privée, 3) modification dynamique des directives olcTLS dans cn=config, 4) configuration des protocoles d'écoute dans slapd, 5) test de conformité StartTLS avec ldapsearch -ZZ.",
    "explanationFr": "La sécurisation TLS d'OpenLDAP comprend : 1) placement des certificats, 2) droits stricts sur la clé privée, 3) modification dynamique des directives olcTLS dans cn=config, 4) configuration des protocoles d'écoute dans slapd, 5) test de conformité StartTLS avec ldapsearch -ZZ."
  },
  {
    "id": "seq-300-6",
    "title": "Enrolling a Linux Host into a Red Hat FreeIPA Domain",
    "titleFr": "Enrôlement sécurisé d'un client Linux dans un domaine FreeIPA",
    "certification": "lpic-3",
    "topicNumber": 303,
    "objectiveId": "303.3",
    "category": "Domain Membership",
    "description": "Ordonnez les étapes pour inscrire un serveur Linux dans un domaine FreeIPA et valider l'obtention de la clé keytab Kerberos.",
    "descriptionFr": "Ordonnez les étapes pour inscrire un serveur Linux dans un domaine FreeIPA et valider l'obtention de la clé keytab Kerberos.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration rigoureuse du FQDN et des serveurs DNS FreeIPA",
        "labelFr": "1. Configuration rigoureuse du FQDN et des serveurs DNS FreeIPA",
        "detail": "Définir le hostname FQDN de l'hôte et pointer /etc/resolv.conf vers l'IP du serveur FreeIPA",
        "detailFr": "Définir le hostname FQDN de l'hôte et pointer /etc/resolv.conf vers l'IP du serveur FreeIPA"
      },
      {
        "id": "s2",
        "label": "2. Lancement du programme d'enrôlement automatique (ipa-client-install)",
        "labelFr": "2. Lancement du programme d'enrôlement automatique (ipa-client-install)",
        "detail": "Exécuter : ipa-client-install --mkhomedir pour détecter le domaine et configurer PAM/SSSD",
        "detailFr": "Exécuter : ipa-client-install --mkhomedir pour détecter le domaine et configurer PAM/SSSD"
      },
      {
        "id": "s3",
        "label": "3. Authentification auprès du serveur FreeIPA avec identifiants administratifs ou OTP",
        "labelFr": "3. Authentification auprès du serveur FreeIPA avec identifiants administratifs ou OTP",
        "detail": "Saisir le compte administrateur du domaine ou un mot de passe à usage unique (One-Time Password)",
        "detailFr": "Saisir le compte administrateur du domaine ou un mot de passe à usage unique (One-Time Password)"
      },
      {
        "id": "s4",
        "label": "4. Vérification de la création de la table de clés (/etc/krb5.keytab)",
        "labelFr": "4. Vérification de la création de la table de clés (/etc/krb5.keytab)",
        "detail": "Inspecter les principaux Kerberos générés pour l'hôte : klist -k /etc/krb5.keytab",
        "detailFr": "Inspecter les principaux Kerberos générés pour l'hôte : klist -k /etc/krb5.keytab"
      },
      {
        "id": "s5",
        "label": "5. Test de connexion SSH et contrôle des règles de contrôle d'accès HBAC",
        "labelFr": "5. Test de connexion SSH et contrôle des règles de contrôle d'accès HBAC",
        "detail": "Tester l'authentification SSH avec un compte centralisé et vérifier les règles Host-Based Access Control",
        "detailFr": "Tester l'authentification SSH avec un compte centralisé et vérifier les règles Host-Based Access Control"
      }
    ],
    "explanation": "L'enrôlement FreeIPA respecte : 1) FQDN et DNS pointant vers FreeIPA, 2) ipa-client-install, 3) authentification par admin ou OTP, 4) contrôle du fichier /etc/krb5.keytab avec klist -k, 5) validation des règles HBAC en session SSH.",
    "explanationFr": "L'enrôlement FreeIPA respecte : 1) FQDN et DNS pointant vers FreeIPA, 2) ipa-client-install, 3) authentification par admin ou OTP, 4) contrôle du fichier /etc/krb5.keytab avec klist -k, 5) validation des règles HBAC en session SSH."
  },
  {
    "id": "seq-300-7",
    "title": "Creating Kerberos Service Principal and Keytab for Apache SPNEGO Authentication",
    "titleFr": "Création du principal de service Kerberos et keytab pour Apache SPNEGO",
    "certification": "lpic-3",
    "topicNumber": 305,
    "objectiveId": "305.2",
    "category": "Kerberos & SPNEGO",
    "description": "Ordonnez les étapes pour configurer l'authentification unique (Single Sign-On SPNEGO) sur un serveur Web Apache avec un KDC Kerberos.",
    "descriptionFr": "Ordonnez les étapes pour configurer l'authentification unique (Single Sign-On SPNEGO) sur un serveur Web Apache avec un KDC Kerberos.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du principal de service HTTP dans le KDC (kadmin.local)",
        "labelFr": "1. Création du principal de service HTTP dans le KDC (kadmin.local)",
        "detail": "Exécuter : kadmin.local -q 'addprinc -randkey HTTP/web.corp.lan@CORP.LAN'",
        "detailFr": "Exécuter : kadmin.local -q 'addprinc -randkey HTTP/web.corp.lan@CORP.LAN'"
      },
      {
        "id": "s2",
        "label": "2. Exportation du principal dans un fichier keytab dédié (ktadd)",
        "labelFr": "2. Exportation du principal dans un fichier keytab dédié (ktadd)",
        "detail": "Extraire les clés : kadmin.local -q 'ktadd -k /etc/apache2/http.keytab HTTP/web.corp.lan@CORP.LAN'",
        "detailFr": "Extraire les clés : kadmin.local -q 'ktadd -k /etc/apache2/http.keytab HTTP/web.corp.lan@CORP.LAN'"
      },
      {
        "id": "s3",
        "label": "3. Sécurisation des droits du fichier keytab pour l'utilisateur Apache",
        "labelFr": "3. Sécurisation des droits du fichier keytab pour l'utilisateur Apache",
        "detail": "Restreindre l'accès : chown www-data:www-data /etc/apache2/http.keytab && chmod 400",
        "detailFr": "Restreindre l'accès : chown www-data:www-data /etc/apache2/http.keytab && chmod 400"
      },
      {
        "id": "s4",
        "label": "4. Configuration de mod_auth_gssapi dans la directive du VirtualHost",
        "labelFr": "4. Configuration de mod_auth_gssapi dans la directive du VirtualHost",
        "detail": "Définir AuthType GSSAPI, GssapiCredStore keytab:/etc/apache2/http.keytab et Require valid-user",
        "detailFr": "Définir AuthType GSSAPI, GssapiCredStore keytab:/etc/apache2/http.keytab et Require valid-user"
      },
      {
        "id": "s5",
        "label": "5. Test d'authentification transparente depuis un client (curl --negotiate)",
        "labelFr": "5. Test d'authentification transparente depuis un client (curl --negotiate)",
        "detail": "Après kinit, vérifier la négociation HTTP 200 OK avec : curl --negotiate -u : http://web.corp.lan/secure",
        "detailFr": "Après kinit, vérifier la négociation HTTP 200 OK avec : curl --negotiate -u : http://web.corp.lan/secure"
      }
    ],
    "explanation": "L'authentification Web Kerberos exige : 1) création du principal HTTP/<fqdn>, 2) extraction ktadd vers http.keytab, 3) permissions strictes pour le compte apache (chmod 400), 4) configuration mod_auth_gssapi, 5) test avec curl --negotiate.",
    "explanationFr": "L'authentification Web Kerberos exige : 1) création du principal HTTP/<fqdn>, 2) extraction ktadd vers http.keytab, 3) permissions strictes pour le compte apache (chmod 400), 4) configuration mod_auth_gssapi, 5) test avec curl --negotiate."
  },
  {
    "id": "seq-300-8",
    "title": "Migrating OpenLDAP Legacy slapd.conf to Real-Time Dynamic cn=config (RTC)",
    "titleFr": "Migration d'une configuration OpenLDAP slapd.conf vers l'arbre dynamique cn=config",
    "certification": "lpic-3",
    "topicNumber": 301,
    "objectiveId": "301.1",
    "category": "OpenLDAP Directory",
    "description": "Ordonnez la séquence pour convertir un fichier statique slapd.conf traditionnel en base de données LDIF dynamique cn=config sans perte de données.",
    "descriptionFr": "Ordonnez la séquence pour convertir un fichier statique slapd.conf traditionnel en base de données LDIF dynamique cn=config sans perte de données.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du répertoire récepteur pour la nouvelle arborescence LDIF",
        "labelFr": "1. Création du répertoire récepteur pour la nouvelle arborescence LDIF",
        "detail": "Créer le dossier cible : mkdir -p /etc/ldap/slapd.d",
        "detailFr": "Créer le dossier cible : mkdir -p /etc/ldap/slapd.d"
      },
      {
        "id": "s2",
        "label": "2. Conversion de la syntaxe et génération des fichiers LDIF (slaptest)",
        "labelFr": "2. Conversion de la syntaxe et génération des fichiers LDIF (slaptest)",
        "detail": "Exécuter l'outil de conversion : slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d/",
        "detailFr": "Exécuter l'outil de conversion : slaptest -f /etc/ldap/slapd.conf -F /etc/ldap/slapd.d/"
      },
      {
        "id": "s3",
        "label": "3. Ajustement de la propriété récursive sur l'arborescence slapd.d",
        "labelFr": "3. Ajustement de la propriété récursive sur l'arborescence slapd.d",
        "detail": "Attribuer les droits à l'utilisateur du démon : chown -R openldap:openldap /etc/ldap/slapd.d/",
        "detailFr": "Attribuer les droits à l'utilisateur du démon : chown -R openldap:openldap /etc/ldap/slapd.d/"
      },
      {
        "id": "s4",
        "label": "4. Désactivation de l'ancien fichier slapd.conf et basculement du service",
        "labelFr": "4. Désactivation de l'ancien fichier slapd.conf et basculement du service",
        "detail": "Renommer slapd.conf.bak et configurer le service pour démarrer avec -F /etc/ldap/slapd.d",
        "detailFr": "Renommer slapd.conf.bak et configurer le service pour démarrer avec -F /etc/ldap/slapd.d"
      },
      {
        "id": "s5",
        "label": "5. Validation de l'accès administratif dynamique avec SASL/EXTERNAL",
        "labelFr": "5. Validation de l'accès administratif dynamique avec SASL/EXTERNAL",
        "detail": "Tester la consultation dynamique : ldapsearch -Y EXTERNAL -H ldapi:/// -b 'cn=config'",
        "detailFr": "Tester la consultation dynamique : ldapsearch -Y EXTERNAL -H ldapi:/// -b 'cn=config'"
      }
    ],
    "explanation": "La migration vers cn=config respecte : 1) création du dossier slapd.d, 2) slaptest -f slapd.conf -F slapd.d/, 3) chown récursif pour openldap, 4) désactivation de slapd.conf, 5) test de l'arbre cn=config avec ldapi:/// et SASL EXTERNAL.",
    "explanationFr": "La migration vers cn=config respecte : 1) création du dossier slapd.d, 2) slaptest -f slapd.conf -F slapd.d/, 3) chown récursif pour openldap, 4) désactivation de slapd.conf, 5) test de l'arbre cn=config avec ldapi:/// et SASL EXTERNAL."
  },
  {
    "id": "seq-300-9",
    "title": "Configuring Idmap RFC2307 Mapping in Samba for Consistent POSIX UIDs/GIDs",
    "titleFr": "Configuration du mapping Idmap RFC2307 dans Samba pour l'harmonisation POSIX",
    "certification": "lpic-3",
    "topicNumber": 304,
    "objectiveId": "304.2",
    "category": "Samba Shares & Permissions",
    "description": "Ordonnez la démarche pour mapper de manière déterministe les attributs POSIX uidNumber/gidNumber d'un Active Directory dans Samba.",
    "descriptionFr": "Ordonnez la démarche pour mapper de manière déterministe les attributs POSIX uidNumber/gidNumber d'un Active Directory dans Samba.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition de la plage de repli locale par défaut (idmap config * : backend = tdb)",
        "labelFr": "1. Définition de la plage de repli locale par défaut (idmap config * : backend = tdb)",
        "detail": "Dans smb.conf : idmap config * : backend = tdb et idmap config * : range = 10000-19999",
        "detailFr": "Dans smb.conf : idmap config * : backend = tdb et idmap config * : range = 10000-19999"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du backend AD et de la plage d'ID réservée au domaine",
        "labelFr": "2. Déclaration du backend AD et de la plage d'ID réservée au domaine",
        "detail": "Ajouter : idmap config CORP : backend = ad et idmap config CORP : range = 20000-49999",
        "detailFr": "Ajouter : idmap config CORP : backend = ad et idmap config CORP : range = 20000-49999"
      },
      {
        "id": "s3",
        "label": "3. Activation de la lecture stricte des attributs POSIX du schéma RFC2307",
        "labelFr": "3. Activation de la lecture stricte des attributs POSIX du schéma RFC2307",
        "detail": "Définir : idmap config CORP : schema_mode = rfc2307 dans la section [global]",
        "detailFr": "Définir : idmap config CORP : schema_mode = rfc2307 dans la section [global]"
      },
      {
        "id": "s4",
        "label": "4. Purge des tables de cache d'identités Winbind (net cache flush)",
        "labelFr": "4. Purge des tables de cache d'identités Winbind (net cache flush)",
        "detail": "Éliminer les anciens mappings temporaires en mémoire : net cache flush",
        "detailFr": "Éliminer les anciens mappings temporaires en mémoire : net cache flush"
      },
      {
        "id": "s5",
        "label": "5. Rechargement de Winbind et vérification de la concordance UID/GID",
        "labelFr": "5. Rechargement de Winbind et vérification de la concordance UID/GID",
        "detail": "Redémarrer winbind.service et vérifier que id alice@corp.lan renvoie l'uidNumber exact défini dans l'AD",
        "detailFr": "Redémarrer winbind.service et vérifier que id alice@corp.lan renvoie l'uidNumber exact défini dans l'AD"
      }
    ],
    "explanation": "La configuration idmap rfc2307 Samba impose : 1) plage de repli globale tdb, 2) déclaration du backend AD pour le domaine, 3) activation schema_mode = rfc2307, 4) purge du cache avec net cache flush, 5) reload winbind et validation avec id.",
    "explanationFr": "La configuration idmap rfc2307 Samba impose : 1) plage de repli globale tdb, 2) déclaration du backend AD pour le domaine, 3) activation schema_mode = rfc2307, 4) purge du cache avec net cache flush, 5) reload winbind et validation avec id."
  },
  {
    "id": "seq-300-10",
    "title": "Configuring Password Policies and Account Lockout in OpenLDAP with ppolicy Overlay",
    "titleFr": "Déploiement de la politique de mots de passe et verrouillage OpenLDAP (ppolicy)",
    "certification": "lpic-3",
    "topicNumber": 302,
    "objectiveId": "302.2",
    "category": "OpenLDAP Directory",
    "description": "Ordonnez la démarche pour implémenter une politique de verrouillage automatique de compte après échecs de saisie via l'overlay ppolicy.",
    "descriptionFr": "Ordonnez la démarche pour implémenter une politique de verrouillage automatique de compte après échecs de saisie via l'overlay ppolicy.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Chargement du schéma de politique de mot de passe (ppolicy.ldif)",
        "labelFr": "1. Chargement du schéma de politique de mot de passe (ppolicy.ldif)",
        "detail": "Intégrer le schéma officiel : ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/ppolicy.ldif",
        "detailFr": "Intégrer le schéma officiel : ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/ppolicy.ldif"
      },
      {
        "id": "s2",
        "label": "2. Chargement dynamique du module logiciel ppolicy.la dans cn=module",
        "labelFr": "2. Chargement dynamique du module logiciel ppolicy.la dans cn=module",
        "detail": "Ajouter olcModuleLoad: ppolicy.la dans cn=module{0},cn=config",
        "detailFr": "Ajouter olcModuleLoad: ppolicy.la dans cn=module{0},cn=config"
      },
      {
        "id": "s3",
        "label": "3. Déclaration de l'overlay ppolicy sur la base de données cible",
        "labelFr": "3. Déclaration de l'overlay ppolicy sur la base de données cible",
        "detail": "Créer olcOverlay=ppolicy,olcDatabase={1}mdb,cn=config en spécifiant olcPPolicyDefault",
        "detailFr": "Créer olcOverlay=ppolicy,olcDatabase={1}mdb,cn=config en spécifiant olcPPolicyDefault"
      },
      {
        "id": "s4",
        "label": "4. Création de l'objet de politique par défaut avec seuil de verrouillage (pwdMaxFailure)",
        "labelFr": "4. Création de l'objet de politique par défaut avec seuil de verrouillage (pwdMaxFailure)",
        "detail": "Insérer cn=default,ou=policies,dc=corp,dc=lan avec pwdMaxFailure: 3, pwdLockout: TRUE et pwdLockoutDuration: 900",
        "detailFr": "Insérer cn=default,ou=policies,dc=corp,dc=lan avec pwdMaxFailure: 3, pwdLockout: TRUE et pwdLockoutDuration: 900"
      },
      {
        "id": "s5",
        "label": "5. Test du verrouillage de compte après 3 échecs consécutifs d'authentification",
        "labelFr": "5. Test du verrouillage de compte après 3 échecs consécutifs d'authentification",
        "detail": "Tenter 3 connexions erronées avec ldapwhoami et vérifier le code retour d'erreur 'Account locked'",
        "detailFr": "Tenter 3 connexions erronées avec ldapwhoami et vérifier le code retour d'erreur 'Account locked'"
      }
    ],
    "explanation": "L'overlay ppolicy nécessite : 1) schéma ppolicy.ldif, 2) chargement module ppolicy.la, 3) activation overlay sur olcDatabase, 4) création de l'entrée pwdPolicy (pwdMaxFailure, pwdLockout), 5) test du verrouillage effectif.",
    "explanationFr": "L'overlay ppolicy nécessite : 1) schéma ppolicy.ldif, 2) chargement module ppolicy.la, 3) activation overlay sur olcDatabase, 4) création de l'entrée pwdPolicy (pwdMaxFailure, pwdLockout), 5) test du verrouillage effectif."
  }
]

print(f"Prepared {len(challenges_300)} challenges for LPIC-3 300")
