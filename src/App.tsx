import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShieldProvider } from './context/ShieldContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';

import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { ClaimsPage } from './pages/dashboard/ClaimsPage';
import { PlanPage } from './pages/dashboard/PlanPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShieldProvider>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500 selection:text-slate-950">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Rider Dashboard Protected Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="claims" element={<ClaimsPage />} />
                  <Route path="plan" element={<PlanPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Console Route */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Legal Pages */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 bg-slate-900/40 mt-auto">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-400">ClimaShield Platform</span>
                  <span className="text-slate-600">|</span>
                  <span>Parametric Climate Wage-Loss Protection for Delivery Partners</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Developed by team 18</span>
                </div>
              </div>
            </footer>
          </div>
        </ShieldProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
