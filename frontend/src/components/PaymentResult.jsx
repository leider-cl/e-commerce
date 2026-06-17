export function PaymentResult({ status, orderId, onDismiss }) {
  const isOk = status === "paid";

  return (
    <div className="payment-result-backdrop" onMouseDown={onDismiss}>
      <section
        className="payment-result"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`payment-result-icon ${isOk ? "is-ok" : "is-fail"}`}>
          {isOk ? "✓" : "✕"}
        </div>
        <h2>{isOk ? "Pago exitoso" : "Pago fallido"}</h2>
        {orderId ? (
          <p>
            {isOk
              ? `Orden #${orderId} confirmada. Te llegará un resumen al correo.`
              : `La orden #${orderId} no pudo ser procesada. Intentá de nuevo.`}
          </p>
        ) : (
          <p>{isOk ? "Gracias por tu compra." : "Ocurrió un error al procesar el pago."}</p>
        )}
        <button type="button" className="primary-action" onClick={onDismiss}>
          {isOk ? "Seguir navegando" : "Volver al carrito"}
        </button>
      </section>
    </div>
  );
}
