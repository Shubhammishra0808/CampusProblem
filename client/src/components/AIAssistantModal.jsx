import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Wrench,
  Wifi,
  Droplets,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  X,
  FilePlus,
  Send,
  Volume2,
  VolumeX,
  FileText,
  HelpCircle,
  CalendarCheck2
} from 'lucide-react';

const AIAssistantModal = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Campus Member'}! I am the **CampusFix AI Diagnostic Assistant & Copilot**.\n\nI can help you diagnose infrastructure problems, calculate attendance shortage remedies, draft leave applications, or generate 1-click grievance tickets. How can I assist you today?`
    }
  ]);

  if (!isOpen) return null;

  const quickDiagnostics = [
    {
      id: 'wifi',
      title: 'Campus Wi-Fi / Eduroam not connecting',
      icon: Wifi,
      category: 'Internet/Wi-Fi',
      priority: 'Medium',
      advice: '1. Disconnect and forget "Campus-Student-5G" network.\n2. Ensure your login credentials match the college portal username.\n3. Verify if your MAC address is registered at the IT Computer Centre (Block C - 1st Floor).'
    },
    {
      id: 'water',
      title: 'Water tap leaking / Low water pressure',
      icon: Droplets,
      category: 'Water',
      priority: 'High',
      advice: '1. Check if the floor main valve is open.\n2. Please report the exact washroom/floor number.\n3. Maintenance plumbing crew dispatches within 2 hours.'
    },
    {
      id: 'power',
      title: 'Power socket / Fan / AC not working',
      icon: Zap,
      category: 'Electrical',
      priority: 'High',
      advice: '1. Check the local Miniature Circuit Breaker (MCB) switch on your floor.\n2. Do NOT touch open wires.\n3. Electrician Mr. Ramesh is available on intercom ext: 304.'
    },
    {
      id: 'projector',
      title: 'Classroom Projector / HDMI display fault',
      icon: Wrench,
      category: 'Classroom',
      priority: 'Urgent',
      advice: '1. Switch source on remote to HDMI-1.\n2. Verify the wall transmitter box power LED.\n3. AV technician dispatch team handles classroom tickets in < 15 minutes.'
    },
    {
      id: 'attendance',
      title: 'Attendance 75% Shortage & Medical Leave',
      icon: CalendarCheck2,
      category: 'Academic',
      priority: 'Medium',
      advice: 'According to University Guidelines:\n- Minimum 75% attendance is required to sit in End-Semester Exams.\n- If attendance is between 65%-74%, submit medical fitness certificate / OD slip within 3 days to HOD.\n- Click below to draft an official Medical / Duty Leave Request.'
    }
  ];

  const handleSpeakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectQuickTopic = (diag) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: `Diagnostic assistance needed for: ${diag.title}` },
      {
        sender: 'ai',
        text: `Here is the instant diagnostic guide for **${diag.title}**:\n\n${diag.advice}\n\nWould you like me to auto-populate your complaint ticket?`,
        diagRef: diag
      }
    ]);
  };

  const handleCustomQuery = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setQuery('');

    let detectedCategory = 'General';
    let detectedPriority = 'Medium';
    let solution = 'I have noted your issue. To ensure prompt resolution, our campus technician dispatch team will investigate this.';

    const lower = userText.toLowerCase();
    if (lower.includes('wifi') || lower.includes('net') || lower.includes('internet') || lower.includes('router')) {
      detectedCategory = 'Internet/Wi-Fi';
      detectedPriority = 'High';
      solution = 'For network issues: Please check if other students around you are affected. If the whole floor is down, a ticket will alert the IT network administrator immediately.';
    } else if (lower.includes('water') || lower.includes('tap') || lower.includes('washroom') || lower.includes('toilet') || lower.includes('leak') || lower.includes('drain')) {
      detectedCategory = 'Water';
      detectedPriority = 'High';
      solution = 'For water & sanitation issues: The plumbing team will be dispatched. Please specify your exact block, wing, and room number.';
    } else if (lower.includes('light') || lower.includes('fan') || lower.includes('power') || lower.includes('electric') || lower.includes('socket') || lower.includes('ac')) {
      detectedCategory = 'Electrical';
      detectedPriority = 'High';
      solution = 'For electrical faults: Please avoid using faulty sockets. The maintenance electrician will carry testing equipment to your location.';
    } else if (lower.includes('food') || lower.includes('mess') || lower.includes('canteen') || lower.includes('roti') || lower.includes('meal')) {
      detectedCategory = 'Mess/Canteen';
      detectedPriority = 'Medium';
      solution = 'For hostel mess/canteen grievances: Complaints are reviewed by the Student Mess Committee and Dean of Student Welfare.';
    } else if (lower.includes('leave') || lower.includes('medical') || lower.includes('absent') || lower.includes('attendance')) {
      detectedCategory = 'Academic';
      detectedPriority = 'Medium';
      solution = 'For leave & attendance exemptions: University policy allows up to 10% relaxation for verified medical issues or official college event representation (OD). Submit your certificate within 3 working days.';
    }

    const diagObj = {
      title: userText,
      category: detectedCategory,
      priority: detectedPriority,
      advice: solution
    };

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `${solution}\n\n**Category Detected:** ${detectedCategory} | **Recommended Priority:** ${detectedPriority}\n\nClick below to auto-fill your complaint ticket.`,
        diagRef: diagObj
      }
    ]);
  };

  const handleDraftTicket = (diag) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    onClose();
    navigate('/complaints/new', {
      state: {
        prefillTitle: diag.title,
        prefillCategory: diag.category,
        prefillPriority: diag.priority || 'Medium',
        prefillDescription: `Reported via AI Smart Diagnostic Assistant: ${diag.title}.\nDiagnostic Note: ${diag.advice || ''}`
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden flex flex-col h-[650px] max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-4 sm:p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
              <Bot className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">CampusFix AI Copilot</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-sm">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-brand-100 font-medium">Instant campus troubleshooting, leave drafting &amp; 1-click ticket generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Conversation Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-[#080d1a] custom-scrollbar">
          
          {/* Quick Problem Pills */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Quick Diagnostic Topics:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickDiagnostics.map(diag => {
                const Icon = diag.icon;
                return (
                  <button
                    key={diag.id}
                    onClick={() => handleSelectQuickTopic(diag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-sm cursor-pointer hover:border-brand-500 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-500" />
                    <span>{diag.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold rounded-br-none shadow-md'
                      : 'bg-white dark:bg-[#131b2e] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Read out loud"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-500" /> : <Volume2 className="w-3.5 h-3.5 text-brand-500" />}
                        <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
                      </button>
                    )}

                    {msg.diagRef && (
                      <button
                        onClick={() => handleDraftTicket(msg.diagRef)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>Auto-Fill Ticket with 1 Click</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Query Input Box */}
        <form onSubmit={handleCustomQuery} className="p-3 sm:p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-brand-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. WiFi issue in block A, hostel water leak, attendance shortage)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white transition flex items-center justify-center cursor-pointer shadow-md shadow-brand-500/25 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIAssistantModal;
