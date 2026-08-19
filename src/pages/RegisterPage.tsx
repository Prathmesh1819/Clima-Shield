import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Mail, Calendar, ShieldCheck, CheckCircle2, 
  ArrowRight, ArrowLeft, Briefcase, MapPin, KeyRound, AlertCircle, 
  Sparkles, Check, Info, Lock, Eye, EyeOff, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WorkerType, PlatformCompany, VehicleType, WorkExperience, WorkingHoursPerDay, DailyIncomeRange } from '../types/rider';

export const RegisterPage: React.FC = () => {
  const { registerRider } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<{ riderId: string; name: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other' | 'Prefer not to say',
    otp: '',
    otpSent: false,
    otpVerified: false,

    // Step 2
    workerType: 'Delivery Rider' as WorkerType,
    platform: 'Swiggy' as PlatformCompany,
    vehicleType: 'Motorcycle' as VehicleType,
    experience: '2–5 years' as WorkExperience,
    workingHours: '8–10 hours' as WorkingHoursPerDay,
    dailyIncomeRange: '₹800–₹1,200' as DailyIncomeRange,

    // Step 3
    city: 'Bengaluru',
    state: 'Karnataka',
    area: 'Indiranagar Zone Z-1',
    pincode: '560038',
    preferredWorkingZone: 'Indiranagar 100ft Rd',
    locationConsent: true,
    latitude: 12.9784,
    longitude: 77.6408,

    // Step 4
    password: '',
    confirmPassword: '',
    termsAgreed: false,
    dataConsentAgreed: false
  });

  const [showPassword, setShowPassword] = useState(false);

  // Input Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrorMsg('');
  };

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-800' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3 || score === 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  // Step Validation logic
  const validateStep = (currentStep: number): boolean => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.length < 2) {
        setErrorMsg('Please enter your full name (minimum 2 characters).');
        return false;
      }
      const phoneClean = formData.phone.replace(/\D/g, '');
      if (phoneClean.length !== 10 || !/^[6-9]\d{9}$/.test(phoneClean)) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
        return false;
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setErrorMsg('Please enter a valid email address.');
        return false;
      }
      if (!formData.dateOfBirth) {
        setErrorMsg('Please select your date of birth.');
        return false;
      }
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18 || age > 75) {
        setErrorMsg('You must be at least 18 years old to register as a ClimaShield rider.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.workerType || !formData.platform || !formData.vehicleType) {
        setErrorMsg('Please select your worker type, platform, and vehicle type.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!formData.city.trim()) {
        setErrorMsg('Please enter your primary working city.');
        return false;
      }
      if (!formData.state.trim()) {
        setErrorMsg('Please enter your state.');
        return false;
      }
      if (!formData.area.trim()) {
        setErrorMsg('Please enter your working area/locality.');
        return false;
      }
      if (!/^\d{6}$/.test(formData.pincode)) {
        setErrorMsg('Please enter a valid 6-digit pincode.');
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (formData.password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return false;
      }
      if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        setErrorMsg('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return false;
      }
      if (!formData.termsAgreed) {
        setErrorMsg('You must agree to ClimaShield Terms & Conditions and Privacy Policy.');
        return false;
      }
      if (!formData.dataConsentAgreed) {
        setErrorMsg('You must consent to data usage for parametric protection management.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
  };

  // Browser Geolocation Trigger
  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            locationConsent: true
          }));
          setErrorMsg('');
          alert(`Location captured successfully! Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          setErrorMsg('Browser location permission denied. You can proceed with manual location details.');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser.');
    }
  };

  // Send Simulated OTP
  const handleSendOtp = () => {
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setFormData(prev => ({ ...prev, otpSent: true }));
    alert(`[Demo Mode] OTP sent to +91 ${phoneClean}: 884920`);
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '884920' || formData.otp.length === 6) {
      setFormData(prev => ({ ...prev, otpVerified: true }));
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid OTP code. Use demo code: 884920');
    }
  };

  // Final Registration Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await registerRider(
        {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          workerType: formData.workerType,
          platform: formData.platform,
          vehicleType: formData.vehicleType,
          experience: formData.experience,
          workingHours: formData.workingHours,
          dailyIncomeRange: formData.dailyIncomeRange,
          city: formData.city.trim(),
          state: formData.state.trim(),
          area: formData.area.trim(),
          pincode: formData.pincode.trim(),
          preferredWorkingZone: formData.preferredWorkingZone,
          locationConsent: formData.locationConsent,
          latitude: formData.latitude,
          longitude: formData.longitude,
          planId: 'PLAN-GOLD-300',
          protectionStatus: 'ACTIVE',
          role: 'rider'
        },
        formData.password
      );

      if (res.success && res.riderId) {
        setSuccessData({
          riderId: res.riderId,
          name: formData.fullName.split(' ')[0]
        });
      } else {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passStrength = getPasswordStrength(formData.password);

  // SUCCESS PAGE VIEW
  if (successData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl shadow-emerald-950/60 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/30 animate-pulse">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Welcome to ClimaShield, {successData.name}! 🎉
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Your rider profile has been created & parametric wage protection is active.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-left space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 font-sans">Unique Rider ID:</span>
              <span className="font-extrabold text-cyan-400 text-sm bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                {successData.riderId}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Registered Mobile:</span>
              <span>+91 {formData.phone}</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Worker Category:</span>
              <span>{formData.workerType}</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400 font-sans">Primary City:</span>
              <span>{formData.city}, {formData.state}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-sans">Protection Status:</span>
              <span className="text-emerald-400 font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE (GOLD SHIELD)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Go to Rider Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/dashboard/profile')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              View My Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/20">
              Gig Partner Protection Onboarding
            </span>
            <h1 className="text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              Register as a Rider <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </h1>
            <p className="text-xs text-slate-400">
              Parametric wage loss compensation during extreme weather events.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Already registered?</span>
            <Link to="/login" className="text-xs font-bold text-cyan-400 hover:underline">
              Login to Account →
            </Link>
          </div>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300">Step {step} of 4</span>
            <span className="text-cyan-400 font-mono">
              {step === 1 && 'Personal Details'}
              {step === 2 && 'Work Details'}
              {step === 3 && 'Location & Risk Profile'}
              {step === 4 && 'Account Credentials'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Step Dots */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-500 pt-1">
            <span className={step >= 1 ? 'text-cyan-400' : ''}>1. Personal</span>
            <span className={step >= 2 ? 'text-cyan-400' : ''}>2. Work</span>
            <span className={step >= 3 ? 'text-cyan-400' : ''}>3. Location</span>
            <span className={step >= 4 ? 'text-cyan-400' : ''}>4. Account</span>
          </div>
        </div>

        {/* ERROR DISPLAY BANNER */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP FORM CONTENT */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> Personal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {/* Mobile Number & OTP UI */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>Mobile Number <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">10-digit Indian Mobile</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
                      +91
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                    >
                      {formData.otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>

                  {/* OTP Verification Sub-block */}
                  {formData.otpSent && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[11px] text-slate-400 block">
                        Enter OTP sent to +91 {formData.phone} (Demo Code: <strong className="text-cyan-400 font-mono">884920</strong>)
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          name="otp"
                          value={formData.otp}
                          onChange={handleChange}
                          placeholder="884920"
                          className="w-32 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs text-center"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                        >
                          {formData.otpVerified ? 'Verified ✓' : 'Verify OTP'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Email Address <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rider@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Gender <span className="text-slate-500">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData(prev => ({ ...prev, gender: g as any }))}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                          formData.gender === g
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: WORK DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" /> Tell us about your work
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  This helps ClimaShield understand your work profile and calculate relevant protection options.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Worker Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Worker Type <span className="text-rose-400">*</span></label>
                  <select
                    name="workerType"
                    value={formData.workerType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Delivery Rider">Delivery Rider</option>
                    <option value="Auto Driver">Auto Driver</option>
                    <option value="Cab Driver">Cab Driver</option>
                    <option value="Food Delivery Partner">Food Delivery Partner</option>
                    <option value="E-commerce Delivery Partner">E-commerce Delivery Partner</option>
                    <option value="Other Gig Worker">Other Gig Worker</option>
                  </select>
                </div>

                {/* Platform / Company */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Platform / Company <span className="text-rose-400">*</span></label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Swiggy">Swiggy</option>
                    <option value="Zomato">Zomato</option>
                    <option value="Zepto">Zepto</option>
                    <option value="Blinkit">Blinkit</option>
                    <option value="Uber">Uber</option>
                    <option value="Ola">Ola</option>
                    <option value="Rapido">Rapido</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Other">Other Independent</option>
                  </select>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Vehicle Type <span className="text-rose-400">*</span></label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                    <option value="Car">Car</option>
                    <option value="Other">Other / On Foot</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Work Experience</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1–2 years">1–2 years</option>
                    <option value="2–5 years">2–5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                {/* Working Hours */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Average Daily Hours</label>
                  <select
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Less than 4 hours">Less than 4 hours</option>
                    <option value="4–6 hours">4–6 hours</option>
                    <option value="6–8 hours">6–8 hours</option>
                    <option value="8–10 hours">8–10 hours</option>
                    <option value="More than 10 hours">More than 10 hours</option>
                  </select>
                </div>

                {/* Daily Income Range */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Average Daily Income</label>
                  <select
                    name="dailyIncomeRange"
                    value={formData.dailyIncomeRange}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Below ₹500">Below ₹500</option>
                    <option value="₹500–₹800">₹500–₹800</option>
                    <option value="₹800–₹1,200">₹800–₹1,200</option>
                    <option value="₹1,200–₹1,500">₹1,200–₹1,500</option>
                    <option value="Above ₹1,500">Above ₹1,500</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  ClimaShield is an independent parametric wage-loss platform. Selection of gig platforms helps calibrate micro-climate risk triggers and does not imply official partnership.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & RISK PROFILE */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Where do you work?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your location helps ClimaShield monitor weather conditions in your working area and determine parametric triggers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* City */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">City <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Pune / Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">State <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra / Karnataka"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Area / Locality */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Primary Working Area / Locality <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar / Kothrud"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Pincode <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    maxLength={6}
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="560038"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Preferred Working Zone */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-300">Preferred Operating Hub / Corridor <span className="text-slate-500">(Optional)</span></label>
                  <input
                    type="text"
                    name="preferredWorkingZone"
                    value={formData.preferredWorkingZone}
                    onChange={handleChange}
                    placeholder="e.g. Indiranagar 100ft Rd to MG Road Hub"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Geolocation Permission Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-cyan-400" /> Automatic Geofence Location Access
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    OPT-IN ONLY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Allow ClimaShield to access browser geolocation to pinpoint your active weather zone when starting shift duty. We store only minimum required coordinates and never track you continuously.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs transition-all flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Allow Location Access
                  </button>
                  <span className="text-xs text-slate-500 self-center">or proceed with manual pincode</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACCOUNT SETUP */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" /> Account Security Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Password */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Create Password <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Confirm Password <span className="text-rose-400">*</span></label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${
                      passStrength.label === 'Strong' ? 'text-emerald-400' : passStrength.label === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {passStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map(idx => (
                      <div
                        key={idx}
                        className={`h-full flex-1 transition-all ${
                          idx <= passStrength.score ? passStrength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Consent Checkboxes */}
              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="mt-0.5 rounded bg-slate-950 border-slate-800 accent-cyan-500 w-4 h-4"
                  />
                  <span>
                    I agree to ClimaShield's{' '}
                    <Link to="/terms" className="text-cyan-400 hover:underline font-semibold" target="_blank">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-cyan-400 hover:underline font-semibold" target="_blank">
                      Privacy Policy
                    </Link>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dataConsentAgreed"
                    checked={formData.dataConsentAgreed}
                    onChange={handleChange}
                    className="mt-0.5 rounded bg-slate-950 border-slate-800 accent-cyan-500 w-4 h-4"
                  />
                  <span>
                    I consent to ClimaShield using my submitted work and location profile to calculate and disburse parametric wage protection claims.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP CONTROLS / NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Your ClimaShield Account...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Complete Rider Registration</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
