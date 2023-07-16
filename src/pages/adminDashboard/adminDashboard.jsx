import { useRef, useState } from "react";
import Modal from "../../components/modal/modal";
import {apiRoute, getUserToken, setRequestConfig, verifyIsWhereItShould } from "../../const/const"
import Spinner from "../../components/spinner/spinner";

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem("token"));


  const [checkingPassword, setCheckingPassword] = useState(false);


  const passwordInput = useRef()
  // verify that a password exists
  verifyIsWhereItShould()

  function checkPassword(value) {
    console.log("checking...");
    const password = passwordInput.current.value
    setCheckingPassword(true)
    fetch(apiRoute + "/verify/"+localStorage.getItem("id"),setRequestConfig("POST",JSON.stringify({password:password}))).then(re=>re.json()).then((data) => {
      localStorage.setItem("token",data.tk)
      setToken(data.tk)
    })
    .catch((e) => {
      alert("Wrong password")
      console.log(e);
    })
    .finally(
      setCheckingPassword(false)
    )
  }

  
  return (
    <>
      {token?
      (
        <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Hello&nbsp;{localStorage.getItem("first_name")}</h1>
            <hr/>
          </div>
        </div>
        <div className="row">
          <div className="col-12 px-4">
            <h2 className="fs-3">Admin Dashboard tools</h2>
            <hr />
            {/* make a list of btns */}
            <ul>
              <li>
                <a className="btn" href="/pucharseOrdersAdmin">Pucharse orders admin</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      )
      :
      (
        <Modal title={`We need yoo to put your password:`}
        options={[{label:"done",value:1, disabled:checkingPassword}]}
        resolveFunction={checkPassword}
        >
          {checkingPassword?<Spinner/>:<input ref={passwordInput} type="password" className="form-control" placeholder="password"/>}
        </Modal>
      )}
    </>
  )
};
