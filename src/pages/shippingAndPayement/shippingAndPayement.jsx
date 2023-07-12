import React, { useState, useEffect, useRef } from 'react';
import './shippingAndPayement.css';
import Modal from '../../components/modal/modal';
import { apiRoute, catalogPath, getUserToken, setRequestConfig, userDashboardPath } from '../../const/const';

export default function ShippingAndPayement() {
  // shipping just save a shippingId:1
  const [shipping, setShipping] = useState({});  
  const [wayOfShiping, setWayOfShiping] = useState();  
  // payement just save an img
  const [payement, setPayement] = useState(null);
  const [wayOfPaying, setWayOfPaying] = useState();  

  const input = useRef()
  

  function handleSetShipping (shipping){
    shipping.shippingId?
      setShipping(shipping)
    :
      setWayOfShiping()
  }
  function handlePayement(value) {
    console.log("paying");
    const vaucher = input.current.files[0];
    if (vaucher) {
      setPayement(vaucher);
      if (vaucher instanceof File) {
        const logic = async ()=>{
          
          if (await getUserToken()) {
            const formData = new FormData();
            formData.append("vaucher",vaucher);
  
            const savedVaucher = await fetch(apiRoute+"/insert-vaucher-anyone",setRequestConfig("POST",formData,true)).then(response=>response.json()).then(data=>{
              console.log(data);
              return data
            }).catch(error=>{
              console.log(error);
              setPayement(null)
              return false
            })
            if (savedVaucher) {
              console.log("Your vaucher has been saved");
              // amount:"1"
              // id_delivery_place:"\"Ibague Tolima Calle 13 #7-82\""
              // id_design:"26"
              // id_packing_color:1
              // id_secondary_packing_color:3
              // id_wine:"2"
              // msg:"''"
  
              const order = JSON.parse(localStorage.getItem("order"));
  
              const finalOrder = {
  
                amount:order.amount,
                id_delivery_place:shipping.shippingId===1?"\"Ibague Tolima Calle 13 #7-82\"":shipping.shippingId.toString(),
                id_design:order.design.id_design,
                id_packing_color:order.primaryColor.id,
                id_secondary_packing_color:order.primaryColor.id,
                id_wine:order.wine.id_wine,
                msg:order.msg,
  
                id_user:localStorage.getItem("id"),
                id_vaucher:"'"+savedVaucher.vaucher_route+"'"
              }
              fetch(apiRoute+"/user/create/pucharse_orders",setRequestConfig("POST",JSON.stringify(finalOrder))).then(re=>re.json()).then((data) => {
                console.log(data);
                console.log("Your order has been created");
                // window.location.assign(catalogPath);
              })
            }else{
              console.log("There was an error saving your vaucher, try changing the file name");
              fetch(apiRoute+"/delete-voucher-file",setRequestConfig("DELETE",JSON.stringify({route:savedData}))).then(response=>response.json()).then(data=>{console.log(data);}).catch(e => console.log(e))
              setPayement(null)
            }            
          }else{
            setPayement(null)
            alert("You must confirm your email to pay");
          }

        }
        logic();
      }
    }else{
      alert("You must upload a vaucher");
    }
  }

  let modalToRender;

  

  // logic to show modals
  if (!wayOfShiping) {
    modalToRender = 
      <Modal title='Do you want to pick up your order or we send it to you?' options={[
        {label:'Pick up', value:1},
        {label:'Send it', value:2}
      ]} resolveFunction={(way)=>setWayOfShiping(way)}/>
  }else{
    if (!shipping.shippingId) {
      if(wayOfShiping===1){
        modalToRender=
        <Modal title='Do you want to pick up your order in <place>?' options={[
          {label:'Yes', value:1},
          {label:'No', value:false}
        ]} resolveFunction={(value)=>handleSetShipping({shippingId:value})}/>
      }else{
        modalToRender=
        <Modal title='To which address would you like to send your order?' options={[
          {label:'1', value:1},
          {label:'2', value:2},
          {label:'3', value:3},
          {label:'4', value:4},
          {label:'cancel', value:false},
        ]} resolveFunction={(value)=>handleSetShipping({shippingId:value})}/>
      }
    }else{
      if (!wayOfPaying) {
        modalToRender=
          <Modal title='How would you like to pay?' options={[
            {label:'Nequi', value:1},
            {label:'Bancolombia', value:2},
            {label:'Daviplata', value:3},
          ]} resolveFunction={(value)=>{setWayOfPaying(value)}}/>
      }else{
        if (payement === null) {
          switch (wayOfPaying) {
            case 1:
              modalToRender = 
              <Modal title='Scan the QR code to pay' options={[
                {label:'Payed', value:true},
                {label:'cancel', value:false},
              ]} resolveFunction={(payed)=>payed?setPayement(undefined):setWayOfPaying()}>
                <img src="https://chart.apis.google.com/chart?cht=qr&chl=Hello&chs=248" alt="QR Nequi" className="img-fluid"/>
                <hr/>
                <h5>Phone number</h5>
                <h6>3012167977</h6>
                <hr/>
              </Modal>
              break;
            case 2:
              modalToRender = 
              <Modal title='Scan the QR code to pay' options={[
                {label:'Payed', value:true},
                {label:'cancel', value:false},
              ]} resolveFunction={(payed)=>payed?setPayement(undefined):setWayOfPaying()}>
                <hr/>
                <h5>Account number</h5>
                <h6>1205-672235</h6>
                <hr/>
              </Modal>
              break;
            case 3:
              modalToRender = 
              <Modal title='Scan the QR code to pay' options={[
                {label:'Payed', value:true},
                {label:'cancel', value:false},
              ]} resolveFunction={(payed)=>payed?setPayement(undefined):setWayOfPaying()}>
                <img src="https://chart.apis.google.com/chart?cht=qr&chl=Hello&chs=248" alt="QR Nequi" className="img-fluid"/>
                <hr/>
                <h5>Phone number</h5>
                <h6>3012167977</h6>
                <hr/>
              </Modal>  
              break;
          }
        }else{
          // if payement is a file
          if (payement instanceof File) {
            modalToRender=(
              <Modal title='Your order has been created succesfully!' options={[
                {label:'Done', value:1},
              ]} resolveFunction={()=>{window.location.assign(userDashboardPath)}} />
            )
          }else{
            modalToRender=
              <Modal title='Upload your vaucher in here' options={[
                {label:'Done', value:1},
              ]} resolveFunction={handlePayement}>
                <input ref={input} type="file" name="vaucher" id="vaucher" accept='.png' className="form-control"/>
              </Modal>
          }

        }
    }
    }
  } 


  
  
  return(
    <div className="container SAP-modal d-flex justify-content-center align-content-center" >
      <div className="row d-flex justify-content-center align-content-center">
        <div className="col-12 ">
          {modalToRender}
        </div>
      </div>
    </div>
  )
};
