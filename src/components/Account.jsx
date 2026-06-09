import React, { useEffect, useState } from 'react'
import { isValidEmail, isValidPassword, isValidText } from '../utils'

const FORM_KEY = 'capricho_dulce_forms'
const ADDRESS_KEY = 'capricho_dulce_address'

export default function Account({ onOrder = () => {}, cartCount = 0 }) {
  const [status, setStatus] = useState('Ingresa tu dirección para completar el pedido.')
  const [shipping, setShipping] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FORM_KEY)
      if (stored) {
        // keep for potential future use
      }
      const addr = localStorage.getItem(ADDRESS_KEY)
      if (addr) setShipping(addr)
    } catch (e) {
      console.error(e)
    }
  }, [])

  function saveAddress() {
    if (!isValidText(shipping, 10)) {
      setStatus('Ingresa una dirección válida de envío.')
      return false
    }
    localStorage.setItem(ADDRESS_KEY, shipping)
    setStatus('Dirección guardada correctamente.')
    return true
  }

  function handleOrder() {
    if (cartCount === 0) {
      setStatus('Agrega productos al carro antes de realizar el pedido.')
      return
    }
    if (!saveAddress()) return
    const total = '$' + '—'
    const pedido = `PED-${Date.now().toString().slice(-6)}`
    setStatus(`Pedido ${pedido} simulado. Envío a: ${shipping}`)
    onOrder()
  }

  function handleRegister(e) {
    e.preventDefault()
    const form = e.target
    const fullName = form.fullName?.value || ''
    const email = form.email?.value || ''
    const password = form.password?.value || ''
    const errors = {}
    if (!isValidText(fullName, 3)) errors.fullName = 'El nombre debe tener al menos 3 caracteres'
    if (!isValidEmail(email)) errors.email = 'Por favor ingresa un email válido'
    if (!isValidPassword(password)) errors.password = 'La contraseña debe tener al menos 8 caracteres'
    if (Object.keys(errors).length) {
      setStatus(Object.values(errors)[0])
      return
    }
    const stored = JSON.parse(localStorage.getItem(FORM_KEY) || '{}')
    stored.registrations = Array.isArray(stored.registrations) ? stored.registrations : []
    stored.registrations.push({ fullName, email })
    localStorage.setItem(FORM_KEY, JSON.stringify(stored))
    setStatus('✓ ¡Registro completado exitosamente!')
    form.reset()
  }

  function handleLogin(e) {
    e.preventDefault()
    const form = e.target
    const email = form.email?.value || ''
    const password = form.password?.value || ''
    if (!isValidEmail(email) || !isValidPassword(password)) {
      setStatus('Credenciales inválidas')
      return
    }
    const stored = JSON.parse(localStorage.getItem(FORM_KEY) || '{}')
    stored.logins = Array.isArray(stored.logins) ? stored.logins : []
    stored.logins.push({ email })
    localStorage.setItem(FORM_KEY, JSON.stringify(stored))
    setStatus('✓ ¡Sesión iniciada exitosamente!')
    form.reset()
  }

  function handleContact(e) {
    e.preventDefault()
    const form = e.target
    const name = form.name?.value || ''
    const email = form.email?.value || ''
    const subject = form.subject?.value || ''
    const message = form.message?.value || ''
    if (!isValidText(name, 3) || !isValidEmail(email) || !isValidText(subject, 5) || !isValidText(message, 10)) {
      setStatus('Completa correctamente el formulario de contacto.')
      return
    }
    const stored = JSON.parse(localStorage.getItem(FORM_KEY) || '{}')
    stored.contacts = Array.isArray(stored.contacts) ? stored.contacts : []
    stored.contacts.push({ name, email, subject, message })
    localStorage.setItem(FORM_KEY, JSON.stringify(stored))
    setStatus('✓ ¡Mensaje enviado exitosamente!')
    form.reset()
  }

  return (
    <section id="mi-cuenta" className="account-section panel" aria-labelledby="mi-cuenta-title">
      <div className="account-header">
        <h2 id="mi-cuenta-title">Mi Cuenta</h2>
        <p className="section-subtitle">Regístrate, inicia sesión, guarda tu dirección y finaliza tu pedido desde un mismo espacio.</p>
      </div>

      <div className="account-grid">
        <article className="account-card account-card--intro">
          <h3>Acceso seguro</h3>
          <p>Usa los formularios para registrarte o iniciar sesión. Mantienen validación segura y retroalimentación visual.</p>
          <div className="account-actions">
            <button className="account-link account-link--button" type="button" onClick={() => window.scrollTo({ top: document.getElementById('registro')?.offsetTop || 0, behavior: 'smooth' })}>Ir a Registro</button>
            <button className="account-link account-link--button" type="button" onClick={() => window.scrollTo({ top: document.getElementById('login')?.offsetTop || 0, behavior: 'smooth' })}>Ir a Login</button>
          </div>
        </article>

        <article id="registro" className="account-card">
          <h3 className="account-card-title">Crear Cuenta</h3>
          <form id="register-form" className="auth-form" noValidate onSubmit={handleRegister}>
            <fieldset>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Nombre Completo <span className="required">*</span></label>
                <input id="reg-name" name="fullName" type="text" className="form-input" placeholder="Tu nombre completo" required minLength={3} maxLength={80} />
                <small className="form-error" role="alert"></small>
              </div>
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Correo Electrónico <span className="required">*</span></label>
                <input id="reg-email" name="email" type="email" className="form-input" placeholder="tu.correo@ejemplo.com" required />
                <small className="form-error" role="alert"></small>
              </div>
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Contraseña <span className="required">*</span></label>
                <input id="reg-password" name="password" type="password" className="form-input" placeholder="Mínimo 8 caracteres" required minLength={8} />
                <small className="form-error" role="alert"></small>
              </div>
              <button type="submit" className="form-submit">Registrar</button>
            </fieldset>
          </form>
        </article>

        <article id="login" className="account-card">
          <h3 className="account-card-title">Iniciar Sesión</h3>
          <form id="login-form" className="auth-form" noValidate onSubmit={handleLogin}>
            <fieldset>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Correo Electrónico <span className="required">*</span></label>
                <input id="login-email" name="email" type="email" className="form-input" placeholder="tu.correo@ejemplo.com" required />
                <small className="form-error" role="alert"></small>
              </div>
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Contraseña <span className="required">*</span></label>
                <input id="login-password" name="password" type="password" className="form-input" placeholder="Tu contraseña" required minLength={8} />
                <small className="form-error" role="alert"></small>
              </div>
              <button type="submit" className="form-submit">Entrar</button>
            </fieldset>
          </form>
        </article>

        <article className="account-card account-card--shipping">
          <h3 className="account-card-title">Dirección de envío</h3>
          <form id="address-form" className="shipping-form" noValidate onSubmit={e => { e.preventDefault(); saveAddress(); }}>
            <div className="form-group">
              <label htmlFor="shipping-address" className="form-label">Dirección completa <span className="required">*</span></label>
              <textarea id="shipping-address" name="shippingAddress" className="form-textarea" placeholder="Calle, número, comuna y referencias" required minLength={10} maxLength={250} rows={4} value={shipping} onChange={e => setShipping(e.target.value)}></textarea>
              <small id="shipping-address-error" className="form-error" role="alert"></small>
            </div>
            <div className="account-actions account-actions--stacked">
              <button type="button" id="save-address-btn" className="account-link account-link--button" onClick={saveAddress}>Guardar dirección</button>
              <button type="button" id="order-btn" className="form-submit" onClick={handleOrder}>Realizar Pedido</button>
            </div>
          </form>
          <p id="account-status" className="status-message" aria-live="polite">{status}</p>
        </article>
      </div>
    </section>
  )
}
