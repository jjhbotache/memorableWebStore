import { apiRoute } from '../../const/const';
import styles from './catalog.module.css';
import CardCatalog from '../../components/cardCatalog/CardCatalog';
import { useEffect, useState } from 'react';
import Spinner from '../../components/spinner/spinner';
import { ponerPuntos, setRequestConfig } from '../../functions/functions';
import SearchBar from '../../components/searchBar/searchBar';
import Modal from '../../components/modal/modal';


export default function Catalog() {
  const [designs, setDesigns] = useState([])
  const [tagOptions, setTagOptions] = useState([]);
  const [designsToRender, setDesignsToRender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const [warned, setWarned] = useState(localStorage.getItem("priceWarned"));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      new Promise((resolve,reject)=>fetch(apiRoute + "/read-anyone/designs",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
      new Promise((resolve,reject)=>fetch(apiRoute + "/read-anyone/tags",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
      new Promise((resolve,reject)=>fetch(apiRoute + "/read-anyone/tag_list",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
      new Promise((resolve,reject)=>fetch(apiRoute + "/open-csv-data/bottle_price",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d.data)).catch(e=>reject(e))),
    ])
    .then(([designs,tags,tagList,price]) => {
      // append tags to designs
      setDesigns(designs.map(design=>{
        design.tags = tagList.filter(tag=>tag.id_design == design.id).map(taglist=>tags.find(t=>taglist.id_tag == t.id))
        return design
      }))
      setDesignsToRender(designs)
      setTagOptions(tags)
      setPrice(ponerPuntos(price))
    })
    .catch(err=>{
      console.log(err);
    }
    ).finally(()=>setLoading(false));


    fetch("https://www.datos.gov.co/resource/xdk5-pm3f.json").then(re=>re.json()).then(d=>{
      console.log(d)
    }
    )

  }, []);

  function designClicked(design) {
    // save the design in the localStorage
    localStorage.setItem("design", JSON.stringify(design));
    window.location.href = "/customiseBottle";
  }

  function search(filter) {
    let designsToRender = designs;
    if(filter.input){
      designsToRender = designsToRender.filter(design=>design.name.toLowerCase().includes(filter.input.toLowerCase()))
    }
    if(filter.tagsIds.size){
      filter.tagsIds.forEach(tID => {
        designsToRender = designsToRender.filter(design=>design.tags.some(tag=>tag.id == tID))
      });
    }
    setDesignsToRender(designsToRender)
  }

  return loading?
  // spinner
  <div className="container-md h-100 my-2">
    <div className="row h-100">
      <Spinner/>
    </div>
  </div>
  :
  // catalog
    localStorage.getItem("priceWarned")?
    <div className="container-md my-2">
      <div className="container">
        <div className="row">
          <div className="col-12 my-4">
            <SearchBar tags={tagOptions} onFilter={search}/>
          </div>
        </div>
        <div className="row d-flex justify-content-around gap-5">
          {designsToRender.map(design=><CardCatalog design={design} key={design.id} onClick={()=>{designClicked(design)}}/>)}
        </div>
      </div>
    </div>
    :
    <Modal title="" options={[{label:"Ok",value:1}]}  resolveFunction={e=>{
      localStorage.setItem("priceWarned",true)
      setWarned(true)
      }}>
      <h2>Each bottle costs:</h2>
      <h3>{price}</h3>
    </Modal>
};
