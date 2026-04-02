import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Mock user for testing
const MOCK_USER = {
  uid: 'mock-user-123',
  email: 'test@shop.com',
  displayName: 'Test Cassiere',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
} as any;

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        // Mock mode: simula login senza Firebase
        // Accetta qualsiasi email/password non vuota
        if (!email || !password) {
          throw new Error('Email e password sono obbligatori');
        }
        // Simula latenza di rete
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Salva il mock user in sessionStorage per la riconoscenza
        sessionStorage.setItem('mock_user', JSON.stringify({
          ...MOCK_USER,
          email,
        }));
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di login');
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    if (USE_MOCK) {
      sessionStorage.removeItem('mock_user');
    } else {
      await firebaseSignOut(auth);
    }
  }

  return { signIn, signOut, loading, error };
}
