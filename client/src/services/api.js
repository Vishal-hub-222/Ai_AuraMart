const API_BASE = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auramart_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name, email, password, role = 'customer') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories/all`);
    return res.json();
  },

  async createProduct(formData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData // FormData will set multipart/form-data boundary automatically
    });
    return res.json();
  },

  async updateProduct(id, formData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
      body: formData // FormData will set multipart/form-data boundary automatically
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return res.json();
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
    return res.json();
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
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE}/orders/all`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
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
    return res.json();
  },

  // Users (Admin only)
  async getAllUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { ...getAuthHeader() }
    });
    return res.json();
  },

  // AI Services
  async chatWithAssistant(message, history = []) {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history })
    });
    return res.json();
  },

  async smartSearch(query) {
    const res = await fetch(`${API_BASE}/ai/smart-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
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
    return res.json();
  },

  async getOutfitBundle(productId) {
    const res = await fetch(`${API_BASE}/ai/bundle/${productId}`);
    return res.json();
  },

  async getReviewSummary(productId) {
    const res = await fetch(`${API_BASE}/ai/review-summary/${productId}`);
    return res.json();
  }
};
