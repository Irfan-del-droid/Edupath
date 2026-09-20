import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/apiClient';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { StatusChip } from '../components/editorial/StatusChip';
import { ProgressBar } from '../components/editorial/ProgressBar';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Editorial Skill Node
const EditorialSkillNode: React.FC<any> = ({ data, selected }: any) => {
  const conf = data.confidenceScore as number;
  const isVerified = conf >= 70;
  const isCritical = conf < 40;

  return (
    <div
      className={`bg-white px-4 py-3 min-w-[140px] cursor-pointer transition-all duration-150 ${
        selected
          ? 'border-2 border-accent-blue shadow-editorial'
          : isCritical
          ? 'border border-red-300'
          : 'border border-rule hover:border-ink'
      }`}
      style={{ borderRadius: 0 }}
    >
      <p className="label-figure text-[9px] text-ink-muted mb-1">{data.category}</p>
      <p className="font-mono text-xs font-semibold text-ink leading-snug">{data.name}</p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`font-display text-lg font-bold tabular-nums ${
            selected ? 'text-accent-blue' : isCritical ? 'text-red-600' : isVerified ? 'text-accent-blue' : 'text-ink'
          }`}
        >
          {conf}%
        </span>
        <StatusChip
          label={isVerified ? 'VER' : isCritical ? 'GAP' : '...'}
          priority={isVerified ? 'verified' : isCritical ? 'Critical' : 'in_progress'}
        />
      </div>
      <ProgressBar
        value={conf}
        color={selected || isVerified ? 'blue' : 'ink'}
        size="sm"
        className="mt-2"
      />
    </div>
  );
};

const nodeTypes = { editorialSkillNode: EditorialSkillNode };

export const SkillGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<any>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<any>>([]);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getSkillGraph()
      .then(({ nodes: n, edges: e }) => {
        setNodes(n);
        setEdges(e);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedSkill(node.data);
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 48px)' }}>
        {/* Header */}
        <div className="px-6 py-4 rule-b bg-white flex items-center justify-between flex-shrink-0">
          <div>
            <SectionLabel figure="FIG. 02" title="Skill Graph" className="mb-0 border-0 pb-0" />
            <p className="font-mono text-xs text-ink-muted mt-0.5">
              Interactive dependency map — click a node to inspect
            </p>
          </div>
          <button
            onClick={() => navigate('/skills/gaps')}
            className="label-figure text-accent-blue hover:underline flex items-center space-x-1"
          >
            <span>GAP ANALYSIS</span><ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Graph canvas */}
          <div className="flex-1 relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin text-ink-muted" />
                <span className="label-figure text-ink-muted ml-3">BUILDING SKILL GRAPH...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="label-figure text-red-600">{error}</p>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                style={{ background: '#F9F9F8' }}
                defaultEdgeOptions={{
                  style: { stroke: '#111111', strokeWidth: 1 },
                  animated: false,
                }}
              >
                <Background color="#E5E5E0" gap={24} size={1} />
                <Controls
                  style={{
                    background: 'white',
                    border: '1px solid #E5E5E0',
                    borderRadius: 0,
                  }}
                />
              </ReactFlow>
            )}
          </div>

          {/* Skill inspector panel */}
          {selectedSkill && (
            <div className="w-72 rule-l bg-white p-5 overflow-y-auto flex-shrink-0">
              <div className="flex items-start justify-between mb-4">
                <SectionLabel figure="SKILL" title="Inspector" className="mb-0 border-0 pb-0 flex-1" />
                <button onClick={() => setSelectedSkill(null)} className="text-ink-muted hover:text-ink p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rule-t pt-4 space-y-4">
                <div>
                  <p className="label-figure text-ink-muted mb-1">SKILL</p>
                  <p className="font-display font-bold text-ink">{selectedSkill.name}</p>
                  <p className="label-figure text-ink-muted mt-0.5">{selectedSkill.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 rule-all p-3">
                  <div>
                    <p className="label-figure text-ink-muted text-[10px]">CONFIDENCE</p>
                    <p className={`font-display text-2xl font-bold tabular-nums ${selectedSkill.confidenceScore < 40 ? 'text-red-600' : selectedSkill.confidenceScore >= 70 ? 'text-accent-blue' : 'text-ink'}`}>
                      {selectedSkill.confidenceScore}%
                    </p>
                  </div>
                  <div>
                    <p className="label-figure text-ink-muted text-[10px]">EVIDENCE</p>
                    <p className="font-display text-2xl font-bold text-ink">{selectedSkill.verifiedEvidenceCount}</p>
                  </div>
                </div>

                <div>
                  <p className="label-figure text-ink-muted mb-1">STATUS</p>
                  <StatusChip
                    label={
                      selectedSkill.status === 'verified'
                        ? 'VERIFIED'
                        : selectedSkill.status === 'unassessed'
                        ? 'UNASSESSED'
                        : 'IN PROGRESS'
                    }
                    priority={selectedSkill.status}
                  />
                </div>

                <div>
                  <p className="label-figure text-ink-muted mb-2">PROFICIENCY</p>
                  <ProgressBar value={selectedSkill.confidenceScore} color="blue" size="md" showLabel />
                </div>

                <div>
                  <p className="label-figure text-ink-muted mb-1">DESCRIPTION</p>
                  <p className="font-mono text-xs text-ink leading-relaxed">{selectedSkill.description}</p>
                </div>

                {selectedSkill.confidenceScore < 70 && (
                  <button
                    onClick={() => navigate('/challenges')}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest"
                  >
                    <span>START CHALLENGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
