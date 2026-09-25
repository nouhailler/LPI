import React, { useState } from 'react';
import {
  Cloud,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UserStats } from '../types';

interface FirebaseAuthProfileSectionProps {
  userStats?: UserStats;
  onSuccess?: () => void;
  className?: string;
}

export const FirebaseAuthProfileSection: React.FC<FirebaseAuthProfileSectionProps> = ({
  userStats,
  onSuccess,
  className = '',
}) => {
  const { user, signInWithGoogle, signOut, isSyncing, lastSyncedAt, triggerSync, syncError } = useAuth();
  const { isFrench } = useLanguage();
  const [authLoading, setAuthLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLocalError(null);
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      const code = err.code || '';
      if (code === 'auth/popup-blocked') {
        setLocalError(
          isFrench
            ? 'La fenêtre pop-up a été bloquée par votre navigateur ou l\'iframe. Veuillez autoriser les pop-ups pour ce site, ou utilisez le bouton "Ouvrir dans un nouvel onglet" ci-dessous.'
            : 'The sign-in popup was blocked by your browser or iframe. Please allow popups for this site, or use the "Open in new tab" button below.'
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setLocalError(
          isFrench
            ? 'La fenêtre de connexion a été fermée avant la sélection du compte.'
            : 'Sign-in popup was closed before authentication completed.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setLocalError(
          isFrench
            ? `Ce domaine (${window.location.hostname}) doit être ajouté aux 'Domaines autorisés' dans la console Firebase (Authentication > Settings > Authorized domains).`
            : `This domain (${window.location.hostname}) must be added to Authorized domains in Firebase Console (Authentication > Settings > Authorized domains).`
        );
      } else if (code === 'auth/operation-not-allowed') {
        setLocalError(
          isFrench
            ? 'Le fournisseur Google Sign-in doit être activé dans la console Firebase (Authentication > Sign-in method > Google).'
            : 'Google provider must be enabled in Firebase Console (Authentication > Sign-in method > Google).'
        );
      } else {
        setLocalError(err.message || (isFrench ? 'Échec de la connexion' : 'Authentication failed'));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleManualSync = async () => {
    try {
      await triggerSync(userStats);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  const handleOpenInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  };

  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  return (
    <div className={`bg-[#ffffff] p-4 rounded-xl border border-[#d3c5ab] flex flex-col gap-3.5 shadow-2xs ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-[#785a00]">
          <Cloud className="w-4 h-4 text-[#ffc20e]" />
          <span>{isFrench ? 'Synchronisation Cloud Firestore' : 'Firestore Cloud Sync'}</span>
        </div>
        {user ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#28A745] bg-[#28A745]/10 border border-[#28A745]/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            {isFrench ? 'Connecté Google' : 'Google Connected'}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-[#817660] bg-[#f8ecdb] px-2 py-0.5 rounded-full">
            {isFrench ? 'Mode Local (Non connecté)' : 'Local Mode (Offline)'}
          </span>
        )}
      </div>

      {user ? (
        /* Connected User State */
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2.5 bg-[#fff8f2] rounded-xl border border-[#ebdcc8]">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Learner'}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-[#ffc20e] object-cover shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#ffc20e] text-[#6d5100] font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
                {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-[#201b11] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </div>
              <div className="text-[11px] text-[#4f4632] truncate font-mono">
                {user.email}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#4f4632] flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28A745]" />
              {lastSyncedAt
                ? `${isFrench ? 'Dernière synchro :' : 'Last synced:'} ${lastSyncedAt.toLocaleTimeString()}`
                : isFrench ? 'Synchronisation active' : 'Sync active'}
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#f8ecdb] hover:bg-[#ebdcc8] text-[#785a00] font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isFrench ? 'Synchroniser' : 'Sync Now'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#f2e7d6] flex justify-end">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3c5ab] hover:bg-[#ffdad6] hover:text-[#ba1a1a] hover:border-[#ba1a1a]/30 text-xs font-semibold text-[#4f4632] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Se déconnecter' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Disconnected State with Sign In */
        <div className="flex flex-col gap-2.5">
          <p className="text-xs text-[#4f4632] leading-relaxed">
            {isFrench
              ? 'Connectez-vous avec votre compte Google pour sauvegarder vos fiches SRS, vos résultats d\'examen et vos exercices pratiques dans Cloud Firestore.'
              : 'Sign in with your Google account to automatically persist your SRS review deck, exam scores, and lab milestones to Cloud Firestore.'}
          </p>

          <button
            onClick={handleSignIn}
            disabled={authLoading}
            id="google-signin-btn"
            className="w-full py-2.5 px-4 bg-[#ffffff] hover:bg-[#f8ecdb] border-2 border-[#d3c5ab] hover:border-[#ffc20e] rounded-xl text-xs font-bold text-[#201b11] transition-all flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {authLoading
                ? isFrench ? 'Connexion en cours...' : 'Connecting...'
                : isFrench ? 'Connexion avec Google' : 'Sign in with Google'}
            </span>
          </button>

          {isInsideIframe && (
            <div className="pt-1 flex items-center justify-between text-[11px] text-[#817660]">
              <span>{isFrench ? 'Problème de pop-up dans l\'aperçu ?' : 'Popup issue in preview frame?'}</span>
              <button
                type="button"
                onClick={handleOpenInNewTab}
                className="inline-flex items-center gap-1 font-semibold text-[#785a00] hover:underline cursor-pointer"
              >
                <span>{isFrench ? 'Ouvrir dans un onglet dédié' : 'Open in dedicated tab'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {(localError || syncError) && (
        <div className="p-3 bg-[#ffdad6] rounded-xl text-[#ba1a1a] text-xs flex flex-col gap-1.5 border border-[#ba1a1a]/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold leading-tight">{localError || syncError}</span>
          </div>
          {isInsideIframe && !user && (
            <div className="pl-6 pt-1">
              <button
                onClick={handleOpenInNewTab}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ba1a1a] underline cursor-pointer"
              >
                <span>{isFrench ? 'Ouvrir l\'application dans un nouvel onglet pour autoriser la connexion' : 'Open in new tab to allow authentication'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
