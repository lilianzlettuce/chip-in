import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from '../components/GoogleLogin';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  // Google login id
  const googleClientId = "189463683003-7mhrlsq9ihctl9bnd6ii08vagcjhegs1.apps.googleusercontent.com";

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
    if (!token) {
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
        data.isLoggedIn ? navigate(`/profile/${data.id}`) : null;
      });
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col bg-white p-12 w-full max-w-[400px] shadow-auth-card rounded-xl">
          <h2 className="text-2xl text-emerald-950 font-semibold m-0 mb-4">Welcome to ChipIn</h2>
          <form onSubmit={handleLogin}>
            <input
              type="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <div className="text-red-400 text-left text-sm">
              {msg}
            </div>
            <button type="submit" className="auth-btn my-3">
              Log in
            </button>
          </form>
          <GoogleLogin />
          <Link to="/forgotpass" className="text-base m-0 mb-1 text-emerald font-medium hover:underline hover:text-blue-800">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-base m-0 text-emerald font-medium hover:underline hover:text-blue-800">
            Don't have an account? Sign up here.
          </Link>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;