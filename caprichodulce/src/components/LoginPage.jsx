export default function LoginPage({ form, message, onChange, onSubmit, onNavigate }) {
  return (
    <section className="page page-auth">
      <div className="page-heading">
        <p className="eyebrow">Pantalla independiente</p>
        <h1>Ingresar</h1>
        <p>Solo autenticación. No incluye registro en la misma vista.</p>
      </div>

      <div className="auth-layout">
        <div className="card-surface auth-aside">
          <h2>Acceso a tu cuenta</h2>
          <p>
            Al iniciar sesión, el sistema reconoce tu usuario y te lleva a <strong>Mi cuenta</strong>.
          </p>
          <div className="mini-list">
            <span>Sesión persistente en localStorage.</span>
            <span>Reconocimiento automático después de entrar.</span>
            <span>Acceso separado del registro.</span>
          </div>
          <button className="button-ghost" onClick={() => onNavigate('register')} type="button">
            Ir a registro
          </button>
        </div>

        <form className="card-surface auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={onChange}
              placeholder="tucorreo@ejemplo.com"
              required
              type="email"
              value={form.email}
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              autoComplete="current-password"
              id="login-password"
              name="password"
              onChange={onChange}
              placeholder="Tu contraseña"
              required
              type="password"
              value={form.password}
            />
          </div>
          {message ? <p className="form-message">{message}</p> : null}
          <button className="button-primary full-width" type="submit">
            Ingresar
          </button>
          <button className="button-secondary full-width" onClick={() => onNavigate('home')} type="button">
            Volver al inicio
          </button>
        </form>
      </div>
    </section>
  )
}
