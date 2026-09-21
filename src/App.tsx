import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, DesktopSidebar } from './components/Navigation';
import { HamburgerMenu } from './components/HamburgerMenu';
import { DashboardView } from './components/DashboardView';
import { CertificationPathView } from './components/CertificationPathView';
import { LearningObjectivesView } from './components/LearningObjectivesView';
import { PracticeExamView } from './components/PracticeExamView';
import { FlashcardsView } from './components/FlashcardsView';
import { GlossaryView } from './components/GlossaryView';
import { TrainingHubView } from './components/training/TrainingHubView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExplanationModal } from './components/ExplanationModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { DiagnosticExamModal } from './components/DiagnosticExamModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ExplainDifferentlyModal } from './components/ExplainDifferentlyModal';
import { DocumentationModal } from './components/DocumentationModal';
import { UpdateNotificationBanner } from './components/UpdateNotificationBanner';
import { certificationTiers, flashcardsData, initialUserStats, practiceQuestions } from './data/lpiData';
import { PracticeQuestion, TabType, UserStats } from './types';
import { PedagogicalMode } from './data/pedagogicalExplanations';
import { useLanguage } from './i18n/LanguageContext';
import { frenchCertificationTiers, frenchPracticeQuestions } from './i18n/frenchData';
import { getStoredDiagnosticResult } from './data/diagnosticExamData';
import {
  initServiceWorker,
  subscribeToUpdateEvents,
  checkForUpdates,
  VersionInfo,
} from './utils/updateService';

