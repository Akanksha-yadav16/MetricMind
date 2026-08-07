export default function InsightCard({
  title,
  mainText,
  subText,
  emoji,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="text-4xl">{emoji}</div>

      <h3 className="text-gray-500 mt-4">
        {title}
      </h3>

      <h2 className="text-2xl font-bold mt-2">
        {mainText}
      </h2>

      <p className="text-gray-600 mt-2">
        {subText}
      </p>
    </div>
  );
}