import { NavLink } from "react-router-dom";
import { getStoredUser } from '../utils/auth';

function Sidebar() {
  const user = getStoredUser();

  const navItems = user
    ? user.role === 'Admin'
      ? [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Employees', to: '/employees' },
          { label: 'Resume Screening', to: '/resume-screening' },
          { label: 'Interview Questions', to: '/interview-questions' },
          { label: 'Performance Feedback', to: '/performance-feedback' },
          { label: 'Candidate Recommendation', to: '/candidate-recommendation' },
          { label: 'History', to: '/history' },
          { label: 'Settings', to: '/settings' },
          { label: 'Logout', to: '/logout' },
        ]
      : [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Resume Screening', to: '/resume-screening' },
          { label: 'Interview Questions', to: '/interview-questions' },
          { label: 'Performance Feedback', to: '/performance-feedback' },
          { label: 'Candidate Recommendation', to: '/candidate-recommendation' },
          { label: 'History', to: '/history' },
          { label: 'Logout', to: '/logout' },
        ]
    : [{ label: 'Login', to: '/login' }];

  return (
    <aside className="w-full max-w-72 bg-slate-950 text-white px-6 py-8 md:h-screen md:w-72 md:min-h-screen md:rounded-r-3xl md:shadow-xl md:border-r border-slate-800">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.4em] text-sky-300">AI Powered HRMS</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">People Pulse</h1>
        <p className="mt-2 text-sm text-slate-400">Modern workforce insights in one place.</p>
        {user && (
          <div className="mt-6 rounded-3xl bg-slate-800/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">{user.role}</p>
            <p className="truncate">{user.email}</p>
          </div>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-slate-800 text-sky-200' : 'hover:bg-slate-800 hover:text-sky-200'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
