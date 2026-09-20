import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { ProofOfWork } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { ProgressBar } from '../components/editorial/ProgressBar';
import { Loader2, ArrowRight, FileText, Plus } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const [proofs, setProofs] = useState<ProofOfWork[]>([]);
  const [selected, setSelected] = useState<ProofOfWork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProofs()
      .then(data => {
        const evaluated = data.filter(p => p.status === 'evaluated' && p.evaluation);
        setProofs(data);
        if (evaluated.length > 0) setSelected(evaluated[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="rule-b pb-4 mb-6 flex items-end justify-between">
          <div>
            <p className="label-figure text-ink-muted">SYSTEM / EVIDENCE</p>
            <h1 className="font-display text-2xl font-bold text-ink mt-1">Proof & Evaluations</h1>
          </div>
          <button
            onClick={() => navigate('/proof/submit/chal-ai-eval-framework?skillId=skill-ai-evaluation')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest"
          >
            <Plus className="w-3.5 h-3.5" /><span>NEW SUBMISSION</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center space-x-2 py-12">
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
            <span className="label-figure text-ink-muted">LOADING EVIDENCE...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rule-all">
            {/* Proof list */}
            <div className="lg:col-span-1 rule-r">
              <div className="px-5 py-3 rule-b bg-paper-subtle">
                <span className="label-figure text-ink-muted">{proofs.length} SUBMISSIONS</span>
              </div>
              {proofs.length === 0 ? (
                <div className="p-6 text-center">
                  <FileText className="w-6 h-6 text-ink-muted mx-auto mb-3" />
                  <p className="label-figure text-ink-muted">NO SUBMISSIONS YET</p>
                  <button
                    onClick={() => navigate('/challenges')}
                    className="mt-3 label-figure text-accent-blue hover:underline flex items-center space-x-1 mx-auto"
                  >
                    <span>START A CHALLENGE</span><ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div>
                  {proofs.map((proof, idx) => (
                    <div
                      key={proof.id}
                      onClick={() => setSelected(proof)}
                      className={`p-4 cursor-pointer transition-colors rule-b ${selected?.id === proof.id ? 'bg-ink' : 'bg-white hover:bg-paper-subtle'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`font-mono text-xs font-semibold truncate ${selected?.id === proof.id ? 'text-white' : 'text-ink'}`}>
                            {proof.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <StatusChip
                              label={proof.status.toUpperCase()}
                              priority={proof.status}
                            />
                            {proof.evaluation && (
                              <span className={`label-figure tabular-nums ${selected?.id === proof.id ? 'text-accent-blue' : 'text-accent-blue'}`}>
                                {proof.evaluation.overallScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className={`label-figure text-[10px] mt-1 ${selected?.id === proof.id ? 'text-white/50' : 'text-ink-muted'}`}>
                        {new Date(proof.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Evaluation detail */}
            <div className="lg:col-span-2 p-6 bg-white">
              {!selected ? (
                <div className="flex flex-col items-center justify-center h-48">
                  <p className="label-figure text-ink-muted">SELECT A SUBMISSION TO VIEW EVALUATION</p>
                </div>
              ) : !selected.evaluation ? (
                <div>
                  <SectionLabel figure="FIG. 07" title={`Evidence / ${selected.title}`} />
                  <StatusChip label="PENDING EVALUATION" priority="in_progress" className="mt-3" />
                  <p className="font-mono text-xs text-ink-muted mt-4 leading-relaxed">{selected.content.slice(0, 400)}...</p>
                </div>
              ) : (
                <div>
                  <SectionLabel
                    figure={`EVALUATION / ${String(selected.evaluation.overallScore).padStart(3, '0')}`}
                    title={selected.title}
                    status={new Date(selected.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  />

                  {/* Score grid */}
                  <div className="grid grid-cols-4 gap-0 rule-all mt-4">
                    {[
                      { label: 'OVERALL', value: selected.evaluation.overallScore, accent: true },
                      { label: 'STRUCTURE', value: selected.evaluation.structureScore },
                      { label: 'DEPTH', value: selected.evaluation.depthScore },
                      { label: 'PRACTICALITY', value: selected.evaluation.practicalityScore },
                    ].map((s, i) => (
                      <div key={s.label} className={`p-4 ${i < 3 ? 'rule-r' : ''}`}>
                        <p className="label-figure text-ink-muted text-[10px]">{s.label}</p>
                        <p className={`font-display text-3xl font-bold tabular-nums mt-1 ${s.accent ? 'text-accent-blue' : 'text-ink'}`}>
                          {s.value}
                        </p>
                        <ProgressBar value={s.value} color={s.accent ? 'blue' : 'ink'} className="mt-2" />
                      </div>
                    ))}
                  </div>

                  {/* Strengths */}
                  <div className="mt-4">
                    <p className="label-figure text-ink rule-b pb-2 mb-3">WHAT WORKED</p>
                    <ul className="space-y-2">
                      {selected.evaluation.strengths.map((s, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="label-figure text-accent-blue mt-0.5">+</span>
                          <p className="font-mono text-xs text-ink leading-relaxed">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="mt-4">
                    <p className="label-figure text-ink rule-b pb-2 mb-3">WHAT IS MISSING</p>
                    <ul className="space-y-2">
                      {selected.evaluation.missingElements.map((s, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="label-figure text-ink-muted mt-0.5">—</span>
                          <p className="font-mono text-xs text-ink leading-relaxed">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next action */}
                  <div className="mt-4 p-4 bg-ink text-white">
                    <p className="label-figure text-accent-blue text-[10px] mb-1">NEXT ACTION</p>
                    <p className="font-mono text-sm text-white">{selected.evaluation.nextActionTitle}</p>
                    <p className="font-mono text-xs text-white/60 mt-1">{selected.evaluation.nextActionReason}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="label-figure text-accent-blue">+{selected.evaluation.skillConfidenceDelta}%</span>
                      <span className="label-figure text-white/40">CONFIDENCE DELTA</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
