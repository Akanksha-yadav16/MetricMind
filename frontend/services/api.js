const API = "http://127.0.0.1:8000";

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API}${endpoint}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${endpoint} - ${response.status}`
      );
    }

    const data = await response.json();

    console.log(`MetricMind API ${endpoint}:`, data);

    return data;
  } catch (error) {
    console.error(`MetricMind API Error ${endpoint}:`, error);
    throw error;
  }
}


// ==========================================
// DASHBOARD
// ==========================================

export async function getDashboardSummary() {
  return fetchAPI("/dashboard-summary");
}


// ==========================================
// ANALYTICS
// ==========================================

export async function getAnalyticsSummary() {
  return fetchAPI("/analytics-summary");
}


// ==========================================
// REPORTS
// ==========================================

export async function getReportsSummary() {
  return fetchAPI("/reports-summary");
}


// ==========================================
// INDIVIDUAL FUNCTIONS
// ==========================================

export async function getTotalOrders() {
  return fetchAPI("/total-orders");
}

export async function getTotalCustomers() {
  return fetchAPI("/total-customers");
}

export async function getTotalRevenue() {
  return fetchAPI("/total-revenue");
}

export async function getAverageOrderValue() {
  return fetchAPI("/average-order-value");
}

export async function getTopSellingProduct() {
  return fetchAPI("/top-selling-product");
}

export async function getTopCustomer() {
  return fetchAPI("/top-customer");
}

export async function getRevenueByProduct() {
  return fetchAPI("/revenue-by-product");
}

export async function getProductReport() {
  return fetchAPI("/product-report");
}