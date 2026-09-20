import React, { useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { Roadmap } from '@edupath/shared';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [replanning, setReplanning] = useState(false);

  const fetchRoadmap = () => {
    setLoading(true);
    api.getRoadmap()
      .then(setRoadmap)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoadmap(); }, []);

  const handleReplan = async () => {
    setReplanning(true);
    try {
      const updated = await api.replanRoadmap('User requested manual replan');
      setRoadmap(updated);
    } finally {
      setReplanning(false);
    }
  };

  const weeks = roadmap
    ? [...new Set(roadmap.items.map(i => i.weekNumber))].sort((a, b) => a - b)
    : [];

  return (
    <AppLayout>
      <div className="p-6 max-w-screen-lg mx-auto">
        <div className="rule-b pb-4 mb-6 flex items-end justify-between">
          <div>
            <p className="label-figure text-ink-muted">SYSTEM / PLANNING</p>
            <h1 className="font-display text-2xl font-bold text-ink mt-1">30-Day Roadmap</h1>
            {roadmap && (
              <p className="label-figure text-ink-muted mt-1">
                VERSION {roadmap.version} · {roadmap.title.toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={handleReplan}
            disabled={replanning}
            className="flex items-center space-x-2 px-4 py-2 bg-white rule-all hover:bg-paper-subtle transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-ink ${replanning ? 'animate-spin' : ''}`} />
            <span className="label-figure text-ink text-[10px]">REPLAN</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center space-x-2 py-12">
            <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
            <span className="label-figure text-ink-muted">LOADING ROADMAP...</span>
          </div>
        ) : !roadmap ? (
          <div className="py-12 text-center">
            <p className="label-figure text-ink-muted">NO ACTIVE ROADMAP</p>
          </div>
        ) : (
          <div className="space-y-8">
            {weeks.map(week => {
              const weekItems = roadmap.items.filter(i => i.weekNumber === week);
              const completedCount = weekItems.filter(i => i.status === 'completed').length;

              return (
                <div key={week}>
                  {/* Week header */}
                  <div className="flex items-center justify-between mb-0 bg-ink text-white px-5 py-3">
                    <div className="flex items-center space-x-4">
                      <span className="label-figure text-accent-blue">WEEK {String(week).padStart(2, '0')}</span>
                      <span className="text-white/40">—</span>
                      <span className="label-figure text-white/70">
                        {completedCount}/{weekItems.length} COMPLETED
                      </span>
                    </div>
                    <div className="w-24 h-0.5 bg-white/20">
                      <div
                        className="h-full bg-accent-blue"
                        style={{ width: `${weekItems.length ? (completedCount / weekItems.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Week items */}
                  <div className="rule-all border-t-0">
                    {weekItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`flex items-start space-x-4 p-5 bg-white ${idx < weekItems.length - 1 ? 'rule-b' : ''} ${item.isNextBestAction ? 'border-l-2 border-l-accent-blue' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <span className="label-figure text-ink-muted w-6 block">
                            {String(item.orderIndex).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-mono text-sm font-semibold text-ink leading-snug">{item.title}</h3>
                              <p className="font-mono text-xs text-ink-muted mt-1 leading-relaxed">{item.objective}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                              {item.isNextBestAction && <StatusChip label="NEXT" priority="Critical" />}
                              <StatusChip
                                label={item.status === 'in_progress' ? 'IN PROGRESS' : item.status.toUpperCase()}
                                priority={item.status}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="label-figure text-ink-muted text-[10px]">{item.estimatedMinutes} MIN</span>
                            <span className="label-figure text-ink-muted text-[10px]">{item.skillName?.toUpperCase()}</span>
                            {item.evidenceRequired && (
                              <span className="label-figure text-ink-muted text-[10px]">EVIDENCE REQUIRED</span>
                            )}
                          </div>
                          {item.isNextBestAction && (
                            <button
                              onClick={() => navigate('/challenges')}
                              className="mt-3 flex items-center space-x-1 label-figure text-accent-blue hover:underline"
                            >
                              <span>START CHALLENGE</span><ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
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
