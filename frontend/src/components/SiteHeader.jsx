import { useAuth } from "../context/useAuth";

const navigationGroups = [
  {
    label: "IoT Industrial",
    items: ["Controladores IoT", "Sensores", "Telemetría", "Monitoreo remoto"],
  },
  {
    label: "LoRaWAN",
    items: ["Gateways", "Nodos", "Antenas", "Redes privadas"],
  },
  {
    label: "Instrumentación",
    items: ["RS485", "SDI-12", "4-20mA", "Energía solar"],
  },
  {
    label: "Proyectos",
    items: ["Integración", "Soporte técnico", "Cotizaciones"],
  },
];

export function SiteHeader({
  cartCount,
  cartLinkRef,
  onOpenAuth,
  onNavigateHome,
  onNavigateToSection,
  onSearchChange,
  onOpenCart,
}) {
  const { user, logout } = useAuth();

  function searchFromMenu(term) {
    onSearchChange(term);
    onNavigateToSection("catalogo");
  }

  return (
    <header className="sticky top-0 z-50 -mx-3 border-b border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,.08)] sm:-mx-4 lg:-mx-5">
      <div className="mx-auto grid min-h-24 w-full max-w-[96rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 lg:px-8">
        <a
          className="inline-flex w-fit flex-col no-underline"
          href="/"
          aria-label="Ir al inicio de LEIDER Shop"
          onClick={(event) => {
            event.preventDefault();
            onNavigateHome();
          }}
        >
          <span className="font-mono text-5xl font-black leading-none tracking-[0.08em] text-[#22324a]">
            LEIDER
          </span>
          <span className="self-end font-mono text-xs font-black uppercase tracking-[0.25em] text-brand-dark">
            Shop
          </span>
        </a>

        <div className="flex items-center justify-end gap-3">
          {user ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 transition hover:border-brand-dark hover:text-brand-dark"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 transition hover:border-brand-dark hover:text-brand-dark"
              onClick={onOpenAuth}
            >
              Ingresar
            </button>
          )}

          <a
            className="relative inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-dark px-4 font-mono text-xs font-black uppercase tracking-widest text-white no-underline shadow-[0_12px_24px_rgba(47,102,179,.18)]"
            href="/#carrito"
            ref={cartLinkRef}
            onClick={(event) => {
              event.preventDefault();
              onOpenCart();
            }}
          >
            <span>Carrito</span>
            <strong className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-xs text-brand-dark">
              {cartCount}
            </strong>
          </a>
        </div>
      </div>

      <nav className="mx-auto flex min-h-14 w-full max-w-[96rem] flex-wrap items-center justify-center gap-2 border-t border-slate-200 bg-brand-dark px-4 py-3 lg:px-8" aria-label="Navegación principal">
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
          {navigationGroups.map((group) => (
            <li className="group relative" key={group.label}>
              <button
                className="min-h-10 cursor-pointer rounded-xl border-0 bg-transparent px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white transition group-hover:bg-white/15 group-hover:text-white focus-visible:bg-white/15 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                type="button"
                aria-haspopup="true"
              >
                {group.label}
              </button>
              <div
                className="invisible absolute left-0 top-[calc(100%+.45rem)] z-50 grid min-w-56 translate-y-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                role="group"
                aria-label={group.label}
              >
                {group.items.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => searchFromMenu(item)}
                    className="min-h-10 rounded-xl px-3 text-left font-mono text-xs font-bold uppercase tracking-wide text-slate-700 transition hover:bg-brand-dark hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="min-h-10 cursor-pointer rounded-xl border-0 bg-transparent px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white transition hover:bg-white/15 hover:text-white focus-visible:bg-white/15 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              onClick={() => onNavigateToSection("contacto")}
            >
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
