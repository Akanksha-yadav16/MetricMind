from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from semantic_layer.metrics import (
    clear_metrics_cache,
    get_analytics_summary,
    get_average_order_value,
    get_dashboard_summary,
    get_product_report,
    get_reports_summary,
    get_revenue_by_product,
    get_top_customer,
    get_top_selling_product,
    get_total_customers,
    get_total_orders,
    get_total_revenue,
)

app = FastAPI(title="MetricMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.101:3000",
        "http://192.168.1.108:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "MetricMind API is running!"}


@app.get("/dashboard-summary")
def dashboard_summary():
    data = get_dashboard_summary()
    rows = data["product_rows"]
    return {
        "total_orders": data["total_orders"],
        "total_customers": data["total_customers"],
        "total_revenue": float(data["total_revenue"] or 0),
        "average_order_value": float(data["average_order_value"] or 0),
        "top_product": {
            "product": data["top_product"][0] if data["top_product"] else "No data",
            "quantity_sold": data["top_product"][1] if data["top_product"] else 0,
        },
        "top_customer": {
            "customer": data["top_customer"][0] if data["top_customer"] else "No data",
            "total_spent": float(data["top_customer"][1]) if data["top_customer"] else 0,
        },
        "revenue_by_product": [
            {"product": row[0], "revenue": float(row[2] or 0)} for row in rows
        ],
    }


@app.get("/analytics-summary")
def analytics_summary():
    data = get_analytics_summary()
    return {
        "total_orders": data["total_orders"],
        "total_customers": data["total_customers"],
        "total_revenue": float(data["total_revenue"] or 0),
        "average_order_value": float(data["average_order_value"] or 0),
        "top_product": {
            "product": data["top_product"][0] if data["top_product"] else "No data",
            "quantity_sold": data["top_product"][1] if data["top_product"] else 0,
        },
        "top_customer": {
            "customer": data["top_customer"][0] if data["top_customer"] else "No data",
            "total_spent": float(data["top_customer"][1]) if data["top_customer"] else 0,
        },
    }


@app.get("/reports-summary")
def reports_summary():
    data = get_reports_summary()
    return {
        "product_report": [
            {"product": row[0], "quantity": row[1], "revenue": float(row[2] or 0)}
            for row in data["product_report"]
        ],
        "revenue_by_product": [
            {"product": row[0], "revenue": float(row[1] or 0)}
            for row in data["revenue_by_product"]
        ],
    }


# Individual endpoints remain available for compatibility.
@app.get("/total-orders")
def total_orders():
    return {"total_orders": get_total_orders()}


@app.get("/total-customers")
def total_customers():
    return {"total_customers": get_total_customers()}


@app.get("/total-revenue")
def total_revenue():
    return {"total_revenue": float(get_total_revenue() or 0)}


@app.get("/average-order-value")
def average_order_value():
    return {"average_order_value": float(get_average_order_value() or 0)}


@app.get("/top-selling-product")
def top_selling_product():
    product = get_top_selling_product()
    return {
        "product": product[0] if product else "No data",
        "quantity_sold": product[1] if product else 0,
    }


@app.get("/top-customer")
def top_customer():
    customer = get_top_customer()
    return {
        "customer": customer[0] if customer else "No data",
        "total_spent": float(customer[1]) if customer else 0,
    }


@app.get("/revenue-by-product")
def revenue_by_product():
    return [
        {"product": row[0], "revenue": float(row[1] or 0)}
        for row in get_revenue_by_product()
    ]


@app.get("/product-report")
def product_report():
    return [
        {"product": row[0], "quantity": row[1], "revenue": float(row[2] or 0)}
        for row in get_product_report()
    ]


# -----------------------------
# AI CHAT
# -----------------------------

def answer_question(question: str):
    q = question.lower().strip()

    if "total revenue" in q or "overall revenue" in q or "sales revenue" in q:
        value = float(get_total_revenue() or 0)
        return f"The total revenue is ₹{value:,.2f}."

    if "total orders" in q or "how many orders" in q or "number of orders" in q:
        return f"The total number of orders is {get_total_orders()}."

    if "total customers" in q or "how many customers" in q or "number of customers" in q:
        return f"The total number of customers is {get_total_customers()}."

    if "average order" in q or "average order value" in q or "aov" in q:
        value = float(get_average_order_value() or 0)
        return f"The average order value is ₹{value:,.2f}."

    if (
        "top selling product" in q
        or "best selling product" in q
        or "most sold product" in q
        or "best product" in q
    ):
        product = get_top_selling_product()
        if not product:
            return "There is no product sales data available."
        return f"The top-selling product is {product[0]}, with {product[1]} units sold."

    if (
        "top customer" in q
        or "best customer" in q
        or "highest value customer" in q
        or "most valuable customer" in q
    ):
        customer = get_top_customer()
        if not customer:
            return "There is no customer spending data available."
        return (
            f"The highest-value customer is {customer[0]}, "
            f"with total spending of ₹{float(customer[1]):,.2f}."
        )

    return (
        "I couldn't understand that business question yet. Try asking about "
        "total revenue, total orders, total customers, average order value, "
        "top-selling product, or top customer."
    )


@app.post("/chat/question")
def chat_question(payload: ChatRequest):
    question = payload.question.strip()
    if not question:
        return {"question": question, "answer": "Please enter a business question."}
    return {"question": question, "answer": answer_question(question)}


# Keep GET /chat for compatibility with the old API contract.
@app.get("/chat")
def chat(question: str):
    return {"question": question, "answer": answer_question(question)}


@app.post("/cache/clear")
def cache_clear():
    clear_metrics_cache()
    return {"message": "MetricMind cache cleared."}
