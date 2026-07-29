# 📊 MetricMind – AI-Powered Data Analytics Platform

MetricMind is a cloud-based analytics platform that combines **Snowflake**, **FastAPI**, and a **semantic data layer** to provide business metrics through REST APIs. It demonstrates modern data engineering practices, including secure configuration management, SQL-based analytics, API development, and automated testing.

---

## 🚀 Features

- Semantic layer for business metrics
- FastAPI REST API
- Snowflake cloud data warehouse integration
- Secure configuration using `.env`
- Automated API testing with Pytest
- Interactive API documentation with Swagger UI
- Modular and maintainable project structure

---

## 🛠️ Tech Stack

- Python
- FastAPI
- Snowflake
- SQL
- Pandas
- Pytest
- Uvicorn
- python-dotenv
- Git & GitHub

---

## 📁 Project Structure

```text
MetricMind/
│
├── semantic_layer/
│   ├── api.py
│   ├── metrics.py
│
├── sql/
├── tests/
├── docs/
├── data/
├── notebooks/
├── requirements.txt
├── README.md
└── .gitignore
```

---

## ⚡ API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | API Status |
| GET | `/total-orders` | Total Orders |
| GET | `/total-revenue` | Total Revenue |
| GET | `/average-order-value` | Average Order Value |

---

## ▶️ Running the Project

```bash
git clone <repository-url>
cd MetricMind

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn semantic_layer.api:app --reload
```

Then open:

```
http://127.0.0.1:8000/docs
```

---

## 🧪 Running Tests

```bash
pytest
```

---

## 🔒 Security

Sensitive credentials are stored in a `.env` file and are excluded from version control using `.gitignore`.

---

## 📈 Future Improvements

- Authentication
- Dashboard Integration
- Docker Support
- CI/CD Pipeline
- AI-powered insights

---

## 👨‍💻 Author

**Nikhil Krishna R**

Data Analyst | Python | SQL | Power BI | FastAPI | Snowflake