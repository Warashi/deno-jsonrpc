import { is } from "@core/unknownutil";

/**
 * Request message
 */
export type RequestMessage = {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown[];
};

/**
 * Response message
 */
export type ResponseMessage =
  | {
    jsonrpc: "2.0";
    id: number;
    result: unknown;
  }
  | {
    jsonrpc: "2.0";
    id: number;
    error: unknown;
  };

/**
 * Notification message
 */
export type NotificationMessage = {
  jsonrpc: "2.0";
  method: string;
  params?: unknown[];
};

/**
 * Message
 */
export type Message = RequestMessage | ResponseMessage | NotificationMessage;

export function buildRequestMessage(
  msgid: number,
  method: string,
  params: unknown[],
): RequestMessage {
  return { jsonrpc: "2.0", id: msgid, method, params };
}

export function buildResponseMessage(
  msgid: number,
  error: null | unknown,
  result: null | unknown,
): ResponseMessage {
  if (error === null) {
    return { jsonrpc: "2.0", id: msgid, result };
  }
  return { jsonrpc: "2.0", id: msgid, error };
}

export function buildNotificationMessage(
  method: string,
  params: unknown[],
): NotificationMessage {
  return { jsonrpc: "2.0", method, params };
}

/**
 * Checks if the given value is a message.
 *
 * @param message The value to check.
 * @returns `true` if the given value is a message, otherwise `false`.
 */
export function isMessage(message: unknown): message is Message {
  if (!is.Record(message)) {
    return false;
  }
  if (message.jsonrpc !== "2.0") {
    return false;
  }
  const hasMethod = "method" in message;
  const hasId = "id" in message;
  const hasResult = "result" in message;
  const hasError = "error" in message;
  if (hasMethod) {
    if (!is.String(message.method)) {
      return false;
    }
    if ("params" in message && !is.Array(message.params)) {
      return false;
    }
    if (hasId) {
      return is.Number(message.id);
    }
    return !hasResult && !hasError;
  }
  if (!hasId || !is.Number(message.id)) {
    return false;
  }
  if (hasResult === hasError) {
    return false;
  }
  return true;
}
