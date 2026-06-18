const filterGroups = [
  {
    title: "Conectividad",
    items: ["LoRaWAN", "RS485", "Gateway"],
  },
  {
    title: "SeÃ±ales industriales",
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
}) {
  const activeSearch = searchTerm.trim().toLowerCase();

  function handleCategorySelect(category) {
    onSearchChange("");
    onSelectCategory(category);
  }

  function handleFilterSelect(item) {
    onSelectCategory("Todas");
    onSearchChange(item);
  }

  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.08)] lg:sticky lg:top-44" id="categorias" aria-label="Filtros de catÃ¡logo">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="m-0 text-xl font-black tracking-[-0.02em] text-slate-950">CategorÃ­as</h2>
        <p className="m-0 mt-2 text-sm leading-6 text-slate-500">
          Todos los productos Â· <strong className="font-semibold text-slate-700">{products.length}</strong> items
        </p>
      </div>

      <section className="border-b border-slate-200 px-5 py-5" aria-labelledby="category-filter-title">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 id="category-filter-title" className="m-0 text-base font-black text-slate-900">CategorÃ­as</h3>
          <span className="h-px w-4 bg-slate-300" aria-hidden="true" />
        </div>

        <div className="grid gap-2">
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
      </section>

      <div className="max-h-96 overflow-y-auto">
        {filterGroups.map((group) => (
          <section className="border-b border-slate-200 px-5 py-5 last:border-b-0" key={group.title}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="m-0 font-mono text-xs font-black uppercase tracking-widest text-slate-500">{group.title}</h3>
              <span className="h-px w-4 bg-slate-300" aria-hidden="true" />
            </div>

            <div className="grid gap-3">
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
          </section>
        ))}
      </div>
    </aside>
  );
}
