import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { createOrder } from '../api.js'
import esewaLogo from './esewa.png'

const SHIPPING = 45

export default function Checkout() {
  const { lines, subtotal } = useCart()
  const [placing, setPlacing] = useState(false)
  const [step, setStep] = useState('details')
  const [customer, setCustomer] = useState({ email: '', first_name: '', last_name: '', address: '', city: '', postal_code: '' })
  const [error, setError] = useState('')

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />
  }

  function handleDetailsSubmit(e) {
    e.preventDefault()
    setStep('payment')
  }

  async function handlePlaceOrder() {
    setPlacing(true)
    setError('')
    try {
      const payment = await createOrder({
        customer,
        payment_method: 'esewa',
        items: lines.map((line) => ({ product_id: line.id, color: line.color, quantity: line.qty })),
      })
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = payment.payment_url
      Object.entries(payment.payment_fields).forEach(([name, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (requestError) {
      setPlacing(false)
      setError(requestError.message)
    }
  }

  const total = subtotal + SHIPPING
  return (
    <div className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Last step</span>
          <h2 className="h-display">Checkout</h2>
        </div>
      </div>

      {step === 'details' ? (
        <form className="checkout-grid" onSubmit={handleDetailsSubmit}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, textTransform: 'uppercase', marginBottom: 18 }}>
              Contact
            </h3>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required placeholder="you@example.com" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 13, textTransform: 'uppercase', margin: '28px 0 18px' }}>
              Shipping address
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first">First name</label>
                <input id="first" required placeholder="Asha" value={customer.first_name} onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="last">Last name</label>
                <input id="last" required placeholder="Rao" value={customer.last_name} onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input id="address" required placeholder="Street and house number" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input id="city" required placeholder="Kathmandu" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="postal">Postal code</label>
                <input id="postal" required placeholder="44600" value={customer.postal_code} onChange={(e) => setCustomer({ ...customer, postal_code: e.target.value })} />
              </div>
            </div>

           
          </div>

          <div className="order-summary">
            <h3>Order summary</h3>
            {lines.map((l) => (
              <div className="order-line" key={l.lineId}>
                <span>{l.name} × {l.qty}</span>
                <span>{`Rs. ${(l.price * l.qty).toLocaleString()}`}</span>
              </div>
            ))}
            <div className="order-line">
              <span>Shipping</span>
              <span>{`Rs. ${SHIPPING}`}</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>{`Rs. ${total.toLocaleString()}`}</span>
            </div>
            {error && <p style={{ color: 'var(--rust)', marginTop: 12 }}>{error}</p>}
            <button className="btn btn-solid btn-block" type="submit">
              Place order
            </button>
          </div>
        </form>
      ) : (
        <div className="checkout-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              
            </div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 20, textTransform: 'uppercase', marginBottom: 18 }}>
              Payment
            </h1>
            <p style={{ marginBottom: 16, color: 'var(--stone)' }}>
              You will be redirected to eSewa to complete this payment.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: '1px solid var(--line)', borderRadius: 12 }}>
              <img src={esewaLogo} alt="eSewa" style={{ width: 52, height: 42, objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: 600 }}>eSewa</div>
                <div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 4 }}>Secure online payment</div>
              </div>
            </div>

            <div style={{ marginTop: 18, padding: 14, border: '1px solid var(--line)', borderRadius: 12, color: 'var(--stone)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
                Selected method
              </div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>eSewa</div>
              <div>Payment is verified by Django after the eSewa redirect.</div>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order summary</h3>
            {lines.map((l) => (
              <div className="order-line" key={l.lineId}>
                <span>{l.name} × {l.qty}</span>
                <span>{`Rs. ${(l.price * l.qty).toLocaleString()}`}</span>
              </div>
            ))}
            <div className="order-line">
              <span>Shipping</span>
              <span>{`Rs. ${SHIPPING}`}</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>{`Rs. ${total.toLocaleString()}`}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button type="button" className="btn" onClick={() => setStep('details')}>
                Back
              </button>
              <button className="btn btn-solid btn-block" type="button" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Placing order…' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
