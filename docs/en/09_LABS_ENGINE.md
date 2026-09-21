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

- **Navigation & Inspection**: `pwd`, `cd`, `ls` (`-l`, `-a`, `-h`, `-F`, `-R`), `tree`, `file`, `stat`.
- **File Manipulation**: `touch`, `mkdir` (`-p`), `cp` (`-r`), `mv`, `rm` (`-r`, `-f`), `cat`, `head`, `tail`.
- **Text & Stream Processing**: `grep` (`-i`, `-v`, `-E`), `wc` (`-l`, `-w`, `-c`), `sort`, `uniq`, redirections (`>`, `>>`), pipes (`|`).
- **Permissions & Ownership**: `chmod` (octal `750`, symbolic `u+x`), `chown`, `chgrp`, `umask`.
- **Archiving & Compression**: `tar` (`-czvf`, `-xzvf`, `-tvf`), `gzip`, `gunzip`.
- **Process & System Info**: `ps` (`aux`), `kill`, `uptime`, `whoami`, `id`, `uname` (`-a`), `env`.

---

## 3. Microscopic State Validation in Labs

Unlike tools that validate answers by simple regex matching against the command string, **VirtualFS validates the resulting filesystem state**:

```typescript
export interface LabScenario {
  id: string;
  title: string;
  description: string;
  initialFsState: VfsNode[];
  taskInstructions: string[];
  validate: (fs: VirtualFs) => { passed: boolean; feedback: string };
}
```

This guarantees true pedagogical fidelity: whether the student executes `chmod 750 script.sh` or `chmod u=rwx,g=rx,o= script.sh`, the engine verifies the exact resulting octal mode and ownership on the inode.
