import { CategoryStrip } from "./CategoryStrip";
import { ProductCard } from "./ProductCard";
import { useEffect, useRef, useState } from "react";

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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Marcas destacadas">
            <span className="grid min-h-20 place-items-center rounded-2xl border border-white/10 bg-white/8 px-4 text-center font-mono text-sm font-black uppercase tracking-wide text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,.14)]">Milesight</span>
            <span className="grid min-h-20 place-items-center rounded-2xl border border-white/10 bg-white/8 px-4 text-center font-mono text-sm font-black uppercase tracking-wide text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,.14)]">LoRaWAN</span>
            <span className="grid min-h-20 place-items-center rounded-2xl border border-white/10 bg-white/8 px-4 text-center font-mono text-sm font-black uppercase tracking-wide text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,.14)]">IoT</span>
            <span className="grid min-h-20 place-items-center rounded-2xl border border-white/10 bg-white/8 px-4 text-center font-mono text-sm font-black uppercase tracking-wide text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,.14)]">RS485</span>
            <span className="grid min-h-20 place-items-center rounded-2xl border border-white/10 bg-white/8 px-4 text-center font-mono text-sm font-black uppercase tracking-wide text-slate-200 shadow-[0_18px_45px_rgba(0,0,0,.14)]">4-20mA</span>
          </div>

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
            <div className="relative" ref={categoryMenuRef}>
              <label
                className="sr-only absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
                style={{ clip: "rect(0 0 0 0)" }}
                id="category-filter-label"
              >
                Filtrar por categoría
              </label>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isCategoryMenuOpen}
                aria-labelledby="category-filter-label category-filter-button"
                id="category-filter-button"
                onClick={() => setIsCategoryMenuOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setIsCategoryMenuOpen(false);
                }}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#182337] px-4 text-left text-sm text-white shadow-inner shadow-white/5 outline-none transition hover:border-cyan-300/70 hover:bg-[#1d2a40] focus:border-cyan-300 focus:shadow-[0_0_0_4px_rgba(34,211,238,.10)]"
              >
                <span className="truncate">{selectedCategory}</span>
                <span
                  aria-hidden="true"
                  className={`grid size-5 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-cyan-300 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
                >
                  <svg viewBox="0 0 20 20" className="size-3" fill="currentColor">
                    <path d="M5.5 7.5 10 12l4.5-4.5h-9Z" />
                  </svg>
                </span>
              </button>

              {isCategoryMenuOpen ? (
                <div
                  role="listbox"
                  aria-labelledby="category-filter-label"
                  className="absolute right-0 z-30 mt-2 w-full min-w-48 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#111c2e] p-1.5 shadow-[0_22px_60px_rgba(0,0,0,.42)] ring-1 ring-white/8"
                >
                  {categories.map((category) => {
                    const isSelected = category === selectedCategory;

                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        value={category}
                        key={category}
                        onClick={() => {
                          onSelectCategory(category);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition ${
                          isSelected
                            ? "bg-cyan-300 text-[#06111f] font-bold"
                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{category}</span>
                        {isSelected ? <span className="text-xs">•</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
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
