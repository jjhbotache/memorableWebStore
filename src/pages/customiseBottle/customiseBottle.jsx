import ColorSelect from "../../components/colorSelect/colorSelect";
import { apiRoute, catalogPath } from "../../const/const";
import "./customiseBottle.css";

export default function CustomiseBottle() {
  // redirect to the catalog if the isnt a design in the localStorage
  // alert(!localStorage.getItem("design"));
  const primaryColors = [
    "red",
    "blue",
    "darkmagenta"
  ];
  const secondaryColors = [
    "white",
    "black",
    "silver"
  ];
  
  const design = JSON.parse(localStorage.getItem("design"));
  // if (!design) window.location.assign(catalogPath)

  // localStorage.removeItem("design");
  console.log(design);
  return(
    <>
      <h1>customise bottle</h1>
      <div className="container" id="customiseBottle-container">
        <div className="row">
          <div className="col-12">
            <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
            <h2>{design.name}</h2>
          </div>

          <div className="col-12">
            <div className="input-group">
              <label className="input-group-text" htmlFor="inputGroupSelect01">Tipo de vino</label>
              <select className="form-select" id="inputGroupSelect01">
                <option value="">Seleccione su tipo di vino</option>
                <option value="1">Airen</option>
                <option value="2">Cabernet Sauvignon</option>
                <option value="3">Carmenere</option>
                <option value="4">Malbec</option>
                <option value="5">Merlot</option>
                <option value="6">Moscatel</option>
                <option value="7">Rose</option>
                <option value="8">Tempranillo</option>
              </select>
            </div>
          </div>
          

          <div className="col-12">
            <ColorSelect label={"Primary packing color"} colors={primaryColors} onChange={(e)=>{console.log(e);}}/>
          </div>

          <div className="col-12">
            <ColorSelect label={"Secondary packing color"} colors={secondaryColors} onChange={(e)=>{console.log(e);}}/>
          </div>

          <div className="col-12">
            <button className="btn btn-white d-block mx-auto my-2" disabled> add to shopping cart</button>
            <button className="btn d-block mx-auto"> buy now</button>
          </div>
          
        </div>
      </div>
    </>
  )
};
