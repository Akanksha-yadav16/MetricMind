"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getReportsSummary } from "@/services/api";

const CACHE_KEY = "metricmind_reports";
const CACHE_TIME = 5 * 60 * 1000;

export default function ReportsPage() {
  const [productReport, setProductReport] = useState([]);
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

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // =========================================================
  // LOAD REPORT DATA
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      // -------------------------------------------------------
      // LOAD CACHE
      // -------------------------------------------------------

      try {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          const cacheAge = Date.now() - parsed.timestamp;

          if (
            cacheAge < CACHE_TIME &&
            isMounted &&
            Array.isArray(parsed.data)
          ) {
            setProductReport(parsed.data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Reports cache read error:", error);
      }

      // -------------------------------------------------------
      // FETCH FRESH DATA
      // -------------------------------------------------------

      try {
        const data = await getReportsSummary();

        if (!isMounted) return;

        const productData = Array.isArray(data.product_report)
          ? data.product_report
          : [];

        setProductReport(productData);
        setLoading(false);

        // -------------------------------------------------------
        // SAVE CACHE
        // -------------------------------------------------------

        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: productData,
            })
          );
        } catch (error) {
          console.error("Reports cache write error:", error);
        }
      } catch (error) {
        console.error("Reports API Error:", error);

        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // REPORT CALCULATIONS
  // =========================================================

  const reportStats = useMemo(() => {
    const totalRevenue = productReport.reduce(
      (sum, item) => sum + Number(item.revenue || 0),
      0
    );

    const totalUnits = productReport.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    const productCount = productReport.length;

    const highestRevenueProduct =
      productReport.length > 0
        ? [...productReport].sort(
            (a, b) =>
              Number(b.revenue || 0) -
              Number(a.revenue || 0)
          )[0]
        : null;

    const highestQuantityProduct =
      productReport.length > 0
        ? [...productReport].sort(
            (a, b) =>
              Number(b.quantity || 0) -
              Number(a.quantity || 0)
          )[0]
        : null;

    const averageRevenuePerProduct =
      productCount > 0
        ? totalRevenue / productCount
        : 0;

    return {
      totalRevenue,
      totalUnits,
      productCount,
      highestRevenueProduct,
      highestQuantityProduct,
      averageRevenuePerProduct,
    };
  }, [productReport]);

  // =========================================================
  // SORT PRODUCT DATA
  // =========================================================

  const sortedProducts = useMemo(() => {
    return [...productReport].sort(
      (a, b) =>
        Number(b.revenue || 0) -
        Number(a.revenue || 0)
    );
  }, [productReport]);

  // =========================================================
  // THEME COLORS
  // =========================================================

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

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading &&
    productReport.length === 0
  ) {
    return (
      <div
        className={`flex min-h-screen ${pageBackground}`}
      >
        <Sidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <p
              className={`text-lg font-semibold ${secondaryText}`}
            >
              Loading reports...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${pageBackground}`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1
                className={`text-3xl md:text-4xl font-bold ${headingColor}`}
              >
                Business Reports
              </h1>

              <p
                className={`mt-2 text-base ${secondaryText}`}
              >
                Detailed sales performance and product
                analysis from your business data.
              </p>
            </div>

            {loading && (
              <div
                className={`text-sm ${mutedText}`}
              >
                Updating report...
              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            REPORT OVERVIEW
        =================================================== */}

        <section className="mb-8">

          <h2
            className={`text-xl font-bold mb-4 ${headingColor}`}
          >
            Report Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* TOTAL REVENUE */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >
              <p
                className={`text-sm font-semibold ${secondaryText}`}
              >
                Total Revenue
              </p>

              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-3">
                {formatCurrency(
                  reportStats.totalRevenue
                )}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Revenue generated
              </p>
            </div>

            {/* TOTAL UNITS */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >
              <p
                className={`text-sm font-semibold ${secondaryText}`}
              >
                Total Units Sold
              </p>

              <p
                className={`text-3xl font-bold mt-3 ${headingColor}`}
              >
                {reportStats.totalUnits}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Products sold
              </p>
            </div>

            {/* PRODUCT COUNT */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >
              <p
                className={`text-sm font-semibold ${secondaryText}`}
              >
                Products Sold
              </p>

              <p
                className={`text-3xl font-bold mt-3 ${headingColor}`}
              >
                {reportStats.productCount}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Unique products
              </p>
            </div>

            {/* AVERAGE REVENUE */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >
              <p
                className={`text-sm font-semibold ${secondaryText}`}
              >
                Avg. Revenue / Product
              </p>

              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-3">
                {formatCurrency(
                  reportStats.averageRevenuePerProduct
                )}
              </p>

              <p
                className={`text-sm mt-2 ${mutedText}`}
              >
                Average product contribution
              </p>
            </div>

          </div>

        </section>

        {/* ===================================================
            KEY REPORT FINDINGS
        =================================================== */}

        <section className="mb-8">

          <h2
            className={`text-xl font-bold mb-4 ${headingColor}`}
          >
            Key Report Findings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* HIGHEST REVENUE */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Highest Revenue Product
                  </p>

                  <p
                    className={`text-2xl font-bold mt-2 ${headingColor}`}
                  >
                    {reportStats.highestRevenueProduct
                      ?.product || "No data"}
                  </p>

                  <p
                    className={`mt-2 ${mutedText}`}
                  >
                    Generated{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(
                        reportStats
                          .highestRevenueProduct
                          ?.revenue
                      )}
                    </span>
                  </p>

                </div>

                <div className="text-3xl">
                  💰
                </div>

              </div>

            </div>

            {/* HIGHEST QUANTITY */}

            <div
              className={`${cardBackground} border ${borderColor} rounded-2xl p-6 shadow-sm`}
            >

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p
                    className={`text-sm font-semibold ${secondaryText}`}
                  >
                    Best Selling by Quantity
                  </p>

                  <p
                    className={`text-2xl font-bold mt-2 ${headingColor}`}
                  >
                    {reportStats.highestQuantityProduct
                      ?.product || "No data"}
                  </p>

                  <p
                    className={`mt-2 ${mutedText}`}
                  >
                    Units sold:{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {reportStats
                        .highestQuantityProduct
                        ?.quantity || 0}
                    </span>
                  </p>

                </div>

                <div className="text-3xl">
                  🏆
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            PRODUCT PERFORMANCE REPORT
        =================================================== */}

        <section
          className={`${cardBackground} border ${borderColor} rounded-2xl p-5 sm:p-6 shadow-sm`}
        >

          {/* HEADER */}

          <div className="mb-6">

            <h2
              className={`text-xl md:text-2xl font-bold ${headingColor}`}
            >
              Product Performance Report
            </h2>

            <p
              className={`mt-1 text-sm ${secondaryText}`}
            >
              Detailed breakdown of product sales,
              quantity and revenue contribution.
            </p>

          </div>

          {/* TABLE */}

          <div
            className={`w-full overflow-x-auto rounded-xl border ${borderColor}`}
          >

            <table className="w-full min-w-[750px] border-collapse text-sm">

              <thead>

                <tr
                  className={
                    isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }
                >

                  <th
                    className={`px-5 py-4 text-left font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    #
                  </th>

                  <th
                    className={`px-5 py-4 text-left font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    Product
                  </th>

                  <th
                    className={`px-5 py-4 text-right font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    Units Sold
                  </th>

                  <th
                    className={`px-5 py-4 text-right font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    Revenue
                  </th>

                  <th
                    className={`px-5 py-4 text-right font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    Revenue Share
                  </th>

                  <th
                    className={`px-5 py-4 text-right font-semibold border-b ${borderColor} ${secondaryText}`}
                  >
                    Avg. Value / Unit
                  </th>

                </tr>

              </thead>

              <tbody>

                {sortedProducts.length > 0 ? (

                  sortedProducts.map(
                    (item, index) => {

                      const revenue =
                        Number(
                          item.revenue || 0
                        );

                      const quantity =
                        Number(
                          item.quantity || 0
                        );

                      const revenueShare =
                        reportStats.totalRevenue > 0
                          ? (revenue /
                              reportStats.totalRevenue) *
                            100
                          : 0;

                      const averageUnitValue =
                        quantity > 0
                          ? revenue / quantity
                          : 0;

                      return (
                        <tr
                          key={`${item.product}-${index}`}
                          className={
                            isDark
                              ? "hover:bg-gray-800/60"
                              : "hover:bg-gray-50"
                          }
                        >

                          {/* RANK */}

                          <td
                            className={`px-5 py-4 border-b ${borderColor} ${mutedText}`}
                          >
                            {index + 1}
                          </td>

                          {/* PRODUCT */}

                          <td
                            className={`px-5 py-4 font-semibold border-b ${borderColor} ${headingColor}`}
                          >
                            {item.product}
                          </td>

                          {/* QUANTITY */}

                          <td
                            className={`px-5 py-4 text-right border-b ${borderColor} ${secondaryText}`}
                          >
                            {quantity}
                          </td>

                          {/* REVENUE */}

                          <td
                            className={`px-5 py-4 text-right font-bold border-b ${borderColor} text-green-600 dark:text-green-400`}
                          >
                            {formatCurrency(revenue)}
                          </td>

                          {/* REVENUE SHARE */}

                          <td
                            className={`px-5 py-4 text-right border-b ${borderColor}`}
                          >
                            <span
                              className={`font-semibold ${
                                isDark
                                  ? "text-blue-300"
                                  : "text-blue-700"
                              }`}
                            >
                              {revenueShare.toFixed(2)}%
                            </span>
                          </td>

                          {/* AVERAGE UNIT VALUE */}

                          <td
                            className={`px-5 py-4 text-right border-b ${borderColor} ${secondaryText}`}
                          >
                            {formatCurrency(
                              averageUnitValue
                            )}
                          </td>

                        </tr>
                      );
                    }
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className={`px-5 py-10 text-center ${mutedText}`}
                    >
                      No product report data available.
                    </td>

                  </tr>

                )}

              </tbody>

              {/* TABLE TOTAL */}

              {sortedProducts.length > 0 && (
                <tfoot>

                  <tr
                    className={
                      isDark
                        ? "bg-gray-800/70"
                        : "bg-gray-50"
                    }
                  >

                    <td
                      colSpan="2"
                      className={`px-5 py-4 font-bold ${headingColor}`}
                    >
                      Total
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-bold ${headingColor}`}
                    >
                      {reportStats.totalUnits}
                    </td>

                    <td
                      className="px-5 py-4 text-right font-bold text-green-600 dark:text-green-400"
                    >
                      {formatCurrency(
                        reportStats.totalRevenue
                      )}
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-bold ${headingColor}`}
                    >
                      100%
                    </td>

                    <td
                      className={`px-5 py-4 text-right ${mutedText}`}
                    >
                      —
                    </td>

                  </tr>

                </tfoot>
              )}

            </table>

          </div>

        </section>

        {/* ===================================================
            REPORT SUMMARY
        =================================================== */}

        <section
          className={`${cardBackground} border ${borderColor} rounded-2xl p-6 mt-8 shadow-sm`}
        >

          <h2
            className={`text-xl font-bold ${headingColor}`}
          >
            Report Summary
          </h2>

          <p
            className={`mt-2 leading-7 ${secondaryText}`}
          >
            The business generated{" "}
            <strong>
              {formatCurrency(
                reportStats.totalRevenue
              )}
            </strong>{" "}
            in total revenue across{" "}
            <strong>
              {reportStats.totalUnits}
            </strong>{" "}
            units sold and{" "}
            <strong>
              {reportStats.productCount}
            </strong>{" "}
            different products.
          </p>

          {reportStats.highestRevenueProduct && (
            <p
              className={`mt-3 leading-7 ${secondaryText}`}
            >
              <strong>
                {
                  reportStats.highestRevenueProduct
                    .product
                }
              </strong>{" "}
              is the highest revenue-generating
              product, contributing{" "}
              <strong className="text-green-600 dark:text-green-400">
                {formatCurrency(
                  reportStats.highestRevenueProduct
                    .revenue
                )}
              </strong>{" "}
              to overall sales.
            </p>
          )}

          {reportStats.highestQuantityProduct && (
            <p
              className={`mt-3 leading-7 ${secondaryText}`}
            >
              The highest-selling product by
              quantity is{" "}
              <strong>
                {
                  reportStats.highestQuantityProduct
                    .product
                }
              </strong>{" "}
              with{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                {
                  reportStats.highestQuantityProduct
                    .quantity
                }
              </strong>{" "}
              units sold.
            </p>
          )}

        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className={`mt-8 pt-5 border-t ${borderColor} text-sm ${mutedText}`}
        >
          MetricMind Business Analytics • Detailed
          Sales Report
        </div>

      </main>
    </div>
  );
}