import { useState } from 'react';

export default function AdminHeader({onSearch, onAdd}) {

  return (
    
      <div className="row justify-content-center align-items-center ">
        <div className="col-9 ">
          <div className="row">
            <div className="col-10 pe-0 d-flex justify-content-around">
              <input
                onChange={(e) => {
                  onSearch(e.target.value);
                }}
                type="text"
                className="form-control rounded-end-0 w-100"
                aria-describedby="helpId"
                placeholder=""
              />
            </div>
            <div className="col-2 ps-0 d-flex">
              <button type="button" className="btn btn-dark w-100 rounded-start-0 p-0">
                <i className="fi fi-br-search d-grid align-items-center"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="col-3">
          <button
            onClick={(e) => onAdd()}
            className="btn "
            disabled={onAdd === undefined}
          >
            Add
          </button>
        </div>
      </div>
      
  );
}