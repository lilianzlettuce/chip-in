import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";

import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import MyExpenses from "./routes/MyExpenses";
import Recipes from "./routes/Recipes";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import ForgotPass from "./routes/ForgotPass";
import ErrorPage from "./error-page";
import VerifyCode from "./routes/VerifyCode";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgotpass",
    element: <ForgotPass />,
    errorElement: <ErrorPage />,
  },
  {
    path:"/verifycode",
    element: <VerifyCode />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <App message="this is an example of how to pass in a prop" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <RecordList />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ],
  },
  {
    path: "/households/:householdId",
    element: <App message="go sniff a muffin, you buffoon" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "my-expenses/:userId",
        element: <MyExpenses />
      },
      {
        path: "recipes",
        element: <Recipes />
      },
    ],
  },
  {
    path: "/profile/:userId",
    element: <Profile />,
    errorElement: <ErrorPage />,
    children: [
      {},
    ],
  },
  {
    path: "/edit/:id",
    element: <App message="i am the globglogabgalab" />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/create",
    element: <App  message="no"/>,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
]);

const root = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);