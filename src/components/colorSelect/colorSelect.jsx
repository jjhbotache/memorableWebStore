import { useState } from "react";
import "./colorSelect.css";

export default function ColorSelect({label,colors,onChange}) {
  const [currentColor, setCurrentColor] = useState("transparent");


  function changed(e) {
    setCurrentColor(e.target.value)
    onChange(e)
  }
  return(
    <div className="input-group d-flex justify-content-between" >
      <div className="d-flex">
        <label className="input-group-text" htmlFor="inputGroupSelect01">{label}</label>
        <select onChange={changed}>
          {
          colors.map(color => (
            <option key={color} value={color} style={{ backgroundColor: color }}></option>
          ))
          }
        </select>
      </div>
      <div className="colorSelect-preview" style={{background:currentColor}}></div>
    </div>
  )
  
};
