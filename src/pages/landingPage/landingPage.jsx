import React from 'react';
import styles from './landingPage.module.css';


export default function LandingPage() {
  return (
    <main className={`d-flex justify-content-center align-content-center flex-column text-center ${styles.main_lp}`}>
      <div className={styles.bg}>
        <h1 >MEMORABLE</h1>
        <h2>Best wines that you would taste</h2>
        <a className={`btn mx-auto ${styles.a_lp}`} href='/catalog'>watch designs</a>
      </div>
    </main>
  );
};
