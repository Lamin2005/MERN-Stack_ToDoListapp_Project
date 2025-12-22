import TodoForm from "../components/ToDoForm";
import TodoList from "../components/ToDoList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import TodoSkeleton from "../components/TodoSkeleton";

function Home() {
  let [add, setAdd] = useState(false);
  let [loading, setLoading] = useState(true);
  let [todos, settodos] = useState([]);
  let token = getToken();
  let [status, setStatus] = useState("all");

  const toggleComplete = async (id, currentstatus) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/todolists/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completed: !currentstatus }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        settodos((prev) => prev.map((t) => (t._id === id ? data.result : t)));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const getTodolist = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/todolists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        settodos(data.result);
      } else if (response.status === 401) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      settodos([]);
      return;
    }
    getTodolist();
    console.log("fetch");
  }, [token]);

  const filteredTodos = todos.filter((todo) => {
    if (status === "all") return true;
    if (status === "completed") return todo.completed === true;
    if (status === "doing") return todo.completed === false;
    return true;
  });

  console.log(status);

  return (
    <section className="home-page">
      {!add && (
        <>
          <button
            className="todo-btn"
            onClick={() => {
              setAdd(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Task
          </button>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              margin: "30px 0px 10px 0px",
            }}
          >
            <button
              className={`filter-btn ${
                status === "all" ? "active-filter" : ""
              }`}
              onClick={() => setStatus("all")}
            >
              All tasks
            </button>
            <button
              className={`filter-btn ${
                status === "completed" ? "active-filter" : ""
              }`}
              onClick={() => {
                setStatus("completed");
              }}
            >
              Complete
            </button>
            <button
              className={`filter-btn ${
                status === "doing" ? "active-filter" : ""
              }`}
              onClick={() => {
                setStatus("doing");
              }}
            >
              Doing
            </button>
          </div>
        </>
      )}

      {loading && <TodoSkeleton count={5} />}

      {add && (
        <button className="todo-btn" onClick={() => setAdd(false)}>
          <FontAwesomeIcon icon={faArrowRotateBackward} /> Back
        </button>
      )}

      <br />
      {add && <TodoForm setAdd={setAdd} settodos={settodos} />}

      {!loading && todos && (
        <>
          {!add &&
            (filteredTodos.length === 0 ? (
              <p className="empty-msg">No tasks yet. Add one!</p>
            ) : (
              filteredTodos
                .filter(Boolean)
                .map((todo) => (
                  <TodoList
                    key={todo._id}
                    todo={todo}
                    toggleComplete={toggleComplete}
                  />
                ))
            ))}
        </>
      )}
    </section>
  );
}

export default Home;
