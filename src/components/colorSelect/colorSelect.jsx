import { useState } from "react";
import "./colorSelect.css";

export default function ColorSelect({label,colors,onChange}) {
  const [currentColor, setCurrentColor] = useState("transparent");


  function changed(e) {
    setCurrentColor(colors.find(color => color.id === parseInt(e.target.value)).name)
    onChange(colors.find(color => color.id==e.target.value))
  }

  return(
    <div className="input-group d-flex justify-content-between" >
      <div className="d-flex">
        <label className="input-group-text" htmlFor="inputGroupSelect01">{label}</label>
        <select onChange={changed}>
          <option>❔</option>
          {
          colors.map(color => (
            <option key={color.id} value={color.id} style={{ backgroundColor: color.name }}>&nbsp;</option>
          ))
          }
        </select>
      </div>
      <div className="colorSelect-preview" style={{background:currentColor}}></div>
    </div>
  )
  
};
