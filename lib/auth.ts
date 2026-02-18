import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
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

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName ?? ""}`.trim()
            : user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        // Load additional user data
        const dbUser = await db.user.findUnique({
          where: { id: user.id as string },
          select: {
            defaultAccount: true,
            isFirstLogin: true,
            planner: { select: { id: true } },
            vendor: { select: { id: true } },
            storyteller: { select: { id: true } },
          },
        });

        if (dbUser) {
          token.defaultAccount = dbUser.defaultAccount;
          token.isFirstLogin = dbUser.isFirstLogin;
          token.plannerId = dbUser.planner?.id ?? null;
          token.vendorId = dbUser.vendor?.id ?? null;
          token.storytellerId = dbUser.storyteller?.id ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.defaultAccount = token.defaultAccount as ("planner" | "storyteller" | "vendor") | null;
        session.user.isFirstLogin = token.isFirstLogin as boolean;
        session.user.plannerId = token.plannerId as number | null;
        session.user.vendorId = token.vendorId as number | null;
        session.user.storytellerId = token.storytellerId as number | null;
      }
      return session;
    },
  },
});
