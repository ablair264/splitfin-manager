// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-render-backend.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: `${API_BASE_URL}/auth`,
  AUTH_CALLBACK: `${API_BASE_URL}/auth/callback`,
  
  // Shop endpoints
  SHOP: `${API_BASE_URL}/api/shop`,
  
  // Product endpoints
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_COUNT: `${API_BASE_URL}/api/products/count`,
  PRODUCT_UPLOAD: `${API_BASE_URL}/api/products/upload`,
  
  // Inventory endpoints
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  INVENTORY_LEVELS: `${API_BASE_URL}/api/inventory/levels`,
  
  // Order endpoints
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDER_COUNT: `${API_BASE_URL}/api/orders/count`,
  
  // Customer endpoints
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_COUNT: `${API_BASE_URL}/api/customers/count`,
  
  // Analytics endpoints
  ANALYTICS: `${API_BASE_URL}/api/analytics`,
  
  // Image endpoints
  IMAGES: `${API_BASE_URL}/api/images`,
  IMAGE_UPLOAD: `${API_BASE_URL}/api/images/upload`,
};