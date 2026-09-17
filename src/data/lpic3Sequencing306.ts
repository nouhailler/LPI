import { SequencingChallenge } from "../types";

export const lpic3Sequencing306: SequencingChallenge[] = [
  {
    "id": "seq-306-1",
    "title": "Bootstrapping a 2-Node Corosync/Pacemaker Cluster with STONITH Fencing",
    "titleFr": "Initialisation d'un cluster Pacemaker/Corosync à 2 nœuds avec fencing STONITH",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.1",
    "category": "High Availability Cluster Management",
    "description": "Ordonnez les étapes pour initialiser un cluster de haute disponibilité Linux Pacemaker avec mécanisme de coupure électrique d'urgence STONITH.",
    "descriptionFr": "Ordonnez les étapes pour initialiser un cluster de haute disponibilité Linux Pacemaker avec mécanisme de coupure électrique d'urgence STONITH.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration du mot de passe de l'utilisateur système dédié (hacluster) sur les deux nœuds",
        "labelFr": "1. Configuration du mot de passe de l'utilisateur système dédié (hacluster) sur les deux nœuds",
        "detail": "Définir le mot de passe identique avec passwd hacluster et démarrer le démon pcsd : systemctl enable --now pcsd",
        "detailFr": "Définir le mot de passe identique avec passwd hacluster et démarrer le démon pcsd : systemctl enable --now pcsd"
      },
      {
        "id": "s2",
        "label": "2. Authentification mutuelle des nœuds du cluster via pcs host auth",
        "labelFr": "2. Authentification mutuelle des nœuds du cluster via pcs host auth",
        "detail": "Valider la confiance : pcs host auth node1.corp.lan node2.corp.lan -u hacluster -p <secret>",
        "detailFr": "Valider la confiance : pcs host auth node1.corp.lan node2.corp.lan -u hacluster -p <secret>"
      },
      {
        "id": "s3",
        "label": "3. Création et démarrage de la configuration Corosync (pcs cluster setup)",
        "labelFr": "3. Création et démarrage de la configuration Corosync (pcs cluster setup)",
        "detail": "Initialiser le cluster : pcs cluster setup ha_cluster node1.corp.lan node2.corp.lan && pcs cluster start --all",
        "detailFr": "Initialiser le cluster : pcs cluster setup ha_cluster node1.corp.lan node2.corp.lan && pcs cluster start --all"
      },
      {
        "id": "s4",
        "label": "4. Déclaration et configuration de l'agent de fencing STONITH matériel (IPMI / iLO)",
        "labelFr": "4. Déclaration et configuration de l'agent de fencing STONITH matériel (IPMI / iLO)",
        "detail": "Créer la ressource de protection : pcs stonith create fence_node1 fence_ipmilan ip=10.0.0.11 user=admin passwd=secret pcmk_host_list=node1",
        "detailFr": "Créer la ressource de protection : pcs stonith create fence_node1 fence_ipmilan ip=10.0.0.11 user=admin passwd=secret pcmk_host_list=node1"
      },
      {
        "id": "s5",
        "label": "5. Validation de l'état du quorum et de la conformité du cluster avec pcs status",
        "labelFr": "5. Validation de l'état du quorum et de la conformité du cluster avec pcs status",
        "detail": "Vérifier que les nœuds sont en ligne et que STONITH est actif : pcs status && pcs stonith show",
        "detailFr": "Vérifier que les nœuds sont en ligne et que STONITH est actif : pcs status && pcs stonith show"
      }
    ],
    "explanation": "L'initialisation d'un cluster Pacemaker suit : 1) compte hacluster et pcsd, 2) pcs host auth, 3) pcs cluster setup et start, 4) création obligatoire de l'agent stonith, 5) vérification du statut avec pcs status.",
    "explanationFr": "L'initialisation d'un cluster Pacemaker suit : 1) compte hacluster et pcsd, 2) pcs host auth, 3) pcs cluster setup et start, 4) création obligatoire de l'agent stonith, 5) vérification du statut avec pcs status."
  },
  {
    "id": "seq-306-2",
    "title": "Configuring High Availability Active-Passive Apache Service in Pacemaker",
    "titleFr": "Configuration d'un service Apache hautement disponible actif-passif sous Pacemaker",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.2",
    "category": "High Availability Cluster Management",
    "description": "Ordonnez la démarche pour créer une ressource Web avec adresse IP flottante, contraintes d'ordre et de colocation dans Pacemaker.",
    "descriptionFr": "Ordonnez la démarche pour créer une ressource Web avec adresse IP flottante, contraintes d'ordre et de colocation dans Pacemaker.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création de la ressource d'adresse IP flottante (ocf:heartbeat:IPaddr2)",
        "labelFr": "1. Création de la ressource d'adresse IP flottante (ocf:heartbeat:IPaddr2)",
        "detail": "Exécuter : pcs resource create ClusterIP ocf:heartbeat:IPaddr2 ip=192.168.1.100 cidr_netmask=24 op monitor interval=10s",
        "detailFr": "Exécuter : pcs resource create ClusterIP ocf:heartbeat:IPaddr2 ip=192.168.1.100 cidr_netmask=24 op monitor interval=10s"
      },
      {
        "id": "s2",
        "label": "2. Création de la ressource du serveur Web Apache (ocf:heartbeat:apache)",
        "labelFr": "2. Création de la ressource du serveur Web Apache (ocf:heartbeat:apache)",
        "detail": "Exécuter : pcs resource create WebServer ocf:heartbeat:apache configfile=/etc/apache2/apache2.conf statusurl=\"http://127.0.0.1/server-status\"",
        "detailFr": "Exécuter : pcs resource create WebServer ocf:heartbeat:apache configfile=/etc/apache2/apache2.conf statusurl=\"http://127.0.0.1/server-status\""
      },
      {
        "id": "s3",
        "label": "3. Définition de la contrainte de colocation stricte (Colocation Constraint)",
        "labelFr": "3. Définition de la contrainte de colocation stricte (Colocation Constraint)",
        "detail": "Imposer que WebServer tourne toujours sur le même nœud que ClusterIP : pcs constraint colocation add WebServer with ClusterIP INFINITY",
        "detailFr": "Imposer que WebServer tourne toujours sur le même nœud que ClusterIP : pcs constraint colocation add WebServer with ClusterIP INFINITY"
      },
      {
        "id": "s4",
        "label": "4. Définition de la contrainte d'ordre de démarrage (Order Constraint)",
        "labelFr": "4. Définition de la contrainte d'ordre de démarrage (Order Constraint)",
        "detail": "Imposer que l'IP soit montée avant le lancement d'Apache : pcs constraint order ClusterIP then WebServer",
        "detailFr": "Imposer que l'IP soit montée avant le lancement d'Apache : pcs constraint order ClusterIP then WebServer"
      },
      {
        "id": "s5",
        "label": "5. Test de basculement contrôlé par mise en sommeil d'un nœud (pcs node standby)",
        "labelFr": "5. Test de basculement contrôlé par mise en sommeil d'un nœud (pcs node standby)",
        "detail": "Basculer node1 en veille avec pcs node standby node1 et vérifier la reprise immédiate des ressources sur node2 avec pcs status",
        "detailFr": "Basculer node1 en veille avec pcs node standby node1 et vérifier la reprise immédiate des ressources sur node2 avec pcs status"
      }
    ],
    "explanation": "Le service Pacemaker actif-passif exige : 1) création de ClusterIP (IPaddr2), 2) création de WebServer (apache), 3) contrainte de colocation (colocation add), 4) contrainte d'ordre (order then), 5) test de failover avec pcs node standby.",
    "explanationFr": "Le service Pacemaker actif-passif exige : 1) création de ClusterIP (IPaddr2), 2) création de WebServer (apache), 3) contrainte de colocation (colocation add), 4) contrainte d'ordre (order then), 5) test de failover avec pcs node standby."
  },
  {
    "id": "seq-306-3",
    "title": "Configuring DRBD 9 Replicated Storage in Dual-Primary Mode with GFS2",
    "titleFr": "Configuration du stockage synchrone répliqué DRBD 9 en mode Dual-Primary avec GFS2",
    "certification": "lpic-3",
    "topicNumber": 362,
    "objectiveId": "362.1",
    "category": "High Availability Cluster Storage",
    "description": "Ordonnez les étapes pour configurer un disque réseau répliqué de façon synchrone accessible en lecture/écriture simultanée sur 2 nœuds avec verrouillage DLM.",
    "descriptionFr": "Ordonnez les étapes pour configurer un disque réseau répliqué de façon synchrone accessible en lecture/écriture simultanée sur 2 nœuds avec verrouillage DLM.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Rédaction de la configuration de ressource DRBD (/etc/drbd.d/r0.res) avec protocole synchrone C",
        "labelFr": "1. Rédaction de la configuration de ressource DRBD (/etc/drbd.d/r0.res) avec protocole synchrone C",
        "detail": "Définir protocol C, les disques sous-jacents (/dev/sdb) et les adresses IP/ports d'interconnexion",
        "detailFr": "Définir protocol C, les disques sous-jacents (/dev/sdb) et les adresses IP/ports d'interconnexion"
      },
      {
        "id": "s2",
        "label": "2. Initialisation des métadonnées DRBD et activation de la ressource sur les deux nœuds",
        "labelFr": "2. Initialisation des métadonnées DRBD et activation de la ressource sur les deux nœuds",
        "detail": "Exécuter sur chaque hôte : drbdadm create-md r0 && drbdadm up r0",
        "detailFr": "Exécuter sur chaque hôte : drbdadm create-md r0 && drbdadm up r0"
      },
      {
        "id": "s3",
        "label": "3. Forçage de la synchronisation initiale depuis le premier nœud (drbdadm primary --force)",
        "labelFr": "3. Forçage de la synchronisation initiale depuis le premier nœud (drbdadm primary --force)",
        "detail": "Déclencher la copie initiale vers le second nœud : drbdadm primary --force r0",
        "detailFr": "Déclencher la copie initiale vers le second nœud : drbdadm primary --force r0"
      },
      {
        "id": "s4",
        "label": "4. Activation de l'option multi-maître (allow-two-primaries) et promotion du second nœud",
        "labelFr": "4. Activation de l'option multi-maître (allow-two-primaries) et promotion du second nœud",
        "detail": "Ajouter allow-two-primaries yes dans r0.res, recharger avec drbdadm adjust r0 puis drbdadm primary r0 sur le second nœud",
        "detailFr": "Ajouter allow-two-primaries yes dans r0.res, recharger avec drbdadm adjust r0 puis drbdadm primary r0 sur le second nœud"
      },
      {
        "id": "s5",
        "label": "5. Formatage du périphérique répliqué avec le système de fichiers cluster GFS2 (mkfs.gfs2)",
        "labelFr": "5. Formatage du périphérique répliqué avec le système de fichiers cluster GFS2 (mkfs.gfs2)",
        "detail": "Créer le système de fichiers avec verrouillage distribué : mkfs.gfs2 -p lock_dlm -t ha_cluster:shared_vol -j 2 /dev/drbd0",
        "detailFr": "Créer le système de fichiers avec verrouillage distribué : mkfs.gfs2 -p lock_dlm -t ha_cluster:shared_vol -j 2 /dev/drbd0"
      }
    ],
    "explanation": "Le stockage DRBD Dual-Primary / GFS2 impose : 1) fichier res avec protocol C, 2) drbdadm create-md et up, 3) drbdadm primary --force pour la synchronisation initiale, 4) allow-two-primaries et promotion mutuelle, 5) mkfs.gfs2 avec lock_dlm.",
    "explanationFr": "Le stockage DRBD Dual-Primary / GFS2 impose : 1) fichier res avec protocol C, 2) drbdadm create-md et up, 3) drbdadm primary --force pour la synchronisation initiale, 4) allow-two-primaries et promotion mutuelle, 5) mkfs.gfs2 avec lock_dlm."
  },
  {
    "id": "seq-306-4",
    "title": "Deploying a High-Availability Load Balancer with Keepalived VRRP and Virtual IP",
    "titleFr": "Déploiement d'une paire d'équilibreurs Keepalived avec basculement d'IP virtuelle (VRRP)",
    "certification": "lpic-3",
    "topicNumber": 364,
    "objectiveId": "364.2",
    "category": "Load Balanced Clusters",
    "description": "Ordonnez les étapes pour configurer un basculement d'IP virtuelle sans état par Keepalived en cas de défaillance d'un serveur mandataire.",
    "descriptionFr": "Ordonnez les étapes pour configurer un basculement d'IP virtuelle sans état par Keepalived en cas de défaillance d'un serveur mandataire.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Activation de la liaison sur IP non locale dans le noyau Linux (net.ipv4.ip_nonlocal_bind)",
        "labelFr": "1. Activation de la liaison sur IP non locale dans le noyau Linux (net.ipv4.ip_nonlocal_bind)",
        "detail": "Permettre aux services d'écouter sur l'IP virtuelle même si elle n'est pas encore assignée : sysctl -w net.ipv4.ip_nonlocal_bind=1",
        "detailFr": "Permettre aux services d'écouter sur l'IP virtuelle même si elle n'est pas encore assignée : sysctl -w net.ipv4.ip_nonlocal_bind=1"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du script de vérification de santé applicative (vrrp_script)",
        "labelFr": "2. Déclaration du script de vérification de santé applicative (vrrp_script)",
        "detail": "Dans /etc/keepalived/keepalived.conf : définir vrrp_script chk_haproxy { script \"killall -0 haproxy\" interval 2 weight 2 }",
        "detailFr": "Dans /etc/keepalived/keepalived.conf : définir vrrp_script chk_haproxy { script \"killall -0 haproxy\" interval 2 weight 2 }"
      },
      {
        "id": "s3",
        "label": "3. Configuration de l'instance VRRP avec priorités distinctes (MASTER vs BACKUP)",
        "labelFr": "3. Configuration de l'instance VRRP avec priorités distinctes (MASTER vs BACKUP)",
        "detail": "Définir state MASTER / priority 101 sur le nœud 1, et state BACKUP / priority 100 sur le nœud 2",
        "detailFr": "Définir state MASTER / priority 101 sur le nœud 1, et state BACKUP / priority 100 sur le nœud 2"
      },
      {
        "id": "s4",
        "label": "4. Déclaration du bloc virtual_ipaddress portant l'adresse IP flottante du service",
        "labelFr": "4. Déclaration du bloc virtual_ipaddress portant l'adresse IP flottante du service",
        "detail": "Spécifier virtual_ipaddress { 192.168.1.50/24 dev eth0 } et associer track_script { chk_haproxy }",
        "detailFr": "Spécifier virtual_ipaddress { 192.168.1.50/24 dev eth0 } et associer track_script { chk_haproxy }"
      },
      {
        "id": "s5",
        "label": "5. Démarrage du service Keepalived et simulation d'arrêt du processus pour valider le basculement",
        "labelFr": "5. Démarrage du service Keepalived et simulation d'arrêt du processus pour valider le basculement",
        "detail": "Démarrer systemctl start keepalived, arrêter le proxy sur le maître et constater la migration immédiate de la VIP avec ip addr",
        "detailFr": "Démarrer systemctl start keepalived, arrêter le proxy sur le maître et constater la migration immédiate de la VIP avec ip addr"
      }
    ],
    "explanation": "Le basculement Keepalived VRRP requiert : 1) ip_nonlocal_bind=1, 2) déclaration de vrrp_script (test de vie), 3) configuration MASTER (101) et BACKUP (100), 4) bloc virtual_ipaddress et track_script, 5) test de basculement après arrêt du service.",
    "explanationFr": "Le basculement Keepalived VRRP requiert : 1) ip_nonlocal_bind=1, 2) déclaration de vrrp_script (test de vie), 3) configuration MASTER (101) et BACKUP (100), 4) bloc virtual_ipaddress et track_script, 5) test de basculement après arrêt du service."
  },
  {
    "id": "seq-306-5",
    "title": "Bootstrapping a Ceph Distributed Storage Cluster with Cephadm",
    "titleFr": "Initialisation d'un cluster de stockage distribué Ceph avec l'orchestrateur Cephadm",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.1",
    "category": "High Availability Distributed Storage",
    "description": "Ordonnez les étapes pour déployer un cluster Ceph moderne de stockage objet/bloc avec l'outil de conteneurisation Cephadm.",
    "descriptionFr": "Ordonnez les étapes pour déployer un cluster Ceph moderne de stockage objet/bloc avec l'outil de conteneurisation Cephadm.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Installation du paquet cephadm et d'un moteur de conteneurs (podman) sur le nœud initial",
        "labelFr": "1. Installation du paquet cephadm et d'un moteur de conteneurs (podman) sur le nœud initial",
        "detail": "Installer podman et le binaire d'orchestration officiel : apt/dnf install cephadm",
        "detailFr": "Installer podman et le binaire d'orchestration officiel : apt/dnf install cephadm"
      },
      {
        "id": "s2",
        "label": "2. Exécution du bootstrap initial avec déclaration de l'IP du premier moniteur (cephadm bootstrap)",
        "labelFr": "2. Exécution du bootstrap initial avec déclaration de l'IP du premier moniteur (cephadm bootstrap)",
        "detail": "Lancer : cephadm bootstrap --mon-ip 10.0.0.10 --initial-dashboard-user admin --initial-dashboard-password <secret>",
        "detailFr": "Lancer : cephadm bootstrap --mon-ip 10.0.0.10 --initial-dashboard-user admin --initial-dashboard-password <secret>"
      },
      {
        "id": "s3",
        "label": "3. Diffusion de la clé publique SSH générée (/etc/ceph/ceph.pub) sur les hôtes secondaires",
        "labelFr": "3. Diffusion de la clé publique SSH générée (/etc/ceph/ceph.pub) sur les hôtes secondaires",
        "detail": "Copier la clé dans authorized_keys de l'utilisateur root sur tous les futurs nœuds de stockage",
        "detailFr": "Copier la clé dans authorized_keys de l'utilisateur root sur tous les futurs nœuds de stockage"
      },
      {
        "id": "s4",
        "label": "4. Enrôlement des nouveaux nœuds dans l'orchestrateur de cluster (ceph orch host add)",
        "labelFr": "4. Enrôlement des nouveaux nœuds dans l'orchestrateur de cluster (ceph orch host add)",
        "detail": "Ajouter les hôtes au cluster : ceph orch host add ceph-node2 10.0.0.11 && ceph orch host add ceph-node3 10.0.0.12",
        "detailFr": "Ajouter les hôtes au cluster : ceph orch host add ceph-node2 10.0.0.11 && ceph orch host add ceph-node3 10.0.0.12"
      },
      {
        "id": "s5",
        "label": "5. Provisionnement des disques bruts en démons de stockage OSD (ceph orch apply osd)",
        "labelFr": "5. Provisionnement des disques bruts en démons de stockage OSD (ceph orch apply osd)",
        "detail": "Allouer tous les disques disponibles : ceph orch apply osd --all-available-devices et vérifier avec ceph -s",
        "detailFr": "Allouer tous les disques disponibles : ceph orch apply osd --all-available-devices et vérifier avec ceph -s"
      }
    ],
    "explanation": "Le déploiement Cephadm suit : 1) installation de cephadm et podman, 2) cephadm bootstrap --mon-ip, 3) distribution de la clé ceph.pub, 4) ajout des hôtes avec ceph orch host add, 5) création des démons OSD sur les disques bruts.",
    "explanationFr": "Le déploiement Cephadm suit : 1) installation de cephadm et podman, 2) cephadm bootstrap --mon-ip, 3) distribution de la clé ceph.pub, 4) ajout des hôtes avec ceph orch host add, 5) création des démons OSD sur les disques bruts."
  },
  {
    "id": "seq-306-6",
    "title": "Deploying Layer 7 Load Balancing with HAProxy and SSL/TLS Termination",
    "titleFr": "Déploiement d'un proxy inverse HAProxy niveau 7 avec terminaison SSL/TLS",
    "certification": "lpic-3",
    "topicNumber": 364,
    "objectiveId": "364.1",
    "category": "Load Balanced Clusters",
    "description": "Ordonnez la démarche pour configurer HAProxy en tant que point d'entrée HTTPS répartissant les requêtes vers un ensemble de serveurs Web internes.",
    "descriptionFr": "Ordonnez la démarche pour configurer HAProxy en tant que point d'entrée HTTPS répartissant les requêtes vers un ensemble de serveurs Web internes.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Concaténation de la clé privée, du certificat et de la chaîne d'autorité dans un bundle PEM",
        "labelFr": "1. Concaténation de la clé privée, du certificat et de la chaîne d'autorité dans un bundle PEM",
        "detail": "Créer le fichier unifié attendu par HAProxy : cat server.crt chain.crt server.key > /etc/haproxy/certs/site.pem && chmod 600",
        "detailFr": "Créer le fichier unifié attendu par HAProxy : cat server.crt chain.crt server.key > /etc/haproxy/certs/site.pem && chmod 600"
      },
      {
        "id": "s2",
        "label": "2. Déclaration de la section frontend HTTPS avec directive bind et certificat SSL",
        "labelFr": "2. Déclaration de la section frontend HTTPS avec directive bind et certificat SSL",
        "detail": "Dans /etc/haproxy/haproxy.cfg : définir frontend https_in bind *:443 ssl crt /etc/haproxy/certs/site.pem alpn h2,http/1.1",
        "detailFr": "Dans /etc/haproxy/haproxy.cfg : définir frontend https_in bind *:443 ssl crt /etc/haproxy/certs/site.pem alpn h2,http/1.1"
      },
      {
        "id": "s3",
        "label": "3. Déclaration de la section backend avec algorithme roundrobin et tests de santé (check)",
        "labelFr": "3. Déclaration de la section backend avec algorithme roundrobin et tests de santé (check)",
        "detail": "Configurer backend web_servers balance roundrobin et déclarer server web01 10.0.1.10:80 check inter 2000 fall 3 rise 2",
        "detailFr": "Configurer backend web_servers balance roundrobin et déclarer server web01 10.0.1.10:80 check inter 2000 fall 3 rise 2"
      },
      {
        "id": "s4",
        "label": "4. Validation de la syntaxe du fichier de configuration HAProxy (haproxy -c)",
        "labelFr": "4. Validation de la syntaxe du fichier de configuration HAProxy (haproxy -c)",
        "detail": "Vérifier la validité avant rechargement : haproxy -c -f /etc/haproxy/haproxy.cfg",
        "detailFr": "Vérifier la validité avant rechargement : haproxy -c -f /etc/haproxy/haproxy.cfg"
      },
      {
        "id": "s5",
        "label": "5. Démarrage du service et surveillance des serveurs via l'interface statistique",
        "labelFr": "5. Démarrage du service et surveillance des serveurs via l'interface statistique",
        "detail": "Démarrer systemctl restart haproxy et vérifier l'état vert des nœuds sur le tableau de bord :8404/stats",
        "detailFr": "Démarrer systemctl restart haproxy et vérifier l'état vert des nœuds sur le tableau de bord :8404/stats"
      }
    ],
    "explanation": "La terminaison SSL sous HAProxy respecte : 1) création du bundle PEM unifié, 2) bind *:443 ssl crt, 3) backend balance roundrobin avec check, 4) haproxy -c -f (test de syntaxe), 5) redémarrage et contrôle sur la page stats.",
    "explanationFr": "La terminaison SSL sous HAProxy respecte : 1) création du bundle PEM unifié, 2) bind *:443 ssl crt, 3) backend balance roundrobin avec check, 4) haproxy -c -f (test de syntaxe), 5) redémarrage et contrôle sur la page stats."
  },
  {
    "id": "seq-306-7",
    "title": "Creating and Mounting a Ceph Block Device (RBD) on a Linux Client",
    "titleFr": "Création et montage d'un volume bloc Ceph (RBD) sur un client Linux",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.2",
    "category": "High Availability Distributed Storage",
    "description": "Ordonnez la démarche pour provisionner une image de disque virtuel Ceph RBD, accorder les droits au client et la monter en tant que système de fichiers local.",
    "descriptionFr": "Ordonnez la démarche pour provisionner une image de disque virtuel Ceph RBD, accorder les droits au client et la monter en tant que système de fichiers local.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création et initialisation du pool de stockage dédié aux périphériques blocs (rbd pool init)",
        "labelFr": "1. Création et initialisation du pool de stockage dédié aux périphériques blocs (rbd pool init)",
        "detail": "Sur le cluster : ceph osd pool create rbd_data 32 32 && rbd pool init rbd_data",
        "detailFr": "Sur le cluster : ceph osd pool create rbd_data 32 32 && rbd pool init rbd_data"
      },
      {
        "id": "s2",
        "label": "2. Création du compte utilisateur et génération de son porte-clés d'authentification (ceph auth)",
        "labelFr": "2. Création du compte utilisateur et génération de son porte-clés d'authentification (ceph auth)",
        "detail": "Générer les droits : ceph auth get-or-create client.dbuser mon 'profile rbd' osd 'profile rbd pool=rbd_data' -o /etc/ceph/ceph.client.dbuser.keyring",
        "detailFr": "Générer les droits : ceph auth get-or-create client.dbuser mon 'profile rbd' osd 'profile rbd pool=rbd_data' -o /etc/ceph/ceph.client.dbuser.keyring"
      },
      {
        "id": "s3",
        "label": "3. Transfert du trousseau de clés et du fichier ceph.conf sur le client applicatif",
        "labelFr": "3. Transfert du trousseau de clés et du fichier ceph.conf sur le client applicatif",
        "detail": "Copier les fichiers dans /etc/ceph/ sur le nœud client avec permissions chmod 600",
        "detailFr": "Copier les fichiers dans /etc/ceph/ sur le nœud client avec permissions chmod 600"
      },
      {
        "id": "s4",
        "label": "4. Création de l'image RBD et association au sous-système de blocs du noyau (rbd map)",
        "labelFr": "4. Création de l'image RBD et association au sous-système de blocs du noyau (rbd map)",
        "detail": "Créer et mapper l'image : rbd create rbd_data/vol01 --size 100G --id dbuser && rbd map rbd_data/vol01 --id dbuser",
        "detailFr": "Créer et mapper l'image : rbd create rbd_data/vol01 --size 100G --id dbuser && rbd map rbd_data/vol01 --id dbuser"
      },
      {
        "id": "s5",
        "label": "5. Formatage du périphérique /dev/rbd0 en XFS et montage persistant dans le système",
        "labelFr": "5. Formatage du périphérique /dev/rbd0 en XFS et montage persistant dans le système",
        "detail": "Formater : mkfs.xfs /dev/rbd0 et monter dans /mnt/data avec l'option _netdev dans /etc/fstab",
        "detailFr": "Formater : mkfs.xfs /dev/rbd0 et monter dans /mnt/data avec l'option _netdev dans /etc/fstab"
      }
    ],
    "explanation": "L'utilisation d'un volume bloc Ceph RBD exige : 1) création du pool et rbd pool init, 2) génération des autorisations avec ceph auth, 3) copie de la conf et du keyring sur le client, 4) rbd create puis rbd map produisant /dev/rbd0, 5) formatage mkfs.xfs et montage avec _netdev.",
    "explanationFr": "L'utilisation d'un volume bloc Ceph RBD exige : 1) création du pool et rbd pool init, 2) génération des autorisations avec ceph auth, 3) copie de la conf et du keyring sur le client, 4) rbd create puis rbd map produisant /dev/rbd0, 5) formatage mkfs.xfs et montage avec _netdev."
  },
  {
    "id": "seq-306-8",
    "title": "Configuring Pacemaker Multi-State (Promoted/Demoted) Cloned Database Resource",
    "titleFr": "Configuration d'une ressource de base de données multi-état clonée (Promoted/Demoted) sous Pacemaker",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.3",
    "category": "High Availability Cluster Management",
    "description": "Ordonnez les étapes pour configurer une ressource d'état primaire/secondaire (ex. PostgreSQL ou MariaDB replication) sous Pacemaker.",
    "descriptionFr": "Ordonnez les étapes pour configurer une ressource d'état primaire/secondaire (ex. PostgreSQL ou MariaDB replication) sous Pacemaker.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration de la réplication de données native entre l'instance maître et la réplique",
        "labelFr": "1. Configuration de la réplication de données native entre l'instance maître et la réplique",
        "detail": "Valider que le flux WAL de PostgreSQL ou le binlog MariaDB transite sans erreur entre les deux nœuds",
        "detailFr": "Valider que le flux WAL de PostgreSQL ou le binlog MariaDB transite sans erreur entre les deux nœuds"
      },
      {
        "id": "s2",
        "label": "2. Déclaration de la ressource Pacemaker gérée par l'agent OCF d'état",
        "labelFr": "2. Déclaration de la ressource Pacemaker gérée par l'agent OCF d'état",
        "detail": "Définir la ressource : pcs resource create pgsql_res ocf:heartbeat:pgsql op monitor interval=15s",
        "detailFr": "Définir la ressource : pcs resource create pgsql_res ocf:heartbeat:pgsql op monitor interval=15s"
      },
      {
        "id": "s3",
        "label": "3. Transformation de la ressource en clone multi-état avec directive promotable",
        "labelFr": "3. Transformation de la ressource en clone multi-état avec directive promotable",
        "detail": "Exécuter : pcs resource clone pgsql_res promotable master-max=1 clone-max=2 notify=true",
        "detailFr": "Exécuter : pcs resource clone pgsql_res promotable master-max=1 clone-max=2 notify=true"
      },
      {
        "id": "s4",
        "label": "4. Création d'une contrainte de colocation liant la VIP d'écriture au nœud Promoted (Master)",
        "labelFr": "4. Création d'une contrainte de colocation liant la VIP d'écriture au nœud Promoted (Master)",
        "detail": "Lier l'IP d'écriture : pcs constraint colocation add DB_Write_IP with pgsql_res-clone role=Promoted INFINITY",
        "detailFr": "Lier l'IP d'écriture : pcs constraint colocation add DB_Write_IP with pgsql_res-clone role=Promoted INFINITY"
      },
      {
        "id": "s5",
        "label": "5. Test de promotion automatique de la réplique lors de la coupure du maître",
        "labelFr": "5. Test de promotion automatique de la réplique lors de la coupure du maître",
        "detail": "Isoler le nœud Promoted et observer avec crm_mon la promotion automatique du second nœud de Demoted vers Promoted",
        "detailFr": "Isoler le nœud Promoted et observer avec crm_mon la promotion automatique du second nœud de Demoted vers Promoted"
      }
    ],
    "explanation": "Les ressources multi-état Pacemaker (Promoted/Demoted) respectent : 1) réplication native validée, 2) création de la ressource de base OCF, 3) clonage avec drapeau 'promotable' et 'master-max=1', 4) colocation avec la VIP sur le rôle Promoted, 5) test de basculement d'état.",
    "explanationFr": "Les ressources multi-état Pacemaker (Promoted/Demoted) respectent : 1) réplication native validée, 2) création de la ressource de base OCF, 3) clonage avec drapeau 'promotable' et 'master-max=1', 4) colocation avec la VIP sur le rôle Promoted, 5) test de basculement d'état."
  },
  {
    "id": "seq-306-9",
    "title": "Deploying a High Availability Clustered Shared Storage with GlusterFS Volume",
    "titleFr": "Déploiement d'un volume de stockage partagé répliqué avec GlusterFS",
    "certification": "lpic-3",
    "topicNumber": 363,
    "objectiveId": "363.3",
    "category": "High Availability Distributed Storage",
    "description": "Ordonnez les étapes pour concevoir un volume de fichiers réseau partagé répliqué sur 3 serveurs GlusterFS et le monter sur des clients.",
    "descriptionFr": "Ordonnez les étapes pour concevoir un volume de fichiers réseau partagé répliqué sur 3 serveurs GlusterFS et le monter sur des clients.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Formatage en XFS des partitions dédiées et création des répertoires de briques de stockage",
        "labelFr": "1. Formatage en XFS des partitions dédiées et création des répertoires de briques de stockage",
        "detail": "Sur chaque serveur de stockage : formater /dev/sdb1 en XFS et monter dans /data/brick1",
        "detailFr": "Sur chaque serveur de stockage : formater /dev/sdb1 en XFS et monter dans /data/brick1"
      },
      {
        "id": "s2",
        "label": "2. Établissement du pool de serveurs de confiance (gluster peer probe)",
        "labelFr": "2. Établissement du pool de serveurs de confiance (gluster peer probe)",
        "detail": "Interconnecter les nœuds : gluster peer probe gluster02 && gluster peer probe gluster03",
        "detailFr": "Interconnecter les nœuds : gluster peer probe gluster02 && gluster peer probe gluster03"
      },
      {
        "id": "s3",
        "label": "3. Création de la ressource de volume répliqué à 3 exemplaires (gluster volume create)",
        "labelFr": "3. Création de la ressource de volume répliqué à 3 exemplaires (gluster volume create)",
        "detail": "Déclarer le volume : gluster volume create gv0 replica 3 gluster01:/data/brick1/gv0 gluster02:/data/brick1/gv0 gluster03:/data/brick1/gv0",
        "detailFr": "Déclarer le volume : gluster volume create gv0 replica 3 gluster01:/data/brick1/gv0 gluster02:/data/brick1/gv0 gluster03:/data/brick1/gv0"
      },
      {
        "id": "s4",
        "label": "4. Démarrage officiel du volume et contrôle des services d'écoute (gluster volume start)",
        "labelFr": "4. Démarrage officiel du volume et contrôle des services d'écoute (gluster volume start)",
        "detail": "Lancer le volume : gluster volume start gv0 et vérifier l'état avec gluster volume status",
        "detailFr": "Lancer le volume : gluster volume start gv0 et vérifier l'état avec gluster volume status"
      },
      {
        "id": "s5",
        "label": "5. Montage du volume distant sur les clients via le client FUSE natif (mount -t glusterfs)",
        "labelFr": "5. Montage du volume distant sur les clients via le client FUSE natif (mount -t glusterfs)",
        "detail": "Monter : mount -t glusterfs gluster01:/gv0 /mnt/glusterfs et tester la synchronisation automatique des fichiers",
        "detailFr": "Monter : mount -t glusterfs gluster01:/gv0 /mnt/glusterfs et tester la synchronisation automatique des fichiers"
      }
    ],
    "explanation": "Le déploiement GlusterFS répliqué suit : 1) briques XFS montées, 2) gluster peer probe pour fonder le pool de confiance, 3) gluster volume create avec replica 3, 4) gluster volume start, 5) montage FUSE sur les clients avec mount -t glusterfs.",
    "explanationFr": "Le déploiement GlusterFS répliqué suit : 1) briques XFS montées, 2) gluster peer probe pour fonder le pool de confiance, 3) gluster volume create avec replica 3, 4) gluster volume start, 5) montage FUSE sur les clients avec mount -t glusterfs."
  },
  {
    "id": "seq-306-10",
    "title": "Configuring SBD (Storage-Based Death) Watchdog Fencing in Pacemaker",
    "titleFr": "Configuration du mécanisme d'auto-exclussion SBD (Storage-Based Death) sous Pacemaker",
    "certification": "lpic-3",
    "topicNumber": 361,
    "objectiveId": "361.1",
    "category": "High Availability Cluster Management",
    "description": "Ordonnez les étapes pour configurer le fencing SBD sans IPMI fondé sur un périphérique de stockage partagé (SAN/iSCSI) et le chien de garde matériel/logiciel (watchdog).",
    "descriptionFr": "Ordonnez les étapes pour configurer le fencing SBD sans IPMI fondé sur un périphérique de stockage partagé (SAN/iSCSI) et le chien de garde matériel/logiciel (watchdog).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Découverte et validation de la visibilité du disque SAN partagé sur tous les nœuds",
        "labelFr": "1. Découverte et validation de la visibilité du disque SAN partagé sur tous les nœuds",
        "detail": "Vérifier que le LUN iSCSI ou Fibre Channel (ex. /dev/sdb) est détecté de manière identique sur chaque machine",
        "detailFr": "Vérifier que le LUN iSCSI ou Fibre Channel (ex. /dev/sdb) est détecté de manière identique sur chaque machine"
      },
      {
        "id": "s2",
        "label": "2. Initialisation des en-têtes et des créneaux de messages sur le disque SBD (sbd create)",
        "labelFr": "2. Initialisation des en-têtes et des créneaux de messages sur le disque SBD (sbd create)",
        "detail": "Formater les métadonnées SBD : sbd -d /dev/sdb -4 20 -1 10 create",
        "detailFr": "Formater les métadonnées SBD : sbd -d /dev/sdb -4 20 -1 10 create"
      },
      {
        "id": "s3",
        "label": "3. Chargement et configuration du pilote de chien de garde noyau (softdog ou watchdog matériel)",
        "labelFr": "3. Chargement et configuration du pilote de chien de garde noyau (softdog ou watchdog matériel)",
        "detail": "Charger le module : modprobe softdog et déclarer WATCHDOG_DEVICE=\"/dev/watchdog\" dans la configuration SBD",
        "detailFr": "Charger le module : modprobe softdog et déclarer WATCHDOG_DEVICE=\"/dev/watchdog\" dans la configuration SBD"
      },
      {
        "id": "s4",
        "label": "4. Activation du démon système SBD dans /etc/sysconfig/sbd et au démarrage de l'OS",
        "labelFr": "4. Activation du démon système SBD dans /etc/sysconfig/sbd et au démarrage de l'OS",
        "detail": "Spécifier SBD_DEVICE=\"/dev/sdb\" et démarrer le démon : systemctl enable --now sbd",
        "detailFr": "Spécifier SBD_DEVICE=\"/dev/sdb\" et démarrer le démon : systemctl enable --now sbd"
      },
      {
        "id": "s5",
        "label": "5. Activation de la propriété STONITH-SBD dans Pacemaker (stonith-watchdog-timeout)",
        "labelFr": "5. Activation de la propriété STONITH-SBD dans Pacemaker (stonith-watchdog-timeout)",
        "detail": "Configurer Pacemaker : pcs property set stonith-watchdog-timeout=15s && pcs stonith create fence_sbd fence_sbd",
        "detailFr": "Configurer Pacemaker : pcs property set stonith-watchdog-timeout=15s && pcs stonith create fence_sbd fence_sbd"
      }
    ],
    "explanation": "Le fencing SBD (Storage-Based Death) exige : 1) disque SAN partagé visible, 2) sbd create sur le périphérique, 3) module watchdog chargé (softdog), 4) démarrage du service sbd avec SBD_DEVICE, 5) déclaration de stonith-watchdog-timeout dans Pacemaker.",
    "explanationFr": "Le fencing SBD (Storage-Based Death) exige : 1) disque SAN partagé visible, 2) sbd create sur le périphérique, 3) module watchdog chargé (softdog), 4) démarrage du service sbd avec SBD_DEVICE, 5) déclaration de stonith-watchdog-timeout dans Pacemaker."
  }
];
