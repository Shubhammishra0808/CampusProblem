import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  QrCode,
  Sparkles,
  Building,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Wrench,
  Tv,
  Droplets,
  Wifi,
  Fan
} from 'lucide-react';
import api from '../services/api';

const QRReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [equipmentCodeInput, setEquipmentCodeInput] = useState('');
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [customNote, setCustomNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Sample quick scan presets
  const samplePresets = [
    { code: 'C204-PR01', name: 'Classroom Projector (C204)', icon: Tv, location: 'Academic Block C - 2nd Floor' },
    { code: 'LAB102-AC02', name: 'Computer Lab AC (Lab 102)', icon: Zap, location: 'Academic Block A - 1st Floor' },
    { code: 'BH1-F2-WC01', name: 'Hostel RO Water Cooler', icon: Droplets, location: 'Boys Hostel 1 - 2nd Floor' },
    { code: 'LIB-AP04', name: 'Library Wi-Fi 6 AP', icon: Wifi, location: 'Central Library - 1st Floor' },
    { code: 'A101-FAN03', name: 'Ceiling Fan (Lecture 101)', icon: Fan, location: 'Academic Block A - Ground' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get('code') || params.get('qr');
    if (codeParam) {
      setEquipmentCodeInput(codeParam);
      fetchEquipmentDetails(codeParam);
    } else {
      // Default load first preset
      fetchEquipmentDetails('C204-PR01');
    }
  }, [location.search]);

  const fetchEquipmentDetails = async (code) => {
    if (!code) return;
    setLoading(true);
    setError('');
    setSubmittedTicket(null);
    setSelectedIssue(null);
    try {
      const res = await api.get(`/equipment/qr/${code.trim()}`);
      if (res.data.success) {
        setEquipment(res.data.equipment);
        setEquipmentCodeInput(code.toUpperCase().trim());
      }
    } catch (err) {
      setError(err.response?.data?.message || `Equipment #${code} not registered in campus inventory.`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (equipmentCodeInput.trim()) {
      fetchEquipmentDetails(equipmentCodeInput.trim());
    }
  };

  const handleReportSubmit = async () => {
    if (!selectedIssue && !customNote.trim()) {
      setError('Please select an issue or type a problem description.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/equipment/quick-report', {
        equipmentCode: equipment?.equipmentCode || equipmentCodeInput,
        issueLabel: selectedIssue?.label || 'Custom QR Defect',
        issueType: selectedIssue?.issueType || 'General Defect',
        priority: selectedIssue?.suggestedPriority || 'High',
        customNote: customNote.trim()
      });

      if (res.data.success) {
        setSubmittedTicket(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit QR grievance.');
    } finally {
      setSubmitting(false);
    }
  };

  const getHealthBadge = (healthScore, riskLevel) => {
    if (riskLevel === 'Critical' || healthScore < 40) {
      return {
        badge: 'Critical Replacement Risk',
        color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800'
      };
    }
    if (riskLevel === 'At Risk' || healthScore < 80) {
      return {
        badge: 'At Risk (Maintenance Due)',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800'
      };
    }
    return {
      badge: 'Healthy Operational',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <QrCode className="w-64 h-64" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Smart QR Asset Diagnostics
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            1-Tap QR Infrastructure Problem Reporting
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Scan or select any classroom, lab, or hostel equipment QR code. CampusFix automatically detects the building, floor, and equipment details. Zero manual typing required!
          </p>
        </div>
      </div>

      {/* QR Code Selector & Quick Presets */}
      <div className="bg-white dark:bg-[#151e32] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-600" />
              Scan QR Code or Select Asset Preset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter QR code from the physical asset sticker or test with demo campus equipment.</p>
          </div>
        </div>

        <form onSubmit={handleManualSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={equipmentCodeInput}
              onChange={e => setEquipmentCodeInput(e.target.value)}
              placeholder="e.g. C204-PR01, LAB102-AC02..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Lookup QR'}
          </button>
        </form>

        {/* Quick Demo Preset Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
            Demo Campus Assets (Tap to Scan):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {samplePresets.map(preset => {
              const Icon = preset.icon;
              const isSelected = equipment?.equipmentCode === preset.code;
              return (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => fetchEquipmentDetails(preset.code)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black truncate">{preset.name}</p>
                    <span className="text-[10px] text-slate-400 block truncate">{preset.code} • {preset.location}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Auto-Detected Equipment Details Card */}
      {equipment && (
        <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-scale-in">
          
          {/* Equipment Info Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-brand-600 dark:text-brand-400 text-xs px-2.5 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800">
                  QR Tag: #{equipment.equipmentCode}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border uppercase ${getHealthBadge(equipment.healthScore, equipment.riskLevel).color}`}>
                  {getHealthBadge(equipment.healthScore, equipment.riskLevel).badge}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{equipment.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">{equipment.building}</span> • {equipment.floor} • <span className="font-extrabold text-slate-800 dark:text-slate-200">{equipment.roomNumber}</span>
              </p>
            </div>

            <div className="text-right p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 self-stretch sm:self-auto">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Equipment Health</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{equipment.healthScore || 85}%</span>
              <span className="text-[10px] text-slate-400 block">{equipment.operatingHours || 1200}h logged</span>
            </div>
          </div>

          {/* 1-Tap Problem Select Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Select Common Issue (1-Tap Fast Reporting):
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">Tap to select</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(equipment.quickIssues || [
                { label: 'Not working / No power', issueType: 'Power Failure', suggestedPriority: 'High' },
                { label: 'Display problem / Color flicker', issueType: 'Optical Lamp Burnout', suggestedPriority: 'High' },
                { label: 'Sound problem / Buzzing audio', issueType: 'Speaker Fault', suggestedPriority: 'Medium' },
                { label: 'Remote missing / Broken cables', issueType: 'Missing Accessories', suggestedPriority: 'Low' },
                { label: 'Other hardware issue', issueType: 'General Defect', suggestedPriority: 'Medium' }
              ]).map((issue, idx) => {
                const isSelected = selectedIssue?.label === issue.label;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIssue(issue)}
                    className={`p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 font-black'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-400 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-white border-white' : 'border-slate-400'}`}></div>
                      <div>
                        <p className="text-xs sm:text-sm">{issue.label}</p>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                          Type: {issue.issueType} • Priority: {issue.suggestedPriority}
                        </span>
                      </div>
                    </div>

                    <CheckCircle2 className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-transparent'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Additional Details / Remarks (Optional):
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              placeholder="e.g. HDMI port is loose, student presentation starts in 30 mins..."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              ⚡ Auto-dispatches to <span className="font-extrabold text-slate-900 dark:text-white">{equipment.department || 'Maintenance Wing'}</span>
            </div>

            <button
              onClick={handleReportSubmit}
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Generating Grievance Ticket...' : 'Submit 1-Tap QR Report'}</span>
            </button>
          </div>

        </div>
      )}

      {/* Instant Ticket Success Modal / Result */}
      {submittedTicket && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 text-white shadow-2xl space-y-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                Ticket Dispatched Successfully
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Ticket #{submittedTicket.ticketId} Registered
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your grievance for <span className="font-bold text-white">{equipment?.name}</span> at <span className="font-bold text-white">{equipment?.building}, {equipment?.roomNumber}</span> has been broadcast to technicians.
          </p>

          {submittedTicket.assignmentRecommendation && (
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1 text-xs">
              <span className="text-[10px] font-black uppercase text-amber-300">Smart AI Dispatch Recommendation:</span>
              <p className="font-black text-white">
                {submittedTicket.assignmentRecommendation.recommendedTeam || 'Specialized Technical Unit'}
              </p>
              <p className="text-[11px] text-slate-300">
                {submittedTicket.assignmentRecommendation.rationale}
              </p>
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={`/complaints/${submittedTicket.complaint?._id}`}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition inline-flex items-center gap-1.5"
            >
              <span>View Full Ticket & Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/student"
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition inline-flex items-center gap-1.5"
            >
              <span>Return to Student Home</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default QRReport;
