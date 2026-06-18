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
        className={`absolute inset-0 cursor-pointer border-0 p-0 transition duration-200 ${isOpen ? "bg-black/65 backdrop-blur-sm" : "bg-black/0"}`}
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
      />

      <section
        className={`absolute right-0 top-0 flex h-full w-[min(100%,28rem)] flex-col border-l border-white/10 bg-[#081120] text-white shadow-[-28px_0_90px_rgba(0,0,0,.42)] transition duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        id="carrito"
        aria-label="Carrito de cotización"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">Carrito</span>
            <h2 className="m-0 mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-black leading-none tracking-[-0.04em]">Selección para cotizar</h2>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/10 bg-white/8 text-2xl leading-none text-white transition hover:border-cyan-300 hover:text-cyan-200"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {cartNotice ? (
          <p className="mx-5 mt-5 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm font-bold text-cyan-100" role="alert">
            {cartNotice}
          </p>
        ) : null}

        {hasItems ? (
          <>
            <div className="grid flex-1 content-start gap-3 overflow-y-auto p-5">
              {cartItems.map((item) => {
                const imageUrl = item.image_urls?.[0] ?? item.image_url;

                return (
                  <article className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-white/6 p-3 shadow-[0_18px_45px_rgba(0,0,0,.16)]" key={item.id}>
                    <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl bg-slate-100">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                      ) : (
                        <span className="font-mono text-sm font-black text-slate-950">{item.category.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="grid min-w-0 gap-2">
                      <strong className="text-sm font-black leading-snug text-white break-words">{item.name}</strong>
                      <span className="text-sm text-slate-300">{currencyFormatter.format(item.price)} c/u</span>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="grid grid-cols-[2.4rem_2.4rem_2.4rem] overflow-hidden rounded-xl border border-white/10 bg-white/8">
                          <button
                            type="button"
                            onClick={() => onDecreaseItem(item.id)}
                            disabled={item.quantity <= 1}
                            className="min-h-10 cursor-pointer border-0 bg-transparent p-0 font-mono text-lg font-black text-white transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="grid min-h-10 place-items-center border-x border-white/10 font-black text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncreaseItem(item.id)}
                            disabled={item.quantity >= item.stock}
                            className="min-h-10 cursor-pointer border-0 bg-transparent p-0 font-mono text-lg font-black text-white transition hover:bg-cyan-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="min-h-10 cursor-pointer rounded-xl border border-white/10 bg-transparent px-3 font-mono text-xs font-black uppercase tracking-widest text-slate-300 transition hover:border-cyan-300 hover:text-cyan-200"
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

            <div className="mx-5 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <span className="text-sm text-slate-300">Total referencial · CLP</span>
              <strong className="text-[clamp(1.35rem,5vw,2rem)] font-black text-white">{currencyFormatter.format(cartTotal)}</strong>
            </div>

            <div className="mt-auto grid gap-3 border-t border-white/10 p-5">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-cyan-400 bg-cyan-400 px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-slate-950 no-underline transition hover:bg-cyan-300 hover:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Procesando..." : user ? "Ir a compra" : "Iniciar sesión para comprar"}
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:border-cyan-300 hover:bg-white/12 hover:text-cyan-200 hover:shadow-[0_0_0_4px_rgba(34,211,238,.10)]"
                onClick={onClose}
              >
                Seguir cotizando
              </button>
              {!user ? <p className="m-0 text-center text-sm text-slate-400">Inicia sesión para continuar con el pago.</p> : null}
            </div>
          </>
        ) : (
          <div className="m-5 mt-8 grid gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-5 text-slate-100">
            <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">Sin productos</span>
            <p className="m-0 leading-7 text-slate-300">Agrega productos para preparar una solicitud de cotización.</p>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-0 items-center justify-center rounded-xl border border-white/15 bg-white/8 px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:border-cyan-300 hover:bg-white/12 hover:text-cyan-200 hover:shadow-[0_0_0_4px_rgba(34,211,238,.10)]"
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
