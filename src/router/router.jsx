// create a router with two routes "about " "home"
import { createBrowserRouter } from "react-router-dom";
import React from "react";
import LandingPage from "../pages/landingPage/landingPage";
import Catalog from "../pages/catalog/catalog";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
  },
  {
    path: "/catalog",
    element: <Catalog/>,
  },
  {
    path: "*",
    element: <h1>page not found</h1>,
  },
]);


export default router;