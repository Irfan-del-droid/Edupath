import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('irfan@edupath.ai');
    setPassword('password123');
    setError('');
    setLoading(true);
    try {
      await login('irfan@edupath.ai', 'password123');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Left panel — editorial identity */}
      <div className="hidden lg:flex w-1/2 flex-col bg-ink p-12 text-white">
        <div className="flex items-center space-x-2 mb-16">
          <div className="w-5 h-5 bg-accent-blue flex items-center justify-center">
            <div className="w-2 h-2 bg-white" />
          </div>
          <span className="font-display font-bold tracking-tight text-base">EDUPATH</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p className="label-figure text-accent-blue mb-4">SYSTEM / AUTH</p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-6 text-white">
            AI Career<br />Navigation<br />System
          </h1>
          <p className="text-white/60 font-mono text-sm leading-relaxed mb-12">
            Turn career goals into verified proof of ability.<br />
            Not another learning platform.
          </p>

          {/* Core loop preview */}
          <div className="space-y-2">
            {['CAREER GOAL', 'SKILL GAP', 'NEXT BEST ACTION', 'PROOF OF WORK', 'AI EVALUATION', 'VERIFIED SKILL'].map((step, i) => (
              <div key={step} className="flex items-center space-x-3">
                <span className="label-figure text-accent-blue w-4">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-px h-3 bg-white/20 mx-1" />
                <span className="label-figure text-white/70 text-[10px]">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="label-figure text-white/30 text-[10px]">EDUPATH v1.0 — AI SYSTEMS EDITION</p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="label-figure text-ink-muted mb-2">SYSTEM ACCESS</p>
            <h2 className="font-display text-2xl font-bold text-ink">Sign in to EduPath</h2>
          </div>

          {/* Demo quick-login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 bg-accent-blueLight rule-all border-accent-blue hover:bg-blue-100 transition-colors mb-6 group"
          >
            <div>
              <p className="label-figure text-accent-blue">DEMO ACCOUNT</p>
              <p className="font-mono text-xs text-ink mt-0.5">Irfan — AI Product Manager Candidate</p>
            </div>
            <ArrowRight className="w-4 h-4 text-accent-blue group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-rule" />
            <span className="label-figure text-ink-muted text-[10px]">OR SIGN IN</span>
            <div className="flex-1 h-px bg-rule" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-figure text-ink block mb-1.5">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white rule-all rounded-none font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label-figure text-ink block mb-1.5">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white rule-all rounded-none font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200">
                <p className="label-figure text-red-700 text-[10px]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <span>ACCESS SYSTEM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 label-figure text-ink-muted text-center">
            No account?{' '}
            <Link to="/register" className="text-ink underline hover:text-accent-blue transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
