import { NavLink } from "react-router-dom";
import logo from "../assets/chip-in-logo1.png"

export default function Navbar() {
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

        <div className="flex flex-col justify-between items-center h-2/5 bg-pink-100">
          <NavLink to="/home/:householdId"
              className="">
            Home
          </NavLink>
          <NavLink to="/dashboard/:householdId"
              className="">
            Dashboard
          </NavLink>
          <NavLink to="/my-expenses/:householdId/:userId"
              className="">
            My Expenses
          </NavLink>
          <NavLink to="/recipes/:householdId"
              className="">
            Recipes
          </NavLink>
        </div>
        <NavLink to="/profile/:userId"
            className="w-full h-16 flex justify-center items-center bg-black text-white">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}