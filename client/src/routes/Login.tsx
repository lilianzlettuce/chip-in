import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login submitted:', { email, password });
  };

  const handleForgotPassword = () => {
    navigate('/forgotpass');
    console.log('Forgot Password clicked');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to ChipIn</h2>
        <p className="login-subtitle">Please login to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <button className="forgot-password-button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default Login;