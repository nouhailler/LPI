import { TroubleshootingChallenge } from '../types';
import { lpic2Troubleshoot201_1 } from './lpic2Troubleshoot201_1';
import { lpic2Troubleshoot201_2 } from './lpic2Troubleshoot201_2';
import { lpic2Troubleshoot202_1 } from './lpic2Troubleshoot202_1';
import { lpic2Troubleshoot202_2 } from './lpic2Troubleshoot202_2';

/**
 * 50 DÉFIS DE DÉPANNAGE EXCLUSIFS POUR LPIC-2 : EXAMEN 201
 * Couvre Topics 200 à 206 :
 * - Topic 200 : Planification de la capacité (iostat, vmstat, sar, collectd, ulimit)
 * - Topic 201 : Noyau Linux (Compilation, modules, modprobe, dkms, sysctl)
 * - Topic 202 : Démarrage du système (GRUB2, systemd rescue/emergency, journalctl)
 * - Topic 203 : Systèmes de fichiers et périphériques (RAID mdadm, LVM2, tune2fs, cryptsetup)
 * - Topic 204 : Gestion avancée des périphériques de stockage (iSCSI, multipath, smartctl)
 * - Topic 205 : Configuration réseau (iproute2, VLAN 802.1Q, agrégation bonding/team, MTU)
 * - Topic 206 : Maintenance système (sauvegardes tar/rsync/borg, rsyslog/logrotate)
 */
export const lpic2Exam201Troubleshooting: TroubleshootingChallenge[] = [
  ...lpic2Troubleshoot201_1,
  ...lpic2Troubleshoot201_2,
];

/**
 * 50 DÉFIS DE DÉPANNAGE EXCLUSIFS POUR LPIC-2 : EXAMEN 202
 * Couvre Topics 207 à 212 :
 * - Topic 207 : Serveur de noms de domaine (BIND 9 named.conf, SOA, CNAME, TSIG, open resolver, chroot)
 * - Topic 208 : Services Web (Apache, Nginx reverse proxy, PHP-FPM, SSL/TLS fullchain, mod_rewrite, Squid)
 * - Topic 209 : Partage de fichiers (Samba smbpasswd, permissions POSIX, NFSv3/v4 exports, root squash, idmapd)
 * - Topic 210 : Gestion des clients réseau (ISC DHCP authoritative, réservations, PAM faillock, LDAP/SSSD)
 * - Topic 211 : Services de messagerie (Postfix open relay, newaliases, Dovecot mail_location, SSL, SpamAssassin)
 * - Topic 212 : Sécurité système (OpenSSH StrictModes, Fail2ban systemd, iptables/nftables, OpenVPN, TCP Wrappers, knockd)
 */
export const lpic2Exam202Troubleshooting: TroubleshootingChallenge[] = [
  ...lpic2Troubleshoot202_1,
  ...lpic2Troubleshoot202_2,
];

/**
 * 100 DÉFIS DE DÉPANNAGE EXCLUSIFS POUR LA CERTIFICATION LPIC-2 UNIQUEMENT
 *
 * Répartition détaillée par examen LPIC-2 :
 * - Examen 201 : Administration Système Avancée & Stockage / Réseau (Topics 200-206) : 50 défis
 * - Examen 202 : Services Réseau, Messagerie, Partage & Sécurité (Topics 207-212) : 50 défis
 *
 * Total : 100 défis de dépannage de niveau Ingénieur / Administrateur Senior réservés strictement à LPIC-2.
 */
export const lpic2TroubleshootingChallenges: TroubleshootingChallenge[] = [
  ...lpic2Exam201Troubleshooting,
  ...lpic2Exam202Troubleshooting,
];

export {
  lpic2Troubleshoot201_1,
  lpic2Troubleshoot201_2,
  lpic2Troubleshoot202_1,
  lpic2Troubleshoot202_2,
};
