import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/chip-in-logo1.png"

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Navbar() {
  const { householdId/*, userId*/ } = useParams();

  // User data fields
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  console.log(`${householdId}, ${userId}`);
  console.log(`${username}, ${email}`);

  const navigate = useNavigate();

  // Get server url
  const PORT = process.env.REACT_APP_PORT || 5050;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  // User sign out, redirect to login page
  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const deleteAccount = () => {
    fetch(`${SERVER_URL}/user/${userId}`, {
      method: "DELETE",
    })
    .then(() => {
      localStorage.removeItem("token");
      navigate("/signup");
    });
  }

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
      const { isLoggedIn, id, username, email/*, households, preferences*/ } = data;
      setUserId(id);
      setUsername(username);
      setEmail(email);

      console.log("logged in: " + isLoggedIn);
      console.log("username: " + data.username)
      //data.isLoggedIn ? navigate(`/profile/${data.id}`): null;
    });
  }, []);

  return (
    <div>
      <nav className="fixed min-w-48 h-screen mr-4 border-r-4 border-black flex flex-col justify-between items-center">
        <NavLink to="/">
          <img alt="ChipIn logo" className="h-20 inline" src={logo}></img>
        </NavLink>

        <div onClick={signOut}
            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" >
          Sign Out
        </div>

        <div onClick={deleteAccount}
            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" >
          Delete Account
        </div>

        <div className="flex flex-col justify-between items-center">
          <NavLink to={`/households/${householdId ? householdId : 1}/home`}
              style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
              className="p-3">
            Home
          </NavLink>
          <NavLink to={`/households/${householdId ? householdId : 1}/dashboard`}
              style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
              className="p-3">
            Dashboard
          </NavLink>
          <NavLink to={`/households/${householdId ? householdId : 1}/my-expenses/${userId ? userId : 1}`}
              style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
              className="p-3">
            My Expenses
          </NavLink>
          <NavLink to={`/households/${householdId ? householdId : 1}/recipes`}
              style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
              className="p-3">
            Recipes
          </NavLink>
        </div>

        <div className="border-t-4">
          <div className="my-2 flex justify-center items-center">
            <h1 className="mr-2">Households</h1>
            <button 
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
                transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" >
              +
            </button>
          </div>
          <div className="flex flex-col justify-between items-center h-1/3">
            <NavLink to="/households/1"
                style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                className="p-3">
              Basement Dwellers
            </NavLink>
            <NavLink to="/households/2"
                style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                className="p-3">
              Example Household 2
            </NavLink>
          </div>
        </div>

        <NavLink to={`/profile/${userId ? userId : 1}`}
            className="w-full h-16 flex justify-center items-center bg-black text-white">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}