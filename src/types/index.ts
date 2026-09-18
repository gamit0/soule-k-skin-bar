// ── Core Enums & Types ───────────────────────────────────────────────────

export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive" | "all";
export type Concern =
  | "acne"
  | "darkSpots"
  | "dehydration"
  | "aging"
  | "texture"
  | "dullness"
  | "pores"
  | "oiliness"
  | "sensitive"
  | "redness"
  | "sunProtection";

export type RoutineStep =
  | "cleanser"
  | "toner"
  | "exfoliant"
  | "serum"
  | "treatment"
  | "moisturizer"
  | "eye_cream"
  | "special_care"
  | "sunscreen";

export type RoutineUsage = "AM" | "PM" | "BOTH";
export type SkinMood = "Calm" | "Glow" | "Clean" | "Hydrated" | "Firm";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
export type AdminRole = "super_admin" | "editor" | "support";

// ── Domain Entities ─────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  categoryId?: string;
  skinTypes: (SkinType | string)[];
  concerns: (Concern | string)[];
  ingredients: string[];
  benefits: string[];
  routineStep: RoutineStep | string;
  usage: RoutineUsage;
  stock: number;
  inStock?: boolean;
  active: boolean;
  isMock?: boolean;
  sourcePage?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  order: number;
}

export interface Shot {
  id: string;
  slug: string;
  name: string;
  menuTitle: string;
  subtitle: string;
  category: string;
  description: string;
  icon: string;
  mood: SkinMood | string;
  concerns: string[];
  skinTypes: string[];
  productIds: string[];
  products?: Product[];
  totalPrice?: number;
  active: boolean;
}

export interface CocktailStep {
  stepNumber: number;
  stepType: "LIMPIA" | "PREPARA" | "TRATA" | "PROTEGE" | string;
  productId: string;
  usage: RoutineUsage;
}

export interface Cocktail {
  id: string;
  slug: string;
  name: string;
  menuTitle?: string;
  subtitle?: string;
  icon?: string;
  image?: string;
  description?: string;
  shortDescription?: string;
  mood?: SkinMood | string;
  concerns: (Concern | string)[];
  skinTypes: (SkinType | string)[];
  productIds?: string[];
  products?: Product[];
  steps?: CocktailStep[];
  totalPrice?: number;
  active: boolean;
  createdAt?: Date;
}

export interface CocktailProduct {
  cocktailId: string;
  productId: string;
  routine: RoutineUsage;
  order: number;
}

export interface QuizOption {
  id: string;
  questionId: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  shotWeights?: Record<string, number>; // e.g. { "shot-ojos-fresh": 3, "shot-hidra-power": 5 }
  moodWeights?: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  text?: string;
  type: "single" | "multi";
  active: boolean;
  options: QuizOption[];
  condition?: {
    questionId: string;
    optionValue: string;
  };
}

export interface QuizAnswer {
  questionId: string;
  optionIds: string[];
}

export interface QuizResponse {
  id: string;
  customerId?: string;
  sessionId: string;
  answers: Record<string, string[]>; // { questionId: optionId[] }
  createdAt: Date;
}

export interface RecommendationResult {
  id: string;
  quizResponseId?: string;
  primaryShot: Shot;
  secondaryShot?: Shot;
  recommendedCocktail?: Cocktail;
  skinMood: SkinMood;
  matchScore: number;
  scoreBreakdown: Record<string, number>;
  amRoutine: Product[];
  pmRoutine: Product[];
  personalizedMessage: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  authProviderId?: string;
  skinType?: SkinType;
  concerns: Concern[];
  lastPurchaseAt?: Date;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId?: string;
  guestEmail?: string;
  guestPhone?: string;
  customerName?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  notes?: string;
  paymentStatus: string;
  paymentProviderRef?: string;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  product?: Product;
  shotId?: string;
  shot?: Shot;
  cocktailId?: string;
  cocktail?: Cocktail;
  quantity: number;
  unitPrice: number;
}

// ── Recommendation Engine Interface ────────────────────────────────────────

export interface RecommendationEngine {
  recommend(answers: QuizAnswer[]): Promise<RecommendationResult>;
}
