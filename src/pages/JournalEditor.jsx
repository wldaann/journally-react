import Footer from "../components/Footer";
import { toast } from "react-toastify";
import MoodCard from "../components/MoodCard";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  saveJournal,
  getJournalById,
  updateJournal,
} from "../services/journalService";

function JournalEditor() {
  const navigate = useNavigate();
  const { id } = useParams();

console.log(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tag, setTag] = useState("");
  useEffect(() => {

  if (!id) return;

  const journal = getJournalById(id);

  if (journal) {

    setTitle(journal.title);

    setContent(journal.content);

    setMood(journal.mood);

    setTag(journal.tag);

  }

}, [id]);   

  const handleSave = () => {
  if (!title || !content || !mood || !tag) {
    toast.error("Semua field harus diisi!");
    return;
  }

  if (id) {
    const updatedJournal = {
  id: Number(id),
  title,
  content,
  mood,
  tag,
  favorite:
    getJournalById(id)?.favorite ?? false,
  date: new Date().toLocaleDateString("id-ID"),
};

    updateJournal(updatedJournal);

   toast.success("Journal berhasil diperbarui! 🎉");
  } else {
    const newJournal = {
  id: Date.now(),
  title,
  content,
  mood,
  tag,
  favorite: false,
  date: new Date().toLocaleDateString("id-ID"),
};

    saveJournal(newJournal);

    alert("Journal berhasil disimpan! 🎉");
  }

  navigate("/");
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-6">

  <button
    onClick={() => navigate("/")}
    className="text-sm text-slate-500 transition hover:text-blue-600"
  >
    ← Back to Dashboard
  </button>

  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
    Journally
  </p>

  <h1 className="mt-3 text-5xl font-extrabold text-slate-900">
    Write Today's Story
  </h1>

  <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
    Capture today's memories, ideas, and reflections before they fade away.
  </p>

  <div className="mt-6 flex gap-3">

  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
    ✍️ Daily Reflection
  </span>

  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
    💡 Keep Growing
  </span>

</div>

</div>

      <div className="max-w-4xl mx-auto mt-10 rounded-3xl border border-gray-100 bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          {id ? "Edit Journal" : "New Journal"}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
  {new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</p>

<hr className="my-8 border-gray-100" /> 

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
  Title
</label>

            <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Masukkan judul..."
  className="
w-full
mt-3
rounded-2xl
border
border-gray-200
bg-gray-50
px-5
py-4
shadow-sm
outline-none
transition-all
duration-300
focus:border-blue-500
focus:bg-white
focus:ring-4
focus:ring-blue-100
focus:shadow-md
"
/>
          </div>

          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
  Journal
</label>

            <textarea
              rows="6"
              maxLength={1000}  
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Apa yang terjadi hari ini? Ceritakan pengalaman, pelajaran, atau perasaanmu..."
              className="
w-full
mt-3
rounded-2xl
border
border-gray-200
bg-gray-50
px-5
py-4
outline-none
transition-all
duration-300
focus:border-blue-500
focus:bg-white
focus:ring-4
focus:ring-blue-100
"
            />
          </div>
<div className="mt-2 flex justify-end">
  <p
    className={`text-sm ${
      content.length > 900
        ? "text-red-500"
        : "text-gray-400"
    }`}
  >
    {content.length} / 1000 karakter
  </p>
</div>
          <div>
  <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
    Mood
  </label>

  <div className="mt-3 grid grid-cols-3 gap-3">

  <button
    type="button"
    onClick={() => setMood("😊 Happy")}
    className={`rounded-2xl border p-4 transition-all duration-300 ${
      mood === "😊 Happy"
        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
        : "border-gray-200 bg-gray-50 hover:bg-blue-50"
    }`}
  >
    <p className="text-2xl">😊</p>
    <p className="mt-2 text-sm font-medium">Happy</p>
  </button>

  <button
    type="button"
    onClick={() => setMood("😐 Neutral")}
    className={`rounded-2xl border p-4 transition-all duration-300 ${
      mood === "😐 Neutral"
        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
        : "border-gray-200 bg-gray-50 hover:bg-blue-50"
    }`}
  >
    <p className="text-2xl">😐</p>
    <p className="mt-2 text-sm font-medium">Neutral</p>
  </button>

  <button
    type="button"
    onClick={() => setMood("😔 Sad")}
    className={`rounded-2xl border p-4 transition-all duration-300 ${
      mood === "😔 Sad"
        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
        : "border-gray-200 bg-gray-50 hover:bg-blue-50"
    }`}
  >
    <p className="text-2xl">😔</p>
    <p className="mt-2 text-sm font-medium">Sad</p>
  </button>

</div>
</div>

          <div>
  <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
    Tag
  </label>

  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">

    <button
      type="button"
      onClick={() => setTag("Kuliah")}
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        tag === "Kuliah"
          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
          : "border-gray-200 bg-gray-50 hover:bg-blue-50"
      }`}
    >
      📚
      <p className="mt-2 font-medium">Kuliah</p>
    </button>

    <button
      type="button"
      onClick={() => setTag("Pribadi")}
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        tag === "Pribadi"
          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
          : "border-gray-200 bg-gray-50 hover:bg-blue-50"
      }`}
    >
      👤
      <p className="mt-2 font-medium">Pribadi</p>
    </button>

    <button
      type="button"
      onClick={() => setTag("Travel")}
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        tag === "Travel"
          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
          : "border-gray-200 bg-gray-50 hover:bg-blue-50"
      }`}
    >
      ✈️
      <p className="mt-2 font-medium">Travel</p>
    </button>

    <button
      type="button"
      onClick={() => setTag("Work")}
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        tag === "Work"
          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
          : "border-gray-200 bg-gray-50 hover:bg-blue-50"
      }`}
    >
      💼
      <p className="mt-2 font-medium">Work</p>
    </button>

  </div>
</div>

          <div className="mt-10 flex items-center justify-between">

  <button
    type="button"
    onClick={() => navigate("/")}
    className="
      rounded-2xl
      border
      border-gray-300
      px-6
      py-3
      font-medium
      text-gray-600
      transition-all
      duration-300
      hover:bg-gray-100
    "
  >
    Cancel
  </button>

  <button
    onClick={handleSave}
    className="
      rounded-2xl
      bg-blue-600
      px-8
      py-3
      font-semibold
      text-white
      transition-all
      duration-300
      hover:bg-blue-700
      hover:shadow-lg
    "
  >
    💾 Save Journal
  </button>

</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default JournalEditor;