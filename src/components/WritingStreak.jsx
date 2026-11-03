
function WritingStreak({ journals }) {
  const total = journals.length;

  // Mengambil tanggal lokal hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mengumpulkan tanggal jurnal tanpa duplikasi
  const journalDates = new Set(
    journals
      .map((journal) => journal.journalDate)
      .filter(Boolean)
  );

  // Menentukan streak saat ini
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-");

  let currentStreak = 0;

  // Streak dimulai dari hari ini atau kemarin
  if (journalDates.has(todayKey) || journalDates.has(yesterdayKey)) {
    const currentDate = journalDates.has(todayKey)
      ? new Date(today)
      : new Date(yesterday);

    while (true) {
      const dateKey = [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, "0"),
        String(currentDate.getDate()).padStart(2, "0"),
      ].join("-");

      if (!journalDates.has(dateKey)) break;

      currentStreak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
  }

  let status = "Getting Started 🚀";

  if (currentStreak >= 3) {
    status = "Keep Going 💪";
  }

  if (currentStreak >= 7) {
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
            Current Streak
          </p>

          <h3 className="text-3xl font-bold mt-2 text-orange-500">
            {currentStreak} 🔥
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {currentStreak} consecutive days
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Writing Status
          </p>

          <h3 className="text-2xl font-bold mt-2 text-blue-600">
            {status}
          </h3>
        </div>

      </div>
    </div>
  );
}

export default WritingStreak;
