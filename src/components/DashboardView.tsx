import React from 'react';
import { Play, CheckCircle2, Flame, Lock } from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';

interface DashboardViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onNavigate: (tab: TabType) => void;
  onSelectTier: (tierId: string) => void;
  onStartExam: (examId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userStats,
  tiers,
  onNavigate,
  onSelectTier,
  onStartExam,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            Welcome back, {userStats.name}
          </h2>
          <p className="text-[#4f4632] text-sm md:text-base mt-1">
            Ready to master Linux today?
          </p>
        </div>

        <button
          onClick={() => onStartExam('exam-101')}
          className="bg-[#ffc20e] text-[#6d5100] px-6 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#f9bd00] transition-colors flex items-center justify-center gap-2 w-full md:w-auto shadow-xs active:scale-[0.99] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          Continue LPIC-1
        </button>
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
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all opacity-85 hover:opacity-100"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-3 Logo"
                  className="h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XFptj6KM6nRHCkxi6kPUODrl0KCMrBW0DYV-ac0whxYnpa1b3FAEJZqR2FT6XDvJdiAhaVoXcMBazLja4VzQtbrz6fNtumCNrvhSrdUXqVPC3zWiBHYPDIsu_LNNWGkK0FK4kOsz8GFfzJhAkWcyaQqomQdKFFqGLOxtVSYcxr-Z_aj3VHZZm1__4L91YLw4NLeIFrDXVwZzOaULk2qwduc-LKyg3N_m8JbYmDUYSWdQqZKzJeirMQGQ"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-3</h4>
                  <Lock className="w-4 h-4 text-[#817660]" />
                </div>
                <p className="text-sm text-[#4f4632]">Mixed Environments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
