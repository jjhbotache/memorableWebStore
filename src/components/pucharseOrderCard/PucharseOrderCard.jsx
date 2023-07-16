// import the order json mock
import { useEffect, useState } from "react";
import "./PucharseOrderCard.css";
import order from "../../mocks/order.json";
import { apiRoute, setRequestConfig } from "../../const/const";
import "./PucharseOrderCard.css";
import Spinner from "../spinner/spinner";
import Modal from "../modal/modal";

export default function PucharseOrderCard({order,onEdit}){
  const [design, setDesign] = useState({});
  const [realDesign, setRealDesign] = useState({});
  const [user, setUser] = useState({});

  

  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);



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

  function deleteOrder (){
    if (confirm(`Are you sure about deleting ${order.id} order?`)) {
      setLoading(true)
      fetch(apiRoute+"/erase/pucharse_orders/"+order.id,setRequestConfig("DELETE")).then(re=>re.json()).then(r=>setDeleted(true))
      .catch(e=>{alert("there was an error deleting the order");console.log(e)})
      .finally(setLoading(false))
    }
  }

  return !deleted?
    (
    !loading?
      <div className="col-12 col-md-6 col-lg-4">
        <div className="card">
          <div className="card-body">
          <div className=" card-img p-1">
            {(realDesign.img || design.img)&&
            <img className=" img-fluid p-2 rounded-4" src={ apiRoute +"/" +(realDesign.img || design.img) +"/" + localStorage.getItem("token")} alt="Has no image" />
            }
          </div>
            <h5 className="card-title">{order.id + ") " + ( design.name || realDesign.name || "has no design")}</h5>
            <p className="card-text"> <strong>Customer: &nbsp;</strong> {user.first_name + " " + user.last_name}</p>
            <p className="card-text"> <strong>Paid: &nbsp;</strong> {order.paid==0?"❌":"✅"}</p>
            <div className="d-flex">
              <button type="button" className="btn poc-f" onClick={()=>{
                onEdit({
                order:order,
                design:design,
                realDesign:realDesign,
                user:user
              })}}>edit</button>
              <button type="button" className="btn btn-dark poc-l" onClick={deleteOrder}>Delete</button>
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
