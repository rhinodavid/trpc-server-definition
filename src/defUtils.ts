import {
  AnyProcedure,
  AnyRootConfig,
  BuildProcedure,
  RootConfig,
  DefaultDataTransformer,
  TRPCError,
  ProcedureType,
} from "@trpc/server";
import { RouterDef } from "@trpc/server/dist/core/router";
import { DefaultErrorData } from "@trpc/server/dist/error/formatter";
import {
  TRPCErrorShape,
  TRPC_ERROR_CODE_KEY,
  TRPC_ERROR_CODE_NUMBER,
} from "@trpc/server/rpc";

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
  Meta extends object = {},
  ErrorData extends DefaultErrorData = {
    code: TRPC_ERROR_CODE_KEY;
    httpStatus: number;
    path: undefined;
    stack: undefined;
  }
> = {
  _def: RouterDef<
    RootConfig<{
      ctx: Context;
      meta: Meta;
      errorShape: TRPCErrorShape<TRPC_ERROR_CODE_NUMBER, ErrorData>;
      transformer: DefaultDataTransformer;
    }>,
    Procedures
  >;
  createCaller: any;
  getErrorShape: (opts: {
    error: TRPCError;
    type: ProcedureType | "unknown";
    path: string | undefined;
    input: unknown;
    ctx: Context | undefined;
  }) => TRPCErrorShape<TRPC_ERROR_CODE_NUMBER, ErrorData>;
};
