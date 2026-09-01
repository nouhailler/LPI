import { LPICTopic } from '../types';

export const lpic3TopicsData: LPICTopic[] = [
  // ==========================================
  // TOPIC 301: SAMBA BASICS (Weight: 11)
  // ==========================================
  {
    id: 'topic-301',
    topicNumber: 301,
    title: 'Samba Basics',
    totalWeight: 11,
    examId: 'exam-300',
    certification: 'lpic-3',
    description: 'Samba concepts, daemons, architecture, smb.conf parameters, regular maintenance, TDB database backups, and troubleshooting.',
    objectives: [
      {
        id: '301.1',
        title: 'Samba Concepts and Architecture',
        weight: 2,
        description: 'Understand Samba architecture, server roles, daemons (smbd, nmbd, winbindd, samba), and SMB/CIFS protocol dialects (SMB1, SMB2, SMB3).',
        keyKnowledgeAreas: [
          'Understand the role of smbd (file and print sharing, authentication), nmbd (NetBIOS name service, browsing), winbindd (domain user resolution), and samba (AD DC unified daemon)',
          'Distinguish between Samba 3 and Samba 4 architectural models',
          'Understand CIFS/SMB protocol versions (SMB 1.0, SMB 2.0, SMB 2.1, SMB 3.0, SMB 3.1.1) and security implications (e.g. disabling SMBv1)',
          'Understand NetBIOS over TCP/IP (NBT) port numbers (137/udp, 138/udp, 139/tcp) versus direct-hosted SMB (445/tcp)',
          'Samba server roles: standalone server, domain member, classic NT4 primary/backup domain controller, Active Directory Domain Controller (AD DC)'
        ],
        termsAndUtilities: [
          'smbd', 'nmbd', 'winbindd', 'samba', 'SMB1', 'SMB2', 'SMB3', 'CIFS',
          'NetBIOS', 'NBT', 'WINS', 'server role', 'standalone', 'member server', 'domain controller'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/var/log/samba/',
          '/var/lib/samba/',
          '/var/cache/samba/',
          '/run/samba/'
        ],
        keyCommands: [
          {
            command: 'systemctl status smbd nmbd winbindd',
            description: 'Check status of traditional Samba file sharing and domain integration daemons.',
            example: 'systemctl restart smbd nmbd',
            explanation: 'On standalone/member servers, run smbd/nmbd/winbindd. On an AD DC, run the unified "samba" daemon instead.'
          },
          {
            command: 'smbd -V',
            description: 'Display the installed Samba suite version and build information.',
            example: 'Version 4.18.6',
            explanation: 'Checks major version compatibility (e.g., Samba 4.x required for Active Directory Domain Controller mode).'
          }
        ],
        studyNotes: [
          'On a Samba Active Directory Domain Controller, NEVER run smbd/nmbd alongside the unified `samba` binary. The `samba` daemon handles all AD DC services internally.',
          'Port 445 (TCP) is modern Direct SMB over TCP/IP without NetBIOS; Port 139 is NetBIOS Session Service (NBT); Port 137 is NetBIOS Name Service (UDP); Port 138 is NetBIOS Datagram Service (UDP).'
        ],
        quickQuestions: [
          {
            question: 'Which daemon should run when Samba is configured as an Active Directory Domain Controller (AD DC)?',
            options: ['smbd and nmbd concurrently', 'winbindd and nmbd only', 'samba daemon', 'nfsd and smbd'],
            correctIndex: 2,
            explanation: 'In AD DC mode, the unified "samba" process manages all internal AD DC services. smbd/nmbd should be stopped and disabled.'
          }
        ]
      },
      {
        id: '301.2',
        title: 'Samba Configuration',
        weight: 4,
        description: 'Configure global and share parameters in smb.conf, understand variables, include files, and validate configurations with testparm.',
        keyKnowledgeAreas: [
          'Understand smb.conf section structure: [global], [homes], [printers], and custom user shares',
          'Configure server identity parameters: workgroup, netbios name, server string, realm',
          'Configure security and role options: server role, security = user | ads | domain',
          'Implement smb.conf variables: %u (username), %U (session username), %G (primary group), %m (client NetBIOS name), %I (client IP), %H (home directory), %S (share name)',
          'Utilize include directives and conditional includes (e.g. include = /etc/samba/smb.conf.%m)',
          'Validate syntax and dump configuration with testparm'
        ],
        termsAndUtilities: [
          'testparm', 'smb.conf', '[global]', '[homes]', '[printers]',
          'workgroup', 'realm', 'server role', 'server min protocol', 'server max protocol',
          'include', 'config backend = registry', 'net conf'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/etc/samba/smb.conf.%m',
          '/etc/samba/smbusers'
        ],
        keyCommands: [
          {
            command: 'testparm -s',
            description: 'Check smb.conf for syntax errors and print the effective configuration without comments.',
            example: 'testparm -v',
            explanation: 'Running with -v prints all parameters including Samba compiled-in defaults.'
          },
          {
            command: 'net conf list',
            description: 'List registry-based configuration shares when using "config backend = registry".',
            example: 'net conf addshare public /srv/samba/public writeable=y guest_ok=y',
            explanation: 'Allows dynamic share management stored in registry.tdb without editing smb.conf.'
          }
        ],
        studyNotes: [
          '`testparm -s` strips default values, showing only explicit settings. `testparm -v` displays all active parameters including internal defaults.',
          '%u is the authenticated user, %U is the requested username sent by the client, and %m is the client machine NetBIOS name.'
        ],
        quickQuestions: [
          {
            question: 'Which smb.conf variable substitution represents the NetBIOS name of the connecting client machine?',
            options: ['%u', '%m', '%H', '%I'],
            correctIndex: 1,
            explanation: '%m expands to the NetBIOS name of the client machine. %u is the authenticated username and %I is the client IP address.'
          }
        ]
      },
      {
        id: '301.3',
        title: 'Regular Samba Maintenance',
        weight: 2,
        description: 'Backup, restore, and repair Samba TDB/LDB databases, manage process signals, and rotate log files.',
        keyKnowledgeAreas: [
          'Understand Samba TDB (Trivial Database) and LDB files (passdb.tdb, secrets.tdb, group_mapping.tdb, gencache.tdb, registry.tdb, locking.tdb)',
          'Perform hot backups of TDB databases using tdbbackup while Samba is running',
          'Dump and inspect TDB contents using tdbdump and tdbrestore',
          'Inspect and modify LDB databases using ldbsearch, ldbedit, ldbadd, and ldbdel',
          'Control running Samba daemons with smbcontrol (e.g. reload-config, pool-usage, close-share)'
        ],
        termsAndUtilities: [
          'tdbbackup', 'tdbdump', 'tdbrestore', 'tdbtool',
          'ldbsearch', 'ldbedit', 'ldbadd', 'ldbdel',
          'smbcontrol', 'smbstatus', 'passdb.tdb', 'secrets.tdb'
        ],
        filesAndPaths: [
          '/var/lib/samba/private/',
          '/var/lib/samba/private/secrets.tdb',
          '/var/lib/samba/private/passdb.tdb',
          '/var/lib/samba/private/sam.ldb',
          '/var/log/samba/log.smbd',
          '/var/log/samba/log.nmbd'
        ],
        keyCommands: [
          {
            command: 'tdbbackup -s .bak /var/lib/samba/private/*.tdb',
            description: 'Safely create consistent live backups of all Samba TDB databases.',
            example: 'tdbbackup -v secrets.tdb',
            explanation: 'Uses internal lock-safe mechanisms to ensure database integrity during live operations.'
          },
          {
            command: 'smbcontrol all reload-config',
            description: 'Notify all running Samba processes to reload /etc/samba/smb.conf without dropping active connections.',
            example: 'smbcontrol smbd close-share data',
            explanation: 'Sends internal messaging to Samba daemons.'
          },
          {
            command: 'ldbsearch -H /var/lib/samba/private/sam.ldb "(sAMAccountName=jdoe)"',
            description: 'Query the Samba 4 Active Directory SAM directory database for an account.',
            example: 'ldbsearch -H /var/lib/samba/private/sam.ldb -b "DC=corp,DC=example,DC=com"',
            explanation: 'LDB is LDAP-like database format used by Samba AD DC.'
          }
        ],
        studyNotes: [
          'Never copy active .tdb or .ldb files using `cp` while Samba is running, as it risks database corruption. Always use `tdbbackup` or `samba-tool domain backup`.',
          '`secrets.tdb` stores sensitive machine trust credentials and domain secrets. `passdb.tdb` stores local Samba user password hashes (tdbsam).'
        ],
        quickQuestions: [
          {
            question: 'Which tool creates safe, consistent live backups of Samba TDB database files without taking the service offline?',
            options: ['cp -a', 'tdbbackup', 'tar -czf', 'rsync -a'],
            correctIndex: 1,
            explanation: 'tdbbackup connects to the TDB locking mechanism to produce a point-in-time consistent backup file (.bak) safely.'
          }
        ]
      },
      {
        id: '301.4',
        title: 'Troubleshooting Samba',
        weight: 3,
        description: 'Diagnose Samba connection errors, inspect logs, adjust debug levels, check active locks, and test RPC endpoints.',
        keyKnowledgeAreas: [
          'Configure log levels in smb.conf (`log level = 3` or `log level = 1 auth:5 winbind:3`)',
          'Dynamically increase and decrease log levels on running daemons using smbcontrol (`smbcontrol smbd debug 5`)',
          'Inspect open connections, sessions, and active file locks using smbstatus',
          'Test RPC interfaces and server connectivity with rpcclient',
          'Capture and inspect SMB network packets with tcpdump or Wireshark'
        ],
        termsAndUtilities: [
          'smbstatus', 'rpcclient', 'smbcontrol', 'tcpdump', 'wireshark',
          'log level', 'max log size', 'debuglevel', 'DENY_DOS', 'oplocks'
        ],
        filesAndPaths: [
          '/var/log/samba/log.%m',
          '/var/log/samba/log.smbd',
          '/var/log/samba/log.winbindd'
        ],
        keyCommands: [
          {
            command: 'smbstatus -L',
            description: 'Show active Samba file locks, open files, and locking modes (DENY_WRITE, oplocks).',
            example: 'smbstatus -b',
            explanation: '-b provides brief status summary of active client connections and PIDs.'
          },
          {
            command: 'smbcontrol smbd debug 3',
            description: 'Dynamically increase smbd debug level to 3 on the fly without restarting the service.',
            example: 'smbcontrol smbd debug 1',
            explanation: 'Restores default low verbosity after capturing diagnostic logs.'
          },
          {
            command: 'rpcclient -U "DOMAIN\\Administrator" -c "enumdomusers" dc1.corp.example.com',
            description: 'Execute MS-RPC queries against a domain controller to test authentication and user enumeration.',
            example: 'rpcclient -U "user%password" 192.168.1.10 -c "netshareenum"',
            explanation: 'Tests lower-level DCE/RPC endpoints for authentication and service health.'
          }
        ],
        studyNotes: [
          '`smbstatus` outputs three main tables: Active Server Processes (PID/machine/IP), Service/Shares connected, and Locked Files (PID/share/path/locks).',
          'Debug levels range from 0 (minimal/critical) to 10 (exhaustive packet hex dumps). In production, level 1 or 2 is standard.'
        ],
        quickQuestions: [
          {
            question: 'Which command displays currently open files, active sessions, and locking states held by connected SMB clients?',
            options: ['smbstatus', 'testparm', 'smbclient -L', 'rpcclient status'],
            correctIndex: 0,
            explanation: 'smbstatus provides real-time information about current Samba connections, active shares, and file lock tables.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 302: SAMBA AND ACTIVE DIRECTORY DOMAINS (Weight: 17)
  // ==========================================
  {
    id: 'topic-302',
    topicNumber: 302,
    title: 'Samba and Active Directory Domains',
    totalWeight: 17,
    examId: 'exam-300',
    certification: 'lpic-3',
    description: 'Samba as Active Directory Domain Controller, internal DNS, user and group management, domain membership, Winbind ID mapping, and local accounts.',
    objectives: [
      {
        id: '302.1',
        title: 'Samba as Active Directory Domain Controller',
        weight: 5,
        description: 'Provision and maintain a Samba Active Directory Domain Controller (AD DC), domain functional levels, FSMO roles, replication, and trusts.',
        keyKnowledgeAreas: [
          'Provision a new Active Directory domain with `samba-tool domain provision`',
          'Join an existing AD domain as an additional Domain Controller with `samba-tool domain join`',
          'Manage and transfer/seize Flexible Single Master Operation (FSMO) roles (Schema, Domain Naming, PDC Emulator, RID Master, Infrastructure)',
          'Configure domain functional levels and forest functional levels',
          'Verify directory database replication between DCs with `samba-tool drs showrepl` and `samba-tool drs kcc`',
          'Manage cross-forest and domain trusts with `samba-tool domain trust`'
        ],
        termsAndUtilities: [
          'samba-tool', 'samba-tool domain provision', 'samba-tool domain join',
          'samba-tool fsmo', 'samba-tool drs', 'FSMO roles', 'AD DC', 'Sysvol',
          'sysvolreset', 'domain functional level', 'forest functional level'
        ],
        filesAndPaths: [
          '/var/lib/samba/sysvol/',
          '/var/lib/samba/private/sam.ldb',
          '/etc/samba/smb.conf',
          '/etc/krb5.conf'
        ],
        keyCommands: [
          {
            command: 'samba-tool domain provision --use-rfc2307 --realm=CORP.EXAMPLE.COM --domain=CORP --server-role=dc --dns-backend=SAMBA_INTERNAL',
            description: 'Provision a new Active Directory domain with RFC2307 Posix attributes and internal DNS.',
            example: 'samba-tool domain provision --interactive',
            explanation: 'Initializes the AD DC database schema, SYSVOL directory, Kerberos realm, and SAM database.'
          },
          {
            command: 'samba-tool fsmo show',
            description: 'Query all 5 Active Directory FSMO role holders in the domain.',
            example: 'samba-tool fsmo transfer --role=pdc',
            explanation: 'Transfers the PDC Emulator role to the local Samba domain controller.'
          },
          {
            command: 'samba-tool drs showrepl',
            description: 'Inspect Active Directory replication status with partner Domain Controllers.',
            example: 'samba-tool drs replicate dc2 dc1 dc=corp,dc=example,dc=com',
            explanation: 'Forces immediate replication of Directory Partition between domain controllers.'
          }
        ],
        studyNotes: [
          'The 5 AD FSMO roles are: Schema Master (forest-wide), Domain Naming Master (forest-wide), PDC Emulator (domain-wide), RID Master (domain-wide), and Infrastructure Master (domain-wide).',
          '`--use-rfc2307` is vital when provisioning Samba AD DC to store UNIX UID/GID and login shells inside Active Directory objects.'
        ],
        quickQuestions: [
          {
            question: 'Which tool and subcommand is used to inspect Active Directory Directory Replication Service (DRS) status between Samba Domain Controllers?',
            options: ['samba-tool drs showrepl', 'rpcclient -c repcheck', 'wbinfo -r', 'testparm --replication'],
            correctIndex: 0,
            explanation: 'samba-tool drs showrepl displays detailed replication partner status, DSA signatures, and last replication timestamps.'
          }
        ]
      },
      {
        id: '302.2',
        title: 'Active Directory Name Resolution',
        weight: 2,
        description: 'Configure and troubleshoot DNS backends for Samba AD DC (SAMBA_INTERNAL vs BIND9_DLZ), dynamic DNS updates, and SRV records.',
        keyKnowledgeAreas: [
          'Understand required Active Directory SRV records (_ldap._tcp, _kerberos._tcp, _kpasswd._udp, _gc._msdcs)',
          'Configure Samba Internal DNS (SAMBA_INTERNAL) and forwarders (`dns forwarder = 8.8.8.8`)',
          'Configure BIND9 DLZ (Dynamically Loadable Zones) backend (`dlz_bind9_12.so`) for complex enterprise DNS',
          'Manage AD DNS zones, A records, CNAME records, and PTR records using `samba-tool dns`',
          'Configure secure Dynamic DNS updates (samba_dnsupdate)'
        ],
        termsAndUtilities: [
          'samba-tool dns', 'SAMBA_INTERNAL', 'BIND9_DLZ', 'samba_dnsupdate',
          'SRV records', '_ldap._tcp.dc._msdcs', 'nslookup', 'dig', 'dns forwarder'
        ],
        filesAndPaths: [
          '/etc/named.conf',
          '/var/lib/samba/private/named.conf',
          '/var/lib/samba/private/dns/'
        ],
        keyCommands: [
          {
            command: 'samba-tool dns query dc1.corp.example.com corp.example.com @ ALL -U Administrator',
            description: 'List all DNS records stored in the Active Directory integrated DNS zone.',
            example: 'samba-tool dns add dc1.corp.example.com corp.example.com web A 192.168.1.50 -U Administrator',
            explanation: 'Adds a new A record (web.corp.example.com) to the AD DNS zone.'
          },
          {
            command: 'dig _ldap._tcp.corp.example.com SRV +short',
            description: 'Verify that the AD Domain Controller LDAP SRV record resolves properly.',
            example: '0 100 389 dc1.corp.example.com.',
            explanation: 'Domain clients query this SRV record to locate domain controllers.'
          }
        ],
        studyNotes: [
          'Active Directory relies heavily on DNS SRV records to discover domain services (LDAP on port 389, Kerberos on port 88, Kpasswd on port 464).',
          'When using BIND9_DLZ, BIND queries the Samba LDB database directly in memory via dlz driver.'
        ],
        quickQuestions: [
          {
            question: 'Which DNS record type is queried by domain client machines to locate Active Directory Domain Controllers on the network?',
            options: ['TXT', 'MX', 'SRV', 'PTR'],
            correctIndex: 2,
            explanation: 'SRV (Service) records (e.g. _ldap._tcp.dc._msdcs.<domain>) specify the hostname and port number of domain controllers.'
          }
        ]
      },
      {
        id: '302.3',
        title: 'Active Directory User Management',
        weight: 4,
        description: 'Manage users, groups, computer accounts, password policies, Organizational Units (OUs), and POSIX attributes in Samba AD DC.',
        keyKnowledgeAreas: [
          'Create, modify, disable, and delete AD users with `samba-tool user` (create, enable, disable, delete, setpassword)',
          'Create and manage domain security and distribution groups with `samba-tool group` (add, addmembers, removemembers)',
          'Manage Computer accounts with `samba-tool computer`',
          'Configure fine-grained and domain password policies with `samba-tool domain passwordsettings` (complexity, min/max age, lockout)',
          'Manage Organizational Units (OUs) and assign RFC2307 POSIX attributes (uidNumber, gidNumber, loginShell, unixHomeDirectory)'
        ],
        termsAndUtilities: [
          'samba-tool user', 'samba-tool group', 'samba-tool computer',
          'samba-tool domain passwordsettings', 'samba-tool ou',
          'RFC2307', 'uidNumber', 'gidNumber', 'loginShell', 'unixHomeDirectory', 'sAMAccountName'
        ],
        filesAndPaths: [
          '/var/lib/samba/private/sam.ldb'
        ],
        keyCommands: [
          {
            command: 'samba-tool user create jdoe "Passw0rd!123" --given-name="John" --surname="Doe" --mail-address="jdoe@example.com"',
            description: 'Create a new Active Directory domain user account with an initial password.',
            example: 'samba-tool user enable jdoe',
            explanation: 'Enables an existing user account.'
          },
          {
            command: 'samba-tool group addmembers "Domain Admins" jdoe',
            description: 'Add a user to the Active Directory "Domain Admins" group.',
            example: 'samba-tool group listmembers "Domain Admins"',
            explanation: 'Verifies all direct members of the specified group.'
          },
          {
            command: 'samba-tool domain passwordsettings set --complexity=on --min-pwd-length=12 --max-pwd-age=90',
            description: 'Enforce domain-wide password complexity, minimum length of 12 chars, and 90-day expiration.',
            example: 'samba-tool domain passwordsettings show',
            explanation: 'Displays the current active domain password policy settings.'
          }
        ],
        studyNotes: [
          'Active Directory accounts can be managed remotely from Windows clients using RSAT (Active Directory Users and Computers) or natively on Linux using `samba-tool`.',
          '`samba-tool domain passwordsettings` controls domain-wide password rules (min-pwd-age, max-pwd-age, min-pwd-length, complexity, account-lockout-duration).'
        ],
        quickQuestions: [
          {
            question: 'Which samba-tool subcommand is used to view the currently configured password policies (such as minimum password length and lockout threshold)?',
            options: ['samba-tool domain passwordsettings show', 'samba-tool user policy --view', 'pdbedit -P show', 'smbpasswd -L'],
            correctIndex: 0,
            explanation: 'samba-tool domain passwordsettings show queries the domain head for password complexity, history length, and age policies.'
          }
        ]
      },
      {
        id: '302.4',
        title: 'Samba Domain Membership',
        weight: 4,
        description: 'Join Samba member servers to an Active Directory domain, configure Winbind, and implement ID mapping backends (ad, rid, autorid).',
        keyKnowledgeAreas: [
          'Join a Linux server to an AD domain with `net ads join -U Administrator`',
          'Configure Kerberos client (/etc/krb5.conf) and obtain Kerberos tickets with kinit / inspect with klist',
          'Configure Winbind ID mapping in smb.conf (`idmap config * : backend = tdb`, `idmap config DOMAIN : backend = rid | ad | autorid`)',
          'Configure NSS (/etc/nsswitch.conf: `passwd: files winbind`, `group: files winbind`) to resolve domain accounts',
          'Configure PAM (/etc/pam.d/) using `pam_winbind.so` and `pam_mkhomedir.so` to automatically create home directories',
          'Test Winbind domain resolution with `wbinfo -u`, `wbinfo -g`, `wbinfo -t`, and `getent passwd`'
        ],
        termsAndUtilities: [
          'net ads join', 'net ads leave', 'net ads testjoin',
          'kinit', 'klist', 'kdestroy', 'wbinfo', 'winbindd',
          'idmap_rid', 'idmap_ad', 'idmap_autorid', 'idmap_tdb',
          'pam_winbind', 'pam_mkhomedir', 'nsswitch.conf'
        ],
        filesAndPaths: [
          '/etc/krb5.conf',
          '/etc/nsswitch.conf',
          '/etc/pam.d/common-auth',
          '/etc/pam.d/common-session',
          '/etc/samba/smb.conf',
          '/etc/krb5.keytab'
        ],
        keyCommands: [
          {
            command: 'kinit Administrator@CORP.EXAMPLE.COM',
            description: 'Obtain a Kerberos Ticket Granting Ticket (TGT) for domain administrator.',
            example: 'klist',
            explanation: 'Lists cached Kerberos credentials, principal names, and expiration timestamps.'
          },
          {
            command: 'net ads join -U Administrator',
            description: 'Join the local Samba server into the Active Directory domain and create machine account.',
            example: 'net ads testjoin',
            explanation: 'Verifies machine trust account secret with the domain controller (Join is OK).'
          },
          {
            command: 'wbinfo -t && wbinfo -u',
            description: 'Check trust secret to domain (-t) and list all domain users (-u) via Winbind.',
            example: 'wbinfo -i "CORP\\jdoe"',
            explanation: 'Queries Winbind for UID, GID, home directory, and login shell of a domain user.'
          }
        ],
        studyNotes: [
          'ID mapping backend differences: `idmap_rid` deterministically computes Linux UID/GID from Windows SID RID without storing mappings; `idmap_ad` reads uidNumber/gidNumber directly from RFC2307 LDAP attributes; `idmap_autorid` assigns ranges dynamically.',
          '`/etc/nsswitch.conf` MUST include `winbind` on the `passwd:` and `group:` lines for Linux utilities like `id`, `ls -l`, and `getent` to see domain users.'
        ],
        quickQuestions: [
          {
            question: 'Which ID mapping backend calculates local Linux UIDs/GIDs directly from the Windows Security Identifier (SID) relative identifier (RID) using a mathematical formula without requiring RFC2307 attributes in AD?',
            options: ['idmap_ad', 'idmap_rid', 'idmap_ldap', 'idmap_nss'],
            correctIndex: 1,
            explanation: 'idmap_rid uses the RID from the SID and adds it to the configured base range (e.g. low_range + RID), ensuring consistent IDs across all servers.'
          }
        ]
      },
      {
        id: '302.5',
        title: 'Samba Local User Management',
        weight: 2,
        description: 'Manage local standalone Samba passdb databases (tdbsam), pdbedit utility, smbpasswd, and UNIX-to-Samba user mapping.',
        keyKnowledgeAreas: [
          'Manage local Samba accounts in tdbsam with `pdbedit` (create, list, delete, policy settings)',
          'Set and update user passwords using `smbpasswd`',
          'Map UNIX system usernames to Windows/Samba usernames using `/etc/samba/smbusers` (`username map = /etc/samba/smbusers`)',
          'Configure passdb account lockout and password expiration parameters'
        ],
        termsAndUtilities: [
          'pdbedit', 'smbpasswd', 'tdbsam', 'passdb backend',
          'username map', 'smbusers', 'account flags ([U          ])'
        ],
        filesAndPaths: [
          '/etc/samba/smbusers',
          '/var/lib/samba/private/passdb.tdb'
        ],
        keyCommands: [
          {
            command: 'pdbedit -a -u jdoe',
            description: 'Add existing Linux local user "jdoe" to the Samba SAM database (passdb.tdb).',
            example: 'pdbedit -L -v',
            explanation: 'Lists all Samba local users with detailed attributes (SID, NT password hash, flags).'
          },
          {
            command: 'smbpasswd -a jdoe',
            description: 'Set SMB password and enable user in the local Samba passdb.',
            example: 'smbpasswd -e jdoe',
            explanation: 'Enables a previously disabled Samba user account.'
          }
        ],
        studyNotes: [
          '`pdbedit` is the modern administrative utility for managing the passdb.tdb database. `smbpasswd` is primarily used for changing passwords.',
          'Before a user can be added to Samba using `pdbedit -a -u username`, the corresponding user must already exist in `/etc/passwd` on the local Linux host.'
        ],
        quickQuestions: [
          {
            question: 'Which command is used to inspect all local Samba user accounts with verbose SID, home directory, and account flag details?',
            options: ['pdbedit -L -v', 'smbstatus -u', 'wbinfo -u', 'samba-tool user list'],
            correctIndex: 0,
            explanation: 'pdbedit -L -v outputs verbose profile information for all accounts stored in the local tdbsam passdb.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 303: SAMBA SHARE CONFIGURATION (Weight: 10)
  // ==========================================
  {
    id: 'topic-303',
    topicNumber: 303,
    title: 'Samba Share Configuration',
    totalWeight: 10,
    examId: 'exam-300',
    certification: 'lpic-3',
    description: 'File shares, access control, POSIX and Windows ACLs, Virtual File System (VFS) modules, Distributed File System (DFS), and print shares.',
    objectives: [
      {
        id: '303.1',
        title: 'File Share Configuration',
        weight: 4,
        description: 'Configure standard and advanced file shares, [homes] shares, guest access, hide/veto files, symlinks, and registry shares.',
        keyKnowledgeAreas: [
          'Create and configure custom file shares: path, read only, writable, browseable, guest ok, public',
          'Configure user home shares using [homes] section and `valid users = %S`',
          'Manage file and directory creation masks: `create mask`, `directory mask`, `force create mode`, `force directory mode`',
          'Hide or restrict specific files with `hide files`, `hide dot files`, `veto files`, `delete veto files`',
          'Control symbolic and hard link behavior: `follow symlinks`, `wide links`, `unix extensions`',
          'Manage dynamic registry shares with `net conf`'
        ],
        termsAndUtilities: [
          'smb.conf', '[homes]', 'path', 'read only', 'writeable', 'browseable',
          'guest ok', 'create mask', 'directory mask', 'veto files', 'hide dot files',
          'follow symlinks', 'wide links', 'net conf'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/srv/samba/shares/'
        ],
        keyCommands: [
          {
            command: 'net conf addshare sales /srv/samba/sales writeable=y "Sales Department Share"',
            description: 'Add a new share to Samba registry database without editing smb.conf.',
            example: 'net conf showshare sales',
            explanation: 'Displays parameters of a specific registry-defined share.'
          },
          {
            command: 'smbclient //localhost/sales -U jdoe',
            description: 'Test interactive connection to the newly configured Samba share.',
            example: 'smbclient -L localhost -N',
            explanation: 'Lists all available public/anonymous shares on localhost.'
          }
        ],
        studyNotes: [
          'In smb.conf, `read only = no` and `writeable = yes` are identical synonyms.',
          'Setting `wide links = yes` requires `unix extensions = no` in the [global] section for security reasons (preventing traversal attacks).'
        ],
        quickQuestions: [
          {
            question: 'Which smb.conf parameter prevents specified files matching patterns (e.g. /*.exe/) from being displayed or accessed by clients?',
            options: ['veto files', 'hide files', 'deny files', 'block extension'],
            correctIndex: 0,
            explanation: 'veto files specifies a list of slash-separated file patterns that Samba will completely deny access to and hide from directory listings.'
          }
        ]
      },
      {
        id: '303.2',
        title: 'File Share Security and ACLs',
        weight: 3,
        description: 'Configure share-level and filesystem-level permissions, POSIX ACLs, Windows NT ACLs, and VFS modules (vfs_acl_xattr, vfs_audit).',
        keyKnowledgeAreas: [
          'Configure share restrictions: `valid users`, `invalid users`, `read list`, `write list`, `admin users`',
          'Configure Windows NT ACL support with `vfs objects = acl_xattr` and `map acl inherit = yes`',
          'Manage extended attributes and POSIX ACLs with getfacl, setfacl, and getfattr',
          'Configure auditing with `vfs_full_audit` (log file operations like open, read, write, unlink)',
          'Configure volume snapshots and previous versions with `vfs_shadow_copy2`'
        ],
        termsAndUtilities: [
          'valid users', 'write list', 'admin users', 'vfs objects',
          'vfs_acl_xattr', 'vfs_full_audit', 'vfs_shadow_copy2', 'vfs_recycle',
          'getfacl', 'setfacl', 'smbcacls', 'user.DOSATTRIB'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf'
        ],
        keyCommands: [
          {
            command: 'smbcacls //server/share /document.docx -U Administrator',
            description: 'Query Windows NT Security Descriptor and ACLs on a remote Samba file.',
            example: 'smbcacls //server/share /document.docx -a "ACL:DOMAIN\\jdoe:ALLOWED/0x0/FULL" -U Administrator',
            explanation: 'Grants Full Control Windows ACL to domain user jdoe over SMB protocol.'
          },
          {
            command: 'setfacl -R -m g:"Domain Admins":rwx /srv/samba/share',
            description: 'Apply POSIX ACL granting recursive read-write-execute permissions to Domain Admins.',
            example: 'getfacl /srv/samba/share',
            explanation: 'Displays Linux filesystem POSIX access and default inheritance ACLs.'
          }
        ],
        studyNotes: [
          'Effective access to a Samba share is always the MOST RESTRICTIVE combination of share permissions (valid users / write list) AND filesystem permissions (POSIX / NT ACLs).',
          '`vfs_shadow_copy2` integrates Linux filesystem snapshots (Btrfs, LVM, ZFS) with Windows "Previous Versions" tab.'
        ],
        quickQuestions: [
          {
            question: 'Which VFS module enables storing Windows NT Access Control Lists in Linux filesystem extended attributes (user.DOSATTRIB)?',
            options: ['vfs_acl_xattr', 'vfs_full_audit', 'vfs_shadow_copy2', 'vfs_recycle'],
            correctIndex: 0,
            explanation: 'vfs_acl_xattr maps Windows NT ACLs and security descriptors into extended attributes on the Linux filesystem.'
          }
        ]
      },
      {
        id: '303.3',
        title: 'DFS Share Configuration',
        weight: 1,
        description: 'Configure Distributed File System (DFS) roots, standalone DFS links, and Active Directory domain-based DFS paths.',
        keyKnowledgeAreas: [
          'Understand Distributed File System (DFS) architecture (DFS Roots and DFS Links/Referrals)',
          'Configure a Samba DFS root share (`host msdfs = yes`, `msdfs root = yes`)',
          'Create DFS links redirecting clients to remote SMB targets using symbolic links (`msdfs:server\\share`)',
          'Manage Microsoft AD Domain DFS integration'
        ],
        termsAndUtilities: [
          'host msdfs', 'msdfs root', 'msdfs proxy',
          'msdfs:', 'DFS root', 'DFS link', 'DFS referral'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/srv/samba/dfsroot/'
        ],
        keyCommands: [
          {
            command: 'ln -s "msdfs:fileserver1.corp.example.com\\finance,fileserver2.corp.example.com\\finance" /srv/samba/dfsroot/finance',
            description: 'Create a DFS link pointing clients to redundant finance shares on remote servers.',
            example: 'ls -l /srv/samba/dfsroot/',
            explanation: 'Samba parses symlinks starting with msdfs: to generate DFS referral packets for clients.'
          }
        ],
        studyNotes: [
          'To enable DFS root on Samba: In [global] set `host msdfs = yes`. Inside the root share definition, set `msdfs root = yes`.',
          'DFS links are defined simply by creating symlinks in the share folder pointing to `msdfs:targetserver\\targetshare`.'
        ],
        quickQuestions: [
          {
            question: 'What prefix must a Linux symbolic link target contain inside a Samba DFS root folder to act as a DFS referral link?',
            options: ['msdfs:', 'dfs://', 'smb://', 'target='],
            correctIndex: 0,
            explanation: 'Samba intercepts symlinks beginning with "msdfs:" and translates them into SMB DFS referral responses for clients.'
          }
        ]
      },
      {
        id: '303.4',
        title: 'Print Share Configuration',
        weight: 2,
        description: 'Share CUPS printers via Samba, configure Point and Print driver downloads, and manage printer permissions.',
        keyKnowledgeAreas: [
          'Configure CUPS integration in smb.conf (`printing = cups`, `printcap name = cups`, `load printers = yes`)',
          'Configure standard [printers] and [print$] driver shares',
          'Configure Point and Print driver distribution for Windows clients using rpcclient',
          'Manage print queues and print jobs via Samba'
        ],
        termsAndUtilities: [
          '[printers]', '[print$]', 'printing = cups', 'printcap name',
          'load printers', 'cups', 'rpcclient adddriver', 'rpcclient setdriver'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/var/spool/samba/',
          '/var/lib/samba/printers/'
        ],
        keyCommands: [
          {
            command: 'rpcclient -U Administrator localhost -c "enumprinters"',
            description: 'Enumerate shared CUPS printers exported through Samba RPC.',
            example: 'rpcclient -U Administrator localhost -c "getprinter HP_LaserJet"',
            explanation: 'Inspects printer driver associations and properties.'
          }
        ],
        studyNotes: [
          '[print$] share stores Windows printer driver architecture folders (x64, W32X86) for automatic Point and Print client download.',
          '`load printers = yes` automatically imports all printers declared in CUPS /etc/printcap into Samba.'
        ],
        quickQuestions: [
          {
            question: 'Which special share name in smb.conf is dedicated to storing and serving Windows printer drivers for Point and Print downloads?',
            options: ['[print$]', '[printers]', '[spool]', '[drivers]'],
            correctIndex: 0,
            explanation: 'The [print$] share is the standard Windows-recognized share path where printer drivers are staged for automatic installation.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 304: SAMBA CLIENT CONFIGURATION (Weight: 11)
  // ==========================================
  {
    id: 'topic-304',
    topicNumber: 304,
    title: 'Samba Client Configuration',
    totalWeight: 11,
    examId: 'exam-300',
    certification: 'lpic-3',
    description: 'Linux authentication against AD/LDAP, CIFS mount utilities, cifscreds, smbclient, and Windows client domain integration.',
    objectives: [
      {
        id: '304.1',
        title: 'Linux Authentication Clients',
        weight: 5,
        description: 'Configure Linux systems as authentication clients using SSSD, PAM, NSS, Kerberos, and LDAP against Active Directory and FreeIPA.',
        keyKnowledgeAreas: [
          'Configure System Security Services Daemon (SSSD) (/etc/sssd/sssd.conf) with AD or IPA provider',
          'Join domain using `realm join` (realmd utility)',
          'Configure Pluggable Authentication Modules (PAM) and Name Service Switch (NSS) for SSSD',
          'Manage Kerberos tickets and keytabs with kinit, klist, kdestroy, and ktutil',
          'Configure offline credential caching and enumeration in SSSD'
        ],
        termsAndUtilities: [
          'sssd', 'sssd.conf', 'realmd', 'realm join', 'realm discover',
          'kinit', 'klist', 'ktutil', 'pam_sss', 'nsswitch.conf', 'sssctl'
        ],
        filesAndPaths: [
          '/etc/sssd/sssd.conf',
          '/etc/krb5.conf',
          '/etc/krb5.keytab',
          '/var/lib/sss/db/'
        ],
        keyCommands: [
          {
            command: 'realm join --user=Administrator corp.example.com',
            description: 'Discover domain, configure Kerberos, SSSD, PAM, NSS, and join the machine to Active Directory automatically.',
            example: 'realm list',
            explanation: 'Displays configured domain realms, login formats, and active SSSD provider configuration.'
          },
          {
            command: 'sssctl domain-status corp.example.com',
            description: 'Check connectivity, online status, and Active Directory DC communication in SSSD.',
            example: 'sssctl cache-expire -u jdoe',
            explanation: 'Immediately invalidates SSSD cached credentials for user jdoe.'
          }
        ],
        studyNotes: [
          'SSSD (/etc/sssd/sssd.conf) permissions MUST strictly be 600 (rw-------); SSSD will fail to start if permissions are insecure.',
          '`realmd` simplifies Linux domain joins by orchestrating package installation, adcli, sssd configuration, and pam/nss updates with a single command.'
        ],
        quickQuestions: [
          {
            question: 'What are the required filesystem permissions on the /etc/sssd/sssd.conf configuration file?',
            options: ['600 (rw-------)', '644 (rw-r--r--)', '755 (rwxr-xr-x)', '700 (rwx------)'],
            correctIndex: 0,
            explanation: 'SSSD enforces strict 0600 file permissions on /etc/sssd/sssd.conf because it contains domain credentials and join parameters.'
          }
        ]
      },
      {
        id: '304.2',
        title: 'Linux CIFS Clients',
        weight: 3,
        description: 'Mount remote SMB/CIFS shares on Linux using mount.cifs, credentials files, autofs, cifscreds, and multiuser mounts with Kerberos.',
        keyKnowledgeAreas: [
          'Mount SMB shares using `mount -t cifs` / `mount.cifs` with options: username, password, credentials, domain, uid, gid, file_mode, dir_mode, vers',
          'Use protected credentials files (`credentials=/etc/samba/credentials.cred`)',
          'Configure multiuser Kerberos SMB mounts with `mount.cifs -o sec=krb5,multiuser` and `cifscreds add`',
          'Configure on-demand automated mounting with autofs (/etc/auto.master, /etc/auto.cifs)',
          'Perform command-line SMB operations using `smbclient` and `smbget`'
        ],
        termsAndUtilities: [
          'mount.cifs', 'cifs-utils', 'cifscreds', 'smbclient', 'smbget',
          'credentials', 'multiuser', 'sec=krb5', 'vers=3.0', 'autofs'
        ],
        filesAndPaths: [
          '/etc/fstab',
          '/etc/auto.master',
          '/etc/auto.cifs'
        ],
        keyCommands: [
          {
            command: 'mount -t cifs //server.corp.example.com/data /mnt/data -o credentials=/etc/samba/auth.cred,iocharset=utf8,vers=3.1.1',
            description: 'Mount SMB 3.1.1 share securely using credentials file.',
            example: 'mount -t cifs //dc1/share /mnt/share -o sec=krb5,multiuser',
            explanation: 'Enables multiuser CIFS mount where each logged-in user accesses the mount with their own Kerberos ticket.'
          },
          {
            command: 'cifscreds add server.corp.example.com -u jdoe',
            description: 'Store user session credentials in Linux kernel keyring for multiuser CIFS mounts.',
            example: 'cifscreds clearall',
            explanation: 'Clears all cached CIFS credentials from the current user keyring.'
          },
          {
            command: 'smbclient //server/public -N -c "ls; get report.pdf"',
            description: 'Run batch commands against an SMB share non-interactively using smbclient.',
            example: 'smbclient //server/backup -U "corp\\admin" -c "mput *.tar.gz"',
            explanation: 'Uploads files matching pattern directly to the share.'
          }
        ],
        studyNotes: [
          'With `multiuser` CIFS mounts, root mounts the share, but regular users must authenticate individually using their own Kerberos ticket or by running `cifscreds add`.',
          'Credentials files should contain `username=`, `password=`, and optionally `domain=`, secured with 600 permissions.'
        ],
        quickQuestions: [
          {
            question: 'Which mount option allows individual Linux users on a shared workstation to access a CIFS mount using their own respective credentials/Kerberos tickets instead of the mounter credentials?',
            options: ['multiuser', 'user_xattr', 'guest', 'shared_creds'],
            correctIndex: 0,
            explanation: 'The multiuser mount option instructs the Linux kernel CIFS VFS driver to look up each process user credentials (via session keyring / cifscreds) upon file access.'
          }
        ]
      },
      {
        id: '304.3',
        title: 'Windows Clients',
        weight: 3,
        description: 'Join Windows workstations (Windows 10/11/Server) to a Samba Active Directory domain, troubleshoot trust, and manage Group Policies (GPO).',
        keyKnowledgeAreas: [
          'Join Windows clients to a Samba AD Domain via System Settings or PowerShell (`Add-Computer -DomainName corp.example.com`)',
          'Manage Samba AD domain centrally using Microsoft Remote Server Administration Tools (RSAT)',
          'Create and link Group Policy Objects (GPOs) stored in Samba SYSVOL using Group Policy Management Console (gpmc.msc)',
          'Troubleshoot Windows domain trust and secure channel using `nltest /sc_query:DOMAIN` and `Test-ComputerSecureChannel`',
          'Map network drives and printers from Windows clients via GPO or NetLogon scripts'
        ],
        termsAndUtilities: [
          'RSAT', 'GPO', 'GPMC', 'SYSVOL', 'nltest', 'gpupdate', 'gpresult',
          'Add-Computer', 'Test-ComputerSecureChannel', 'NetLogon'
        ],
        filesAndPaths: [
          '\\\\corp.example.com\\sysvol\\corp.example.com\\Policies\\',
          '\\\\corp.example.com\\netlogon\\'
        ],
        keyCommands: [
          {
            command: 'nltest /sc_query:CORP',
            description: 'Verify the secure channel connection between a Windows client and the Samba Domain Controller.',
            example: 'nltest /dclist:CORP',
            explanation: 'Lists all available Domain Controllers for the domain.'
          },
          {
            command: 'gpupdate /force',
            description: 'Force immediate reapplication of all Computer and User Group Policy Objects from SYSVOL.',
            example: 'gpresult /r',
            explanation: 'Generates Summary RSoP (Resultant Set of Policy) report for the current user and computer.'
          }
        ],
        studyNotes: [
          'Samba AD DC fully supports Windows GPOs stored in SYSVOL (`/var/lib/samba/sysvol/<domain>/Policies/{GUID}/`).',
          'RSAT on Windows is the official and recommended GUI management suite for managing users, groups, DNS, and GPOs in a Samba AD domain.'
        ],
        quickQuestions: [
          {
            question: 'Where are Active Directory Group Policy Objects (GPOs) and logon scripts physically replicated and stored on a Samba Domain Controller for client execution?',
            options: ['SYSVOL share', 'NETLOGON database', 'SAM.LDB file', 'PASSDB.TDB file'],
            correctIndex: 0,
            explanation: 'GPOs are stored in the SYSVOL share under the Policies subfolder and replicated between all domain controllers.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // TOPIC 305: LINUX IDENTITY MANAGEMENT AND FILE SHARING (Weight: 11)
  // ==========================================
  {
    id: 'topic-305',
    topicNumber: 305,
    title: 'Linux Identity Management and File Sharing',
    totalWeight: 11,
    examId: 'exam-300',
    certification: 'lpic-3',
    description: 'FreeIPA installation, maintenance, entity management, Active Directory cross-forest trusts, and advanced NFSv4 with Kerberos security.',
    objectives: [
      {
        id: '305.1',
        title: 'FreeIPA Installation and Maintenance',
        weight: 3,
        description: 'Install, deploy, and maintain FreeIPA (Red Hat IdM) servers and clients, manage replicas, DNS, and PKI certificates.',
        keyKnowledgeAreas: [
          'Understand FreeIPA integrated components: 389 Directory Server (LDAP), MIT Kerberos KDC, Dogtag Certificate System (PKI), BIND (DNS), NTP',
          'Deploy FreeIPA server using `ipa-server-install` (with or without integrated DNS)',
          'Enroll client machines into the FreeIPA realm using `ipa-client-install`',
          'Deploy and manage FreeIPA replication agreements with `ipa-replica-install`',
          'Backup and restore FreeIPA installations with `ipa-backup` and `ipa-restore`',
          'Perform health checks using `ipa-healthcheck`'
        ],
        termsAndUtilities: [
          'ipa-server-install', 'ipa-client-install', 'ipa-replica-install',
          'ipa-backup', 'ipa-restore', 'ipa-healthcheck', 'ipa-cacert-manage',
          '389-ds', 'krb5kdc', 'Dogtag', 'kinit admin'
        ],
        filesAndPaths: [
          '/etc/ipa/default.conf',
          '/etc/sssd/sssd.conf',
          '/var/lib/ipa/backup/',
          '/etc/krb5.conf'
        ],
        keyCommands: [
          {
            command: 'ipa-server-install --realm=LINUX.EXAMPLE.COM --domain=linux.example.com --setup-dns --forwarder=8.8.8.8 -U',
            description: 'Automate full FreeIPA server deployment with integrated DNS and Kerberos realm.',
            example: 'ipa-client-install --mkhomedir --enable-dns-updates',
            explanation: 'Enrolls a client machine into the FreeIPA realm and configures SSSD/PAM.'
          },
          {
            command: 'ipa-healthcheck',
            description: 'Run comprehensive diagnostics across FreeIPA LDAP, certificates, DNS, and replication topology.',
            example: 'ipa-backup --full',
            explanation: 'Takes a complete offline snapshot backup of Directory Server and Dogtag PKI.'
          }
        ],
        studyNotes: [
          'FreeIPA requires fully qualified domain names (FQDN) that resolve in forward and reverse DNS before running `ipa-server-install`.',
          'Before executing any administrative `ipa` CLI command, the administrator must authenticate to Kerberos using `kinit admin`.'
        ],
        quickQuestions: [
          {
            question: 'Which prerequisite command must be run by an administrator before executing CLI commands like "ipa user-add"?',
            options: ['kinit admin', 'ipa-login', 'su - ipa', 'systemctl start ipa'],
            correctIndex: 0,
            explanation: 'The ipa CLI tool interacts with FreeIPA REST/RPC API using Kerberos SPNEGO authentication; obtaining a Kerberos ticket via "kinit admin" is mandatory.'
          }
        ]
      },
      {
        id: '305.2',
        title: 'FreeIPA Entity Management',
        weight: 3,
        description: 'Manage users, user groups, hosts, host groups, netgroups, HBAC (Host-Based Access Control) rules, and Sudo policies in FreeIPA.',
        keyKnowledgeAreas: [
          'Manage users and groups with `ipa user-add`, `ipa user-mod`, `ipa group-add`, `ipa group-add-member`',
          'Manage hosts and hostgroups with `ipa host-add`, `ipa hostgroup-add`',
          'Configure Host-Based Access Control (HBAC) rules (`ipa hbacrule-add`, `ipa hbacrule-add-user`, `ipa hbacrule-add-host`) to restrict which users can log into specific machines',
          'Manage centralized Sudo rules with `ipa sudorule-add` and `ipa sudorule-add-option`',
          'Manage Kerberos service principals and keytabs with `ipa service-add` and `ipa-getkeytab`'
        ],
        termsAndUtilities: [
          'ipa user-add', 'ipa group-add', 'ipa host-add', 'ipa hostgroup-add',
          'ipa hbacrule-add', 'ipa hbac-test', 'ipa sudorule-add',
          'ipa service-add', 'ipa-getkeytab', 'HBAC'
        ],
        filesAndPaths: [
          '/etc/krb5.keytab',
          '/etc/sssd/sssd.conf'
        ],
        keyCommands: [
          {
            command: 'ipa user-add jsmith --first="John" --last="Smith" --email="jsmith@example.com" --password',
            description: 'Create a new user entity in the FreeIPA directory.',
            example: 'ipa user-find jsmith',
            explanation: 'Searches for and displays detailed attributes of the user entity.'
          },
          {
            command: 'ipa hbacrule-add allow_web_ssh --service=sshd && ipa hbacrule-add-host allow_web_ssh --hostgroups=webservers && ipa hbacrule-add-user allow_web_ssh --groups=sysadmins',
            description: 'Create an HBAC rule permitting members of the "sysadmins" group to SSH into "webservers".',
            example: 'ipa hbactest --user=jsmith --host=web1.example.com --service=sshd',
            explanation: 'Tests and simulates whether an HBAC rule will grant or deny access.'
          },
          {
            command: 'ipa service-add HTTP/web1.linux.example.com && ipa-getkeytab -s ipa.linux.example.com -p HTTP/web1.linux.example.com -k /etc/httpd/conf/http.keytab',
            description: 'Register a Kerberos HTTP service principal and export its keytab to the web server.',
            example: 'klist -k /etc/httpd/conf/http.keytab',
            explanation: 'Lists service principals and key versions (kvno) inside the keytab.'
          }
        ],
        studyNotes: [
          'FreeIPA HBAC (Host-Based Access Control) controls WHICH users can access WHICH target hosts via WHICH PAM services (sshd, login, su, etc.).',
          '`ipa-getkeytab` generates and retrieves a Kerberos keytab from the FreeIPA KDC for server daemons (HTTP, NFS, LDAP).'
        ],
        quickQuestions: [
          {
            question: 'Which FreeIPA feature is used to define fine-grained policies specifying which users or groups can log into specific hosts or host groups via particular services (such as sshd)?',
            options: ['Host-Based Access Control (HBAC)', 'Sudo Rules', 'SELinux Policies', 'POSIX Permissions'],
            correctIndex: 0,
            explanation: 'HBAC rules in FreeIPA evaluated by SSSD determine access permissions per user, host, and PAM service combination.'
          }
        ]
      },
      {
        id: '305.3',
        title: 'FreeIPA Active Directory Integration',
        weight: 2,
        description: 'Integrate FreeIPA with Active Directory using Cross-Forest Kerberos Trusts, ID Ranges, and ID Views.',
        keyKnowledgeAreas: [
          'Configure Cross-Forest Trust between FreeIPA and Microsoft Active Directory with `ipa trust-add`',
          'Configure DNS conditional forwarding between FreeIPA BIND and Active Directory DNS',
          'Manage ID ranges for external Active Directory trusted domains with `ipa idrange-add`',
          'Manage ID Views (`ipa idview-add`, `ipa idview-apply`) to override POSIX attributes (UID/GID/shell/home) for AD users accessing Linux hosts',
          'Configure SSSD subdomains provider for AD trust resolution'
        ],
        termsAndUtilities: [
          'ipa trust-add', 'ipa trust-find', 'ipa trust-show',
          'ipa idrange-add', 'ipa idview-add', 'ipa idview-apply',
          'Cross-forest trust', 'ID Views', 'ID Ranges', 'ipa-adtrust-install'
        ],
        filesAndPaths: [
          '/etc/sssd/sssd.conf',
          '/etc/named.conf'
        ],
        keyCommands: [
          {
            command: 'ipa-adtrust-install --netbios-name=LINUXREALM',
            description: 'Prepare FreeIPA server to establish trusts with Active Directory domains.',
            example: 'ipa trust-add --type=ad corp.example.com --admin Administrator --password',
            explanation: 'Establishes a bidirectional or one-way Cross-Forest Kerberos Trust with Active Directory.'
          },
          {
            command: 'ipa idview-add-user "Default Trust View" --username="jdoe@corp.example.com" --shell="/bin/zsh" --homedir="/home/ad/jdoe"',
            description: 'Apply an ID View override to customize POSIX shell and home directory for an Active Directory domain user.',
            example: 'ipa idview-apply "Default Trust View" --hosts=linuxnode1.example.com',
            explanation: 'Binds the ID View to specific Linux client hosts.'
          }
        ],
        studyNotes: [
          'FreeIPA cross-forest trust allows Active Directory users to log into Linux hosts using their existing AD passwords and Kerberos tickets without synchronizing or duplicating accounts.',
          '`ipa-adtrust-install` configures the necessary Samba Winbind and LDB components on the FreeIPA master to handle MS-RPC trust negotiations.'
        ],
        quickQuestions: [
          {
            question: 'Which FreeIPA feature allows Linux administrators to override POSIX attributes (like login shell and home directory) for Active Directory users without modifying anything in Active Directory itself?',
            options: ['ID Views', 'HBAC Rules', 'Sudo Policies', 'Netgroups'],
            correctIndex: 0,
            explanation: 'ID Views in FreeIPA allow per-host or default overrides of UID, GID, home directory, and shell for external Active Directory users.'
          }
        ]
      },
      {
        id: '305.4',
        title: 'Network File System (NFSv4)',
        weight: 3,
        description: 'Configure secure NFSv4 servers and clients, Kerberos authentication (sec=krb5, sec=krb5i, sec=krb5p), idmapd, and NFSv4 ACLs.',
        keyKnowledgeAreas: [
          'Configure NFSv4 server pseudo-filesystem root (/etc/exports: `fsid=0` or `fsid=root`)',
          'Configure NFSv4 client mounts (`mount -t nfs4 server:/ /mnt/nfs`)',
          'Understand RPCSEC_GSS Kerberos security flavors: `sec=sys` (standard UNIX UID), `sec=krb5` (authentication), `sec=krb5i` (integrity/tamper-proof), `sec=krb5p` (privacy/full encryption)',
          'Configure NFSv4 identity mapping daemon (/etc/idmapd.conf, nfsidmap) for user@domain mapping',
          'Manage NFSv4 Access Control Lists with `nfs4_getfacl` and `nfs4_setfacl`'
        ],
        termsAndUtilities: [
          'exports', 'exportfs', 'idmapd', 'rpc.idmapd', 'idmapd.conf',
          'nfsidmap', 'rpc.gssd', 'rpc.svcgssd', 'sec=krb5', 'sec=krb5i', 'sec=krb5p',
          'nfs4_getfacl', 'nfs4_setfacl', 'fsid=0'
        ],
        filesAndPaths: [
          '/etc/exports',
          '/etc/exports.d/',
          '/etc/idmapd.conf',
          '/etc/krb5.keytab'
        ],
        keyCommands: [
          {
            command: 'exportfs -rav',
            description: 'Re-export all shares defined in /etc/exports and display verbose export tables.',
            example: 'exportfs -v',
            explanation: 'Shows active kernel NFS exports and security flags (sec=krb5p, rw, no_root_squash).'
          },
          {
            command: 'mount -t nfs4 -o sec=krb5p,proto=tcp nfs.corp.example.com:/data /mnt/data',
            description: 'Mount NFSv4 export with RPCSEC_GSS Kerberos privacy (full packet payload encryption).',
            example: 'nfs4_getfacl /mnt/data/project.txt',
            explanation: 'Inspects rich NFSv4 Access Control List entries (A::user@corp.example.com:rwaDxtTnNcCy).'
          },
          {
            command: 'nfs4_setfacl -a A::jdoe@corp.example.com:RWX /mnt/data/project.txt',
            description: 'Add an NFSv4 ACE granting read-write-execute permissions to a principal.',
            example: 'nfs4_setfacl -s A::OWNER@:rwaxtTcCy,A::GROUP@:rxtcy,A::EVERYONE@:tcy /mnt/data/',
            explanation: 'Sets complete NFSv4 ACL structure.'
          }
        ],
        studyNotes: [
          'NFSv4 RPCSEC_GSS security modes: `sec=krb5` validates identity with Kerberos; `sec=krb5i` adds cryptographic checksums to prevent tampering; `sec=krb5p` encrypts all data traffic between client and server.',
          'NFSv4 utilizes a single TCP port (2049) and does NOT require rpcbind or rpc.statd like legacy NFSv3.',
          '/etc/idmapd.conf must have the identical `Domain = example.com` configured on both NFS server and client to avoid files showing owner `nobody:nogroup`.'
        ],
        quickQuestions: [
          {
            question: 'Which NFSv4 Kerberos security mode (sec=) provides full end-to-end payload encryption of all network traffic transferred between the NFS client and server?',
            options: ['sec=krb5p', 'sec=krb5i', 'sec=krb5', 'sec=sys'],
            correctIndex: 0,
            explanation: 'sec=krb5p (Privacy) provides complete payload encryption. sec=krb5i provides Integrity checksums, and sec=krb5 provides authentication only.'
          }
        ]
      }
    ]
  }
];
