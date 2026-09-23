// NextAuth Type Augmentation
// This file extends the default NextAuth types to include our custom fields

import "next-auth";
import { AdminRole } from "./index";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: AdminRole | "customer";
      isAdmin: boolean;
    };
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `authorize` callback, or the `user` object returned by the
   * `authorize` callback.
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: AdminRole | "customer";
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    role: AdminRole | "customer";
    isAdmin: boolean;
  }
}