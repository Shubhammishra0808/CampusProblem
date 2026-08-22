import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, Mail, Phone, MapPin, Clock, Award } from 'lucide-react';

const FacultyDirectory = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDirectory();
  }, [department]);

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      let url = `/auth/faculty-directory?`;
      if (department !== 'All') url += `&department=${encodeURIComponent(department)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setFacultyList(res.data.faculty);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = facultyList.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Engineering College Faculty Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find professors, HODs, office locations, official contacts & consultation hours.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="All">All Departments</option>
          <option value="Computer Science & Engineering">Computer Science & Engg</option>
          <option value="Electronics & Communication">Electronics & Comm</option>
          <option value="Mechanical Engineering">Mechanical Engg</option>
          <option value="Civil Engineering">Civil Engg</option>
          <option value="Electrical Engineering">Electrical Engg</option>
        </select>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by professor name or designation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
          No faculty members found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(f => (
            <div
              key={f._id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow overflow-hidden border border-white/20">
                  {f.avatar ? (
                    <img src={f.avatar} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{f.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</h3>
                  <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 block">
                    {f.designation || 'Faculty Member'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{f.department}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  <span>Office: {f.officeLocation || 'Academic Block A - Room 102'}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Consultation: {f.consultationHours || 'Mon-Fri 2:00 PM - 4:00 PM'}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  <a href={`mailto:${f.email}`} className="text-brand-600 hover:underline">{f.email}</a>
                </p>

                {f.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{f.phone}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default FacultyDirectory;
