import { apiRoute, shippingAndPayementPath } from "../../const/const";
import "./buyNow.css";

export default function BuyNow() {
  // get the design from the localStorage
  const {design} = JSON.parse(localStorage.getItem("order"));


  return (
    <>
      <div className="container-sm mt-2 h-100" id="buyNow-container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Confirm your order</h1>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <img src={apiRoute+"/"+design.img+"/-"} className="img-fluid rounded-4"/>
          </div>
          <div className="col-12">
            <h1 className="text-center">{design.name}</h1>
          </div>
        </div>
        <div className="row last-row">
          <div className="col-12 d-grid align-items-center  justify-content-center">
            <button className="btn" onClick={()=>{window.location.assign(shippingAndPayementPath)}}>finish buy</button>
          </div>
        </div>
      </div>
    </>
  )
};
