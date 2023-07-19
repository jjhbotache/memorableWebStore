// import the order json mock
import { useEffect, useState } from "react";
import "./PucharseOrderCard.css";
import order from "../../mocks/order.json";
import { apiRoute } from "../../const/const";
import { setRequestConfig } from "../../functions/functions";

import "./PucharseOrderCard.css";
import Spinner from "../spinner/spinner";
import Modal from "../modal/modal";

export default function PucharseOrderCard({order,onEdit,onDelete}){
  const [design, setDesign] = useState({});
  const [realDesign, setRealDesign] = useState({});
  const [user, setUser] = useState({});

  

  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  console.log(order);


  useEffect(() => {
    const main = async ()=>{
      setLoading(true);
      const [designData, realDesignData, userData] = await Promise.all([
        order.id_design ? fetch(apiRoute + "/read/designs/" + order.id_design, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_real_design ? fetch(apiRoute + "/read/real_designs/" + order.id_real_design, setRequestConfig()).then(re => re.json()).then(rd => rd[0]) : {},
        fetch(apiRoute + "/read/users/" + order.id_user, setRequestConfig()).then(re => re.json()).then(rd => rd[0])
      ]);
      setLoading(false)
      setDesign(designData);
      setRealDesign(realDesignData);
      setUser(userData);
    }
    main()
  }, []);


  return !deleted?
    (
    !loading?
      <div className="col-12 col-sm-5 col-md-4 h-100">
        <div className="card">
          <div className="card-body">
          <div className=" card-img p-3">
            {(realDesign.img || design.img)&&
            <img className=" img-fluid p-2 rounded-4" src={ apiRoute +"/" +(realDesign.img || design.img) +"/" + localStorage.getItem("token")} alt="Has no image" />
            }
          </div>
            <h5 className="card-title mb-3">{order.id + ") " + ( design.name || realDesign.name || "has no design")}</h5>
            <p className="card-text mb-0"> <strong>Customer: &nbsp;</strong> {user.first_name + " " + user.last_name}</p>
            <p className="card-text mb-0"> <strong>Designed: &nbsp;</strong> {order.id_real_design?"✅":"❌"}</p>
            <p className="card-text"> <strong>Paid: &nbsp;</strong> {order.paid==0?"❌":"✅"}</p>
            <div className="d-flex">
              <button type="button" className="btn poc-f" onClick={()=>{
                onEdit({
                order:order,
                design:design,
                realDesign:realDesign,
                user:user
              })}}>edit</button>
              <button type="button" className="btn btn-dark poc-l" onClick={e=>{onDelete(order)}}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    :
    <Spinner></Spinner>
    )
    :
    (null)
  
};
