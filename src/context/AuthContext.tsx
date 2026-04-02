import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

interface AuthState {
  user: User | null;
  shopId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  shopId: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    shopId: null,
    loading: true,
  });

  useEffect(() => {
    if (USE_MOCK) {
      // Mock mode: controlla sessionStorage al mount
      const mockUserStr = sessionStorage.getItem('mock_user');
      if (mockUserStr) {
        try {
          const mockUser = JSON.parse(mockUserStr);
          setState({
            user: mockUser,
            shopId: 'SHOP_001',
            loading: false,
          });
        } catch {
          setState({ user: null, shopId: null, loading: false });
        }
      } else {
        setState({ user: null, shopId: null, loading: false });
      }

      // Listener per custom events di login/logout
      const handleMockLogin = (event: Event) => {
        const customEvent = event as CustomEvent;
        setState({
          user: customEvent.detail,
          shopId: 'SHOP_001',
          loading: false,
        });
      };

      const handleMockLogout = () => {
        setState({ user: null, shopId: null, loading: false });
      };

      window.addEventListener('mock-login', handleMockLogin);
      window.addEventListener('mock-logout', handleMockLogout);

      return () => {
        window.removeEventListener('mock-login', handleMockLogin);
        window.removeEventListener('mock-logout', handleMockLogout);
      };
    } else {
      // Firebase mode
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdTokenResult();
          const shopId = (token.claims.shop_id as string) ?? null;
          setState({ user, shopId, loading: false });
        } else {
          setState({ user: null, shopId: null, loading: false });
        }
      });
      return unsubscribe;
    }
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
