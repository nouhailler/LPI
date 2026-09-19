import React from 'react';
import { User, X, Timer, MoreVertical, Menu, Settings, Sparkles } from 'lucide-react';
import { TabType } from '../types';
import { CURRENT_APP_VERSION } from '../utils/updateService';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  examTimer?: string;
  isExamTimerLow?: boolean;
  onOpenProfile: () => void;
  onOpenSettings?: () => void;
  onClosePractice?: () => void;
  onOpenExamMenu?: () => void;
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  hasUpdateAvailable?: boolean;
  onOpenDiagnostic?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  examTimer = '45:10',
  isExamTimerLow = false,
  onOpenProfile,
  onOpenSettings,
  onClosePractice,
  onOpenExamMenu,
  onToggleMenu,
  isMenuOpen = false,
  hasUpdateAvailable = false,
  onOpenDiagnostic,
}) => {
  const { t, isFrench } = useLanguage();

  if (currentTab === 'practice') {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f2] border-b border-[#d3c5ab] flex justify-between items-center px-3 md:px-4 py-2 h-14 md:h-16 shadow-xs">
        <div className="flex items-center gap-2 md:gap-3">
          {onToggleMenu && (
            <button
              id="header-hamburger-exam-btn"
              onClick={onToggleMenu}
              aria-label={t.header.toggleMenu}
              title={t.header.toggleMenu}
              className="p-2 rounded-lg text-[#785a00] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}
          <button
            id="close-practice-btn"
            onClick={onClosePractice || (() => onTabChange('dashboard'))}
            aria-label={t.header.closeExam}
            title={t.header.closeExam}
            className="p-1.5 rounded-full text-[#785a00] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <h1 className="font-sans font-bold text-base md:text-xl text-[#785a00] truncate">
            {t.header.practiceExamTitle}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold transition-colors ${
              isExamTimerLow
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#f8ecdb] text-[#201b11] border border-[#d3c5ab]'
            }`}
          >
            <Timer className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isExamTimerLow ? 'text-[#ba1a1a]' : 'text-[#E67E22]'}`} />
            <span className="font-mono">{examTimer}</span>
          </div>

          {/* Language Selector in practice mode */}
          <LanguageSelector variant="header" />

          {onOpenSettings && (
            <button
              id="exam-settings-btn"
              onClick={onOpenSettings}
              aria-label={t.header.settingsAndUpdates}
              title={t.header.settingsAndUpdates}
              className="p-1.5 rounded-full text-[#4f4632] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <button
            id="exam-options-btn"
            onClick={onOpenExamMenu}
            aria-label={t.header.examOptions}
            title={t.header.examOptions}
            className="p-1.5 rounded-full text-[#4f4632] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f2] border-b border-[#d3c5ab] flex justify-between items-center px-3 md:px-6 py-2.5 h-14 md:h-16 shadow-xs">
      <div className="flex items-center gap-2 md:gap-3">
        {onToggleMenu && (
          <button
            id="header-hamburger-btn"
            onClick={onToggleMenu}
            aria-label={t.header.toggleMenu}
            title={t.header.toggleMenu}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              isMenuOpen
                ? 'bg-[#ffc20e] text-[#6d5100]'
                : 'text-[#785a00] hover:bg-[#f2e7d6]'
            }`}
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => onTabChange('dashboard')}
        >
          <img
            src="/app-logo.jpg"
            alt="LPI Prep Logo"
            referrerPolicy="no-referrer"
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg object-cover shadow-xs border border-[#d3c5ab]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-base md:text-xl text-[#785a00] leading-tight">
                {t.header.title}
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#ebdcc8] text-[#785a00] text-[10px] font-bold rounded">
                v{CURRENT_APP_VERSION}
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-[#817660] font-medium leading-none">
              {t.header.subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Prominent Language Switcher Button in Header */}
        <LanguageSelector variant="header" />

        {onOpenDiagnostic && (
          <button
            id="header-diagnostic-btn"
            onClick={onOpenDiagnostic}
            title={isFrench ? 'Évaluation diagnostique (20 Q)' : 'Diagnostic assessment (20 Q)'}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] border border-[#ffc20e] text-xs font-bold text-[#785a00] transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#785a00]" />
            <span>{isFrench ? 'Diagnostic (20 Q)' : 'Diagnostic (20 Q)'}</span>
          </button>
        )}

        {onToggleMenu && (
          <button
            id="quick-features-menu-chip"
            onClick={onToggleMenu}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8ecdb] hover:bg-[#ebdcc8] border border-[#d3c5ab] text-xs font-bold text-[#785a00] transition-colors cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>{t.header.allFeaturesDirectory}</span>
          </button>
        )}

        {onOpenSettings && (
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            aria-label={t.header.settingsAndUpdates}
            title={`${t.header.settingsAndUpdates} (v${CURRENT_APP_VERSION})`}
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#785a00] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 md:w-5 md:h-5" />
            {hasUpdateAvailable && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E67E22] rounded-full ring-2 ring-[#fff8f2] animate-pulse" />
            )}
          </button>
        )}

        <button
          id="profile-button"
          onClick={onOpenProfile}
          aria-label={t.header.profileAndStats}
          title={t.header.profileAndStats}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#785a00] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </header>
  );
};
