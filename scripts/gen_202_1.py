import sys
sys.path.append('scripts')
from writer import generate_file

challenges = [
  # 51. 207.1
  {
    "id": "tb-lpic2-202-51",
    "title": "Erreur de syntaxe dans named.conf détectée par named-checkconf",
    "titleFr": "Erreur de syntaxe dans named.conf détectée par named-checkconf",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS Server - BIND Configuration",
    "scenario": "Le démon DNS BIND (named) refuse de redémarrer après modification de sa configuration. named-checkconf signale une erreur de parsing.",
    "scenarioFr": "Le démon DNS BIND (named) refuse de redémarrer après modification de sa configuration. named-checkconf signale une erreur de parsing.",
    "codeSnippet": """# named-checkconf /etc/bind/named.conf.local
/etc/bind/named.conf.local:5: missing ';' before '}'

# cat -n /etc/bind/named.conf.local
     1	zone "example.com" {
     2	    type master;
     3	    file "/etc/bind/db.example.com";
     4	    allow-transfer { 192.168.1.20 }
     5	};""",
    "language": "config",
    "bugDescription": "Dans la syntaxe BIND named.conf, chaque adresse ou liste d'adresses dans un bloc d'accolades doit obligatoirement se terminer par un point-virgule (192.168.1.20;).",
    "bugDescriptionFr": "Dans la syntaxe BIND named.conf, chaque adresse ou liste d'adresses dans un bloc d'accolades doit obligatoirement se terminer par un point-virgule (192.168.1.20;).",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajouter un point-virgule après l'adresse IP à l'intérieur de l'accolade allow-transfer { 192.168.1.20; };",
        "labelFr": "Ajouter un point-virgule après l'adresse IP à l'intérieur de l'accolade allow-transfer { 192.168.1.20; };",
        "isCorrect": True,
        "explanation": "La grammaire de named.conf impose un point-virgule après chaque élément de liste et après chaque bloc.",
        "explanationFr": "Ajouter le point-virgule obligatoire après 192.168.1.20."
      },
      {
        "id": "opt-2",
        "label": "Remplacer type master par type primary_domain",
        "labelFr": "Remplacer type master par type primary_domain",
        "isCorrect": False,
        "explanation": "Les types officiels sont master (ou primary) et slave (ou secondary).",
        "explanationFr": "Les types officiels sont master/primary et slave/secondary."
      },
      {
        "id": "opt-3",
        "label": "Supprimer complètement la directive allow-transfer",
        "labelFr": "Supprimer complètement la directive allow-transfer",
        "isCorrect": False,
        "explanation": "Sans allow-transfer restreint, n'importe qui peut aspirer la zone (AXFR).",
        "explanationFr": "Sans allow-transfer restreint, n'importe qui peut aspirer la zone."
      },
      {
        "id": "opt-4",
        "label": "Remplacer les guillemets par des chevrons",
        "labelFr": "Remplacer les guillemets par des chevrons",
        "isCorrect": False,
        "explanation": "Les noms de fichiers et zones s'entourent de guillemets doubles.",
        "explanationFr": "Les noms de fichiers et zones s'entourent de guillemets doubles."
      }
    ],
    "correctedSnippet": """zone "example.com" {
    type master;
    file "/etc/bind/db.example.com";
    allow-transfer { 192.168.1.20; };
};""",
    "fixExplanation": "Ajouter le point-virgule manquant dans la directive allow-transfer.",
    "fixExplanationFr": "Ajouter le point-virgule manquant dans la directive allow-transfer."
  },
  # 52. 207.2
  {
    "id": "tb-lpic2-202-52",
    "title": "Numéro de série SOA non incrémenté : Zone DNS non synchronisée sur le serveur esclave",
    "titleFr": "Numéro de série SOA non incrémenté : Zone DNS non synchronisée sur le serveur esclave",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "DNS Server - Zone Management",
    "scenario": "L'administrateur a ajouté un nouvel enregistrement DNS sur le serveur maître. Pourtant, le serveur esclave continue de répondre avec l'ancienne configuration et n'effectue aucun transfert de zone (AXFR/IXFR).",
    "scenarioFr": "L'administrateur a ajouté un nouvel enregistrement DNS sur le serveur maître. Pourtant, le serveur esclave continue de répondre avec l'ancienne configuration et n'effectue aucun transfert de zone (AXFR/IXFR).",
    "codeSnippet": """# dig @master example.com SOA +short
ns1.example.com. hostmaster.example.com. 2026090101 3600 1800 604800 86400

# dig @slave example.com SOA +short
ns1.example.com. hostmaster.example.com. 2026090101 3600 1800 604800 86400

# named-checkzone example.com /etc/bind/db.example.com
zone example.com/IN: loaded serial 2026090101
OK""",
    "language": "bash",
    "bugDescription": "L'administrateur a modifié les enregistrements dans le fichier de zone mais a oublié d'incrémenter le numéro de série SOA (Serial). Le serveur esclave considère sa copie locale comme à jour.",
    "bugDescriptionFr": "L'administrateur a modifié les enregistrements dans le fichier de zone mais a oublié d'incrémenter le numéro de série SOA (Serial). Le serveur esclave considère sa copie locale comme à jour.",
    "options": [
      {
        "id": "opt-1",
        "label": "Incrémenter le numéro de série dans l'enregistrement SOA du fichier de zone maître (ex: passer à 2026090102) et recharger BIND avec 'rndc reload'",
        "labelFr": "Incrémenter le numéro de série dans l'enregistrement SOA du fichier de zone maître (ex: passer à 2026090102) et recharger BIND avec 'rndc reload'",
        "isCorrect": True,
        "explanation": "Les serveurs DNS secondaires ne déclenchent un transfert AXFR que si le Serial SOA du maître est strictement supérieur à leur Serial local.",
        "explanationFr": "Incrémenter le numéro de série SOA sur le serveur maître et recharger avec rndc reload."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le serveur esclave de l'infrastructure",
        "labelFr": "Supprimer le serveur esclave de l'infrastructure",
        "isCorrect": False,
        "explanation": "La redondance DNS exige au minimum deux serveurs faisant autorité.",
        "explanationFr": "La redondance DNS exige au minimum deux serveurs faisant autorité."
      },
      {
        "id": "opt-3",
        "label": "Diminuer le TTL à zéro seconde",
        "labelFr": "Diminuer le TTL à zéro seconde",
        "isCorrect": False,
        "explanation": "Le TTL régit la mise en cache par les résolveurs récursifs, pas le transfert de zone entre autorités.",
        "explanationFr": "Le TTL régit la mise en cache des résolveurs, pas les transferts de zone."
      },
      {
        "id": "opt-4",
        "label": "Changer le port DNS de 53 à 5353",
        "labelFr": "Changer le port DNS de 53 à 5353",
        "isCorrect": False,
        "explanation": "5353 est mDNS (Multicast DNS).",
        "explanationFr": "5353 est mDNS."
      }
    ],
    "correctedSnippet": """# Incrémenter le Serial dans /etc/bind/db.example.com :
@   IN  SOA ns1.example.com. hostmaster.example.com. (
            2026090102 ; Serial incrémenté
            3600       ; Refresh
            1800       ; Retry
            604800     ; Expire
            86400 )    ; Minimum TTL

# rndc reload example.com""",
    "fixExplanation": "Incrémenter le Serial dans l'enregistrement SOA puis exécuter 'rndc reload'.",
    "fixExplanationFr": "Incrémenter le Serial dans l'enregistrement SOA puis exécuter 'rndc reload'."
  },
  # 53. 207.2
  {
    "id": "tb-lpic2-202-53",
    "title": "Point terminal manquant dans un enregistrement CNAME DNS (FQDN relatif)",
    "titleFr": "Point terminal manquant dans un enregistrement CNAME DNS (FQDN relatif)",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "DNS Server - Zone File Records",
    "scenario": "Un enregistrement CNAME vers un serveur web externe renvoie une réponse erronée 'web.example.com.example.com.'.",
    "scenarioFr": "Un enregistrement CNAME vers un serveur web externe renvoie une réponse erronée 'web.example.com.example.com.'.",
    "codeSnippet": """# cat /etc/bind/db.example.com
$ORIGIN example.com.
$TTL 86400
@       IN  SOA ns1.example.com. admin.example.com. ( 2026090101 3600 1800 604800 86400 )
@       IN  NS  ns1.example.com.
www     IN  CNAME web.example.com

# dig +short www.example.com
web.example.com.example.com.""",
    "language": "bindzone",
    "bugDescription": "La cible du CNAME 'web.example.com' ne possède pas de point final (dot terminal). BIND lui accole automatiquement la valeur de $ORIGIN, produisant 'web.example.com.example.com.'.",
    "bugDescriptionFr": "La cible du CNAME 'web.example.com' ne possède pas de point final (dot terminal). BIND lui accole automatiquement la valeur de $ORIGIN, produisant 'web.example.com.example.com.'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajouter le point final à la cible pour en faire un nom pleinement qualifié (FQDN) : 'www IN CNAME web.example.com.'",
        "labelFr": "Ajouter le point final à la cible pour en faire un nom pleinement qualifié (FQDN) : 'www IN CNAME web.example.com.'",
        "isCorrect": True,
        "explanation": "En zone DNS BIND, tout nom sans point terminal est considéré comme relatif à la zone courante ($ORIGIN).",
        "explanationFr": "Ajouter le point terminal (trailing dot) pour former un FQDN absolu."
      },
      {
        "id": "opt-2",
        "label": "Remplacer CNAME par un enregistrement PTR",
        "labelFr": "Remplacer CNAME par un enregistrement PTR",
        "isCorrect": False,
        "explanation": "PTR est réservé à la résolution inverse dans les zones in-addr.arpa.",
        "explanationFr": "PTR est réservé à la résolution inverse."
      },
      {
        "id": "opt-3",
        "label": "Supprimer la directive $ORIGIN",
        "labelFr": "Supprimer la directive $ORIGIN",
        "isCorrect": False,
        "explanation": "Même sans $ORIGIN explicite, BIND prend par défaut le nom de la zone.",
        "explanationFr": "BIND prend par défaut le nom de la zone."
      },
      {
        "id": "opt-4",
        "label": "Changer IN en OUT",
        "labelFr": "Changer IN en OUT",
        "isCorrect": False,
        "explanation": "IN désigne la classe Internet universelle du DNS.",
        "explanationFr": "IN désigne la classe Internet universelle."
      }
    ],
    "correctedSnippet": """# /etc/bind/db.example.com
www     IN  CNAME web.example.com.
; Noter le point après .com.""",
    "fixExplanation": "Ajouter un point final '.' après le nom de domaine cible du CNAME.",
    "fixExplanationFr": "Ajouter un point final '.' après le nom de domaine cible du CNAME."
  },
  # 54. 207.3
  {
    "id": "tb-lpic2-202-54",
    "title": "Transfert de zone AXFR refusé par TSIG (rndc: tsig verify failure)",
    "titleFr": "Transfert de zone AXFR refusé par TSIG (rndc: tsig verify failure)",
    "topicNumber": 207,
    "objectiveId": "207.3",
    "category": "DNS Server - DNSSEC and TSIG",
    "scenario": "La communication entre rndc et named échoue subitement avec l'erreur 'tsig verify failure'. Le serveur n'a subi aucune modification de fichier.",
    "scenarioFr": "La communication entre rndc et named échoue subitement avec l'erreur 'tsig verify failure'. Le serveur n'a subi aucune modification de fichier.",
    "codeSnippet": """# rndc reload
rndc: connect failed: 127.0.0.1#953: tsig verify failure

# date
Wed Sep 10 12:00:00 UTC 2026

# timedatectl status
               Local time: Wed 2026-09-10 12:00:00 UTC
           Universal time: Wed 2026-09-10 12:00:00 UTC
                 RTC time: Sun 2026-09-07 08:30:00
System clock synchronized: no
              NTP service: inactive""",
    "language": "bash",
    "bugDescription": "L'horloge système ou celle du client est désynchronisée de plusieurs minutes/jours. Les signatures de transaction TSIG intègrent un horodatage valide pour une fenêtre stricte de 300 secondes (fudge time).",
    "bugDescriptionFr": "L'horloge système ou celle du client est désynchronisée de plusieurs minutes/jours. Les signatures de transaction TSIG intègrent un horodatage valide pour une fenêtre stricte de 300 secondes (fudge time).",
    "options": [
      {
        "id": "opt-1",
        "label": "Synchroniser les horloges système via NTP (chrony ou systemd-timesyncd) : TSIG rejette tout paquet dont l'écart temporel dépasse 300 secondes",
        "labelFr": "Synchroniser les horloges système via NTP (chrony ou systemd-timesyncd) : TSIG rejette tout paquet dont l'écart temporel dépasse 300 secondes",
        "isCorrect": True,
        "explanation": "Les mécanismes cryptographiques TSIG et DNSSEC reposent impérativement sur des horloges précises pour contrer les attaques par rejeu.",
        "explanationFr": "Synchroniser l'horloge système avec NTP."
      },
      {
        "id": "opt-2",
        "label": "Remplacer l'algorithme HMAC-SHA256 par MD5 dans named.conf",
        "labelFr": "Remplacer l'algorithme HMAC-SHA256 par MD5 dans named.conf",
        "isCorrect": False,
        "explanation": "MD5 est déprécié et le problème est temporel.",
        "explanationFr": "MD5 est déprécié et le problème est temporel."
      },
      {
        "id": "opt-3",
        "label": "Désactiver le port 953 dans iptables",
        "labelFr": "Désactiver le port 953 dans iptables",
        "isCorrect": False,
        "explanation": "rndc a besoin du port 953 TCP.",
        "explanationFr": "rndc a besoin du port 953 TCP."
      },
      {
        "id": "opt-4",
        "label": "Supprimer le binaire rndc",
        "labelFr": "Supprimer le binaire rndc",
        "isCorrect": False,
        "explanation": "rndc est l'outil d'administration officiel de BIND.",
        "explanationFr": "rndc est l'outil d'administration officiel de BIND."
      }
    ],
    "correctedSnippet": """# Activer la synchronisation NTP :
timedatectl set-ntp true
# Ou forcer la synchronisation chrony :
chronyc makestep
# Vérifier que rndc fonctionne à nouveau :
rndc reload""",
    "fixExplanation": "Synchroniser l'heure système avec NTP pour que les timestamps TSIG soient dans la fenêtre de validité.",
    "fixExplanationFr": "Synchroniser l'heure système avec NTP pour que les timestamps TSIG soient dans la fenêtre de validité."
  },
  # 55. 208.1
  {
    "id": "tb-lpic2-202-55",
    "title": "Erreur Apache 'AH00072: make_sock: could not bind to address 0.0.0.0:80'",
    "titleFr": "Erreur Apache 'AH00072: make_sock: could not bind to address 0.0.0.0:80'",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services - Apache HTTP Server",
    "scenario": "Le serveur Apache2 refuse de démarrer. Le journal error.log signale que l'adresse est déjà utilisée.",
    "scenarioFr": "Le serveur Apache2 refuse de démarrer. Le journal error.log signale que l'adresse est déjà utilisée.",
    "codeSnippet": """# systemctl status apache2
(98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80
no listening sockets available, shutting down

# ss -tulpn | grep :80
tcp   LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=1234,fd=6))""",
    "language": "bash",
    "bugDescription": "Le serveur Nginx est déjà en cours d'exécution et accapare la socket TCP port 80. Deux serveurs web distincts ne peuvent écouter sur le même port de la même interface sans configuration de reverse proxy.",
    "bugDescriptionFr": "Le serveur Nginx est déjà en cours d'exécution et accapare la socket TCP port 80. Deux serveurs web distincts ne peuvent écouter sur le même port de la même interface sans configuration de reverse proxy.",
    "options": [
      {
        "id": "opt-1",
        "label": "Conflit de port TCP 80 : Nginx écoute déjà sur ce port ; il faut arrêter Nginx ou modifier le port d'écoute d'Apache (Listen 8080 dans ports.conf)",
        "labelFr": "Conflit de port TCP 80 : Nginx écoute déjà sur ce port ; il faut arrêter Nginx ou modifier le port d'écoute d'Apache (Listen 8080 dans ports.conf)",
        "isCorrect": True,
        "explanation": "L'appel bind() échoue avec EADDRINUSE si un processus détient déjà la socket.",
        "explanationFr": "Stopper Nginx ou basculer Apache sur un port différent comme 8080."
      },
      {
        "id": "opt-2",
        "label": "Changer le format des logs en combined",
        "labelFr": "Changer le format des logs en combined",
        "isCorrect": False,
        "explanation": "Le format des logs n'a aucun impact sur l'ouverture des sockets réseau.",
        "explanationFr": "Le format des logs n'a aucun impact sur l'ouverture des sockets."
      },
      {
        "id": "opt-3",
        "label": "Supprimer le module mpm_event",
        "labelFr": "Supprimer le module mpm_event",
        "isCorrect": False,
        "explanation": "Le MPM gère les threads de requêtes, pas le conflit de port.",
        "explanationFr": "Le MPM gère les threads de requêtes."
      },
      {
        "id": "opt-4",
        "label": "Formater la partition /var/www",
        "labelFr": "Formater la partition /var/www",
        "isCorrect": False,
        "explanation": "Destructeur et inefficace.",
        "explanationFr": "Destructeur et inefficace."
      }
    ],
    "correctedSnippet": """# Stopper et désactiver Nginx s'il n'est plus requis :
systemctl stop nginx && systemctl disable nginx
# Démarrer Apache :
systemctl start apache2""",
    "fixExplanation": "Stopper le service concurrent accaparant le port 80 puis démarrer Apache.",
    "fixExplanationFr": "Stopper le service concurrent accaparant le port 80 puis démarrer Apache."
  },
  # 56. 208.1
  {
    "id": "tb-lpic2-202-56",
    "title": "Erreur HTTP 403 Forbidden sous Apache : Directive Require manquante",
    "titleFr": "Erreur HTTP 403 Forbidden sous Apache : Directive Require manquante",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services - Apache Access Control",
    "scenario": "Après avoir déplacé le DocumentRoot vers /data/www, tous les visiteurs reçoivent une erreur '403 Forbidden', alors que les permissions UNIX sont en 755.",
    "scenarioFr": "Après avoir déplacé le DocumentRoot vers /data/www, tous les visiteurs reçoivent une erreur '403 Forbidden', alors que les permissions UNIX sont en 755.",
    "codeSnippet": """# tail -n 2 /var/log/apache2/error.log
[authz_core:error] [pid 4210] [client 192.168.1.50:52410] AH01630: client denied by server configuration: /data/www/index.html

# cat /etc/apache2/sites-enabled/mysite.conf
<VirtualHost *:80>
    DocumentRoot /data/www
    ServerName app.example.com
</VirtualHost>""",
    "language": "apache",
    "bugDescription": "Sous Apache 2.4, l'accès au système de fichiers racine est verrouillé par défaut. Tout nouveau DocumentRoot en dehors de /var/www doit déclarer un bloc <Directory> avec la directive 'Require all granted'.",
    "bugDescriptionFr": "Sous Apache 2.4, l'accès au système de fichiers racine est verrouillé par défaut. Tout nouveau DocumentRoot en dehors de /var/www doit déclarer un bloc <Directory> avec la directive 'Require all granted'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajouter un bloc <Directory /data/www> contenant la directive 'Require all granted' dans la configuration du VirtualHost",
        "labelFr": "Ajouter un bloc <Directory /data/www> contenant la directive 'Require all granted' dans la configuration du VirtualHost",
        "isCorrect": True,
        "explanation": "Le module mod_authz_core bloque l'accès par défaut (AH01630). 'Require all granted' est obligatoire pour autoriser la lecture web sous Apache 2.4.",
        "explanationFr": "Ajouter <Directory /data/www> Require all granted </Directory>."
      },
      {
        "id": "opt-2",
        "label": "Remplacer Require all granted par Order allow,deny et Allow from all",
        "labelFr": "Remplacer Require all granted par Order allow,deny et Allow from all",
        "isCorrect": False,
        "explanation": "C'est l'ancienne syntaxe dépréciée d'Apache 2.2.",
        "explanationFr": "Syntaxe dépréciée d'Apache 2.2."
      },
      {
        "id": "opt-3",
        "label": "Mettre les permissions 777 sur le dossier /",
        "labelFr": "Mettre les permissions 777 sur le dossier /",
        "isCorrect": False,
        "explanation": "Faille de sécurité critique détruisant l'isolation de sécurité Linux.",
        "explanationFr": "Faille de sécurité critique."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le module authz_core",
        "labelFr": "Désactiver le module authz_core",
        "isCorrect": False,
        "explanation": "authz_core est un module interne indispensable au fonctionnement d'Apache 2.4.",
        "explanationFr": "authz_core est un module interne indispensable."
      }
    ],
    "correctedSnippet": """<VirtualHost *:80>
    DocumentRoot /data/www
    ServerName app.example.com

    <Directory /data/www>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>""",
    "fixExplanation": "Déclarer un bloc <Directory> avec la directive 'Require all granted'.",
    "fixExplanationFr": "Déclarer un bloc <Directory> avec la directive 'Require all granted'."
  },
  # 57. 208.2
  {
    "id": "tb-lpic2-202-57",
    "title": "Erreur Nginx '502 Bad Gateway' : Socket PHP-FPM inaccessible",
    "titleFr": "Erreur Nginx '502 Bad Gateway' : Socket PHP-FPM inaccessible",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services - Nginx Reverse Proxy & FastCGI",
    "scenario": "Les pages PHP d'un site Nginx retournent une erreur HTTP 502 Bad Gateway.",
    "scenarioFr": "Les pages PHP d'un site Nginx retournent une erreur HTTP 502 Bad Gateway.",
    "codeSnippet": """# tail -n 1 /var/log/nginx/error.log
[error] 3120#3120: *1 connect() to unix:/run/php/php8.2-fpm.sock failed (13: Permission denied) while connecting to upstream, client: 192.168.1.50, server: example.com, request: "GET /index.php HTTP/1.1", upstream: "fastcgi://unix:/run/php/php8.2-fpm.sock:"

# ls -l /run/php/php8.2-fpm.sock
srw-rw---- 1 root root 0 Sep 10 12:15 /run/php/php8.2-fpm.sock""",
    "language": "bash",
    "bugDescription": "La socket UNIX php-fpm appartient à 'root:root' avec les droits 0660. Le processus travailleur Nginx (tournant sous www-data) reçoit un refus de permission (13: Permission denied) lors de la tentative de connexion.",
    "bugDescriptionFr": "La socket UNIX php-fpm appartient à 'root:root' avec les droits 0660. Le processus travailleur Nginx (tournant sous www-data) reçoit un refus de permission (13: Permission denied) lors de la tentative de connexion.",
    "options": [
      {
        "id": "opt-1",
        "label": "Configurer 'listen.owner = www-data' et 'listen.group = www-data' dans le pool PHP-FPM (/etc/php/8.2/fpm/pool.d/www.conf) puis redémarrer php-fpm",
        "labelFr": "Configurer 'listen.owner = www-data' et 'listen.group = www-data' dans le pool PHP-FPM (/etc/php/8.2/fpm/pool.d/www.conf) puis redémarrer php-fpm",
        "isCorrect": True,
        "explanation": "Nginx doit avoir le droit de lire et écrire sur la socket UNIX PHP-FPM. L'utilisateur www-data doit être propriétaire ou membre du groupe de la socket.",
        "explanationFr": "Ajuster listen.owner et listen.group pour www-data dans le pool PHP-FPM."
      },
      {
        "id": "opt-2",
        "label": "Passer le serveur Nginx en HTTP/3",
        "labelFr": "Passer le serveur Nginx en HTTP/3",
        "isCorrect": False,
        "explanation": "La version HTTP ne corrige pas le droit d'accès à la socket locale.",
        "explanationFr": "La version HTTP ne corrige pas les droits de socket."
      },
      {
        "id": "opt-3",
        "label": "Supprimer les fichiers .php du serveur",
        "labelFr": "Supprimer les fichiers .php du serveur",
        "isCorrect": False,
        "explanation": "Cela détruirait l'application.",
        "explanationFr": "Cela détruirait l'application."
      },
      {
        "id": "opt-4",
        "label": "Remplacer Nginx par Squid",
        "labelFr": "Remplacer Nginx par Squid",
        "isCorrect": False,
        "explanation": "Squid est un proxy/cache de transmission ou d'accélération, pas un gestionnaire FastCGI applicatif.",
        "explanationFr": "Squid n'est pas un serveur FastCGI."
      }
    ],
    "correctedSnippet": """# Dans /etc/php/8.2/fpm/pool.d/www.conf :
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

# Recharger le service PHP-FPM :
systemctl restart php8.2-fpm""",
    "fixExplanation": "Définir listen.owner et listen.group à www-data dans www.conf.",
    "fixExplanationFr": "Définir listen.owner et listen.group à www-data dans www.conf."
  },
  # 58. 208.3
  {
    "id": "tb-lpic2-202-58",
    "title": "Erreur Squid Proxy : 'Access Denied' pour les clients du réseau local (ACL manquante)",
    "titleFr": "Erreur Squid Proxy : 'Access Denied' pour les clients du réseau local (ACL manquante)",
    "topicNumber": 208,
    "objectiveId": "208.3",
    "category": "Web Services - Squid Proxy Cache",
    "scenario": "Les postes clients configurés pour naviguer à travers le proxy Squid 192.168.10.1:3128 reçoivent tous une page d'erreur 'Access Denied'.",
    "scenarioFr": "Les postes clients configurés pour naviguer à travers le proxy Squid 192.168.10.1:3128 reçoivent tous une page d'erreur 'Access Denied'.",
    "codeSnippet": """# tail -n 2 /var/log/squid/access.log
1725968400.120   192.168.10.25 TCP_DENIED/403 4120 GET http://www.example.com/ - HIER_NONE/- text/html

# grep -E "http_access|localnet" /etc/squid/squid.conf
# acl localnet src 192.168.0.0/16
http_access deny all""",
    "language": "config",
    "bugDescription": "La directive 'acl localnet src 192.168.0.0/16' est commentée, et la seule règle active est 'http_access deny all', qui rejette tout le trafic client.",
    "bugDescriptionFr": "La directive 'acl localnet src 192.168.0.0/16' est commentée, et la seule règle active est 'http_access deny all', qui rejette tout le trafic client.",
    "options": [
      {
        "id": "opt-1",
        "label": "Définir l'ACL du réseau local (ex: acl mylan src 192.168.10.0/24) et autoriser l'accès avec 'http_access allow mylan' avant la règle 'http_access deny all'",
        "labelFr": "Définir l'ACL du réseau local (ex: acl mylan src 192.168.10.0/24) et autoriser l'accès avec 'http_access allow mylan' avant la règle 'http_access deny all'",
        "isCorrect": True,
        "explanation": "Squid évalue les directives http_access selon l'ordre du fichier (first-match). Sans règle d'autorisation explicite avant deny all, tout est rejeté.",
        "explanationFr": "Définir l'ACL réseau et insérer http_access allow avant deny all."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le fichier de cache swap.state",
        "labelFr": "Supprimer le fichier de cache swap.state",
        "isCorrect": False,
        "explanation": "swap.state gère les métadonnées des objets en cache, pas les contrôles d'accès.",
        "explanationFr": "swap.state gère les métadonnées de cache."
      },
      {
        "id": "opt-3",
        "label": "Changer le port de 3128 à 80",
        "labelFr": "Changer le port de 3128 à 80",
        "isCorrect": False,
        "explanation": "3128 est le port standard dédié au proxy Squid.",
        "explanationFr": "3128 est le port standard dédié à Squid."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le protocole TCP dans squid.conf",
        "labelFr": "Désactiver le protocole TCP dans squid.conf",
        "isCorrect": False,
        "explanation": "HTTP repose impérativement sur TCP.",
        "explanationFr": "HTTP repose sur TCP."
      }
    ],
    "correctedSnippet": """# Dans /etc/squid/squid.conf :
acl mylan src 192.168.10.0/24
http_access allow mylan
http_access deny all

# Recharger Squid :
squid -k reconfigure""",
    "fixExplanation": "Définir l'ACL du sous-réseau et autoriser son transit avec 'http_access allow'.",
    "fixExplanationFr": "Définir l'ACL du sous-réseau et autoriser son transit avec 'http_access allow'."
  },
  # 59. 209.1
  {
    "id": "tb-lpic2-202-59",
    "title": "Échec d'authentification Samba (NT_STATUS_LOGON_FAILURE)",
    "titleFr": "Échec d'authentification Samba (NT_STATUS_LOGON_FAILURE)",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing - Samba Authentication",
    "scenario": "Un utilisateur Linux existant 'alice' tente d'accéder à son partage Samba mais reçoit le message 'NT_STATUS_LOGON_FAILURE'.",
    "scenarioFr": "Un utilisateur Linux existant 'alice' tente d'accéder à son partage Samba mais reçoit le message 'NT_STATUS_LOGON_FAILURE'.",
    "codeSnippet": """# smbclient //localhost/partage -U alice
Password for [WORKGROUP\\alice]:
session setup failed: NT_STATUS_LOGON_FAILURE

# id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice)

# pdbedit -L
(Liste vide)""",
    "language": "bash",
    "bugDescription": "L'utilisateur 'alice' existe dans /etc/passwd mais n'a jamais été initialisé dans la base de mots de passe Samba (passdb.tdb) via la commande 'smbpasswd -a alice'.",
    "bugDescriptionFr": "L'utilisateur 'alice' existe dans /etc/passwd mais n'a jamais été initialisé dans la base de mots de passe Samba (passdb.tdb) via la commande 'smbpasswd -a alice'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Créer le compte et mot de passe dans la base Samba avec 'smbpasswd -a alice'",
        "labelFr": "Créer le compte et mot de passe dans la base Samba avec 'smbpasswd -a alice'",
        "isCorrect": True,
        "explanation": "Samba stocke ses propres hashs de mots de passe compatibles NTLM dans passdb.tdb. Un compte système UNIX doit être explicitement ajouté avec smbpasswd -a.",
        "explanationFr": "Ajouter l'utilisateur dans la base Samba via 'smbpasswd -a alice'."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le fichier /etc/samba/smb.conf",
        "labelFr": "Supprimer le fichier /etc/samba/smb.conf",
        "isCorrect": False,
        "explanation": "Cela désactiverait tous les partages.",
        "explanationFr": "Cela désactiverait tous les partages."
      },
      {
        "id": "opt-3",
        "label": "Modifier le shell d'alice en /bin/false",
        "labelFr": "Modifier le shell d'alice en /bin/false",
        "isCorrect": False,
        "explanation": "Le shell n'alimente pas la base de mots de passe Samba.",
        "explanationFr": "Le shell n'alimente pas la base Samba."
      },
      {
        "id": "opt-4",
        "label": "Passer le paramètre security = server dans smb.conf",
        "labelFr": "Passer le paramètre security = server dans smb.conf",
        "isCorrect": False,
        "explanation": "security = server est obsolète et déprécié.",
        "explanationFr": "security = server est obsolète."
      }
    ],
    "correctedSnippet": """# smbpasswd -a alice
New SMB password: ********
Retype new SMB password: ********
Added user alice.

# pdbedit -L
alice:1001:""",
    "fixExplanation": "Ajouter l'utilisateur dans la base de comptes Samba avec 'smbpasswd -a <user>'.",
    "fixExplanationFr": "Ajouter l'utilisateur dans la base de comptes Samba avec 'smbpasswd -a <user>'."
  },
  # 60. 209.1
  {
    "id": "tb-lpic2-202-60",
    "title": "Partage Samba en lecture seule malgré 'read only = no' (Permissions UNIX 755)",
    "titleFr": "Partage Samba en lecture seule malgré 'read only = no' (Permissions UNIX 755)",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing - Samba Permissions",
    "scenario": "Les utilisateurs Samba authentifiés ne peuvent créer aucun fichier dans le partage et obtiennent 'NT_STATUS_ACCESS_DENIED'.",
    "scenarioFr": "Les utilisateurs Samba authentifiés ne peuvent créer aucun fichier dans le partage et obtiennent 'NT_STATUS_ACCESS_DENIED'.",
    "codeSnippet": """# testparm -s --section-name=public
[public]
	path = /srv/samba/public
	read only = No
	valid users = @compta

# ls -ld /srv/samba/public
drwxr-xr-x 2 root root 4096 Sep 10 12:30 /srv/samba/public""",
    "language": "bash",
    "bugDescription": "Même si Samba autorise l'écriture ('read only = No'), les permissions du système de fichiers UNIX local (755 root:root) interdisent l'écriture aux membres du groupe 'compta'.",
    "bugDescriptionFr": "Même si Samba autorise l'écriture ('read only = No'), les permissions du système de fichiers UNIX local (755 root:root) interdisent l'écriture aux membres du groupe 'compta'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajuster les permissions et propriétaire UNIX locaux du dossier sous-jacent : 'chown -R :compta /srv/samba/public' et 'chmod -R 775 /srv/samba/public'",
        "labelFr": "Ajuster les permissions et propriétaire UNIX locaux du dossier sous-jacent : 'chown -R :compta /srv/samba/public' et 'chmod -R 775 /srv/samba/public'",
        "isCorrect": True,
        "explanation": "Les permissions Samba et les permissions POSIX sous-jacentes se cumulent : l'écriture doit être autorisée à la fois dans smb.conf ET sur le système de fichiers Linux.",
        "explanationFr": "Accorder les droits d'écriture POSIX au groupe compta sur le dossier local."
      },
      {
        "id": "opt-2",
        "label": "Passer 'read only = Yes' dans smb.conf",
        "labelFr": "Passer 'read only = Yes' dans smb.conf",
        "isCorrect": False,
        "explanation": "Cela verrouillerait explicitement le partage en lecture seule côté Samba.",
        "explanationFr": "Cela verrouillerait le partage en lecture seule."
      },
      {
        "id": "opt-3",
        "label": "Supprimer le groupe compta de valid users",
        "labelFr": "Supprimer le groupe compta de valid users",
        "isCorrect": False,
        "explanation": "valid users restreint les connexions légitimes.",
        "explanationFr": "valid users restreint les connexions légitimes."
      },
      {
        "id": "opt-4",
        "label": "Formater /srv/samba/public en FAT32",
        "labelFr": "Formater /srv/samba/public en FAT32",
        "isCorrect": False,
        "explanation": "Inapproprié.",
        "explanationFr": "Inapproprié."
      }
    ],
    "correctedSnippet": """# chgrp -R compta /srv/samba/public
# chmod -R 775 /srv/samba/public
# (Optionnel : chmod g+s pour propager le groupe)
# chmod g+s /srv/samba/public""",
    "fixExplanation": "Harmoniser la propriété de groupe et les droits d'écriture POSIX sur le dossier partagé.",
    "fixExplanationFr": "Harmoniser la propriété de groupe et les droits d'écriture POSIX sur le dossier partagé."
  },
  # 61. 209.2
  {
    "id": "tb-lpic2-202-61",
    "title": "Erreur NFS 'mount.nfs: access denied by server while mounting'",
    "titleFr": "Erreur NFS 'mount.nfs: access denied by server while mounting'",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing - NFS Exports",
    "scenario": "Un client NFS 192.168.1.50 tente de monter le répertoire /data partagé par le serveur, mais reçoit une fin de non-recevoir.",
    "scenarioFr": "Un client NFS 192.168.1.50 tente de monter le répertoire /data partagé par le serveur, mais reçoit une fin de non-recevoir.",
    "codeSnippet": """# client$ mount -t nfs 192.168.1.10:/data /mnt
mount.nfs: access denied by server while mounting 192.168.1.10:/data

# server# cat /etc/exports
/data 192.168.1.0/24 (rw,sync,no_subtree_check)

# server# exportfs -v
/data <world>(ro,wdelay,root_squash,no_subtree_check,fsid=0)""",
    "language": "config",
    "bugDescription": "Il y a un espace entre l'adresse réseau '192.168.1.0/24' et la parenthèse d'options '(rw,sync,no_subtree_check)'. NFS interprète alors 192.168.1.0/24 avec les options par défaut (ro) et accorde le reste au monde entier (world).",
    "bugDescriptionFr": "Il y a un espace entre l'adresse réseau '192.168.1.0/24' et la parenthèse d'options '(rw,sync,no_subtree_check)'. NFS interprète alors 192.168.1.0/24 avec les options par défaut (ro) et accorde le reste au monde entier (world).",
    "options": [
      {
        "id": "opt-1",
        "label": "Supprimer l'espace entre la définition de l'hôte et la parenthèse ouvrante dans /etc/exports : '/data 192.168.1.0/24(rw,sync,no_subtree_check)' puis exécuter 'exportfs -ra'",
        "labelFr": "Supprimer l'espace entre la définition de l'hôte et la parenthèse ouvrante dans /etc/exports : '/data 192.168.1.0/24(rw,sync,no_subtree_check)' puis exécuter 'exportfs -ra'",
        "isCorrect": True,
        "explanation": "C'est un piège classique sous Linux/NFS : l'espace sépare deux entrées distinctes dans la syntaxe de /etc/exports.",
        "explanationFr": "Supprimer l'espace entre l'IP et la parenthèse d'options puis recharger avec exportfs -ra."
      },
      {
        "id": "opt-2",
        "label": "Remplacer NFS par FTP",
        "labelFr": "Remplacer NFS par FTP",
        "isCorrect": False,
        "explanation": "FTP n'est pas un système de fichiers réseau montable en POSIX direct.",
        "explanationFr": "FTP n'est pas un système de fichiers montable."
      },
      {
        "id": "opt-3",
        "label": "Changer le port de rpcbind",
        "labelFr": "Changer le port de rpcbind",
        "isCorrect": False,
        "explanation": "rpcbind écoute obligatoirement sur le port 111.",
        "explanationFr": "rpcbind écoute obligatoirement sur le port 111."
      },
      {
        "id": "opt-4",
        "label": "Ajouter l'option -t ext4 dans mount",
        "labelFr": "Ajouter l'option -t ext4 dans mount",
        "isCorrect": False,
        "explanation": "Le type de montage distant est nfs ou nfs4.",
        "explanationFr": "Le type de montage est nfs ou nfs4."
      }
    ],
    "correctedSnippet": """# Dans /etc/exports (sans espace avant la parenthèse) :
/data 192.168.1.0/24(rw,sync,no_subtree_check)

# Recharger la table d'exportation :
exportfs -ra""",
    "fixExplanation": "Supprimer l'espace entre l'hôte et ses options dans /etc/exports.",
    "fixExplanationFr": "Supprimer l'espace entre l'hôte et ses options dans /etc/exports."
  },
  # 62. 209.2
  {
    "id": "tb-lpic2-202-62",
    "title": "Fichiers créés sur partage NFS appartenant à nobody:nogroup (Root Squash)",
    "titleFr": "Fichiers créés sur partage NFS appartenant à nobody:nogroup (Root Squash)",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing - NFS Root Squash",
    "scenario": "Un script de sauvegarde tournant en tant que root sur un client NFS crée des fichiers sur le montage /mnt/backup, mais ces fichiers se retrouvent avec le propriétaire 'nobody:nogroup' (UID 65534).",
    "scenarioFr": "Un script de sauvegarde tournant en tant que root sur un client NFS crée des fichiers sur le montage /mnt/backup, mais ces fichiers se retrouvent avec le propriétaire 'nobody:nogroup' (UID 65534).",
    "codeSnippet": """# client# touch /mnt/backup/test.txt
# client# ls -l /mnt/backup/test.txt
-rw-r--r-- 1 nobody nogroup 0 Sep 10 12:35 /mnt/backup/test.txt

# server# exportfs -v | grep backup
/backup 192.168.1.0/24(rw,sync,root_squash,no_subtree_check)""",
    "language": "bash",
    "bugDescription": "Par défaut, NFS applique la sécurité 'root_squash' qui convertit automatiquement l'UID 0 (root distant) en compte non privilégié 'nobody' (UID 65534). Pour préserver l'UID root, il faut spécifier 'no_root_squash'.",
    "bugDescriptionFr": "Par défaut, NFS applique la sécurité 'root_squash' qui convertit automatiquement l'UID 0 (root distant) en compte non privilégié 'nobody' (UID 65534). Pour préserver l'UID root, il faut spécifier 'no_root_squash'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Configurer l'option 'no_root_squash' dans /etc/exports sur le serveur NFS si l'on souhaite explicitement préserver les droits UID 0 pour les sauvegardes",
        "labelFr": "Configurer l'option 'no_root_squash' dans /etc/exports sur le serveur NFS si l'on souhaite explicitement préserver les droits UID 0 pour les sauvegardes",
        "isCorrect": True,
        "explanation": "root_squash est une mesure de sécurité par défaut qui mappe root sur nobody. no_root_squash permet au compte root client d'écrire en tant que root sur le serveur.",
        "explanationFr": "Utiliser l'option no_root_squash dans /etc/exports."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le compte nobody de /etc/passwd",
        "labelFr": "Supprimer le compte nobody de /etc/passwd",
        "isCorrect": False,
        "explanation": "Le compte nobody est requis par de nombreux démons système.",
        "explanationFr": "Le compte nobody est requis par de nombreux démons."
      },
      {
        "id": "opt-3",
        "label": "Passer le client en NFS version 1",
        "labelFr": "Passer le client en NFS version 1",
        "isCorrect": False,
        "explanation": "NFSv1 n'est plus supporté depuis des décennies.",
        "explanationFr": "NFSv1 n'est plus supporté."
      },
      {
        "id": "opt-4",
        "label": "Changer le MTU de la carte réseau du client",
        "labelFr": "Changer le MTU de la carte réseau du client",
        "isCorrect": False,
        "explanation": "Le MTU n'a aucun rapport avec le mappage des identifiants UID/GID NFS.",
        "explanationFr": "Le MTU n'a aucun rapport avec le mappage UID."
      }
    ],
    "correctedSnippet": """# Dans /etc/exports :
/backup 192.168.1.0/24(rw,sync,no_root_squash,no_subtree_check)

# Recharger la configuration d'exportation :
exportfs -ra""",
    "fixExplanation": "Ajouter l'option 'no_root_squash' dans /etc/exports pour autoriser l'UID 0.",
    "fixExplanationFr": "Ajouter l'option 'no_root_squash' dans /etc/exports pour autoriser l'UID 0."
  },
  # 63. 209.2
  {
    "id": "tb-lpic2-202-63",
    "title": "Mappage NFSv4 IDMAP défaillant : Fichiers appartenant à nobody (Domain mismatch)",
    "titleFr": "Mappage NFSv4 IDMAP défaillant : Fichiers appartenant à nobody (Domain mismatch)",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing - NFSv4 idmapd",
    "scenario": "Tous les fichiers d'un partage NFSv4 monté apparaissent sous le propriétaire 'nobody:nobody', alors que les utilisateurs locaux ont exactement les mêmes UIDs/GIDs sur le client et le serveur.",
    "scenarioFr": "Tous les fichiers d'un partage NFSv4 monté apparaissent sous le propriétaire 'nobody:nobody', alors que les utilisateurs locaux ont exactement les mêmes UIDs/GIDs sur le client et le serveur.",
    "codeSnippet": """# client# ls -l /mnt/nfs4/
-rw-r--r-- 1 nobody nobody 4120 Sep 10 12:40 rapport.pdf

# server# cat /etc/idmapd.conf | grep Domain
Domain = corp.example.com

# client# cat /etc/idmapd.conf | grep Domain
Domain = localdomain""",
    "language": "config",
    "bugDescription": "NFSv4 transmet les identités utilisateur sous la forme 'utilisateur@domaine'. Si la directive 'Domain' dans /etc/idmapd.conf ne concorde pas entre le client et le serveur, le démon rpc.idmapd échoue et mappe tous les noms sur 'nobody'.",
    "bugDescriptionFr": "NFSv4 transmet les identités utilisateur sous la forme 'utilisateur@domaine'. Si la directive 'Domain' dans /etc/idmapd.conf ne concorde pas entre le client et le serveur, le démon rpc.idmapd échoue et mappe tous les noms sur 'nobody'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Harmoniser la directive 'Domain' dans /etc/idmapd.conf sur le client et le serveur (ex: Domain = corp.example.com), vider le cache du trousseau de clés avec 'nfsidmap -c' et redémarrer idmapd",
        "labelFr": "Harmoniser la directive 'Domain' dans /etc/idmapd.conf sur le client et le serveur (ex: Domain = corp.example.com), vider le cache du trousseau de clés avec 'nfsidmap -c' et redémarrer idmapd",
        "isCorrect": True,
        "explanation": "Le protocole NFSv4 impose que le domaine idmap soit strictement identique des deux côtés pour convertir user@domain en UID numérique local.",
        "explanationFr": "Harmoniser la directive Domain dans /etc/idmapd.conf et vider le cache avec nfsidmap -c."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le protocole TCP pour forcer UDP",
        "labelFr": "Supprimer le protocole TCP pour forcer UDP",
        "isCorrect": False,
        "explanation": "NFSv4 fonctionne obligatoirement au-dessus de TCP.",
        "explanationFr": "NFSv4 fonctionne obligatoirement sur TCP."
      },
      {
        "id": "opt-3",
        "label": "Désactiver les ACLs POSIX dans le noyau",
        "labelFr": "Désactiver les ACLs POSIX dans le noyau",
        "isCorrect": False,
        "explanation": "Le souci provient du daemon idmapd, pas des ACLs.",
        "explanationFr": "Le souci provient d'idmapd."
      },
      {
        "id": "opt-4",
        "label": "Remplacer l'UID de root par 1000",
        "labelFr": "Remplacer l'UID de root par 1000",
        "isCorrect": False,
        "explanation": "L'UID de root est 0 de façon inaltérable sous UNIX.",
        "explanationFr": "L'UID de root est obligatoirement 0."
      }
    ],
    "correctedSnippet": """# Sur le client, dans /etc/idmapd.conf :
[General]
Domain = corp.example.com

# Vider le cache du mappeur IDMAP et relancer :
nfsidmap -c
systemctl restart nfs-idmapd""",
    "fixExplanation": "Aligner la directive 'Domain' dans /etc/idmapd.conf et réinitialiser le cache avec 'nfsidmap -c'.",
    "fixExplanationFr": "Aligner la directive 'Domain' dans /etc/idmapd.conf et réinitialiser le cache avec 'nfsidmap -c'."
  },
  # 64. 208.1
  {
    "id": "tb-lpic2-202-64",
    "title": "Certificat SSL Apache invalide : Erreur de chaîne intermédiaire (Certificate Chain Incomplete)",
    "titleFr": "Certificat SSL Apache invalide : Erreur de chaîne intermédiaire (Certificate Chain Incomplete)",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services - Apache SSL/TLS",
    "scenario": "Un site HTTPS fonctionne sur PC mais affiche 'Certificat non approuvé / SEC_ERROR_UNKNOWN_ISSUER' sur les smartphones et navigateurs stricts.",
    "scenarioFr": "Un site HTTPS fonctionne sur PC mais affiche 'Certificat non approuvé / SEC_ERROR_UNKNOWN_ISSUER' sur les smartphones et navigateurs stricts.",
    "codeSnippet": """# cat /etc/apache2/sites-enabled/default-ssl.conf
<VirtualHost *:443>
    ServerName www.example.com
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/cert.pem
    SSLCertificateKeyFile /etc/ssl/private/privkey.pem
</VirtualHost>""",
    "language": "apache",
    "bugDescription": "La chaîne de certificats intermédiaires de l'autorité de certification (CA Intermediate) n'est pas fournie au client. Il faut utiliser 'fullchain.pem' pour SSLCertificateFile ou déclarer SSLCertificateChainFile.",
    "bugDescriptionFr": "La chaîne de certificats intermédiaires de l'autorité de certification (CA Intermediate) n'est pas fournie au client. Il faut utiliser 'fullchain.pem' pour SSLCertificateFile ou déclarer SSLCertificateChainFile.",
    "options": [
      {
        "id": "opt-1",
        "label": "Remplacer cert.pem par le certificat complet contenant la chaîne intermédiaire (fullchain.pem) dans la directive SSLCertificateFile (ou renseigner SSLCertificateChainFile)",
        "labelFr": "Remplacer cert.pem par le certificat complet contenant la chaîne intermédiaire (fullchain.pem) dans la directive SSLCertificateFile (ou renseigner SSLCertificateChainFile)",
        "isCorrect": True,
        "explanation": "Les navigateurs mobiles ne disposent pas toujours des certificats intermédiaires en cache local et exigent que le serveur transmette la chaîne complète (fullchain).",
        "explanationFr": "Pointer SSLCertificateFile sur fullchain.pem pour transmettre les certificats intermédiaires."
      },
      {
        "id": "opt-2",
        "label": "Générer une clé privée RSA de 512 bits pour accélérer la négociation",
        "labelFr": "Générer une clé privée RSA de 512 bits pour accélérer la négociation",
        "isCorrect": False,
        "explanation": "512 bits est cassé et rejeté par tous les navigateurs modernes (minimum 2048 bits).",
        "explanationFr": "512 bits est vulnérable et rejeté."
      },
      {
        "id": "opt-3",
        "label": "Désactiver le protocole TLSv1.3",
        "labelFr": "Désactiver le protocole TLSv1.3",
        "isCorrect": False,
        "explanation": "TLS 1.3 est la norme la plus sécurisée.",
        "explanationFr": "TLS 1.3 est la norme la plus sécurisée."
      },
      {
        "id": "opt-4",
        "label": "Changer le port 443 en 8443",
        "labelFr": "Changer le port 443 en 8443",
        "isCorrect": False,
        "explanation": "Le port ne valide pas la signature de la chaîne d'autorité.",
        "explanationFr": "Le port ne valide pas la chaîne de certification."
      }
    ],
    "correctedSnippet": """<VirtualHost *:443>
    ServerName www.example.com
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/fullchain.pem
    SSLCertificateKeyFile /etc/ssl/private/privkey.pem
</VirtualHost>""",
    "fixExplanation": "Utiliser fullchain.pem au lieu du certificat feuille isolé cert.pem.",
    "fixExplanationFr": "Utiliser fullchain.pem au lieu du certificat feuille isolé cert.pem."
  },
  # 65. 208.2
  {
    "id": "tb-lpic2-202-65",
    "title": "Erreur Nginx '413 Request Entity Too Large' lors d'envois de fichiers volumineux",
    "titleFr": "Erreur Nginx '413 Request Entity Too Large' lors d'envois de fichiers volumineux",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services - Nginx Request Limits",
    "scenario": "Les utilisateurs d'une plateforme de partage documentaire ne peuvent pas téléverser de fichiers supérieurs à 1 Mo à travers Nginx.",
    "scenarioFr": "Les utilisateurs d'une plateforme de partage documentaire ne peuvent pas téléverser de fichiers supérieurs à 1 Mo à travers Nginx.",
    "codeSnippet": """# curl -F "file=@bigfile_5MB.zip" https://cloud.example.com/upload
<html>
<head><title>413 Request Entity Too Large</title></head>
<body>
<center><h1>413 Request Entity Too Large</h1></center>
<hr><center>nginx</center>
</body>
</html>""",
    "language": "html",
    "bugDescription": "Par défaut, Nginx applique une limite de corps de requête client (client_max_body_size) fixée à 1 Mo. Tout envoi dépassant cette taille est rejeté avec l'erreur HTTP 413.",
    "bugDescriptionFr": "Par défaut, Nginx applique une limite de corps de requête client (client_max_body_size) fixée à 1 Mo. Tout envoi dépassant cette taille est rejeté avec l'erreur HTTP 413.",
    "options": [
      {
        "id": "opt-1",
        "label": "Augmenter la directive 'client_max_body_size' dans le bloc http ou server du fichier nginx.conf (ex: client_max_body_size 50M;)",
        "labelFr": "Augmenter la directive 'client_max_body_size' dans le bloc http ou server du fichier nginx.conf (ex: client_max_body_size 50M;)",
        "isCorrect": True,
        "explanation": "client_max_body_size fixe la taille maximale autorisée du corps de la requête client spécifiée dans l'en-tête Content-Length.",
        "explanationFr": "Ajuster la directive client_max_body_size dans nginx.conf."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le certificat SSL du serveur Nginx",
        "labelFr": "Supprimer le certificat SSL du serveur Nginx",
        "isCorrect": False,
        "explanation": "SSL n'est pas responsable de la limite de taille HTTP.",
        "explanationFr": "SSL n'est pas responsable de la taille limite."
      },
      {
        "id": "opt-3",
        "label": "Changer le format d'encodage du fichier en Base64",
        "labelFr": "Changer le format d'encodage du fichier en Base64",
        "isCorrect": False,
        "explanation": "Le Base64 augmente la taille du fichier de 33%, aggravant le dépassement.",
        "explanationFr": "Le Base64 augmente encore la taille."
      },
      {
        "id": "opt-4",
        "label": "Activer gzip_comp_level 9 dans Nginx",
        "labelFr": "Activer gzip_comp_level 9 dans Nginx",
        "isCorrect": False,
        "explanation": "Gzip compresse les réponses sortantes du serveur, pas les requêtes montantes du client.",
        "explanationFr": "Gzip ne compresse pas les requêtes montantes."
      }
    ],
    "correctedSnippet": """# Dans /etc/nginx/conf.d/upload.conf ou dans le bloc server :
server {
    listen 443 ssl;
    server_name cloud.example.com;
    client_max_body_size 50M;
    ...
}""",
    "fixExplanation": "Définir la valeur souhaitée dans la directive client_max_body_size.",
    "fixExplanationFr": "Définir la valeur souhaitée dans la directive client_max_body_size."
  },
  # 66. 207.1
  {
    "id": "tb-lpic2-202-66",
    "title": "BIND en environnement Chroot incapable de résoudre les noms (dev/urandom manquant)",
    "titleFr": "BIND en environnement Chroot incapable de résoudre les noms (dev/urandom manquant)",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS Server - BIND Chroot Jail",
    "scenario": "Après avoir isolé named dans une cage chroot /var/named/chroot, le service démarre mais génère une erreur d'entropie et ne peut générer de requêtes récursives avec DNSSEC.",
    "scenarioFr": "Après avoir isolé named dans une cage chroot /var/named/chroot, le service démarre mais génère une erreur d'entropie et ne peut générer de requêtes récursives avec DNSSEC.",
    "codeSnippet": """# journalctl -u named
named[5012]: initializing DST: openssl failure
named[5012]: could not open /dev/urandom: No such file or directory
named[5012]: crypto initialization failed: failure""",
    "language": "bash",
    "bugDescription": "Lors de l'exécution en chroot, named ne voit que l'arborescence sous /var/named/chroot. Le fichier spécial de périphérique /dev/urandom n'a pas été créé ou monté dans la prison.",
    "bugDescriptionFr": "Lors de l'exécution en chroot, named ne voit que l'arborescence sous /var/named/chroot. Le fichier spécial de périphérique /dev/urandom n'a pas été créé ou monté dans la prison.",
    "options": [
      {
        "id": "opt-1",
        "label": "Créer le nœud de périphérique /dev/urandom dans l'environnement chroot (ex: mknod /var/named/chroot/dev/urandom c 1 9) ou monter un bind mount",
        "labelFr": "Créer le nœud de périphérique /dev/urandom dans l'environnement chroot (ex: mknod /var/named/chroot/dev/urandom c 1 9) ou monter un bind mount",
        "isCorrect": True,
        "explanation": "Les démons chrootés n'ont plus accès au /dev du système hôte. Les générateurs pseudo-aléatoires doivent être instanciés dans la prison.",
        "explanationFr": "Créer le nœud spécial /dev/urandom dans la racine de la prison chroot."
      },
      {
        "id": "opt-2",
        "label": "Désactiver le générateur aléatoire dans le noyau Linux",
        "labelFr": "Désactiver le générateur aléatoire dans le noyau Linux",
        "isCorrect": False,
        "explanation": "Le noyau et les couches TLS/DNSSEC ont un besoin impératif d'entropie aléatoire.",
        "explanationFr": "L'entropie aléatoire est fondamentale."
      },
      {
        "id": "opt-3",
        "label": "Donner les permissions 777 au binaire /usr/sbin/named",
        "labelFr": "Donner les permissions 777 au binaire /usr/sbin/named",
        "isCorrect": False,
        "explanation": "Les droits du binaire ne résolvent pas l'absence du fichier /dev/urandom dans la cage.",
        "explanationFr": "Les droits du binaire ne créent pas le device."
      },
      {
        "id": "opt-4",
        "label": "Supprimer OpenSSL du serveur",
        "labelFr": "Supprimer OpenSSL du serveur",
        "isCorrect": False,
        "explanation": "OpenSSL est requis par BIND pour les validations cryptographiques.",
        "explanationFr": "OpenSSL est indispensable."
      }
    ],
    "correctedSnippet": """# mkdir -p /var/named/chroot/dev
# mknod /var/named/chroot/dev/urandom c 1 9
# chmod 0666 /var/named/chroot/dev/urandom
# systemctl restart named-chroot""",
    "fixExplanation": "Créer le device node /dev/urandom dans l'arborescence chrootée avec mknod.",
    "fixExplanationFr": "Créer le device node /dev/urandom dans l'arborescence chrootée avec mknod."
  },
  # 67. 208.1
  {
    "id": "tb-lpic2-202-67",
    "title": "Boucle de redirection infinie Apache (.htaccess mod_rewrite loop)",
    "titleFr": "Boucle de redirection infinie Apache (.htaccess mod_rewrite loop)",
    "topicNumber": 208,
    "objectiveId": "208.1",
    "category": "Web Services - Apache mod_rewrite",
    "scenario": "Les visiteurs d'un site web reçoivent dans leur navigateur l'erreur 'ERR_TOO_MANY_REDIRECTS' suite à l'ajout d'une règle de forçage HTTPS dans .htaccess.",
    "scenarioFr": "Les visiteurs d'un site web reçoivent dans leur navigateur l'erreur 'ERR_TOO_MANY_REDIRECTS' suite à l'ajout d'une règle de forçage HTTPS dans .htaccess.",
    "codeSnippet": """# cat /var/www/html/.htaccess
RewriteEngine On
RewriteRule ^(.*)$ https://www.example.com/$1 [R=301,L]""",
    "language": "apache",
    "bugDescription": "La règle RewriteRule effectue une redirection inconditionnelle sans vérifier au préalable si la connexion courante est déjà en HTTPS, entraînant une boucle infinie de redirection 301.",
    "bugDescriptionFr": "La règle RewriteRule effectue une redirection inconditionnelle sans vérifier au préalable si la connexion courante est déjà en HTTPS, entraînant une boucle infinie de redirection 301.",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajouter la condition 'RewriteCond %{HTTPS} off' avant la règle RewriteRule pour n'appliquer la redirection que sur les requêtes HTTP non chiffrées",
        "labelFr": "Ajouter la condition 'RewriteCond %{HTTPS} off' avant la règle RewriteRule pour n'appliquer la redirection que sur les requêtes HTTP non chiffrées",
        "isCorrect": True,
        "explanation": "Sans RewriteCond, mod_rewrite réapplique la règle sur la requête https entrante, qui redirige indéfiniment vers elle-même.",
        "explanationFr": "Ajouter RewriteCond %{HTTPS} off avant la directive RewriteRule."
      },
      {
        "id": "opt-2",
        "label": "Remplacer le drapeau [R=301,L] par [F,L]",
        "labelFr": "Remplacer le drapeau [R=301,L] par [F,L]",
        "isCorrect": False,
        "explanation": "[F] renvoie un code HTTP 403 Forbidden.",
        "explanationFr": "[F] renvoie un code 403 Forbidden."
      },
      {
        "id": "opt-3",
        "label": "Désactiver le module mod_rewrite",
        "labelFr": "Désactiver le module mod_rewrite",
        "isCorrect": False,
        "explanation": "Le but est de forcer HTTPS proprement, pas d'abandonner la redirection.",
        "explanationFr": "Le but est de forcer HTTPS proprement."
      },
      {
        "id": "opt-4",
        "label": "Vider le cache DNS du navigateur",
        "labelFr": "Vider le cache DNS du navigateur",
        "isCorrect": False,
        "explanation": "L'erreur 301 est renvoyée par le serveur web, le DNS fonctionne bien.",
        "explanationFr": "La boucle provient de la logique du serveur web."
      }
    ],
    "correctedSnippet": """# /var/www/html/.htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://www.example.com/$1 [R=301,L]""",
    "fixExplanation": "Insérer 'RewriteCond %{HTTPS} off' pour conditionner la redirection.",
    "fixExplanationFr": "Insérer 'RewriteCond %{HTTPS} off' pour conditionner la redirection."
  },
  # 68. 209.1
  {
    "id": "tb-lpic2-202-68",
    "title": "Nom NetBIOS Samba trop long tronqué dans l'annonce réseau (NetBIOS name is too long)",
    "titleFr": "Nom NetBIOS Samba trop long tronqué dans l'annonce réseau (NetBIOS name is too long)",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing - NetBIOS Naming",
    "scenario": "La commande 'testparm' signale un avertissement sur le paramètre 'netbios name' et le serveur est introuvable par son nom sur le réseau Windows.",
    "scenarioFr": "La commande 'testparm' signale un avertissement sur le paramètre 'netbios name' et le serveur est introuvable par son nom sur le réseau Windows.",
    "codeSnippet": """# testparm -s
Load smb config files from /etc/samba/smb.conf
Processing section "[global]"
WARNING: The 'netbios name' is too long (maximum 15 characters).
Trimming 'CORPORATE-STORAGE-SERVER-PARIS' to 'CORPORATE-STORA'""",
    "language": "bash",
    "bugDescription": "Le protocole NetBIOS limite strictement les noms de machines à 15 caractères (le 16e étant réservé au suffixe de service). Un nom plus long est tronqué et perturbe la découverte réseau.",
    "bugDescriptionFr": "Le protocole NetBIOS limite strictement les noms de machines à 15 caractères (le 16e étant réservé au suffixe de service). Un nom plus long est tronqué et perturbe la découverte réseau.",
    "options": [
      {
        "id": "opt-1",
        "label": "Réduire la valeur de 'netbios name' à un maximum strict de 15 caractères dans la section [global] de /etc/samba/smb.conf",
        "labelFr": "Réduire la valeur de 'netbios name' à un maximum strict de 15 caractères dans la section [global] de /etc/samba/smb.conf",
        "isCorrect": True,
        "explanation": "La norme RFC 1001/1002 limite les noms NetBIOS à 15 caractères alphanumériques.",
        "explanationFr": "Limiter la directive netbios name à 15 caractères au maximum."
      },
      {
        "id": "opt-2",
        "label": "Augmenter la taille du MTU à 9000 pour accepter des noms plus longs",
        "labelFr": "Augmenter la taille du MTU à 9000 pour accepter des noms plus longs",
        "isCorrect": False,
        "explanation": "La taille du MTU n'a aucun rapport avec la norme NetBIOS.",
        "explanationFr": "Le MTU n'a aucun lien avec NetBIOS."
      },
      {
        "id": "opt-3",
        "label": "Passer le paramètre disable_netbios = yes",
        "labelFr": "Passer le paramètre disable_netbios = yes",
        "isCorrect": False,
        "explanation": "Le paramètre correct est disable netbios = yes, mais cela désactive la résolution NetBIOS au lieu d'ajuster le nom.",
        "explanationFr": "Cela désactiverait le service."
      },
      {
        "id": "opt-4",
        "label": "Compiler Samba avec l'option --enable-long-netbios",
        "labelFr": "Compiler Samba avec l'option --enable-long-netbios",
        "isCorrect": False,
        "explanation": "Cette option n'existe pas car c'est une contrainte du protocole SMB/NetBIOS hérité.",
        "explanationFr": "Option inexistante."
      }
    ],
    "correctedSnippet": """# Dans /etc/samba/smb.conf :
[global]
    netbios name = CORP-STORE-PARIS
    workgroup = WORKGROUP""",
    "fixExplanation": "Définir un nom NetBIOS inférieur ou égal à 15 caractères.",
    "fixExplanationFr": "Définir un nom NetBIOS inférieur ou égal à 15 caractères."
  },
  # 69. 207.2
  {
    "id": "tb-lpic2-202-69",
    "title": "Zone DNS inverse (in-addr.arpa) non résolue (Ordre des octets erroné)",
    "titleFr": "Zone DNS inverse (in-addr.arpa) non résolue (Ordre des octets erroné)",
    "topicNumber": 207,
    "objectiveId": "207.2",
    "category": "DNS Server - Reverse DNS Configuration",
    "scenario": "L'administrateur a configuré la résolution inverse pour le sous-réseau 192.168.10.0/24. La commande 'dig -x 192.168.10.50' renvoie NXDOMAIN.",
    "scenarioFr": "L'administrateur a configuré la résolution inverse pour le sous-réseau 192.168.10.0/24. La commande 'dig -x 192.168.10.50' renvoie NXDOMAIN.",
    "codeSnippet": """# named.conf.local
zone "192.168.10.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};

# dig -x 192.168.10.50 @localhost
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 4125
;; QUESTION SECTION:
;50.10.168.192.in-addr.arpa.	IN	PTR""",
    "language": "config",
    "bugDescription": "Le nom de la zone inverse est erroné : les octets du réseau IPv4 doivent être inversés. Pour le réseau 192.168.10.0/24, le nom de zone obligatoire est '10.168.192.in-addr.arpa'.",
    "bugDescriptionFr": "Le nom de la zone inverse est erroné : les octets du réseau IPv4 doivent être inversés. Pour le réseau 192.168.10.0/24, le nom de zone obligatoire est '10.168.192.in-addr.arpa'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Inverser l'ordre des octets du sous-réseau dans la déclaration de zone : 'zone \"10.168.192.in-addr.arpa\"'",
        "labelFr": "Inverser l'ordre des octets du sous-réseau dans la déclaration de zone : 'zone \"10.168.192.in-addr.arpa\"'",
        "isCorrect": True,
        "explanation": "La hiérarchie DNS inverse lit les octets de droite à gauche ; 192.168.10.0/24 devient donc 10.168.192.in-addr.arpa.",
        "explanationFr": "Déclarer la zone sous la forme 10.168.192.in-addr.arpa."
      },
      {
        "id": "opt-2",
        "label": "Remplacer in-addr.arpa par ip6.arpa",
        "labelFr": "Remplacer in-addr.arpa par ip6.arpa",
        "isCorrect": False,
        "explanation": "ip6.arpa est réservé aux adresses IPv6.",
        "explanationFr": "ip6.arpa est réservé à l'IPv6."
      },
      {
        "id": "opt-3",
        "label": "Remplacer les enregistrements PTR par des enregistrements A",
        "labelFr": "Remplacer les enregistrements PTR par des enregistrements A",
        "isCorrect": False,
        "explanation": "La résolution inverse IP vers nom utilise obligatoirement le type PTR.",
        "explanationFr": "La résolution inverse utilise le type PTR."
      },
      {
        "id": "opt-4",
        "label": "Supprimer le masque de sous-réseau /24",
        "labelFr": "Supprimer le masque de sous-réseau /24",
        "isCorrect": False,
        "explanation": "Cela n'a pas de sens dans named.conf.",
        "explanationFr": "Cela n'a pas de sens dans named.conf."
      }
    ],
    "correctedSnippet": """# Dans named.conf.local :
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};

# rndc reload""",
    "fixExplanation": "Inverser les trois octets du réseau dans le nom de la zone in-addr.arpa.",
    "fixExplanationFr": "Inverser les trois octets du réseau dans le nom de la zone in-addr.arpa."
  },
  # 70. 208.2
  {
    "id": "tb-lpic2-202-70",
    "title": "Perte de l'adresse IP cliente réelle derrière le Reverse Proxy Nginx (X-Forwarded-For)",
    "titleFr": "Perte de l'adresse IP cliente réelle derrière le Reverse Proxy Nginx (X-Forwarded-For)",
    "topicNumber": 208,
    "objectiveId": "208.2",
    "category": "Web Services - Nginx Header Forwarding",
    "scenario": "Une application backend située derrière Nginx enregistre toutes les connexions clientes avec l'adresse IP '127.0.0.1' dans ses journaux d'audit.",
    "scenarioFr": "Une application backend située derrière Nginx enregistre toutes les connexions clientes avec l'adresse IP '127.0.0.1' dans ses journaux d'audit.",
    "codeSnippet": """# Configuration Nginx proxy_pass :
location / {
    proxy_pass http://127.0.0.1:8000;
}

# Journal de l'application backend :
[INFO] Login from 127.0.0.1 - User: admin
[INFO] Login from 127.0.0.1 - User: bob""",
    "language": "nginx",
    "bugDescription": "Nginx n'envoie pas les en-têtes HTTP de relais (X-Real-IP et X-Forwarded-For). Le serveur d'application ne voit que l'adresse IP locale de la socket Nginx qui le proxifie.",
    "bugDescriptionFr": "Nginx n'envoie pas les en-têtes HTTP de relais (X-Real-IP et X-Forwarded-For). Le serveur d'application ne voit que l'adresse IP locale de la socket Nginx qui le proxifie.",
    "options": [
      {
        "id": "opt-1",
        "label": "Ajouter les directives 'proxy_set_header X-Real-IP $remote_addr;' et 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' dans la configuration du bloc proxy",
        "labelFr": "Ajouter les directives 'proxy_set_header X-Real-IP $remote_addr;' et 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' dans la configuration du bloc proxy",
        "isCorrect": True,
        "explanation": "Les en-têtes X-Real-IP et X-Forwarded-For transmettent l'adresse IP réelle de l'utilisateur final au serveur d'application d'arrière-plan.",
        "explanationFr": "Transmettre l'en-tête X-Forwarded-For avec proxy_set_header."
      },
      {
        "id": "opt-2",
        "label": "Désactiver le proxy et exposer directement l'application sur internet sans Nginx",
        "labelFr": "Désactiver le proxy et exposer directement l'application sur internet sans Nginx",
        "isCorrect": False,
        "explanation": "Mauvaise pratique de sécurité qui supprime la protection du reverse proxy.",
        "explanationFr": "Mauvaise pratique supprimant la sécurité du reverse proxy."
      },
      {
        "id": "opt-3",
        "label": "Activer proxy_buffering off",
        "labelFr": "Activer proxy_buffering off",
        "isCorrect": False,
        "explanation": "La mise en tampon ne modifie pas les en-têtes IP.",
        "explanationFr": "La mise en tampon ne modifie pas les en-têtes IP."
      },
      {
        "id": "opt-4",
        "label": "Remplacer l'adresse 127.0.0.1 par 0.0.0.0 dans proxy_pass",
        "labelFr": "Remplacer l'adresse 127.0.0.1 par 0.0.0.0 dans proxy_pass",
        "isCorrect": False,
        "explanation": "0.0.0.0 n'est pas une adresse de destination routable pour proxy_pass.",
        "explanationFr": "0.0.0.0 n'est pas une adresse de destination valide."
      }
    ],
    "correctedSnippet": """location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}""",
    "fixExplanation": "Transmettre les en-têtes X-Real-IP et X-Forwarded-For via 'proxy_set_header'.",
    "fixExplanationFr": "Transmettre les en-têtes X-Real-IP et X-Forwarded-For via 'proxy_set_header'."
  },
  # 71. 209.1
  {
    "id": "tb-lpic2-202-71",
    "title": "Incompatibilité de dialecte SMB : Rejet des anciens clients Windows XP/2003",
    "titleFr": "Incompatibilité de dialecte SMB : Rejet des anciens clients Windows XP/2003",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing - Samba Protocol Dialects",
    "scenario": "Après migration vers un serveur Samba récent, des automates industriels hérités ne peuvent plus se connecter avec l'erreur 'NT_STATUS_NOT_SUPPORTED'.",
    "scenarioFr": "Après migration vers un serveur Samba récent, des automates industriels hérités ne peuvent plus se connecter avec l'erreur 'NT_STATUS_NOT_SUPPORTED'.",
    "codeSnippet": """# log.smbd
[2026/09/10 13:00:10.124501, 1] ../../source3/smbd/negprot.c:647(reply_negprot)
  No protocol supported !
  Requested protocol: NT LM 0.12 (SMB1)

# testparm -s | grep "server min protocol"
server min protocol = SMB2_02""",
    "language": "bash",
    "bugDescription": "Les versions modernes de Samba désactivent par défaut le protocole SMBv1 (NT1) pour des raisons de sécurité critiques (vulnérabilités EternalBlue). Les clients anciens ne supportant que SMB1 sont rejetés.",
    "bugDescriptionFr": "Les versions modernes de Samba désactivent par défaut le protocole SMBv1 (NT1) pour des raisons de sécurité critiques (vulnérabilités EternalBlue). Les clients anciens ne supportant que SMB1 sont rejetés.",
    "options": [
      {
        "id": "opt-1",
        "label": "Si l'environnement industriel l'exige absolument, définir 'server min protocol = NT1' dans la section [global] de smb.conf (ou idéalement moderniser les clients)",
        "labelFr": "Si l'environnement industriel l'exige absolument, définir 'server min protocol = NT1' dans la section [global] de smb.conf (ou idéalement moderniser les clients)",
        "isCorrect": True,
        "explanation": "Samba restreint par défaut le protocole minimal à SMB2. Pour autoriser SMB1, il faut abaisser 'server min protocol' à 'NT1'.",
        "explanationFr": "Ajuster server min protocol = NT1 dans smb.conf si SMB1 est requis."
      },
      {
        "id": "opt-2",
        "label": "Augmenter la taille du MTU",
        "labelFr": "Augmenter la taille du MTU",
        "isCorrect": False,
        "explanation": "Le refus provient de la négociation du dialecte SMB.",
        "explanationFr": "Le refus provient de la négociation du dialecte SMB."
      },
      {
        "id": "opt-3",
        "label": "Changer le port Samba en 21",
        "labelFr": "Changer le port Samba en 21",
        "isCorrect": False,
        "explanation": "21 est le port FTP.",
        "explanationFr": "21 est le port FTP."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le démon smbd et lancer uniquement nmbd",
        "labelFr": "Désactiver le démon smbd et lancer uniquement nmbd",
        "isCorrect": False,
        "explanation": "nmbd ne gère que les noms NetBIOS ; smbd est indispensable pour les fichiers.",
        "explanationFr": "smbd est indispensable pour le partage de fichiers."
      }
    ],
    "correctedSnippet": """# Dans /etc/samba/smb.conf :
[global]
    server min protocol = NT1
    # Remarque : Isoler ce segment réseau sur un VLAN dédié pour limiter les risques liés à SMB1.""",
    "fixExplanation": "Abaisser temporairement 'server min protocol' à NT1 dans smb.conf.",
    "fixExplanationFr": "Abaisser temporairement 'server min protocol' à NT1 dans smb.conf."
  },
  # 72. 207.1
  {
    "id": "tb-lpic2-202-72",
    "title": "Résolveur BIND ouvert aux attaques d'amplification DNS (Open Resolver)",
    "titleFr": "Résolveur BIND ouvert aux attaques d'amplification DNS (Open Resolver)",
    "topicNumber": 207,
    "objectiveId": "207.1",
    "category": "DNS Server - BIND Access Control",
    "scenario": "Le fournisseur d'accès Internet alerte l'administrateur : le serveur DNS d'autorité fait l'objet d'abus en tant que 'Open Resolver' pour des attaques DDoS par amplification.",
    "scenarioFr": "Le fournisseur d'accès Internet alerte l'administrateur : le serveur DNS d'autorité fait l'objet d'abus en tant que 'Open Resolver' pour des attaques DDoS par amplification.",
    "codeSnippet": """# named.conf.options
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-recursion { any; };
    listen-on { any; };
};""",
    "language": "config",
    "bugDescription": "La directive 'recursion yes' associée à 'allow-recursion { any; }' transforme le serveur en résolveur récursif public ouvert au monde entier, permettant le spoofing d'IP et l'amplification DNS.",
    "bugDescriptionFr": "La directive 'recursion yes' associée à 'allow-recursion { any; }' transforme le serveur en résolveur récursif public ouvert au monde entier, permettant le spoofing d'IP et l'amplification DNS.",
    "options": [
      {
        "id": "opt-1",
        "label": "Désactiver la récursion ('recursion no;') sur un serveur faisant autorité, ou la restreindre aux seuls réseaux internes fiables ('allow-recursion { 192.168.1.0/24; localhost; };')",
        "labelFr": "Désactiver la récursion ('recursion no;') sur un serveur faisant autorité, ou la restreindre aux seuls réseaux internes fiables ('allow-recursion { 192.168.1.0/24; localhost; };')",
        "isCorrect": True,
        "explanation": "Un serveur DNS d'autorité public ne doit jamais faire de récursion pour Internet. Les résolveurs d'entreprise ne doivent être accessibles que depuis le LAN.",
        "explanationFr": "Désactiver la récursion publique pour fermer le Open Resolver."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le port 53 UDP et ne conserver que TCP",
        "labelFr": "Supprimer le port 53 UDP et ne conserver que TCP",
        "isCorrect": False,
        "explanation": "Le DNS standard utilise massivement UDP 53.",
        "explanationFr": "Le DNS standard repose sur UDP 53."
      },
      {
        "id": "opt-3",
        "label": "Remplacer BIND par un fichier /etc/hosts",
        "labelFr": "Remplacer BIND par un fichier /etc/hosts",
        "isCorrect": False,
        "explanation": "/etc/hosts ne peut pas servir de DNS pour des clients externes.",
        "explanationFr": "/etc/hosts est local."
      },
      {
        "id": "opt-4",
        "label": "Mettre allow-query { none; }",
        "labelFr": "Mettre allow-query { none; }",
        "isCorrect": False,
        "explanation": "Cela empêcherait quiconque d'interroger les domaines légitimes gérés par le serveur.",
        "explanationFr": "Cela bloquerait toutes les requêtes légitimes."
      }
    ],
    "correctedSnippet": """# Dans /etc/bind/named.conf.options :
options {
    directory "/var/cache/bind";
    // Pour un serveur d'autorité pur :
    recursion no;
    additional-from-auth no;
    additional-from-cache no;
};""",
    "fixExplanation": "Désactiver la récursion sur les serveurs d'autorité ou restreindre l'ACL allow-recursion.",
    "fixExplanationFr": "Désactiver la récursion sur les serveurs d'autorité ou restreindre l'ACL allow-recursion."
  },
  # 73. 208.3
  {
    "id": "tb-lpic2-202-73",
    "title": "Erreur d'initialisation du cache Squid : Swap directories non initialisés",
    "titleFr": "Erreur d'initialisation du cache Squid : Swap directories non initialisés",
    "topicNumber": 208,
    "objectiveId": "208.3",
    "category": "Web Services - Squid Cache Directory",
    "scenario": "Après modification de la directive cache_dir dans squid.conf, le service Squid refuse de démarrer avec l'erreur 'Cannot open /var/spool/squid/swap.state'.",
    "scenarioFr": "Après modification de la directive cache_dir dans squid.conf, le service Squid refuse de démarrer avec l'erreur 'Cannot open /var/spool/squid/swap.state'.",
    "codeSnippet": """# systemctl start squid
Job for squid.service failed because the control process exited with error code.

# tail -n 2 /var/log/squid/cache.log
FATAL: Failed to verify one of the swap directories, Check cache.log
Squid Cache (Version 5.7): Exited abnormally.""",
    "language": "bash",
    "bugDescription": "La structure des répertoires de cache (répertoires 00..FF sous /var/spool/squid) n'a pas été initialisée avec la commande 'squid -z'.",
    "bugDescriptionFr": "La structure des répertoires de cache (répertoires 00..FF sous /var/spool/squid) n'a pas été initialisée avec la commande 'squid -z'.",
    "options": [
      {
        "id": "opt-1",
        "label": "Initialiser la structure des sous-répertoires de stockage du cache Squid avec la commande 'squid -z' (ou 'squid -zX')",
        "labelFr": "Initialiser la structure des sous-répertoires de stockage du cache Squid avec la commande 'squid -z' (ou 'squid -zX')",
        "isCorrect": True,
        "explanation": "L'option -z de Squid crée l'arborescence des dossiers de swap de niveau 1 et 2 nécessaires au stockage des objets web en cache.",
        "explanationFr": "Exécuter 'squid -z' pour initialiser les répertoires de cache."
      },
      {
        "id": "opt-2",
        "label": "Supprimer complètement le paquet squid",
        "labelFr": "Supprimer complètement le paquet squid",
        "isCorrect": False,
        "explanation": "Inapproprié pour résoudre un défaut d'initialisation.",
        "explanationFr": "Inapproprié."
      },
      {
        "id": "opt-3",
        "label": "Formater la partition /var en swap Linux avec mkswap",
        "labelFr": "Formater la partition /var en swap Linux avec mkswap",
        "isCorrect": False,
        "explanation": "Ne pas confondre la mémoire swap du noyau Linux et les répertoires de swap d'objets Squid.",
        "explanationFr": "Ne pas confondre swap Linux et swap Squid."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le cache DNS de BIND",
        "labelFr": "Désactiver le cache DNS de BIND",
        "isCorrect": False,
        "explanation": "Aucun rapport avec les répertoires de stockage de Squid.",
        "explanationFr": "Aucun rapport avec le cache Squid."
      }
    ],
    "correctedSnippet": """# Créer et assigner les droits à l'utilisateur proxy/squid :
chown -R proxy:proxy /var/spool/squid
# Initialiser l'arborescence du cache :
squid -z
# Relancer Squid :
systemctl start squid""",
    "fixExplanation": "Exécuter 'squid -z' pour générer la hiérarchie des dossiers de cache.",
    "fixExplanationFr": "Exécuter 'squid -z' pour générer la hiérarchie des dossiers de cache."
  },
  # 74. 209.1
  {
    "id": "tb-lpic2-202-74",
    "title": "Conflit d'élection de Master Browser NetBIOS dans Samba (OS Level)",
    "titleFr": "Conflit d'élection de Master Browser NetBIOS dans Samba (OS Level)",
    "topicNumber": 209,
    "objectiveId": "209.1",
    "category": "File Sharing - Samba Master Browser",
    "scenario": "Sur un sous-réseau Windows sans contrôleur Active Directory, le serveur Samba perd régulièrement l'élection de Master Browser face à un poste Windows 10 client.",
    "scenarioFr": "Sur un sous-réseau Windows sans contrôleur Active Directory, le serveur Samba perd régulièrement l'élection de Master Browser face à un poste Windows 10 client.",
    "codeSnippet": """# nmblookup -M -- -
querying __MSBROWSE__ on 192.168.1.255
192.168.1.88 __MSBROWSE__<01>  (Poste Windows 10)

# testparm -s | grep -E "os level|local master|preferred master"
	os level = 20
	preferred master = No
	local master = Yes""",
    "language": "bash",
    "bugDescription": "La valeur de 'os level' est réglée à 20 (inférieure aux postes Windows NT/10 qui utilisent 32 ou plus). Pour gagner systématiquement les élections d'exploration, Samba doit avoir os level >= 65 et preferred master = yes.",
    "bugDescriptionFr": "La valeur de 'os level' est réglée à 20 (inférieure aux postes Windows NT/10 qui utilisent 32 ou plus). Pour gagner systématiquement les élections d'exploration, Samba doit avoir os level >= 65 et preferred master = yes.",
    "options": [
      {
        "id": "opt-1",
        "label": "Augmenter 'os level = 65' (ou 255) et activer 'preferred master = yes' dans la section [global] de smb.conf",
        "labelFr": "Augmenter 'os level = 65' (ou 255) et activer 'preferred master = yes' dans la section [global] de smb.conf",
        "isCorrect": True,
        "explanation": "Lors d'une élection de navigateur maître sur le réseau local, la machine avec l'OS Level le plus élevé gagne toujours.",
        "explanationFr": "Définir os level = 65 et preferred master = yes."
      },
      {
        "id": "opt-2",
        "label": "Désactiver le protocole IPv4 sur Samba",
        "labelFr": "Désactiver le protocole IPv4 sur Samba",
        "isCorrect": False,
        "explanation": "L'élection NetBIOS/SMB broadcast s'opère sur IPv4.",
        "explanationFr": "L'élection NetBIOS broadcast requiert IPv4."
      },
      {
        "id": "opt-3",
        "label": "Changer le nom du workgroup en WORKGROUP2",
        "labelFr": "Changer le nom du workgroup en WORKGROUP2",
        "isCorrect": False,
        "explanation": "Cela isolerait le serveur dans un groupe de travail séparé.",
        "explanationFr": "Cela isolerait le serveur."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le service nmbd",
        "labelFr": "Désactiver le service nmbd",
        "isCorrect": False,
        "explanation": "nmbd est le composant responsable de l'exploration réseau et des annonces NetBIOS.",
        "explanationFr": "nmbd gère la navigation NetBIOS."
      }
    ],
    "correctedSnippet": """# Dans /etc/samba/smb.conf :
[global]
    local master = yes
    preferred master = yes
    os level = 65
    domain master = yes""",
    "fixExplanation": "Configurer 'os level = 65' et 'preferred master = yes' pour remporter l'élection de Master Browser.",
    "fixExplanationFr": "Configurer 'os level = 65' et 'preferred master = yes' pour remporter l'élection de Master Browser."
  },
  # 75. 209.2
  {
    "id": "tb-lpic2-202-75",
    "title": "Verrouillage de fichiers NFS défaillant : RPC rpc.statd non démarré (NFSv3 Lock Failure)",
    "titleFr": "Verrouillage de fichiers NFS défaillant : RPC rpc.statd non démarré (NFSv3 Lock Failure)",
    "topicNumber": 209,
    "objectiveId": "209.2",
    "category": "File Sharing - NFS Locking & rpc.statd",
    "scenario": "Sur un partage monté en NFSv3, une application de base de données sqlite échoue lors de la pose de verrous avec l'erreur 'No locks available' ou 'fcntl lock failed'.",
    "scenarioFr": "Sur un partage monté en NFSv3, une application de base de données sqlite échoue lors de la pose de verrous avec l'erreur 'No locks available' ou 'fcntl lock failed'.",
    "codeSnippet": """# rpcinfo -p localhost | grep status
(Aucun résultat pour le programme 100024 status)

# systemctl status rpc-statd
Active: inactive (dead)""",
    "language": "bash",
    "bugDescription": "En NFSv3, le verrouillage de fichiers repose sur le Network Status Monitor (NSM) et le Network Lock Manager (NLM). Le service rpc.statd (programme RPC 100024) est arrêté, empêchant l'acquisition de verrous POSIX fcntl.",
    "bugDescriptionFr": "En NFSv3, le verrouillage de fichiers repose sur le Network Status Monitor (NSM) et le Network Lock Manager (NLM). Le service rpc.statd (programme RPC 100024) est arrêté, empêchant l'acquisition de verrous POSIX fcntl.",
    "options": [
      {
        "id": "opt-1",
        "label": "Démarrer et activer le service 'rpc-statd' sur le client et le serveur, ou monter le partage avec l'option 'nolock' (si le verrouillage n'est pas requis)",
        "labelFr": "Démarrer et activer le service 'rpc-statd' sur le client et le serveur, ou monter le partage avec l'option 'nolock' (si le verrouillage n'est pas requis)",
        "isCorrect": True,
        "explanation": "rpc.statd est indispensable en NFSv3 pour négocier les verrous NLM et notifier les redémarrages. Sans lui, tout appel fcntl(F_SETLK) échoue avec ENOLCK.",
        "explanationFr": "Démarrer le service rpc-statd ou utiliser l'option nolock."
      },
      {
        "id": "opt-2",
        "label": "Supprimer le fichier /etc/fstab",
        "labelFr": "Supprimer le fichier /etc/fstab",
        "isCorrect": False,
        "explanation": "Cela désactiverait tous les montages.",
        "explanationFr": "Cela désactiverait tous les montages."
      },
      {
        "id": "opt-3",
        "label": "Remplacer sqlite par un fichier texte brut",
        "labelFr": "Remplacer sqlite par un fichier texte brut",
        "isCorrect": False,
        "explanation": "Cela ne résout pas la cause d'infrastructure NFS.",
        "explanationFr": "Cela ne résout pas la cause d'infrastructure NFS."
      },
      {
        "id": "opt-4",
        "label": "Désactiver le protocole RPC dans le noyau",
        "labelFr": "Désactiver le protocole RPC dans le noyau",
        "isCorrect": False,
        "explanation": "NFS dépend intrinsèquement de RPC (ONC RPC).",
        "explanationFr": "NFS dépend de RPC."
      }
    ],
    "correctedSnippet": """# Démarrer et activer rpc-statd :
systemctl enable --now rpc-statd
# Vérifier la présence du service RPC 100024 :
rpcinfo -p localhost | grep status""",
    "fixExplanation": "Démarrer le démon 'rpc.statd' pour activer le support de verrouillage NLM.",
    "fixExplanationFr": "Démarrer le démon 'rpc.statd' pour activer le support de verrouillage NLM."
  }
]

generate_file("src/data/lpic2Troubleshoot202_1.ts", challenges, "lpic2Troubleshoot202_1", 
              "25 Défis de Dépannage EXCLUSIFS pour LPIC-2 : Examen 202 (Partie 1: Topics 207, 208, 209)\n * Topics couverts :\n * - Topic 207 : Domain Name Server (BIND named.conf, zone serials, FQDN dots, TSIG, open resolvers, chroot)\n * - Topic 208 : Web Services (Apache, Nginx reverse proxy, FastCGI PHP-FPM, SSL/TLS fullchain, Squid cache & ACLs)\n * - Topic 209 : File Sharing (Samba smbpasswd, POSIX vs SMB perms, NFS exports syntax, root squash, idmapd, locking)")
