import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { EditorialCard, MetricCard } from '../components/editorial/EditorialCard';
import { StatusChip } from '../components/editorial/StatusChip';
import { ProgressBar } from '../components/editorial/ProgressBar';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

export const CareerReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load readiness data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppLayout title="CAREER READINESS AUDIT">
        <div className="p-12 text-center font-mono text-xs text-muted">
          CALIBRATING READINESS PORTFOLIO...
        </div>
      </AppLayout>
    );
  }

  const skills = data?.skills || [];
  const verifiedSkills = skills.filter((s: any) => s.verifiedState === 'verified');
  const developingSkills = skills.filter((s: any) => s.verifiedState === 'in_progress');
  const unassessedSkills = skills.filter((s: any) => s.verifiedState === 'unassessed');

  const readinessScore = data?.readinessScore || 72;

  return (
    <AppLayout title="CAREER READINESS AUDIT">
      <div className="space-y-10">
        {/* Top Header & Readiness Score Bar */}
        <div className="border border-dark bg-surface p-6 sm:p-8 shadow-[4px_4px_0px_0px_#111111]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-rule gap-4">
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                EXECUTIVE AUDIT DOSSIER // APM BENCHMARK
              </span>
              <h1 className="font-serif text-3xl font-bold">
                Target Role: {data?.targetRole || 'AI Product Manager'}
              </h1>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs text-muted uppercase block">
                COMPOSITE READINESS
              </span>
              <span className="font-mono text-4xl font-bold text-accent-blue">
                {readinessScore}%
              </span>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-muted">EMPLOYABILITY THRESHOLD</span>
              <span className="font-bold text-emerald-700">Interview Ready: &gt;70%</span>
            </div>
            <ProgressBar value={readinessScore} color="blue" size="md" />
            <p className="mt-3 font-mono text-xs text-neutral-600">
              {readinessScore >= 70
                ? 'Candidate satisfies baseline structural requirements for high-growth AI PM roles. AI Evaluation remains the primary differentiating gap for tier-1 tech.'
                : 'Accelerate proof-of-work submissions in high-weight competencies to clear the 70% threshold.'}
            </p>
          </div>
        </div>

        {/* Readiness Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EditorialCard>
            <div className="flex items-center space-x-2 text-emerald-600 mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                VERIFIED COMPETENCIES ({verifiedSkills.length})
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Backed by evaluated proof-of-work or documented historical artifacts.
            </p>
            <div className="space-y-2 font-mono text-xs">
              {verifiedSkills.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 bg-paper border border-rule"
                >
                  <span className="font-bold text-ink truncate mr-2">{s.name}</span>
                  <span className="text-emerald-700 font-bold">{s.currentLevel}%</span>
                </div>
              ))}
            </div>
          </EditorialCard>

          <EditorialCard>
            <div className="flex items-center space-x-2 text-amber-600 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                DEVELOPING GAPS ({developingSkills.length})
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Currently active in the 30-day roadmap. High leverage for salary bands.
            </p>
            <div className="space-y-2 font-mono text-xs">
              {developingSkills.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 bg-paper border border-rule"
                >
                  <span className="font-bold text-ink truncate mr-2">{s.name}</span>
                  <span className="text-amber-700 font-bold">{s.currentLevel}%</span>
                </div>
              ))}
            </div>
          </EditorialCard>

          <EditorialCard>
            <div className="flex items-center space-x-2 text-muted mb-3">
              <FileCheck className="w-5 h-5" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                UNASSESSED DOMAINS ({unassessedSkills.length})
              </span>
            </div>
            <p className="text-xs text-neutral-600 mb-4 font-sans">
              Secondary or elective competencies scheduled for later roadmap phases.
            </p>
            <div className="space-y-2 font-mono text-xs">
              {unassessedSkills.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 bg-paper border border-rule text-neutral-500"
                >
                  <span className="truncate mr-2">{s.name}</span>
                  <span>Unassessed</span>
                </div>
              ))}
            </div>
          </EditorialCard>
        </div>

        {/* Proof of Work Portfolio Dossier */}
        <div>
          <SectionLabel
            figure="FIG. 04"
            label="EVIDENCE PORTFOLIO"
            sub="Auditable artifacts ready to present to hiring managers and technical interviewers."
            className="mb-4"
          />

          <EditorialCard noPadding>
            <div className="divide-y divide-rule">
              {(data?.recentProofs || []).map((proof: any) => (
                <div
                  key={proof.id}
                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-paper/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-muted">
                        SUBMISSION REF: {proof.id.slice(0, 8)}
                      </span>
                      <StatusChip label={proof.status.toUpperCase()} priority="verified" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-ink">
                      {proof.challengeTitle || 'Technical Proof Submission'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/evaluations`)}
                      className="px-3 py-1.5 border border-rule font-mono text-xs uppercase hover:border-ink flex items-center space-x-1"
                    >
                      <span>View Rubric Report</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </EditorialCard>
        </div>
      </div>
    </AppLayout>
  );
};
