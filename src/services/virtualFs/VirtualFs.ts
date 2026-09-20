import { VfsNode, VfsNodeType } from './types';
import { createInitialFileSystem } from './initialFs';

export class VirtualFs {
  private root: VfsNode;

  constructor(initialRoot?: VfsNode) {
    this.root = initialRoot ? JSON.parse(JSON.stringify(initialRoot)) : createInitialFileSystem();
  }

  public getRoot(): VfsNode {
    return this.root;
  }

  public reset(customRoot?: VfsNode): void {
    this.root = customRoot ? JSON.parse(JSON.stringify(customRoot)) : createInitialFileSystem();
  }

  public clone(): VirtualFs {
    return new VirtualFs(this.root);
  }

  /**
   * Normalizes a path relative to cwd, resolving ., .., and duplicate slashes.
   */
  public normalizePath(rawPath: string, cwd: string = '/home/student'): string {
    let p = rawPath.trim();
    if (p.startsWith('~')) {
      p = '/home/student' + p.slice(1);
    }
    if (!p.startsWith('/')) {
      p = (cwd.endsWith('/') ? cwd : cwd + '/') + p;
    }

    const segments = p.split('/').filter((s) => s.length > 0 && s !== '.');
    const resolved: string[] = [];

    for (const seg of segments) {
      if (seg === '..') {
        if (resolved.length > 0) {
          resolved.pop();
        }
      } else {
        resolved.push(seg);
      }
    }

    return '/' + resolved.join('/');
  }

  /**
   * Resolves a node at the given normalized path. Returns null if not found.
   */
  public getNode(path: string, cwd: string = '/home/student'): VfsNode | null {
    const norm = this.normalizePath(path, cwd);
    if (norm === '/') {
      return this.root;
    }

    const parts = norm.split('/').filter(Boolean);
    let curr: VfsNode = this.root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (curr.type === 'symlink' && curr.target) {
        const resolvedTarget = this.getNode(curr.target, cwd);
        if (!resolvedTarget) return null;
        curr = resolvedTarget;
      }

      if (curr.type !== 'directory' || !curr.children) {
        return null;
      }

      const next = curr.children[part];
      if (!next) {
        return null;
      }
      curr = next;
    }

