import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="center-page">
      <span className="eyebrow">404</span>
      <h1 className="h-display" style={{ fontSize: 36 }}>This piece isn't in the catalog.</h1>
      <Link to="/"><button className="btn btn-solid">Back home</button></Link>
    </div>
  )
}
