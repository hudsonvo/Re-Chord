import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
        Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1 OR username = $1",
          [credentials.identifier]
        );

        const user = result.rows[0];
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email, name: user.display_name };
      },
    }),
  ],
});
