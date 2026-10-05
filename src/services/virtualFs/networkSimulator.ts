/**
 * Virtual Network Simulator for LPI Linux Engine:
 * Simulates a virtual multi-host lab network:
 *
 *              Internet (8.8.8.8, 1.1.1.1)
 *                  │
 *           ┌──────┴──────┐
 *           │   router    │ (192.168.1.1, NAT Gateway)
 *           └──────┬──────┘
 *                  │
 *        ┌─────────┴─────────┐
 *        │                   │
 *    web01                 db01
 * 192.168.1.10         192.168.1.20
 *        │                   │
 *      nginx            postgresql (:5432)
 *                       mariadb (:3306)
 *                       sshd (:22)
 */

import { CommandExecutionResult } from './types';

export interface NetworkInterface {
  index: number;
  name: string;
  flags: string[];
  mtu: number;
  qdisc: string;
  state: 'UP' | 'DOWN' | 'UNKNOWN';
  mac: string;
  ipv4?: { ip: string; cidr: number; brd: string };
  ipv6?: { ip: string; cidr: number };
}

export interface VirtualPort {
  port: number;
  protocol: 'tcp' | 'udp';
  service: string; // 'http', 'postgresql', 'mysql', 'ssh', 'dns'
  state: 'open' | 'closed' | 'filtered';
  banner?: string;
  response?: string;
}

export interface VirtualNetworkNode {
  id: string; // 'web01', 'db01', 'router', 'internet'
  hostname: string; // 'web01', 'db01', 'router', 'dns.google'
  ip: string; // '192.168.1.10', '192.168.1.20', '192.168.1.1', '8.8.8.8'
  mac: string;
  gateway?: string;
  subnet?: string; // '192.168.1.0/24'
  isUp: boolean;
  roleFr: string;
  descriptionFr: string;
  ports: VirtualPort[];
}

export interface NetworkDiagnosticProgress {
  ipChecked: boolean;
  routeChecked: boolean;
  dnsChecked: boolean;
  portClosedObserved: boolean;
  serviceInspected: boolean;
  serviceStarted: boolean;
  probeVerified: boolean;
}

export class NetworkSimulator {
  public diagnosticProgress: NetworkDiagnosticProgress = {
    ipChecked: false,
    routeChecked: false,
    dnsChecked: false,
    portClosedObserved: false,
    serviceInspected: false,
    serviceStarted: false,
    probeVerified: false,
  };

  public routes: string[] = [
    'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.10 metric 100',
    '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100',
  ];

  public interfaces: NetworkInterface[] = [
    {
      index: 1,
      name: 'lo',
      flags: ['LOOPBACK', 'UP', 'LOWER_UP'],
      mtu: 65536,
      qdisc: 'noqueue',
      state: 'UNKNOWN',
      mac: '00:00:00:00:00:00',
      ipv4: { ip: '127.0.0.1', cidr: 8, brd: '127.255.255.255' },
      ipv6: { ip: '::1', cidr: 128 },
    },
    {
      index: 2,
      name: 'eth0',
      flags: ['BROADCAST', 'MULTICAST', 'UP', 'LOWER_UP'],
      mtu: 1500,
      qdisc: 'fq_codel',
      state: 'UP',
      mac: '52:54:00:12:34:56',
      ipv4: { ip: '192.168.1.10', cidr: 24, brd: '192.168.1.255' },
      ipv6: { ip: 'fe80::5054:ff:fe12:3456', cidr: 64 },
    },
  ];

