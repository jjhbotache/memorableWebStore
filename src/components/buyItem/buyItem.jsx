import React, { useEffect, useState } from 'react';
import styles from './buyItem.module.css';
import { apiRoute } from '../../const/const';

// made mostly by chatgpt

const BuyItem = ({ data,token,userId }) => {
  const { id, id_design,id_real_design, amount, delivery_date, id_delivery_place, id_packing_color, id_vaucher } = data;
  const [nameToUse, setNameToUse] = useState("No design");

  useEffect(() => {
    console.log("id_design",id_design);
  }, [data])

  if (id_real_design) {
    fetch(apiRoute+"/user/read/real_designs/"+userId).then(re=>re.json())
    .then(data=>{
      const design = data.find(design => design.id==id_real_design)
      setNameToUse(design.name)
    })
  }else if(id_design){
    fetch(apiRoute+"/read-anyone/designs").then(re=>re.json())
    .then(data=>{
      console.log(data);
      const design = data.find(design => design.id==id_design)
      setNameToUse(design.name)
    })
  }else{
    console.log("no design");
  }
  

  
  return (
    <div className="accordion" id={`accordion${id}`}>
      <div className="accordion-item">
        <h2 className="accordion-header" id={`headinFor${id}`}>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${id}`}
            aria-expanded="false"
            aria-controls={`collapse${id}`}
          >
            {`${id} - ${nameToUse}`}
          </button>
        </h2>
        <div
          id={`collapse${id}`}
          className="accordion-collapse collapse"
          aria-labelledby={`headinFor${id}`}
          data-bs-parent={`#accordion${id}`}
        >
          <div className="accordion-body">
            <img className={`${styles.vaucher}`} src={apiRoute +"/"+id_vaucher+"/"+token} alt="Vaucher" />
            <p>Amount: {amount}</p>
            <p>Delivery Date: {delivery_date}</p>
            <p>Delivery Place ID: {id_delivery_place}</p>
            <p>Packing Color ID: {id_packing_color}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyItem;
