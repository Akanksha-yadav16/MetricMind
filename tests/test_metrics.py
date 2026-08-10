import pytest

pytestmark = pytest.mark.integration

from semantic_layer.metrics import (
    get_total_orders,
    get_total_customers,
    get_total_revenue,
    get_average_order_value,
    get_top_selling_product,
    get_top_customer,
    get_revenue_by_product
)


def test_total_orders():
    assert get_total_orders() == 10


def test_total_customers():
    assert get_total_customers() == 10


def test_total_revenue():
    assert float(get_total_revenue()) == 168200.0


def test_average_order_value():
    assert float(get_average_order_value()) == 16820.0


def test_top_selling_product():
    product = get_top_selling_product()
    assert product[0] == "Headphones"


def test_top_customer():
    customer = get_top_customer()
    assert customer[0] == "John Doe"


def test_revenue_by_product():
    revenue = get_revenue_by_product()
    assert len(revenue) > 0