import { apiRoute } from '../../const/const';
import './catalog.css';
import CardCatalog from '../../components/cardCatalog/cardCatalog';
import { useEffect, useState } from 'react';

export default function Catalog() {
  const [designs, setDesigns] = useState([])

  useEffect(() => {
    fetch(apiRoute+"/read-anyone/designs").then(re=>re.json())
    .then(data=>setDesigns(data))
  }, []);


  return (
    <div className="container-md">
      <div className="container">
        <div className="row g-2">
          {designs.map(design=><CardCatalog design={design} key={design.id}/>)}
        </div>
      </div>
      
    </div>
  );
};
