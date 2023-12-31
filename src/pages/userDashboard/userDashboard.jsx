import { useEffect, useState } from "react";
import { addressUserAdminPath, adminDashboardPath, apiRoute, loginAndRegisterPath} from "../../const/const"
import { logout, getUserToken, setRequestConfig, verifyIsWhereItShould, customSort } from "../../functions/functions"
import Spinner from "../../components/spinner/spinner";
import BuyItem from "../../components/buyItem/buyItem";
import AddressItem from "../../components/addressItem/addressItem";
import "./userDashboard.css"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  // verifyIsWhereItShould()
  if (localStorage.getItem("password")) return window.location.assign(adminDashboardPath)


  const [editingInfo, setEditingInfo] = useState(false);
  const [loadingUpdateInfo, setLoadingUpdateInfo] = useState(false);
  const [shoppings, setShoppings] = useState([]);
  const [loadingShoppings, setLoadingShoppings] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadignAddresses, setLoadignAddresses] = useState(false);
  const navigate = useNavigate();
  

  
  const userInfo = customSort(["id","first_name","last_name","email","phone"],Object.keys(localStorage)).map((key) => {
    // skip some properties
    const keysToKeep = [
      "first_name",
      "last_name",
      "id",
      "email",
      "phone",
    ]
    const readOnly = [
      "email",
      "id",
    ]

    if (!keysToKeep.includes(key)) return null
    return(
      <div key={key} className="mb-3">
        <label htmlFor={key} className="form-label">{key}:</label>
        <input type="text" className="form-control" name={key} defaultValue={localStorage[key]} disabled={!editingInfo || (readOnly.includes(key))} />
      </div>
    )
  })

  useEffect(() => {
    setLoadingShoppings(true)
    setLoadignAddresses(true)
    Promise.all([
      fetch(apiRoute + "/read_pucharse_orders", setRequestConfig()).then(re=>re.json()),
      fetch(apiRoute + "/user/read/addresses", setRequestConfig()).then(re=>re.json())
    ]).then(([shoppingsData, addressesData]) => {
      setShoppings(shoppingsData)
      // save shoppings in local storage
      console.log(shoppingsData);
      setAddresses(addressesData)
      console.log(addressesData);
    }).finally(() => {
      setLoadingShoppings(false)
      setLoadignAddresses(false)
    })
  }, []);

  function onsubmitUserInfo(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    if (Object.keys(data).length === 0) {
      setEditingInfo(true)
    }else {
      // find some property with a value diferent of ""
      
      if (Object.keys(data).some(key => data[key] !== "") && confirm("Are you sure of save the new data?")) {
        setLoadingUpdateInfo(true)
        const infoToChange = []
        Object.keys(data).forEach(async key => {
          console.log(key, data[key]);
          if (data[key] !== "") {
            key in ["phone","id"]
            ? infoToChange.push({[key]:parseInt(data[key])})
            : infoToChange.push({[key]:
              // "'"+
              data[key]
              // +"'"
            })
          }
        })
        console.log(infoToChange);
        // fetch
        getUserToken().then((thereIsToken) => {
          if (thereIsToken) {
            infoToChange.forEach(async obj => {
              // if (obj.hasOwnProperty("email")) {
              //   await fetch(apiRoute + "/verify-user/"+data.email+"/"+localStorage.getItem("id")).then((response) => response.json())
              //   .then(async json =>{
              //     console.log(json);
              //     const code = prompt(`We have sent you a code to your email: ${data.email} \npaste it in here: `);
              //     await fetch(apiRoute + "/test-user/"+code+"/"+localStorage.getItem("id")).then((response) => response.json())
              //     .then((json) => {
              //       obj.newEmailToken = json.token
              //     })
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //     alert("there was an error with the new email");
              //     // location.reload();
              //   })
              // }


              fetch(
                apiRoute + "/user/update",
                setRequestConfig("PUT", JSON.stringify(obj))
              )
                .then((json) => json.json())
                .then((response) => {
                  localStorage.clear();
                  window.location.assign(loginAndRegisterPath);
                })
                .catch((error) => console.log(error)) 
            })
          }
        })
        .finally(() => setLoadingUpdateInfo(false))

      }else{
        window.location.reload()
      }
    }
  }

  return (
    <>
      <h1 className="text-center mt-2">dashboard</h1>
      <div className="container-sm mx-sm-5 px-sm-5">
        <div className="row p-sm-5">
          <div className="accordion" id="userDashboadAccordion">
            {/* user */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading1">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Profile
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="heading1" data-bs-parent="#userDashboadAccordion">
                <div className="accordion-body">
                <form className="container" onSubmit={onsubmitUserInfo}>
                  {userInfo}
                  {loadingUpdateInfo && <Spinner/>}
                  <button type="submit" className={"btn btn-white mt-1 " + (loadingUpdateInfo==true && "d-none")} disabled={loadingUpdateInfo}>{editingInfo?"save":"edit"}</button>
                </form>
                </div>
              </div>
            </div>
            {/* shoppings */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="true" aria-controls="collapse2">
                  Shoppings
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#userDashboadAccordion">
                <div className="accordion-body">
                  
                {
                localStorage.getItem("token")?
                <div className="accordion" id="shoppingsAccordion">
                  {shoppings.map(shopping =>
                    <div key={shopping.id} className="mb-2">
                      <BuyItem data={shopping} token={localStorage.getItem("token")} userId={localStorage.getItem("id")} accordionContainerId="shoppingsAccordion" />
                    </div>
                  )}
                </div>
                :loadingShoppings?
                  <Spinner/>
                :
                <div className="d-grid gap-2">
                  <button type="button"className="btn btn-white w-sm-25 d-block mx-auto" onClick={e=>{
                    setLoadingShoppings(true)
                    getUserToken().then(e => {
                      fetch(apiRoute + "/read_pucharse_orders", setRequestConfig()).then(re=>re.json()).then((data) => {
                        setShoppings([])
                        setShoppings(data)
                        console.log(data);
                      })
                    }).finally(() => {
                      setLoadingShoppings(false)
                    })}
                  }>see shoppings</button>
                </div>

                }
                </div>
              </div>
            </div>
            {/* addresses */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading3">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="true" aria-controls="collapse3">
                  Addresses
                </button>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3">
                <div className="accordion-body">
                {
                localStorage.getItem("token")?(
                  <>
                  <div className="d-flex align-items-center flex-column" >
                    <a href={addressUserAdminPath} className="btn btn-white">Go to editor</a>
                    <small className="form-text text-muted mb-4">Create, edit or delete your addresses from here</small>
                  </div>
                  {addresses.map(address => (<AddressItem address={address} key={address.id}/>))}
                  </>
                  )
                  :loadignAddresses?
                    <Spinner/>
                  :
                    <div className="d-grid gap-2">
                      <button type="button"className="btn btn-white w-sm-25 d-block mx-auto" onClick={e=>{
                        setLoadignAddresses(true)
                        getUserToken().then(e => {
                          fetch(apiRoute + "/user/read/addresses/"+localStorage.getItem("id"), setRequestConfig()).then(re=>re.json()).then((data) => {
                            setAddresses(data)
                            console.log(data);
                          })
                        }).finally(() => {
                          setLoadingShoppings(false)
                        })}
                      }>see addresses</button>
                    </div>

                }
                </div>
              </div>
            </div>
          </div>
          <button type="button" className=" btn btn-dark mx-auto d-block mt-3 w-50" onClick={e=>navigate(logout())}>Logout</button>
        </div>
      </div>
    </>
  )
};
