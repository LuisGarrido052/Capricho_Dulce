import React, { useEffect, useState } from 'react'
import { formatCLP } from '../utils'

export default function Carousel({ items = [], onAdd = () => {} }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!items.length) return
    const id = setInterval(() => setIndex(i => (i + 1) % items.length), 5000)
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
        <div className="carousel" aria-roledescription="carrusel de productos">
          <div className="carousel-view" aria-live="polite" aria-atomic="true">
            <div className="carousel-product" role="region" aria-label={current.nombre}>
              <figure className="carousel-product-image">
                <img src={current.imageUrl || current.imagen} alt={current.alt || current.nombre} loading="eager" referrerPolicy="no-referrer" />
              </figure>
              <div className="carousel-product-info">
                <span className="product-category">{current.query || current.categoria}</span>
                <h3>{current.nombre}</h3>
                <p>{current.descripcion}</p>
                <p className="carousel-price">{formatCLP(current.precio)}</p>
                <button type="button" id="carousel-add-btn" className="carousel-add-btn" onClick={() => onAdd(current)}>Agregar al carro</button>
                {current.link && <p className="photo-credit"><a href={current.link} target="_blank" rel="noreferrer noopener">Ver en Unsplash</a></p>}
              </div>
            </div>
          </div>
          <div className="carousel-controls">
            <button type="button" className="carousel-btn carousel-btn--prev" onClick={() => setIndex(i => (i - 1 + items.length) % items.length)} aria-label="Producto anterior">❮</button>
            <button type="button" className="carousel-btn carousel-btn--next" onClick={() => setIndex(i => (i + 1) % items.length)} aria-label="Producto siguiente">❯</button>
          </div>
          <ol className="carousel-indicators" aria-label="Indicadores del carrusel">
            {items.map((_, i) => (
              <li key={i} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Ir a la imagen ${i + 1}`}></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
