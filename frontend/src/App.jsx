import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { categories, products } from "./data/products";
import { ProductCard } from "./components/ProductCard";
import "./App.css";

const contactItems = [
  { label: "Ventas", value: "contacto@leider.cl" },
  { label: "Soporte", value: "+56 9 90229066" },
  { label: "Horario", value: "Lun–Vie / 09:00–18:00" },
];

function App() {
  const pageRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }),
    [],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todas" || product.category === selectedCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function addToCart(product) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return undefined;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      timeline
        .from(".site-header", { y: -18, autoAlpha: 0 })
        .from(".eyebrow", { y: 14, autoAlpha: 0 }, "-=0.35")
        .from(".hero-copy h1", { y: 24, autoAlpha: 0 }, "-=0.45")
        .from(".hero-copy p", { y: 18, autoAlpha: 0 }, "-=0.45")
        .from(".hero-actions a", { y: 12, autoAlpha: 0, stagger: 0.08 }, "-=0.35")
        .from(".category-strip button", { y: 14, autoAlpha: 0, stagger: 0.06 }, "-=0.3")
        .from(".catalog-tools", { y: 16, autoAlpha: 0 }, "-=0.25")
        .from(".product-card", { y: 22, autoAlpha: 0, stagger: 0.08 }, "-=0.15")
        .from(".cart-summary", { y: 20, autoAlpha: 0 }, "-=0.2")
        .from(".contact-card", { y: 20, autoAlpha: 0, stagger: 0.08 }, "-=0.2");
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="site-shell" ref={pageRef}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LEIDER ecommerce home">
          <span className="brand-mark">L</span>
          <span>LEIDER</span>
        </a>

        <div className="header-actions">
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#catalogo">Catálogo</a>
            <a href="#carrito">Carrito ({cartCount})</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Equipamiento técnico para operación real</span>
          <h1>Catálogo técnico LEIDER.</h1>
          <p>
            Balanzas, sensores, pulseras y accesorios presentados con claridad
            y precisión para tu operación industrial.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#catalogo">Ver productos</a>
            <a className="secondary-action" href="#contacto">Solicitar cotización</a>
          </div>
        </div>
      </section>

      <section className="category-strip" id="categorias" aria-label="Categorías principales">
        {["Todas", ...categories].map((category) => (
          <button
            className={selectedCategory === category ? "is-active" : ""}
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading">
          <span>Catálogo</span>
          <h2>Productos destacados</h2>
        </div>

        <div className="catalog-tools">
          <label htmlFor="product-search">Buscar producto</label>
          <input
            id="product-search"
            type="search"
            placeholder="Ej: balanza, sensor, pulsera..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <span>{filteredProducts.length} resultados</span>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onAddToCart={addToCart}
              currencyFormatter={currencyFormatter}
            />
          ))}
        </div>
      </section>

      <section className="cart-section" id="carrito">
        <div className="section-heading">
          <span>Carrito</span>
          <h2>Selección para cotizar</h2>
        </div>
        <div className="cart-summary">
          {cartItems.length === 0 ? (
            <p>Agrega productos para preparar una solicitud de cotización.</p>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.quantity} × {currencyFormatter.format(item.price)}</span>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)}>Quitar</button>
                  </article>
                ))}
              </div>
              <div className="cart-total">
                <span>Total referencial · CLP</span>
                <strong>{currencyFormatter.format(cartTotal)}</strong>
              </div>
            </>
          )}
        </div>
      </section>

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
            <h3>¿Necesitas una balanza, sensor o sistema específico?</h3>
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

      <footer className="site-footer">
        <p>LEIDER — Equipamiento técnico industrial</p>
        <span>Balanzas, sensores, pulseras y accesorios para tu operación.</span>
      </footer>
    </main>
  );
}

export default App;
