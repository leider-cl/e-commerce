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
    <article className="product-card group grid min-h-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_26px_rgba(15,23,42,.08)] transition hover:-translate-y-1 hover:border-brand-dark/50 hover:shadow-[0_18px_40px_rgba(47,102,179,.14)]">
      <div
        className="relative grid min-h-44 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 select-none"
        style={{ touchAction: "pan-y" }}
        onMouseDown={(event) => setDragStartX(event.clientX)}
        onMouseUp={(event) => handleDragEnd(event.clientX)}
        onTouchStart={(event) => setDragStartX(event.touches[0].clientX)}
        onTouchEnd={(event) => handleDragEnd(event.changedTouches[0].clientX)}
      >
        {activeImage ? (
          <>
            <img src={activeImage} alt={product.name} loading="lazy" draggable="false" className="h-36 w-[88%] rounded-xl bg-slate-100/95 object-contain object-center transition duration-300 group-hover:scale-[1.03]" />
            {images.length > 1 ? (
              <>
                <button
                  className="absolute top-1/2 left-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/15 bg-brand-dark text-white shadow-lg transition hover:bg-brand-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/50"
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Ver imagen anterior"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -translate-x-px">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="absolute top-1/2 right-2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-white/15 bg-brand-dark text-white shadow-lg transition hover:bg-brand-darker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/50"
                  type="button"
                  onClick={showNextImage}
                  aria-label="Ver imagen siguiente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 translate-x-px">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
                <span className="absolute right-3 top-3 rounded-full border border-blue-200 bg-brand-dark px-2 py-1 font-mono text-[0.65rem] font-black leading-none text-white shadow-lg">
                  {activeImageIndex + 1}/{images.length}
                </span>
              </>
            ) : null}
          </>
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full border border-current font-mono font-bold">
            {product.category.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex flex-col px-2 pb-2 pt-3">
        <div className="flex flex-wrap justify-between gap-2 font-mono text-[0.65rem] font-black uppercase tracking-widest text-brand-dark">
          <span>{product.tag}</span>
          <span>{product.stock} disponibles</span>
        </div>

        <h3 className="mt-3 mb-2 min-h-13 text-base font-black leading-tight tracking-[-0.03em] text-slate-900 wrap-break-word">
          <button type="button" className="m-0 line-clamp-2 cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit] leading-[inherit] tracking-[inherit] text-inherit underline decoration-1 underline-offset-4 hover:text-brand-dark" onClick={() => onViewDetails(product)}>
            {product.name}
          </button>
        </h3>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-baseline gap-1">
            <strong className="text-xl font-black text-slate-900">{currencyFormatter.format(product.price)}</strong>
            <span className="font-mono text-xs font-black uppercase text-slate-500">CLP</span>
          </div>

          <div className="grid w-full min-w-0 grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-[0.68rem] font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
              onClick={() => onViewDetails(product)}
            >
              Detalle
            </button>
            <button
              type="button"
              disabled={reachedStockLimit}
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-brand-dark bg-brand-dark px-3 py-2 font-mono text-[0.68rem] font-black uppercase tracking-widest text-white no-underline transition hover:border-brand-darker hover:bg-brand-darker disabled:cursor-not-allowed disabled:opacity-45"
              onClick={(event) =>
                onAddToCart(product, {
                  imageUrl: activeImage,
                  sourceElement: event.currentTarget.closest(".product-card")?.querySelector("img"),
                })
              }
            >
              {reachedStockLimit ? "Stock máximo" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
