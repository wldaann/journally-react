function SortJournal({ sortBy, setSortBy }) {
  return (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="
        w-full
        rounded-2xl
        border
        border-gray-200
        bg-white
        px-5
        py-4
        outline-none
        transition
        focus:border-blue-500
        focus:ring-4
        focus:ring-blue-100
      "
    >
      <option value="newest">📅 Terbaru</option>
      <option value="oldest">📖 Terlama</option>
      <option value="az">🔤 A - Z</option>
      <option value="za">🔠 Z - A</option>
    </select>
  );
}

export default SortJournal;