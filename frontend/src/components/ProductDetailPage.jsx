export function ProductDetailPage({
  product,
  selectedImageIndex,
  currencyFormatter,
  cartQuantityByProductId,
  onBackToCatalog,
  onAddToCart,
  onSelectImageIndex,
  loading = false,
}) {
  function getProductImages(currentProduct) {
    if (!currentProduct) return [];
    const images = currentProduct.image_urls?.length ? currentProduct.image_urls : [currentProduct.image_url];
    return images.filter(Boolean);
  }

  if (loading) {
    return (
      <section className="product-detail-page">
        <div className="product-detail-empty">
          <span className="contact-kicker">Producto</span>
          <h1>Cargando producto</h1>
          <p>Estamos preparando la informaci?n t?cnica.</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-detail-page">
        <button type="button" className="secondary-action product-detail-back" onClick={onBackToCatalog}>
          Volver al cat?logo
        </button>
        <div className="product-detail-empty">
          <span className="contact-kicker">Producto</span>
          <h1>Producto no encontrado</h1>
          <p>El producto solicitado no existe o ya no est? disponible.</p>
        </div>
      </section>
    );
  }

  const images = getProductImages(product);
  const currentImage = images[selectedImageIndex] ?? images[0];
  const reachedCartLimit = (cartQuantityByProductId.get(product.id) ?? 0) >= product.stock;

  return (
    <section className="product-detail-page">
      <button type="button" className="secondary-action product-detail-back" onClick={onBackToCatalog}>
        Volver al cat?logo
      </button>

      <article className="product-detail-layout">
        <div className="product-detail-gallery">
          <img src={currentImage} alt={product.name} draggable="false" />
          {images.length > 1 ? (
            <div className="modal-thumbnails" aria-label="Im?genes del producto">
              {images.map((image, index) => (
                <button
                  className={index === selectedImageIndex ? "is-active" : ""}
                  type="button"
                  key={image}
                  onClick={() => onSelectImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={image} alt="" draggable="false" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-detail-content">
          <span className="contact-kicker">{product.tag}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <dl className="product-specs">
            <div>
              <dt>Categor?a</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Stock</dt>
              <dd>{product.stock} disponibles</dd>
            </div>
            <div>
              <dt>Precio</dt>
              <dd>{currencyFormatter.format(product.price)} CLP</dd>
            </div>
          </dl>

          <button
            type="button"
            className="primary-action modal-cart-action"
            disabled={reachedCartLimit}
            onClick={() =>
              onAddToCart(product, {
                imageUrl: currentImage,
                sourceElement: document.querySelector(".product-detail-gallery img"),
              })
            }
          >
            {reachedCartLimit ? "Stock m?ximo en carrito" : "Agregar al carrito"}
          </button>
        </div>
      </article>
    </section>
  );
}
