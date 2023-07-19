import { apiRoute } from "../../const/const"
import styles from "./cardCatalog.module.css"

export default function CardCatalog({design,onClick}) {
  return(
    <div className={`col-12 col-sm-5 col-md-3  ${styles.cardCatalog}`} onClick={onClick}>
      <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
      <h2 className="">{design.name}</h2>
    </div>
  )
};