export default function App() {
  const { isFrench } = useLanguage();
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [examTimerSeconds, setExamTimerSeconds] = useState(45 * 60 + 10); // 45:10
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [activeExplanation, setActiveExplanation] = useState<PracticeQuestion | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'updates' | 'profile' | 'preferences' | 'language'>('updates');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLearningTopic, setSelectedLearningTopic] = useState<string | undefined>(undefined);
  const [selectedExamId, setSelectedExamId] = useState<string>('exam-101');
  const [dataResetKey, setDataResetKey] = useState(0);

  // Diagnostic & Onboarding Modal state
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticMode, setDiagnosticMode] = useState<'intro' | 'test' | 'results'>('intro');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedFlashcardsTopic, setSelectedFlashcardsTopic] = useState<any>('srs-daily');

  // Explain Differently Modal state (5 pedagogical angles & dynamic explanations)
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [explainTopic, setExplainTopic] = useState<string>('umask');
  const [explainMode, setExplainMode] = useState<PedagogicalMode>('simple');
  const [explainContext, setExplainContext] = useState<string | undefined>(undefined);

  const handleOpenExplainDifferently = (
    topic = 'umask',
    mode: PedagogicalMode = 'simple',
    context?: string
  ) => {
    setExplainTopic(topic);
    setExplainMode(mode);
    setExplainContext(context);
    setIsExplainModalOpen(true);
  };

  const handleOpenFlashcards = (topic: any = 'srs-daily') => {
    setSelectedFlashcardsTopic(topic);
    setCurrentTab('flashcards');
  };

  // Technical Documentation & ADR Viewer modal state
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>(undefined);

  const handleOpenDocumentation = (docId?: string) => {
    setSelectedDocId(docId);
    setIsDocumentationOpen(true);
  };

  // Automatic Updates & Service Worker state
  const [hasUpdateAvailable, setHasUpdateAvailable] = useState(false);
  const [latestVersionInfo, setLatestVersionInfo] = useState<VersionInfo | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  // First launch onboarding check (or after full reset)
  useEffect(() => {
    try {
      const hasCompletedOnboarding = localStorage.getItem('lpi_onboarding_completed');
      if (!hasCompletedOnboarding) {
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        // If onboarding already done, check if initial diagnostic test was seen
        const hasSeen = localStorage.getItem('lpi_diagnostic_seen');
        const existingResult = getStoredDiagnosticResult();
        if (!existingResult && !hasSeen) {
          const timer = setTimeout(() => {
            setIsDiagnosticOpen(true);
            setDiagnosticMode('intro');
            localStorage.setItem('lpi_diagnostic_seen', 'true');
          }, 800);
          return () => clearTimeout(timer);
        }
      }
    } catch {}
  }, []);

  // Initialize service worker and update listener
  useEffect(() => {
    initServiceWorker();

    const unsubscribe = subscribeToUpdateEvents((available, info) => {
      if (available) {
        setHasUpdateAvailable(true);
        if (info) {
          setLatestVersionInfo(info);
        }
        setShowUpdateBanner(true);
      }
    });

    // Check on startup
    checkForUpdates(false).then((res) => {
      if (res.hasUpdate) {
        setHasUpdateAvailable(true);
        if (res.latestInfo) {
          setLatestVersionInfo(res.latestInfo);
        }
        setShowUpdateBanner(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Timer countdown for practice mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (currentTab === 'practice' && isTimerRunning && examTimerSeconds > 0) {
      interval = setInterval(() => {
        setExamTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTab, isTimerRunning, examTimerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId || 'exam-101');
    setExamTimerSeconds(45 * 60);
    setIsTimerRunning(true);
    setCurrentTab('practice');
    setIsMenuOpen(false);
  };

  const handleOpenLearningTopic = (topicId?: string) => {
    setSelectedLearningTopic(topicId);
    setCurrentTab('learning');
    setIsMenuOpen(false);
  };

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
  };

  const handleOpenSettings = (tab: 'updates' | 'profile' | 'preferences' | 'language' = 'updates') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
    setIsMenuOpen(false);
  };

  // Check and clean any prototype remnant data on mount
  useEffect(() => {
    try {
      const savedObjs = localStorage.getItem('lpic_mastered_objectives');
      if (savedObjs) {
        const parsed = JSON.parse(savedObjs);
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.includes('101.1') &&
          parsed.includes('101.2') &&
          parsed.includes('200.1')
        ) {
          localStorage.setItem('lpic_mastered_objectives', JSON.stringify([]));
        }
      }
    } catch {}
  }, []);

  const handleCompletePracticeSession = (correctCount: number, total: number, examId: string) => {
    setUserStats((prev) => {
      const isLpic101 = examId === 'exam-101';
      const isLpic102 = examId === 'exam-102';
      return {
        ...prev,
        questionsDoneToday: Math.min(prev.dailyGoal, prev.questionsDoneToday + total),
        systemArchitectureProgress: isLpic101
          ? Math.min(100, prev.systemArchitectureProgress + 10)
          : prev.systemArchitectureProgress,
        linuxInstallationProgress: isLpic102
          ? Math.min(100, prev.linuxInstallationProgress + 10)
          : prev.linuxInstallationProgress,
        pathCompletionPct: Math.min(100, prev.pathCompletionPct + 2),
      };
    });

    // Save session to exam history
    try {
      const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const historyRecord = {
        id: 'session-' + Date.now(),
        examId,
        examCode: examId === 'exam-010' ? '010-160' : examId.replace('exam-', '') + '-500',
        examName: examId.toUpperCase(),
        date: new Date().toISOString(),
        score: scorePct,
        correctCount,
        totalQuestions: total,
        passed: scorePct >= 70,
      };
      const existingHistory = JSON.parse(localStorage.getItem('lpi_exam_history') || '[]');
      const updatedHistory = [historyRecord, ...existingHistory].slice(0, 10);
      localStorage.setItem('lpi_exam_history', JSON.stringify(updatedHistory));
      // Trigger local storage event for reactive UI in Dashboard
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleResetStats = () => {
    setUserStats(initialUserStats);
    setExamTimerSeconds(45 * 60 + 10);
    try {
      localStorage.removeItem('lpi_user_stats');
      localStorage.setItem('lpic_mastered_objectives', JSON.stringify([]));
      localStorage.removeItem('lpi_essentials_status');
      localStorage.removeItem('lpi_current_target');
      localStorage.removeItem('lpi_exam_history');
      localStorage.removeItem('lpic1_mastered_cards');
      localStorage.removeItem('lpic1_review_cards');
      localStorage.removeItem('lpic1_starred_cards');
      localStorage.removeItem('lpic_srs_records');
      localStorage.removeItem('lpic_weakness_report');
      localStorage.removeItem('lpic_completed_labs');
      localStorage.removeItem('lpic_practice_history');
      localStorage.removeItem('lpi_diagnostic_result');
      localStorage.removeItem('lpi_diagnostic_seen');
      localStorage.removeItem('lpi_onboarding_completed');
      localStorage.removeItem('lpic_glossary_bookmarks');
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('lpi_progress_reset'));
    } catch (e) {
      console.error('Failed to reset localStorage progress', e);
    }
    setDataResetKey((prev) => prev + 1);
    setIsProfileOpen(false);
  };

  const handleUpdateTarget = (newTarget: string) => {
    setUserStats((prev) => ({
      ...prev,
      currentTarget: newTarget,
    }));
  };

  const currentTiers = isFrench ? frenchCertificationTiers : certificationTiers;

  const handleOpenDiagnostic = (mode: 'intro' | 'test' | 'results' = 'intro') => {
    setDiagnosticMode(mode);
    setIsDiagnosticOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#201b11] font-sans flex flex-col selection:bg-[#ffc20e] selection:text-[#6d5100]">
      {/* Top App Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={handleSelectTab}
        examTimer={formatTimer(examTimerSeconds)}
        isExamTimerLow={examTimerSeconds < 300}
        onOpenProfile={() => handleOpenSettings('profile')}
        onOpenSettings={() => handleOpenSettings('updates')}
        hasUpdateAvailable={hasUpdateAvailable}
        onOpenDiagnostic={() => handleOpenDiagnostic('intro')}
        onOpenExplainDifferently={() => handleOpenExplainDifferently('umask', 'simple')}
        onClosePractice={() => setCurrentTab('dashboard')}
        onOpenExamMenu={() => {
          if (confirm('Pause timer?')) {
            setIsTimerRunning(!isTimerRunning);
          }
        }}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        isMenuOpen={isMenuOpen}
      />

      {/* Hamburger Menu Drawer organized by categories */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onSelectLearningTopic={handleOpenLearningTopic}
        onStartExam={handleStartExam}
        onOpenProfile={() => handleOpenSettings('profile')}
        onOpenSettings={(tab) => handleOpenSettings(tab || 'updates')}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        userStats={userStats}
        onOpenDiagnostic={() => handleOpenDiagnostic('intro')}
        onOpenExplainDifferently={() => handleOpenExplainDifferently('umask', 'simple')}
        onOpenDocumentation={handleOpenDocumentation}
      />

      <div className="flex flex-1 w-full pt-16 md:pt-20">
        {/* Desktop Sidebar */}
        <DesktopSidebar
          currentTab={currentTab}
          onTabChange={handleSelectTab}
          onOpenExplainDifferently={() => handleOpenExplainDifferently('umask', 'simple')}
        />

        {/* Main Content Area */}
        <main key={`main-app-content-${dataResetKey}`} className="flex-1 px-4 md:px-8 py-6 md:pl-72 max-w-7xl mx-auto w-full transition-all duration-200">
          <ErrorBoundary>
            {currentTab === 'dashboard' && (
              <DashboardView
                userStats={userStats}
                tiers={currentTiers}
                onNavigate={handleSelectTab}
                onSelectTier={() => handleSelectTab('path')}
                onStartExam={handleStartExam}
                onOpenLearning={handleOpenLearningTopic}
                onOpenDiagnostic={handleOpenDiagnostic}
                onOpenFlashcards={handleOpenFlashcards}
              />
            )}

            {currentTab === 'learning' && (
              <LearningObjectivesView
                onNavigate={handleSelectTab}
                onStartExam={handleStartExam}
                initialTopicId={selectedLearningTopic}
              />
            )}

            {currentTab === 'glossary' && (
              <GlossaryView
                onNavigate={handleSelectTab}
                onOpenLearningTopic={handleOpenLearningTopic}
                onExplainDifferently={(topic, context) => handleOpenExplainDifferently(topic, 'simple', context)}
              />
            )}

            {currentTab === 'path' && (
              <CertificationPathView
                userStats={userStats}
                tiers={currentTiers}
                onStartExam={handleStartExam}
                onNavigate={handleSelectTab}
                onOpenLearning={handleOpenLearningTopic}
                onUpdateTarget={handleUpdateTarget}
                onOpenFlashcardsTopic={handleOpenFlashcards}
                onOpenExplainDifferently={(topic, mode, context) =>
                  handleOpenExplainDifferently(topic, mode || 'simple', context)
                }
              />
            )}

            {currentTab === 'practice' && (
              <ErrorBoundary fallbackTitle={isFrench ? "Erreur dans le simulateur d'examen" : "Exam Simulator Error"}>
                <PracticeExamView
                  initialExamId={selectedExamId}
                  onCompleteSession={handleCompletePracticeSession}
                  onExit={() => handleSelectTab('dashboard')}
                  onOpenExplanation={(q) => setActiveExplanation(q)}
                  onStartTimer={() => {
                    setExamTimerSeconds(45 * 60);
                    setIsTimerRunning(true);
                  }}
                  onStopTimer={() => {
                    setIsTimerRunning(false);
                  }}
                />
              </ErrorBoundary>
            )}

            {currentTab === 'flashcards' && (
              <ErrorBoundary fallbackTitle={isFrench ? "Erreur d'affichage des Flashcards" : "Flashcards Display Error"}>
                <FlashcardsView
                  cards={flashcardsData}
                  initialTopic={selectedFlashcardsTopic}
                  onCardLearned={() => {
                    setUserStats((prev) => ({
                      ...prev,
                      questionsDoneToday: Math.min(prev.dailyGoal, prev.questionsDoneToday + 1),
                    }));
                  }}
                />
              </ErrorBoundary>
            )}

            {currentTab === 'training' && (
              <TrainingHubView
                onNavigateTab={handleSelectTab}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Bottom Nav Bar for Mobile */}
      <BottomNav currentTab={currentTab} onTabChange={handleSelectTab} />

      {/* Explanation Modal */}
      <ExplanationModal
        question={activeExplanation}
        onClose={() => setActiveExplanation(null)}
        onExplainDifferently={(topic, context) => {
          setActiveExplanation(null);
          handleOpenExplainDifferently(topic, 'simple', context);
        }}
      />

      {/* Explain Differently Pedagogical Modal (5 Angles, Lab links, Quiz, Traps & Gemini AI) */}
      <ExplainDifferentlyModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        initialTopic={explainTopic}
        initialMode={explainMode}
        contextSnippet={explainContext}
        onNavigateTab={handleSelectTab}
        onOpenTerminalLab={() => {
          setIsExplainModalOpen(false);
          handleSelectTab('training');
        }}
      />

      {/* Settings & Updates Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userStats={userStats}
        onResetStats={handleResetStats}
        initialTab={settingsInitialTab}
        onReplayOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Profile & Stats Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userStats={userStats}
        onResetStats={handleResetStats}
      />

      {/* Initial Diagnostic Level Assessment Modal (20 Questions & Matrix) */}
      <DiagnosticExamModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onNavigate={handleSelectTab}
        onStartExam={handleStartExam}
        initialMode={diagnosticMode}
      />

      {/* Welcome & Interactive Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onNavigate={handleSelectTab}
        onStartExam={handleStartExam}
        onOpenDiagnostic={() => handleOpenDiagnostic('intro')}
      />

      {/* Technical Documentation & ADR Interactive Viewer */}
      <DocumentationModal
        isOpen={isDocumentationOpen}
        onClose={() => setIsDocumentationOpen(false)}
        initialDocId={selectedDocId}
      />

      {/* Floating Automatic Update Notification Banner */}
      <UpdateNotificationBanner
        show={showUpdateBanner}
        versionInfo={latestVersionInfo}
        onDismiss={() => setShowUpdateBanner(false)}
        onOpenSettings={() => {
          setShowUpdateBanner(false);
          handleOpenSettings('updates');
        }}
      />
    </div>
  );
}
