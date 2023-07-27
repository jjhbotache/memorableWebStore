import { useState } from "react";
import "./loginAndRegister.css";
import Spinner from "../../components/spinner/spinner";
import LoginForm from "../../components/loginForm/loginForm";
import RegisterForm from "../../components/registerForm/registerForm";
import { adminDashboardPath, apiRoute, catalogPath, shippingAndPayementPath, userDashboardPath} from "../../const/const";
import {checkLastName, checkMail, checkName, setRequestConfig, verifyIsWhereItShould } from "../../functions/functions"


export default function LoginAndRegister() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  verifyIsWhereItShould();

  function loginAction(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log(data);

    setLoading(true);
    const dataToSend = JSON.stringify({
      id: data.id,
      phone: data.phone,
    });
    fetch(apiRoute + "/get_user", setRequestConfig("POST", dataToSend))
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // add each property to localStorage
        for (const key in result) {
          result[key] &&
            localStorage.setItem(key.toString(), result[key].toString());
        }
        // redirect to the corresponding dashboard
        window.location.assign(
          localStorage.password
            ? adminDashboardPath
            : localStorage.getItem("order")
            ? shippingAndPayementPath
            : catalogPath
        );
      })
      .catch((error) => {
        alert(
          "Seems like you are not registered or give the wrong credentials"
        );
        console.error("Error:", error);
      })
      .finally(setLoading(false));
  }

  function registerAction(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    console.log(data)
    const first_name = data.name
    const last_name = data.lastName
    const id = data.id
    const phone = data.phone
    const email = data.email


    // valitdations ------------------------------------------------------------------------------------

    if (id.length < 10 || phone.length < 10) {
      alert("Tu numero celular o de identificacion no es valido")
      return undefined;
    }
    else if (!checkMail(email)) {
      alert("Tu email no esta bien")
      return undefined;
    }
    else if (!checkName(first_name)) {
      alert("Tu nombre luce muy extraño!")
      return undefined;
    }
    else if (!checkLastName(last_name)) {
      alert("Tu apellido luce muy extraño!")
      return undefined;
    }
    alert("adding user")
    setLoading(true)
    
    fetch(apiRoute+"/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_name:`'`+first_name+`'`,
        last_name:`'`+last_name+`'`,
        id: id,
        phone: phone,
        email:`'`+email+`'`,
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        
        try {
          console.log(result.msg);
          if (result.msg.includes("Duplicate entry")) {
            alertRegister.classList.remove("d-none");
            alertRegister.querySelector("strong").textContent = "Esta cuenta ya existe";
          }
        } catch (error) {
          console.log(error);
        }
        alert("Se ha creado tu usuario correctamente")
        // reload
        window.location.reload()
      })
      .catch(error => 
        {console.error(error);
        }
      )
      .finally(e=>setLoading(false))
  }

  const formToRender = (
    <div className="container main-container">
      <div className="d-flex justify-content-center align-items-center main-container">
        
          {login ? (
            <LoginForm
              submitedFormFunction={loginAction}
              changeForm={() => {
                setLogin(!login);
              }}
            />
          ) : (
            <RegisterForm
              submitedFormFunction={registerAction}
              changeForm={() => {
                setLogin(!login);
              }}
            />
          )}
       
      </div>
    </div>
  );

  return <>{loading ? <Spinner></Spinner> : formToRender}</>;
}
