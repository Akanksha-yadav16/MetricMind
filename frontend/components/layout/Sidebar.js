export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        📊 MetricMind
      </h2>

      <nav className="space-y-4">

        <a
          href="#"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📈 Dashboard
        </a>

        <a
          href="#"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📄 Reports
        </a>

        <a
          href="#"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          📊 Analytics
        </a>

        <a
          href="#"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          🤖 AI Chat
        </a>

        <a
          href="#"
          className="block p-3 rounded-lg hover:bg-slate-700"
        >
          ⚙️ Settings
        </a>

      </nav>
    </aside>
  );
}