import { useState } from "react";
import { apiRoute, shippingAndPayementPath } from "../../const/const";
import "./buyNow.css";
import { useEffect } from "react";
import { ponerPuntos, setRequestConfig } from "../../functions/functions";

export default function BuyNow() {
  const order = JSON.parse(localStorage.getItem("order"));
  // get the design from the localStorage
  const {design} = order;
  
  const [price, setPrice] = useState();
  useEffect(() => {
    fetch(apiRoute + "/open-csv-data/bottle_price",setRequestConfig()).then(re=>re.json()).then(d=>{
      order.price = d.data*order.amount
      setPrice(d.data)
      }).catch(e=>console.log(e))
  }, []);


  return (
    <>
      <div className="container-sm mt-2 h-100" id="buyNow-container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Confirm your order</h1>
            <hr />
          </div>
        </div>
        <div className="row d-flex justify-content-center gap-4">
          <img src={apiRoute+"/get_file/"+design.img+"/-"} className="img-fluid rounded-4"/>
          <div className="text-center">
            <h1 >{design.name}</h1>
            <h2>$&nbsp;{price?ponerPuntos(price):"--.---"}</h2>
          </div>
          <button className="btn " onClick={()=>{window.location.assign(shippingAndPayementPath)}}>finish buy</button>
        </div>
      </div>
    </>
  )
};
