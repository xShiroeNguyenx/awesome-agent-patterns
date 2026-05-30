import { useState } from "react";

type Status = "idle" | "submitting" | "error" | "success";

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export default function LoginNeon() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function handleBlur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(email, password));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(email, password);
    setErrors(found);
    setTouched({ email: true, password: true });
    if (found.email || found.password) return;

    setFormError(null);
    setStatus("submitting");
    // Simulate an async auth request. wrong@example.com fails; anything else succeeds.
    setTimeout(() => {
      if (email.trim().toLowerCase() === "wrong@example.com") {
        setStatus("error");
        setFormError("Email or password is incorrect.");
      } else {
        setStatus("success");
      }
    }, 1200);
  }

  if (status === "success") {
    return (
      <div className="bg-slate-950 p-6 rounded-xl">
        <div className="mx-auto max-w-sm rounded-lg border border-cyan-500/50 bg-slate-900 p-6 text-center text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
          <p className="text-base font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">You&apos;re signed in</p>
          <p className="mt-1 text-sm text-slate-400">Welcome back, {email}.</p>
          <button
            onClick={() => {
              setStatus("idle");
              setPassword("");
            }}
            className="mt-4 rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className="bg-slate-950 p-6 rounded-xl">
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-sm space-y-4 rounded-lg border border-cyan-500/50 bg-slate-900 p-5 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
        <div>
          <h2 className="text-lg font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">Sign in</h2>
          <p className="mt-1 text-sm text-slate-400">
            Try <code className="rounded border border-cyan-500/40 bg-slate-800 px-1 text-cyan-200">wrong@example.com</code> to see the error state.
          </p>
        </div>

        {formError && (
          <div role="alert" className="rounded-md border border-fuchsia-400 bg-slate-900 px-3 py-2 text-sm font-medium text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={touched.email && !!errors.email}
            aria-describedby={touched.email && errors.email ? "login-email-error" : undefined}
            className={`mt-1 w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              touched.email && errors.email ? "border-fuchsia-400" : "border-cyan-500/40"
            }`}
          />
          {touched.email && errors.email && (
            <p id="login-email-error" className="mt-1 text-sm text-fuchsia-300">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative mt-1">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={touched.password && errors.password ? "login-password-error" : undefined}
              className={`w-full rounded-md border bg-slate-900 px-3 py-2 pr-16 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                touched.password && errors.password ? "border-fuchsia-400" : "border-cyan-500/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2 my-auto h-7 rounded-md border border-cyan-400 bg-cyan-400/10 px-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="login-password-error" className="mt-1 text-sm text-fuchsia-300">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-2 font-medium text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/40 border-t-cyan-200" aria-hidden="true" />
          )}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
