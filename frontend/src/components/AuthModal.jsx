import { useState } from "react";
import { useAuth } from "../context/useAuth";

export function AuthModal({ onClose }) {
  const { login, register, resendVerification } = useAuth();
  const [mode, setMode] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      if (mode === "login") {
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
      <div className="fixed inset-0 z-1000 grid place-items-center bg-black/55 p-4" onMouseDown={onClose}>
        <section
          className="relative w-[min(28rem,100%)] border border-slate-200 bg-white shadow-2xl"
          role="dialog"
          aria-labelledby="auth-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="absolute right-0 top-0 min-h-11 bg-[#2f66b3] px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white" type="button" onClick={onClose} aria-label="Cerrar">
            Cerrar
          </button>
          <div className="p-8 pb-6">
            <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-[#2f66b3]">Cuenta</span>
            <h2 id="auth-modal-title" className="mt-3 mb-6 text-[clamp(1.6rem,5vw,2.25rem)] font-black leading-tight tracking-[-0.04em]">Revisa tu correo</h2>
            <p style={{ margin: "1rem 0", lineHeight: 1.5 }}>
              Te enviamos un link de verificación a <strong>{registeredEmail}</strong>.
              Haz clic en el link para activar tu cuenta y después inicia sesión.
            </p>
            <button
              type="button"
              className="mt-2 inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-[#2f66b3] bg-[#2f66b3] px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:bg-[#285aa0] hover:border-[#285aa0]"
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
    <div className="fixed inset-0 z-1000 grid place-items-center bg-black/55 p-4" onMouseDown={onClose}>
      <section
        className="relative w-[min(28rem,100%)] border border-slate-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="absolute right-0 top-0 min-h-11 bg-[#2f66b3] px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white" type="button" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>

        <div className="p-8 pb-6">
          <span className="mb-3 block font-mono text-xs font-black uppercase tracking-widest text-[#2f66b3]">Cuenta</span>
          <h2 id="auth-modal-title" className="mt-3 mb-6 text-[clamp(1.6rem,5vw,2.25rem)] font-black leading-tight tracking-[-0.04em]">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {mode === "register" ? (
              <label className="grid gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-widest">Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  autoComplete="name"
                  className="min-h-11 w-full border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-[#2f66b3]"
                />
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-widest">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.cl"
                required
                autoComplete={mode === "login" ? "email" : "email"}
                className="min-h-11 w-full border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-[#2f66b3]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-mono text-xs font-black uppercase tracking-widest">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="min-h-11 w-full border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-[#2f66b3]"
              />
            </label>

            {error ? <p className="m-0 border border-[#2f66b3] bg-slate-50 p-3 text-sm font-bold text-[#2f66b3]" role="alert">{error}</p> : null}

            <button
              type="submit"
              className="mt-2 inline-flex min-h-11 min-w-0 w-full items-center justify-center rounded-xl border border-[#2f66b3] bg-[#2f66b3] px-4 py-3 font-mono text-xs font-black uppercase tracking-widest text-white no-underline transition hover:bg-[#285aa0] hover:border-[#285aa0] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={submitting}
            >
              {submitting
                ? "Procesando…"
                : mode === "login"
                  ? "Ingresar"
                  : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[#2f66b3] underline" onClick={() => switchMode("register")}>
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[#2f66b3] underline" onClick={() => switchMode("login")}>
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
