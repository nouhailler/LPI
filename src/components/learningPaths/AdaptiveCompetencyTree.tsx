import React from 'react';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Layers,
  FileQuestion,
  FlaskConical,
  Sparkles,
  Wrench,
  Award,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { LearningPath, PathModule } from '../../data/learningPaths/types';
import {
  CompetencyMastery,
  CompetencyActivityType,
  PathAdaptiveMastery,
} from '../../services/adaptivePathEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface AdaptiveCompetencyTreeProps {
  path: LearningPath;
  adaptiveMastery: PathAdaptiveMastery;
  selectedModuleId?: string;
  onSelectActivity: (moduleId: string, activityType: CompetencyActivityType) => void;
  onSelectEvaluation?: (type: 'quiz' | 'lab' | 'troubleshoot') => void;
}

export const AdaptiveCompetencyTree: React.FC<AdaptiveCompetencyTreeProps> = ({
  path,
  adaptiveMastery,
  selectedModuleId,
  onSelectActivity,
  onSelectEvaluation,
}) => {
  const { isFrench } = useLanguage();

  const getActivityIcon = (type: CompetencyActivityType) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-3.5 h-3.5 text-[#0061a4]" />;
      case 'flashcards':
        return <Layers className="w-3.5 h-3.5 text-[#ffc20e]" />;
      case 'quiz':
        return <FileQuestion className="w-3.5 h-3.5 text-[#785a00]" />;
      case 'lab':
        return <FlaskConical className="w-3.5 h-3.5 text-[#047857]" />;
      case 'explain':
        return <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />;
      case 'troubleshoot':
        return <Wrench className="w-3.5 h-3.5 text-[#ba1a1a]" />;
    }
  };

  const getActivityLabel = (type: CompetencyActivityType) => {
    switch (type) {
      case 'theory':
        return isFrench ? 'Théorie & concepts' : 'Theory & concepts';
      case 'flashcards':
        return isFrench ? 'Flashcards & SRS' : 'Flashcards & SRS';
      case 'quiz':
        return isFrench ? 'Quiz formatif' : 'Practice quiz';
      case 'lab':
        return isFrench ? 'LAB pratique' : 'Hands-on lab';
      case 'explain':
        return isFrench ? '« Explique-moi autrement »' : '"Explain differently"';
      case 'troubleshoot':
        return isFrench ? 'Dépannage / Panne' : 'Troubleshooting';
    }
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 sm:p-5 shadow-xs flex flex-col gap-4">
      {/* Tree Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f0e4d2] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#fff8f2] border border-[#d3c5ab] text-[#785a00]">
            <ShieldCheck className="w-5 h-5 text-[#785a00]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#201b11] flex items-center gap-2">
              <span>{isFrench ? 'Arborescence des Compétences & Preuves' : 'Competency & Mastery Proof Tree'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ffc20e]/30 text-[#785a00] font-bold">
                {adaptiveMastery.masteredCompetenciesCount}/{adaptiveMastery.totalCompetenciesCount} {isFrench ? 'Acquises' : 'Mastered'}
              </span>
            </h3>
            <p className="text-[11px] text-[#6e634e]">
              {isFrench
                ? 'Structure adaptative : Parcours → Compétence → Activité → Preuve de maîtrise'
                : 'Adaptive structure: Path → Competency → Activity → Mastery Proof'}
            </p>
          </div>
        </div>

        {/* Global Path Mastery Indicator */}
        <div className="flex items-center gap-2 bg-[#fff8f2] px-3 py-1.5 rounded-xl border border-[#d3c5ab] self-start sm:self-auto">
          <Award className="w-4 h-4 text-[#ffc20e]" />
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#817660] block leading-none">
              {isFrench ? 'Maîtrise globale' : 'Overall Mastery'}
            </span>
            <span className="text-xs font-mono font-extrabold text-[#785a00]">
              {adaptiveMastery.overallMasteryPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Tree Visualization with connectors */}
      <div className="font-mono text-xs text-[#201b11] overflow-x-auto pb-1">
        {/* Root Node: Path Title */}
        <div className="flex items-center gap-2 font-bold text-[#785a00] py-1 px-2 rounded-lg bg-[#fff8f2] border border-[#ebdcc8] w-fit mb-2">
          <span>{path.emoji}</span>
          <span className="font-sans font-extrabold text-xs">
            {isFrench ? path.titleFr : path.title}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#785a00] text-white font-mono">
            {adaptiveMastery.overallMasteryPct}%
          </span>
        </div>

        {/* Competencies Branches */}
        <div className="space-y-3 pl-3 border-l-2 border-[#d3c5ab]/60 ml-3">
          {path.modules.map((mod, modIdx) => {
            const comp = adaptiveMastery.competencies[mod.id];
            if (!comp) return null;
            const isSelected = selectedModuleId === mod.id;
            const isLastModule = modIdx === path.modules.length - 1;

            return (
              <div key={mod.id} className="relative pl-4">
                {/* Branch connector line */}
                <div className="absolute -left-[14px] top-3 w-3 h-0.5 bg-[#d3c5ab]/80" />

                {/* Competency Level Node */}
                <div
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-wrap items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#fcf8f2] border-[#785a00] shadow-2xs'
                      : comp.isMastered
                      ? 'bg-[#f6fbf7] border-[#047857]/40'
                      : 'bg-[#ffffff] border-[#e2d5c0] hover:border-[#bcae96]'
                  }`}
                  onClick={() => onSelectActivity(mod.id, 'theory')}
                >
                  <div className="flex items-center gap-2">
                    {comp.isMastered ? (
                      <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#817660] shrink-0" />
                    )}
                    <span className="font-sans font-bold text-xs text-[#201b11]">
                      {isFrench ? mod.titleFr : mod.title}
                    </span>
                    {mod.linkedLpiObjective && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ece1d0] text-[#4f4632]">
                        LPI {mod.linkedLpiObjective}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        comp.isMastered
                          ? 'bg-[#047857]/15 text-[#047857]'
                          : comp.completedActivitiesCount > 0
                          ? 'bg-[#ffc20e]/30 text-[#785a00]'
                          : 'bg-[#f0e4d2] text-[#817660]'
                      }`}
                    >
                      {comp.isMastered
                        ? isFrench
                          ? '✓ Preuve de maîtrise validée'
                          : '✓ Mastery Proof Validated'
                        : `${comp.completedActivitiesCount}/${comp.totalActivitiesCount} ${
                            isFrench ? 'activités' : 'activities'
                          } (${comp.masteryPct}%)`}
                    </span>
                  </div>
                </div>

                {/* Activities Sub-branches */}
                <div className="mt-1.5 ml-4 pl-3 border-l-2 border-[#e6dac7] space-y-1">
                  {(
                    mod.activeActivityTypes && mod.activeActivityTypes.length > 0
                      ? mod.activeActivityTypes
                      : (Object.keys(comp.activities) as CompetencyActivityType[])
                  ).map((actKey) => {
                    const proof = comp.activities[actKey];
                    if (!proof) return null;

                    const customLabel = mod.activityLabels?.[actKey];
                    const labelText = customLabel
                      ? isFrench
                        ? customLabel.labelFr
                        : customLabel.label
                      : getActivityLabel(actKey);

                    return (
                      <div
                        key={actKey}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectActivity(mod.id, actKey);
                        }}
                        className={`relative pl-3 py-1 px-2 rounded-lg flex items-center justify-between text-[11px] font-sans transition-colors cursor-pointer group ${
                          proof.completed
                            ? 'hover:bg-[#f0fbf2] text-[#047857]'
                            : 'hover:bg-[#f8ecdb] text-[#4f4632]'
                        }`}
                      >
                        {/* Branch connector */}
                        <div className="absolute -left-[14px] top-2.5 w-2.5 h-0.5 bg-[#e6dac7]" />

                        <div className="flex items-center gap-2">
                          <span className="shrink-0">{getActivityIcon(actKey)}</span>
                          <span className={proof.completed ? 'font-semibold' : 'text-[#6e634e]'}>
                            {labelText}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px]">
                          {proof.completed ? (
                            <span className="flex items-center gap-1 text-[#047857] font-bold bg-[#047857]/10 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{isFrench ? proof.proofLabelFr : proof.proofLabel}</span>
                            </span>
                          ) : (
                            <span className="text-[#817660] group-hover:text-[#785a00] flex items-center gap-0.5">
                              <span>{isFrench ? 'À valider' : 'Pending'}</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Evaluation Level Node & Sub-branches */}
          <div className="relative pl-4 pt-2">
            <div className="absolute -left-[14px] top-5 w-3 h-0.5 bg-[#d3c5ab]/80" />
            <div className="p-2.5 rounded-xl border border-[#ffc20e] bg-[#fffaf0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ffc20e]" />
                <span className="font-sans font-extrabold text-xs text-[#785a00]">
                  {isFrench ? 'Évaluation Finale & Épreuves de synthèse' : 'Capstone Evaluation & Synthesis'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffc20e]/30 text-[#785a00]">
                {adaptiveMastery.evaluation.isAllEvaluationsPassed
                  ? isFrench
                    ? '✓ Maîtrise Certifiée'
                    : '✓ Certified Master'
                  : `${
                      (adaptiveMastery.evaluation.finalQuizPassed ? 1 : 0) +
                      (adaptiveMastery.evaluation.finalLabPassed ? 1 : 0) +
                      (adaptiveMastery.evaluation.finalTroubleshootingPassed ? 1 : 0)
                    }/3 ${isFrench ? 'épreuves validées' : 'proofs validated'}`}
              </span>
            </div>

            {/* Evaluation Sub-branches: QCM, LAB, Troubleshooting */}
            <div className="mt-1.5 ml-4 pl-3 border-l-2 border-[#ebdcc8] space-y-1">
              {/* 1. QCM */}
              <div
                onClick={() => onSelectEvaluation && onSelectEvaluation('quiz')}
                className={`relative pl-3 py-1 px-2 rounded-lg flex items-center justify-between text-[11px] font-sans transition-colors cursor-pointer group ${
                  adaptiveMastery.evaluation.finalQuizPassed
                    ? 'hover:bg-[#f0fbf2] text-[#047857]'
                    : 'hover:bg-[#f8ecdb] text-[#4f4632]'
                }`}
              >
                <div className="absolute -left-[14px] top-2.5 w-2.5 h-0.5 bg-[#ebdcc8]" />
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-3.5 h-3.5 text-[#785a00]" />
                  <span className={adaptiveMastery.evaluation.finalQuizPassed ? 'font-semibold' : 'text-[#6e634e]'}>
                    {isFrench ? 'QCM de synthèse' : 'Synthesis Quiz'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {adaptiveMastery.evaluation.finalQuizPassed ? (
                    <span className="flex items-center gap-1 text-[#047857] font-bold bg-[#047857]/10 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isFrench ? 'Score validé' : 'Passed'}</span>
                    </span>
                  ) : (
                    <span className="text-[#817660] group-hover:text-[#785a00] flex items-center gap-0.5">
                      <span>{isFrench ? 'Lancer QCM' : 'Start Quiz'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>

              {/* 2. LAB */}
              <div
                onClick={() => onSelectEvaluation && onSelectEvaluation('lab')}
                className={`relative pl-3 py-1 px-2 rounded-lg flex items-center justify-between text-[11px] font-sans transition-colors cursor-pointer group ${
                  adaptiveMastery.evaluation.finalLabPassed
                    ? 'hover:bg-[#f0fbf2] text-[#047857]'
                    : 'hover:bg-[#f8ecdb] text-[#4f4632]'
                }`}
              >
                <div className="absolute -left-[14px] top-2.5 w-2.5 h-0.5 bg-[#ebdcc8]" />
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-[#047857]" />
                  <span className={adaptiveMastery.evaluation.finalLabPassed ? 'font-semibold' : 'text-[#6e634e]'}>
                    {isFrench ? 'LAB Capstone terminal' : 'Capstone Terminal LAB'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {adaptiveMastery.evaluation.finalLabPassed ? (
                    <span className="flex items-center gap-1 text-[#047857] font-bold bg-[#047857]/10 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isFrench ? 'Validé dans le Terminal' : 'Validated in Terminal'}</span>
                    </span>
                  ) : (
                    <span className="text-[#817660] group-hover:text-[#047857] flex items-center gap-0.5">
                      <span>{isFrench ? 'Ouvrir LAB' : 'Open LAB'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Troubleshooting */}
              <div
                onClick={() => onSelectEvaluation && onSelectEvaluation('troubleshoot')}
                className={`relative pl-3 py-1 px-2 rounded-lg flex items-center justify-between text-[11px] font-sans transition-colors cursor-pointer group ${
                  adaptiveMastery.evaluation.finalTroubleshootingPassed
                    ? 'hover:bg-[#f0fbf2] text-[#047857]'
                    : 'hover:bg-[#f8ecdb] text-[#4f4632]'
                }`}
              >
                <div className="absolute -left-[14px] top-2.5 w-2.5 h-0.5 bg-[#ebdcc8]" />
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  <span className={adaptiveMastery.evaluation.finalTroubleshootingPassed ? 'font-semibold' : 'text-[#6e634e]'}>
                    {isFrench ? 'Diagnostic de panne (Troubleshooting)' : 'Incident Diagnosis (Troubleshooting)'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  {adaptiveMastery.evaluation.finalTroubleshootingPassed ? (
                    <span className="flex items-center gap-1 text-[#047857] font-bold bg-[#047857]/10 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isFrench ? 'Panne résolue' : 'Incident solved'}</span>
                    </span>
                  ) : (
                    <span className="text-[#817660] group-hover:text-[#ba1a1a] flex items-center gap-0.5">
                      <span>{isFrench ? 'Résoudre la panne' : 'Solve Incident'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
