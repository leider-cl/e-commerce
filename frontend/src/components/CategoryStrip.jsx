export function CategoryStrip({ categories, selectedCategory, onSelectCategory }) {
  return (
    <aside className="category-strip" id="categorias" aria-label="Categorías principales">
      <div className="category-strip-title">Productos</div>
      {categories.map((category) => (
        <button
          className={selectedCategory === category ? "is-active" : ""}
          type="button"
          key={category}
          onClick={() => onSelectCategory(category)}
        >
          <span>{category}</span>
          <strong>+</strong>
        </button>
      ))}
    </aside>
  );
}
