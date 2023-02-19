import {
  AnyProcedure,
  AnyRootConfig,
  BuildProcedure,
  RootConfig,
  DefaultDataTransformer,
  DefaultErrorShape,
} from "@trpc/server";
import { RouterDef } from "@trpc/server/dist/core/router";

/**
 * This file has utilities to define a router type without
 * definining its implementation.
 *
 * This would become part of the trpc library.
 */

/**
 * Define a query procedure by specifying its input and output types.
 */
export type defineQueryProcedure<TInput, TOutput> = BuildProcedure<
  "query",
  {
    _config: AnyRootConfig;
    _meta: any;
    _ctx_out: any;
    _input_in: TInput;
    _input_out: any;
    _output_in: any;
    _output_out: any;
  },
  TOutput
>;

// TODO: Add mutation and subscription procedures

/**
 * Define a router by specifying its procedures and context and meta types.
 */
export type defineRouter<
  Procedures extends Record<string, AnyProcedure>,
  Context extends object = {},
  Meta extends object = {}
> = {
  _def: RouterDef<
    RootConfig<{
      ctx: Context;
      meta: Meta;
      errorShape: DefaultErrorShape;
      transformer: DefaultDataTransformer;
    }>,
    Procedures
  >;
  createCaller: any;
  getErrorShape: any;
};
