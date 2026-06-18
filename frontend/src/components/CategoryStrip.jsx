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
    <aside className="category-strip" id="categorias" aria-label="Categorías principales">
      <div className="category-strip-title">
        <span>Productos</span>
        <small>Explorar por línea</small>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <button
            className={selectedCategory === category ? "is-active" : ""}
            type="button"
            key={category}
            onClick={() => onSelectCategory(category)}
          >
            <span>{category}</span>
          </button>
        ))}
      </div>

      <div className="category-quick-groups">
        {quickCategoryGroups.map((group) => (
          <section className="category-quick-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="category-quick-links">
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    onSelectCategory("Todas");
                    onSearchChange(item);
                  }}
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
