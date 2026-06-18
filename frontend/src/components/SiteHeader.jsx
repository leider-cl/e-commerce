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
    <header className="sticky top-0 z-50 -mx-3 border-b border-white/10 bg-[#081120]/92 shadow-[0_18px_60px_rgba(0,0,0,.35)] backdrop-blur-xl sm:-mx-4 lg:-mx-5">
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
          <span className="font-mono text-5xl font-black leading-none tracking-[0.08em] text-white drop-shadow-[0_0_18px_rgba(34,211,238,.18)]">
            LEIDER
          </span>
          <span className="self-end font-mono text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
            Shop
          </span>
        </a>

        <div className="flex items-center justify-end gap-3">
          {user ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span>{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="min-h-11 rounded-xl border border-white/15 bg-white/8 px-3 font-mono text-xs font-black uppercase tracking-widest text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="min-h-11 rounded-xl border border-white/15 bg-white/8 px-3 font-mono text-xs font-black uppercase tracking-widest text-white transition hover:border-cyan-300 hover:text-cyan-200"
              onClick={onOpenAuth}
            >
              Ingresar
            </button>
          )}

          <a
            className="relative inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-400 px-4 font-mono text-xs font-black uppercase tracking-widest text-slate-950 no-underline shadow-[0_18px_34px_rgba(34,211,238,.18)]"
            href="/#carrito"
            ref={cartLinkRef}
            onClick={(event) => {
              event.preventDefault();
              onOpenCart();
            }}
          >
            <span>Carrito</span>
            <strong className="grid h-6 min-w-6 place-items-center rounded-full bg-slate-950 px-1 text-xs text-white">
              {cartCount}
            </strong>
          </a>
        </div>
      </div>

      <nav className="mx-auto flex min-h-14 w-full max-w-[96rem] flex-wrap items-center justify-center gap-2 border-t border-white/10 px-4 py-3 lg:px-8" aria-label="Navegación principal">
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
          {navigationGroups.map((group) => (
            <li className="group relative" key={group.label}>
              <button
                className="min-h-10 cursor-pointer rounded-xl border-0 bg-transparent px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white/82 transition group-hover:bg-white/10 group-hover:text-cyan-200 focus-visible:bg-white/10 focus-visible:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                type="button"
                aria-haspopup="true"
              >
                {group.label}
              </button>
              <div
                className="invisible absolute left-0 top-[calc(100%+.45rem)] z-50 grid min-w-56 translate-y-2 gap-1 rounded-2xl border border-white/10 bg-[#0d1728]/98 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                role="group"
                aria-label={group.label}
              >
                {group.items.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => searchFromMenu(item)}
                    className="min-h-10 rounded-xl px-3 text-left font-mono text-xs font-bold uppercase tracking-wide text-slate-200 transition hover:bg-cyan-400 hover:text-slate-950"
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
              className="min-h-10 cursor-pointer rounded-xl border-0 bg-transparent px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white/82 transition hover:bg-white/10 hover:text-cyan-200 focus-visible:bg-white/10 focus-visible:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
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
