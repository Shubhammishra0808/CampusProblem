import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  MessageSquare,
  Send,
  Image as ImageIcon,
  X,
  Users,
  Search,
  Hash,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Paperclip,
  Smile,
  Circle,
  Crown,
  GraduationCap,
  Building,
  UserCheck,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CornerDownRight,
  Share2,
  Bookmark,
  ChevronDown,
  ArrowDown,
  Info,
  Wrench,
  Briefcase,
  BookOpen,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CampusChat = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('channels'); // 'channels' or 'direct'
  const [selectedChannel, setSelectedChannel] = useState('campus-support-desk');
  const [selectedContact, setSelectedContact] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');

  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);

  // Rich input tools
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  // Message Reactions map: { [msgId]: { '👍': 3, '❤️': 1 } }
  const [reactions, setReactions] = useState({});

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const voiceTimerRef = useRef(null);

  // Mobile drawer toggle
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Expanded Campus Public & Private Discussion Channels
  const channels = [
    {
      id: 'campus-support-desk',
      name: 'Campus Support & Grievance Desk',
      desc: 'General campus problem queries, updates & live support',
      icon: ShieldAlert,
      tag: 'SUPPORT',
      color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/60'
    },
    {
      id: 'admin-teacher-helpdesk',
      name: 'Admin, Team & Faculty Hub',
      desc: 'Official faculty and administration coordinate desk',
      icon: Crown,
      tag: 'OFFICIAL',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: 'electrical-tech-squad',
      name: 'Electrical & Hardware Rapid Squad',
      desc: 'Live AC, Projector, Wi-Fi and electrical equipment fixes',
      icon: Wrench,
      tag: 'MAINTENANCE',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
    },
    {
      id: 'hostel-mess-queries',
      name: 'Hostel & Mess Live Channel',
      desc: 'Hostel rooms, water, power, mess food discussions',
      icon: Building,
      tag: 'HOSTEL',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      id: 'placements-career-hub',
      name: 'Placements & Career Discussion',
      desc: 'Company drives, interview rounds & internship queries',
      icon: Briefcase,
      tag: 'CAREER',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'study-notes-exchange',
      name: 'Study Notes & Peer Learning',
      desc: 'Share class notes, PYQs and discuss exam questions',
      icon: BookOpen,
      tag: 'ACADEMICS',
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
    }
  ];

  // Quick Emoji Tray
  const quickEmojis = ['👍', '❤️', '🔥', '💡', '🚨', '⚡', '🎉', '👏', '🙌', '✅', '🚀', '💯'];

  // Canned Quick Responses
  const cannedResponses = [
    '⚡ Problem received! Technician has been dispatched.',
    '📍 Please provide exact building and room number.',
    '🔍 Maintenance team is inspecting the hardware now.',
    '✅ Grievance resolved and operational check completed.',
    '🚨 High priority alert flagged to Senior Administrator.',
    '📅 Scheduled for preventive inspection today at 4:00 PM.'
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3500); // live polling sync
    return () => clearInterval(interval);
  }, [selectedChannel, selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get('/chat/contacts');
      if (res.data.success) {
        setContacts(res.data.contacts);
      }
    } catch (err) {
      console.error('Failed to load chat contacts', err);
    }
  };

  const fetchMessages = async () => {
    try {
      let url = '/chat/messages';
      if (selectedContact) {
        url += `?recipientId=${selectedContact._id}`;
      } else {
        url += `?channel=${selectedChannel}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (customContent = null) => {
    const textToSend = customContent !== null ? customContent : messageText.trim();
    if (!textToSend && !photoPreview && !isRecordingVoice) return;

    setSending(true);
    try {
      let finalMsg = textToSend;
      if (isRecordingVoice) {
        finalMsg = `🎙️ [Voice Audio Note - 0:0${voiceSeconds || 4}s]`;
        setIsRecordingVoice(false);
        clearInterval(voiceTimerRef.current);
        setVoiceSeconds(0);
      }

      const payload = {
        message: finalMsg,
        photoUrl: photoPreview || ''
      };

      if (selectedContact) {
        payload.recipientId = selectedContact._id;
      } else {
        payload.channel = selectedChannel;
      }

      const res = await api.post('/chat/send', payload);
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.message]);
        setMessageText('');
        setPhotoPreview(null);
        setShowEmojiPicker(false);
        setShowQuickReplies(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecordingVoice) {
      // Stop and send voice note
      handleSendMessage();
    } else {
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  const handleReaction = (msgId, emoji) => {
    setReactions(prev => {
      const msgReactions = prev[msgId] || {};
      const currentCount = msgReactions[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...msgReactions,
          [emoji]: currentCount + 1
        }
      };
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1 border border-rose-300 dark:border-rose-800">
            <Crown className="w-3 h-3 text-rose-600" /> Admin
          </span>
        );
      case 'teammember':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 flex items-center gap-1 border border-purple-300 dark:border-purple-800">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Team Member
          </span>
        );
      case 'hod':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            🏛️ HOD
          </span>
        );
      case 'faculty':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 flex items-center gap-1 border border-sky-300 dark:border-sky-800">
            <GraduationCap className="w-3 h-3" /> Faculty
          </span>
        );
      case 'staff':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            🛠️ Staff
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            🧑‍🎓 Student
          </span>
        );
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchRole = roleFilter === 'All' || c.role.toLowerCase() === roleFilter.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.rollNumber && c.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchSearch;
  });

  const displayedMessages = chatSearchQuery.trim()
    ? messages.filter(m => m.message?.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
      
      {/* Top Chat Room Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md">
        
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
          >
            <Users className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20 flex-shrink-0">
            {selectedContact ? (
              <span className="font-black text-sm">{selectedContact.name?.charAt(0)}</span>
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
              {selectedContact ? (
                <>
                  <span className="truncate">{selectedContact.name}</span>
                  {getRoleBadge(selectedContact.role)}
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="truncate">{channels.find(c => c.id === selectedChannel)?.name}</span>
                </>
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {selectedContact
                ? `${selectedContact.department || 'Campus Member'} • ${selectedContact.email}`
                : channels.find(c => c.id === selectedChannel)?.desc}
            </p>
          </div>
        </div>

        {/* Header Action Tools */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* Chat Search Toggle */}
          <button
            onClick={() => setShowChatSearch(!showChatSearch)}
            className={`p-2 rounded-xl border transition ${
              showChatSearch
                ? 'bg-brand-50 text-brand-600 border-brand-300 dark:bg-brand-950/60 dark:border-brand-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition hidden sm:block"
            title={soundEnabled ? 'Mute Chat Chime' : 'Unmute Chat Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span>Live Sync</span>
          </div>

        </div>

      </div>

      {/* Message Filter Banner (when search is open) */}
      {showChatSearch && (
        <div className="px-5 py-2.5 bg-brand-50/50 dark:bg-brand-950/30 border-b border-brand-200 dark:border-brand-800/60 flex items-center gap-3 animate-fade-in">
          <Search className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <input
            type="text"
            value={chatSearchQuery}
            onChange={e => setChatSearchQuery(e.target.value)}
            placeholder="Search keywords in current conversation..."
            className="flex-1 bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {chatSearchQuery && (
            <button onClick={() => setChatSearchQuery('')} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Body: Sidebar (Channels/Contacts) + Chat Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar (Contacts & Channels) */}
        <div className={`w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-[#0f172a]/70 z-20 absolute md:static inset-y-0 left-0 transform ${showMobileSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'} transition-transform duration-200`}>
          
          {/* Tabs: Channels vs Direct */}
          <div className="p-3 border-b border-slate-200/60 dark:border-slate-800 flex gap-2 flex-shrink-0">
            <button
              onClick={() => { setActiveTab('channels'); setSelectedContact(null); setShowMobileSidebar(false); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'channels' && !selectedContact
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Channels ({channels.length})</span>
            </button>
            <button
              onClick={() => { setActiveTab('direct'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'direct' || selectedContact
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direct Chat ({contacts.length})</span>
            </button>
          </div>

          {/* Role Filter Chips (when in Direct Tab) */}
          {activeTab === 'direct' && (
            <div className="px-3 pt-2 pb-1 flex gap-1 overflow-x-auto flex-shrink-0">
              {['All', 'Admin', 'Faculty', 'Staff', 'Student'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                    roleFilter === r
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Contact Search Box */}
          {activeTab === 'direct' && (
            <div className="p-3 border-b border-slate-200/60 dark:border-slate-800 flex-shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Admin, Teachers, Team..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {activeTab === 'channels' && !selectedContact ? (
              // Channels List
              channels.map(ch => {
                const Icon = ch.icon;
                const isSelected = selectedChannel === ch.id && !selectedContact;
                return (
                  <button
                    key={ch.id}
                    onClick={() => { setSelectedChannel(ch.id); setSelectedContact(null); setShowMobileSidebar(false); }}
                    className={`w-full p-3 rounded-2xl text-left transition flex items-center gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-800 text-brand-900 dark:text-brand-100 shadow-sm'
                        : 'hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ch.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black truncate">{ch.name}</p>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {ch.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.desc}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              // Direct Contacts List
              filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No campus contacts found.
                </div>
              ) : (
                filteredContacts.map(c => {
                  const isSelected = selectedContact?._id === c._id;
                  return (
                    <button
                      key={c._id}
                      onClick={() => { setSelectedContact(c); setShowMobileSidebar(false); }}
                      className={`w-full p-2.5 rounded-2xl text-left transition flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-800 text-brand-900 dark:text-brand-100 shadow-sm'
                          : 'hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5"></div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black truncate">{c.name}</p>
                          {getRoleBadge(c.role)}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {c.department || c.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              )
            )}
          </div>

        </div>

        {/* Right Chat Screen */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#151e32] overflow-hidden">
          
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Welcome banner at top of chat */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-center space-y-1 max-w-lg mx-auto">
              <span className="text-[10px] font-black uppercase text-brand-600 tracking-wider">
                🛡️ CampusFix Real-Time Network
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {selectedContact ? `Direct Discussion with ${selectedContact.name}` : channels.find(c => c.id === selectedChannel)?.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                Messages in this room are end-to-end synchronized across all campus portals.
              </p>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold">Connecting live stream...</span>
              </div>
            ) : displayedMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-bold">No messages in this chat yet.</p>
                <p className="text-[11px] text-slate-400">Be the first one to start the conversation!</p>
              </div>
            ) : (
              displayedMessages.map(msg => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                const senderName = msg.sender?.name || (isMe ? user?.name : 'Campus Member');
                const senderRole = msg.sender?.role || (isMe ? user?.role : 'student');
                const msgReactions = reactions[msg._id] || {};

                return (
                  <div
                    key={msg._id}
                    className={`flex items-start gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                      {senderName.charAt(0).toUpperCase()}
                    </div>

                    <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      
                      {/* Sender Info Line */}
                      <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300">{senderName}</span>
                        {getRoleBadge(senderRole)}
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm break-words relative ${
                          isMe
                            ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        <p className="font-semibold whitespace-pre-wrap">{msg.message}</p>

                        {/* Photo Attachment if present */}
                        {msg.photoUrl && (
                          <div className="mt-2.5">
                            <img
                              src={msg.photoUrl}
                              alt="Attachment"
                              className="max-h-60 rounded-xl object-cover border border-white/20 shadow-md cursor-pointer hover:opacity-95"
                              onClick={() => window.open(msg.photoUrl, '_blank')}
                            />
                          </div>
                        )}

                        {/* Fast Reaction Bar on Hover */}
                        <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 z-10 ${
                          isMe ? '-left-24' : '-right-24'
                        }`}>
                          {['👍', '❤️', '💡', '🚀'].map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleReaction(msg._id, emoji)}
                              className="hover:scale-125 transition-transform text-xs p-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                      </div>

                      {/* Reaction Badges Under Bubble */}
                      {Object.keys(msgReactions).length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {Object.entries(msgReactions).map(([emoji, count]) => (
                            <span
                              key={emoji}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold"
                            >
                              <span>{emoji}</span>
                              <span className="text-slate-600 dark:text-slate-300">{count}</span>
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Bar (Canned responses) */}
          {showQuickReplies && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto animate-fade-in">
              <span className="text-[10px] font-black uppercase text-brand-600 flex-shrink-0">
                ⚡ Quick Reply:
              </span>
              {cannedResponses.map((cr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(cr)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap transition cursor-pointer shadow-sm"
                >
                  {cr}
                </button>
              ))}
            </div>
          )}

          {/* Quick Emojis Tray */}
          {showEmojiPicker && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto animate-scale-in">
              {quickEmojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMessageText(prev => prev + emoji)}
                  className="text-lg hover:scale-130 transition-transform p-1 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Photo Attachment Preview in Input Box */}
          {photoPreview && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <img
                  src={photoPreview}
                  alt="Attachment Preview"
                  className="w-12 h-12 object-cover rounded-xl border border-brand-500"
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Photo attached ready to send</span>
              </div>
              <button
                onClick={() => setPhotoPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-2"
            >
              
              {/* Quick Response Toggle Button */}
              <button
                type="button"
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  showQuickReplies
                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Quick Canned Responses"
              >
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              </button>

              {/* Emoji Picker Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  showEmojiPicker
                    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:border-purple-800'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Insert Emojis"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Photo Upload Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                title="Attach Photo / Image"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {/* Text Input or Voice Audio Wave */}
              {isRecordingVoice ? (
                <div className="flex-1 px-4 py-2.5 rounded-2xl bg-rose-500 text-white flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-xs font-black">Recording Voice Note (0:0{voiceSeconds}s)...</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase">Tap send to post</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={
                    selectedContact
                      ? `Message ${selectedContact.name}...`
                      : `Message in #${channels.find(c => c.id === selectedChannel)?.name}...`
                  }
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )}

              {/* Voice Note Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-2.5 rounded-xl border transition cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title={isRecordingVoice ? 'Cancel Voice Note' : 'Record Voice Note'}
              >
                {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Submit Send Button */}
              <button
                type="submit"
                disabled={sending || (!messageText.trim() && !photoPreview && !isRecordingVoice)}
                className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CampusChat;
