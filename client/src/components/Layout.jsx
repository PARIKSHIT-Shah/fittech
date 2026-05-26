import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../index.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const now = new Date();
  const tabs = [
    { path: "/", label: "// Dashboard" },
    { path: "/tasks", label: "// Tasks" },
    { path: "/profile", label: "// Profile" },
  ];

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div>
            <div className="logo-title">FITTECH</div>
            <div className="logo-sub">// biometric mission control</div>
          </div>
          <div className="header-meta">
            <div>SYS: ONLINE</div>
            <div>{now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
            <div style={{ color: "var(--neon-green)" }}>● {(user?.name || "OPERATOR").toUpperCase()}</div>
            <button className="btn btn-pink btn-sm" style={{ marginTop: 6 }} onClick={() => { logout(); navigate("/login"); }}>
              logout
            </button>
          </div>
        </div>

        <nav className="nav-tabs">
          {tabs.map(t => (
            <button key={t.path} className={`nav-tab ${pathname === t.path ? "active" : ""}`} onClick={() => navigate(t.path)}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
