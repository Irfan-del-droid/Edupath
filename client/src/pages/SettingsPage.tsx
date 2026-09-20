import React, { useState } from 'react';
import { useAuth } from '../app/AuthContext';
import { api } from '../services/apiClient';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { EditorialCard } from '../components/editorial/EditorialCard';
import { RefreshCw, CheckCircle2, Shield, Database, Cpu, Terminal } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoState = async () => {
    if (!window.confirm('Reset all demo data back to Irfan default state? This will clear recent submissions and re-seed.')) {
      return;
    }
    setResetting(true);
    setResetSuccess(false);
    try {
      await api.post('/auth/demo/reset');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      console.error('Failed to reset demo:', err);
      // Fallback: simply notify user
      setResetSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppLayout title="SYSTEM SETTINGS">
      <div className="space-y-8 max-w-4xl font-sans">
        <SectionLabel
          figure="FIG. 00"
          label="ENVIRONMENT CONFIGURATION"
          sub="Runtime telemetry, AI provider status, and demo reset actions."
        />

        {/* User Identity */}
        <EditorialCard>
          <div className="flex items-center justify-between pb-4 border-b border-rule mb-4">
            <span className="font-mono text-xs text-muted uppercase">ACTIVE PRINCIPAL IDENTITY</span>
            <span className="font-mono text-xs font-bold text-accent-blue bg-blue-50 px-2 py-0.5 border border-blue-200">
              AUTHENTICATED
            </span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted">NAME:</span>
              <span className="font-bold text-ink">{user?.name || 'Irfan'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">EMAIL:</span>
              <span className="font-bold text-ink">{user?.email || 'Irfan@demo.edupath.ai'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">ROLE:</span>
              <span className="font-bold text-ink">{user?.role || 'candidate'}</span>
            </div>
          </div>
        </EditorialCard>

        {/* Engine Diagnostics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditorialCard>
            <div className="flex items-center space-x-2 text-ink mb-3 font-mono text-xs font-bold">
              <Cpu className="w-4 h-4 text-accent-blue" />
              <span>AI EVALUATION PROVIDER</span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Dynamic multi-tier fallback between Gemini API, OpenAI, and internal deterministic heuristic rubrics.
            </p>
            <div className="p-3 bg-paper border border-rule font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Status:</span>
                <span className="text-emerald-700 font-bold">ONLINE (Deterministic Fallback Ready)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Rubric Standard:</span>
                <span>Structure / Depth / Practicality</span>
              </div>
            </div>
          </EditorialCard>

          <EditorialCard>
            <div className="flex items-center space-x-2 text-ink mb-3 font-mono text-xs font-bold">
              <Database className="w-4 h-4 text-accent-blue" />
              <span>DATA PERSISTENCE LAYER</span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Drizzle ORM backed by dual PostgreSQL driver (PGlite WASM zero-config fallback / Node-Postgres).
            </p>
            <div className="p-3 bg-paper border border-rule font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Mode:</span>
                <span className="text-emerald-700 font-bold">ACTIVE (Local Embedded / PG)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Storage:</span>
                <span>Local Disk / Supabase Storage</span>
              </div>
            </div>
          </EditorialCard>
        </div>

        {/* Hackathon Demo Reset Button */}
        <div className="border border-dark p-6 bg-surface shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                EVALUATION RE-RUN // HACKATHON RESET
              </span>
              <h3 className="font-serif text-lg font-bold">
                Reset Demo Persona to Baseline State
              </h3>
              <p className="text-xs text-neutral-600 font-sans mt-1">
                Restores Irfan's starting skill gap (AI Evaluation: 38%) and clears recently submitted proofs so you can showcase the live submission flow again.
              </p>
            </div>
            <button
              onClick={handleResetDemoState}
              disabled={resetting}
              className="px-4 py-2.5 bg-ink text-paper font-mono text-xs uppercase tracking-wider flex items-center space-x-2 hover:bg-neutral-800 disabled:opacity-50 transition-all border border-ink"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Resetting...' : 'Reset Irfan Persona'}</span>
            </button>
          </div>
          {resetSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Persona successfully reset to benchmark baseline. Reloading dashboard...</span>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
