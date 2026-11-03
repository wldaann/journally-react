import Footer from "../components/Footer";
import SortJournal from "../components/SortJournal";
import TagFilter from "../components/TagFilter";
import MoodFilter from "../components/MoodFilter";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportAllJournalsPDF } from "../utils/exportAllPDF";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import JournalCard from "../components/JournalCard";

import {
  getJournals,
  deleteJournal,
} from "../services/journalService";

import {
  getHabits,
} from "../services/habitService";

import {
  getTodos,
} from "../services/todoService";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // JOURNAL STATE
  // =========================

  const [selectedMood, setSelectedMood] =
    useState("Semua");

  const [journals, setJournals] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedTag, setSelectedTag] =
    useState("Semua");

  const [sortBy, setSortBy] =
    useState("newest");

  // =========================
  // HABIT & TODO STATE
  // =========================

  const [habits, setHabits] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  // =========================
  // LOAD DATA
  // =========================

  


useEffect(() => {
  async function loadDashboardData() {
    // Mengambil jurnal dari MySQL
    try {
      const dataJournals = await getJournals();
      setJournals(
        Array.isArray(dataJournals) ? dataJournals : []
      );
    } catch (error) {
      console.error("Gagal mengambil Journal:", error);
      setJournals([]);
    }

    // Mengambil habit dari MySQL
    try {
      const dataHabits = await getHabits();
      setHabits(
        Array.isArray(dataHabits) ? dataHabits : []
      );
    } catch (error) {
      console.error("Gagal mengambil Habit:", error);
      setHabits([]);
    }

    // Mengambil Todo dari MySQL
    try {
      const dataTodos = await getTodos();
      setTasks(
        Array.isArray(dataTodos) ? dataTodos : []
      );
    } catch (error) {
      console.error("Gagal mengambil Todo:", error);
      setTasks([]);
    }
  }

  loadDashboardData();
}, []);




  // =========================
  // FILTER JOURNAL
  // =========================

  const filteredJournals = journals
    .filter((journal) => {

      const matchSearch =
        journal.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchMood =
        selectedMood === "Semua" ||
        journal.mood === selectedMood;

      const matchTag =
        selectedTag === "Semua" ||
        journal.tag === selectedTag;

      return (
        matchSearch &&
        matchMood &&
        matchTag
      );
    })
    .sort((a, b) => {

      if (sortBy === "newest") {
        return b.id - a.id;
      }

      if (sortBy === "oldest") {
        return a.id - b.id;
      }

      if (sortBy === "az") {
        return a.title.localeCompare(
          b.title
        );
      }

      if (sortBy === "za") {
        return b.title.localeCompare(
          a.title
        );
      }

      return 0;
    });

  // =========================
  // JOURNAL STATISTICS
  // =========================

  const favoriteJournals =
    journals.filter(
      (journal) => journal.favorite
    );

  const happyCount =
    journals.filter(
      (journal) =>
        journal.mood === "😊 Happy"
    ).length;

  const neutralCount =
    journals.filter(
      (journal) =>
        journal.mood === "😐 Neutral"
    ).length;

  const sadCount =
    journals.filter(
      (journal) =>
        journal.mood === "😔 Sad"
    ).length;

  const mostMood =
    happyCount >= neutralCount &&
    happyCount >= sadCount
      ? "😊 Happy"
      : neutralCount >= happyCount &&
        neutralCount >= sadCount
      ? "😐 Neutral"
      : "😔 Sad";

  // =========================
  // DELETE JOURNAL
  // =========================

  
const handleDelete = async (id) => {
  try {
    await deleteJournal(id);

    setJournals((previous) =>
      previous.filter(
        (journal) => journal.id !== id
      )
    );
  } catch (error) {
    console.error("Gagal menghapus Journal:", error);
    alert(error.message || "Gagal menghapus jurnal.");
  }
};


  // =========================
  // TODAY'S DATE
  // =========================

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  // =========================
  // HABIT STATISTICS
  // =========================

  const completedHabitsToday =
    habits.filter((habit) =>
      habit.completedDates?.includes(
        todayString
      )
    ).length;

  const totalHabits =
    habits.length;

  const habitProgress =
    totalHabits > 0
      ? Math.round(
          (completedHabitsToday /
            totalHabits) *
            100
        )
      : 0;

  // =========================
  // TODO STATISTICS
  // =========================

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const activeTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const totalTasks =
    tasks.length;

  const taskProgress =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  // =========================
  // GREETING
  // =========================

  const hour =
    new Date().getHours();

  let greeting =
    "Good Evening 🌙";

  if (hour >= 5 && hour < 12) {
    greeting =
      "Good Morning ☀️";
  } else if (
    hour >= 12 &&
    hour < 18
  ) {
    greeting =
      "Good Afternoon 🌤️";
  }

  // =========================
  // RETURN
  // =========================

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="mx-auto max-w-5xl p-8">

        {/* =========================
            HERO
        ========================= */}

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-300">
                JOURNALLY
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                {greeting} 👋
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                Capture your daily thoughts,
                organize your memories,
                and build a better version
                of yourself every day.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  exportAllJournalsPDF(
                    journals
                  )
                }
                className="rounded-xl border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700 transition-all duration-300 hover:bg-green-100 hover:shadow-lg"
              >
                ⬇ Download Report
              </button>

            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-white/20 px-4 py-2">
              📝 {journals.length} Journals
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2">
              ❤️ {favoriteJournals.length} Favorites
            </span>

            <span className="rounded-full bg-white/20 px-4 py-2">
              😊 {mostMood}
            </span>

          </div>

        </div>
{/* =========================
    QUICK ACTIONS
========================= */}

