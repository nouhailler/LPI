import { LPICTopic } from '../types';

export const lpic305TopicsData: LPICTopic[] = [
  // =========================================================================
  // TOPIC 351: FULL VIRTUALIZATION (Weight: 25)
  // =========================================================================
  {
    id: 'topic-351',
    topicNumber: 351,
    title: 'Full Virtualization',
    totalWeight: 25,
    examId: 'exam-305',
    certification: 'lpic-3',
    description: 'Hardware virtualization concepts, hypervisor architectures (Type 1 bare-metal vs Type 2 hosted), Xen hypervisor & domains, QEMU/KVM acceleration, libvirt & virsh management, virtual networking, and disk image conversions.',
    objectives: [
      {
        id: '351.1',
        title: 'Virtualization Concepts and Theory',
        weight: 6,
        description: 'Understand virtualization terminology, hypervisor architectures, processor hardware extensions (Intel VT-x, AMD-V), paravirtualization vs full hardware emulation, and virtual machine migration techniques.',
        keyKnowledgeAreas: [
          'Understand Hypervisor classification: Type 1 (bare-metal: Xen, VMware ESXi, KVM) vs Type 2 (hosted: VirtualBox, VMware Workstation)',
          'CPU virtualization extensions: Intel VT-x (VMX) and AMD-V (SVM), nested virtualization, and checking CPU flags in /proc/cpuinfo (vmx, svm)',
          'Memory virtualization: Shadow page tables, Extended Page Tables (EPT / Intel), and Rapid Virtualization Indexing (RVI / Nested Page Tables - NPT / AMD)',
          'I/O and device virtualization: Emulated devices, Paravirtualized I/O (VirtIO drivers: virtio-net, virtio-blk, virtio-scsi), and direct PCI device passthrough (IOMMU: Intel VT-d, AMD-Vi, VFIO)',
          'Virtual machine migration mechanisms: Cold offline migration, warm migration, and live migration with pre-copy memory iteration and shared SAN/NFS/Ceph storage'
        ],
        termsAndUtilities: [
          'Type 1 hypervisor', 'Type 2 hypervisor', 'Intel VT-x', 'AMD-V', 'EPT', 'NPT', 'IOMMU', 'VT-d',
          'AMD-Vi', 'VirtIO', 'VFIO', 'paravirtualization', 'full virtualization', 'hardware-assisted',
          'live migration', 'pre-copy', 'post-copy', 'overcommit', 'ballooning'
        ],
        filesAndPaths: [
          '/proc/cpuinfo',
          '/dev/kvm',
          '/sys/module/kvm_intel/parameters/nested',
          '/sys/module/kvm_amd/parameters/nested'
        ],
        keyCommands: [
          {
            command: 'egrep -c "(vmx|svm)" /proc/cpuinfo',
            description: 'Check whether the host CPU supports hardware virtualization extensions (vmx for Intel, svm for AMD).',
            example: 'grep -E --color=auto "(vmx|svm)" /proc/cpuinfo',
            explanation: 'Returns a count greater than 0 if hardware-assisted virtualization is supported by the CPU and enabled in BIOS/UEFI.'
          },
          {
            command: 'cat /sys/module/kvm_intel/parameters/nested',
            description: 'Verify if nested virtualization (running hypervisors inside virtual machines) is enabled in the KVM kernel module.',
            example: 'modprobe kvm_intel nested=1',
            explanation: 'Enables hypervisor capabilities inside guest virtual machines running on Intel processors.'
          }
        ],
        studyNotes: [
          'VirtIO provides standardized paravirtualized device drivers (network, disk, console, memory balloon) that eliminate heavy hardware emulation overhead, achieving near bare-metal performance.',
          'Memory Ballooning allows the host to dynamically reclaim unused RAM from a guest VM without rebooting, by inflating a guest balloon driver.',
          'Live migration requires either shared cluster storage (NFS, iSCSI, Ceph, GFS2) or block-level storage migration (NBD / drive-mirror), along with compatible CPU instruction sets across source and target hosts.'
        ],
        quickQuestions: [
          {
            question: 'Which CPU flag in `/proc/cpuinfo` indicates that an Intel processor has hardware-assisted virtualization enabled?',
            options: ['svm', 'vmx', 'kvm', 'ept'],
            correctIndex: 1,
            explanation: '`vmx` indicates Intel VT-x hardware virtualization support. `svm` corresponds to AMD-V.'
          },
          {
            question: 'What is the primary benefit of using VirtIO paravirtualized device drivers in a KVM guest?',
            options: ['Enables running 32-bit guests on 64-bit hosts', 'Bypasses hardware emulation loops by allowing guest OS drivers to communicate directly with hypervisor memory buffers for high I/O throughput', 'Encrypts all network and disk I/O at the hypervisor level', 'Eliminates the requirement for hardware CPU virtualization flags'],
            correctIndex: 1,
            explanation: 'VirtIO eliminates slow register-level hardware emulation, enabling direct cooperative ring-buffer communication between guest and hypervisor.'
          }
        ]
      },
      {
        id: '351.2',
        title: 'Xen',
        weight: 3,
        description: 'Understand Xen Type 1 hypervisor architecture, Domain 0 (control domain) and Domain U (unprivileged guest domains), PV (Paravirtualization) vs HVM (Hardware Virtual Machine), PVH, and manage Xen domains with xl.',
        keyKnowledgeAreas: [
          'Understand Xen architecture: Xen microkernel hypervisor, Domain 0 (Dom0 - control domain with device drivers and toolstack), and Domain U (DomU - unprivileged guest VMs)',
          'Xen guest virtualization modes: PV (Paravirtualized guests requiring modified kernel), HVM (Hardware Virtual Machine with QEMU device emulation), PVHVM, and PVH (lightweight virtualization without QEMU)',
          'Manage Xen domains using xl toolstack: create, list, shutdown, destroy, pause, unpause, reboot, save, restore, and console',
          'Configure Xen domain configuration files: bootloader, kernel, memory, vcpus, disk, vif (network interfaces), and pci passthrough',
          'Monitor Xen performance and resource utilization using xentop',
          'Xen networking modes: bridged networking (xenbr), routed, and NAT'
        ],
        termsAndUtilities: [
          'xl', 'xentop', 'Domain 0 (Dom0)', 'Domain U (DomU)', 'PV', 'HVM', 'PVH', 'PVHVM',
          'xenstore', 'xenconsoled', 'vif', 'tap', 'vbd', 'pygrub'
        ],
        filesAndPaths: [
          '/etc/xen/',
          '/etc/xen/xl.conf',
          '/var/log/xen/',
          '/etc/default/xen'
        ],
        keyCommands: [
          {
            command: 'xl list',
            description: 'Display all running, paused, and allocated Xen domains with ID, memory, VCPUs, and state flags.',
            example: 'xl list -v',
            explanation: 'Shows Domain-0 and all DomU guests along with UUID and memory reservations.'
          },
          {
            command: 'xl create /etc/xen/webserver.cfg',
            description: 'Create and start a new Xen DomU virtual machine from its configuration file.',
            example: 'xl create -c /etc/xen/webserver.cfg',
            explanation: 'The `-c` flag immediately attaches the interactive text console to the newly created domain.'
          },
          {
            command: 'xl console debian-vm',
            description: 'Attach to the virtual serial console of the running Xen guest domain `debian-vm`.',
            example: 'xl console 3',
            explanation: 'Connects to xenconsoled (use Ctrl+] to escape and return to Dom0 shell).'
          },
          {
            command: 'xentop',
            description: 'Interactive real-time performance monitor for Xen Dom0 and DomU domains (CPU%, memory, VBD I/O, VIF network throughput).',
            example: 'xentop -b -i 2',
            explanation: 'Provides top-like metrics for real-time Xen hypervisor capacity monitoring.'
          }
        ],
        studyNotes: [
          'In Xen architecture, Dom0 is the first privileged domain booted by the Xen microkernel; it controls hardware interrupts, device drivers, and issues hypercalls to manage DomU instances.',
          'PV (Paravirtualization) does not require CPU hardware virtualization extensions (VT-x/AMD-V) but requires an aware Linux kernel, whereas HVM requires hardware support and uses QEMU to emulate legacy motherboard peripherals.',
          'To exit an active Xen virtual console (`xl console`), press `Ctrl + ]`.'
        ],
        quickQuestions: [
          {
            question: 'What is the role of Domain 0 (Dom0) in the Xen hypervisor architecture?',
            options: ['It is an isolated guest VM without direct hardware access', 'It is the privileged management domain that contains hardware drivers and manages other guest domains (DomU)', 'It is the read-only Xen bootloader partition on UEFI systems', 'It is an optional web-based interface for Xen administration'],
            correctIndex: 1,
            explanation: 'Dom0 is the initial privileged control domain that has direct access to physical hardware, runs device drivers, and controls the hypervisor toolstack.'
          },
          {
            question: 'Which key combination escapes from an active `xl console` session back to the host shell?',
            options: ['Ctrl + C', 'Ctrl + ]', 'Ctrl + A + D', 'Ctrl + Alt + Del'],
            correctIndex: 1,
            explanation: '`Ctrl + ]` is the default escape character sequence to detach from a Xen domain console.'
          }
        ]
      },
      {
        id: '351.3',
        title: 'QEMU',
        weight: 4,
        description: 'Understand QEMU architecture, KVM hardware acceleration (/dev/kvm), launch and configure QEMU virtual machines from the command line, manage devices, networking, and QEMU monitor interactive commands.',
        keyKnowledgeAreas: [
          'Understand QEMU (Quick EMUlator) dual nature: full user-space software CPU emulator and kernel-accelerated KVM hypervisor executor',
          'Launch QEMU virtual machines from CLI: `qemu-system-x86_64` (options: -enable-kvm, -m, -smp, -drive, -cdrom, -boot, -netdev, -device, -vnc, -nographic, -daemonize)',
          'Configure QEMU virtual CPU models, host CPU passthrough (`-cpu host`), and NUMA topologies',
          'Configure QEMU network backends: user-mode networking (SLIRP / `-netdev user`), TAP device bridge (`-netdev tap`), and MACVTAP',
          'Configure QEMU storage: drive formats, cache modes (none, writethrough, writeback, directsync), VirtIO disk controllers (`virtio-blk-pci`, `virtio-scsi-pci`)',
          'Interact with QEMU Monitor (HMP - Human Monitor Protocol and QMP - QEMU Machine Protocol): inspect status, take internal snapshots, eject/change media, hotplug devices, and trigger reboots'
        ],
        termsAndUtilities: [
          'qemu-system-x86_64', 'qemu-system-*', 'qemu-nbd', 'KVM', '/dev/kvm', 'QEMU monitor',
          'HMP', 'QMP', 'SLIRP', 'TAP', 'virtio-net-pci', 'virtio-blk-pci', 'VNC', 'SPICE'
        ],
        filesAndPaths: [
          '/dev/kvm',
          '/dev/net/tun',
          '/etc/qemu/',
          '/etc/qemu/bridge.conf'
        ],
        keyCommands: [
          {
            command: 'qemu-system-x86_64 -enable-kvm -m 4G -smp 4 -drive file=debian.qcow2,if=virtio -netdev user,id=net0,hostfwd=tcp::2222-:22 -device virtio-net-pci,netdev=net0 -vnc :1',
            description: 'Launch a KVM-accelerated 4-core, 4GB RAM virtual machine with VirtIO disk, user networking with port forwarding (host port 2222 to guest port 22), and VNC display on port 5901.',
            example: 'qemu-system-x86_64 -enable-kvm -m 2048 -cdrom ubuntu.iso -boot d test.qcow2',
            explanation: 'Starts QEMU booting from ISO image to install OS into test.qcow2 target drive.'
          },
          {
            command: 'nc -U /tmp/qemu-monitor.sock',
            description: 'Connect to a running QEMU instance via Unix socket to access the interactive QEMU Monitor.',
            example: '(qemu) info block',
            explanation: 'Inside QEMU monitor, commands like `info block`, `info status`, `savevm snap1`, and `device_add` allow live VM control.'
          },
          {
            command: 'qemu-nbd --connect=/dev/nbd0 image.qcow2',
            description: 'Export a QCOW2 virtual disk image as a raw Network Block Device (/dev/nbd0) on the host.',
            example: 'qemu-nbd --disconnect /dev/nbd0',
            explanation: 'Allows mounting guest partitions directly on the host for maintenance without starting the VM.'
          }
        ],
        studyNotes: [
          'When running QEMU without `-enable-kvm` (or without access to `/dev/kvm`), QEMU falls back to slow Dynamic Binary Translation (TCG - Tiny Code Generator) software CPU emulation.',
          'Cache mode `cache=none` bypasses the host OS page cache (O_DIRECT) and writes directly to backing storage, providing optimal performance and safety with cluster storage.',
          'In user-mode networking (`-netdev user`), the guest can initiate outbound connections to the internet, but incoming connections require explicit port forward rules (`hostfwd`).'
        ],
        quickQuestions: [
          {
            question: 'What is the consequence of omitting `-enable-kvm` when starting a 64-bit Linux guest on a Linux host with `qemu-system-x86_64`?',
            options: ['The VM refuses to start and returns an architecture error', 'QEMU uses slow software binary translation (TCG) instead of hardware CPU virtualization', 'Networking is completely disabled for the guest', 'The disk image is automatically converted to raw format'],
            correctIndex: 1,
            explanation: 'Without `-enable-kvm`, QEMU uses TCG (Tiny Code Generator) in user space to emulate every CPU instruction in software, causing major CPU performance penalties.'
          },
          {
            question: 'Which QEMU argument forward host port 8080 to guest port 80 using user-mode (SLIRP) networking?',
            options: ['-net user,port=8080:80', '-netdev user,id=n1,hostfwd=tcp::8080-:80', '-network redirect=8080:80', '-net-forward tcp:8080->80'],
            correctIndex: 1,
            explanation: '`-netdev user,id=<id>,hostfwd=tcp::<hostport>-:<guestport>` specifies user-mode port redirection.'
          }
        ]
      },
      {
        id: '351.4',
        title: 'Libvirt Virtual Machine Management',
        weight: 9,
        description: 'Install, configure, manage, and troubleshoot virtualization hosts and guest domains using libvirt, virsh CLI, virt-install, domain XML definitions, storage pools, virtual networks, and live domain migration.',
        keyKnowledgeAreas: [
          'Understand libvirt architecture: libvirtd daemon, modular daemons (virtqemud, virtnetworkd, virtstoraged), driver model (QEMU/KVM, Xen, LXC), and client-server URI connections (`qemu:///system`, `qemu:///session`, `qemu+ssh://user@host/system`)',
          'Manage domains with virsh: list, start, shutdown, destroy, reboot, suspend, resume, autostart, dominfo, domiflist, domblklist, and console',
          'Manage domain lifecycle with XML: `virsh dumpxml`, `virsh define`, `virsh edit`, `virsh undefine`, and domain XML schema syntax',
          'Provision new virtual machines using `virt-install` (parameters: --name, --memory, --vcpus, --disk, --cdrom, --location, --network, --graphics, --os-variant, --extra-args)',
          'Manage libvirt storage pools and volumes: pool-list, pool-define-as, pool-build, pool-start, pool-autostart, vol-create-as, vol-delete, and vol-resize',
          'Manage libvirt virtual networking: net-list, net-define, net-start, net-autostart, net-edit, default NAT bridge (`virbr0`), isolated networks, and direct bridge interfaces',
          'Manage snapshots: `virsh snapshot-create-as`, `virsh snapshot-list`, `virsh snapshot-revert`, `virsh snapshot-delete`',
          'Perform domain migration between hypervisor hosts using `virsh migrate` (parameters: --live, --persistent, --undefinesource, --copy-storage-all, --verbose)'
        ],
        termsAndUtilities: [
          'libvirt', 'libvirtd', 'virsh', 'virt-install', 'virt-clone', 'virt-xml-validate', 'virt-top',
          'domain XML', 'storage pool', 'storage volume', 'virbr0', 'qemu:///system', 'qemu+ssh://',
          'snapshot-create-as', 'migrate', 'autostart', 'undefine'
        ],
        filesAndPaths: [
          '/etc/libvirt/libvirtd.conf',
          '/etc/libvirt/qemu/',
          '/etc/libvirt/qemu/networks/',
          '/etc/libvirt/storage/',
          '/var/log/libvirt/qemu/'
        ],
        keyCommands: [
          {
            command: 'virt-install --name prod-web01 --memory 4096 --vcpus 2 --disk pool=default,size=30,format=qcow2,bus=virtio --network bridge=br0,model=virtio --graphics vnc,listen=0.0.0.0 --location http://deb.debian.org/debian/dists/bookworm/main/installer-amd64/ --extra-args "console=ttyS0"',
            description: 'Automate network OS installation of a 2-VCPU, 4GB RAM guest on bridge br0 with VirtIO disk and serial console.',
            example: 'virt-install --name test --memory 2048 --vcpus 2 --disk path=/var/lib/libvirt/images/test.qcow2,size=20 --cdrom /iso/almalinux.iso --os-variant almalinux9',
            explanation: 'Creates a domain XML definition, creates storage volume, and launches OS installer.'
          },
          {
            command: 'virsh migrate --live --verbose prod-db01 qemu+ssh://kvm2.example.com/system',
            description: 'Perform a zero-downtime live migration of running VM `prod-db01` to remote hypervisor `kvm2.example.com` over SSH.',
            example: 'virsh migrate --live --copy-storage-all prod-web01 qemu+ssh://kvm2/system',
            explanation: 'Migrates active memory state while VM continues serving traffic; `--copy-storage-all` also mirrors local disk storage.'
          },
          {
            command: 'virsh snapshot-create-as --domain prod-web01 --name "pre-upgrade" --description "Snapshot before kernel upgrade" --atomic',
            description: 'Create a point-in-time snapshot of the domain memory and disk state.',
            example: 'virsh snapshot-revert prod-web01 pre-upgrade',
            explanation: 'Enables quick rollback if an upgrade or patch fails.'
          },
          {
            command: 'virsh pool-define-as --name san_pool --type dir --target /mnt/san/vms && virsh pool-start san_pool && virsh pool-autostart san_pool',
            description: 'Create, start, and configure automatic startup for a new libvirt storage pool.',
            example: 'virsh vol-create-as san_pool vm-disk01.qcow2 50G --format qcow2',
            explanation: 'Allocates a 50GB QCOW2 sparse virtual volume inside the `san_pool` storage pool.'
          }
        ],
        studyNotes: [
          '`qemu:///system` runs with root privileges and manages system-wide hardware devices and bridges (`virbr0`), whereas `qemu:///session` runs as an unprivileged user with user-mode SLIRP networking.',
          'To permanently modify a domain configuration, always use `virsh edit <domain>` (which checks XML syntax) rather than manually editing XML files under `/etc/libvirt/qemu/`.',
          '`virsh destroy` does NOT delete VM files; it performs an immediate non-graceful hard power-off (like pulling the power cord). To delete domain definition, use `virsh undefine`.'
        ],
        quickQuestions: [
          {
            question: 'What is the difference between `virsh shutdown <domain>` and `virsh destroy <domain>`?',
            options: ['`shutdown` stops the VM; `destroy` completely deletes the disk image from storage', '`shutdown` sends a graceful ACPI shutdown signal; `destroy` forcefully and immediately cuts power to the VM without deleting disk data', '`shutdown` pauses CPU execution; `destroy` creates a crash dump', '`shutdown` is for QEMU guests; `destroy` is for Xen guests'],
            correctIndex: 1,
            explanation: '`virsh shutdown` sends an ACPI power signal for graceful guest OS shutdown, whereas `virsh destroy` is an immediate forced power-off equivalent to pulling the power plug.'
          },
          {
            question: 'Which virsh command safely validates and opens the XML configuration of a domain in the default editor?',
            options: ['vi /etc/libvirt/qemu/vm1.xml', 'virsh edit vm1', 'virsh update-xml vm1', 'virt-xml --edit vm1'],
            correctIndex: 1,
            explanation: '`virsh edit <domain>` opens the XML definition in `$EDITOR` and performs schema verification upon saving before applying changes to libvirtd.'
          }
        ]
      },
      {
        id: '351.5',
        title: 'Virtual Machine Disk Image Management',
        weight: 3,
        description: 'Create, inspect, resize, convert, and repair virtual machine disk image formats (raw, qcow2, VMDK, VDI, VHD/VHDX) using qemu-img and inspect/modify offline image filesystems with guestfs tools.',
        keyKnowledgeAreas: [
          'Understand virtual disk formats: raw (unformatted, fast, no metadata), qcow2 (QEMU Copy-On-Write v2/v3, thin provisioning, internal snapshots, compression, encryption), VMDK (VMware), VDI (VirtualBox), and VHD/VHDX (Hyper-V)',
          'Manage images with `qemu-img`: info, create, convert, resize, check, commit, and snapshot',
          'Create copy-on-write backing files (`qemu-img create -f qcow2 -b base.qcow2 -F qcow2 diff.qcow2`) for golden master image templating',
          'Convert between formats (e.g. raw to qcow2, VMDK to qcow2 for hypervisor migrations)',
          'Inspect and manipulate offline disk images using libguestfs tools: `guestfish`, `virt-df`, `virt-filesystems`, `virt-cat`, `virt-edit`, `virt-sysprep`, `virt-customize`, and `virt-resize`'
        ],
        termsAndUtilities: [
          'qemu-img', 'guestfish', 'virt-df', 'virt-filesystems', 'virt-cat', 'virt-edit',
          'virt-sysprep', 'virt-customize', 'virt-resize', 'qcow2', 'raw', 'VMDK', 'VDI',
          'VHDX', 'backing file', 'copy-on-write (COW)', 'thin provisioning', 'sparse file'
        ],
        filesAndPaths: [
          '/var/lib/libvirt/images/',
          '/etc/libguestfs-tools.conf'
        ],
        keyCommands: [
          {
            command: 'qemu-img info disk.qcow2',
            description: 'Inspect virtual image format, virtual size, physical size on disk, cluster size, backing file reference, and snapshots.',
            example: 'qemu-img check disk.qcow2',
            explanation: 'Displays disk allocation metrics and verifies metadata integrity for potential corruptions.'
          },
          {
            command: 'qemu-img convert -p -f vmdk -O qcow2 vmware-disk.vmdk kvm-disk.qcow2',
            description: 'Convert a VMware VMDK disk image into an optimized QCOW2 image with progress output (-p).',
            example: 'qemu-img convert -O qcow2 -c raw-image.raw compressed.qcow2',
            explanation: 'Converts raw image into a compressed (-c) QCOW2 sparse file for efficient storage.'
          },
          {
            command: 'qemu-img resize disk.qcow2 +20G',
            description: 'Expand the virtual capacity of a QCOW2 disk image by 20 Gigabytes.',
            example: 'qemu-img resize --shrink disk.raw 50G',
            explanation: 'Expands virtual container; guest partition and filesystem can subsequently be grown online.'
          },
          {
            command: 'virt-sysprep -d template-vm --enable bash-history,ssh-hostkeys,udev-persistent-net',
            description: 'Reset and sanitize a virtual machine image to prepare it for cloning as a golden master template.',
            example: 'virt-cat -d prod-web01 /etc/hosts',
            explanation: 'Removes unique machine IDs, SSH host keys, log files, and MAC addresses without booting the VM.'
          }
        ],
        studyNotes: [
          'QCOW2 backing files (`-b`) allow multiple child VMs to share a single read-only base OS image. Writes are captured only in the child diff overlay, saving massive disk capacity.',
          'Never modify a backing base image while active child overlay images depend on it; doing so corrupts all dependent child images immediately.',
          '`virt-sysprep` is essential when building cloud templates to prevent duplicate SSH host keys and machine-id collisions across cloned instances.'
        ],
        quickQuestions: [
          {
            question: 'Which `qemu-img` command converts a raw disk image `server.raw` into a sparse `server.qcow2` image?',
            options: ['qemu-img export server.raw server.qcow2', 'qemu-img convert -f raw -O qcow2 server.raw server.qcow2', 'qemu-img format -t qcow2 server.raw', 'qemu-img migrate --format=qcow2 server.raw'],
            correctIndex: 1,
            explanation: '`qemu-img convert -f <src_fmt> -O <dst_fmt> <source> <destination>` performs format conversions.'
          },
          {
            question: 'What is the function of `virt-sysprep` when preparing a golden master image for cloning?',
            options: ['Compiles the Linux kernel for hardware passthrough', 'Sanitizes the guest image by removing machine IDs, SSH host keys, network MAC addresses, and log files', 'Defragments the guest NTFS or ext4 filesystem', 'Converts the disk format to raw format'],
            correctIndex: 1,
            explanation: '`virt-sysprep` strips out system-specific identifiers (SSH host keys, machine-id, persistent udev rules) so cloned VMs generate unique credentials upon first boot.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 352: CONTAINER VIRTUALIZATION (Weight: 25)
  // =========================================================================
  {
    id: 'topic-352',
    topicNumber: 352,
    title: 'Container Virtualization',
    totalWeight: 25,
    examId: 'exam-305',
    certification: 'lpic-3',
    description: 'Linux kernel container foundations (namespaces, cgroups v1 & v2, capabilities, seccomp, AppArmor/SELinux), system containers with LXC/LXD, Docker application container lifecycle, Dockerfiles, and container orchestration with Compose, Swarm, and Kubernetes fundamentals.',
    objectives: [
      {
        id: '352.1',
        title: 'Container Virtualization Concepts',
        weight: 7,
        description: 'Understand operating system-level virtualization, Linux kernel namespaces, Control Groups (cgroups v1 and v2), Linux capabilities (POSIX capabilities), seccomp profiles, and LSM mandatory access controls.',
        keyKnowledgeAreas: [
          'Understand OS-level virtualization: shared host kernel, zero hypervisor emulation overhead, fast startup, and process isolation boundaries',
          'Linux Kernel Namespaces: PID (process IDs), NET (network interfaces, routing, iptables), MNT (mount points/filesystems), IPC (System V IPC & POSIX message queues), UTS (hostname/domain), USER (UID/GID mapping), and CGROUP (cgroup root directory)',
          'Control Groups (cgroups): Resource limitation, prioritization, accounting, and control (CPU shares, cpuset, memory limits, blkio/io weight, pids limit)',
          'Differentiate cgroups v1 (multiple hierarchies per controller under `/sys/fs/cgroup/<controller>/`) vs cgroups v2 (unified single hierarchy under `/sys/fs/cgroup/`)',
          'Linux Capabilities: granular root privilege partitioning (CAP_NET_ADMIN, CAP_SYS_ADMIN, CAP_NET_BIND_SERVICE, CAP_CHOWN, CAP_DAC_OVERRIDE), dropping/adding capabilities with `capsh` and container engines',
          'Container security isolation: Seccomp (secure computing mode system call filtering), AppArmor container profiles, and SELinux container labels (`container_t`)'
        ],
        termsAndUtilities: [
          'namespaces', 'cgroups', 'cgroups v1', 'cgroups v2', 'PID namespace', 'NET namespace',
          'MNT namespace', 'USER namespace', 'UTS namespace', 'IPC namespace', 'CGROUP namespace',
          'capabilities', 'capsh', 'getpcaps', 'CAP_NET_ADMIN', 'CAP_SYS_ADMIN', 'seccomp',
          'unshare', 'nsenter', 'lsns', '/proc/[pid]/ns/', '/sys/fs/cgroup/'
        ],
        filesAndPaths: [
          '/proc/self/ns/',
          '/proc/sys/user/max_user_namespaces',
          '/sys/fs/cgroup/',
          '/sys/fs/cgroup/cgroup.controllers',
          '/sys/fs/cgroup/cgroup.procs'
        ],
        keyCommands: [
          {
            command: 'lsns -t net,pid,mnt',
            description: 'List all active Linux kernel namespaces on the system with type, namespace ID, owner UID, and associated process command.',
            example: 'lsns -p 1234',
            explanation: 'Inspects all namespaces held by process ID 1234.'
          },
          {
            command: 'unshare --mount --uts --net --pid --fork bash',
            description: 'Execute a new bash shell inside isolated mount, hostname, network, and process ID namespaces.',
            example: 'hostname inside-container',
            explanation: 'The new hostname only affects processes within this UTS namespace; host hostname remains untouched.'
          },
          {
            command: 'nsenter --target 1234 --net --pid bash',
            description: 'Enter the network and PID namespaces of target process 1234.',
            example: 'ip a',
            explanation: 'Runs tools in the exact network and process namespace context of a running container without SSH.'
          },
          {
            command: 'capsh --print',
            description: 'Display current process capability sets (Current, Bounding, Ambient, Inheritable).',
            example: 'capsh --drop=cap_sys_admin,cap_net_raw --',
            explanation: 'Executes a command with specific dangerous root capabilities permanently stripped from the bounding set.'
          }
        ],
        studyNotes: [
          'Containers are NOT virtual machines; they are regular Linux processes isolated by kernel namespaces and bounded by cgroups sharing the host kernel.',
          'USER namespaces allow a container root user (UID 0) to be mapped to an unprivileged non-root user (e.g. UID 100000) on the host, preventing host takeover even if a container breakout occurs.',
          'In cgroups v2, all controllers share a single unified process tree, eliminating resource contention issues present in cgroups v1 multi-hierarchy models.'
        ],
        quickQuestions: [
          {
            question: 'Which Linux namespace provides isolated network devices, IP addresses, routing tables, and firewall filter rules to a container?',
            options: ['IPC namespace', 'NET namespace', 'UTS namespace', 'MNT namespace'],
            correctIndex: 1,
            explanation: 'The NET namespace virtualizes system network stacks, giving each container its own loopback, veth interfaces, and iptables tables.'
          },
          {
            question: 'What is the primary security advantage of enabling USER namespaces for container runtimes?',
            options: ['Containers gain direct access to host physical GPU devices', 'Processes running as UID 0 (root) inside the container are mapped to an unprivileged UID on the host, preventing host root escalation', 'Bypasses the need for seccomp filters', 'Improves container memory allocation speed'],
            correctIndex: 1,
            explanation: 'USER namespaces map internal root (UID 0) to high unprivileged IDs on the host (e.g., UID 100000), mitigating privilege escalation risks.'
          }
        ]
      },
      {
        id: '352.2',
        title: 'LXC (Linux Containers)',
        weight: 6,
        description: 'Install, configure, manage, and troubleshoot LXC (Linux Containers) system containers, manage templates, storage backends (dir, btrfs, lvm, zfs), unprivileged containers, networking, and snapshotting.',
        keyKnowledgeAreas: [
          'Understand LXC (Linux Containers) architecture: system containers running full init systems (systemd, SysV) vs application containers',
          'Manage LXC containers with CLI tools: `lxc-create`, `lxc-start`, `lxc-stop`, `lxc-destroy`, `lxc-ls`, `lxc-info`, `lxc-attach`, `lxc-console`, `lxc-snapshot`',
          'LXC template and download scripts: `lxc-create -t download -- -d debian -r bookworm -a amd64`',
          'Configure LXC container configuration files: `lxc.net.*` (veth, macvlan, physical, bridge `lxcbr0`), `lxc.idmap` (subuid/subgid user mapping), `lxc.cgroup.*`, `lxc.mount.*`, `lxc.cap.drop`',
          'Configure privileged vs unprivileged LXC containers (`/etc/subuid`, `/etc/subgid`, `~/.config/lxc/default.conf`)',
          'Manage storage backends: directory (`dir`), Btrfs subvolumes, LVM thin logical volumes, and ZFS datasets'
        ],
        termsAndUtilities: [
          'lxc-create', 'lxc-start', 'lxc-stop', 'lxc-destroy', 'lxc-ls', 'lxc-info', 'lxc-attach',
          'lxc-console', 'lxc-snapshot', 'lxc-copy', 'lxc-monitor', 'lxcbr0', 'subuid', 'subgid',
          'lxc.idmap', 'lxc.net', 'lxc.cgroup2'
        ],
        filesAndPaths: [
          '/etc/lxc/default.conf',
          '/var/lib/lxc/',
          '/var/lib/lxc/<name>/config',
          '/var/lib/lxc/<name>/rootfs',
          '/etc/subuid',
          '/etc/subgid',
          '/etc/default/lxc-net'
        ],
        keyCommands: [
          {
            command: 'lxc-create -n web-ct -t download -- -d ubuntu -r noble -a amd64',
            description: 'Create a new LXC container named `web-ct` by downloading pre-built Ubuntu rootfs images.',
            example: 'lxc-create -n db-ct -t download -B lvm --vgname vg_storage --fssize 20G -- -d debian -r bookworm -a amd64',
            explanation: 'Creates a container backed by an LVM logical volume on `vg_storage`.'
          },
          {
            command: 'lxc-start -n web-ct -d && lxc-ls -f',
            description: 'Start container `web-ct` in daemonized mode (-d) and list formatted container status with IPs, state, and autostart flag.',
            example: 'lxc-info -n web-ct',
            explanation: 'Displays state (RUNNING), PID, memory usage, and IP addresses.'
          },
          {
            command: 'lxc-attach -n web-ct -- apt-get update',
            description: 'Execute a command directly inside running container `web-ct` namespace without requiring SSH or getty login.',
            example: 'lxc-attach -n web-ct',
            explanation: 'Opens an interactive root shell directly inside the container namespace.'
          },
          {
            command: 'lxc-snapshot -n web-ct',
            description: 'Create a point-in-time snapshot of container `web-ct`.',
            example: 'lxc-snapshot -n web-ct -r snap0',
            explanation: 'Restores the container back to snapshot `snap0` state.'
          }
        ],
        studyNotes: [
          'Unprivileged LXC containers run without root privileges on the host, using `/etc/subuid` and `/etc/subgid` ranges mapped via `lxc.idmap` to ensure total host safety.',
          'LXC runs an entire userland OS environment (including systemd, cron, rsyslog) behaving like a lightweight VM, whereas Docker typically runs a single entrypoint application process.',
          'Network configuration for default bridge `lxcbr0` (DHCP range and subnet) is configured in `/etc/default/lxc-net`.'
        ],
        quickQuestions: [
          {
            question: 'Which tool allows an administrator to execute commands or open a shell directly inside an active LXC container namespace without SSH?',
            options: ['lxc-enter', 'lxc-attach', 'lxc-exec', 'lxc-shell'],
            correctIndex: 1,
            explanation: '`lxc-attach -n <container_name>` connects directly to the namespaces of the target container.'
          },
          {
            question: 'Which files configure subordinate user and group ID allocation ranges for unprivileged LXC containers on Linux?',
            options: ['/etc/lxc/subusers.conf', '/etc/subuid and /etc/subgid', '/etc/security/capabilities.conf', '/etc/passwd.sub'],
            correctIndex: 1,
            explanation: '`/etc/subuid` and `/etc/subgid` allocate ranges of UIDs/GIDs to unprivileged users for user namespace mapping.'
          }
        ]
      },
      {
        id: '352.3',
        title: 'Docker',
        weight: 9,
        description: 'Install, configure, manage, and troubleshoot Docker container runtime (dockerd), build container images using Dockerfiles, manage multi-stage builds, container networks, data volumes, logging, and registries.',
        keyKnowledgeAreas: [
          'Understand Docker architecture: Docker Client, Docker Daemon (dockerd), containerd, runc (OCI runtime), and Docker Hub/private registries',
          'Manage container lifecycle: `docker run`, `docker stop`, `docker start`, `docker rm`, `docker ps`, `docker exec`, `docker logs`, `docker stats`, `docker inspect`, `docker top`, and `docker kill`',
          'Manage Docker images: `docker build`, `docker images`, `docker rmi`, `docker tag`, `docker push`, `docker pull`, `docker history`, and `docker commit`',
          'Author Dockerfiles: FROM, RUN, CMD, ENTRYPOINT, EXPOSE, ENV, ADD, COPY, VOLUME, USER, WORKDIR, ARG, HEALTHCHECK, and .dockerignore',
          'Multi-stage Dockerfile builds to minimize final production image sizes and attack surface',
          'Manage Docker data storage: bind mounts (`-v /host:/container`), named volumes (`docker volume create`), and tmpfs mounts',
          'Configure Docker networking: bridge (`bridge`), host (`host`), none (`none`), overlay (`overlay`), custom user-defined bridge networks with automatic DNS service discovery, and port publication (`-p host:container`)',
          'Configure Docker daemon settings (`/etc/docker/daemon.json`): storage drivers (overlay2), logging drivers (json-file, journald, syslog), default bridge IP, and insecure registries'
        ],
        termsAndUtilities: [
          'docker', 'dockerd', 'containerd', 'runc', 'Dockerfile', 'multi-stage build',
          '.dockerignore', 'named volume', 'bind mount', 'bridge network', 'overlay network',
          'host network', 'ENTRYPOINT', 'CMD', 'HEALTHCHECK', 'overlay2', 'daemon.json'
        ],
        filesAndPaths: [
          '/etc/docker/daemon.json',
          '/var/lib/docker/',
          '/var/lib/docker/volumes/',
          '/var/run/docker.sock',
          'Dockerfile',
          '.dockerignore'
        ],
        keyCommands: [
          {
            command: 'docker run -d --name app-server --restart unless-stopped -p 8080:80 -v app-data:/var/www/html -e NODE_ENV=production --memory="1g" --cpus="1.5" node-app:v1',
            description: 'Run container in background with port mapping, persistent named volume, environment variable, and resource constraints.',
            example: 'docker exec -it app-server /bin/sh',
            explanation: 'Runs an interactive shell inside the running container.'
          },
          {
            command: 'docker build -t myapp:2.0 -f Dockerfile .',
            description: 'Build a Docker image tagged `myapp:2.0` from current directory context.',
            example: 'docker build --no-cache --target production -t myapp:prod .',
            explanation: 'Builds specific multi-stage target without using cached intermediate layers.'
          },
          {
            command: 'docker network create --driver bridge --subnet 172.28.0.0/16 custom-net',
            description: 'Create a custom user-defined bridge network providing automatic internal container DNS name resolution.',
            example: 'docker network connect custom-net app-server',
            explanation: 'Attaches existing container to `custom-net` allowing direct communication by container name.'
          },
          {
            command: 'docker system prune -a --volumes',
            description: 'Reclaim disk space by cleaning up all stopped containers, unused networks, dangling and unreferenced images, and build caches.',
            example: 'docker volume ls -qf dangling=true | xargs -r docker volume rm',
            explanation: 'Purges orphaned storage volumes.'
          }
        ],
        studyNotes: [
          'Differences between `CMD` and `ENTRYPOINT`: `ENTRYPOINT` specifies the immutable executable binary to run; `CMD` specifies default arguments passed to `ENTRYPOINT` which can be overridden by CLI parameters in `docker run`.',
          'In user-defined bridge networks, containers resolve each other by container name or network alias using Docker\'s built-in DNS server (127.0.0.11), whereas the default `bridge` does not support automatic name resolution.',
          'Multi-stage builds allow developers to compile code in a heavy build stage (with compilers, SDKs) and copy only compiled artifacts into a lightweight runtime image (e.g. Alpine/scratch).'
        ],
        quickQuestions: [
          {
            question: 'What is the primary difference between `COPY` and `ADD` instructions in a Dockerfile?',
            options: ['`COPY` is deprecated in Docker 20+; `ADD` is mandatory', '`COPY` only copies local files into the container; `ADD` can extract local tar archives automatically and fetch remote URLs', '`COPY` executes commands as root; `ADD` runs as unprivileged user', '`COPY` creates a new volume; `ADD` creates a temporary directory'],
            correctIndex: 1,
            explanation: '`COPY` only copies local files, whereas `ADD` supports auto-extraction of local tar archives and downloading files from remote URLs (though `COPY` is preferred for best practice predictability).'
          },
          {
            question: 'Which Docker network driver enables automatic container name resolution via embedded DNS server without requiring legacy `--link` flags?',
            options: ['Default default bridge network', 'Custom user-defined bridge network (`docker network create`)', 'Host network driver', 'None network driver'],
            correctIndex: 1,
            explanation: 'Custom user-defined bridge networks provide built-in DNS service discovery allowing containers to communicate using container names.'
          }
        ]
      },
      {
        id: '352.4',
        title: 'Container Orchestration Platforms',
        weight: 3,
        description: 'Understand container orchestration principles, multi-container applications with Docker Compose, cluster orchestration with Docker Swarm, and core Kubernetes architecture and fundamentals.',
        keyKnowledgeAreas: [
          'Understand container orchestration requirements: service discovery, load balancing, health checks, automated rolling updates, self-healing, scaling, and secret/config management',
          'Manage multi-container applications using Docker Compose: `compose.yaml` / `docker-compose.yml` (services, networks, volumes, environment, depends_on, healthcheck, restart, ports)',
          'Docker Compose CLI: `docker compose up -d`, `docker compose down`, `docker compose ps`, `docker compose logs -f`, `docker compose build`, `docker compose exec`',
          'Docker Swarm cluster management: `docker swarm init`, `docker swarm join`, `docker node ls`, `docker service create`, `docker service scale`, `docker service update`, overlay networks, and routing mesh',
          'Kubernetes architecture fundamentals: Control Plane (API Server, etcd, kube-scheduler, kube-controller-manager), Worker Nodes (kubelet, kube-proxy, container runtime CRI)',
          'Kubernetes core API objects: Pods, ReplicaSets, Deployments, Services (ClusterIP, NodePort, LoadBalancer), ConfigMaps, Secrets, PersistentVolumes (PV), PersistentVolumeClaims (PVC), and basic `kubectl` commands'
        ],
        termsAndUtilities: [
          'docker compose', 'docker-compose.yml', 'Docker Swarm', 'docker service', 'docker stack',
          'overlay network', 'routing mesh', 'Kubernetes', 'k8s', 'kubectl', 'Pod', 'Deployment',
          'Service', 'kube-apiserver', 'etcd', 'kubelet', 'kube-proxy', 'Ingress'
        ],
        filesAndPaths: [
          'docker-compose.yml',
          'compose.yaml',
          '/etc/kubernetes/',
          '~/.kube/config'
        ],
        keyCommands: [
          {
            command: 'docker compose -f docker-compose.yml up -d --scale web=3',
            description: 'Start all defined multi-container services in detached mode and scale the `web` service to 3 container replicas.',
            example: 'docker compose down -v',
            explanation: 'Stops containers, removes networks, and removes associated named volumes (-v).'
          },
          {
            command: 'docker swarm init --advertise-addr 192.168.1.10',
            description: 'Initialize a new Docker Swarm cluster manager node and generate worker join tokens.',
            example: 'docker service create --name web --replicas 5 -p 80:80 nginx:alpine',
            explanation: 'Deploys a distributed 5-replica service across all Swarm worker nodes with load-balanced ingress routing mesh.'
          },
          {
            command: 'kubectl get pods,deployments,services -o wide',
            description: 'Display all running Kubernetes Pods, Deployment controllers, and Services in the current namespace with IP addresses and nodes.',
            example: 'kubectl apply -f deployment.yaml',
            explanation: 'Declaratively applies or updates Kubernetes resource definitions.'
          },
          {
            command: 'kubectl logs -f deployment/api-server --tail=50',
            description: 'Stream live stdout/stderr log output from the pods belonging to the `api-server` deployment in Kubernetes.',
            example: 'kubectl scale deployment api-server --replicas=5',
            explanation: 'Scales the deployment to 5 active pods.'
          }
        ],
        studyNotes: [
          'In Docker Swarm, the Routing Mesh allows any cluster node to accept traffic on published service ports and route it transparently to an active container on any other node.',
          'In Kubernetes, a Pod is the smallest deployable atomic compute unit, consisting of one or more tightly coupled containers sharing network namespace (localhost) and storage volumes.',
          'Docker Compose is primarily designed for single-host multi-container environments, whereas Docker Swarm and Kubernetes manage distributed multi-node clusters.'
        ],
        quickQuestions: [
          {
            question: 'What is the smallest deployable unit of compute in Kubernetes architecture?',
            options: ['Container', 'Pod', 'Service', 'Deployment'],
            correctIndex: 1,
            explanation: 'A Pod is Kubernetes\' atomic scheduling unit; it wraps one or more containers that share IP addresses, IPC, and storage volumes.'
          },
          {
            question: 'Which Docker Compose command re-builds application images and starts all defined services in the background?',
            options: ['docker compose run --build -d', 'docker compose up --build -d', 'docker compose start --rebuild', 'docker compose deploy --all'],
            correctIndex: 1,
            explanation: '`docker compose up --build -d` forces layer rebuilding before starting containers in detached background mode.'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // TOPIC 353: VM DEPLOYMENT AND PROVISIONING (Weight: 10)
  // =========================================================================
  {
    id: 'topic-353',
    topicNumber: 353,
    title: 'VM Deployment and Provisioning',
    totalWeight: 10,
    examId: 'exam-305',
    certification: 'lpic-3',
    description: 'Infrastructure as Code (IaC), Cloud management tools (OpenStack architecture & Terraform), automated VM & container image building with HashiCorp Packer, automated instance initialization with cloud-init, and rapid developer environment orchestration with Vagrant.',
    objectives: [
      {
        id: '353.1',
        title: 'Cloud Management Tools',
        weight: 2,
        description: 'Understand Cloud and IaaS management platforms (OpenStack core services and CloudStack) and Infrastructure as Code (IaC) principles using HashiCorp Terraform.',
        keyKnowledgeAreas: [
          'Understand Infrastructure as a Service (IaaS) principles, multi-tenancy, self-service provisioning, and API-driven automation',
          'OpenStack architecture and core service components: Keystone (Identity/Auth), Nova (Compute), Glance (VM Images), Neutron (Software-Defined Networking), Cinder (Block Storage), Swift (Object Storage), and Horizon (Web Dashboard)',
          'Apache CloudStack architecture and management concepts',
          'Terraform Infrastructure as Code (IaC) fundamentals: providers, resources, data sources, variables (`variables.tf`), outputs (`outputs.tf`), and state file (`terraform.tfstate`)',
          'Terraform workflow CLI commands: `terraform init`, `terraform plan`, `terraform apply`, `terraform destroy`, `terraform validate`, `terraform show`, and `terraform refresh`'
        ],
        termsAndUtilities: [
          'OpenStack', 'Keystone', 'Nova', 'Glance', 'Neutron', 'Cinder', 'Swift', 'Horizon',
          'CloudStack', 'Terraform', 'HCL (HashiCorp Configuration Language)', 'terraform.tfstate',
          'provider', 'resource', 'plan', 'apply', 'destroy'
        ],
        filesAndPaths: [
          'main.tf',
          'variables.tf',
          'outputs.tf',
          'terraform.tfstate',
          '.terraform/',
          '/etc/openstack/'
        ],
        keyCommands: [
          {
            command: 'terraform init && terraform plan -out=tfplan',
            description: 'Initialize Terraform working directory, download required cloud provider plugins, and generate an execution preview plan.',
            example: 'terraform apply tfplan',
            explanation: 'Applies the exact changes recorded in the preview plan to create cloud infrastructure.'
          },
          {
            command: 'openstack server create --flavor m1.small --image "Debian 12" --nic net-id=private-net --key-name mykey prod-instance01',
            description: 'Provision a new virtual compute instance via OpenStack CLI client.',
            example: 'openstack server list',
            explanation: 'Communicates with Nova and Glance to launch a cloud VM.'
          }
        ],
        studyNotes: [
          'In OpenStack: Nova handles compute instances, Glance manages base VM disk images, Neutron handles software-defined networks and floating IPs, and Keystone handles authentication tokens.',
          'Terraform is declarative: you describe the desired end state in HCL files, and Terraform determines the minimal set of API actions required to reach that state.',
          'The `terraform.tfstate` file records mappings between declared configuration resources and real-world remote infrastructure IDs; it must be protected and shared securely (e.g. remote S3/GCS backend with state locking).'
        ],
        quickQuestions: [
          {
            question: 'Which OpenStack core service is responsible for discovering, registering, and retrieving virtual machine disk images?',
            options: ['Nova', 'Glance', 'Cinder', 'Neutron'],
            correctIndex: 1,
            explanation: 'OpenStack Glance is the image registry service responsible for storing and retrieving VM disk templates.'
          },
          {
            question: 'Which Terraform CLI command downloads necessary provider plugins and prepares the working directory for deployment?',
            options: ['terraform setup', 'terraform init', 'terraform prepare', 'terraform install'],
            correctIndex: 1,
            explanation: '`terraform init` initializes the working directory, downloads configured cloud providers, and configures state backends.'
          }
        ]
      },
      {
        id: '353.2',
        title: 'Packer',
        weight: 2,
        description: 'Understand, configure, build, and troubleshoot automated, repeatable virtual machine and container images across multiple target platforms using HashiCorp Packer (HCL and legacy JSON templates).',
        keyKnowledgeAreas: [
          'Understand Packer architecture and philosophy: automated golden image creation from a single source configuration',
          'Packer template structure (HCL2 and legacy JSON): Builders / Sources (target platforms: QEMU, VirtualBox, AWS AMI, Docker, VMware), Provisioners (shell scripts, Ansible, file upload), and Post-Processors (compress, checksum, vagrant box, upload)',
          'Manage Packer CLI commands: `packer init`, `packer build`, `packer validate`, `packer fmt`, `packer inspect`',
          'Pass input variables and environment variables into Packer builds (`-var`, `-var-file`)',
          'Troubleshoot image builds using debug mode (`packer build -debug`) and `PACKER_LOG=1`'
        ],
        termsAndUtilities: [
          'packer', 'packer init', 'packer build', 'packer validate', 'packer fmt',
          'HCL2', 'builder', 'source', 'provisioner', 'post-processor', 'PACKER_LOG'
        ],
        filesAndPaths: [
          'template.pkr.hcl',
          'template.json',
          'variables.pkr.hcl',
          '~/.packer.d/plugins/'
        ],
        keyCommands: [
          {
            command: 'packer validate template.pkr.hcl',
            description: 'Check syntax and validate configuration schema of a Packer HCL template file.',
            example: 'packer fmt template.pkr.hcl',
            explanation: 'Formats HCL template to canonical standard formatting style.'
          },
          {
            command: 'packer build -var "iso_checksum=sha256:abc123..." template.pkr.hcl',
            description: 'Execute automated image build across all configured builders with input variable overrides.',
            example: 'PACKER_LOG=1 packer build -only=qemu.debian template.pkr.hcl',
            explanation: 'Enables verbose debug logging and builds only the specified QEMU target image.'
          }
        ],
        studyNotes: [
          'Packer does not manage running infrastructure; it produces immutable pre-baked machine images (AMIs, QCOW2, VMDK, Vagrant boxes) containing pre-installed packages and configurations.',
          'The three core components of a Packer template are: **Sources/Builders** (create machine and run OS installer), **Provisioners** (customize OS via shell or Ansible), and **Post-Processors** (package or upload output image).'
        ],
        quickQuestions: [
          {
            question: 'What is the primary role of "Provisioners" in a HashiCorp Packer template?',
            options: ['Allocates cloud compute instances in production', 'Installs packages, applies configuration files, and customizes the OS during image generation', 'Compresses the final disk image format', 'Manages DNS records for running virtual machines'],
            correctIndex: 1,
            explanation: 'Provisioners (such as shell scripts or Ansible playbooks) install software and configure the operating system while Packer is baking the golden image.'
          },
          {
            question: 'Which environment variable enables detailed debug logging output during a `packer build` execution?',
            options: ['DEBUG=true', 'PACKER_LOG=1', 'PACKER_VERBOSE=all', 'TRACE_LOG=enable'],
            correctIndex: 1,
            explanation: 'Setting `PACKER_LOG=1` (or `PACKER_LOG=debug`) outputs detailed diagnostic logs to stdout.'
          }
        ]
      },
      {
        id: '353.3',
        title: 'cloud-init',
        weight: 3,
        description: 'Understand and configure cloud-init for automated early boot instance customization, cloud-config YAML schemas, user-data, meta-data, modules, network configuration, and troubleshooting.',
        keyKnowledgeAreas: [
          'Understand cloud-init architecture: early boot stages (generator, local, network, config, final), data sources (NoCloud, OpenStack, AWS EC2 metadata service at `http://169.254.169.254/`)',
          'cloud-init input file types: `meta-data` (instance ID, hostname), `user-data` (`#cloud-config` YAML or shell script), `vendor-data`, and `network-config`',
          'Configure `#cloud-config` YAML directives: `users` (create users, sudo privileges, ssh_authorized_keys), `packages` (package lists to install), `package_update` / `package_upgrade`, `write_files` (create files with permissions and content), `runcmd` (run shell commands), `hostname` / `fqdn`, `timezone`, and `bootcmd`',
          'Manage and troubleshoot cloud-init: `cloud-init status`, `cloud-init query`, `cloud-init schema --system`, `cloud-init clean --logs`, and inspecting logs'
        ],
        termsAndUtilities: [
          'cloud-init', 'cloud-config', '#cloud-config', 'user-data', 'meta-data', 'vendor-data',
          'NoCloud', '169.254.169.254', 'runcmd', 'write_files', 'ssh_authorized_keys', 'packages'
        ],
        filesAndPaths: [
          '/etc/cloud/cloud.cfg',
          '/etc/cloud/cloud.cfg.d/',
          '/var/lib/cloud/instance/user-data.txt',
          '/var/lib/cloud/instance/status.json',
          '/var/log/cloud-init.log',
          '/var/log/cloud-init-output.log'
        ],
        keyCommands: [
          {
            command: 'cloud-init status --long',
            description: 'Check whether cloud-init boot stages have finished successfully, are running, or encountered fatal errors.',
            example: 'cloud-init status --wait',
            explanation: 'Blocks until all cloud-init stages complete, useful in boot automation scripts.'
          },
          {
            command: 'cloud-init schema --config-file user-data.yaml',
            description: 'Validate YAML syntax and schema compliance of a `#cloud-config` user-data file before deployment.',
            example: 'cloud-init query instance_id',
            explanation: 'Queries metadata properties gathered by cloud-init from the current cloud provider.'
          },
          {
            command: 'cloud-init clean --logs --reboot',
            description: 'Reset cloud-init state and purge cached artifacts so that user-data scripts re-execute on next boot.',
            example: 'cat /var/log/cloud-init-output.log',
            explanation: 'Inspects stdout and stderr generated by `runcmd` and package installation scripts during initial boot.'
          }
        ],
        studyNotes: [
          'The first line of a cloud-init YAML file MUST be exactly `#cloud-config`. Without this magic header, cloud-init may treat the user-data as an executable shell script or ignore it.',
          '`/var/log/cloud-init-output.log` captures all console stdout/stderr from package managers and `runcmd` commands, making it the primary troubleshooting log for first-boot provisioning failures.',
          'Cloud-init data sources fetch instance configuration either from local CD-ROM/ISO files (NoCloud datasource) or via link-local HTTP queries (`http://169.254.169.254/latest/meta-data/`).'
        ],
        quickQuestions: [
          {
            question: 'What required header string must appear on the very first line of a cloud-init YAML configuration file?',
            options: ['---', '#!/bin/bash', '#cloud-config', '%YAML:1.2'],
            correctIndex: 2,
            explanation: '`#cloud-config` is the required magic string header identifying the payload as cloud-init YAML directives.'
          },
          {
            question: 'Which log file captures the standard output and error streams generated by `runcmd` scripts during cloud-init execution?',
            options: ['/var/log/messages', '/var/log/cloud-init-output.log', '/var/log/dmesg', '/var/log/syslog.cloud'],
            correctIndex: 1,
            explanation: '`/var/log/cloud-init-output.log` captures the full output of shell scripts and commands executed during boot provisioning.'
          }
        ]
      },
      {
        id: '353.4',
        title: 'Vagrant',
        weight: 3,
        description: 'Configure, deploy, manage, and troubleshoot automated local virtual machine development environments using HashiCorp Vagrant (Vagrantfile), boxes, providers (VirtualBox, Libvirt/KVM), networking, synced folders, and provisioning.',
        keyKnowledgeAreas: [
          'Understand Vagrant architecture and workflow: reproducible local multi-machine development environments and lab orchestration',
          'Manage Vagrant CLI lifecycle: `vagrant init`, `vagrant up`, `vagrant halt`, `vagrant reload`, `vagrant suspend`, `vagrant resume`, `vagrant destroy`, `vagrant status`, `vagrant ssh`, `vagrant ssh-config`',
          'Manage Vagrant boxes: `vagrant box add`, `vagrant box list`, `vagrant box update`, `vagrant box remove`, and Vagrant Cloud catalog',
          'Configure `Vagrantfile` (Ruby DSL syntax): `config.vm.box`, `config.vm.hostname`, `config.vm.provider`, `config.vm.network` (forwarded_port, private_network, public_network), `config.vm.synced_folder` (NFS, rsync, 9p, sshfs), `config.vm.define` (multi-machine configurations)',
          'Configure Vagrant provisioners: Shell provisioner (`config.vm.provision "shell"`), Ansible, Puppet, Chef, File upload, and `--provision` flag',
          'Manage providers: VirtualBox, KVM/Libvirt (`vagrant-libvirt` plugin), Hyper-V, and Docker provider'
        ],
        termsAndUtilities: [
          'vagrant', 'Vagrantfile', 'vagrant box', 'vagrant up', 'vagrant halt', 'vagrant destroy',
          'vagrant ssh', 'vagrant-libvirt', 'synced_folder', 'forwarded_port', 'private_network',
          'provisioner', 'multi-machine'
        ],
        filesAndPaths: [
          'Vagrantfile',
          '~/.vagrant.d/',
          '~/.vagrant.d/boxes/',
          '.vagrant/'
        ],
        keyCommands: [
          {
            command: 'vagrant up --provider=libvirt --provision',
            description: 'Provision and launch virtual machines defined in Vagrantfile using KVM/Libvirt hypervisor and run configured provisioners.',
            example: 'vagrant status',
            explanation: 'Displays state (running, poweroff, not created) for all VMs defined in the Vagrantfile.'
          },
          {
            command: 'vagrant ssh webserver',
            description: 'Open a secure SSH shell session directly into the `webserver` guest VM using generated Vagrant private keys.',
            example: 'vagrant ssh-config',
            explanation: 'Outputs OpenSSH-compatible configuration (Host, HostName, Port, IdentityFile) for IDE integration.'
          },
          {
            command: 'vagrant box add generic/debian12 --provider=libvirt',
            description: 'Download and install a pre-packaged base image box from Vagrant Cloud.',
            example: 'vagrant box list',
            explanation: 'Lists locally cached base image boxes.'
          },
          {
            command: 'vagrant destroy -f',
            description: 'Forcefully shut down and permanently purge all VM disks and metadata created by the current Vagrantfile project.',
            example: 'vagrant reload --provision',
            explanation: 'Restarts virtual machine and re-applies shell/ansible provisioner scripts.'
          }
        ],
        studyNotes: [
          'The `Vagrantfile` uses Ruby syntax; `config.vm.synced_folder ".", "/vagrant"` automatically mounts the host project root folder inside the guest VM at `/vagrant`.',
          'For multi-machine setups, `config.vm.define "node1" do |node1| ... end` allows defining complex multi-node topology clusters inside a single project directory.',
          'By default, provisioners only run during the initial `vagrant up`. To re-run provisioners on an already active VM, execute `vagrant provision` or `vagrant reload --provision`.'
        ],
        quickQuestions: [
          {
            question: 'Which Vagrant command reboots a running virtual machine and re-executes all configured provisioner scripts?',
            options: ['vagrant restart --force', 'vagrant reload --provision', 'vagrant up --refresh', 'vagrant resume --run'],
            correctIndex: 1,
            explanation: '`vagrant reload --provision` reboots the guest and forces the execution of all defined provisioners.'
          },
          {
            question: 'By default, at what path inside a Vagrant guest VM is the host project directory mounted as a synced folder?',
            options: ['/mnt/host', '/home/vagrant/host', '/vagrant', '/var/workspace'],
            correctIndex: 2,
            explanation: 'Vagrant automatically mounts the host directory containing the Vagrantfile to `/vagrant` inside the guest VM.'
          }
        ]
      }
    ]
  }
];
