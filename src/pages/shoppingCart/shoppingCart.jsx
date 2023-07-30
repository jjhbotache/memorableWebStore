import { useRef, useState } from "react";
import LoadingView from "../../components/loadingView/loadingView";
import { useEffect } from "react";
import { ponerPuntos, setRequestConfig, shoppingCartGet, shoppingCartSync } from "../../functions/functions";
import { apiRoute, catalogPath, shippingAndPayementPath, shoppingCartPath } from "../../const/const";
import PreOrderCard from "../../components/preOrderCard/preOrderCard";
import StickyBottomModal from "../../components/stickyBottomModal/stickyBottomModal";
import { Link, useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [preOrders, setPreOrders] = useState([]);
  const [bottlePrice, setBottlePrice] = useState(0);
  
  const totalPrice = useRef(0);

  useEffect(() => {
    setLoading(true);
    shoppingCartGet().then(d=>{
      setPreOrders(d);
      setLoading(false);
    })
    .catch(err=>console.log(err))
    .finally(()=>setLoading(false));

    setLoading(true);
    fetch(apiRoute + "/open-csv-data/bottle_price",setRequestConfig()).then(re=>re.json())
    .then(d=>{
      setBottlePrice(d.data[0])
    })
    .catch(err=>console.log(err))
    .finally(()=>setLoading(false));

  }, [])

  console.log(bottlePrice);

  function updatePreOrderAmount(po) {
    if (po.amount<1) deletePreOrder(po.id)
    else{
      const preOrder = preOrders.find(p=>p.id===po.id);
      preOrder.amount = po.amount;
      const index = preOrders.findIndex(p=>p.id===po.id);
      const newPreOrders = [...preOrders];
      newPreOrders[index] = po;
      setPreOrders(newPreOrders);
      shoppingCartSync(newPreOrders);
    }
  }

  function deletePreOrder(id) {
    const newPreOrders = preOrders.filter(p=>p.id!==id);
    setPreOrders(newPreOrders);
    shoppingCartSync(newPreOrders).then(
      ()=>navigate(shoppingCartPath)
    )

  }

  totalPrice.current = 0;
  return !loading?
  <>
  <div className="container-sm">
    <h1>shopping cart</h1>
    <hr />
    
    {
      !!preOrders.length?
      preOrders.map(preOrder=>{
        totalPrice.current+=(preOrder.amount*bottlePrice)
        return  <PreOrderCard key={preOrder.id}  preOrder={preOrder} bottlePrice={bottlePrice} amountUpdated={po=>updatePreOrderAmount(po)} />
      })
      :
      <>
      <h1>There aren't any products in the cart</h1>
      <h6>See the designs in the catalog:</h6>
      <div className="w-100 d-flex justify-content-center align-items-center" style={{height:"30vh"}}>
        <Link to={catalogPath} className="btn ">Catalog</Link>
      </div>
      </>
      // link to redirect to catalog

    }
    <div style={{minHeight:"21vh"}}></div>
  </div>
  <StickyBottomModal>
    <div className="h-100 d-flex align align-items-center">
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h2>Total: {ponerPuntos(totalPrice.current)}</h2>
            <h4>Bottles: {preOrders.reduce((p, a,) => p+a.amount, 0)}</h4>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center">
            <Link to={shippingAndPayementPath+"/1"} className="btn btn-white ms-auto">Buy</Link>
          </div>
        </div>
      </div>
    </div>
  </StickyBottomModal>
  </>
  :
  <LoadingView />
};
