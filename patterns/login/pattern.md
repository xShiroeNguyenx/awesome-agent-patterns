---
id: login
title: Login Form
category: auth
when_to_use: Authenticate a returning user with email/password (or SSO) and clear validation.
tags: [login, signin, auth, form, password, validation]
composes: []
related: [toast, error-state, loading, modal]
states: [idle, validating, submitting, error]
a11y: [labeled-inputs, error-association, password-toggle, submit-disabled]
stack: react-ts-tailwind
---

## When to use / when NOT to use

**Use** to authenticate a returning user with credentials they already have (email + password, or a
federated SSO button). A login form is the trust boundary into your product — keep it focused, fast,
and forgiving.

**Don't use** a full form when a single SSO redirect is the only path (just show the provider button),
and don't reuse this for first-time sign-up — registration needs different fields, consent, and
weaker-error tolerance. For step-up auth inside an authenticated session, prefer a [[modal]] over a
full-page form.

## States to handle

- **idle** — the resting form: empty or pre-filled email, password hidden, submit enabled. No errors shown yet.
- **validating** — inline field validation runs on blur and on submit (required, email format, min length); show the first offending message under each field, never a wall of errors up top.
- **submitting** — disable the submit button, swap its label for a spinner, and keep fields editable-but-quiet so the user sees progress (see [[loading]]). Prevent double-submit.
- **error** — credential failure returns a form-level banner ("Email or password is incorrect"), associated and focusable, distinct from per-field validation (see [[error-state]]). Never reveal *which* of email/password was wrong.

## UX guidance — Do & Don't

- **Do** validate a field on blur (after the user leaves it) and re-validate everything on submit.
- **Do** offer a show/hide password toggle so users can self-correct typos.
- **Do** keep the form-level credential error generic; a successful login can hand off to a [[toast]] confirmation on the next screen.
- **Don't** clear the password field on a failed attempt — it forces re-typing and feels punitive.
- **Don't** disable the submit button just because the form is "invalid"; let the user submit, then show errors (disabling hides *why*).
- **Don't** block the whole UI behind a full-screen spinner while authenticating — scope the busy state to the button.

## Accessibility checklist

- Every input has a real `<label htmlFor>`; the password field's visibility toggle is a `<button>` with an `aria-label` and `aria-pressed`.
- Field errors are tied to their input via `aria-describedby` and the input carries `aria-invalid` when in error.
- The submit button shows a disabled + busy state (`disabled`, `aria-busy`) while submitting so assistive tech announces progress.
- The form-level credential banner uses `role="alert"` so it is announced when it appears.

## Code (React + TS + Tailwind)

See `examples/Login.tsx` — a self-contained email/password form with on-blur and on-submit
validation, a show/hide password toggle, a button-scoped submitting spinner, and a form-level error
banner. Submitting `wrong@example.com` triggers the credential-error branch; any other valid email
succeeds.

## Anti-patterns / common mistakes

- Telling the attacker which field was wrong ("no account with that email") — leaks valid addresses.
- Wiping the password on error, or disabling submit so the user can't see what's invalid.
- A global page spinner that hides the form and causes layout shift instead of a button-scoped busy state.
- Putting validation only on submit, so the user fixes one error, resubmits, and discovers the next.
