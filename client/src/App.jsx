import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmployeesPage from "./components/EmployeesPage";
import ResumeScreening from "./components/ResumeScreening";
import InterviewQuestions from "./components/InterviewQuestions";
import PerformanceFeedback from "./components/PerformanceFeedback";
import CandidateRecommendation from "./components/CandidateRecommendation";
import LoginPage from "./components/LoginPage";
import History from "./components/History";
import Settings from "./components/Settings";
import { getStoredUser } from "./utils/auth";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RequireAuth({ children }) {
  const isAuthenticated = Boolean(getStoredUser());
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RequireRole({ allowedRoles, children }) {
  const user = getStoredUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function LogoutPage() {
  useEffect(() => {
    localStorage.removeItem("hrmsUser");
  }, []);

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<RequireRole allowedRoles={["Admin"]}><EmployeesPage /></RequireRole>} />
          <Route path="resume-screening" element={<ResumeScreening />} />
          <Route path="interview-questions" element={<InterviewQuestions />} />
          <Route path="performance-feedback" element={<PerformanceFeedback />} />
          <Route path="candidate-recommendation" element={<CandidateRecommendation />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<RequireRole allowedRoles={["Admin"]}><Settings /></RequireRole>} />
          <Route path="logout" element={<LogoutPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
