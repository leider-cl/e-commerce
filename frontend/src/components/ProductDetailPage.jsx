import { useEffect, useMemo } from "react";

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
  const images = useMemo(() => {
    if (!product) return [];
    const productImages = product.image_urls?.length ? product.image_urls : [product.image_url];
    return productImages.filter(Boolean);
  }, [product?.image_url, product?.image_urls]);

  const currentImage = images[selectedImageIndex] ?? images[0] ?? null;

  useEffect(() => {
    if (product && selectedImageIndex >= images.length) {
      onSelectImageIndex(0);
    }
  }, [product?.id, images.length]);

  if (loading) {
    return (
      <section className="py-8 xl:py-14">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,.07)]">
          <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Producto</span>
          <h1 className="m-0 mb-3 text-[clamp(1.9rem,5vw,3rem)] font-black leading-none tracking-tighter text-slate-900">Cargando producto</h1>
          <p className="m-0 text-slate-600">Estamos preparando la información técnica.</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-8 xl:py-14">
        <button
          type="button"
          className="mb-5 inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:bg-blue-50 hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
          onClick={onBackToCatalog}
        >
          Volver al catálogo
        </button>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-[0_10px_28px_rgba(15,23,42,.07)]">
          <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Producto</span>
          <h1 className="m-0 mb-3 text-[clamp(1.9rem,5vw,3rem)] font-black leading-none tracking-tighter text-slate-900">Producto no encontrado</h1>
          <p className="m-0 text-slate-600">El producto solicitado no existe o ya no está disponible.</p>
        </div>
      </section>
    );
  }

  const reachedCartLimit = product ? (cartQuantityByProductId.get(product.id) ?? 0) >= product.stock : false;

  return (
    <section className="py-8 xl:py-14">
      <button
        type="button"
        className="mb-5 inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:bg-blue-50 hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
        onClick={onBackToCatalog}
      >
        Volver al catálogo
      </button>

      <article className="grid gap-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,.09)] md:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)] lg:p-7">
        <div className="product-detail-gallery grid content-start gap-4 rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4">
          {currentImage ? (
            <img src={currentImage} alt={product.name} draggable="false" className="h-[min(30rem,58vh)] w-full rounded-2xl bg-slate-100/95 object-cover object-center shadow-[0_22px_55px_rgba(0,0,0,.28)]" />
          ) : (
            <div className="grid h-64 w-full place-items-center rounded-xl bg-slate-100 font-mono text-3xl font-black text-slate-500">
              {product.category.slice(0, 2).toUpperCase()}
            </div>
          )}
          {images.length > 1 ? (
            <div className="mt-4 flex gap-2" aria-label="Imágenes del producto">
              {images.map((image, index) => (
                <button
                  className={`h-14 w-14 cursor-pointer overflow-hidden rounded-xl border bg-slate-100/95 transition ${index === selectedImageIndex ? "border-brand-dark shadow-[0_0_0_2px_rgba(47,102,179,.20)]" : "border-slate-200 opacity-70 hover:opacity-100"}`}
                  type="button"
                  key={image}
                  onClick={() => onSelectImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={image} alt="" draggable="false" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-brand-dark">{product.tag}</span>
          <h1 className="mt-3 mb-4 max-w-180 text-[clamp(2rem,4.6vw,3.15rem)] font-black leading-tight tracking-[-0.04em] text-slate-900 wrap-break-word">{product.name}</h1>
          <p className="max-w-160 text-slate-600 leading-7 wrap-break-word">{product.description}</p>

          <dl className="my-6 grid gap-0 border-t border-slate-200">
            <div className="grid gap-1 border-b border-slate-200 py-3">
              <dt className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Categoría</dt>
              <dd className="m-0 text-slate-700">{product.category}</dd>
            </div>
            <div className="grid gap-1 border-b border-slate-200 py-3">
              <dt className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Stock</dt>
              <dd className="m-0 text-slate-700">{product.stock} disponibles</dd>
            </div>
            <div className="grid gap-1 border-b border-slate-200 py-3">
              <dt className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Precio</dt>
              <dd className="m-0 text-slate-700">{currencyFormatter.format(product.price)} CLP</dd>
            </div>
          </dl>

          <button
            type="button"
            className="inline-flex min-h-12 min-w-0 w-full items-center justify-center rounded-xl border border-brand-dark bg-brand-dark px-5 py-3 font-mono text-sm font-black uppercase tracking-widest text-white no-underline shadow-[0_12px_28px_rgba(47,102,179,.18)] transition hover:bg-brand-darker hover:border-brand-darker disabled:cursor-not-allowed disabled:opacity-45"
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
        <section className="mt-8 border-t border-slate-200 pt-8" aria-labelledby="related-products-title">
          <div className="mb-4 mt-10 flex flex-col gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">También podría interesarte</span>
            <h2 id="related-products-title" className="text-[clamp(1.8rem,4vw,2.8rem)] m-0 max-w-full font-black leading-none tracking-[-0.04em] text-slate-900 wrap-break-word">Productos similares</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),16rem))] gap-4">
            {relatedProducts.map((relatedProduct) => {
              const relatedImage = relatedProduct.image_urls?.[0] ?? relatedProduct.image_url;
              return (
                <article className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,.08)]" key={relatedProduct.id}>
                  <img src={relatedImage} alt={relatedProduct.name} loading="lazy" className="h-44 w-full bg-[radial-gradient(circle_at_50%_35%,#ffffff_0,#eef4fb_62%,#dce7f4_100%)] object-contain object-center" style={{ mixBlendMode: "multiply" }} />
                  <div className="grid gap-2 p-4">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-400">{relatedProduct.tag}</span>
                    <h3 className="m-0 text-xl font-black leading-tight tracking-[-0.03em] text-slate-900 wrap-break-word">{relatedProduct.name}</h3>
                    <p className="m-0 text-sm text-slate-600">{currencyFormatter.format(relatedProduct.price)} CLP</p>
                    <button
                      type="button"
                      className="mt-2 inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
                      onClick={() => onViewProduct(relatedProduct)}
                    >
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
