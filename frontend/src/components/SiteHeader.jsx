import { useAuth } from "../context/useAuth";

export function SiteHeader({
  cartCount,
  cartLinkRef,
  onOpenAuth,
  onNavigateHome,
  onNavigateToSection,
  searchTerm,
  onSearchChange,
}) {
  const { user, logout } = useAuth();

  function submitSearch(event) {
    event.preventDefault();
    onNavigateToSection("catalogo");
  }

  return (
    <header className="site-header">
      <div className="header-mainbar">
        <a
          className="brand"
          href="/"
          aria-label="Ir al inicio de LEIDER Shop"
          onClick={(event) => {
            event.preventDefault();
            onNavigateHome();
          }}
        >
          <span className="brand-name">LEIDER</span>
          <span className="brand-store">SHOP</span>
        </a>

        <form className="header-search" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="global-product-search">Buscar productos</label>
          <input
            id="global-product-search"
            type="search"
            placeholder="Ej: LoRaWAN, sensores, gateway"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <button type="submit" aria-label="Buscar productos">Buscar</button>
        </form>

        <div className="header-actions">
          {user ? (
            <div className="header-user">
              <span>{user.name}</span>
              <button type="button" onClick={logout}>Salir</button>
            </div>
          ) : (
            <button type="button" className="header-account" onClick={onOpenAuth}>
              Ingresar
            </button>
          )}

          <a
            className="header-cart"
            href="/#carrito"
            ref={cartLinkRef}
            onClick={(event) => {
              event.preventDefault();
              onNavigateToSection("carrito");
            }}
          >
            <span>Carrito</span>
            <strong>{cartCount}</strong>
          </a>
        </div>
      </div>

      <nav className="header-nav" aria-label="Navegación principal">
        <button type="button" onClick={() => onNavigateToSection("catalogo")}>IoT Industrial</button>
        <button type="button" onClick={() => onNavigateToSection("catalogo")}>LoRaWAN</button>
        <button type="button" onClick={() => onNavigateToSection("catalogo")}>Sensores</button>
        <button type="button" onClick={() => onNavigateToSection("catalogo")}>Controladores</button>
        <button type="button" onClick={() => onNavigateToSection("contacto")}>Proyectos</button>
      </nav>
    </header>
  );
}
