function MoodCard({
  emoji,
  label,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        rounded-3xl
        border
        p-8
        transition-all
        duration-300
        hover:scale-105
        ${
          selected
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 bg-white hover:border-blue-300"
        }
      `}
    >
      <div className="text-5xl">
        {emoji}
      </div>

      <p className="mt-4 text-xl font-semibold">
        {label}
      </p>
    </button>
  );
}

export default MoodCard;