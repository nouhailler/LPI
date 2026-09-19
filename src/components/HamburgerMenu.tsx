import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  LayoutGrid,
  BookOpen,
  HelpCircle,
  Layers,
  Library,
  GraduationCap,
  ChevronRight,
  Sparkles,
  Server,
  ShieldCheck,
  Cpu,
  Database,
  Network,
  Terminal,
  FileCode,
  Flame,
  User,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Check,
  Award,
  ChevronDown,
  Settings,
  RefreshCw,
  Wrench,
  Zap,
} from 'lucide-react';
import { TabType, UserStats } from '../types';
import { CURRENT_APP_VERSION, CURRENT_RELEASE_DATE } from '../utils/updateService';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onSelectLearningTopic: (topicId: string) => void;
  onStartExam: (examId: string) => void;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  userStats: UserStats;
  onOpenDiagnostic?: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  action: () => void;
  keywords?: string[];
  tabTarget?: TabType;
}

interface CategoryGroup {
  id: string;
  categoryName: string;
  categoryDescription: string;
  icon: React.FC<{ className?: string }>;
  items: MenuItem[];
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onSelectLearningTopic,
  onStartExam,
  onOpenProfile,
  onOpenSettings,
  userStats,
  onOpenDiagnostic,
}) => {
  const { t, isFrench } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'core-nav': true,
    'lpic-1': true,
    'lpic-2': true,
    'lpic-3': true,
    'study-tools': true,
    'profile-system': true,
  });

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleAction = (cb: () => void) => {
    cb();
    onClose();
  };

  // Structured categories of all platform features
  const categories: CategoryGroup[] = useMemo(() => [
    {
      id: 'core-nav',
      categoryName: t.hamburger.primaryNav,
      categoryDescription: t.hamburger.primaryNavDesc,
      icon: LayoutGrid,
      items: [
        {
          id: 'nav-dashboard',
          title: isFrench ? 'Vue d\'ensemble & Tableau de bord' : 'Dashboard Overview',
          subtitle: isFrench ? 'Série quotidienne, objectifs et métriques d\'étude' : 'Daily streak, targets & study metrics',
          icon: LayoutGrid,
          badge: isFrench ? `${userStats.streakDays} j de série` : `${userStats.streakDays} Day Streak`,
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'dashboard',
          action: () => onSelectTab('dashboard'),
          keywords: ['home', 'metrics', 'streak', 'progress', 'overview', 'accueil', 'tableau de bord', 'série', 'progression'],
        },
        {
          id: 'nav-diagnostic',
          title: isFrench ? 'Évaluation Diagnostique (20 Q)' : 'Diagnostic Assessment (20 Q)',
          subtitle: isFrench ? 'Matrice de compétences & vos 3 priorités d\'apprentissage' : 'Skills matrix & your top 3 learning priorities',
          icon: Sparkles,
          badge: isFrench ? 'Recommandé' : 'Recommended',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => {
            if (onOpenDiagnostic) onOpenDiagnostic();
          },
          keywords: ['diagnostic', 'test', 'évaluation', 'matrice', 'priorités', 'niveau', 'skills', 'assessment'],
        },
        {
          id: 'nav-learning',
          title: isFrench ? 'Objectifs d\'apprentissage & Programme' : 'Learning Objectives & Syllabus',
          subtitle: isFrench ? 'Programme d\'examen officiel complet avec fiches détaillées' : 'Complete official exam curriculum with deep notes',
          icon: BookOpen,
          badge: 'LPIC-1 / 2 / 3',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'learning',
          action: () => onSelectTab('learning'),
          keywords: ['curriculum', 'topics', 'syllabus', 'study', 'notes', 'quizzes', 'objectifs', 'thèmes', 'cours', 'fiches'],
        },
        {
          id: 'nav-glossary',
          title: isFrench ? 'Glossaire Linux & Index des commandes' : 'Linux Glossary & Command Index',
          subtitle: isFrench ? 'Plus de 1 700 commandes, exemples de syntaxe & fichiers de configuration' : '1,700+ commands, syntax examples & config files',
          icon: Library,
          badge: isFrench ? '1700+ Termes' : '1700+ Terms',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'glossary',
          action: () => onSelectTab('glossary'),
          keywords: ['commands', 'utilities', 'dictionary', 'search', 'syntax', 'manual', 'commandes', 'glossaire', 'dictionnaire', 'syntaxe'],
        },
        {
          id: 'nav-training',
          title: isFrench ? 'Ateliers Pratiques & Mini-Labs' : 'Hands-on Labs & Ateliers Pratiques',
          subtitle: isFrench ? '5 modes pratiques : Texte à trous, Dépannage, Ordonnancement, Appariement & Mini-Labs' : '5 practical modes: Fill-in-the-blank, Troubleshooting, Ordering, Matching & Mini-Labs',
          icon: Zap,
          badge: isFrench ? '5 Ateliers' : '5 Labs',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          tabTarget: 'training',
          action: () => onSelectTab('training'),
          keywords: ['training', 'ateliers', 'labs', 'fill-in-the-blank', 'troubleshooting', 'ordering', 'matching', 'saisie', 'ordonnancement', 'dépannage', 'appariement'],
        },
        {
          id: 'nav-practice',
          title: isFrench ? 'Simulateur d\'Examen Pratique Chronométré' : 'Timed Practice Exam Simulator',
          subtitle: isFrench ? 'Moteur d\'examen réaliste à choix multiples avec notation' : 'Realistic multiple-choice test engine with scoring',
          icon: HelpCircle,
          badge: isFrench ? 'Examen Blanc' : 'Timed Simulator',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          tabTarget: 'practice',
          action: () => onStartExam('exam-101'),
          keywords: ['test', 'exam', 'quiz', 'questions', 'score', 'simulator', 'examen', 'simulation', 'chronométré'],
        },
        {
          id: 'nav-flashcards',
          title: isFrench ? 'Decks de Flashcards Interactives' : 'Interactive Flashcards Decks',
          subtitle: isFrench ? 'Cartes interactives complètes couvrant LPIC-1, LPIC-2 & LPIC-3' : 'Comprehensive interactive cards across LPIC-1, LPIC-2 & LPIC-3',
          icon: Layers,
          badge: isFrench ? 'Cartes' : 'Decks',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          tabTarget: 'flashcards',
          action: () => onSelectTab('flashcards'),
          keywords: ['flashcards', 'cards', 'recall', 'memory', 'flip', '101', '102', '107', '201', '202', '210', 'cartes', 'mémoire', 'révision'],
        },
        {
          id: 'nav-path',
          title: isFrench ? 'Parcours & Échelle de Certification' : 'Certification Career Roadmap',
          subtitle: isFrench ? 'Progression étape par étape de Linux Essentials à LPIC-3' : 'Step-by-step ladder from Essentials to LPIC-3',
          icon: GraduationCap,
          badge: isFrench ? 'Parcours' : 'Roadmap',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'path',
          action: () => onSelectTab('path'),
          keywords: ['roadmap', 'career', 'tiers', 'prerequisites', 'badges', 'parcours', 'carrière', 'échelons'],
        },
      ],
    },
    {
      id: 'lpic-1',
      categoryName: isFrench ? 'LPIC-1 : Administrateur Linux' : 'LPIC-1: Linux Administrator',
      categoryDescription: isFrench ? 'Programme officiel des examens 101-500 et 102-500' : 'Exams 101-500 & 102-500 Core Curriculum',
      icon: Terminal,
      items: [
        {
          id: 'topic-101',
          title: isFrench ? 'Thème 101 : Architecture système' : 'Topic 101: System Architecture',
          subtitle: isFrench ? 'Matériel, BIOS/UEFI, Niveaux d\'exécution, Chargeurs d\'amorçage (GRUB)' : 'Hardware, BIOS/UEFI, Runlevels, Boot Loaders (GRUB)',
          icon: Cpu,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-101'),
          keywords: ['hardware', 'bios', 'uefi', 'grub', 'runlevel', 'systemd', 'init', 'matériel'],
        },
        {
          id: 'topic-102',
          title: isFrench ? 'Thème 102 : Installation de Linux et gestion des paquets' : 'Topic 102: Linux Installation & Packages',
          subtitle: isFrench ? 'Partitionnement, Debian dpkg/apt, RPM & YUM/DNF, Bibliothèques partagées' : 'Partitioning, Debian dpkg/apt, RPM & YUM/DNF, Shared Libs',
          icon: FileCode,
          badge: isFrench ? 'Poids 11' : 'Weight 11',
          action: () => onSelectLearningTopic('topic-102'),
          keywords: ['dpkg', 'apt', 'rpm', 'yum', 'dnf', 'partition', 'install', 'libraries', 'paquets'],
        },
        {
          id: 'topic-103',
          title: isFrench ? 'Thème 103 : Commandes GNU et Unix' : 'Topic 103: GNU & Unix Commands',
          subtitle: isFrench ? 'Flux, tubes, filtres, gestion de fichiers, regex, éditeur vi' : 'Streams, Pipes, Filters, File Management, Regex, vi Editor',
          icon: Terminal,
          badge: isFrench ? 'Poids 26 (Élevé)' : 'Weight 26 (High)',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onSelectLearningTopic('topic-103'),
          keywords: ['grep', 'sed', 'awk', 'tar', 'pipes', 'redirect', 'vi', 'regex', 'filter', 'commandes'],
        },
        {
          id: 'topic-104',
          title: isFrench ? 'Thème 104 : Périphériques, systèmes de fichiers Linux & FHS' : 'Topic 104: Devices, Linux Filesystems & FHS',
          subtitle: isFrench ? 'Montage, partitionnement (fdisk/parted), inœuds, liens, quotas' : 'Mounting, Partitioning (fdisk/parted), Inodes, Links, Quotas',
          icon: Database,
          badge: isFrench ? 'Poids 15' : 'Weight 15',
          action: () => onSelectLearningTopic('topic-104'),
          keywords: ['filesystem', 'mount', 'fstab', 'fdisk', 'parted', 'fhs', 'ext4', 'xfs', 'fichiers', 'système de fichiers'],
        },
        {
          id: 'topic-105',
          title: isFrench ? 'Thème 105 : Shells et scripts shell' : 'Topic 105: Shells & Shell Scripting',
          subtitle: isFrench ? 'Environnement Bash, variables, boucles, conditions, codes de sortie' : 'Bash environment, variables, loops, conditionals, exit codes',
          icon: Terminal,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-105'),
          keywords: ['bash', 'scripts', 'loops', 'variables', 'export', 'aliases', 'functions', 'scripts shell'],
        },
        {
          id: 'topic-106',
          title: isFrench ? 'Thème 106 : Interfaces utilisateur et accessibilité' : 'Topic 106: Interfaces & Accessibility',
          subtitle: isFrench ? 'X11, Wayland, gestionnaires d\'affichage, paramètres d\'accessibilité' : 'X11, Wayland, Display Managers, Accessibility settings',
          icon: Laptop,
          badge: isFrench ? 'Poids 3' : 'Weight 3',
          action: () => onSelectLearningTopic('topic-106'),
          keywords: ['x11', 'wayland', 'display', 'gui', 'accessibility', 'orca', 'accessibilité', 'interface'],
        },
        {
          id: 'topic-107',
          title: isFrench ? 'Thème 107 : Tâches administratives' : 'Topic 107: Administrative Tasks',
          subtitle: isFrench ? 'Utilisateurs & groupes, planification de tâches (cron/at), régionalisation & NTP' : 'Users & Groups, Job scheduling (cron/at), Localization & NTP',
          icon: User,
          badge: isFrench ? 'Poids 12' : 'Weight 12',
          action: () => onSelectLearningTopic('topic-107'),
          keywords: ['cron', 'at', 'users', 'groups', 'shadow', 'ntp', 'systemd-timesyncd', 'utilisateurs', 'groupes'],
        },
        {
          id: 'topic-108',
          title: isFrench ? 'Thème 108 : Services système essentiels' : 'Topic 108: Essential System Services',
          subtitle: isFrench ? 'Heure système, journaux (syslog/journald), bases MTA (Sendmail/Postfix)' : 'System Time, Logging (syslog/journald), MTA Basics (Sendmail/Postfix)',
          icon: Server,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-108'),
          keywords: ['syslog', 'journalctl', 'postfix', 'mta', 'mail', 'cups', 'printing', 'services', 'journaux'],
        },
        {
          id: 'topic-109',
          title: isFrench ? 'Thème 109 : Notions fondamentales du réseau' : 'Topic 109: Networking Fundamentals',
          subtitle: isFrench ? 'IPv4/IPv6, sous-réseaux, routage, résolution DNS, ifconfig/ip' : 'IPv4/IPv6, Subnetting, Routing, DNS resolution, ifconfig/ip',
          icon: Server,
          badge: isFrench ? 'Poids 14' : 'Weight 14',
          action: () => onSelectLearningTopic('topic-109'),
          keywords: ['network', 'ip', 'cidr', 'ipv6', 'routing', 'dns', 'resolv.conf', 'réseau', 'routage'],
        },
        {
          id: 'topic-110',
          title: isFrench ? 'Thème 110 : Sécurité' : 'Topic 110: Security',
          subtitle: isFrench ? 'Sécurité hôte, clés OpenSSH, chiffrement GPG, Sudo & ports' : 'Host security, OpenSSH keys, GPG encryption, Sudo & ports',
          icon: ShieldCheck,
          badge: isFrench ? 'Poids 7' : 'Weight 7',
          action: () => onSelectLearningTopic('topic-110'),
          keywords: ['ssh', 'gpg', 'sudo', 'ports', 'netstat', 'ss', 'firewall', 'security', 'sécurité'],
        },
      ],
    },
    {
      id: 'lpic-2',
      categoryName: isFrench ? 'LPIC-2 : Ingénieur Linux' : 'LPIC-2: Linux Engineer',
      categoryDescription: isFrench ? 'Examens 201-450 et 202-450 — Ingénierie Linux avancée' : 'Exams 201-450 & 202-450 Advanced Engineering',
      icon: Server,
      items: [
        {
          id: 'topic-200',
          title: isFrench ? 'Thème 200 : Planification des capacités' : 'Topic 200: Capacity Planning',
          subtitle: isFrench ? 'Surveillance des ressources, iostat, vmstat, sar, collecte de benchmarks' : 'Resource monitoring, iostat, vmstat, sar, collecting benchmarks',
          icon: Cpu,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-200'),
          keywords: ['capacity', 'iostat', 'vmstat', 'sar', 'top', 'memory', 'bottlenecks', 'capacités'],
        },
        {
          id: 'topic-201',
          title: isFrench ? 'Thème 201 : Le noyau Linux' : 'Topic 201: The Linux Kernel',
          subtitle: isFrench ? 'Modules du noyau, réglages sysctl, DKMS, règles matérielles udev' : 'Kernel modules, sysctl runtime tuning, DKMS, udev hardware rules',
          icon: Cpu,
          badge: isFrench ? 'Poids 10' : 'Weight 10',
          action: () => onSelectLearningTopic('topic-201'),
          keywords: ['kernel', 'modules', 'lsmod', 'modprobe', 'sysctl', 'udev', 'noyau'],
        },
        {
          id: 'topic-202',
          title: isFrench ? 'Thème 202 : Démarrage du système' : 'Topic 202: System Startup',
          subtitle: isFrench ? 'Cibles systemd, fichiers unit, scripts init SysV & mode récupération' : 'Systemd targets, unit files, SysV init scripts & recovery mode',
          icon: Terminal,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-202'),
          keywords: ['systemd', 'targets', 'units', 'recovery', 'grub2', 'dracut', 'démarrage'],
        },
        {
          id: 'topic-203',
          title: isFrench ? 'Thème 203 : Systèmes de fichiers et périphériques' : 'Topic 203: Filesystem and Devices',
          subtitle: isFrench ? 'Maintenance ext4/XFS/Btrfs, montage automatique autofs, swap, FUSE/ZFS' : 'ext4/XFS/Btrfs maintenance, autofs automounting, swap tuning, FUSE/ZFS',
          icon: Database,
          badge: isFrench ? 'Poids 8' : 'Weight 8',
          action: () => onSelectLearningTopic('topic-203'),
          keywords: ['fstab', 'autofs', 'ext4', 'xfs', 'btrfs', 'swap', 'fuse', 'zfs', 'smartctl'],
        },
        {
          id: 'topic-204',
          title: isFrench ? 'Thème 204 : Stockage avancé & LVM' : 'Topic 204: Advanced Storage & LVM',
          subtitle: isFrench ? 'LVM (PV/VG/LV), RAID logiciel (mdadm), diagnostics disques SMART' : 'LVM (PV/VG/LV), Software RAID (mdadm), SMART disk diagnostics',
          icon: Database,
          badge: isFrench ? 'Poids 11' : 'Weight 11',
          action: () => onSelectLearningTopic('topic-204'),
          keywords: ['lvm', 'pvcreate', 'vgcreate', 'lvcreate', 'raid', 'mdadm', 'smartctl', 'stockage'],
        },
        {
          id: 'topic-205',
          title: isFrench ? 'Thème 205 : Configuration réseau' : 'Topic 205: Network Configuration',
          subtitle: isFrench ? 'Configuration IP avancée, agrégation (bonding), Wi-Fi, routage & diagnostic' : 'Basic & advanced IP configuration, bonding, wireless, routing & troubleshooting',
          icon: Network,
          badge: isFrench ? 'Poids 11' : 'Weight 11',
          action: () => onSelectLearningTopic('topic-205'),
          keywords: ['network', 'ip', 'route', 'bonding', 'bridge', 'vlan', 'wpa_supplicant', 'tcpdump', 'wireshark', 'nc', 'réseau'],
        },
        {
          id: 'topic-206',
          title: isFrench ? 'Thème 206 : Maintenance du système' : 'Topic 206: System Maintenance',
          subtitle: isFrench ? 'Compilation des sources, gestion des patchs, stratégies de sauvegarde & notifications' : 'Source compilation, patch management, backup strategies & user notifications',
          icon: Wrench,
          badge: isFrench ? 'Poids 6' : 'Weight 6',
          action: () => onSelectLearningTopic('topic-206'),
          keywords: ['make', 'cmake', 'patch', 'ldconfig', 'tar', 'rsync', 'dd', 'cpio', 'wall', 'shutdown', 'issue', 'motd', 'nologin', 'maintenance'],
        },
        {
          id: 'topic-207',
          title: isFrench ? 'Thème 207 : Serveur de noms de domaine (BIND 9)' : 'Topic 207: Domain Name Server (BIND 9)',
          subtitle: isFrench ? 'DNS autoritaire & cache, named.conf, fichiers de zone, DNSSEC' : 'Authoritative & Caching DNS, named.conf, Zone files, DNSSEC',
          icon: Server,
          badge: isFrench ? 'Poids 12' : 'Weight 12',
          action: () => onSelectLearningTopic('topic-207'),
          keywords: ['dns', 'bind', 'named', 'zone', 'dnssec', 'dig', 'nslookup'],
        },
        {
          id: 'topic-208',
          title: isFrench ? 'Thème 208 : Services Web' : 'Topic 208: Web Services',
          subtitle: isFrench ? 'Apache2, HTTPS/TLS, proxy cache Squid & reverse proxy Nginx' : 'Apache2, HTTPS/TLS, Squid caching proxy & Nginx reverse proxy',
          icon: Server,
          badge: isFrench ? 'Poids 12' : 'Weight 12',
          action: () => onSelectLearningTopic('topic-208'),
          keywords: ['apache', 'httpd', 'nginx', 'ssl', 'tls', 'virtualhost', 'squid', 'proxy', 'reverse proxy', 'certbot', 'openssl'],
        },
        {
          id: 'topic-209',
          title: isFrench ? 'Thème 209 : Partage de fichiers (Samba & NFS)' : 'Topic 209: File Sharing (Samba & NFS)',
          subtitle: isFrench ? 'Partages SMB, smb.conf, exports NFSv4, options de montage, mappage utilisateurs' : 'SMB shares, smb.conf, NFSv4 exports, mount options, user mapping',
          icon: Database,
          badge: isFrench ? 'Poids 9' : 'Weight 9',
          action: () => onSelectLearningTopic('topic-209'),
          keywords: ['samba', 'smb', 'nfs', 'exports', 'nfs4', 'cifs', 'shares', 'partage'],
        },
        {
          id: 'topic-210',
          title: isFrench ? 'Thème 210 : Gestion des clients réseau' : 'Topic 210: Network Client Management',
          subtitle: isFrench ? 'Configuration serveur & client DHCP, authentification PAM, client LDAP & SSSD' : 'DHCP server & client config, PAM authentication, LDAP client & SSSD',
          icon: ShieldCheck,
          badge: isFrench ? 'Poids 7' : 'Weight 7',
          action: () => onSelectLearningTopic('topic-210'),
          keywords: ['dhcp', 'dhcpd', 'dhclient', 'pam', 'pam.d', 'ldap', 'ldapsearch', 'sssd', 'nsswitch'],
        },
        {
          id: 'topic-212',
          title: isFrench ? 'Thème 212 : Sécurité du système & Pare-feu' : 'Topic 212: System Security & Firewalls',
          subtitle: isFrench ? 'Netfilter/iptables, nftables, fail2ban, OpenVPN, IDS Snort' : 'Netfilter/iptables, nftables, fail2ban, OpenVPN, Snort IDS',
          icon: ShieldCheck,
          badge: isFrench ? 'Poids 9' : 'Weight 9',
          action: () => onSelectLearningTopic('topic-212'),
          keywords: ['iptables', 'nftables', 'vpn', 'fail2ban', 'ids', 'firewall', 'pare-feu'],
        },
      ],
    },
    {
      id: 'lpic-3',
      categoryName: isFrench ? 'LPIC-3 : Spécialisations Entreprise' : 'LPIC-3: Enterprise Specialties',
      categoryDescription: isFrench ? 'Certifications professionnelles de niveau expert' : 'Senior Level Specialized Enterprise Certifications',
      icon: Award,
      items: [
        {
          id: 'topic-300',
          title: isFrench ? 'Examen 300 : Environnements mixtes' : 'Exam 300: Mixed Environment',
          subtitle: isFrench ? 'Annuaires OpenLDAP, contrôleur de domaine Samba AD, Kerberos & Winbind' : 'OpenLDAP directories, Samba AD Domain Controller, Kerberos & Winbind',
          icon: Database,
          badge: 'LPIC-3 300',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-301'),
          keywords: ['ldap', 'openldap', 'samba-tool', 'active directory', 'kerberos', 'winbind'],
        },
        {
          id: 'topic-303',
          title: isFrench ? 'Examen 303 : Sécurité d\'entreprise' : 'Exam 303: Enterprise Security',
          subtitle: isFrench ? 'Chiffrement LUKS2, politiques AppArmor & SELinux, Auditd, FreeIPA' : 'LUKS2 encryption, AppArmor, SELinux policies, Auditd, FreeIPA',
          icon: ShieldCheck,
          badge: 'LPIC-3 303',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-325'),
          keywords: ['luks', 'cryptsetup', 'selinux', 'apparmor', 'auditd', 'certificates', 'pki', 'sécurité'],
        },
        {
          id: 'topic-305',
          title: isFrench ? 'Examen 305 : Virtualisation & Conteneurs' : 'Exam 305: Virtualization & Containers',
          subtitle: isFrench ? 'QEMU/KVM, Libvirt, LXC, Docker, Podman, Vagrant, Packer' : 'QEMU/KVM, Libvirt, LXC, Docker, Podman, Vagrant, Packer',
          icon: Server,
          badge: 'LPIC-3 305',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-351'),
          keywords: ['kvm', 'qemu', 'libvirt', 'docker', 'podman', 'lxc', 'vagrant', 'packer', 'virtualisation', 'conteneurs'],
        },
        {
          id: 'topic-306',
          title: isFrench ? 'Examen 306 : Haute disponibilité & Clusters' : 'Exam 306: High Availability & Clusters',
          subtitle: isFrench ? 'Pacemaker, Corosync, réplication DRBD, stockage Ceph, HAProxy, Keepalived' : 'Pacemaker, Corosync, DRBD replication, Ceph storage, HAProxy, Keepalived',
          icon: Database,
          badge: 'LPIC-3 306',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-361'),
          keywords: ['pacemaker', 'corosync', 'drbd', 'ceph', 'haproxy', 'keepalived', 'cluster', 'haute disponibilité'],
        },
      ],
    },
    {
      id: 'study-tools',
      categoryName: isFrench ? 'Outils d\'entraînement & Examens' : 'Specialized Practice & Testing Tools',
      categoryDescription: isFrench ? 'Outils de révision active et consolidation des connaissances' : 'Active recall and knowledge reinforcement utilities',
      icon: Sparkles,
      items: [
        {
          id: 'tool-exam-101',
          title: isFrench ? 'Simulateur Examen LPIC-1 101' : 'LPIC-1 Exam 101 Simulator',
          subtitle: isFrench ? 'Test chronométré de 45 minutes sur les thèmes 101 à 104' : 'Launch a 45-minute timed test on Topics 101–104',
          icon: HelpCircle,
          badge: isFrench ? 'Examen 101' : 'Exam 101',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-101'),
          keywords: ['practice', 'exam', '101', 'simulator', 'test', 'examen'],
        },
        {
          id: 'tool-exam-102',
          title: isFrench ? 'Simulateur Examen LPIC-1 102' : 'LPIC-1 Exam 102 Simulator',
          subtitle: isFrench ? 'Test chronométré de 45 minutes sur les thèmes 105 à 110' : 'Launch a 45-minute timed test on Topics 105–110',
          icon: HelpCircle,
          badge: isFrench ? 'Examen 102' : 'Exam 102',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-102'),
          keywords: ['practice', 'exam', '102', 'simulator', 'test', 'examen'],
        },
        {
          id: 'tool-exam-201',
          title: isFrench ? 'Simulateur Examen LPIC-2 201' : 'LPIC-2 Exam 201 Simulator',
          subtitle: isFrench ? 'Simulation d\'examen Ingénieur Linux avancé' : 'Advanced Linux Engineer test simulation',
          icon: HelpCircle,
          badge: isFrench ? 'Examen 201' : 'Exam 201',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-201'),
          keywords: ['practice', 'exam', '201', 'simulator', 'test', 'examen'],
        },
        {
          id: 'tool-flashcards-deck',
          title: isFrench ? 'Révision rapide par Flashcards' : 'Quick Flashcards Review',
          subtitle: isFrench ? 'Testez les commandes Linux essentielles avec les cartes mémoires' : 'Test essential Linux commands with interactive cards',
          icon: Layers,
          badge: isFrench ? 'Cartes' : 'Deck',
          action: () => onSelectTab('flashcards'),
          keywords: ['flashcards', 'cards', 'recall', 'commands', 'cartes'],
        },
        {
          id: 'tool-glossary-search',
          title: isFrench ? 'Rechercher commandes & configs' : 'Search Linux Commands & Configs',
          subtitle: isFrench ? 'Recherche rapide avec commandes terminal prêtes à copier' : 'Quick lookup with copyable terminal syntax snippets',
          icon: Library,
          badge: isFrench ? 'Glossaire' : 'Search',
          action: () => onSelectTab('glossary'),
          keywords: ['glossary', 'commands', 'search', 'manual', 'config', 'commandes'],
        },
      ],
    },
    {
      id: 'profile-system',
      categoryName: isFrench ? 'Profil, Paramètres & Infos application' : 'Profile, Settings & Application Info',
      categoryDescription: isFrench ? 'Statistiques utilisateur, mises à jour, détails de version & PWA' : 'User achievements, automatic updates, version details & install instructions',
      icon: User,
      items: [
        {
          id: 'item-settings',
          title: isFrench ? 'Paramètres, Mises à jour & Version' : 'Settings, Updates & Version Info',
          subtitle: isFrench
            ? `Version actuelle v${CURRENT_APP_VERSION} (${CURRENT_RELEASE_DATE}) • Forcer la mise à jour`
            : `Current release v${CURRENT_APP_VERSION} (${CURRENT_RELEASE_DATE}) • Force updates`,
          icon: Settings,
          badge: `v${CURRENT_APP_VERSION}`,
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => {
            if (onOpenSettings) {
              onOpenSettings();
            } else {
              onOpenProfile();
            }
          },
          keywords: ['settings', 'update', 'version', 'force update', 'release', 'cache', 'system', 'preferences', 'paramètres', 'mises à jour'],
        },
        {
          id: 'item-profile',
          title: isFrench ? 'Profil d\'étude & Statistiques' : 'Study Profile & Statistics',
          subtitle: isFrench ? 'Consultez la série, vos objectifs du jour et votre historique' : 'View streak metrics, goal progress & milestone history',
          icon: User,
          badge: isFrench ? 'Mes stats' : 'User Stats',
          action: () => onOpenProfile(),
          keywords: ['profile', 'stats', 'streak', 'user', 'settings', 'goal', 'profil', 'statistiques'],
        },
        {
          id: 'item-pwa',
          title: isFrench ? 'Installer comme application Bureau / Mobile (PWA)' : 'Install as Desktop / Mobile App (PWA)',
          subtitle: isFrench ? 'Installez l\'application pour réviser en plein écran même hors-ligne' : 'Learn how to install for full-screen standalone study',
          icon: Laptop,
          badge: isFrench ? 'PWA Prête' : 'PWA Ready',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => {
            alert(
              isFrench
                ? 'Pour installer l\'application :\n\n• Chrome / Edge (Bureau) : Cliquez sur l\'icône d\'installation dans la barre d\'adresse.\n• Safari (iOS) : Appuyez sur Partager puis sélectionnez "Sur l\'écran d\'accueil".\n• Chrome (Android) : Ouvrez le menu et appuyez sur "Installer l\'application".'
                : 'To install as an app:\n\n• Chrome/Edge (Desktop): Click the install icon in the URL bar.\n• Safari (iOS): Tap the Share icon and choose "Add to Home Screen".\n• Chrome (Android): Tap the menu and select "Install App".'
            );
          },
          keywords: ['install', 'pwa', 'desktop', 'mobile', 'offline', 'standalone', 'installer'],
        },
      ],
    },
  ], [userStats, onSelectTab, onSelectLearningTopic, onStartExam, onOpenProfile, onOpenSettings, isFrench, t]);

  // Filter categories and items based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();

    return categories.map((cat) => {
      const matchingItems = cat.items.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const subMatch = item.subtitle?.toLowerCase().includes(q);
        const badgeMatch = item.badge?.toLowerCase().includes(q);
        const kwMatch = item.keywords?.some((kw) => kw.toLowerCase().includes(q));
        return titleMatch || subMatch || badgeMatch || kwMatch;
      });

      return {
        ...cat,
        items: matchingItems,
      };
    }).filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      id="hamburger-menu-drawer"
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-[#201b11]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative flex flex-col w-full max-w-md md:max-w-lg bg-[#fff8f2] h-full shadow-2xl z-10 border-r border-[#d3c5ab] transform transition-transform duration-200 ease-out flex-shrink-0">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#d3c5ab] bg-[#fff8f2] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/app-logo.jpg"
              alt="LPI Prep Logo"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg object-cover border border-[#d3c5ab] shadow-xs"
            />
            <div>
              <h2 id="menu-title" className="font-sans font-bold text-base md:text-lg text-[#785a00]">
                {t.hamburger.menuTitle}
              </h2>
              <p className="text-[11px] text-[#4f4632]">
                {t.hamburger.searchHint}
              </p>
            </div>
          </div>

          <button
            id="close-hamburger-menu-btn"
            onClick={onClose}
            aria-label={t.common.close}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#4f4632] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Language Selector inside menu */}
        <div className="p-3 bg-[#f8ecdb]/60 border-b border-[#d3c5ab] shrink-0 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hamburger.searchPlaceholder}
              className="w-full bg-[#fff8f2] border border-[#d3c5ab] rounded-lg pl-9 pr-8 py-2 text-xs md:text-sm text-[#201b11] placeholder-[#817660] focus:outline-hidden focus:border-[#785a00] focus:ring-1 focus:ring-[#785a00]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#817660] hover:text-[#201b11]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Language Selector in Drawer */}
          <div className="pt-0.5">
            <LanguageSelector variant="drawer" />
          </div>
        </div>

        {/* Scrollable Category List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#4f4632]">
              <Search className="w-8 h-8 text-[#817660] mx-auto mb-2 opacity-50" />
              <div className="font-bold text-sm text-[#201b11]">
                {isFrench ? 'Aucune fonctionnalité correspondante' : 'No matching features found'}
              </div>
              <p className="text-xs text-[#817660] mt-1">
                {isFrench
                  ? 'Essayez de chercher un autre sujet (ex. « GRUB », « RAID », « 101 », « Sécurité »)'
                  : 'Try searching for another topic (e.g., "GRUB", "RAID", "101", "Security")'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 bg-[#ebdcc8] text-[#785a00] text-xs font-bold rounded-md hover:bg-[#d3c5ab]"
              >
                {isFrench ? 'Effacer la recherche' : 'Clear Search'}
              </button>
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const CategoryIcon = cat.icon;
              const isExpanded = searchQuery ? true : expandedCategories[cat.id] ?? true;

              return (
                <div key={cat.id} className="space-y-2">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] border border-[#d3c5ab] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0">
                        <CategoryIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs md:text-sm text-[#201b11] truncate">
                          {cat.categoryName}
                        </div>
                        <div className="text-[10px] text-[#4f4632] truncate">
                          {cat.categoryDescription}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded">
                        {cat.items.length}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#817660] transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-1.5 pl-2">
                      {cat.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isCurrentTab = item.tabTarget && currentTab === item.tabTarget;

                        return (
                          <button
                            key={item.id}
                            id={`menu-item-${item.id}`}
                            onClick={() => handleAction(item.action)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left cursor-pointer group ${
                              isCurrentTab
                                ? 'bg-[#ffc20e] border-[#ebdcc8] text-[#6d5100] shadow-xs'
                                : 'bg-[#fff8f2] hover:bg-[#f8ecdb] border-[#ebdcc8] text-[#201b11]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                  isCurrentTab
                                    ? 'bg-[#6d5100] text-[#ffc20e]'
                                    : 'bg-[#ebdcc8] text-[#785a00] group-hover:bg-[#ffc20e] group-hover:text-[#6d5100]'
                                }`}
                              >
                                <ItemIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs md:text-sm truncate">
                                  {item.title}
                                </div>
                                {item.subtitle && (
                                  <div
                                    className={`text-[11px] truncate ${
                                      isCurrentTab ? 'text-[#6d5100]' : 'text-[#817660]'
                                    }`}
                                  >
                                    {item.subtitle}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {item.badge && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isCurrentTab
                                      ? 'bg-[#6d5100] text-[#ffc20e]'
                                      : item.badgeColor || 'bg-[#ebdcc8] text-[#785a00]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight
                                className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                                  isCurrentTab ? 'text-[#6d5100]' : 'text-[#817660]'
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Quick Streak summary */}
        <div className="p-3.5 border-t border-[#d3c5ab] bg-[#f8ecdb] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#ffc20e] text-[#6d5100] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#201b11]">
                {userStats.streakDays} {t.common.days} • {t.hamburger.studyStreak}
              </div>
              <div className="text-[10px] text-[#4f4632]">
                {t.common.goal}: {userStats.questionsDoneToday}/{userStats.dailyGoal} {t.common.questions.toLowerCase()}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAction(onOpenProfile)}
            className="px-3 py-1.5 bg-[#fff8f2] border border-[#d3c5ab] rounded-lg text-xs font-bold text-[#785a00] hover:bg-[#ebdcc8] transition-colors cursor-pointer"
          >
            {t.hamburger.myStats}
          </button>
        </div>
      </div>
    </div>
  );
};
