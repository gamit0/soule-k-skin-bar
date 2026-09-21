import {
  pgTable,
  uuid,
  text,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────

export const skinTypeEnum = pgEnum("skin_type", [
  "dry",
  "oily",
  "combination",
  "normal",
  "sensitive",
]);

export type SkinType = (typeof skinTypeEnum.enumValues)[number];

export const concernEnum = pgEnum("concern", [
  "acne",
  "darkSpots",
  "dehydration",
  "aging",
  "texture",
  "dullness",
  "pores",
  "oiliness",
  "sensitive",
  "redness",
]);

export const routineStepEnum = pgEnum("routine_step", [
  "cleanser",
  "toner",
  "serum",
  "eye_cream",
  "moisturizer",
  "sunscreen",
  "treatment",
  "special_care",
]);

export const routineUsageEnum = pgEnum("routine_usage", ["AM", "PM", "BOTH"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "editor",
  "support",
]);

// ── Core catalog ───────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  brand: varchar("brand", { length: 120 }).notNull(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 280 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  categoryId: uuid("category_id").references(() => categories.id),
  skinTypes: skinTypeEnum("skin_types").array().notNull().default([]),
  concerns: concernEnum("concerns").array().notNull().default([]),
  ingredients: text("ingredients").array().notNull().default([]),
  benefits: text("benefits").array().notNull().default([]),
  routineStep: routineStepEnum("routine_step").notNull(),
  usage: routineUsageEnum("usage").notNull().default("BOTH"),
  stock: integer("stock").notNull().default(0),
  active: boolean("active").notNull().default(true),
  // Marca explícita de datos de prueba — se debe poder filtrar en producción.
  isMock: boolean("is_mock").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
});

// ── Cocktails ──────────────────────────────────────────────────────────

export const cocktails = pgTable("cocktails", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  icon: varchar("icon", { length: 60 }),
  image: text("image"),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 280 }),
  concerns: concernEnum("concerns").array().notNull().default([]),
  skinTypes: skinTypeEnum("skin_types").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cocktailProducts = pgTable(
  "cocktail_products",
  {
    cocktailId: uuid("cocktail_id")
      .notNull()
      .references(() => cocktails.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    routine: routineUsageEnum("routine").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.cocktailId, t.productId, t.routine] })],
);

// ── Skin Quiz ──────────────────────────────────────────────────────────

export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  order: integer("order").notNull().default(0),
  text: varchar("text", { length: 280 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("single"), // "single" | "multi"
  active: boolean("active").notNull().default(true),
});

export const quizOptions = pgTable("quiz_options", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 160 }).notNull(),
  value: varchar("value", { length: 60 }).notNull(),
});

// ── Shots ────────────────────────────────────────────────────────────────

export const shots = pgTable("shots", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  menuTitle: varchar("menu_title", { length: 160 }),
  subtitle: varchar("subtitle", { length: 280 }),
  category: varchar("category", { length: 120 }),
  description: text("description"),
  icon: varchar("icon", { length: 60 }),
  mood: varchar("mood", { length: 20 }).notNull(), // SkinMood: Calm, Glow, Clean, Hydrated, Firm
  concerns: concernEnum("concerns").array().notNull().default([]),
  skinTypes: skinTypeEnum("skin_types").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shotProducts = pgTable(
  "shot_products",
  {
    shotId: uuid("shot_id")
      .notNull()
      .references(() => shots.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.shotId, t.productId] })],
);

// Peso de cada opción hacia cada shot — el corazón del scoring engine.
export const quizOptionWeights = pgTable(
  "quiz_option_weights",
  {
    optionId: uuid("option_id")
      .notNull()
      .references(() => quizOptions.id, { onDelete: "cascade" }),
    shotId: uuid("shot_id")
      .notNull()
      .references(() => shots.id, { onDelete: "cascade" }),
    weight: integer("weight").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.optionId, t.shotId] })],
);

// ── Customers & Recommendations ───────────────────────────────────────

