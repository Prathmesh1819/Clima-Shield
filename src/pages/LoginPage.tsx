import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogIn, Phone, Lock, Eye, EyeOff, ShieldCheck, 
  AlertCircle, ArrowRight, Sparkles, UserCheck, KeyRound, CheckCircle2, X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, sendResetEmail, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatusMsg, setResetStatusMsg] = useState<{ isError: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setErrorMsg('Please enter your registered mobile number or email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(phoneOrEmail, password);
      if (res.success) {
        if (phoneOrEmail.trim().toLowerCase() === 'admin@climashield.in') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    const res = await sendResetEmail(resetEmail.trim());
    setResetStatusMsg({
      isError: !res.success,
      text: res.message || 'Password reset link dispatched.'
    });
  };

  const handleQuickFillRider = () => {
    setPhoneOrEmail('9876543210');
    setPassword('Rider@123');
    setErrorMsg('');
  };

  const handleQuickFillAdmin = () => {
    setPhoneOrEmail('admin@climashield.in');
    setPassword('Admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Rider & Partner Login
          </h2>
          <p className="text-xs text-slate-400">
            Access your ClimaShield wage protection dashboard & claims log.
          </p>

          {isFirebaseActive && (
            <span className="inline-block text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              🔥 FIREBASE AUTH ACTIVE
            </span>
          )}
        </div>

        {/* Quick Demo Shortcuts Banner */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block text-center">
            ⚡ Quick Demo Logins (Hackathon Mode)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={handleQuickFillRider}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" /> Demo Rider
            </button>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-purple-500/30 text-purple-300 text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" /> Demo Admin
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Mobile / Email */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">
              Registered Mobile Number or Email Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => { setPhoneOrEmail(e.target.value); setErrorMsg(''); }}
                placeholder="9876543210 or rider@climashield.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 transition-all pl-9 font-mono"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => { setShowForgotModal(true); setResetStatusMsg(null); }}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 transition-all pl-9 pr-10"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 accent-cyan-500 w-4 h-4"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span>Signing You In...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Login to Dashboard</span>
              </>
            )}
          </button>

        </form>

        {/* Footer link to Register */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          New to ClimaShield?{' '}
          <Link to="/register" className="font-bold text-cyan-400 hover:underline">
            Register as a Rider now →
          </Link>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" /> Firebase Password Reset
              </span>
              <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400">
              Enter your registered email address to receive a secure password reset link powered by Firebase Authentication.
            </p>

            {resetStatusMsg && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                resetStatusMsg.isError 
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                {resetStatusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{resetStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="rider@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                Send Password Reset Email
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
