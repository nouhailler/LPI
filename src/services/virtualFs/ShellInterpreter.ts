import { VirtualFs } from './VirtualFs';
import { CommandExecutionResult, VfsNode, VfsProcess } from './types';

export class ShellInterpreter {
  public fs: VirtualFs;
  public cwd: string = '/home/student';
  public user: string = 'student';
  public previousCwd: string = '/home/student';
  public env: Record<string, string> = {
    USER: 'student',
    HOME: '/home/student',
    PWD: '/home/student',
    SHELL: '/bin/bash',
    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/student/scripts',
    TERM: 'xterm-256color',
    LANG: 'en_US.UTF-8',
    EDITOR: 'nano',
  };
  public history: string[] = [];
  public processes: VfsProcess[] = [
    { pid: 1, user: 'root', cpu: 0.0, mem: 0.4, vsz: 168432, rss: 11200, tty: '?', stat: 'Ss', start: '10:00', time: '0:01', command: '/sbin/init' },
    { pid: 412, user: 'root', cpu: 0.0, mem: 0.2, vsz: 32410, rss: 6140, tty: '?', stat: 'Ss', start: '10:00', time: '0:00', command: '/lib/systemd/systemd-logind' },
    { pid: 614, user: 'root', cpu: 0.0, mem: 0.3, vsz: 48920, rss: 7890, tty: '?', stat: 'Ss', start: '10:00', time: '0:00', command: '/usr/sbin/cron -f' },
    { pid: 820, user: 'root', cpu: 0.1, mem: 0.3, vsz: 72150, rss: 8400, tty: '?', stat: 'Ss', start: '10:01', time: '0:00', command: 'sshd: /usr/sbin/sshd -D' },
    { pid: 1040, user: 'www-data', cpu: 0.2, mem: 0.6, vsz: 142080, rss: 16400, tty: '?', stat: 'S', start: '10:05', time: '0:02', command: 'nginx: worker process' },
    { pid: 1450, user: 'student', cpu: 0.0, mem: 0.3, vsz: 24120, rss: 6800, tty: 'pts/0', stat: 'Ss', start: '10:14', time: '0:00', command: '-bash' },
  ];

  constructor(fs?: VirtualFs) {
    this.fs = fs || new VirtualFs();
  }

  public getPrompt(): string {
    const symbol = this.user === 'root' ? '#' : '$';
    const displayPath = this.cwd === this.env.HOME ? '~' : this.cwd;
    return `${this.user}@lpi-lab:${displayPath}${symbol}`;
  }

  /**
   * Executes a command string, supporting chains (&&, ;), pipes (|), and redirections (>, >>).
   */
  public execute(commandLine: string): CommandExecutionResult {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      return { output: '', exitCode: 0 };
    }

    this.history.push(trimmed);

    // Check for clear command first
    if (trimmed === 'clear') {
      return { output: '', exitCode: 0, cleared: true };
    }

    // Handle command chaining: ; or &&
    if (trimmed.includes('&&')) {
      const parts = trimmed.split('&&');
      let combinedOutput = '';
      for (const part of parts) {
        const res = this.executeSinglePipeline(part.trim());
        combinedOutput += (combinedOutput ? '\n' : '') + res.output;
        if (res.exitCode !== 0) {
          return { output: combinedOutput.trim(), exitCode: res.exitCode, error: res.error };
        }
      }
      return { output: combinedOutput.trim(), exitCode: 0 };
    }

    if (trimmed.includes(';')) {
      const parts = trimmed.split(';');
      let combinedOutput = '';
      let lastExit = 0;
      for (const part of parts) {
        if (!part.trim()) continue;
        const res = this.executeSinglePipeline(part.trim());
        combinedOutput += (combinedOutput ? '\n' : '') + res.output;
        lastExit = res.exitCode;
      }
      return { output: combinedOutput.trim(), exitCode: lastExit };
    }

