import { useState } from "react";
import { apiRoute, getUserToken, loginAndRegisterPath, setRequestConfig, verifyIsWhereItShould } from "../../const/const"
import Spinner from "../../components/spinner/spinner";

export default function Dashboard() {
  const [editingInfo, setEditingInfo] = useState(false);
  const [loadingUpdateInfo, setLoadingUpdateInfo] = useState(false);
  verifyIsWhereItShould()
  
  const userInfo = Object.keys(localStorage).map((key) => {
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
      <div key={key}>
        <label htmlFor={key}>{key}:</label>
        <input className="mb-2" type="text" name={key} placeholder={localStorage[key]} disabled={!editingInfo || (readOnly.includes(key))} />
      </div>
    )
  })

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
      <form onSubmit={onsubmitUserInfo}>
        {userInfo}
        {loadingUpdateInfo && <Spinner/>}
        <button type="submit" className={"btn mt-1 " + (loadingUpdateInfo==true && "d-none")} disabled={loadingUpdateInfo}>{editingInfo?"save":"update"}</button>
      </form>
    
    </>
  )
};
