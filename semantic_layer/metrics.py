import os
import snowflake.connector
from dotenv import load_dotenv

load_dotenv()


# =========================================================
# SNOWFLAKE CONNECTION
# =========================================================

def get_connection():
    return snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA"),
    )


# =========================================================
# EXISTING METRICS
# =========================================================

def get_total_orders():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT COUNT(*) FROM ORDERS;")
        return cur.fetchone()[0]
    finally:
        cur.close()
        conn.close()


def get_total_customers():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT COUNT(*) FROM CUSTOMERS;")
        return cur.fetchone()[0]
    finally:
        cur.close()
        conn.close()


def get_total_revenue():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
            FROM ORDER_ITEMS;
        """)
        return cur.fetchone()[0]
    finally:
        cur.close()
        conn.close()


def get_average_order_value():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
                / COUNT(DISTINCT ORDER_ID)
            FROM ORDER_ITEMS;
        """)
        return cur.fetchone()[0]
    finally:
        cur.close()
        conn.close()


def get_top_selling_product():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(OI.QUANTITY) AS TOTAL_SOLD
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY TOTAL_SOLD DESC
            LIMIT 1;
        """)

        return cur.fetchone()

    finally:
        cur.close()
        conn.close()


def get_top_customer():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME) AS CUSTOMER_NAME,
                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS TOTAL_SPENT
            FROM ORDER_ITEMS OI
            JOIN ORDERS O
                ON OI.ORDER_ID = O.ORDER_ID
            JOIN CUSTOMERS C
                ON O.CUSTOMER_ID = C.CUSTOMER_ID
            GROUP BY C.FIRST_NAME, C.LAST_NAME
            ORDER BY TOTAL_SPENT DESC
            LIMIT 1;
        """)

        return cur.fetchone()

    finally:
        cur.close()
        conn.close()


def get_revenue_by_product():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS REVENUE
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY REVENUE DESC;
        """)

        return cur.fetchall()

    finally:
        cur.close()
        conn.close()


def get_product_report():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(OI.QUANTITY) AS TOTAL_QUANTITY,
                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS TOTAL_REVENUE
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY TOTAL_REVENUE DESC;
        """)

        return cur.fetchall()

    finally:
        cur.close()
        conn.close()


# =========================================================
# OPTIMIZED DASHBOARD SUMMARY
# ONE SNOWFLAKE CONNECTION FOR ALL DASHBOARD METRICS
# =========================================================

