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

export const donationsApi = {
  create: (campaignId, amount, idempotencyKey) => apiClient.post(
    `/donations/campaigns/${campaignId}`,
    { amount, idempotencyKey },
    idempotencyKey
      ? {
          headers: {
            'X-Idempotency-Key': idempotencyKey,
          },
        }
      : undefined
  ),
  my: () => apiClient.get('/donations/me'),
};
