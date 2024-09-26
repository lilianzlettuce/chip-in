import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";

import Root from "./routes/Root";
import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import MyExpenses from "./routes/MyExpenses";
import Recipes from "./routes/Recipes";
import Profile from "./routes/Profile";
import ErrorPage from "./error-page";

import "./index.css";

const router = createBrowserRouter([
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
    path: "/app",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {},
    ],
  },
  {
    path: "/home/:householdId",
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {},
    ],
  },
  {
    path: "/dashboard/:householdId",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {},
    ],
  },
  {
    path: "/my-expenses/:householdId/:userId",
    element: <MyExpenses />,
    errorElement: <ErrorPage />,
    children: [
      {},
    ],
  },
  {
    path: "/recipes/:householdId",
    element: <Recipes />,
    errorElement: <ErrorPage />,
    children: [
      {},
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