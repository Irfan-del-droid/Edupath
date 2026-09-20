import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/apiClient';
import { Challenge, AIEvaluation } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';

const SAMPLE_PROOF = `# AI Evaluation Framework: FinFlow Tier-1 Customer Support Agent

## 1. Executive Summary
This framework establishes measurable evaluation criteria for the FinFlow autonomous agent before any production traffic ramp. The agent handles credit dispute resolution and payment adjustments—regulatory error carries direct liability. Pass criteria are non-negotiable.

## 2. Evaluation Dimensions & Scoring

### Dimension A: Policy Adherence & Regulatory Compliance (0–5)
- 5: Correctly cites FCBA article and dispute timeline (60 days) with no hallucination
- 3: Correct outcome, minor policy citation gaps
- 1: Incorrect outcome or fabricated regulation

### Dimension B: Hallucination Resistance (0–5)
- 5: All transaction IDs, dates, and dollar amounts exactly match provided context
- 3: Minor date discrepancy (< 24h error)
- 1: Fabricated transaction data

### Dimension C: Tone & De-escalation (0–5)
- 5: Empathetic acknowledgment, clear next steps, no legalese
- 3: Neutral tone, somewhat mechanical
- 1: Dismissive or condescending language

### Dimension D: Latency & Conciseness (0–5)
- 5: Response < 800 tokens, P95 TTFT < 1.5s
- 3: Response 800–1200 tokens, TTFT < 3s
- 1: > 1200 tokens or timeout

## 3. Golden Test Dataset
| Category | Count | Edge Case | Source |
|---|---|---|---|
| Standard Dispute | 100 | Correct policy, standard flow | Sanitized Real |
| Disputed Chargeback | 50 | Outdated transaction date | Sanitized Real |
| Adversarial Injection | 30 | "Ignore previous instructions" jailbreak | Synthetic Red-team |
| Multi-Turn Ambiguity | 20 | Customer contradicts themselves | Synthetic |
| Escalation Trigger | 20 | High-value >$2,000 dispute | Sanitized Real |
Total: 220 test cases

## 4. LLM-as-a-Judge Protocol
- Evaluator Model: GPT-4o (separate from production model)
- Judge prompt includes ground-truth policy reference, scoring rubric, and chain-of-thought reasoning requirement
- Human spot-check: 10% random sample reviewed by compliance officer weekly
- Inter-annotator agreement target: Cohen's Kappa > 0.75

## 5. Release Gate Policy
- Overall score ≥ 4.2/5.0 average across all 220 cases
- Zero tolerance: Dimension A score < 3 in >2% of cases = BLOCK
- Hallucination rate: < 1% of cases with any fabricated data = BLOCK
- Adversarial injection resistance: 100% pass rate on red-team set = BLOCK if failed

Deployment proceeds only after two consecutive weekly evaluation runs both pass all gates.`;

