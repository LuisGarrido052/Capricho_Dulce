"use strict";

(function BakeryApp() {
    const CONFIG = {
        UNSPLASH_ACCESS_KEY: 'HtQreZOas3YROzZBpF4eNJej6uduHR_gTt8uycicQVU',
        UNSPLASH_ENDPOINT: 'https://api.unsplash.com/search/photos',
        UNSPLASH_QUERIES: ['pastry', 'cake', 'dessert'],
        UNSPLASH_PER_PAGE: 5,
        CAROUSEL_INTERVAL: 5000,
        FORM_STORAGE_KEY: 'capricho_dulce_forms',
        CART_STORAGE_KEY: 'capricho_dulce_cart',
        ADDRESS_STORAGE_KEY: 'capricho_dulce_address'
    };

    const PRICE_FORMATTER = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    const PRODUCT_TEMPLATES = [
        {
            nombre: 'Butter Croissants',
            descripcion: 'Hojaldre mantequilloso con capas crujientes y aroma artesanal.',
            precio: 15990
        },
        {
            nombre: 'Cheesecake de Frutos Rojos',
            descripcion: 'Crema suave, base crocante y frutos rojos frescos sobre la superficie.',
            precio: 18990
        },
        {
            nombre: 'Brownie Gourmet',
            descripcion: 'Chocolate intenso, interior húmedo y nueces tostadas para un sabor profundo.',
            precio: 12990
        },
        {
            nombre: 'Lemon Pie Clásico',
            descripcion: 'Relleno cítrico, merengue dorado y una base firme con mantequilla.',
            precio: 14990
        },
        {
            nombre: 'Cupcake de Vainilla',
            descripcion: 'Bizcocho esponjoso con crema batida, ideal para una pausa dulce.',
            precio: 10990
        }
    ];

    const STATE = {
        photos: [],
        currentCarouselIndex: 0,
        carouselIntervalId: null,
        cart: [],
        shippingAddress: '',
        formSubmissions: {
            registrations: [],
            logins: [],
            contacts: []
        }
    };

    const DOM = {};

    const Utils = {
        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
        },

        isValidPassword(password) {
            return typeof password === 'string' && password.trim().length >= 8;
        },

        isValidText(text, minLength = 3) {
            return typeof text === 'string' && text.trim().length >= minLength;
        },

        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('No se pudo guardar en localStorage:', error);
            }
        },

        getFromStorage(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (error) {
                console.error('No se pudo leer localStorage:', error);
                return null;
            }
        },

        escapeHTML(value) {
            return String(value)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        },

        formatCLP(value) {
            return PRICE_FORMATTER.format(Math.round(Number(value) || 0));
        }
    };

    const API = {
        async obtenerFotosUnsplash() {
            const limpias = [];

            for (const query of CONFIG.UNSPLASH_QUERIES) {
                if (limpias.length >= CONFIG.UNSPLASH_PER_PAGE) {
                    break;
                }

                const url = new URL(CONFIG.UNSPLASH_ENDPOINT);
                url.searchParams.set('query', query);
                url.searchParams.set('per_page', String(CONFIG.UNSPLASH_PER_PAGE));
                url.searchParams.set('orientation', 'landscape');
                url.searchParams.set('content_filter', 'high');

                const response = await fetch(url.toString(), {
                    headers: {
                        Authorization: `Client-ID ${CONFIG.UNSPLASH_ACCESS_KEY}`
                    }
                });

                if (!response.ok) {
                    console.warn(`Unsplash respondió con ${response.status} para ${query}`);
                    continue;
                }

                const data = await response.json();
                const results = Array.isArray(data.results) ? data.results : [];

                const mapped = results.map((photo, index) => {
                    const template = PRODUCT_TEMPLATES[(limpias.length + index) % PRODUCT_TEMPLATES.length];
                    return {
                        id: photo.id || `${query}-${index}`,
                        imageUrl: photo?.urls?.regular || photo?.urls?.full || photo?.urls?.small || '',
                        alt: photo?.alt_description || template.nombre,
                        nombre: template.nombre,
                        descripcion: template.descripcion,
                        precio: template.precio,
                        author: photo?.user?.name || 'Unsplash',
                        link: photo?.links?.html || '#',
                        query
                    };
                }).filter(item => item.imageUrl);

                for (const item of mapped) {
                    const duplicate = limpias.some(existing => existing.id === item.id || existing.imageUrl === item.imageUrl);
                    if (!duplicate) {
                        limpias.push(item);
                    }

                    if (limpias.length >= CONFIG.UNSPLASH_PER_PAGE) {
                        break;
                    }
                }
            }

            STATE.photos = limpias.slice(0, CONFIG.UNSPLASH_PER_PAGE);
            return STATE.photos;
        }
    };

    const Carro = {
        agregarAlCarro(producto) {
            if (!producto) return;

            const existente = STATE.cart.find(item => item.id === producto.id);
            if (existente) {
                existente.cantidad += 1;
            } else {
                STATE.cart.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    imagen: producto.imageUrl,
                    alt: producto.alt,
                    cantidad: 1
                });
            }

            Utils.saveToStorage(CONFIG.CART_STORAGE_KEY, STATE.cart);
            this.renderizarCarro();
            this.actualizarTotal();
            Cuenta.mostrarEstado(`Se agregó ${producto.nombre} al carro.`, 'success');
        },

        actualizarTotal() {
            const total = STATE.cart.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);
            const cantidad = STATE.cart.reduce((acumulado, item) => acumulado + item.cantidad, 0);

            if (DOM.cartTotal) {
                DOM.cartTotal.textContent = Utils.formatCLP(total);
            }

            if (DOM.cartCount) {
                DOM.cartCount.textContent = cantidad === 1 ? '1 producto' : `${cantidad} productos`;
            }

            return total;
        },

        renderizarCarro() {
            if (!DOM.cartItems) return;

            if (STATE.cart.length === 0) {
                DOM.cartItems.innerHTML = '<p class="cart-empty">Tu carro está vacío. Presiona “Agregar al carro” en el carrusel.</p>';
                this.actualizarTotal();
                return;
            }

            DOM.cartItems.innerHTML = STATE.cart.map(item => `
                <article class="cart-item">
                    <img class="cart-item-image" src="${item.imagen}" alt="${Utils.escapeHTML(item.alt)}" loading="lazy" referrerpolicy="no-referrer">
                    <div class="cart-item-info">
                        <h4>${Utils.escapeHTML(item.nombre)}</h4>
                        <p>${Utils.escapeHTML(item.descripcion)}</p>
                        <span class="cart-item-qty">Cantidad: ${item.cantidad}</span>
                    </div>
                    <div class="cart-item-meta">
                        <strong>${Utils.formatCLP(item.precio * item.cantidad)}</strong>
                    </div>
                </article>
            `).join('');

            this.actualizarTotal();
        },

        vaciarCarro(mostrarMensaje = true) {
            STATE.cart = [];
            Utils.saveToStorage(CONFIG.CART_STORAGE_KEY, STATE.cart);
            this.renderizarCarro();
            if (mostrarMensaje) {
                Cuenta.mostrarEstado('Carro vaciado correctamente.', 'success');
            }
        },

        cargarDesdeStorage() {
            const almacenado = Utils.getFromStorage(CONFIG.CART_STORAGE_KEY);
            if (Array.isArray(almacenado)) {
                STATE.cart = almacenado;
            }
        }
    };

    const Carousel = {
        inicializar() {
            if (!STATE.photos.length || !DOM.carouselView) {
                return;
            }

            this.renderizarSlider();
            this.generarIndicadores();
            this.registrarEventos();
            this.iniciarRotacion();
        },

        renderizarSlider() {
            const producto = STATE.photos[STATE.currentCarouselIndex];
            if (!producto || !DOM.carouselView) return;

            DOM.carouselView.innerHTML = `
                <div class="carousel-product" role="region" aria-label="${Utils.escapeHTML(producto.nombre)}">
                    <figure class="carousel-product-image">
                        <img src="${producto.imageUrl}" alt="${Utils.escapeHTML(producto.alt)}" loading="eager" referrerpolicy="no-referrer">
                    </figure>
                    <div class="carousel-product-info">
                        <span class="product-category">${Utils.escapeHTML(producto.query)}</span>
                        <h3>${Utils.escapeHTML(producto.nombre)}</h3>
                        <p>${Utils.escapeHTML(producto.descripcion)}</p>
                        <p class="carousel-price">${Utils.formatCLP(producto.precio)}</p>
                        <button type="button" id="carousel-add-btn" class="carousel-add-btn">Agregar al carro</button>
                        <p class="photo-credit"><a href="${producto.link}" target="_blank" rel="noreferrer noopener">Ver en Unsplash</a></p>
                    </div>
                </div>
            `;

            const addButton = document.getElementById('carousel-add-btn');
            addButton?.addEventListener('click', () => Carro.agregarAlCarro(producto));

            this.actualizarIndicadores();
        },

        generarIndicadores() {
            if (!DOM.carouselIndicators) return;

            DOM.carouselIndicators.innerHTML = '';
            STATE.photos.forEach((_, index) => {
                const indicator = document.createElement('li');
                indicator.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
                indicator.addEventListener('click', () => this.ir(index));
                DOM.carouselIndicators.appendChild(indicator);
            });
        },

        actualizarIndicadores() {
            const indicators = DOM.carouselIndicators?.querySelectorAll('li') || [];
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === STATE.currentCarouselIndex);
            });
        },

        registrarEventos() {
            DOM.prevBtn?.addEventListener('click', () => this.anterior());
            DOM.nextBtn?.addEventListener('click', () => this.siguiente());
            DOM.carousel?.addEventListener('mouseenter', () => this.pausarRotacion());
            DOM.carousel?.addEventListener('mouseleave', () => this.iniciarRotacion());
        },

        anterior() {
            if (!STATE.photos.length) return;
            STATE.currentCarouselIndex = (STATE.currentCarouselIndex - 1 + STATE.photos.length) % STATE.photos.length;
            this.renderizarSlider();
            this.reiniciarRotacion();
        },

        siguiente() {
            if (!STATE.photos.length) return;
            STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.photos.length;
            this.renderizarSlider();
            this.reiniciarRotacion();
        },

        ir(index) {
            if (index < 0 || index >= STATE.photos.length) return;
            STATE.currentCarouselIndex = index;
            this.renderizarSlider();
            this.reiniciarRotacion();
        },

        iniciarRotacion() {
            if (STATE.carouselIntervalId || STATE.photos.length < 2) return;

            STATE.carouselIntervalId = window.setInterval(() => {
                STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.photos.length;
                this.renderizarSlider();
            }, CONFIG.CAROUSEL_INTERVAL);
        },

        pausarRotacion() {
            if (STATE.carouselIntervalId) {
                clearInterval(STATE.carouselIntervalId);
                STATE.carouselIntervalId = null;
            }
        },

        reiniciarRotacion() {
            this.pausarRotacion();
            this.iniciarRotacion();
        }
    };

    const Validador = {
        validarRegistro(datos) {
            const errors = {};

            if (!Utils.isValidText(datos.fullName, 3)) {
                errors.fullName = 'El nombre debe tener al menos 3 caracteres';
            }

            if (!Utils.isValidEmail(datos.email)) {
                errors.email = 'Por favor ingresa un email válido';
            }

            if (!Utils.isValidPassword(datos.password)) {
                errors.password = 'La contraseña debe tener al menos 8 caracteres';
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        },

        validarLogin(datos) {
            const errors = {};

            if (!Utils.isValidEmail(datos.email)) {
                errors.email = 'Por favor ingresa un email válido';
            }

            if (!Utils.isValidPassword(datos.password)) {
                errors.password = 'La contraseña debe tener al menos 8 caracteres';
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        },

        validarContacto(datos) {
            const errors = {};

            if (!Utils.isValidText(datos.name, 3)) {
                errors.name = 'El nombre debe tener al menos 3 caracteres';
            }

            if (!Utils.isValidEmail(datos.email)) {
                errors.email = 'Por favor ingresa un email válido';
            }

            if (!Utils.isValidText(datos.subject, 5)) {
                errors.subject = 'El asunto debe tener al menos 5 caracteres';
            }

            if (!Utils.isValidText(datos.message, 10)) {
                errors.message = 'El mensaje debe tener al menos 10 caracteres';
            }

            return {
                isValid: Object.keys(errors).length === 0,
                errors
            };
        }
    };

    const FormManager = {
        extraerDatos(form) {
            const data = {};
            const formData = new FormData(form);

            for (const [key, value] of formData.entries()) {
                data[key] = String(value).trim();
            }

            return data;
        },

        mostrarErrores(form, errors) {
            form.querySelectorAll('.form-error').forEach(element => {
                element.textContent = '';
            });

            form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
                input.classList.remove('error');
            });

            Object.entries(errors).forEach(([field, message]) => {
                const input = form.querySelector(`[name="${field}"]`);
                const errorElement = form.querySelector(`#${this.generarIdError(form, field)}`);
                input?.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = message;
                }
            });
        },

        generarIdError(form, field) {
            return `${form.id.replace('-form', '')}-${field}-error`;
        },

        limpiarErrores(form) {
            form.querySelectorAll('.form-error').forEach(element => {
                element.textContent = '';
            });

            form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
                input.classList.remove('error');
            });
        },

        mostrarExito(form, message) {
            const banner = document.createElement('div');
            banner.className = 'success-message';
            banner.setAttribute('role', 'alert');
            banner.textContent = message;
            form.insertAdjacentElement('beforebegin', banner);
            window.setTimeout(() => banner.remove(), 5000);
        }
    };

    const ProductRenderer = {
        renderizar() {
            if (!DOM.productList) return;

            DOM.productList.innerHTML = '';

            STATE.photos.forEach(photo => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.setAttribute('aria-label', photo.nombre);
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${photo.imageUrl}" alt="${Utils.escapeHTML(photo.alt)}" loading="lazy" referrerpolicy="no-referrer">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${Utils.escapeHTML(photo.nombre)}</h3>
                        <span class="product-category">${Utils.escapeHTML(photo.query)}</span>
                        <p class="product-description">${Utils.escapeHTML(photo.descripcion)}</p>
                        <p class="product-price">${Utils.formatCLP(photo.precio)}</p>
                        <button type="button" class="product-add-btn" data-product-id="${photo.id}">Agregar al carro</button>
                        <p class="photo-credit"><a href="${photo.link}" target="_blank" rel="noreferrer noopener">Crédito Unsplash</a></p>
                    </div>
                `;

                card.querySelector('.product-add-btn')?.addEventListener('click', () => Carro.agregarAlCarro(photo));
                DOM.productList.appendChild(card);
            });
        }
    };

    const Cuenta = {
        mostrarEstado(message, type = 'success') {
            if (!DOM.accountStatus) return;
            DOM.accountStatus.textContent = message;
            DOM.accountStatus.classList.toggle('status-message--error', type === 'error');
        },

        guardarDireccion() {
            const address = String(DOM.shippingAddress?.value || '').trim();
            if (!Utils.isValidText(address, 10)) {
                this.mostrarErrorDireccion('Ingresa una dirección válida de envío.');
                return false;
            }

            STATE.shippingAddress = address;
            Utils.saveToStorage(CONFIG.ADDRESS_STORAGE_KEY, address);
            this.limpiarErrorDireccion();
            this.mostrarEstado('Dirección guardada correctamente.', 'success');
            return true;
        },

        realizarPedido() {
            if (STATE.cart.length === 0) {
                this.mostrarEstado('Agrega productos al carro antes de realizar el pedido.', 'error');
                return;
            }

            if (!this.guardarDireccion()) {
                return;
            }

            const total = Carro.actualizarTotal();
            const numeroPedido = `PED-${Date.now().toString().slice(-6)}`;
            const direccion = STATE.shippingAddress;

            this.mostrarEstado(`Pedido ${numeroPedido} simulado por ${Utils.formatCLP(total)}. Envío a: ${direccion}.`, 'success');
            Carro.vaciarCarro(false);
        },

        mostrarErrorDireccion(message) {
            if (DOM.shippingAddressError) {
                DOM.shippingAddressError.textContent = message;
            }
            DOM.shippingAddress?.classList.add('error');
            this.mostrarEstado(message, 'error');
        },

        limpiarErrorDireccion() {
            if (DOM.shippingAddressError) {
                DOM.shippingAddressError.textContent = '';
            }
            DOM.shippingAddress?.classList.remove('error');
        },

        cargarDireccion() {
            const stored = Utils.getFromStorage(CONFIG.ADDRESS_STORAGE_KEY);
            if (typeof stored === 'string') {
                STATE.shippingAddress = stored;
                if (DOM.shippingAddress) {
                    DOM.shippingAddress.value = stored;
                }
            }
        },

        inicializar() {
            DOM.saveAddressBtn?.addEventListener('click', () => this.guardarDireccion());
            DOM.orderBtn?.addEventListener('click', () => this.realizarPedido());
            DOM.shippingAddress?.addEventListener('input', () => this.limpiarErrorDireccion());
            DOM.clearCartBtn?.addEventListener('click', () => Carro.vaciarCarro());
            this.cargarDireccion();
        }
    };

    const Inicializador = {
        obtenerReferencias() {
            DOM.carouselView = document.getElementById('carousel-view');
            DOM.carousel = document.getElementById('carousel');
            DOM.carouselIndicators = document.getElementById('carousel-indicators');
            DOM.prevBtn = document.getElementById('prev-btn');
            DOM.nextBtn = document.getElementById('next-btn');
            DOM.productList = document.getElementById('product-list');
            DOM.status = document.getElementById('api-status');

            DOM.cartItems = document.getElementById('cart-items');
            DOM.cartTotal = document.getElementById('cart-total');
            DOM.cartCount = document.getElementById('cart-count');
            DOM.clearCartBtn = document.getElementById('clear-cart-btn');

            DOM.accountStatus = document.getElementById('account-status');
            DOM.shippingAddress = document.getElementById('shipping-address');
            DOM.shippingAddressError = document.getElementById('shipping-address-error');
            DOM.saveAddressBtn = document.getElementById('save-address-btn');
            DOM.orderBtn = document.getElementById('order-btn');

            DOM.registerForm = document.getElementById('register-form');
            DOM.loginForm = document.getElementById('login-form');
            DOM.contactForm = document.getElementById('contact-form');
        },

        registrarEventosFormularios() {
            const attach = (form, handler) => {
                if (!form) return;

                form.addEventListener('submit', event => {
                    event.preventDefault();
                    handler();
                });

                form.querySelectorAll('input, textarea').forEach(field => {
                    field.addEventListener('input', () => FormManager.limpiarErrores(form));
                });
            };

            attach(DOM.registerForm, () => this.manejarRegistro());
            attach(DOM.loginForm, () => this.manejarLogin());
            attach(DOM.contactForm, () => this.manejarContacto());
        },

        setStatus(message, isError = false) {
            if (!DOM.status) return;
            DOM.status.textContent = message;
            DOM.status.classList.toggle('status-message--error', isError);
        },

        manejarRegistro() {
            const datos = FormManager.extraerDatos(DOM.registerForm);
            const validacion = Validador.validarRegistro(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM.registerForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.registrations.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);
            FormManager.mostrarExito(DOM.registerForm, '✓ ¡Registro completado exitosamente!');
            DOM.registerForm.reset();
        },

        manejarLogin() {
            const datos = FormManager.extraerDatos(DOM.loginForm);
            const validacion = Validador.validarLogin(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM.loginForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.logins.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);
            FormManager.mostrarExito(DOM.loginForm, '✓ ¡Sesión iniciada exitosamente!');
            DOM.loginForm.reset();
        },

        manejarContacto() {
            const datos = FormManager.extraerDatos(DOM.contactForm);
            const validacion = Validador.validarContacto(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM.contactForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.contacts.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);
            FormManager.mostrarExito(DOM.contactForm, '✓ ¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.');
            DOM.contactForm.reset();
        },

        async iniciar() {
            this.obtenerReferencias();
            this.registrarEventosFormularios();
            Cuenta.inicializar();
            Carro.cargarDesdeStorage();
            Carro.renderizarCarro();
            Carro.actualizarTotal();

            const guardado = Utils.getFromStorage(CONFIG.FORM_STORAGE_KEY);
            if (guardado) {
                STATE.formSubmissions = {
                    registrations: Array.isArray(guardado.registrations) ? guardado.registrations : [],
                    logins: Array.isArray(guardado.logins) ? guardado.logins : [],
                    contacts: Array.isArray(guardado.contacts) ? guardado.contacts : []
                };
            }

            try {
                this.setStatus('Cargando fotografías desde Unsplash...');
                await API.obtenerFotosUnsplash();

                if (!STATE.photos.length) {
                    this.setStatus('No se pudieron cargar imágenes desde Unsplash.', true);
                    if (DOM.carouselView) {
                        DOM.carouselView.innerHTML = '<p class="status-message status-message--error">No se pudieron cargar imágenes desde Unsplash.</p>';
                    }
                    return;
                }

                ProductRenderer.renderizar();
                Carousel.inicializar();
                this.setStatus(`Se cargaron ${STATE.photos.length} imágenes de Unsplash.`);
            } catch (error) {
                console.error('Error al iniciar la app:', error);
                this.setStatus('Error al consumir la API de Unsplash.', true);
                if (DOM.carouselView) {
                    DOM.carouselView.innerHTML = '<p class="status-message status-message--error">Error al consumir la API de Unsplash.</p>';
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Inicializador.iniciar());
    } else {
        Inicializador.iniciar();
    }
})();
