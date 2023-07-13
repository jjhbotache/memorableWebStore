export default function EditModalSelect({label,tableName,getOptionsForSelect,labelProperty,valueProperty,firstObj}) {
  
  return (
    <div className="mb-3 d-flex flex-column align-content-center justify-content-start gap-2">
      <label htmlFor={tableName} className="form-label mb-0 align-baseline">{label}</label>
      <select onClick={(e)=>{getOptionsForSelect(e.target,labelProperty,valueProperty,[firstObj.id])}} className="form-select form-select" name={tableName}>
        <option className="ms-2" value={firstObj.id}>{firstObj[labelProperty]}</option>
      </select>
    </div>
  );
};

