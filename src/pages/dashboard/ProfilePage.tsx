import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Briefcase, Calendar, 
  ShieldCheck, Check, Edit3, Save, AlertCircle, HeartHandshake 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { riderProfile, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form editable state
  const [editForm, setEditForm] = useState({
    fullName: riderProfile?.fullName || '',
    phone: riderProfile?.phone || '',
    email: riderProfile?.email || '',
    city: riderProfile?.city || '',
    state: riderProfile?.state || '',
    area: riderProfile?.area || '',
    pincode: riderProfile?.pincode || '',
    preferredWorkingZone: riderProfile?.preferredWorkingZone || '',
    emergencyName: riderProfile?.emergencyContact?.name || '',
    emergencyRel: riderProfile?.emergencyContact?.relationship || '',
    emergencyPhone: riderProfile?.emergencyContact?.phone || ''
  });

  const handleSave = async () => {
    await updateProfile({
      fullName: editForm.fullName,
      email: editForm.email,
      city: editForm.city,
      state: editForm.state,
      area: editForm.area,
      pincode: editForm.pincode,
      preferredWorkingZone: editForm.preferredWorkingZone,
      emergencyContact: {
        name: editForm.emergencyName,
        relationship: editForm.emergencyRel,
        phone: editForm.emergencyPhone
      }
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const completion = riderProfile?.profileCompleted || 90;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-400" /> Rider Profile & Account Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your personal details, work profile, and emergency contacts.
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isEditing 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isEditing ? (
            <> <Save className="w-4 h-4" /> Save Profile Changes </>
          ) : (
            <> <Edit3 className="w-4 h-4" /> Edit Profile Details </>
          )}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> Profile changes saved successfully!
        </div>
      )}

      {/* PROFILE COMPLETION METER */}
      <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-xl space-y-2 text-xs">
        <div className="flex justify-between items-center font-bold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Profile Completion Status
          </span>
          <span className="text-cyan-400 font-mono text-sm">{completion}% Complete</span>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400">
          {completion < 100 
            ? 'Tip: Add emergency contact details below to reach 100% profile completion.' 
            : 'Your rider profile is 100% complete and fully verified.'}
        </p>
      </div>

      {/* SECTION 1: PERSONAL INFORMATION */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block mb-1">Full Name</span>
            {isEditing ? (
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            ) : (
              <span className="text-sm font-bold text-white block">{riderProfile?.fullName}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Mobile Number (Primary ID)</span>
            <span className="text-sm font-mono font-bold text-slate-200 block">+91 {riderProfile?.phone}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Email Address</span>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            ) : (
              <span className="text-sm font-mono text-slate-200 block">{riderProfile?.email || 'Not provided'}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Date of Birth & Gender</span>
            <span className="text-sm text-slate-200 block">{riderProfile?.dateOfBirth} ({riderProfile?.gender})</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: WORK INFORMATION */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400" /> Work Profile & Gig Details
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-slate-400 block">Worker Type</span>
            <span className="font-bold text-white block mt-0.5">{riderProfile?.workerType}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Platform / Company</span>
            <span className="font-bold text-cyan-400 block mt-0.5">{riderProfile?.platform}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Vehicle Type</span>
            <span className="font-bold text-slate-200 block mt-0.5">{riderProfile?.vehicleType}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Experience</span>
            <span className="text-slate-200 block mt-0.5">{riderProfile?.experience}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Working Hours / Day</span>
            <span className="text-slate-200 block mt-0.5">{riderProfile?.workingHours}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Daily Income Range</span>
            <span className="text-emerald-400 font-bold block mt-0.5">{riderProfile?.dailyIncomeRange}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: LOCATION DETAILS */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" /> Primary Location & Operating Zone
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block mb-1">City & State</span>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
                <input
                  type="text"
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            ) : (
              <span className="font-bold text-white block">{riderProfile?.city}, {riderProfile?.state}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Working Area / Locality</span>
            {isEditing ? (
              <input
                type="text"
                value={editForm.area}
                onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            ) : (
              <span className="text-slate-200 block">{riderProfile?.area} (Pincode: {riderProfile?.pincode})</span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: EMERGENCY CONTACT */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" /> Optional Emergency Contact
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">SAFETY SUPPORT ONLY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-slate-400 block mb-1">Contact Name</span>
            {isEditing ? (
              <input
                type="text"
                value={editForm.emergencyName}
                onChange={(e) => setEditForm({ ...editForm, emergencyName: e.target.value })}
                placeholder="e.g. Sunita Kumar"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            ) : (
              <span className="font-bold text-white block">{riderProfile?.emergencyContact?.name || 'Not added'}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Relationship</span>
            {isEditing ? (
              <input
                type="text"
                value={editForm.emergencyRel}
                onChange={(e) => setEditForm({ ...editForm, emergencyRel: e.target.value })}
                placeholder="e.g. Spouse / Parent"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            ) : (
              <span className="text-slate-200 block">{riderProfile?.emergencyContact?.relationship || '—'}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Contact Phone</span>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.emergencyPhone}
                onChange={(e) => setEditForm({ ...editForm, emergencyPhone: e.target.value })}
                placeholder="9876543211"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            ) : (
              <span className="font-mono text-slate-200 block">{riderProfile?.emergencyContact?.phone || '—'}</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
