import React from "react";
import "./navbar.css"


export default function Navbar({links,pathsWhereNotToDisplay}) {
  const pathname = window.location.pathname;
  const pagesToShow = links.map((obj) => {
    obj.active = obj.path === pathname;
    return(
      <li className="nav-item" key={obj.path}>
        <a href={obj.path} className={ obj.active ? "nav-link active" : "nav-link" } >{obj.name}</a>
      </li>
  )})
  return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Navbar</a>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {pagesToShow}
              </ul>

              
            </div>

          </div>
      </nav>
  );
}
