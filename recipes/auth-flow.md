---
task: auth-flow
title: Authentication flow (sign in)
patterns: [login, toast, error-state, loading]
tags: [auth, login, signin, session, security]
---

## Goal

Let a returning user sign in with email/password (or SSO), with trustworthy validation and clear
recovery from bad credentials or server errors.

## Pattern composition (order matters)

1. **[[login]]** — the form: labeled inputs, inline validation, show/hide password.
2. **[[loading]]** — the submit button enters a busy/disabled state while authenticating.
3. **[[error-state]]** — a form-level banner (`role="alert"`) for bad credentials or server failure.
4. **[[toast]]** — "Welcome back" on success, or "Session expired — please sign in again" on arrival.

## Data/state flow notes

- State machine: `idle → validating → submitting → (success → redirect | error → idle)`.
- Validate format client-side (required, email shape, min length) before the network call.
- On submit: disable inputs + button, show spinner; on response, route on success or surface the error.

## Edge cases to not forget

- **Security:** never reveal *which* field was wrong for invalid credentials — one generic "Email or password is incorrect."
- **Preserve the typed email** (not the password) after an error.
- **Prevent double-submit** (disabled while pending) and handle slow networks gracefully.
- Surface rate-limit / lockout messaging distinctly from wrong-password.
- Respect password managers: real `<input type="password" autocomplete>` and a labeled show/hide toggle.