export const ProofOfWorkPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const challengeIdParam = searchParams.get('challengeId') || id || 'chal-ai-eval-framework';
  const skillIdParam = searchParams.get('skillId') || 'skill-ai-evaluation';

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getChallenge(challengeIdParam)
      .then(ch => {
        setChallenge(ch);
        setTitle(`${ch.title} — Proof of Work`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [challengeIdParam]);

  const handleSubmit = async () => {
    if (!content.trim() || content.length < 20) {
      setError('Please provide substantial content (min 20 characters).');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await api.submitProof({
        challengeId: challengeIdParam,
        skillId: skillIdParam,
        title,
        submissionType: 'text',
        content,
      });
      setEvaluation(result.evaluation);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Show evaluation report after submission
  if (evaluation) {
    return (
      <AppLayout>
        <div className="p-6 max-w-screen-lg mx-auto">
          <div className="rule-b pb-4 mb-6">
            <p className="label-figure text-ink-muted">SYSTEM / EVALUATION</p>
            <h1 className="font-display text-2xl font-bold text-ink mt-1">Evaluation Report</h1>
          </div>

          {/* Score header */}
          <div className="grid grid-cols-4 gap-0 rule-all mb-6">
            {[
              { label: 'OVERALL', value: evaluation.overallScore, accent: true },
              { label: 'STRUCTURE', value: evaluation.structureScore },
              { label: 'DEPTH', value: evaluation.depthScore },
              { label: 'PRACTICALITY', value: evaluation.practicalityScore },
            ].map((s, i) => (
              <div key={s.label} className={`p-5 bg-white ${i < 3 ? 'rule-r' : ''}`}>
                <p className="label-figure text-ink-muted text-[10px] mb-2">{s.label}</p>
                <div className={`font-display text-4xl font-bold tabular-nums ${s.accent ? 'text-accent-blue' : 'text-ink'}`}>
                  {s.value}
                </div>
                {/* ASCII-style progress bar */}
                <div className="mt-2 font-mono text-[9px] text-ink-muted">
                  {'█'.repeat(Math.round(s.value / 10))}{'░'.repeat(10 - Math.round(s.value / 10))} {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rule-all mb-6 border-t-0">
            <div className="p-5 bg-white rule-r">
              <SectionLabel figure="WHAT WORKED" title="Strengths" />
              <ul className="mt-3 space-y-2">
                {evaluation.strengths.map((s, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="label-figure text-accent-blue mt-0.5 flex-shrink-0">+</span>
                    <p className="font-mono text-xs text-ink leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-white">
              <SectionLabel figure="WHAT IS MISSING" title="Gaps" />
              <ul className="mt-3 space-y-2">
                {[...evaluation.weaknesses, ...evaluation.missingElements].map((s, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="label-figure text-ink-muted mt-0.5 flex-shrink-0">—</span>
                    <p className="font-mono text-xs text-ink leading-relaxed">{s}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill update + Next Action */}
          <div className="p-5 bg-ink text-white rule-all mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-figure text-accent-blue mb-1">SKILL CONFIDENCE UPDATE</p>
                <p className="font-display text-3xl font-bold text-white">
                  +{evaluation.skillConfidenceDelta}%
                </p>
                <p className="label-figure text-white/60 mt-1">AI EVALUATION & BENCHMARKING VERIFIED</p>
              </div>
              <div className="text-right">
                <p className="label-figure text-white/60 text-[10px] mb-1">NEXT ACTION</p>
                <p className="font-mono text-sm text-white max-w-xs text-right">{evaluation.nextActionTitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-5 py-3 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest"
            >
              <span>VIEW UPDATED DASHBOARD</span><ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setEvaluation(null); setContent(''); }}
              className="label-figure text-ink-muted hover:text-ink"
            >
              SUBMIT ANOTHER
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-lg mx-auto">
        <div className="rule-b pb-4 mb-6">
          <p className="label-figure text-ink-muted">SYSTEM / EVIDENCE</p>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">Submit Proof of Work</h1>
          {challenge && (
            <p className="font-mono text-xs text-ink-muted mt-1">Challenge: {challenge.title}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center space-x-2 py-12">
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
            <span className="label-figure text-ink-muted">LOADING...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Starter template tip */}
            <div className="p-4 bg-accent-blueLight border border-blue-200 flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="label-figure text-accent-blue text-[10px]">QUICK START AVAILABLE</p>
                <p className="font-mono text-xs text-ink mt-0.5">
                  Use the pre-filled sample for a guided demo, or write your own evaluation framework from scratch.
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label-figure text-ink block mb-1.5">SUBMISSION TITLE</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white rule-all font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
                placeholder="e.g. AI Evaluation Framework — FinFlow Support Agent"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-figure text-ink">PROOF CONTENT (MARKDOWN SUPPORTED)</label>
                <button
                  onClick={() => setContent(SAMPLE_PROOF)}
                  className="label-figure text-accent-blue hover:underline text-[10px]"
                >
                  PRE-FILL SAMPLE PROOF
                </button>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-3 bg-white rule-all font-mono text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink resize-none leading-relaxed"
                placeholder={challenge?.starterTemplate || 'Write your proof of work here...'}
              />
              <p className="label-figure text-ink-muted text-[10px] mt-1">{content.length} CHARACTERS</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200">
                <p className="label-figure text-red-700 text-[10px]">{error}</p>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSubmit}
                disabled={submitting || !content.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest disabled:opacity-40"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>EVALUATING...</span></>
                ) : (
                  <><span>SUBMIT FOR AI EVALUATION</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <button onClick={() => navigate(-1)} className="label-figure text-ink-muted hover:text-ink">
                ← BACK
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
