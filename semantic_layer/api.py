import os
import re

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from semantic_layer.metrics import (
    clear_metrics_cache,
    get_analytics_summary,
    get_dashboard_summary,
    get_reports_summary,
)


app = FastAPI(
    title="MetricMind API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

def _cors_origins():
    configured = os.getenv("CORS_ORIGINS", "")

    origins = [
        item.strip().rstrip("/")
        for item in configured.split(",")
        if item.strip()
    ]

    defaults = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.110:3000",
        "http://192.168.1.108:3000",
        "http://192.168.1.129:3000",
    ]

    return list(dict.fromkeys(origins + defaults))


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=500
    )


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def _dashboard_response(data):
    rows = data.get("product_rows", [])

    return {
        "total_orders": int(data.get("total_orders") or 0),

        "total_customers": int(
            data.get("total_customers") or 0
        ),

        "total_revenue": float(
            data.get("total_revenue") or 0
        ),

        "average_order_value": float(
            data.get("average_order_value") or 0
        ),

        "top_product": {
            "product": (
                data["top_product"][0]
                if data.get("top_product")
                else "No data"
            ),

            "quantity_sold": (
                int(data["top_product"][1])
                if data.get("top_product")
                else 0
            ),
        },

        "top_customer": {
            "customer": (
                data["top_customer"][0]
                if data.get("top_customer")
                else "No data"
            ),

            "total_spent": (
                float(data["top_customer"][1])
                if data.get("top_customer")
                else 0
            ),
        },

        "revenue_by_product": [
            {
                "product": row[0],
                "revenue": float(row[2] or 0)
            }
            for row in rows
        ],
    }


def _safe_call(fn):
    """
    Safely execute analytics functions without exposing
    database credentials or internal stack traces.
    """

    try:
        return fn()

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Analytics data is temporarily unavailable."
        ) from exc


def _safe_dashboard():
    try:
        return get_dashboard_summary()

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Analytics data is temporarily unavailable."
        ) from exc


def _normalize_question(question: str):
    """
    Normalize user questions so that different forms such as:

        top-selling
        top selling
        TOP-SELLING
        Top Selling

    are treated similarly.
    """

    q = question.lower().strip()

    # Replace hyphens with spaces
    q = q.replace("-", " ")

    # Remove punctuation
    q = re.sub(r"[^\w\s]", " ", q)

    # Remove extra spaces
    q = " ".join(q.split())

    return q


# ============================================================
# BASIC ENDPOINTS
# ============================================================

