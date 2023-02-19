import {
  inferRouterContext,
  inferRouterMeta,
  initTRPC,
  TRPCError,
} from "@trpc/server";
import http from "http";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { TGreetRouter, TClockRouter, TAppRouter } from "./interface";
import { z } from "zod";

const t = initTRPC
  .context<inferRouterContext<TAppRouter>>()
  .meta<inferRouterMeta<TAppRouter>>()
  .create({
    errorFormatter({ shape, error }) {
      const howMad: "mid" | "big" =
        error.code === "UNAUTHORIZED" ? "big" : "mid";

      return {
        ...shape,
        data: {
          ...shape.data,
          howMad,
        },
      };
    },
  });

const isAuthedMiddleware = t.middleware(async ({ meta, next, ctx }) => {
  if (meta?.hasAuth && !ctx.userName) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

const authProcedure = t.procedure.use(isAuthedMiddleware);

export const clockRouter = t.router({
  time: authProcedure.query(() => {
    return new Date();
  }),
}) satisfies TClockRouter;

const greetInput = z.string();
const greetOutput = z.object({ greeting: z.string() });

const greetRouter = t.router({
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
    .query(({ input }) => {
      return {
        __secret: true,
        greeting: `🕵🏾 shhh ${input}`,
      };
    }),
}) satisfies TGreetRouter;

const appRouter = t.router({
  greeter: greetRouter,
  clock: clockRouter,
  color: authProcedure
    .input(z.object({ h: z.number(), s: z.number(), v: z.number() }))
    .output(z.string())
    .query(({ input }) => {
      return `hsv(${input.h}, ${input.s}%, ${input.v}%)`;
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
