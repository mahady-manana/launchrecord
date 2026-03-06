import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { hashPassword, verifyPassword } from "@/utils/password";
import { sanitizeText } from "@/utils/sanitize";
import crypto from "crypto";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      signup: { label: "Signup", type: "text" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      console.log("====================================");
      console.log({ credentials });
      console.log("====================================");
      const email = sanitizeText(credentials?.email || "").toLowerCase();
      const password = credentials?.password || "";

      if (!email || !password) {
        throw new Error("Missing email or password");
      }

      let user;

      if (credentials?.signup === "true" && credentials.email) {
        const existingUser = await User.findOne({
          email: credentials.email,
          deletedAt: null,
        });
        if (existingUser?._id) {
          throw new Error("Email already used");
        }
        const newuser = new User({
          email: credentials.email,
          name: credentials.name,
          password: await hashPassword(credentials.password),
        });
        await newuser.save();

        user = {
          id: newuser._id.toString(),
          name: newuser.name,
          email: newuser.email,
          role: "user",
        };
      } else {
        await connectToDatabase();
        const dbUser = await User.findOne({ email, deletedAt: null }).select(
          "+password",
        );

        if (!dbUser || !dbUser.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(password, dbUser.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified (skip for admin users)
        if (!dbUser.emailVerified && dbUser.role !== "admin") {
          throw new Error(
            "Please verify your email before signing in. Check your inbox for the verification link.",
          );
        }

        user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        };
      }

      return user;
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
      } else if (
        !existingUser.provider ||
        existingUser.provider === "credentials"
      ) {
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
