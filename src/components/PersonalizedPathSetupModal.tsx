import React, { useState } from 'react';
import {
  Target,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Zap,
} from 'lucide-react';
import {
  PersonalizedPathConfig,
  CertificationGoal,
} from '../types';
import {
  CERTIFICATION_GOALS,
  CertificationGoalOption,
  savePersonalizedPathConfig,
  getDefaultTargetDate,
} from '../services/personalizedPathEngine';
import { useLanguage } from '../i18n/LanguageContext';
import { getStoredDiagnosticResult } from '../data/diagnosticExamData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: PersonalizedPathConfig;
  onConfigSaved: (config: PersonalizedPathConfig) => void;
  onOpenDiagnostic?: () => void;
}

export const PersonalizedPathSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentConfig,
  onConfigSaved,
  onOpenDiagnostic,
}) => {
  const { isFrench } = useLanguage();
  const isFr = isFrench;

  const [selectedGoal, setSelectedGoal] = useState<CertificationGoal>(currentConfig.goal);
  const [dailyMinutes, setDailyMinutes] = useState<number>(currentConfig.dailyMinutes || 30);
  const [targetDate, setTargetDate] = useState<string>(
    currentConfig.targetDate || getDefaultTargetDate(45)
  );

  const diagResult = getStoredDiagnosticResult();

  if (!isOpen) return null;

  const currentGoalMeta = CERTIFICATION_GOALS.find((g) => g.id === selectedGoal) || CERTIFICATION_GOALS[0];

  const handleSave = () => {
    const updated: PersonalizedPathConfig = {
      ...currentConfig,
      goal: selectedGoal,
      goalTitle: currentGoalMeta.name,
      goalTitleFr: currentGoalMeta.nameFr,
      targetExamId: currentGoalMeta.examId,
      dailyMinutes,
      targetDate,
      initialDiagnosticScore: diagResult ? diagResult.percentage : currentConfig.initialDiagnosticScore || 60,
      hasTakenDiagnostic: !!diagResult,
      updatedAt: new Date().toISOString(),
    };

    savePersonalizedPathConfig(updated);
    onConfigSaved(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#d3c5ab] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#201b11] via-[#3a301c] to-[#201b11] text-[#ffffff] p-5 sm:p-6 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shadow-md shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ffc20e]/20 text-[#ffc20e] border border-[#ffc20e]/30">
                  {isFr ? 'Configuration d\'objectif' : 'Goal Setup'}
                </span>
                <span className="text-xs text-white/70">
                  {isFr ? 'Cursus LPI sur mesure' : 'Custom LPI Roadmap'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                {isFr ? 'Paramétrer « Mon parcours LPIC »' : 'Configure "My LPIC Path"'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Diagnostic Prompt if not taken */}
          {!diagResult && (
            <div className="bg-[#fff8f2] border border-[#ffc20e] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#201b11]">
                    {isFr ? 'Test diagnostic recommandé' : 'Recommended Diagnostic Test'}
                  </h4>
                  <p className="text-[11px] text-[#4f4632]">
                    {isFr
                      ? 'Calibrez votre niveau initial réel (6 domaines) pour ajuster le volume de révision quotidien.'
                      : 'Accurately calibrate your starting baseline (6 domains) to tune daily tasks.'}
                  </p>
                </div>
              </div>
              {onOpenDiagnostic && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDiagnostic();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#ffc20e] text-[#6d5100] font-bold text-xs uppercase tracking-wider shrink-0 hover:bg-[#f9bd00] transition-colors cursor-pointer"
                >
                  {isFr ? 'Faire le test (10 min)' : 'Take Test (10 min)'}
                </button>
              )}
            </div>
          )}

          {/* 1. Select Certification Target */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#785a00] mb-2">
              🎯 1. {isFr ? 'Choisissez votre objectif de certification' : 'Select your Target Certification'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CERTIFICATION_GOALS.map((opt) => {
                const isSelected = selectedGoal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedGoal(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#fef2e1] border-[#785a00] shadow-xs ring-1 ring-[#785a00]'
                        : 'bg-white border-[#d3c5ab] hover:border-[#785a00]/50 hover:bg-[#fffdf9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                          {opt.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#817660]">
                          {opt.examCode}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#201b11] leading-tight">
                        {isFr ? opt.nameFr : opt.name}
                      </div>
                      <p className="text-[11px] text-[#4f4632] line-clamp-2 mt-1">
                        {isFr ? opt.descriptionFr : opt.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#ebdcc8]/50 flex items-center justify-between text-[10px] text-[#817660]">
                      <span>{opt.totalObjectivesCount} {isFr ? 'objectifs syllabus' : 'objectives'}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#0061a4] fill-[#0061a4]/20 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Temps disponible par jour */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#785a00] mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>2. {isFr ? 'Temps disponible par jour' : 'Daily Available Time'}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyMinutes(mins)}
                  className={`p-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                    dailyMinutes === mins
                      ? 'bg-[#785a00] text-white border-[#785a00] shadow-xs'
                      : 'bg-white border-[#d3c5ab] text-[#4f4632] hover:bg-[#fff9f0]'
                  }`}
                >
                  <div>{mins} min</div>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">
                    {isFr ? '/ jour' : '/ day'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Date cible d'examen */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#785a00] mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>3. {isFr ? 'Date cible d\'examen (échéance)' : 'Target Exam Date'}</span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#d3c5ab] bg-white text-sm font-bold text-[#201b11] focus:outline-none focus:ring-2 focus:ring-[#785a00]"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setTargetDate(getDefaultTargetDate(30))}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-colors"
                >
                  +30 {isFr ? 'j' : 'd'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetDate(getDefaultTargetDate(60))}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-colors"
                >
                  +60 {isFr ? 'j' : 'd'}
                </button>
                <button
                  type="button"
                  onClick={() => setTargetDate(getDefaultTargetDate(90))}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] transition-colors"
                >
                  +90 {isFr ? 'j' : 'd'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#fff8f2] border-t border-[#d3c5ab] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6e634e]">
            {isFr
              ? 'Le syllabus journalier adaptera automatiquement les flashcards, labs et quiz.'
              : 'Your daily syllabus will dynamically adapt flashcards, mini-labs, and quizzes.'}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#d3c5ab] text-xs font-bold text-[#4f4632] hover:bg-white transition-colors"
            >
              {isFr ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isFr ? 'Générer mon parcours' : 'Generate My Path'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
