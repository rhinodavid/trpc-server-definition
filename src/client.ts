import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { TAppRouter } from "./interface";

export const client = createTRPCProxyClient<TAppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
    }),
  ],
});
