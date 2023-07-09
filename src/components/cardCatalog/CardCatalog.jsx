import { apiRoute } from "../../const/const"
import "./cardCatalog.css"

export default function CardCatalog({design}) {
  return(
    <div className="cardCatalog">
      <h2>{design.name}</h2>
      <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
      <p>{design.description}</p>
    </div>
  )
};
