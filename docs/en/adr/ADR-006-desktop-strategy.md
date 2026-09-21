# ADR-006: Desktop Application Strategy & Native Containers (Horizon V3)

## Status
**Accepted (Horizon V3 Roadmap)**

## Context
The in-memory virtual terminal engine (`VirtualFs`) successfully satisfies 100% of Linux Essentials and LPIC-1 requirements (FHS filesystem hierarchy, Unix permissions, standard GNU utilities, `tar` archives, stream redirection, text processing).
However, advanced certifications like **LPIC-2** (Linux Engineer) and **LPIC-3** (Enterprise) require deeper operating system interactions:
- Compiling and loading kernel modules (`modprobe`, `/proc/sys`).
- Real `systemd` init daemon managing cgroups and target states.
- Native Samba/NFS file shares and active domain controllers.
- High availability, Corosync/Pacemaker clustering, and KVM virtualization.
These cannot be authentically simulated within an in-memory browser JavaScript engine.

## Decision
1. **Maintain V1 & V2 as Web / PWA**: The core application remains a browser-accessible PWA ensuring universal, instantaneous accessibility.
2. **Architect Horizon V3 as a Lightweight Desktop Application (Tauri / Rust)**:
   - Package the existing web codebase into a cross-platform native binary (Linux, macOS, Windows).
   - Leverage Tauri system bindings to connect to the learner's local container engine (**Docker** or **Podman**).
3. **Execute LPIC-2/3 Labs inside Disposable Micro-Containers**:
   - The desktop app automatically spawns lightweight Linux containers in the background for complex labs.
   - Terminal input is passed directly to the container via a local pseudo-terminal (PTY).
   - State verification is performed by executing automated inspection scripts within the container.

## Consequences
### Positive:
- **100% Genuine Linux Environment**: Authentic kernel, real systemd daemon, and genuine networking for enterprise certifications.
- **Safety and Isolation**: High-risk operations (e.g., partitioning, kernel rebuilds) occur safely inside disposable sandboxes without risking the host system.
- **Codebase Reuse**: The React UI, SRS engine, and Weakness Engine remain identical across Web and Desktop releases.

### Limitations:
- Requires the user to have Docker or Podman installed locally to run LPIC-2/3 advanced labs.
