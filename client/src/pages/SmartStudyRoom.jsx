import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  BookOpen,
  Headphones,
  Clock,
  Flame,
  CheckCircle2,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  BatteryCharging,
  Wifi,
  Thermometer,
  Shield,
  Layers,
  Search,
  Check,
  QrCode,
  Compass,
  ArrowRight,
  Brain,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

const studyZones = [
  {
    id: 'silent',
    name: 'Zero-Noise Silent Focus Pods',
    wing: 'Library 3rd Floor, West Wing',
    capacity: 24,
    occupied: 18,
    noiseLevel: '28 dB (Whisper Quiet)',
    noiseStatus: 'optimal',
    temp: '22°C',
    wifiSpeed: '980 Mbps',
    desks: Array.from({ length: 24 }, (_, i) => ({
      id: `S-${i + 1}`,
      occupied: [1, 2, 4, 5, 7, 8, 10, 11, 12, 14, 15, 17, 18, 20, 21, 22, 23, 24].includes(i + 1),
      powerSocket: true,
      ergonomicChair: true
    }))
  },
  {
    id: 'collab',
    name: 'Collaborative Group Labs',
    wing: 'Tech Center Block B, Room 204',
    capacity: 16,
    occupied: 9,
    noiseLevel: '52 dB (Discussion Allowed)',
    noiseStatus: 'moderate',
    temp: '23°C',
    wifiSpeed: '850 Mbps',
    desks: Array.from({ length: 16 }, (_, i) => ({
      id: `C-${i + 1}`,
      occupied: [2, 3, 5, 6, 8, 9, 12, 13, 15].includes(i + 1),
      powerSocket: true,
      smartScreen: true
    }))
  },
  {
    id: 'ai-booth',
    name: 'AI Coding & Quantum Pods',
    wing: 'Computer Center, Ground Floor',
    capacity: 12,
    occupied: 7,
    noiseLevel: '34 dB (Deep Coding)',
    noiseStatus: 'optimal',
    temp: '21°C',
    wifiSpeed: '1.2 Gbps',
    desks: Array.from({ length: 12 }, (_, i) => ({
      id: `AI-${i + 1}`,
      occupied: [1, 3, 4, 6, 7, 10, 11].includes(i + 1),
      dualMonitors: true,
      powerSocket: true
    }))
  },
  {
    id: 'night',
    name: '24/7 Late Night Night-Owl Lounge',
    wing: 'Hostel Hub Central Building',
    capacity: 20,
    occupied: 11,
    noiseLevel: '38 dB (Calm)',
    noiseStatus: 'optimal',
    temp: '22.5°C',
    wifiSpeed: '750 Mbps',
    desks: Array.from({ length: 20 }, (_, i) => ({
      id: `N-${i + 1}`,
      occupied: [1, 2, 5, 7, 8, 10, 12, 14, 15, 17, 19].includes(i + 1),
      coffeeAccess: true,
      powerSocket: true
    }))
  }
];

