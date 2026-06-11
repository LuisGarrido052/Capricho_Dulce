import './App.css'

const menuItems = [
  {
    name: 'Tortas personalizadas',
    description: 'Diseños a medida para cumpleaños, aniversarios y celebraciones especiales.',
    price: 'Desde $18.900',
  },
  {
    name: 'Cupcakes premium',
    description: 'Bizcocho suave, rellenos cremosos y terminaciones artesanales.',
    price: 'Caja x6 $8.500',
  },
  {
    name: 'Brownies y cookies',
    description: 'Textura intensa, porciones generosas y opciones para compartir.',
    price: 'Desde $4.200',
  },
  {
    name: 'Mesas dulces',
    description: 'Montajes completos para eventos con combinación de sabores y formatos.',
    price: 'Cotización directa',
  },
]

const highlights = [
  { value: '48h', label: 'Entrega estándar en pedidos programados' },
  { value: '100%', label: 'Producción fresca y elaboración diaria' },
  { value: 'Local', label: 'Retiro en tienda o entrega coordinada' },
]

const steps = [
  {
    title: 'Elige tu idea',
    text: 'Nos cuentas ocasión, tamaño y estilo. A partir de eso proponemos una base clara.',
  },
  {
    title: 'Ajustamos el detalle',
    text: 'Definimos sabores, decoración, mensaje y tiempos de entrega sin perder claridad.',
  },
  {
    title: 'Lo llevamos a mesa',
    text: 'Tu pedido sale listo para servir, con presentación cuidada y experiencia consistente.',
  },
]

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#inicio">
          <span className="brand-mark">CD</span>
          <span>
            <strong>Capricho Dulce</strong>
            <small>Pastelería creativa</small>
          </span>
        </a>

        <nav className="nav" aria-label="Secciones principales">
          <a href="#sabores">Sabores</a>
          <a href="#proceso">Proceso</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <a className="topbar-cta" href="#contacto">
          Pedir ahora
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">Pedidos artesanales para celebraciones reales</p>
            <h1>Una página completa para mostrar, vender y crecer con tu marca dulce.</h1>
            <p className="hero-text">
              Este punto de partida reemplaza la landing de Vite por una experiencia
              responsive, con secciones claras y preparada para sumar más contenido,
              catálogo o flujo de pedidos en los próximos pasos.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#sabores">
                Ver productos
              </a>
              <a className="button button-secondary" href="#contacto">
                Cotizar pedido
              </a>
            </div>

            <ul className="highlights" aria-label="Puntos destacados">
              {highlights.map((item) => (
                <li key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="hero-panel" aria-label="Resumen del negocio">
            <div className="panel-card panel-card-main">
              <h2>Diseño, sabor y presentación en un solo flujo.</h2>
              <p>
                Pensado para adaptarse a campañas, lanzamientos o una nueva carta de
                producto sin rehacer la estructura completa.
              </p>

              <div className="panel-grid">
                <div>
                  <strong>9:00 - 19:00</strong>
                  <span>Atención general</span>
                </div>
                <div>
                  <strong>Pedidos 24/7</strong>
                  <span>Formulario y WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="panel-card panel-card-quote">
              <p>
                “La idea es que esta base sirva para migrar el proyecto anterior a React
                y seguir iterando sin quedar atado a una sola landing.”
              </p>
            </div>
          </aside>
        </section>

        <section className="section section-surface" id="sabores">
          <div className="section-heading">
            <p className="eyebrow">Catálogo inicial</p>
            <h2>Productos pensados para una experiencia completa y escalable.</h2>
          </div>

          <div className="card-grid">
            {menuItems.map((item) => (
              <article className="menu-card" key={item.name}>
                <p className="menu-price">{item.price}</p>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-split" id="proceso">
          <div className="section-heading">
            <p className="eyebrow">Cómo trabajamos</p>
            <h2>Un recorrido corto, claro y apto para móvil o escritorio.</h2>
          </div>

          <div className="steps">
            {steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-band" id="contacto">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2>Listo para seguir modificando la web según lo que me indiques.</h2>
            <p>
              Si quieres, el siguiente paso puede ser sumar tu contenido real, ajustar la
              identidad visual o convertir esta base en catálogo, ecommerce o página de
              reservas.
            </p>
          </div>

          <div className="contact-actions">
            <a className="button button-primary" href="mailto:hola@caprichodulce.com">
              hola@caprichodulce.com
            </a>
            <a className="button button-secondary" href="tel:+0000000000">
              Llamar ahora
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
