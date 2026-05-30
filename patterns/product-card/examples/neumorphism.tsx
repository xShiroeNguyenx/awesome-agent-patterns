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
  { id: 1, name: "Canvas Tote", price: 38, state: "default", swatch: "bg-slate-300" },
  { id: 2, name: "Wool Beanie", price: 24, salePrice: 18, state: "on-sale", swatch: "bg-slate-300" },
  { id: 3, name: "Leather Wallet", price: 56, state: "out-of-stock", swatch: "bg-slate-300" },
  { id: 4, name: "Loading", price: 0, state: "loading", swatch: "bg-slate-300" },
];

function currency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function ProductCardNeumorphism() {
  const [cart, setCart] = useState<number[]>([]);

  return (
    <div className="bg-slate-200 p-6 rounded-3xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="flex flex-col bg-slate-200 rounded-2xl p-3 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]">
      <div className="relative">
        <div
          role="img"
          aria-label={product.name}
          className={`h-32 w-full rounded-2xl ${product.swatch} shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]`}
        />
        {onSale && (
          <span className="absolute left-2 top-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-700 shadow-[3px_3px_6px_#b0b6c0,-3px_-3px_6px_#ffffff]">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 bg-slate-200 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-600 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="text-sm font-semibold text-slate-700">{product.name}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-base font-semibold text-slate-700">
                <span className="sr-only">Now </span>
                {currency(product.salePrice ?? product.price)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                <span className="sr-only">Was </span>
                {currency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-semibold text-slate-700">{currency(product.price)}</span>
          )}
        </div>

        <div className="mt-3 pt-1">
          {outOfStock ? (
            <button
              disabled
              className="w-full cursor-not-allowed bg-slate-200 px-3 py-1.5 rounded-2xl text-sm font-semibold text-slate-400 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={onAdd}
              disabled={added}
              aria-label={`Add ${product.name} to cart`}
              className={`w-full bg-slate-200 px-3 py-1.5 rounded-2xl text-sm font-semibold text-slate-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                added
                  ? "shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
                  : "shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]"
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
    <div className="bg-slate-200 rounded-2xl p-3 shadow-[6px_6px_12px_#b0b6c0,-6px_-6px_12px_#ffffff]" aria-hidden="true">
      <div className="h-32 w-full animate-pulse rounded-2xl bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]" />
      <div className="space-y-2 pt-3">
        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-slate-200 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]" />
        <div className="h-4 w-1/3 animate-pulse rounded-lg bg-slate-200 shadow-[inset_3px_3px_6px_#b0b6c0,inset_-3px_-3px_6px_#ffffff]" />
        <div className="mt-3 h-8 w-full animate-pulse rounded-2xl bg-slate-200 shadow-[inset_6px_6px_12px_#b0b6c0,inset_-6px_-6px_12px_#ffffff]" />
      </div>
    </div>
  );
}
