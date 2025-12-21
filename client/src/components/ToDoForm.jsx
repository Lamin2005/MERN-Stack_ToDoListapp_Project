import { useState } from "react";
import "../assets/global.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

function TodoForm({ setAdd, settodos }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const navigate = useNavigate();

  const addTodo = async () => {
    const postData = {
      title,
      description,
      priority,
    };

    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`${data.message}`);
      console.log("Posted Data:", data);
      setAdd(false);
      settodos((prev) => [data.result, ...prev]);
    } else if (response.status === 401) {
      alert(`${data.message}`);
      navigate("/auth?mode=signin");
    } else {
      alert(`${data.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo({ title, description, priority });

    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Create Task</h2>

      <input
        type="text"
        name="title"
        className="todo-input"
        placeholder="Write your task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        name="description"
        className="todo-input"
        placeholder="Write your task description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        name="priority"
        className="todo-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="" disabled>
          Select Priority
        </option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
}

export default TodoForm;
