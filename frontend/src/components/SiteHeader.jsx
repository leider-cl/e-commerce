import { useAuth } from "../context/useAuth";

export function SiteHeader({ cartCount, cartLinkRef, onOpenAuth, onNavigateHome, onNavigateToSection }) {
  const { user, logout } = useAuth();

  return (
    <header className="site-header sticky top-0 z-10 flex items-center justify-between gap-4 min-h-18 px-0 py-3 bg-paper/88 backdrop-blur-md border-b border-line">
      <a
        className="brand inline-flex items-center gap-[0.7rem] min-h-11 font-mono font-bold tracking-[0.16em] no-underline"
        href="/"
        aria-label="Ir al inicio de LEIDER ecommerce"
        onClick={(event) => {
          event.preventDefault();
          onNavigateHome();
        }}
      >
        <span className="grid place-items-center w-9 h-9 text-inverse-text bg-inverse">L</span>
        <span>LEIDER</span>
      </a>

      <div className="flex items-center gap-3 ml-auto">
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs font-bold tracking-widest uppercase" aria-label="Main navigation">
          <a className="min-h-11 inline-flex items-center no-underline" href="#catalogo">Catálogo</a>
          <a className="min-h-11 inline-flex items-center no-underline" href="#carrito" ref={cartLinkRef}>Carrito ({cartCount})</a>
          <a className="min-h-11 inline-flex items-center no-underline" href="#contacto">Contacto</a>
          {user ? (
            <span className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wide uppercase">
              {user.name}
              <button type="button" onClick={logout} className="bg-none border border-ink text-ink font-mono text-xs font-bold tracking-widest uppercase cursor-pointer min-h-9 px-3 transition-[background_color] duration-120 ease-in-out hover:bg-inverse hover:text-inverse-text">
                Salir
              </button>
            </span>
          ) : (
            <button type="button" onClick={onOpenAuth} className="bg-none border border-ink text-ink font-mono text-xs font-bold tracking-widest uppercase cursor-pointer min-h-9 px-3 transition-[background_color] duration-120 ease-in-out hover:bg-inverse hover:text-inverse-text">
              Ingresar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
