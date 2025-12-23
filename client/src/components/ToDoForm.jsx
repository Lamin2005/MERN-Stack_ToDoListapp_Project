import { useEffect, useState } from "react";
import "../assets/global.css";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../utils/auth";

function TodoForm({ setAdd, settodos, control }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const navigate = useNavigate();
  let [editMode, setEditMode] = useState(control === "edit" ? true : false);
  let { id } = useParams();
  const token = getToken();

  const addTodo = async () => {
    const postData = {
      title,
      description,
      priority,
    };

    const response = await fetch(`${import.meta.env.VITE_URL}/todolists`, {
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

  const editTodo = async () => {
    const postData = {
      title,
      description,
      priority,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/todolists-edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editMode) {
      editTodo();
    } else {
      addTodo({ title, description, priority });
    }

    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  const getTodolist = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/todolists-edit/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Posted Data:", data.result);
      setTitle(data.result.title);
      setDescription(data.result.description);
      setPriority(data.result.priority);
    } else if (response.status === 401) {
      alert(`${data.message}`);
      navigate("/auth?mode=signin");
    } else {
      alert(`${data.message}`);
    }
  };

  useEffect(() => {
    getTodolist();
  }, [editMode, id]);

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{!editMode ? "Create" : "Edit"} Task</h2>

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
        {!editMode ? "Add" : "Edit"} Task
      </button>
    </form>
  );
}

export default TodoForm;
