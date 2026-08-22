import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Settings,
  ShieldCheck,
  Lock,
  QrCode,
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  History,
  Clock
} from 'lucide-react';

const AttendanceSettings = () => {
  const { user } = useContext(AuthContext);

  const [policy, setPolicy] = useState({
    minAttendancePercent: 75,
    warningThresholdPercent: 80,
    criticalThresholdPercent: 75,
    lockDurationHours: 24,
    qrSessionDurationMinutes: 5,
    locationVerificationEnabled: true,
    collegeGeoLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      radiusMeters: 250
    },
    calculationRules: {
      presentWeight: 1,
      lateWeight: 0.5,
      onDutyCountsAsPresent: true,
      excusedExcludedFromTotal: true
    },
    parentNotificationEnabled: true
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettingsAndLogs();
  }, []);

  const fetchSettingsAndLogs = async () => {
    try {
      setLoading(true);
      const [polRes, logRes] = await Promise.all([
        api.get('/attendance/policy'),
        api.get('/attendance/audit-logs')
      ]);
      if (polRes.data.success && polRes.data.policy) {
        setPolicy(polRes.data.policy);
      }
      if (logRes.data.success) {
        setAuditLogs(logRes.data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.put('/attendance/policy', policy);
      if (res.data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        fetchSettingsAndLogs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update attendance policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/attendance" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Attendance Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-500" />
            Attendance Policy & System Configurations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure institutional minimum attendance thresholds, editing lock windows, QR session policies, and inspect change audits.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading policy configurations...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Settings Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSavePolicy} className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              
              {/* Section 1: Thresholds */}
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-500 block">1. Academic Threshold Policies</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mandatory Min. %</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={policy.minAttendancePercent}
                      onChange={e => setPolicy({ ...policy, minAttendancePercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Warning Threshold %</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={policy.warningThresholdPercent}
                      onChange={e => setPolicy({ ...policy, warningThresholdPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Critical Defaulter %</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={policy.criticalThresholdPercent}
                      onChange={e => setPolicy({ ...policy, criticalThresholdPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Locking & QR Duration */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-blue-500 block">2. Attendance Lock & QR Expiry Windows</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Editing Lock Duration (Hours)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={168}
                      value={policy.lockDurationHours}
                      onChange={e => setPolicy({ ...policy, lockDurationHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Locks faculty edits after 24h (HOD override permitted)</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">QR Session Expiry (Minutes)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={policy.qrSessionDurationMinutes}
                      onChange={e => setPolicy({ ...policy, qrSessionDurationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Automatic timeout for active live QR check-in</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Geolocation Radius */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase text-emerald-500 block">3. Anti-Proxy Geolocation Bounds</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="geoEnable"
                    checked={policy.locationVerificationEnabled}
                    onChange={e => setPolicy({ ...policy, locationVerificationEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="geoEnable" className="font-bold text-slate-700 dark:text-slate-300">
                    Enable Campus Geolocation Radius Verification for QR Check-In
                  </label>
                </div>

                {policy.locationVerificationEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={policy.collegeGeoLocation?.latitude || 28.6139}
                        onChange={e => setPolicy({
                          ...policy,
                          collegeGeoLocation: { ...policy.collegeGeoLocation, latitude: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={policy.collegeGeoLocation?.longitude || 77.2090}
                        onChange={e => setPolicy({
                          ...policy,
                          collegeGeoLocation: { ...policy.collegeGeoLocation, longitude: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Radius (Meters)</label>
                      <input
                        type="number"
                        value={policy.collegeGeoLocation?.radiusMeters || 250}
                        onChange={e => setPolicy({
                          ...policy,
                          collegeGeoLocation: { ...policy.collegeGeoLocation, radiusMeters: Number(e.target.value) }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {savedSuccess ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Policy Saved Successfully!</span>
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Apply Institutional Policies'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Audit Logs Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Academic Attendance Audit Log</h3>
              </div>

              <div className="space-y-3 max-h-[550px] overflow-y-auto custom-scrollbar pr-1">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No audit events recorded yet.</div>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-blue-600 dark:text-blue-400">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-semibold">{log.details}</p>
                      <span className="text-[10px] text-slate-400 block">
                        By {log.performedByName} ({log.role})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AttendanceSettings;
