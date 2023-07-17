import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import rthe provieder router
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import router from './router/router'
import Navbar from './components/navbar/navbar'
import { linksToShowInNavbar, whereNotToDisplay } from './const/const';




ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Navbar links={linksToShowInNavbar} pathsWhereNotToDisplay={whereNotToDisplay} />
    <RouterProvider router={router}/>
  </>
)
