import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { DashboardData } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { ProgressBar } from '../components/editorial/ProgressBar';
import { ArrowRight, Loader2, RefreshCw, Clock, Zap } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const d = await api.getDashboard();
      setData(d);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-5 h-5 animate-spin text-ink-muted" />
          <span className="label-figure text-ink-muted ml-3">LOADING INTELLIGENCE SURFACE...</span>
        </div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="p-8">
          <p className="label-figure text-red-600">ERROR / {error || 'FAILED TO LOAD'}</p>
          <button onClick={fetchDashboard} className="mt-4 flex items-center space-x-2 label-figure text-ink hover:text-accent-blue">
            <RefreshCw className="w-3 h-3" /><span>RETRY</span>
          </button>
        </div>
      </AppLayout>
    );
  }

  const { user, careerGoal, readiness, userSkills, topGaps, nextBestAction, activeRoadmap, recentProof } = data;
  const criticalGap = topGaps.find(g => g.priority === 'Critical');
  const sortedSkills = [...userSkills].sort((a, b) => b.confidenceScore - a.confidenceScore);
  const weekItems = activeRoadmap?.items?.filter(i => i.weekNumber === 1) || [];

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-xl mx-auto space-y-0">
        {/* Header strip */}
        <div className="rule-b pb-4 mb-6 flex items-end justify-between">
          <div>
            <p className="label-figure text-ink-muted">CAREER / {careerGoal.targetRole.toUpperCase()}</p>
            <h1 className="font-display text-2xl font-bold text-ink mt-1">Intelligence Dashboard</h1>
          </div>
          <button
            onClick={fetchDashboard}
            className="label-figure text-ink-muted hover:text-ink flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" /><span>REFRESH</span>
          </button>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 rule-all">

          {/* READINESS METRIC — large top-left */}
          <div className="lg:col-span-1 p-6 rule-b lg:rule-b-0 lg:rule-r bg-white">
            <SectionLabel figure="FIG. 01" title="Career Readiness" />
            <div className="mt-4">
              <div className="font-display text-7xl font-bold text-accent-blue tabular-nums leading-none">
                {readiness.overallScore}
                <span className="text-3xl text-ink-muted font-medium">%</span>
              </div>
              <p className="label-figure text-ink mt-3">{careerGoal.targetRole.toUpperCase()}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="label-figure text-ink-muted text-[10px]">SKILLS VERIFIED</span>
                  <span className="label-figure text-ink tabular-nums">{readiness.skillsVerifiedCount}/{readiness.totalRequiredSkills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="label-figure text-ink-muted text-[10px]">PROOF ARTIFACTS</span>
                  <span className="label-figure text-ink tabular-nums">{readiness.proofArtifactsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="label-figure text-ink-muted text-[10px]">CRITICAL GAPS</span>
                  <span className="label-figure text-red-600 tabular-nums">{readiness.criticalGapsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SKILL SYSTEM — center column */}
          <div className="lg:col-span-1 p-6 rule-b lg:rule-b-0 lg:rule-r bg-white">
            <SectionLabel figure="FIG. 02" title="Skill System" />
            <div className="mt-4 space-y-3">
              {sortedSkills.slice(0, 7).map((skill) => (
                <div key={skill.skillId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink truncate flex-1">{skill.skillName}</span>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="label-figure text-ink tabular-nums">{skill.confidenceScore}%</span>
                      <StatusChip
                        label={skill.status === 'verified' ? 'VER' : skill.status === 'unassessed' ? 'NEW' : '...'}
                        priority={skill.status}
                      />
                    </div>
                  </div>
                  <ProgressBar
                    value={skill.confidenceScore}
                    color={skill.confidenceScore >= 70 ? 'blue' : 'ink'}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/skills')}
              className="mt-4 label-figure text-accent-blue hover:underline flex items-center space-x-1"
            >
              <span>VIEW FULL SKILL GRAPH</span><ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* CURRENT STATE — critical gap callout */}
          <div className="lg:col-span-1 p-6 bg-white">
            <SectionLabel figure="FIG. 03" title="Current State" />
            {criticalGap ? (
              <div className="mt-4">
                <StatusChip label="CRITICAL GAP" priority="Critical" className="mb-3" />
                <div className="font-display text-4xl font-bold text-ink tabular-nums leading-none mt-2">
                  {criticalGap.confidenceScore}
                  <span className="text-xl text-ink-muted font-medium">%</span>
                </div>
                <p className="label-figure text-ink mt-2">{criticalGap.skillName.toUpperCase()}</p>
                <p className="font-mono text-xs text-ink-muted mt-3 leading-relaxed">{criticalGap.rationale}</p>
                <div className="mt-4 pt-4 rule-t">
                  <div className="flex justify-between mb-1">
                    <span className="label-figure text-ink-muted text-[10px]">CURRENT</span>
                    <span className="label-figure text-ink-muted text-[10px]">TARGET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="label-figure text-red-600">{criticalGap.currentLevel}/5</span>
                    <span className="label-figure text-accent-blue">{criticalGap.targetLevel}/5</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <StatusChip label="ON TRACK" priority="verified" />
                <p className="label-figure text-ink-muted mt-3">No critical gaps detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* NEXT BEST ACTION — full width */}
        <div className="bg-ink text-white p-6 rule-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="label-figure text-accent-blue">FIG. 04 / NEXT BEST ACTION</span>
                <StatusChip label={nextBestAction.impactLevel.toUpperCase() + ' IMPACT'} priority="Critical" />
              </div>
              <h2 className="font-display text-xl font-bold text-white leading-tight mb-2">
                {nextBestAction.title}
              </h2>
              <p className="font-mono text-xs text-white/60 leading-relaxed max-w-2xl">
                {nextBestAction.rationale}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-white/40" />
                  <span className="label-figure text-white/60">{nextBestAction.estimatedMinutes} MIN</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-accent-blue" />
                  <span className="label-figure text-accent-blue">{nextBestAction.targetSkillName.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/challenges/${nextBestAction.challengeId}`)}
              className="ml-6 flex-shrink-0 flex items-center space-x-2 px-5 py-3 bg-accent-blue text-white hover:bg-blue-700 transition-colors font-mono font-semibold text-xs uppercase tracking-widest"
            >
              <span>START CHALLENGE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom grid: Roadmap + Recent Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rule-all border-t-0">
          {/* ROADMAP PREVIEW */}
          <div className="p-6 rule-r bg-white">
            <SectionLabel figure="FIG. 05" title="Current Roadmap" status={`V${activeRoadmap?.version || 1}`} />
            <div className="mt-4 space-y-3">
              {weekItems.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="flex items-start space-x-3 pb-3 rule-b last:rule-b-0 last:pb-0">
                  <span className="label-figure text-ink-muted w-6 text-[10px] flex-shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-ink leading-snug truncate">{item.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="label-figure text-ink-muted text-[10px]">WK {item.weekNumber}</span>
                      <span className="text-ink-faint">·</span>
                      <span className="label-figure text-ink-muted text-[10px]">{item.estimatedMinutes}MIN</span>
                      <StatusChip
                        label={item.isNextBestAction ? 'NEXT' : item.status.toUpperCase()}
                        priority={item.isNextBestAction ? 'Critical' : item.status}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/roadmap')}
              className="mt-4 label-figure text-accent-blue hover:underline flex items-center space-x-1"
            >
              <span>VIEW FULL ROADMAP</span><ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* RECENT PROOF */}
          <div className="p-6 bg-white">
            <SectionLabel figure="FIG. 06" title="Recent Proof" />
            <div className="mt-4 space-y-3">
              {recentProof.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="label-figure text-ink-muted">NO EVIDENCE YET</p>
                  <p className="font-mono text-xs text-ink-muted mt-1">Complete your first challenge to create proof.</p>
                  <button
                    onClick={() => navigate(`/challenges/${nextBestAction.challengeId}`)}
                    className="mt-3 label-figure text-accent-blue hover:underline flex items-center space-x-1 mx-auto"
                  >
                    <span>VIEW CHALLENGE</span><ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : recentProof.slice(0, 3).map((proof) => (
                <div
                  key={proof.id}
                  className="pb-3 rule-b last:rule-b-0 last:pb-0 cursor-pointer hover:bg-paper-subtle -mx-2 px-2 transition-colors"
                  onClick={() => navigate(`/proof/${proof.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-xs text-ink leading-snug flex-1">{proof.title}</p>
                    {proof.evaluation && (
                      <span className="label-figure text-accent-blue tabular-nums ml-2">{proof.evaluation.overallScore}%</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <StatusChip label={proof.status.toUpperCase()} priority={proof.status} />
                    <span className="label-figure text-ink-muted text-[10px]">
                      {new Date(proof.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/proof')}
              className="mt-4 label-figure text-accent-blue hover:underline flex items-center space-x-1"
            >
              <span>ALL PROOF OF WORK</span><ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
