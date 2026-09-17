import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Link2,
  Filter,
  Layers,
  GraduationCap
} from 'lucide-react';
import { MatchingGame } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  games: MatchingGame[];
  onScoreUpdate?: (points: number) => void;
}

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

export const MatchingModule: React.FC<Props> = ({ games, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [selectedCert, setSelectedCert] = useState<CertFilter>('all');
  const [selectedExam, setSelectedExam] = useState<ExamFilter>('all');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [mismatchError, setMismatchError] = useState<boolean>(false);
  const [shuffledRight, setShuffledRight] = useState<{ id: string; text: string; note?: string }[]>([]);
  const [completedGameIds, setCompletedGameIds] = useState<Set<string>>(new Set());

  // Filter games based on selected cert and exam
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // Cert filter
      if (selectedCert === 'lpic-1' && g.certification !== 'lpic-1') return false;
      if (selectedCert === 'lpic-2' && g.certification !== 'lpic-2') return false;
      if (selectedCert === 'lpic-3' && g.certification !== 'lpic-3') return false;

      // Exam filter
      if (selectedExam === '101') {
        if (!(g.topicNumber >= 101 && g.topicNumber <= 104)) return false;
      } else if (selectedExam === '102') {
        if (!(g.topicNumber >= 105 && g.topicNumber <= 110)) return false;
      } else if (selectedExam === '201') {
        if (!(g.topicNumber >= 200 && g.topicNumber <= 206)) return false;
      } else if (selectedExam === '202') {
        if (!(g.topicNumber >= 207 && g.topicNumber <= 212)) return false;
      } else if (selectedExam === '300') {
        if (!(g.topicNumber >= 301 && g.topicNumber <= 306)) return false;
      } else if (selectedExam === '303') {
        if (!(g.topicNumber >= 321 && g.topicNumber <= 324)) return false;
      } else if (selectedExam === '305') {
        if (!(g.topicNumber >= 351 && g.topicNumber <= 354)) return false;
      } else if (selectedExam === '306') {
        if (!(g.topicNumber >= 361 && g.topicNumber <= 364)) return false;
      }

      return true;
    });
  }, [games, selectedCert, selectedExam]);

  // Keep index within bounds
  useEffect(() => {
    setCurrentGameIndex(0);
  }, [selectedCert, selectedExam]);

  const current = filteredGames[currentGameIndex] || filteredGames[0];

  // Prepare shuffled right column whenever current game changes
  useEffect(() => {
    if (current) {
      setSelectedLeftId(null);
      setSelectedRightId(null);
      setMatchedPairs(new Set());
      setMismatchError(false);

      const rightItems = current.pairs.map((p) => ({
        id: p.id,
        text: isFr && p.rightFr ? p.rightFr : p.right,
        note: isFr && p.noteFr ? p.noteFr : p.note,
      }));
      setShuffledRight(shuffleArray(rightItems));
    }
  }, [currentGameIndex, current, isFr]);

  // Available exams list for the current cert
  const availableExams = useMemo(() => {
    if (selectedCert === 'lpic-1') {
      const count101 = games.filter((g) => g.certification === 'lpic-1' && g.topicNumber >= 101 && g.topicNumber <= 104).length;
      const count102 = games.filter((g) => g.certification === 'lpic-1' && g.topicNumber >= 105 && g.topicNumber <= 110).length;
      return [
        { id: 'all' as ExamFilter, label: isFr ? 'Tous les examens' : 'All Exams', count: count101 + count102 },
        { id: '101' as ExamFilter, label: 'Examen 101', count: count101 },
        { id: '102' as ExamFilter, label: 'Examen 102', count: count102 },
      ];
    }
    if (selectedCert === 'lpic-2') {
      const count201 = games.filter((g) => g.certification === 'lpic-2' && g.topicNumber >= 200 && g.topicNumber <= 206).length;
      const count202 = games.filter((g) => g.certification === 'lpic-2' && g.topicNumber >= 207 && g.topicNumber <= 212).length;
      return [
        { id: 'all' as ExamFilter, label: isFr ? 'Tous les examens' : 'All Exams', count: count201 + count202 },
        { id: '201' as ExamFilter, label: 'Examen 201', count: count201 },
        { id: '202' as ExamFilter, label: 'Examen 202', count: count202 },
      ];
    }
    if (selectedCert === 'lpic-3') {
      const count300 = games.filter((g) => g.certification === 'lpic-3' && g.topicNumber >= 301 && g.topicNumber <= 306).length;
      const count303 = games.filter((g) => g.certification === 'lpic-3' && g.topicNumber >= 321 && g.topicNumber <= 324).length;
      const count305 = games.filter((g) => g.certification === 'lpic-3' && g.topicNumber >= 351 && g.topicNumber <= 354).length;
      const count306 = games.filter((g) => g.certification === 'lpic-3' && g.topicNumber >= 361 && g.topicNumber <= 364).length;
      return [
        { id: 'all' as ExamFilter, label: isFr ? 'Toutes spécialités' : 'All Specialties', count: count300 + count303 + count305 + count306 },
        { id: '300' as ExamFilter, label: '300 (Mixed Env)', count: count300 },
        { id: '303' as ExamFilter, label: '303 (Security)', count: count303 },
        { id: '305' as ExamFilter, label: '305 (Virt & Cont)', count: count305 },
        { id: '306' as ExamFilter, label: '306 (HA & Storage)', count: count306 },
      ];
    }
    return [
      { id: 'all' as ExamFilter, label: isFr ? 'Tous les examens' : 'All Exams', count: games.length }
    ];
  }, [selectedCert, games, isFr]);

  const handleSelectCert = (cert: CertFilter) => {
    setSelectedCert(cert);
    setSelectedExam('all');
  };

  const handleSelectLeft = (id: string) => {
    if (matchedPairs.has(id)) return;
    setMismatchError(false);
    setSelectedLeftId(id);

    if (selectedRightId) {
      checkMatch(id, selectedRightId);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedPairs.has(id)) return;
    setMismatchError(false);
    setSelectedRightId(id);

    if (selectedLeftId) {
      checkMatch(selectedLeftId, id);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const newMatched = new Set(matchedPairs);
      newMatched.add(leftId);
      setMatchedPairs(newMatched);
      setSelectedLeftId(null);
      setSelectedRightId(null);

      if (current && newMatched.size === current.pairs.length) {
        if (!completedGameIds.has(current.id)) {
          const next = new Set(completedGameIds);
          next.add(current.id);
          setCompletedGameIds(next);
          if (onScoreUpdate) onScoreUpdate(25);
        }
      }
    } else {
      setMismatchError(true);
      setTimeout(() => {
        setSelectedLeftId(null);
        setSelectedRightId(null);
        setMismatchError(false);
      }, 750);
    }
  };

  const handleReset = () => {
    if (!current) return;
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setMatchedPairs(new Set());
    setMismatchError(false);
    const rightItems = current.pairs.map((p) => ({
      id: p.id,
      text: isFr && p.rightFr ? p.rightFr : p.right,
      note: isFr && p.noteFr ? p.noteFr : p.note,
    }));
    setShuffledRight(shuffleArray(rightItems));
  };

  const handleNext = () => {
    if (currentGameIndex < filteredGames.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      setCurrentGameIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentGameIndex > 0) {
      setCurrentGameIndex(currentGameIndex - 1);
    } else {
      setCurrentGameIndex(filteredGames.length - 1);
    }
  };

  const getExamBadge = (topic: number, cert: string) => {
    if (cert === 'lpic-3') {
      if (topic >= 301 && topic <= 306) {
        return { label: 'LPIC-3 • Exam 300 (Identity)', color: 'bg-sky-50 text-sky-800 border-sky-300' };
      }
      if (topic >= 321 && topic <= 324) {
        return { label: 'LPIC-3 • Exam 303 (Security)', color: 'bg-rose-50 text-rose-800 border-rose-300' };
      }
      if (topic >= 351 && topic <= 354) {
        return { label: 'LPIC-3 • Exam 305 (Virt/Cont)', color: 'bg-amber-50 text-amber-900 border-amber-300' };
      }
      if (topic >= 361 && topic <= 364) {
        return { label: 'LPIC-3 • Exam 306 (HA/Storage)', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
      }
      return { label: 'LPIC-3 Specialist', color: 'bg-purple-50 text-purple-800 border-purple-300' };
    }
    if (cert === 'lpic-2') {
      if (topic >= 200 && topic <= 206) {
        return { label: 'LPIC-2 • Exam 201', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      }
      return { label: 'LPIC-2 • Exam 202', color: 'bg-teal-50 text-teal-800 border-teal-300' };
    }
    if (topic >= 101 && topic <= 104) {
      return { label: 'LPIC-1 • Exam 101', color: 'bg-[#ffc20e]/15 text-[#785a00] border-[#ffc20e]/30' };
    }
    return { label: 'LPIC-1 • Exam 102', color: 'bg-[#e09b00]/15 text-[#624400] border-[#e09b00]/30' };
  };

  const isAllMatched = current ? matchedPairs.size === current.pairs.length : false;
  const badgeInfo = current ? getExamBadge(current.topicNumber, current.certification) : null;
  const title = current ? (isFr && current.titleFr ? current.titleFr : current.title) : '';
  const description = current ? (isFr && current.descriptionFr ? current.descriptionFr : current.description) : '';

  const lpic1Count = games.filter((g) => g.certification === 'lpic-1').length;
  const lpic2Count = games.filter((g) => g.certification === 'lpic-2').length;
  const lpic3Count = games.filter((g) => g.certification === 'lpic-3').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#d3c5ab]/70 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#9c27b0]/10 text-[#9c27b0] flex items-center justify-center font-bold">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#201b11]">
              {isFr ? 'Ateliers d\'appariement (Matching Games)' : 'Matching Games'}
            </h3>
            <p className="text-xs text-[#817660]">
              {isFr
                ? 'Associez chaque terme ou commande de gauche à son équivalent exact à droite pour consolider vos réflexes'
                : 'Match each command or term on the left with its exact role on the right to build instant memory reflexes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[#f8ecdb] text-[#785a00] rounded-lg">
            <Award className="w-3.5 h-3.5" />
            <span>
              {completedGameIds.size} / {games.length} {isFr ? 'réussis' : 'completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Navigation Bar */}
      <div className="bg-white rounded-xl border border-[#d3c5ab] p-4 shadow-xs space-y-3">
        {/* Certification Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#817660] flex items-center gap-1.5 mr-1">
            <GraduationCap className="w-4 h-4 text-[#785a00]" />
            <span>{isFr ? 'Certification :' : 'Certification:'}</span>
          </span>

          <button
            type="button"
            onClick={() => handleSelectCert('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCert === 'all'
                ? 'bg-[#201b11] text-[#f7f4ea] border-[#201b11] shadow-xs'
                : 'bg-white text-[#60553e] border-[#d3c5ab] hover:bg-[#fdfbf7]'
            }`}
          >
            {isFr ? 'Toutes' : 'All'} ({games.length})
          </button>

          <button
            type="button"
            onClick={() => handleSelectCert('lpic-1')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCert === 'lpic-1'
                ? 'bg-[#ffc20e] text-[#6d5100] border-[#785a00] shadow-xs ring-1 ring-[#785a00]'
                : 'bg-white text-[#60553e] border-[#d3c5ab] hover:bg-[#fdfbf7]'
            }`}
          >
            LPIC-1 ({lpic1Count})
          </button>

          <button
            type="button"
            onClick={() => handleSelectCert('lpic-2')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCert === 'lpic-2'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-[#60553e] border-[#d3c5ab] hover:bg-[#fdfbf7]'
            }`}
          >
            LPIC-2 ({lpic2Count})
          </button>

          <button
            type="button"
            onClick={() => handleSelectCert('lpic-3')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCert === 'lpic-3'
                ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                : 'bg-white text-[#60553e] border-[#d3c5ab] hover:bg-[#fdfbf7]'
            }`}
          >
            LPIC-3 ({lpic3Count})
          </button>
        </div>

        {/* Exam / Specialty Selector (when cert is filtered) */}
        {selectedCert !== 'all' && availableExams.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#ebdcc8]/80">
            <span className="text-xs font-bold text-[#817660] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#785a00]" />
              <span>{isFr ? 'Examen / Spécialité :' : 'Exam / Specialty:'}</span>
            </span>

            {availableExams.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExam(ex.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  selectedExam === ex.id
                    ? 'bg-[#ebdcc8] text-[#554625] border-[#b5a790] font-bold shadow-2xs'
                    : 'bg-[#faf8f4] text-[#817660] border-transparent hover:border-[#d3c5ab]'
                }`}
              >
                {ex.label} <span className="opacity-70 text-[11px]">({ex.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Direct Jump Selector */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#ebdcc8]/80 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <span className="text-xs font-bold text-[#817660] whitespace-nowrap">
              {isFr ? 'Saut rapide :' : 'Quick jump:'}
            </span>
            <select
              value={currentGameIndex}
              onChange={(e) => setCurrentGameIndex(Number(e.target.value))}
              className="w-full text-xs bg-[#faf8f4] border border-[#d3c5ab] rounded-lg px-2.5 py-1.5 text-[#201b11] focus:outline-none focus:ring-1 focus:ring-[#785a00] cursor-pointer"
            >
              {filteredGames.map((g, idx) => (
                <option key={g.id} value={idx}>
                  {idx + 1}. [Obj {g.objectiveId}] {isFr && g.titleFr ? g.titleFr : g.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevious}
              className="p-1.5 rounded-lg border border-[#d3c5ab] text-[#4f4632] hover:bg-[#ebdcc8]/40 transition-all cursor-pointer"
              title={isFr ? 'Précédent' : 'Previous'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#817660] px-1">
              {currentGameIndex + 1} / {filteredGames.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-[#d3c5ab] text-[#4f4632] hover:bg-[#ebdcc8]/40 transition-all cursor-pointer"
              title={isFr ? 'Suivant' : 'Next'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Matching Card */}
      {!current ? (
        <div className="p-8 text-center bg-white rounded-xl border border-[#d3c5ab] text-[#817660]">
          {isFr ? 'Aucun atelier d\'appariement disponible pour ce filtre.' : 'No matching game available for this filter.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-3.5 bg-[#fdf8f0] border-b border-[#ebdcc8] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {badgeInfo && (
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badgeInfo.color}`}>
                  {badgeInfo.label}
                </span>
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                Obj {current.objectiveId}
              </span>
              <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
            </div>

            <span className="text-xs font-bold text-[#817660]">
              {isFr ? 'Atelier' : 'Game'} {currentGameIndex + 1} / {filteredGames.length}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Description */}
            <div className="space-y-1">
              <h4 className="text-base md:text-lg font-bold text-[#201b11]">{title}</h4>
              <p className="text-xs text-[#60553e] leading-relaxed">{description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#817660]">
                <span>{isFr ? 'Paires associées :' : 'Matched Pairs:'}</span>
                <span className="text-[#201b11]">
                  {matchedPairs.size} / {current.pairs.length}
                </span>
              </div>
              <div className="w-full bg-[#ebdcc8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2e7d32] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(matchedPairs.size / current.pairs.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Dual Columns for Matching */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#817660] px-1 flex items-center justify-between">
                  <span>{isFr ? 'Terme / Directive / Commande' : 'Term / Directive / Command'}</span>
                  <span className="text-[11px] font-normal text-[#817660] lowercase">
                    ({current.pairs.length} {isFr ? 'éléments' : 'items'})
                  </span>
                </div>
                <div className="space-y-2">
                  {current.pairs.map((p) => {
                    const isMatched = matchedPairs.has(p.id);
                    const isSelected = selectedLeftId === p.id;
                    const isError = isSelected && mismatchError;

                    return (
                      <button
                        key={`left-${p.id}`}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectLeft(p.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isMatched
                            ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] opacity-85 cursor-default'
                            : isError
                            ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828] ring-2 ring-[#d32f2f]'
                            : isSelected
                            ? 'bg-[#fdf3e2] border-[#785a00] text-[#785a00] ring-2 ring-[#785a00]'
                            : 'bg-white border-[#d3c5ab] text-[#201b11] hover:bg-[#fffdfa] hover:border-[#b5a790]'
                        }`}
                      >
                        <span className="font-mono text-xs break-all">{isFr && p.leftFr ? p.leftFr : p.left}</span>
                        {isMatched && <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (Shuffled) */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#817660] px-1 flex items-center justify-between">
                  <span>{isFr ? 'Rôle / Définition / Comportement' : 'Role / Definition / Behavior'}</span>
                  <span className="text-[11px] font-normal text-[#817660]">
                    {isFr ? 'Cliquez pour apparier' : 'Click to match'}
                  </span>
                </div>
                <div className="space-y-2">
                  {shuffledRight.map((item) => {
                    const isMatched = matchedPairs.has(item.id);
                    const isSelected = selectedRightId === item.id;
                    const isError = isSelected && mismatchError;

                    return (
                      <button
                        key={`right-${item.id}`}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleSelectRight(item.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                          isMatched
                            ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] opacity-85 cursor-default font-semibold'
                            : isError
                            ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828] ring-2 ring-[#d32f2f]'
                            : isSelected
                            ? 'bg-[#fdf3e2] border-[#785a00] text-[#785a00] ring-2 ring-[#785a00] font-semibold'
                            : 'bg-white border-[#d3c5ab] text-[#4f4632] hover:bg-[#fffdfa] hover:border-[#b5a790]'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="leading-snug">{item.text}</div>
                          {isMatched && item.note && (
                            <div className="text-[11px] text-[#2e7d32] opacity-90 mt-1 italic">
                              💡 {item.note}
                            </div>
                          )}
                        </div>
                        {isMatched && <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Bar / Completion Feedback */}
            {isAllMatched ? (
              <div className="p-4 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-center justify-between gap-3 animate-fade-in flex-wrap">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2e7d32] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#1b5e20]">
                      {isFr ? 'Bravo ! Toutes les paires ont été correctement associées.' : 'Congratulations! All pairs correctly matched.'}
                    </div>
                    <div className="text-[11px] text-[#2e7d32]">
                      {isFr ? '+25 points enregistrés sur votre score d\'entraînement.' : '+25 points earned on your practice score.'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 text-xs font-semibold text-[#1b5e20] hover:bg-[#c8e6c9] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Recommencer' : 'Replay'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>{isFr ? 'Atelier suivant' : 'Next Game'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-[#ebdcc8]/80">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Réinitialiser cet atelier' : 'Reset this game'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-semibold text-[#4f4632] hover:bg-[#ebdcc8]/50 border border-[#d3c5ab] rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>{isFr ? 'Passer' : 'Skip'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
