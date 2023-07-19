import * as consts from "../const/const.jsx";

const { loginAndRegisterPath, adminDashboardPath, userDashboardPath } = consts;

export function setRequestConfig(methodGotten="GET",bodyGotten,jsonFalse=false) {
  // if bodyGotten is an obj it will be converted to json string
  if (typeof bodyGotten == "object" && !jsonFalse) {bodyGotten = JSON.stringify(bodyGotten)}
  
  
  const config = {
    method: methodGotten, // puedes modificar el método según tu necesidad
  };
  const headers = {'auth': localStorage.getItem("token")};
  
  if (bodyGotten) {config.body = bodyGotten}
  if (localStorage.getItem("password")!=="-") {headers["password"] = localStorage.getItem("password")}
  if (methodGotten!="GET" && !jsonFalse) {headers['Content-Type'] = 'application/json' }
  config.headers = headers;
  // console.log(config);
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
    await fetch(consts.apiRoute + "/verify-user/" + localStorage.getItem("email")+"/"+localStorage.getItem("id"))
    .then(response => response.json())
    .then(async json => {
      console.log(json);
      // when sended
      // ask for the code 
        const code = prompt(`We have sent you a code to your email: ${localStorage.getItem("email")} \npaste it in here: `);
        // try to get a token by giving the code to the api
        await fetch(consts.apiRoute + "/test-user/" + code +"/"+localStorage.getItem("id"))
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
  str=str.toString()
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

export function cleanObjectList(objectList) {
  const cleanedList = [];
  const idsSeen = new Set();

  for (const obj of objectList) {
    if (!idsSeen.has(obj.id)) {
      idsSeen.add(obj.id);
      cleanedList.push(obj);
    }
  }

  return cleanedList;
}

export function customSort(order, list) {
  return list.sort((a, b) => {
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);

    if (indexA === -1) {
      return 1; // Mover elementos no especificados al final
    }

    if (indexB === -1) {
      return -1; // Mover elementos no especificados al final
    }

    return indexA - indexB;
  });
}
