"use client";

import { useEffect, useState } from "react";
import { getReportsSummary } from "@/services/api";
<<<<<<< HEAD

const CACHE_KEY = "metricmind_reports";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
=======
import Sidebar from "@/components/layout/Sidebar";

const CACHE_KEY = "metricmind_reports";
const CACHE_TIME = 5 * 60 * 1000;
>>>>>>> final-project

export default function ReportsPage() {
  const [productReport, setProductReport] = useState([]);
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
=======
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
>>>>>>> final-project
  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
<<<<<<< HEAD
      // 1. Show cached data immediately
=======
      // -------------------------------------------------------
      // LOAD CACHE
      // -------------------------------------------------------
>>>>>>> final-project
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);
<<<<<<< HEAD
=======

>>>>>>> final-project
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

<<<<<<< HEAD
      // 2. Make ONE API request
=======
      // -------------------------------------------------------
      // API REQUEST
      // -------------------------------------------------------
>>>>>>> final-project
      try {
        const data = await getReportsSummary();

        if (!isMounted) return;

        const productData = data.product_report || [];
        const revenueData = data.revenue_by_product || [];

        setProductReport(productData);
        setRevenueByProduct(revenueData);
        setLoading(false);

<<<<<<< HEAD
        // 3. Save fresh data to cache
=======
        // -------------------------------------------------------
        // SAVE CACHE
        // -------------------------------------------------------
>>>>>>> final-project
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

<<<<<<< HEAD
=======
  // =========================================================
  // LOADING
  // =========================================================
>>>>>>> final-project
  if (
    loading &&
    productReport.length === 0 &&
    revenueByProduct.length === 0
  ) {
    return (
      <div
<<<<<<< HEAD
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          padding: "40px",
          fontSize: "20px",
          fontWeight: "600",
          color: "#111827",
        }}
      >
        Loading reports...
=======
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
>>>>>>> final-project
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "32px",
        color: "#111827",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            margin: 0,
          }}
        >
          Reports
        </h1>

        <p
          style={{
            marginTop: "8px",
            fontSize: "16px",
            color: "#475569",
          }}
        >
          Detailed business reports from your sales data
        </p>
      </div>

      {/* Product Report */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "28px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "6px",
          }}
        >
          Product Report
        </h2>

        <p
          style={{
            color: "#475569",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Product-wise sales quantity and revenue
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#eff6ff" }}>
                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    color: "#1e3a8a",
                    fontWeight: "700",
                    borderBottom: "2px solid #dbeafe",
                  }}
                >
                  Product
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "right",
                    color: "#1e3a8a",
                    fontWeight: "700",
                    borderBottom: "2px solid #dbeafe",
                  }}
                >
                  Quantity
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "right",
                    color: "#1e3a8a",
                    fontWeight: "700",
                    borderBottom: "2px solid #dbeafe",
                  }}
                >
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {productReport.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "14px",
                      color: "#111827",
                      fontWeight: "600",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.product}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      textAlign: "right",
                      color: "#334155",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.quantity}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      textAlign: "right",
                      color: "#047857",
                      fontWeight: "700",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    ₹{Number(item.revenue).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue By Product */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          padding: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "6px",
          }}
        >
          Revenue by Product
        </h2>

        <p
          style={{
            color: "#475569",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          Revenue contribution from each product
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0fdf4" }}>
                <th
                  style={{
                    padding: "14px",
                    textAlign: "left",
                    color: "#166534",
                    fontWeight: "700",
                    borderBottom: "2px solid #dcfce7",
                  }}
                >
                  Product
                </th>

                <th
                  style={{
                    padding: "14px",
                    textAlign: "right",
                    color: "#166534",
                    fontWeight: "700",
                    borderBottom: "2px solid #dcfce7",
                  }}
                >
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {revenueByProduct.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "14px",
                      color: "#111827",
                      fontWeight: "600",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {item.product}
                  </td>

                  <td
                    style={{
                      padding: "14px",
                      textAlign: "right",
                      color: "#047857",
                      fontWeight: "700",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    ₹{Number(item.revenue).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
=======
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
>>>>>>> final-project
    </div>
  );
}