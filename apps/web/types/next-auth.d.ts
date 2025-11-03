/**
 * NextAuth.js Type Extensions
 * Extends default types with our custom user fields
 */

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      hasCompletedOnboarding: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    hasCompletedOnboarding: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    hasCompletedOnboarding: boolean;
  }
}

