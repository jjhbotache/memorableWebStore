import { createBrowserRouter } from "react-router-dom";
import React from "react";
import LandingPage from "../pages/landingPage/landingPage";
import Catalog from "../pages/catalog/catalog";
import LoginAndRegister from "../pages/loginAndRegister/loginAndRegister";
import UserDashboard from "../pages/userDashboard/userDashboard";
import AdminDashboard from "../pages/adminDashboard/adminDashboard";
import CustomiseBottle from "../pages/customiseBottle/customiseBottle";
import BuyNow from "../pages/buyNow/buyNow";
import ShippingAndPayement from "../pages/shippingAndPayement/shippingAndPayement";

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
    path: "/loginAndRegister",
    element: <LoginAndRegister/>,
  },
  {
    path: "/userDashboard",
    element: <UserDashboard/>,
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboard/>,
  },
  {
    path: "/customiseBottle",
    element: <CustomiseBottle/>,
  },
  {
    path: "/buyNow",
    element: <BuyNow/> ,
  },
  {
    path: "/shippingAndPayement",
    element: <ShippingAndPayement/> ,
  },
  {
    path: "*",
    element: <h1>page not found</h1>,
  },

]);


export default router;