export function CartSection({
  cartItems,
  cartNotice,
  currencyFormatter,
  cartTotal,
  onDecreaseItem,
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
                <span>{item.quantity} × {currencyFormatter.format(item.price)}</span>
              </div>
              <div className="cart-item-actions">
                <button type="button" onClick={() => onDecreaseItem(item.id)}>Quitar 1</button>
                <button type="button" onClick={() => onRemoveFromCart(item.id)}>Quitar todo</button>
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
