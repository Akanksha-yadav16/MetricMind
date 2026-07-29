import os
import snowflake.connector
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA")
    )

def get_total_orders():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM ORDERS;")
    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return total

def get_total_customers():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM CUSTOMERS;")
    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return total

def get_total_revenue():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT SUM((UNIT_PRICE * QUANTITY) - DISCOUNT)
        FROM ORDER_ITEMS;
    """)

    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return total

def get_average_order_value():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            SUM((UNIT_PRICE * QUANTITY) - DISCOUNT) / COUNT(DISTINCT ORDER_ID)
        FROM ORDER_ITEMS;
    """)

    average = cur.fetchone()[0]

    cur.close()
    conn.close()

    return average

def get_top_selling_product():
    conn = get_connection()
    cur = conn.cursor()

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

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result

def get_top_customer():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    SELECT
        CONCAT(C.FIRST_NAME, ' ', C.LAST_NAME) AS CUSTOMER_NAME,
        SUM((OI.UNIT_PRICE * OI.QUANTITY) - OI.DISCOUNT) AS TOTAL_SPENT
    FROM ORDER_ITEMS OI
    JOIN ORDERS O
        ON OI.ORDER_ID = O.ORDER_ID
    JOIN CUSTOMERS C
        ON O.CUSTOMER_ID = C.CUSTOMER_ID
    GROUP BY C.FIRST_NAME, C.LAST_NAME
    ORDER BY TOTAL_SPENT DESC
    LIMIT 1;
""")

    result = cur.fetchone()

    cur.close()
    conn.close()

    return result

def get_revenue_by_product():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            P.PRODUCT_NAME,
            SUM((OI.UNIT_PRICE * OI.QUANTITY) - OI.DISCOUNT) AS REVENUE
        FROM ORDER_ITEMS OI
        JOIN PRODUCTS P
            ON OI.PRODUCT_ID = P.PRODUCT_ID
        GROUP BY P.PRODUCT_NAME
        ORDER BY REVENUE DESC;
    """)

    result = cur.fetchall()

    cur.close()
    conn.close()

    return result