import { useState } from 'react';
import axios from 'axios';
import { parseDocumentFile } from '../utils/fileParser';

function ResumeScreening() {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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
      setResumeText(text);
    } catch (fileError) {
      setFileError(fileError.message || 'Unable to read uploaded file.');
    }
  };

  const analyze = async (e) => {
    e.preventDefault();

    setError(null);
    setResult(null);
    setFileError('');

    if (!resumeText.trim()) {
      setError('Please paste a resume before analyzing.');
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post('http://localhost:5000/analyze-resume', { text: resumeText });
      const output = resp.data?.output || '';
      const analysis = { output };
      setResult(analysis);
      saveHistoryEntry({
        id: Date.now(),
        type: 'Resume Screening',
        title: 'Resume analyzed',
        detail: output.slice(0, 200),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Analyze error', err);
      const msg = err?.response?.data?.error || err.message || 'Request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Resume Screening</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI-driven candidate review</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Paste the candidate resume below or upload a text file, then run the AI analysis to see skills, score, and recommended action.
            </p>
          </div>

          <form className="space-y-6" onSubmit={analyze}>
            <div className="grid gap-4 lg:grid-cols-[1.5fr_0.95fr]">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Paste Candidate Resume</label>
                <textarea
                  rows="12"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  placeholder="Paste resume text here..."
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
                  Upload a TXT, PDF, or DOCX resume to auto-fill the editor and keep the screening workflow fast.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
              {loading && <div className="text-sm text-slate-500">Analyzing...</div>}
            </div>
          </form>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Evaluation Result</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Resume review summary</h2>
            </div>
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              Backend response
            </span>
          </div>

          {error && (
            <div className="mb-6 rounded-[1rem] border border-rose-200 bg-rose-50 p-4 text-rose-700">
              Error: {error}
            </div>
          )}

          {!result && !error && (
            <div className="mb-6 rounded-[1rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">
              No analysis yet. Paste a resume and click "Analyze Resume".
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Score</p>
                  <p className="mt-4 text-4xl font-semibold text-slate-900">
                    {(result.output && result.output.match(/\d+(?:\.\d+)?(?:\/10)?/i))
                      ? result.output.match(/\d+(?:\.\d+)?(?:\/10)?/i)[0]
                      : '—'}
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 md:col-span-2">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Skills Found</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(() => {
                      const out = result.output || '';
                      const skillsMatch = out.match(/Skills[:\-\s]*([A-Za-z0-9,\s]+)/i);
                      const skills = skillsMatch ? skillsMatch[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
                      if (skills.length > 0) {
                        return skills.map((s) => (
                          <span key={s} className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700">
                            {s}
                          </span>
                        ));
                      }
                      return <p className="text-sm text-slate-600">Skills will appear here after analysis.</p>;
                    })()}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recommendation</p>
                <p className="mt-4 text-xl font-semibold text-slate-900">
                  {(result.output && result.output.match(/Recommendation[:\-\s]*([A-Za-z\s]+)/i))
                    ? result.output.match(/Recommendation[:\-\s]*([A-Za-z\s]+)/i)[1]
                    : 'See details'}
                </p>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  {result.output.split(/\r?\n/).filter(Boolean).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeScreening;
