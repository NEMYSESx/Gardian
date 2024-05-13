import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const POST = async (req: NextRequest): Promise<void | Response> => {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
      // If sign-in is successful, return void since there's no need for response
      return;
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            // If it's a credentials signin error, return appropriate error response
            return new Response(
              JSON.stringify({ error: "Invalid credentials" }),
              {
                status: 401,
              }
            );
          default:
            // For other types of errors, return a generic error response
            return new Response(
              JSON.stringify({ error: "Something went wrong" }),
              {
                status: 500,
              }
            );
        }
      }
      // If it's not an AuthError, rethrow the error for handling elsewhere
      throw error;
    }
  } catch (error) {
    // Catch any JSON parsing errors and return a 401 Unauthorized response
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 401,
    });
  }
};
