"use strict";

(function BakeryApp() {
    const CONFIG = {
        UNSPLASH_ACCESS_KEY: 'HtQreZOas3YROzZBpF4eNJej6uduHR_gTt8uycicQVU',
        UNSPLASH_ENDPOINT: 'https://api.unsplash.com/search/photos',
        UNSPLASH_QUERIES: ['pastry', 'cake', 'dessert'],
        UNSPLASH_PER_PAGE: 5,
        CAROUSEL_INTERVAL: 5000,
        FORM_STORAGE_KEY: 'capricho_dulce_forms'
    };

    const STATE = {
        photos: [],
        currentCarouselIndex: 0,
        carouselIntervalId: null,
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
        }
    };

    const API = {
        async obtenerFotosUnsplash() {
            const limpias = [];

            for (const query of CONFIG.UNSPLASH_QUERIES) {
                if (limpias.length >= CONFIG.UNSPLASH_PER_PAGE) break;

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

                const mapeadas = results.map((photo, index) => ({
                    id: photo.id || `${query}-${index}`,
                    imageUrl: photo?.urls?.regular || photo?.urls?.full || photo?.urls?.small || '',
                    alt: photo?.alt_description || photo?.description || `Fotografía de ${query} ${index + 1}`,
                    title: photo?.description || photo?.alt_description || `Postre ${index + 1}`,
                    author: photo?.user?.name || 'Unsplash',
                    link: photo?.links?.html || '#',
                    query
                })).filter(item => item.imageUrl);

                for (const item of mapeadas) {
                    const existe = limpias.some(existing => existing.id === item.id || existing.imageUrl === item.imageUrl);
                    if (!existe) {
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

    const Carousel = {
        inicializar() {
            if (!STATE.photos.length || !DOM.carouselView) {
                return;
            }

            this.renderizar();
            this.generarIndicadores();
            this.registrarEventos();
            this.iniciarRotacion();
        },

        renderizar() {
            const item = STATE.photos[STATE.currentCarouselIndex];
            if (!item || !DOM.carouselView) return;

            DOM.carouselView.innerHTML = `
                <div class="carousel-product" role="region" aria-label="${Utils.escapeHTML(item.title)}">
                    <figure class="carousel-product-image">
                        <img src="${item.imageUrl}" alt="${Utils.escapeHTML(item.alt)}" loading="eager" referrerpolicy="no-referrer">
                    </figure>
                    <div class="carousel-product-info">
                        <span class="product-category">${Utils.escapeHTML(item.query)}</span>
                        <h3>${Utils.escapeHTML(item.title)}</h3>
                        <p>Foto destacada por ${Utils.escapeHTML(item.author)}. La API de Unsplash nos entrega un arreglo de resultados que transformamos a objetos más simples.</p>
                        <p class="photo-credit"><a href="${item.link}" target="_blank" rel="noreferrer noopener">Ver en Unsplash</a></p>
                    </div>
                </div>
            `;

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
            this.renderizar();
            this.reiniciarRotacion();
        },

        siguiente() {
            if (!STATE.photos.length) return;
            STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.photos.length;
            this.renderizar();
            this.reiniciarRotacion();
        },

        ir(index) {
            if (index < 0 || index >= STATE.photos.length) return;
            STATE.currentCarouselIndex = index;
            this.renderizar();
            this.reiniciarRotacion();
        },

        iniciarRotacion() {
            if (STATE.carouselIntervalId || STATE.photos.length < 2) return;

            STATE.carouselIntervalId = window.setInterval(() => {
                STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.photos.length;
                this.renderizar();
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
            if (!Utils.isValidText(datos.fullName, 3)) errors.fullName = 'El nombre debe tener al menos 3 caracteres';
            if (!Utils.isValidEmail(datos.email)) errors.email = 'Por favor ingresa un email válido';
            if (!Utils.isValidPassword(datos.password)) errors.password = 'La contraseña debe tener al menos 8 caracteres';
            return { isValid: Object.keys(errors).length === 0, errors };
        },

        validarLogin(datos) {
            const errors = {};
            if (!Utils.isValidEmail(datos.email)) errors.email = 'Por favor ingresa un email válido';
            if (!Utils.isValidPassword(datos.password)) errors.password = 'La contraseña debe tener al menos 8 caracteres';
            return { isValid: Object.keys(errors).length === 0, errors };
        },

        validarContacto(datos) {
            const errors = {};
            if (!Utils.isValidText(datos.name, 3)) errors.name = 'El nombre debe tener al menos 3 caracteres';
            if (!Utils.isValidEmail(datos.email)) errors.email = 'Por favor ingresa un email válido';
            if (!Utils.isValidText(datos.subject, 5)) errors.subject = 'El asunto debe tener al menos 5 caracteres';
            if (!Utils.isValidText(datos.message, 10)) errors.message = 'El mensaje debe tener al menos 10 caracteres';
            return { isValid: Object.keys(errors).length === 0, errors };
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
            form.querySelectorAll('.form-input, .form-textarea').forEach(input => input.classList.remove('error'));

            Object.entries(errors).forEach(([field, message]) => {
                const input = form.querySelector(`[name="${field}"]`);
                const errorElement = form.querySelector(`#${this.generarIdError(form, field)}`);
                input?.classList.add('error');
                if (errorElement) errorElement.textContent = message;
            });
        },

        generarIdError(form, field) {
            return `${form.id.replace('-form', '')}-${field}-error`;
        },

        limpiarErrores(form) {
            form.querySelectorAll('.form-error').forEach(element => (element.textContent = ''));
            form.querySelectorAll('.form-input, .form-textarea').forEach(input => input.classList.remove('error'));
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

    const PhotoRenderer = {
        renderizar() {
            if (!DOM.productList) return;

            DOM.productList.innerHTML = '';

            STATE.photos.forEach(photo => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.setAttribute('aria-label', photo.title);
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${photo.imageUrl}" alt="${Utils.escapeHTML(photo.alt)}" loading="lazy" referrerpolicy="no-referrer">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${Utils.escapeHTML(photo.title)}</h3>
                        <span class="product-category">${Utils.escapeHTML(photo.query)}</span>
                        <p class="product-description">Fotografía de ${Utils.escapeHTML(photo.author)} tomada desde Unsplash y reutilizada en una interfaz de repostería.</p>
                        <p class="photo-credit"><a href="${photo.link}" target="_blank" rel="noreferrer noopener">Crédito Unsplash</a></p>
                    </div>
                `;
                DOM.productList.appendChild(card);
            });
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

                PhotoRenderer.renderizar();
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
