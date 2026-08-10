"use client";

import { useEffect, useState } from "react";
import { getReportsSummary } from "@/services/api";
import Sidebar from "@/components/layout/Sidebar";

const CACHE_KEY = "metricmind_reports";
const CACHE_TIME = 5 * 60 * 1000;

export default function ReportsPage() {
  const [productReport, setProductReport] = useState([]);
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // IMPORTANT:
  // Read the actual theme from <html class="dark">
  const [isDark, setIsDark] = useState(false);

  // =========================================================
  // THEME DETECTION
  // =========================================================
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Check when page loads
    checkTheme();

    // Watch for light/dark mode changes
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

          if (cacheAge < CACHE_TIME && isMounted) {
            setProductReport(parsed.data.productReport || []);
            setRevenueByProduct(parsed.data.revenueByProduct || []);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Reports cache read error:", error);
      }

      // -------------------------------------------------------
      // API REQUEST
      // -------------------------------------------------------
      try {
        const data = await getReportsSummary();

        if (!isMounted) return;

        const productData = data.product_report || [];
        const revenueData = data.revenue_by_product || [];

        setProductReport(productData);
        setRevenueByProduct(revenueData);
        setLoading(false);

        // -------------------------------------------------------
        // SAVE CACHE
        // -------------------------------------------------------
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: {
                productReport: productData,
                revenueByProduct: revenueData,
              },
            })
          );
        } catch (error) {
          console.error("Reports cache write error:", error);
        }
      } catch (error) {
        console.error("Error loading reports:", error);

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
  // LOADING
  // =========================================================
  if (
    loading &&
    productReport.length === 0 &&
    revenueByProduct.length === 0
  ) {
    return (
      <div
        className={`flex min-h-screen ${
          isDark ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <Sidebar />

        <main className="flex-1 min-w-0 p-6 md:p-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <p
              className={`text-lg font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
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
      className={`flex min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 p-5 sm:p-6 lg:p-8">

        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Reports
          </h1>

          <p
            className={`mt-2 text-base ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Detailed business reports from your sales data
          </p>

          {loading && (
            <p
              className={`mt-3 text-sm ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Updating reports...
            </p>
          )}
        </div>

        {/* ===================================================
            REPORT SECTIONS
        =================================================== */}
        <div className="space-y-8">

          {/* =================================================
              PRODUCT REPORT
          ================================================= */}
          <section
            className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors duration-200 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="mb-6">
              <h2
                className={`text-xl md:text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Product Report
              </h2>

              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Product-wise sales quantity and revenue
              </p>
            </div>

            {/* Table */}
            <div
              className={`w-full overflow-x-auto rounded-xl border ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <table className="w-full min-w-[600px] border-collapse text-sm">

                <thead>
                  <tr
                    className={
                      isDark
                        ? "bg-blue-950/40"
                        : "bg-blue-50"
                    }
                  >
                    <th
                      className={`px-5 py-4 text-left font-semibold border-b ${
                        isDark
                          ? "text-blue-300 border-blue-800"
                          : "text-blue-900 border-blue-200"
                      }`}
                    >
                      Product
                    </th>

                    <th
                      className={`px-5 py-4 text-right font-semibold border-b ${
                        isDark
                          ? "text-blue-300 border-blue-800"
                          : "text-blue-900 border-blue-200"
                      }`}
                    >
                      Quantity
                    </th>

                    <th
                      className={`px-5 py-4 text-right font-semibold border-b ${
                        isDark
                          ? "text-blue-300 border-blue-800"
                          : "text-blue-900 border-blue-200"
                      }`}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productReport.length > 0 ? (
                    productReport.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          isDark
                            ? "hover:bg-gray-800/60"
                            : "hover:bg-gray-50"
                        }
                      >
                        {/* Product */}
                        <td
                          className={`px-5 py-4 font-semibold border-b ${
                            isDark
                              ? "text-gray-100 border-gray-800"
                              : "text-gray-900 border-gray-100"
                          }`}
                        >
                          {item.product}
                        </td>

                        {/* Quantity */}
                        <td
                          className={`px-5 py-4 text-right border-b ${
                            isDark
                              ? "text-gray-300 border-gray-800"
                              : "text-gray-700 border-gray-100"
                          }`}
                        >
                          {item.quantity}
                        </td>

                        {/* Revenue */}
                        <td
                          className={`px-5 py-4 text-right font-bold border-b ${
                            isDark
                              ? "text-green-400 border-gray-800"
                              : "text-green-700 border-gray-100"
                          }`}
                        >
                          ₹
                          {Number(item.revenue).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className={`px-5 py-8 text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No product report data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* =================================================
              REVENUE BY PRODUCT
          ================================================= */}
          <section
            className={`w-full rounded-2xl border p-5 sm:p-6 transition-colors duration-200 ${
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="mb-6">
              <h2
                className={`text-xl md:text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Revenue by Product
              </h2>

              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Revenue contribution from each product
              </p>
            </div>

            {/* Table */}
            <div
              className={`w-full overflow-x-auto rounded-xl border ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <table className="w-full min-w-[500px] border-collapse text-sm">

                <thead>
                  <tr
                    className={
                      isDark
                        ? "bg-green-950/40"
                        : "bg-green-50"
                    }
                  >
                    <th
                      className={`px-5 py-4 text-left font-semibold border-b ${
                        isDark
                          ? "text-green-300 border-green-800"
                          : "text-green-900 border-green-200"
                      }`}
                    >
                      Product
                    </th>

                    <th
                      className={`px-5 py-4 text-right font-semibold border-b ${
                        isDark
                          ? "text-green-300 border-green-800"
                          : "text-green-900 border-green-200"
                      }`}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {revenueByProduct.length > 0 ? (
                    revenueByProduct.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          isDark
                            ? "hover:bg-gray-800/60"
                            : "hover:bg-gray-50"
                        }
                      >
                        {/* Product */}
                        <td
                          className={`px-5 py-4 font-semibold border-b ${
                            isDark
                              ? "text-gray-100 border-gray-800"
                              : "text-gray-900 border-gray-100"
                          }`}
                        >
                          {item.product}
                        </td>

                        {/* Revenue */}
                        <td
                          className={`px-5 py-4 text-right font-bold border-b ${
                            isDark
                              ? "text-green-400 border-gray-800"
                              : "text-green-700 border-gray-100"
                          }`}
                        >
                          ₹
                          {Number(item.revenue).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className={`px-5 py-8 text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No revenue data available.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}