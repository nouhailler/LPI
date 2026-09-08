import React from 'react';
import { CheckCircle2, Lock, ArrowRight, ShieldCheck, Award, BookOpen } from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface CertificationPathViewProps {
  userStats: UserStats;
  tiers: ExamTier[];
  onStartExam: (examId: string) => void;
  onNavigate: (tab: TabType) => void;
  onOpenLearning?: (topicId?: string) => void;
}

export const CertificationPathView: React.FC<CertificationPathViewProps> = ({
  userStats,
  tiers,
  onStartExam,
  onNavigate,
  onOpenLearning,
}) => {
  const { t, isFrench } = useLanguage();

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-16">
      {/* Page Header */}
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
          {t.certPath.title}
        </h1>
        <p className="text-[#4f4632] text-sm md:text-base mt-1 max-w-2xl">
          {t.certPath.subtitle}
        </p>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-[#fef2e1] border border-[#d3c5ab] rounded-xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-bold text-lg md:text-xl text-[#201b11]">{t.certPath.overallProgress}</h2>
            <p className="text-sm text-[#4f4632] mt-0.5">
              {t.certPath.preparingFor} <span className="font-semibold text-[#785a00]">LPIC-1</span>.
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="font-sans text-2xl md:text-3xl font-bold text-[#0061a4]">
              {userStats.pathCompletionPct}%
            </span>
            <span className="text-[11px] font-bold text-[#817660] block uppercase tracking-wider">
              {t.certPath.pathCompletion}
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
                {t.certPath.entryLevel}
              </span>
              <h3 className="font-bold text-xl text-[#201b11]">Linux Essentials</h3>
              <p className="text-sm text-[#4f4632] mt-0.5">
                {isFrench ? 'Fondamentaux des systèmes Linux et de l\'open source.' : 'Fundamentals of Linux systems and open source.'}
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
                  <p className="text-xs text-[#4f4632]">{isFrench ? 'Examen de certificat Linux Essentials' : 'Linux Essentials Certificate Exam'}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#28A745] bg-[#28A745]/10 border border-[#28A745]/20 px-2.5 py-1 rounded">
                {isFrench ? 'RÉUSSI' : 'PASSED'}
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
                src="/lpic-1.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX') {
                    target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOhdrjtM5GESOO_G3NptEHGSY9JxAvXjpHZ67Z9T1_EFVVeMa2S7VVikLqRsW0HmGlO12TrKVAJ4-A91bsR0wNKxAoHTH8SFtFK-OP2X4iunJIUfIkdrmGedPmMl-qg5pB3VNp0vd5ChGR8-bS-bKZQ4F8cX-konp-PHlepO4F5GxWU139c8kBlPq4sLfrFaFz7Hu_UvP71eiOJwN1wjS-03sXoMH5Gkry-YacArysYMHEZkF4iRX';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#28A745] animate-pulse" />
                <span className="text-[11px] font-bold text-[#6d5100] uppercase tracking-wider">
                  {t.certPath.activePrep}
                </span>
              </div>
              <h3 className="font-sans text-xl md:text-2xl font-bold text-[#201b11] mb-2">
                LPIC-1: Linux Administrator
              </h3>
              <p className="text-sm text-[#4f4632] mb-4 leading-relaxed">
                {isFrench
                  ? 'Validez votre capacité à exécuter des tâches de maintenance en ligne de commande, installer et configurer un ordinateur Linux et configurer un réseau de base.'
                  : 'Validate your ability to perform maintenance tasks on the command line, install and configure a computer running Linux and configure basic networking.'}
              </p>

              <div className="flex gap-4">
                <div className="bg-[#fef2e1] px-4 py-2 rounded-lg border border-[#d3c5ab]/60">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    {t.certPath.validity}
                  </span>
                  <span className="text-sm font-bold text-[#201b11]">{t.certPath.fiveYears}</span>
                </div>
                <div className="bg-[#fef2e1] px-4 py-2 rounded-lg border border-[#d3c5ab]/60">
                  <span className="text-[10px] font-bold text-[#817660] block uppercase tracking-wider">
                    {t.certPath.prerequisites}
                  </span>
                  <span className="text-sm font-bold text-[#201b11]">{t.certPath.none}</span>
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
                    {isFrench ? 'Actif' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Architecture système, Installation Linux, Commandes GNU/Unix'
                    : 'System Architecture, Linux Installation, GNU/Unix Commands'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">{t.certPath.progress}</span>
                  <span className="font-bold text-[#0061a4]">70%</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#0061a4] rounded-full" style={{ width: '70%' }} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-101') : onNavigate('learning'))}
                    className="flex-1 py-2.5 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] border border-[#d3c5ab] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {isFrench ? 'Objectifs' : 'Objectives'}
                  </button>
                  <button
                    onClick={() => onStartExam('exam-101')}
                    className="flex-1 py-2.5 bg-[#495e8a] hover:bg-[#314671] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isFrench ? 'Pratique' : 'Practice'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Exam 102 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 102-500</h4>
                  <span className="text-[11px] font-bold text-[#785a00] bg-[#ffc20e]/30 px-2 py-0.5 rounded">
                    Topics 105-110
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Shells, Scripts, Gestion des données, Interfaces, Sécurité & Réseau'
                    : 'Shells, Scripting, Data Management, Interfaces, Security & Networking'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-[#817660]">{t.certPath.objectivesStatus}</span>
                  <span className="font-bold text-[#785a00]">{t.certPath.available}</span>
                </div>
                <div className="w-full h-2 bg-[#ece1d0] rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-[#ffc20e]" style={{ width: '10%' }} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => (onOpenLearning ? onOpenLearning('topic-105') : onNavigate('learning'))}
                    className="w-full py-2.5 bg-[#785a00] hover:bg-[#604700] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {isFrench ? 'Étudier les objectifs Examen 102' : 'Study Exam 102 Objectives'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LPIC-2 Tier */}
        <div className="bg-[#ffffff] border-2 border-[#d3c5ab] hover:border-[#0061a4] rounded-xl p-5 md:p-6 transition-all shadow-xs">
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-2 Badge"
                className="w-full h-full object-contain"
                src="/lpic-2.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TQaPgzl_r72VPInTrIDxVlwi3OFeOvhFVrVIsxKNn5HUG1aUqzYLI7HMSX47TH2atoBwmrLG6VLkA_H87wwDn6pcMUD1Jbfejl0hX3Hwb1acpqEdPY7O16Lvl98xBY3SZVEHExTDa4p8eJ1YFZJD-g6eFj12yhf5wE8Qje0UsXGQMMTmNxHonUdQKhQDJh1wFCUVRmZxLeVFzU11IEICXSil6_8fRWcqnTrt6aU3UzdST9bjort4') {
                    target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0TQaPgzl_r72VPInTrIDxVlwi3OFeOvhFVrVIsxKNn5HUG1aUqzYLI7HMSX47TH2atoBwmrLG6VLkA_H87wwDn6pcMUD1Jbfejl0hX3Hwb1acpqEdPY7O16Lvl98xBY3SZVEHExTDa4p8eJ1YFZJD-g6eFj12yhf5wE8Qje0UsXGQMMTmNxHonUdQKhQDJh1wFCUVRmZxLeVFzU11IEICXSil6_8fRWcqnTrt6aU3UzdST9bjort4';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#e7f0f8] text-[#0061a4] rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                {t.certPath.advancedCert}
              </span>
              <h3 className="font-bold text-lg text-[#201b11]">LPIC-2: Linux Engineer</h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
                {isFrench
                  ? 'Administrer des réseaux mixtes de petite à moyenne taille, planification de capacité, compilation du noyau, serveurs web/mail, DNS et sécurité réseau.'
                  : 'Administer small to medium-sized mixed networks, capacity planning, kernel compilation, web/mail servers, DNS, and network security.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exam 201 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 201-450</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#0061a4]/10 px-2 py-0.5 rounded">
                    Topics 200-206
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Planification de capacité, Noyau Linux, Démarrage et récupération du système, Systèmes de fichiers et périphériques, Stockage (RAID/LVM), Configuration réseau.'
                    : 'Capacity Planning, Linux Kernel, System Startup & Recovery, Filesystems & Devices, Storage (RAID/LVM), Network Config.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => (onOpenLearning ? onOpenLearning('topic-200') : onNavigate('learning'))}
                  className="w-full py-2.5 bg-[#0061a4] hover:bg-[#004f87] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isFrench ? 'Étudier les objectifs Examen 201' : 'Study Exam 201 Objectives'}
                </button>
              </div>
            </div>

            {/* Exam 202 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 202-450</h4>
                  <span className="text-[11px] font-bold text-[#0061a4] bg-[#0061a4]/10 px-2 py-0.5 rounded">
                    Topics 207-212
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'DNS (BIND 9), Services Web (Apache, Nginx, Squid), Partage de fichiers (Samba, NFS), Gestion de clients, Messagerie électronique (Postfix, Dovecot), Sécurité système.'
                    : 'DNS (BIND 9), Web Services (Apache, Nginx, Squid), File Sharing (Samba, NFS), Client Management, E-Mail (Postfix, Dovecot), System Security.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => (onOpenLearning ? onOpenLearning('topic-207') : onNavigate('learning'))}
                  className="w-full py-2.5 bg-[#0061a4] hover:bg-[#004f87] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isFrench ? 'Étudier les objectifs Examen 202' : 'Study Exam 202 Objectives'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LPIC-3 Tier (Enterprise) */}
        <div className="bg-[#ffffff] border-2 border-[#d3c5ab] hover:border-[#5c3566] rounded-xl p-5 md:p-6 transition-all shadow-xs">
          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="w-16 h-16 bg-[#f8ecdb] rounded-lg border border-[#d3c5ab] flex items-center justify-center p-1 shrink-0">
              <img
                alt="LPIC-3 Badge"
                className="w-full h-full object-contain"
                src="/lpic-3.jpg"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmRaFxknGKrNHxwrRWV28s6imunV2CdXxsTNSHFNa4_E7DRDR4tFOJBcjHlNHEXwgqJAUCsflt6iM4Yqy67XtL-H8rw_dvAvIsLxicLfd1UTUvAMCqU6gbylTLUTvr-qM_fdpbwM53vuo33O_jxeb65pUr3AqsnTSj3r1SMGbmyTvoUtfHroz6Wk-p0PigZrF4SQPzshVg5FbxE62XKMivpJrD-5wZ1LaDpKYl5PUe7nQjvlQ1WJCB') {
                    target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmRaFxknGKrNHxwrRWV28s6imunV2CdXxsTNSHFNa4_E7DRDR4tFOJBcjHlNHEXwgqJAUCsflt6iM4Yqy67XtL-H8rw_dvAvIsLxicLfd1UTUvAMCqU6gbylTLUTvr-qM_fdpbwM53vuo33O_jxeb65pUr3AqsnTSj3r1SMGbmyTvoUtfHroz6Wk-p0PigZrF4SQPzshVg5FbxE62XKMivpJrD-5wZ1LaDpKYl5PUe7nQjvlQ1WJCB';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#5c3566]/10 text-[#5c3566] rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                {t.certPath.enterpriseCert}
              </span>
              <h3 className="font-bold text-lg text-[#201b11]">LPIC-3: Enterprise Professional (Mixed Environments, Security, HA & Storage)</h3>
              <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
                {isFrench
                  ? 'Plus haut niveau de certification Linux pour les spécialistes d\'entreprise : choisissez entre Environnements Mixtes (300), Sécurité d\'Entreprise (303) ou Haute Disponibilité et Grappes de Stockage (306).'
                  : 'Highest level Linux certification for enterprise specialists: Choose between Mixed Environments (300), Enterprise Security (303), or High Availability and Storage Clusters (306).'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Exam 300 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 300-300</h4>
                  <span className="text-[11px] font-bold text-[#5c3566] bg-[#5c3566]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'Environnements Mixtes' : 'Mixed Environments'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Thèmes 301–305 : Fondamentaux Samba, Samba comme AD DC et serveur membre, Sécurité des partages, Authentification client (SSSD/Winbind/CIFS), Gestion des identités Linux (FreeIPA et NFSv4).'
                    : 'Topics 301–305: Samba Basics, Samba as AD DC & Member Server, Share Security, Client Auth (SSSD/Winbind/CIFS), Linux Identity Management (FreeIPA & NFSv4).'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => (onOpenLearning ? onOpenLearning('topic-301') : onNavigate('learning'))}
                  className="w-full py-2.5 bg-[#5c3566] hover:bg-[#472750] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isFrench ? 'Étudier les objectifs Examen 300' : 'Study Exam 300 Objectives'}
                </button>
              </div>
            </div>

            {/* Exam 303 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 303-300</h4>
                  <span className="text-[11px] font-bold text-[#991b1b] bg-[#991b1b]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'Sécurité d\'Entreprise' : 'Enterprise Security'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Thèmes 325–328 : Cryptographie (PKI, X.509, LUKS, DNSSEC), Sécurité des hôtes (Durcissement, Audit, AIDE, PAM, FreeIPA), Contrôle d\'accès (ACLs, SELinux, NFSv4) et Sécurité réseau (FreeRADIUS, NIDS, Netfilter, VPNs).'
                    : 'Topics 325–328: Cryptography (PKI, X.509, LUKS, DNSSEC), Host Security (Hardening, Audit, AIDE, PAM, FreeIPA), Access Control (ACLs, SELinux, NFSv4), and Network Security (FreeRADIUS, NIDS, Netfilter, VPNs).'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => (onOpenLearning ? onOpenLearning('topic-325') : onNavigate('learning'))}
                  className="w-full py-2.5 bg-[#991b1b] hover:bg-[#7f1d1d] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isFrench ? 'Étudier les objectifs Examen 303' : 'Study Exam 303 Objectives'}
                </button>
              </div>
            </div>

            {/* Exam 306 */}
            <div className="p-4 border border-[#d3c5ab] rounded-lg bg-[#fff8f2] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#201b11] text-base">Exam 306-300</h4>
                  <span className="text-[11px] font-bold text-[#047857] bg-[#047857]/15 px-2 py-0.5 rounded">
                    {isFrench ? 'HA & Stockage' : 'HA & Storage'}
                  </span>
                </div>
                <p className="text-xs text-[#4f4632] mb-3">
                  {isFrench
                    ? 'Thèmes 361–364 : Gestion des clusters HA (LVS, Keepalived, Pacemaker, Corosync, STONITH), Stockage en cluster (DRBD, SAN/iSCSI, GFS2/OCFS2), Stockage distribué (GlusterFS, Ceph) et HA sur nœud unique.'
                    : 'Topics 361–364: HA Cluster Management (LVS, Keepalived, Pacemaker, Corosync, STONITH), Cluster Storage (DRBD, SAN/iSCSI, GFS2/OCFS2), Distributed Storage (GlusterFS, Ceph), and Single Node HA (Watchdog, RAID, LVM, Teaming).'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => (onOpenLearning ? onOpenLearning('topic-361') : onNavigate('learning'))}
                  className="w-full py-2.5 bg-[#047857] hover:bg-[#065f46] text-[#ffffff] rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isFrench ? 'Étudier les objectifs Examen 306' : 'Study Exam 306 Objectives'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
