import { ExamTier, Flashcard, PracticeQuestion, UserStats } from '../types';

export const initialUserStats: UserStats = {
  name: 'Admin',
  role: 'Linux Administrator Student',
  currentTarget: 'LPIC-1',
  streakDays: 5,
  dailyGoal: 20,
  questionsDoneToday: 12,
  pathCompletionPct: 35,
  systemArchitectureProgress: 65,
  linuxInstallationProgress: 30,
};

export const certificationTiers: ExamTier[] = [
  {
    id: 'essentials',
    name: 'Linux Essentials',
    subtitle: 'Fundamentals of Linux systems and open source.',
    levelTag: 'ENTRY LEVEL',
    badgeUrl: '/app-logo.jpg',
    status: 'passed',
    description: 'Validates fundamental understanding of the Linux operating system, command line navigation, and open source philosophy.',
    validity: 'Lifetime',
    prerequisites: 'None',
    exams: [
      {
        id: 'exam-010',
        code: 'Exam 010-160',
        name: 'Linux Essentials Certificate Exam',
        topics: 'Open Source Community, Command Line, Finding Your Way on a Linux System, Power of Command Line, Security and File Permissions',
        progress: 100,
        status: 'passed',
        totalQuestions: 40,
      },
    ],
  },
  {
    id: 'lpic-1',
    name: 'LPIC-1: Linux Administrator',
    subtitle: 'System Administrator',
    levelTag: 'ACTIVE PREPARATION',
    badgeUrl: '/lpic-1.jpg',
    status: 'in_progress',
    description: 'Validate your ability to perform maintenance tasks on the command line, install and configure a computer running Linux and configure basic networking.',
    validity: '5 Years',
    prerequisites: 'None',
    exams: [
      {
        id: 'exam-101',
        code: 'Exam 101-500',
        name: 'LPIC-1 Exam 101',
        topics: 'System Architecture, Linux Installation, GNU/Unix Commands, Devices, Linux Filesystems',
        progress: 70,
        status: 'in_progress',
        totalQuestions: 60,
      },
      {
        id: 'exam-102',
        code: 'Exam 102-500',
        name: 'LPIC-1 Exam 102',
        topics: 'Shells, Scripting, Data Management, User Interfaces, Administrative Tasks, Essential System Services, Networking Fundamentals, Security',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
    ],
  },
  {
    id: 'lpic-2',
    name: 'LPIC-2: Linux Engineer',
    subtitle: 'Linux Engineer',
    levelTag: 'ADVANCED',
    badgeUrl: '/lpic-2.jpg',
    status: 'locked',
    description: 'Administer small to medium-sized mixed networks, implement network services (HTTP, DNS, DHCP, SSH), security, and storage.',
    validity: '5 Years',
    prerequisites: 'LPIC-1 Certificate',
    exams: [
      {
        id: 'exam-201',
        code: 'Exam 201-450',
        name: 'LPIC-2 Exam 201',
        topics: 'Capacity Planning, Linux Kernel, System Startup, Filesystem and Devices, Advanced Storage Administration, Network Configuration, System Maintenance',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
      {
        id: 'exam-202',
        code: 'Exam 202-450',
        name: 'LPIC-2 Exam 202',
        topics: 'Domain Name Server, Web Services, File Sharing, Network Client Management, E-Mail Services, System Security',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
    ],
  },
  {
    id: 'lpic-3',
    name: 'LPIC-3: Enterprise Professional',
    subtitle: 'Mixed Environments',
    levelTag: 'ENTERPRISE',
    badgeUrl: '/lpic-3.jpg',
    status: 'locked',
    description: 'Highest level certification for enterprise-level professionals covering Mixed Environments, Security, Virtualization and High Availability.',
    validity: '5 Years',
    prerequisites: 'LPIC-2 Certificate',
    exams: [
      {
        id: 'exam-300',
        code: 'Exam 300-100',
        name: 'Exam 300 (Mixed Environment)',
        topics: 'OpenLDAP Configuration, OpenLDAP Authentication, Samba Basics, Samba Share Configuration, Samba Domain Member Management',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
      {
        id: 'exam-303',
        code: 'Exam 303-300',
        name: 'Exam 303 (Security)',
        topics: 'Cryptography, Host Security, Access Control, Network Security, Threat Analysis',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
      {
        id: 'exam-305',
        code: 'Exam 305-300',
        name: 'Exam 305 (Virtualization & Containers)',
        topics: 'Full Virtualization (Xen, QEMU, Libvirt, Disk Images), Container Virtualization (Namespaces, cgroups, LXC, Docker, Orchestration), VM Deployment (Cloud Tools, Packer, cloud-init, Vagrant)',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
      {
        id: 'exam-306',
        code: 'Exam 306-300',
        name: 'Exam 306 (High Availability & Storage)',
        topics: 'HA Cluster Management (LVS, Keepalived, Pacemaker/Corosync), Cluster Storage (DRBD, SAN/iSCSI, GFS2/OCFS2), Distributed Storage (GlusterFS, Ceph), Single Node HA (Watchdog, Advanced RAID/LVM, Network Bonding/Teaming)',
        progress: 0,
        status: 'locked',
        totalQuestions: 60,
      },
    ],
  },
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 12,
    examId: 'exam-101',
    category: 'Exam 101: System Architecture',
    question: 'Which command is used to reload the systemd manager configuration?',
    scenario: 'You have recently modified a unit file and need systemd to recognize the changes without rebooting the system.',
    options: [
      'systemctl daemon-reload',
      'systemctl reload-all',
      'systemd-reload',
      'systemctl refresh',
    ],
    correctIndex: 0,
    explanation: 'The `systemctl daemon-reload` command reloads the systemd manager configuration. This command reruns all generators, reloads all unit files, and recreates the entire dependency tree. It is required when unit files are created or modified.',
    commandSnippet: 'sudo systemctl daemon-reload',
  },
  {
    id: 13,
    examId: 'exam-101',
    category: 'Exam 101: Linux Installation & Package Management',
    question: 'Which Debian package management command is used to query which package owns a specific file?',
    scenario: 'An admin discovers `/usr/bin/htop` on the filesystem and needs to verify the exact package responsible for installing it.',
    options: [
      'dpkg -S /usr/bin/htop',
      'apt-cache search /usr/bin/htop',
      'dpkg -l /usr/bin/htop',
      'dpkg --verify /usr/bin/htop',
    ],
    correctIndex: 0,
    explanation: '`dpkg -S` (or `dpkg --search`) searches for a filename from installed packages and displays which package provides that specific file.',
    commandSnippet: 'dpkg -S /usr/bin/htop',
  },
  {
    id: 14,
    examId: 'exam-101',
    category: 'Exam 101: GNU and Unix Commands',
    question: 'Which regular expression symbol matches the beginning of a line in grep and sed?',
    scenario: 'You want to filter configuration lines that begin with `ServerName` while ignoring indented or commented instances.',
    options: [
      '^ (Caret)',
      '$ (Dollar sign)',
      '* (Asterisk)',
      '. (Period)',
    ],
    correctIndex: 0,
    explanation: 'In POSIX regular expressions, `^` anchors the search pattern to the start of the line, while `$` anchors to the end of the line.',
    commandSnippet: 'grep "^ServerName" /etc/apache2/apache2.conf',
  },
  {
    id: 15,
    examId: 'exam-101',
    category: 'Exam 101: Devices, Linux Filesystems, Filesystem Hierarchy',
    question: 'Which command is used to create an ext4 filesystem on partition `/dev/sdb1`?',
    scenario: 'A new storage drive has been partitioned and requires format preparation for mounting.',
    options: [
      'mkfs.ext4 /dev/sdb1',
      'fdisk --format=ext4 /dev/sdb1',
      'fsck -t ext4 /dev/sdb1',
      'format /dev/sdb1 ext4',
    ],
    correctIndex: 0,
    explanation: '`mkfs.ext4` (or `mkfs -t ext4`) builds an ext4 filesystem on the specified device partition.',
    commandSnippet: 'sudo mkfs.ext4 /dev/sdb1',
  },
  {
    id: 16,
    examId: 'exam-101',
    category: 'Exam 101: System Architecture',
    question: 'Which file contains kernel boot parameters provided during system initialization?',
    scenario: 'You need to review the active kernel command line arguments used during the last boot sequence.',
    options: [
      '/proc/cmdline',
      '/etc/boot.conf',
      '/var/log/dmesg.txt',
      '/sys/kernel/parameters',
    ],
    correctIndex: 0,
    explanation: '`/proc/cmdline` is a virtual file in procfs that reflects the exact command line string passed to the Linux kernel at boot time by GRUB/bootloader.',
    commandSnippet: 'cat /proc/cmdline',
  },
  {
    id: 17,
    examId: 'exam-101',
    category: 'Exam 101: GNU and Unix Commands',
    question: 'What is the octal permission value for read and execute permissions for the owner, and read-only for group and others?',
    scenario: 'A shared binary script requires execution only by the owner while allowing read access to everyone else.',
    options: [
      '544 (r-xr--r--)',
      '755 (rwxr-xr-x)',
      '644 (rw-r--r--)',
      '550 (r-xr-x---)',
    ],
    correctIndex: 0,
    explanation: 'Read (4) + Execute (1) = 5 for owner; Read (4) = 4 for group; Read (4) = 4 for others. Result is 544.',
    commandSnippet: 'chmod 544 script.sh',
  },
];

import { topic101Flashcards } from './topic101Flashcards';
import { topic102Flashcards } from './topic102Flashcards';
import { topic103Flashcards } from './topic103Flashcards';
import { topic104Flashcards } from './topic104Flashcards';
import { topic105Flashcards } from './topic105Flashcards';
import { topic106Flashcards } from './topic106Flashcards';
import { topic108Flashcards } from './topic108Flashcards';
import { topic109Flashcards } from './topic109Flashcards';
import { topic110Flashcards } from './topic110Flashcards';
import { topic200Flashcards } from './topic200Flashcards';
import { topic201Flashcards } from './topic201Flashcards';
import { topic202Flashcards } from './topic202Flashcards';
import { topic203Flashcards } from './topic203Flashcards';
import { topic204Flashcards } from './topic204Flashcards';
import { topic205Flashcards } from './topic205Flashcards';
import { topic206Flashcards } from './topic206Flashcards';
import { topic207Flashcards } from './topic207Flashcards';
import { topic208Flashcards } from './topic208Flashcards';
import { topic209Flashcards } from './topic209Flashcards';
import { topic210Flashcards } from './topic210Flashcards';
import { topic211Flashcards } from './topic211Flashcards';
import { topic212Flashcards } from './topic212Flashcards';
import { topic301Flashcards } from './topic301Flashcards';
import { topic302Flashcards } from './topic302Flashcards';
import { topic303Flashcards } from './topic303Flashcards';
import { topic304Flashcards } from './topic304Flashcards';
import { topic305Flashcards } from './topic305Flashcards';
import { topic306Flashcards } from './topic306Flashcards';
import { topic325Flashcards } from './topic325Flashcards';
import { topic326Flashcards } from './topic326Flashcards';
import { topic327Flashcards } from './topic327Flashcards';
import { topic328Flashcards } from './topic328Flashcards';
import { topic351Flashcards } from './topic351Flashcards';
import { topic352Flashcards } from './topic352Flashcards';
import { topic353Flashcards } from './topic353Flashcards';
import { topic361Flashcards } from './topic361Flashcards';
import { topic362Flashcards } from './topic362Flashcards';
import { topic363Flashcards } from './topic363Flashcards';
import { topic364Flashcards } from './topic364Flashcards';

export {
  topic101Flashcards,
  topic102Flashcards,
  topic103Flashcards,
  topic104Flashcards,
  topic105Flashcards,
  topic106Flashcards,
  topic108Flashcards,
  topic109Flashcards,
  topic110Flashcards,
  topic200Flashcards,
  topic201Flashcards,
  topic202Flashcards,
  topic203Flashcards,
  topic204Flashcards,
  topic205Flashcards,
  topic206Flashcards,
  topic207Flashcards,
  topic208Flashcards,
  topic209Flashcards,
  topic210Flashcards,
  topic211Flashcards,
  topic212Flashcards,
  topic301Flashcards,
  topic302Flashcards,
  topic303Flashcards,
  topic304Flashcards,
  topic305Flashcards,
  topic306Flashcards,
  topic325Flashcards,
  topic326Flashcards,
  topic327Flashcards,
  topic328Flashcards,
  topic351Flashcards,
  topic352Flashcards,
  topic353Flashcards,
  topic361Flashcards,
  topic362Flashcards,
  topic363Flashcards,
  topic364Flashcards,
};

export const flashcardsData: Flashcard[] = [
  ...topic101Flashcards,
  ...topic102Flashcards,
  ...topic103Flashcards,
  ...topic104Flashcards,
  ...topic105Flashcards,
  ...topic106Flashcards,
  ...topic108Flashcards,
  ...topic109Flashcards,
  ...topic110Flashcards,
  ...topic200Flashcards,
  ...topic201Flashcards,
  ...topic202Flashcards,
  ...topic203Flashcards,
  ...topic204Flashcards,
  ...topic205Flashcards,
  ...topic206Flashcards,
  ...topic207Flashcards,
  ...topic208Flashcards,
  ...topic209Flashcards,
  ...topic210Flashcards,
  ...topic211Flashcards,
  ...topic212Flashcards,
  ...topic301Flashcards,
  ...topic302Flashcards,
  ...topic303Flashcards,
  ...topic304Flashcards,
  ...topic305Flashcards,
  ...topic306Flashcards,
  ...topic325Flashcards,
  ...topic326Flashcards,
  ...topic327Flashcards,
  ...topic328Flashcards,
  ...topic351Flashcards,
  ...topic352Flashcards,
  ...topic353Flashcards,
  ...topic361Flashcards,
  ...topic362Flashcards,
  ...topic363Flashcards,
  ...topic364Flashcards,
  {
    id: 1,
    deck: 'Linux Essentials',
    command: 'chmod',
    definition: 'Change file modes or Access Control Lists',
    example: 'chmod 755 script.sh',
    exampleExplanation: 'Sets permissions to rwxr-xr-x (read/write/exec for owner, read/exec for group and others).',
    status: 'unseen',
  },
  {
    id: 2,
    deck: 'Linux Essentials',
    command: 'chown',
    definition: 'Change file owner and group ownership',
    example: 'chown user:webadmin /var/www/html -R',
    exampleExplanation: 'Recursively sets the user owner to "user" and group owner to "webadmin".',
    status: 'unseen',
  },
  {
    id: 3,
    deck: 'LPIC-1 System',
    command: 'systemctl',
    definition: 'Control the systemd system and service manager',
    example: 'systemctl status nginx.service',
    exampleExplanation: 'Inspects runtime status, PID, active memory, and recent log journal entries for nginx.',
    status: 'unseen',
  },
  {
    id: 4,
    deck: 'LPIC-1 System',
    command: 'journalctl',
    definition: 'Query and view logs generated by systemd-journald',
    example: 'journalctl -u ssh -f --since "1 hour ago"',
    exampleExplanation: 'Follows real-time logs for the SSH service generated in the last hour.',
    status: 'unseen',
  },
  {
    id: 5,
    deck: 'LPIC-1 Storage',
    command: 'lsblk',
    definition: 'List information about all available block devices',
    example: 'lsblk -f',
    exampleExplanation: 'Prints a tree view of storage devices, including filesystems (FSTYPE), UUIDs, and mount points.',
    status: 'unseen',
  },
  {
    id: 6,
    deck: 'LPIC-1 System',
    command: 'uname',
    definition: 'Print system information and kernel architecture details',
    example: 'uname -r',
    exampleExplanation: 'Prints the exact release version of the running Linux kernel.',
    status: 'unseen',
  },
  {
    id: 7,
    deck: 'LPIC-1 System',
    command: 'tar',
    definition: 'Archive utility for compressing and extracting tape archives',
    example: 'tar -czvf backup.tar.gz /etc/nginx',
    exampleExplanation: 'Creates (-c) a gzipped (-z) verbose (-v) archive file (-f) from /etc/nginx directory.',
    status: 'unseen',
  },
  {
    id: 8,
    deck: 'LPIC-1 Networking',
    command: 'ip',
    definition: 'Show and manipulate routing, network devices, interfaces and tunnels',
    example: 'ip addr show eth0',
    exampleExplanation: 'Displays IP addresses, MAC address, and status assigned to interface eth0.',
    status: 'unseen',
  },
  {
    id: 9,
    deck: 'LPIC-1 System',
    command: 'grep',
    definition: 'Print lines matching a pattern using regular expressions',
    example: 'grep -E "^(error|fail)" /var/log/syslog',
    exampleExplanation: 'Finds and prints lines in syslog starting with either "error" or "fail" (extended regex).',
    status: 'unseen',
  },
  {
    id: 10,
    deck: 'LPIC-1 System',
    command: 'crontab',
    definition: 'Maintain scheduled cron tables for background automation tasks',
    example: 'crontab -e',
    exampleExplanation: 'Opens the current user\'s cron table in the default text editor for task scheduling.',
    status: 'unseen',
  },
  {
    id: 11,
    deck: 'LPIC-1 Storage',
    command: 'find',
    definition: 'Search for files in a directory hierarchy based on criteria',
    example: 'find /var/log -type f -mtime +30 -name "*.log"',
    exampleExplanation: 'Searches for regular files in /var/log modified more than 30 days ago ending in .log.',
    status: 'unseen',
  },
  {
    id: 12,
    deck: 'LPIC-1 System',
    command: 'dmesg',
    definition: 'Print or control the kernel ring buffer logs',
    example: 'dmesg -T | grep -i usb',
    exampleExplanation: 'Displays kernel messages with human-readable timestamps (-T) filtered for USB hardware events.',
    status: 'unseen',
  },
];
