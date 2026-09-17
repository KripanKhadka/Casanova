import React from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductContext.jsx'

export default function Home() {
  const { products, categories, loading, error } = useProducts()

  if (loading) return <div className="center-page">Loading the collection...</div>
  if (error) return <div className="center-page">{error}</div>

  const featured = products.slice(0, 6)

  return (
    <div>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Spring collection / 02</span>
            <h1 className="h-display">
              Furniture built to be
              <br />
              used, not arranged.
            </h1>
            <p>
              Solid materials, visible joinery, and finishes that improve with wear. Every piece in
              the collection is made to order in small batches.
            </p>
            <div className="hero-cta">
              <Link to="/shop"><button className="btn btn-solid">Shop the collection</button></Link>
              <Link to="/about"><button className="btn">Our materials</button></Link>
            </div>
          </div>
          <div
            className="hero-image"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop')",
            }}
          >
            <div className="hero-tag">
              <strong>Oak Lounge Chair</strong>
              <span>Rs. 1,240 · In stock</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="cat-strip">
          {categories.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="cat-tile">
              <span>{c}</span>
              <span>→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Selected pieces</span>
              <h2 className="h-display">New this season</h2>
            </div>
            <Link to="/shop"><button className="btn">View all</button></Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--ivory-dim)' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Why FORM</span>
            <h2 className="h-display" style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginTop: 10 }}>
              Made in small batches, by people whose names are on the invoice.
            </h2>
          </div>
          <p className="pdp-desc">
            We work with eleven workshops across three regions, each specializing in one material:
            oak, brass, wool, or clay. Nothing in the catalog is mass-produced, and most pieces are
            made after you order them — which is also why some take a few weeks to ship.
          </p>
        </div>
      </section>
    </div>
  )
}
