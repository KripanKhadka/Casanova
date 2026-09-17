import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { lines, removeItem, setQty, subtotal } = useCart()

  if (lines.length === 0) {
    return (
      <div className="center-page">
        <span className="eyebrow">Your cart</span>
        <h1 className="h-display" style={{ fontSize: 36 }}>It's empty in here.</h1>
        <Link to="/shop"><button className="btn btn-solid">Browse the collection</button></Link>
      </div>
    )
  }

  return (
    <div className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{lines.length} item{lines.length > 1 ? 's' : ''}</span>
          <h2 className="h-display">Your cart</h2>
        </div>
      </div>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.lineId}>
              <td>
                <div className="cart-row-product">
                  <img src={l.image} alt={l.name} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{l.name}</div>
                    <span className="swatch" style={{ background: l.color, display: 'inline-block', marginTop: 6 }} />
                  </div>
                </div>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{`Rs. ${l.price.toLocaleString()}`}</td>
              <td>
                <div className="qty-control">
                  <button onClick={() => setQty(l.lineId, l.qty - 1)} aria-label="Decrease quantity">−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.lineId, l.qty + 1)} aria-label="Increase quantity">+</button>
                </div>
              </td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{`Rs. ${(l.price * l.qty).toLocaleString()}`}</td>
              <td>
                <button className="drawer-line-remove" onClick={() => removeItem(l.lineId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
        <div style={{ width: 320 }}>
          <div className="order-line" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
            <span>Subtotal</span>
            <span>{`Rs. ${subtotal.toLocaleString()}`}</span>
          </div>
          <div className="order-line" style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <Link to="/checkout">
            <button className="btn btn-solid btn-block" style={{ marginTop: 18 }}>
              Proceed to checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
