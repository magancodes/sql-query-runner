export const predefinedQueries = [
  {
    id: "1",
    name: "Select All Users",
    query: `SELECT * 
FROM users 
LIMIT 100;`,
  },
  {
    id: "2",
    name: "Customer Orders Summary",
    query: `SELECT 
  c.customer_id,
  c.first_name,
  c.last_name,
  c.email,
  COUNT(o.order_id) as total_orders,
  SUM(o.total_amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
ORDER BY total_spent DESC
LIMIT 100;`,
  },
  {
    id: "3",
    name: "Product Inventory",
    query: `SELECT 
  p.product_id,
  p.product_name,
  p.category,
  p.price,
  p.stock_quantity,
  CASE 
    WHEN p.stock_quantity = 0 THEN 'Out of Stock'
    WHEN p.stock_quantity < 10 THEN 'Low Stock'
    ELSE 'In Stock'
  END as stock_status
FROM products p
ORDER BY p.category, p.product_name
LIMIT 100;`,
  },
  {
    id: "4",
    name: "Monthly Sales Analysis",
    query: `SELECT 
  DATE_FORMAT(o.order_date, '%Y-%m') as month,
  COUNT(o.order_id) as order_count,
  SUM(o.total_amount) as total_revenue,
  AVG(o.total_amount) as average_order_value,
  COUNT(DISTINCT o.customer_id) as unique_customers
FROM orders o
WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month DESC;`,
  },
  {
    id: "5",
    name: "Customer Segmentation",
    query: `WITH customer_metrics AS (
  SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as order_count,
    SUM(o.total_amount) as total_spent,
    MAX(o.order_date) as last_order_date,
    DATEDIFF(CURRENT_DATE, MAX(o.order_date)) as days_since_last_order
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  GROUP BY c.customer_id
)
SELECT 
  customer_id,
  first_name,
  last_name,
  email,
  order_count,
  total_spent,
  last_order_date,
  days_since_last_order,
  CASE 
    WHEN order_count = 0 THEN 'Inactive'
    WHEN days_since_last_order <= 30 AND order_count >= 3 THEN 'Loyal'
    WHEN days_since_last_order <= 90 THEN 'Active'
    ELSE 'At Risk'
  END as customer_segment
FROM customer_metrics
ORDER BY total_spent DESC
LIMIT 100;`,
  },
  {
    id: "6",
    name: "Large Transaction Log (10,000+ rows)",
    query: `SELECT 
  transaction_id,
  user_id,
  transaction_type,
  amount,
  currency,
  status,
  created_at,
  ip_address,
  device_type,
  location
FROM transaction_logs
WHERE created_at >= '2023-01-01'
ORDER BY created_at DESC
LIMIT 10000;`,
  },
]

