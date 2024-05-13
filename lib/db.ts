import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

//hot reload refers to the fast refresh that automatically update the browser window
//due to hot reload of the nextjs a new instance of prisma client might be created and this can cause to memory leak thats why we use globalthis so its only be created at the start of the application
