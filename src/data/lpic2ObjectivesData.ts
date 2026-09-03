import { LPICTopic } from '../types';

export const lpic2TopicsData: LPICTopic[] = [
  // ==========================================
  // EXAM 201 (201-450)
  // ==========================================
  {
    id: 'topic-200',
    topicNumber: 200,
    title: 'Capacity Planning',
    totalWeight: 8,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Measure, analyze, and troubleshoot system resource usage (CPU, memory, disk I/O, network) and predict future infrastructure capacity.',
    objectives: [
      {
        id: '200.1',
        title: 'Measure and Troubleshoot Resource Usage',
        weight: 6,
        description: 'Candidates should be able to measure hardware resource usage and troubleshoot resource bottlenecks including CPU, memory, disks, and network.',
        keyKnowledgeAreas: [
          'Measure CPU and memory usage using vmstat, top, sar, iostat',
          'Analyze disk I/O bottlenecks and queue lengths with iostat and iotop',
          'Measure network bandwidth consumption and packet drops with iftop, iptraf, netstat, ss, nload',
          'Monitor system health and trend metrics with collectd, Nagios, Prometheus or Cacti',
          'Configure system activity reporter (sysstat/sar) collection intervals and retention'
        ],
        termsAndUtilities: [
          'top', 'htop', 'vmstat', 'iostat', 'iotop', 'sar', 'sadc', 'sa1', 'sa2',
          'netstat', 'ss', 'iftop', 'nload', 'iptraf-ng', 'collectd', 'cacti', 'nagios'
        ],
        filesAndPaths: [
          '/var/log/sa/',
          '/etc/sysstat/sysstat',
          '/etc/collectd/collectd.conf',
          '/proc/stat',
          '/proc/meminfo',
          '/proc/diskstats'
        ],
        keyCommands: [
          {
            command: 'vmstat 2 5',
            description: 'Sample system performance (procs, memory, swap, io, system, cpu) every 2 seconds for 5 reports',
            example: 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st',
            explanation: 'Watch "r" for runnable processes queue, "si/so" for swap in/out (memory pressure), and "wa" for I/O wait.'
          },
          {
            command: 'iostat -xz 1 3',
            description: 'Detailed disk metrics per partition including %util, await time, and queue size',
            example: 'Device:  r/s     w/s     rkB/s     wkB/s   await  %util\nsda       12.00   84.50   124.00    1024.00    1.80  14.20',
            explanation: '%util approaching 100% signifies disk saturation.'
          },
          {
            command: 'sar -q -f /var/log/sa/sa28',
            description: 'Query historical queue length and load average from sysstat data file for the 28th day',
            example: '00:00:01 runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked\n08:00:01       3       412      2.10      1.80      1.45         0',
            explanation: 'sysstat stores daily binary logs in /var/log/sa/saDD which can be converted with sar.'
          }
        ],
        studyNotes: [
          'High "wa" (I/O Wait) in top/vmstat indicates storage or disk bottleneck, NOT CPU starvation.',
          'Swap In (si) and Swap Out (so) values > 0 indicate severe RAM contention (thrashing).',
          'sadc (System Activity Data Collector) is run by cron via sa1 and sa2 helper scripts.'
        ],
        quickQuestions: [
          {
            question: 'Which utility from the sysstat package is used to record binary activity metrics into /var/log/sa/saDD files?',
            options: ['sar', 'sadc', 'vmstat', 'iostat'],
            correctIndex: 1,
            explanation: 'sadc (System Activity Data Collector) generates the binary data logs, executed via sa1 script.'
          },
          {
            question: 'When analyzing vmstat output, which column indicates processes waiting for run time (CPU queue)?',
            options: ['b', 'r', 'si', 'wa'],
            correctIndex: 1,
            explanation: 'The "r" column under procs displays the number of runnable processes waiting for CPU cycles.'
          }
        ]
      },
      {
        id: '200.2',
        title: 'Predict Future Resource Needs',
        weight: 2,
        description: 'Candidates should be able to monitor resource usage to predict future resource requirements and detect trends.',
        keyKnowledgeAreas: [
          'Use monitoring and trending tools (MRTG, Cacti, Zabbix, Prometheus, Grafana)',
          'Identify growth trends in disk capacity, RAM consumption, and network throughput',
          'Understand baseline performance vs spike anomaly vs linear exhaustion curves',
          'Configure thresholds, alarms, and alerts for automated resource escalation'
        ],
        termsAndUtilities: [
          'mrtg', 'cacti', 'rrdtool', 'nagios', 'zabbix', 'prometheus', 'grafana', 'df', 'du'
        ],
        filesAndPaths: [
          '/etc/mrtg.cfg',
          '/var/lib/rrd/'
        ],
        keyCommands: [
          {
            command: 'rrdtool info /var/lib/cacti/rra/server_traffic.rrd',
            description: 'Inspect Round Robin Database structure, step size, and consolidation functions',
            example: 'filename = "/var/lib/cacti/rra/server_traffic.rrd"\nrrd_version = "0003"\nstep = 300',
            explanation: 'RRDtool stores time-series data with automatic aggregation over daily, monthly, and yearly intervals.'
          }
        ],
        studyNotes: [
          'RRD (Round Robin Database) never expands in size; older data is automatically consolidated into wider averages.',
          'Capacity planning requires comparing linear projection models against disk partition growth rates.'
        ],
        quickQuestions: [
          {
            question: 'What is the key characteristic of RRDtool time-series data storage?',
            options: [
              'Data files grow indefinitely until cleared',
              'The file size remains constant as older data is consolidated',
              'Only stores relational SQL tables',
              'Requires daily manual pruning'
            ],
            correctIndex: 1,
            explanation: 'RRDtool uses round-robin circular buffers, guaranteeing fixed file storage size.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-201',
    topicNumber: 201,
    title: 'The Linux Kernel',
    totalWeight: 10,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Kernel components, kernel source compilation, module configuration, and runtime device tree management.',
    objectives: [
      {
        id: '201.1',
        title: 'Kernel Components',
        weight: 2,
        description: 'Candidates should be able to identify, locate, and extract the components of the Linux kernel.',
        keyKnowledgeAreas: [
          'Locate kernel images (vmlinuz, zImage, bzImage) and initramfs/initrd archives',
          'Kernel module directory structure in /lib/modules/<kernel-version>/',
          'Kernel symbols and system map (/boot/System.map, /proc/kallsyms)',
          'Understanding monolithic kernel architecture with dynamic loadable kernel modules (LKMs)',
          'Inspect kernel version naming: major, minor, patchlevel, extraversion'
        ],
        termsAndUtilities: [
          '/boot/vmlinuz*', '/boot/initrd.img*', '/boot/System.map*',
          '/lib/modules/', 'uname', 'zcat /proc/config.gz'
        ],
        filesAndPaths: [
          '/boot/vmlinuz-$(uname -r)',
          '/boot/initramfs-$(uname -r).img',
          '/boot/System.map-$(uname -r)',
          '/lib/modules/$(uname -r)/modules.dep',
          '/proc/version',
          '/proc/sys/kernel/'
        ],
        keyCommands: [
          {
            command: 'uname -r -v -m',
            description: 'Print running kernel release version, compilation timestamp, and machine hardware architecture',
            example: '6.6.14-1-lts #1 SMP PREEMPT_DYNAMIC x86_64',
            explanation: '-r outputs release string matching /lib/modules/<version>/ path.'
          }
        ],
        studyNotes: [
          'vmlinuz is a bzImage (bootable compressed kernel image) loaded by GRUB into memory.',
          'System.map holds the lookup table connecting kernel symbol names to memory addresses.'
        ],
        quickQuestions: [
          {
            question: 'Where are dynamic loadable kernel modules located for the active running kernel?',
            options: [
              '/usr/src/linux/modules/',
              '/lib/modules/$(uname -r)/',
              '/etc/kernel/modules/',
              '/boot/modules/'
            ],
            correctIndex: 1,
            explanation: 'Kernel modules are organized strictly under /lib/modules/<kernel-version>/.'
          }
        ]
      },
      {
        id: '201.2',
        title: 'Compiling a Kernel',
        weight: 3,
        description: 'Candidates should be able to properly configure, build, and install a custom Linux kernel and kernel modules from source.',
        keyKnowledgeAreas: [
          'Kernel configuration interfaces: make menuconfig, make xconfig, make oldconfig, make localmodconfig',
          'Target compilation: make, make modules, make modules_install, make install',
          'Creating initramfs/initrd with dracut, mkinitramfs, or mkinitrd',
          'Managing .config files and saving hardware specific configurations',
          'Kernel patch application with patch command (patch -p1 < patch.diff)'
        ],
        termsAndUtilities: [
          'make', 'menuconfig', 'oldconfig', 'olddefconfig', 'localmodconfig',
          'dracut', 'mkinitramfs', 'update-initramfs', 'patch', 'xz', 'tar'
        ],
        filesAndPaths: [
          '/usr/src/linux/.config',
          '/boot/grub/grub.cfg',
          '/etc/dracut.conf'
        ],
        keyCommands: [
          {
            command: 'make menuconfig',
            description: 'Launch ncurses text-based configuration menu for kernel parameters and drivers',
            example: '[*] 64-bit kernel\n<M> Ext4 file system support\n<*> Networking support',
            explanation: '<*> compiles feature directly into kernel core, <M> builds as loadable module (.ko).'
          },
          {
            command: 'make -j$(nproc) && make modules_install && make install',
            description: 'Compile kernel and modules using all CPU threads, then install modules and kernel binary',
            example: 'INSTALL /lib/modules/6.6.14/kernel/drivers/net/e1000.ko\nInstalled /boot/vmlinuz-6.6.14',
            explanation: 'make modules_install copies .ko objects to /lib/modules; make install writes /boot/vmlinuz.'
          },
          {
            command: 'dracut /boot/initramfs-6.6.14.img 6.6.14 --force',
            description: 'Generate initial RAM filesystem archive for specified kernel release version',
            example: '*** Creating image file /boot/initramfs-6.6.14.img ***\n*** Creating initramfs image file done ***',
            explanation: 'Initramfs contains necessary early drivers (AHCI, NVMe, LVM, dm-crypt) to mount rootfs.'
          }
        ],
        studyNotes: [
          'make oldconfig prompts only for newly introduced features when upgrading from an existing .config.',
          'make localmodconfig automatically disables all drivers not currently loaded in lsmod, speeding compile time.'
        ],
        quickQuestions: [
          {
            question: 'Which target in the kernel build system creates and updates the kernel configuration using an existing .config while asking only for new options?',
            options: ['make menuconfig', 'make oldconfig', 'make defconfig', 'make mrproper'],
            correctIndex: 1,
            explanation: 'make oldconfig reads the current .config and prompts the operator only for newly added kernel features.'
          }
        ]
      },
      {
        id: '201.3',
        title: 'Kernel Runtime Management and Troubleshooting',
        weight: 4,
        description: 'Candidates should be able to manage and query kernel modules and tune kernel parameters at runtime.',
        keyKnowledgeAreas: [
          'Query and manipulate modules: lsmod, modinfo, insmod, rmmod, modprobe',
          'Manage module parameters, dependencies and blacklists in /etc/modprobe.d/',
          'Tune runtime kernel parameters via /proc/sys/ and sysctl (/etc/sysctl.conf, /etc/sysctl.d/)',
          'Examine device detection via udev, dmesg, /sys/ (sysfs), and /proc/',
          'Manage hardware discovery with lspci, lsusb, lshw, udevadm'
        ],
        termsAndUtilities: [
          'lsmod', 'modinfo', 'modprobe', 'rmmod', 'insmod', 'depmod',
          'sysctl', 'dmesg', 'udevadm', 'lspci', 'lsusb'
        ],
        filesAndPaths: [
          '/etc/modprobe.d/*.conf',
          '/etc/sysctl.conf',
          '/etc/sysctl.d/*.conf',
          '/proc/sys/',
          '/sys/',
          '/lib/modules/$(uname -r)/modules.dep'
        ],
        keyCommands: [
          {
            command: 'modprobe -r nouveau',
            description: 'Safely remove a kernel module along with its unused dependent modules',
            example: '',
            explanation: 'modprobe resolves dependencies using modules.dep; -r unloads safely.'
          },
          {
            command: 'sysctl -w net.ipv4.ip_forward=1',
            description: 'Enable IPv4 packet routing dynamically at runtime without rebooting',
            example: 'net.ipv4.ip_forward = 1',
            explanation: 'Writes "1" to /proc/sys/net/ipv4/ip_forward.'
          },
          {
            command: 'udevadm monitor --environment --kernel',
            description: 'Monitor realtime kernel uevents and udev device discovery events (e.g. plugging USB)',
            example: 'KERNEL[182.204] add /devices/pci0000:00/.../usb1 (usb)',
            explanation: 'Essential for debugging udev rules and hotplug device assignment.'
          }
        ],
        studyNotes: [
          'depmod -a rebuilds /lib/modules/$(uname -r)/modules.dep dependency map.',
          'To permanently blacklist a module, create a file in /etc/modprobe.d/ (e.g. blacklist nouveau).',
          'sysctl -p /etc/sysctl.d/99-custom.conf reloads sysctl parameters from file.'
        ],
        quickQuestions: [
          {
            question: 'Which file must be updated by depmod to allow modprobe to calculate module dependencies?',
            options: [
              '/lib/modules/<version>/modules.dep',
              '/etc/modules.conf',
              '/etc/modprobe.d/depend.conf',
              '/proc/sys/kernel/modules'
            ],
            correctIndex: 0,
            explanation: 'depmod generates modules.dep and modules.dep.bin in /lib/modules/<version>/.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-202',
    topicNumber: 202,
    title: 'System Startup',
    totalWeight: 8,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Customizing SysV-init and systemd boot targets, GRUB2 bootloader customization, and system recovery.',
    objectives: [
      {
        id: '202.1',
        title: 'Customizing SysV-init System Startup',
        weight: 3,
        description: 'Candidates should be able to query and customize traditional SysV-init runlevels and rc scripts.',
        keyKnowledgeAreas: [
          'Understand SysV-init runlevels: 0 (Halt), 1/S (Single), 2-5 (Multiuser), 6 (Reboot)',
          'Manage SysV services with update-rc.d, chkconfig, and service commands',
          'Structure of /etc/init.d/ and /etc/rc[0-6S].d/ symlinks (S=Start, K=Kill with sequence numbers)',
          '/etc/inittab configuration: id:runlevels:action:process (e.g., id:3:initdefault:)'
        ],
        termsAndUtilities: [
          'init', 'telinit', 'runlevel', 'inittab', 'update-rc.d', 'chkconfig', 'service'
        ],
        filesAndPaths: [
          '/etc/inittab',
          '/etc/init.d/',
          '/etc/rc.local',
          '/etc/rc[0-6].d/'
        ],
        keyCommands: [
          {
            command: 'telinit 3',
            description: 'Change the current operating runlevel to 3 (multi-user text mode without GUI)',
            example: '',
            explanation: 'telinit signals init process to switch runlevels and execute matching K/S scripts.'
          },
          {
            command: 'update-rc.d apache2 defaults 20 80',
            description: 'Generate SysV startup symlinks in rc*.d starting at priority 20 and stopping at priority 80',
            example: 'Adding system startup for /etc/init.d/apache2 ...',
            explanation: 'Sets up S20apache2 in default runlevels.'
          }
        ],
        studyNotes: [
          'In SysV init, scripts starting with "S" execute start on entry; "K" execute stop on exit.',
          'initdefault action in /etc/inittab must never be set to 0 or 6.'
        ],
        quickQuestions: [
          {
            question: 'What does a symlink named S20nginx in /etc/rc3.d/ signify?',
            options: [
              'Stop nginx with priority 20 when entering runlevel 3',
              'Start nginx with execution priority 20 when entering runlevel 3',
              'Sleep 20 seconds before starting nginx',
              'Restart nginx every 20 minutes'
            ],
            correctIndex: 1,
            explanation: 'Prefix S indicates Start, followed by 2-digit execution order sequence (20).'
          }
        ]
      },
      {
        id: '202.2',
        title: 'Systemd System Startup',
        weight: 4,
        description: 'Candidates should be able to configure and manage systemd units, targets, and timers during boot and runtime.',
        keyKnowledgeAreas: [
          'Systemd unit types (.service, .target, .socket, .device, .mount, .timer)',
          'Manage unit states: systemctl start, stop, restart, reload, status, enable, disable, mask',
          'Target management: default.target, multi-user.target, graphical.target, rescue.target, emergency.target',
          'Unit file configuration hierarchy: /etc/systemd/system/ overrides /usr/lib/systemd/system/',
          'Systemd journal inspection with journalctl (-u, -b, -f, --since, -p)'
        ],
        termsAndUtilities: [
          'systemctl', 'journalctl', 'systemd-analyze', 'systemd-delta', 'hostnamectl', 'localectl'
        ],
        filesAndPaths: [
          '/etc/systemd/system/',
          '/usr/lib/systemd/system/',
          '/etc/systemd/journald.conf',
          '/var/log/journal/'
        ],
        keyCommands: [
          {
            command: 'systemctl set-default multi-user.target',
            description: 'Change permanent default boot target to non-graphical multi-user console',
            example: 'Removed /etc/systemd/system/default.target.\nCreated symlink /etc/systemd/system/default.target -> /usr/lib/systemd/system/multi-user.target.',
            explanation: 'Creates a symlink default.target pointing to desired target unit.'
          },
          {
            command: 'systemctl mask postfix.service',
            description: 'Link postfix unit file to /dev/null to make it impossible to start manually or as dependency',
            example: 'Created symlink /etc/systemd/system/postfix.service -> /dev/null.',
            explanation: 'Masking prevents both direct and indirect activation of the unit.'
          },
          {
            command: 'journalctl -u nginx -b 0 --no-pager -p err',
            description: 'Query journal logs for nginx unit from the current boot (-b 0) with severity error or higher',
            example: 'Mar 28 10:14:02 srv1 nginx[890]: bind() to 0.0.0.0:80 failed (98: Address already in use)',
            explanation: '-p filters log priority (emerg, alert, crit, err, warning, notice, info, debug).'
          }
        ],
        studyNotes: [
          'systemd-analyze blame ranks services by startup duration to identify boot bottlenecks.',
          'systemctl daemon-reload is mandatory after editing any .service file in /etc/systemd/system/.'
        ],
        quickQuestions: [
          {
            question: 'Which systemctl command makes a service impossible to start by linking its unit file to /dev/null?',
            options: ['systemctl disable', 'systemctl stop', 'systemctl mask', 'systemctl isolate'],
            correctIndex: 2,
            explanation: 'systemctl mask symlinks the unit file to /dev/null, preventing all start attempts.'
          }
        ]
      },
      {
        id: '202.3',
        title: 'System Recovery',
        weight: 4,
        description: 'Candidates should be able to recover broken system boots, repair GRUB, and use live rescue environments.',
        keyKnowledgeAreas: [
          'Manipulate GRUB2 boot loader parameters interactively (e.g. init=/bin/bash, systemd.unit=rescue.target)',
          'Reinstall and repair GRUB2 (grub-install, grub-mkconfig, update-grub)',
          'Mount root filesystem in rescue mode and use chroot /mnt /bin/bash',
          'Repair damaged initramfs, fix corrupted /etc/fstab UUID entries, reset root password'
        ],
        termsAndUtilities: [
          'grub-install', 'grub-mkconfig', 'update-grub', 'chroot', 'fsck', 'rescue.target', 'init=/bin/bash'
        ],
        filesAndPaths: [
          '/boot/grub/grub.cfg',
          '/etc/default/grub',
          '/etc/fstab'
        ],
        keyCommands: [
          {
            command: 'grub-install --target=i386-pc /dev/sda',
            description: 'Reinstall GRUB bootloader into the Master Boot Record of disk /dev/sda',
            example: 'Installing for i386-pc platform.\nInstallation finished. No error reported.',
            explanation: 'Installs GRUB stage 1 into MBR and stage 1.5/2 into post-MBR gap.'
          },
          {
            command: 'mount -o remount,rw /',
            description: 'Remount root filesystem in read-write mode after booting with init=/bin/bash',
            example: '',
            explanation: 'Emergency shells boot with rootfs mounted read-only; remounting rw enables passwd or config fixes.'
          }
        ],
        studyNotes: [
          'Append init=/bin/sh or init=/bin/bash to kernel command line in GRUB menu to bypass init and gain single root shell.',
          'grub-mkconfig -o /boot/grub/grub.cfg rebuilds GRUB config based on /etc/default/grub.'
        ],
        quickQuestions: [
          {
            question: 'After booting with init=/bin/bash to reset a forgotten root password, why does passwd fail by default?',
            options: [
              'Root user is disabled in bash mode',
              'The root filesystem is mounted read-only',
              'PAM authentication daemon is missing',
              'The /etc/shadow file is deleted'
            ],
            correctIndex: 1,
            explanation: 'The kernel boots emergency shells with root mounted read-only (ro). You must run mount -o remount,rw /.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-203',
    topicNumber: 203,
    title: 'Filesystem and Devices',
    totalWeight: 10,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Operating, maintaining, and tuning ext4, XFS, Btrfs, and ZFS filesystems, SMART disk health, and autofs.',
    objectives: [
      {
        id: '203.1',
        title: 'Operating the Linux Filesystem',
        weight: 3,
        description: 'Candidates should be able to configure and mount standard and network filesystems with advanced options.',
        keyKnowledgeAreas: [
          'Mount options: noexec, nodev, nosuid, ro, rw, noatime, nodiratime, user, sync, async',
          'Configure /etc/fstab with UUID, PARTUUID, or LABEL identifiers',
          'Configure Automounter (autofs) master and map files (/etc/auto.master, /etc/auto.misc)',
          'Manage swap space: mkswap, swapon, swapoff, /proc/swaps, swappiness sysctl'
        ],
        termsAndUtilities: [
          'mount', 'umount', 'fstab', 'autofs', 'automount', 'swapon', 'swapoff', 'mkswap', 'blkid', 'findfs'
        ],
        filesAndPaths: [
          '/etc/fstab',
          '/etc/auto.master',
          '/etc/auto.master.d/',
          '/etc/autofs.conf',
          '/proc/swaps',
          '/proc/mounts'
        ],
        keyCommands: [
          {
            command: 'swapon --show',
            description: 'List all active swap partitions and swap files with priority and utilization',
            example: 'NAME      TYPE SIZE USED PRIO\n/dev/zram0 partition 4G   0B  100\n/dev/sda3  partition 8G   0B   -2',
            explanation: 'Priority controls which swap device is utilized first (higher values first).'
          },
          {
            command: 'mount -o remount,noatime,nodiratime /data',
            description: 'Disable access time updating on file and directory reads to optimize disk performance',
            example: '',
            explanation: 'noatime prevents writing filesystem metadata on read operations.'
          }
        ],
        studyNotes: [
          'In autofs, /etc/auto.master points to direct or indirect map files.',
          'Direct maps use /- as mount point and specify absolute paths in the map file.'
        ],
        quickQuestions: [
          {
            question: 'Which /etc/fstab mount option prevents binaries on that filesystem from executing with SUID/SGID privileges?',
            options: ['noexec', 'nosuid', 'nodev', 'nouser'],
            correctIndex: 1,
            explanation: 'nosuid disables set-user-identifier or set-group-identifier execution bits.'
          }
        ]
      },
      {
        id: '203.2',
        title: 'Maintaining a Linux Filesystem',
        weight: 3,
        description: 'Candidates should be able to check, repair, and tune ext2/3/4, XFS, and Btrfs filesystems and monitor SMART disk health.',
        keyKnowledgeAreas: [
          'Filesystem repair tools: fsck, e2fsck, xfs_repair, btrfs check',
          'Ext filesystem tuning: tune2fs, mke2fs, resize2fs, dumpe2fs',
          'XFS maintenance: xfs_admin, xfs_growfs, xfs_info, xfs_metadump',
          'Btrfs operations: btrfs subvolume create/list/snapshot, btrfs filesystem df/resize/balance',
          'Disk diagnostic and SMART health monitoring: smartctl, smartd'
        ],
        termsAndUtilities: [
          'fsck', 'e2fsck', 'tune2fs', 'dumpe2fs', 'resize2fs',
          'xfs_repair', 'xfs_admin', 'xfs_growfs',
          'btrfs', 'smartctl', 'smartd'
        ],
        filesAndPaths: [
          '/etc/smartd.conf',
          '/etc/smartmontools/'
        ],
        keyCommands: [
          {
            command: 'tune2fs -c 30 -i 180d /dev/sda1',
            description: 'Set max mount count check to 30 mounts and check interval to 180 days on ext4 partition',
            example: 'Setting maximal mount count to 30\nSetting interval between checks to 15552000 seconds',
            explanation: 'tune2fs modifies superblock parameters without reformatting.'
          },
          {
            command: 'smartctl -H -A /dev/nvme0n1',
            description: 'Query overall SMART health self-assessment and detailed device telemetry attributes',
            example: 'SMART overall-health self-assessment test result: PASSED\nCritical Warning: 0x00\nTemperature: 36 Celsius',
            explanation: 'Check for Reallocated_Sector_Ct and Available Spare.'
          },
          {
            command: 'btrfs subvolume snapshot /home /home/snapshots/backup-mar28',
            description: 'Create a read-write or read-only instant copy-on-write subvolume snapshot in Btrfs',
            example: 'Create subvolume snapshot of \'/home\' to \'/home/snapshots/backup-mar28\'',
            explanation: 'Btrfs snapshots are instantaneous and consume zero initial disk space.'
          }
        ],
        studyNotes: [
          'xfs_repair cannot be run on a mounted filesystem; xfs_growfs requires the filesystem to be MOUNTED.',
          'ext filesystems can be grown while mounted with resize2fs, but shrinking requires unmounting.'
        ],
        quickQuestions: [
          {
            question: 'Which tool is used to monitor hard drive health, self-test status, and bad sector reallocation?',
            options: ['hdparm', 'smartctl', 'badblocks', 'tune2fs'],
            correctIndex: 1,
            explanation: 'smartctl (part of smartmontools) queries Self-Monitoring, Analysis and Reporting Technology (SMART).'
          }
        ]
      },
      {
        id: '203.3',
        title: 'Creating and Configuring Filesystem Options',
        weight: 2,
        description: 'Candidates should be able to create and configure advanced filesystem attributes, CD-ROM/ISO filesystems, and ZFS/FUSE options.',
        keyKnowledgeAreas: [
          'ISO-9660 filesystem tools: mkisofs, genisoimage, isoinfo, growisofs',
          'FUSE (Filesystem in Userspace) basics (sshfs, ntfs-3g, curlftpfs)',
          'Optical and UDF media creation with udftools'
        ],
        termsAndUtilities: [
          'mkisofs', 'genisoimage', 'isoinfo', 'growisofs', 'wodim', 'sshfs', 'fusermount'
        ],
        filesAndPaths: [
          '/etc/fuse.conf'
        ],
        keyCommands: [
          {
            command: 'genisoimage -J -R -o /tmp/archive.iso /var/data/',
            description: 'Generate ISO image with Joliet (-J) and Rock Ridge (-R) file extensions',
            example: 'Total translation table size: 0\nTotal rockridge attributes bytes: 3412\nWriting: ... Done',
            explanation: 'Rock Ridge preserves POSIX permissions, ownership, and symlinks on CD/DVD media.'
          }
        ],
        studyNotes: [
          'Rock Ridge extensions provide UNIX file attributes (permissions, UIDs) on ISO 9660.',
          'Joliet extensions provide Unicode long filename support for Windows compatibility.'
        ],
        quickQuestions: [
          {
            question: 'Which genisoimage parameter enables Rock Ridge extensions to preserve Linux permissions and ownership?',
            options: ['-J', '-R', '-U', '-T'],
            correctIndex: 1,
            explanation: '-R enables Rock Ridge protocols on ISO9660 file systems.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-204',
    topicNumber: 204,
    title: 'Advanced Storage Device Administration',
    totalWeight: 8,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Software RAID configuration (mdadm), disk tuning (hdparm/nvme-cli), and Logical Volume Management (LVM2).',
    objectives: [
      {
        id: '204.1',
        title: 'Configuring RAID',
        weight: 3,
        description: 'Candidates should be able to configure and manage Linux software RAID arrays using mdadm.',
        keyKnowledgeAreas: [
          'RAID levels: RAID 0 (striping), RAID 1 (mirroring), RAID 5 (distributed parity), RAID 6 (dual parity), RAID 10 (striped mirrors)',
          'Create and assemble arrays using mdadm (--create, --assemble, --manage)',
          'Monitor array health via /proc/mdstat and mdadm --detail',
          'Handle failed disks: mark faulty (--fail), remove (--remove), add hot-spare (--add)',
          '/etc/mdadm/mdadm.conf configuration and ARRAY definitions'
        ],
        termsAndUtilities: [
          'mdadm', '/proc/mdstat', 'mdadm.conf'
        ],
        filesAndPaths: [
          '/etc/mdadm/mdadm.conf',
          '/etc/mdadm.conf',
          '/proc/mdstat'
        ],
        keyCommands: [
          {
            command: 'mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/sdb1 /dev/sdc1 /dev/sdd1 --spare-devices=1 /dev/sde1',
            description: 'Create a RAID 5 array spanning 3 active partitions with 1 dedicated hot-spare drive',
            example: 'mdadm: Defaulting to version 1.2 metadata\nmdadm: array /dev/md0 started.',
            explanation: 'RAID 5 can survive 1 disk failure; the hot spare immediately kicks in for rebuild.'
          },
          {
            command: 'mdadm --manage /dev/md0 --fail /dev/sdc1 --remove /dev/sdc1',
            description: 'Simulate disk fault on /dev/sdc1 and remove from active array',
            example: 'mdadm: set /dev/sdc1 faulty in /dev/md0\nmdadm: hot removed /dev/sdc1 from /dev/md0',
            explanation: 'Essential sequence before physically replacing a defective storage drive.'
          }
        ],
        studyNotes: [
          'RAID 5 requires a minimum of 3 drives and loses 1 drive capacity to parity.',
          'RAID 6 requires a minimum of 4 drives and can survive 2 concurrent drive failures.',
          'Always update /etc/mdadm/mdadm.conf using: mdadm --detail --scan >> /etc/mdadm/mdadm.conf.'
        ],
        quickQuestions: [
          {
            question: 'What is the minimum number of disks required to create a RAID 6 array?',
            options: ['2', '3', '4', '5'],
            correctIndex: 2,
            explanation: 'RAID 6 stores dual distributed parity and requires at least 4 independent drives.'
          }
        ]
      },
      {
        id: '204.2',
        title: 'Adjusting Storage Device Access',
        weight: 2,
        description: 'Candidates should be able to tune drive parameters and evaluate access speeds using hdparm and nvme-cli.',
        keyKnowledgeAreas: [
          'Measure and adjust drive performance with hdparm (-t, -T, -I)',
          'Configure SSD and NVMe parameters with nvme-cli',
          'Manage SCSI/SATA parameters via sysfs (/sys/block/*/queue/scheduler)',
          'I/O schedulers: none/mq-deadline/kyber/bfq'
        ],
        termsAndUtilities: [
          'hdparm', 'nvme', 'sdparm', 'fstrim'
        ],
        filesAndPaths: [
          '/sys/block/*/queue/scheduler',
          '/etc/udev/rules.d/60-schedulers.rules'
        ],
        keyCommands: [
          {
            command: 'hdparm -tT /dev/sda',
            description: 'Perform buffered disk reads (-t) and cached memory reads (-T) benchmark',
            example: 'Timing cached reads:   18420 MB in  2.00 seconds = 9210.00 MB/sec\nTiming buffered disk reads: 540 MB in  3.01 seconds = 179.40 MB/sec',
            explanation: 'Cached reads test RAM/kernel cache speed; buffered disk reads test raw device throughput.'
          },
          {
            command: 'echo bfq > /sys/block/sda/queue/scheduler',
            description: 'Switch elevator I/O scheduler to Budget Fair Queueing for desktop/rotational drive',
            example: '',
            explanation: 'On fast NVMe drives, "none" or "kyber" is generally preferred.'
          }
        ],
        studyNotes: [
          'fstrim -av sends discard TRIM commands to SSDs to inform controller of freed blocks.',
          'Modern multi-queue block layer schedulers include none, mq-deadline, bfq, and kyber.'
        ],
        quickQuestions: [
          {
            question: 'Which command sends discard TRIM requests to all mounted SSD filesystems to prevent write performance degradation?',
            options: ['hdparm -W', 'fstrim -a', 'smartctl -t', 'tune2fs -T'],
            correctIndex: 1,
            explanation: 'fstrim discards unused blocks on mounted filesystems supporting TRIM.'
          }
        ]
      },
      {
        id: '204.3',
        title: 'Logical Volume Manager (LVM)',
        weight: 3,
        description: 'Candidates should be able to create, resize, snapshot, and manage Physical Volumes (PV), Volume Groups (VG), and Logical Volumes (LV).',
        keyKnowledgeAreas: [
          'LVM hierarchy: Physical Volumes (pvcreate, pvdisplay, pvs) -> Volume Groups (vgcreate, vgextend, vgreduce, vgs) -> Logical Volumes (lvcreate, lvextend, lvreduce, lvs)',
          'Dynamic volume expansion: lvextend -r -L +10G /dev/vg0/data',
          'Create and restore LVM thin pools and snapshots (lvcreate -s)',
          'Physical Extent (PE) size configuration with vgcreate -s 8M',
          'LVM device filtering and configuration in /etc/lvm/lvm.conf'
        ],
        termsAndUtilities: [
          'pvcreate', 'pvdisplay', 'pvs', 'pvmove',
          'vgcreate', 'vgextend', 'vgreduce', 'vgs', 'vgdisplay',
          'lvcreate', 'lvextend', 'lvreduce', 'lvresize', 'lvs', 'lvdisplay'
        ],
        filesAndPaths: [
          '/etc/lvm/lvm.conf',
          '/etc/lvm/backup/',
          '/dev/mapper/',
          '/dev/<vgname>/<lvname>'
        ],
        keyCommands: [
          {
            command: 'vgcreate -s 16M vg_storage /dev/sdb1 /dev/sdc1',
            description: 'Create volume group named vg_storage with 16MB physical extent (PE) size',
            example: 'Volume group "vg_storage" successfully created',
            explanation: 'Default PE size is 4MB; changing it allows larger maximum LV sizes on older formats.'
          },
          {
            command: 'lvcreate -L 50G -n lv_web vg_storage',
            description: 'Allocate a 50 Gigabyte linear logical volume named lv_web from vg_storage',
            example: 'Logical volume "lv_web" created.',
            explanation: 'Creates block device available at /dev/vg_storage/lv_web and /dev/mapper/vg_storage-lv_web.'
          },
          {
            command: 'lvextend -r -L +20G /dev/vg_storage/lv_web',
            description: 'Extend logical volume by 20GB and automatically resize underlying filesystem (-r)',
            example: 'Size of logical volume vg_storage/lv_web changed from 50.00 GiB to 70.00 GiB.\nresize2fs 1.47.0 ...',
            explanation: '-r triggers resize2fs or xfs_growfs automatically in one atomic step.'
          }
        ],
        studyNotes: [
          'pvmove safely migrates extents off a physical volume to another drive before removing it with vgreduce.',
          'XFS filesystems on LVs CANNOT be shrunk; ext4 can be shrunk but requires offline unmount.'
        ],
        quickQuestions: [
          {
            question: 'What is the function of the -r flag when executing lvextend?',
            options: [
              'Reboots the system after extension',
              'Automatically resizes the underlying filesystem to fill new LV space',
              'Creates a read-only volume',
              'Restores a backup snapshot'
            ],
            correctIndex: 1,
            explanation: '-r / --resizefs automatically runs resize2fs or xfs_growfs to match the new volume boundary.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-205',
    topicNumber: 205,
    title: 'Network Configuration',
    totalWeight: 11,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Basic and advanced network device configuration, routing tables, bonding, VLANs, wireless tools, and network troubleshooting.',
    objectives: [
      {
        id: '205.1',
        title: 'Basic Networking Configuration',
        weight: 3,
        description: 'Candidates should be able to view and configure network interfaces, IP addresses, subnets, and default gateways.',
        keyKnowledgeAreas: [
          'Modern IP manipulation using iproute2: ip link, ip addr, ip route, ip neigh',
          'Network management frameworks: nmcli, nmtui, systemd-networkd, netplan, ifup/ifdown',
          'Inspect network hardware and link status with ethtool, mii-tool',
          'Interface configuration files (/etc/network/interfaces, /etc/sysconfig/network-scripts/ifcfg-*)'
        ],
        termsAndUtilities: [
          'ip', 'ifconfig', 'route', 'ethtool', 'mii-tool', 'nmcli', 'nmtui', 'netplan'
        ],
        filesAndPaths: [
          '/etc/network/interfaces',
          '/etc/netplan/*.yaml',
          '/etc/sysconfig/network-scripts/ifcfg-*',
          '/etc/systemd/network/*.network'
        ],
        keyCommands: [
          {
            command: 'ip addr add 192.168.1.50/24 dev eth0',
            description: 'Assign IPv4 address with 24-bit subnet mask to interface eth0',
            example: '',
            explanation: 'Replaces legacy ifconfig eth0 192.168.1.50 netmask 255.255.255.0.'
          },
          {
            command: 'ip route add default via 192.168.1.1 dev eth0',
            description: 'Set default gateway route for all outbound internet traffic',
            example: '',
            explanation: 'Replaces legacy route add default gw 192.168.1.1.'
          },
          {
            command: 'ethtool eth0',
            description: 'Query physical link state, duplex mode (Full/Half), and speed (1000Mb/s, 10000Mb/s)',
            example: 'Speed: 1000Mb/s\nDuplex: Full\nLink detected: yes',
            explanation: 'Verifies cable connection and auto-negotiation status.'
          }
        ],
        studyNotes: [
          'ip command modifications are ephemeral and reset on reboot unless saved in network configuration files.',
          'nmcli connection up <con-name> applies changes managed by NetworkManager.'
        ],
        quickQuestions: [
          {
            question: 'Which modern command displays all IPv4/IPv6 addresses assigned to local interfaces?',
            options: ['ip addr show', 'ifconfig -a', 'netstat -i', 'ip route show'],
            correctIndex: 0,
            explanation: 'ip addr show (or ip a) is the standard iproute2 command to list interface IP configurations.'
          }
        ]
      },
      {
        id: '205.2',
        title: 'Advanced Network Configuration and Troubleshooting',
        weight: 4,
        description: 'Candidates should be able to configure routing tables, interface bonding/teaming, 802.1Q VLANs, and wireless connections.',
        keyKnowledgeAreas: [
          'Configure 802.1Q VLAN tagged interfaces (ip link add link eth0 name eth0.100 type vlan id 100)',
          'Network interface bonding (modes: 0-Round Robin, 1-Active-Backup, 4-802.3ad LACP, 6-ALB)',
          'Wireless configuration using iw, iwconfig, iwlist, wpa_supplicant',
          'Policy routing and custom routing tables with ip rule and /etc/iproute2/rt_tables'
        ],
        termsAndUtilities: [
          'ip link', 'ip rule', 'ip route', 'iw', 'iwconfig', 'wpa_supplicant', 'wpa_cli', 'wpa_passphrase'
        ],
        filesAndPaths: [
          '/etc/wpa_supplicant/wpa_supplicant.conf',
          '/etc/iproute2/rt_tables',
          '/proc/net/bonding/bond0'
        ],
        keyCommands: [
          {
            command: 'ip link add link eth0 name eth0.50 type vlan id 50',
            description: 'Create 802.1Q tagged VLAN interface with VLAN ID 50 on top of physical parent eth0',
            example: '',
            explanation: 'Packets exiting eth0.50 carry 802.1Q VLAN tag 50.'
          },
          {
            command: 'wpa_passphrase "CompanyWiFi" "SecretKey123" >> /etc/wpa_supplicant/wpa_supplicant.conf',
            description: 'Generate WPA/WPA2 pre-shared key (PSK) hash from plain SSID and passphrase',
            example: 'network={\n\tssid="CompanyWiFi"\n\t#psk="SecretKey123"\n\tpsk=93847291a...\n}',
            explanation: 'Generates secure 256-bit PSK hash so plaintext password is not exposed.'
          }
        ],
        studyNotes: [
          'Bonding Mode 1 (Active-Backup) provides fault tolerance; Mode 4 (802.3ad Dynamic Link Aggregation) requires switch LACP support.',
          'Cat /proc/net/bonding/bond0 exposes bonding partner link states and active slave.'
        ],
        quickQuestions: [
          {
            question: 'Which bonding mode requires switch-side configuration for 802.3ad dynamic link aggregation?',
            options: ['Mode 0 (balance-rr)', 'Mode 1 (active-backup)', 'Mode 4 (802.3ad)', 'Mode 6 (balance-alb)'],
            correctIndex: 2,
            explanation: 'Bonding mode 4 utilizes the IEEE 802.3ad LACP protocol and requires compatible switch teaming.'
          }
        ]
      },
      {
        id: '205.3',
        title: 'Troubleshooting Network Issues',
        weight: 4,
        description: 'Candidates should be able to identify and resolve network connectivity, DNS resolution, socket states, and packet capture issues.',
        keyKnowledgeAreas: [
          'Trace network path and latency: ping, traceroute, tracepath, mtr',
          'Socket and port analysis: ss (-tulnp), netstat, lsof -i',
          'Packet sniffing and capture: tcpdump, wireshark, tshark',
          'DNS testing and querying: dig, nslookup, host, getent hosts',
          'ARP cache analysis: ip neigh, arp'
        ],
        termsAndUtilities: [
          'ping', 'traceroute', 'tracepath', 'mtr', 'ss', 'netstat', 'tcpdump', 'nc', 'nmap', 'dig', 'host', 'whois'
        ],
        filesAndPaths: [
          '/etc/resolv.conf',
          '/etc/nsswitch.conf',
          '/etc/hosts',
          '/etc/services'
        ],
        keyCommands: [
          {
            command: 'ss -tulnp',
            description: 'Display all listening TCP (-t) and UDP (-u) sockets with port numbers (-n) and process names (-p)',
            example: 'Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\ntcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=640,fd=3))',
            explanation: 'Modern replacement for netstat; identifies process listening on ports.'
          },
          {
            command: 'tcpdump -nn -i eth0 port 53 or port 80 -w /tmp/capture.pcap',
            description: 'Capture DNS (53) and HTTP (80) traffic without resolving hostnames (-nn) to PCAP file',
            example: 'tcpdump: listening on eth0, link-type EN10MB, snapshot length 262144 bytes\n^C24 packets captured',
            explanation: '-nn prevents reverse DNS lookups, avoiding capture latency.'
          },
          {
            command: 'dig +trace www.lpi.org',
            description: 'Perform iterative DNS traversal from root servers (.) down to authoritative zone servers',
            example: '. 518400 IN NS a.root-servers.net.\norg. 172800 IN NS a0.org.afilias-nst.info.\nlpi.org. 3600 IN A 65.254.227.234',
            explanation: 'Reveals where in the delegation hierarchy DNS queries are failing.'
          }
        ],
        studyNotes: [
          'mtr combines traceroute and ping into an interactive real-time packet loss monitor.',
          'nc -zv <host> <port> quickly tests TCP handshake connectivity to a remote service.'
        ],
        quickQuestions: [
          {
            question: 'Which ss command flags display all listening TCP and UDP sockets with numerical port numbers and PID details?',
            options: ['ss -a', 'ss -tulnp', 'ss -s', 'ss -e'],
            correctIndex: 1,
            explanation: 'ss -tulnp specifies: (t)cp, (u)dp, (l)istening, (n)umeric, (p)rocesses.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-206',
    topicNumber: 206,
    title: 'System Maintenance',
    totalWeight: 6,
    examId: 'exam-201',
    certification: 'lpic-2',
    description: 'Compiling software from source, patch management, backup operations, and user notifications.',
    objectives: [
      {
        id: '206.1',
        title: 'Make and Install Programs from Source',
        weight: 2,
        description: 'Candidates should be able to build and install software packages from source tarballs.',
        keyKnowledgeAreas: [
          'Extract source code archives (tar -xzf, tar -xjf, tar -xJf)',
          'Configure build options with ./configure (--prefix, --sysconfdir, --enable-*, --with-*)',
          'Compile and install with make and make install (or checkinstall for creating native packages)',
          'Manage shared library path caching with ldconfig and /etc/ld.so.conf.d/'
        ],
        termsAndUtilities: [
          'tar', './configure', 'make', 'make install', 'checkinstall', 'ldconfig', 'ldd'
        ],
        filesAndPaths: [
          '/etc/ld.so.conf',
          '/etc/ld.so.conf.d/*.conf',
          '/etc/ld.so.cache',
          '/usr/local/'
        ],
        keyCommands: [
          {
            command: './configure --prefix=/opt/customapp && make && sudo make install',
            description: 'Standard autotools compilation pipeline setting custom destination directory',
            example: 'creating Makefile\nconfig.status: executing depfiles commands',
            explanation: '--prefix specifies where binaries (bin), libraries (lib), and data will reside.'
          },
          {
            command: 'ldd /usr/bin/ssh',
            description: 'Print shared library dependencies resolved by dynamic linker for executable',
            example: 'libcrypto.so.3 => /lib64/libcrypto.so.3 (0x00007f...)\nlibc.so.6 => /lib64/libc.so.6 (0x00007f...)',
            explanation: 'Diagnoses missing dynamic library dependencies (lib*.so not found).'
          }
        ],
        studyNotes: [
          'ldconfig updates /etc/ld.so.cache after installing new shared libraries.',
          'checkinstall creates a Debian .deb or RPM .rpm from source instead of make install, facilitating clean removal.'
        ],
        quickQuestions: [
          {
            question: 'Which command must be executed after adding a new directory to /etc/ld.so.conf.d/ to refresh the dynamic linker cache?',
            options: ['ldd -u', 'ldconfig', 'update-binfmts', 'make ld-cache'],
            correctIndex: 1,
            explanation: 'ldconfig updates the binary cache /etc/ld.so.cache containing pointers to dynamic libraries.'
          }
        ]
      },
      {
        id: '206.2',
        title: 'Backup Operations',
        weight: 3,
        description: 'Candidates should be able to perform and automate full, incremental, and differential backups using rsync, tar, cpio, and duplicity.',
        keyKnowledgeAreas: [
          'Understand backup strategies: Full, Differential (changes since last Full), Incremental (changes since last backup)',
          'Create and synchronize remote backups with rsync (-a, -v, -z, -e ssh, --delete, --exclude)',
          'Archive creation and extraction with tar and cpio',
          'Snapshot backups and tape archive management with mt'
        ],
        termsAndUtilities: [
          'rsync', 'tar', 'cpio', 'dd', 'mt', 'dump', 'restore', 'duplicity'
        ],
        filesAndPaths: [
          '/dev/st*',
          '/dev/nst*'
        ],
        keyCommands: [
          {
            command: 'rsync -avz --delete -e "ssh -p 2222" /var/www/ user@backup.server:/backup/www/',
            description: 'Archive sync (-a = recursive, perms, owner, times, symlinks) with compression and deletion',
            example: 'sending incremental file list\ndeleting old_photo.jpg\nindex.html\n\nsent 1,234,567 bytes',
            explanation: '--delete removes files on destination that no longer exist on source, keeping true mirror.'
          },
          {
            command: 'find /etc -depth | cpio -ov -H crc > /backup/etc_backup.cpio',
            description: 'Archive /etc directory into cpio format with CRC checksum verification',
            example: '/etc/passwd\n/etc/shadow\n12450 blocks',
            explanation: 'cpio accepts a list of file paths via standard input (stdin).'
          }
        ],
        studyNotes: [
          'In rsync, a trailing slash on source (/var/www/) copies the CONTENTS; omitting it (/var/www) copies the directory itself.',
          '/dev/st0 rewinds the tape drive on close; /dev/nst0 is non-rewinding.'
        ],
        quickQuestions: [
          {
            question: 'What is the key difference between an incremental backup and a differential backup?',
            options: [
              'Incremental backs up changes since the last backup of any type; Differential backs up changes since the last FULL backup',
              'Incremental only backs up databases; Differential backs up flat files',
              'Incremental never requires a full backup',
              'Differential backups cannot be restored without tape drives'
            ],
            correctIndex: 0,
            explanation: 'Incremental archives only data modified since the previous backup; differential captures all modifications since the initial full archive.'
          }
        ]
      },
      {
        id: '206.3',
        title: 'Notify Users on System-Related Issues',
        weight: 1,
        description: 'Candidates should be able to automate and manage user notifications, broadcast emergency maintenance messages, and restrict unauthorized logins during maintenance windows.',
        keyKnowledgeAreas: [
          'Broadcast messages to active terminals with wall and write',
          'Configure login banners with /etc/issue (pre-login) and /etc/issue.net (remote pre-login)',
          'Configure message of the day with /etc/motd and /etc/update-motd.d/ dynamic scripts',
          'Prevent non-root logins during maintenance with /etc/nologin and systemd-inhibit'
        ],
        termsAndUtilities: [
          'wall', 'write', 'mesg', 'shutdown', 'systemd-inhibit', 'mail', 'mailx'
        ],
        filesAndPaths: [
          '/etc/issue',
          '/etc/issue.net',
          '/etc/motd',
          '/etc/update-motd.d/',
          '/etc/nologin',
          '/var/run/nologin'
        ],
        keyCommands: [
          {
            command: 'wall "System going down for kernel upgrade in 15 minutes. Save work."',
            description: 'Broadcast urgent message to all logged-in terminals via terminal write permissions',
            example: 'Broadcast message from root@server (pts/0) (Thu Sep 3 10:00:00 2026):\nSystem going down for kernel upgrade in 15 minutes. Save work.',
            explanation: 'Sends text directly to all open pts and tty devices that have mesg y enabled.'
          },
          {
            command: 'echo "Scheduled maintenance in progress until 04:00 UTC." > /etc/nologin',
            description: 'Block all non-root logins displaying the custom notification text',
            example: 'Connection closed by 192.168.1.100 port 22\nScheduled maintenance in progress until 04:00 UTC.',
            explanation: 'pam_nologin intercepts auth and rejects non-root logins, printing the file contents.'
          }
        ],
        studyNotes: [
          '/etc/issue is shown BEFORE local login; /etc/issue.net before remote SSH login (requires Banner in sshd_config).',
          '/etc/motd is displayed AFTER successful user authentication.',
          'systemd-inhibit locks suspend/shutdown while critical jobs or backups run.'
        ],
        quickQuestions: [
          {
            question: 'Which file is read by pam_nologin to display a message to non-root users and prevent them from logging in during maintenance?',
            options: ['/etc/issue', '/etc/motd', '/etc/nologin', '/etc/shutdown.msg'],
            correctIndex: 2,
            explanation: '/etc/nologin blocks non-root users from authenticating and displays its contents upon rejection.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // EXAM 202 (202-450)
  // ==========================================
  {
    id: 'topic-207',
    topicNumber: 207,
    title: 'Domain Name Server (DNS)',
    totalWeight: 12,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'Basic BIND 9 configuration, forward and reverse zone maintenance, DNSSEC, and securing BIND with chroot and TSIG.',
    objectives: [
      {
        id: '207.1',
        title: 'Basic DNS Server Configuration',
        weight: 4,
        description: 'Candidates should be able to configure BIND 9 to function as a caching and forwarding nameserver.',
        keyKnowledgeAreas: [
          'Configure named.conf sections: options, zone, logging, include, acl',
          'Configure DNS caching, forwarders, and listen-on interfaces',
          'Verify syntax with named-checkconf and manage runtime with rndc (reload, status, flush)',
          'Understand root hints (named.root / db.root) and recursion permissions'
        ],
        termsAndUtilities: [
          'named', 'named.conf', 'rndc', 'named-checkconf', 'dig', 'host'
        ],
        filesAndPaths: [
          '/etc/bind/named.conf',
          '/etc/named.conf',
          '/etc/bind/named.conf.options',
          '/etc/bind/named.conf.local',
          '/var/cache/bind/',
          '/var/named/'
        ],
        keyCommands: [
          {
            command: 'named-checkconf /etc/bind/named.conf',
            description: 'Validate BIND configuration syntax before restarting or reloading service',
            example: '',
            explanation: 'Returns silent exit code 0 if syntax is valid, prints line errors on failure.'
          },
          {
            command: 'rndc reload',
            description: 'Tell BIND daemon to reload zone files and configuration without dropping active connections',
            example: 'server reload successful',
            explanation: 'rndc communicates with named via TCP port 953 using HMAC-MD5 or SHA secret key.'
          }
        ],
        studyNotes: [
          'To prevent DNS amplification attacks, recursion should be restricted to trusted ACLs: recursion yes; allow-recursion { localhost; localnets; };.',
          'forwarders { 8.8.8.8; 1.1.1.1; }; directs unresolved queries to upstream resolvers.'
        ],
        quickQuestions: [
          {
            question: 'Which command line tool validates BIND configuration syntax without restarting named?',
            options: ['named-checkconf', 'named-checkzone', 'rndc verify', 'bind-lint'],
            correctIndex: 0,
            explanation: 'named-checkconf parses named.conf files and flags syntax errors.'
          }
        ]
      },
      {
        id: '207.2',
        title: 'Create and Maintain DNS Zones',
        weight: 4,
        description: 'Candidates should be able to create and manage authoritative forward and reverse master and slave DNS zone files.',
        keyKnowledgeAreas: [
          'DNS Resource Records: SOA (Start of Authority), NS, A, AAAA, CNAME, MX, PTR, TXT, SRV',
          'SOA parameters: Serial (YYYYMMDDNN), Refresh, Retry, Expire, Negative Cache TTL',
          'Configure primary (master) and secondary (slave) zone synchronization (AXFR / IXFR, notify, allow-transfer)',
          'Reverse DNS mapping using in-addr.arpa (IPv4) and ip6.arpa (IPv6)',
          'Validate zone files using named-checkzone'
        ],
        termsAndUtilities: [
          'named-checkzone', 'named-compilezone', 'dig', 'host', 'nslookup'
        ],
        filesAndPaths: [
          '/var/named/db.example.com',
          '/var/named/db.192.168.1',
          '/etc/bind/db.local'
        ],
        keyCommands: [
          {
            command: 'named-checkzone example.com /var/named/db.example.com',
            description: 'Verify syntax and SOA integrity of forward zone file',
            example: 'zone example.com/IN: loaded serial 2026082801\nOK',
            explanation: 'Confirms proper serial format and valid record syntax.'
          },
          {
            command: 'dig @192.168.1.10 example.com AXFR',
            description: 'Test full zone transfer (AXFR) query against the primary nameserver',
            example: '; <<>> DiG 9.18.1 <<>> @192.168.1.10 example.com AXFR\nexample.com. 3600 IN SOA ns1.example.com. admin.example.com. (...)',
            explanation: 'Should only succeed from IP addresses permitted in allow-transfer { ... };.'
          }
        ],
        studyNotes: [
          'Whenever you modify a zone file, you MUST increment the SOA serial number; otherwise secondary slaves will not sync.',
          'In reverse DNS zone names, IPv4 octets are reversed: 192.168.1.0/24 becomes 1.168.192.in-addr.arpa.'
        ],
        quickQuestions: [
          {
            question: 'What is the required action after editing records in a master zone file to ensure secondary slave servers pull the update?',
            options: [
              'Reboot the primary server',
              'Increment the SOA serial number and reload BIND',
              'Delete the reverse zone file',
              'Change the PTR records to CNAME'
            ],
            correctIndex: 1,
            explanation: 'Secondary slaves compare the master SOA serial number; if it has not increased, the update is ignored.'
          }
        ]
      },
      {
        id: '207.3',
        title: 'Securing a DNS Server',
        weight: 4,
        description: 'Candidates should be able to run BIND in a chroot jail, configure TSIG transaction signatures, and understand DNSSEC.',
        keyKnowledgeAreas: [
          'Run named in a chroot jail environment (named -t /var/named/chroot -u named)',
          'Configure Transaction Signatures (TSIG) for authenticated zone transfers and dynamic updates (tsig-keygen, dnssec-keygen)',
          'Understand DNSSEC: RRSIG, DNSKEY, DS, NSEC/NSEC3 records, and trust anchors',
          'Restrict zone transfers using allow-transfer and secure rndc with secret keys'
        ],
        termsAndUtilities: [
          'tsig-keygen', 'dnssec-keygen', 'dnssec-signzone', 'rndc-confgen'
        ],
        filesAndPaths: [
          '/etc/bind/rndc.key',
          '/etc/bind/tsig.key',
          '/var/named/chroot/'
        ],
        keyCommands: [
          {
            command: 'tsig-keygen -a hmac-sha256 slave-transfer-key',
            description: 'Generate shared secret key block for securing zone transfers between BIND instances',
            example: 'key "slave-transfer-key" {\n\talgorithm hmac-sha256;\n\tsecret "eW91cnNlY3JldGtleWhlcmU=";\n};',
            explanation: 'Key block is placed in named.conf on both master and slave servers.'
          }
        ],
        studyNotes: [
          'DNSSEC provides origin authentication and data integrity for DNS responses; it does NOT provide encryption/confidentiality.',
          'In chroot mode, all necessary device nodes (/dev/null, /dev/random) and zone paths must exist inside the chroot root.'
        ],
        quickQuestions: [
          {
            question: 'What primary security guarantees are provided by DNSSEC?',
            options: [
              'Encrypts all DNS queries so ISPs cannot see lookups',
              'Origin authentication and cryptographic integrity of DNS resource records',
              'Automated DDoS mitigation',
              'Password protection for web servers'
            ],
            correctIndex: 1,
            explanation: 'DNSSEC authenticates that responses originate from the legitimate zone and were not altered in transit.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-208',
    topicNumber: 208,
    title: 'Web Services',
    totalWeight: 12,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'Apache2 configuration, virtual hosts, SSL/TLS certificates, Squid caching proxy, and Nginx web server/reverse proxy.',
    objectives: [
      {
        id: '208.1',
        title: 'Basic Apache Configuration',
        weight: 4,
        description: 'Candidates should be able to configure Apache 2.4 web server, directory permissions, and virtual hosts.',
        keyKnowledgeAreas: [
          'Apache configuration hierarchy: httpd.conf / apache2.conf, conf.d/, sites-available/, sites-enabled/',
          'Directory directives: DocumentRoot, DirectoryIndex, Options (FollowSymLinks, Indexes), AllowOverride, Require all granted/denied',
          'Virtual hosting: Name-based <VirtualHost *:80> with ServerName and ServerAlias',
          'Module management: a2enmod, a2dismod, a2ensite, a2dissite, apachectl configtest'
        ],
        termsAndUtilities: [
          'apache2', 'httpd', 'apachectl', 'apache2ctl', 'a2enmod', 'a2dismod', 'a2ensite', 'a2dissite', 'htpasswd'
        ],
        filesAndPaths: [
          '/etc/apache2/apache2.conf',
          '/etc/httpd/conf/httpd.conf',
          '/etc/apache2/sites-available/',
          '/etc/apache2/mods-enabled/',
          '/var/log/apache2/access.log',
          '/var/log/apache2/error.log'
        ],
        keyCommands: [
          {
            command: 'apache2ctl configtest',
            description: 'Check Apache configuration files for syntax errors without interrupting web traffic',
            example: 'Syntax OK',
            explanation: 'Always run before systemctl reload apache2.'
          },
          {
            command: 'a2ensite 001-mysite.conf && systemctl reload apache2',
            description: 'Enable virtual host by symlinking from sites-available to sites-enabled',
            example: 'Enabling site 001-mysite.\nTo activate the new configuration, you need to run:\n  systemctl reload apache2',
            explanation: 'Standard Debian/Ubuntu Apache virtual host activation tool.'
          },
          {
            command: 'htpasswd -c /etc/apache2/.htpasswd john',
            description: 'Create new password file (-c) and add hashed password for user john for Basic Auth',
            example: 'New password: ****\nRe-type new password: ****\nAdding password for user john',
            explanation: 'Used in conjunction with AuthType Basic in .htaccess or <Directory> block.'
          }
        ],
        studyNotes: [
          'Options -Indexes prevents directory listing when no index.html is present in DocumentRoot.',
          'AllowOverride None prevents .htaccess files from overriding server configuration, boosting performance.'
        ],
        quickQuestions: [
          {
            question: 'Which Apache directive is used to prevent directory index listing when an index file is missing?',
            options: ['Options -Indexes', 'DirectoryIndex Off', 'AllowOverride None', 'Require all denied'],
            correctIndex: 0,
            explanation: 'Options -Indexes disables directory browsing, returning a 403 Forbidden.'
          }
        ]
      },
      {
        id: '208.2',
        title: 'Apache Configuration for HTTPS',
        weight: 3,
        description: 'Candidates should be able to configure SSL/TLS encryption, virtual hosts on port 443, and certificates in Apache.',
        keyKnowledgeAreas: [
          'Configure mod_ssl and <VirtualHost *:443>',
          'Directives: SSLEngine on, SSLCertificateFile, SSLCertificateKeyFile, SSLCACertificateFile',
          'Enforce modern TLS protocols (SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1) and secure ciphers (SSLCipherSuite)',
          'Understand Certificate Signing Requests (CSR), self-signed certificates, and Let\'s Encrypt (certbot)'
        ],
        termsAndUtilities: [
          'openssl', 'certbot', 'a2enmod ssl', 'apache2ctl'
        ],
        filesAndPaths: [
          '/etc/ssl/certs/',
          '/etc/ssl/private/',
          '/etc/apache2/sites-available/default-ssl.conf'
        ],
        keyCommands: [
          {
            command: 'openssl req -new -newkey rsa:2048 -nodes -keyout /etc/ssl/private/server.key -out /tmp/server.csr',
            description: 'Generate 2048-bit RSA private key without password (-nodes) and Certificate Signing Request (CSR)',
            example: 'Generating a RSA private key ...\nCountry Name (2 letter code) [XX]: US\nCommon Name (e.g. server FQDN): www.example.com',
            explanation: 'Common Name (CN) must match the domain name.'
          }
        ],
        studyNotes: [
          'SNI (Server Name Indication) allows multiple SSL/TLS virtual hosts with distinct certificates to share a single IP address.',
          'Private keys must be kept strictly protected with chmod 600 in /etc/ssl/private/.'
        ],
        quickQuestions: [
          {
            question: 'What technology allows Apache to host multiple distinct HTTPS websites with separate SSL certificates on a single IP address?',
            options: ['Server Name Indication (SNI)', 'HTTP/2 Multiplexing', 'HSTS Header', 'Squid Caching'],
            correctIndex: 0,
            explanation: 'SNI includes the requested hostname in the initial TLS ClientHello handshake before certificate exchange.'
          }
        ]
      },
      {
        id: '208.3',
        title: 'Implementing Squid as a Caching Proxy',
        weight: 2,
        description: 'Candidates should be able to configure Squid proxy for web caching, client access control (ACLs), and authentication.',
        keyKnowledgeAreas: [
          'Configure squid.conf: http_port 3128, cache_dir, cache_mem',
          'Define Access Control Lists (ACLs): acl localnet src 192.168.1.0/24, acl bad_sites dstdomain .badsite.com',
          'Enforce access rules: http_access allow localnet / http_access deny bad_sites',
          'Configure authentication helpers (basic_ncsa_auth) and manage disk cache (squid -z)'
        ],
        termsAndUtilities: [
          'squid', 'squidclient', 'htpasswd'
        ],
        filesAndPaths: [
          '/etc/squid/squid.conf',
          '/var/log/squid/access.log',
          '/var/log/squid/cache.log',
          '/var/spool/squid/'
        ],
        keyCommands: [
          {
            command: 'squid -k reconfigure',
            description: 'Tell running Squid daemon to re-parse configuration file without stopping traffic',
            example: '',
            explanation: 'Validates and applies changes made to squid.conf.'
          },
          {
            command: 'squid -z',
            description: 'Initialize swap/disk cache directories defined in cache_dir directive',
            example: 'Creating Swap Directories...',
            explanation: 'Required once before starting a freshly installed Squid server.'
          }
        ],
        studyNotes: [
          'Squid evaluates http_access rules from top to bottom; the first matching rule terminates evaluation.',
          'Default Squid proxy port is TCP 3128.'
        ],
        quickQuestions: [
          {
            question: 'Which Squid command initializes the swap disk cache directories defined in cache_dir?',
            options: ['squid -z', 'squid -k init', 'squid --format', 'squidclient cache'],
            correctIndex: 0,
            explanation: 'squid -z creates and indexes swap directories on disk.'
          }
        ]
      },
      {
        id: '208.4',
        title: 'Implementing Nginx as a Web Server and Reverse Proxy',
        weight: 3,
        description: 'Candidates should be able to configure Nginx as a high-performance HTTP server, SSL endpoint, and reverse proxy load balancer.',
        keyKnowledgeAreas: [
          'Nginx configuration structure: http, server, location blocks in nginx.conf and conf.d/',
          'Directives: listen, server_name, root, index, try_files, error_page',
          'Reverse proxy configuration: proxy_pass http://backend_pool, proxy_set_header Host $host, proxy_set_header X-Real-IP $remote_addr',
          'Load balancing algorithms: upstream backend_pool { server srv1; server srv2; ip_hash; }',
          'FastCGI integration for PHP: fastcgi_pass unix:/run/php/php-fpm.sock'
        ],
        termsAndUtilities: [
          'nginx', 'nginx -t', 'nginx -s reload'
        ],
        filesAndPaths: [
          '/etc/nginx/nginx.conf',
          '/etc/nginx/conf.d/*.conf',
          '/etc/nginx/sites-available/',
          '/var/log/nginx/access.log',
          '/var/log/nginx/error.log'
        ],
        keyCommands: [
          {
            command: 'nginx -t',
            description: 'Test Nginx configuration files for syntax errors before reloading',
            example: 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful',
            explanation: 'Essential safety test before running nginx -s reload.'
          },
          {
            command: 'nginx -s reload',
            description: 'Gracefully reload Nginx master and worker processes without dropping client TCP sockets',
            example: '',
            explanation: 'Spawns new workers with updated config and retires old workers once ongoing requests finish.'
          }
        ],
        studyNotes: [
          'try_files $uri $uri/ /index.php?$args; is the core directive for Single Page Applications and PHP front-controllers.',
          'Nginx event-driven asynchronous architecture consumes significantly less memory per connection than Apache prefork.'
        ],
        quickQuestions: [
          {
            question: 'Which directive in an Nginx location block forwards incoming HTTP requests to an upstream backend server?',
            options: ['proxy_pass', 'proxy_forward', 'upstream_redirect', 'fastcgi_route'],
            correctIndex: 0,
            explanation: 'proxy_pass http://backend_address specifies the destination target for reverse proxying.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-209',
    topicNumber: 209,
    title: 'File Sharing',
    totalWeight: 11,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'Samba server and client configuration for Windows interoperability, and Network File System (NFS v3/v4).',
    objectives: [
      {
        id: '209.1',
        title: 'SAMBA Server Configuration',
        weight: 5,
        description: 'Candidates should be able to configure Samba to share files and printers with Windows/Linux clients and manage users.',
        keyKnowledgeAreas: [
          'Samba daemons: smbd (file/print sharing), nmbd (NetBIOS name service), winbindd (AD integration)',
          'Configure smb.conf sections: [global], [homes], [printers], [custom_share]',
          'Directives: path, valid users, read only, writable, browseable, create mask, directory mask, guest ok',
          'Manage Samba user credentials with smbpasswd and pdbedit',
          'Samba client testing: testparm, smbclient -L //server, mount -t cifs'
        ],
        termsAndUtilities: [
          'smbd', 'nmbd', 'winbindd', 'testparm', 'smbpasswd', 'pdbedit', 'smbclient', 'mount.cifs'
        ],
        filesAndPaths: [
          '/etc/samba/smb.conf',
          '/var/log/samba/',
          '/var/lib/samba/private/passdb.tdb'
        ],
        keyCommands: [
          {
            command: 'testparm -s /etc/samba/smb.conf',
            description: 'Check Samba configuration syntax and print active parameter dump',
            example: 'Loaded services file OK.\nServer role: ROLE_STANDALONE',
            explanation: 'Verifies smb.conf parameters and flags unrecognized options.'
          },
          {
            command: 'smbpasswd -a alice',
            description: 'Add existing system user alice to Samba password database passdb.tdb and prompt for password',
            example: 'New SMB password: ****\nRetype SMB password: ****\nAdded user alice.',
            explanation: 'User must already exist in /etc/passwd.'
          },
          {
            command: 'smbclient -L //192.168.1.10 -U alice',
            description: 'Query and list available SMB shares on remote server using authenticated user alice',
            example: 'Sharename       Type      Comment\n---------       ----      -------\npublic          Disk      Public Share\nIPC$            IPC       IPC Service',
            explanation: 'Tests connectivity and permissions from Linux terminal.'
          }
        ],
        studyNotes: [
          'Samba passwords are stored in passdb.tdb, separate from /etc/shadow.',
          'writable = yes is the exact inverse of read only = no.'
        ],
        quickQuestions: [
          {
            question: 'Which command tests the syntax of /etc/samba/smb.conf and lists default/configured share parameters?',
            options: ['smbcheck', 'testparm', 'smbclient -t', 'pdbedit -v'],
            correctIndex: 1,
            explanation: 'testparm is the official configuration verification utility for Samba.'
          }
        ]
      },
      {
        id: '209.2',
        title: 'NFS Server Configuration',
        weight: 3,
        description: 'Candidates should be able to export directories via NFSv3/NFSv4 and mount shares on client systems.',
        keyKnowledgeAreas: [
          'Configure /etc/exports and /etc/exports.d/',
          'Export options: ro, rw, sync, async, no_subtree_check, all_squash, root_squash, no_root_squash, anonuid, anongid',
          'Manage active exports: exportfs (-a, -r, -v, -u)',
          'NFS daemons and RPC: nfsd, rpcbind, mountd, idmapd',
          'Mount NFS shares: mount -t nfs -o proto=tcp,vers=4 server:/export /mnt/nfs'
        ],
        termsAndUtilities: [
          'exportfs', 'showmount', 'rpcinfo', 'nfsstat', 'nfsd', 'mount.nfs'
        ],
        filesAndPaths: [
          '/etc/exports',
          '/etc/exports.d/*.exports',
          '/etc/idmapd.conf',
          '/proc/fs/nfsd/exports'
        ],
        keyCommands: [
          {
            command: 'exportfs -rav',
            description: 'Re-export all shares defined in /etc/exports with verbose output without restarting nfs-server',
            example: 'exporting 192.168.1.0/24:/data/share\nexporting *.company.com:/var/nfs',
            explanation: '-r re-reads /etc/exports, -a applies all, -v shows details.'
          },
          {
            command: 'showmount -e 192.168.1.10',
            description: 'Query remote NFS server to display all exported directory paths and client access lists',
            example: 'Export list for 192.168.1.10:\n/data/share 192.168.1.0/24\n/var/backup *.company.com',
            explanation: 'Useful for confirming that the server is publishing the share.'
          }
        ],
        studyNotes: [
          'root_squash (default) maps client UID 0 (root) to nobody (anonuid) on the server for security.',
          'NFSv4 does not require rpcbind and operates strictly over TCP port 2049.'
        ],
        quickQuestions: [
          {
            question: 'What is the effect of the default root_squash option in /etc/exports?',
            options: [
              'Blocks root user from reading any file',
              'Maps client root user (UID 0) requests to the unprivileged nobody account on the server',
              'Allows root user full unrestricted privileges',
              'Compresses files created by root'
            ],
            correctIndex: 1,
            explanation: 'root_squash prevents client root accounts from having administrative access to the server filesystem.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-210',
    topicNumber: 210,
    title: 'Network Client Management',
    totalWeight: 7,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'DHCP server and client configuration, Pluggable Authentication Modules (PAM), and LDAP client integration.',
    objectives: [
      {
        id: '210.1',
        title: 'DHCP Configuration',
        weight: 2,
        description: 'Candidates should be able to configure ISC DHCP server and understand lease negotiation and static reservations.',
        keyKnowledgeAreas: [
          'Configure dhcpd.conf: subnet, netmask, range, option routers, option domain-name-servers, default-lease-time, max-lease-time',
          'Configure fixed IP host reservations using hardware ethernet MAC address',
          'DHCP lease database file /var/lib/dhcp/dhcpd.leases',
          'Understand DORA handshake: Discover, Offer, Request, Acknowledge (UDP 67/68)'
        ],
        termsAndUtilities: [
          'dhcpd', 'dhclient'
        ],
        filesAndPaths: [
          '/etc/dhcp/dhcpd.conf',
          '/var/lib/dhcp/dhcpd.leases',
          '/var/lib/dhcp/dhclient.leases'
        ],
        keyCommands: [
          {
            command: 'dhclient -r eth0 && dhclient -v eth0',
            description: 'Release (-r) active DHCP lease on eth0 and request new lease with verbose output',
            example: 'DHCPDISCOVER on eth0 to 255.255.255.255 port 67...\nDHCPOFFER of 192.168.1.85 from 192.168.1.1\nDHCPREQUEST for 192.168.1.85...\nDHCPACK of 192.168.1.85',
            explanation: 'Steps through DORA exchange.'
          }
        ],
        studyNotes: [
          'DHCP server listens on UDP port 67; DHCP client listens on UDP port 68.',
          'Static host declaration in dhcpd.conf: host printer { hardware ethernet 00:11:22:33:44:55; fixed-address 192.168.1.200; }.'
        ],
        quickQuestions: [
          {
            question: 'What are the four sequential steps in the DHCP lease negotiation process?',
            options: [
              'Discover, Offer, Request, Acknowledge (DORA)',
              'Direct, Open, Read, Access',
              'Dial, Obtain, Route, Accept',
              'Detect, Organize, Receive, Apply'
            ],
            correctIndex: 0,
            explanation: 'DORA: Client sends Discover, server replies with Offer, client sends Request, server finishes with ACK.'
          }
        ]
      },
      {
        id: '210.2',
        title: 'PAM Authentication',
        weight: 3,
        description: 'Candidates should be able to configure Pluggable Authentication Modules (PAM) architecture and enforce security policies.',
        keyKnowledgeAreas: [
          'PAM module types: auth (authenticate identity), account (check account validity/expiration), password (update credentials), session (setup environment)',
          'Control flags: required (must succeed, continues chain), requisite (must succeed, fails immediately), sufficient (if succeeds and no previous required failed, returns success immediately), optional',
          'PAM configuration files: /etc/pam.conf and /etc/pam.d/<service-name>',
          'Common modules: pam_unix.so, pam_deny.so, pam_permit.so, pam_tally2.so / pam_faillock.so, pam_limits.so, pam_wheel.so',
          'Resource limits in /etc/security/limits.conf (nofile, nproc, maxlogins, hard vs soft limits)'
        ],
        termsAndUtilities: [
          'pam_tally2', 'faillock', 'pam_limits', 'ulimit'
        ],
        filesAndPaths: [
          '/etc/pam.d/',
          '/etc/pam.conf',
          '/etc/security/limits.conf',
          '/etc/security/limits.d/'
        ],
        keyCommands: [
          {
            command: 'faillock --user alice',
            description: 'Query failed authentication attempts and lock status for user alice',
            example: 'alice:\nWhen                Type  Source                                           Valid\n2026-08-28 12:10:01 RHOST 192.168.1.45                                         V',
            explanation: 'Used by pam_faillock to mitigate brute-force password guessing.'
          },
          {
            command: 'ulimit -n',
            description: 'Display soft limit for maximum open file descriptors for the current shell session',
            example: '1024',
            explanation: 'Configured in /etc/security/limits.conf: * soft nofile 65535.'
          }
        ],
        studyNotes: [
          'requisite fails immediately without testing remaining modules; required tests all modules before returning failure.',
          'soft limits in limits.conf can be raised by the user up to the hard limit ceiling.'
        ],
        quickQuestions: [
          {
            question: 'In PAM, what happens if a module marked with the requisite control flag fails?',
            options: [
              'The failure is logged and the remaining modules in the stack continue executing',
              'Authentication fails immediately, aborting the rest of the module stack',
              'The failure is ignored if an optional module succeeds',
              'The user is prompted for a secondary password'
            ],
            correctIndex: 1,
            explanation: 'requisite causes immediate failure and termination of the module chain upon failure.'
          }
        ]
      },
      {
        id: '210.3',
        title: 'LDAP Client Usage',
        weight: 2,
        description: 'Candidates should be able to query LDAP directories and configure Linux to use LDAP for user authentication.',
        keyKnowledgeAreas: [
          'LDAP hierarchical schema: dc (Domain Component), ou (Organizational Unit), cn (Common Name), uid',
          'Search directory with ldapsearch (-x simple auth, -b searchbase, -D bindDN, -W prompt password, -H uri)',
          'Configure LDAP client in /etc/ldap/ldap.conf and SSSD (/etc/sssd/sssd.conf) or nslcd',
          'Configure NSS (Name Service Switch) in /etc/nsswitch.conf: passwd: files sssd'
        ],
        termsAndUtilities: [
          'ldapsearch', 'ldapadd', 'ldapmodify', 'ldapdelete', 'nsswitch.conf', 'sssctl'
        ],
        filesAndPaths: [
          '/etc/ldap/ldap.conf',
          '/etc/openldap/ldap.conf',
          '/etc/nsswitch.conf',
          '/etc/sssd/sssd.conf'
        ],
        keyCommands: [
          {
            command: 'ldapsearch -x -H ldap://ldap.example.com -b "dc=example,dc=com" "(uid=john)" cn mail',
            description: 'Query remote LDAP server with simple authentication (-x) for user with uid john',
            example: 'dn: uid=john,ou=People,dc=example,dc=com\ncn: John Doe\nmail: john@example.com',
            explanation: '-b defines search base; only returns attributes cn and mail.'
          }
        ],
        studyNotes: [
          '/etc/nsswitch.conf defines lookup order for databases (e.g. passwd: files sssd dns).',
          'SSSD (System Security Services Daemon) caches remote LDAP credentials for offline logins.'
        ],
        quickQuestions: [
          {
            question: 'Which file configures the lookup priority for user accounts, groups, and hostnames between local files and remote directory services?',
            options: ['/etc/nsswitch.conf', '/etc/ldap/ldap.conf', '/etc/pam.d/common-auth', '/etc/resolv.conf'],
            correctIndex: 0,
            explanation: '/etc/nsswitch.conf directs the C library Name Service Switch for passwd, group, hosts lookups.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-211',
    topicNumber: 211,
    title: 'E-Mail Services',
    totalWeight: 8,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'MTA management with Postfix, mail filtering with Dovecot, Procmail/Sieve, and IMAP/POP3 services.',
    objectives: [
      {
        id: '211.1',
        title: 'Using E-Mail Servers (Postfix/Sendmail)',
        weight: 4,
        description: 'Candidates should be able to configure Postfix MTA for sending, receiving, relaying, and virtual aliases.',
        keyKnowledgeAreas: [
          'Postfix configuration files: main.cf (myhostname, mydomain, myorigin, mydestination, mynetworks, relayhost, inet_interfaces) and master.cf',
          'Manage mail queues: mailq, postqueue (-p, -f), postsuper (-d, -h, -r)',
          'Manage alias databases with newaliases and postalias (/etc/aliases)',
          'Configure recipient canonical and virtual alias maps (postmap /etc/postfix/virtual)'
        ],
        termsAndUtilities: [
          'postfix', 'postconf', 'postmap', 'postalias', 'newaliases', 'mailq', 'postqueue', 'postsuper', 'sendmail'
        ],
        filesAndPaths: [
          '/etc/postfix/main.cf',
          '/etc/postfix/master.cf',
          '/etc/aliases',
          '/etc/postfix/virtual',
          '/var/spool/postfix/'
        ],
        keyCommands: [
          {
            command: 'postconf -e "mynetworks = 127.0.0.0/8, 192.168.1.0/24"',
            description: 'Safely edit Postfix main.cf parameter without corrupting file syntax',
            example: '',
            explanation: 'postconf -e modifies parameters directly in main.cf.'
          },
          {
            command: 'postsuper -d ALL',
            description: 'Purge and delete all pending e-mail messages currently waiting in the Postfix queue',
            example: 'postsuper: Deleted: 142 messages',
            explanation: 'Cleans out stuck or spam mail queues.'
          },
          {
            command: 'newaliases',
            description: 'Compile /etc/aliases text table into binary Berkeley DB format /etc/aliases.db',
            example: '',
            explanation: 'Required every time /etc/aliases is modified.'
          }
        ],
        studyNotes: [
          'mynetworks defines IP ranges permitted to relay outbound mail through the server without authentication.',
          'Never leave an open relay (allowing arbitrary external clients to send to arbitrary external domains).'
        ],
        quickQuestions: [
          {
            question: 'Which Postfix command flushes the mail queue to force immediate delivery attempts for queued messages?',
            options: ['postqueue -f', 'postsuper -d', 'mailq -r', 'sendmail -b'],
            correctIndex: 0,
            explanation: 'postqueue -f forces Postfix to flush the deferred mail queue immediately.'
          }
        ]
      },
      {
        id: '211.2',
        title: 'Managing E-Mail Delivery',
        weight: 2,
        description: 'Candidates should be able to configure user mailboxes, mbox vs Maildir storage, and mail filtering with Sieve/Procmail.',
        keyKnowledgeAreas: [
          'Mail storage formats: mbox (single monolithic file in /var/mail/user) vs Maildir (cur, new, tmp directories in ~/Maildir/)',
          'Local delivery agents (MDA): Dovecot LDA, Postfix local, Procmail',
          'Sieve email filtering rules (vacation auto-responder, folder sorting)'
        ],
        termsAndUtilities: [
          'procmail', 'sieve', 'dovecot-lda'
        ],
        filesAndPaths: [
          '/var/mail/',
          '~/Maildir/',
          '~/.procmailrc',
          '~/.dovecot.sieve'
        ],
        keyCommands: [
          {
            command: 'postconf -e "home_mailbox = Maildir/"',
            description: 'Configure Postfix to deliver incoming email to per-user Maildir directory in ~/Maildir/',
            example: '',
            explanation: 'Avoids mbox file locking issues during concurrent reads/writes.'
          }
        ],
        studyNotes: [
          'Maildir uses 3 subdirectories: cur (read mail), new (unread mail), and tmp (in-flight delivery).',
          'Maildir does not require file locks, making it vastly superior to mbox for high concurrency.'
        ],
        quickQuestions: [
          {
            question: 'What are the three standard subdirectories present in a user Maildir directory?',
            options: [
              'cur, new, tmp',
              'inbox, sent, trash',
              'drafts, archive, junk',
              'read, unread, hold'
            ],
            correctIndex: 0,
            explanation: 'Maildir structure consists of cur, new, and tmp.'
          }
        ]
      },
      {
        id: '211.3',
        title: 'Managing Remote E-Mail Delivery',
        weight: 2,
        description: 'Candidates should be able to configure Dovecot for secure IMAP, IMAPS, POP3, and POP3S client access.',
        keyKnowledgeAreas: [
          'Dovecot configuration: dovecot.conf and conf.d/ (10-mail.conf, 10-auth.conf, 10-ssl.conf, 10-master.conf)',
          'Protocols and ports: POP3 (110), POP3S (995), IMAP (143), IMAPS (993)',
          'Configure SSL certificates (ssl_cert, ssl_key) and mail_location (e.g. maildir:~/Maildir)',
          'Manage Dovecot services with doveadm'
        ],
        termsAndUtilities: [
          'dovecot', 'doveadm'
        ],
        filesAndPaths: [
          '/etc/dovecot/dovecot.conf',
          '/etc/dovecot/conf.d/10-mail.conf',
          '/etc/dovecot/conf.d/10-ssl.conf',
          '/var/log/dovecot.log'
        ],
        keyCommands: [
          {
            command: 'doveadm auth test alice secretpassword',
            description: 'Test Dovecot authentication backend and password validation for user alice',
            example: 'passdb: alice auth succeeded\nextra fields:\n  user=alice',
            explanation: 'Verifies PAM or passwd passdb authentication.'
          }
        ],
        studyNotes: [
          'IMAP keeps messages synchronized on the central server; POP3 typically downloads and deletes them locally.',
          'doveconf -n outputs only the non-default active settings, making troubleshooting cleaner.'
        ],
        quickQuestions: [
          {
            question: 'Which standard TCP port is used for secure IMAP over SSL/TLS (IMAPS)?',
            options: ['110', '143', '993', '995'],
            correctIndex: 2,
            explanation: 'TCP port 993 is assigned to IMAPS; port 995 is POP3S.'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-212',
    topicNumber: 212,
    title: 'System Security',
    totalWeight: 10,
    examId: 'exam-202',
    certification: 'lpic-2',
    description: 'Firewalling with iptables and nftables, intrusion detection with fail2ban and Snort, OpenVPN, and port scanning with nmap.',
    objectives: [
      {
        id: '212.1',
        title: 'Configuring a Router (Firewalling & NAT)',
        weight: 3,
        description: 'Candidates should be able to configure Linux packet filtering, NAT (Network Address Translation), and port forwarding using iptables and nftables.',
        keyKnowledgeAreas: [
          'Packet forwarding: echo 1 > /proc/sys/net/ipv4/ip_forward',
          'iptables tables (filter, nat, mangle) and built-in chains (INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING)',
          'iptables targets: ACCEPT, DROP, REJECT, LOG, MASQUERADE, SNAT, DNAT',
          'Stateful packet inspection with -m state --state ESTABLISHED,RELATED or -m conntrack',
          'Modern nftables rulesets, tables, chains, and nft command'
        ],
        termsAndUtilities: [
          'iptables', 'iptables-save', 'iptables-restore', 'nft', 'ip6tables'
        ],
        filesAndPaths: [
          '/etc/iptables/rules.v4',
          '/etc/nftables.conf',
          '/proc/sys/net/ipv4/ip_forward'
        ],
        keyCommands: [
          {
            command: 'iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE',
            description: 'Enable dynamic Source NAT (Masquerading) for all private subnet traffic leaving outbound interface eth0',
            example: '',
            explanation: 'Allows LAN devices with private RFC1918 IPs to share a single public WAN IP.'
          },
          {
            command: 'iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT',
            description: 'Allow returning traffic for already established outbound connections',
            example: '',
            explanation: 'Essential first rule in stateful firewall setups before dropping unmatched packets.'
          },
          {
            command: 'iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.50:80',
            description: 'Forward incoming port 8080 traffic to internal web server port 80 (Port Forwarding)',
            example: '',
            explanation: 'DNAT modifies destination IP in PREROUTING chain.'
          }
        ],
        studyNotes: [
          'DROP silently discards packets; REJECT responds with an ICMP Port Unreachable packet.',
          'iptables-save > /etc/iptables/rules.v4 persists rules across reboots.'
        ],
        quickQuestions: [
          {
            question: 'Which iptables table and chain are used to perform Port Forwarding (Destination NAT) on incoming packets?',
            options: [
              'filter table, INPUT chain',
              'nat table, PREROUTING chain',
              'nat table, POSTROUTING chain',
              'mangle table, FORWARD chain'
            ],
            correctIndex: 1,
            explanation: 'Destination NAT (DNAT) must occur in the nat table PREROUTING chain before routing decisions are calculated.'
          }
        ]
      },
      {
        id: '212.2',
        title: 'Managing Network Security',
        weight: 4,
        description: 'Candidates should be able to audit network security using nmap, mitigate brute force attacks with fail2ban, and use IDS tools like Snort and OpenVAS.',
        keyKnowledgeAreas: [
          'Network port scanning with nmap (-sS SYN stealth, -sT TCP connect, -sU UDP, -p, -A aggressive/OS/version)',
          'Automated IP banning with fail2ban (jail.conf, jail.local, fail2ban-client status/banip/unbanip)',
          'Intrusion Detection Systems (IDS): Snort rule syntax and signature matching',
          'Vulnerability scanning with OpenVAS / Greenbone',
          'Security audit tools: chkrootkit, rkhunter, lynis'
        ],
        termsAndUtilities: [
          'nmap', 'fail2ban-client', 'fail2ban-server', 'snort', 'lynis', 'rkhunter', 'chkrootkit'
        ],
        filesAndPaths: [
          '/etc/fail2ban/jail.conf',
          '/etc/fail2ban/jail.local',
          '/var/log/fail2ban.log',
          '/etc/snort/snort.conf'
        ],
        keyCommands: [
          {
            command: 'nmap -sS -sV -p 1-1024 192.168.1.1',
            description: 'Perform SYN stealth scan with service version detection on well-known ports 1-1024',
            example: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 9.2p1\n80/tcp open  http    nginx 1.24.0',
            explanation: '-sS sends SYN and does not complete 3-way handshake, minimizing logging.'
          },
          {
            command: 'fail2ban-client status sshd',
            description: 'Check active fail2ban jail status, failed attempt counts, and currently banned IP list',
            example: 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 2\n|  `- Total failed:     84\n`- Actions\n   |- Currently banned: 3\n   `- Banned IP list:   203.0.113.5 198.51.100.22',
            explanation: 'fail2ban parses log files and adds temporary DROP rules into iptables.'
          }
        ],
        studyNotes: [
          'Always customize fail2ban in /etc/fail2ban/jail.local, never directly in jail.conf (which is overwritten on updates).',
          'Snort rule header structure: action proto src_ip src_port -> dst_ip dst_port (options).'
        ],
        quickQuestions: [
          {
            question: 'Which nmap scanning mode sends a TCP SYN packet and tears down the connection before the 3-way handshake completes?',
            options: ['-sT (Connect scan)', '-sS (SYN stealth scan)', '-sU (UDP scan)', '-sA (ACK scan)'],
            correctIndex: 1,
            explanation: '-sS is the SYN stealth scan (half-open scanning).'
          }
        ]
      },
      {
        id: '212.3',
        title: 'OpenVPN & IPsec',
        weight: 3,
        description: 'Candidates should be able to configure point-to-point and roadwarrior VPN tunnels using OpenVPN and understand IPsec protocols.',
        keyKnowledgeAreas: [
          'OpenVPN server and client configuration (.ovpn / openvpn.conf)',
          'Directives: dev tun (routed IP) vs dev tap (bridged Ethernet), proto udp/tcp, port 1194, server, client, remote, ca, cert, key, dh, push "redirect-gateway def1"',
          'Public Key Infrastructure (PKI) with Easy-RSA (build-ca, gen-req, sign-req)',
          'Understand IPsec concepts: IKE (Internet Key Exchange), AH (Authentication Header), ESP (Encapsulating Security Payload), transport mode vs tunnel mode'
        ],
        termsAndUtilities: [
          'openvpn', 'easy-rsa', 'ipsec', 'strongswan'
        ],
        filesAndPaths: [
          '/etc/openvpn/server/',
          '/etc/openvpn/client/',
          '/etc/ipsec.conf',
          '/etc/strongswan.conf'
        ],
        keyCommands: [
          {
            command: 'openvpn --config /etc/openvpn/client/client.ovpn',
            description: 'Initiate OpenVPN client tunnel to remote gateway using profile configuration file',
            example: 'UDP link local: (not bound)\nUDP link remote: [AF_INET]203.0.113.10:1194\n[server] Peer Connection Initiated with [AF_INET]203.0.113.10:1194\nInitialization Sequence Completed',
            explanation: 'Establishes virtual tun0 adapter and negotiates cryptographic keys.'
          }
        ],
        studyNotes: [
          'dev tun creates a Layer 3 routed IP tunnel (lighter, recommended for internet VPNs).',
          'dev tap creates a Layer 2 bridged Ethernet tunnel (supports non-IP broadcasts like NetBIOS, but higher overhead).',
          'In IPsec, ESP provides both encryption and authentication, while AH provides only authentication.'
        ],
        quickQuestions: [
          {
            question: 'What is the main operational difference between OpenVPN "dev tun" and "dev tap" device drivers?',
            options: [
              'dev tun operates at Layer 3 (routed IP); dev tap operates at Layer 2 (Ethernet bridge)',
              'dev tun only works on Linux; dev tap only works on Windows',
              'dev tun requires TCP; dev tap requires UDP',
              'dev tun does not support encryption'
            ],
            correctIndex: 0,
            explanation: 'tun is a Layer 3 virtual point-to-point IP device, while tap simulates a virtual Layer 2 Ethernet switch.'
          }
        ]
      }
    ]
  }
];
