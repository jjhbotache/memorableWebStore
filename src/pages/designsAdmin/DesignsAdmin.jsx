import React, { useEffect, useState } from 'react';
import Spinner from '../../components/spinner/spinner';
import AdminHeader from '../../components/adminHeader/AdminHeader';
import { apiRoute, designsAdminPath } from '../../const/const';
import { cleanObjectList, convertToFileName, loadPreview, setRequestConfig, verifyIsWhereItShould } from '../../functions/functions';
import AdminDesignCard from '../../components/adminDesignCard/AdminDesignCard';
import Modal from '../../components/modal/modal';
import { useRef } from 'react';
import styles from "./designsAdmin.module.css";
import SearchBar from '../../components/searchBar/searchBar';
import { useNavigate } from 'react-router-dom';

const DesignsAdmin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [designsToRender, setDesignsToRender] = useState([]);
  const [dataInEditor, setDataInEditor] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);

  const imgPreview = useRef();
  const tags = useRef([]);


  useEffect(() => {
    setLoading(true);
    Promise.all([
      new Promise((resolve,reject)=>fetch(apiRoute + "/read/designs",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
      new Promise((resolve,reject)=>fetch(apiRoute + "/read/tags",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
      new Promise((resolve,reject)=>fetch(apiRoute + "/read/tag_list",setRequestConfig()).then(re=>re.json()).then(d=>resolve(d)).catch(e=>reject(e))),
    ])
    .then(([designs,tags,tagList]) => {
      // append tags to designs
      setDesigns(designs.map(design=>{
        design.tags = tagList.filter(tag=>tag.id_design == design.id).map(taglist=>tags.find(t=>taglist.id_tag == t.id))
        return design
      }))
      setDesignsToRender(designs)
      setTagOptions(tags)
      // console.log("tag options");
      // console.log(tags);
      // console.log("taglist");
      // console.log(tagList);
      // console.log("taglist");
      // console.log(tagList);
      // console.log("designs");
      // console.log(designs);
    })
    .catch(err=>{
      console.log(err);
    }
    ).finally(()=>setLoading(false));
      
  }, []);

    

  async function putInEditor (design){
    setLoading(true);
    const tagsRelated = await fetch(apiRoute + "/read/tag_list/0/id,id_tag/id_design="+design.id,setRequestConfig()).then(re=>re.json())
    console.log(tagsRelated);
    
    
    tagsRelated.forEach((obj,indx) => {
      tags.current.push({
        ...tagsRelated[indx],
        ...{name:tagOptions.find(tag=>tag.id==obj.id_tag).name}
      })
    });
    console.log("tags.current");
    console.log(tags.current);
    setDataInEditor({...design,tags:new Set(tags.current.map(t=>t.id_tag))});


    setLoading(false)
  }

  async function editorModalSubmited(e){
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const dataObj = Object.fromEntries(data.entries());

    console.log(dataObj);
    console.log(dataInEditor);

    if (dataInEditor.id) {
      // update
      if (dataObj.ai.size > 0) {
        console.log(`Changing ai file`);
      
        const data = new FormData();
        data.append("ai",dataObj.ai)
        console.log(data);
        setLoading(true);
        await fetch(`${apiRoute}/update_design/${dataInEditor.id}/ai`,setRequestConfig())
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
        await fetch(`${apiRoute}/update_design/${dataInEditor.id}/img`,setRequestConfig())
        .then(response => response.json())
        .then((data) => {console.log(data);})  
        .catch(error => console.log(error))
        .finally(()=>{
          setLoading(false)
        })
      }
      if (!dataObj.name == "" ) {
        await fetch(
          `${apiRoute}/update_design/${dataInEditor.id}/name`,
          setRequestConfig("POST",JSON.stringify({new_data:`"${dataObj.name}"`}))
        )
        .then(response => response.json())
        .then((data) => console.log(data))  
        .catch(error => document.html.innerHTML = error)
        .finally(()=>{
          setLoading(false)
        })
      }

      tagOptions.forEach(async (tag) => {
        
        const inEditor = dataInEditor.tags.has(tag.id);
        const inBefore = tags.current.some(t => t.id_tag == tag.id);
          if (!(inEditor == inBefore)) {
            console.log("hola entre a cambiar tags");
            inBefore?
            await fetch(`${apiRoute}/delete/tag_list/${tags.current.find(t=>t.id_tag == tag.id).id}`,setRequestConfig("DELETE"))
            .then(response => response.json())
            .then((data) => console.log(data))
            .catch(error => console.log(error))
            :
            await fetch(`${apiRoute}/insert/tag_list`,setRequestConfig("POST",JSON.stringify({id_design:dataInEditor.id,id_tag:tag.id})))
            .then(response => response.json())
            .then((data) => console.log(data))
            .catch(error => console.log(error))

          }
      });
      navigate(designsAdminPath);
      
    }else{
      // create
      if (
        !(["",undefined].includes(dataObj.name))  &&
        (dataObj.img.size > 0)  &&
        (dataObj.ai.size > 0) 
        ) 
      {
        
        const data = new FormData();
        data.append('name', dataObj.name);
        data.append('filesName', convertToFileName(dataObj.name));
        data.append('img', dataObj.img);
        data.append('ai', dataObj.ai);

        setLoading(true);
        fetch(apiRoute+"/design",setRequestConfig("POST",data,true))
        .then(respuesta=>respuesta.json())
        .then(data=>{
          // alert("Created design");
          // asociate tags
          const designId = data.id;

          dataInEditor.tags.forEach(tagId => {
            fetch(`${apiRoute}/insert/tag_list`,setRequestConfig("POST",JSON.stringify({id_design:designId,id_tag:tagId})))
            .then(response => response.json())
            .then((data) => console.log(data))
            .catch(error => console.log(error))
          });

          navigate(designsAdminPath);
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

  function searchFunction(filter) {
    let designsToRender = designs;

    const toSearch = filter.input.trim()
      

    if(filter.input){
      designsToRender = designsToRender.filter(design=>design.name.toLowerCase().includes(filter.input.toLowerCase()))
      designsToRender = designs.filter(design=>(
        design.name.toLowerCase().includes(toSearch.toLowerCase()) ||
        design.id.toString().includes(toSearch.toLowerCase()) ||
        design.tags.some(tag=>tag.name.toLowerCase().includes(toSearch.toLowerCase()))
      ))
    }
    if(filter.tagsIds.size){
      filter.tagsIds.forEach(tID => {
        designsToRender = designsToRender.filter(design=>design.tags.some(tag=>tag.id == tID))
      });
    }
    setDesignsToRender(
      cleanObjectList(designsToRender)
      )
  }

  return !loading?
    !dataInEditor?
      <div className="container-md">
        <h1>Designs admin</h1>
        <hr />
        <div className="row mb-2">
          {/* <AdminHeader onSearch={input=>setSearch(input)} onAdd={() => setDataInEditor({})} /> */}
          <SearchBar tags={tagOptions} onFilter={searchFunction} onAdd={() => setDataInEditor({})}/>
          <small className="form-text text-muted">Tags: {tagOptions.map(t=>t.name).join("/")}</small>
        </div>
        <div className="row g-2 d-flex justify-content-around">
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
      resolveFunction={v=>{
        setDataInEditor(null)
        tags.current = []
      }}
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
              className={`img-fluid rounded-top ${styles.imgPreview}`}
            />
            <br/>
            <label htmlFor="img" className="form-label">Image</label>
            <input accept='.png' type="file" className="form-control p-1" name="img" onChange={e=>{
              if (e.target.files[0]) {
                setDataInEditor({
                  ...dataInEditor,
                  img:e.target.files[0],
                  name:e.target.files[0].name.replace(/-/g," ").split(".")[0]
                })
                loadPreview(imgPreview,e);
              }
            }}/>
          </div>
          <div className="mb-3">
            <label htmlFor="ai" className="form-label">Ai file</label>
            <input accept='.ai' type="file" className="form-control p-1" name="ai" onChange={e=>{
              
              if (e.target.files[0]) {
                setDataInEditor({...dataInEditor,ai:e.target.files[0]})
              }
            }}/>
          </div>
          <div className="mb-3 mx-5 px-5">
            <label className="form-label">Tags</label>
              {
                tagOptions.map(tag=>(
                  <div className={`d-flex justify-content-between rounded-2 `} key={tag.id} style={{background:tag.id % 2 === 0 ? 'rgba(0,0,0,.05)' : ''}}>
                    <label htmlFor={`tag-${tag.name}`} className="  m-2 form-label">{tag.name}</label>
                    <input name={`tag-${tag.name}`} className=" rounded-pill m-2 form-check-input" type="checkbox" checked={dataInEditor.tags?.has(tag.id)} onChange={
                      e=>{
                        const tags = dataInEditor.tags || new Set();
                        e.target.checked?tags.add(tag.id):tags.delete(tag.id)
                        setDataInEditor({...dataInEditor,tags:tags})
                      }
                    }/>
                  </div>
                ))
              }              
          </div>
          <button type="submit" className="btn btn-dark mx-4">{dataInEditor.id?"Update":"Create"}</button>
        </form>
      </Modal>
  :
    (
      <div className="d-flex justify-content-center align-content-center" style={{height: "90vh"}}>
        <Spinner />
      </div>
    )
}

export default DesignsAdmin;
