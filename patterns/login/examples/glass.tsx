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

export default function LoginGlass() {
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
      <div className="bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl">
        <div className="mx-auto max-w-sm rounded-2xl border border-white/40 bg-white/15 p-6 text-center text-white shadow-xl backdrop-blur-md">
          <p className="text-base font-semibold text-white">You&apos;re signed in</p>
          <p className="mt-1 text-sm text-white/70">Welcome back, {email}.</p>
          <button
            onClick={() => {
              setStatus("idle");
              setPassword("");
            }}
            className="mt-4 rounded-xl border border-white/50 bg-white/25 px-3 py-1.5 font-medium text-white backdrop-blur transition hover:bg-white/40"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className="bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 p-6 rounded-2xl">
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-sm space-y-4 rounded-2xl border border-white/40 bg-white/15 p-5 text-white shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-lg font-semibold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-white/70">
            Try <code className="rounded border border-white/40 bg-white/20 px-1">wrong@example.com</code> to see the error state.
          </p>
        </div>

        {formError && (
          <div role="alert" className="rounded-xl border border-white/40 bg-red-500/30 px-3 py-2 text-sm font-medium text-white backdrop-blur">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-white">
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
            className={`mt-1 w-full rounded-xl border bg-white/20 px-3 py-2 text-sm text-white placeholder:text-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60 ${
              touched.email && errors.email ? "border-red-300" : "border-white/40"
            }`}
          />
          {touched.email && errors.email && (
            <p id="login-email-error" className="mt-1 text-sm text-red-200">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-white">
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
              className={`w-full rounded-xl border bg-white/20 px-3 py-2 pr-16 text-sm text-white placeholder:text-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60 ${
                touched.password && errors.password ? "border-red-300" : "border-white/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2 my-auto h-7 rounded-lg border border-white/50 bg-white/25 px-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/40"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="login-password-error" className="mt-1 text-sm text-red-200">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/50 bg-white/25 px-3 py-2 font-medium text-white backdrop-blur transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          )}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
