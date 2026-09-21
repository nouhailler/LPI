import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  Clock,
  Terminal,
  Layers,
  Sparkles,
  Target,
  CheckCircle2,
  Award,
  RotateCcw,
  Compass,
  ArrowRight,
  Laptop,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TabType } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onStartExam?: (examId: string) => void;
  onOpenDiagnostic?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartExam,
  onOpenDiagnostic,
}) => {
  const { isFrench, language, setLanguage } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Keyboard navigation: Left / Right arrows & Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  const handleComplete = () => {
    try {
      localStorage.setItem('lpi_onboarding_completed', 'true');
    } catch {}
    onClose();
  };

  const handleAction = (actionType: 'diagnostic' | 'learning' | 'exam' | 'labs' | 'dashboard') => {
    handleComplete();
    switch (actionType) {
      case 'diagnostic':
        if (onOpenDiagnostic) onOpenDiagnostic();
        break;
      case 'learning':
        onNavigate('learning');
        break;
      case 'exam':
        if (onStartExam) {
          onStartExam('101-500');
        } else {
          onNavigate('practice');
        }
        break;
      case 'labs':
        onNavigate('training');
        break;
      case 'dashboard':
      default:
        onNavigate('dashboard');
        break;
    }
  };

  const steps = [
    // Step 0: Bienvenue
    {
      id: 'welcome',
      icon: GraduationCap,
      badge: isFrench ? 'Bienvenue' : 'Welcome',
      badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
      title: isFrench
        ? 'Maîtrisez les Certifications Linux LPIC'
        : 'Master LPIC Linux Certifications',
      subtitle: isFrench
        ? 'Votre plateforme tout-en-un pour préparer et réussir les examens officiels du Linux Professional Institute (LPI).'
        : 'Your all-in-one platform to prepare and ace official Linux Professional Institute (LPI) certification exams.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center font-bold">
                <Target className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-[#201b11]">
                {isFrench ? '60 Objectifs Officiels' : '60 Official Objectives'}
              </h5>
              <p className="text-[11px] text-[#4f4632] leading-relaxed">
                {isFrench
                  ? 'Programme 100% aligné sur Linux Essentials, LPIC-1 (101 & 102), LPIC-2 et LPIC-3.'
                  : 'Curriculum 100% aligned with Linux Essentials, LPIC-1 (101 & 102), LPIC-2 & LPIC-3.'}
              </p>
            </div>

            <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-[#201b11]">
                {isFrench ? 'Examens Réalistes' : 'Realistic Mock Exams'}
              </h5>
              <p className="text-[11px] text-[#4f4632] leading-relaxed">
                {isFrench
                  ? '60 questions par session, 90 minutes chrono, barème officiel sur 800 points.'
                  : '60 questions per session, 90 min timer, official 200-800 scoring scale.'}
              </p>
            </div>

            <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-[#201b11]">
                {isFrench ? 'Pratique Interactive' : 'Hands-on Practice'}
              </h5>
              <p className="text-[11px] text-[#4f4632] leading-relaxed">
                {isFrench
                  ? 'Ateliers terminal immersifs, fiches mémoires SRS et explications approfondies.'
                  : 'Interactive terminal labs, SRS flashcards, and in-depth command pedagogy.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-center gap-2.5 text-xs text-[#1b5e20]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2e7d32]" />
            <span>
              {isFrench
                ? 'Fonctionne 100% hors-ligne (PWA) • Progression sauvegardée localement • Aucune inscription obligatoire.'
                : '100% offline-ready PWA • Locally saved progress • No mandatory account registration.'}
            </span>
          </div>
        </div>
      ),
    },

    // Step 1: Learning Map & Progression
    {
      id: 'learning-map',
      icon: Compass,
      badge: isFrench ? 'Parcours' : 'Curriculum',
      badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
      title: isFrench
        ? 'La Carte d\'Apprentissage & Objectifs'
        : 'Learning Map & Official Objectives',
      subtitle: isFrench
        ? 'Visualisez la hiérarchie complète des connaissances et suivez votre score de préparation par domaine.'
        : 'Visualize the full knowledge hierarchy and track your exam readiness score per domain.',
      content: (
        <div className="space-y-4">
          <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#201b11]">
                {isFrench ? 'Structure des Certifications LPI' : 'LPI Certification Structure'}
              </span>
              <span className="text-[10px] font-mono text-[#785a00] bg-[#ebdcc8] px-2 py-0.5 rounded-full font-bold">
                Poids 1 à 5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 p-2 bg-[#ffffff] rounded-lg border border-[#ebdcc8]">
                <div className="w-2 h-2 rounded-full bg-[#785a00] mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#201b11] font-semibold">
                    {isFrench ? 'Architecture Système' : 'System Architecture'}
                  </strong>
                  <span className="text-[10px] text-[#4f4632]">
                    BIOS/UEFI, Runlevels, systemd, init, modules noyau
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-[#ffffff] rounded-lg border border-[#ebdcc8]">
                <div className="w-2 h-2 rounded-full bg-[#785a00] mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#201b11] font-semibold">
                    {isFrench ? 'Gestion des Paquets' : 'Package Management'}
                  </strong>
                  <span className="text-[10px] text-[#4f4632]">
                    dpkg, apt, rpm, yum, zypper, bibliothèques partagées
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-[#ffffff] rounded-lg border border-[#ebdcc8]">
                <div className="w-2 h-2 rounded-full bg-[#785a00] mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#201b11] font-semibold">
                    {isFrench ? 'Commandes GNU & Unix' : 'GNU & Unix Commands'}
                  </strong>
                  <span className="text-[10px] text-[#4f4632]">
                    Pipelines, regex, sed, vi/vim, find, tar, processus
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-[#ffffff] rounded-lg border border-[#ebdcc8]">
                <div className="w-2 h-2 rounded-full bg-[#785a00] mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#201b11] font-semibold">
                    {isFrench ? 'Périphériques & FHS' : 'Devices & Linux Filesystems'}
                  </strong>
                  <span className="text-[10px] text-[#4f4632]">
                    Partitions, swap, ext4, XFS, montage, quotas, FHS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#4f4632] italic">
              {isFrench
                ? '💡 Astuce : Cliquez sur chaque objectif pour réviser ses notions clés, tester vos connaissances ou lancer les fiches mémoires associées.'
                : '💡 Tip: Click on each objective to review key concepts, test your mastery, or launch matching flashcards.'}
            </p>
          </div>
        </div>
      ),
    },

    // Step 2: Practice & Mock Exams
    {
      id: 'practice-exams',
      icon: Clock,
      badge: isFrench ? 'Simulations' : 'Mock Exams',
      badgeColor: 'bg-[#ffdad6] text-[#ba1a1a]',
      title: isFrench
        ? 'Examens Blancs & Entraînement Ciblé'
        : 'Mock Exams & Targeted Practice',
      subtitle: isFrench
        ? 'Préparez-vous dans les conditions réelles avec le barème officiel du LPI.'
        : 'Train in real test conditions with official LPI scoring and strict timers.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#785a00] font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>{isFrench ? 'Examen Blanc Complet (90 min)' : 'Full Mock Exam (90 min)'}</span>
              </div>
              <ul className="text-[11px] text-[#4f4632] space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? '60 questions tirées aléatoirement' : '60 randomized questions'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? 'Score requis : 500 / 800 pts (≈ 65%)' : 'Passing score: 500 / 800 pts (≈ 65%)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? 'QCM & saisie de commandes directes' : 'Multiple choice & exact syntax fill-in'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#785a00] font-bold text-xs">
                <Target className="w-4 h-4" />
                <span>{isFrench ? 'Entraînement par Domaine' : 'Domain-by-Domain Drill'}</span>
              </div>
              <ul className="text-[11px] text-[#4f4632] space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? 'Ciblez vos lacunes prioritaires' : 'Target your priority weaknesses'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? 'Explications immédiates détaillées' : 'Instant detailed answer explanations'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span>{isFrench ? 'Liens officiels vers man pages & specs' : 'Official links to man pages & specs'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-[#fff8f2] border border-[#d3c5ab] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#4f4632]">
              {isFrench ? 'Rapport de faiblesses automatique :' : 'Automatic weakness report:'}
            </span>
            <span className="font-semibold text-[#785a00]">
              {isFrench ? 'Identifie vos thèmes à retravailler après chaque session' : 'Pinpoints topics to review after each run'}
            </span>
          </div>
        </div>
      ),
    },

    // Step 3: Interactive Terminal Labs
    {
      id: 'terminal-labs',
      icon: Terminal,
      badge: isFrench ? 'Ateliers Pratiques' : 'Hands-on Labs',
      badgeColor: 'bg-[#201b11] text-[#ffc20e]',
      title: isFrench
        ? 'Ateliers Pratiques & Terminal Interactif'
        : 'Interactive Linux Labs & Terminal',
      subtitle: isFrench
        ? 'Développez les automatismes du terminal sans avoir à installer de machine virtuelle.'
        : 'Build real terminal reflexes and muscle memory without spinning up a virtual machine.',
      content: (
        <div className="space-y-4">
          <div className="bg-[#201b11] text-[#fff8f2] rounded-xl p-4 font-mono text-xs space-y-2 border border-[#4f4632] shadow-inner">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#4f4632]/60 text-[10px] text-[#817660]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc20e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />
              <span className="ml-2 font-sans font-bold text-[#ebdcc8]">bash — LPIC Interactive Lab Emulator</span>
            </div>
            <p className="text-[#a5d6a7]">user@lpic-lab:~$ find /var/log -type f -mtime -7 -exec ls -lh {} \;</p>
            <p className="text-[#d3c5ab] text-[11px] leading-relaxed">
              -rw-r----- 1 root adm 4.2M Sep 19 09:12 /var/log/syslog<br />
              -rw-r--r-- 1 root root 182K Sep 18 14:00 /var/log/dpkg.log
            </p>
            <p className="text-[#ffc20e] text-[11px]">✓ Objectif validé : Recherche des fichiers journaux récents.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#fff8f2] rounded-lg border border-[#ebdcc8]">
              <strong className="block text-[#201b11] font-semibold mb-0.5">
                {isFrench ? 'Scénarios Réalistes' : 'Realistic Scenarios'}
              </strong>
              <p className="text-[11px] text-[#4f4632]">
                {isFrench
                  ? 'Gestion des permissions, réparation de boot, configuration réseau et disques.'
                  : 'File permissions, boot repair, network setup, and disk administration.'}
              </p>
            </div>

            <div className="p-2.5 bg-[#fff8f2] rounded-lg border border-[#ebdcc8]">
              <strong className="block text-[#201b11] font-semibold mb-0.5">
                {isFrench ? 'Validation Instantanée' : 'Instant Verification'}
              </strong>
              <p className="text-[11px] text-[#4f4632]">
                {isFrench
                  ? 'L\'émulateur vérifie vos saisies et vous guide pas à pas avec des indices.'
                  : 'The emulator parses your commands and offers hints if you get stuck.'}
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Step 4: Flashcards SRS & Pedagogical Glossary
    {
      id: 'srs-glossary',
      icon: Sparkles,
      badge: isFrench ? 'Mémorisation' : 'Spaced Repetition',
      badgeColor: 'bg-[#ebdcc8] text-[#785a00]',
      title: isFrench
        ? 'Répétition Espacée & « Pourquoi cette commande ? »'
        : 'SRS Flashcards & Pedagogical Glossary',
      subtitle: isFrench
        ? 'Une pédagogie approfondie qui explique le sens, les pièges et les alternatives de chaque commande.'
        : 'Deep pedagogical breakdowns explaining the why, pitfalls, and alternatives for every command.',
      content: (
        <div className="space-y-4">
          <div className="bg-[#fff8f2] border border-[#ebdcc8] rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-[#785a00] font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{isFrench ? '« Pourquoi cette commande ? » (Glossaire Enrichi)' : '"Why this command?" (Enhanced Glossary)'}</span>
            </div>

            <div className="bg-[#ffffff] p-3 rounded-lg border border-[#ebdcc8] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <code className="font-mono font-bold text-[#785a00] bg-[#fff8f2] px-2 py-0.5 rounded border border-[#ebdcc8]">
                  chmod 640 /var/www/config.php
                </code>
                <span className="text-[10px] font-bold uppercase text-[#817660]">Décryptage</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                <div className="p-1.5 bg-[#fff8f2] rounded border border-[#ebdcc8]">
                  <span className="font-bold text-[#785a00]">6 (rw-)</span>
                  <span className="block text-[#817660]">{isFrench ? 'Propriétaire' : 'Owner'}</span>
                </div>
                <div className="p-1.5 bg-[#fff8f2] rounded border border-[#ebdcc8]">
                  <span className="font-bold text-[#785a00]">4 (r--)</span>
                  <span className="block text-[#817660]">{isFrench ? 'Groupe' : 'Group'}</span>
                </div>
                <div className="p-1.5 bg-[#fff8f2] rounded border border-[#ebdcc8]">
                  <span className="font-bold text-[#785a00]">0 (---)</span>
                  <span className="block text-[#817660]">{isFrench ? 'Autres' : 'Others'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#4f4632]">
              <span>{isFrench ? '🧠 Répétition Espacée (SRS) :' : '🧠 Spaced Repetition (SRS):'}</span>
              <span className="font-medium text-[#201b11]">
                {isFrench ? 'Revoit les fiches au moment critique avant l\'oubli' : 'Surfaces cards just before you forget'}
              </span>
            </div>
          </div>
        </div>
      ),
    },

    // Step 5: Get Started / Ready to launch
    {
      id: 'get-started',
      icon: Award,
      badge: isFrench ? 'C\'est parti !' : 'Ready to Launch',
      badgeColor: 'bg-[#ffc20e] text-[#6d5100]',
      title: isFrench
        ? 'Par où souhaitez-vous commencer ?'
        : 'Where would you like to begin?',
      subtitle: isFrench
        ? 'Choisissez votre point d\'entrée idéal pour votre première session d\'apprentissage.'
        : 'Select your preferred starting point for your first study session.',
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              id="onboarding-start-diagnostic"
              onClick={() => handleAction('diagnostic')}
              className="p-3.5 bg-[#ffffff] hover:bg-[#fff8f2] border-2 border-[#785a00] hover:border-[#5c4400] rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#ffc20e] text-[#6d5100]">
                  {isFrench ? 'Recommandé' : 'Recommended'}
                </span>
              </div>
              <h5 className="font-bold text-xs text-[#201b11] group-hover:text-[#785a00] transition-colors">
                {isFrench ? 'Test Diagnostic Initial' : 'Initial Diagnostic Assessment'}
              </h5>
              <p className="text-[11px] text-[#4f4632] mt-0.5 leading-tight">
                {isFrench
                  ? '20 questions pour évaluer votre niveau et cibler vos priorités.'
                  : '20 questions to assess your starting level and map your focus areas.'}
              </p>
            </button>

            <button
              id="onboarding-start-exam"
              onClick={() => handleAction('exam')}
              className="p-3.5 bg-[#ffffff] hover:bg-[#fff8f2] border border-[#d3c5ab] hover:border-[#785a00] rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-[#817660]">90 min</span>
              </div>
              <h5 className="font-bold text-xs text-[#201b11] group-hover:text-[#785a00] transition-colors">
                {isFrench ? 'Examen Blanc LPIC-1 (101)' : 'LPIC-1 (101) Mock Exam'}
              </h5>
              <p className="text-[11px] text-[#4f4632] mt-0.5 leading-tight">
                {isFrench
                  ? 'Testez-vous directement sur une simulation complète officielle.'
                  : 'Dive straight into a full-length timed exam simulation.'}
              </p>
            </button>

            <button
              id="onboarding-start-learning"
              onClick={() => handleAction('learning')}
              className="p-3.5 bg-[#ffffff] hover:bg-[#fff8f2] border border-[#d3c5ab] hover:border-[#785a00] rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-[#817660]">60 {isFrench ? 'Obj' : 'Objs'}</span>
              </div>
              <h5 className="font-bold text-xs text-[#201b11] group-hover:text-[#785a00] transition-colors">
                {isFrench ? 'Carte d\'Apprentissage' : 'Learning Objectives Map'}
              </h5>
              <p className="text-[11px] text-[#4f4632] mt-0.5 leading-tight">
                {isFrench
                  ? 'Parcourez le programme officiel domaine par domaine.'
                  : 'Explore the complete official curriculum domain by domain.'}
              </p>
            </button>

            <button
              id="onboarding-start-labs"
              onClick={() => handleAction('labs')}
              className="p-3.5 bg-[#ffffff] hover:bg-[#fff8f2] border border-[#d3c5ab] hover:border-[#785a00] rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-8 h-8 rounded-lg bg-[#ebdcc8] text-[#785a00] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Terminal className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-[#817660]">Terminal</span>
              </div>
              <h5 className="font-bold text-xs text-[#201b11] group-hover:text-[#785a00] transition-colors">
                {isFrench ? 'Ateliers Pratiques (Labs)' : 'Hands-on Terminal Labs'}
              </h5>
              <p className="text-[11px] text-[#4f4632] mt-0.5 leading-tight">
                {isFrench
                  ? 'Manipulez les commandes Linux dans notre émulateur interactif.'
                  : 'Practice Linux command scenarios in our sandbox emulator.'}
              </p>
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#fff8f2] border-b border-[#ebdcc8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <StepIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${currentStepData.badgeColor}`}>
                  {currentStepData.badge}
                </span>
                <span className="text-[11px] font-mono text-[#817660]">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>
              <h3 id="onboarding-title" className="text-sm sm:text-base font-bold text-[#201b11] truncate">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick language toggle within onboarding */}
            <div className="flex items-center bg-[#f2e2bb] p-0.5 rounded-lg border border-[#d3c5ab] text-xs font-bold">
              <button
                id="onboarding-lang-fr-btn"
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-[#785a00] text-white shadow-2xs'
                    : 'text-[#6d5100] hover:text-[#201b11]'
                }`}
                title="Passer en français"
              >
                FR
              </button>
              <button
                id="onboarding-lang-en-btn"
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#785a00] text-white shadow-2xs'
                    : 'text-[#6d5100] hover:text-[#201b11]'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            <button
              id="onboarding-close-btn"
              onClick={handleComplete}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#817660] hover:text-[#201b11] hover:bg-[#ebdcc8] transition-colors cursor-pointer shrink-0"
              title={isFrench ? 'Passer l\'introduction' : 'Skip onboarding'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#ebdcc8] h-1.5 flex">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`h-full flex-1 transition-all cursor-pointer ${
                idx === currentStep
                  ? 'bg-[#785a00]'
                  : idx < currentStep
                  ? 'bg-[#d3c5ab]'
                  : 'bg-[#ebdcc8]'
              }`}
              title={`Étape ${idx + 1}`}
            />
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-[#4f4632] leading-relaxed">
            {currentStepData.subtitle}
          </p>

          {currentStepData.content}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 sm:px-6 py-3.5 bg-[#fff8f2] border-t border-[#ebdcc8] flex items-center justify-between gap-3">
          {/* Left: Skip / Replay indicators */}
          <div>
            {!isLastStep ? (
              <button
                id="onboarding-skip-btn"
                onClick={handleComplete}
                className="text-xs font-semibold text-[#817660] hover:text-[#201b11] transition-colors cursor-pointer px-2 py-1"
              >
                {isFrench ? 'Passer l\'introduction' : 'Skip introduction'}
              </button>
            ) : (
              <button
                id="onboarding-replay-from-start"
                onClick={() => setCurrentStep(0)}
                className="text-xs font-semibold text-[#785a00] hover:text-[#5c4400] transition-colors cursor-pointer flex items-center gap-1.5 px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFrench ? 'Recommencer le guide' : 'Restart tour'}</span>
              </button>
            )}
          </div>

          {/* Right: Previous / Next / Finish buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                id="onboarding-prev-btn"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-2 bg-[#ffffff] hover:bg-[#ebdcc8] text-[#201b11] border border-[#d3c5ab] rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isFrench ? 'Précédent' : 'Back'}</span>
              </button>
            )}

            {!isLastStep ? (
              <button
                id="onboarding-next-btn"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-2 bg-[#785a00] hover:bg-[#5c4400] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{isFrench ? 'Suivant' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="onboarding-finish-btn"
                onClick={() => handleAction('dashboard')}
                className="px-4 py-2 bg-[#785a00] hover:bg-[#5c4400] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>{isFrench ? 'Accéder au Tableau de Bord' : 'Go to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
