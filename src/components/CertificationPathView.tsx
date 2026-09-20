import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  Zap,
  Target,
  Info,
  CircleDot,
  RotateCcw,
  Sparkles,
  Layers,
  Compass,
} from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { allLpicTopicsData } from '../data/lpicObjectivesData';
import { getLearningMapNodes } from './learningMap/learningMapData';
import { LearningMapTree } from './learningMap/LearningMapTree';
import { ThematicLearningPathsView } from './ThematicLearningPathsView';
import { ErrorBoundary } from './ErrorBoundary';

interface CertificationPathViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onStartExam: (examId: string) => void;
  onNavigate: (tab: TabType) => void;
  onOpenLearning?: (topicId?: string) => void;
  onUpdateTarget?: (target: string) => void;
  onOpenFlashcardsTopic?: (topicId: string) => void;
  onOpenExplainDifferently?: (topic: string, mode?: any, context?: string) => void;
  initialViewMode?: 'thematic' | 'map' | 'detailed';
}

export const CertificationPathView: React.FC<CertificationPathViewProps> = ({
  userStats,
  tiers,
  onStartExam,
  onNavigate,
  onOpenLearning,
  onUpdateTarget,
  onOpenFlashcardsTopic,
  onOpenExplainDifferently,
  initialViewMode,
}) => {
  const { t, isFrench } = useLanguage();

  // View mode: 'thematic' (Independent Career Skill Paths) | 'map' (Learning Map interactive tree) | 'detailed' (Curriculum tiers list)
  const [viewMode, setViewMode] = useState<'thematic' | 'map' | 'detailed'>(() => {
    if (initialViewMode) return initialViewMode;
    try {
      const saved = localStorage.getItem('cert_path_view_mode');
      if (saved === 'thematic' || saved === 'map' || saved === 'detailed') {
        return saved;
      }
    } catch {}
    return 'thematic';
  });

  const handleSetViewMode = (mode: 'thematic' | 'map' | 'detailed') => {
    setViewMode(mode);
    try {
      localStorage.setItem('cert_path_view_mode', mode);
    } catch {}
  };

  // Mastered objectives read from localStorage (clean prototype data if present)
  const [masteredObjectiveIds, setMasteredObjectiveIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lpic_mastered_objectives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If it was the mock array from initial prototyping, clean it
          if (
            parsed.length === 3 &&
            parsed.includes('101.1') &&
            parsed.includes('101.2') &&
            parsed.includes('200.1')
          ) {
            localStorage.setItem('lpic_mastered_objectives', JSON.stringify([]));
            return [];
          }
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Linux Essentials status stored in localStorage (default: in preparation / false)
  const [essentialsPassed, setEssentialsPassed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lpi_essentials_status');
      return saved === 'passed';
    } catch {
      return false;
    }
  });

  // Current Target Cert stored in userStats or local state
  const [activeTarget, setActiveTarget] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lpi_current_target');
      return saved || userStats.currentTarget || 'LPIC-1';
    } catch {
      return userStats.currentTarget || 'LPIC-1';
    }
  });

  // Listen to cross-window storage events or changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lpic_mastered_objectives' && e.newValue) {
        try {
          setMasteredObjectiveIds(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'lpi_essentials_status' && e.newValue) {
        setEssentialsPassed(e.newValue === 'passed');
      }
      if (e.key === 'lpi_current_target' && e.newValue) {
        setActiveTarget(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggleEssentials = () => {
    const nextStatus = !essentialsPassed;
    setEssentialsPassed(nextStatus);
    try {
      localStorage.setItem('lpi_essentials_status', nextStatus ? 'passed' : 'in_progress');
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleObjectiveMastery = (objId: string) => {
    setMasteredObjectiveIds((prev) => {
      const next = prev.includes(objId)
        ? prev.filter((id) => id !== objId)
        : [...prev, objId];
      try {
        localStorage.setItem('lpic_mastered_objectives', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSelectTarget = (targetName: string) => {
    setActiveTarget(targetName);
    try {
      localStorage.setItem('lpi_current_target', targetName);
    } catch (e) {
      console.error(e);
    }
    if (onUpdateTarget) {
      onUpdateTarget(targetName);
    }
  };

  // Compute live statistics for every exam in the official curriculum
  const examStats = useMemo(() => {
    const calc = (examId: string) => {
      const topics = allLpicTopicsData.filter((top) => top.examId === examId);
      const allObjs = topics.flatMap((top) => top.objectives);
      const totalCount = allObjs.length;
      const masteredCount = allObjs.filter((obj) => masteredObjectiveIds.includes(obj.id)).length;
      const pct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
      const totalWeight = allObjs.reduce((sum, obj) => sum + (obj.weight || 0), 0);
      return { totalCount, masteredCount, pct, totalWeight };
    };

    return {
      'exam-101': calc('exam-101'),
      'exam-102': calc('exam-102'),
      'exam-201': calc('exam-201'),
      'exam-202': calc('exam-202'),
      'exam-300': calc('exam-300'),
      'exam-303': calc('exam-303'),
      'exam-305': calc('exam-305'),
      'exam-306': calc('exam-306'),
    };
  }, [masteredObjectiveIds]);

  // Overall path completion calculation based on target or global progress
  const targetSummary = useMemo(() => {
    if (activeTarget.includes('LPIC-1')) {
      const avg = Math.round((examStats['exam-101'].pct + examStats['exam-102'].pct) / 2);
      const isComplete = examStats['exam-101'].pct >= 100 && examStats['exam-102'].pct >= 100;
      return { pct: avg, isComplete, label: 'LPIC-1: Linux Administrator' };
    } else if (activeTarget.includes('LPIC-2')) {
      const avg = Math.round((examStats['exam-201'].pct + examStats['exam-202'].pct) / 2);
      const isComplete = examStats['exam-201'].pct >= 100 && examStats['exam-202'].pct >= 100;
      return { pct: avg, isComplete, label: 'LPIC-2: Linux Engineer' };
    } else if (activeTarget.includes('305')) {
      return { pct: examStats['exam-305'].pct, isComplete: examStats['exam-305'].pct >= 100, label: 'LPIC-3: 305 Virtualization & Containers' };
    } else if (activeTarget.includes('303')) {
      return { pct: examStats['exam-303'].pct, isComplete: examStats['exam-303'].pct >= 100, label: 'LPIC-3: 303 Enterprise Security' };
    } else if (activeTarget.includes('306')) {
      return { pct: examStats['exam-306'].pct, isComplete: examStats['exam-306'].pct >= 100, label: 'LPIC-3: 306 High Availability & Storage' };
    } else if (activeTarget.includes('300')) {
      return { pct: examStats['exam-300'].pct, isComplete: examStats['exam-300'].pct >= 100, label: 'LPIC-3: 300 Mixed Environments' };
    } else {
      // General LPIC-1 default
      const avg = Math.round((examStats['exam-101'].pct + examStats['exam-102'].pct) / 2);
      return { pct: avg, isComplete: avg >= 100, label: 'LPIC-1' };
    }
  }, [activeTarget, examStats]);

  // Compute Learning Map nodes with live objectives and readiness
  const learningMapNodes = useMemo(() => {
    return getLearningMapNodes(masteredObjectiveIds, essentialsPassed);
  }, [masteredObjectiveIds, essentialsPassed]);

  // Available target choices
  const targetOptions = [
    { id: 'LPIC-1', name: 'LPIC-1: Linux Administrator', tag: 'Exams 101 + 102' },
    { id: 'LPIC-2', name: 'LPIC-2: Linux Engineer', tag: 'Exams 201 + 202' },
    { id: 'LPIC-3 (305)', name: 'LPIC-3 305: Virtualization & Containers', tag: 'Exam 305-300' },
    { id: 'LPIC-3 (303)', name: 'LPIC-3 303: Enterprise Security', tag: 'Exam 303-300' },
    { id: 'LPIC-3 (306)', name: 'LPIC-3 306: High Availability & Clusters', tag: 'Exam 306-300' },
    { id: 'LPIC-3 (300)', name: 'LPIC-3 300: Mixed Environments & Samba', tag: 'Exam 300-300' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            {t.certPath.title}
          </h1>
          <p className="text-[#4f4632] text-sm md:text-base mt-1 max-w-2xl">
            {t.certPath.subtitle}
          </p>
        </div>

        {/* Quick Target Switcher */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-3 shadow-xs flex items-center gap-3 shrink-0">
          <Target className="w-5 h-5 text-[#785a00] shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
              {t.certPath.currentTargetLabel}
            </span>
            <select
              value={activeTarget}
              onChange={(e) => handleSelectTarget(e.target.value)}
              className="font-bold text-xs md:text-sm text-[#201b11] bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer pr-2"
            >
              {targetOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress Overview Card (Dynamically updated according to target) */}
      <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#ffc20e]/40 text-[#6d5100] rounded text-[10px] font-bold uppercase tracking-wider">
                {t.certPath.targetBadge}
              </span>
              <h2 className="font-bold text-lg md:text-xl text-[#201b11]">
                {targetSummary.label}
              </h2>
            </div>
            <p className="text-sm text-[#4f4632]">
              {isFrench
                ? `Progression calculée en temps réel d'après les objectifs validés (${targetSummary.pct}% accompli).`
                : `Calculated in real-time from your mastered syllabus objectives (${targetSummary.pct}% completed).`}
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="font-sans text-3xl md:text-4xl font-extrabold text-[#0061a4]">
              {targetSummary.pct}%
            </span>
            <span className="text-[11px] font-bold text-[#817660] block uppercase tracking-wider">
              {t.certPath.pathCompletion}
            </span>
          </div>
        </div>

        <div className="w-full h-3.5 bg-[#ece1d0] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-linear-to-r from-[#0061a4] to-[#047857] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${targetSummary.pct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-[#6e634e] pt-1">
          <span>
            {isFrench
              ? `Objectif actif : ${activeTarget}`
              : `Active target: ${activeTarget}`}
          </span>
          <button
            onClick={() => onNavigate('learning')}
            className="text-[#0061a4] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            {isFrench ? 'Valider des objectifs dans le cursus →' : 'Master objectives in curriculum →'}
          </button>
        </div>
      </div>

      {/* View Switcher: Thematic Career Paths vs Interactive Learning Map vs Detailed Curriculum */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-2 md:p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => handleSetViewMode('thematic')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'thematic'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ffc20e] fill-[#ffc20e]" />
            <span>{isFrench ? 'Parcours Thématiques (Métier)' : 'Thematic Skill Paths'}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              viewMode === 'thematic' ? 'bg-[#ffc20e] text-[#6d5100]' : 'bg-[#ece1d0] text-[#4f4632]'
            }`}>
              {isFrench ? 'Indépendant LPI' : 'Career'}
            </span>
          </button>

          <button
            onClick={() => handleSetViewMode('map')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{isFrench ? 'Learning Map (Arborescence)' : 'Learning Map'}</span>
          </button>

          <button
            onClick={() => handleSetViewMode('detailed')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'detailed'
                ? 'bg-[#785a00] text-white shadow-xs'
                : 'text-[#4f4632] hover:bg-[#f8ecdb]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFrench ? 'Paliers & Règles LPI' : 'Tiers & LPI Rules'}</span>
          </button>
        </div>

        <span className="text-xs text-[#817660] hidden lg:inline px-2">
          {viewMode === 'thematic'
            ? isFrench
              ? '🎯 21 feuilles de route concrètes (Fondamentaux, Admin, Réseau, Sécurité, Pratique) axées sur le terrain'
              : '🎯 21 pragmatic real-world engineering roadmaps (Fundamentals, Admin, Network, Security, DevOps)'
            : viewMode === 'map'
            ? isFrench
              ? '💡 Cliquez sur un nœud pour inspecter progression, flashcards et labs'
              : '💡 Click any node to inspect progress, flashcards & labs'
            : isFrench
            ? 'Règles officielles et prérequis de la filière LPI'
            : 'Official LPI progression rules'}
        </span>
      </div>

      {/* VIEW SELECTION */}
      {viewMode === 'thematic' ? (
        <ErrorBoundary fallbackTitle={isFrench ? "Erreur d'affichage des Parcours Métier" : "Career Paths Display Error"}>
          <ThematicLearningPathsView
            onNavigate={onNavigate}
            onOpenExplainDifferently={onOpenExplainDifferently}
          />
        </ErrorBoundary>
      ) : viewMode === 'map' ? (
        <LearningMapTree
          nodes={learningMapNodes}
          activeTarget={activeTarget}
          isFrench={isFrench}
          onSetTarget={handleSelectTarget}
          onStartExam={onStartExam}
          onOpenFlashcards={(topicKey) => {
            if (onOpenFlashcardsTopic) {
              onOpenFlashcardsTopic(topicKey);
            } else {
              onNavigate('flashcards');
            }
          }}
          onOpenLabs={() => onNavigate('training')}
          onOpenObjectives={onOpenLearning}
          masteredObjectiveIds={masteredObjectiveIds}
          onToggleObjectiveMastery={handleToggleObjectiveMastery}
        />
      ) : (
        <>
          {/* Official LPI Rules Infobox */}
      <div className="bg-[#f0f4fa] border border-[#bcd2ea] rounded-xl p-4 md:p-5 text-xs md:text-sm text-[#1e3a5f]">
        <div className="flex items-center gap-2 mb-2 font-bold text-[#004f87]">
          <Info className="w-4 h-4 shrink-0" />
          <span className="text-sm uppercase tracking-wider">{t.certPath.officialRulesTitle}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="bg-[#ffffff]/80 p-3 rounded-lg border border-[#bcd2ea]/60">
            <span className="font-bold text-[#0061a4] block mb-1">{t.certPath.rule1Title}</span>
            <p className="text-[#334155] leading-relaxed">{t.certPath.rule1Desc}</p>
          </div>
          <div className="bg-[#ffffff]/80 p-3 rounded-lg border border-[#bcd2ea]/60">
            <span className="font-bold text-[#0061a4] block mb-1">{t.certPath.rule2Title}</span>
            <p className="text-[#334155] leading-relaxed">{t.certPath.rule2Desc}</p>
          </div>
          <div className="bg-[#ffffff]/80 p-3 rounded-lg border border-[#bcd2ea]/60">
            <span className="font-bold text-[#5c3566] block mb-1">{t.certPath.rule3Title}</span>
            <p className="text-[#334155] leading-relaxed">{t.certPath.rule3Desc}</p>
          </div>
        </div>
      </div>

      {/* Certification Tiers Hierarchy */}
      <div className="flex flex-col gap-6">
        
        {/* Tier 0: Linux Essentials Tier (Configurable status) */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 relative overflow-hidden group hover:border-[#0061a4] transition-colors shadow-xs">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block px-2.5 py-0.5 bg-[#f2e7d6] text-[#4f4632] rounded-full text-[11px] font-bold tracking-wider">
                  {t.certPath.entryLevel}
                </span>
                <span className="inline-block px-2 py-0.5 bg-[#e0f2fe] text-[#0369a1] rounded text-[10px] font-bold uppercase tracking-wider">
                  {t.certPath.essentialsOptionalBadge}
                </span>
              </div>
              <h3 className="font-bold text-xl text-[#201b11]">Linux Essentials</h3>
              <p className="text-sm text-[#4f4632] mt-0.5">
                {isFrench
                  ? 'Fondamentaux des systèmes Linux, gestion des fichiers et philosophie open source.'
                  : 'Fundamentals of Linux systems, command line navigation, and open source.'}
              </p>
            </div>

            {/* Toggle Status Button */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={handleToggleEssentials}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  essentialsPassed
                    ? 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/30 hover:bg-[#28A745]/20'
                    : 'bg-[#fff8f2] text-[#785a00] border-[#d3c5ab] hover:bg-[#f2e7d6]'
                }`}
                title={isFrench ? 'Cliquer pour basculer le statut' : 'Click to toggle status'}
              >
                {essentialsPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {t.certPath.essentialsPassed}
                  </>
                ) : (
                  <>
                    <CircleDot className="w-4 h-4" />
                    {t.certPath.essentialsStudying}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 shrink-0 ${essentialsPassed ? 'text-[#28A745]' : 'text-[#785a00]'}`} />
              <div>
                <h4 className="font-bold text-sm text-[#201b11]">Exam 010-160</h4>
                <p className="text-xs text-[#4f4632]">
                  {isFrench ? 'Examen de certificat Linux Essentials (40 questions • 60 minutes)' : 'Linux Essentials Certificate Exam (40 questions • 60 minutes)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('practice')}
                className="px-3 py-1.5 bg-[#ffffff] hover:bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                {t.certPath.examPracticeBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Tier 1: LPIC-1 (Administrator) */}
        <div
          className={`bg-[#ffffff] rounded-xl p-5 md:p-6 relative overflow-hidden shadow-sm transition-all border-2 ${
            activeTarget.includes('LPIC-1')
              ? 'border-[#ffc20e] ring-2 ring-[#ffc20e]/30'
              : 'border-[#d3c5ab]'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6 mb-6 relative z-10">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-[#fff8f2] rounded-xl border border-[#d3c5ab] flex items-center justify-center p-2 shrink-0">
              <img
                alt="LPIC-1 Badge"
                className="w-full h-full object-contain"
                src="/lpic-1.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX';
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${activeTarget.includes('LPIC-1') ? 'bg-[#28A745] animate-pulse' : 'bg-[#817660]'}`} />
                  <span className="text-[11px] font-bold text-[#6d5100] uppercase tracking-wider">
                    {activeTarget.includes('LPIC-1') ? t.certPath.activePrep : 'LPIC-1 Track'}
                  </span>
                </div>
                {activeTarget !== 'LPIC-1' && (
                  <button
                    onClick={() => handleSelectTarget('LPIC-1')}
                    className="text-xs text-[#0061a4] hover:underline font-bold cursor-pointer"
                  >
                    {t.certPath.selectTargetPrompt}
                  </button>
                )}
              </div>

              <h3 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] mb-2">
                LPIC-1: Linux Administrator
              </h3>
              <p className="text-sm text-[#4f4632] mb-4 leading-relaxed">
                {isFrench
                  ? 'Validez votre capacité à exécuter des tâches de maintenance en ligne de commande, installer et configurer un ordinateur Linux et paramétrer un réseau de base.'
                  : 'Validate your ability to perform maintenance tasks on the command line, install and configure a computer running Linux and configure basic networking.'}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="bg-[#fef2e1] px-3.5 py-1.5 rounded-lg border border-[#d3c5ab]/60 text-xs">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    {t.certPath.validity}
                  </span>
                  <span className="font-bold text-[#201b11]">{t.certPath.fiveYears}</span>
                </div>
                <div className="bg-[#fef2e1] px-3.5 py-1.5 rounded-lg border border-[#d3c5ab]/60 text-xs">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    {t.certPath.prerequisites}
                  </span>
                  <span className="font-bold text-[#201b11]">{t.certPath.none}</span>
                </div>
                <div className="bg-[#fef2e1] px-3.5 py-1.5 rounded-lg border border-[#d3c5ab]/60 text-xs">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    {isFrench ? 'Examens requis' : 'Exams Required'}
                  </span>
                  <span className="font-bold text-[#201b11]">101-500 & 102-500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam 101 & 102 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {/* Exam 101 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between relative overflow-hidden shadow-2xs">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0061a4]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 101-500</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#a7ceff]/30 px-2 py-0.5 rounded">
                    Topics 101-104
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Architecture système (BIOS/UEFI, Runlevels), Installation Linux (Paquets Debian/RPM), Commandes GNU/Unix, Périphériques & Systèmes de fichiers.'
                    : 'System Architecture (BIOS/UEFI, Runlevels), Linux Installation (Debian/RPM packages), GNU/Unix Commands, Devices & Filesystems.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-101'].masteredCount} / {examStats['exam-101'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#0061a4]">{examStats['exam-101'].pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#0061a4] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-101'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-101') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title={isFrench ? 'Voir les objectifs détaillés' : 'View detailed objectives'}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-101')}
                    className="py-2 px-1 bg-[#495e8a] hover:bg-[#314671] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    title={isFrench ? 'Lancer les questions d\'entraînement' : 'Launch practice questions'}
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                    title={isFrench ? 'Accéder aux mini-labs pratiques' : 'Access interactive labs'}
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 102 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between relative overflow-hidden shadow-2xs">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffc20e]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 102-500</h4>
                  <span className="text-[11px] font-bold text-[#785a00] bg-[#ffc20e]/30 px-2 py-0.5 rounded">
                    Topics 105-110
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Shells, Scripts Bash, Gestion des données SQL, Interfaces graphiques (X11/Wayland), Tâches d\'administration, Notions de réseau et Sécurité système.'
                    : 'Shells, Bash Scripting, SQL Data Management, User Interfaces (X11/Wayland), Admin Tasks, Networking Fundamentals & Security.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-102'].masteredCount} / {examStats['exam-102'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#785a00]">{examStats['exam-102'].pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#ffc20e] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-102'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-105') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-102')}
                    className="py-2 px-1 bg-[#785a00] hover:bg-[#604700] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: LPIC-2 (Linux Engineer) */}
        <div
          className={`bg-[#ffffff] rounded-xl p-5 md:p-6 transition-all shadow-xs border-2 ${
            activeTarget.includes('LPIC-2')
              ? 'border-[#0061a4] ring-2 ring-[#0061a4]/30'
              : 'border-[#d3c5ab] hover:border-[#0061a4]'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-2 Badge"
                className="w-full h-full object-contain"
                src="/lpic-2.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TQaPgzl_r72VPInTrIDxVlwi3OFeOvhFVrVIsxKNn5HUG1aUqzYLI7HMSX47TH2atoBwmrLG6VLkA_H87wwDn6pcMUD1Jbfejl0hX3Hwb1acpqEdPY7O16Lvl98xBY3SZVEHExTDa4p8eJ1YFZJD-g6eFj12yhf5wE8Qje0UsXGQMMTmNxHonUdQKhQDJh1wFCUVRmZxLeVFzU11IEICXSil6_8fRWcqnTrt6aU3UzdST9bjort4';
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="inline-block px-2 py-0.5 bg-[#e7f0f8] text-[#0061a4] rounded text-[10px] font-bold uppercase tracking-wider">
                  {t.certPath.advancedCert}
                </span>
                {activeTarget !== 'LPIC-2' && (
                  <button
                    onClick={() => handleSelectTarget('LPIC-2')}
                    className="text-xs text-[#0061a4] hover:underline font-bold cursor-pointer"
                  >
                    {t.certPath.selectTargetPrompt}
                  </button>
                )}
              </div>
              <h3 className="font-bold text-lg text-[#201b11]">LPIC-2: Linux Engineer</h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 leading-relaxed">
                {isFrench
                  ? 'Administrer des réseaux mixtes de moyenne envergure, planification de capacité, compilation de noyau Linux personnalisé, services serveurs critiques et sécurité réseau avancée.'
                  : 'Administer small to medium-sized mixed networks, capacity planning, custom kernel compilation, core network services, and advanced network security.'}
              </p>

              <div className="flex flex-wrap gap-2.5 mt-2">
                <span className="text-[11px] font-semibold text-[#4f4632] bg-[#f8ecdb] px-2.5 py-1 rounded">
                  {t.certPath.prerequisites}: <strong className="text-[#201b11]">LPIC-1</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#4f4632] bg-[#f8ecdb] px-2.5 py-1 rounded">
                  {isFrench ? 'Examens requis' : 'Exams'}: <strong className="text-[#201b11]">201-450 & 202-450</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam 201 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 201-450</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#0061a4]/10 px-2 py-0.5 rounded">
                    Topics 200-206
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Planification de capacité, Noyau Linux, Démarrage et récupération système, Systèmes de fichiers et périphériques, Stockage avancé (RAID/LVM), Configuration réseau.'
                    : 'Capacity Planning, Linux Kernel, System Startup & Recovery, Filesystems & Devices, Storage (RAID/LVM), Network Config.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-201'].masteredCount} / {examStats['exam-201'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#0061a4]">{examStats['exam-201'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#0061a4] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-201'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-200') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-201')}
                    className="py-2 px-1 bg-[#0061a4] hover:bg-[#004f87] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 202 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 202-450</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#0061a4]/10 px-2 py-0.5 rounded">
                    Topics 207-212
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Serveur DNS (BIND 9), Services Web (Apache, Nginx, Squid), Partage de fichiers (Samba, NFS), Gestion des clients réseau, Messagerie (Postfix, Dovecot), Sécurité système.'
                    : 'DNS (BIND 9), Web Services (Apache, Nginx, Squid), File Sharing (Samba, NFS), Client Management, E-Mail (Postfix, Dovecot), System Security.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-202'].masteredCount} / {examStats['exam-202'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#0061a4]">{examStats['exam-202'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#0061a4] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-202'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-207') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-202')}
                    className="py-2 px-1 bg-[#0061a4] hover:bg-[#004f87] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: LPIC-3 Enterprise (All 4 Specialties: 300, 303, 305, 306) */}
        <div
          className={`bg-[#ffffff] rounded-xl p-5 md:p-6 transition-all shadow-xs border-2 ${
            activeTarget.startsWith('LPIC-3')
              ? 'border-[#5c3566] ring-2 ring-[#5c3566]/30'
              : 'border-[#d3c5ab] hover:border-[#5c3566]'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-3 Badge"
                className="w-full h-full object-contain"
                src="/lpic-3.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmRaFxknGKrNHxwrRWV28s6imunV2CdXxsTNSHFNa4_E7DRDR4tFOJBcjHlNHEXwgqJAUCsflt6iM4Yqy67XtL-H8rw_dvAvIsLxicLfd1UTUvAMCqU6gbylTLUTvr-qM_fdpbwM53vuo33O_jxeb65pUr3AqsnTSj3r1SMGbmyTvoUtfHroz6Wk-p0PigZrF4SQPzshVg5FbxE62XKMivpJrD-5wZ1LaDpKYl5PUe7nQjvlQ1WJCB';
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 bg-[#5c3566]/10 text-[#5c3566] rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                {t.certPath.enterpriseCert}
              </span>
              <h3 className="font-bold text-lg text-[#201b11]">
                LPIC-3: Enterprise Professional (4 Spécialisations au choix)
              </h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 leading-relaxed">
                {isFrench
                  ? 'Plus haut niveau de certification Linux : réussissez UN seul des 4 examens de spécialité ci-dessous pour obtenir le titre d\'expert certifié LPIC-3.'
                  : 'Highest level Linux certification for enterprise specialists: Pass ANY ONE of the 4 specialty exams below to earn your LPIC-3 certification.'}
              </p>

              <div className="flex flex-wrap gap-2.5 mt-2">
                <span className="text-[11px] font-semibold text-[#4f4632] bg-[#f8ecdb] px-2.5 py-1 rounded">
                  {t.certPath.prerequisites}: <strong className="text-[#201b11]">LPIC-2</strong>
                </span>
                <span className="text-[11px] font-semibold text-[#5c3566] bg-[#5c3566]/10 px-2.5 py-1 rounded">
                  {isFrench ? 'Règle : 1 seul examen requis parmi les 4' : 'Rule: 1 exam required out of 4'}
                </span>
              </div>
            </div>
          </div>

          {/* Grid of all 4 LPIC-3 Specialties: 300, 303, 305, 306 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Exam 305: Virtualization & Containers (Highlighted) */}
            <div
              className={`p-4 border rounded-lg flex flex-col justify-between relative overflow-hidden ${
                activeTarget.includes('305')
                  ? 'border-[#0284c7] bg-[#f0f9ff] ring-1 ring-[#0284c7]'
                  : 'border-[#d3c5ab] bg-[#fff8f2]'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0284c7]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 305-300</h4>
                  <span className="text-[11px] font-bold text-[#0284c7] bg-[#0284c7]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'Virtualisation & Conteneurs' : 'Virtualization & Containers'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Thèmes 351–353 : Virtualisation complète (Xen, QEMU, KVM, Libvirt, images qcow2/raw), Conteneurs Linux (cgroups, namespaces, LXC, Podman/Docker), Déploiement cloud-init, Packer & Vagrant.'
                    : 'Topics 351–353: Full Virtualization (Xen, QEMU, KVM, Libvirt, disk images), Linux Containers (cgroups, namespaces, LXC, Podman/Docker), Cloud deployment with cloud-init, Packer & Vagrant.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-305'].masteredCount} / {examStats['exam-305'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#0284c7]">{examStats['exam-305'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#0284c7] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-305'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-351') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-305')}
                    className="py-2 px-1 bg-[#0284c7] hover:bg-[#0369a1] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 303: Security */}
            <div
              className={`p-4 border rounded-lg flex flex-col justify-between relative overflow-hidden ${
                activeTarget.includes('303')
                  ? 'border-[#991b1b] bg-[#fef2f2] ring-1 ring-[#991b1b]'
                  : 'border-[#d3c5ab] bg-[#fff8f2]'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#991b1b]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 303-300</h4>
                  <span className="text-[11px] font-bold text-[#991b1b] bg-[#991b1b]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'Sécurité d\'Entreprise' : 'Enterprise Security'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Thèmes 325–328 : Cryptographie (PKI, X.509, LUKS, TLS, DNSSEC), Sécurité des hôtes (Durcissement, Audit, AIDE, PAM), Contrôle d\'accès (ACLs, SELinux, AppArmor) et Sécurité réseau (FreeRADIUS, IDS/IPS, VPN).'
                    : 'Topics 325–328: Cryptography (PKI, X.509, LUKS, TLS, DNSSEC), Host Security (Hardening, Audit, AIDE, PAM), Access Control (ACLs, SELinux, AppArmor), and Network Security (FreeRADIUS, IDS/IPS, VPN).'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-303'].masteredCount} / {examStats['exam-303'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#991b1b]">{examStats['exam-303'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#991b1b] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-303'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-325') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-303')}
                    className="py-2 px-1 bg-[#991b1b] hover:bg-[#7f1d1d] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 306: High Availability & Storage */}
            <div
              className={`p-4 border rounded-lg flex flex-col justify-between relative overflow-hidden ${
                activeTarget.includes('306')
                  ? 'border-[#047857] bg-[#ecfdf5] ring-1 ring-[#047857]'
                  : 'border-[#d3c5ab] bg-[#fff8f2]'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#047857]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 306-300</h4>
                  <span className="text-[11px] font-bold text-[#047857] bg-[#047857]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'HA & Grappes de Stockage' : 'HA & Storage Clusters'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Thèmes 361–364 : Grappes haute disponibilité (Pacemaker, Corosync, STONITH, LVS, Keepalived), Stockage en cluster (DRBD, SAN/iSCSI, GFS2/OCFS2), Stockage distribué (Ceph, GlusterFS) et tolérance de panne.'
                    : 'Topics 361–364: HA Clusters (Pacemaker, Corosync, STONITH, LVS, Keepalived), Cluster Storage (DRBD, SAN/iSCSI, GFS2/OCFS2), Distributed Storage (Ceph, GlusterFS) and node fault tolerance.'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-306'].masteredCount} / {examStats['exam-306'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#047857]">{examStats['exam-306'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#047857] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-306'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-361') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-306')}
                    className="py-2 px-1 bg-[#047857] hover:bg-[#065f46] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 300: Mixed Environments & Samba */}
            <div
              className={`p-4 border rounded-lg flex flex-col justify-between relative overflow-hidden ${
                activeTarget.includes('300')
                  ? 'border-[#5c3566] bg-[#faf5ff] ring-1 ring-[#5c3566]'
                  : 'border-[#d3c5ab] bg-[#fff8f2]'
              }`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5c3566]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 300-300</h4>
                  <span className="text-[11px] font-bold text-[#5c3566] bg-[#5c3566]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'Environnements Mixtes & Samba' : 'Mixed Environments & Samba'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3 leading-relaxed">
                  {isFrench
                    ? 'Thèmes 301–305 : Fondamentaux Samba, Samba comme contrôleur de domaine Active Directory (AD DC), Sécurité des partages, Authentification client (SSSD/Winbind/CIFS) et gestion des identités (FreeIPA, NFSv4).'
                    : 'Topics 301–305: Samba Basics, Samba as AD DC & Member Server, Share Security, Client Auth (SSSD/Winbind/CIFS), and Linux Identity Management (FreeIPA, NFSv4).'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">
                    {examStats['exam-300'].masteredCount} / {examStats['exam-300'].totalCount} {isFrench ? 'objectifs' : 'objectives'}
                  </span>
                  <span className="font-bold text-[#5c3566]">{examStats['exam-300'].pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-[#5c3566] rounded-full transition-all duration-500"
                    style={{ width: `${examStats['exam-300'].pct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-301') : onNavigate('learning'))}
                    className="py-2 px-1 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.objectivesBtn}</span>
                  </button>
                  <button
                    onClick={() => onStartExam('exam-300')}
                    className="py-2 px-1 bg-[#5c3566] hover:bg-[#472750] text-[#ffffff] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.examPracticeBtn}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('training')}
                    className="py-2 px-1 bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] rounded-md font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.certPath.labsBtn}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      </>
      )}
    </div>
  );
};
