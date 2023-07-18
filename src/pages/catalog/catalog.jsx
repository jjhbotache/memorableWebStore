import { apiRoute } from '../../const/const';
import './catalog.css';
import CardCatalog from '../../components/cardCatalog/CardCatalog';
import { useEffect, useState } from 'react';
import Spinner from '../../components/spinner/spinner';

export default function Catalog() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(apiRoute+"/read-anyone/designs").then(re=>re.json())
    .then(data=>setDesigns(data))
    .finally(()=>setLoading(false))
  }, []);

  function designClicked(design) {
    // save the design in the localStorage
    localStorage.setItem("design", JSON.stringify(design));
    window.location.href = "/customiseBottle";
  }

  return loading?
  <div className="container-md h-100 my-2">
    <div className="row h-100">
      <Spinner/>
    </div>
  </div>
  :
    <div className="container-md my-2">
      <div className="container">
        <div className="row d-flex justify-content-around gap-5">
          {designs.map(design=><CardCatalog design={design} key={design.id} onClick={()=>{designClicked(design)}}/>)}
        </div>
      </div>
      
    </div>
};
