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
  RefreshCw
} from 'lucide-react';
import { TabType, UserStats } from '../types';
import { CURRENT_APP_VERSION, CURRENT_RELEASE_DATE } from '../utils/updateService';

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
}) => {
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
      categoryName: 'Primary Navigation',
      categoryDescription: 'Core platform workspaces and review modules',
      icon: LayoutGrid,
      items: [
        {
          id: 'nav-dashboard',
          title: 'Dashboard Overview',
          subtitle: 'Daily streak, targets & study metrics',
          icon: LayoutGrid,
          badge: `${userStats.streakDays} Day Streak`,
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'dashboard',
          action: () => onSelectTab('dashboard'),
          keywords: ['home', 'metrics', 'streak', 'progress', 'overview'],
        },
        {
          id: 'nav-learning',
          title: 'Learning Objectives & Syllabus',
          subtitle: 'Complete official exam curriculum with deep notes',
          icon: BookOpen,
          badge: 'LPIC-1 / 2 / 3',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'learning',
          action: () => onSelectTab('learning'),
          keywords: ['curriculum', 'topics', 'syllabus', 'study', 'notes', 'quizzes'],
        },
        {
          id: 'nav-glossary',
          title: 'Linux Glossary & Command Index',
          subtitle: '1,700+ commands, syntax examples & config files',
          icon: Library,
          badge: '1700+ Terms',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'glossary',
          action: () => onSelectTab('glossary'),
          keywords: ['commands', 'utilities', 'dictionary', 'search', 'syntax', 'manual'],
        },
        {
          id: 'nav-practice',
          title: 'Timed Practice Exam Simulator',
          subtitle: 'Realistic multiple-choice test engine with scoring',
          icon: HelpCircle,
          badge: 'Timed Simulator',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          tabTarget: 'practice',
          action: () => onStartExam('exam-101'),
          keywords: ['test', 'exam', 'quiz', 'questions', 'score', 'simulator'],
        },
        {
          id: 'nav-flashcards',
          title: 'Interactive Flashcards (Topic 101)',
          subtitle: '100 3D interactive cards for LPIC-1 System Architecture',
          icon: Layers,
          badge: '100 Topic 101 Cards',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          tabTarget: 'flashcards',
          action: () => onSelectTab('flashcards'),
          keywords: ['flashcards', 'cards', 'recall', 'memory', 'flip', '101', 'topic 101'],
        },
        {
          id: 'nav-path',
          title: 'Certification Career Roadmap',
          subtitle: 'Step-by-step ladder from Essentials to LPIC-3',
          icon: GraduationCap,
          badge: 'Roadmap',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          tabTarget: 'path',
          action: () => onSelectTab('path'),
          keywords: ['roadmap', 'career', 'tiers', 'prerequisites', 'badges'],
        },
      ],
    },
    {
      id: 'lpic-1',
      categoryName: 'LPIC-1: Linux Administrator',
      categoryDescription: 'Exams 101-500 & 102-500 Core Curriculum',
      icon: Terminal,
      items: [
        {
          id: 'topic-101',
          title: 'Topic 101: System Architecture',
          subtitle: 'Hardware, BIOS/UEFI, Runlevels, Boot Loaders (GRUB)',
          icon: Cpu,
          badge: 'Weight 8',
          action: () => onSelectLearningTopic('topic-101'),
          keywords: ['hardware', 'bios', 'uefi', 'grub', 'runlevel', 'systemd', 'init'],
        },
        {
          id: 'topic-102',
          title: 'Topic 102: Linux Installation & Packages',
          subtitle: 'Partitioning, Debian dpkg/apt, RPM & YUM/DNF, Shared Libs',
          icon: FileCode,
          badge: 'Weight 11',
          action: () => onSelectLearningTopic('topic-102'),
          keywords: ['dpkg', 'apt', 'rpm', 'yum', 'dnf', 'partition', 'install', 'libraries'],
        },
        {
          id: 'topic-103',
          title: 'Topic 103: GNU & Unix Commands',
          subtitle: 'Streams, Pipes, Filters, File Management, Regex, vi Editor',
          icon: Terminal,
          badge: 'Weight 26 (High)',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onSelectLearningTopic('topic-103'),
          keywords: ['grep', 'sed', 'awk', 'tar', 'pipes', 'redirect', 'vi', 'regex', 'filter'],
        },
        {
          id: 'topic-104',
          title: 'Topic 104: Devices, Linux Filesystems & FHS',
          subtitle: 'Mounting, Partitioning (fdisk/parted), Inodes, Links, Quotas',
          icon: Database,
          badge: 'Weight 15',
          action: () => onSelectLearningTopic('topic-104'),
          keywords: ['filesystem', 'mount', 'fstab', 'fdisk', 'parted', 'fhs', 'ext4', 'xfs'],
        },
        {
          id: 'topic-105',
          title: 'Topic 105: Shells & Shell Scripting',
          subtitle: 'Bash environment, variables, loops, conditionals, exit codes',
          icon: Terminal,
          badge: 'Weight 8',
          action: () => onSelectLearningTopic('topic-105'),
          keywords: ['bash', 'scripts', 'loops', 'variables', 'export', 'aliases', 'functions'],
        },
        {
          id: 'topic-106',
          title: 'Topic 106: Interfaces & Accessibility',
          subtitle: 'X11, Wayland, Display Managers, Accessibility settings',
          icon: Laptop,
          badge: 'Weight 3',
          action: () => onSelectLearningTopic('topic-106'),
          keywords: ['x11', 'wayland', 'display', 'gui', 'accessibility', 'orca'],
        },
        {
          id: 'topic-107',
          title: 'Topic 107: Administrative Tasks',
          subtitle: 'Users & Groups, Job scheduling (cron/at), Localization & NTP',
          icon: User,
          badge: 'Weight 12',
          action: () => onSelectLearningTopic('topic-107'),
          keywords: ['cron', 'at', 'users', 'groups', 'shadow', 'ntp', 'systemd-timesyncd'],
        },
        {
          id: 'topic-108',
          title: 'Topic 108: Essential System Services',
          subtitle: 'System Time, Logging (syslog/journald), MTA Basics (Sendmail/Postfix)',
          icon: Server,
          badge: 'Weight 8',
          action: () => onSelectLearningTopic('topic-108'),
          keywords: ['syslog', 'journalctl', 'postfix', 'mta', 'mail', 'cups', 'printing'],
        },
        {
          id: 'topic-109',
          title: 'Topic 109: Networking Fundamentals',
          subtitle: 'IPv4/IPv6, Subnetting, Routing, DNS resolution, ifconfig/ip',
          icon: Server,
          badge: 'Weight 14',
          action: () => onSelectLearningTopic('topic-109'),
          keywords: ['network', 'ip', 'cidr', 'ipv6', 'routing', 'dns', 'resolv.conf'],
        },
        {
          id: 'topic-110',
          title: 'Topic 110: Security',
          subtitle: 'Host security, OpenSSH keys, GPG encryption, Sudo & ports',
          icon: ShieldCheck,
          badge: 'Weight 7',
          action: () => onSelectLearningTopic('topic-110'),
          keywords: ['ssh', 'gpg', 'sudo', 'ports', 'netstat', 'ss', 'firewall', 'security'],
        },
      ],
    },
    {
      id: 'lpic-2',
      categoryName: 'LPIC-2: Linux Engineer',
      categoryDescription: 'Exams 201-450 & 202-450 Advanced Engineering',
      icon: Server,
      items: [
        {
          id: 'topic-200',
          title: 'Topic 200: Capacity Planning',
          subtitle: 'Resource monitoring, iostat, vmstat, sar, collecting benchmarks',
          icon: Cpu,
          badge: 'Weight 8',
          action: () => onSelectLearningTopic('topic-200'),
          keywords: ['capacity', 'iostat', 'vmstat', 'sar', 'top', 'memory', 'bottlenecks'],
        },
        {
          id: 'topic-201',
          title: 'Topic 201: The Linux Kernel',
          subtitle: 'Kernel modules, sysctl runtime tuning, DKMS, udev hardware rules',
          icon: Cpu,
          badge: 'Weight 10',
          action: () => onSelectLearningTopic('topic-201'),
          keywords: ['kernel', 'modules', 'lsmod', 'modprobe', 'sysctl', 'udev'],
        },
        {
          id: 'topic-202',
          title: 'Topic 202: System Startup',
          subtitle: 'Systemd targets, unit files, SysV init scripts & recovery mode',
          icon: Terminal,
          badge: 'Weight 8',
          action: () => onSelectLearningTopic('topic-202'),
          keywords: ['systemd', 'targets', 'units', 'recovery', 'grub2', 'dracut'],
        },
        {
          id: 'topic-204',
          title: 'Topic 204: Advanced Storage & LVM',
          subtitle: 'LVM (PV/VG/LV), Software RAID (mdadm), SMART disk diagnostics',
          icon: Database,
          badge: 'Weight 11',
          action: () => onSelectLearningTopic('topic-204'),
          keywords: ['lvm', 'pvcreate', 'vgcreate', 'lvcreate', 'raid', 'mdadm', 'smartctl'],
        },
        {
          id: 'topic-207',
          title: 'Topic 207: Domain Name Server (BIND 9)',
          subtitle: 'Authoritative & Caching DNS, named.conf, Zone files, DNSSEC',
          icon: Server,
          badge: 'Weight 12',
          action: () => onSelectLearningTopic('topic-207'),
          keywords: ['dns', 'bind', 'named', 'zone', 'dnssec', 'dig', 'nslookup'],
        },
        {
          id: 'topic-208',
          title: 'Topic 208: Web Services (Apache & Nginx)',
          subtitle: 'VirtualHosts, Reverse proxying, TLS/SSL certificates, mod_rewrite',
          icon: Server,
          badge: 'Weight 10',
          action: () => onSelectLearningTopic('topic-208'),
          keywords: ['apache', 'httpd', 'nginx', 'ssl', 'tls', 'virtualhost', 'proxy'],
        },
        {
          id: 'topic-209',
          title: 'Topic 209: File Sharing (Samba & NFS)',
          subtitle: 'SMB shares, smb.conf, NFSv4 exports, mount options, user mapping',
          icon: Database,
          badge: 'Weight 9',
          action: () => onSelectLearningTopic('topic-209'),
          keywords: ['samba', 'smb', 'nfs', 'exports', 'nfs4', 'cifs', 'shares'],
        },
        {
          id: 'topic-212',
          title: 'Topic 212: System Security & Firewalls',
          subtitle: 'Netfilter/iptables, nftables, fail2ban, OpenVPN, Snort IDS',
          icon: ShieldCheck,
          badge: 'Weight 9',
          action: () => onSelectLearningTopic('topic-212'),
          keywords: ['iptables', 'nftables', 'vpn', 'fail2ban', 'ids', 'firewall'],
        },
      ],
    },
    {
      id: 'lpic-3',
      categoryName: 'LPIC-3: Enterprise Specialties',
      categoryDescription: 'Senior Level Specialized Enterprise Certifications',
      icon: Award,
      items: [
        {
          id: 'topic-300',
          title: 'Exam 300: Mixed Environment',
          subtitle: 'OpenLDAP directories, Samba AD Domain Controller, Kerberos & Winbind',
          icon: Database,
          badge: 'Enterprise 300',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-301'),
          keywords: ['ldap', 'openldap', 'samba-tool', 'active directory', 'kerberos', 'winbind'],
        },
        {
          id: 'topic-303',
          title: 'Exam 303: Enterprise Security',
          subtitle: 'LUKS2 encryption, AppArmor, SELinux policies, Auditd, FreeIPA',
          icon: ShieldCheck,
          badge: 'Enterprise 303',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-325'),
          keywords: ['luks', 'cryptsetup', 'selinux', 'apparmor', 'auditd', 'certificates', 'pki'],
        },
        {
          id: 'topic-305',
          title: 'Exam 305: Virtualization & Containers',
          subtitle: 'QEMU/KVM, Libvirt, LXC, Docker, Podman, Vagrant, Packer',
          icon: Server,
          badge: 'Enterprise 305',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-351'),
          keywords: ['kvm', 'qemu', 'libvirt', 'docker', 'podman', 'lxc', 'vagrant', 'packer'],
        },
        {
          id: 'topic-306',
          title: 'Exam 306: High Availability & Clusters',
          subtitle: 'Pacemaker, Corosync, DRBD replication, Ceph storage, HAProxy, Keepalived',
          icon: Database,
          badge: 'Enterprise 306',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => onSelectLearningTopic('topic-361'),
          keywords: ['pacemaker', 'corosync', 'drbd', 'ceph', 'haproxy', 'keepalived', 'cluster'],
        },
      ],
    },
    {
      id: 'study-tools',
      categoryName: 'Specialized Practice & Testing Tools',
      categoryDescription: 'Active recall and knowledge reinforcement utilities',
      icon: Sparkles,
      items: [
        {
          id: 'tool-exam-101',
          title: 'LPIC-1 Exam 101 Simulator',
          subtitle: 'Launch a 45-minute timed test on Topics 101–104',
          icon: HelpCircle,
          badge: 'Exam 101',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-101'),
          keywords: ['practice', 'exam', '101', 'simulator', 'test'],
        },
        {
          id: 'tool-exam-102',
          title: 'LPIC-1 Exam 102 Simulator',
          subtitle: 'Launch a 45-minute timed test on Topics 105–110',
          icon: HelpCircle,
          badge: 'Exam 102',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-102'),
          keywords: ['practice', 'exam', '102', 'simulator', 'test'],
        },
        {
          id: 'tool-exam-201',
          title: 'LPIC-2 Exam 201 Simulator',
          subtitle: 'Advanced Linux Engineer test simulation',
          icon: HelpCircle,
          badge: 'Exam 201',
          badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
          action: () => onStartExam('exam-201'),
          keywords: ['practice', 'exam', '201', 'simulator', 'test'],
        },
        {
          id: 'tool-flashcards-deck',
          title: 'Quick Flashcards Review',
          subtitle: 'Test essential Linux commands with interactive cards',
          icon: Layers,
          badge: 'Deck',
          action: () => onSelectTab('flashcards'),
          keywords: ['flashcards', 'cards', 'recall', 'commands'],
        },
        {
          id: 'tool-glossary-search',
          title: 'Search Linux Commands & Configs',
          subtitle: 'Quick lookup with copyable terminal syntax snippets',
          icon: Library,
          badge: 'Search',
          action: () => onSelectTab('glossary'),
          keywords: ['glossary', 'commands', 'search', 'manual', 'config'],
        },
      ],
    },
    {
      id: 'profile-system',
      categoryName: 'Profile, Settings & Application Info',
      categoryDescription: 'User achievements, automatic updates, version details & install instructions',
      icon: User,
      items: [
        {
          id: 'item-settings',
          title: 'Settings, Updates & Version Info',
          subtitle: `Current release v${CURRENT_APP_VERSION} (${CURRENT_RELEASE_DATE}) • Force updates`,
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
          keywords: ['settings', 'update', 'version', 'force update', 'release', 'cache', 'system', 'preferences'],
        },
        {
          id: 'item-profile',
          title: 'Study Profile & Statistics',
          subtitle: 'View streak metrics, goal progress & milestone history',
          icon: User,
          badge: 'User Stats',
          action: () => onOpenProfile(),
          keywords: ['profile', 'stats', 'streak', 'user', 'settings', 'goal'],
        },
        {
          id: 'item-pwa',
          title: 'Install as Desktop / Mobile App (PWA)',
          subtitle: 'Learn how to install for full-screen standalone study',
          icon: Laptop,
          badge: 'PWA Ready',
          badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
          action: () => {
            alert('To install as an app:\n\n• Chrome/Edge (Desktop): Click the install icon in the URL bar.\n• Safari (iOS): Tap the Share icon and choose "Add to Home Screen".\n• Chrome (Android): Tap the menu and select "Install App".');
          },
          keywords: ['install', 'pwa', 'desktop', 'mobile', 'offline', 'standalone'],
        },
      ],
    },
  ], [userStats, onSelectTab, onSelectLearningTopic, onStartExam, onOpenProfile, onOpenSettings]);

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
                All Features & Curriculum
              </h2>
              <p className="text-[11px] text-[#4f4632]">
                Categorized navigation directory for LPI Prep
              </p>
            </div>
          </div>

          <button
            id="close-hamburger-menu-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#4f4632] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside menu */}
        <div className="p-3 bg-[#f8ecdb]/60 border-b border-[#d3c5ab] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, exams, commands (e.g. BIND, LVM, Bash)..."
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
        </div>

        {/* Scrollable Category List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#4f4632]">
              <Search className="w-8 h-8 text-[#817660] mx-auto mb-2 opacity-50" />
              <div className="font-bold text-sm text-[#201b11]">No matching features found</div>
              <p className="text-xs text-[#817660] mt-1">
                Try searching for another topic (e.g., "GRUB", "RAID", "101", "Security")
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1.5 bg-[#ebdcc8] text-[#785a00] text-xs font-bold rounded-md hover:bg-[#d3c5ab]"
              >
                Clear Search
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
                {userStats.streakDays}-Day Study Streak
              </div>
              <div className="text-[10px] text-[#4f4632]">
                Goal: {userStats.questionsDoneToday}/{userStats.dailyGoal} questions today
              </div>
            </div>
          </div>

          <button
            onClick={() => handleAction(onOpenProfile)}
            className="px-3 py-1.5 bg-[#fff8f2] border border-[#d3c5ab] rounded-lg text-xs font-bold text-[#785a00] hover:bg-[#ebdcc8] transition-colors"
          >
            My Stats
          </button>
        </div>
      </div>
    </div>
  );
};
