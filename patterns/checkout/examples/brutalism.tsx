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

export default function CheckoutBrutalism() {
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
      <div className="bg-yellow-50 p-5">
        <div className="mx-auto max-w-md rounded-none border-2 border-black bg-lime-300 p-6 text-center shadow-[6px_6px_0_0_#000]">
          <p className="text-base font-extrabold uppercase tracking-tight text-black">Order placed</p>
          <p className="mt-1 text-sm font-medium text-black">
            Confirmation #SK-{(1000 + Math.round(total)).toString()} — a receipt is on its way.
          </p>
          <button
            onClick={() => {
              setStatus("editing");
              setStep("cart");
            }}
            className="mt-4 rounded-none border-2 border-black bg-yellow-300 px-3 py-1.5 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
          >
            Start a new order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-5">
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[1fr_18rem]">
        <div className="space-y-5">
          <ol className="flex items-center gap-2 text-sm" aria-label="Checkout steps">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2" aria-current={s === step ? "step" : undefined}>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-none border-2 border-black text-xs font-extrabold ${
                    i <= index ? "bg-pink-400 text-black" : "bg-white text-black"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={i === index ? "font-extrabold text-black" : "font-medium text-black"}>{STEP_LABELS[s]}</span>
                {i < STEPS.length - 1 && <span className="font-bold text-black">→</span>}
              </li>
            ))}
          </ol>

          <div className="rounded-none border-2 border-black bg-white p-4 shadow-[6px_6px_0_0_#000]">
            {step === "cart" && (
              <ul className="divide-y-2 divide-black">
                {ITEMS.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-12 shrink-0 rounded-none border-2 border-black bg-cyan-300" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs font-medium text-black">
                        {item.variant} · Qty {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-black">{money(item.price * item.qty)}</span>
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
              className="rounded-none border-2 border-black bg-white px-4 py-2 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {step !== "payment" ? (
              <button
                type="button"
                onClick={() => setStep(STEPS[index + 1])}
                className="rounded-none border-2 border-black bg-yellow-300 px-4 py-2 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={status === "placing"}
                aria-busy={status === "placing"}
                className="flex items-center gap-2 rounded-none border-2 border-black bg-lime-300 px-4 py-2 font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "placing" && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-black" aria-hidden="true" />
                )}
                {status === "placing" ? "Placing order…" : `Place order · ${money(total)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-none border-2 border-black bg-cyan-300 p-4 shadow-[6px_6px_0_0_#000]">
          <h2 className="text-sm font-extrabold uppercase tracking-tight text-black">Order summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-black">Subtotal</dt>
              <dd className="font-bold tabular-nums text-black">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-black">Shipping</dt>
              <dd className="font-bold tabular-nums text-black">{money(SHIPPING)}</dd>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2">
              <dt className="font-extrabold text-black">Total</dt>
              <dd className="font-extrabold tabular-nums text-black">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ id, label, placeholder }: { id: string; label: string; placeholder: string }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-black">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full rounded-none border-2 border-black px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
