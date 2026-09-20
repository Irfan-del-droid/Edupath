import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { EditorialCard } from '../components/editorial/EditorialCard';
import { StatusChip } from '../components/editorial/StatusChip';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Compass,
  CheckCircle2,
  Terminal,
  Activity,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async () => {
    try {
      await login('Irfan@demo.edupath.ai', 'demo1234');
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      {/* Top Bar / Header */}
      <header className="border-b border-rule bg-surface/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-ink text-paper border border-ink tracking-widest uppercase">
              AGENT // 01
            </span>
            <span className="font-serif text-xl font-bold tracking-tight">
              EduPath
            </span>
            <span className="hidden sm:inline text-xs font-mono text-muted border-l border-rule pl-3">
              SKILL VERIFICATION & CAREER AGENT
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <button
              onClick={handleQuickDemo}
              className="px-4 py-2 bg-ink hover:bg-neutral-800 text-paper text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-all border border-ink shadow-[2px_2px_0px_0px_#0D52FF]"
            >
              <span>Instant Demo (Irfan)</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent-blue" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-rule py-20 px-6 bg-gradient-to-b from-paper to-surface/50">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-rule bg-surface font-mono text-[11px] uppercase tracking-wider text-muted mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
            AUTONOMOUS SKILL EVALUATION ENGINE // V2.4
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Turn career aspirations into{' '}
            <span className="underline decoration-accent-blue decoration-4 underline-offset-8">
              verified proof of ability
            </span>
            .
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl leading-relaxed mb-10 font-normal">
            Traditional learning tracks measure course completion. EduPath functions as an autonomous career intelligence agent: continuously analyzing verified skill gaps, prescribing your single next best action, and evaluating practical real-world deliverables with rigor.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleQuickDemo}
              className="px-6 py-3.5 bg-accent-blue hover:bg-accent-blue-hover text-white font-mono text-xs uppercase tracking-wider flex items-center space-x-3 transition-all shadow-[3px_3px_0px_0px_#111111]"
            >
              <span>Explore Live Demo as Irfan (AI PM)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/register"
              className="px-6 py-3.5 bg-surface border border-rule hover:border-ink font-mono text-xs uppercase tracking-wider text-ink flex items-center space-x-2 transition-all"
            >
              <span>Initialize Custom Path</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-rule font-mono text-xs">
            <div>
              <span className="text-muted block text-[10px] uppercase">Target Persona</span>
              <span className="font-bold text-sm text-ink">AI Product Manager</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Evaluation Metric</span>
              <span className="font-bold text-sm text-ink">Rubric-Driven (3x Dimension)</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Loop Cycle</span>
              <span className="font-bold text-sm text-accent-blue">Observe → Reason → Act</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Proof Engine</span>
              <span className="font-bold text-sm text-ink">Automated AI Feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Concept: The 4-Phase Closed Loop */}
      <section className="border-b border-rule py-16 px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <SectionLabel
            figure="FIG. 00"
            label="AGENT CONTROL ARCHITECTURE"
            sub="Continuous closed-loop career navigation"
            className="mb-10"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="border border-rule p-6 bg-paper relative">
              <div className="font-mono text-xs text-accent-blue font-bold mb-2">01 / OBSERVE</div>
              <h3 className="font-serif text-lg font-bold mb-2">Multi-Source Intake</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Parses historical experience, verified project deliverables, and explicit target role benchmarks to establish a current baseline capability vector.
              </p>
            </div>

            <div className="border border-rule p-6 bg-paper relative">
              <div className="font-mono text-xs text-accent-blue font-bold mb-2">02 / REASON</div>
              <h3 className="font-serif text-lg font-bold mb-2">DAG Gap Synthesis</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Traverses prerequisite skill dependencies to detect blocked proficiencies, weighting critical deficits against high-impact target job standards.
              </p>
            </div>

            <div className="border border-rule p-6 bg-paper relative">
              <div className="font-mono text-xs text-accent-blue font-bold mb-2">03 / ACT</div>
              <h3 className="font-serif text-lg font-bold mb-2">Next Best Action</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Prescribes a high-signal, practical challenge rather than passive video tutorials. Generates realistic context, rubrics, and deliverable templates.
              </p>
            </div>

            <div className="border border-rule p-6 bg-paper relative">
              <div className="font-mono text-xs text-accent-blue font-bold mb-2">04 / VERIFY & REPLAN</div>
              <h3 className="font-serif text-lg font-bold mb-2">Rubric Evaluation</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                Scores student proof across Structure, Depth, and Practicality. Dynamically recalculates confidence scores and mutates the 30-day roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Preview / State Snapshot */}
      <section className="border-b border-rule py-16 px-6 bg-paper">
        <div className="max-w-7xl mx-auto">
          <SectionLabel
            figure="FIG. 01"
            label="LIVE DEMONSTRATION ARTIFACT"
            sub="Active student profile state: Irfan (Aspiring AI PM)"
            className="mb-8"
          />

          <div className="border border-dark bg-surface shadow-[4px_4px_0px_0px_#111111] p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-6 border-b border-rule gap-4">
              <div>
                <span className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-1">
                  CANDIDATE DOSSIER // REF: APM-2026
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  Irfan — Senior Product Specialist → AI Product Manager
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <StatusChip label="GAP REASONING ACTIVE" priority="Critical" />
                <button
                  onClick={handleQuickDemo}
                  className="px-3.5 py-1.5 bg-ink text-paper font-mono text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-neutral-800"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Gap Analysis Preview */}
              <div className="border border-rule p-5 bg-paper">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
                  CRITICAL DEFICIT IDENTIFIED
                </div>
                <h4 className="font-serif font-bold text-lg text-ink mb-1">AI Evaluation Frameworks</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 border border-amber-300">
                    Current: 38% / Target: 85%
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Prerequisites (Product Discovery 86%, LLM Fundamentals 54%) verified. Irfan is now primed to tackle model benchmarking without conceptual blockage.
                </p>
              </div>

              {/* Next Action Preview */}
              <div className="border border-dark p-5 bg-surface relative">
                <div className="font-mono text-[11px] text-accent-blue uppercase tracking-wider font-bold mb-2">
                  RECOMMENDED INTERVENTION
                </div>
                <h4 className="font-serif font-bold text-lg text-ink mb-1">Customer-Support Eval Harness</h4>
                <div className="text-xs text-muted mb-3 font-mono">
                  CHALLENGE #04 // EST. 45 MIN
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Formulate accuracy, hallucination, and safety evaluation rubrics for a Tier-1 customer query deflection agent.
                </p>
              </div>

              {/* Evaluation Outcome Preview */}
              <div className="border border-rule p-5 bg-paper">
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
                  LAST VERIFIED SUBMISSION
                </div>
                <h4 className="font-serif font-bold text-lg text-ink mb-1">PRD: Multi-Modal RAG Search</h4>
                <div className="flex items-center gap-2 mb-3 font-mono text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Score: 86 / 100</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  Strong system requirements and edge-case scoping. Practicality rubric cleared with distinction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rule py-12 px-6 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-serif font-bold text-lg">EduPath</span>
              <span className="font-mono text-xs text-muted">/ Autonomous Career Agent</span>
            </div>
            <p className="text-xs text-neutral-500 font-mono">
              Designed according to Editorial Tech Brutalism & Swiss Modernism principles.
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono text-xs text-muted">
            <Link to="/login" className="hover:text-ink">Sign In</Link>
            <Link to="/register" className="hover:text-ink">New Account</Link>
            <button onClick={handleQuickDemo} className="text-accent-blue hover:underline">
              Demo Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
