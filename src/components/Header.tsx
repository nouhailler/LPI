import React from 'react';
import { User, X, Timer, MoreVertical } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  examTimer?: string;
  isExamTimerLow?: boolean;
  onOpenProfile: () => void;
  onClosePractice?: () => void;
  onOpenExamMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  examTimer = '45:10',
  isExamTimerLow = false,
  onOpenProfile,
  onClosePractice,
  onOpenExamMenu,
}) => {
  if (currentTab === 'practice') {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f2] border-b border-[#d3c5ab] flex justify-between items-center px-4 py-2 h-14 md:h-16 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClosePractice || (() => onTabChange('dashboard'))}
            aria-label="Close practice exam"
            className="p-1.5 rounded-full text-[#785a00] hover:bg-[#f2e7d6] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 className="font-sans font-bold text-lg md:text-xl text-[#785a00]">
            LPI Certification Prep
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              isExamTimerLow
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#f8ecdb] text-[#201b11] border border-[#d3c5ab]'
            }`}
          >
            <Timer className={`w-4 h-4 ${isExamTimerLow ? 'text-[#ba1a1a]' : 'text-[#E67E22]'}`} />
            <span className="font-mono">{examTimer}</span>
          </div>

          <button
            onClick={onOpenExamMenu}
            aria-label="Exam Options"
            className="p-1.5 rounded-full text-[#4f4632] hover:bg-[#f2e7d6] transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f2] border-b border-[#d3c5ab] flex justify-between items-center px-4 py-2.5 h-14 md:h-16 shadow-xs">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => onTabChange('dashboard')}
      >
        <img
          src="/app-logo.jpg"
          alt="LPI Prep Logo"
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-lg object-cover shadow-xs border border-[#d3c5ab]"
        />
        <h1 className="font-sans font-bold text-lg md:text-xl text-[#785a00]">
          LPI Certification Prep
        </h1>
      </div>

      <button
        onClick={onOpenProfile}
        aria-label="Profile and stats"
        className="w-9 h-9 rounded-full flex items-center justify-center text-[#785a00] hover:bg-[#f2e7d6] transition-colors"
      >
        <User className="w-6 h-6" />
      </button>
    </header>
  );
};
