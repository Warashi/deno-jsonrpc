# jsonrpc

[![JSR](https://jsr.io/badges/@warashi/jsonrpc)](https://jsr.io/@warashi/jsonrpc)
[![Test](https://github.com/Warashi/deno-jsonrpc/workflows/Test/badge.svg)](https://github.com/Warashi/deno-jsonrpc/actions?query=workflow%3ATest)

This is a TypeScript module that allows for the implementation of [JSON-RPC 2.0].
This implementation is fork of [lambdalisue/deno-messagepack-rpc].

[deno]: https://deno.land/
[JSON-RPC 2.0]: https://www.jsonrpc.org/specification
[lambdalisue/deno-messagepack-rpc]: https://github.com/lambdalisue/deno-messagepack-rpc

## Usage

### Server

```typescript ignore
import { assert, is } from "@core/unknownutil";
import { Session } from "@warashi/jsonrpc";

async function handleConnection(conn: Deno.Conn): Promise<void> {
  const session = new Session(conn.readable, conn.writable);

  // Define APIs
  session.dispatcher = {
    sum(x, y) {
      assert(x, is.Number);
      assert(y, is.Number);
      return x + y;
    },
  };

  // Start the session
  session.start();

  // Do whatever

  // Shutdown the session
  await session.shutdown();
}

const listener = Deno.listen({ hostname: "localhost", port: 8080 });
for await (const conn of listener) {
  handleConnection(conn).catch((err) => console.error(err));
}
```

### Client

```typescript ignore
import { Client, Session } from "@warashi/jsonrpc";

const conn = await Deno.connect({ hostname: "localhost", port: 8080 });
const session = new Session(conn.readable, conn.writable);
const client = new Client(session);

// Start the session
session.start();

// Do whatever
console.log(await client.call("sum", 1, 2)); // 3
console.log(await client.call("sum", 2, 3)); // 5

// Shutdown the session
await session.shutdown();
```

This module supports bidirectional communication.
Therefore, APIs defined on the client side can be called from the server side.

## License

The code is released under the MIT license, which is included in the
[LICENSE](./LICENSE) file. By contributing to this repository, contributors
agree to follow the license for any modifications made.
