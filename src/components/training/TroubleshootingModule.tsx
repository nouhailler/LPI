import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Code2,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  FileCode,
  Check,
  Filter,
  ShieldCheck,
  Layers,
  Server,
  Terminal,
  Cpu
} from 'lucide-react';
import { TroubleshootingChallenge } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: TroubleshootingChallenge[];
  onScoreUpdate?: (points: number) => void;
}

type Lpic3ExamFilter = 'all' | '300' | '303' | '305' | '306';
type Lpic2ExamFilter = 'all' | '201' | '202';
type Lpic1ExamFilter = 'all' | '101' | '102';

export const TroubleshootingModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [activeCert, setActiveCert] = useState<'lpic-3' | 'lpic-2' | 'lpic-1'>('lpic-2');
  const [lpic3Filter, setLpic3Filter] = useState<Lpic3ExamFilter>('all');
  const [lpic2Filter, setLpic2Filter] = useState<Lpic2ExamFilter>('all');
  const [lpic1Filter, setLpic1Filter] = useState<Lpic1ExamFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Filter challenges strictly by chosen certification and exam/topic filters
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Certification match
      if (c.certification !== activeCert) return false;

      if (activeCert === 'lpic-3') {
        // Exam 300 (Topics 301-306)
        if (lpic3Filter === '300' && (c.topicNumber < 301 || c.topicNumber > 306)) {
          return false;
        }
        // Exam 303 (Topics 325-328)
        if (lpic3Filter === '303' && (c.topicNumber < 325 || c.topicNumber > 328)) {
          return false;
        }
        // Exam 305 (Topics 351-353)
        if (lpic3Filter === '305' && (c.topicNumber < 351 || c.topicNumber > 353)) {
          return false;
        }
        // Exam 306 (Topics 361-364)
        if (lpic3Filter === '306' && (c.topicNumber < 361 || c.topicNumber > 364)) {
          return false;
        }
      } else if (activeCert === 'lpic-2') {
        // Exam 201 (Topics 200-206)
        if (lpic2Filter === '201' && (c.topicNumber < 200 || c.topicNumber > 206)) {
          return false;
        }
        // Exam 202 (Topics 207-212)
        if (lpic2Filter === '202' && (c.topicNumber < 207 || c.topicNumber > 212)) {
          return false;
        }
      } else {
        // Exam 101 (Topics 101-104)
        if (lpic1Filter === '101' && (c.topicNumber < 101 || c.topicNumber > 104)) {
          return false;
        }
        // Exam 102 (Topics 105-110)
        if (lpic1Filter === '102' && (c.topicNumber < 105 || c.topicNumber > 110)) {
          return false;
        }
      }

      // Filter by specific topic
      if (selectedTopic !== 'all' && c.topicNumber !== selectedTopic) {
        return false;
      }

      return true;
    });
  }, [challenges, activeCert, lpic3Filter, lpic2Filter, lpic1Filter, selectedTopic]);

  const current = filteredChallenges[currentIndex] || filteredChallenges[0];

  const handleCertChange = (cert: 'lpic-3' | 'lpic-2' | 'lpic-1') => {
    setActiveCert(cert);
    setSelectedTopic('all');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleLpic3FilterChange = (filter: Lpic3ExamFilter) => {
    setLpic3Filter(filter);
    setSelectedTopic('all');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleLpic2FilterChange = (filter: Lpic2ExamFilter) => {
    setLpic2Filter(filter);
    setSelectedTopic('all');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleLpic1FilterChange = (filter: Lpic1ExamFilter) => {
    setLpic1Filter(filter);
    setSelectedTopic('all');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleTopicChange = (topic: number | 'all') => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || !current) return;
    setHasSubmitted(true);

    const chosen = current.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      if (!completedIds.has(current.id)) {
        const nextSet = new Set(completedIds);
        nextSet.add(current.id);
        setCompletedIds(nextSet);
        if (onScoreUpdate) onScoreUpdate(15);
      }
    }
  };

  const handleNext = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredChallenges.length - 1);
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  // Topics definitions for LPIC-3
  const lpic3Topics = [
    { num: 301, label: '301 - Architecture Samba & Daemons (Examen 300)' },
    { num: 302, label: '302 - Partages & Sécurité Samba (Examen 300)' },
    { num: 303, label: '303 - Intégration Domaine & AD (Examen 300)' },
    { num: 304, label: '304 - Clients & Winbind (Examen 300)' },
    { num: 305, label: '305 - Annuaire OpenLDAP (Examen 300)' },
    { num: 306, label: '306 - Intégration PAM & NSS (Examen 300)' },
    { num: 325, label: '325 - Cryptographie & PKI X.509 (Examen 303)' },
    { num: 326, label: '326 - Sécurité Hôte & Audit Auditd (Examen 303)' },
    { num: 327, label: '327 - Contrôle d\'Accès SELinux/AppArmor (Examen 303)' },
    { num: 328, label: '328 - Sécurité Réseau & IDS Suricata (Examen 303)' },
    { num: 351, label: '351 - Virtualisation QEMU & KVM libvirt (Examen 305)' },
    { num: 352, label: '352 - Conteneurs LXC, Docker & Podman (Examen 305)' },
    { num: 353, label: '353 - Orchestration Kubernetes & CNI (Examen 305)' },
    { num: 361, label: '361 - Clusters HA Pacemaker & Corosync (Examen 306)' },
    { num: 362, label: '362 - Stockage HA DRBD 9 & GFS2/DLM (Examen 306)' },
    { num: 363, label: '363 - Stockage Distribué Ceph & GlusterFS (Examen 306)' },
    { num: 364, label: '364 - Répartition de Charge HAProxy & Keepalived (Examen 306)' },
  ];

  // Topics definitions for LPIC-2
  const lpic2Topics = [
    { num: 200, label: '200 - Planification de la Capacité (Examen 201)' },
    { num: 201, label: '201 - Noyau Linux & Modules Kernel (Examen 201)' },
    { num: 202, label: '202 - Démarrage Système & Systemd (Examen 201)' },
    { num: 203, label: '203 - Systèmes de Fichiers & RAID/LVM (Examen 201)' },
    { num: 204, label: '204 - Stockage Avancé iSCSI/Multipath (Examen 201)' },
    { num: 205, label: '205 - Configuration Réseau Avancée (Examen 201)' },
    { num: 206, label: '206 - Maintenance Système & Logs (Examen 201)' },
    { num: 207, label: '207 - Serveur de Noms DNS BIND 9 (Examen 202)' },
    { num: 208, label: '208 - Services Web Apache & Nginx (Examen 202)' },
    { num: 209, label: '209 - Partage Fichiers Samba & NFS (Examen 202)' },
    { num: 210, label: '210 - Clients Réseau DHCP, PAM & LDAP (Examen 202)' },
    { num: 211, label: '211 - Messagerie Postfix & Dovecot (Examen 202)' },
    { num: 212, label: '212 - Sécurité Système OpenSSH & Pare-feu (Examen 202)' },
  ];

  // Topics definitions for LPIC-1
  const lpic1Topics = [
    { num: 101, label: '101 - Architecture Système & Matériel' },
    { num: 102, label: '102 - Installation Linux & Gestion Paquets' },
    { num: 103, label: '103 - Commandes GNU & Unix' },
    { num: 104, label: '104 - Périphériques & Systèmes de Fichiers' },
    { num: 105, label: '105 - Shells, Scripting & Gestion Données' },
    { num: 106, label: '106 - Interfaces Utilisateur & X11' },
    { num: 107, label: '107 - Tâches d\'Administration & Cron' },
    { num: 108, label: '108 - Services Système Essentiels & Logs' },
    { num: 109, label: '109 - Fondamentaux du Réseau' },
    { num: 110, label: '110 - Sécurité de l\'Hôte' },
  ];

  const availableTopics = activeCert === 'lpic-3' ? lpic3Topics : activeCert === 'lpic-2' ? lpic2Topics : lpic1Topics;

  // Active pool count
  const certChallengesCount = challenges.filter((c) => c.certification === activeCert).length;
  const completedForActiveCert = challenges.filter(
    (c) => c.certification === activeCert && completedIds.has(c.id)
  ).length;

  if (!current) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#d3c5ab] text-[#817660] space-y-3">
        <p className="font-semibold">
          {isFr ? 'Aucun défi de dépannage trouvé pour ce filtre.' : 'No troubleshooting challenges found for this filter.'}
        </p>
        <button
          onClick={() => {
            if (activeCert === 'lpic-3') handleLpic3FilterChange('all');
            else if (activeCert === 'lpic-2') handleLpic2FilterChange('all');
            else handleLpic1FilterChange('all');
          }}
          className="px-4 py-2 bg-[#785a00] text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          {isFr ? 'Réinitialiser les filtres' : 'Reset filters'}
        </button>
      </div>
    );
  }

  const title = isFr && current.titleFr ? current.titleFr : current.title;
  const scenario = isFr && current.scenarioFr ? current.scenarioFr : current.scenario;
  const fixExplanation = isFr && current.fixExplanationFr ? current.fixExplanationFr : current.fixExplanation;
  const selectedOption = current.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <div className="space-y-6">
      {/* Certification Switcher Banner (LPIC-3 Uniquement vs LPIC-2 Uniquement vs LPIC-1 Uniquement) */}
      <div className="bg-white p-3 rounded-2xl border border-[#d3c5ab]/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* LPIC-3 Tab */}
          <button
            type="button"
            onClick={() => handleCertChange('lpic-3')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeCert === 'lpic-3'
                ? 'bg-gradient-to-r from-[#4a154b] to-[#6b1d6d] text-white shadow-sm ring-2 ring-[#4a154b]/30'
                : 'bg-[#fdfbf7] text-[#554b38] hover:bg-[#f5ebd7] border border-[#d3c5ab]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>{isFr ? 'Défis LPIC-3 Uniquement (100 défis)' : 'LPIC-3 Challenges Only (100 challenges)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeCert === 'lpic-3' ? 'bg-white/20 text-white' : 'bg-[#e0d6c3] text-[#4a154b]'
            }`}>
              100% LPIC-3
            </span>
          </button>

          {/* LPIC-2 Tab */}
          <button
            type="button"
            onClick={() => handleCertChange('lpic-2')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeCert === 'lpic-2'
                ? 'bg-gradient-to-r from-[#0d47a1] to-[#1565c0] text-white shadow-sm ring-2 ring-[#0d47a1]/30'
                : 'bg-[#fdfbf7] text-[#554b38] hover:bg-[#f5ebd7] border border-[#d3c5ab]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{isFr ? 'Défis LPIC-2 Uniquement (100 défis)' : 'LPIC-2 Challenges Only (100 challenges)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeCert === 'lpic-2' ? 'bg-white/20 text-white' : 'bg-[#dbeafe] text-[#0d47a1]'
            }`}>
              100% LPIC-2
            </span>
          </button>

          {/* LPIC-1 Tab */}
          <button
            type="button"
            onClick={() => handleCertChange('lpic-1')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
              activeCert === 'lpic-1'
                ? 'bg-[#785a00] text-white shadow-sm ring-2 ring-[#785a00]/30'
                : 'bg-[#fdfbf7] text-[#554b38] hover:bg-[#f5ebd7] border border-[#d3c5ab]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{isFr ? 'Défis LPIC-1 Uniquement (100 défis)' : 'LPIC-1 Challenges Only (100 challenges)'}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
              activeCert === 'lpic-1' ? 'bg-white/20 text-white' : 'bg-[#e0d6c3] text-[#785a00]'
            }`}>
              100% LPIC-1
            </span>
          </button>
        </div>

        {/* Global Progress Badge for Current Certification */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f8ecdb] text-[#785a00] rounded-xl border border-[#ebdcc8] text-xs font-semibold">
          <Award className="w-4 h-4 text-[#785a00]" />
          <span>
            {completedForActiveCert} / {certChallengesCount} {isFr ? 'défis résolus' : 'solved'}
          </span>
        </div>
      </div>

      {/* Header Info & Exclusive Certification Notice */}
      <div className="bg-white p-5 rounded-2xl border border-[#d3c5ab]/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-xs ${
              activeCert === 'lpic-3'
                ? 'bg-[#4a154b]/10 text-[#4a154b]'
                : activeCert === 'lpic-2'
                ? 'bg-[#0d47a1]/10 text-[#0d47a1]'
                : 'bg-[#d32f2f]/10 text-[#d32f2f]'
            }`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#201b11]">
                  {activeCert === 'lpic-3'
                    ? isFr
                      ? '100 Défis de Dépannage • LPIC-3 Uniquement'
                      : '100 Troubleshooting Challenges • LPIC-3 Exclusive'
                    : activeCert === 'lpic-2'
                    ? isFr
                      ? '100 Défis de Dépannage • LPIC-2 Uniquement'
                      : '100 Troubleshooting Challenges • LPIC-2 Exclusive'
                    : isFr
                      ? '100 Défis de Dépannage • LPIC-1 Uniquement'
                      : '100 Troubleshooting Challenges • LPIC-1 Exclusive'}
                </h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  activeCert === 'lpic-3'
                    ? 'bg-[#f3e5f5] text-[#6a1b9a] border-[#ce93d8]'
                    : activeCert === 'lpic-2'
                    ? 'bg-[#e0f2fe] text-[#0369a1] border-[#7dd3fc]'
                    : 'bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {activeCert === 'lpic-3'
                    ? isFr ? '100% Exclusif LPIC-3 (Niveau Entreprise)' : '100% LPIC-3 Only (Enterprise Tier)'
                    : activeCert === 'lpic-2'
                    ? isFr ? '100% Exclusif LPIC-2 (Niveau Avancé)' : '100% LPIC-2 Only (Advanced Tier)'
                    : isFr ? '100% Exclusif LPIC-1' : '100% LPIC-1 Only'}
                </span>
              </div>
              <p className="text-xs text-[#817660] mt-0.5">
                {activeCert === 'lpic-3'
                  ? isFr
                    ? 'Incidents d\'architecture avancés : Samba AD & OpenLDAP (Examen 300), Sécurité & SELinux (Examen 303), Virtualisation KVM & Kubernetes (Examen 305), Haute Disponibilité Ceph, DRBD & Pacemaker (Examen 306).'
                    : 'Advanced architecture incidents: Samba AD & OpenLDAP (Exam 300), Security & SELinux (Exam 303), KVM Virtualization & Kubernetes (Exam 305), High Availability Ceph, DRBD & Pacemaker (Exam 306).'
                  : activeCert === 'lpic-2'
                  ? isFr
                    ? 'Dépannage d\'ingénierie avancée : Capacité, Noyau & Modules, RAID/LVM, iSCSI & Réseau Avancé (Examen 201), DNS BIND 9, Apache/Nginx, Samba/NFS, DHCP, Messagerie & Sécurité (Examen 202).'
                    : 'Advanced engineering troubleshooting: Capacity Planning, Kernel & Modules, RAID/LVM, iSCSI & Advanced Network (Exam 201), DNS BIND 9, Apache/Nginx, Samba/NFS, DHCP, Mail & Security (Exam 202).'
                  : isFr
                    ? 'Collection exhaustive de 100 incidents réels couvrant l\'ensemble des 10 topics des examens 101 et 102.'
                    : 'Exhaustive collection of 100 real-world system faults covering all 10 topics of Exams 101 & 102.'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation: Sub-exams */}
        <div className="pt-2 border-t border-[#ebdcc8]/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {activeCert === 'lpic-3' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLpic3FilterChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic3Filter === 'all'
                      ? 'bg-[#4a154b] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Tous les défis LPIC-3 (100)' : 'All LPIC-3 Challenges (100)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic3FilterChange('300')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic3Filter === '300'
                      ? 'bg-[#4a154b] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 300 (Samba / LDAP • 25 défis)' : 'Exam 300 (Samba / LDAP • 25 challenges)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic3FilterChange('303')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic3Filter === '303'
                      ? 'bg-[#4a154b] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 303 (Sécurité & Hardening • 25 défis)' : 'Exam 303 (Security & Hardening • 25 challenges)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic3FilterChange('305')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic3Filter === '305'
                      ? 'bg-[#4a154b] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 305 (Virtualisation & K8s • 25 défis)' : 'Exam 305 (Virtualization & K8s • 25 challenges)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic3FilterChange('306')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic3Filter === '306'
                      ? 'bg-[#4a154b] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 306 (Clusters HA & Ceph • 25 défis)' : 'Exam 306 (HA Clusters & Ceph • 25 challenges)'}</span>
                </button>
              </>
            ) : activeCert === 'lpic-2' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLpic2FilterChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic2Filter === 'all'
                      ? 'bg-[#0d47a1] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Tous les défis LPIC-2 (100)' : 'All LPIC-2 Challenges (100)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic2FilterChange('201')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic2Filter === '201'
                      ? 'bg-[#0d47a1] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 201 (50 défis • Topics 200-206)' : 'Exam 201 (50 challenges • Topics 200-206)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic2FilterChange('202')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic2Filter === '202'
                      ? 'bg-[#0d47a1] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 202 (50 défis • Topics 207-212)' : 'Exam 202 (50 challenges • Topics 207-212)'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleLpic1FilterChange('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic1Filter === 'all'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Tous les défis LPIC-1 (100)' : 'All LPIC-1 Challenges (100)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic1FilterChange('101')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic1Filter === '101'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 101 (50 défis • Topics 101-104)' : 'Exam 101 (50 challenges • Topics 101-104)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLpic1FilterChange('102')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    lpic1Filter === '102'
                      ? 'bg-[#785a00] text-white shadow-xs'
                      : 'bg-[#fdf9f2] text-[#6a5e4b] border border-[#d3c5ab] hover:bg-[#fffcf7]'
                  }`}
                >
                  <span>{isFr ? 'Examen 102 (50 défis • Topics 105-110)' : 'Exam 102 (50 challenges • Topics 105-110)'}</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Topic Filter Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#817660]" />
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-[#fdf9f2] border border-[#d3c5ab] text-[#4f4632] rounded-lg px-2.5 py-1 text-xs font-medium focus:ring-1 focus:ring-[#785a00] outline-hidden cursor-pointer"
            >
              <option value="all">
                {isFr ? 'Filtrer par Topic (Tous)' : 'Filter by Topic (All)'}
              </option>
              {availableTopics.map((t) => (
                <option key={t.num} value={t.num}>
                  Topic {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        {/* Top bar */}
        <div className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${
          activeCert === 'lpic-3'
            ? 'bg-[#faf4fa] border-[#e1bee7]'
            : activeCert === 'lpic-2'
            ? 'bg-[#eff6ff] border-[#bfdbfe]'
            : 'bg-[#fdf8f0] border-[#ebdcc8]'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white ${
              activeCert === 'lpic-3'
                ? 'bg-[#4a154b]'
                : activeCert === 'lpic-2'
                ? 'bg-[#0d47a1]'
                : 'bg-[#785a00]'
            }`}>
              {activeCert === 'lpic-3'
                ? 'LPIC-3 UNIQUEMENT'
                : activeCert === 'lpic-2'
                ? 'LPIC-2 UNIQUEMENT'
                : 'LPIC-1 UNIQUEMENT'}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              activeCert === 'lpic-3'
                ? 'bg-[#f3e5f5] text-[#4a154b]'
                : activeCert === 'lpic-2'
                ? 'bg-[#dbeafe] text-[#0d47a1]'
                : 'bg-[#ebdcc8] text-[#785a00]'
            }`}>
              Topic {current.topicNumber} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#817660]">
              {isFr ? 'Défi' : 'Challenge'} {currentIndex + 1} / {filteredChallenges.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                title={isFr ? 'Défi précédent' : 'Previous challenge'}
                className="p-1 rounded-md hover:bg-[#ebdcc8] text-[#817660] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                title={isFr ? 'Défi suivant' : 'Next challenge'}
                className="p-1 rounded-md hover:bg-[#ebdcc8] text-[#817660] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title and Scenario */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
              <span className="text-[11px] font-mono text-[#817660]">ID: {current.id}</span>
            </div>
            <div className="p-4 bg-[#fbf9f4] border border-[#ebdcc8] rounded-xl text-xs text-[#554b38] leading-relaxed">
              <span className="font-bold text-[#201b11]">
                {activeCert === 'lpic-3'
                  ? isFr ? 'Scénario d\'incident LPIC-3 : ' : 'LPIC-3 Incident Scenario: '
                  : activeCert === 'lpic-2'
                  ? isFr ? 'Scénario d\'incident LPIC-2 : ' : 'LPIC-2 Incident Scenario: '
                  : isFr ? 'Scénario d\'incident LPIC-1 : ' : 'LPIC-1 Incident Scenario: '}
              </span>
              {scenario}
            </div>
          </div>

          {/* Faulty Code / Config Viewer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#817660] px-1">
              <span className="flex items-center gap-1.5 font-mono">
                <FileCode className="w-3.5 h-3.5" />
                {current.language ? `syntax: ${current.language}` : 'Extrait de configuration'}
              </span>
              <span className="text-[11px] text-[#d32f2f] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {isFr ? 'Contient une erreur critique' : 'Contains a critical error'}
              </span>
            </div>

            <div className="rounded-xl bg-[#1e1b18] border border-[#3d372e] p-4 text-xs font-mono text-[#f3f0e6] overflow-x-auto shadow-inner">
              <pre className="leading-relaxed">
                {current.codeSnippet.split('\n').map((line, idx) => (
                  <div key={idx} className="flex">
                    <span className="w-6 shrink-0 text-white/30 select-none text-right pr-3 font-sans text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-[#e6db74]">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>

          {/* Question Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFr
                ? 'Quelle est l\'anomalie exacte dans cet extrait ?'
                : 'What is the exact flaw in this configuration?'}
            </label>

            <div className="space-y-2.5">
              {current.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'bg-white border-[#d3c5ab] hover:border-[#785a00] hover:bg-[#fffcf7]';

                if (hasSubmitted) {
                  if (opt.isCorrect) {
                    cardStyle = 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] font-semibold';
                  } else if (isSelected && !opt.isCorrect) {
                    cardStyle = 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]';
                  } else {
                    cardStyle = 'bg-gray-50 border-gray-200 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = activeCert === 'lpic-3'
                    ? 'bg-[#f7edf8] border-[#4a154b] text-[#201b11] ring-1 ring-[#4a154b]'
                    : activeCert === 'lpic-2'
                    ? 'bg-[#eff6ff] border-[#0d47a1] text-[#201b11] ring-1 ring-[#0d47a1]'
                    : 'bg-[#fdf3e2] border-[#785a00] text-[#201b11] ring-1 ring-[#785a00]';
                }

                const optLabel = isFr && opt.labelFr ? opt.labelFr : opt.label;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? hasSubmitted
                            ? opt.isCorrect
                              ? 'bg-[#2e7d32] border-[#2e7d32] text-white'
                              : 'bg-[#d32f2f] border-[#d32f2f] text-white'
                            : activeCert === 'lpic-3'
                            ? 'bg-[#4a154b] border-[#4a154b] text-white'
                            : activeCert === 'lpic-2'
                            ? 'bg-[#0d47a1] border-[#0d47a1] text-white'
                            : 'bg-[#785a00] border-[#785a00] text-white'
                          : 'border-[#b5a790] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs leading-snug flex-1">{optLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          {!hasSubmitted ? (
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`w-full py-3 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer ${
                activeCert === 'lpic-3'
                  ? 'bg-[#4a154b] hover:bg-[#380e39]'
                  : activeCert === 'lpic-2'
                  ? 'bg-[#0d47a1] hover:bg-[#0a3880]'
                  : 'bg-[#785a00] hover:bg-[#5f4700]'
              }`}
            >
              {isFr ? 'Valider le diagnostic' : 'Submit Diagnostic'}
            </button>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Outcome Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#1b5e20]'
                    : 'bg-[#ffebee] border-[#ef9a9a] text-[#b71c1c]'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#2e7d32] mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 text-[#d32f2f] mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-bold">
                    {isCorrect
                      ? isFr
                        ? 'Diagnostic parfait !'
                        : 'Perfect Diagnostic!'
                      : isFr
                      ? 'Diagnostic erroné.'
                      : 'Incorrect Diagnostic.'}
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {selectedOption?.explanation}
                  </p>
                </div>
              </div>

              {/* Corrected Snippet Card */}
              <div className="p-4 bg-[#f1f8e9] border border-[#c8e6c9] rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#2e7d32] flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>{isFr ? 'Configuration corrigée recommandée :' : 'Recommended Fix:'}</span>
                </div>
                <pre className="p-3 bg-[#1e1b18] text-[#a6e22e] rounded-lg font-mono text-xs overflow-x-auto">
                  {current.correctedSnippet}
                </pre>
                <p className="text-xs text-[#33691e] leading-relaxed pt-1">{fixExplanation}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Recommencer ce défi' : 'Try Again'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    activeCert === 'lpic-3'
                      ? 'bg-[#4a154b] hover:bg-[#380e39]'
                      : activeCert === 'lpic-2'
                      ? 'bg-[#0d47a1] hover:bg-[#0a3880]'
                      : 'bg-[#785a00] hover:bg-[#5f4700]'
                  }`}
                >
                  <span>{isFr ? 'Défi suivant' : 'Next Challenge'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

