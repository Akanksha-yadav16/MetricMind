"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getAnalyticsSummary } from "@/services/api";

const CACHE_KEY = "metricmind_analytics";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    orders: null,
    customers: null,
    revenue: null,
    averageOrder: null,
    topProduct: null,
    topCustomer: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      /*
       * STEP 1
       * Load cached data immediately.
       */
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          const cacheAge = Date.now() - parsed.timestamp;

          if (cacheAge < CACHE_TIME && isMounted) {
            setAnalytics(parsed.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Analytics cache read error:", error);
      }

      /*
       * STEP 2
       * Make ONLY ONE API REQUEST.
       */
      try {
        const data = await getAnalyticsSummary();

        if (!isMounted) return;

        const formattedData = {
          orders: data.total_orders ?? 0,

          customers: data.total_customers ?? 0,

          revenue: data.total_revenue ?? 0,

          averageOrder: data.average_order_value ?? 0,

          topProduct: data.top_product?.product || "No data",

          topCustomer: data.top_customer?.customer || "No data",
        };

        /*
         * Update UI.
         */
        setAnalytics(formattedData);
        setLoading(false);

        /*
         * Save data to browser cache.
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
          console.error("Analytics cache write error:", error);
        }
      } catch (error) {
        console.error("Analytics API Error:", error);

        if (!isMounted) return;

        setAnalytics((previous) => {
          /*
           * If cached data is already displayed,
           * keep it instead of replacing it with errors.
           */
          if (
            previous.orders !== null ||
            previous.customers !== null ||
            previous.revenue !== null
          ) {
            return previous;
          }

          return {
            orders: "Error",
            customers: "Error",
            revenue: "Error",
            averageOrder: "Error",
            topProduct: "Error",
            topCustomer: "Error",
          };
        });

        setLoading(false);
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="text-gray-600 mt-2 text-base">
            Business Intelligence Dashboard
          </p>

          {loading && (
            <p className="text-sm text-gray-400 mt-3">
              Loading analytics data...
            </p>
          )}
        </div>


        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">
              Total Orders
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {analytics.orders !== null
                ? analytics.orders
                : "Loading..."}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Orders received
            </p>
          </div>


          {/* Total Customers */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">
              Total Customers
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {analytics.customers !== null
                ? analytics.customers
                : "Loading..."}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Customers with orders
            </p>
          </div>


          {/* Total Revenue */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">
              Total Revenue
            </p>

            <p className="text-3xl font-bold text-blue-700 mt-3">
              {analytics.revenue !== null
                ? `₹${Number(
                    analytics.revenue
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Total sales revenue
            </p>
          </div>


          {/* Average Order */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">
              Average Order
            </p>

            <p className="text-3xl font-bold text-green-700 mt-3">
              {analytics.averageOrder !== null
                ? `₹${Number(
                    analytics.averageOrder
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Average order value
            </p>
          </div>

        </div>


        {/* BUSINESS INSIGHTS */}
        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Business Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Top Selling Product */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Top Selling Product
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-3">
                    {analytics.topProduct !== null
                      ? analytics.topProduct
                      : "Loading..."}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Product with highest quantity sold
                  </p>
                </div>

                <div className="text-4xl">
                  🏆
                </div>

              </div>

            </div>


            {/* Top Customer */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Highest Value Customer
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-3">
                    {analytics.topCustomer !== null
                      ? analytics.topCustomer
                      : "Loading..."}
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Customer with highest total spending
                  </p>
                </div>

                <div className="text-4xl">
                  👤
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ANALYTICS SUMMARY */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-900">
            Analytics Summary
          </h2>

          <p className="text-gray-600 mt-2">
            Key business performance indicators from your sales data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            {/* Revenue Performance */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

              <p className="text-blue-800 font-semibold">
                Revenue Performance
              </p>

              <p className="text-gray-900 font-bold text-lg mt-2">
                ₹
                {analytics.revenue !== null
                  ? Number(
                      analytics.revenue
                    ).toLocaleString("en-IN")
                  : "Loading..."}
              </p>

            </div>


            {/* Customer Base */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">

              <p className="text-green-800 font-semibold">
                Customer Base
              </p>

              <p className="text-gray-900 font-bold text-lg mt-2">
                {analytics.customers !== null
                  ? analytics.customers
                  : "Loading..."}{" "}
                customers
              </p>

            </div>


            {/* Order Performance */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">

              <p className="text-purple-800 font-semibold">
                Order Performance
              </p>

              <p className="text-gray-900 font-bold text-lg mt-2">
                {analytics.orders !== null
                  ? analytics.orders
                  : "Loading..."}{" "}
                orders
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}