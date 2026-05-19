"use strict";

/**
 * CAPRICHO DULCE - Aplicación Front-End
 * Proyecto Analista Programador - Estructuras Dinámicas
 * 
 * Módulos principales:
 * - API: Consumo asincrónico de datos JSON
 * - Carrusel: Slider dinámico con cambio automático cada 5 segundos
 * - Validación: Validación de formularios con buenas prácticas
 * - Storage: Almacenamiento de datos de formularios
 */

(function BakeryApp() {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════ */
    /* CONFIGURACIÓN Y ESTADO GLOBAL                                  */
    /* ═══════════════════════════════════════════════════════════════ */

    const CONFIG = {
        API_URL: './productos.json',
        CAROUSEL_INTERVAL: 5000, // 5 segundos
        FORM_STORAGE_KEY: 'bakery_forms_data'
    };

    const STATE = {
        products: [],
        currentCarouselIndex: 0,
        carouselIntervalId: null,
        formSubmissions: {
            registrations: [],
            logins: [],
            contacts: []
        }
    };

    const DOM_REFS = {};

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: UTILIDADES                                              */
    /* ═══════════════════════════════════════════════════════════════ */

    const Utils = {
        /**
         * Valida si un email tiene formato correcto
         * @param {string} email - Email a validar
         * @returns {boolean} - true si es válido
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Valida si una contraseña cumple requisitos de seguridad
         * @param {string} password - Contraseña a validar
         * @returns {boolean} - true si tiene al menos 8 caracteres
         */
        isValidPassword(password) {
            return password && password.length >= 8;
        },

        /**
         * Valida si un texto no está vacío y tiene longitud mínima
         * @param {string} text - Texto a validar
         * @param {number} minLength - Longitud mínima
         * @returns {boolean} - true si es válido
         */
        isValidText(text, minLength = 3) {
            return text && text.trim().length >= minLength;
        },

        /**
         * Almacena datos en localStorage
         * @param {string} key - Clave
         * @param {object} data - Datos a guardar
         */
        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (error) {
                console.error('Error al guardar en localStorage:', error);
            }
        },

        /**
         * Obtiene datos de localStorage
         * @param {string} key - Clave
         * @returns {object|null} - Datos guardados o null
         */
        getFromStorage(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Error al leer localStorage:', error);
                return null;
            }
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: API (Consumo de datos JSON)                             */
    /* ═══════════════════════════════════════════════════════════════ */

    const API = {
        /**
         * Carga los productos desde el archivo JSON usando fetch
         * @returns {Promise<Array>} - Promesa con array de productos
         */
        async cargarProductos() {
            try {
                const response = await fetch(CONFIG.API_URL);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data.productos)) {
                    throw new Error('Formato de JSON inválido');
                }
                
                STATE.products = data.productos;
                console.log(`✓ Se cargaron ${STATE.products.length} productos`);
                return STATE.products;
                
            } catch (error) {
                console.error('Error al cargar productos:', error);
                return [];
            }
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: CARRUSEL                                                */
    /* ═══════════════════════════════════════════════════════════════ */

    const Carousel = {
        /**
         * Inicializa el carrusel con los productos
         */
        inicializar() {
            if (STATE.products.length === 0) {
                console.warn('No hay productos para mostrar en el carrusel');
                return;
            }

            this.renderizar();
            this.generarIndicadores();
            this.registrarEventos();
            this.iniciarRotacionAutomatica();
        },

        /**
         * Renderiza el producto actual en el carrusel
         */
        renderizar() {
            const product = STATE.products[STATE.currentCarouselIndex];
            const carouselView = DOM_REFS.carouselView;

            if (!product) return;

            carouselView.innerHTML = `
                <div class="carousel-product" role="region" aria-label="Producto en carrusel: ${product.nombre}">
                    <div class="carousel-product-image">
                        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy" onerror="this.style.display='none'">
                    </div>
                    <div class="carousel-product-info">
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion}</p>
                        <p class="precio">$${product.precio.toFixed(2)}</p>
                    </div>
                </div>
            `;

            this.actualizarIndicadores();
        },

        /**
         * Genera los puntos indicadores del carrusel
         */
        generarIndicadores() {
            const container = DOM_REFS.carouselIndicators;
            container.innerHTML = '';

            STATE.products.forEach((_, index) => {
                const li = document.createElement('li');
                li.setAttribute('aria-label', `Producto ${index + 1}`);
                li.addEventListener('click', () => this.ir(index));
                container.appendChild(li);
            });
        },

        /**
         * Actualiza el estado visual de los indicadores
         */
        actualizarIndicadores() {
            const indicators = DOM_REFS.carouselIndicators.querySelectorAll('li');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === STATE.currentCarouselIndex);
            });
        },

        /**
         * Registra eventos de controles del carrusel
         */
        registrarEventos() {
            DOM_REFS.prevBtn.addEventListener('click', () => this.anterior());
            DOM_REFS.nextBtn.addEventListener('click', () => this.siguiente());
            
            // Pausar rotación automática al interactuar con el carrusel
            DOM_REFS.carousel.addEventListener('mouseenter', () => this.pausarRotacion());
            DOM_REFS.carousel.addEventListener('mouseleave', () => this.iniciarRotacionAutomatica());
        },

        /**
         * Muestra el producto anterior
         */
        anterior() {
            STATE.currentCarouselIndex = (STATE.currentCarouselIndex - 1 + STATE.products.length) % STATE.products.length;
            this.renderizar();
            this.reiniciarRotacion();
        },

        /**
         * Muestra el siguiente producto
         */
        siguiente() {
            STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.products.length;
            this.renderizar();
            this.reiniciarRotacion();
        },

        /**
         * Va a un producto específico
         * @param {number} index - Índice del producto
         */
        ir(index) {
            if (index >= 0 && index < STATE.products.length) {
                STATE.currentCarouselIndex = index;
                this.renderizar();
                this.reiniciarRotacion();
            }
        },

        /**
         * Inicia la rotación automática del carrusel (cada 5 segundos)
         */
        iniciarRotacionAutomatica() {
            if (STATE.carouselIntervalId) return;
            
            STATE.carouselIntervalId = setInterval(() => {
                STATE.currentCarouselIndex = (STATE.currentCarouselIndex + 1) % STATE.products.length;
                this.renderizar();
            }, CONFIG.CAROUSEL_INTERVAL);
            
            console.log('⏱️ Carrusel automático iniciado');
        },

        /**
         * Pausa la rotación automática
         */
        pausarRotacion() {
            if (STATE.carouselIntervalId) {
                clearInterval(STATE.carouselIntervalId);
                STATE.carouselIntervalId = null;
            }
        },

        /**
         * Pausa y reinicia la rotación automática
         */
        reiniciarRotacion() {
            this.pausarRotacion();
            this.iniciarRotacionAutomatica();
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: VALIDACIÓN DE FORMULARIOS                               */
    /* ═══════════════════════════════════════════════════════════════ */

    const Validador = {
        /**
         * Valida el formulario de registro
         * @param {FormData|Object} datos - Datos del formulario
         * @returns {Object} - { isValid: boolean, errors: Object }
         */
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

        /**
         * Valida el formulario de login
         * @param {FormData|Object} datos - Datos del formulario
         * @returns {Object} - { isValid: boolean, errors: Object }
         */
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

        /**
         * Valida el formulario de contacto
         * @param {FormData|Object} datos - Datos del formulario
         * @returns {Object} - { isValid: boolean, errors: Object }
         */
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

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: GESTIÓN DE FORMULARIOS                                  */
    /* ═══════════════════════════════════════════════════════════════ */

    const FormManager = {
        /**
         * Extrae datos de un formulario
         * @param {HTMLFormElement} form - Elemento formulario
         * @returns {Object} - Datos del formulario
         */
        extraerDatos(form) {
            const formData = new FormData(form);
            const datos = {};
            
            for (const [key, value] of formData.entries()) {
                datos[key] = value.trim();
            }
            
            return datos;
        },

        /**
         * Muestra errores en el formulario
         * @param {HTMLFormElement} form - Elemento formulario
         * @param {Object} errors - Objeto con errores
         */
        mostrarErrores(form, errors) {
            // Limpiar errores previos
            form.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
                el.classList.remove('show');
            });

            form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
                input.classList.remove('error');
            });

            // Mostrar nuevos errores
            Object.entries(errors).forEach(([campo, mensaje]) => {
                const input = form.querySelector(`[name="${campo}"]`);
                const errorElement = form.querySelector(`#${this.generarIdError(form, campo)}`);
                
                if (input) {
                    input.classList.add('error');
                }
                
                if (errorElement) {
                    errorElement.textContent = mensaje;
                    errorElement.classList.add('show');
                }
            });
        },

        /**
         * Genera el ID del elemento error
         * @param {HTMLFormElement} form - Elemento formulario
         * @param {string} campo - Nombre del campo
         * @returns {string} - ID del elemento error
         */
        generarIdError(form, campo) {
            const prefix = form.id.replace('-form', '');
            return `${prefix}-${campo}-error`;
        },

        /**
         * Limpia los errores del formulario
         * @param {HTMLFormElement} form - Elemento formulario
         */
        limpiarErrores(form) {
            form.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
                el.classList.remove('show');
            });

            form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
                input.classList.remove('error');
            });
        },

        /**
         * Muestra un mensaje de éxito
         * @param {HTMLFormElement} form - Elemento formulario
         * @param {string} mensaje - Mensaje a mostrar
         */
        mostrarExito(form, mensaje) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'success-message';
            messageDiv.setAttribute('role', 'alert');
            messageDiv.textContent = mensaje;
            
            form.insertAdjacentElement('beforebegin', messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: RENDERIZADO DE PRODUCTOS                                */
    /* ═══════════════════════════════════════════════════════════════ */

    const ProductRenderer = {
        /**
         * Renderiza la grid de productos
         */
        renderizar() {
            const container = DOM_REFS.productList;
            container.innerHTML = '';

            if (STATE.products.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">No hay productos disponibles</p>';
                return;
            }

            STATE.products.forEach(product => {
                const card = this.crearTarjeta(product);
                container.appendChild(card);
            });
        },

        /**
         * Crea una tarjeta de producto
         * @param {Object} product - Datos del producto
         * @returns {HTMLElement} - Elemento tarjeta
         */
        crearTarjeta(product) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `product-name-${product.id}`);

            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 id="product-name-${product.id}" class="product-name">${product.nombre}</h3>
                    <span class="product-category">${product.categoria}</span>
                    <p class="product-description">${product.descripcion}</p>
                    <p class="product-price">$${product.precio.toFixed(2)}</p>
                    <p class="product-available">${product.disponible ? '✓ Disponible' : '✗ Agotado'}</p>
                </div>
            `;

            return card;
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* MÓDULO: INICIALIZACIÓN                                          */
    /* ═══════════════════════════════════════════════════════════════ */

    const Inicializador = {
        /**
         * Obtiene referencias a elementos del DOM
         */
        obtenerReferencias() {
            DOM_REFS.carouselView = document.getElementById('carousel-view');
            DOM_REFS.carousel = document.getElementById('carousel');
            DOM_REFS.carouselIndicators = document.getElementById('carousel-indicators');
            DOM_REFS.prevBtn = document.getElementById('prev-btn');
            DOM_REFS.nextBtn = document.getElementById('next-btn');
            DOM_REFS.productList = document.getElementById('product-list');

            DOM_REFS.registerForm = document.getElementById('register-form');
            DOM_REFS.loginForm = document.getElementById('login-form');
            DOM_REFS.contactForm = document.getElementById('contact-form');
        },

        /**
         * Registra los eventos de los formularios
         */
        registrarEventosFormularios() {
            // Formulario de Registro
            if (DOM_REFS.registerForm) {
                DOM_REFS.registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.manejarRegistro();
                });

                // Limpiar errores al escribir
                DOM_REFS.registerForm.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', () => {
                        FormManager.limpiarErrores(DOM_REFS.registerForm);
                    });
                });
            }

            // Formulario de Login
            if (DOM_REFS.loginForm) {
                DOM_REFS.loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.manejarLogin();
                });

                DOM_REFS.loginForm.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', () => {
                        FormManager.limpiarErrores(DOM_REFS.loginForm);
                    });
                });
            }

            // Formulario de Contacto
            if (DOM_REFS.contactForm) {
                DOM_REFS.contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.manejarContacto();
                });

                DOM_REFS.contactForm.querySelectorAll('input, textarea').forEach(field => {
                    field.addEventListener('input', () => {
                        FormManager.limpiarErrores(DOM_REFS.contactForm);
                    });
                });
            }
        },

        /**
         * Maneja el envío del formulario de registro
         */
        manejarRegistro() {
            const datos = FormManager.extraerDatos(DOM_REFS.registerForm);
            const validacion = Validador.validarRegistro(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM_REFS.registerForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.registrations.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);

            FormManager.mostrarExito(DOM_REFS.registerForm, '✓ ¡Registro completado exitosamente!');
            DOM_REFS.registerForm.reset();

            console.log('Nuevo registro:', datos);
        },

        /**
         * Maneja el envío del formulario de login
         */
        manejarLogin() {
            const datos = FormManager.extraerDatos(DOM_REFS.loginForm);
            const validacion = Validador.validarLogin(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM_REFS.loginForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.logins.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);

            FormManager.mostrarExito(DOM_REFS.loginForm, '✓ ¡Sesión iniciada exitosamente!');
            DOM_REFS.loginForm.reset();

            console.log('Nuevo login:', datos);
        },

        /**
         * Maneja el envío del formulario de contacto
         */
        manejarContacto() {
            const datos = FormManager.extraerDatos(DOM_REFS.contactForm);
            const validacion = Validador.validarContacto(datos);

            if (!validacion.isValid) {
                FormManager.mostrarErrores(DOM_REFS.contactForm, validacion.errors);
                return;
            }

            STATE.formSubmissions.contacts.push(datos);
            Utils.saveToStorage(CONFIG.FORM_STORAGE_KEY, STATE.formSubmissions);

            FormManager.mostrarExito(DOM_REFS.contactForm, '✓ ¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.');
            DOM_REFS.contactForm.reset();

            console.log('Nuevo contacto:', datos);
        },

        /**
         * Inicializa la aplicación completa
         */
        async iniciar() {
            console.log('🍰 Inicializando Capricho Dulce...');

            this.obtenerReferencias();
            this.registrarEventosFormularios();

            try {
                // Cargar productos desde JSON
                await API.cargarProductos();

                // Renderizar productos en grid
                if (DOM_REFS.productList) {
                    ProductRenderer.renderizar();
                }

                // Inicializar carrusel
                if (DOM_REFS.carousel) {
                    Carousel.inicializar();
                }

                console.log('✓ Aplicación lista');
            } catch (error) {
                console.error('Error durante la inicialización:', error);
            }
        }
    };

    /* ═══════════════════════════════════════════════════════════════ */
    /* PUNTO DE ENTRADA                                                */
    /* ═══════════════════════════════════════════════════════════════ */

    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Inicializador.iniciar());
    } else {
        Inicializador.iniciar();
    }

})();
