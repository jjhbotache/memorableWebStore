import React from 'react';

const Select = ({ options, onChange ,label,defaultValue}) => {
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    onChange(options.find(option => option.id==selectedValue));
  };

  return (
    <div className="input-group">
      <label className="input-group-text" htmlFor="inputGroupSelect01">{label}</label>
      <select className="form-select" id="inputGroupSelect01" onChange={handleSelectChange}>
        <option value={defaultValue.value}>{defaultValue.label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
