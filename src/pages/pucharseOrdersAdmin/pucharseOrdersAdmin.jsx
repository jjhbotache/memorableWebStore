import { useEffect, useState, useRef } from "react";
import { apiRoute, setRequestConfig } from "../../const/const";
import Spinner from "../../components/spinner/spinner";
import PucharseOrderCard from "../../components/pucharseOrderCard/PucharseOrderCard";
import Modal from "../../components/modal/modal";
import EditModalSelect from "../../components/editModalSelect/EditModalSelect";

export default function PucharseOrdersAdmin() {
  const [pucharseOrders, setPucharseOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [orderInEditModal, setOrderInEditModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const oldVaucher = useRef(null);  
  const [loading, setLoading] = useState(false);

  
  



  useEffect(() => {
    setLoadingData(true)
    fetch(apiRoute + "/read/pucharse_orders", setRequestConfig("GET")).then((response) => response.json()).then((pucharseOrders) => {
      // console.log(pucharseOrders);
      setPucharseOrders(
        pucharseOrders.map(pucharseOrder => <PucharseOrderCard key={pucharseOrder.id} order={pucharseOrder}onEdit={(data)=>{putInfoInModal(data)}}
          />)
      )
    }
    ).catch((error) => {
      console.log(error);
    }).finally(
      setLoadingData(false)
    )
  }, []);

  async function putInfoInModal(data){
    
    function getDateFromStrign(fechaString) {
      try {
        const fecha = new Date(fechaString);
        const valorInputDate = fecha.toISOString().split("T")[0];
        return valorInputDate;
      } catch (error) {
        console.log(error);
        return fechaString;
      }
    }
    // ---------------------------------------------------------------------------------------------------------
    console.log("data",data);
    // console.log("orderInEditModal",orderInEditModal);
    if (!orderInEditModal) {
      
      // get the info from the raw data (data)
      // and put it in the modal
      const { order, user, design, realDesign } = data;

      // console.log("order",order);
      
      // make several promises at the same time
      // , deliveryDate
      // , paid
      // , vaucher
      const [wine, primaryColor, secondaryColor] = await Promise.all([
        order.id_wine ? fetch(apiRoute + "/read/wine_kinds/" + order.id_wine, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_packing_color ? fetch(apiRoute + "/read/packing_colors/" + order.id_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_secondary_packing_color ? fetch(apiRoute + "/read/secondary_packing_colors/" + order.id_secondary_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
      ]);
      const date = getDateFromStrign(order.delivery_date);
  
  
      const orderInfo = {
        id  : order.id,
        user  : user,
        design  : design,
        realDesign  : realDesign,
        amount  : order.amount,
        wine  : wine,
        primaryColor  : primaryColor,
        secondaryColor  : secondaryColor,
        msg : order.msg,
        deliveryDate  : date,
        deliveryPlace : order.id_delivery_place,
        vaucher : order.id_vaucher,
        trulyPaid : order.paid==1,
      }
      oldVaucher.current = orderInfo.vaucher;
      setOrderInEditModal(orderInfo)
    }
  }

  useEffect(() => {
    // so we need to set the editModal to null
    // so it can be closed


    if (orderInEditModal) {
      setEditModal( 
      <Modal 
        title={orderInEditModal.id?`Edit Order #${orderInEditModal.id}`:"Add Order"} 
        resolveFunction={value=>{
          setOrderInEditModal(false)
          setEditModal(null)
        }} 
        options={[{label:"Cancel",value:0}]}>
            <form className=" d-flex flex-column align-content-center justify-content-center w-100" onSubmit={editorModalSubmited}>
              {/* user */}
              <EditModalSelect onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,user:obj})} label="User:" tableName="users" labelProperty="last_name" firstObj={orderInEditModal.user}/>
              {/* design */}
              <EditModalSelect onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,design:obj})} label="Design: " tableName="designs" labelProperty="name" firstObj={orderInEditModal.design}/>
              {/* real design */}
              <EditModalSelect optional onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,realDesign:obj})} label="Real Design: " tableName="real_designs" labelProperty="name" firstObj={orderInEditModal.realDesign}/>
              {/* amount */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="amount" className="form-label mb-0 align-baseline">Amount: </label>
                <input type="number" className="form-control mx-auto" name="amount" value={orderInEditModal.amount} onChange={(e)=>{setOrderInEditModal({...orderInEditModal,amount:e.target.value>=1?e.target.value:1})}} />
              </div>
              {/* wine */}
              <EditModalSelect onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,wine:obj})} label="Wine: " tableName="wine_kinds" labelProperty="name" firstObj={orderInEditModal.wine}/>
              {/* primaryColor */}
              <EditModalSelect onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,primaryColor:obj})} label="Primary packing color:" tableName="packing_colors" labelProperty="color" firstObj={orderInEditModal.primaryColor}/>
              {/* secondaryColor */}
              <EditModalSelect onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,secondaryColor:obj})} label="secondary packing color:" tableName="secondary_packing_colors" labelProperty="color" firstObj={orderInEditModal.secondaryColor}/>
              {/* msg */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="msg" className="form-label mb-0 align-baseline">Message: </label>
                <textarea type="textArea" className="form-control" name="msg" value={orderInEditModal.msg} onChange={(e)=>{setOrderInEditModal({...orderInEditModal,msg:e.target.value})}} rows={3} style={{resize:"none"}}></textarea>
              </div>
              {/* date */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="msg" className="form-label mb-0 align-baseline">Date: </label>
                {/* <p className="m-0">{date}</p> */}
                <input type="date" className="form-control p-0" name="deliveryDate" value={orderInEditModal.deliveryDate} onChange={e=>setOrderInEditModal({...orderInEditModal,deliveryDate:e.target.value})} />
                {/* <small className="text-muted"> Choose a new delivery date</small> */}
              </div>
              {/* address */}
              {/* <EditModalSelect label="Adress:" tableName="addresses" labelProperty="name" firstObj={order.adress}/> */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="deliveryPlace" className="form-label mb-0 align-baseline">Delivery place: </label>
                <input type="text" className="form-control p-0" value={orderInEditModal.deliveryPlace} onChange={e=>setOrderInEditModal({...orderInEditModal,deliveryPlace:e.target.value})} name="deliveryPlace" />
              </div>
              {/* vaucher */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2" >
                <label htmlFor="vaucher" className="form-label mb-0 align-baseline">Vaucher: </label>
                <img id="vaucherPreview" src={apiRoute + "/" + orderInEditModal.vaucher + `/${localStorage.getItem("token")}`} className="img-fluid rounded-top" alt="Img"/>
                <input accept=".png" type="file" className="form-control p-0" name="vaucher" onChange={
                  (e)=>{
                    if (e.target.files[0]) {
                      setOrderInEditModal({...orderInEditModal,vaucher:e.target.files[0]})
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        document.getElementById("vaucherPreview").src = reader.result;
                      };
                      reader.readAsDataURL(e.target.files[0])
                    }
                  }
                }/>
              </div>
              {/* truly paid */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="trulyPaid" className="form-label mb-0 align-baseline">Truly paid: </label>
                <input type="checkbox" className="p-0" name="trulyPaid" checked={orderInEditModal.trulyPaid} onChange={e=>setOrderInEditModal({...orderInEditModal,trulyPaid:e.target.checked})} />
              </div>   
              {/* submit */}
              <button type="submit" className="btn btn-dark mx-4">{orderInEditModal.id?"Update":"Create"}</button>
            </form>
      </Modal>
      )
      console.log("orderInEditModal",orderInEditModal);
    }
  }, [orderInEditModal]);


  function editorModalSubmited(e) {
    e.preventDefault();

    if (orderInEditModal.id) {
      console.log("updating...");
      const formData = new FormData();
      formData.append("user_id", orderInEditModal.user.id);
      formData.append("wine_id", orderInEditModal.wine.id);
      formData.append("design_id", orderInEditModal.design.id);
      formData.append("real_design_id", orderInEditModal.realDesign.id || null);
      formData.append("amount", orderInEditModal.amount);
      formData.append("msg", orderInEditModal.msg);
      formData.append("primary_color_id", orderInEditModal.primaryColor.id);
      formData.append("secondary_color_id", orderInEditModal.secondaryColor.id);
      formData.append("delivery_date", orderInEditModal.deliveryDate);
      formData.append("address", orderInEditModal.deliveryPlace);
      formData.append("oldVaucher", oldVaucher.current);
      formData.append("vaucher",  orderInEditModal.vaucher instanceof File?orderInEditModal.vaucher:oldVaucher.current);
      formData.append("truly_paid", orderInEditModal.trulyPaid?1:0);

      setLoading(true);
      fetch(apiRoute + "/update_pucharse_orders/" + orderInEditModal.id, setRequestConfig("PUT", formData, true)).then((response) => response.json()).then((data) => {
        console.log(data);
        window.location.reload();
      }).catch((error) => {
        alert(error);
        console.error(error);
      }).finally(
        setLoading(false)
      );

    }else{
      console.log("creating...");
      const formData = new FormData();
      try {
        formData.append("user_id", orderInEditModal.user.id);
        formData.append("wine_id", orderInEditModal.wine.id);
        formData.append("design_id", orderInEditModal.design.id);
        formData.append("real_design_id", orderInEditModal.realDesign?.id || 0);
        formData.append("amount", orderInEditModal.amount || 1);
        formData.append("msg", orderInEditModal.msg || "-");
        formData.append("primary_color_id", orderInEditModal.primaryColor.id);
        formData.append("secondary_color_id", orderInEditModal.secondaryColor.id);
        if (!orderInEditModal.deliveryDate) throw new Error("No date")
        formData.append("delivery_date", orderInEditModal.deliveryDate);
        if (!orderInEditModal.deliveryPlace) throw new Error("No address")
        formData.append("address", orderInEditModal.deliveryPlace);
        if (!orderInEditModal.vaucher) throw new Error("No vaucher")
        formData.append("vaucher",  orderInEditModal.vaucher);
        formData.append("truly_paid", orderInEditModal.trulyPaid? (orderInEditModal.trulyPaid?1:0) : 0);
      } catch (error) {
        console.log(error);      
        alert("Your are missing a field")
        return
      }
      // log each key-value pair
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      setLoading(true);
      fetch(apiRoute + "/create/pucharse_orders", setRequestConfig("POST", formData, true)).then((response) => response.json()).then((data) => {
        console.log(data);
        window.location.reload();
      } 
      ).catch((error) => {
        console.error(error);
        alert("No valid vaucher");
      }
      ).finally(
        setLoading(false)
      );

    }
    return
  }



  return !orderInEditModal?
    <div>
      <h1 className="fs-4">Pucharse Orders Admin</h1>
      <div className="container">
        <hr />  
        <div className="row mb-3 justify-content-center align-items-center ">
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
            <button onClick={e=>setOrderInEditModal({})} className="btn ">Add</button>
          </div>
        </div>
        <div className="row  gap-2">
          {
          loadingData?
          <Spinner></Spinner>
          :
          (pucharseOrders)
          }
        </div>
      </div>
    </div>
    :loading?
    <div className="mt-2">
      <Spinner></Spinner>
    </div>
    :
    editModal
};
