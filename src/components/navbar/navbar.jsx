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
      <li className={ link.active ? "nav-item capitalize border-bottom border-danger px-2" : "nav-item border-bottom border-white capitalize px-2" } key={link.path}>
        <a href={link.path} className={ link.active ? "nav-link active" : "nav-link" } >{link.name}</a>
      </li>
  )})
return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md shadow-lg">
          <div className="container-fluid">
            <a className="navbar-brand title px-2 px-sm-3" href="/">Memorable</a>

            <button className="navbar-toggler bg-light p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon bg-light"></span>
            </button>

            <div className="collapse navbar-collapse nav-links" id="navbarSupportedContent">
              <ul className="navbar-nav me-4 mx-4 pb-0 gap-3">
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
