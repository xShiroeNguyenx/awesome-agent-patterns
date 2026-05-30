import { useState } from "react";

type State = "default" | "on-sale" | "out-of-stock" | "loading";

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  state: State;
  swatch: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Canvas Tote", price: 38, state: "default", swatch: "bg-cyan-500/30" },
  { id: 2, name: "Wool Beanie", price: 24, salePrice: 18, state: "on-sale", swatch: "bg-fuchsia-500/30" },
  { id: 3, name: "Leather Wallet", price: 56, state: "out-of-stock", swatch: "bg-slate-700" },
  { id: 4, name: "Loading", price: 0, state: "loading", swatch: "bg-slate-800" },
];

function currency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function ProductCardNeon() {
  const [cart, setCart] = useState<number[]>([]);

  return (
    <div className="bg-slate-950 p-6 rounded-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) =>
          p.state === "loading" ? (
            <SkeletonCard key={p.id} />
          ) : (
            <Card key={p.id} product={p} added={cart.includes(p.id)} onAdd={() => setCart((c) => [...c, p.id])} />
          )
        )}
      </div>
    </div>
  );
}

function Card({ product, added, onAdd }: { product: Product; added: boolean; onAdd: () => void }) {
  const onSale = product.state === "on-sale" && product.salePrice !== undefined;
  const outOfStock = product.state === "out-of-stock";

  return (
    <div className="flex flex-col overflow-hidden border border-cyan-500/50 bg-slate-900 rounded-lg text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
      <div className="relative border-b border-cyan-500/40">
        <div role="img" aria-label={product.name} className={`h-32 w-full ${product.swatch}`} />
        {onSale && (
          <span className="absolute left-2 top-2 border border-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded-full text-xs font-semibold text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 border border-slate-500 bg-slate-800 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-300">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-medium text-slate-100">{product.name}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-base font-semibold text-fuchsia-300 drop-shadow-[0_0_6px_rgba(232,121,249,0.8)]">
                <span className="sr-only">Now </span>
                {currency(product.salePrice ?? product.price)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                <span className="sr-only">Was </span>
                {currency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-cyan-200 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              {currency(product.price)}
            </span>
          )}
        </div>

        <div className="mt-3 pt-1">
          {outOfStock ? (
            <button
              disabled
              className="w-full cursor-not-allowed border border-slate-600 bg-slate-800 px-3 py-1.5 rounded-md text-sm font-medium text-slate-500"
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={onAdd}
              disabled={added}
              aria-label={`Add ${product.name} to cart`}
              className={`w-full border px-3 py-1.5 rounded-md text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                added
                  ? "border-fuchsia-400 bg-fuchsia-400/10 text-fuchsia-300 shadow-[0_0_12px_rgba(232,121,249,0.5)]"
                  : "border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.5)] hover:bg-cyan-400/20"
              }`}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden border border-cyan-500/50 bg-slate-900 rounded-lg shadow-[0_0_18px_rgba(34,211,238,0.35)]" aria-hidden="true">
      <div className="h-32 w-full animate-pulse border-b border-cyan-500/40 bg-slate-800" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-700" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-700" />
        <div className="mt-3 h-8 w-full animate-pulse rounded-md bg-slate-700" />
      </div>
    </div>
  );
}
