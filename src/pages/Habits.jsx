
import { useEffect, useState } from "react";
import HabitCard from "../components/HabitCard";
import {
  getHabits,
  addHabit as createHabit,
  updateHabit as editHabit,
  deleteHabit as removeHabit,
  toggleHabitCompletion,
} from "../services/habitService";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitIcon, setHabitIcon] = useState("💻");
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingDates, setSavingDates] = useState([]);

  // Mengambil habit dari MySQL
  useEffect(() => {
    async function loadHabits() {
      setLoading(true);
      setError("");

      try {
        const data = await getHabits();
        setHabits(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Gagal mengambil habit.");
      } finally {
        setLoading(false);
      }
    }

    loadHabits();
  }, []);

  function resetForm() {
    setHabitName("");
    setHabitIcon("💻");
    setEditingHabit(null);
    setShowForm(false);
  }

  // Tambah habit
  async function handleAddHabit() {
    if (!habitName.trim()) {
      setError("Nama habit wajib diisi.");
      return;
    }

    setError("");

    try {
      const newHabit = await createHabit({
        name: habitName.trim(),
        icon: habitIcon,
      });

      setHabits((previous) => [...previous, newHabit]);
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menambahkan habit.");
    }
  }

  // Hapus habit
  async function handleDeleteHabit(id) {
    setError("");

    try {
      await removeHabit(id);

      setHabits((previous) =>
        previous.filter((habit) => habit.id !== id)
      );

      if (editingHabit?.id === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Gagal menghapus habit.");
    }
  }

  // Checklist harian dengan pengamanan request
  async function toggleDay(id, date) {
    const key = `${id}-${date}`;

    // Cegah klik berulang pada tanggal yang sedang disimpan
    if (savingDates.includes(key)) return;

    const habit = habits.find(
      (item) => String(item.id) === String(id)
    );

    if (!habit) return;

    const previousDates = habit.completedDates || [];
    const alreadyCompleted = previousDates.includes(date);
    const completed = !alreadyCompleted;

    // Tandai tanggal sedang diproses
    setSavingDates((previous) => [...previous, key]);

    // Update tampilan secara langsung
    setHabits((previous) =>
      previous.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              completedDates: completed
                ? [...(item.completedDates || []), date]
                : (item.completedDates || []).filter(
                    (itemDate) => itemDate !== date
                  ),
            }
          : item
      )
    );

    setError("");

    try {
      await toggleHabitCompletion(id, date, completed);
    } catch (err) {
      // Kembalikan hanya tanggal yang gagal disimpan
      setHabits((previous) =>
        previous.map((item) => {
          if (String(item.id) !== String(id)) {
            return item;
          }

          const currentDates = item.completedDates || [];

          return {
            ...item,
            completedDates: previousDates,
          };
        })
      );

      setError(err.message || "Gagal menyimpan checklist.");
    } finally {
      setSavingDates((previous) =>
        previous.filter((item) => item !== key)
      );
    }
  }

  // Mulai edit
  function startEdit(habit) {
    setEditingHabit(habit);
    setHabitName(habit.name);
    setHabitIcon(habit.icon);
    setShowForm(true);
    setError("");
  }

  // Simpan edit
  async function handleUpdateHabit() {
    if (!habitName.trim()) {
      setError("Nama habit wajib diisi.");
      return;
    }

    if (!editingHabit) return;

    setError("");

    try {
      const updatedHabit = await editHabit(editingHabit.id, {
        name: habitName.trim(),
        icon: habitIcon,
      });

      setHabits((previous) =>
        previous.map((habit) =>
          habit.id === editingHabit.id
            ? { ...habit, ...updatedHabit }
            : habit
        )
      );

      resetForm();
    } catch (err) {
      setError(err.message || "Gagal mengubah habit.");
    }
  }

  function closeForm() {
    resetForm();
    setError("");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🌱 My Habits
            </h1>

            <p className="mt-2 text-gray-500">
              Build consistency, one day at a time.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                closeForm();
              } else {
                setError("");
                setShowForm(true);
              }
            }}
            className="rounded-xl bg-green-500 px-4 py-2 font-medium text-white transition hover:bg-green-600"
          >
            + Add Habit
          </button>
        </div>

        {/* Pesan error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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

        {/* Form tambah / edit */}
        {showForm && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              {editingHabit ? "Edit Habit" : "Add New Habit"}
            </h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Habit name
              </label>

              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editingHabit
                      ? handleUpdateHabit()
                      : handleAddHabit();
                  }
                }}
                placeholder="Contoh: Olahraga"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-500"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Choose icon
              </label>

              <div className="flex gap-2">
                {["💻", "📖", "🏃", "💧", "🧘", "🎨"].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setHabitIcon(icon)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg ${
                      habitIcon === icon
                        ? "border-green-500 bg-green-100"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeForm}
                className="rounded-xl border border-gray-200 px-4 py-2 text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={
                  editingHabit
                    ? handleUpdateHabit
                    : handleAddHabit
                }
                disabled={loading}
                className="rounded-xl bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:opacity-50"
              >
                {editingHabit ? "Save Changes" : "Add Habit"}
              </button>
            </div>
          </div>
        )}

        {/* Habit List */}
        <div className="space-y-4">
          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Memuat habit dari database...
            </p>
          ) : habits.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-400 shadow-sm">
              <p className="text-4xl">🌱</p>
              <p className="mt-3">Belum ada habit.</p>
              <p className="mt-1 text-sm">
                Yuk tambahkan habit pertamamu!
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                icon={habit.icon}
                completedDates={habit.completedDates || []}
                onDelete={() => handleDeleteHabit(habit.id)}
                onEdit={() => startEdit(habit)}
                onToggleDay={toggleDay}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Habits;
