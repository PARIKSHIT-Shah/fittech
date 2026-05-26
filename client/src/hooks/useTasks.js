import { useState, useEffect } from "react";
import api from "../api/axios";

export function useTasks() {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("fetchTasks:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (text, tag) => {
    const res = await api.post("/tasks", { text, tag });
    setTasks((t) => [res.data, ...t]);
  };

  const toggleTask = async (id, done) => {
    const res = await api.put(`/tasks/${id}`, { done: !done });
    setTasks((t) => t.map((x) => (x._id === id ? res.data : x)));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((t) => t.filter((x) => x._id !== id));
  };

  return { tasks, loading, addTask, toggleTask, deleteTask };
}
