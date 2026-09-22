/**
 * Systemd Service & Journal simulation for LPI Virtual Terminal:
 * systemctl, journalctl
 */

import { CommandExecutionResult } from './types';

export interface VfsService {
  name: string; // e.g. 'nginx.service'
  description: string;
  loaded: boolean;
  unitFileState: 'enabled' | 'disabled' | 'static';
  activeState: 'active' | 'inactive' | 'failed';
  subState: 'running' | 'dead' | 'failed';
  mainPid?: number;
  since: string;
  memoryUsage: string;
  cgroupProcesses: { pid: number; cmd: string }[];
  logs: string[];
}

export interface JournalEntry {
  timestamp: string;
  unit: string;
  pid?: number;
  message: string;
  level: 'info' | 'notice' | 'warning' | 'err';
}

export class ServicesManager {
  private services: Map<string, VfsService> = new Map();
  private journalEntries: JournalEntry[] = [];

  constructor() {
    this.initDefaultServices();
  }

  private initDefaultServices() {
    const defaultServices: VfsService[] = [
      {
        name: 'nginx.service',
        description: 'A high performance web server and a reverse proxy server',
        loaded: true,
        unitFileState: 'enabled',
        activeState: 'active',
        subState: 'running',
        mainPid: 1040,
        since: 'Mon 2026-09-20 10:05:00 UTC',
        memoryUsage: '16.4M',
        cgroupProcesses: [
          { pid: 1040, cmd: 'nginx: master process /usr/sbin/nginx -g daemon on; master_process on;' },
          { pid: 1041, cmd: 'nginx: worker process' },
        ],
        logs: [
          'Starting A high performance web server and a reverse proxy server...',
          'nginx: configuration file /etc/nginx/nginx.conf test is successful',
          'Started A high performance web server and a reverse proxy server.',
        ],
      },
      {
        name: 'sshd.service',
        description: 'OpenBSD Secure Shell server',
        loaded: true,
        unitFileState: 'enabled',
        activeState: 'active',
        subState: 'running',
        mainPid: 780,
        since: 'Mon 2026-09-20 10:00:12 UTC',
        memoryUsage: '9.2M',
        cgroupProcesses: [
          { pid: 780, cmd: 'sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups' },
        ],
        logs: [
          'Server listening on 0.0.0.0 port 22.',
          'Server listening on :: port 22.',
          'Accepted publickey for student from 192.168.1.50 port 54320 ssh2',
        ],
      },
      {
        name: 'cron.service',
        description: 'Regular background program processing daemon',
        loaded: true,
        unitFileState: 'enabled',
        activeState: 'active',
        subState: 'running',
        mainPid: 420,
        since: 'Mon 2026-09-20 10:00:01 UTC',
        memoryUsage: '3.1M',
        cgroupProcesses: [
          { pid: 420, cmd: '/usr/sbin/cron -f -P' },
        ],
        logs: [
          'cron.service: (CRON) STARTUP (1.2)',
          'cron.service: (root) CMD (run-parts --report /etc/cron.hourly)',
        ],
      },
      {
        name: 'systemd-logind.service',
        description: 'User Login Management',
        loaded: true,
        unitFileState: 'static',
        activeState: 'active',
        subState: 'running',
        mainPid: 412,
        since: 'Mon 2026-09-20 10:00:05 UTC',
        memoryUsage: '8.4M',
        cgroupProcesses: [
          { pid: 412, cmd: '/lib/systemd/systemd-logind' },
        ],
        logs: [
          'New session 3 of user student.',
          'Watching system buttons on /dev/input/event0',
        ],
      },
      {
        name: 'fail2ban.service',
        description: 'Fail2ban Service (Intrusion Prevention)',
        loaded: true,
        unitFileState: 'disabled',
        activeState: 'inactive',
        subState: 'dead',
        since: 'Mon 2026-09-20 10:00:00 UTC',
        memoryUsage: '0B',
        cgroupProcesses: [],
        logs: [
          'Stopped Fail2ban Service.',
        ],
      },
      {
        name: 'mariadb.service',
        description: 'MariaDB 10.11 database server',
        loaded: true,
        unitFileState: 'disabled',
        activeState: 'inactive',
        subState: 'dead',
        since: 'Mon 2026-09-20 10:00:00 UTC',
        memoryUsage: '0B',
        cgroupProcesses: [],
        logs: [
          'mariadb.service: Deactivated successfully.',
        ],
      },
    ];

    for (const svc of defaultServices) {
      this.services.set(svc.name, svc);
      const shortName = svc.name.replace('.service', '');
      this.services.set(shortName, svc);
    }

    this.journalEntries = [
      { timestamp: 'Sep 20 10:00:01', unit: 'systemd', pid: 1, message: 'Starting Daily apt upgrade and clean activities...', level: 'info' },
      { timestamp: 'Sep 20 10:00:01', unit: 'CRON', pid: 1402, message: '(root) CMD (run-parts --report /etc/cron.hourly)', level: 'info' },
      { timestamp: 'Sep 20 10:00:05', unit: 'systemd-logind', pid: 412, message: 'Watching system buttons on /dev/input/event0 (Power Button)', level: 'info' },
      { timestamp: 'Sep 20 10:00:12', unit: 'sshd', pid: 780, message: 'Server listening on 0.0.0.0 port 22.', level: 'info' },
      { timestamp: 'Sep 20 10:05:00', unit: 'systemd', pid: 1, message: 'Starting A high performance web server...', level: 'info' },
      { timestamp: 'Sep 20 10:05:00', unit: 'nginx', pid: 1040, message: 'Configuration /etc/nginx/nginx.conf syntax ok', level: 'info' },
      { timestamp: 'Sep 20 10:05:00', unit: 'systemd', pid: 1, message: 'Started A high performance web server.', level: 'info' },
      { timestamp: 'Sep 20 10:14:22', unit: 'systemd', pid: 1, message: 'Started User Manager for UID 1000.', level: 'info' },
      { timestamp: 'Sep 20 10:14:25', unit: 'sshd', pid: 1450, message: 'Accepted publickey for student from 192.168.1.50 port 54320 ssh2', level: 'info' },
      { timestamp: 'Sep 20 10:14:25', unit: 'systemd-logind', pid: 412, message: 'New session 3 of user student.', level: 'info' },
      { timestamp: 'Sep 20 10:22:15', unit: 'sshd', pid: 1580, message: 'Failed password for invalid user admin from 10.0.0.88 port 48912 ssh2', level: 'warning' },
      { timestamp: 'Sep 20 10:22:18', unit: 'sshd', pid: 1582, message: 'Failed password for invalid user admin from 10.0.0.88 port 48914 ssh2', level: 'warning' },
      { timestamp: 'Sep 20 10:25:01', unit: 'sshd', pid: 1610, message: 'Accepted publickey for bob from 192.168.1.51 port 52140 ssh2', level: 'info' },
    ];
  }

