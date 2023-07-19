import styles from "./SimpleDataCard.module.css";

export default function SimpleDataCard({data,onDelete,onEdit,onDisplayProperty="name"}) {
  return(
    <div className="col-12 col-md-6 col-lg-4 ">
      <div className="card h-100 d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between">
          <h5 className="card-title">{data.id + ") " + data[onDisplayProperty]}</h5>
          {
            onDisplayProperty=="color" && <div className={`d-block m-2 `} style={{backgroundColor: data.color, height: "50px", width: "50px", borderRadius: "1em", border: "var(--colorPrimary) solid 1px"}}></div>
          }
        </div>
        <div className="card-body d-grid align-content-end justify-content-end">
          <div className="d-flex">
            <button type="button" className={`btn ${styles.btnFirst}`} onClick={()=>{onEdit(data)}}>edit</button>
            <button type="button" className={`btn btn-dark ${styles.btnLast}`} onClick={()=>{onDelete(data)}}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
};
