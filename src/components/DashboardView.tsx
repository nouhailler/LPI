import React from 'react';
import { Play, CheckCircle2, Flame, Lock, BookOpen, ChevronRight, Sparkles, Layers, Library } from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';

interface DashboardViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onNavigate: (tab: TabType) => void;
  onSelectTier: (tierId: string) => void;
  onStartExam: (examId: string) => void;
  onOpenLearning?: (topicId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  tiers,
  onNavigate,
  onSelectTier,
  onStartExam,
  onOpenLearning,
}) => {
  const quickTopics = [
    { id: 'topic-101', number: 101, title: 'System Architecture', exam: 'LPIC-1 (101)', weight: 8 },
    { id: 'topic-103', number: 103, title: 'GNU & Unix Commands', exam: 'LPIC-1 (101)', weight: 26 },
    { id: 'topic-109', number: 109, title: 'Networking Fundamentals', exam: 'LPIC-1 (102)', weight: 14 },
    { id: 'topic-200', number: 200, title: 'Capacity Planning', exam: 'LPIC-2 (201)', weight: 8 },
    { id: 'topic-207', number: 207, title: 'Domain Name Server (BIND 9)', exam: 'LPIC-2 (202)', weight: 12 },
    { id: 'topic-301', number: 301, title: 'Samba Basics & Architecture', exam: 'LPIC-3 (300)', weight: 11 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            Welcome back, {userStats.name}
          </h2>
          <p className="text-[#4f4632] text-sm md:text-base mt-1">
            Ready to master Linux and pass your LPIC-1 certification?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('glossary')}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Library className="w-4 h-4" />
            <span>Glossary & Index</span>
          </button>
          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Modules</span>
          </button>
          <button
            onClick={() => onStartExam('exam-101')}
            className="bg-[#ffc20e] text-[#6d5100] px-4 md:px-5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#f9bd00] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continue LPIC-1</span>
          </button>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column: Progress & Goals */}
        <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
          {/* Current Progress Card */}
          <div className="bg-[#f8ecdb] rounded-xl p-5 md:p-6 border border-[#d3c5ab] shadow-xs flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#495e8a] uppercase tracking-wider">
                  Current Target
                </span>
                <h3 className="text-xl font-bold text-[#201b11] mt-0.5">
                  {userStats.currentTarget}
                </h3>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#28A745] fill-[#28A745]/20" />
            </div>

            {/* System Architecture */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                <span>System Architecture</span>
                <span>{userStats.systemArchitectureProgress}%</span>
              </div>
              <div className="w-full bg-[#ece1d0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${userStats.systemArchitectureProgress}%` }}
                />
              </div>
            </div>

            {/* Linux Installation */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4f4632]">
                <span>Linux Installation</span>
                <span>{userStats.linuxInstallationProgress}%</span>
              </div>
              <div className="w-full bg-[#ece1d0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#ffc20e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${userStats.linuxInstallationProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="bg-[#d8e2ff] rounded-xl p-5 md:p-6 border border-[#b7ccfe] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#314671] uppercase tracking-wider">
                Daily Streak
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="w-6 h-6 text-[#E67E22] fill-[#E67E22]" />
                <span className="text-xl font-bold text-[#001a42]">
                  {userStats.streakDays} Days
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#314671] uppercase tracking-wider">
                Questions
              </span>
              <div className="text-xl font-bold text-[#001a42] mt-1 font-mono">
                {userStats.questionsDoneToday} / {userStats.dailyGoal}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Certification Path Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#201b11]">Certification Path</h3>
            <button
              onClick={() => onNavigate('path')}
              className="text-xs font-bold text-[#785a00] hover:underline uppercase tracking-wider"
            >
              View Full Path →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LPIC-1 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#ffc20e]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-1 Logo"
                  className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1U5DBNKJUzD2Ha0gk41iL2nvO5rW0yi6Sy7UK6ytIDKhlbXzvG8V1mcVapLclzooC1go_PYSvv5ecdREVEtfkLC9at0iiftyiovOhoY-gw0T275yDtbuK8mFkmcfJa7qU8resm2z1meK2fXvPDCFxP9inY1L_8k3tevnC7Ar1mRTQRNnPvJMc0DgqvDxFOdDeyNKRaJozO2lDF5rgE8pH7HERVsd5H-s3khKx3yI7ral3ieAzJKFhv_-oY"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-1</h4>
                  <span className="bg-[#ffc20e]/25 text-[#6d5100] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    In Progress
                  </span>
                </div>
                <p className="text-sm text-[#4f4632]">System Administrator</p>
              </div>
            </div>

            {/* LPIC-2 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all opacity-85 hover:opacity-100"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-2 Logo"
                  className="h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Uy6-7GEuXY8N4MXEUdIqW9cD2B0VoEwZpxqFxZ8x-11grFHBR64vd54YQ5G54vT-5tdV2PgtWz_nwj6aWvykisgTh5ExAeExviwwRs1PmS7xV60OjtUMTz0v9t7u-DoyKYnwtowUOk4dF312wtVp5m4Q2UJBH0mZ7iqXyKgN_0wT9ifLYrDdRP83PthX_eqDEBQToDYsdTwPWFYgVxFZIo9j5g56odvwNl9dgErLExI9pUhn3ULquWpww"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-2</h4>
                  <Lock className="w-4 h-4 text-[#817660]" />
                </div>
                <p className="text-sm text-[#4f4632]">Linux Engineer</p>
              </div>
            </div>

            {/* LPIC-3 Card */}
            <div
              onClick={() => (onOpenLearning ? onOpenLearning('topic-301') : onNavigate('learning'))}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#5c3566]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-3 Logo"
                  className="h-full object-contain mix-blend-multiply transition-all"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XFptj6KM6nRHCkxi6kPUODrl0KCMrBW0DYV-ac0whxYnpa1b3FAEJZqR2FT6XDvJdiAhaVoXcMBazLja4VzQtbrz6fNtumCNrvhSrdUXqVPC3zWiBHYPDIsu_LNNWGkK0FK4kOsz8GFfzJhAkWcyaQqomQdKFFqGLOxtVSYcxr-Z_aj3VHZZm1__4L91YLw4NLeIFrDXVwZzOaULk2qwduc-LKyg3N_m8JbYmDUYSWdQqZKzJeirMQGQ"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-3</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c3566] bg-[#5c3566]/10 px-2 py-0.5 rounded">
                    Enterprise
                  </span>
                </div>
                <p className="text-sm text-[#4f4632]">300, 303, 305 & 306 Specialties</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glossary & Command Index Quick Banner */}
      <div className="bg-[#f8ecdb] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-[#ffc20e] rounded-xl text-[#6d5100] shadow-xs shrink-0 mt-0.5">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ebdcc8] text-[#785a00]">
                Curriculum Dictionary
              </span>
              <span className="text-xs font-bold text-[#28A745]">LPIC-1 · LPIC-2 · LPIC-3</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#201b11] mt-1">
              Comprehensive Linux Glossary & Command Index
            </h3>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl">
              Look up any Linux command, configuration file, kernel parameter, or architecture term tested across all LPI certification exams with syntax, flags, practical examples, and exam gotchas.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('glossary')}
          className="px-5 py-3 rounded-xl bg-[#785a00] hover:bg-[#624900] text-[#ffffff] font-bold text-xs md:text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Open Glossary & Index</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 200 Interactive Flashcards for Topic 101 & Topic 102 Banner */}
      <div className="bg-[#fdf3e4] border-2 border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-[#785a00] rounded-xl text-white shadow-xs shrink-0 mt-0.5 font-mono font-bold text-lg flex items-center justify-center">
            200
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ffc20e] text-[#6d5100]">
                200 Interactive Flashcards
              </span>
              <span className="text-xs font-bold text-[#785a00]">Topic 101 & Topic 102 Decks</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#201b11] mt-1">
              Master System Architecture & Linux Package Management
            </h3>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl">
              100 cards for Topic 101 (Hardware, Boot, systemd) + 100 cards for Topic 102 (LVM, GRUB 2, Shared Libraries, Debian/APT, RPM/YUM/DNF & Virtualization Guest) with 3D flip, audio pronunciation, and exam gotchas.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('flashcards')}
          className="px-5 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Launch 200 Flashcards</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Learning Section (Exam 101, 102, 201, 202, 300, 303, 305 & 306 Chapters) */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d3c5ab]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#ffc20e] text-[#6d5100] text-[10px] font-bold uppercase tracking-wider rounded">
                Learning Modules
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#201b11]">
                Official LPIC-1, LPIC-2 & LPIC-3 Study Chapters
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
              Explore key knowledge areas, command syntax, and configuration files for Exams 101, 102, 201, 202, 300, 303, 305 & 306.
            </p>
          </div>

          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#785a00] hover:underline"
          >
            <span>View All Topics & Objectives</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => (onOpenLearning ? onOpenLearning(topic.id) : onNavigate('learning'))}
              className="p-3.5 rounded-xl border border-[#d3c5ab] bg-[#fdf9f4] hover:bg-[#ffffff] hover:border-[#785a00] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded">
                    {topic.exam}
                  </span>
                  <span className="text-[11px] font-semibold text-[#817660]">
                    Weight: {topic.weight}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11] group-hover:text-[#785a00] transition-colors">
                  Topic {topic.number}: {topic.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 text-xs font-bold text-[#785a00]">
                <span>Study Objectives</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
