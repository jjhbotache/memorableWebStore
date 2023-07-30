import React, { useEffect, useState } from 'react';
import styles from './buyItem.module.css';
import { apiRoute } from '../../const/const';
import { convertirFecha, setRequestConfig } from '../../functions/functions';
import { ponerPuntos } from '../../functions/functions';

// made mostly by chatgpt

const BuyItem = ({ data,token,userId,accordionContainerId }) => {
  const { id, id_design,id_real_design, amount, delivery_date, id_delivery_place, id_packing_color, id_vaucher,price } = data;
  const [design, setDesign] = useState();
  const [realDesign, setrealDesign] = useState();

  useEffect(() => {

    if (id_real_design) {
      fetch(apiRoute+"/user/read/real_designs/"+id_real_design,setRequestConfig()).then(re=>re.json())
      .then(data=>{
        setrealDesign(data.find(design => design.id==id_real_design))
      })
    }else if(id_design){
      fetch(apiRoute+"/read-anyone/designs").then(re=>re.json())
      .then(data=>{
        setDesign(data.find(design => design.id==id_design))
      })
    }
  }, []);

  // useEffect(() => {
  //   console.log("id_design",id_design);
  // }, [data])

  function loadData() {
    fetch(apiRoute+"/read-anyone/designs").then(re=>re.json())
      .then(data=>{
        setDesign(data.find(design => design.id==id_design))
      })
  }
  

  
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`headinFor${id}`}>
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`}
          aria-expanded="false"
          aria-controls={`collapse${id}`}
          onClick={loadData}
        >
          {`${id}) ${realDesign?realDesign.name:design?design.name:""}`}
        </button>
      </h2>
      <div
        id={`collapse${id}`}
        className="accordion-collapse collapse"
        aria-labelledby={`headinFor${id}`}
        data-bs-parent={`#${accordionContainerId}`}
      >
        <div className={`accordion-body ${styles.bg}`}>
          
          <div className="container">
            {
              realDesign?
              <div className="row">
                <div className="col-12">
                  <p>Real design:</p>
                  <img className={`mb-4 ${styles.vaucher}`} src={apiRoute +"/get_file/"+realDesign?.img+"/"+token} alt="Vaucher" />
                </div>
              </div>
              :
              <>
              <hr />
              <h2>
                We still making your design!
              </h2>
              <hr />
              </>
            }
            <div className="row">
              <div className="col-12 col-md-6">
                <p>Voucher:</p>
                <img className={`mb-4 ${styles.vaucher}`} src={apiRoute +"/get_file/"+id_vaucher+"/"+token} alt="Vaucher" />
              </div>
              <div className="col-12 col-md-6">
                <p>Base design:</p>
                {design && <img className={`mb-4 ${styles.vaucher}`} src={apiRoute +"/get_file/"+design?.img+"/"+token} alt="Vaucher" />}
              </div>
            </div>
          </div>
          <ul>

            <li>Price: {"$"+ponerPuntos(price)}</li>
            <li>Payment confirm: {data.paid?<span className="badge bg-success">Paid</span>:<span className="badge bg-danger">Not paid</span>}</li>
            <li>Delivery Date: {convertirFecha(delivery_date)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuyItem;
