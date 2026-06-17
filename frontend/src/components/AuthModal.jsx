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
      <div className="auth-backdrop" onMouseDown={onClose}>
        <section
          className="auth-modal"
          role="dialog"
          aria-labelledby="auth-modal-title"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">
            Cerrar
          </button>
          <div className="auth-modal-content">
            <span className="contact-kicker">Cuenta</span>
            <h2 id="auth-modal-title">Revisá tu correo</h2>
            <p style={{ margin: "1rem 0", lineHeight: 1.5 }}>
              Te enviamos un link de verificación a <strong>{registeredEmail}</strong>.
              Hacé clic en el link para activar tu cuenta y después iniciá sesión.
            </p>
            <button
              type="button"
              className="primary-action auth-submit"
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
    <div className="auth-backdrop" onMouseDown={onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>

        <div className="auth-modal-content">
          <span className="contact-kicker">Cuenta</span>
          <h2 id="auth-modal-title">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" ? (
              <label className="auth-field">
                <span>Nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  autoComplete="name"
                />
              </label>
            ) : null}

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.cl"
                required
                autoComplete={mode === "login" ? "email" : "email"}
              />
            </label>

            <label className="auth-field">
              <span>Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>

            {error ? <p className="auth-error" role="alert">{error}</p> : null}

            <button
              type="submit"
              className="primary-action auth-submit"
              disabled={submitting}
            >
              {submitting
                ? "Procesando…"
                : mode === "login"
                  ? "Ingresar"
                  : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button type="button" onClick={() => switchMode("register")}>
                  Registrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button type="button" onClick={() => switchMode("login")}>
                  Iniciá sesión
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
