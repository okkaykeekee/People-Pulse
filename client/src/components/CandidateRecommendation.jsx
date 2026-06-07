import { useState } from 'react';
import axios from 'axios';
import { parseDocumentFile } from '../utils/fileParser';

function CandidateRecommendation() {
  const [name, setName] = useState('');
  const [resume, setResume] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');

  const saveHistoryEntry = (entry) => {
    try {
      const stored = JSON.parse(localStorage.getItem('hrmsHistory') || '[]');
      localStorage.setItem('hrmsHistory', JSON.stringify([entry, ...stored]));
    } catch (storageError) {
      console.warn('Unable to save history entry', storageError);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFileError('No file selected.');
      return;
    }

    setFileError('');

    try {
      const text = await parseDocumentFile(file);
      setResume(text);
    } catch (fileError) {
      setFileError(fileError.message || 'Unable to read uploaded file.');
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedResume = resume.trim();

    if (!trimmedName || !trimmedResume) {
      setError('Please enter the candidate name and resume text.');
      setRecommendation('');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendation('');

    try {
      const response = await axios.post('http://localhost:5000/candidate-recommendation', {
        name: trimmedName,
        resume: trimmedResume,
      });

      const output = response.data?.output || 'No recommendation received.';
      setRecommendation(output);
      saveHistoryEntry({
        id: Date.now(),
        type: 'Candidate Recommendation',
        title: `Recommendation for ${trimmedName}`,
        detail: output.slice(0, 200),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Unable to generate recommendation.';
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Candidate Recommendation</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI-powered candidate review</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Enter the candidate name and resume to generate a summary, strengths, weaknesses, recommended role, and final decision.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Candidate Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.95fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Resume Text</label>
                <textarea
                  rows="10"
                  value={resume}
                  onChange={(event) => setResume(event.target.value)}
                  placeholder="Paste candidate resume text here..."
                  className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Upload Resume (.txt, .pdf, .docx)</label>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition file:rounded-3xl file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
                {fileError && <p className="text-sm text-rose-600">{fileError}</p>}
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Upload a TXT, PDF, or DOCX resume to auto-fill the candidate resume field.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-3xl px-6 py-3 text-sm font-semibold text-white transition ${
                loading ? 'cursor-not-allowed bg-slate-400' : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Recommendation'}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Generated Recommendation</h2>
          <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            {loading ? (
              <p className="text-sm text-slate-500">Generating recommendation…</p>
            ) : error ? (
              <p className="text-sm text-rose-700">{error}</p>
            ) : recommendation ? (
              recommendation.split(/\r?\n/).filter(Boolean).map((line, index) => (
                <p key={index} className="text-sm leading-7 text-slate-700">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                Enter candidate details and click Generate Recommendation to view the AI summary here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateRecommendation;
