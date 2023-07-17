import { apiRoute } from "../../const/const"
import styles from "./AdminDesignCard.module.css"

export default function AdminDesignCard({design,onDelete,onEdit}) {
  return(
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card">
        <div className=" card-img p-1">
          {<img className=" img-fluid p-2 rounded-4" src={ apiRoute +"/" +design.img +"/" + localStorage.getItem("token")} alt="Has no image" />}
        </div>
        <div className="card-body">
          <h5 className="card-title">{design.id + ") " + design.name}</h5>
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