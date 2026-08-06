export default function KPICard({ title, value, color }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}>
      <h3 className="text-gray-500 text-sm font-semibold">{title}</h3>

      <p className="text-3xl font-bold mt-3 text-gray-800">
        {value}
      </p>
    </div>
  );
}