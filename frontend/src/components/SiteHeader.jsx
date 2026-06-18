import { useAuth } from "../context/useAuth";

const navigationGroups = [
  {
    label: "IoT Industrial",
    items: ["Controladores IoT", "Sensores", "Telemetr?a", "Monitoreo remoto"],
  },
  {
    label: "LoRaWAN",
    items: ["Gateways", "Nodos", "Antenas", "Redes privadas"],
  },
  {
    label: "Instrumentaci?n",
    items: ["RS485", "SDI-12", "4-20mA", "Energ?a solar"],
  },
  {
    label: "Proyectos",
    items: ["Integraci?n", "Soporte t?cnico", "Cotizaciones"],
  },
];

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

  function searchFromMenu(term) {
    onSearchChange(term);
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
          <span className="brand-mark">LEIDER</span>
          <span className="brand-store">Industrial Shop</span>
        </a>

        <form className="header-search" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="global-product-search">Buscar productos</label>
          <span className="search-context">Cat?logo</span>
          <input
            id="global-product-search"
            type="search"
            placeholder="Buscar LoRaWAN, sensores, gateway..."
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

      <nav className="header-nav" aria-label="Navegaci?n principal">
        {navigationGroups.map((group) => (
          <details className="nav-dropdown" key={group.label}>
            <summary>{group.label}</summary>
            <div className="nav-dropdown-panel">
              {group.items.map((item) => (
                <button type="button" key={item} onClick={() => searchFromMenu(item)}>
                  {item}
                </button>
              ))}
            </div>
          </details>
        ))}
        <button type="button" className="nav-direct" onClick={() => onNavigateToSection("contacto")}>Contacto</button>
      </nav>
    </header>
  );
}
