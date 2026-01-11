import { assertEquals } from "@std/assert";
import {
  buildNotificationMessage,
  buildRequestMessage,
  buildResponseMessage,
  isMessage,
} from "./message.ts";

Deno.test("buildRequestMessage", () => {
  assertEquals(
    buildRequestMessage(1, "sum", [1, 2]),
    { jsonrpc: "2.0", id: 1, method: "sum", params: [1, 2] },
  );
});

Deno.test("buildResponseMessage", async (t) => {
  await t.step("with result", () => {
    assertEquals(
      buildResponseMessage(1, null, 3),
      { jsonrpc: "2.0", id: 1, result: 3 },
    );
  });

  await t.step("with error", () => {
    const error = new Error("error");
    assertEquals(
      buildResponseMessage(1, error, null),
      { jsonrpc: "2.0", id: 1, error },
    );
  });
});

Deno.test("buildNotificationMessage", () => {
  assertEquals(
    buildNotificationMessage("sum", [1, 2]),
    { jsonrpc: "2.0", method: "sum", params: [1, 2] },
  );
});

Deno.test("isMessage", async (t) => {
  await t.step("with RequestMessage", () => {
    assertEquals(
      isMessage({ jsonrpc: "2.0", id: 1, method: "sum", params: [1, 2] }),
      true,
    );
  });

  await t.step("with ResponseMessage", () => {
    assertEquals(
      isMessage({ jsonrpc: "2.0", id: 1, result: 3 }),
      true,
    );
  });

  await t.step("with NotificationMessage", () => {
    assertEquals(
      isMessage({ jsonrpc: "2.0", method: "sum", params: [1, 2] }),
      true,
    );
  });

  await t.step("with invalid message", () => {
    assertEquals(
      isMessage("invalid message"),
      false,
    );
  });

  await t.step("with invalid message", () => {
    assertEquals(
      isMessage({ jsonrpc: "2.0", id: 1, result: 3, error: "oops" }),
      false,
    );
  });
});
