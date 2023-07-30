import { useNavigate, useSearchParams } from "react-router-dom";
import { addressUserAdminPath, apiRoute, userDashboardPath } from "../../const/const";
import { setRequestConfig, verifyIsWhereItShould } from "../../functions/functions";
import { useEffect, useRef, useState } from "react";
import Spinner from "../../components/spinner/spinner";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AddressItem from "../../components/addressItem/addressItem";
import Modal from "../../components/modal/modal";

export default function AddressUserAdmin() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editorModal, setEditorModal] = useState(null);
  const [states, setStates] = useState([]);
  const [towns, setTowns] = useState([]);
  
  const allAddresses = useRef(addresses);

  verifyIsWhereItShould("user");
  if(localStorage.getItem("password")) return navigate(userDashboardPath)

  useEffect(() => {


    setLoading(true);
    fetch(`${apiRoute}/user/read/addresses`,setRequestConfig()).then(re=>re.json()).then(data=>{
      console.log(data);
      allAddresses.current = data;
      setAddresses(allAddresses.current);
    }).catch(err=>console.log(err))
    .finally(()=>setLoading(false))
      
  

    setLoading(true);
    fetch("https://www.datos.gov.co/api/id/xdk5-pm3f.json?$query= select  distinct departamento,c_digo_dane_del_departamento order by departamento asc").then(re=>re.json()).then(data=>{
      setStates(data)
      console.log(data);
    }).catch(err=>console.log(err))
    .finally(()=>setLoading(false))







  }, []);

  useEffect(() => {
    if (search) {
      setLoading(true);
      const filteredAddresses = allAddresses.current.filter(address => address.name.toLowerCase().includes(search.toLowerCase()));
      setAddresses(filteredAddresses);
      setLoading(false);
    } else {
      setAddresses(allAddresses.current);
    }
  }, [search]);

  

  function formSubmited (e){
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    console.log(data);
    const emptyKey = Object.keys(data).find(key => !(!!data[key]));
    // if some space is empty, alert it
    if(emptyKey) return alert("Some space is empty: "+emptyKey);
    console.log("updating...");
    if (editorModal.id) {
      setLoading(true);
      fetch(`${apiRoute}/user/update/addresses/${editorModal.id}`,setRequestConfig("PUT",data)).then(re=>re.json()).then(data=>{
        console.log(data);
        alert("updated")
        navigate(addressUserAdminPath);
        
      })
      .catch(err=>console.log(err))
      .finally(()=>setLoading(false))
    }else{
      // for each field, if its an string, surrond it with quotes
      for (const key in data) {
        if (typeof data[key] === "string") {
          data[key] = `'${data[key]}'`;
        }
      }
      
      setLoading(true);
      fetch(`${apiRoute}/user/create/addresses`,setRequestConfig("POST",data)).then(re=>re.json()).then(data=>{
        console.log(data);
        alert("created")
        navigate(addressUserAdminPath);
      })
      .catch(err=>console.log(err))
      .finally(()=>setLoading(false))
    }

    
  }

  function updateEditorModal(e){
    const { name, value } = e.target;
    console.log(name,value);
    setEditorModal({...editorModal,[name]: value,})
  };

  function getTowns(e){
    console.log(editorModal.state);
    console.log(towns.length);
    if (!!editorModal.state && !towns.length) {
      setLoading(true);
      fetch(`https://www.datos.gov.co/api/id/xdk5-pm3f.json?$query= select  distinct municipio,c_digo_dane_del_municipio where departamento = '${editorModal.state}' order by municipio asc`).then(re=>re.json()).then(data=>{
        setTowns(data)
        console.log(data);
      }).catch(err=>console.log(err))
      .finally(()=>setLoading(false))
    }
  } 
  

  console.log(editorModal);
  return !loading ? 
  !editorModal ?
    // main page
    <div className="container-md">
      <h1>address user admin</h1>
      <hr />
      <div className="row mb-2">
        <AdminHeader onSearch={i=>setSearch(i)} onAdd={()=>{setEditorModal({})}} />
      </div>  
      <div className="row g-2 d-flex justify-content-around">
          {
            addresses.map(address =>(
            <AddressItem key={address.id} address={address} onEdit={()=>{setEditorModal(address);console.log(address);}} onDelete={()=>{console.log("deleting: ",address)}} />
          ))
          }
      </div>
    </div>
    :
    // editor modal
    <Modal title={editorModal.id?`Editing "${editorModal.name}" address`:"Adding address" } cancelable resolveFunction={v=>setEditorModal(null)}>
      <div className="container">
        <form onSubmit={formSubmited} >
          {/* name */}
          <div className="mb-3 row">
            <label htmlFor="name" className="form-label">Address name</label>
            <input type="text" className="form-control" name="name" value={editorModal.name} onChange={updateEditorModal} />
          </div>
          {/* state */}
          <div className="mb-3 row">
            <label htmlFor="state" className="form-label">State</label>
            <select  className="form-select form-select-md" name="state" value={editorModal.state} onChange={e=>{
              setEditorModal({...editorModal,town: "",state: e.target.value});
              setTowns([]);
            }} >
              {editorModal.state || <option value="">Choose your state</option>}
              {
                states.map(state=>(
                  <option key={state.c_digo_dane_del_departamento} value={state.departamento}>{state.departamento}</option>
                ))
              }
            </select>
          </div>
          {/* town */}
          <div className="mb-3 row">
            <label htmlFor="town" className="form-label">Town</label>
            <select className="form-select form-select-md" name="town" value={editorModal.town} onChange={updateEditorModal} onClick={getTowns} >
              {
                towns.length>0 ?
                towns.map(town=>(
                  <option key={town.c_digo_dane_del_municipio} value={town.municipio}>{town.municipio}</option>
                  ))
                  :
                  !editorModal.town ? <option value="">Choose your town</option>
                  :<option value={editorModal.town}>{editorModal.town}</option>                
              }
            </select>
          </div>
          {/* neighbourhood */}
          <div className="mb-3 row">
            <label htmlFor="neighbourhood" className="form-label">Neighbourhood</label>
            <input type="text" className="form-control" name="neighbourhood" value={editorModal.neighbourhood} onChange={updateEditorModal} />
          </div>
          {/* commune */}
          <div className="mb-3 row">
            <label htmlFor="commune" className="form-label">Commune</label>
            <input type="number" className="form-control mx-auto" name="Commune" value={editorModal.commune} onChange={updateEditorModal} />
          </div>
          {/* street and number */}
          <div className="mb-3 row">
            <label className="form-label">Street and number</label>
            <div className="d-flex p-0">
              <input type="number" className="form-control" name="street" value={editorModal.street} style={{minWidth:"20vw"}} onChange={updateEditorModal} placeholder="37" />
              <input type="text" className="form-control" name="number" value={editorModal.number} onChange={updateEditorModal} placeholder="3 MZ9"/>
            </div>
          </div>
          {/* complement */}
          <div className="mb-3 row">
            <label htmlFor="complement" className="form-label">Complement</label>
            <textarea placeholder="Explain and give more information to find your address" rows={4} className="form-control" maxLength={200} name="complement" value={editorModal.complement} style={{resize: "none"}} onChange={updateEditorModal}/>
          </div>
          {/* submit */}
          <div className="mb-3 row">
            <button type="submit" className="btn w-75 mx-auto" style={{maxWidth:"200px"}}>Submit</button>
          </div>
        </form>
      </div>
    </Modal>

  :
    // loading page
    <div className="d-flex justify-content-center align-content-center" style={{height: "90vh"}}>
      <Spinner />
    </div>
};
