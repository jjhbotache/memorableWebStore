import { useState } from "react";
import { apiRoute} from "../../const/const";
import {setRequestConfig} from "../../functions/functions"

export default function EditModalSelect({readOnly,label,tableName,labelProperty,valueProperty="id",firstObj={id:"",[labelProperty]:"Choose an option"},onChangeValue,optional}) {
  const [options, setOptions] = useState([firstObj]);
    
  // }
  return (
    <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
      <label htmlFor={tableName} className="form-label mb-0 align-baseline">{label}</label>
      <select disabled={readOnly} onClick={(e)=>{
        getOptions(tableName).then(options=>{
          const finalOptions = optional?[{id:"",[labelProperty]:"Choose an option"},...options]:options
          setOptions(finalOptions)
          finalOptions.length==1 && onChangeValue(finalOptions[0])  
          console.log(finalOptions);
        })
      }
      } className="form-select form-select" name={tableName} onChange={e=>{
        const obj = options.find(option=>option[valueProperty]==e.target.value)
        console.log(options);
        console.log(e.target.value);
        onChangeValue(obj||options[0])
      }}>
        {options.map((option)=>{
          // console.log(option);
          return <option key={option[valueProperty]} className="ms-2" value={option[valueProperty]}>{option[labelProperty]}</option>
        })}


      </select>
    </div>
  );

  function getOptions(tableName) {
    return fetch(apiRoute + "/read/" + tableName, setRequestConfig()).then(response => response.json()).then((options) => {
      if (tableName == "users") options = options.filter(option => !option.password)
      return options
      })
  }
};

