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
    <div className="min-h-screen flex items-center justify-center bg-mana-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-mana-card rounded-3xl p-8 shadow-2xl border border-slate-700 flex flex-col gap-5"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-mana-primary mb-2">ManaCredit</h1>
          <p className="text-sm text-slate-400">Staff Access</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-mana-orange/20 border border-mana-orange rounded-xl p-3">
            <p className="text-sm text-mana-orange font-medium">{error}</p>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase mb-2 block">Email</label>
          <input
            type="email"
            placeholder="staff@shop.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase mb-2 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Submit */}
        <BigButton type="submit" disabled={loading}>
          {loading ? 'Accesso…' : 'Accedi'}
        </BigButton>

        {/* Footer */}
        <p className="text-xs text-center text-slate-500">
          ManaCredit v1.0 • Powered by Firebase
        </p>
      </form>
    </div>
  );
}
