import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-mark">CasaNova</div>
            <p style={{ maxWidth: '32ch', fontSize: 14, color: 'var(--stone)' }}>
              Furniture and objects made from materials that age the way you'd want them to.
            </p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop?category=Seating">Seating</Link></li>
              <li><Link to="/shop?category=Lighting">Lighting</Link></li>
              <li><Link to="/shop?category=Tables">Tables</Link></li>
              <li><Link to="/shop?category=Textiles">Textiles</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/about">Materials</Link></li>
              <li><Link to="/about">Showroom visits</Link></li>
              <li><Link to="/about">Trade program</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/about">Shipping & returns</Link></li>
              <li><Link to="/about">Care guides</Link></li>
              <li><Link to="/about">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CasaNova Studio</span>
          <span>Designed & built in React</span>
        </div>
      </div>
    </footer>
  )
}
