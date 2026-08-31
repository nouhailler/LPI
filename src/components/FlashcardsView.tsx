import React, { useState } from 'react';
import { RotateCw, Check, Hand, Sparkles, RotateCcw } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsViewProps {
  cards: Flashcard[];
  onCardLearned?: (cardId: number) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ cards, onCardLearned }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [studyAgainCount, setStudyAgainCount] = useState(0);

  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.deck === selectedCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const totalInDeck = filteredCards.length;
  const progressPercent = totalInDeck > 0 ? Math.round(((currentIndex + 1) / totalInDeck) * 100) : 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleGotIt = () => {
    setLearnedCount((prev) => prev + 1);
    if (onCardLearned && currentCard) {
      onCardLearned(currentCard.id);
    }
    nextCard();
  };

  const handleStudyAgain = () => {
    setStudyAgainCount((prev) => prev + 1);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < totalInDeck - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or finish
      setCurrentIndex(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedCount(0);
    setStudyAgainCount(0);
  };

  const categories = ['All', 'Linux Essentials', 'LPIC-1 System', 'LPIC-1 Storage', 'LPIC-1 Networking'];

  return (
    <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center pb-20">
      {/* Category selector pills */}
      <div className="w-full flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#785a00] text-[#ffffff] shadow-xs'
                : 'bg-[#f8ecdb] text-[#4f4632] hover:bg-[#ece1d0] border border-[#d3c5ab]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Deck Progress matching Image 7 */}
      <div className="w-full flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-[#495e8a] uppercase tracking-wider">
          <span>{currentCard?.deck || 'LINUX ESSENTIALS'}</span>
          <span>
            Card {currentIndex + 1} of {totalInDeck}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#ece1d0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffc20e] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard 3D Flip Area */}
      <div
        className="w-full aspect-[3/4] md:aspect-[4/3] perspective-1000 cursor-pointer select-none relative group"
        onClick={handleFlip}
      >
        {/* Layered stack shadow effects underneath */}
        <div className="absolute -bottom-2 inset-x-2 h-full bg-[#f2e7d6] rounded-xl border border-[#d3c5ab] -z-10 shadow-xs" />
        <div className="absolute -bottom-4 inset-x-4 h-full bg-[#ece1d0] rounded-xl border border-[#d3c5ab] -z-20 shadow-xs" />

        {/* The flipping card container */}
        <div
          className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl border border-[#d3c5ab] bg-[#fff8f2] shadow-sm flex flex-col justify-between p-6 md:p-8">
            <div className="flex justify-between items-center text-xs text-[#817660]">
              <span className="font-mono uppercase font-bold text-[10px] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                Command
              </span>
              <span className="text-[11px] font-bold text-[#785a00]">LPI Objective</span>
            </div>

            <div className="flex-grow flex items-center justify-center">
              <span className="font-mono font-bold text-2xl md:text-3xl text-[#1A1A1A] bg-[#ece1d0] px-6 py-3 rounded-xl border border-[#d3c5ab] shadow-2xs group-hover:border-[#785a00] transition-colors">
                {currentCard?.command}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[#4f4632] opacity-75">
              <Hand className="w-5 h-5 text-[#785a00] animate-bounce" />
              <span className="text-xs font-semibold">Tap to flip</span>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl border border-[#d3c5ab] bg-[#ffffff] shadow-sm flex flex-col justify-between p-6 md:p-8 text-center">
            <div className="flex justify-between items-center text-xs text-[#817660]">
              <span className="font-bold text-[10px] uppercase text-[#28A745] bg-[#28A745]/10 px-2 py-0.5 rounded">
                Definition & Syntax
              </span>
              <Sparkles className="w-4 h-4 text-[#ffc20e]" />
            </div>

            <div className="flex-grow flex flex-col items-center justify-center gap-3 my-auto">
              <h3 className="font-bold text-base md:text-lg text-[#201b11] leading-snug">
                {currentCard?.definition}
              </h3>

              {currentCard?.example && (
                <div className="text-left bg-[#fef2e1] p-3.5 rounded-lg border border-[#d3c5ab] w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#495e8a] block mb-1">
                    Example
                  </span>
                  <code className="font-mono text-xs md:text-sm text-[#1A1A1A] font-bold block bg-[#ffffff] p-2 rounded border border-[#d3c5ab]/60">
                    {currentCard.example}
                  </code>
                  <p className="text-xs text-[#4f4632] mt-1.5 leading-relaxed">
                    {currentCard.exampleExplanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 text-[#4f4632] opacity-75">
              <Hand className="w-4 h-4 text-[#785a00]" />
              <span className="text-xs font-semibold">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons matching Image 7 */}
      <div className="w-full flex justify-between gap-4 mt-6">
        <button
          onClick={handleStudyAgain}
          className="flex-1 flex flex-col items-center justify-center py-3 px-4 rounded-xl border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors gap-1 shadow-2xs active:scale-95 cursor-pointer font-bold text-xs uppercase tracking-wider"
        >
          <RotateCw className="w-4 h-4" />
          Study Again
        </button>

        <button
          onClick={handleGotIt}
          className="flex-1 flex flex-col items-center justify-center py-3 px-4 rounded-xl bg-[#28A745]/15 border border-[#28A745] text-[#28A745] hover:bg-[#28A745]/25 transition-colors gap-1 shadow-2xs active:scale-95 cursor-pointer font-bold text-xs uppercase tracking-wider"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          Got It
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex justify-between items-center w-full px-2 mt-4 text-xs font-semibold text-[#817660]">
        <span>Learned: <strong className="text-[#28A745]">{learnedCount}</strong></span>
        <button
          onClick={handleRestart}
          className="text-[#785a00] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restart Deck
        </button>
        <span>Review: <strong className="text-[#ba1a1a]">{studyAgainCount}</strong></span>
      </div>
    </div>
  );
};
