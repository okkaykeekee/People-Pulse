import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const validUsers = [
  { email: "admin@gmail.com", password: "admin123", role: "Admin" },
  { email: "employee@gmail.com", password: "employee123", role: "Employee" },
];

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("hrmsUser")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const matchedUser = validUsers.find(
      (user) => user.email === email.trim() && user.password === password && user.role === role,
    );

    if (!matchedUser) {
      setError("Invalid credentials. Use the demo email, password, and role combinations.");
      return;
    }

    localStorage.setItem("hrmsUser", JSON.stringify({ email: matchedUser.email, role: matchedUser.role }));
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-[2rem] bg-white shadow-2xl shadow-slate-300/30 ring-1 ring-slate-200 overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 p-10 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-200">HRMS Access</p>
              <h1 className="mt-5 text-4xl font-semibold">Welcome back</h1>
              <p className="mt-4 max-w-lg text-slate-200/90">
                Securely sign in to access employee analytics, performance tools, and HR workflows.
              </p>
            </div>

            <div className="mt-10 rounded-[1.75rem] bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/20">
              <h2 className="text-lg font-semibold text-white">Demo credentials</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                {validUsers.map((user) => (
                  <div key={user.email} className="rounded-3xl bg-white/10 p-4">
                    <p className="font-semibold text-white">{user.role}</p>
                    <p>{user.email}</p>
                    <p className="mt-1 text-slate-200">Password: {user.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Sign in</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Login to your account</h2>
            </div>

            {error && (
              <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                >
                  <option>Admin</option>
                  <option>Employee</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
