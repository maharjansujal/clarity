import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { pool } from "@/lib/db";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const client = await pool.connect();
        try {
          const res = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );
          const user = res.rows[0];
          if (!user) return null;

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;

          // Return what NextAuth stores in session
          return { id: user.id, email: user.email };
        } finally {
          client.release();
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
