import { useEffect, useState } from 'react';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('hrmsHistory');
    setHistory(saved ? JSON.parse(saved) : []);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('hrmsHistory');
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Activity History</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI action log</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Review past resume screenings, performance feedback sessions, and candidate recommendations captured locally in browser storage.
              </p>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Clear history
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-300/10">
            <p className="text-sm text-slate-600">No activity recorded yet. Use the HR tools to generate AI reports and the history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => (
              <div key={entry.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{entry.type}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{entry.title}</h2>
                    <p className="mt-2 text-sm text-slate-500">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {entry.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
