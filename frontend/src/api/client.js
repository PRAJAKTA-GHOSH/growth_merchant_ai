import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('growzen_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  demoLogin: (category = 'retail') => apiClient.post(`/auth/demo-login/${category}`),

  // Dashboard
  getDashboard: (params) => apiClient.get('/dashboard/overview', { params }),

  // AI Forecasting
  getForecast: (horizon = 7) => apiClient.get('/forecasting', { params: { horizon } }),

  // Customer Intelligence (RFM & Churn)
  getCustomers: () => apiClient.get('/customers/intelligence'),

  // Smart Inventory
  getInventory: () => apiClient.get('/inventory/health'),
  updateStock: (productId, newStock) => apiClient.put(`/inventory/products/${productId}/stock`, { new_stock: newStock }),

  // Campaigns Studio
  generateCampaign: (data) => apiClient.post('/campaigns/generate', data),
  saveCampaign: (data) => apiClient.post('/campaigns', data),
  listCampaigns: () => apiClient.get('/campaigns'),

  // Vyapar Copilot
  askCopilot: (query, languageMode = 'auto') => apiClient.post('/copilot/query', { query, language_mode: languageMode }),

  // Merchant Health Score
  getHealthScore: () => apiClient.get('/health/score'),

  // Anomaly Detection
  getAnomalies: () => apiClient.get('/anomalies/detect'),

  // Recommendations
  getRecommendations: () => apiClient.get('/recommendations'),
  updateRecommendation: (id, status) => apiClient.patch(`/recommendations/${id}`, { status }),

  // Transactions
  getTransactions: (params) => apiClient.get('/transactions', { params }),
  createTransaction: (data) => apiClient.post('/transactions', data),
  uploadTransactionsCsv: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Reports
  getExecutiveReport: () => apiClient.get('/reports/summary'),
  getCsvDownloadUrl: () => `${API_BASE_URL}/reports/export/csv`,

  // Merchants Profile & Demo
  getProfile: () => apiClient.get('/merchants/profile'),
  updateProfile: (data) => apiClient.put('/merchants/profile', data),
  regenerateDemo: (category = 'retail') => apiClient.post(`/merchants/generate-demo?category_type=${category}`),
};

export default api;
