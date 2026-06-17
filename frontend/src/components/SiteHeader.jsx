import { useAuth } from "../context/useAuth";

export function SiteHeader({ cartCount, cartLinkRef, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="LEIDER ecommerce home">
        <span className="brand-mark">L</span>
        <span>LEIDER</span>
      </a>

      <div className="header-actions">
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#catalogo">Catálogo</a>
          <a href="#carrito" ref={cartLinkRef}>Carrito ({cartCount})</a>
          <a href="#contacto">Contacto</a>
          {user ? (
            <span className="nav-user">
              {user.name}
              <button type="button" onClick={logout} className="nav-logout">
                Salir
              </button>
            </span>
          ) : (
            <button type="button" onClick={onOpenAuth} className="nav-auth-trigger">
              Ingresar
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
