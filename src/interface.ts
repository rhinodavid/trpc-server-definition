import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { defineQueryProcedure, defineRouter } from "./defUtils";

/**
 * This file defines the router used in src/server.ts.
 */

interface TMeta {
  hasAuth: boolean;
}

interface TContext {
  httpVersion: string;
  userName: string;
}

interface TErrorData {
  code: TRPC_ERROR_CODE_KEY;
  httpStatus: number;
  howMad: "mid" | "big";
}

/**
 * The definition of the router, created
 * independently of the implementation.
 */
export type TAppRouter = defineRouter<
  {
    greet: defineQueryProcedure<string, { greeting: string }>;
    protectedGreet: defineQueryProcedure<string, { greeting: string }>;
  },
  TContext,
  TMeta,
  TErrorData
>;
