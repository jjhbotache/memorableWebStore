import { useState } from "react";
import styles from "./searchBar.module.css";
import { useEffect } from "react";

export default function SearchBar({tags,onFilter,onAdd}) {
  const [filter,setFilter] = useState({input:"",tagsIds:new Set()});

  useEffect(() => {
    onFilter(filter);
  }, [filter]);
  return(
    <div className="row gap-1 justify-content-between align-items-center ">
        <div className="col-12 col-sm-10 ">
          <div className="row">
            <div className={`col-12 d-flex ${styles.group}`}>
              <input
                onChange={(e) => {
                  setFilter({...filter,input:e.target.value});
                }}
                type="text"
                className="form-control"
                aria-describedby="helpId"
                placeholder=""
              />
              <button type="button" className="btn btn-dark">
                <i className="fi fi-br-search d-grid align-items-center"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-1 d-flex justify-content-center gap-1">
          <div className="dropdown">
            <button className="btn btn-dark dropdown-toggle" type="button" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                  tags
                </button>
            <div className="dropdown-menu p-0" aria-labelledby="triggerId">
              {tags.map(t=>(
                <a key={t.id} className="dropdown-item rounded-2" style={{
                  background:filter.tagsIds.has(t.id)?"var(--colorTertiary)":"white",
                  border:filter.tagsIds.has(t.id)?"2px solid var(--colorPrimary)":"1px solid var(--colorSecondary)",
                }} 
                onClick={e=>{
                  e.preventDefault();
                  const tagsInEvent = filter.tagsIds
                  tagsInEvent.has(t.id)?
                    tagsInEvent.delete(t.id):
                    tagsInEvent.add(t.id)

                  setFilter({
                  ...filter,
                  tagsIds:tagsInEvent
                })}}
                >{t.name}</a>
              ))}
            </div>
          </div>
          {onAdd&&<button type="button" className="btn btn-white" onClick={onAdd}>add</button>}
        </div>
    </div>
  )
};
