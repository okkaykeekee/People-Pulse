import { useEffect, useState } from 'react';

const defaultSettings = {
  reportFrequency: 'Weekly',
  notificationEmails: true,
  workWeekStart: 'Monday',
  defaultHireThreshold: '7',
};

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hrmsSettings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const handleChange = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem('hrmsSettings', JSON.stringify(settings));
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.setItem('hrmsSettings', JSON.stringify(defaultSettings));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-300/10 border border-slate-200">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Settings</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900">Workspace preferences</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Configure default HR report cadence, notification preferences, and hiring threshold settings for your dashboard experience.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Report Frequency</span>
                <select
                  value={settings.reportFrequency}
                  onChange={(event) => handleChange('reportFrequency', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Workweek starts on</span>
                <select
                  value={settings.workWeekStart}
                  onChange={(event) => handleChange('workWeekStart', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Notification emails</span>
                <select
                  value={settings.notificationEmails ? 'enabled' : 'disabled'}
                  onChange={(event) => handleChange('notificationEmails', event.target.value === 'enabled')}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Hiring threshold</span>
                <select
                  value={settings.defaultHireThreshold}
                  onChange={(event) => handleChange('defaultHireThreshold', event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option value="6">6 / 10</option>
                  <option value="7">7 / 10</option>
                  <option value="8">8 / 10</option>
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-3xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset defaults
              </button>
              <button
                type="submit"
                className="rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Save settings
              </button>
            </div>
          </form>

          {saved && (
            <p className="mt-5 text-sm text-emerald-700">Settings saved locally in browser storage.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
