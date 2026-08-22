import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ShieldAlert,
  Info,
  ArrowRight,
  QrCode,
  Bot,
  Building,
  MapPin,
  Send,
  Lock,
  Mic,
  MicOff,
  ShieldCheck,
  Zap
} from 'lucide-react';
import AIProblemDetector from '../components/AIProblemDetector';

const NewComplaint = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electrical',
    building: 'Academic Block C',
    roomNumber: '',
    locationDetails: '',
    priority: 'Medium',
    isAnonymous: false
  });

  const [file, setFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [showAIDetector, setShowAIDetector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Check if routed from AI Assistant or QR Scanner with pre-filled state
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        title: location.state.prefillTitle || prev.title,
        category: location.state.prefillCategory || prev.category,
        priority: location.state.prefillPriority || prev.priority,
        building: location.state.prefillBuilding || prev.building,
        roomNumber: location.state.prefillRoom || prev.roomNumber,
        description: location.state.prefillDescription || prev.description
      }));
    }
  }, [location.state]);

  const categories = [
    'Electrical',
    'Water',
    'Internet/Wi-Fi',
    'Classroom',
    'Laboratory',
    'Hostel',
    'Canteen',
    'Transport',
    'Cleanliness',
    'Security',
    'Furniture',
    'Other'
  ];

  const buildings = [
    'Academic Block A',
    'Academic Block B',
    'Academic Block C',
    'Science Block & Labs',
    'Central Library',
    'Boys Hostel 1',
    'Boys Hostel 2',
    'Girls Hostel',
    'Central Canteen',
    'Admin Block'
  ];

  const handleApplyAIDiagnosis = (diag) => {
    setFormData(prev => ({
      ...prev,
      title: prev.title || `${diag.problem} (${diag.affectedEquipment})`,
      category: diag.category || prev.category,
      priority: diag.recommendedPriority || prev.priority,
      description: prev.description
        ? `${prev.description}\n\n[AI Detection Result]: Equipment: ${diag.affectedEquipment} | Problem: ${diag.problem} | Dept: ${diag.recommendedDepartment}`
        : `Affected Equipment: ${diag.affectedEquipment}\nProblem Diagnosed: ${diag.problem}\nRecommended Department: ${diag.recommendedDepartment}\nSeverity: ${diag.severity}`
    }));
    setShowAIDetector(false);
  };

  const handlePhotoSelect = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(f);
    }
  };

  // Voice Note Speech-to-Text Feature
  const handleToggleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          description: prev.description ? `${prev.description} ${transcript}` : transcript
        }));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.building || !formData.roomNumber) {
      setError('Please fill in all required fields (title, description, building, room number).');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('building', formData.building);
      data.append('roomNumber', formData.roomNumber);
      data.append('locationDetails', formData.locationDetails);
      data.append('priority', formData.priority);
      data.append('isAnonymous', formData.isAnonymous);
      if (file) data.append('photo', file);

      const res = await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSubmittedTicket(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                Confidential & Encrypted Grievance Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Report Campus Infrastructure Grievance
            </h1>
            <p className="text-brand-100 text-xs sm:text-sm mt-1">
              Your grievance is secure and accessible exclusively to the Campus Administration and assigned technician.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              to="/qr-report"
              className="px-4 py-2.5 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-black text-xs transition flex items-center gap-2 shadow-md"
            >
              <QrCode className="w-4 h-4 text-brand-600" />
              <span>1-Tap QR Scan</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowAIDetector(!showAIDetector)}
              className="px-4 py-2.5 rounded-2xl bg-purple-500/40 hover:bg-purple-500/60 text-white border border-purple-300/40 font-black text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{showAIDetector ? 'Hide AI Helper' : 'AI Helper'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Guarantee Ribbon */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Privacy Guaranteed:</strong> Other students cannot see or browse this grievance. Only Dean, Administration, and your assigned maintenance technician can track progress.
        </span>
      </div>

      {/* Embedded Multimodal AI Problem Detector */}
      {showAIDetector && (
        <AIProblemDetector
          onApplyDiagnosis={handleApplyAIDiagnosis}
          initialText={formData.description}
        />
      )}

      {/* Main Complaint Form */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
              Complaint Summary / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Projector in Room C-204 not turning on / High pressure pipe burst"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Severity / Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Low">Low Priority (General Maintenance)</option>
                <option value="Medium">Medium Priority (Standard Fix)</option>
                <option value="High">High Priority (Urgent Attention)</option>
                <option value="Emergency">Emergency (Immediate Safety Hazard)</option>
              </select>
            </div>
          </div>

          {/* Building & Room Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Campus Building / Zone <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.building}
                onChange={e => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {buildings.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Room Number / Specific Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.roomNumber}
                onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. Room 204 / 2nd Floor Corridor / Lab 3"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Description + Voice Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleToggleVoiceRecord}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'}`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-brand-600" />}
                <span>{isRecording ? 'Listening... (Speak now)' : 'Voice Input (Speech to Text)'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the exact problem, symptoms, and any affected students or classes..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            ></textarea>
          </div>

          {/* Photo Attachment */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
              Attach Evidence Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer transition flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                <Upload className="w-4 h-4" />
                <span>{file ? file.name : 'Choose Photo (PNG, JPG)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500 shadow"
                />
              )}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAnon"
              checked={formData.isAnonymous}
              onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isAnon" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Submit Anonymously (Hide my name & roll number from public tracking)
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Grievance...' : 'Submit Grievance Ticket'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* Ticket Success Result */}
      {submittedTicket && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 text-white shadow-2xl space-y-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                Grievance Registered Privately
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Ticket #{submittedTicket.complaint?.ticketId} Dispatched
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Your complaint <span className="font-bold text-white">"{submittedTicket.complaint?.title}"</span> has been logged and queued for technician response.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={`/complaints/${submittedTicket.complaint?._id}`}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition inline-flex items-center gap-1.5"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/student"
              className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition inline-flex items-center gap-1.5"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewComplaint;
