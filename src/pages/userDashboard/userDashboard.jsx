import { useEffect, useState } from "react";
import { apiRoute, loginAndRegisterPath} from "../../const/const"
import { logout, getUserToken, setRequestConfig, verifyIsWhereItShould, customSort } from "../../functions/functions"
import Spinner from "../../components/spinner/spinner";
import BuyItem from "../../components/buyItem/buyItem";

export default function Dashboard() {
  const [editingInfo, setEditingInfo] = useState(false);
  const [loadingUpdateInfo, setLoadingUpdateInfo] = useState(false);
  const [shoppings, setShoppings] = useState([]);
  const [loadingShoppings, setLoadingShoppings] = useState(false);
  

  verifyIsWhereItShould()
  
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
    fetch(apiRoute + "/read_pucharse_orders", setRequestConfig()).then(re=>re.json()).then((data) => {
      setShoppings(data)
      console.log(data);
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
          if (data[key] !== "") {
            key in ["phone","id"]
            ? infoToChange.push({[key]:data[key]})
            : infoToChange.push({[key]:"'"+data[key]+"'"})
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
      <h1>dashboard</h1>
      <div className="container-sm mx-sm-5 px-sm-5">
        <div className="row mx-sm-5 p-sm-5">
          <div className="accordion" id="userDashboadAccordion">
            {/* user */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Profile
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#userDashboad">
                <div className="accordion-body">
                <form className="container" onSubmit={onsubmitUserInfo}>
                  {userInfo}
                  {loadingUpdateInfo && <Spinner/>}
                  <button type="submit" className={"btn mt-1 " + (loadingUpdateInfo==true && "d-none")} disabled={loadingUpdateInfo}>{editingInfo?"save":"edit"}</button>
                </form>
                </div>
              </div>
            </div>
            {/* shoppings */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="true" aria-controls="collapse2">
                  Shoppings
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#userDashboad">
                <div className="accordion-body">
                  
                {
                localStorage.getItem("token")?
                shoppings.map(shopping =>
                  <BuyItem key={shopping.id} data={shopping} token={localStorage.getItem("token")} userId={localStorage.getItem("id")} />
                )
                :loadingShoppings?
                  <Spinner/>
                :
                <div className="d-grid gap-2">
                  <button type="button"className="btn w-sm-25 d-block mx-auto" onClick={e=>{
                    setLoadingShoppings(true)
                    getUserToken().then(e => {
                      fetch(apiRoute + "/read_pucharse_orders", setRequestConfig()).then(re=>re.json()).then((data) => {
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
          </div>
          <button type="button" className=" btn btn-dark mx-auto d-block mt-3 w-50" onClick={logout}>Logout</button>
        </div>
      </div>



      

    
    </>
  )
};
