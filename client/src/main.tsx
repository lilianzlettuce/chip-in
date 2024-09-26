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
import Profile from "./routes/Profile";
import ErrorPage from "./error-page";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App message="hello friend." />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <RecordList />
      },
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
    path: "/profile/:id",
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