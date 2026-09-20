import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { SkillGap } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { ProgressBar } from '../components/editorial/ProgressBar';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkillGaps()
      .then(data => setGaps(data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])))
      .finally(() => setLoading(false));
  }, []);

  const grouped = gaps.reduce((acc, gap) => {
    if (!acc[gap.priority]) acc[gap.priority] = [];
    acc[gap.priority].push(gap);
    return acc;
  }, {} as Record<string, SkillGap[]>);

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-lg mx-auto">
        <div className="rule-b pb-4 mb-6">
          <p className="label-figure text-ink-muted">SYSTEM / ANALYSIS</p>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">Skill Gap Analysis</h1>
          <p className="font-mono text-xs text-ink-muted mt-1">Verified capability delta against AI Product Manager target profile.</p>
        </div>

        {loading ? (
          <div className="flex items-center space-x-2 py-12">
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
            <span className="label-figure text-ink-muted">COMPUTING GAPS...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {(['Critical', 'High', 'Medium', 'Low'] as const).map(priority => {
              const items = grouped[priority] || [];
              if (!items.length) return null;
              return (
                <div key={priority}>
                  <div className="flex items-center space-x-3 mb-4">
                    <StatusChip label={priority.toUpperCase()} priority={priority} />
                    <span className="label-figure text-ink-muted">{items.length} SKILL{items.length !== 1 ? 'S' : ''}</span>
                  </div>
                  <div className="space-y-0 rule-all">
                    {items.map((gap, idx) => (
                      <div key={gap.skillId} className={`p-5 bg-white ${idx < items.length - 1 ? 'rule-b' : ''}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="label-figure text-ink-muted text-[10px]">{gap.category.toUpperCase()}</p>
                            <h3 className="font-display font-bold text-ink mt-0.5">{gap.skillName}</h3>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-display text-2xl font-bold text-ink tabular-nums">
                              {gap.confidenceScore}%
                            </p>
                            <p className="label-figure text-ink-muted text-[10px]">CONFIDENCE</p>
                          </div>
                        </div>

                        <ProgressBar value={gap.confidenceScore} color={gap.priority === 'Critical' ? 'ink' : 'blue'} size="md" className="mb-3" />

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="label-figure text-ink-muted text-[10px]">CURRENT LEVEL</p>
                            <p className="label-figure text-ink mt-0.5">{gap.currentLevel}/5</p>
                          </div>
                          <div>
                            <p className="label-figure text-ink-muted text-[10px]">TARGET LEVEL</p>
                            <p className="label-figure text-accent-blue mt-0.5">{gap.targetLevel}/5</p>
                          </div>
                          <div>
                            <p className="label-figure text-ink-muted text-[10px]">EST. HOURS</p>
                            <p className="label-figure text-ink mt-0.5">{gap.estimatedHoursToClose}H</p>
                          </div>
                        </div>

                        <p className="font-mono text-xs text-ink-muted leading-relaxed">{gap.rationale}</p>

                        {!gap.prerequisitesMet && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200">
                            <p className="label-figure text-yellow-700 text-[10px]">PREREQUISITES NOT MET — complete foundational skills first</p>
                          </div>
                        )}

                        <button
                          onClick={() => navigate('/challenges')}
                          className="mt-3 label-figure text-accent-blue hover:underline flex items-center space-x-1"
                        >
                          <span>START CHALLENGE</span><ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
