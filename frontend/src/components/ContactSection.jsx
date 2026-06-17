const contactItems = [
  { label: "Ventas", value: "contacto@leider.cl" },
  { label: "Soporte", value: "+56 9 90229066" },
  { label: "Horario", value: "Lun–Vie / 09:00–18:00" },
];

export function ContactSection() {
  return (
    <section className="contact-section" id="contacto">
      <div className="section-heading contact-heading">
        <span>Contacto</span>
        <h2>Conversemos sobre tu operación.</h2>
        <p>
          Solicita tu cotización técnica y te contactamos en menos de 24h.
        </p>
      </div>

      <div className="contact-grid">
        <article className="contact-card contact-card-main">
          <span className="contact-kicker">Cotización técnica</span>
          <h3>¿Necesitas algo específico?</h3>
          <p>
            Indícanos qué necesitas: producto, cantidad y contexto de uso.
          </p>
          <a className="primary-action" href="mailto:ventas@leider.cl?subject=Cotización%20LEIDER">
            Solicitar cotización
          </a>
        </article>

        <div className="contact-list" aria-label="Canales de contacto">
          {contactItems.map((item) => (
            <article className="contact-card" key={item.label}>
              <span className="contact-kicker">{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
