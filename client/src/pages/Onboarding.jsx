import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import "../index.css";

const STEPS = ["Identity", "Body", "Goals", "Activity"];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    age: "", gender: "male",
    height: "", weight: "", unit: "metric",
    goal: "lose", activity: "moderate",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const finish = async () => {
    setSaving(true);
    try {
      // Convert to metric for storage
      let height = parseFloat(form.height);
      let weight = parseFloat(form.weight);
      if (form.unit === "imperial") {
        height = height * 2.54;
        weight = weight * 0.453592;
      }
      await api.put("/profile", { ...form, height, weight });
      await refreshUser();
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : finish();
  const prev = () => setStep(s => s - 1);

  return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="logo-title" style={{ marginBottom: 4 }}>FITTECH</div>
        <div className="logo-sub" style={{ marginBottom: 28 }}>// initializing biometric profile</div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ height: 2, flex: 1, background: i < step ? "var(--neon-green)" : i === step ? "var(--neon-cyan)" : "var(--border)", boxShadow: i === step ? "0 0 8px var(--neon-cyan)" : "none", transition: "all 0.3s" }} />
          ))}
        </div>

        <div className="panel-title">{STEPS[step].toUpperCase()} — STEP {step + 1}/{STEPS.length}</div>

        {step === 0 && (
          <>
            <div className="field-group">
              <label className="field-label">Age</label>
              <input className="field-input" type="number" placeholder="Years" value={form.age} onChange={e => set("age", e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Gender</label>
              <select className="field-select" value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="field-group">
              <label className="field-label">Unit System</label>
              <select className="field-select" value={form.unit} onChange={e => set("unit", e.target.value)}>
                <option value="metric">Metric (cm / kg)</option>
                <option value="imperial">Imperial (in / lbs)</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Height ({form.unit === "metric" ? "cm" : "inches"})</label>
              <input className="field-input" type="number" placeholder={form.unit === "metric" ? "e.g. 175" : "e.g. 68"} value={form.height} onChange={e => set("height", e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Weight ({form.unit === "metric" ? "kg" : "lbs"})</label>
              <input className="field-input" type="number" placeholder={form.unit === "metric" ? "e.g. 72" : "e.g. 158"} value={form.weight} onChange={e => set("weight", e.target.value)} />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="field-group">
            <label className="field-label">Primary Goal</label>
            <select className="field-select" value={form.goal} onChange={e => set("goal", e.target.value)}>
              <option value="lose">Fat Loss / Cut</option>
              <option value="maintain">Maintain / Recomp</option>
              <option value="gain">Muscle Gain / Bulk</option>
              <option value="endurance">Endurance / Cardio</option>
              <option value="strength">Powerlifting / Strength</option>
            </select>
            <div className="tip-box" style={{ marginTop: 16 }}>
              <strong>// system tip</strong>
              {form.goal === "lose" && "Aim for a 300–500 kcal deficit. Prioritize protein (1.8–2.2g/kg) to preserve muscle."}
              {form.goal === "maintain" && "Match TDEE intake. Focus on progressive overload and recomposition."}
              {form.goal === "gain" && "Aim for a 200–400 kcal surplus. Target 0.5–1% bodyweight gain per month."}
              {form.goal === "endurance" && "Prioritize aerobic base. Zone 2 training 3-4x/week. Carbs are your friend."}
              {form.goal === "strength" && "Progressive overload is key. Track 1RM. Rest 3–5 mins between heavy sets."}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="field-group">
            <label className="field-label">Activity Level</label>
            <select className="field-select" value={form.activity} onChange={e => set("activity", e.target.value)}>
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (1–3 days/week)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="veryactive">Very Active (2x/day, athlete)</option>
            </select>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {step > 0 && <button className="btn btn-cyan" onClick={prev}>← Back</button>}
          <button className="btn btn-green w-full" onClick={next} disabled={saving} style={{ flex: 1 }}>
            {saving ? "// saving..." : step < STEPS.length - 1 ? "Continue →" : "// Launch Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
