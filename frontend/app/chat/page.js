"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { askChatQuestion } from "@/services/api";

<<<<<<< HEAD
=======
const SUGGESTED_QUESTIONS = [
  "What is the total revenue?",
  "How many orders do we have?",
  "How many customers do we have?",
  "What is the average order value?",
  "What is the top-selling product?",
  "Who is our top customer?",
  "Show revenue by product.",
  "Show quantity sold by product.",
];

>>>>>>> final-project
export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  async function sendMessage() {
    const text = question.trim();

    if (!text || loading) {
      return;
    }
=======
  async function sendMessage(value = question) {
    const text = value.trim();

    if (!text || loading) return;
>>>>>>> final-project

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
<<<<<<< HEAD
          text: "Unable to connect to MetricMind API.",
=======
          text:
            error.message ||
            "Unable to connect to MetricMind API.",
>>>>>>> final-project
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

<<<<<<< HEAD
  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
=======
  /*
   * Render AI table responses.
   *
   * This only changes the presentation of:
   * 1. Revenue by product
   * 2. Quantity sold by product
   *
   * All other AI answers remain normal text.
   */
  function renderAIResponse(text) {
    if (!text || typeof text !== "string") {
      return null;
    }

    const isRevenueTable =
      text.startsWith("Revenue by product:");

    const isQuantityTable =
      text.startsWith("Quantity sold by product:");

    if (!isRevenueTable && !isQuantityTable) {
      return (
        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-900">
          {text}
        </p>
      );
    }

    const content = text
      .replace("Revenue by product:", "")
      .replace("Quantity sold by product:", "")
      .trim();

    /*
     * API format:
     *
     * Revenue:
     * Laptop ₹75,000.00; Smartphone ₹45,000.00; ...
     *
     * Quantity:
     * Laptop 1 units; Smartphone 1 units; ...
     */
    const rows = content
      .replace(/\.$/, "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);

    const tableRows = rows.map((item) => {
      if (isRevenueTable) {
        const match = item.match(/^(.*?)\s+₹([\d,]+(?:\.\d+)?)$/);

        if (match) {
          return {
            product: match[1].trim(),
            value: `₹${match[2]}`,
          };
        }
      }

      if (isQuantityTable) {
        const match = item.match(/^(.*?)\s+([\d,]+)\s+units$/);

        if (match) {
          return {
            product: match[1].trim(),
            value: `${match[2]} units`,
          };
        }
      }

      return {
        product: item,
        value: "",
      };
    });

    return (
      <div className="mt-2 w-full min-w-[320px]">

        {/* Table title */}
        <p className="mb-3 text-sm font-semibold text-gray-900">
          {isRevenueTable
            ? "Revenue by Product"
            : "Quantity Sold by Product"}
        </p>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">

          <table className="w-full border-collapse text-sm">

            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-800">
                  Product
                </th>

                <th className="border-b border-gray-300 px-4 py-3 text-right font-semibold text-gray-800">
                  {isRevenueTable ? "Revenue" : "Quantity Sold"}
                </th>
              </tr>
            </thead>

            <tbody>
              {tableRows.map((row, index) => (
                <tr
                  key={`${row.product}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
                    {row.product}
                  </td>

                  <td
                    className={`border-b border-gray-200 px-4 py-3 text-right font-semibold ${
                      isRevenueTable
                        ? "text-green-700"
                        : "text-blue-700"
                    }`}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">

>>>>>>> final-project
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Chat
            </h1>

<<<<<<< HEAD
            <p className="text-gray-600 mt-2">
=======
            <p className="mt-2 text-base text-gray-600">
>>>>>>> final-project
              Ask business questions using natural language.
            </p>
          </div>

          {messages.length > 0 && (
            <button
<<<<<<< HEAD
              onClick={clearChat}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 transition"
=======
              onClick={() => setMessages([])}
              className="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-100"
>>>>>>> final-project
            >
              Clear Chat
            </button>
          )}
<<<<<<< HEAD
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
=======

        </div>

        {/* Chat Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6">

            {messages.length === 0 ? (

              <div className="flex h-full items-center justify-center">

                <div className="max-w-2xl text-center">

                  <div className="mb-3 text-5xl">
                    🤖
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Ask MetricMind AI
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Choose a question or type your own.
                  </p>

                  {/* Suggested Questions */}
                  <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">

                    {SUGGESTED_QUESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => sendMessage(item)}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                      >
                        {item}
                      </button>
                    ))}

                  </div>

                </div>

              </div>

            ) : (

              <div className="space-y-5">

                {messages.map((message, index) => (

                  <div
                    key={`${message.type}-${index}`}
                    className={`flex ${
                      message.type === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`${
                        message.type === "ai" &&
                        (
                          message.text.startsWith(
                            "Revenue by product:"
                          ) ||
                          message.text.startsWith(
                            "Quantity sold by product:"
                          )
                        )
                          ? "max-w-[95%]"
                          : "max-w-[85%]"
                      } rounded-2xl px-5 py-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 bg-gray-100 text-gray-900"
                      }`}
                    >

                      <p
                        className={`mb-1 text-xs font-semibold ${
                          message.type === "user"
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        {message.type === "user"
                          ? "You"
                          : "MetricMind AI"}
                      </p>

                      {/* AI Response */}
                      {message.type === "ai"
                        ? renderAIResponse(message.text)
                        : (
                          <p className="whitespace-pre-wrap text-sm leading-6 text-white">
                            {message.text}
                          </p>
                        )}

                    </div>

                  </div>

                ))}

                {/* Loading */}
                {loading && (
                  <div className="flex justify-start">

                    <div className="rounded-2xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm text-gray-700">
                      MetricMind AI is thinking...
                    </div>

                  </div>
                )}

              </div>

            )}

          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">

            <div className="flex flex-col gap-3 sm:flex-row">
>>>>>>> final-project

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a business question..."
                rows={2}
<<<<<<< HEAD
                className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={sendMessage}
                disabled={!question.trim() || loading}
                className="self-end px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition"
=======
                aria-label="Business question"
                className="min-h-[72px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!question.trim() || loading}
                className="self-end rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
>>>>>>> final-project
              >
                {loading ? "Sending..." : "Send"}
              </button>

            </div>

<<<<<<< HEAD
            <p className="text-xs text-gray-600 mt-2">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </div>
        </div>
      </main>
=======
            <p className="mt-2 text-xs text-gray-600">
              Press Enter to send · Shift + Enter for a new line
            </p>

          </div>

        </div>

      </main>

>>>>>>> final-project
    </div>
  );
}