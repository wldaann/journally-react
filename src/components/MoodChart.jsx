import {

  PieChart,

  Pie,

  Cell,

  Tooltip,

  Legend,

  ResponsiveContainer,

} from "recharts";



function MoodChart({

  happyCount,

  neutralCount,

  sadCount,

}) {

  const data = [

    {

      name: "😊 Happy",

      value: happyCount,

    },

    {

      name: "😐 Neutral",

      value: neutralCount,

    },

    {

      name: "😔 Sad",

      value: sadCount,

    },

  ];



  const COLORS = [

    "#FACC15",

    "#3B82F6",

    "#EF4444",

  ];



  return (

    <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">



      <h2 className="text-2xl font-bold mb-8">

        📈 Mood Analytics

      </h2>



      <div className="h-[420px]">



        <ResponsiveContainer width="100%" height="100%">



          <PieChart>



            <Pie

              data={data}

              cx="50%"

              cy="50%"

              outerRadius={140}

              dataKey="value"

              label

            >

              {data.map((entry, index) => (

                <Cell

                  key={index}

                  fill={COLORS[index]}

                />

              ))}

            </Pie>



            <Tooltip />



            <Legend />



          </PieChart>



        </ResponsiveContainer>



      </div>



    </div>

  );

}



export default MoodChart;