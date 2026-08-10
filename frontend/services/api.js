const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const REQUEST_TIMEOUT = 15000;

async function fetchJSON(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const detail = typeof payload === "object" ? payload.detail : payload;
      throw new Error(detail || `API request failed (${response.status})`);
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The analytics service took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAPI(endpoint) {
  return fetchJSON(`${API}${endpoint}`, { method: "GET", cache: "no-store" });
}

export const getDashboardSummary = () => fetchAPI("/dashboard-summary");
export const getAnalyticsSummary = () => fetchAPI("/analytics-summary");
export const getReportsSummary = () => fetchAPI("/reports-summary");

export function askChatQuestion(question) {
  return fetchJSON(`${API}/chat/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}

export const getTotalOrders = () => fetchAPI("/total-orders");
export const getTotalCustomers = () => fetchAPI("/total-customers");
export const getTotalRevenue = () => fetchAPI("/total-revenue");
export const getAverageOrderValue = () => fetchAPI("/average-order-value");
export const getTopSellingProduct = () => fetchAPI("/top-selling-product");
export const getTopCustomer = () => fetchAPI("/top-customer");
export const getRevenueByProduct = () => fetchAPI("/revenue-by-product");
export const getProductReport = () => fetchAPI("/product-report");
