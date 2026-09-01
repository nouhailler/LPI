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
import { ExplanationModal } from './components/ExplanationModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { UpdateNotificationBanner } from './components/UpdateNotificationBanner';
import { certificationTiers, flashcardsData, initialUserStats, practiceQuestions } from './data/lpiData';
import { PracticeQuestion, TabType, UserStats } from './types';
import {
  initServiceWorker,
  subscribeToUpdateEvents,
  checkForUpdates,
  VersionInfo,
} from './utils/updateService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [examTimerSeconds, setExamTimerSeconds] = useState(45 * 60 + 10); // 45:10
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [activeExplanation, setActiveExplanation] = useState<PracticeQuestion | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'updates' | 'profile' | 'preferences'>('updates');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLearningTopic, setSelectedLearningTopic] = useState<string | undefined>(undefined);

  // Automatic Updates & Service Worker state
  const [hasUpdateAvailable, setHasUpdateAvailable] = useState(false);
  const [latestVersionInfo, setLatestVersionInfo] = useState<VersionInfo | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

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
    setExamTimerSeconds(45 * 60 + 10);
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

  const handleOpenSettings = (tab: 'updates' | 'profile' | 'preferences' = 'updates') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
    setIsMenuOpen(false);
  };

  const handleCompletePracticeSession = (correctCount: number, total: number) => {
    setUserStats((prev) => ({
      ...prev,
      questionsDoneToday: Math.min(prev.dailyGoal, prev.questionsDoneToday + total),
      systemArchitectureProgress: Math.min(100, prev.systemArchitectureProgress + 5),
    }));
  };

  const handleResetStats = () => {
    setUserStats(initialUserStats);
    setExamTimerSeconds(45 * 60 + 10);
    setIsProfileOpen(false);
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
        onOpenSettings={() => handleOpenSettings('updates')}
        userStats={userStats}
      />

      <div className="flex flex-1 w-full pt-16 md:pt-20">
        {/* Desktop Sidebar */}
        <DesktopSidebar currentTab={currentTab} onTabChange={handleSelectTab} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 py-6 md:pl-72 max-w-7xl mx-auto w-full transition-all duration-200">
          {currentTab === 'dashboard' && (
            <DashboardView
              userStats={userStats}
              tiers={certificationTiers}
              onNavigate={handleSelectTab}
              onSelectTier={() => handleSelectTab('path')}
              onStartExam={handleStartExam}
              onOpenLearning={handleOpenLearningTopic}
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
            />
          )}

          {currentTab === 'path' && (
            <CertificationPathView
              userStats={userStats}
              tiers={certificationTiers}
              onStartExam={handleStartExam}
              onNavigate={handleSelectTab}
              onOpenLearning={handleOpenLearningTopic}
            />
          )}

          {currentTab === 'practice' && (
            <PracticeExamView
              questions={practiceQuestions}
              onCompleteSession={handleCompletePracticeSession}
              onExit={() => handleSelectTab('dashboard')}
              onOpenExplanation={(q) => setActiveExplanation(q)}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsView
              cards={flashcardsData}
              onCardLearned={() => {
                setUserStats((prev) => ({
                  ...prev,
                  questionsDoneToday: Math.min(prev.dailyGoal, prev.questionsDoneToday + 1),
                }));
              }}
            />
          )}
        </main>
      </div>

      {/* Bottom Nav Bar for Mobile */}
      <BottomNav currentTab={currentTab} onTabChange={handleSelectTab} />

      {/* Explanation Modal */}
      <ExplanationModal
        question={activeExplanation}
        onClose={() => setActiveExplanation(null)}
      />

      {/* Settings & Updates Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userStats={userStats}
        onResetStats={handleResetStats}
        initialTab={settingsInitialTab}
      />

      {/* Profile & Stats Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userStats={userStats}
        onResetStats={handleResetStats}
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
