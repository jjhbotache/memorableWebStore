import React from "react";
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
      <li className="nav-item" key={link.path}>
        <a href={link.path} className={ link.active ? "nav-link active" : "nav-link" } >{link.name}</a>
      </li>
  )})
return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Navbar</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {pagesToShow}
              </ul>
              {
                localStorage.getItem("id")&&<a onClick={logout} className="nav-link" style={{ color: 'rgb(164 1 1)' }}>Logout</a>
              }

              
            </div>

          </div>
      </nav>
  );
}
