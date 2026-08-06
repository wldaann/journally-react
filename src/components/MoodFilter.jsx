function MoodFilter({ selectedMood, setSelectedMood }) {
  const moods = [
    "Semua",
    "😊 Happy",
    "😐 Neutral",
    "😔 Sad",
  ];

  return (
    <div className="flex flex-wrap gap-3">

      {moods.map((mood) => (

        <button
          key={mood}
          onClick={() => setSelectedMood(mood)}
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
              selectedMood === mood
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {mood}
        </button>

      ))}

    </div>
  );
}

export default MoodFilter;