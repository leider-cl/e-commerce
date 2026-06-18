const quickCategoryGroups = [
  {
    title: "Conectividad",
    items: ["LoRaWAN", "RS485", "Gateway"],
  },
  {
    title: "Se?ales industriales",
    items: ["4-20mA", "SDI-12", "Sensores"],
  },
];

export function CategoryStrip({ categories, selectedCategory, onSelectCategory, onSearchChange }) {
  return (
    <aside className="category-strip" id="categorias" aria-label="Categor?as principales">
      <div className="category-strip-title">
        <span>Productos</span>
        <small>Explorar por l?nea</small>
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
            <strong>{selectedCategory === category ? "?" : "+"}</strong>
          </button>
        ))}
      </div>

      <div className="category-accordions">
        {quickCategoryGroups.map((group) => (
          <details key={group.title}>
            <summary>{group.title}</summary>
            <div>
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
          </details>
        ))}
      </div>
    </aside>
  );
}
