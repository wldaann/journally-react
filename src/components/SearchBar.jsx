function SearchBar({ search, setSearch }) {
  return (
    <div className="relative">

      <input
        type="text"
        placeholder="🔍 Cari journal berdasarkan judul..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-gray-200
          bg-gray-50
          px-5
          py-4
          text-gray-700
          shadow-sm
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white
          focus:ring-4
          focus:ring-blue-100
        "
      />

    </div>
  );
}

export default SearchBar;