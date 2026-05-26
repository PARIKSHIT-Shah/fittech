import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../index.css";

export default function AuthPage({ mode }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        const user = await register(form.name, form.email, form.password);
        // If new user has no profile, go onboarding
        if (!user.profile?.height) navigate("/onboarding");
        else navigate("/");
      } else {
        const user = await login(form.email, form.password);
        navigate(!user.profile?.height ? "/onboarding" : "/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="auth-card">
        <div style={{ marginBottom: 32 }}>
          <div className="logo-title">FITTECH</div>
          <div className="logo-sub">// {mode === "login" ? "operator login" : "create account"}</div>
        </div>

        {mode === "register" && (
          <div className="field-group">
            <label className="field-label">Name</label>
            <input className="field-input" placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
        )}
        <div className="field-group">
          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="operator@fittech.io" value={form.email} onChange={e => set("email", e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Password</label>
          <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {error && <div className="err">⚠ {error}</div>}

        <button className="btn btn-green w-full mt-4" onClick={submit} disabled={loading}>
          {loading ? "// connecting..." : mode === "login" ? "// Login" : "// Register"}
        </button>

        <div style={{ marginTop: 20, fontFamily: "var(--font-m)", fontSize: "0.7rem", color: "var(--text-dim)", textAlign: "center" }}>
          {mode === "login"
            ? <>No account? <Link to="/register" style={{ color: "var(--neon-cyan)" }}>Register here</Link></>
            : <>Have an account? <Link to="/login" style={{ color: "var(--neon-cyan)" }}>Login here</Link></>}
        </div>
      </div>
    </div>
  );
}
