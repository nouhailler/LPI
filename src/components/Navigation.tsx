import React, { useState, useEffect } from 'react';
import { LayoutGrid, GraduationCap, HelpCircle, Layers, BookOpen, Library, Zap, Brain } from 'lucide-react';
import { TabType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { loadSRSRecords, getCardsDueToday } from '../utils/srsEngine';
import { flashcardsData } from '../data/lpiData';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { t } = useLanguage();
  const [dueTodayCount, setDueTodayCount] = useState<number>(() => {
    const records = loadSRSRecords(flashcardsData);
    return getCardsDueToday(flashcardsData, records).length;
  });

  useEffect(() => {
    const updateCount = () => {
      const records = loadSRSRecords(flashcardsData);
      setDueTodayCount(getCardsDueToday(flashcardsData, records).length);
    };
    window.addEventListener('storage', updateCount);
    window.addEventListener('srs_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('srs_updated', updateCount);
    };
  }, []);

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutGrid },
    { id: 'learning', label: t.nav.learning, icon: BookOpen },
    { id: 'training', label: t.nav.training, icon: Zap },
    { id: 'practice', label: t.nav.practice, icon: HelpCircle },
    { id: 'flashcards', label: t.nav.flashcards, icon: Layers },
    { id: 'glossary', label: t.nav.glossary, icon: Library },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fff8f2] border-t border-[#d3c5ab] shadow-sm flex justify-around items-center px-1.5 py-1.5 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        const isFlashcards = tab.id === 'flashcards';

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2 flex-1 rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-[#ffc20e] text-[#6d5100] font-bold shadow-xs'
                : 'text-[#4f4632] hover:bg-[#ebdcc8]/50 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {isFlashcards && dueTodayCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#ba1a1a] text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                  {dueTodayCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px] uppercase tracking-wider font-sans leading-none truncate max-w-full">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { t } = useLanguage();
  const [dueTodayCount, setDueTodayCount] = useState<number>(() => {
    const records = loadSRSRecords(flashcardsData);
    return getCardsDueToday(flashcardsData, records).length;
  });

  useEffect(() => {
    const updateCount = () => {
      const records = loadSRSRecords(flashcardsData);
      setDueTodayCount(getCardsDueToday(flashcardsData, records).length);
    };
    window.addEventListener('storage', updateCount);
    window.addEventListener('srs_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('srs_updated', updateCount);
    };
  }, []);

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutGrid },
    { id: 'learning', label: t.nav.learning, icon: BookOpen, badge: t.nav.learningBadge },
    { id: 'training', label: t.nav.training, icon: Zap, badge: t.nav.trainingBadge },
    { id: 'glossary', label: t.nav.glossary, icon: Library, badge: t.nav.glossaryBadge },
    { id: 'path', label: t.nav.path, icon: GraduationCap },
    { id: 'practice', label: t.nav.practice, icon: HelpCircle },
    {
      id: 'flashcards',
      label: t.nav.flashcards,
      icon: Layers,
      badge: dueTodayCount > 0 ? `🧠 ${dueTodayCount}` : 'SRS',
      badgeColor: dueTodayCount > 0 ? 'bg-[#ba1a1a] text-white' : undefined,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#fff8f2] border-r border-[#d3c5ab] h-screen fixed left-0 top-16 pt-6 px-4 z-30">
      <div className="flex items-center justify-between text-xs font-bold text-[#817660] uppercase tracking-wider px-3 mb-2">
        <span>{t.nav.studyModules}</span>
        <LanguageSelector variant="compact" />
      </div>
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
                isActive
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:bg-[#f8ecdb]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && !isActive && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badgeColor || 'bg-[#ebdcc8] text-[#785a00]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-20 p-4 bg-[#f8ecdb] rounded-xl border border-[#d3c5ab]">
        <div className="text-xs font-bold uppercase text-[#785a00] tracking-wider mb-1">
          {t.nav.curriculumTitle}
        </div>
        <div className="font-bold text-[#201b11] text-sm">{t.nav.curriculumSubtitle}</div>
        <div className="text-xs text-[#4f4632] mt-0.5">{t.nav.curriculumExams}</div>
      </div>
    </aside>
  );
};

