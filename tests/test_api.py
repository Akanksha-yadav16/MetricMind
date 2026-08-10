from semantic_layer import api


def sample_dashboard():
    return {
        "total_orders": 10,
        "total_customers": 10,
        "total_revenue": 168200.0,
        "average_order_value": 16820.0,
        "top_product": ("Headphones", 2),
        "top_customer": ("John Doe", 77500.0),
        "product_rows": [
            ("Laptop", 1, 75000.0),
            ("Headphones", 2, 5000.0),
        ],
    }


def test_business_question_answers(monkeypatch):
    monkeypatch.setattr(api, "get_dashboard_summary", sample_dashboard)

    assert "₹168,200.00" in api.answer_question("What is the total revenue?")
    assert "10" in api.answer_question("How many orders do we have?")
    assert "John Doe" in api.answer_question("Who is our top customer?")
    assert "Laptop" in api.answer_question("Show revenue by product.")


def test_unsupported_question_does_not_query_database(monkeypatch):
    def fail_if_called():
        raise AssertionError("Database should not be queried for unsupported questions")

    monkeypatch.setattr(api, "get_dashboard_summary", fail_if_called)
    answer = api.answer_question("What is the weather?")
    assert "couldn't understand" in answer
