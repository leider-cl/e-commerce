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
    <aside className={`cart-drawer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      <button className="cart-drawer-backdrop" type="button" aria-label="Cerrar carrito" onClick={onClose} />

      <section className="cart-drawer-panel" id="carrito" aria-label="Carrito de cotización">
        <div className="cart-drawer-header">
          <div>
            <span>Carrito</span>
            <h2>Selección para cotizar</h2>
          </div>
          <button type="button" className="cart-drawer-close" onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {cartNotice ? <p className="cart-notice" role="alert">{cartNotice}</p> : null}

        {hasItems ? (
          <>
            <div className="cart-items">
              {cartItems.map((item) => {
                const imageUrl = item.image_urls?.[0] ?? item.image_url;

                return (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item-media">
                      {imageUrl ? <img src={imageUrl} alt={item.name} /> : <span>{item.category.slice(0, 2).toUpperCase()}</span>}
                    </div>

                    <div className="cart-item-body">
                      <strong>{item.name}</strong>
                      <span>{currencyFormatter.format(item.price)} c/u</span>

                      <div className="cart-item-controls">
                        <div className="quantity-stepper">
                          <button
                            type="button"
                            onClick={() => onDecreaseItem(item.id)}
                            disabled={item.quantity <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncreaseItem(item.id)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <button type="button" className="cart-item-remove" onClick={() => onRemoveFromCart(item.id)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-total">
              <span>Total referencial · CLP</span>
              <strong>{currencyFormatter.format(cartTotal)}</strong>
            </div>

            <div className="cart-checkout-actions">
              <button type="button" className="primary-action" onClick={handleCheckout} disabled={checkoutLoading}>
                {checkoutLoading ? "Procesando..." : user ? "Ir a compra" : "Iniciar sesión para comprar"}
              </button>
              <button type="button" className="secondary-action" onClick={onClose}>
                Seguir cotizando
              </button>
              {!user ? <p className="cart-login-hint">Inicia sesión para continuar con el pago.</p> : null}
            </div>
          </>
        ) : (
          <div className="cart-empty-state">
            <span>Sin productos</span>
            <p>Agrega productos para preparar una solicitud de cotización.</p>
            <button type="button" className="secondary-action" onClick={onClose}>Explorar catálogo</button>
          </div>
        )}
      </section>
    </aside>
  );
}
