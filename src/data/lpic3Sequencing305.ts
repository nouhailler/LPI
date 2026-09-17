import { SequencingChallenge } from "../types";

export const lpic3Sequencing305: SequencingChallenge[] = [
  {
    "id": "seq-305-1",
    "title": "Deploying a Production KVM Virtual Machine with Cloud-Init via virt-install",
    "titleFr": "Déploiement d'une VM KVM avec injection Cloud-Init via virt-install",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.2",
    "category": "Full Virtualization (KVM/libvirt)",
    "description": "Ordonnez les étapes pour instancier une machine virtuelle KVM de production à partir d'une image cloud générique et d'une source de métadonnées Cloud-Init.",
    "descriptionFr": "Ordonnez les étapes pour instancier une machine virtuelle KVM de production à partir d'une image cloud générique et d'une source de métadonnées Cloud-Init.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création d'un disque virtuel Copy-on-Write (Qcow2) basé sur l'image cloud de référence",
        "labelFr": "1. Création d'un disque virtuel Copy-on-Write (Qcow2) basé sur l'image cloud de référence",
        "detail": "Exécuter : qemu-img create -f qcow2 -b /var/lib/libvirt/images/generic-cloud.qcow2 -F qcow2 /var/lib/libvirt/images/vm01.qcow2 40G",
        "detailFr": "Exécuter : qemu-img create -f qcow2 -b /var/lib/libvirt/images/generic-cloud.qcow2 -F qcow2 /var/lib/libvirt/images/vm01.qcow2 40G"
      },
      {
        "id": "s2",
        "label": "2. Rédaction des directives de configuration utilisateur et réseau (user-data & meta-data)",
        "labelFr": "2. Rédaction des directives de configuration utilisateur et réseau (user-data & meta-data)",
        "detail": "Définir le compte utilisateur, les clés SSH publiques et le hostname dans les fichiers YAML cloud-init",
        "detailFr": "Définir le compte utilisateur, les clés SSH publiques et le hostname dans les fichiers YAML cloud-init"
      },
      {
        "id": "s3",
        "label": "3. Génération de l'image ISO d'initialisation NoCloud (cloud-localds)",
        "labelFr": "3. Génération de l'image ISO d'initialisation NoCloud (cloud-localds)",
        "detail": "Compiler les données dans une image amorçable : cloud-localds /var/lib/libvirt/images/vm01-cidata.iso user-data meta-data",
        "detailFr": "Compiler les données dans une image amorçable : cloud-localds /var/lib/libvirt/images/vm01-cidata.iso user-data meta-data"
      },
      {
        "id": "s4",
        "label": "4. Lancement de l'instanciation de la VM avec virt-install en mode pont réseau (bridge)",
        "labelFr": "4. Lancement de l'instanciation de la VM avec virt-install en mode pont réseau (bridge)",
        "detail": "Lancer virt-install --name vm01 --memory 4096 --vcpus 2 --disk path=/var/lib/libvirt/images/vm01.qcow2 --disk path=/var/lib/libvirt/images/vm01-cidata.iso,device=cdrom --network bridge=br0 --noautoconsole",
        "detailFr": "Lancer virt-install --name vm01 --memory 4096 --vcpus 2 --disk path=/var/lib/libvirt/images/vm01.qcow2 --disk path=/var/lib/libvirt/images/vm01-cidata.iso,device=cdrom --network bridge=br0 --noautoconsole"
      },
      {
        "id": "s5",
        "label": "5. Suivi du premier démarrage et validation de l'état d'exécution (virsh list)",
        "labelFr": "5. Suivi du premier démarrage et validation de l'état d'exécution (virsh list)",
        "detail": "Vérifier le statut actif avec virsh list --all et inspecter la console série avec virsh console vm01",
        "detailFr": "Vérifier le statut actif avec virsh list --all et inspecter la console série avec virsh console vm01"
      }
    ],
    "explanation": "Le déploiement KVM/Cloud-Init exige : 1) disque Qcow2 lié à l'image cloud, 2) rédaction user-data/meta-data, 3) création ISO avec cloud-localds, 4) virt-install liant disque et ISO cdrom, 5) vérification virsh list et virsh console.",
    "explanationFr": "Le déploiement KVM/Cloud-Init exige : 1) disque Qcow2 lié à l'image cloud, 2) rédaction user-data/meta-data, 3) création ISO avec cloud-localds, 4) virt-install liant disque et ISO cdrom, 5) vérification virsh list et virsh console."
  },
  {
    "id": "seq-305-2",
    "title": "Performing Live Storage and Memory Migration of a KVM Guest in libvirt",
    "titleFr": "Migration à chaud mémoire et stockage (Live Migration) d'une VM KVM sous libvirt",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.3",
    "category": "Full Virtualization (KVM/libvirt)",
    "description": "Ordonnez les étapes pour déplacer une machine virtuelle en cours de fonctionnement d'un hyperviseur à un autre sans coupure de service et sans baie de disques partagée.",
    "descriptionFr": "Ordonnez les étapes pour déplacer une machine virtuelle en cours de fonctionnement d'un hyperviseur à un autre sans coupure de service et sans baie de disques partagée.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Vérification de l'homogénéité des configurations réseau (bridges) sur l'hyperviseur cible",
        "labelFr": "1. Vérification de l'homogénéité des configurations réseau (bridges) sur l'hyperviseur cible",
        "detail": "S'assurer que le pont réseau br0 ou le commutateur Open vSwitch existe à l'identique sur la machine de destination",
        "detailFr": "S'assurer que le pont réseau br0 ou le commutateur Open vSwitch existe à l'identique sur la machine de destination"
      },
      {
        "id": "s2",
        "label": "2. Validation de l'authentification mutuelle SSH sans mot de passe entre les hôtes KVM",
        "labelFr": "2. Validation de l'authentification mutuelle SSH sans mot de passe entre les hôtes KVM",
        "detail": "Tester la connexion directe sans saisie : ssh root@kvm-target.corp.lan 'hostname'",
        "detailFr": "Tester la connexion directe sans saisie : ssh root@kvm-target.corp.lan 'hostname'"
      },
      {
        "id": "s3",
        "label": "3. Déclenchement de la migration à chaud avec copie intégrale du disque (virsh migrate)",
        "labelFr": "3. Déclenchement de la migration à chaud avec copie intégrale du disque (virsh migrate)",
        "detail": "Lancer : virsh migrate --live --copy-storage-all --persistent --undefinesource vm01 qemu+ssh://root@kvm-target.corp.lan/system",
        "detailFr": "Lancer : virsh migrate --live --copy-storage-all --persistent --undefinesource vm01 qemu+ssh://root@kvm-target.corp.lan/system"
      },
      {
        "id": "s4",
        "label": "4. Surveillance continue du transfert de la mémoire vive et de l'état de convergence",
        "labelFr": "4. Surveillance continue du transfert de la mémoire vive et de l'état de convergence",
        "detail": "Suivre la progression en temps réel avec : virsh domjobinfo vm01",
        "detailFr": "Suivre la progression en temps réel avec : virsh domjobinfo vm01"
      },
      {
        "id": "s5",
        "label": "5. Confirmation de la prise en charge définitive de la VM par le second hyperviseur",
        "labelFr": "5. Confirmation de la prise en charge définitive de la VM par le second hyperviseur",
        "detail": "Vérifier sur l'hôte distant que la VM est running et que sa définition XML est persistante",
        "detailFr": "Vérifier sur l'hôte distant que la VM est running et que sa définition XML est persistante"
      }
    ],
    "explanation": "La migration KVM sans stockage partagé requiert : 1) vérification des ponts virtuels cibles, 2) validation de la liaison SSH root mutuelle, 3) virsh migrate avec --live --copy-storage-all, 4) surveillance avec virsh domjobinfo, 5) vérification sur l'hôte récepteur.",
    "explanationFr": "La migration KVM sans stockage partagé requiert : 1) vérification des ponts virtuels cibles, 2) validation de la liaison SSH root mutuelle, 3) virsh migrate avec --live --copy-storage-all, 4) surveillance avec virsh domjobinfo, 5) vérification sur l'hôte récepteur."
  },
  {
    "id": "seq-305-3",
    "title": "Bootstrapping a Multi-Node Kubernetes Production Cluster with kubeadm",
    "titleFr": "Initialisation d'un cluster Kubernetes multi-nœuds en production avec kubeadm",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.1",
    "category": "Container Orchestration (Kubernetes)",
    "description": "Ordonnez les étapes pour initialiser un plan de contrôle Kubernetes, déployer le réseau overlay CNI et joindre les nœuds applicatifs.",
    "descriptionFr": "Ordonnez les étapes pour initialiser un plan de contrôle Kubernetes, déployer le réseau overlay CNI et joindre les nœuds applicatifs.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Désactivation définitive du swap et chargement des modules noyau (overlay, br_netfilter)",
        "labelFr": "1. Désactivation définitive du swap et chargement des modules noyau (overlay, br_netfilter)",
        "detail": "Exécuter swapoff -a, commenter le swap dans /etc/fstab et activer net.bridge.bridge-nf-call-iptables = 1",
        "detailFr": "Exécuter swapoff -a, commenter le swap dans /etc/fstab et activer net.bridge.bridge-nf-call-iptables = 1"
      },
      {
        "id": "s2",
        "label": "2. Configuration du runtime de conteneurs containerd avec le pilote cgroup systemd",
        "labelFr": "2. Configuration du runtime de conteneurs containerd avec le pilote cgroup systemd",
        "detail": "Générer /etc/containerd/config.toml et positionner SystemdCgroup = true puis redémarrer containerd",
        "detailFr": "Générer /etc/containerd/config.toml et positionner SystemdCgroup = true puis redémarrer containerd"
      },
      {
        "id": "s3",
        "label": "3. Initialisation du nœud maître de contrôle avec kubeadm init",
        "labelFr": "3. Initialisation du nœud maître de contrôle avec kubeadm init",
        "detail": "Exécuter : kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=<ip_master>",
        "detailFr": "Exécuter : kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=<ip_master>"
      },
      {
        "id": "s4",
        "label": "4. Déploiement du plugin réseau CNI (Container Network Interface) Calico ou Flannel",
        "labelFr": "4. Déploiement du plugin réseau CNI (Container Network Interface) Calico ou Flannel",
        "detail": "Appliquer le manifeste réseau avec : kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml",
        "detailFr": "Appliquer le manifeste réseau avec : kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml"
      },
      {
        "id": "s5",
        "label": "5. Jonction des nœuds de calcul (workers) au cluster avec kubeadm join",
        "labelFr": "5. Jonction des nœuds de calcul (workers) au cluster avec kubeadm join",
        "detail": "Exécuter sur chaque worker : kubeadm join <master_ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>",
        "detailFr": "Exécuter sur chaque worker : kubeadm join <master_ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>"
      }
    ],
    "explanation": "L'installation Kubernetes avec kubeadm respecte : 1) désactivation du swap et activation br_netfilter, 2) containerd avec SystemdCgroup=true, 3) kubeadm init avec pod-network-cidr, 4) application du manifeste CNI, 5) kubeadm join des nœuds workers.",
    "explanationFr": "L'installation Kubernetes avec kubeadm respecte : 1) désactivation du swap et activation br_netfilter, 2) containerd avec SystemdCgroup=true, 3) kubeadm init avec pod-network-cidr, 4) application du manifeste CNI, 5) kubeadm join des nœuds workers."
  },
  {
    "id": "seq-305-4",
    "title": "Building an Unprivileged OCI Container Image with Buildah and Podman",
    "titleFr": "Construction et exécution d'un conteneur non-privilégié avec Buildah et Podman",
    "certification": "lpic-3",
    "topicNumber": 352,
    "objectiveId": "352.3",
    "category": "Container Virtualization",
    "description": "Ordonnez les étapes pour concevoir une image de conteneur conforme OCI sans privilèges root et la lancer sous Podman avec isolation utilisateur (User Namespaces).",
    "descriptionFr": "Ordonnez les étapes pour concevoir une image de conteneur conforme OCI sans privilèges root et la lancer sous Podman avec isolation utilisateur (User Namespaces).",
    "steps": [
      {
        "id": "s1",
        "label": "1. Configuration des plages d'identifiants subuid et subgid de l'utilisateur non-root",
        "labelFr": "1. Configuration des plages d'identifiants subuid et subgid de l'utilisateur non-root",
        "detail": "Définir user:100000:65536 dans /etc/subuid et /etc/subgid pour autoriser le mapping de namespace",
        "detailFr": "Définir user:100000:65536 dans /etc/subuid et /etc/subgid pour autoriser le mapping de namespace"
      },
      {
        "id": "s2",
        "label": "2. Instanciation du conteneur de travail à partir d'une image de base (buildah from)",
        "labelFr": "2. Instanciation du conteneur de travail à partir d'une image de base (buildah from)",
        "detail": "Créer le conteneur modifiable : container=$(buildah from alpine:latest)",
        "detailFr": "Créer le conteneur modifiable : container=$(buildah from alpine:latest)"
      },
      {
        "id": "s3",
        "label": "3. Installation des paquets et injection des binaires applicatifs (buildah run / copy)",
        "labelFr": "3. Installation des paquets et injection des binaires applicatifs (buildah run / copy)",
        "detail": "Exécuter les instructions de construction : buildah run $container apk add nginx && buildah copy $container app.conf /etc/nginx/",
        "detailFr": "Exécuter les instructions de construction : buildah run $container apk add nginx && buildah copy $container app.conf /etc/nginx/"
      },
      {
        "id": "s4",
        "label": "4. Définition du point d'entrée et finalisation de l'image (buildah commit)",
        "labelFr": "4. Définition du point d'entrée et finalisation de l'image (buildah commit)",
        "detail": "Définir l'entrypoint et valider : buildah config --entrypoint '[\"nginx\", \"-g\", \"daemon off;\"]' $container && buildah commit $container myapp:1.0",
        "detailFr": "Définir l'entrypoint et valider : buildah config --entrypoint '[\"nginx\", \"-g\", \"daemon off;\"]' $container && buildah commit $container myapp:1.0"
      },
      {
        "id": "s5",
        "label": "5. Démarrage du conteneur sécurisé avec isolation Podman (podman run --userns=keep-id)",
        "labelFr": "5. Démarrage du conteneur sécurisé avec isolation Podman (podman run --userns=keep-id)",
        "detail": "Lancer en rootless : podman run -d --name app -p 8080:80 --userns=keep-id myapp:1.0",
        "detailFr": "Lancer en rootless : podman run -d --name app -p 8080:80 --userns=keep-id myapp:1.0"
      }
    ],
    "explanation": "La construction rootless OCI suit : 1) allocation subuid/subgid, 2) buildah from, 3) buildah run et copy, 4) configuration de l'entrypoint et buildah commit, 5) exécution sécurisée avec podman run --userns=keep-id.",
    "explanationFr": "La construction rootless OCI suit : 1) allocation subuid/subgid, 2) buildah from, 3) buildah run et copy, 4) configuration de l'entrypoint et buildah commit, 5) exécution sécurisée avec podman run --userns=keep-id."
  },
  {
    "id": "seq-305-5",
    "title": "Configuring Kubernetes Dynamic Persistent Storage (NFS CSI Driver & PVC)",
    "titleFr": "Configuration du stockage persistant dynamique sous Kubernetes (CSI & PVC)",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.2",
    "category": "Container Orchestration (Kubernetes)",
    "description": "Ordonnez la démarche pour permettre l'allocation dynamique de disques persistants à des pods Kubernetes via un pilote CSI.",
    "descriptionFr": "Ordonnez la démarche pour permettre l'allocation dynamique de disques persistants à des pods Kubernetes via un pilote CSI.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déploiement du pilote CSI (Container Storage Interface) dans le cluster",
        "labelFr": "1. Déploiement du pilote CSI (Container Storage Interface) dans le cluster",
        "detail": "Installer le contrôleur et le DaemonSet du pilote CSI (ex. nfs-csi-driver ou local-path-provisioner)",
        "detailFr": "Installer le contrôleur et le DaemonSet du pilote CSI (ex. nfs-csi-driver ou local-path-provisioner)"
      },
      {
        "id": "s2",
        "label": "2. Définition et création de la ressource de classe de stockage (StorageClass)",
        "labelFr": "2. Définition et création de la ressource de classe de stockage (StorageClass)",
        "detail": "Appliquer le manifeste StorageClass précisant le provisioner, volumeBindingMode et les paramètres du serveur",
        "detailFr": "Appliquer le manifeste StorageClass précisant le provisioner, volumeBindingMode et les paramètres du serveur"
      },
      {
        "id": "s3",
        "label": "3. Déclaration de la demande de volume persistant (PersistentVolumeClaim - PVC)",
        "labelFr": "3. Déclaration de la demande de volume persistant (PersistentVolumeClaim - PVC)",
        "detail": "Créer le PVC spécifiant la StorageClass, les modes d'accès (ReadWriteMany) et la taille réclamée (10Gi)",
        "detailFr": "Créer le PVC spécifiant la StorageClass, les modes d'accès (ReadWriteMany) et la taille réclamée (10Gi)"
      },
      {
        "id": "s4",
        "label": "4. Association de la revendication de volume (PVC) au déploiement du Pod",
        "labelFr": "4. Association de la revendication de volume (PVC) au déploiement du Pod",
        "detail": "Monter le volume dans la strophe spec.template.spec.volumes.persistentVolumeClaim du déploiement",
        "detailFr": "Monter le volume dans la strophe spec.template.spec.volumes.persistentVolumeClaim du déploiement"
      },
      {
        "id": "s5",
        "label": "5. Vérification de l'état 'Bound' automatique du PV et du bon montage applicatif",
        "labelFr": "5. Vérification de l'état 'Bound' automatique du PV et du bon montage applicatif",
        "detail": "Contrôler avec kubectl get pvc,pv et inspecter le système de fichiers avec kubectl exec",
        "detailFr": "Contrôler avec kubectl get pvc,pv et inspecter le système de fichiers avec kubectl exec"
      }
    ],
    "explanation": "L'allocation de stockage dynamique Kubernetes exige : 1) pilote CSI installé, 2) ressource StorageClass déclarée, 3) création du PVC demandeur, 4) référence du claimName dans le pod, 5) vérification du statut Bound avec kubectl get pvc.",
    "explanationFr": "L'allocation de stockage dynamique Kubernetes exige : 1) pilote CSI installé, 2) ressource StorageClass déclarée, 3) création du PVC demandeur, 4) référence du claimName dans le pod, 5) vérification du statut Bound avec kubectl get pvc."
  },
  {
    "id": "seq-305-6",
    "title": "Deploying and Routing External Traffic with Kubernetes Ingress and TLS Secret",
    "titleFr": "Routage du trafic externe avec Kubernetes Ingress et terminaison TLS",
    "certification": "lpic-3",
    "topicNumber": 354,
    "objectiveId": "354.3",
    "category": "Container Orchestration (Kubernetes)",
    "description": "Ordonnez la démarche pour exposer publiquement une application conteneurisée via un contrôleur Ingress avec chiffrement HTTPS.",
    "descriptionFr": "Ordonnez la démarche pour exposer publiquement une application conteneurisée via un contrôleur Ingress avec chiffrement HTTPS.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Déploiement du contrôleur Ingress (Ingress-Nginx ou Traefik) dans le cluster",
        "labelFr": "1. Déploiement du contrôleur Ingress (Ingress-Nginx ou Traefik) dans le cluster",
        "detail": "Appliquer les manifestes du contrôleur Ingress et s'assurer que ses pods sont Running",
        "detailFr": "Appliquer les manifestes du contrôleur Ingress et s'assurer que ses pods sont Running"
      },
      {
        "id": "s2",
        "label": "2. Déclaration d'un Service de type ClusterIP pour cibler les pods applicatifs",
        "labelFr": "2. Déclaration d'un Service de type ClusterIP pour cibler les pods applicatifs",
        "detail": "Créer le Service exposant le port 80 en routant vers les sélecteurs app: myapp",
        "detailFr": "Créer le Service exposant le port 80 en routant vers les sélecteurs app: myapp"
      },
      {
        "id": "s3",
        "label": "3. Création du Secret Kubernetes contenant le certificat et la clé TLS",
        "labelFr": "3. Création du Secret Kubernetes contenant le certificat et la clé TLS",
        "detail": "Générer le secret : kubectl create secret tls myapp-tls-secret --cert=tls.crt --key=tls.key",
        "detailFr": "Générer le secret : kubectl create secret tls myapp-tls-secret --cert=tls.crt --key=tls.key"
      },
      {
        "id": "s4",
        "label": "4. Déclaration du manifeste Ingress avec strophes rules, paths et tls",
        "labelFr": "4. Déclaration du manifeste Ingress avec strophes rules, paths et tls",
        "detail": "Spécifier host: app.corp.lan, secretName: myapp-tls-secret et orienter vers le backend service",
        "detailFr": "Spécifier host: app.corp.lan, secretName: myapp-tls-secret et orienter vers le backend service"
      },
      {
        "id": "s5",
        "label": "5. Validation de la négociation HTTPS et de la réponse HTTP 200 via curl",
        "labelFr": "5. Validation de la négociation HTTPS et de la réponse HTTP 200 via curl",
        "detail": "Tester la résolution et le certificat : curl -v --resolve app.corp.lan:443:<ingress_ip> https://app.corp.lan/",
        "detailFr": "Tester la résolution et le certificat : curl -v --resolve app.corp.lan:443:<ingress_ip> https://app.corp.lan/"
      }
    ],
    "explanation": "L'exposition HTTPS par Ingress requiert : 1) contrôleur Ingress opérationnel, 2) service ClusterIP cible, 3) création du secret TLS, 4) manifeste Ingress liant host/secret/service, 5) validation curl avec résolution.",
    "explanationFr": "L'exposition HTTPS par Ingress requiert : 1) contrôleur Ingress opérationnel, 2) service ClusterIP cible, 3) création du secret TLS, 4) manifeste Ingress liant host/secret/service, 5) validation curl avec résolution."
  },
  {
    "id": "seq-305-7",
    "title": "Automating Golden VM Image Creation with HashiCorp Packer and QEMU",
    "titleFr": "Automatisation de la création d'images VM de référence avec HashiCorp Packer et QEMU",
    "certification": "lpic-3",
    "topicNumber": 353,
    "objectiveId": "353.1",
    "category": "Deployment & Automation",
    "description": "Ordonnez les étapes pour compiler automatiquement une image Qcow2 durcie et prête pour la production à partir d'un template Packer.",
    "descriptionFr": "Ordonnez les étapes pour compiler automatiquement une image Qcow2 durcie et prête pour la production à partir d'un template Packer.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Rédaction du template Packer HCL déclarant le constructeur QEMU et l'ISO source",
        "labelFr": "1. Rédaction du template Packer HCL déclarant le constructeur QEMU et l'ISO source",
        "detail": "Définir la source \"qemu\" avec l'URL de l'ISO, le hash checksum et la taille du disque de sortie",
        "detailFr": "Définir la source \"qemu\" avec l'URL de l'ISO, le hash checksum et la taille du disque de sortie"
      },
      {
        "id": "s2",
        "label": "2. Configuration du serveur HTTP intégré et du script d'installation non surveillée (kickstart/preseed)",
        "labelFr": "2. Configuration du serveur HTTP intégré et du script d'installation non surveillée (kickstart/preseed)",
        "detail": "Configurer http_directory et boot_command pour injecter les réponses d'installation automatisée",
        "detailFr": "Configurer http_directory et boot_command pour injecter les réponses d'installation automatisée"
      },
      {
        "id": "s3",
        "label": "3. Définition des provisionneurs shell de durcissement et nettoyage des clés SSH/logs",
        "labelFr": "3. Définition des provisionneurs shell de durcissement et nettoyage des clés SSH/logs",
        "detail": "Exécuter des scripts de mise à jour de sécurité et purger les identifiants machine (/etc/machine-id)",
        "detailFr": "Exécuter des scripts de mise à jour de sécurité et purger les identifiants machine (/etc/machine-id)"
      },
      {
        "id": "s4",
        "label": "4. Validation de la syntaxe du template et lancement de la compilation (packer build)",
        "labelFr": "4. Validation de la syntaxe du template et lancement de la compilation (packer build)",
        "detail": "Tester : packer validate template.pkr.hcl && packer build template.pkr.hcl",
        "detailFr": "Tester : packer validate template.pkr.hcl && packer build template.pkr.hcl"
      },
      {
        "id": "s5",
        "label": "5. Compression et enregistrement de l'image Qcow2 dans le pool de stockage libvirt",
        "labelFr": "5. Compression et enregistrement de l'image Qcow2 dans le pool de stockage libvirt",
        "detail": "Compresser l'image générée avec qemu-img convert -c et rafraîchir le pool avec virsh pool-refresh",
        "detailFr": "Compresser l'image générée avec qemu-img convert -c et rafraîchir le pool avec virsh pool-refresh"
      }
    ],
    "explanation": "L'automatisation d'image avec Packer/QEMU suit : 1) template HCL source qemu, 2) fichier preseed/kickstart sur serveur HTTP interne, 3) provisionneurs de durcissement et nettoyage, 4) packer build, 5) compression et ajout au pool libvirt.",
    "explanationFr": "L'automatisation d'image avec Packer/QEMU suit : 1) template HCL source qemu, 2) fichier preseed/kickstart sur serveur HTTP interne, 3) provisionneurs de durcissement et nettoyage, 4) packer build, 5) compression et ajout au pool libvirt."
  },
  {
    "id": "seq-305-8",
    "title": "Creating and Isolating an LXC Container with Dedicated Linux Bridge Networking",
    "titleFr": "Création et isolation réseau d'un conteneur système LXC sur un pont dédié",
    "certification": "lpic-3",
    "topicNumber": 352,
    "objectiveId": "352.1",
    "category": "Container Virtualization",
    "description": "Ordonnez les étapes pour déployer un conteneur système LXC indépendant raccordé à un pont réseau Linux dédié.",
    "descriptionFr": "Ordonnez les étapes pour déployer un conteneur système LXC indépendant raccordé à un pont réseau Linux dédié.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création et activation de l'interface de pont Linux (br0) sur l'hôte physique",
        "labelFr": "1. Création et activation de l'interface de pont Linux (br0) sur l'hôte physique",
        "detail": "Configurer le pont réseau via ip link add name br0 type bridge et ip link set br0 up",
        "detailFr": "Configurer le pont réseau via ip link add name br0 type bridge et ip link set br0 up"
      },
      {
        "id": "s2",
        "label": "2. Téléchargement et création du conteneur depuis un modèle officiel (lxc-create)",
        "labelFr": "2. Téléchargement et création du conteneur depuis un modèle officiel (lxc-create)",
        "detail": "Exécuter : lxc-create -n c1 -t download -- --dist debian --release bookworm --arch amd64",
        "detailFr": "Exécuter : lxc-create -n c1 -t download -- --dist debian --release bookworm --arch amd64"
      },
      {
        "id": "s3",
        "label": "3. Configuration de la carte réseau virtuelle veth et association au pont dans config",
        "labelFr": "3. Configuration de la carte réseau virtuelle veth et association au pont dans config",
        "detail": "Dans /var/lib/lxc/c1/config : définir lxc.net.0.type = veth et lxc.net.0.link = br0",
        "detailFr": "Dans /var/lib/lxc/c1/config : définir lxc.net.0.type = veth et lxc.net.0.link = br0"
      },
      {
        "id": "s4",
        "label": "4. Démarrage du conteneur système en tâche de fond (lxc-start -d)",
        "labelFr": "4. Démarrage du conteneur système en tâche de fond (lxc-start -d)",
        "detail": "Lancer le conteneur en démon : lxc-start -n c1 -d && lxc-info -n c1",
        "detailFr": "Lancer le conteneur en démon : lxc-start -n c1 -d && lxc-info -n c1"
      },
      {
        "id": "s5",
        "label": "5. Connexion directe au shell du conteneur et vérification de l'adresse IP (lxc-attach)",
        "labelFr": "5. Connexion directe au shell du conteneur et vérification de l'adresse IP (lxc-attach)",
        "detail": "Ouvrir un shell avec lxc-attach -n c1 et tester la connectivité réseau avec ip addr",
        "detailFr": "Ouvrir un shell avec lxc-attach -n c1 et tester la connectivité réseau avec ip addr"
      }
    ],
    "explanation": "Le déploiement d'un conteneur LXC sur pont réseau respecte : 1) création du bridge br0, 2) lxc-create avec template, 3) paramétrage veth et lien br0 dans config, 4) lxc-start en mode détaché, 5) accès avec lxc-attach.",
    "explanationFr": "Le déploiement d'un conteneur LXC sur pont réseau respecte : 1) création du bridge br0, 2) lxc-create avec template, 3) paramétrage veth et lien br0 dans config, 4) lxc-start en mode détaché, 5) accès avec lxc-attach."
  },
  {
    "id": "seq-305-9",
    "title": "Managing KVM Virtual Disks with QEMU-IMG (Snapshot, Resize, and Grow)",
    "titleFr": "Administration de disques virtuels KVM avec QEMU-IMG (Instantané et Extension)",
    "certification": "lpic-3",
    "topicNumber": 351,
    "objectiveId": "351.1",
    "category": "Full Virtualization (KVM/libvirt)",
    "description": "Ordonnez la séquence d'opérations pour étendre la capacité d'un disque virtuel Qcow2 et propager l'espace jusqu'au système de fichiers de l'invité.",
    "descriptionFr": "Ordonnez la séquence d'opérations pour étendre la capacité d'un disque virtuel Qcow2 et propager l'espace jusqu'au système de fichiers de l'invité.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Création d'un instantané de sécurité du disque avant toute manipulation (qemu-img snapshot)",
        "labelFr": "1. Création d'un instantané de sécurité du disque avant toute manipulation (qemu-img snapshot)",
        "detail": "Sécuriser l'état actuel : qemu-img snapshot -c pre-resize /var/lib/libvirt/images/vm01.qcow2",
        "detailFr": "Sécuriser l'état actuel : qemu-img snapshot -c pre-resize /var/lib/libvirt/images/vm01.qcow2"
      },
      {
        "id": "s2",
        "label": "2. Extension de la taille maximale de l'image de disque virtuel (qemu-img resize)",
        "labelFr": "2. Extension de la taille maximale de l'image de disque virtuel (qemu-img resize)",
        "detail": "Agrandir le conteneur Qcow2 : qemu-img resize /var/lib/libvirt/images/vm01.qcow2 +20G",
        "detailFr": "Agrandir le conteneur Qcow2 : qemu-img resize /var/lib/libvirt/images/vm01.qcow2 +20G"
      },
      {
        "id": "s3",
        "label": "3. Notification à chaud de la nouvelle géométrie de bloc à l'invité KVM (virsh blockresize)",
        "labelFr": "3. Notification à chaud de la nouvelle géométrie de bloc à l'invité KVM (virsh blockresize)",
        "detail": "Notifier l'hyperviseur : virsh blockresize vm01 /var/lib/libvirt/images/vm01.qcow2 60G",
        "detailFr": "Notifier l'hyperviseur : virsh blockresize vm01 /var/lib/libvirt/images/vm01.qcow2 60G"
      },
      {
        "id": "s4",
        "label": "4. Réajustement de la table des partitions à l'intérieur de la VM (growpart)",
        "labelFr": "4. Réajustement de la table des partitions à l'intérieur de la VM (growpart)",
        "detail": "Agrandir la partition cible sans perte : growpart /dev/vda 1",
        "detailFr": "Agrandir la partition cible sans perte : growpart /dev/vda 1"
      },
      {
        "id": "s5",
        "label": "5. Extension en ligne du système de fichiers hôte (resize2fs ou xfs_growfs)",
        "labelFr": "5. Extension en ligne du système de fichiers hôte (resize2fs ou xfs_growfs)",
        "detail": "Ajuster la taille du système de fichiers à chaud : resize2fs /dev/vda1 (ou xfs_growfs /)",
        "detailFr": "Ajuster la taille du système de fichiers à chaud : resize2fs /dev/vda1 (ou xfs_growfs /)"
      }
    ],
    "explanation": "L'agrandissement d'un disque KVM suit : 1) instantané de précaution, 2) qemu-img resize, 3) virsh blockresize pour informer la VM en direct, 4) growpart pour étendre la partition, 5) resize2fs ou xfs_growfs pour le système de fichiers.",
    "explanationFr": "L'agrandissement d'un disque KVM suit : 1) instantané de précaution, 2) qemu-img resize, 3) virsh blockresize pour informer la VM en direct, 4) growpart pour étendre la partition, 5) resize2fs ou xfs_growfs pour le système de fichiers."
  },
  {
    "id": "seq-305-10",
    "title": "Automating Multi-VM Environments with Vagrant and libvirt Provider",
    "titleFr": "Orchestration d'environnements multi-VM avec Vagrant et le fournisseur libvirt",
    "certification": "lpic-3",
    "topicNumber": 353,
    "objectiveId": "353.2",
    "category": "Deployment & Automation",
    "description": "Ordonnez les étapes pour déployer automatiquement un environnement de test composé de plusieurs VM interconnectées avec Vagrant.",
    "descriptionFr": "Ordonnez les étapes pour déployer automatiquement un environnement de test composé de plusieurs VM interconnectées avec Vagrant.",
    "steps": [
      {
        "id": "s1",
        "label": "1. Installation du plugin d'interfaçage libvirt pour Vagrant (vagrant-libvirt)",
        "labelFr": "1. Installation du plugin d'interfaçage libvirt pour Vagrant (vagrant-libvirt)",
        "detail": "Installer l'extension requise : vagrant plugin install vagrant-libvirt",
        "detailFr": "Installer l'extension requise : vagrant plugin install vagrant-libvirt"
      },
      {
        "id": "s2",
        "label": "2. Déclaration des machines et des ressources matérielles dans le Vagrantfile",
        "labelFr": "2. Déclaration des machines et des ressources matérielles dans le Vagrantfile",
        "detail": "Définir les strophes config.vm.define pour le master et les workers avec RAM et vCPUs spécifiques",
        "detailFr": "Définir les strophes config.vm.define pour le master et les workers avec RAM et vCPUs spécifiques"
      },
      {
        "id": "s3",
        "label": "3. Configuration des adresses IP privées et du réseau isolé (private_network)",
        "labelFr": "3. Configuration des adresses IP privées et du réseau isolé (private_network)",
        "detail": "Affecter des IP statiques : node.vm.network \"private_network\", ip: \"192.168.50.10\"",
        "detailFr": "Affecter des IP statiques : node.vm.network \"private_network\", ip: \"192.168.50.10\""
      },
      {
        "id": "s4",
        "label": "4. Déclaration des scripts de provisionnement automatisé (shell provisioner)",
        "labelFr": "4. Déclaration des scripts de provisionnement automatisé (shell provisioner)",
        "detail": "Ajouter config.vm.provision \"shell\", path: \"setup.sh\" pour automatiser la configuration logicielle",
        "detailFr": "Ajouter config.vm.provision \"shell\", path: \"setup.sh\" pour automatiser la configuration logicielle"
      },
      {
        "id": "s5",
        "label": "5. Démarrage de l'infrastructure et test d'accès SSH (vagrant up --provider=libvirt)",
        "labelFr": "5. Démarrage de l'infrastructure et test d'accès SSH (vagrant up --provider=libvirt)",
        "detail": "Lancer le déploiement complet et tester la connexion : vagrant up --provider=libvirt && vagrant ssh master",
        "detailFr": "Lancer le déploiement complet et tester la connexion : vagrant up --provider=libvirt && vagrant ssh master"
      }
    ],
    "explanation": "L'automatisation multi-VM avec Vagrant/libvirt exige : 1) plugin vagrant-libvirt, 2) Vagrantfile avec multi-machine define, 3) paramétrage du private_network, 4) provisioners shell, 5) vagrant up --provider=libvirt et validation ssh.",
    "explanationFr": "L'automatisation multi-VM avec Vagrant/libvirt exige : 1) plugin vagrant-libvirt, 2) Vagrantfile avec multi-machine define, 3) paramétrage du private_network, 4) provisioners shell, 5) vagrant up --provider=libvirt et validation ssh."
  }
];
