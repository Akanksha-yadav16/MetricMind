import os
import time
from threading import Lock

import snowflake.connector
from dotenv import load_dotenv

load_dotenv()

# Short in-memory cache keeps the dashboard/report pages fast while avoiding
# repeated Snowflake queries during normal navigation.
_CACHE_TTL = 60  # seconds
_cache = {}
_cache_lock = Lock()


def get_connection():
    return snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA"),
    )


def _cached(key):
    with _cache_lock:
        item = _cache.get(key)
        if item and time.monotonic() - item[0] < _CACHE_TTL:
            return item[1]
    return None


def _store(key, value):
    with _cache_lock:
        _cache[key] = (time.monotonic(), value)
    return value


def clear_metrics_cache():
    with _cache_lock:
        _cache.clear()


def _dashboard_queries(cur):
    # One Snowflake connection; four queries instead of opening a new
    # connection for every metric.
    cur.execute("""
        SELECT
            (SELECT COUNT(*) FROM ORDERS) AS TOTAL_ORDERS,
            (SELECT COUNT(*) FROM CUSTOMERS) AS TOTAL_CUSTOMERS,
            (SELECT COALESCE(SUM((UNIT_PRICE * QUANTITY) - DISCOUNT), 0)
             FROM ORDER_ITEMS) AS TOTAL_REVENUE,
            (SELECT COALESCE(
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
                / NULLIF(COUNT(DISTINCT ORDER_ID), 0), 0)
             FROM ORDER_ITEMS) AS AVERAGE_ORDER_VALUE
    """)
    total_orders, total_customers, total_revenue, average_order_value = cur.fetchone()

    cur.execute("""
        SELECT P.PRODUCT_NAME, SUM(OI.QUANTITY) AS TOTAL_SOLD
        FROM ORDER_ITEMS OI
        JOIN PRODUCTS P ON OI.PRODUCT_ID = P.PRODUCT_ID
        GROUP BY P.PRODUCT_NAME
        ORDER BY TOTAL_SOLD DESC
        LIMIT 1
    """)
    top_product = cur.fetchone()

    cur.execute("""
        SELECT
            CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME) AS CUSTOMER_NAME,
            SUM((OI.UNIT_PRICE * OI.QUANTITY) - OI.DISCOUNT) AS TOTAL_SPENT
        FROM ORDER_ITEMS OI
        JOIN ORDERS O ON OI.ORDER_ID = O.ORDER_ID
        JOIN CUSTOMERS C ON O.CUSTOMER_ID = C.CUSTOMER_ID
        GROUP BY C.FIRST_NAME, C.LAST_NAME
        ORDER BY TOTAL_SPENT DESC
        LIMIT 1
    """)
    top_customer = cur.fetchone()

    cur.execute("""
        SELECT
            P.PRODUCT_NAME,
            SUM(OI.QUANTITY) AS TOTAL_QUANTITY,
            SUM((OI.UNIT_PRICE * OI.QUANTITY) - OI.DISCOUNT) AS TOTAL_REVENUE
        FROM ORDER_ITEMS OI
        JOIN PRODUCTS P ON OI.PRODUCT_ID = P.PRODUCT_ID
        GROUP BY P.PRODUCT_NAME
        ORDER BY TOTAL_REVENUE DESC
    """)
    product_rows = cur.fetchall()

    return {
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_revenue": total_revenue,
        "average_order_value": average_order_value,
        "top_product": top_product,
        "top_customer": top_customer,
        "product_rows": product_rows,
    }


def get_dashboard_summary():
    cached = _cached("dashboard")
    if cached is not None:
        return cached

    conn = get_connection()
    cur = conn.cursor()
    try:
        result = _dashboard_queries(cur)
        return _store("dashboard", result)
    finally:
        cur.close()
        conn.close()


def get_analytics_summary():
    cached = _cached("analytics")
    if cached is not None:
        return cached

    dashboard = get_dashboard_summary()
    result = {
        "total_orders": dashboard["total_orders"],
        "total_customers": dashboard["total_customers"],
        "total_revenue": dashboard["total_revenue"],
        "average_order_value": dashboard["average_order_value"],
        "top_product": dashboard["top_product"],
        "top_customer": dashboard["top_customer"],
    }
    return _store("analytics", result)


def get_reports_summary():
    cached = _cached("reports")
    if cached is not None:
        return cached

    dashboard = get_dashboard_summary()
    rows = dashboard["product_rows"]
    result = {
        "product_report": rows,
        "revenue_by_product": [(row[0], row[2]) for row in rows],
    }
    return _store("reports", result)


# Legacy metric functions are kept for compatibility with existing callers.
def _single_metric(key, sql):
    cached = _cached(key)
    if cached is not None:
        return cached

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(sql)
        return _store(key, cur.fetchone()[0])
    finally:
        cur.close()
        conn.close()


def get_total_orders():
    return _single_metric("total_orders", "SELECT COUNT(*) FROM ORDERS")


def get_total_customers():
    return _single_metric("total_customers", "SELECT COUNT(*) FROM CUSTOMERS")


def get_total_revenue():
    return _single_metric(
        "total_revenue",
        """
        SELECT COALESCE(SUM((UNIT_PRICE * QUANTITY) - DISCOUNT), 0)
        FROM ORDER_ITEMS
        """,
    )


def get_average_order_value():
    return _single_metric(
        "average_order_value",
        """
        SELECT COALESCE(
            SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
            / NULLIF(COUNT(DISTINCT ORDER_ID), 0),
            0
        )
        FROM ORDER_ITEMS
        """,
    )


def get_top_selling_product():
    cached = _cached("top_product")
    if cached is not None:
        return cached

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT P.PRODUCT_NAME, SUM(OI.QUANTITY) AS TOTAL_SOLD
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY TOTAL_SOLD DESC
            LIMIT 1
        """)
        return _store("top_product", cur.fetchone())
    finally:
        cur.close()
        conn.close()


def get_top_customer():
    cached = _cached("top_customer")
    if cached is not None:
        return cached

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT
                CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME) AS CUSTOMER_NAME,
                SUM((OI.UNIT_PRICE * OI.QUANTITY) - OI.DISCOUNT) AS TOTAL_SPENT
            FROM ORDER_ITEMS OI
            JOIN ORDERS O ON OI.ORDER_ID = O.ORDER_ID
            JOIN CUSTOMERS C ON O.CUSTOMER_ID = C.CUSTOMER_ID
            GROUP BY C.FIRST_NAME, C.LAST_NAME
            ORDER BY TOTAL_SPENT DESC
            LIMIT 1
        """)
        return _store("top_customer", cur.fetchone())
    finally:
        cur.close()
        conn.close()


def get_revenue_by_product():
    return get_reports_summary()["revenue_by_product"]


def get_product_report():
    return get_reports_summary()["product_report"]
