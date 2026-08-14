"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/layout/Sidebar";
import { getDashboardSummary } from "@/services/api";

const CACHE_KEY = "metricmind_dashboard";
const CACHE_TIME = 5 * 60 * 1000;

export default function Home() {
  const [dashboard, setDashboard] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    averageOrderValue: 0,

    topProduct: {
      product: "No data",
      quantity_sold: 0,
    },

    topCustomer: {
      customer: "No data",
      total_spent: 0,
    },

    chartData: [],
  });

  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // =========================================================
  // THEME DETECTION
  // =========================================================

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark")
      );
    };

    checkTheme();

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

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      // -------------------------------------------------------
      // LOAD CACHE FIRST
      // -------------------------------------------------------

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          const cacheAge =
            Date.now() - parsed.timestamp;

          if (
            cacheAge < CACHE_TIME &&
            isMounted
          ) {
            setDashboard(parsed.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error(
          "Dashboard cache read error:",
          error
        );
      }

      // -------------------------------------------------------
      // GET FRESH DATA
      // -------------------------------------------------------

      try {
        const data = await getDashboardSummary();

        if (!isMounted) return;

        const formattedData = {
          revenue: Number(data.total_revenue || 0),

          orders: Number(data.total_orders || 0),

          customers: Number(
            data.total_customers || 0
          ),

          averageOrderValue: Number(
            data.average_order_value || 0
          ),

          topProduct:
            data.top_product || {
              product: "No data",
              quantity_sold: 0,
            },

          topCustomer:
            data.top_customer || {
              customer: "No data",
              total_spent: 0,
            },

          chartData:
            data.revenue_by_product || [],
        };

        setDashboard(formattedData);
        setLoading(false);

        // -----------------------------------------------------
        // SAVE CACHE
        // -----------------------------------------------------

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
            "Dashboard cache write error:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Dashboard API Error:",
          error
        );

        if (!isMounted) return;

        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // FORMATTING
  // =========================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatCurrencyDecimal = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =========================================================
  // DERIVED VALUES
  // =========================================================

  const revenuePerCustomer =
    dashboard.customers > 0
      ? dashboard.revenue / dashboard.customers
      : 0;

  const topCustomerContribution =
    dashboard.revenue > 0
      ? (dashboard.topCustomer.total_spent /
          dashboard.revenue) *
        100
      : 0;

  const topProductQuantity =
    dashboard.topProduct.quantity_sold || 0;

  const hasData =
    dashboard.revenue > 0 ||
    dashboard.orders > 0 ||
    dashboard.customers > 0;

  // =========================================================
  // THEME
  // =========================================================

  const pageBg = isDark
    ? "bg-gray-950"
    : "bg-gray-50";

  const cardBg = isDark
    ? "bg-gray-900"
    : "bg-white";

  const border = isDark
    ? "border-gray-800"
    : "border-gray-200";

  const heading = isDark
    ? "text-white"
    : "text-gray-900";

  const text = isDark
    ? "text-gray-300"
    : "text-gray-600";

  const muted = isDark
    ? "text-gray-500"
    : "text-gray-400";

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${pageBg}`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8 xl:p-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3">

              <h1
                className={`text-3xl sm:text-4xl font-bold ${heading}`}
              >
                Dashboard
              </h1>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  isDark
                    ? "bg-green-950/60 text-green-400"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Live
              </span>

            </div>

            <p className={`mt-2 ${text}`}>
              Your business performance at a glance
            </p>
          </div>

          <div
            className={`text-sm ${muted}`}
          >
            {loading
              ? "Updating business data..."
              : "Data synced successfully"}
          </div>

        </div>

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* TOTAL REVENUE */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className={`text-sm font-medium ${text}`}>
                  Total Revenue
                </p>

                <p
                  className={`mt-3 text-3xl font-bold ${heading}`}
                >
                  {formatCurrency(
                    dashboard.revenue
                  )}
                </p>
              </div>

              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                  isDark
                    ? "bg-green-950 text-green-400"
                    : "bg-green-50 text-green-600"
                }`}
              >
                ₹
              </div>

            </div>

            <div
              className={`mt-5 pt-4 border-t ${border}`}
            >
              <p className={`text-xs ${muted}`}>
                Total sales generated
              </p>
            </div>
          </div>


          {/* TOTAL ORDERS */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className={`text-sm font-medium ${text}`}>
                  Total Orders
                </p>

                <p
                  className={`mt-3 text-3xl font-bold ${heading}`}
                >
                  {dashboard.orders}
                </p>
              </div>

              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                  isDark
                    ? "bg-blue-950 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                #
              </div>

            </div>

            <div
              className={`mt-5 pt-4 border-t ${border}`}
            >
              <p className={`text-xs ${muted}`}>
                Orders received
              </p>
            </div>
          </div>


          {/* CUSTOMERS */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className={`text-sm font-medium ${text}`}>
                  Customers
                </p>

                <p
                  className={`mt-3 text-3xl font-bold ${heading}`}
                >
                  {dashboard.customers}
                </p>
              </div>

              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                  isDark
                    ? "bg-purple-950 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                }`}
              >
                👥
              </div>

            </div>

            <div
              className={`mt-5 pt-4 border-t ${border}`}
            >
              <p className={`text-xs ${muted}`}>
                Customers with orders
              </p>
            </div>
          </div>


          {/* AVERAGE ORDER */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between">

              <div>
                <p className={`text-sm font-medium ${text}`}>
                  Average Order
                </p>

                <p
                  className={`mt-3 text-3xl font-bold ${heading}`}
                >
                  {formatCurrencyDecimal(
                    dashboard.averageOrderValue
                  )}
                </p>
              </div>

              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                  isDark
                    ? "bg-orange-950 text-orange-400"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                ↗
              </div>

            </div>

            <div
              className={`mt-5 pt-4 border-t ${border}`}
            >
              <p className={`text-xs ${muted}`}>
                Average value per order
              </p>
            </div>
          </div>

        </section>


        {/* ===================================================
            BUSINESS OVERVIEW
        =================================================== */}

        <section className="mt-7 grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* -------------------------------------------------
              BUSINESS SNAPSHOT
          ------------------------------------------------- */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6 xl:col-span-2`}
          >

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2
                  className={`text-xl font-bold ${heading}`}
                >
                  Business Snapshot
                </h2>

                <p
                  className={`text-sm mt-1 ${text}`}
                >
                  Key numbers from your current sales data
                </p>
              </div>

              <div className="text-2xl">
                📊
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Revenue per customer */}

              <div
                className={`rounded-xl p-5 ${
                  isDark
                    ? "bg-gray-800/70"
                    : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${muted}`}
                >
                  Revenue / Customer
                </p>

                <p
                  className={`text-xl font-bold mt-2 ${heading}`}
                >
                  {formatCurrency(
                    revenuePerCustomer
                  )}
                </p>

                <p
                  className={`text-xs mt-2 ${muted}`}
                >
                  Average revenue generated per customer
                </p>
              </div>


              {/* Units sold */}

              <div
                className={`rounded-xl p-5 ${
                  isDark
                    ? "bg-gray-800/70"
                    : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${muted}`}
                >
                  Top Product Units
                </p>

                <p
                  className={`text-xl font-bold mt-2 ${heading}`}
                >
                  {topProductQuantity}
                </p>

                <p
                  className={`text-xs mt-2 ${muted}`}
                >
                  Units sold by the leading product
                </p>
              </div>


              {/* Customer contribution */}

              <div
                className={`rounded-xl p-5 ${
                  isDark
                    ? "bg-gray-800/70"
                    : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-sm ${muted}`}
                >
                  Top Customer Share
                </p>

                <p
                  className={`text-xl font-bold mt-2 ${heading}`}
                >
                  {topCustomerContribution.toFixed(1)}%
                </p>

                <p
                  className={`text-xs mt-2 ${muted}`}
                >
                  Share of total revenue
                </p>
              </div>

            </div>

          </div>


          {/* -------------------------------------------------
              DATA STATUS
          ------------------------------------------------- */}

          <div
            className={`${cardBg} border ${border} rounded-2xl p-6`}
          >

            <div className="flex items-center justify-between">

              <div>
                <h2
                  className={`text-xl font-bold ${heading}`}
                >
                  Data Status
                </h2>

                <p
                  className={`text-sm mt-1 ${text}`}
                >
                  MetricMind system status
                </p>
              </div>

              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  hasData
                    ? isDark
                      ? "bg-green-950 text-green-400"
                      : "bg-green-50 text-green-600"
                    : isDark
                    ? "bg-yellow-950 text-yellow-400"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {hasData ? "✓" : "!"}
              </div>

            </div>

            <div
              className={`mt-6 rounded-xl p-4 ${
                hasData
                  ? isDark
                    ? "bg-green-950/40"
                    : "bg-green-50"
                  : isDark
                  ? "bg-yellow-950/40"
                  : "bg-yellow-50"
              }`}
            >

              <p
                className={`font-semibold ${
                  hasData
                    ? isDark
                      ? "text-green-400"
                      : "text-green-700"
                    : isDark
                    ? "text-yellow-400"
                    : "text-yellow-700"
                }`}
              >
                {hasData
                  ? "Business data available"
                  : "Waiting for business data"}
              </p>

              <p
                className={`text-xs mt-2 ${
                  hasData
                    ? isDark
                      ? "text-green-500"
                      : "text-green-600"
                    : isDark
                    ? "text-yellow-500"
                    : "text-yellow-600"
                }`}
              >
                {loading
                  ? "Synchronizing with analytics service..."
                  : "Dashboard is connected to the analytics service."}
              </p>

            </div>

            <div className="mt-5 space-y-3">

              <div className="flex justify-between text-sm">
                <span className={muted}>
                  Orders
                </span>

                <span
                  className={`font-semibold ${heading}`}
                >
                  {dashboard.orders}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={muted}>
                  Customers
                </span>

                <span
                  className={`font-semibold ${heading}`}
                >
                  {dashboard.customers}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className={muted}>
                  Revenue
                </span>

                <span
                  className={`font-semibold ${heading}`}
                >
                  {formatCurrency(
                    dashboard.revenue
                  )}
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            BUSINESS HIGHLIGHTS
        =================================================== */}

        <section className="mt-7">

          <div className="mb-5">

            <h2
              className={`text-xl font-bold ${heading}`}
            >
              Business Highlights
            </h2>

            <p
              className={`text-sm mt-1 ${text}`}
            >
              The most important performers in your sales data
            </p>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* TOP PRODUCT */}

            <div
              className={`${cardBg} border ${border} rounded-2xl p-6`}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${
                    isDark
                      ? "bg-yellow-950 text-yellow-400"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  🏆
                </div>

                <div className="flex-1">

                  <p
                    className={`text-sm font-medium ${muted}`}
                  >
                    Best Selling Product
                  </p>

                  <h3
                    className={`text-2xl font-bold mt-1 ${heading}`}
                  >
                    {dashboard.topProduct.product}
                  </h3>

                  <p
                    className={`text-sm mt-1 ${text}`}
                  >
                    {dashboard.topProduct.quantity_sold}{" "}
                    units sold
                  </p>

                </div>

              </div>

            </div>


            {/* TOP CUSTOMER */}

            <div
              className={`${cardBg} border ${border} rounded-2xl p-6`}
            >

              <div className="flex items-center gap-4">

                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${
                    isDark
                      ? "bg-purple-950 text-purple-400"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  👤
                </div>

                <div className="flex-1">

                  <p
                    className={`text-sm font-medium ${muted}`}
                  >
                    Highest Value Customer
                  </p>

                  <h3
                    className={`text-2xl font-bold mt-1 ${heading}`}
                  >
                    {dashboard.topCustomer.customer}
                  </h3>

                  <p
                    className={`text-sm mt-1 ${text}`}
                  >
                    {formatCurrency(
                      dashboard.topCustomer.total_spent
                    )}{" "}
                    total spending
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            QUICK ACCESS
        =================================================== */}

        <section className="mt-7">

          <div className="mb-5">

            <h2
              className={`text-xl font-bold ${heading}`}
            >
              Continue Analysis
            </h2>

            <p
              className={`text-sm mt-1 ${text}`}
            >
              Explore your business data in more detail
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* ANALYTICS */}

            <Link
              href="/analytics"
              className={`group ${cardBg} border ${border} rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >

              <div className="flex items-center justify-between">

                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                    isDark
                      ? "bg-blue-950 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  📈
                </div>

                <span
                  className={`text-xl transition-transform group-hover:translate-x-1 ${muted}`}
                >
                  →
                </span>

              </div>

              <h3
                className={`font-bold text-lg mt-5 ${heading}`}
              >
                Analytics
              </h3>

              <p
                className={`text-sm mt-1 ${text}`}
              >
                Explore charts, trends and business performance.
              </p>

            </Link>


            {/* REPORTS */}

            <Link
              href="/reports"
              className={`group ${cardBg} border ${border} rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >

              <div className="flex items-center justify-between">

                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                    isDark
                      ? "bg-green-950 text-green-400"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  📄
                </div>

                <span
                  className={`text-xl transition-transform group-hover:translate-x-1 ${muted}`}
                >
                  →
                </span>

              </div>

              <h3
                className={`font-bold text-lg mt-5 ${heading}`}
              >
                Reports
              </h3>

              <p
                className={`text-sm mt-1 ${text}`}
              >
                View detailed sales and business reports.
              </p>

            </Link>


            {/* AI CHAT */}

            <Link
              href="/chat"
              className={`group ${cardBg} border ${border} rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >

              <div className="flex items-center justify-between">

                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center text-xl ${
                    isDark
                      ? "bg-purple-950 text-purple-400"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  🤖
                </div>

                <span
                  className={`text-xl transition-transform group-hover:translate-x-1 ${muted}`}
                >
                  →
                </span>

              </div>

              <h3
                className={`font-bold text-lg mt-5 ${heading}`}
              >
                AI Assistant
              </h3>

              <p
                className={`text-sm mt-1 ${text}`}
              >
                Ask questions about your business data.
              </p>

            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}