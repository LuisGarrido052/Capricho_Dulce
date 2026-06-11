import { useEffect, useState } from 'react'
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

const emptyProductForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
}

const emptyAuthForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: true,
}

const emptyAuthStore = {
  users: [],
  session: null,
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readStoredJson(storageKey, fallbackValue) {
  const browserWindow = globalThis.window

  if (!browserWindow) {
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

function createSessionFromUser(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
  }
}

function Header({ sessionName, onOpenAccount, onOpenAdmin }) {
  return (
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
        <button className="nav-link-button" type="button" onClick={onOpenAccount}>
          Cuenta
        </button>
      </nav>

      <div className="header-actions">
        <button className="button button-secondary button-compact" type="button" onClick={onOpenAccount}>
          {sessionName ? `Mi cuenta · ${sessionName}` : 'Mi cuenta'}
        </button>
        <button className="button button-primary button-compact" type="button" onClick={onOpenAdmin}>
          Administrar
        </button>
      </div>
    </header>
  )
}

function StatusBanner({ sessionName, onOpenAccount, onOpenAdmin }) {
  return (
    <section className="status-banner" aria-label="Estado del proyecto">
      <div>
        <p className="eyebrow">Nueva base activa</p>
        <h2>La cuenta se abrió aparte y el administrador quedó como panel propio.</h2>
        <p>
          Esta franja muestra el cambio de forma inmediata, sin depender de abrir modales.
          Desde aquí puedes entrar a tu cuenta o ir directo al panel de productos.
        </p>
      </div>

      <div className="status-actions">
        <strong>{sessionName ? `Sesión: ${sessionName}` : 'Sesión cerrada'}</strong>
        <button className="button button-secondary" type="button" onClick={onOpenAccount}>
          Abrir mi cuenta
        </button>
        <button className="button button-primary" type="button" onClick={onOpenAdmin}>
          Ir a administrar
        </button>
      </div>
    </section>
  )
}

StatusBanner.propTypes = {
  sessionName: PropTypes.string,
  onOpenAccount: PropTypes.func.isRequired,
  onOpenAdmin: PropTypes.func.isRequired,
}

function HeroSection({ onOpenAccount, onOpenAdmin, productsCount, sessionName }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">Pedidos artesanales para celebraciones reales</p>
        <h1>Una página completa para mostrar, vender y administrar tu marca dulce.</h1>
        <p className="hero-text">
          La cuenta y la administración ya no comparten el mismo bloque. El acceso vive en un panel
          separado, el CRUD queda en otro panel y la sesión se mantiene guardada en el navegador.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#sabores">
            Ver productos
          </a>
          <button className="button button-secondary" type="button" onClick={onOpenAccount}>
            Mi cuenta
          </button>
          <button className="button button-secondary" type="button" onClick={onOpenAdmin}>
            Administrar
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
          <h2>Diseño, sesión y administración separadas desde el inicio.</h2>
          <p>
            Ya no queda todo mezclado en la misma pantalla: la cuenta se abre aparte, el CRUD vive en su propio panel y el acceso queda persistente.
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
            “La idea es que esta base sirva para migrar el proyecto anterior a React y seguir iterando sin quedar atado a una sola landing.”
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

function AccountForm({ mode, authForm, message, onModeChange, onAuthFormChange, onSubmit }) {
  const title = mode === 'signup' ? 'Crea tu cuenta' : 'Accede a tu cuenta'

  return (
    <form className="panel-card auth-card" onSubmit={onSubmit}>
      <div className="auth-tabs" role="tablist" aria-label="Opciones de acceso">
        <button
          className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'}
          type="button"
          onClick={() => onModeChange('signin')}
        >
          Iniciar sesión
        </button>
        <button
          className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
          type="button"
          onClick={() => onModeChange('signup')}
        >
          Crear cuenta
        </button>
      </div>

      <h3>{title}</h3>

      <div className="form-grid">
        {mode === 'signup' ? (
          <label>
            <span>Nombre completo</span>
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

        {mode === 'signup' ? (
          <label>
            <span>Teléfono</span>
            <input
              type="tel"
              value={authForm.phone}
              onChange={(event) => onAuthFormChange('phone', event.target.value)}
              placeholder="+56 9 1234 5678"
            />
          </label>
        ) : null}

        <label>
          <span>Contraseña</span>
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => onAuthFormChange('password', event.target.value)}
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        {mode === 'signup' ? (
          <label className="full-width">
            <span>Confirmar contraseña</span>
            <input
              type="password"
              value={authForm.confirmPassword}
              onChange={(event) => onAuthFormChange('confirmPassword', event.target.value)}
              placeholder="Repite la contraseña"
            />
          </label>
        ) : null}
      </div>

      {mode === 'signup' ? (
        <p className="form-hint">
          La contraseña debe tener al menos 8 caracteres, una letra y un número.
        </p>
      ) : null}

      {message ? <p className="form-message">{message}</p> : null}
    </form>
  )
}

function ProfileCard({ session, onGoToAdmin, onLogout }) {
  return (
    <div className="panel-card auth-card profile-card">
      <p className="eyebrow">Mi perfil</p>
      <h3>{session.name}</h3>
      <p>Sesión activa y guardada en el navegador.</p>

      <div className="profile-grid">
        <div>
          <strong>Correo</strong>
          <span>{session.email}</span>
        </div>
        <div>
          <strong>Teléfono</strong>
          <span>{session.phone || 'No registrado'}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="button button-primary" type="button" onClick={onGoToAdmin}>
          Abrir administrador
        </button>
        <button className="button button-secondary" type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

function AccountPanel({
  isOpen,
  mode,
  session,
  authForm,
  message,
  onClose,
  onModeChange,
  onAuthFormChange,
  onSubmit,
  onLogout,
  onGoToAdmin,
}) {
  if (!isOpen) {
    return null
  }

  const hasSession = Boolean(session)

  return (
    <section className="panel-overlay">
      <div className="panel-sheet panel-account">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Mi cuenta</p>
            <h2>Acceso separado del catálogo y del panel admin</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar cuenta">
            ✕
          </button>
        </div>

        <div className="account-tabs" role="tablist" aria-label="Opciones de cuenta">
          <button
            className={mode === 'signin' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            onClick={() => onModeChange('signin')}
          >
            Iniciar sesión
          </button>
          <button
            className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            onClick={() => onModeChange('signup')}
          >
            Crear cuenta
          </button>
          <button
            className={hasSession && mode === 'profile' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            onClick={() => onModeChange('profile')}
            disabled={!hasSession}
          >
            Mi perfil
          </button>
        </div>

        <div className="account-grid">
          {hasSession && mode === 'profile' ? (
            <ProfileCard session={session} onGoToAdmin={onGoToAdmin} onLogout={onLogout} />
          ) : (
            <AccountForm
              mode={mode}
              authForm={authForm}
              message={message}
              onModeChange={onModeChange}
              onAuthFormChange={onAuthFormChange}
              onSubmit={onSubmit}
            />
          )}

          <aside className="panel-card auth-summary">
            <h3>Por qué este acceso es más sólido</h3>
            <ul>
              <li>Registro con nombre, teléfono, correo y confirmación de contraseña</li>
              <li>Validación de correo y contraseña más segura</li>
              <li>La sesión se guarda y se recupera automáticamente al volver a abrir la página</li>
              <li>El panel admin queda separado del flujo de cuenta</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}

function ProductForm({
  productForm,
  adminMessage,
  pendingImageName,
  onProductSubmit,
  onProductFormChange,
  onProductImage,
  onResetForm,
}) {
  return (
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
  )
}

function ProductList({ products, onEditProduct, onDeleteProduct }) {
  return (
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
  )
}

function AdminPanel({
  isOpen,
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
  if (!isOpen) {
    return null
  }

  return (
    <section className="panel-overlay">
      <div className="panel-sheet panel-admin">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Administrar</p>
            <h2>CRUD de productos con subida de imágenes</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar panel admin">
            ✕
          </button>
        </div>

        <div className="admin-layout modal-admin-layout">
          <ProductForm
            productForm={productForm}
            adminMessage={adminMessage}
            pendingImageName={pendingImageName}
            onProductSubmit={onProductSubmit}
            onProductFormChange={onProductFormChange}
            onProductImage={onProductImage}
            onResetForm={onResetForm}
          />

          <ProductList
            products={products}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
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
          Si quieres, el siguiente paso puede ser conectar este frontend a una API real
          para usuarios y productos, o dejarlo como panel interno con persistencia local.
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

function FloatingActions({ onOpenAccount, onOpenAdmin }) {
  return (
    <div className="floating-actions" aria-label="Acciones rápidas">
      <button className="floating-action floating-account" type="button" onClick={onOpenAccount}>
        Mi cuenta
      </button>
      <button className="floating-action floating-admin" type="button" onClick={onOpenAdmin}>
        Administrar
      </button>
    </div>
  )
}

Header.propTypes = {
  sessionName: PropTypes.string,
  onOpenAccount: PropTypes.func.isRequired,
  onOpenAdmin: PropTypes.func.isRequired,
}

HeroSection.propTypes = {
  onOpenAccount: PropTypes.func.isRequired,
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

AccountForm.propTypes = {
  mode: PropTypes.oneOf(['signin', 'signup']).isRequired,
  authForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    acceptTerms: PropTypes.bool.isRequired,
  }).isRequired,
  message: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  onAuthFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

ProfileCard.propTypes = {
  session: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
  }).isRequired,
  onGoToAdmin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

AccountPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['signin', 'signup', 'profile']).isRequired,
  session: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
  }),
  authForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    acceptTerms: PropTypes.bool.isRequired,
  }).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onModeChange: PropTypes.func.isRequired,
  onAuthFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onGoToAdmin: PropTypes.func.isRequired,
}

ProductForm.propTypes = {
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
  onProductSubmit: PropTypes.func.isRequired,
  onProductFormChange: PropTypes.func.isRequired,
  onProductImage: PropTypes.func.isRequired,
  onResetForm: PropTypes.func.isRequired,
}

ProductList.propTypes = {
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
  onEditProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
}

AdminPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
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

FloatingActions.propTypes = {
  onOpenAccount: PropTypes.func.isRequired,
  onOpenAdmin: PropTypes.func.isRequired,
}

function App() {
  const [products, setProducts] = useState(() =>
    readStoredJson(PRODUCTS_STORAGE_KEY, initialProducts),
  )
  const [authStore, setAuthStore] = useState(() =>
    readStoredJson(AUTH_STORAGE_KEY, emptyAuthStore),
  )
  const [accountOpen, setAccountOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [accountMode, setAccountMode] = useState(() =>
    readStoredJson(AUTH_STORAGE_KEY, emptyAuthStore).session ? 'profile' : 'signin',
  )
  const [authForm, setAuthForm] = useState(emptyAuthForm)
  const [authMessage, setAuthMessage] = useState('')
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [adminMessage, setAdminMessage] = useState('')
  const [pendingImageName, setPendingImageName] = useState('')

  const users = authStore.users ?? []
  const session = authStore.session ?? null
  useEffect(() => {
    globalThis.window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    globalThis.window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore))
  }, [authStore])

  function openAccount(mode = session ? 'profile' : 'signin') {
    setAccountMode(mode)
    setAccountOpen(true)
    setAuthMessage('')
  }

  function openAdmin() {
    if (!session) {
      setAccountMode('signin')
      setAccountOpen(true)
      setAuthMessage('Inicia sesión para administrar productos.')
      return
    }

    setAdminOpen(true)
  }

  function handleAuthFormChange(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }))
  }

  function handleAuthSubmit(event) {
    event.preventDefault()
    setAuthMessage('')

    const email = authForm.email.trim().toLowerCase()
    const password = authForm.password.trim()
    const name = authForm.name.trim()
    const phone = authForm.phone.trim()

    if (!email || !password) {
      setAuthMessage('Completa correo y contraseña.')
      return
    }

    if (!isValidEmail(email)) {
      setAuthMessage('Ingresa un correo válido.')
      return
    }

    if (accountMode === 'signup') {
      if (!name || !phone || !authForm.confirmPassword.trim()) {
        setAuthMessage('Completa nombre, teléfono, correo y contraseña.')
        return
      }

      if (!isStrongPassword(password)) {
        setAuthMessage('La contraseña debe tener al menos 8 caracteres, una letra y un número.')
        return
      }

      if (password !== authForm.confirmPassword.trim()) {
        setAuthMessage('Las contraseñas no coinciden.')
        return
      }

      if (!authForm.acceptTerms) {
        setAuthMessage('Debes aceptar el uso básico de tus datos para crear la cuenta.')
        return
      }

      const existingUser = users.find((user) => user.email === email)

      if (existingUser) {
        setAuthMessage('Ese correo ya está registrado.')
        return
      }

      const nextUser = { name, email, phone, password }
      setAuthStore((current) => ({
        users: [...current.users, nextUser],
        session: createSessionFromUser(nextUser),
      }))
      setAccountMode('profile')
      setAccountOpen(true)
      setAuthForm(emptyAuthForm)
      setAuthMessage('Cuenta creada y sesión iniciada.')
      return
    }

    const matchedUser = users.find((user) => user.email === email && user.password === password)

    if (!matchedUser) {
      setAuthMessage('Credenciales inválidas.')
      return
    }

    setAuthStore((current) => ({
      ...current,
      session: createSessionFromUser(matchedUser),
    }))
    setAccountMode('profile')
    setAccountOpen(true)
    setAuthForm(emptyAuthForm)
    setAuthMessage('Sesión iniciada correctamente.')
  }

  function handleLogout() {
    setAuthStore((current) => ({ ...current, session: null }))
    setAccountMode('signin')
    setAccountOpen(false)
    setAdminMessage('Sesión cerrada.')
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
      id: productForm.id ?? makeId('prod'),
      name,
      description,
      price,
      category,
      image:
        productForm.image ||
        'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=900&q=80',
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

    setProductForm(emptyProductForm)
    setPendingImageName('')
    setAdminMessage(productForm.id ? 'Producto actualizado.' : 'Producto agregado.')
  }

  function editProduct(product) {
    setProductForm(product)
    setPendingImageName(product.image?.startsWith('data:') ? 'Imagen cargada' : '')
    setAdminOpen(true)
  }

  function deleteProduct(productId) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
    setAdminMessage('Producto eliminado.')
  }

  function resetProductForm() {
    setProductForm(emptyProductForm)
    setPendingImageName('')
  }

  const sessionName = session?.name

  return (
    <div className="page-shell">
      <Header sessionName={sessionName} onOpenAccount={() => openAccount()} onOpenAdmin={openAdmin} />

      <main>
        <StatusBanner
          sessionName={sessionName}
          onOpenAccount={() => openAccount()}
          onOpenAdmin={openAdmin}
        />
        <HeroSection
          onOpenAccount={() => openAccount()}
          onOpenAdmin={openAdmin}
          productsCount={products.length}
          sessionName={sessionName}
        />
        <CatalogSection products={products} onOpenAdmin={openAdmin} />
        <ProcessSection />

        <section className="section account-summary-band">
          <div>
            <p className="eyebrow">Mi cuenta</p>
            <h2>Acceso y perfil en una ventana separada.</h2>
            <p>
              Usa el botón de cuenta para abrir tu perfil, iniciar sesión o registrarte sin mezclarlo con el catálogo ni con el CRUD.
            </p>
          </div>
          <div className="account-summary-card">
            <strong>{session ? session.name : 'Sin sesión activa'}</strong>
            <span>{session ? session.email : 'Abre Mi cuenta para entrar o crear una cuenta.'}</span>
            <button className="button button-secondary" type="button" onClick={() => openAccount()}>
              Abrir cuenta
            </button>
          </div>
        </section>

        <ContactSection />
      </main>

      <FloatingActions onOpenAccount={() => openAccount()} onOpenAdmin={openAdmin} />

      <AccountPanel
        isOpen={accountOpen}
        mode={accountMode}
        session={session}
        authForm={authForm}
        message={authMessage}
        onClose={() => setAccountOpen(false)}
        onModeChange={setAccountMode}
        onAuthFormChange={handleAuthFormChange}
        onSubmit={handleAuthSubmit}
        onLogout={handleLogout}
        onGoToAdmin={openAdmin}
      />

      <AdminPanel
        isOpen={adminOpen}
        productForm={productForm}
        adminMessage={adminMessage}
        pendingImageName={pendingImageName}
        products={products}
        onClose={() => setAdminOpen(false)}
        onProductSubmit={handleProductSubmit}
        onProductFormChange={(field, value) =>
          setProductForm((current) => ({ ...current, [field]: value }))
        }
        onProductImage={handleProductImage}
        onResetForm={resetProductForm}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
      />
    </div>
  )
}

export default App
