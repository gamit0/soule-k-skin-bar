// Datos de prueba — isMock: true en todos. Se reemplazan por productos
// reales cargados desde el admin panel (Fase 8) o el schema de DB (Fase 3).

export type MockProduct = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  routineStep: "cleanser" | "serum" | "moisturizer" | "sunscreen" | "treatment";
  isMock: true;
};

export const mockFeaturedProducts: MockProduct[] = [
  {
    slug: "gentle-gel-cleanser",
    name: "Gentle Gel Cleanser",
    brand: "Soule Lab",
    price: 320,
    routineStep: "cleanser",
    isMock: true,
  },
  {
    slug: "hyaluronic-serum",
    name: "Hyaluronic Serum",
    brand: "Soule Lab",
    price: 480,
    routineStep: "serum",
    isMock: true,
  },
  {
    slug: "barrier-repair-cream",
    name: "Barrier Repair Cream",
    brand: "Soule Lab",
    price: 550,
    routineStep: "moisturizer",
    isMock: true,
  },
  {
    slug: "daily-spf-50",
    name: "Daily SPF 50",
    brand: "Soule Lab",
    price: 390,
    routineStep: "sunscreen",
    isMock: true,
  },
];
