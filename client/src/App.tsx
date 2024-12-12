import { useEffect } from 'react';
import './global.css';

import { Outlet, useNavigate } from "react-router-dom";

import { UserProvider } from './UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  const navigate = useNavigate();

  const googleClientId = "189463683003-7mhrlsq9ihctl9bnd6ii08vagcjhegs1.apps.googleusercontent.com";

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
        data.isLoggedIn ? null : navigate("/login");;
      });
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <UserProvider>
        <div className="flex justify-between items-start">
          <Navbar />
          <div className="w-4/5 min-h-screen pt-4 pr-12 flex flex-col justify-between">
            <Outlet />
            <Footer />
          </div>
        </div>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};