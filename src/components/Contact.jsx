import React from 'react'

export default function Contact() {
  return (
    <section id="contacto" className="contact-section panel" aria-labelledby="contacto-title">
      <div className="contact-container">
        <h2 id="contacto-title">Contacto</h2>
        <p className="section-subtitle">¿Tienes preguntas? Nos gustaría escucharte</p>
        <form id="contact-form" className="contact-form" noValidate>
          <fieldset>
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Nombre</label>
              <input id="contact-name" name="name" type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Correo Electrónico</label>
              <input id="contact-email" name="email" type="email" className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">Mensaje</label>
              <textarea id="contact-message" name="message" className="form-textarea" rows="6"></textarea>
            </div>
            <button type="submit" className="form-submit">Enviar Mensaje</button>
          </fieldset>
        </form>
      </div>
    </section>
  )
}
