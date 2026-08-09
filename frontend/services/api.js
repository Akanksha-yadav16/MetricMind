const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function fetchAPI(endpoint) {
  const response = await fetch(`${API}${endpoint}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const getDashboardSummary = () => fetchAPI("/dashboard-summary");
export const getAnalyticsSummary = () => fetchAPI("/analytics-summary");
export const getReportsSummary = () => fetchAPI("/reports-summary");

export async function askChatQuestion(question) {
  const response = await fetch(`${API}/chat/question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`Chat API ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Backward-compatible individual endpoints.
export const getTotalOrders = () => fetchAPI("/total-orders");
export const getTotalCustomers = () => fetchAPI("/total-customers");
export const getTotalRevenue = () => fetchAPI("/total-revenue");
export const getAverageOrderValue = () => fetchAPI("/average-order-value");
export const getTopSellingProduct = () => fetchAPI("/top-selling-product");
export const getTopCustomer = () => fetchAPI("/top-customer");
export const getRevenueByProduct = () => fetchAPI("/revenue-by-product");
export const getProductReport = () => fetchAPI("/product-report");
