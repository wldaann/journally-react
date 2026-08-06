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

function Dashboard() {
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState("Semua");
  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("Semua");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setJournals(getJournals());
  }, []);

  const filteredJournals = journals
  .filter((journal) => {

    const matchSearch =
      journal.title.toLowerCase().includes(search.toLowerCase());

    const matchMood =
      selectedMood === "Semua" ||
      journal.mood === selectedMood;

    const matchTag =
      selectedTag === "Semua" ||
      journal.tag === selectedTag;

    return matchSearch && matchMood && matchTag;

  })
  .sort((a, b) => {

    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "oldest") return a.id - b.id;
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "za") return b.title.localeCompare(a.title);

    return 0;
  });

const favoriteJournals = journals.filter(
  (journal) => journal.favorite
);

const happyCount = journals.filter(
  (journal) => journal.mood === "😊 Happy"
).length;

const neutralCount = journals.filter(
  (journal) => journal.mood === "😐 Neutral"
).length;

const sadCount = journals.filter(
  (journal) => journal.mood === "😔 Sad"
).length;

const mostMood =
  happyCount >= neutralCount && happyCount >= sadCount
    ? "😊 Happy"
    : neutralCount >= happyCount && neutralCount >= sadCount
    ? "😐 Neutral"
    : "😔 Sad";

const handleDelete = (id) => {
  deleteJournal(id);
  setJournals(getJournals());
};

const hour = new Date().getHours();

let greeting = "Good Evening 🌙";

if (hour >= 5 && hour < 12) {
  greeting = "Good Morning ☀️";
} else if (hour >= 12 && hour < 18) {
  greeting = "Good Afternoon 🌤️";
}

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">

        {/* Judul */}
       <div className="mt-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">

  <div className="flex items-start justify-between">

    <div>

      <p className="uppercase tracking-[0.25em] text-slate-300 text-sm font-medium">
        JOURNALLY
      </p>

      <h2 className="mt-4 text-4xl font-bold">
  {greeting} 👋
</h2>

<p className="mt-4 max-w-2xl text-slate-300 leading-8">
  Capture your daily thoughts, organize your memories,
and build a better version of yourself every day.
</p>

    </div>

    <div className="flex gap-3">

  <button
  onClick={() => exportAllJournalsPDF(journals)}
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


<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

  <h3 className="text-xl font-bold mb-6">
    🔎 Journal Controls
  </h3>

 <SearchBar
  search={search}
  setSearch={setSearch}
/>

<div className="mt-6">
  <p className="text-sm font-semibold text-gray-600 mb-2">
    😊 Filter Mood
  </p>

<MoodFilter
  selectedMood={selectedMood}
  setSelectedMood={setSelectedMood}
/> 
</div>

<div className="mt-6">
  <p className="text-sm font-semibold text-gray-600 mb-2">
    🏷️ Filter Tag
  </p>

<TagFilter
  selectedTag={selectedTag}
  setSelectedTag={setSelectedTag}
  journals={journals}
/>
</div>

<div className="mt-6">
  <p className="text-sm font-semibold text-gray-600 mb-2">
    📅 Urutkan Journal
  </p>

<SortJournal
  sortBy={sortBy}
  setSortBy={setSortBy}
/>
</div>
</div>

{/* FAVORITE JOURNAL */}

<div className="mt-12">

  <h2 className="text-2xl font-bold mb-6">
    ❤️ Favorite Journals
  </h2>

  {favoriteJournals.length === 0 ? (

    <div className="rounded-3xl bg-white p-8 shadow-sm text-center">

      <div className="text-5xl">
        🤍
      </div>

      <h3 className="mt-4 text-xl font-bold">
        Belum ada journal favorit
      </h3>

      <p className="mt-2 text-gray-500">
        Klik ikon ❤️ pada halaman History untuk menambahkan favorit.
      </p>

    </div>

  ) : (

    <div className="space-y-5">

      {favoriteJournals.map((journal) => (

        <JournalCard
          key={journal.id}
          id={journal.id}
          title={journal.title}
          content={journal.content}
          mood={journal.mood}
          tag={journal.tag}
          date={journal.date}
          onDelete={handleDelete}
        />

      ))}

    </div>

  )}

</div>

        {/* Ringkasan */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            📊 Ringkasan Hari Ini
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <SummaryCard
  title="Favorite"
  value={favoriteJournals.length}
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

        {/* Journal */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            📝 Journal Terbaru
          </h2>

          {filteredJournals.length === 0 ? (

            <p className="text-gray-500">
  {search
    ? "Journal tidak ditemukan."
    : "Belum ada journal."}
</p>

          ) : (

            <div className="space-y-5">

              {filteredJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  id={journal.id}
                  title={journal.title}
                  content={journal.content}
                  mood={journal.mood}
                  tag={journal.tag}
                  date={journal.date} 
                  onDelete={handleDelete}
                />
              ))}

            </div>

          )}

        </div>

      </div>

<Footer />

    </div>

  );
}

export default Dashboard;