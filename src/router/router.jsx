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
import PucharseOrdersAdmin from "../pages/pucharseOrdersAdmin/pucharseOrdersAdmin";
import DesignsAdmin from "../pages/designsAdmin/DesignsAdmin";
import RealDesignsAdmin from "../pages/realDesignsAdmin/realDesignsAdmin";
import DataAdmin from "../pages/dataAdmin/dataAdmin";
import OtherAdmins from "../pages/othersAdmin/otherAdmins";

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
    path: "/pucharseOrdersAdmin",
    element: <PucharseOrdersAdmin/>,
  },
  {
    path: "/designsAdmin",
    element: <DesignsAdmin/>,
  },
  {
    path: "/realDesignsAdmin",
    element: <RealDesignsAdmin/> ,
  },
  {
    path: "/winesAdmin",
    element: <DataAdmin title="Wines admin" tableToAdmin="wine_kinds" /> ,
  },
  {
    path: "/primaryColorsAdmin",
    element: <DataAdmin title="Primary colors admin" tableToAdmin="packing_colors" onDisplayProperty="color" /> ,
  },
  {
    path: "/secondaryColorsAdmin",
    element: <DataAdmin title="Secondary colors admin" tableToAdmin="secondary_packing_colors" onDisplayProperty="color" /> ,
  },
  {
    path: "/tagsAdmin",
    element: <DataAdmin title="Tags admin" tableToAdmin="tags" /> ,
  },
  {
    path: "/usersAdmin",
    element: <DataAdmin title="Users admin" tableToAdmin="users" onDisplayProperty="last_name" propertiesToSearch={["first_name"]} customOrderToModal={['id', 'first_name', 'last_name', 'email', 'phone', 'password',]}/> 
  },
  {
    path: "/otherAdmins",
    element: <OtherAdmins/> ,
  },
  {
    path: "*",
    element: <h1>page not found</h1>,
  },
]);


export default router;