  public getService(name: string): VfsService | undefined {
    const normalized = name.endsWith('.service') ? name : `${name}.service`;
    return this.services.get(normalized) || this.services.get(name);
  }

  public getAllServices(): VfsService[] {
    const list: VfsService[] = [];
    const seen = new Set<string>();
    for (const [k, v] of this.services.entries()) {
      if (k.endsWith('.service') && !seen.has(v.name)) {
        seen.add(v.name);
        list.push(v);
      }
    }
    return list;
  }

  public executeSystemctl(args: string[], isRoot: boolean): CommandExecutionResult {
    if (args.length === 0 || args[0] === 'list-units') {
      return this.listUnits();
    }

    const verb = args[0];
    const target = args[1];

    if (verb === 'status') {
      if (!target) {
        return {
          output: `State: running\nUnits: 124 loaded (sub: running)\nJobs: 0 queued\nFailed: 0 units\nSince: Mon 2026-09-20 10:00:00 UTC\nCGroup: /\n        ├─init.scope\n        │ └─1 /sbin/init\n        └─system.slice\n          ├─cron.service\n          ├─nginx.service\n          └─sshd.service`,
          exitCode: 0,
        };
      }
      return this.renderStatus(target);
    }

    if (verb === 'is-active') {
      if (!target) return { output: 'systemctl: missing unit argument', exitCode: 1 };
      const svc = this.getService(target);
      const active = svc?.activeState === 'active';
      return { output: active ? 'active' : 'inactive', exitCode: active ? 0 : 3 };
    }

    if (verb === 'is-enabled') {
      if (!target) return { output: 'systemctl: missing unit argument', exitCode: 1 };
      const svc = this.getService(target);
      const enabled = svc?.unitFileState === 'enabled';
      return { output: enabled ? 'enabled' : 'disabled', exitCode: enabled ? 0 : 1 };
    }

    if (verb === 'list-unit-files') {
      return this.listUnitFiles();
    }

    if (verb === 'daemon-reload') {
      return { output: '', exitCode: 0 };
    }

    // Mutating actions require root
    if (!isRoot) {
      return {
        output: `Failed to ${verb} ${target || 'service'}: Interactive authentication required. (Try with sudo)`,
        exitCode: 1,
      };
    }

    if (!target) {
      return { output: `systemctl: ${verb} requires at least one unit name`, exitCode: 1 };
    }

    const svc = this.getService(target);
    if (!svc) {
      return { output: `Failed to ${verb} ${target}: Unit ${target}.service not found.`, exitCode: 1 };
    }

    const nowStr = new Date().toUTCString();
    const timeStr = nowStr.slice(17, 25);

    switch (verb) {
      case 'start': {
        svc.activeState = 'active';
        svc.subState = 'running';
        svc.since = nowStr;
        if (!svc.mainPid) {
          svc.mainPid = Math.floor(1000 + Math.random() * 8000);
        }
        svc.logs.push(`Started ${svc.description}.`);
        this.addJournalEntry(svc.name.replace('.service', ''), svc.mainPid, `Started ${svc.description}.`, 'info');
        return { output: '', exitCode: 0 };
      }
      case 'stop': {
        svc.activeState = 'inactive';
        svc.subState = 'dead';
        svc.cgroupProcesses = [];
        svc.logs.push(`Stopped ${svc.description}.`);
        this.addJournalEntry(svc.name.replace('.service', ''), svc.mainPid, `Stopped ${svc.description}.`, 'info');
        svc.mainPid = undefined;
        return { output: '', exitCode: 0 };
      }
      case 'restart': {
        svc.activeState = 'active';
        svc.subState = 'running';
        svc.since = nowStr;
        svc.mainPid = Math.floor(1000 + Math.random() * 8000);
        svc.logs.push(`Restarted ${svc.description}.`);
        this.addJournalEntry(svc.name.replace('.service', ''), svc.mainPid, `Stopping ${svc.description}...`, 'info');
        this.addJournalEntry(svc.name.replace('.service', ''), svc.mainPid, `Started ${svc.description}.`, 'info');
        return { output: '', exitCode: 0 };
      }
      case 'reload': {
        svc.logs.push(`Reloaded ${svc.description} configuration.`);
        this.addJournalEntry(svc.name.replace('.service', ''), svc.mainPid, `Reloaded configuration for ${svc.description}.`, 'info');
        return { output: '', exitCode: 0 };
      }
      case 'enable': {
        svc.unitFileState = 'enabled';
        return {
          output: `Created symlink /etc/systemd/system/multi-user.target.wants/${svc.name} → /lib/systemd/system/${svc.name}.`,
          exitCode: 0,
        };
      }
      case 'disable': {
        svc.unitFileState = 'disabled';
        return {
          output: `Removed /etc/systemd/system/multi-user.target.wants/${svc.name}.`,
          exitCode: 0,
        };
      }
      default:
        return { output: `Unknown operation ${verb}.`, exitCode: 1 };
    }
  }

