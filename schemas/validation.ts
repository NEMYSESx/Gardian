import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingSchema = z
  .object({
    name: z.optional(z.string()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "password is required!",
      path: ["Password"],
    }
  );

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "please add an valid email address sirrr!!" }),
  password: z.string(),
});
export const ResetSchema = z.object({
  email: z
    .string()
    .email({ message: "please add an valid email address sirrr!!" }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Nmae is required" }),
  email: z
    .string()
    .email({ message: "please add an valid email address sirrr!!" }),
  password: z.string().min(6, { message: "enter atleat 6 characters" }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimun 6 character required",
  }),
});
