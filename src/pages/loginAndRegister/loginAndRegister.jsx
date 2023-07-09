import { useState } from "react";
import "./loginAndRegister.css"
import Spinner from "../../components/spinner/spinner";
import LoginForm from "../../components/loginForm/loginForm";
import RegisterForm from "../../components/registerForm/registerForm";
import { apiRoute, userDashboardPath } from "../../const/const";


export default function LoginAndRegister() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  function loginAction(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)

    setLoading(true)
    fetch(apiRoute + "/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: data.id,
        phone: data.phone
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // if (!result.msg) {
        //   if (!result.password) {delete result.password}
        //   for (const key in result) {
        //     localStorage.setItem(key.toString(),(result[key]).toString())
        //   }
        // }
        // if (checkLocalStorageItems(userInfoKeys)) {
        //   if (localStorage.getItem("password")) {
        //     window.location.assign(userDashboardPath); 

        //   }else {
        //     // window.location.assign(dashboardHtmlFileName); 
        //     window.location.assign("/catalog"); 
        //   }
        // }else {
        //   alertLogin.classList.remove("d-none");
        //   alertLogin.querySelector("strong").textContent = "Parece que esas no son tus credenciales o aun no haces parte de nuestro equipo";
        //   // return undefined;
        // }

        })
        .catch(error => {
          alert("Lo sentimos, parece que hubo un error");
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

  const formToRender = login?
    <LoginForm submitedFormFunction={loginAction} changeForm={()=>{setLogin(!login)}}/>
    :
    <RegisterForm submitedFormFunction={registerAction} changeForm={()=>{setLogin(!login)}}/>
    
  
  
  return(
    <>
      <h1>register</h1>
      {
        loading
        ?<Spinner></Spinner>
        :formToRender
      }
      
    </>
  )
};
