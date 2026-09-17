# -*- coding: utf-8 -*-

challenges_303 = [
  {
    "id": "seq-303-1",
    "title": "Building an Enterprise Two-Tier PKI with Offline Root CA and Intermediate CA",
    "titleFr": "Déploiement d'une infrastructure PKI à 2 niveaux (Root CA hors-ligne & Intermediate CA)",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.1",
    "category": "Cryptography & PKI",
    "description": "Ordonnez la démarche cryptographique recommandée pour bâtir une autorité de certification (CA) d'entreprise sécurisée avec OpenSSL.",
    "descriptionFr": "Ordonnez la démarche cryptographique recommandée pour bâtir une autorité de certification (CA) d'entreprise sécurisée avec OpenSSL.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération de la clé privée de l'Autorité Racine avec chiffrement fort (AES-256)",
        "labelFr": "1. Génération de la clé privée de l'Autorité Racine avec chiffrement fort (AES-256)",
        "detail": "Exécuter : openssl genrsa -aes256 -out /root/ca/private/root-ca.key.pem 4096",
        "detailFr": "Exécuter : openssl genrsa -aes256 -out /root/ca/private/root-ca.key.pem 4096"
      },
      {
        "id": "s2",
        "label": "2. Création du certificat auto-signé de l'Autorité Racine (Root CA Certificate)",
        "labelFr": "2. Création du certificat auto-signé de l'Autorité Racine (Root CA Certificate)",
        "detail": "Créer le certificat racine avec extension v3_ca : openssl req -config openssl.cnf -key root-ca.key.pem -new -x509 -days 7300 -sha256 -out root-ca.cert.pem",
        "detailFr": "Créer le certificat racine avec extension v3_ca : openssl req -config openssl.cnf -key root-ca.key.pem -new -x509 -days 7300 -sha256 -out root-ca.cert.pem"
      },
      {
        "id": "s3",
        "label": "3. Génération de la clé privée et de la demande de signature (CSR) de l'Autorité Intermédiaire",
        "labelFr": "3. Génération de la clé privée et de la demande de signature (CSR) de l'Autorité Intermédiaire",
        "detail": "Générer intermediate.key.pem puis la CSR : openssl req -config intermediate.cnf -new -sha256 -key intermediate.key.pem -out intermediate.csr.pem",
        "detailFr": "Générer intermediate.key.pem puis la CSR : openssl req -config intermediate.cnf -new -sha256 -key intermediate.key.pem -out intermediate.csr.pem"
      },
      {
        "id": "s4",
        "label": "4. Signature de la CSR de l'Autorité Intermédiaire par l'Autorité Racine avec extension v3_intermediate_ca",
        "labelFr": "4. Signature de la CSR de l'Autorité Intermédiaire par l'Autorité Racine avec extension v3_intermediate_ca",
        "detail": "Signer avec la clé racine : openssl ca -config openssl.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediate.csr.pem -out intermediate.cert.pem",
        "detailFr": "Signer avec la clé racine : openssl ca -config openssl.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediate.csr.pem -out intermediate.cert.pem"
      },
      {
        "id": "s5",
        "label": "5. Assemblage de la chaîne de confiance (CA Chain) et mise hors-ligne de la machine Racine",
        "labelFr": "5. Assemblage de la chaîne de confiance (CA Chain) et mise hors-ligne de la machine Racine",
        "detail": "Concaténer intermediate.cert.pem et root-ca.cert.pem dans ca-chain.cert.pem puis déconnecter/éteindre la Root CA",
        "detailFr": "Concaténer intermediate.cert.pem et root-ca.cert.pem dans ca-chain.cert.pem puis déconnecter/éteindre la Root CA"
      }
    ],
    "explanation": "L'architecture PKI 2-tiers suit : 1) clé privée Root chiffrée, 2) certificat Root auto-signé, 3) clé et CSR de l'Intermédiaire, 4) signature de l'Intermédiaire par la Root avec contraintes de base (pathlen), 5) création de la chaîne et mise hors-ligne physique de la Root CA.",
    "explanationFr": "L'architecture PKI 2-tiers suit : 1) clé privée Root chiffrée, 2) certificat Root auto-signé, 3) clé et CSR de l'Intermédiaire, 4) signature de l'Intermédiaire par la Root avec contraintes de base (pathlen), 5) création de la chaîne et mise hors-ligne physique de la Root CA."
  },
  {
    "id": "seq-303-2",
    "title": "Creating, Compiling, and Loading a Custom SELinux Policy Module",
    "titleFr": "Création, compilation et chargement d'un module de politique SELinux sur-mesure",
    "certification": "lpic-3",
    "topicNumber": 322,
    "objectiveId": "322.1",
    "category": "Access Control (SELinux)",
    "description": "Ordonnez les étapes pour résoudre méthodiquement un blocage d'accès AVC dans SELinux en générant et chargeant un module binaire (.pp).",
    "descriptionFr": "Ordonnez les étapes pour résoudre méthodiquement un blocage d'accès AVC dans SELinux en générant et chargeant un module binaire (.pp).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Basculement temporaire du domaine ou du système en mode Permissif (setenforce 0)",
        "labelFr": "1. Basculement temporaire du domaine ou du système en mode Permissif (setenforce 0)",
        "detail": "Exécuter setenforce 0 ou semanage permissive -a <type> pour enregistrer tous les refus sans interrompre le service",
        "detailFr": "Exécuter setenforce 0 ou semanage permissive -a <type> pour enregistrer tous les refus sans interrompre le service"
      },
      {
        "id": "s2",
        "label": "2. Exécution du scénario applicatif complet pour générer les traces AVC dans audit.log",
        "labelFr": "2. Exécution du scénario applicatif complet pour générer les traces AVC dans audit.log",
        "detail": "Solliciter toutes les fonctions normales du démon afin que le noyau journalise les accès requis dans /var/log/audit/audit.log",
        "detailFr": "Solliciter toutes les fonctions normales du démon afin que le noyau journalise les accès requis dans /var/log/audit/audit.log"
      },
      {
        "id": "s3",
        "label": "3. Extraction et génération du fichier source Type Enforcement (.te) avec audit2allow",
        "labelFr": "3. Extraction et génération du fichier source Type Enforcement (.te) avec audit2allow",
        "detail": "Générer le code source : ausearch -m avc -ts recent | audit2allow -m mycustomapp > mycustomapp.te",
        "detailFr": "Générer le code source : ausearch -m avc -ts recent | audit2allow -m mycustomapp > mycustomapp.te"
      },
      {
        "id": "s4",
        "label": "4. Compilation du module intermédiaire (.mod) et création du package binaire (.pp)",
        "labelFr": "4. Compilation du module intermédiaire (.mod) et création du package binaire (.pp)",
        "detail": "Compiler avec : checkmodule -M -m -o mycustomapp.mod mycustomapp.te && semodule_package -o mycustomapp.pp -m mycustomapp.mod",
        "detailFr": "Compiler avec : checkmodule -M -m -o mycustomapp.mod mycustomapp.te && semodule_package -o mycustomapp.pp -m mycustomapp.mod"
      },
      {
        "id": "s5",
        "label": "5. Installation du package binaire dans le noyau et réactivation du mode Enforcing (setenforce 1)",
        "labelFr": "5. Installation du package binaire dans le noyau et réactivation du mode Enforcing (setenforce 1)",
        "detail": "Installer le module avec semodule -i mycustomapp.pp puis rétablir setenforce 1 pour valider l'exécution sécurisée",
        "detailFr": "Installer le module avec semodule -i mycustomapp.pp puis rétablir setenforce 1 pour valider l'exécution sécurisée"
      }
    ],
    "explanation": "La création de module SELinux respecte : 1) mode permissif temporaire, 2) exécution du scénario pour peupler audit.log, 3) audit2allow -m générant le .te, 4) checkmodule et semodule_package générant le .pp, 5) semodule -i puis setenforce 1.",
    "explanationFr": "La création de module SELinux respecte : 1) mode permissif temporaire, 2) exécution du scénario pour peupler audit.log, 3) audit2allow -m générant le .te, 4) checkmodule et semodule_package générant le .pp, 5) semodule -i puis setenforce 1."
  },
  {
    "id": "seq-303-3",
    "title": "Automated LUKS2 Disk Decryption at Boot via Clevis and Tang (NBDE)",
    "titleFr": "Déverrouillage automatique de disque LUKS2 au démarrage avec Clevis et Tang (NBDE)",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.3",
    "category": "Cryptography & PKI",
    "description": "Ordonnez les étapes pour mettre en œuvre le déchiffrement réseau sans interaction humaine (Network Bound Disk Encryption) d'un volume racine sous Linux.",
    "descriptionFr": "Ordonnez les étapes pour mettre en œuvre le déchiffrement réseau sans interaction humaine (Network Bound Disk Encryption) d'un volume racine sous Linux.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déploiement et démarrage du serveur de clés réseau Tang (tang.socket)",
        "labelFr": "1. Déploiement et démarrage du serveur de clés réseau Tang (tang.socket)",
        "detail": "Activer le service Tang sur le serveur central : systemctl enable --now tangd.socket",
        "detailFr": "Activer le service Tang sur le serveur central : systemctl enable --now tangd.socket"
      },
      {
        "id": "s2",
        "label": "2. Formatage de la partition de données au format LUKS2 (cryptsetup luksFormat)",
        "labelFr": "2. Formatage de la partition de données au format LUKS2 (cryptsetup luksFormat)",
        "detail": "Créer le conteneur chiffré : cryptsetup luksFormat --type luks2 /dev/sdb1 avec une passphrase de secours",
        "detailFr": "Créer le conteneur chiffré : cryptsetup luksFormat --type luks2 /dev/sdb1 avec une passphrase de secours"
      },
      {
        "id": "s3",
        "label": "3. Liaison du keyslot LUKS2 au serveur Tang avec le client Clevis (clevis luks bind)",
        "labelFr": "3. Liaison du keyslot LUKS2 au serveur Tang avec le client Clevis (clevis luks bind)",
        "detail": "Exécuter : clevis luks bind -d /dev/sdb1 tang '{\"url\":\"http://tang.corp.lan\"}'",
        "detailFr": "Exécuter : clevis luks bind -d /dev/sdb1 tang '{\"url\":\"http://tang.corp.lan\"}'"
      },
      {
        "id": "s4",
        "label": "4. Activation de l'interrogateur systemd en phase de boot (clevis-luks-askpass)",
        "labelFr": "4. Activation de l'interrogateur systemd en phase de boot (clevis-luks-askpass)",
        "detail": "Activer le composant de déverrouillage : systemctl enable clevis-luks-askpass.path",
        "detailFr": "Activer le composant de déverrouillage : systemctl enable clevis-luks-askpass.path"
      },
      {
        "id": "s5",
        "label": "5. Régénération de l'image initramfs avec le module clevis (dracut / update-initramfs)",
        "labelFr": "5. Régénération de l'image initramfs avec le module clevis (dracut / update-initramfs)",
        "detail": "Reconstruire l'initramfs pour inclure la couche réseau et le binaire clevis : dracut -f --regenerate-all",
        "detailFr": "Reconstruire l'initramfs pour inclure la couche réseau et le binaire clevis : dracut -f --regenerate-all"
      }
    ],
    "explanation": "L'architecture NBDE (Clevis/Tang) exige : 1) serveur Tang actif sur tangd.socket, 2) formatage LUKS2, 3) liaison clevis luks bind sur le keyslot, 4) activation clevis-luks-askpass, 5) inclusion de Clevis dans l'initramfs via dracut.",
    "explanationFr": "L'architecture NBDE (Clevis/Tang) exige : 1) serveur Tang actif sur tangd.socket, 2) formatage LUKS2, 3) liaison clevis luks bind sur le keyslot, 4) activation clevis-luks-askpass, 5) inclusion de Clevis dans l'initramfs via dracut."
  },
  {
    "id": "seq-303-4",
    "title": "Setting Up Site-to-Site Route-Based IPsec VPN with strongSwan and VTI",
    "titleFr": "Montage d'un tunnel VPN IPsec routé site-à-site avec strongSwan et interface VTI",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.1",
    "category": "Network Security",
    "description": "Ordonnez la démarche pour interconnecter deux réseaux distants via un tunnel IPsec routé moderne fondé sur une interface virtuelle VTI (Virtual Tunnel Interface).",
    "descriptionFr": "Ordonnez la démarche pour interconnecter deux réseaux distants via un tunnel IPsec routé moderne fondé sur une interface virtuelle VTI (Virtual Tunnel Interface).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration des propositions cryptographiques IKEv2 et ESP dans swanctl.conf",
        "labelFr": "1. Configuration des propositions cryptographiques IKEv2 et ESP dans swanctl.conf",
        "detail": "Définir les chiffrements AES-256-GCM, SHA-384, PRF et groupe DH 19/20 pour la phase 1 et la phase 2",
        "detailFr": "Définir les chiffrements AES-256-GCM, SHA-384, PRF et groupe DH 19/20 pour la phase 1 et la phase 2"
      },
      {
        "id": "s2",
        "label": "2. Déclaration du marquage de paquets (mark_in / mark_out) associé au tunnel VTI",
        "labelFr": "2. Déclaration du marquage de paquets (mark_in / mark_out) associé au tunnel VTI",
        "detail": "Spécifier if_id_in et if_id_out (ou vti marks) pour mapper l'association de sécurité (SA) à l'interface VTI",
        "detailFr": "Spécifier if_id_in et if_id_out (ou vti marks) pour mapper l'association de sécurité (SA) à l'interface VTI"
      },
      {
        "id": "s3",
        "label": "3. Création et activation de l'interface réseau VTI dans le noyau Linux (ip link)",
        "labelFr": "3. Création et activation de l'interface réseau VTI dans le noyau Linux (ip link)",
        "detail": "Créer l'interface : ip link add vti0 type vti local <ip_locale> remote <ip_distante> key 42 && ip link set vti0 up",
        "detailFr": "Créer l'interface : ip link add vti0 type vti local <ip_locale> remote <ip_distante> key 42 && ip link set vti0 up"
      },
      {
        "id": "s4",
        "label": "4. Attribution d'adresses d'interconnexion et ajout des routes statiques vers le sous-réseau distant",
        "labelFr": "4. Attribution d'adresses d'interconnexion et ajout des routes statiques vers le sous-réseau distant",
        "detail": "Assigner l'IP point-à-point et ajouter la route : ip route add 192.168.20.0/24 dev vti0",
        "detailFr": "Assigner l'IP point-à-point et ajouter la route : ip route add 192.168.20.0/24 dev vti0"
      },
      {
        "id": "s5",
        "label": "5. Chargement des secrets et initiation de la négociation IKE avec swanctl --initiate",
        "labelFr": "5. Chargement des secrets et initiation de la négociation IKE avec swanctl --initiate",
        "detail": "Exécuter swanctl --load-all && swanctl --initiate --child net-to-net et vérifier avec swanctl --list-sas",
        "detailFr": "Exécuter swanctl --load-all && swanctl --initiate --child net-to-net et vérifier avec swanctl --list-sas"
      }
    ],
    "explanation": "Un VPN IPsec routé VTI strongSwan suit : 1) politique cryptographique IKEv2/ESP, 2) définition du marquage mark/if_id, 3) création de l'interface vti0 dans le noyau, 4) adressage et ajout de la route statique via vti0, 5) chargement swanctl et montage de la SA.",
    "explanationFr": "Un VPN IPsec routé VTI strongSwan suit : 1) politique cryptographique IKEv2/ESP, 2) définition du marquage mark/if_id, 3) création de l'interface vti0 dans le noyau, 4) adressage et ajout de la route statique via vti0, 5) chargement swanctl et montage de la SA."
  },
  {
    "id": "seq-303-5",
    "title": "Deploying a WireGuard VPN Tunnel with Pre-Shared Key (PSK) Hardening",
    "titleFr": "Déploiement d'un tunnel WireGuard durci avec clé pré-partagée post-quantique (PSK)",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.2",
    "category": "Network Security",
    "description": "Ordonnez les étapes pour configurer et activer une liaison VPN WireGuard point-à-point renforcée par une clé PSK symétrique.",
    "descriptionFr": "Ordonnez les étapes pour configurer et activer une liaison VPN WireGuard point-à-point renforcée par une clé PSK symétrique.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération de la paire de clés asymétriques du serveur et du client (wg genkey)",
        "labelFr": "1. Génération de la paire de clés asymétriques du serveur et du client (wg genkey)",
        "detail": "Créer la clé privée et extraire la clé publique : wg genkey | tee privatekey | wg pubkey > publickey",
        "detailFr": "Créer la clé privée et extraire la clé publique : wg genkey | tee privatekey | wg pubkey > publickey"
      },
      {
        "id": "s2",
        "label": "2. Génération de la clé symétrique pré-partagée additionnelle (wg genpsk)",
        "labelFr": "2. Génération de la clé symétrique pré-partagée additionnelle (wg genpsk)",
        "detail": "Générer la clé de protection post-quantique : wg genpsk > preshared.key",
        "detailFr": "Générer la clé de protection post-quantique : wg genpsk > preshared.key"
      },
      {
        "id": "s3",
        "label": "3. Rédaction du fichier de configuration /etc/wireguard/wg0.conf avec permissions 600",
        "labelFr": "3. Rédaction du fichier de configuration /etc/wireguard/wg0.conf avec permissions 600",
        "detail": "Définir [Interface] (PrivateKey, Address, ListenPort) et [Peer] (PublicKey, PresharedKey, AllowedIPs, Endpoint)",
        "detailFr": "Définir [Interface] (PrivateKey, Address, ListenPort) et [Peer] (PublicKey, PresharedKey, AllowedIPs, Endpoint)"
      },
      {
        "id": "s4",
        "label": "4. Activation de l'acheminement de paquets IP (net.ipv4.ip_forward = 1)",
        "labelFr": "4. Activation de l'acheminement de paquets IP (net.ipv4.ip_forward = 1)",
        "detail": "Activer le routage dans le noyau : sysctl -w net.ipv4.ip_forward=1",
        "detailFr": "Activer le routage dans le noyau : sysctl -w net.ipv4.ip_forward=1"
      },
      {
        "id": "s5",
        "label": "5. Montée de l'interface WireGuard et vérification du handshake cryptographique (wg show)",
        "labelFr": "5. Montée de l'interface WireGuard et vérification du handshake cryptographique (wg show)",
        "detail": "Démarrer avec wg-quick up wg0 et vérifier la poignée de main avec wg show wg0",
        "detailFr": "Démarrer avec wg-quick up wg0 et vérifier la poignée de main avec wg show wg0"
      }
    ],
    "explanation": "Le tunnel WireGuard avec PSK requiert : 1) génération des paires asymétriques Curve25519, 2) génération de la clé PSK symétrique, 3) rédaction de wg0.conf en chmod 600, 4) activation de l'ip_forwarding, 5) wg-quick up et contrôle du handshake avec wg show.",
    "explanationFr": "Le tunnel WireGuard avec PSK requiert : 1) génération des paires asymétriques Curve25519, 2) génération de la clé PSK symétrique, 3) rédaction de wg0.conf en chmod 600, 4) activation de l'ip_forwarding, 5) wg-quick up et contrôle du handshake avec wg show."
  },
  {
    "id": "seq-303-6",
    "title": "Revoking an X.509 Certificate and Publishing CRL & OCSP Responder",
    "titleFr": "Révocation d'un certificat X.509, émission de la CRL et mise en ligne du répondeur OCSP",
    "certification": "lpic-3",
    "topicNumber": 321,
    "objectiveId": "321.2",
    "category": "Cryptography & PKI",
    "description": "Ordonnez la démarche pour révoquer formellement un certificat compromis, publier la liste de révocation et activer la vérification OCSP.",
    "descriptionFr": "Ordonnez la démarche pour révoquer formellement un certificat compromis, publier la liste de révocation et activer la vérification OCSP.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déclaration de la révocation du certificat dans la base de données de la CA (openssl ca -revoke)",
        "labelFr": "1. Déclaration de la révocation du certificat dans la base de données de la CA (openssl ca -revoke)",
        "detail": "Exécuter : openssl ca -config intermediate.cnf -revoke certs/compromised.cert.pem -crl_reason keyCompromise",
        "detailFr": "Exécuter : openssl ca -config intermediate.cnf -revoke certs/compromised.cert.pem -crl_reason keyCompromise"
      },
      {
        "id": "s2",
        "label": "2. Génération et signature de la nouvelle liste de révocation (CRL)",
        "labelFr": "2. Génération et signature de la nouvelle liste de révocation (CRL)",
        "detail": "Produire le fichier CRL signé : openssl ca -config intermediate.cnf -gencrl -out crl/intermediate.crl.pem",
        "detailFr": "Produire le fichier CRL signé : openssl ca -config intermediate.cnf -gencrl -out crl/intermediate.crl.pem"
      },
      {
        "id": "s3",
        "label": "3. Publication du fichier CRL sur le point de distribution HTTP (CDP)",
        "labelFr": "3. Publication du fichier CRL sur le point de distribution HTTP (CDP)",
        "detail": "Déposer la CRL sur le serveur Web public mentionné dans l'extension crlDistributionPoints du certificat",
        "detailFr": "Déposer la CRL sur le serveur Web public mentionné dans l'extension crlDistributionPoints du certificat"
      },
      {
        "id": "s4",
        "label": "4. Lancement du service répondeur OCSP (Online Certificate Status Protocol)",
        "labelFr": "4. Lancement du service répondeur OCSP (Online Certificate Status Protocol)",
        "detail": "Démarrer le démon d'interrogation en temps réel : openssl ocsp -index index.txt -port 8888 -rsigner ocsp.cert.pem -rkey ocsp.key.pem -CA intermediate.cert.pem",
        "detailFr": "Démarrer le démon d'interrogation en temps réel : openssl ocsp -index index.txt -port 8888 -rsigner ocsp.cert.pem -rkey ocsp.key.pem -CA intermediate.cert.pem"
      },
      {
        "id": "s5",
        "label": "5. Validation de la réponse de statut révoqué par un client (openssl ocsp)",
        "labelFr": "5. Validation de la réponse de statut révoqué par un client (openssl ocsp)",
        "detail": "Interroger le répondeur : openssl ocsp -CAfile ca-chain.cert.pem -url http://127.0.0.1:8888 -cert compromised.cert.pem et vérifier 'revoked'",
        "detailFr": "Interroger le répondeur : openssl ocsp -CAfile ca-chain.cert.pem -url http://127.0.0.1:8888 -cert compromised.cert.pem et vérifier 'revoked'"
      }
    ],
    "explanation": "La chaîne de révocation suit : 1) openssl ca -revoke avec motif, 2) génération de la CRL (openssl ca -gencrl), 3) publication sur le serveur HTTP, 4) démarrage du répondeur OCSP, 5) test de l'état révoqué avec openssl ocsp.",
    "explanationFr": "La chaîne de révocation suit : 1) openssl ca -revoke avec motif, 2) génération de la CRL (openssl ca -gencrl), 3) publication sur le serveur HTTP, 4) démarrage du répondeur OCSP, 5) test de l'état révoqué avec openssl ocsp."
  },
  {
    "id": "seq-303-7",
    "title": "Deploying Suricata in Inline IPS Mode with NFQUEUE for Active Threat Prevention",
    "titleFr": "Déploiement de Suricata en mode IPS actif (NFQUEUE) pour le blocage d'intrusions",
    "certification": "lpic-3",
    "topicNumber": 324,
    "objectiveId": "324.3",
    "category": "Operations Security",
    "description": "Ordonnez la démarche pour transformer le moteur Suricata d'un simple analyseur passif (IDS) en système de prévention d'intrusion actif (IPS en ligne).",
    "descriptionFr": "Ordonnez la démarche pour transformer le moteur Suricata d'un simple analyseur passif (IDS) en système de prévention d'intrusion actif (IPS en ligne).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Téléchargement et actualisation des signatures de menaces (suricata-update)",
        "labelFr": "1. Téléchargement et actualisation des signatures de menaces (suricata-update)",
        "detail": "Mettre à jour les règles de détection Emerging Threats : suricata-update",
        "detailFr": "Mettre à jour les règles de détection Emerging Threats : suricata-update"
      },
      {
        "id": "s2",
        "label": "2. Modification de l'action des règles critiques de 'alert' vers 'drop' dans suricata.yaml",
        "labelFr": "2. Modification de l'action des règles critiques de 'alert' vers 'drop' dans suricata.yaml",
        "detail": "Configurer drop-rules dans modify.conf pour rejeter activement les flux malveillants avérés",
        "detailFr": "Configurer drop-rules dans modify.conf pour rejeter activement les flux malveillants avérés"
      },
      {
        "id": "s3",
        "label": "3. Démarrage de Suricata en mode écoute NFQUEUE (suricata -q)",
        "labelFr": "3. Démarrage de Suricata en mode écoute NFQUEUE (suricata -q)",
        "detail": "Lancer le service en mode file d'attente noyau : suricata -c /etc/suricata/suricata.yaml -q 0 -D",
        "detailFr": "Lancer le service en mode file d'attente noyau : suricata -c /etc/suricata/suricata.yaml -q 0 -D"
      },
      {
        "id": "s4",
        "label": "4. Redirection du trafic réseau filtré vers la file d'attente NFQUEUE dans le pare-feu",
        "labelFr": "4. Redirection du trafic réseau filtré vers la file d'attente NFQUEUE dans le pare-feu",
        "detail": "Insérer la règle nftables ou iptables : iptables -I FORWARD -j NFQUEUE --queue-num 0",
        "detailFr": "Insérer la règle nftables ou iptables : iptables -I FORWARD -j NFQUEUE --queue-num 0"
      },
      {
        "id": "s5",
        "label": "5. Simulation d'un paquet de test malveillant et contrôle du rejet dans eve.json",
        "labelFr": "5. Simulation d'un paquet de test malveillant et contrôle du rejet dans eve.json",
        "detail": "Émettre une signature de test (curl id:2100498) et vérifier l'enregistrement de l'action drop dans /var/log/suricata/eve.json",
        "detailFr": "Émettre une signature de test (curl id:2100498) et vérifier l'enregistrement de l'action drop dans /var/log/suricata/eve.json"
      }
    ],
    "explanation": "Le déploiement de Suricata en mode IPS (NFQUEUE) exige : 1) mise à jour des signatures (suricata-update), 2) conversion en actions 'drop', 3) démarrage avec l'option -q 0, 4) injection de la cible NFQUEUE dans les règles iptables/nftables, 5) vérification de l'abandon dans eve.json.",
    "explanationFr": "Le déploiement de Suricata en mode IPS (NFQUEUE) exige : 1) mise à jour des signatures (suricata-update), 2) conversion en actions 'drop', 3) démarrage avec l'option -q 0, 4) injection de la cible NFQUEUE dans les règles iptables/nftables, 5) vérification de l'abandon dans eve.json."
  },
  {
    "id": "seq-303-8",
    "title": "Restricting Network Daemons with AppArmor Profile in Enforce Mode",
    "titleFr": "Confinement strict d'un démon réseau avec AppArmor en mode Enforce",
    "certification": "lpic-3",
    "topicNumber": 322,
    "objectiveId": "322.2",
    "category": "Access Control (AppArmor)",
    "description": "Ordonnez la démarche méthodique pour créer, ajuster et verrouiller un profil de sécurité AppArmor sans risquer de briser le service.",
    "descriptionFr": "Ordonnez la démarche méthodique pour créer, ajuster et verrouiller un profil de sécurité AppArmor sans risquer de briser le service.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Génération du squelette de profil AppArmor initial (aa-autodep)",
        "labelFr": "1. Génération du squelette de profil AppArmor initial (aa-autodep)",
        "detail": "Créer le profil de base pour le binaire cible : aa-autodep /usr/sbin/custom_daemon",
        "detailFr": "Créer le profil de base pour le binaire cible : aa-autodep /usr/sbin/custom_daemon"
      },
      {
        "id": "s2",
        "label": "2. Basculement immédiat du profil en mode d'apprentissage (aa-complain)",
        "labelFr": "2. Basculement immédiat du profil en mode d'apprentissage (aa-complain)",
        "detail": "Positionner le profil en mode non-bloquant : aa-complain /usr/sbin/custom_daemon",
        "detailFr": "Positionner le profil en mode non-bloquant : aa-complain /usr/sbin/custom_daemon"
      },
      {
        "id": "s3",
        "label": "3. Exécution d'un plan de charge complet du démon pour enregistrer les appels système",
        "labelFr": "3. Exécution d'un plan de charge complet du démon pour enregistrer les appels système",
        "detail": "Faire fonctionner le démon sous trafic réel afin de collecter les accès fichiers et sockets dans syslog/audit.log",
        "detailFr": "Faire fonctionner le démon sous trafic réel afin de collecter les accès fichiers et sockets dans syslog/audit.log"
      },
      {
        "id": "s4",
        "label": "4. Analyse interactive des journaux et validation des règles d'accès (aa-logprof)",
        "labelFr": "4. Analyse interactive des journaux et validation des règles d'accès (aa-logprof)",
        "detail": "Exécuter aa-logprof pour examiner chaque violation enregistrée et approuver les permissions légitimes",
        "detailFr": "Exécuter aa-logprof pour examiner chaque violation enregistrée et approuver les permissions légitimes"
      },
      {
        "id": "s5",
        "label": "5. Verrouillage du profil final en mode de blocage strict (aa-enforce)",
        "labelFr": "5. Verrouillage du profil final en mode de blocage strict (aa-enforce)",
        "detail": "Activer le confinement strict : aa-enforce /usr/sbin/custom_daemon et vérifier le statut avec aa-status",
        "detailFr": "Activer le confinement strict : aa-enforce /usr/sbin/custom_daemon et vérifier le statut avec aa-status"
      }
    ],
    "explanation": "La création d'un profil AppArmor suit le cycle sécurisé : 1) squelette initial (aa-autodep), 2) passage en mode complain (aa-complain), 3) test applicatif exhaustif, 4) apprentissage interactif (aa-logprof), 5) enforcement final (aa-enforce).",
    "explanationFr": "La création d'un profil AppArmor suit le cycle sécurisé : 1) squelette initial (aa-autodep), 2) passage en mode complain (aa-complain), 3) test applicatif exhaustif, 4) apprentissage interactif (aa-logprof), 5) enforcement final (aa-enforce)."
  },
  {
    "id": "seq-303-9",
    "title": "Configuring Linux Audit Subsystem (auditd) for Immutable Compliance Logging",
    "titleFr": "Configuration du sous-système d'audit Linux (auditd) avec verrouillage d'immuabilité",
    "certification": "lpic-3",
    "topicNumber": 323,
    "objectiveId": "323.1",
    "category": "Operations Security",
    "description": "Ordonnez la démarche pour concevoir une politique d'auditd inviolable surveillant les modifications d'identités et verrouillant la configuration du noyau.",
    "descriptionFr": "Ordonnez la démarche pour concevoir une politique d'auditd inviolable surveillant les modifications d'identités et verrouillant la configuration du noyau.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Définition des paramètres de tampon mémoire et de comportement en cas de débordement",
        "labelFr": "1. Définition des paramètres de tampon mémoire et de comportement en cas de débordement",
        "detail": "Dans /etc/audit/rules.d/audit.rules : configurer -b 8192 et -f 1 (panique ou avertissement)",
        "detailFr": "Dans /etc/audit/rules.d/audit.rules : configurer -b 8192 et -f 1 (panique ou avertissement)"
      },
      {
        "id": "s2",
        "label": "2. Déclaration des règles de surveillance sur les fichiers d'authentification critiques",
        "labelFr": "2. Déclaration des règles de surveillance sur les fichiers d'authentification critiques",
        "detail": "Ajouter : -w /etc/passwd -p wa -k identity_changes et -w /etc/shadow -p wa -k identity_changes",
        "detailFr": "Ajouter : -w /etc/passwd -p wa -k identity_changes et -w /etc/shadow -p wa -k identity_changes"
      },
      {
        "id": "s3",
        "label": "3. Ajout de la règle d'immuabilité matérielle (-e 2) en fin absolue de fichier de règles",
        "labelFr": "3. Ajout de la règle d'immuabilité matérielle (-e 2) en fin absolue de fichier de règles",
        "detail": "Spécifier -e 2 pour interdire toute désactivation ou modification ultérieure des règles sans redémarrage matériel complet",
        "detailFr": "Spécifier -e 2 pour interdire toute désactivation ou modification ultérieure des règles sans redémarrage matériel complet"
      },
      {
        "id": "s4",
        "label": "4. Compilation et chargement des règles dans le noyau (augenrules --load)",
        "labelFr": "4. Compilation et chargement des règles dans le noyau (augenrules --load)",
        "detail": "Fusionner les fichiers de règles et les charger dynamiquement : augenrules --load",
        "detailFr": "Fusionner les fichiers de règles et les charger dynamiquement : augenrules --load"
      },
      {
        "id": "s5",
        "label": "5. Validation de la collecte d'événements et de la recherche par clé (ausearch)",
        "labelFr": "5. Validation de la collecte d'événements et de la recherche par clé (ausearch)",
        "detail": "Déclencher une écriture sur /etc/passwd et interroger : ausearch -k identity_changes --raw",
        "detailFr": "Déclencher une écriture sur /etc/passwd et interroger : ausearch -k identity_changes --raw"
      }
    ],
    "explanation": "La configuration auditd sécurisée exige : 1) définition des tampons mémoire, 2) pose des règles -w avec clés -k, 3) ajout de l'indicateur d'immuabilité -e 2 impérativement en dernière ligne, 4) compilation augenrules --load, 5) test avec ausearch.",
    "explanationFr": "La configuration auditd sécurisée exige : 1) définition des tampons mémoire, 2) pose des règles -w avec clés -k, 3) ajout de l'indicateur d'immuabilité -e 2 impérativement en dernière ligne, 4) compilation augenrules --load, 5) test avec ausearch."
  },
  {
    "id": "seq-303-10",
    "title": "Hardening Linux Kernel and Memory Defense via Sysctl and Bootloader Directives",
    "titleFr": "Durcissement du noyau et protection mémoire via sysctl et directives GRUB",
    "certification": "lpic-3",
    "topicNumber": 323,
    "objectiveId": "323.2",
    "category": "Operations Security",
    "description": "Ordonnez les étapes pour verrouiller les vecteurs d'attaque au niveau noyau (KASLR, restriction dmesg, blocage ptrace et BPF non privilégié).",
    "descriptionFr": "Ordonnez les étapes pour verrouiller les vecteurs d'attaque au niveau noyau (KASLR, restriction dmesg, blocage ptrace et BPF non privilégié).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration des options d'isolation mémoire dans GRUB_CMDLINE_LINUX",
        "labelFr": "1. Configuration des options d'isolation mémoire dans GRUB_CMDLINE_LINUX",
        "detail": "Ajouter pti=on slab_nomerge slub_debug=FZ page_poison=1 dans /etc/default/grub et exécuter update-grub",
        "detailFr": "Ajouter pti=on slab_nomerge slub_debug=FZ page_poison=1 dans /etc/default/grub et exécuter update-grub"
      },
      {
        "id": "s2",
        "label": "2. Interdiction de lecture des tampons du noyau pour les utilisateurs non-root (dmesg_restrict)",
        "labelFr": "2. Interdiction de lecture des tampons du noyau pour les utilisateurs non-root (dmesg_restrict)",
        "detail": "Dans /etc/sysctl.d/99-security.conf : définir kernel.dmesg_restrict = 1 et kernel.kptr_restrict = 2",
        "detailFr": "Dans /etc/sysctl.d/99-security.conf : définir kernel.dmesg_restrict = 1 et kernel.kptr_restrict = 2"
      },
      {
        "id": "s3",
        "label": "3. Verrouillage du débogage inter-processus non autorisé avec le module Yama (ptrace_scope)",
        "labelFr": "3. Verrouillage du débogage inter-processus non autorisé avec le module Yama (ptrace_scope)",
        "detail": "Ajouter : kernel.yama.ptrace_scope = 2 (seul un processus avec CAP_SYS_PTRACE peut déboguer)",
        "detailFr": "Ajouter : kernel.yama.ptrace_scope = 2 (seul un processus avec CAP_SYS_PTRACE peut déboguer)"
      },
      {
        "id": "s4",
        "label": "4. Blocage définitif des appels eBPF non privilégiés (unprivileged_bpf_disabled)",
        "labelFr": "4. Blocage définitif des appels eBPF non privilégiés (unprivileged_bpf_disabled)",
        "detail": "Ajouter : kernel.unprivileged_bpf_disabled = 1 et net.core.bpf_jit_harden = 2",
        "detailFr": "Ajouter : kernel.unprivileged_bpf_disabled = 1 et net.core.bpf_jit_harden = 2"
      },
      {
        "id": "s5",
        "label": "5. Application immédiate et contrôle à chaud des variables du sous-système /proc/sys",
        "labelFr": "5. Application immédiate et contrôle à chaud des variables du sous-système /proc/sys",
        "detail": "Exécuter sysctl --system et vérifier avec sysctl kernel.dmesg_restrict kernel.yama.ptrace_scope",
        "detailFr": "Exécuter sysctl --system et vérifier avec sysctl kernel.dmesg_restrict kernel.yama.ptrace_scope"
      }
    ],
    "explanation": "Le durcissement du noyau suit : 1) paramètres de ligne de commande de démarrage (GRUB/update-grub), 2) restriction dmesg/kptr, 3) restriction ptrace Yama, 4) désactivation de l'eBPF non privilégié, 5) application avec sysctl --system.",
    "explanationFr": "Le durcissement du noyau suit : 1) paramètres de ligne de commande de démarrage (GRUB/update-grub), 2) restriction dmesg/kptr, 3) restriction ptrace Yama, 4) désactivation de l'eBPF non privilégié, 5) application avec sysctl --system."
  }
]

print(f"Prepared {len(challenges_303)} challenges for LPIC-3 303")
