import React, { useState } from 'react';
import './shippingAndPayement.css';

export default function ShippingAndPayement() {
const [shipping, setShipping] = useState({});  
const [payement, setPayement] = useState({});



  return(
    <div className="container SAP-modal d-flex justify-content-center align-content-center" >
      <div className="row d-flex justify-content-center align-content-center">
        <div className="col-12 ">
          <h1>Shipping</h1>
        </div>
      </div>
    </div>
  )
};
