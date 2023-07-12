import ReactDOM from "react-dom/client";

import "./index.css";

import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard/Dashboard";
import Home from "./Home";
import App from "./App";
import News from "./News";
import CategorySelector from "./HOC/CategorySelector";
import Admin from "./Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/news/:id",
        element: <News />,
      },
      {
        path: "/categories",
        element: <CategorySelector />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
