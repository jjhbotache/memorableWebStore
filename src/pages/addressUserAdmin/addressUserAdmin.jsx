import { userDashboardPath } from "../../const/const";
import { verifyIsWhereItShould } from "../../functions/functions";

export default function AddressUserAdmin() {
  verifyIsWhereItShould("user");
  if(localStorage.getItem("password")) return window.location.assign(userDashboardPath)
  return <h1>address user admin</h1>;  
};
