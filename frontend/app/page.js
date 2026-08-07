"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import KPICard from "../components/dashboard/KPICard";
import InsightCard from "../components/dashboard/InsightCard";
import RevenueChart from "../components/charts/RevenueChart";

import {
  getTotalRevenue,
  getTotalOrders,
  getTotalCustomers,
  getAverageOrderValue,
  getRevenueByProduct,
  getTopSellingProduct,
  getTopCustomer,
} from "../services/api";

export default function Home() {
  const [metrics, setMetrics] = useState({
    revenue: "Loading...",
    orders: "Loading...",
    customers: "Loading...",
    averageOrderValue: "Loading...",
  });

  const [chartData, setChartData] = useState([]);

  const [topProduct, setTopProduct] = useState({
    product: "Loading...",
    quantity_sold: "",
  });

  const [topCustomer, setTopCustomer] = useState({
    customer: "Loading...",
    total_spent: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const revenue = await getTotalRevenue();
        const orders = await getTotalOrders();
        const customers = await getTotalCustomers();
        const average = await getAverageOrderValue();
        const revenueChart = await getRevenueByProduct();
        const product = await getTopSellingProduct();
        const customer = await getTopCustomer();

        setMetrics({
          revenue: `₹${Number(revenue.total_revenue).toLocaleString()}`,
          orders: orders.total_orders,
          customers: customers.total_customers,
          averageOrderValue: `₹${Number(
            average.average_order_value
          ).toFixed(2)}`,
        });

        setChartData(revenueChart);

        setTopProduct(product);

        setTopCustomer(customer);
      } catch (error) {
        console.error(error);

        setMetrics({
          revenue: "Error",
          orders: "Error",
          customers: "Error",
          averageOrderValue: "Error",
        });
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome to MetricMind Analytics Platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
          <KPICard
            title="Total Revenue"
            value={metrics.revenue}
            color="border-green-500"
          />

          <KPICard
            title="Total Orders"
            value={metrics.orders}
            color="border-blue-500"
          />

          <KPICard
            title="Customers"
            value={metrics.customers}
            color="border-purple-500"
          />

          <KPICard
            title="Average Order Value"
            value={metrics.averageOrderValue}
            color="border-orange-500"
          />
        </div>

        <RevenueChart data={chartData} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <InsightCard
            emoji="🏆"
            title="Top Selling Product"
            mainText={topProduct.product}
            subText={`${topProduct.quantity_sold} Units Sold`}
          />

          <InsightCard
            emoji="👤"
            title="Top Customer"
            mainText={topCustomer.customer}
            subText={`₹${Number(
              topCustomer.total_spent || 0
            ).toLocaleString()}`}
          />
        </div>
      </section>
    </main>
  );
}