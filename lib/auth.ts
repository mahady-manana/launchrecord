import crypto from "crypto";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/utils/password";
import { sanitizeText } from "@/utils/sanitize";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = sanitizeText(credentials?.email || "").toLowerCase();
      const password = credentials?.password || "";

      if (!email || !password) {
        throw new Error("Missing email or password");
      }

      await connectToDatabase();
      const user = await User.findOne({ email, deletedAt: null }).select(
        "+password",
      );

      if (!user || !user.password) {
        throw new Error("Invalid email or password");
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      // Check if email is verified (skip for admin users)
      if (!user.emailVerified && user.role !== "admin") {
        throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email ? user.email.toLowerCase() : "";
      if (!email) {
        return false;
      }

      await connectToDatabase();
      const existingUser = await User.findOne({ email, deletedAt: null });

      if (!existingUser) {
        const randomPassword = crypto.randomBytes(32).toString("hex");
        await User.create({
          name: user.name || "User",
          email,
          password: await hashPassword(randomPassword),
          role: "user",
          provider: "google",
          providerId: account.providerAccountId,
          emailVerified: new Date(),
        });
      } else if (!existingUser.provider || existingUser.provider === "credentials") {
        existingUser.provider = "google";
        existingUser.providerId = account.providerAccountId;
        if (!existingUser.emailVerified) {
          existingUser.emailVerified = new Date();
        }
        await existingUser.save();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({
          email: user.email.toLowerCase(),
          deletedAt: null,
        });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          return token;
        }
      }

      if (user?.id) {
        token.id = user.id;
        token.role = (user as { role?: "user" | "admin" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
