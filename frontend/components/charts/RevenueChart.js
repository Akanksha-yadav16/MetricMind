"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div className="w-full">

      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Revenue by Product
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 60,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#cbd5e1"
          />

          <XAxis
            dataKey="product"
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{
              fill: "#1f2937",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <YAxis
            tick={{
              fill: "#1f2937",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              color: "#111827",
              fontWeight: 600,
            }}
            formatter={(value) =>
              `₹${Number(value).toLocaleString("en-IN")}`
            }
          />

          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#2563eb"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}