const SmartStudyRoom = () => {
  const { user } = useContext(AuthContext);
  const [selectedZone, setSelectedZone] = useState('silent');
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [bookedDesk, setBookedDesk] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Pomodoro Timer State
  const [pomodoroMode, setPomodoroMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);

  // Ambient Sounds Generator (Web Audio API)
  const [activeAmbient, setActiveAmbient] = useState(null); // 'rain' | 'whitenoise' | 'binaural' | null
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // AI Study Partner Generator state
  const [subjectQuery, setSubjectQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const activeZoneData = studyZones.find(z => z.id === selectedZone);

  // Pomodoro Countdown Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (pomodoroMode === 'work') {
        setCompletedSessions(prev => prev + 1);
        setPomodoroMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setPomodoroMode('work');
        setTimeLeft(25 * 60);
      }
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, pomodoroMode]);

  const toggleTimer = () => setTimerRunning(!timerRunning);

  const resetTimer = (mode = pomodoroMode) => {
    setTimerRunning(false);
    if (mode === 'work') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const handleModeChange = (mode) => {
    setPomodoroMode(mode);
    resetTimer(mode);
  };

  // Format Time Helper
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Synthesized Web Audio Ambient Sound Player
  const toggleAmbientSound = (type) => {
    if (activeAmbient === type) {
      stopAmbientSound();
      setActiveAmbient(null);
      return;
    }

    stopAmbientSound();
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      if (type === 'binaural') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(144, ctx.currentTime); // Alpha Focus frequency
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (type === 'whitenoise') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      } else if (type === 'rain') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
      }

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gainNode;
      setActiveAmbient(type);
    } catch (e) {
      console.log('Audio Context initialization note:', e);
      setActiveAmbient(type);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch (e) {}
    oscillatorRef.current = null;
    audioCtxRef.current = null;
  };

  useEffect(() => {
    return () => stopAmbientSound();
  }, []);

  // Desk Booking Handler
  const handleBookDesk = () => {
    if (!selectedDesk) return;
    setBookedDesk({
      zone: activeZoneData.name,
      deskId: selectedDesk.id,
      wing: activeZoneData.wing,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      code: `POD-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  // AI Study Partner / Flashcard Query
  const handleGenerateStudyGuide = (e) => {
    e.preventDefault();
    if (!subjectQuery.trim()) return;
    setAiGenerating(true);

    setTimeout(() => {
      setAiSuggestions({
        topic: subjectQuery,
        matchedPeers: [
          { name: 'Rohan Sharma', desk: 'S-14', subject: subjectQuery, similarity: '96% Topic Match' },
          { name: 'Ananya Verma', desk: 'AI-03', subject: `${subjectQuery} Projects`, similarity: '91% Topic Match' }
        ],
        aiSummary: `Key high-yield study focus for ${subjectQuery}: Master fundamental theorems, architectural diagrams, complexity analyses, and 3 past year gate/semester examination problems.`,
        flashcards: [
          { q: `What is the core bottleneck in ${subjectQuery}?`, a: 'Resource contention and cache invalidation under high concurrency.' },
          { q: `Best practice for optimal performance in ${subjectQuery}?`, a: 'Implement asynchronous I/O and localized caching.' }
        ]
      });
      setAiGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Smart Campus Quiet Study Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Smart Study Rooms &amp; Virtual Focus Pods
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Live noise telemetry, real-time seat availability, Pomodoro binaural focus timers, and peer study matching across all campus libraries &amp; labs.
          </p>
        </div>

        {/* Live Occupancy Metric */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Campus Pods</span>
            <span className="text-lg font-black text-white">45 / 72 Available</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Zone & Seat Selector (8 Cols) + Right Focus Studio & AI (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT: ZONE SELECTION & INTERACTIVE DESK MATRIX ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Zone Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {studyZones.map(z => {
              const isSelected = selectedZone === z.id;
              const freeSeats = z.capacity - z.occupied;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    setSelectedZone(z.id);
                    setSelectedDesk(null);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-500/15 text-slate-900 dark:text-white shadow-md ring-1 ring-brand-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-black truncate">{z.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span>{freeSeats} Desks Free</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold">{z.noiseLevel.split(' ')[0]} dB</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Zone Detail Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400 tracking-wider">
                  Active Focus Area
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeZoneData.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeZoneData.wing}</p>
              </div>

              {/* Environmental Telemetry Gauges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{activeZoneData.noiseLevel}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                  <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                  <span>{activeZoneData.temp}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                  <Wifi className="w-3.5 h-3.5 text-purple-500" />
                  <span>{activeZoneData.wifiSpeed}</span>
                </span>
              </div>
            </div>

            {/* Interactive Desk Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Select an unoccupied pod to reserve:</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span> Free</span>
                  <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-md bg-slate-300 dark:bg-slate-700"></span> Occupied</span>
                  <span className="flex items-center gap-1 text-[11px]"><span className="w-2.5 h-2.5 rounded-md bg-brand-600"></span> Selected</span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                {activeZoneData.desks.map(desk => {
                  const isSelected = selectedDesk?.id === desk.id;
                  const isOccupied = desk.occupied;

                  return (
                    <button
                      key={desk.id}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setSelectedDesk(desk)}
                      className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                        isOccupied
                          ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-105 font-black ring-2 ring-brand-400'
                          : 'bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 cursor-pointer transform hover:scale-105'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-[11px] font-black">{desk.id}</span>
                      <span className="text-[9px] opacity-75">{isOccupied ? 'Taken' : 'Free'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Action Bar */}
            {selectedDesk && (
              <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scale-in">
                <div>
                  <h4 className="text-xs font-black text-brand-900 dark:text-brand-200">
                    Ready to reserve Desk {selectedDesk.id}?
                  </h4>
                  <p className="text-[11px] text-brand-700 dark:text-brand-300">
                    Includes High-Speed 1Gbps Power Socket &amp; Ergonomic Chair in {activeZoneData.name}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBookDesk}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm 3-Hour Pod Pass</span>
                </button>
              </div>
            )}

            {/* Booking Confirmed Voucher */}
            {bookedDesk && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Pod Pass Active • {bookedDesk.deskId} Reserved</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                    {bookedDesk.code}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Reserved for {user?.name || 'Student'} at {bookedDesk.wing}. Show QR pass at the entrance scanner.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT: POMODORO TIMER & BINAURAL AUDIO ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pomodoro Focus Station */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Pomodoro Focus Timer</h3>
              </div>

              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                Streak: {completedSessions} 🔥
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleModeChange('work')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  pomodoroMode === 'work'
                    ? 'bg-rose-500 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Focus (25m)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('shortBreak')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  pomodoroMode === 'shortBreak'
                    ? 'bg-emerald-500 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Break (5m)
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('longBreak')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  pomodoroMode === 'longBreak'
                    ? 'bg-blue-500 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Rest (15m)
              </button>
            </div>

            {/* Giant Circular Clock Display */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
                {formatTimer(timeLeft)}
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                {pomodoroMode === 'work' ? '🧠 Deep Work Session' : '☕ Relax & Refresh'}
              </span>
            </div>

            {/* Timer Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTimer}
                className={`flex-1 py-3 rounded-2xl text-xs font-black text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Pause Focus' : 'Start Focus Session'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetTimer()}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Ambient Focus Audio Player */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 block">
                🎧 Binaural Focus Soundscapes:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'binaural', label: 'Alpha Wave' },
                  { id: 'whitenoise', label: 'White Noise' },
                  { id: 'rain', label: 'Rain Echo' }
                ].map(snd => (
                  <button
                    key={snd.id}
                    type="button"
                    onClick={() => toggleAmbientSound(snd.id)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                      activeAmbient === snd.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm animate-pulse'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {activeAmbient === snd.id ? <Volume2 className="w-3 h-3" /> : <Headphones className="w-3 h-3" />}
                    <span className="truncate">{snd.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* AI Study Buddy & Flashcard Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">AI Peer Match &amp; Flashcards</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Find peers studying the same course</p>
              </div>
            </div>

            <form onSubmit={handleGenerateStudyGuide} className="flex gap-2">
              <input
                type="text"
                value={subjectQuery}
                onChange={e => setSubjectQuery(e.target.value)}
                placeholder="e.g. Operating Systems / DBMS"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={aiGenerating || !subjectQuery.trim()}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-black transition cursor-pointer"
              >
                {aiGenerating ? 'Matching...' : 'Find'}
              </button>
            </form>

            {aiSuggestions && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-scale-in">
                <div>
                  <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase block">Active Peers Nearby:</span>
                  <div className="space-y-1 mt-1">
                    {aiSuggestions.matchedPeers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        <span>{p.name} ({p.desk})</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{p.similarity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase block">AI Flashcard Tip:</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {aiSuggestions.aiSummary}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SmartStudyRoom;
