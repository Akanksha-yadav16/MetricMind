# 📊 MetricMind — Business Analytics Platform

MetricMind is a full-stack business analytics application that combines **Next.js**, **FastAPI**, and **Snowflake** to turn sales data into a simple analytics workspace.

The application provides a dashboard, detailed reports, business analytics, and a natural-language **AI Chat** interface for supported business questions.

> **Current scope:** the AI Chat is a rule-based business-question interface. It is not a general-purpose LLM chatbot.

---

## ✨ Features

- 📈 Dashboard KPIs
  - Total revenue
  - Total orders
  - Total customers
  - Average order value
- 🏆 Business insights
  - Top-selling product
  - Highest-value customer
- 📊 Revenue by product chart
- 📋 Product report with quantity and revenue
- 📊 Analytics summary
- 💬 Natural-language business-question chat
- 📑 Table-formatted chat results for:
  - Revenue by product
  - Quantity sold by product
- 🌙 Light/Dark mode stored locally in the browser
- ⚡ Browser session caching for dashboard, analytics, and reports
- ⚡ Server-side in-memory metric caching
- 🛡️ API error handling that avoids exposing database credentials or internal stack traces
- 🔌 FastAPI Swagger/OpenAPI documentation
- 🧪 Automated API and Snowflake integration tests

---

## 🧰 Technology Stack

### Frontend

- Next.js 16.3.0
- React 19.2.8
- Tailwind CSS 4
- Recharts 3.10.1
- Lucide React

### Backend

- Python
- FastAPI 0.139.2
- Uvicorn 0.51.0
- Pydantic
- python-dotenv

### Data

- Snowflake
- Snowflake Connector for Python 4.7.1
- SQL
- CSV datasets

### Testing

- Pytest 9.1.1

---

## 📁 Project Structure

```text
MetricMind-fixed/
│
├── semantic_layer/
│   ├── api.py                 # FastAPI application and chat logic
│   └── metrics.py             # Snowflake queries and metric cache
│
├── frontend/
│   ├── app/
│   │   ├── page.js            # Dashboard
│   │   ├── reports/page.js    # Reports
│   │   ├── analytics/page.js  # Analytics
│   │   ├── chat/page.js       # AI Chat
│   │   ├── settings/page.js   # Local settings/theme
│   │   ├── globals.css
│   │   └── layout.js
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── reports/
│   │
│   ├── services/api.js        # Frontend API client
│   ├── package.json
│   └── .env.example
│
├── data/
│   ├── customers.csv
│   ├── orders.csv
│   ├── order_items.csv
│   ├── products.csv
│   └── raw/                   # Optional raw Olist exploration data
│
├── sql/
│   ├── database_setup.sql     # Snowflake database/schema/table setup
│   ├── load_data.sql          # Load curated CSV files
│   └── verify_data.sql        # Basic row-count checks
│
├── docs/
│   ├── api_contract.md
│   ├── dataset_overview.md
│   └── metric_definitions.md
│
├── tests/
│   ├── test_api.py
│   └── test_metrics.py
│
├── requirements.txt
├── pytest.ini
├── .env.example
└── README.md
```

---

# 🚀 Setup

## 1. Clone / open the project

Open a terminal in the project root:

```bat
cd MetricMind-fixed
```

---

## 2. Create and activate the Python virtual environment

```bat
python -m venv venv
venv\Scripts\activate
```

Install the backend dependencies:

```bat
python -m pip install -r requirements.txt
```

---

# ❄️ Snowflake Configuration

MetricMind expects these environment variables:

```text
SNOWFLAKE_USER=
SNOWFLAKE_PASSWORD=
SNOWFLAKE_ACCOUNT=
SNOWFLAKE_WAREHOUSE=
SNOWFLAKE_DATABASE=
SNOWFLAKE_SCHEMA=
```

Copy `.env.example` to `.env` and fill in your own Snowflake credentials.

### Important

Never commit `.env` to GitHub.

The repository ignores environment files while keeping `.env.example` available as a safe template.

If a real Snowflake password has ever been exposed or committed, **rotate the password/credential before publishing the project.**

---

# 🗄️ Snowflake Database Setup

The SQL scripts are located in:

```text
sql/
```

### Step 1 — Create database and tables

Run:

```text
sql/database_setup.sql
```

This creates:

- `METRICMIND_DB`
- `RAW` schema
- `ANALYTICS` schema
- `CUSTOMERS`
- `PRODUCTS`
- `ORDERS`
- `ORDER_ITEMS`

### Step 2 — Load data

Run:

```text
sql/load_data.sql
```

### Step 3 — Verify data

Run:

```text
sql/verify_data.sql
```

The included development dataset is expected to produce:

```text
10 customers
10 orders
10 products
11 order items
```

The exact analytics values are determined by the Snowflake data.

---

# ⚙️ Start the FastAPI Backend

From the project root:

```bat
venv\Scripts\activate
uvicorn semantic_layer.api:app --reload --host 0.0.0.0 --port 8000
```

The API will be available locally at:

```text
http://127.0.0.1:8000
```

API health check:

```text
http://127.0.0.1:8000/health
```

Swagger/OpenAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Start the Next.js Frontend

Open a **second terminal**.

```bat
cd frontend
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:3000
```

Create:

```text
frontend/.env.local
```

with:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

After changing `.env.local`, restart the Next.js development server.

---

# 🌐 Access From Another Device on the LAN

If you want to open the frontend using the Network URL, for example:

```text
http://192.168.1.110:3000
```

