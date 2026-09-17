import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentResult({ success }) {
  const [searchParams] = useSearchParams()
  const order = searchParams.get('order')

  return (
    <div className="center-page">
      <span className="eyebrow">{success ? 'Payment confirmed' : 'Payment not completed'}</span>
      <h1 className="h-display" style={{ fontSize: 36 }}>
        {success ? 'Thank you — your order is being made.' : 'Your eSewa payment was not completed.'}
      </h1>
      <p style={{ maxWidth: 440, color: 'var(--stone)' }}>
        {success
          ? `Order ${order || ''} has been recorded and verified through eSewa.`
          : 'No payment was captured. Your reserved stock has been released.'}
      </p>
      <Link to="/shop"><button className="btn btn-solid">Continue shopping</button></Link>
    </div>
  )
}
