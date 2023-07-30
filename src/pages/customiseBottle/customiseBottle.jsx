import { useEffect,useRef,useState } from "react";
import ColorSelect from "../../components/colorSelect/colorSelect";
import Counter from "../../components/counter/counter";
import Select from "../../components/select/select";
import { apiRoute, buyNowPath, catalogPath, loginAndRegisterPath, shoppingCartPath } from "../../const/const";
import styles from "./customiseBottle.module.css";
import { setRequestConfig, shoppingCartGet, shoppingCartSync } from "../../functions/functions";
import { useNavigate, useParams} from "react-router-dom";

const defaultAmount = 1;
export default function CustomiseBottle() {
  const navigate = useNavigate();
  const {id:idPreOrderToCustomise} = useParams();
  const designGotten = useRef(JSON.parse(localStorage.getItem("design")))
  if (!designGotten?.current && idPreOrderToCustomise == undefined) navigate(catalogPath)

  const [readyToOrder, setReadyToOrder] = useState(false);
  const [wines, setWines] = useState([]);
  const [primaryColors, setPrimaryColors] = useState([]);
  const [secondaryColors, setSecondaryColors] = useState([]);


  const [order, setOrder] = useState({
    design: designGotten.current,
    wine: null,
    amount: null,
    primaryColor: null,
    secondaryColor: null,
  });
  
  
  useEffect(() => {
    if (idPreOrderToCustomise) {
      shoppingCartGet().then(orders=>{
        // console.log(orders);
        const preOrder =  orders.find(o=>o.id==idPreOrderToCustomise)
        setOrder({...preOrder,
          amount: defaultAmount,
          primaryColor: null,
          secondaryColor: null,
        })
      })
    }else{
      const firstOrder = {
          ...order, 
          design: order.design,
          amount: defaultAmount,
        };
      setOrder(firstOrder)
    }

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
    // console.log(order);
  }, [order]);

  function onBuyNow() {
    // save in localstorage the order
    localStorage.setItem("order", JSON.stringify(order));
    // redirect to checkout
    (localStorage.getItem("id")&&!localStorage.getItem("password")) 
    ?navigate(buyNowPath)
    :navigate(loginAndRegisterPath)
  }

  async function addToCart() {
    !(localStorage.getItem("id")&&!localStorage.getItem("password")) && navigate(loginAndRegisterPath)

    // if the cart is the default one, create a new one
    if (localStorage.getItem("id_shopping_cart")==1) {
      // get the cart from localstorage
      fetch(apiRoute + "/insert-anyone/shopping_carts",setRequestConfig("POST",{cart:"'"+JSON.stringify([{id:1,...order}])+"'"})).then(re=>re.json()).then(data=>{
        localStorage.setItem("id_shopping_cart",data.id);
        fetch(apiRoute + "/set-shopping-cart/"+data.id+"/"+localStorage.getItem("id"),setRequestConfig("PUT")).then(re=>re.json()).then(data=>{console.log(data);}
        ).catch(err=>{console.log(err);})

        console.log(data.msg);
        navigate(shoppingCartPath);
      }).catch(err=>{console.log(err);})
    }else{
      if (!idPreOrderToCustomise) {
        shoppingCartGet().then(cart=>{
          // add the new order to the cart
          cart.push({id:cart.length+1,...order});
          console.log(cart);
  
          // // update the cart
          shoppingCartSync(cart).then(d=>{
            console.log(d.msg);
            navigate(shoppingCartPath);
          })
        })
      }else{
        shoppingCartGet().then(cart=>{
          // add the new order to the cart
          const index = cart.findIndex(o=>o.id==idPreOrderToCustomise)
          cart[index] = {...order,id:idPreOrderToCustomise};
          console.log(cart);
  
          // // update the cart
          shoppingCartSync(cart).then(d=>{
            console.log(d.msg);
            navigate(shoppingCartPath);
          })
        })
      }
    }
  }
  return(
    <>
      <div className={` container-fluid ${styles.customiseBottleContainer}`}>
        <div className="row w-100 gap-4 gap-sm-0">
          <div className="col-12 col-sm-5 d-grid align-content-center">
            <img className="img-fluid" src={apiRoute+"/get_file/"+order.design?.img+"/-"} alt={order.design?.name} />
            <h2 className="mt-2">{order.design?.name}</h2>
          </div>

          <div className="col-12 col-sm-7 gap-3 px-sm-2 d-flex flex-column justify-content-center align-content-between">
            <div className="col-12">
              <Select options={wines} defaultValue={!idPreOrderToCustomise? {label:"Choose your wine",value:""} : {label:order.wine?.name,value:order.wine?.id}} label="Kind of wine:" onChange={(e)=>{setOrder({...order,wine:e})}} />
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
              <textarea className="form-control" rows={4} placeholder="Describe how do you want to customise your bottle..." value={order.msg} onChange={(e)=>{setOrder({...order,msg:e.target.value})}} ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-white d-block mx-auto my-2" onClick={addToCart} disabled={!readyToOrder}> {!idPreOrderToCustomise?"add to shopping cart":"Update order"}</button>
              <button className="btn d-block mx-auto" onClick={onBuyNow} disabled={!readyToOrder}> buy now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};
