import { CategoryStrip } from "./CategoryStrip";
import { ProductCard } from "./ProductCard";

export function CatalogSection({
  loading,
  categories,
  selectedCategory,
  onSelectCategory,
  filteredProducts,
  searchTerm,
  onSearchChange,
  currencyFormatter,
  cartQuantityByProductId,
  onAddToCart,
  onViewDetails,
}) {
  const featuredProduct = filteredProducts[0];
  const featuredImage = featuredProduct?.image_urls?.[0] ?? featuredProduct?.image_url;

  return (
    <section className="catalog-section" id="catalogo">
      <div className="marketplace-layout">
        <CategoryStrip
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />

        <div className="marketplace-content">
          <section className="store-hero">
            <div className="store-hero-copy">
              <span>Soluciones técnicas LEIDER</span>
              <h1>IoT, sensores y control industrial para operación real.</h1>
              <p>
                Equipamiento seleccionado para integración en terreno: controladores, comunicación LoRaWAN,
                sensores y componentes para proyectos industriales.
              </p>
              <div className="store-hero-actions">
                <button type="button" className="primary-action" onClick={() => document.getElementById("product-search")?.focus()}>
                  Buscar producto
                </button>
                {featuredProduct ? (
                  <button type="button" className="secondary-action" onClick={() => onViewDetails(featuredProduct)}>
                    Ver destacado
                  </button>
                ) : null}
              </div>
            </div>
            {featuredProduct ? (
              <div className="store-hero-product">
                <img src={featuredImage} alt={featuredProduct.name} />
                <span>{featuredProduct.tag}</span>
              </div>
            ) : null}
          </section>

          <div className="brand-strip" aria-label="Marcas destacadas">
            <span>Milesight</span>
            <span>LoRaWAN</span>
            <span>IoT</span>
            <span>RS485</span>
            <span>4-20mA</span>
          </div>

          <div className="section-heading catalog-heading">
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
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <span>{filteredProducts.length} resultados</span>
          </div>

          <div className="product-grid">
            {loading ? (
              <div className="loading-state">
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <p>No se encontraron productos.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  currencyFormatter={currencyFormatter}
                  cartQuantity={cartQuantityByProductId.get(product.id) ?? 0}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
