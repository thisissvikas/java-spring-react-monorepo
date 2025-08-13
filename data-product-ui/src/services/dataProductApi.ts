import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here if implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const dataProductApi = {
  getAllDataProducts: (page?: number, size?: number, portfolio?: string, sensitivityCategory?: string) =>
    apiClient.get('/data-products', {
      params: { page, size, portfolio, sensitivityCategory },
    }),

  getDataProductById: (id: string) =>
    apiClient.get(`/data-products/${id}`),

  createDataProduct: (dataProduct: any) =>
    apiClient.post('/data-products', dataProduct),

  updateDataProduct: (id: string, dataProduct: any) =>
    apiClient.put(`/data-products/${id}`, dataProduct),

  deleteDataProduct: (id: string) =>
    apiClient.delete(`/data-products/${id}`),

  healthCheck: () =>
    apiClient.get('/health'),
};