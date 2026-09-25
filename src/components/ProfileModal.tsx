import React from 'react';
import { X, User, Flame, Award, ShieldCheck, RotateCcw } from 'lucide-react';
import { UserStats } from '../types';
import { useAuth } from '../firebase/AuthContext';
import { FirebaseAuthProfileSection } from './FirebaseAuthProfileSection';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onResetStats: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onResetStats,
}) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#fff8f2] border border-[#d3c5ab] rounded-2xl max-w-md w-full p-6 shadow-xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Learner'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-[#ffc20e] object-cover shadow-xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#ffc20e] flex items-center justify-center text-[#6d5100] font-bold text-lg shadow-xs shrink-0">
                <User className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-[#201b11] truncate">
                {user ? user.displayName || user.email?.split('@')[0] : userStats.name}
              </h3>
              <p className="text-xs text-[#4f4632] truncate">
                {user ? user.email : userStats.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#817660] hover:bg-[#f2e7d6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Sync & Firebase Google Auth Section */}
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
              <span className="text-[10px] uppercase font-bold text-[#817660] block">Target</span>
              <span className="text-base font-bold text-[#201b11]">{userStats.currentTarget}</span>
            </div>
          </div>
        </div>

        {/* Badges / Accomplishments */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#817660] uppercase tracking-wider block">
            Certifications
          </span>
          {localStorage.getItem('lpi_essentials_status') === 'passed' ? (
            <div className="flex items-center justify-between p-3 bg-[#ffffff] rounded-xl border border-[#d3c5ab]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#28A745]" />
                <div>
                  <div className="text-xs font-bold text-[#201b11]">Linux Essentials</div>
                  <div className="text-[10px] text-[#4f4632]">Certificate 010-160 Verified</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#28A745] bg-[#28A745]/15 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          ) : (
            <div className="p-3 bg-[#ffffff] rounded-xl border border-[#d3c5ab] text-center text-xs text-[#817660]">
              Aucune certification validée pour le moment.
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#d3c5ab]">
          <button
            onClick={() => {
              if (confirm('Réinitialiser toute la progression à zéro ?')) {
                onResetStats();
              }
            }}
            className="w-full py-2.5 border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser la progression
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#ffc20e] hover:bg-[#f9bd00] text-[#6d5100] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
