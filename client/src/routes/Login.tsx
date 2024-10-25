import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

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
        data.isLoggedIn ? navigate(`/profile/${data.id}`) : null;
      });
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col bg-white p-12 w-full max-w-[400px] shadow-auth-card rounded-xl">
        <h2 className="text-2xl text-emerald-950 font-semibold m-0 mb-4">Welcome to ChipIn</h2>
        <p className="text-gray-800 mb-6">Please log in to continue</p>
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
          <button type="submit" className="w-full bg-green-400 text-white font-semibold p-3 my-4 rounded">Login</button>
        </form>
        <Link to="/forgotpass" className="text-base m-0 mb-1 text-emerald font-medium hover:underline hover:text-blue-800">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-base m-0 text-emerald font-medium hover:underline hover:text-blue-800">
          Don't have an account? Sign up here.
        </Link>
      </div>
    </div>
  );
};

export default Login;