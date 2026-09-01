import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, DesktopSidebar } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { CertificationPathView } from './components/CertificationPathView';
import { LearningObjectivesView } from './components/LearningObjectivesView';
import { PracticeExamView } from './components/PracticeExamView';
import { FlashcardsView } from './components/FlashcardsView';
import { GlossaryView } from './components/GlossaryView';
import { ExplanationModal } from './components/ExplanationModal';
import { ProfileModal } from './components/ProfileModal';
import { certificationTiers, flashcardsData, initialUserStats, practiceQuestions } from './data/lpiData';
import { PracticeQuestion, TabType, UserStats } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
  const [examTimerSeconds, setExamTimerSeconds] = useState(45 * 60 + 10); // 45:10
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [activeExplanation, setActiveExplanation] = useState<PracticeQuestion | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedLearningTopic, setSelectedLearningTopic] = useState<string | undefined>(undefined);

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
  };

  const handleOpenLearningTopic = (topicId?: string) => {
    setSelectedLearningTopic(topicId);
    setCurrentTab('learning');
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
        onTabChange={setCurrentTab}
        examTimer={formatTimer(examTimerSeconds)}
        isExamTimerLow={examTimerSeconds < 300}
        onOpenProfile={() => setIsProfileOpen(true)}
        onClosePractice={() => setCurrentTab('dashboard')}
        onOpenExamMenu={() => {
          if (confirm('Pause timer?')) {
            setIsTimerRunning(!isTimerRunning);
          }
        }}
      />

      <div className="flex flex-1 w-full pt-16 md:pt-20">
        {/* Desktop Sidebar */}
        <DesktopSidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Main Content Area */}
        <main className="flex-1 px-4 md:px-8 py-6 md:pl-72 max-w-7xl mx-auto w-full transition-all duration-200">
          {currentTab === 'dashboard' && (
            <DashboardView
              userStats={userStats}
              tiers={certificationTiers}
              onNavigate={setCurrentTab}
              onSelectTier={() => setCurrentTab('path')}
              onStartExam={handleStartExam}
              onOpenLearning={handleOpenLearningTopic}
            />
          )}

          {currentTab === 'learning' && (
            <LearningObjectivesView
              onNavigate={setCurrentTab}
              onStartExam={handleStartExam}
              initialTopicId={selectedLearningTopic}
            />
          )}

          {currentTab === 'glossary' && (
            <GlossaryView
              onNavigate={setCurrentTab}
              onOpenLearningTopic={handleOpenLearningTopic}
            />
          )}

          {currentTab === 'path' && (
            <CertificationPathView
              userStats={userStats}
              tiers={certificationTiers}
              onStartExam={handleStartExam}
              onNavigate={setCurrentTab}
              onOpenLearning={handleOpenLearningTopic}
            />
          )}

          {currentTab === 'practice' && (
            <PracticeExamView
              questions={practiceQuestions}
              onCompleteSession={handleCompletePracticeSession}
              onExit={() => setCurrentTab('dashboard')}
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
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Explanation Modal */}
      <ExplanationModal
        question={activeExplanation}
        onClose={() => setActiveExplanation(null)}
      />

      {/* Profile & Stats Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userStats={userStats}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
