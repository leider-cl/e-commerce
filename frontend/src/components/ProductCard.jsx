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
    <article className="grid min-h-full min-w-0 rounded-[1.75rem] border border-white/10 bg-[#0d1728]/92 p-3 shadow-[0_24px_80px_rgba(0,0,0,.22)] transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(34,211,238,.12)]">
      <div
        className="relative grid min-h-56 place-items-center overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_50%_35%,#ffffff_0,#eef4fb_62%,#dce7f4_100%)] p-4 select-none shadow-inner"
        style={{ touchAction: "pan-y" }}
        onMouseDown={(event) => setDragStartX(event.clientX)}
        onMouseUp={(event) => handleDragEnd(event.clientX)}
        onTouchStart={(event) => setDragStartX(event.touches[0].clientX)}
        onTouchEnd={(event) => handleDragEnd(event.changedTouches[0].clientX)}
      >
        {activeImage ? (
          <>
            <img src={activeImage} alt={product.name} loading="lazy" draggable="false" className="h-52 w-full object-contain object-center" style={{ mixBlendMode: "multiply" }} />
            {images.length > 1 ? (
              <>
                <button
                  className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/86 text-white shadow-lg transition hover:bg-cyan-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  type="button"
                  onClick={showPreviousImage}
                  aria-label="Ver imagen anterior"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -translate-x-px">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/86 text-white shadow-lg transition hover:bg-cyan-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                  type="button"
                  onClick={showNextImage}
                  aria-label="Ver imagen siguiente"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 translate-x-px">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
                <span className="absolute right-3 top-3 rounded-full bg-slate-950 px-2 py-1 font-mono text-[0.65rem] font-black leading-none text-white">
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

      <div className="flex flex-col px-2 pb-2 pt-4">
        <div className="flex flex-wrap justify-between gap-3 font-mono text-xs font-black uppercase tracking-widest text-slate-400">
          <span>{product.tag}</span>
          <span>{product.stock} disponibles</span>
        </div>
        <h3 className="mt-3 mb-2 text-xl font-black leading-tight tracking-[-0.03em] text-white break-words">
          <button type="button" className="m-0 cursor-pointer border-0 bg-transparent p-0 text-left font-[inherit] leading-[inherit] tracking-[inherit] text-inherit hover:text-cyan-300 underline decoration-1 underline-offset-4" onClick={() => onViewDetails(product)}>
            {product.name}
          </button>
        </h3>
        <p className="m-0 text-sm leading-6 text-slate-400 break-words">{product.description}</p>

        <div className="mt-auto flex flex-col gap-4 pt-4">
          <div className="flex items-baseline gap-1">
            <strong className="text-xl font-black text-white">{currencyFormatter.format(product.price)}</strong>
            <span className="font-mono text-xs font-black uppercase text-slate-400">CLP</span>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 gap-2 rounded-[1.15rem] bg-white/8 p-1 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:border-cyan-300 hover:bg-white/12 hover:text-cyan-200 hover:shadow-[0_0_0_4px_rgba(34,211,238,.10)]"
              onClick={() => onViewDetails(product)}
            >
              Ver detalle
            </button>
            <button
              type="button"
              disabled={reachedStockLimit}
              className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-cyan-400 bg-cyan-400 px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-950 no-underline transition hover:bg-cyan-300 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
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
