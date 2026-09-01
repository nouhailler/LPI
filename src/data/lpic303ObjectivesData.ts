import { LPICTopic } from '../types';

export const lpic303TopicsData: LPICTopic[] = [
  // =========================================================================
  // TOPIC 325: CRYPTOGRAPHY (Weight: 17)
  // =========================================================================
  {
    id: 'topic-325',
    topicNumber: 325,
    title: 'Cryptography',
    totalWeight: 17,
    examId: 'exam-303',
    certification: 'lpic-3',
    description: 'X.509 certificates, Public Key Infrastructures (PKI), TLS/SSL encryption & mutual authentication, encrypted block devices (LUKS/dm-crypt), and DNS security (DNSSEC, DANE, TSIG).',
    objectives: [
      {
        id: '325.1',
        title: 'X.509 Certificates and Public Key Infrastructures',
        weight: 5,
        description: 'Understand X.509 certificates and Public Key Infrastructures (PKI), certificate lifecycle, CA operations, certificate verification, and OpenSSL configuration.',
        keyKnowledgeAreas: [
          'Understand X.509 certificate structure, standard fields (Subject, Issuer, Serial Number, Validity Period, Subject Public Key Info) and extensions (Subject Alternative Name SAN, Basic Constraints, Key Usage, Extended Key Usage)',
          'Understand Public Key Infrastructure (PKI) hierarchy: Root CA, Intermediate CAs, issuing CAs, and trust anchors',
          'Certificate Revocation Lists (CRLs) and Online Certificate Status Protocol (OCSP) verification and stapling',
          'Generate RSA and ECC (Elliptic Curve) private keys, Certificate Signing Requests (CSRs), and self-signed certificates using OpenSSL',
          'Configure OpenSSL certificate authority templates and policies via openssl.cnf',
          'Sign CSRs, revoke certificates, issue CRLs, and inspect certificate chains using openssl subcommands (req, x509, ca, crl, ocsp, verify)',
          'Convert certificate and key formats between PEM (Base64 ASCII), DER (binary ASN.1), PKCS#12 (.p12/.pfx), and PKCS#7 (.p7b)'
        ],
        termsAndUtilities: [
          'openssl', 'openssl.cnf', 'x509', 'req', 'ca', 'crl', 'ocsp', 'verify', 'pkcs12', 'rsa', 'ecparam',
          'CSR', 'CRL', 'OCSP', 'SAN', 'Basic Constraints', 'PEM', 'DER', 'PKCS#12', 'CA:TRUE', 'intermediate CA'
        ],
        filesAndPaths: [
          '/etc/ssl/openssl.cnf',
          '/etc/pki/tls/openssl.cnf',
          '/etc/ssl/certs/',
          '/etc/pki/ca-trust/',
          '/etc/pki/tls/certs/'
        ],
        keyCommands: [
          {
            command: 'openssl req -new -newkey rsa:4096 -nodes -keyout server.key -out server.csr -subj "/CN=secure.example.com/O=Enterprise/C=US"',
            description: 'Generate a new 4096-bit RSA private key and a Certificate Signing Request (CSR) non-interactively.',
            example: 'openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -keyout ec.key -out ec.csr',
            explanation: 'Creates both the unencrypted private key file and the CSR containing the Subject Distinguished Name (DN).'
          },
          {
            command: 'openssl x509 -in cert.pem -text -noout',
            description: 'Inspect and decode all human-readable fields and extensions of an X.509 certificate.',
            example: 'openssl x509 -in cert.pem -noout -dates -subject -issuer -ext subjectAltName',
            explanation: 'Displays certificate validity dates, issuer, subject DN, and Subject Alternative Names (SAN).'
          },
          {
            command: 'openssl ca -config openssl.cnf -in request.csr -out cert.pem -days 365',
            description: 'Sign a Certificate Signing Request as a Certificate Authority using the OpenSSL CA database and configuration.',
            example: 'openssl ca -revoke oldcert.pem -crl_reason keyCompromise && openssl ca -gencrl -out crl.pem',
            explanation: 'Applies CA signing policies and updates the serial/index.txt database; supports certificate revocation and CRL issuance.'
          },
          {
            command: 'openssl verify -CAfile ca-chain.pem server-cert.pem',
            description: 'Validate an X.509 certificate against a trusted CA chain and root certificate bundle.',
            example: 'openssl verify -CAfile rootCA.pem -untrusted intermediateCA.pem leaf.pem',
            explanation: 'Performs cryptographic chain verification from leaf to intermediate to trusted root CA.'
          }
        ],
        studyNotes: [
          'Modern TLS clients (browsers and curl) strictly require the `subjectAltName` (SAN) extension (e.g. `DNS:server.example.com, IP:192.168.1.10`); Common Name (CN) alone is deprecated.',
          '`BasicConstraints = CA:TRUE` must be present on CA certificates. Leaf/server certificates must have `CA:FALSE` or omit it.',
          'PEM format begins with `-----BEGIN CERTIFICATE-----` (Base64 encoded); DER is raw binary ASN.1 encoding.',
          'OCSP stapling allows the web server to query the CA OCSP responder periodically and staple the signed, timestamped OCSP response directly into the TLS handshake, reducing latency and protecting client privacy.'
        ],
        quickQuestions: [
          {
            question: 'Which X.509 extension is required on intermediate and root certificates to enable them to sign subordinate certificates?',
            options: ['ExtendedKeyUsage = serverAuth', 'BasicConstraints = critical, CA:TRUE', 'KeyUsage = digitalSignature', 'SubjectKeyIdentifier = hash'],
            correctIndex: 1,
            explanation: 'The BasicConstraints extension with CA:TRUE specifies that the subject of the certificate is a Certificate Authority and can sign other certificates.'
          },
          {
            question: 'Which OpenSSL subcommand converts a PKCS#12 bundle (.pfx/.p12) containing private key and certificate into PEM format?',
            options: ['openssl x509 -in file.p12 -out file.pem', 'openssl pkcs12 -in file.p12 -out file.pem -nodes', 'openssl rsa -in file.p12 -out file.pem', 'openssl req -in file.p12 -out file.pem'],
            correctIndex: 1,
            explanation: '`openssl pkcs12 -in file.p12 -out file.pem -nodes` extracts the private key and certificate chain into unencrypted PEM format.'
          }
        ]
      },
      {
        id: '325.2',
        title: 'X.509 Certificates for Encryption, Signing and Authentication',
        weight: 4,
        description: 'Configure and test TLS/SSL for secure services (Apache HTTPD, Nginx), implement mutual TLS (mTLS) client certificate authentication, S/MIME email signing, and verify cipher suites.',
        keyKnowledgeAreas: [
          'Configure TLS/SSL in web servers (Apache mod_ssl, Nginx) with server certificates, private keys, and intermediate certificate bundles',
          'Implement Mutual TLS (mTLS) client certificate authentication: SSLVerifyClient, SSLCACertificateFile, and client certificate authorization',
          'Understand cipher suite notation, Forward Secrecy (PFS with ECDHE/DHE), AEAD ciphers (AES-GCM, CHACHA20-POLY1305), and modern TLS protocols (TLSv1.2, TLSv1.3)',
          'Configure S/MIME for signing and encrypting email messages; manage S/MIME certificates with GnuPG/gpgsm',
          'Inspect and test live TLS/SSL services, certificate chains, and cipher negotiation using openssl s_client, nmap ssl scripts, and testing tools'
        ],
        termsAndUtilities: [
          'SSLCertificateFile', 'SSLCertificateKeyFile', 'SSLCACertificateFile', 'SSLVerifyClient', 'SSLProtocol', 'SSLCipherSuite',
          'ssl_certificate', 'ssl_certificate_key', 'ssl_client_certificate', 'ssl_verify_client',
          'openssl s_client', 'gpgsm', 'S/MIME', 'mTLS', 'ECDHE', 'AES-GCM', 'TLSv1.3', 'Forward Secrecy'
        ],
        filesAndPaths: [
          '/etc/httpd/conf.d/ssl.conf',
          '/etc/apache2/sites-available/default-ssl.conf',
          '/etc/nginx/nginx.conf',
          '/etc/nginx/conf.d/'
        ],
        keyCommands: [
          {
            command: 'openssl s_client -connect www.example.com:443 -servername www.example.com -tls1_3',
            description: 'Initiate a live TLS connection to test certificate chain, SNI (Server Name Indication), and TLSv1.3 negotiation.',
            example: 'openssl s_client -connect mail.example.com:25 -starttls smtp',
            explanation: 'Tests TLS handshake, prints the full certificate chain, negotiated cipher, and verifies STARTTLS on SMTP/IMAP/POP3.'
          },
          {
            command: 'openssl s_client -connect secure.example.com:443 -cert client.crt -key client.key -CAfile ca.crt',
            description: 'Connect to an mTLS-protected endpoint using a client certificate and private key for mutual authentication.',
            example: 'curl --cert client.crt --key client.key --cacert ca.crt https://secure.example.com/',
            explanation: 'Provides client credentials during the TLS handshake to verify mutual client-certificate authentication.'
          },
          {
            command: 'gpgsm --import client_cert.p12',
            description: 'Import an S/MIME certificate and private key into the GnuPG S/MIME key store (gpgsm).',
            example: 'gpgsm --list-keys',
            explanation: 'Manages X.509 certificates and S/MIME identities for email signing and encryption with gpgsm.'
          }
        ],
        studyNotes: [
          'Apache mTLS configuration directives: `SSLVerifyClient require` and `SSLCACertificateFile /etc/ssl/ca-bundle.crt`.',
          'Nginx mTLS directives: `ssl_client_certificate /etc/ssl/ca-bundle.crt;` and `ssl_verify_client on;`.',
          'Perfect Forward Secrecy (PFS) ensures that if a server long-term private key is compromised in the future, past recorded sessions cannot be decrypted because unique ephemeral keys (ECDHE/DHE) were generated for each session.',
          'Legacy insecure protocols (SSLv2, SSLv3, TLS 1.0, TLS 1.1) and weak ciphers (RC4, 3DES, CBC-mode ciphers without encrypt-then-mac) should always be disabled.'
        ],
        quickQuestions: [
          {
            question: 'Which Apache mod_ssl directive instructs the server to mandate valid client-certificate authentication for incoming connections?',
            options: ['SSLClientAuth on', 'SSLVerifyClient require', 'SSLRequireCertificate true', 'SSLAuthenticateClient enforce'],
            correctIndex: 1,
            explanation: '`SSLVerifyClient require` enforces that clients must provide a valid certificate signed by a CA listed in `SSLCACertificateFile`.'
          }
        ]
      },
      {
        id: '325.3',
        title: 'Encrypted File Systems',
        weight: 3,
        description: 'Configure and manage block device encryption with dm-crypt and LUKS (LUKS1/LUKS2), key management, automated unlocking with keyfiles and TPM2/Clevis/Tang, and filesystem encryption with eCryptfs.',
        keyKnowledgeAreas: [
          'Understand Linux block device encryption using dm-crypt and LUKS (Linux Unified Key Setup)',
          'Initialize and format encrypted partitions and volumes using cryptsetup (luksFormat, luksOpen, luksClose, luksDump)',
          'Manage LUKS key slots (luksAddKey, luksRemoveKey, luksChangeKey, luksKillSlot)',
          'Configure persistent device mapping and boot unlocking via /etc/crypttab and /etc/fstab',
          'Backup and restore LUKS headers and key slots (luksHeaderBackup, luksHeaderRestore)',
          'Understand Network-Bound Disk Encryption (NBDE) using Clevis and Tang, as well as TPM2 chip binding',
          'Understand stacked filesystem-level encryption with eCryptfs and user home directory encryption'
        ],
        termsAndUtilities: [
          'cryptsetup', 'dm-crypt', 'LUKS', 'LUKS1', 'LUKS2', 'crypttab', 'fstab', 'key slot', 'passphrase',
          'luksFormat', 'luksOpen', 'luksClose', 'luksAddKey', 'luksDump', 'luksHeaderBackup', 'eCryptfs', 'clevis', 'tang'
        ],
        filesAndPaths: [
          '/etc/crypttab',
          '/etc/fstab',
          '/dev/mapper/',
          '/root/luks-header.bak',
          '/root/disk.key'
        ],
        keyCommands: [
          {
            command: 'cryptsetup luksFormat --type luks2 /dev/sdb1',
            description: 'Format a block device or partition with LUKS2 volume header and initialize key slot 0 with a passphrase.',
            example: 'cryptsetup luksFormat --cipher aes-xts-plain64 --key-size 512 --hash sha512 /dev/nvme0n1p3',
            explanation: 'Initializes the LUKS on-disk header; destroys existing filesystem data on the partition.'
          },
          {
            command: 'cryptsetup luksOpen /dev/sdb1 secure_data',
            description: 'Decrypt and open a LUKS encrypted block device, mapping it to /dev/mapper/secure_data.',
            example: 'cryptsetup luksClose secure_data',
            explanation: 'Prompts for passphrase or keyfile, activates the dm-crypt device mapper node for mounting.'
          },
          {
            command: 'cryptsetup luksAddKey /dev/sdb1 /root/disk.key',
            description: 'Add a supplementary keyfile or secondary passphrase into an available LUKS key slot.',
            example: 'cryptsetup luksDump /dev/sdb1',
            explanation: 'LUKS supports multiple key slots (up to 8 in LUKS1, up to 32 in LUKS2), allowing different credentials to decrypt the same master volume key.'
          },
          {
            command: 'cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file /root/sdb1-header.img',
            description: 'Create an offline binary backup of the LUKS header and all active key slots.',
            example: 'cryptsetup luksHeaderRestore /dev/sdb1 --header-backup-file /root/sdb1-header.img',
            explanation: 'Vital disaster recovery step: if key slots or the on-disk header become corrupted, the volume is irreversibly lost without a header backup.'
          }
        ],
        studyNotes: [
          '/etc/crypttab format: `target_name  source_device  key_file  options` (e.g. `secure_data /dev/sdb1 /etc/keys/data.key luks,discard`).',
          'LUKS uses two-tiered encryption: a random master volume key encrypts the actual data, while individual user passphrases/keyfiles encrypt copies of the master key stored in key slots.',
          'eCryptfs operates at the filesystem layer (encrypting individual files and filenames), while dm-crypt/LUKS operates at the block device layer (encrypting the entire partition including metadata, inodes, and free space).'
        ],
        quickQuestions: [
          {
            question: 'What happens to data on a LUKS volume if the first 2-4 MB of the partition containing the LUKS header is overwritten and no header backup exists?',
            options: ['Data can still be recovered using the root password', 'The filesystem can be rebuilt with fsck', 'The master key is lost and data is permanently irrecoverable', 'The kernel falls back to standard ext4 mode'],
            correctIndex: 2,
            explanation: 'Because the master key is stored exclusively inside the encrypted key slots of the LUKS header, destroying the header without a backup renders the volume completely irrecoverable.'
          }
        ]
      },
      {
        id: '325.4',
        title: 'DNS and Cryptography',
        weight: 5,
        description: 'Understand DNSSEC architecture, configure BIND 9 for DNSSEC zone signing and validation, manage DNSSEC keys (ZSK/KSK), DANE (TLSA records), and TSIG for secure zone transfers.',
        keyKnowledgeAreas: [
          'Understand DNSSEC concepts: cryptographic authentication of DNS data, trust anchors, chain of trust, and authentication of origin',
          'DNSSEC record types: RRSIG (Resource Record Signature), DNSKEY (public key), DS (Delegation Signer), NSEC / NSEC3 (authenticated denial of existence)',
          'Distinguish between Zone Signing Keys (ZSK) and Key Signing Keys (KSK), key rollover procedures, and DS record publication at the parent registrar',
          'Configure BIND 9 for DNSSEC validation (dnssec-validation auto;) and automated zone signing (dnssec-policy)',
          'Use BIND DNSSEC tools: dnssec-keygen, dnssec-signzone, dnssec-dsfromkey, dnssec-verify, and rndc signing controls',
          'Understand DANE (DNS-based Authentication of Named Entities) and TLSA records (certificate association with DNSSEC)',
          'Configure TSIG (Transaction Signature) for secure BIND zone transfers (AXFR) and dynamic DNS updates (nsupdate) using shared secret keys'
        ],
        termsAndUtilities: [
          'DNSSEC', 'RRSIG', 'DNSKEY', 'DS', 'NSEC', 'NSEC3', 'ZSK', 'KSK', 'DANE', 'TLSA', 'TSIG',
          'dnssec-keygen', 'dnssec-signzone', 'dnssec-dsfromkey', 'dnssec-verify', 'tsig-keygen', 'rndc', 'named.conf'
        ],
        filesAndPaths: [
          '/etc/bind/named.conf',
          '/etc/named.conf',
          '/var/named/',
          '/etc/bind/named.conf.options'
        ],
        keyCommands: [
          {
            command: 'dnssec-keygen -a RSASHA256 -b 2048 -n ZONE example.com',
            description: 'Generate a Zone Signing Key (ZSK) for the example.com DNS zone.',
            example: 'dnssec-keygen -a RSASHA256 -b 4096 -f KSK -n ZONE example.com',
            explanation: 'Generates private (.private) and public (.key) key pairs. Using `-f KSK` sets the Key Signing Key flag.'
          },
          {
            command: 'dnssec-signzone -A -3 $(head -c 16 /dev/urandom | sha1sum | cut -b 1-16) -N INCREMENT -o example.com db.example.com Kexample.com...+008+*.private',
            description: 'Sign a BIND zone file using NSEC3 salt, incrementing the serial number and producing db.example.com.signed.',
            example: 'dnssec-signzone -o example.com -k Kexample.com...+KSK.private db.example.com Kexample.com...+ZSK.private',
            explanation: 'Generates RRSIG records for all resource records and signs the DNSKEY RRset.'
          },
          {
            command: 'dnssec-dsfromkey Kexample.com...+008+12345.key',
            description: 'Generate Delegation Signer (DS) records from a public KSK to upload to the parent zone registrar.',
            example: 'example.com. IN DS 12345 8 2 3A4B... (SHA-256 digest)',
            explanation: 'Creates the cryptographic bridge between parent (.com) and child (example.com) zones in the DNSSEC chain of trust.'
          },
          {
            command: 'tsig-keygen -a hmac-sha256 transfer-key > /etc/bind/transfer.key',
            description: 'Generate a shared TSIG key for authenticating AXFR zone transfers between primary and secondary DNS servers.',
            example: 'include "/etc/bind/transfer.key"; in named.conf',
            explanation: 'Generates the `key "transfer-key" { algorithm hmac-sha256; secret "..."; };` block.'
          }
        ],
        studyNotes: [
          'In DNSSEC, the KSK (Key Signing Key) signs ONLY the DNSKEY RRset; the ZSK (Zone Signing Key) signs all other resource record sets (A, AAAA, MX, TXT, etc.).',
          'NSEC3 prevents zone enumeration (walking the zone) by returning salted cryptographic hashes of adjacent domain names for NXDOMAIN responses.',
          'DANE TLSA records format: `_<port>._<proto>.<domain>. IN TLSA <Usage> <Selector> <Matching-Type> <Certificate-Association-Data>`. (e.g. `_443._tcp.www.example.com. IN TLSA 3 1 1 <hash>`).',
          'TSIG provides hop-by-hop message authentication and integrity for DNS transactions (AXFR, IXFR, dynamic updates) using symmetric HMAC keys.'
        ],
        quickQuestions: [
          {
            question: 'Which DNSSEC record type is sent to the domain registrar to be published in the parent zone, establishing the chain of trust?',
            options: ['RRSIG record', 'DNSKEY record', 'DS (Delegation Signer) record', 'TLSA record'],
            correctIndex: 2,
            explanation: 'The DS (Delegation Signer) record contains a hash of the child zone Key Signing Key (KSK) and is published in the parent zone to verify the child zone DNSKEY record.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 326: HOST SECURITY (Weight: 16)
  // =========================================================================
  {
    id: 'topic-326',
    topicNumber: 326,
    title: 'Host Security',
    totalWeight: 16,
    examId: 'exam-303',
    certification: 'lpic-3',
    description: 'Host hardening (sysctl, bootloader, systemd sandboxing), host intrusion detection (Linux Audit / auditd, AIDE, rootkit scanners), PAM & Kerberos user authentication, and FreeIPA domain management.',
    objectives: [
      {
        id: '326.1',
        title: 'Host Hardening',
        weight: 3,
        description: 'Secure Linux hosts through BIOS/UEFI boot security, bootloader password protection, disabling unnecessary services, kernel hardening via sysctl, systemd sandboxing, and account lockout policies.',
        keyKnowledgeAreas: [
          'Configure GRUB2 bootloader passwords (grub2-setpassword / password_pbkdf2) and restrict interactive editing of boot arguments',
          'Understand UEFI Secure Boot, shim bootloader, and MOK (Machine Owner Key) enrollment for signed kernel modules',
          'Disable and mask unused services, legacy protocols, and setuid/setgid binaries (systemctl disable --now, systemctl mask)',
          'Configure kernel security parameters via /etc/sysctl.d/ (ASLR, kptr_restrict, dmesg_restrict, protected_symlinks, protected_hardlinks)',
          'Harden systemd service units using sandboxing directives: ProtectSystem, ProtectHome, PrivateTmp, NoNewPrivileges, CapabilityBoundingSet',
          'Configure login security, password aging, and account lockout via /etc/login.defs, /etc/security/limits.conf, and pam_faillock / pam_tally2'
        ],
        termsAndUtilities: [
          'sysctl', 'sysctl.d', 'grub2-setpassword', 'grub-mkpasswd-pbkdf2', 'systemctl mask', 'login.defs',
          'faillock', 'pam_faillock', 'pam_tally2', 'limits.conf', 'ProtectSystem', 'ProtectHome', 'NoNewPrivileges', 'ASLR'
        ],
        filesAndPaths: [
          '/etc/sysctl.d/99-security.conf',
          '/etc/security/limits.conf',
          '/etc/security/faillock.conf',
          '/etc/login.defs',
          '/etc/grub.d/40_custom',
          '/boot/grub2/user.cfg'
        ],
        keyCommands: [
          {
            command: 'sysctl -w kernel.randomize_va_space=2',
            description: 'Enable full Address Space Layout Randomization (ASLR) in the Linux kernel to mitigate buffer overflow attacks.',
            example: 'sysctl -p /etc/sysctl.d/99-security.conf',
            explanation: 'Randomizes stack, VDSO page, shared memory regions, and data segment locations in memory.'
          },
          {
            command: 'faillock --user alice',
            description: 'Check failed login attempts and lockout status for user alice managed by pam_faillock.',
            example: 'faillock --user alice --reset',
            explanation: 'Inspects and resets account lockout counters caused by consecutive failed password attempts.'
          },
          {
            command: 'grub2-setpassword',
            description: 'Set a password for the GRUB2 bootloader to prevent unauthorized single-user mode (init=/bin/bash) tampering.',
            example: 'grub-mkpasswd-pbkdf2',
            explanation: 'Generates PBKDF2 password hashes stored in /boot/grub2/user.cfg.'
          }
        ],
        studyNotes: [
          'Key sysctl hardening parameters: `fs.protected_hardlinks=1`, `fs.protected_symlinks=1`, `kernel.kptr_restrict=2` (hides kernel pointers), `kernel.dmesg_restrict=1` (restricts dmesg access to root).',
          'Systemd unit hardening: `ProtectSystem=strict` mounts /usr, /boot, and /etc read-only for the service; `ProtectHome=yes` makes /root, /home, and /run/user inaccessible.',
          '`systemctl mask <service>` creates a symlink to `/dev/null`, preventing the service from being started either manually or as a dependency.'
        ],
        quickQuestions: [
          {
            question: 'Which systemd unit sandboxing directive prevents child processes spawned by a daemon from acquiring new privileges via setuid binaries?',
            options: ['ProtectSystem=strict', 'NoNewPrivileges=yes', 'PrivateTmp=yes', 'CapabilityBoundingSet=none'],
            correctIndex: 1,
            explanation: '`NoNewPrivileges=yes` sets the PR_SET_NO_NEW_PRIVS flag, ensuring the process and all its children can never gain privileges through setuid/setgid execution.'
          }
        ]
      },
      {
        id: '326.2',
        title: 'Host Intrusion Detection',
        weight: 4,
        description: 'Configure and monitor host intrusion detection systems, file integrity auditing with AIDE, Linux Audit Framework (auditd / auditctl / ausearch / aureport), rootkit detection (rkhunter, chkrootkit), and log monitoring.',
        keyKnowledgeAreas: [
          'Configure the Linux Audit framework (auditd): write persistent audit rules in /etc/audit/rules.d/ for file watches, system call monitoring, and execution tracking',
          'Query and generate audit reports with auditctl, ausearch, aureport, and autrace',
          'Implement file integrity monitoring using AIDE (Advanced Intrusion Detection Environment): database initialization, attribute checking, and scheduled cron verification',
          'Configure and run rootkit and malware scanners: rkhunter, chkrootkit, and Linux Malware Detect (maldet)',
          'Configure automated log analysis and brute-force intrusion prevention: Logwatch and Fail2ban (jail.local, fail2ban-client)'
        ],
        termsAndUtilities: [
          'auditd', 'auditctl', 'ausearch', 'aureport', 'autrace', 'audit.rules', 'auditd.conf',
          'aide', 'aide.conf', 'rkhunter', 'chkrootkit', 'maldet', 'fail2ban', 'fail2ban-client', 'logwatch'
        ],
        filesAndPaths: [
          '/etc/audit/auditd.conf',
          '/etc/audit/rules.d/audit.rules',
          '/var/log/audit/audit.log',
          '/etc/aide.conf',
          '/var/lib/aide/aide.db.gz',
          '/etc/fail2ban/jail.local'
        ],
        keyCommands: [
          {
            command: 'auditctl -w /etc/shadow -p wa -k shadow_mod',
            description: 'Add an active watch rule to audit write (w) and attribute (a) changes on /etc/shadow with rule key "shadow_mod".',
            example: 'auditctl -l',
            explanation: 'Instructs the Linux kernel audit subsystem to log any modification of /etc/shadow to /var/log/audit/audit.log.'
          },
          {
            command: 'ausearch -k shadow_mod --interpret',
            description: 'Search audit logs for events matching the "shadow_mod" key and translate numeric UIDs/syscalls into names.',
            example: 'aureport -au',
            explanation: 'Searches /var/log/audit/audit.log; aureport provides summary statistics of failed authentications, syscalls, and logins.'
          },
          {
            command: 'aide --init && mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz',
            description: 'Initialize the baseline AIDE database capturing cryptographic hashes and permissions of system binaries.',
            example: 'aide --check',
            explanation: 'Creates a baseline snapshot against which `aide --check` compares current filesystem state to detect unauthorized modifications.'
          },
          {
            command: 'rkhunter --update && rkhunter --check --sk',
            description: 'Update the rootkit signature definitions and run an automated scan skipping interactive prompts.',
            example: 'chkrootkit -q',
            explanation: 'Checks system binaries against known rootkit signatures, hidden processes, and suspicious listening ports.'
          }
        ],
        studyNotes: [
          'In auditctl rules: `-w /path` sets a file watch; `-p rwax` defines permissions to trigger on (r=read, w=write, a=attribute, x=execute); `-k keyname` tags events for ausearch.',
          'Syscall audit rules: `auditctl -a always,exit -F arch=b64 -S execve -F euid=0 -k root_exec` logs all commands executed by root.',
          'Fail2ban parses log files (such as /var/log/auth.log) for repeated authentication failures and dynamically inserts packet filtering rules (iptables/nftables) to temporarily block offending IP addresses.'
        ],
        quickQuestions: [
          {
            question: 'Which tool parses the Linux Audit log (/var/log/audit/audit.log) to generate structured statistical summary reports of authentication attempts and syscall executions?',
            options: ['auditctl', 'ausearch', 'aureport', 'autrace'],
            correctIndex: 2,
            explanation: '`aureport` produces formatted summary reports (e.g. `aureport -au` for authentications, `aureport -s` for syscall summaries) from raw audit log data.'
          }
        ]
      },
      {
        id: '326.3',
        title: 'User Management and Authentication',
        weight: 5,
        description: 'Configure Pluggable Authentication Modules (PAM), Name Service Switch (NSS), SSSD authentication providers, Kerberos 5 client authentication (kinit/klist/keytabs), and secure sudo delegation.',
        keyKnowledgeAreas: [
          'Understand PAM architecture: management groups (auth, account, password, session) and control flags (required, requisite, sufficient, optional, include, substack)',
          'Configure PAM modules: pam_unix, pam_pwhistory, pam_pwquality, pam_faillock, pam_wheel, pam_limits, and pam_google_authenticator for 2FA',
          'Configure Name Service Switch (/etc/nsswitch.conf) to resolve users, groups, and hosts via files, sssd, ldap, or winbind',
          'Configure SSSD (/etc/sssd/sssd.conf): ID, auth, and access providers (ldap, ipa, ad, simple), offline caching, and domain discovery',
          'Manage Kerberos 5 client authentication: /etc/krb5.conf, principal naming (user@REALM, service/host@REALM), ticket granting tickets (kinit, klist, kdestroy), and keytab manipulation (ktutil, kadmin.local)',
          'Configure and audit Sudo privilege delegation via /etc/sudoers and /etc/sudoers.d/ using visudo; enforce secure command aliasing and logging'
        ],
        termsAndUtilities: [
          'PAM', 'pam.d', 'required', 'requisite', 'sufficient', 'optional', 'pam_pwquality', 'pam_faillock', 'pam_wheel',
          'nsswitch.conf', 'sssd', 'sssd.conf', 'krb5.conf', 'kinit', 'klist', 'kdestroy', 'ktutil', 'visudo', 'sudoers'
        ],
        filesAndPaths: [
          '/etc/pam.d/',
          '/etc/security/pwquality.conf',
          '/etc/nsswitch.conf',
          '/etc/sssd/sssd.conf',
          '/etc/krb5.conf',
          '/etc/krb5.keytab',
          '/etc/sudoers',
          '/etc/sudoers.d/'
        ],
        keyCommands: [
          {
            command: 'kinit alice@EXAMPLE.COM',
            description: 'Authenticate to the Kerberos KDC and obtain an initial Ticket Granting Ticket (TGT) for the principal.',
            example: 'klist -e',
            explanation: 'Prompts for the principal password and stores the encrypted ticket in the credential cache (e.g. /tmp/krb5cc_1000).'
          },
          {
            command: 'kdestroy',
            description: 'Destroy the current user Kerberos ticket cache, terminating active SSO sessions.',
            example: 'klist',
            explanation: 'Securely deletes cached TGT and service tickets from memory/filesystem.'
          },
          {
            command: 'ktutil',
            description: 'Interactive Kerberos keytab management utility to read, add, and write secret service principals to keytab files.',
            example: 'ktutil: rkt /etc/krb5.keytab\nktutil: l\nktutil: q',
            explanation: 'Used to inspect service principals and encryption types stored in keytabs.'
          },
          {
            command: 'visudo -f /etc/sudoers.d/secops',
            description: 'Safely edit a sudoers snippet file with atomic syntax validation to prevent locking out administrative access.',
            example: '%secops ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart auditd',
            explanation: 'Locks and validates sudoers files before saving; rejects syntax errors.'
          }
        ],
        studyNotes: [
          'PAM control flags: `required` (failure continues through stack but ultimately fails); `requisite` (failure terminates stack immediately); `sufficient` (success terminates stack immediately if no prior required failed); `optional` (result ignored unless only module).',
          '/etc/sssd/sssd.conf MUST have strict 0600 permissions; SSSD will refuse to start if world or group accessible.',
          'In PAM, `pam_wheel.so use_uid` restricts `su` execution strictly to members of the wheel/sudo administrative group.'
        ],
        quickQuestions: [
          {
            question: 'In PAM configuration, what happens when a module marked with the control flag "sufficient" succeeds, assuming no previous "required" modules failed?',
            options: ['Execution continues through the rest of the stack', 'The PAM stack succeeds immediately and returns success without executing remaining modules', 'It prompts the user for another credential', 'It logs a warning in syslog'],
            correctIndex: 1,
            explanation: 'If a module marked `sufficient` succeeds and no prior required module failed, PAM immediately returns success to the application without evaluating subsequent modules in that stack.'
          }
        ]
      },
      {
        id: '326.4',
        title: 'FreeIPA Installation and Samba Integration',
        weight: 4,
        description: 'Deploy FreeIPA server and clients, manage identities and hosts via CLI, and integrate FreeIPA with Samba for cross-forest Active Directory trust management.',
        keyKnowledgeAreas: [
          'Understand FreeIPA architecture: 389 Directory Server (LDAP), MIT Kerberos KDC, Dogtag Certificate System, BIND DNS, and HTTP/API management',
          'Deploy FreeIPA using ipa-server-install and enroll Linux clients using ipa-client-install',
          'Manage users, groups, hosts, services, and HBAC (Host-Based Access Control) policies using the ipa command line',
          'Configure FreeIPA trust relationships with Active Directory domains using ipa-adtrust-install and ipa trust-add',
          'Configure Samba integration on FreeIPA domain controllers and member servers for Windows client interoperability'
        ],
        termsAndUtilities: [
          'FreeIPA', 'ipa-server-install', 'ipa-client-install', 'ipa-adtrust-install', 'ipa', 'HBAC', '389-DS', 'Dogtag', 'kinit admin', 'ipa trust-add'
        ],
        filesAndPaths: [
          '/etc/ipa/default.conf',
          '/etc/sssd/sssd.conf',
          '/var/log/ipaserver-install.log',
          '/var/log/ipaclient-install.log'
        ],
        keyCommands: [
          {
            command: 'ipa-server-install --setup-dns --forwarder=8.8.8.8',
            description: 'Perform an interactive installation of a FreeIPA master domain controller with integrated DNS.',
            example: 'ipa-server-install --domain=example.com --realm=EXAMPLE.COM -a AdminPassword -p DmPassword',
            explanation: 'Configures Directory Server, KDC, Dogtag CA, and named DNS server for the realm.'
          },
          {
            command: 'ipa-client-install --mkhomedir --enable-dns-updates',
            description: 'Enroll a Linux client host into the FreeIPA domain, configuring SSSD, PAM, NSS, and Kerberos automatically.',
            example: 'ipa-client-install --server=ipa.example.com --domain=example.com',
            explanation: 'Joins the realm, creates the host principal in LDAP/KDC, and fetches the host keytab.'
          },
          {
            command: 'ipa user-add jdoe --first=John --last=Doe --email=jdoe@example.com --password',
            description: 'Add a new enterprise domain user into the FreeIPA directory with Kerberos credentials.',
            example: 'ipa hbacrule-add allow_ssh --service=sshd && ipa hbacrule-add-user allow_ssh --users=jdoe',
            explanation: 'Creates user accounts, groups, and configures Host-Based Access Control (HBAC) rules.'
          },
          {
            command: 'ipa-adtrust-install',
            description: 'Configure FreeIPA to support Cross-Forest Kerberos trusts with Active Directory domains.',
            example: 'ipa trust-add --type=ad ad.corp.local --admin Administrator --password',
            explanation: 'Enables Samba Winbind components on FreeIPA servers and generates SID ranges for cross-forest authentication.'
          }
        ],
        studyNotes: [
          'Before executing `ipa` commands, the administrator must authenticate with Kerberos by running `kinit admin`.',
          'FreeIPA Host-Based Access Control (HBAC) replaces standard PAM access rules, centrally defining which users/groups can access which services (e.g. sshd, sudo) on which specific host computers.',
          '`ipa-adtrust-install` adds the Samba AD trust subsystem to FreeIPA, enabling Active Directory users to log into FreeIPA Linux clients using their corporate AD credentials without synchronization.'
        ],
        quickQuestions: [
          {
            question: 'What prerequisite command must an administrator execute before running `ipa` CLI management commands?',
            options: ['sudo su -', 'kinit admin', 'sssd-tool auth', 'systemctl restart ipa'],
            correctIndex: 1,
            explanation: 'The `ipa` command communicates with the FreeIPA XML-RPC/JSON web API authenticated via Kerberos GSSAPI; running `kinit admin` acquires the necessary TGT.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 327: ACCESS CONTROL (Weight: 10)
  // =========================================================================
  {
    id: 'topic-327',
    topicNumber: 327,
    title: 'Access Control',
    totalWeight: 10,
    examId: 'exam-303',
    certification: 'lpic-3',
    description: 'Discretionary Access Control (POSIX ACLs, extended file attributes), Mandatory Access Control (SELinux policies, contexts, booleans, AppArmor), and secure network file systems (NFSv4 Kerberos & SMB3).',
    objectives: [
      {
        id: '327.1',
        title: 'Discretionary Access Control (DAC)',
        weight: 3,
        description: 'Manage POSIX Access Control Lists (ACLs), default directory ACLs, calculate effective masks, and manipulate extended filesystem attributes (chattr / lsattr / setfattr / getfattr).',
        keyKnowledgeAreas: [
          'Understand limitations of standard Unix permission bits (owner, group, other) and the role of POSIX ACLs',
          'Inspect and modify POSIX ACLs with getfacl and setfacl (-m, -x, -b, -R, -d)',
          'Understand the ACL mask (`mask::`) and its role as the upper bound for group and named user permissions',
          'Configure default ACLs (`d:u:user:rwx`) on parent directories for automatic permission inheritance on newly created files and subdirectories',
          'Inspect and set ext4/xfs file attributes: immutable (+i), append-only (+a), no-dump (+d), secure-deletion (+s) with chattr and lsattr',
          'Manage extended file attributes (xattr) across user, trusted, security, and system namespaces with getfattr and setfattr'
        ],
        termsAndUtilities: [
          'getfacl', 'setfacl', 'ACL', 'mask', 'default ACL', 'chattr', 'lsattr', 'getfattr', 'setfattr', 'xattr',
          'immutable (+i)', 'append-only (+a)', 'security.selinux', 'user namespace'
        ],
        filesAndPaths: [
          '/etc/fstab'
        ],
        keyCommands: [
          {
            command: 'setfacl -m u:alice:rwx,g:developers:rx /srv/shared',
            description: 'Grant explicit read/write/execute permissions to user alice and read/execute to group developers on /srv/shared.',
            example: 'setfacl -x u:alice /srv/shared',
            explanation: 'Modifies POSIX ACL entries; `-x` removes a specific ACL entry.'
          },
          {
            command: 'setfacl -d -m u:alice:rwx,g:developers:rx,m::rwx /srv/shared',
            description: 'Set default ACLs on a directory so all newly created files and subdirectories automatically inherit these permissions.',
            example: 'getfacl /srv/shared',
            explanation: 'Default ACLs (`-d`) apply only to directories and define the inheritance template for child items.'
          },
          {
            command: 'chattr +i /etc/resolv.conf',
            description: 'Set the immutable (+i) flag on a file, preventing modification, deletion, renaming, or symlinking even by root.',
            example: 'lsattr /etc/resolv.conf',
            explanation: 'Only root with CAP_LINUX_IMMUTABLE capability can remove the +i flag with `chattr -i`.'
          },
          {
            command: 'getfattr -d -m - /usr/bin/ping',
            description: 'Display all extended attributes and Linux capabilities stored in file xattrs.',
            example: 'setfattr -n user.comment -v "Audit passed" file.txt',
            explanation: 'Reads extended attributes across all namespaces (user, security, system).'
          }
        ],
        studyNotes: [
          'The ACL `mask::` entry defines the MAXIMUM permissions that can be granted to named users, named groups, and the owning group. If `mask::r--`, a user with `u:alice:rwx` effectively only receives `r--`.',
          'When an ACL exists on a file, `ls -l` displays a `+` symbol at the end of permission mode string (e.g. `-rw-rwxr--+ 1 root root`).',
          '`chattr +a` (append-only) allows processes to only open the file in append mode (O_APPEND), ideal for audit log files.'
        ],
        quickQuestions: [
          {
            question: 'If a file has an ACL entry `u:bob:rwx` but the ACL mask is set to `mask::r-x`, what are bob effective permissions on the file?',
            options: ['rwx (Read, Write, Execute)', 'r-x (Read and Execute only)', '--- (No access)', 'rw- (Read and Write only)'],
            correctIndex: 1,
            explanation: 'The ACL mask acts as an upper ceiling. Bitwise AND of `rwx` and `r-x` results in effective permissions of `r-x`.'
          }
        ]
      },
      {
        id: '327.2',
        title: 'Mandatory Access Control (MAC)',
        weight: 4,
        description: 'Understand Mandatory Access Control (MAC) vs Discretionary Access Control (DAC), manage SELinux modes, security contexts, booleans, audit troubleshooting with audit2allow, and AppArmor profiles.',
        keyKnowledgeAreas: [
          'Understand MAC security principles: type enforcement, multi-level security (MLS), multi-category security (MCS), and least privilege',
          'SELinux operational modes: Enforcing, Permissive, Disabled; switch modes dynamically (setenforce) and persistently (/etc/selinux/config)',
          'SELinux security contexts: user:role:type:level; inspect contexts with ls -Z, ps -eZ, id -Z, netstat -Z',
          'Manage persistent SELinux file contexts with semanage fcontext and apply them with restorecon',
          'Manage SELinux booleans: getsebool, setsebool (-P for persistent configuration across reboots)',
          'Diagnose SELinux denials using /var/log/audit/audit.log, ausearch, sealert, and generate custom policy modules with audit2allow',
          'AppArmor fundamentals: profile modes (enforce vs complain), profile directory (/etc/apparmor.d/), aa-status, aa-enforce, aa-complain, aa-logprof'
        ],
        termsAndUtilities: [
          'SELinux', 'Enforcing', 'Permissive', 'Disabled', 'type enforcement', 'semanage', 'restorecon', 'chcon',
          'getsebool', 'setsebool', 'audit2allow', 'sealert', 'semodule', 'AppArmor', 'aa-status', 'aa-enforce', 'aa-complain', 'aa-logprof'
        ],
        filesAndPaths: [
          '/etc/selinux/config',
          '/var/log/audit/audit.log',
          '/etc/apparmor.d/',
          '/etc/apparmor/parser.conf'
        ],
        keyCommands: [
          {
            command: 'semanage fcontext -a -t httpd_sys_content_t "/custom_web(/.*)?" && restorecon -Rv /custom_web',
            description: 'Define a persistent SELinux type context rule for a directory tree and apply it to filesystem labels.',
            example: 'restorecon -v /var/www/html/index.html',
            explanation: 'Updates the SELinux policy database and restores correct context labels defined by policy.'
          },
          {
            command: 'setsebool -P httpd_can_network_connect 1',
            description: 'Persistently enable the SELinux boolean allowing Apache HTTPD to initiate outbound network connections.',
            example: 'getsebool -a | grep httpd',
            explanation: 'The `-P` flag commits the change permanently to the SELinux policy database across reboots.'
          },
          {
            command: 'ausearch -m avc -ts recent | audit2allow -M my_custom_policy && semodule -i my_custom_policy.pp',
            description: 'Analyze recent SELinux AVC denial events and compile an allow policy module into the active kernel.',
            example: 'semodule -l',
            explanation: 'Generates Type Enforcement (.te) and compiled policy package (.pp) files and loads them into SELinux.'
          },
          {
            command: 'aa-status',
            description: 'Display the current operational status of AppArmor profiles and identify processes running in enforce or complain mode.',
            example: 'aa-enforce /etc/apparmor.d/usr.sbin.mysqld',
            explanation: 'Shows loaded profiles, active complain/enforce modes, and monitored network daemons.'
          }
        ],
        studyNotes: [
          'SELinux context format: `user:role:type:level` (e.g. `system_u:object_r:httpd_sys_content_t:s0`). In targeted policy, the `type` field is the primary factor for Type Enforcement.',
          '`chcon` modifies contexts temporarily; any subsequent `restorecon` will overwrite changes unless the context was defined using `semanage fcontext`.',
          'AppArmor `complain` mode logs security profile violations without blocking actions; `enforce` mode strictly blocks unauthorized access and logs AVC events.'
        ],
        quickQuestions: [
          {
            question: 'Which command persistently saves an SELinux file context definition to the policy database so that `restorecon` will not revert it?',
            options: ['chcon -t httpd_sys_content_t /dir', 'semanage fcontext -a -t httpd_sys_content_t "/dir(/.*)?"', 'setsebool -P httpd_sys_content_t 1', 'audit2allow -M httpd_dir'],
            correctIndex: 1,
            explanation: '`semanage fcontext` writes the context definition into the persistent SELinux policy store, which `restorecon` queries when resetting labels.'
          }
        ]
      },
      {
        id: '327.3',
        title: 'Network File Systems Security',
        weight: 3,
        description: 'Secure network file systems using NFSv4 Kerberos security flavors (sec=sys/krb5/krb5i/krb5p), idmapd user mapping, and enforce Samba share encryption and SMB3 transport security.',
        keyKnowledgeAreas: [
          'Understand NFSv4 security architecture: single TCP port (2049), pseudo-root filesystem export, and removal of rpcbind/portmapper requirement',
          'Configure NFSv4 domain mapping via /etc/idmapd.conf and manage the nfs-idmapd daemon',
          'Configure Kerberos security flavors for NFSv4 in /etc/exports: sec=sys, sec=krb5 (authentication), sec=krb5i (integrity checksums), sec=krb5p (full payload encryption)',
          'Manage NFS client and server Kerberos service principals: nfs/hostname@REALM and rpc.gssd / rpc.svcgssd daemons',
          'Enforce Samba transport encryption and SMB3 security in smb.conf: server min protocol = SMB3, smb encrypt = required',
          'Configure Samba share access controls and permissions: valid users, write list, force user, force group, inherit permissions'
        ],
        termsAndUtilities: [
          'NFSv4', 'idmapd.conf', 'sec=krb5', 'sec=krb5i', 'sec=krb5p', 'rpc.gssd', 'rpc.svcgssd', 'exports',
          'smb encrypt', 'server min protocol', 'valid users', 'write list', 'vfs objects = acl_xattr'
        ],
        filesAndPaths: [
          '/etc/exports',
          '/etc/exports.d/',
          '/etc/idmapd.conf',
          '/etc/samba/smb.conf'
        ],
        keyCommands: [
          {
            command: 'exportfs -rav',
            description: 'Re-export all NFS shares specified in /etc/exports and /etc/exports.d/ with verbose output.',
            example: 'showmount -e localhost',
            explanation: 'Applies modified NFS export directives without restarting the nfs-server service.'
          },
          {
            command: 'mount -t nfs4 -o sec=krb5p,proto=tcp nfs.example.com:/secure_share /mnt/nfs',
            description: 'Mount an NFSv4 export enforcing full Kerberos privacy (krb5p: encrypted payload and authentication).',
            example: 'mount -t nfs4 -o sec=krb5i nfs.example.com:/data /mnt/data',
            explanation: 'Requires a valid Kerberos ticket or machine keytab and encrypts all RPC traffic over the wire.'
          },
          {
            command: 'testparm -s --parameter-name="smb encrypt"',
            description: 'Verify the active SMB share encryption parameter across all Samba configuration stanzas.',
            example: 'smbclient -L //server -U user -e',
            explanation: 'Checks if `smb encrypt = required` is active to force SMB3 cryptographic transport sealing.'
          }
        ],
        studyNotes: [
          'NFS Kerberos security flavors: `sec=sys` (unauthenticated UID/GID trust); `sec=krb5` (Kerberos authentication only); `sec=krb5i` (Kerberos auth + HMAC packet integrity); `sec=krb5p` (Kerberos auth + integrity + full payload privacy/encryption).',
          'NFSv4 uses `/etc/idmapd.conf` with `Domain = example.com` to translate numeric UIDs/GIDs into `user@domain` strings over the wire, avoiding UID collision across different systems.',
          'In Samba `smb.conf`, adding `smb encrypt = required` under `[global]` or a specific `[share]` mandates SMB3 encryption, rejecting unencrypted client sessions.'
        ],
        quickQuestions: [
          {
            question: 'Which NFS security mount option provides full end-to-end payload encryption as well as cryptographic authentication and packet integrity?',
            options: ['sec=sys', 'sec=krb5', 'sec=krb5i', 'sec=krb5p'],
            correctIndex: 3,
            explanation: '`sec=krb5p` (Privacy) provides Kerberos mutual authentication, tamper-proof cryptographic packet integrity (checksums), and full payload payload encryption.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 328: NETWORK SECURITY (Weight: 17)
  // =========================================================================
  {
    id: 'topic-328',
    topicNumber: 328,
    title: 'Network Security',
    totalWeight: 17,
    examId: 'exam-303',
    certification: 'lpic-3',
    description: 'Network hardening (FreeRADIUS, nmap auditing, Wireshark packet capture), network intrusion detection (Snort, Suricata, Zeek, OpenVAS), packet filtering (iptables & nftables), and VPN implementations (WireGuard, OpenVPN, IPsec/strongSwan).',
    objectives: [
      {
        id: '328.1',
        title: 'Network Hardening',
        weight: 4,
        description: 'Configure RADIUS authentication with FreeRADIUS (EAP-TLS/PEAP), audit network ports and services with nmap, and inspect live packet captures with tcpdump and Wireshark.',
        keyKnowledgeAreas: [
          'Configure FreeRADIUS: clients.conf (RADIUS clients, shared secrets), users configuration, EAP authentication methods (EAP-TLS, PEAP, MS-CHAPv2) for 802.1X network access',
          'Debug and test FreeRADIUS authentication using freeradius -X / radiusd -X and radtest',
          'Perform network reconnaissance and security auditing with nmap: TCP SYN scan (-sS), UDP scan (-sU), version detection (-sV), default scripts (-sC), and OS fingerprinting (-O)',
          'Capture and filter live network traffic with tcpdump (BPF Berkeley Packet Filter syntax) and inspect protocol handshakes',
          'Analyze captured traffic dumps (.pcap) with Wireshark and tshark'
        ],
        termsAndUtilities: [
          'freeradius', 'radiusd', 'radtest', 'clients.conf', 'users', 'EAP-TLS', 'PEAP', '802.1X',
          'nmap', 'tcpdump', 'tshark', 'wireshark', 'BPF filter', 'pcap', 'SYN scan (-sS)'
        ],
        filesAndPaths: [
          '/etc/raddb/clients.conf',
          '/etc/raddb/users',
          '/etc/freeradius/3.0/clients.conf',
          '/etc/freeradius/3.0/users',
          '/etc/freeradius/3.0/mods-available/eap'
        ],
        keyCommands: [
          {
            command: 'freeradius -X',
            description: 'Run FreeRADIUS daemon in foreground full-debug mode to inspect EAP transactions and client authentication steps.',
            example: 'radiusd -X',
            explanation: 'Displays detailed debug logs of incoming RADIUS Access-Request packets, module evaluation, and Access-Accept/Reject.'
          },
          {
            command: 'radtest testuser secretpassword localhost 0 testing123',
            description: 'Test RADIUS server authentication from the command line using radtest utility.',
            example: 'radtest -t pap alice P@ssw0rd 127.0.0.1 1812 testing123',
            explanation: 'Sends a simulated RADIUS Access-Request packet to verify the authentication pipeline.'
          },
          {
            command: 'nmap -sS -sV -p 1-65535 -O 192.168.1.50',
            description: 'Perform a full-port stealth TCP SYN scan with service version and OS fingerprinting.',
            example: 'nmap --script vuln 192.168.1.50',
            explanation: 'Identifies all open TCP listening ports without completing full three-way TCP handshakes.'
          },
          {
            command: 'tcpdump -nn -vv -i eth0 "tcp port 443 and (tcp-syn != 0)" -w /tmp/tls_handshakes.pcap',
            description: 'Capture TCP SYN connection attempts on port 443 without resolving hostnames or port names to a pcap file.',
            example: 'tshark -r /tmp/tls_handshakes.pcap -Y "ssl.handshake.type == 1"',
            explanation: 'Captures raw network frames for subsequent offline protocol analysis.'
          }
        ],
        studyNotes: [
          'FreeRADIUS standard authentication port is UDP 1812 (accounting on UDP 1813); legacy ports are UDP 1645/1646.',
          'EAP-TLS requires X.509 certificates on BOTH the RADIUS server and all client devices (mutual TLS); PEAP/EAP-MSCHAPv2 requires a certificate only on the server, authenticating clients via username/password.',
          'In tcpdump: `-nn` disables DNS and service port name resolution for speed and security; `-vv` increases packet dissection verbosity.'
        ],
        quickQuestions: [
          {
            question: 'Which EAP method used with FreeRADIUS mandates X.509 client certificates on all connecting client devices for mutual authentication?',
            options: ['PEAP-MSCHAPv2', 'EAP-TLS', 'EAP-TTLS with PAP', 'EAP-GTC'],
            correctIndex: 1,
            explanation: 'EAP-TLS (Transport Layer Security) requires both the RADIUS server and client devices to present valid X.509 certificates for mutual cryptographic authentication.'
          }
        ]
      },
      {
        id: '328.2',
        title: 'Network Intrusion Detection',
        weight: 4,
        description: 'Configure and monitor Network Intrusion Detection Systems (NIDS) with Snort and Suricata, write custom detection rules, use Zeek (Bro) for network monitoring, and run OpenVAS / Greenbone vulnerability scans.',
        keyKnowledgeAreas: [
          'Understand Network Intrusion Detection (NIDS) vs Network Intrusion Prevention (NIPS) in inline and passive TAP/SPAN modes',
          'Configure Snort and Suricata NIDS daemons and understand rule structures: action, protocol, source/destination IP/port, direction, and rule options (msg, content, nocase, sid, rev, classtype)',
          'Manage and update signature rulesets with pulledpork or suricata-update',
          'Inspect Suricata unified alert logs and structured event logs (eve.json)',
          'Understand the Zeek (Bro) network security monitoring framework: protocol log extraction (conn.log, http.log, ssl.log, dns.log)',
          'Configure OpenVAS / Greenbone Community Edition for automated network vulnerability scanning and remediation assessment'
        ],
        termsAndUtilities: [
          'Snort', 'Suricata', 'NIDS', 'NIPS', 'Zeek', 'Bro', 'OpenVAS', 'Greenbone', 'eve.json', 'suricata-update',
          'rule action (alert/drop/pass)', 'sid', 'rev', 'classtype', 'content', 'conn.log'
        ],
        filesAndPaths: [
          '/etc/snort/snort.conf',
          '/etc/suricata/suricata.yaml',
          '/var/log/suricata/eve.json',
          '/var/log/suricata/fast.log',
          '/etc/suricata/rules/'
        ],
        keyCommands: [
          {
            command: 'suricata -c /etc/suricata/suricata.yaml -i eth0 --dump-config',
            description: 'Validate Suricata YAML configuration file and run in live packet inspection mode on interface eth0.',
            example: 'suricata-update',
            explanation: 'Initializes multi-threaded packet capture and loads active detection rulesets.'
          },
          {
            command: 'tail -f /var/log/suricata/eve.json | jq \'select(.event_type=="alert")\'',
            description: 'Monitor real-time NIDS intrusion alerts formatted in JSON using jq parser.',
            example: 'tail -f /var/log/suricata/fast.log',
            explanation: 'Parses the unified structured event log containing metadata for alerts, DNS queries, and TLS handshakes.'
          },
          {
            command: 'zeek -i eth0',
            description: 'Start live passive network analysis with Zeek, generating structured TSV log files for all network protocols.',
            example: 'cat conn.log | zeek-cut id.orig_h id.resp_h proto service duration',
            explanation: 'Generates detailed activity logs (conn.log, ssl.log, dns.log, x509.log) for deep traffic auditing.'
          }
        ],
        studyNotes: [
          'Suricata/Snort rule format: `action proto src_ip src_port -> dst_ip dst_port (options)`.\nExample: `alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (msg:"SQLi Attempt"; content:"UNION SELECT"; nocase; sid:1000001; rev:1;)`.',
          'Rule components: `sid` is the unique Signature ID (local custom rules should use sid >= 1000000); `rev` is rule revision number.',
          'Suricata supports multi-threaded processing and native JSON logging in `eve.json`, making it ideal for integration with SIEM platforms (Elasticsearch/Splunk).'
        ],
        quickQuestions: [
          {
            question: 'In a Snort or Suricata rule, which rule option uniquely identifies the rule number, with values >= 1,000,000 reserved for local custom rules?',
            options: ['gid (Generator ID)', 'sid (Signature ID)', 'rev (Revision)', 'classtype'],
            correctIndex: 1,
            explanation: 'The `sid` (Signature ID) uniquely identifies individual rules. SIDs 1,000,000 and above are reserved for custom site-specific rules.'
          }
        ]
      },
      {
        id: '328.3',
        title: 'Packet Filtering',
        weight: 5,
        description: 'Configure and administer Linux packet filtering firewalls using Netfilter (iptables, ip6tables) and nftables, write stateful inspection rules, manage NAT (SNAT/DNAT/MASQUERADE), and understand ebtables.',
        keyKnowledgeAreas: [
          'Understand Netfilter architecture: tables (filter, nat, mangle, raw, security) and chains (INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING)',
          'Configure stateful firewall rules with iptables and ip6tables using the conntrack match module (NEW, ESTABLISHED, RELATED, INVALID)',
          'Implement Network Address Translation (NAT): Source NAT (SNAT), Dynamic Port Translation (MASQUERADE), and Port Forwarding (DNAT)',
          'Save and restore iptables rules persistently: iptables-save, iptables-restore, iptables-persistent / netfilter-persistent',
          'Understand the modern nftables framework: tables, chains, sets, maps, element timeouts, and unified IPv4/IPv6 inet address family',
          'Administer nftables using the nft utility, write /etc/nftables.conf configuration rulesets, and convert legacy rules using iptables-translate'
        ],
        termsAndUtilities: [
          'iptables', 'ip6tables', 'nftables', 'nft', 'conntrack', 'ebtables', 'filter', 'nat', 'mangle', 'raw',
          'INPUT', 'OUTPUT', 'FORWARD', 'PREROUTING', 'POSTROUTING', 'SNAT', 'DNAT', 'MASQUERADE', 'ACCEPT', 'DROP', 'REJECT'
        ],
        filesAndPaths: [
          '/etc/nftables.conf',
          '/etc/sysconfig/iptables',
          '/etc/iptables/rules.v4',
          '/etc/iptables/rules.v6'
        ],
        keyCommands: [
          {
            command: 'iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT',
            description: 'Allow all incoming packets belonging to existing established connections or related helper sessions.',
            example: 'iptables -A INPUT -i lo -j ACCEPT\niptables -P INPUT DROP',
            explanation: 'Foundation of stateful inspection: accepts return traffic while dropping unsolicited inbound packets.'
          },
          {
            command: 'iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to-destination 10.0.0.10:8080',
            description: 'Configure Destination NAT (DNAT / Port Forwarding) to route incoming public web traffic to an internal host.',
            example: 'iptables -t nat -A POSTROUTING -o eth0 -s 10.0.0.0/24 -j MASQUERADE',
            explanation: 'Applies DNAT in PREROUTING chain before routing decisions are made.'
          },
          {
            command: 'nft add rule inet filter input ct state established,related accept',
            description: 'Add a stateful connection tracking rule in nftables for unified IPv4 and IPv6 traffic under the inet family.',
            example: 'nft list ruleset',
            explanation: 'Uses the modern nft syntax without requiring separate iptables and ip6tables rule files.'
          },
          {
            command: 'iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT',
            description: 'Translate legacy iptables rule syntax into modern equivalent nftables syntax.',
            example: 'Output: nft add rule ip filter INPUT tcp dport 22 counter accept',
            explanation: 'Aids migration from legacy iptables to nftables.'
          }
        ],
        studyNotes: [
          'Packet traversal in Netfilter: Inbound routed traffic passes through `PREROUTING (nat/mangle) -> Routing Decision -> FORWARD (filter) -> POSTROUTING (nat)`. Local traffic passes through `PREROUTING -> INPUT (filter) -> Local Process`.',
          'DNAT (Port Forwarding) must always be performed in the `PREROUTING` chain of the `nat` table; SNAT / MASQUERADE must always be performed in the `POSTROUTING` chain.',
          'nftables replaces iptables, ip6tables, ebtables, and arptables with a single unified bytecode engine, eliminating duplicate chains and table lookups.'
        ],
        quickQuestions: [
          {
            question: 'In which Netfilter chain and table must Destination NAT (DNAT / port forwarding) be configured?',
            options: ['INPUT chain in the filter table', 'POSTROUTING chain in the nat table', 'PREROUTING chain in the nat table', 'FORWARD chain in the mangle table'],
            correctIndex: 2,
            explanation: 'DNAT alters the destination IP before the Linux kernel makes the routing decision, which requires it to be executed in the PREROUTING chain of the `nat` table.'
          }
        ]
      },
      {
        id: '328.4',
        title: 'Virtual Private Networks (VPNs)',
        weight: 4,
        description: 'Implement and configure secure Virtual Private Networks using OpenVPN, IPsec with strongSwan, and WireGuard kernel VPN.',
        keyKnowledgeAreas: [
          'Understand VPN architectures: Site-to-Site vs Remote Access, routed (tun) vs bridged (tap) tunnels',
          'Configure OpenVPN server and client: /etc/openvpn/server.conf, TLS authentication (tls-auth / tls-crypt), Diffie-Hellman parameters (dh.pem), cipher selection, and routing push options',
          'Configure IPsec with strongSwan: IKEv1 vs IKEv2 protocols, Phase 1 (IKE SA) and Phase 2 (Child / IPsec SA) parameter negotiation',
          'strongSwan configuration files: /etc/ipsec.conf, /etc/ipsec.secrets, and modern /etc/strongswan/swanctl/swanctl.conf; manage tunnels with swanctl and ipsec commands',
          'Configure WireGuard modern kernel VPN: /etc/wireguard/wg0.conf, Curve25519 public/private key generation (wg genkey / wg pubkey), AllowedIPs cryptokey routing, and wg-quick management'
        ],
        termsAndUtilities: [
          'OpenVPN', 'tun', 'tap', 'tls-auth', 'tls-crypt', 'strongSwan', 'IPsec', 'IKEv1', 'IKEv2', 'swanctl', 'ipsec.conf',
          'WireGuard', 'wg', 'wg-quick', 'AllowedIPs', 'Curve25519', 'ChaCha20-Poly1305', 'wg0.conf'
        ],
        filesAndPaths: [
          '/etc/openvpn/server.conf',
          '/etc/openvpn/client.ovpn',
          '/etc/ipsec.conf',
          '/etc/ipsec.secrets',
          '/etc/strongswan/swanctl/swanctl.conf',
          '/etc/wireguard/wg0.conf'
        ],
        keyCommands: [
          {
            command: 'wg genkey | tee privatekey | wg pubkey > publickey',
            description: 'Generate a Curve25519 private key and derive its corresponding public key for WireGuard VPN peers.',
            example: 'chmod 600 privatekey',
            explanation: 'Generates Base64-encoded cryptographic keys for WireGuard configuration.'
          },
          {
            command: 'wg-quick up wg0',
            description: 'Bring up the WireGuard wg0 interface and configure cryptokey routing and firewall rules automatically.',
            example: 'wg show wg0',
            explanation: 'Parses /etc/wireguard/wg0.conf, creates the network interface, assigns IP, and configures AllowedIPs routes.'
          },
          {
            command: 'swanctl --load-all && swanctl --initiate --child net-to-net',
            description: 'Load all IPsec connections from swanctl.conf and initiate IKEv2/IPsec Phase 1 and Phase 2 negotiations.',
            example: 'swanctl --list-sas',
            explanation: 'Modern strongSwan control tool to manage IKEv2 security associations (SAs).'
          },
          {
            command: 'openvpn --config /etc/openvpn/server.conf --daemon',
            description: 'Launch OpenVPN server daemon in background mode using the specified configuration file.',
            example: 'systemctl start openvpn-server@server',
            explanation: 'Initializes the tun0 interface, listens on UDP port 1194, and manages SSL/TLS client tunnels.'
          }
        ],
        studyNotes: [
          'WireGuard uses "Cryptokey Routing": each peer is associated with its public key and a list of AllowedIPs (e.g. `AllowedIPs = 10.0.0.2/32`). Outbound packets destined for 10.0.0.2 are encrypted with that peer public key.',
          'OpenVPN: `dev tun` operates at Layer 3 (IP routing); `dev tap` operates at Layer 2 (Ethernet bridging, supports non-IP broadcasts).',
          'IPsec IKEv2 (Internet Key Exchange v2) provides faster rekeying, native NAT traversal (UDP port 4500), and robust mobility support compared to legacy IKEv1.'
        ],
        quickQuestions: [
          {
            question: 'In WireGuard configuration, what is the role of the `AllowedIPs` directive for a peer?',
            options: ['It defines firewall source IP addresses permitted to connect to the listening port', 'It acts as both an access control list and an internal routing table for packet encryption and decryption', 'It lists public DNS servers pushed to the client', 'It specifies the external IP of the remote VPN server'],
            correctIndex: 1,
            explanation: 'WireGuard Cryptokey Routing uses `AllowedIPs` to decide which public key to use when encrypting outbound packets and verifies the source IP of inbound decrypted packets.'
          }
        ]
      }
    ]
  }
];
