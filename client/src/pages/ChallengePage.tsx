import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { Challenge } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { Loader2, ArrowRight, Clock, FileText } from 'lucide-react';

export const ChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getChallenge(id).then(setChallenge).finally(() => setLoading(false));
    } else {
      api.getChallenges().then(setChallenges).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-5 h-5 animate-spin text-ink-muted" />
          <span className="label-figure text-ink-muted ml-3">LOADING CHALLENGE...</span>
        </div>
      </AppLayout>
    );
  }

  // List view
  if (!id) {
    return (
      <AppLayout>
        <div className="p-6 max-w-screen-lg mx-auto">
          <div className="rule-b pb-4 mb-6">
            <p className="label-figure text-ink-muted">SYSTEM / PRACTICE</p>
            <h1 className="font-display text-2xl font-bold text-ink mt-1">Practical Challenges</h1>
            <p className="font-mono text-xs text-ink-muted mt-1">
              Evidence-generating scenarios calibrated to your skill gaps.
            </p>
          </div>
          <div className="space-y-0 rule-all">
            {challenges.map((ch, idx) => (
              <div
                key={ch.id}
                className={`p-5 bg-white cursor-pointer hover:bg-paper-subtle transition-colors ${idx < challenges.length - 1 ? 'rule-b' : ''}`}
                onClick={() => navigate(`/challenges/${ch.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <StatusChip label={ch.difficulty.toUpperCase()} priority={ch.difficulty === 'Advanced' ? 'Critical' : 'High'} />
                      <span className="label-figure text-ink-muted text-[10px]">{ch.skillName?.toUpperCase()}</span>
                    </div>
                    <h3 className="font-display font-bold text-ink leading-snug">{ch.title}</h3>
                    <p className="font-mono text-xs text-ink-muted mt-2 leading-relaxed max-w-2xl">{ch.description}</p>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-2 flex-shrink-0">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-ink-muted" />
                      <span className="label-figure text-ink-muted">{ch.estimatedMinutes} MIN</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ink-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Detail view
  if (!challenge) return (
    <AppLayout>
      <div className="p-6">
        <p className="label-figure text-red-600">CHALLENGE NOT FOUND</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-lg mx-auto">
        <div className="rule-b pb-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <StatusChip label={challenge.difficulty.toUpperCase()} priority={challenge.difficulty === 'Advanced' ? 'Critical' : 'High'} />
            <span className="label-figure text-ink-muted">{challenge.skillName?.toUpperCase()}</span>
            <span className="text-ink-faint">·</span>
            <span className="label-figure text-ink-muted flex items-center space-x-1">
              <Clock className="w-3 h-3" /><span>{challenge.estimatedMinutes} MIN</span>
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">{challenge.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rule-all mb-6">
          {/* Scenario */}
          <div className="lg:col-span-2 p-5 bg-white rule-r">
            <SectionLabel figure="SCENARIO" title="Business Context" />
            <p className="font-mono text-sm text-ink leading-relaxed mt-3">{challenge.scenario}</p>
          </div>
          {/* Rubric */}
          <div className="p-5 bg-white">
            <SectionLabel figure="RUBRIC" title="Evaluation Criteria" />
            <div className="mt-3 space-y-3">
              {challenge.rubric?.criteria?.map((c: any) => (
                <div key={c.name} className="pb-3 rule-b last:rule-b-0 last:pb-0">
                  <p className="label-figure text-ink">{c.name.toUpperCase()}</p>
                  <p className="label-figure text-accent-blue">{c.maxScore} PTS</p>
                  <p className="font-mono text-[11px] text-ink-muted mt-1 leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="p-5 bg-white rule-all mb-6">
          <SectionLabel figure="DELIVERABLES" title="Expected Output" />
          <div className="mt-3 space-y-2">
            {challenge.expectedDeliverables?.map((d: string, i: number) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="label-figure text-accent-blue w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-mono text-xs text-ink leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/proof/submit/${challenge.id}?skillId=${challenge.skillId}`)}
            className="flex items-center space-x-2 px-6 py-3 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest"
          >
            <FileText className="w-4 h-4" />
            <span>SUBMIT PROOF OF WORK</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="label-figure text-ink-muted hover:text-ink"
          >
            ← BACK
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
