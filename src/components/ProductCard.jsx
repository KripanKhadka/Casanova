import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCart()

  function quickAdd(e) {
    e.preventDefault()
    addItem(product, product.colors[0], 1)
    openDrawer()
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-media">
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="product-quickadd">
            <button className="btn btn-solid btn-block" onClick={quickAdd}>
              {`Quick add — Rs. ${product.price}`}
            </button>
          </div>
        </div>
      </Link>
      <div className="product-info">
        <div className="product-shelf" />
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-spec">{product.material}</p>
        <div className="product-bottom">
          <span className="product-price">{`Rs. ${product.price.toLocaleString()}`}</span>
          <div className="swatch-row">
            {product.colors.map((c) => (
              <span key={c} className="swatch" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
