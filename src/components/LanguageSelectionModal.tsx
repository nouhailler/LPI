import React, { useState } from 'react';
import { Globe, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onConfirm: (selectedLang: Language) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onConfirm,
}) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language || 'fr');

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  const handleConfirm = () => {
    try {
      localStorage.setItem('lpi_language_selected', 'true');
    } catch {}
    onConfirm(selectedLanguage);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-selection-title"
    >
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-[#fff8f2] border-b border-[#ebdcc8] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#f2e2bb] text-[#624900]">
                <Sparkles className="w-3 h-3 text-[#785a00]" />
                Bienvenue • Welcome
              </span>
              <h2
                id="language-selection-title"
                className="text-lg sm:text-xl font-bold text-[#201b11] mt-0.5"
              >
                Choisissez votre langue / Select language
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5">
          <p className="text-sm text-[#504532] leading-relaxed">
            Pour commencer votre préparation aux certifications Linux (LPIC-1, LPIC-2, LPIC-3), choisissez votre langue préférée. Vous pourrez la modifier à tout moment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* French Option */}
            <button
              id="lang-select-fr"
              type="button"
              onClick={() => handleSelect('fr')}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedLanguage === 'fr'
                  ? 'border-[#785a00] bg-[#fff8f2] shadow-sm'
                  : 'border-[#d3c5ab] hover:border-[#817660] bg-[#fbf9f5]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label="Drapeau français">
                    🇫🇷
                  </span>
                  <div>
                    <h3 className="font-bold text-[#201b11] text-base">Français</h3>
                    <span className="text-[11px] font-medium text-[#817660]">Recommandé</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    selectedLanguage === 'fr'
                      ? 'bg-[#785a00] text-white'
                      : 'border border-[#d3c5ab] bg-white'
                  }`}
                >
                  {selectedLanguage === 'fr' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="mt-3 text-xs text-[#504532] leading-normal">
                Interface, guides d'onboarding, fiches mémo et explications en français.
              </p>
            </button>

            {/* English Option */}
            <button
              id="lang-select-en"
              type="button"
              onClick={() => handleSelect('en')}
              className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedLanguage === 'en'
                  ? 'border-[#785a00] bg-[#fff8f2] shadow-sm'
                  : 'border-[#d3c5ab] hover:border-[#817660] bg-[#fbf9f5]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl" role="img" aria-label="UK flag">
                    🇬🇧
                  </span>
                  <div>
                    <h3 className="font-bold text-[#201b11] text-base">English</h3>
                    <span className="text-[11px] font-medium text-[#817660]">Exam Standard</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    selectedLanguage === 'en'
                      ? 'bg-[#785a00] text-white'
                      : 'border border-[#d3c5ab] bg-white'
                  }`}
                >
                  {selectedLanguage === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="mt-3 text-xs text-[#504532] leading-normal">
                Interface, onboarding tour, cheatsheets and explanations in English.
              </p>
            </button>
          </div>

          {/* Additional details */}
          <div className="rounded-lg bg-[#fff8f2] border border-[#ebdcc8] p-3 text-xs text-[#6d5100] flex items-center gap-2">
            <Globe className="w-4 h-4 shrink-0 text-[#785a00]" />
            <span>
              {selectedLanguage === 'fr'
                ? "L'introduction guidée démarrera immédiatement en français."
                : 'The interactive onboarding tour will start immediately in English.'}
            </span>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              id="lang-select-confirm-btn"
              type="button"
              onClick={handleConfirm}
              className="w-full py-3.5 px-6 rounded-xl bg-[#785a00] hover:bg-[#624900] active:scale-[0.99] text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>
                {selectedLanguage === 'fr'
                  ? "Démarrer l'onboarding"
                  : 'Start Onboarding Tour'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
