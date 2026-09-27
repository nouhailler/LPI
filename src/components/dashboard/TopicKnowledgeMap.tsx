import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Treemap,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  Network,
  Radar as RadarIcon,
  BarChart2,
  LayoutGrid,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Zap,
  Terminal,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  ExternalLink,
  Target,
  RefreshCw,
} from 'lucide-react';
import { lpicTopicsData } from '../../data/lpicObjectivesData';
import { LPICObjective, LPICTopic } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { InfoTooltip } from '../InfoTooltip';

// Relationship definition between LPI objectives
export interface ObjectiveRelationship {
  sourceId: string;
  targetId: string;
  type: 'prerequisite' | 'extension' | 'operational' | 'security';
  descriptionFr: string;
  descriptionEn: string;
}

// Canonical prerequisite & relationship web for LPIC objectives
export const OBJECTIVE_RELATIONSHIPS: ObjectiveRelationship[] = [
  // Foundations: 101.1 Hardware -> Storage 104.1 & System Time 108.1
  {
    sourceId: '101.1',
    targetId: '104.1',
    type: 'prerequisite',
    descriptionFr: 'La découverte du matériel (lsblk, lspci) conditionne le partitionnement (fdisk, parted)',
    descriptionEn: 'Hardware discovery (lsblk, lspci) is prerequisite to disk partitioning (fdisk, parted)',
  },
  {
    sourceId: '101.1',
    targetId: '108.1',
    type: 'operational',
    descriptionFr: 'L\'horloge matérielle (hwclock) est liée à l\'architecture machine',
    descriptionEn: 'Hardware clock (hwclock) ties to machine architecture',
  },
  // 101.2 Boot the system -> 101.3 Runlevels / systemd targets & 108.2 Journald
  {
    sourceId: '101.2',
    targetId: '101.3',
    type: 'prerequisite',
    descriptionFr: 'Le cycle de boot mène aux cibles systemd (multi-user, graphical)',
    descriptionEn: 'Boot cycle transitions directly into systemd targets',
  },
  {
    sourceId: '101.2',
    targetId: '108.2',
    type: 'operational',
    descriptionFr: 'L\'analyse du démarrage s\'effectue via journalctl et dmesg',
    descriptionEn: 'Boot inspection requires journalctl and kernel ring buffer dmesg',
  },
  // 102.1 Disk layout -> 102.2 Boot manager & 104.1 Filesystem creation
  {
    sourceId: '102.1',
    targetId: '102.2',
    type: 'prerequisite',
    descriptionFr: 'La table de partitions (MBR/GPT) héberge les chargeurs GRUB/EFI',
    descriptionEn: 'Disk partition table (MBR/GPT) houses GRUB/EFI bootloader',
  },
  {
    sourceId: '102.1',
    targetId: '104.1',
    type: 'prerequisite',
    descriptionFr: 'Le plan de disques définit les futures partitions ext4/xfs',
    descriptionEn: 'Disk layout defines target ext4/xfs partitions',
  },
  // 102.3 Shared libraries -> 102.4 / 102.5 Packages
  {
    sourceId: '102.3',
    targetId: '102.4',
    type: 'extension',
    descriptionFr: 'ldd et ldconfig valident les dépendances d\'exécutables des paquets Debian',
    descriptionEn: 'ldd and ldconfig validate binary dependencies in Debian packages',
  },
  {
    sourceId: '102.3',
    targetId: '102.5',
    type: 'extension',
    descriptionFr: 'Les bibliothèques partagées soignent les dépendances RPM',
    descriptionEn: 'Shared libraries resolve native RPM package dependencies',
  },
  // 103.1 CLI -> 103.2 Text filters & 103.3 File management & 105.1 Shell Env
  {
    sourceId: '103.1',
    targetId: '103.2',
    type: 'prerequisite',
    descriptionFr: 'La maîtrise du shell précède les filtres de flux (grep, sed, awk)',
    descriptionEn: 'Shell mastery is essential before manipulating streams (grep, sed, awk)',
  },
  {
    sourceId: '103.1',
    targetId: '103.3',
    type: 'prerequisite',
    descriptionFr: 'Les commandes de base pilotent la manipulation de fichiers (cp, mv, tar)',
    descriptionEn: 'Base commands drive fundamental file manipulation (cp, mv, tar)',
  },
  {
    sourceId: '103.1',
    targetId: '105.1',
    type: 'prerequisite',
    descriptionFr: 'La navigation CLI permet de personnaliser .bashrc et l\'environnement',
    descriptionEn: 'CLI proficiency leads to customizing .bashrc and environment',
  },
  // 103.2 Filters & 103.4 Pipes -> 105.2 Shell scripting
  {
    sourceId: '103.2',
    targetId: '103.4',
    type: 'operational',
    descriptionFr: 'Les filtres textuels s\'assemblent via les tubes (pipes | et redirections)',
    descriptionEn: 'Text filters combine through pipes (|) and I/O redirections',
  },
  {
    sourceId: '103.4',
    targetId: '105.2',
    type: 'prerequisite',
    descriptionFr: 'Pipes et redirections constituent l\'ossature des scripts Bash',
    descriptionEn: 'Pipes and redirections form the core of automated Bash scripts',
  },
  // 103.5 Process management -> 107.2 Automation & 108.2 Logging
  {
    sourceId: '103.5',
    targetId: '107.2',
    type: 'operational',
    descriptionFr: 'La surveillance de processus (ps, top) alimente la planification cron',
    descriptionEn: 'Process monitoring (ps, top) feeds automated cron jobs',
  },
  {
    sourceId: '103.5',
    targetId: '108.2',
    type: 'operational',
    descriptionFr: 'Les démons en arrière-plan transmettent leurs états aux journaux rsyslog',
    descriptionEn: 'Background daemons report runtime events to rsyslog/journald',
  },
  // 104.1 Filesystem -> 104.2 Integrity & 104.3 Mounting
  {
    sourceId: '104.1',
    targetId: '104.2',
    type: 'prerequisite',
    descriptionFr: 'Un système de fichiers créé doit être vérifié (fsck, tune2fs)',
    descriptionEn: 'Created filesystems require regular integrity checks (fsck, tune2fs)',
  },
  {
    sourceId: '104.1',
    targetId: '104.3',
    type: 'prerequisite',
    descriptionFr: 'Monter un volume (/etc/fstab, mount) exige un système de fichiers valide',
    descriptionEn: 'Mounting (/etc/fstab, mount) necessitates a formatted filesystem',
  },
  // 104.5 Permissions & Ownership -> 107.1 Users/Groups & 110.1 Security Admin
  {
    sourceId: '104.5',
    targetId: '107.1',
    type: 'prerequisite',
    descriptionFr: 'Les droits rwx/chown s\'appliquent directement aux comptes utilisateurs',
    descriptionEn: 'rwx/chown permissions apply directly to user and group accounts',
  },
  {
    sourceId: '104.5',
    targetId: '110.1',
    type: 'security',
    descriptionFr: 'Les bits spéciaux SUID/SGID et Sticky sont cruciaux pour l\'audit de sécurité',
    descriptionEn: 'SUID/SGID and Sticky bits are critical for security administration',
  },
  {
    sourceId: '104.5',
    targetId: '110.3',
    type: 'security',
    descriptionFr: 'Les clés SSH (~/.ssh) requièrent impérativement des permissions 600/700',
    descriptionEn: 'SSH keys (~/.ssh) strictly demand 600/700 permissions to operate',
  },
  // 107.1 Users/Groups -> 110.1 Security Admin (sudo/su)
  {
    sourceId: '107.1',
    targetId: '110.1',
    type: 'security',
    descriptionFr: 'La gestion des comptes (/etc/passwd, shadow) sert de base aux droits sudo',
    descriptionEn: 'Account management (/etc/passwd, shadow) grounds sudo privileges',
  },
  // 109.1 Networking fundamentals -> 109.2 Config & 109.3 Troubleshooting & 110.2 Host Security
  {
    sourceId: '109.1',
    targetId: '109.2',
    type: 'prerequisite',
    descriptionFr: 'Masques CIDR et routage sont indispensables pour configurer IP et interfaces',
    descriptionEn: 'CIDR masks and routing are mandatory to configure IP and interfaces',
  },
  {
    sourceId: '109.1',
    targetId: '109.3',
    type: 'prerequisite',
    descriptionFr: 'Les ports TCP/UDP (ss, netstat, ping) guident le diagnostic réseau',
    descriptionEn: 'TCP/UDP ports (ss, netstat, ping) guide active network diagnostics',
  },
  {
    sourceId: '109.1',
    targetId: '110.2',
    type: 'security',
    descriptionFr: 'La topologie réseau dicte les règles de pare-feu et ports ouverts',
    descriptionEn: 'Network topology dictates firewall packet filtering and open ports',
  },
  {
    sourceId: '109.3',
    targetId: '110.3',
    type: 'operational',
    descriptionFr: 'La connectivité SSH (port 22) s\'appuie sur la résolution réseau',
    descriptionEn: 'SSH connectivity (port 22) relies on verified network routing',
  },
];

