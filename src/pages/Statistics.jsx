import Footer from "../components/Footer";
import WritingStreak from "../components/WritingStreak";
import WeeklyChart from "../components/WeeklyChart";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MoodChart from "../components/MoodChart";
import { getJournals } from "../services/journalService";

function Statistics() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    setJournals(getJournals());
  }, []);

  const happyCount = journals.filter(
    (journal) => journal.mood === "😊 Happy"
  ).length;

  const neutralCount = journals.filter(
    (journal) => journal.mood === "😐 Neutral"
  ).length;

  const sadCount = journals.filter(
    (journal) => journal.mood === "😔 Sad"
  ).length;

  const total = journals.length;

  const happyPercent =
    total === 0 ? 0 : Math.round((happyCount / total) * 100);

  const neutralPercent =
    total === 0 ? 0 : Math.round((neutralCount / total) * 100);

  const sadPercent =
    total === 0 ? 0 : Math.round((sadCount / total) * 100);

  const mostFrequentMood =
    happyCount >= neutralCount && happyCount >= sadCount
      ? "😊 Happy"
      : neutralCount >= happyCount && neutralCount >= sadCount
      ? "😐 Neutral"
      : "😔 Sad";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-12">

        {/* HERO */}
        <p className="uppercase tracking-[0.3em] text-sm text-slate-400 font-semibold">
          JOURNALLY
        </p>

        <h1 className="mt-3 text-5xl font-extrabold text-slate-900">
          Your Statistics 📊
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-slate-500 leading-8">
          Track your writing habits and understand your emotional journey
          over time.
        </p>

        {/* CARD */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
            <div className="text-4xl">📝</div>

            <p className="mt-6 text-gray-500">
              Total Journal
            </p>

            <h2 className="mt-2 text-5xl font-bold">
              {total}
            </h2>
          </div>

          <div className="rounded-3xl bg-yellow-50 p-8 shadow-sm border border-yellow-200">
            <div className="text-4xl">😊</div>

            <p className="mt-6 text-yellow-700">
              Happy
            </p>

            <h2 className="mt-2 text-5xl font-bold text-yellow-600">
              {happyCount}
            </h2>
          </div>

          <div className="rounded-3xl bg-blue-50 p-8 shadow-sm border border-blue-200">
            <div className="text-4xl">😐</div>

            <p className="mt-6 text-blue-700">
              Neutral
            </p>

            <h2 className="mt-2 text-5xl font-bold text-blue-600">
              {neutralCount}
            </h2>
          </div>

          <div className="rounded-3xl bg-red-50 p-8 shadow-sm border border-red-200">
            <div className="text-4xl">😔</div>

            <p className="mt-6 text-red-700">
              Sad
            </p>

            <h2 className="mt-2 text-5xl font-bold text-red-600">
              {sadCount}
            </h2>
          </div>

        </div>

        {/* PIE CHART */}
        <div className="mt-12">

  <MoodChart
    happyCount={happyCount}
    neutralCount={neutralCount}
    sadCount={sadCount}
  />

  <p className="mt-6 text-center text-sm text-gray-500">
  📊 Analysis generated from{" "}
  <span className="font-semibold text-slate-700">
    {journals.length}
  </span>{" "}
  journal entries.
</p>

</div>

<div className="mt-12">
  <WeeklyChart journals={journals} />
</div>

        {/* PROGRESS BAR */}
        <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

          <h2 className="text-2xl font-bold mb-8">
            😊 Mood Distribution
          </h2>

          {/* HAPPY */}
          <div className="mb-8">

            <div className="flex justify-between mb-2">
              <span className="font-medium">
                😊 Happy
              </span>

              <span>
                {happyPercent}%
              </span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-yellow-400 transition-all duration-700"
                style={{
                  width: `${happyPercent}%`,
                }}
              />

            </div>

          </div>

          {/* NEUTRAL */}

          <div className="mb-8">

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                😐 Neutral
              </span>

              <span>
                {neutralPercent}%
              </span>

            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${neutralPercent}%`,
                }}
              />

            </div>

          </div>

          {/* SAD */}

          <div>

            <div className="flex justify-between mb-2">

              <span className="font-medium">
                😔 Sad
              </span>

              <span>
                {sadPercent}%
              </span>

            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-red-500 transition-all duration-700"
                style={{
                  width: `${sadPercent}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* INSIGHT */}

        <div className="mt-12 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

          <h2 className="text-2xl font-bold mb-8">
            💡 Journal Insight
          </h2>

          <div className="mt-12">
  <WritingStreak journals={journals} />
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>

              <p className="text-sm text-gray-500">
                Most Frequent Mood
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {mostFrequentMood}
              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Total Writing
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {total} Journals
              </h3>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Writing Status
              </p>

              <h3 className="mt-2 text-2xl font-bold text-blue-600">

                {total >= 10
                  ? "Excellent 🔥"
                  : total >= 5
                  ? "Keep Going 💪"
                  : "Great Start 🚀"}

              </h3>

            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Statistics;