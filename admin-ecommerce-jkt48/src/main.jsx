import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Orders from "./pages/Orders.jsx";
import Transactions from "./pages/Transactions.jsx";
import Complaints from "./pages/Complaints.jsx";
import Chat from "./pages/Chat.jsx";
import NewsProduct from "./pages/NewsProduct.jsx";
import ProductVariants from "./pages/ProductVariants.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  },
  {
    path: "/complaints",
    element: <Complaints />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/news-product",
    element: <NewsProduct />,
  },
  {
    path: "/variants",
    element: <ProductVariants />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
