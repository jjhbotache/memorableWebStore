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
import { catalogPath, linksToShowInNavbar, whereNotToDisplay } from "../const/const";
import ShoppingCart from "../pages/shoppingCart/shoppingCart";
import RoutesLocker from "../components/routesLocker/routesLocker";
import Navbar from "../components/navbar/navbar";
import { useNavigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <RoutesLocker/>
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <LandingPage/>
      }
    ]
  },
  {
    path: "/catalog",
    element: <>
      <RoutesLocker/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <Catalog/>
      }
    ]
  },
  {
    path: "/loginAndRegister/:id?",
    element: <>
      <RoutesLocker/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <LoginAndRegister/>
      }
    ]
  },
  {
    path: "/userDashboard",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"user",adminLevel:1}} />
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <UserDashboard/>
      }
    ]
  },
  {
    path: "/adminDashboard",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"user",adminLevel:1}} />
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <AdminDashboard/>
      }
    ]
  },
  {
    path: "/customiseBottle/:id?",
    element: <>
      <RoutesLocker />
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <CustomiseBottle/>
      }
    ]
  },
  {
    path: "/buyNow",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"user",adminLevel:1}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <BuyNow/>
      }
    ]
  },
  {
    path: "/shippingAndPayement/:cart?",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"user",adminLevel:1}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <ShippingAndPayement/>
      }
    ]
  },
  {
    path: "/pucharseOrdersAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <PucharseOrdersAdmin/>
      }
    ]
  },
  {
    path: "/designsAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <DesignsAdmin/>
      }
    ]
  },
  {
    path: "/realDesignsAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </>,
    children: [
      {
        index:true,
        element: <RealDesignsAdmin/>
      }
    ]
  },
  {
    path: "/winesAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element:<DataAdmin title="Wines admin" tableToAdmin="wine_kinds" />
      }
    ]
  },
  {
    path: "/primaryColorsAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <DataAdmin title="Primary colors admin" tableToAdmin="packing_colors" onDisplayProperty="color" /> ,
      }
    ]
  },
  {
    path: "/secondaryColorsAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <DataAdmin title="Secondary colors admin" tableToAdmin="secondary_packing_colors" onDisplayProperty="color" /> ,
      }
    ]
  },
  {
    path: "/tagsAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <DataAdmin title="Tags admin" tableToAdmin="tags" /> ,
      }
    ]
  },
  {
    path: "/usersAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <DataAdmin title="Users admin" tableToAdmin="users" onDisplayProperty="last_name" propertiesToSearch={["first_name"]} customOrderToModal={['id', 'first_name', 'last_name', 'email', 'phone', 'password',]}/> ,
      }
    ]
  },
  {
    path: "/otherAdmins",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <OtherAdmins/> ,
      }
    ]
  },
  {
    path: "/addressesViewer/:id?",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element: <AddressesViewer/> ,
      }
    ]
  },
  {
    path: "/addressUserAdmin",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"admin",adminLevel:2}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children: [
      {
        index:true,
        element:<AddressUserAdmin/> ,
      }
    ]
  },
  {
    path: "/shoppingCart",
    element: <>
      <RoutesLocker permissionsNeeded={{name:"user",adminLevel:1}}/>
      <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
      <Outlet/>
    </> ,
    children:[
      {
        index:true,
        element: <ShoppingCart/>
      }
    ]
  },
  {
    path: "*",
    loader: () => {
      window.location.href = "/"
    },
  },
]);


export default router;