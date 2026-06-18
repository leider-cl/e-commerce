import { useState } from "react";

const filterGroups = [
  {
    title: "Conectividad",
    items: ["LoRaWAN", "RS485", "Gateway"],
  },
  {
    title: "Señales industriales",
    items: ["4-20mA", "SDI-12", "Sensores"],
  },
];

function getCategoryCount(category, products) {
  if (category === "Todas") return products.length;
  return products.filter((product) => product.category === category).length;
}

function getSearchCount(term, products) {
  const normalizedTerm = term.toLowerCase();
  return products.filter((product) => {
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return haystack.includes(normalizedTerm);
  }).length;
}

export function CategoryStrip({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearchChange,
  products = [],
  searchTerm = "",
  priceBounds = { min: 0, max: 0 },
  selectedMaxPrice = 0,
  onMaxPriceChange,
  currencyFormatter,
}) {
  const activeSearch = searchTerm.trim().toLowerCase();
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState(() => new Set(filterGroups.map((group) => group.title)));
  const hasPrices = priceBounds.max > 0;
  const safeSelectedMaxPrice = hasPrices ? selectedMaxPrice : 0;

  function handleCategorySelect(category) {
    onSearchChange("");
    onSelectCategory(category);
  }

  function handleFilterSelect(item) {
    onSelectCategory("Todas");
    onSearchChange(item);
  }

  function toggleGroup(groupTitle) {
    setOpenGroups((currentGroups) => {
      const nextGroups = new Set(currentGroups);
      if (nextGroups.has(groupTitle)) {
        nextGroups.delete(groupTitle);
      } else {
        nextGroups.add(groupTitle);
      }
      return nextGroups;
    });
  }

  function handlePriceChange(event) {
    onMaxPriceChange(Number(event.target.value));
  }

  function resetPriceFilter() {
    onMaxPriceChange(priceBounds.max);
  }

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.08)] lg:sticky lg:top-44" id="categorias" aria-label="Filtros de catálogo">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="m-0 text-xl font-black tracking-[-0.02em] text-slate-950">Categorías</h2>
        <p className="m-0 mt-2 text-sm leading-6 text-slate-500">
          Todos los productos · <strong className="font-semibold text-slate-700">{products.length}</strong> items
        </p>
      </div>

      <section className="border-b border-slate-200 px-5 py-5" aria-labelledby="category-filter-title">
        <button
          type="button"
          className="mb-4 flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left"
          onClick={() => setCategoriesOpen((isOpen) => !isOpen)}
          aria-expanded={categoriesOpen}
          aria-controls="category-filter-list"
        >
          <h3 id="category-filter-title" className="m-0 text-base font-black text-slate-900">Categorías</h3>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white font-mono text-lg leading-none text-slate-500 transition hover:border-brand-dark hover:text-brand-dark" aria-hidden="true">
            {categoriesOpen ? "−" : "+"}
          </span>
        </button>

        {categoriesOpen ? (
          <div className="grid gap-2" id="category-filter-list">
            {categories.map((category) => {
              const isSelected = selectedCategory === category && activeSearch.length === 0;
              const count = getCategoryCount(category, products);

              return (
                <button
                  className="group grid min-h-8 w-full cursor-pointer grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-3 border-0 bg-transparent p-0 text-left text-sm leading-6 text-slate-700 transition hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/30"
                  type="button"
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  aria-pressed={isSelected}
                >
                  <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full border transition ${isSelected ? "border-brand-dark bg-brand-dark/10" : "border-slate-300 bg-white group-hover:border-brand-dark"}`} aria-hidden="true">
                    {isSelected ? <span className="h-2 w-2 rounded-full bg-brand-dark" /> : null}
                  </span>
                  <span className={`min-w-0 wrap-break-word ${isSelected ? "font-black text-brand-dark" : "font-semibold"}`}>{category}</span>
                  <span className="pl-2 text-xs font-semibold text-slate-400">({count})</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      <div className="max-h-96 overflow-y-auto">
        {filterGroups.map((group) => {
          const isGroupOpen = openGroups.has(group.title);

          return (
            <section className="border-b border-slate-200 px-5 py-5 last:border-b-0" key={group.title}>
              <button
                type="button"
                className="mb-4 flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left"
                onClick={() => toggleGroup(group.title)}
                aria-expanded={isGroupOpen}
                aria-controls={`filter-group-${group.title.toLowerCase().replaceAll(" ", "-")}`}
              >
                <h3 className="m-0 font-mono text-xs font-black uppercase tracking-widest text-slate-500">{group.title}</h3>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white font-mono text-lg leading-none text-slate-500 transition hover:border-brand-dark hover:text-brand-dark" aria-hidden="true">
                  {isGroupOpen ? "−" : "+"}
                </span>
              </button>

              {isGroupOpen ? (
                <div className="grid gap-3" id={`filter-group-${group.title.toLowerCase().replaceAll(" ", "-")}`}>
                  {group.items.map((item) => {
                    const isActive = activeSearch === item.toLowerCase();
                    const count = getSearchCount(item, products);

                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => handleFilterSelect(item)}
                        className="group grid min-h-7 w-full cursor-pointer grid-cols-[1rem_minmax(0,1fr)_auto] items-start gap-3 border-0 bg-transparent p-0 text-left text-sm leading-6 text-slate-700 transition hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/30"
                        aria-pressed={isActive}
                      >
                        <span className={`mt-1 grid h-4 w-4 place-items-center rounded border shadow-sm transition ${isActive ? "border-brand-dark bg-brand-dark" : "border-slate-300 bg-slate-50 group-hover:border-brand-dark"}`} aria-hidden="true">
                          {isActive ? <span className="h-1.5 w-1.5 rounded-sm bg-white" /> : null}
                        </span>
                        <span className={`min-w-0 wrap-break-word ${isActive ? "font-black text-brand-dark" : "font-semibold"}`}>{item}</span>
                        <span className="pl-2 text-xs font-semibold text-slate-400">({count})</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <section className="border-t border-slate-200 px-5 py-5" aria-labelledby="price-filter-title">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 id="price-filter-title" className="m-0 font-mono text-xs font-black uppercase tracking-widest text-slate-500">Precio</h3>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-bold text-brand-dark underline-offset-4 hover:underline"
            onClick={resetPriceFilter}
            disabled={!hasPrices}
          >
            Limpiar
          </button>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>{currencyFormatter.format(priceBounds.min)}</span>
            <span>{currencyFormatter.format(safeSelectedMaxPrice)}</span>
          </div>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step="1000"
            value={safeSelectedMaxPrice}
            onChange={handlePriceChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Filtrar por precio máximo"
            disabled={!hasPrices}
          />
          <p className="m-0 text-xs leading-5 text-slate-500">
            Mostrando productos hasta <strong className="text-slate-700">{currencyFormatter.format(safeSelectedMaxPrice)}</strong>.
          </p>
        </div>
      </section>
    </aside>
  );
}