    return this.executeSinglePipeline(trimmed);
  }

  /**
   * Executes a pipeline: cmd1 | cmd2 > out.txt
   */
  private executeSinglePipeline(pipelineStr: string): CommandExecutionResult {
    // Check for redirection > or >>
    let redirectPath: string | null = null;
    let isAppend = false;
    let pipelineBody = pipelineStr;

    if (pipelineStr.includes('>>')) {
      const parts = pipelineStr.split('>>');
      pipelineBody = parts[0].trim();
      redirectPath = parts[1].trim();
      isAppend = true;
    } else if (pipelineStr.includes('>')) {
      const parts = pipelineStr.split('>');
      pipelineBody = parts[0].trim();
      redirectPath = parts[1].trim();
      isAppend = false;
    }

    // Split pipeline by |
    const stages = pipelineBody.split('|').map((s) => s.trim());
    let currentInput = '';
    let lastResult: CommandExecutionResult = { output: '', exitCode: 0 };

    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (!stage) continue;
      lastResult = this.runCommand(stage, currentInput);
      if (lastResult.exitCode !== 0 && i < stages.length - 1) {
        return lastResult;
      }
      currentInput = lastResult.output;
    }

    if (redirectPath) {
      // Clean quotes from redirect target if any
      const targetClean = redirectPath.replace(/['"]/g, '');
      const writeSuccess = this.fs.writeFile(
        targetClean,
        currentInput + '\n',
        isAppend,
        this.cwd,
        this.user,
        this.user
      );
      if (!writeSuccess) {
        return {
          output: `bash: ${targetClean}: Cannot write or permission denied`,
          exitCode: 1,
          error: 'Permission denied',
        };
      }
      return { output: '', exitCode: 0 };
    }

    return lastResult;
  }

  /**
   * Runs a single atomic command with optional stdin text.
   */
  private runCommand(cmdString: string, stdinText: string = ''): CommandExecutionResult {
    const rawTokens = this.tokenize(cmdString);
    if (rawTokens.length === 0) return { output: '', exitCode: 0 };

    // Variable expansion ($VAR)
    const tokens = rawTokens.map((t) => this.expandVariables(t));

    let cmd = tokens[0];
    let args = tokens.slice(1);

    // Handle sudo
    let isSudo = false;
    if (cmd === 'sudo') {
      if (args.length === 0) {
        return { output: 'usage: sudo command...', exitCode: 1 };
      }
      if (args[0] === 'su' || args[0] === '-i') {
        this.user = 'root';
        this.env.USER = 'root';
        this.env.HOME = '/root';
        return { output: 'Switched to root session.', exitCode: 0 };
      }
      isSudo = true;
      cmd = args[0];
      args = args.slice(1);
    }

    const effectiveUser = isSudo ? 'root' : this.user;

    switch (cmd) {
      case 'pwd':
        return { output: this.cwd, exitCode: 0 };

      case 'cd': {
        const target = args[0] || '~';
        if (target === '-') {
          const temp = this.cwd;
          this.cwd = this.previousCwd;
          this.previousCwd = temp;
          this.env.PWD = this.cwd;
          return { output: this.cwd, exitCode: 0 };
        }
        const resolved = this.fs.normalizePath(target, this.cwd);
        const node = this.fs.getNode(resolved, this.cwd);
        if (!node) {
          return { output: `bash: cd: ${target}: No such file or directory`, exitCode: 1 };
        }
        if (node.type !== 'directory') {
          return { output: `bash: cd: ${target}: Not a directory`, exitCode: 1 };
        }
        // Permission check on directory (execute bit needed to enter)
        if (effectiveUser !== 'root' && node.owner !== effectiveUser && (node.mode & 0o001) === 0) {
          return { output: `bash: cd: ${target}: Permission denied`, exitCode: 1 };
        }
        this.previousCwd = this.cwd;
        this.cwd = resolved;
        this.env.PWD = this.cwd;
        return { output: '', exitCode: 0 };
      }

      case 'ls': {
        let showHidden = false;
        let longFormat = false;
        let humanReadable = false;
        const targetPaths: string[] = [];

        for (const a of args) {
          if (a.startsWith('-') && a.length > 1) {
            if (a.includes('a')) showHidden = true;
            if (a.includes('l')) longFormat = true;
            if (a.includes('h')) humanReadable = true;
          } else {
            targetPaths.push(a);
          }
        }

        const pathToList = targetPaths[0] || '.';
        const resolved = this.fs.normalizePath(pathToList, this.cwd);
        const targetNode = this.fs.getNode(resolved, this.cwd);

        if (!targetNode) {
          return { output: `ls: cannot access '${pathToList}': No such file or directory`, exitCode: 2 };
        }

        if (targetNode.type === 'file') {
          if (longFormat) {
            return { output: this.formatLongEntry(targetNode, humanReadable), exitCode: 0 };
          }
          return { output: targetNode.name, exitCode: 0 };
        }

        const items = this.fs.listDir(resolved, showHidden, this.cwd);
        if (!items) {
          return { output: `ls: cannot access '${pathToList}': Permission denied`, exitCode: 2 };
        }

        if (longFormat) {
          const totalBlocks = items.reduce((acc, it) => acc + Math.ceil(it.size / 1024) * 4, 0);
          const lines = [`total ${totalBlocks}`];
          for (const it of items) {
            lines.push(this.formatLongEntry(it, humanReadable));
          }
          return { output: lines.join('\n'), exitCode: 0 };
        }

        // Short format: space-separated
        const names = items.map((it) => it.name);
        return { output: names.join('  '), exitCode: 0 };
      }

      case 'mkdir': {
        let recursive = false;
        const dirs: string[] = [];
        for (const a of args) {
          if (a === '-p' || a === '--parents') recursive = true;
          else if (!a.startsWith('-')) dirs.push(a);
        }
        if (dirs.length === 0) {
          return { output: 'mkdir: missing operand', exitCode: 1 };
        }
        for (const d of dirs) {
          const res = this.fs.mkdir(d, recursive, this.cwd, effectiveUser, effectiveUser);
          if (!res.success) {
            return { output: `mkdir: cannot create directory '${d}': ${res.error}`, exitCode: 1 };
          }
        }
        return { output: '', exitCode: 0 };
      }

      case 'touch': {
        if (args.length === 0) {
          return { output: 'touch: missing file operand', exitCode: 1 };
        }
        for (const f of args) {
          this.fs.touch(f, this.cwd, effectiveUser, effectiveUser);
        }
        return { output: '', exitCode: 0 };
      }

      case 'cat': {
        const fileArgs = args.filter((a) => !a.startsWith('-'));
        if (fileArgs.length === 0) {
          // If stdin passed from pipe, output it
          return { output: stdinText, exitCode: 0 };
        }
        let out = '';
        for (const f of fileArgs) {
          const content = this.fs.readFile(f, this.cwd);
          if (content === null) {
            const node = this.fs.getNode(f, this.cwd);
            if (node && node.type === 'directory') {
              return { output: `cat: ${f}: Is a directory`, exitCode: 1 };
            }
            return { output: `cat: ${f}: No such file or directory`, exitCode: 1 };
          }
          out += (out ? '\n' : '') + content.trimEnd();
        }
        return { output: out, exitCode: 0 };
      }

      case 'head':
      case 'tail': {
        let count = 10;
        let file = '';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) {
            count = parseInt(args[i + 1], 10) || 10;
            i++;
          } else if (args[i].startsWith('-') && /-\d+/.test(args[i])) {
            count = parseInt(args[i].slice(1), 10) || 10;
          } else {
            file = args[i];
          }
        }
        const text = file ? this.fs.readFile(file, this.cwd) : stdinText;
        if (text === null) {
          return { output: `${cmd}: cannot open '${file}' for reading: No such file`, exitCode: 1 };
        }
        const lines = text.split('\n');
        const slice = cmd === 'head' ? lines.slice(0, count) : lines.slice(-count);
        return { output: slice.join('\n'), exitCode: 0 };
      }

      case 'less':
      case 'more': {
        const file = args[0];
        const text = file ? this.fs.readFile(file, this.cwd) : stdinText;
        if (text === null) {
          return { output: `${cmd}: ${file}: No such file or directory`, exitCode: 1 };
        }
        return { output: text, exitCode: 0 };
      }

      case 'cp': {
        let recursive = false;
        const targets: string[] = [];
        for (const a of args) {
          if (a === '-r' || a === '-R' || a === '--recursive') recursive = true;
          else if (!a.startsWith('-')) targets.push(a);
        }
        if (targets.length < 2) {
          return { output: 'cp: missing destination file operand', exitCode: 1 };
        }
        const src = targets[0];
        const dest = targets[1];
        const res = this.fs.cp(src, dest, recursive, this.cwd);
        if (!res.success) {
          return { output: `cp: ${res.error}`, exitCode: 1 };
        }
        return { output: '', exitCode: 0 };
      }

      case 'mv': {
        const targets = args.filter((a) => !a.startsWith('-'));
        if (targets.length < 2) {
          return { output: 'mv: missing destination file operand', exitCode: 1 };
        }
        const res = this.fs.mv(targets[0], targets[1], this.cwd);
        if (!res.success) {
          return { output: `mv: ${res.error}`, exitCode: 1 };
        }
        return { output: '', exitCode: 0 };
      }

      case 'rm': {
        let recursive = false;
        let force = false;
        const targets: string[] = [];
        for (const a of args) {
          if (a === '-r' || a === '-R' || a === '--recursive') recursive = true;
          else if (a === '-f' || a === '--force') force = true;
          else if (a === '-rf' || a === '-fr') {
            recursive = true;
            force = true;
          } else if (!a.startsWith('-')) {
            targets.push(a);
          }
        }
        if (targets.length === 0) {
          return { output: 'rm: missing operand', exitCode: 1 };
        }
        for (const t of targets) {
          const res = this.fs.rm(t, recursive, this.cwd);
          if (!res.success && !force) {
            return { output: `rm: ${res.error}`, exitCode: 1 };
          }
        }
        return { output: '', exitCode: 0 };
      }

      case 'chmod': {
        let recursive = false;
        let modeStr = '';
        const targets: string[] = [];
        for (const a of args) {
          if (a === '-R' || a === '--recursive') recursive = true;
          else if (!modeStr) modeStr = a;
          else targets.push(a);
        }
        if (!modeStr || targets.length === 0) {
          return { output: 'chmod: missing operand', exitCode: 1 };
        }
        for (const t of targets) {
          const res = this.fs.chmod(t, modeStr, recursive, this.cwd);
          if (!res.success) {
            return { output: `chmod: ${res.error}`, exitCode: 1 };
          }
        }
        return { output: '', exitCode: 0 };
      }

      case 'chown': {
        let recursive = false;
        let ownerStr = '';
        const targets: string[] = [];
        for (const a of args) {
          if (a === '-R' || a === '--recursive') recursive = true;
          else if (!ownerStr) ownerStr = a;
          else targets.push(a);
        }
        if (!ownerStr || targets.length === 0) {
          return { output: 'chown: missing operand', exitCode: 1 };
        }
        for (const t of targets) {
          const res = this.fs.chown(t, ownerStr, recursive, this.cwd);
          if (!res.success) {
            return { output: `chown: ${res.error}`, exitCode: 1 };
          }
        }
        return { output: '', exitCode: 0 };
      }

      case 'ln': {
        let isSymbolic = false;
        const targets: string[] = [];
        for (const a of args) {
          if (a === '-s' || a === '--symbolic') isSymbolic = true;
          else if (!a.startsWith('-')) targets.push(a);
        }
        if (targets.length < 2) {
          return { output: 'ln: missing destination file operand', exitCode: 1 };
        }
        if (!isSymbolic) {
          return { output: 'ln: hard links not supported in virtual filesystem, use -s', exitCode: 1 };
        }
        const res = this.fs.ln(targets[0], targets[1], this.cwd);
        if (!res.success) {
          return { output: `ln: ${res.error}`, exitCode: 1 };
        }
        return { output: '', exitCode: 0 };
      }

      case 'grep': {
        let ignoreCase = false;
        let invertMatch = false;
        let lineNumbers = false;
        let countOnly = false;
        let pattern = '';
        const files: string[] = [];

        for (const a of args) {
          if (a.startsWith('-')) {
            if (a.includes('i')) ignoreCase = true;
            if (a.includes('v')) invertMatch = true;
            if (a.includes('n')) lineNumbers = true;
            if (a.includes('c')) countOnly = true;
          } else if (!pattern) {
            pattern = a;
          } else {
            files.push(a);
          }
        }

        if (!pattern) {
          return { output: 'grep: missing pattern', exitCode: 2 };
        }

        let flags = ignoreCase ? 'i' : '';
        let re: RegExp;
        try {
          re = new RegExp(pattern, flags);
        } catch {
          re = new RegExp(pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&'), flags);
        }

        let matchedLines: string[] = [];

        const searchSource = (text: string, prefix: string = '') => {
          const lines = text.split('\n');
          lines.forEach((line, idx) => {
            if (!line && idx === lines.length - 1) return;
            const matches = re.test(line);
            const condition = invertMatch ? !matches : matches;
            if (condition) {
              let formatted = line;
              if (lineNumbers) formatted = `${idx + 1}:${formatted}`;
              if (prefix) formatted = `${prefix}:${formatted}`;
              matchedLines.push(formatted);
            }
          });
        };

        if (files.length === 0) {
          searchSource(stdinText);
        } else {
          for (const f of files) {
            const content = this.fs.readFile(f, this.cwd);
            if (content === null) {
              return { output: `grep: ${f}: No such file or directory`, exitCode: 2 };
            }
            searchSource(content, files.length > 1 ? f : '');
          }
        }

        if (countOnly) {
          return { output: String(matchedLines.length), exitCode: matchedLines.length > 0 ? 0 : 1 };
        }

        return {
          output: matchedLines.join('\n'),
          exitCode: matchedLines.length > 0 ? 0 : 1,
        };
      }

      case 'find': {
        let startPath = '.';
        let namePattern: string | undefined;
        let type: 'f' | 'd' | undefined;
        let perm: number | undefined;

        let i = 0;
        if (args[0] && !args[0].startsWith('-')) {
          startPath = args[0];
          i = 1;
        }

        while (i < args.length) {
          if (args[i] === '-name' && args[i + 1]) {
            namePattern = args[i + 1].replace(/['"]/g, '');
            i += 2;
          } else if (args[i] === '-type' && args[i + 1]) {
            type = args[i + 1] === 'f' ? 'f' : args[i + 1] === 'd' ? 'd' : undefined;
            i += 2;
          } else if (args[i] === '-perm' && args[i + 1]) {
            perm = parseInt(args[i + 1], 8);
            i += 2;
          } else {
            i++;
          }
        }

        const matches = this.fs.find(startPath, { namePattern, type, perm }, this.cwd);
        return { output: matches.join('\n'), exitCode: 0 };
      }

      case 'tar': {
        let mode = '';
        let archiveFile = '';
        const pathsToArchive: string[] = [];

        for (let idx = 0; idx < args.length; idx++) {
          const a = args[idx];
          if (a.startsWith('-') || /^[cxtvfz]+$/.test(a)) {
            const flags = a.replace(/^-/, '');
            if (flags.includes('c')) mode = 'create';
            if (flags.includes('x')) mode = 'extract';
            if (flags.includes('t')) mode = 'list';
            if (flags.includes('f')) {
              archiveFile = args[idx + 1] || '';
              idx++;
            }
          } else if (!archiveFile) {
            archiveFile = a;
          } else {
            pathsToArchive.push(a);
          }
        }

        if (!archiveFile) {
          return { output: 'tar: Refusing to read/write archive contents from terminal without -f', exitCode: 1 };
        }

        if (mode === 'create') {
          if (pathsToArchive.length === 0) {
            return { output: 'tar: Cowardly refusing to create an empty archive', exitCode: 1 };
          }
          const simulatedTarHeader = `[TAR ARCHIVE V1.0] Packed entries:\n` + pathsToArchive.join('\n');
          this.fs.writeFile(archiveFile, simulatedTarHeader, false, this.cwd, effectiveUser, effectiveUser);
          return { output: '', exitCode: 0 };
        } else if (mode === 'list') {
          const content = this.fs.readFile(archiveFile, this.cwd);
          if (!content) {
            return { output: `tar: ${archiveFile}: Cannot open: No such file or directory`, exitCode: 2 };
          }
          return { output: content, exitCode: 0 };
        } else if (mode === 'extract') {
          const content = this.fs.readFile(archiveFile, this.cwd);
          if (!content) {
            return { output: `tar: ${archiveFile}: Cannot open: No such file or directory`, exitCode: 2 };
          }
          return { output: `tar: Extracted archive ${archiveFile}`, exitCode: 0 };
        }

        return { output: 'tar: Specify action -c (create), -x (extract) or -t (list)', exitCode: 1 };
      }

      case 'ps': {
        const lines = [
          'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
        ];
        for (const p of this.processes) {
          const line = `${p.user.padEnd(8)} ${String(p.pid).padStart(5)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${String(p.vsz).padStart(6)} ${String(p.rss).padStart(5)} ${p.tty.padEnd(8)} ${p.stat.padEnd(4)} ${p.start.padEnd(5)} ${p.time.padEnd(6)} ${p.command}`;
          lines.push(line);
        }
        return { output: lines.join('\n'), exitCode: 0 };
      }

      case 'kill': {
        let signal = 'TERM';
        let targetPid: number | null = null;
        for (const a of args) {
          if (a === '-9' || a === '-KILL') signal = 'KILL';
          else {
            const p = parseInt(a, 10);
            if (!isNaN(p)) targetPid = p;
          }
        }
        if (targetPid === null) {
          return { output: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...', exitCode: 1 };
        }
        if (targetPid === 1) {
          return { output: 'bash: kill: (1) - Operation not permitted (cannot kill PID 1)', exitCode: 1 };
        }
        const index = this.processes.findIndex((p) => p.pid === targetPid);
        if (index === -1) {
          return { output: `bash: kill: (${targetPid}) - No such process`, exitCode: 1 };
        }
        this.processes.splice(index, 1);
        return { output: `[${signal}] Process ${targetPid} terminated`, exitCode: 0 };
      }

      case 'echo': {
        let str = args.join(' ');
        // Strip outer quotes if paired
        if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
          str = str.slice(1, -1);
        }
        return { output: str, exitCode: 0 };
      }

      case 'export': {
        if (args.length === 0) {
          return {
            output: Object.entries(this.env)
              .map(([k, v]) => `declare -x ${k}="${v}"`)
              .join('\n'),
            exitCode: 0,
          };
        }
        for (const a of args) {
          const eqIdx = a.indexOf('=');
          if (eqIdx !== -1) {
            const k = a.slice(0, eqIdx);
            const v = a.slice(eqIdx + 1).replace(/^["']|["']$/g, '');
            this.env[k] = v;
          }
        }
        return { output: '', exitCode: 0 };
      }

      case 'env': {
        return {
          output: Object.entries(this.env)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n'),
          exitCode: 0,
        };
      }

      case 'which': {
        if (args.length === 0) return { output: '', exitCode: 1 };
        const binaryName = args[0];
        const paths = (this.env.PATH || '').split(':');
        for (const p of paths) {
          const testPath = `${p}/${binaryName}`;
          const node = this.fs.getNode(testPath);
          if (node && node.type === 'file') {
            return { output: testPath, exitCode: 0 };
          }
        }
        // Known builtins / virtual binaries
        const known: Record<string, string> = {
          bash: '/bin/bash',
          sh: '/bin/sh',
          ls: '/bin/ls',
          cat: '/bin/cat',
          cp: '/bin/cp',
          mv: '/bin/mv',
          rm: '/bin/rm',
          chmod: '/bin/chmod',
          chown: '/bin/chown',
          tar: '/bin/tar',
          grep: '/bin/grep',
          ps: '/bin/ps',
          kill: '/bin/kill',
          find: '/usr/bin/find',
          less: '/usr/bin/less',
          which: '/usr/bin/which',
          man: '/usr/bin/man',
          env: '/usr/bin/env',
        };
        if (known[binaryName]) {
          return { output: known[binaryName], exitCode: 0 };
        }
        return { output: `${binaryName} not found in ${this.env.PATH}`, exitCode: 1 };
      }

      case 'whoami':
        return { output: effectiveUser, exitCode: 0 };

      case 'id':
        return {
          output:
            effectiveUser === 'root'
              ? 'uid=0(root) gid=0(root) groups=0(root)'
              : 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo),1001(developers)',
          exitCode: 0,
        };

      case 'uname': {
        if (args.includes('-a')) {
          return { output: 'Linux lpi-lab 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux', exitCode: 0 };
        }
        if (args.includes('-r')) return { output: '6.1.0-21-amd64', exitCode: 0 };
        return { output: 'Linux', exitCode: 0 };
      }

      case 'df':
        return {
          output:
            'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        48G   12G   34G  27% /\ntmpfs           1.9G     0  1.9G   0% /dev/shm\n/dev/sdb1        96G   24G   68G  26% /data\n/dev/sda2       512M  6.1M  506M   2% /boot/efi',
          exitCode: 0,
        };

      case 'free':
        return {
          output:
            '               total        used        free      shared  buff/cache   available\nMem:         3921840      842100     2154320       42100      925420     2945200\nSwap:        2097148           0     2097148',
          exitCode: 0,
        };

      case 'uptime':
        return {
          output: ' 10:25:40 up  2:25,  1 user,  load average: 0.12, 0.08, 0.04',
          exitCode: 0,
        };

      case 'date':
        return { output: new Date().toUTCString(), exitCode: 0 };

      case 'history': {
        const lines = this.history.map((h, idx) => `  ${String(idx + 1).padStart(4)}  ${h}`);
        return { output: lines.join('\n'), exitCode: 0 };
      }

      case 'man': {
        const topic = args[0];
        return { output: this.getManualPage(topic), exitCode: 0 };
      }

      case 'help':
        return {
          output:
            '=== LPI Virtual Terminal Engine (100% PWA & Offline) ===\n' +
            'Available commands:\n' +
            '  Navigation & Files : pwd, cd, ls, mkdir, touch, cp, mv, rm, ln\n' +
            '  Text & Search      : cat, less, more, head, tail, grep, find, echo\n' +
            '  Permissions & Own  : chmod (e.g. 750, 644, +x), chown (e.g. student:developers)\n' +
            '  Archives           : tar (-czvf, -xvf, -tvf)\n' +
            '  Processes & System : ps (aux), kill (-9), uptime, df (-h), free (-m), uname (-a)\n' +
            '  Environment & User : export, env, which, whoami, id, date, sudo\n' +
            '  Shell Features     : Pipes (|), Redirections (> and >>), Chaining (&&, ;)\n' +
            '  Documentation      : man <command>, help, history, clear',
          exitCode: 0,
        };

      default:
        return {
          output: `bash: ${cmd}: command not found. Type 'help' to see available commands.`,
          exitCode: 127,
        };
    }
  }

  private formatLongEntry(node: VfsNode, humanReadable: boolean): string {
    const mode = VirtualFs.formatMode(node);
    const links = node.type === 'directory' ? 2 : 1;
    const owner = node.owner.padEnd(8);
    const group = node.group.padEnd(8);
    const size = humanReadable ? this.formatSizeHuman(node.size) : String(node.size).padStart(6);
    const dateStr = 'Sep 20 10:15';
    const name = node.type === 'symlink' ? `${node.name} -> ${node.target}` : node.name;
    return `${mode} ${links} ${owner} ${group} ${size} ${dateStr} ${name}`;
  }

  private formatSizeHuman(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
  }

  private expandVariables(token: string): string {
    return token.replace(/\$([A-Za-z0-9_?]+)/g, (_, varName) => {
      if (varName === '?') return '0';
      return this.env[varName] !== undefined ? this.env[varName] : '';
    });
  }

  private tokenize(str: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inDoubleQuotes = false;
    let inSingleQuotes = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '"' && !inSingleQuotes) {
        inDoubleQuotes = !inDoubleQuotes;
      } else if (char === "'" && !inDoubleQuotes) {
        inSingleQuotes = !inSingleQuotes;
      } else if (/\s/.test(char) && !inDoubleQuotes && !inSingleQuotes) {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current.length > 0) {
      tokens.push(current);
    }
    return tokens;
  }

  private getManualPage(cmd?: string): string {
    if (!cmd) return 'What manual page do you want? (e.g. man chmod, man grep, man ls)';
    const manuals: Record<string, string> = {
      chmod:
        'NAME\n  chmod - change file mode bits\n\nSYNOPSIS\n  chmod [OPTION]... MODE[,MODE]... FILE...\n  chmod [OPTION]... OCTAL-MODE FILE...\n\nDESCRIPTION\n  chmod changes the file mode bits of each given file according to MODE.\n  Octal representation:\n    4 = Read (r), 2 = Write (w), 1 = Execute (x)\n    750 = rwxr-x--- (User full, Group read/exec, Others none)\n    644 = rw-r--r-- (Standard regular file)\n\n  Symbolic representation:\n    chmod +x file.sh       (Make executable)\n    chmod u=rwx,g=rx,o= file.sh\n    chmod -R 750 /path/to/dir',
      chown:
        'NAME\n  chown - change file owner and group\n\nSYNOPSIS\n  chown [OPTION]... [OWNER][:[GROUP]] FILE...\n\nDESCRIPTION\n  Changes ownership of files and directories.\n  Examples:\n    chown student backup.sh\n    chown student:developers app.py\n    chown -R student:student /home/student/projects',
      ls:
        'NAME\n  ls - list directory contents\n\nSYNOPSIS\n  ls [OPTION]... [FILE]...\n\nOPTIONS\n  -l  Use a long listing format (permissions, owner, size, date)\n  -a  Do not ignore entries starting with .\n  -h  With -l, print sizes in human readable format (e.g., 1K 234M 2G)',
      grep:
        'NAME\n  grep - print lines that match patterns\n\nSYNOPSIS\n  grep [OPTION...] PATTERNS [FILE...]\n\nOPTIONS\n  -i  Ignore case distinctions in patterns and input data\n  -v  Invert the sense of matching, to select non-matching lines\n  -n  Prefix each line of output with the 1-based line number\n  -c  Suppress normal output; instead print a count of matching lines',
      tar:
        'NAME\n  tar - an archiving utility\n\nSYNOPSIS\n  tar [OPTION...] [FILE]...\n\nOPTIONS\n  -c  Create a new archive\n  -x  Extract files from an archive\n  -t  List the contents of an archive\n  -v  Verbosely list files processed\n  -f  Use archive file\n  -z  Filter the archive through gzip',
      find:
        'NAME\n  find - search for files in a directory hierarchy\n\nSYNOPSIS\n  find [-H] [-L] [-P] [path...] [expression]\n\nOPTIONS\n  -name pattern   Base of file name matches pattern\n  -type f|d       File is of type f (regular file) or d (directory)\n  -perm mode      File bits match mode exactly (e.g. -perm 750)',
      ps:
        'NAME\n  ps - report a snapshot of the current processes\n\nSYNOPSIS\n  ps [options]\n\nDESCRIPTION\n  ps displays information about a selection of the active processes.\n  ps aux shows processes for all users in BSD syntax.',
    };
    return manuals[cmd] || `No manual entry for ${cmd}. Supported manuals: chmod, chown, ls, grep, tar, find, ps.`;
  }
}
