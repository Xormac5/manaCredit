import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app',
};

// In mock mode, create dummy objects to avoid Firebase initialization errors
let app: any;
let auth: any;
let db: any;

if (USE_MOCK) {
  console.log('🎭 Mock Mode Enabled - Firebase will not be initialized');
  // Create dummy objects that won't be used
  app = { name: 'mock' };
  auth = { currentUser: null };
  db = {};
} else {
  console.log('🔥 Firebase Mode Enabled');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
