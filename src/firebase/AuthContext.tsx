import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import {
  syncUserProfileToCloud,
  syncLocalProgressToCloud,
  loadCloudProgress,
} from './firestoreService';
import { UserStats } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  triggerSync: (stats?: Partial<UserStats>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          // On sign-in: attempt to restore cloud progress or initialize cloud record
          const { userStats, restored } = await loadCloudProgress(currentUser.uid);
          if (!restored) {
            // New user or no cloud record yet: upload initial local state
            await syncUserProfileToCloud(currentUser);
            await syncLocalProgressToCloud(currentUser.uid);
          } else if (userStats) {
            // Notify local state of updated stats
            window.dispatchEvent(
              new CustomEvent('lpi_user_stats_updated', { detail: userStats })
            );
          }
          setLastSyncedAt(new Date());
        } catch (err: any) {
          console.warn('Initial cloud sync notice:', err.message);
          setSyncError(err.message);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setSyncError(err.message || 'Authentication failed');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setLastSyncedAt(null);
    } catch (err: any) {
      console.error('Sign-out error:', err);
      throw err;
    }
  };

  const triggerSync = async (stats?: Partial<UserStats>) => {
    if (!auth.currentUser) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      await syncUserProfileToCloud(auth.currentUser, stats);
      await syncLocalProgressToCloud(auth.currentUser.uid);
      setLastSyncedAt(new Date());
    } catch (err: any) {
      console.warn('Cloud sync error:', err.message);
      setSyncError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSyncing,
        lastSyncedAt,
        syncError,
        signInWithGoogle,
        signOut,
        triggerSync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