  public nodes: Record<string, VirtualNetworkNode> = {
    router: {
      id: 'router',
      hostname: 'router',
      ip: '192.168.1.1',
      mac: '52:54:00:12:00:01',
      isUp: true,
      roleFr: 'Passerelle & Routeur NAT',
      descriptionFr: 'Routeur local 192.168.1.1 reliant le LAN à Internet',
      ports: [
        { port: 53, protocol: 'udp', service: 'dns', state: 'open' },
        { port: 80, protocol: 'tcp', service: 'http-admin', state: 'closed' },
      ],
    },
    web01: {
      id: 'web01',
      hostname: 'web01',
      ip: '192.168.1.10',
      mac: '52:54:00:12:34:56',
      isUp: true,
      roleFr: 'Serveur Web (Hôte Local)',
      descriptionFr: 'Machine de travail locale exécutant Nginx',
      ports: [
        { port: 80, protocol: 'tcp', service: 'http', state: 'open' },
        { port: 22, protocol: 'tcp', service: 'ssh', state: 'open' },
      ],
    },
    db01: {
      id: 'db01',
      hostname: 'db01',
      ip: '192.168.1.20',
      mac: '52:54:00:12:20:01',
      isUp: true,
      roleFr: 'Serveur Base de Données',
      descriptionFr: 'Serveur distant de données (PostgreSQL 5432, SSH 22)',
      ports: [
        {
          port: 5432,
          protocol: 'tcp',
          service: 'postgresql',
          state: 'closed', // Starts closed for the pedagogical investigation!
          banner: 'PostgreSQL 15.4 (Debian 15.4-1.pgdg120+1)',
          response: 'PostgreSQL binary protocol handshake (SSL/TLS supported)',
        },
        {
          port: 22,
          protocol: 'tcp',
          service: 'ssh',
          state: 'open',
          banner: 'SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2',
        },
        {
          port: 3306,
          protocol: 'tcp',
          service: 'mysql',
          state: 'closed',
          banner: 'MariaDB 10.11',
        },
      ],
    },
    internet: {
      id: 'internet',
      hostname: 'dns.google',
      ip: '8.8.8.8',
      mac: '52:54:00:ff:ff:01',
      isUp: true,
      roleFr: 'Serveur DNS Public Internet',
      descriptionFr: 'DNS Anycast Google 8.8.8.8 / 1.1.1.1',
      ports: [
        { port: 53, protocol: 'udp', service: 'dns', state: 'open' },
        { port: 80, protocol: 'tcp', service: 'http', state: 'open' },
        { port: 443, protocol: 'tcp', service: 'https', state: 'open' },
      ],
    },
  };

  /**
   * Set port state on a specific node (e.g. open postgresql on db01)
   */
  public setPortState(nodeId: string, port: number, state: 'open' | 'closed' | 'filtered') {
    const node = this.nodes[nodeId];
    if (node) {
      const p = node.ports.find((item) => item.port === port);
      if (p) {
        p.state = state;
      }
    }
  }

  /**
   * Resolve a host name or IP address within the virtual network topology
   */
  public resolveHost(target: string): { ip: string; hostname: string; node?: VirtualNetworkNode } | null {
    const clean = target.trim().toLowerCase().replace(/^http:\/\//, '').replace(/^https:\/\//, '').split(':')[0];

    // Localhost aliases
    if (clean === 'localhost' || clean === '127.0.0.1' || clean === '127.0.1.1') {
      return { ip: '127.0.0.1', hostname: 'localhost' };
    }

    // Direct node match by ID or hostname
    for (const node of Object.values(this.nodes)) {
      if (node.id === clean || node.hostname === clean || node.ip === clean) {
        return { ip: node.ip, hostname: node.hostname, node };
      }
    }

    // Common aliases
    if (clean === 'gateway' || clean === 'box' || clean === 'router.local') {
      return { ip: this.nodes.router.ip, hostname: this.nodes.router.hostname, node: this.nodes.router };
    }
    if (clean === 'web-prod-01' || clean === 'web' || clean === 'web01.local') {
      return { ip: this.nodes.web01.ip, hostname: this.nodes.web01.hostname, node: this.nodes.web01 };
    }
    if (clean === 'db' || clean === 'db-primary-01' || clean === 'db01.local' || clean === 'postgres') {
      return { ip: this.nodes.db01.ip, hostname: this.nodes.db01.hostname, node: this.nodes.db01 };
    }
    if (clean === '1.1.1.1' || clean === 'cloudflare.com' || clean === 'google.com' || clean === 'lpi.org') {
      return { ip: '8.8.8.8', hostname: 'dns.google', node: this.nodes.internet };
    }

    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(clean)) {
      return { ip: clean, hostname: clean };
    }

    return null;
  }

