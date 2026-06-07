import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

function InterviewQuestions() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseQuestionSections = (output) => {
    const lines = output.replace(/\r\n/g, '\n').split('\n');
    const sections = [];
    let currentSection = { title: 'Questions', items: [] };
    const sectionRegex = /^(?:#+\s*)?(Technical Questions|Scenario[- ]Based Questions|HR Questions|Easy Questions|Medium Questions|Difficult Questions|Scenario Questions|HR Questions|Questions)\s*[:\-]?\s*$/i;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const headingMatch = trimmed.match(sectionRegex);
      if (headingMatch) {
        const title = headingMatch[1]
          .replace(/Scenario Questions/i, 'Scenario-Based Questions')
          .replace(/Easy Questions/i, 'Easy Questions')
          .replace(/Medium Questions/i, 'Medium Questions')
          .replace(/Difficult Questions/i, 'Difficult Questions');
        currentSection = { title, items: [] };
        sections.push(currentSection);
        return;
      }

      const cleaned = trimmed
        .replace(/^#{1,6}\s*/, '')
        .replace(/^[\*\-\+\s]*\s*/, '')
        .replace(/^\d+[\)\. ]+/, '')
        .replace(/^\s*[-\*] ?/, '')
        .trim();

      if (!cleaned) return;
      if (!sections.length) {
        sections.push(currentSection);
      }
      currentSection.items.push(cleaned);
    });

    return sections;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    const trimmedRole = role.trim();

    if (!trimmedRole) {
      setError('Please enter a job role.');
      setQuestions([]);
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const response = await axios.post(`${API_URL}/generate-questions`, {
        role: trimmedRole,
      });

      const output = response.data?.output || '';
      const parsedSections = parseQuestionSections(output);
      setQuestions(parsedSections.length ? parsedSections : [{ title: 'Interview Questions', items: [output] }]);
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Unable to generate questions.';
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Interview Questions</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI-powered question generator</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Enter a job role and generate interview questions crafted for that position.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Job Role</label>
              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Data Scientist"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-3xl px-6 py-3 text-sm font-semibold text-white transition ${loading ? 'cursor-not-allowed bg-slate-400' : 'bg-sky-600 hover:bg-sky-700'}`}
            >
              {loading ? 'Generating...' : 'Generate Questions'}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <h2 className="text-sm uppercase tracking-[0.3em] text-slate-500">AI Generated Questions</h2>
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Generating interview questions…</div>
            ) : error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
            ) : questions.length === 0 ? (
              <p className="text-sm text-slate-500">Enter a job role and click generate to see sample interview questions.</p>
            ) : (
              <div className="space-y-6">
                {questions.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                    <ol className="mt-4 list-decimal space-y-3 pl-5">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="rounded-3xl border border-slate-200 bg-white p-4">
                          <p className="text-sm leading-6 text-slate-700">{item}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewQuestions;
