export default function HomePage({ session, products, onNavigate }) {
  return (
    <section className="page page-home">
      <div className="hero-grid">
        <div className="hero-copy card-surface">
          <p className="eyebrow">Conoce la experiencia del dulzor.</p>
          <h1>Brownies, Cupcakes, Galletas, torstas y mucho mas!</h1>


          {session ? (
            <div className="hero-session card-inline">
              <strong>Cuenta reconocida:</strong>
              <span>{session.name}</span>
              <span>{session.email}</span>
            </div>
          ) : (
            <div className="hero-session card-inline muted">
              <strong>No hay sesión iniciada.</strong>
              <span>Ingresar te lleva a la cuenta; registrarte crea el perfil y guarda la sesión.</span>
            </div>
          )}

          <div className="hero-actions">
            <button className="button-primary" onClick={() => onNavigate('login')} type="button">
              Ingresar
            </button>
            <button className="button-secondary" onClick={() => onNavigate('register')} type="button">
              Registrarme
            </button>
          </div>
        </div>

        <aside className="hero-side card-surface">
          <p className="eyebrow">Accesos principales</p>
          <div className="route-stack">
            <button className="route-card" onClick={() => onNavigate('login')} type="button">
              <strong>Ingresar</strong>
              <span>Ingresa a endulzar tu vida.</span>
            </button>
            <button className="route-card" onClick={() => onNavigate('register')} type="button">
              <strong>Registro</strong>
              <span>Crea tu cuenta, y disfruta de descuentos exclusivos!.</span>
            </button>
            <button className="route-card" onClick={() => onNavigate('account')} type="button">
              <strong>Mi cuenta</strong>
              <span>Ve tu perfil.</span>
            </button>
          </div>
        </aside>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Catálogo visible</p>
          <h2>Productos destacados</h2>
        </div>
        <span className="section-note">Endulza tu momento </span>
      </div>

      <div className="product-preview-grid">
        {products.slice(0, 3).map((product) => (
          <article className="product-preview card-surface" key={product.id}>
            <img alt={product.name} src={product.image} />
            <div>
              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <strong>${product.price}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
