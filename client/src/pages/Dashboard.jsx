import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import ProgressRing from "../components/ProgressRing";
import "../index.css";

function getBMI(weight, height) { return weight / ((height / 100) ** 2); }
function getBMIStatus(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "#00f5ff" };
  if (bmi < 25) return { label: "Normal", color: "#39ff14" };
  if (bmi < 30) return { label: "Overweight", color: "#ff6b00" };
  return { label: "Obese", color: "#ff006e" };
}
function getBMIPct(bmi) { return Math.min(100, Math.max(0, ((bmi - 14) / 26) * 100)); }
function getTDEE(w, h, age, gender, act) {
  const bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
  return Math.round(bmr * ({ sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryactive: 1.9 }[act] || 1.55));
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const p = user?.profile || {};

  // Profile may be stored in kg/cm (always metric in DB)
  const weight = parseFloat(p.weight) || 70;
  const height = parseFloat(p.height) || 170;
  const bmi = getBMI(weight, height);
  const status = getBMIStatus(bmi);
  const tdee = getTDEE(weight, height, parseInt(p.age) || 25, p.gender || "male", p.activity || "moderate");
  const calMap = { lose: tdee - 400, maintain: tdee, gain: tdee + 300, endurance: tdee + 200, strength: tdee + 150 };
  const calories = calMap[p.goal] || tdee;
  const protein = Math.round(weight * 2.0);

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";

  const idealWeight = Math.round(p.gender === "female" ? 45.5 + 2.3 * ((height - 152.4) / 2.54) : 50 + 2.3 * ((height - 152.4) / 2.54));

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-m)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: 3 }}>{greeting}, OPERATOR</div>
        <div style={{ fontFamily: "var(--font-d)", fontSize: "1.8rem", fontWeight: 900, color: "var(--neon-cyan)", filter: "drop-shadow(0 0 12px rgba(0,245,255,0.5))" }}>
          {(user?.name || "UNKNOWN").toUpperCase()}
        </div>
      </div>

      <div className="grid-4 mb-4">
        {[
          { label: "Body Mass Index", val: bmi.toFixed(1), unit: status.label, accent: status.color },
          { label: "Daily Calories", val: calories, unit: "kcal / target", accent: "#39ff14" },
          { label: "Protein Target", val: protein, unit: "grams / day", accent: "#ff6b00" },
          { label: "Tasks Done", val: `${done}/${total}`, unit: `${pct}% complete`, accent: "#ff006e" },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ "--accent": s.accent }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.accent, filter: `drop-shadow(0 0 8px ${s.accent})` }}>{s.val}</div>
            <div className="stat-unit" style={{ color: s.accent }}>{s.unit}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Biometric Analysis</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "HEIGHT", val: `${Math.round(height)} cm`, color: "var(--neon-cyan)" },
              { label: "WEIGHT", val: `${Math.round(weight)} kg`, color: "var(--neon-green)" },
              { label: "IDEAL WT", val: `${idealWeight} kg`, color: "#ff6b00" },
              { label: "TDEE", val: `${tdee} kcal`, color: "var(--neon-pink)" },
            ].map(b => (
              <div key={b.label}>
                <div style={{ fontFamily: "var(--font-m)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: 2, marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", color: b.color }}>{b.val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "var(--font-m)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: 2, marginBottom: 4 }}>BMI SPECTRUM</div>
            <div className="bmi-meter">
              <div className="bmi-needle" style={{ left: `${getBMIPct(bmi)}%` }} />
            </div>
            <div className="bmi-labels"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Performance Rings</div>
          <div style={{ display: "flex", gap: 20, justifyContent: "space-around", flexWrap: "wrap" }}>
            <ProgressRing value={done} max={total || 1} color="var(--neon-cyan)" size={90} label="Tasks" unit={`${pct}%`} />
            <ProgressRing value={protein} max={200} color="var(--neon-green)" size={90} label="Protein" unit="g" />
            <ProgressRing value={calories} max={3500} color="var(--neon-pink)" size={90} label="Calories" unit="kcal" />
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-title">Nutrition Breakdown</div>
        <div className="grid-3">
          {[
            { label: "Protein", g: protein, kcal: protein * 4, color: "#39ff14" },
            { label: "Carbs", g: Math.round(calories * 0.45 / 4), kcal: Math.round(calories * 0.45), color: "#ff6b00" },
            { label: "Fats", g: Math.round(calories * 0.25 / 9), kcal: Math.round(calories * 0.25), color: "#00f5ff" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center", padding: 16, background: "rgba(0,245,255,0.03)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-m)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: 2, marginBottom: 8 }}>{m.label.toUpperCase()}</div>
              <div style={{ fontFamily: "var(--font-d)", fontSize: "1.6rem", color: m.color, filter: `drop-shadow(0 0 8px ${m.color})` }}>{m.g}g</div>
              <div style={{ fontFamily: "var(--font-m)", fontSize: "0.65rem", color: "var(--text-dim)", marginTop: 4 }}>{m.kcal} kcal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
