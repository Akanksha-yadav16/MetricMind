"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getDashboardSummary } from "@/services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CACHE_KEY = "metricmind_analytics";
const CACHE_TIME = 5 * 60 * 1000;

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    orders: null,
    customers: null,
    revenue: null,
    averageOrder: null,
    topProduct: null,
    topProductQuantity: 0,
    topCustomer: null,
    topCustomerSpent: 0,
    revenueByProduct: [],
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
  // LOAD ANALYTICS DATA
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      // -------------------------------------------------------
      // LOAD CACHE FIRST
      // -------------------------------------------------------

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
        console.error(
          "Analytics cache read error:",
          error
        );
      }

      // -------------------------------------------------------
      // LOAD FRESH DATA
      // -------------------------------------------------------

      try {
        /*
         * We use the existing Dashboard Summary API because
         * it already returns:
         *
         * - KPI metrics
         * - top product
         * - top customer
         * - revenue by product
         *
         * No backend modification is required.
         */

        const data = await getDashboardSummary();

        if (!isMounted) return;

        const revenueData =
          data.revenue_by_product || [];

        const formattedData = {
          orders: data.total_orders ?? 0,

          customers: data.total_customers ?? 0,

          revenue: data.total_revenue ?? 0,

          averageOrder:
            data.average_order_value ?? 0,

          topProduct:
            data.top_product?.product || "No data",

          topProductQuantity:
            data.top_product?.quantity_sold ?? 0,

          topCustomer:
            data.top_customer?.customer || "No data",

          topCustomerSpent:
            data.top_customer?.total_spent ?? 0,

          revenueByProduct: revenueData,
        };

        setAnalytics(formattedData);
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
            "Analytics cache write error:",
            error
          );
        }
      } catch (error) {
        console.error(
          "Analytics API Error:",
          error
        );

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
            topProductQuantity: 0,
            topCustomer: "Error",
            topCustomerSpent: 0,
            revenueByProduct: [],
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

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const revenueData = analytics.revenueByProduct || [];

  const totalRevenue = Number(analytics.revenue || 0);

  // Sort products from highest revenue to lowest
  const sortedRevenueData = useMemo(() => {
    return [...revenueData]
      .map((item) => ({
        product: item.product,
        revenue: Number(item.revenue || 0),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [revenueData]);

  // Add percentage contribution
  const contributionData = useMemo(() => {
    return sortedRevenueData.map((item) => ({
      ...item,
      percentage:
        totalRevenue > 0
          ? (item.revenue / totalRevenue) * 100
          : 0,
    }));
  }, [sortedRevenueData, totalRevenue]);

  const topRevenueProduct =
    contributionData.length > 0
      ? contributionData[0]
      : null;

  const topThreeRevenue = contributionData
    .slice(0, 3)
    .reduce((sum, item) => sum + item.revenue, 0);

  const topThreePercentage =
    totalRevenue > 0
      ? (topThreeRevenue / totalRevenue) * 100
      : 0;

  const revenuePerCustomer =
    Number(analytics.customers || 0) > 0
      ? totalRevenue / Number(analytics.customers)
      : 0;

  const topCustomerPercentage =
    totalRevenue > 0
      ? (Number(analytics.topCustomerSpent || 0) /
          totalRevenue) *
        100
      : 0;

  // =========================================================
  // PIE CHART DATA
  // =========================================================

  const pieData = useMemo(() => {
    if (!contributionData.length) {
      return [];
    }

    /*
     * Show the top 5 products individually.
     * Everything else is grouped as "Other".
     *
     * This makes the donut chart easier to read.
     */

    const topFive = contributionData.slice(0, 5);

    const otherRevenue = contributionData
      .slice(5)
      .reduce(
        (sum, item) => sum + item.revenue,
        0
      );

    const result = [...topFive];

    if (otherRevenue > 0) {
      result.push({
        product: "Other",
        revenue: otherRevenue,
        percentage:
          totalRevenue > 0
            ? (otherRevenue / totalRevenue) * 100
            : 0,
      });
    }

    return result;
  }, [contributionData, totalRevenue]);

  // =========================================================
  // COLORS
  // =========================================================

  const chartColors = [
    "#3b82f6",
    "#22c55e",
    "#a855f7",
    "#f97316",
    "#ef4444",
    "#06b6d4",
  ];

  const pageBackground = isDark
    ? "bg-gray-950"
    : "bg-gray-50";

  const cardBackground = isDark
    ? "bg-gray-900"
    : "bg-white";

  const borderColor = isDark
    ? "border-gray-800"
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

  const chartGrid = isDark
    ? "#374151"
    : "#e5e7eb";

  const chartText = isDark
    ? "#d1d5db"
    : "#4b5563";

  // =========================================================
  // CUSTOM TOOLTIP
  // =========================================================

  const RevenueTooltip = ({
    active,
    payload,
  }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const item = payload[0].payload;

    return (
      <div
        className={`rounded-xl border px-4 py-3 shadow-lg ${
          isDark
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <p
          className={`font-semibold ${headingColor}`}
        >
          {item.product}
        </p>

        <p className="text-blue-500 font-bold mt-1">
          ₹
          {Number(item.revenue).toLocaleString(
            "en-IN"
          )}
        </p>

        <p
          className={`text-sm mt-1 ${mutedText}`}
        >
          {Number(item.percentage).toFixed(2)}% of
          total revenue
        </p>
      </div>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading &&
    analytics.orders === null
  ) {
    return (
      <div
        className={`flex min-h-screen ${pageBackground}`}
      >
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <p
              className={`text-lg font-semibold ${secondaryText}`}
            >
              Loading analytics...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${pageBackground}`}
    >
      <Sidebar />

      <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-8">

          <h1
            className={`text-3xl md:text-4xl font-bold ${headingColor}`}
          >
            Analytics
          </h1>

          <p
            className={`mt-2 text-base ${secondaryText}`}
          >
            Business performance analysis and
            actionable insights
          </p>

          {loading && (
            <p
              className={`mt-3 text-sm ${mutedText}`}
            >
              Updating analytics...
            </p>
          )}

        </div>

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {/* Orders */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
          >
            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Total Orders
            </p>

            <p
              className={`text-3xl font-bold mt-3 ${headingColor}`}
            >
              {analytics.orders ?? "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Orders received
            </p>
          </div>

          {/* Customers */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
          >
            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Total Customers
            </p>

            <p
              className={`text-3xl font-bold mt-3 ${headingColor}`}
            >
              {analytics.customers ?? "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Customers with orders
            </p>
          </div>

          {/* Revenue */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
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

          {/* Average Order */}

          <div
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
          >
            <p
              className={`text-sm font-semibold ${secondaryText}`}
            >
              Average Order Value
            </p>

            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-3">
              {analytics.averageOrder !== null
                ? `₹${Number(
                    analytics.averageOrder
                  ).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`
                : "Loading..."}
            </p>

            <p
              className={`text-sm mt-2 ${mutedText}`}
            >
              Average revenue per order
            </p>
          </div>

        </div>

        {/* ===================================================
            ANALYTICAL CHARTS
        =================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

          {/* =================================================
              BAR CHART
          ================================================= */}

          <section
            className={`${cardBackground} xl:col-span-2 rounded-2xl border ${borderColor} shadow-sm p-5 sm:p-6`}
          >

            <div className="mb-5">

              <h2
                className={`text-xl font-bold ${headingColor}`}
              >
                Revenue Contribution by Product
              </h2>

              <p
                className={`text-sm mt-1 ${mutedText}`}
              >
                Compare how much each product contributes
                to overall revenue
              </p>

            </div>

            <div className="h-[380px] w-full">

              {contributionData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={contributionData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 60,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartGrid}
                    />

                    <XAxis
                      dataKey="product"
                      angle={-35}
                      textAnchor="end"
                      height={80}
                      tick={{
                        fill: chartText,
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: chartText,
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `₹${Number(
                          value
                        ).toLocaleString("en-IN")}`
                      }
                    />

                    <Tooltip
                      content={<RevenueTooltip />}
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={mutedText}>
                    No revenue data available.
                  </p>
                </div>
              )}

            </div>

          </section>

          {/* =================================================
              DONUT CHART
          ================================================= */}

          <section
            className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-5 sm:p-6`}
          >

            <div className="mb-4">

              <h2
                className={`text-xl font-bold ${headingColor}`}
              >
                Revenue Share
              </h2>

              <p
                className={`text-sm mt-1 ${mutedText}`}
              >
                Product contribution to total revenue
              </p>

            </div>

            <div className="h-[380px]">

              {pieData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={pieData}
                      dataKey="revenue"
                      nameKey="product"
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={2}
                    >

                      {pieData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              chartColors[
                                index %
                                  chartColors.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        `₹${Number(
                          value
                        ).toLocaleString(
                          "en-IN"
                        )}`,
                        name,
                      ]}
                    />

                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      wrapperStyle={{
                        color: chartText,
                        fontSize: "12px",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className={mutedText}>
                    No revenue data available.
                  </p>
                </div>
              )}

            </div>

          </section>

        </div>

        {/* ===================================================
            PRODUCT CONTRIBUTION ANALYSIS
        =================================================== */}

        <section
          className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-5 sm:p-6 mt-6`}
        >

          <div className="mb-6">

            <h2
              className={`text-xl font-bold ${headingColor}`}
            >
              Product Contribution Analysis
            </h2>

            <p
              className={`text-sm mt-1 ${mutedText}`}
            >
              Percentage contribution of each product
              to total revenue
            </p>

          </div>

          <div className="space-y-5">

            {contributionData.length > 0 ? (
              contributionData.map(
                (item, index) => (
                  <div key={item.product}>

                    <div className="flex items-center justify-between mb-2">

                      <span
                        className={`font-medium ${headingColor}`}
                      >
                        {item.product}
                      </span>

                      <span
                        className={`text-sm font-semibold ${secondaryText}`}
                      >
                        {item.percentage.toFixed(
                          2
                        )}
                        %
                      </span>

                    </div>

                    <div
                      className={`h-3 rounded-full overflow-hidden ${
                        isDark
                          ? "bg-gray-800"
                          : "bg-gray-100"
                      }`}
                    >

                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            item.percentage,
                            100
                          )}%`,
                          background:
                            chartColors[
                              index %
                                chartColors.length
                            ],
                        }}
                      />

                    </div>

                  </div>
                )
              )
            ) : (
              <p className={mutedText}>
                No product contribution data
                available.
              </p>
            )}

          </div>

        </section>

        {/* ===================================================
            ANALYTICAL INSIGHTS
        =================================================== */}

        <section
          className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-5 sm:p-6 mt-6`}
        >

          <div className="mb-6">

            <h2
              className={`text-xl font-bold ${headingColor}`}
            >
              Analytical Insights
            </h2>

            <p
              className={`text-sm mt-1 ${mutedText}`}
            >
              Key observations generated from your
              current sales data
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Top Revenue Product */}

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-blue-900 bg-blue-950/30"
                  : "border-blue-100 bg-blue-50"
              }`}
            >

              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Highest Revenue Product
              </p>

              <p
                className={`text-xl font-bold mt-3 ${headingColor}`}
              >
                {topRevenueProduct?.product ||
                  "No data"}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                ₹
                {Number(
                  topRevenueProduct?.revenue || 0
                ).toLocaleString("en-IN")}
              </p>

            </div>

            {/* Revenue Contribution */}

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-green-900 bg-green-950/30"
                  : "border-green-100 bg-green-50"
              }`}
            >

              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                Top Product Contribution
              </p>

              <p
                className={`text-2xl font-bold mt-3 ${headingColor}`}
              >
                {topRevenueProduct
                  ? `${topRevenueProduct.percentage.toFixed(
                      2
                    )}%`
                  : "0%"}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Of total revenue
              </p>

            </div>

            {/* Top 3 Concentration */}

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-purple-900 bg-purple-950/30"
                  : "border-purple-100 bg-purple-50"
              }`}
            >

              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Top 3 Revenue Share
              </p>

              <p
                className={`text-2xl font-bold mt-3 ${headingColor}`}
              >
                {topThreePercentage.toFixed(2)}%
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Revenue generated by top 3 products
              </p>

            </div>

            {/* Revenue Per Customer */}

            <div
              className={`rounded-xl border p-5 ${
                isDark
                  ? "border-orange-900 bg-orange-950/30"
                  : "border-orange-100 bg-orange-50"
              }`}
            >

              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                Revenue per Customer
              </p>

              <p
                className={`text-2xl font-bold mt-3 ${headingColor}`}
              >
                ₹
                {revenuePerCustomer.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Average revenue per customer
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            BUSINESS INSIGHTS
        =================================================== */}

        <section className="mt-6">

          <h2
            className={`text-2xl font-bold mb-5 ${headingColor}`}
          >
            Business Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Top Product */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
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
                    {analytics.topProduct ||
                      "Loading..."}
                  </p>

                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
                    {analytics.topProductQuantity}{" "}
                    units sold
                  </p>

                </div>

                <div className="text-4xl">
                  🏆
                </div>

              </div>

            </div>

            {/* Top Customer */}

            <div
              className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-6`}
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
                    {analytics.topCustomer ||
                      "Loading..."}
                  </p>

                  <p
                    className={`text-sm mt-2 ${mutedText}`}
                  >
                    ₹
                    {Number(
                      analytics.topCustomerSpent ||
                        0
                    ).toLocaleString("en-IN")}{" "}
                    total spending
                  </p>

                </div>

                <div className="text-4xl">
                  👤
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <section
          className={`${cardBackground} rounded-2xl border ${borderColor} shadow-sm p-5 sm:p-6 mt-6 mb-8`}
        >

          <h2
            className={`text-xl font-bold ${headingColor}`}
          >
            Performance Summary
          </h2>

          <p
            className={`mt-2 ${secondaryText}`}
          >
            Based on the current sales data,{" "}
            <strong>
              {topRevenueProduct?.product ||
                "the leading product"}
            </strong>{" "}
            is the strongest revenue contributor.

            The top three products account for{" "}
            <strong>
              {topThreePercentage.toFixed(2)}%
            </strong>{" "}
            of total revenue, while the average
            revenue generated per customer is{" "}
            <strong>
              ₹
              {revenuePerCustomer.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}
            </strong>
            .
          </p>

        </section>

      </main>
    </div>
  );
}