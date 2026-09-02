import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  User,
  GraduationCap,
  Users,
  BriefcaseBusiness,
  ShieldCheck,
  Phone,
  KeyRound,
  Sparkles,
  Smartphone,
  Zap,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Building,
  BadgeCheck,
  AlertCircle,
  UserPlus,
  LogIn,
  Bot,
  Activity,
  BarChart3,
  Clock,
  Compass,
  Cpu,
  Flame,
  CheckCircle,
  QrCode,
  CalendarCheck2,
  Wrench,
  FileText,
  Layers,
  ArrowUpRight,
  Check,
  Shield,
  Award,
  Radio,
  Share2,
  ChevronRight,
  ChevronDown,
  Database,
  Server,
  LockKeyhole,
  ExternalLink,
  HelpCircle,
  Menu,
  X,
  MapPin,
  Navigation,
  Palette,
  Eraser,
  Download,
  Trash2,
  Volume2,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Globe,
  SunMedium,
  Wind,
  Droplets,
  Leaf,
  BookOpen,
  Coffee,
  Lightbulb,
  Maximize2
} from 'lucide-react';

const Login = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Top-Level Active Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState('login');
  const [activeShowcaseTab, setActiveShowcaseTab] = useState('ai-sandbox');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Real-Time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Format time components
  const hours = currentTime.getHours();
  const minutes = String(currentTime.getMinutes()).padStart(2, '0');
  const seconds = String(currentTime.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');
  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isDayShift = hours >= 8 && hours < 20;

  // ================= 1. GIS CAMPUS MAP STATE =================
  const [selectedMapWing, setSelectedMapWing] = useState('academic_a');
  const campusWings = [
    {
      id: 'academic_a',
      name: 'Academic Block A',
      type: 'Lecture Halls & Dean Office',
      occupancy: '84%',
      activeTickets: 2,
      wifiSpeed: '890 Mbps',
      noiseLevel: '34 dB',
      solarGen: '64 kW',
      color: 'from-blue-500 to-indigo-600',
      pos: { x: '25%', y: '30%' },
      facilities: ['Smart Classrooms 101-310', 'Faculty Lounges', 'High-Speed Wi-Fi 6', 'RFID Attendance Pods']
    },
    {
      id: 'tech_b',
      name: 'Tech & AI Innovation Labs',
      type: 'Compute & Robotic Labs',
      occupancy: '92%',
      activeTickets: 1,
      wifiSpeed: '1.2 Gbps',
      noiseLevel: '40 dB',
      solarGen: '98 kW',
      color: 'from-purple-500 to-pink-600',
      pos: { x: '65%', y: '25%' },
      facilities: ['AI Supercomputer Cluster', 'Robotics Testing Pit', 'IoT Telemetry Sensors', '3D Prototyping Lab']
    },
    {
      id: 'library',
      name: 'Central Library & Silent Pods',
      type: 'Smart Study Rooms',
      occupancy: '75%',
      activeTickets: 0,
      wifiSpeed: '950 Mbps',
      noiseLevel: '24 dB (Whisper Quiet)',
      solarGen: '45 kW',
      color: 'from-emerald-500 to-teal-600',
      pos: { x: '45%', y: '50%' },
      facilities: ['24 Silent Focus Pods', 'Digital Journal Terminals', 'Coffee Kiosk', 'Group Discussion Rooms']
    },
    {
      id: 'hostels',
      name: 'Hostel Wings & Residences',
      type: 'Living & Dining Quarters',
      occupancy: '88%',
      activeTickets: 4,
      wifiSpeed: '720 Mbps',
      noiseLevel: '45 dB',
      solarGen: '110 kW',
      color: 'from-amber-500 to-orange-600',
      pos: { x: '78%', y: '65%' },
      facilities: ['Boys & Girls Blocks 1-4', '24/7 Hot Water Plants', 'Gym & Recreation Room', 'Automated Laundry']
    },
    {
      id: 'medical',
      name: 'Health Center & Emergency SOS',
      type: '24/7 Medical Care',
      occupancy: '15%',
      activeTickets: 0,
      wifiSpeed: '900 Mbps',
      noiseLevel: '22 dB',
      solarGen: '25 kW',
      color: 'from-rose-500 to-red-600',
      pos: { x: '20%', y: '75%' },
      facilities: ['24/7 Doctors & Nursing Desk', 'ICU Ambulance Bay', 'Pharmacy Vault', 'Automated AEDs']
    }
  ];
  const activeWingInfo = campusWings.find(w => w.id === selectedMapWing) || campusWings[0];

  // ================= 2. SMART BOARD & WHITEBOARD CANVAS STATE =================
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [aiBoardSolution, setAiBoardSolution] = useState(null);
  const [aiSolvingBoard, setAiSolvingBoard] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.strokeStyle = isEraser ? (darkMode ? '#0b1120' : '#ffffff') : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 4 : brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAiBoardSolution(null);
  };

  const handleSolveBoard = () => {
    setAiSolvingBoard(true);
    setTimeout(() => {
      setAiBoardSolution({
        identified: 'Identified: Circuit / Mathematical Equation sketch',
        solution: '✓ AI Diagnostic Analysis Complete: Circuit impedance balanced (Z = 45Ω). Voltage drop simulated at 3.2V across R1.',
        confidence: '99.4%'
      });
      setAiSolvingBoard(false);
    }, 600);
  };

  // ================= 3. SMART STUDY ROOM POMODORO WIDGET STATE =================
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [ambientSound, setAmbientSound] = useState(null);
  const audioContextRef = useRef(null);
  const soundOscRef = useRef(null);

  useEffect(() => {
    let pInterval = null;
    if (pomodoroActive && pomodoroSeconds > 0) {
      pInterval = setInterval(() => setPomodoroSeconds(p => p - 1), 1000);
    } else if (pomodoroSeconds === 0) {
      setPomodoroActive(false);
      setPomodoroSeconds(25 * 60);
    }
    return () => clearInterval(pInterval);
  }, [pomodoroActive, pomodoroSeconds]);

  const toggleLandingAmbient = (type) => {
    if (ambientSound === type) {
      try {
        if (soundOscRef.current) soundOscRef.current.stop();
        if (audioContextRef.current) audioContextRef.current.close();
      } catch (e) {}
      soundOscRef.current = null;
      audioContextRef.current = null;
      setAmbientSound(null);
      return;
    }

    try {
      if (soundOscRef.current) soundOscRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    } catch (e) {}

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const actx = new AudioContext();
      audioContextRef.current = actx;

      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'rain' ? 220 : 144, actx.currentTime);
      gain.gain.setValueAtTime(0.06, actx.currentTime);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      soundOscRef.current = osc;
      setAmbientSound(type);
    } catch (e) {
      setAmbientSound(type);
    }
  };

  // ================= 4. MULTILINGUAL TRANSLATOR STATE =================
  const [selectedLang, setSelectedLang] = useState('en');
  const translations = {
    en: {
      headline: 'Next-Gen Smart Campus Problem Solving Ecosystem',
      tagline: 'Automate & Resolve Campus Infrastructure with AI Speed',
      desc: 'Autonomous grievance triage, predictive IoT telemetry, 1-tap QR scanning, and smart attendance for engineering universities.'
    },
    hi: {
      headline: 'नेक्स्ट-जेन स्मार्ट कैंपस समस्या निवारण इकोसिस्टम',
      tagline: 'कैंपस की सभी समस्याओं को AI स्पीड से हल करें',
      desc: 'स्मार्ट AI शिकायत वर्गीकरण, IoT सेंसर टेलीमेट्री, 1-टैप QR रिपोर्टिंग और 75% स्मार्ट अटेंडेंस प्रणाली।'
    },
    hinglish: {
      headline: 'Next-Gen Smart Campus Problem Solving Hub',
      tagline: 'Campus ki har problem ko solve karein AI Speed se',
      desc: 'Autonomous AI ticket dispatch, IoT sensor health monitoring, 1-tap QR scanning aur 75% smart attendance tracker.'
    },
    mr: {
      headline: 'पुढील पिढीची स्मार्ट कॅम्पस समस्या निवारण प्रणाली',
      tagline: 'कॅम्पसच्या सर्व समस्यांचे AI द्वारे त्वरित निवारण',
      desc: 'स्वयंचलित तक्रार वर्गीकरण, IoT सेन्सर, १-टॅप QR स्कॅनिंग आणि स्मार्ट उपस्थिती प्रणाली.'
    },
    ta: {
      headline: 'அடுத்த தலைமுறை ஸ்மார்ட் வளாக பிரச்சனை தீர்வு அமைப்பு',
      tagline: 'AI வேகத்தில் வளாக பிரச்சனைகளை உடனடியாக தீர்க்கவும்',
      desc: 'தானியங்கி புகார் தீர்வு, IoT சென்சார் கண்காணிப்பு மற்றும் ஸ்மார்ட் வருகை பதிவு.'
    }
  };

  // AI Live Sandbox state
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxResult, setSandboxResult] = useState(null);
  const [sandboxDiagnosing, setSandboxDiagnosing] = useState(false);

  // Embedded Live Interactive Demo Dashboard State
  const [embeddedDemoRole, setEmbeddedDemoRole] = useState('admin');
  const [embeddedDemoTickets, setEmbeddedDemoTickets] = useState([
    { id: 'CF-2026-01', title: 'Ceiling Fan rattling noise in Room C-204', category: 'Electrical', priority: 'High', status: 'In Progress', building: 'Block C', time: '10m ago' },
    { id: 'CF-2026-02', title: 'Wi-Fi AP offline in Lab 3 (AP-BLK-A3)', category: 'Internet/Wi-Fi', priority: 'Emergency', status: 'Pending', building: 'Block A', time: '25m ago' },
    { id: 'CF-2026-03', title: 'Water cooler filter replacement Hostel 1', category: 'Water/Plumbing', priority: 'Medium', status: 'Resolved', building: 'Hostel 1', time: '2h ago' }
  ]);
  const [embeddedNewTitle, setEmbeddedNewTitle] = useState('');
  const [embeddedAttendanceMarked, setEmbeddedAttendanceMarked] = useState(false);
  const [embeddedPasscode, setEmbeddedPasscode] = useState('4589');

  // Check URL query parameters & redirected registration state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'register') {
      setAuthMode('register');
    }
    if (params.get('demo') === 'true') {
      const demoEl = document.getElementById('demo');
      if (demoEl) demoEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
      if (location.state.registeredRole) {
        setRole(location.state.registeredRole);
      }
      setAuthMode('login');
      setLoginMethod('password');
      setSuccessMsg(location.state.successMessage || '🎉 Registration successful! Please sign in with your email and password.');
    }
  }, [location.search, location.state]);

  // Login Method: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState('password');

  // Demo credentials for seamless instant showcase
  const demoRoleCredentials = {
    student: { email: 'student@campusfix.edu', password: 'password123', label: 'Student Community' },
    faculty: { email: 'faculty@campusfix.edu', password: 'password123', label: 'Faculty Workstation' },
    hod: { email: 'hod@campusfix.edu', password: 'password123', label: 'HOD Suite' },
    staff: { email: 'staff@campusfix.edu', password: 'password123', label: 'Staff Desk' },
    teammember: { email: 'team@campusfix.edu', password: 'password123', label: 'Core Team Operations' },
    admin: { email: 'shubhammishra23082004@gmail.com', password: 'shubham@123', label: 'Campus Admin Command' }
  };

  // Password Login State - Start empty without automatic pre-fill
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSelectRole = (roleId) => {
    setRole(roleId);
    setError('');
  };

  const handleInstantDemoLogin = async (targetRole) => {
    const r = targetRole || role;
    setError('');
    setLoading(true);
    const cred = demoRoleCredentials[r] || demoRoleCredentials.student;
    try {
      const data = await login(cred.email, cred.password);
      handleRoleRedirect(data?.user?.role || r);
    } catch (err) {
      console.error(err);
      setError('Instant demo sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Form State
  const [phone, setPhone] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtpDemo, setGeneratedOtpDemo] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: '',
    employeeId: '',
    designation: '',
    phone: '',
    hostelBlock: '',
    roomNumber: '',
    agreeTerms: true
  });

  // UI status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Global Language & Demo Sign-In Modal States
  const { language, setLanguage, t, currentLanguage } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoModalRole, setDemoModalRole] = useState('student');
  const langMenuRef = useRef(null);

  const otpInputRefs = useRef([]);
  const { login, sendOTP, loginWithOTP, register } = useContext(AuthContext);

  const departmentsList = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Artificial Intelligence & Data Science',
    'Administration',
    'Maintenance & Facilities'
  ];

  const roles = [
    {
      id: 'student',
      name: 'Student',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      description: 'Report issues, track tickets, live attendance & mess reviews',
      features: ['1-Tap QR Issue Scanner', 'AI Complaint Assistant', '75% Attendance Tracker', 'Lost & Found AI Match']
    },
    {
      id: 'faculty',
      name: 'Faculty',
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      description: 'Classroom issue reporting & course material distribution',
      features: ['Smart Class Attendance', 'Classroom Projector Dispatch', 'Study Resource Hub', 'Student Grievance View']
    },
    {
      id: 'teammember',
      name: 'Team Member',
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      description: 'Core committee dispatcher & student council operations',
      features: ['Task Force Dispatcher', 'Campus Chat Host', 'Broadcast Notice Engine', 'Fleet Health Telemetry']
    },
    {
      id: 'staff',
      name: 'Staff & Technicians',
      icon: BriefcaseBusiness,
      color: 'from-purple-500 to-indigo-700',
      description: 'Field ticket resolution, maintenance logging & work-orders',
      features: ['Real-time Work Orders', '1-Tap Status Updates', 'Inventory Request Desk', 'Asset Repair History']
    },
    {
      id: 'hod',
      name: 'HOD',
      icon: User,
      color: 'from-rose-500 to-pink-600',
      description: 'Departmental analytics, faculty leaves & curriculum review',
      features: ['Department Analytics', 'Faculty Leave Clearances', 'Resource Verification', 'Incident Escalations']
    },
    {
      id: 'admin',
      name: 'Administrator',
      icon: ShieldCheck,
      color: 'from-sky-500 to-blue-700',
      description: 'Full Campus Administration & predictive fleet intelligence',
      features: ['Real-time Heatmaps', 'AI Smart Auto-Dispatch', 'Fleet Health Sensors', 'User Management']
    }
  ];

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRoleRedirect = (userRole) => {
    const r = (userRole || role || 'student').toLowerCase();
    if (r === 'admin') navigate('/admin');
    else if (r === 'teammember' || r === 'team') navigate('/team-dashboard');
    else if (r === 'hod') navigate('/hod');
    else if (r === 'faculty') navigate('/faculty');
    else if (r === 'staff') navigate('/staff');
    else navigate('/student');
  };

  // Live AI Sandbox Tester
  const handleTestAISandbox = (e) => {
    if (e) e.preventDefault();
    if (!sandboxQuery.trim()) return;

    setSandboxDiagnosing(true);
    setTimeout(() => {
      const q = sandboxQuery.toLowerCase();
      let category = 'General Infrastructure';
      let priority = 'Medium';
      let sla = '3 Hours';
      let assignedCrew = 'General Facilities Unit';
      let confidence = '98.4%';

      if (q.includes('wifi') || q.includes('internet') || q.includes('router') || q.includes('network') || q.includes('lan')) {
        category = 'Internet/Wi-Fi';
        priority = 'High';
        sla = '1.5 Hours';
        assignedCrew = 'IT Computer Center NetOps';
        confidence = '99.2%';
      } else if (q.includes('water') || q.includes('pipe') || q.includes('tap') || q.includes('washroom') || q.includes('leak') || q.includes('flush')) {
        category = 'Water & Plumbing';
        priority = 'High';
        sla = '2 Hours';
        assignedCrew = 'Campus Hydraulics & Plumbing Crew';
        confidence = '97.8%';
      } else if (q.includes('light') || q.includes('fan') || q.includes('ac') || q.includes('shock') || q.includes('switch') || q.includes('mcb') || q.includes('power')) {
        category = 'Electrical & Power';
        priority = 'Emergency';
        sla = '45 Minutes';
        assignedCrew = 'Electrical Substation Emergency Staff';
        confidence = '99.6%';
      } else if (q.includes('projector') || q.includes('hdmi') || q.includes('sound') || q.includes('mic') || q.includes('podium')) {
        category = 'Classroom Smart Systems';
        priority = 'High';
        sla = '20 Minutes';
        assignedCrew = 'Audio-Visual Technical Team';
        confidence = '98.9%';
      } else if (q.includes('mess') || q.includes('food') || q.includes('canteen') || q.includes('meal')) {
        category = 'Mess & Food Quality';
        priority = 'Medium';
        sla = '4 Hours';
        assignedCrew = 'Hostel Mess Grievance Committee';
        confidence = '96.5%';
      }

      setSandboxResult({
        title: sandboxQuery,
        category,
        priority,
        sla,
        assignedCrew,
        confidence
      });
      setSandboxDiagnosing(false);
    }, 450);
  };

  // Password Login Handler
  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await login(email, password);
      handleRoleRedirect(data?.user?.role || role);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to sign in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP Handler
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setSendingOtp(true);

    try {
      const res = await sendOTP(phone, role);
      if (res.success) {
        setOtpSent(true);
        setGeneratedOtpDemo(res.otp || '');
        setSuccessMsg(`OTP sent successfully to +91-${res.phone || phone}!`);
        setCountdown(60);
      }
    } catch (err) {
      setError('Failed to send OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtpValues(newOtp);
    }
  };

  const handleQuickFillOtp = () => {
    if (!generatedOtpDemo) return;
    setOtpValues(generatedOtpDemo.split('').slice(0, 6));
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginWithOTP(phone, otpValues.join(''), role);
      if (data.success) handleRoleRedirect(data.user.role);
    } catch (err) {
      setError('Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(regForm, false);
      setSuccessMsg('Registration successful!');
      setAuthMode('login');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 5-Step System Workflow Pipeline Data
  const workflowSteps = [
    {
      step: 1,
      title: 'Multimodal Grievance Logging',
      badge: 'Capture & Input',
      desc: 'Students & Faculty report problems via 1-Tap QR stickers, voice speech recognition dictation, photo attachment defect detection, or interactive AI Copilot prompt.',
      points: ['1-Tap QR Asset Tag Scanner', 'Voice-to-Text Speech Dictation', 'Floor & Room Coordinate Pin', 'AI Copilot Pre-fill Action']
    },
    {
      step: 2,
      title: 'Autonomous AI Triage & SLA Scoring',
      badge: 'NLP & Routing',
      desc: 'CampusFix AI Engine analyzes the incident description, predicts the precise category, checks duplicate grievance history nearby, tags urgency severity, and starts SLA timers.',
      points: ['Natural Language Categorization', 'Emergency Severity Assessment', 'Duplicate Ticket Radar', 'Strict SLA Timer Countdown']
    },
    {
      step: 3,
      title: 'Smart Dispatch & Work-Order Generation',
      badge: 'Resource Allocation',
      desc: 'Instantly alerts skill-matched technicians (Electricians, IT NetOps, Hydraulics Plumbers) via push notifications with physical room directions and required spares.',
      points: ['Skill-Matched Task Allocation', 'Preventive Maintenance Work-Orders', 'SMS & Push Notification Broadcast', 'Technician Workload Balancing']
    },
    {
      step: 4,
      title: 'Live Tracking & Resolution Verification',
      badge: 'Verification & XP',
      desc: 'Real-time interactive status timeline. When repairs complete, the student confirms closure via OTP or digital sign-off, unlocking Civic Karma XP points.',
      points: ['Live Timeline Status Tracker', 'OTP Digital Sign-Off Proof', 'Civic Karma XP & Badges', 'Mess & Facility Rating Feedback']
    },
    {
      step: 5,
      title: 'Executive Telemetry & Predictive Analytics',
      badge: 'IoT & Telemetry',
      desc: 'Campus administrators monitor real-time issue density heatmaps, predictive equipment failure curves, IoT vibration/thermal sensors, and CSV report export.',
      points: ['Campus Density Heatmaps', 'IoT Telemetry Stream Gauges', 'Replace vs. Repair Advisory', '1-Click CSV & PDF Export']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white relative overflow-x-hidden font-sans transition-colors duration-200">
      
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* ================= TOP NAVBAR WITH SUNDAR DIGITAL CLOCK ================= */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between transition-all duration-300 shadow-xs">
        
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 transform hover:scale-105 hover:rotate-3 transition-transform duration-300 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                {t('CampusFix')}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30">
                by Team Shubham
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline leading-tight">
              {t('Smart Problem Solving by Team Shubham')}
            </span>
          </div>
        </div>

        {/* Center / Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 mr-2 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-300 backdrop-blur-md">
            <a href="#demo" className="px-3 py-1.5 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 hover:bg-brand-600 hover:text-white border border-brand-500/30 transition-all duration-200 flex items-center gap-1 font-black shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{t('Live Demo')}</span>
            </a>
            <a href="#campus-gis-map" className="px-3 py-1.5 rounded-xl hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">{t('GIS Campus Map')}</a>
            <a href="#smart-whiteboard" className="px-3 py-1.5 rounded-xl hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">{t('Smart Board')}</a>
            <a href="#smart-study-hub" className="px-3 py-1.5 rounded-xl hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">{t('Study Pods')}</a>
            <a href="#system-powers" className="px-3 py-1.5 rounded-xl hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">{t('Features')}</a>
            <a href="#roles" className="px-3 py-1.5 rounded-xl hover:text-brand-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200">{t('Roles')}</a>
          </nav>

          {/* ================= UNIVERSAL LANGUAGE SELECTOR DROPDOWN ================= */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Change Portal Language (भाषा बदलें)"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 animate-pulse" />
              <span className="text-xs">{currentLanguage?.flag}</span>
              <span className="hidden sm:inline text-xs font-extrabold">{currentLanguage?.native || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 overflow-hidden animate-scale-in">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Language / भाषा
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        language === l.code
                          ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 font-black'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                      {language === l.code && (
                        <Check className="w-3.5 h-3.5 text-brand-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sundar Glowing Digital Clock HUD Widget */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <div className="flex items-center gap-1 font-mono font-black text-slate-900 dark:text-white text-xs tracking-wider">
              <span>{displayHours}</span>
              <span className="text-brand-500 animate-pulse">:</span>
              <span>{minutes}</span>
              <span className="text-brand-500 animate-pulse text-[10px]">:</span>
              <span className="text-[10px] text-brand-600 dark:text-brand-400">{seconds}</span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-brand-50 dark:bg-brand-500/25 text-brand-600 dark:text-brand-300 font-sans font-black ml-0.5">
                {ampm}
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">|</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden lg:inline font-semibold">
              {dateString}
            </span>
          </div>

          {/* Fast Scroll to Sign In Button */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-brand-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t('Sign In')}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" /> : <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 text-xs font-bold animate-fadeIn">
          <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">⚡ {t('Live Demo')}</a>
          <a href="#campus-gis-map" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">🗺️ {t('GIS Campus Map')}</a>
          <a href="#smart-whiteboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">🎨 {t('Smart Board')}</a>
          <a href="#smart-study-hub" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">🎧 {t('Study Pods')}</a>
          <a href="#system-powers" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">⚡ {t('Features')}</a>
          <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">👥 {t('Roles')}</a>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16 flex-1">
        
        {/* ================= TOP HERO & AUTH SPLIT SECTION ================= */}
        <div>
          {/* Top Live Ticker & Operations HUD Banner */}
          <div className="mb-8 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 shadow-md dark:shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs transition-all duration-300 backdrop-blur-md hover:border-brand-500/30">
            
            {/* Left Status & Telemetry */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Campus Telemetry
              </span>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                <Radio className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
                <span>{isDayShift ? '☀️ Academic Daytime Shift Active' : '🌙 Night Watch: Safety & SOS Active'}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                <span>🍃 Campus Air: <strong>AQI 38 (Good)</strong></span>
                <span>•</span>
                <span>🌡️ <strong>28°C</strong></span>
              </div>
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400 font-semibold hidden md:inline">
                ⚡ 15,240+ Solved • 🕒 1.8h Avg Turnaround
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 font-extrabold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Auto-Dispatch Online</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hero Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 text-xs font-black text-brand-600 dark:text-brand-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                  <span>{translations[selectedLang]?.headline || translations.en.headline}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {translations[selectedLang]?.tagline || translations.en.tagline}{' '}
                  <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent underline decoration-brand-500 decoration-4">
                    AI Speed
                  </span>
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl font-normal">
                  {translations[selectedLang]?.desc || translations.en.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#campus-gis-map"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg shadow-brand-500/25 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Explore GIS Campus Map</span>
                </a>
                <a
                  href="#smart-whiteboard"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5 shadow-md shadow-purple-500/25"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Launch Smart Board</span>
                </a>
                <a
                  href="#smart-study-hub"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                >
                  <Headphones className="w-3.5 h-3.5 text-rose-500" />
                  <span>Quiet Study Pods</span>
                </a>
              </div>

              {/* Quick Feature Pillars Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1 transform hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">AI Copilot &amp; Triage</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Autonomous ticket categorization &amp; crew routing</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1 transform hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Predictive Fleet</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">IoT sensor monitoring &amp; lifecycle curves</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-1 transform hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Smart Attendance</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">75% attendance grid &amp; leave calculators</p>
                </div>
              </div>
            </div>

            {/* Right Authentication Form */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-5 transition-all duration-300">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {authMode === 'login' ? 'Sign in to Portal' : 'Create Campus Account'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {authMode === 'login'
                      ? 'Access your personalized smart campus dashboard.'
                      : 'Join the campus problem solving network.'}
                  </p>
                </div>
              </div>

              {/* Sign In vs Register Switcher */}
              <div className="p-1 rounded-2xl bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-brand-600 text-white shadow-md transform scale-102'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-brand-600 text-white shadow-md transform scale-102'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>

              {/* Error & Success Feedback */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{successMsg}</span>
                </div>
              )}

              {/* MODE 1: LOGIN FORM */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  
                  {/* Method Switcher */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('password');
                        setError('');
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'password'
                          ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('otp');
                        setError('');
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        loginMethod === 'otp'
                          ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile OTP</span>
                    </button>
                  </div>

                    {/* Role Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Select Portal Role
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {roles.map(r => {
                          const Icon = r.icon;
                          const isSelected = role === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => handleSelectRole(r.id)}
                              className={`p-2 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer transform active:scale-95 ${
                                isSelected
                                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30 scale-102 font-black shadow-xs'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <Icon className={`w-4 h-4 mb-0.5 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                              <span className="text-[10px] truncate w-full font-bold">{r.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* 1-Click Fast Enter Banner */}
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => handleInstantDemoLogin(role)}
                          disabled={loading}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-98"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>⚡ 1-Click Instant Enter as {roles.find(r => r.id === role)?.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Password Form */}
                    {loginMethod === 'password' && (
                      <form onSubmit={handlePasswordSubmit} className="space-y-3.5 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="e.g. yourname@example.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Password
                            </label>
                          </div>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-1"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Sign In as {roles.find(r => r.id === role)?.name}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}

                  {/* OTP Form */}
                  {loginMethod === 'otp' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Registered Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 flex items-center gap-1">
                              <span>🇮🇳 +91</span>
                            </div>
                            <input
                              type="tel"
                              maxLength={10}
                              required
                              value={phone}
                              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="98765 43210"
                              className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all duration-200"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={sendingOtp || countdown > 0 || phone.length < 10}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold disabled:opacity-50 transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                          >
                            {sendingOtp ? 'Sending...' : countdown > 0 ? `${countdown}s` : otpSent ? 'Resend' : 'Send OTP'}
                          </button>
                        </div>
                      </div>

                      {otpSent && generatedOtpDemo && (
                        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-amber-800 dark:text-amber-300 font-bold">Demo OTP: </span>
                            <span className="font-mono font-black text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 rounded">
                              {generatedOtpDemo}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleQuickFillOtp}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] transition cursor-pointer"
                          >
                            ⚡ Auto Fill
                          </button>
                        </div>
                      )}

                      {otpSent && (
                        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                              Enter 6-Digit Code
                            </label>
                            <div className="flex items-center justify-between gap-2">
                              {otpValues.map((digit, idx) => (
                                <input
                                  key={idx}
                                  ref={el => (otpInputRefs.current[idx] = el)}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={digit}
                                  onChange={e => handleOtpChange(idx, e.target.value)}
                                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                                  onPaste={handleOtpPaste}
                                  className="w-10 sm:w-11 h-12 text-center text-lg font-black rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all duration-200"
                                />
                              ))}
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading || otpValues.join('').length < 6}
                            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                          >
                            {loading ? 'Verifying...' : `Verify & Enter as ${roles.find(r => r.id === role)?.name}`}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: REGISTER FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={regForm.name}
                        onChange={handleRegChange}
                        placeholder="e.g. Aarav Patel"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={regForm.email}
                        onChange={handleRegChange}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                      <input
                        type="password"
                        name="password"
                        required
                        value={regForm.password}
                        onChange={handleRegChange}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={regForm.confirmPassword}
                        onChange={handleRegChange}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                    <select
                      name="department"
                      value={regForm.department}
                      onChange={handleRegChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                    >
                      {departmentsList.map((d, idx) => (
                        <option key={idx} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'login' ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>New to CampusFix?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      Register here →
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      Sign in here →
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* ================= SECTION: 🎮 LIVE INTERACTIVE DEMO DASHBOARD (DEMO PORTAL) ================= */}
        <section id="demo" className="space-y-6 pt-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/40 dark:border-brand-500/30 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/40 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Live Interactive Demo Dashboard</span>
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                    ● Fully Operational in Browser
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Experience All 6 Roles Live Right Here
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switch roles below to test live problem reporting, attendance calculations, IoT telemetry, and work orders in real-time.
                </p>
              </div>

              {/* Sign In to Full Portal Button */}
              <button
                type="button"
                onClick={() => {
                  setDemoModalRole(embeddedDemoRole);
                  setShowDemoModal(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Access {roles.find(r => r.id === embeddedDemoRole)?.name} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {roles.map(r => {
                const Icon = r.icon;
                const isActive = embeddedDemoRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setEmbeddedDemoRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/30 shadow-md transform scale-102'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${r.color} text-white flex items-center justify-center font-bold shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black truncate ${isActive ? 'text-brand-600 dark:text-brand-300 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                        {r.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {r.id === 'admin' ? 'Executive Dean' : r.name + ' Workspace'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Interactive Role View Containers */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-5">
              
              {/* 1. ADMIN DEMO VIEW */}
              {embeddedDemoRole === 'admin' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        👑 Dean Workspace — Campus Command &amp; Operations Overview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      🔒 Limited Preview Mode (Sample Data)
                    </span>
                  </div>

                  {/* Admin KPI Stat Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Total Tickets</span>
                      <div className="text-xl font-black text-slate-900 dark:text-white mt-1">15,240</div>
                      <span className="text-[10px] text-emerald-500 font-bold">↑ 98.4% Solved</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Avg SLA Speed</span>
                      <div className="text-xl font-black text-brand-600 dark:text-brand-400 mt-1">1.8 Hours</div>
                      <span className="text-[10px] text-emerald-500 font-bold">⚡ AI Fast-Track</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Active Fleet</span>
                      <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">48 Assets</div>
                      <span className="text-[10px] text-emerald-500 font-bold">● 92.4% Healthy</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Field Technicians</span>
                      <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">12 Online</div>
                      <span className="text-[10px] text-slate-400 font-bold">4 Active Shifts</span>
                    </div>
                  </div>

                  {/* Live Grievance Queue */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                        Sample Incident Stream (Preview)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const newT = {
                            id: `CF-2026-0${embeddedDemoTickets.length + 1}`,
                            title: 'Projector HDMI port issue in Hall 201',
                            category: 'Audio-Visual',
                            priority: 'High',
                            status: 'Pending',
                            building: 'Block A',
                            time: 'Just now'
                          };
                          setEmbeddedDemoTickets([newT, ...embeddedDemoTickets]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] transition cursor-pointer"
                      >
                        + Simulate New Ticket
                      </button>
                    </div>

                    <div className="space-y-2">
                      {embeddedDemoTickets.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-black text-[11px] text-slate-400">{t.id}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{t.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                              📍 {t.building}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                              t.status === 'In Progress' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                              'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                            }`}>
                              {t.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEmbeddedDemoTickets(embeddedDemoTickets.map(item => item.id === t.id ? { ...item, status: item.status === 'Pending' ? 'In Progress' : 'Resolved' } : item));
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            >
                              ⚡ Advance Status
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">
                      ℹ️ Note: Live administrative logs and user rosters require authenticated Administrator login.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. STUDENT DEMO VIEW */}
              {embeddedDemoRole === 'student' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        🎓 Student Portal — Student Workspace Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                      🔒 Student Preview Mode
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Attendance Safe Zone Widget */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          📊 75% Attendance Safe Bunk Tracker
                        </span>
                        <span className="text-xs font-black text-emerald-500">84.5% (Safe Zone)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '84.5%' }}></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span>Attended: <strong>101 / 120</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">🎉 4 Safe Bunks Remaining</span>
                      </div>
                    </div>

                    {/* Quick 1-Tap Issue Logger */}
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        ⚡ Quick 1-Tap Grievance Box
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={embeddedNewTitle}
                          onChange={e => setEmbeddedNewTitle(e.target.value)}
                          placeholder="e.g. Washroom tap leaking in Hostel 2"
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!embeddedNewTitle.trim()) return;
                            const newT = {
                              id: `CF-2026-0${embeddedDemoTickets.length + 1}`,
                              title: embeddedNewTitle,
                              category: 'Hostel Facility',
                              priority: 'Medium',
                              status: 'Pending',
                              building: 'Hostel Block',
                              time: 'Just now'
                            };
                            setEmbeddedDemoTickets([newT, ...embeddedDemoTickets]);
                            setEmbeddedNewTitle('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Report
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block">AI Auto-Triage will classify category &amp; dispatch nearest technician.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. FACULTY DEMO VIEW */}
              {embeddedDemoRole === 'faculty' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        👨‍🏫 Faculty Suite — Classroom &amp; Course Overview Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      🔒 Faculty Preview Mode
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Classroom 104 AV Status</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Projector &amp; Wi-Fi OK</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Classroom AV check pinged to Audio-Visual Crew!')}
                        className="w-full py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                      >
                        Ping AV Tech
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Live Attendance Code</span>
                      <div className="text-lg font-black font-mono text-brand-600 dark:text-brand-400">{embeddedPasscode}</div>
                      <button
                        type="button"
                        onClick={() => setEmbeddedPasscode(String(Math.floor(1000 + Math.random() * 9000)))}
                        className="w-full py-1 rounded-lg bg-brand-500/15 text-[10px] font-bold text-brand-600 dark:text-brand-300"
                      >
                        Generate New Code
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">Study Resources</span>
                      <div className="text-sm font-black text-slate-900 dark:text-white">4 Files Uploaded</div>
                      <span className="text-[10px] text-emerald-500 font-bold">240 Student Downloads</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. HOD DEMO VIEW */}
              {embeddedDemoRole === 'hod' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-rose-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        🏛️ HOD Academic Suite — Department Summary Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                      🔒 HOD Preview Mode
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase text-slate-400">CSE Grievance Score</span>
                      <div className="text-xl font-black text-emerald-500 mt-1">98.2%</div>
                      <span className="text-[10px] text-slate-400">0 Critical Escalations</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase text-slate-400">Department Labs</span>
                      <div className="text-xl font-black text-slate-900 dark:text-white mt-1">8 Active Labs</div>
                      <span className="text-[10px] text-brand-500">All Equipment Calibrated</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-black uppercase text-slate-400">Faculty Roster</span>
                      <div className="text-xl font-black text-slate-900 dark:text-white mt-1">18 Professors</div>
                      <span className="text-[10px] text-emerald-500">100% Attendance Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. STAFF DEMO VIEW */}
              {embeddedDemoRole === 'staff' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <BriefcaseBusiness className="w-5 h-5 text-purple-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        🔧 Field Technician Desk — Maintenance Work-Order Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                      🔒 Staff Preview Mode
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-slate-400">Assigned Work Orders</span>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">Ceiling Fan Motor Replacement (Room C-204)</h5>
                        <p className="text-[10px] text-slate-400">Required: 75W Capacitor • Physical Location: Academic Block C</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Sample preview: Work Order status updated!')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                      >
                        ✓ Mark Completed
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. TEAM LEAD DEMO VIEW */}
              {embeddedDemoRole === 'teammember' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-500" />
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        ⚡ Core Committee Command — Broadcast &amp; Notice Preview
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                      🔒 Core Committee Preview
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-black uppercase text-slate-400">Campus Notice Broadcaster</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      📢 Broadcasts live announcements instantly across the student ticker bar and campus mobile apps.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('teammember');
                        setAuthMode('login');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Sign In to Access Broadcaster →
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ================= SECTION: 🗺️ INTERACTIVE LIVE CAMPUS GIS MAP ================= */}
        <section id="campus-gis-map" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30">
              🗺️ GIS Spatial Campus Radar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Interactive 3D Campus Spatial Map &amp; IoT Beacon Grid
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Click any campus block below to inspect live environmental telemetry, noise dB levels, Wi-Fi speed, solar generation, and active work orders.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Interactive Campus Map Canvas Container (8 Cols) */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden text-white space-y-4">
              
              {/* Map Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono font-bold text-slate-300">CAMPUS_GIS://v3.2_SPATIAL_ONLINE</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>GPS: 28.6139° N, 77.2090° E</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">12 Connected Wings</span>
                </div>
              </div>

              {/* Visual Map Radar Canvas */}
              <div className="h-80 sm:h-96 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 relative overflow-hidden flex items-center justify-center p-4">
                
                {/* Subtle Radar Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                <div className="absolute w-80 h-80 rounded-full border border-indigo-500/20 animate-ping pointer-events-none"></div>

                {/* Campus Center Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-[10px] font-black text-brand-300 flex items-center gap-1.5 shadow-lg backdrop-blur-md z-10">
                  <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '30s' }} />
                  <span>Central Fountain &amp; Quad</span>
                </div>

                {/* Interactive Wing Hotspot Markers */}
                {campusWings.map(w => {
                  const isSelected = selectedMapWing === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelectedMapWing(w.id)}
                      style={{ top: w.pos.y, left: w.pos.x }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 cursor-pointer z-20 transform hover:scale-110 ${
                        isSelected
                          ? 'bg-brand-600 text-white border-white shadow-xl shadow-brand-500/50 scale-110 ring-4 ring-brand-400/30'
                          : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-brand-400 hover:bg-slate-800 shadow-md backdrop-blur-md'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-400 animate-bounce'}`} />
                      <div className="text-left">
                        <span className="text-[11px] font-black block leading-none">{w.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{w.type.split(' ')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Wing Quick Selector Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-400 font-bold mr-1">Select Block:</span>
                {campusWings.map(w => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedMapWing(w.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedMapWing === w.id
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {w.name}
                  </button>
                ))}
              </div>

            </div>

            {/* Wing Live Telemetry Card (4 Cols) */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400">
                    Live Block Telemetry
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeWingInfo.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeWingInfo.type}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 flex items-center justify-center font-black">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Active Tickets</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">{activeWingInfo.activeTickets} Ongoing</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Space Occupancy</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{activeWingInfo.occupancy}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Wi-Fi 6 Speed</span>
                  <span className="text-base font-black text-purple-600 dark:text-purple-400">{activeWingInfo.wifiSpeed}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Ambient Noise</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400">{activeWingInfo.noiseLevel}</span>
                </div>
              </div>

              {/* Wing Features List */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300 block">
                  Available Facilities &amp; Sensors:
                </span>
                {activeWingInfo.facilities.map((fac, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Report Problem in {activeWingInfo.name}</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ================= SECTION: 🎨 REAL-TIME SMART BOARD & WHITEBOARD ================= */}
        <section id="smart-whiteboard" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30">
              🎨 Interactive Canvas Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Campus Smart Board &amp; Collaborative Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Draw equations, sketch engineering circuit diagrams, or take quick study notes directly on the board with AI instant equation analysis!
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
              
              {/* Brush Tools */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEraser(false)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    !isEraser ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Pen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isEraser ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>

                {/* Color Palette */}
                <div className="flex items-center gap-1.5 ml-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', darkMode ? '#ffffff' : '#0f172a'].map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setBrushColor(c);
                        setIsEraser(false);
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 transition cursor-pointer transform hover:scale-110 ${
                        brushColor === c && !isEraser ? 'border-brand-500 ring-2 ring-brand-300' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSolveBoard}
                  disabled={aiSolvingBoard}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiSolvingBoard ? 'AI Analyzing Sketch...' : 'AI Solve Diagram'}</span>
                </button>

                <button
                  type="button"
                  onClick={clearBoard}
                  className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Clear Whiteboard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Interactive HTML5 Canvas */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070b14] overflow-hidden relative touch-none shadow-inner">
              <canvas
                ref={canvasRef}
                width={1000}
                height={380}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-72 sm:h-96 cursor-crosshair block"
              />
              <span className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-400 pointer-events-none select-none">
                💡 Tip: Click &amp; drag mouse or touch finger to draw freely
              </span>
            </div>

            {/* AI Diagram Solver Response */}
            {aiBoardSolution && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 space-y-1.5 animate-scale-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    {aiBoardSolution.identified}
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    Confidence: {aiBoardSolution.confidence}
                  </span>
                </div>
                <p className="text-purple-800 dark:text-purple-300 font-medium">
                  {aiBoardSolution.solution}
                </p>
              </div>
            )}

          </div>
        </section>

        {/* ================= SECTION: 🎧 SMART STUDY ROOMS & FOCUS STATION ================= */}
        <section id="smart-study-hub" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/30">
              🎧 Quiet Study Pods &amp; Focus Radar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Smart Study Rooms &amp; Virtual Focus Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Reserve quiet study pods in Central Library, start a Pomodoro work session, and play synthesized binaural soundscapes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Live Pod Radar (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Campus Focus Pod Radar
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Live seat count &amp; noise levels across campus wings</p>
                </div>
                <Link
                  to="/study-room"
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-black text-xs hover:bg-brand-100 transition flex items-center gap-1"
                >
                  <span>Full Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Zero-Noise Silent Focus Pods', wing: 'Central Library 3rd Floor', free: 6, total: 24, noise: '24 dB', speed: '980 Mbps' },
                  { name: 'AI Coding & Tech Booths', wing: 'Computer Center Block A', free: 5, total: 12, noise: '34 dB', speed: '1.2 Gbps' },
                  { name: 'Collaborative Discussion Lab', wing: 'Tech Center Room 204', free: 7, total: 16, noise: '52 dB', speed: '850 Mbps' },
                  { name: '24/7 Late Night Owl Lounge', wing: 'Hostel Hub Ground Wing', free: 9, total: 20, noise: '38 dB', speed: '750 Mbps' }
                ].map((pod, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{pod.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{pod.wing}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {pod.free} / {pod.total} Free
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{pod.noise}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Focus Timer & Audio (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Focus Pomodoro Station
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  25 Min Cycle
                </span>
              </div>

              {/* Big Timer */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <div className="text-4xl font-mono font-black tracking-tight text-white">
                  {String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0')}:{String(pomodoroSeconds % 60).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  {pomodoroActive ? '🧠 Focus Flow Active' : 'Paused'}
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPomodoroActive(!pomodoroActive)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                    pomodoroActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {pomodoroActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{pomodoroActive ? 'Pause Session' : 'Start Focus'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPomodoroActive(false);
                    setPomodoroSeconds(25 * 60);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Synthesized Binaural Audio */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">🎧 Ambient Focus Generator:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLandingAmbient('rain')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      ambientSound === 'rain'
                        ? 'bg-purple-600 text-white border-purple-500 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Rain Soundscape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLandingAmbient('binaural')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      ambientSound === 'binaural'
                        ? 'bg-purple-600 text-white border-purple-500 animate-pulse'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Alpha Wave</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================= SECTION 1: SYSTEM POWER & CORE CAPABILITIES ================= */}
        <section id="system-powers" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-500/30">
              ⚡ Platform Core Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Unprecedented Campus Infrastructure Power
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              CampusFix replaces slow manual paper complaints with deep AI telemetry, instant emergency dispatchers, and IoT asset diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">AI Autonomous Triage &amp; Classifier</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Natural Language Processing auto-detects problem category, computes urgency score, checks duplicate ticket radar, and assigns task forces in under 500ms.
              </p>
              <span className="inline-block text-[11px] font-bold text-brand-600 dark:text-brand-400">⚡ 99.2% Accuracy</span>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Predictive Maintenance &amp; IoT Sensors</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connects 820+ physical IoT sensors tracking vibration (mm/s), core thermal status (°C), power draw (kW), and triggers proactive work-orders before failure.
              </p>
              <span className="inline-block text-[11px] font-bold text-purple-600 dark:text-purple-400">📡 Live Telemetry Radar</span>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">1-Tap QR Sticker Reporting</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Scan unique QR codes on smart projectors, AC units, hostel washrooms, and lab benches to file verified grievances in a single tap without manual typing.
              </p>
              <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">⚡ 3-Second Instant Filing</span>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Smart 75% Attendance Grid</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated timetable tracking, proxy-free attendance calculations, medical leave adjustments, and early warnings before falling below the 75% exam cutoff.
              </p>
              <span className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400">🎓 Academic Safe-Zone</span>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Emergency SOS Life Safety Desk</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1-tap red alarm button immediately notifies campus security, campus health center, and chief warden with GPS coordinates in critical situations.
              </p>
              <span className="inline-block text-[11px] font-bold text-rose-600 dark:text-rose-400">🚨 &lt;2 Min Rapid Response</span>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Gamified Civic Karma &amp; Digital IDs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Flippable 3D Digital RFID Campus IDs, verified security clearance, and Civic Karma XP points for students who report and verify campus resolutions.
              </p>
              <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">🪪 Verified Campus Citizen</span>
            </div>

          </div>
        </section>

        {/* ================= SECTION 2: END-TO-END SYSTEM WORKFLOW PIPELINE ================= */}
        <section id="system-workflow" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30">
              🔄 End-to-End Operational Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              How CampusFix Resolves Problems from Start to Finish
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Explore the 5-step autonomous pipeline connecting reporters, AI triage, field crews, and executive decision makers.
            </p>
          </div>

          {/* Workflow Steps Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {workflowSteps.map(s => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveWorkflowStep(s.step)}
                className={`py-3 px-2 rounded-xl text-xs font-black transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer transform active:scale-95 ${
                  activeWorkflowStep === s.step
                    ? 'bg-brand-600 text-white shadow-md scale-102'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-[10px] opacity-75 uppercase">Step {s.step}</span>
                <span className="truncate w-full text-center">{s.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Workflow Step Display Card */}
          {(() => {
            const curStep = workflowSteps.find(s => s.step === activeWorkflowStep);
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5 animate-scale-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                      Pipeline Stage 0{curStep.step} of 05
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                      {curStep.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Autonomous SLA-Driven</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {curStep.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {curStep.points.map((pt, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 transform hover:scale-102 transition-transform duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* ================= SECTION 3: INTERACTIVE AI DIAGNOSTIC SANDBOX ================= */}
        <section id="ai-sandbox" className="space-y-6 pt-6">
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-2xl space-y-6 transform hover:border-indigo-500/60 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🧪 Interactive Live Sandbox Playground
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Test the AI Problem Auto-Classifier</h3>
                <p className="text-xs text-slate-300">Type any issue to experience real-time NLP classification, priority ranking, and crew assignment.</p>
              </div>
            </div>

            <form onSubmit={handleTestAISandbox} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={sandboxQuery}
                onChange={e => setSandboxQuery(e.target.value)}
                placeholder="e.g. Projector HDMI port damaged in CS Lab 3 / Washroom water valve broken on Floor 2"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-indigo-500/40 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                disabled={sandboxDiagnosing || !sandboxQuery.trim()}
                className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-black transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-500/30"
              >
                {sandboxDiagnosing ? 'Analyzing NLP...' : 'Run Live Diagnostic'}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-slate-400 font-bold">Try Instant Prompts:</span>
              {[
                'Hostel 2 washroom water leakage',
                'Lab 4 AC sparking and smelling',
                'Library Wi-Fi router disconnection',
                'Mess dinner food quality sour',
                'Classroom 301 smart projector not booting'
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSandboxQuery(sample);
                    setTimeout(() => handleTestAISandbox(), 50);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] transition cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>

            {sandboxResult && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 space-y-4 animate-scale-in">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-300 font-black text-xs uppercase border border-brand-500/30">
                      Category: {sandboxResult.category}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-black text-xs uppercase border border-rose-500/30">
                      Priority: {sandboxResult.priority}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-black flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> AI Confidence: {sandboxResult.confidence}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Auto-Assigned Dispatch Unit:</span>
                    <span className="font-black text-white text-sm">{sandboxResult.assignedCrew}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Calculated Resolution SLA:</span>
                    <span className="font-black text-amber-400 text-sm">{sandboxResult.sla}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= SECTION 4: 🏛️ CAMPUS WORKSPACES & ROLE PORTALS ================= */}
        <section id="roles" className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-500/30">
              🏛️ Role-Based Campus Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Explore All 6 Campus Workspaces
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Select your role portal to sign in and access customized problem solving tools, operational workflows, and verified logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map(r => {
              const Icon = r.icon;
              
              return (
                <div
                  key={r.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500/50 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${r.color} text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">{r.name} Portal</h4>
                          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                            {r.id === 'admin' ? '👑 Executive Dean Desk' : 'Verified Stakeholder'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        Protected Portal
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {r.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-1.5 pt-1">
                      {r.features.map((feat, i) => (
                        <div key={i} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setAuthMode('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${r.color} text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 active:scale-98 mt-2`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In to {r.name} Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ================= COMPREHENSIVE DEEP FOOTER ================= */}
      <footer className="relative z-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070b14] pt-12 pb-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">CampusFix Platform</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Engineered by Team Shubham
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Next-generation smart campus problem solving platform designed for engineering colleges. Empowering universities with AI autonomous triage, predictive maintenance sensors, and paperless operational workflows.
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                  🔒 256-bit AES Vault
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  ● 99.9% Uptime SLA
                </span>
              </div>
            </div>

            {/* Column 2: Platform Modules */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Platform Modules</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
                <li><a href="#campus-gis-map" className="hover:text-brand-600 dark:hover:text-white transition">Live GIS Spatial Map</a></li>
                <li><a href="#smart-whiteboard" className="hover:text-brand-600 dark:hover:text-white transition">Smart Whiteboard Studio</a></li>
                <li><a href="#smart-study-hub" className="hover:text-brand-600 dark:hover:text-white transition">Smart Study Rooms &amp; Pods</a></li>
                <li><a href="#ai-sandbox" className="hover:text-brand-600 dark:hover:text-white transition">AI Copilot &amp; Triage</a></li>
                <li><a href="#system-powers" className="hover:text-brand-600 dark:hover:text-white transition">Predictive Maintenance</a></li>
              </ul>
            </div>

            {/* Column 3: Role Portals */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Role Portals</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
                <li><a href="#roles" className="hover:text-brand-600 dark:hover:text-white transition">Student Community Hub</a></li>
                <li><a href="#roles" className="hover:text-brand-600 dark:hover:text-white transition">Faculty &amp; Lecture Desk</a></li>
                <li><a href="#roles" className="hover:text-brand-600 dark:hover:text-white transition">HOD Academic Suite</a></li>
                <li><a href="#roles" className="hover:text-brand-600 dark:hover:text-white transition">Staff &amp; Field Crew</a></li>
                <li><a href="#roles" className="hover:text-brand-600 dark:hover:text-white transition">Executive Admin Command</a></li>
              </ul>
            </div>

            {/* Column 4: System Architecture & Safety */}
            <div className="space-y-3 text-xs">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">24/7 Campus Helplines</h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
                <li><span>🚨 Emergency SOS: <strong>112 / +91-Campus-SOS</strong></span></li>
                <li><span>🏥 Health Center: <strong>Ext. 104</strong></span></li>
                <li><span>⚡ Electric Substation: <strong>Ext. 202</strong></span></li>
                <li><span>💻 IT NetOps Desk: <strong>Ext. 303</strong></span></li>
                <li><span>🛡️ Chief Warden: <strong>Ext. 404</strong></span></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Status Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 CampusFix by Team Shubham. All intellectual rights reserved.</p>
            <div className="flex items-center gap-4 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>System Operational v2.5</span>
              </span>
              <span>•</span>
              <a href="#system-powers" className="hover:underline">Privacy Policy</a>
              <span>•</span>
              <a href="#system-powers" className="hover:underline">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= GORGEOUS DEMO SIGN-IN REQUIRED MODAL POPUP ================= */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden animate-scale-in"
          >
            {/* Top Glowing Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Role Header Badge */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    🔒 Demo Preview Mode
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
                  Unlock Full {roles.find(r => r.id === demoModalRole)?.name || 'Portal'} Suite
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This demo is a sample teaser. Sign in to access full live database &amp; operational features.
                </p>
              </div>
            </div>

            {/* Unlocked Capabilities List */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14]/70 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-semibold">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Features Unlocked Upon Sign-in:
              </div>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Full Live Database Access &amp; Real-Time Telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>Submit &amp; Track Official Grievances with Photos &amp; SLA Timers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>Smart Attendance 75% Tracker &amp; Geofenced QR Check-ins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>24/7 Campus AI Copilot &amp; Emergency SOS Fast-Track</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRole(demoModalRole);
                  setAuthMode('login');
                  setShowDemoModal(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-black text-sm shadow-xl shadow-brand-500/30 transition-all transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Proceed to Sign In as {roles.find(r => r.id === demoModalRole)?.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegForm(prev => ({ ...prev, role: demoModalRole }));
                  setAuthMode('register');
                  setShowDemoModal(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer text-center"
              >
                Need an account? Register as {roles.find(r => r.id === demoModalRole)?.name}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;