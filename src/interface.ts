import { Simplify } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { defineQueryProcedure, defineRouter } from "./defUtils";

/**
 * This file defines the router used in the application.
 *
 * This file could be published for external clients to use
 * while maintaing the server implementation private.
 */

/**
 * Define the RPC setup for the app
 */
interface TTrpcSetup {
  ctx: {
    httpVersion: string;
    userName: string;
  };
  meta: { hasAuth: boolean };
  errorData: {
    code: TRPC_ERROR_CODE_KEY;
    httpStatus: number;
    howMad: "mid" | "big";
  };
}

/**
 * Define the routers for the app
 */

export type TClockRouter = defineRouter<
  { time: defineQueryProcedure<void, Date> },
  // Typecheck will fail if all the routers don't have the same setup
  TTrpcSetup
>;

export type TGreetRouter = defineRouter<
  {
    greet: defineQueryProcedure<string, { greeting: string }>;
    protectedGreet: defineQueryProcedure<
      string,
      { greeting: string; __secret: true }
    >;
  },
  TTrpcSetup
>;

/**
 * Define the top-level router
 */
export type TAppRouter = defineRouter<
  {
    // Supports nested routers
    greeter: TGreetRouter;
    clock: TClockRouter;
    // Supports "inline" procedures
    color: defineQueryProcedure<{ h: number; s: number; v: number }, string>;
  },
  TTrpcSetup
>;
