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
  return (
    <section className="catalog-section" id="catalogo">
      <div className="marketplace-layout">
        <CategoryStrip
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onSearchChange={onSearchChange}
        />

        <div className="marketplace-content">
          <div className="catalog-showcase" aria-label="Resumen de tienda LEIDER">
            <div>
              <span>LEIDER Shop</span>
              <h1>Equipamiento IoT industrial para terreno.</h1>
              <p>Controladores, sensores e interfaces para proyectos de telemetr?a, automatizaci?n y monitoreo.</p>
            </div>
            <div className="showcase-metrics" aria-label="Capacidades destacadas">
              <span>LoRaWAN</span>
              <span>RS485</span>
              <span>SDI-12</span>
              <span>4-20mA</span>
            </div>
          </div>

          <div className="brand-strip" aria-label="Marcas destacadas">
            <span>Milesight</span>
            <span>LoRaWAN</span>
            <span>IoT</span>
            <span>RS485</span>
            <span>4-20mA</span>
          </div>

          <div className="section-heading catalog-heading">
            <span>Cat?logo</span>
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
            <label className="sr-only" htmlFor="category-filter">Filtrar por categor?a</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(event) => onSelectCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
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
