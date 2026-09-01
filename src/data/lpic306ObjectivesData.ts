import { LPICTopic } from '../types';

export const lpic306TopicsData: LPICTopic[] = [
  // =========================================================================
  // TOPIC 361: HIGH AVAILABILITY CLUSTER MANAGEMENT (Weight: 22)
  // =========================================================================
  {
    id: 'topic-361',
    topicNumber: 361,
    title: 'High Availability Cluster Management',
    totalWeight: 22,
    examId: 'exam-306',
    certification: 'lpic-3',
    description: 'High availability concepts, quorum, fencing mechanisms, load balancing with LVS/IPVS, Keepalived VRRP, HAProxy, and failover clustering with Pacemaker and Corosync.',
    objectives: [
      {
        id: '361.1',
        title: 'High Availability Concepts and Theory',
        weight: 6,
        description: 'Understand the goals of High Availability (HA) and Site Reliability Engineering (SRE), cluster topologies, quorum, node and resource fencing, split-brain scenarios, and SLA metrics.',
        keyKnowledgeAreas: [
          'Understand High Availability goals: 99.999% availability ("five nines"), MTBF (Mean Time Between Failures), MTTR (Mean Time To Repair), and RPO/RTO metrics',
          'Differentiate cluster topologies: active/passive (failover), active/active (load distributed), shared-disk clusters, and shared-nothing architectures',
          'Understand quorum mechanisms, node voting, majority quorum rules, and split-brain resolution strategies',
          'Understand fencing principles: STONITH (Shoot The Other Node In The Head), hardware fencing (IPMI, iLO, DRAC, network power switches), and fabric fencing (SAN/storage switch port disabling)',
          'Understand recovery strategies, cascading failovers, cluster reorganization mechanisms, and split-brain detection (SBD watchdog devices)',
          'SRE concepts: Service Level Agreements (SLAs), Service Level Objectives (SLOs), Service Level Indicators (SLIs), and error budgets'
        ],
        termsAndUtilities: [
          'active/passive', 'active/active', 'shared-disk', 'shared-nothing', 'quorum', 'split-brain',
          'fencing', 'STONITH', 'SBD', 'watchdog', 'MTBF', 'MTTR', 'RPO', 'RTO', 'SLA', 'SLO', 'SLI', 'IPMI', 'PDU'
        ],
        filesAndPaths: [
          '/dev/watchdog',
          '/etc/sysconfig/sbd',
          '/etc/default/sbd'
        ],
        keyCommands: [
          {
            command: 'sbd -d /dev/disk/by-id/wwn-0x6001405... dump',
            description: 'Inspect the header and status of an SBD (Split-Brain Detector) shared storage watchdog slot.',
            example: 'sbd -d /dev/sdb1 list',
            explanation: 'Shows heartbeats and incoming poison-pill fencing messages written to the shared SBD block device.'
          },
          {
            command: 'ipmitool -I lanplus -H 192.168.1.100 -U admin -P secret power status',
            description: 'Query remote IPMI BMC hardware controller power state for out-of-band node management and STONITH.',
            example: 'ipmitool -I lanplus -H 192.168.1.100 -U admin -P secret power reset',
            explanation: 'Forces hard reset of a non-responsive node to guarantee storage release during failover.'
          }
        ],
        studyNotes: [
          'Split-brain occurs when a cluster loses inter-node communication and partitions into isolated segments, each attempting to control shared resources concurrently, causing catastrophic data corruption.',
          'STONITH is MANDATORY in production failover clusters with shared storage; if a node stops communicating, it must be forcefully isolated or power-cycled before another node accesses the shared storage.',
          'Quorum formula: A cluster has quorum when active voting members > total members / 2. In a 3-node cluster, at least 2 nodes are required for quorum.'
        ],
        quickQuestions: [
          {
            question: 'What is the primary danger of operating a high-availability cluster without STONITH/fencing configured?',
            options: ['Memory leak in corosync', 'Split-brain leading to concurrent writes and file system corruption', 'VIP collision on layer 2 switches', 'Loss of NTP time synchronization'],
            correctIndex: 1,
            explanation: 'Without STONITH fencing, an unresponsive node may still be writing to shared storage while another node takes over, resulting in split-brain data destruction.'
          },
          {
            question: 'In a 5-node Pacemaker cluster, what is the minimum number of online nodes required to maintain majority quorum?',
            options: ['2 nodes', '3 nodes', '4 nodes', '5 nodes'],
            correctIndex: 1,
            explanation: 'Majority quorum requires more than half the total nodes: 5 / 2 = 2.5, which rounds up to 3 online nodes.'
          }
        ]
      },
      {
        id: '361.2',
        title: 'Load Balanced Clusters',
        weight: 8,
        description: 'Install, configure, maintain, and troubleshoot Linux Virtual Server (LVS/IPVS), Keepalived VRRP routing, ldirectord, and HAProxy layer 4/7 reverse proxy load balancers.',
        keyKnowledgeAreas: [
          'Understand Linux Virtual Server (LVS / IPVS) packet forwarding modes: NAT (VS-NAT), Direct Routing (VS-DR), and IP-IP Tunneling (VS-TUN)',
          'Manage IPVS kernel routing tables using ipvsadm (scheduling algorithms: rr, wrr, lc, wlc, sh, dh)',
          'Configure Keepalived daemon: VRRP instances, virtual router IDs (VRID), priority, preempt mode, tracking scripts, and VIP (Virtual IP) migration',
          'Configure Keepalived integrated LVS health checking (TCP_CHECK, HTTP_GET, SSL_GET, MISC_CHECK)',
          'Configure ldirectord with heartbeat/pacemaker or standalone for real server health verification',
          'Configure HAProxy for Layer 4 (TCP stream) and Layer 7 (HTTP reverse proxy) load balancing: frontend, backend, listen sections, balance algorithms (roundrobin, leastconn, source), stick tables, SSL termination, and stats dashboard'
        ],
        termsAndUtilities: [
          'ipvsadm', 'keepalived', 'ldirectord', 'haproxy', 'LVS', 'IPVS', 'VRRP', 'VS-DR', 'VS-NAT', 'VS-TUN',
          'VIP', 'DIP', 'RIP', 'CIP', 'roundrobin', 'leastconn', 'source', 'stick-table', 'vrrp_script'
        ],
        filesAndPaths: [
          '/etc/keepalived/keepalived.conf',
          '/etc/ha.d/ldirectord.cf',
          '/etc/haproxy/haproxy.cfg',
          '/proc/net/ip_vs',
          '/proc/net/ip_vs_conn'
        ],
        keyCommands: [
          {
            command: 'ipvsadm -A -t 192.168.10.50:80 -s wlc',
            description: 'Add a new TCP virtual service at VIP 192.168.10.50 port 80 with Weighted Least-Connections scheduler.',
            example: 'ipvsadm -a -t 192.168.10.50:80 -r 192.168.10.11:80 -g -w 2',
            explanation: 'Adds a real backend server (-r) using Direct Routing mode (-g for gateway/DR) with weight 2 (-w).'
          },
          {
            command: 'ipvsadm -L -n --stats --rate',
            description: 'Display real-time IPVS connection tables, throughput statistics, and packet transfer rates.',
            example: 'ipvsadm -Ln --thresholds',
            explanation: 'Shows active and inactive connection counts per backend real server.'
          },
          {
            command: 'haproxy -c -f /etc/haproxy/haproxy.cfg',
            description: 'Perform syntax and configuration validation check on the HAProxy configuration file.',
            example: 'haproxy -f /etc/haproxy/haproxy.cfg -p /run/haproxy.pid -sf $(cat /run/haproxy.pid)',
            explanation: 'Validates configuration syntax and performs zero-downtime graceful reload using -sf (soft finish).'
          }
        ],
        studyNotes: [
          'In LVS Direct Routing (VS-DR) mode, client requests pass through the Director, but responses are returned DIRECTLY from real servers to clients (bypassing the Director). Real servers must configure the VIP on the `lo` (loopback) interface with ARP suppression.',
          'Keepalived implements VRRP (Virtual Router Redundancy Protocol, IP Protocol 112, multicast 224.0.0.18) to provide high-availability failover for VIPs.',
          'HAProxy Layer 7 features allow content-based routing (inspecting HTTP headers, URLs, cookies) and SSL/TLS termination.'
        ],
        quickQuestions: [
          {
            question: 'In an LVS Direct Routing (VS-DR) setup, what must be configured on the backend real servers for the VIP?',
            options: ['Real servers must run keepalived in master mode', 'Real servers must configure the VIP on the loopback (lo) interface and disable ARP responses for that IP', 'Real servers must enable IP forwarding and NAT translation', 'Real servers must use default gateway pointing to the LVS Director'],
            correctIndex: 1,
            explanation: 'In VS-DR mode, backend servers receive frames with their MAC address but the destination IP is the VIP. The VIP must be bound to loopback and ARP replies suppressed so only the Director answers ARP queries for the VIP.'
          },
          {
            question: 'Which HAProxy directive binds a frontend listener to port 443 with SSL termination?',
            options: ['listen https:443 ssl-cert /etc/ssl/cert.pem', 'bind :443 ssl crt /etc/ssl/server.pem', 'server 0.0.0.0:443 tls-engine /etc/ssl/server.pem', 'frontend-ssl port 443 cert /etc/ssl/server.pem'],
            correctIndex: 1,
            explanation: 'HAProxy uses `bind <ip>:<port> ssl crt <pem-bundle-file>` within frontend or listen blocks for TLS termination.'
          }
        ]
      },
      {
        id: '361.3',
        title: 'Failover Clusters',
        weight: 8,
        description: 'Install, configure, manage, and troubleshoot Pacemaker 2.x and Corosync 2.x/3.x failover clusters using pcs and crmsh, configure resource agents, constraints, and STONITH fencing.',
        keyKnowledgeAreas: [
          'Understand Pacemaker cluster architecture: CIB (Cluster Information Base), CRMd, PEngine, LRMd (pacemaker-execd), DC (Designated Coordinator), and STONITHd',
          'Understand Corosync messaging layer, membership protocols (Totem Single Ring / Knet multiple links), and corosync.conf parameters',
          'Manage cluster state with pcs (Pacemaker/Corosync configuration system) and crmsh',
          'Configure Pacemaker resource standards: OCF (Open Cluster Framework), systemd, LSB, service, and STONITH agents',
          'Configure cluster constraints: Location constraints (rules, node preference scores), Colocation constraints (together or apart), and Ordering constraints (start/stop sequences)',
          'Configure STONITH fence agents (fence_ipmilan, fence_sbd, fence_virsh, fence_drac, fence_ilo) and cluster properties (stonith-enabled, no-quorum-policy)',
          'Manage multi-state / clone / promotable resources (e.g. Master/Slave DRBD or active/passive database replications)'
        ],
        termsAndUtilities: [
          'corosync', 'pacemaker', 'pcs', 'crmsh', 'corosync-cfgtool', 'corosync-quorumtool', 'crm_mon',
          'crm_simulate', 'crm_verify', 'stonith_admin', 'CIB', 'stonith-enabled', 'no-quorum-policy',
          'resource-stickiness', 'score', 'INFINITY', '-INFINITY', 'colocation', 'order', 'location'
        ],
        filesAndPaths: [
          '/etc/corosync/corosync.conf',
          '/etc/corosync/authkey',
          '/var/log/cluster/corosync.log',
          '/var/lib/pacemaker/cib/cib.xml',
          '/usr/lib/ocf/resource.d/'
        ],
        keyCommands: [
          {
            command: 'pcs cluster setup my_cluster node1 node2 --start --enable',
            description: 'Initialize Corosync and Pacemaker configuration across nodes, distribute authkey, and start cluster services.',
            example: 'pcs cluster auth node1 node2 -u hacluster',
            explanation: 'Authenticates pcs daemons across cluster nodes and initializes the synchronized Corosync communication ring.'
          },
          {
            command: 'pcs status',
            description: 'Display comprehensive cluster overview: node health, quorum state, active resources, and fencing events.',
            example: 'crm_mon -1 -r',
            explanation: 'Shows real-time status of all configured primitive, group, clone, and promotable resources.'
          },
          {
            command: 'pcs constraint colocation add WebService with WebIP INFINITY',
            description: 'Enforce that the WebService resource must always run on the same node as WebIP.',
            example: 'pcs constraint order start WebIP then start WebService',
            explanation: 'Colocation binds resources together; order constraints enforce that the IP must be started before the web service.'
          },
          {
            command: 'pcs stonith create ipmi_fence fence_ipmilan ipaddr=192.168.1.200 login=admin passwd=secret pcmk_host_list=node1',
            description: 'Configure an IPMI hardware fencing agent in Pacemaker for node1.',
            example: 'stonith_admin --fence node1',
            explanation: 'Registers a hardware fence agent to power-cycle node1 in the event of heartbeat failure.'
          }
        ],
        studyNotes: [
          'In a 2-node cluster without a third quorum device, you must configure `pcs property set no-quorum-policy=ignore` or use a QDevice (corosync-qdevice) to avoid cluster freeze when one node fails.',
          'Setting `stonith-enabled=false` is ONLY for lab/testing environments; in production, disabling STONITH is dangerous and prevents proper resource recovery.',
          '`resource-stickiness=100` gives the active node a score advantage, preventing resources from bouncing back to a recovered node (failback prevention).'
        ],
        quickQuestions: [
          {
            question: 'Which Pacemaker constraint ensures that database_fs is mounted BEFORE postgres_service starts?',
            options: ['Colocation constraint with INFINITY', 'Ordering constraint: start database_fs then start postgres_service', 'Location constraint with prefer_node score', 'Fence constraint with immediate trigger'],
            correctIndex: 1,
            explanation: 'Ordering constraints define the operational sequence in which resources start and stop.'
          },
          {
            question: 'What is the purpose of setting `resource-stickiness=100` on a Pacemaker resource?',
            options: ['Forces the resource to run on all nodes simultaneously as a clone', 'Encourages the resource to stay on its current node and prevents unwanted failback when a failed node rejoins', 'Locks the resource to the node with the highest CPU capacity', 'Disables automatic fencing for the resource'],
            correctIndex: 1,
            explanation: 'Resource stickiness assigns a score bonus to the node currently running the resource, avoiding unnecessary service disruptions caused by failback.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 362: HIGH AVAILABILITY CLUSTER STORAGE (Weight: 13)
  // =========================================================================
  {
    id: 'topic-362',
    topicNumber: 362,
    title: 'High Availability Cluster Storage',
    totalWeight: 13,
    examId: 'exam-306',
    certification: 'lpic-3',
    description: 'DRBD block-level replication, iSCSI SAN target and initiator configuration, multipath I/O (DM-MPIO), Fibre Channel, and clustered file systems (GFS2, OCFS2, DLM).',
    objectives: [
      {
        id: '362.1',
        title: 'DRBD (Distributed Replicated Block Device)',
        weight: 6,
        description: 'Install, configure, manage, and troubleshoot DRBD (v8 and v9) block device replication over IP networks, replication protocols (A, B, C), dual-primary mode, and Pacemaker integration.',
        keyKnowledgeAreas: [
          'Understand DRBD architecture: kernel module, block device abstraction (/dev/drbdX), and backing storage devices',
          'DRBD replication protocols: Protocol A (asynchronous), Protocol B (memory synchronous / semi-synchronous), Protocol C (fully synchronous write-to-disk on both nodes)',
          'DRBD operational states: Connection states (Connected, StandAlone, SyncSource, SyncTarget, WFConnection), Node roles (Primary, Secondary), Disk states (UpToDate, Consistent, Outdated, Degen)',
          'Configure DRBD resources (/etc/drbd.conf, /etc/drbd.d/*.res), volumes, network endpoints, and fencing handlers (fence-peer, split-brain handlers)',
          'Dual-primary mode for clustered file systems (GFS2/OCFS2) with quorum support',
          'Manage DRBD with drbdadm, drbdsetup, drbdmeta, and monitor state via /proc/drbd or `drbdadm status`',
          'Recover from split-brain state: determine correct branch, discard modifications on victim node, and resync'
        ],
        termsAndUtilities: [
          'drbdadm', 'drbdsetup', 'drbdmeta', '/proc/drbd', 'Protocol A', 'Protocol B', 'Protocol C',
          'Primary', 'Secondary', 'UpToDate', 'Outdated', 'StandAlone', 'SyncSource', 'SyncTarget',
          'allow-two-primaries', 'split-brain', 'auto-recover', 'LINSTOR'
        ],
        filesAndPaths: [
          '/etc/drbd.conf',
          '/etc/drbd.d/global_common.conf',
          '/etc/drbd.d/*.res',
          '/proc/drbd',
          '/dev/drbd*'
        ],
        keyCommands: [
          {
            command: 'drbdadm create-md r0 && drbdadm up r0',
            description: 'Initialize DRBD metadata on backing devices and bring the resource r0 online.',
            example: 'drbdadm primary --force r0',
            explanation: 'Forces the local node to become Primary on initial setup, triggering the initial block sync to the Secondary peer.'
          },
          {
            command: 'drbdadm status --verbose',
            description: 'Display detailed DRBD 9 peer states, disk states, replication percentage, and network connection status.',
            example: 'cat /proc/drbd',
            explanation: 'Shows real-time synchronization throughput and role states (Primary/Secondary).'
          },
          {
            command: 'drbdadm disconnect r0 && drbdadm secondary r0 && drbdadm connect --discard-my-data r0',
            description: 'Manually resolve a DRBD split-brain on the node with stale data and resynchronize from the authoritative peer.',
            example: 'drbdadm connect r0',
            explanation: 'Instructs the node to discard divergent local blocks and pull all data from the UpToDate peer.'
          }
        ],
        studyNotes: [
          'Protocol C is the default and only safe choice for High Availability clusters where zero data loss is required; a write is only confirmed to the application once it has been written to local disk AND remote disk.',
          'Dual-primary mode (`allow-two-primaries yes;`) MUST ONLY be used in conjunction with a clustered file system (like GFS2 or OCFS2) and DLM locking. Formatting a dual-primary DRBD device with standard ext4/xfs will destroy the file system immediately.',
          'LINSTOR is the modern control plane for managing DRBD 9 storage pools and software-defined replicated volumes across large clusters.'
        ],
        quickQuestions: [
          {
            question: 'Which DRBD replication protocol guarantees synchronous replication where a write is committed only after being written to disk on both nodes?',
            options: ['Protocol A (Asynchronous)', 'Protocol B (Memory-synchronous)', 'Protocol C (Synchronous)', 'Protocol D (Transactional)'],
            correctIndex: 2,
            explanation: 'Protocol C is fully synchronous: write I/O is completed only after local disk write and remote disk write acknowledge.'
          },
          {
            question: 'If two nodes report Connection State: `StandAlone` following an outage, what condition has occurred in DRBD?',
            options: ['Automatic resynchronization completed', 'Split-brain occurred and DRBD disconnected the nodes to protect data integrity', 'Backing storage failure on both nodes', 'Kernel module unloaded'],
            correctIndex: 1,
            explanation: 'When both nodes detect divergent data branches, DRBD transitions to StandAlone state to prevent mutual data corruption until resolved.'
          }
        ]
      },
      {
        id: '362.2',
        title: 'Cluster Storage Access',
        weight: 3,
        description: 'Connect Linux cluster nodes to remote SAN block storage, configure iSCSI targets and initiators, configure Device Mapper Multipath I/O (DM-MPIO) for redundant SAN paths, and understand DLM.',
        keyKnowledgeAreas: [
          'Understand Storage Area Network (SAN) architectures, Fibre Channel (FC) topologies (WWNN, WWPN, zoning, LUN masking), and iSCSI (IP SAN)',
          'Configure iSCSI target (LIO targetcli) and initiator (iscsiadm / iscsid.conf / initiatorname.iscsi)',
          'Configure Device Mapper Multipathing (DM-MPIO / multipathd): failover policies (multibus, failover, round-robin), path grouping, and path checkers (tur, directio)',
          'Configure /etc/multipath.conf: wwids, friendly aliases, path_grouping_policy, no_path_retry, and fast_io_fail_tmo',
          'Understand Distributed Lock Manager (DLM / dlm_controld) for coordinating shared block device access across cluster nodes'
        ],
        termsAndUtilities: [
          'targetcli', 'iscsiadm', 'iscsid', 'multipath', 'multipathd', 'mpathconf', 'WWID', 'WWPN', 'IQN',
          'LUN', 'DM-MPIO', 'failover', 'multibus', 'round-robin', 'DLM', 'dlm_controld'
        ],
        filesAndPaths: [
          '/etc/iscsi/iscsid.conf',
          '/etc/iscsi/initiatorname.iscsi',
          '/etc/multipath.conf',
          '/etc/multipath/wwids',
          '/dev/mapper/mpath*'
        ],
        keyCommands: [
          {
            command: 'iscsiadm -m discovery -t sendtargets -p 192.168.10.100',
            description: 'Discover available iSCSI targets exposed by a storage portal.',
            example: 'iscsiadm -m node -T iqn.2026-08.com.example:storage.target1 -p 192.168.10.100 --login',
            explanation: 'Logs into the discovered target IQN, making remote LUNs appear as local SCSI devices (/dev/sdX).'
          },
          {
            command: 'multipath -ll',
            description: 'List all detected multipath device maps with active/standby paths, priority groups, and health status.',
            example: 'multipath -r',
            explanation: 'Reloads multipath device-mapper tables and re-evaluates available physical storage paths.'
          },
          {
            command: 'mpathconf --enable --with_multipathd y',
            description: 'Create default multipath configuration file and enable multipathd daemon on system startup.',
            example: 'systemctl restart multipathd',
            explanation: 'Enables kernel device-mapper multipathing for all multi-pathed block storage devices.'
          }
        ],
        studyNotes: [
          'Without multipathing (DM-MPIO), dual-controller SANs present the same physical LUN as multiple distinct SCSI devices (e.g. `/dev/sdb` and `/dev/sdc`), causing data corruption if mounted separately. Multipath creates a unified device map `/dev/mapper/mpatha`.',
          'Always use persistent `/dev/mapper/mpathX` or `/dev/disk/by-id/dm-uuid-mpath-*` device paths in `/etc/fstab` or cluster resource definitions, never raw `/dev/sdX` names.'
        ],
        quickQuestions: [
          {
            question: 'What is the purpose of the Device Mapper Multipath (DM-MPIO) daemon `multipathd` in a SAN environment?',
            options: ['Encrypts data packets sent over Fibre Channel', 'Aggregates multiple physical I/O paths to the same storage LUN for failover and load balancing', 'Formats remote LUNs with GFS2 file systems automatically', 'Converts iSCSI traffic into NFS packets'],
            correctIndex: 1,
            explanation: 'DM-MPIO combines multiple physical paths (HBA ports/cables/switches) to a single storage LUN into a resilient unified device `/dev/mapper/mpathX`.'
          },
          {
            question: 'Which file defines the client IQN (iSCSI Qualified Name) on a Linux iSCSI initiator node?',
            options: ['/etc/iscsi/targetcli.conf', '/etc/iscsi/initiatorname.iscsi', '/etc/multipath.conf', '/etc/san/iqn.conf'],
            correctIndex: 1,
            explanation: 'The initiator IQN is defined inside `/etc/iscsi/initiatorname.iscsi` as `InitiatorName=iqn.yyyy-mm.reverse.domain:name`.'
          }
        ]
      },
      {
        id: '362.3',
        title: 'Clustered File Systems',
        weight: 4,
        description: 'Install, format, configure, maintain, and troubleshoot GFS2 (Global File System 2) and OCFS2 (Oracle Clustered File System 2) shared-disk clustered file systems using DLM and O2CB.',
        keyKnowledgeAreas: [
          'Understand clustered file system principles: shared-disk concurrency, distributed lock management, cache coherency, and journal management',
          'Configure and manage GFS2 with DLM (Distributed Lock Manager): mkfs.gfs2, gfs2_tool, gfs2_grow, gfs2_jadd, and mount options',
          'Configure lock table naming conventions: `ClusterName:FSName` for lock_dlm locking protocol',
          'Add and manage journals in GFS2 (one journal required per simultaneously mounted cluster node)',
          'Configure OCFS2 with O2CB cluster stack: o2cb.init, mkfs.ocfs2, tunefs.ocfs2, and mounted.ocfs2',
          'Troubleshoot clustered file system locking, node evictions, and journal replay'
        ],
        termsAndUtilities: [
          'mkfs.gfs2', 'gfs2_tool', 'gfs2_grow', 'gfs2_jadd', 'gfs2_edit', 'fsck.gfs2',
          'mkfs.ocfs2', 'tunefs.ocfs2', 'o2cb', 'o2cb_ctl', 'mounted.ocfs2', 'lock_dlm', 'lock_nolock', 'DLM'
        ],
        filesAndPaths: [
          '/etc/ocfs2/cluster.conf',
          '/sys/kernel/dlm/',
          '/sys/kernel/config/dlm/'
        ],
        keyCommands: [
          {
            command: 'mkfs.gfs2 -p lock_dlm -t ha_cluster:shared_data -j 4 /dev/mapper/mpatha',
            description: 'Format a shared block device with GFS2 file system, lock_dlm locking, cluster name "ha_cluster", and 4 initial journals.',
            example: 'gfs2_jadd -j 2 /mnt/shared_data',
            explanation: 'Creates a clustered file system capable of being mounted concurrently by up to 4 nodes; gfs2_jadd adds 2 more journals on the fly.'
          },
          {
            command: 'gfs2_tool journals /mnt/shared_data',
            description: 'List all journals and their allocation status on a currently mounted GFS2 file system.',
            example: 'gfs2_grow /mnt/shared_data',
            explanation: 'Grows the GFS2 file system dynamically after expanding the underlying shared LUN or SAN volume.'
          },
          {
            command: 'o2cb.init status',
            description: 'Check status of OCFS2 cluster driver stack, heartbeat mode, and active domain memberships.',
            example: 'mkfs.ocfs2 -b 4K -C 32K -N 4 -L "ocfs2_vol" /dev/sdb',
            explanation: 'Initializes OCFS2 file system with 4 node slots (-N 4) and volume label.'
          }
        ],
        studyNotes: [
          'Every node that mounts a GFS2 file system MUST have its own dedicated journal. If a 5th node attempts to mount a GFS2 file system formatted with only 4 journals (-j 4), the mount operation will fail until `gfs2_jadd` adds another journal.',
          'Standard file systems (ext4, xfs) lack distributed lock managers and cannot be mounted read-write on multiple nodes simultaneously; doing so causes immediate file system destruction.',
          'The GFS2 lock table format is strictly `ClusterName:FSName`. The ClusterName must match the cluster name in `corosync.conf` exactly.'
        ],
        quickQuestions: [
          {
            question: 'What occurs if you attempt to mount a GFS2 clustered file system on a third cluster node when the file system was formatted with `-j 2`?',
            options: ['The file system switches to read-only mode automatically', 'The mount command fails because there are no free journals available for the third node', 'The third node uses lock_nolock mode instead', 'The node automatically steals the journal of node 1'],
            correctIndex: 1,
            explanation: 'GFS2 requires one journal per mounting node. If all journals are allocated to active nodes, additional nodes cannot mount the file system until `gfs2_jadd` adds more journals.'
          },
          {
            question: 'Which locking protocol must be specified when formatting a GFS2 file system for multi-node cluster operation?',
            options: ['lock_nolock', 'lock_dlm', 'lock_posix', 'lock_flock'],
            correctIndex: 1,
            explanation: '`-p lock_dlm` enables the Distributed Lock Manager for multi-node concurrent read/write cluster access. `lock_nolock` is used only for single-node standalone testing.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 363: HIGH AVAILABILITY DISTRIBUTED STORAGE (Weight: 13)
  // =========================================================================
  {
    id: 'topic-363',
    topicNumber: 363,
    title: 'High Availability Distributed Storage',
    totalWeight: 13,
    examId: 'exam-306',
    certification: 'lpic-3',
    description: 'Scale-out distributed storage with GlusterFS (peers, bricks, replicated/distributed volumes, self-healing) and Ceph (MON, OSD, MGR, MDS, CRUSH map, RADOS, RBD, CephFS, and BlueStore).',
    objectives: [
      {
        id: '363.1',
        title: 'GlusterFS Storage Clusters',
        weight: 5,
        description: 'Install, configure, manage, scale, and troubleshoot GlusterFS distributed storage clusters, peer probing, volume types (distributed, replicated, arbiter, striped), brick operations, and self-healing.',
        keyKnowledgeAreas: [
          'Understand GlusterFS architecture: GlusterFS daemon (glusterd), trusted storage pools, bricks (filesystem directories), translators, and client FUSE mounts',
          'Manage GlusterFS peers: gluster peer probe, peer status, and peer detach',
          'Create and manage volume types: Distributed volumes, Replicated volumes (replica count), Distributed Replicated volumes, and Arbiter volumes (2 data + 1 arbiter node)',
          'Configure volume options: transport (tcp/rdma), auth.allow, performance tunables, and quota',
          'Manage brick operations: add-brick, remove-brick, replace-brick, rebalance volumes, and monitor migration',
          'Monitor volume status, self-healing (gluster volume heal), and split-brain resolution',
          'Mount GlusterFS volumes via native FUSE client (`mount -t glusterfs server1:/vol /mnt`), NFS, and SMB/CIFS'
        ],
        termsAndUtilities: [
          'gluster', 'glusterd', 'glusterfs', 'peer probe', 'trusted storage pool', 'brick',
          'replicated', 'distributed', 'arbiter', 'gluster volume heal', 'gluster volume rebalance',
          'gluster volume status', 'FUSE', 'split-brain', 'translators'
        ],
        filesAndPaths: [
          '/etc/glusterfs/glusterd.vol',
          '/var/lib/glusterd/',
          '/var/log/glusterfs/'
        ],
        keyCommands: [
          {
            command: 'gluster peer probe node2.example.com',
            description: 'Establish trust and add a new storage node into the GlusterFS trusted storage pool.',
            example: 'gluster peer status',
            explanation: 'Enables node2 to participate in cluster volume creation and brick management.'
          },
          {
            command: 'gluster volume create gv0 replica 3 arbiter 1 node1:/data/brick1 node2:/data/brick1 node3:/data/brick1',
            description: 'Create a replicated GlusterFS volume with 2 data replicas and 1 arbiter brick to prevent split-brain at lower storage cost.',
            example: 'gluster volume start gv0',
            explanation: 'Initializes the volume configuration and starts daemon processes for client access.'
          },
          {
            command: 'gluster volume heal gv0 info',
            description: 'Inspect self-heal status, pending healing entries, and split-brain files across all bricks in volume gv0.',
            example: 'gluster volume heal gv0',
            explanation: 'Forces background self-healing daemon to synchronize divergent files across replica bricks.'
          },
          {
            command: 'mount -t glusterfs node1.example.com:/gv0 /mnt/gluster',
            description: 'Mount GlusterFS volume locally via high-performance native FUSE client with auto-failover to other peers.',
            example: 'node1:/gv0 /mnt/gluster glusterfs defaults,_netdev,backupvolfile-server=node2 0 0',
            explanation: 'Connects to node1; if node1 fails, client automatically queries backupvolfile-server (node2).'
          }
        ],
        studyNotes: [
          'An **Arbiter Volume** (`replica 3 arbiter 1`) uses 2 bricks for full data storage and 1 lightweight brick solely for metadata and locking. This provides full 3-node split-brain protection with 50% less raw storage overhead compared to 3-way replication.',
          'GlusterFS requires no centralized metadata server; the Elastic Hash Algorithm calculates file locations dynamically based on the file name and path.',
          'Always use `backupvolfile-server=<peer2>` in `/etc/fstab` when mounting GlusterFS volumes to ensure mount resilience if the primary host is offline during reboot.'
        ],
        quickQuestions: [
          {
            question: 'What is the purpose of an Arbiter brick in a GlusterFS volume configuration (`replica 3 arbiter 1`)?',
            options: ['Stores encrypted backup copies of all data blocks', 'Stores only file names, metadata, and chunk locks to provide quorum and prevent split-brain without storing full data payloads', 'Acts as a caching proxy for NFS clients', 'Performs hardware RAID parity calculations for the cluster'],
            correctIndex: 1,
            explanation: 'An arbiter brick stores only directory entries and extended attributes (metadata/locks), resolving quorum disputes without doubling storage consumption.'
          },
          {
            question: 'Which command initiates background healing on unsynchronized files in GlusterFS volume `data_vol`?',
            options: ['gluster volume sync data_vol', 'gluster volume heal data_vol', 'gluster repair data_vol --all', 'glusterfs-heal -v data_vol'],
            correctIndex: 1,
            explanation: '`gluster volume heal <volume_name>` triggers the self-healing daemon to reconcile files that fell out of sync.'
          }
        ]
      },
      {
        id: '363.2',
        title: 'Ceph Storage Clusters',
        weight: 8,
        description: 'Understand, deploy, manage, and troubleshoot Ceph distributed storage architecture: Monitors (MON), Object Storage Daemons (OSD), Managers (MGR), Metadata Servers (MDS), CRUSH map, RADOS, RBD block devices, RGW S3/Swift gateways, and CephFS.',
        keyKnowledgeAreas: [
          'Understand Ceph unified storage architecture: RADOS (Reliable Autonomic Distributed Object Store), CRUSH (Controlled Replication Under Scalable Hashing) algorithm, and data distribution',
          'Ceph core daemon roles: Ceph MON (Cluster map monitor, Paxos quorum), Ceph OSD (Object Storage Daemon, handles disk I/O and replication), Ceph MGR (Manager, dashboard, telemetry), Ceph MDS (Metadata Server for CephFS), Ceph RGW (RADOS Gateway for S3/Swift REST API)',
          'OSD storage engines: BlueStore (direct raw disk access, RocksDB metadata, default) versus legacy FileStore',
          'Manage Ceph pools, placement groups (PGs, pg_num calculation), replication rules (size, min_size), and erasure coding (EC)',
          'Manage Ceph Block Devices (RBD): create images, map RBD to Linux kernel block devices (rbd map), resize images, create snapshots, and clones',
          'Configure CephFS (Ceph File System) with active/standby MDS daemons, create data/metadata pools, and mount via kernel or ceph-fuse',
          'Monitor cluster health, OSD status (in/out, up/down), PG states (active+clean, degraded, peering, scrubbing), and resolve degraded states using `ceph status` and `ceph health detail`'
        ],
        termsAndUtilities: [
          'ceph', 'rados', 'rbd', 'ceph-volume', 'ceph-authtool', 'ceph-fuse', 'cephadm', 'MON', 'OSD',
          'MGR', 'MDS', 'RGW', 'CRUSH', 'RADOS', 'BlueStore', 'FileStore', 'PG (Placement Group)',
          'pool', 'active+clean', 'degraded', 'HEALTH_OK', 'HEALTH_WARN', 'HEALTH_ERR'
        ],
        filesAndPaths: [
          '/etc/ceph/ceph.conf',
          '/etc/ceph/ceph.client.admin.keyring',
          '/var/lib/ceph/',
          '/var/log/ceph/'
        ],
        keyCommands: [
          {
            command: 'ceph status',
            description: 'Display overall Ceph cluster health (HEALTH_OK/WARN/ERR), MON quorum, OSD map status, PG states, and storage usage.',
            example: 'ceph health detail',
            explanation: 'Lists specific warnings and degraded placement groups requiring administrator attention.'
          },
          {
            command: 'ceph osd pool create rbd_pool 128 128 && ceph osd pool application enable rbd_pool rbd',
            description: 'Create a new storage pool with 128 Placement Groups and enable it for RBD (RADOS Block Device) workloads.',
            example: 'ceph osd pool set rbd_pool size 3 && ceph osd pool set rbd_pool min_size 2',
            explanation: 'Sets replication factor to 3 copies and minimum write quorum to 2 copies.'
          },
          {
            command: 'rbd create --size 50G --pool rbd_pool disk01.img && rbd map --pool rbd_pool disk01.img',
            description: 'Create a 50GB virtual block device image in Ceph and map it to a local kernel device (/dev/rbd0).',
            example: 'rbd unmap /dev/rbd0',
            explanation: 'Provides scalable network block storage ready for standard formatting (e.g. mkfs.xfs /dev/rbd0).'
          },
          {
            command: 'ceph osd tree',
            description: 'View hierarchical CRUSH map representation: nodes, racks, OSD IDs, weights, and status (up/down, in/out).',
            example: 'ceph osd out 2',
            explanation: 'Marks OSD.2 as out of the cluster, triggering automatic background data rebalancing.'
          }
        ],
        studyNotes: [
          'Ceph Monitors (MONs) maintain master cluster maps and require an odd number of instances (typically 3 or 5) to establish Paxos consensus quorum.',
          'BlueStore writes user data directly to raw block devices without an intervening Linux filesystem, using an embedded RocksDB database on NVMe/SSD for metadata and WAL (Write-Ahead Log).',
          '`min_size` defines the minimum number of active OSD replicas required to accept I/O writes. If replicas drop below `min_size`, Ceph blocks writes to protect data consistency.'
        ],
        quickQuestions: [
          {
            question: 'Which Ceph daemon is responsible for managing metadata and directory hierarchies when providing POSIX-compliant CephFS file systems?',
            options: ['Ceph OSD (Object Storage Daemon)', 'Ceph MDS (Metadata Server)', 'Ceph RGW (RADOS Gateway)', 'Ceph MGR (Manager)'],
            correctIndex: 1,
            explanation: 'Ceph MDS (Metadata Server) manages directory hierarchies, file permissions, and file layout metadata for CephFS.'
          },
          {
            question: 'In Ceph storage architecture, what is the default modern OSD storage engine that writes directly to raw block devices without an underlying file system?',
            options: ['FileStore', 'BlueStore', 'BtrfsStore', 'ZFSStore'],
            correctIndex: 1,
            explanation: 'BlueStore is Ceph\'s modern, high-performance default storage engine that writes directly to raw block storage, bypassing local file system overhead.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 364: SINGLE NODE HIGH AVAILABILITY (Weight: 12)
  // =========================================================================
  {
    id: 'topic-364',
    topicNumber: 364,
    title: 'Single Node High Availability',
    totalWeight: 12,
    examId: 'exam-306',
    certification: 'lpic-3',
    description: 'Local hardware monitoring, watchdog timers, IPMI out-of-band management, UPS integration, advanced software RAID (mdadm), advanced LVM thin provisioning & caching, and network bonding & teaming (teamd).',
    objectives: [
      {
        id: '364.1',
        title: 'Hardware and Resource High Availability',
        weight: 2,
        description: 'Monitor host hardware health, configure kernel and hardware watchdog timers, monitor power reliability with UPS (NUT and APCUPSD), and utilize IPMI for out-of-band monitoring.',
        keyKnowledgeAreas: [
          'Hardware monitoring: temperature sensors, fan speeds, voltages with lm_sensors (sensors, sensors-detect), SMART drive health (smartctl, smartd)',
          'Configure Linux kernel watchdog daemon (watchdog / watchdogd / /dev/watchdog) for automatic reboot upon system hangs or resource exhaustion',
          'Manage Out-of-Band (OOB) hardware controllers via IPMI: ipmitool, bmc sensors, chassis power, and event logs (SEL)',
          'Power protection and Uninterruptible Power Supply (UPS) monitoring: NUT (Network UPS Tools - upsd, upsmon, ups.conf) and apcupsd',
          'ECC (Error-Correcting Code) memory monitoring with EDAC (Error Detection and Correction) tools (edac-util)'
        ],
        termsAndUtilities: [
          'watchdog', 'watchdogd', 'ipmitool', 'sensors', 'smartctl', 'smartd', 'upsd', 'upsmon',
          'apcupsd', 'edac-util', 'EDAC', 'BMC', 'IPMI', 'SEL', 'SDR', '/dev/watchdog'
        ],
        filesAndPaths: [
          '/etc/watchdog.conf',
          '/etc/nut/ups.conf',
          '/etc/nut/upsmon.conf',
          '/etc/apcupsd/apcupsd.conf',
          '/dev/watchdog'
        ],
        keyCommands: [
          {
            command: 'smartctl -H -A /dev/nvme0n1',
            description: 'Check overall health status, temperature, available spare percentage, and critical warnings for an NVMe SSD.',
            example: 'smartctl -t long /dev/sda',
            explanation: 'Initiates a non-destructive extended self-test on the underlying storage drive.'
          },
          {
            command: 'ipmitool sel list',
            description: 'Display the System Event Log (SEL) from the server Baseboard Management Controller (BMC).',
            example: 'ipmitool sensor list',
            explanation: 'Queries hardware sensors (voltages, fan RPMs, chassis intrusions, temperatures) directly from the BMC.'
          },
          {
            command: 'upsc myups@localhost',
            description: 'Query status, battery charge percentage, input voltage, and load from Network UPS Tools (NUT) daemon.',
            example: 'upsmon -c fsd',
            explanation: 'Forces shutdown (FSD) sequence on all protected hosts during prolonged utility power outage.'
          }
        ],
        studyNotes: [
          'The Linux kernel watchdog timer must be reset periodically ("kicked") by the `watchdog` daemon. If the system locks up or freezes, the timer expires and the hardware/kernel forces an immediate reboot.',
          'NUT uses a client-server architecture: `upsd` communicates directly with the physical UPS hardware; `upsmon` runs on monitored machines and initiates graceful shutdown when battery reaches critical levels.'
        ],
        quickQuestions: [
          {
            question: 'What occurs if the Linux watchdog daemon freezes and stops writing to `/dev/watchdog` before the hardware watchdog timer expires?',
            options: ['The system enters single-user rescue mode', 'The hardware watchdog forces an automatic hardware reset/reboot of the system', 'The kernel unloads the storage drivers', 'Network interfaces enter promiscuous mode'],
            correctIndex: 1,
            explanation: 'When the timer expires without receiving a ping/keepalive reset, the watchdog hardware triggers an automatic system reboot to recover from deadlocks.'
          },
          {
            question: 'Which tool is part of the NUT (Network UPS Tools) suite and is responsible for initiating system shutdown when a power failure occurs?',
            options: ['upsd', 'upsmon', 'nut-server', 'apcupsd'],
            correctIndex: 1,
            explanation: '`upsmon` is the client monitor daemon that monitors UPS status reported by `upsd` and triggers automated system shutdowns.'
          }
        ]
      },
      {
        id: '364.2',
        title: 'Advanced RAID',
        weight: 2,
        description: 'Manage Linux software RAID (mdadm), perform live online array modifications, change RAID levels (RAID reshape), grow storage capacities, configure write-intent bitmaps, and handle disk replacements.',
        keyKnowledgeAreas: [
          'Understand software RAID levels: RAID 0 (striping), RAID 1 (mirroring), RAID 5 (distributed parity), RAID 6 (dual distributed parity), RAID 10 (striped mirrors)',
          'Manage RAID devices using mdadm: create, assemble, monitor, detail, and stop arrays',
          'Configure write-intent bitmaps (internal/external) to speed up array recovery after unclean shutdowns',
          'Perform online RAID capacity growth and reshaping: change RAID levels (e.g. RAID 1 to RAID 5, RAID 5 to RAID 6), add active/spare disks, and expand component sizes',
          'Manage disk failures: mark failed (`--fail`), remove device (`--remove`), replace physical disk, add new disk (`--add`), and monitor rebuild progress via `/proc/mdstat`'
        ],
        termsAndUtilities: [
          'mdadm', '/proc/mdstat', 'RAID 0', 'RAID 1', 'RAID 5', 'RAID 6', 'RAID 10', 'write-intent bitmap',
          'grow', 'reshape', 'spare-same', 'hot spare', 'fail', 'remove', 'add'
        ],
        filesAndPaths: [
          '/etc/mdadm/mdadm.conf',
          '/etc/mdadm.conf',
          '/proc/mdstat'
        ],
        keyCommands: [
          {
            command: 'mdadm --grow /dev/md0 --bitmap=internal',
            description: 'Add an internal write-intent bitmap to an existing software RAID array.',
            example: 'mdadm --grow /dev/md0 --bitmap=none',
            explanation: 'Write-intent bitmaps track dirty blocks so that recovering after a crash only resynchronizes altered blocks instead of the whole array.'
          },
          {
            command: 'mdadm --grow /dev/md0 --level=5 --raid-devices=3 --add /dev/sdc1',
            description: 'Reshape an existing 2-disk RAID 1 mirror into a 3-disk RAID 5 array online without unmounting data.',
            example: 'cat /proc/mdstat',
            explanation: 'Triggers online RAID reshape; progress percentage and remaining time can be monitored in /proc/mdstat.'
          },
          {
            command: 'mdadm /dev/md0 --fail /dev/sdb1 --remove /dev/sdb1',
            description: 'Mark a failing drive partition as faulty and remove it from the active RAID array.',
            example: 'mdadm /dev/md0 --add /dev/sdd1',
            explanation: 'Adds replacement disk /dev/sdd1 to the array, automatically initiating rebuild.'
          }
        ],
        studyNotes: [
          'Write-intent bitmaps drastically reduce array resynchronization time from hours to seconds following an unexpected reboot, but can introduce minor write performance overhead on random write workloads.',
          'RAID 6 requires a minimum of 4 drives and can survive the simultaneous failure of ANY TWO drives without data loss.'
        ],
        quickQuestions: [
          {
            question: 'What is the primary benefit of enabling an internal write-intent bitmap on an mdadm RAID 5/6 array?',
            options: ['Doubles sequential read throughput', 'Allows the array to survive three concurrent drive failures', 'Dramatically speeds up array resynchronization after an unclean shutdown by tracking modified blocks', 'Compresses data on disk automatically'],
            correctIndex: 2,
            explanation: 'Write-intent bitmaps track recently written sectors, enabling fast resynchronization of only altered blocks rather than scanning the entire multi-terabyte disk array.'
          },
          {
            question: 'What is the minimum number of physical disks required to construct a functional RAID 6 array?',
            options: ['2 disks', '3 disks', '4 disks', '5 disks'],
            correctIndex: 2,
            explanation: 'RAID 6 uses two independent parity blocks per stripe and requires a minimum of 4 disks (N - 2 usable capacity).'
          }
        ]
      },
      {
        id: '364.3',
        title: 'Advanced LVM',
        weight: 3,
        description: 'Configure and administer advanced Logical Volume Manager (LVM2) features: thin provisioning (thin pools), LVM cache (dm-cache with fast SSDs), LVM RAID/mirrored volumes, and snapshots.',
        keyKnowledgeAreas: [
          'Understand advanced LVM architectures: Thin provisioning pools (sparse allocation, overprovisioning, pool exhaustion safeguards)',
          'Create and manage thin pools and thin volumes: lvcreate --thin, thin pool metadata and data volumes, lvextend, monitoring pool utilization',
          'Configure LVM SSD caching (dm-cache): cache pools, cache data/metadata LVs, cache modes (writethrough vs writeback), lvconvert --type cache',
          'Configure LVM RAID volumes (RAID 1/4/5/6/10 logical volumes via device-mapper): lvcreate --type raid5, handle disk replacement in LVM RAID',
          'Create thin snapshots, restore snapshots (lvconvert --merge), and configure automatic volume extension'
        ],
        termsAndUtilities: [
          'lvm', 'lvcreate', 'lvconvert', 'lvextend', 'lvdisplay', 'lvs', 'vgs', 'pvs',
          'thin pool', 'thin volume', 'cache-pool', 'dm-cache', 'writethrough', 'writeback', 'thin snapshot'
        ],
        filesAndPaths: [
          '/etc/lvm/lvm.conf',
          '/etc/lvm/profile/'
        ],
        keyCommands: [
          {
            command: 'lvcreate -L 100G --thinpool tp_data vg_storage',
            description: 'Create an LVM thin pool named tp_data with 100GB backing capacity for overprovisioning.',
            example: 'lvcreate -V 500G --thin -n thin_vol1 vg_storage/tp_data',
            explanation: 'Creates a 500GB virtual thin volume that only consumes physical storage blocks as actual data is written.'
          },
          {
            command: 'lvcreate -L 20G -n fast_cache_pool vg_storage /dev/nvme0n1',
            description: 'Create a fast cache LV on an NVMe device and attach it to a slower HDD-backed logical volume.',
            example: 'lvconvert --type cache --cachepool fast_cache_pool --cachemode writeback vg_storage/slow_data_lv',
            explanation: 'Accelerates I/O by caching hot data blocks on fast SSD storage using writeback caching mode.'
          },
          {
            command: 'lvcreate --type raid5 -L 200G -i 3 -n raid5_vol vg_storage',
            description: 'Create a 200GB LVM RAID 5 logical volume striped across 3 physical devices with distributed parity.',
            example: 'lvs -a -o +devices,raid_sync_action',
            explanation: 'Creates an LVM-native RAID 5 volume without requiring a separate mdadm software array.'
          }
        ],
        studyNotes: [
          'In LVM Thin Provisioning, overprovisioning allows allocating more virtual capacity than physical space exists. If the thin pool reaches 100% capacity, all writes to all member thin volumes will freeze or fail. Set up monitoring with `thin_dump` and auto-extend thresholds in `lvm.conf`.',
          'Writeback caching mode provides higher write performance because writes are acknowledged as soon as they hit fast SSD cache, but requires redundant SSD storage (e.g. mirrored cache) to prevent data loss on drive failure.'
        ],
        quickQuestions: [
          {
            question: 'What command creates a 200GB thin-provisioned volume named `web_data` from an existing thin pool `my_pool` in volume group `vg0`?',
            options: ['lvcreate -L 200G -n web_data vg0', 'lvcreate -V 200G --thin -n web_data vg0/my_pool', 'lvcreate --type thin-volume -L 200G web_data vg0', 'thincreate -s 200G -p my_pool web_data'],
            correctIndex: 1,
            explanation: 'The syntax for creating a thin volume is `lvcreate -V <virtual_size> --thin -n <lv_name> <vg_name>/<thin_pool_name>`.'
          },
          {
            question: 'What is the main difference between LVM cache modes `writethrough` and `writeback`?',
            options: ['writethrough only caches read operations', 'writethrough writes data to both cache SSD and backing HDD simultaneously, whereas writeback writes to SSD cache first and flushes to HDD later', 'writeback disables caching on failure', 'writethrough requires NVMe storage while writeback requires SATA SSD'],
            correctIndex: 1,
            explanation: '`writethrough` writes synchronously to both cache and slow disk (safer), while `writeback` writes to cache first and defers flushing to slow storage (faster writes).'
          }
        ]
      },
      {
        id: '364.4',
        title: 'Network High Availability',
        weight: 5,
        description: 'Configure and troubleshoot high availability network interfaces using Linux bonding and modern Network Teaming (teamd), bonding modes (0-6), 802.3ad LACP link aggregation, VLAN tagging (802.1Q), and NetworkManager (nmcli).',
        keyKnowledgeAreas: [
          'Understand link aggregation principles: fault tolerance (active-backup), load balancing, and throughput expansion (link aggregation)',
          'Linux network bonding driver: bonding modes (mode 0 balance-rr, mode 1 active-backup, mode 2 balance-xor, mode 3 broadcast, mode 4 802.3ad LACP, mode 5 balance-tlb, mode 6 balance-alb)',
          'Configure bonding via sysfs (/sys/class/net/bonding_masters, /proc/net/bonding/), module options, and ifcfg/iproute2',
          'Understand and configure Network Teaming (teamd / teamdctl / teamnl): runners (roundrobin, activebackup, loadbalance, lacp, random), JSON configuration, and advantages over legacy bonding',
          'Link monitoring: MII monitoring (miimon, arp_interval, arp_ip_target)',
          'Configure 802.1Q VLAN trunking and sub-interfaces on top of bonded/teamed interfaces (e.g. bond0.100, team0.200)',
          'Configure and manage bonded and teamed network connections using NetworkManager (`nmcli connection add type bond / team`)'
        ],
        termsAndUtilities: [
          'teamd', 'teamdctl', 'teamnl', 'nmcli', 'ip link', 'bonding', 'miimon', '802.3ad', 'LACP',
          'active-backup', 'balance-alb', 'balance-tlb', 'balance-rr', '802.1Q', 'VLAN', 'runner', 'lacp_pdu'
        ],
        filesAndPaths: [
          '/proc/net/bonding/*',
          '/etc/NetworkManager/system-connections/',
          '/sys/class/net/bonding_masters',
          '/etc/teamd/*.conf'
        ],
        keyCommands: [
          {
            command: 'nmcli connection add type bond con-name bond0 ifname bond0 bond.options "mode=802.3ad,miimon=100"',
            description: 'Create an LACP 802.3ad dynamic link aggregation bond interface using NetworkManager with 100ms MII link monitoring.',
            example: 'nmcli connection add type ethernet slave-type bond con-name bond0-port1 ifname eth0 master bond0',
            explanation: 'Enslaves physical interface eth0 into the master bond0 link aggregation group.'
          },
          {
            command: 'cat /proc/net/bonding/bond0',
            description: 'Display bonding mode, active slave interface, MII status, link failure count, and partner LACP state.',
            example: 'teamdctl team0 state',
            explanation: 'Queries real-time status and active port runner from the teamd daemon.'
          },
          {
            command: 'nmcli connection add type vlan con-name bond0.100 ifname bond0.100 dev bond0 id 100 ip4 10.0.100.10/24',
            description: 'Configure an 802.1Q VLAN sub-interface with ID 100 on top of the resilient bonded interface bond0.',
            example: 'ip -d link show bond0.100',
            explanation: 'Enables high-availability network trunking carrying tagged VLAN traffic across redundant bonded links.'
          }
        ],
        studyNotes: [
          'Bonding Mode 4 (`802.3ad` / LACP) requires cooperative switch configuration (LACP dynamic port channel aggregation); Mode 1 (`active-backup`) and Mode 6 (`balance-alb`) work on standard unmanaged switches without special switch configuration.',
          'Network Teaming (`teamd`) is a modern, modular userspace replacement for the in-kernel bonding driver, using JSON configurations and D-Bus APIs for extensible link monitoring and custom load-balancing algorithms.'
        ],
        quickQuestions: [
          {
            question: 'Which Linux bonding mode provides fault tolerance with one active interface while all other slave interfaces remain on standby, requiring NO special switch configuration?',
            options: ['Mode 0 (balance-rr)', 'Mode 1 (active-backup)', 'Mode 4 (802.3ad LACP)', 'Mode 3 (broadcast)'],
            correctIndex: 1,
            explanation: 'Mode 1 (active-backup) keeps only one interface active at any time; if the primary interface loses link, a standby takes over instantly without switch configuration.'
          },
          {
            question: 'Which bonding mode requires switch-side configuration of dynamic 802.3ad Link Aggregation Control Protocol (LACP)?',
            options: ['Mode 1 (active-backup)', 'Mode 4 (802.3ad)', 'Mode 6 (balance-alb)', 'Mode 5 (balance-tlb)'],
            correctIndex: 1,
            explanation: 'Mode 4 implements the IEEE 802.3ad standard and requires the physical switch to support and configure LACP aggregation.'
          }
        ]
      }
    ]
  }
];
