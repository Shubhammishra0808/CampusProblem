import React, { useState } from 'react';
import api from '../services/api';
import { MessageSquare, Star, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

const FeedbackForm = () => {
  const [category, setCategory] = useState('Infrastructure');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Teaching',
    'Infrastructure',
    'Hostel',
    'Canteen',
    'Transport',
    'Internet',
    'Library'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments) {
      setError('Please provide comments regarding your feedback.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/feedback', {
        category,
        rating,
        comments,
        suggestions,
        isAnonymous
      });

      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Student Feedback & Ratings</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rate campus facilities & academic experience anonymously</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your feedback has been anonymously submitted to college administration for review and continuous quality improvement.
            </p>
            <button
              onClick={() => { setSubmitted(false); setComments(''); setSuggestions(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 font-semibold">{error}</div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rating Star Score (1 to 5)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1.5 transition ${rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                  >
                    <Star className="w-7 h-7 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Feedback & Comments <span className="text-rose-500">*</span></label>
              <textarea
                rows={4}
                required
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Share your experience regarding this category..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Suggestions for Improvement</label>
              <textarea
                rows={2}
                value={suggestions}
                onChange={e => setSuggestions(e.target.value)}
                placeholder="What could be improved?"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="anonFB"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="anonFB" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Submit Anonymously (Identity protected)
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback Response'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default FeedbackForm;
