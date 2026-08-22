import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Download, Search, PlusCircle, FileText, Filter, CheckCircle2 } from 'lucide-react';

const ResourceHub = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Resource Form
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    semester: '3',
    department: 'Computer Science & Engineering',
    subject: '',
    unit: 'Unit 1',
    type: 'Notes',
    fileUrl: ''
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [selectedSemester, selectedType, selectedDepartment]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      let url = `/resources?`;
      if (selectedSemester !== 'All') url += `&semester=${selectedSemester}`;
      if (selectedType !== 'All') url += `&type=${encodeURIComponent(selectedType)}`;
      if (selectedDepartment !== 'All') url += `&department=${encodeURIComponent(selectedDepartment)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setResources(res.data.resources);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileUrl) => {
    try {
      await api.put(`/resources/${id}/download`);
      window.open(fileUrl, '_blank');
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = new FormData();
      Object.keys(newResource).forEach(k => data.append(k, newResource[k]));
      if (uploadFile) data.append('file', uploadFile);

      const res = await api.post('/resources', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowUploadModal(false);
        fetchResources();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filtered = resources.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.unit.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            Engineering Study Resources Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access Semester Notes, PYQs (Previous Year Question Papers), Lab Manuals & Syllabus.
          </p>
        </div>

        {['faculty', 'hod', 'admin'].includes(user?.role) && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>
        )}
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-2xl">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 px-3">Semester:</span>
        {['All', '1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedSemester === sem
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {sem === 'All' ? 'All Semesters' : `Sem ${sem}`}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="All">All Resource Types</option>
          <option value="Notes">Lecture Notes</option>
          <option value="Previous Year Paper">Previous Year Papers (PYQs)</option>
          <option value="Lab Manual">Lab Manuals</option>
          <option value="Assignment">Assignments</option>
          <option value="Important Questions">Important Questions</option>
          <option value="Syllabus">Syllabus</option>
        </select>

        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="All">All Departments</option>
          <option value="Computer Science & Engineering">CSE</option>
          <option value="Electronics & Communication">ECE</option>
          <option value="Mechanical Engineering">Mechanical</option>
          <option value="Civil Engineering">Civil</option>
          <option value="Electrical Engineering">Electrical</option>
        </select>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs">
          No resources found matching the selected semester & filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <div
              key={r._id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                    Sem {r.semester} • {r.type}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {r.downloadsCount} downloads
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{r.title}</h3>
                <p className="text-xs text-brand-600 font-semibold mt-0.5">{r.subject} ({r.unit})</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">{r.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  By: {r.uploadedBy?.name || 'Faculty'}
                </span>

                <button
                  onClick={() => handleDownload(r._id, r.fileUrl)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Faculty Resource Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Upload Study Resource</h2>
            
            <form onSubmit={handleCreateResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newResource.title}
                  onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="e.g. Operating Systems Lecture Notes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newResource.subject}
                    onChange={e => setNewResource({ ...newResource, subject: e.target.value })}
                    placeholder="Operating Systems"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={newResource.semester}
                    onChange={e => setNewResource({ ...newResource, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Previous Year Paper">Previous Year Paper</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Important Questions">Important Questions</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unit / Coverage</label>
                  <input
                    type="text"
                    value={newResource.unit}
                    onChange={e => setNewResource({ ...newResource, unit: e.target.value })}
                    placeholder="Unit 1 & 2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PDF File / Document Upload</label>
                <input
                  type="file"
                  onChange={e => setUploadFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Or Document URL (Drive/PDF link)</label>
                <input
                  type="url"
                  value={newResource.fileUrl}
                  onChange={e => setNewResource({ ...newResource, fileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold"
                >
                  {uploading ? 'Uploading...' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResourceHub;
