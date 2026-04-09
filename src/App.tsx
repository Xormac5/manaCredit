import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import CustomerCard from './pages/CustomerCard';
import CashHistory from './pages/CashHistory';
import QrViewerPage from './pages/QrViewerPage';
import NewCustomer from './pages/NewCustomer';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mana-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-mana-card border-t-mana-primary animate-spin" />
          <p className="text-slate-400 text-sm">Caricamento…</p>
        </div>
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/qr/:customerId" element={<QrViewerPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/scan"
            element={
              <RequireAuth>
                <ScanPage />
              </RequireAuth>
            }
          />
          <Route
            path="/customer"
            element={
              <RequireAuth>
                <CustomerCard />
              </RequireAuth>
            }
          />
          <Route
            path="/new-customer"
            element={
              <RequireAuth>
                <NewCustomer />
              </RequireAuth>
            }
          />
          <Route
            path="/history"
            element={
              <RequireAuth>
                <CashHistory />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
