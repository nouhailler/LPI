import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  FileCode,
  HelpCircle,
  Lightbulb,
  Award,
  BookMarked,
  Filter,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
  Play,
  RotateCcw,
  Layers,
  Server,
  Cpu
} from 'lucide-react';
import { allLpicTopicsData } from '../data/lpicObjectivesData';
import { LPICObjective, LPICTopic, TabType } from '../types';

interface LearningObjectivesViewProps {
  onNavigate: (tab: TabType) => void;
  onStartExam?: (examId: string) => void;
  initialTopicId?: string;
  initialObjectiveId?: string;
}

type ExamIdType = 'exam-101' | 'exam-102' | 'exam-201' | 'exam-202' | 'exam-300' | 'exam-303' | 'exam-305' | 'exam-306';
type CertTierType = 'lpic-1' | 'lpic-2' | 'lpic-3';

export const LearningObjectivesView: React.FC<LearningObjectivesViewProps> = ({
  onNavigate,
  onStartExam,
  initialTopicId,
  initialObjectiveId,
}) => {
  // Determine initial cert & exam from topic/objective if provided
  const getInitialExam = (): ExamIdType => {
    if (initialTopicId) {
      const num = parseInt(initialTopicId.replace('topic-', ''), 10);
      if (num >= 361) return 'exam-306';
      if (num >= 351) return 'exam-305';
      if (num >= 325) return 'exam-303';
      if (num >= 301) return 'exam-300';
      if (num >= 207) return 'exam-202';
      if (num >= 200) return 'exam-201';
      if (num >= 105) return 'exam-102';
      return 'exam-101';
    }
    return 'exam-101';
  };

  const initialExam = getInitialExam();
  const [selectedCert, setSelectedCert] = useState<CertTierType>(
    initialExam.startsWith('exam-3') ? 'lpic-3' : initialExam.startsWith('exam-2') ? 'lpic-2' : 'lpic-1'
  );
  const [selectedExam, setSelectedExam] = useState<ExamIdType>(initialExam);

  // Search query & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState<number | 'all'>('all');
  
  // Expanded topics state
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'topic-101': true,
    'topic-102': true,
    'topic-103': true,
    'topic-104': true,
    'topic-105': true,
    'topic-106': true,
    'topic-107': true,
    'topic-108': true,
    'topic-109': true,
    'topic-110': true,
    'topic-200': true,
    'topic-201': true,
    'topic-202': true,
    'topic-203': true,
    'topic-204': true,
    'topic-205': true,
    'topic-206': true,
    'topic-207': true,
    'topic-208': true,
    'topic-209': true,
    'topic-210': true,
    'topic-211': true,
    'topic-212': true,
    'topic-301': true,
    'topic-302': true,
    'topic-303': true,
    'topic-304': true,
    'topic-305': true,
    'topic-325': true,
    'topic-326': true,
    'topic-327': true,
    'topic-328': true,
    'topic-351': true,
    'topic-352': true,
    'topic-353': true,
    'topic-361': true,
    'topic-362': true,
    'topic-363': true,
    'topic-364': true,
  });

  // Selected objective for deep study modal
  const [activeObjective, setActiveObjective] = useState<{
    topic: LPICTopic;
    objective: LPICObjective;
  } | null>(null);

  // Copied command tracker
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Quiz state inside objective modal
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Mastered objectives stored in localStorage
  const [masteredObjectives, setMasteredObjectives] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      return saved ? JSON.parse(saved) : ['101.1', '101.2', '200.1'];
    } catch {
      return ['101.1', '101.2', '200.1'];
    }
  });

  // Save mastered objectives
  const toggleMasterObjective = (objectiveId: string) => {
    setMasteredObjectives((prev) => {
      const next = prev.includes(objectiveId)
        ? prev.filter((id) => id !== objectiveId)
        : [...prev, objectiveId];
      try {
        localStorage.setItem('lpic_mastered_objectives', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  // Open initial objective if passed
  useEffect(() => {
    if (initialObjectiveId) {
      for (const topic of allLpicTopicsData) {
        const obj = topic.objectives.find((o) => o.id === initialObjectiveId);
        if (obj) {
          setSelectedExam(topic.examId);
          setSelectedCert(
            topic.examId.startsWith('exam-3')
              ? 'lpic-3'
              : topic.examId.startsWith('exam-2')
              ? 'lpic-2'
              : 'lpic-1'
          );
          setActiveObjective({ topic, objective: obj });
          break;
        }
      }
    }
  }, [initialObjectiveId]);

  // Reset quiz state when active objective changes
  useEffect(() => {
    setUserQuizAnswers({});
    setQuizSubmitted(false);
  }, [activeObjective]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // When changing cert tab, auto-switch to first exam in that cert
  const handleCertSelect = (cert: CertTierType) => {
    setSelectedCert(cert);
    if (cert === 'lpic-1' && !selectedExam.startsWith('exam-1')) {
      setSelectedExam('exam-101');
    } else if (cert === 'lpic-2' && !selectedExam.startsWith('exam-2')) {
      setSelectedExam('exam-201');
    } else if (cert === 'lpic-3' && !selectedExam.startsWith('exam-3')) {
      setSelectedExam('exam-300');
    }
  };

  // Filter topics for the current exam and search query
  const filteredTopics = useMemo(() => {
    const currentExamTopics = allLpicTopicsData.filter((t) => t.examId === selectedExam);

    if (!searchQuery.trim() && selectedWeightFilter === 'all') {
      return currentExamTopics;
    }

    const query = searchQuery.toLowerCase().trim();

    return currentExamTopics
      .map((topic) => {
        const matchingObjectives = topic.objectives.filter((obj) => {
          const matchesWeight =
            selectedWeightFilter === 'all' || obj.weight === selectedWeightFilter;

          if (!matchesWeight) return false;
          if (!query) return true;

          const matchId = obj.id.toLowerCase().includes(query);
          const matchTitle = obj.title.toLowerCase().includes(query);
          const matchDesc = obj.description.toLowerCase().includes(query);
          const matchTerms = obj.termsAndUtilities.some((term) =>
            term.toLowerCase().includes(query)
          );
          const matchKnowledge = obj.keyKnowledgeAreas.some((k) =>
            k.toLowerCase().includes(query)
          );
          const matchCommands = obj.keyCommands.some(
            (c) =>
              c.command.toLowerCase().includes(query) ||
              c.description.toLowerCase().includes(query)
          );
          const matchFiles = obj.filesAndPaths.some((f) =>
            f.toLowerCase().includes(query)
          );

          return matchId || matchTitle || matchDesc || matchTerms || matchKnowledge || matchCommands || matchFiles;
        });

        return {
          ...topic,
          objectives: matchingObjectives,
        };
      })
      .filter((topic) => topic.objectives.length > 0 || topic.title.toLowerCase().includes(query));
  }, [selectedExam, searchQuery, selectedWeightFilter]);

  // Calculate stats for all exams
  const stats = useMemo(() => {
    const calculateForExam = (examId: ExamIdType) => {
      const objs = allLpicTopicsData
        .filter((t) => t.examId === examId)
        .flatMap((t) => t.objectives);
      const mastered = objs.filter((o) => masteredObjectives.includes(o.id)).length;
      const totalWeight = objs.reduce((sum, o) => sum + o.weight, 0);
      const pct = objs.length > 0 ? Math.round((mastered / objs.length) * 100) : 0;
      return { totalObjectives: objs.length, mastered, totalWeight, pct };
    };

    return {
      'exam-101': calculateForExam('exam-101'),
      'exam-102': calculateForExam('exam-102'),
      'exam-201': calculateForExam('exam-201'),
      'exam-202': calculateForExam('exam-202'),
      'exam-300': calculateForExam('exam-300'),
      'exam-303': calculateForExam('exam-303'),
      'exam-305': calculateForExam('exam-305'),
      'exam-306': calculateForExam('exam-306'),
    };
  }, [masteredObjectives]);

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuizOptionSelect = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setUserQuizAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-20">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#ffc20e] text-[#6d5100] font-bold text-xs rounded-md uppercase tracking-wider">
              Official Curriculum
            </span>
            <span className="text-xs font-semibold text-[#817660]">
              LPIC-1 (v5.0), LPIC-2 (v4.5) & LPIC-3 (v3.0) Objectives
            </span>
          </div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            LPI Study Modules & Learning Objectives
          </h1>
          <p className="text-[#4f4632] text-sm md:text-base max-w-3xl">
            Exhaustive, chapter-by-chapter curriculum covering LPIC-1 (101 & 102), LPIC-2 (201 & 202), LPIC-3 Mixed Environments (300), LPIC-3 Security (303), LPIC-3 Virtualization & Containerization (305), and LPIC-3 High Availability & Storage Clusters (306) topics, key knowledge areas, command syntax, essential configuration files, and practice checkpoints defined by the Linux Professional Institute.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.lpi.org/our-certifications/exam-101-102-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#785a00] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-1 (101/102)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.lpi.org/our-certifications/exam-201-202-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#785a00] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-2 (201/202)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.lpi.org/our-certifications/exam-300-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#5c3566] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-3 (300)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.lpi.org/our-certifications/exam-303-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#991b1b] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-3 (303 Security)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.lpi.org/our-certifications/exam-305-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#4338ca] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-3 (305 Virt & Containers)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.lpi.org/our-certifications/exam-306-objectives/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#f8ecdb] text-[#047857] hover:bg-[#ebdcc8] text-xs font-bold transition-colors border border-[#d3c5ab]"
            >
              <span>LPIC-3 (306 HA & Storage)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={() => onNavigate('practice')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ffc20e] text-[#6d5100] hover:bg-[#f9bd00] font-bold text-xs md:text-sm shadow-xs transition-transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice Exam Mode</span>
          </button>
        </div>
      </div>

      {/* Certification Tier Switcher (LPIC-1 vs LPIC-2 vs LPIC-3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-[#f8ecdb]/60 p-1.5 rounded-2xl border border-[#d3c5ab] gap-1.5">
        <button
          onClick={() => handleCertSelect('lpic-1')}
          className={`py-3 px-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
            selectedCert === 'lpic-1'
              ? 'bg-[#ffffff] text-[#201b11] shadow-xs border border-[#d3c5ab]'
              : 'text-[#817660] hover:text-[#201b11]'
          }`}
        >
          <Award className={`w-5 h-5 shrink-0 ${selectedCert === 'lpic-1' ? 'text-[#ffc20e]' : 'text-[#817660]'}`} />
          <div className="text-left">
            <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#785a00]">Tier 1 (Core)</span>
            <span className="block font-bold leading-tight truncate">LPIC-1: Linux Admin</span>
          </div>
        </button>

        <button
          onClick={() => handleCertSelect('lpic-2')}
          className={`py-3 px-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
            selectedCert === 'lpic-2'
              ? 'bg-[#ffffff] text-[#201b11] shadow-xs border border-[#d3c5ab]'
              : 'text-[#817660] hover:text-[#201b11]'
          }`}
        >
          <Server className={`w-5 h-5 shrink-0 ${selectedCert === 'lpic-2' ? 'text-[#0061a4]' : 'text-[#817660]'}`} />
          <div className="text-left">
            <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#0061a4]">Tier 2 (Advanced)</span>
            <span className="block font-bold leading-tight truncate">LPIC-2: Linux Engineer</span>
          </div>
        </button>

        <button
          onClick={() => handleCertSelect('lpic-3')}
          className={`py-3 px-3.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
            selectedCert === 'lpic-3'
              ? 'bg-[#ffffff] text-[#201b11] shadow-xs border border-[#d3c5ab]'
              : 'text-[#817660] hover:text-[#201b11]'
          }`}
        >
          <Layers className={`w-5 h-5 shrink-0 ${selectedCert === 'lpic-3' ? 'text-[#5c3566]' : 'text-[#817660]'}`} />
          <div className="text-left">
            <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#5c3566]">Tier 3 (Enterprise)</span>
            <span className="block font-bold leading-tight truncate">LPIC-3: Enterprise (300, 303, 305 & 306)</span>
          </div>
        </button>
      </div>

      {/* Exam Switcher Cards for the Selected Certification */}
      {selectedCert === 'lpic-1' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exam 101 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-101')}
            className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-101'
                ? 'bg-[#ffffff] border-[#ffc20e] shadow-md ring-2 ring-[#ffc20e]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#785a00]">
                  Exam Code: 101-500
                </span>
                <h2 className="text-xl font-bold text-[#201b11] mt-0.5">
                  Exam 101: Linux Administrator 1
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedExam === 'exam-101'
                    ? 'bg-[#ffc20e] text-[#6d5100]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-101'].mastered}/{stats['exam-101'].totalObjectives} Mastered
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 101–104: System Architecture, Linux Installation & Package Management, GNU/Unix Commands, Devices & Filesystems.
            </p>

            <div className="w-full mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Topic Weight: {stats['exam-101'].totalWeight} pts</span>
                <span>{stats['exam-101'].pct}% Completed</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-101'].pct}%` }}
                />
              </div>
            </div>
          </button>

          {/* Exam 102 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-102')}
            className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-102'
                ? 'bg-[#ffffff] border-[#ffc20e] shadow-md ring-2 ring-[#ffc20e]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#785a00]">
                  Exam Code: 102-500
                </span>
                <h2 className="text-xl font-bold text-[#201b11] mt-0.5">
                  Exam 102: Linux Administrator 2
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedExam === 'exam-102'
                    ? 'bg-[#ffc20e] text-[#6d5100]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-102'].mastered}/{stats['exam-102'].totalObjectives} Mastered
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 105–110: Shells & Scripting, User Interfaces, Administrative Tasks, Essential Services, Networking, and Security.
            </p>

            <div className="w-full mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Topic Weight: {stats['exam-102'].totalWeight} pts</span>
                <span>{stats['exam-102'].pct}% Completed</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-102'].pct}%` }}
                />
              </div>
            </div>
          </button>
        </div>
      ) : selectedCert === 'lpic-2' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exam 201 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-201')}
            className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-201'
                ? 'bg-[#ffffff] border-[#0061a4] shadow-md ring-2 ring-[#0061a4]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0061a4]">
                  Exam Code: 201-450
                </span>
                <h2 className="text-xl font-bold text-[#201b11] mt-0.5">
                  Exam 201: Linux Engineer 1
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedExam === 'exam-201'
                    ? 'bg-[#0061a4] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-201'].mastered}/{stats['exam-201'].totalObjectives} Mastered
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 200–206: Capacity Planning, Linux Kernel, System Startup, Filesystem & Devices, Advanced Storage (RAID/LVM), Network Config, System Maintenance.
            </p>

            <div className="w-full mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Topic Weight: {stats['exam-201'].totalWeight} pts</span>
                <span>{stats['exam-201'].pct}% Completed</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0061a4] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-201'].pct}%` }}
                />
              </div>
            </div>
          </button>

          {/* Exam 202 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-202')}
            className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-202'
                ? 'bg-[#ffffff] border-[#0061a4] shadow-md ring-2 ring-[#0061a4]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0061a4]">
                  Exam Code: 202-450
                </span>
                <h2 className="text-xl font-bold text-[#201b11] mt-0.5">
                  Exam 202: Linux Engineer 2
                </h2>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedExam === 'exam-202'
                    ? 'bg-[#0061a4] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-202'].mastered}/{stats['exam-202'].totalObjectives} Mastered
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 207–212: Domain Name Server (BIND 9), Web Services (Apache/Nginx/Squid), File Sharing (Samba/NFS), Network Client (DHCP/PAM/LDAP), E-Mail (Postfix/Dovecot), System Security (iptables/nftables/OpenVPN).
            </p>

            <div className="w-full mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Topic Weight: {stats['exam-202'].totalWeight} pts</span>
                <span>{stats['exam-202'].pct}% Completed</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0061a4] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-202'].pct}%` }}
                />
              </div>
            </div>
          </button>
        </div>
      ) : (
        /* LPIC-3 Exam 300, 303, 305 & 306 Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Exam 300 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-300')}
            className={`flex flex-col text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-300'
                ? 'bg-[#ffffff] border-[#5c3566] shadow-md ring-2 ring-[#5c3566]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c3566]">
                  Exam Code: 300-300
                </span>
                <h2 className="text-base font-bold text-[#201b11] mt-0.5">
                  Exam 300: Mixed Env
                </h2>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  selectedExam === 'exam-300'
                    ? 'bg-[#5c3566] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-300'].mastered}/{stats['exam-300'].totalObjectives}
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 301–305: Samba Basics, AD DC & Member Server, Share Config, Winbind/SSSD Auth, FreeIPA & NFSv4.
            </p>

            <div className="w-full mt-auto pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Weight: {stats['exam-300'].totalWeight} pts (19 Objs)</span>
                <span>{stats['exam-300'].pct}%</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#5c3566] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-300'].pct}%` }}
                />
              </div>
            </div>
          </button>

          {/* Exam 303 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-303')}
            className={`flex flex-col text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-303'
                ? 'bg-[#ffffff] border-[#991b1b] shadow-md ring-2 ring-[#991b1b]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#991b1b]">
                  Exam Code: 303-300
                </span>
                <h2 className="text-base font-bold text-[#201b11] mt-0.5">
                  Exam 303: Security
                </h2>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  selectedExam === 'exam-303'
                    ? 'bg-[#991b1b] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-303'].mastered}/{stats['exam-303'].totalObjectives}
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 325–328: Cryptography (PKI, TLS, LUKS, DNSSEC), Host Hardening & Audit, Access Control (SELinux), and Network Defense.
            </p>

            <div className="w-full mt-auto pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Weight: {stats['exam-303'].totalWeight} pts (15 Objs)</span>
                <span>{stats['exam-303'].pct}%</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#991b1b] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-303'].pct}%` }}
                />
              </div>
            </div>
          </button>

          {/* Exam 305 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-305')}
            className={`flex flex-col text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-305'
                ? 'bg-[#ffffff] border-[#4338ca] shadow-md ring-2 ring-[#4338ca]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4338ca]">
                  Exam Code: 305-300
                </span>
                <h2 className="text-base font-bold text-[#201b11] mt-0.5">
                  Exam 305: Virt & Containers
                </h2>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  selectedExam === 'exam-305'
                    ? 'bg-[#4338ca] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-305'].mastered}/{stats['exam-305'].totalObjectives}
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 351–353: Full Virtualization (Xen/QEMU/Libvirt), Containers (Namespaces/cgroups/LXC/Docker/Orchestration), and Provisioning (Terraform/Packer/cloud-init/Vagrant).
            </p>

            <div className="w-full mt-auto pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Weight: {stats['exam-305'].totalWeight} pts (13 Objs)</span>
                <span>{stats['exam-305'].pct}%</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#4338ca] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-305'].pct}%` }}
                />
              </div>
            </div>
          </button>

          {/* Exam 306 Tab Card */}
          <button
            onClick={() => setSelectedExam('exam-306')}
            className={`flex flex-col text-left p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedExam === 'exam-306'
                ? 'bg-[#ffffff] border-[#047857] shadow-md ring-2 ring-[#047857]/20'
                : 'bg-[#fef9f4] border-[#d3c5ab] hover:border-[#817660]/50 opacity-80'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857]">
                  Exam Code: 306-300
                </span>
                <h2 className="text-base font-bold text-[#201b11] mt-0.5">
                  Exam 306: HA & Storage
                </h2>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  selectedExam === 'exam-306'
                    ? 'bg-[#047857] text-[#ffffff]'
                    : 'bg-[#e7decb] text-[#4f4632]'
                }`}
              >
                {stats['exam-306'].mastered}/{stats['exam-306'].totalObjectives}
              </span>
            </div>

            <p className="text-xs text-[#4f4632] mt-2 line-clamp-2">
              Topics 361–364: HA Cluster Management (Pacemaker/LVS), Storage (DRBD/iSCSI/GFS2), Distributed Storage (GlusterFS/Ceph), and Single Node HA.
            </p>

            <div className="w-full mt-auto pt-3 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[#817660]">
                <span>Weight: {stats['exam-306'].totalWeight} pts (12 Objs)</span>
                <span>{stats['exam-306'].pct}%</span>
              </div>
              <div className="w-full bg-[#e7decb] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#047857] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats['exam-306'].pct}%` }}
                />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives, commands, files, or keywords (e.g. named.conf, mdadm, sysctl, pam)..."
            className="w-full pl-9 pr-8 py-2 bg-[#f8ecdb]/50 border border-[#d3c5ab] rounded-lg text-sm text-[#201b11] focus:outline-none focus:border-[#785a00] focus:ring-1 focus:ring-[#785a00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#817660] hover:text-[#201b11]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-[#4f4632] font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#817660]" />
            <span>Filter Weight:</span>
          </div>

          <div className="flex items-center gap-1">
            {(['all', 1, 2, 3, 4, 5, 6] as const).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeightFilter(w)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  selectedWeightFilter === w
                    ? 'bg-[#785a00] text-[#ffffff]'
                    : 'bg-[#f8ecdb] text-[#4f4632] hover:bg-[#ebdcc8]'
                }`}
              >
                {w === 'all' ? 'All' : `W${w}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics & Objectives Chapters List */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-10 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-[#817660] mx-auto" />
            <h3 className="font-bold text-lg text-[#201b11]">No objectives matched your search</h3>
            <p className="text-sm text-[#4f4632] max-w-md mx-auto">
              Try searching for common Linux terms like <span className="font-mono font-bold">bind</span>, <span className="font-mono font-bold">raid</span>, <span className="font-mono font-bold">lvm</span>, <span className="font-mono font-bold">postfix</span>, or <span className="font-mono font-bold">iptables</span>.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedWeightFilter('all');
              }}
              className="px-4 py-2 bg-[#ffc20e] text-[#6d5100] rounded-lg text-xs font-bold hover:bg-[#f9bd00]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopics[topic.id] !== false;
            const topicMasteredCount = topic.objectives.filter((o) =>
              masteredObjectives.includes(o.id)
            ).length;

            return (
              <div
                key={topic.id}
                className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                {/* Topic Header Accordion Trigger */}
                <div
                  onClick={() => toggleTopicExpand(topic.id)}
                  className="flex items-center justify-between p-4 md:p-5 bg-[#faf4ec] hover:bg-[#f5ecdf] cursor-pointer transition-colors border-b border-[#d3c5ab]/60"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-xs shrink-0 ${
                      topic.examId === 'exam-306'
                        ? 'bg-[#047857] text-[#ffffff]'
                        : topic.examId === 'exam-305'
                        ? 'bg-[#4338ca] text-[#ffffff]'
                        : topic.examId === 'exam-303'
                        ? 'bg-[#991b1b] text-[#ffffff]'
                        : topic.examId === 'exam-300'
                        ? 'bg-[#5c3566] text-[#ffffff]'
                        : topic.examId.startsWith('exam-2')
                        ? 'bg-[#0061a4] text-[#ffffff]'
                        : 'bg-[#ffc20e] text-[#6d5100]'
                    }`}>
                      <span className="text-[10px] leading-tight uppercase font-sans">Topic</span>
                      <span className="text-base md:text-lg leading-none font-mono">
                        {topic.topicNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base md:text-lg text-[#201b11]">
                          {topic.title}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                          Weight: {topic.totalWeight}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 line-clamp-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-bold text-[#817660]">
                      {topicMasteredCount}/{topic.objectives.length} Mastered
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#ebdcc8] flex items-center justify-center text-[#785a00]">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Topic Objectives Grid */}
                {isExpanded && (
                  <div className="divide-y divide-[#d3c5ab]/40">
                    {topic.objectives.map((obj) => {
                      const isMastered = masteredObjectives.includes(obj.id);

                      return (
                        <div
                          key={obj.id}
                          className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#fffbf6] ${
                            isMastered ? 'bg-[#f4faee]/40' : ''
                          }`}
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#201b11] text-[#ffc20e] font-mono font-bold text-xs rounded">
                                {obj.id}
                              </span>
                              <h4 className="font-bold text-sm md:text-base text-[#201b11]">
                                {obj.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-[#ebdcc8] text-[#4f4632] text-xs font-semibold rounded">
                                Weight: {obj.weight}
                              </span>
                              {isMastered && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#28A745] bg-[#28A745]/10 px-2 py-0.5 rounded">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Mastered
                                </span>
                              )}
                            </div>

                            <p className="text-xs md:text-sm text-[#4f4632]">
                              {obj.description}
                            </p>

                            {/* Tags for terms & utilities */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {obj.termsAndUtilities.slice(0, 6).map((term, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-[#f8ecdb] border border-[#d3c5ab] text-[#785a00] font-mono text-[11px] rounded"
                                >
                                  {term}
                                </span>
                              ))}
                              {obj.termsAndUtilities.length > 6 && (
                                <span className="px-1.5 py-0.5 text-[11px] font-semibold text-[#817660]">
                                  +{obj.termsAndUtilities.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMasterObjective(obj.id);
                              }}
                              title={isMastered ? 'Mark as In Progress' : 'Mark as Mastered'}
                              className={`p-2 rounded-lg border transition-colors ${
                                isMastered
                                  ? 'bg-[#28A745]/10 border-[#28A745]/40 text-[#28A745] hover:bg-[#28A745]/20'
                                  : 'bg-[#f8ecdb] border-[#d3c5ab] text-[#817660] hover:text-[#201b11] hover:border-[#817660]'
                              }`}
                            >
                              {isMastered ? (
                                <CheckCircle2 className="w-4 h-4 fill-current" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => setActiveObjective({ topic, objective: obj })}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[#ffffff] text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                                topic.examId === 'exam-306'
                                  ? 'bg-[#047857] hover:bg-[#065f46]'
                                  : topic.examId === 'exam-305'
                                  ? 'bg-[#4338ca] hover:bg-[#3730a3]'
                                  : topic.examId === 'exam-303'
                                  ? 'bg-[#991b1b] hover:bg-[#7f1d1d]'
                                  : topic.examId === 'exam-300'
                                  ? 'bg-[#5c3566] hover:bg-[#472750]'
                                  : topic.examId.startsWith('exam-2')
                                  ? 'bg-[#0061a4] hover:bg-[#004f87]'
                                  : 'bg-[#785a00] hover:bg-[#604700]'
                              }`}
                            >
                              <span>Study Chapter</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Objective In-Depth Study Modal */}
      {activeObjective && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-[#fff8f2] border-2 border-[#d3c5ab] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 md:p-6 bg-[#ffffff] border-b border-[#d3c5ab] flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#201b11] text-[#ffc20e] font-mono font-bold text-xs rounded">
                    Objective {activeObjective.objective.id}
                  </span>
                  <span className="text-xs font-bold text-[#785a00] bg-[#ebdcc8] px-2.5 py-0.5 rounded">
                    Topic {activeObjective.topic.topicNumber}: {activeObjective.topic.title}
                  </span>
                  <span className="text-xs font-bold text-[#4f4632] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                    Exam Weight: {activeObjective.objective.weight}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#201b11]">
                  {activeObjective.objective.title}
                </h2>
                <p className="text-xs md:text-sm text-[#4f4632]">
                  {activeObjective.objective.description}
                </p>
              </div>

              <button
                onClick={() => setActiveObjective(null)}
                className="p-2 rounded-full hover:bg-[#f8ecdb] text-[#817660] hover:text-[#201b11] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {/* 1. Official Key Knowledge Areas */}
              <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#785a00]">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#201b11]">Key Knowledge Areas</h3>
                </div>
                <ul className="space-y-2 text-sm text-[#4f4632]">
                  {activeObjective.objective.keyKnowledgeAreas.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffc20e] mt-2 shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Key Files, Terms & Utilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#785a00]">
                    <Terminal className="w-4 h-4" />
                    <h4 className="font-bold text-sm text-[#201b11]">Terms & Utilities</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeObjective.objective.termsAndUtilities.map((term, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#f8ecdb] border border-[#d3c5ab] text-[#785a00] font-mono text-xs rounded-md font-semibold"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#785a00]">
                    <FileCode className="w-4 h-4" />
                    <h4 className="font-bold text-sm text-[#201b11]">Key Files & Paths</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeObjective.objective.filesAndPaths.map((filePath, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#e7decb]/50 border border-[#d3c5ab] text-[#4f4632] font-mono text-xs rounded-md font-semibold"
                      >
                        {filePath}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Key Commands & Syntax Examples */}
              {activeObjective.objective.keyCommands.length > 0 && (
                <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-[#785a00]">
                    <Terminal className="w-5 h-5" />
                    <h3 className="font-bold text-base text-[#201b11]">
                      Practical Command Examples & Syntax
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeObjective.objective.keyCommands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="bg-[#201b11] text-[#ffffff] rounded-xl p-3.5 border border-[#3e3423] space-y-2 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
                          <span className="text-[#a89d84] font-sans text-xs">
                            {cmd.description}
                          </span>
                          <button
                            onClick={() => handleCopyCommand(cmd.command, idx)}
                            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[#ffc20e] transition-colors flex items-center gap-1 font-sans text-[11px]"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#28A745]" />
                                <span className="text-[#28A745]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-[#ffc20e] font-bold text-sm overflow-x-auto py-1">
                          $ {cmd.command}
                        </div>

                        {cmd.example && (
                          <div className="text-neutral-400 text-[11px] pt-1">
                            <span className="text-neutral-500">Example:</span> {cmd.example}
                          </div>
                        )}

                        {cmd.explanation && (
                          <div className="text-neutral-400 font-sans text-[11px] italic">
                            💡 {cmd.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. High-Yield Exam Notes & Tips */}
              {activeObjective.objective.studyNotes.length > 0 && (
                <div className="bg-[#fff9ea] border border-[#ffc20e]/60 rounded-xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-[#785a00]">
                    <Lightbulb className="w-5 h-5 text-[#E67E22]" />
                    <h3 className="font-bold text-base text-[#201b11]">
                      High-Yield Exam Tips & Traps
                    </h3>
                  </div>

                  <ul className="space-y-2 text-sm text-[#4f4632]">
                    {activeObjective.objective.studyNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#E67E22] font-bold shrink-0">★</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. Mini Objective Knowledge Check */}
              {activeObjective.objective.quickQuestions.length > 0 && (
                <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#785a00]">
                      <HelpCircle className="w-5 h-5" />
                      <h3 className="font-bold text-base text-[#201b11]">
                        Knowledge Check ({activeObjective.objective.quickQuestions.length} Questions)
                      </h3>
                    </div>
                    {quizSubmitted && (
                      <button
                        onClick={() => {
                          setUserQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-[#785a00] hover:underline font-bold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {activeObjective.objective.quickQuestions.map((q, qIdx) => {
                      const selectedOpt = userQuizAnswers[qIdx];
                      const isAnswered = selectedOpt !== undefined;
                      const isCorrect = selectedOpt === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className="bg-[#fef9f4] border border-[#d3c5ab] rounded-xl p-4 space-y-3"
                        >
                          <p className="font-bold text-sm text-[#201b11]">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              let optStyle = 'bg-[#ffffff] border-[#d3c5ab] text-[#4f4632] hover:bg-[#f8ecdb]';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  optStyle = 'bg-[#28A745]/15 border-[#28A745] text-[#19692c] font-bold';
                                } else if (selectedOpt === optIdx) {
                                  optStyle = 'bg-[#ba1a1a]/15 border-[#ba1a1a] text-[#ba1a1a]';
                                }
                              } else if (selectedOpt === optIdx) {
                                optStyle = 'bg-[#ffc20e]/30 border-[#785a00] text-[#6d5100] font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={quizSubmitted}
                                  onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                  className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <Check className="w-4 h-4 text-[#28A745] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div
                              className={`p-3 rounded-lg text-xs font-sans ${
                                isCorrect
                                  ? 'bg-[#28A745]/10 text-[#19692c] border border-[#28A745]/20'
                                  : 'bg-[#ba1a1a]/10 text-[#ba1a1a] border border-[#ba1a1a]/20'
                              }`}
                            >
                              <span className="font-bold block mb-0.5">
                                {isCorrect ? '✓ Correct!' : '✗ Explanation:'}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={
                          Object.keys(userQuizAnswers).length <
                          activeObjective.objective.quickQuestions.length
                        }
                        className="w-full py-2.5 rounded-lg bg-[#785a00] text-[#ffffff] font-bold text-xs uppercase tracking-wider hover:bg-[#604700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <div className="p-3 bg-[#f8ecdb] rounded-lg text-center font-bold text-xs text-[#785a00]">
                        Great job reviewing Objective {activeObjective.objective.id}!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-5 bg-[#ffffff] border-t border-[#d3c5ab] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => toggleMasterObjective(activeObjective.objective.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm border transition-colors cursor-pointer ${
                  masteredObjectives.includes(activeObjective.objective.id)
                    ? 'bg-[#28A745] text-[#ffffff] border-[#28A745] hover:bg-[#218838]'
                    : 'bg-[#f8ecdb] text-[#785a00] border-[#d3c5ab] hover:bg-[#ebdcc8]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {masteredObjectives.includes(activeObjective.objective.id)
                    ? 'Mastered (Click to Undo)'
                    : 'Mark Objective as Mastered'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveObjective(null);
                    onNavigate('practice');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#ffc20e] text-[#6d5100] hover:bg-[#f9bd00] font-bold text-xs md:text-sm shadow-xs cursor-pointer"
                >
                  Take Practice Questions
                </button>
                <button
                  onClick={() => setActiveObjective(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#f8ecdb] text-[#4f4632] hover:bg-[#ebdcc8] font-bold text-xs md:text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
