const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const authHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
};

export const adminApi = {
  getStats: () => request('/users/admin/stats'),
  getApplications: () => request('/job-candidate/admin/overview'),
  createUser: (body: any) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id: string, body: any) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
};
