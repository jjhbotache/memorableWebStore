import { useEffect } from 'react';
// import styles from './addressViewerCard.module.css';
import { useState } from 'react';
import { apiRoute } from '../../const/const';
import { setRequestConfig } from '../../functions/functions';
export default function AddressViewerCard({address,onDelete,onWatch}) {
  const [user, setUser] = useState();

  useEffect(() => {
    fetch(`${apiRoute}/read/users/${address.id_user}`,setRequestConfig())
      .then(re => re.json())
      .then(userData => {
        setUser(userData[0]);
      })
      .catch(err => {console.log(err)})
  }, []);


  return(
  <div className="col-12 col-sm-5 col-md-3 mt-sm-2">
    <div className="card h-100 p-1">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{address.id+") "+ address.state +"-"+ address.town}</h5>
        <p className="card-text">{ user?.first_name + " " + user?.last_name }</p>
        <div className="d-flex">
          <button type="button" className={`btn `} onClick={()=>{onWatch({...address,user})}}>more...</button>
        </div>
      </div>
    </div>
  </div>
  )
};
