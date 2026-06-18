import { useState } from "react";
import { useAuth } from "../context/useAuth";

export function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }

  function switchMode(newMode) {
    setMode(newMode);
    setRegisteredEmail("");
    resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
        onClose();
      } else {
        await register(name, email, password);
        setRegisteredEmail(email);
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="fixed inset-0 z-1000 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
        <section
          className="relative w-[min(30rem,100%)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.22)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-500 shadow-sm transition hover:border-brand-dark hover:text-brand-dark"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>

          <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)] px-6 pb-6 pt-8 sm:px-8">
            <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-brand-dark ring-1 ring-blue-100">Cuenta LEIDER</span>
            <h2 id="auth-modal-title" className="m-0 text-[clamp(1.75rem,6vw,2.4rem)] font-black leading-tight tracking-[-0.04em] text-slate-950">Revisa tu correo</h2>
            <p className="m-0 mt-3 max-w-160 text-sm leading-6 text-slate-600">
              Te enviamos un enlace de verificación a <strong className="text-slate-900">{registeredEmail}</strong>. Activa tu cuenta y después inicia sesión.
            </p>
          </div>

          <div className="grid gap-3 p-6 sm:p-8">
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-brand-dark bg-brand-dark px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white transition hover:border-brand-darker hover:bg-brand-darker"
              onClick={() => {
                setRegisteredEmail("");
                setMode("login");
              }}
            >
              Ir a iniciar sesión
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-1000 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <section
        className="relative w-[min(30rem,100%)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-500 shadow-sm transition hover:border-brand-dark hover:text-brand-dark"
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)] px-6 pb-6 pt-8 sm:px-8">
          <span className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-brand-dark ring-1 ring-blue-100">Cuenta LEIDER</span>
          <h2 id="auth-modal-title" className="m-0 text-[clamp(1.75rem,6vw,2.4rem)] font-black leading-tight tracking-[-0.04em] text-slate-950">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <p className="m-0 mt-3 max-w-160 text-sm leading-6 text-slate-600">
            {isLogin ? "Accede para continuar con tu compra y revisar tus solicitudes." : "Regístrate para comprar y guardar tus datos de contacto."}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-5 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              className={`min-h-10 cursor-pointer rounded-xl border-0 px-3 font-mono text-xs font-black uppercase tracking-widest transition ${isLogin ? "bg-brand-dark text-white shadow-sm" : "bg-transparent text-slate-500 hover:text-brand-dark"}`}
              onClick={() => switchMode("login")}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={`min-h-10 cursor-pointer rounded-xl border-0 px-3 font-mono text-xs font-black uppercase tracking-widest transition ${!isLogin ? "bg-brand-dark text-white shadow-sm" : "bg-transparent text-slate-500 hover:text-brand-dark"}`}
              onClick={() => switchMode("register")}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isLogin ? (
              <label className="grid gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-700">Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  autoComplete="name"
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-dark focus:shadow-[0_0_0_4px_rgba(47,102,179,.12)]"
                />
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-700">Correo electrónico</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.cl"
                required
                autoComplete="email"
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-dark focus:shadow-[0_0_0_4px_rgba(47,102,179,.12)]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-widest text-slate-700">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-dark focus:shadow-[0_0_0_4px_rgba(47,102,179,.12)]"
              />
            </label>

            {error ? (
              <p className="m-0 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-brand-dark" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-brand-dark bg-brand-dark px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white shadow-[0_12px_28px_rgba(47,102,179,.18)] transition hover:border-brand-darker hover:bg-brand-darker disabled:cursor-not-allowed disabled:opacity-45"
              disabled={submitting}
            >
              {submitting ? "Procesando…" : isLogin ? "Ingresar" : "Crear cuenta"}
            </button>
          </form>

          <p className="m-0 mt-5 text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                ¿No tienes cuenta?{" "}
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-bold text-brand-dark underline underline-offset-4" onClick={() => switchMode("register")}>
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-bold text-brand-dark underline underline-offset-4" onClick={() => switchMode("login")}>
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
