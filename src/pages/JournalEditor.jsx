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



  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => {

  if (!id) return;

  const journal = getJournalById(id);

  if (journal) {
  setTitle(journal.title);
  setContent(journal.content);
  setMood(journal.mood);
  setTag(journal.tag);
  setImage(journal.image || "");
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
      image,
      favorite: getJournalById(id)?.favorite ?? false,
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
      image,
      favorite: false,
      date: new Date().toLocaleDateString("id-ID"),
    };

    saveJournal(newJournal);

    toast.success("Journal berhasil disimpan! 🎉");
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
              maxLength={10000}  
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


<div className="mt-4">
  <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
    Photo
  </label>

  <label className="mt-3 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-6 transition hover:border-blue-400 hover:bg-blue-50">
    <div className="text-center">
      <p className="text-3xl">📷</p>
      <p className="mt-2 font-medium text-gray-700">
        Upload Photo
      </p>
      <p className="mt-1 text-xs text-gray-400">
        JPG, JPEG, PNG, atau WebP • Maks. 5 MB
      </p>
    </div>

    <input
  type="file"
  accept="image/jpeg,image/png,image/webp"
  className="hidden"
  onChange={(e) => {
  const file = e.target.files[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Format foto harus JPG, JPEG, PNG, atau WebP!");
    e.target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    toast.error("Ukuran foto maksimal 5 MB!");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

reader.onload = (event) => {
  const img = new Image();

  img.onload = () => {
    const maxSize = 2000;

    let width = img.width;
    let height = img.height;

    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = (height / width) * maxSize;
        width = maxSize;
      } else {
        width = (width / height) * maxSize;
        height = maxSize;
      }
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const compressedImage = canvas.toDataURL(
      "image/jpeg",
      0.9
    );

    setImage(compressedImage);
  };

  img.src = event.target.result;
};

reader.readAsDataURL(file);
}}
/>
  </label>

 {image && (
  <div className="mt-4">
    <img
      src={image}
      alt="Preview"
      className="max-h-80 w-full rounded-2xl object-contain shadow-sm"
    />

    <button
      type="button"
      onClick={() => setImage("")}
      className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
    >
      🗑️ Hapus Foto
    </button>
  </div>
)}
</div>

          </div>
<div className="mt-2 flex justify-end">
  <p
    className={`text-sm ${
      content.length > 900
        ? "text-red-500"
        : "text-gray-400"
    }`}
  >
    {content.length} / 10000
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