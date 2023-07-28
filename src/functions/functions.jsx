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
  str=str.toString()
  navigator.clipboard.writeText(str)
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

export function ponerPuntos(numero) {
  // made by bign
  // Convertir el número a una cadena
  let cadena = numero.toString();
  // Crear un arreglo vacío para guardar los dígitos con puntos
  let arreglo = [];
  // Contar cuántos dígitos hay en la cadena
  let digitos = cadena.length;
  // Recorrer la cadena de derecha a izquierda
  for (let i = digitos - 1; i >= 0; i--) {
    // Agregar el dígito actual al arreglo
    arreglo.unshift(cadena[i]);
    // Si quedan más de tres dígitos y el índice actual es múltiplo de tres, agregar un punto
    if (i > 0 && (digitos - i) % 3 == 0) {
      arreglo.unshift(".");
    }
  }
  // Unir el arreglo en una nueva cadena y devolverla
  return arreglo.join("");
}

export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`);
}

export function areObjectsEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (obj1 == null || obj2 == null) {
    return undefined;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function shoppingCartSync(newCartObj) {
    // update the cart
    return await fetch(consts.apiRoute + "/update-anyone/shopping_carts/"+localStorage.getItem("id_shopping_cart"),setRequestConfig("PUT",{cart:JSON.stringify(newCartObj)})).then(re=>re.json())
}

export async function shoppingCartGet() {
  return await fetch(consts.apiRoute + "/read-anyone/shopping_carts/"+localStorage.getItem("id_shopping_cart")).then(re=>re.json())
  .then(d=>{
    // console.log(d);
    return JSON.parse(d[0].cart)
  })
}

export function checkMail(email){
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(email)) {
		return true;
	}
	return false;
}

export function checkName(nombre) {
  const exregNombre = /^[a-zA-ZÀ-ÿ]+( [a-zA-ZÀ-ÿ]+){0,5}$/;
  // Verificar si el nombre cumple con la expresión regular
  if (exregNombre.test(nombre)) {
    return true;
  } else {
    return false;
  }
}

export function checkLastName(apellido) {
  const exregApellido = /^[a-zA-ZÀ-ÿ]+ ?([a-zA-ZÀ-ÿ]+)?$/;
  // Verificar si el apellido cumple con la expresión regular
  if (exregApellido.test(apellido)) {
    return true;
  } else {
    return false;
  }
}

function getPermissions(lsItems=["email","password","id","first_name","last_name","phone"]) {
  // for each item in lsItems
  // if it is not in the localStorage
  // redirect to loginAndRegisterPath

  for (const item of lsItems) {
    if (!localStorage.getItem(item)) {return {
      name:"public",
      adminLevel:0
    }}
  }
  return  (localStorage.getItem("password")&&localStorage.getItem("token"))?
  {
    name:"admin",
    adminLevel:2
  }
  :{
    name:"user",
    adminLevel:1
  }
   
}

export function loader(permissionsNeeded={name:"public",adminLevel:0}) {
  // public, admin, user
  const currentPermissions = getPermissions();

  if (currentPermissions.adminLevel<permissionsNeeded) {
    if(currentPermissions.name=="user") window.location.assign(userDashboardPath);
    window.location.assign(loginAndRegisterPath);
    return null
  }
 return null     

}