    return curr;
  }

  /**
   * Resolves the parent directory and filename.
   */
  public getParentAndName(path: string, cwd: string = '/home/student'): { parent: VfsNode | null; name: string; fullPath: string } {
    const norm = this.normalizePath(path, cwd);
    if (norm === '/') {
      return { parent: null, name: '', fullPath: '/' };
    }
    const parts = norm.split('/').filter(Boolean);
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.getNode(parentPath, cwd);
    return { parent, name, fullPath: norm };
  }

  /**
   * Formats permissions as standard ls -l mode: drwxr-xr-x or -rw-r-----
   */
  public static formatMode(node: VfsNode): string {
    const typeChar = node.type === 'directory' ? 'd' : node.type === 'symlink' ? 'l' : '-';
    const mode = node.mode;

    const uR = mode & 0o400 ? 'r' : '-';
    const uW = mode & 0o200 ? 'w' : '-';
    const uX = mode & 0o100 ? (mode & 0o4000 ? 's' : 'x') : mode & 0o4000 ? 'S' : '-';

    const gR = mode & 0o040 ? 'r' : '-';
    const gW = mode & 0o020 ? 'w' : '-';
    const gX = mode & 0o010 ? (mode & 0o2000 ? 's' : 'x') : mode & 0o2000 ? 'S' : '-';

    const oR = mode & 0o004 ? 'r' : '-';
    const oW = mode & 0o002 ? 'w' : '-';
    const oX = mode & 0o001 ? (mode & 0o1000 ? 't' : 'x') : mode & 0o1000 ? 'T' : '-';

    return `${typeChar}${uR}${uW}${uX}${gR}${gW}${gX}${oR}${oW}${oX}`;
  }

  /**
   * Creates or touches a file.
   */
  public touch(path: string, cwd: string = '/home/student', user: string = 'student', group: string = 'student'): boolean {
    const existing = this.getNode(path, cwd);
    if (existing) {
      existing.mtime = new Date();
      return true;
    }

    const { parent, name } = this.getParentAndName(path, cwd);
    if (!parent || parent.type !== 'directory') {
      return false;
    }

    if (!parent.children) {
      parent.children = {};
    }

    parent.children[name] = {
      name,
      type: 'file',
      mode: 0o644,
      owner: user,
      group: group,
      size: 0,
      mtime: new Date(),
      content: '',
    };
    return true;
  }

  /**
   * Writes content to a file (creates if not existing, supports append).
   */
  public writeFile(
    path: string,
    content: string,
    append: boolean = false,
    cwd: string = '/home/student',
    user: string = 'student',
    group: string = 'student'
  ): boolean {
    const existing = this.getNode(path, cwd);
    if (existing) {
      if (existing.type !== 'file') return false;
      existing.content = append ? (existing.content || '') + content : content;
      existing.size = (existing.content || '').length;
      existing.mtime = new Date();
      return true;
    }

    const { parent, name } = this.getParentAndName(path, cwd);
    if (!parent || parent.type !== 'directory') return false;

    if (!parent.children) parent.children = {};
    parent.children[name] = {
      name,
      type: 'file',
      mode: 0o644,
      owner: user,
      group: group,
      size: content.length,
      mtime: new Date(),
      content,
    };
    return true;
  }

  /**
   * Reads file content.
   */
  public readFile(path: string, cwd: string = '/home/student'): string | null {
    const node = this.getNode(path, cwd);
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content || '';
  }

  /**
   * Creates a directory.
   */
  public mkdir(
    path: string,
    recursive: boolean = false,
    cwd: string = '/home/student',
    user: string = 'student',
    group: string = 'student'
  ): { success: boolean; error?: string } {
    const norm = this.normalizePath(path, cwd);
    const parts = norm.split('/').filter(Boolean);

    if (parts.length === 0) {
      return { success: false, error: 'Cannot create root directory' };
    }

    let curr = this.root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!curr.children) curr.children = {};

      const next = curr.children[part];
      if (next) {
        if (next.type !== 'directory') {
          return { success: false, error: `File exists and is not a directory: ${part}` };
        }
        curr = next;
      } else {
        if (i < parts.length - 1 && !recursive) {
          return { success: false, error: `No such file or directory: parent does not exist` };
        }
        const newDir: VfsNode = {
          name: part,
          type: 'directory',
          mode: 0o755,
          owner: user,
          group: group,
          size: 4096,
          mtime: new Date(),
          children: {},
        };
        curr.children[part] = newDir;
        curr = newDir;
      }
    }

    return { success: true };
  }

  /**
   * Removes a file or directory.
   */
  public rm(path: string, recursive: boolean = false, cwd: string = '/home/student'): { success: boolean; error?: string } {
    const { parent, name, fullPath } = this.getParentAndName(path, cwd);
    if (fullPath === '/') {
      return { success: false, error: 'Cannot remove root directory /' };
    }
    if (!parent || !parent.children || !parent.children[name]) {
      return { success: false, error: `No such file or directory: ${path}` };
    }

    const target = parent.children[name];
    if (target.type === 'directory' && !recursive) {
      return { success: false, error: `Cannot remove '${name}': Is a directory (use -r)` };
    }

    delete parent.children[name];
    return { success: true };
  }

  /**
   * Copies a file or directory.
   */
  public cp(
    srcPath: string,
    destPath: string,
    recursive: boolean = false,
    cwd: string = '/home/student'
  ): { success: boolean; error?: string } {
    const srcNode = this.getNode(srcPath, cwd);
    if (!srcNode) {
      return { success: false, error: `cannot stat '${srcPath}': No such file or directory` };
    }

    if (srcNode.type === 'directory' && !recursive) {
      return { success: false, error: `-r not specified; omitting directory '${srcPath}'` };
    }

    const cloned = JSON.parse(JSON.stringify(srcNode)) as VfsNode;

    const destNode = this.getNode(destPath, cwd);
    if (destNode && destNode.type === 'directory') {
      if (!destNode.children) destNode.children = {};
      destNode.children[cloned.name] = cloned;
      return { success: true };
    }

    const { parent, name } = this.getParentAndName(destPath, cwd);
    if (!parent || parent.type !== 'directory') {
      return { success: false, error: `cannot create '${destPath}': No such directory` };
    }
    if (!parent.children) parent.children = {};
    cloned.name = name;
    parent.children[name] = cloned;
    return { success: true };
  }

  /**
   * Moves or renames a file or directory.
   */
  public mv(srcPath: string, destPath: string, cwd: string = '/home/student'): { success: boolean; error?: string } {
    const srcNode = this.getNode(srcPath, cwd);
    if (!srcNode) {
      return { success: false, error: `cannot stat '${srcPath}': No such file or directory` };
    }

    const { parent: srcParent, name: srcName } = this.getParentAndName(srcPath, cwd);
    if (!srcParent || !srcParent.children) {
      return { success: false, error: `cannot remove '${srcPath}'` };
    }

    const destNode = this.getNode(destPath, cwd);
    if (destNode && destNode.type === 'directory') {
      if (!destNode.children) destNode.children = {};
      destNode.children[srcNode.name] = srcNode;
      delete srcParent.children[srcName];
      return { success: true };
    }

    const { parent: destParent, name: destName } = this.getParentAndName(destPath, cwd);
    if (!destParent || destParent.type !== 'directory') {
      return { success: false, error: `cannot move to '${destPath}': No such file or directory` };
    }

    if (!destParent.children) destParent.children = {};
    srcNode.name = destName;
    destParent.children[destName] = srcNode;
    delete srcParent.children[srcName];
    return { success: true };
  }

  /**
   * Applies chmod (numeric e.g. 750 or symbolic e.g. +x, u=rwx,g=rx,o=).
   */
  public chmod(path: string, modeStr: string, recursive: boolean = false, cwd: string = '/home/student'): { success: boolean; error?: string } {
    const node = this.getNode(path, cwd);
    if (!node) {
      return { success: false, error: `cannot access '${path}': No such file or directory` };
    }

    const applyToNode = (target: VfsNode) => {
      // 1. Check if numeric octal (e.g. 755, 644, 750, 0750)
      if (/^[0-7]{3,4}$/.test(modeStr)) {
        target.mode = parseInt(modeStr, 8);
        return;
      }

      // 2. Symbolic modes: e.g. +x, -w, u+x, go-w, u=rwx,g=rx,o=
      const clauses = modeStr.split(',');
      for (const clause of clauses) {
        const match = clause.match(/^([ugoa]*)([\+\-\=])([rwxXst]*)$/);
        if (match) {
          const who = match[1] || 'a';
          const op = match[2];
          const permChars = match[3];

          let bits = 0;
          if (permChars.includes('r')) bits |= 0o4;
          if (permChars.includes('w')) bits |= 0o2;
          if (permChars.includes('x') || permChars.includes('X')) bits |= 0o1;

          const applyTarget = (maskShift: number) => {
            const mask = bits << maskShift;
            if (op === '+') {
              target.mode |= mask;
            } else if (op === '-') {
              target.mode &= ~mask;
            } else if (op === '=') {
              const fullGroupMask = 0o7 << maskShift;
              target.mode = (target.mode & ~fullGroupMask) | mask;
            }
          };

          if (who.includes('a') || who === '') {
            applyTarget(6);
            applyTarget(3);
            applyTarget(0);
          } else {
            if (who.includes('u')) applyTarget(6);
            if (who.includes('g')) applyTarget(3);
            if (who.includes('o')) applyTarget(0);
          }
        }
      }
    };

    const traverse = (n: VfsNode) => {
      applyToNode(n);
      if (recursive && n.type === 'directory' && n.children) {
        Object.values(n.children).forEach(traverse);
      }
    };

    traverse(node);
    return { success: true };
  }

  /**
   * Applies chown (user:group, user, or :group).
   */
  public chown(path: string, ownerStr: string, recursive: boolean = false, cwd: string = '/home/student'): { success: boolean; error?: string } {
    const node = this.getNode(path, cwd);
    if (!node) {
      return { success: false, error: `cannot access '${path}': No such file or directory` };
    }

    let newUser: string | undefined;
    let newGroup: string | undefined;

    if (ownerStr.includes(':')) {
      const parts = ownerStr.split(':');
      if (parts[0]) newUser = parts[0];
      if (parts[1]) newGroup = parts[1];
    } else if (ownerStr.includes('.')) {
      const parts = ownerStr.split('.');
      if (parts[0]) newUser = parts[0];
      if (parts[1]) newGroup = parts[1];
    } else {
      newUser = ownerStr;
    }

    const applyToNode = (target: VfsNode) => {
      if (newUser) target.owner = newUser;
      if (newGroup) target.group = newGroup;
    };

    const traverse = (n: VfsNode) => {
      applyToNode(n);
      if (recursive && n.type === 'directory' && n.children) {
        Object.values(n.children).forEach(traverse);
      }
    };

    traverse(node);
    return { success: true };
  }

  /**
   * Creates a symbolic link.
   */
  public ln(target: string, linkPath: string, cwd: string = '/home/student'): { success: boolean; error?: string } {
    const { parent, name } = this.getParentAndName(linkPath, cwd);
    if (!parent || parent.type !== 'directory') {
      return { success: false, error: `cannot create link '${linkPath}': No such directory` };
    }
    if (!parent.children) parent.children = {};

    parent.children[name] = {
      name,
      type: 'symlink',
      mode: 0o777,
      owner: 'student',
      group: 'student',
      size: target.length,
      mtime: new Date(),
      target,
    };
    return { success: true };
  }

  /**
   * Lists directory contents.
   */
  public listDir(path: string, showHidden: boolean = false, cwd: string = '/home/student'): VfsNode[] | null {
    const node = this.getNode(path, cwd);
    if (!node || node.type !== 'directory' || !node.children) {
      return null;
    }

    const results: VfsNode[] = [];
    if (showHidden) {
      results.push({
        name: '.',
        type: 'directory',
        mode: node.mode,
        owner: node.owner,
        group: node.group,
        size: 4096,
        mtime: node.mtime,
      });
      results.push({
        name: '..',
        type: 'directory',
        mode: 0o755,
        owner: 'root',
        group: 'root',
        size: 4096,
        mtime: node.mtime,
      });
    }

    const keys = Object.keys(node.children).sort();
    for (const k of keys) {
      if (!showHidden && k.startsWith('.')) continue;
      results.push(node.children[k]);
    }

    return results;
  }

  /**
   * Searches for files recursively.
   */
  public find(
    startPath: string = '.',
    criteria: { namePattern?: string; type?: 'f' | 'd'; perm?: number },
    cwd: string = '/home/student'
  ): string[] {
    const startNode = this.getNode(startPath, cwd);
    if (!startNode) return [];

    const normStart = this.normalizePath(startPath, cwd);
    const results: string[] = [];

    const matches = (node: VfsNode, name: string): boolean => {
      if (criteria.type === 'f' && node.type !== 'file') return false;
      if (criteria.type === 'd' && node.type !== 'directory') return false;
      if (criteria.perm !== undefined && (node.mode & 0o777) !== criteria.perm) return false;
      if (criteria.namePattern) {
        const regexStr = criteria.namePattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/\?/g, '.');
        const re = new RegExp(`^${regexStr}$`);
        if (!re.test(name)) return false;
      }
      return true;
    };

    const traverse = (curr: VfsNode, currPath: string) => {
      if (matches(curr, curr.name || '/')) {
        results.push(currPath);
      }
      if (curr.type === 'directory' && curr.children) {
        for (const childName of Object.keys(curr.children).sort()) {
          const child = curr.children[childName];
          const childPath = currPath === '/' ? `/${childName}` : `${currPath}/${childName}`;
          traverse(child, childPath);
        }
      }
    };

    traverse(startNode, normStart);
    return results;
  }
}
