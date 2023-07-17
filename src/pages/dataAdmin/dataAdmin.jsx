import { useState } from "react";
import Modal from "../../components/modal/modal";
import Spinner from "../../components/spinner/spinner";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import SimpleDataCard from "../../components/simpleDataCard/SimpleDataCard";
import { useEffect } from "react";
import { cleanObjectList, customSort, setRequestConfig, verifyIsWhereItShould } from "../../functions/functions";
import { apiRoute } from "../../const/const";
import { useRef } from "react";
import styles from "./dataAdmin.module.css";

export default function DataAdmin({title="no title",tableToAdmin="", onDisplayProperty,propertiesToSearch=["id"],customOrderToModal}) {
  const [loading, setLoading] = useState(false);
  const [dataInEditor, setDataInEditor] = useState(null);
  const [dataGotten, setDataGotten] = useState([]);  
  const [cardsToRender, setCardsToRender] = useState([]);
  const [search, setSearch] = useState("");
  const creating = useRef(undefined);



  const fieldsToEdit = useRef([]);

  verifyIsWhereItShould("admin")

  useEffect(() => {
    setLoading(true);
    fetch(apiRoute + "/read/"+tableToAdmin,setRequestConfig()).then(re=>re.json()).then(data=>{
      console.log(data);
      setDataGotten(data)
      setCardsToRender(data)
      // for each data, get the fields to edit (exept id)
      try {
        fieldsToEdit.current = Object.keys(data[0])
        if (customOrderToModal) fieldsToEdit.current = customSort(customOrderToModal,fieldsToEdit.current)
        console.log(fieldsToEdit.current);
      } catch (error) {console.log(error);}

      console.log(fieldsToEdit.current);
    }).catch(err=>{
      console.log(err);
    }
    ).finally(()=>setLoading(false));
  }, []);

  useEffect(() => {
    
    const toSearch = search.trim()
    if (toSearch) {
      const filteredResults = [];
      propertiesToSearch.forEach(property => {
        filteredResults.push(
          ...dataGotten.filter(data=>(data[property].toString().toLowerCase().includes(toSearch.toLowerCase()))
        ))
      });
      filteredResults.push(
          ...dataGotten.filter(data=>(data[onDisplayProperty].toLowerCase().includes(toSearch.toLowerCase()))
      ))
      setCardsToRender(cleanObjectList(filteredResults))
    }else{
      setCardsToRender(dataGotten);
    }
  }, [search]);

  function editorSubmited(e){
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataObj = Object.fromEntries(data.entries());
    console.log(dataObj);

    // check each property value and surround it with quotes if it is a string
    for (const key in dataObj) {  if (typeof dataObj[key] === "string") dataObj[key] = `"${dataObj[key]}"`  }

    console.log(creating.current);
    console.log((dataInEditor.id && (creating.current==undefined)));

    if (dataInEditor.id && !creating.current) {
      // editing
      fetch(apiRoute + "/update/"+tableToAdmin+"/"+dataInEditor.id,setRequestConfig("PUT",dataObj)).then(re=>re.json()).then(data=>{
        console.log(data);
        window.location.reload();
      }).catch(err=>{
        console.log(err);
      });
    }else{
      // adding
      fetch(apiRoute + "/insert/"+tableToAdmin,setRequestConfig("POST",dataObj)).then(re=>re.json()).then(data=>{
        console.log(data);
        window.location.reload();
      }).catch(err=>{console.log(err);});
    }

  }

  function deleteData(data){
    if (window.confirm(`are you sure you want to delete the data #${data.id} ?`)) {
      fetch(apiRoute + "/delete/"+tableToAdmin+"/"+data.id,setRequestConfig("DELETE")).then(re=>re.json()).then(data=>{
        console.log(data);
        window.location.reload();
      }).catch(err=>{console.log(err);});
    }
  }




  return !loading?
    !dataInEditor?
    <div className="container-md">
      <h1>{title}</h1>
      <hr />
      <AdminHeader onSearch={input=>setSearch(input)} onAdd={() => {
        setDataInEditor({})
        if (tableToAdmin=="users") {creating.current = true}
      }} />
      <div className="row gap-2">
          {
            cardsToRender.map(data =>(
            <SimpleDataCard key={data.id} data={data} 
            onDisplayProperty={onDisplayProperty}
            onDelete={data => {deleteData(data)}}
            onEdit={data => {
              setDataInEditor(data)
              if (tableToAdmin=="users") creating.current = false
            }}
            />
          ))
          }
      </div>
    </div>
    :
        // editor
      <Modal title={dataInEditor.id?`Editing #${dataInEditor.id}`:"Adding"}
      options={[{label:"Cancel",value:0}]}
      resolveFunction={v=>setDataInEditor(null)}>
        <form className="d-flex flex-column align-content-center justify-content-center w-100" onSubmit={editorSubmited}>
          {
            fieldsToEdit.current.map(field=>(
              <div className="mb-3 d-flex justify-content-center flex-column align-content-center" key={field}>
                <label htmlFor={field} className="form-label">{field}</label>
                <input disabled={(field=="id")&&(!(tableToAdmin=="users")||!creating.current)?true:false} type="text" className="form-control" id={field} name={field} value={dataInEditor[field]} onChange={e=>setDataInEditor({...dataInEditor,[field]:e.target.value})}/>
                {
                  ["packing_colors","secondary_packing_colors"].includes(tableToAdmin) && <div className={`d-block mx-auto mt-2 ${styles.preview}`} style={{backgroundColor: dataInEditor[field],}}></div>
                }
              </div>
            ))
          }
          <button type="submit" className="btn btn-dark mx-4">Submit</button>
        </form>
      </Modal>
  :
  (
    <div className="d-flex justify-content-center align-content-center" style={{height: "90vh"}}>
      <Spinner />
    </div>
  )

};
