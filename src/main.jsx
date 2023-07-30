import React, { useRef } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

// import rthe provieder router
import { BrowserRouter, RouterProvider } from 'react-router-dom'
import router from './router/router'
import Navbar from './components/navbar/navbar'
import { catalogPath, customiseBottlePath, linksToShowInNavbar, whereNotToDisplay } from './const/const';



// if any img is clicked, open it in a new tab (not in catalog)
document.addEventListener('click', (e) => {
  // get the las part of the url
  const url = "/"+window.location.href.split('/').pop()
  if (e.target.tagName === 'IMG' && !(url==customiseBottlePath)) {
    window.open(e.target.src, '_blank')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={router}/>
  </>
)
