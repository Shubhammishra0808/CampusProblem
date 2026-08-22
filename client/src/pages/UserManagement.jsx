import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, UserCheck, UserX, Shield, Zap, CheckCircle2, Clock, XCircle, Crown } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = `/admin/users?`;
      if (roleFilter !== 'All' && roleFilter !== 'Pending') {
        url += `&role=${roleFilter.toLowerCase().replace(' ', '')}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/approve`);
      if (res.data.success) {
        setActionMsg(res.data.message);
        setTimeout(() => setActionMsg(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectUser = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/reject`);
      if (res.data.success) {
        setActionMsg(res.data.message);
        setTimeout(() => setActionMsg(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoteToTeam = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/promote-team`);
      if (res.data.success) {
        setActionMsg(res.data.message);
        setTimeout(() => setActionMsg(''), 4000);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingApprovalsCount = users.filter(u => u.role === 'teammember' && !u.isApproved).length;

  const filtered = users.filter(u => {
    if (roleFilter === 'Pending') {
      if (!(u.role === 'teammember' && !u.isApproved)) return false;
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Campus User & Role Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage permissions, approve Core Team Members, activate/deactivate accounts, and assign superior authority.
          </p>
        </div>

        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setRoleFilter('Pending')}
            className="px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 animate-bounce"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{pendingApprovalsCount} Team Member Approval Pending</span>
          </button>
        )}
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/60 dark:bg-slate-800 rounded-2xl max-w-full">
          {['All', 'Pending', 'Team Member', 'Student', 'Faculty', 'Staff', 'HOD', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                roleFilter === r
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r === 'Pending' && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
              {r === 'Team Member' && <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />}
              <span>{r === 'All' ? 'All Roles' : r}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, role, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-4">User Name</th>
                <th className="p-4">Email / Phone</th>
                <th className="p-4">Department</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Approval & Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Loading user accounts...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No users match this filter.</td>
                </tr>
              ) : filtered.map(u => {
                const isPendingTeam = u.role === 'teammember' && !u.isApproved;
                return (
                  <tr key={u._id} className={`transition ${isPendingTeam ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white">{u.name}</p>
                        {u.designation && <span className="text-[10px] text-slate-400">{u.designation}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <p>{u.email}</p>
                      {u.phone && <p className="text-[10px] text-slate-400">{u.phone}</p>}
                    </td>
                    <td className="p-4 text-slate-500">{u.department}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={e => handleChangeRole(u._id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold capitalize text-slate-900 dark:text-white"
                      >
                        <option value="student">🧑‍🎓 Student</option>
                        <option value="faculty">🎓 Faculty</option>
                        <option value="staff">🛠️ Staff</option>
                        <option value="hod">🏛️ HOD</option>
                        <option value="teammember">⚡ Team Member (Superior)</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold w-fit ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>

                        {u.role === 'teammember' && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold w-fit ${
                            u.isApproved
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                          }`}>
                            <Zap className="w-2.5 h-2.5" />
                            {u.isApproved ? 'Admin Approved' : 'Pending Approval'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {isPendingTeam ? (
                          <>
                            <button
                              onClick={() => handleApproveUser(u._id)}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve as Team</span>
                            </button>
                            <button
                              onClick={() => handleRejectUser(u._id)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px]"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : u.role !== 'teammember' && u.role !== 'admin' ? (
                          <button
                            onClick={() => handlePromoteToTeam(u._id)}
                            className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-purple-800"
                            title="Promote to Core Team Member"
                          >
                            + Team Member
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                            u.isActive
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserManagement;
