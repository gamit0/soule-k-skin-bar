import type { products } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof products>;

export function RoutineList({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-plum-ink">
        {title}
      </h2>
      <ol className="mt-4 space-y-3">
        {products.map((product, i) => (
          <li key={product.id} className="flex items-baseline gap-3">
            <span className="text-sm text-gold">{i + 1}</span>
            <div>
              <p className="text-plum-ink">{product.name}</p>
              <p className="text-xs text-plum-ink/50">{product.brand}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
