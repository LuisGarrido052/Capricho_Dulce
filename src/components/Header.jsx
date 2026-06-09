import React from 'react'
import logo from '../assets/images/LOGO OFICIAL.jpeg'

export default function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="brand">
        <div className="brand-logo-container">
          <img src={logo} alt="Logo de Capricho Dulce" className="brand-logo" />
          <div className="brand-text">
            <h1 className="brand-title">Capricho Dulce</h1>
            <p className="brand-subtitle">Endulza tu momento</p>
          </div>
        </div>
      </div>
      <nav className="main-nav" role="navigation" aria-label="Navegación principal">
        <ul className="nav-list">
          <li><a href="#hero" className="nav-link">Inicio</a></li>
          <li><a href="#productos" className="nav-link">Productos</a></li>
          <li><a href="#carro" className="nav-link">Carro</a></li>
          <li><a href="#mi-cuenta" className="nav-link">Mi Cuenta</a></li>
          <li><a href="#contacto" className="nav-link">Contacto</a></li>
        </ul>
      </nav>
    </header>
  )
}
