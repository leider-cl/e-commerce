export function PaymentResult({ status, orderId, onDismiss }) {
  const isOk = status === "paid" || status === "success";

  return (
    <div className="fixed inset-0 z-1000 grid place-items-center bg-black/55 p-4" onMouseDown={onDismiss}>
      <section
        className="grid w-[min(24rem,100%)] place-items-center gap-4 border border-slate-200 bg-white p-12 pb-8 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`grid h-16 w-16 place-items-center rounded-full border-2 text-2xl font-bold ${isOk ? "border-[#2a7a2a] text-[#2a7a2a]" : "border-[#a02a2a] text-[#a02a2a]"}`}>
          {isOk ? "✓" : "✕"}
        </div>
        <h2 className="m-0 text-2xl font-black leading-none tracking-[-0.03em]">{isOk ? "Pago exitoso" : "Pago fallido"}</h2>
        {orderId ? (
          <p className="m-0 text-slate-600 leading-normal">
            {isOk
              ? `Orden #${orderId} confirmada. Te llegará un resumen al correo.`
              : `La orden #${orderId} no pudo ser procesada. Intentá de nuevo.`}
          </p>
        ) : (
          <p className="m-0 text-slate-600 leading-normal">{isOk ? "Gracias por tu compra." : "Ocurrió un error al procesar el pago."}</p>
        )}
        <button
          type="button"
          className="mt-2 inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-brand-dark bg-brand-dark px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:bg-brand-darker hover:border-brand-darker"
          onClick={onDismiss}
        >
          {isOk ? "Seguir navegando" : "Volver al carrito"}
        </button>
      </section>
    </div>
  );
}
