function Dashboard() {
  const cards = [
    {
      title: 'Total Employees',
      value: '150',
      description: 'Active staff across teams',
    },
    {
      title: 'Attendance Rate',
      value: '92%',
      description: 'Average daily attendance',
    },
    {
      title: 'Performance Score',
      value: '88%',
      description: 'Overall employee performance',
    },
  ];

  return (
    <main className="flex-1 bg-slate-50 p-6 md:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-sky-600 via-sky-700 to-blue-900 p-8 text-white shadow-2xl shadow-slate-400/10 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200">HR Dashboard</p>
              <h2 className="mt-3 text-4xl font-semibold">
                AI-powered workforce insights
              </h2>
              <p className="mt-4 max-w-xl text-slate-100/90">
                Monitor staffing trends, attendance, and performance in a clean, responsive workspace designed for modern HR teams.
              </p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-right backdrop-blur-sm sm:px-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Live score</p>
              <p className="mt-2 text-3xl font-semibold">88%</p>
              <p className="text-sm text-slate-200/90">Performance confidence</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-300/10 transition hover:-translate-y-1 hover:shadow-slate-400/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-500">{card.title}</p>
              <p className="mt-5 text-4xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-3 text-sm text-slate-500">{card.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-300/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trend overview</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">Team productivity</h3>
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">+6.8% vs last month</span>
            </div>

            <div className="mt-7 space-y-5">
              {[
                { label: 'Engagement', value: 92, color: 'from-sky-500 to-cyan-400' },
                { label: 'Efficiency', value: 85, color: 'from-blue-500 to-sky-500' },
                { label: 'Growth', value: 78, color: 'from-indigo-500 to-sky-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-300/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">Next steps</h3>
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Today</span>
            </div>

            <ul className="mt-7 space-y-4 text-slate-700">
              <li className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4">
                <p className="font-semibold">Review candidate resumes</p>
                <p className="mt-2 text-sm text-slate-500">Prioritize top talent and update shortlists.</p>
              </li>
              <li className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4">
                <p className="font-semibold">Schedule feedback session</p>
                <p className="mt-2 text-sm text-slate-500">Plan one-on-one performance check-ins.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
