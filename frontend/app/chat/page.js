"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { askChatQuestion } from "@/services/api";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = question.trim();

    if (!text || loading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await askChatQuestion(text);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            data.answer ||
            "Sorry, I couldn't understand the question.",
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Unable to connect to MetricMind API.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Chat
            </h1>

            <p className="text-gray-600 mt-2">
              Ask business questions using natural language.
            </p>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 transition"
            >
              Clear Chat
            </button>
          )}
        </div>

        {/* Chat Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-5">

            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-5xl mb-4">
                    🤖
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    Ask MetricMind AI
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Try questions like:
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      "How many orders do we have?"
                    </p>

                    <p>
                      "What is the total revenue?"
                    </p>

                    <p>
                      "Who is our top customer?"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                >
                  <p
                    className={`text-xs font-semibold mb-1 ${message.type === "user"
                        ? "text-blue-100"
                        : "text-gray-600"
                      }`}
                  >
                    {message.type === "user"
                      ? "You"
                      : "MetricMind AI"}
                  </p>

                  <p className="text-sm leading-6 whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3">
                  <p className="text-sm text-gray-700">
                    MetricMind AI is thinking...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a business question..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={sendMessage}
                disabled={!question.trim() || loading}
                className="self-end px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition"
              >
                {loading ? "Sending..." : "Send"}
              </button>

            </div>

            <p className="text-xs text-gray-600 mt-2">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}