import { NavLink, useNavigate } from "react-router-dom";
//import logo from "../assets/chip-in-logo1.png"
import logo from "../assets/chipinlogo.png"

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUserContext } from '../UserContext';

import {HouseholdForm , Modal}  from './CreateHousehold'

export default function Navbar() {
  const { householdId } = useParams();
  const { user, households } = useUserContext();
  const navigate = useNavigate();

  // Implementing Modal for Creating a household
  const [showHouseholdForm, setShowHouseholdForm] = useState(false);
  // Function to open the modal
  const openModal = () => setShowHouseholdForm(true);
  // Function to close the modal
  const closeModal = () => setShowHouseholdForm(false);



  // User sign out, redirect to login page
  const signOut = () => {
    // Remove token
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div>
      <nav className="fixed min-w-48 h-screen mr-4 border-r-4 border-black flex flex-col justify-between items-center">
        <NavLink to="/">
          <img alt="ChipIn logo" className="inline" src={logo} style={{ height: '8rem', width: 'auto' }}></img>
        </NavLink>

        <div onClick={signOut}
            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" >
          Sign Out
        </div>

        <div className="flex flex-col justify-between items-center">
          {households.length > 0 &&
            <div className="flex flex-col justify-between items-center">
              <NavLink to={`/households/${householdId ? householdId : households[0].id}/home`}
                  style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                  className="p-3">
                Home
              </NavLink>
              <NavLink to={`/households/${householdId ? householdId : households[0].id}/dashboard`}
                  style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                  className="p-3">
                Dashboard
              </NavLink>
              <NavLink to={`/households/${householdId ? householdId : households[0].id}/my-expenses`}
                  style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                  className="p-3">
                My Expenses
              </NavLink>
              <NavLink to={`/households/${householdId ? householdId : households[0].id}/recipes`}
                  style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                  className="p-3">
                Recipes
              </NavLink>
            </div>
          }
          {/*<NavLink
              to={`/households/1/`}
              state={{ householdName: "Basement Dwellers", userId: userId }}
                style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                className="p-3">
              Basement Dwellers
            </NavLink>
          */}
        </div>

        <div className="border-t-4">
          <div className="my-2 flex justify-center items-center">
            <h1 className="mr-2">Households</h1>
            <button 
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
                transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
                onClick={openModal} >
              +
            </button>
            <Modal show={showHouseholdForm} onClose={closeModal}>
              <HouseholdForm onClose={closeModal} /> {/* Render HouseholdForm inside the Modal */}
            </Modal>
          </div>
          <div className="flex flex-col justify-between items-center h-1/3">
            {
              households.map((household) => {
                return (
                  <NavLink to={`/households/${household.id}`} 
                      key={household.id}
                      style={({ isActive }) => ({ color: isActive ? 'white' : 'black', backgroundColor: isActive ? 'black' : 'transparent' })}
                      className="p-3">
                    {household.name}
                  </NavLink>
                );
              })
            }
          </div>
        </div>

        <NavLink to={`/profile/${user?.id}`}
            className="w-full h-16 flex justify-center items-center bg-black text-white">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}