  /**
   * Executes ip command
   */
  public executeIp(args: string[]): CommandExecutionResult {
    if (args.length === 0) {
      return {
        output: 'Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }\nwhere  OBJECT := { address | link | route | neigh }',
        exitCode: 0,
      };
    }

    const obj = args[0];
    const subArgs = args.slice(1);

    if (obj === 'a' || obj === 'addr' || obj === 'address') {
      this.diagnosticProgress.ipChecked = true;
      return this.renderIpAddr(subArgs);
    }
    if (obj === 'r' || obj === 'route') {
      this.diagnosticProgress.routeChecked = true;
      return this.renderIpRoute(subArgs);
    }
    if (obj === 'l' || obj === 'link') {
      return this.renderIpLink(subArgs);
    }
    if (obj === 'n' || obj === 'neigh' || obj === 'neighbor') {
      return {
        output:
          '192.168.1.1 dev eth0 lladdr 52:54:00:12:00:01 REACHABLE\n192.168.1.20 dev eth0 lladdr 52:54:00:12:20:01 REACHABLE',
        exitCode: 0,
      };
    }

    return {
      output: `Object "${obj}" is unknown, try "ip help".`,
      exitCode: 1,
    };
  }

  private renderIpAddr(args: string[]): CommandExecutionResult {
    let targetIface: string | null = null;
    for (let i = 0; i < args.length; i++) {
      if ((args[i] === 'show' || args[i] === 'dev') && i + 1 < args.length) {
        targetIface = args[i + 1];
        break;
      } else if (!args[i].startsWith('-') && args[i] !== 'show') {
        targetIface = args[i];
      }
    }

    const ifaces = targetIface
      ? this.interfaces.filter((it) => it.name === targetIface)
      : this.interfaces;

    if (ifaces.length === 0) {
      return { output: `Device "${targetIface}" does not exist.`, exitCode: 1 };
    }

    const lines: string[] = [];
    for (const iface of ifaces) {
      lines.push(
        `${iface.index}: ${iface.name}: <${iface.flags.join(',')}> mtu ${iface.mtu} qdisc ${iface.qdisc} state ${iface.state} group default qlen 1000`
      );
      lines.push(
        `    link/${iface.name === 'lo' ? 'loopback' : 'ether'} ${iface.mac} brd ${iface.name === 'lo' ? '00:00:00:00:00:00' : 'ff:ff:ff:ff:ff:ff'}`
      );
      if (iface.ipv4) {
        const scope = iface.name === 'lo' ? 'host lo' : `global dynamic ${iface.name}`;
        lines.push(`    inet ${iface.ipv4.ip}/${iface.ipv4.cidr} brd ${iface.ipv4.brd} scope ${scope}`);
        lines.push(`       valid_lft 86120sec preferred_lft 86120sec`);
      }
      if (iface.ipv6) {
        const scope = iface.name === 'lo' ? 'host' : 'link';
        lines.push(`    inet6 ${iface.ipv6.ip}/${iface.ipv6.cidr} scope ${scope}`);
        lines.push(`       valid_lft forever preferred_lft forever`);
      }
    }

    return { output: lines.join('\n'), exitCode: 0 };
  }

  private renderIpRoute(args: string[]): CommandExecutionResult {
    if (args.length === 0 || args[0] === 'show' || args[0] === 'list') {
      if (this.routes.length === 0) {
        return { output: '', exitCode: 0 };
      }
      return { output: this.routes.join('\n'), exitCode: 0 };
    }

    const action = args[0];
    if (action === 'add') {
      const routeStr = args.slice(1).join(' ');
      if (routeStr.includes('default')) {
        this.routes = this.routes.filter((r) => !r.startsWith('default'));
        this.routes.unshift(`default ${routeStr.replace('default', '').trim()}`);
      } else {
        this.routes.push(routeStr);
      }
      return { output: '', exitCode: 0 };
    }

    if (action === 'del' || action === 'delete') {
      const target = args[1] || '';
      this.routes = this.routes.filter((r) => !r.includes(target));
      return { output: '', exitCode: 0 };
    }

    return { output: this.routes.join('\n'), exitCode: 0 };
  }

