# ADR-002: Virtual Linux Labs via In-Memory Virtual Filesystem

## Status
**Accepted**

## Context
LPI certification exams (LPIC-1, LPIC-2, LPIC-3) test real-world system administration skills: tree navigation, permissions configuration (`chmod`, `chown`, `umask`), archiving (`tar`), log extraction (`grep`, `find`), and process management (`ps`, `kill`).
Most competing tools settle for passive multiple-choice questions or basic text inputs comparing typed strings against static answer templates.
We wanted learners to practice genuine Linux commands in a reactive environment without requiring a backend server hosting Docker containers (too heavy, expensive, and incompatible with 100% offline usage).

## Decision
Design an autonomous Linux simulation engine in pure JavaScript/TypeScript (`/src/services/virtualFs`) consisting of:
1. **A Virtual Filesystem (`VirtualFs`)**:
   - In-memory inode tree structure (`VfsNode`) respecting the FHS standard (`/home/student`, `/etc`, `/var/log`, `/tmp`, `/root`).
   - Full Unix metadata handling: octal modes (`0o750`, `0o644`), symbolic permissions (`-rwxr-x---`), owners and groups (`student:developers`, `root:shadow`), timestamps, and sizes.
2. **A Shell Interpreter (`ShellInterpreter`)**:
   - Emulation of Bash 5.2 (builtins, redirections `>` and `>>`, pipes `|`, command chaining `&&` and `;`).
   - Implementation of fundamental core utilities: `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `chmod`, `chown`, `tar`, `ps`, `kill`, `df`, `free`, `uptime`, `whoami`, etc.
3. **Microscopic System State-Based Validation**:
   - Lab scenarios evaluate not arbitrary static typed text, but **the resulting state of the filesystem tree** (e.g., *"Does the backup.sh file have mode bits 0o750 and ownership assigned to student?"*).

## Consequences
### Positive:
- **100% PWA & Offline**: Operates instantly in any web browser, including mobile or offline, without any backend server.
- **Total Safety**: Zero security risk to the host machine; the virtual filesystem is completely sandboxed in application memory.
- **Pedagogical Flexibility**: Learners can execute `chmod 750 file`, `chmod u=rwx,g=rx,o= file`, or `chmod +x file`; validation checks the final resulting inode state.
- **Real-Time Visual Feedback**: The visual tree inspector updates instantly with permissions and file hierarchy on every command execution.

### Limitations:
- Not a full Linux kernel (no actual kernel modules or complex shared memory IPC).
- Cannot simulate real native `systemd` daemons or real live network sockets.

### Future Roadmap Perspectives:
- **Tier V2**: WebAssembly support (v86 emulation or WebContainers) to execute a Linux micro-kernel in the browser when system resources permit.
- **Tier V3**: For future Desktop builds (Tauri/Electron), integration with a local Docker/Podman daemon for advanced LPIC-2/3 labs.
