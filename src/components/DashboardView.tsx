import React from 'react';
import { Play, CheckCircle2, Flame, BookOpen, ChevronRight, Layers, Library, Zap } from 'lucide-react';
import { ExamTier, TabType, UserStats } from '../types';
import { flashcardsData } from '../data/lpiData';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, isFrench } = useLanguage();
  const totalCardsCount = flashcardsData.length;
  const lpic1CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 101 && c.topicNumber <= 110).length;
  const lpic2CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 200 && c.topicNumber <= 212).length;
  const lpic3CardsCount = flashcardsData.filter((c) => c.topicNumber && c.topicNumber >= 300 && c.topicNumber <= 399).length;

  const quickTopics = [
    { id: 'topic-101', number: 101, title: 'System Architecture', exam: 'LPIC-1 (101)', weight: 8 },
    { id: 'topic-103', number: 103, title: 'GNU & Unix Commands', exam: 'LPIC-1 (101)', weight: 26 },
    { id: 'topic-109', number: 109, title: 'Networking Fundamentals', exam: 'LPIC-1 (102)', weight: 14 },
    { id: 'topic-200', number: 200, title: 'Capacity Planning', exam: 'LPIC-2 (201)', weight: 8 },
    { id: 'topic-208', number: 208, title: 'Web Services (Apache, Squid, Nginx)', exam: 'LPIC-2 (202)', weight: 12 },
    { id: 'topic-209', number: 209, title: 'File Sharing (Samba, NFS)', exam: 'LPIC-2 (202)', weight: 8 },
    { id: 'topic-210', number: 210, title: 'Network Client Management (DHCP, PAM, LDAP)', exam: 'LPIC-2 (202)', weight: 7 },
    { id: 'topic-211', number: 211, title: 'E-Mail Services (Postfix, Dovecot, Delivery)', exam: 'LPIC-2 (202)', weight: 8 },
    { id: 'topic-212', number: 212, title: 'System Security (Router, IDS, OpenVPN, IPsec)', exam: 'LPIC-2 (202)', weight: 10 },
    { id: 'topic-301', number: 301, title: 'Samba Basics (smb.conf, TDB/LDB, RPC)', exam: 'LPIC-3 (300)', weight: 11 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl md:text-3xl font-bold text-[#201b11] tracking-tight">
            {t.dashboard.welcomeBack}, {userStats.name}
          </h2>
          <p className="text-[#4f4632] text-sm md:text-base mt-1">
            {t.dashboard.welcomeSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('training')}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#785a00]" />
            <span>{t.nav.training}</span>
          </button>
          <button
            onClick={() => onNavigate('glossary')}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Library className="w-4 h-4" />
            <span>{t.nav.glossary}</span>
          </button>
          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="bg-[#f8ecdb] text-[#785a00] border border-[#d3c5ab] px-3.5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#ebdcc8] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.dashboard.studyModules}</span>
          </button>
          <button
            onClick={() => onStartExam('exam-101')}
            className="bg-[#ffc20e] text-[#6d5100] px-4 md:px-5 py-3 rounded-lg font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#f9bd00] transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.dashboard.continueExam}</span>
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
                  {t.dashboard.currentTarget}
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
                <span>{t.dashboard.systemArchitecture}</span>
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
                <span>{t.dashboard.linuxInstallation}</span>
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
                {t.dashboard.dailyStreak}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="w-6 h-6 text-[#E67E22] fill-[#E67E22]" />
                <span className="text-xl font-bold text-[#001a42]">
                  {userStats.streakDays} {t.common.days}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#314671] uppercase tracking-wider">
                {t.common.questions}
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
            <h3 className="text-xl font-bold text-[#201b11]">{t.dashboard.certPath}</h3>
            <button
              onClick={() => onNavigate('path')}
              className="text-xs font-bold text-[#785a00] hover:underline uppercase tracking-wider"
            >
              {t.dashboard.viewFullPath} →
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
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-1</h4>
                  <span className="bg-[#ffc20e]/25 text-[#6d5100] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {t.common.inProgress}
                  </span>
                </div>
                <p className="text-sm text-[#4f4632]">System Administrator</p>
              </div>
            </div>

            {/* LPIC-2 Card */}
            <div
              onClick={() => onNavigate('path')}
              className="bg-[#ffffff] rounded-xl border border-[#d3c5ab] shadow-xs overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all hover:border-[#ffc20e]"
            >
              <div className="h-32 bg-[#ece1d0] flex items-center justify-center p-4">
                <img
                  alt="LPIC-2 Logo"
                  className="h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"
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
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-2</h4>
                  <span className="bg-[#ffc20e]/25 text-[#6d5100] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {lpic2CardsCount} Cards Ready
                  </span>
                </div>
                <p className="text-sm text-[#4f4632]">Linux Engineer (Exams 201 & 202)</p>
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
              <div className="p-4 flex flex-col gap-1.5 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-lg text-[#201b11]">LPIC-3</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c3566] bg-[#5c3566]/10 px-2 py-0.5 rounded">
                    {lpic3CardsCount > 0 ? `${lpic3CardsCount} Cards Ready` : 'Enterprise'}
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
                {isFrench ? 'Dictionnaire du programme' : 'Curriculum Dictionary'}
              </span>
              <span className="text-xs font-bold text-[#28A745]">LPIC-1 · LPIC-2 · LPIC-3</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#201b11] mt-1">
              {isFrench ? 'Glossaire Linux exhaustif & Index des commandes' : 'Comprehensive Linux Glossary & Command Index'}
            </h3>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl">
              {isFrench
                ? 'Consultez n\'importe quelle commande Linux, fichier de configuration, paramètre noyau ou terme d\'architecture évalué lors des examens LPI avec syntaxe, options, exemples concrets et pièges d\'examen.'
                : 'Look up any Linux command, configuration file, kernel parameter, or architecture term tested across all LPI certification exams with syntax, flags, practical examples, and exam gotchas.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('glossary')}
          className="px-5 py-3 rounded-xl bg-[#785a00] hover:bg-[#624900] text-[#ffffff] font-bold text-xs md:text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>{isFrench ? 'Ouvrir le glossaire & index' : 'Open Glossary & Index'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1,800+ Interactive Flashcards Banner */}
      <div className="bg-[#fdf3e4] border-2 border-[#ffc20e] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-[#785a00] rounded-xl text-white shadow-xs shrink-0 mt-0.5 font-mono font-bold text-lg flex items-center justify-center">
            {totalCardsCount}+
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ffc20e] text-[#6d5100]">
                {totalCardsCount} {isFrench ? 'Cartes Mémoire Interactives' : 'Interactive Flashcards'}
              </span>
              <span className="text-xs font-bold text-[#785a00] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                LPIC-1: {lpic1CardsCount} {t.common.cards} (Topics 101–110)
              </span>
              <span className="text-xs font-bold text-[#785a00] bg-[#f8ecdb] px-2 py-0.5 rounded border border-[#d3c5ab]">
                LPIC-2: {lpic2CardsCount} {t.common.cards} (Topics 200–210)
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#201b11] mt-1">
              {isFrench
                ? 'Maîtrisez les concepts d\'administration système & ingénierie Linux à travers 20 thèmes complets'
                : 'Master System Admin & Linux Engineering Concepts Across 20 Comprehensive Topics'}
            </h3>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5 max-w-2xl">
              {isFrench
                ? '100 cartes par thème couvrant le matériel/systemd (101), paquets/GRUB (102), commandes Unix (103), systèmes de fichiers/FHS (104), shells/scripts (105), bureaux (106), services/journaux (108), réseau (109), sécurité (110) et les thèmes avancés LPIC-2.'
                : '100 cards per topic covering hardware/systemd (101), packaging/GRUB (102), Unix commands (103), filesystems/FHS (104), shells/scripting (105), desktops (106), services/logs (108), networking (109), security (110), capacity planning (200), kernel (201), system startup (202), and advanced networking.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('flashcards')}
          className="px-5 py-3 rounded-xl bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs md:text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
        >
          <Layers className="w-4 h-4" />
          <span>{isFrench ? `Lancer les cartes (${totalCardsCount})` : `Launch Flashcards (${totalCardsCount})`}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Learning Section (Exam 101, 102, 201, 202, 300, 303, 305 & 306 Chapters) */}
      <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d3c5ab]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#ffc20e] text-[#6d5100] text-[10px] font-bold uppercase tracking-wider rounded">
                {t.dashboard.studyModules}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#201b11]">
                {isFrench ? 'Chapitres de cours officiels LPIC-1, LPIC-2 & LPIC-3' : 'Official LPIC-1, LPIC-2 & LPIC-3 Study Chapters'}
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#4f4632] mt-0.5">
              {isFrench
                ? 'Explorez les domaines clés, syntaxes de commandes et fichiers de configuration pour les examens 101, 102, 201, 202, 300, 303, 305 & 306.'
                : 'Explore key knowledge areas, command syntax, and configuration files for Exams 101, 102, 201, 202, 300, 303, 305 & 306.'}
            </p>
          </div>

          <button
            onClick={() => (onOpenLearning ? onOpenLearning() : onNavigate('learning'))}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#785a00] hover:underline"
          >
            <span>{isFrench ? 'Voir tous les thèmes & objectifs' : 'View All Topics & Objectives'}</span>
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
                    {isFrench ? 'Poids' : 'Weight'}: {topic.weight}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#201b11] group-hover:text-[#785a00] transition-colors">
                  {isFrench ? 'Thème' : 'Topic'} {topic.number}: {topic.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 text-xs font-bold text-[#785a00]">
                <span>{isFrench ? 'Objectifs d\'étude' : 'Study Objectives'}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
