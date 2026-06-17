import { useMemo, useState } from "react";

export function ProductCard({ product, onAddToCart, onViewDetails, currencyFormatter, cartQuantity = 0 }) {
  const images = useMemo(() => {
    const productImages = product.image_urls?.length ? product.image_urls : [product.image_url];
    return productImages.filter(Boolean);
  }, [product.image_url, product.image_urls]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  }

  function handleDragEnd(clientX) {
    if (dragStartX === null || images.length < 2) return;

    const deltaX = clientX - dragStartX;

    if (Math.abs(deltaX) > 32) {
      if (deltaX < 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    setDragStartX(null);
  }

  const activeImage = images[activeImageIndex];
  const reachedStockLimit = cartQuantity >= product.stock;

  return (
    <article className="product-card">
      <div
        className="product-visual"
        onMouseDown={(event) => setDragStartX(event.clientX)}
        onMouseUp={(event) => handleDragEnd(event.clientX)}
        onTouchStart={(event) => setDragStartX(event.touches[0].clientX)}
        onTouchEnd={(event) => handleDragEnd(event.changedTouches[0].clientX)}
      >
        {activeImage ? (
          <>
            <img src={activeImage} alt={product.name} loading="lazy" draggable="false" />
            {images.length > 1 ? (
              <>
                <button
                  className="gallery-control gallery-control-prev"
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Ver imagen anterior"
                >
                  ‹
                </button>
                <button
                  className="gallery-control gallery-control-next"
                  type="button"
                  onClick={showNextImage}
                  aria-label="Ver imagen siguiente"
                >
                  ›
                </button>
                <span className="image-count">{activeImageIndex + 1}/{images.length}</span>
              </>
            ) : null}
          </>
        ) : (
          <span aria-hidden="true">{product.category.slice(0, 2).toUpperCase()}</span>
        )}
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
          <div className="product-actions">
            <button type="button" className="secondary-product-action" onClick={() => onViewDetails(product)}>
              Ver detalle
            </button>
            <button
              type="button"
              disabled={reachedStockLimit}
              onClick={(event) =>
                onAddToCart(product, {
                  imageUrl: activeImage,
                  sourceElement: event.currentTarget.closest(".product-card")?.querySelector("img"),
                })
              }
            >
              {reachedStockLimit ? "Stock mÃ¡ximo" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
