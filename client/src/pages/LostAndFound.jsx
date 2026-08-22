import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Tag,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Award,
  HelpCircle,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const LostAndFound = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(null);
  const [claimProof, setClaimProof] = useState('');
  const [claimSuccess, setClaimSuccess] = useState('');

  const [newItem, setNewItem] = useState({
    type: 'Lost',
    title: '',
    description: '',
    category: 'Electronics',
    location: '',
    rewardBounty: 'No Reward',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || ''
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [typeFilter, categoryFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = `/lost-found?`;
      if (typeFilter !== 'All') url += `&type=${typeFilter}`;
      if (categoryFilter !== 'All') url += `&category=${encodeURIComponent(categoryFilter)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(newItem).forEach(k => data.append(k, newItem[k]));
      if (file) data.append('photo', file);

      const res = await api.post('/lost-found', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setShowModal(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!showClaimModal) return;
    try {
      await api.put(`/lost-found/${showClaimModal._id}/status`, {
        status: 'Claimed',
        claimProofNotes: claimProof
      });
      setClaimSuccess(`Claim submitted successfully for "${showClaimModal.title}". The finder will verify your ownership.`);
      setShowClaimModal(null);
      setClaimProof('');
      fetchItems();
      setTimeout(() => setClaimSuccess(''), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              AI Item Matcher & Ownership Protection
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-purple-600" />
            Campus Lost & Found Smart Recovery Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Report lost belongings, claim items with secure ownership verification, and find lost IDs or keys across campus.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>

      {claimSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-scale-in">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{claimSuccess}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {['All', 'Lost', 'Found'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                typeFilter === t
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'All' ? 'All Belongings' : `${t} Items`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search item, room, or brand..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500 outline-none font-semibold"
          />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
          No lost or found reports matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div
              key={item._id}
              className="bg-white dark:bg-[#151e32] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      item.type === 'Lost'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">{item.category}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  {item.description}
                </p>

                {item.photoUrl && (
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="mt-3 h-32 w-full object-cover rounded-2xl border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(item.incidentDate || item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                    Contact: {item.contactPhone || item.reportedBy?.phone || item.contactEmail}
                  </span>
                  
                  {item.status === 'Open' && (
                    <button
                      onClick={() => setShowClaimModal(item)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] rounded-xl transition flex-shrink-0 cursor-pointer shadow-sm"
                    >
                      {item.type === 'Found' ? 'Claim Item' : 'Found This!'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Claim Ownership Verification Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">Verify Ownership / Claim Item</h2>
              </div>
              <button onClick={() => setShowClaimModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-purple-600">Target Item</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{showClaimModal.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{showClaimModal.location}</p>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Describe Proof of Ownership (Security Details / Marks / Wallpapers / Serial Number):
                </label>
                <textarea
                  rows={3}
                  required
                  value={claimProof}
                  onChange={e => setClaimProof(e.target.value)}
                  placeholder="e.g. Phone has a blue spigen cover with student ID sticker on the back..."
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md cursor-pointer"
                >
                  Submit Verified Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Report */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Report Lost or Found Belonging</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Report Type</label>
                  <select
                    value={newItem.type}
                    onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Lost">I Lost Something</option>
                    <option value="Found">I Found Something</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="ID Card / Documents">ID Card / Documents</option>
                    <option value="Books / Notes">Books / Notes</option>
                    <option value="Keys / Wallet">Keys / Wallet</option>
                    <option value="Personal Belongings">Personal Belongings</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Blue Boat Earbuds Case / Dell Laptop Charger"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location Where Lost/Found</label>
                <input
                  type="text"
                  required
                  value={newItem.location}
                  onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g. Central Canteen Table 4 / Library 2nd Floor"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description & Identifying Details</label>
                <textarea
                  rows={3}
                  required
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Provide color, brand, stickers, unique identification marks..."
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Photo (Optional)</label>
                <input
                  type="file"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500"
                />
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
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LostAndFound;
