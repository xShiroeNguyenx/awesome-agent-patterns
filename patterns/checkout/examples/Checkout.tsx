import { useState } from "react";

type Step = "cart" | "address" | "payment";
type Status = "editing" | "placing" | "success" | "error";

interface LineItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
}

const ITEMS: LineItem[] = [
  { id: 1, name: "Aurora Desk Lamp", variant: "Warm white", price: 49, qty: 1 },
  { id: 2, name: "Linen Throw Blanket", variant: "Sage", price: 38, qty: 2 },
  { id: 3, name: "Ceramic Mug Set", variant: "Set of 4", price: 24, qty: 1 },
];

const SHIPPING = 6;
const STEPS: Step[] = ["cart", "address", "payment"];
const STEP_LABELS: Record<Step, string> = { cart: "Cart", address: "Address", payment: "Payment" };
const money = (n: number) => `$${n.toFixed(2)}`;

export default function CheckoutExample() {
  const [step, setStep] = useState<Step>("cart");
  const [status, setStatus] = useState<Status>("editing");

  const subtotal = ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + SHIPPING;
  const index = STEPS.indexOf(step);

  function placeOrder() {
    setStatus("placing");
    // Simulate the order request; succeeds after a short delay.
    setTimeout(() => setStatus("success"), 1400);
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-sky-200 bg-sky-50 p-6 text-center">
        <p className="text-base font-semibold text-sky-900">Order placed</p>
        <p className="mt-1 text-sm text-sky-700">
          Confirmation #SK-{(1000 + Math.round(total)).toString()} — a receipt is on its way.
        </p>
        <button
          onClick={() => {
            setStatus("editing");
            setStep("cart");
          }}
          className="mt-4 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
        >
          Start a new order
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[1fr_18rem]">
      <div className="space-y-5">
        <ol className="flex items-center gap-2 text-sm" aria-label="Checkout steps">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2" aria-current={s === step ? "step" : undefined}>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  i <= index ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <span className={i === index ? "font-medium text-slate-900" : "text-slate-500"}>{STEP_LABELS[s]}</span>
              {i < STEPS.length - 1 && <span className="text-slate-300">→</span>}
            </li>
          ))}
        </ol>

        <div className="rounded-lg border border-slate-200 p-4">
          {step === "cart" && (
            <ul className="divide-y divide-slate-100">
              {ITEMS.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-12 shrink-0 rounded-md bg-gradient-to-br from-sky-100 to-slate-200" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.variant} · Qty {item.qty}
                    </p>
                  </div>
                  <span className="text-sm tabular-nums text-slate-700">{money(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
          )}

          {step === "address" && (
            <div className="grid gap-3">
              <Field id="co-name" label="Full name" placeholder="Ava Nguyen" />
              <Field id="co-street" label="Street address" placeholder="12 Harbor Lane" />
              <div className="grid grid-cols-2 gap-3">
                <Field id="co-city" label="City" placeholder="Da Nang" />
                <Field id="co-zip" label="Postal code" placeholder="50000" />
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="grid gap-3">
              <Field id="co-card" label="Card number" placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <Field id="co-exp" label="Expiry" placeholder="12 / 28" />
                <Field id="co-cvc" label="CVC" placeholder="123" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(STEPS[Math.max(0, index - 1)])}
            disabled={index === 0 || status === "placing"}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step !== "payment" ? (
            <button
              type="button"
              onClick={() => setStep(STEPS[index + 1])}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={placeOrder}
              disabled={status === "placing"}
              aria-busy={status === "placing"}
              className="flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "placing" && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
              )}
              {status === "placing" ? "Placing order…" : `Place order · ${money(total)}`}
            </button>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="tabular-nums text-slate-700">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Shipping</dt>
            <dd className="tabular-nums text-slate-700">{money(SHIPPING)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <dt className="font-semibold text-slate-900">Total</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{money(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function Field({ id, label, placeholder }: { id: string; label: string; placeholder: string }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      />
    </div>
  );
}
