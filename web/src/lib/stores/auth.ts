import { create } from 'zustand';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { startAuthTelemetry } from './telemetry';

interface AuthState {
  user: User | null;
  loading: boolean;
  ready: boolean;
  init: () => () => void;
  setUser: (u: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  ready: false,
  setUser: (u) => set({ user: u, loading: false }),
  init: () => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      set({ user: u, loading: false, ready: true });
      if (u) startAuthTelemetry(u);
    });
    return unsub;
  },
}));
