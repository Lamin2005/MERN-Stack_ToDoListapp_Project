import "../assets/global.css";

function TodoList({ todo, toggleComplete }) {
  return (
    <div className="todo-list-container">
      <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
        {/* PRIORITY BADGE */}
        <span className={`priority-badge ${todo.priority}`}>
          {todo.priority}
        </span>

        <div className="todo-content">
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="todo-actions">
          <button
            className="complete-btn"
            onClick={() => toggleComplete(todo._id,todo.completed)}
          >
            Complete
          </button>

          <button
            className="complete-btn"
            onClick={() => toggleComplete(todo.id)}
          >
            Edit
          </button>

          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
