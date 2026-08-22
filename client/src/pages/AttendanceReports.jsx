import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FileText,
  Download,
  Filter,
  ArrowLeft,
  Printer,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

const AttendanceReports = () => {
  const { user } = useContext(AuthContext);

  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [semester, setSemester] = useState('All');
  const [section, setSection] = useState('All');
  const [subjectId, setSubjectId] = useState('All');
  const [status, setStatus] = useState('All');

  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    handleGenerateReport();
  }, [department, semester, section, subjectId, status]);

  const fetchSubjects = async () => {
    try {
      const res = await api.get(`/attendance/subjects?department=${department}`);
      if (res.data.success) setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/attendance/reports?department=${department}&semester=${semester}&section=${section}&subjectId=${subjectId}&status=${status}`
      );
      if (res.data.success) {
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(
      `${api.defaults.baseURL}/attendance/reports?department=${department}&semester=${semester}&section=${section}&subjectId=${subjectId}&status=${status}&format=csv`,
      '_blank'
    );
  };

  const handlePrint = () => {
    window.print();
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
            <FileText className="w-6 h-6 text-purple-600" />
            Attendance Report Generator & CSV Export
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate custom audit reports, export CSV spreadsheet datasets, or print official academic circulars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs shadow-sm hover:border-purple-500 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters Bento Card */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">Report Filter Criteria</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Electronics & Communication">ECE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Civil Engineering">Civil</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Sem {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Section</label>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-purple-600"
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="ON_DUTY">On Duty</option>
            </select>
          </div>

        </div>
      </div>

      {/* Generated Report Table */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 dark:text-white">
            Matching Report Entries ({records.length} records)
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Compiling official academic report...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No records found matching current query parameters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Roll No.</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Subject</th>
                  <th className="pb-3">Recorded Status</th>
                  <th className="pb-3">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3 font-mono text-slate-500">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {r.student?.rollNumber || 'STU-001'}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {r.student?.name}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {r.subject?.name} ({r.subject?.code})
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        r.status === 'ABSENT' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {r.faculty?.name || 'Faculty'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AttendanceReports;
