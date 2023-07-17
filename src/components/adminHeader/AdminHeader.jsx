import { useState } from 'react';

export default function AdminHeader({onSearch, onAdd}) {

  return (
    
      <div className="row mb-3 justify-content-center align-items-center ">
        <div className="col-9 ">
          <div className="row">
            <div className="col-10">
              <input
                onChange={(e) => {
                  onSearch(e.target.value);
                }}
                type="text"
                className="form-control"
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
            <div className="col-2 d-flex justify-content-center align-content-center">
              <button type="button" className="btn btn-dark">
                <i className="fi fi-br-search d-grid align-items-center"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-3">
          <button
            onClick={(e) => onAdd()}
            className="btn "
          >
            Add
          </button>
        </div>
      </div>
      
  );
}