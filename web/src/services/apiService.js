import apiClient from './apiClient';

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
};

export const usersApi = {
  me: () => apiClient.get('/users/me'),
};

export const campaignsApi = {
  list: (params = {}) => apiClient.get('/campaigns', { params }),
  my: () => apiClient.get('/campaigns/my'),
  getById: (id) => apiClient.get(`/campaigns/${id}`),
  create: (payload) => apiClient.post('/campaigns', payload),
  update: (id, payload) => apiClient.put(`/campaigns/${id}`, payload),
  remove: (id) => apiClient.delete(`/campaigns/${id}`),
};

export const donationsApi = {
  create: (campaignId, amount) => apiClient.post(`/donations/campaigns/${campaignId}`, { amount }),
  my: () => apiClient.get('/donations/me'),
};
