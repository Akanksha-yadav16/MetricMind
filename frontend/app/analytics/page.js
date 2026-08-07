"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function AnalyticsPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Business Intelligence Dashboard
        </p>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500 text-sm">
              Revenue Growth
            </h3>

            <p className="text-3xl font-bold mt-2 text-green-600">
              +18%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500 text-sm">
              Total Products
            </h3>

            <p className="text-3xl font-bold mt-2">
              10
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500 text-sm">
              Active Customers
            </h3>

            <p className="text-3xl font-bold mt-2">
              10
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-gray-500 text-sm">
              Monthly Sales
            </h3>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              ₹168K
            </p>
          </div>

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

          <div className="bg-white rounded-2xl shadow p-6 h-[420px]">

            <h2 className="text-xl font-semibold mb-6">
              Revenue Trend
            </h2>

          </div>

          <div className="bg-white rounded-2xl shadow p-6 h-[420px]">

            <h2 className="text-xl font-semibold mb-6">
              Revenue Distribution
            </h2>

          </div>

        </div>

        {/* AI Insights */}

        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-xl font-semibold mb-4">
            AI Business Insights
          </h2>

          <ul className="space-y-3 text-gray-700">

            <li>📈 Revenue is growing steadily.</li>

            <li>💻 Laptop contributes the highest revenue.</li>

            <li>🎧 Headphones sold the highest quantity.</li>

            <li>👤 John Doe is currently the highest-value customer.</li>

          </ul>

        </div>

      </main>

    </div>
  );
}