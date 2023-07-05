// import ReactDOM from 'react-dom/client'
import React from 'react'
import '../css/main.css'
import { Link } from 'react-router-dom'

// return an element
function Home():JSX.Element {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">About</Link>
    </div>
  )
}
export default Home


