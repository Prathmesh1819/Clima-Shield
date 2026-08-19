import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Shield, User, LogOut, 
  ChevronRight, Radio, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShield } from '../../context/ShieldContext';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isOnShift, setIsOnShift } = useShield();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
        Loading ClimaShield Rider Dashboard...
      </div>
    );
  }

  // Auth Guard
  if (!isAuthenticated || !user || user.role !== 'rider') {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/dashboard/claims', label: 'Claims History', icon: FileText },
    { path: '/dashboard/plan', label: 'My Plan & Rules', icon: Shield },
    { path: '/dashboard/profile', label: 'Rider Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 max-w-7xl mx-auto space-y-6">
      
      {/* Sub-Header Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs font-bold no-scrollbar">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = location.pathname === t.path;
            return (
              <Link
                key={t.path}
                to={t.path}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  active 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Shift Toggle Switch */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
          <span className="text-slate-400">Shift Duty:</span>
          <button
            onClick={() => setIsOnShift(!isOnShift)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs shadow-sm cursor-pointer ${
              isOnShift
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnShift ? 'bg-slate-950 animate-ping' : 'bg-slate-500'}`} />
            {isOnShift ? 'ON SHIFT (PROTECTED)' : 'OFF SHIFT'}
          </button>
        </div>
      </div>

      {/* Outlet Content */}
      <Outlet />

    </div>
  );
};
