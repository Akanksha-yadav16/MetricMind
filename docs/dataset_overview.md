# Olist Brazilian E-Commerce Dataset Overview

## Tables

### 1. Customers
Contains customer information and locations.

Primary Key:
- customer_id

---

### 2. Orders
Contains order status and timestamps.

Primary Key:
- order_id

Foreign Key:
- customer_id

---

### 3. Order Items
Contains purchased products.

Primary Key:
- order_id
- order_item_id

Foreign Key:
- product_id
- seller_id

---

### 4. Payments
Contains payment details.

---

### 5. Reviews
Contains customer ratings.

---

### 6. Products
Contains product information.

---

### 7. Sellers
Contains seller information.

---

### 8. Geolocation
Contains location data.

---

### 9. Category Translation
Maps Portuguese category names to English.