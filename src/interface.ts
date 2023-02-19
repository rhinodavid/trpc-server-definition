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

export type TAppRouter = defineRouter<
  {
    greet: defineQueryProcedure<string, { greeting: string }>;
    protectedGreet: defineQueryProcedure<string, { greeting: string }>;
  },
  TContext,
  TMeta
>;
