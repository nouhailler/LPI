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
  BookOpen
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

type ExamFilter = 'all' | '101' | '102';

const TOPIC_NAMES: Record<number, { fr: string; en: string }> = {
  101: { fr: 'Topic 101 — Architecture Système', en: 'Topic 101 — System Architecture' },
  102: { fr: 'Topic 102 — Installation Linux & Paquets', en: 'Topic 102 — Linux Installation & Packages' },
  103: { fr: 'Topic 103 — Commandes GNU & Unix', en: 'Topic 103 — GNU & Unix Commands' },
  104: { fr: 'Topic 104 — Périphériques & Fichiers FHS', en: 'Topic 104 — Devices & Filesystems' },
  105: { fr: 'Topic 105 — Shells, Scripting & Environnement', en: 'Topic 105 — Shells & Scripting' },
  106: { fr: 'Topic 106 — Interfaces Utilisateur & Graphique', en: 'Topic 106 — User Interfaces & Desktops' },
  107: { fr: 'Topic 107 — Tâches Administratives & Cron', en: 'Topic 107 — Administrative Tasks' },
  108: { fr: 'Topic 108 — Services Système Essentiels & Logs', en: 'Topic 108 — Essential System Services' },
  109: { fr: 'Topic 109 — Notions Fondamentales Réseau', en: 'Topic 109 — Networking Fundamentals' },
  110: { fr: 'Topic 110 — Sécurité de l\'Hôte & SSH', en: 'Topic 110 — Security & SSH' },
};

export const SequencingModule: React.FC<Props> = ({ challenges, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [selectedExam, setSelectedExam] = useState<ExamFilter>('all');
  const [selectedTopic, setSelectedTopic] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSteps, setCurrentSteps] = useState<SequencingStep[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Filter challenges by exam and topic
  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      // Exam filter
      if (selectedExam === '101') {
        if (!(c.topicNumber >= 101 && c.topicNumber <= 104)) return false;
      } else if (selectedExam === '102') {
        if (!(c.topicNumber >= 105 && c.topicNumber <= 110)) return false;
      }

      // Topic filter
      if (selectedTopic !== 'all') {
        if (c.topicNumber !== selectedTopic) return false;
      }

      return true;
    });
  }, [challenges, selectedExam, selectedTopic]);

  // Available topics for current exam filter
  const availableTopics = useMemo(() => {
    const topicSet = new Set<number>();
    challenges.forEach((c) => {
      if (selectedExam === '101' && (c.topicNumber < 101 || c.topicNumber > 104)) return;
      if (selectedExam === '102' && (c.topicNumber < 105 || c.topicNumber > 110)) return;
      topicSet.add(c.topicNumber);
    });
    return Array.from(topicSet).sort((a, b) => a - b);
  }, [challenges, selectedExam]);

  // Handle filter changes
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

  // Stats
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
                {isFr ? 'Exercices d\'ordonnancement LPIC-1 (40 Procédures)' : 'LPIC-1 Sequencing (40 Procedures)'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#006064]/10 text-[#006064] border border-[#006064]/20">
                100% LPIC-1
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

      {/* Filter Toolbar: Exam Selection & Topic Selection */}
      <div className="bg-white p-4 rounded-xl border border-[#d3c5ab]/80 shadow-xs space-y-3">
        {/* Exam Segmented Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#4f4632] flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5 text-[#785a00]" />
              {isFr ? 'Examen :' : 'Exam:'}
            </span>
            <button
              type="button"
              onClick={() => handleExamChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedExam === 'all'
                  ? 'bg-[#785a00] text-white shadow-xs'
                  : 'bg-stone-100 text-[#60553e] hover:bg-stone-200'
              }`}
            >
              {isFr ? 'Tous les examens LPIC-1 (40)' : 'All LPIC-1 (40)'}
            </button>
            <button
              type="button"
              onClick={() => handleExamChange('101')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedExam === '101'
                  ? 'bg-[#006064] text-white shadow-xs'
                  : 'bg-[#e0f7fa] text-[#006064] hover:bg-[#b2ebf2]'
              }`}
            >
              {isFr ? 'Examen 101 (20)' : 'Exam 101 (20)'}
            </button>
            <button
              type="button"
              onClick={() => handleExamChange('102')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedExam === '102'
                  ? 'bg-[#2e7d32] text-white shadow-xs'
                  : 'bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9]'
              }`}
            >
              {isFr ? 'Examen 102 (20)' : 'Exam 102 (20)'}
            </button>
          </div>

          {/* Quick Jump Dropdown */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#817660]" />
            <select
              value={currentIndex}
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
              className="text-xs bg-[#fdfaf5] border border-[#d3c5ab] rounded-lg px-2.5 py-1.5 font-medium text-[#201b11] focus:ring-1 focus:ring-[#785a00] max-w-[240px] truncate cursor-pointer"
            >
              {filteredChallenges.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {idx + 1}. {isFr && item.titleFr ? item.titleFr : item.title}
                </option>
              ))}
            </select>
          </div>
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
                  current.topicNumber <= 104
                    ? 'bg-[#006064]/15 text-[#006064] border border-[#006064]/30'
                    : 'bg-[#2e7d32]/15 text-[#2e7d32] border border-[#2e7d32]/30'
                }`}
              >
                {current.topicNumber <= 104 ? 'LPIC-1 • EXAMEN 101' : 'LPIC-1 • EXAMEN 102'}
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
