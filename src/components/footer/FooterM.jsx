import React from "react";
import "./footer.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/SVG/logo-medium.svg";

const footer = () => {
  return (
    <footer className="fixed-bottom bg-light pt-2 bg-opacity-75">
      <section className="row">
        <div className="col-12 col-md-4 d-none d-md-block d-flex justify-content-center align-items-center">
          <img
            src={logo}
            className="img-fluid" // Agregamos la clase "img-fluid" para que la imagen sea responsive
            alt=""
            style={{
              width: "100%", // Aseguramos que la imagen ocupe todo el ancho del contenedor
              height: "100%", // Aseguramos que la imagen ocupe todo el alto del contenedor
            }}
          />
        </div>
        <div className="col-12 col-md-4 d-flex flex-column">
          <h4 className="text-center fs-1 title">About us</h4>
          <p className="fs-6 text-center mt-2">
            Empresa dedicada a la venta de botellas de vinos personalizados
          </p>
        </div>
        <div className="col-12 col-md-4 d-flex flex-column justify-content-center">
          <h4 className="text-center fs-1 title">Siguenos</h4>
          <div className="d-flex justify-content-around mt-3">
            <a href="https://www.facebook.com/profile.php?id=100064300652407">
              <FaFacebook
                className="cursor-pointer icon-social-media"
                size={40}
              />
            </a>
            <a href="">
              <FaInstagram
                className="cursor-pointer icon-social-media"
                size={40}
              />
            </a>
            <a href="">
              <FaWhatsapp
                className="cursor-pointer icon-social-media"
                size={40}
              />
            </a>
          </div>
        </div>
      </section>
      <section className="row">
        <div className="col-12 d-flex justify-content-center mt-2 bg-light">
          <small className="">
            &copy; 2023 <b>Memorable</b> - Todos los derechos reservados{" "}
          </small>
        </div>
      </section>
    </footer>
  );
};

export default footer;
