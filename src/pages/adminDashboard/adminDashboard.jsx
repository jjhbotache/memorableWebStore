import { useRef, useState } from "react";
import Modal from "../../components/modal/modal";
import {addresesViewerPath, adminsTools, apiRoute, designsAdminPath, pucharseOrdersAdminPath, realDesignsAdminPath} from "../../const/const"
import {getUserToken, logout, setRequestConfig, verifyIsWhereItShould } from "../../functions/functions"
import Spinner from "../../components/spinner/spinner";
import { Link, useNavigate } from "react-router-dom";



export default function AdminDashboard() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));


  const [checkingPassword, setCheckingPassword] = useState(false);


  const passwordInput = useRef()
  // verify that a password exists

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
              {adminsTools.map(tool =>(
                <li key={tool.name} className=" mb-2">
                  <Link className="btn" to={tool.path}>{tool.name}</Link>
                </li>
              )
              )}
            </ul>
              <hr />
              <h3>Other tools</h3>
            <ul>
              <li className=" mb-2">
                <Link className="btn" to={addresesViewerPath}>Addreses Viewer</Link>
              </li>
            </ul>

          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <hr />
            <button className="btn btn-dark btn-danger" onClick={e=>navigate(logout())}>Logout</button>
          </div>
        </div>
      </div>
      )
      :
      (
        <Modal title={`We need you to put your password:`}
        options={[{label:"done",value:1, disabled:checkingPassword}]}
        resolveFunction={checkPassword}
        >
          {checkingPassword?<Spinner/>:<input ref={passwordInput} type="password" className="form-control" placeholder="password"/>}
        </Modal>
      )}
    </>
  )
};
