function TaskForm({
  title,
  setTitle,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
}) {
  return (
    <form className="task-input" onSubmit={addTask}>
      <input
        type="text"
        placeholder="Enter your task..."
        aria-label="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        aria-label="Task priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        aria-label="Task due date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
