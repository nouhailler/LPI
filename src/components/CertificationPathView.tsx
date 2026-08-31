import React from 'react';
import { CheckCircle2, Lock, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';

interface CertificationPathViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onStartExam: (examId: string) => void;
  onNavigate: (tab: TabType) => void;
}

export const CertificationPathView: React.FC<CertificationPathViewProps> = ({
  userStats,
  tiers,
  onStartExam,
  onNavigate,
}) => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Page Header */}
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
          Certification Path
        </h1>
        <p className="text-[#4f4632] text-sm md:text-base mt-1 max-w-2xl">
          Track your progress through the Linux Professional Institute certification tiers. Master each level to advance your IT career.
        </p>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-bold text-lg md:text-xl text-[#201b11]">Overall Progress</h2>
            <p className="text-sm text-[#4f4632] mt-0.5">
              You are currently preparing for <span className="font-semibold text-[#785a00]">LPIC-1</span>.
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="font-sans text-2xl md:text-3xl font-bold text-[#0061a4]">
              {userStats.pathCompletionPct}%
            </span>
            <span className="text-[11px] font-bold text-[#817660] block uppercase tracking-wider">
              Path Completion
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-[#ece1d0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0061a4] rounded-full transition-all duration-500"
            style={{ width: `${userStats.pathCompletionPct}%` }}
          />
        </div>
      </div>

      {/* Certification Tiers */}
      <div className="flex flex-col gap-6">
        {/* Linux Essentials Tier */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 relative overflow-hidden group hover:border-[#0061a4] transition-colors shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-[#f2e7d6] text-[#4f4632] rounded-full text-[11px] font-bold tracking-wider mb-2">
                ENTRY LEVEL
              </span>
              <h3 className="font-bold text-xl text-[#201b11]">Linux Essentials</h3>
              <p className="text-sm text-[#4f4632] mt-0.5">
                Fundamentals of Linux systems and open source.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#28A745]/15 flex items-center justify-center text-[#28A745] shrink-0">
              <CheckCircle2 className="w-6 h-6 fill-[#28A745]/20" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/60">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#28A745]" />
                <div>
                  <h4 className="font-bold text-sm text-[#201b11]">Exam 010-160</h4>
                  <p className="text-xs text-[#4f4632]">Linux Essentials Certificate Exam</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#28A745] bg-[#28A745]/10 border border-[#28A745]/20 px-2.5 py-1 rounded">
                PASSED
              </span>
            </div>
          </div>
        </div>

        {/* LPIC-1 Tier (Active Prep) */}
        <div className="bg-[#ffffff] border-2 border-[#ffc20e] rounded-xl p-5 md:p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc20e]/5 rounded-bl-full pointer-events-none -z-0" />
          
          <div className="flex flex-col md:flex-row gap-6 mb-6 relative z-10">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-[#fff8f2] rounded-xl border border-[#d3c5ab] flex items-center justify-center p-2 shrink-0">
              <img
                alt="LPIC-1 Badge"
                className="w-full h-full object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#28A745] animate-pulse" />
                <span className="text-[11px] font-bold text-[#6d5100] uppercase tracking-wider">
                  Active Preparation
                </span>
              </div>
              <h3 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] mb-2">
                LPIC-1: Linux Administrator
              </h3>
              <p className="text-sm text-[#4f4632] mb-4 leading-relaxed">
                Validate your ability to perform maintenance tasks on the command line, install and configure a computer running Linux and configure basic networking.
              </p>

              <div className="flex gap-4">
                <div className="bg-[#fef2e1] px-4 py-2 rounded-lg border border-[#d3c5ab]/60">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    Validity
                  </span>
                  <span className="text-sm font-bold text-[#201b11]">5 Years</span>
                </div>
                <div className="bg-[#fef2e1] px-4 py-2 rounded-lg border border-[#d3c5ab]/60">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    Prerequisites
                  </span>
                  <span className="text-sm font-bold text-[#201b11]">None</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {/* Exam 101 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] relative overflow-hidden flex flex-col justify-between">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0061a4]" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 101-500</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#a7ceff]/30 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  System Architecture, Linux Installation, GNU/Unix Commands
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">Progress</span>
                  <span className="font-bold text-[#0061a4]">70%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#0061a4] rounded-full" style={{ width: '70%' }} />
                </div>
                <button
                  onClick={() => onStartExam('exam-101')}
                  className="w-full py-2.5 bg-[#495e8a] hover:bg-[#314671] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Continue Study
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Exam 102 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between opacity-80">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base opacity-80">Exam 102-500</h4>
                  <Lock className="w-4 h-4 text-[#817660]" />
                </div>
                <p className="text-xs text-[#4f4632] mb-3 opacity-80">
                  Shells, Scripting, Data Management, Interfaces, Security
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 opacity-60">
                  <span className="font-bold text-[#817660]">Progress</span>
                  <span className="font-bold text-[#817660]">0%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#817660] rounded-full" style={{ width: '0%' }} />
                </div>
                <button
                  disabled
                  className="w-full py-2.5 border border-[#817660]/40 text-[#817660] rounded-lg font-bold text-xs uppercase tracking-wider opacity-60 cursor-not-allowed"
                >
                  Locked
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LPIC-2 Tier */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 opacity-85 hover:opacity-100 transition-all shadow-xs">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-2 Badge"
                className="w-full h-full object-contain grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0TQaPgzl_r72VPInTrIDxVlwi3OFeOvhFVrVIsxKNn5HUG1aUqzYLI7HMSX47TH2atoBwmrLG6VLkA_H87wwDn6pcMUD1Jbfejl0hX3Hwb1acpqEdPY7O16Lvl98xBY3SZVEHExTDa4p8eJ1YFZJD-g6eFj12yhf5wE8Qje0UsXGQMMTmNxHonUdQKhQDJh1wFCUVRmZxLeVFzU11IEICXSil6_8fRWcqnTrt6aU3UzdST9bjort4"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#ece1d0] text-[#4f4632] rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                Advanced
              </span>
              <h3 className="font-bold text-lg text-[#201b11]">LPIC-2: Linux Engineer</h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
                Administer small to medium-sized mixed networks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/50">
              <Lock className="w-4 h-4 text-[#817660]" />
              <span className="font-semibold text-xs text-[#4f4632]">Exam 201-450</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/50">
              <Lock className="w-4 h-4 text-[#817660]" />
              <span className="font-semibold text-xs text-[#4f4632]">Exam 202-450</span>
            </div>
          </div>
        </div>

        {/* LPIC-3 Tier */}
        <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-5 md:p-6 opacity-75 hover:opacity-100 transition-all shadow-xs">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-3 Badge"
                className="w-full h-full object-contain grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmRaFxknGKrNHxwrRWV28s6imunV2CdXxsTNSHFNa4_E7DRDR4tFOJBcjHlNHEXwgqJAUCsflt6iM4Yqy67XtL-H8rw_dvAvIsLxicLfd1UTUvAMCqU6gbylTLUTvr-qM_fdpbwM53vuo33O_jxeb65pUr3AqsnTSj3r1SMGbmyTvoUtfHroz6Wk-p0PigZrF4SQPzshVg5FbxE62XKMivpJrD-5wZ1LaDpKYl5PUe7nQjvlQ1WJCB"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#ece1d0] text-[#4f4632] rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                Enterprise
              </span>
              <h3 className="font-bold text-lg text-[#201b11]">LPIC-3: Enterprise Professional</h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
                Highest level certification for enterprise-level professionals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/50">
              <Lock className="w-4 h-4 text-[#817660]" />
              <span className="font-semibold text-xs text-[#4f4632]">Exam 300 (Mixed Environment)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#fef2e1] rounded-lg border border-[#d3c5ab]/50">
              <Lock className="w-4 h-4 text-[#817660]" />
              <span className="font-semibold text-xs text-[#4f4632]">Exam 303 (Security)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
