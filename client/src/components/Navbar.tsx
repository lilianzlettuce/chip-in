import { NavLink } from "react-router-dom";
import logo from "../assets/chip-in-logo1.png"

import { useParams } from 'react-router-dom';

export default function Navbar() {
  const { householdId, userId } = useParams();
  console.log(`${householdId}, ${userId}`);

  return (
    <div>
      <nav className="fixed min-w-48 h-screen mr-4 border-r-4 border-black flex flex-col justify-between items-center">
        <NavLink to="/">
          <img alt="ChipIn logo" className="h-20 inline" src={logo}></img>
        </NavLink>

        <NavLink to="/create"
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" >
          Create Employee
        </NavLink>

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