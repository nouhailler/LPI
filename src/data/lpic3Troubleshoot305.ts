import { TroubleshootingChallenge } from '../types';

/**
 * 25 Défis de Dépannage EXCLUSIFS pour LPIC-3 : Examen 305 (Virtualisation & Déploiement de Conteneurs)
 * Topics couverts :
 * - Topic 351 : Virtualisation Complète (QEMU, KVM, libvirt, virsh, qemu-img, cloud-init)
 * - Topic 352 : Virtualisation par Conteneurs (LXC, LXD, namespaces, cgroups v2, Docker, Podman)
 * - Topic 353 : Orchestration de Conteneurs & Clusters (Kubernetes, Pods, CNI, crashloopbackoff, OOMKilled)
 */
export const lpic3Troubleshoot305: TroubleshootingChallenge[] = [
  {
    id: 'tb-lpic3-305-01',
    title: 'Échec de démarrage KVM : extensions de virtualisation CPU absentes ou désactivées',
    titleFr: 'Échec de démarrage KVM : extensions de virtualisation CPU absentes ou désactivées',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.1',
    category: 'QEMU/KVM Hardware Acceleration',
    scenario: 'L\'administrateur essaie de lancer une machine virtuelle avec virsh ou qemu-system-x86_64 avec accélération KVM. La commande échoue avec "Could not access KVM kernel module: No such file or directory" ou "failed to initialize KVM: Permission denied".',
    scenarioFr: 'L\'administrateur essaie de lancer une machine virtuelle avec virsh ou qemu-system-x86_64 avec accélération KVM. La commande échoue avec "Could not access KVM kernel module: No such file or directory" ou "failed to initialize KVM: Permission denied".',
    codeSnippet: `# ls -l /dev/kvm
ls: cannot access '/dev/kvm': No such file or directory

# kvm-ok
INFO: /dev/kvm does not exist
HINT:   sudo modprobe kvm
# modprobe kvm_intel
modprobe: ERROR: could not insert 'kvm_intel': Operation not supported`,
    language: 'bash',
    bugDescription: 'La virtualisation assistée par le processeur (Intel VT-x ou AMD-V) est désactivée dans le BIOS/UEFI du serveur physique, ou la virtualisation imbriquée (nested virtualization) n\'est pas activée sur l\'hyperviseur parent.',
    bugDescriptionFr: 'La virtualisation assistée par le processeur (Intel VT-x ou AMD-V) est désactivée dans le BIOS/UEFI du serveur physique, ou la virtualisation imbriquée (nested virtualization) n\'est pas activée sur l\'hyperviseur parent.',
    options: [
      {
        id: 'opt-1',
        label: 'Les extensions matérielles Intel VT-x ou AMD-V sont désactivées dans le BIOS/UEFI ou l\'hyperviseur parent, empêchant le module noyau kvm_intel de s\'initialiser',
        labelFr: 'Les extensions matérielles Intel VT-x ou AMD-V sont désactivées dans le BIOS/UEFI ou l\'hyperviseur parent, empêchant le module noyau kvm_intel de s\'initialiser',
        isCorrect: true,
        explanation: 'KVM requiert impérativement les instructions processeur VMX (Intel) ou SVM (AMD). Si elles sont désactivées au niveau firmware, le module noyau kvm_intel refuse de se charger avec "Operation not supported" et le fichier spécial /dev/kvm n\'est pas créé.',
        explanationFr: 'KVM requiert impérativement les instructions processeur VMX (Intel) ou SVM (AMD). Si elles sont désactivées au niveau firmware, le module noyau kvm_intel refuse de se charger avec "Operation not supported" et le fichier spécial /dev/kvm n\'est pas créé.'
      },
      {
        id: 'opt-2',
        label: 'KVM a été déprécié au profit de VirtualBox dans le noyau Linux 6.x',
        labelFr: 'KVM a été déprécié au profit de VirtualBox dans le noyau Linux 6.x',
        isCorrect: false,
        explanation: 'KVM est l\'hyperviseur natif officiel du noyau Linux.',
        explanationFr: 'KVM est l\'hyperviseur natif officiel du noyau Linux.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier /dev/kvm doit être créé manuellement avec mknod c 10 232',
        labelFr: 'Le fichier /dev/kvm doit être créé manuellement avec mknod c 10 232',
        isCorrect: false,
        explanation: 'udev crée dynamiquement /dev/kvm dès que le module noyau kvm est initialisé avec succès.',
        explanationFr: 'udev crée dynamiquement /dev/kvm dès que le module noyau kvm est initialisé avec succès.'
      },
      {
        id: 'opt-4',
        label: 'libvirtd doit être désinstallé car il entre en conflit avec qemu-kvm',
        labelFr: 'libvirtd doit être désinstallé car il entre en conflit avec qemu-kvm',
        isCorrect: false,
        explanation: 'libvirtd est la couche de gestion standard au-dessus de QEMU/KVM.',
        explanationFr: 'libvirtd est la couche de gestion standard au-dessus de QEMU/KVM.'
      }
    ],
    correctedSnippet: `# Vérifier les flags CPU :
grep -E '(vmx|svm)' /proc/cpuinfo
# Activer VT-x/AMD-V dans le BIOS/UEFI ou activer la virtualisation imbriquée :
# echo "options kvm_intel nested=1" > /etc/modprobe.d/kvm.conf
modprobe kvm_intel
ls -l /dev/kvm`,
    fixExplanation: 'Activer la virtualisation matérielle (Intel VT-x ou AMD-V) dans le BIOS/UEFI de la machine physique ou dans les paramètres de la VM parente.',
    fixExplanationFr: 'Activer la virtualisation matérielle (Intel VT-x ou AMD-V) dans le BIOS/UEFI de la machine physique ou dans les paramètres de la VM parente.'
  },
  {
    id: 'tb-lpic3-305-02',
    title: 'Pod Kubernetes bloqué en statut CrashLoopBackOff (exit code 137)',
    titleFr: 'Pod Kubernetes bloqué en statut CrashLoopBackOff (exit code 137)',
    certification: 'lpic-3',
    topicNumber: 353,
    objectiveId: '353.3',
    category: 'Kubernetes Troubleshooting & Resource Management',
    scenario: 'Un conteneur d\'application Java sous Kubernetes redémarre en boucle. "kubectl get pods" affiche l\'état CrashLoopBackOff et "kubectl describe pod" indique : Last State: Terminated, Reason: OOMKilled, Exit Code: 137.',
    scenarioFr: 'Un conteneur d\'application Java sous Kubernetes redémarre en boucle. "kubectl get pods" affiche l\'état CrashLoopBackOff et "kubectl describe pod" indique : Last State: Terminated, Reason: OOMKilled, Exit Code: 137.',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: api-worker
spec:
  containers:
  - name: java-app
    image: openjdk:17-alpine
    command: ["java", "-Xmx1024m", "-jar", "app.jar"]
    resources:
      limits:
        memory: "512Mi"
      requests:
        memory: "256Mi"`,
    language: 'yaml',
    bugDescription: 'La mémoire allouée à la JVM (-Xmx1024m = 1 Go) dépasse largement la limite mémoire imposée au conteneur par cgroups (limits.memory: 512Mi), déclenchant le tueur OOM du noyau Linux (signal SIGKILL 9 = code 128 + 9 = 137).',
    bugDescriptionFr: 'La mémoire allouée à la JVM (-Xmx1024m = 1 Go) dépasse largement la limite mémoire imposée au conteneur par cgroups (limits.memory: 512Mi), déclenchant le tueur OOM du noyau Linux (signal SIGKILL 9 = code 128 + 9 = 137).',
    options: [
      {
        id: 'opt-1',
        label: 'La limite mémoire du conteneur (512Mi) est inférieure au tas alloué à l\'application (-Xmx1024m), ce qui provoque l\'arrêt forcé par le OOM Killer (code 137 = SIGKILL)',
        labelFr: 'La limite mémoire du conteneur (512Mi) est inférieure au tas alloué à l\'application (-Xmx1024m), ce qui provoque l\'arrêt forcé par le OOM Killer (code 137 = SIGKILL)',
        isCorrect: true,
        explanation: 'En conteneurisation, le code de sortie 137 correspond à 128 + SIGKILL (9). Lorsque le processus dépasse le seuil cgroup memory.limit_in_bytes, le noyau Linux termine brutalement le processus.',
        explanationFr: 'En conteneurisation, le code de sortie 137 correspond à 128 + SIGKILL (9). Lorsque le processus dépasse le seuil cgroup memory.limit_in_bytes, le noyau Linux termine brutalement le processus.'
      },
      {
        id: 'opt-2',
        label: 'CrashLoopBackOff signifie que l\'image openjdk:17-alpine a une signature SHA corrompue',
        labelFr: 'CrashLoopBackOff signifie que l\'image openjdk:17-alpine a une signature SHA corrompue',
        isCorrect: false,
        explanation: 'Une image corrompue ou introuvable déclenche ErrImagePull ou ImageInspectError.',
        explanationFr: 'Une image corrompue ou introuvable déclenche ErrImagePull ou ImageInspectError.'
      },
      {
        id: 'opt-3',
        label: 'requests.memory ne doit jamais être configuré sur un Pod de production',
        labelFr: 'requests.memory ne doit jamais être configuré sur un Pod de production',
        isCorrect: false,
        explanation: 'requests.memory est essentiel pour le scheduling des pods par kube-scheduler.',
        explanationFr: 'requests.memory est essentiel pour le scheduling des pods par kube-scheduler.'
      },
      {
        id: 'opt-4',
        label: 'Alpine Linux est incompatible avec le protocole CNI de Kubernetes',
        labelFr: 'Alpine Linux est incompatible avec le protocole CNI de Kubernetes',
        isCorrect: false,
        explanation: 'Alpine Linux s\'exécute sans aucun problème dans des pods Kubernetes.',
        explanationFr: 'Alpine Linux s\'exécute sans aucun problème dans des pods Kubernetes.'
      }
    ],
    correctedSnippet: `    resources:
      limits:
        memory: "1536Mi"
      requests:
        memory: "512Mi"`,
    fixExplanation: 'Augmenter les limites mémoire du conteneur (ex: 1536Mi) ou ajuster les options de la JVM pour respecter l\'enveloppe cgroup.',
    fixExplanationFr: 'Augmenter les limites mémoire du conteneur (ex: 1536Mi) ou ajuster les options de la JVM pour respecter l\'enveloppe cgroup.'
  },
  {
    id: 'tb-lpic3-305-03',
    title: 'Image disque QEMU corrompue ou mauvais fichier de base (backing file)',
    titleFr: 'Image disque QEMU corrompue ou mauvais fichier de base (backing file)',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.3',
    category: 'QEMU Disk Images & Copy-on-Write (qcow2)',
    scenario: 'L\'administrateur déplace une image de machine virtuelle qcow2 vers un autre dossier ou serveur. Lors du lancement, qemu-system-x86_64 renvoie l\'erreur fatale : "qemu-system-x86_64: Could not open backing file: No such file or directory".',
    scenarioFr: 'L\'administrateur déplace une image de machine virtuelle qcow2 vers un autre dossier ou serveur. Lors du lancement, qemu-system-x86_64 renvoie l\'erreur fatale : "qemu-system-x86_64: Could not open backing file: No such file or directory".',
    codeSnippet: `# qemu-img info vm-diff.qcow2
image: vm-diff.qcow2
file format: qcow2
virtual size: 50 GiB (53687091200 bytes)
disk size: 2.1 GiB
backing file: /old/storage/path/base-golden.qcow2
backing file format: qcow2`,
    language: 'bash',
    bugDescription: 'L\'image différentielle qcow2 contient un chemin absolu codé en dur vers son image de base (backing file), qui est désormais introuvable à son ancien emplacement.',
    bugDescriptionFr: 'L\'image différentielle qcow2 contient un chemin absolu codé en dur vers son image de base (backing file), qui est désormais introuvable à son ancien emplacement.',
    options: [
      {
        id: 'opt-1',
        label: 'Le chemin d\'accès vers le fichier de base (backing file) stocké dans les métadonnées qcow2 est obsolète ; il faut le réajuster avec "qemu-img rebase"',
        labelFr: 'Le chemin d\'accès vers le fichier de base (backing file) stocké dans les métadonnées qcow2 est obsolète ; il faut le réajuster avec "qemu-img rebase"',
        isCorrect: true,
        explanation: 'En qcow2 CoW (Copy-on-Write), le header pointe vers le backing file. Si l\'arborescence change, il faut exécuter "qemu-img rebase -u -b /nouveau/chemin/base.qcow2 vm-diff.qcow2" pour mettre à jour ce lien.',
        explanationFr: 'En qcow2 CoW (Copy-on-Write), le header pointe vers le backing file. Si l\'arborescence change, il faut exécuter "qemu-img rebase -u -b /nouveau/chemin/base.qcow2 vm-diff.qcow2" pour mettre à jour ce lien.'
      },
      {
        id: 'opt-2',
        label: 'Une image qcow2 ne peut jamais être déplacée d\'un système de fichiers à un autre',
        labelFr: 'Une image qcow2 ne peut jamais être déplacée d\'un système de fichiers à un autre',
        isCorrect: false,
        explanation: 'Les images qcow2 sont de simples fichiers totalement portables.',
        explanationFr: 'Les images qcow2 sont de simples fichiers totalement portables.'
      },
      {
        id: 'opt-3',
        label: 'Il faut convertir l\'image en format VHDX avec qemu-img convert',
        labelFr: 'Il faut convertir l\'image en format VHDX avec qemu-img convert',
        isCorrect: false,
        explanation: 'Convertir sans résoudre le backing file échouerait également avec la même erreur.',
        explanationFr: 'Convertir sans résoudre le backing file échouerait également avec la même erreur.'
      },
      {
        id: 'opt-4',
        label: 'Le format qcow2 interdit l\'utilisation de backing files',
        labelFr: 'Le format qcow2 interdit l\'utilisation de backing files',
        isCorrect: false,
        explanation: 'Les backing files sont l\'un des atouts majeurs de qcow2 pour le clonage lié rapide.',
        explanationFr: 'Les backing files sont l\'un des atouts majeurs de qcow2 pour le clonage lié rapide.'
      }
    ],
    correctedSnippet: `qemu-img rebase -u -b /new/storage/path/base-golden.qcow2 vm-diff.qcow2
qemu-img check vm-diff.qcow2`,
    fixExplanation: 'Utiliser "qemu-img rebase" avec l\'option -b pour pointer vers le nouvel emplacement du fichier de base.',
    fixExplanationFr: 'Utiliser "qemu-img rebase" avec l\'option -b pour pointer vers le nouvel emplacement du fichier de base.'
  },
  {
    id: 'tb-lpic3-305-04',
    title: 'Sous-UID / GID non configurés pour conteneur Podman Rootless',
    titleFr: 'Sous-UID / GID non configurés pour conteneur Podman Rootless',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.4',
    category: 'Podman Rootless & User Namespaces',
    scenario: 'Un utilisateur non-root essaie de démarrer un conteneur avec "podman run -d nginx". La commande échoue avec "Error: cannot setup namespace using newuidmap: exit status 1" ou "user subuid range is empty".',
    scenarioFr: 'Un utilisateur non-root essaie de démarrer un conteneur avec "podman run -d nginx". La commande échoue avec "Error: cannot setup namespace using newuidmap: exit status 1" ou "user subuid range is empty".',
    codeSnippet: `# grep devuser /etc/subuid /etc/subgid
# Aucun résultat retourné

$ podman run -it --rm alpine sh
Error: cannot setup namespace using newuidmap: exit status 1
newuidmap: [pid] uid range [0-65536] -> [1001-66537] not allowed`,
    language: 'bash',
    bugDescription: 'Les conteneurs sans privilèges root (rootless) dépendent des espaces de noms utilisateurs (user namespaces) et exigent une plage d\'UIDs subordonnés dans /etc/subuid et /etc/subgid.',
    bugDescriptionFr: 'Les conteneurs sans privilèges root (rootless) dépendent des espaces de noms utilisateurs (user namespaces) et exigent une plage d\'UIDs subordonnés dans /etc/subuid et /etc/subgid.',
    options: [
      {
        id: 'opt-1',
        label: 'L\'utilisateur ne dispose d\'aucune plage d\'UID/GID subordonnés allouée dans /etc/subuid et /etc/subgid pour mapper les utilisateurs dans le namespace',
        labelFr: 'L\'utilisateur ne dispose d\'aucune plage d\'UID/GID subordonnés allouée dans /etc/subuid et /etc/subgid pour mapper les utilisateurs dans le namespace',
        isCorrect: true,
        explanation: 'Sous Linux, newuidmap et newgidmap s\'assurent qu\'un utilisateur non privilégié ne peut mapper que des UIDs expressément autorisés dans /etc/subuid et /etc/subgid (ex: devuser:100000:65536).',
        explanationFr: 'Sous Linux, newuidmap et newgidmap s\'assurent qu\'un utilisateur non privilégié ne peut mapper que des UIDs expressément autorisés dans /etc/subuid et /etc/subgid (ex: devuser:100000:65536).'
      },
      {
        id: 'opt-2',
        label: 'Podman ne peut être exécuté qu\'en tant que root ou avec la commande sudo',
        labelFr: 'Podman ne peut être exécuté qu\'en tant que root ou avec la commande sudo',
        isCorrect: false,
        explanation: 'Le mode rootless est justement la fonctionnalité phare de Podman.',
        explanationFr: 'Le mode rootless est justement la fonctionnalité phare de Podman.'
      },
      {
        id: 'opt-3',
        label: 'L\'image alpine nécessite impérativement le support de glibc',
        labelFr: 'L\'image alpine nécessite impérativement le support de glibc',
        isCorrect: false,
        explanation: 'Alpine utilise musl libc et fonctionne parfaitement sous conteneurs.',
        explanationFr: 'Alpine utilise musl libc et fonctionne parfaitement sous conteneurs.'
      },
      {
        id: 'opt-4',
        label: 'Il faut désactiver les cgroups dans le noyau pour utiliser Podman',
        labelFr: 'Il faut désactiver les cgroups dans le noyau pour utiliser Podman',
        isCorrect: false,
        explanation: 'Les cgroups sont indispensables à la gestion des conteneurs.',
        explanationFr: 'Les cgroups sont indispensables à la gestion des conteneurs.'
      }
    ],
    correctedSnippet: `# En tant que root :
usermod --add-subuids 100000-165535 devuser
usermod --add-subgids 100000-165535 devuser
podman system migrate`,
    fixExplanation: 'Définir une plage d\'UID et GID subordonnés avec usermod dans /etc/subuid et /etc/subgid.',
    fixExplanationFr: 'Définir une plage d\'UID et GID subordonnés avec usermod dans /etc/subuid et /etc/subgid.'
  },
  {
    id: 'tb-lpic3-305-05',
    title: 'Réseau libvirt "default" inactif bloquant la création de VM',
    titleFr: 'Réseau libvirt "default" inactif bloquant la création de VM',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.2',
    category: 'Libvirt Virtual Networks & Bridges',
    scenario: 'L\'administrateur lance virt-install pour déployer une nouvelle machine virtuelle KVM. L\'installeur s\'arrête immédiatement avec l\'erreur : "ERROR: Requested operation is not valid: network \'default\' is not active".',
    scenarioFr: 'L\'administrateur lance virt-install pour déployer une nouvelle machine virtuelle KVM. L\'installeur s\'arrête immédiatement avec l\'erreur : "ERROR: Requested operation is not valid: network \'default\' is not active".',
    codeSnippet: `# virsh net-list --all
 Name      State      Autostart   Persistent
----------------------------------------------
 default   inactive   no          yes`,
    language: 'bash',
    bugDescription: 'Le réseau virtuel NAT par défaut de libvirt (virbr0) est à l\'état inactif et n\'est pas configuré en démarrage automatique (autostart).',
    bugDescriptionFr: 'Le réseau virtuel NAT par défaut de libvirt (virbr0) est à l\'état inactif et n\'est pas configuré en démarrage automatique (autostart).',
    options: [
      {
        id: 'opt-1',
        label: 'Le réseau virtuel libvirt nommé "default" est inactif ; il faut le démarrer avec "virsh net-start default" et activer l\'autostart avec "virsh net-autostart default"',
        labelFr: 'Le réseau virtuel libvirt nommé "default" est inactif ; il faut le démarrer avec "virsh net-start default" et activer l\'autostart avec "virsh net-autostart default"',
        isCorrect: true,
        explanation: 'Libvirt gère ses réseaux virtuels de manière déclarative. Si le bridge virtuel NAT virbr0 n\'est pas actif (net-start), aucune interface VM ne peut s\'y brancher.',
        explanationFr: 'Libvirt gère ses réseaux virtuels de manière déclarative. Si le bridge virtuel NAT virbr0 n\'est pas actif (net-start), aucune interface VM ne peut s\'y brancher.'
      },
      {
        id: 'opt-2',
        label: 'virt-install refuse d\'utiliser le réseau nommé "default" et exige obligatoirement "br0"',
        labelFr: 'virt-install refuse d\'utiliser le réseau nommé "default" et exige obligatoirement "br0"',
        isCorrect: false,
        explanation: '"default" est le réseau de référence préconfiguré par défaut de libvirt.',
        explanationFr: '"default" est le réseau de référence préconfiguré par défaut de libvirt.'
      },
      {
        id: 'opt-3',
        label: 'libvirt ne peut pas créer de réseaux virtuels sans l\'installation d\'Open vSwitch',
        labelFr: 'libvirt ne peut pas créer de réseaux virtuels sans l\'installation d\'Open vSwitch',
        isCorrect: false,
        explanation: 'Libvirt utilise le module bridge Linux standard et dnsmasq sans nécessiter OVS.',
        explanationFr: 'Libvirt utilise le module bridge Linux standard et dnsmasq sans nécessiter OVS.'
      },
      {
        id: 'opt-4',
        label: 'virsh net-start nécessite un redémarrage complet du serveur physique',
        labelFr: 'virsh net-start nécessite un redémarrage complet du serveur physique',
        isCorrect: false,
        explanation: 'Le démarrage du réseau est instantané à chaud en ligne de commande.',
        explanationFr: 'Le démarrage du réseau est instantané à chaud en ligne de commande.'
      }
    ],
    correctedSnippet: `virsh net-start default
virsh net-autostart default
virsh net-list`,
    fixExplanation: 'Démarrer le réseau virtuel avec "virsh net-start default" et le rendre persistant au boot avec "virsh net-autostart default".',
    fixExplanationFr: 'Démarrer le réseau virtuel avec "virsh net-start default" et le rendre persistant au boot avec "virsh net-autostart default".'
  },
  {
    id: 'tb-lpic3-305-06',
    title: 'Problème de montage de volume Docker dû aux étiquettes SELinux (:z vs :Z)',
    titleFr: 'Problème de montage de volume Docker dû aux étiquettes SELinux (:z vs :Z)',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.3',
    category: 'Docker & Container Security (SELinux Integration)',
    scenario: 'Sur un serveur Red Hat / Fedora, un conteneur Docker monte un dossier hôte /data/app. L\'application s\'arrête avec "Permission denied: open(\'/data/app/config.json\')". getenforce affiche "Enforcing".',
    scenarioFr: 'Sur un serveur Red Hat / Fedora, un conteneur Docker monte un dossier hôte /data/app. L\'application s\'arrête avec "Permission denied: open(\'/data/app/config.json\')". getenforce affiche "Enforcing".',
    codeSnippet: `# docker run -d -v /data/app:/app:ro nginx
# logs:
# nginx: [emerg] open() "/app/nginx.conf" failed (13: Permission denied)

# ls -Zd /data/app
unconfined_u:object_r:default_t:s0 /data/app`,
    language: 'bash',
    bugDescription: 'Le dossier monté sur l\'hôte possède le label SELinux default_t et n\'est pas partagé avec le conteneur confiné (container_t). L\'option de montage ":z" (ou :Z) est requise.',
    bugDescriptionFr: 'Le dossier monté sur l\'hôte possède le label SELinux default_t et n\'est pas partagé avec le conteneur confiné (container_t). L\'option de montage ":z" (ou :Z) est requise.',
    options: [
      {
        id: 'opt-1',
        label: 'Sous SELinux, les bind-mounts de volumes conteneurs nécessitent l\'indicateur de volume ":z" (partagé) ou ":Z" (privé) pour réétiqueter les fichiers avec container_file_t',
        labelFr: 'Sous SELinux, les bind-mounts de volumes conteneurs nécessitent l\'indicateur de volume ":z" (partagé) ou ":Z" (privé) pour réétiqueter les fichiers avec container_file_t',
        isCorrect: true,
        explanation: 'Le moteur Docker/Podman utilise le suffixe :z pour appliquer le label container_file_t au répertoire de l\'hôte, permettant aux conteneurs confinés par sVirt/SELinux d\'y accéder.',
        explanationFr: 'Le moteur Docker/Podman utilise le suffixe :z pour appliquer le label container_file_t au répertoire de l\'hôte, permettant aux conteneurs confinés par sVirt/SELinux d\'y accéder.'
      },
      {
        id: 'opt-2',
        label: 'Docker ne supporte pas l\'option :ro (read-only)',
        labelFr: 'Docker ne supporte pas l\'option :ro (read-only)',
        isCorrect: false,
        explanation: ':ro est une option officielle standard pour monter un volume en lecture seule.',
        explanationFr: ':ro est une option officielle standard pour monter un volume en lecture seule.'
      },
      {
        id: 'opt-3',
        label: 'Le chemin source /data/app doit obligatoirement être situé sous /var/lib/docker/volumes',
        labelFr: 'Le chemin source /data/app doit obligatoirement être situé sous /var/lib/docker/volumes',
        isCorrect: false,
        explanation: 'Les bind mounts acceptent n\'importe quel chemin valide sur le système de fichiers hôte.',
        explanationFr: 'Les bind mounts acceptent n\'importe quel chemin valide sur le système de fichiers hôte.'
      },
      {
        id: 'opt-4',
        label: 'Le conteneur doit obligatoirement être lancé avec --privileged',
        labelFr: 'Le conteneur doit obligatoirement être lancé avec --privileged',
        isCorrect: false,
        explanation: 'Utiliser --privileged détruit toute l\'isolation du conteneur et est vivement déconseillé.',
        explanationFr: 'Utiliser --privileged détruit toute l\'isolation du conteneur et est vivement déconseillé.'
      }
    ],
    correctedSnippet: `docker run -d -v /data/app:/app:ro,z nginx
# Ou modifier manuellement le contexte SELinux :
chcon -Rt container_file_t /data/app`,
    fixExplanation: 'Ajouter l\'option de réétiquetage SELinux ":z" ou ":Z" dans la définition du volume Docker (-v /data/app:/app:ro,z).',
    fixExplanationFr: 'Ajouter l\'option de réétiquetage SELinux ":z" ou ":Z" dans la définition du volume Docker (-v /data/app:/app:ro,z).'
  },
  {
    id: 'tb-lpic3-305-07',
    title: 'Problème de sonde de vivacité Kubernetes (Liveness Probe misconfigured)',
    titleFr: 'Problème de sonde de vivacité Kubernetes (Liveness Probe misconfigured)',
    certification: 'lpic-3',
    topicNumber: 353,
    objectiveId: '353.1',
    category: 'Kubernetes Pod Lifecycle & Healthchecks',
    scenario: 'Une application web met 45 secondes à démarrer et charger sa base de données. Dès son lancement, Kubernetes la tue brutalement toutes les 30 secondes avec le message : "Liveness probe failed: HTTP probe failed with statuscode: 503".',
    scenarioFr: 'Une application web met 45 secondes à démarrer et charger sa base de données. Dès son lancement, Kubernetes la tue brutalement toutes les 30 secondes avec le message : "Liveness probe failed: HTTP probe failed with statuscode: 503".',
    codeSnippet: `livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3`,
    language: 'yaml',
    bugDescription: 'initialDelaySeconds (5s) combiné à failureThreshold (3 x 10s = 30s) fait que Kubernetes tue le pod après 35s, soit avant les 45s nécessaires au démarrage initial.',
    bugDescriptionFr: 'initialDelaySeconds (5s) combiné à failureThreshold (3 x 10s = 30s) fait que Kubernetes tue le pod après 35s, soit avant les 45s nécessaires au démarrage initial.',
    options: [
      {
        id: 'opt-1',
        label: 'initialDelaySeconds est trop faible (5s) ; il faut soit l\'augmenter à au moins 60s, soit configurer une "startupProbe" pour protéger le démarrage lent',
        labelFr: 'initialDelaySeconds est trop faible (5s) ; il faut soit l\'augmenter à au moins 60s, soit configurer une "startupProbe" pour protéger le démarrage lent',
        isCorrect: true,
        explanation: 'Quand une liveness probe échoue, kubelet redémarre le conteneur. Si l\'application a besoin de 45 secondes pour s\'initialiser, une startupProbe dédiée ou un initialDelaySeconds suffisant est indispensable.',
        explanationFr: 'Quand une liveness probe échoue, kubelet redémarre le conteneur. Si l\'application a besoin de 45 secondes pour s\'initialiser, une startupProbe dédiée ou un initialDelaySeconds suffisant est indispensable.'
      },
      {
        id: 'opt-2',
        label: 'Kubernetes n\'accepte pas les sondes HTTP sur les ports supérieurs à 1024',
        labelFr: 'Kubernetes n\'accepte pas les sondes HTTP sur les ports supérieurs à 1024',
        isCorrect: false,
        explanation: 'Les probes supportent n\'importe quel port TCP valide.',
        explanationFr: 'Les probes supportent n\'importe quel port TCP valide.'
      },
      {
        id: 'opt-3',
        label: 'periodSeconds doit obligatoirement être égal à 1',
        labelFr: 'periodSeconds doit obligatoirement être égal à 1',
        isCorrect: false,
        explanation: 'periodSeconds est librement ajustable selon la granularité souhaitée.',
        explanationFr: 'periodSeconds est librement ajustable selon la granularité souhaitée.'
      },
      {
        id: 'opt-4',
        label: 'path: /healthz doit obligatoirement être nommé /index.html',
        labelFr: 'path: /healthz doit obligatoirement être nommé /index.html',
        isCorrect: false,
        explanation: '/healthz est l\'URI conventionnelle universelle pour les endpoints de santé.',
        explanationFr: '/healthz est l\'URI conventionnelle universelle pour les endpoints de santé.'
      }
    ],
    correctedSnippet: `startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 15`,
    fixExplanation: 'Introduire une startupProbe pour laisser le temps à l\'application d\'initialiser ses dépendances sans être tuée prématurément.',
    fixExplanationFr: 'Introduire une startupProbe pour laisser le temps à l\'application d\'initialiser ses dépendances sans être tuée prématurément.'
  },
  {
    id: 'tb-lpic3-305-08',
    title: 'Format d\'export OVA / OVF corrompu lors de l\'import qemu-img',
    titleFr: 'Format d\'export OVA / OVF corrompu lors de l\'import qemu-img',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.1',
    category: 'Virtual Appliance Import & Formats',
    scenario: 'L\'administrateur reçoit une archive "appliance.ova" exportée depuis VMware. Il tente de la lancer directement avec "qemu-system-x86_64 -drive file=appliance.ova" qui s\'arrête avec "invalid image format".',
    scenarioFr: 'L\'administrateur reçoit une archive "appliance.ova" exportée depuis VMware. Il tente de la lancer directement avec "qemu-system-x86_64 -drive file=appliance.ova" qui s\'arrête avec "invalid image format".',
    codeSnippet: `# file appliance.ova
appliance.ova: POSIX tar archive

# qemu-system-x86_64 -drive file=appliance.ova,format=qcow2
qemu-system-x86_64: -drive file=appliance.ova,format=qcow2: Image is not in qcow2 format`,
    language: 'bash',
    bugDescription: 'Un fichier .ova n\'est pas une image disque brute, mais une archive TAR contenant le fichier de description OVF (.ovf) et les disques VMDK (.vmdk).',
    bugDescriptionFr: 'Un fichier .ova n\'est pas une image disque brute, mais une archive TAR contenant le fichier de description OVF (.ovf) et les disques VMDK (.vmdk).',
    options: [
      {
        id: 'opt-1',
        label: 'Un fichier .ova est une archive tar standard ; il faut l\'extraire avec tar -xvf pour récupérer l\'image de disque .vmdk puis éventuellement la convertir en qcow2',
        labelFr: 'Un fichier .ova est une archive tar standard ; il faut l\'extraire avec tar -xvf pour récupérer l\'image de disque .vmdk puis éventuellement la convertir en qcow2',
        isCorrect: true,
        explanation: 'Open Virtual Appliance (OVA) est simplement un container tar contenant le descripteur XML OVF et les disques VMDK. Il faut décompresser l\'archive avant de pouvoir utiliser ou convertir les disques.',
        explanationFr: 'Open Virtual Appliance (OVA) est simplement un container tar contenant le descripteur XML OVF et les disques VMDK. Il faut décompresser l\'archive avant de pouvoir utiliser ou convertir les disques.'
      },
      {
        id: 'opt-2',
        label: 'QEMU ne sait pas exécuter de disques provenant de VMware',
        labelFr: 'QEMU ne sait pas exécuter de disques provenant de VMware',
        isCorrect: false,
        explanation: 'QEMU lit nativement le format VMDK et peut le convertir vers n\'importe quel format via qemu-img.',
        explanationFr: 'QEMU lit nativement le format VMDK et peut le convertir vers n\'importe quel format via qemu-img.'
      },
      {
        id: 'opt-3',
        label: 'Le fichier doit être renommé en appliance.iso pour être monté en CD-ROM',
        labelFr: 'Le fichier doit être renommé en appliance.iso pour être monté en CD-ROM',
        isCorrect: false,
        explanation: 'Une archive tar n\'a rien à voir avec une image ISO 9660.',
        explanationFr: 'Une archive tar n\'a rien à voir avec une image ISO 9660.'
      },
      {
        id: 'opt-4',
        label: 'OVA est un format propriétaire Microsoft incompatible avec Linux',
        labelFr: 'OVA est un format propriétaire Microsoft incompatible avec Linux',
        isCorrect: false,
        explanation: 'OVF/OVA est un standard ouvert géré par le DMTF.',
        explanationFr: 'OVF/OVA est un standard ouvert géré par le DMTF.'
      }
    ],
    correctedSnippet: `tar -xvf appliance.ova
# Extraire appliance-disk1.vmdk puis le convertir si désiré :
qemu-img convert -f vmdk -O qcow2 appliance-disk1.vmdk appliance-disk1.qcow2`,
    fixExplanation: 'Désarchiver le fichier OVA avec tar pour en extraire le fichier disque VMDK.',
    fixExplanationFr: 'Désarchiver le fichier OVA avec tar pour en extraire le fichier disque VMDK.'
  },
  {
    id: 'tb-lpic3-305-09',
    title: 'Conflit de pilotes graphiques et console QEMU SPICE / VirtIO-GPU',
    titleFr: 'Conflit de pilotes graphiques et console QEMU SPICE / VirtIO-GPU',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.1',
    category: 'QEMU Devices & Display Protocol',
    scenario: 'L\'utilisateur essaie de se connecter à la console graphique d\'une VM KVM via virt-viewer ou remote-viewer. La fenêtre reste désespérément noire et le log affiche : "Spice-Warning: no display channel available".',
    scenarioFr: 'L\'utilisateur essaie de se connecter à la console graphique d\'une VM KVM via virt-viewer ou remote-viewer. La fenêtre reste désespérément noire et le log affiche : "Spice-Warning: no display channel available".',
    codeSnippet: `<graphics type='vnc' port='-1' autoport='yes' listen='127.0.0.1'/>
<video>
  <model type='qxl' ram='65536' vram='65536' vgamem='16384' heads='1'/>
</video>`,
    language: 'xml',
    bugDescription: 'La machine virtuelle est configurée avec un affichage graphique de type "vnc", alors que le client tente de négocier le protocole "spice" (qui requiert <graphics type=\'spice\'>).',
    bugDescriptionFr: 'La machine virtuelle est configurée avec un affichage graphique de type "vnc", alors que le client tente de négocier le protocole "spice" (qui requiert <graphics type=\'spice\'>).',
    options: [
      {
        id: 'opt-1',
        label: 'La directive graphique dans le XML libvirt est configurée en "type=\'vnc\'" au lieu de "type=\'spice\'", empêchant les canaux SPICE de s\'établir',
        labelFr: 'La directive graphique dans le XML libvirt est configurée en "type=\'vnc\'" au lieu de "type=\'spice\'", empêchant les canaux SPICE de s\'établir',
        isCorrect: true,
        explanation: 'Le modèle vidéo QXL et l\'optimisation bureau haute performance reposent sur le protocole SPICE. Si <graphics> est sur VNC, le serveur n\'ouvre aucun canal d\'écoute SPICE.',
        explanationFr: 'Le modèle vidéo QXL et l\'optimisation bureau haute performance reposent sur le protocole SPICE. Si <graphics> est sur VNC, le serveur n\'ouvre aucun canal d\'écoute SPICE.'
      },
      {
        id: 'opt-2',
        label: 'Le modèle QXL ne supporte pas plus de 1024 Ko de RAM vidéo',
        labelFr: 'Le modèle QXL ne supporte pas plus de 1024 Ko de RAM vidéo',
        isCorrect: false,
        explanation: 'QXL est conçu pour des allocations de 64 Mo ou plus.',
        explanationFr: 'QXL est conçu pour des allocations de 64 Mo ou plus.'
      },
      {
        id: 'opt-3',
        label: 'virt-viewer est incompatible avec les machines virtuelles Linux',
        labelFr: 'virt-viewer est incompatible avec les machines virtuelles Linux',
        isCorrect: false,
        explanation: 'virt-viewer est l\'outil natif de la stack libvirt sous Linux.',
        explanationFr: 'virt-viewer est l\'outil natif de la stack libvirt sous Linux.'
      },
      {
        id: 'opt-4',
        label: 'Le port "-1" est un numéro de port illégal',
        labelFr: 'Le port "-1" est un numéro de port illégal',
        isCorrect: false,
        explanation: 'port=\'-1\' avec autoport=\'yes\' indique à libvirt d\'attribuer automatiquement le premier port libre disponible.',
        explanationFr: 'port=\'-1\' avec autoport=\'yes\' indique à libvirt d\'attribuer automatiquement le premier port libre disponible.'
      }
    ],
    correctedSnippet: `<graphics type='spice' autoport='yes' listen='127.0.0.1'>
  <listen type='address' address='127.0.0.1'/>
  <image compression='off'/>
</graphics>`,
    fixExplanation: 'Modifier le type graphique en "spice" dans la configuration XML via "virsh edit".',
    fixExplanationFr: 'Modifier le type graphique en "spice" dans la configuration XML via "virsh edit".'
  },
  {
    id: 'tb-lpic3-305-10',
    title: 'Conteneur Docker : fuite de descripteurs de fichiers (ulimit nofile saturé)',
    titleFr: 'Conteneur Docker : fuite de descripteurs de fichiers (ulimit nofile saturé)',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.3',
    category: 'Container Resource Limits & cgroups',
    scenario: 'Un serveur web ou proxy Nginx exécuté dans un conteneur Docker commence à renvoyer des erreurs 500 et affiche dans ses logs : "socket() failed (24: Too many open files)".',
    scenarioFr: 'Un serveur web ou proxy Nginx exécuté dans un conteneur Docker commence à renvoyer des erreurs 500 et affiche dans ses logs : "socket() failed (24: Too many open files)".',
    codeSnippet: `# docker exec my-nginx ulimit -n
1024

# ss -s
Total: 1200 (sockets used)`,
    language: 'bash',
    bugDescription: 'La limite du nombre de descripteurs de fichiers ouverts (nofile) allouée par défaut au conteneur est de seulement 1024, ce qui sature dès que le trafic réseau s\'intensifie.',
    bugDescriptionFr: 'La limite du nombre de descripteurs de fichiers ouverts (nofile) allouée par défaut au conteneur est de seulement 1024, ce qui sature dès que le trafic réseau s\'intensifie.',
    options: [
      {
        id: 'opt-1',
        label: 'La limite ulimit nofile (fichiers ouverts) du conteneur est fixée à 1024 ; il faut augmenter cette limite avec l\'argument "--ulimit nofile=65535:65535"',
        labelFr: 'La limite ulimit nofile (fichiers ouverts) du conteneur est fixée à 1024 ; il faut augmenter cette limite avec l\'argument "--ulimit nofile=65535:65535"',
        isCorrect: true,
        explanation: 'Chaque connexion TCP utilise un descripteur de socket. Dans un serveur haute charge, 1024 sockets sont rapidement consommés. Docker permet d\'ajuster ulimit par conteneur ou globalement dans /etc/docker/daemon.json.',
        explanationFr: 'Chaque connexion TCP utilise un descripteur de socket. Dans un serveur haute charge, 1024 sockets sont rapidement consommés. Docker permet d\'ajuster ulimit par conteneur ou globalement dans /etc/docker/daemon.json.'
      },
      {
        id: 'opt-2',
        label: 'L\'erreur 24 indique que le disque SSD de l\'hôte est plein à 100%',
        labelFr: 'L\'erreur 24 indique que le disque SSD de l\'hôte est plein à 100%',
        isCorrect: false,
        explanation: 'L\'erreur 24 (EMFILE) correspond universellement à "Too many open files".',
        explanationFr: 'L\'erreur 24 (EMFILE) correspond universellement à "Too many open files".'
      },
      {
        id: 'opt-3',
        label: 'Nginx ne sait pas gérer plus de 500 sockets sous Linux',
        labelFr: 'Nginx ne sait pas gérer plus de 500 sockets sous Linux',
        isCorrect: false,
        explanation: 'Nginx peut traiter des centaines de milliers de connexions simultanées sous réserve des ulimits adéquats.',
        explanationFr: 'Nginx peut traiter des centaines de milliers de connexions simultanées sous réserve des ulimits adéquats.'
      },
      {
        id: 'opt-4',
        label: 'ulimit ne peut pas être modifié au sein d\'un conteneur Linux',
        labelFr: 'ulimit ne peut pas être modifié au sein d\'un conteneur Linux',
        isCorrect: false,
        explanation: 'Docker expose explicitement l\'option --ulimit.',
        explanationFr: 'Docker expose explicitement l\'option --ulimit.'
      }
    ],
    correctedSnippet: `docker run -d --name my-nginx --ulimit nofile=65535:65535 -p 80:80 nginx`,
    fixExplanation: 'Relancer le conteneur avec l\'option "--ulimit nofile=65535:65535".',
    fixExplanationFr: 'Relancer le conteneur avec l\'option "--ulimit nofile=65535:65535".'
  },
  {
    id: 'tb-lpic3-305-11',
    title: 'Service Kubernetes ClusterIP inaccessible depuis l\'extérieur du cluster',
    titleFr: 'Service Kubernetes ClusterIP inaccessible depuis l\'extérieur du cluster',
    certification: 'lpic-3',
    topicNumber: 353,
    objectiveId: '353.1',
    category: 'Kubernetes Networking & Service Types',
    scenario: 'L\'administrateur déploie une application frontend web sous Kubernetes. Les utilisateurs externes sur le réseau d\'entreprise tentent d\'ouvrir http://10.96.0.15:80 mais la connexion échoue systématiquement.',
    scenarioFr: 'L\'administrateur déploie une application frontend web sous Kubernetes. Les utilisateurs externes sur le réseau d\'entreprise tentent d\'ouvrir http://10.96.0.15:80 mais la connexion échoue systématiquement.',
    codeSnippet: `apiVersion: v1
kind: Service
metadata:
  name: web-frontend
spec:
  type: ClusterIP
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80`,
    language: 'yaml',
    bugDescription: 'Le type de service "ClusterIP" alloue une adresse IP virtuelle interne routable uniquement depuis l\'intérieur du cluster Kubernetes.',
    bugDescriptionFr: 'Le type de service "ClusterIP" alloue une adresse IP virtuelle interne routable uniquement depuis l\'intérieur du cluster Kubernetes.',
    options: [
      {
        id: 'opt-1',
        label: 'Le service est configuré en type "ClusterIP" qui est strictement privé et non routable hors du cluster ; il faut le passer en type "NodePort", "LoadBalancer" ou utiliser un Ingress',
        labelFr: 'Le service est configuré en type "ClusterIP" qui est strictement privé et non routable hors du cluster ; il faut le passer en type "NodePort", "LoadBalancer" ou utiliser un Ingress',
        isCorrect: true,
        explanation: 'L\'adresse IP d\'un service ClusterIP n\'existe que dans les règles iptables/IPVS des nœuds du cluster. Pour exposer le service à l\'extérieur, un type NodePort (ports 30000-32767), LoadBalancer ou une ressource Ingress est requis.',
        explanationFr: 'L\'adresse IP d\'un service ClusterIP n\'existe que dans les règles iptables/IPVS des nœuds du cluster. Pour exposer le service à l\'extérieur, un type NodePort (ports 30000-32767), LoadBalancer ou une ressource Ingress est requis.'
      },
      {
        id: 'opt-2',
        label: 'targetPort 80 doit obligatoirement être configuré sur le port 443',
        labelFr: 'targetPort 80 doit obligatoirement être configuré sur le port 443',
        isCorrect: false,
        explanation: 'targetPort correspond simplement au port d\'écoute à l\'intérieur du conteneur.',
        explanationFr: 'targetPort correspond simplement au port d\'écoute à l\'intérieur du conteneur.'
      },
      {
        id: 'opt-3',
        label: 'Le sélecteur app: frontend doit comporter le préfixe k8s-app',
        labelFr: 'Le sélecteur app: frontend doit comporter le préfixe k8s-app',
        isCorrect: false,
        explanation: 'Les étiquettes (labels) sont totalement libres.',
        explanationFr: 'Les étiquettes (labels) sont totalement libres.'
      },
      {
        id: 'opt-4',
        label: 'ClusterIP exige que le protocole UDP soit spécifié',
        labelFr: 'ClusterIP exige que le protocole UDP soit spécifié',
        isCorrect: false,
        explanation: 'Le protocole par défaut est TCP.',
        explanationFr: 'Le protocole par défaut est TCP.'
      }
    ],
    correctedSnippet: `apiVersion: v1
kind: Service
metadata:
  name: web-frontend
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080`,
    fixExplanation: 'Changer le type de service en NodePort ou LoadBalancer pour permettre l\'accès depuis l\'extérieur du cluster.',
    fixExplanationFr: 'Changer le type de service en NodePort ou LoadBalancer pour permettre l\'accès depuis l\'extérieur du cluster.'
  },
  {
    id: 'tb-lpic3-305-12',
    title: 'Verrouillage de fichier qcow2 actif bloquant les outils libguestfs',
    titleFr: 'Verrouillage de fichier qcow2 actif bloquant les outils libguestfs',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.3',
    category: 'Virtual Machine Inspection (libguestfs)',
    scenario: 'L\'administrateur utilise "virt-inspector" ou "guestfish" pour explorer le système de fichiers d\'une machine virtuelle en cours d\'exécution. La commande échoue avec "qemu-img: Failed to get shared \"write\" lock: Is another process using the image?".',
    scenarioFr: 'L\'administrateur utilise "virt-inspector" ou "guestfish" pour explorer le système de fichiers d\'une machine virtuelle en cours d\'exécution. La commande échoue avec "qemu-img: Failed to get shared \"write\" lock: Is another process using the image?".',
    codeSnippet: `# guestfish --add /var/lib/libvirt/images/srv1.qcow2 --inspector
guestfs_launch: failed: /var/lib/libvirt/images/srv1.qcow2: Failed to get shared "write" lock
Is another process using the image?
Try using the option --ro to inspect live VMs.`,
    language: 'bash',
    bugDescription: 'QEMU verrouille le fichier image en écriture exclusive pour éviter toute corruption. Les outils libguestfs tentent par défaut d\'ouvrir l\'image en lecture-écriture si l\'option "--ro" n\'est pas spécifiée.',
    bugDescriptionFr: 'QEMU verrouille le fichier image en écriture exclusive pour éviter toute corruption. Les outils libguestfs tentent par défaut d\'ouvrir l\'image en lecture-écriture si l\'option "--ro" n\'est pas spécifiée.',
    options: [
      {
        id: 'opt-1',
        label: 'Une machine virtuelle active ne doit jamais être ouverte en écriture par un autre processus ; il faut obligatoirement utiliser le mode lecture seule (--ro) avec guestfish ou virt-inspector',
        labelFr: 'Une machine virtuelle active ne doit jamais être ouverte en écriture par un autre processus ; il faut obligatoirement utiliser le mode lecture seule (--ro) avec guestfish ou virt-inspector',
        isCorrect: true,
        explanation: 'QEMU utilise fcntl/OFD locks pour empêcher deux processus d\'écrire simultanément sur le même disque. Pour examiner une VM active sans risque de corruption de système de fichiers, l\'option --ro (read-only) est obligatoire.',
        explanationFr: 'QEMU utilise fcntl/OFD locks pour empêcher deux processus d\'écrire simultanément sur le même disque. Pour examiner une VM active sans risque de corruption de système de fichiers, l\'option --ro (read-only) est obligatoire.'
      },
      {
        id: 'opt-2',
        label: 'guestfish ne fonctionne que si la machine virtuelle est un système Windows',
        labelFr: 'guestfish ne fonctionne que si la machine virtuelle est un système Windows',
        isCorrect: false,
        explanation: 'libguestfs supporte Linux, Windows, BSD et la majorité des systèmes de fichiers.',
        explanationFr: 'libguestfs supporte Linux, Windows, BSD et la majorité des systèmes de fichiers.'
      },
      {
        id: 'opt-3',
        label: 'Le format qcow2 ne gère pas les verrous de fichiers',
        labelFr: 'Le format qcow2 ne gère pas les verrous de fichiers',
        isCorrect: false,
        explanation: 'QEMU intègre un verrouillage strict au niveau bloc.',
        explanationFr: 'QEMU intègre un verrouillage strict au niveau bloc.'
      },
      {
        id: 'opt-4',
        label: 'Il faut tuer brutalement le processus qemu avec kill -9',
        labelFr: 'Il faut tuer brutalement le processus qemu avec kill -9',
        isCorrect: false,
        explanation: 'Tuer la VM en production entraînerait une corruption des données.',
        explanationFr: 'Tuer la VM en production entraînerait une corruption des données.'
      }
    ],
    correctedSnippet: `guestfish --ro -d srv1 -i
# ou avec virt-inspector :
virt-inspector --ro -d srv1`,
    fixExplanation: 'Toujours utiliser le drapeau lecture seule "--ro" pour inspecter les disques d\'une VM en cours d\'exécution.',
    fixExplanationFr: 'Toujours utiliser le drapeau lecture seule "--ro" pour inspecter les disques d\'une VM en cours d\'exécution.'
  },
  {
    id: 'tb-lpic3-305-13',
    title: 'Pool de stockage libvirt non rafraîchi après ajout de volume manuel',
    titleFr: 'Pool de stockage libvirt non rafraîchi après ajout de volume manuel',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.2',
    category: 'Libvirt Storage Pools & Volumes',
    scenario: 'L\'administrateur a copié un fichier image "db.qcow2" directement dans le dossier /var/lib/libvirt/images/. Pourtant "virsh vol-list default" n\'affiche pas le nouveau volume et virt-install ne le trouve pas.',
    scenarioFr: 'L\'administrateur a copié un fichier image "db.qcow2" directement dans le dossier /var/lib/libvirt/images/. Pourtant "virsh vol-list default" n\'affiche pas le nouveau volume et virt-install ne le trouve pas.',
    codeSnippet: `# cp /backup/db.qcow2 /var/lib/libvirt/images/
# ls /var/lib/libvirt/images/
base.qcow2  db.qcow2

# virsh vol-list default
 Name         Path
-------------------------------------------------------
 base.qcow2   /var/lib/libvirt/images/base.qcow2
(db.qcow2 n'apparaît pas)`,
    language: 'bash',
    bugDescription: 'Libvirt maintient son propre cache de métadonnées pour chaque pool de stockage ; il ne rescannera pas le dossier automatiquement sans la commande "virsh pool-refresh".',
    bugDescriptionFr: 'Libvirt maintient son propre cache de métadonnées pour chaque pool de stockage ; il ne rescannera pas le dossier automatiquement sans la commande "virsh pool-refresh".',
    options: [
      {
        id: 'opt-1',
        label: 'Libvirt met en cache les volumes du pool ; il faut exécuter "virsh pool-refresh default" pour synchroniser la liste avec les fichiers réels du disque',
        labelFr: 'Libvirt met en cache les volumes du pool ; il faut exécuter "virsh pool-refresh default" pour synchroniser la liste avec les fichiers réels du disque',
        isCorrect: true,
        explanation: 'Lorsqu\'un fichier est injecté manuellement en dehors des commandes virsh vol-create, le démon libvirtd doit être notifié via pool-refresh pour analyser et indexer le volume.',
        explanationFr: 'Lorsqu\'un fichier est injecté manuellement en dehors des commandes virsh vol-create, le démon libvirtd doit être notifié via pool-refresh pour analyser et indexer le volume.'
      },
      {
        id: 'opt-2',
        label: 'Les noms de volumes libvirt ne peuvent pas contenir de point (".")',
        labelFr: 'Les noms de volumes libvirt ne peuvent pas contenir de point (".")',
        isCorrect: false,
        explanation: 'Les extensions .qcow2, .raw, .img sont standards.',
        explanationFr: 'Les extensions .qcow2, .raw, .img sont standards.'
      },
      {
        id: 'opt-3',
        label: 'Il faut redémarrer le service systemd-udevd',
        labelFr: 'Il faut redémarrer le service systemd-udevd',
        isCorrect: false,
        explanation: 'udev gère les périphériques blocs du système, pas les fichiers d\'un pool libvirt.',
        explanationFr: 'Il faut redémarrer le service systemd-udevd'
      },
      {
        id: 'opt-4',
        label: 'Le pool default est réservé aux images ISO de boot',
        labelFr: 'Le pool default est réservé aux images ISO de boot',
        isCorrect: false,
        explanation: 'Le pool default (/var/lib/libvirt/images) est le répertoire standard pour tous les disques de machines virtuelles.',
        explanationFr: 'Le pool default (/var/lib/libvirt/images) est le répertoire standard pour tous les disques de machines virtuelles.'
      }
    ],
    correctedSnippet: `virsh pool-refresh default
virsh vol-list default`,
    fixExplanation: 'Exécuter "virsh pool-refresh default" pour synchroniser le catalogue de libvirt avec le disque.',
    fixExplanationFr: 'Exécuter "virsh pool-refresh default" pour synchroniser le catalogue de libvirt avec le disque.'
  },
  {
    id: 'tb-lpic3-305-14',
    title: 'Échec de démarrage de conteneur LXC : interface réseau inexistante',
    titleFr: 'Échec de démarrage de conteneur LXC : interface réseau inexistante',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.2',
    category: 'LXC Containers & Bridged Networking',
    scenario: 'L\'administrateur tente de lancer un conteneur LXC avec "lxc-start -n web01 -F". La commande échoue avec "lxc-start: web01: conf.c: instantiate_veth: failed to attach \'vethXXXX\' to bridge \'lxcbr0\': No such device".',
    scenarioFr: 'L\'administrateur tente de lancer un conteneur LXC avec "lxc-start -n web01 -F". La commande échoue avec "lxc-start: web01: conf.c: instantiate_veth: failed to attach \'vethXXXX\' to bridge \'lxcbr0\': No such device".',
    codeSnippet: `# /var/lib/lxc/web01/config
lxc.net.0.type = veth
lxc.net.0.link = lxcbr0
lxc.net.0.flags = up
lxc.net.0.hwaddr = 00:16:3e:xx:xx:xx

# ip link show lxcbr0
Device "lxcbr0" does not exist.`,
    language: 'config',
    bugDescription: 'Le pont réseau hôte "lxcbr0" configuré dans le fichier de définition du conteneur LXC n\'existe pas ou le service lxc-net est arrêté.',
    bugDescriptionFr: 'Le pont réseau hôte "lxcbr0" configuré dans le fichier de définition du conteneur LXC n\'existe pas ou le service lxc-net est arrêté.',
    options: [
      {
        id: 'opt-1',
        label: 'Le pont réseau "lxcbr0" n\'existe pas sur l\'hôte ; il faut démarrer le service lxc-net ("systemctl start lxc-net") ou corriger lxc.net.0.link',
        labelFr: 'Le pont réseau "lxcbr0" n\'existe pas sur l\'hôte ; il faut démarrer le service lxc-net ("systemctl start lxc-net") ou corriger lxc.net.0.link',
        isCorrect: true,
        explanation: 'LXC configure une paire veth et tente d\'attacher l\'extrémité hôte au bridge désigné par lxc.net.0.link. Si le bridge n\'est pas instancié par lxc-net, l\'appel échoue avec "No such device".',
        explanationFr: 'LXC configure une paire veth et tente d\'attacher l\'extrémité hôte au bridge désigné par lxc.net.0.link. Si le bridge n\'est pas instancié par lxc-net, l\'appel échoue avec "No such device".'
      },
      {
        id: 'opt-2',
        label: 'lxc.net.0.type doit obligatoirement être configuré sur "macvlan"',
        labelFr: 'lxc.net.0.type doit obligatoirement être configuré sur "macvlan"',
        isCorrect: false,
        explanation: 'veth est le mode le plus répandu et le plus flexible.',
        explanationFr: 'veth est le mode le plus répandu et le plus flexible.'
      },
      {
        id: 'opt-3',
        label: 'L\'adresse MAC hwaddr ne doit jamais commencer par 00:16:3e',
        labelFr: 'L\'adresse MAC hwaddr ne doit jamais commencer par 00:16:3e',
        isCorrect: false,
        explanation: '00:16:3e est l\'OUI IEEE officiel réservé à Xen et LXC pour la virtualisation.',
        explanationFr: '00:16:3e est l\'OUI IEEE officiel réservé à Xen et LXC pour la virtualisation.'
      },
      {
        id: 'opt-4',
        label: 'lxc-start interdit l\'option -F en production',
        labelFr: 'lxc-start interdit l\'option -F en production',
        isCorrect: false,
        explanation: '-F (foreground) est l\'option idéale pour le diagnostic en direct.',
        explanationFr: '-F (foreground) est l\'option idéale pour le diagnostic en direct.'
      }
    ],
    correctedSnippet: `systemctl start lxc-net
systemctl enable lxc-net
lxc-start -n web01`,
    fixExplanation: 'Activer le service lxc-net pour créer le bridge lxcbr0 sur l\'hôte.',
    fixExplanationFr: 'Activer le service lxc-net pour créer le bridge lxcbr0 sur l\'hôte.'
  },
  {
    id: 'tb-lpic3-305-15',
    title: 'Machine virtuelle KVM gelée par manque d\'espace sur pool sparse',
    titleFr: 'Machine virtuelle KVM gelée par manque d\'espace sur pool sparse',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.2',
    category: 'Libvirt VM State & Storage Exhaustion',
    scenario: 'Une machine virtuelle critique sous KVM passe subitement à l\'état "paused". virsh resume échoue immédiatement et dmesg hôte consigne "qemu-system-x86_64: write failed: No space left on device".',
    scenarioFr: 'Une machine virtuelle critique sous KVM passe subitement à l\'état "paused". virsh resume échoue immédiatement et dmesg hôte consigne "qemu-system-x86_64: write failed: No space left on device".',
    codeSnippet: `# virsh domstate srv-db
paused

# df -h /var/lib/libvirt/images
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdb1       500G  500G     0 100% /var/lib/libvirt/images`,
    language: 'bash',
    bugDescription: 'Les images disques qcow2 étant allouées dynamiquement (sparse), la somme de leurs tailles virtuelles a dépassé la capacité physique du disque hôte, provoquant un arrêt d\'urgence automatique (pause) de la VM pour éviter la corruption.',
    bugDescriptionFr: 'Les images disques qcow2 étant allouées dynamiquement (sparse), la somme de leurs tailles virtuelles a dépassé la capacité physique du disque hôte, provoquant un arrêt d\'urgence automatique (pause) de la VM pour éviter la corruption.',
    options: [
      {
        id: 'opt-1',
        label: 'Le système de fichiers hôte hébergeant les disques qcow2 est plein à 100% ; QEMU met la VM en pause pour empêcher toute corruption de données jusqu\'à ce que de l\'espace soit libéré',
        labelFr: 'Le système de fichiers hôte hébergeant les disques qcow2 est plein à 100% ; QEMU met la VM en pause pour empêcher toute corruption de données jusqu\'à ce que de l\'espace soit libéré',
        isCorrect: true,
        explanation: 'KVM/QEMU possède un mécanisme de sécurité qui suspend la VM au lieu de crasher le guest lorsqu\'une écriture échoue par manque d\'espace sur le système de fichiers hôte. Une fois l\'espace libéré, "virsh resume" relance la VM sans perte.',
        explanationFr: 'KVM/QEMU possède un mécanisme de sécurité qui suspend la VM au lieu de crasher le guest lorsqu\'une écriture échoue par manque d\'espace sur le système de fichiers hôte. Une fois l\'espace libéré, "virsh resume" relance la VM sans perte.'
      },
      {
        id: 'opt-2',
        label: 'L\'état paused indique que la mémoire RAM de la VM est corrompue',
        labelFr: 'L\'état paused indique que la mémoire RAM de la VM est corrompue',
        isCorrect: false,
        explanation: 'Le log qemu indique sans ambiguïté "write failed: No space left on device".',
        explanationFr: 'Le log qemu indique sans ambiguïté "write failed: No space left on device".'
      },
      {
        id: 'opt-3',
        label: 'qcow2 ne doit jamais être utilisé sur un système de fichiers monté',
        labelFr: 'qcow2 ne doit jamais être utilisé sur un système de fichiers monté',
        isCorrect: false,
        explanation: 'qcow2 est conçu précisément pour être stocké sur des systèmes de fichiers.',
        explanationFr: 'qcow2 est conçu précisément pour être stocké sur des systèmes de fichiers.'
      },
      {
        id: 'opt-4',
        label: 'Il faut détruire la VM avec virsh destroy pour formater le disque',
        labelFr: 'Il faut détruire la VM avec virsh destroy pour formater le disque',
        isCorrect: false,
        explanation: 'Détruire la VM ferait perdre l\'état en mémoire non sauvegardé.',
        explanationFr: 'Détruire la VM ferait perdre l\'état en mémoire non sauvegardé.'
      }
    ],
    correctedSnippet: `# Libérer de l'espace ou étendre le volume hôte :
lvextend -L +100G /dev/vg0/lv_images && resize2fs /dev/vg0/lv_images
# Reprendre l'exécution :
virsh resume srv-db`,
    fixExplanation: 'Libérer de l\'espace ou étendre le système de fichiers hôte, puis reprendre la VM avec "virsh resume".',
    fixExplanationFr: 'Libérer de l\'espace ou étendre le système de fichiers hôte, puis reprendre la VM avec "virsh resume".'
  },
  {
    id: 'tb-lpic3-305-16',
    title: 'Directive Dockerfile avec mauvaise syntaxe ENTRYPOINT vs CMD',
    titleFr: 'Directive Dockerfile avec mauvaise syntaxe ENTRYPOINT vs CMD',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.3',
    category: 'Dockerfile Best Practices & Execution',
    scenario: 'L\'image Docker construite s\'arrête immédiatement avec "/bin/sh: [/entrypoint.sh]: not found" ou ignore les arguments passés lors du "docker run myimage arg1".',
    scenarioFr: 'L\'image Docker construite s\'arrête immédiatement avec "/bin/sh: [/entrypoint.sh]: not found" ou ignore les arguments passés lors du "docker run myimage arg1".',
    codeSnippet: `FROM debian:bookworm-slim
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Syntaxe shell mélangeant tableau JSON :
ENTRYPOINT "['/entrypoint.sh']"
CMD "run-server"`,
    language: 'config',
    bugDescription: 'L\'utilisation de guillemets simples à l\'intérieur de guillemets doubles transforme la forme exec JSON en une chaîne littérale erronée interprétée par /bin/sh -c.',
    bugDescriptionFr: 'L\'utilisation de guillemets simples à l\'intérieur de guillemets doubles transforme la forme exec JSON en une chaîne littérale erronée interprétée par /bin/sh -c.',
    options: [
      {
        id: 'opt-1',
        label: 'La forme exec JSON de ENTRYPOINT exige impérativement des crochets avec des guillemets doubles valides (ex: ENTRYPOINT ["/entrypoint.sh"])',
        labelFr: 'La forme exec JSON de ENTRYPOINT exige impérativement des crochets avec des guillemets doubles valides (ex: ENTRYPOINT ["/entrypoint.sh"])',
        isCorrect: true,
        explanation: 'En syntaxe Dockerfile, la forme exec s\'écrit obligatoirement ["binaire", "param1"] avec des guillemets doubles purs JSON. Si mal encadrée, Docker bascule en forme shell (/bin/sh -c) ce qui brise la transmission des signaux et des arguments.',
        explanationFr: 'En syntaxe Dockerfile, la forme exec s\'écrit obligatoirement ["binaire", "param1"] avec des guillemets doubles purs JSON. Si mal encadrée, Docker bascule en forme shell (/bin/sh -c) ce qui brise la transmission des signaux et des arguments.'
      },
      {
        id: 'opt-2',
        label: 'debian:bookworm-slim ne possède pas de shell POSIX',
        labelFr: 'debian:bookworm-slim ne possède pas de shell POSIX',
        isCorrect: false,
        explanation: 'Debian slim intègre /bin/sh (dash/bash).',
        explanationFr: 'Debian slim intègre /bin/sh (dash/bash).'
      },
      {
        id: 'opt-3',
        label: 'ENTRYPOINT et CMD ne peuvent jamais cohabiter dans le même Dockerfile',
        labelFr: 'ENTRYPOINT et CMD ne peuvent jamais cohabiter dans le même Dockerfile',
        isCorrect: false,
        explanation: 'La bonne pratique consiste justement à définir l\'exécutable dans ENTRYPOINT et les arguments par défaut dans CMD.',
        explanationFr: 'La bonne pratique consiste justement à définir l\'exécutable dans ENTRYPOINT et les arguments par défaut dans CMD.'
      },
      {
        id: 'opt-4',
        label: 'chmod +x est interdit dans une directive RUN',
        labelFr: 'chmod +x est interdit dans une directive RUN',
        isCorrect: false,
        explanation: 'chmod +x est couramment exécuté dans RUN pour rendre les scripts exécutables.',
        explanationFr: 'chmod +x est couramment exécuté dans RUN pour rendre les scripts exécutables.'
      }
    ],
    correctedSnippet: `FROM debian:bookworm-slim
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["run-server"]`,
    fixExplanation: 'Utiliser la syntaxe exec standard avec tableau JSON et guillemets doubles pour ENTRYPOINT et CMD.',
    fixExplanationFr: 'Utiliser la syntaxe exec standard avec tableau JSON et guillemets doubles pour ENTRYPOINT et CMD.'
  },
  {
    id: 'tb-lpic3-305-17',
    title: 'Image disque VM non optimisée : espace non libéré après suppressions (fstrim/discard)',
    titleFr: 'Image disque VM non optimisée : espace non libéré après suppressions (fstrim/discard)',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.3',
    category: 'QEMU virtio-scsi & Discard/TRIM Support',
    scenario: 'L\'utilisateur a supprimé 30 Go de fichiers dans sa machine virtuelle KVM, mais le fichier disque qcow2 sur l\'hyperviseur ne diminue pas de taille et "fstrim /" dans la VM répond : "fstrim: /: the discard operation is not supported".',
    scenarioFr: 'L\'utilisateur a supprimé 30 Go de fichiers dans sa machine virtuelle KVM, mais le fichier disque qcow2 sur l\'hyperviseur ne diminue pas de taille et "fstrim /" dans la VM répond : "fstrim: /: the discard operation is not supported".',
    codeSnippet: `<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2'/>
  <source file='/var/lib/libvirt/images/vm1.qcow2'/>
  <target dev='vda' bus='virtio'/>
</disk>`,
    language: 'xml',
    bugDescription: 'La directive <driver> du disque virtuel ne comporte pas l\'attribut "discard=\'unmap\'", ce qui empêche le noyau du guest de propager les commandes TRIM/discard vers le fichier hôte.',
    bugDescriptionFr: 'La directive <driver> du disque virtuel ne comporte pas l\'attribut "discard=\'unmap\'", ce qui empêche le noyau du guest de propager les commandes TRIM/discard vers le fichier hôte.',
    options: [
      {
        id: 'opt-1',
        label: 'Le pilote disque virtuel libvirt ne déclare pas l\'attribut "discard=\'unmap\'" dans la balise <driver>, interdisant la transmission des requêtes TRIM',
        labelFr: 'Le pilote disque virtuel libvirt ne déclare pas l\'attribut "discard=\'unmap\'" dans la balise <driver>, interdisant la transmission des requêtes TRIM',
        isCorrect: true,
        explanation: 'Pour que l\'hyperviseur KVM libère les blocs non alloués d\'un fichier qcow2 lors d\'un fstrim interne, l\'option discard=\'unmap\' doit être explicitée dans la configuration libvirt.',
        explanationFr: 'Pour que l\'hyperviseur KVM libère les blocs non alloués d\'un fichier qcow2 lors d\'un fstrim interne, l\'option discard=\'unmap\' doit être explicitée dans la configuration libvirt.'
      },
      {
        id: 'opt-2',
        label: 'qcow2 ne supporte pas la réduction dynamique d\'espace disque',
        labelFr: 'qcow2 ne supporte pas la réduction dynamique d\'espace disque',
        isCorrect: false,
        explanation: 'qcow2 supporte pleinement le sparse hole punching via unmap.',
        explanationFr: 'qcow2 supporte pleinement le sparse hole punching via unmap.'
      },
      {
        id: 'opt-3',
        label: 'Le bus doit obligatoirement être configuré sur IDE pour que le TRIM fonctionne',
        labelFr: 'Le bus doit obligatoirement être configuré sur IDE pour que le TRIM fonctionne',
        isCorrect: false,
        explanation: 'IDE ne supporte pas le TRIM; virtio ou virtio-scsi sont nécessaires.',
        explanationFr: 'IDE ne supporte pas le TRIM; virtio ou virtio-scsi sont nécessaires.'
      },
      {
        id: 'opt-4',
        label: 'fstrim ne fonctionne que sur les disques durs mécaniques à plateaux',
        labelFr: 'fstrim ne fonctionne que sur les disques durs mécaniques à plateaux',
        isCorrect: false,
        explanation: 'fstrim est conçu spécifiquement pour les SSDs et les fichiers d\'images virtuelles allouées dynamiquement.',
        explanationFr: 'fstrim est conçu spécifiquement pour les SSDs et les fichiers d\'images virtuelles allouées dynamiquement.'
      }
    ],
    correctedSnippet: `<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2' discard='unmap'/>
  <source file='/var/lib/libvirt/images/vm1.qcow2'/>
  <target dev='vda' bus='virtio'/>
</disk>`,
    fixExplanation: 'Ajouter discard=\'unmap\' dans l\'élément <driver> XML du disque de la machine virtuelle.',
    fixExplanationFr: 'Ajouter discard=\'unmap\' dans l\'élément <driver> XML du disque de la machine virtuelle.'
  },
  {
    id: 'tb-lpic3-305-18',
    title: 'Erreur de metadata cloud-init empêchant l\'injection de clé SSH',
    titleFr: 'Erreur de metadata cloud-init empêchant l\'injection de clé SSH',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.4',
    category: 'Cloud-init & Automated Provisioning',
    scenario: 'Lors de l\'instanciation automatique d\'une image cloud Ubuntu/Debian avec cloud-init via un disque NoCloud ISO, l\'utilisateur "debian" n\'est pas créé et la clé SSH publique n\'est pas injectée.',
    scenarioFr: 'Lors de l\'instanciation automatique d\'une image cloud Ubuntu/Debian avec cloud-init via un disque NoCloud ISO, l\'utilisateur "debian" n\'est pas créé et la clé SSH publique n\'est pas injectée.',
    codeSnippet: `# /mnt/user-data
users:
  - name: debian
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ... user@workstation`,
    language: 'yaml',
    bugDescription: 'Le fichier user-data de cloud-init omet la ligne d\'en-tête obligatoire "#cloud-config" sur la première ligne, conduisant le parseur à ignorer le fichier ou le traiter en simple script shell.',
    bugDescriptionFr: 'Le fichier user-data de cloud-init omet la ligne d\'en-tête obligatoire "#cloud-config" sur la première ligne, conduisant le parseur à ignorer le fichier ou le traiter en simple script shell.',
    options: [
      {
        id: 'opt-1',
        label: 'La première ligne du fichier user-data doit obligatoirement être "#cloud-config" pour que cloud-init interprète le contenu en YAML',
        labelFr: 'La première ligne du fichier user-data doit obligatoirement être "#cloud-config" pour que cloud-init interprète le contenu en YAML',
        isCorrect: true,
        explanation: 'Cloud-init utilise le type MIME ou la première ligne du fichier user-data pour identifier la syntaxe. Sans l\'en-tête "#cloud-config", le fichier n\'est pas traité comme une configuration déclarative de modules.',
        explanationFr: 'Cloud-init utilise le type MIME ou la première ligne du fichier user-data pour identifier la syntaxe. Sans l\'en-tête "#cloud-config", le fichier n\'est pas traité comme une configuration déclarative de modules.'
      },
      {
        id: 'opt-2',
        label: 'Les clés SSH RSA sont totalement interdites par cloud-init',
        labelFr: 'Les clés SSH RSA sont totalement interdites par cloud-init',
        isCorrect: false,
        explanation: 'cloud-init supporte tous les types de clés SSH (RSA, ECDSA, Ed25519).',
        explanationFr: 'cloud-init supporte tous les types de clés SSH (RSA, ECDSA, Ed25519).'
      },
      {
        id: 'opt-3',
        label: 'Le nom du fichier doit être config.yaml et non user-data',
        labelFr: 'Le nom du fichier doit être config.yaml et non user-data',
        isCorrect: false,
        explanation: 'Pour la datasource NoCloud, les fichiers doivent s\'appeler strictement "user-data" et "meta-data".',
        explanationFr: 'Pour la datasource NoCloud, les fichiers doivent s\'appeler strictement "user-data" et "meta-data".'
      },
      {
        id: 'opt-4',
        label: 'NOPASSWD:ALL n\'est pas supporté dans cloud-init',
        labelFr: 'NOPASSWD:ALL n\'est pas supporté dans cloud-init',
        isCorrect: false,
        explanation: 'C\'est la directive sudo standard dans cloud-init.',
        explanationFr: 'C\'est la directive sudo standard dans cloud-init.'
      }
    ],
    correctedSnippet: `#cloud-config
users:
  - name: debian
    sudo: ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ... user@workstation`,
    fixExplanation: 'Ajouter "#cloud-config" sur la toute première ligne du fichier user-data.',
    fixExplanationFr: 'Ajouter "#cloud-config" sur la toute première ligne du fichier user-data.'
  },
  {
    id: 'tb-lpic3-305-19',
    title: 'Problème de montage CNI Kubernetes (NetworkPlugin crictl failure)',
    titleFr: 'Problème de montage CNI Kubernetes (NetworkPlugin crictl failure)',
    certification: 'lpic-3',
    topicNumber: 353,
    objectiveId: '353.2',
    category: 'Kubernetes Container Network Interface (CNI)',
    scenario: 'Tous les nouveaux pods créés sur un worker node Kubernetes restent bloqués à l\'état "ContainerCreating". Le journal de kubelet affiche : "NetworkPlugin cni failed to set up pod network: stat /etc/cni/net.d: no such file or directory".',
    scenarioFr: 'Tous les nouveaux pods créés sur un worker node Kubernetes restent bloqués à l\'état "ContainerCreating". Le journal de kubelet affiche : "NetworkPlugin cni failed to set up pod network: stat /etc/cni/net.d: no such file or directory".',
    codeSnippet: `# kubectl get nodes
NAME       STATUS     ROLES    AGE   VERSION
worker-1   NotReady   <none>   10m   v1.28.2

# journalctl -u kubelet -n 20
kubelet: runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:Network plugin returns error: cni plugin not initialized`,
    language: 'bash',
    bugDescription: 'Aucun plugin réseau CNI (Calico, Flannel, Cilium, etc.) n\'a été déployé sur le cluster, le répertoire de configuration CNI /etc/cni/net.d/ est vide ou absent.',
    bugDescriptionFr: 'Aucun plugin réseau CNI (Calico, Flannel, Cilium, etc.) n\'a été déployé sur le cluster, le répertoire de configuration CNI /etc/cni/net.d/ est vide ou absent.',
    options: [
      {
        id: 'opt-1',
        label: 'Aucun plugin réseau CNI (Flannel, Calico, Weave...) n\'est installé sur le cluster, kubelet ne peut donc pas initialiser le réseau des pods et marque le nœud en "NotReady"',
        labelFr: 'Aucun plugin réseau CNI (Flannel, Calico, Weave...) n\'est installé sur le cluster, kubelet ne peut donc pas initialiser le réseau des pods et marque le nœud en "NotReady"',
        isCorrect: true,
        explanation: 'Kubernetes nécessite obligatoirement l\'installation d\'un fournisseur CNI pour gérer l\'adressage IP des pods et les routes inter-nœuds. Tant qu\'aucun DaemonSet CNI n\'a peuplé /etc/cni/net.d/, le nœud reste bloqué en NotReady.',
        explanationFr: 'Kubernetes nécessite obligatoirement l\'installation d\'un fournisseur CNI pour gérer l\'adressage IP des pods et les routes inter-nœuds. Tant qu\'aucun DaemonSet CNI n\'a peuplé /etc/cni/net.d/, le nœud reste bloqué en NotReady.'
      },
      {
        id: 'opt-2',
        label: 'kubelet doit être recompilé avec le paramètre --without-cni',
        labelFr: 'kubelet doit être recompilé avec le paramètre --without-cni',
        isCorrect: false,
        explanation: 'CNI est la seule couche réseau supportée par Kubernetes moderne.',
        explanationFr: 'CNI est la seule couche réseau supportée par Kubernetes moderne.'
      },
      {
        id: 'opt-3',
        label: 'Le binaire containerd doit être remplacé par Docker CE',
        labelFr: 'Le binaire containerd doit être remplacé par Docker CE',
        isCorrect: false,
        explanation: 'containerd est le runtime CRI officiel et recommandé.',
        explanationFr: 'containerd est le runtime CRI officiel et recommandé.'
      },
      {
        id: 'opt-4',
        label: 'Les nœuds de calcul doivent obligatoirement posséder 4 interfaces Ethernet physiques',
        labelFr: 'Les nœuds de calcul doivent obligatoirement posséder 4 interfaces Ethernet physiques',
        isCorrect: false,
        explanation: 'Une seule interface réseau suffit amplement.',
        explanationFr: 'Une seule interface réseau suffit amplement.'
      }
    ],
    correctedSnippet: `# Déployer un plugin CNI (exemple Flannel) :
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
# Vérifier le statut du nœud :
kubectl get nodes`,
    fixExplanation: 'Appliquer le manifeste du plugin CNI (ex: Flannel ou Calico) sur le cluster Kubernetes.',
    fixExplanationFr: 'Appliquer le manifeste du plugin CNI (ex: Flannel ou Calico) sur le cluster Kubernetes.'
  },
  {
    id: 'tb-lpic3-305-20',
    title: 'Conflit de noms de conteneurs Docker empêchant le déploiement',
    titleFr: 'Conflit de noms de conteneurs Docker empêchant le déploiement',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.3',
    category: 'Docker Container Management',
    scenario: 'Un script CI/CD tente de redéployer le conteneur applicatif mais échoue avec : "docker: Error response from daemon: Conflict. The container name \"/api-server\" is already in use by container \"a1b2c3d4e5\". You have to remove (or rename) that container to be able to reuse that name."',
    scenarioFr: 'Un script CI/CD tente de redéployer le conteneur applicatif mais échoue avec : "docker: Error response from daemon: Conflict. The container name \"/api-server\" is already in use by container \"a1b2c3d4e5\". You have to remove (or rename) that container to be able to reuse that name."',
    codeSnippet: `# docker ps -a | grep api-server
a1b2c3d4e5   api:1.0   "/entrypoint.sh"   2 hours ago   Exited (0) 10 minutes ago   api-server

# docker run -d --name api-server -p 8080:8080 api:1.1
docker: Error response from daemon: Conflict. The container name "/api-server" is already in use...`,
    language: 'bash',
    bugDescription: 'Un ancien conteneur éteint (Exited) portant le même nom existe toujours dans le registre local de Docker, empêchant la réutilisation immédiate du nom.',
    bugDescriptionFr: 'Un ancien conteneur éteint (Exited) portant le même nom existe toujours dans le registre local de Docker, empêchant la réutilisation immédiate du nom.',
    options: [
      {
        id: 'opt-1',
        label: 'Un conteneur arrêté avec le même nom existe toujours ; il faut le supprimer ("docker rm api-server" ou "docker rm -f") avant de recréer le nouveau conteneur',
        labelFr: 'Un conteneur arrêté avec le même nom existe toujours ; il faut le supprimer ("docker rm api-server" ou "docker rm -f") avant de recréer le nouveau conteneur',
        isCorrect: true,
        explanation: 'Docker impose l\'unicité stricte des noms de conteneurs actifs et inactifs. Même arrêté, un conteneur conserve son nom tant qu\'il n\'a pas été purgé avec docker rm (ou lancé avec l\'option --rm initiale).',
        explanationFr: 'Docker impose l\'unicité stricte des noms de conteneurs actifs et inactifs. Même arrêté, un conteneur conserve son nom tant qu\'il n\'a pas été purgé avec docker rm (ou lancé avec l\'option --rm initiale).'
      },
      {
        id: 'opt-2',
        label: 'Docker ne supporte pas l\'option --name en environnement automatisé',
        labelFr: 'Docker ne supporte pas l\'option --name en environnement automatisé',
        isCorrect: false,
        explanation: '--name est très utilisé en automatisation pour référencer facilement les conteneurs.',
        explanationFr: 'Docker ne supporte pas l\'option --name en environnement automatisé'
      },
      {
        id: 'opt-3',
        label: 'L\'image api:1.1 a été construite avec un mauvais sha256',
        labelFr: 'L\'image api:1.1 a été construite avec un mauvais sha256',
        isCorrect: false,
        explanation: 'L\'erreur indique textuellement un conflit de nom de conteneur.',
        explanationFr: 'L\'erreur indique textuellement un conflit de nom de conteneur.'
      },
      {
        id: 'opt-4',
        label: 'Le port 8080 est déjà occupé par le noyau Linux',
        labelFr: 'Le port 8080 est déjà occupé par le noyau Linux',
        isCorrect: false,
        explanation: 'L\'ancien conteneur étant à l\'état Exited, il n\'écoute plus sur le port.',
        explanationFr: 'L\'ancien conteneur étant à l\'état Exited, il n\'écoute plus sur le port.'
      }
    ],
    correctedSnippet: `docker rm -f api-server || true
docker run -d --name api-server -p 8080:8080 api:1.1`,
    fixExplanation: 'Nettoyer le conteneur précédent avec "docker rm -f api-server" avant d\'instancier la nouvelle version.',
    fixExplanationFr: 'Nettoyer le conteneur précédent avec "docker rm -f api-server" avant d\'instancier la nouvelle version.'
  },
  {
    id: 'tb-lpic3-305-21',
    title: 'Migration à chaud KVM (live migration) échouant par CPU incompatible',
    titleFr: 'Migration à chaud KVM (live migration) échouant par CPU incompatible',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.2',
    category: 'Libvirt Live Migration & CPU Models',
    scenario: 'L\'administrateur lance la migration à chaud d\'une VM entre deux nœuds d\'un cluster KVM ("virsh migrate --live"). L\'opération échoue avec "error: the CPU is incompatible with host CPU: Host CPU does not provide required features: invpcid, avx2".',
    scenarioFr: 'L\'administrateur lance la migration à chaud d\'une VM entre deux nœuds d\'un cluster KVM ("virsh migrate --live"). L\'opération échoue avec "error: the CPU is incompatible with host CPU: Host CPU does not provide required features: invpcid, avx2".',
    codeSnippet: `# Configuration de la VM source :
<cpu mode='host-passthrough' check='none'/>`,
    language: 'xml',
    bugDescription: 'Le mode "host-passthrough" expose l\'intégralité des instructions spécifiques du CPU de l\'hôte source, rendant impossible la migration vers un hôte cible dont le processeur est légèrement plus ancien ou de génération différente.',
    bugDescriptionFr: 'Le mode "host-passthrough" expose l\'intégralité des instructions spécifiques du CPU de l\'hôte source, rendant impossible la migration vers un hôte cible dont le processeur est légèrement plus ancien ou de génération différente.',
    options: [
      {
        id: 'opt-1',
        label: 'Le mode CPU est réglé sur "host-passthrough" qui empêche la migration vers un hôte au CPU différent ; il faut utiliser "host-model" ou un modèle de processeur standardisé (ex: Skylake-Client)',
        labelFr: 'Le mode CPU est réglé sur "host-passthrough" qui empêche la migration vers un hôte au CPU différent ; il faut utiliser "host-model" ou un modèle de processeur standardisé (ex: Skylake-Client)',
        isCorrect: true,
        explanation: 'Pour que la migration à chaud (live migration) fonctionne dans un parc de serveurs hétérogènes, il faut utiliser un modèle CPU commun (comme host-model ou un profil QEMU générique) qui n\'expose que les fonctionnalités présentes sur tous les hyperviseurs.',
        explanationFr: 'Pour que la migration à chaud (live migration) fonctionne dans un parc de serveurs hétérogènes, il faut utiliser un modèle CPU commun (comme host-model ou un profil QEMU générique) qui n\'expose que les fonctionnalités présentes sur tous les hyperviseurs.'
      },
      {
        id: 'opt-2',
        label: 'virsh migrate n\'autorise pas l\'option --live en environnement de production',
        labelFr: 'virsh migrate n\'autorise pas l\'option --live en environnement de production',
        isCorrect: false,
        explanation: '--live est précisément le mécanisme de migration sans interruption de service.',
        explanationFr: '--live est précisément le mécanisme de migration sans interruption de service.'
      },
      {
        id: 'opt-3',
        label: 'Les processeurs Intel ne peuvent pas être migrés sous KVM',
        labelFr: 'Les processeurs Intel ne peuvent pas être migrés sous KVM',
        isCorrect: false,
        explanation: 'Intel est entièrement supporté pour la live migration.',
        explanationFr: 'Intel est entièrement supporté pour la live migration.'
      },
      {
        id: 'opt-4',
        label: 'check=\'none\' doit obligatoirement être remplacé par check=\'strict\'',
        labelFr: 'check=\'none\' doit obligatoirement être remplacé par check=\'strict\'',
        isCorrect: false,
        explanation: 'check=\'strict\' renforcerait le rejet sans corriger l\'incompatibilité.',
        explanationFr: 'check=\'strict\' renforcerait le rejet sans corriger l\'incompatibilité.'
      }
    ],
    correctedSnippet: `<cpu mode='custom' match='exact' check='partial'>
  <model fallback='allow'>Broadwell-noTSX-IBRS</model>
</cpu>`,
    fixExplanation: 'Remplacer host-passthrough par un modèle CPU compatible partagé entre les serveurs du cluster.',
    fixExplanationFr: 'Remplacer host-passthrough par un modèle CPU compatible partagé entre les serveurs du cluster.'
  },
  {
    id: 'tb-lpic3-305-22',
    title: 'Échec de résolution DNS interne dans les conteneurs Docker (embedded DNS)',
    titleFr: 'Échec de résolution DNS interne dans les conteneurs Docker (embedded DNS)',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.3',
    category: 'Docker Embedded DNS & User-Defined Networks',
    scenario: 'Deux conteneurs créés avec docker run sur le réseau par défaut ("bridge") tentent de communiquer par leurs noms de conteneur ("ping backend"). La commande échoue avec "ping: bad address \'backend\'".',
    scenarioFr: 'Deux conteneurs créés avec docker run sur le réseau par défaut ("bridge") tentent de communiquer par leurs noms de conteneur ("ping backend"). La commande échoue avec "ping: bad address \'backend\'".',
    codeSnippet: `# docker run -d --name backend redis
# docker run -it --name frontend alpine ping backend
ping: bad address 'backend'`,
    language: 'bash',
    bugDescription: 'Sur le réseau bridge par défaut de Docker ("bridge"), le serveur DNS interne (127.0.0.11) ne résout PAS les noms de conteneurs ; cette fonctionnalité requiert un réseau personnalisé (user-defined bridge).',
    bugDescriptionFr: 'Sur le réseau bridge par défaut de Docker ("bridge"), le serveur DNS interne (127.0.0.11) ne résout PAS les noms de conteneurs ; cette fonctionnalité requiert un réseau personnalisé (user-defined bridge).',
    options: [
      {
        id: 'opt-1',
        label: 'Le réseau par défaut Docker "bridge" ne supporte pas la résolution DNS automatique par nom de conteneur ; il faut créer et utiliser un réseau personnalisé ("docker network create monreseau")',
        labelFr: 'Le réseau par défaut Docker "bridge" ne supporte pas la résolution DNS automatique par nom de conteneur ; il faut créer et utiliser un réseau personnalisé ("docker network create monreseau")',
        isCorrect: true,
        explanation: 'Pour des raisons de rétrocompatibilité historique, Docker n\'active son résolveur DNS interne embarqué (127.0.0.11) que sur les réseaux personnalisés créés par l\'utilisateur (user-defined networks).',
        explanationFr: 'Pour des raisons de rétrocompatibilité historique, Docker n\'active son résolveur DNS interne embarqué (127.0.0.11) que sur les réseaux personnalisés créés par l\'utilisateur (user-defined networks).'
      },
      {
        id: 'opt-2',
        label: 'ping est interdit par défaut dans les images Alpine Linux',
        labelFr: 'ping est interdit par défaut dans les images Alpine Linux',
        isCorrect: false,
        explanation: 'Alpine intègre l\'utilitaire ping via BusyBox.',
        explanationFr: 'Alpine intègre l\'utilitaire ping via BusyBox.'
      },
      {
        id: 'opt-3',
        label: 'Le conteneur Redis ne peut pas répondre au ping',
        labelFr: 'Le conteneur Redis ne peut pas répondre au ping',
        isCorrect: false,
        explanation: 'C\'est la résolution de nom d\'hôte (DNS lookup) qui échoue ici ("bad address").',
        explanationFr: 'C\'est la résolution de nom d\'hôte (DNS lookup) qui échoue ici ("bad address").'
      },
      {
        id: 'opt-4',
        label: 'Il faut modifier le fichier /etc/hosts de l\'hôte physique',
        labelFr: 'Il faut modifier le fichier /etc/hosts de l\'hôte physique',
        isCorrect: false,
        explanation: 'Le fichier hosts de l\'hôte n\'affecte pas l\'espace de noms réseau des conteneurs.',
        explanationFr: 'Le fichier hosts de l\'hôte n\'affecte pas l\'espace de noms réseau des conteneurs.'
      }
    ],
    correctedSnippet: `docker network create app-net
docker run -d --name backend --network app-net redis
docker run -it --rm --network app-net alpine ping backend`,
    fixExplanation: 'Créer un réseau défini par l\'utilisateur avec "docker network create" pour bénéficier de la découverte de service DNS automatique.',
    fixExplanationFr: 'Créer un réseau défini par l\'utilisateur avec "docker network create" pour bénéficier de la découverte de service DNS automatique.'
  },
  {
    id: 'tb-lpic3-305-23',
    title: 'PersistentVolume Kubernetes bloqué à l\'état "Pending" (accessModes mismatch)',
    titleFr: 'PersistentVolume Kubernetes bloqué à l\'état "Pending" (accessModes mismatch)',
    certification: 'lpic-3',
    topicNumber: 353,
    objectiveId: '353.2',
    category: 'Kubernetes Persistent Storage & Volume Binding',
    scenario: 'L\'administrateur crée une demande de volume persistant (PVC). Le PVC reste indéfiniment bloqué en statut "Pending" et ne s\'associe pas au PV statique pourtant disponible.',
    scenarioFr: 'L\'administrateur crée une demande de volume persistant (PVC). Le PVC reste indéfiniment bloqué en statut "Pending" et ne s\'associe pas au PV statique pourtant disponible.',
    codeSnippet: `# Définition du PV existant :
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data

# Définition du PVC :
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-claim
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi`,
    language: 'yaml',
    bugDescription: 'Le PVC réclame le mode d\'accès "ReadWriteMany" (RWX) alors que le PersistentVolume n\'offre que le mode "ReadWriteOnce" (RWO), empêchant le liage automatique (binding).',
    bugDescriptionFr: 'Le PVC réclame le mode d\'accès "ReadWriteMany" (RWX) alors que le PersistentVolume n\'offre que le mode "ReadWriteOnce" (RWO), empêchant le liage automatique (binding).',
    options: [
      {
        id: 'opt-1',
        label: 'Incompatibilité de mode d\'accès : le PVC demande "ReadWriteMany" alors que le PV n\'autorise que "ReadWriteOnce"',
        labelFr: 'Incompatibilité de mode d\'accès : le PVC demande "ReadWriteMany" alors que le PV n\'autorise que "ReadWriteOnce"',
        isCorrect: true,
        explanation: 'Pour qu\'un PVC puisse se lier (bind) à un PV, ses accessModes doivent être un sous-ensemble strict des modes proposés par le volume persistant. hostPath ne supporte pas ReadWriteMany.',
        explanationFr: 'Pour qu\'un PVC puisse se lier (bind) à un PV, ses accessModes doivent être un sous-ensemble strict des modes proposés par le volume persistant. hostPath ne supporte pas ReadWriteMany.'
      },
      {
        id: 'opt-2',
        label: 'La capacité demandée (10Gi) est trop petite pour le volume de 20Gi',
        labelFr: 'La capacité demandée (10Gi) est trop petite pour le volume de 20Gi',
        isCorrect: false,
        explanation: 'Un PV de 20Gi peut parfaitement satisfaire une requête de 10Gi.',
        explanationFr: 'Un PV de 20Gi peut parfaitement satisfaire une requête de 10Gi.'
      },
      {
        id: 'opt-3',
        label: 'hostPath est interdit dans les spécifications Kubernetes 1.25+',
        labelFr: 'hostPath est interdit dans les spécifications Kubernetes 1.25+',
        isCorrect: false,
        explanation: 'hostPath reste disponible notamment pour les tests et nœuds uniques.',
        explanationFr: 'hostPath reste disponible notamment pour les tests et nœuds uniques.'
      },
      {
        id: 'opt-4',
        label: 'Les PVC doivent obligatoirement avoir le même nom que le PV',
        labelFr: 'Les PVC doivent obligatoirement avoir le même nom que le PV',
        isCorrect: false,
        explanation: 'Les noms de PV et de PVC sont indépendants.',
        explanationFr: 'Les noms de PV et de PVC sont indépendants.'
      }
    ],
    correctedSnippet: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi`,
    fixExplanation: 'Harmoniser les accessModes du PVC pour correspondre à ceux proposés par le PV (ReadWriteOnce).',
    fixExplanationFr: 'Harmoniser les accessModes du PVC pour correspondre à ceux proposés par le PV (ReadWriteOnce).'
  },
  {
    id: 'tb-lpic3-305-24',
    title: 'Isolation de conteneur rompue par option cgroups unifiée manquante',
    titleFr: 'Isolation de conteneur rompue par option cgroups unifiée manquante',
    certification: 'lpic-3',
    topicNumber: 352,
    objectiveId: '352.1',
    category: 'cgroups v2 & Kernel Controllers',
    scenario: 'Sur un serveur hôte exécutant cgroups v2 unifié, une application tente d\'imposer une limite de swap ou de mémoire via Docker, mais le service avertit : "WARNING: Your kernel does not support swap limit capabilities or the cgroup is not mounted".',
    scenarioFr: 'Sur un serveur hôte exécutant cgroups v2 unifié, une application tente d\'imposer une limite de swap ou de mémoire via Docker, mais le service avertit : "WARNING: Your kernel does not support swap limit capabilities or the cgroup is not mounted".',
    codeSnippet: `# docker info | grep -i cgroup
 Cgroup Version: 2
 WARNING: No swap limit support

# cat /proc/cmdline
BOOT_IMAGE=/boot/vmlinuz root=UUID=... ro quiet`,
    language: 'bash',
    bugDescription: 'Le contrôleur de swap de cgroups n\'est pas activé au démarrage du noyau Linux (paramètre "cgroup_enable=memory swapaccount=1").',
    bugDescriptionFr: 'Le contrôleur de swap de cgroups n\'est pas activé au démarrage du noyau Linux (paramètre "cgroup_enable=memory swapaccount=1").',
    options: [
      {
        id: 'opt-1',
        label: 'Le contrôleur de gestion du swap en mémoire cgroup doit être activé via les paramètres de boot du noyau Linux (cgroup_enable=memory swapaccount=1)',
        labelFr: 'Le contrôleur de gestion du swap en mémoire cgroup doit être activé via les paramètres de boot du noyau Linux (cgroup_enable=memory swapaccount=1)',
        isCorrect: true,
        explanation: 'Certaines distributions désactivent le suivi du swap par défaut pour économiser un peu de surcharge CPU. Pour permettre aux conteneurs de limiter leur swap (--memory-swap), il faut ajouter ces options dans GRUB.',
        explanationFr: 'Certaines distributions désactivent le suivi du swap par défaut pour économiser un peu de surcharge CPU. Pour permettre aux conteneurs de limiter leur swap (--memory-swap), il faut ajouter ces options dans GRUB.'
      },
      {
        id: 'opt-2',
        label: 'Le swap est totalement interdit sur tout serveur exécutant des conteneurs',
        labelFr: 'Le swap est totalement interdit sur tout serveur exécutant des conteneurs',
        isCorrect: false,
        explanation: 'Bien que Kubernetes désactive traditionnellement le swap, Docker le gère parfaitement.',
        explanationFr: 'Bien que Kubernetes désactive traditionnellement le swap, Docker le gère parfaitement.'
      },
      {
        id: 'opt-3',
        label: 'cgroups v2 a supprimé la possibilité de limiter la mémoire',
        labelFr: 'cgroups v2 a supprimé la possibilité de limiter la mémoire',
        isCorrect: false,
        explanation: 'cgroups v2 améliore au contraire la gestion de la mémoire (memory.max, memory.high).',
        explanationFr: 'cgroups v2 améliore au contraire la gestion de la mémoire (memory.max, memory.high).'
      },
      {
        id: 'opt-4',
        label: 'Docker doit être exécuté avec l\'option --no-cgroups',
        labelFr: 'Docker doit être exécuté avec l\'option --no-cgroups',
        isCorrect: false,
        explanation: 'Docker ne peut pas fonctionner sans cgroups.',
        explanationFr: 'Docker ne peut pas fonctionner sans cgroups.'
      }
    ],
    correctedSnippet: `# Dans /etc/default/grub :
GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1"
# Mettre à jour grub et redémarrer :
update-grub`,
    fixExplanation: 'Ajouter "cgroup_enable=memory swapaccount=1" dans la ligne de commande GRUB du noyau.',
    fixExplanationFr: 'Ajouter "cgroup_enable=memory swapaccount=1" dans la ligne de commande GRUB du noyau.'
  },
  {
    id: 'tb-lpic3-305-25',
    title: 'Attribut virtio mal configuré provoquant un débit réseau dégradé sur KVM',
    titleFr: 'Attribut virtio mal configuré provoquant un débit réseau dégradé sur KVM',
    certification: 'lpic-3',
    topicNumber: 351,
    objectiveId: '351.1',
    category: 'KVM VirtIO Network Performance & vhost-net',
    scenario: 'Les transferts réseau d\'une machine virtuelle KVM plafonnent à 100 Mo/s sur une liaison 10 Gb/s physique et consomment 100% d\'un cœur CPU de l\'hyperviseur.',
    scenarioFr: 'Les transferts réseau d\'une machine virtuelle KVM plafonnent à 100 Mo/s sur une liaison 10 Gb/s physique et consomment 100% d\'un cœur CPU de l\'hyperviseur.',
    codeSnippet: `<interface type='bridge'>
  <mac address='52:54:00:11:22:33'/>
  <source bridge='br0'/>
  <model type='e1000'/>
</interface>`,
    language: 'xml',
    bugDescription: 'La machine virtuelle utilise une carte réseau émulée Intel e1000 au lieu du pilote paravirtualisé haute performance "virtio" accéléré par le module noyau "vhost_net".',
    bugDescriptionFr: 'La machine virtuelle utilise une carte réseau émulée Intel e1000 au lieu du pilote paravirtualisé haute performance "virtio" accéléré par le module noyau "vhost_net".',
    options: [
      {
        id: 'opt-1',
        label: 'La carte réseau utilise l\'émulation matérielle "e1000" très coûteuse en CPU ; il faut la remplacer par le modèle paravirtualisé "virtio" qui exploite vhost-net',
        labelFr: 'La carte réseau utilise l\'émulation matérielle "e1000" très coûteuse en CPU ; il faut la remplacer par le modèle paravirtualisé "virtio" qui exploite vhost-net',
        isCorrect: true,
        explanation: 'L\'émulation d\'une carte Intel e1000 effectue des interruptions et des allers-retours continus entre l\'espace utilisateur QEMU et le noyau. Le pilote virtio (paravirtualisé) utilise des anneaux partagés virtqueues atteignant le débit line-rate sans saturation CPU.',
        explanationFr: 'L\'émulation d\'une carte Intel e1000 effectue des interruptions et des allers-retours continus entre l\'espace utilisateur QEMU et le noyau. Le pilote virtio (paravirtualisé) utilise des anneaux partagés virtqueues atteignant le débit line-rate sans saturation CPU.'
      },
      {
        id: 'opt-2',
        label: 'br0 doit être remplacé par un bridge sans adresse IP',
        labelFr: 'br0 doit être remplacé par un bridge sans adresse IP',
        isCorrect: false,
        explanation: 'Le bridge Linux br0 supporte parfaitement les débits multi-gigabits.',
        explanationFr: 'Le bridge Linux br0 supporte parfaitement les débits multi-gigabits.'
      },
      {
        id: 'opt-3',
        label: 'KVM est limité techniquement à 100 Mbit/s par conception',
        labelFr: 'KVM est limité techniquement à 100 Mbit/s par conception',
        isCorrect: false,
        explanation: 'KVM dépasse couramment les 40 Gb/s par VM avec virtio.',
        explanationFr: 'KVM dépasse couramment les 40 Gb/s par VM avec virtio.'
      },
      {
        id: 'opt-4',
        label: 'L\'adresse MAC doit obligatoirement débuter par 00:00:00',
        labelFr: 'L\'adresse MAC doit obligatoirement débuter par 00:00:00',
        isCorrect: false,
        explanation: '52:54:00 est l\'OUI IEEE standard pour QEMU/KVM.',
        explanationFr: '52:54:00 est l\'OUI IEEE standard pour QEMU/KVM.'
      }
    ],
    correctedSnippet: `<interface type='bridge'>
  <mac address='52:54:00:11:22:33'/>
  <source bridge='br0'/>
  <model type='virtio'/>
  <driver name='vhost'/>
</interface>`,
    fixExplanation: 'Changer le modèle de carte en "virtio" avec accélération vhost.',
    fixExplanationFr: 'Changer le modèle de carte en "virtio" avec accélération vhost.'
  }
];
