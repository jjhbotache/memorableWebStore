import { apiRoute, catalogPath } from "../../const/const";
import "./customiseBottle.css";

export default function CustomiseBottle() {
  // redirect to the catalog if the isnt a design in the localStorage
  // alert(!localStorage.getItem("design"));
  
  const design = JSON.parse(localStorage.getItem("design"));
  if (!design) window.location.assign(catalogPath)

  localStorage.removeItem("design");
  console.log(design);
  return(
    <>
      <h1>customise bottle</h1>
      <div className="container" id="customiseBottle-container">
        <div className="row">
          <h2>{design.name}</h2>
          <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
        </div>
      </div>
    </>
  )
};
