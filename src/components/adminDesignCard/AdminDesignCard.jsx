import { apiRoute } from "../../const/const"
import styles from "./AdminDesignCard.module.css"

export default function AdminDesignCard({design,onDelete,onEdit}) {
  return(
    <div className="col-12 col-sm-6 col-md-4 col-lg-3" style={{maxWidth:"350px"}}>
      <div className={`card h-100 d-flex flex-column justify-content-between ${styles.card}`}>
        <div className=" card-img p-1">
          {<img className=" img-fluid p-2 rounded-4" src={ apiRoute +"/" +design.img +"/" + localStorage.getItem("token")} alt="Has no image" />}
        </div>
        <h5 className="card-title p-1">{design.id + ") " + design.name}</h5>
        <div className="card-body d-grid align-content-end justify-content-end">
        <small class={`form-text text-muted pb-1 ${styles.slidingText} ${styles.small}`}>{design.tags.map(t=>t.name).join(" / ")}</small>
          <div className="d-flex">
            <button type="button" className={`btn ${styles.btnFirst}`} onClick={()=>{onEdit(design)}}>edit</button>
            <a type="button" className={`btn ${styles.btnMiddle}`} href={apiRoute +"/" +(design.ai||design.dxf) +"/" + localStorage.getItem("token")}><i className="fi fi-br-download"></i></a>
            <button type="button" className={`btn btn-dark ${styles.btnLast}`} onClick={()=>{onDelete(design)}}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
};
