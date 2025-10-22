import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchInsights = async (params = {}) => {
  // params: { page, limit, search, tag, from, to }
  const res = await api.get('/insights', { params });
  return res.data;
};

export const createInsight = async ({ questionId, summary }) => {
  const res = await api.post('/insights', { questionId, summary });
  return res.data;
};

export const fetchQuestions = async () => {
  const res = await api.get('/questions');
  return res.data;
};

export const fetchStats = async () => {
  const res = await api.get('/stats');
  return res.data;
};

export default api;
