import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import "../index.css";

function getBMI(w, h) { return w / ((h / 100) ** 2); }
function getBMIStatus(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#00f5ff" };
  if (bmi < 25) return { label: "Normal", color: "#39ff14" };
  if (bmi < 30) return { label: "Overweight", color: "#ff6b00" };
  return { label: "Obese", color: "#ff006e" };
}
function getBMIPct(bmi) { return Math.min(100, Math.max(0, ((bmi - 14) / 26) * 100)); }

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const p = user?.profile || {};

  const [form, setForm] = useState({
    age: p.age || "",
    gender: p.gender || "male",
    height: p.height || "",   // stored in cm
    weight: p.weight || "",   // stored in kg
    unit: p.unit || "metric",
    goal: p.goal || "maintain",
    activity: p.activity || "moderate",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      await api.put("/profile", form);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const weight = parseFloat(form.weight) || 0;
  const height = parseFloat(form.height) || 0;
  const bmi = weight && height ? getBMI(weight, height) : 0;
  const status = getBMIStatus(bmi);

  return (
    <div className="page">
      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Identity Module</div>
          <div className="field-group">
            <label className="field-label">Name</label>
            <input className="field-input" value={user?.name || ""} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" value={user?.email || ""} disabled style={{ opacity: 0.5 }} />
          </div>
          <div className="field-group">
            <label className="field-label">Age</label>
            <input className="field-input" type="number" value={form.age} onChange={e => set("age", e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Gender</label>
            <select className="field-select" value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="panel-title" style={{ marginTop: 20 }}>Body Metrics (stored in metric)</div>
          <div className="field-group">
            <label className="field-label">Height (cm)</label>
            <input className="field-input" type="number" value={form.height} onChange={e => set("height", e.target.value)} />
          </div>
          <div className="field-group">
            <label className="field-label">Weight (kg)</label>
            <input className="field-input" type="number" value={form.weight} onChange={e => set("weight", e.target.value)} />
          </div>

          <div className="panel-title" style={{ marginTop: 20 }}>Training Config</div>
          <div className="field-group">
            <label className="field-label">Primary Goal</label>
            <select className="field-select" value={form.goal} onChange={e => set("goal", e.target.value)}>
              <option value="lose">Fat Loss / Cut</option>
              <option value="maintain">Maintain / Recomp</option>
              <option value="gain">Muscle Gain / Bulk</option>
              <option value="endurance">Endurance</option>
              <option value="strength">Strength</option>
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Activity Level</label>
            <select className="field-select" value={form.activity} onChange={e => set("activity", e.target.value)}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="veryactive">Very Active</option>
            </select>
          </div>

          <button className="btn btn-cyan w-full mt-4" onClick={save} disabled={saving}>
            {saving ? "// saving to mongodb..." : saved ? "// ✓ Saved!" : "// Save Profile"}
          </button>
        </div>

        <div>
          <div className="panel mb-4">
            <div className="panel-title">Live BMI Preview</div>
            {bmi > 0 ? (
              <>
                <div style={{ fontFamily: "var(--font-d)", fontSize: "3rem", fontWeight: 900, color: status.color, filter: `drop-shadow(0 0 16px ${status.color})`, textAlign: "center" }}>
                  {bmi.toFixed(1)}
                </div>
                <div style={{ textAlign: "center", fontFamily: "var(--font-m)", fontSize: "0.8rem", color: status.color, letterSpacing: 3, marginBottom: 16 }}>
                  {status.label}
                </div>
                <div className="bmi-meter">
                  <div className="bmi-needle" style={{ left: `${getBMIPct(bmi)}%` }} />
                </div>
                <div className="bmi-labels"><span>14</span><span>18.5</span><span>25</span><span>30</span><span>40+</span></div>
              </>
            ) : (
              <div className="text-dim" style={{ fontFamily: "var(--font-m)", fontSize: "0.75rem" }}>// enter height & weight to calculate</div>
            )}
          </div>

          <div className="panel">
            <div className="panel-title">Operator Badges</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bmi >= 18.5 && bmi < 25 && <div className="badge badge-gold">🏆 Optimal BMI Range</div>}
              {parseInt(form.age) >= 18 && <div className="badge badge-cyan">⚡ Adult Operator</div>}
              {form.goal === "gain" && <div className="badge badge-silver">💪 Bulk Protocol Active</div>}
              {form.goal === "lose" && <div className="badge badge-silver">🔥 Cut Protocol Active</div>}
              {(form.activity === "active" || form.activity === "veryactive") && <div className="badge badge-gold">🏅 High Activity Tier To Achieve</div>}
              <div className="badge badge-cyan">🎯 Profile Synced to DB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
