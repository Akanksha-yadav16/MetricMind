export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 p-5">
        <h1 className="text-3xl font-bold">MetricMind</h1>
        <p className="text-slate-400 mt-1">
          AI-Powered Business Intelligence Assistant
        </p>
      </header>

      {/* Chat Area */}
      <section className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-blue-600 px-4 py-3 rounded-2xl max-w-xl">
            Why did European margins drop last quarter?
          </div>
        </div>

        {}
        <div className="flex justify-start">
          <div className="bg-slate-800 px-4 py-3 rounded-2xl max-w-xl">
            European margins declined primarily because shipping costs
            increased by 12% while revenue remained relatively constant.
          </div>
        </div>
      </section>

      {/* Input Area */}
      <footer className="border-t border-slate-800 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask a business question..."
            className="flex-1 rounded-lg bg-slate-800 px-4 py-3 outline-none"
          />

          <button className="bg-blue-600 px-6 rounded-lg hover:bg-blue-700 transition">
            Send
          </button>
        </div>
      </footer>
    </main>
  );
}