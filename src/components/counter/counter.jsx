import React, { useState } from 'react';
import styles from './counter.module.css';
import { useEffect } from 'react';

// made by chatgpt

export default function Counter({ firstValue=1,onChange, minValue=1 }) {

  const [number, setNumber] = useState(firstValue);

  const handleIncrease = () => {
    const newNumber = number + 1;
    setNumber(newNumber);
    onChange(newNumber);
  };
  
  const handleDecrease = () => {
    if (number > minValue) {
      const newNumber = number - 1;
      setNumber(newNumber);
      onChange(newNumber);
    }
  };

  console.log("First value and number",firstValue,number);
  return (
    <div className='d-flex justify-content-center align-content-center h-100'>
      <button name="subtract" className={`btn d-grid align-content-center justify-content-center ${styles.f}`} onClick={handleDecrease}>-</button>
      <h6 className={`d-grid align-content-center justify-content-center ${styles.m}`}>{number}</h6>
      <button name="add" className={`btn d-grid align-content-center justify-content-center ${styles.l}`} onClick={handleIncrease}>+</button>
    </div>
  );
};


