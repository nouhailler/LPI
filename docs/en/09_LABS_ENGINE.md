# 09 — Virtual Terminal & In-Memory Labs Engine (VirtualFS)

> This document describes the architecture of the in-memory Unix terminal simulator and virtual filesystem (*VirtualFS*) of **LPI Certification Prep**, located in `src/services/virtualFs/`.

---

## 1. Virtual Filesystem (VirtualFS) Architecture

To provide an authentic Unix command line experience without requiring remote server infrastructure or local virtual machines, the platform implements a complete POSIX-like filesystem tree entirely in browser memory:

```text
┌─────────────────────────────────────────────────────────────┐
│                    VIRTUAL TERMINAL (UI)                    │
│            ANSI Colors, History, Tab Autocompletion         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Command Line String
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   SHELL INTERPRETER (BASH 5.2)              │
│       Tokenizer, Pipeline Parser, Redirections, Builtins     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Inode Operations
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  IN-MEMORY FILESYSTEM (VirtualFS)           │
│      FHS Tree (/home, /etc, /var/log, /bin, /tmp), Inodes   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Supported Core Utilities & Features
 
 - **Navigation & Inspection**: `pwd`, `cd`, `ls` (`-l`, `-a`, `-h`, `-i`), `tree`, `file`, `stat`, `which`.
 - **File Manipulation & Links**: `touch`, `mkdir` (`-p`), `rmdir`, `cp` (`-r`), `mv`, `rm` (`-r`, `-f`), `ln` (symbolic `-s` and hard links), `cat`, `head`, `tail`.
 - **Text & Stream Processing (Filters)**:
   - `grep` (`-i`, `-v`, `-n`, `-c`, `-E` regex).
   - `sed`: Stream editor for regex substitution (`sed "s/foo/bar/g"`), deletions (`sed "/motif/d"`), line extraction (`-n "1,5p"`).
   - `awk`: Pattern scanning and columnar processing (`$1, $2`), custom field delimiter (`-F:`), conditional filters (`awk '$4 == "active"'`).
   - `cut`: Field extraction (`-d:`, `-f1,7`) and byte/character slicing (`-c1-10`).
   - `sort`: Numerical (`-n`), reverse (`-r`), unique deduplication (`-u`), key sort (`-k2`).
   - `uniq`: Repeated lines detection and counting (`-c`, `-d`, `-u`).
   - `wc`: Word, newline, byte and character counting (`-l`, `-w`, `-c`, `-m`).
   - `tee`: Read standard input and duplicate to file & stdout simultaneously (`-a` append).
   - Redirections (`>`, `>>`) and pipelines (`|`).
 - **Systemd Service Manager & Journals (`ServicesManager`)**:
   - `systemctl`: Unit lifecycle commands (`status`, `start`, `stop`, `restart`, `enable`, `disable`, `is-active`, `list-units`) for essential daemons (`nginx`, `ssh`, `cron`, `rsyslog`).
   - `journalctl`: Structured systemd log viewer with unit filtering (`-u nginx`), reverse order (`-r`), priority filter (`-p err`, `-p warning`), line count limit (`-n 10`), and paging tail (`-xe`, `-e`).
 - **Network Diagnostics & Interfaces (`NetworkSimulator`)**:
   - `ip addr`: IPv4/IPv6 CIDR inspection (`eth0`, `lo`), MAC address reporting, and interface state (`UP`, `LOWER_UP`).
   - `ip route`: Default gateway discovery (`default via 192.168.1.1 dev eth0`) and subnet routing entries.
   - `ping`: ICMP Echo request transmission with count limit (`-c 3`), realistic latency RTT calculation (min/avg/max/mdev), and connectivity simulation for local & public hosts.
 - **Storage, Partitions & Mount Operations (`StorageSimulator`)**:
   - `mount`: Filesystem attachment to directories (`mount /dev/sdc1 /mnt`), options (`-o defaults,ro,rw`), filesystem types (`-t ext4`), and fstab batch mounting (`mount -a`).
   - `umount`: Clean detachment of active filesystems (`umount /mnt/backup`).
   - `/etc/fstab`: Configuration table for persistent filesystems (`<device> <mountpoint> <type> <options> <dump> <pass>`).
   - `fdisk`: Partition table layout and geometry inspection (`sudo fdisk -l /dev/sda`, `sudo fdisk -l /dev/sdc`).
   - `lsblk`: Tree view of block storage devices (`lsblk -f`) with `NAME`, `FSTYPE`, `UUID`, `FSAVAIL`, and `MOUNTPOINT`.
 - **Permissions & Ownership**: `chmod` (octal `750`, symbolic `u+x`), `chown`, `chgrp`, `umask`.
 - **Archiving & Compression**: `tar` (`-czvf`, `-xzvf`, `-tvf`), `gzip`, `gunzip`.
 - **Process & System Info**: `ps` (`aux`, `-ef`), `kill` (SIGTERM, SIGKILL `-9`), `uptime`, `free`, `df`, `whoami`, `id`, `uname` (`-a`), `date`, `env`, `export`, `sudo`.
 - **Interactive Manuals & Help**:
   - `help`: Categorized command catalog.
   - `help <cmd>` / `<cmd> --help`: Quick syntax guide and options.
   - `man <cmd>`: Full manual pages (NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES).

---

## 3. Microscopic State Validation in Labs

Unlike tools that validate answers by simple regex matching against the command string, **VirtualFS validates the resulting filesystem state**:

```typescript
export interface SimulatedLabScenario {
  id: string;
  title: string;
  goal: string;
  instructions: string[];
  hints: string[];
  solutionCommands: string[];
  validate: (fs: VirtualFs, interpreter?: ShellInterpreter) => LabScenarioValidation;
}
```

This guarantees true pedagogical fidelity: whether the student executes `chmod 750 script.sh` or `chmod u=rwx,g=rx,o= script.sh`, the engine verifies the exact resulting octal mode and ownership on the inode.

### Available Scenarios:
1. `lab-chmod-backup`: Executable permissions for backup scripts.
2. `lab-grep-auth`: Security forensic analysis in `/var/log/auth.log`.
3. `lab-tar-archive`: Gzip-compressed tarball creation.
4. `lab-chown-ownership`: Recursive user and group ownership assignment.
5. `lab-symlink-creation`: Symbolic link creation to configuration targets.
6. `lab-kill-process`: Process management and termination via signals.
7. `lab-find-and-clean`: Multi-criteria search and cleanup in `/tmp`.
8. `lab-security-shadow`: Securing critical authentication databases (`/etc/shadow`).
9. `lab-text-filter-pipeline`: Data extraction and alphanumeric sorting pipelines.
10. `lab-systemd-service`: Systemd service lifecycle management and journal auditing.
11. `lab-network-ping-diag`: Network interface diagnosis and ICMP gateway connectivity testing.
12. `lab-storage-mount-disk`: Block device discovery and filesystem mounting (`lsblk -f`, `mount`).
13. `lab-fstab-mount-umount`: Persistent fstab entries, partition inspection (`fdisk`), batch mount (`mount -a`) and unmount (`umount`).
14. `lab-text-filter-sed-awk`: Advanced stream transformation with regex substitutions (`sed`), column extraction (`awk`), and line counting (`wc -l`).
