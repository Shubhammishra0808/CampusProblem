import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  TrendingDown,
  Building,
  Filter,
  RefreshCw,
  Zap,
  Tv,
  Droplets,
  Wifi,
  Fan,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Gauge,
  Thermometer,
  Cpu,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import api from '../services/api';

const PredictiveMaintenance = () => {
  const [metrics, setMetrics] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState('');

  // IoT Sensor Telemetry simulation state
  const [telemetryData, setTelemetryData] = useState([
    { time: '10:00', vibration: 1.8, temp: 42, power: 3.2 },
    { time: '10:15', vibration: 2.1, temp: 45, power: 3.4 },
    { time: '10:30', vibration: 3.4, temp: 58, power: 4.1 },
    { time: '10:45', vibration: 2.9, temp: 52, power: 3.8 },
    { time: '11:00', vibration: 3.8, temp: 64, power: 4.5 },
    { time: '11:15', vibration: 4.2, temp: 71, power: 4.9 },
  ]);

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/equipment/predictive-metrics');
      if (res.data.success) {
        setMetrics(res.data.metrics);
        setEquipmentList(res.data.equipment);
        if (res.data.equipment.length > 0) {
          setSelectedAsset(res.data.equipment[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInspection = (assetCode) => {
    setMaintenanceSuccess(`Preventive Maintenance Inspection scheduled for #${assetCode}! Task dispatched to Senior Maintenance Staff.`);
    setTimeout(() => setMaintenanceSuccess(''), 5000);
  };

  const filtered = equipmentList.filter(item => {
    const matchRisk = riskFilter === 'All' || item.riskLevel === riskFilter;
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchRisk && matchCat;
  });

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'Critical':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
          badge: 'bg-rose-500 text-white',
          text: 'text-rose-600 dark:text-rose-400',
          barColor: 'bg-rose-500'
        };
      case 'At Risk':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-600 dark:text-amber-400',
          barColor: 'bg-amber-500'
        };
      case 'Healthy':
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
          badge: 'bg-emerald-500 text-white',
          text: 'text-emerald-600 dark:text-emerald-400',
          barColor: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-indigo-500/20 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <Activity className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Major USP Feature
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-[11px] font-extrabold">
              AI IoT Telemetry &amp; Health Engine
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Predictive Maintenance &amp; Equipment Health Engine
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Uses historical repair frequency, operating hours, and lifecycle curves to compute real-time Equipment Health Scores. Proactively flags failure risks and advises replacement over repair.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={fetchMaintenanceData}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Health Scores</span>
            </button>

            <Link
              to="/qr-report"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Scan QR Asset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {maintenanceSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-scale-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{maintenanceSuccess}</span>
        </div>
      )}

      {/* Fleet KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics?.averageFleetHealth || 82}%
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Campus Fleet Health</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {metrics?.healthyCount || 0}
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Healthy (Optimal)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {metrics?.atRiskCount || 0}
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">At Risk (Due Soon)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {metrics?.criticalCount || 0}
            </span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Critical (Replace)</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Asset List & In-Depth Diagnostic Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Equipment Fleet List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Campus Equipment Health Monitor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select any asset to inspect breakdown frequency and AI replacement advice</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
              >
                <option value="All">All Risk Tiers</option>
                <option value="Critical">Critical (&lt;40%)</option>
                <option value="At Risk">At Risk (40-79%)</option>
                <option value="Healthy">Healthy (80%+)</option>
              </select>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
              >
                <option value="All">All Categories</option>
                <option value="Classroom">Classroom</option>
                <option value="Electrical">Electrical</option>
                <option value="Water">Water</option>
                <option value="Internet/Wi-Fi">Internet/Wi-Fi</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(item => {
              const risk = getRiskStyle(item.riskLevel);
              const isSelected = selectedAsset?.equipmentCode === item.equipmentCode;

              return (
                <div
                  key={item.equipmentCode}
                  onClick={() => setSelectedAsset(item)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#151e32] border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                      : 'bg-white dark:bg-[#151e32] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                        item.category === 'Classroom' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                        item.category === 'Electrical' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                        item.category === 'Water' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                      }`}>
                        {item.category.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{item.name}</span>
                          <span className="text-[10px] font-bold text-slate-400">#{item.equipmentCode}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.building} • {item.roomNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${risk.text} ${risk.bg}`}>
                          {item.riskLevel}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {item.repairCountLast6Months || 0} repairs (6 mo)
                        </span>
                      </div>

                      <div className="w-14 text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {item.healthScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${risk.barColor} transition-all duration-500`}
                      style={{ width: `${item.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Deep-Dive Asset Diagnostics & AI Recommendation */}
        <div className="space-y-6">
          {selectedAsset ? (
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 sticky top-24">
              
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Asset Diagnostic Profile
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedAsset.name}</h3>
                <p className="text-xs text-brand-600 font-bold">Tag: #{selectedAsset.equipmentCode}</p>
                <p className="text-xs text-slate-500 mt-1">{selectedAsset.building} • {selectedAsset.roomNumber}</p>
              </div>

              {/* Health Score Gauge */}
              <div className={`p-4 rounded-2xl border ${getRiskStyle(selectedAsset.riskLevel).bg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">Health Index</span>
                  <span className={`text-2xl font-black ${getRiskStyle(selectedAsset.riskLevel).text}`}>
                    {selectedAsset.healthScore}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getRiskStyle(selectedAsset.riskLevel).barColor}`}
                    style={{ width: `${selectedAsset.healthScore}%` }}
                  ></div>
                </div>
                <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded ${getRiskStyle(selectedAsset.riskLevel).badge}`}>
                  Risk Status: {selectedAsset.riskLevel}
                </span>
              </div>

              {/* Live IoT Sensor Telemetry Monitor */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-brand-500 animate-pulse" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">Live IoT Telemetry Stream</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold">● Connected</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Vibration</span>
                    <span className="font-black text-slate-800 dark:text-slate-200 text-xs">2.4 mm/s</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Core Temp</span>
                    <span className="font-black text-amber-500 text-xs">54 °C</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Draw</span>
                    <span className="font-black text-emerald-500 text-xs">3.8 kW</span>
                  </div>
                </div>

                <div className="h-28 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetryData}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="temp" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Diagnostic Factors */}
              <div className="space-y-2 text-xs">
                <span className="font-black text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">
                  Diagnostic Factors:
                </span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center justify-between">
                    <span>Operating Hours Logged:</span>
                    <span className="font-bold">{selectedAsset.operatingHours?.toLocaleString() || 1200}h</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Repairs in Last 6 Months:</span>
                    <span className="font-bold text-amber-600">{selectedAsset.repairCountLast6Months || 0} repairs</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Warranty Status:</span>
                    <span className={`font-bold ${new Date(selectedAsset.warrantyExpiry) < new Date() ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {new Date(selectedAsset.warrantyExpiry) < new Date() ? 'Expired' : 'Active'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* AI Proactive Recommendation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white space-y-2 border border-indigo-500/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">AI Lifecycle Advisory</h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedAsset.aiRecommendation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleScheduleInspection(selectedAsset.equipmentCode)}
                  className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Dispatch Preventive Inspection</span>
                </button>

                <Link
                  to={`/qr-report?code=${selectedAsset.equipmentCode}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <span>Open 1-Tap QR Ticket Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              Select an asset from the left to view detailed predictive health diagnostics.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default PredictiveMaintenance;
