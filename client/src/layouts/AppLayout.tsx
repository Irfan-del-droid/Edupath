import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import {
  LayoutDashboard, GitBranch, Map, Target, FileText, Cpu,
  Settings, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, figure: '01' },
  { to: '/skills', label: 'Skill System', icon: GitBranch, figure: '02' },
  { to: '/roadmap', label: 'Roadmap', icon: Map, figure: '03' },
  { to: '/challenges', label: 'Challenges', icon: Target, figure: '04' },
  { to: '/proof', label: 'Proof of Work', icon: FileText, figure: '05' },
  { to: '/copilot', label: 'AI Copilot', icon: Cpu, figure: '06' },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <nav className="flex flex-col h-full bg-white rule-r">
      {/* Logo */}
      <div className="p-5 rule-b">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-ink flex items-center justify-center">
            <div className="w-2 h-2 bg-accent-blue" />
          </div>
          <span className="font-display font-bold text-ink text-base tracking-tight">EDUPATH</span>
        </div>
        <p className="label-figure text-ink-muted mt-1 text-[10px]">AI CAREER NAVIGATION</p>
      </div>

      {/* User profile strip */}
      <div className="px-5 py-3 rule-b bg-paper-subtle">
        <div className="label-figure text-ink truncate">{user?.name?.toUpperCase()}</div>
        <div className="label-figure text-ink-muted text-[10px] mt-0.5 truncate">{user?.email}</div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between px-5 py-3 group transition-colors duration-100',
                isActive
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:bg-paper-subtle hover:text-ink'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={clsx('w-3.5 h-3.5', isActive ? 'text-white' : 'text-ink-muted group-hover:text-ink')}
                  />
                  <span className="label-figure text-[10px]">{item.label.toUpperCase()}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-accent-blue" />}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="rule-t">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center space-x-3 px-5 py-3 transition-colors',
              isActive ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink hover:bg-paper-subtle'
            )
          }
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="label-figure text-[10px]">SETTINGS</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-5 py-3 text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors rule-t"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="label-figure text-[10px]">SIGN OUT</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-56 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-56 flex-col flex">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-3 rule-b bg-white md:hidden">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-ink flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-accent-blue" />
            </div>
            <span className="font-display font-bold text-ink text-sm">EDUPATH</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-grid relative">
          {children}
        </main>
      </div>
    </div>
  );
};
