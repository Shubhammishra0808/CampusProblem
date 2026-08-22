import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Bell,
  PlusCircle,
  Calendar,
  Tag,
  AlertCircle,
  Volume2,
  VolumeX,
  Printer,
  Bookmark,
  BookmarkCheck,
  Search,
  Building,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  X
} from 'lucide-react';

const NoticeBoard = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [authorityFilter, setAuthorityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [savedNotices, setSavedNotices] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved_campus_notices') || '[]');
    } catch {
      return [];
    }
  });

  const [activeSpeechId, setActiveSpeechId] = useState(null);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    priority: 'Normal',
    targetAudience: 'All',
    issuingAuthority: 'Office of the Dean'
  });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [category, authorityFilter]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      let url = `/notices?`;
      if (category !== 'All') url += `&category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const res = await api.post('/notices', newNotice);
      if (res.data.success) {
        setShowModal(false);
        setNewNotice({
          title: '',
          content: '',
          category: 'Announcement',
          priority: 'Normal',
          targetAudience: 'All',
          issuingAuthority: 'Office of the Dean'
        });
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const toggleBookmark = (noticeId) => {
    let updated;
    if (savedNotices.includes(noticeId)) {
      updated = savedNotices.filter(id => id !== noticeId);
    } else {
      updated = [...savedNotices, noticeId];
    }
    setSavedNotices(updated);
    localStorage.setItem('saved_campus_notices', JSON.stringify(updated));
  };

  const handleSpeakNotice = (notice) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    if (activeSpeechId === notice._id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Notice from ${notice.issuingAuthority || 'Campus Administration'}. Title: ${notice.title}. Content: ${notice.content}`
    );
    utterance.rate = 0.95;
    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);
    setActiveSpeechId(notice._id);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredNotices = notices.filter(n => {
    const matchAuthority = authorityFilter === 'All' || (n.issuingAuthority && n.issuingAuthority.includes(authorityFilter));
    if (!matchAuthority) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || (n.issuingAuthority && n.issuingAuthority.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
              <Megaphone className="w-3.5 h-3.5" />
              Verified Administration Dispatch
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Official College Notice Board & Circulars
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exam timetables, placement alerts, circulars from Dean/Registrar, holiday declarations, and official directives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Print Official Bulletin"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print Bulletin</span>
          </button>

          {['admin', 'faculty', 'hod'].includes(user?.role) && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg shadow-brand-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#151e32] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search circulars by keyword, exam title, or department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={authorityFilter}
              onChange={e => setAuthorityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
            >
              <option value="All">All Issuing Authorities</option>
              <option value="Dean">Office of the Dean</option>
              <option value="Controller">Exam Controller</option>
              <option value="Registrar">Registrar Office</option>
              <option value="Hostel">Hostel Warden</option>
              <option value="Placement">Placement Cell</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">Category:</span>
          {['All', 'Exam', 'Placement', 'Holiday', 'Event', 'Announcement'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? 'All Bulletins' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
          No notices found matching your filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map(n => {
            const isBookmarked = savedNotices.includes(n._id);
            const isReading = activeSpeechId === n._id;

            return (
              <div
                key={n._id}
                className="bg-white dark:bg-[#151e32] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {n.issuingAuthority || 'Office of the Dean'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {n.category}
                    </span>
                    {n.priority === 'Urgent' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500 text-white animate-pulse">
                        ⚠️ URGENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-slate-400 font-semibold">
                      {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>

                    {/* Audio Reader Button */}
                    <button
                      onClick={() => handleSpeakNotice(n)}
                      className={`p-1.5 rounded-xl transition ${isReading ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-800'}`}
                      title={isReading ? 'Stop Reading' : 'Read Notice Aloud'}
                    >
                      {isReading ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(n._id)}
                      className={`p-1.5 rounded-xl transition ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 hover:text-amber-500 bg-slate-100 dark:bg-slate-800'}`}
                      title={isBookmarked ? 'Saved to Bookmarks' : 'Bookmark this notice'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">{n.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed mt-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {n.content}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>Signatory: <strong className="text-slate-700 dark:text-slate-200">{n.publishedBy?.name || 'Administrator'}</strong> ({n.publishedBy?.designation || n.publishedBy?.role || 'Authority'})</span>
                  <span>Targeted For: <strong className="text-brand-600 dark:text-brand-400">{n.targetAudience}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Publishing Notice */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Broadcast Official Notice</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issuing Authority / Office</label>
                <select
                  value={newNotice.issuingAuthority}
                  onChange={e => setNewNotice({ ...newNotice, issuingAuthority: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Office of the Dean">Office of the Dean</option>
                  <option value="Office of the Controller of Examinations">Office of the Controller of Examinations</option>
                  <option value="Registrar Administration Office">Registrar Administration Office</option>
                  <option value="Head of Department (Computer Science)">Head of Department (Computer Science)</option>
                  <option value="Training & Placement Cell (T&P)">Training & Placement Cell (T&P)</option>
                  <option value="Hostel & Student Affairs Directorate">Hostel & Student Affairs Directorate</option>
                  <option value="Chief Campus Security Office">Chief Campus Security Office</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Schedule for End Semester Examinations..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Content / Official Circular Text</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Full announcement body for all students..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={e => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Exam">Exam</option>
                    <option value="Placement">Placement</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={newNotice.priority}
                    onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent (Instant Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={e => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="All">All Campus</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Staff">Staff Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md cursor-pointer"
                >
                  {publishing ? 'Publishing...' : 'Broadcast to All Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default NoticeBoard;
