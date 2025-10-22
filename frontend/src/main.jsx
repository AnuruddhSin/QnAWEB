
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Questions from './pages/Questions';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Manager_Insights from './pages/Manager_Insights';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/questions" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/manager" element={<Manager_Insights />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(<App />);
