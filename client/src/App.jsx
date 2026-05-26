import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AuthPage    from "./pages/AuthPage";
import Onboarding  from "./pages/Onboarding";
import Dashboard   from "./pages/Dashboard";
import Tasks       from "./pages/Tasks";
import Profile     from "./pages/Profile";
import Layout      from "./components/Layout";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#00f5ff", fontFamily: "monospace", padding: 40 }}>// booting system...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"      element={user ? <Navigate to="/" /> : <AuthPage mode="login" />} />
      <Route path="/register"   element={user ? <Navigate to="/" /> : <AuthPage mode="register" />} />
      <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index        element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
