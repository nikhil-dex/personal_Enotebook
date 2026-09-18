import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { findOrCreateUser } from "@/services/users/user.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],

  callbacks: {
    async signIn({ user }) {
      if (!user.id) {
        return false;
      }

      const dbUser = await findOrCreateUser({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      });

      user.id = dbUser._id.toString();

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }

      return session;
    },
  },
});