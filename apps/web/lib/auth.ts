/**
 * NextAuth.js Configuration
 * Handles authentication with email/password and OAuth providers
 */

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Check COPPA compliance for minors
        if (user.isMinor && !user.coppaCompliant) {
          throw new Error("Parental consent required");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Apple OAuth (for Sign in with Apple)
    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID || "",
    //   clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    // }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/welcome", // Redirect to onboarding
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // For OAuth, check if user needs age verification
      if (account?.provider !== "credentials") {
        // Create user record if first time
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // New OAuth user - will need to complete profile
          return true;
        }

        // Check COPPA compliance
        if (existingUser.isMinor && !existingUser.coppaCompliant) {
          return "/auth/parental-consent-required";
        }
      }

      return true;
    },
  },

  events: {
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
      // Could send welcome email here
    },
    async signIn({ user, isNewUser }) {
      console.log(`User signed in: ${user.email}`);
      if (isNewUser) {
        // Track signup event
        await prisma.event.create({
          data: {
            type: "account.created",
            userId: user.id,
            sessionId: `signup_${Date.now()}`,
            surface: "web",
            metadata: {
              provider: "email",
              isSimulated: false,
            },
          },
        });
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
};

