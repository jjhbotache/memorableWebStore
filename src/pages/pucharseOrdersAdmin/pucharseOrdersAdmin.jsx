import { useEffect, useState, useRef } from "react";
import { addresesViewerPath, apiRoute, pucharseOrdersAdminPath } from "../../const/const";
import {copyToClipboard, loadPreview, setRequestConfig} from "../../functions/functions"
import Spinner from "../../components/spinner/spinner";
import PucharseOrderCard from "../../components/pucharseOrderCard/PucharseOrderCard";
import Modal from "../../components/modal/modal";
import EditModalSelect from "../../components/editModalSelect/EditModalSelect";
import { Link, useNavigate } from "react-router-dom";

export default function PucharseOrdersAdmin() {
  const navigate = useNavigate(); 

  const [pucharseOrders, setPucharseOrders] = useState([]);
  const [pucharseOrdersRendered, setPucharseOrdersRendered] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [orderInEditModal, setOrderInEditModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const oldVaucher = useRef(null);  
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const preview = useRef();
  
  



  useEffect(() => {
    setLoadingData(true)
    fetch(apiRoute + "/read/pucharse_orders", setRequestConfig("GET")).then((response) => response.json()).then((pucharseOrders) => {
      console.log(pucharseOrders);
      setPucharseOrders(pucharseOrders)
      setPucharseOrdersRendered(pucharseOrders)
        
    }
    ).catch((error) => {
      console.log(error);
    }).finally(
      setLoadingData(false)
    )
  }, []);

  useEffect(() => { 
    // filter the orders by its name and set orderInEditModal the result
    console.log("search",search);
    console.log("pucharseOrders",pucharseOrders);
    
    // !(search=="") && 
    async function setFilteredFunctions() {
      const ordersEncountered = [];
      for (const order of pucharseOrders) {
        const [first_name,last_name,designName] = await Promise.all([
          fetch(apiRoute + `/read/users/${order.id_user}/first_name` , setRequestConfig()).then(re => re.json()).then(d => d[0]),
          fetch(apiRoute + `/read/users/${order.id_user}/last_name` , setRequestConfig()).then(re => re.json()).then(d => d[0]),
          fetch(apiRoute + `/read/designs/${order.id_design}/name` , setRequestConfig()).then(re => re.json()).then(d => d[0]),
        ])
        // if the search is inclued by any of the parameters, incluidem in a new array
        if (first_name.first_name.toLowerCase().includes(search.toLowerCase()) ||
            last_name.last_name.toLowerCase().includes(search.toLowerCase()) ||
            designName.name.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toString().includes(search.toLowerCase())
            ) {
          ordersEncountered.push(order)
        }
      }
      // console.log(ordersEncountered);
      return ordersEncountered
    }
    setFilteredFunctions().then(orders=> setPucharseOrdersRendered(orders))
    }, [search]);


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
      const [wine, primaryColor, secondaryColor, deliveryPlace] = await Promise.all([
        order.id_wine ? fetch(apiRoute + "/read/wine_kinds/" + order.id_wine, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_packing_color ? fetch(apiRoute + "/read/packing_colors/" + order.id_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_secondary_packing_color ? fetch(apiRoute + "/read/secondary_packing_colors/" + order.id_secondary_packing_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
        order.id_delivery_place ? fetch(apiRoute + "/read/addresses/" + order.id_delivery_place, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
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
        deliveryPlace : deliveryPlace,
        price : order.price,
        vaucher : order.id_vaucher,
        trulyPaid : order.paid==1,
      }
      oldVaucher.current = orderInfo.vaucher;
      setOrderInEditModal(orderInfo)
    }
  }

  useEffect(() => {
    if (orderInEditModal) {
      const editingOrder = !!orderInEditModal.id;
      setEditModal( 
      <Modal 
        title={editingOrder?`Edit Order #${orderInEditModal.id}`:"Add Order"} 
        resolveFunction={value=>{
          setOrderInEditModal(false)
          setEditModal(null)
          setSearch("")
        }} 
        options={[{label:"Exit",value:0}]}>
            <form className=" d-flex flex-column align-content-center justify-content-center w-100" onSubmit={editorModalSubmited}>
              {/* user */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,user:obj})} label="User:" tableName="users" labelProperty="last_name" firstObj={orderInEditModal.user}/>
              {/* design */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,design:obj})} label="Design: " tableName="designs" labelProperty="name" firstObj={orderInEditModal.design}/>
              {/* real design */}
              <EditModalSelect optional onChangeValue={obj=>{
                console.log(obj);
                setOrderInEditModal({...orderInEditModal,realDesign:obj})
              }} label="Real Design: " tableName="real_designs" labelProperty="name" firstObj={orderInEditModal.realDesign}/>
              {/* amount */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="amount" className="form-label mb-0 align-baseline">Amount: </label>
                <input type="number" disabled={editingOrder} className="form-control mx-auto" name="amount" defaultValue={orderInEditModal.amount?undefined:1}  value={orderInEditModal.amount} onChange={(e)=>{setOrderInEditModal({...orderInEditModal,amount:e.target.value>=1?e.target.value:1})}} />
              </div>
              {/* wine */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,wine:obj})} label="Wine: " tableName="wine_kinds" labelProperty="name" firstObj={orderInEditModal.wine}/>
              {/* primaryColor */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,primaryColor:obj})} label="Primary packing color:" tableName="packing_colors" labelProperty="color" firstObj={orderInEditModal.primaryColor}/>
              {/* secondaryColor */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,secondaryColor:obj})} label="secondary packing color:" tableName="secondary_packing_colors" labelProperty="color" firstObj={orderInEditModal.secondaryColor}/>
              {/* msg */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="msg" className="form-label mb-0 align-baseline">Message: </label>
                <textarea disabled={editingOrder} type="textArea" className="form-control" name="msg" value={orderInEditModal.msg} onChange={(e)=>{setOrderInEditModal({...orderInEditModal,msg:e.target.value})}} rows={3} style={{resize:"none"}}></textarea>
              </div>
              {/* date */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
                <label htmlFor="msg" className="form-label mb-0 align-baseline">Date: </label>
                {/* <p className="m-0">{date}</p> */}
                <input disabled={editingOrder} type="date" className="form-control p-0" name="deliveryDate" value={orderInEditModal.deliveryDate} onChange={e=>setOrderInEditModal({...orderInEditModal,deliveryDate:e.target.value})} />
                {/* <small className="text-muted"> Choose a new delivery date</small> */}
              </div>
              {/* address */}
              {/* <EditModalSelect label="Adress:" tableName="addresses" labelProperty="name" firstObj={order.adress}/> */}
              <EditModalSelect readOnly={editingOrder} onChangeValue={obj=>setOrderInEditModal({...orderInEditModal,deliveryPlace:obj})} label="Address:" tableName="addresses" labelProperty="id" firstObj={orderInEditModal.deliveryPlace}>
                <Link to={addresesViewerPath+"?id="+orderInEditModal.deliveryPlace.id} target="_blank">See address details</Link>
              </EditModalSelect>
              
              {/* vaucher */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2" >
                <label htmlFor="vaucher" className="form-label mb-0 align-baseline">Vaucher: </label>
                <img ref={preview} src={apiRoute + "/get_file/" + orderInEditModal.vaucher + `/${localStorage.getItem("token")}`} className="img-fluid rounded-top" alt="Img"/>
                <input disabled={editingOrder} accept=".png" type="file" className="form-control p-0" name="vaucher" onChange={
                  (e)=>{
                    if (e.target.files[0]) {
                      setOrderInEditModal({...orderInEditModal,vaucher:e.target.files[0]})
                      loadPreview(preview,e)
                    }
                  }
                }/>
              </div>
              {/* price */}
              <div className="mb-3 d-flex flex-column align-content-center justify-content-center gap-2" >
                <label htmlFor="price" className="form-label mb-0 align-baseline">Price: </label>
                <input disabled={editingOrder} type="number" className="form-control p-0 d-block mx-auto" style={{minWidth:"200px"}} name="price" value={orderInEditModal.price} onChange={
                  (e)=>{setOrderInEditModal({...orderInEditModal,price:parseInt(e.target.value)})}
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

    // if editing...
    if (orderInEditModal.id) {
      if (confirm("Are you sure you want to update this order? Remeber that the user choose it's order and you are changing it.")) {
        
      }
      console.log("updating...");
      const formData = new FormData();
      formData.append("user_id", orderInEditModal.user.id);
      formData.append("wine_id", orderInEditModal.wine.id);
      formData.append("design_id", orderInEditModal.design.id);
      formData.append("real_design_id", orderInEditModal.realDesign?.id || null);
      formData.append("amount", orderInEditModal.amount);
      formData.append("msg", orderInEditModal.msg);
      formData.append("primary_color_id", orderInEditModal.primaryColor.id);
      formData.append("secondary_color_id", orderInEditModal.secondaryColor.id);
      formData.append("delivery_date", orderInEditModal.deliveryDate);
      formData.append("address", orderInEditModal.deliveryPlace.id);
      formData.append("oldVaucher", oldVaucher.current);
      formData.append("vaucher",  orderInEditModal.vaucher instanceof File?orderInEditModal.vaucher:oldVaucher.current);
      formData.append("truly_paid", orderInEditModal.trulyPaid?1:0);
      console.log(orderInEditModal.user);
      setLoading(true);
      fetch(apiRoute + "/update_pucharse_orders/" + orderInEditModal.id, setRequestConfig("PUT", formData, true)).then((response) => response.json()).then((data) => {
        console.log(data);
        setSearch("")

        const infoStr = 
        "Name: " + orderInEditModal.user.first_name + " " + orderInEditModal.user.last_name +
        "\nEmail: " + orderInEditModal.user.email +
        "\nPhone: " + orderInEditModal.user.phone;
        // const infoStr = 
        // `Name: ${orderInEditModal.user.first_name} ${orderInEditModal.user.last_name}
        // Email: ${orderInEditModal.user.email}
        // Phone: ${orderInEditModal.user.phone}`;
        console.log(infoStr);
        if(confirm("Order updated successfully\n this is the user info to notify him/her:\n" + infoStr + "\nDo u whant to copy the user info?")){
          copyToClipboard(infoStr)
        }
        navigate(pucharseOrdersAdminPath);
        
      }).catch((error) => {
        alert("check all the fields needed");
        console.error(error);
      }).finally(
        setLoading(false)
        );

    }else{
      console.log("creating...");
      console.log(orderInEditModal);
      const formData = new FormData();
      try {formData.append("user_id", orderInEditModal.user.id);
      } catch (error) {alert("An error occurred when appending 'user_id'", error);return}
      
      try {formData.append("wine_id", orderInEditModal.wine.id);
      } catch (error) {alert("An error occurred when appending 'wine_id'", error);return}
      
      try {formData.append("design_id", orderInEditModal.design.id);
      } catch (error) {alert("An error occurred when appending 'design_id'", error);return}
      
      try {formData.append("real_design_id", orderInEditModal.realDesign?.id || 0);
      } catch (error) {alert("An error occurred when appending 'real_design_id'", error);return}
      
      try {formData.append("amount", orderInEditModal.amount || 1);
      } catch (error) {alert("An error occurred when appending 'amount'", error);return}
      
      try {formData.append("msg", orderInEditModal.msg || "-");
      } catch (error) {alert("An error occurred when appending 'msg'", error);return}
      
      try {formData.append("primary_color_id", orderInEditModal.primaryColor.id);
      } catch (error) {alert("An error occurred when appending 'primary_color_id'", error);return}
      
      try {formData.append("secondary_color_id", orderInEditModal.secondaryColor.id);
      } catch (error) {alert("An error occurred when appending 'secondary_color_id'", error);return}
      
      try {if (!orderInEditModal.deliveryDate) throw new Error("No date");
        formData.append("delivery_date", orderInEditModal.deliveryDate);
      } catch (error) {alert("An error occurred when appending 'delivery_date'", error);return}
      
      try {if (!orderInEditModal.deliveryPlace.id) throw new Error("No address");
        formData.append("address", orderInEditModal.deliveryPlace.id);
      } catch (error) {alert("An error occurred when appending 'address'", error);return}
      
      try {if (!orderInEditModal.price) throw new Error("No Price");
        formData.append("price", orderInEditModal.price);
      } catch (error) {alert("An error occurred when appending 'price'", error);return}
      
      try {if (!orderInEditModal.vaucher) throw new Error("No vaucher");
        formData.append("vaucher", orderInEditModal.vaucher);
      } catch (error) {alert("An error occurred when appending 'vaucher'", error);return}
      
      try {formData.append("truly_paid", orderInEditModal.trulyPaid ? (orderInEditModal.trulyPaid ? 1 : 0) : 0);
      } catch (error) {alert("An error occurred when appending 'truly_paid'", error);return}
      
      // log each key-value pair
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      setLoading(true);
      fetch(apiRoute + "/create/pucharse_orders", setRequestConfig("POST", formData, true)).then((response) => response.json()).then((data) => {
        console.log(data);
        navigate(pucharseOrdesAdminPath);
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

  function deleteOrder (order){
    if (confirm(`Are you sure about deleting ${order.id} order?`)) {
      setLoading(true)
      fetch(apiRoute+"/erase/pucharse_orders/"+order.id,setRequestConfig("DELETE")).then(re=>re.json()).then(r=>{
        setPucharseOrdersRendered(pucharseOrders.filter(o=>o.id!=order.id))
        setPucharseOrders(pucharseOrders.filter(o=>o.id!=order.id))
        setSearch("")
        alert("order deleted successfully");
      })
      .catch(e=>{alert("there was an error deleting the order");console.log(e)})
      .finally(setLoading(false))
    }
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
                <input onChange={e=>{setSearch(e.target.value)}} value={search} type="text" className="form-control" aria-describedby="helpId" placeholder=""/>
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
        <div className="row h-100 d-flex justify-content-around gap-2 gap-sm-1">
          {
          loadingData?
          <Spinner></Spinner>
          :
          (pucharseOrdersRendered.map(pucharseOrder => <PucharseOrderCard key={pucharseOrder.id} order={pucharseOrder}onEdit={(data)=>{putInfoInModal(data)}} onDelete={order=>deleteOrder(order)}/>))
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
