import { useState } from "react";
import "./loginAndRegister.css"
import Spinner from "../../components/spinner/spinner";
import LoginForm from "../../components/loginForm/loginForm";
import RegisterForm from "../../components/registerForm/registerForm";
import { adminDashboardPath, apiRoute, catalogPath, shippingAndPayementPath, userDashboardPath} from "../../const/const";
import {setRequestConfig, verifyIsWhereItShould } from "../../functions/functions"


export default function LoginAndRegister() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  verifyIsWhereItShould()

  function loginAction(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)

    setLoading(true)
    const dataToSend = JSON.stringify({
          id: data.id,
          phone: data.phone
    })
    fetch(apiRoute + "/get_user", setRequestConfig("POST",dataToSend))
    .then(response => response.json())
    .then(result => {
      console.log(result);
      // add each property to localStorage
      for (const key in result) {
        result[key] && localStorage.setItem(key.toString(),(result[key]).toString())
      }
      // redirect to the corresponding dashboard 
      window.location.assign(
        localStorage.password?
        adminDashboardPath
        :
          localStorage.getItem("order")?
          shippingAndPayementPath
          :catalogPath
      )

    })
    .catch(error => {
      alert("Seems like you are not registered or give the wrong credentials");
      console.error('Error:', error);
    })
    .finally(
      setLoading(false)
    )
  }

  function registerAction(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)
  }

  const formToRender = (
    <div className="container d-flex justify-content-center mt-md-5">
      <div className="col-10 col-sm-8 col-md-4 d-flex justify-content-center">
        {login?
        <LoginForm submitedFormFunction={loginAction} changeForm={()=>{setLogin(!login)}}/>
        :
        <RegisterForm submitedFormFunction={registerAction} changeForm={()=>{setLogin(!login)}}/>}
      </div>
    </div>
  )
    
  
  
  return(
    <>
      {
        loading
        ?<Spinner></Spinner>
        :formToRender
      }
      
    </>
  )
};