  private renderStatus(target: string): CommandExecutionResult {
    const svc = this.getService(target);
    if (!svc) {
      return {
        output: `Unit ${target}.service could not be found.`,
        exitCode: 4,
      };
    }

    const dot = svc.activeState === 'active' ? '●' : '○';
    const lines: string[] = [
      `${dot} ${svc.name} - ${svc.description}`,
      `     Loaded: loaded (/lib/systemd/system/${svc.name}; ${svc.unitFileState}; preset: enabled)`,
      `     Active: ${svc.activeState} (${svc.subState}) since ${svc.since}`,
    ];

    if (svc.activeState === 'active' && svc.mainPid) {
      lines.push(`   Main PID: ${svc.mainPid} (${svc.name.replace('.service', '')})`);
      lines.push(`      Tasks: ${svc.cgroupProcesses.length || 1} (limit: 4660)`);
      lines.push(`     Memory: ${svc.memoryUsage}`);
      lines.push(`        CPU: 145ms`);
      lines.push(`     CGroup: /system.slice/${svc.name}`);
      if (svc.cgroupProcesses.length > 0) {
        svc.cgroupProcesses.forEach((p, idx) => {
          const prefix = idx === svc.cgroupProcesses.length - 1 ? '             └─' : '             ├─';
          lines.push(`${prefix}${p.pid} ${p.cmd}`);
        });
      } else {
        lines.push(`             └─${svc.mainPid} /usr/sbin/${svc.name.replace('.service', '')}`);
      }
    }

    lines.push('');
    const recentLogs = svc.logs.slice(-5);
    for (const log of recentLogs) {
      lines.push(`Sep 20 10:15:00 lpi-lab ${svc.name.replace('.service', '')}: ${log}`);
    }

    return {
      output: lines.join('\n'),
      exitCode: svc.activeState === 'active' ? 0 : 3,
    };
  }

