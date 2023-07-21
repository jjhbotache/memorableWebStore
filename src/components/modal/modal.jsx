import React, { useState,useEffect } from 'react';
import './modal.css';
export default function Modal({title="",resolveFunction, options=[],cancelable, children}) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowModal(true);
    }, 10); // Retraso para permitir que se aplique el efecto de transición
    return () => clearTimeout(timeoutId); // Limpiar el timeout en el desmontaje del componente
  }, []);

  return(
    <article className='modal-container'>
      <div className="modal-bg">
      </div>
      <div className={`modal-window  ${showModal ? "show" : ""}`}>
        <h2 className='w-100 mb-4'>{title}</h2>
        <div className="children">
          {children}
        </div>
        <div className="w-100 px-2 d-flex justify-content-around flex-wrap mt-3">
          {options.map((option) => (
            <button className="btn " key={option.value} disabled={option.disabled} onClick={() => {resolveFunction(option.value);}}>{option.label}</button>
          ))}
          {cancelable && <button className="btn " onClick={() => {resolveFunction(0);}}>Cancel</button>}
        </div>
      </div>
    </article>
  )
};
