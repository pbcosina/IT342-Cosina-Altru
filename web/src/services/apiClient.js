import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')) {
      return payload.data;
    }
    return payload;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthRoute = typeof originalRequest?.url === 'string'
      && (originalRequest.url.includes('/auth/login')
        || originalRequest.url.includes('/auth/register')
        || originalRequest.url.includes('/auth/refresh'));

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const refreshedPayload = refreshResponse.data?.data ?? refreshResponse.data;
          const newToken = refreshedPayload?.token;
          const newRefreshToken = refreshedPayload?.refreshToken;

          if (newToken) {
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      }
    }

    const message = error.response?.data?.message;
    if (message) {
      error.message = message;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