  private renderIpLink(args: string[]): CommandExecutionResult {
    const lines: string[] = [];
    for (const iface of this.interfaces) {
      lines.push(
        `${iface.index}: ${iface.name}: <${iface.flags.join(',')}> mtu ${iface.mtu} qdisc ${iface.qdisc} mode DEFAULT group default qlen 1000`
      );
      lines.push(
        `    link/${iface.name === 'lo' ? 'loopback' : 'ether'} ${iface.mac} brd ${iface.name === 'lo' ? '00:00:00:00:00:00' : 'ff:ff:ff:ff:ff:ff'}`
      );
    }
    return { output: lines.join('\n'), exitCode: 0 };
  }

  /**
   * Executes ping command with DNS resolution and route validation
   */
  public executePing(args: string[]): CommandExecutionResult {
    let count = 4;
    let target = '';

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-c' && i + 1 < args.length) {
        count = Math.min(Math.max(parseInt(args[i + 1], 10) || 4, 1), 10);
        i++;
      } else if (a.startsWith('-c')) {
        count = Math.min(Math.max(parseInt(a.slice(2), 10) || 4, 1), 10);
      } else if (!a.startsWith('-')) {
        target = a;
      }
    }

    if (!target) {
      return { output: 'ping: usage error: Destination address required', exitCode: 1 };
    }

    const resolved = this.resolveHost(target);
    if (!resolved) {
      return {
        output: `ping: ${target}: Name or service not known`,
        exitCode: 2,
      };
    }

    if (target.includes('db01') || resolved.hostname === 'db01' || resolved.ip === '192.168.1.20') {
      this.diagnosticProgress.dnsChecked = true;
    }

    const isLocalSubnet = resolved.ip === '127.0.0.1' || resolved.ip.startsWith('192.168.1.');
    const hasDefaultRoute = this.routes.some((r) => r.startsWith('default'));

    if (!isLocalSubnet && !hasDefaultRoute) {
      return {
        output: 'ping: connect: Network is unreachable',
        exitCode: 2,
      };
    }

    // Check if destination node is up
    if (resolved.node && !resolved.node.isUp) {
      const lines = [
        `PING ${target} (${resolved.ip}) 56(84) bytes of data.`,
        `From 192.168.1.10 icmp_seq=1 Destination Host Unreachable`,
        `From 192.168.1.10 icmp_seq=2 Destination Host Unreachable`,
        '',
        `--- ${target} ping statistics ---`,
        `${count} packets transmitted, 0 received, +2 errors, 100% packet loss`,
      ];
      return { output: lines.join('\n'), exitCode: 1 };
    }

    const latency = isLocalSubnet ? '0.354' : '11.842';
    const lines = [
      `PING ${target} (${resolved.ip}) 56(84) bytes of data.`,
    ];
    for (let seq = 1; seq <= count; seq++) {
      const jitter = (parseFloat(latency) + (seq * 0.03)).toFixed(3);
      lines.push(`64 bytes from ${resolved.ip}: icmp_seq=${seq} ttl=64 time=${jitter} ms`);
    }
    lines.push('');
    lines.push(`--- ${target} ping statistics ---`);
    lines.push(`${count} packets transmitted, ${count} received, 0% packet loss, time ${count * 1000}ms`);
    lines.push(`rtt min/avg/max/mdev = ${latency}/${latency}/${latency}/0.030 ms`);

    return { output: lines.join('\n'), exitCode: 0 };
  }

  /**
   * Executes traceroute / tracepath command showing hops across topology
   */
  public executeTraceroute(args: string[]): CommandExecutionResult {
    const target = args.find((a) => !a.startsWith('-')) || '';
    if (!target) {
      return { output: 'Usage: traceroute [ -46dFInrv ] [ -f first_ttl ] host [ packetlen ]', exitCode: 1 };
    }

    const resolved = this.resolveHost(target);
    if (!resolved) {
      return { output: `traceroute: unknown host ${target}`, exitCode: 1 };
    }

    const isLocalSubnet = resolved.ip.startsWith('192.168.1.');
    const hasDefaultRoute = this.routes.some((r) => r.startsWith('default'));

    if (!isLocalSubnet && !hasDefaultRoute) {
      return { output: 'traceroute: connect: Network is unreachable', exitCode: 2 };
    }

    const lines = [`traceroute to ${target} (${resolved.ip}), 30 hops max, 60 byte packets`];

    if (resolved.ip === '192.168.1.10') {
      lines.push(' 1  localhost (127.0.0.1)  0.042 ms  0.031 ms  0.028 ms');
      return { output: lines.join('\n'), exitCode: 0 };
    }

    if (isLocalSubnet) {
      lines.push(` 1  ${resolved.hostname} (${resolved.ip})  0.312 ms  0.285 ms  0.279 ms`);
      return { output: lines.join('\n'), exitCode: 0 };
    }

    // External target routed through router (192.168.1.1)
    lines.push(' 1  router (192.168.1.1)  0.421 ms  0.395 ms  0.380 ms');
    lines.push(' 2  isp-core-gw (203.0.113.1)  4.120 ms  4.050 ms  3.980 ms');
    lines.push(` 3  ${resolved.hostname} (${resolved.ip})  11.842 ms  11.620 ms  11.580 ms`);

    return { output: lines.join('\n'), exitCode: 0 };
  }

  /**
   * Executes nc (netcat) command for port scanning & verification:
   * nc -zv db01 5432
   */
  public executeNc(args: string[]): CommandExecutionResult {
    let target = '';
    let port = 0;

    for (const a of args) {
      if (a.startsWith('-')) continue;
      if (!target) {
        target = a;
      } else if (!port) {
        port = parseInt(a, 10) || 0;
      }
    }

    if (!target || !port) {
      return {
        output: 'nc: missing host or port argument (syntax: nc -zv <host> <port>)',
        exitCode: 1,
      };
    }

    const resolved = this.resolveHost(target);
    if (!resolved) {
      return { output: `nc: getaddrinfo for host "${target}" port ${port}: Name or service not known`, exitCode: 1 };
    }

    const isLocalSubnet = resolved.ip === '127.0.0.1' || resolved.ip.startsWith('192.168.1.');
    const hasDefaultRoute = this.routes.some((r) => r.startsWith('default'));

    if (!isLocalSubnet && !hasDefaultRoute) {
      return { output: `nc: connect to ${resolved.hostname} (${resolved.ip}) port ${port}: Network is unreachable`, exitCode: 1 };
    }

    const node = resolved.node;
    if (!node || !node.isUp) {
      return { output: `nc: connect to ${resolved.hostname} (${resolved.ip}) port ${port} (tcp) failed: Host is down`, exitCode: 1 };
    }

    const p = node.ports.find((item) => item.port === port);
    if (p && p.state === 'open') {
      if ((resolved.node?.id === 'db01' || resolved.hostname === 'db01') && port === 5432) {
        this.diagnosticProgress.probeVerified = true;
      }
      return {
        output: `Connection to ${resolved.hostname} (${resolved.ip}) ${port} port [tcp/${p.service}] succeeded!`,
        exitCode: 0,
      };
    } else {
      if ((resolved.node?.id === 'db01' || resolved.hostname === 'db01') && port === 5432) {
        this.diagnosticProgress.portClosedObserved = true;
      }
      return {
        output: `nc: connect to ${resolved.hostname} (${resolved.ip}) port ${port} (tcp) failed: Connection refused`,
        exitCode: 1,
      };
    }
  }

  /**
   * Executes curl to virtual hosts and ports:
   * curl db01:5432 or curl http://db01:5432
   */
  public executeVirtualCurl(args: string[]): CommandExecutionResult {
    const rawUrl = args.find((a) => !a.startsWith('-')) || '';
    if (!rawUrl) {
      return { output: "curl: try 'curl --help' for more information", exitCode: 2 };
    }

    const clean = rawUrl.replace(/^http:\/\//, '').replace(/^https:\/\//, '');
    const parts = clean.split('/');
    const hostAndPort = parts[0];
    const hostParts = hostAndPort.split(':');
    const targetHost = hostParts[0];
    const targetPort = hostParts[1] ? parseInt(hostParts[1], 10) : 80;

    const resolved = this.resolveHost(targetHost);
    if (!resolved) {
      return { output: `curl: (6) Could not resolve host: ${targetHost}`, exitCode: 6 };
    }

    const isLocalSubnet = resolved.ip === '127.0.0.1' || resolved.ip.startsWith('192.168.1.');
    const hasDefaultRoute = this.routes.some((r) => r.startsWith('default'));

    if (!isLocalSubnet && !hasDefaultRoute) {
      return { output: `curl: (7) Failed to connect to ${targetHost} port ${targetPort}: Network is unreachable`, exitCode: 7 };
    }

    const node = resolved.node;
    if (!node || !node.isUp) {
      return { output: `curl: (7) Failed to connect to ${targetHost} port ${targetPort}: Host is down`, exitCode: 7 };
    }

    const p = node.ports.find((item) => item.port === targetPort);
    if (!p || p.state === 'closed') {
      if ((resolved.node?.id === 'db01' || resolved.hostname === 'db01') && targetPort === 5432) {
        this.diagnosticProgress.portClosedObserved = true;
      }
      return {
        output: `curl: (7) Failed to connect to ${targetHost} port ${targetPort}: Connection refused`,
        exitCode: 7,
      };
    }

    if (p.state === 'filtered') {
      return {
        output: `curl: (28) Connection timed out after 5001 milliseconds`,
        exitCode: 28,
      };
    }

    // Port is open!
    if (targetPort === 5432) {
      if (resolved.node?.id === 'db01' || resolved.hostname === 'db01') {
        this.diagnosticProgress.probeVerified = true;
      }
      return {
        output: `PostgreSQL Database Server connection established on ${resolved.hostname}:5432.\nProtocol: PostgreSQL 15.4 (SSL disabled)\nNotice: Binary wire protocol active. Use psql or application driver.`,
        exitCode: 0,
      };
    }

    if (targetPort === 3306) {
      return {
        output: `MariaDB Server connection established on ${resolved.hostname}:3306.\nHandshake: 10.11.3-MariaDB`,
        exitCode: 0,
      };
    }

    if (targetPort === 22) {
      return {
        output: `SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2\nInvalid HTTP request to SSH listener port.`,
        exitCode: 0,
      };
    }

    return {
      output: `HTTP/1.1 200 OK\nServer: ${p.service}\nContent-Type: text/html\n\n<!DOCTYPE html><html><body><h1>Service ${resolved.hostname}:${targetPort} Online</h1></body></html>`,
      exitCode: 0,
    };
  }

  /**
   * Executes DNS utilities: host, nslookup, dig, getent hosts
   */
  public executeDns(tool: 'host' | 'nslookup' | 'dig' | 'getent', args: string[]): CommandExecutionResult {
    let target = '';
    if (tool === 'getent') {
      // syntax: getent hosts <name>
      target = args[1] || '';
    } else {
      target = args.find((a) => !a.startsWith('-')) || '';
    }

    if (!target) {
      return { output: `${tool}: missing query name argument`, exitCode: 1 };
    }

    const resolved = this.resolveHost(target);
    if (!resolved) {
      if (tool === 'host') return { output: `Host ${target} not found: 3(NXDOMAIN)`, exitCode: 1 };
      if (tool === 'nslookup') return { output: `** server can't find ${target}: NXDOMAIN`, exitCode: 1 };
      return { output: `; <<>> DiG 9.18.19 <<>> ${target}\n;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN`, exitCode: 1 };
    }

    if (tool === 'getent') {
      return { output: `${resolved.ip.padEnd(16)} ${resolved.hostname}`, exitCode: 0 };
    }

    if (tool === 'host') {
      return { output: `${target} has address ${resolved.ip}`, exitCode: 0 };
    }

    if (tool === 'nslookup') {
      return {
        output: `Server:         192.168.1.1\nAddress:        192.168.1.1#53\n\nName:   ${resolved.hostname}\nAddress: ${resolved.ip}`,
        exitCode: 0,
      };
    }

    return {
      output: `; <<>> DiG 9.18.19 <<>> ${target}\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41829\n;; ANSWER SECTION:\n${target.padEnd(16)} 300 IN  A  ${resolved.ip}\n\n;; Query time: 1 msec\n;; SERVER: 192.168.1.1#53(192.168.1.1) (UDP)`,
      exitCode: 0,
    };
  }

  /**
   * Remote SSH command simulation:
   * ssh db01 "systemctl status postgresql"
   * ssh db01 "systemctl start postgresql"
   */
  public executeRemoteSsh(args: string[]): CommandExecutionResult {
    let target = '';
    let remoteCmd = '';

    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a.startsWith('-')) continue;
      if (!target) {
        target = a;
      } else {
        remoteCmd = args.slice(i).join(' ').replace(/^['"]/, '').replace(/['"]$/, '');
        break;
      }
    }

    if (!target) {
      return { output: 'usage: ssh [options] [user@]hostname [command]', exitCode: 1 };
    }

    const cleanHost = target.includes('@') ? target.split('@')[1] : target;
    const resolved = this.resolveHost(cleanHost);

    if (!resolved) {
      return { output: `ssh: Could not resolve hostname ${cleanHost}: Name or service not known`, exitCode: 255 };
    }

    const node = resolved.node;
    if (!node || !node.isUp) {
      return { output: `ssh: connect to host ${cleanHost} port 22: Host is down`, exitCode: 255 };
    }

    const sshPort = node.ports.find((p) => p.port === 22);
    if (!sshPort || sshPort.state !== 'open') {
      return { output: `ssh: connect to host ${cleanHost} port 22: Connection refused`, exitCode: 255 };
    }

    // If no command, return connected prompt notice
    if (!remoteCmd) {
      return {
        output: `Connected to ${resolved.hostname} (${resolved.ip}).\nLinux ${resolved.hostname} 6.1.0-21-amd64 #1 SMP Debian\nLast login: Mon Sep 20 10:00:12 2026 from 192.168.1.10\n(Tip: pass a remote command like: ssh ${cleanHost} "systemctl status postgresql")`,
        exitCode: 0,
      };
    }

    // Execute remote simulated commands on db01
    if (resolved.node?.id === 'db01' || resolved.hostname === 'db01') {
      if (remoteCmd.includes('systemctl status postgresql') || remoteCmd.includes('service postgresql status')) {
        this.diagnosticProgress.serviceInspected = true;
        const pgPort = node.ports.find((p) => p.port === 5432);
        const isActive = pgPort?.state === 'open';
        return {
          output: `● postgresql.service - PostgreSQL RDBMS\n     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)\n     Active: ${
            isActive ? 'active (running)' : 'inactive (dead)'
          } since Mon 2026-09-20 10:00:00 UTC\n    Process: 912 ExecStart=/etc/init.d/postgresql start (${
            isActive ? 'code=exited, status=0/SUCCESS' : 'code=exited, status=0/SUCCESS'
          })\n   Main PID: ${isActive ? '918 (postgres)' : 'none'}\n      Tasks: ${
            isActive ? '7' : '0'
          }\n     Memory: ${isActive ? '28.4M' : '0B'}\n     CGroup: /system.slice/postgresql.service`,
          exitCode: isActive ? 0 : 3,
        };
      }

      if (remoteCmd.includes('systemctl start postgresql') || remoteCmd.includes('systemctl restart postgresql')) {
        this.setPortState('db01', 5432, 'open');
        this.diagnosticProgress.serviceStarted = true;
        return {
          output: `root@db01:~# ${remoteCmd}\nStarted PostgreSQL RDBMS Database Server (listening on 0.0.0.0:5432).`,
          exitCode: 0,
        };
      }

      if (remoteCmd.includes('systemctl stop postgresql')) {
        this.setPortState('db01', 5432, 'closed');
        return {
          output: `root@db01:~# systemctl stop postgresql\nStopped PostgreSQL RDBMS Database Server.`,
          exitCode: 0,
        };
      }

      if (remoteCmd.includes('ss') || remoteCmd.includes('netstat')) {
        const pgPort = node.ports.find((p) => p.port === 5432);
        const isOpen = pgPort?.state === 'open';
        const lines = [
          'Netid  State   Recv-Q  Send-Q     Local Address:Port      Peer Address:Port  Process',
          'tcp    LISTEN  0       128              0.0.0.0:22             0.0.0.0:*      users:(("sshd",pid=780,fd=3))',
        ];
        if (isOpen) {
          lines.push('tcp    LISTEN  0       244              0.0.0.0:5432           0.0.0.0:*      users:(("postgres",pid=918,fd=5))');
        }
        return { output: lines.join('\n'), exitCode: 0 };
      }

      if (remoteCmd === 'hostname') {
        return { output: 'db01', exitCode: 0 };
      }
      if (remoteCmd === 'ip addr' || remoteCmd.startsWith('ip a')) {
        return {
          output:
            '1: lo: <LOOPBACK,UP> mtu 65536 state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,UP> mtu 1500 state UP\n    inet 192.168.1.20/24 brd 192.168.1.255 scope global eth0',
          exitCode: 0,
        };
      }
    }

    return { output: `[${cleanHost}] Command executed: ${remoteCmd}`, exitCode: 0 };
  }

  public executeTelnet(args: string[]): CommandExecutionResult {
    const target = args[0] || '';
    const port = parseInt(args[1] || '23', 10);
    if (!target) {
      return { output: 'Usage: telnet <host> [port]', exitCode: 1 };
    }
    const resolved = this.resolveHost(target);
    if (!resolved) {
      return { output: `telnet: could not resolve ${target}: Name or service not known`, exitCode: 1 };
    }
    const node = resolved.node;
    if (!node || !node.isUp) {
      return { output: `telnet: Unable to connect to remote host: Host is down`, exitCode: 1 };
    }
    const p = node.ports.find((item) => item.port === port);
    if (p && p.state === 'open') {
      if ((resolved.node?.id === 'db01' || resolved.hostname === 'db01') && port === 5432) {
        this.diagnosticProgress.probeVerified = true;
      }
      return {
        output: `Trying ${resolved.ip}...\nConnected to ${resolved.hostname}.\nEscape character is '^]'.`,
        exitCode: 0,
      };
    } else {
      if ((resolved.node?.id === 'db01' || resolved.hostname === 'db01') && port === 5432) {
        this.diagnosticProgress.portClosedObserved = true;
      }
      return {
        output: `Trying ${resolved.ip}...\ntelnet: Unable to connect to remote host: Connection refused`,
        exitCode: 1,
      };
    }
  }

  public executePsql(args: string[]): CommandExecutionResult {
    let host = 'localhost';
    let port = 5432;
    for (let i = 0; i < args.length; i++) {
      if ((args[i] === '-h' || args[i] === '--host') && i + 1 < args.length) {
        host = args[i + 1];
        i++;
      } else if (args[i].startsWith('-h')) {
        host = args[i].slice(2);
      } else if ((args[i] === '-p' || args[i] === '--port') && i + 1 < args.length) {
        port = parseInt(args[i + 1], 10) || 5432;
        i++;
      }
    }
    const resolved = this.resolveHost(host);
    if (!resolved) {
      return {
        output: `psql: error: could not translate host name "${host}" to address: Name or service not known`,
        exitCode: 2,
      };
    }
    const node = resolved.node;
    const p = node?.ports.find((item) => item.port === port);
    if (!p || p.state !== 'open') {
      if (resolved.node?.id === 'db01' || resolved.hostname === 'db01') {
        this.diagnosticProgress.portClosedObserved = true;
      }
      return {
        output: `psql: error: connection to server at "${resolved.hostname}" (${resolved.ip}), port ${port} failed: Connection refused\n\tIs the server running on that host and accepting TCP/IP connections?`,
        exitCode: 2,
      };
    }
    if (resolved.node?.id === 'db01' || resolved.hostname === 'db01') {
      this.diagnosticProgress.probeVerified = true;
    }
    return {
      output: `psql (15.4 (Debian 15.4-1.pgdg120+1))\nType "help" for help.\n\n${resolved.hostname}=# `,
      exitCode: 0,
    };
  }

  public resetToDefaultState(): void {
    this.setPortState('db01', 5432, 'closed');
    this.setPortState('db01', 22, 'open');
    this.routes = [
      'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.10 metric 100',
      '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100',
    ];
    this.diagnosticProgress = {
      ipChecked: false,
      routeChecked: false,
      dnsChecked: false,
      portClosedObserved: false,
      serviceInspected: false,
      serviceStarted: false,
      probeVerified: false,
    };
  }
}
