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

export default function LoginNeumorphism() {
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
      <div className="bg-slate-200 p-6 rounded-3xl">
        <div className="mx-auto max-w-sm rounded-2xl bg-slate-200 p-6 text-center shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
          <p className="text-base font-semibold text-slate-700">You&apos;re signed in</p>
          <p className="mt-1 text-sm text-slate-600">Welcome back, {email}.</p>
          <button
            onClick={() => {
              setStatus("idle");
              setPassword("");
            }}
            className="mt-4 rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <div className="bg-slate-200 p-6 rounded-3xl">
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-sm space-y-4 rounded-2xl bg-slate-200 p-5 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
        <div>
          <h2 className="text-lg font-semibold text-slate-700">Sign in</h2>
          <p className="mt-1 text-sm text-slate-600">
            Try <code className="rounded bg-slate-200 px-1 shadow-[inset_2px_2px_4px_#b0b6c0,inset_-2px_-2px_4px_#ffffff]">wrong@example.com</code> to see the error state.
          </p>
        </div>

        {formError && (
          <div role="alert" className="rounded-2xl bg-slate-200 px-3 py-2 text-sm font-semibold text-red-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]">
            {formError}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-600">
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
            className={`mt-1 w-full rounded-2xl bg-slate-200 px-3 py-2 text-sm text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 ${
              touched.email && errors.email ? "ring-2 ring-red-400" : "focus:ring-slate-400"
            }`}
          />
          {touched.email && errors.email && (
            <p id="login-email-error" className="mt-1 text-sm text-red-700">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-600">
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
              className={`w-full rounded-2xl bg-slate-200 px-3 py-2 pr-16 text-sm text-slate-700 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] focus:outline-none focus:ring-2 ${
                touched.password && errors.password ? "ring-2 ring-red-400" : "focus:ring-slate-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2 my-auto h-7 rounded-xl bg-slate-200 px-2 text-xs font-semibold text-slate-600 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff] transition active:shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="login-password-error" className="mt-1 text-sm text-red-700">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] transition active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-600" aria-hidden="true" />
          )}
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
