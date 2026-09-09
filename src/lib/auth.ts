import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/client";
import { customers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // Placeholder de credenciales — para producción real conviene resolver
    // contra un hash de password (no implementado: definir estrategia de
    // password storage antes de habilitar este provider en prod).
    Credentials({
      credentials: { email: { label: "Email" } },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        if (!email) return null;
        const customer = await db.query.customers.findFirst({
          where: eq(customers.email, email),
        });
        if (!customer) return null;
        return { id: customer.id, email: customer.email, name: customer.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
