import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductContext.jsx'

export default function Shop() {
  const { products, categories, loading, error } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'All'
  const [sort, setSort] = useState('featured')

  if (loading) return <div className="center-page">Loading the collection...</div>
  if (error) return <div className="center-page">{error}</div>

  const filtered = useMemo(() => {
    let list =
      activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [activeCategory, sort])

  function setCategory(c) {
    if (c === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', c)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="wrap section">
      <div className="section-head">
        <div>
          <span className="eyebrow">{filtered.length} pieces</span>
          <h2 className="h-display">Shop the collection</h2>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-pills">
          <button
            className={`pill ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => setCategory('All')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`pill ${activeCategory === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No pieces in this category yet.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
