import React from "react";
import '../../styles/layout.css';
import '../../styles/config.css';
import "./navbar.css"


export default function Navbar({links,pathsWhereNotToDisplay}) {
  const pathname = window.location.pathname;
  const pagesToShow = links.map((obj) => {
    obj.active = obj.path === pathname;
    return(
      <li className={ obj.active ? "nav-item capitalize border-bottom border-danger px-2 shadow-sm" : "nav-item border-bottom border-white capitalize px-2" }>
        <a href={obj.path} className={ obj.active ? "nav-link active" : "nav-link" } >{obj.name}</a>
      </li>
  )})
  return (
      pathsWhereNotToDisplay.includes(pathname)?
      null
      :<nav className="navbar navbar-expand-md shadow">
          <div className="container-fluid">
            <a className="navbar-brand title memorable-title px-1" href="#">Memorable</a>

            <button className="navbar-toggler bg-light p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon bg-light"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 pb-0">
                {pagesToShow}
              </ul>
            </div>

          </div>
      </nav>
  );
}
