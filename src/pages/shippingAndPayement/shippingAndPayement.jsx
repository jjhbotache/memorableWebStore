import React, { useState, useRef, useEffect } from 'react';
import './shippingAndPayement.css';
import Modal from '../../components/modal/modal';
import { apiRoute, userDashboardPath } from '../../const/const';
import {getUserToken, ponerPuntos, setRequestConfig} from "../../functions/functions"
import Spinner from '../../components/spinner/spinner';

export default function ShippingAndPayement() {
  // shipping just save a shippingId:1
  const [shipping, setShipping] = useState({});  
  const [wayOfShiping, setWayOfShiping] = useState();  
  // payement just save an img
  const [payement, setPayement] = useState(null);
  const [wayOfPaying, setWayOfPaying] = useState();  
  const [price, setPrice] = useState();

  const [addresses, setAddresses] = useState([]);
  const [pickUpPlace, setPickUpPlace] = useState(null);

  const input = useRef()


  useEffect(() => {
    fetch(apiRoute + "/open-csv-data/bottle_price",setRequestConfig()).then(re=>re.json()).then(d=>{
      setPrice(d.data)
      }).catch(e=>console.log(e))
  }, []);

  function handleSetShipping (shipping){
    if (!!(shipping.shippingId)===false) {
      setWayOfShiping()
      setShipping({})
    }else{
      setShipping(shipping)
    }
  }
  async function handlePayement(value) {
    console.log("paying");
    const vaucher = input.current.files[0];
    if (vaucher) {
      setPayement(vaucher);
      if (vaucher instanceof File) {
        const logic = async ()=>{
          if (await getUserToken()) {
            const formData = new FormData();
            formData.append("vaucher",vaucher);
            formData.append("id",localStorage.getItem("id"));
            
            const savedVaucher = await fetch(apiRoute+"/insert-vaucher-anyone",setRequestConfig("POST",formData,true)).then(response=>response.json()).then(data=>{
              console.log(data);
              return data
            }).catch(error=>{
              console.log(error);
              setPayement(null)
              return false
            })
            console.log(savedVaucher);
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
                id_delivery_place:shipping.shippingId,
                id_design:order.design.id,
                id_packing_color:order.primaryColor.id,
                id_secondary_packing_color:order.primaryColor.id,
                id_wine:order.wine.id_wine,
                msg:`"${order.msg}"`,
                price:price*order.amount,
  
                id_user:localStorage.getItem("id"),
                id_vaucher:"'"+savedVaucher.vaucher_route+"'"
              }
              fetch(apiRoute+"/user/create/pucharse_orders",setRequestConfig("POST",JSON.stringify(finalOrder))).then(re=>re.json()).then((data) => {
                console.log(data);
                alert("Your order has been created");
                alert( "Remember that if it exists any problem, will be notice you to your phone or email registered")
                // delete the order from the local storage
                localStorage.removeItem("order");
                window.location.assign(userDashboardPath);
              }).catch((e) => {
                console.log(e);
                alert("There was an error saving your vaucher, try changing the file name");
                fetch(apiRoute+"/delete-voucher-file",setRequestConfig("DELETE",JSON.stringify({route:savedVaucher}))).then(response=>response.json()).then(data=>{console.log(data);}).catch(e => console.log(e))
                setPayement(null)
              })
            }else{
              alert("There was an error saving your vaucher");
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

  console.clear();
  console.log("shipping",shipping);
  console.log("payement",payement);
  console.log("wayOfPaying",wayOfPaying);
  console.log("wayOfShiping",wayOfShiping);
  console.log("price",price);
  console.log("pickUpPlace",pickUpPlace);
  // clean the console

  
  let modalToRender;
  // logic to show modals
  if (!wayOfShiping) {
    modalToRender = 
      <Modal title='Do you want to pick up your order or we send it to you?' options={[
        {label:'Pick up', value:1},
        {label:'Send it', value:2}
      ]} resolveFunction={(way)=>setWayOfShiping(way)}/>
  }else{
    if (!(!!(shipping.shippingId))) {
      if(wayOfShiping===1){
        // get the pick up place
        pickUpPlace || fetch(apiRoute + "/user/read/addresses/1",setRequestConfig()).then(re=>re.json()).then(d=>setPickUpPlace(d[0])).catch(e=>console.log(e))

        modalToRender=
        <Modal title={`Do you want to pick up your order in the pick up place?`} options={[
          {label:'Yes', value:1},
        ]} cancelable resolveFunction={(value)=>handleSetShipping({shippingId:value})}>
          <h3 className='text-start mx-4'><strong>Pick up place: </strong> </h3>
          <ul className='text-start'>
            <li><h5>{pickUpPlace? (pickUpPlace.state+" - "+pickUpPlace.town) : "loading..."}</h5></li>
            <li><h5>{pickUpPlace? (pickUpPlace.neighbourhood+" / Str "+pickUpPlace.street+" - "+pickUpPlace.number) : "loading..." }</h5></li>
          </ul>
        </Modal>
          
      }else{
        // get the addresses
        addresses.length===0 && fetch(apiRoute + "/user/read/addresses",setRequestConfig()).then(re=>re.json()).then(d=>setAddresses(d)).catch(e=>console.log(e))

        modalToRender=
        <Modal title='To which address would you like to send your order?' options={
          addresses.map(address=>({label:address.name, value:address.id}))
        } cancelable resolveFunction={value=>handleSetShipping({shippingId:value})}/>
      }
    }else{
      if (!wayOfPaying) {
        modalToRender=
          <Modal title='How would you like to pay?' cancelable options={[
            {label:'Nequi', value:1},
            {label:'Bancolombia', value:2},
            {label:'Daviplata', value:3},
            // {label:'Daviplata', value:false},
          ]} resolveFunction={value=>{!(value==0)? setWayOfPaying(value) : handleSetShipping({shippingId:value}) }}/>
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
                <h3>$&nbsp;{ponerPuntos(price)}</h3>
                <h5>Phone number</h5>
                <h6>3012167977</h6>
              </Modal>
              break;
            case 2:
              modalToRender = 
              <Modal title='Here is the account number' options={[
                {label:'Payed', value:true},
                {label:'cancel', value:false},
              ]} resolveFunction={(payed)=>payed?setPayement(undefined):setWayOfPaying()}>
                <hr/>
                <h3>$&nbsp;{ponerPuntos(price)}</h3>
                <h5>Account number:</h5>
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
                <h3>$&nbsp;{ponerPuntos(price)}</h3>
                <h5>Phone number</h5>
                <h6>3012167977</h6>
              </Modal>  
              break;
          }
        }else{
          // if payement is a file
          if (payement instanceof File) {

            modalToRender=(
              <Modal title="We are verifying it's you " options={[
                {label:'Done', value:1},
              ]} resolveFunction={()=>{
                localStorage.getItem("token")&&window.location.assign(userDashboardPath)
                }} >
                  <Spinner/>
              </Modal>
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
