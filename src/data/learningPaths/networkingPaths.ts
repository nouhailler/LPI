import { LearningPath, PathModule } from './types';

function createModule(data: Omit<PathModule, 'whyItMatters' | 'whyItMattersFr' | 'commands' | 'codeSnippet' | 'prodTrap' | 'prodTrapFr' | 'checklist' | 'checklistFr'> & {
  checklist?: string[];
  checklistFr?: string[];
}): PathModule {
  return {
    ...data,
    whyItMatters: data.theory.whyItMatters,
    whyItMattersFr: data.theory.whyItMattersFr,
    commands: data.theory.commands,
    codeSnippet: data.theory.codeSnippet,
    prodTrap: data.theory.prodTrap,
    prodTrapFr: data.theory.prodTrapFr,
    checklist: data.checklist || [
      'Understand core concept and syntax',
      'Execute practice commands in terminal',
      'Complete hands-on lab step',
      'Review production troubleshooting scenario'
    ],
    checklistFr: data.checklistFr || [
      'Comprendre le concept théorique et la syntaxe',
      'Exécuter les commandes clés dans le terminal',
      'Valider l\'étape du lab pratique',
      'Analyser le piège de production et le dépannage'
    ],
  };
}

/* ==========================================================================
   RÉSEAU LINUX (4 PARCOURS)
   ========================================================================== */

