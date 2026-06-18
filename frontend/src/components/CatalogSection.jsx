import { CategoryStrip } from "./CategoryStrip";
import { ProductCard } from "./ProductCard";

export function CatalogSection({
  loading,
  categories,
  selectedCategory,
  onSelectCategory,
  products,
  priceBounds,
  selectedPriceRange,
  onPriceRangeChange,
  filteredProducts,
  searchTerm,
  onSearchChange,
  currencyFormatter,
  cartQuantityByProductId,
  onAddToCart,
  onViewDetails,
}) {
  return (
    <section className="pb-12" id="catalogo">
      <div className="grid gap-6 pt-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <CategoryStrip
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onSearchChange={onSearchChange}
          products={products}
          searchTerm={searchTerm}
          priceBounds={priceBounds}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={onPriceRangeChange}
          currencyFormatter={currencyFormatter}
        />

        <div className="min-w-0">
          <div className="mb-5 mt-7 flex flex-col gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Catálogo</span>
            <h2 className="m-0 max-w-full text-[clamp(2rem,5vw,3.25rem)] font-black leading-none tracking-[-0.04em] text-slate-900 wrap-break-word">Productos destacados</h2>
          </div>

          <div className="mb-5 grid grid-cols-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,.07)] sm:grid-cols-[auto_minmax(14rem,1fr)_minmax(11rem,auto)_auto]">
            <label htmlFor="product-search" className="font-mono text-xs font-black uppercase tracking-widest text-slate-600">Buscar producto</label>
            <input
              id="product-search"
              type="search"
              placeholder="Ej: balanza, sensor, pulsera..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-dark focus:shadow-[0_0_0_4px_rgba(47,102,179,.12)]"
            />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-600">{filteredProducts.length} resultados</span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),19rem))] justify-start gap-6">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-blue-200 bg-blue-50 p-6 text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,.06)]">
                <p className="m-0 font-mono text-sm font-bold uppercase tracking-widest text-brand-dark">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-blue-200 bg-blue-50 p-6 text-slate-800 shadow-[0_10px_28px_rgba(15,23,42,.06)]">
                <p className="m-0 font-mono text-sm font-bold uppercase tracking-widest text-brand-dark">No se encontraron productos.</p>
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
