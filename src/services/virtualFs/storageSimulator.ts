/**
 * Storage and Partition simulation for LPI Virtual Terminal:
 * mount, umount, /etc/fstab, fdisk, lsblk
 */

import { VirtualFs } from './VirtualFs';
import { CommandExecutionResult } from './types';

export interface VfsMountEntry {
  device: string;
  mountpoint: string;
  fstype: string;
  options: string;
  dump: number;
  pass: number;
}

export interface BlockDevicePartition {
  name: string; // e.g. 'sda1'
  majMin: string;
  size: string;
  sizeBytes: number;
  type: string;
  fstype?: string;
  fsver?: string;
  label?: string;
  uuid?: string;
  fsavail?: string;
  fsusePct?: string;
  defaultMount?: string;
}

export interface BlockDevice {
  name: string; // e.g. 'sda'
  majMin: string;
  size: string;
  sizeBytes: number;
  model: string;
  disklabel: 'gpt' | 'dos';
  diskId: string;
  partitions: BlockDevicePartition[];
}

export class StorageSimulator {
  private mounts: VfsMountEntry[] = [];
  private blockDevices: BlockDevice[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    this.mounts = [
      { device: '/dev/sda2', mountpoint: '/', fstype: 'ext4', options: 'rw,relatime,errors=remount-ro', dump: 0, pass: 1 },
      { device: '/dev/sda1', mountpoint: '/boot/efi', fstype: 'vfat', options: 'rw,relatime,fmask=0077,dmask=0077', dump: 0, pass: 2 },
      { device: 'proc', mountpoint: '/proc', fstype: 'proc', options: 'rw,nosuid,nodev,noexec,relatime', dump: 0, pass: 0 },
      { device: 'sysfs', mountpoint: '/sys', fstype: 'sysfs', options: 'rw,nosuid,nodev,noexec,relatime', dump: 0, pass: 0 },
      { device: 'tmpfs', mountpoint: '/dev/shm', fstype: 'tmpfs', options: 'rw,nosuid,nodev', dump: 0, pass: 0 },
      { device: 'tmpfs', mountpoint: '/run', fstype: 'tmpfs', options: 'rw,nosuid,nodev,noexec,relatime', dump: 0, pass: 0 },
      { device: '/dev/sdb1', mountpoint: '/data', fstype: 'ext4', options: 'rw,relatime', dump: 0, pass: 2 },
    ];

    this.blockDevices = [
      {
        name: 'sda',
        majMin: '8:0',
        size: '50G',
        sizeBytes: 53687091200,
        model: 'QEMU HARDDISK',
        disklabel: 'gpt',
        diskId: '7B5C8231-5079-4B57-B5E3-A880F16C5A9F',
        partitions: [
          {
            name: 'sda1',
            majMin: '8:1',
            size: '512M',
            sizeBytes: 536870912,
            type: 'part',
            fstype: 'vfat',
            fsver: 'FAT32',
            label: 'BOOT',
            uuid: '1234-ABCD',
            fsavail: '505.9M',
            fsusePct: '1%',
            defaultMount: '/boot/efi',
          },
          {
            name: 'sda2',
            majMin: '8:2',
            size: '47.5G',
            sizeBytes: 51002736640,
            type: 'part',
            fstype: 'ext4',
            fsver: '1.0',
            label: 'rootfs',
            uuid: '4a8f9c12-3456-7890-abcd-ef0123456789',
            fsavail: '34.2G',
            fsusePct: '27%',
            defaultMount: '/',
          },
          {
            name: 'sda3',
            majMin: '8:3',
            size: '2G',
            sizeBytes: 2147483648,
            type: 'part',
            fstype: 'swap',
            fsver: '1',
            label: '',
            uuid: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
            defaultMount: '[SWAP]',
          },
        ],
      },
      {
        name: 'sdb',
        majMin: '8:16',
        size: '100G',
        sizeBytes: 107374182400,
        model: 'QEMU HARDDISK',
        disklabel: 'gpt',
        diskId: '3E4B8F12-8821-4CA1-901B-FF123456789A',
        partitions: [
          {
            name: 'sdb1',
            majMin: '8:17',
            size: '96G',
            sizeBytes: 103079215104,
            type: 'part',
            fstype: 'ext4',
            fsver: '1.0',
            label: 'DATA_STORE',
            uuid: 'b67e1234-5678-90ab-cdef-1234567890cd',
            fsavail: '68.4G',
            fsusePct: '26%',
            defaultMount: '/data',
          },
        ],
      },
      {
        name: 'sdc',
        majMin: '8:32',
        size: '20G',
        sizeBytes: 21474836480,
        model: 'VIRTIO DISK',
        disklabel: 'dos',
        diskId: '0x4a18b209',
        partitions: [
          {
            name: 'sdc1',
            majMin: '8:33',
            size: '20G',
            sizeBytes: 21474836480,
            type: 'part',
            fstype: 'ext4',
            fsver: '1.0',
            label: 'BACKUP_VOL',
            uuid: 'c98f5678-1234-5678-90ab-abcdef123456',
            fsavail: '19.1G',
            fsusePct: '1%',
          },
        ],
      },
    ];
  }

