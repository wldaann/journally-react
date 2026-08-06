import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getJournals,
  toggleFavorite,
} from "../services/journalService";

function History() {
  const [journals, setJournals] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setJournals(getJournals());
  }, []);

  const handleFavorite = (id) => {
  toggleFavorite(id);
  setJournals(getJournals());
};

  const filteredJournals = journals.filter((journal) =>
    journal.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* HERO */}

        <p className="uppercase tracking-[0.3em] text-sm text-slate-400 font-semibold">
          JOURNALLY
        </p>

        <h1 className="mt-3 text-5xl font-extrabold text-slate-900">
          Journal History 📚
        </h1>

        <p className="mt-5 text-lg text-slate-500 max-w-2xl">
          Browse every journal you've written and revisit your memories.
        </p>

        {/* SEARCH */}

        <div className="mt-10">

          <input
            type="text"
            placeholder="🔍 Search journal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-6
              py-4
              outline-none
              transition
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

        {/* HISTORY */}

        <div className="mt-10 space-y-6">

          {filteredJournals.length === 0 ? (

            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

              <div className="text-6xl">
                📭
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                No Journal Found
              </h2>

              <p className="mt-2 text-gray-500">
                Try another keyword or create a new journal.
              </p>

            </div>

          ) : (

            filteredJournals.map((journal) => (

              <div
                key={journal.id}
                className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >

                <div className="flex justify-between items-start">

  <div>

    <h2 className="text-2xl font-bold">
      {journal.title}
    </h2>

{journal.favorite && (
  <span className="mt-3 inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
    ❤️ Favorite
  </span>
)}

  </div>

  <button
    onClick={() => handleFavorite(journal.id)}
    className="text-3xl transition hover:scale-110"
  >
    {journal.favorite ? "❤️" : "🤍"}
  </button>

</div>

<div className="mt-4 h-px bg-gray-100"></div>

<div className="mt-3 flex items-center gap-3">

  <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl">
    📅
  </div>

  <div>

    <p className="text-sm text-gray-500">
      Created
    </p>

    <p className="font-semibold">
      {journal.date}
    </p>


                  </div>

                </div>

               <p className="mt-8 text-gray-600 leading-8 break-words">
                  {journal.content}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">

                  <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
                    {journal.mood}
                  </span>

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    #{journal.tag}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>
<Footer />
    </div>
  );
}

export default History;