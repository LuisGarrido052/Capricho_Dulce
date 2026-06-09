import React from 'react'
import { formatCLP } from '../utils'

export default function Cart({ cart = [], onClear = () => {} }) {
  const total = cart.reduce((sum, it) => sum + (it.precio || 0) * (it.cantidad || 1), 0)

  return (
    <aside id="carro" className="cart-panel panel" aria-labelledby="carro-title">
      <div className="cart-header">
        <h2 id="carro-title">Carro</h2>
        <span id="cart-count" className="cart-count">{cart.length} productos</span>
      </div>
      <div id="cart-items" className="cart-items">
        {cart.length === 0 ? (
          <p className="cart-empty">Tu carro está vacío.</p>
        ) : (
          cart.map(item => (
            <article key={item.id} className="cart-item">
              <img className="cart-item-image" src={item.imagen || item.imageUrl} alt={item.nombre} loading="lazy" />
              <div className="cart-item-info">
                <h4>{item.nombre}</h4>
                <p>{item.descripcion}</p>
                <span className="cart-item-qty">Cantidad: {item.cantidad || 1}</span>
              </div>
              <div className="cart-item-meta">
                <strong>{formatCLP((item.precio || 0) * (item.cantidad || 1))}</strong>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="cart-summary">
        <p>Total a pagar</p>
        <strong id="cart-total" className="cart-total">{formatCLP(total)}</strong>
      </div>
      <button type="button" id="clear-cart-btn" className="form-submit form-submit--secondary" onClick={onClear}>Vaciar carrito</button>
    </aside>
  )
}
