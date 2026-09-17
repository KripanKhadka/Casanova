import React, { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, color, qty } = action.payload
      const lineId = `${product.id}__${color}`
      const existing = state.lines.find((l) => l.lineId === lineId)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.lineId === lineId ? { ...l, qty: l.qty + qty } : l,
          ),
        }
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            lineId,
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            color,
            qty,
          },
        ],
      }
    }
    case 'REMOVE':
      return { ...state, lines: state.lines.filter((l) => l.lineId !== action.payload) }
    case 'SET_QTY':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineId === action.payload.lineId
            ? { ...l, qty: Math.max(1, action.payload.qty) }
            : l,
        ),
      }
    case 'CLEAR':
      return { ...state, lines: [] }
    case 'TOGGLE_DRAWER':
      return { ...state, drawerOpen: action.payload ?? !state.drawerOpen }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [], drawerOpen: false })

  const value = useMemo(() => {
    const subtotal = state.lines.reduce((sum, l) => sum + l.price * l.qty, 0)
    const itemCount = state.lines.reduce((sum, l) => sum + l.qty, 0)
    return {
      lines: state.lines,
      drawerOpen: state.drawerOpen,
      subtotal,
      itemCount,
      addItem: (product, color, qty = 1) =>
        dispatch({ type: 'ADD', payload: { product, color, qty } }),
      removeItem: (lineId) => dispatch({ type: 'REMOVE', payload: lineId }),
      setQty: (lineId, qty) => dispatch({ type: 'SET_QTY', payload: { lineId, qty } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      openDrawer: () => dispatch({ type: 'TOGGLE_DRAWER', payload: true }),
      closeDrawer: () => dispatch({ type: 'TOGGLE_DRAWER', payload: false }),
      toggleDrawer: () => dispatch({ type: 'TOGGLE_DRAWER' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
