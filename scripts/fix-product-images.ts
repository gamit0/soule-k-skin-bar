import { db } from "../src/lib/db/client";
import { productImages, products } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function main() {
  const imagesDir = path.join(process.cwd(), "public", "products");
  const files = fs.readdirSync(imagesDir);

  console.log(`Found ${files.length} images in ${imagesDir}`);

  for (const file of files) {
    const ext = path.extname(file);
    const slug = path.basename(file, ext);
    const url = `/products/${file}`;

    console.log(`Updating image for slug: ${slug} -> ${url}`);

    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (product) {
      // Delete existing images to avoid duplicates
      await db.delete(productImages).where(eq(productImages.productId, product.id));

      // Insert new local image
      await db.insert(productImages).values({
        productId: product.id,
        url: url,
        order: 0,
      });
      console.log(`Successfully updated ${slug}`);
    } else {
      console.warn(`Product not found for slug: ${slug}`);
    }
  }
  console.log("Image update complete!");
}

main().catch(console.error);
