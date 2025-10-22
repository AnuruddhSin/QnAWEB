import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUsersCog,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // 👈 New role state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const navigate = useNavigate();

  // ✅ Custom alert
  const showAlert = (message, type = 'success') => {
    setAlertMsg(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // 🚀 Submit handler
  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      showAlert('⚠️ Please fill in all fields, including your role.', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        '/api/auth/register',
        { name, email, password, role }, 
        { withCredentials: true }
      );

      showAlert(`🎉 ${role} registered successfully! Redirecting to login...`, 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      showAlert(err.response?.data?.message || '❌ Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="register-title">Create Account ✨</h2>
        <p className="register-subtitle">Join as a member or manager</p>

        <form onSubmit={submit} className="register-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group role-select">
            <FaUsersCog className="input-icon" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="member">Member</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="login-link">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link-text">
              Login
            </Link>
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {alertMsg && (
          <motion.div
            key="alert"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className={`custom-alert ${alertType}`}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
