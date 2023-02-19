import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { TAppRouter } from "./interface";

export const client = createTRPCProxyClient<TAppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
    }),
  ],
});

async function main() {
  const greeting = await client.greeter.greet.query("d-money");
  const date = await client.clock.time.query();
  const hsv = await client.color.query({ h: 100, s: 100, v: 100 });

  console.log({ greeting, date, hsv });
}

main();
