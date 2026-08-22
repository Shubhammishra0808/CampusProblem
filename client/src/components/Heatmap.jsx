import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building as BuildingIcon, AlertCircle, CheckCircle, ShieldAlert, Phone, Users, MapPin, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Heatmap = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingComplaints, setBuildingComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('All');

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/campus-heatmap');
      if (res.data.success) {
        setBuildings(res.data.heatmap);
      }
    } catch (err) {
      console.error('Heatmap fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuilding = async (building) => {
    setSelectedBuilding(building);
    try {
      const res = await api.get(`/complaints?building=${encodeURIComponent(building.name)}`);
      if (res.data.success) {
        setBuildingComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBuildings = buildings.filter(b => {
    if (filterSeverity === 'All') return true;
    return b.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            Campus Problem Heatmap & Infrastructure Map
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time problem severity status across academic blocks, hostels, and campus facilities.
          </p>
        </div>

        {/* Severity Legend & Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterSeverity('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterSeverity === 'All' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('Green')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${filterSeverity === 'Green' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Low Issues
          </button>
          <button
            onClick={() => setFilterSeverity('Yellow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${filterSeverity === 'Yellow' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Moderate Issues
          </button>
          <button
            onClick={() => setFilterSeverity('Red')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${filterSeverity === 'Red' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'}`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Critical / High Issues
          </button>
        </div>
      </div>

      {/* Campus Map Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))
        ) : (
          filteredBuildings.map(b => (
            <div
              key={b._id}
              onClick={() => handleSelectBuilding(b)}
              className="cursor-pointer group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Severity Top Indicator Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  b.severity === 'Red'
                    ? 'bg-rose-500'
                    : b.severity === 'Yellow'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {b.code} • {b.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-brand-600 transition">
                    {b.name}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    b.severity === 'Red'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : b.severity === 'Yellow'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {b.severity}
                </span>
              </div>

              {/* Building Stats */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Issues</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                    {b.activeComplaints}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Emergency</span>
                  <span className={`font-extrabold text-sm ${b.emergencyComplaints > 0 ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {b.emergencyComplaints}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>In-charge: {b.inChargeName}</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Building Details Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{selectedBuilding.code} • {selectedBuilding.category}</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{selectedBuilding.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Floors: {selectedBuilding.floors} | In-Charge: {selectedBuilding.inChargeName} ({selectedBuilding.contactPhone})</p>
              </div>

              <button
                onClick={() => setSelectedBuilding(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Severity Breakdown Box */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              selectedBuilding.severity === 'Red'
                ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : selectedBuilding.severity === 'Yellow'
                ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Severity Status: {selectedBuilding.severity}</h4>
                  <p className="text-xs opacity-80">
                    {selectedBuilding.activeComplaints} active unresolved issues currently pending maintenance attention.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Complaints List */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Active Complaints for {selectedBuilding.name} ({buildingComplaints.length})
              </h3>

              {buildingComplaints.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
                  No complaints reported for this building!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {buildingComplaints.map(c => (
                    <div
                      key={c._id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{c.ticketId}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">{c.category}</span>
                          <span className="text-slate-400 font-medium">Room {c.roomNumber}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">{c.title}</p>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-bold text-[10px]">
                          {c.status}
                        </span>
                        <Link
                          to={`/complaints/${c._id}`}
                          onClick={() => setSelectedBuilding(null)}
                          className="block text-[11px] text-brand-600 font-semibold hover:underline mt-1"
                        >
                          Track Ticket
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Heatmap;
