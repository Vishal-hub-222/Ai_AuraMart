// Leave VITE_API_URL unset for local development so Vite's `/api` proxy is used.
// Set it to the deployed API origin when the frontend is hosted separately.
// The backend mounts every endpoint under `/api`, so add that path when an
// origin is supplied while still accepting a value that already ends in `/api`.
const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_BASE = configuredApiUrl
  ? `${configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`}`
  : '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auramart_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseApiResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(
      `The API returned ${contentType || 'an unknown response type'} (HTTP ${res.status}). ` +
      'Check that VITE_API_URL points to the backend service.'
    );
  }

  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload.message || `API request failed (HTTP ${res.status})`);
  }

  return payload;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return parseApiResponse(res);
  },

  async register(name, email, password, role = 'customer') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return parseApiResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { ...getAuthHeader() }
    });
    return parseApiResponse(res);
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    return parseApiResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return parseApiResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories/all`);
    return parseApiResponse(res);
  },

  async createProduct(formData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData // FormData will set multipart/form-data boundary automatically
    });
    return parseApiResponse(res);
  },

  async updateProduct(id, formData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
      body: formData // FormData will set multipart/form-data boundary automatically
    });
    return parseApiResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return parseApiResponse(res);
  },

  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reviewData)
    });
    return parseApiResponse(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(orderData)
    });
    return parseApiResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { ...getAuthHeader() }
    });
    return parseApiResponse(res);
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE}/orders/all`, {
      headers: { ...getAuthHeader() }
    });
    return parseApiResponse(res);
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    return parseApiResponse(res);
  },

  // Users (Admin only)
  async getAllUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { ...getAuthHeader() }
    });
    return parseApiResponse(res);
  },

  // AI Services
  async chatWithAssistant(message, history = []) {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history })
    });
    return parseApiResponse(res);
  },

  async smartSearch(query) {
    const res = await fetch(`${API_BASE}/ai/smart-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return parseApiResponse(res);
  },

  async generateProductCopy(payload) {
    const res = await fetch(`${API_BASE}/ai/generate-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(payload)
    });
    return parseApiResponse(res);
  },

  async getOutfitBundle(productId) {
    const res = await fetch(`${API_BASE}/ai/bundle/${productId}`);
    return parseApiResponse(res);
  },

  async getReviewSummary(productId) {
    const res = await fetch(`${API_BASE}/ai/review-summary/${productId}`);
    return parseApiResponse(res);
  }
};
