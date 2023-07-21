import { useEffect, useState } from "react";
import { apiRoute } from "../../const/const";
import { areObjectsEqual, camelToSnake, setRequestConfig } from "../../functions/functions";
import Spinner from "../../components/spinner/spinner";
import { useRef } from "react";

export default function OtherAdmins() {
  const [loading, setLoading] = useState(false);
  const [dataToAdmin, setDataToAdmin] = useState({
    bottlePrice: 0,
    nationalShippingPrice: 0,
  });
  const data = useRef({})


  useEffect(() => {
    setLoading(true);
    Promise.all([
      new Promise((resolve,reject) => fetch(`${apiRoute}/read/addresses/1`,setRequestConfig()).then(res => res.json()).then(data => resolve(data)).catch(err => reject(err))),
      new Promise((resolve,reject) => fetch(`${apiRoute}/csv-data/bottle_price`,setRequestConfig()).then(res => res.json()).then(data => resolve(data.data)).catch(err => reject(err))),
      new Promise((resolve,reject) => fetch(`${apiRoute}/csv-data/national_shipping_price`,setRequestConfig()).then(res => res.json()).then(data => resolve(data.data)).catch(err => reject(err))),
    ])
    .then(([a,bp,nsp]) => {
      data.current = {
        pickUpAdress: a[0],
        bottlePrice: bp,
        nationalShippingPrice: nsp,
      }
      console.log(data.current)
      setDataToAdmin(data.current);
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  }, [])

  function saveData(key) {
    setLoading(true);
    fetch(`${apiRoute}/csv-data/${camelToSnake(key)}`,setRequestConfig("PUT",{data:dataToAdmin[key]}))
    .then(res => res.json())
    .then(d=>{
      alert(d.msg)
      data.current[key] = dataToAdmin[key];
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  }

  return loading ? 
    <div className="mt-2 h-100">
      <Spinner/>
    </div>
   : 
// commune: 1
// complement: "casa 3 pisos frente a colcable"
// id: 1
// neighbourhood: "pueblo nuevo"
// number: "7-82"
// state: "Tolima"
// street: 13
// town: "Ibagué"
    <div>
      <h1 className="fs-4">Pucharse Orders Admin</h1>
      <div className="container mx-sm-5 px-sm-5">
        <hr />
        <div className="row mx-md-5 px-md-5">
          <div className="mb-3 px-sm-5">
            <label className="form-label">Pick up adress:</label>
            <div className="d-flex flex-column mb-3">
              <label className="form-label">State:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.state} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,state:e.target.value}})}/>
              <label className="form-label">Town:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.town} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,town:e.target.value}})} />
              <label className="form-label">Neighbourhood:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.neighbourhood} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,neighbourhood:e.target.value}})} />
              <label className="form-label">Street:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.street} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,street:parseInt(e.target.value || 0)}})} />
              <label className="form-label">Number:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.number} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,number:e.target.value}})} />
              <label className="form-label">Commune:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.commune} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,commune:parseInt(e.target.value || 0)}})} />
              <label className="form-label">complement:</label>
              <input type="text" className="form-control" value={dataToAdmin.pickUpAdress?.complement} onChange={e=>setDataToAdmin({...dataToAdmin,pickUpAdress:{...dataToAdmin.pickUpAdress,complement:e.target.value}})} />
            </div>
            <button type="button" className="btn btn-dark mx-auto d-block w-50" disabled={areObjectsEqual(dataToAdmin.pickUpAdress,data.current.pickUpAdress)}  onClick={e=>{saveData("pickUpAdress")}} >save</button>
          </div>
          <hr className="my-5 px-5" />
          <div className="mb-3 px-sm-5">
            <label className="form-label">Bottle price:</label>
            <div className="d-flex">
              <input type="text" className="form-control rounded-end-0" value={dataToAdmin.bottlePrice} onChange={e=>setDataToAdmin({...dataToAdmin,bottlePrice:e.target.value})}/>
              <button type="button" className="btn btn-dark rounded-start-0" disabled={dataToAdmin.bottlePrice == data.current.bottlePrice} onClick={e=>{saveData("bottlePrice")}} >save</button>
            </div>
          </div>
          <hr className="my-5 px-5" />
          <div className="mb-3 px-sm-5">
            <label className="form-label">National shipping price:</label>
            <div className="d-flex">
              <input type="text" className="form-control rounded-end-0" value={dataToAdmin.nationalShippingPrice} onChange={e=>setDataToAdmin({...dataToAdmin,nationalShippingPrice:e.target.value})}/>
              <button type="button" className="btn btn-dark rounded-start-0" disabled={dataToAdmin.nationalShippingPrice == data.current.nationalShippingPrice} onClick={e=>{saveData("nationalShippingPrice")}} >save</button>
            </div>
          </div>
        </div>  
      </div>
    </div>
    
};
