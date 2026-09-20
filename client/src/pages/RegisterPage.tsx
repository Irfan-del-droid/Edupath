import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-5 h-5 bg-ink flex items-center justify-center">
            <div className="w-2 h-2 bg-accent-blue" />
          </div>
          <span className="font-display font-bold text-ink">EDUPATH</span>
        </div>

        <p className="label-figure text-ink-muted mb-2">NEW ACCOUNT</p>
        <h1 className="font-display text-2xl font-bold text-ink mb-8">Create your profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-figure text-ink block mb-1.5">FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-white rule-all rounded-none font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label-figure text-ink block mb-1.5">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-white rule-all rounded-none font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
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
              minLength={6}
              className="w-full px-3 py-2.5 bg-white rule-all rounded-none font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
              placeholder="Min 6 characters"
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
              <><span>CREATE ACCOUNT</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="mt-6 label-figure text-ink-muted text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-ink underline hover:text-accent-blue">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
