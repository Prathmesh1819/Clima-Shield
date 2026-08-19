import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, UserPlus, LogIn, LayoutDashboard, FileText, 
  Shield, User, LogOut, Menu, X, Radio, ChevronRight, Award 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShield } from '../context/ShieldContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { weather, ledger } = useShield();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Clima<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Shield</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hidden sm:inline-block">
                Gig Protection
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Parametric Wage-Loss Protection Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-lg transition-all ${isActive('/') ? 'bg-slate-800 text-cyan-400 font-bold' : 'hover:text-white hover:bg-slate-800/60'}`}
          >
            Home / Simulation
          </Link>

          {isAuthenticated && user?.role === 'rider' && (
            <>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${isActive('/dashboard') ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <Link 
                to="/dashboard/claims" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${isActive('/dashboard/claims') ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Claims
              </Link>
              <Link 
                to="/dashboard/plan" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${isActive('/dashboard/plan') ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <Shield className="w-3.5 h-3.5" /> My Plan
              </Link>
              <Link 
                to="/dashboard/profile" 
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${isActive('/dashboard/profile') ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <User className="w-3.5 h-3.5" /> Profile
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 ${isActive('/admin') ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30' : 'hover:text-white hover:bg-slate-800/60'}`}
            >
              <Award className="w-3.5 h-3.5 text-purple-400" /> Admin Console
            </Link>
          )}
        </nav>

        {/* Action Buttons / Session Info */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {!isAuthenticated || !user ? (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-semibold transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Rider Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" /> Register as a Rider
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-xl text-[11px] text-right">
                <span className="block font-bold text-white leading-tight">{user.name}</span>
                <span className="text-[9px] uppercase font-mono font-semibold text-cyan-400">
                  {user.role === 'admin' ? 'SYSTEM ADMIN' : user.riderId}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-700 hover:border-rose-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-sm"
            >
              Register
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg bg-slate-800/60 text-slate-200 font-semibold"
          >
            Home / Simulation Showcase
          </Link>

          {!isAuthenticated || !user ? (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-center border border-slate-700 flex items-center justify-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-center flex items-center justify-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </Link>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              {user.role === 'rider' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 text-cyan-400 font-bold"
                  >
                    <span>Dashboard</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/dashboard/claims"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 text-slate-200 font-semibold"
                  >
                    <span>Claims History</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/dashboard/plan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 text-slate-200 font-semibold"
                  >
                    <span>My Protection Plan</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 text-slate-200 font-semibold"
                  >
                    <span>Rider Profile</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-purple-950/60 text-purple-300 font-bold border border-purple-500/30"
                >
                  <span>Admin Dashboard</span> <ChevronRight className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg bg-rose-950/40 text-rose-300 font-semibold border border-rose-500/20 flex items-center justify-between"
              >
                <span>Logout Session</span> <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
