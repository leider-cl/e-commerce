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
      <div className="section-heading">
        <span>Catálogo</span>
        <h2>Productos destacados</h2>
      </div>

      <CategoryStrip
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

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
          <div className="loading-state" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
            <p>Cargando productos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
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
    </section>
  );
}
