import { useState, useEffect } from "react";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskItem from "./components/TaskItem";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [deletedTask, setDeletedTask] = useState(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");

  // Load tasks from localStorage or JSON file
  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const savedTasks = localStorage.getItem("myTasks");

      if (savedTasks !== null) {
        try {
          const parsedTasks = JSON.parse(savedTasks);

          if (!Array.isArray(parsedTasks)) {
            throw new Error("Invalid saved tasks");
          }

          setTasks(parsedTasks);
          setIsLoaded(true);
          return;
        } catch {
          localStorage.removeItem("myTasks");
        }
      }

      const response = await fetch("/tasks.json");

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid tasks data");
      }

      setTasks(data);
      setIsLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("myTasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Add a new task
  function addTask(e) {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a task title.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      priority: priority,
      dueDate: dueDate === "" ? null : dueDate,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    setTitle("");
    setPriority("Medium");
    setDueDate("");
  }

  // Filter tasks by status and search
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active" && task.completed) {
      return false;
    }

    if (filter === "Completed" && !task.completed) {
      return false;
    }

    return task.title.toLowerCase().includes(search.toLowerCase());
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    }

    if (sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });

  // Count incomplete tasks
  const remainingTasks = tasks.filter((task) => !task.completed).length;

  // Complete or uncomplete a task
  function completeTask(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  // Save edited task title
  function saveEdit(id, newTitle) {
    if (newTitle.trim() === "") {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title: newTitle.trim() } : task,
      ),
    );
  }

  // Delete task after confirmation
  function deleteTask(task) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmDelete) {
      return;
    }

    setDeletedTask(task);

    setTasks((prevTasks) => prevTasks.filter((item) => item.id !== task.id));
  }

  // Undo last deletion
  function undoDelete() {
    if (deletedTask === null) {
      return;
    }

    setTasks((prevTasks) => [...prevTasks, deletedTask]);

    setDeletedTask(null);
  }

  // Check whether a task is overdue
  function isOverdue(task) {
    if (task.completed || !task.dueDate) {
      return false;
    }

    const today = new Date();

    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return task.dueDate < todayString;
  }

  return (
    <div className="app">
      <div className="container">
        <h1>My Task Manager</h1>

        <TaskForm
          title={title}
          setTitle={setTitle}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
          addTask={addTask}
        />

        <TaskFilters
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filter={filter}
          setFilter={setFilter}
          remainingTasks={remainingTasks}
        />

        {loading && <p className="message">Loading tasks...</p>}

        {!loading && error && (
          <div className="error-message">
            <p>{error}</p>

            <button onClick={loadTasks} type="button">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="task-list">
            {sortedTasks.length === 0 ? (
              <p className="message">No tasks found.</p>
            ) : (
              sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  completeTask={completeTask}
                  saveEdit={saveEdit}
                  deleteTask={deleteTask}
                  isOverdue={isOverdue}
                />
              ))
            )}
          </div>
        )}

        {deletedTask && (
          <div className="undo-section">
            <span>Task deleted successfully!</span>

            <button onClick={undoDelete} type="button">
              Undo
            </button>

            <button onClick={() => setDeletedTask(null)} type="button">
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
