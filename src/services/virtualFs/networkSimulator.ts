/**
 * Network simulation for LPI Virtual Terminal:
 * ip addr, ip route, ip link, ping
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

export class NetworkSimulator {
  private interfaces: NetworkInterface[] = [
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
      ipv4: { ip: '192.168.1.50', cidr: 24, brd: '192.168.1.255' },
      ipv6: { ip: 'fe80::5054:ff:fe12:3456', cidr: 64 },
    },
  ];

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
      return this.renderIpAddr(subArgs);
    }

    if (obj === 'r' || obj === 'route') {
      return this.renderIpRoute(subArgs);
    }

    if (obj === 'l' || obj === 'link') {
      return this.renderIpLink(subArgs);
    }

    if (obj === 'n' || obj === 'neigh' || obj === 'neighbor') {
      return {
        output: '192.168.1.1 dev eth0 lladdr 52:54:00:12:00:01 REACHABLE\n192.168.1.20 dev eth0 lladdr 52:54:00:12:00:20 STALE',
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
        lines.push(
          `    inet ${iface.ipv4.ip}/${iface.ipv4.cidr} brd ${iface.ipv4.brd} scope ${scope}`
        );
        lines.push(
          `       valid_lft 86120sec preferred_lft 86120sec`
        );
      }
      if (iface.ipv6) {
        const scope = iface.name === 'lo' ? 'host' : 'link';
        lines.push(
          `    inet6 ${iface.ipv6.ip}/${iface.ipv6.cidr} scope ${scope}`
        );
        lines.push(
          `       valid_lft forever preferred_lft forever`
        );
      }
    }

    return { output: lines.join('\n'), exitCode: 0 };
  }

  private renderIpRoute(_args: string[]): CommandExecutionResult {
    const lines = [
      'default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.50 metric 100',
      '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50 metric 100',
    ];
    return { output: lines.join('\n'), exitCode: 0 };
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

    // Resolve IP or known hosts
    const hostMap: Record<string, string> = {
      localhost: '127.0.0.1',
      '127.0.0.1': '127.0.0.1',
      'lpi-lab': '127.0.1.1',
      gateway: '192.168.1.1',
      '192.168.1.1': '192.168.1.1',
      '192.168.1.50': '192.168.1.50',
      '8.8.8.8': '8.8.8.8',
      '1.1.1.1': '1.1.1.1',
      'google.com': '142.250.190.46',
      'lpi.org': '198.51.100.42',
    };

    const resolvedIp = hostMap[target.toLowerCase()] || (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target) ? target : null);

    if (!resolvedIp) {
      return {
        output: `ping: ${target}: Name or service not known`,
        exitCode: 2,
      };
    }

    // Check if unreachable subnet
    const isUnreachable = resolvedIp.startsWith('10.255') || resolvedIp.startsWith('192.0.2');

    const lines: string[] = [
      `PING ${target} (${resolvedIp}) 56(84) bytes of data.`,
    ];

    if (isUnreachable) {
      for (let seq = 1; seq <= Math.min(count, 2); seq++) {
        lines.push(`From 192.168.1.1 icmp_seq=${seq} Destination Host Unreachable`);
      }
      lines.push('');
      lines.push(`--- ${target} ping statistics ---`);
      lines.push(`${count} packets transmitted, 0 received, +${Math.min(count, 2)} errors, 100% packet loss, time ${count * 1000}ms`);
      return { output: lines.join('\n'), exitCode: 1 };
    }

    const times: number[] = [];
    const baseRtt = resolvedIp === '127.0.0.1' || resolvedIp === '192.168.1.50' ? 0.04 : resolvedIp === '192.168.1.1' ? 0.8 : 14.2;

    for (let seq = 1; seq <= count; seq++) {
      const jitter = (Math.sin(seq) * 0.4) + (Math.random() * 0.2);
      const timeMs = Math.max(0.02, parseFloat((baseRtt + jitter).toFixed(3)));
      times.push(timeMs);
      const ttl = resolvedIp.startsWith('127.') ? 64 : resolvedIp.startsWith('192.168.1.') ? 64 : 117;
      lines.push(`64 bytes from ${resolvedIp}: icmp_seq=${seq} ttl=${ttl} time=${timeMs} ms`);
    }

    const min = Math.min(...times).toFixed(3);
    const max = Math.max(...times).toFixed(3);
    const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(3);
    const mdev = (Math.abs(parseFloat(max) - parseFloat(min)) / 2).toFixed(3);

    lines.push('');
    lines.push(`--- ${target} ping statistics ---`);
    lines.push(`${count} packets transmitted, ${count} received, 0% packet loss, time ${(count - 1) * 1000 + 4}ms`);
    lines.push(`rtt min/avg/max/mdev = ${min}/${avg}/${max}/${mdev} ms`);

    return { output: lines.join('\n'), exitCode: 0 };
  }
}