the frontend must point to the backend using the computer's LAN IP:

```text
NEXT_PUBLIC_API_URL=http://192.168.1.110:8000
```

The FastAPI server should be started with:

```bat
uvicorn semantic_layer.api:app --reload --host 0.0.0.0 --port 8000
```

The frontend and backend machines/devices must be able to communicate over the local network.

---

# 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API status message |
| GET | `/health` | Health check |
| GET | `/dashboard-summary` | Dashboard metrics and product revenue |
| GET | `/analytics-summary` | Analytics KPIs and top insights |
| GET | `/reports-summary` | Product and revenue reports |
| GET | `/total-orders` | Total orders |
| GET | `/total-customers` | Total customers |
| GET | `/total-revenue` | Total revenue |
| GET | `/average-order-value` | Average order value |
| GET | `/top-selling-product` | Top-selling product |
| GET | `/top-customer` | Highest-value customer |
| GET | `/revenue-by-product` | Revenue grouped by product |
| GET | `/product-report` | Product quantity/revenue report |
| POST | `/chat/question` | Business question chat |
| GET | `/chat` | GET version of business question chat |
| POST | `/cache/clear` | Clear server-side metric cache |

Full API documentation is available in:

```text
docs/api_contract.md
```

Swagger is also available at:

```text
http://127.0.0.1:8000/docs
```

---

# 💬 AI Chat

The Chat page accepts supported business questions in natural language.

Examples:

```text
What is the total revenue?
How many orders do we have?
How many customers do we have?
What is the average order value?
What is the top-selling product?
Who is our top customer?
Show revenue by product.
Show quantity sold by product.
```

The backend normalizes questions by handling case, punctuation, and hyphens such as:

```text
top-selling
top selling
TOP-SELLING
```

The last two product-level questions are rendered as readable tables in the frontend.

### Important

MetricMind's current chat system is **rule-based**. It matches supported business-question patterns and retrieves the relevant Snowflake metrics. It does not currently use an external LLM.

---

# 📐 Metrics

The current backend calculates metrics from the `ANALYTICS` schema.

### Total Revenue

```text
SUM((UNIT_PRICE × QUANTITY) - DISCOUNT)
```

from `ORDER_ITEMS`.

### Total Orders

```text
COUNT(*)
```

from `ORDERS`.

### Total Customers

```text
COUNT(*)
```

from `CUSTOMERS`.

### Average Order Value

```text
Total Revenue / COUNT(DISTINCT ORDER_ID)
```

### Top-Selling Product

The product with the highest:

```text
SUM(QUANTITY)
```

### Top Customer

The customer with the highest:

```text
SUM((UNIT_PRICE × QUANTITY) - DISCOUNT)
```

### Revenue by Product

```text
SUM((UNIT_PRICE × QUANTITY) - DISCOUNT)
GROUP BY PRODUCT
```

See:

```text
docs/metric_definitions.md
```

for the complete definitions.

---

# ⚡ Caching

MetricMind uses two levels of caching.

### Backend

The semantic layer maintains an in-memory cache.

Default TTL:

```text
60 seconds
```

Change it using:

```text
METRIC_CACHE_TTL=60
```

### Frontend

Dashboard, Analytics, and Reports use browser `sessionStorage` caching.

Default browser cache duration:

```text
5 minutes
```

The frontend still requests fresh data after loading cached values.

---

# 🧪 Testing

The project contains:

```text
tests/test_api.py
tests/test_metrics.py
```

Run the default test command:

```bat
pytest
```

The default `pytest.ini` excludes tests marked as `integration`.

To run the complete suite, including the Snowflake integration tests:

```bat
pytest -o "addopts="
```

A complete successful run currently consists of:

```text
9 passed
```

The integration tests require a working Snowflake connection and the expected development dataset.

---

# ⚠️ Snowflake Warning

You may see a warning similar to:

```text
DeprecationWarning: X509.get_subject is deprecated
```

from the Snowflake connector's dependency stack.

This is a dependency warning rather than a MetricMind test failure. If the tests report:

```text
9 passed
```

the test suite itself has passed.

---

# 🛡️ Security

Before publishing MetricMind:

- Never commit `.env`.
- Never commit `frontend/.env.local`.
- Never expose Snowflake passwords in source code.
- Use `.env.example` as the public configuration template.
- Rotate any credential that has previously been exposed.
- Do not commit `.next/`, `node_modules/`, `venv/`, or `.pytest_cache/`.

---

# 📌 Current Project Status

The current project has been tested with:

```text
Python 3.13.x
Next.js 16.3.0
React 19.2.8
```

The completed application includes:

- Dashboard ✅
- Reports ✅
- Analytics ✅
- AI Chat ✅
- Chat product tables ✅
- Light/Dark mode ✅
- FastAPI API ✅
- Snowflake semantic layer ✅
- Browser caching ✅
- Backend caching ✅
- Automated tests ✅

---

# 🔮 Possible Future Improvements

The current project can be extended with:

- Authentication and user accounts
- Role-based access control
- Date-range filters
- Sales trends over time
- Category-level analytics
- Customer segmentation
- Export to CSV/PDF
- More advanced charts
- Natural-language SQL/LLM integration
- Production database connection pooling
- Automated CI/CD testing
- Cloud deployment

---

## 📄 Documentation

Additional documentation:

```text
docs/api_contract.md
docs/dataset_overview.md
docs/metric_definitions.md
```

---

## 👨‍💻 MetricMind

**MetricMind — Business Analytics Platform**

Built with **Next.js + FastAPI + Snowflake**.
