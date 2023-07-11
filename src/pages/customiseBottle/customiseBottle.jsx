import { useEffect,useRef,useState } from "react";
import ColorSelect from "../../components/colorSelect/colorSelect";
import Counter from "../../components/counter/counter";
import Select from "../../components/select/select";
import { apiRoute, catalogPath } from "../../const/const";
import "./customiseBottle.css";


const defaultAmount = 1;
export default function CustomiseBottle() {
  const designGotten = useRef(JSON.parse(localStorage.getItem("design")))
  if (!designGotten.current) window.location.assign(catalogPath)

  const [readyToOrder, setReadyToOrder] = useState(false);
  const [order, setOrder] = useState({
    design: null,
    wine: null,
    amount: null,
    primaryColor: null,
    secondaryColor: null,
  });
  
  const primaryColors = [
    { id: 1, name: "red" },
    { id: 2, name: "blue" },
    { id: 3, name: "darkmagenta" },
  ];
  
  const secondaryColors = [
    { id: 1, name: "white" },
    { id: 2, name: "black" },
    { id: 3, name: "silver" },
  ];
  
  const wines = [
    { id: 2, name: "tempranillo" },
    { id: 3, name: "airen" },
    { id: 4, name: "malbec" },
    { id: 5, name: "carmenere" },
    { id: 6, name: "merlot" },
    { id: 8, name: "cabernet sauvignon" },
    { id: 13, name: "moscatel" },
    { id: 16, name: "rose" },
  ];
  
  useEffect(() => {
    const firstOrder = {
        ...order, 
        design: designGotten.current,
        amount: defaultAmount,
      };
    setOrder(firstOrder)
  }, []);

  useEffect(() => {
    if (order.design && order.wine && order.amount && order.primaryColor && order.secondaryColor) setReadyToOrder(true);
    else setReadyToOrder(false);
    console.log(order);
  }, [order]);

  function onBuyNow() {
    // save in localstorage the order
    localStorage.setItem("order", JSON.stringify(order));
    // redirect to checkout
    window.location.assign("/buyNow");
  }

  return(
    <>
      <div className="container mt-1" id="customiseBottle-container">
        <div className="row">
          <div className="col-12">
            <img src={apiRoute+"/"+designGotten.current.img+"/-"} alt={designGotten.current.name} />
            <h2>{designGotten.current.name}</h2>
          </div>

          <div className="col-12">
            <Select options={wines} defaultValue="" label="Kind of wine:" onChange={(e)=>{setOrder({...order,wine:e})}} />
          </div>

          <div className="col-12">
            <Counter firstValue={defaultAmount} onChange={(number)=>{setOrder({...order,amount:number})}}/>
          </div>

          <div className="col-12">
            <ColorSelect label={"Primary packing color"} colors={primaryColors} onChange={(e)=>{setOrder({...order,primaryColor:e})}}/>
          </div>

          <div className="col-12">
            <ColorSelect label={"Secondary packing color"} colors={secondaryColors} onChange={(e)=>{setOrder({...order,secondaryColor:e})}}/>
          </div>

          <div className="col-12">
            <textarea className="form-control" placeholder="Message" onChange={(e)=>{setOrder({...order,msg:e.target.value})}}></textarea>
          </div>

          <div className="col-12">
            <button className="btn btn-white d-block mx-auto my-2" disabled> add to shopping cart</button>
            <button className="btn d-block mx-auto" onClick={onBuyNow} disabled={!readyToOrder}> buy now</button>
          </div>
          
        </div>
      </div>
    </>
  )
};
