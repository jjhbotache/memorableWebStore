import { useEffect, useState } from "react";
import { apiRoute, setRequestConfig } from "../../const/const";
import Spinner from "../../components/spinner/spinner";
import PucharseOrderCard from "../../components/pucharseOrderCard/PucharseOrderCard";
import Modal from "../../components/modal/modal";
import EditModalSelect from "../../components/editModalSelect/EditModalSelect";

export default function PucharseOrdersAdmin() {
  const [pucharseOrders, setPucharseOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    setLoadingData(true)
    fetch(apiRoute + "/read/pucharse_orders", setRequestConfig("GET")).then((response) => response.json()).then((pucharseOrders) => {
      // console.log(pucharseOrders);
      setPucharseOrders(
        pucharseOrders.map(pucharseOrder => <PucharseOrderCard key={pucharseOrder.id} 
          order={pucharseOrder}
          onEdit={(data)=>{putInfoInModal(data)}}
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
    function getOptionsForSelect(select,labelProperty,valueProperty="id",idsToFilter=[]) {
      // console.log("select",select
      // ,"\nlabelProperty",labelProperty
      // ,"\nvalueProperty",valueProperty
      // ,"\nidsToFilter",idsToFilter);
      
      const table = select.name
      const options = Array.from(select.querySelectorAll("option"));
      // if the number of options are more than 1, do this
      // select each option of the select

      if (!(options.length>1)) {
        fetch(apiRoute + "/read/"+table,setRequestConfig()).then(response=>response.json()).then((listOfObjs) => {
          console.log(listOfObjs);
          listOfObjs.forEach(obj => {
            console.log(valueProperty);
            if (idsToFilter.includes(obj[valueProperty])) return
            select.innerHTML += `<option value="${obj[valueProperty]}">${obj[labelProperty]}</option>`
          });
        })
      }

    }

    const {order,user,design,realDesign} = data

    // make several promises at the same time
    // , deliveryDate
    // , paid
    // , vaucher
    const [wine, primaryColor, secondaryColor, msg] = await Promise.all([
      order.id_wine ? fetch(apiRoute + "/read/wine_kinds/" + order.id_wine, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
      order.id_primary_color ? fetch(apiRoute + "/read/packing_colors/" + order.id_primary_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
      order.id_secondary_color ? fetch(apiRoute + "/read/secondary_packing_colors/" + order.id_secondary_color, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
      order.id_msg ? fetch(apiRoute + "/read/msgs/" + order.id_msg, setRequestConfig()).then(re => re.json()).then(d => d[0]) : {},
    ]);
    console.log("wine",wine);
    console.log("primaryColor",primaryColor);
    console.log("secondaryColor",secondaryColor);
    console.log("msg",msg);


    setEditModal(
      <Modal 
        title={`Edit Order #${order.id}`} 
        resolveFunction={(value)=>{updateData(value,order.id)}} 
        options={[{label:"Cancel",value:0}]}>
            <form className=" d-flex flex-column align-content-center justify-content-center w-100">
              {/* user */}
              <EditModalSelect label="User:" tableName="users" getOptionsForSelect={getOptionsForSelect} labelProperty="last_name" firstObj={user}/>
              {/* design */}
              <EditModalSelect label="Design: " tableName="designs" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={design}/>
              {/* real design */}
              <EditModalSelect label="Real Design: " tableName="real_designs" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={realDesign}/>
              {/* wine */}
              <EditModalSelect label="wine_kinds" tableName="wine_kinds" getOptionsForSelect={getOptionsForSelect} labelProperty="name" firstObj={wine}/>

            </form>
        </Modal>
    )
  }
  function updateData(data,idTable) {
    if (data==0) {
      setEditModal(false)
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



  return !editModal?
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
