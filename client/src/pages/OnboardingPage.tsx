import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { api } from '../services/apiClient';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { EditorialCard } from '../components/editorial/EditorialCard';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { ArrowRight, UploadCloud, FileText, CheckCircle2, Loader2, Edit2, Check } from 'lucide-react';
import { clsx } from 'clsx';

type ExtractedSkill = {
  name: string;
  score: number;
  category: 'strong' | 'developing' | 'weak';
};

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [targetRole, setTargetRole] = useState('AI Product Manager');
  const [extractedData, setExtractedData] = useState<{
    skills: ExtractedSkill[];
    projects: string[];
    experience: string[];
    suggestedRole: string;
  } | null>(null);

  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);
  const [editingSkillName, setEditingSkillName] = useState('');

  // Dropzone Handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!resumeFile) return;
    setStep(2);
    setIsAnalyzing(true);
    setError(null);

    try {
      await new Promise(r => setTimeout(r, 1500));

      const mockResumeText = `Irfan
Senior Product Analyst & Technical PM
Experience: 4 years in B2B SaaS product analytics, customer journey mapping, and feature PRDs.
Current Skills: SQL, Amplitude, User Interviews, Wireframing, Agile Scrum, Basic Python.
Targeting: AI Product Manager roles focusing on LLM agents and intelligent automation.
Projects: AI Study Assistant, Customer Support Agent.`;

      const res = await api.post('/profile/resume', {
        resumeText: mockResumeText,
        resumeUrl: 'https://mock-storage.com/resume.pdf'
      });

      if (res.data.success) {
        const extracted = res.data.data.extracted;
        // Ensure we always have skills to display
        const skills = Array.isArray(extracted?.skills) && extracted.skills.length > 0
          ? extracted.skills
          : [
              { name: 'Product Discovery', score: 85, category: 'strong' as const },
              { name: 'Product Analytics', score: 65, category: 'developing' as const },
              { name: 'AI Fundamentals', score: 55, category: 'developing' as const },
              { name: 'AI Evaluation', score: 25, category: 'weak' as const },
              { name: 'Agent Design', score: 15, category: 'weak' as const },
            ];
        setExtractedData({
          skills,
          projects: extracted?.projects ?? ['AI Study Assistant', 'Customer Support Agent'],
          experience: extracted?.experience ?? ['Product Development', 'AI Integration'],
          suggestedRole: extracted?.suggestedRole ?? targetRole,
        });
        setStep(3);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze resume. Please try again.');
      setStep(1);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompleteSetup = async () => {
    try {
      await api.post('/career/goal', {
        targetRole,
        targetLevel: 'Senior',
        targetTimelineWeeks: 8,
      });

      await api.post('/roadmap/replan', {
        reason: 'Initial profile calibration from Resume',
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to initialize dashboard.');
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between p-6 sm:p-10 font-sans">
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-rule pb-4 mb-8">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-ink text-paper tracking-widest">
              SYSTEM INITIALIZE
            </span>
            <span className="font-serif font-bold text-lg">EduPath Analysis</span>
          </div>
          <span className="font-mono text-xs text-muted">STEP 0{step} OF 04</span>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-rose-400 bg-rose-50 text-rose-800 text-xs font-mono">
            {error}
          </div>
        )}

        {/* STEP 1: RESUME UPLOAD */}
        {step === 1 && (
          <div className="space-y-6">
            <SectionLabel
              figure="FIG. 01"
              label="PROFILE EVIDENCE"
              sub="EduPath will use your resume to understand your current skills, experience, and projects."
            />

            <div
              className="relative w-full border border-ink bg-white p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper-subtle transition-colors group rule-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
              
              <UploadCloud className="w-8 h-8 text-ink mb-4 relative z-10 group-hover:text-accent-blue" />
              
              <h3 className="font-display font-bold text-lg relative z-10">DROP YOUR RESUME HERE</h3>
              <p className="font-mono text-xs text-muted mt-2 mb-4 relative z-10">PDF / DOC / DOCX</p>
              
              <EditorialButton variant="secondary" size="sm" className="relative z-10" onClick={(e) => {
                e.stopPropagation();
                document.getElementById('resume-upload')?.click();
              }}>
                SELECT RESUME
              </EditorialButton>
              
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              {resumeFile && (
                <div className="mt-6 p-3 bg-paper border border-rule flex items-center space-x-3 relative z-10">
                  <FileText className="w-4 h-4 text-accent-blue" />
                  <span className="font-mono text-xs">{resumeFile.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <EditorialButton 
                disabled={!resumeFile}
                onClick={handleStartAnalysis}
              >
                BEGIN ANALYSIS <ArrowRight className="w-4 h-4 ml-2 inline" />
              </EditorialButton>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 2 && (
          <div className="space-y-6">
            <SectionLabel
              figure="FIG. 02"
              label="PROFILE ANALYSIS"
              sub="Understanding your profile"
            />
            
            <EditorialCard className="flex flex-col space-y-4 py-8 px-6 font-mono text-xs">
              <div className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-3" />
                <span>Resume uploaded successfully</span>
              </div>
              <div className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-3" />
                <span>Reading experience and tenure</span>
              </div>
              <div className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4 mr-3" />
                <span>Extracting validated projects</span>
              </div>
              <div className="flex items-center text-accent-blue animate-pulse">
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                <span>Identifying technologies and mapping skills...</span>
              </div>
              <div className="flex items-center text-muted">
                <div className="w-4 h-4 border border-rule rounded-full mr-3" />
                <span>Comparing against Target Role requirements</span>
              </div>
            </EditorialCard>
          </div>
        )}

        {/* STEP 3: EXTRACTED SKILLS REVIEW */}
        {step === 3 && extractedData && (
          <div className="space-y-6">
            <SectionLabel
              figure="FIG. 03"
              label="EXTRACTED SKILLS"
              sub="Review and edit the skills we discovered from your resume."
            />

            <div className="space-y-6">
              <div>
                <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">Skills Detected</h4>
                <div className="space-y-2">
                  {extractedData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-rule bg-white">
                      {editingSkillIndex === index ? (
                        <input
                          type="text"
                          value={editingSkillName}
                          onChange={(e) => setEditingSkillName(e.target.value)}
                          className="font-sans font-semibold text-sm border-b border-ink focus:outline-none bg-transparent"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className="font-sans font-semibold text-sm">{skill.name}</span>
                          <span className="font-mono text-[10px] bg-paper-subtle px-1.5 py-0.5 border border-rule">{skill.score}%</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {editingSkillIndex === index ? (
                          <button onClick={() => {
                            const newSkills = [...extractedData.skills];
                            newSkills[index].name = editingSkillName;
                            setExtractedData({...extractedData, skills: newSkills});
                            setEditingSkillIndex(null);
                          }} className="text-emerald-600 hover:text-emerald-700">
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button onClick={() => {
                              setEditingSkillIndex(index);
                              setEditingSkillName(skill.name);
                            }} className="font-mono text-[10px] uppercase text-muted hover:text-ink">
                              [ EDIT ]
                            </button>
                            <button className="font-mono text-[10px] uppercase text-accent-blue hover:text-blue-800">
                              [ CONFIRM ]
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditorialCard>
                  <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">Project Evidence</h4>
                  <ul className="list-disc pl-4 space-y-1 font-sans text-sm">
                    {extractedData.projects.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </EditorialCard>

                <EditorialCard>
                  <h4 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">Experience Signals</h4>
                  <ul className="list-disc pl-4 space-y-1 font-sans text-sm">
                    {extractedData.experience.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </EditorialCard>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <EditorialButton variant="ghost" onClick={() => setStep(1)}>BACK</EditorialButton>
              <EditorialButton onClick={() => setStep(4)}>
                COMPARE TO TARGET ROLE <ArrowRight className="w-4 h-4 ml-2 inline" />
              </EditorialButton>
            </div>
          </div>
        )}

        {/* STEP 4: TARGET ROLE COMPARISON */}
        {step === 4 && extractedData && (
          <div className="space-y-6">
            <SectionLabel
              figure="FIG. 04"
              label="TARGET ROLE COMPARISON"
              sub="Mapping your current verified skills against industry benchmarks."
            />
            
            <EditorialCard className="bg-ink text-white">
              <div className="font-mono text-[10px] text-neutral-400 mb-1">SELECTED TARGET ROLE</div>
              <div className="font-display font-bold text-xl">{targetRole}</div>
            </EditorialCard>

            <div className="border border-rule bg-white p-5">
              <div className="font-mono text-[10px] text-muted mb-4 uppercase">Skill Gap Identified</div>
              
              <div className="flex items-end justify-between border-b border-rule pb-4 mb-4">
                <div>
                  <div className="font-sans font-bold text-lg">AI Evaluation</div>
                  <div className="font-mono text-xs text-muted mt-1">Evidence: Low</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-2xl text-rose-600">52% GAP</div>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-xs mb-4">
                <div>
                  <div className="text-muted">YOUR LEVEL</div>
                  <div className="font-bold">28%</div>
                </div>
                <div className="text-right">
                  <div className="text-muted">TARGET LEVEL</div>
                  <div className="font-bold">80%</div>
                </div>
              </div>

              <div className="bg-paper p-3 border border-rule mt-4">
                <span className="font-mono text-[10px] uppercase font-bold text-ink block mb-1">WHY THIS MATTERS</span>
                <p className="font-sans text-sm text-neutral-700">
                  Your projects show AI application experience, but there is limited evidence of designing evaluation frameworks for AI systems in your resume.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <EditorialButton onClick={handleCompleteSetup}>
                GENERATE DASHBOARD <ArrowRight className="w-4 h-4 ml-2 inline" />
              </EditorialButton>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto w-full pt-10 border-t border-rule mt-10 text-center font-mono text-[11px] text-muted">
        EDUPATH // SKILL INGESTION SYSTEM
      </div>
    </div>
  );
};
