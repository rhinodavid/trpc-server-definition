import { client } from "./client";
import { inspect } from "node:util";

async function main() {
  const result = await client.greet.query("world");
  console.log(inspect(result));

  const protectedResult = await client.protectedGreet.query("protected world");
  console.log(inspect(protectedResult));
}

main();
