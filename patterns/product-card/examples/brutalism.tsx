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
  { id: 1, name: "Canvas Tote", price: 38, state: "default", swatch: "bg-cyan-300" },
  { id: 2, name: "Wool Beanie", price: 24, salePrice: 18, state: "on-sale", swatch: "bg-lime-300" },
  { id: 3, name: "Leather Wallet", price: 56, state: "out-of-stock", swatch: "bg-pink-400" },
  { id: 4, name: "Loading", price: 0, state: "loading", swatch: "bg-slate-300" },
];

function currency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function ProductCardBrutalism() {
  const [cart, setCart] = useState<number[]>([]);

  return (
    <div className="bg-yellow-50 p-5">
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
    <div className="flex flex-col overflow-hidden border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]">
      <div className="relative border-b-2 border-black">
        <div role="img" aria-label={product.name} className={`h-32 w-full ${product.swatch}`} />
        {onSale && (
          <span className="absolute left-2 top-2 border-2 border-black bg-pink-400 px-2 py-0.5 text-xs font-extrabold uppercase tracking-tight text-black shadow-[2px_2px_0_0_#000]">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 border-2 border-black bg-slate-300 px-2 py-0.5 text-xs font-extrabold uppercase tracking-tight text-black shadow-[2px_2px_0_0_#000]">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm font-extrabold uppercase tracking-tight text-black">{product.name}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-base font-extrabold text-black">
                <span className="sr-only">Now </span>
                {currency(product.salePrice ?? product.price)}
              </span>
              <span className="text-sm font-bold text-black/60 line-through">
                <span className="sr-only">Was </span>
                {currency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-extrabold text-black">{currency(product.price)}</span>
          )}
        </div>

        <div className="mt-3 pt-1">
          {outOfStock ? (
            <button
              disabled
              className="w-full cursor-not-allowed border-2 border-black bg-slate-200 rounded-none px-3 py-1.5 text-sm font-bold text-black/40"
            >
              Out of stock
            </button>
          ) : (
            <button
              onClick={onAdd}
              disabled={added}
              aria-label={`Add ${product.name} to cart`}
              className={`w-full border-2 border-black rounded-none px-3 py-1.5 text-sm font-bold text-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                added
                  ? "bg-lime-300 shadow-[2px_2px_0_0_#000]"
                  : "bg-yellow-300 shadow-[4px_4px_0_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000]"
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
    <div className="overflow-hidden border-2 border-black bg-white rounded-none shadow-[6px_6px_0_0_#000]" aria-hidden="true">
      <div className="h-32 w-full animate-pulse border-b-2 border-black bg-slate-300" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse border-2 border-black bg-slate-300" />
        <div className="h-4 w-1/3 animate-pulse border-2 border-black bg-slate-300" />
        <div className="mt-3 h-8 w-full animate-pulse border-2 border-black bg-slate-300" />
      </div>
    </div>
  );
}
