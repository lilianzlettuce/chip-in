import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  // Get server url
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  // User log in
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login submitted:', { username, password });

    const user = {
      username: username,
      password: password,
    };

    fetch(`${SERVER_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
    .then(res => res.json())
    .then(data => {
      // Set session token if received from server
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to profile upon successful login
      if (data.message) {
        navigate(`/profile/${data.id}`);
      } else if (data.error) {
        // Display any errors if failed login
        console.log(data.error)
        setMsg(data.error);
      }
    });
  };

  useEffect(() => {
    //localStorage.removeItem("token");
    let token = localStorage.getItem("token");
    console.log("token: " + token);
    if (!token) {
      //throw new Error("no token supplied");
      console.log("no token supplied");
      return;
    }

    // Redirect to profile if user is signed in
    fetch(`${SERVER_URL}/auth/getUserData`, {
      headers: {
        "x-access-token": token,
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log("logged in: " + data.isLoggedIn);
      console.log("username: " + data.username)
      data.isLoggedIn ? navigate(`/profile/${data.id}`): null;
    });
  }, []);

  const handleForgotPassword = () => {
    navigate('/forgotpass');
    console.log('Forgot Password clicked');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to ChipIn</h2>
        <p className="login-subtitle">Please login to continue</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <div className="text-red-400 text-left text-sm">
            {msg}
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