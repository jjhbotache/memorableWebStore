import { useEffect, useState, useRef } from "react";
import { apiRoute, getOptionsForSelect, setRequestConfig } from "../../const/const";
import Spinner from "../../components/spinner/spinner";
import PucharseOrderCard from "../../components/pucharseOrderCard/PucharseOrderCard";
import Modal from "../../components/modal/modal";
import EditModalSelect from "../../components/editModalSelect/EditModalSelect";

export default function PucharseOrdersAdmin() {
  const [pucharseOrders, setPucharseOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [orderInEditModal, setOrderInEditModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

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
      const fecha = new Date(fechaString);
      const valorInputDate = fecha.toISOString().split("T")[0];
      return valorInputDate;
    }
    // ---------------------------------------------------------------------------------------------------------
    // console.log("data",data);
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
      const [wine, primaryColor, secondaryColor, msg] = await Promise.all([
        order.id_wine ? fetch(apiRoute + "/read/wine_kinds/" + order.id_wine, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_packing_color ? fetch(apiRoute + "/read/packing_colors/" + order.id_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_secondary_packing_color ? fetch(apiRoute + "/read/secondary_packing_colors/" + order.id_secondary_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_msg ? fetch(apiRoute + "/read/msgs/" + order.id_msg, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
      ]);
      const date = getDateFromStrign(order.delivery_date);
  
  
      const orderInfo = {
        id  : order.id,
        user  : user,
        design  : design,
        realDesign  : realDesign,
        wine  : wine,
        primaryColor  : primaryColor,
        secondaryColor  : secondaryColor,
        msg : order.msg,
        deliveryDate  : date,
        deliveryPlace : order.id_delivery_place,
        vaucher : order.id_vaucher,
        trulyPaid : order.truly_paid==1,
      }
      setOrderInEditModal(orderInfo)
    }
  }

  useEffect(() => {
    console.log(orderInEditModal);
    if (orderInEditModal) {
      setEditModal( 
      <Modal 
        title={`Edit Order #${orderInEditModal.id}`} 
        resolveFunction={(value)=>{updateData(value,orderInEditModal.id)}} 
        options={[{label:"Cancel",value:0}]}>
            <form className=" d-flex flex-column align-content-center justify-content-center w-100">
              {/* user */}
              <EditModalSelect label="User:" tableName="users" getOptionsForSelect={getOptionsForSelect} labelProperty="last_name" firstObj={orderInEditModal.user}/>
              {/* design */}
              <EditModalSelect label="Design: " tableName="designs" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={orderInEditModal.design}/>
              {/* real design */}
              <EditModalSelect label="Real Design: " tableName="real_designs" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={orderInEditModal.realDesign}/>
              {/* wine */}
              <EditModalSelect label="Wine: " tableName="wine_kinds" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={orderInEditModal.wine}/>
              {/* primaryColor */}
              <EditModalSelect label="Primary packing color:" tableName="packing_colors" getOptionsForSelect={getOptionsForSelect} labelProperty="color" firstObj={orderInEditModal.primaryColor}/>
              {/* secondaryColor */}
              <EditModalSelect label="secondary packing color:" tableName="secondary_packing_colors" getOptionsForSelect={getOptionsForSelect} labelProperty="color" firstObj={orderInEditModal.secondaryColor}/>
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
              {/* <EditModalSelect label="Adress:" tableName="addresses" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={order.adress}/> */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="deliveryPlace" className="form-label mb-0 align-baseline">Delivery place: </label>
                <input type="text" className="form-control p-0" value={orderInEditModal.deliveryPlace} onChange={e=>setOrderInEditModal({...orderInEditModal,deliveryPlace:e.target.value})} name="deliveryPlace" />
              </div>
              {/* vaucher */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="vaucher" className="form-label mb-0 align-baseline">Vaucher: </label>
                <img id="vaucherPreview" src={apiRoute + "/" + orderInEditModal.vaucher + `/${localStorage.getItem("token")}`} className="img-fluid rounded-top" alt="Img"/>
                <input type="file" className="form-control p-0" name="vaucher" onChange={
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
              <button type="submit" className="btn btn-dark mx-4">Submit</button>
            </form>
      </Modal>
      )
    }
  }, [orderInEditModal]);


  function updateData(data,idTable) {
    if (data==0) {
      setOrderInEditModal(false);
      return
    }
    console.log("updating");
    // update a pucharse order
    const formData = new FormData();

    // formData.append("user_id", userSelect.value);
    // formData.append("wine_id", wineSelect.value);
    // formData.append("real_design_id", realDesignSelect.value);
    // formData.append("amount", amountInput.value);
    // formData.append("msg", msgInput.value);
    // formData.append("primary_color_id", primaryColorSelect.value);
    // formData.append("secondary_color_id", secondaryColorSelect.value);
    // formData.append("delivery_date", dateInput.value);
    // formData.append("address", addressInput.value);
    // formData.append("oldVaucher", pucharseOrder.id_vaucher);
    // formData.append("vaucher", vaucherInput.files[0] || pucharseOrder.id_vaucher);
    // formData.append("truly_paid", trulyPaidCheckbox.checked);

    // for each property an its value, append it to the fromData
    Object.keys(data).forEach((property) => {
      formData.append(property, data[property]);
    })


    fetch(apiRoute + "/update_pucharse_orders/" + data[idTable], setRequestConfig("PUT", formData, true)).then((response) => response.json()).then((data) => {
      console.log(data);
      window.location.reload();
    }).catch((error) => {
      alert(error);
      console.error(error);
    });
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
            <button className="btn ">Add</button>
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
    :
    editModal
};