  private listUnits(): CommandExecutionResult {
    const header = '  UNIT                        LOAD   ACTIVE SUB     DESCRIPTION';
    const lines = [header];

    for (const svc of this.getAllServices()) {
      const u = svc.name.padEnd(28);
      const l = 'loaded'.padEnd(7);
      const a = svc.activeState.padEnd(7);
      const s = svc.subState.padEnd(8);
      lines.push(`● ${u}${l}${a}${s}${svc.description}`);
    }

    lines.push('\nLOAD   = Reflects whether the unit definition was properly loaded.');
    lines.push('ACTIVE = The high-level unit activation state, i.e. generalization of SUB.');
    lines.push('SUB    = The low-level unit activation state, values depend on unit type.');
    lines.push(`\n${this.getAllServices().length} loaded units listed.`);

    return { output: lines.join('\n'), exitCode: 0 };
  }

  private listUnitFiles(): CommandExecutionResult {
    const header = 'UNIT FILE                              STATE           PRESET ';
    const lines = [header];

    for (const svc of this.getAllServices()) {
      const u = svc.name.padEnd(39);
      const s = svc.unitFileState.padEnd(16);
      lines.push(`${u}${s}enabled`);
    }

    lines.push(`\n${this.getAllServices().length} unit files listed.`);
    return { output: lines.join('\n'), exitCode: 0 };
  }

  public addJournalEntry(unit: string, pid: number | undefined, message: string, level: 'info' | 'warning' | 'err' = 'info') {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.toTimeString().slice(0, 8)}`;
    this.journalEntries.push({
      timestamp: timeStr,
      unit,
      pid,
      message,
      level,
    });
  }

  public executeJournalctl(args: string[]): CommandExecutionResult {
    let unitFilter: string | null = null;
    let limit = 15;
    let reverse = false;

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if ((a === '-u' || a === '--unit') && i + 1 < args.length) {
        unitFilter = args[i + 1].replace('.service', '');
        i++;
      } else if (a.startsWith('-u')) {
        unitFilter = a.slice(2).replace('.service', '');
      } else if (a === '-n' && i + 1 < args.length) {
        limit = parseInt(args[i + 1], 10) || 15;
        i++;
      } else if (a.startsWith('-n')) {
        limit = parseInt(a.slice(2), 10) || 15;
      } else if (a === '-r' || a === '--reverse') {
        reverse = true;
      } else if (a === '-xe' || a === '-e') {
        limit = 25;
      }
    }

    let entries = [...this.journalEntries];

    if (unitFilter) {
      entries = entries.filter((e) => e.unit.toLowerCase() === unitFilter.toLowerCase());
    }

    if (reverse) {
      entries.reverse();
    }

    const selected = entries.slice(-limit);

    if (selected.length === 0) {
      return { output: `-- No entries --`, exitCode: 0 };
    }

    const lines = [
      `-- Journal begins at Mon 2026-09-20 10:00:01 UTC, ends at Mon 2026-09-20 11:30:00 UTC. --`,
    ];

    for (const e of selected) {
      const pidStr = e.pid ? `[${e.pid}]` : '';
      lines.push(`${e.timestamp} lpi-lab ${e.unit}${pidStr}: ${e.message}`);
    }

    return { output: lines.join('\n'), exitCode: 0 };
  }
}
