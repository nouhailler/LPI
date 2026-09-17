import { SequencingChallenge } from '../types';

export const lpic2Sequencing202: SequencingChallenge[] = [
  {
    "id": "seq-202-1",
    "title": "Configuring and Validating a Primary DNS Forward Zone in BIND 9",
    "titleFr": "Déploiement et validation d'une zone DNS directe primaire dans BIND 9",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS and BIND 9",
    "description": "Ordonnez les étapes pour déclarer, créer, contrôler la syntaxe et charger une nouvelle zone maître dans un serveur BIND 9.",
    "descriptionFr": "Ordonnez les étapes pour déclarer, créer, contrôler la syntaxe et charger une nouvelle zone maître dans un serveur BIND 9.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déclaration du bloc de zone maître dans /etc/bind/named.conf.local",
        "labelFr": "1. Déclaration du bloc de zone maître dans /etc/bind/named.conf.local",
        "detail": "Définir : zone 'example.com' { type master; file '/etc/bind/db.example.com'; };",
        "detailFr": "Définir : zone 'example.com' { type master; file '/etc/bind/db.example.com'; };"
      },
      {
        "id": "s2",
        "label": "2. Rédaction du fichier de zone avec enregistrements $TTL, SOA et NS",
        "labelFr": "2. Rédaction du fichier de zone avec enregistrements $TTL, SOA et NS",
        "detail": "Créer db.example.com avec $TTL, le numéro de série YYYYMMDDNN et les enregistrements A/MX obligatoires",
        "detailFr": "Créer db.example.com avec $TTL, le numéro de série YYYYMMDDNN et les enregistrements A/MX obligatoires"
      },
      {
        "id": "s3",
        "label": "3. Contrôle syntaxique du fichier de configuration principal (named-checkconf)",
        "labelFr": "3. Contrôle syntaxique du fichier de configuration principal (named-checkconf)",
        "detail": "Vérifier la validité des directives globales et des accolades sans erreur",
        "detailFr": "Vérifier la validité des directives globales et des accolades sans erreur"
      },
      {
        "id": "s4",
        "label": "4. Contrôle d'intégrité du fichier de zone (named-checkzone)",
        "labelFr": "4. Contrôle d'intégrité du fichier de zone (named-checkzone)",
        "detail": "Exécuter named-checkzone example.com /etc/bind/db.example.com et vérifier le code retour OK",
        "detailFr": "Exécuter named-checkzone example.com /etc/bind/db.example.com et vérifier le code retour OK"
      },
      {
        "id": "s5",
        "label": "5. Rechargement dynamique de la zone en production (rndc reload)",
        "labelFr": "5. Rechargement dynamique de la zone en production (rndc reload)",
        "detail": "Recharger la configuration à chaud sans coupure de service : rndc reload example.com",
        "detailFr": "Recharger la configuration à chaud sans coupure de service : rndc reload example.com"
      }
    ],
    "explanation": "La création d'une zone BIND 9 suit rigoureusement : déclaration dans named.conf.local -> rédaction du fichier de zone (SOA/NS/A) -> named-checkconf -> named-checkzone -> rndc reload.",
    "explanationFr": "La création d'une zone BIND 9 suit rigoureusement : déclaration dans named.conf.local -> rédaction du fichier de zone (SOA/NS/A) -> named-checkconf -> named-checkzone -> rndc reload."
  },
  {
    "id": "seq-202-2",
    "title": "Securing Zone Transfers (AXFR) with TSIG Transaction Signatures",
    "titleFr": "Sécurisation des transferts de zone DNS (AXFR) par signature TSIG",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "DNS and BIND 9",
    "description": "Ordonnez les étapes pour sécuriser les échanges entre serveur primaire et serveur secondaire avec une clé partagée TSIG.",
    "descriptionFr": "Ordonnez les étapes pour sécuriser les échanges entre serveur primaire et serveur secondaire avec une clé partagée TSIG.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération de la clé secrète TSIG (tsig-keygen)",
        "labelFr": "1. Génération de la clé secrète TSIG (tsig-keygen)",
        "detail": "Générer la clé partagée HMAC-SHA256 : tsig-keygen -a hmac-sha256 transfer-key > /etc/bind/tsig.key",
        "detailFr": "Générer la clé partagée HMAC-SHA256 : tsig-keygen -a hmac-sha256 transfer-key > /etc/bind/tsig.key"
      },
      {
        "id": "s2",
        "label": "2. Déploiement du fichier tsig.key sur les deux serveurs (Primaire & Secondaire)",
        "labelFr": "2. Déploiement du fichier tsig.key sur les deux serveurs (Primaire & Secondaire)",
        "detail": "Copier la clé de manière chiffrée (SCP) et restreindre les droits (chmod 640 root:bind)",
        "detailFr": "Copier la clé de manière chiffrée (SCP) et restreindre les droits (chmod 640 root:bind)"
      },
      {
        "id": "s3",
        "label": "3. Restriction des transferts sur le serveur primaire (allow-transfer)",
        "labelFr": "3. Restriction des transferts sur le serveur primaire (allow-transfer)",
        "detail": "Dans named.conf du primaire : allow-transfer { key 'transfer-key'; };",
        "detailFr": "Dans named.conf du primaire : allow-transfer { key 'transfer-key'; };"
      },
      {
        "id": "s4",
        "label": "4. Configuration de la clause server sur le secondaire (keys)",
        "labelFr": "4. Configuration de la clause server sur le secondaire (keys)",
        "detail": "Dans named.conf du secondaire : server <IP_primaire> { keys { 'transfer-key'; }; };",
        "detailFr": "Dans named.conf du secondaire : server <IP_primaire> { keys { 'transfer-key'; }; };"
      },
      {
        "id": "s5",
        "label": "5. Rechargement et test du transfert signé (dig AXFR -k)",
        "labelFr": "5. Rechargement et test du transfert signé (dig AXFR -k)",
        "detail": "Vérifier le transfert authentifié : dig @<IP_primaire> example.com AXFR -k /etc/bind/tsig.key",
        "detailFr": "Vérifier le transfert authentifié : dig @<IP_primaire> example.com AXFR -k /etc/bind/tsig.key"
      }
    ],
    "explanation": "La mise en place de TSIG impose : 1) génération de la clé tsig-keygen, 2) copie et droits stricts sur les deux serveurs, 3) allow-transfer avec la clé sur le primaire, 4) directive server { keys ... } sur le secondaire, 5) test avec dig AXFR -k.",
    "explanationFr": "La mise en place de TSIG impose : 1) génération de la clé tsig-keygen, 2) copie et droits stricts sur les deux serveurs, 3) allow-transfer avec la clé sur le primaire, 4) directive server { keys ... } sur le secondaire, 5) test avec dig AXFR -k."
  },
  {
    "id": "seq-202-3",
    "title": "Signing a BIND 9 DNS Zone with DNSSEC",
    "titleFr": "Signature cryptographique complète d'une zone BIND 9 avec DNSSEC",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.3",
    "category": "DNS and BIND 9",
    "description": "Placez les étapes dans l'ordre chronologique exact pour générer les clés ZSK et KSK, signer la zone et exporter l'enregistrement DS.",
    "descriptionFr": "Placez les étapes dans l'ordre chronologique exact pour générer les clés ZSK et KSK, signer la zone et exporter l'enregistrement DS.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération de la clé de signature de zone (Zone Signing Key - ZSK)",
        "labelFr": "1. Génération de la clé de signature de zone (Zone Signing Key - ZSK)",
        "detail": "Générer la paire de clés ZSK : dnssec-keygen -a ECDSAP256SHA256 example.com",
        "detailFr": "Générer la paire de clés ZSK : dnssec-keygen -a ECDSAP256SHA256 example.com"
      },
      {
        "id": "s2",
        "label": "2. Génération de la clé de signature de clé (Key Signing Key - KSK)",
        "labelFr": "2. Génération de la clé de signature de clé (Key Signing Key - KSK)",
        "detail": "Générer la clé maîtresse avec le flag KSK (-f KSK) : dnssec-keygen -f KSK -a ECDSAP256SHA256 example.com",
        "detailFr": "Générer la clé maîtresse avec le flag KSK (-f KSK) : dnssec-keygen -f KSK -a ECDSAP256SHA256 example.com"
      },
      {
        "id": "s3",
        "label": "3. Inclusion des clés publiques DNSKEY dans le fichier de zone",
        "labelFr": "3. Inclusion des clés publiques DNSKEY dans le fichier de zone",
        "detail": "Ajouter les directives $INCLUDE des fichiers .key publics dans /etc/bind/db.example.com",
        "detailFr": "Ajouter les directives $INCLUDE des fichiers .key publics dans /etc/bind/db.example.com"
      },
      {
        "id": "s4",
        "label": "4. Signature de la zone et génération des enregistrements RRSIG (dnssec-signzone)",
        "labelFr": "4. Signature de la zone et génération des enregistrements RRSIG (dnssec-signzone)",
        "detail": "Signer la zone : dnssec-signzone -A -3 $(head -c 16 /dev/urandom | sha1sum | cut -b 1-16) -N INCREMENT -o example.com db.example.com",
        "detailFr": "Signer la zone : dnssec-signzone -A -3 $(head -c 16 /dev/urandom | sha1sum | cut -b 1-16) -N INCREMENT -o example.com db.example.com"
      },
      {
        "id": "s5",
        "label": "5. Publication du condensé d'empreinte DS chez le bureau d'enregistrement (Registrar)",
        "labelFr": "5. Publication du condensé d'empreinte DS chez le bureau d'enregistrement (Registrar)",
        "detail": "Transmettre l'enregistrement dsset-example.com. à la zone parente pour fermer la chaîne de confiance",
        "detailFr": "Transmettre l'enregistrement dsset-example.com. à la zone parente pour fermer la chaîne de confiance"
      }
    ],
    "explanation": "La signature DNSSEC manuelle exige : 1) génération ZSK, 2) génération KSK (-f KSK), 3) inclusion des clés publiques dans le fichier de zone, 4) signature avec dnssec-signzone, 5) envoi du condensé DS généré au registrar parent.",
    "explanationFr": "La signature DNSSEC manuelle exige : 1) génération ZSK, 2) génération KSK (-f KSK), 3) inclusion des clés publiques dans le fichier de zone, 4) signature avec dnssec-signzone, 5) envoi du condensé DS généré au registrar parent."
  },
  {
    "id": "seq-202-4",
    "title": "Securing BIND 9 Inside a Chroot Jail Environment",
    "titleFr": "Confinement sécurisé de BIND 9 dans une prison Chroot",
    "certification": "lpic-2",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS and BIND 9",
    "description": "Ordonnez la démarche pour cloisonner le démon named dans /var/bind9/chroot afin d'isoler le système en cas de compromission.",
    "descriptionFr": "Ordonnez la démarche pour cloisonner le démon named dans /var/bind9/chroot afin d'isoler le système en cas de compromission.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création de l'arborescence racine de la prison (/var/bind9/chroot/)",
        "labelFr": "1. Création de l'arborescence racine de la prison (/var/bind9/chroot/)",
        "detail": "Créer dev, etc, var/run, var/named sous /var/bind9/chroot/ et affecter les droits à l'utilisateur bind",
        "detailFr": "Créer dev, etc, var/run, var/named sous /var/bind9/chroot/ et affecter les droits à l'utilisateur bind"
      },
      {
        "id": "s2",
        "label": "2. Création des nœuds de périphériques spéciaux nécessaires (null, random, zero)",
        "labelFr": "2. Création des nœuds de périphériques spéciaux nécessaires (null, random, zero)",
        "detail": "Créer /dev/null et /dev/random via mknod dans le chroot ou monter devtmpfs",
        "detailFr": "Créer /dev/null et /dev/random via mknod dans le chroot ou monter devtmpfs"
      },
      {
        "id": "s3",
        "label": "3. Déplacement des fichiers de configuration et zones dans le chroot",
        "labelFr": "3. Déplacement des fichiers de configuration et zones dans le chroot",
        "detail": "Déplacer /etc/bind vers /var/bind9/chroot/etc/bind et créer un lien symbolique de compatibilité",
        "detailFr": "Déplacer /etc/bind vers /var/bind9/chroot/etc/bind et créer un lien symbolique de compatibilité"
      },
      {
        "id": "s4",
        "label": "4. Ajustement des options de démarrage du démon named (-t /var/bind9/chroot)",
        "labelFr": "4. Ajustement des options de démarrage du démon named (-t /var/bind9/chroot)",
        "detail": "Modifier /etc/default/named ou l'unité systemd pour ajouter l'option OPTIONS=\"-u bind -t /var/bind9/chroot\"",
        "detailFr": "Modifier /etc/default/named ou l'unité systemd pour ajouter l'option OPTIONS=\"-u bind -t /var/bind9/chroot\""
      },
      {
        "id": "s5",
        "label": "5. Démarrage et vérification de la racine effective du processus dans /proc",
        "labelFr": "5. Démarrage et vérification de la racine effective du processus dans /proc",
        "detail": "Lancer le service et vérifier ls -l /proc/$(pgrep named)/root -> /var/bind9/chroot",
        "detailFr": "Lancer le service et vérifier ls -l /proc/$(pgrep named)/root -> /var/bind9/chroot"
      }
    ],
    "explanation": "Le chroot de BIND 9 nécessite : 1) arborescence dédiée, 2) création des nœuds matériels minimaux (dev/null, dev/random), 3) migration des fichiers de configuration, 4) option de lancement -t dans systemd/default, 5) vérification de /proc/<PID>/root.",
    "explanationFr": "Le chroot de BIND 9 nécessite : 1) arborescence dédiée, 2) création des nœuds matériels minimaux (dev/null, dev/random), 3) migration des fichiers de configuration, 4) option de lancement -t dans systemd/default, 5) vérification de /proc/<PID>/root."
  },
  {
    "id": "seq-202-5",
    "title": "Deploying an Apache HTTPS VirtualHost with Let's Encrypt and Certbot",
    "titleFr": "Déploiement d'un VirtualHost Apache HTTPS sécurisé avec Let's Encrypt",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services",
    "description": "Ordonnez les étapes pour configurer un VirtualHost Apache, obtenir un certificat TLS automatisé et activer HTTPS.",
    "descriptionFr": "Ordonnez les étapes pour configurer un VirtualHost Apache, obtenir un certificat TLS automatisé et activer HTTPS.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Activation du module SSL dans Apache (a2enmod ssl)",
        "labelFr": "1. Activation du module SSL dans Apache (a2enmod ssl)",
        "detail": "Activer le module cryptographique mod_ssl : a2enmod ssl && a2enmod headers",
        "detailFr": "Activer le module cryptographique mod_ssl : a2enmod ssl && a2enmod headers"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du VirtualHost initial HTTP sur le port 80",
        "labelFr": "2. Déclaration du VirtualHost initial HTTP sur le port 80",
        "detail": "Définir ServerName www.example.com et DocumentRoot /var/www/html dans sites-available/",
        "detailFr": "Définir ServerName www.example.com et DocumentRoot /var/www/html dans sites-available/"
      },
      {
        "id": "s3",
        "label": "3. Contrôle de syntaxe et activation du site (apachectl configtest & a2ensite)",
        "labelFr": "3. Contrôle de syntaxe et activation du site (apachectl configtest & a2ensite)",
        "detail": "Tester la configuration et activer le lien symbolique dans sites-enabled/",
        "detailFr": "Tester la configuration et activer le lien symbolique dans sites-enabled/"
      },
      {
        "id": "s4",
        "label": "4. Exécution du client Certbot pour validation ACME et génération du vhost 443",
        "labelFr": "4. Exécution du client Certbot pour validation ACME et génération du vhost 443",
        "detail": "Lancer certbot --apache -d www.example.com avec redirection automatique HTTP vers HTTPS",
        "detailFr": "Lancer certbot --apache -d www.example.com avec redirection automatique HTTP vers HTTPS"
      },
      {
        "id": "s5",
        "label": "5. Test du renouvellement automatique en simulation (certbot renew --dry-run)",
        "labelFr": "5. Test du renouvellement automatique en simulation (certbot renew --dry-run)",
        "detail": "Vérifier que le timer systemd certbot fonctionnera avant l'échéance des 90 jours",
        "detailFr": "Vérifier que le timer systemd certbot fonctionnera avant l'échéance des 90 jours"
      }
    ],
    "explanation": "Le déploiement HTTPS sous Apache suit : 1) activer mod_ssl, 2) préparer le vhost port 80, 3) a2ensite et vérification syntaxe apachectl, 4) certbot --apache (obtention des clés et génération du vhost 443), 5) test du renouvellement automatique certbot renew --dry-run.",
    "explanationFr": "Le déploiement HTTPS sous Apache suit : 1) activer mod_ssl, 2) préparer le vhost port 80, 3) a2ensite et vérification syntaxe apachectl, 4) certbot --apache (obtention des clés et génération du vhost 443), 5) test du renouvellement automatique certbot renew --dry-run."
  },
  {
    "id": "seq-202-6",
    "title": "Configuring an Nginx Reverse Proxy with Upstream Load Balancing",
    "titleFr": "Configuration d'un Reverse-Proxy Nginx avec répartition de charge Upstream",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services",
    "description": "Placez les directives et actions dans l'ordre pour router le trafic Web externe vers deux serveurs d'applications internes avec Nginx.",
    "descriptionFr": "Placez les directives et actions dans l'ordre pour router le trafic Web externe vers deux serveurs d'applications internes avec Nginx.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition du cluster backend dans le bloc upstream",
        "labelFr": "1. Définition du cluster backend dans le bloc upstream",
        "detail": "Déclarer upstream app_pool { server 10.0.0.11:8080; server 10.0.0.12:8080; } dans nginx.conf",
        "detailFr": "Déclarer upstream app_pool { server 10.0.0.11:8080; server 10.0.0.12:8080; } dans nginx.conf"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du bloc server avec port d'écoute et nom de domaine",
        "labelFr": "2. Déclaration du bloc server avec port d'écoute et nom de domaine",
        "detail": "Configurer server { listen 80; server_name app.corp.lan; ... }",
        "detailFr": "Configurer server { listen 80; server_name app.corp.lan; ... }"
      },
      {
        "id": "s3",
        "label": "3. Configuration de la directive proxy_pass et transmission des en-têtes réels",
        "labelFr": "3. Configuration de la directive proxy_pass et transmission des en-têtes réels",
        "detail": "Dans location / : proxy_pass http://app_pool; et proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
        "detailFr": "Dans location / : proxy_pass http://app_pool; et proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;"
      },
      {
        "id": "s4",
        "label": "4. Test de validation de la syntaxe de configuration (nginx -t)",
        "labelFr": "4. Test de validation de la syntaxe de configuration (nginx -t)",
        "detail": "S'assurer qu'aucun point-virgule n'est manquant et que la syntaxe est 'test is successful'",
        "detailFr": "S'assurer qu'aucun point-virgule n'est manquant et que la syntaxe est 'test is successful'"
      },
      {
        "id": "s5",
        "label": "5. Rechargement des processus de travail sans interruption (nginx -s reload)",
        "labelFr": "5. Rechargement des processus de travail sans interruption (nginx -s reload)",
        "detail": "Recharger la configuration à chaud sans fermer les connexions TCP actives",
        "detailFr": "Recharger la configuration à chaud sans fermer les connexions TCP actives"
      }
    ],
    "explanation": "La configuration du reverse proxy Nginx s'articule : 1) bloc upstream (définition des nœuds), 2) bloc server (écoute port/domaine), 3) bloc location / avec proxy_pass et proxy_set_header, 4) validation nginx -t, 5) rechargement gracieux via nginx -s reload.",
    "explanationFr": "La configuration du reverse proxy Nginx s'articule : 1) bloc upstream (définition des nœuds), 2) bloc server (écoute port/domaine), 3) bloc location / avec proxy_pass et proxy_set_header, 4) validation nginx -t, 5) rechargement gracieux via nginx -s reload."
  },
  {
    "id": "seq-202-7",
    "title": "Protecting an Apache Web Directory with HTTP Basic Authentication",
    "titleFr": "Restriction d'accès à un répertoire Apache par authentification HTTP Basic",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services",
    "description": "Ordonnez les étapes pour verrouiller un dossier sensible avec login/mot de passe htpasswd et les directives AuthType dans Apache.",
    "descriptionFr": "Ordonnez les étapes pour verrouiller un dossier sensible avec login/mot de passe htpasswd et les directives AuthType dans Apache.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du fichier de mots de passe chiffrés (htpasswd -c)",
        "labelFr": "1. Création du fichier de mots de passe chiffrés (htpasswd -c)",
        "detail": "Générer le fichier avec hachage sécurisé : htpasswd -c -B /etc/apache2/.htpasswd admin",
        "detailFr": "Générer le fichier avec hachage sécurisé : htpasswd -c -B /etc/apache2/.htpasswd admin"
      },
      {
        "id": "s2",
        "label": "2. Verrouillage des droits système sur le fichier .htpasswd",
        "labelFr": "2. Verrouillage des droits système sur le fichier .htpasswd",
        "detail": "Restreindre la lecture au seul serveur Web : chown root:www-data /etc/apache2/.htpasswd && chmod 640",
        "detailFr": "Restreindre la lecture au seul serveur Web : chown root:www-data /etc/apache2/.htpasswd && chmod 640"
      },
      {
        "id": "s3",
        "label": "3. Déclaration du bloc <Directory> et des directives Auth dans la configuration",
        "labelFr": "3. Déclaration du bloc <Directory> et des directives Auth dans la configuration",
        "detail": "Insérer AuthType Basic, AuthName, AuthUserFile /etc/apache2/.htpasswd et Require valid-user",
        "detailFr": "Insérer AuthType Basic, AuthName, AuthUserFile /etc/apache2/.htpasswd et Require valid-user"
      },
      {
        "id": "s4",
        "label": "4. Vérification de la configuration (apachectl configtest)",
        "labelFr": "4. Vérification de la configuration (apachectl configtest)",
        "detail": "Contrôler l'absence d'erreurs de syntaxe avant d'appliquer les restrictions",
        "detailFr": "Contrôler l'absence d'erreurs de syntaxe avant d'appliquer les restrictions"
      },
      {
        "id": "s5",
        "label": "5. Rechargement du service et test de refus 401 Unauthorized",
        "labelFr": "5. Rechargement du service et test de refus 401 Unauthorized",
        "detail": "Recharger le service et tester avec curl -I pour constater la réponse HTTP 401 sans identifiants",
        "detailFr": "Recharger le service et tester avec curl -I pour constater la réponse HTTP 401 sans identifiants"
      }
    ],
    "explanation": "L'authentification HTTP Basic Apache exige : 1) création du fichier avec htpasswd, 2) sécurisation des permissions du fichier .htpasswd, 3) configuration de la section Directory (AuthType, AuthUserFile, Require valid-user), 4) configtest, 5) test du challenge 401.",
    "explanationFr": "L'authentification HTTP Basic Apache exige : 1) création du fichier avec htpasswd, 2) sécurisation des permissions du fichier .htpasswd, 3) configuration de la section Directory (AuthType, AuthUserFile, Require valid-user), 4) configtest, 5) test du challenge 401."
  },
  {
    "id": "seq-202-8",
    "title": "Implementing URL Redirection and Canonical Rewrites with mod_rewrite",
    "titleFr": "Mise en œuvre de règles de réécriture et redirection d'URL avec mod_rewrite",
    "certification": "lpic-2",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services",
    "description": "Ordonnez la démarche pour rediriger définitivement (301) le trafic de l'ancien domaine ou de requêtes sans sous-domaine vers l'URL canonique.",
    "descriptionFr": "Ordonnez la démarche pour rediriger définitivement (301) le trafic de l'ancien domaine ou de requêtes sans sous-domaine vers l'URL canonique.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Activation du module de réécriture dans Apache (a2enmod rewrite)",
        "labelFr": "1. Activation du module de réécriture dans Apache (a2enmod rewrite)",
        "detail": "Activer mod_rewrite et redémarrer le démon Apache",
        "detailFr": "Activer mod_rewrite et redémarrer le démon Apache"
      },
      {
        "id": "s2",
        "label": "2. Autorisation de l'évaluation des fichiers .htaccess (AllowOverride All)",
        "labelFr": "2. Autorisation de l'évaluation des fichiers .htaccess (AllowOverride All)",
        "detail": "Définir AllowOverride All ou AllowOverride FileInfo dans le bloc Directory du VirtualHost",
        "detailFr": "Définir AllowOverride All ou AllowOverride FileInfo dans le bloc Directory du VirtualHost"
      },
      {
        "id": "s3",
        "label": "3. Activation du moteur de réécriture (RewriteEngine On)",
        "labelFr": "3. Activation du moteur de réécriture (RewriteEngine On)",
        "detail": "Activer l'interpréteur de règles au début du fichier .htaccess ou du VirtualHost",
        "detailFr": "Activer l'interpréteur de règles au début du fichier .htaccess ou du VirtualHost"
      },
      {
        "id": "s4",
        "label": "4. Définition de la condition de filtrage (RewriteCond)",
        "labelFr": "4. Définition de la condition de filtrage (RewriteCond)",
        "detail": "Cibler le nom d'hôte : RewriteCond %{HTTP_HOST} ^example\\.com$ [NC]",
        "detailFr": "Cibler le nom d'hôte : RewriteCond %{HTTP_HOST} ^example\\.com$ [NC]"
      },
      {
        "id": "s5",
        "label": "5. Définition de la règle de redirection permanente (RewriteRule avec [R=301,L])",
        "labelFr": "5. Définition de la règle de redirection permanente (RewriteRule avec [R=301,L])",
        "detail": "Rediriger : RewriteRule ^(.*)$ https://www.example.com/$1 [R=301,L]",
        "detailFr": "Rediriger : RewriteRule ^(.*)$ https://www.example.com/$1 [R=301,L]"
      }
    ],
    "explanation": "L'enchaînement de mod_rewrite : 1) activation du module a2enmod rewrite, 2) AllowOverride All dans la conf vhost, 3) RewriteEngine On, 4) RewriteCond (condition), 5) RewriteRule (règle finale avec drapeaux [R=301,L]).",
    "explanationFr": "L'enchaînement de mod_rewrite : 1) activation du module a2enmod rewrite, 2) AllowOverride All dans la conf vhost, 3) RewriteEngine On, 4) RewriteCond (condition), 5) RewriteRule (règle finale avec drapeaux [R=301,L])."
  },
  {
    "id": "seq-202-9",
    "title": "Configuring and Exporting a Secure NFSv4 Share with Pseudo-Root",
    "titleFr": "Configuration et exportation d'un partage NFSv4 avec pseudo-racine",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing",
    "description": "Ordonnez les étapes pour configurer un serveur d'exportation NFSv4 moderne sans RPC portmapper traditionnel et le monter côté client.",
    "descriptionFr": "Ordonnez les étapes pour configurer un serveur d'exportation NFSv4 moderne sans RPC portmapper traditionnel et le monter côté client.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition de la pseudo-racine d'exportation (/export)",
        "labelFr": "1. Définition de la pseudo-racine d'exportation (/export)",
        "detail": "Créer le dossier /export et y rattacher les volumes réels par montage bind : mount --bind /data /export/data",
        "detailFr": "Créer le dossier /export et y rattacher les volumes réels par montage bind : mount --bind /data /export/data"
      },
      {
        "id": "s2",
        "label": "2. Déclaration des exports avec l'option fsid=0 dans /etc/exports",
        "labelFr": "2. Déclaration des exports avec l'option fsid=0 dans /etc/exports",
        "detail": "Déclarer /export *(rw,fsid=0,no_subtree_check) et /export/data 192.168.1.0/24(rw,no_subtree_check)",
        "detailFr": "Déclarer /export *(rw,fsid=0,no_subtree_check) et /export/data 192.168.1.0/24(rw,no_subtree_check)"
      },
      {
        "id": "s3",
        "label": "3. Application des nouvelles tables d'exportation (exportfs -rav)",
        "labelFr": "3. Application des nouvelles tables d'exportation (exportfs -rav)",
        "detail": "Recharger le sous-système d'export sans interrompre le démon : exportfs -rav",
        "detailFr": "Recharger le sous-système d'export sans interrompre le démon : exportfs -rav"
      },
      {
        "id": "s4",
        "label": "4. Démarrage du démon NFS et du service de mapping idmapd",
        "labelFr": "4. Démarrage du démon NFS et du service de mapping idmapd",
        "detail": "Démarrer nfs-server.service et rpc-idmapd.service pour faire correspondre les noms d'utilisateurs",
        "detailFr": "Démarrer nfs-server.service et rpc-idmapd.service pour faire correspondre les noms d'utilisateurs"
      },
      {
        "id": "s5",
        "label": "5. Montage distant côté client avec le type de système nfs4",
        "labelFr": "5. Montage distant côté client avec le type de système nfs4",
        "detail": "Monter sans spécifier le chemin de la pseudo-racine : mount -t nfs4 srv-nfs:/data /mnt/data",
        "detailFr": "Monter sans spécifier le chemin de la pseudo-racine : mount -t nfs4 srv-nfs:/data /mnt/data"
      }
    ],
    "explanation": "En NFSv4, l'architecture repose sur : 1) pseudo-racine (bind mounts), 2) directive fsid=0 sur la racine dans /etc/exports, 3) rechargement avec exportfs -rav, 4) service nfs-server et idmapd, 5) montage client 'mount -t nfs4 srv:/data' (sans préfixer /export).",
    "explanationFr": "En NFSv4, l'architecture repose sur : 1) pseudo-racine (bind mounts), 2) directive fsid=0 sur la racine dans /etc/exports, 3) rechargement avec exportfs -rav, 4) service nfs-server et idmapd, 5) montage client 'mount -t nfs4 srv:/data' (sans préfixer /export)."
  },
  {
    "id": "seq-202-10",
    "title": "Creating a Group-Restricted Samba Share with smbpasswd and testparm",
    "titleFr": "Création d'un partage Samba sécurisé avec restrictions d'accès par groupe",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing",
    "description": "Ordonnez la séquence complète pour créer un partage SMB réservé aux membres d'un groupe système spécifique et valider son fonctionnement.",
    "descriptionFr": "Ordonnez la séquence complète pour créer un partage SMB réservé aux membres d'un groupe système spécifique et valider son fonctionnement.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création du répertoire de stockage et ajustement des droits POSIX",
        "labelFr": "1. Création du répertoire de stockage et ajustement des droits POSIX",
        "detail": "Créer /srv/samba/finance, assigner au groupe chown root:finance et chmod 2770 (avec SGID)",
        "detailFr": "Créer /srv/samba/finance, assigner au groupe chown root:finance et chmod 2770 (avec SGID)"
      },
      {
        "id": "s2",
        "label": "2. Déclaration de la section de partage dans /etc/samba/smb.conf",
        "labelFr": "2. Déclaration de la section de partage dans /etc/samba/smb.conf",
        "detail": "Ajouter [finance], path = /srv/samba/finance, read only = no, valid users = @finance",
        "detailFr": "Ajouter [finance], path = /srv/samba/finance, read only = no, valid users = @finance"
      },
      {
        "id": "s3",
        "label": "3. Contrôle syntaxique et validation des paramètres (testparm)",
        "labelFr": "3. Contrôle syntaxique et validation des paramètres (testparm)",
        "detail": "Exécuter testparm -s pour vérifier qu'aucune directive obsolète ou erronée n'est présente",
        "detailFr": "Exécuter testparm -s pour vérifier qu'aucune directive obsolète ou erronée n'est présente"
      },
      {
        "id": "s4",
        "label": "4. Enregistrement des mots de passe NT dans la base Samba (smbpasswd)",
        "labelFr": "4. Enregistrement des mots de passe NT dans la base Samba (smbpasswd)",
        "detail": "Créer les comptes SMB dans passdb.tdb : smbpasswd -a alice && smbpasswd -e alice",
        "detailFr": "Créer les comptes SMB dans passdb.tdb : smbpasswd -a alice && smbpasswd -e alice"
      },
      {
        "id": "s5",
        "label": "5. Rechargement des démons smbd/nmbd et test de connexion (smbclient)",
        "labelFr": "5. Rechargement des démons smbd/nmbd et test de connexion (smbclient)",
        "detail": "Redémarrer smbd et vérifier l'accès distant : smbclient //localhost/finance -U alice",
        "detailFr": "Redémarrer smbd et vérifier l'accès distant : smbclient //localhost/finance -U alice"
      }
    ],
    "explanation": "La création d'un partage Samba sécurisé exige : 1) répertoire et droits POSIX/SGID, 2) section de partage dans smb.conf (valid users = @groupe), 3) testparm, 4) création des identifiants avec smbpasswd, 5) reload smbd et test smbclient.",
    "explanationFr": "La création d'un partage Samba sécurisé exige : 1) répertoire et droits POSIX/SGID, 2) section de partage dans smb.conf (valid users = @groupe), 3) testparm, 4) création des identifiants avec smbpasswd, 5) reload smbd et test smbclient."
  },
  {
    "id": "seq-202-11",
    "title": "Joining a Linux Host to an Active Directory Domain with Samba and Winbind",
    "titleFr": "Intégration d'un serveur Linux dans un domaine Active Directory via Samba et Winbind",
    "certification": "lpic-2",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing",
    "description": "Ordonnez les étapes pour joindre un serveur Linux à un domaine Microsoft Active Directory afin de mapper les comptes Windows.",
    "descriptionFr": "Ordonnez les étapes pour joindre un serveur Linux à un domaine Microsoft Active Directory afin de mapper les comptes Windows.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Synchronisation rigoureuse de l'horloge système avec le contrôleur de domaine (NTP)",
        "labelFr": "1. Synchronisation rigoureuse de l'horloge système avec le contrôleur de domaine (NTP)",
        "detail": "Kerberos rejette toute différence de temps supérieure à 5 minutes (skew time) : chronyc -a makestep",
        "detailFr": "Kerberos rejette toute différence de temps supérieure à 5 minutes (skew time) : chronyc -a makestep"
      },
      {
        "id": "s2",
        "label": "2. Configuration du royaume Kerberos dans /etc/krb5.conf",
        "labelFr": "2. Configuration du royaume Kerberos dans /etc/krb5.conf",
        "detail": "Définir default_realm = CORP.LAN et les adresses des KDC contrôleurs de domaine",
        "detailFr": "Définir default_realm = CORP.LAN et les adresses des KDC contrôleurs de domaine"
      },
      {
        "id": "s3",
        "label": "3. Paramétrage de Samba en mode ADS dans /etc/samba/smb.conf",
        "labelFr": "3. Paramétrage de Samba en mode ADS dans /etc/samba/smb.conf",
        "detail": "Définir security = ADS, realm = CORP.LAN, workgroup = CORP et les plages idmap",
        "detailFr": "Définir security = ADS, realm = CORP.LAN, workgroup = CORP et les plages idmap"
      },
      {
        "id": "s4",
        "label": "4. Jonction officielle au domaine Active Directory (net ads join)",
        "labelFr": "4. Jonction officielle au domaine Active Directory (net ads join)",
        "detail": "Créer le compte machine dans l'AD : net ads join -U Administrator",
        "detailFr": "Créer le compte machine dans l'AD : net ads join -U Administrator"
      },
      {
        "id": "s5",
        "label": "5. Démarrage de winbind et test d'énumération des utilisateurs AD (wbinfo / getent)",
        "labelFr": "5. Démarrage de winbind et test d'énumération des utilisateurs AD (wbinfo / getent)",
        "detail": "Lancer winbind.service et tester l'obtention des comptes avec wbinfo -u et getent passwd",
        "detailFr": "Lancer winbind.service et tester l'obtention des comptes avec wbinfo -u et getent passwd"
      }
    ],
    "explanation": "La jonction d'un serveur Linux à Active Directory exige : 1) synchronisation horaire NTP critique, 2) configuration krb5.conf, 3) smb.conf (security = ADS), 4) net ads join, 5) activation de winbind et test avec wbinfo.",
    "explanationFr": "La jonction d'un serveur Linux à Active Directory exige : 1) synchronisation horaire NTP critique, 2) configuration krb5.conf, 3) smb.conf (security = ADS), 4) net ads join, 5) activation de winbind et test avec wbinfo."
  },
  {
    "id": "seq-202-12",
    "title": "Configuring ISC DHCP Server Scope and Static MAC Address Reservation",
    "titleFr": "Configuration d'un scope et réservation d'IP statique sur serveur ISC DHCP",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.1",
    "category": "Network Client Management",
    "description": "Ordonnez la démarche pour déclarer une plage dynamique et une réservation fixe par adresse MAC dans /etc/dhcp/dhcpd.conf.",
    "descriptionFr": "Ordonnez la démarche pour déclarer une plage dynamique et une réservation fixe par adresse MAC dans /etc/dhcp/dhcpd.conf.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Sélection de l'interface d'écoute dans les paramètres du démon",
        "labelFr": "1. Sélection de l'interface d'écoute dans les paramètres du démon",
        "detail": "Définir INTERFACESv4='eth1' dans /etc/default/isc-dhcp-server",
        "detailFr": "Définir INTERFACESv4='eth1' dans /etc/default/isc-dhcp-server"
      },
      {
        "id": "s2",
        "label": "2. Définition du sous-réseau et de la plage dynamique (subnet & range)",
        "labelFr": "2. Définition du sous-réseau et de la plage dynamique (subnet & range)",
        "detail": "Déclarer subnet 192.168.1.0 netmask 255.255.255.0 { range 192.168.1.100 192.168.1.200; ... }",
        "detailFr": "Déclarer subnet 192.168.1.0 netmask 255.255.255.0 { range 192.168.1.100 192.168.1.200; ... }"
      },
      {
        "id": "s3",
        "label": "3. Déclaration de la réservation fixe pour l'hôte cible (host & hardware ethernet)",
        "labelFr": "3. Déclaration de la réservation fixe pour l'hôte cible (host & hardware ethernet)",
        "detail": "Ajouter host srv-print { hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.50; }",
        "detailFr": "Ajouter host srv-print { hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.50; }"
      },
      {
        "id": "s4",
        "label": "4. Contrôle syntaxique du fichier de configuration (dhcpd -t)",
        "labelFr": "4. Contrôle syntaxique du fichier de configuration (dhcpd -t)",
        "detail": "Vérifier la validité des déclarations : dhcpd -t -cf /etc/dhcp/dhcpd.conf",
        "detailFr": "Vérifier la validité des déclarations : dhcpd -t -cf /etc/dhcp/dhcpd.conf"
      },
      {
        "id": "s5",
        "label": "5. Démarrage du service et contrôle des baux actifs dans dhcpd.leases",
        "labelFr": "5. Démarrage du service et contrôle des baux actifs dans dhcpd.leases",
        "detail": "Démarrer isc-dhcp-server et surveiller l'attribution des adresses dans /var/lib/dhcp/dhcpd.leases",
        "detailFr": "Démarrer isc-dhcp-server et surveiller l'attribution des adresses dans /var/lib/dhcp/dhcpd.leases"
      }
    ],
    "explanation": "La configuration du serveur DHCP : 1) interface d'écoute dans les defaults, 2) déclaration du subnet et range, 3) déclaration host avec hardware ethernet et fixed-address, 4) test de syntaxe dhcpd -t, 5) démarrage et contrôle des leases.",
    "explanationFr": "La configuration du serveur DHCP : 1) interface d'écoute dans les defaults, 2) déclaration du subnet et range, 3) déclaration host avec hardware ethernet et fixed-address, 4) test de syntaxe dhcpd -t, 5) démarrage et contrôle des leases."
  },
  {
    "id": "seq-202-13",
    "title": "Hardening PAM Stack with Account Lockout Policy (pam_faillock)",
    "titleFr": "Durcissement de la pile PAM : verrouillage de compte après échecs (pam_faillock)",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.2",
    "category": "Network Client Management",
    "description": "Ordonnez la disposition des modules PAM pour verrouiller un compte utilisateur après 3 échecs consécutifs d'authentification.",
    "descriptionFr": "Ordonnez la disposition des modules PAM pour verrouiller un compte utilisateur après 3 échecs consécutifs d'authentification.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Sauvegarde préalable de la configuration PAM (/etc/pam.d/)",
        "labelFr": "1. Sauvegarde préalable de la configuration PAM (/etc/pam.d/)",
        "detail": "Conserver une session root ouverte et sauvegarder les fichiers de configuration sous peine de lockout système",
        "detailFr": "Conserver une session root ouverte et sauvegarder les fichiers de configuration sous peine de lockout système"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du contrôle préalable preauth dans auth (pam_faillock.so preauth)",
        "labelFr": "2. Déclaration du contrôle préalable preauth dans auth (pam_faillock.so preauth)",
        "detail": "Insérer en tête de la pile auth : auth required pam_faillock.so preauth silent deny=3 unlock_time=600",
        "detailFr": "Insérer en tête de la pile auth : auth required pam_faillock.so preauth silent deny=3 unlock_time=600"
      },
      {
        "id": "s3",
        "label": "3. Évaluation du mot de passe standard (pam_unix.so)",
        "labelFr": "3. Évaluation du mot de passe standard (pam_unix.so)",
        "detail": "Placer le contrôle standard : auth sufficient pam_unix.so nullok try_first_pass",
        "detailFr": "Placer le contrôle standard : auth sufficient pam_unix.so nullok try_first_pass"
      },
      {
        "id": "s4",
        "label": "4. Enregistrement de l'échec en cas de mauvais mot de passe (pam_faillock.so authfail)",
        "labelFr": "4. Enregistrement de l'échec en cas de mauvais mot de passe (pam_faillock.so authfail)",
        "detail": "Insérer après pam_unix : auth [default=die] pam_faillock.so authfail",
        "detailFr": "Insérer après pam_unix : auth [default=die] pam_faillock.so authfail"
      },
      {
        "id": "s5",
        "label": "5. Réinitialisation du compteur lors d'un accès réussi dans la section account",
        "labelFr": "5. Réinitialisation du compteur lors d'un accès réussi dans la section account",
        "detail": "Ajouter dans la pile account : account required pam_faillock.so pour réinitialiser les échecs après succès",
        "detailFr": "Ajouter dans la pile account : account required pam_faillock.so pour réinitialiser les échecs après succès"
      }
    ],
    "explanation": "L'architecture pam_faillock exige l'encadrement précis de pam_unix : 1) preauth (vérifie si déjà verrouillé) -> 2) pam_unix (test du mot de passe) -> 3) authfail (incrémente le compteur en cas de rejet) -> 4) account faillock (remise à zéro si authentifié).",
    "explanationFr": "L'architecture pam_faillock exige l'encadrement précis de pam_unix : 1) preauth (vérifie si déjà verrouillé) -> 2) pam_unix (test du mot de passe) -> 3) authfail (incrémente le compteur en cas de rejet) -> 4) account faillock (remise à zéro si authentifié)."
  },
  {
    "id": "seq-202-14",
    "title": "Enforcing User Resource Limits with pam_limits and limits.conf",
    "titleFr": "Restriction des ressources utilisateurs via pam_limits et limits.conf",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.2",
    "category": "Network Client Management",
    "description": "Placez les étapes dans l'ordre pour limiter le nombre de processus et de fichiers ouverts d'un groupe applicatif.",
    "descriptionFr": "Placez les étapes dans l'ordre pour limiter le nombre de processus et de fichiers ouverts d'un groupe applicatif.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Activation du module de gestion des limites dans la session PAM",
        "labelFr": "1. Activation du module de gestion des limites dans la session PAM",
        "detail": "Vérifier la présence de session required pam_limits.so dans /etc/pam.d/common-session ou system-auth",
        "detailFr": "Vérifier la présence de session required pam_limits.so dans /etc/pam.d/common-session ou system-auth"
      },
      {
        "id": "s2",
        "label": "2. Définition des quotas de ressources dans /etc/security/limits.conf",
        "labelFr": "2. Définition des quotas de ressources dans /etc/security/limits.conf",
        "detail": "Ajouter : @developers hard nproc 100 et @developers soft nofile 4096",
        "detailFr": "Ajouter : @developers hard nproc 100 et @developers soft nofile 4096"
      },
      {
        "id": "s3",
        "label": "3. Ouverture d'une nouvelle session sous l'identité cible",
        "labelFr": "3. Ouverture d'une nouvelle session sous l'identité cible",
        "detail": "Se connecter en tant qu'utilisateur du groupe (les limites ne s'appliquent qu'à l'ouverture de session PAM)",
        "detailFr": "Se connecter en tant qu'utilisateur du groupe (les limites ne s'appliquent qu'à l'ouverture de session PAM)"
      },
      {
        "id": "s4",
        "label": "4. Contrôle des limites effectives appliquées dans la session shell",
        "labelFr": "4. Contrôle des limites effectives appliquées dans la session shell",
        "detail": "Exécuter ulimit -u (nproc) et ulimit -n (nofile) pour confirmer l'application des plafonds",
        "detailFr": "Exécuter ulimit -u (nproc) et ulimit -n (nofile) pour confirmer l'application des plafonds"
      }
    ],
    "explanation": "La chaîne pam_limits : 1) activation du module pam_limits.so dans le fichier session PAM, 2) écriture des règles dans limits.conf, 3) ouverture d'une nouvelle session utilisateur, 4) vérification avec la commande intégrée ulimit.",
    "explanationFr": "La chaîne pam_limits : 1) activation du module pam_limits.so dans le fichier session PAM, 2) écriture des règles dans limits.conf, 3) ouverture d'une nouvelle session utilisateur, 4) vérification avec la commande intégrée ulimit."
  },
  {
    "id": "seq-202-15",
    "title": "Connecting a Linux Client to an OpenLDAP Authentication Directory",
    "titleFr": "Raccordement d'un client Linux à un annuaire d'authentification OpenLDAP",
    "certification": "lpic-2",
    "topicNumber": 210,
    "objectiveId": "210.3",
    "category": "Network Client Management",
    "description": "Ordonnez les étapes pour configurer un client Linux afin qu'il résolve les comptes et mots de passe stockés dans un annuaire LDAP.",
    "descriptionFr": "Ordonnez les étapes pour configurer un client Linux afin qu'il résolve les comptes et mots de passe stockés dans un annuaire LDAP.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Installation des modules de pontage NSS et PAM pour LDAP",
        "labelFr": "1. Installation des modules de pontage NSS et PAM pour LDAP",
        "detail": "Installer libnss-ldap, libpam-ldap ou sssd avec support ldap",
        "detailFr": "Installer libnss-ldap, libpam-ldap ou sssd avec support ldap"
      },
      {
        "id": "s2",
        "label": "2. Déclaration de l'URI du serveur et de la racine de recherche (Base DN)",
        "labelFr": "2. Déclaration de l'URI du serveur et de la racine de recherche (Base DN)",
        "detail": "Renseigner URI ldap://ldap.corp.lan et BASE dc=corp,dc=lan dans /etc/ldap/ldap.conf",
        "detailFr": "Renseigner URI ldap://ldap.corp.lan et BASE dc=corp,dc=lan dans /etc/ldap/ldap.conf"
      },
      {
        "id": "s3",
        "label": "3. Modification de /etc/nsswitch.conf pour inclure ldap",
        "labelFr": "3. Modification de /etc/nsswitch.conf pour inclure ldap",
        "detail": "Configurer : passwd: files ldap et group: files ldap pour cascader la résolution",
        "detailFr": "Configurer : passwd: files ldap et group: files ldap pour cascader la résolution"
      },
      {
        "id": "s4",
        "label": "4. Intégration de pam_ldap et création automatique du home directory",
        "labelFr": "4. Intégration de pam_ldap et création automatique du home directory",
        "detail": "Activer pam_mkhomedir.so dans common-session pour créer /home/<user> à la première connexion",
        "detailFr": "Activer pam_mkhomedir.so dans common-session pour créer /home/<user> à la première connexion"
      },
      {
        "id": "s5",
        "label": "5. Test d'interrogation de l'annuaire avec getent passwd",
        "labelFr": "5. Test d'interrogation de l'annuaire avec getent passwd",
        "detail": "Vérifier la restitution d'un compte LDAP distant sans qu'il n'existe dans /etc/passwd local",
        "detailFr": "Vérifier la restitution d'un compte LDAP distant sans qu'il n'existe dans /etc/passwd local"
      }
    ],
    "explanation": "La connexion d'un client à OpenLDAP exige : 1) paquets nss/pam ldap, 2) configuration URI et Base DN dans ldap.conf, 3) ajout de 'ldap' dans /etc/nsswitch.conf, 4) pam_mkhomedir pour les sessions, 5) test avec getent passwd.",
    "explanationFr": "La connexion d'un client à OpenLDAP exige : 1) paquets nss/pam ldap, 2) configuration URI et Base DN dans ldap.conf, 3) ajout de 'ldap' dans /etc/nsswitch.conf, 4) pam_mkhomedir pour les sessions, 5) test avec getent passwd."
  },
  {
    "id": "seq-202-16",
    "title": "Configuring Postfix SMTP Transport Routing and Virtual Alias Mapping",
    "titleFr": "Configuration du routage SMTP Postfix et des tables de correspondance d'alias",
    "certification": "lpic-2",
    "topicNumber": 211,
    "objectiveId": "211.1",
    "category": "E-Mail Services",
    "description": "Ordonnez les étapes pour configurer le domaine de messagerie de base, déclarer des alias virtuels et recharger Postfix.",
    "descriptionFr": "Ordonnez les étapes pour configurer le domaine de messagerie de base, déclarer des alias virtuels et recharger Postfix.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition des paramètres de domaine dans /etc/postfix/main.cf",
        "labelFr": "1. Définition des paramètres de domaine dans /etc/postfix/main.cf",
        "detail": "Déclarer myhostname = mail.example.com, mydomain = example.com et mydestination",
        "detailFr": "Déclarer myhostname = mail.example.com, mydomain = example.com et mydestination"
      },
      {
        "id": "s2",
        "label": "2. Déclaration de la directive virtual_alias_maps",
        "labelFr": "2. Déclaration de la directive virtual_alias_maps",
        "detail": "Ajouter dans main.cf : virtual_alias_maps = hash:/etc/postfix/virtual",
        "detailFr": "Ajouter dans main.cf : virtual_alias_maps = hash:/etc/postfix/virtual"
      },
      {
        "id": "s3",
        "label": "3. Rédaction des correspondances dans le fichier /etc/postfix/virtual",
        "labelFr": "3. Rédaction des correspondances dans le fichier /etc/postfix/virtual",
        "detail": "Associer les adresses : contact@example.com alice, support@example.com bob",
        "detailFr": "Associer les adresses : contact@example.com alice, support@example.com bob"
      },
      {
        "id": "s4",
        "label": "4. Compilation de la table Berkeley DB avec postmap",
        "labelFr": "4. Compilation de la table Berkeley DB avec postmap",
        "detail": "Générer le fichier binaire indexé /etc/postfix/virtual.db : postmap /etc/postfix/virtual",
        "detailFr": "Générer le fichier binaire indexé /etc/postfix/virtual.db : postmap /etc/postfix/virtual"
      },
      {
        "id": "s5",
        "label": "5. Rechargement du démon Postfix (postfix reload)",
        "labelFr": "5. Rechargement du démon Postfix (postfix reload)",
        "detail": "Appliquer la nouvelle configuration sans perdre les courriels en transit dans la file d'attente",
        "detailFr": "Appliquer la nouvelle configuration sans perdre les courriels en transit dans la file d'attente"
      }
    ],
    "explanation": "La configuration Postfix avec tables indexées requiert : 1) directives de domaine dans main.cf, 2) directive virtual_alias_maps, 3) édition du fichier texte, 4) compilation avec postmap (création du .db), 5) rechargement avec postfix reload.",
    "explanationFr": "La configuration Postfix avec tables indexées requiert : 1) directives de domaine dans main.cf, 2) directive virtual_alias_maps, 3) édition du fichier texte, 4) compilation avec postmap (création du .db), 5) rechargement avec postfix reload."
  },
  {
    "id": "seq-202-17",
    "title": "Enforcing Opportunistic and Mandatory STARTTLS Encryption in Postfix",
    "titleFr": "Chiffrement TLS obligatoire et opportuniste des transmissions SMTP (STARTTLS)",
    "certification": "lpic-2",
    "topicNumber": 211,
    "objectiveId": "211.2",
    "category": "E-Mail Services",
    "description": "Placez les étapes dans l'ordre pour activer le chiffrement TLS lors de la réception (SMTPS/STARTTLS) de messages sur Postfix.",
    "descriptionFr": "Placez les étapes dans l'ordre pour activer le chiffrement TLS lors de la réception (SMTPS/STARTTLS) de messages sur Postfix.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Dépôt des certificats X.509 et clé privée du serveur",
        "labelFr": "1. Dépôt des certificats X.509 et clé privée du serveur",
        "detail": "Placer fullchain.pem et privkey.pem dans /etc/ssl/ et restreindre l'accès à la clé privée",
        "detailFr": "Placer fullchain.pem et privkey.pem dans /etc/ssl/ et restreindre l'accès à la clé privée"
      },
      {
        "id": "s2",
        "label": "2. Renseignement des chemins de certificats dans /etc/postfix/main.cf",
        "labelFr": "2. Renseignement des chemins de certificats dans /etc/postfix/main.cf",
        "detail": "Définir smtpd_tls_cert_file et smtpd_tls_key_file avec les chemins absolus",
        "detailFr": "Définir smtpd_tls_cert_file et smtpd_tls_key_file avec les chemins absolus"
      },
      {
        "id": "s3",
        "label": "3. Configuration du niveau de sécurité TLS (smtpd_tls_security_level)",
        "labelFr": "3. Configuration du niveau de sécurité TLS (smtpd_tls_security_level)",
        "detail": "Activer smtpd_tls_security_level = may (opportuniste) ou encrypt (obligatoire)",
        "detailFr": "Activer smtpd_tls_security_level = may (opportuniste) ou encrypt (obligatoire)"
      },
      {
        "id": "s4",
        "label": "4. Activation de la journalisation des sessions chiffrées",
        "labelFr": "4. Activation de la journalisation des sessions chiffrées",
        "detail": "Ajouter smtpd_tls_loglevel = 1 pour tracer les algorithmes de chiffrement et versions TLS dans les logs",
        "detailFr": "Ajouter smtpd_tls_loglevel = 1 pour tracer les algorithmes de chiffrement et versions TLS dans les logs"
      },
      {
        "id": "s5",
        "label": "5. Test de négociation STARTTLS avec openssl s_client",
        "labelFr": "5. Test de négociation STARTTLS avec openssl s_client",
        "detail": "Vérifier le dialogue chiffré : openssl s_client -starttls smtp -connect mail.example.com:25",
        "detailFr": "Vérifier le dialogue chiffré : openssl s_client -starttls smtp -connect mail.example.com:25"
      }
    ],
    "explanation": "L'activation STARTTLS dans Postfix : 1) certificats en place, 2) smtpd_tls_cert_file / key_file dans main.cf, 3) smtpd_tls_security_level = may/encrypt, 4) loglevel = 1, 5) test de négociation avec openssl s_client -starttls smtp.",
    "explanationFr": "L'activation STARTTLS dans Postfix : 1) certificats en place, 2) smtpd_tls_cert_file / key_file dans main.cf, 3) smtpd_tls_security_level = may/encrypt, 4) loglevel = 1, 5) test de négociation avec openssl s_client -starttls smtp."
  },
  {
    "id": "seq-202-18",
    "title": "Deploying Dovecot Secure IMAP and Maildir Storage with SASL Auth",
    "titleFr": "Déploiement du service Dovecot IMAPS et stockage Maildir avec SASL",
    "certification": "lpic-2",
    "topicNumber": 211,
    "objectiveId": "211.2",
    "category": "E-Mail Services",
    "description": "Ordonnez les étapes pour configurer Dovecot en format Maildir, activer le protocole IMAPS et fournir l'authentification SASL à Postfix.",
    "descriptionFr": "Ordonnez les étapes pour configurer Dovecot en format Maildir, activer le protocole IMAPS et fournir l'authentification SASL à Postfix.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration du format de boîte aux lettres Maildir dans 10-mail.conf",
        "labelFr": "1. Configuration du format de boîte aux lettres Maildir dans 10-mail.conf",
        "detail": "Définir mail_location = maildir:~/Maildir pour stocker chaque message dans un fichier individuel",
        "detailFr": "Définir mail_location = maildir:~/Maildir pour stocker chaque message dans un fichier individuel"
      },
      {
        "id": "s2",
        "label": "2. Activation du chiffrement SSL obligatoire dans 10-ssl.conf",
        "labelFr": "2. Activation du chiffrement SSL obligatoire dans 10-ssl.conf",
        "detail": "Définir ssl = required et renseigner ssl_cert et ssl_key",
        "detailFr": "Définir ssl = required et renseigner ssl_cert et ssl_key"
      },
      {
        "id": "s3",
        "label": "3. Configuration du socket d'authentification SASL dans 10-master.conf",
        "labelFr": "3. Configuration du socket d'authentification SASL dans 10-master.conf",
        "detail": "Ouvrir un service auth de type unix_listener dans /var/spool/postfix/private/auth accessible à Postfix",
        "detailFr": "Ouvrir un service auth de type unix_listener dans /var/spool/postfix/private/auth accessible à Postfix"
      },
      {
        "id": "s4",
        "label": "4. Raccordement de Postfix au socket Dovecot SASL dans main.cf",
        "labelFr": "4. Raccordement de Postfix au socket Dovecot SASL dans main.cf",
        "detail": "Définir smtpd_sasl_type = dovecot et smtpd_sasl_path = private/auth",
        "detailFr": "Définir smtpd_sasl_type = dovecot et smtpd_sasl_path = private/auth"
      },
      {
        "id": "s5",
        "label": "5. Démarrage des services et test de connexion IMAP chiffrée sur le port 993",
        "labelFr": "5. Démarrage des services et test de connexion IMAP chiffrée sur le port 993",
        "detail": "Lancer dovecot et tester : openssl s_client -connect mail.example.com:993",
        "detailFr": "Lancer dovecot et tester : openssl s_client -connect mail.example.com:993"
      }
    ],
    "explanation": "L'intégration Dovecot/Postfix repose sur : 1) mail_location = maildir:~/Maildir, 2) ssl = required, 3) unix_listener auth dans 10-master.conf, 4) smtpd_sasl_type = dovecot dans Postfix main.cf, 5) test de connexion IMAPS port 993.",
    "explanationFr": "L'intégration Dovecot/Postfix repose sur : 1) mail_location = maildir:~/Maildir, 2) ssl = required, 3) unix_listener auth dans 10-master.conf, 4) smtpd_sasl_type = dovecot dans Postfix main.cf, 5) test de connexion IMAPS port 993."
  },
  {
    "id": "seq-202-19",
    "title": "Deploying an OpenVPN Server with Easy-RSA PKI Infrastructure",
    "titleFr": "Déploiement d'un serveur OpenVPN avec infrastructure PKI Easy-RSA",
    "certification": "lpic-2",
    "topicNumber": 212,
    "objectiveId": "212.1",
    "category": "System Security",
    "description": "Ordonnez la démarche pour initialiser une autorité de certification, signer les certificats et démarrer un tunnel OpenVPN.",
    "descriptionFr": "Ordonnez la démarche pour initialiser une autorité de certification, signer les certificats et démarrer un tunnel OpenVPN.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Initialisation de la PKI et création de l'autorité de certification (CA)",
        "labelFr": "1. Initialisation de la PKI et création de l'autorité de certification (CA)",
        "detail": "Exécuter ./easyrsa init-pki && ./easyrsa build-ca pour générer ca.crt et ca.key",
        "detailFr": "Exécuter ./easyrsa init-pki && ./easyrsa build-ca pour générer ca.crt et ca.key"
      },
      {
        "id": "s2",
        "label": "2. Génération du certificat serveur et des paramètres Diffie-Hellman",
        "labelFr": "2. Génération du certificat serveur et des paramètres Diffie-Hellman",
        "detail": "Lancer ./easyrsa gen-req server nopass && ./easyrsa sign-req server server && ./easyrsa gen-dh",
        "detailFr": "Lancer ./easyrsa gen-req server nopass && ./easyrsa sign-req server server && ./easyrsa gen-dh"
      },
      {
        "id": "s3",
        "label": "3. Génération de la signature HMAC de durcissement (ta.key / tls-crypt)",
        "labelFr": "3. Génération de la signature HMAC de durcissement (ta.key / tls-crypt)",
        "detail": "Créer la clé partagée de protection anti-DoS : openvpn --genkey secret ta.key",
        "detailFr": "Créer la clé partagée de protection anti-DoS : openvpn --genkey secret ta.key"
      },
      {
        "id": "s4",
        "label": "4. Rédaction du fichier de configuration du serveur (/etc/openvpn/server.conf)",
        "labelFr": "4. Rédaction du fichier de configuration du serveur (/etc/openvpn/server.conf)",
        "detail": "Définir dev tun, proto udp, port 1194, server 10.8.0.0 255.255.255.0 et les chemins des certificats",
        "detailFr": "Définir dev tun, proto udp, port 1194, server 10.8.0.0 255.255.255.0 et les chemins des certificats"
      },
      {
        "id": "s5",
        "label": "5. Activation du routage IP noyau et démarrage du service OpenVPN",
        "labelFr": "5. Activation du routage IP noyau et démarrage du service OpenVPN",
        "detail": "Activer net.ipv4.ip_forward=1 et démarrer l'unité systemctl enable --now openvpn@server",
        "detailFr": "Activer net.ipv4.ip_forward=1 et démarrer l'unité systemctl enable --now openvpn@server"
      }
    ],
    "explanation": "Le déploiement OpenVPN avec Easy-RSA s'enchaîne : 1) init-pki et build-ca, 2) génération des clés serveur et gen-dh, 3) clé ta.key anti-DoS, 4) rédaction de server.conf, 5) activation du forwarding noyau et démarrage du service systemd openvpn@server.",
    "explanationFr": "Le déploiement OpenVPN avec Easy-RSA s'enchaîne : 1) init-pki et build-ca, 2) génération des clés serveur et gen-dh, 3) clé ta.key anti-DoS, 4) rédaction de server.conf, 5) activation du forwarding noyau et démarrage du service systemd openvpn@server."
  },
  {
    "id": "seq-202-20",
    "title": "Stateful Firewall Ruleset and Source NAT Masquerading with Nftables",
    "titleFr": "Pare-feu à états (Stateful) et masquage NAT avec Nftables",
    "certification": "lpic-2",
    "topicNumber": 212,
    "objectiveId": "212.2",
    "category": "System Security",
    "description": "Placez dans l'ordre rigoureux les règles pour construire un pare-feu stateful et un partage de connexion NAT avec nftables.",
    "descriptionFr": "Placez dans l'ordre rigoureux les règles pour construire un pare-feu stateful et un partage de connexion NAT avec nftables.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Vidage de la table existante et création de la table inet de base",
        "labelFr": "1. Vidage de la table existante et création de la table inet de base",
        "detail": "Exécuter nft flush ruleset && nft add table inet filter pour initialiser une configuration vierge",
        "detailFr": "Exécuter nft flush ruleset && nft add table inet filter pour initialiser une configuration vierge"
      },
      {
        "id": "s2",
        "label": "2. Création de la chaîne input avec politique par défaut drop",
        "labelFr": "2. Création de la chaîne input avec politique par défaut drop",
        "detail": "Créer la chaîne : nft add chain inet filter input { type filter hook input priority 0 \\; policy drop \\; }",
        "detailFr": "Créer la chaîne : nft add chain inet filter input { type filter hook input priority 0 \\; policy drop \\; }"
      },
      {
        "id": "s3",
        "label": "3. Autorisation du trafic loopback local et du suivi d'état (conntrack)",
        "labelFr": "3. Autorisation du trafic loopback local et du suivi d'état (conntrack)",
        "detail": "Ajouter : iif lo accept et ct state established,related accept en tête de chaîne input",
        "detailFr": "Ajouter : iif lo accept et ct state established,related accept en tête de chaîne input"
      },
      {
        "id": "s4",
        "label": "4. Autorisation sélective des ports de services entrants (SSH / HTTPS)",
        "labelFr": "4. Autorisation sélective des ports de services entrants (SSH / HTTPS)",
        "detail": "Ajouter : tcp dport { 22, 443 } ct state new accept",
        "detailFr": "Ajouter : tcp dport { 22, 443 } ct state new accept"
      },
      {
        "id": "s5",
        "label": "5. Création de la chaîne de masquage NAT sortant (masquerade)",
        "labelFr": "5. Création de la chaîne de masquage NAT sortant (masquerade)",
        "detail": "Ajouter la chaîne postrouting : nft add rule ip nat postrouting oif eth0 masquerade",
        "detailFr": "Ajouter la chaîne postrouting : nft add rule ip nat postrouting oif eth0 masquerade"
      }
    ],
    "explanation": "La construction d'un jeu de règles Nftables respecte l'ordre : 1) flush ruleset et création de table, 2) création des chaînes avec politique 'drop', 3) autorisation du trafic loopback et conntrack (established,related), 4) ouverture des flux new entrants légitimes, 5) masquage NAT.",
    "explanationFr": "La construction d'un jeu de règles Nftables respecte l'ordre : 1) flush ruleset et création de table, 2) création des chaînes avec politique 'drop', 3) autorisation du trafic loopback et conntrack (established,related), 4) ouverture des flux new entrants légitimes, 5) masquage NAT."
  }
];
