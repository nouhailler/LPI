import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Sparkles,
  Link2,
  Check
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

export const MatchingModule: React.FC<Props> = ({ games, onScoreUpdate }) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [mismatchError, setMismatchError] = useState<boolean>(false);
  const [shuffledRight, setShuffledRight] = useState<{ id: string; text: string; note?: string }[]>([]);
  const [completedGameIds, setCompletedGameIds] = useState<Set<string>>(new Set());

  const current = games[currentGameIndex] || games[0];

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

  if (!current) {
    return <div className="p-8 text-center text-[#817660]">Aucun jeu d'appariement disponible.</div>;
  }

  const title = isFr && current.titleFr ? current.titleFr : current.title;
  const description = isFr && current.descriptionFr ? current.descriptionFr : current.description;

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

      if (newMatched.size === current.pairs.length) {
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
    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      setCurrentGameIndex(0);
    }
  };

  const isAllMatched = matchedPairs.size === current.pairs.length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
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
                ? 'Cliquez sur un élément à gauche puis sur son équivalent à droite pour les associer'
                : 'Click an item on the left then match it with the corresponding item on the right'}
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

      {/* Main Matching Card */}
      <div className="bg-white rounded-2xl border border-[#d3c5ab] shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-[#fdf8f0] border-b border-[#ebdcc8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
              {current.certification.toUpperCase()} • Obj {current.objectiveId}
            </span>
            <span className="text-xs font-semibold text-[#817660]">{current.category}</span>
          </div>
          <span className="text-xs font-bold text-[#817660]">
            Atelier {currentGameIndex + 1} / {games.length}
          </span>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#201b11]">{title}</h4>
            <p className="text-xs text-[#60553e]">{description}</p>
          </div>

          {/* Progress bar */}
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

          {/* Dual columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#817660] px-1">
                {isFr ? 'Terme / Commande' : 'Term / Command'}
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
                          ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] opacity-80 cursor-default'
                          : isError
                          ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828] ring-2 ring-[#d32f2f]'
                          : isSelected
                          ? 'bg-[#fdf3e2] border-[#785a00] text-[#785a00] ring-2 ring-[#785a00]'
                          : 'bg-white border-[#d3c5ab] text-[#201b11] hover:bg-[#fffdfa]'
                      }`}
                    >
                      <span className="font-mono text-xs">{isFr && p.leftFr ? p.leftFr : p.left}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#817660] px-1">
                {isFr ? 'Rôle / Définition' : 'Role / Definition'}
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
                          ? 'bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20] opacity-80 cursor-default font-semibold'
                          : isError
                          ? 'bg-[#ffebee] border-[#d32f2f] text-[#c62828] ring-2 ring-[#d32f2f]'
                          : isSelected
                          ? 'bg-[#fdf3e2] border-[#785a00] text-[#785a00] ring-2 ring-[#785a00] font-semibold'
                          : 'bg-white border-[#d3c5ab] text-[#4f4632] hover:bg-[#fffdfa]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div>{item.text}</div>
                        {isMatched && item.note && (
                          <div className="text-[10.5px] opacity-75">{item.note}</div>
                        )}
                      </div>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Completion Card or Reset Actions */}
          {isAllMatched ? (
            <div className="p-4 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#2e7d32] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[#1b5e20]">
                    {isFr ? 'Toutes les paires ont été correctement associées !' : 'All pairs correctly matched!'}
                  </div>
                  <div className="text-[11px] text-[#2e7d32]">
                    {isFr ? '+25 points enregistrés sur votre score de pratique.' : '+25 points earned.'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>{isFr ? 'Atelier suivant' : 'Next Game'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 text-xs font-semibold text-[#817660] hover:bg-[#ebdcc8]/50 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFr ? 'Réinitialiser cet atelier' : 'Reset'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-xs font-semibold text-[#4f4632] hover:bg-[#ebdcc8]/50 border border-[#d3c5ab] rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isFr ? 'Passer' : 'Skip'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
