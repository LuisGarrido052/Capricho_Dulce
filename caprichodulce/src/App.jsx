import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import './App.css'

const AUTH_STORAGE_KEY = 'capricho-auth-state'
const PRODUCTS_STORAGE_KEY = 'capricho-products-state'

const initialProducts = [
  {
    id: 'prod-1',
    name: 'Torta de vainilla',
    description: 'Bizcocho suave con crema chantilly y frutillas frescas.',
    price: '$18.900',
    category: 'Tortas',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-2',
    name: 'Cupcakes premium',
    description: 'Caja variada con relleno y terminación de buttercream.',
    price: '$8.500',
    category: 'Cupcakes',
    image:
      'https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-3',
    name: 'Brownies intensos',
    description: 'Porciones húmedas con chocolate amargo y nueces.',
    price: '$4.200',
    category: 'Postres',
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'prod-4',
    name: 'Mesa dulce evento',
    description: 'Montaje completo con variedad de formatos y colores.',
    price: 'Cotización',
    category: 'Eventos',
    image:
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=80',
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

const emptyForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
}

function readStoredJson(storageKey, fallbackValue) {
  const browserWindow = globalThis.window

  if (browserWindow === undefined) {
    return fallbackValue
  }

  const rawValue = browserWindow.localStorage.getItem(storageKey)

  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

function HeroSection({ onOpenAdmin, productsCount, sessionName }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">Pedidos artesanales para celebraciones reales</p>
        <h1>Una página completa para mostrar, vender y administrar tu marca dulce.</h1>
        <p className="hero-text">
          Este punto de partida ahora incluye administración local de productos,
          subida de imágenes y sesión persistente en el navegador para que puedas
          probar el flujo completo sin backend.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#sabores">
            Ver productos
          </a>
          <button className="button button-secondary" type="button" onClick={onOpenAdmin}>
            Abrir panel
          </button>
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
          <h2>Diseño, sabor, administración y sesión en un solo flujo.</h2>
          <p>
            El botón Administrar abre un panel con login/registro, productos editables
            y persistencia local en el navegador.
          </p>

          <div className="panel-grid">
            <div>
              <strong>Sesión</strong>
              <span>{sessionName ? `Activa: ${sessionName}` : 'Inactiva'}</span>
            </div>
            <div>
              <strong>Productos</strong>
              <span>{productsCount} artículos cargados</span>
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
  )
}

function CatalogSection({ products, onOpenAdmin }) {
  return (
    <section className="section section-surface" id="sabores">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">Catálogo administrable</p>
          <h2>Productos con imagen, precio y acciones de edición.</h2>
        </div>
        <button className="button button-secondary" type="button" onClick={onOpenAdmin}>
          Administrar productos
        </button>
      </div>

      <div className="card-grid">
        {products.map((product) => (
          <article className="menu-card menu-card-product" key={product.id}>
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="menu-card-body">
              <p className="menu-price">{product.price}</p>
              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
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
  )
}

function AuthSection({
  authMode,
  authForm,
  authMessage,
  session,
  onAuthModeChange,
  onAuthSubmit,
  onAuthFormChange,
  onLogout,
}) {
  return (
    <section className="section auth-section" id="auth-panel">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">Acceso y sesión</p>
          <h2>Registro, inicio de sesión y sesión persistente.</h2>
        </div>
        {session ? (
          <button className="button button-secondary" type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </div>

      <div className="auth-layout">
        <form className="panel-card auth-card" onSubmit={onAuthSubmit}>
          <div className="auth-tabs" role="tablist" aria-label="Opciones de acceso">
            <button
              className={authMode === 'login' ? 'auth-tab active' : 'auth-tab'}
              type="button"
              onClick={() => onAuthModeChange('login')}
            >
              Iniciar sesión
            </button>
            <button
              className={authMode === 'register' ? 'auth-tab active' : 'auth-tab'}
              type="button"
              onClick={() => onAuthModeChange('register')}
            >
              Registrarse
            </button>
          </div>

          <div className="form-grid">
            {authMode === 'register' ? (
              <label>
                <span>Nombre</span>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(event) => onAuthFormChange('name', event.target.value)}
                  placeholder="Tu nombre"
                />
              </label>
            ) : null}
            <label>
              <span>Correo</span>
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => onAuthFormChange('email', event.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </label>
            <label>
              <span>Contraseña</span>
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => onAuthFormChange('password', event.target.value)}
                placeholder="••••••••"
              />
            </label>
          </div>

          {authMessage ? <p className="form-message">{authMessage}</p> : null}

          <button className="button button-primary auth-submit" type="submit">
            {authMode === 'register' ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>

        <div className="panel-card auth-summary">
          <h3>Estado de sesión</h3>
          <p>
            {session
              ? `Sesión iniciada como ${session.name}. Se mantiene guardada en localStorage.`
              : 'No hay sesión activa. Al iniciar sesión o registrarte, el acceso queda persistido.'}
          </p>
          <ul>
            <li>Acceso guardado en el navegador</li>
            <li>Registro con validación básica</li>
            <li>Panel disponible solo con sesión</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function AdminSection({
  showAdmin,
  productForm,
  adminMessage,
  pendingImageName,
  products,
  onClose,
  onProductSubmit,
  onProductFormChange,
  onProductImage,
  onResetForm,
  onEditProduct,
  onDeleteProduct,
}) {
  if (!showAdmin) {
    return null
  }

  return (
    <section className="section admin-panel" id="admin-panel">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">Administrar</p>
          <h2>CRUD de productos con subida de imágenes.</h2>
        </div>
        <button className="button button-secondary" type="button" onClick={onClose}>
          Cerrar panel
        </button>
      </div>

      <div className="admin-layout">
        <form className="panel-card admin-form" onSubmit={onProductSubmit}>
          <h3>{productForm.id ? 'Editar producto' : 'Nuevo producto'}</h3>
          <div className="form-grid">
            <label>
              <span>Nombre</span>
              <input
                type="text"
                value={productForm.name}
                onChange={(event) => onProductFormChange('name', event.target.value)}
                placeholder="Nombre del producto"
              />
            </label>
            <label>
              <span>Categoría</span>
              <input
                type="text"
                value={productForm.category}
                onChange={(event) => onProductFormChange('category', event.target.value)}
                placeholder="Tortas, Postres, Eventos"
              />
            </label>
            <label>
              <span>Precio</span>
              <input
                type="text"
                value={productForm.price}
                onChange={(event) => onProductFormChange('price', event.target.value)}
                placeholder="$12.000"
              />
            </label>
            <label className="full-width">
              <span>Descripción</span>
              <textarea
                value={productForm.description}
                onChange={(event) => onProductFormChange('description', event.target.value)}
                placeholder="Describe el producto"
                rows="4"
              />
            </label>
            <label className="full-width">
              <span>Imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => onProductImage(event.target.files?.[0])}
              />
            </label>
          </div>

          {pendingImageName ? <p className="form-message">Imagen lista: {pendingImageName}</p> : null}
          {adminMessage ? <p className="form-message">{adminMessage}</p> : null}

          {productForm.image ? (
            <img className="admin-preview" src={productForm.image} alt="Vista previa del producto" />
          ) : null}

          <div className="admin-actions">
            <button className="button button-primary" type="submit">
              {productForm.id ? 'Guardar cambios' : 'Agregar producto'}
            </button>
            <button className="button button-secondary" type="button" onClick={onResetForm}>
              Limpiar formulario
            </button>
          </div>
        </form>

        <div className="panel-card admin-list">
          <h3>Productos cargados</h3>
          <div className="admin-items">
            {products.map((product) => (
              <article className="admin-item" key={product.id}>
                <img className="admin-item-image" src={product.image} alt={product.name} />
                <div className="admin-item-content">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                  <p>{product.price}</p>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEditProduct(product)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => onDeleteProduct(product.id)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="section contact-band" id="contacto">
      <div>
        <p className="eyebrow">Contacto</p>
        <h2>Listo para seguir modificando la web según lo que me indiques.</h2>
        <p>
          Si quieres, el siguiente paso puede ser sumar el backend real, conectar una
          API para usuarios y productos, o dejar esta base como panel interno.
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
  )
}

HeroSection.propTypes = {
  onOpenAdmin: PropTypes.func.isRequired,
  productsCount: PropTypes.number.isRequired,
  sessionName: PropTypes.string,
}

CatalogSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onOpenAdmin: PropTypes.func.isRequired,
}

AuthSection.propTypes = {
  authMode: PropTypes.oneOf(['login', 'register']).isRequired,
  authForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  authMessage: PropTypes.string.isRequired,
  session: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
  onAuthModeChange: PropTypes.func.isRequired,
  onAuthSubmit: PropTypes.func.isRequired,
  onAuthFormChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

AdminSection.propTypes = {
  showAdmin: PropTypes.bool.isRequired,
  productForm: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  adminMessage: PropTypes.string.isRequired,
  pendingImageName: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onProductSubmit: PropTypes.func.isRequired,
  onProductFormChange: PropTypes.func.isRequired,
  onProductImage: PropTypes.func.isRequired,
  onResetForm: PropTypes.func.isRequired,
  onEditProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
}

function App() {
  const [products, setProducts] = useState(() => readStoredJson(PRODUCTS_STORAGE_KEY, initialProducts))
  const [users, setUsers] = useState(() => readStoredJson(AUTH_STORAGE_KEY, { users: [] }).users)
  const [session, setSession] = useState(() => readStoredJson(AUTH_STORAGE_KEY, { users: [], session: null }).session)
  const [showAdmin, setShowAdmin] = useState(() => Boolean(readStoredJson(AUTH_STORAGE_KEY, { users: [], session: null }).session))
  const [authMode, setAuthMode] = useState('login')
  const [authMessage, setAuthMessage] = useState('')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [productForm, setProductForm] = useState(emptyForm)
  const [adminMessage, setAdminMessage] = useState('')
  const [pendingImageName, setPendingImageName] = useState('')

  const activeUser = useMemo(() => {
    if (!session) {
      return null
    }

    return users.find((user) => user.email === session.email) ?? session
  }, [session, users])

  useEffect(() => {
    globalThis.window.localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(products),
    )
  }, [products])

  useEffect(() => {
    globalThis.window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ users, session }),
    )
  }, [users, session])

  function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthMessage('')

    const email = authForm.email.trim().toLowerCase()
    const password = authForm.password.trim()
    const name = authForm.name.trim()

    if (!email || !password || (authMode === 'register' && !name)) {
      setAuthMessage('Completa todos los campos requeridos.')
      return
    }

    if (authMode === 'register') {
      const existingUser = users.find((user) => user.email === email)

      if (existingUser) {
        setAuthMessage('Ese correo ya está registrado.')
        return
      }

      const nextUser = { name, email, password }
      setUsers((currentUsers) => [...currentUsers, nextUser])
      setSession({ name, email })
      setShowAdmin(true)
      setAuthMessage('Cuenta creada y sesión iniciada.')
      setAuthForm({ name: '', email: '', password: '' })
      return
    }

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password,
    )

    if (!matchedUser) {
      setAuthMessage('Credenciales inválidas.')
      return
    }

    setSession({ name: matchedUser.name, email: matchedUser.email })
    setShowAdmin(true)
    setAuthMessage('Sesión iniciada correctamente.')
    setAuthForm({ name: '', email: '', password: '' })
  }

  function handleLogout() {
    setSession(null)
    setShowAdmin(false)
    setAdminMessage('Sesión cerrada.')
    setProductForm(emptyForm)
  }

  function handleProductImage(file) {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setProductForm((currentForm) => ({ ...currentForm, image: result }))
      setPendingImageName(file.name)
    }

    reader.readAsDataURL(file)
  }

  function handleProductSubmit(event) {
    event.preventDefault()

    if (!session) {
      setAdminMessage('Debes iniciar sesión para administrar productos.')
      return
    }

    const name = productForm.name.trim()
    const description = productForm.description.trim()
    const price = productForm.price.trim()
    const category = productForm.category.trim()

    if (!name || !description || !price || !category) {
      setAdminMessage('Completa nombre, descripción, precio y categoría.')
      return
    }

    const nextProduct = {
      id: productForm.id ?? crypto.randomUUID(),
      name,
      description,
      price,
      category,
      image: productForm.image || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=900&q=80',
    }

    setProducts((currentProducts) => {
      const exists = currentProducts.some((product) => product.id === nextProduct.id)

      if (exists) {
        return currentProducts.map((product) =>
          product.id === nextProduct.id ? nextProduct : product,
        )
      }

      return [nextProduct, ...currentProducts]
    })

    setProductForm(emptyForm)
    setPendingImageName('')
    setAdminMessage(nextProduct.id === productForm.id ? 'Producto actualizado.' : 'Producto agregado.')
  }

  function editProduct(product) {
    setProductForm(product)
    setPendingImageName(product.image?.startsWith('data:') ? 'Imagen cargada' : '')
    setShowAdmin(true)
  }

  function deleteProduct(productId) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
    setAdminMessage('Producto eliminado.')
  }

  function resetProductForm() {
    setProductForm(emptyForm)
    setPendingImageName('')
  }

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
          <a href="#auth-panel">Acceso</a>
        </nav>

        <button className="topbar-cta" type="button" onClick={() => setShowAdmin((value) => !value)}>
          Administrar
        </button>
      </header>

      <main>
        <HeroSection
          onOpenAdmin={() => setShowAdmin(true)}
          productsCount={products.length}
          sessionName={activeUser?.name}
        />
        <CatalogSection products={products} onOpenAdmin={() => setShowAdmin(true)} />
        <ProcessSection />
        <AuthSection
          authMode={authMode}
          authForm={authForm}
          authMessage={authMessage}
          session={session}
          onAuthModeChange={setAuthMode}
          onAuthSubmit={handleAuthSubmit}
          onAuthFormChange={(field, value) => setAuthForm((current) => ({ ...current, [field]: value }))}
          onLogout={handleLogout}
        />
        <AdminSection
          showAdmin={showAdmin}
          productForm={productForm}
          adminMessage={adminMessage}
          pendingImageName={pendingImageName}
          products={products}
          onClose={() => setShowAdmin(false)}
          onProductSubmit={handleProductSubmit}
          onProductFormChange={(field, value) => setProductForm((current) => ({ ...current, [field]: value }))}
          onProductImage={handleProductImage}
          onResetForm={resetProductForm}
          onEditProduct={editProduct}
          onDeleteProduct={deleteProduct}
        />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
