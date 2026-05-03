import { chatbotControllerGetAllUserConvers, chatbotControllerGetConversactionDetail, MessageDto, PaginatedAllUserChatDto } from "../api-client";

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

const getAllUserChat = async (offset: number, limit: number): Promise<PaginatedAllUserChatDto | undefined> => {
  const res = await chatbotControllerGetAllUserConvers({
    query: {
      offset,
      limit
    }
  })
  return res.data;
}

const getConversactionDetail = async (conv_id: string): Promise<MessageDto[]> => {
  const res = await chatbotControllerGetConversactionDetail({
    path: {
      convId: conv_id
    }
  })
  return res.data || [];
}


export const adminApi = {
  getAllUserChat,
  getConversactionDetail,
  getStats: () => request('/users/admin/stats'),
  getApplications: () => request('/job-candidate/admin/overview'),
  createUser: (body: any) => request('/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUser: (id: string, body: any) => request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
};
