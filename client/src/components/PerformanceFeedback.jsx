import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

function PerformanceFeedback() {
  const [achievements, setAchievements] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveHistoryEntry = (entry) => {
    try {
      const stored = JSON.parse(localStorage.getItem('hrmsHistory') || '[]');
      localStorage.setItem('hrmsHistory', JSON.stringify([entry, ...stored]));
    } catch (storageError) {
      console.warn('Unable to save history entry', storageError);
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    const trimmedAchievements = achievements.trim();

    if (!trimmedAchievements) {
      setError('Please enter employee achievements.');
      setFeedback('');
      return;
    }

    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await axios.post(`${API_URL}/generate-feedback`, {
        achievements: trimmedAchievements,
      });

      const output = response.data?.output || 'No feedback received.';
      setFeedback(output);
      saveHistoryEntry({
        id: Date.now(),
        type: 'Performance Feedback',
        title: 'Feedback generated',
        detail: output.slice(0, 200),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Unable to generate feedback.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Performance Feedback</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI-generated employee review</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Paste employee achievements below and generate a polished feedback summary instantly.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Employee Achievements</label>
              <textarea
                rows="10"
                value={achievements}
                onChange={(event) => setAchievements(event.target.value)}
                placeholder="List key achievements, contributions, and strengths..."
                className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-3xl px-6 py-3 text-sm font-semibold text-white transition ${
                loading ? 'cursor-not-allowed bg-slate-400' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Feedback'}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Generated Feedback</h2>
          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            {loading ? (
              <p className="text-sm text-slate-500">Generating feedback…</p>
            ) : error ? (
              <p className="text-sm text-rose-700">{error}</p>
            ) : feedback ? (
              feedback.split(/\r?\n/).filter(Boolean).map((line, index) => (
                <p key={index} className="text-sm leading-7 text-slate-700">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Enter achievements and click Generate Feedback to view the AI summary here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceFeedback;
