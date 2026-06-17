export function ProductModal({
  product,
  selectedImageIndex,
  currencyFormatter,
  cartQuantityByProductId,
  onClose,
  onAddToCart,
  onSelectImageIndex,
}) {
  function getProductImages(product) {
    if (!product) return [];
    const images = product.image_urls?.length ? product.image_urls : [product.image_url];
    return images.filter(Boolean);
  }

  const images = getProductImages(product);
  const currentImage = images[selectedImageIndex];
  const reachedCartLimit = (cartQuantityByProductId.get(product.id) ?? 0) >= product.stock;

  return (
    <div className="product-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar detalle">
          Cerrar
        </button>

        <div className="modal-gallery">
          <img
            src={currentImage}
            alt={product.name}
            draggable="false"
          />
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

        <div className="modal-content">
          <span className="contact-kicker">{product.tag}</span>
          <h2 id="product-modal-title">{product.name}</h2>
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
                sourceElement: document.querySelector(".product-modal .modal-gallery img"),
              })
            }
          >
            {reachedCartLimit
              ? "Stock máximo en carrito"
              : "Agregar al carrito"}
          </button>
        </div>
      </section>
    </div>
  );
}
