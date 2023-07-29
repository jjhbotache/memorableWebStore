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
import AddressesViewer from "../pages/addressesViewer/addressesViewer";
import AddressUserAdmin from "../pages/addressUserAdmin/addressUserAdmin";
import { Outlet } from "react-router-dom";
import { catalogPath } from "../const/const";
import ShoppingCart from "../pages/shoppingCart/shoppingCart";
import { loader } from "../functions/functions";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: (
  //     <>
  //       <h1>holi</h1>
  //       <Outlet/>
  //     </>
  //   ),
  //   loader:()=> {
  //     const permissions = "public";
  //     if (permissions==="public") {
  //       window.location.assign(catalogPath);
  //     }
  //     return null
  //   },
  //   children: [
  //     { 
  //       index:true,
  //       element: <LandingPage/> 
  //     },
  //   ],
  //   // use children property
  // },
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
    loader:loader({name:"user",adminLevel:1})
  },
  {
    path: "/adminDashboard",
    element: <AdminDashboard/>,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/customiseBottle/:id?",
    element: <CustomiseBottle/>,
  },
  {
    path: "/buyNow",
    element: <BuyNow/>,
  },
  {
    path: "/shippingAndPayement/:cart?",
    element: <ShippingAndPayement/> ,
  },
  {
    path: "/pucharseOrdersAdmin",
    element: <PucharseOrdersAdmin/>,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/designsAdmin",
    element: <DesignsAdmin/>,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/realDesignsAdmin",
    element: <RealDesignsAdmin/> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/winesAdmin",
    element: <DataAdmin title="Wines admin" tableToAdmin="wine_kinds" /> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/primaryColorsAdmin",
    element: <DataAdmin title="Primary colors admin" tableToAdmin="packing_colors" onDisplayProperty="color" /> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/secondaryColorsAdmin",
    element: <DataAdmin title="Secondary colors admin" tableToAdmin="secondary_packing_colors" onDisplayProperty="color" /> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/tagsAdmin",
    element: <DataAdmin title="Tags admin" tableToAdmin="tags" /> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/usersAdmin",
    element: <DataAdmin title="Users admin" tableToAdmin="users" onDisplayProperty="last_name" propertiesToSearch={["first_name"]} customOrderToModal={['id', 'first_name', 'last_name', 'email', 'phone', 'password',]}/> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/otherAdmins",
    element: <OtherAdmins/> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/addressesViewer/:id?",
    element: <AddressesViewer/> ,
    loader:loader({name:"admin",adminLevel:2})
  },
  {
    path: "/addressUserAdmin",
    element: <AddressUserAdmin/> ,
    loader:loader({name:"user",adminLevel:1})
  },
  {
    path: "/shoppingCart",
    element: <ShoppingCart/> ,
  },
  {
    path: "*",
    element: <h1>page not found</h1>,
  },
]);


export default router;