"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getAnalyticsSummary } from "@/services/api";

const CACHE_KEY = "metricmind_analytics";
<<<<<<< HEAD
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
=======
const CACHE_TIME = 5 * 60 * 1000;
>>>>>>> final-project

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

<<<<<<< HEAD
=======
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

>>>>>>> final-project
  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      /*
       * STEP 1
<<<<<<< HEAD
       * Load cached data immediately.
       */
=======
       * Load cached data
       */

>>>>>>> final-project
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
<<<<<<< HEAD
       * Make ONLY ONE API REQUEST.
       */
=======
       * API request
       */

>>>>>>> final-project
      try {
        const data = await getAnalyticsSummary();

        if (!isMounted) return;

        const formattedData = {
          orders: data.total_orders ?? 0,

          customers: data.total_customers ?? 0,

          revenue: data.total_revenue ?? 0,

          averageOrder: data.average_order_value ?? 0,

<<<<<<< HEAD
          topProduct: data.top_product?.product || "No data",

          topCustomer: data.top_customer?.customer || "No data",
        };

        /*
         * Update UI.
         */
=======
          topProduct:
            data.top_product?.product || "No data",

          topCustomer:
            data.top_customer?.customer || "No data",
        };

>>>>>>> final-project
        setAnalytics(formattedData);
        setLoading(false);

        /*
<<<<<<< HEAD
         * Save data to browser cache.
         */
=======
         * Save to cache
         */

>>>>>>> final-project
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: formattedData,
            })
          );
        } catch (error) {
<<<<<<< HEAD
          console.error("Analytics cache write error:", error);
=======
          console.error(
            "Analytics cache write error:",
            error
          );
>>>>>>> final-project
        }
      } catch (error) {
        console.error("Analytics API Error:", error);

        if (!isMounted) return;

        setAnalytics((previous) => {
<<<<<<< HEAD
          /*
           * If cached data is already displayed,
           * keep it instead of replacing it with errors.
           */
=======
>>>>>>> final-project
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

<<<<<<< HEAD
  return (
    <div className="flex min-h-screen bg-gray-50">

=======
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
>>>>>>> final-project
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">

<<<<<<< HEAD
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="text-gray-600 mt-2 text-base">
=======
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
>>>>>>> final-project
            Business Intelligence Dashboard
          </p>

          {loading && (
<<<<<<< HEAD
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
=======
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
>>>>>>> final-project
              {analytics.orders !== null
                ? analytics.orders
                : "Loading..."}
            </p>

<<<<<<< HEAD
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
=======
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
>>>>>>> final-project
              {analytics.customers !== null
                ? analytics.customers
                : "Loading..."}
            </p>

<<<<<<< HEAD
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
=======
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
>>>>>>> final-project
              {analytics.revenue !== null
                ? `₹${Number(
                    analytics.revenue
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

<<<<<<< HEAD
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
=======
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
>>>>>>> final-project
              {analytics.averageOrder !== null
                ? `₹${Number(
                    analytics.averageOrder
                  ).toLocaleString("en-IN")}`
                : "Loading..."}
            </p>

<<<<<<< HEAD
            <p className="text-gray-500 text-sm mt-2">
              Average order value
            </p>
=======
            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Average order value
            </p>

>>>>>>> final-project
          </div>

        </div>


<<<<<<< HEAD
        {/* BUSINESS INSIGHTS */}
        <div className="mt-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
=======
        {/* =========================================
            BUSINESS INSIGHTS
        ========================================= */}

        <div className="mt-8">

          <h2
            className={`text-2xl font-bold mb-5 ${headingColor}`}
          >
>>>>>>> final-project
            Business Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<<<<<<< HEAD
            {/* Top Selling Product */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
=======

            {/* TOP SELLING PRODUCT */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
            >
>>>>>>> final-project

              <div className="flex items-center justify-between">

                <div>
<<<<<<< HEAD
                  <p className="text-gray-600 text-sm font-semibold">
                    Top Selling Product
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-3">
=======

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Top Selling Product
                  </p>

                  <p
                    className={`text-2xl font-bold mt-3 ${headingColor}`}
                  >
>>>>>>> final-project
                    {analytics.topProduct !== null
                      ? analytics.topProduct
                      : "Loading..."}
                  </p>

<<<<<<< HEAD
                  <p className="text-gray-500 text-sm mt-2">
                    Product with highest quantity sold
                  </p>
=======
                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
                    Product with highest quantity sold
                  </p>

>>>>>>> final-project
                </div>

                <div className="text-4xl">
                  🏆
                </div>

              </div>

            </div>


<<<<<<< HEAD
            {/* Top Customer */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
=======
            {/* TOP CUSTOMER */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-md p-6 transition-colors duration-300`}
            >
>>>>>>> final-project

              <div className="flex items-center justify-between">

                <div>
<<<<<<< HEAD
                  <p className="text-gray-600 text-sm font-semibold">
                    Highest Value Customer
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mt-3">
=======

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Highest Value Customer
                  </p>

                  <p
                    className={`text-2xl font-bold mt-3 ${headingColor}`}
                  >
>>>>>>> final-project
                    {analytics.topCustomer !== null
                      ? analytics.topCustomer
                      : "Loading..."}
                  </p>

<<<<<<< HEAD
                  <p className="text-gray-500 text-sm mt-2">
                    Customer with highest total spending
                  </p>
=======
                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
                    Customer with highest total spending
                  </p>

>>>>>>> final-project
                </div>

                <div className="text-4xl">
                  👤
                </div>

              </div>

            </div>

          </div>

        </div>


<<<<<<< HEAD
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
=======
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
>>>>>>> final-project
                ₹
                {analytics.revenue !== null
                  ? Number(
                      analytics.revenue
                    ).toLocaleString("en-IN")
                  : "Loading..."}
              </p>

            </div>


<<<<<<< HEAD
            {/* Customer Base */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">

              <p className="text-green-800 font-semibold">
                Customer Base
              </p>

              <p className="text-gray-900 font-bold text-lg mt-2">
=======
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
>>>>>>> final-project
                {analytics.customers !== null
                  ? analytics.customers
                  : "Loading..."}{" "}
                customers
              </p>

            </div>


<<<<<<< HEAD
            {/* Order Performance */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">

              <p className="text-purple-800 font-semibold">
                Order Performance
              </p>

              <p className="text-gray-900 font-bold text-lg mt-2">
=======
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
>>>>>>> final-project
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