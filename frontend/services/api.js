const API_BASE_URL = "http://127.0.0.1:8000";

export async function getTotalRevenue() {
  const response = await fetch(`${API_BASE_URL}/total-revenue`);
  return await response.json();
}

export async function getTotalOrders() {
  const response = await fetch(`${API_BASE_URL}/total-orders`);
  return await response.json();
}

export async function getTotalCustomers() {
  const response = await fetch(`${API_BASE_URL}/total-customers`);
  return await response.json();
}

export async function getAverageOrderValue() {
  const response = await fetch(`${API_BASE_URL}/average-order-value`);
  return await response.json();
}

export async function getRevenueByProduct() {
  const response = await fetch(`${API_BASE_URL}/revenue-by-product`);
  return await response.json();
}

export async function getTopSellingProduct() {
  const response = await fetch(`${API_BASE_URL}/top-selling-product`);
  return await response.json();
}

export async function getTopCustomer() {
  const response = await fetch(`${API_BASE_URL}/top-customer`);
  return await response.json();
}