interface TopicKnowledgeMapProps {
  masteredObjectiveIds: string[];
  onToggleMasteredObjective?: (objectiveId: string) => void;
  onOpenLearning?: (topicId?: string) => void;
  onStartExam?: (examId: string) => void;
  onNavigateToTraining?: () => void;
}

export const TopicKnowledgeMap: React.FC<TopicKnowledgeMapProps> = ({
  masteredObjectiveIds,
  onToggleMasteredObjective,
  onOpenLearning,
  onStartExam,
  onNavigateToTraining,
}) => {
  const { isFrench } = useLanguage();

  // Active view mode: 'radar' | 'network' | 'matrix' | 'treemap'
  const [viewMode, setViewMode] = useState<'radar' | 'network' | 'matrix' | 'treemap'>('radar');

  // Exam scope filter: 'all-lpic1' | 'exam-101' | 'exam-102' | 'all'
  const [examFilter, setExamFilter] = useState<'all-lpic1' | 'exam-101' | 'exam-102' | 'all'>('all-lpic1');

  // Selected objective for inspector drawer
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>('104.5');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter: 'all' | 'mastered' | 'unmastered'
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');

  // Filter topics according to selected exam scope
  const filteredTopics = useMemo(() => {
    return lpicTopicsData.filter((topic) => {
      if (examFilter === 'exam-101') return topic.examId === 'exam-101';
      if (examFilter === 'exam-102') return topic.examId === 'exam-102';
      if (examFilter === 'all-lpic1') {
        return (
          topic.topicNumber &&
          topic.topicNumber >= 101 &&
          topic.topicNumber <= 110
        );
      }
      return true;
    });
  }, [examFilter]);

  // Flattened objectives with enrichment
  const allObjectivesWithMeta = useMemo(() => {
    const list: Array<{
      objective: LPICObjective;
      topic: LPICTopic;
      isMastered: boolean;
      score: number;
      relationshipsCount: number;
    }> = [];

    filteredTopics.forEach((topic) => {
      topic.objectives.forEach((obj) => {
        const isMastered = masteredObjectiveIds.includes(obj.id);
        const rels = OBJECTIVE_RELATIONSHIPS.filter(
          (r) => r.sourceId === obj.id || r.targetId === obj.id
        );

        list.push({
          objective: obj,
          topic,
          isMastered,
          score: isMastered ? 100 : 0,
          relationshipsCount: rels.length,
        });
      });
    });

    return list;
  }, [filteredTopics, masteredObjectiveIds]);

  // Filtered objectives for search & status
  const displayedObjectives = useMemo(() => {
    return allObjectivesWithMeta.filter(({ objective, topic, isMastered }) => {
      if (statusFilter === 'mastered' && !isMastered) return false;
      if (statusFilter === 'unmastered' && isMastered) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchId = objective.id.toLowerCase().includes(q);
      const matchTitle = objective.title.toLowerCase().includes(q);
      const matchTopic = topic.title.toLowerCase().includes(q);
      const matchCommands = objective.keyCommands.some((c) =>
        c.command.toLowerCase().includes(q)
      );

      return matchId || matchTitle || matchTopic || matchCommands;
    });
  }, [allObjectivesWithMeta, statusFilter, searchQuery]);

  // Currently inspected objective details
  const inspectedData = useMemo(() => {
    if (!selectedObjectiveId) return null;
    for (const topic of lpicTopicsData) {
      const found = topic.objectives.find((o) => o.id === selectedObjectiveId);
      if (found) {
        const isMastered = masteredObjectiveIds.includes(found.id);
        const prerequisites = OBJECTIVE_RELATIONSHIPS.filter(
          (r) => r.targetId === found.id
        );
        const dependents = OBJECTIVE_RELATIONSHIPS.filter(
          (r) => r.sourceId === found.id
        );
        return {
          objective: found,
          topic,
          isMastered,
          prerequisites,
          dependents,
        };
      }
    }
    return null;
  }, [selectedObjectiveId, masteredObjectiveIds]);

  // Aggregate Metrics for Radar Chart
  const radarChartData = useMemo(() => {
    return filteredTopics.map((topic) => {
      const totalObjs = topic.objectives.length;
      const masteredCount = topic.objectives.filter((o) =>
        masteredObjectiveIds.includes(o.id)
      ).length;
      const masteryPct = totalObjs > 0 ? Math.round((masteredCount / totalObjs) * 100) : 0;
      
      // Normalized weight benchmark (max topic weight is ~11)
      const benchmarkWeightPct = Math.min(100, Math.round((topic.totalWeight / 11) * 100));

      return {
        topicKey: `T${topic.topicNumber}`,
        topicTitle: topic.title,
        shortName: isFrench
          ? `T${topic.topicNumber} ${topic.title.split(' ')[0]}`
          : `T${topic.topicNumber} ${topic.title.split(' ')[0]}`,
        fullName: `Thème ${topic.topicNumber}: ${topic.title}`,
        totalWeight: topic.totalWeight,
        objectivesCount: totalObjs,
        masteredCount,
        masteryPct,
        targetPct: benchmarkWeightPct,
        examId: topic.examId,
      };
    });
  }, [filteredTopics, masteredObjectiveIds, isFrench]);

  // Aggregated Bar Matrix Data
  const barChartData = useMemo(() => {
    return filteredTopics.map((topic) => {
      const totalWeight = topic.totalWeight;
      const masteredWeight = topic.objectives.reduce((acc, obj) => {
        return masteredObjectiveIds.includes(obj.id) ? acc + obj.weight : acc;
      }, 0);
      const remainingWeight = Math.max(0, totalWeight - masteredWeight);
      const masteryPct = totalWeight > 0 ? Math.round((masteredWeight / totalWeight) * 100) : 0;

      return {
        name: `T${topic.topicNumber}`,
        fullName: topic.title,
        masteredWeight,
        remainingWeight,
        totalWeight,
        masteryPct,
        topicId: topic.id,
      };
    });
  }, [filteredTopics, masteredObjectiveIds]);

  // Treemap Data Structure
  const treemapData = useMemo(() => {
    return [
      {
        name: 'LPIC Objectives',
        children: filteredTopics.map((topic) => {
          return {
            name: `T${topic.topicNumber} - ${topic.title}`,
            topicNumber: topic.topicNumber,
            children: topic.objectives.map((obj) => {
              const isMastered = masteredObjectiveIds.includes(obj.id);
              return {
                name: `${obj.id} ${obj.title.slice(0, 20)}...`,
                fullName: obj.title,
                id: obj.id,
                size: obj.weight * 10,
                weight: obj.weight,
                isMastered,
                fill: isMastered ? '#22c55e' : '#f59e0b',
              };
            }),
          };
        }),
      },
    ];
  }, [filteredTopics, masteredObjectiveIds]);

  // Network / Node Coordinates for the Relationship Map
  const networkNodes = useMemo(() => {
    // 4 Functional tiers for clear visual layout
    // Tier 1: Hardware & Low Level (101.1, 101.2, 101.3, 102.1, 102.2)
    // Tier 2: CLI & Filesystems (103.1 - 103.4, 104.1 - 104.7)
    // Tier 3: Shells, Admin & Daemons (105.1 - 105.2, 107.1 - 107.2, 108.1 - 108.2)
    // Tier 4: Networking & Host Security (109.1 - 109.4, 110.1 - 110.3)

    const keyObjectiveIds = [
      '101.1', '101.2', '101.3', '102.1', '102.3',
      '103.1', '103.2', '103.4', '103.5',
      '104.1', '104.2', '104.3', '104.5',
      '105.1', '105.2',
      '107.1', '107.2',
      '108.1', '108.2',
      '109.1', '109.2', '109.3',
      '110.1', '110.2', '110.3',
    ];

    const nodesMap: Record<string, { x: number; y: number; tier: number }> = {
      // Tier 1: System Foundations (X: 50 to 220)
      '101.1': { x: 70, y: 70, tier: 1 },
      '101.2': { x: 70, y: 170, tier: 1 },
      '101.3': { x: 70, y: 270, tier: 1 },
      '102.1': { x: 190, y: 110, tier: 1 },
      '102.3': { x: 190, y: 230, tier: 1 },

      // Tier 2: GNU CLI, Storage & Permissions (X: 330 to 480)
      '103.1': { x: 330, y: 70, tier: 2 },
      '103.2': { x: 330, y: 170, tier: 2 },
      '103.4': { x: 330, y: 270, tier: 2 },
      '103.5': { x: 330, y: 360, tier: 2 },
      '104.1': { x: 470, y: 90, tier: 2 },
      '104.2': { x: 470, y: 180, tier: 2 },
      '104.3': { x: 470, y: 270, tier: 2 },
      '104.5': { x: 470, y: 360, tier: 2 },

      // Tier 3: Shells, Admin Tasks & System Services (X: 610 to 740)
      '105.1': { x: 610, y: 80, tier: 3 },
      '105.2': { x: 610, y: 180, tier: 3 },
      '107.1': { x: 610, y: 290, tier: 3 },
      '107.2': { x: 610, y: 380, tier: 3 },
      '108.1': { x: 740, y: 120, tier: 3 },
      '108.2': { x: 740, y: 250, tier: 3 },

      // Tier 4: Networking & Security Perimeter (X: 860 to 970)
      '109.1': { x: 870, y: 80, tier: 4 },
      '109.2': { x: 870, y: 180, tier: 4 },
      '109.3': { x: 870, y: 280, tier: 4 },
      '110.1': { x: 970, y: 130, tier: 4 },
      '110.2': { x: 970, y: 240, tier: 4 },
      '110.3': { x: 970, y: 350, tier: 4 },
    };

    return keyObjectiveIds.map((id) => {
      let title = id;
      let weight = 2;
      for (const t of lpicTopicsData) {
        const found = t.objectives.find((o) => o.id === id);
        if (found) {
          title = found.title;
          weight = found.weight;
          break;
        }
      }
      const coords = nodesMap[id] || { x: 100, y: 100, tier: 1 };
      const isMastered = masteredObjectiveIds.includes(id);

      return {
        id,
        title,
        weight,
        x: coords.x,
        y: coords.y,
        tier: coords.tier,
        isMastered,
      };
    });
  }, [masteredObjectiveIds]);

  // KPIs
  const totalTracked = allObjectivesWithMeta.length;
  const totalMastered = allObjectivesWithMeta.filter((o) => o.isMastered).length;
  const masteryPercentage = totalTracked > 0 ? Math.round((totalMastered / totalTracked) * 100) : 0;
  
  // Weight-weighted readiness score (LPI 500/800 scale)
  const totalExamWeight = allObjectivesWithMeta.reduce((acc, curr) => acc + curr.objective.weight, 0);
  const masteredExamWeight = allObjectivesWithMeta.reduce((acc, curr) => curr.isMastered ? acc + curr.objective.weight : acc, 0);
  const estimatedLpiScore = totalExamWeight > 0 ? Math.round(200 + (masteredExamWeight / totalExamWeight) * 600) : 200;

  // Handler to toggle objective mastery
  const handleToggleMastery = (objId: string) => {
    if (onToggleMasteredObjective) {
      onToggleMasteredObjective(objId);
      return;
    }
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      let arr: string[] = saved ? JSON.parse(saved) : [];
      if (arr.includes(objId)) {
        arr = arr.filter((x) => x !== objId);
      } else {
        arr.push(objId);
      }
      localStorage.setItem('lpic_mastered_objectives', JSON.stringify(arr));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  return (
    <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-6">
      {/* 1. Header with Badge & Scope Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#ebdcc8] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-[#ffc20e] text-[#6d5100] text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
              <Network className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Cartographie des Connaissances' : 'Topic Knowledge Map'}</span>
            </span>
            <span className="text-xs text-[#817660] font-mono">
              LPIC-1 / LPIC-2 Curriculum
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-serif text-[#201b11] flex items-center gap-2">
            <span>{isFrench ? 'Arborescence des Objectifs & Maîtrise LPI' : 'LPI Objectives Relationship & Mastery Matrix'}</span>
          </h3>
          <p className="text-xs md:text-sm text-[#4f4632] max-w-2xl leading-relaxed">
            {isFrench
              ? 'Visualisez en temps réel les interdépendances logiques entre architecture, commandes CLI, stockage, scripts, réseaux et sécurité pour identifier vos zones de force et vos priorités d\'examen.'
              : 'Visualize live prerequisite relationships between Linux architecture, CLI streams, storage, scripts, networking, and security to pinpoint competencies and study gaps.'}
          </p>
        </div>

        {/* Action Toggles: Exam Scope & View Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {/* Exam Filter Selector */}
          <div className="inline-flex rounded-xl bg-[#f8ecdb] p-1 border border-[#d3c5ab]">
            <button
              onClick={() => setExamFilter('all-lpic1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                examFilter === 'all-lpic1'
                  ? 'bg-white text-[#785a00] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              LPIC-1 (101+102)
            </button>
            <button
              onClick={() => setExamFilter('exam-101')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                examFilter === 'exam-101'
                  ? 'bg-white text-[#785a00] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              Exam 101
            </button>
            <button
              onClick={() => setExamFilter('exam-102')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                examFilter === 'exam-102'
                  ? 'bg-white text-[#785a00] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              Exam 102
            </button>
          </div>

          {/* Visualization Modes */}
          <div className="inline-flex rounded-xl bg-[#f8ecdb] p-1 border border-[#d3c5ab]">
            <button
              onClick={() => setViewMode('radar')}
              title={isFrench ? 'Vue Radar des Domaines' : 'Domain Radar View'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'radar'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              <RadarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Radar</span>
            </button>
            <button
              onClick={() => setViewMode('network')}
              title={isFrench ? 'Graphe de Dépendances' : 'Dependency Graph'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'network'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Graphe</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              title={isFrench ? 'Barres de Poids' : 'Weight Bars'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Barres</span>
            </button>
            <button
              onClick={() => setViewMode('treemap')}
              title={isFrench ? 'Treemap des Poids' : 'Treemap Impact'}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'treemap'
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:text-[#201b11]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Treemap</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Ribbons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#ebdcc8]">
          <span className="text-[10px] uppercase font-bold text-[#817660] block tracking-wider">
            {isFrench ? 'Objectifs Suivis' : 'Tracked Objectives'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#201b11]">
              {totalTracked}
            </span>
            <span className="text-xs text-[#817660]">
              {filteredTopics.length} {isFrench ? 'thèmes' : 'topics'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#ebdcc8]">
          <span className="text-[10px] uppercase font-bold text-[#817660] block tracking-wider">
            {isFrench ? 'Objectifs Maîtrisés' : 'Mastered Objectives'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              {totalMastered}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              ({masteryPercentage}%)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fdfaf5] border border-[#ebdcc8]">
          <span className="text-[10px] uppercase font-bold text-[#817660] block tracking-wider">
            {isFrench ? 'Poids Validé' : 'Mastered Weight'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#785a00]">
              {masteredExamWeight}
            </span>
            <span className="text-xs text-[#817660]">
              / {totalExamWeight} pts
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fff8f2] border border-[#ffc20e]">
          <span className="text-[10px] uppercase font-bold text-[#785a00] block tracking-wider">
            {isFrench ? 'Indice Prévisionnel LPI' : 'Predicted LPI Score'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono ${estimatedLpiScore >= 500 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {estimatedLpiScore}
            </span>
            <span className="text-xs text-[#817660]">
              / 800 ({isFrench ? 'Seuil 500' : 'Pass 500'})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Visualization + Objective Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Chart Area (7 or 8 columns) */}
        <div className="lg:col-span-8 bg-[#fdfaf5] border border-[#ebdcc8] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[460px]">
          {/* Chart Header */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc20e]" />
              <h4 className="font-bold text-sm text-[#201b11]">
                {viewMode === 'radar' && (isFrench ? 'Équilibre des Domaines LPI (Votre Maîtrise vs Cible)' : 'Domain Balance (Mastery vs Exam Target)')}
                {viewMode === 'network' && (isFrench ? 'Graphe de Dépendances & Cheminements d\'Apprentissage' : 'Objective Prerequisite & Dependency Web')}
                {viewMode === 'matrix' && (isFrench ? 'Pondération Officielle & Points Validés par Thème' : 'Official Weight vs Mastered Points by Topic')}
                {viewMode === 'treemap' && (isFrench ? 'Treemap Proportionnel : Poids & Couverture' : 'Proportional Treemap: Exam Weights & Coverage')}
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#817660]">
              {viewMode === 'radar' && (
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    {isFrench ? 'Votre Maîtrise' : 'Your Mastery'}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#817660]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ebdcc8] border border-[#817660] inline-block" />
                    {isFrench ? 'Cible Examen' : 'Target Baseline'}
                  </span>
                </div>
              )}
              {viewMode === 'network' && (
                <span className="text-[11px] text-[#785a00] font-semibold">
                  {isFrench ? 'Cliquez sur un nœud pour inspecter' : 'Click a node to inspect'}
                </span>
              )}
            </div>
          </div>

          {/* VIEW MODE 1: RADAR CHART */}
          {viewMode === 'radar' && (
            <div className="w-full h-[380px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData} outerRadius="75%">
                  <PolarGrid stroke="#ebdcc8" />
                  <PolarAngleAxis
                    dataKey="shortName"
                    tick={{ fill: '#4f4632', fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#d3c5ab"
                    tick={{ fill: '#817660', fontSize: 9 }}
                  />
                  <Radar
                    name={isFrench ? 'Cible Examen' : 'Exam Target'}
                    dataKey="targetPct"
                    stroke="#817660"
                    fill="#ebdcc8"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name={isFrench ? 'Votre Maîtrise' : 'Your Mastery'}
                    dataKey="masteryPct"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.45}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-[#d3c5ab] shadow-md text-xs space-y-1">
                          <p className="font-bold text-sm text-[#201b11]">{d.fullName}</p>
                          <p className="text-[#817660] font-mono">
                            {isFrench ? 'Poids officiel' : 'Official Weight'} : <strong>{d.totalWeight}</strong> • {d.objectivesCount} {isFrench ? 'objectifs' : 'objectives'}
                          </p>
                          <div className="pt-1.5 border-t border-[#ebdcc8] space-y-0.5">
                            <div className="flex justify-between gap-3 text-emerald-700 font-bold">
                              <span>{isFrench ? 'Maîtrise' : 'Mastery'}:</span>
                              <span>{d.masteryPct}% ({d.masteredCount}/{d.objectivesCount})</span>
                            </div>
                            <div className="flex justify-between gap-3 text-[#817660]">
                              <span>{isFrench ? 'Cible requise' : 'Exam Target'}:</span>
                              <span>{d.targetPct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* VIEW MODE 2: INTERACTIVE DEPENDENCY NETWORK GRAPH */}
          {viewMode === 'network' && (
            <div className="w-full h-[400px] relative overflow-x-auto overflow-y-hidden border border-[#ebdcc8] rounded-xl bg-[#fffdfa] p-2">
              <svg
                viewBox="0 0 1040 420"
                className="w-full h-full min-w-[700px] select-none"
              >
                {/* Visual Background Tier Bands */}
                <rect x="20" y="20" width="220" height="380" rx="12" fill="#f8ecdb" fillOpacity="0.4" />
                <text x="35" y="45" fill="#785a00" fontSize="10" fontWeight="bold" letterSpacing="1">
                  TIER 1 · ARCHITECTURE & BOOT
                </text>

                <rect x="280" y="20" width="240" height="380" rx="12" fill="#f8ecdb" fillOpacity="0.4" />
                <text x="295" y="45" fill="#785a00" fontSize="10" fontWeight="bold" letterSpacing="1">
                  TIER 2 · GNU CLI & STORAGE
                </text>

                <rect x="560" y="20" width="230" height="380" rx="12" fill="#f8ecdb" fillOpacity="0.4" />
                <text x="575" y="45" fill="#785a00" fontSize="10" fontWeight="bold" letterSpacing="1">
                  TIER 3 · SCRIPTS & ADMIN
                </text>

                <rect x="830" y="20" width="190" height="380" rx="12" fill="#f8ecdb" fillOpacity="0.4" />
                <text x="845" y="45" fill="#785a00" fontSize="10" fontWeight="bold" letterSpacing="1">
                  TIER 4 · NETWORK & SECURITY
                </text>

                {/* Relationship Connectors */}
                {OBJECTIVE_RELATIONSHIPS.map((rel, idx) => {
                  const s = networkNodes.find((n) => n.id === rel.sourceId);
                  const t = networkNodes.find((n) => n.id === rel.targetId);
                  if (!s || !t) return null;

                  const isSourceSelected = selectedObjectiveId === s.id;
                  const isTargetSelected = selectedObjectiveId === t.id;
                  const isHighlighted = isSourceSelected || isTargetSelected;

                  const strokeColor = isHighlighted
                    ? isSourceSelected ? '#10b981' : '#f59e0b'
                    : '#d3c5ab';

                  const strokeWidth = isHighlighted ? 2.5 : 1.2;
                  const strokeDasharray = rel.type === 'operational' ? '4 3' : 'none';

                  // Calculate curved bezier line
                  const dx = t.x - s.x;
                  const cx1 = s.x + dx * 0.5;
                  const cy1 = s.y;
                  const cx2 = s.x + dx * 0.5;
                  const cy2 = t.y;

                  return (
                    <g key={idx}>
                      <path
                        d={`M ${s.x} ${s.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${t.x} ${t.y}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeOpacity={isHighlighted ? 0.95 : 0.45}
                      />
                    </g>
                  );
                })}

                {/* Nodes */}
                {networkNodes.map((node) => {
                  const isSelected = selectedObjectiveId === node.id;
                  const radius = 12 + node.weight * 2.5;

                  let fillColor = '#ffffff';
                  let strokeColor = '#d3c5ab';
                  let textColor = '#201b11';

                  if (node.isMastered) {
                    fillColor = '#10b981';
                    strokeColor = '#059669';
                    textColor = '#ffffff';
                  } else {
                    fillColor = '#ffffff';
                    strokeColor = '#f59e0b';
                    textColor = '#785a00';
                  }

                  if (isSelected) {
                    strokeColor = '#ffc20e';
                  }

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedObjectiveId(node.id)}
                    >
                      {/* Outer pulse when selected */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius + 6}
                          fill="none"
                          stroke="#ffc20e"
                          strokeWidth="3"
                          strokeDasharray="4 2"
                          className="animate-pulse"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-colors"
                      />

                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize={node.id.length > 4 ? '9' : '10'}
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {node.id}
                      </text>

                      {/* Weight pill badge below */}
                      <rect
                        x={node.x - 10}
                        y={node.y + radius + 2}
                        width="20"
                        height="11"
                        rx="4"
                        fill="#ebdcc8"
                      />
                      <text
                        x={node.x}
                        y={node.y + radius + 10}
                        textAnchor="middle"
                        fill="#785a00"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        P{node.weight}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* VIEW MODE 3: WEIGHT BAR CHART MATRIX */}
          {viewMode === 'matrix' && (
            <div className="w-full h-[380px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fill: '#4f4632', fontSize: 11, fontWeight: 700 }} />
                  <YAxis tick={{ fill: '#817660', fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-[#d3c5ab] shadow-md text-xs space-y-1">
                          <p className="font-bold text-sm text-[#201b11]">{d.name}: {d.fullName}</p>
                          <div className="pt-1.5 border-t border-[#ebdcc8] space-y-0.5">
                            <div className="flex justify-between gap-4 text-emerald-700 font-bold">
                              <span>{isFrench ? 'Points validés' : 'Mastered Points'}:</span>
                              <span>{d.masteredWeight} pts</span>
                            </div>
                            <div className="flex justify-between gap-4 text-amber-700">
                              <span>{isFrench ? 'Restant à valider' : 'Remaining'}:</span>
                              <span>{d.remainingWeight} pts</span>
                            </div>
                            <div className="flex justify-between gap-4 text-[#785a00] font-bold pt-1 border-t border-dashed border-[#ebdcc8]">
                              <span>{isFrench ? 'Taux d\'accomplissement' : 'Completion'}:</span>
                              <span>{d.masteryPct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="masteredWeight"
                    name={isFrench ? 'Poids validé (pts)' : 'Mastered Weight'}
                    stackId="a"
                    fill="#10b981"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="remainingWeight"
                    name={isFrench ? 'Poids restant (pts)' : 'Remaining Weight'}
                    stackId="a"
                    fill="#ebdcc8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* VIEW MODE 4: TREEMAP */}
          {viewMode === 'treemap' && (
            <div className="w-full h-[380px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  stroke="#ffffff"
                  fill="#ffc20e"
                  content={<CustomTreemapContent onSelect={setSelectedObjectiveId} />}
                />
              </ResponsiveContainer>
            </div>
          )}

          {/* Chart Footer Helper */}
          <div className="pt-3 border-t border-[#ebdcc8] flex flex-wrap items-center justify-between text-xs text-[#817660] gap-2 mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>{isFrench ? 'Maîtrisé (100%)' : 'Mastered'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span>{isFrench ? 'À réviser / Priorité' : 'Needs practice'}</span>
              </span>
            </div>
            <span className="font-mono text-[11px]">
              {isFrench ? 'Cliquez sur n\'importe quel objectif pour révéler ses relations' : 'Click any objective to reveal prerequisite links'}
            </span>
          </div>
        </div>

        {/* Right Objective Inspector Drawer (4 or 5 columns) */}
        <div className="lg:col-span-4 bg-[#fdfaf5] border border-[#ebdcc8] rounded-2xl p-4 md:p-5 flex flex-col justify-between min-h-[460px]">
          {inspectedData ? (
            <div className="space-y-4">
              {/* Header with Objective ID & Status */}
              <div className="flex items-start justify-between gap-2 border-b border-[#ebdcc8] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#785a00] text-white text-[11px] font-bold font-mono rounded">
                      {inspectedData.objective.id}
                    </span>
                    <span className="text-xs font-bold text-[#785a00]">
                      {isFrench ? 'Poids officiel' : 'Weight'}: {inspectedData.objective.weight}
                    </span>
                    <span className="text-[10px] text-[#817660] font-mono">
                      {inspectedData.topic.examId === 'exam-102' ? '102-500' : '101-500'}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#201b11] mt-1.5 leading-snug">
                    {inspectedData.objective.title}
                  </h4>
                  <p className="text-xs text-[#817660] mt-0.5">
                    Thème {inspectedData.topic.topicNumber}: {inspectedData.topic.title}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleMastery(inspectedData.objective.id)}
                  title={inspectedData.isMastered ? (isFrench ? 'Marquer comme non maîtrisé' : 'Mark unmastered') : (isFrench ? 'Valider la maîtrise' : 'Mark mastered')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    inspectedData.isMastered
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-white border-[#d3c5ab] text-[#817660] hover:text-[#201b11] hover:border-[#ffc20e]'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 ${inspectedData.isMastered ? 'fill-emerald-500 text-white' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#4f4632] leading-relaxed">
                {inspectedData.objective.description}
              </p>

              {/* Prerequisite & Dependent Relationships */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block">
                  {isFrench ? '🔗 Relations & Cheminement' : '🔗 Prerequisites & Flow'}
                </span>

                {/* Prerequisites */}
                {inspectedData.prerequisites.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                      <span>↓ {isFrench ? 'Prérequis recommandés :' : 'Recommended Prerequisites:'}</span>
                    </span>
                    {inspectedData.prerequisites.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedObjectiveId(p.sourceId)}
                        className="p-2 rounded-lg bg-white border border-[#ebdcc8] hover:border-[#ffc20e] cursor-pointer text-xs space-y-0.5 transition-all"
                      >
                        <div className="flex items-center justify-between font-bold text-[#201b11]">
                          <span className="font-mono text-[#785a00]">{p.sourceId}</span>
                          <span className="text-[10px] text-[#817660] font-normal uppercase">
                            {p.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4f4632]">
                          {isFrench ? p.descriptionFr : p.descriptionEn}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#817660] italic">
                    {isFrench ? 'Noyau fondamental (pas de prérequis amont strict).' : 'Core foundation objective (no upstream prerequisite).'}
                  </p>
                )}

                {/* Dependents / Follow-ups */}
                {inspectedData.dependents.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                      <span>↑ {isFrench ? 'Débloque / Conditionne :' : 'Enables / Leads to:'}</span>
                    </span>
                    {inspectedData.dependents.map((d, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedObjectiveId(d.targetId)}
                        className="p-2 rounded-lg bg-white border border-[#ebdcc8] hover:border-[#ffc20e] cursor-pointer text-xs space-y-0.5 transition-all"
                      >
                        <div className="flex items-center justify-between font-bold text-[#201b11]">
                          <span className="font-mono text-[#10b981]">{d.targetId}</span>
                          <span className="text-[10px] text-[#817660] font-normal uppercase">
                            {d.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4f4632]">
                          {isFrench ? d.descriptionFr : d.descriptionEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Commands snippet */}
              {inspectedData.objective.keyCommands.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-[#ebdcc8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#817660] block">
                    {isFrench ? 'Commandes Clés' : 'Key Commands'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedData.objective.keyCommands.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#f8ecdb] text-[#785a00] font-mono text-[10px] font-bold"
                      >
                        {c.command.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#ebdcc8] flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (onOpenLearning) onOpenLearning(inspectedData.topic.id);
                  }}
                  className="w-full py-2 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isFrench ? 'Étudier ce chapitre' : 'Study this Chapter'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onNavigateToTraining) onNavigateToTraining();
                    }}
                    className="py-1.5 px-3 rounded-lg border border-[#d3c5ab] hover:bg-white text-[#4f4632] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#785a00]" />
                    <span>{isFrench ? 'Lab Pratique' : 'Practice Lab'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onStartExam) onStartExam(inspectedData.topic.examId);
                    }}
                    className="py-1.5 px-3 rounded-lg border border-[#d3c5ab] hover:bg-white text-[#4f4632] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5 text-[#785a00]" />
                    <span>{isFrench ? 'Quiz Sujet' : 'Take Quiz'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#817660]">
              <Target className="w-10 h-10 text-[#d3c5ab]" />
              <p className="text-xs">
                {isFrench
                  ? 'Sélectionnez un objectif dans le graphique pour afficher sa fiche de compétences, ses prérequis et ses commandes.'
                  : 'Select an objective from the map to reveal its competency sheet, prerequisites, and key commands.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Search & Filter Bar + Dense Objective Matrix */}
      <div className="pt-2 border-t border-[#ebdcc8] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#201b11]">
              {isFrench ? 'Répertoire exhaustif des objectifs' : 'Complete Objectives Directory'}
            </span>
            <span className="text-[11px] text-[#817660] font-mono">
              ({displayedObjectives.length} / {allObjectivesWithMeta.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#817660] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFrench ? 'Filtrer (id, commande, mot-clé)...' : 'Filter (id, command, keyword)...'}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#d3c5ab] bg-white text-xs text-[#201b11] focus:outline-none focus:border-[#785a00] w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="inline-flex rounded-lg bg-[#f8ecdb] p-0.5 border border-[#d3c5ab] text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  statusFilter === 'all' ? 'bg-white text-[#785a00] shadow-xs' : 'text-[#4f4632]'
                }`}
              >
                {isFrench ? 'Tous' : 'All'}
              </button>
              <button
                onClick={() => setStatusFilter('mastered')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  statusFilter === 'mastered' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#4f4632]'
                }`}
              >
                {isFrench ? 'Maîtrisés' : 'Mastered'}
              </button>
              <button
                onClick={() => setStatusFilter('unmastered')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                  statusFilter === 'unmastered' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#4f4632]'
                }`}
              >
                {isFrench ? 'À faire' : 'Pending'}
              </button>
            </div>
          </div>
        </div>

        {/* Dense Grid of Objectives */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-1">
          {displayedObjectives.map(({ objective, topic, isMastered }) => {
            const isSelected = selectedObjectiveId === objective.id;
            return (
              <div
                key={objective.id}
                onClick={() => setSelectedObjectiveId(objective.id)}
                className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#ffc20e] bg-[#fff8f2] shadow-xs ring-2 ring-[#ffc20e]/40'
                    : isMastered
                    ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
                    : 'border-[#ebdcc8] bg-white hover:border-[#d3c5ab]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-[11px] text-[#201b11]">
                    {objective.id}
                  </span>
                  <span className="text-[9px] font-bold px-1 rounded bg-[#ebdcc8] text-[#785a00]">
                    P{objective.weight}
                  </span>
                </div>

                <p className="text-[11px] text-[#4f4632] line-clamp-1 font-medium">
                  {objective.title}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#ebdcc8]/50 text-[10px]">
                  <span className={isMastered ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}>
                    {isMastered ? (isFrench ? '✓ Maîtrisé' : '✓ Done') : (isFrench ? 'À réviser' : 'Pending')}
                  </span>
                  <span className="text-[#817660]">T{topic.topicNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Custom Treemap Cell Component for Recharts
const CustomTreemapContent: React.FC<any> = (props) => {
  const { x, y, width, height, id, weight, isMastered, onSelect } = props;

  if (width < 30 || height < 20) return null;

  return (
    <g
      onClick={() => id && onSelect && onSelect(id)}
      className="cursor-pointer transition-opacity hover:opacity-85"
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: isMastered ? '#10b981' : '#ebdcc8',
          stroke: '#ffffff',
          strokeWidth: 2,
        }}
        rx={4}
      />
      {width > 45 && height > 28 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fill={isMastered ? '#ffffff' : '#785a00'}
          fontSize={width > 70 ? '11' : '9'}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {id}
        </text>
      )}
    </g>
  );
};