export const customers = pgTable("customers", {
  role: varchar("role", { length: 20 })
    .notNull()
    .default("customer"),
  password_hash: varchar("password_hash", { length: 191 })
    .notNull()
    .default(''),

  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }),
  email: varchar("email", { length: 200 }).unique(),
  phone: varchar("phone", { length: 40 }),
  authProviderId: varchar("auth_provider_id", { length: 200 }),
  skinType: skinTypeEnum("skin_type"),
  concerns: concernEnum("concerns").array().notNull().default([]),
  lastPurchaseAt: timestamp("last_purchase_at"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: numeric("total_spent", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizResponses = pgTable("quiz_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  sessionId: varchar("session_id", { length: 120 }).notNull(),
  answers: jsonb("answers").notNull(), // { questionId: optionId[] }
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recommendationResults = pgTable("recommendation_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizResponseId: uuid("quiz_response_id")
    .notNull()
    .references(() => quizResponses.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").references(() => customers.id),
  primaryCocktailId: uuid("primary_cocktail_id").references(
    () => cocktails.id,
  ),
  secondaryCocktailId: uuid("secondary_cocktail_id").references(
    () => cocktails.id,
  ),
  scoreBreakdown: jsonb("score_breakdown").notNull(), // { cocktailId: percentage }
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Commerce ───────────────────────────────────────────────────────────

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull(), // "percent" | "fixed"
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp("expires_at"),
  usageLimit: integer("usage_limit"),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Nullable: soporta checkout como invitado (ver decisión de producto en README).
  customerId: uuid("customer_id").references(() => customers.id),
  guestEmail: varchar("guest_email", { length: 200 }),
  guestPhone: varchar("guest_phone", { length: 40 }),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  couponId: uuid("coupon_id").references(() => coupons.id),
  paymentStatus: varchar("payment_status", { length: 40 })
    .notNull()
    .default("unpaid"),
  paymentProviderRef: varchar("payment_provider_ref", { length: 200 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  cocktailId: uuid("cocktail_id").references(() => cocktails.id),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const wishlists = pgTable(
  "wishlists",
  {
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.customerId, t.productId] })],
);

// ── Admin ──────────────────────────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  role: adminRoleEnum("role").notNull().default("support"),
  password_hash: varchar("password_hash", { length: 191 }),
  authProviderId: varchar("auth_provider_id", { length: 200 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Relations (para drizzle "query" API con joins tipados) ─────────────

import { relations } from "drizzle-orm";

export const productsRelations = relations(products, ({ many, one }) => ({
  images: many(productImages),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  cocktailLinks: many(cocktailProducts),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const cocktailsRelations = relations(cocktails, ({ many }) => ({
  productLinks: many(cocktailProducts),
}));

export const cocktailProductsRelations = relations(
  cocktailProducts,
  ({ one }) => ({
    cocktail: one(cocktails, {
      fields: [cocktailProducts.cocktailId],
      references: [cocktails.id],
    }),
    product: one(products, {
      fields: [cocktailProducts.productId],
      references: [products.id],
    }),
  }),
);

export const quizQuestionsRelations = relations(quizQuestions, ({ many }) => ({
  options: many(quizOptions),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one, many }) => ({
  question: one(quizQuestions, {
    fields: [quizOptions.questionId],
    references: [quizQuestions.id],
  }),
  weights: many(quizOptionWeights),
}));

export const quizOptionWeightsRelations = relations(
  quizOptionWeights,
  ({ one }) => ({
    option: one(quizOptions, {
      fields: [quizOptionWeights.optionId],
      references: [quizOptions.id],
    }),
    shot: one(shots, {
      fields: [quizOptionWeights.shotId],
      references: [shots.id],
    }),
  }),
);

export const shotsRelations = relations(shots, ({ many }) => ({
  productLinks: many(shotProducts),
  optionWeights: many(quizOptionWeights),
}));

export const shotProductsRelations = relations(
  shotProducts,
  ({ one }) => ({
    shot: one(shots, {
      fields: [shotProducts.shotId],
      references: [shots.id],
    }),
    product: one(products, {
      fields: [shotProducts.productId],
      references: [products.id],
    }),
  }),
);

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  cocktail: one(cocktails, {
    fields: [orderItems.cocktailId],
    references: [cocktails.id],
  }),
}));

// ── Analytics (Fase 12) ─────────────────────────────────────────────────

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "page_view",
  "quiz_started",
  "quiz_completed",
  "recommendation_received",
  "product_viewed",
  "add_to_cart",
  "checkout_started",
  "purchase_completed",
  "whatsapp_click",
  "instagram_click",
]);

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: analyticsEventTypeEnum("type").notNull(),
  sessionId: varchar("session_id", { length: 120 }).notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
