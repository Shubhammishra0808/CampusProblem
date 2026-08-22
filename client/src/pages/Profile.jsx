import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  Save,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  QrCode,
  MapPin,
  Calendar,
  Lock,
  Zap,
  Camera,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Trophy,
  Award,
  Flame,
  Activity,
  CreditCard,
  RotateCw,
  Share2
} from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    hostelBlock: user?.hostelBlock || '',
    roomNumber: user?.roomNumber || '',
    officeLocation: user?.officeLocation || '',
    consultationHours: user?.consultationHours || ''
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef(null);

  // Preset avatars for instant picking
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  ];

  // Badges Earned List
  const userBadges = [
    { title: 'Campus Sentinel', icon: ShieldCheck, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'Reported 5+ verified hazards' },
    { title: 'Civic Karma Pioneer', icon: Trophy, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', desc: 'Achieved Level 3 Guardian status' },
    { title: 'Fast Verifier', icon: Zap, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', desc: 'Resolved verification in <10 mins' },
    { title: 'Academic Star', icon: Award, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', desc: 'Maintained >85% attendance' }
  ];

  // Activity contribution matrix generation
  const activityDays = Array.from({ length: 52 * 7 }, (_, i) => {
    const intensity = (i % 7 === 1 || i % 11 === 0 || i % 19 === 0 || i % 29 === 0) ? Math.floor(Math.random() * 4) + 1 : 0;
    return intensity;
  });

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP, GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Maximum allowed size is 10 MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    setUploadingPhoto(true);
    setError('');
    setMessage('');

    try {
      const data = new FormData();
      data.append('avatar', selectedFile);

      const res = await api.post('/auth/upload-avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        updateUserProfile(res.data.user);
        setSelectedFile(null);
        setPreviewUrl(res.data.user.avatar || res.data.avatar);
        setMessage('🎉 Profile photo uploaded and updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSelectPreset = async url => {
    setUploadingPhoto(true);
    setError('');
    setMessage('');

    try {
      const res = await api.put('/auth/profile', { avatar: url });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setSelectedFile(null);
        setPreviewUrl(url);
        setMessage('Profile avatar updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update avatar.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
    setUploadingPhoto(true);
    setError('');
    setMessage('');

    try {
      const res = await api.put('/auth/profile', { avatar: '' });
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setSelectedFile(null);
        setPreviewUrl('');
        setMessage('Profile photo removed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data.success) {
        updateUserProfile(res.data.user);
        setMessage('Your profile and contact details have been updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const roleGradients = {
    student: 'from-blue-600 via-indigo-600 to-purple-600',
    faculty: 'from-emerald-600 via-teal-600 to-cyan-700',
    hod: 'from-amber-600 via-orange-600 to-rose-700',
    staff: 'from-purple-600 via-indigo-600 to-slate-800',
    teammember: 'from-purple-700 via-indigo-700 to-brand-700',
    admin: 'from-rose-600 via-red-600 to-indigo-800'
  };

  const displayAvatar = previewUrl || user?.avatar;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* DIGITAL CAMPUS SMART ID CARD (FLIPPABLE) */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-brand-400" /> Official Campus Digital Identity
          </span>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Show Front Pass' : 'Flip to Security Clearance'}</span>
          </button>
        </div>

        {!isFlipped ? (
          <div className={`relative bg-gradient-to-r ${roleGradients[user?.role] || 'from-brand-600 to-indigo-600'} rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden animate-scale-in`}>
            <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
              <ShieldCheck className="w-80 h-80" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                
                {/* ID Card Avatar with Camera Upload Quick Badge */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Click to upload profile photo">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl overflow-hidden relative">
                    {displayAvatar ? (
                      <img
                        src={displayAvatar}
                        alt={user?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span>Upload</span>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white absolute -bottom-1 -right-1 flex items-center justify-center shadow">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Digital Campus ID • Active
                  </span>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                    {user?.name}
                  </h1>

                  <p className="text-white/90 text-xs sm:text-sm font-semibold mt-1">
                    {user?.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/20 text-white text-[11px] font-black uppercase tracking-wider">
                      Role: {user?.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/20 text-white text-[11px] font-bold">
                      {user?.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Mini Card */}
              <div className="p-3.5 rounded-2xl bg-white text-slate-900 shadow-xl flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-start">
                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-brand-600 font-bold border border-slate-200">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="text-left pr-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Campus Pass</span>
                  <p className="text-xs font-black text-slate-900">#CFX-{user?.rollNumber || user?.employeeId || '2026-REG'}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Authorized Verified</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Back of ID Card (Security Credentials) */
          <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-500/30 overflow-hidden animate-scale-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🔒 Campus Security Clearance Level 3
                </span>
                <h3 className="text-xl font-black text-white">Biometric &amp; Access Permissions</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Valid for 24/7 Smart Lab Entry, Central Computing Facility, Hostel Gate RFID &amp; Campus Shuttle Transport.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">RFID: <strong>04:A2:8B:19</strong></span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">Issue Date: <strong>Aug 2026</strong></span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">Dean Signature: <strong>Digitally Signed</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-black uppercase text-emerald-300">Verified Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GAMIFIED CIVIC BADGES SHOWCASE */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">Civic Karma Achievements &amp; Badges</h3>
          </div>
          <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
            4 / 4 Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {userBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${badge.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 365-DAY ACTIVITY CONTRIBUTION HEATMAP GRID */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">Campus Problem Resolution Contributions (Last 365 Days)</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">142 Activities logged</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[650px]">
            {activityDays.map((val, idx) => {
              let bg = 'bg-slate-100 dark:bg-slate-800/80';
              if (val === 1) bg = 'bg-emerald-300 dark:bg-emerald-900';
              if (val === 2) bg = 'bg-emerald-400 dark:bg-emerald-700';
              if (val === 3) bg = 'bg-emerald-500 dark:bg-emerald-500';
              if (val === 4) bg = 'bg-emerald-600 dark:bg-emerald-400';
              return (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-xs ${bg} transition-colors hover:scale-125 cursor-pointer`}
                  title={`Day ${idx + 1}: ${val} contributions`}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 font-semibold pt-1">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800"></div>
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300 dark:bg-emerald-900"></div>
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500 dark:bg-emerald-500"></div>
          <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-400"></div>
          <span>More</span>
        </div>
      </div>

      {/* Status Notifications */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 border border-rose-200 dark:border-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ================= PROFILE PHOTO UPLOAD SECTION ================= */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Profile Photo &amp; Avatar</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload your college ID photo or custom profile picture. Supported formats: JPG, PNG, WEBP, GIF (Max 10MB).
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Avatar Preview Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-4xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white dark:border-slate-800">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>

              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md border-2 border-white dark:border-slate-800 transition">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-4">{user?.name}</p>
            <span className="text-[10px] text-slate-400 capitalize">{user?.role} • {user?.department}</span>
          </div>

          {/* Upload Controls */}
          <div className="md:col-span-8 space-y-4">
            
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-brand-500 mx-auto" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  Click here to browse and choose a photo
                </button>
                <p className="text-[11px] text-slate-400">or take a photo from your camera</p>
              </div>

              {selectedFile && (
                <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-200 text-xs font-bold flex items-center justify-between border border-brand-200 dark:border-brand-800">
                  <div className="flex items-center gap-2 truncate">
                    <ImageIcon className="w-4 h-4 flex-shrink-0 text-brand-600" />
                    <span className="truncate">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-600 text-white font-black">Ready to Save</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={uploadingPhoto}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{uploadingPhoto ? 'Saving Photo...' : 'Upload & Save Photo'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{displayAvatar ? 'Change Photo' : 'Select Photo'}</span>
              </button>

              {displayAvatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            {/* Preset Avatars Row */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">Or choose a smart preset avatar:</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(url)}
                    className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-500 focus:border-brand-500 transition shadow-sm cursor-pointer hover:scale-105"
                    title={`Select Avatar ${idx + 1}`}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ================= PROFILE EDIT DETAILS CARD ================= */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Account Information &amp; Contact Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Keep your contact and hostel/office coordinates up to date for fast ticket resolution.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (For SMS / Call)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department / Branch</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hostel Block / Building</label>
              <input
                type="text"
                value={formData.hostelBlock}
                onChange={e => setFormData({ ...formData, hostelBlock: e.target.value })}
                placeholder="e.g. Boys Hostel 1 / Day Scholar"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Room Number / Cabin</label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g. Room 302"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Office Location (For Staff / Faculty)</label>
              <input
                type="text"
                value={formData.officeLocation}
                onChange={e => setFormData({ ...formData, officeLocation: e.target.value })}
                placeholder="e.g. Academic Block A - Room 102"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Consultation / Meeting Hours</label>
              <input
                type="text"
                value={formData.consultationHours}
                onChange={e => setFormData({ ...formData, consultationHours: e.target.value })}
                placeholder="e.g. Mon-Fri 2:00 PM - 4:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Profile;
