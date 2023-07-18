import { useEffect,useRef,useState } from "react";
import ColorSelect from "../../components/colorSelect/colorSelect";
import Counter from "../../components/counter/counter";
import Select from "../../components/select/select";
import { apiRoute, buyNowPath, catalogPath, loginAndRegisterPath } from "../../const/const";
import styles from "./customiseBottle.module.css";
import { setRequestConfig } from "../../functions/functions";


const defaultAmount = 1;
export default function CustomiseBottle() {
  const designGotten = useRef(JSON.parse(localStorage.getItem("design")))
  if (!designGotten.current) window.location.assign(catalogPath)

  const [readyToOrder, setReadyToOrder] = useState(false);
  const [wines, setWines] = useState([]);
  const [primaryColors, setPrimaryColors] = useState([]);
  const [secondaryColors, setSecondaryColors] = useState([]);


  const [order, setOrder] = useState({
    design: null,
    wine: null,
    amount: null,
    primaryColor: null,
    secondaryColor: null,
  });
  
  
  useEffect(() => {
    const firstOrder = {
        ...order, 
        design: designGotten.current,
        amount: defaultAmount,
      };
    setOrder(firstOrder)

    fetch(apiRoute + "/read-anyone/wine_kinds").then(re=>re.json()).then(data=>{
      setWines(data)
    }).catch(err=>{console.log(err);})

    fetch(apiRoute + "/read-anyone/packing_colors").then(re=>re.json()).then(data=>{
      setPrimaryColors(data)
    }).catch(err=>{console.log(err);})

    fetch(apiRoute + "/read-anyone/secondary_packing_colors").then(re=>re.json()).then(data=>{
      setSecondaryColors(data)
    }
    ).catch(err=>{console.log(err);})

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
    (localStorage.getItem("id")&&!localStorage.getItem("password")) 
    ?window.location.assign(buyNowPath)
    :window.location.assign(loginAndRegisterPath)
  }

  return(
    <>
      <div className={` container-fluid ${styles.customiseBottleContainer}`}>
        <div className="row w-100 gap-4 gap-sm-0">
          <div className="col-12 col-sm-5 d-grid align-content-center">
            <img className="img-fluid" src={apiRoute+"/"+designGotten.current.img+"/-"} alt={designGotten.current.name} />
            <h2 className="mt-2">{designGotten.current.name}</h2>
          </div>

          <div className="col-12 col-sm-7 gap-3 px-sm-2 d-flex flex-column justify-content-center align-content-between">
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
              <label htmlFor="msg">Message:</label>
              <textarea className="form-control" rows={4} placeholder="Describe how do you want to customise your bottle..." onChange={(e)=>{setOrder({...order,msg:e.target.value})}} ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-white d-block mx-auto my-2" disabled> add to shopping cart</button>
              <button className="btn d-block mx-auto" onClick={onBuyNow} disabled={!readyToOrder}> buy now</button>
            </div>
          </div>

          
        </div>
      </div>
    </>
  )
};
