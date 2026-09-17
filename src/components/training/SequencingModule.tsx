import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  ListOrdered,
  Filter,
  Layers,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { SequencingChallenge, SequencingStep } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  challenges: SequencingChallenge[];
  onScoreUpdate?: (points: number) => void;
}

// Simple shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type CertFilter = 'all' | 'lpic-1' | 'lpic-2' | 'lpic-3';
type ExamFilter = 'all' | '101' | '102' | '201' | '202' | '300' | '303' | '305' | '306';

const TOPIC_NAMES: Record<number, { fr: string; en: string }> = {
  // LPIC-1 (Exam 101)
  101: { fr: 'Topic 101 — Architecture Système', en: 'Topic 101 — System Architecture' },
  102: { fr: 'Topic 102 — Installation Linux & Paquets', en: 'Topic 102 — Linux Installation & Packages' },
  103: { fr: 'Topic 103 — Commandes GNU & Unix', en: 'Topic 103 — GNU & Unix Commands' },
  104: { fr: 'Topic 104 — Périphériques & Fichiers FHS', en: 'Topic 104 — Devices & Filesystems' },
  // LPIC-1 (Exam 102)
  105: { fr: 'Topic 105 — Shells, Scripting & Environnement', en: 'Topic 105 — Shells & Scripting' },
  106: { fr: 'Topic 106 — Interfaces Utilisateur & Graphique', en: 'Topic 106 — User Interfaces & Desktops' },
  107: { fr: 'Topic 107 — Tâches Administratives & Cron', en: 'Topic 107 — Administrative Tasks' },
  108: { fr: 'Topic 108 — Services Système Essentiels & Logs', en: 'Topic 108 — Essential System Services' },
  109: { fr: 'Topic 109 — Notions Fondamentales Réseau', en: 'Topic 109 — Networking Fundamentals' },
  110: { fr: 'Topic 110 — Sécurité de l\'Hôte & SSH', en: 'Topic 110 — Security & SSH' },
  // LPIC-2 (Exam 201)
  200: { fr: 'Topic 200 — Capacité Matérielle & Mesures', en: 'Topic 200 — Capacity Planning' },
  201: { fr: 'Topic 201 — Noyau Linux (Kernel)', en: 'Topic 201 — Linux Kernel' },
  202: { fr: 'Topic 202 — Démarrage Système & Systemd', en: 'Topic 202 — System Startup' },
  203: { fr: 'Topic 203 — Systèmes de Fichiers & Disques', en: 'Topic 203 — Filesystem & Devices' },
  204: { fr: 'Topic 204 — Stockage Avancé (RAID & LVM)', en: 'Topic 204 — Advanced Storage Administration' },
  205: { fr: 'Topic 205 — Configuration Réseau & Routage', en: 'Topic 205 — Network Configuration' },
  206: { fr: 'Topic 206 — Maintenance Système & Sauvegardes', en: 'Topic 206 — System Maintenance' },
  // LPIC-2 (Exam 202)
  207: { fr: 'Topic 207 — Serveur DNS & BIND 9', en: 'Topic 207 — Domain Name Server (BIND 9)' },
  208: { fr: 'Topic 208 — Services Web Apache & Nginx', en: 'Topic 208 — Web Services' },
  209: { fr: 'Topic 209 — Partage de Fichiers Samba & NFS', en: 'Topic 209 — File Sharing (Samba & NFS)' },
  210: { fr: 'Topic 210 — Gestion Clients DHCP, PAM & LDAP', en: 'Topic 210 — Network Client Management' },
  211: { fr: 'Topic 211 — Services Mail Postfix & Dovecot', en: 'Topic 211 — E-Mail Services' },
  212: { fr: 'Topic 212 — Sécurité Système, VPN & Nftables', en: 'Topic 212 — System Security & VPN' },
  // LPIC-3 300 (Mixed Environment)
  301: { fr: 'Topic 301 — Configuration OpenLDAP', en: 'Topic 301 — OpenLDAP Configuration' },
  302: { fr: 'Topic 302 — Authentification OpenLDAP & PPolicy', en: 'Topic 302 — OpenLDAP Authentication & PPolicy' },
  303: { fr: 'Topic 303 — Intégration de Domaine & SSSD', en: 'Topic 303 — Domain Integration & SSSD' },
  304: { fr: 'Topic 304 — Partages Samba & Idmap RFC2307', en: 'Topic 304 — Samba Shares & Idmap' },
  305: { fr: 'Topic 305 — Kerberos & SPNEGO', en: 'Topic 305 — Kerberos & SPNEGO' },
  306: { fr: 'Topic 306 — Samba AD DC & Relations de Confiance', en: 'Topic 306 — Samba AD DC & Forest Trusts' },
  // LPIC-3 303 (Security)
  321: { fr: 'Topic 321 — Cryptographie, PKI & Certificats', en: 'Topic 321 — Cryptography & PKI' },
  322: { fr: 'Topic 322 — Contrôle d\'Accès (SELinux & AppArmor)', en: 'Topic 322 — Access Control (SELinux/AppArmor)' },
  323: { fr: 'Topic 323 — Sécurité des Opérations (Auditd & Sysctl)', en: 'Topic 323 — Operations Security (Auditd/Sysctl)' },
  324: { fr: 'Topic 324 — Sécurité Réseau (IPsec, WireGuard, IPS)', en: 'Topic 324 — Network Security (IPsec, WireGuard, IPS)' },
  // LPIC-3 305 (Virtualization & Containerization)
  351: { fr: 'Topic 351 — Virtualisation Complète (KVM, libvirt, QEMU)', en: 'Topic 351 — Full Virtualization (KVM/QEMU)' },
  352: { fr: 'Topic 352 — Virtualisation par Conteneurs (Podman, LXC)', en: 'Topic 352 — Container Virtualization (Podman/LXC)' },
  353: { fr: 'Topic 353 — Déploiement & Automatisation (Cloud-Init, Packer)', en: 'Topic 353 — VM & Container Deployment' },
  354: { fr: 'Topic 354 — Orchestration Kubernetes (kubeadm, CNI, CSI)', en: 'Topic 354 — Container Orchestration (Kubernetes)' },
  // LPIC-3 306 (High Availability & Storage Clusters)
  361: { fr: 'Topic 361 — Gestion de Cluster HA (Pacemaker, Corosync, STONITH)', en: 'Topic 361 — HA Cluster Management' },
  362: { fr: 'Topic 362 — Stockage HA & Répliqué (DRBD, GFS2)', en: 'Topic 362 — High Availability Cluster Storage' },
  363: { fr: 'Topic 363 — Stockage Distribué HA (Ceph, GlusterFS)', en: 'Topic 363 — Distributed Storage (Ceph & GlusterFS)' },
  364: { fr: 'Topic 364 — Clusters avec Équilibrage de Charge (HAProxy, Keepalived)', en: 'Topic 364 — Load Balanced Clusters' },
};

