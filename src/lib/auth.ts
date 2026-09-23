import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { customers, adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    /* Google provider only if credentials are set */
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        })]
      : []),
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Check admin users FIRST (they have elevated permissions)
        const admin = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.email, email),
        });

        if (admin && admin.password_hash) {
          const isValid = await bcrypt.compare(password, admin.password_hash);
          if (isValid) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.email,
              role: admin.role || "support",
              isAdmin: true
            };
          }
        }

        // Check customer (only if not an admin)
        const customer = await db.query.customers.findFirst({
          where: eq(customers.email, email),
        });

        if (customer && customer.password_hash) {
          const isValid = await bcrypt.compare(password, customer.password_hash);
          if (isValid) {
            return {
              id: customer.id,
              email: customer.email,
              name: customer.name,
              role: customer.role || "customer",
              isAdmin: false
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "customer";
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
});