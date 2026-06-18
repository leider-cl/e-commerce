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
    <section className="pb-12" id="catalogo">
      <div className="grid gap-6 pt-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <CategoryStrip
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          onSearchChange={onSearchChange}
        />

        <div className="min-w-0">
          <div className="mb-5 mt-7 flex flex-col gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">Catálogo</span>
            <h2 className="m-0 max-w-full text-[clamp(2rem,5vw,3.25rem)] font-black leading-none tracking-[-0.04em] text-white break-words">Productos destacados</h2>
          </div>

          <div className="mb-5 grid grid-cols-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1728]/70 p-4 shadow-[0_24px_80px_rgba(0,0,0,.20)] backdrop-blur-xl sm:grid-cols-[auto_minmax(14rem,1fr)_minmax(11rem,auto)_auto]">
            <label htmlFor="product-search" className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">Buscar producto</label>
            <input
              id="product-search"
              type="search"
              placeholder="Ej: balanza, sensor, pulsera..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-white/10 bg-white/8 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/12 focus:shadow-[0_0_0_4px_rgba(34,211,238,.10)]"
            />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-300">{filteredProducts.length} resultados</span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),19rem))] justify-start gap-6">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-6 text-slate-100 shadow-[0_18px_45px_rgba(0,0,0,.18)]">
                <p className="m-0 font-mono text-sm font-bold uppercase tracking-widest text-cyan-100">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-6 text-slate-100 shadow-[0_18px_45px_rgba(0,0,0,.18)]">
                <p className="m-0 font-mono text-sm font-bold uppercase tracking-widest text-cyan-100">No se encontraron productos.</p>
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
