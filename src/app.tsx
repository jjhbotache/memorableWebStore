import React from 'react';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

import './css/main.css'
import Home from './pages/home';
import About from './pages/about';

function App():JSX.Element {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App