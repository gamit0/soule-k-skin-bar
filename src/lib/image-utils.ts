const FALLBACK_IMAGES: Record<string, string> = {
  "anua-heartleaf-quercetinol-pore-deep-cleansing-foam-150-ml": "/products/anua-heartleaf-quercetinol-pore-deep-cleansing-foam-150-ml.webp",
  "beauty-of-joseon-green-plum-refreshing-cleanser-100-ml": "/products/beauty-of-joseon-green-plum-refreshing-cleanser-100-ml.webp",
  "cosrx-low-ph-good-morning-gel-cleanser-150-ml": "/products/cosrx-low-ph-good-morning-gel-cleanser-150-ml.webp",
  "dr-althea-balsamo-limpiador-pure-grinding-cleansing-balm-50-ml": "/products/dr-althea-balsamo-limpiador-pure-grinding-cleansing-balm-50-ml.jpg",
  "etude-espuma-limpiadora-soon-jung-whip-cleanser-renewal-150-ml": "/products/etude-espuma-limpiadora-soon-jung-whip-cleanser-renewal-150-ml.webp",
  "haruharu-wonder-gel-limpiador-black-rice-moisture-55-soft-cleansing-gel-100-ml": "/products/haruharu-wonder-gel-limpiador-black-rice-moisture-55-soft-cleansing-gel-100-ml.avif",
  "anua-aceite-limpiador-heartleaf-pore-control-200-ml": "/products/anua-aceite-limpiador-heartleaf-pore-control-200-ml.webp",
};

export function resolveProductImage(product: { slug?: string; image?: string }) {
  // 1. Check if we have a local fallback for this slug
  if (product.slug && FALLBACK_IMAGES[product.slug]) {
    return FALLBACK_IMAGES[product.slug];
  }

  // 2. If the image is already a valid URL/path and not "SK", use it
  if (product.image && product.image !== "SK" && (product.image.startsWith("http") || product.image.startsWith("/"))) {
    return product.image;
  }

  // 3. Absolute fallback
  return "https://images.unsplash.com/photo-1556228578-07257739599a?w=600";
}
