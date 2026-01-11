/**
 * This is a TypeScript module that allows for the implementation of [JSON-RPC].
 *
 * [deno]: https://deno.land/
 * [JSON-RPC]: https://www.jsonrpc.org/specification
 *
 * ## Usage
 *
 * ### Server
 *
 * ```typescript ignore
 * import { assert, is } from "@core/unknownutil";
 * import { Session } from "@warashi/jsonrpc";
 *
 * async function handleConnection(conn: Deno.Conn): Promise<void> {
 *   const session = new Session(conn.readable, conn.writable);
 *
 *   // Define APIs
 *   session.dispatcher = {
 *     sum(x, y) {
 *       assert(x, is.Number);
 *       assert(y, is.Number);
 *       return x + y;
 *     },
 *   };
 *
 *   // Start the session
 *   session.start();
 *
 *   // Do whatever
 *
 *   // Shutdown the session
 *   await session.shutdown();
 * }
 *
 * const listener = Deno.listen({ hostname: "localhost", port: 8080 });
 * for await (const conn of listener) {
 *   handleConnection(conn).catch((err) => console.error(err));
 * }
 * ```
 *
 * ### Client
 *
 * ```typescript ignore
 * import { Client, Session } from "@warashi/jsonrpc";
 *
 * const conn = await Deno.connect({ hostname: "localhost", port: 8080 });
 * const session = new Session(conn.readable, conn.writable);
 * const client = new Client(session);
 *
 * // Start the session
 * session.start();
 *
 * // Do whatever
 * console.log(await client.call("sum", 1, 2)); // 3
 * console.log(await client.call("sum", 2, 3)); // 5
 *
 * // Shutdown the session
 * await session.shutdown();
 * ```
 *
 * This module supports bidirectional communication. Therefore, APIs defined on
 * the client side can be called from the server side.
 *
 * @module
 */
export * from "./client.ts";
export * from "./dispatcher.ts";
export * from "./message.ts";
export * from "./session.ts";
