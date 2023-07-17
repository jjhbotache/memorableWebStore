import React, { useState } from 'react';
import styles from './counter.module.css';

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
    <div className='d-flex justify-content-center align-content-center h-100'>
      <button name="subtract" className={`btn ${styles.f}`} onClick={handleDecrease}>-</button>
      <h6 className={`d-grid align-content-center justify-content-center ${styles.m}`}>{number}</h6>
      <button name="add" className={`btn ${styles.l}`} onClick={handleIncrease}>+</button>
    </div>
  );
};

export default Counter;
