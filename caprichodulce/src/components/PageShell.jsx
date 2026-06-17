import { pageLabels } from '../constants.js'

export default function PageShell({ currentPage, session, onNavigate, onLogout }) {
  const accountLabel = session ? `Mi cuenta · ${session.name}` : 'Mi cuenta'

  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate('home')} type="button">
        <span className="brand-mark">CD</span>
        <span>
          <strong>Capricho Dulce</strong>
          <small>Pastelería con acceso separado</small>
        </span>
      </button>

      <nav className="site-nav" aria-label="Navegación principal">
        {Object.entries(pageLabels).map(([page, label]) => (
          <button
            key={page}
            className={page === currentPage ? 'nav-link active' : 'nav-link'}
            onClick={() => onNavigate(page)}
            type="button"
          >
            {page === 'account' ? accountLabel : label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        {session ? (
          <>
            <span className="session-pill">Sesión activa</span>
            <button className="button-secondary" onClick={() => onNavigate('account')} type="button">
              Ir a mi cuenta
            </button>
            <button className="button-ghost" onClick={onLogout} type="button">
              Salir
            </button>
          </>
        ) : (
          <>
            <button className="button-secondary" onClick={() => onNavigate('login')} type="button">
              Ingresar
            </button>
            <button className="button-primary" onClick={() => onNavigate('register')} type="button">
              Registrarme
            </button>
          </>
        )}
      </div>
    </header>
  )
}
