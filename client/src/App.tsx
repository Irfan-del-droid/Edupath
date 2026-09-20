import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './app/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ChallengePage } from './pages/ChallengePage';
import { ProofOfWorkPage } from './pages/ProofOfWorkPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { CareerReadinessPage } from './pages/CareerReadinessPage';
import { CopilotPage } from './pages/CopilotPage';
import { SettingsPage } from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-xs text-muted">
        VERIFYING AUTHENTICATION STATE...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <SkillGraphPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gaps"
        element={
          <ProtectedRoute>
            <SkillGapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <RoadmapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <ChallengePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges/:id"
        element={
          <ProtectedRoute>
            <ChallengePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proof"
        element={
          <ProtectedRoute>
            <ProofOfWorkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proof/:challengeId"
        element={
          <ProtectedRoute>
            <ProofOfWorkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluations"
        element={
          <ProtectedRoute>
            <EvaluationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evaluations/:id"
        element={
          <ProtectedRoute>
            <EvaluationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readiness"
        element={
          <ProtectedRoute>
            <CareerReadinessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
            <CopilotPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
