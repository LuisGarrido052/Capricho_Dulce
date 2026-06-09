import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import Account from './components/Account'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { products as initialProducts } from './data/products'
import './App.css'

function App() {
  const [products] = useState(initialProducts)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('capricho_cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('capricho_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id)
      if (found) {
        return prev.map(p => p.id === product.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p)
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
  }

  function clearCart() {
    setCart([])
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <Carousel items={products.slice(0, 5)} />
        <ProductGrid products={products} onAdd={addToCart} />
        <Account />
        <Contact />
      </main>
      <Cart cart={cart} onClear={clearCart} />
      <Footer />
    </>
  )
}

export default App