export const SequencingModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [selectedCert, setSelectedCert] = useState<CertFilter>('all');
  const [selectedExam, setSelectedExam] = useState<ExamFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSteps, setCurrentSteps] = useState<SequencingStep[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Filter challenges by certification, exam, and topic
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Certification filter
      if (selectedCert === 'lpic-1' && c.certification !== 'lpic-1') return false;
      if (selectedCert === 'lpic-2' && c.certification !== 'lpic-2') return false;
      if (selectedCert === 'lpic-3' && c.certification !== 'lpic-3') return false;

      // Exam filter
      if (selectedExam === '101') {
        if (!(c.topicNumber >= 101 && c.topicNumber <= 104)) return false;
      } else if (selectedExam === '102') {
        if (!(c.topicNumber >= 105 && c.topicNumber <= 110)) return false;
      } else if (selectedExam === '201') {
        if (!(c.topicNumber >= 200 && c.topicNumber <= 206)) return false;
      } else if (selectedExam === '202') {
        if (!(c.topicNumber >= 207 && c.topicNumber <= 212)) return false;
      } else if (selectedExam === '300') {
        if (!(c.topicNumber >= 301 && c.topicNumber <= 306)) return false;
      } else if (selectedExam === '303') {
        if (!(c.topicNumber >= 321 && c.topicNumber <= 324)) return false;
      } else if (selectedExam === '305') {
        if (!(c.topicNumber >= 351 && c.topicNumber <= 354)) return false;
      } else if (selectedExam === '306') {
        if (!(c.topicNumber >= 361 && c.topicNumber <= 364)) return false;
      }

      // Topic filter
      if (selectedTopic !== 'all') {
        if (c.topicNumber !== selectedTopic) return false;
      }

      return true;
    });
  }, [challenges, selectedCert, selectedExam, selectedTopic]);

  // Available exams based on active cert
  const availableExams = useMemo(() => {
    if (selectedCert === 'lpic-1') {
      return [
        { id: 'all' as ExamFilter, labelFr: 'Tous Examens LPIC-1', labelEn: 'All LPIC-1 Exams' },
        { id: '101' as ExamFilter, labelFr: 'Examen 101', labelEn: 'Exam 101' },
        { id: '102' as ExamFilter, labelFr: 'Examen 102', labelEn: 'Exam 102' },
      ];
    }
    if (selectedCert === 'lpic-2') {
      return [
        { id: 'all' as ExamFilter, labelFr: 'Tous Examens LPIC-2', labelEn: 'All LPIC-2 Exams' },
        { id: '201' as ExamFilter, labelFr: 'Examen 201', labelEn: 'Exam 201' },
        { id: '202' as ExamFilter, labelFr: 'Examen 202', labelEn: 'Exam 202' },
      ];
    }
    if (selectedCert === 'lpic-3') {
      return [
        { id: 'all' as ExamFilter, labelFr: 'Toutes spécialités LPIC-3', labelEn: 'All LPIC-3 Specialties' },
        { id: '300' as ExamFilter, labelFr: '300 (Mixed Env)', labelEn: '300 (Mixed Env)' },
        { id: '303' as ExamFilter, labelFr: '303 (Security)', labelEn: '303 (Security)' },
        { id: '305' as ExamFilter, labelFr: '305 (Virt & Cont)', labelEn: '305 (Virt & Cont)' },
        { id: '306' as ExamFilter, labelFr: '306 (HA & Storage)', labelEn: '306 (HA & Storage)' },
      ];
    }
    return [
      { id: 'all' as ExamFilter, labelFr: 'Tous les examens', labelEn: 'All Exams' },
      { id: '101' as ExamFilter, labelFr: '101 (LPIC-1)', labelEn: '101 (LPIC-1)' },
      { id: '102' as ExamFilter, labelFr: '102 (LPIC-1)', labelEn: '102 (LPIC-1)' },
      { id: '201' as ExamFilter, labelFr: '201 (LPIC-2)', labelEn: '201 (LPIC-2)' },
      { id: '202' as ExamFilter, labelFr: '202 (LPIC-2)', labelEn: '202 (LPIC-2)' },
      { id: '300' as ExamFilter, labelFr: '300 (LPIC-3)', labelEn: '300 (LPIC-3)' },
      { id: '303' as ExamFilter, labelFr: '303 (LPIC-3)', labelEn: '303 (LPIC-3)' },
      { id: '305' as ExamFilter, labelFr: '305 (LPIC-3)', labelEn: '305 (LPIC-3)' },
      { id: '306' as ExamFilter, labelFr: '306 (LPIC-3)', labelEn: '306 (LPIC-3)' },
    ];
  }, [selectedCert]);

  // Available topics for current filters
  const availableTopics = useMemo(() => {
    const topicSet = new Set<number>();
    challenges.forEach((c) => {
      if (selectedCert === 'lpic-1' && c.certification !== 'lpic-1') return;
      if (selectedCert === 'lpic-2' && c.certification !== 'lpic-2') return;
      if (selectedCert === 'lpic-3' && c.certification !== 'lpic-3') return;

      if (selectedExam === '101' && (c.topicNumber < 101 || c.topicNumber > 104)) return;
      if (selectedExam === '102' && (c.topicNumber < 105 || c.topicNumber > 110)) return;
      if (selectedExam === '201' && (c.topicNumber < 200 || c.topicNumber > 206)) return;
      if (selectedExam === '202' && (c.topicNumber < 207 || c.topicNumber > 212)) return;
      if (selectedExam === '300' && (c.topicNumber < 301 || c.topicNumber > 306)) return;
      if (selectedExam === '303' && (c.topicNumber < 321 || c.topicNumber > 324)) return;
      if (selectedExam === '305' && (c.topicNumber < 351 || c.topicNumber > 354)) return;
      if (selectedExam === '306' && (c.topicNumber < 361 || c.topicNumber > 364)) return;

      topicSet.add(c.topicNumber);
    });
    return Array.from(topicSet).sort((a, b) => a - b);
  }, [challenges, selectedCert, selectedExam]);

  // Filter change handlers
  const handleCertChange = (cert: CertFilter) => {
    setSelectedCert(cert);
    setSelectedExam('all');
    setSelectedTopic('all');
    setCurrentIndex(0);
  };

  const handleExamChange = (exam: ExamFilter) => {
    setSelectedExam(exam);
    setSelectedTopic('all');
    setCurrentIndex(0);
  };

  const handleTopicChange = (topic: number | 'all') => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
  };

  // Safe current challenge
  const current = filteredChallenges[currentIndex] || filteredChallenges[0];

  useEffect(() => {
    if (current) {
      let shuffled = shuffleArray<SequencingStep>(current.steps);
      // Ensure it's not already in exact order by accident
      if (shuffled.every((s, idx) => s.id === current.steps[idx].id) && shuffled.length > 1) {
        shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
      }
      setCurrentSteps(shuffled);
      setHasSubmitted(false);
      setIsCorrect(null);
    }
  }, [currentIndex, current]);

  const title = isFr && current?.titleFr ? current.titleFr : current?.title;
  const description = isFr && current?.descriptionFr ? current.descriptionFr : current?.description;
  const explanation = isFr && current?.explanationFr ? current.explanationFr : current?.explanation;

  const handleMoveUp = (index: number) => {
    if (index === 0 || hasSubmitted) return;
    const newSteps = [...currentSteps];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index];
    newSteps[index] = temp;
    setCurrentSteps(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === currentSteps.length - 1 || hasSubmitted) return;
    const newSteps = [...currentSteps];
    const temp = newSteps[index + 1];
    newSteps[index + 1] = newSteps[index];
    newSteps[index] = temp;
    setCurrentSteps(newSteps);
  };

  const handleValidate = () => {
    if (!current) return;
    setHasSubmitted(true);
    const correct = currentSteps.every((s, idx) => s.id === current.steps[idx].id);
    setIsCorrect(correct);

    if (correct && !completedIds.has(current.id)) {
      const next = new Set(completedIds);
      next.add(current.id);
      setCompletedIds(next);
      if (onScoreUpdate) onScoreUpdate(20);
    }
  };

  const handleReset = () => {
    if (!current) return;
    let shuffled = shuffleArray(current.steps);
    setCurrentSteps(shuffled);
    setHasSubmitted(false);
    setIsCorrect(null);
  };

  const handleNext = () => {
    if (currentIndex < filteredChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredChallenges.length - 1);
    }
  };

  // Helper for exam badge display
  const getExamBadge = (topicNumber: number) => {
    if (topicNumber >= 101 && topicNumber <= 104) {
      return {
        label: 'LPIC-1 • EXAMEN 101',
        style: 'bg-[#006064]/15 text-[#006064] border border-[#006064]/30'
      };
    }
    if (topicNumber >= 105 && topicNumber <= 110) {
      return {
        label: 'LPIC-1 • EXAMEN 102',
        style: 'bg-[#2e7d32]/15 text-[#2e7d32] border border-[#2e7d32]/30'
      };
    }
    if (topicNumber >= 200 && topicNumber <= 206) {
      return {
        label: 'LPIC-2 • EXAMEN 201',
        style: 'bg-[#b71c1c]/15 text-[#b71c1c] border border-[#b71c1c]/30'
      };
    }
    if (topicNumber >= 207 && topicNumber <= 212) {
      return {
        label: 'LPIC-2 • EXAMEN 202',
        style: 'bg-[#4a148c]/15 text-[#4a148c] border border-[#4a148c]/30'
      };
    }
    if (topicNumber >= 301 && topicNumber <= 306) {
      return {
        label: 'LPIC-3 • EXAMEN 300 (MIXED)',
        style: 'bg-[#1565c0]/15 text-[#1565c0] border border-[#1565c0]/30'
      };
    }
    if (topicNumber >= 321 && topicNumber <= 324) {
      return {
        label: 'LPIC-3 • EXAMEN 303 (SECURITY)',
        style: 'bg-[#c2185b]/15 text-[#c2185b] border border-[#c2185b]/30'
      };
    }
    if (topicNumber >= 351 && topicNumber <= 354) {
      return {
        label: 'LPIC-3 • EXAMEN 305 (VIRT & CONT)',
        style: 'bg-[#e65100]/15 text-[#e65100] border border-[#e65100]/30'
      };
    }
    if (topicNumber >= 361 && topicNumber <= 364) {
      return {
        label: 'LPIC-3 • EXAMEN 306 (HA & STORAGE)',
        style: 'bg-[#2e7d32]/15 text-[#2e7d32] border border-[#2e7d32]/30'
      };
    }
    return {
      label: 'LPIC',
      style: 'bg-[#785a00]/15 text-[#785a00] border border-[#785a00]/30'
    };
  };

  // Counts
  const lpic1Count = challenges.filter((c) => c.certification === 'lpic-1').length;
  const lpic2Count = challenges.filter((c) => c.certification === 'lpic-2').length;
  const lpic3Count = challenges.filter((c) => c.certification === 'lpic-3').length;
  const completedInFilter = filteredChallenges.filter((c) => completedIds.has(c.id)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Overall Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#006064]/10 text-[#006064] flex items-center justify-center font-bold">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#201b11]">
                {isFr
                  ? `Exercices d'ordonnancement (${challenges.length} Procédures : 40 LPIC-1 + 40 LPIC-2 + 40 LPIC-3)`
                  : `Sequencing Exercises (${challenges.length} Procedures: 40 LPIC-1 + 40 LPIC-2 + 40 LPIC-3)`}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#785a00]/10 text-[#785a00] border border-[#785a00]/20">
                LPIC-1, LPIC-2 & LPIC-3
              </span>
            </div>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Réorganisez les étapes dans l\'ordre chronologique ou de priorité exact à l\'aide des flèches'
                : 'Reorder the steps into the exact chronological or priority order using arrows'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg border border-[#ebdcc8]">
            <Award className="w-3.5 h-3.5 text-[#785a00]" />
            <span>
              {completedInFilter} / {filteredChallenges.length} {isFr ? 'validés dans cette vue' : 'mastered in view'}
            </span>
          </div>
          <div className="text-[11px] font-bold text-[#817660] px-2 py-1 bg-stone-100 rounded-lg">
            Total: {completedIds.size} / {challenges.length}
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Certification, Exam & Topic Selection */}
      <div className="bg-white p-4 rounded-xl border border-[#d3c5ab]/80 shadow-xs space-y-3">
        {/* Certification Selector (LPIC-1 / LPIC-2 / LPIC-3 / All) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0e6d6]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#4f4632] flex items-center gap-1 mr-1">
              <GraduationCap className="w-4 h-4 text-[#785a00]" />
              {isFr ? 'Certification :' : 'Certification:'}
            </span>
            <button
              type="button"
              onClick={() => handleCertChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'all'
                  ? 'bg-[#201b11] text-white shadow-xs'
                  : 'bg-stone-100 text-[#60553e] hover:bg-stone-200'
              }`}
            >
              {isFr ? `Toutes (${challenges.length})` : `All (${challenges.length})`}
            </button>
            <button
              type="button"
              onClick={() => handleCertChange('lpic-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-1'
                  ? 'bg-[#006064] text-white shadow-xs'
                  : 'bg-[#e0f7fa] text-[#006064] hover:bg-[#b2ebf2]'
              }`}
            >
              LPIC-1 ({lpic1Count})
            </button>
            <button
              type="button"
              onClick={() => handleCertChange('lpic-2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-2'
                  ? 'bg-[#b71c1c] text-white shadow-xs'
                  : 'bg-[#ffebee] text-[#b71c1c] hover:bg-[#ffcdd2]'
              }`}
            >
              LPIC-2 ({lpic2Count})
            </button>
            <button
              type="button"
              onClick={() => handleCertChange('lpic-3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCert === 'lpic-3'
                  ? 'bg-[#1565c0] text-white shadow-xs'
                  : 'bg-[#e3f2fd] text-[#1565c0] hover:bg-[#bbdefb]'
              }`}
            >
              LPIC-3 ({lpic3Count})
            </button>
          </div>

          {/* Quick Jump Dropdown */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#817660]" />
            <select
              value={currentIndex}
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
              className="text-xs bg-[#fdfaf5] border border-[#d3c5ab] rounded-lg px-2.5 py-1.5 font-medium text-[#201b11] focus:ring-1 focus:ring-[#785a00] max-w-[260px] truncate cursor-pointer"
            >
              {filteredChallenges.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {idx + 1}. [{item.certification.toUpperCase()} {item.objectiveId}] {isFr && item.titleFr ? item.titleFr : item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exam Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#4f4632] flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-[#785a00]" />
            {isFr ? 'Examen :' : 'Exam:'}
          </span>
          {availableExams.map((ex) => {
            let count = 0;
            if (ex.id === 'all') {
              count = challenges.filter((c) => {
                if (selectedCert === 'lpic-1') return c.certification === 'lpic-1';
                if (selectedCert === 'lpic-2') return c.certification === 'lpic-2';
                if (selectedCert === 'lpic-3') return c.certification === 'lpic-3';
                return true;
              }).length;
            } else if (ex.id === '101') {
              count = challenges.filter((c) => c.topicNumber >= 101 && c.topicNumber <= 104).length;
            } else if (ex.id === '102') {
              count = challenges.filter((c) => c.topicNumber >= 105 && c.topicNumber <= 110).length;
            } else if (ex.id === '201') {
              count = challenges.filter((c) => c.topicNumber >= 200 && c.topicNumber <= 206).length;
            } else if (ex.id === '202') {
              count = challenges.filter((c) => c.topicNumber >= 207 && c.topicNumber <= 212).length;
            } else if (ex.id === '300') {
              count = challenges.filter((c) => c.topicNumber >= 301 && c.topicNumber <= 306).length;
            } else if (ex.id === '303') {
              count = challenges.filter((c) => c.topicNumber >= 321 && c.topicNumber <= 324).length;
            } else if (ex.id === '305') {
              count = challenges.filter((c) => c.topicNumber >= 351 && c.topicNumber <= 354).length;
            } else if (ex.id === '306') {
              count = challenges.filter((c) => c.topicNumber >= 361 && c.topicNumber <= 364).length;
            }

            const label = isFr ? ex.labelFr : ex.labelEn;

            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleExamChange(ex.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedExam === ex.id
                    ? 'bg-[#785a00] text-white shadow-xs'
                    : 'bg-stone-100 text-[#60553e] hover:bg-stone-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#f0e6d6]">
          <span className="text-[11px] font-bold text-[#817660] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            {isFr ? 'Topic :' : 'Topic:'}
          </span>
          <button
            type="button"
            onClick={() => handleTopicChange('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              selectedTopic === 'all'
                ? 'bg-[#201b11] text-white'
                : 'bg-stone-100 text-[#60553e] hover:bg-stone-200'
            }`}
          >
            {isFr ? 'Tous les Topics' : 'All Topics'}
          </button>
          {availableTopics.map((topicNum) => {
            const count = challenges.filter((c) => c.topicNumber === topicNum).length;
            const topicInfo = TOPIC_NAMES[topicNum];
            const label = isFr && topicInfo ? topicInfo.fr : topicInfo ? topicInfo.en : `Topic ${topicNum}`;

            return (
              <button
                key={topicNum}
                type="button"
                onClick={() => handleTopicChange(topicNum)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTopic === topicNum
                    ? 'bg-[#785a00] text-white'
                    : 'bg-[#fdf8f0] text-[#785a00] border border-[#ebdcc8] hover:bg-[#f8ecdb]'
                }`}
                title={label}
              >
                Topic {topicNum} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* No results fallback */}
      {!current ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#d3c5ab] text-[#817660]">
          {isFr
            ? 'Aucun exercice ne correspond aux filtres sélectionnés.'
            : 'No exercises match the selected filters.'}
        </div>
      ) : (
        /* Main Challenge Card */
        <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-3.5 bg-[#fdf8f0] border-b border-[#ebdcc8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  getExamBadge(current.topicNumber).style
                }`}
              >
                {getExamBadge(current.topicNumber).label}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                Obj {current.objectiveId}
              </span>
              <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#817660]">
                {currentIndex + 1} / {filteredChallenges.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded-md border border-[#d3c5ab] hover:bg-[#ebdcc8]/50 text-[#4f4632] cursor-pointer"
                  title="Précédent"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded-md border border-[#d3c5ab] hover:bg-[#ebdcc8]/50 text-[#4f4632] cursor-pointer"
                  title="Suivant"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
                {completedIds.has(current.id) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {isFr ? 'Maîtrisé' : 'Mastered'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#60553e] leading-relaxed">{description}</p>
            </div>

            {/* Interactive Steps List */}
            <div className="space-y-2.5">
              {currentSteps.map((step, idx) => {
                const isMatch = hasSubmitted && step.id === current.steps[idx].id;
                const isMismatch = hasSubmitted && step.id !== current.steps[idx].id;

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isMatch
                        ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]'
                        : isMismatch
                        ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828]'
                        : 'bg-[#fffcf7] border-[#d3c5ab] text-[#201b11]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isMatch
                            ? 'bg-[#2e7d32] text-white'
                            : isMismatch
                            ? 'bg-[#d32f2f] text-white'
                            : 'bg-[#ebdcc8] text-[#785a00]'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <div className="text-xs font-bold">
                          {isFr && step.labelFr ? step.labelFr : step.label}
                        </div>
                        <div className="text-[11px] opacity-80 mt-0.5">
                          {isFr && step.detailFr ? step.detailFr : step.detail}
                        </div>
                      </div>
                    </div>

                    {/* Ordering Buttons */}
                    {!hasSubmitted && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          className="p-1.5 rounded-lg border border-[#d3c5ab] bg-white hover:bg-[#f8ecdb] disabled:opacity-30 disabled:cursor-not-allowed text-[#4f4632] cursor-pointer"
                          title="Monter"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === currentSteps.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          className="p-1.5 rounded-lg border border-[#d3c5ab] bg-white hover:bg-[#f8ecdb] disabled:opacity-30 disabled:cursor-not-allowed text-[#4f4632] cursor-pointer"
                          title="Descendre"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {hasSubmitted && (
                      <div className="shrink-0">
                        {isMatch ? (
                          <CheckCircle2 className="w-5 h-5 text-[#2e7d32]" />
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                            {isFr
                              ? `Position correcte: #${current.steps.findIndex((s) => s.id === step.id) + 1}`
                              : `Correct position: #${current.steps.findIndex((s) => s.id === step.id) + 1}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Validation Action or Results */}
            {!hasSubmitted ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Mélanger à nouveau' : 'Shuffle'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleValidate}
                  className="px-6 py-2.5 bg-[#785a00] hover:bg-[#5f4700] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {isFr ? 'Vérifier l\'ordonnancement' : 'Check Order'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
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
                          ? 'Ordre exact ! Félicitations.'
                          : 'Perfect order! Well done.'
                        : isFr
                        ? 'L\'ordre n\'est pas tout à fait correct.'
                        : 'Not quite the right order.'}
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{explanation}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Réessayer' : 'Try Again'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-[#785a00] hover:bg-[#5f4700] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>{isFr ? 'Exercice suivant' : 'Next Exercise'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
