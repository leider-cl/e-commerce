export function CartSection({
  isOpen,
  cartItems,
  cartNotice,
  currencyFormatter,
  cartTotal,
  user,
  checkoutLoading,
  onCheckout,
  onDecreaseItem,
  onIncreaseItem,
  onRemoveFromCart,
  onClose,
  onRequestLogin,
  onViewProduct,
}) {
  const hasItems = cartItems.length > 0;

  function handleCheckout() {
    if (!hasItems || checkoutLoading) return;

    if (!user) {
      onRequestLogin();
      return;
    }

    onCheckout();
  }

  return (
    <aside className={`fixed inset-0 z-[1200] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button
        className={`absolute inset-0 cursor-pointer border-0 p-0 transition duration-200 ${isOpen ? "bg-slate-900/35 backdrop-blur-sm" : "bg-black/0"}`}
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
      />

      <section
        className={`absolute right-0 top-0 flex h-full w-[min(100%,28rem)] flex-col border-l border-slate-200 bg-white text-slate-900 shadow-[-24px_0_70px_rgba(15,23,42,.18)] transition duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        id="carrito"
        aria-label="Carrito de cotización"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Carrito</span>
            <h2 className="m-0 mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-none tracking-[-0.04em]">Selección para cotizar</h2>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-300 bg-white text-2xl leading-none text-slate-700 transition hover:border-brand-dark hover:text-brand-dark"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {cartNotice ? (
          <p className="mx-5 mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-brand-dark" role="alert">
            {cartNotice}
          </p>
        ) : null}

        {hasItems ? (
          <>
            <div className="grid flex-1 content-start gap-3 overflow-y-auto p-5">
              {cartItems.map((item) => {
                const imageUrl = item.image_urls?.[0] ?? item.image_url;

                return (
                  <article className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_22px_rgba(15,23,42,.08)]" key={item.id}>
                    <button
                      type="button"
                      className="grid h-20 w-20 cursor-pointer place-items-center overflow-hidden rounded-xl border border-transparent bg-slate-100 p-0 transition hover:border-brand-dark focus-visible:border-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/30"
                      onClick={() => onViewProduct(item)}
                      aria-label={`Ver producto ${item.name}`}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                      ) : (
                        <span className="font-mono text-sm font-black text-slate-950">{item.category.slice(0, 2).toUpperCase()}</span>
                      )}
                    </button>

                    <div className="grid min-w-0 gap-2">
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm font-black leading-snug text-slate-900 underline-offset-4 transition hover:text-brand-dark hover:underline focus-visible:text-brand-dark focus-visible:outline-none"
                        onClick={() => onViewProduct(item)}
                      >
                        {item.name}
                      </button>
                      <span className="text-sm text-slate-600">{currencyFormatter.format(item.price)} c/u</span>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="grid grid-cols-[2.4rem_2.4rem_2.4rem] overflow-hidden rounded-xl border border-slate-300 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => onDecreaseItem(item.id)}
                            disabled={item.quantity <= 1}
                            className="min-h-10 cursor-pointer border-0 bg-transparent p-0 font-mono text-lg font-black text-slate-800 transition hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="grid min-h-10 place-items-center border-x border-slate-300 font-black text-slate-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncreaseItem(item.id)}
                            disabled={item.quantity >= item.stock}
                            className="min-h-10 cursor-pointer border-0 bg-transparent p-0 font-mono text-lg font-black text-slate-800 transition hover:bg-brand-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="min-h-10 cursor-pointer rounded-xl border border-slate-300 bg-white px-3 font-mono text-xs font-black uppercase tracking-widest text-slate-600 transition hover:border-brand-dark hover:text-brand-dark"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mx-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
              <span className="text-sm text-slate-600">Total referencial · CLP</span>
              <strong className="text-[clamp(1.35rem,5vw,2rem)] font-black text-slate-900">{currencyFormatter.format(cartTotal)}</strong>
            </div>

            <div className="mt-auto grid gap-3 border-t border-slate-200 p-5">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-brand-dark bg-brand-dark px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:bg-brand-darker hover:border-brand-darker disabled:cursor-not-allowed disabled:opacity-45"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Procesando..." : user ? "Ir a compra" : "Iniciar sesión para comprar"}
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
                onClick={onClose}
              >
                Seguir cotizando
              </button>
              {!user ? <p className="m-0 text-center text-sm text-slate-500">Inicia sesión para continuar con el pago.</p> : null}
            </div>
          </>
        ) : (
          <div className="m-5 mt-8 grid gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-slate-800">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-brand-dark">Sin productos</span>
            <p className="m-0 leading-7 text-slate-600">Agrega productos para preparar una solicitud de cotización.</p>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-700 no-underline transition hover:border-brand-dark hover:text-brand-dark hover:shadow-[0_0_0_4px_rgba(47,102,179,.10)]"
              onClick={onClose}
            >
              Explorar catálogo
            </button>
          </div>
        )}
      </section>
    </aside>
  );
}
