# Independent trpc router definition

## Problem

My company is planning to implement trpc as our service-to-service
communication solution.

We're trying to decide on how to organize trpc code in our
Turborepo-powered monorepo.

Currently, it looks like the only way to organize the code is to put the
server in one workspace and the client in another workspace, where the
client depends on the server since the server defines `TAppRouter`.

```
+----------------+               +---------------+
|                |   imports     |               |
|  trpc server   |               |  trpc client  |
|                |  <----------  |               |
|      app       |               |      app      |
+----------------+               +---------------+
```

However, we don't want our "apps" to depend on each other.

## Goal

What we'd like to do is to be able to define the server interface
in one workspace and have the server implementation and the client
depend on that definition. This is similar to how gRPC and others
work:

```
             +--------------+
             |              |
             | trpc server  |
             |  interface   |
          +> |              | <---+
          |  +--------------+     |
          |                       |
          |                       |
+---------+----+      +-----------+--+
|              |      |              |
| trpc server  |      | trpc client  |
|implementation|      |     app      |
|              |      |              |
+--------------+      +--------------+
```

## Solution/proposal

I'd like to propose adding utilities to trpc to define a router
independent of its implementation. This will solve our problem, but could
have other benefits as well. For instance, one could publish the interface
to an npm package while keeping the server implementation source closed.

`src/defUtils.ts` contains a proof-of-concept of the definition utilities.

`src/interface.ts` demonstrates how to use the definition utilities to define a router.

Of note, this is a great use case for the
[`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
operator, new in TypeScript 4.9, to not lose any specificity of the router type in the
implementation.
