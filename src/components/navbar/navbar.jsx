import React from "react";
import '../../styles/layout.css';
import '../../styles/config.css';
import "./navbar.css"
import { logout } from "../../functions/functions";


export default function Navbar({links,pathsWhereNotToDisplay}) {
  const pathname = window.location.pathname;
  const pagesToShow = links.map(link => {
    link.active = link.path === pathname;
    if (localStorage.getItem("id")&&link.path==="/loginAndRegister"){
      link.name="Dashboard"
      link.path=localStorage.getItem("password")?"/adminDashboard":"/userDashboard"
    }

    return(
<<<<<<< HEAD
      <li className={ obj.active ? "nav-item capitalize border-bottom border-danger px-2 shadow-sm" : "nav-item border-bottom border-white capitalize px-2" }>
        <a href={obj.path} className={ obj.active ? "nav-link active" : "nav-link" } >{obj.name}</a>
=======
      <li className="nav-item" key={link.path}>
        <a href={link.path} className={ link.active ? "nav-link active" : "nav-link" } >{link.name}</a>
>>>>>>> main
      </li>
  )})
return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md shadow">
          <div className="container-fluid">
<<<<<<< HEAD
            <a className="navbar-brand title memorable-title px-1" href="#">Memorable</a>
=======
            <a className="navbar-brand" href="/">Navbar</a>
>>>>>>> main

            <button className="navbar-toggler bg-light p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon bg-light"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 pb-0">
                {pagesToShow}
              </ul>
<<<<<<< HEAD
=======
              {
                localStorage.getItem("id")&&<a onClick={logout} className="nav-link" style={{ color: 'rgb(164 1 1)' }}>Logout</a>
              }

              
>>>>>>> main
            </div>

          </div>
      </nav>
  );
}
