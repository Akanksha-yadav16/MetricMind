"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import KPICard from "../components/dashboard/KPICard";
import InsightCard from "../components/dashboard/InsightCard";
import RevenueChart from "../components/charts/RevenueChart";

import { getDashboardSummary } from "../services/api";

const CACHE_KEY = "metricmind_dashboard";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [dashboard, setDashboard] = useState({
    metrics: {
      revenue: "Loading...",
      orders: "Loading...",
      customers: "Loading...",
      averageOrderValue: "Loading...",
    },

    chartData: [],

    topProduct: {
      product: "Loading...",
      quantity_sold: 0,
    },

    topCustomer: {
      customer: "Loading...",
      total_spent: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      /*
       * STEP 1:
       * Load cached data immediately.
       * This makes the Dashboard appear much faster
       * when the user visits it again.
       */
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          const cacheAge = Date.now() - parsed.timestamp;

          if (cacheAge < CACHE_TIME && isMounted) {
            setDashboard(parsed.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Cache read error:", error);
      }

      /*
       * STEP 2:
       * Get fresh data from backend.
       *
       * IMPORTANT:
       * This is still ONLY ONE API REQUEST.
       */
      try {
        const data = await getDashboardSummary();

        if (!isMounted) return;

        const formattedData = {
          metrics: {
            revenue: `₹${Number(
              data.total_revenue || 0
            ).toLocaleString("en-IN")}`,

            orders: data.total_orders ?? 0,

            customers: data.total_customers ?? 0,

            averageOrderValue: `₹${Number(
              data.average_order_value || 0
            ).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          },

          chartData: data.revenue_by_product || [],

          topProduct: data.top_product || {
            product: "No data",
            quantity_sold: 0,
          },

          topCustomer: data.top_customer || {
            customer: "No data",
            total_spent: 0,
          },
        };

        /*
         * Update UI only once.
         */
        setDashboard(formattedData);
        setLoading(false);

        /*
         * Save fresh data to session storage.
         */
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: formattedData,
            })
          );
        } catch (error) {
          console.error("Cache write error:", error);
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);

        if (!isMounted) return;

        /*
         * Only show error if we don't already
         * have cached data.
         */
        setDashboard((previous) => {
          const hasData =
            previous.metrics.revenue !== "Loading..." &&
            previous.metrics.revenue !== "Error";

          if (hasData) {
            return previous;
          }

          return {
            metrics: {
              revenue: "Error",
              orders: "Error",
              customers: "Error",
              averageOrderValue: "Error",
            },

            chartData: [],

            topProduct: {
              product: "Error",
              quantity_sold: 0,
            },

            topCustomer: {
              customer: "Error",
              total_spent: 0,
            },
          };
        });

        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <section className="flex-1 p-8">
        {/* Page Heading */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to MetricMind Analytics Platform
          </p>
        </div>

        {/* Optional refresh indicator */}
        {loading && (
          <p className="text-sm text-gray-400 mt-4">
            Loading dashboard data...
          </p>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
          <KPICard
            title="Total Revenue"
            value={dashboard.metrics.revenue}
            color="border-green-500"
          />

          <KPICard
            title="Total Orders"
            value={dashboard.metrics.orders}
            color="border-blue-500"
          />

          <KPICard
            title="Customers"
            value={dashboard.metrics.customers}
            color="border-purple-500"
          />

          <KPICard
            title="Average Order Value"
            value={dashboard.metrics.averageOrderValue}
            color="border-orange-500"
          />
        </div>

        {/* Revenue Chart */}
        <RevenueChart data={dashboard.chartData} />

        {/* Business Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <InsightCard
            emoji="🏆"
            title="Top Selling Product"
            mainText={dashboard.topProduct.product}
            subText={`${dashboard.topProduct.quantity_sold} Units Sold`}
          />

          <InsightCard
            emoji="👤"
            title="Top Customer"
            mainText={dashboard.topCustomer.customer}
            subText={`₹${Number(
              dashboard.topCustomer.total_spent || 0
            ).toLocaleString("en-IN")}`}
          />
        </div>
      </section>
    </main>
  );
}