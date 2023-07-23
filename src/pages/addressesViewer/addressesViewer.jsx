import { useRef, useState } from "react";
import Spinner from "../../components/spinner/spinner";
import SearchBar from "../../components/searchBar/searchBar";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import styles from "./addressesViewer.module.css";
import AddressViewerCard from "../../components/addressViewerCard/addressViewerCard";
import { apiRoute } from "../../const/const";
import { customSort, setRequestConfig } from "../../functions/functions";
import Modal from "../../components/modal/modal";
import { useEffect } from "react";

export default function AddressesViewer() {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [dataInEditor, setDataInEditor] = useState(null);
  const allAdresses = useRef([]);
  const showed = useRef(false);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    setLoading(true);
    fetch(`${apiRoute}/read/addresses`,setRequestConfig())
      .then(re => re.json())
      .then(data => {
        console.log(data);
        setAddresses(data);
        allAdresses.current = data;

        const idToWatch = urlParams.get('id');
        console.log(idToWatch);
        if(idToWatch && !showed.current){
          const address = data.find(a=>a.id==idToWatch);
          fetch(`${apiRoute}/read/users/${address.id_user}`,setRequestConfig()).then(re=>re.json()).then(userData=>{
            setDataInEditor({...address,user:userData[0] })
            showed.current = true;
          })
        }
      })
      .catch(err => {console.log(err)})
      .finally(() => {
        setLoading(false);
      })

  }, []);

  console.log(dataInEditor);
  function search (input) {
    console.log(addresses,input);
    console.log(input);
    if(input.length > 0){
      setAddresses(allAdresses.current.filter(address => (
        address.state.toLowerCase().includes(input.toLowerCase()) ||
        address.town.toLowerCase().includes(input.toLowerCase()) ||
        address.id_user.toString() == input.toLowerCase() ||
        address.id.toString().includes(input.toLowerCase()) 
      )));
    }else{
      setAddresses(allAdresses.current);
    }
  }

  
  return !loading ? 
    dataInEditor ?
      <Modal title={`Address # ${dataInEditor.id}`} options={[{label:"ok",value:0}]} resolveFunction={e=>setDataInEditor(null)} >
        <div className="container-sm px-sm-5">
          <div className="row">
            {
              <>
                {customSort(["id","id_user","state","town","neighbourhood","street","number"],Object.keys(dataInEditor)).map((key,index) => (
                  <div key={index} className="col-12 rounded-3 p-1 " style={{background:index%2==0?"rgba(255,0,0,0.05)":null}} >
                    <h3 className=" " >{key}:</h3>
                    {
                      !(typeof dataInEditor[key] == "object") ?
                      <p>{dataInEditor[key]}</p>
                      :
                      <ul>
                        {Object.keys(dataInEditor[key]).filter(k=>!(k=="password")).map((key2,index2) => (
                          <li key={index2} className=" text-start " >{key2}: {dataInEditor[key][key2]}</li>
                        ))}
                      </ul>
                    }
                  </div>
                ))}
              </>
            }
          </div>
        </div>
      </Modal>
      :
    (
      <div className="container-sm mt-1 ">
        <h1 className="text-center">Addresses viewer</h1>
        <hr className="my-4"/>
        <AdminHeader onSearch={i=>search(i)} />
        <div className="row gap-3 gap-sm-0 pt-3 d-flex justify-content-between">
          {/* address cards */}
          {addresses.map((address) => {
            return (
              <AddressViewerCard
                key={address.id}
                address={address}
                onWatch={(data) => setDataInEditor(data)}
              />
            )})
          }
        </div>
      </div>
    ) 
  : 
  <div className="d-flex justify-content-center align-content-center" style={{height: "90vh"}}>
    <Spinner/>
  </div>

};
