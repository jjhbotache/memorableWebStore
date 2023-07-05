// create an element
import React from 'react'
import '../css/main.css'
import { Link } from 'react-router-dom'

// return an element
function About():JSX.Element {
  // wait 3 secs and then reasign the location to home
  setTimeout(() => {
    window.location.href = "/"
  }, 3000)

  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </div>
  )
}
export default About