const netCoreModules: PathModule[] = [
  createModule({
    id: 'net-1-ip',
    number: 1,
    title: 'IP Addressing & Network Interfaces',
    titleFr: 'Adressage IP & Interfaces Réseau',
    conceptTag: 'IP & Interfaces',
    conceptTagFr: 'IP & Interfaces',
    shortDesc: 'IPv4 CIDR masks, IPv6, loopback, physical and virtual interface lifecycle with ip link and ip addr.',
    shortDescFr: 'Masques CIDR IPv4, IPv6, loopback, interfaces physiques et virtuelles avec ip link et ip addr.',
    linkedLpiObjective: '109.1',
    explainTopic: 'networking',
    glossaryTerms: ['ip', 'ip-link', 'ip-addr', 'ethtool'],
    theory: {
      summary: 'Network communication starts at Layer 2 (MAC / interfaces) and Layer 3 (IP addresses & subnets). The modern Linux `ip` utility replaces deprecated `ifconfig`.',
      summaryFr: 'La communication réseau repose sur la Couche 2 (MAC / interfaces) et la Couche 3 (adresses IP et sous-réseaux). La commande `ip` remplace `ifconfig`.',
      whyItMatters: 'Every connected service requires a correctly configured interface and netmask. Misconfigured netmasks lead to silent routing drops.',
      whyItMattersFr: 'Tout service connecté exige une interface et un masque corrects. Une erreur de masque entraîne des paquets perdus silencieusement.',
      commands: ['ip -br addr', 'ip -br link', 'ip link set eth0 up', 'ip addr add 192.168.1.50/24 dev eth0', 'ethtool eth0'],
      codeSnippet: {
        label: 'Adding a Secondary IP Address to an Interface',
        labelFr: 'Ajout d\'une adresse IP secondaire sur une interface',
        code: 'ip addr add 10.0.0.99/24 dev eth0 label eth0:vip\nip -br addr show dev eth0',
        explanation: 'Assigns a secondary virtual IP (VIP) to an existing interface for high-availability or multi-site hosting.',
        explanationFr: 'Assigne une IP virtuelle secondaire (VIP) à une interface pour la haute disponibilité.',
      },
      prodTrap: 'Running `ip addr add` sets an IP in memory ONLY. It is lost on reboot unless persisted in `/etc/network/interfaces` or Netplan.',
      prodTrapFr: '`ip addr add` applique la configuration en mémoire uniquement. Elle est perdue au redémarrage sans enregistrement dans Netplan ou interfaces.',
    },
    flashcards: [
      {
        id: 'fc-net-1',
        question: 'Which iproute2 command displays a brief one-line overview of all network interfaces and their IP addresses?',
        questionFr: 'Quelle commande iproute2 affiche un résumé concis sur une ligne de toutes les interfaces et leurs IPs ?',
        answer: 'ip -br addr (or ip --brief address)',
        answerFr: 'ip -br addr (ou ip --brief address)',
        examTip: 'Much cleaner than deprecated ifconfig on modern systems.',
        examTipFr: 'Beaucoup plus synthétique et lisible que l\'ancien ifconfig.',
      }
    ],
    question: {
      id: 'q-net-1',
      question: 'Which command sets interface `eth1` administratively UP using the iproute2 toolset?',
      questionFr: 'Quelle commande active administrativement l\'interface `eth1` avec la suite iproute2 ?',
      options: ['ip link set eth1 up', 'ip addr enable eth1', 'ifconfig eth1 start', 'netctl up eth1'],
      optionsFr: ['ip link set eth1 up', 'ip addr enable eth1', 'ifconfig eth1 start', 'netctl up eth1'],
      correctIndex: 0,
      explanation: 'Interface administrative states (UP/DOWN, MTU, MAC) are managed via `ip link set <dev> <state>`.',
      explanationFr: 'L\'état administratif des interfaces s\'administre via `ip link set <interface> up/down`.',
      commandSnippet: 'sudo ip link set eth1 up',
    },
    lab: {
      id: 'lab-net-1',
      title: 'Configuring a Secondary IP Alias',
      titleFr: 'Configuration d\'un alias IP secondaire',
      goal: 'Assign 192.168.10.15/24 to interface eth0 and verify.',
      goalFr: 'Assigner l\'IP 192.168.10.15/24 sur eth0 et vérifier.',
      context: 'You are adding an IP for an isolated test container.',
      contextFr: 'Vous préparez une adresse IP dédiée pour un conteneur de test.',
      steps: [
        {
          stepNumber: 1,
          title: 'Add IP address with CIDR notation',
          titleFr: 'Ajouter l\'adresse avec notation CIDR',
          instruction: 'Execute ip addr add with 192.168.10.15/24 on dev eth0.',
          instructionFr: 'Exécutez ip addr add avec 192.168.10.15/24 sur eth0.',
          hint: 'ip addr add 192.168.10.15/24 dev eth0',
          hintFr: 'ip addr add 192.168.10.15/24 dev eth0',
          expectedCommands: ['ip addr add 192.168.10.15/24 dev eth0', 'sudo ip addr add 192.168.10.15/24 dev eth0'],
          simulatedOutput: '',
          explanation: 'Assigns the address directly to the kernel network stack.',
          explanationFr: 'Assigne l\'adresse directement dans la pile réseau du noyau.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-net-1',
      title: 'Interface Shows NO-CARRIER',
      titleFr: 'Interface en état NO-CARRIER',
      symptom: '`ip link` outputs `eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500`. Packets cannot be sent.',
      symptomFr: '`ip link` indique NO-CARRIER. Aucun paquet ne transite.',
      investigationCommands: ['ethtool eth0'],
      diagnosticOutput: 'Speed: Unknown!\nDuplex: Unknown!\nLink detected: no',
      rootCause: 'Physical layer failure: Ethernet cable is disconnected, virtual network switch is unbound, or the link partner is down.',
      rootCauseFr: 'Panne physique (Couche 1) : câble débranché, switch virtuel non connecté ou port éteint.',
      solutionCommand: 'ethtool eth0 && check physical cable or hypervisor vSwitch binding',
      solutionExplanation: 'Verify physical link light, virtual machine vNIC attachment, or auto-negotiation settings with ethtool.',
      solutionExplanationFr: 'Vérifiez le câble physique ou l\'attachement de la carte virtuelle sur l\'hyperviseur.',
    }
  }),
  createModule({
    id: 'net-2-routes',
    number: 2,
    title: 'Routing & Gateway Determination',
    titleFr: 'Routage & Passerelle par défaut',
    conceptTag: 'Routing & Forwarding',
    conceptTagFr: 'Routage & Passerelle',
    shortDesc: 'Default gateway, static routes, routing tables, and IP forwarding.',
    shortDescFr: 'Passerelle par défaut, routes statiques, tables de routage et transfert IP.',
    linkedLpiObjective: '109.2',
    explainTopic: 'networking',
    glossaryTerms: ['ip-route', 'traceroute', 'tracepath', 'sysctl'],
    theory: {
      summary: 'The Linux kernel routing table evaluates destination IP addresses against network masks to decide whether to deliver locally (Layer 2 ARP) or forward to a Next-Hop Gateway.',
      summaryFr: 'La table de routage compare l\'adresse IP de destination aux masques configurés pour décider d\'une livraison locale ou d\'un envoi vers la passerelle.',
      whyItMatters: 'Without a default route, the server cannot reach anything outside its local broadcast domain (no internet, no external APIs).',
      whyItMattersFr: 'Sans route par défaut, le serveur ne peut joindre aucune machine hors de son sous-réseau local (pas d\'internet, pas d\'APIs).',
      commands: ['ip route show', 'ip route add default via 192.168.1.1 dev eth0', 'ip route add 10.50.0.0/16 via 192.168.1.254', 'traceroute 1.1.1.1'],
      codeSnippet: {
        label: 'Enabling Linux Kernel IPv4 Forwarding (Router Mode)',
        labelFr: 'Activation du routage IPv4 dans le noyau (Mode routeur)',
        code: 'sysctl -w net.ipv4.ip_forward=1\necho "net.ipv4.ip_forward = 1" | tee /etc/sysctl.d/99-router.conf\nsysctl -p /etc/sysctl.d/99-router.conf',
        explanation: 'Enables kernel IP forwarding dynamically and persists configuration across reboots.',
        explanationFr: 'Active le routage de paquets au niveau du noyau et rend la configuration persistante.',
      },
      prodTrap: 'Adding two default gateways with identical metric values causes erratic asymmetric routing where responses exit through the wrong interface.',
      prodTrapFr: 'Configurer deux passerelles par défaut avec la même métrique provoque un routage asymétrique et des connexions rompues.',
    },
    flashcards: [
      {
        id: 'fc-net-2',
        question: 'Which kernel parameter enables a Linux machine to forward packets between different network interfaces like a router?',
        questionFr: 'Quel paramètre noyau permet à une machine Linux de relayer des paquets entre plusieurs interfaces comme un routeur ?',
        answer: 'net.ipv4.ip_forward = 1',
        answerFr: 'net.ipv4.ip_forward = 1',
        examTip: 'Stored in /proc/sys/net/ipv4/ip_forward and configured via sysctl.',
        examTipFr: 'Consultable dans /proc/sys/net/ipv4/ip_forward et configurable via sysctl.',
      }
    ],
    question: {
      id: 'q-net-2',
      question: 'Which command adds a persistent static route to network 10.200.0.0/16 via gateway 192.168.1.254 on dev eth0?',
      questionFr: 'Quelle commande ajoute une route vers le réseau 10.200.0.0/16 via la passerelle 192.168.1.254 sur eth0 ?',
      options: [
        'ip route add 10.200.0.0/16 via 192.168.1.254 dev eth0',
        'route add -net 10.200.0.0 netmask 255.255.0.0 eth0',
        'ip gateway add 10.200.0.0/16',
        'netctl route 10.200.0.0/16'
      ],
      optionsFr: [
        'ip route add 10.200.0.0/16 via 192.168.1.254 dev eth0',
        'route add -net 10.200.0.0 netmask 255.255.0.0 eth0',
        'ip gateway add 10.200.0.0/16',
        'netctl route 10.200.0.0/16'
      ],
      correctIndex: 0,
      explanation: '`ip route add <subnet> via <gateway> dev <interface>` is the standard iproute2 command for static routing.',
      explanationFr: '`ip route add <réseau> via <passerelle> dev <interface>` est la commande standard.',
      commandSnippet: 'sudo ip route add 10.200.0.0/16 via 192.168.1.254 dev eth0',
    },
    lab: {
      id: 'lab-network-ping-diag',
      title: 'Default Gateway Verification & ICMP Ping Diagnostics',
      titleFr: 'Diagnostic réseau et connectivité (ip & ping)',
      goal: 'Inspect the active default route and verify reachability of the gateway IP with ping.',
      goalFr: 'Inspecter les adresses réseau avec ip addr, puis vérifier la connectivité vers la passerelle locale (192.168.1.1) avec ping.',
      context: 'External internet traffic is timing out from this server.',
      contextFr: 'Le trafic vers internet n\'aboutit pas depuis ce serveur.',
      steps: [
        {
          stepNumber: 1,
          title: 'Display default route',
          titleFr: 'Afficher la route par défaut',
          instruction: 'Run ip route showing default entry.',
          instructionFr: 'Lancez ip route pour afficher la ligne default.',
          hint: 'ip route show default',
          hintFr: 'ip route show default',
          expectedCommands: ['ip route show default', 'ip route show', 'ip route'],
          simulatedOutput: 'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.100 metric 100',
          explanation: 'Identifies 192.168.1.1 as the active next-hop gateway on interface eth0.',
          explanationFr: 'Identifie 192.168.1.1 comme la passerelle de sortie active sur eth0.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-net-2',
      title: 'Network is Unreachable Error',
      titleFr: 'Erreur Network is unreachable',
      symptom: '`curl https://example.com` immediately fails with `curl: (7) Failed to connect: Network is unreachable`.',
      symptomFr: '`curl` échoue instantanément avec l\'erreur `Network is unreachable`.',
      investigationCommands: ['ip route show'],
      diagnosticOutput: '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100\n# Notice: NO default route entry!',
      rootCause: 'The server has an IP on the local subnet, but has no `default via <IP>` entry in its kernel routing table.',
      rootCauseFr: 'La machine a une adresse IP locale, mais la table de routage ne contient aucune route par défaut.',
      solutionCommand: 'sudo ip route add default via 192.168.1.1 dev eth0',
      solutionExplanation: 'Add the default gateway route, and ensure the DHCP client or static network configuration configures it at boot.',
      solutionExplanationFr: 'Ajoutez la route par défaut et assurez-vous qu\'elle est enregistrée de façon permanente.',
    }
  }),
  createModule({
    id: 'net-3-diagnostic',
    number: 3,
    title: '5-Layer Network Diagnostic: Ping OK vs Port Connection Refused',
    titleFr: 'Diagnostic Réseau 5 Niveaux : Ping OK vs Port Refusé',
    conceptTag: 'Network Troubleshooting',
    conceptTagFr: 'Dépannage Réseau Systématique',
    shortDesc: 'Why does ping work while curl or database connection fails? Discover IP -> Route -> DNS -> Closed Port -> Stopped Service.',
    shortDescFr: 'Pourquoi ping db01 répond mais curl db01:5432 échoue ? Découvrez la chaîne IP -> Route -> DNS -> Port fermé -> Service arrêté.',
    linkedLpiObjective: '109.3',
    explainTopic: 'networking',
    glossaryTerms: ['ip-addr', 'ip-route', 'ping', 'curl', 'ss', 'systemctl'],
    theory: {
      summary: 'ICMP echo (ping) verifies network reachability at Layer 3 (IP). However, client-server applications require an open TCP listening socket (Layer 4) and a running daemon (Layer 7). If the port is closed or service is dead, ping succeeds while application connections get Connection Refused.',
      summaryFr: 'Le ping ICMP vérifie la connectivité au niveau IP (Couche 3). Cependant, les applications clientes exigent une socket TCP en écoute (Couche 4) et un service actif (Couche 7). Si le port est fermé ou le service arrêté, le ping répond parfaitement mais la connexion applicative est rejetée.',
      whyItMatters: 'A common sysadmin pitfall is declaring "the network is fine because ping works". Systematic diagnostic isolates whether the failure is at IP, Route, DNS, Transport, or Service level.',
      whyItMattersFr: 'Une erreur classique est de penser que "le réseau marche car le ping répond". La démarche méthodique en 5 étapes isole immédiatement le maillon défaillant.',
      commands: [
        'ip addr show eth0',
        'ip route show',
        'ping -c 2 db01',
        'curl db01:5432',
        'ssh db01 "systemctl start postgresql"'
      ],
      prodTrap: 'Declaring the service healthy based only on ping ICMP reply without checking the TCP port socket.',
      prodTrapFr: 'Déduire qu\'un service tourne parce que ping répond avec 0% de perte, sans tester le socket TCP.'
    },
    flashcards: [
      {
        id: 'fc-net-3',
        question: 'Why does pinging a remote host succeed when attempting to curl a web or database service on it returns "Connection refused"?',
        questionFr: 'Pourquoi un ping vers une machine hôte réussit alors que curl vers un service web ou de base de données renvoie "Connection refused" ?',
        answer: 'Ping operates at Layer 3 (ICMP). The target OS kernel is responding to echo requests, but no daemon is listening on the requested Layer 4 TCP port (service stopped or closed port).',
        answerFr: 'Le ping opère en Couche 3 (ICMP). Le noyau de la machine cible répond, mais aucun démon n\'écoute sur le port TCP demandé en Couche 4 (service arrêté ou port fermé).',
        examTip: 'Remember: ICMP reachability does not equal application service availability.',
        examTipFr: 'Retenez : la connectivité ICMP n\'équivaut jamais à la disponibilité du service applicatif.'
      }
    ],
    question: {
      id: 'q-net-3',
      question: 'A junior admin states: "The database server is running normally because `ping db01` replies 0% packet loss, so the outage must be in our application code." Is this deduction accurate?',
      questionFr: 'Un administrateur affirme : "La base de données tourne normalement car `ping db01` répond avec 0% de perte de paquets, le problème vient donc du code client." Cette déduction est-elle exacte ?',
      options: [
        'No: Ping only validates Layer 3 ICMP; the PostgreSQL daemon could be stopped, leaving port 5432 closed.',
        'Yes: If a machine responds to ICMP echo, all its network services are guaranteed to be listening.',
        'No: Ping only tests DNS resolution, not IP connectivity.',
        'Yes: ICMP packets and TCP database handshakes use the exact same transport ports.'
      ],
      optionsFr: [
        'Non : Le ping valide uniquement la couche 3 (ICMP) ; le démon PostgreSQL peut être arrêté et le port 5432 fermé.',
        'Oui : Si une machine répond au ping, tous ses services applicatifs sont nécessairement actifs.',
        'Non : Le ping ne teste que la résolution DNS sans tester la connectivité IP.',
        'Oui : Les paquets ICMP et les flux TCP de base de données empruntent le même port.'
      ],
      correctIndex: 0,
      explanation: 'Ping operates at the ICMP layer within the OS kernel. It does not verify whether application listeners (like PostgreSQL on TCP port 5432) are active or accepting connections.',
      explanationFr: 'Le ping opère au niveau ICMP dans le noyau. Il ne garantit absolument pas qu\'un socket TCP applicatif (comme PostgreSQL 5432) est ouvert et en écoute.',
      commandSnippet: 'curl -v db01:5432  # Check Layer 4 TCP connection',
    },
    lab: {
      id: 'lab-network-db-conn',
      title: '5-Layer Systematic Network Diagnostic (IP, Route, DNS, Port, Service)',
      titleFr: 'Diagnostic Réseau 5 Niveaux : Pourquoi ping db01 fonctionne mais curl db01:5432 échoue ?',
      goal: 'Investigate the network path between web01 and db01, detect the closed TCP port 5432, and restart PostgreSQL via remote SSH.',
      goalFr: 'Diagnostiquer la chaîne réseau complète entre web01 et db01 : vérifier l\'IP, la route, le DNS/ICMP (ping), identifier le port 5432 fermé (curl), puis démarrer PostgreSQL sur db01 via SSH.',
      context: 'Web server cannot query the database. Ping responds, but curl db01:5432 says Connection refused.',
      contextFr: 'Le serveur web ne peut plus joindre la base. Le ping fonctionne mais curl db01:5432 renvoie Connection refused.',
      steps: [
        {
          stepNumber: 1,
          title: 'IP OK',
          titleFr: 'Vérifier l\'adresse IP locale',
          instruction: 'Run ip addr show eth0',
          instructionFr: 'Lancez ip addr show eth0',
          hint: 'ip addr',
          hintFr: 'ip addr',
          expectedCommands: ['ip addr show eth0', 'ip addr', 'ip a'],
          simulatedOutput: '2: eth0: <BROADCAST,UP> mtu 1500 inet 192.168.1.10/24',
          explanation: 'Local interface is UP with IP 192.168.1.10.',
          explanationFr: 'L\'interface locale est UP avec l\'IP 192.168.1.10.',
        }
      ]
    },
    troubleshooting: {
      id: 'tb-net-3',
      title: 'Ping works but curl / TCP connection refused',
      titleFr: 'Ping répond mais curl / TCP renvoie Connection Refused',
      symptom: '`ping db01` succeeds with 0% loss, but `curl db01:5432` returns `Failed to connect: Connection refused`.',
      symptomFr: '`ping db01` réussit à 100%, mais `curl db01:5432` renvoie `Connection refused`.',
      investigationCommands: ['ping -c 2 db01', 'nc -zv db01 5432', 'ssh db01 "systemctl status postgresql"'],
      diagnosticOutput: 'PING db01 (192.168.1.20): 64 bytes received\nnc: connect to db01 (192.168.1.20) port 5432: Connection refused\nActive: inactive (dead)',
      rootCause: 'Layer 3 IP routing and DNS are operational, but the target daemon (PostgreSQL) is stopped, so port 5432 is not in LISTEN state.',
      rootCauseFr: 'La couche 3 (IP/DNS) fonctionne parfaitement, mais le service cible (PostgreSQL) est arrêté : le socket 5432 n\'écoute pas.',
      solutionCommand: 'ssh db01 "systemctl start postgresql"',
      solutionExplanation: 'Start the listening daemon on the remote server, and verify socket listening with ss -lntp.',
      solutionExplanationFr: 'Démarrez le démon sur le serveur distant et vérifiez l\'écoute du port avec ss -lntp.',
    }
  })
];

export const networkingLearningPaths: LearningPath[] = [
  // 1. Réseau Linux
  {
    id: 'net-fundamentals',
    category: 'networking',
    emoji: '🌐',
    title: 'Linux Networking Foundations',
    titleFr: 'Réseau Linux',
    subtitle: 'IP → interfaces → routes → DNS → DHCP → ports → sockets.',
    subtitleFr: 'IP → interfaces → routes → DNS → DHCP → ports → sockets.',
    description: 'The definitive foundation in Linux networking: IPv4/IPv6 addressing, interface administration (ip link, ip addr), kernel routing tables, DNS resolution architecture, socket monitoring (ss), and network troubleshooting.',
    descriptionFr: 'Le socle complet du réseau Linux : adressage IPv4/IPv6, gestion des interfaces (iproute2), tables de routage noyau, chaîne de résolution DNS, écoute des sockets (ss) et diagnostic réseau.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 18,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-300',
    themeColor: 'sky',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-700',
    accentHex: '#0284c7',
    bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
    objectives: [
      'Master the iproute2 suite (`ip link`, `ip addr`, `ip route`)',
      'Diagnose DNS lookup sequences (/etc/hosts, /etc/resolv.conf, systemd-resolved)',
      'Inspect TCP/UDP sockets and listening daemons using `ss`',
      'Trace packet drops across gateways with traceroute, tracepath, and ping'
    ],
    objectivesFr: [
      'Maîtriser la suite iproute2 (`ip link`, `ip addr`, `ip route`)',
      'Diagnostiquer la chaîne de résolution DNS (/etc/hosts, resolv.conf, systemd-resolved)',
      'Auditer les sockets TCP/UDP et ports en écoute avec `ss`',
      'Isoler les pertes de paquets avec traceroute, tracepath et ping'
    ],
    prerequisites: ['Linux for Beginners or comfortable command line navigation'],
    prerequisitesFr: ['Parcours Fondamentaux ou maîtrise des bases du shell'],
    modules: netCoreModules,
    steps: netCoreModules,
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Interfaces & Routing',
      titleFr: 'Évaluation intermédiaire : Interfaces & Routage',
      description: 'Test CIDR calculation, iproute2 syntax, and gateway configuration.',
      descriptionFr: 'Tester le calcul de masques CIDR, la syntaxe iproute2 et le routage.',
      passingScorePct: 75,
      questions: [
        netCoreModules[0].question,
        netCoreModules[1].question
      ]
    },
    finalEvaluation: {
      title: 'Network Autonomy Capstone: Dual-Homed Server Routing',
      titleFr: 'Projet final Réseau : Routage sur serveur double interface (Dual-Homed)',
      scenario: 'Configure a server with two network interfaces: eth0 for public internet with default gateway, and eth1 for private database backend (10.10.0.0/16) via custom static route. Validate DNS and verify socket listening.',
      scenarioFr: 'Configurer un serveur avec deux interfaces : eth0 connectée à internet avec la passerelle par défaut, et eth1 reliée au réseau privé de base de données (10.10.0.0/16) avec une route statique dédiée. Valider le DNS et les sockets.',
      deliverables: [
        'Interface eth1 configured with static IP and no competing default gateway',
        'Static route to 10.10.0.0/16 pointing to internal router',
        'Verification of listening port 443 with `ss -tulpn`'
      ],
      deliverablesFr: [
        'Interface eth1 configurée sans passerelle par défaut concurrente',
        'Route statique vers 10.10.0.0/16 pointant sur le routeur interne',
        'Validation de l\'écoute HTTPS sur le port 443 avec `ss -tulpn`'
      ],
      validationCriteria: [
        'Zero asymmetric routing loops',
        'DNS resolution functioning with both internal and public hostnames'
      ],
      validationCriteriaFr: [
        'Aucune boucle de routage asymétrique',
        'Résolution DNS validée sur les noms internes et externes'
      ]
    },
    capstone: {
      title: 'Network Autonomy Capstone: Dual-Homed Server Routing',
      titleFr: 'Projet final Réseau : Routage sur serveur double interface (Dual-Homed)',
      scenario: 'Configure a server with two network interfaces: eth0 for public internet with default gateway, and eth1 for private database backend (10.10.0.0/16) via custom static route. Validate DNS and verify socket listening.',
      scenarioFr: 'Configurer un serveur avec deux interfaces : eth0 connectée à internet avec la passerelle par défaut, et eth1 reliée au réseau privé de base de données (10.10.0.0/16) avec une route statique dédiée. Valider le DNS et les sockets.',
      deliverables: [
        'Interface eth1 configured with static IP and no competing default gateway',
        'Static route to 10.10.0.0/16 pointing to internal router',
        'Verification of listening port 443 with `ss -tulpn`'
      ],
      deliverablesFr: [
        'Interface eth1 configurée sans passerelle par défaut concurrente',
        'Route statique vers 10.10.0.0/16 pointant sur le routeur interne',
        'Validation de l\'écoute HTTPS sur le port 443 avec `ss -tulpn`'
      ],
      validationCriteria: [
        'Zero asymmetric routing loops',
        'DNS resolution functioning with both internal and public hostnames'
      ],
      validationCriteriaFr: [
        'Aucune boucle de routage asymétrique',
        'Résolution DNS validée sur les noms internes et externes'
      ]
    },
    badgeEarned: {
      title: 'Linux Network Administrator Certified',
      titleFr: 'Administrateur Réseau Linux Certifié',
      icon: '🌐'
    }
  },

  // 2. Administration réseau avancée
  {
    id: 'net-advanced',
    category: 'networking',
    emoji: '⚡',
    title: 'Advanced Linux Network Engineering',
    titleFr: 'Administration réseau avancée',
    subtitle: 'Routage → VLAN → Bridges → Firewall (nftables) → Diagnostic (tcpdump).',
    subtitleFr: 'Routage → VLAN → Bridges → Firewall (nftables) → Diagnostic (tcpdump).',
    description: 'Enterprise networking deep dive: policy routing, 802.1Q VLAN tagging, software bridges for virtualization/containers, nftables firewall filtering and NAT, and packet capture with tcpdump.',
    descriptionFr: 'Ingénierie réseau poussée : routage par politique (policy routing), étiquetage VLAN 802.1Q, ponts logiciels (bridges), filtrage et NAT avec nftables, et capture de trames avec tcpdump.',
    difficulty: 'Advanced',
    difficultyFr: 'Avancé',
    estimatedHours: 22,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-300',
    themeColor: 'violet',
    borderColor: 'border-violet-300',
    textColor: 'text-violet-700',
    accentHex: '#7c3aed',
    bgGradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
    objectives: [
      'Implement 802.1Q VLAN trunking and virtual interfaces',
      'Create Linux network bridges (`ip link add type bridge`) for containers',
      'Design stateful firewall rulesets and NAT masquerading with nftables',
      'Capture and dissect live network traffic with tcpdump and Wireshark'
    ],
    objectivesFr: [
      'Déployer des VLANs 802.1Q et interfaces associées',
      'Créer des ponts réseau logiciels (bridges) pour la virtualisation',
      'Écrire des règles de pare-feu et de translation NAT avec nftables',
      'Capturer et analyser des paquets en direct avec tcpdump'
    ],
    prerequisites: ['Linux Networking Foundations'],
    prerequisitesFr: ['Bases solides en réseau Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: VLANs & Bridges',
      titleFr: 'Évaluation intermédiaire : VLANs & Bridges',
      description: 'Test bridge interface construction, MAC learning, and VLAN tags.',
      descriptionFr: 'Tester la création de ponts et l\'encapsulation VLAN.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Engineering Capstone: Isolated Virtual Network & NAT Gateway',
      titleFr: 'Projet final : Passerelle NAT & Réseau Virtuel Isolé',
      scenario: 'Build a Linux router/gateway that receives internet traffic on eth0, connects to an isolated internal bridge br0 (10.50.0.1/24), enables packet forwarding, and configures an nftables masquerade NAT rule.',
      scenarioFr: 'Concevoir un routeur/passerelle Linux recevant internet sur eth0, connecté à un bridge interne isolé br0 (10.50.0.1/24), avec routage activé et règle de masquage NAT nftables.',
      deliverables: [
        'Bridge interface br0 configured and active',
        'nftables rule providing NAT masquerading for 10.50.0.0/24 subnet',
        'tcpdump capture confirming SNAT translation on outgoing packets'
      ],
      deliverablesFr: [
        'Pont br0 actif et assigné en 10.50.0.1/24',
        'Configuration nftables avec masquerade sur eth0',
        'Capture tcpdump validant la réécriture d\'adresse source (SNAT)'
      ],
      validationCriteria: [
        'Internal hosts successfully browse external web through the Linux gateway',
        'Firewall blocks unsolicited incoming SYN requests on external interface'
      ],
      validationCriteriaFr: [
        'Les machines internes accèdent à internet via la passerelle',
        'Le pare-feu bloque toute tentative de connexion non sollicitée de l\'extérieur'
      ]
    },
    capstone: {
      title: 'Engineering Capstone: Isolated Virtual Network & NAT Gateway',
      titleFr: 'Projet final : Passerelle NAT & Réseau Virtuel Isolé',
      scenario: 'Build a Linux router/gateway that receives internet traffic on eth0, connects to an isolated internal bridge br0 (10.50.0.1/24), enables packet forwarding, and configures an nftables masquerade NAT rule.',
      scenarioFr: 'Concevoir un routeur/passerelle Linux recevant internet sur eth0, connecté à un bridge interne isolé br0 (10.50.0.1/24), avec routage activé et règle de masquage NAT nftables.',
      deliverables: [
        'Bridge interface br0 configured and active',
        'nftables rule providing NAT masquerading for 10.50.0.0/24 subnet',
        'tcpdump capture confirming SNAT translation on outgoing packets'
      ],
      deliverablesFr: [
        'Pont br0 actif et assigné en 10.50.0.1/24',
        'Configuration nftables avec masquerade sur eth0',
        'Capture tcpdump validant la réécriture d\'adresse source (SNAT)'
      ],
      validationCriteria: [
        'Internal hosts successfully browse external web through the Linux gateway',
        'Firewall blocks unsolicited incoming SYN requests on external interface'
      ],
      validationCriteriaFr: [
        'Les machines internes accèdent à internet via la passerelle',
        'Le pare-feu bloque toute tentative de connexion non sollicitée de l\'extérieur'
      ]
    },
    badgeEarned: {
      title: 'Advanced Linux Network Engineer',
      titleFr: 'Ingénieur Réseau Linux Avancé',
      icon: '⚡'
    }
  },

  // 3. Services réseau Linux
  {
    id: 'net-services',
    category: 'networking',
    emoji: '📡',
    title: 'Linux Network Services',
    titleFr: 'Services réseau Linux',
    subtitle: 'SSH → DNS (BIND) → DHCP → HTTP (Nginx) → NFS → Samba.',
    subtitleFr: 'SSH → DNS (BIND) → DHCP → HTTP (Nginx) → NFS → Samba.',
    description: 'Deploy and manage infrastructure services: OpenSSH hardening, recursive and authoritative DNS with BIND9, web servers (Nginx reverse proxy), Unix file sharing with NFSv4, and Windows interop with Samba.',
    descriptionFr: 'Déployez et administrez les services d\'infrastructure clés : durcissement OpenSSH, serveur DNS faisant autorité avec BIND9, reverse proxy Nginx, partage de fichiers NFSv4 et interopérabilité Windows avec Samba.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 20,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    themeColor: 'emerald',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    accentHex: '#059669',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    objectives: [
      'Harden OpenSSH daemon (disable passwords, root login, port knocking)',
      'Configure BIND9 DNS forward and reverse resolution zones',
      'Deploy Nginx as a reverse proxy with TLS certificate termination',
      'Export secure NFSv4 network filesystems and Samba SMB shares'
    ],
    objectivesFr: [
      'Sécuriser le serveur OpenSSH (clés uniquement, interdiction de root)',
      'Configurer des zones DNS directes et inverses avec BIND9',
      'Déployer Nginx en reverse proxy avec terminaison SSL/TLS',
      'Partager des volumes réseau via NFSv4 et des partages SMB Samba'
    ],
    prerequisites: ['Linux System Administration & Networking Foundations'],
    prerequisitesFr: ['Administration système et bases réseau'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: SSH & DNS (BIND)',
      titleFr: 'Évaluation intermédiaire : SSH & DNS (BIND)',
      description: 'Test SSH key policies, sshd_config options, and DNS zone records (A, CNAME, PTR).',
      descriptionFr: 'Tester la configuration OpenSSH et les enregistrements de zones DNS.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Services Capstone: High-Availability Web Proxy & Secure File Share',
      titleFr: 'Projet final : Reverse Proxy Web & Partage de Fichiers Sécurisé',
      scenario: 'Deploy a multi-service stack: an Nginx proxy load balancing two backend application nodes, backed by an NFSv4 storage export mounted across the nodes for shared assets.',
      scenarioFr: 'Déployer une architecture multi-services : reverse proxy Nginx répartissant la charge sur deux serveurs applicatifs, partageant un volume commun exporté en NFSv4.',
      deliverables: [
        'Nginx upstream configuration distributing HTTP traffic',
        'NFSv4 export in `/etc/exports` restricted by IP with `no_subtree_check`'
      ],
      deliverablesFr: [
        'Configuration upstream Nginx avec répartition de charge',
        'Exportation NFSv4 dans `/etc/exports` restreinte aux adresses des nœuds'
      ],
      validationCriteria: [
        'Web traffic successfully proxies to both backends',
        'Shared files writeable by both nodes concurrently'
      ],
      validationCriteriaFr: [
        'Le trafic web est distribué correctement entre les nœuds',
        'Les nœuds écrivent sans conflit sur l\'espace de stockage partagé'
      ]
    },
    capstone: {
      title: 'Services Capstone: High-Availability Web Proxy & Secure File Share',
      titleFr: 'Projet final : Reverse Proxy Web & Partage de Fichiers Sécurisé',
      scenario: 'Deploy a multi-service stack: an Nginx proxy load balancing two backend application nodes, backed by an NFSv4 storage export mounted across the nodes for shared assets.',
      scenarioFr: 'Déployer une architecture multi-services : reverse proxy Nginx répartissant la charge sur deux serveurs applicatifs, partageant un volume commun exporté en NFSv4.',
      deliverables: [
        'Nginx upstream configuration distributing HTTP traffic',
        'NFSv4 export in `/etc/exports` restricted by IP with `no_subtree_check`'
      ],
      deliverablesFr: [
        'Configuration upstream Nginx avec répartition de charge',
        'Exportation NFSv4 dans `/etc/exports` restreinte aux adresses des nœuds'
      ],
      validationCriteria: [
        'Web traffic successfully proxies to both backends',
        'Shared files writeable by both nodes concurrently'
      ],
      validationCriteriaFr: [
        'Le trafic web est distribué correctement entre les nœuds',
        'Les nœuds écrivent sans conflit sur l\'espace de stockage partagé'
      ]
    },
    badgeEarned: {
      title: 'Linux Network Services Specialist',
      titleFr: 'Spécialiste Services Réseau Linux',
      icon: '📡'
    }
  },

  // 4. Linux Server (Debian)
  {
    id: 'net-server',
    category: 'networking',
    emoji: '🖥️',
    title: 'Linux Server (Debian Production)',
    titleFr: 'Linux Server (Debian)',
    subtitle: 'Socle minimal → SSH durci → Serveur Web & SSL → DNS → Partage → Supervision.',
    subtitleFr: 'Socle minimal → SSH durci → Serveur Web & SSL → DNS → Partage → Supervision.',
    description: 'Build a production Debian server from scratch: minimal installation base, hardened SSH configuration, Nginx web server with TLS certificates, local DNS caching, secure file sharing, and automated health monitoring.',
    descriptionFr: 'Montez un serveur Debian de production de A à Z : socle minimal épuré, SSH blindé par clés, serveur Web Nginx avec certificat TLS, cache DNS local, partage réseau et supervision automatisée.',
    difficulty: 'Intermediate',
    difficultyFr: 'Intermédiaire',
    estimatedHours: 20,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-300',
    themeColor: 'rose',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    accentHex: '#e11d48',
    bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
    objectives: [
      'Install and strip down a minimal Debian production base',
      'Configure static networking, hostname, and hardened SSH',
      'Deploy Nginx with Let\'s Encrypt / automated TLS certificates',
      'Set up local caching resolver and automated monitoring alerts'
    ],
    objectivesFr: [
      'Installer un socle Debian minimaliste sans paquet superflu',
      'Configurer IP statique, nom d\'hôte FQDN et SSH sécurisé',
      'Déployer Nginx avec certificat TLS automatisé',
      'Mettre en place un résolveur DNS cache et des alertes de supervision'
    ],
    prerequisites: ['Linux Foundations and Basic Administration'],
    prerequisitesFr: ['Bases de l\'administration Linux'],
    modules: [],
    steps: [],
    midTermEvaluation: {
      title: 'Mid-Term Checkpoint: Debian Base & Security',
      titleFr: 'Évaluation intermédiaire : Socle Debian & Sécurité',
      description: 'Validate static network config, SSH key login, and sudo access.',
      descriptionFr: 'Valider l\'adressage statique, l\'accès SSH et la délégation sudo.',
      passingScorePct: 75,
      questions: []
    },
    finalEvaluation: {
      title: 'Debian Server Master: Production-Ready Node Delivery',
      titleFr: 'Projet final : Livraison d\'un Serveur Debian de Production',
      scenario: 'Deliver a production-ready Debian 12 server: static IP, custom non-root admin with SSH ED25519 key, UFW firewall allowing only 22 and 443, Nginx serving a secure HTTPS page with automatic redirect, and fail2ban active.',
      scenarioFr: 'Livrer un serveur Debian 12 prêt pour la production : IP statique, compte admin avec clé ED25519, pare-feu UFW autorisant 22 et 443 uniquement, Nginx servant une page HTTPS et fail2ban actif.',
      deliverables: [
        'Server accessible via SSH key only (password authentication disabled)',
        'Firewall active with default deny incoming policy',
        'Nginx responding on port 443 with modern cipher suite'
      ],
      deliverablesFr: [
        'Accès SSH par clé uniquement (mots de passe désactivés)',
        'Pare-feu actif en rejet par défaut',
        'Nginx opérationnel en HTTPS avec redirection automatique du HTTP'
      ],
      validationCriteria: [
        'Security scan confirms zero extraneous listening ports',
        'Automatic security upgrades configured via unattended-upgrades'
      ],
      validationCriteriaFr: [
        'Audit de ports confirmant l\'absence de service inutile',
        'Mises à jour de sécurité automatisées via unattended-upgrades'
      ]
    },
    capstone: {
      title: 'Debian Server Master: Production-Ready Node Delivery',
      titleFr: 'Projet final : Livraison d\'un Serveur Debian de Production',
      scenario: 'Deliver a production-ready Debian 12 server: static IP, custom non-root admin with SSH ED25519 key, UFW firewall allowing only 22 and 443, Nginx serving a secure HTTPS page with automatic redirect, and fail2ban active.',
      scenarioFr: 'Livrer un serveur Debian 12 prêt pour la production : IP statique, compte admin avec clé ED25519, pare-feu UFW autorisant 22 et 443 uniquement, Nginx servant une page HTTPS et fail2ban actif.',
      deliverables: [
        'Server accessible via SSH key only (password authentication disabled)',
        'Firewall active with default deny incoming policy',
        'Nginx responding on port 443 with modern cipher suite'
      ],
      deliverablesFr: [
        'Accès SSH par clé uniquement (mots de passe désactivés)',
        'Pare-feu actif en rejet par défaut',
        'Nginx opérationnel en HTTPS avec redirection automatique du HTTP'
      ],
      validationCriteria: [
        'Security scan confirms zero extraneous listening ports',
        'Automatic security upgrades configured via unattended-upgrades'
      ],
      validationCriteriaFr: [
        'Audit de ports confirmant l\'absence de service inutile',
        'Mises à jour de sécurité automatisées via unattended-upgrades'
      ]
    },
    badgeEarned: {
      title: 'Debian Production Server Architect',
      titleFr: 'Architecte Serveur Debian de Production',
      icon: '🖥️'
    }
  }
];
