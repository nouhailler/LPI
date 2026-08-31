import React from 'react';
import { LayoutGrid, GraduationCap, HelpCircle, Layers } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'path', label: 'Path', icon: GraduationCap },
    { id: 'practice', label: 'Practice', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fff8f2] border-t border-[#d3c5ab] shadow-sm flex justify-around items-center px-2 py-2 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 flex-1 rounded-xl transition-all duration-150 ${
              isActive
                ? 'bg-[#ffc20e] text-[#6d5100] font-bold shadow-xs'
                : 'text-[#314671] hover:bg-[#d8e2ff]/40 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] uppercase tracking-wider font-sans leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export const DesktopSidebar: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'path', label: 'Certification Path', icon: GraduationCap },
    { id: 'practice', label: 'Practice Exams', icon: HelpCircle },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors text-left ${
                isActive
                  ? 'bg-[#ffc20e] text-[#6d5100] shadow-xs'
                  : 'text-[#4f4632] hover:bg-[#f8ecdb]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto mb-20 p-4 bg-[#f8ecdb] rounded-xl border border-[#d3c5ab]">
        <div className="text-xs font-bold uppercase text-[#785a00] tracking-wider mb-1">
          Active Certification
        </div>
        <div className="font-bold text-[#201b11] text-sm">LPIC-1 Linux Admin</div>
        <div className="text-xs text-[#4f4632] mt-0.5">Exam 101-500: In Progress</div>
      </div>
    </aside>
  );
};
