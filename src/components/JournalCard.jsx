import { useNavigate } from "react-router-dom";
import { exportJournalPDF } from "../utils/exportPDF";
function JournalCard({
  id,
  title,
  content,
  mood,
  tag,
  date,
  onDelete,
}) {

  const navigate = useNavigate();

  return (
    <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-4 text-sm text-gray-400">

  <span>
    📅 {date}
  </span>

  <span>
    📖 {content.split(" ").length} words
  </span>

</div>

<h3 className="mt-2 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
  {title}
</h3>

        </div>

      </div>

      <p className="mt-5 break-words line-clamp-3 leading-7 text-gray-600">
  {content}
</p>

<hr className="my-6 border-gray-100" />

<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex gap-3">

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700 transition-transform duration-300 hover:scale-105">
            {mood}
          </span>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            #{tag}
          </span>

        </div>

        <div className="flex flex-wrap gap-3 self-end">

  <button
    onClick={() => navigate(`/editor/${id}`)}
    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
  >
    ✏️ Edit
  </button>

  <button
    onClick={() => onDelete(id)}
    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
  >
    🗑️ Hapus
  </button>

  <button
    onClick={() =>
      exportJournalPDF({
        title,
        content,
        mood,
        tag,
        date,
      })
    }
    className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
  >
    📄 Export PDF
  </button>

</div>

      </div>

    </div>
  );
}

export default JournalCard;