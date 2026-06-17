export function CategoryStrip({ categories, selectedCategory, onSelectCategory }) {
  return (
    <section className="category-strip" id="categorias" aria-label="Categorías principales">
      {categories.map((category) => (
        <button
          className={selectedCategory === category ? "is-active" : ""}
          type="button"
          key={category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </section>
  );
}
