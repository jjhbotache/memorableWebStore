import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/adminHeader/AdminHeader';
import { apiRoute } from '../../const/const';
import { convertToFileName, loadPreview, setRequestConfig, verifyIsWhereItShould } from '../../functions/functions';
import AdminDesignCard from '../../components/adminDesignCard/AdminDesignCard';
import Modal from '../../components/modal/modal';
import { useRef } from 'react';
import LoadingView from '../../components/loadingView/loadingView';
import "./realDesigns.css"
// changed

export default function RealDesignsAdmin() {
  verifyIsWhereItShould("admin")
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [designsToRender, setDesignsToRender] = useState([]);
  const [dataInEditor, setDataInEditor] = useState(null);

  const imgPreview = useRef();


  useEffect(() => {
    setLoading(true);
    fetch(apiRoute + "/read/real_designs",setRequestConfig()).then(re=>re.json()).then(data=>{
      setDesigns(data)
      setDesignsToRender(data)
    }).catch(err=>{
      console.log(err);
    }
    ).finally(()=>setLoading(false));
      
  }, []);

  useEffect(() => {
    const toSearch = search.trim()
    if (toSearch) {
      setDesignsToRender(
        designs.filter(design=>(
          design.name.toLowerCase().includes(toSearch.toLowerCase()) ||
          design.id.toString().includes(toSearch.toLowerCase())
        ))
      );
    }else{
      setDesignsToRender(designs);
    }
  }, [search]);
    

  function putInEditor (design){
    setDataInEditor(design);
  }

  async function editorModalSubmited(e){
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataObj = Object.fromEntries(data.entries());

    console.log(dataObj);
    if (dataInEditor.id) {
      // update
      if (dataObj.dxf.size > 0) {
        console.log(`Changing dxf file`);
      
        const data = new FormData();
        data.append("dxf",dataObj.dxf)
        console.log(data);
        setLoading(true);
        await fetch(`${apiRoute}/update_real_design/${dataInEditor.id}/dxf`,setRequestConfig())
        .then(response => response.json())
        .then((data) => {console.log(data);})  
        .catch(error => console.log(error))
        .finally(()=>{
          setLoading(false)
        })
      }
      if (dataObj.img.size > 0) {
        console.log(`Changing img file`);
    
        const data = new FormData();
        data.append("img",dataObj.img)
        setLoading(true);
        await fetch(`${apiRoute}/update_real_design/${dataInEditor.id}/img`,setRequestConfig())
        .then(response => response.json())
        .then((data) => {console.log(data);})  
        .catch(error => console.log(error))
        .finally(()=>{
          setLoading(false)
        })
      }
      if (!dataObj.name == "" ) {
        await fetch(
          `${apiRoute}/update_real_design/${dataInEditor.id}/name`,
          setRequestConfig("POST",JSON.stringify({new_data:`"${dataObj.name}"`}))
        )
        .then(response => response.json())
        .then((data) => console.log(data))  
        .catch(error => document.html.innerHTML = error)
        .finally(()=>{
          setLoading(false)
        })
      }
      window.location.reload();
    }else{
      // create
      if (
        !(["",undefined].includes(dataObj.name))  &&
        (dataObj.img.size > 0)  &&
        (dataObj.dxf.size > 0) 
        ) 
      {
        
        const data = new FormData();
        data.append('name', dataObj.name);
        data.append('filesName', convertToFileName(dataObj.name));
        data.append('img', dataObj.img);
        data.append('dxf', dataObj.dxf);

        fetch(apiRoute+"/real_design",setRequestConfig("POST",data,true))
        .then(respuesta=>respuesta.text())
        .then(data=>{
          alert(data);
          window.location.reload();
        }).catch(e=>{alert("somethig went wrong:",e);
        }).finally(()=>{
          setLoading(false);
        });
      }else{
        alert("Please fill all the fields");
      }
    }
  }

  function deleteDesign(design){
    if (window.confirm(`Are you sure you want to delete ${design.name}?`)) {
      setLoading(true);
      fetch(apiRoute + "/delete_design/"+design.id,setRequestConfig("DELETE")).then(re=>re.json()).then(data=>{
        console.log(data);
        setDesignsToRender(designs.filter(d=>d.id!=design.id));
      }).catch(err=>{
        console.log(err);
      }
      ).finally(()=>setLoading(false));
    }
  } 

  return !loading?
    !dataInEditor?
      <div className="container">
        <h1>Real designs admin</h1>
        <hr />
        <AdminHeader onSearch={input=>setSearch(input)} onAdd={() => setDataInEditor({})} />
        <div className="row gap-2">
          {
            designsToRender.map(design =>(
            <AdminDesignCard key={design.id} design={design} 
            onDelete={design => {deleteDesign(design)}}
            onEdit={design => {putInEditor(design)}}
            />
          ))
          }
        </div>
      </div>
      :
      <Modal 
      title={dataInEditor.id?`Edit Design #${dataInEditor.id}`:"Add Design"}
      options={[{label:"Cancel",value:0}]}
      resolveFunction={v=>setDataInEditor(null)}
      >
         <form className=" d-flex flex-column align-content-center justify-content-center w-100" onSubmit={editorModalSubmited} >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control p-1" name="name" value={dataInEditor.name} onChange={e=>{setDataInEditor({...dataInEditor,name:e.target.value})}}/>
          </div>
          <div className="mb-3">
            <img
              ref={imgPreview}
              src={apiRoute + "/" + dataInEditor.img + `/${localStorage.getItem("token")}`}
              className="img-fluid rounded-top  imgPreview"
            />
            <br/>
            <label htmlFor="img" className="form-label">Image</label>
            <input accept='.png' type="file" className="form-control p-1" name="img" onChange={e=>{
              if (e.target.files[0]) {
                setDataInEditor({...dataInEditor,img:e.target.files[0]})
                loadPreview(imgPreview,e);
              }
            }}/>
          </div>
          <div className="mb-3">
            <label htmlFor="dxf" className="form-label">DXF file</label>
            <input accept='.dxf' type="file" className="form-control p-1" name="dxf" onChange={e=>{
              
              if (e.target.files[0]) {
                setDataInEditor({...dataInEditor,dxf:e.target.files[0]})
              }
            }}/>
          </div>
          <button type="submit" className="btn btn-dark mx-4">{dataInEditor.id?"Update":"Create"}</button>
        </form>
      </Modal>
  :
    (
      <LoadingView />
    )
}
