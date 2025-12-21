import "../assets/global.css";

export default function TodoSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="todo-skeleton" key={index}>
          <div className="skeleton-title"></div>
          <div className="skeleton-desc"></div>
        </div>
      ))}
    </>
  );
}
