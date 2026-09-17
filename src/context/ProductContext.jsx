import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProducts } from '../api.js'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.products)
        setCategories(data.categories)
      })
      .catch(() => setError('The collection could not be loaded. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ProductContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used within ProductProvider')
  return context
}
