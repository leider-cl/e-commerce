const contactItems = [
  { label: "Ventas", value: "contacto@leider.cl" },
  { label: "Soporte", value: "+56 9 90229066" },
  { label: "Horario", value: "Lun–Vie / 09:00–18:00" },
];

export function ContactSection() {
  return (
    <section className="border-t border-white/10 py-12 xl:py-16" id="contacto">
      <div className="mb-5 flex flex-col gap-2">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">Contacto</span>
        <h2 className="m-0 max-w-full text-[clamp(2rem,5vw,3.25rem)] font-black leading-none tracking-[-0.04em] text-white break-words">Conversemos sobre tu operación.</h2>
        <p className="m-0 max-w-176 text-slate-300 leading-7">
          Solicita tu cotización técnica y te contactamos en menos de 24h.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <article className="flex flex-col items-start gap-4 border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-white/70">Cotización técnica</span>
          <h3 className="m-0 max-w-[15ch] text-[clamp(1.9rem,5vw,3rem)] font-black leading-tight tracking-[-0.04em]">¿Necesitas algo específico?</h3>
          <p className="m-0 max-w-160 leading-7">Indícanos qué necesitas: producto, cantidad y contexto de uso.</p>
          <a className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-white bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-950 no-underline transition hover:border-white hover:bg-slate-100" href="mailto:ventas@leider.cl?subject=Cotización%20LEIDER">
            Solicitar cotización
          </a>
        </article>

        <div className="grid grid-cols-1 gap-4" aria-label="Canales de contacto">
          {contactItems.map((item) => (
            <article className="border border-slate-200 bg-white p-5 shadow-sm" key={item.label}>
              <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-brand-dark">{item.label}</span>
              <strong className="block text-[clamp(1.15rem,4vw,1.6rem)] leading-tight break-words">{item.value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
