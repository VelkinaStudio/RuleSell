import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { rateLimitAuth } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Rate limit: 5 attempts per 15 minutes per email
        const rl = await rateLimitAuth(`login:${email.toLowerCase()}`);
        if (!rl.ok) {
          throw new Error("Too many login attempts. Try again in 15 minutes.");
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Block unverified email login (OAuth users skip this — they use provider callbacks)
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
        };
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            role: true,
            sellerStatus: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.role = dbUser.role ?? "USER";
          token.sellerStatus = dbUser.sellerStatus ?? "NONE";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.sellerStatus = (token.sellerStatus as string) ?? "NONE";
      }
      return session;
    },
  },
});