<div className="mt-8">

  <h2 className="mb-4 text-xl font-bold text-gray-900">
    ⚡ Quick Actions
  </h2>

  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

    {/* Add Task */}
    <button
      onClick={() => navigate("/todos")}
      className="group rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl transition group-hover:scale-110">
          ✅
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Add Task
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Tambahkan task baru
          </p>
        </div>

      </div>
    </button>

    {/* Manage Habits */}
    <button
      onClick={() => navigate("/habits")}
      className="group rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl transition group-hover:scale-110">
          🌱
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Manage Habits
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Kelola habit kamu
          </p>
        </div>

      </div>
    </button>

  </div>

</div>
        {/* =========================
            JOURNAL CONTROLS
        ========================= */}

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-lg">

          <h3 className="mb-6 text-xl font-bold">
            🔎 Journal Controls
          </h3>

          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <div className="mt-6">

            <p className="mb-2 text-sm font-semibold text-gray-600">
              😊 Filter Mood
            </p>

            <MoodFilter
              selectedMood={
                selectedMood
              }
              setSelectedMood={
                setSelectedMood
              }
            />

          </div>

          <div className="mt-6">

            <p className="mb-2 text-sm font-semibold text-gray-600">
              🏷️ Filter Tag
            </p>

            <TagFilter
              selectedTag={
                selectedTag
              }
              setSelectedTag={
                setSelectedTag
              }
              journals={journals}
            />

          </div>

          <div className="mt-6">

            <p className="mb-2 text-sm font-semibold text-gray-600">
              📅 Urutkan Journal
            </p>

            <SortJournal
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

          </div>

        </div>

        {/* =========================
            FAVORITE JOURNAL
        ========================= */}

        <div className="mt-12">

          <h2 className="mb-6 text-2xl font-bold">
            ❤️ Favorite Journals
          </h2>

          {favoriteJournals.length === 0 ? (

            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

              <div className="text-5xl">
                🤍
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Belum ada journal favorit
              </h3>

              <p className="mt-2 text-gray-500">
                Klik ikon ❤️ pada halaman
                History untuk menambahkan
                favorit.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {favoriteJournals.map(
                (journal) => (

                  <JournalCard
                    key={journal.id}
                    id={journal.id}
                    title={journal.title}
                    content={
                      journal.content
                    }
                    mood={journal.mood}
                    tag={journal.tag}
                    date={journal.date}
                    image={journal.image}
                    onDelete={
                      handleDelete
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

        {/* =========================
            JOURNAL SUMMARY
        ========================= */}

        <div className="mt-12">

          <h2 className="mb-6 text-2xl font-bold">
            📊 Ringkasan Hari Ini
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <SummaryCard
              title="Favorite"
              value={
                favoriteJournals.length
              }
              icon="❤️"
              color="bg-pink-100"
              subtitle="Journal Favorit"
            />

            <SummaryCard
              title="Total Journal"
              value={journals.length}
              icon="📝"
              color="bg-blue-100"
            />

            <SummaryCard
              title="Most Mood"
              value={mostMood}
              icon="😊"
              color="bg-yellow-100"
              subtitle="Mood Terbanyak"
            />

          </div>

        </div>

        {/* =========================
            PERSONAL LIFE OVERVIEW
        ========================= */}

        <div className="mt-12">

          <h2 className="mb-6 text-2xl font-bold">
            🌱 Personal Life Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* HABITS */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    🔥 Habits Today
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    {completedHabitsToday}/
                    {totalHabits}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    habits completed today
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                  🌱
                </div>

              </div>

              {/* Habit Progress */}

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${habitProgress}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-400">

                <span>
                  {habitProgress}% complete
                </span>

                <span>
                  {completedHabitsToday} of{" "}
                  {totalHabits}
                </span>

              </div>

              <button
                onClick={() =>
                  navigate("/habits")
                }
                className="mt-5 text-sm font-medium text-green-600 hover:text-green-700"
              >
                View Habits →
              </button>

            </div>

            {/* TODO */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-500">
                    ✅ Tasks
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-gray-900">
                    {completedTasks}/
                    {totalTasks}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    tasks completed
                  </p>

                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                  ✅
                </div>

              </div>

              {/* Task Progress */}

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${taskProgress}%`,
                  }}
                />

              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-400">

                <span>
                  {taskProgress}% complete
                </span>

                <span>
                  {activeTasks} active
                </span>

              </div>

              <button
                onClick={() =>
                  navigate("/todos")
                }
                className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View Tasks →
              </button>

            </div>

          </div>

        </div>

        {/* =========================
            ALL JOURNALS
        ========================= */}

        <div className="mt-12">

          {filteredJournals.length === 0 ? (

            <p className="text-gray-500">
              {search
                ? "Journal tidak ditemukan."
                : "Belum ada journal."}
            </p>

          ) : (

            <div className="space-y-5">

              {filteredJournals.map(
                (journal) => (

                  <JournalCard
                    key={journal.id}
                    id={journal.id}
                    title={journal.title}
                    content={
                      journal.content
                    }
                    mood={journal.mood}
                    tag={journal.tag}
                    date={journal.date}
                    image={journal.image}
                    onDelete={
                      handleDelete
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

      </div>

      <Footer />

    </div>
  );
}

export default Dashboard;