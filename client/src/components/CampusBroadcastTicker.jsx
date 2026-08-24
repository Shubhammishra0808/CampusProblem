import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CampusBroadcastTicker = () => {
  const { t, translateContent } = useLanguage();
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchLiveNotices();
  }, []);

  const fetchLiveNotices = async () => {
    try {
      const res = await api.get('/notices');
      if (res.data.success && res.data.notices.length > 0) {
        setNotices(res.data.notices);
      }
    } catch (err) {
      // fallback default alerts
      setNotices([
        {
          _id: 'default1',
          title: 'Campus Wi-Fi 5G upgrade completed in Library & Academic Block A',
          category: 'General',
          priority: 'Normal'
        },
        {
          _id: 'default2',
          title: 'Campus Placement drive scheduled for Final Year Students next week',
          category: 'Placement',
          priority: 'High'
        }
      ]);
    }
  };

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % notices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [notices]);

  if (!visible || notices.length === 0) return null;

  const current = notices[currentIndex] || notices[0];

  return (
    <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/30 p-2.5 sm:p-3 text-white shadow-lg overflow-hidden animate-fade-in flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-[11px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          {t('Announcements')}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[11px] font-extrabold text-amber-300 uppercase px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">
              {t(current.category) || current.category || 'Alert'}
            </span>
            <p className="text-xs font-semibold text-slate-100 truncate">
              {translateContent(current.title)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/notices"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition"
        >
          <span>{t('View Details')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Dismiss Ticker"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CampusBroadcastTicker;

