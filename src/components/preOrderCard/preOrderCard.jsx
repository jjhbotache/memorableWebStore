import { useState } from "react";
import { apiRoute, customiseBottlePath } from "../../const/const";
import { ponerPuntos } from "../../functions/functions";
import Counter from "../counter/counter";
import { useEffect } from "react";

export default function PreOrderCard({preOrder,bottlePrice, amountUpdated}) {
  const [po, setPo] = useState(preOrder);

  useEffect(() => {
    amountUpdated(po);
  }, [po]);

  return(
    <div className="card mb-3">
      <div className="row g-0">
        <div className="card-body container-sm py-1">
          <div className="row">
            <div className="row p-0">
              <div className="ps-2 pe-0 col-11">
                <h2 className="card-title text-center my-1">{po.design.name}</h2>
              </div>
              <div className="p-0 ps-1 col-1 d-flex justify-content-center align-items-center">
                <a href={customiseBottlePath+"/"+po.id} className="fs-1" style={{ textDecoration: 'none' }}>✏️</a>
              </div>
            </div>
            <div className="col-4 pe-0 px-sm-2 mb-sm-0  d-flex justify-content-center align-items-center">
              <div>
                <img src={`${apiRoute}/get_file/${po.design.img}/-`} className=" align-self-center align-middle w-100 h-auto rounded-2 mb-1 m-md-2" style={{maxWidth:"200px"}} alt=""/>
              </div>
            </div>
            <div className="col-8 d-flex flex-column justify-content-around my-1 my-md-5">
              <div className="d-flex justify-content-center">
                <span className="fs-6" ><strong>Price: &nbsp;</strong></span>
                <span className="fs-6" >{ponerPuntos(po.amount * bottlePrice)}</span>
              </div>
              <div className="d-flex justify-content-center">
                <span className="fs-6 d-none d-sm-block" ><strong>Amount: &nbsp;</strong></span>
                <div className="h-50" style={{maxHeight:"2em"}}>
                  <Counter minValue={0} firstValue={po.amount} onChange={(v)=>{setPo({...po,amount:v})}} />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