@app.get("/")
def home():
    return {
        "message": "MetricMind API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# ============================================================
# DASHBOARD
# ============================================================

@app.get("/dashboard-summary")
def dashboard_summary():
    return _safe_call(
        lambda: _dashboard_response(
            get_dashboard_summary()
        )
    )


# ============================================================
# ANALYTICS
# ============================================================

@app.get("/analytics-summary")
def analytics_summary():

    def load():

        data = get_analytics_summary()

        return {
            "total_orders": int(
                data.get("total_orders") or 0
            ),

            "total_customers": int(
                data.get("total_customers") or 0
            ),

            "total_revenue": float(
                data.get("total_revenue") or 0
            ),

            "average_order_value": float(
                data.get("average_order_value") or 0
            ),

            "top_product": {
                "product": (
                    data["top_product"][0]
                    if data.get("top_product")
                    else "No data"
                ),

                "quantity_sold": (
                    int(data["top_product"][1])
                    if data.get("top_product")
                    else 0
                ),
            },

            "top_customer": {
                "customer": (
                    data["top_customer"][0]
                    if data.get("top_customer")
                    else "No data"
                ),

                "total_spent": (
                    float(data["top_customer"][1])
                    if data.get("top_customer")
                    else 0
                ),
            },
        }

    return _safe_call(load)


# ============================================================
# REPORTS
# ============================================================

@app.get("/reports-summary")
def reports_summary():

    def load():

        data = get_reports_summary()

        return {
            "product_report": [
                {
                    "product": row[0],
                    "quantity": int(row[1] or 0),
                    "revenue": float(row[2] or 0)
                }

                for row in data.get("product_report", [])
            ],

            "revenue_by_product": [
                {
                    "product": row[0],
                    "revenue": float(row[1] or 0)
                }

                for row in data.get(
                    "revenue_by_product",
                    []
                )
            ],
        }

    return _safe_call(load)


# ============================================================
# INDIVIDUAL ENDPOINTS
# ============================================================

@app.get("/total-orders")
def total_orders():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return {
        "total_orders": data["total_orders"]
    }


@app.get("/total-customers")
def total_customers():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return {
        "total_customers": data["total_customers"]
    }


@app.get("/total-revenue")
def total_revenue():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return {
        "total_revenue": data["total_revenue"]
    }


@app.get("/average-order-value")
def average_order_value():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return {
        "average_order_value":
            data["average_order_value"]
    }


@app.get("/top-selling-product")
def top_selling_product():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return data["top_product"]


@app.get("/top-customer")
def top_customer():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return data["top_customer"]


@app.get("/revenue-by-product")
def revenue_by_product():

    data = _dashboard_response(
        _safe_dashboard()
    )

    return data["revenue_by_product"]


@app.get("/product-report")
def product_report():

    return _safe_call(
        lambda: [
            {
                "product": row[0],
                "quantity": int(row[1] or 0),
                "revenue": float(row[2] or 0)
            }

            for row in get_reports_summary().get(
                "product_report",
                []
            )
        ]
    )


# ============================================================
# BUSINESS QUESTION CHAT
# ============================================================

def answer_question(question: str):

    # Normalize question
    q = _normalize_question(question)

    # --------------------------------------------------------
    # TOTAL REVENUE
    # --------------------------------------------------------

    revenue_keywords = [
        "total revenue",
        "overall revenue",
        "sales revenue",
        "total sales",
        "overall sales",
        "how much revenue",
        "how much sales"
    ]

    if any(keyword in q for keyword in revenue_keywords):

        data = get_dashboard_summary()

        revenue = float(
            data.get("total_revenue") or 0
        )

        return (
            f"The total revenue is "
            f"₹{revenue:,.2f}."
        )

    # --------------------------------------------------------
    # TOTAL ORDERS
    # --------------------------------------------------------

    order_keywords = [
        "total orders",
        "how many orders",
        "number of orders",
        "orders in total",
        "total number of orders"
    ]

    if any(keyword in q for keyword in order_keywords):

        data = get_dashboard_summary()

        orders = int(
            data.get("total_orders") or 0
        )

        return (
            f"The total number of orders is "
            f"{orders}."
        )

    # --------------------------------------------------------
    # TOTAL CUSTOMERS
    # --------------------------------------------------------

    customer_count_keywords = [
        "total customers",
        "how many customers",
        "number of customers",
        "customers in total",
        "total number of customers"
    ]

    if any(
        keyword in q
        for keyword in customer_count_keywords
    ):

        data = get_dashboard_summary()

        customers = int(
            data.get("total_customers") or 0
        )

        return (
            f"The total number of customers is "
            f"{customers}."
        )

    # --------------------------------------------------------
    # AVERAGE ORDER VALUE
    # --------------------------------------------------------

    aov_keywords = [
        "average order",
        "average order value",
        "average order amount",
        "aov",
        "what is the aov"
    ]

    if any(keyword in q for keyword in aov_keywords):

        data = get_dashboard_summary()

        aov = float(
            data.get("average_order_value") or 0
        )

        return (
            f"The average order value is "
            f"₹{aov:,.2f}."
        )

    # --------------------------------------------------------
    # TOP-SELLING PRODUCT
    # --------------------------------------------------------

    top_product_keywords = [
        "top selling product",
        "top selling",
        "best selling product",
        "best selling",
        "most sold product",
        "most selling product",
        "best product",
        "highest selling product",
        "highest selling",
        "product sold the most",
        "which product sold the most"
    ]

    if any(
        keyword in q
        for keyword in top_product_keywords
    ):

        data = get_dashboard_summary()

        product_data = data.get("top_product")

        if not product_data:
            return (
                "There is no product sales "
                "data available."
            )

        product = product_data[0]
        quantity = int(product_data[1] or 0)

        return (
            f"The top-selling product is "
            f"{product}, with "
            f"{quantity} units sold."
        )

    # --------------------------------------------------------
    # TOP CUSTOMER
    # --------------------------------------------------------

    top_customer_keywords = [
        "top customer",
        "best customer",
        "highest value customer",
        "most valuable customer",
        "customer who spent the most",
        "highest spending customer",
        "highest spender"
    ]

    if any(
        keyword in q
        for keyword in top_customer_keywords
    ):

        data = get_dashboard_summary()

        customer_data = data.get("top_customer")

        if not customer_data:
            return (
                "There is no customer spending "
                "data available."
            )

        customer = customer_data[0]
        spending = float(
            customer_data[1] or 0
        )

        return (
            f"The highest-value customer is "
            f"{customer}, with total spending of "
            f"₹{spending:,.2f}."
        )

    # --------------------------------------------------------
    # REVENUE BY PRODUCT
    # --------------------------------------------------------

    revenue_product_keywords = [
        "revenue by product",
        "revenue per product",
        "sales by product",
        "sales per product",
        "product revenue",
        "revenue for each product",
        "sales for each product"
    ]

    if any(
        keyword in q
        for keyword in revenue_product_keywords
    ):

        data = get_dashboard_summary()

        rows = data.get("product_rows", [])

        if not rows:
            return (
                "There is no product revenue "
                "data available."
            )

        results = []

        for row in rows:

            product = row[0]
            revenue = float(row[2] or 0)

            results.append(
                f"{product}: ₹{revenue:,.2f}"
            )

        return (
            "Revenue by product: "
            + "; ".join(results)
            + "."
        )

    # --------------------------------------------------------
    # QUANTITY SOLD BY PRODUCT
    # --------------------------------------------------------

    quantity_product_keywords = [
        "quantity sold by product",
        "quantities sold by product",
        "quantity by product",
        "quantities by product",
        "units sold by product",
        "units by product",
        "product quantities",
        "quantity sold for each product",
        "quantities sold for each product",
        "units sold for each product",
        "how many units sold by product",
        "how many units were sold by product",
        "how many units were sold for each product",
        "how many of each product were sold",
        "number of units sold by product"
    ]

    if any(
        keyword in q
        for keyword in quantity_product_keywords
    ):

        data = get_dashboard_summary()

        rows = data.get("product_rows", [])

        if not rows:
            return (
                "There is no product quantity "
                "data available."
            )

        results = []

        for row in rows:

            product = row[0]
            quantity = int(row[1] or 0)

            results.append(
                f"{product}: {quantity} units"
            )

        return (
            "Quantity sold by product: "
            + "; ".join(results)
            + "."
        )

    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    return (
        "I couldn't understand that business "
        "question yet. Try asking about total "
        "revenue, total orders, total customers, "
        "average order value, top-selling product, "
        "top customer, revenue by product, or "
        "quantity sold by product."
    )


# ============================================================
# CHAT POST ENDPOINT
# ============================================================

@app.post("/chat/question")
def chat_question(payload: ChatRequest):

    question = payload.question.strip()

    if not question:

        return {
            "question": question,
            "answer": "Please enter a business question."
        }

    return _safe_call(
        lambda: {
            "question": question,
            "answer": answer_question(question)
        }
    )


# ============================================================
# CHAT GET ENDPOINT
# ============================================================

@app.get("/chat")
def chat(question: str):

    return _safe_call(
        lambda: {
            "question": question,
            "answer": answer_question(question)
        }
    )


# ============================================================
# CACHE CLEAR
# ============================================================

@app.post("/cache/clear")
def cache_clear():

    clear_metrics_cache()

    return {
        "message": "MetricMind cache cleared."
    }