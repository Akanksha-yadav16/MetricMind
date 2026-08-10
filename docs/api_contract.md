# MetricMind API Contract

## Base URL

```text
http://127.0.0.1:8000
```

When accessing the application over a LAN, use the host computer's LAN IP instead.

---

## GET `/`

Returns a simple API status message.

### Response

```json
{
  "message": "MetricMind API is running!"
}
```

---

## GET `/health`

Lightweight health check.

### Response

```json
{
  "status": "ok"
}
```

---

## GET `/dashboard-summary`

Returns the main dashboard metrics and product revenue data.

### Response shape

```json
{
  "total_orders": 10,
  "total_customers": 10,
  "total_revenue": 168200,
  "average_order_value": 16820,
  "top_product": {
    "product": "Headphones",
    "quantity_sold": 2
  },
  "top_customer": {
    "customer": "John Doe",
    "total_spent": 77500
  },
  "revenue_by_product": [
    {
      "product": "Laptop",
      "revenue": 75000
    }
  ]
}
```

---

## GET `/analytics-summary`

Returns the analytics KPI values and top-product/top-customer insights.

---

## GET `/reports-summary`

Returns both report datasets.

### Response shape

```json
{
  "product_report": [
    {
      "product": "Laptop",
      "quantity": 1,
      "revenue": 75000
    }
  ],
  "revenue_by_product": [
    {
      "product": "Laptop",
      "revenue": 75000
    }
  ]
}
```

---

## GET `/total-orders`

```json
{
  "total_orders": 10
}
```

---

## GET `/total-customers`

```json
{
  "total_customers": 10
}
```

---

## GET `/total-revenue`

```json
{
  "total_revenue": 168200
}
```

---

## GET `/average-order-value`

```json
{
  "average_order_value": 16820
}
```

---

## GET `/top-selling-product`

```json
{
  "product": "Headphones",
  "quantity_sold": 2
}
```

---

## GET `/top-customer`

```json
{
  "customer": "John Doe",
  "total_spent": 77500
}
```

---

## GET `/revenue-by-product`

Returns a list containing product names and revenue.

```json
[
  {
    "product": "Laptop",
    "revenue": 75000
  }
]
```

---

## GET `/product-report`

Returns product quantity and revenue.

```json
[
  {
    "product": "Laptop",
    "quantity": 1,
    "revenue": 75000
  }
]
```

---

## POST `/chat/question`

Accepts a supported business question.

### Request

```json
{
  "question": "What is the total revenue?"
}
```

### Response

```json
{
  "question": "What is the total revenue?",
  "answer": "The total revenue is ₹168,200.00."
}
```

The current chat interface is rule-based and supports business metrics implemented in `semantic_layer/api.py`.

---

## GET `/chat`

GET version of the business-question endpoint.

Example:

```text
/chat?question=What%20is%20the%20total%20revenue%3F
```

---

## POST `/cache/clear`

Clears the server-side metric cache.

### Response

```json
{
  "message": "MetricMind cache cleared."
}
```

---

## Error Handling

Analytics/database failures are returned to clients as:

```json
{
  "detail": "Analytics data is temporarily unavailable."
}
```

Internal exception details and Snowflake credentials are not returned to the browser.

---

## Swagger Documentation

When the backend is running:

```text
http://127.0.0.1:8000/docs
```

FastAPI also exposes the OpenAPI schema through its standard documentation endpoints.
