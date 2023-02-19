import {
  AnyRootConfig,
  BuildProcedure,
  RootConfig,
  DefaultDataTransformer,
  TRPCError,
  ProcedureType,
} from "@trpc/server";
import { UnsetMarker } from "@trpc/server/dist/core/internals/utils";
import { RouterDef } from "@trpc/server/dist/core/router";
import { DefaultErrorData } from "@trpc/server/dist/error/formatter";
import { TRPCErrorShape, TRPC_ERROR_CODE_NUMBER } from "@trpc/server/rpc";
import { ProcedureRouterRecord } from "@trpc/server/src";

/**
 * This file has utilities to define a router type without
 * definining its implementation.
 *
 * This would become part of the trpc library.
 */

/**
 * This doesn't specify input_out and output_in,
 * but that's fine because the compiler will make sure
 * the "internal" types are consistent.
 */
export type defineQueryProcedure<TInput, TOutput> = BuildProcedure<
  "query",
  {
    _config: AnyRootConfig;
    _meta: any;
    _ctx_out: any;
    _input_in: TInput extends void ? UnsetMarker : TInput;
    _input_out: any;
    _output_in: any;
    _output_out: any;
  },
  TOutput
>;

// TODO: Add mutation and subscription procedures

export interface RpcSetup<TErrorData extends DefaultErrorData> {
  ctx?: object;
  meta?: object;
  errorData?: TErrorData;
}

type inferErrorData<TRpcSetup extends RpcSetup<any>> =
  TRpcSetup["errorData"] extends infer TErrorData
    ? TErrorData extends DefaultErrorData
      ? TErrorData
      : DefaultErrorData
    : DefaultErrorData;

/**
 * Define a router by specifying its procedures and
 * RPC setup.
 */
export type defineRouter<
  TProcedures extends ProcedureRouterRecord,
  // TODO: make this optional
  TTrpcSetup extends RpcSetup<any>
> = {
  _def: RouterDef<
    RootConfig<{
      ctx: TTrpcSetup extends { ctx: infer TCtx } ? TCtx : any;
      meta: TTrpcSetup extends { meta: infer TMeta } ? TMeta : any;
      errorShape: TRPCErrorShape<
        TRPC_ERROR_CODE_NUMBER,
        inferErrorData<TTrpcSetup>
      >;
      transformer: DefaultDataTransformer;
    }>,
    TProcedures
  >;
  createCaller: any;
  getErrorShape: (opts: {
    error: TRPCError;
    type: ProcedureType | "unknown";
    path: string | undefined;
    input: unknown;
    ctx: undefined | TTrpcSetup extends { ctx: infer TCtx } ? TCtx : undefined;
  }) => TRPCErrorShape<TRPC_ERROR_CODE_NUMBER, inferErrorData<TTrpcSetup>>;
};
