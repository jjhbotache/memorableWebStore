import {verifyIsWhereItShould } from "../../const/const"

export default function AdminDashboard() {
  // verify that a password exists
  verifyIsWhereItShould()

  return <h1>admin dashboard</h1>
};
