import { TrendingUp } from "lucide-react";

export default function StatsCard({
  title,
  value,
  color = "bg-blue-500",
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-700 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900">
            {value}
          </h2>
        </div>

        <div className={`${color} p-4 rounded-full text-white`}>
          <TrendingUp size={26} />
        </div>
      </div>
    </div>
  );
}