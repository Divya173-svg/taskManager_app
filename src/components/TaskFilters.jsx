function TaskFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  filter,
  setFilter,
  remainingTasks,
}) {
  return (
    <>
      <h2>My Tasks</h2>

      <input
        type="text"
        placeholder="Search tasks..."
        aria-label="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        aria-label="Sort tasks"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
      </select>

      <p className="task-counter">
        {remainingTasks} {remainingTasks === 1 ? "task" : "tasks"} left
      </p>

      <div className="filter-buttons">
        <button
          className={filter === "All" ? "active-filter" : ""}
          onClick={() => setFilter("All")}
          type="button"
        >
          All
        </button>

        <button
          className={filter === "Active" ? "active-filter" : ""}
          onClick={() => setFilter("Active")}
          type="button"
        >
          Active
        </button>

        <button
          className={filter === "Completed" ? "active-filter" : ""}
          onClick={() => setFilter("Completed")}
          type="button"
        >
          Completed
        </button>
      </div>
    </>
  );
}

export default TaskFilters;
