from fastapi import FastAPI
from semantic_layer.metrics import (
    get_total_orders,
    get_total_customers,
    get_total_revenue,
    get_average_order_value,
    get_top_selling_product,
    get_top_customer,
    get_revenue_by_product,
)

app = FastAPI(title="MetricMind API")


@app.get("/")
def home():
    return {"message": "MetricMind API is running!"}


@app.get("/total-orders")
def total_orders():
    return {"total_orders": get_total_orders()}


@app.get("/total-customers")
def total_customers():
    return {"total_customers": get_total_customers()}


@app.get("/total-revenue")
def total_revenue():
    return {"total_revenue": float(get_total_revenue())}


@app.get("/average-order-value")
def average_order_value():
    return {"average_order_value": float(get_average_order_value())}


@app.get("/top-selling-product")
def top_selling_product():
    product = get_top_selling_product()
    return {
        "product": product[0],
        "quantity_sold": product[1]
    }


@app.get("/top-customer")
def top_customer():
    customer = get_top_customer()
    return {
        "customer": customer[0],
        "total_spent": float(customer[1])
    }


@app.get("/revenue-by-product")
def revenue_by_product():
    revenue = get_revenue_by_product()

    return [
        {
            "product": row[0],
            "revenue": float(row[1])
        }
        for row in revenue
    ]