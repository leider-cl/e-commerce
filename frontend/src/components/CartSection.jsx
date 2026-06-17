export function CartSection({
  cartItems,
  cartNotice,
  currencyFormatter,
  cartTotal,
  onDecreaseItem,
  onIncreaseItem,
  onRemoveFromCart,
}) {
  if (cartItems.length === 0) {
    return (
      <section className="cart-section" id="carrito">
        <div className="section-heading">
          <span>Carrito</span>
          <h2>Selección para cotizar</h2>
        </div>
        <div className="cart-summary">
          <p>Agrega productos para preparar una solicitud de cotización.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-section" id="carrito">
      <div className="section-heading">
        <span>Carrito</span>
        <h2>Selección para cotizar</h2>
      </div>
      <div className="cart-summary">
        {cartNotice ? <p className="cart-notice" role="alert">{cartNotice}</p> : null}
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>{currencyFormatter.format(item.price)} c/u</span>
              </div>
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
            </article>
          ))}
        </div>
        <div className="cart-total">
          <span>Total referencial · CLP</span>
          <strong>{currencyFormatter.format(cartTotal)}</strong>
        </div>
      </div>
    </section>
  );
}
