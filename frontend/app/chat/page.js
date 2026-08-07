"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-gray-800">
          AI Chat
        </h1>

        <p className="text-gray-500 mt-2">
          Ask business questions using natural language.
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow p-8 h-[500px] flex items-center justify-center">
          <h2 className="text-2xl text-gray-400">
            🚧 AI Chat Coming Soon
          </h2>
        </div>
      </main>
    </div>
  );
}