"use client";

import { useEffect, useState } from "react";
import { getReportsSummary } from "@/services/api";

const CACHE_KEY = "metricmind_reports";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export default function ReportsPage() {
  const [productReport, setProductReport] = useState([]);
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      // 1. Show cached data immediately
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

      // 2. Make ONE API request
      try {
        const data = await getReportsSummary();

        if (!isMounted) return;

        const productData = data.product_report || [];
        const revenueData = data.revenue_by_product || [];

        setProductReport(productData);
        setRevenueByProduct(revenueData);
        setLoading(false);

        // 3. Save fresh data to cache
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

  if (
    loading &&
    productReport.length === 0 &&
    revenueByProduct.length === 0
  ) {
    return (
      <div
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
      </div>
    );
  }

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
    </div>
  );
}