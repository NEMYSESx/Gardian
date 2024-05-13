import bcrypt from "bcryptjs";

import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas/validation";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data; // When you use Zod validation, after validating the data against a schema, you can access the validated data using the .data property of the validation result.
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user; //we are returning the user because Once NextAuth verifies the user's credentials and determines that they are authenticated, it creates a session for that user. This session typically contains information about the authenticated user, such as their user ID, email, and any additional relevant data.This returned user object acts as a signal to NextAuth. When NextAuth receives a user object from the authorize function, it understands that the user has been successfully authenticated.
          //NextAuth then takes over the process of creating a JWT token. The specific details of what information gets included in the token depend on your configuration, but it typically includes the user's ID, email address, and any other relevant user data you choose to store.
          //Additionally, NextAuth signs the JWT token using a secret key configured in your NextAuth settings. This signature ensures the token's integrity and prevents tampering.
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
