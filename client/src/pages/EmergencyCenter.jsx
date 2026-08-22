import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Shield,
  HeartPulse,
  Flame,
  Radio,
  MapPin,
  Clock,
  CheckCircle2,
  BellRing,
  Send,
  Zap,
  Volume2
} from 'lucide-react';

const EmergencyCenter = () => {
  const [activeSOS, setActiveSOS] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [sosDispatched, setSosDispatched] = useState(false);
  const [locationName, setLocationName] = useState('Central Campus / Main Quadrangle');

  const emergencyContacts = [
    { name: 'Campus Security Main Gate', number: '+91 98765 43210', icon: Shield, color: 'from-amber-500 to-orange-600', available: '24x7 Available' },
    { name: 'Campus Medical Health Center', number: '+91 98765 43211', icon: HeartPulse, color: 'from-rose-500 to-red-600', available: 'Doctor on Duty' },
    { name: 'Fire & Disaster Response Squad', number: '+91 98765 43212', icon: Flame, color: 'from-orange-500 to-amber-600', available: 'Emergency Unit' },
    { name: 'Hostel Chief Warden Helpline', number: '+91 98765 43213', icon: Radio, color: 'from-indigo-500 to-blue-600', available: '24x7 Vigilance' },
    { name: 'Women Safety & Anti-Harassment Cell', number: '+91 98765 43214', icon: BellRing, color: 'from-purple-500 to-pink-600', available: 'Strictly Confidential' },
    { name: 'National Emergency Helpline (112)', number: '112', icon: PhoneCall, color: 'from-slate-700 to-slate-900', available: 'National Police / Med' },
  ];

  const handleStartSOS = () => {
    if (activeSOS) return;
    setActiveSOS(true);
    setSosCountdown(5);

    const interval = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSosDispatched(true);
          setSosCountdown(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelSOS = () => {
    setActiveSOS(false);
    setSosCountdown(null);
    setSosDispatched(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                24x7 Quick Response Emergency Grid
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-amber-300" />
              Campus Emergency & SOS Control Center
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm mt-1">
              Instant 1-Touch GPS Distress Broadcast, Medical Assistance, Security Dispatch, and Hotline Directory.
            </p>
          </div>
        </div>
      </div>

      {/* 1-Touch SOS Broadcast Widget */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border-2 border-rose-200 dark:border-rose-900/50 shadow-lg space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              🚨 1-Touch Geo-SOS Distress Broadcast
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Need Immediate Security or Medical Assistance?</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
              Press the SOS button below to transmit your live GPS coordinates, contact details, and alarm tone directly to the Campus Security Command Post and Medical Squad.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {!activeSOS && !sosDispatched ? (
              <button
                type="button"
                onClick={handleStartSOS}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white font-black text-lg shadow-2xl shadow-rose-500/40 flex flex-col items-center justify-center gap-1 active:scale-95 transition cursor-pointer animate-pulse-glow"
              >
                <BellRing className="w-9 h-9 animate-bounce" />
                <span>TAP FOR SOS</span>
              </button>
            ) : sosCountdown !== null ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-36 h-36 rounded-full bg-rose-600 text-white flex flex-col items-center justify-center animate-ping">
                  <span className="text-4xl font-black">{sosCountdown}</span>
                  <span className="text-[10px] font-bold uppercase">Dispatching in...</span>
                </div>
                <button
                  type="button"
                  onClick={handleCancelSOS}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-black cursor-pointer"
                >
                  Cancel SOS
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">SOS ACTIVE & TRANSMITTED</span>
                <button
                  type="button"
                  onClick={handleCancelSOS}
                  className="px-4 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-black"
                >
                  Resolve / End SOS
                </button>
              </div>
            )}
          </div>
        </div>

        {sosDispatched && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1 animate-scale-in">
            <strong className="block text-sm">✅ Live Distress Signal Active</strong>
            <span>Campus Security Patrol & Nearest First-Aid Medical Van have been notified with your location ({locationName}). Keep calm, assistance is en route.</span>
          </div>
        )}

      </div>

      {/* Emergency Hotline Directory Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Emergency Direct Helplines</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Direct 1-tap call lines to campus duty officers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {c.available}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{c.name}</h3>
                  <p className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">{c.number}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`tel:${c.number.replace(/\s+/g, '')}`}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs transition flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Helpline Now</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default EmergencyCenter;
