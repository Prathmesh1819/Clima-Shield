import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, ShieldCheck, DollarSign, Activity, Search, 
  Filter, Eye, CheckCircle2, AlertCircle, X, ShieldAlert, Award 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../services/storageService';
import { RiderProfile } from '../../types/rider';

export const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [riders, setRiders] = useState<RiderProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [workerFilter, setWorkerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRider, setSelectedRider] = useState<RiderProfile | null>(null);

  useEffect(() => {
    const data = StorageService.getRiders();
    setRiders(data);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Admin Console...</div>;
  }

  // Admin Auth Guard
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400" />
        <h2 className="text-xl font-bold text-white">Unauthorized Access</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          You don't have permission to access the ClimaShield Admin Console. Please login with an admin account.
        </p>
      </div>
    );
  }

  // Filter Logic
  const filteredRiders = riders.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.phone.includes(searchTerm) || 
                          r.riderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || r.city === cityFilter;
    const matchesWorker = workerFilter === 'ALL' || r.workerType === workerFilter;
    const matchesStatus = statusFilter === 'ALL' || r.protectionStatus === statusFilter;
    return matchesSearch && matchesCity && matchesWorker && matchesStatus;
  });

  const totalRiders = riders.length;
  const activeRiders = riders.filter(r => r.protectionStatus === 'ACTIVE').length;
  const totalClaimsCount = 14;
  const totalProtectedAmount = 5250;

  const handleToggleStatus = (riderId: string) => {
    const target = StorageService.getRiderById(riderId);
    if (target) {
      const nextStatus = target.protectionStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      target.protectionStatus = nextStatus;
      StorageService.saveRider(target);
      const updated = StorageService.getRiders();
      setRiders(updated);
      if (selectedRider?.riderId === riderId) {
        setSelectedRider({ ...target });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-400" /> ClimaShield Underwriter & Admin Console
            </h1>
            <span className="text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              ADMIN ROLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered riders management, parametric risk policies, and solvency oversight.
          </p>
        </div>
      </div>

      {/* STATS METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Total Registered Riders</span>
          <span className="text-2xl font-black text-white font-mono block">{totalRiders}</span>
          <span className="text-[10px] text-cyan-400 font-semibold block">Gig Workers Onboarded</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Active Protection Plans</span>
          <span className="text-2xl font-black text-emerald-400 font-mono block">{activeRiders}</span>
          <span className="text-[10px] text-emerald-400 font-semibold block">Parametric Coverage Active</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Total Disbursals Executed</span>
          <span className="text-2xl font-black text-white font-mono block">{totalClaimsCount}</span>
          <span className="text-[10px] text-slate-400 block">Smart Contract Claims</span>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Protected Income Pool</span>
          <span className="text-2xl font-black text-cyan-400 font-mono block">₹{totalProtectedAmount.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-emerald-400 font-semibold block">Disbursed via UPI</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search rider name, phone, or Rider ID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>

            {/* Worker Type Filter */}
            <select
              value={workerFilter}
              onChange={(e) => setWorkerFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Worker Types</option>
              <option value="Delivery Rider">Delivery Rider</option>
              <option value="Auto Driver">Auto Driver</option>
              <option value="Cab Driver">Cab Driver</option>
              <option value="Food Delivery Partner">Food Partner</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </div>

      {/* RIDERS TABLE */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Rider ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Worker Type / Platform</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Reg Date</th>
                <th className="py-3 px-4 text-center">Protection Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredRiders.map(r => (
                <tr key={r.riderId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-purple-300 whitespace-nowrap">{r.riderId}</td>
                  <td className="py-3 px-4 text-white font-sans font-bold whitespace-nowrap">{r.fullName}</td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">+91 {r.phone}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans whitespace-nowrap">{r.workerType} ({r.platform})</td>
                  <td className="py-3 px-4 text-slate-300 font-sans whitespace-nowrap">{r.city}</td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{r.createdAt.split('T')[0]}</td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                      r.protectionStatus === 'ACTIVE' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {r.protectionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedRider(r)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-semibold text-[10px] border border-slate-700 transition-all cursor-pointer"
                    >
                      Inspect Rider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIDER INSPECTION MODAL */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-extrabold text-purple-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Rider Profile Inspector ({selectedRider.riderId})
              </span>
              <button onClick={() => setSelectedRider(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-slate-300 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Full Name:</span>
                <span className="font-bold text-white">{selectedRider.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Mobile Phone:</span>
                <span>+91 {selectedRider.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Email Address:</span>
                <span>{selectedRider.email || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Worker & Vehicle:</span>
                <span>{selectedRider.workerType} ({selectedRider.vehicleType})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Platform:</span>
                <span className="text-cyan-400">{selectedRider.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Location:</span>
                <span>{selectedRider.area}, {selectedRider.city} ({selectedRider.pincode})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-400">Daily Income Range:</span>
                <span>{selectedRider.dailyIncomeRange}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Current Status: <strong className="text-white">{selectedRider.protectionStatus}</strong></span>
              <button
                onClick={() => handleToggleStatus(selectedRider.riderId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRider.protectionStatus === 'ACTIVE'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {selectedRider.protectionStatus === 'ACTIVE' ? 'Suspend Policy' : 'Activate Policy'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
