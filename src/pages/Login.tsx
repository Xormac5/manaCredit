import { useState, type FormEvent } from 'react';
import { useAuthActions } from '../hooks/useAuth';
import BigButton from '../components/ui/BigButton';

export default function Login() {
  const { signIn, loading, error } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    signIn(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">
          TCG Wallet
        </h1>
        <p className="text-sm text-center text-slate-500">Accedi al tuo negozio</p>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg p-2 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <BigButton type="submit" disabled={loading}>
          {loading ? 'Accesso…' : 'Accedi'}
        </BigButton>
      </form>
    </div>
  );
}
