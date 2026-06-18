const quickCategoryGroups = [
  {
    title: "Conectividad",
    items: ["LoRaWAN", "RS485", "Gateway"],
  },
  {
    title: "Señales industriales",
    items: ["4-20mA", "SDI-12", "Sensores"],
  },
];

export function CategoryStrip({ categories, selectedCategory, onSelectCategory, onSearchChange }) {
  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,.08)] lg:sticky lg:top-44" id="categorias" aria-label="Categorías principales">
      <div className="grid gap-1 border-b border-slate-200 bg-slate-50 px-4 py-4 font-mono text-lg font-black uppercase text-slate-900">
        <span>Productos</span>
        <small className="text-xs font-bold normal-case tracking-normal text-slate-500">Explorar por línea</small>
      </div>

      <div className="grid gap-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              className={`flex w-full items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 text-left font-mono text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40 ${
                isSelected
                  ? "bg-brand-dark text-white shadow-inner hover:bg-brand-darker"
                  : "bg-transparent text-slate-700 hover:bg-blue-50 hover:text-brand-dark focus-visible:bg-blue-50 focus-visible:text-brand-dark"
              }`}
              type="button"
              key={category}
              onClick={() => onSelectCategory(category)}
            >
              <span>{category}</span>
              {isSelected ? <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 border-t border-slate-200 p-2">
        {quickCategoryGroups.map((group) => (
          <section className="overflow-hidden rounded-xl border border-slate-200" key={group.title}>
            <h3 className="m-0 bg-blue-50 px-3 py-3 font-mono text-xs font-black uppercase tracking-widest text-brand-dark">
              {group.title}
            </h3>
            <div className="overflow-hidden">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    onSelectCategory("Todas");
                    onSearchChange(item);
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b border-slate-200 bg-transparent px-4 py-3 text-left font-mono text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-brand-dark focus-visible:bg-blue-50 focus-visible:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
