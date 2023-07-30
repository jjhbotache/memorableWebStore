import React from 'react';
import styles from './landingPage.module.css';
import { Link } from 'react-router-dom';


export default function LandingPage() {
  return (
    <main className={`d-flex justify-content-center align-content-center flex-column text-center ${styles.main_lp}`}>
      <div className={styles.bg}>
        <h1 >MEMORABLE</h1>
        <h2>Best wines that you would taste</h2>
        <Link className={`btn mx-auto ${styles.a_lp}`} to='/catalog'>watch designs</Link>
      </div>
    </main>
  );
};
