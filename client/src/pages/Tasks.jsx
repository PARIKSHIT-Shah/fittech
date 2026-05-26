import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import "../index.css";

const CATEGORIES = ["cardio", "strength", "recovery", "nutrition", "custom"];
const CAT_CLASS   = { cardio: "tag-cardio", strength: "tag-strength", recovery: "tag-recovery", nutrition: "tag-nutrition", custom: "tag-custom" };

export default function Tasks() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();
  const [input, setInput] = useState("");
  const [tag,   setTag]   = useState("cardio");
  const [filter,setFilter]= useState("all");

  const add = async () => {
    if (!input.trim()) return;
    await addTask(input.trim(), tag);
    setInput("");
  };

  const filtered =
    filter === "all"     ? tasks :
    filter === "done"    ? tasks.filter(t => t.done) :
    filter === "pending" ? tasks.filter(t => !t.done) :
    tasks.filter(t => t.tag === filter);

  return (
    <div className="page">
      <div className="panel mb-4">
        <div className="panel-title">Add New Task</div>
        <div className="todo-input-row">
          <input className="field-input" placeholder="// enter fitness task..." value={input}
            onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
          <button className="btn btn-green" onClick={add}>+ ADD</button>
        </div>
        <div>
          <div className="field-label">Category</div>
          <div className="tag-select">
            {CATEGORIES.map(c => (
              <button key={c} className={`tag-btn ${tag === c ? "selected" : ""}`} onClick={() => setTag(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {["all", "pending", "done", ...CATEGORIES].map(f => (
          <button key={f}
            className={`btn btn-sm ${filter === f ? "btn-cyan" : ""}`}
            style={filter !== f ? { borderColor: "var(--border)", color: "var(--text-dim)", background: "transparent" } : {}}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">Mission Queue ({filtered.length})</div>
        {loading ? (
          <div className="text-dim" style={{ fontFamily: "var(--font-m)", fontSize: "0.75rem" }}>// loading tasks from server...</div>
        ) : (
          <div className="todo-list scrollable">
            {filtered.length === 0 && (
              <div className="text-dim" style={{ padding: "20px 0", fontFamily: "var(--font-m)", fontSize: "0.75rem" }}>// no tasks found</div>
            )}
            {filtered.map(todo => (
              <div key={todo._id} className={`todo-item ${todo.done ? "done" : ""}`}>
                <div className="todo-check" onClick={() => toggleTask(todo._id, todo.done)}>
                  {todo.done && <span style={{ color: "#020408", fontSize: "0.7rem", fontWeight: 900 }}>✓</span>}
                </div>
                <span className="todo-text">{todo.text}</span>
                <span className={`todo-tag ${CAT_CLASS[todo.tag] || "tag-custom"}`}>{todo.tag}</span>
                <button className="todo-delete" onClick={() => deleteTask(todo._id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
