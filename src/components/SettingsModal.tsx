import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  Settings,
  User,
  ShieldCheck,
  RotateCcw,
  Flame,
  Award,
  Zap,
  Info,
  Sliders,
  Bell,
  Trash2,
  HardDrive,
  Globe,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { UserStats } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { FirebaseAuthProfileSection } from './FirebaseAuthProfileSection';
import {
  CURRENT_APP_VERSION,
  CURRENT_RELEASE_DATE,
  CURRENT_BUILD_TAG,
  getUpdateSettings,
  saveUpdateSettings,
  checkForUpdates,
  forceApplicationUpdate,
  VersionInfo,
  UpdateSettings,
} from '../utils/updateService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onResetStats: () => void;
  initialTab?: 'updates' | 'profile' | 'preferences' | 'language';
  onReplayOnboarding?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onResetStats,
  initialTab = 'updates',
  onReplayOnboarding,
}) => {
  const { t, language, isFrench } = useLanguage();
  const [activeTab, setActiveTab] = useState<'updates' | 'profile' | 'preferences' | 'language'>(initialTab);
  const [updateSettings, setUpdateSettings] = useState<UpdateSettings>(getUpdateSettings());
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    status: 'idle' | 'up-to-date' | 'update-available' | 'error';
    message?: string;
    latestInfo?: VersionInfo;
  }>({ status: 'idle' });

  // Execute comprehensive reset
  const handleExecuteReset = () => {
    onResetStats();
    setShowResetConfirm(false);
    setResetSuccessToast(true);
    setTimeout(() => {
      setResetSuccessToast(false);
    }, 4500);
  };

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setUpdateSettings(getUpdateSettings());
      setCheckResult({ status: 'idle' });
      setShowResetConfirm(false);
    }
  }, [isOpen, initialTab]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleManualCheck = async () => {
    setIsChecking(true);
    setCheckResult({ status: 'idle' });
    try {
      const res = await checkForUpdates(true);
      if (res.hasUpdate) {
        setCheckResult({
          status: 'update-available',
          message: `New version ${res.latestVersion} available!`,
          latestInfo: res.latestInfo,
        });
      } else {
        setCheckResult({
          status: 'up-to-date',
          message: `You are on the latest version (${CURRENT_APP_VERSION})`,
          latestInfo: res.latestInfo,
        });
      }
    } catch (e: any) {
      setCheckResult({
        status: 'error',
        message: e?.message || 'Unable to check updates. You might be offline.',
      });
    } finally {
      setIsChecking(false);
      setUpdateSettings(getUpdateSettings());
    }
  };

  const handleForceUpdate = async () => {
    if (confirm('Force an immediate update? This will clear local application caches and reload the latest version.')) {
      setIsUpdating(true);
      await forceApplicationUpdate();
    }
  };

  const toggleAutoUpdate = (enabled: boolean) => {
    const updated = saveUpdateSettings({ autoUpdateEnabled: enabled });
    setUpdateSettings(updated);
  };

  const changeInterval = (mins: number) => {
    const updated = saveUpdateSettings({ checkIntervalMinutes: mins });
    setUpdateSettings(updated);
  };

  const formatLastChecked = (isoString: string | null) => {
    if (!isoString) return 'Never';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl max-w-xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#d3c5ab] bg-[#fff8f2] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="font-sans font-bold text-lg sm:text-xl text-[#785a00]">
                Settings & System
              </h2>
              <p className="text-xs text-[#4f4632]">
                Version info, automatic updates, and user preferences
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            aria-label="Close Settings"
            className="p-1.5 rounded-full text-[#817660] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Settings */}
        <div className="flex border-b border-[#d3c5ab] bg-[#f8ecdb]/60 px-4 sm:px-5 gap-2 shrink-0 overflow-x-auto">
          <button
            id="settings-tab-updates"
            onClick={() => setActiveTab('updates')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'updates'
                ? 'border-[#785a00] text-[#785a00]'
                : 'border-transparent text-[#817660] hover:text-[#201b11]'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Version & Updates</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#ebdcc8] text-[#785a00] rounded">
              v{CURRENT_APP_VERSION}
            </span>
          </button>

          <button
            id="settings-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#785a00] text-[#785a00]'
                : 'border-transparent text-[#817660] hover:text-[#201b11]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Study Profile</span>
          </button>

          <button
            id="settings-tab-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#785a00] text-[#785a00]'
                : 'border-transparent text-[#817660] hover:text-[#201b11]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.settings.tabs.preferences}</span>
          </button>

          <button
            id="settings-tab-language"
            onClick={() => setActiveTab('language')}
            className={`py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'language'
                ? 'border-[#785a00] text-[#785a00]'
                : 'border-transparent text-[#817660] hover:text-[#201b11]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t.common.language}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#ebdcc8] text-[#785a00] rounded font-mono uppercase font-bold">
              {language}
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* ============================================================ */}
          {/* TAB 1: UPDATES & VERSION                                    */}
          {/* ============================================================ */}
          {activeTab === 'updates' && (
            <div className="space-y-5">
              {/* Highlight Card: Version & Release Date */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ebdcc8]">
                  <div className="flex items-start gap-3.5">
                    <img
                      src="/app-logo.jpg"
                      alt="LPI Logo"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#d3c5ab] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base sm:text-lg text-[#201b11]">
                          LPI Certification Prep
                        </h3>
                        <span className="px-2 py-0.5 bg-[#ffc20e] text-[#6d5100] text-xs font-bold rounded-md">
                          v{CURRENT_APP_VERSION}
                        </span>
                      </div>
                      <p className="text-xs text-[#817660] mt-0.5">
                        Build tag: <span className="font-mono text-[#4f4632]">{CURRENT_BUILD_TAG}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#ebdcc8]">
                    <span className="text-[11px] uppercase font-bold text-[#817660]">Release Date</span>
                    <span className="text-xs sm:text-sm font-semibold text-[#201b11] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#785a00]" />
                      {CURRENT_RELEASE_DATE}
                    </span>
                  </div>
                </div>

                {/* Status Indicator & Results */}
                <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    {checkResult.status === 'idle' && (
                      <span className="text-[#817660] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Last checked: {formatLastChecked(updateSettings.lastCheckedTime)}
                      </span>
                    )}

                    {checkResult.status === 'up-to-date' && (
                      <span className="text-[#28A745] font-semibold flex items-center gap-1.5 bg-[#28A745]/10 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {checkResult.message}
                      </span>
                    )}

                    {checkResult.status === 'update-available' && (
                      <span className="text-[#785a00] font-bold flex items-center gap-1.5 bg-[#ffc20e]/30 px-2.5 py-1 rounded-lg">
                        <Sparkles className="w-4 h-4 text-[#785a00] shrink-0" />
                        {checkResult.message}
                      </span>
                    )}

                    {checkResult.status === 'error' && (
                      <span className="text-[#ba1a1a] font-medium flex items-center gap-1.5 bg-[#ffdad6] px-2.5 py-1 rounded-lg">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {checkResult.message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="check-updates-btn"
                      onClick={handleManualCheck}
                      disabled={isChecking}
                      className="px-3.5 py-2 bg-[#ebdcc8] hover:bg-[#d3c5ab] disabled:opacity-50 text-[#785a00] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                      {isChecking ? 'Checking...' : 'Check for Updates'}
                    </button>

                    <button
                      id="force-update-btn"
                      onClick={handleForceUpdate}
                      disabled={isUpdating}
                      className="px-3.5 py-2 bg-[#ffc20e] hover:bg-[#f9bd00] disabled:opacity-50 text-[#6d5100] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Force refresh all cache and reload app"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isUpdating ? 'animate-bounce' : ''}`} />
                      {isUpdating ? 'Reloading...' : 'Force Update'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Automatic Update Configuration */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-[#201b11] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#785a00]" />
                      Automatic Background Updates
                    </div>
                    <p className="text-xs text-[#817660]">
                      Periodically checks and prepares new versions automatically in the background
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-auto-update"
                      checked={updateSettings.autoUpdateEnabled}
                      onChange={(e) => toggleAutoUpdate(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#ebdcc8] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d3c5ab] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#785a00]"></div>
                  </label>
                </div>

                {updateSettings.autoUpdateEnabled && (
                  <div className="pt-3 border-t border-[#ebdcc8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[#4f4632] font-medium">Update check frequency:</span>
                    <div className="flex items-center gap-2">
                      {[
                        { label: '5 Mins', val: 5 },
                        { label: '15 Mins', val: 15 },
                        { label: '1 Hour', val: 60 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          onClick={() => changeInterval(item.val)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            updateSettings.checkIntervalMinutes === item.val
                              ? 'bg-[#785a00] text-white border-[#785a00]'
                              : 'bg-[#fff8f2] text-[#4f4632] border-[#d3c5ab] hover:bg-[#ebdcc8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Release Notes & Changelog */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#817660]">
                    Latest Release Highlights (v{CURRENT_APP_VERSION})
                  </h4>
                  <span className="text-[11px] text-[#785a00] font-medium">
                    Released {CURRENT_RELEASE_DATE}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-[#4f4632]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0 mt-0.5" />
                    <span>
                      <strong>Automatic Background Updates:</strong> Service worker polling and live version check integration.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0 mt-0.5" />
                    <span>
                      <strong>Settings & System Menu:</strong> Added version number, release date, and force update trigger.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0 mt-0.5" />
                    <span>
                      <strong>Categorized Drawer:</strong> Organized navigation for LPIC-1, LPIC-2, and LPIC-3 enterprise tracks.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#28A745] shrink-0 mt-0.5" />
                    <span>
                      <strong>1,700+ Linux Glossary:</strong> Semantic slug deduplication and searchable command syntax.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: STUDY PROFILE                                        */}
          {/* ============================================================ */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-[#ffffff] p-4 rounded-2xl border border-[#d3c5ab]">
                <div className="w-14 h-14 rounded-2xl bg-[#ffc20e] flex items-center justify-center text-[#6d5100] font-bold text-xl shadow-xs">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#201b11]">{userStats.name}</h3>
                  <p className="text-xs text-[#4f4632]">{userStats.role}</p>
                  <div className="text-[11px] text-[#785a00] font-semibold mt-1">
                    Target: {userStats.currentTarget}
                  </div>
                </div>
              </div>

              {/* Cloud Sync & Firebase Auth Section */}
              <FirebaseAuthProfileSection userStats={userStats} />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#ffffff] p-3.5 rounded-xl border border-[#d3c5ab] flex items-center gap-3">
                  <Flame className="w-6 h-6 text-[#E67E22] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#817660] block">Streak</span>
                    <span className="text-base font-bold text-[#201b11]">{userStats.streakDays} Days</span>
                  </div>
                </div>

                <div className="bg-[#ffffff] p-3.5 rounded-xl border border-[#d3c5ab] flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#785a00] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#817660] block">Daily Goal</span>
                    <span className="text-base font-bold text-[#201b11]">
                      {userStats.questionsDoneToday}/{userStats.dailyGoal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accomplishments */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#817660] uppercase tracking-wider block">
                  Certifications Status
                </span>
                <div className="flex items-center justify-between p-3 bg-[#ffffff] rounded-xl border border-[#d3c5ab]">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#28A745]" />
                    <div>
                      <div className="text-xs font-bold text-[#201b11]">Linux Essentials (010-160)</div>
                      <div className="text-[10px] text-[#4f4632]">Certificate Active</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#28A745] bg-[#28A745]/15 px-2 py-0.5 rounded">
                    Passed
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#ffffff] rounded-xl border border-[#d3c5ab]">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-[#785a00]" />
                    <div>
                      <div className="text-xs font-bold text-[#201b11]">LPIC-1 Linux Administrator (101 & 102)</div>
                      <div className="text-[10px] text-[#4f4632]">In Progress • 65% Syllabus Mastery</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#785a00] bg-[#ffc20e]/30 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>

              {/* Reset Data */}
              <div className="pt-2 border-t border-[#d3c5ab]">
                <button
                  onClick={() => {
                    if (confirm(isFrench ? 'Réinitialiser tous les scores de quiz et métriques ?' : 'Reset practice question scores and study statistics?')) {
                      handleExecuteReset();
                    }
                  }}
                  className="w-full py-2.5 border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isFrench ? 'Réinitialiser les statistiques d\'entraînement' : 'Reset Practice Statistics'}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PREFERENCES                                          */}
          {/* ============================================================ */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              {/* Replay Onboarding Tour Card */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#ebdcc8] p-4 sm:p-5 space-y-3.5 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff8f2] text-[#785a00] border border-[#ebdcc8] flex items-center justify-center shrink-0 shadow-2xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-[#201b11]">
                        {isFrench ? 'Visite guidée & Découverte (Onboarding)' : 'Welcome Guide & Interactive Tour'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#ffc20e] text-[#6d5100]">
                        {isFrench ? 'Interactif' : 'Interactive'}
                      </span>
                    </div>
                    <p className="text-xs text-[#4f4632] mt-1 leading-relaxed">
                      {isFrench
                        ? 'Rejouez à tout moment la visite guidée pour redécouvrir l\'ensemble des modules d\'apprentissage, le déroulement des examens blancs, le terminal et la méthode de mémorisation.'
                        : 'Replay the step-by-step interactive onboarding tour anytime to rediscover LPIC modules, mock exams, terminal labs, and active recall methods.'}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    id="preferences-replay-onboarding-btn"
                    onClick={() => {
                      onClose();
                      if (onReplayOnboarding) {
                        onReplayOnboarding();
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#785a00] hover:bg-[#5c4400] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{isFrench ? 'Rejouer l\'onboarding interactif' : 'Replay Interactive Onboarding'}</span>
                  </button>
                </div>
              </div>

              {/* Reset All Progression & Counters Card */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#ebdcc8] p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 shadow-2xs">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-[#201b11]">
                        {isFrench ? 'Réinitialisation de la progression' : 'Reset Learning Progress & Counters'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#ffdad6] text-[#ba1a1a]">
                        {isFrench ? 'Remise à zéro' : 'Start Fresh'}
                      </span>
                    </div>
                    <p className="text-xs text-[#4f4632] mt-1 leading-relaxed">
                      {isFrench
                        ? 'Remet l\'ensemble des compteurs, objectifs et statistiques à zéro pour redémarrer votre préparation aux certifications LPIC depuis le tout début.'
                        : 'Reset all counters, completed objectives, and study statistics to restart your LPIC certification journey from scratch.'}
                    </p>
                  </div>
                </div>

                {/* Scope checklist */}
                <div className="bg-[#fff8f2] rounded-xl border border-[#ebdcc8] p-3 text-xs space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#817660] block">
                    {isFrench ? 'Compteurs & données remis à zéro :' : 'Counters & data that will be reset:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#4f4632]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Objectifs LPIC maîtrisés (0/60)' : 'Mastered LPIC objectives (0/60)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Scores & historique des examens blancs' : 'Mock exam scores & attempt history'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Cartes mémoire & répétition espacée (SRS)' : 'Flashcards & SRS spaced repetition'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Progression des ateliers pratiques (Labs)' : 'Hands-on terminal labs progress'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Série quotidienne (Streak) & stats du jour' : 'Daily streak & study goal counters'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
                      <span>{isFrench ? 'Statut certifications & diagnostic' : 'Certification statuses & diagnostic test'}</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Toast on success */}
                {resetSuccessToast && (
                  <div className="p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-center gap-2 text-xs font-semibold text-[#1b5e20] animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0" />
                    <span>
                      {isFrench
                        ? '✓ Tous les compteurs ont été remis à zéro avec succès ! Vous redémarrez depuis le début.'
                        : '✓ All counters have been reset to zero! You are starting fresh from the beginning.'}
                    </span>
                  </div>
                )}

                {/* Button / Inline Confirmation State */}
                {!showResetConfirm ? (
                  <button
                    id="preferences-reset-progress-btn"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full py-2.5 px-4 bg-[#fff8f2] hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white border border-[#ba1a1a]/40 hover:border-[#ba1a1a] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isFrench ? 'Remettre à zéro tous les compteurs' : 'Reset All Counters to Zero'}</span>
                  </button>
                ) : (
                  <div className="p-3.5 bg-[#ffdad6]/40 border border-[#ba1a1a]/40 rounded-xl space-y-3 animate-fadeIn">
                    <div className="flex items-start gap-2.5 text-xs text-[#93000a]">
                      <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-0.5">
                          {isFrench ? 'Confirmer la remise à zéro complète :' : 'Confirm complete progress reset:'}
                        </strong>
                        <p className="text-[#410002] leading-relaxed">
                          {isFrench
                            ? 'Êtes-vous certain de vouloir remettre tous vos compteurs à zéro ? Vos scores, vos objectifs validés, vos fiches mémorisées et l\'historique d\'examens seront effacés pour redémarrer depuis le début.'
                            : 'Are you sure you want to reset all your progress? All scores, completed objectives, mastered cards, and exam history will be cleared to restart from scratch.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        id="preferences-confirm-reset-btn"
                        onClick={handleExecuteReset}
                        className="flex-1 py-2 px-3 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isFrench ? 'Oui, remettre tout à zéro' : 'Yes, Reset Everything'}</span>
                      </button>
                      <button
                        id="preferences-cancel-reset-btn"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-2 bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#201b11] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isFrench ? 'Annuler' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Storage & Cache Management */}
              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#817660]">
                  Storage & Cache Management
                </h4>
                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 text-[#201b11]">
                    <HardDrive className="w-4 h-4 text-[#785a00]" />
                    <span>Offline PWA Assets</span>
                  </div>
                  <span className="font-mono text-[#817660]">Cached (SW v{CURRENT_APP_VERSION})</span>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-[#ebdcc8]">
                  <div className="flex items-center gap-2 text-[#201b11]">
                    <Layers className="w-4 h-4 text-[#785a00]" />
                    <span>Curriculum Database</span>
                  </div>
                  <span className="font-mono text-[#817660]">1,734 Terms • 10 Topics</span>
                </div>
              </div>

              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#817660]">
                  Keyboard Shortcuts
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-[#fff8f2] rounded-lg border border-[#ebdcc8]">
                    <span className="text-[#4f4632]">Close Modals</span>
                    <kbd className="px-1.5 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded font-mono text-[10px] font-bold">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#fff8f2] rounded-lg border border-[#ebdcc8]">
                    <span className="text-[#4f4632]">Flip Flashcard</span>
                    <kbd className="px-1.5 py-0.5 bg-[#ebdcc8] text-[#785a00] rounded font-mono text-[10px] font-bold">Space</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: LANGUAGE SELECTION                                   */}
          {/* ============================================================ */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="bg-[#ffffff] rounded-2xl border border-[#d3c5ab] p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffc20e] text-[#6d5100] flex items-center justify-center shrink-0 shadow-xs">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#201b11]">
                      {t.settings.languageTitle}
                    </h3>
                    <p className="text-xs text-[#4f4632]">
                      {t.settings.languageDesc}
                    </p>
                  </div>
                </div>

                <LanguageSelector variant="settings" />

                <div className="p-3.5 bg-[#f8ecdb] rounded-xl border border-[#d3c5ab] text-xs text-[#4f4632] space-y-1">
                  <div className="font-bold text-[#785a00] flex items-center gap-1.5">
                    <span>✨</span>
                    <span>{language === 'fr' ? 'Traduction Intégrale' : 'Full Localized Experience'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'fr'
                      ? 'L\'interface, les questions d\'examen blanc LPIC-1/2/3 avec scénarios pratiques et explications détaillées, le glossaire, les cartes mémoire et la navigation sont immédiatement disponibles en Français.'
                      : 'The full user interface, LPIC-1/2/3 practice exam questions with deep explanations, glossary, flashcards, and navigation are instantly available in English.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#d3c5ab] bg-[#f8ecdb] flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#817660] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#785a00]" />
            <span>Official LPI Exam Objectives 2026</span>
          </div>

          <button
            id="settings-done-btn"
            onClick={onClose}
            className="px-5 py-2 bg-[#785a00] hover:bg-[#5f4600] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
