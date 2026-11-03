
import { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil Todo dari MySQL melalui backend
  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await getTodos();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil Todo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function resetForm() {
    setTaskTitle("");
    setTaskPriority("medium");
    setTaskDeadline("");
    setEditingTask(null);
  }

  // Tambah Todo ke MySQL
  async function addTask() {
    if (!taskTitle.trim()) {
      setError("Judul Todo wajib diisi.");
      return;
    }

    setError("");

    try {
      const newTask = await addTodo({
        title: taskTitle.trim(),
        priority: taskPriority,
        deadline: taskDeadline || null,
      });

      setTasks((previous) => [...previous, newTask]);
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menambahkan Todo.");
    }
  }

  // Centang atau batalkan Todo
  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setError("");

    try {
      const updatedTask = await updateTodo(id, {
        completed: !task.completed,
      });

      setTasks((previous) =>
        previous.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch (err) {
      setError(err.message || "Gagal mengubah status Todo.");
    }
  }

  // Hapus Todo dari MySQL
  async function handleDeleteTask(id) {
    const previousTasks = tasks;
    setError("");

    try {
      await deleteTodo(id);
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError(err.message || "Gagal menghapus Todo.");
      setTasks(previousTasks);
    }
  }

  // Mulai edit
  function startEdit(task) {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskPriority(task.priority || "medium");
    setTaskDeadline(
      task.deadline
        ? String(task.deadline).slice(0, 10)
        : ""
    );
  }

  // Simpan perubahan ke MySQL
  async function handleUpdateTask() {
    if (!taskTitle.trim()) {
      setError("Judul Todo wajib diisi.");
      return;
    }

    if (!editingTask) return;

    setError("");

    try {
      const updatedTask = await updateTodo(editingTask.id, {
        title: taskTitle.trim(),
        priority: taskPriority,
        deadline: taskDeadline || null,
      });

      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id ? updatedTask : task
        )
      );

      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan perubahan.");
    }
  }

  function cancelEdit() {
    resetForm();
    setError("");
  }

  function getPriorityLabel(priority) {
    if (priority === "high") return "🔴 High";
    if (priority === "low") return "🟢 Low";
    return "🟡 Medium";
  }

  function formatDeadline(deadline) {
    if (!deadline) return "No deadline";

    const date = new Date(`${String(deadline).slice(0, 10)}T00:00:00`);

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function isOverdue(task) {
    if (!task.deadline || task.completed) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(
      `${String(task.deadline).slice(0, 10)}T00:00:00`
    );

    return deadline < today;
  }

  // Filter berdasarkan status dan pencarian
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return Number(b.id) - Number(a.id);
      }

      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return (
          new Date(`${String(a.deadline).slice(0, 10)}T00:00:00`) -
          new Date(`${String(b.deadline).slice(0, 10)}T00:00:00`)
        );
      }

      if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };

        return (
          (priorityOrder[a.priority] || 2) -
          (priorityOrder[b.priority] || 2)
        );
      }

      return 0;
    });

  const allCount = tasks.length;
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-gray-500">
            Get things done, one task at a time.
          </p>
        </div>

        {error && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Tutup pesan error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form tambah dan edit */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editingTask ? handleUpdateTask() : addTask();
              }
            }}
            placeholder="What do you need to do?"
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <input
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <div className="flex gap-3">
            <button
              onClick={editingTask ? handleUpdateTask : addTask}
              disabled={loading}
              className="flex-1 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
            >
              {editingTask ? "Save Changes" : "+ Add Task"}
            </button>

            {editingTask && (
              <button
                onClick={cancelEdit}
                className="rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-600 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Pencarian */}
        <div className="relative mt-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔎
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Pengurutan */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          >
            <option value="newest">🆕 Newest</option>
            <option value="deadline">📅 Deadline</option>
            <option value="priority">🔴 Priority</option>
          </select>
        </div>

        {/* Filter */}
        <div className="mt-4 flex gap-2 rounded-xl bg-white p-2 shadow-sm">
          {[
            { value: "all", label: `All (${allCount})` },
            { value: "active", label: `Active (${activeCount})` },
            { value: "completed", label: `Completed (${completedCount})` },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-green-500 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Daftar Todo */}
        <div className="mt-6 space-y-3">
          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Memuat Todo dari database...
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
                      task.completed
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                    aria-label={
                      task.completed
                        ? "Tandai belum selesai"
                        : "Tandai selesai"
                    }
                  >
                    {task.completed && "✓"}
                  </button>

                  <div>
                    <span
                      className={`text-base ${
                        task.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="mt-1 text-xs text-gray-500">
                      {getPriorityLabel(task.priority || "medium")}
                    </div>

                    {task.deadline && (
                      <div
                        className={`mt-1 text-xs ${
                          isOverdue(task)
                            ? "font-semibold text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        📅 {formatDeadline(task.deadline)}
                        {isOverdue(task) && " • Overdue"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(task)}
                    className="rounded-lg px-3 py-2 text-blue-400 transition hover:bg-blue-50 hover:text-blue-500"
                    aria-label="Edit Todo"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-lg px-3 py-2 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Hapus Todo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredTasks.length === 0 && (
          <div className="mt-10 text-center text-gray-400">
            {search
              ? "Task yang kamu cari tidak ditemukan. 🔎"
              : filter === "all"
              ? "Belum ada task. Yuk tambahkan task pertama kamu! ✨"
              : filter === "active"
              ? "Tidak ada task yang belum selesai. 🎉"
              : "Belum ada task yang selesai."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Todo;
