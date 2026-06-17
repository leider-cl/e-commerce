export function SiteHeader({ cartCount, cartLinkRef }) {
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
        </nav>
      </div>
    </header>
  );
}
