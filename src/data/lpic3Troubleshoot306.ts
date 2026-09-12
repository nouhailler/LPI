import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-3 : Examen 306 (Haute Disponibilité & Clusters de Stockage)
 * Topics couverts :
 * - Topic 361 : Gestion de Clusters HA (Corosync, Pacemaker, pcs, quorum, STONITH / Fencing, contraintes)
 * - Topic 362 : Stockage HA pour Clusters (DRBD 9, Split-Brain DRBD, Clustered LVM / lvmlockd, GFS2, OCFS2, DLM)
 * - Topic 363 : Stockage Distribué HA (Ceph Storage, OSD, MON, PGs degraded, CRUSH map, GlusterFS)
 * - Topic 364 : Répartition de Charge HA (HAProxy, Keepalived VRRP, IPVS / LVS)
 */
export const lpic3Troubleshoot306: TroubleshootingChallenge[] = [
  {
    id: 'tb-lpic3-306-01',
    title: 'Perte de Quorum Corosync dans un cluster à 2 nœuds (two_node)',
    titleFr: 'Perte de Quorum Corosync dans un cluster à 2 nœuds (two_node)',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.1',
    category: 'Corosync Quorum & Membership',
    scenario: 'Dans un cluster haute disponibilité à 2 nœuds (node1 et node2), node2 est éteint pour maintenance. Immédiatement, node1 arrête toutes les ressources et crm_mon affiche : "Current cluster status: Node node1: UNQUORUM (expected 2, current 1)".',
    scenarioFr: 'Dans un cluster haute disponibilité à 2 nœuds (node1 et node2), node2 est éteint pour maintenance. Immédiatement, node1 arrête toutes les ressources et crm_mon affiche : "Current cluster status: Node node1: UNQUORUM (expected 2, current 1)".',
    codeSnippet: `# crm_mon -1
Cluster Summary:
  * Stack: corosync
  * Current DC: node1 (version 2.1.5) - partition WITHOUT quorum
  * 2 nodes configured
  * 0 resource instances configured

# cat /etc/corosync/corosync.conf
totem {
    version: 2
    cluster_name: mycluster
    transport: knet
}
quorum {
    provider: corosync_votequorum
    # two_node: 1 est absent !
}`,
    language: 'config',
    bugDescription: 'Dans un cluster à 2 nœuds sans périphérique de quorum externe (qdevice), la directive "two_node: 1" n\'est pas activée dans la section quorum, provoquant la perte de quorum dès qu\'un seul nœud disparaît (1 sur 2 = 50% <= seuil).',
    bugDescriptionFr: 'Dans un cluster à 2 nœuds sans périphérique de quorum externe (qdevice), la directive "two_node: 1" n\'est pas activée dans la section quorum, provoquant la perte de quorum dès qu\'un seul nœud disparaît (1 sur 2 = 50% <= seuil).',
    options: [
      {
        id: 'opt-1',
        label: 'Dans un cluster à 2 nœuds, corosync_votequorum exige l\'option "two_node: 1" (avec STONITH obligatoire) ou un QDevice pour maintenir le quorum lorsqu\'un nœud est indisponible',
        labelFr: 'Dans un cluster à 2 nœuds, corosync_votequorum exige l\'option "two_node: 1" (avec STONITH obligatoire) ou un QDevice pour maintenir le quorum lorsqu\'un nœud est indisponible',
        isCorrect: true,
        explanation: 'Par défaut, la majorité stricte (N/2 + 1) exige au moins 2 votes sur 2. Si un nœud tombe, le nœud restant n\'a que 50% des votes et perd le quorum. Avec "two_node: 1", Corosync autorise le nœud survivant à conserver le quorum à condition que le fencing (STONITH) isole l\'autre nœud.',
        explanationFr: 'Par défaut, la majorité stricte (N/2 + 1) exige au moins 2 votes sur 2. Si un nœud tombe, le nœud restant n\'a que 50% des votes et perd le quorum. Avec "two_node: 1", Corosync autorise le nœud survivant à conserver le quorum à condition que le fencing (STONITH) isole l\'autre nœud.'
      },
      {
        id: 'opt-2',
        label: 'Corosync ne fonctionne que sur les réseaux Token Ring',
        labelFr: 'Corosync ne fonctionne que sur les réseaux Token Ring',
        isCorrect: false,
        explanation: 'Corosync Totem fonctionne sur Ethernet standard (UDP/IP ou knet).',
        explanationFr: 'Corosync Totem fonctionne sur Ethernet standard (UDP/IP ou knet).'
      },
      {
        id: 'opt-3',
        label: 'Les clusters à 2 nœuds sont strictement interdits sous Linux',
        labelFr: 'Les clusters à 2 nœuds sont strictement interdits sous Linux',
        isCorrect: false,
        explanation: 'Ils sont très courants et supportés nativement avec two_node ou corosync-qdevice.',
        explanationFr: 'Ils sont très courants et supportés nativement avec two_node ou corosync-qdevice.'
      },
      {
        id: 'opt-4',
        label: 'Il faut désactiver Corosync et lancer Pacemaker en mode standalone',
        labelFr: 'Il faut désactiver Corosync et lancer Pacemaker en mode standalone',
        isCorrect: false,
        explanation: 'Pacemaker dépend obligatoirement de Corosync pour la communication et le quorum.',
        explanationFr: 'Pacemaker dépend obligatoirement de Corosync pour la communication et le quorum.'
      }
    ],
    correctedSnippet: `quorum {
    provider: corosync_votequorum
    two_node: 1
    wait_for_all: 1
}
# Puis recharger avec : corosync-cfgtool -R`,
    fixExplanation: 'Activer l\'option "two_node: 1" ou déployer un QDevice (corosync-qdevice) pour permettre le quorum à 1 nœud.',
    fixExplanationFr: 'Activer l\'option "two_node: 1" ou déployer un QDevice (corosync-qdevice) pour permettre le quorum à 1 nœud.'
  },
  {
    id: 'tb-lpic3-306-02',
    title: 'Split-Brain DRBD 9 : état StandAlone et désynchronisation des blocs',
    titleFr: 'Split-Brain DRBD 9 : état StandAlone et désynchronisation des blocs',
    certification: 'lpic-3',
    topicNumber: 362,
    objectiveId: '362.1',
    category: 'DRBD Replication & Split-Brain Recovery',
    scenario: 'Après une panne réseau temporaire entre deux nœuds, la réplication DRBD s\'est arrêtée. "drbdadm status" affiche l\'état "StandAlone" avec "Split-Brain detected, dropping connection!". Les deux nœuds refusent de se reconnecter.',
    scenarioFr: 'Après une panne réseau temporaire entre deux nœuds, la réplication DRBD s\'est arrêtée. "drbdadm status" affiche l\'état "StandAlone" avec "Split-Brain detected, dropping connection!". Les deux nœuds refusent de se reconnecter.',
    codeSnippet: `# drbdadm status r0
r0 role:Primary
  disk:UpToDate
  node2 role:Secondary connection:StandAlone

# dmesg | grep drbd
drbd r0/0 drbd0: Split-Brain detected but unresolved, dropping connection!
drbd r0/0 drbd0: State change failed: Need to resolve split-brain first!`,
    language: 'bash',
    bugDescription: 'Les deux nœuds DRBD ont subi des écritures concurrentes pendant la coupure réseau, provoquant une divergence des UUID de génération de données (split-brain). DRBD se déconnecte pour protéger les données.',
    bugDescriptionFr: 'Les deux nœuds DRBD ont subi des écritures concurrentes pendant la coupure réseau, provoquant une divergence des UUID de génération de données (split-brain). DRBD se déconnecte pour protéger les données.',
    options: [
      {
        id: 'opt-1',
        label: 'DRBD a détecté un split-brain (écritures divergentes) ; il faut désigner le nœud perdant, dégrader son rôle en Secondary, rejeter ses modifications ("discard-my-data") puis reconnecter la ressource',
        labelFr: 'DRBD a détecté un split-brain (écritures divergentes) ; il faut désigner le nœud perdant, dégrader son rôle en Secondary, rejeter ses modifications ("discard-my-data") puis reconnecter la ressource',
        isCorrect: true,
        explanation: 'La résolution manuelle de split-brain DRBD impose sur le nœud secondaire sacrifié : "drbdadm secondary r0", "drbdadm connect --discard-my-data r0", et sur le nœud principal conservé : "drbdadm connect r0" pour déclencher la resynchronisation intégrale.',
        explanationFr: 'La résolution manuelle de split-brain DRBD impose sur le nœud secondaire sacrifié : "drbdadm secondary r0", "drbdadm connect --discard-my-data r0", et sur le nœud principal conservé : "drbdadm connect r0" pour déclencher la resynchronisation intégrale.'
      },
      {
        id: 'opt-2',
        label: 'Il faut reformater les deux disques avec mkfs.ext4',
        labelFr: 'Il faut reformater les deux disques avec mkfs.ext4',
        isCorrect: false,
        explanation: 'Reformater détruirait toutes les données de production.',
        explanationFr: 'Reformater détruirait toutes les données de production.'
      },
      {
        id: 'opt-3',
        label: 'Le protocole DRBD doit être basculé en Protocol A (asynchrone pur)',
        labelFr: 'Le protocole DRBD doit être basculé en Protocol A (asynchrone pur)',
        isCorrect: false,
        explanation: 'Changer de protocole ne résout pas la divergence existante.',
        explanationFr: 'Changer de protocole ne résout pas la divergence existante.'
      },
      {
        id: 'opt-4',
        label: 'DRBD 9 résout toujours les conflits par suppression aléatoire',
        labelFr: 'DRBD 9 résout toujours les conflits par suppression aléatoire',
        isCorrect: false,
        explanation: 'Par défaut, DRBD refuse de trancher arbitrairement pour éviter la perte de données silencieuse.',
        explanationFr: 'Par défaut, DRBD refuse de trancher arbitrairement pour éviter la perte de données silencieuse.'
      }
    ],
    correctedSnippet: `# Sur le nœud perdant (ex: node2) :
drbdadm secondary r0
drbdadm disconnect r0
drbdadm connect --discard-my-data r0

# Sur le nœud survivant / référence (ex: node1) :
drbdadm connect r0`,
    fixExplanation: 'Forcer le nœud secondaire à abandonner ses données divergentes avec "drbdadm connect --discard-my-data" pour synchroniser depuis le primaire.',
    fixExplanationFr: 'Forcer le nœud secondaire à abandonner ses données divergentes avec "drbdadm connect --discard-my-data" pour synchroniser depuis le primaire.'
  },
  {
    id: 'tb-lpic3-306-03',
    title: 'Cluster Pacemaker refusant de démarrer des ressources : STONITH manquant',
    titleFr: 'Cluster Pacemaker refusant de démarrer des ressources : STONITH manquant',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.2',
    category: 'Pacemaker Fencing & STONITH Configuration',
    scenario: 'L\'administrateur configure une ressource d\'adresse IP virtuelle sous Pacemaker ("pcs resource create ClusterIP ocf:heartbeat:IPaddr2 ip=192.168.1.100"). La ressource reste à l\'état "Stopped" et crm_mon indique "stonith-enabled is true but no stonith resources defined".',
    scenarioFr: 'L\'administrateur configure une ressource d\'adresse IP virtuelle sous Pacemaker ("pcs resource create ClusterIP ocf:heartbeat:IPaddr2 ip=192.168.1.100"). La ressource reste à l\'état "Stopped" et crm_mon indique "stonith-enabled is true but no stonith resources defined".',
    codeSnippet: `# pcs status
Cluster Summary:
  * Current DC: node1 - partition with quorum
  * 2 nodes configured
  * 1 resource instance configured

Node List:
  * Online: [ node1 node2 ]

Full List of Resources:
  * ClusterIP   (ocf::heartbeat:IPaddr2):       Stopped
WARNING: stonith-enabled is active but no fence agents are configured!`,
    language: 'bash',
    bugDescription: 'Par défaut, Pacemaker active la protection STONITH (stonith-enabled=true) et refuse catégoriquement de démarrer la moindre ressource tant qu\'aucun agent de clôture (fence agent IPMI, iLO, fence_kdump...) n\'est configuré.',
    bugDescriptionFr: 'Par défaut, Pacemaker active la protection STONITH (stonith-enabled=true) et refuse catégoriquement de démarrer la moindre ressource tant qu\'aucun agent de clôture (fence agent IPMI, iLO, fence_kdump...) n\'est configuré.',
    options: [
      {
        id: 'opt-1',
        label: 'Par sécurité, Pacemaker refuse de démarrer les ressources tant qu\'un agent STONITH (fencing) n\'est pas créé, ou si stonith-enabled n\'est pas désactivé (uniquement pour maquette)',
        labelFr: 'Par sécurité, Pacemaker refuse de démarrer les ressources tant qu\'un agent STONITH (fencing) n\'est pas créé, ou si stonith-enabled n\'est pas désactivé (uniquement pour maquette)',
        isCorrect: true,
        explanation: 'STONITH (Shoot The Other Node In The Head) est la pierre angulaire de Pacemaker pour prévenir le split-brain. Si stonith-enabled=true et qu\'aucun équipement de coupure d\'alimentation (IPMI, PDU...) n\'est déclaré, le cluster bloque le lancement des ressources.',
        explanationFr: 'STONITH (Shoot The Other Node In The Head) est la pierre angulaire de Pacemaker pour prévenir le split-brain. Si stonith-enabled=true et qu\'aucun équipement de coupure d\'alimentation (IPMI, PDU...) n\'est déclaré, le cluster bloque le lancement des ressources.'
      },
      {
        id: 'opt-2',
        label: 'IPaddr2 est un agent obsolète qui a été remplacé par netifd',
        labelFr: 'IPaddr2 est un agent obsolète qui a été remplacé par netifd',
        isCorrect: false,
        explanation: 'IPaddr2 est le standard de référence OCF pour gérer les adresses IP virtuelles.',
        explanationFr: 'IPaddr2 est le standard de référence OCF pour gérer les adresses IP virtuelles.'
      },
      {
        id: 'opt-3',
        label: 'L\'adresse IP virtuelle doit obligatoirement être une adresse IPv6 publique',
        labelFr: 'L\'adresse IP virtuelle doit obligatoirement être une adresse IPv6 publique',
        isCorrect: false,
        explanation: 'IPaddr2 supporte aussi bien IPv4 qu\'IPv6.',
        explanationFr: 'IPaddr2 supporte aussi bien IPv4 qu\'IPv6.'
      },
      {
        id: 'opt-4',
        label: 'Le démon corosync doit être arrêté pour que Pacemaker prenne le relais',
        labelFr: 'Le démon corosync doit être arrêté pour que Pacemaker prenne le relais',
        isCorrect: false,
        explanation: 'Pacemaker ne peut pas fonctionner sans Corosync.',
        explanationFr: 'Pacemaker ne peut pas fonctionner sans Corosync.'
      }
    ],
    correctedSnippet: `# En production : configurer un vrai agent de fencing (ex: IPMI) :
pcs stonith create fence_node1 fence_ipmilan pcmk_host_list="node1" ip="10.0.0.11" user="admin" password="pwd"
# Ou temporairement en maquette/laboratoire de test :
pcs property set stonith-enabled=false`,
    fixExplanation: 'Configurer un agent de fencing (stonith) valide ou désactiver temporairement la propriété pour un lab de test.',
    fixExplanationFr: 'Configurer un agent de fencing (stonith) valide ou désactiver temporairement la propriété pour un lab de test.'
  },
  {
    id: 'tb-lpic3-306-04',
    title: 'Keepalived : Conflit de VIP et état split-brain VRRP (même Virtual Router ID)',
    titleFr: 'Keepalived : Conflit de VIP et état split-brain VRRP (même Virtual Router ID)',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.2',
    category: 'Keepalived & VRRP High Availability',
    scenario: 'Sur un réseau d\'entreprise, les deux serveurs Keepalived master et backup s\'attribuent tous les deux l\'adresse IP virtuelle 10.0.0.254 en même temps (état MASTER concurrent), provoquant des battements ARP et des coupures réseau permanentes.',
    scenarioFr: 'Sur un réseau d\'entreprise, les deux serveurs Keepalived master et backup s\'attribuent tous les deux l\'adresse IP virtuelle 10.0.0.254 en même temps (état MASTER concurrent), provoquant des battements ARP et des coupures réseau permanentes.',
    codeSnippet: `# journalctl -u keepalived (sur BACKUP) :
Keepalived_vrrp[1420]: (VI_1) Entering MASTER STATE
Keepalived_vrrp[1420]: (VI_1) setting VIPs.
Keepalived_vrrp[1420]: (VI_1) Sending gratuitous ARP for 10.0.0.254

# tcpdump -i eth0 vrrp -nn
# Aucun paquet VRRP reçu sur le port multicast 224.0.0.18 (pare-feu bloque le protocole IP 112)`,
    language: 'bash',
    bugDescription: 'Le pare-feu local (iptables / nftables) bloque les paquets de protocole VRRP (protocole IP 112 / multicast 224.0.0.18). Le nœud BACKUP ne recevant plus les annonces du MASTER conclut que le MASTER est mort et s\'active également.',
    bugDescriptionFr: 'Le pare-feu local (iptables / nftables) bloque les paquets de protocole VRRP (protocole IP 112 / multicast 224.0.0.18). Le nœud BACKUP ne recevant plus les annonces du MASTER conclut que le MASTER est mort et s\'active également.',
    options: [
      {
        id: 'opt-1',
        label: 'Le pare-feu bloque le protocole IP 112 (VRRP) ou l\'adresse multicast 224.0.0.18, empêchant le serveur BACKUP d\'entendre les messages de présence (heartbeats) du MASTER',
        labelFr: 'Le pare-feu bloque le protocole IP 112 (VRRP) ou l\'adresse multicast 224.0.0.18, empêchant le serveur BACKUP d\'entendre les messages de présence (heartbeats) du MASTER',
        isCorrect: true,
        explanation: 'VRRP n\'utilise ni TCP ni UDP, mais directement le protocole de couche réseau IP 112 avec l\'adresse multicast 224.0.0.18. Si un pare-feu bloque ce flux, le backup pense que le master est hors ligne et prend le relais, provoquant un split-brain d\'adresse IP.',
        explanationFr: 'VRRP n\'utilise ni TCP ni UDP, mais directement le protocole de couche réseau IP 112 avec l\'adresse multicast 224.0.0.18. Si un pare-feu bloque ce flux, le backup pense que le master est hors ligne et prend le relais, provoquant un split-brain d\'adresse IP.'
      },
      {
        id: 'opt-2',
        label: 'VRRP ne fonctionne que si les deux serveurs ont la même priorité (priority 100)',
        labelFr: 'VRRP ne fonctionne que si les deux serveurs ont la même priorité (priority 100)',
        isCorrect: false,
        explanation: 'Au contraire, les priorités doivent être distinctes (ex: 101 pour MASTER, 100 pour BACKUP).',
        explanationFr: 'Au contraire, les priorités doivent être distinctes (ex: 101 pour MASTER, 100 pour BACKUP).'
      },
      {
        id: 'opt-3',
        label: 'L\'adresse IP virtuelle ne peut pas se terminer par .254',
        labelFr: 'L\'adresse IP virtuelle ne peut pas se terminer par .254',
        isCorrect: false,
        explanation: 'Toute adresse IP d\'hôte valide dans le sous-réseau peut faire office de VIP.',
        explanationFr: 'Toute adresse IP d\'hôte valide dans le sous-réseau peut faire office de VIP.'
      },
      {
        id: 'opt-4',
        label: 'Keepalived requiert obligatoirement un serveur DNS Bind9 sur localhost',
        labelFr: 'Keepalived requiert obligatoirement un serveur DNS Bind9 sur localhost',
        isCorrect: false,
        explanation: 'Keepalived utilise des adresses IP directes et n\'a pas besoin de Bind9.',
        explanationFr: 'Keepalived requiert obligatoirement un serveur DNS Bind9 sur localhost.'
      }
    ],
    correctedSnippet: `# Autoriser le protocole VRRP (IP 112) sur les deux serveurs :
iptables -I INPUT -p vrrp -j ACCEPT
# Ou avec firewalld :
firewall-cmd --add-protocol=vrrp --permanent
firewall-cmd --reload`,
    fixExplanation: 'Autoriser le protocole VRRP (IP protocol 112) dans le pare-feu des deux membres du cluster.',
    fixExplanationFr: 'Autoriser le protocole VRRP (IP protocol 112) dans le pare-feu des deux membres du cluster.'
  },
  {
    id: 'tb-lpic3-306-05',
    title: 'Cluster Ceph en statut HEALTH_WARN : Placement Groups dégradés (undersized/degraded)',
    titleFr: 'Cluster Ceph en statut HEALTH_WARN : Placement Groups dégradés (undersized/degraded)',
    certification: 'lpic-3',
    topicNumber: 363,
    objectiveId: '363.1',
    category: 'Ceph Storage Cluster Health & OSD Management',
    scenario: 'Suite à l\'extinction d\'un disque ou serveur OSD, la commande "ceph health detail" affiche "HEALTH_WARN 1 pgs degraded; 1 pgs undersized; Degraded data redundancy: 120/360 objects degraded".',
    scenarioFr: 'Suite à l\'extinction d\'un disque ou serveur OSD, la commande "ceph health detail" affiche "HEALTH_WARN 1 pgs degraded; 1 pgs undersized; Degraded data redundancy: 120/360 objects degraded".',
    codeSnippet: `# ceph -s
  cluster:
    id:     a7f64249-bb28-4e8c-8824-3f1130c2e398
    health: HEALTH_WARN
            1 pgs degraded
            1 pgs undersized

  services:
    mon: 3 daemons, quorum mon1,mon2,mon3
    mgr: mgr1(active)
    osd: 6 osds: 5 up, 5 in; 1 down

# ceph osd tree
ID  CLASS WEIGHT  TYPE NAME      STATUS REWEIGHT PRI-AFF
-1        5.45758 root default
-3        1.81919     host osd1
 0   hdd  1.81919         osd.0      up  1.00000 1.00000
-5        1.81919     host osd2
 1   hdd  1.81919         osd.1      up  1.00000 1.00000
-7        1.81919     host osd3
 2   hdd  1.81919         osd.2    down        0 1.00000`,
    language: 'bash',
    bugDescription: 'L\'OSD numéro 2 est à l\'état "down" (processus arrêté ou panne matérielle), réduisant le nombre de répliques disponibles en dessous du niveau de réplication requis par le pool (size: 3).',
    bugDescriptionFr: 'L\'OSD numéro 2 est à l\'état "down" (processus arrêté ou panne matérielle), réduisant le nombre de répliques disponibles en dessous du niveau de réplication requis par le pool (size: 3).',
    options: [
      {
        id: 'opt-1',
        label: 'L\'OSD.2 est hors-ligne ("down"), ce qui empêche le cluster d\'assurer la réplication complète des objets des PG concernés ; il faut dépanner et redémarrer le démon osd.2',
        labelFr: 'L\'OSD.2 est hors-ligne ("down"), ce qui empêche le cluster d\'assurer la réplication complète des objets des PG concernés ; il faut dépanner et redémarrer le démon osd.2',
        isCorrect: true,
        explanation: 'En Ceph, un PG est "undersized" quand il a moins de copies actives que le nombre de réplicas configuré dans le pool. Il est "degraded" quand certains objets n\'ont pas le nombre requis de copies. Le redémarrage ou le remplacement de l\'OSD défaillant rétablit la réplication.',
        explanationFr: 'En Ceph, un PG est "undersized" quand il a moins de copies actives que le nombre de réplicas configuré dans le pool. Il est "degraded" quand certains objets n\'ont pas le nombre requis de copies. Le redémarrage ou le remplacement de l\'OSD défaillant rétablit la réplication.'
      },
      {
        id: 'opt-2',
        label: 'Ceph exige obligatoirement au moins 100 disques durs pour fonctionner',
        labelFr: 'Ceph exige obligatoirement au moins 100 disques durs pour fonctionner',
        isCorrect: false,
        explanation: 'Ceph peut fonctionner avec seulement 3 disques pour un pool replica 3.',
        explanationFr: 'Ceph exige obligatoirement au moins 100 disques durs pour fonctionner.'
      },
      {
        id: 'opt-3',
        label: 'Les MONs doivent être arrêtés puis réinitialisés avec ceph-mon --mkfs',
        labelFr: 'Les MONs doivent être arrêtés puis réinitialisés avec ceph-mon --mkfs',
        isCorrect: false,
        explanation: 'Le quorum des MONs est parfait (mon1, mon2, mon3); l\'incident se situe au niveau OSD.',
        explanationFr: 'Le quorum des MONs est parfait (mon1, mon2, mon3); l\'incident se situe au niveau OSD.'
      },
      {
        id: 'opt-4',
        label: 'HEALTH_WARN est un état normal et ne nécessite aucune intervention',
        labelFr: 'HEALTH_WARN est un état normal et ne nécessite aucune intervention',
        isCorrect: false,
        explanation: 'HEALTH_WARN indique une vulnérabilité ou une dégradation du cluster de stockage.',
        explanationFr: 'HEALTH_WARN indique une vulnérabilité ou une dégradation du cluster de stockage.'
      }
    ],
    correctedSnippet: `# Sur l'hôte osd3 :
systemctl restart ceph-osd@2
# Si le disque est HS, le retirer proprement :
ceph osd out 2
ceph osd purge 2 --yes-i-really-mean-it`,
    fixExplanation: 'Redémarrer le démon ceph-osd@2 ou purger et remplacer l\'OSD défaillant.',
    fixExplanationFr: 'Redémarrer le démon ceph-osd@2 ou purger et remplacer l\'OSD défaillant.'
  },
  {
    id: 'tb-lpic3-306-06',
    title: 'HAProxy : Panne 503 Service Unavailable par saturation de connexions (maxconn)',
    titleFr: 'HAProxy : Panne 503 Service Unavailable par saturation de connexions (maxconn)',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.1',
    category: 'HAProxy Load Balancing & Performance Tuning',
    scenario: 'Sous forte charge, les requêtes HTTP adressées au répartiteur HAProxy reçoivent brutalement des erreurs "503 Service Unavailable : No server is available to handle this request", alors que les serveurs backend sont tous en bonne santé.',
    scenarioFr: 'Sous forte charge, les requêtes HTTP adressées au répartiteur HAProxy reçoivent brutalement des erreurs "503 Service Unavailable : No server is available to handle this request", alors que les serveurs backend sont tous en bonne santé.',
    codeSnippet: `global
    maxconn 2048

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend web-in
    bind *:80
    maxconn 100
    default_backend web-backends

backend web-backends
    server srv1 10.0.1.10:80 check maxconn 50
    server srv2 10.0.1.11:80 check maxconn 50`,
    language: 'config',
    bugDescription: 'La directive "maxconn" dans le bloc frontend (100) et backend (50 par serveur = 100 total) est trop restrictive et sature immédiatement lors d\'un pic de trafic.',
    bugDescriptionFr: 'La directive "maxconn" dans le bloc frontend (100) et backend (50 par serveur = 100 total) est trop restrictive et sature immédiatement lors d\'un pic de trafic.',
    options: [
      {
        id: 'opt-1',
        label: 'La limite maxconn dans la section frontend (100) et sur les serveurs backend (50) est trop basse ; les connexions supplémentaires sont rejetées avec le code HTTP 503',
        labelFr: 'La limite maxconn dans la section frontend (100) et sur les serveurs backend (50) est trop basse ; les connexions supplémentaires sont rejetées avec le code HTTP 503',
        isCorrect: true,
        explanation: 'Quand maxconn est atteint sur un serveur backend sans file d\'attente suffisante (maxqueue), HAProxy ne peut plus router de nouvelle requête et renvoie immédiatement un code 503. Il faut augmenter maxconn.',
        explanationFr: 'Quand maxconn est atteint sur un serveur backend sans file d\'attente suffisante (maxqueue), HAProxy ne peut plus router de nouvelle requête et renvoie immédiatement un code 503. Il faut augmenter maxconn.'
      },
      {
        id: 'opt-2',
        label: 'HAProxy interdit le mode "http" et exige impérativement le mode "tcp"',
        labelFr: 'HAProxy interdit le mode "http" et exige impérativement le mode "tcp"',
        isCorrect: false,
        explanation: 'mode http est le mode natif de traitement de couche 7 de HAProxy.',
        explanationFr: 'mode http est le mode natif de traitement de couche 7 de HAProxy.'
      },
      {
        id: 'opt-3',
        label: 'timeout server doit être égal à timeout connect',
        labelFr: 'timeout server doit être égal à timeout connect',
        isCorrect: false,
        explanation: 'Les timeouts client, connect et server ont des rôles distincts et des durées couramment différentes.',
        explanationFr: 'Les timeouts client, connect et server ont des rôles distincts et des durées couramment différentes.'
      },
      {
        id: 'opt-4',
        label: 'Le mot-clé check ne fonctionne que si un certificat SSL est installé',
        labelFr: 'Le mot-clé check ne fonctionne que si un certificat SSL est installé',
        isCorrect: false,
        explanation: 'check effectue un simple health check TCP ou HTTP.',
        explanationFr: 'check effectue un simple health check TCP ou HTTP.'
      }
    ],
    correctedSnippet: `frontend web-in
    bind *:80
    maxconn 10000
    default_backend web-backends

backend web-backends
    balance roundrobin
    server srv1 10.0.1.10:80 check maxconn 5000
    server srv2 10.0.1.11:80 check maxconn 5000`,
    fixExplanation: 'Augmenter le paramètre maxconn sur le frontend et les serveurs backend pour absorber la charge.',
    fixExplanationFr: 'Augmenter le paramètre maxconn sur le frontend et les serveurs backend pour absorber la charge.'
  },
  {
    id: 'tb-lpic3-306-07',
    title: 'Contraintes d\'ordre et de colocation Pacemaker inversées ou contradictoires',
    titleFr: 'Contraintes d\'ordre et de colocation Pacemaker inversées ou contradictoires',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.2',
    category: 'Pacemaker Resource Constraints (Colocation & Order)',
    scenario: 'L\'administrateur souhaite qu\'une base de données PostgreSQL démarre toujours sur le même serveur que le système de fichiers partagé et seulement après que celui-ci soit monté. Pourtant, PostgreSQL tente de démarrer avant le montage du système de fichiers et échoue.',
    scenarioFr: 'L\'administrateur souhaite qu\'une base de données PostgreSQL démarre toujours sur le même serveur que le système de fichiers partagé et seulement après que celui-ci soit monté. Pourtant, PostgreSQL tente de démarrer avant le montage du système de fichiers et échoue.',
    codeSnippet: `# Configuration actuelle des contraintes :
pcs constraint order start pgsql-res then fs-res
pcs constraint colocation add pgsql-res with fs-res score=-INFINITY`,
    language: 'bash',
    bugDescription: 'L\'ordre de démarrage est inversé (pgsql-res démarre avant fs-res) et le score de colocation est négatif (-INFINITY), ce qui interdit aux deux ressources de tourner sur le même nœud !',
    bugDescriptionFr: 'L\'ordre de démarrage est inversé (pgsql-res démarre avant fs-res) et le score de colocation est négatif (-INFINITY), ce qui interdit aux deux ressources de tourner sur le même nœud !',
    options: [
      {
        id: 'opt-1',
        label: 'L\'ordre est inversé ("start pgsql-res then fs-res") et le score de colocation "-INFINITY" empêche formellement la colocation au lieu de la forcer (+INFINITY)',
        labelFr: 'L\'ordre est inversé ("start pgsql-res then fs-res") et le score de colocation "-INFINITY" empêche formellement la colocation au lieu de la forcer (+INFINITY)',
        isCorrect: true,
        explanation: 'Pour qu\'une ressource B démarre après A sur le même nœud : il faut "order start A then B" et "colocation add B with A score=INFINITY". Un score négatif (-INFINITY) force l\'antagonisme strict (anti-affinité).',
        explanationFr: 'Pour qu\'une ressource B démarre après A sur le même nœud : il faut "order start A then B" et "colocation add B with A score=INFINITY". Un score négatif (-INFINITY) force l\'antagonisme strict (anti-affinité).'
      },
      {
        id: 'opt-2',
        label: 'Pacemaker ne permet pas de gérer plus d\'une ressource par nœud',
        labelFr: 'Pacemaker ne permet pas de gérer plus d\'une ressource par nœud',
        isCorrect: false,
        explanation: 'Pacemaker peut orchestrer des centaines de ressources interconnectées par nœud.',
        explanationFr: 'Pacemaker ne peut pas gérer plus d\'une ressource par nœud.'
      },
      {
        id: 'opt-3',
        label: 'Le mot-clé INFINITY doit obligatoirement être écrit en minuscules',
        labelFr: 'Le mot-clé INFINITY doit obligatoirement être écrit en minuscules',
        isCorrect: false,
        explanation: 'INFINITY est insensible à la casse dans pcs.',
        explanationFr: 'INFINITY est insensible à la casse dans pcs.'
      },
      {
        id: 'opt-4',
        label: 'Les contraintes doivent être enregistrées directement dans /etc/fstab',
        labelFr: 'Les contraintes doivent être enregistrées directement dans /etc/fstab',
        isCorrect: false,
        explanation: 'Les contraintes de cluster sont enregistrées dans le CIB Pacemaker via la commande pcs.',
        explanationFr: 'Les contraintes de cluster sont enregistrées dans le CIB Pacemaker via la commande pcs.'
      }
    ],
    correctedSnippet: `# Supprimer les anciennes contraintes erronées puis appliquer :
pcs constraint order start fs-res then pgsql-res
pcs constraint colocation add pgsql-res with fs-res score=INFINITY`,
    fixExplanation: 'Corriger l\'ordre (fs-res avant pgsql-res) et fixer le score de colocation à +INFINITY.',
    fixExplanationFr: 'Corriger l\'ordre (fs-res avant pgsql-res) et fixer le score de colocation à +INFINITY.'
  },
  {
    id: 'tb-lpic3-306-08',
    title: 'Échec de montage système de fichiers en cluster GFS2 : démon DLM arrêté',
    titleFr: 'Échec de montage système de fichiers en cluster GFS2 : démon DLM arrêté',
    certification: 'lpic-3',
    topicNumber: 362,
    objectiveId: '362.2',
    category: 'GFS2 Clustered File System & Distributed Lock Manager (DLM)',
    scenario: 'L\'administrateur tente de monter un système de fichiers partagé SAN formaté en GFS2 : "mount -t gfs2 /dev/sdb1 /mnt/cluster_storage". La commande freeze ou échoue avec "mount.gfs2: error mounting /dev/sdb1 on /mnt/cluster_storage: Transport endpoint is not connected".',
    scenarioFr: 'L\'administrateur tente de monter un système de fichiers partagé SAN formaté en GFS2 : "mount -t gfs2 /dev/sdb1 /mnt/cluster_storage". La commande freeze ou échoue avec "mount.gfs2: error mounting /dev/sdb1 on /mnt/cluster_storage: Transport endpoint is not connected".',
    codeSnippet: `# systemctl status dlm
● dlm.service - Distributed Lock Manager
   Loaded: loaded
   Active: inactive (dead)

# dmesg | tail -n 5
GFS2: fsid=mycluster:gfs2_share.0: Trying to join cluster "lock_dlm", "mycluster:gfs2_share"
GFS2: fsid=mycluster:gfs2_share.0: can't connect to dlm: -107`,
    language: 'bash',
    bugDescription: 'GFS2 utilise la table de verrous distribués "lock_dlm" qui exige que le service du gestionnaire de verrous noyau DLM (dlm.service) soit actif sur tous les nœuds du cluster.',
    bugDescriptionFr: 'GFS2 utilise la table de verrous distribués "lock_dlm" qui exige que le service du gestionnaire de verrous noyau DLM (dlm.service) soit actif sur tous les nœuds du cluster.',
    options: [
      {
        id: 'opt-1',
        label: 'Le démon DLM (Distributed Lock Manager) est inactif ; GFS2 ne peut pas synchroniser les verrous d\'écriture concurrents sans DLM et refuse le montage',
        labelFr: 'Le démon DLM (Distributed Lock Manager) est inactif ; GFS2 ne peut pas synchroniser les verrous d\'écriture concurrents sans DLM et refuse le montage',
        isCorrect: true,
        explanation: 'Les systèmes de fichiers en cluster partagés (comme GFS2 ou OCFS2) reposent sur un gestionnaire de verrous distribué (DLM) pour coordonner les accès concurrents au disque SAN. Si dlm n\'est pas lancé, GFS2 ne peut pas monter le volume.',
        explanationFr: 'Les systèmes de fichiers en cluster partagés (comme GFS2 ou OCFS2) reposent sur un gestionnaire de verrous distribué (DLM) pour coordonner les accès concurrents au fichier bloc SAN. Si dlm n\'est pas lancé, GFS2 ne peut pas monter le volume.'
      },
      {
        id: 'opt-2',
        label: 'GFS2 a été remplacé par NTFS dans les spécifications Linux',
        labelFr: 'GFS2 a été remplacé par NTFS dans les spécifications Linux',
        isCorrect: false,
        explanation: 'NTFS n\'est pas un système de fichiers cluster multi-écrivains.',
        explanationFr: 'NTFS n\'est pas un système de fichiers cluster multi-écrivains.'
      },
      {
        id: 'opt-3',
        label: 'mount -t gfs2 ne supporte pas les périphériques SCSI /dev/sdX',
        labelFr: 'mount -t gfs2 ne supporte pas les périphériques SCSI /dev/sdX',
        isCorrect: false,
        explanation: 'GFS2 est conçu spécifiquement pour être déployé sur des LUNs SAN FC/iSCSI exposées sous /dev/sdX ou multipath.',
        explanationFr: 'GFS2 est conçu spécifiquement pour être déployé sur des LUNs SAN FC/iSCSI exposées sous /dev/sdX ou multipath.'
      },
      {
        id: 'opt-4',
        label: 'Il faut désactiver SELinux et AppArmor avec setenforce 0',
        labelFr: 'Il faut désactiver SELinux et AppArmor avec setenforce 0',
        isCorrect: false,
        explanation: 'L\'erreur (-107) est explicitement causée par l\'absence de communication avec le socket DLM.',
        explanationFr: 'L\'erreur (-107) est explicitement causée par l\'absence de communication avec le socket DLM.'
      }
    ],
    correctedSnippet: `systemctl start dlm
systemctl enable dlm
mount -t gfs2 /dev/sdb1 /mnt/cluster_storage`,
    fixExplanation: 'Démarrer et activer le service dlm ("systemctl start dlm") avant de monter le système de fichiers GFS2.',
    fixExplanationFr: 'Démarrer et activer le service dlm ("systemctl start dlm") avant de monter le système de fichiers GFS2.'
  },
  {
    id: 'tb-lpic3-306-09',
    title: 'Volume GlusterFS dégradé avec brique (brick) hors-ligne',
    titleFr: 'Volume GlusterFS dégradé avec brique (brick) hors-ligne',
    certification: 'lpic-3',
    topicNumber: 363,
    objectiveId: '363.2',
    category: 'GlusterFS Distributed Storage & Self-Heal',
    scenario: 'Un volume GlusterFS répliqué à 3 copies (replica 3) présente des lenteurs et des alertes de cohérence. La commande "gluster volume status gv0" montre qu\'une brique sur l\'un des nœuds est marquée hors service (Online: N).',
    scenarioFr: 'Un volume GlusterFS répliqué à 3 copies (replica 3) présente des lenteurs et des alertes de cohérence. La commande "gluster volume status gv0" montre qu\'une brique sur l\'un des nœuds est marquée hors service (Online: N).',
    codeSnippet: `# gluster volume status gv0
Status of volume: gv0
Gluster process                             TCP Port  RDMA Port  Online  Pid
------------------------------------------------------------------------------
Brick node1:/data/brick1/gv0                49152     0          Y       1234
Brick node2:/data/brick1/gv0                49152     0          Y       1235
Brick node3:/data/brick1/gv0                N/A       N/A        N       N/A

# gluster volume heal gv0 info
Brick node3:/data/brick1/gv0
Status: Transport endpoint is not connected`,
    language: 'bash',
    bugDescription: 'Le processus de brique glusterfsd sur node3 est planté ou le système de fichiers sous-jacent /data/brick1 n\'est pas monté, coupant une des répliques du volume.',
    bugDescriptionFr: 'Le processus de brique glusterfsd sur node3 est planté ou le système de fichiers sous-jacent /data/brick1 n\'est pas monté, coupant une des répliques du volume.',
    options: [
      {
        id: 'opt-1',
        label: 'Le processus daemon de brique sur node3 est arrêté ou son disque local est démonté ; il faut le relancer puis déclencher un "gluster volume heal gv0"',
        labelFr: 'Le processus daemon de brique sur node3 est arrêté ou son disque local est démonté ; il faut le relancer puis déclencher un "gluster volume heal gv0"',
        isCorrect: true,
        explanation: 'Dans GlusterFS, chaque brique est servie par un processus glusterfsd. Quand la brique redevient disponible (Online: Y), le mécanisme d\'auto-guérison (self-heal) resynchronise automatiquement les fichiers modifiés pendant la panne.',
        explanationFr: 'Dans GlusterFS, chaque brique est servie par un processus glusterfsd. Quand la brique redevient disponible (Online: Y), le mécanisme d\'auto-guérison (self-heal) resynchronise automatiquement les fichiers modifiés pendant la panne.'
      },
      {
        id: 'opt-2',
        label: 'GlusterFS ne supporte pas les volumes répliqués à 3 nœuds',
        labelFr: 'GlusterFS ne supporte pas les volumes répliqués à 3 nœuds',
        isCorrect: false,
        explanation: 'Replica 3 avec arbiter est la recommandation officielle pour éliminer le split-brain.',
        explanationFr: 'Replica 3 avec arbiter est la recommandation officielle pour éliminer le split-brain.'
      },
      {
        id: 'opt-3',
        label: 'Il faut supprimer le volume avec gluster volume delete gv0',
        labelFr: 'Il faut supprimer le volume avec gluster volume delete gv0',
        isCorrect: false,
        explanation: 'Supprimer le volume détruirait le stockage partagé de l\'entreprise.',
        explanationFr: 'Supprimer le volume détruirait le stockage partagé de l\'entreprise.'
      },
      {
        id: 'opt-4',
        label: 'Le port TCP 49152 est réservé au protocole FTP passif',
        labelFr: 'Le port TCP 49152 est réservé au protocole FTP passif',
        isCorrect: false,
        explanation: 'GlusterFS utilise la plage dynamique 49152+ pour ses bricks.',
        explanationFr: 'GlusterFS utilise la plage dynamique 49152+ pour ses bricks.'
      }
    ],
    correctedSnippet: `# Sur node3, vérifier et relancer le démon / monter la brique :
systemctl restart glusterd
gluster volume start gv0 force
gluster volume heal gv0`,
    fixExplanation: 'Relancer le service glusterd sur le nœud défaillant, forcer le démarrage de la brique et lancer un self-heal.',
    fixExplanationFr: 'Relancer le service glusterd sur le nœud défaillant, forcer le démarrage de la brique et lancer un self-heal.'
  },
  {
    id: 'tb-lpic3-306-10',
    title: 'IPVS / LVS en mode Direct Routing (DR) : conflit ARP avec les réels serveurs',
    titleFr: 'IPVS / LVS en mode Direct Routing (DR) : conflit ARP avec les réels serveurs',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.3',
    category: 'IPVS / LVS Direct Routing & ARP Flux Problem',
    scenario: 'L\'administrateur met en place un répartiteur de charge IPVS / LVS en mode Direct Routing (-g). Cependant, le trafic n\'arrive plus au répartiteur car les serveurs réels (Real Servers) répondent eux-mêmes directement aux requêtes ARP pour la VIP !',
    scenarioFr: 'L\'administrateur met en place un répartiteur de charge IPVS / LVS en mode Direct Routing (-g). Cependant, le trafic n\'arrive plus au répartiteur car les serveurs réels (Real Servers) répondent eux-mêmes directement aux requêtes ARP pour la VIP !',
    codeSnippet: `# Sur le Real Server, l'adresse VIP est configurée sur l'interface loopback :
# ip addr add 192.168.1.100/32 dev lo

# Problème : le Real Server répond aux requêtes ARP du réseau local pour 192.168.1.100 !
# cat /proc/sys/net/ipv4/conf/all/arp_ignore
0
# cat /proc/sys/net/ipv4/conf/all/arp_announce
0`,
    language: 'bash',
    bugDescription: 'En mode LVS-DR, la VIP doit être configurée sur l\'interface de boucle locale (lo) des Real Servers, mais le noyau Linux répond par défaut aux annonces ARP sur toutes les interfaces physiques pour toute IP locale (problème "ARP flux").',
    bugDescriptionFr: 'En mode LVS-DR, la VIP doit être configurée sur l\'interface de boucle locale (lo) des Real Servers, mais le noyau Linux répond par défaut aux annonces ARP sur toutes les interfaces physiques pour toute IP locale (problème "ARP flux").',
    options: [
      {
        id: 'opt-1',
        label: 'Sur les Real Servers en mode LVS-DR, il faut configurer arp_ignore=1 et arp_announce=2 dans sysctl pour interdire de répondre aux requêtes ARP pour la VIP',
        labelFr: 'Sur les Real Servers en mode LVS-DR, il faut configurer arp_ignore=1 et arp_announce=2 dans sysctl pour interdire de répondre aux requêtes ARP pour la VIP',
        isCorrect: true,
        explanation: 'En mode Direct Routing (DR), seul le load balancer IPVS doit répondre aux requêtes ARP pour la VIP. Les Real Servers doivent posséder l\'adresse sur lo pour accepter les paquets entrants, mais doivent rester invisibles au niveau ARP via arp_ignore=1 et arp_announce=2.',
        explanationFr: 'En mode Direct Routing (DR), seul le load balancer IPVS doit répondre aux requêtes ARP pour la VIP. Les Real Servers doivent posséder l\'adresse sur lo pour accepter les paquets entrants, mais doivent rester invisibles au niveau ARP via arp_ignore=1 et arp_announce=2.'
      },
      {
        id: 'opt-2',
        label: 'LVS-DR ne fonctionne que si la VIP est routée via le protocole BGP',
        labelFr: 'LVS-DR ne fonctionne que si la VIP est routée via le protocole BGP',
        isCorrect: false,
        explanation: 'LVS-DR fonctionne directement au niveau Ethernet couche 2 (MAC rewriting).',
        explanationFr: 'LVS-DR fonctionne directement au niveau Ethernet couche 2 (MAC rewriting).'
      },
      {
        id: 'opt-3',
        label: 'arp_ignore=0 est la valeur obligatoire imposée par l\'IETF',
        labelFr: 'arp_ignore=0 est la valeur obligatoire imposée par l\'IETF',
        isCorrect: false,
        explanation: '0 est juste le comportement par défaut de l\'implémentation Linux historique.',
        explanationFr: '0 est juste le comportement par défaut de l\'implémentation Linux historique.'
      },
      {
        id: 'opt-4',
        label: 'Il faut désactiver l\'interface loopback "lo" sur tous les Real Servers',
        labelFr: 'Il faut désactiver l\'interface loopback "lo" sur tous les Real Servers',
        isCorrect: false,
        explanation: 'Désactiver la loopback casserait les communications internes du système.',
        explanationFr: 'Désactiver la loopback casserait les communications internes du système.'
      }
    ],
    correctedSnippet: `# Sur chaque Real Server :
sysctl -w net.ipv4.conf.all.arp_ignore=1
sysctl -w net.ipv4.conf.all.arp_announce=2
sysctl -w net.ipv4.conf.lo.arp_ignore=1
sysctl -w net.ipv4.conf.lo.arp_announce=2`,
    fixExplanation: 'Régler arp_ignore à 1 et arp_announce à 2 dans sysctl sur les Real Servers pour supprimer les réponses ARP parasites.',
    fixExplanationFr: 'Régler arp_ignore à 1 et arp_announce à 2 dans sysctl sur les Real Servers pour supprimer les réponses ARP parasites.'
  },
  {
    id: 'tb-lpic3-306-11',
    title: 'Failover infini de ressource Pacemaker par compteur d\'échecs non nettoyé',
    titleFr: 'Failover infini de ressource Pacemaker par compteur d\'échecs non nettoyé',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.2',
    category: 'Pacemaker Failcount & Resource Cleanup',
    scenario: 'Une ressource de service Apache sous Pacemaker a subi un échec temporaire. Le bug applicatif a été corrigé, mais Pacemaker refuse obstinément de relancer Apache sur le nœud principal avec le message "migration-threshold exceeded".',
    scenarioFr: 'Une ressource de service Apache sous Pacemaker a subi un échec temporaire. Le bug applicatif a été corrigé, mais Pacemaker refuse obstinément de relancer Apache sur le nœud principal avec le message "migration-threshold exceeded".',
    codeSnippet: `# pcs status
Failed Resource Actions:
  * apache_start_0 on node1 'error' (1): call=25, status='complete', exitreason='Configuration syntax error', last-rc-change='Wed May 10 09:12:00 2026'

Full List of Resources:
  * apache      (systemd:apache2):      Stopped (disabled)`,
    language: 'bash',
    bugDescription: 'Pacemaker enregistre les échecs dans un compteur interne (failcount). Dès que migration-threshold est atteint, le nœud est banni pour cette ressource tant que le statut d\'erreur n\'est pas nettoyé.',
    bugDescriptionFr: 'Pacemaker enregistre les échecs dans un compteur interne (failcount). Dès que migration-threshold est atteint, le nœud est banni pour cette ressource tant que le statut d\'erreur n\'est pas nettoyé.',
    options: [
      {
        id: 'opt-1',
        label: 'Pacemaker conserve l\'historique des pannes dans son compteur failcount ; il faut exécuter "pcs resource cleanup <nom>" pour réinitialiser les erreurs et autoriser le redémarrage',
        labelFr: 'Pacemaker conserve l\'historique des pannes dans son compteur failcount ; il faut exécuter "pcs resource cleanup <nom>" pour réinitialiser les erreurs et autoriser le redémarrage',
        isCorrect: true,
        explanation: 'Tant que l\'administrateur ne purge pas explicitement les traces d\'échec via "pcs resource cleanup" (ou "crm_resource --cleanup"), Pacemaker considère que le nœud est instable et refuse d\'y réaffecter la ressource.',
        explanationFr: 'Tant que l\'administrateur ne purge pas explicitement les traces d\'échec via "pcs resource cleanup" (ou "crm_resource --cleanup"), Pacemaker considère que le nœud est instable et refuse d\'y réaffecter la ressource.'
      },
      {
        id: 'opt-2',
        label: 'Il faut redémarrer tous les serveurs physiques du cluster pour vider la RAM',
        labelFr: 'Il faut redémarrer tous les serveurs physiques du cluster pour vider la RAM',
        isCorrect: false,
        explanation: 'Redémarrer le cluster n\'efface pas le CIB sauvegardé sur disque.',
        explanationFr: 'Redémarrer le cluster n\'efface pas le CIB sauvegardé sur disque.'
      },
      {
        id: 'opt-3',
        label: 'migration-threshold ne peut pas être configuré à plus de 1',
        labelFr: 'migration-threshold ne peut pas être configuré à plus de 1',
        isCorrect: false,
        explanation: 'migration-threshold peut être paramétré à n\'importe quelle valeur entière.',
        explanationFr: 'migration-threshold peut être paramétré à n\'importe quelle valeur entière.'
      },
      {
        id: 'opt-4',
        label: 'Apache ne peut pas être géré via une unité systemd dans Pacemaker',
        labelFr: 'Apache ne peut pas être géré via une unité systemd dans Pacemaker',
        isCorrect: false,
        explanation: 'Pacemaker supporte nativement les agents de ressource de type systemd:service.',
        explanationFr: 'Pacemaker supporte nativement les agents de ressource de type systemd:service.'
      }
    ],
    correctedSnippet: `pcs resource cleanup apache
pcs status`,
    fixExplanation: 'Exécuter "pcs resource cleanup apache" pour remettre à zéro le compteur d\'échecs et relancer la ressource.',
    fixExplanationFr: 'Exécuter "pcs resource cleanup apache" pour remettre à zéro le compteur d\'échecs et relancer la ressource.'
  },
  {
    id: 'tb-lpic3-306-12',
    title: 'Cluster Ceph : Placement Groups incomplets par nombre insuffisant (pg_num trop faible)',
    titleFr: 'Cluster Ceph : Placement Groups incomplets par nombre insuffisant (pg_num trop faible)',
    certification: 'lpic-3',
    topicNumber: 363,
    objectiveId: '363.1',
    category: 'Ceph Pool Placement Groups & CRUSH Tuning',
    scenario: 'Sur un cluster Ceph de 30 OSDs hébergeant 50 To de données, l\'administrateur constate des alertes "HEALTH_WARN pool default has many more objects per pg than average" et une distribution des données extrêmement inégale entre les disques durs.',
    scenarioFr: 'Sur un cluster Ceph de 30 OSDs hébergeant 50 To de données, l\'administrateur constate des alertes "HEALTH_WARN pool default has many more objects per pg than average" et une distribution des données extrêmement inégale entre les disques durs.',
    codeSnippet: `# ceph osd pool get data pg_num
pg_num: 16

# ceph health detail
HEALTH_WARN pool data has 16 placement groups, should have at least 512`,
    language: 'bash',
    bugDescription: 'Le pool contient seulement 16 PGs pour 30 OSDs, ce qui est très insuffisant pour distribuer équitablement les millions d\'objets à travers l\'algorithme CRUSH.',
    bugDescriptionFr: 'Le pool contient seulement 16 PGs pour 30 OSDs, ce qui est très insuffisant pour distribuer équitablement les millions d\'objets à travers l\'algorithme CRUSH.',
    options: [
      {
        id: 'opt-1',
        label: 'Le nombre de Placement Groups (pg_num: 16) est beaucoup trop faible pour le nombre d\'OSDs, causant un déséquilibre de stockage et de mauvaises performances ; il faut augmenter pg_num et pgp_num',
        labelFr: 'Le nombre de Placement Groups (pg_num: 16) est beaucoup trop faible pour le nombre d\'OSDs, causant un déséquilibre de stockage et de mauvaises performances ; il faut augmenter pg_num et pgp_num',
        isCorrect: true,
        explanation: 'La formule de dimensionnement Ceph recommande environ 100 PGs par OSD. Avec 30 disques en replica 3, il est conseillé d\'avoir au moins 512 ou 1024 PGs pour que CRUSH distribue la charge de façon homogène.',
        explanationFr: 'La formule de dimensionnement Ceph recommande environ 100 PGs par OSD. Avec 30 disques en replica 3, il est conseillé d\'avoir au moins 512 ou 1024 PGs pour que CRUSH distribue la charge de façon homogène.'
      },
      {
        id: 'opt-2',
        label: 'pg_num ne peut jamais être augmenté après la création d\'un pool Ceph',
        labelFr: 'pg_num ne peut jamais être augmenté après la création d\'un pool Ceph',
        isCorrect: false,
        explanation: 'pg_num s\'augmente dynamiquement à chaud avec "ceph osd pool set <pool> pg_num <N>".',
        explanationFr: 'pg_num s\'augmente dynamiquement à chaud avec "ceph osd pool set <pool> pg_num <N>".'
      },
      {
        id: 'opt-3',
        label: 'Ceph impose obligatoirement un pg_num égal à 1',
        labelFr: 'Ceph impose obligatoirement un pg_num égal à 1',
        isCorrect: false,
        explanation: 'Un pg_num de 1 concentrerait toutes les données sur un seul sous-ensemble de disques.',
        explanationFr: 'Un pg_num de 1 concentrerait toutes les données sur un seul sous-ensemble de disques.'
      },
      {
        id: 'opt-4',
        label: 'CRUSH interdit les puissances de 2 pour pg_num',
        labelFr: 'CRUSH interdit les puissances de 2 pour pg_num',
        isCorrect: false,
        explanation: 'Les puissances de deux (128, 256, 512, 1024) sont au contraire fortement recommandées.',
        explanationFr: 'Les puissances de deux (128, 256, 512, 1024) sont au contraire fortement recommandées.'
      }
    ],
    correctedSnippet: `ceph osd pool set data pg_num 512
ceph osd pool set data pgp_num 512
# Ou activer l'autoscaler :
ceph osd pool set data pg_autoscale_mode on`,
    fixExplanation: 'Augmenter pg_num et pgp_num ou activer le module pg_autoscale_mode de Ceph.',
    fixExplanationFr: 'Augmenter pg_num et pgp_num ou activer le module pg_autoscale_mode de Ceph.'
  },
  {
    id: 'tb-lpic3-306-13',
    title: 'Locking LVM en cluster (lvmlockd) défaillant causant des activations corrompues',
    titleFr: 'Locking LVM en cluster (lvmlockd) défaillant causant des activations corrompues',
    certification: 'lpic-3',
    topicNumber: 362,
    objectiveId: '362.2',
    category: 'Clustered LVM & Shared Storage Locking',
    scenario: 'Lors de l\'activation d\'un Volume Group partagé sur un SAN ("vgchange -aey vg_shared"), la commande échoue avec "Volume group vg_shared requires lvmlockd, which is not running" ou "locking type 3 is deprecated".',
    scenarioFr: 'Lors de l\'activation d\'un Volume Group partagé sur un SAN ("vgchange -aey vg_shared"), la commande échoue avec "Volume group vg_shared requires lvmlockd, which is not running" ou "locking type 3 is deprecated".',
    codeSnippet: `# lvs
  Volume group vg_shared requires lvmlockd, which is not running.
  Cannot process volume group vg_shared

# cat /etc/lvm/lvm.conf | grep locking_type
    locking_type = 1
    use_lvmlockd = 0`,
    language: 'config',
    bugDescription: 'Sur les systèmes Linux modernes, le verrouillage de VG partagé exige l\'activation de "use_lvmlockd = 1" (avec dlm ou sanlock) et l\'exécution du service démon lvmlockd.',
    bugDescriptionFr: 'Sur les systèmes Linux modernes, le verrouillage de VG partagé exige l\'activation de "use_lvmlockd = 1" (avec dlm ou sanlock) et l\'exécution du service démon lvmlockd.',
    options: [
      {
        id: 'opt-1',
        label: 'Le gestionnaire de verrous LVM pour stockage partagé lvmlockd n\'est pas activé dans lvm.conf ("use_lvmlockd = 1") et son service systemd est arrêté',
        labelFr: 'Le gestionnaire de verrous LVM pour stockage partagé lvmlockd n\'est pas activé dans lvm.conf ("use_lvmlockd = 1") et son service systemd est arrêté',
        isCorrect: true,
        explanation: 'L\'ancien démon clvmd (locking_type=3) a été remplacé par lvmlockd. Pour accéder aux volumes partagés sans risque de corruption des métadonnées LVM par accès concurrent, use_lvmlockd doit être configuré à 1 et le service lvmlockd doit tourner.',
        explanationFr: 'L\'ancien démon clvmd (locking_type=3) a été remplacé par lvmlockd. Pour accéder aux volumes partagés sans risque de corruption des métadonnées LVM par accès concurrent, use_lvmlockd doit être configuré à 1 et le service lvmlockd doit tourner.'
      },
      {
        id: 'opt-2',
        label: 'LVM ne peut pas être utilisé sur un SAN',
        labelFr: 'LVM ne peut pas être utilisé sur un SAN',
        isCorrect: false,
        explanation: 'LVM est largement utilisé sur des SAN partagés en cluster.',
        explanationFr: 'LVM est largement utilisé sur des SAN partagés en cluster.'
      },
      {
        id: 'opt-3',
        label: 'vgchange -aey doit être remplacé par vgchange -an',
        labelFr: 'vgchange -aey doit être remplacé par vgchange -an',
        isCorrect: false,
        explanation: '-an désactive le VG au lieu de l\'activer.',
        explanationFr: '-an désactive le VG au lieu de l\'activer.'
      },
      {
        id: 'opt-4',
        label: 'Le protocole iSCSI interdit la création de LVs',
        labelFr: 'Le protocole iSCSI interdit la création de LVs',
        isCorrect: false,
        explanation: 'iSCSI fournit des périphériques blocs sur lesquels LVM fonctionne nativement.',
        explanationFr: 'iSCSI fournit des périphériques blocs sur lesquels LVM fonctionne nativement.'
      }
    ],
    correctedSnippet: `# Dans /etc/lvm/lvm.conf :
global {
    use_lvmlockd = 1
}

# Démarrer le service :
systemctl enable --now lvmlockd
vgchange -aey vg_shared`,
    fixExplanation: 'Activer "use_lvmlockd = 1" dans /etc/lvm/lvm.conf et lancer le service systemd "lvmlockd".',
    fixExplanationFr: 'Activer "use_lvmlockd = 1" dans /etc/lvm/lvm.conf et lancer le service systemd "lvmlockd".'
  },
  {
    id: 'tb-lpic3-306-14',
    title: 'Script de santé Keepalived (track_script) bloqué par permissions ou chemin inexistant',
    titleFr: 'Script de santé Keepalived (track_script) bloqué par permissions ou chemin inexistant',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.2',
    category: 'Keepalived Healthchecks & Tracking Scripts',
    scenario: 'L\'administrateur utilise un script pour vérifier que Nginx répond. Si Nginx meurt, Keepalived doit céder la VIP. Cependant, même quand Nginx est éteint, Keepalived conserve la VIP et consigne : "Keepalived_vrrp: Track script check_nginx exited with status 127".',
    scenarioFr: 'L\'administrateur utilise un script pour vérifier que Nginx répond. Si Nginx meurt, Keepalived doit céder la VIP. Cependant, même quand Nginx est éteint, Keepalived conserve la VIP et consigne : "Keepalived_vrrp: Track script check_nginx exited with status 127".',
    codeSnippet: `vrrp_script chk_nginx {
    script "check_nginx.sh"
    interval 2
    weight -20
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 101
    track_script {
        chk_nginx
    }
    virtual_ipaddress {
        192.168.1.50
    }
}`,
    language: 'config',
    bugDescription: 'La directive script utilise un chemin relatif ("check_nginx.sh") introuvable par le processus au lieu d\'un chemin absolu (/usr/local/bin/check_nginx.sh), renvoyant le code 127 (Command not found).',
    bugDescriptionFr: 'La directive script utilise un chemin relatif ("check_nginx.sh") introuvable par le processus au lieu d\'un chemin absolu (/usr/local/bin/check_nginx.sh), renvoyant le code 127 (Command not found).',
    options: [
      {
        id: 'opt-1',
        label: 'La directive script doit spécifier un chemin absolu (ex: "/usr/local/bin/check_nginx.sh") avec les droits d\'exécution, sinon le shell renvoie le code d\'erreur 127',
        labelFr: 'La directive script doit spécifier un chemin absolu (ex: "/usr/local/bin/check_nginx.sh") avec les droits d\'exécution, sinon le shell renvoie le code d\'erreur 127',
        isCorrect: true,
        explanation: 'Keepalived s\'exécute dans un environnement d\'exécution restreint sans répertoire de travail garanti. Tout script de tracking VRRP doit obligatoirement être référencé avec son chemin absolu complet et les permissions d\'exécution adéquates.',
        explanationFr: 'Keepalived s\'exécute dans un environnement d\'exécution restreint sans répertoire de travail garanti. Tout script de tracking VRRP doit obligatoirement être référencé avec son chemin absolu complet et les permissions d\'exécution adéquates.'
      },
      {
        id: 'opt-2',
        label: 'weight ne peut jamais être un nombre négatif',
        labelFr: 'weight ne peut jamais être un nombre négatif',
        isCorrect: false,
        explanation: 'Un weight négatif (ex: -20) est au contraire une excellente méthode pour abaisser la priorité en cas d\'échec.',
        explanationFr: 'Un weight négatif (ex: -20) est au contraire une excellente méthode pour abaisser la priorité en cas d\'échec.'
      },
      {
        id: 'opt-3',
        label: 'track_script a été supprimé de la version 2 de Keepalived',
        labelFr: 'track_script a été supprimé de la version 2 de Keepalived',
        isCorrect: false,
        explanation: 'track_script est une fonctionnalité essentielle toujours d\'actualité.',
        explanationFr: 'track_script est une fonctionnalité essentielle toujours d\'actualité.'
      },
      {
        id: 'opt-4',
        label: 'virtual_router_id doit obligatoirement être 1',
        labelFr: 'virtual_router_id doit obligatoirement être 1',
        isCorrect: false,
        explanation: 'virtual_router_id peut prendre n\'importe quelle valeur entre 1 et 255.',
        explanationFr: 'virtual_router_id peut prendre n\'importe quelle valeur entre 1 et 255.'
      }
    ],
    correctedSnippet: `vrrp_script chk_nginx {
    script "/usr/bin/killall -0 nginx"
    interval 2
    weight -20
}`,
    fixExplanation: 'Renseigner le chemin absolu de la commande ou du script dans la directive "script".',
    fixExplanationFr: 'Renseigner le chemin absolu de la commande ou du script dans la directive "script".'
  },
  {
    id: 'tb-lpic3-306-15',
    title: 'Cluster Corosync bloqué par chiffrement knet et clé d\'authentification manquante',
    titleFr: 'Cluster Corosync bloqué par chiffrement knet et clé d\'authentification manquante',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.1',
    category: 'Corosync Cryptographic Authentication & knet',
    scenario: 'Lors de l\'ajout d\'un troisième nœud dans le cluster, le service corosync échoue au démarrage avec "PARSE ERROR: crypto_cipher is set but /etc/corosync/authkey is missing or not readable by user root with permissions 0400".',
    scenarioFr: 'Lors de l\'ajout d\'un troisième nœud dans le cluster, le service corosync échoue au démarrage avec "PARSE ERROR: crypto_cipher is set but /etc/corosync/authkey is missing or not readable by user root with permissions 0400".',
    codeSnippet: `# systemctl status corosync
corosync[2014]: [MAIN  ] Corosync Cluster Engine exiting with status 8
corosync[2014]: [MAIN  ] Can't read authkey file /etc/corosync/authkey: No such file or directory

# ls -l /etc/corosync/
-rw-r--r-- 1 root root 1200 May 10 10:00 corosync.conf`,
    language: 'bash',
    bugDescription: 'La configuration Corosync impose l\'authentification/chiffrement des paquets mais le fichier de clé partagée /etc/corosync/authkey n\'a pas été copié depuis les nœuds existants.',
    bugDescriptionFr: 'La configuration Corosync impose l\'authentification/chiffrement des paquets mais le fichier de clé partagée /etc/corosync/authkey n\'a pas été copié depuis les nœuds existants.',
    options: [
      {
        id: 'opt-1',
        label: 'Le fichier de clé cryptographique partagée /etc/corosync/authkey n\'existe pas sur le nouveau nœud ; il doit être copié depuis un nœud existant avec les permissions strictes 0400',
        labelFr: 'Le fichier de clé cryptographique partagée /etc/corosync/authkey n\'existe pas sur le nouveau nœud ; il doit être copié depuis un nœud existant avec les permissions strictes 0400',
        isCorrect: true,
        explanation: 'Corosync utilise une clé symétrique partagée (/etc/corosync/authkey) générée par corosync-keygen pour signer et authentifier les échanges réseau. Tous les membres du cluster doivent posséder exactement la même clé avec des droits 400 ou 600.',
        explanationFr: 'Corosync utilise une clé symétrique partagée (/etc/corosync/authkey) générée par corosync-keygen pour signer et authentifier les échanges réseau. Tous les membres du cluster doivent posséder exactement la même clé avec des droits 400 ou 600.'
      },
      {
        id: 'opt-2',
        label: 'La clé doit être générée avec la commande ssh-keygen -t ed25519',
        labelFr: 'La clé doit être générée avec la commande ssh-keygen -t ed25519',
        isCorrect: false,
        explanation: 'Corosync utilise sa propre clé brute générée par corosync-keygen, pas une clé SSH.',
        explanationFr: 'Corosync utilise sa propre clé brute générée par corosync-keygen, pas une clé SSH.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier authkey doit avoir les permissions 0777 pour être accessible',
        labelFr: 'Le fichier authkey doit avoir les permissions 0777 pour être accessible',
        isCorrect: false,
        explanation: 'Corosync refuse formellement de démarrer si le fichier de clé est accessible en écriture par d\'autres utilisateurs.',
        explanationFr: 'Corosync refuse formellement de démarrer si le fichier de clé est accessible en écriture par d\'autres utilisateurs.'
      },
      {
        id: 'opt-4',
        label: 'crypto_cipher est interdit avec le protocole knet',
        labelFr: 'crypto_cipher est interdit avec le protocole knet',
        isCorrect: false,
        explanation: 'knet intègre pleinement le chiffrement et l\'authentification cryptographique.',
        explanationFr: 'knet intègre pleinement le chiffrement et l\'authentification cryptographique.'
      }
    ],
    correctedSnippet: `# Sur un nœud fonctionnel existant :
# scp /etc/corosync/authkey root@node3:/etc/corosync/
# Sur node3 :
chmod 400 /etc/corosync/authkey
chown root:root /etc/corosync/authkey
systemctl start corosync`,
    fixExplanation: 'Transférer le fichier authkey existant sur le nœud et lui assigner les permissions 0400.',
    fixExplanationFr: 'Transférer le fichier authkey existant sur le nœud et lui assigner les permissions 0400.'
  },
  {
    id: 'tb-lpic3-306-16',
    title: 'HAProxy : Perte de persistance de session (stick-table / cookies manquants)',
    titleFr: 'HAProxy : Perte de persistance de session (stick-table / cookies manquants)',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.1',
    category: 'HAProxy Session Persistence & Sticky Sessions',
    scenario: 'Les utilisateurs d\'une application web e-commerce se plaignent d\'être déconnectés à chaque clic et de voir leur panier se vider aléatoirement lors du passage derrière le cluster HAProxy.',
    scenarioFr: 'Les utilisateurs d\'une application web e-commerce se plaignent d\'être déconnectés à chaque clic et de voir leur panier se vider aléatoirement lors du passage derrière le cluster HAProxy.',
    codeSnippet: `backend web-app
    balance roundrobin
    server web1 10.0.0.11:80 check
    server web2 10.0.0.12:80 check`,
    language: 'config',
    bugDescription: 'La répartition est en simple "roundrobin" sans affinité de session (sticky sessions), envoyant les requêtes d\'un même client alternativement sur deux serveurs applicatifs indépendants ne partageant pas les sessions PHP/Java.',
    bugDescriptionFr: 'La répartition est en simple "roundrobin" sans affinité de session (sticky sessions), envoyant les requêtes d\'un même client alternativement sur deux serveurs applicatifs indépendants ne partageant pas les sessions PHP/Java.',
    options: [
      {
        id: 'opt-1',
        label: 'HAProxy n\'est pas configuré avec de la persistance de session (sticky session) ; il faut insérer un cookie applicatif ("cookie SERVERID insert indirect nocache") ou utiliser une stick-table',
        labelFr: 'HAProxy n\'est pas configuré avec de la persistance de session (sticky session) ; il faut insérer un cookie applicatif ("cookie SERVERID insert indirect nocache") ou utiliser une stick-table',
        isCorrect: true,
        explanation: 'En l\'absence de persistance par cookie ou stick-table, l\'algorithme roundrobin envoie chaque nouvelle requête HTTP vers un serveur différent. Pour une application à session en mémoire locale, l\'injection d\'un cookie persistant est indispensable.',
        explanationFr: 'En l\'absence de persistance par cookie ou stick-table, l\'algorithme roundrobin envoie chaque nouvelle requête HTTP vers un serveur différent. Pour une application à session en mémoire locale, l\'injection d\'un cookie persistant est indispensable.'
      },
      {
        id: 'opt-2',
        label: 'roundrobin doit obligatoirement être remplacé par leastconn',
        labelFr: 'roundrobin doit obligatoirement être remplacé par leastconn',
        isCorrect: false,
        explanation: 'leastconn distribue en fonction du nombre de connexions mais ne garantit pas la persistance du client sur le même serveur.',
        explanationFr: 'leastconn distribue en fonction du nombre de connexions mais ne garantit pas la persistance du client sur le même serveur.'
      },
      {
        id: 'opt-3',
        label: 'HAProxy ne peut pas gérer les sessions HTTP sans le module OpenSSL',
        labelFr: 'HAProxy ne peut pas gérer les sessions HTTP sans le module OpenSSL',
        isCorrect: false,
        explanation: 'La persistance par cookie fonctionne en clair comme en HTTPS chiffré.',
        explanationFr: 'La persistance par cookie fonctionne en clair comme en HTTPS chiffré.'
      },
      {
        id: 'opt-4',
        label: 'Les paniers d\'achat doivent être stockés dans le fichier /etc/hosts',
        labelFr: 'Les paniers d\'achat doivent être stockés dans le fichier /etc/hosts',
        isCorrect: false,
        explanation: '/etc/hosts n\'a aucun rapport avec les sessions applicatives.',
        explanationFr: 'Les paniers d\'achat doivent être stockés dans le fichier /etc/hosts'
      }
    ],
    correctedSnippet: `backend web-app
    balance roundrobin
    cookie SERVERID insert indirect nocache
    server web1 10.0.0.11:80 check cookie web1
    server web2 10.0.0.12:80 check cookie web2`,
    fixExplanation: 'Configurer l\'insertion de cookie de persistance dans la section backend.',
    fixExplanationFr: 'Configurer l\'insertion de cookie de persistance dans la section backend.'
  },
  {
    id: 'tb-lpic3-306-17',
    title: 'Cluster Ceph : Échec de quorum de MONs (Monitor quorum lost)',
    titleFr: 'Cluster Ceph : Échec de quorum de MONs (Monitor quorum lost)',
    certification: 'lpic-3',
    topicNumber: 363,
    objectiveId: '363.1',
    category: 'Ceph Monitor Quorum & Paxos',
    scenario: 'Sur un cluster Ceph équipé de 3 moniteurs (mon1, mon2, mon3), deux nœuds tombent en panne suite à une coupure électrique. Toute commande "ceph -s" ou accès client bloque indéfiniment sans répondre.',
    scenarioFr: 'Sur un cluster Ceph équipé de 3 moniteurs (mon1, mon2, mon3), deux nœuds tombent en panne suite à une coupure électrique. Toute commande "ceph -s" ou accès client bloque indéfiniment sans répondre.',
    codeSnippet: `# ceph status
(La commande bloque sans rien afficher...)

# journalctl -u ceph-mon@mon1 -n 20
ceph-mon[1040]: mon.mon1@0(electing) e3: no quorum yet, waiting for more mon votes (1/3)`,
    language: 'bash',
    bugDescription: 'Le cluster Ceph Mon repose sur l\'algorithme Paxos exigeant une majorité stricte (2 sur 3). Ayant perdu 2 moniteurs sur 3, mon1 n\'a plus le quorum et bloque toutes les opérations du cluster.',
    bugDescriptionFr: 'Le cluster Ceph Mon repose sur l\'algorithme Paxos exigeant une majorité stricte (2 sur 3). Ayant perdu 2 moniteurs sur 3, mon1 n\'a plus le quorum et bloque toutes les opérations du cluster.',
    options: [
      {
        id: 'opt-1',
        label: 'Perte du quorum Paxos des Ceph MONs (1 moniteur disponible sur 3) ; il faut restaurer les moniteurs en panne ou extraire la monmap pour forcer un quorum à 1 nœud d\'urgence',
        labelFr: 'Perte du quorum Paxos des Ceph MONs (1 moniteur disponible sur 3) ; il faut restaurer les moniteurs en panne ou extraire la monmap pour forcer un quorum à 1 nœud d\'urgence',
        isCorrect: true,
        explanation: 'Sans quorum de MONs (>50%), Ceph suspend toutes les transactions pour préserver la cohérence des cartes de cluster (cluster maps). En cas de sinistre, la procédure d\'urgence consiste à extraire la monmap avec ceph-monmaptool, retirer les nœuds morts et réinjecter la carte.',
        explanationFr: 'Sans quorum de MONs (>50%), Ceph suspend toutes les transactions pour préserver la cohérence des cartes de cluster (cluster maps). En cas de sinistre, la procédure d\'urgence consiste à extraire la monmap avec ceph-monmaptool, retirer les nœuds morts et réinjecter la carte.'
      },
      {
        id: 'opt-2',
        label: 'Les OSDs élisent automatiquement un nouveau MON parmi les disques de données',
        labelFr: 'Les OSDs élisent automatiquement un nouveau MON parmi les disques de données',
        isCorrect: false,
        explanation: 'Les OSDs sont des clients des MONs et ne peuvent pas s\'auto-promouvoir MON.',
        explanationFr: 'Les OSDs sont des clients des MONs et ne peuvent pas s\'auto-promouvoir MON.'
      },
      {
        id: 'opt-3',
        label: 'Ceph n\'a besoin des MONs que lors de la phase initiale de formatage',
        labelFr: 'Ceph n\'a besoin des MONs que lors de la phase initiale de formatage',
        isCorrect: false,
        explanation: 'Les MONs sont l\'autorité centrale constante de synchronisation des états et de distribution des maps.',
        explanationFr: 'Les MONs sont l\'autorité centrale constante de synchronisation des états et de distribution des maps.'
      },
      {
        id: 'opt-4',
        label: 'La commande ceph status doit être exécutée avec le paramètre --no-quorum',
        labelFr: 'La commande ceph status doit être exécutée avec le paramètre --no-quorum',
        isCorrect: false,
        explanation: 'Ce drapeau n\'existe pas.',
        explanationFr: 'Ce drapeau n\'existe pas.'
      }
    ],
    correctedSnippet: `# En cas de perte définitive des autres nœuds, reconstruction d'urgence du monmap :
systemctl stop ceph-mon@mon1
ceph-mon -i mon1 --extract-monmap /tmp/monmap
monmaptool /tmp/monmap --rm mon2 --rm mon3
ceph-mon -i mon1 --inject-monmap /tmp/monmap
systemctl start ceph-mon@mon1`,
    fixExplanation: 'Redémarrer les moniteurs défaillants ou reconstruire la monmap avec monmaptool pour isoler le survivant.',
    fixExplanationFr: 'Redémarrer les moniteurs défaillants ou reconstruire la monmap avec monmaptool pour isoler le survivant.'
  },
  {
    id: 'tb-lpic3-306-18',
    title: 'Cluster OCFS2 : Défaillance de montage liée au démon o2cb',
    titleFr: 'Cluster OCFS2 : Défaillance de montage liée au démon o2cb',
    certification: 'lpic-3',
    topicNumber: 362,
    objectiveId: '362.2',
    category: 'OCFS2 Clustered File System & o2cb Stack',
    scenario: 'L\'administrateur essaie de monter un volume OCFS2 partagé via "mount -t ocfs2 /dev/mapper/mpatha /shared". La commande échoue avec "mount.ocfs2: Cluster has no heartbeat active while trying to join cluster".',
    scenarioFr: 'L\'administrateur essaie de monter un volume OCFS2 partagé via "mount -t ocfs2 /dev/mapper/mpatha /shared". La commande échoue avec "mount.ocfs2: Cluster has no heartbeat active while trying to join cluster".',
    codeSnippet: `# /etc/ocfs2/cluster.conf
cluster:
    node_count = 2
    name = ocfs2cluster

# o2cb cluster-status
Driver for "configfs": Loaded
Filesystem "configfs": Mounted
Stack glue driver: Loaded
Stack plugin "o2cb": Loaded
Driver for "ocfs2_dlmfs": Loaded
Filesystem "ocfs2_dlmfs": Mounted
Checking cluster "ocfs2cluster": Offline`,
    language: 'config',
    bugDescription: 'La pile de cluster OCFS2 o2cb n\'est pas démarrée (statut Offline), de sorte qu\'aucun heartbeat de détection de présence n\'est actif.',
    bugDescriptionFr: 'La pile de cluster OCFS2 o2cb n\'est pas démarrée (statut Offline), de sorte qu\'aucun heartbeat de détection de présence n\'est actif.',
    options: [
      {
        id: 'opt-1',
        label: 'Le cluster OCFS2 "o2cb" est à l\'état Offline ; il faut démarrer le cluster o2cb avec "/sbin/o2cb start-cluster <nom>" ou "systemctl start o2cb"',
        labelFr: 'Le cluster OCFS2 "o2cb" est à l\'état Offline ; il faut démarrer le cluster o2cb avec "/sbin/o2cb start-cluster <nom>" ou "systemctl start o2cb"',
        isCorrect: true,
        explanation: 'OCFS2 requiert l\'activation préalable de la pile de clustering o2cb pour initialiser les heartbeats réseau/disque et le DLM avant de pouvoir autoriser le moindre montage.',
        explanationFr: 'OCFS2 requiert l\'activation préalable de la pile de clustering o2cb pour initialiser les heartbeats réseau/disque et le DLM avant de pouvoir autoriser le moindre montage.'
      },
      {
        id: 'opt-2',
        label: 'mount -t ocfs2 ne peut pas monter des volumes multipath dm-multipath',
        labelFr: 'mount -t ocfs2 ne peut pas monter des volumes multipath dm-multipath',
        isCorrect: false,
        explanation: 'OCFS2 est couramment utilisé sur des disques Fibre Channel redondés par Device Mapper Multipath.',
        explanationFr: 'OCFS2 est couramment utilisé sur des disques Fibre Channel redondés par Device Mapper Multipath.'
      },
      {
        id: 'opt-3',
        label: 'node_count doit être supérieur à 10',
        labelFr: 'node_count doit être supérieur à 10',
        isCorrect: false,
        explanation: 'node_count reflète simplement le nombre de nœuds du cluster (ici 2).',
        explanationFr: 'node_count reflète simplement le nombre de nœuds du cluster (ici 2).'
      },
      {
        id: 'opt-4',
        label: 'OCFS2 a été déclaré obsolète et supprimé du noyau Linux en 2012',
        labelFr: 'OCFS2 a été déclaré obsolète et supprimé du noyau Linux en 2012',
        isCorrect: false,
        explanation: 'OCFS2 fait toujours partie du noyau Linux.',
        explanationFr: 'OCFS2 fait toujours partie du noyau Linux.'
      }
    ],
    correctedSnippet: `o2cb register-cluster ocfs2cluster
o2cb start-cluster ocfs2cluster
mount -t ocfs2 /dev/mapper/mpatha /shared`,
    fixExplanation: 'Enregistrer et démarrer le cluster o2cb avec les utilitaires o2cb.',
    fixExplanationFr: 'Enregistrer et démarrer le cluster o2cb avec les utilitaires o2cb.'
  },
  {
    id: 'tb-lpic3-306-19',
    title: 'Pacemaker : ressource bloquée sur un nœud par un "location constraint" avec score -INFINITY',
    titleFr: 'Pacemaker : ressource bloquée sur un nœud par un "location constraint" avec score -INFINITY',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.2',
    category: 'Pacemaker Location Constraints & Banned Nodes',
    scenario: 'Après une opération de maintenance planifiée où l\'administrateur a déplacé temporairement une ressource ("pcs resource move db_service node2"), la ressource refuse catégoriquement de revenir sur node1 même lorsque node2 est surchargé.',
    scenarioFr: 'Après une opération de maintenance planifiée où l\'administrateur a déplacé temporairement une ressource ("pcs resource move db_service node2"), la ressource refuse catégoriquement de revenir sur node1 même lorsque node2 est surchargé.',
    codeSnippet: `# pcs constraint --full
Location Constraints:
  Resource: db_service
    Constraint: cli-ban-db_service-on-node1
      Rule: score=-INFINITY (id:cli-ban-db_service-on-node1-rule)
        Expression: #uname eq node1`,
    language: 'bash',
    bugDescription: 'La commande "pcs resource move" crée sous le capot une contrainte d\'exclusion explicite ("cli-ban") avec un score de -INFINITY qui bannit le nœud d\'origine jusqu\'à ce qu\'un "clear" soit exécuté.',
    bugDescriptionFr: 'La commande "pcs resource move" crée sous le capot une contrainte d\'exclusion explicite ("cli-ban") avec un score de -INFINITY qui bannit le nœud d\'origine jusqu\'à ce qu\'un "clear" soit exécuté.',
    options: [
      {
        id: 'opt-1',
        label: '"pcs resource move" génère automatiquement une contrainte d\'interdiction temporaire (cli-ban) avec score -INFINITY ; il faut exécuter "pcs resource clear db_service" pour lever le bannissement',
        labelFr: '"pcs resource move" génère automatiquement une contrainte d\'interdiction temporaire (cli-ban) avec score -INFINITY ; il faut exécuter "pcs resource clear db_service" pour lever le bannissement',
        isCorrect: true,
        explanation: 'Toute commande de déplacement manuel (move/ban) injecte une contrainte restrictive d\'exclusion dans le CIB. Pour redonner à Pacemaker sa pleine liberté de placement et réautoriser le nœud, "pcs resource clear" est requis.',
        explanationFr: 'Toute commande de déplacement manuel (move/ban) injecte une contrainte restrictive d\'exclusion dans le CIB. Pour redonner à Pacemaker sa pleine liberté de placement et réautoriser le nœud, "pcs resource clear" est requis.'
      },
      {
        id: 'opt-2',
        label: 'Pacemaker ne supporte pas le retour d\'une ressource sur son nœud d\'origine',
        labelFr: 'Pacemaker ne supporte pas le retour d\'une ressource sur son nœud d\'origine',
        isCorrect: false,
        explanation: 'Pacemaker rééquilibre dynamiquement les ressources dès que les contraintes le permettent.',
        explanationFr: 'Pacemaker rééquilibre dynamiquement les ressources dès que les contraintes le permettent.'
      },
      {
        id: 'opt-3',
        label: 'Le nom de contrainte doit impérativement commencer par pcmk-allow',
        labelFr: 'Le nom de contrainte doit impérativement commencer par pcmk-allow',
        isCorrect: false,
        explanation: 'cli-ban est le préfixe interne standard généré automatiquement par la CLI pcs.',
        explanationFr: 'cli-ban est le préfixe interne standard généré automatiquement par la CLI pcs.'
      },
      {
        id: 'opt-4',
        label: 'Il faut supprimer et recréer la ressource db_service',
        labelFr: 'Il faut supprimer et recréer la ressource db_service',
        isCorrect: false,
        explanation: 'Un simple "pcs resource clear" suffit amplement.',
        explanationFr: 'Un simple "pcs resource clear" suffit amplement.'
      }
    ],
    correctedSnippet: `pcs resource clear db_service
pcs status`,
    fixExplanation: 'Exécuter "pcs resource clear db_service" pour supprimer la contrainte cli-ban résiduelle.',
    fixExplanationFr: 'Exécuter "pcs resource clear db_service" pour supprimer la contrainte cli-ban résiduelle.'
  },
  {
    id: 'tb-lpic3-306-20',
    title: 'HAProxy : Rejets SSL Handshake Failure par mauvaise suite de chiffrement ou ALPN',
    titleFr: 'HAProxy : Rejets SSL Handshake Failure par mauvaise suite de chiffrement ou ALPN',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.1',
    category: 'HAProxy SSL Termination & TLS Negotiation',
    scenario: 'L\'administrateur active la terminaison TLS sur HAProxy ("bind :443 ssl crt /etc/ssl/cert.pem"). Les navigateurs modernes échouent à se connecter avec "ERR_SSL_VERSION_OR_CIPHER_MISMATCH" ou "SSL handshake failure".',
    scenarioFr: 'L\'administrateur active la terminaison TLS sur HAProxy ("bind :443 ssl crt /etc/ssl/cert.pem"). Les navigateurs modernes échouent à se connecter avec "ERR_SSL_VERSION_OR_CIPHER_MISMATCH" ou "SSL handshake failure".',
    codeSnippet: `frontend https-in
    bind *:443 ssl crt /etc/haproxy/certs/site.pem ssl-min-ver TLSv1.3 ciphersuites NONE
    default_backend app-cluster`,
    language: 'config',
    bugDescription: 'La directive de suites cryptographiques ciphersuites est configurée à "NONE", ce qui interdit tout algorithme de chiffrement et rend impossible toute négociation TLS.',
    bugDescriptionFr: 'La directive de suites cryptographiques ciphersuites est configurée à "NONE", ce qui interdit tout algorithme de chiffrement et rend impossible toute négociation TLS.',
    options: [
      {
        id: 'opt-1',
        label: 'La directive ciphersuites est paramétrée à NONE, interdisant toute négociation d\'algorithme de chiffrement ; il faut définir des suites valides ou laisser la valeur par défaut sécurisée',
        labelFr: 'La directive ciphersuites est paramétrée à NONE, interdisant toute négociation d\'algorithme de chiffrement ; il faut définir des suites valides ou laisser la valeur par défaut sécurisée',
        isCorrect: true,
        explanation: 'En configurant ciphersuites à NONE, HAProxy ne propose aucun chiffrement au client lors du handshake ClientHello, provoquant l\'échec immédiat de la négociation SSL.',
        explanationFr: 'En configurant ciphersuites à NONE, HAProxy ne propose aucun chiffrement au client lors du handshake ClientHello, provoquant l\'échec immédiat de la négociation SSL.'
      },
      {
        id: 'opt-2',
        label: 'HAProxy ne supporte pas TLS 1.3',
        labelFr: 'HAProxy ne supporte pas TLS 1.3',
        isCorrect: false,
        explanation: 'HAProxy supporte nativement TLS 1.3 depuis de nombreuses versions.',
        explanationFr: 'HAProxy supporte nativement TLS 1.3 depuis de nombreuses versions.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier .pem doit obligatoirement être nommé bundle.crt',
        labelFr: 'Le fichier .pem doit obligatoirement être nommé bundle.crt',
        isCorrect: false,
        explanation: 'Le nom de fichier est libre dès lors qu\'il contient la clé privée et le certificat.',
        explanationFr: 'Le nom de fichier est libre dès lors qu\'il contient la clé privée et le certificat.'
      },
      {
        id: 'opt-4',
        label: 'bind *:443 n\'est autorisé que si le port 80 est désactivé',
        labelFr: 'bind *:443 n\'est autorisé que si le port 80 est désactivé',
        isCorrect: false,
        explanation: 'Les deux ports peuvent coexister sans aucun problème.',
        explanationFr: 'Les deux ports peuvent coexister sans aucun problème.'
      }
    ],
    correctedSnippet: `frontend https-in
    bind *:443 ssl crt /etc/haproxy/certs/site.pem alpn h2,http/1.1 ssl-min-ver TLSv1.2
    default_backend app-cluster`,
    fixExplanation: 'Corriger la configuration SSL en autorisant TLS 1.2+ avec les algorithmes cryptographiques modernes et ALPN.',
    fixExplanationFr: 'Corriger la configuration SSL en autorisant TLS 1.2+ avec les algorithmes cryptographiques modernes et ALPN.'
  },
  {
    id: 'tb-lpic3-306-21',
    title: 'DRBD 9 : Échec d\'attachement par métadonnées non initialisées',
    titleFr: 'DRBD 9 : Échec d\'attachement par métadonnées non initialisées',
    certification: 'lpic-3',
    topicNumber: 362,
    objectiveId: '362.1',
    category: 'DRBD Device Initialization & Metadata',
    scenario: 'L\'administrateur configure une nouvelle ressource DRBD r0 sur une partition /dev/sdb1. En lançant "drbdadm up r0", la commande renvoie "No response from the DRBD driver! Is the module loaded?" puis "Device \'/dev/drbd0\' does not exist" ou "meta-data not found".',
    scenarioFr: 'L\'administrateur configure une nouvelle ressource DRBD r0 sur une partition /dev/sdb1. En lançant "drbdadm up r0", la commande renvoie "No response from the DRBD driver! Is the module loaded?" puis "Device \'/dev/drbd0\' does not exist" ou "meta-data not found".',
    codeSnippet: `# /etc/drbd.d/r0.res
resource r0 {
    on node1 {
        node-id 0;
        device /dev/drbd0;
        disk /dev/sdb1;
        meta-disk internal;
        address 192.168.1.1:7788;
    }
    ...
}

# drbdadm up r0
r0: Failure: (119) No response from the DRBD driver!
No response from the Kernel module. Did you initialize metadata?`,
    language: 'bash',
    bugDescription: 'Avant d\'activer une ressource DRBD pour la première fois avec "drbdadm up", les métadonnées internes doivent impérativement être créées sur le disque avec "drbdadm create-md".',
    bugDescriptionFr: 'Avant d\'activer une ressource DRBD pour la première fois avec "drbdadm up", les métadonnées internes doivent impérativement être créées sur le disque avec "drbdadm create-md".',
    options: [
      {
        id: 'opt-1',
        label: 'Les métadonnées DRBD n\'ont pas été créées sur la partition de stockage ; il faut d\'abord exécuter "drbdadm create-md r0" avant d\'activer la ressource',
        labelFr: 'Les métadonnées DRBD n\'ont pas été créées sur la partition de stockage ; il faut d\'abord exécuter "drbdadm create-md r0" avant d\'activer la ressource',
        isCorrect: true,
        explanation: 'L\'option "meta-disk internal" réserve les derniers secteurs du disque pour enregistrer les générations d\'écriture et les tables de blocs modifiés (activity log). Sans "create-md", DRBD refuse de monter le périphérique /dev/drbd0.',
        explanationFr: 'L\'option "meta-disk internal" réserve les derniers secteurs du disque pour enregistrer les générations d\'écriture et les tables de blocs modifiés (activity log). Sans "create-md", DRBD refuse de monter le périphérique /dev/drbd0.'
      },
      {
        id: 'opt-2',
        label: 'Le port 7788 est réservé par l\'IANA pour le protocole Telnet',
        labelFr: 'Le port 7788 est réservé par l\'IANA pour le protocole Telnet',
        isCorrect: false,
        explanation: '7788 est le port standard de DRBD.',
        explanationFr: '7788 est le port standard de DRBD.'
      },
      {
        id: 'opt-3',
        label: 'node-id doit obligatoirement être un nombre premier supérieur à 10',
        labelFr: 'node-id doit obligatoirement être un nombre premier supérieur à 10',
        isCorrect: false,
        explanation: 'node-id commence couramment à 0 ou 1.',
        explanationFr: 'node-id commence couramment à 0 ou 1.'
      },
      {
        id: 'opt-4',
        label: 'meta-disk internal est déprécié et interdit en production',
        labelFr: 'meta-disk internal est déprécié et interdit en production',
        isCorrect: false,
        explanation: 'meta-disk internal est la méthode d\'intégration la plus commune et recommandée.',
        explanationFr: 'meta-disk internal est la méthode d\'intégration la plus commune et recommandée.'
      }
    ],
    correctedSnippet: `modprobe drbd
drbdadm create-md r0
drbdadm up r0`,
    fixExplanation: 'Initialiser la zone de métadonnées avec "drbdadm create-md r0" avant le premier démarrage.',
    fixExplanationFr: 'Initialiser la zone de métadonnées avec "drbdadm create-md r0" avant le premier démarrage.'
  },
  {
    id: 'tb-lpic3-306-22',
    title: 'Cluster Pacemaker : Agent de clôture (fence device) avec mauvais timeout',
    titleFr: 'Cluster Pacemaker : Agent de clôture (fence device) avec mauvais timeout',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.2',
    category: 'STONITH Fencing Device Timing & Failure',
    scenario: 'Lors d\'un test de bascule, le nœud survivant tente d\'éteindre le nœud défaillant via un boîtier IPMI/iLO. Le fencing échoue systématiquement avec "stonith: operation reboot failed: Timed Out (20s)" et le cluster gèle toutes les ressources par précaution.',
    scenarioFr: 'Lors d\'un test de bascule, le nœud survivant tente d\'éteindre le nœud défaillant via un boîtier IPMI/iLO. Le fencing échoue systématiquement avec "stonith: operation reboot failed: Timed Out (20s)" et le cluster gèle toutes les ressources par précaution.',
    codeSnippet: `# pcs stonith show fence_ipmi
Resource: fence_ipmi (class=stonith type=fence_ipmilan)
  Attributes: ip=10.0.0.100 login=admin passwd=secret pcmk_host_list="node2"
  Operations: monitor interval=60s
  (Timeout implicite par défaut trop court pour un redémarrage BMC froid)`,
    language: 'bash',
    bugDescription: 'Les cartes de gestion hors bande (BMC/IPMI) de certains serveurs mettent parfois 30 à 60 secondes pour négocier la session et couper le courant. Le timeout d\'action par défaut est trop court et expire avant confirmation de la coupure.',
    bugDescriptionFr: 'Les cartes de gestion hors bande (BMC/IPMI) de certains serveurs mettent parfois 30 à 60 secondes pour négocier la session et couper le courant. Le timeout d\'action par défaut est trop court et expire avant confirmation de la coupure.',
    options: [
      {
        id: 'opt-1',
        label: 'Le délai d\'attente (timeout) de l\'opération de fencing est trop court pour la carte IPMI ; il faut augmenter le paramètre "pcmk_reboot_timeout" ou "pcmk_off_timeout" (ex: 60s ou 120s)',
        labelFr: 'Le délai d\'attente (timeout) de l\'opération de fencing est trop court pour la carte IPMI ; il faut augmenter le paramètre "pcmk_reboot_timeout" ou "pcmk_off_timeout" (ex: 60s ou 120s)',
        isCorrect: true,
        explanation: 'Pacemaker impose un succès strict du fencing avant de libérer les ressources. Si le BMC distant met 40 secondes à éteindre la machine et que le timeout est de 20s, l\'action est déclarée en échec et le cluster reste verrouillé pour éviter le split-brain.',
        explanationFr: 'Pacemaker impose un succès strict du fencing avant de libérer les ressources. Si le BMC distant met 40 secondes à éteindre la machine et que le timeout est de 20s, l\'action est déclarée en échec et le cluster reste verrouillé pour éviter le split-brain.'
      },
      {
        id: 'opt-2',
        label: 'fence_ipmilan ne fonctionne pas sur les réseaux Ethernet',
        labelFr: 'fence_ipmilan ne fonctionne pas sur les réseaux Ethernet',
        isCorrect: false,
        explanation: 'IPMI-over-LAN (fence_ipmilan) fonctionne directement sur UDP/IP.',
        explanationFr: 'fence_ipmilan ne fonctionne pas sur les réseaux Ethernet.'
      },
      {
        id: 'opt-3',
        label: 'Le mot de passe IPMI doit comporter exactement 4 caractères',
        labelFr: 'Le mot-clé de passe IPMI doit comporter exactement 4 caractères',
        isCorrect: false,
        explanation: 'La longueur du mot de passe dépend du BMC du constructeur.',
        explanationFr: 'La longueur du mot de passe dépend du BMC du constructeur.'
      },
      {
        id: 'opt-4',
        label: 'pcmk_host_list doit obligatoirement lister tous les nœuds du cluster',
        labelFr: 'pcmk_host_list doit obligatoirement lister tous les nœuds du cluster',
        isCorrect: false,
        explanation: 'Un périphérique de clôture peut être dédié à un nœud spécifique.',
        explanationFr: 'Un périphérique de clôture peut être dédié à un nœud spécifique.'
      }
    ],
    correctedSnippet: `pcs stonith update fence_ipmi pcmk_reboot_timeout=120s pcmk_off_timeout=60s
pcs stonith cleanup fence_ipmi`,
    fixExplanation: 'Augmenter les délais de reboot/off timeout sur l\'agent de fencing.',
    fixExplanationFr: 'Augmenter les délais de reboot/off timeout sur l\'agent de fencing.'
  },
  {
    id: 'tb-lpic3-306-23',
    title: 'Cluster Ceph : Client bloqué en lecture seule (Full / Nearfull OSD threshold)',
    titleFr: 'Cluster Ceph : Client bloqué en lecture seule (Full / Nearfull OSD threshold)',
    certification: 'lpic-3',
    topicNumber: 363,
    objectiveId: '363.1',
    category: 'Ceph Storage Capacity & Full Ratio Protection',
    scenario: 'Toutes les écritures sur les pools Ceph (CephFS, RBD, RGW) sont immédiatement gelées. "ceph health" renvoie : "HEALTH_ERR 1 full osd(s); full flag(s) set".',
    scenarioFr: 'Toutes les écritures sur les pools Ceph (CephFS, RBD, RGW) sont immédiatement gelées. "ceph health" renvoie : "HEALTH_ERR 1 full osd(s); full flag(s) set".',
    codeSnippet: `# ceph osd df
ID  CLASS WEIGHT  REWEIGHT SIZE   RAW USE DATA   %RAW USE
 0   hdd  1.00000  1.00000 1.0 TiB 955 GiB 950 GiB    93.2 (full!)
 1   hdd  1.00000  1.00000 1.0 TiB 700 GiB 690 GiB    68.3
 2   hdd  1.00000  1.00000 1.0 TiB 710 GiB 700 GiB    69.3

# ceph health
HEALTH_ERR 1 full osd(s); full flag(s) set`,
    language: 'bash',
    bugDescription: 'Un OSD a dépassé le seuil critique "mon_osd_full_ratio" (par défaut 95% ou 90% selon version). Pour éviter la corruption de BlueStore/XFS, Ceph bloque toutes les écritures sur le cluster entier.',
    bugDescriptionFr: 'Un OSD a dépassé le seuil critique "mon_osd_full_ratio" (par défaut 95% ou 90% selon version). Pour éviter la corruption de BlueStore/XFS, Ceph bloque toutes les écritures sur le cluster entier.',
    options: [
      {
        id: 'opt-1',
        label: 'Un OSD a dépassé le seuil de saturation (full ratio) ; Ceph bloque toute écriture pour éviter d\'endommager les métadonnées ; il faut supprimer des données ou étendre temporairement le ratio pour libérer de l\'espace',
        labelFr: 'Un OSD a dépassé le seuil de saturation (full ratio) ; Ceph bloque toute écriture pour éviter d\'endommager les métadonnées ; il faut supprimer des données ou étendre temporairement le ratio pour libérer de l\'espace',
        isCorrect: true,
        explanation: 'Lorsque le seuil "full" est franchi sur ne serait-ce qu\'un OSD, le drapeau "full" bloque immédiatement toutes les entrées/sorties d\'écriture. Pour débloquer d\'urgence la situation et purger des snapshots ou données, on élève temporairement injectargs full_ratio (ex: 0.97) puis on rééquilibre ou ajoute du stockage.',
        explanationFr: 'Lorsque le seuil "full" est franchi sur ne serait-ce qu\'un OSD, le drapeau "full" bloque immédiatement toutes les entrées/sorties d\'écriture. Pour débloquer d\'urgence la situation et purger des snapshots ou données, on élève temporairement injectargs full_ratio (ex: 0.97) puis on rééquilibre ou ajoute du stockage.'
      },
      {
        id: 'opt-2',
        label: 'L\'OSD 0 doit être supprimé sans vider ses données',
        labelFr: 'L\'OSD 0 doit être supprimé sans vider ses données',
        isCorrect: false,
        explanation: 'Supprimer brutalement un OSD saturé sans réplication risquerait de détruire des objets uniques.',
        explanationFr: 'Supprimer brutalement un OSD saturé sans réplication risquerait de détruire des objets uniques.'
      },
      {
        id: 'opt-3',
        label: 'Ceph ne supporte pas des disques de taille supérieure à 500 Go',
        labelFr: 'Ceph ne supporte pas des disques de taille supérieure à 500 Go',
        isCorrect: false,
        explanation: 'Ceph est couramment utilisé avec des disques de 18 à 24 To.',
        explanationFr: 'Ceph est couramment utilisé avec des disques de 18 à 24 To.'
      },
      {
        id: 'opt-4',
        label: 'Le statut full est une fausse alerte causée par systemd-journald',
        labelFr: 'Le statut full est une fausse alerte causée par systemd-journald',
        isCorrect: false,
        explanation: 'Ceph mesure directement la capacité physique restante dans son stockage BlueStore.',
        explanationFr: 'Ceph mesure directement la capacité physique restante dans son stockage BlueStore.'
      }
    ],
    correctedSnippet: `# Rehausser temporairement le ratio d'urgence :
ceph osd set-full-ratio 0.97
# Supprimer les données inutiles / snapshots, puis rééquilibrer :
ceph osd reweight-by-utilization 105
# Rétablir le ratio strict :
ceph osd set-full-ratio 0.90`,
    fixExplanation: 'Augmenter provisoirement le full-ratio pour permettre les suppressions et rééquilibrer les OSDs avec reweight-by-utilization.',
    fixExplanationFr: 'Augmenter provisoirement le full-ratio pour permettre les suppressions et rééquilibrer les OSDs avec reweight-by-utilization.'
  },
  {
    id: 'tb-lpic3-306-24',
    title: 'HAProxy : Health-check HTTP renvoyant du 404 interprété comme serveur hors service',
    titleFr: 'HAProxy : Health-check HTTP renvoyant du 404 interprété comme serveur hors service',
    certification: 'lpic-3',
    topicNumber: 364,
    objectiveId: '364.1',
    category: 'HAProxy Health Checks & HTTP Expect Status',
    scenario: 'L\'administrateur configure une sonde de santé HTTP sur un backend HAProxy ("httpchk GET /health"). Les serveurs backend sont pourtant opérationnels mais HAProxy les marque tous comme "DOWN" et ne leur envoie aucun trafic.',
    scenarioFr: 'L\'administrateur configure une sonde de santé HTTP sur un backend HAProxy ("httpchk GET /health"). Les serveurs backend sont pourtant opérationnels mais HAProxy les marque tous comme "DOWN" et ne leur envoie aucun trafic.',
    codeSnippet: `backend app-servers
    mode http
    balance roundrobin
    option httpchk GET /health
    # Logs HAProxy :
    # Health check for server srv1 failed, code: 404, status: 'Not Found'`,
    language: 'config',
    bugDescription: 'Par défaut, option httpchk attend un code de réponse HTTP 2xx ou 3xx. L\'URL de sonde "/health" n\'existe pas sur le serveur applicatif (renvoie 404), conduisant HAProxy à déclarer les serveurs morts.',
    bugDescriptionFr: 'Par défaut, option httpchk attend un code de réponse HTTP 2xx ou 3xx. L\'URL de sonde "/health" n\'existe pas sur le serveur applicatif (renvoie 404), conduisant HAProxy à déclarer les serveurs morts.',
    options: [
      {
        id: 'opt-1',
        label: 'La route demandée par la sonde HTTP ("/health") n\'existe pas sur l\'application et renvoie 404 ; HAProxy attend obligatoirement un code 2xx ou 3xx pour considérer le serveur en ligne',
        labelFr: 'La route demandée par la sonde HTTP ("/health") n\'existe pas sur l\'application et renvoie 404 ; HAProxy attend obligatoirement un code 2xx ou 3xx pour considérer le serveur en ligne',
        isCorrect: true,
        explanation: 'Un health-check HTTP valide exige que l\'URL interrogée renvoie un statut de succès (typiquement 200 OK). Si le serveur renvoie 404 Not Found, la sonde échoue et le serveur est retiré de la rotation de répartition de charge.',
        explanationFr: 'Un health-check HTTP valide exige que l\'URL interrogée renvoie un statut de succès (typiquement 200 OK). Si le serveur renvoie 404 Not Found, la sonde échoue et le serveur est retiré de la rotation de répartition de charge.'
      },
      {
        id: 'opt-2',
        label: 'option httpchk n\'accepte que la méthode POST',
        labelFr: 'option httpchk n\'accepte que la méthode POST',
        isCorrect: false,
        explanation: 'GET ou HEAD sont les méthodes recommandées par excellence.',
        explanationFr: 'option httpchk n\'accepte que la méthode POST'
      },
      {
        id: 'opt-3',
        label: 'Les serveurs HTTP 404 sont considérés en ligne par les standards RFC',
        labelFr: 'Les serveurs HTTP 404 sont considérés en ligne par les standards RFC',
        isCorrect: false,
        explanation: 'Un code 404 indique une ressource introuvable, ce qui signale une mauvaise configuration de la sonde.',
        explanationFr: 'Un code 404 indique une ressource introuvable, ce qui signale une mauvaise configuration de la sonde.'
      },
      {
        id: 'opt-4',
        label: 'HAProxy exige que tous les health checks soient exécutés en UDP',
        labelFr: 'HAProxy exige que tous les health checks soient exécutés en UDP',
        isCorrect: false,
        explanation: 'HTTP est un protocole de couche application transporté sur TCP.',
        explanationFr: 'HAProxy exige que tous les health checks soient exécutés en UDP'
      }
    ],
    correctedSnippet: `backend app-servers
    mode http
    balance roundrobin
    option httpchk GET /
    http-check expect status 200,301,302
    server srv1 10.0.0.11:80 check`,
    fixExplanation: 'Pointer l\'URL de vérification sur une ressource valide existante ou spécifier les statuts attendus avec "http-check expect".',
    fixExplanationFr: 'Pointer l\'URL de vérification sur une ressource valide existante ou spécifier les statuts attendus avec "http-check expect".'
  },
  {
    id: 'tb-lpic3-306-25',
    title: 'Cluster Corosync bloqué par MTU incohérent sur liens redondants Knet',
    titleFr: 'Cluster Corosync bloqué par MTU incohérent sur liens redondants Knet',
    certification: 'lpic-3',
    topicNumber: 361,
    objectiveId: '361.1',
    category: 'Corosync Knet Multi-Link MTU Mismatch',
    scenario: 'L\'administrateur configure deux liens réseau redondants (link 0 et link 1) sous Corosync pour la haute disponibilité. Les nœuds perdent la synchronisation dès que des gros paquets CIB transitent, et les logs indiquent : "knet: link 1 error packet too big (MTU mismatch)".',
    scenarioFr: 'L\'administrateur configure deux liens réseau redondants (link 0 et link 1) sous Corosync pour la haute disponibilité. Les nœuds perdent la synchronisation dès que des gros paquets CIB transitent, et les logs indiquent : "knet: link 1 error packet too big (MTU mismatch)".',
    codeSnippet: `# ip link show eth0 | grep mtu
eth0: <BROADCAST,MULTICAST,UP> mtu 9000 qdisc mq

# ip link show eth1 | grep mtu
eth1: <BROADCAST,MULTICAST,UP> mtu 1500 qdisc mq

# corosync.conf (knet transmettant sur les deux liens sans spécification de MTU) :
totem {
    version: 2
    cluster_name: ha_cluster
    transport: knet
}`,
    language: 'config',
    bugDescription: 'Les interfaces réseau redondantes possèdent des MTU divergentes (Jumbo Frames 9000 sur eth0 et standard 1500 sur eth1). Lorsque le lien 1 transporte un paquet supérieur à 1500 octets fragmenté ou non supporté, knet échoue.',
    bugDescriptionFr: 'Les interfaces réseau redondantes possèdent des MTU divergentes (Jumbo Frames 9000 sur eth0 et standard 1500 sur eth1). Lorsque le lien 1 transporte un paquet supérieur à 1500 octets fragmenté ou non supporté, knet échoue.',
    options: [
      {
        id: 'opt-1',
        label: 'Incohérence de MTU entre les liens redondants du cluster (eth0 à 9000 et eth1 à 1500) ; la MTU doit être homogénéisée sur tous les liens et nœuds du cluster',
        labelFr: 'Incohérence de MTU entre les liens redondants du cluster (eth0 à 9000 et eth1 à 1500) ; la MTU doit être homogénéisée sur tous les liens et nœuds du cluster',
        isCorrect: true,
        explanation: 'Le moteur réseau knet de Corosync fragmente ou adapte ses paquets à la taille maximale autorisée. Si un lien utilise des Jumbo Frames et un autre lien de secours du 1500 standard non déclaré, les paquets de synchronisation volumineux sont silencieusement rejetés.',
        explanationFr: 'Le moteur réseau knet de Corosync fragmente ou adapte ses paquets à la taille maximale autorisée. Si un lien utilise des Jumbo Frames et un autre lien de secours du 1500 standard non déclaré, les paquets de synchronisation volumineux sont silencieusement rejetés.'
      },
      {
        id: 'opt-2',
        label: 'knet interdit formellement d\'avoir plus d\'un lien réseau actif',
        labelFr: 'knet interdit formellement d\'avoir plus d\'un lien réseau actif',
        isCorrect: false,
        explanation: 'Le multi-link actif/passif ou actif/actif est l\'intérêt fondamental de Kronosnet (knet).',
        explanationFr: 'knet interdit formellement d\'avoir plus d\'un lien réseau actif.'
      },
      {
        id: 'opt-3',
        label: 'La MTU minimale autorisée par Corosync est de 65535 octets',
        labelFr: 'La MTU minimale autorisée par Corosync est de 65535 octets',
        isCorrect: false,
        explanation: 'La MTU Ethernet standard est de 1500 octets.',
        explanationFr: 'La MTU Ethernet standard est de 1500 octets.'
      },
      {
        id: 'opt-4',
        label: 'totem { version: 2 } doit être remplacé par version: 4',
        labelFr: 'totem { version: 2 } doit être remplacé par version: 4',
        isCorrect: false,
        explanation: 'version: 2 est la seule version de protocole Totem valide dans Corosync.',
        explanationFr: 'totem { version: 2 } doit être remplacé par version: 4'
      }
    ],
    correctedSnippet: `# Harmoniser la MTU sur eth0 et eth1 :
ip link set eth0 mtu 1500
ip link set eth1 mtu 1500
# Ou configurer explicitement netmtu dans corosync.conf totem`,
    fixExplanation: 'Uniformiser la MTU sur toutes les interfaces réseau participant au cluster Corosync.',
    fixExplanationFr: 'Uniformiser la MTU sur toutes les interfaces réseau participant au cluster Corosync.'
  }
];
