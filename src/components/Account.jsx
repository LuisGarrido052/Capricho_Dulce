import React from 'react'

export default function Account() {
  return (
    <section id="mi-cuenta" className="account-section panel" aria-labelledby="mi-cuenta-title">
      <div className="account-header">
        <h2 id="mi-cuenta-title">Mi Cuenta</h2>
        <p className="section-subtitle">Regístrate, inicia sesión, guarda tu dirección y finaliza tu pedido desde un mismo espacio.</p>
      </div>

      <div className="account-grid">
        <article className="account-card account-card--intro">
          <h3>Acceso seguro</h3>
          <p>Usa los formularios para registrarte o iniciar sesión.</p>
        </article>

        <article id="registro" className="account-card">
          <h3 className="account-card-title">Crear Cuenta</h3>
          <form id="register-form" className="auth-form" noValidate>
            <fieldset>
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Nombre Completo</label>
                <input id="reg-name" name="fullName" type="text" className="form-input" />
                <small className="form-error" role="alert"></small>
              </div>
              <button type="submit" className="form-submit">Registrar</button>
            </fieldset>
          </form>
        </article>

        <article id="login" className="account-card">
          <h3 className="account-card-title">Iniciar Sesión</h3>
          <form id="login-form" className="auth-form" noValidate>
            <fieldset>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Correo Electrónico</label>
                <input id="login-email" name="email" type="email" className="form-input" />
              </div>
              <button type="submit" className="form-submit">Entrar</button>
            </fieldset>
          </form>
        </article>
      </div>
    </section>
  )
}
