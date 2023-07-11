import React, { useState, useEffect } from 'react';
import './shippingAndPayement.css';
import Modal from '../../components/modal/modal';

export default function ShippingAndPayement() {
  // shipping just save a shippingId:1
const [shipping, setShipping] = useState();  
const [wayOfShiping, setWayOfShiping] = useState();  
// payement just save an img
const [payement, setPayement] = useState();

console.log(wayOfShiping);

useEffect(() => {
  const timeoutId = setTimeout(() => {
    setShowModal(true);
  }, 10000); // Retraso para permitir que se aplique el efecto de transición
  return () => clearTimeout(timeoutId); // Limpiar el timeout en el desmontaje del componente
}, []);

function handleSetShipping (shipping){
  shipping.shippingId?
    setShipping(shipping)
  :
    setWayOfShiping()
}
  return(
    <div className="container SAP-modal d-flex justify-content-center align-content-center" >
      <div className="row d-flex justify-content-center align-content-center">
        <div className="col-12 ">
          {
            !wayOfShiping?
              <Modal title='Do you want to pick up your order or we send it to you?' options={[
                {label:'Pick up', value:1},
                {label:'Send it', value:2}
              ]} resolveFunction={(way)=>setWayOfShiping(way)}/>
            :
              wayOfShiping===1?
                <Modal title='Do you want to pick up your order in <place>?' options={[
                  {label:'Yes', value:1},
                  {label:'No', value:false}
                ]} resolveFunction={(value)=>handleSetShipping({shippingId:value})}/>
              :
                <Modal title='To which address would you like to send your order?' options={[
                  {label:'1', value:1},
                  {label:'2', value:2},
                  {label:'3', value:3},
                  {label:'4', value:4},
                  {label:'cancel', value:false},
                ]} resolveFunction={(value)=>handleSetShipping({shippingId:value})}/>
          }

        </div>
      </div>
    </div>
  )
};
