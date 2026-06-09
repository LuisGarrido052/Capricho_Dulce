import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'capricho_dulce_cart'

export default function useCart() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCart(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load cart', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart', e)
    }
  }, [cart])

  const add = useCallback(product => {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id)
      if (found) {
        return prev.map(p => p.id === product.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p)
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
  }, [])

  const clear = useCallback(() => setCart([]), [])

  const total = cart.reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 1), 0)

  return { cart, add, clear, total }
}
