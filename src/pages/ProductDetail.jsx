import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading, error } = useProducts()
  const product = products.find((item) => item.id === id)
  const { addItem, openDrawer } = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product?.colors[0])
  const [qty, setQty] = useState(1)

  if (loading) return <div className="center-page">Loading the piece...</div>
  if (error || !product) return <Navigate to="/shop" replace />

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  function handleAdd() {
    addItem(product, color, qty)
    openDrawer()
  }

  return (
    <div className="wrap section">
      <div className="pdp-grid">
        <div>
          <div className="pdp-gallery-main">
            <img src={product.gallery[activeImage]} alt={product.name} />
          </div>
          <div className="pdp-thumbs">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                className={i === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="pdp-info">
          <span className="eyebrow">{product.category} · {product.sku}</span>
          <h1 className="h-display pdp-title">{product.name}</h1>
          <span className="pdp-price">{`Rs. ${product.price.toLocaleString()}`}</span>

          <p className="pdp-desc">{product.description}</p>

          <div>
            <span className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>
              Finish
            </span>
            <div className="color-options">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className={`color-dot ${color === c ? 'active' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select finish ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="qty-row">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-solid" style={{ flex: 1 }} onClick={handleAdd}>
              {`Add to cart — Rs. ${(product.price * qty).toLocaleString()}`}
            </button>
          </div>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--stone)' }}>
            {product.stock > 0 ? `${product.stock} in stock · made to order` : 'Currently unavailable'}
          </span>

          <div className="pdp-spec-table">
            <div className="pdp-spec-row"><span>Material</span><span>{product.material}</span></div>
            <div className="pdp-spec-row"><span>Dimensions</span><span>{product.dimensions}</span></div>
            <div className="pdp-spec-row"><span>SKU</span><span>{product.sku}</span></div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 96 }}>
          <div className="section-head">
            <div>
              <span className="eyebrow">Pairs well with</span>
              <h2 className="h-display" style={{ fontSize: 28 }}>More {product.category.toLowerCase()}</h2>
            </div>
            <Link to="/shop"><button className="btn">View all</button></Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
