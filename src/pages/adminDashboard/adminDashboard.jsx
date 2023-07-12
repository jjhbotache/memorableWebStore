import Modal from "../../components/modal/modal";
import {verifyIsWhereItShould } from "../../const/const"

export default function AdminDashboard() {
  // verify that a password exists
  verifyIsWhereItShould()

  const token = localStorage.getItem("token");
  console.log(token);
  return (
    token?"hola":
    (
      <Modal title={`We are going to send you a code to ${localStorage.getItem("email")}`}
      resolveFunction={(value) => {
        console.log(value);
      }}
      ></Modal>
    )
  )
      // (token?
      // <div className="container">
      //   <div className="row">
      //     <div className="col-12">
      //       <h1>Hello&nbsp;{localStorage.getItem("first_name")}</h1>
      //       <hr/>
      //     </div>
      //   </div>
      //   <div className="row">
      //     <div className="col-12 px-4">
      //       <h2>Admin Dashboard tool</h2>
      //       <hr/>
      //       {/* make a list of btns */}
      //       <ul>
      //         <li>
      //           <a className="btn" href="/pucharseOrdersAdmin">Pucharse orders admin</a>
      //         </li>
      //       </ul>
      //     </div>
      //   </div>
      // </div>
      // :<h2>You are not logged in</h2>)
};
