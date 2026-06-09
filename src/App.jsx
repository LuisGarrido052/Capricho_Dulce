import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Carousel from './components/Carousel'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import Account from './components/Account'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { products as initialProducts } from './data/products'
import useUnsplash from './hooks/useUnsplash'
import useCart from './hooks/useCart'
import './App.css'

function App() {
  const [products] = useState(initialProducts)
  const { photos, loading, error } = useUnsplash()
  const { cart, add, clear, total } = useCart()

  // build product list: prefer Unsplash photos mapped to templates, fallback to local products
  const displayProducts = photos && photos.length
    ? photos.map((p, i) => ({
      id: p.id,
      nombre: initialProducts[i % initialProducts.length].nombre,
      descripcion: initialProducts[i % initialProducts.length].descripcion,
      precio: initialProducts[i % initialProducts.length].precio,
      imageUrl: p.imageUrl,
      alt: p.alt,
      link: p.link,
      query: p.query
    }))
    : products

  return (
    <>
      <Header />
      <main className="main-content">
        <Carousel items={displayProducts.slice(0, 5)} onAdd={add} />
        <ProductGrid products={displayProducts} onAdd={add} />
        <Account onOrder={clear} cartCount={cart.length} />
        <Contact />
      </main>
      <Cart cart={cart} onClear={clear} />
      <Footer />
    </>
  )
}

export default App
