export function ProductCard({
  product,
  onAddToCart,
  currencyFormatter,
}) {
  return (
    <article className="product-card">
      <div className="product-visual" aria-hidden="true">
        <span>{product.category.slice(0, 2).toUpperCase()}</span>
      </div>
      <div className="product-content">
        <div className="product-meta">
          <span>{product.tag}</span>
          <span>{product.stock} disponibles</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <div className="price-stack">
            <strong>{currencyFormatter.format(product.price)}</strong>
            <span>CLP</span>
          </div>
          <button type="button" onClick={() => onAddToCart(product)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
