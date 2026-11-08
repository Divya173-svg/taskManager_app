import { useState } from "react";

function TaskItem({ task, completeTask, saveEdit, deleteTask, isOverdue }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  function handleSave() {
    if (editTitle.trim() === "") {
      alert("Task title cannot be blank.");
      return;
    }

    saveEdit(task.id, editTitle);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditTitle(task.title);
    setIsEditing(false);
  }

  return (
    <div className="task">
      <input
        type="checkbox"
        aria-label={`Mark ${task.title} as completed`}
        checked={task.completed}
        onChange={() => completeTask(task.id)}
      />

      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          aria-label="Edit task title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }

            if (e.key === "Escape") {
              handleCancel();
            }
          }}
        />
      ) : (
        <span className={task.completed ? "completed" : ""}>{task.title}</span>
      )}

      <span
        className={`priority-${task.priority.toLowerCase()}`}
        style={{
          padding: "5px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {task.priority}
      </span>

      <span>
        Due Date:{" "}
        {task.dueDate
          ? new Date(task.dueDate + "T00:00:00").toLocaleDateString()
          : "No due date"}
      </span>

      {isOverdue(task) && <span className="overdue-label">Overdue</span>}

      {isEditing ? (
        <>
          <button className="save-button" onClick={handleSave} type="button">
            Save
          </button>

          <button
            className="cancel-button"
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="edit-button"
          onClick={() => {
            setEditTitle(task.title);
            setIsEditing(true);
          }}
          type="button"
        >
          Edit
        </button>
      )}

      <button
        className="delete-button"
        onClick={() => deleteTask(task)}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}

export default TaskItem;
