function WritingStreak({ journals }) {
  const total = journals.length;

  let status = "Getting Started 🚀";

  if (total >= 5) {
    status = "Keep Going 💪";
  }

  if (total >= 10) {
    status = "Excellent 🔥";
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

      <h2 className="text-2xl font-bold mb-8">
        🔥 Writing Streak
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <p className="text-sm text-gray-500">
            Total Journals
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {total}
          </h3>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Writing Status
          </p>

          <h3 className="text-2xl font-bold mt-2 text-blue-600">
            {status}
          </h3>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Motivation
          </p>

          <h3 className="text-xl font-bold mt-2">
            Keep Writing Every Day ✨
          </h3>
        </div>

      </div>

    </div>
  );
}

export default WritingStreak;