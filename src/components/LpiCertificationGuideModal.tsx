import React from 'react';
import { X, CheckCircle2, Target, Clock, BookOpen, AlertCircle, Award, Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LpiCertificationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (examId: string) => void;
  onOpenLearning: () => void;
}

export const LpiCertificationGuideModal: React.FC<LpiCertificationGuideModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
  onOpenLearning,
}) => {
  const { isFrench, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#fff8f2] border-b border-[#d3c5ab] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#201b11]">
                {t.dashboard.guideModalTitle}
              </h2>
              <p className="text-xs text-[#4f4632] mt-0.5">
                {t.dashboard.guideModalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#817660] hover:text-[#201b11] hover:bg-[#ebdcc8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#201b11] leading-relaxed">
          {/* Section 1: Official Exam Format & Scoring */}
          <div className="bg-[#fdf9f4] border border-[#d3c5ab] rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-[#785a00] font-bold text-sm">
              <Clock className="w-4 h-4 text-[#785a00]" />
              <span>
                {isFrench ? 'Format de l\'examen officiel & Barème LPI' : 'Official Exam Format & LPI Scoring'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d3c5ab]/60">
                <span className="font-bold text-[#817660] block mb-1 uppercase tracking-wider text-[10px]">
                  {isFrench ? 'Durée officielle' : 'Official Duration'}
                </span>
                <span className="text-sm font-bold text-[#201b11]">90 minutes</span>
                <p className="text-[11px] text-[#4f4632] mt-0.5">
                  {isFrench ? '60 questions (QCM et commandes à saisir).' : '60 questions (Multiple choice & fill-in).'}
                </p>
              </div>

              <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d3c5ab]/60">
                <span className="font-bold text-[#817660] block mb-1 uppercase tracking-wider text-[10px]">
                  {isFrench ? 'Score de passage' : 'Passing Score'}
                </span>
                <span className="text-sm font-bold text-[#28A745]">500 / 800 (70 %)</span>
                <p className="text-[11px] text-[#4f4632] mt-0.5">
                  {isFrench ? 'Calcul pondéré selon le poids des objectifs.' : 'Scaled score based on objective weightings.'}
                </p>
              </div>

              <div className="bg-[#ffffff] p-3 rounded-lg border border-[#d3c5ab]/60">
                <span className="font-bold text-[#817660] block mb-1 uppercase tracking-wider text-[10px]">
                  {isFrench ? 'Compréhension du "Poids"' : 'Understanding "Weight"'}
                </span>
                <span className="text-sm font-bold text-[#785a00]">1 point ≈ 1 question</span>
                <p className="text-[11px] text-[#4f4632] mt-0.5">
                  {isFrench ? 'Un poids de 8 = environ 8 questions lors du test.' : 'A weight of 8 = approx. 8 questions on exam.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: 4 Pillars of Preparation */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[#201b11] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#785a00]" />
              {isFrench ? 'La méthode de révision en 4 étapes clés' : 'The 4-Step Preparation Method'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="border border-[#d3c5ab] rounded-xl p-4 bg-[#ffffff] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ffc20e] text-[#6d5100] font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-[#201b11]">
                    {isFrench ? 'Prioriser les thèmes à fort coefficient' : 'Prioritize High-Weight Objectives'}
                  </h4>
                </div>
                <p className="text-xs text-[#4f4632] leading-relaxed">
                  {isFrench
                    ? 'Exemple : Le thème 103 (Commandes GNU/Unix) a un poids de 26 points, soit près d\'un tiers de l\'examen 101 ! Maîtrisez en priorité grep, sed, find, pipes et redirections.'
                    : 'Example: Topic 103 (GNU/Unix Commands) carries a weight of 26 points, representing nearly one third of Exam 101! Master grep, sed, find, pipes, and streams first.'}
                </p>
              </div>

              <div className="border border-[#d3c5ab] rounded-xl p-4 bg-[#ffffff] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ffc20e] text-[#6d5100] font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-[#201b11]">
                    {isFrench ? 'Mémorisation active via les Flashcards' : 'Active Recall via Flashcards'}
                  </h4>
                </div>
                <p className="text-xs text-[#4f4632] leading-relaxed">
                  {isFrench
                    ? 'L\'application intègre plus de 2 000 cartes avec les options précises (-k, -v, -F, etc.) et les chemins de fichiers (/etc/fstab, /proc, /etc/systemd). Révisez 15 à 20 cartes par jour.'
                    : 'The app includes 2,000+ cards covering flags (-k, -v, -F, etc.) and exact file paths (/etc/fstab, /proc, /etc/systemd). Review 15-20 cards daily for spaced repetition.'}
                </p>
              </div>

              <div className="border border-[#d3c5ab] rounded-xl p-4 bg-[#ffffff] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ffc20e] text-[#6d5100] font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h4 className="font-bold text-sm text-[#201b11]">
                    {isFrench ? 'Pratique hands-on (Ateliers & Labs)' : 'Hands-on Practice (Labs & Troubleshooting)'}
                  </h4>
                </div>
                <p className="text-xs text-[#4f4632] leading-relaxed">
                  {isFrench
                    ? 'Utilisez le module d\'ateliers interactifs : remettez en ordre les séquences de démarrage GRUB/systemd, diagnostiquez les pannes et remplissez les commandes sans QCM.'
                    : 'Use the interactive labs module: sequence GRUB/systemd boot stages, diagnose broken filesystems, and type exact shell commands without multiple-choice crutches.'}
                </p>
              </div>

              <div className="border border-[#d3c5ab] rounded-xl p-4 bg-[#ffffff] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ffc20e] text-[#6d5100] font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h4 className="font-bold text-sm text-[#201b11]">
                    {isFrench ? 'Examens blancs en conditions réelles' : 'Timed Exam Simulations'}
                  </h4>
                </div>
                <p className="text-xs text-[#4f4632] leading-relaxed">
                  {isFrench
                    ? 'Passez le simulateur d\'examen blanc avec le chronomètre actif. Visez un score régulier d\'au moins 85 % avant de planifier votre passage officiel chez Pearson VUE.'
                    : 'Take the practice exam simulator with active timer. Aim for a consistent score of 85%+ before scheduling your official Pearson VUE session.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Exam Traps & Gotchas */}
          <div className="bg-[#fff8f2] border border-[#ffc20e] rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#785a00] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#785a00] text-sm block">
                {isFrench ? 'Pièges classiques aux examens LPI' : 'Top LPI Exam Traps to Watch For'}
              </span>
              <ul className="list-disc list-inside space-y-1 text-[#4f4632]">
                <li>
                  {isFrench
                    ? 'Sensibilité à la casse : Linux est sensible à la casse (ex. `uname -R` n\'existe pas, c\'est `uname -r`).'
                    : 'Case-sensitivity: Linux commands and flags are case-sensitive (`uname -R` is invalid, use `uname -r`).'}
                </li>
                <li>
                  {isFrench
                    ? 'Chemins absolus vs relatifs : les questions "fill-in-the-blank" exigent souvent le chemin complet (ex. `/etc/default/grub`).'
                    : 'Absolute vs relative paths: fill-in-the-blank questions often require full absolute path (e.g., `/etc/default/grub`).'}
                </li>
                <li>
                  {isFrench
                    ? 'Double réponse : vérifiez attentivement si l\'énoncé demande de sélectionner DEUX ou TROIS réponses valides.'
                    : 'Multiple answers: check whether the question specifies choosing TWO or THREE options.'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer with quick actions */}
        <div className="px-6 py-4 bg-[#f8ecdb] border-t border-[#d3c5ab] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenLearning();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#785a00] text-[#785a00] hover:bg-[#fff8f2] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isFrench ? 'Consulter les objectifs' : 'View Learning Objectives'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onStartExam('exam-101');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              {isFrench ? 'Lancer un examen blanc' : 'Start Practice Exam'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#d3c5ab] text-[#4f4632] hover:bg-[#ebdcc8] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {t.dashboard.guideCloseBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
