"use strict";

(function bakeryApp() {
    // Datos: arreglo de objetos para productos
    const products = [
        {
            id: "p1",
            name: "Tarta Red Velvet",
            image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1200&q=80",
            alt: "Tarta Red Velvet",
            description: "Capas suaves de red velvet con relleno de crema de queso."
        },
        {
            id: "p2",
            name: "Alfajores Caseros",
            image: "https://images.unsplash.com/photo-1602080759127-9b6b8b7f7a63?w=1200&q=80",
            alt: "Alfajores",
            description: "Dulces alfajores rellenos de dulce de leche artesanal."
        },
        {
            id: "p3",
            name: "Cheesecake de Frutos Rojos",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80",
            alt: "Cheesecake",
            description: "Base crocante y crema suave cubierta con frutos rojos."
        },
        {
            id: "p4",
            name: "Torta de Chocolate",
            image: "https://images.unsplash.com/photo-1601972592248-2c9cfedb4f2f?w=1200&q=80",
            alt: "Torta de chocolate",
            description: "Intenso bizcocho de chocolate con ganache brillante."
        }
    ];

    const appState = {
        currentIndex: 0,
        submissions: {
            register: [],
            login: [],
            contact: []
        },
        carouselIntervalId: null
    };

    // DOM references
    const dom = {
        carouselView: document.getElementById("carousel-view"),
        indicators: document.getElementById("carousel-indicators"),
        prevBtn: document.getElementById("prev"),
        nextBtn: document.getElementById("next"),
        productList: document.getElementById("product-list"),
        activityLog: document.getElementById("activity-log"),
        registerForm: document.getElementById("register-form"),
        loginForm: document.getElementById("login-form"),
        contactForm: document.getElementById("contact-form")
    };

    // ---------------- Helpers ----------------
    function qs(sel) { return document.querySelector(sel); }
    function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

    function sanitize(text) {
        return String(text ?? "").replace(/[<>]/g, "");
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return re.test(String(email).toLowerCase());
    }

    function isStrongPassword(pwd) {
        if (!pwd || pwd.length < 8) return false;
        const upper = /[A-Z]/.test(pwd);
        const lower = /[a-z]/.test(pwd);
        const digit = /\d/.test(pwd);
        const special = /[!@#\$%\^&\*]/.test(pwd);
        return upper && lower && digit && special;
    }

    function setFieldError(input, msg) {
        const err = document.querySelector('[data-error-for="' + input.id + '"]');
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        if (err) err.textContent = msg;
    }

    function clearFieldError(input) {
        const err = document.querySelector('[data-error-for="' + input.id + '"]');
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        if (err) err.textContent = '';
    }

    function updateActivityLog() {
        const r = appState.submissions.register.length;
        const l = appState.submissions.login.length;
        const c = appState.submissions.contact.length;
        dom.activityLog.textContent = `Registros: ${r} | Logins: ${l} | Contactos: ${c}`;
    }

    // ---------------- Carousel (modifica DOM) ----------------
    function buildCarousel() {
        dom.indicators.innerHTML = '';
        products.forEach((p, i) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Ir a ' + p.name);
            btn.dataset.index = String(i);
            btn.addEventListener('click', () => goTo(i));
            li.appendChild(btn);
            dom.indicators.appendChild(li);
        });
        renderCarousel();
    }

    function renderCarousel() {
        const p = products[appState.currentIndex];
        // limpiar vista y crear nodos (evitar innerHTML con contenido de usuario)
        dom.carouselView.innerHTML = '';
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.alt;
        img.loading = 'lazy';
        fig.appendChild(img);

        const cap = document.createElement('figcaption');
        const h3 = document.createElement('h3');
        h3.textContent = p.name;
        const pdesc = document.createElement('p');
        pdesc.textContent = p.description;
        cap.appendChild(h3);
        cap.appendChild(pdesc);
        fig.appendChild(cap);
        dom.carouselView.appendChild(fig);

        // indicators state
        qsa('#carousel-indicators button').forEach((b, idx) => {
            b.setAttribute('aria-current', idx === appState.currentIndex ? 'true' : 'false');
        });
    }

    function prev() { goTo(appState.currentIndex - 1); }
    function next() { goTo(appState.currentIndex + 1); }

    function goTo(index) {
        const max = products.length - 1;
        if (index < 0) index = max;
        if (index > max) index = 0;
        appState.currentIndex = index;
        renderCarousel();
        renderProductList();
    }

    function startAutoRotate() {
        stopAutoRotate();
        appState.carouselIntervalId = setInterval(() => {
            next();
        }, 5000);
    }

    function stopAutoRotate() {
        if (appState.carouselIntervalId) {
            clearInterval(appState.carouselIntervalId);
            appState.carouselIntervalId = null;
        }
    }

    // ---------------- Product list rendering ----------------
    function renderProductList() {
        dom.productList.innerHTML = '';
        products.forEach((p, idx) => {
            const card = document.createElement('article');
            card.className = 'product-card';
            const img = document.createElement('img');
            img.src = p.image;
            img.alt = p.alt;
            const h4 = document.createElement('h4');
            h4.textContent = p.name;
            const pd = document.createElement('p');
            pd.textContent = p.description;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = 'Ver en carrusel';
            btn.addEventListener('click', () => {
                goTo(idx);
                // move focus to carousel for accessibility
                dom.carouselView.focus();
            });

            card.appendChild(img);
            card.appendChild(h4);
            card.appendChild(pd);
            card.appendChild(btn);
            dom.productList.appendChild(card);
        });
    }

    // ---------------- Form validation and handlers ----------------
    function getValues(form, names) {
        return names.reduce((acc, n) => {
            const el = form.elements[n];
            acc[n] = el ? sanitize(el.value) : '';
            return acc;
        }, {});
    }

    function validateRegister(values, form) {
        let ok = true;
        const name = form.elements.fullName || form.elements['fullName'] || form.elements['fullName'];
        const email = form.elements.email || form.elements['email'];
        const pwd = form.elements.password || form.elements['password'];
        // map to our ids
        const nameEl = form.querySelector('#reg-name');
        const emailEl = form.querySelector('#reg-email');
        const pwdEl = form.querySelector('#reg-password');
        clearFieldError(nameEl); clearFieldError(emailEl); clearFieldError(pwdEl);

        if (!values.fullName || values.fullName.length < 3) { setFieldError(nameEl, 'Nombre mínimo 3 caracteres'); ok = false; }
        if (!isValidEmail(values.email)) { setFieldError(emailEl, 'Correo inválido'); ok = false; }
        if (!isStrongPassword(values.password)) { setFieldError(pwdEl, 'Contraseña débil: use mayúscula, minúscula, número y símbolo'); ok = false; }
        return ok;
    }

    function validateLogin(values, form) {
        let ok = true;
        const emailEl = form.querySelector('#login-email');
        const pwdEl = form.querySelector('#login-password');
        clearFieldError(emailEl); clearFieldError(pwdEl);
        if (!isValidEmail(values.email)) { setFieldError(emailEl, 'Correo inválido'); ok = false; }
        if (!values.password || values.password.length < 8) { setFieldError(pwdEl, 'Contraseña mínima 8 caracteres'); ok = false; }
        return ok;
    }

    function validateContact(values, form) {
        let ok = true;
        const nameEl = form.querySelector('#contact-name');
        const emailEl = form.querySelector('#contact-email');
        const msgEl = form.querySelector('#contact-message');
        clearFieldError(nameEl); clearFieldError(emailEl); clearFieldError(msgEl);
        if (!values.name || values.name.length < 3) { setFieldError(nameEl, 'Nombre mínimo 3 caracteres'); ok = false; }
        if (!isValidEmail(values.email)) { setFieldError(emailEl, 'Correo inválido'); ok = false; }
        if (!values.message || values.message.length < 15) { setFieldError(msgEl, 'Mensaje mínimo 15 caracteres'); ok = false; }
        if (/(<script|javascript:|onerror=|onload=)/i.test(values.message)) { setFieldError(msgEl, 'Contenido potencialmente inseguro'); ok = false; }
        return ok;
    }

    function setupForms() {
        // Register
        dom.registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const values = getValues(dom.registerForm, ['fullName','email','password']);
            if (!validateRegister(values, dom.registerForm)) return;
            appState.submissions.register.push({ name: values.fullName, email: values.email, createdAt: new Date().toISOString() });
            dom.registerForm.reset(); updateActivityLog();
        });

        // Login
        dom.loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const values = getValues(dom.loginForm, ['email','password']);
            if (!validateLogin(values, dom.loginForm)) return;
            appState.submissions.login.push({ email: values.email, createdAt: new Date().toISOString() });
            dom.loginForm.reset(); updateActivityLog();
        });

        // Contact
        dom.contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const values = getValues(dom.contactForm, ['name','email','message']);
            if (!validateContact(values, dom.contactForm)) return;
            appState.submissions.contact.push({ name: values.name, email: values.email, message: values.message, createdAt: new Date().toISOString() });
            dom.contactForm.reset(); updateActivityLog();
        });
    }

    // ---------------- Initialization ----------------
    function init() {
        buildCarousel();
        renderProductList();
        setupForms();
        // controls
        dom.prevBtn.addEventListener('click', () => { prev(); startAutoRotate(); });
        dom.nextBtn.addEventListener('click', () => { next(); startAutoRotate(); });
        dom.carouselView.tabIndex = -1; // allow focus for accessibility
        // indicators initial buttons
        qsa('#carousel-indicators li').forEach((li, idx) => {
            const btn = li.querySelector('button');
            if (btn) btn.addEventListener('click', () => startAutoRotate());
        });

        startAutoRotate();
        updateActivityLog();
    }

    // start
    document.addEventListener('DOMContentLoaded', init);
})();
