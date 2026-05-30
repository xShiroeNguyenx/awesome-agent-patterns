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
  { id: 1, name: "Canvas Tote", price: 38, state: "default", swatch: "bg-sky-200" },
  { id: 2, name: "Wool Beanie", price: 24, salePrice: 18, state: "on-sale", swatch: "bg-slate-300" },
  { id: 3, name: "Leather Wallet", price: 56, state: "out-of-stock", swatch: "bg-amber-200" },
  { id: 4, name: "Loading", price: 0, state: "loading", swatch: "bg-slate-200" },
];

function currency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function ProductCardExample() {
  const [cart, setCart] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PRODUCTS.map((p) =>
        p.state === "loading" ? (
          <SkeletonCard key={p.id} />
        ) : (
          <Card key={p.id} product={p} added={cart.includes(p.id)} onAdd={() => setCart((c) => [...c, p.id])} />
        )
      )}
    </div>
  );
}

function Card({ product, added, onAdd }: { product: Product; added: boolean; onAdd: () => void }) {
  const onSale = product.state === "on-sale" && product.salePrice !== undefined;
  const outOfStock = product.state === "out-of-stock";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative">
        <div role="img" aria-label={product.name} className={`h-32 w-full ${product.swatch}`} />
        {onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-slate-700 px-2 py-0.5 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-medium text-slate-900">{product.name}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-base font-semibold text-rose-700">
                <span className="sr-only">Now </span>
                {currency(product.salePrice ?? product.price)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                <span className="sr-only">Was </span>
                {currency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-slate-900">{currency(product.price)}</span>
          )}
        </div>

        <div className="mt-3 pt-1">
          {outOfStock ? (
            <button
              disabled
              className="w-full cursor-not-allowed rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-400"
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={onAdd}
              disabled={added}
              aria-label={`Add ${product.name} to cart`}
              className={`w-full rounded-md px-3 py-1.5 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                added ? "bg-emerald-600" : "bg-sky-600 hover:bg-sky-700"
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white" aria-hidden="true">
      <div className="h-32 w-full animate-pulse bg-slate-200" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-full animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
