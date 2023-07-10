import { apiRoute } from "../../const/const"
import "./cardCatalog.css"

export default function CardCatalog({design,onClick}) {
  return(
    <div className="cardCatalog" onClick={onClick}>
      <h2>{design.name}</h2>
      <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
    </div>
  )
};
