export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 MetricMind</h1>

        <div className="space-x-6">
          <a href="#" className="hover:text-gray-200">
            Dashboard
          </a>

          <a href="#" className="hover:text-gray-200">
            Reports
          </a>

          <a href="#" className="hover:text-gray-200">
            Analytics
          </a>

          <a href="#" className="hover:text-gray-200">
            Chat
          </a>
        </div>
      </div>
    </nav>
  );
}