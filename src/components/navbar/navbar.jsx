import React from "react";
import "../../styles/layout.css";
import "../../styles/config.css";
import "./navbar.css";
import { logout } from "../../functions/functions";
import { shoppingCartPath } from "../../const/const";

export default function Navbar({ links, pathsWhereNotToDisplay }) {
  const pathname = window.location.pathname;
  const pagesToShow = links.map((link) => {
    link.active = link.path === pathname;
    if (localStorage.getItem("id") && link.path === "/loginAndRegister") {
      link.name = "Dashboard";
      link.path = localStorage.getItem("password")
        ? "/adminDashboard"
        : "/userDashboard";
    }

    return (
      /* nav-item capitalize border-bottom border-danger px-2" : "nav-item border-bottom border-white capitalize px-2 */
      <li
        className="nav-item d-flex justify-content-center border-bottom text-capitalize rounded-bottom-4"
        key={link.path}
        style={{ width: "100%" }}
      >
        <a
          href={link.path}
          className={
            (link.active
              ? "nav-link active bg-white"
              : "nav-link") + " px-4 rounded-4"
          }
          style={{ width: "100%" }}
        >
          {link.name}
        </a>
      </li>
    );
  });
  return pathsWhereNotToDisplay.includes(pathname) ? null : (
    <nav className="navbar navbar-expand-md shadow-lg">
      <div className="container-fluid">
        <a className="navbar-brand title px-2 px-sm-3" href="/">
          Memorable
        </a>

        <button
          className="navbar-toggler bg-light p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon bg-light"></span>
        </button>

        <div
          className="collapse navbar-collapse nav-links"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-4 mx-4 pb-0 bg-white bg-opacity-25 rounded-4">
            {pagesToShow}
            {localStorage.getItem("id_shopping_cart") && (
              <li className="nav-item d-flex justify-content-center">
                {" "}
                <a href={shoppingCartPath} className="nav-link w-100">
                  Shopping cart
                </a>
              </li>
            )}
            {localStorage.getItem("id") && (
              <li className="nav-item d-flex justify-content-center">
                {" "}
                <a
                  onClick={logout}
                  className="nav-link w-100"
                  style={{ color: "rgb(164 1 1)" }}
                >
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
