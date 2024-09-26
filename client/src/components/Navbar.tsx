import { NavLink } from "react-router-dom";
import logo from "../assets/chip-in-logo1.png"

export default function Navbar() {
  return (
    <div>
      <nav className="fixed h-screen p-6 mr-4 border-r-4 border-black flex flex-col justify-between items-center">
        <NavLink to="/">
          <img alt="ChipIn logo" className="h-20 inline" src={logo}></img>
        </NavLink>

        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background 
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" 
            to="/create">
          Create Employee
        </NavLink>
        <NavLink className="" 
            to="/household/:householdId">
          Household Name
        </NavLink>
        <NavLink className="" 
            to="/dashboard/:householdId">
          Dashboard
        </NavLink>
        <NavLink className="" 
            to="/household/:householdId/user/:userId">
          My Expenses
        </NavLink>
        <NavLink className="" 
            to="/recipes/:householdId">
          Recipes
        </NavLink>
        <NavLink className="" 
            to="/profile/:id">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}