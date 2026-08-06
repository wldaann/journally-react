function TagFilter({
  selectedTag,
  setSelectedTag,
  journals,
}) {

  const tags = [
    "Semua",
    ...new Set(journals.map((journal) => journal.tag)),
  ];

  return (
    <div className="flex flex-wrap gap-3">

      {tags.map((tag) => (

        <button
          key={tag}
          onClick={() => setSelectedTag(tag)}
          className={`
            px-5
            py-3
            rounded-2xl
            font-medium
            transition-all
            duration-300
            shadow-sm
            hover:scale-105
            ${
              selectedTag === tag
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {tag}
        </button>

      ))}

    </div>
  );
}

export default TagFilter;