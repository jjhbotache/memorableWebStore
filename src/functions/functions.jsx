import * as consts from "../const/const.jsx";

const { loginAndRegisterPath, adminDashboardPath, userDashboardPath } = consts;

export function setRequestConfig(methodGotten="GET",bodyGotten,jsonFalse=false) {
  const config = {
    method: methodGotten, // puedes modificar el método según tu necesidad
  };
  if (bodyGotten) {config.body = bodyGotten}
  const headers = {'auth': localStorage.getItem("token")};
  if (localStorage.getItem("password")!=="-") {headers["password"] = localStorage.getItem("password")}
  if (methodGotten!="GET" && !jsonFalse) {headers['Content-Type'] = 'application/json' }
  config.headers = headers;
  return config;
}

export function verifyIsWhereItShould(pageFor="public") {
  // public, admin, user
  const url = window.location.pathname;

  switch (url) {
    case loginAndRegisterPath:
      if (localStorage.getItem("password") || localStorage.getItem("email")) {
        window.location.assign(localStorage.getItem("password")?adminDashboardPath:userDashboardPath);
      }
      break;
    case adminDashboardPath:
      if (!localStorage.getItem("password") || !localStorage.getItem("email")) {
        window.location.assign(!localStorage.getItem("email")?loginAndRegisterPath:userDashboardPath);
      }
      break;
    case userDashboardPath:
      if (!localStorage.getItem("email")) {
        window.location.assign(loginAndRegisterPath);
      }
      break;
  }

  if (
    (pageFor=="admin" && !localStorage.getItem("password"))||
    (pageFor=="user" && !localStorage.getItem("email"))
    ) {
    window.location.assign(loginAndRegisterPath);
  }


}

export async function getUserToken() {
  let thereIsToken = false;
  if (!localStorage.getItem("token")) {
    // make the api create a code and sent it to the email
    await fetch(consts.apiRoute + "/verify-user/" + localStorage.getItem(consts.email)+"/"+localStorage.getItem(consts.id))
    .then(response => response.json())
    .then(async json => {
        console.log(json);
        // when sended
        // ask for the code 
        const code = prompt(`We have sent you a code to your email: ${localStorage.getItem(consts.email)} \npaste it in here: `);
        // try to get a token by giving the code to the api
        await fetch(consts.apiRoute + "/test-user/" + code +"/"+localStorage.getItem(consts.id))
        .then(response => response.json())
          .then((json) => {
            // save the token
            console.log(json);
            const key = Object.keys(json)[0];
            localStorage.setItem(key,json[key]);
            thereIsToken = true
          })
          .catch((error) => {
            // reject the code
            console.log(error);
            alert("wrong code");
            return false
          });
        })
    .catch((error) => {
      // reject operation
      console.log(error);
      alert("there was an error trying to send you the code");
      return false
    })
  } 
  else{
    console.log("token already exists");
    thereIsToken = true
  }
  return thereIsToken
}

export function logout() {
  localStorage.clear();
  window.location.assign(loginAndRegisterPath)
}

export function copyToClipboard(str) {
  // Crear un elemento de texto temporal
  const tempInput = document.createElement("textarea");
  tempInput.value = str;

  // Agregar el elemento al DOM
  document.body.appendChild(tempInput);

  // Seleccionar y copiar el contenido del elemento
  tempInput.select();
  document.execCommand("copy");

  // Eliminar el elemento temporal del DOM
  document.body.removeChild(tempInput);
}

export function loadPreview(imgTag, e) {
  const reader = new FileReader();
  reader.onloadend = () => {
    imgTag.current.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

export function convertToFileName(str) {
  // console.log(str);

  str = (str.split(" ").join("_")).replace(/[\\/*<>| ]/g, "_");
  str = str.replace(/[?:"]/g, "-");
  str = str.substring(0,str.indexOf(".")!=-1?str.indexOf("."):str.length)
  // console.log("real name: ",str);
  return str;
}