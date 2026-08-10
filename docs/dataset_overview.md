# Dataset Overview

MetricMind currently reads from four curated tables in the Snowflake `ANALYTICS` schema.

## 1. Customers

Stores customer information.

Key fields include:

- `CUSTOMER_ID`
- `FIRST_NAME`
- `LAST_NAME`
- `EMAIL`
- `PHONE`
- `CITY`
- `STATE`
- `COUNTRY`
- `CREATED_DATE`

Primary key:

```text
CUSTOMER_ID
```

---

## 2. Products

Stores product information and pricing.

Key fields include:

- `PRODUCT_ID`
- `PRODUCT_NAME`
- `CATEGORY`
- `BRAND`
- `UNIT_PRICE`
- `COST_PRICE`
- `STOCK_QUANTITY`

Primary key:

```text
PRODUCT_ID
```

---

## 3. Orders

Stores order-level information.

Key fields include:

- `ORDER_ID`
- `CUSTOMER_ID`
- `ORDER_DATE`
- `TOTAL_AMOUNT`
- `PAYMENT_METHOD`
- `ORDER_STATUS`

Primary key:

```text
ORDER_ID
```

Relationship:

```text
ORDERS.CUSTOMER_ID → CUSTOMERS.CUSTOMER_ID
```

---

## 4. Order Items

Stores individual products purchased within orders.

Key fields include:

- `ORDER_ITEM_ID`
- `ORDER_ID`
- `PRODUCT_ID`
- `QUANTITY`
- `UNIT_PRICE`
- `DISCOUNT`

Primary key:

```text
ORDER_ITEM_ID
```

Relationships:

```text
ORDER_ITEMS.ORDER_ID → ORDERS.ORDER_ID
ORDER_ITEMS.PRODUCT_ID → PRODUCTS.PRODUCT_ID
```

---

## Curated Development Dataset

The project contains small CSV files in:

```text
data/
```

These are the files referenced by `sql/load_data.sql`:

```text
customers.csv
orders.csv
products.csv
order_items.csv
```

---

## Raw Olist Dataset

The directory:

```text
data/raw/
```

contains the larger Olist Brazilian e-commerce dataset and supporting files.

These files are useful for exploration and future expansion, but **the current FastAPI semantic layer does not query them directly**.

The included notebook path is:

```text
notebooks/explore_dataset.ipynb
```

If dataset exploration is expanded later, this raw dataset can become a source for an ETL/ELT pipeline.
