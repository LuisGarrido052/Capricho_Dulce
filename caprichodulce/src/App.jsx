/* eslint-disable react/prop-types, react/jsx-tag-spacing, react/jsx-wrap-multilines, react/jsx-one-expression-per-line, react/self-closing-comp, react/jsx-curly-newline, react-hooks/exhaustive-deps, no-nested-ternary, prefer-optional-chain */
import { useEffect, useState } from 'react'
import './App.css'

const AUTH_STORAGE_KEY = 'capricho-auth-state'
const PRODUCTS_STORAGE_KEY = 'capricho-products-state'
const PAGE_STORAGE_KEY = 'capricho-ui-page'

const initialProducts = [
  {
    id: 'cake-001',
    name: 'Torta frutal',
    price: '12.500',
    category: 'Repostería',
    description: 'Bizcocho suave con crema y fruta fresca de temporada.',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cake-002',
    name: 'Brownie deluxe',
    price: '4.500',
    category: 'Snack',
    description: 'Brownie húmedo con cobertura de chocolate y nuez.',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cake-003',
    name: 'Cupcakes dulces',
    price: '7.000',
    category: 'Eventos',
    description: 'Lote de cupcakes decorados para celebraciones y pedidos especiales.',
    image:
      'https://images.unsplash.com/photo-1586985289906-406988974504?auto=format&fit=crop&w=900&q=80',
  },
]

const emptyProductForm = {
  id: '',
  name: '',
  price: '',
  category: '',
  description: '',
  image: '',
}

const emptyLoginForm = {
  email: '',
  password: '',
}

const emptyRegisterForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
}

const emptyAuthStore = {
  users: [],
  session: null,
}

const pageLabels = {
  home: 'Inicio',
  login: 'Ingresar',
  register: 'Registro',
  account: 'Mi cuenta',
  admin: 'CRUD',
}

