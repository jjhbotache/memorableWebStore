import React from 'react';
import './landingPage.css';
import '../../styles/layout.css';
import '../../styles/config.css';


export default function LandingPage() {
  return (
    <main className="main-lp d-flex justify-content-center align-content-center flex-column text-center">
      <h1 className='title-lp title'>MEMORABLE</h1>
      <h2 className='capitalize mb-3'>Best wines that you would taste</h2>
      <a className="btn mx-auto a-lp" href='/catalog'>Watch Designs</a>
    </main>
  );
};