def get_dashboard_summary():

    conn = get_connection()
    cur = conn.cursor()

    try:

        # -------------------------
        # Total Orders
        # -------------------------

        cur.execute("""
            SELECT COUNT(*)
            FROM ORDERS;
        """)

        total_orders = cur.fetchone()[0]


        # -------------------------
        # Total Customers
        # -------------------------

        cur.execute("""
            SELECT COUNT(*)
            FROM CUSTOMERS;
        """)

        total_customers = cur.fetchone()[0]


        # -------------------------
        # Total Revenue
        # -------------------------

        cur.execute("""
            SELECT
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
            FROM ORDER_ITEMS;
        """)

        total_revenue = cur.fetchone()[0]


        # -------------------------
        # Average Order Value
        # -------------------------

        cur.execute("""
            SELECT
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
                / COUNT(DISTINCT ORDER_ID)
            FROM ORDER_ITEMS;
        """)

        average_order_value = cur.fetchone()[0]


        # -------------------------
        # Top Selling Product
        # -------------------------

        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(OI.QUANTITY) AS TOTAL_SOLD
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY TOTAL_SOLD DESC
            LIMIT 1;
        """)

        top_product = cur.fetchone()


        # -------------------------
        # Top Customer
        # -------------------------

        cur.execute("""
            SELECT
                CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME)
                    AS CUSTOMER_NAME,

                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS TOTAL_SPENT

            FROM ORDER_ITEMS OI

            JOIN ORDERS O
                ON OI.ORDER_ID = O.ORDER_ID

            JOIN CUSTOMERS C
                ON O.CUSTOMER_ID = C.CUSTOMER_ID

            GROUP BY
                C.FIRST_NAME,
                C.LAST_NAME

            ORDER BY TOTAL_SPENT DESC

            LIMIT 1;
        """)

        top_customer = cur.fetchone()


        # -------------------------
        # Revenue By Product
        # -------------------------

        cur.execute("""
            SELECT
                P.PRODUCT_NAME,

                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS REVENUE

            FROM ORDER_ITEMS OI

            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID

            GROUP BY P.PRODUCT_NAME

            ORDER BY REVENUE DESC;
        """)

        revenue_by_product = cur.fetchall()


        # -------------------------
        # Return Everything
        # -------------------------

        return {
            "total_orders": total_orders,
            "total_customers": total_customers,
            "total_revenue": total_revenue,
            "average_order_value": average_order_value,

            "top_product": top_product,

            "top_customer": top_customer,

            "revenue_by_product": revenue_by_product,
        }

    finally:
        cur.close()
        conn.close()


# =========================================================
# OPTIMIZED ANALYTICS SUMMARY
# =========================================================

def get_analytics_summary():

    conn = get_connection()
    cur = conn.cursor()

    try:

        # Total Orders
        cur.execute("""
            SELECT COUNT(*)
            FROM ORDERS;
        """)

        total_orders = cur.fetchone()[0]


        # Total Customers
        cur.execute("""
            SELECT COUNT(*)
            FROM CUSTOMERS;
        """)

        total_customers = cur.fetchone()[0]


        # Total Revenue
        cur.execute("""
            SELECT
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
            FROM ORDER_ITEMS;
        """)

        total_revenue = cur.fetchone()[0]


        # Average Order Value
        cur.execute("""
            SELECT
                SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
                / COUNT(DISTINCT ORDER_ID)
            FROM ORDER_ITEMS;
        """)

        average_order_value = cur.fetchone()[0]


        # Top Selling Product
        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(OI.QUANTITY) AS TOTAL_SOLD
            FROM ORDER_ITEMS OI
            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID
            GROUP BY P.PRODUCT_NAME
            ORDER BY TOTAL_SOLD DESC
            LIMIT 1;
        """)

        top_product = cur.fetchone()


        # Top Customer
        cur.execute("""
            SELECT
                CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME)
                    AS CUSTOMER_NAME,

                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS TOTAL_SPENT

            FROM ORDER_ITEMS OI

            JOIN ORDERS O
                ON OI.ORDER_ID = O.ORDER_ID

            JOIN CUSTOMERS C
                ON O.CUSTOMER_ID = C.CUSTOMER_ID

            GROUP BY
                C.FIRST_NAME,
                C.LAST_NAME

            ORDER BY TOTAL_SPENT DESC

            LIMIT 1;
        """)

        top_customer = cur.fetchone()


        return {
            "total_orders": total_orders,
            "total_customers": total_customers,
            "total_revenue": total_revenue,
            "average_order_value": average_order_value,
            "top_product": top_product,
            "top_customer": top_customer,
        }

    finally:
        cur.close()
        conn.close()


# =========================================================
# OPTIMIZED REPORTS SUMMARY
# =========================================================

def get_reports_summary():

    conn = get_connection()
    cur = conn.cursor()

    try:

        # -------------------------
        # Product Report
        # -------------------------

        cur.execute("""
            SELECT
                P.PRODUCT_NAME,
                SUM(OI.QUANTITY) AS TOTAL_QUANTITY,

                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS TOTAL_REVENUE

            FROM ORDER_ITEMS OI

            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID

            GROUP BY P.PRODUCT_NAME

            ORDER BY TOTAL_REVENUE DESC;
        """)

        product_report = cur.fetchall()


        # -------------------------
        # Revenue By Product
        # -------------------------

        cur.execute("""
            SELECT
                P.PRODUCT_NAME,

                SUM(
                    (OI.UNIT_PRICE * OI.QUANTITY)
                    - OI.DISCOUNT
                ) AS REVENUE

            FROM ORDER_ITEMS OI

            JOIN PRODUCTS P
                ON OI.PRODUCT_ID = P.PRODUCT_ID

            GROUP BY P.PRODUCT_NAME

            ORDER BY REVENUE DESC;
        """)

        revenue_by_product = cur.fetchall()


        return {
            "product_report": product_report,
            "revenue_by_product": revenue_by_product,
        }

    finally:
        cur.close()
        conn.close()