import { db } from "../src/lib/db/client";
import { productImages, products } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const imagesToUpdate = [
  {
    slug: "anua-heartleaf-quercetinol-pore-deep-cleansing-foam",
    url: "https://theskincarelibrary.com/cdn/shop/files/Anua_Heartleaf_Quercetinol_Pore_Deep_Cleansing_Foam_New_Packaging_TSCL_Photo_1024x.png?v=1748980412",
  },
  {
    slug: "beauty-of-joseon-green-plum-refreshing-cleanser",
    url: "https://www.shopmissa.com/cdn/shop/files/BOJ_GreenPlumRefreshingCleanser_Main.jpg?v=1761338859",
  },
  {
    slug: "cosrx-low-ph-good-morning-gel-cleanser",
    url: "https://cdn11.bigcommerce.com/s-hwo2s3k4l6/images/stencil/1280x1280/products/180/466/COSRX_Low_pH_Good_Morning_Gel_Cleanser_KBeauty_Australia__59171.1656446669.jpg?c=2",
  },
  {
    slug: "haruharu-wonder-black-rice-moisture-cleansing-oil",
    url: "https://static.sweetcare.com/img/prd/488/v-638845462851194079/haruharu-wonder-024588a3_01.jpg",
  },
  {
    slug: "skin1004-madagascar-centella-ampoule",
    url: "https://cdn11.bigcommerce.com/s-hwo2s3k4l6/images/stencil/1280x1280/products/339/1263/SKIN1004_Madagascar_Centella_Ampoule_100_mL_KBeauty_Australia__93954.1682085405.jpg?c=2",
  },
  {
    slug: "beauty-of-joseon-glow-deep-serum",
    url: "https://static.sweetcare.com/img/prd/488/v-638233396300406846/beauty-of-joseon-017849bj_01.jpg",
  },
  {
    slug: "cosrx-advanced-snail-96-mucin-power-essence",
    url: "https://www.cosrx.com/cdn/shop/products/Snail96_1_1024x.jpg",
  },
  {
    slug: "skin1004-madagascar-centella-hyalu-cica-water-fit-sun-serum",
    url: "https://theskincarelibrary.com/cdn/shop/files/Skin1004CentellaHyalu-CicaWater-FitSunSerum_1024x.png?v=1702982609",
  },
];

async function main() {
  console.log("Updating product images...");
  for (const item of imagesToUpdate) {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, item.slug),
    });

    if (product) {
      console.log(`Updating images for ${item.slug}...`);
      await db.delete(productImages).where(eq(productImages.productId, product.id));
      await db.insert(productImages).values({
        productId: product.id,
        url: item.url,
        order: 0,
      });
    } else {
      console.warn(`Product not found: ${item.slug}`);
    }
  }
  console.log("Update complete!");
}

main().catch(console.error);
