import {
  DashboardData,
  UserSkill,
  SkillGap,
  Challenge,
  ProofOfWork,
  AIEvaluation,
  Roadmap,
  UserProfile,
  CareerGoal,
  CareerReadiness,
} from '@edupath/shared';

const API_BASE = '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('edupath_token');
  }

  setToken(token: string) {
    localStorage.setItem('edupath_token', token);
  }

  clearToken() {
    localStorage.removeItem('edupath_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = json.error?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return json.data !== undefined ? json.data : json;
  }

  async get<T = any>(endpoint: string): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, { method: 'GET' });
    return { data };
  }

  async post<T = any>(endpoint: string, body?: any): Promise<{ data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return { data };
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(name: string, email: string, password: string, role = 'student') {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }

  // Skills
  async getSkills(): Promise<UserSkill[]> {
    return this.request<UserSkill[]>('/skills');
  }

  async getSkillGraph(): Promise<{ nodes: any[]; edges: any[] }> {
    return this.request<{ nodes: any[]; edges: any[] }>('/skills/graph');
  }

  async getSkillGaps(): Promise<SkillGap[]> {
    return this.request<SkillGap[]>('/skills/gaps');
  }

  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    return this.request<Challenge[]>('/challenges');
  }

  async getChallenge(id: string): Promise<Challenge> {
    return this.request<Challenge>(`/challenges/${id}`);
  }

  // Proof & Evaluation
  async submitProof(data: {
    challengeId: string;
    skillId: string;
    title: string;
    submissionType: 'text' | 'document' | 'github_url' | 'prototype_url';
    content: string;
    fileUrl?: string | null;
    fileName?: string | null;
  }): Promise<{ proof: ProofOfWork; evaluation: AIEvaluation }> {
    return this.request<{ proof: ProofOfWork; evaluation: AIEvaluation }>('/proof', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProofs(): Promise<ProofOfWork[]> {
    return this.request<ProofOfWork[]>('/proof');
  }

  async getProof(id: string): Promise<ProofOfWork> {
    return this.request<ProofOfWork>(`/proof/${id}`);
  }

  async getEvaluation(id: string): Promise<AIEvaluation> {
    return this.request<AIEvaluation>(`/evaluations/${id}`);
  }

  // Roadmap
  async getRoadmap(): Promise<Roadmap> {
    return this.request<Roadmap>('/roadmap');
  }

  async replanRoadmap(reason?: string): Promise<Roadmap> {
    return this.request<Roadmap>('/roadmap/replan', {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Copilot
  async sendCopilotMessage(message: string, conversationId?: string) {
    return this.request<any>('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    });
  }

  async getCopilotHistory() {
    return this.request<any[]>('/copilot/history');
  }

  // Profile & Career
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile');
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadResumeText(resumeText: string, resumeUrl?: string) {
    return this.request<any>('/profile/resume', {
      method: 'POST',
      body: JSON.stringify({ resumeText, resumeUrl }),
    });
  }

  async getCareerReadiness(): Promise<CareerReadiness> {
    return this.request<CareerReadiness>('/career-goals/readiness');
  }

  // File Upload
  async uploadFile(file: File, folder = 'proof') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/storage/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Upload failed');
    return json.data;
  }
}

export const api = new ApiClient();
