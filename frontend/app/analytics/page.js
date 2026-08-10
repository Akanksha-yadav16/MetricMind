"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getAnalyticsSummary } from "@/services/api";

const CACHE_KEY = "metricmind_analytics";
const CACHE_TIME = 5 * 60 * 1000;

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

  // --------------------------------------------------
  // THEME STATE
  // --------------------------------------------------

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check current theme
    const checkTheme = () => {
      const dark =
        document.documentElement.classList.contains("dark");

      setIsDark(dark);
    };

    // Initial check
    checkTheme();

    // Watch for changes to <html class="dark">
    const observer = new MutationObserver(() => {
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // --------------------------------------------------
  // LOAD ANALYTICS DATA
  // --------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      /*
       * STEP 1
       * Load cached data
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
       * API request
       */

      try {
        const data = await getAnalyticsSummary();

        if (!isMounted) return;

        const formattedData = {
          orders: data.total_orders ?? 0,

          customers: data.total_customers ?? 0,

          revenue: data.total_revenue ?? 0,

          averageOrder: data.average_order_value ?? 0,

          topProduct:
            data.top_product?.product || "No data",

          topCustomer:
            data.top_customer?.customer || "No data",
        };

        setAnalytics(formattedData);
        setLoading(false);

        /*
         * Save to cache
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
          console.error(
            "Analytics cache write error:",
            error
          );
        }
      } catch (error) {
        console.error("Analytics API Error:", error);

        if (!isMounted) return;

        setAnalytics((previous) => {
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

  // --------------------------------------------------
  // THEME COLORS
  // --------------------------------------------------

  const pageBackground = isDark
    ? "bg-gray-950"
    : "bg-gray-50";

  const cardBackground = isDark
    ? "bg-gray-900"
    : "bg-white";

  const borderColor = isDark
    ? "border-gray-700"
    : "border-gray-200";

  const headingColor = isDark
    ? "text-white"
    : "text-gray-900";

  const secondaryText = isDark
    ? "text-gray-300"
    : "text-gray-600";

  const mutedText = isDark
    ? "text-gray-400"
    : "text-gray-500";

  // --------------------------------------------------
  // SUMMARY CARD COLORS
  // --------------------------------------------------

  const revenueBox = isDark
    ? "bg-blue-950 border-blue-800"
    : "bg-blue-50 border-blue-200";

  const revenueTitle = isDark
    ? "text-blue-300"
    : "text-blue-800";

  const revenueValue = isDark
    ? "text-blue-200"
    : "text-gray-900";

  const customerBox = isDark
    ? "bg-green-950 border-green-800"
    : "bg-green-50 border-green-200";

  const customerTitle = isDark
    ? "text-green-300"
    : "text-green-800";

  const customerValue = isDark
    ? "text-green-100"
    : "text-gray-900";

  const orderBox = isDark
    ? "bg-purple-950 border-purple-800"
    : "bg-purple-50 border-purple-200";

  const orderTitle = isDark
    ? "text-purple-300"
    : "text-purple-800";

  const orderValue = isDark
    ? "text-purple-100"
    : "text-gray-900";

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${pageBackground}`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="mb-8">

          <h1
            className={`text-4xl font-bold ${headingColor}`}
          >
            Analytics
          </h1>

          <p
            className={`mt-2 text-base ${secondaryText}`}
          >
            Business Intelligence Dashboard
          </p>

          {loading && (
            <p
              className={`text-sm mt-3 ${mutedText}`}
            >
              Loading analytics data...
            </p>
          )}

        </div>


        {/* =========================================
            KPI CARDS
        ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* TOTAL ORDERS */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
          >

            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Total Orders
            </p>

            <p
              className={`text-3xl font-bold mt-3 ${headingColor}`}
            >
              {analytics.orders !== null
                ? analytics.orders
                : "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Orders received
            </p>

          </div>


          {/* TOTAL CUSTOMERS */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
          >

            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Total Customers
            </p>

            <p
              className={`text-3xl font-bold mt-3 ${headingColor}`}
            >
              {analytics.customers !== null
                ? analytics.customers
                : "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Customers with orders
            </p>

          </div>


          {/* TOTAL REVENUE */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
          >

            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Total Revenue
            </p>

            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-3">
              {analytics.revenue !== null
                ? `₹${Number(
                    analytics.revenue
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Total sales revenue
            </p>

          </div>


          {/* AVERAGE ORDER */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
          >

            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Average Order
            </p>

            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-3">
              {analytics.averageOrder !== null
                ? `₹${Number(
                    analytics.averageOrder
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Average order value
            </p>

          </div>

        </div>


        {/* =========================================
            BUSINESS INSIGHTS
        ========================================= */}

        <div className="mt-8">

          <h2
            className={`text-2xl font-bold mb-5 ${headingColor}`}
          >
            Business Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* TOP SELLING PRODUCT */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Top Selling Product
                  </p>

                  <p
                    className={`text-2xl font-bold mt-3 ${headingColor}`}
                  >
                    {analytics.topProduct !== null
                      ? analytics.topProduct
                      : "Loading..."}
                  </p>

                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
                    Product with highest quantity sold
                  </p>

                </div>

                <div className="text-4xl">
                  🏆
                </div>

              </div>

            </div>


            {/* TOP CUSTOMER */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Highest Value Customer
                  </p>

                  <p
                    className={`text-2xl font-bold mt-3 ${headingColor}`}
                  >
                    {analytics.topCustomer !== null
                      ? analytics.topCustomer
                      : "Loading..."}
                  </p>

                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
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


        {/* =========================================
            ANALYTICS SUMMARY
        ========================================= */}

        <div
          className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 mt-8 transition-colors duration-300`}
        >

          <h2
            className={`text-xl font-bold ${headingColor}`}
          >
            Analytics Summary
          </h2>

          <p
            className={`mt-2 ${secondaryText}`}
          >
            Key business performance indicators from your
            sales data.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">


            {/* =====================================
                REVENUE PERFORMANCE
            ===================================== */}

            <div
              className={`${revenueBox} border rounded-xl p-5 transition-colors duration-300`}
            >

              <p
                className={`font-semibold ${revenueTitle}`}
              >
                Revenue Performance
              </p>

              <p
                className={`font-bold text-lg mt-2 ${revenueValue}`}
              >
                ₹
                {analytics.revenue !== null
                  ? Number(
                      analytics.revenue
                    ).toLocaleString("en-IN")
                  : "Loading..."}
              </p>

            </div>


            {/* =====================================
                CUSTOMER BASE
            ===================================== */}

            <div
              className={`${customerBox} border rounded-xl p-5 transition-colors duration-300`}
            >

              <p
                className={`font-semibold ${customerTitle}`}
              >
                Customer Base
              </p>

              <p
                className={`font-bold text-lg mt-2 ${customerValue}`}
              >
                {analytics.customers !== null
                  ? analytics.customers
                  : "Loading..."}{" "}
                customers
              </p>

            </div>


            {/* =====================================
                ORDER PERFORMANCE
            ===================================== */}

            <div
              className={`${orderBox} border rounded-xl p-5 transition-colors duration-300`}
            >

              <p
                className={`font-semibold ${orderTitle}`}
              >
                Order Performance
              </p>

              <p
                className={`font-bold text-lg mt-2 ${orderValue}`}
              >
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