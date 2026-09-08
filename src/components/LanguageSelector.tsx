import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'drawer' | 'settings';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English (US)', flag: '🇬🇧' },
    { code: 'fr', label: 'French', nativeName: 'Français (FR)', flag: '🇫🇷' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  // Variant: Drawer (inside Hamburger menu)
  if (variant === 'drawer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#817660]">
          <div className="flex items-center gap-1.5 text-[#785a00]">
            <Globe className="w-3.5 h-3.5" />
            <span>{t.common.language}</span>
          </div>
          <span className="text-[10px] font-mono text-[#817660]">
            {language === 'fr' ? 'Version Française' : 'English Version'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#ffc20e] text-[#6d5100] border-[#ffc20e] shadow-xs'
                    : 'bg-[#ffffff] text-[#4f4632] border-[#d3c5ab] hover:bg-[#f8ecdb]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#6d5100]" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant: Settings tab
  if (variant === 'settings') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fef2e1] border-[#785a00] shadow-xs ring-1 ring-[#785a00]'
                    : 'bg-[#ffffff] border-[#d3c5ab] hover:bg-[#f8ecdb]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <div className="text-xs font-bold text-[#201b11]">{item.nativeName}</div>
                    <div className="text-[11px] text-[#817660]">{item.label}</div>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-[#785a00] bg-[#785a00]' : 'border-[#817660]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant: Compact toggle
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        title={language === 'en' ? 'Passer en Français' : 'Switch to English'}
        aria-label={language === 'en' ? 'Passer en Français' : 'Switch to English'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#d3c5ab] text-xs font-bold bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-colors cursor-pointer ${className}`}
      >
        <span>{currentLangObj.flag}</span>
        <span className="uppercase">{currentLangObj.code}</span>
      </button>
    );
  }

  // Variant: Header (interactive dropdown pill with flag and arrow)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        id="language-selector-header-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t.common.selectLanguage}
        title={`${t.common.language}: ${currentLangObj.nativeName}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#d3c5ab] bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-all cursor-pointer shadow-2xs group"
      >
        <span className="text-sm leading-none">{currentLangObj.flag}</span>
        <span className="text-xs font-bold uppercase tracking-wider">{currentLangObj.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#817660] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#ffffff] border border-[#d3c5ab] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#817660] border-b border-[#ebdcc8] mb-1">
            {t.common.selectLanguage}
          </div>
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                id={`lang-opt-${item.code}`}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#ffc20e] text-[#6d5100] font-bold'
                    : 'text-[#201b11] hover:bg-[#f8ecdb]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{item.flag}</span>
                  <span>{item.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#6d5100]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
