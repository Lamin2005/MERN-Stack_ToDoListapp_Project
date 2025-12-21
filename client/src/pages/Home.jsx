import TodoForm from "../components/ToDoForm";
import TodoList from "../components/ToDoList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { useUser } from "../context/userContext";

function Home() {
  let [add, setAdd] = useState(false);
  let [loading, setLoading] = useState(true);
  let [todos, settodos] = useState([]);
  let token = getToken();
  let { user } = useUser();

  useEffect(() => {
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

    getTodolist();
    console.log("fetch");
  }, []);

  useEffect(() => {
    if (!token) {
      settodos([]);
    }
  }, [token]);

  const handleAddTask = () => {
    setAdd(true);
  };

  console.log(todos);

  return (
    <section className="home-page">
      {loading && (
        <h2
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontStyle: "italic",
          }}
        >
          Loading...
        </h2>
      )}
      {!loading && todos && (
        <>
          {!add && (
            <>
              <button className="todo-btn" onClick={handleAddTask}>
                <FontAwesomeIcon icon={faPlus} /> Add Task
              </button>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  margin: "30px 0px 0px 0px",
                }}
              >
                <button
                  className="filter-btn active-filter"
                  onClick={handleAddTask}
                >
                  All tasks
                </button>
                <button className="filter-btn" onClick={handleAddTask}>
                  Complete
                </button>
                <button className="filter-btn" onClick={handleAddTask}>
                  Doing
                </button>
              </div>
            </>
          )}
          {add && (
            <button className="todo-btn" onClick={() => setAdd(false)}>
              <FontAwesomeIcon icon={faArrowRotateBackward} /> Back
            </button>
          )}

          <br />
          {add && <TodoForm setAdd={setAdd} settodos={settodos} />}

          {!add &&
            (todos.length === 0 ? (
              <p className="empty-msg">No tasks yet. Add one!</p>
            ) : (
              todos
                .filter(Boolean)
                .map((todo) => <TodoList key={todo._id} todo={todo} />)
            ))}
        </>
      )}
    </section>
  );
}

export default Home;
