import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, removeItem, setQty, subtotal } = useCart()

  return (
    <>
      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={closeDrawer} />
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <h3>Your cart</h3>
          <button className="drawer-close" onClick={closeDrawer}>Close</button>
        </div>

        {lines.length === 0 ? (
          <div className="empty-state">Your cart is empty. Go find something well made.</div>
        ) : (
          <div className="drawer-lines">
            {lines.map((l) => (
              <div className="drawer-line" key={l.lineId}>
                <img src={l.image} alt={l.name} />
                <div>
                  <div className="drawer-line-name">{l.name}</div>
                  <div className="drawer-line-meta">
                    Qty {l.qty} · {`Rs. ${l.price.toLocaleString()}`}
                  </div>
                  <button className="drawer-line-remove" onClick={() => removeItem(l.lineId)}>
                    Remove
                  </button>
                </div>
                <div className="qty-control">
                  <button onClick={() => setQty(l.lineId, l.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.lineId, l.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="drawer-foot">
          <div className="drawer-subtotal">
            <span>Subtotal</span>
            <span>{`Rs. ${subtotal.toLocaleString()}`}</span>
          </div>
          <Link to="/cart" onClick={closeDrawer}>
            <button className="btn btn-block">View cart</button>
          </Link>
          <Link to="/checkout" onClick={closeDrawer}>
            <button className="btn btn-solid btn-block" disabled={lines.length === 0}>
              Checkout
            </button>
          </Link>
        </div>
      </aside>
    </>
  )
}
