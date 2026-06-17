export default function AccountPage({ session, onNavigate, onLogout }) {
  return (
    <section className="page page-account">
      <div className="page-heading">
        <p className="eyebrow">Sesión reconocida</p>
        <h1>Mi cuenta</h1>
        <p>Esta pantalla muestra el usuario activo y los detalles del perfil.</p>
      </div>

      {session ? (
        <div className="account-layout">
          <article className="card-surface account-summary">
            <h2>{session.name}</h2>
            <p>{session.email}</p>
            <p>{session.phone}</p>
            <div className="account-meta">
              <span>Sesión iniciada</span>
              <span>{new Date(session.loggedInAt).toLocaleString('es-CL')}</span>
            </div>
            <div className="account-actions">
              <button className="button-primary" onClick={() => onNavigate('home')} type="button">
                Ir al inicio
              </button>
              <button className="button-ghost" onClick={onLogout} type="button">
                Cerrar sesión
              </button>
            </div>
          </article>

          <aside className="card-surface account-notes">
            <h3>Reconocimiento de cuenta</h3>
            <ul>
              <li>La sesión se conserva al recargar la página.</li>
              <li>El sistema muestra el nombre y correo del usuario activo.</li>
              <li>La navegación es simple y segura.</li>
            </ul>
          </aside>
        </div>
      ) : (
        <div className="card-surface empty-state">
          <h2>No hay una sesión activa</h2>
          <p>Ingresa o regístrate para que el sistema reconozca tu cuenta.</p>
          <div className="hero-actions">
            <button className="button-primary" onClick={() => onNavigate('login')} type="button">
              Ingresar
            </button>
            <button className="button-secondary" onClick={() => onNavigate('register')} type="button">
              Registrarme
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