  public getMounts(): VfsMountEntry[] {
    return [...this.mounts];
  }

  public getMountForPoint(point: string): VfsMountEntry | undefined {
    return this.mounts.find((m) => m.mountpoint === point);
  }

  public isMountActive(target: string): boolean {
    return this.mounts.some((m) => m.mountpoint === target || m.device === target);
  }

  public executeMount(
    args: string[],
    isRoot: boolean,
    fs: VirtualFs,
    cwd: string
  ): CommandExecutionResult {
    // mount without arguments lists active mounts
    if (args.length === 0) {
      const lines = this.mounts.map(
        (m) => `${m.device} on ${m.mountpoint} type ${m.fstype} (${m.options})`
      );
      return { output: lines.join('\n'), exitCode: 0 };
    }

    // mount -a: mount all filesystems mentioned in fstab
    if (args.includes('-a')) {
      if (!isRoot) {
        return { output: 'mount: only root can use "--all"', exitCode: 1 };
      }
      return this.mountAllFromFstab(fs);
    }

    if (!isRoot) {
      return { output: 'mount: only root can use "--options" or mount devices (try with sudo)', exitCode: 1 };
    }

    let fstype = 'ext4';
    let options = 'rw,relatime';
    const positional: string[] = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-t' && i + 1 < args.length) {
        fstype = args[i + 1];
        i++;
      } else if (a.startsWith('-t')) {
        fstype = a.slice(2);
      } else if (a === '-o' && i + 1 < args.length) {
        options = args[i + 1];
        i++;
      } else if (a.startsWith('-o')) {
        options = a.slice(2);
      } else if (!a.startsWith('-')) {
        positional.push(a);
      }
    }

    if (positional.length < 2) {
      // Single argument might be directory or device in fstab
      if (positional.length === 1) {
        return this.mountSingleFromFstab(positional[0], fs);
      }
      return { output: 'mount: specify device and mountpoint or use -a', exitCode: 1 };
    }

    const device = positional[0];
    const targetDir = positional[1];

    // Verify directory exists in virtual filesystem
    const dirNode = fs.getNode(targetDir, cwd);
    if (!dirNode) {
      return { output: `mount: mount point ${targetDir} does not exist`, exitCode: 32 };
    }
    if (dirNode.type !== 'directory') {
      return { output: `mount: mount point ${targetDir} is not a directory`, exitCode: 32 };
    }

    const normPath = fs.normalizePath(targetDir, cwd);

    // Check if mountpoint or device is already mounted
    const existingTarget = this.mounts.find((m) => m.mountpoint === normPath);
    if (existingTarget) {
      return { output: `mount: ${normPath}: ${existingTarget.device} is already mounted on ${normPath}`, exitCode: 32 };
    }

    this.mounts.push({
      device,
      mountpoint: normPath,
      fstype,
      options,
      dump: 0,
      pass: 2,
    });

    return { output: '', exitCode: 0 };
  }

  private mountAllFromFstab(fs: VirtualFs): CommandExecutionResult {
    const fstabNode = fs.getNode('/etc/fstab');
    if (!fstabNode || !fstabNode.content) {
      return { output: 'mount: /etc/fstab: No such file or directory', exitCode: 1 };
    }

    const lines = fstabNode.content.split('\n');
    let mountedCount = 0;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const tokens = line.split(/\s+/);
      if (tokens.length >= 3) {
        const [device, mountpoint, fstype, options = 'defaults'] = tokens;
        if (mountpoint === 'none' || fstype === 'swap') continue;
        if (options.includes('noauto')) continue;

        const already = this.mounts.find((m) => m.mountpoint === mountpoint);
        if (!already) {
          const dirNode = fs.getNode(mountpoint);
          if (dirNode && dirNode.type === 'directory') {
            this.mounts.push({
              device,
              mountpoint,
              fstype,
              options,
              dump: 0,
              pass: 2,
            });
            mountedCount++;
          }
        }
      }
    }

    return { output: mountedCount > 0 ? `Mounted ${mountedCount} filesystems from /etc/fstab.` : '', exitCode: 0 };
  }

  private mountSingleFromFstab(target: string, fs: VirtualFs): CommandExecutionResult {
    const fstabNode = fs.getNode('/etc/fstab');
    if (!fstabNode || !fstabNode.content) {
      return { output: 'mount: can\'t find in /etc/fstab', exitCode: 1 };
    }

    const lines = fstabNode.content.split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;

      const tokens = line.split(/\s+/);
      if (tokens.length >= 3) {
        const [dev, mp, fstype, options = 'defaults'] = tokens;
        if (mp === target || dev === target) {
          const already = this.mounts.find((m) => m.mountpoint === mp);
          if (already) {
            return { output: `mount: ${mp} is already mounted`, exitCode: 32 };
          }
          this.mounts.push({
            device: dev,
            mountpoint: mp,
            fstype,
            options,
            dump: 0,
            pass: 2,
          });
          return { output: '', exitCode: 0 };
        }
      }
    }

    return { output: `mount: can't find ${target} in /etc/fstab`, exitCode: 1 };
  }

  public executeUmount(
    args: string[],
    isRoot: boolean,
    fs: VirtualFs,
    cwd: string
  ): CommandExecutionResult {
    if (args.length === 0) {
      return { output: 'umount: usage: umount [-f|-l] <mountpoint|device>', exitCode: 1 };
    }

    if (!isRoot) {
      return { output: 'umount: only root can unmount (try with sudo)', exitCode: 1 };
    }

    const targets = args.filter((a) => !a.startsWith('-'));
    if (targets.length === 0) {
      return { output: 'umount: no mount point specified', exitCode: 1 };
    }

    const target = targets[0];
    const normTarget = fs.normalizePath(target, cwd);

    if (normTarget === '/' || target === '/') {
      return { output: 'umount: /: target is busy.', exitCode: 32 };
    }

    const index = this.mounts.findIndex(
      (m) => m.mountpoint === normTarget || m.mountpoint === target || m.device === target
    );

    if (index === -1) {
      return { output: `umount: ${target}: not mounted.`, exitCode: 32 };
    }

    this.mounts.splice(index, 1);
    return { output: '', exitCode: 0 };
  }

  public executeLsblk(args: string[]): CommandExecutionResult {
    const showFs = args.includes('-f');

    if (showFs) {
      const header = 'NAME   FSTYPE FSVER LABEL      UUID                                 FSAVAIL FSUSE% MOUNTPOINTS';
      const lines = [header];

      for (const disk of this.blockDevices) {
        lines.push(`${disk.name.padEnd(6)}`);
        disk.partitions.forEach((part, idx) => {
          const isLast = idx === disk.partitions.length - 1;
          const prefix = isLast ? '└─' : '├─';
          const nameStr = `${prefix}${part.name}`.padEnd(6);
          const fstype = (part.fstype || '').padEnd(6);
          const fsver = (part.fsver || '').padEnd(5);
          const label = (part.label || '').padEnd(10);
          const uuid = (part.uuid || '').padEnd(36);
          const avail = (part.fsavail || '').padStart(7);
          const usePct = (part.fsusePct || '').padStart(6);

          // Find current mount
          const devPath = `/dev/${part.name}`;
          const currentMount = this.mounts.find((m) => m.device === devPath);
          const mp = currentMount ? currentMount.mountpoint : part.name === 'sda3' ? '[SWAP]' : '';

          lines.push(`${nameStr} ${fstype} ${fsver} ${label} ${uuid} ${avail} ${usePct} ${mp}`);
        });
      }

      return { output: lines.join('\n'), exitCode: 0 };
    }

    // Default tree display
    const header = 'NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS';
    const lines = [header];

    for (const disk of this.blockDevices) {
      lines.push(`${disk.name.padEnd(6)} ${disk.majMin.padStart(7)}  0 ${disk.size.padStart(5)}  0 disk `);
      disk.partitions.forEach((part, idx) => {
        const isLast = idx === disk.partitions.length - 1;
        const prefix = isLast ? '└─' : '├─';
        const nameStr = `${prefix}${part.name}`.padEnd(6);
        const majMin = part.majMin.padStart(7);
        const size = part.size.padStart(5);

        const devPath = `/dev/${part.name}`;
        const currentMount = this.mounts.find((m) => m.device === devPath);
        const mp = currentMount ? currentMount.mountpoint : part.name === 'sda3' ? '[SWAP]' : '';

        lines.push(`${nameStr} ${majMin}  0 ${size}  0 ${part.type} ${mp}`);
      });
    }

    return { output: lines.join('\n'), exitCode: 0 };
  }

  public executeFdisk(args: string[], isRoot: boolean): CommandExecutionResult {
    if (!isRoot) {
      return { output: 'fdisk: cannot open /dev/sda: Permission denied (try with sudo)', exitCode: 1 };
    }

    if (!args.includes('-l')) {
      return {
        output: 'Interactive fdisk is in read-only demo mode in this lab. Use "fdisk -l" or "fdisk -l /dev/sda" to view partition tables.',
        exitCode: 0,
      };
    }

    const deviceArg = args.find((a) => a.startsWith('/dev/'));
    const targetDisks = deviceArg
      ? this.blockDevices.filter((d) => `/dev/${d.name}` === deviceArg)
      : this.blockDevices;

    if (deviceArg && targetDisks.length === 0) {
      return { output: `fdisk: cannot open ${deviceArg}: No such file or directory`, exitCode: 1 };
    }

    const lines: string[] = [];

    for (const disk of targetDisks) {
      const sectors = disk.sizeBytes / 512;
      lines.push(`Disk /dev/${disk.name}: ${disk.size}B, ${disk.sizeBytes} bytes, ${sectors} sectors`);
      lines.push(`Disk model: ${disk.model}`);
      lines.push(`Units: sectors of 1 * 512 = 512 bytes`);
      lines.push(`Sector size (logical/physical): 512 bytes / 512 bytes`);
      lines.push(`I/O size (minimum/optimal): 512 bytes / 512 bytes`);
      lines.push(`Disklabel type: ${disk.disklabel}`);
      lines.push(`Disk identifier: ${disk.diskId}`);
      lines.push('');

      if (disk.disklabel === 'gpt') {
        lines.push('Device        Start       End   Sectors  Size Type');
        if (disk.name === 'sda') {
          lines.push('/dev/sda1      2048   1050623   1048576  512M EFI System');
          lines.push('/dev/sda2   1050624 100663295  99612672 47.5G Linux filesystem');
          lines.push('/dev/sda3 100663296 104857566   4194271    2G Linux swap');
        } else if (disk.name === 'sdb') {
          lines.push('/dev/sdb1      2048 209713151 209711104 100G Linux filesystem');
        }
      } else {
        lines.push('Device     Boot Start      End  Sectors Size Id Type');
        lines.push('/dev/sdc1        2048 41943039 41940992  20G 83 Linux');
      }

      lines.push('');
    }

    return { output: lines.join('\n').trimEnd(), exitCode: 0 };
  }
}
