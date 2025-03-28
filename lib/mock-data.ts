export function generateMockData(type: string, count: number) {
  switch (type) {
    case "users":
      return generateUserData(count)
    case "orders":
      return generateOrderData(count)
    case "products":
      return generateProductData(count)
    case "customers":
      return generateCustomerData(count)
    case "transaction_logs":
      return generateTransactionLogData(10000) // Generate 10,000 rows for transaction logs
    case "generic":
    default:
      return generateGenericData(count)
  }
}

function generateUserData(count: number) {
  const columns = ["id", "username", "email", "first_name", "last_name", "role", "created_at", "status"]
  const data = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    first_name: getRandomFirstName(),
    last_name: getRandomLastName(),
    role: getRandomElement(["admin", "user", "editor", "viewer"]),
    created_at: getRandomDate(new Date(2020, 0, 1), new Date()),
    status: getRandomElement(["active", "inactive", "pending"]),
  }))

  return { columns, data }
}

function generateOrderData(count: number) {
  const columns = ["order_id", "customer_id", "order_date", "total_amount", "status", "payment_method", "items_count"]
  const data = Array.from({ length: count }, (_, i) => ({
    order_id: `ORD-${100000 + i}`,
    customer_id: getRandomInt(1, 1000),
    order_date: getRandomDate(new Date(2023, 0, 1), new Date()),
    total_amount: getRandomFloat(10, 500, 2),
    status: getRandomElement(["completed", "processing", "shipped", "cancelled"]),
    payment_method: getRandomElement(["credit_card", "paypal", "bank_transfer", "cash"]),
    items_count: getRandomInt(1, 10),
  }))

  return { columns, data }
}

function generateProductData(count: number) {
  const columns = ["product_id", "product_name", "category", "price", "stock_quantity", "stock_status"]
  const data = Array.from({ length: count }, (_, i) => {
    const stockQty = getRandomInt(0, 100)
    let stockStatus
    if (stockQty === 0) {
      stockStatus = "Out of Stock"
    } else if (stockQty < 10) {
      stockStatus = "Low Stock"
    } else {
      stockStatus = "In Stock"
    }

    return {
      product_id: `PRD-${10000 + i}`,
      product_name: getRandomProductName(),
      category: getRandomElement(["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports"]),
      price: getRandomFloat(5, 200, 2),
      stock_quantity: stockQty,
      stock_status: stockStatus,
    }
  })

  return { columns, data }
}

function generateCustomerData(count: number) {
  const columns = ["customer_id", "first_name", "last_name", "email", "total_orders", "total_spent", "customer_segment"]
  const data = Array.from({ length: count }, (_, i) => {
    const orderCount = getRandomInt(0, 20)
    const totalSpent = orderCount * getRandomFloat(20, 200, 2)
    const daysSinceLastOrder = getRandomInt(1, 365)

    let segment
    if (orderCount === 0) {
      segment = "Inactive"
    } else if (daysSinceLastOrder <= 30 && orderCount >= 3) {
      segment = "Loyal"
    } else if (daysSinceLastOrder <= 90) {
      segment = "Active"
    } else {
      segment = "At Risk"
    }

    return {
      customer_id: i + 1,
      first_name: getRandomFirstName(),
      last_name: getRandomLastName(),
      email: `customer${i + 1}@example.com`,
      total_orders: orderCount,
      total_spent: totalSpent.toFixed(2),
      customer_segment: segment,
    }
  })

  return { columns, data }
}

function generateGenericData(count: number) {
  const columns = ["id", "name", "description", "category", "value", "date", "status"]
  const data = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: getRandomWords(1, 3),
    description: getRandomWords(5, 10),
    category: getRandomElement(["A", "B", "C", "D"]),
    value: getRandomFloat(0, 1000, 2),
    date: getRandomDate(new Date(2023, 0, 1), new Date()),
    status: getRandomElement(["active", "inactive", "pending", "archived"]),
  }))

  return { columns, data }
}

// Add this new function to generate transaction log data
function generateTransactionLogData(count: number) {
  const columns = [
    "transaction_id",
    "user_id",
    "transaction_type",
    "amount",
    "currency",
    "status",
    "created_at",
    "ip_address",
    "device_type",
    "location",
  ]

  const data = Array.from({ length: count }, (_, i) => {
    const transactionTypes = ["purchase", "refund", "subscription", "deposit", "withdrawal", "transfer"]
    const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CNY", "INR"]
    const statuses = ["completed", "pending", "failed", "cancelled", "processing"]
    const deviceTypes = ["desktop", "mobile", "tablet", "other"]
    const locations = [
      "United States",
      "United Kingdom",
      "Germany",
      "France",
      "Japan",
      "Canada",
      "Australia",
      "China",
      "India",
      "Brazil",
      "Mexico",
      "Spain",
      "Italy",
      "Russia",
      "South Korea",
    ]

    // Generate a random date in 2023
    const startDate = new Date("2023-01-01")
    const endDate = new Date("2023-12-31")

    return {
      transaction_id: `TRX-${1000000 + i}`,
      user_id: getRandomInt(1, 5000),
      transaction_type: getRandomElement(transactionTypes),
      amount: getRandomFloat(1, 1000, 2),
      currency: getRandomElement(currencies),
      status: getRandomElement(statuses),
      created_at: getRandomDate(startDate, endDate),
      ip_address: `${getRandomInt(1, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`,
      device_type: getRandomElement(deviceTypes),
      location: getRandomElement(locations),
    }
  })

  return { columns, data }
}

// Helper functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min: number, max: number, decimals: number): number {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(decimals))
}

function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

function getRandomWords(min: number, max: number): string {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ]
  const count = getRandomInt(min, max)
  const result = []

  for (let i = 0; i < count; i++) {
    result.push(getRandomElement(words))
  }

  return result.join(" ")
}

function getRandomFirstName(): string {
  const names = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "James",
    "Emma",
    "Robert",
    "Olivia",
    "William",
    "Sophia",
    "Joseph",
    "Isabella",
    "Thomas",
    "Mia",
    "Charles",
    "Charlotte",
    "Daniel",
    "Amelia",
  ]
  return getRandomElement(names)
}

function getRandomLastName(): string {
  const names = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
  ]
  return getRandomElement(names)
}

function getRandomProductName(): string {
  const adjectives = [
    "Premium",
    "Deluxe",
    "Elegant",
    "Classic",
    "Modern",
    "Vintage",
    "Smart",
    "Ultra",
    "Pro",
    "Essential",
  ]
  const products = [
    "Laptop",
    "Phone",
    "Tablet",
    "Watch",
    "Camera",
    "Headphones",
    "Speaker",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Shirt",
    "Jeans",
    "Shoes",
    "Jacket",
    "Dress",
    "Bag",
    "Wallet",
    "Sunglasses",
    "Hat",
    "Scarf",
  ]

  return `${getRandomElement(adjectives)} ${getRandomElement(products)}`
}

