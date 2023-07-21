import { useState,useRef } from "react";
import { apiRoute } from "../../const/const"
import styles from "./cardCatalog.module.css"

export default function CardCatalog({design,onClick}) {
  const [classForTheTitle, setClassForTheTitle] = useState("");
  const title = useRef();

  if (title.current && classForTheTitle === "") {
    console.log(title.current);
    const height = title.current.scrollHeight;
    const parentHeight = title.current.parentNode.clientHeight - 16;
    console.log(height, parentHeight);
    if (parseInt( height) > parseInt(parentHeight)) {
      console.log("changed");
      setClassForTheTitle(styles.slideUp);
    }
  }
    

  return(
    <div className={`col-12 col-sm-5 col-md-3  ${styles.cardCatalog}`} onClick={onClick}>
      <img src={apiRoute+"/"+design.img+"/-"} alt={design.name} />
      <div className={styles.cardCatalogOverlay}>
        {/* get the height of the parent element */}
        <h2 ref={title} className={classForTheTitle}>{design.name}</h2>
      </div>
      <small className={`form-text text-muted pb-1 ${styles.slidingText}`}>{design.tags.map(t=>t.name).join(" / ") || " - no tags - "}</small>
    </div>
  )
};
