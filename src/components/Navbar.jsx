import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const links = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?category=Seating', label: 'Seating' },
  { to: '/shop?category=Lighting', label: 'Lighting' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { itemCount, toggleDrawer } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="nav">
      <div className="wrap nav-row">
        {<Link to="/" className="nav-mark">
          CasaNova
        </Link>}

        <nav>
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.label}>
                <NavLink to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button className="cart-toggle" onClick={toggleDrawer} aria-label="Open cart">
            Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </button>
          <button
            className="nav-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="wrap" style={{ paddingBottom: 20 }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 13, textTransform: 'uppercase' }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
