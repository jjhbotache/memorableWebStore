import React, { useState } from 'react';

// made by chatgpt

const Counter = ({ firstValue=0,onChange }) => {
  const [number, setNumber] = useState(firstValue);

  const handleIncrease = () => {
    setNumber(prevNumber => prevNumber + 1);
    onChange(number + 1);
  };

  const handleDecrease = () => {
    if (number > 0) {
      setNumber(prevNumber => prevNumber - 1);
      onChange(number - 1);
    }
  };

  return (
    <div className='d-flex justify-content-center align-content-center'>
      <button name="subtract" className="btn" onClick={handleDecrease}>-</button>
      <h6 className='align-self-center'>{number}</h6>
      <button name="add" className="btn" onClick={handleIncrease}>+</button>
    </div>
  );
};

export default Counter;
