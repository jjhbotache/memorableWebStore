import styles from "./SimpleDataControlBtns.module.css";
export default function SimpleDataControlBtns({onEdit,onDelete}) {
  return(
    <div className="d-flex">
      <button type="button" className={`btn ${styles.btnFirst}`} onClick={onEdit}>edit</button>
      <button type="button" className={`btn btn-dark ${styles.btnLast}`} onClick={onDelete}>Delete</button>
    </div>
  )
};
