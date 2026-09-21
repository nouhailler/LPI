import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Lightbulb,
  Baby,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Check,
  Copy,
  ChevronRight,
  RefreshCw,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { PedagogicalMode, PedagogicalTopic, PEDAGOGICAL_TOPICS } from '../data/pedagogicalExplanations';
import { fetchPedagogicalExplanation, ExplanationResult } from '../services/explainDifferentlyService';
import { useLanguage } from '../i18n/LanguageContext';
import { MarkdownView } from './MarkdownView';

interface ExplainDifferentlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialMode?: PedagogicalMode;
  contextSnippet?: string;
  onOpenTerminalLab?: (labId?: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const ExplainDifferentlyModal: React.FC<ExplainDifferentlyModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'umask',
  initialMode = 'simple',
  contextSnippet,
  onOpenTerminalLab,
  onNavigateTab,
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic || 'umask');
  const [activeMode, setActiveMode] = useState<PedagogicalMode>(initialMode || 'simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [data, setData] = useState<ExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  // Sync initial topic when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTopic) {
        setCurrentTopic(initialTopic);
      }
      if (initialMode) {
        setActiveMode(initialMode);
      }
      setSelectedQuizAnswer(null);
      setHasSubmittedQuiz(false);
      setAiErrorMessage(null);
    }
  }, [isOpen, initialTopic, initialMode]);

  // Load explanation whenever topic, mode, or language changes
  useEffect(() => {
    if (!isOpen || !currentTopic) return;

    let isMounted = true;
    setIsLoading(true);
    setSelectedQuizAnswer(null);
    setHasSubmittedQuiz(false);
    setAiErrorMessage(null);

    fetchPedagogicalExplanation(currentTopic, activeMode, contextSnippet, isFr, false)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentTopic, activeMode, isFr, contextSnippet]);

  // Request AI generation on demand
  const handleRequestAi = async () => {
    if (isAiLoading || !currentTopic) return;
    setIsAiLoading(true);
    setAiErrorMessage(null);

    try {
      const res = await fetchPedagogicalExplanation(
        currentTopic,
        activeMode,
        contextSnippet,
        isFr,
        true
      );
      if (res.source === 'gemini') {
        setData(res);
      } else {
        setAiErrorMessage(
          isFr
            ? "L'API Gemini n'est pas configurée ou est indisponible. L'explication locale 100% hors-ligne reste active."
            : 'Gemini API is unavailable or offline. The local 100% offline pedagogical engine remains active.'
        );
      }
    } catch {
      setAiErrorMessage(
        isFr
          ? 'Mode hors-ligne : utilisation de la pédagogie locale intégrée.'
          : 'Offline mode: using built-in local pedagogy.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  const modeButtons: Array<{
    id: PedagogicalMode;
    label: string;
    labelEn: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    badge?: string;
  }> = [
    {
      id: 'simple',
      label: 'Explique simplement',
      labelEn: 'Explain simply',
      icon: BookOpen,
      accentColor: 'text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd]',
    },
    {
      id: 'beginner',
      label: 'Comme à un débutant',
      labelEn: 'Like a beginner',
      icon: Baby,
      accentColor: 'text-[#d97706] bg-[#fef3c7] border-[#fde68a]',
    },
    {
      id: 'example',
      label: 'Donne-moi un exemple',
      labelEn: 'Give me an example',
      icon: Terminal,
      accentColor: 'text-[#16a34a] bg-[#dcfce7] border-[#bbf7d0]',
    },
    {
      id: 'quiz',
      label: 'Teste-moi dessus',
      labelEn: 'Test me on this',
      icon: HelpCircle,
      accentColor: 'text-[#7c3aed] bg-[#ede9fe] border-[#ddd6fe]',
    },
    {
      id: 'trap',
      label: 'Piège d\'examen',
      labelEn: 'Exam trap',
      icon: AlertTriangle,
      accentColor: 'text-[#dc2626] bg-[#fee2e2] border-[#fecaca]',
      badge: 'LPIC Gotcha',
    },
  ];

  const quickConcepts = [
    { id: 'umask', name: 'umask' },
    { id: 'chmod-octal', name: 'chmod (640/755)' },
    { id: 'hard-vs-soft-links', name: 'ln vs ln -s' },
    { id: 'suid-sgid-sticky', name: 'SUID / SGID / Sticky' },
    { id: 'systemd-systemctl', name: 'systemctl & targets' },
    { id: 'find-command', name: 'find (-exec)' },
    { id: 'tar-compression', name: 'tar (-z/-j/-J)' },
    { id: 'kill-signals', name: 'kill (15 vs 9)' },
  ];

  const handleSelectQuickConcept = (topicId: string) => {
    setCurrentTopic(topicId);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentTopic(searchQuery.trim());
      setIsSearchOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f8ecdb] border-b border-[#d3c5ab] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e]/20 border border-[#ffc20e]/40 flex items-center justify-center text-[#785a00] shrink-0">
              <Lightbulb className="w-5 h-5 fill-[#ffc20e] text-[#785a00]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#785a00] bg-[#fff8f2] px-2 py-0.5 rounded-md border border-[#d3c5ab]/80">
                  {isFr ? 'Pédagogie Avancée' : 'Advanced Pedagogy'}
                </span>
                <span className="text-xs text-[#817660] font-medium hidden sm:inline">
                  « Explain it differently »
                </span>
              </div>
              <h2 className="font-sans font-bold text-lg md:text-xl text-[#201b11] truncate">
                {isFr ? 'Explique-moi autrement :' : 'Explain it differently:'}{' '}
                <span className="text-[#785a00] font-mono bg-[#ffffff] px-2 py-0.5 rounded-lg border border-[#d3c5ab]">
                  {data?.title || currentTopic}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="explain-switch-concept-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#ffffff] hover:bg-[#ebdcc8] text-[#4f4632] border border-[#d3c5ab] flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isFr ? 'Changer de concept' : 'Change concept'}
            >
              <Search className="w-3.5 h-3.5 text-[#785a00]" />
              <span className="hidden sm:inline">{isFr ? 'Changer' : 'Switch'}</span>
            </button>
            <button
              id="close-explain-modal-btn"
              onClick={onClose}
              aria-label="Fermer"
              className="p-1.5 rounded-full text-[#817660] hover:bg-[#ebdcc8] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Concept Bar / Search Drawer */}
        <div className="px-5 py-2.5 bg-[#fef9f4] border-b border-[#ebdcc8] flex flex-col gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleCustomSearchSubmit} className="flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isFr
                      ? 'Tapez n\'importe quelle commande ou concept (ex: umask, cron, sed, ip route...)'
                      : 'Type any command or concept (e.g., umask, cron, sed, ip route...)'
                  }
                  autoFocus
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#d3c5ab] bg-[#ffffff] text-[#201b11] placeholder:text-[#817660] focus:outline-hidden focus:border-[#785a00]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isFr ? 'Expliquer' : 'Explain'}
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-xs text-[#817660] hover:bg-[#ebdcc8] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-[#817660] uppercase tracking-wider shrink-0 mr-1">
                {isFr ? 'Concepts phares :' : 'Popular topics:'}
              </span>
              {quickConcepts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectQuickConcept(item.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    currentTopic === item.id || currentTopic.toLowerCase() === item.name.toLowerCase()
                      ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                      : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#ebdcc8] border border-[#d3c5ab]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5 Pedagogical Mode Buttons (The Core Requirement) */}
        <div className="px-5 pt-3.5 pb-2 bg-[#fff8f2] border-b border-[#ebdcc8]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {modeButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = activeMode === btn.id;
              return (
                <button
                  key={btn.id}
                  id={`pedagogy-mode-${btn.id}-btn`}
                  onClick={() => setActiveMode(btn.id)}
                  className={`relative flex flex-col items-center justify-center text-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? `${btn.accentColor} font-bold shadow-xs ring-2 ring-offset-1 ring-current`
                      : 'bg-[#ffffff] text-[#4f4632] border-[#d3c5ab] hover:bg-[#f8ecdb]'
                  }`}
                >
                  {btn.badge && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#dc2626] text-[#ffffff] uppercase tracking-wider shadow-xs">
                      {btn.badge}
                    </span>
                  )}
                  <Icon className={`w-4 h-4 mb-1 ${isActive ? '' : 'text-[#817660]'}`} />
                  <span className="text-xs font-semibold leading-tight">
                    {isFr ? btn.label : btn.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 p-5 md:p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-[#817660]">
              <RefreshCw className="w-8 h-8 animate-spin text-[#785a00]" />
              <p className="text-sm font-medium">
                {isFr ? 'Préparation de l\'angle pédagogique...' : 'Preparing pedagogical angle...'}
              </p>
            </div>
          ) : data ? (
            <div className="space-y-4 animate-fade-in">
              {/* Category & Topic Badges */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-[#495e8a] uppercase tracking-wider bg-[#e0e7ff] px-2.5 py-1 rounded-md">
                  {data.category}
                </span>

                {data.source === 'gemini' ? (
                  <span className="text-[11px] font-bold text-[#047857] bg-[#dcfce7] border border-[#bbf7d0] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#047857]" />
                    {data.aiNotice || 'Généré par Gemini IA'}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#817660] bg-[#f8ecdb] px-2.5 py-1 rounded-full border border-[#d3c5ab] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                    {isFr ? 'Pédagogie locale 100% hors-ligne' : '100% Offline Local Pedagogy'}
                  </span>
                )}
              </div>

              {/* Mode 1: Explique simplement */}
              {activeMode === 'simple' && (
                <div className="space-y-4">
                  <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d3c5ab] shadow-xs">
                    <div className="flex items-center gap-2 text-[#0284c7] font-bold text-sm mb-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{isFr ? 'Synthèse Droit au But' : 'Direct Core Synthesis'}</span>
                    </div>
                    <MarkdownView content={data.content} />
                  </div>

                  {data.keyPoints && data.keyPoints.length > 0 && (
                    <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-2xl">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0369a1] mb-2.5 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#0284c7]" />
                        {isFr ? 'Points Clés à Retenir pour l\'Examen' : 'Key Exam Takeaways'}
                      </h4>
                      <ul className="space-y-2">
                        {data.keyPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#0c4a6e]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: Explique comme à un débutant (ELI5 / Analogy) */}
              {activeMode === 'beginner' && (
                <div className="space-y-4">
                  <div className="bg-[#fffbeb] border border-[#fde68a] p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-2 text-[#b45309] font-bold text-sm mb-1.5">
                      <Baby className="w-5 h-5 text-[#d97706]" />
                      <span>{data.analogyTitle || (isFr ? 'La Métaphore Simplifiée' : 'The Everyday Analogy')}</span>
                    </div>
                    <p className="text-xs text-[#92400e] mb-3 italic">
                      {isFr
                        ? '« Rendre le concept intuitif en le reliant à un objet ou une situation du quotidien »'
                        : '"Making the concept intuitive using an everyday real-world object or situation"'}
                    </p>
                    <div className="bg-[#ffffff] p-4 rounded-xl border border-[#fef3c7]">
                      <MarkdownView content={data.content} />
                    </div>
                  </div>

                  {data.analogyStory && (
                    <div className="bg-[#ffffff] border border-[#d3c5ab] p-4 rounded-2xl flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[#ffc20e] shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-[#4f4632] leading-relaxed">
                        <span className="font-bold text-[#201b11] block mb-0.5">
                          {isFr ? 'Pourquoi cette image mentale fonctionne :' : 'Why this mental model works:'}
                        </span>
                        {data.analogyStory}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Donne-moi un exemple (Hands-on Terminal) */}
              {activeMode === 'example' && (
                <div className="space-y-4">
                  <MarkdownView content={data.content} />

                  {data.terminalSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#817660]">
                        <span className="font-mono font-bold flex items-center gap-1.5 text-[#15803d]">
                          <Terminal className="w-4 h-4" />
                          bash terminal demo
                        </span>
                        <button
                          id="copy-pedagogy-snippet-btn"
                          onClick={() => handleCopySnippet(data.terminalSnippet || '')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffffff] hover:bg-[#ebdcc8] text-[#201b11] text-xs font-semibold border border-[#d3c5ab] cursor-pointer transition-colors"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#16a34a]" />
                              <span className="text-[#16a34a]">{isFr ? 'Copié !' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#817660]" />
                              <span>{isFr ? 'Copier' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-[#1e1e1e] text-[#f3f4f6] p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto shadow-inner leading-relaxed border border-[#374151]">
                        <pre className="font-mono">{data.terminalSnippet}</pre>
                      </div>
                    </div>
                  )}

                  {onOpenTerminalLab && (
                    <div className="p-3.5 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#14532d]">
                        <Terminal className="w-4 h-4 text-[#16a34a] shrink-0" />
                        <span>
                          {isFr
                            ? 'Envie de tester cette commande en conditions réelles sans risque ?'
                            : 'Want to run this command in our safe sandbox terminal?'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          if (onNavigateTab) onNavigateTab('training');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <span>{isFr ? 'Ouvrir l\'Atelier' : 'Open Lab'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 4: Teste-moi dessus (Interactive Mini-Quiz) */}
              {activeMode === 'quiz' && (
                <div className="space-y-4">
                  <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d3c5ab] shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#7c3aed] font-bold text-sm">
                        <HelpCircle className="w-4 h-4" />
                        <span>{isFr ? 'Défi Express de Maîtrise' : 'Mastery Check Challenge'}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#6d28d9] bg-[#ede9fe] px-2 py-0.5 rounded-md">
                        {isFr ? 'Barème LPIC-1' : 'LPIC Format'}
                      </span>
                    </div>

                    <p className="text-sm md:text-base font-semibold text-[#201b11] leading-relaxed">
                      {data.quiz?.questionFr && isFr ? data.quiz.questionFr : data.quiz?.question}
                    </p>

                    {/* Quiz Options */}
                    <div className="space-y-2 pt-1">
                      {(data.quiz?.optionsFr && isFr ? data.quiz.optionsFr : data.quiz?.options || []).map(
                        (opt, idx) => {
                          const isSelected = selectedQuizAnswer === idx;
                          const isCorrect = idx === data.quiz?.correctIndex;

                          let btnStyle =
                            'bg-[#ffffff] text-[#201b11] border-[#d3c5ab] hover:bg-[#f8ecdb]';
                          if (hasSubmittedQuiz) {
                            if (isCorrect) {
                              btnStyle = 'bg-[#dcfce7] text-[#14532d] border-[#86efac] font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-[#fee2e2] text-[#7f1d1d] border-[#fca5a5] font-semibold';
                            } else {
                              btnStyle = 'bg-[#f3f4f6] text-[#9ca3af] border-[#e5e7eb] opacity-60';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#ede9fe] text-[#5b21b6] border-[#c4b5fd] font-bold';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!hasSubmittedQuiz) {
                                  setSelectedQuizAnswer(idx);
                                }
                              }}
                              disabled={hasSubmittedQuiz}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {hasSubmittedQuiz && (
                                <div className="shrink-0 ml-2">
                                  {isCorrect ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
                                  ) : isSelected ? (
                                    <XCircle className="w-5 h-5 text-[#dc2626]" />
                                  ) : null}
                                </div>
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Submit / Reset Button */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      {!hasSubmittedQuiz ? (
                        <button
                          id="submit-pedagogy-quiz-btn"
                          onClick={() => {
                            if (selectedQuizAnswer !== null) {
                              setHasSubmittedQuiz(true);
                            }
                          }}
                          disabled={selectedQuizAnswer === null}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            selectedQuizAnswer !== null
                              ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-[#ffffff] shadow-xs'
                              : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                          }`}
                        >
                          {isFr ? 'Valider ma réponse' : 'Confirm Answer'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedQuizAnswer(null);
                            setHasSubmittedQuiz(false);
                          }}
                          className="px-4 py-2 rounded-xl border border-[#d3c5ab] bg-[#ffffff] hover:bg-[#ebdcc8] text-[#4f4632] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isFr ? 'Recommencer ce test' : 'Try Again'}</span>
                        </button>
                      )}
                    </div>

                    {/* Post-submission feedback */}
                    {hasSubmittedQuiz && data.quiz && (
                      <div
                        className={`p-4 rounded-xl border animate-fade-in ${
                          selectedQuizAnswer === data.quiz.correctIndex
                            ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#14532d]'
                            : 'bg-[#fef2f2] border-[#fecaca] text-[#7f1d1d]'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1">
                          {selectedQuizAnswer === data.quiz.correctIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                              <span>{isFr ? 'Excellente réponse !' : 'Correct Answer!'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#dc2626]" />
                              <span>{isFr ? 'Attention au piège !' : 'Watch out for the trap!'}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed mt-1">
                          {data.quiz.explanationFr && isFr
                            ? data.quiz.explanationFr
                            : data.quiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode 5: Donne-moi un piège d'examen (Gotchas & Traps) */}
              {activeMode === 'trap' && (
                <div className="space-y-4">
                  <div className="bg-[#fef2f2] border border-[#fecaca] p-5 rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-[#b91c1c] font-bold text-sm">
                        <ShieldAlert className="w-5 h-5 text-[#dc2626]" />
                        <span>{data.trapTitle || (isFr ? 'Le Piège Classique LPIC' : 'Classic LPIC Gotcha')}</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dc2626] text-[#ffffff]">
                        {data.dangerLevel === 'critical'
                          ? (isFr ? 'Danger Critique' : 'Critical Danger')
                          : (isFr ? 'Fréquent à l\'Examen' : 'High Frequency')}
                      </span>
                    </div>

                    <div className="bg-[#ffffff] p-4 rounded-xl border border-[#fee2e2]">
                      <MarkdownView content={data.content} />
                    </div>
                  </div>

                  {data.howToAvoid && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-2xl flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-[#14532d] leading-relaxed">
                        <span className="font-bold text-[#14532d] block mb-0.5">
                          {isFr ? 'La règle d\'or pour ne plus jamais se tromper :' : 'The Golden Rule to avoid this trap:'}
                        </span>
                        {data.howToAvoid}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* AI Notice / Error if any */}
          {aiErrorMessage && (
            <div className="p-3 bg-[#fffbeb] border border-[#fef3c7] rounded-xl text-xs text-[#92400e] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#d97706] shrink-0" />
              <span>{aiErrorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer with AI Extension & Navigation */}
        <div className="px-5 py-3.5 bg-[#f8ecdb] border-t border-[#d3c5ab] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              id="request-gemini-ai-explain-btn"
              onClick={handleRequestAi}
              disabled={isAiLoading}
              className="px-3 py-1.5 rounded-xl bg-[#ffffff] hover:bg-[#f2e7d6] text-[#785a00] border border-[#d3c5ab] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
              title={isFr ? 'Générer une variation avec Gemini 3.8 Flash' : 'Generate variation with Gemini 3.8 Flash'}
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#785a00]" />
                  <span>{isFr ? 'Interrogation IA...' : 'Querying AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#ffc20e]" />
                  <span>{isFr ? 'Approfondir avec Gemini IA' : 'Expand with Gemini AI'}</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            {isFr ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
