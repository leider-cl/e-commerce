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
}) {
  const { user, logout } = useAuth();

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
          <span className="brand-store">Shop</span>
        </a>

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
        <ul className="nav-list">
          {navigationGroups.map((group) => (
            <li className="nav-dropdown" key={group.label}>
              <button className="nav-trigger" type="button" aria-haspopup="true">
                {group.label}
              </button>
              <div className="nav-dropdown-panel" role="group" aria-label={group.label}>
                {group.items.map((item) => (
                  <button type="button" key={item} onClick={() => searchFromMenu(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </li>
          ))}
          <li>
            <button type="button" className="nav-direct" onClick={() => onNavigateToSection("contacto")}>
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