function readStoredJson(key, fallback) {
  if (globalThis.window === undefined) {
    return fallback
  }

  try {
    const rawValue = globalThis.window.localStorage.getItem(key)
    if (!rawValue) {
      return fallback
    }

    return JSON.parse(rawValue)
  } catch {
    return fallback
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isStrongPassword(password) {
  return password.trim().length >= 8
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function createSessionFromUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    loggedInAt: new Date().toISOString(),
  }
}

function PageShell({ currentPage, session, onNavigate, onLogout }) {
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

function NoticeBar({ message }) {
  if (!message) {
    return null
  }

  return <div className="notice-bar">{message}</div>
}

function HomePage({ session, products, onNavigate }) {
  return (
    <section className="page page-home">
      <div className="hero-grid">
        <div className="hero-copy card-surface">
          <p className="eyebrow">Experiencia separada</p>
          <h1>Inicio, login, registro, cuenta y CRUD en pantallas distintas.</h1>
          <p className="hero-text">
            La tienda mantiene el catálogo público, pero el acceso, la cuenta y la administración
            quedan en vistas independientes para que el flujo sea claro.
          </p>

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
            <button className="button-ghost" onClick={() => onNavigate('admin')} type="button">
              Abrir CRUD
            </button>
          </div>
        </div>

        <aside className="hero-side card-surface">
          <p className="eyebrow">Accesos principales</p>
          <div className="route-stack">
            <button className="route-card" onClick={() => onNavigate('login')} type="button">
              <strong>Ingresar</strong>
              <span>Solo la pantalla de autenticación.</span>
            </button>
            <button className="route-card" onClick={() => onNavigate('register')} type="button">
              <strong>Registro</strong>
              <span>Formulario independiente para crear cuenta.</span>
            </button>
            <button className="route-card" onClick={() => onNavigate('account')} type="button">
              <strong>Mi cuenta</strong>
              <span>Resumen de la sesión reconocida.</span>
            </button>
            <button className="route-card emphasize" onClick={() => onNavigate('admin')} type="button">
              <strong>CRUD / Administrar</strong>
              <span>Crear, editar y borrar productos con imagen.</span>
            </button>
          </div>
        </aside>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Catálogo visible</p>
          <h2>Productos destacados</h2>
        </div>
        <span className="section-note">Este bloque es público y no mezcla el login con el CRUD.</span>
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

function LoginPage({ form, message, onChange, onSubmit, onNavigate }) {
  return (
    <section className="page page-auth">
      <div className="page-heading">
        <p className="eyebrow">Pantalla independiente</p>
        <h1>Ingresar</h1>
        <p>Solo autenticación. No incluye registro ni CRUD en la misma vista.</p>
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

function RegisterPage({ form, message, onChange, onSubmit, onNavigate }) {
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

function AccountPage({ session, onNavigate, onLogout }) {
  return (
    <section className="page page-account">
      <div className="page-heading">
        <p className="eyebrow">Sesión reconocida</p>
        <h1>Mi cuenta</h1>
        <p>Esta pantalla muestra el usuario activo y deja el CRUD aparte.</p>
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
              <button className="button-primary" onClick={() => onNavigate('admin')} type="button">
                Ir al CRUD
              </button>
              <button className="button-secondary" onClick={() => onNavigate('home')} type="button">
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
              <li>El CRUD solo se abre desde su pantalla dedicada.</li>
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

function ProductEditor({ form, message, onChange, onSubmit, onReset, onImageUpload }) {
  return (
    <form className="card-surface editor-form" onSubmit={onSubmit}>
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">CRUD</p>
          <h2>{form.id ? 'Editar producto' : 'Nuevo producto'}</h2>
        </div>
        <button className="button-ghost" onClick={onReset} type="button">
          Limpiar
        </button>
      </div>

      <div className="field">
        <label htmlFor="product-name">Nombre</label>
        <input id="product-name" name="name" onChange={onChange} required type="text" value={form.name} />
      </div>
      <div className="field">
        <label htmlFor="product-category">Categoría</label>
        <input id="product-category" name="category" onChange={onChange} required type="text" value={form.category} />
      </div>
      <div className="field">
        <label htmlFor="product-price">Precio</label>
        <input id="product-price" name="price" onChange={onChange} required type="text" value={form.price} />
      </div>
      <div className="field">
        <label htmlFor="product-description">Descripción</label>
        <textarea id="product-description" name="description" onChange={onChange} required rows="4" value={form.description} />
      </div>
      <div className="field">
        <label htmlFor="product-image">Imagen</label>
        <input id="product-image" accept="image/*" onChange={onImageUpload} type="file" />
      </div>
      {form.image ? (
        <div className="image-preview">
          <img alt="Vista previa del producto" src={form.image} />
        </div>
      ) : null}
      {message ? <p className="form-message">{message}</p> : null}
      <button className="button-primary full-width" type="submit">
        {form.id ? 'Guardar cambios' : 'Agregar producto'}
      </button>
    </form>
  )
}

function ProductManager({ products, onEdit, onDelete }) {
  return (
    <div className="card-surface manager-list">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Lista</p>
          <h2>Productos administrados</h2>
        </div>
        <span className="section-note">Editar, borrar y actualizar imágenes.</span>
      </div>

      <div className="manager-grid">
        {products.map((product) => (
          <article className="manager-card" key={product.id}>
            <img alt={product.name} src={product.image} />
            <div>
              <p className="product-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <div className="manager-footer">
              <strong>${product.price}</strong>
              <div className="manager-actions">
                <button className="button-secondary" onClick={() => onEdit(product)} type="button">
                  Editar
                </button>
                <button className="button-ghost" onClick={() => onDelete(product.id)} type="button">
                  Borrar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function AdminPage({
  session,
  products,
  form,
  message,
  onNavigate,
  onChange,
  onSubmit,
  onReset,
  onImageUpload,
  onEdit,
  onDelete,
}) {
  return (
    <section className="page page-admin">
      <div className="page-heading">
        <p className="eyebrow">Pantalla separada</p>
        <h1>CRUD / Administrar</h1>
        <p>Todo el control de productos está fuera del login, fuera del registro y fuera de la cuenta.</p>
      </div>

      {session ? (
        <div className="admin-layout">
          <ProductEditor
            form={form}
            message={message}
            onChange={onChange}
            onImageUpload={onImageUpload}
            onReset={onReset}
            onSubmit={onSubmit}
          />
          <ProductManager onDelete={onDelete} onEdit={onEdit} products={products} />
        </div>
      ) : (
        <div className="card-surface empty-state">
          <h2>Necesitas iniciar sesión para administrar</h2>
          <p>El botón CRUD existe y lleva a esta pantalla, pero requiere una sesión activa.</p>
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

function App() {
  const [products, setProducts] = useState(() => readStoredJson(PRODUCTS_STORAGE_KEY, initialProducts))
  const [authStore, setAuthStore] = useState(() => readStoredJson(AUTH_STORAGE_KEY, emptyAuthStore))
  const [loginForm, setLoginForm] = useState(emptyLoginForm)
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [productForm, setProductForm] = useState(emptyProductForm)
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = readStoredJson(PAGE_STORAGE_KEY, '')
    return storedPage || 'home'
  })
  const [authMessage, setAuthMessage] = useState('')
  const [crudMessage, setCrudMessage] = useState('')

  const currentUser = authStore.users.find((user) => user.id === authStore.session?.id) ?? null
  const session = authStore.session ? currentUser ?? authStore.session : null
  const currentPageLabel = pageLabels[currentPage] ?? 'Inicio'

  useEffect(() => {
    globalThis.window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    globalThis.window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore))
  }, [authStore])

  useEffect(() => {
    globalThis.window.localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPage))
  }, [currentPage])

  const navigate = (page) => {
    if ((page === 'account' || page === 'admin') && !session) {
      setAuthMessage('Debes iniciar sesión para abrir esa pantalla.')
      setCurrentPage('login')
      return
    }

    if (session && (page === 'login' || page === 'register')) {
      setCurrentPage('account')
      return
    }

    setAuthMessage('')
    setCrudMessage('')
    setCurrentPage(page)
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleRegisterChange = (event) => {
    const { name, value, checked, type } = event.target
    setRegisterForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleProductChange = (event) => {
    const { name, value } = event.target
    setProductForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    if (!isValidEmail(loginForm.email)) {
      setAuthMessage('Escribe un correo válido para ingresar.')
      return
    }

    const normalizedEmail = loginForm.email.trim().toLowerCase()
    const user = authStore.users.find((candidate) => candidate.email === normalizedEmail)

    if (user?.password !== loginForm.password) {
      setAuthMessage('Correo o contraseña incorrectos.')
      return
    }

    const sessionData = createSessionFromUser(user)
    setAuthStore((previous) => ({ ...previous, session: sessionData }))
    setLoginForm(emptyLoginForm)
    setAuthMessage(`Sesión iniciada como ${user.name}.`)
    setCurrentPage('account')
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()

    if (!registerForm.acceptTerms) {
      setAuthMessage('Debes aceptar el guardado de sesión para continuar.')
      return
    }

    if (!isValidEmail(registerForm.email)) {
      setAuthMessage('Escribe un correo válido para registrarte.')
      return
    }

    if (!isStrongPassword(registerForm.password)) {
      setAuthMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthMessage('Las contraseñas no coinciden.')
      return
    }

    const normalizedEmail = registerForm.email.trim().toLowerCase()
    const emailExists = authStore.users.some((user) => user.email === normalizedEmail)

    if (emailExists) {
      setAuthMessage('Ese correo ya está registrado.')
      return
    }

    const user = {
      id: makeId('user'),
      name: registerForm.name.trim(),
      phone: registerForm.phone.trim(),
      email: normalizedEmail,
      password: registerForm.password,
      createdAt: new Date().toISOString(),
    }

    const sessionData = createSessionFromUser(user)
    setAuthStore((previous) => ({
      users: [...previous.users, user],
      session: sessionData,
    }))
    setRegisterForm(emptyRegisterForm)
    setAuthMessage(`Cuenta creada y sesión iniciada como ${user.name}.`)
    setCurrentPage('account')
  }

  const handleLogout = () => {
    setAuthStore((previous) => ({ ...previous, session: null }))
    setAuthMessage('Sesión cerrada correctamente.')
    setCrudMessage('')
    setCurrentPage('home')
  }

  const handleProductSubmit = (event) => {
    event.preventDefault()

    const nextProduct = {
      ...productForm,
      id: productForm.id || makeId('product'),
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price: productForm.price.trim(),
      description: productForm.description.trim(),
      image: productForm.image,
    }

    if (!nextProduct.image) {
      setCrudMessage('Debes agregar una imagen para el producto.')
      return
    }

    setProducts((previous) => {
      const existingIndex = previous.findIndex((product) => product.id === nextProduct.id)

      if (existingIndex === -1) {
        return [nextProduct, ...previous]
      }

      const updatedProducts = [...previous]
      updatedProducts[existingIndex] = nextProduct
      return updatedProducts
    })

    setCrudMessage(productForm.id ? 'Producto actualizado.' : 'Producto agregado.')
    setProductForm(emptyProductForm)
  }

  const handleProductReset = () => {
    setProductForm(emptyProductForm)
    setCrudMessage('')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      setProductForm((previous) => ({ ...previous, image: typeof result === 'string' ? result : '' }))
    }
    reader.readAsDataURL(file)
  }

  const handleProductEdit = (product) => {
    setProductForm(product)
    setCrudMessage(`Editando ${product.name}.`)
    setCurrentPage('admin')
  }

  const handleProductDelete = (productId) => {
    setProducts((previous) => previous.filter((product) => product.id !== productId))
    setCrudMessage('Producto eliminado.')

    if (productForm.id === productId) {
      setProductForm(emptyProductForm)
    }
  }

  let activePage = currentPage

  if (session && (currentPage === 'login' || currentPage === 'register')) {
    activePage = 'account'
  } else if (!session && (currentPage === 'account' || currentPage === 'admin')) {
    activePage = 'login'
  }

  return (
    <div className="app-shell">
      <PageShell currentPage={activePage} onLogout={handleLogout} onNavigate={navigate} session={session} />
      <NoticeBar message={authMessage || crudMessage} />

      <main className="app-main">
        <div className="page-label">Pantalla actual: {currentPageLabel}</div>

        {activePage === 'home' ? (
          <HomePage onNavigate={navigate} products={products} session={session} />
        ) : null}

        {activePage === 'login' ? (
          <LoginPage
            form={loginForm}
            message={authMessage}
            onChange={handleLoginChange}
            onNavigate={navigate}
            onSubmit={handleLoginSubmit}
          />
        ) : null}

        {activePage === 'register' ? (
          <RegisterPage
            form={registerForm}
            message={authMessage}
            onChange={handleRegisterChange}
            onNavigate={navigate}
            onSubmit={handleRegisterSubmit}
          />
        ) : null}

        {activePage === 'account' ? (
          <AccountPage onNavigate={navigate} onLogout={handleLogout} session={session} />
        ) : null}

        {activePage === 'admin' ? (
          <AdminPage
            form={productForm}
            message={crudMessage}
            onChange={handleProductChange}
            onDelete={handleProductDelete}
            onEdit={handleProductEdit}
            onImageUpload={handleImageUpload}
            onNavigate={navigate}
            onReset={handleProductReset}
            onSubmit={handleProductSubmit}
            products={products}
            session={session}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
