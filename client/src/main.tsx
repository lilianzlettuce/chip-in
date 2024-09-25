/*import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)*/

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
//import Record from "./components/Record";
//import RecordList from "./components/RecordList";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    /*children: [
      {
        path: "/",
        element: <RecordList />,
      },
    ],*/
  },
  {
    path: "/edit/:id",
    element: <App />,
    /*children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],*/
  },
  {
    path: "/create",
    element: <App />,
    /*children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],*/
  },
]);

const root = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);