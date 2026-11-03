
function HabitCard({
  id,
  name,
  icon,
  completedDates,
  onDelete,
  onEdit,
  onToggleDay,
}) {
  // Mengubah tanggal menjadi YYYY-MM-DD berdasarkan waktu lokal
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = new Date();
  const todayString = formatDate(today);
  const dates = completedDates || [];

  // Menghitung streak
  function calculateStreak() {
    if (dates.length === 0) return 0;

    const currentDate = new Date(today);

    if (!dates.includes(todayString)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    let streak = 0;

    while (dates.includes(formatDate(currentDate))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  const streak = calculateStreak();

  // Menghitung progress 7 hari terakhir
  let weeklyProgress = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    if (dates.includes(formatDate(date))) {
      weeklyProgress++;
    }
  }

  const progressPercentage = Math.round(
    (weeklyProgress / 7) * 100
  );

  // Membuat daftar 7 hari terakhir
  const dayLabels = [
    "Min",
    "Sen",
    "Sel",
    "Rab",
    "Kam",
    "Jum",
    "Sab",
  ];

  const weekDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    weekDays.push({
      label: dayLabels[date.getDay()],
      date: formatDate(date),
    });
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Habit Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {icon} {name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            🔥 {streak} day streak
          </p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{weeklyProgress} / 7 days this week</span>
              <span>{progressPercentage}%</span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleDay(id, todayString)}
            aria-label="Checklist hari ini"
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              dates.includes(todayString)
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-600"
            }`}
          >
            ✓
          </button>

          <button
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 transition hover:bg-blue-100"
          >
            ✏️
          </button>

          <button
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Weekly Checklist */}
      <div className="mt-6 grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const completed = dates.includes(day.date);

          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-gray-400">
                {day.label}
              </span>

              <button
                type="button"
                onClick={() => onToggleDay(id, day.date)}
                aria-label={`Checklist ${day.label}`}
                aria-pressed={completed}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {completed ? "✓" : ""}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HabitCard;
