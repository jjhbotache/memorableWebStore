import { useEffect } from "react";
import { apiRoute, setRequestConfig } from "../../const/const";

export default function PucharseOrdersAdmin(params) {
  // useEffect(() => {
  //   fetch(apiRoute + "/read/pucharse_orders", setRequestConfig("GET")).then((response) => response.json()).then((pucharseOrders) => {
  //     console.log(pucharseOrders);
  //   }
  //   )
  // }, []);

  return (
    <div>
      <h1>PucharseOrdersAdmin</h1>
      <div className="container">
        <hr />  
        <div className="row justify-content-center align-items-center ">
          <div className="col-9 ">
            <div className="row">
              <div className="col-10">
                <input type="text" className="form-control" aria-describedby="helpId" placeholder=""/>
              </div>
              <div className="col-2 d-flex justify-content-center align-content-center">
                <i className="fi fi-br-search d-grid align-items-center"></i>
              </div>
            </div>
          </div>
          <div className="col-3">
            <button className="btn ">Add</button>
          </div>
        </div>
        <div className="row">
          
        </div>
      </div>
    </div>
  )  
};
