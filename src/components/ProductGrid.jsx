import React from 'react'

import { formatCLP } from '../utils'

export default function ProductGrid({ products = [], onAdd = () => {} }) {
  return (
    <section id="productos" className="products panel" aria-labelledby="productos-title">
      <h2 id="productos-title">Galería Destacada</h2>
      <p className="section-subtitle">El arreglo resultante se muestra como tarjetas de producto.</p>
      <div id="product-list" className="product-grid">
        {products.map(p => (
          <article key={p.id} className="product-card" aria-label={p.nombre}>
            <div className="product-image">
              <img src={p.imagen} alt={p.nombre} loading="lazy" />
            </div>
            <div className="product-info">
              <h3 className="product-name">{p.nombre}</h3>
              <span className="product-category">{p.categoria}</span>
              <p className="product-description">{p.descripcion}</p>
              <p className="product-price">{formatCLP(p.precio)}</p>
              <button type="button" className="product-add-btn" onClick={() => onAdd(p)}>Agregar al carro</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
