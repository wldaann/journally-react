
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [loadingJournal, setLoadingJournal] = useState(Boolean(id));

  // Mengambil jurnal dari MySQL ketika edit
  useEffect(() => {
    if (!id) return;

    async function loadJournal() {
      try {
        const journal = await getJournalById(id);

        setTitle(journal.title || "");
        setContent(journal.content || "");
        setMood(journal.mood || "");
        setTag(journal.tag || "");
        setImage(journal.image || "");
      } catch (error) {
        toast.error(error.message || "Gagal mengambil jurnal.");
      } finally {
        setLoadingJournal(false);
      }
    }

    loadJournal();
  }, [id]);

  // Menyimpan atau memperbarui jurnal
  async function handleSave() {
    if (!title.trim() || !content.trim() || !mood || !tag) {
      toast.error("Semua field harus diisi!");
      return;
    }

    if (loading) return;

    setLoading(true);

    const journalData = {
      title: title.trim(),
      content,
      mood,
      tag,
      image,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      if (id) {
        await updateJournal({
          id: Number(id),
          ...journalData,
        });

        toast.success("Journal berhasil diperbarui! 🎉");
      } else {
        await saveJournal(journalData);

        toast.success("Journal berhasil disimpan! 🎉");
      }

      navigate("/");
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jurnal.");
    } finally {
      setLoading(false);
    }
  }

  // Mengunggah dan mengompres foto
  function handleImageUpload(e) {
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

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast.error("Ukuran foto maksimal 5 MB!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const maxDimension = 2000;

        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
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

      img.onerror = () => {
        toast.error("Gagal memproses foto.");
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      toast.error("Gagal membaca file foto.");
    };

    reader.readAsDataURL(file);
  }

  if (loadingJournal) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <p className="py-20 text-center text-gray-500">
          Memuat jurnal...
        </p>
        <Footer />
      </div>
    );
  }

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
          {/* Title */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul..."
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:shadow-md"
            />
          </div>

          {/* Content */}
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
              className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

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
          </div>

          {/* Photo */}
          <div>
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
                onChange={handleImageUpload}
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

          {/* Mood */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Mood
            </label>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { value: "😊 Happy", label: "Happy", emoji: "😊" },
                { value: "😐 Neutral", label: "Neutral", emoji: "😐" },
                { value: "😔 Sad", label: "Sad", emoji: "😔" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMood(item.value)}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    mood === item.value
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                      : "border-gray-200 bg-gray-50 hover:bg-blue-50"
                  }`}
                >
                  <p className="text-2xl">{item.emoji}</p>
                  <p className="mt-2 text-sm font-medium">
                    {item.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Tag
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { value: "Kuliah", emoji: "📚" },
                { value: "Pribadi", emoji: "👤" },
                { value: "Travel", emoji: "✈️" },
                { value: "Work", emoji: "💼" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTag(item.value)}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    tag === item.value
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                      : "border-gray-200 bg-gray-50 hover:bg-blue-50"
                  }`}
                >
                  {item.emoji}
                  <p className="mt-2 font-medium">
                    {item.value}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-2xl border border-gray-300 px-6 py-3 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : "💾 Save Journal"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default JournalEditor;
