import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function WeeklyChart({ journals }) {
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const chartData = days.map((day) => ({
    day,
    total: 0,
  }));

  journals.forEach((journal) => {
    const date = new Date(journal.id);
    const dayIndex = date.getDay();

    chartData[dayIndex].total += 1;
  });

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">

      <h2 className="text-2xl font-bold mb-8">
        📈 Weekly Activity
      </h2>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[10, 10, 0, 0]}
              fill="#2563EB"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default WeeklyChart;