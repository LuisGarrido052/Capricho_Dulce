export default function RegisterPage({ form, message, onChange, onSubmit, onNavigate }) {
  return (
    <section className="page page-auth">
      <div className="page-heading">
        <p className="eyebrow">Pantalla independiente</p>
        <h1>Registro</h1>
        <p>Formulario separado para crear tu cuenta antes de iniciar sesión.</p>
      </div>

      <div className="auth-layout">
        <div className="card-surface auth-aside">
          <h2>Crear cuenta sólida</h2>
          <p>
            El registro valida correo, contraseña, confirmación y aceptación de términos.
          </p>
          <div className="mini-list">
            <span>Nombre, teléfono y correo obligatorios.</span>
            <span>Contraseña de al menos 8 caracteres.</span>
            <span>La sesión se guarda al registrarte.</span>
          </div>
          <button className="button-ghost" onClick={() => onNavigate('login')} type="button">
            Ya tengo cuenta
          </button>
        </div>

        <form className="card-surface auth-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="register-name">Nombre completo</label>
            <input
              autoComplete="name"
              id="register-name"
              name="name"
              onChange={onChange}
              placeholder="Nombre y apellido"
              required
              type="text"
              value={form.name}
            />
          </div>
          <div className="field">
            <label htmlFor="register-phone">Teléfono</label>
            <input
              autoComplete="tel"
              id="register-phone"
              name="phone"
              onChange={onChange}
              placeholder="+56 9 1234 5678"
              required
              type="tel"
              value={form.phone}
            />
          </div>
          <div className="field">
            <label htmlFor="register-email">Correo electrónico</label>
            <input
              autoComplete="email"
              id="register-email"
              name="email"
              onChange={onChange}
              placeholder="correo@ejemplo.com"
              required
              type="email"
              value={form.email}
            />
          </div>
          <div className="field">
            <label htmlFor="register-password">Contraseña</label>
            <input
              autoComplete="new-password"
              id="register-password"
              name="password"
              onChange={onChange}
              placeholder="Mínimo 8 caracteres"
              required
              type="password"
              value={form.password}
            />
          </div>
          <div className="field">
            <label htmlFor="register-confirm-password">Confirmar contraseña</label>
            <input
              autoComplete="new-password"
              id="register-confirm-password"
              name="confirmPassword"
              onChange={onChange}
              placeholder="Repite la contraseña"
              required
              type="password"
              value={form.confirmPassword}
            />
          </div>
          <div className="field checkbox-field">
            <input
              checked={form.acceptTerms}
              id="register-accept-terms"
              name="acceptTerms"
              onChange={onChange}
              type="checkbox"
            />
            <label htmlFor="register-accept-terms">Acepto guardar mi sesión en este dispositivo.</label>
          </div>
          {message ? <p className="form-message">{message}</p> : null}
          <button className="button-primary full-width" type="submit">
            Crear cuenta
          </button>
          <button className="button-secondary full-width" onClick={() => onNavigate('home')} type="button">
            Volver al inicio
          </button>
        </form>
      </div>
    </section>
  )
}
