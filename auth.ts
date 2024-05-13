//this verifies the jwt token
/*
When a JWT token is received (e.g., in a request header), NextAuth triggers the relevant callback functions defined here.
The session callback verifies the token's signature and extracts user information (ID and role) from the claims if available. It then updates the session object with this information.
The jwt callback verifies the token's signature and fetches additional user data (role in this case) from the database if needed. It then enriches the token itself with this information.
Based on the callback results, NextAuth determines if the token is valid and grants access to protected resources accordingly.

*/

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./data/account";

export const { auth, handlers, signIn, signOut } = NextAuth({
  //this
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //allow OAuth without email verification
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    //Its primary function is to populate the session object with relevant user information that can be accessed throughout your application.
    async session({ token, session }) {
      console.log({
        sessionToken: token,
      });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },

    //in this jwt callback we are adding a new field called role in the token using token.role and passing it to the session
    //we are passing name and email from login form but data for type of userRle and id is missing in the session we need to pass it from here.
    async jwt({ token }) {
      //this callback will run first
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.emai = existingUser.email;
      token.role = existingUser.role; //befre token.role was undefinde it is like we are defineing a new variable
      return token; //returns modified token which
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

//sub is an id of token

/*
User visits a protected route in your Next.js application.
The middleware.ts intercepts the request and checks if the user is logged in using NextAuth.
If not logged in and the route is protected, the user is redirected to the login page (/auth/login).
On the login page, the user submits their credentials.
The credentials are sent to the NextAuth provider defined in auth.config.ts.
The authorize function validates the credentials and retrieves the user data from the database.
If successful, NextAuth creates a JWT token containing user information.
The user is redirected back to the originally requested protected route.
Subsequent requests include the JWT token in the request headers.
NextAuth middleware verifies the token and retrieves user data using the callbacks defined in auth.ts.
The application grants access to protected resources based on the user's role (obtained from the token).






*/
