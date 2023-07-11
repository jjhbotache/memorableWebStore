// the links for the navbar and the routes
export const pagesToShowInNavbar = [
  {
    name:"home",
    path:"/",
  },
  {
    name:"catalog",
    path:"/catalog",
  },
  {
    name:"register",
    path:"/loginAndRegister",
  },
]
export const whereNotToDisplay = [
  "/"
]
export const apiRoute = "http://127.0.0.1:1000"

export const adminDashboardPath = "/adminDashboard";
export const userDashboardPath = "/userDashboard";
export const loginAndRegisterPath = "/loginAndRegister";
export const catalogPath = "/catalog";
export const customiseBottlePath = "/customiseBottle";
export const buyNowPath = "/buyNow";
export const shippingAndPayementPath = "/shippingAndPayement";



// functions =============================================================================

export function setRequestConfig(methodGotten="GET",bodyGotten,jsonFalse=false) {
  const config = {
    method: methodGotten, // puedes modificar el método según tu necesidad
  };
  if (bodyGotten) {config.body = bodyGotten}
  const headers = {'auth': localStorage.getItem("token")};
  if (methodGotten!="GET" && !jsonFalse) {headers['Content-Type'] = 'application/json' }
  config.headers = headers;
  return config;
}

export function verifyIsWhereItShould() {
  const url = window.location.pathname;
  switch (url) {
    case loginAndRegisterPath:
      if (localStorage.password || localStorage.email) {
        window.location.assign(localStorage.password?adminDashboardPath:userDashboardPath);
      }
      break;
    case adminDashboardPath:
      if (!localStorage.password || !localStorage.email) {
        window.location.assign(!localStorage.email?loginAndRegisterPath:userDashboardPath);
      }
      break;
    case userDashboardPath:
      if (!localStorage.email) {
        alert(!localStorage.email)
        window.location.assign(loginAndRegisterPath);
      }
      break;
  }
}

export async function getUserToken() {
  let thereIsToken = false;
  if (!localStorage.getItem("token")) {
    // make the api create a code and sent it to the email
    await fetch(apiRoute + "/verify-user/" + localStorage.getItem("email")+"/"+localStorage.getItem("id"))
    .then(response => response.json())
    .then(async json => {
        console.log(json);
        // when sended
        // ask for the code 
        const code = prompt(`We have sent you a code to your email: ${localStorage.getItem("email")} \npaste it in here: `);
        // try to get a token by giving the code to the api
        await fetch(apiRoute + "/test-user/" + code +"/"+localStorage.getItem("id"))
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
