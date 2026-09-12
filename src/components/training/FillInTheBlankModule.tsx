import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { FillInTheBlankChallenge } from '../../types';
import { validateCommandTolerance, ToleranceValidationResult } from '../../utils/commandTolerance';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: FillInTheBlankChallenge[];
  onScoreUpdate?: (points: number) => void;
}

export const FillInTheBlankModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [activeCert, setActiveCert] = useState<'lpic-3' | 'lpic-2' | 'lpic-1'>('lpic-3');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<ToleranceValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [filterScope, setFilterScope] = useState<string>('all');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Filter challenges strictly by chosen certification and scope
  const certChallenges = challenges.filter((c) => c.certification === activeCert);

  const filteredChallenges = certChallenges.filter((c) => {
    if (filterScope === 'all') return true;
    if (activeCert === 'lpic-3') {
      if (filterScope === 'sec_id') {
        return (c.topicNumber >= 325 && c.topicNumber <= 328) || (c.topicNumber >= 301 && c.topicNumber <= 305);
      }
      if (filterScope === 'virt_ha') {
        return (c.topicNumber >= 351 && c.topicNumber <= 353) || (c.topicNumber >= 361 && c.topicNumber <= 364);
      }
      if (filterScope === 'exam303') return c.topicNumber >= 325 && c.topicNumber <= 328;
      if (filterScope === 'exam300') return c.topicNumber >= 301 && c.topicNumber <= 305;
      if (filterScope === 'exam305') return c.topicNumber >= 351 && c.topicNumber <= 353;
      if (filterScope === 'exam306') return c.topicNumber >= 361 && c.topicNumber <= 364;
      return c.topicNumber === Number(filterScope);
    } else if (activeCert === 'lpic-2') {
      if (filterScope === 'exam201') return c.topicNumber >= 200 && c.topicNumber <= 206;
      if (filterScope === 'exam202') return c.topicNumber >= 207 && c.topicNumber <= 212;
      return c.topicNumber === Number(filterScope);
    } else {
      if (filterScope === 'exam101') return c.topicNumber >= 101 && c.topicNumber <= 104;
      if (filterScope === 'exam102') return c.topicNumber >= 105 && c.topicNumber <= 110;
      return c.topicNumber === Number(filterScope);
    }
  });

  const current = filteredChallenges[currentIndex] || filteredChallenges[0];

  const handleSwitchCert = (newCert: 'lpic-3' | 'lpic-2' | 'lpic-1') => {
    setActiveCert(newCert);
    setFilterScope('all');
    setCurrentIndex(0);
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleValidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!current || !userInput.trim()) return;

    const validation = validateCommandTolerance(userInput, current.expectedAnswers, current.caseSensitive);
    setResult(validation);

    if (validation.isCorrect) {
      if (!completedIds.has(current.id)) {
        const nextSet = new Set(completedIds);
        nextSet.add(current.id);
        setCompletedIds(nextSet);
        if (onScoreUpdate) onScoreUpdate(10);
      }
    }
  };

  const handleNext = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredChallenges.length - 1);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  if (!current) {
    return (
      <div className="p-8 text-center text-[#817660]">
        Aucun défi trouvé pour ce filtre.
      </div>
    );
  }

  const promptText = isFr && current.promptFr ? current.promptFr : current.prompt;
  const scenarioText = isFr && current.scenarioFr ? current.scenarioFr : current.scenario;
  const hintText = isFr && current.hintFr ? current.hintFr : current.hint;
  const explanationText = isFr && current.explanationFr ? current.explanationFr : current.explanation;

  const currentExam =
    activeCert === 'lpic-3'
      ? current.topicNumber >= 325 && current.topicNumber <= 328
        ? '303'
        : current.topicNumber >= 351 && current.topicNumber <= 353
        ? '305'
        : current.topicNumber >= 361 && current.topicNumber <= 364
        ? '306'
        : '300'
      : activeCert === 'lpic-2'
      ? current.topicNumber <= 206
        ? '201'
        : '202'
      : current.topicNumber <= 104
      ? '101'
      : '102';

  return (
    <div className="space-y-6">
      {/* Certification Switcher (LPIC-3 vs LPIC-2 vs LPIC-1) */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#d3c5ab] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#817660] uppercase tracking-wider px-2">
            {isFr ? 'Certification ciblée :' : 'Target Certification:'}
          </span>
          <div className="flex items-center gap-1.5 bg-[#f8f5ee] p-1 rounded-lg border border-[#e5dcce]">
            <button
              type="button"
              onClick={() => handleSwitchCert('lpic-3')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeCert === 'lpic-3'
                  ? 'bg-[#201b11] text-[#ffc20e] shadow-xs'
                  : 'text-[#60553e] hover:text-[#201b11] hover:bg-[#ebdcc8]/50'
              }`}
            >
              <span>LPIC-3</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeCert === 'lpic-3' ? 'bg-[#ffc20e] text-[#201b11]' : 'bg-[#e5dcce] text-[#60553e]'
              }`}>
                100 défis exclusifs
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchCert('lpic-2')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeCert === 'lpic-2'
                  ? 'bg-[#201b11] text-[#ffc20e] shadow-xs'
                  : 'text-[#60553e] hover:text-[#201b11] hover:bg-[#ebdcc8]/50'
              }`}
            >
              <span>LPIC-2</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeCert === 'lpic-2' ? 'bg-[#ffc20e] text-[#201b11]' : 'bg-[#e5dcce] text-[#60553e]'
              }`}>
                100 défis exclusifs
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchCert('lpic-1')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeCert === 'lpic-1'
                  ? 'bg-[#201b11] text-[#ffc20e] shadow-xs'
                  : 'text-[#60553e] hover:text-[#201b11] hover:bg-[#ebdcc8]/50'
              }`}
            >
              <span>LPIC-1</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeCert === 'lpic-1' ? 'bg-[#ffc20e] text-[#201b11]' : 'bg-[#e5dcce] text-[#60553e]'
              }`}>
                100 défis exclusifs
              </span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#817660] px-3">
          <Sparkles className="w-3.5 h-3.5 text-[#a67c00]" />
          <span>
            {activeCert === 'lpic-3'
              ? (isFr ? 'Défis réservés pour LPIC-3 uniquement (Enterprise)' : 'Challenges strictly for LPIC-3 only (Enterprise)')
              : activeCert === 'lpic-2'
              ? (isFr ? 'Défis réservés pour LPIC-2 uniquement' : 'Challenges strictly for LPIC-2 only')
              : (isFr ? 'Défis réservés pour LPIC-1 uniquement' : 'Challenges strictly for LPIC-1 only')}
          </span>
        </div>
      </div>

      {/* Explicit LPIC-3 / LPIC-2 / LPIC-1 Notice Banner */}
      <div className="bg-gradient-to-r from-[#201b11] via-[#2d2516] to-[#1a160d] text-[#f7f4ea] p-4 rounded-xl border border-[#ffc20e]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffc20e] text-[#201b11] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            100
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase bg-[#ffc20e]/20 text-[#ffc20e] px-2 py-0.5 rounded border border-[#ffc20e]/30">
                {activeCert === 'lpic-3'
                  ? (isFr ? 'Défis exclusifs LPIC-3 uniquement (Enterprise)' : 'Exclusively LPIC-3 Challenges')
                  : activeCert === 'lpic-2'
                  ? (isFr ? 'Défis exclusifs LPIC-2 uniquement' : 'Exclusively LPIC-2 Challenges')
                  : (isFr ? 'Défis exclusifs LPIC-1 uniquement' : 'Exclusively LPIC-1 Challenges')}
              </span>
              <span className="text-xs text-[#d3c5ab]">
                {certChallenges.length} {isFr ? 'défis spécialisés' : 'specialized challenges'}
              </span>
            </div>
            <p className="text-xs text-[#d3c5ab] mt-1 max-w-2xl">
              {activeCert === 'lpic-3'
                ? (isFr
                  ? 'Programme officiel LPIC-3 uniquement : 100 défis avancés couvrant la Sécurité & Cryptographie (Exam 303), les Environnements Mixtes & Samba AD (Exam 300), la Virtualisation KVM & Conteneurs (Exam 305) et les Clusters Haute Disponibilité Pacemaker/DRBD/Ceph (Exam 306).'
                  : 'Official LPIC-3 curriculum only: 100 enterprise challenges covering Security (Exam 303), Mixed Environment (Exam 300), Virtualization & Containers (Exam 305), and High Availability & Clusters (Exam 306).')
                : activeCert === 'lpic-2'
                ? (isFr
                  ? 'Programme officiel LPIC-2 uniquement : 100 défis couvrant l\'Examen 201 (Topics 200 à 206) et l\'Examen 202 (Topics 207 à 212).'
                  : 'Official LPIC-2 curriculum only: 100 challenges covering Exam 201 (Topics 200-206) and Exam 202 (Topics 207-212).')
                : (isFr
                  ? 'Programme officiel LPIC-1 uniquement : 100 défis couvrant l\'Examen 101 (Topics 101 à 104) et l\'Examen 102 (Topics 105 à 110).'
                  : 'Official LPIC-1 curriculum only: 100 challenges covering Exam 101 (Topics 101-104) and Exam 102 (Topics 105-110).')}
            </p>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setFilterScope('all');
              setCurrentIndex(0);
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterScope === 'all'
                ? 'bg-[#ffc20e] text-[#201b11]'
                : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
            }`}
          >
            {isFr ? 'Tous (100)' : 'All (100)'}
          </button>
          {activeCert === 'lpic-3' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('sec_id');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'sec_id'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                {isFr ? 'Sécurité & AD (50)' : 'Security & AD (50)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('virt_ha');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'virt_ha'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                {isFr ? 'Cloud & HA (50)' : 'Cloud & HA (50)'}
              </button>
            </>
          ) : activeCert === 'lpic-2' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('exam201');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'exam201'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                Exam 201 (50)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('exam202');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'exam202'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                Exam 202 (50)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('exam101');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'exam101'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                Exam 101 (50)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterScope('exam102');
                  setCurrentIndex(0);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterScope === 'exam102'
                    ? 'bg-[#ffc20e] text-[#201b11]'
                    : 'bg-white/10 hover:bg-white/20 text-[#f7f4ea]'
                }`}
              >
                Exam 102 (50)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header Info & Topic Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffc20e]/20 text-[#785a00] flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {activeCert === 'lpic-3'
                ? (isFr ? 'Saisie exacte sans QCM (100% LPIC-3 uniquement)' : 'Direct Fill-in-the-Blank (100% LPIC-3 only)')
                : activeCert === 'lpic-2'
                ? (isFr ? 'Saisie exacte sans QCM (100% LPIC-2)' : 'Direct Fill-in-the-Blank (100% LPIC-2)')
                : (isFr ? 'Saisie exacte sans QCM (100% LPIC-1)' : 'Direct Fill-in-the-Blank (100% LPIC-1)')}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Tapez la commande ou le chemin exact (tolérance intelligente des espaces, options et drapeaux)'
                : 'Type the exact command or path (intelligent tolerance for whitespace, flags & options)'}
            </p>
          </div>
        </div>

        {/* Progress & Filters */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedIds.size} / {filteredChallenges.length} {isFr ? 'réussis' : 'mastered'}
            </span>
          </div>

          <div className="flex items-center gap-1 border border-[#d3c5ab] rounded-lg px-2 py-1 bg-white text-xs text-[#4f4632]">
            <Filter className="w-3.5 h-3.5 text-[#817660]" />
            <select
              value={filterScope}
              onChange={(e) => {
                setFilterScope(e.target.value);
                setCurrentIndex(0);
                handleReset();
              }}
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
            >
              {activeCert === 'lpic-3' ? (
                <>
                  <option value="all">{isFr ? 'Tous les 100 Défis LPIC-3 (Exclusifs)' : 'All 100 LPIC-3 Challenges (Exclusive)'}</option>
                  <optgroup label={isFr ? 'Exam 303 : Sécurité & Cryptographie' : 'Exam 303: Security & Cryptography'}>
                    <option value="exam303">{isFr ? 'Examen 303 complet (Sécurité)' : 'Exam 303 All (Security)'}</option>
                    <option value="325">Topic 325 : Cryptography & PKI OpenSSL, LUKS</option>
                    <option value="326">Topic 326 : Access Control (SELinux & AppArmor)</option>
                    <option value="327">Topic 327 : Network Security & nftables, IPsec, WireGuard</option>
                    <option value="328">Topic 328 : Operations Security & Auditd, AIDE, Lynis</option>
                  </optgroup>
                  <optgroup label={isFr ? 'Exam 300 : Environnements Mixtes & Samba AD' : 'Exam 300: Mixed Environment & Samba AD'}>
                    <option value="exam300">{isFr ? 'Examen 300 complet (Identité & Samba)' : 'Exam 300 All (Identity & Samba)'}</option>
                    <option value="301">Topic 301 : OpenLDAP Configuration</option>
                    <option value="302">Topic 302 : Kerberos Authentication</option>
                    <option value="303">Topic 303 : Samba 4 Active Directory DC</option>
                    <option value="304">Topic 304 : Samba Winbind & Partages</option>
                    <option value="305">Topic 305 : SSSD, FreeIPA & Domain Joining</option>
                  </optgroup>
                  <optgroup label={isFr ? 'Exam 305 : Virtualisation & Conteneurs' : 'Exam 305: Virtualization & Containers'}>
                    <option value="exam305">{isFr ? 'Examen 305 complet (KVM & Conteneurs)' : 'Exam 305 All (KVM & Containers)'}</option>
                    <option value="351">Topic 351 : Full Virtualization (KVM, Libvirt, QEMU)</option>
                    <option value="352">Topic 352 : Container Virtualization (LXC, Docker, Podman)</option>
                    <option value="353">Topic 353 : Provisioning (Cloud-init, Packer, Vagrant)</option>
                  </optgroup>
                  <optgroup label={isFr ? 'Exam 306 : Haute Disponibilité & Clusters' : 'Exam 306: High Availability & Clusters'}>
                    <option value="exam306">{isFr ? 'Examen 306 complet (Pacemaker & Stockage)' : 'Exam 306 All (Pacemaker & Storage)'}</option>
                    <option value="361">Topic 361 : HA Cluster Design & MTTR/RPO</option>
                    <option value="362">Topic 362 : Cluster Management (Pacemaker, Corosync, STONITH)</option>
                    <option value="363">Topic 363 : Cluster Storage (DRBD, GFS2, Ceph, GlusterFS)</option>
                    <option value="364">Topic 364 : HA Load Balancing (HAProxy, Keepalived/VRRP)</option>
                  </optgroup>
                </>
              ) : activeCert === 'lpic-2' ? (
                <>
                  <option value="all">{isFr ? 'Tous les 100 Défis LPIC-2' : 'All 100 LPIC-2 Challenges'}</option>
                  <optgroup label={isFr ? 'Exam 201 (Topics 200-206)' : 'Exam 201 (Topics 200-206)'}>
                    <option value="exam201">{isFr ? 'Examen 201 complet (50 défis)' : 'Exam 201 All (50 challenges)'}</option>
                    <option value="200">Topic 200 : Capacity Planning</option>
                    <option value="201">Topic 201 : Linux Kernel & Modules</option>
                    <option value="202">Topic 202 : System Startup & Recovery</option>
                    <option value="203">Topic 203 : Filesystem and Devices</option>
                    <option value="204">Topic 204 : Storage Administration (RAID/LVM)</option>
                    <option value="205">Topic 205 : Network Configuration</option>
                    <option value="206">Topic 206 : System Maintenance</option>
                  </optgroup>
                  <optgroup label={isFr ? 'Exam 202 (Topics 207-212)' : 'Exam 202 (Topics 207-212)'}>
                    <option value="exam202">{isFr ? 'Examen 202 complet (50 défis)' : 'Exam 202 All (50 challenges)'}</option>
                    <option value="207">Topic 207 : DNS Server (BIND 9)</option>
                    <option value="208">Topic 208 : Web Services (Apache, Nginx, Squid)</option>
                    <option value="209">Topic 209 : File Sharing (Samba & NFS)</option>
                    <option value="210">Topic 210 : Network Client Management (DHCP, PAM, LDAP)</option>
                    <option value="211">Topic 211 : E-Mail Services (Postfix & Dovecot)</option>
                    <option value="212">Topic 212 : System Security (iptables, SSH, OpenVPN)</option>
                  </optgroup>
                </>
              ) : (
                <>
                  <option value="all">{isFr ? 'Tous les 100 Défis LPIC-1' : 'All 100 LPIC-1 Challenges'}</option>
                  <optgroup label="Exam 101 (Topics 101-104)">
                    <option value="exam101">{isFr ? 'Examen 101 complet (50 défis)' : 'Exam 101 All (50 challenges)'}</option>
                    <option value="101">Topic 101 : System Architecture</option>
                    <option value="102">Topic 102 : Linux Installation & Packages</option>
                    <option value="103">Topic 103 : GNU & Unix Commands</option>
                    <option value="104">Topic 104 : Devices & Filesystems</option>
                  </optgroup>
                  <optgroup label="Exam 102 (Topics 105-110)">
                    <option value="exam102">{isFr ? 'Examen 102 complet (50 défis)' : 'Exam 102 All (50 challenges)'}</option>
                    <option value="105">Topic 105 : Shells & Shell Scripting</option>
                    <option value="106">Topic 106 : User Interfaces & Desktops</option>
                    <option value="107">Topic 107 : Administrative Tasks</option>
                    <option value="108">Topic 108 : Essential System Services</option>
                    <option value="109">Topic 109 : Networking Fundamentals</option>
                    <option value="110">Topic 110 : Security & SSH</option>
                  </optgroup>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        {/* Top bar of card */}
        <div className="px-6 py-3 bg-[#fdf8f0] border-b border-[#ebdcc8] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#ffc20e] text-[#201b11] shadow-2xs">
              {(current.certification || activeCert).toUpperCase()} • EXAM {currentExam}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
              Topic {current.topicNumber} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660] hidden sm:inline">{current.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#817660]">
              Défi {currentIndex + 1} / {filteredChallenges.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="px-2 py-0.5 text-xs font-bold bg-[#ebdcc8]/50 hover:bg-[#ebdcc8] rounded text-[#4f4632] cursor-pointer"
                title={isFr ? 'Défi précédent' : 'Previous challenge'}
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-2 py-0.5 text-xs font-bold bg-[#ebdcc8]/50 hover:bg-[#ebdcc8] rounded text-[#4f4632] cursor-pointer"
                title={isFr ? 'Défi suivant' : 'Next challenge'}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Scenario if present */}
          {scenarioText && (
            <div className="p-3 bg-[#f8f5ee] rounded-xl text-xs text-[#60553e] border border-[#e5dcce]/60 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-[#a67c00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#443b27]">{isFr ? 'Contexte : ' : 'Scenario: '}</span>
                {scenarioText}
              </div>
            </div>
          )}

          {/* Prompt */}
          <div>
            <h4 className="text-base font-bold text-[#201b11] leading-snug">{promptText}</h4>
          </div>

          {/* Context Code / Terminal Prompt */}
          {current.contextCode && (
            <div className="rounded-xl bg-[#1e1b18] text-[#f7f4ea] p-3.5 font-mono text-xs overflow-x-auto shadow-inner border border-[#3b352b]">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-white/50 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                <span className="ml-2 font-mono text-[#ffc20e]">bash terminal ({(current.certification || activeCert).toUpperCase()} Exam {currentExam})</span>
              </div>
              <pre className="text-[#a6e22e] whitespace-pre-wrap">{current.contextCode}</pre>
            </div>
          )}

          {/* User Input Form */}
          <form onSubmit={handleValidate} className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#817660]">
              {isFr ? 'Votre commande ou saisie :' : 'Your command or input:'}
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    if (result) setResult(null);
                  }}
                  disabled={result?.isCorrect}
                  placeholder={current.placeholder}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full px-4 py-2.5 font-mono text-sm rounded-xl border transition-all ${
                    result?.isCorrect
                      ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                      : result?.isNearMiss
                      ? 'bg-[#fffde7] border-[#fbc02d] text-[#201b11]'
                      : result && !result.isCorrect
                      ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]'
                      : 'bg-white border-[#d3c5ab] text-[#201b11] focus:ring-2 focus:ring-[#785a00] focus:border-transparent'
                  }`}
                />
              </div>

              {!result?.isCorrect && (
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="px-5 py-2.5 bg-[#785a00] hover:bg-[#5f4700] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isFr ? 'Valider' : 'Submit'}
                </button>
              )}

              {result?.isCorrect && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>{isFr ? 'Suivant' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Validation Feedback */}
          {result && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                result.isCorrect
                  ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#1b5e20]'
                  : result.isNearMiss
                  ? 'bg-[#fffde7] border-[#fff59d] text-[#f57f17]'
                  : 'bg-[#ffebee] border-[#ef9a9a] text-[#b71c1c]'
              }`}
            >
              {result.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#2e7d32]" />
              ) : result.isNearMiss ? (
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-[#f57f17]" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#d32f2f]" />
              )}
              <div className="space-y-1">
                <div className="text-xs font-bold">{result.feedbackMessage}</div>
                {result.isCorrect && (
                  <p className="text-xs opacity-90 leading-relaxed pt-1 border-t border-black/10">
                    {explanationText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Hint & Solution Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ebdcc8]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 text-xs font-semibold text-[#785a00] hover:bg-[#f8ecdb] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? (isFr ? 'Masquer l\'indice' : 'Hide Hint') : (isFr ? 'Afficher un indice' : 'Show Hint')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="px-3 py-1.5 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg transition-colors cursor-pointer"
              >
                {showSolution ? (isFr ? 'Masquer la réponse' : 'Hide Answer') : (isFr ? 'Voir la réponse officielle' : 'Reveal Official Answer')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg transition-colors cursor-pointer"
                title={isFr ? 'Réinitialiser' : 'Reset'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-3 py-1.5 text-xs font-semibold text-[#4f4632] hover:bg-[#ebdcc8]/60 border border-[#d3c5ab] rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <span>{isFr ? 'Passer' : 'Skip'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Expanded Hint Box */}
          {showHint && (
            <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl text-xs text-[#8d6e63] flex items-start gap-2 animate-fade-in">
              <Lightbulb className="w-4 h-4 text-[#ffa000] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#5d4037]">{isFr ? 'Indice : ' : 'Hint: '}</span>
                {hintText}
              </div>
            </div>
          )}

          {/* Expanded Solution Box */}
          {showSolution && (
            <div className="p-4 bg-[#eefeef] border border-[#a5d6a7] rounded-xl text-xs text-[#1b5e20] space-y-2 animate-fade-in">
              <div className="font-bold text-sm text-[#2e7d32]">
                {isFr ? 'Réponses acceptées par le simulateur LPI :' : 'Accepted Answers:'}
              </div>
              <ul className="list-disc pl-5 font-mono space-y-1">
                {current.expectedAnswers.map((ans, i) => (
                  <li key={i}>{ans}</li>
                ))}
              </ul>
              <div className="pt-2 text-xs border-t border-[#c8e6c9] leading-relaxed">
                {explanationText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

