import React from 'react';
import { LayoutGrid, GraduationCap, HelpCircle, Layers, BookOpen, Library } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'glossary', label: 'Glossary', icon: Library },
    { id: 'path', label: 'Path', icon: GraduationCap },
    { id: 'practice', label: 'Practice', icon: HelpCircle },
    { id: 'flashcards', label: 'Cards', icon: Layers },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fff8f2] border-t border-[#d3c5ab] shadow-sm flex justify-around items-center px-1.5 py-1.5 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 flex-1 rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-[#ffc20e] text-[#6d5100] font-bold shadow-xs'
                : 'text-[#4f4632] hover:bg-[#ebdcc8]/50 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] uppercase tracking-wider font-sans leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'learning', label: 'Learning Objectives', icon: BookOpen, badge: 'LPIC-1/2/3' },
    { id: 'glossary', label: 'Glossary & Index', icon: Library, badge: 'All Exams' },
    { id: 'path', label: 'Certification Path', icon: GraduationCap },
    { id: 'practice', label: 'Practice Exams', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: '500 Cards' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#fff8f2] border-r border-[#d3c5ab] h-screen fixed left-0 top-16 pt-6 px-4 z-30">
      <div className="text-xs font-bold text-[#817660] uppercase tracking-wider px-3 mb-2">
        Study Modules
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
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-20 p-4 bg-[#f8ecdb] rounded-xl border border-[#d3c5ab]">
        <div className="text-xs font-bold uppercase text-[#785a00] tracking-wider mb-1">
          LPI Complete Curriculum
        </div>
        <div className="font-bold text-[#201b11] text-sm">LPIC-1, LPIC-2 & LPIC-3</div>
        <div className="text-xs text-[#4f4632] mt-0.5">Exams 101, 102, 201, 202, 300, 303, 305, 306</div>
      </div>
    </aside>
  );
};
