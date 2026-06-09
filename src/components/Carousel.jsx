import React, { useEffect, useState } from 'react'

export default function Carousel({ items = [] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!items.length) return
    const id = setInterval(() => setIndex(i => (i + 1) % items.length), 4000)
    return () => clearInterval(id)
  }, [items])

  if (!items.length) return null

  const current = items[index]

  return (
    <section id="hero" className="hero panel" aria-labelledby="hero-title">
      <div className="hero-content">
        <h2 id="hero-title">Nuestros Favoritos</h2>
        <p id="api-status" className="status-message">Endulza tu momento con nuestros Favoritos</p>
      </div>
      <div className="carousel-container">
        <div className="carousel-view" aria-live="polite">
          <div className="carousel-product">
            <figure className="carousel-product-image">
              <img src={current.imagen} alt={current.nombre} loading="eager" />
            </figure>
            <div className="carousel-product-info">
              <span className="product-category">{current.categoria}</span>
              <h3>{current.nombre}</h3>
              <p>{current.descripcion}</p>
              <p className="carousel-price">${current.precio}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
