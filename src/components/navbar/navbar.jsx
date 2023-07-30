import React from "react";
import "./navbar.css"
import { logout } from "../../functions/functions";
import { adminDashboardPath, loginAndRegisterPath, shoppingCartPath, userDashboardPath } from "../../const/const";
import { Link, useNavigate } from "react-router-dom";


export default function Navbar({links,pathsWhereNotToDisplay}) {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const pagesToShow = links.map(link => {
    link.active = link.path === pathname;
    if (localStorage.getItem("id")&&link.path===loginAndRegisterPath){
      link.name="Dashboard"
      link.path=localStorage.getItem("password")?adminDashboardPath:userDashboardPath
    }

    return(
      <li className="nav-item d-flex justify-content-center" key={link.path}>
        <Link to={link.path} className={ (link.active ? "nav-link active" : "nav-link") + " w-100" } >{link.name}</Link>
      </li>
  )})
return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Memorable</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {pagesToShow}
                {(localStorage.getItem("id_shopping_cart") && !localStorage.getItem("password"))&&<li className="nav-item d-flex justify-content-center" > <Link to={shoppingCartPath} className="nav-link w-100">Shopping cart</Link></li>}
              </ul>
              {localStorage.getItem("id")&&<li className="nav-item d-flex justify-content-center" > <Link onClick={e=>navigate(logout())} className="nav-link text-danger">Logout</Link></li>}

              
            </div>

          </div>
      </nav>
  );
}
