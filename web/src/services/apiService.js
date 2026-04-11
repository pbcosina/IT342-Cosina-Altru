import apiClient from './apiClient';

const normalizeList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  if (Array.isArray(response?.items)) {
    return response.items;
  }
  if (Array.isArray(response?.content)) {
    return response.content;
  }
  return [];
};

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
};

export const usersApi = {
  me: () => apiClient.get('/users/me'),
  updateMe: (payload) => apiClient.put('/users/me', payload),
};

export const campaignsApi = {
  list: async (params = {}) => normalizeList(await apiClient.get('/campaigns', { params })),
  my: async (params = {}) => normalizeList(await apiClient.get('/campaigns/my', { params })),
  listPaged: (params = {}) => apiClient.get('/campaigns', { params }),
  myPaged: (params = {}) => apiClient.get('/campaigns/my', { params }),
  getById: (id) => apiClient.get(`/campaigns/${id}`),
  create: (payload) => apiClient.post('/campaigns', payload),
  update: (id, payload) => apiClient.put(`/campaigns/${id}`, payload),
  remove: (id) => apiClient.delete(`/campaigns/${id}`),
};

export const bookmarksApi = {
  list: async () => normalizeList(await apiClient.get('/bookmarks')),
  add: (campaignId) => apiClient.post(`/bookmarks/${campaignId}`),
  remove: (campaignId) => apiClient.delete(`/bookmarks/${campaignId}`),
};

export const dashboardApi = {
  summary: () => apiClient.get('/dashboard/summary'),
};

export const notificationsApi = {
  my: async () => normalizeList(await apiClient.get('/notifications/me')),
  create: (payload) => apiClient.post('/notifications', payload),
};

export const donationsApi = {
  create: (campaignId, amount, idempotencyKey, anonymous = false, donorMessage = '') => apiClient.post(
    `/donations/campaigns/${campaignId}`,
    { amount, idempotencyKey, anonymous, donorMessage },
    idempotencyKey
      ? {
          headers: {
            'X-Idempotency-Key': idempotencyKey,
          },
        }
      : undefined
  ),
  my: () => apiClient.get('/donations/me'),
  byCampaign: (campaignId) => apiClient.get(`/donations/campaigns/${campaignId}`),
};
