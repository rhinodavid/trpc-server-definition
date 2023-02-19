import { initTRPC, TRPCError } from "@trpc/server";
import http from "http";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { TAppRouter } from "./interface";
import { z } from "zod";
import { inferContext, inferMeta } from "./defUtils";

const t = initTRPC
  .context<inferContext<TAppRouter>>()
  .meta<inferMeta<TAppRouter>>()
  .create();

const isAuthedMiddleware = t.middleware(async ({ meta, next, ctx }) => {
  if (meta?.hasAuth && !ctx.userName) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

const authProcedure = t.procedure.use(isAuthedMiddleware);

const greetInput = z.string();
const greetOutput = z.object({ greeting: z.string() });

const appRouter = t.router({
  greet: authProcedure
    .meta({ hasAuth: false })
    .input(greetInput)
    .output(greetOutput)
    .query(({ input }) => {
      return {
        greeting: `hello, ${input}`,
      };
    }),
  protectedGreet: authProcedure
    .meta({ hasAuth: true })
    .input(greetInput)
    .output(greetOutput)
    .query(({ input }) => {
      return {
        greeting: `🕵🏾 shhh ${input}`,
      };
    }),
}) satisfies TAppRouter;

const createContext = async (opts: { req: http.IncomingMessage }) => {
  return {
    userName: "John Doe",
    httpVersion: opts.req.httpVersion,
  };
};

createHTTPServer({
  router: appRouter,
  createContext,
}).listen(2022);