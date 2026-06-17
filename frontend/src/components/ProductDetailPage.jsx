export function ProductDetailPage({
  product,
  selectedImageIndex,
  currencyFormatter,
  cartQuantityByProductId,
  onBackToCatalog,
  onAddToCart,
  onSelectImageIndex,
  relatedProducts = [],
  onViewProduct,
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
          <p>Estamos preparando la información técnica.</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-detail-page">
        <button type="button" className="secondary-action product-detail-back" onClick={onBackToCatalog}>
          Volver al catálogo
        </button>
        <div className="product-detail-empty">
          <span className="contact-kicker">Producto</span>
          <h1>Producto no encontrado</h1>
          <p>El producto solicitado no existe o ya no está disponible.</p>
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
        Volver al catálogo
      </button>

      <article className="product-detail-layout">
        <div className="product-detail-gallery">
          <img src={currentImage} alt={product.name} draggable="false" />
          {images.length > 1 ? (
            <div className="modal-thumbnails" aria-label="Imágenes del producto">
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
              <dt>Categoría</dt>
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
            {reachedCartLimit ? "Stock máximo en carrito" : "Agregar al carrito"}
          </button>
        </div>
      </article>

      {relatedProducts.length > 0 ? (
        <section className="related-products-section" aria-labelledby="related-products-title">
          <div className="section-heading compact-heading">
            <span>Tambi?n podr?a interesarte</span>
            <h2 id="related-products-title">Productos similares</h2>
          </div>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => {
              const relatedImage = relatedProduct.image_urls?.[0] ?? relatedProduct.image_url;
              return (
                <article className="related-product-card" key={relatedProduct.id}>
                  <img src={relatedImage} alt={relatedProduct.name} loading="lazy" />
                  <div>
                    <span>{relatedProduct.tag}</span>
                    <h3>{relatedProduct.name}</h3>
                    <p>{currencyFormatter.format(relatedProduct.price)} CLP</p>
                    <button type="button" className="secondary-action" onClick={() => onViewProduct(relatedProduct)}>
                      Ver producto
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </section>
  );
}
