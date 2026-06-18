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
    <aside className="h-fit overflow-hidden rounded-2xl border border-white/10 bg-[#0d1728]/82 shadow-[0_24px_80px_rgba(0,0,0,.24)] backdrop-blur-xl lg:sticky lg:top-44" id="categorias" aria-label="Categorías principales">
      <div className="grid gap-1 border-b border-white/10 bg-white/5 px-4 py-4 font-mono text-lg font-black uppercase text-white">
        <span>Productos</span>
        <small className="text-xs font-bold normal-case tracking-normal text-slate-400">Explorar por línea</small>
      </div>

      <div className="grid gap-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              className={`flex w-full items-center justify-between gap-3 border-b border-white/6 px-4 py-3 text-left font-mono text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ${
                isSelected
                  ? "bg-cyan-400 text-slate-950 shadow-inner hover:bg-cyan-300"
                  : "bg-transparent text-slate-200 hover:bg-white/8 hover:text-cyan-200 focus-visible:bg-white/8 focus-visible:text-cyan-200"
              }`}
              type="button"
              key={category}
              onClick={() => onSelectCategory(category)}
            >
              <span>{category}</span>
              {isSelected ? <span className="h-2 w-2 rounded-full bg-slate-950/80" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 border-t border-white/10 p-2">
        {quickCategoryGroups.map((group) => (
          <section className="overflow-hidden rounded-xl border border-white/8" key={group.title}>
            <h3 className="m-0 bg-white/5 px-3 py-3 font-mono text-xs font-black uppercase tracking-widest text-cyan-200">
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
                  className="flex w-full items-center justify-between gap-3 border-b border-white/6 bg-transparent px-4 py-3 text-left font-mono text-sm font-bold text-slate-200 transition hover:bg-white/8 hover:text-cyan-200 focus-visible:bg-white/8 focus-visible:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
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
