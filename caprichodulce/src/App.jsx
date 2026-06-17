import { useEffect, useState } from 'react'
import './App.css'
import PageShell from './components/PageShell.jsx'
import { pageLabels } from './constants.js'
import NoticeBar from './components/NoticeBar.jsx'
import HomePage from './components/HomePage.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import AccountPage from './components/AccountPage.jsx'

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

function readStoredJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)
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

function App() {
  const [products] = useState(() => readStoredJson(PRODUCTS_STORAGE_KEY, initialProducts))
  const [authStore, setAuthStore] = useState(() => readStoredJson(AUTH_STORAGE_KEY, emptyAuthStore))
  const [loginForm, setLoginForm] = useState(emptyLoginForm)
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = readStoredJson(PAGE_STORAGE_KEY, '')
    return storedPage || 'home'
  })
  const [authMessage, setAuthMessage] = useState('')

  const currentUser = authStore.users.find((user) => user.id === authStore.session?.id) ?? null
  const session = authStore.session ? currentUser ?? authStore.session : null
  const currentPageLabel = pageLabels[currentPage] ?? 'Inicio'

  useEffect(() => {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStore))
  }, [authStore])

  useEffect(() => {
    window.localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPage))
  }, [currentPage])

  const navigate = (page) => {
    if (page === 'account' && !session) {
      setAuthMessage('Debes iniciar sesión para abrir esa pantalla.')
      setCurrentPage('login')
      return
    }

    if (session && (page === 'login' || page === 'register')) {
      setCurrentPage('account')
      return
    }

    setAuthMessage('')
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
    setCurrentPage('home')
  }

  let activePage = currentPage

  if (session && (currentPage === 'login' || currentPage === 'register')) {
    activePage = 'account'
  } else if (!session && currentPage === 'account') {
    activePage = 'login'
  }

  return (
    <div className="app-shell">
      <PageShell currentPage={activePage} onLogout={handleLogout} onNavigate={navigate} session={session} />
      <NoticeBar message={authMessage} />

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
      </main>
    </div>
  )
}

export default App
