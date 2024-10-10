import React, { useState, useEffect } from 'react'
import chipInLogo from './assets/chip-in-logo1.png'
import './global.css'

import Layout from './Layout';
import { Outlet, useNavigate } from "react-router-dom";

import { UserProvider } from './UserContext';
import { UserType, UserContextType } from './types';

type AppProps = {
  message: string;
};

export default function App({ message }: AppProps) {
  const [count, setCount] = useState<number>(0);

  let initialUser: UserType = {
    id: '1',
    username: 'yo mama',
    email: 'lechuga.doe@example.com',
    households: [{ id: 'h1', name: 'Main Household' }],
    preferences: [{ theme: 'dark', notificationsEnabled: true }]
  };

  const navigate = useNavigate();

  // Get server url
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  useEffect(() => {
    // Check if token exists
    let token = localStorage.getItem("token");
    if (!token) {
      console.log("no token supplied");
      navigate("/login");
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
      data.isLoggedIn ? null: navigate("/login");;
    });
    
  }, []);

  return (
    <UserProvider>
      <Layout>
          <Outlet />
          <div>
            <a target="_blank">
              <img src={chipInLogo} className="logo" alt="Vite logo" />
            </a>
          </div>
          <p>
              <code>src/App.tsx</code>
          </p>
          <div>Message: {message}</div>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
          </div>
      </Layout>
    </UserProvider>
  );
};