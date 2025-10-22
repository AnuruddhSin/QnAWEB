import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qa_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate?.(); // optional inside hooks

  // ✅ Axios global config
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // ✅ Check current user (via cookie)
  const fetchMe = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/auth/me');
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('qa_user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('qa_user');
      }
    } catch (err) {
      console.warn('Auth check failed:', err.response?.data?.message || err.message);
      setUser(null);
      localStorage.removeItem('qa_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe().catch(() => {});
  }, []);

  // ✅ Logout
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      console.warn('Logout error:', e.message);
    }
    setUser(null);
    localStorage.removeItem('qa_user');
    if (navigate) navigate('/login', { replace: true });
    else window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
